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
package com.alibaba.csp.sentinel.dashboard.repository.rule;

import java.util.Comparator;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import com.alibaba.csp.sentinel.dashboard.datasource.entity.rule.ParamFlowRuleEntity;
import com.alibaba.csp.sentinel.dashboard.rule.redis.RedisConfigUtil;
import com.alibaba.csp.sentinel.dashboard.rule.redis.RedisIdGenerator;
import com.alibaba.csp.sentinel.slots.block.flow.param.ParamFlowClusterConfig;
import com.alibaba.nacos.common.utils.CollectionUtils;

/**
 * @author Eric Zhao
 * @since 0.2.1
 */
@Component
public class InMemParamFlowRuleStore extends InMemoryRuleRepositoryAdapter<ParamFlowRuleEntity> {

    // private static AtomicLong ids = new AtomicLong(0);

    private final StringRedisTemplate redisTemplate;

    private final RedisIdGenerator redisIdGenerator;

    public InMemParamFlowRuleStore(StringRedisTemplate redisTemplate, RedisIdGenerator redisIdGenerator) {
        this.redisTemplate = redisTemplate;
        this.redisIdGenerator = redisIdGenerator;
    }

    @Override
    protected long nextId() {
        return redisIdGenerator.nextId("rims" + RedisConfigUtil.PARAM_FLOW_DATA_ID_POSTFIX + "-id");
    }

    @Override
    protected long nextId(ParamFlowRuleEntity entity) {
        // 为每个app构造一个唯一的Redis key
        String redisKey = entity.getApp() + RedisConfigUtil.PARAM_FLOW_DATA_ID_POSTFIX + "-id";
        // 检查是否需要初始化
        Boolean hasKey = redisTemplate.hasKey(redisKey);
        if (Boolean.FALSE.equals(hasKey)) {
            // 如果key不存在，且已有规则，则初始化为最大id
            List<ParamFlowRuleEntity> existingRules = this.findAllByApp(entity.getApp());
            if (!CollectionUtils.isEmpty(existingRules)) {
                long maxId = existingRules.stream()
                        .max(Comparator.comparingLong(ParamFlowRuleEntity::getId))
                        .get()
                        .getId();
                // 设置初始值
                redisTemplate.opsForValue().set(redisKey, String.valueOf(maxId));
            }
        }

        // 使用 Optional 处理可能的空值
        Long newId = redisTemplate.opsForValue().increment(redisKey, 1);
        if (newId == null) {
            throw new IllegalStateException("Failed to generate new ID from Redis");
        }

        return newId;
    }

    // @Override
    // protected long nextId() {
    // return ids.incrementAndGet();
    // }

    // @Override
    // protected long nextId(ParamFlowRuleEntity entity) {
    // if (ids.intValue() == 0) { // 如果是重启后 且存在已有规则则赋值为最大id+1
    // if (!CollectionUtils.isEmpty(this.findAllByApp(entity.getApp()))) {
    // long maxId = this.findAllByApp(entity.getApp()).stream()
    // .max(Comparator.comparingLong(ParamFlowRuleEntity::getId)).get().getId();
    // ids.set(maxId);
    // }
    // }
    // return ids.incrementAndGet();
    // }

    @Override
    protected ParamFlowRuleEntity preProcess(ParamFlowRuleEntity entity) {
        if (entity != null && entity.isClusterMode()) {
            ParamFlowClusterConfig config = entity.getClusterConfig();
            if (config == null) {
                config = new ParamFlowClusterConfig();
            }
            // Set cluster rule id.
            config.setFlowId(entity.getId());
        }
        return entity;
    }
}
