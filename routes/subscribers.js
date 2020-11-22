const { response } = require('express')
const express = require('express')
const subscriber = require('../models/subscriber')
const router = express.Router()
const Subscriber = require('../models/subscriber')


//-- Get all subscribers
router.get('/', async (req, res) => {
    try {
        const subscribers = await Subscriber.find()
        res.json(subscribers)
    }catch (error){
        res.status(500).json({error: {message: error.message}})
    }
})

//-- Get one subscriber
router.get('/:id', getSubscriber, (req, res) => {
    res.json(res.subscriber)
})

//-- Create subscriber
router.post('/', async (req, res) => {
    const subscriber = new Subscriber({
        name: req.body.name,
        subscribedToChannel: req.body.subscribedToChannel
    })

    try {
        const newSubscriber = await subscriber.save()
        res.status(201).json(newSubscriber)
    } catch (error) {
        res.status(400).json({error: {message: error.message}})
    }
})

//-- Update subscriber
router.patch('/:id', getSubscriber, async (req, res) => {
    if (req.body.name != null) {
        res.subscriber.name = req.body.name
    }
    if (req.body.subscribedToChannel != null) {
        res.subscriber.subscribedToChannel = req.body.subscribedToChannel
    }

    try {
        const updatedSubscriber = await res.subscriber.save()
        res.json(updatedSubscriber)
    } catch (error) {
        response.status(400).json({error: {message: error.message}})
    }
})

//-- Delete subscriber
router.delete('/:id', getSubscriber, async (req, res) => {
    try {
        await res.subscriber.remove()
        res.json({message: 'Subscriber Deleted'})
    } catch (error) {
        res.status(500).json({error: {message: error.message}})
    }
})

//-- Get the subscriber from db
async function getSubscriber(req, res, next) {
    let subscriber
    try{
        subscriber = await Subscriber.findById(req.params.id)
        if (subscriber == null) {
            return res.status(404).json({error: {message: 'Subscriber not found'}})
        }
    } catch (error) {
        return res.status(500).json({error: {message: error.message}})
    }

    res.subscriber = subscriber
    next()
}

module.exports = router