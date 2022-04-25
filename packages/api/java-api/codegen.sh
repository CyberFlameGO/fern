# Download java codegen plugin and invoke
version="f0b6fb6"
rm -rf fern-model-codegen-"$version"-"$version"
wget --user "$JFROG_USERNAME" --password "$JFROG_API_KEY" \
  https://usebirch.jfrog.io/artifactory/default-maven-local/com/fern/java/fern-model-codegen/"$version"/fern-model-codegen-"$version".zip
unzip fern-model-codegen-"$version".zip
cd fern-model-codegen-"$version"-"$version"
java -cp fern-model-codegen-"$version".jar:lib/* com.fern.model.codegen.ModelGeneratorCli ../../generated/ir.json ../fern-api-model/
