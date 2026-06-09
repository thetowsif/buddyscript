import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Loginimg from '../assets/images/login.png'
import Companylogo from '../assets/images/logo.svg'
import Googlelogo from '../assets/images/google.svg'
import Shape1 from '../assets/images/shape1.svg'
import Shape2 from '../assets/images/shape2.svg'
import Shape3 from '../assets/images/shape3.svg'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || 'Login failed')
                return
            }

            navigate('/')
        } catch (err) {
            setError('Could not connect to server')
        }
    }

    return (
        <>
            {/* <!--Login Section Start--> */}
	<section class="_social_login_wrapper _layout_main_wrapper" >
		<div class="_shape_one">
			<img src={Shape1} alt="" class="_shape_img" />
			<img src="assets/images/dark_shape.svg" alt="" class="_dark_shape" />
		</div>
		<div class="_shape_two" >
			<img src={Shape2} alt="" class="_shape_img" />
			<img src="assets/images/dark_shape1.svg" alt="" class="_dark_shape _dark_shape_opacity" />
		</div>
		<div class="_shape_three">
			<img src={Shape3} alt="" class="_shape_img" />
			<img src="assets/images/dark_shape2.svg" alt="" class="_dark_shape _dark_shape_opacity" />
		</div>
		<div class="_social_login_wrap">
			<div class="container">
				<div class="row align-items-center">
					<div class="col-xl-8 col-lg-8 col-md-12 col-sm-12">
						<div class="_social_login_left">
							<div class="_social_login_left_image">
								<img src={Loginimg} alt="Image" class="_left_img" />
							</div>
						</div>
					</div>
					<div class="col-xl-4 col-lg-4 col-md-12 col-sm-12">
						<div class="_social_login_content">
							<div class="_social_login_left_logo _mar_b28">
								<img src={Companylogo} alt="Image" class="_left_logo" />
							</div>
							<p class="_social_login_content_para _mar_b8">Welcome back</p>
							<h4 class="_social_login_content_title _titl4 _mar_b50">Login to your account</h4>
							<button type="button" class="_social_login_content_btn _mar_b40">
								<img src={Googlelogo} alt="Image" class="_google_img" /> <span>Or sign-in with  google</span>
							</button>
							<div class="_social_login_content_bottom_txt _mar_b40"> <span>Or</span>
							</div>
							<form class="_social_login_form" onSubmit={handleSubmit}>
								{error && <p style={{color: 'red', marginBottom: '10px'}}>{error}</p>}
								<div class="row">
									<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12">
										<div class="_social_login_form_input _mar_b14">
											<label class="_social_login_label _mar_b8">Email</label>
											<input
                                                type="email"
                                                class="form-control _social_login_input"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
										</div>
									</div>
									<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12">
										<div class="_social_login_form_input _mar_b14">
											<label class="_social_login_label _mar_b8">Password</label>
											<input
                                                type="password"
                                                class="form-control _social_login_input"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
										</div>
									</div>
								</div>
								<div class="row">
									<div class="col-lg-6 col-xl-6 col-md-6 col-sm-12">
										<div class="form-check _social_login_form_check">
											<input class="form-check-input _social_login_form_check_input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" defaultChecked />
											<label class="form-check-label _social_login_form_check_label" htmlFor="flexRadioDefault2">Remember me</label>
										</div>
									</div>
									<div class="col-lg-6 col-xl-6 col-md-6 col-sm-12">
										<div class="_social_login_form_left">
											<p class="_social_login_form_left_para">Forgot password?</p>
										</div>
									</div>
								</div>
								<div class="row">
									<div class="col-lg-12 col-md-12 col-xl-12 col-sm-12">
										<div class="_social_login_form_btn _mar_t40 _mar_b60">
											<button type="submit" class="_social_login_form_btn_link _btn1">Login now</button>
										</div>
									</div>
								</div>
							</form>
							<div class="row">
								<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12">
									<div class="_social_login_bottom_txt">
										<p class="_social_login_bottom_txt_para">Dont have an account? <Link to="/register">Create New Account</Link>
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
	{/* // <!--Login Section End--> */}
        </>
    );
}

export default Login;
