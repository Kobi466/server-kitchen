FROM maven:3.9.6-eclipse-temurin AS build
WORKDIR /app

# Cài Java 24.0.1 từ Oracle
RUN apt-get update && apt-get install -y wget \
  && wget https://download.oracle.com/java/24/latest/jdk-24_linux-x64_bin.deb \
  && apt install -y ./jdk-24_linux-x64_bin.deb \
  && update-alternatives --install /usr/bin/java java /usr/lib/jvm/jdk-24.0.1-oracle-x64/bin/java 1 \
  && update-alternatives --set java /usr/lib/jvm/jdk-24.0.1-oracle-x64/bin/java \
  && java -version

COPY . .
RUN mvn clean package -DskipTests

FROM debian:bullseye-slim
WORKDIR /app

# Copy JDK đã cài từ stage trước
COPY --from=build /usr/lib/jvm/jdk-24.0.1-oracle-x64 /usr/lib/jvm/jdk-24
COPY --from=build /usr/bin/java /usr/bin/java

COPY --from=build /app/target/*.war app.war
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.war"]
