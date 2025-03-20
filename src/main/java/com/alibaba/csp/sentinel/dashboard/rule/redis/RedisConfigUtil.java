/*
 * Copyright 1999-2018 Alibaba Group Holding Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.alibaba.csp.sentinel.dashboard.rule.redis;

/**
 * @author Eric Zhao
 * @since 1.4.0
 */
public final class RedisConfigUtil {

    public static final String GROUP_ID = "SENTINEL_GROUP";
    //  流控规则
    public static final String FLOW_DATA_ID_POSTFIX = "-flow-rules";
    //  热点规则
    public static final String PARAM_FLOW_DATA_ID_POSTFIX = "-param-rules";
    //    降级规则
    public static final String DEGRADE_DATA_ID_POSTFIX = "-degrade-rules";

    public static final String CLUSTER_MAP_DATA_ID_POSTFIX = "-cluster-map";

    /**
     * cc for `cluster-client`
     */
    public static final String CLIENT_CONFIG_DATA_ID_POSTFIX = "-cc-config";
    /**
     * cs for `cluster-server`
     */
    public static final String SERVER_TRANSPORT_CONFIG_DATA_ID_POSTFIX = "-cs-transport-config";
    public static final String SERVER_FLOW_CONFIG_DATA_ID_POSTFIX = "-cs-flow-config";
    public static final String SERVER_NAMESPACE_SET_DATA_ID_POSTFIX = "-cs-namespace-set";

    //        Redis
    // 最终规则是存储的key
    public static final String RULE_FLOW_PREFIX = ":rule:flow";
    public static final String RULE_PARAM_PREFIX = ":rule:param";
    public static final String RULE_DEGRADE_PREFIX = ":rule:degrade";

    // Redis的订阅发布功能，需要一个通道
    public static final String RULE_FLOW_CHANNEL_PREFIX = ":channel:flow";
    public static final String RULE_PARAM_CHANNEL_PREFIX = ":channel:param";
    public static final String RULE_DEGRADE_CHANNEL_PREFIX = ":channel:degrade";

    // 每一个规则都需要唯一id，基于Redis生成id
    public static final String RULE_FLOW_ID_KEY = "sentinel:id:flow";

    private RedisConfigUtil() {
    }
}
