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

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import com.alibaba.csp.sentinel.dashboard.datasource.entity.rule.ParamFlowRuleEntity;
import com.alibaba.csp.sentinel.dashboard.rule.DynamicRulePublisher;
import com.alibaba.csp.sentinel.util.AssertUtil;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.serializer.SerializerFeature;

/**
 * @author Eric Zhao
 * @since 1.4.0
 */
@Component("paramFlowRuleRedisPublisher")
public class ParamFlowRuleRedisPublisher implements DynamicRulePublisher<List<ParamFlowRuleEntity>> {

    private final Logger logger = LoggerFactory.getLogger(ParamFlowRuleRedisPublisher.class);

    private final RedisTemplate<String, Object> redisTemplate;

    public ParamFlowRuleRedisPublisher(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Override
    public void publish(String app, List<ParamFlowRuleEntity> rules) throws Exception {
        AssertUtil.notEmpty(app, "app name cannot be empty");
        if (rules == null) {
            return;
        }
        logger.info("param rule, app name: {}, rules size: {}", app, rules.size());
        String ruleStr = JSON.toJSONString(rules, SerializerFeature.DisableCircularReferenceDetect);
        // 数据存储
        redisTemplate.opsForValue().set(app + RedisConfigUtil.PARAM_FLOW_DATA_ID_POSTFIX, ruleStr);
        // 数据发布
        redisTemplate.convertAndSend(app + RedisConfigUtil.RULE_PARAM_CHANNEL_PREFIX, ruleStr);
    }

    /**
     * @return 格式化后的JSON字符串
     */
    private String toPrettyFormat(String json) {
        JSONArray jsonArray = JSON.parseArray(json);
        return JSON.toJSONString(jsonArray, true);
    }
}
