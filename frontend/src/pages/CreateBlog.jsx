import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

import { setBlog } from '@/redux/blogSlice'
import api from "@/utils/api"   // ✅ FIXED
import { Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const CreateBlog = () => {

  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")

  const { blog } = useSelector(store => store.blog)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const createBlogHandler = async () => {
    try {
      setLoading(true)

      const res = await api.post(
        "/api/v1/blog/",
        { title, category }
      )

      if (res.data.success) {
        dispatch(setBlog([...blog, res.data.blog]))
        navigate(`/dashboard/write-blog/${res.data.blog._id}`)
        toast.success(res.data.message)
      } else {
        toast.error("Something went wrong")
      }

    } catch (error) {
      console.log(error)
      toast.error("Blog create failed ❌")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='p-4 md:pr-20 h-screen md:ml-[320px] pt-20'>
      <Card className="md:p-10 p-4 dark:bg-gray-800">

        <h1 className='text-2xl font-bold'>Lets create blog</h1>

        <div className='mt-10'>
          <Label>Title</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className='mt-4 mb-5'>
            <Label>Category</Label>
            <Select onValueChange={setCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Category</SelectLabel>
                  <SelectItem value="Web Development">Web Dev</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={createBlogHandler}>
            {loading ? <Loader2 className='animate-spin' /> : "Create"}
          </Button>

        </div>

      </Card>
    </div>
  )
}

export default CreateBlog