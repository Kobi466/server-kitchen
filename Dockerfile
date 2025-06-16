FROM maven:3.9.6-eclipse-temurin AS build
WORKDIR /app

# Cài Java 24 (Oracle)
RUN apt-get update && apt-get install -y wget \
  && wget https://download.oracle.com/java/24/latest/jdk-24_linux-x64_bin.deb \
  && apt install -y ./jdk-24_linux-x64_bin.deb \
  && update-alternatives --install /usr/bin/java java /usr/lib/jvm/jdk-24-oracle/bin/java 1 \
  && update-alternatives --set java /usr/lib/jvm/jdk-24-oracle/bin/java \
  && java -version

COPY . .
RUN mvn clean package -DskipTests

FROM eclipse-temurin:24-jre
WORKDIR /app
COPY --from=build /app/target/*.war app.war
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.war"]
