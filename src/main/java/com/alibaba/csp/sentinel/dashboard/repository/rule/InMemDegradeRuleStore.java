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
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.stereotype.Component;

import com.alibaba.csp.sentinel.dashboard.datasource.entity.rule.DegradeRuleEntity;
import com.alibaba.nacos.common.utils.CollectionUtils;

/**
 * @author leyou
 */
@Component
public class InMemDegradeRuleStore extends InMemoryRuleRepositoryAdapter<DegradeRuleEntity> {

    private static AtomicLong ids = new AtomicLong(0);

    @Override
    protected long nextId() {
        return ids.incrementAndGet();
    }

    @Override
    protected long nextId(DegradeRuleEntity entity) {
        if (ids.intValue() == 0) {//如果是重启后 且存在已有规则则赋值为最大id+1
            if (!CollectionUtils.isEmpty(this.findAllByApp(entity.getApp()))) {
                long maxId = this.findAllByApp(entity.getApp()).stream().max(Comparator.comparingLong(DegradeRuleEntity::getId)).get().getId();
                ids.set(maxId);
            }
        }
        return ids.incrementAndGet();
    }
}
