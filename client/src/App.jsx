/* eslint-disable react-hooks/exhaustive-deps */
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import MainPage from './pages/MainPage/mainpage';
import Information from './pages/Information/information';
import Login from './pages/Login/login';
import Register from './pages/Register/register';

import { useDispatch } from 'react-redux'
import { useEffect } from 'react';

import { mainApi } from './api/mainApi'
import * as apiEndpoints from './api/apiEndpoints'

import { login } from './redux/reducers/authReducer';

function App() {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const getUser = async (token, expiredDate) => {
        try {
            const user = await mainApi.get(
                apiEndpoints.GET_CURRENT_USER,
                apiEndpoints.getAccessToken(token)
            );

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
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const user = localStorage.getItem("currentUser");

        if (user) {
            const loggedInUser = JSON.parse(user);

            const today = new Date();
            const expiredDate = new Date(loggedInUser.expiredDate);

            if (today < expiredDate) {
                getUser(loggedInUser.token, expiredDate);
            } else {
                localStorage.removeItem("currentUser");
                if (location.pathname != "/register") navigate("/login");
            }
        } else {
            if (location.pathname != "/register") navigate("/login");
        }
    }, []);

    return (
        <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="information" element={<Information />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
        </Routes>
    )
}

export default App;
