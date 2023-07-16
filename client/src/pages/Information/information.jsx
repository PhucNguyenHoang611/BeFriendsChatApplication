import "./information.css"
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";

import { mainApi } from '../../api/mainApi'
import * as apiEndpoints from '../../api/apiEndpoints'
import { useState } from "react";

const Information = () => {
    const currentUser = useSelector((state) => state.auth.currentUser);
    const [gender, setGender] = useState("");
    const [avatar, setAvatar] = useState(currentUser.avatar);
    const [avatarFile, setAvatarFile] = useState(null);
    const { register, formState: { errors }, handleSubmit } = useForm();

    const onSubmit = async (data) => {
        try {
            let temp = "";

            if (!gender) temp = currentUser.gender;
            else temp = gender;

            if (!data.firstName || !data.lastName) {
                await mainApi.put(
                    apiEndpoints.UPDATE_USER,
                    apiEndpoints.getUpdateUserBody(currentUser.firstName, currentUser.lastName, temp),
                    apiEndpoints.getAccessToken(currentUser.token)
                );
            } else {
                await mainApi.put(
                    apiEndpoints.UPDATE_USER,
                    apiEndpoints.getUpdateUserBody(data.firstName, data.lastName, temp),
                    apiEndpoints.getAccessToken(currentUser.token)
                );
            }

            if (avatarFile != null) {
                const formData = new FormData();

                formData.append("Files[]", avatarFile);

                await mainApi.post(
                    apiEndpoints.UPLOAD_AVATAR,
                    formData,
                    apiEndpoints.getAccessToken(currentUser.token)
                );
            }

            alert("Update Successfully !");
            window.location.reload(false);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="info-container">
            <div className="info-form">
                <div className="info-header">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary-1 hover:text-primary-2 focus-within:outline-none">
                        <div className="ava-container">
                            <img alt="avatar" src={avatar ? avatar : currentUser.avatar} className="info-ava" />
                        </div>

                        <input 
                            id="file-upload" 
                            name="file-upload" 
                            type="file" 
                            className="sr-only" 
                            onChange={(e) => {
                                const file = e.target?.files?.[0];
                                if (file) {
                                    setAvatarFile(file);
                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                        setAvatar(event.target?.result);
                                    };
                                    reader.readAsDataURL(file);
                                }
                            }}
                            />
                    </label>
                </div>
                <div className="info-input-form">
                    <form className="flex flex-col justify-center items-start" onSubmit={handleSubmit(onSubmit)}>
                        <div className="info-name">
                            <div className="flex flex-col inf-first-name">
                                <input defaultValue={currentUser.firstName} type="text" className="inf-input focus-visible:outline-none" placeholder="First name" {...register("firstName", { pattern: { value: /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\W|_]+$/, message: "Special character" } })} />
                                <p className="text-red-500 text-base inf-error">{errors.firstName?.message}</p>
                            </div>

                            <div className="flex flex-col inf-last-name focus-visible:outline-none">
                                <input defaultValue={currentUser.lastName} type="text" className="inf-input" placeholder="Last name" {...register("lastName", { pattern: { value: /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\W|_]+$/ , message: "Special character" } })} />
                                <p className="text-red-500 text-base inf-error">{errors.lastName?.message}</p>
                            </div>
                        </div>

                        <select onChange={(event) => setGender(event.target.value)} className="inf-input mb-2 focus-visible:outline-none">
                            <option selected={currentUser.gender == "Male"} value="Male">Male</option>
                            <option selected={currentUser.gender == "Female"} value="Female">Female</option>
                        </select>

                        <button type="submit" className="w-full info-button mb-4">UPDATE INFORMATION</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Information;