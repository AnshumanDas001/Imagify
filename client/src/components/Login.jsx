import React, { useEffect } from 'react'
import { assets } from '../assets/assets'
import { useState } from 'react'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { motion } from 'framer-motion'
import axios from 'axios'
import { ToastContainer,toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
const Login = () => {
  const [state,setState]=useState('Login')
  const {setShowLogin,backendUrl,setToken,setUser}=useContext(AppContext)
  const [name,setName]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
 
  const onSubmitHandler=async (e)=>{
    e.preventDefault();
    try{
        if(state==='Login'){
            const {data} = await axios.post(backendUrl+'/api/user/login',{email,password})
            if(data.success){
                localStorage.setItem('token',data.token)
                setToken(data.token)
                setUser(data.user)
                setShowLogin(false)
                toast.success(data.message)
            }
            else{
                toast.error(data.message)
            }
        }
        else{
            const {data} = await axios.post(backendUrl+'/api/user/register',{name,email,password})
            if(data.success){
                localStorage.setItem('token',data.token)
                setToken(data.token)
                setUser(data.user)
                setShowLogin(false)
                toast.success(data.message)
            }
            else{
                toast.error(data.message)
            }
        }
    }
    catch(err){
        toast.error(err.message || 'Login failed. Please try again.')
      console.log(err)
    }
}

  useEffect(()=>{
    document.body.style.overflow='hidden'
    return () => {
        document.body.style.overflow='unset';
  }
},[])
  return (
    <div className='fixed top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center'>
        <motion.form 
        onSubmit={onSubmitHandler}
        initial={{opacity:0.2, y:50}}
        transition={{duration:0.3}}
        whileInView={{opacity:1, y:0}}
        viewport={{once:true}}
        className='relative bg-white p-10 rounded-xl text-slate-500'>
            <h1 className='text-center text-2xl text-neutral-700 font-medium'>{state}</h1>
            <p className='text-sm'>Welcome back! Please sign in to continue</p>
            {state!=='Login'&&<div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
                <img src={assets.profile_icon} alt="" className='w-5'/> 
                <input onChange={e=>setName(e.target.value)} value={name} type="text" placeholder='Full Name' className='outline-none text-sm'  required />
            </div> }   
            <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
                <img src={assets.email_icon} alt="" /> 
                <input type="email" onChange={e=>setEmail(e.target.value)} value={email} placeholder='Email ID' className='outline-none text-sm'  required />
            </div>
            <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
                <img src={assets.lock_icon} alt="" /> 
                <input onChange={e=>setPassword(e.target.value)} value={password} type="password" placeholder='Password' className='outline-none text-sm'  required />
            </div>
            <p className='text-sm m-2 text-blue-600 cursor-pointer'>Forgot password?</p>
            <button className='bg-blue-600 w-full text-white py-2 rounded-full'>{state==='Login'?'Login':'Create Account'}</button>
            {state==='Login'?
            <p className='mt-5 text-center'>Don't hava an account?
                <span className='text-blue-600 cursor-pointer' onClick={()=>setState('Sign Up')}>Sign up</span>
            </p>:<p className='mt-5 text-center'>Already have an account?
                <span className='text-blue-600 cursor-pointer' onClick={()=>setState('Login')}>Login</span>
            </p>}    
            <img src={assets.cross_icon} alt="" className='absolute top-5 right-5 cursor-pointer' onClick={()=>setShowLogin(false)}/>
        </motion.form> 
    </div>
  )
}

export default Login
