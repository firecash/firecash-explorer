import React from "react";

interface ButtonProps {
  primary?: boolean;
  value: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

const Button = (props: ButtonProps) => {
  let className =
    "rounded-full h-8 hover:cursor-pointer hover:bg-primary-hover focus:bg-primary-hover px-6 py-2" +
    " flex flex-row items-center justify-center text-nowrap " +
    `${props.className}`;

  if (props.primary) {
    className += " bg-primary text-[#fff7f3]";
  } else {
    className += " text-gray-500 bg-white border border-gray-200";
  }

  return (
    <button className={className} onClick={props.onClick}>
      {props.value}
    </button>
  );
};

export default Button;
