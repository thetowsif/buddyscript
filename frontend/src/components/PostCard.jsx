import { useState } from 'react'
import PostImg from '../assets/images/post_img.png'
import CommentImg from '../assets/images/comment_img.png'
import ReactImg1 from '../assets/images/react_img1.png'
import TxtImg from '../assets/images/txt_img.png'

function CommentItem({ comment, postId, onUpdate, depth }) {
    const [replyText, setReplyText] = useState('')
    const [showReply, setShowReply] = useState(false)

    const toggleLike = async () => {
        await fetch('/api/comments/' + comment.id + '/like', {
            method: 'POST',
            credentials: 'include',
        })
        onUpdate()
    }

    const submitReply = async (e) => {
        if (e) e.preventDefault()
        if (!replyText.trim()) return

        await fetch('/api/posts/' + postId + '/comments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ content: replyText, parentId: comment.id }),
        })

        setReplyText('')
        setShowReply(false)
        onUpdate()
    }

    const handleReplyKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            submitReply(e)
        }
    }

    const likerNames = comment.likers.map(l => l.firstName + ' ' + l.lastName).join(', ')

    return (
        <div class="_comment_main" style={depth > 0 ? {marginLeft: '40px'} : {}}>
            <div class="_comment_image">
                <img src={TxtImg} alt="" class="_comment_img1" />
            </div>
            <div class="_comment_area">
                <div class="_comment_details">
                    <div class="_comment_details_top">
                        <div class="_comment_name">
                            <h4 class="_comment_name_title">{comment.author.firstName} {comment.author.lastName}</h4>
                        </div>
                    </div>
                    <div class="_comment_status">
                        <p class="_comment_status_text"><span>{comment.content}</span></p>
                    </div>
                    {comment.likeCount > 0 && (
                        <div class="_total_reactions">
                            <div class="_total_react">
                                <span class="_reaction_like">👍</span>
                            </div>
                            <span class="_total">{comment.likeCount}</span>
                        </div>
                    )}
                    {likerNames && (
                        <p style={{fontSize: '12px', color: '#666', marginTop: '4px'}}>
                            Liked by {likerNames}
                        </p>
                    )}
                    <div class="_comment_reply">
                        <div class="_comment_reply_num">
                            <ul class="_comment_reply_list">
                                <li>
                                    <span
                                        style={{cursor: 'pointer', fontWeight: comment.likedByMe ? 'bold' : 'normal'}}
                                        onClick={toggleLike}
                                    >
                                        {comment.likedByMe ? 'Unlike' : 'Like'}.
                                    </span>
                                </li>
                                {depth === 0 && (
                                    <li>
                                        <span style={{cursor: 'pointer'}} onClick={() => setShowReply(!showReply)}>Reply.</span>
                                    </li>
                                )}
                                <li><span class="_time_link">{comment.timeAgo}</span></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {showReply && (
                    <div class="_feed_inner_comment_box">
                        <form class="_feed_inner_comment_box_form" onSubmit={submitReply}>
                            <div class="_feed_inner_comment_box_content">
                                <div class="_feed_inner_comment_box_content_image">
                                    <img src={CommentImg} alt="" class="_comment_img" />
                                </div>
                                <div class="_feed_inner_comment_box_content_txt">
                                    <textarea
                                        class="form-control _comment_textarea"
                                        placeholder="Write a reply"
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        onKeyDown={handleReplyKeyDown}
                                    ></textarea>
                                </div>
                            </div>
                        </form>
                    </div>
                )}

                {comment.replies && comment.replies.map(reply => (
                    <CommentItem
                        key={reply.id}
                        comment={reply}
                        postId={postId}
                        onUpdate={onUpdate}
                        depth={1}
                    />
                ))}
            </div>
        </div>
    )
}

function PostCard({ post, onUpdate }) {
    const [commentText, setCommentText] = useState('')
    const [showComments, setShowComments] = useState(true)

    const toggleLike = async () => {
        await fetch('/api/posts/' + post.id + '/like', {
            method: 'POST',
            credentials: 'include',
        })
        onUpdate()
    }

    const submitComment = async (e) => {
        if (e) e.preventDefault()
        if (!commentText.trim()) return

        await fetch('/api/posts/' + post.id + '/comments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ content: commentText }),
        })

        setCommentText('')
        onUpdate()
    }

    const handleCommentKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            submitComment(e)
        }
    }

    const likerNames = post.likers.map(l => l.firstName + ' ' + l.lastName).join(', ')
    const authorName = post.author.firstName + ' ' + post.author.lastName

    return (
        <div class="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
            <div class="_feed_inner_timeline_content _padd_r24 _padd_l24">
                <div class="_feed_inner_timeline_post_top">
                    <div class="_feed_inner_timeline_post_box">
                        <div class="_feed_inner_timeline_post_box_image">
                            <img src={PostImg} alt="" class="_post_img" />
                        </div>
                        <div class="_feed_inner_timeline_post_box_txt">
                            <h4 class="_feed_inner_timeline_post_box_title">{authorName}</h4>
                            <p class="_feed_inner_timeline_post_box_para">
                                <span class="_time_link">{post.timeAgo}</span> . <span>{post.visibility === 'private' ? 'Private' : 'Public'}</span>
                            </p>
                        </div>
                    </div>
                </div>
                <h4 class="_feed_inner_timeline_post_title">{post.content}</h4>
                {post.imageUrl && (
                    <div class="_feed_inner_timeline_image">
                        <img src={post.imageUrl} alt="" class="_time_img" />
                    </div>
                )}
            </div>

            <div class="_feed_inner_timeline_total_reacts _padd_r24 _padd_l24 _mar_b26">
                <div class="_feed_inner_timeline_total_reacts_image">
                    {post.likeCount > 0 && (
                        <>
                            <img src={ReactImg1} alt="Image" class="_react_img1" />
                            <p class="_feed_inner_timeline_total_reacts_para">{post.likeCount}</p>
                        </>
                    )}
                </div>
                {likerNames && (
                    <p style={{fontSize: '13px', color: '#666', marginTop: '6px'}}>
                        Liked by {likerNames}
                    </p>
                )}
                <div class="_feed_inner_timeline_total_reacts_txt">
                    <p class="_feed_inner_timeline_total_reacts_para1">
                        <span>{post.commentCount}</span> Comment{post.commentCount !== 1 ? 's' : ''}
                    </p>
                </div>
            </div>

            <div class="_feed_inner_timeline_reaction">
                <button
                    class={"_feed_inner_timeline_reaction_emoji _feed_reaction" + (post.likedByMe ? " _feed_reaction_active" : "")}
                    onClick={toggleLike}
                >
                    <span class="_feed_inner_timeline_reaction_link">
                        <span>{post.likedByMe ? 'Unlike' : 'Like'}</span>
                    </span>
                </button>
                <button class="_feed_inner_timeline_reaction_comment _feed_reaction" onClick={() => setShowComments(!showComments)}>
                    <span class="_feed_inner_timeline_reaction_link">
                        <span>Comment</span>
                    </span>
                </button>
            </div>

            {showComments && (
                <>
                    <div class="_feed_inner_timeline_cooment_area">
                        <div class="_feed_inner_comment_box">
                            <form class="_feed_inner_comment_box_form" onSubmit={submitComment}>
                                <div class="_feed_inner_comment_box_content">
                                    <div class="_feed_inner_comment_box_content_image">
                                        <img src={CommentImg} alt="" class="_comment_img" />
                                    </div>
                                    <div class="_feed_inner_comment_box_content_txt">
                                        <textarea
                                            class="form-control _comment_textarea"
                                            placeholder="Write a comment"
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                            onKeyDown={handleCommentKeyDown}
                                        ></textarea>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div class="_timline_comment_main">
                        {post.comments.map(comment => (
                            <CommentItem
                                key={comment.id}
                                comment={comment}
                                postId={post.id}
                                onUpdate={onUpdate}
                                depth={0}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

export default PostCard
