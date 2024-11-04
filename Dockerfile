FROM amd64/buildpack-deps:buster-curl as installer
#
ARG SENTINEL_VERSION=1.8.8
#
#RUN set -x \
#    && curl -SL --output /home/sentinel-dashboard.jar https://github.com/alibaba/Sentinel/releases/download/${SENTINEL_VERSION}/sentinel-dashboard-${SENTINEL_VERSION}.jar
COPY ./target/*.jar /home/sentinel-dashboard.jar
#
FROM openjdk:8-jre-slim
#
## copy sentinel jar
COPY --from=installer ["/home/sentinel-dashboard.jar", "/home/sentinel-dashboard.jar"]
#
ENV JAVA_OPTS '-Dserver.port=8858 -Dcsp.sentinel.dashboard.server=localhost:8858'
#
RUN chmod -R +x /home/sentinel-dashboard.jar
#
EXPOSE 8858
#
CMD java ${JAVA_OPTS} -jar /home/sentinel-dashboard.jar

