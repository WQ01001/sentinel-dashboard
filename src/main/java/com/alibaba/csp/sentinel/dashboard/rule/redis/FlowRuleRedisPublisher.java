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
import org.springframework.util.Assert;

import com.alibaba.csp.sentinel.dashboard.datasource.entity.rule.FlowRuleEntity;
import com.alibaba.csp.sentinel.dashboard.rule.DynamicRulePublisher;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.serializer.SerializerFeature;

/**
 * @author Eric Zhao
 * @since 1.4.0
 */
@Component("flowRuleRedisPublisher")
public class FlowRuleRedisPublisher implements DynamicRulePublisher<List<FlowRuleEntity>> {

    private final Logger logger = LoggerFactory.getLogger(FlowRuleRedisPublisher.class);

    private final RedisTemplate<String, Object> redisTemplate;

    public FlowRuleRedisPublisher(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Override
    public void publish(String app, List<FlowRuleEntity> rules) throws Exception {
        Assert.notNull(app, "app name cannot be empty");
        if (rules == null) {
            return;
        }
        logger.info("flow rule, app name: {}, rules size: {}", app, rules.size());
        // String ruleStr = JSON.toJSONString(rules);
        String ruleStr = JSON.toJSONString(rules, SerializerFeature.DisableCircularReferenceDetect);
        // 数据存储
        redisTemplate.opsForValue().set(app + RedisConfigUtil.FLOW_DATA_ID_POSTFIX, ruleStr);
        // 数据发布
        redisTemplate.convertAndSend(app + RedisConfigUtil.RULE_FLOW_CHANNEL_PREFIX, ruleStr);
    }
}
