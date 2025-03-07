import classNames from "classnames";
import React, { PropsWithChildren } from "react";
import styles from "./MonospaceText.module.scss";

export declare namespace MonospaceText {
    export type Props = PropsWithChildren<{
        className?: string;
    }>;
}

export const MonospaceText: React.FC<MonospaceText.Props> = ({ className, children }) => {
    return <span className={classNames(className, styles.container)}>{children}</span>;
};
