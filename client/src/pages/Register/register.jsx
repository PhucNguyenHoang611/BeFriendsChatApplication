/* eslint-disable react/no-unescaped-entities */
import './register.css'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login } from '../../redux/reducers/authReducer'

import { mainApi } from '../../api/mainApi'
import * as apiEndpoints from '../../api/apiEndpoints'

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showRePassword, setShowRePassword] = useState(false);
    const { register, formState: { errors }, setError, handleSubmit } = useForm();

    const onSubmit = async (data) => {
        try {
            if (data.password !== data.rePassword) {
                setError("rePassword", { message: "Incorrect re-password" });
                return;
            }

            const result = await mainApi.post(
                apiEndpoints.REGISTER,
                apiEndpoints.getRegisterBody(data.email, data.password, data.firstName, data.lastName, data.gender)
            );

            handleRegister(result.data.jsonWebToken);
        } catch (error) {
            const errorMessage = error.response.data.error;

            if (errorMessage === "userEmail already exists")
                setError("email", { message: "Email is already registered" });
        }
    }

    const handleRegister = async (token) => {
        try {
            const user = await mainApi.get(
                apiEndpoints.GET_CURRENT_USER,
                apiEndpoints.getAccessToken(token)
            );
            const expiredDate = new Date();
            expiredDate.setDate(expiredDate.getDate() + 3);

            const currentUser = {
                token: token,
                id: user.data.data._id,
                firstName: user.data.data.userFirstName,
                lastName: user.data.data.userLastName,
                email: user.data.data.userEmail,
                gender: user.data.data.userGender,
                avatar: "https://img.freepik.com/free-icon/user_318-159711.jpg",
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
        <div className="register-container">
            <div className="register-form">
                <div className="register-header">
                    <img alt="logo" src="/befriends_logo.png" className="register-logo" />
                </div>
                <div className="register-input-form">
                    <form className="flex flex-col justify-center items-start" onSubmit={handleSubmit(onSubmit)}>
                        <div className="register-name">
                            <div className="flex flex-col reg-first-name">
                                <input type="text" className="reg-input focus-visible:outline-none" placeholder="First name" {...register("firstName", { required: "Required", pattern: { value: /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\W|_]+$/, message: "Special character" } })} />
                                <p className="text-red-500 text-base reg-error">{errors.firstName?.message}</p>
                            </div>

                            <div className="flex flex-col reg-last-name focus-visible:outline-none">
                                <input type="text" className="reg-input" placeholder="Last name" {...register("lastName", { required: "Required", pattern: { value: /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\W|_]+$/ , message: "Special character" } })} />
                                <p className="text-red-500 text-base reg-error">{errors.lastName?.message}</p>
                            </div>
                        </div>

                        <select defaultValue="Male" {...register("gender")} className="reg-input mb-2 focus-visible:outline-none">
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>

                        <input type="email" className="reg-input focus-visible:outline-none" placeholder="Email" {...register("email", { required: "Please provide your email" })} />
                        <p className="text-red-500 text-base reg-error">{errors.email?.message}</p>
                        
                        <div className="flex justify-between items-center reg-input">
                            <input type={showPassword ? "text" : "password"} className="w-full border-0 mr-2 focus-visible:outline-none" placeholder="Password" {...register("password", { required: "Please provide your password", minLength: { value: 6, message: "Password must have at least 6 characters" } })} />
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
                        <p className="text-red-500 text-base reg-error">{errors.password?.message}</p>

                        <div className="flex justify-between items-center reg-input">
                            <input type={showRePassword ? "text" : "password"} className="w-full border-0 mr-2 focus-visible:outline-none" placeholder="Confirm password" {...register("rePassword", { required: "Please confirm your password" })} />
                            {showRePassword ? 
                                <svg onClick={() => setShowRePassword(false)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.3} stroke="#bfac00" className="w-5 h-5 hover:cursor-pointer">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                </svg>
                                :
                                <svg onClick={() => setShowRePassword(true)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.3} stroke="#bfac00" className="w-5 h-5 hover:cursor-pointer">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            }
                        </div>
                        <p className="text-red-500 text-base reg-error">{errors.rePassword?.message}</p>

                        <button type="submit" className="w-full register-button mb-4">REGISTER</button>
                    </form>
                    <div className="flex justify-center w-full whitespace-nowrap">
                        <p className="mr-2">Already have an account ?</p>
                        <a className="cursor-pointer text-black font-bold" href="/login">Login</a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register;