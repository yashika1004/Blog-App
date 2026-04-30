import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import BlogCardList from './BlogCardList'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useNavigate } from 'react-router-dom'
import { setBlog } from '@/redux/blogSlice'
import api from "@/utils/api"   // ✅ FIXED

const tags = [
  { category: "Blogging" },
  { category: "Web Development" },
  { category: "Digital Marketing" },
  { category: "Cooking" },
  { category: "Photography" },
  { category: "Sports" },
]

const RecentBlog = () => {

  const { blog } = useSelector(store => store.blog)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {

    const getAllPublishedBlogs = async () => {
      try {
        const res = await api.get("/api/v1/blog/get-published-blogs") // ✅ FIXED

        if (res.data.success) {
          dispatch(setBlog(res.data.blogs))
        }

      } catch (error) {
        console.log(error)
      }
    }

    getAllPublishedBlogs()

  }, [])

  return (
    <div className='bg-gray-100 dark:bg-gray-800 pb-10'>

      <div className='max-w-6xl mx-auto flex flex-col items-center'>
        <h1 className='text-4xl font-bold pt-10'>Recent Blogs</h1>
        <hr className='w-24 border-2 border-red-500 rounded-full' />
      </div>

      <div className='max-w-7xl mx-auto flex gap-6'>

        {/* BLOG LIST */}
        <div className='mt-10 px-4'>
          {
            blog?.slice(0, 4)?.map((item, index) => (
              <BlogCardList key={index} blog={item} />
            ))
          }
        </div>

        {/* SIDEBAR */}
        <div className='bg-white hidden md:block dark:bg-gray-700 w-[350px] p-5 rounded-md mt-10'>

          <h1 className='text-2xl font-semibold'>Popular categories</h1>

          <div className='my-5 flex flex-wrap gap-3'>
            {
              tags.map((item, index) => (
                <Badge
                  key={index}
                  className="cursor-pointer"
                  onClick={() => navigate(`/search?q=${item.category}`)}
                >
                  {item.category}
                </Badge>
              ))
            }
          </div>

          <h1 className='text-xl font-semibold'>Subscribe</h1>

          <div className="flex flex-col gap-2 mt-5">
            <Input placeholder="Enter your email" />
            <Button>Subscribe</Button>
          </div>

          <div className='mt-7'>
            <h2 className="text-xl font-semibold mb-3">Suggested Blogs</h2>
            <ul className="space-y-2">
              {
                ['React Tips', 'Tailwind Guide', 'SEO Basics']
                  .map((title, idx) => (
                    <li key={idx} className="cursor-pointer hover:underline">
                      {title}
                    </li>
                  ))
              }
            </ul>
          </div>

        </div>

      </div>
    </div>
  )
}

export default RecentBlog