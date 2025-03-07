export const GeneratorName = {
    TYPESCRIPT: "fernapi/fern-typescript",
    TYPESCRIPT_SDK: "fernapi/fern-typescript-sdk",
    TYPESCRIPT_EXPRESS: "fernapi/fern-typescript-express",
    JAVA: "fernapi/fern-java",
    JAVA_MODEL: "fernapi/java-model",
    JAVA_SDK: "fernapi/fern-java-sdk",
    JAVA_SPRING: "fernapi/fern-java-spring",
    PYTHON_FASTAPI: "fernapi/fern-fastapi-server",
    PYTHON_PYDANTIC: "fernapi/fern-pydantic-model",
    OPENAPI: "fernapi/fern-openapi",
    POSTMAN: "fernapi/fern-postman",
    OPENAPI_PYTHON_CLIENT: "fernapi/openapi-python-client",
} as const;

export type GeneratorName = typeof GeneratorName[keyof typeof GeneratorName];
