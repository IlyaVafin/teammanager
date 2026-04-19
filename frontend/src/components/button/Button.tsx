import { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./button.module.css";
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    className?: string;
    variant?: "black" | "outline" | "ghost";
}
const Button = ({
    children,
    className,
    variant = "black",
    ...rest
}: ButtonProps) => {
    return (
        <button className={`${styles[variant]} ${className ?? ""}`} {...rest}>
            {children}
        </button>
    );
};

export default Button;
