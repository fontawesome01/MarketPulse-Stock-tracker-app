'use client'
import {SubmitHandler, useForm} from "react-hook-form";
import Form from "next/form";
import {Button} from "@/components/ui/button";
import Inputfield from "@/components/forms/Inputfield";
import Selectfield from "@/components/forms/Selectfield";
import {INVESTMENT_GOALS, PREFERRED_INDUSTRIES, RISK_TOLERANCE_OPTIONS} from "@/lib/constant";
import {CountrySelectField} from "@/components/forms/CountrySelectField";
import Footerlink from "@/components/forms/Footerlink";


const Page = () => {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors,isSubmitting },
    } = useForm<SignUpFormData>({
        defaultValues:{
            fullName: '',
            email: '',
            password: '',
            country: 'INDIA',
            investmentGoals: 'Growth',
            riskTolerance: 'Medium',
            preferredIndustry: 'Technology',
        },
        mode:'onBlur'


    },);
     const onsubmit = async (data: SignUpFormData) => {
        try {
            console.log(data);
        }catch(err) {
            console.log(err);
        }
    }
    return (
       <>
           <h1 className="form-title">SignUp & personalize</h1>
           <form onSubmit={handleSubmit(onsubmit)} className="space-y-2">
               <Inputfield
                   name="fullName"
                   label="Full Name"
                   placeholder="Harsh Rajput"
                   register={register}
                   error={errors.fullName}
                   validation={{required:'Full name is required',minlength:4}}
               />
               <Inputfield
                   name="email"
                   label="Email"
                   placeholder="harshrajput20030101@gmail.com"
                   register={register}
                   error={errors.email}
                   validation={{required:'Email is required',pattern:/^\w+@\w+\.\w+$/,message:'Email is required' }}
               />
               <Inputfield
                   name="password"
                   label="Password"
                   placeholder="Enter a strong password"
                   register={register}
                   type="password"
                   error={errors.password}
                   validation={{required:'Password must be very strong',minlength:4}}
               />
               <CountrySelectField
                   name="country"
                   label="Country"
                   control={control}
                   error={errors.country}
                   required={true}

               />
               <Selectfield
               name="investmentGoals"
               label="Investments Goals"
               placeholder="Select Your Investments Goal"
               options={INVESTMENT_GOALS}
               control={control}
               error={errors.investmentGoals}
               />
               <Selectfield
                   name="risktolerence"
                   label="Risk Tolerance"
                   placeholder="Select Your Risk tolerence"
                   options={RISK_TOLERANCE_OPTIONS}
                   control={control}
                   error={errors.riskTolerance}
               />
               <Selectfield
                   name="preferredIndustry"
                   label="Preferred Industry"
                   placeholder="Select Your Industry"
                   options={PREFERRED_INDUSTRIES}
                   control={control}
                   error={errors.preferredIndustry}
               />

               <Button type="submit"  disabled={isSubmitting} className="yellow-btn w-full mt-2">
                   {isSubmitting ? 'creating account' : 'Start Saving With Us'}
               </Button>

               <Footerlink text="Already have an Account" linkText="Sign in" href="/signIn"/>
           </form>
       </>
    )
}
export default Page
