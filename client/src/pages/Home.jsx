import React from 'react'
import Header from '../components/Header'
import Steps from '../components/Steps'
import Description from '../components/description'
import Testimonials from '../components/Testimonials'
import Generatebtn from '../components/Generatebtn'

const Home = () => {
  return (
    <div>
      <Header></Header>
      <Steps></Steps>
      <Description></Description>
      <Testimonials></Testimonials>
      <Generatebtn></Generatebtn>
    </div>
  )
}

export default Home
