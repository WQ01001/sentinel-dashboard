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
package com.alibaba.csp.sentinel.dashboard.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

/**
 * @author Eric Zhao
 * @since 1.4.0
 */
@Configuration
public class RedisConfig {


//    @Bean
//    public Converter<List<FlowRuleEntity>, String> flowRuleEntityEncoder() {
//        return JSON::toJSONString;
//    }
//
//    @Bean
//    public Converter<String, List<FlowRuleEntity>> flowRuleEntityDecoder() {
//        return s -> JSON.parseArray(s, FlowRuleEntity.class);
//    }
//
//    @Bean
//    public Converter<List<DegradeRuleEntity>, String> degradeRuleEntityEncoder() {
//        return JSON::toJSONString;
//    }
//
//    @Bean
//    public Converter<String, List<DegradeRuleEntity>> degradeRuleEntityDecoder() {
//        return s -> JSON.parseArray(s, DegradeRuleEntity.class);
//    }
//
//    @Bean
//    public Converter<List<ParamFlowRuleEntity>, String> paramFlowRuleEntityEncoder() {
//        return JSON::toJSONString;
//    }
//
//    @Bean
//    public Converter<String, List<ParamFlowRuleEntity>> paramFlowRuleEntityDecoder() {
//        return s -> JSON.parseArray(s, ParamFlowRuleEntity.class);
//    }


//    @Bean
//    public ConfigService redisConfigService(RedisPropertiesConfiguration redisPropertiesConfiguration) throws Exception {
//        Properties properties = new Properties();
//        properties.put(PropertyKeyConst.SERVER_ADDR, redisPropertiesConfiguration.getServerAddr());
//        properties.put(PropertyKeyConst.NAMESPACE, redisPropertiesConfiguration.getNamespace());
//        properties.put("groupId", redisPropertiesConfiguration.getGroupId());
//        LOGGER.info("redisPropertiesConfiguration.getServerAddr() = {}", redisPropertiesConfiguration.getServerAddr());
//        LOGGER.info("redisPropertiesConfiguration.getNamespace() = {}", redisPropertiesConfiguration.getNamespace());
//        return ConfigFactory.createConfigService(properties);
//    }

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory factory) {
        RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(factory);
        redisTemplate.setEnableTransactionSupport(true);
        GenericJackson2JsonRedisSerializer jsonRedisSerializer = new GenericJackson2JsonRedisSerializer();
        StringRedisSerializer stringRedisSerializer = new StringRedisSerializer();
        redisTemplate.setValueSerializer(jsonRedisSerializer);
        redisTemplate.setKeySerializer(stringRedisSerializer);
        redisTemplate.setHashKeySerializer(stringRedisSerializer);
        redisTemplate.setHashValueSerializer(jsonRedisSerializer);
        redisTemplate.afterPropertiesSet();
        return redisTemplate;
    }
}
