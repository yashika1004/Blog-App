import React, { useState } from 'react'
import { Button } from './ui/button'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Input } from './ui/input'
import Logo from "../assets/logo.png"
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import api from "@/utils/api"
import { setUser } from '@/redux/authSlice'
import userLogo from "../assets/user.jpg"
import { HiMenuAlt1, HiMenuAlt3 } from "react-icons/hi";
import { Search, LogOut, User, ChartColumnBig } from "lucide-react"

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

    const [searchTerm, setSearchTerm] = useState("")
    const [openNav, setOpenNav] = useState(false)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const logoutHandler = async () => {
        try {
            const res = await api.get("/api/v1/user/logout")

            if (res.data.success) {
                navigate("/")
                dispatch(setUser(null))
                toast.success(res.data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message)
        }
    }

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim() !== '') {
            navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
            setSearchTerm('')
        }
    };

    const toggleNav = ()=>{
        setOpenNav(!openNav)
    }

    return (
        <div className='py-2 fixed w-full dark:bg-gray-800 border-b bg-white z-50'>
            <div className='max-w-7xl mx-auto flex justify-between items-center px-4'>

                {/* LOGO */}
                <div className='flex gap-7 items-center'>
                    <Link to='/'>
                        <div className='flex gap-2 items-center'>
                            <img src={Logo} className='w-8 h-8' />
                            <h1 className='font-bold text-2xl'>Blogify</h1>
                        </div>
                    </Link>

                    {/* SEARCH */}
                    <div className='relative hidden md:block'>
                        <Input
                            type="text"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Button className='absolute right-0 top-0' onClick={handleSearch}>
                            <Search size={16}/>
                        </Button>
                    </div>
                </div>

                {/* NAV */}
                <nav className='flex gap-4 items-center'>
                    <ul className='hidden md:flex gap-6 font-semibold'>
                        <NavLink to='/'><li>Home</li></NavLink>
                        <NavLink to='/blogs'><li>Blogs</li></NavLink>
                        <NavLink to='/about'><li>About</li></NavLink>
                    </ul>

                    <Button onClick={() => dispatch(toggleTheme())}>
                        {theme === 'light' ? <FaMoon /> : <FaSun />}
                    </Button>

                    {
                        user ? (
                            <div className="flex gap-3 items-center">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Avatar className="cursor-pointer">
                                            <AvatarImage src={user.photoUrl || userLogo} />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent>
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />

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

                                <Button onClick={logoutHandler}>Logout</Button>
                            </div>
                        ) : (
                            <div className='flex gap-2'>
                                <Link to='/login'><Button>Login</Button></Link>
                                <Link to='/signup'><Button>Signup</Button></Link>
                            </div>
                        )
                    }

                    <div onClick={toggleNav} className='md:hidden'>
                        {openNav ? <HiMenuAlt3 size={24}/> : <HiMenuAlt1 size={24}/>}
                    </div>

                </nav>

                <ResponsiveMenu openNav={openNav} setOpenNav={setOpenNav} logoutHandler={logoutHandler}/>
            </div>
        </div>
    )
}

export default Navbar