package com.alibaba.csp.sentinel.dashboard.rule.redis;

import com.alibaba.csp.sentinel.dashboard.datasource.entity.rule.FlowRuleEntity;
import com.alibaba.csp.sentinel.dashboard.datasource.entity.rule.ParamFlowRuleEntity;
import com.alibaba.csp.sentinel.dashboard.rule.DynamicRuleProvider;
import com.alibaba.csp.sentinel.datasource.Converter;
import com.alibaba.csp.sentinel.util.AssertUtil;
import com.alibaba.csp.sentinel.util.StringUtil;
import com.alibaba.fastjson.JSON;
import com.alibaba.nacos.api.config.ConfigService;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Component("paramFlowRuleRedisProvider")
public class ParamFlowRuleRedisProvider implements DynamicRuleProvider<List<ParamFlowRuleEntity>> {

    private final RedisTemplate<String, Object> redisTemplate;

    public ParamFlowRuleRedisProvider(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Override
    public List<ParamFlowRuleEntity> getRules(String appName) throws Exception {
        AssertUtil.notEmpty(appName, "app name cannot be empty");
        String ruleStr = (String) redisTemplate.opsForValue().get(appName + RedisConfigUtil.RULE_PARAM_PREFIX);
        if (StringUtils.isEmpty(ruleStr)) {
            return Collections.emptyList();
        }
        return JSON.parseArray(ruleStr, ParamFlowRuleEntity.class);
    }
}
