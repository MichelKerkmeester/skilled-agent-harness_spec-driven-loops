---
name: performance-optimization
description: Optimize code and system performance
category: optimization
triggers:
  - performance
  - optimize
  - speed
  - memory
version: 0.1.0
requires:
  - goop-core
---

# Performance Optimization Skill

## Optimization Principles

### 1. Measure First
Never optimize without profiling data.

### 2. Focus on Bottlenecks
Optimize the slowest 20%, not everything.

### 3. Maintain Readability
Performance gains shouldn't sacrifice clarity.

### 4. Test After Changes
Verify optimizations don't break functionality.

## Common Bottlenecks

### Database
- N+1 queries
- Missing indexes
- Unoptimized queries
- Connection pool exhaustion

### Network
- Too many requests
- Large payloads
- Missing caching
- Slow DNS resolution

### CPU
- Inefficient algorithms
- Unnecessary computation
- Blocking operations
- Poor parallelization

### Memory
- Memory leaks
- Large objects in memory
- Unnecessary copies
- Missing garbage collection

## Profiling Tools

### JavaScript/Node.js
```bash
# CPU profiling
node --prof app.js
node --prof-process isolate-*.log

# Memory profiling
node --inspect app.js
# Open chrome://inspect

# Benchmark
npm install -g autocannon
autocannon -c 100 -d 30 http://localhost:3000
```

### Database
```sql
-- PostgreSQL
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';

-- Add index
CREATE INDEX idx_users_email ON users(email);
```

## Optimization Patterns

### Caching
```typescript
const cache = new Map();

async function getData(id: string) {
  if (cache.has(id)) {
    return cache.get(id);
  }
  const data = await fetchData(id);
  cache.set(id, data);
  return data;
}
```

### Batching
```typescript
// Instead of N individual queries
const users = await Promise.all(ids.map(id => getUser(id)));

// Use batch query
const users = await getUsersByIds(ids);
```

### Lazy Loading
```typescript
// Load only when needed
const heavyModule = await import('./heavy-module');
```

### Pagination
```typescript
// Instead of loading all
const users = await db.users.findMany({
  skip: page * pageSize,
  take: pageSize,
});
```

## Performance Checklist

### Frontend
- [ ] Bundle size optimized
- [ ] Images optimized
- [ ] Code splitting implemented
- [ ] Lazy loading for heavy components
- [ ] Caching headers set

### Backend
- [ ] Database queries optimized
- [ ] Proper indexes in place
- [ ] Caching implemented
- [ ] Connection pooling configured
- [ ] Async operations used

### Infrastructure
- [ ] CDN configured
- [ ] Compression enabled
- [ ] HTTP/2 enabled
- [ ] Geographic distribution

## Metrics to Track

| Metric | Target | Tool |
|--------|--------|------|
| Response time (p50) | <100ms | APM |
| Response time (p99) | <500ms | APM |
| Throughput | >1000 rps | Load test |
| Error rate | <0.1% | APM |
| Memory usage | <80% | Monitoring |
| CPU usage | <70% | Monitoring |

## Performance Report

```markdown
# Performance Analysis

**Date:** {YYYY-MM-DD}
**Scope:** {What was analyzed}

## Current Performance
{Baseline metrics}

## Bottlenecks Identified
1. {Bottleneck 1} - {Impact}
2. {Bottleneck 2} - {Impact}

## Optimizations Applied
1. {Change 1} - {Improvement}
2. {Change 2} - {Improvement}

## Results
{Before/after comparison}

## Recommendations
{Future improvements}
```

## Best Practices

1. **Profile regularly** - Not just when slow
2. **Set budgets** - Performance budgets for key metrics
3. **Monitor production** - Lab != production
4. **Automate testing** - CI performance tests
5. **Document baselines** - Track trends over time
