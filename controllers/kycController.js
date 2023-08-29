const asyncHandler = require("express-async-handler");
const Kyc = require("../models/kycModel");

const createKyc = asyncHandler(async(req, res) => {
    const {firstName,
        middleName,
        lastName,
        DOB,
        gender,
        stateOfOrigin,
        localGovt,
        VIN,
        photo
    } = req.body

    // validation
    if(!firstName || !middleName || !lastName || !DOB || !gender || !stateOfOrigin || !localGovt || !VIN || !photo) {
            res.status(400);
            throw Error('Please, fill in all the required fields.')
        }

        if (NIN.length < 11) {
            res.status(400);
            throw new Error("NIN must be up to 11 characters.");
        }

        // Check if NIN exists
        const ninExists = await Kyc.findOne({ VIN });

        if (ninExists) {
            res.status(400);
            throw new Error("VIN already in use.");
        }

        const kyc = await Kyc.create({
            firstName,
            middleName,
            lastName,
            DOB,
            gender,
            stateOfOrigin,
            localGovt,
            VIN,
            photo
        })

        if(kyc) {
            const{_id, 
                firstName,
                middleName,
                lastName,
                DOB,
                gender,
                stateOfOrigin,
                localGovt,
                VIN,
                photo
            } = kyc

            res.status(201).json({
                _id, 
                firstName,
                middleName,
                lastName,
                DOB,
                gender,
                stateOfOrigin,
                localGovt,
                VIN,
                photo
            })

        }else{
            res.status(400);
            throw new Error("Invalid kyc data")
        }
})

module.exports = createKyc