import React, { useEffect, useState } from 'react'
import userLogo from "../assets/user.jpg"
import api from "@/utils/api"   // ✅ FIXED

const PopularAuthors = () => {

    const [popularUser, setPopularUser] = useState([])

    const getAllUsers = async () => {
        try {
            const res = await api.get("/api/v1/user/all-users")  // ✅ FIXED

            if (res.data.success) {
                setPopularUser(res.data.users)
            }

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getAllUsers()
    }, [])

    return (
        <div>
            <div className='max-w-7xl mx-auto'>

                <div className='flex flex-col items-center'>
                    <h1 className='text-3xl md:text-4xl font-bold pt-10'>
                        Popular Authors
                    </h1>
                    <hr className='w-24 border-2 border-red-500 rounded-full' />
                </div>

                <div className='flex justify-around my-10 px-4'>

                    {
                        popularUser?.slice(0, 3)?.map((user, index) => (
                            <div key={index} className='flex flex-col items-center gap-2'>

                                <img
                                    src={user.photoUrl || userLogo}
                                    className='rounded-full h-16 w-16 md:w-32 md:h-32'
                                />

                                <p className='font-semibold'>
                                    {user.firstName} {user.lastName}
                                </p>

                            </div>
                        ))
                    }

                </div>
            </div>
        </div>
    )
}

export default PopularAuthors