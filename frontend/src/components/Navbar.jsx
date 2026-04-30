import React, { useState } from 'react'
import { Button } from './ui/button'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Input } from './ui/input'
import Logo from "../assets/logo.png"
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import api from "@/utils/api"   // ✅ FIXED
import { setUser } from '@/redux/authSlice'
import userLogo from "../assets/user.jpg"
import { HiMenuAlt1, HiMenuAlt3 } from "react-icons/hi";
import {
    LogOut,
    User,
    ChartColumnBig
} from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { FaMoon, FaSun, FaRegEdit } from 'react-icons/fa'
import { toggleTheme } from '@/redux/themeSlice'
import { LiaCommentSolid } from 'react-icons/lia'
import ResponsiveMenu from './ResponsiveMenu'

const Navbar = () => {

    const { user } = useSelector(store => store.auth)
    const { theme } = useSelector(store => store.theme)

    const [searchTerm, setSearchTerm] = useState('')
    const [openNav, setOpenNav] = useState(false)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    // ✅ LOGOUT FIX
    const logoutHandler = async () => {
        try {
            const res = await api.get("/api/v1/user/logout")

            if (res.data.success) {
                dispatch(setUser(null))
                toast.success(res.data.message)
                navigate("/")
            }

        } catch (error) {
            console.log(error)
            toast.error("Logout failed ❌")
        }
    }

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchTerm.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchTerm)}`)
            setSearchTerm('')
        }
    }

    return (
        <div className='py-2 fixed w-full border-b bg-white dark:bg-gray-800 z-50'>

            <div className='max-w-7xl mx-auto flex justify-between items-center px-4'>

                {/* LOGO */}
                <Link to="/">
                    <div className='flex gap-2 items-center'>
                        <img src={Logo} className='w-8 h-8' />
                        <h1 className='text-3xl font-bold'>Blogify</h1>
                    </div>
                </Link>

                {/* NAV */}
                <nav className='flex items-center gap-4'>

                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/blogs">Blogs</NavLink>

                    <Button onClick={() => dispatch(toggleTheme())}>
                        {theme === 'light' ? <FaMoon /> : <FaSun />}
                    </Button>

                    {
                        user ? (
                            <div className='flex items-center gap-3'>

                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <Avatar>
                                            <AvatarImage src={user.photoUrl || userLogo} />
                                            <AvatarFallback>U</AvatarFallback>
                                        </Avatar>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent>

                                        <DropdownMenuLabel>Account</DropdownMenuLabel>

                                        <DropdownMenuGroup>

                                            <DropdownMenuItem onClick={() => navigate('/dashboard/profile')}>
                                                <User /> Profile
                                            </DropdownMenuItem>

                                            <DropdownMenuItem onClick={() => navigate('/dashboard/your-blog')}>
                                                <ChartColumnBig /> Your Blog
                                            </DropdownMenuItem>

                                            <DropdownMenuItem onClick={() => navigate('/dashboard/comments')}>
                                                <LiaCommentSolid /> Comments
                                            </DropdownMenuItem>

                                            <DropdownMenuItem onClick={() => navigate('/dashboard/write-blog')}>
                                                <FaRegEdit /> Write Blog
                                            </DropdownMenuItem>

                                        </DropdownMenuGroup>

                                        <DropdownMenuSeparator />

                                        <DropdownMenuItem onClick={logoutHandler}>
                                            <LogOut /> Logout
                                        </DropdownMenuItem>

                                    </DropdownMenuContent>
                                </DropdownMenu>

                                <Button onClick={logoutHandler}>
                                    Logout
                                </Button>

                            </div>
                        ) : (
                            <>
                                <Link to="/login"><Button>Login</Button></Link>
                                <Link to="/signup"><Button>Signup</Button></Link>
                            </>
                        )
                    }

                    {
                        openNav
                            ? <HiMenuAlt3 onClick={() => setOpenNav(false)} />
                            : <HiMenuAlt1 onClick={() => setOpenNav(true)} />
                    }

                </nav>
            </div>

            <ResponsiveMenu
                openNav={openNav}
                setOpenNav={setOpenNav}
                logoutHandler={logoutHandler}
            />

        </div>
    )
}

export default Navbar