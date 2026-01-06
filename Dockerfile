# Run stage
FROM eclipse-temurin:17-jre
WORKDIR /app

# Copy the jar from local target directory
COPY target/sentinel-dashboard.jar sentinel-dashboard.jar

# Set environment variables
ENV JAVA_OPTS '-Dserver.port=8858 -Dcsp.sentinel.dashboard.server=localhost:8858'

# Expose port
EXPOSE 8858

# Run the application
CMD ["sh", "-c", "java $JAVA_OPTS -jar sentinel-dashboard.jar"]