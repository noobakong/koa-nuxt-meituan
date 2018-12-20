import mongoose from 'mongoose'
const Schema = mongoose.Schema
const CityScheam = new Schema({
  city: {
    type: String
  }
})

export default mongoose.model('City', CityScheam)
