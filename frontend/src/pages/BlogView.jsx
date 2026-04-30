import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bookmark, MessageSquare, Share2 } from 'lucide-react'
import CommentBox from '@/components/CommentBox'
import api from "@/utils/api"   // ✅ FIXED
import { FaHeart, FaRegHeart } from 'react-icons/fa6'
import { setBlog } from '@/redux/blogSlice'
import { toast } from 'sonner'

const BlogView = () => {

  const params = useParams()
  const blogId = params.blogId

  const { blog } = useSelector(store => store.blog)
  const { user } = useSelector(store => store.auth)

  const selectedBlog = blog.find(b => b._id === blogId)

  const [blogLike, setBlogLike] = useState(selectedBlog?.likes.length || 0)
  const [liked, setLiked] = useState(
    selectedBlog?.likes.includes(user?._id) || false
  )

  const { comment } = useSelector(store => store.comment)
  const dispatch = useDispatch()

  // ✅ LIKE / DISLIKE FIX
  const likeOrDislikeHandler = async () => {
    try {
      const action = liked ? 'dislike' : 'like'

      const res = await api.get(
        `/api/v1/blog/${selectedBlog?._id}/${action}`
      )

      if (res.data.success) {
        const updatedLikes = liked ? blogLike - 1 : blogLike + 1
        setBlogLike(updatedLikes)
        setLiked(!liked)

        const updatedBlogData = blog.map(p =>
          p._id === selectedBlog._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter(id => id !== user._id)
                  : [...p.likes, user._id]
              }
            : p
        )

        dispatch(setBlog(updatedBlogData))
        toast.success(res.data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error("Something went wrong")
    }
  }

  const changeTimeFormat = (isoDate) => {
    const date = new Date(isoDate)
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const handleShare = (blogId) => {
    const blogUrl = `${window.location.origin}/blogs/${blogId}`

    if (navigator.share) {
      navigator.share({
        title: 'Check this blog',
        url: blogUrl
      })
    } else {
      navigator.clipboard.writeText(blogUrl)
      toast.success("Link copied")
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (!selectedBlog) return <div>Loading...</div>

  return (
    <div className='pt-14'>
      <div className='max-w-6xl mx-auto p-10'>

        <h1 className="text-4xl font-bold mb-4">{selectedBlog.title}</h1>

        <div className="flex justify-between mb-6">
          <div className="flex gap-3 items-center">
            <Avatar>
              <AvatarImage src={selectedBlog.author.photoUrl} />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>

            <div>
              <p>{selectedBlog.author.firstName}</p>
              <p className="text-sm">{selectedBlog.author.occupation}</p>
            </div>
          </div>

          <p className="text-sm">
            {changeTimeFormat(selectedBlog.createdAt)}
          </p>
        </div>

        <img src={selectedBlog.thumbnail} className="w-full rounded mb-6" />

        <div dangerouslySetInnerHTML={{ __html: selectedBlog.description }} />

        {/* ACTIONS */}
        <div className="flex justify-between border-y py-4 mt-6">
          <div className="flex gap-4">

            <Button onClick={likeOrDislikeHandler}>
              {liked ? <FaHeart color='red' /> : <FaRegHeart />}
              {blogLike}
            </Button>

            <Button>
              <MessageSquare /> {comment.length}
            </Button>
          </div>

          <div className="flex gap-2">
            <Button><Bookmark /></Button>
            <Button onClick={() => handleShare(selectedBlog._id)}>
              <Share2 />
            </Button>
          </div>
        </div>

        <CommentBox selectedBlog={selectedBlog} />

      </div>
    </div>
  )
}

export default BlogView