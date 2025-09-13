"use client";
import Image from "next/image";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack"; //  Import Snackbar for error messages

import images from "../../../../constant/images";
import icons from "../../../../constant/icons";
import { DONT_RECEIVE_CODE, EMAIL_OTP_TEXT, GO_TO, LOGIN, MYTD, RESEND_OTP, VERIFY, WELCOME_TEXT } from "../../../../constant/string";
import { homeRoute } from "../../../../constant/router";

const MAX_ATTEMPTS = 5; // Max OTP verification attempts
const VALID_OTP = "1234"; // Set correct OTP for testing

const EmailVerification = () => {
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const [otp, setOtp] = useState<string[]>(new Array(4).fill(""));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [attempts, setAttempts] = useState(0);

    const remainingAttempts = MAX_ATTEMPTS - attempts;

    const handleVerifyOtpClick = () => {
        if (attempts >= MAX_ATTEMPTS) {
            enqueueSnackbar("Too many incorrect attempts. Try again later.", { variant: "error" });
            return;
        }

        const enteredOtp = otp.join("");

        if (enteredOtp === "") {
            enqueueSnackbar("Please enter OTP.", { variant: "warning" });
            return; //  Do NOT decrement attempts if OTP is empty
        }

        if (enteredOtp.length < 4) {
            enqueueSnackbar("OTP must be 4 digits.", { variant: "warning" });
            return; // Do NOT decrement attempts if OTP is incomplete
        }

        if (enteredOtp !== VALID_OTP) {
            setAttempts((prev) => prev + 1); //  Decrement only on incorrect 4-digit OTP
            enqueueSnackbar(`Invalid OTP. ${remainingAttempts - 1} attempts left.`, { variant: "error" });
            return;
        }

        router.push(homeRoute);
    };

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.substring(0, 1);
        setOtp(newOtp);

        if (value && index < otp.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    return (
        <div className="flex flex-row items-center justify-evenly bg-gray-200 h-screen px-10">
            <Image
                src={images.email_verification_screen_image}
                className="w-6/12 max-h-[80vh] object-cover mr-10"
                alt="OTP Illustration"
            />
            <div className="w-full md:w-2/5 bg-white p-8 md:p-10 rounded-xl shadow-lg h-full md:h-2/4">
                <div className="flex-row flex justify-center gap-x-2">
                    <Image src={icons.app_logo} width={30} height={30} alt="logo" className="self-center" />
                    <h1 className="text-2xl font-rubik-medium text-gray-800">
                        {WELCOME_TEXT} <span className="text-blue-600 font-rubik-bold">{MYTD}</span>
                    </h1>
                </div>

                <p className="text-gray-600 text-center mt-2">{EMAIL_OTP_TEXT}</p>

                <div className="flex justify-center gap-2 my-6">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => { inputRefs.current[index] = el; }}
                            type="password"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className="w-12 h-12 border border-gray-700 rounded-md text-center text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            inputMode="numeric"
                            autoComplete="off"
                        />
                    ))}
                </div>

                {/* Disable button if max attempts reached */}
                <button
                    className={`w-full py-3 rounded-lg text-lg transition ${
                        attempts >= MAX_ATTEMPTS
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                    onClick={handleVerifyOtpClick}
                    disabled={attempts >= MAX_ATTEMPTS}
                >
                    {VERIFY}
                </button>

                {/* Show remaining attempts */}
                {attempts < MAX_ATTEMPTS && (
                    <p className="text-red-600 text-center mt-3">
                        {remainingAttempts} attempt{remainingAttempts > 1 ? "s" : ""} left
                    </p>
                )}

                <div className="text-center mt-4 text-sm">
                    <p>
                        {DONT_RECEIVE_CODE} <span className="text-blue-500 cursor-pointer">{RESEND_OTP}</span>
                    </p>
                    <p className="mt-2">
                        {GO_TO} <span className="text-blue-500 cursor-pointer">{LOGIN}</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EmailVerification;
