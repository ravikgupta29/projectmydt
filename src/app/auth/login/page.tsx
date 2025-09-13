"use client";
import Image from "next/image";
import images from "../../../../constant/images";
import icons from "../../../../constant/icons";
import React, { useState } from "react";
import { FaEnvelope, FaKey } from "react-icons/fa";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { LOGIN, MYTD, WELCOME_TEXT } from "../../../../constant/string";
import { emailVerificationRoute } from "../../../../constant/router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSnackbar } from "notistack";

// Strict Email Regex
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Strong Password Policy
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{15,}$/;

// Validation Schema
const validationSchema = Yup.object({
    email: Yup.string()
        .matches(emailRegex, "Invalid email format")
        .required("Email is required")
        .trim(),
    password: Yup.string()
        .matches(passwordRegex, "Invalid password format")
        .required("Password is required")
        .trim(),
});

const LoginScreen = () => {
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar(); // Secure Error Handling

    // Formik Hook
    const formik = useFormik({
        initialValues: { email: "", password: "" },
        validationSchema,
        validateOnChange: false,
        validateOnBlur: false,
        onSubmit: (values) => {
            //Send Data to Secure API (Use HTTPS, Rate-Limiting, & CSRF Protection)
            router.push(emailVerificationRoute);
        },
    });

    return (
        <div className="flex flex-row items-center justify-evenly bg-gray-200 h-screen px-10">
            {/* Left Side Image */}
            <Image
                src={images.login_image}
                className="w-4/12 max-h-[80vh] object-cover"
                alt="login_image"
            />

            {/* Login Form Container */}
            <div className="flex items-center justify-center w-5/12 h-full">
                <div className="bg-white shadow-lg rounded-2xl p-12 w-full h-auto">
                    {/* Logo and Welcome Text */}
                    <div className="flex flex-row items-center mb-8 gap-x-4">
                        <Image src={icons.app_logo} width={60} height={60} alt="logo" />
                        <h1 className="text-4xl font-rubik-medium text-gray-800">
                            {WELCOME_TEXT} <br />
                            <span className="text-blue-600 font-rubik-bold">{MYTD}</span>
                        </h1>
                    </div>

                    {/* Form */}
                    <form onSubmit={formik.handleSubmit} autoComplete="off">
                        {/* Email Input Field */}
                        <div className="relative mb-6">
                             {/*@ts-ignore */}
                            <FaEnvelope className="absolute left-4 top-5 text-gray-500 text-lg" />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                className="w-full pl-12 pr-4 py-4 border rounded-lg text-lg text-gray-700 focus:ring-2 focus:ring-blue-500"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                autoComplete="off" // Prevent autofill vulnerabilities
                            />
                            {formik.touched.email && formik.errors.email && (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
                            )}
                        </div>

                        {/* Password Input Field */}
                        <div className="relative mb-6">
                            {/*@ts-ignore */}
                            <FaKey className="absolute left-4 top-5 text-gray-500 text-lg" />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                className="w-full pl-12 pr-12 py-4 border rounded-lg text-lg text-gray-700 focus:ring-2 focus:ring-blue-500"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                autoComplete="new-password" // Prevent autofill leaks
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-5 text-gray-500 text-lg"
                            >
                                 {/*@ts-ignore */}
                                {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                            </button>
                            {formik.touched.password && formik.errors.password && (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
                            )}
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-4 text-xl rounded-lg hover:bg-blue-700 transition"
                            onClick={() => {
                              
                            }}
                        >
                            {LOGIN}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;
