import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Textarea } from './ui/textarea'
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { LuSend } from "react-icons/lu";
import { Button } from './ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { setBlog } from '@/redux/blogSlice';
import { setComment } from '@/redux/commentSlice';
import { Edit, Trash2 } from 'lucide-react';
import { BsThreeDots } from "react-icons/bs";
import api from "@/utils/api";   // ✅ FIXED

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const CommentBox = ({ selectedBlog }) => {

    const { user } = useSelector(store => store.auth)
    const { comment } = useSelector(store => store.comment)
    const { blog } = useSelector(store => store.blog)

    const [content, setContent] = useState("")
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedContent, setEditedContent] = useState('');

    const dispatch = useDispatch()

    // ================= GET COMMENTS =================
    useEffect(() => {
        const getAllCommentsOfBlog = async () => {
            try {
                const res = await api.get(
                    `/api/v1/comment/${selectedBlog._id}/comment/all`
                );

                dispatch(setComment(res.data.comments))

            } catch (error) {
                console.log(error);
            }
        }

        if (selectedBlog?._id) {
            getAllCommentsOfBlog()
        }

    }, [selectedBlog])

    // ================= CREATE COMMENT =================
    const commentHandler = async () => {
        if (!content.trim()) {
            return toast.error("Comment empty hai ❌")
        }

        try {
            const res = await api.post(
                `/api/v1/comment/${selectedBlog._id}/create`,
                { content }
            );

            if (res.data.success) {

                const updated = [...comment, res.data.comment]
                dispatch(setComment(updated))

                const updatedBlog = blog.map(p =>
                    p._id === selectedBlog._id
                        ? { ...p, comments: updated }
                        : p
                )

                dispatch(setBlog(updatedBlog))

                toast.success("Comment added ✅")
                setContent("")
            }

        } catch (error) {
            console.log(error);
            toast.error("Comment add nahi hua ❌")
        }
    }

    // ================= DELETE =================
    const deleteComment = async (commentId) => {
        try {
            const res = await api.delete(
                `/api/v1/comment/${commentId}/delete`
            );

            if (res.data.success) {
                const updated = comment.filter(item => item._id !== commentId)
                dispatch(setComment(updated))
                toast.success("Deleted ✅")
            }

        } catch (error) {
            console.log(error);
            toast.error("Delete failed ❌")
        }
    }

    // ================= EDIT =================
    const editCommentHandler = async (commentId) => {
        try {
            const res = await api.put(
                `/api/v1/comment/${commentId}`,
                { content: editedContent }
            );

            if (res.data.success) {

                const updated = comment.map(item =>
                    item._id === commentId
                        ? { ...item, content: editedContent }
                        : item
                );

                dispatch(setComment(updated))
                toast.success("Updated ✅")
                setEditingCommentId(null)
                setEditedContent("")
            }

        } catch (error) {
            console.log(error);
            toast.error("Edit failed ❌")
        }
    }

    // ================= LIKE =================
    const likeCommentHandler = async (commentId) => {
        try {
            const res = await api.get(
                `/api/v1/comment/${commentId}/like`
            );

            if (res.data.success) {
                const updatedList = comment.map(item =>
                    item._id === commentId ? res.data.updatedComment : item
                );

                dispatch(setComment(updatedList))
            }

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>

            {/* USER */}
            <div className='flex gap-4 mb-4 items-center'>
                <Avatar>
                    <AvatarImage src={user?.photoUrl} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h3 className='font-semibold'>
                    {user?.firstName} {user?.lastName}
                </h3>
            </div>

            {/* INPUT */}
            <div className='flex gap-3'>
                <Textarea
                    placeholder="Leave a comment"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <Button onClick={commentHandler}>
                    <LuSend />
                </Button>
            </div>

            {/* COMMENTS */}
            {comment.length > 0 && (
                <div className='mt-7 bg-gray-100 p-5 rounded-md'>
                    {comment.map((item) => (
                        <div key={item._id} className='mb-4'>
                            <div className='flex justify-between'>

                                <div>
                                    <h1 className='font-semibold'>
                                        {item?.userId?.firstName}
                                    </h1>

                                    {editingCommentId === item._id ? (
                                        <>
                                            <Textarea
                                                value={editedContent}
                                                onChange={(e) => setEditedContent(e.target.value)}
                                            />
                                            <Button onClick={() => editCommentHandler(item._id)}>Save</Button>
                                        </>
                                    ) : (
                                        <p>{item.content}</p>
                                    )}

                                    <div className='flex gap-4 mt-2'>
                                        <div onClick={() => likeCommentHandler(item._id)}>
                                            {item.likes.includes(user._id)
                                                ? <FaHeart color='red' />
                                                : <FaRegHeart />}
                                        </div>
                                        <span>{item.numberOfLikes}</span>
                                    </div>
                                </div>

                                {user._id === item?.userId?._id && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger><BsThreeDots /></DropdownMenuTrigger>
                                        <DropdownMenuContent>

                                            <DropdownMenuItem onClick={() => {
                                                setEditingCommentId(item._id)
                                                setEditedContent(item.content)
                                            }}>
                                                <Edit /> Edit
                                            </DropdownMenuItem>

                                            <DropdownMenuItem onClick={() => deleteComment(item._id)}>
                                                <Trash2 /> Delete
                                            </DropdownMenuItem>

                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

        </div>
    )
}

export default CommentBox