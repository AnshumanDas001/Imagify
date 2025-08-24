import { createContext,use,useEffect,useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
export const AppContext = createContext()
import { useNavigate } from "react-router-dom";

const AppContextProvider = (props)=>{
    const [user,setUser]=useState(null);
    const [showLogin,setShowLogin]=useState(false);
    const [token,setToken]=useState(localStorage.getItem('token'))
    const [credit,setCredit] = useState(0)
    const backendUrl=import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate()
    const loadCreditsData = async()=>{
        try{
            console.log('Loading credits with token:', token)
            const {data} = await axios.get(backendUrl+'/api/user/credits',{
                headers:{token}
            })
            console.log('Credits API response:', data)
            if(data.success){
                console.log('Setting credits to:', data.credits)
                setCredit(data.credits)
                setUser(data.user)
            } else {
                console.log('Credits API failed:', data.message)
            }
        }
        catch(err){
            console.log('Credits API error:', err)
            console.log('Error details:', err.response?.data)
            // Don't show error toast for credits - user is still logged in
        }
    }
    const generateImage = async(prompt)=>{
        try{
            const {data} = await axios.post(backendUrl+'/api/image/generate-image',{prompt},{headers:{token}} )
            if(data.success){
                loadCreditsData()
                return data.image
            }
            else{
                toast.error(data.message)
                loadCreditsData()
                if(data.creditBalance===0){
                    navigate('/buy')
                }
            }
        }
        catch(error){
            toast.error(error.message)
        }
    }
    const logout = () =>{
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
    }

    useEffect(()=>{
        if(token){
            loadCreditsData()
        } else {
            setUser(null)
            setCredit(0)
        }
    },[token])

    // Check for existing token on app load
    useEffect(()=>{
        const savedToken = localStorage.getItem('token')
        if(savedToken && !token){
            setToken(savedToken)
        }
    },[])

    const value = {
        user,setUser,showLogin,setShowLogin,backendUrl,token,setToken,credit,setCredit,loadCreditsData,logout,generateImage
    }
    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}
export default AppContextProvider