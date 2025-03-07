import React from "react";

export const ApiTabsContext = React.createContext<() => ApiTabsContextValue>(() => {
    throw new Error("ApiTabsContextProvider is not present in this tree.");
});

export interface ApiTabsContextValue {
    tabs: Tab[];
    openTab: (path: string, opts?: OpenTabOpts) => void;
    closeTab: (path: string) => void;
    makeTabLongLived: (path: string) => void;
}

export interface Tab {
    path: string;
    isSelected: boolean;
    isEphemeral: boolean;
}

export interface OpenTabOpts {
    doNotCloseExistingTab?: boolean;
    makeNewTabEphemeral?: boolean;
}
