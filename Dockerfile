# Build stage
FROM maven:3.8.6-openjdk-8-slim AS build
WORKDIR /app

# Copy pom.xml and source code
COPY pom.xml .
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Find the built jar (excluding original) and rename it for easier copying
RUN find target -maxdepth 1 -name "*.jar" ! -name "*.original" -exec cp {} app.jar \;

# Run stage
FROM openjdk:8-jre-slim
WORKDIR /app

# Copy the jar from build stage
COPY --from=build /app/app.jar sentinel-dashboard.jar

# Set environment variables
ENV JAVA_OPTS '-Dserver.port=8858 -Dcsp.sentinel.dashboard.server=localhost:8858'

# Expose port
EXPOSE 8858

# Run the application
CMD ["sh", "-c", "java $JAVA_OPTS -jar sentinel-dashboard.jar"]