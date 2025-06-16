# Build stage
FROM maven:3.9.7-eclipse-temurin-24 AS build
WORKDIR /app

# Copy pom.xml và tải trước dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy code và build
COPY . .
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:24-jre
WORKDIR /app

# Copy file WAR
COPY --from=build /app/target/DrComputer-0.0.1-SNAPSHOT.war app.war

# Mở cổng 8080
EXPOSE 8080

# Chạy WAR Spring Boot
ENTRYPOINT ["java", "-jar", "app.war"]
