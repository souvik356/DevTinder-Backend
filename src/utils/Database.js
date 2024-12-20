const mongoose = require('mongoose')

const connectDb = async () => {
    await mongoose.connect('mongodb+srv://roysantanu729:eEOmGAUT1WGrtBv8@devtinder.hh3lq.mongodb.net/Devtinder2')
}

module.exports = { connectDb }