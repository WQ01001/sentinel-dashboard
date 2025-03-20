package com.alibaba.csp.sentinel.dashboard.rule.redis;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

@Component
public class RedisIdGenerator {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    public long nextId(String key) {
        return redisTemplate.opsForValue().increment(key, 1);
    }
}

