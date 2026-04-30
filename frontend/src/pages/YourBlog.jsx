import { Card } from '@/components/ui/card'
import React, { useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { useDispatch, useSelector } from 'react-redux'
import api from "@/utils/api"   // ✅ FIXED
import { setBlog } from '@/redux/blogSlice'
import { Edit, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { BsThreeDotsVertical } from 'react-icons/bs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

const YourBlog = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { blog } = useSelector(store => store.blog)

  // ✅ GET BLOGS
  const getOwnBlog = async () => {
    try {
      const res = await api.get("/api/v1/blog/get-own-blogs")

      if (res.data.success) {
        dispatch(setBlog(res.data.blogs))
      }

    } catch (error) {
      console.log(error)
    }
  }

  // ✅ DELETE BLOG
  const deleteBlog = async (id) => {
    try {
      const res = await api.delete(`/api/v1/blog/delete/${id}`)

      if (res.data.success) {
        const updated = blog.filter(item => item._id !== id)
        dispatch(setBlog(updated))
        toast.success(res.data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error("Delete failed ❌")
    }
  }

  useEffect(() => {
    getOwnBlog()
  }, [])

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB")
  }

  return (
    <div className='pt-20'>
      <div className='max-w-6xl mx-auto mt-8'>
        <Card className="p-5 space-y-2">

          <Table>
            <TableCaption>Your blogs</TableCaption>

            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {blog?.map((item) => (
                <TableRow key={item._id}>

                  <TableCell className="flex gap-3 items-center">
                    <img src={item.thumbnail} className='w-16 rounded' />
                    <span
                      className='cursor-pointer hover:underline'
                      onClick={() => navigate(`/blogs/${item._id}`)}
                    >
                      {item.title}
                    </span>
                  </TableCell>

                  <TableCell>{item.category}</TableCell>

                  <TableCell>{formatDate(item.createdAt)}</TableCell>

                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <BsThreeDotsVertical />
                      </DropdownMenuTrigger>

                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() =>
                            navigate(`/dashboard/write-blog/${item._id}`)
                          }
                        >
                          <Edit /> Edit
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="text-red-500"
                          onClick={() => deleteBlog(item._id)}
                        >
                          <Trash2 /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>

                    </DropdownMenu>
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>

          </Table>

        </Card>
      </div>
    </div>
  )
}

export default YourBlog