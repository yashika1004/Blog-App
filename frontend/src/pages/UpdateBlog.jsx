import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useRef, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button'
import JoditEditor from 'jodit-react';
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import api from "@/utils/api"   // ✅ FIXED
import { toast } from 'sonner'
import { setBlog } from '@/redux/blogSlice'

const UpdateBlog = () => {

    const editor = useRef(null);
    const [loading, setLoading] = useState(false)
    const params = useParams()
    const id = params.blogId

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { blog } = useSelector(store => store.blog)
    const selectBlog = blog.find(blog => blog._id === id)

    if (!selectBlog) {
        return <div className='pt-20 text-center'>Loading...</div>
    }

    const [content, setContent] = useState(selectBlog.description || '')

    const [blogData, setBlogData] = useState({
        title: selectBlog.title,
        subtitle: selectBlog.subtitle,
        category: selectBlog.category,
        thumbnail: null
    })

    const [previewThumbnail, setPreviewThumbnail] = useState(selectBlog.thumbnail)

    const handleChange = (e) => {
        const { name, value } = e.target
        setBlogData(prev => ({ ...prev, [name]: value }))
    }

    const selectCategory = (value) => {
        setBlogData({ ...blogData, category: value })
    }

    const selectThumbnail = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            setBlogData({ ...blogData, thumbnail: file })

            const reader = new FileReader()
            reader.onloadend = () => setPreviewThumbnail(reader.result)
            reader.readAsDataURL(file)
        }
    }

    // ✅ UPDATE BLOG
    const updateBlogHandler = async () => {

        const formData = new FormData()
        formData.append("title", blogData.title)
        formData.append("subtitle", blogData.subtitle)
        formData.append("description", content)
        formData.append("category", blogData.category)

        if (blogData.thumbnail) {
            formData.append("file", blogData.thumbnail)
        }

        try {
            setLoading(true)

            const res = await api.put(
                `/api/v1/blog/${id}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            )

            if (res.data.success) {
                toast.success(res.data.message)
                navigate('/dashboard/your-blog')
            }

        } catch (error) {
            console.log(error)
            toast.error("Update failed ❌")
        } finally {
            setLoading(false)
        }
    }

    // ✅ PUBLISH / UNPUBLISH
    const togglePublishUnpublish = async (action) => {
        try {
            const res = await api.patch(
                `/api/v1/blog/${id}`,
                null,
                {
                    params: { action }
                }
            )

            if (res.data.success) {
                toast.success(res.data.message)
                navigate('/dashboard/your-blog')
            }

        } catch (error) {
            console.log(error)
            toast.error("Publish failed ❌")
        }
    }

    // ✅ DELETE BLOG
    const deleteBlog = async () => {
        try {
            const res = await api.delete(
                `/api/v1/blog/delete/${id}`
            )

            if (res.data.success) {
                const updated = blog.filter(b => b._id !== id)
                dispatch(setBlog(updated))
                toast.success(res.data.message)
                navigate('/dashboard/your-blog')
            }

        } catch (error) {
            console.log(error)
            toast.error("Delete failed ❌")
        }
    }

    return (
        <div className='pt-20 px-3'>
            <Card className="p-5 space-y-4">

                <h1 className='text-3xl font-bold'>Update Blog</h1>

                <div className="flex gap-2">
                    <Button onClick={() =>
                        togglePublishUnpublish(selectBlog.isPublished ? "false" : "true")
                    }>
                        {selectBlog.isPublished ? "UnPublish" : "Publish"}
                    </Button>

                    <Button variant="destructive" onClick={deleteBlog}>
                        Delete
                    </Button>
                </div>

                <Input name="title" value={blogData.title} onChange={handleChange} />
                <Input name="subtitle" value={blogData.subtitle} onChange={handleChange} />

                <JoditEditor
                    ref={editor}
                    value={content}
                    onChange={setContent}
                />

                <Select onValueChange={selectCategory}>
                    <SelectTrigger>
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Web Development">Web</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Photography">Photography</SelectItem>
                        <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                        <SelectItem value="Food">Food</SelectItem>
                        <SelectItem value="Travel">Travel</SelectItem>
                    </SelectContent>
                    </Select>
                

                <Input type="file" onChange={selectThumbnail} />

                {previewThumbnail && <img src={previewThumbnail} className="w-40" />}

                <Button onClick={updateBlogHandler}>
                    {loading ? "Saving..." : "Save"}
                </Button>

            </Card>
        </div>
    )
}

export default UpdateBlog