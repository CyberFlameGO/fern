import { FernApiEditor } from "@fern-fern/api-editor-sdk";
import { v4 as uuidv4 } from "uuid";
import { TransactionFromType, TransactionPayload, TransactionType } from "./types";

export type TransactionGenerator = {
    [K in TransactionType]: (transaction: TransactionPayload<K>) => TransactionFromType<K>;
};

export const TransactionGenerator: TransactionGenerator = {
    reorderRootPackages: (transaction: TransactionPayload<"reorderRootPackages">) =>
        FernApiEditor.transactions.Transaction.reorderRootPackages({
            ...transaction,
            ...generateBaseTransaction(),
        }),
    createPackage: (transaction: TransactionPayload<"createPackage">) =>
        FernApiEditor.transactions.Transaction.createPackage({
            ...generateBaseTransaction(),
            ...transaction,
        }),
    renamePackage: (transaction: TransactionPayload<"renamePackage">) =>
        FernApiEditor.transactions.Transaction.renamePackage({
            ...generateBaseTransaction(),
            ...transaction,
        }),
    deletePackage: (transaction: TransactionPayload<"deletePackage">) =>
        FernApiEditor.transactions.Transaction.deletePackage({
            ...generateBaseTransaction(),
            ...transaction,
        }),
    reorderPackages: (transaction: TransactionPayload<"reorderPackages">) =>
        FernApiEditor.transactions.Transaction.reorderPackages({
            ...transaction,
            ...generateBaseTransaction(),
        }),
    reorderEndpoints: (transaction: TransactionPayload<"reorderEndpoints">) =>
        FernApiEditor.transactions.Transaction.reorderEndpoints({
            ...generateBaseTransaction(),
            ...transaction,
        }),
    reorderTypes: (transaction: TransactionPayload<"reorderTypes">) =>
        FernApiEditor.transactions.Transaction.reorderTypes({
            ...generateBaseTransaction(),
            ...transaction,
        }),
    reorderErrors: (transaction: TransactionPayload<"reorderErrors">) =>
        FernApiEditor.transactions.Transaction.reorderErrors({
            ...generateBaseTransaction(),
            ...transaction,
        }),
    createEndpoint: (transaction: TransactionPayload<"createEndpoint">) =>
        FernApiEditor.transactions.Transaction.createEndpoint({
            ...generateBaseTransaction(),
            ...transaction,
        }),
    renameEndpoint: (transaction: TransactionPayload<"renameEndpoint">) =>
        FernApiEditor.transactions.Transaction.renameEndpoint({
            ...generateBaseTransaction(),
            ...transaction,
        }),
    deleteEndpoint: (transaction: TransactionPayload<"deleteEndpoint">) =>
        FernApiEditor.transactions.Transaction.deleteEndpoint({
            ...generateBaseTransaction(),
            ...transaction,
        }),
    createType: (transaction: TransactionPayload<"createType">) =>
        FernApiEditor.transactions.Transaction.createType({
            ...generateBaseTransaction(),
            ...transaction,
        }),
    renameType: (transaction: TransactionPayload<"renameType">) =>
        FernApiEditor.transactions.Transaction.renameType({
            ...generateBaseTransaction(),
            ...transaction,
        }),
    setTypeDescription: (transaction: TransactionPayload<"setTypeDescription">) =>
        FernApiEditor.transactions.Transaction.setTypeDescription({
            ...generateBaseTransaction(),
            ...transaction,
        }),
    setTypeShape: (transaction: TransactionPayload<"setTypeShape">) =>
        FernApiEditor.transactions.Transaction.setTypeShape({
            ...generateBaseTransaction(),
            ...transaction,
        }),
    deleteType: (transaction: TransactionPayload<"deleteType">) =>
        FernApiEditor.transactions.Transaction.deleteType({
            ...generateBaseTransaction(),
            ...transaction,
        }),
    createObjectExtension: (transaction: TransactionPayload<"createObjectExtension">) =>
        FernApiEditor.transactions.Transaction.createObjectExtension({
            ...generateBaseTransaction(),
            ...transaction,
        }),
    setObjectExtensionType: (transaction: TransactionPayload<"setObjectExtensionType">) =>
        FernApiEditor.transactions.Transaction.setObjectExtensionType({
            ...generateBaseTransaction(),
            ...transaction,
        }),
    deleteObjectExtension: (transaction: TransactionPayload<"deleteObjectExtension">) =>
        FernApiEditor.transactions.Transaction.deleteObjectExtension({
            ...generateBaseTransaction(),
            ...transaction,
        }),
    createObjectProperty: (transaction: TransactionPayload<"createObjectProperty">) =>
        FernApiEditor.transactions.Transaction.createObjectProperty({
            ...generateBaseTransaction(),
            ...transaction,
        }),
    renameObjectProperty: (transaction: TransactionPayload<"renameObjectProperty">) =>
        FernApiEditor.transactions.Transaction.renameObjectProperty({
            ...generateBaseTransaction(),
            ...transaction,
        }),
    setObjectPropertyType: (transaction: TransactionPayload<"setObjectPropertyType">) =>
        FernApiEditor.transactions.Transaction.setObjectPropertyType({
            ...generateBaseTransaction(),
            ...transaction,
        }),
    setObjectPropertyDescription: (transaction: TransactionPayload<"setObjectPropertyDescription">) =>
        FernApiEditor.transactions.Transaction.setObjectPropertyDescription({
            ...generateBaseTransaction(),
            ...transaction,
        }),
    deleteObjectProperty: (transaction: TransactionPayload<"deleteObjectProperty">) =>
        FernApiEditor.transactions.Transaction.deleteObjectProperty({
            ...generateBaseTransaction(),
            ...transaction,
        }),
    setUnionDiscriminant: (transaction: TransactionPayload<"setUnionDiscriminant">) =>
        FernApiEditor.transactions.Transaction.setUnionDiscriminant({
            ...generateBaseTransaction(),
            ...transaction,
        }),
    createUnionMember: (transaction: TransactionPayload<"createUnionMember">) =>
        FernApiEditor.transactions.Transaction.createUnionMember({
            ...generateBaseTransaction(),
            ...transaction,
        }),
    setUnionMemberDiscriminantValue: (transaction: TransactionPayload<"setUnionMemberDiscriminantValue">) =>
        FernApiEditor.transactions.Transaction.setUnionMemberDiscriminantValue({
            ...generateBaseTransaction(),
            ...transaction,
        }),
    deleteUnionMember: (transaction: TransactionPayload<"deleteUnionMember">) =>
        FernApiEditor.transactions.Transaction.deleteUnionMember({
            ...generateBaseTransaction(),
            ...transaction,
        }),
    createError: (transaction: TransactionPayload<"createError">) =>
        FernApiEditor.transactions.Transaction.createError({
            ...generateBaseTransaction(),
            ...transaction,
        }),
    renameError: (transaction: TransactionPayload<"renameError">) =>
        FernApiEditor.transactions.Transaction.renameError({
            ...generateBaseTransaction(),
            ...transaction,
        }),
    deleteError: (transaction: TransactionPayload<"deleteError">) =>
        FernApiEditor.transactions.Transaction.deleteError({
            ...generateBaseTransaction(),
            ...transaction,
        }),
};

function generateBaseTransaction(): FernApiEditor.transactions.BaseTransaction {
    return {
        transactionId: generateTransactionId(),
        createdAt: new Date(),
    };
}

function generateTransactionId(): FernApiEditor.transactions.TransactionId {
    return uuidv4() as FernApiEditor.transactions.TransactionId;
}
