const express = require('express');
const RideRequest = require('../../module/externals/riderequest');
const route = express.Router();
const verify = require('../../validation/sherable/verifyToken');


// Get one
// --------------------------------------------------
route.get("/:id", getRideRequest, async (req, res) => {

    try {
        res.send(res.client);
    } catch (err) {
        return res.send({
            status: 'Failed',
            message: 'RideRequest not found.',
            details: err
        });
    }

});

// Post one
// --------------------------------------------------
route.post("/", async (req, res) => {
    try {


        const newRideRequest = new RideRequest({
            distance: req.body.distance,
            pickupAddress: req.body.pickupAddress,
            hotelId: req.body.hotelId,
            status: false,
            driverId: null,
            price: req.body.price,
            clientId: req.body.clientId,
            createdAt: new Date(),
            updatedAt: null,
        });

        await RideRequest.create(newRideRequest)
            .then(() => {
                return res.status(201).send({
                    status: 'Success',
                    message: 'RideRequest has been created'
                });
            })
            .catch((err) => {
                return res.status(400).send({
                    status: 'Failed',
                    message: err
                });
            });
    } catch (err) {
        return res.status(400).send({
            status: 'Failed',
            message: err
        });
    }
});

// Updating one
// --------------------------------------------------
route.patch('/:id', getRideRequest, async (req, res) => {


    if (req.body.price != null) {
        res.client.price = req.body.price;
    }

    if (req.body.status != null) {
        res.client.status = req.body.status;
    }

    if (req.body.driverId != null) {
        res.client.driverId = req.body.driverId;
    }


    res.client.updatedAt = new Date();

    try {
        const updateUser = await res.client.save();
        res.send({
            status: 'Success',
            message: 'Updated is successful.',
            details: updateUser
        })

    } catch (err) {
        res.status(400).send({
            status: 'Failed',
            message: 'Request is unsuccessful',
            details: err + '.'
        })
    }

});

//functions 
async function getRideRequest(req, res, next) {
    let client;
    try {
        client = await RideRequest.findById(req.params.id);
        if (client != null) {
            return res.status(404).send({
                status: 'Failed',
                message: 'Request is unsuccessful'
            })
        }

    } catch (err) {
        return res.status(500).send({
            status: 'Failed',
            message: 'Invalid request',
            details: err + '.'
        });
    }

    res.client = client;

    next();

}

module.exports = route;