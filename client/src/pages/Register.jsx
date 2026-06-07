import React from 'react'
import Registrationimg from '../assets/images/registration.png'
import Companylogo from '../assets/images/logo.svg'
import Googlelogo from '../assets/images/google.svg'
import Shape1 from '../assets/images/shape1.svg'
import Shape2 from '../assets/images/shape2.svg'
import Shape3 from '../assets/images/shape3.svg'

const Register = () => {
    return (
        <>
            {/* <!--Registration Section Start--> */}
	<section class="_social_registration_wrapper _layout_main_wrapper" >
		<div class="_shape_one">
			<img src={Shape1} alt="" class="_shape_img" />
			<img src="assets/images/dark_shape.svg" alt="" class="_dark_shape" />
		</div>
		<div class="_shape_two">
			<img src={Shape2} alt="" class="_shape_img" />
			<img src="assets/images/dark_shape1.svg" alt="" class="_dark_shape _dark_shape_opacity" />
		</div>
		<div class="_shape_three">
			<img src={Shape3} alt="" class="_shape_img" />
			<img src="assets/images/dark_shape2.svg" alt="" class="_dark_shape _dark_shape_opacity" />
		</div>
		<div class="_social_registration_wrap">
			<div class="container">
				<div class="row align-items-center">
					<div class="col-xl-8 col-lg-8 col-md-12 col-sm-12">
						<div class="_social_registration_right">
							<div class="_social_registration_right_image">
								<img src={Registrationimg} alt="Image" />
							</div>
							<div class="_social_registration_right_image_dark">
								<img src={Registrationimg} alt="Image" />
							</div>
						</div>
					</div>
					<div class="col-xl-4 col-lg-4 col-md-12 col-sm-12">
						<div class="_social_registration_content">
							<div class="_social_registration_right_logo _mar_b28">
								<img src={Companylogo} alt="Image" class="_right_logo" />
							</div>
							<p class="_social_registration_content_para _mar_b8">Get Started Now</p>
							<h4 class="_social_registration_content_title _titl4 _mar_b50">Registration</h4>
							<button type="button" class="_social_registration_content_btn _mar_b40">
								<img src={Googlelogo} alt="Image" class="_google_img" /> <span>Register with google</span>
							</button>
							<div class="_social_registration_content_bottom_txt _mar_b40"> <span>Or</span>
							</div>
							<form class="_social_registration_form">
								<div class="row">
									<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12">
										<div class="_social_registration_form_input _mar_b14">
											<label class="_social_registration_label _mar_b8">Email</label>
											<input type="email" class="form-control _social_registration_input" />
										</div>
									</div>
									<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12">
										<div class="_social_registration_form_input _mar_b14">
											<label class="_social_registration_label _mar_b8">Password</label>
											<input type="password" class="form-control _social_registration_input" />
										</div>
									</div>
									<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12">
										<div class="_social_registration_form_input _mar_b14">
											<label class="_social_registration_label _mar_b8">Repeat Password</label>
											<input type="password" class="form-control _social_registration_input" />
										</div>
									</div>
								</div>
								<div class="row">
									<div class="col-lg-12 col-xl-12 col-md-12 col-sm-12">
										<div class="form-check _social_registration_form_check">
											<input class="form-check-input _social_registration_form_check_input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" checked />
											<label class="form-check-label _social_registration_form_check_label" for="flexRadioDefault2">I agree to terms & conditions</label>
										</div>
									</div>
								</div>
								<div class="row">
									<div class="col-lg-12 col-md-12 col-xl-12 col-sm-12">
										<div class="_social_registration_form_btn _mar_t40 _mar_b60">
											<button type="button" class="_social_registration_form_btn_link _btn1">Login now</button>
										</div>
									</div>
								</div>
							</form>
							<div class="row">
								<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12">
									<div class="_social_registration_bottom_txt">
										<p class="_social_registration_bottom_txt_para">Dont have an account? <a href="#0">Create New Account</a>
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
	{/* <!--Registration Section End--></div> */}
        </>
    );
}

export default Register;