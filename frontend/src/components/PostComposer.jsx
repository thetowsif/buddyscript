import { useState, useRef } from 'react'
import TxtImg from '../assets/images/txt_img.png'

function PostComposer({ onPostCreated }) {
    const [content, setContent] = useState('')
    const [visibility, setVisibility] = useState('public')
    const [imageUrl, setImageUrl] = useState('')
    const [imagePreview, setImagePreview] = useState('')
    const fileRef = useRef(null)

    const handlePhotoClick = () => {
        fileRef.current.click()
    }

    const handleFileChange = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        setImagePreview(URL.createObjectURL(file))

        const formData = new FormData()
        formData.append('image', file)

        const res = await fetch('/api/upload', {
            method: 'POST',
            credentials: 'include',
            body: formData,
        })

        const data = await res.json()
        if (res.ok) {
            setImageUrl(data.imageUrl)
        }
    }

    const handlePost = async () => {
        if (!content.trim()) return

        const res = await fetch('/api/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ content, visibility, imageUrl }),
        })

        if (res.ok) {
            setContent('')
            setImageUrl('')
            setImagePreview('')
            setVisibility('public')
            if (fileRef.current) fileRef.current.value = ''
            onPostCreated()
        }
    }

    return (
        <div class="_feed_inner_text_area  _b_radious6 _padd_b24 _padd_t24 _padd_r24 _padd_l24 _mar_b16">
            <div class="_feed_inner_text_area_box">
                <div class="_feed_inner_text_area_box_image">
                    <img src={TxtImg} alt="Image" class="_txt_img" />
                </div>
                <div class="form-floating _feed_inner_text_area_box_form ">
                    <textarea
                        class="form-control _textarea"
                        placeholder="Leave a comment here"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    ></textarea>
                    <label class="_feed_textarea_label">Write something ...</label>
                </div>
            </div>

            {imagePreview && (
                <div style={{marginTop: '10px'}}>
                    <img src={imagePreview} alt="" style={{maxWidth: '200px', borderRadius: '6px'}} />
                </div>
            )}

            <input type="file" accept="image/*" ref={fileRef} style={{display: 'none'}} onChange={handleFileChange} />

            <div class="_feed_inner_text_area_bottom">
                <div class="_feed_inner_text_area_item">
                    <div class="_feed_inner_text_area_bottom_photo _feed_common">
                        <button type="button" class="_feed_inner_text_area_bottom_photo_link" onClick={handlePhotoClick}>
                            <span class="_feed_inner_text_area_bottom_photo_iamge _mar_img">Photo</span>
                        </button>
                    </div>
                    <div class="_feed_inner_text_area_bottom_event _feed_common">
                        <select
                            value={visibility}
                            onChange={(e) => setVisibility(e.target.value)}
                            style={{padding: '8px', borderRadius: '4px', border: '1px solid #ddd'}}
                        >
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                        </select>
                    </div>
                </div>
                <div class="_feed_inner_text_area_btn">
                    <button type="button" class="_feed_inner_text_area_btn_link" onClick={handlePost}>
                        <span>Post</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PostComposer
