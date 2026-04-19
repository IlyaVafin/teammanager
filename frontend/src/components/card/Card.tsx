import { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import styles from "./card.module.css";
interface CardBaseProps<T extends ElementType> {
    children: ReactNode;
    className?: string;
    tag: T;
}

type CardProps<T extends ElementType> = CardBaseProps<T> &
    Omit<ComponentPropsWithoutRef<T>, keyof CardBaseProps<T>>;

const Card = <T extends ElementType = "div">({
    children,
    className,
    tag,
    ...rest
}: CardProps<T>) => {
    const Tag = tag as ElementType;
    return (
        <Tag {...rest} className={`${styles.card} ${className ?? ""}`}>
            {children}
        </Tag>
    );
};

export default Card;
