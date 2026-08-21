# Build stage
FROM maven:3.9.6-eclipse-temurin-17-alpine AS build
WORKDIR /app
COPY pom.xml .
# Download dependencies first for caching
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn package -DskipTests

# Production stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Create non-root user and media directory
RUN addgroup -S appgroup && adduser -S appuser -G appgroup && \
    mkdir -p /var/haribhakthi_media_storage && \
    chown -R appuser:appgroup /var/haribhakthi_media_storage /app

COPY --from=build /app/target/*.jar app.jar

USER appuser

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
