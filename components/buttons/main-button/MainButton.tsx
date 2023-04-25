import React from 'react';

interface MainButtonProps {
    onClick: () => void;
    text: string;
}

const MainButton = (props: MainButtonProps) => {
    return (
        <button className="bg-moon-500 hover:bg-moon-300 text-white font-bold py-2 px-4 rounded"
                onClick={props.onClick}>
            {props.text}
        </button>
    );
};

export default MainButton;