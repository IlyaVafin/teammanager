import { forwardRef, InputHTMLAttributes } from "react";
import styles from "./input.module.css";
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    className?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({className, ...rest}, ref) => {
    return <input className={`${styles.input} ${className ?? ""}`} {...rest} ref={ref}/>;
})

Input.displayName = "Input"

export default Input;
