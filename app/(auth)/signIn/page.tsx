
'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import Inputfield from '@/components/forms/Inputfield';
import Footerlink from '@/components/forms/Footerlink';
//import {signInWithEmail, signUpWithEmail} from "@/lib/actions/auth.actions";
//import {toast} from "sonner";
//import {signInEmail} from "better-auth/api";
import {useRouter} from "next/navigation";

const SignIn = () => {
    const router = useRouter()
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignInFormData>({
        defaultValues: {
            email: '',
            password: '',
        },
        mode: 'onBlur',
    });

    // const onSubmit = async (data: SignInFormData) => {
    //     try {
    //         const result = await signInWithEmail(data);
    //         if(result.success) router.push('/');
    //     } catch (e) {
    //         console.error(e);
    //         toast.error('Sign in failed', {
    //             description: e instanceof Error ? e.message : 'Failed to sign in.'
    //         })
    //     }
    // }
    const onSubmit = async (data: SignInFormData) => {
        try {
            console.log(data);
        }catch(err) {
            console.log(err);
        }
    }

    return (
        <>
            <h1 className="form-title">Welcome back</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <Inputfield
                    name="email"
                    label="Email"
                    placeholder="Harshrajput20030101@gmail.com"
                    register={register}
                    error={errors.email}
                    validation={{ required: 'Email is required', pattern: /^\w+@\w+\.\w+$/ }}
                />

                <Inputfield
                    name="password"
                    label="Password"
                    placeholder="Enter your password"
                    type="password"
                    register={register}
                    error={errors.password}
                    validation={{ required: 'Password is required', minLength: 8 }}
                />

                <Button type="submit" disabled={isSubmitting} className="yellow-btn w-full mt-5">
                    {isSubmitting ? 'Signing In' : 'Sign In'}
                </Button>

                <Footerlink text="Don't have an account?" linkText="Create an account" href="/signUp" />
            </form>
        </>
    );
};
export default SignIn;