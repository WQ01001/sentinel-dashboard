package com.alibaba.csp.sentinel.dashboard.rule.redis;

import java.util.Collections;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import com.alibaba.csp.sentinel.dashboard.datasource.entity.rule.ParamFlowRuleEntity;
import com.alibaba.csp.sentinel.dashboard.rule.DynamicRuleProvider;
import com.alibaba.csp.sentinel.util.AssertUtil;
import com.alibaba.fastjson.JSON;

@Component("paramFlowRuleRedisProvider")
public class ParamFlowRuleRedisProvider implements DynamicRuleProvider<List<ParamFlowRuleEntity>> {

    private final RedisTemplate<String, Object> redisTemplate;

    public ParamFlowRuleRedisProvider(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Override
    public List<ParamFlowRuleEntity> getRules(String appName) throws Exception {
        AssertUtil.notEmpty(appName, "app name cannot be empty");
        String ruleStr = (String) redisTemplate.opsForValue().get(appName + RedisConfigUtil.PARAM_FLOW_DATA_ID_POSTFIX);
        if (StringUtils.isEmpty(ruleStr)) {
            return Collections.emptyList();
        }
        return JSON.parseArray(ruleStr, ParamFlowRuleEntity.class);
    }
}
