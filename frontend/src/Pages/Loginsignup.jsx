import React, { useState } from "react";
import './CSS/Loginsignup.css'

const Loginsignup =()=>{

    const [state,setState] = useState("Login");
    const [formData,setFormData] = useState({
        username:"",
        password:"",
        email:"",

    });

    const changeHandler = (e) =>{
        setFormData({...formData,[e.target.name]:e.target.value})

    }

    const login = async ()=>{
        console.log("login function executed",formData)
        let responseData;
        try {
            const response = await fetch('http://localhost:4000/login', {
                method: "POST",
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
    
            responseData = await response.json();
            console.log("Response data:", responseData);
    
            if (responseData.success) {
                localStorage.setItem('auth-token', responseData.token);
                window.location.replace("/");
            } else {
                alert(responseData.errors);
            }
        } catch (error) {
            console.error("Error during signup:", error);
        }

    }
    const signup = async () => {
        console.log("Signup function executed", formData);
        let responseData;
        try {
            const response = await fetch('http://localhost:4000/signup', {
                method: "POST",
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
    
            responseData = await response.json();
            console.log("Response data:", responseData);
    
            if (responseData.success) {
                localStorage.setItem('auth-token', responseData.token);
                window.location.replace("/");
            } else {
                alert(responseData.errors);
            }
        } catch (error) {
            console.error("Error during signup:", error);
        }
    };
    

    return(
        <div className="loginsignup">
            <div className="loginsignup-container">
                <h1>{state}</h1>
                <div className="loginsignup-fields">
                    {state==="Sign Up"?<input name="username" value={formData.username} onChange={changeHandler} type="text" placeholder="Your Name" />:<></>}
                    <input name="email" value={formData.email} onChange={changeHandler} type="email" placeholder="Email Address" />

                    <input name="password" value={formData.password} onChange={changeHandler} type="password" placeholder="Password" />
                  
                    <button onClick={()=>{state==="Login"?login():signup()}}>
                        Continue
                    </button>
                    {state==="Sign Up"?<p className="loginsignup-login">
                        Already Have an account ? <span onClick={()=>{setState("Login")}}>Login Here</span>
                    </p>:<p className="loginsignup-login">
                       Create an Account <span onClick={()=>{setState("Sign Up")}}>Click here</span>
                    </p>}
                    
                    
                    <div className="loginsignup-agree">
                        <input type="checkbox" name=" " id="" />
                        <p>By Continuing, i agree the terms of use & privacy policy</p>
                    </div>


                </div>
            </div>

        </div>
    )
}

export default Loginsignup