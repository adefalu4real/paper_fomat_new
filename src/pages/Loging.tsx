// import React, { useState, useEffect, FormEvent } from "react";
// import styled from "styled-components";
// import IconButton from "@mui/material/IconButton";
// import Visibility from "@mui/icons-material/Visibility";
// import VisibilityOff from "@mui/icons-material/VisibilityOff";
// import { useDispatch } from "react-redux";
// import { AppDispatch } from "../redux/store";
// import { toast } from "react-toastify";
// import { NavLink, useNavigate } from "react-router-dom";
// import { setCredentials } from "../redux/features/auth/authSlice";
// import { loginErrorHandler } from "../utils/ErrorHandllers";
// import { CircularProgress } from "@mui/material";
// import { useLoginMutation } from "../redux/features/auth/authApiSlice";

// interface LoginResponse {
//   user?: {
//     role?: string;
//   };
// }

// export default function LoginUser() {
//   const [email, setEmail] = useState<string>("");
//   const [password, setPassword] = useState<string>("");
//   const [disable, setDisable] = useState<boolean>(true);
//   const [passwordShown, setPasswordShown] = useState<boolean>(false);
//   const [text, setText] = useState<string>("Hide");
//   const [showPassword, setShowPassword] = useState<boolean>(false);

//   const [login, { isLoading }] = useLoginMutation();
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();

//   const loginNewUser = async (e: FormEvent<HTMLButtonElement>) => {
//     e.preventDefault();
//     try {
//       const response: LoginResponse = await login({ email, password }).unwrap();
//       dispatch(setCredentials({ response, email }));

//       if (response.user?.role === "admin") {
//         navigate("/admin/overview");
//       } else {
//         navigate("/");
//       }
//     } catch (error) {
//       const errorMessage = loginErrorHandler(error);
//       toast.error(errorMessage);
//     }
//   };

//   const handleClickShowPassword = () => {
//     setShowPassword((prev) => !prev);
//     setPasswordShown((prev) => !prev);
//   };

//   useEffect(() => {
//     setText(passwordShown ? "Hide" : "Show");
//   }, [passwordShown]);

//   useEffect(() => {
//     setDisable(!email || !password || !email.includes("@"));
//   }, [email, password]);

//   return (
//     <MainDiv>
//       <FormContainer>
//         <FormBox>
//           <NavLogoContainer>
//             <NavLink to={"/"}>
//               <img src="/Assets/logo.png" width={80} height={50} alt="Logo" />
//             </NavLink>
//           </NavLogoContainer>
//           <Text>Welcome Back</Text>
//           <SignUpText>
//             Sign in with your email address and Password
//           </SignUpText>
//           <Form>
//             <InputDiv>
//               <label htmlFor="email">Email address</label>
//               <br />
//               <InputField>
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   placeholder="Enter your email address"
//                   autoComplete="off"
//                   onChange={(e) => setEmail(e.target.value)}
//                 />
//               </InputField>
//             </InputDiv>

//             <InputDiv>
//               <label htmlFor="password">Password</label>
//               <br />
//               <PasswordDiv>
//                 <input
//                   id="password"
//                   type={passwordShown ? "text" : "password"}
//                   placeholder="Enter your password"
//                   name="password"
//                   autoComplete="off"
//                   onChange={(e) => setPassword(e.target.value)}
//                 />
//                 <EyeIcon>
//                   <IconButton
//                     aria-label="toggle password visibility"
//                     onClick={handleClickShowPassword}
//                   >
//                     {showPassword ? <VisibilityOff /> : <Visibility />}
//                   </IconButton>
//                 </EyeIcon>
//               </PasswordDiv>
//             </InputDiv>

//             <SubDiv>
//               <TextDiv>
//                 <CheckBox>
//                   <Round>
//                     <input type="checkbox" id="checkbox" />
//                     <label htmlFor="checkbox"></label>
//                   </Round>
//                 </CheckBox>
//                 <p>Remember me</p>
//               </TextDiv>
//               <NavLink to="/forgotpassword">Forgot Password</NavLink>
//             </SubDiv>

//             {isLoading ? (
//               <SubmitBtn>
//                 <CircularProgress style={{ color: "#fff" }} size={20} />
//               </SubmitBtn>
//             ) : (
//               <SubmitBtn
//                 disabled={disable}
//                 name="submit"
//                 type="submit"
//                 onClick={(e) => loginNewUser(e)}
//               >
//                 log in
//               </SubmitBtn>
//             )}

//             <NoAccount>
//               <p>Don&apos;t have an account?</p>
//               <SignUpBtn href="/register">Sign Up</SignUpBtn>
//             </NoAccount>
//           </Form>
//         </FormBox>
//       </FormContainer>
//     </MainDiv>
//   );
// }

// // -----------------------
// // ✅ Styled Components
// // -----------------------

// const NavLogoContainer = styled.div``;

// const CheckBox = styled.div`
//   margin-right: 14px;
//   margin-bottom: 8px;
// `;

// const Round = styled.div`
//   position: relative;
//   display: flex;
//   align-items: center;

//   label {
//     border: 2px solid #f48708;
//     border-radius: 50%;
//     cursor: pointer;
//     height: 24px;
//     width: 24px;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     position: absolute;
//     top: 0;
//     left: 0;

//     &::after {
//       content: "";
//       position: absolute;
//       top: 8px;
//       left: 4px;
//       width: 12px;
//       height: 4px;
//       border: 2px solid #f48708;
//       border-top: none;
//       border-right: none;
//       transform: rotate(-45deg);
//       opacity: 0;
//     }
//   }

//   input[type="checkbox"] {
//     visibility: hidden;
//   }

//   input[type="checkbox"]:checked + label {
//     border-color: #f48708;
//   }

//   input[type="checkbox"]:checked + label::after {
//     opacity: 1;
//   }
// `;

// const MainDiv = styled.div`
//   width: 100%;
//   height: 100%;
// `;

// const FormContainer = styled.div`
//   background-image: url("/Assets/login.jpg");
//   background-repeat: no-repeat;
//   background-size: cover;
//   background-position: left;
//   height: 100vh;
//   width: 100%;
//   display: flex;
//   justify-content: center;
//   align-items: center;

//   @media (max-width: 1000px) {
//     background: none;
//   }
// `;

// const FormBox = styled.div`
//   width: 486px;
//   background-color: #fff;
//   border-radius: 24px;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   padding: 45px;

//   img {
//     margin-bottom: 30px;
//   }
// `;

// const SubmitBtn = styled.button`
//   margin-top: 50px;
//   padding: 15px;
//   width: 100%;
//   border: none;
//   border-radius: 10px;
//   background-color: #df950e;
//   color: #fff;
//   font-size: 20px;
//   font-family: Inter, sans-serif;
//   cursor: pointer;
//   display: flex;
//   justify-content: center;
//   align-items: center;

//   &:disabled {
//     opacity: 0.25;
//     background: #de8f5f;
//     cursor: not-allowed;
//   }
// `;

// const Form = styled.form`
//   width: 100%;
// `;

// const Text = styled.h4`
//   color: #333;
//   text-align: center;
//   font-size: 32px;
//   font-family: Inter, sans-serif;
//   font-weight: 500;
//   margin: 0 auto;
//   padding-bottom: 7px;
// `;

// const SignUpText = styled.h6`
//   color: #333;
//   text-align: center;
//   font-size: 16px;
//   font-family: Inter, sans-serif;
//   font-weight: 400;
//   margin: 0 auto;
// `;

// const InputDiv = styled.div`
//   width: 100%;
//   margin-top: 30px;

//   input {
//     width: 100%;
//     height: 1.6rem;
//     margin-top: 5px;
//     outline: none;
//     border: none;
//     font-size: 16px;
//     color: rgba(102, 102, 102, 0.6);
//     font-family: Inter, sans-serif;
//   }

//   label {
//     font-size: 16px;
//     color: #666;
//     font-family: Inter, sans-serif;
//   }
// `;

// const InputField = styled.div`
//   border-radius: 12px;
//   border: 1px solid rgba(102, 102, 102, 0.35);
//   padding: 15px;
// `;

// const PasswordDiv = styled.div`
//   border-radius: 12px;
//   border: 1px solid rgba(102, 102, 102, 0.35);
//   padding: 10px;
//   display: flex;
//   justify-content: space-between;
//   `
//  const EyeIcon = styled.div`
//   display: flex;
//   align-items: center;
//   margin: 0 auto;
//   cursor: pointer;
//   p {
//     color: rgba(102, 102, 102, 0.8);
//     text-align: right;
//     font-size: 18px;
//     font-family: Inter;
//     font-style: normal;
//     font-weight: 400;
//     line-height: normal;
//     margin-left: 5px;
//     @media (max-width: 378px) {
//       display: none;
//     }
//   }
// `;
// const SubDiv = styled.div`
//   margin-top: 25px;
//   width: 100%;
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
// `;

// const TextDiv = styled.div`
//   display: flex;
//   align-items: center;
//   p {
//     color: #a3a3a3;
//     font-size: 18px;
//     font-family: Inter;
//     font-style: normal;
//     font-weight: 400;
//     line-height: normal;
//     @media (max-width: 400px) {
//       font-size: 14px;
//     }
//   }
// `;

// const NoAccount = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   margin-top: 10px;
//   gap: 1;
//   p {
//     color: #666;
//     font-size: 18px;
//     font-family: Inter;
//     font-style: normal;
//     font-weight: 400;
//     line-height: normal;
//     @media (max-width: 378px) {
//       font-size: 13px;
//     }
//   }
// `;

// const SignUpBtn = styled.a`
//   color: #666;
//   font-size: 18px;
//   font-family: Inter;
//   font-style: normal;
//   font-weight: 600;
//   line-height: normal;
//   text-decoration: underline;
//   margin-left: 3px;
//   cursor: pointer;
//   @media (max-width: 378px) {
//     font-size: 13px;
//   }
// `;

 
