import { HTMLAttributes, ReactNode } from "react";
interface FieldProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    gap: number;
    direction: "column" | "row";
}
const Field = ({ children, gap, direction, ...rest }: FieldProps) => {
    return (
        <div
            style={{
                display: "flex",
                gap: `${gap}px`,
                flexDirection: direction,
            }}
            {...rest}
        >
            {children}
        </div>
    );
};

export default Field;
