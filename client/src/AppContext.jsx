import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios"
import userData from "../../server/Controllers/userController";

const AppContext= createContext(null);

export const useAppContext=()=>useContext(AppContext)



export const AppContextProvider=(props)=>{
    const backendUrl=import.meta.env.VITE_BACKEND_URL;
    
    const [isLoggedIn,setIsLoggedIn]=useState(false);
    const [user,setUser]=useState(false)

    useEffect(()=>{
    userData()
},[])
    const userData=async()=>{
        try {
            const {data}=await axios.get(`${backendUrl}/api/auth/is-authenticated`,{withCredentials: true})
            if(data.success){
                setIsLoggedIn(true)
                getUserData()
            }else{
                setIsLoggedIn(false)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const getUserData=async()=>{
       try {
         const userData=await axios.get(`${backendUrl}/api/user/data`,{withCredentials:true});
        setUser(userData.data)
       } catch (error) {
        console.log("userData error",error.message)
       }
    }

    return <AppContext.Provider value={{getUserData,backendUrl,isLoggedIn,setIsLoggedIn,user, userData,setUser}}>
        {props.children}
    </AppContext.Provider>
}