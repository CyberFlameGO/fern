package com.fern;

import com.fasterxml.jackson.annotation.*;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fern.immutables.StagedBuilderStyle;
import org.immutables.value.Value;

import javax.naming.Name;
import java.util.Map;
import java.util.Optional;

@Value.Enclosing
public final class TypeReference {

    private final Base value;

    @JsonCreator(mode = JsonCreator.Mode.DELEGATING)
    private TypeReference(Base value) {
        this.value = value;
    }

    @JsonValue
    private Base getValue() {
        return value;
    }

    public static TypeReference named(NamedTypeReference value) {
        return new TypeReference(Named.of(value));
    }

    public static TypeReference primitive(PrimitiveType value) {
        return new TypeReference(Primitive.of(value));
    }

    public static TypeReference container(ContainerType value) {
        return new TypeReference(Container.of(value));
    }

    public boolean isNamed() {
        return value instanceof Named;
    }

    public boolean isPrimitive() {
        return value instanceof Primitive;
    }

    public boolean isContainer() {
        return value instanceof Container;
    }

    public Optional<NamedTypeReference> getNamed(){
        if (isNamed()) {
            return Optional.of(((Named) value).named());
        }
        return Optional.empty();
    }

    public Optional<PrimitiveType> getPrimitive() throws ClassCastException {
        if (isPrimitive()) {
            return Optional.of(((Primitive) value).primitive());
        }
        return Optional.empty();
    }

    public Optional<ContainerType> getContainer() throws ClassCastException {
        if (isContainer()) {
            return Optional.of(((Container) value).container());
        }
        return Optional.empty();
    }

    public <T> T accept(Visitor<T> visitor) {
        return value.accept(visitor);
    }

    public interface Visitor<T> {
        T visitNamed(NamedTypeReference value);

        T visitPrimitive(PrimitiveType value);

        T visitContainer(ContainerType value);

        T visitUnknown(String unknownType);
    }

    @JsonTypeInfo(
            use = JsonTypeInfo.Id.NAME,
            include = JsonTypeInfo.As.PROPERTY,
            property = "type",
            visible = true,
            defaultImpl = Unknown.class)
    @JsonSubTypes({
            @JsonSubTypes.Type(value = Named.class, name = "named"),
            @JsonSubTypes.Type(value = Primitive.class, name = "primitive"),
            @JsonSubTypes.Type(value = Container.class, name = "container")
    })
    @JsonIgnoreProperties(ignoreUnknown = true)
    private interface Base {
        <T> T accept(Visitor<T> visitor);
    }

    @Value.Immutable()
    @JsonTypeName("named")
    @JsonDeserialize(as = ImmutableTypeReference.Named.class)
    interface Named extends Base {

        @JsonValue
        NamedTypeReference named();

        @Override
        default <T> T accept(Visitor<T> visitor) {
            return visitor.visitNamed(named());
        }

        static Named of(NamedTypeReference value) {
            return ImmutableTypeReference.Named.builder().named(value).build();
        }
    }

    @Value.Immutable
    @JsonTypeName("primitive")
    @JsonDeserialize(as = ImmutableTypeReference.Primitive.class)
    interface Primitive extends Base {

        PrimitiveType primitive();

        @Override
        default <T> T accept(Visitor<T> visitor) {
            return visitor.visitPrimitive(primitive());
        }

        static Primitive of(PrimitiveType value) {
            return ImmutableTypeReference.Primitive.builder().primitive(value).build();
        }
    }

    @Value.Immutable
    @JsonTypeName("container")
    @JsonDeserialize(as = ImmutableTypeReference.Container.class)
    public interface Container extends Base {

        @JsonValue
        ContainerType container();

        @Override
        default <T> T accept(Visitor<T> visitor) {
            return visitor.visitContainer(container());
        }

        static Container of(ContainerType value) {
            return ImmutableTypeReference.Container.builder().container(value).build();
        }
    }

    @Value.Immutable
    @JsonDeserialize(as = ImmutableTypeReference.Unknown.class)
    interface Unknown extends Base {

        @JsonValue
        Map<String, Object> value();

        default String type() {
            return value().get("type").toString();
        }

        @Override
        default <T> T accept(Visitor<T> visitor) {
            return visitor.visitUnknown(type());
        }
    }
}
