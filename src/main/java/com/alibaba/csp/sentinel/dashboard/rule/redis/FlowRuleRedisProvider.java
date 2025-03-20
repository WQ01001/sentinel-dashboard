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

import com.alibaba.csp.sentinel.dashboard.datasource.entity.rule.FlowRuleEntity;
import com.alibaba.csp.sentinel.dashboard.rule.DynamicRuleProvider;
import com.alibaba.csp.sentinel.util.AssertUtil;
import com.alibaba.fastjson.JSON;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;

import java.util.Collections;
import java.util.List;


/**
 * @author Eric Zhao
 * @since 1.4.0
 */
@Component("flowRuleRedisProvider")
public class FlowRuleRedisProvider implements DynamicRuleProvider<List<FlowRuleEntity>> {

    private final RedisTemplate<String, Object> redisTemplate;

    public FlowRuleRedisProvider(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Override
    public List<FlowRuleEntity> getRules(String appName) throws Exception {

        AssertUtil.notEmpty(appName, "app name cannot be empty");
        String ruleStr = (String) redisTemplate.opsForValue().get(appName + RedisConfigUtil.RULE_FLOW_PREFIX);
        if (StringUtils.isEmpty(ruleStr)) {
            return Collections.emptyList();
        }
        return JSON.parseArray(ruleStr, FlowRuleEntity.class);
    }
}
