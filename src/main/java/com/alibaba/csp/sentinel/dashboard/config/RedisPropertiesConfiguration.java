package com.alibaba.csp.sentinel.dashboard.config;

public class RedisPropertiesConfiguration {

    private String serverAddr;
    private String port;
    private String database;
    private String groupId = "SENTINEL_GROUP"; // 默认分组
    private String namespace;

    public String getServerAddr() {
        return serverAddr;
    }

    public void setServerAddr(String serverAddr) {
        this.serverAddr = serverAddr;
    }

    public String getGroupId() {
        return groupId;
    }

    public void setGroupId(String groupId) {
        this.groupId = groupId;
    }

    public String getNamespace() {
        return namespace;
    }

    public void setNamespace(String namespace) {
        this.namespace = namespace;
    }

    public String getPort() {
        return port;
    }

    public void setPort(String port) {
    }

    public String getDatabase() {
        return database;
    }

    public void setDatabase(String database) {
    }

}
