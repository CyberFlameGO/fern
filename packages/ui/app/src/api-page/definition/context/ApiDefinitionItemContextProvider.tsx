import { PropsWithChildren, useCallback } from "react";
import { ParsedEnvironmentId } from "../../routes/useCurrentEnvironment";
import { ApiDefinitionItemContext, ApiDefinitionItemContextValue } from "./ApiDefinitionItemContext";

export declare namespace ApiDefinitionItemContextProvider {
    export type Props = PropsWithChildren<{
        environmentId: ParsedEnvironmentId;
    }>;
}

export const ApiDefinitionItemContextProvider: React.FC<ApiDefinitionItemContextProvider.Props> = ({
    environmentId,
    children,
}) => {
    const contextValue = useCallback(
        (): ApiDefinitionItemContextValue => ({
            environmentId,
        }),
        [environmentId]
    );

    return <ApiDefinitionItemContext.Provider value={contextValue}>{children}</ApiDefinitionItemContext.Provider>;
};
