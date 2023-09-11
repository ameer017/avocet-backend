const asyncHandler = require("express-async-handler");
const Plastic = require("../models/plasticModel");
const User = require("../models/userModel");
const { hashToken } = require("../utils");
const axios = require('axios');
const sendEmailToCollector = require("../utils/sendEmailToCollector");
const Token = require("../models/tokenModel");

// create order
const createOrder = asyncHandler(async (req, res) => {
  const { user, type, weight, address, amount, phone, sellerEmail, account_num, bank } = req.body

  // validation
  if(!type || !phone ) {
    res.status(400);
    throw new Error("Please, fill in all the required fields")
  }

  // check if order exists
  const orderExists = await Plastic.findById( user );

  if(orderExists) {
    res.status(400);
    throw new Error("Order already exists")
  }

  // create new order
  const plastic = await Plastic.create({
    type, weight, address, amount, phone, sellerEmail, account_num, bank
  })

  if (plastic) {
    const { type, weight, address, amount, phone, sellerEmail, status, account_num, bank, user } = plastic;

    const collectors = await User.find({ role: 'Collector' });

    if (!collectors) {
      return res.status(404).json({ message: 'No collectors found' });
    }
  
    // Extract relevant information for each collector
    const collectorInfo = collectors.map(collector => ({
      email: collector.email
    }));
  
    const selectedCollectorId = req.body.selectedCollectorId;
  
    const selectedCollector = collectorInfo.find(collector => collector.id === selectedCollectorId);
  
    if (!selectedCollector) {
      return res.status(404).json({ message: 'Selected collector not found' });
    }
  
    await sendEmailToCollector(
        selectedCollector.email, 
        type,
        weight,
        address,
        amount,
        phone,
        status, 
        account_num, 
        bank,
        sellerEmail,
        user
      );
     
    
    res.status(201).json({
      type, weight, address, amount, phone, status, sellerEmail, account_num, bank, user
    });

  } else {
    res.status(400);
    throw new Error("Invalid order data");
  }

})

// Helper function to get coordinates from Mapbox
const getCoordinatesForAddress = async (address) => {
  try {
    const accessToken = 'pk.eyJ1IjoiYW1lZXI5OCIsImEiOiJjbGt3ejJ4NWMweDRzM3FyejQ1ZzQ1YXdwIn0.60aKaagj3vdxqW2Q5pqATA';

    const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${accessToken}`);

    if (response.data && response.data.features && response.data.features.length > 0) {
      const [longitude, latitude] = response.data.features[0].center;
      return { latitude, longitude };
    } else {
      throw new Error('No coordinates found for the address.');
    }
  } catch (error) {
    throw new Error('Error getting coordinates for address: ' + error.message);
  }
};


const findNearestCollector = async (sellerAddress) => {
  try {
    // Step 1: Get coordinates of the seller's address using Mapbox
    const sellerCoordinates = await getCoordinatesForAddress(sellerAddress);

    // Fetch all collectors' addresses and coordinates from the database
    const collectors = await User.find({ role: 'Collector' });

    // Calculate the distances between the seller and each collector
    const distances = await Promise.all(collectors.map(async (collector) => {
      const collectorCoordinates = await getCoordinatesForAddress(collector.address);
      const distance = calculateDistance(sellerCoordinates, collectorCoordinates);
      return { collector, distance };
    }));

    // Sort distances in ascending order to find the nearest collector
    distances.sort((a, b) => a.distance - b.distance);

    // Return the nearest collector's details including address and email
    return distances[0].collector;
  } catch (error) {
    throw new Error('Error finding nearest collector: ' + error.message);
  }
};


const calculateDistance = (coord1, coord2) => {
  const R = 6371; // Earth's radius in km
  const dLat = degToRad(coord2.latitude - coord1.latitude);
  const dLon = degToRad(coord2.longitude - coord1.longitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degToRad(coord1.latitude)) * Math.cos(degToRad(coord2.latitude)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};

const degToRad = (degrees) => {
  return degrees * (Math.PI / 180);
};


// get order
const getOrder = asyncHandler(async (req, res) => {
    const plastic = await Plastic.findOne(req.params.name);
  
    if (plastic) {
      const { _id, name, phone, type, amount, status, weight, sellerEmail, account_num, bank } = plastic;
  
      res.status(200).json({
        _id,
        name,
        phone,
        type,
        weight,
        amount,
        status,
        sellerEmail, 
        account_num, 
        bank, 
      });
    } else {
      res.status(404);
      throw new Error("Order not found, please try again.");
    }
  });   

// Delete order
const deleteOrder = asyncHandler(async (req, res) => {
    const plastic = Plastic.findById(req.params.id);
  
    if (!plastic) {
      res.status(404);
      throw new Error("Order not found");
    }
  
    await plastic.deleteOne();
    res.status(200).json({
      message: "Order deleted successfully",
    });
  }); 

  // get orders
const getOrders = asyncHandler(async (req, res) => {
    const plastics = await Plastic.find().sort('-createdAt')
    

    if (!plastics) {
        res.status(500);
        throw new Error("Something went wrong");
      }
      res.status(200).json(plastics);
  });

//   upgrade order
const upgradeOrder = asyncHandler(async (req, res) => {
  const { status, id } = req.body;

  const plastic = await Plastic.findById(id);

  if (!plastic) {
    res.status(404);
    throw new Error("Order not found");
  }

  plastic.status = status;
  await plastic.save();

  res.status(200).json({
    message: `Order updated to ${status} and flagged for payment`,
  });
});


  // Update Order
const updateOrder = asyncHandler(async (req, res) => {
    const plastic = await Plastic.findOne(req.params.name);
  
    if (plastic) {
      const { name, type, weight, phone, status, account_num, bank, isConfirmed} = plastic;
  
      plastic.type = req.body.type || type;
      plastic.name = req.body.name || name;
      plastic.phone = req.body.phone || phone;
      plastic.weight = req.body.weight || weight;
  
      const updatedOrder = await plastic.save();
  
      res.status(200).json({
        _id: updatedOrder._id,
        user: updatedOrder.user,
        name: updatedOrder.name,
        phone: updatedOrder.phone,
        type: updatedOrder.type,
        weight: updatedOrder.weight,
        status: updatedOrder.status,
        account_num: updatedOrder.account_num,
        bank: updatedOrder.bank,
        isConfirmed: updatedOrder.isConfirmed
      });
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  });

// confirm order
const confirmOrder = asyncHandler(async(req, res) => {
  const plastic = await Plastic.findById(req.plastic._id)

  const verificationToken = crypto.randomBytes(32).toString('hex') + plastic._id;

    // Hash token and save
    const hashedToken = hashToken(verificationToken);
    await new Token({
      userId: plastic._id,
      vToken: hashedToken,
      createdAt: Date.now(),
      expiresAt: Date.now() + 60 * (60 * 1000), // 60mins
    }).save();

    const verificationUrl = `${process.env.FRONTEND_URL}/confirmOrder/${verificationToken}`

    // Send email to all users with role 'Collector'
    const collectors = await User.find({ role: 'Collector' });
    collectors.forEach((collector) => {
      sendEmailToCollector(collector.email, _id, address, type, phone, amount, weight, account_num, bank, verificationUrl);
    });

})

const sendOrderCreationEmail = asyncHandler(async(req, res) => {



})

module.exports = {
    createOrder,
    getOrder,
    getOrders,
    deleteOrder,
    upgradeOrder,
    updateOrder,
    confirmOrder,
    sendOrderCreationEmail
}