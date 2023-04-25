import React from 'react';

interface SignInTextFieldProps {
    placeholder: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    type: string
}

const SignInTextField = (props: SignInTextFieldProps) => {
    return (
        <input className="bg-gray-200 border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-moon-500"
            type={props.type} placeholder={props.placeholder} onChange={props.onChange}/>
    )
};

export default SignInTextField;