/* eslint-disable react/no-unescaped-entities */
import './login.css'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login } from '../../redux/reducers/authReducer'

import { mainApi } from '../../api/mainApi'
import * as apiEndpoints from '../../api/apiEndpoints'

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const { register, formState: { errors }, setError, handleSubmit } = useForm();

    const onSubmit = async (data) => {
        try {
            const result = await mainApi.post(
                apiEndpoints.LOGIN,
                apiEndpoints.getLoginBody(data.email, data.password)
            );

            handleLogin(result.data.jsonWebToken);
        } catch (error) {
            const errorMessage = error.response.data.error;

            if (errorMessage === "Invalid credentials") {
                setError("email", { message: "Account doesn't exist" });
            } else if (errorMessage === "Incorrect password") {
                setError("password", { message: "Incorrect password" });
            }
        }
    }

    const handleLogin = async (token) => {
        try {
            const user = await mainApi.get(
                apiEndpoints.GET_CURRENT_USER,
                apiEndpoints.getAccessToken(token)
            );
            const expiredDate = new Date();
            expiredDate.setDate(expiredDate.getDate() + 3);

            let ava = "https://img.freepik.com/free-icon/user_318-159711.jpg";
            if (user.data.data.userAvatar) {
                const temp = await mainApi.get(
                    apiEndpoints.PREVIEW_ATTACHMENT(user.data.data.userAvatar)
                );

                ava = temp.data.attachmentURL;
            }

            const currentUser = {
                token: token,
                id: user.data.data._id,
                firstName: user.data.data.userFirstName,
                lastName: user.data.data.userLastName,
                email: user.data.data.userEmail,
                gender: user.data.data.userGender,
                avatar: ava,
                expiredDate: expiredDate
            }

            dispatch(login(currentUser));
            localStorage.setItem("currentUser", JSON.stringify(currentUser));
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="login-container">
            <div className="login-form">
                <div className="login-header">
                    <img alt="logo" src="/befriends_logo.png" className="login-logo" />
                </div>
                <div className="login-input-form">
                    <form className="flex flex-col justify-center items-start" onSubmit={handleSubmit(onSubmit)}>
                        <input type="email" className="log-input focus-visible:outline-none" placeholder="Email" {...register("email", { required: "Please provide your email" })} />
                        <p className="text-red-500 text-base mb-4">{errors.email?.message}</p>
                        
                        <div className="flex justify-between items-center log-input">
                            <input type={showPassword ? "text" : "password"} className="border-0 mr-2 focus-visible:outline-none" placeholder="Password" {...register("password", { required: "Please provide your password", minLength: { value: 6, message: "Password must have at least 6 characters" } })} />
                            {showPassword ? 
                                <svg onClick={() => setShowPassword(false)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.3} stroke="#bfac00" className="w-5 h-5 hover:cursor-pointer">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                </svg>
                                :
                                <svg onClick={() => setShowPassword(true)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.3} stroke="#bfac00" className="w-5 h-5 hover:cursor-pointer">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            }
                        </div>
                        <p className="text-red-500 text-base mb-4">{errors.password?.message}</p>

                        <button type="submit" className="w-full login-button mb-4">LOGIN</button>
                    </form>
                    <div className="flex justify-center w-full whitespace-nowrap">
                        <p className="mr-2">Don't have an account ?</p>
                        <a className="cursor-pointer text-black font-bold" href="/register">Register</a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;