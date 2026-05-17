# Iteration 010 — SECURITY (stage2-fusion + handlers deep pass)

## Scope
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts` (1478 LOC)
- `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-list.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-set.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-status.ts`

## Focus Dimension
SECURITY — input validation, SQL injection risks, rate limiting, sanitization, trust boundary violations

---

## P0 Findings
(none this iter)

---

## P1 Findings

### P1-001: Missing input length limits on embedder-set name parameter (DoS risk)
**Severity:** P1  
**File:** `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:502`  
**Issue:** The `embedder_set` schema only enforces `min(1)` on the `name` parameter but lacks any `max()` length constraint. This allows arbitrarily long strings to be passed, creating a potential DoS vector through memory exhaustion or string processing attacks.

**Repro:**
```typescript
// Schema definition at line 502
const embedderSetSchema = getSchema({
  name: z.string().min(1),  // Missing max length
});

// Handler at embedder-set.ts:53
const name = typeof args.name === 'string' ? args.name.trim() : '';
```

Attack: Call `embedder_set` with `name` set to a 10MB string. The handler will attempt to trim and process this string, potentially causing memory exhaustion or excessive CPU usage.

**Recommendation:** Add a reasonable maximum length constraint (e.g., `max(256)` or `max(512)`) to prevent abuse:
```typescript
const embedderSetSchema = getSchema({
  name: z.string().min(1).max(256),
});
```

**Trust-boundary:** The `name` parameter flows from untrusted MCP client input through to `getManifest(name)` (embedder-set.ts:54) without size validation, crossing the trust boundary without sanitization.

---

### P1-002: Missing input length limits on embedder-status jobId parameter (DoS risk)
**Severity:** P1  
**File:** `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:506`  
**Issue:** The `embedder_status` schema only enforces `min(1)` on the optional `jobId` parameter but lacks any `max()` length constraint. This allows arbitrarily long job IDs to be passed, creating a potential DoS vector.

**Repro:**
```typescript
// Schema definition at line 506
const embedderStatusSchema = getSchema({
  jobId: z.string().min(1).optional(),  // Missing max length
});

// Handler at embedder-status.ts:72-74
const requestedJobId = typeof args.jobId === 'string' && args.jobId.trim().length > 0
  ? args.jobId.trim()
  : null;
```

Attack: Call `embedder_status` with `jobId` set to a 10MB string. The handler will attempt to trim and process this string before passing to `getJobStatus(requestedJobId, db)`.

**Recommendation:** Add a reasonable maximum length constraint (e.g., `max(256)`):
```typescript
const embedderStatusSchema = getSchema({
  jobId: z.string().min(1).max(256).optional(),
});
```

**Trust-boundary:** The `jobId` parameter flows from untrusted MCP client input through to `getJobStatus(requestedJobId, db)` (embedder-status.ts:75) without size validation, crossing the trust boundary.

---

### P1-003: No rate limiting on embedder handlers (abuse risk)
**Severity:** P1  
**File:** `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-set.ts:49`  
**Issue:** The embedder handlers (`embedder_list`, `embedder_set`, `embedder_status`) have no rate limiting mechanism. Malicious clients can call these handlers at high frequency, potentially causing resource exhaustion or enabling abuse patterns (e.g., rapid embedder switching to trigger repeated reindexing).

**Repro:**
```typescript
// embedder-set.ts:49 - no rate limiting
export async function handleEmbedderSet(args: EmbedderSetArgs): Promise<MCPResponse> {
  const startTime = Date.now();
  await checkDatabaseUpdated();
  // ... no rate limit check
```

Attack: Call `embedder_set` repeatedly in a loop with different embedder names. Each call triggers `startReindex` (embedder-set.ts:62), which could cause database load and resource exhaustion.

**Recommendation:** Implement rate limiting middleware for embedder operations, particularly for state-changing operations like `embedder_set`. Consider a sliding window rate limiter (e.g., 10 requests per minute per client/session).

**Trust-boundary:** Untrusted clients can trigger expensive operations (reindexing) without throttling, crossing the trust boundary without abuse protection.

---

### P1-004: Error messages leak internal state (embedder-set UnknownEmbedderError)
**Severity:** P1  
**File:** `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-set.ts:35-42`  
**Issue:** The `UnknownEmbedderError` constructor includes the user-supplied `name` parameter directly in the error message, which is returned to the MCP client. This leaks internal state and could be used for information disclosure attacks.

**Repro:**
```typescript
// embedder-set.ts:35-42
export class UnknownEmbedderError extends Error {
  readonly code = 'UNKNOWN_EMBEDDER';

  constructor(name: string) {
    super(`UNKNOWN_EMBEDDER: ${name}`);  // Leaks user input
    this.name = 'UNKNOWN_EMBEDDER';
    Object.setPrototypeOf(this, new.target.prototype);
  }
};

// Handler at embedder-set.ts:55-56
if (!manifest) {
  throw new UnknownEmbedderError(name);  // User input leaks to client
}
```

Attack: Call `embedder_set` with various names to enumerate which embedders exist vs. don't exist (information disclosure). The error message reveals exactly what name was rejected.

**Recommendation:** Use a generic error message that doesn't include user input:
```typescript
constructor(name: string) {
  super(`UNKNOWN_EMBEDDER`);
  // Or: super(`Embedder not found`);
}
```

**Trust-boundary:** Internal validation results (unknown embedder names) are leaked back to untrusted clients, violating the trust boundary.

---

## P2 Findings

### P2-001: No format validation on embedder-set name parameter
**Severity:** P2  
**File:** `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:502`  
**Issue:** The `embedder_set` schema only validates that `name` is a non-empty string but doesn't enforce any format constraints. Invalid or malformed names could cause unexpected behavior in downstream processing.

**Repro:**
```typescript
const embedderSetSchema = getSchema({
  name: z.string().min(1),  // No format validation
});
```

Attack: Call `embedder_set` with `name` containing special characters, control characters, or path traversal attempts (e.g., `../../../etc/passwd`). While `getManifest` may reject these, the lack of schema-level validation shifts security responsibility to runtime checks.

**Recommendation:** Add format validation using regex or a predefined enum of known embedder names:
```typescript
const embedderSetSchema = getSchema({
  name: z.string().min(1).max(256).regex(/^[a-zA-Z0-9_-]+$/),
});
```

**Trust-boundary:** User-controlled input reaches downstream processing without format sanitization.

---

### P2-002: No format validation on embedder-status jobId parameter
**Severity:** P2  
**File:** `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:506`  
**Issue:** The `embedder_status` schema only validates that `jobId` is a non-empty string but doesn't enforce any format constraints. Invalid or malformed job IDs could cause unexpected behavior in database queries.

**Repro:**
```typescript
const embedderStatusSchema = getSchema({
  jobId: z.string().min(1).optional(),  // No format validation
});
```

Attack: Call `embedder_status` with `jobId` containing SQL-like patterns or special characters. While the SQL queries use parameterization (preventing SQL injection), malformed IDs could still cause unexpected query behavior.

**Recommendation:** Add format validation using regex appropriate for job ID format:
```typescript
const embedderStatusSchema = getSchema({
  jobId: z.string().min(1).max(256).regex(/^[a-zA-Z0-9_-]+$/).optional(),
});
```

**Trust-boundary:** User-controlled input reaches database queries without format sanitization (though SQL injection is prevented by parameterization).

---

### P2-003: stage2-fusion SQL queries lack input sanitization for array bounds
**Severity:** P2  
**File:** `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:463-471, 504-511, 833-837, 1165-1167`  
**Issue:** While SQL queries use parameterization (preventing SQL injection), there are no bounds checks on array sizes used to generate placeholder lists. An attacker could pass large result sets to generate excessive placeholders, causing query string overflow or performance degradation.

**Repro:**
```typescript
// stage2-fusion.ts:463-471
const placeholders = graphBoostedIds.map(() => '?').join(', ');
const edgeRows = (db.prepare(`
  SELECT source_id, target_id, relation, COALESCE(strength, 1.0) AS strength
  FROM causal_edges
  WHERE source_id IN (${placeholders}) OR target_id IN (${placeholders})
`).all(
  ...graphBoostedIds.map(String),
  ...graphBoostedIds.map(String),
)) as Array<{ source_id: number; target_id: number; relation: string; strength: number }>;
```

Attack: If `graphBoostedIds` contains 10,000 IDs, the query string would contain 20,000 placeholders, potentially exceeding SQLite query limits or causing performance issues.

**Recommendation:** Add bounds checks before generating placeholder lists:
```typescript
const MAX_PLACEHOLDERS = 900;  // SQLite default limit is 999
if (graphBoostedIds.length > MAX_PLACEHOLDERS / 2) {
  console.warn(`[stage2-fusion] Too many IDs for IN clause: ${graphBoostedIds.length}`);
  return results;  // or batch the query
}
```

**Trust-boundary:** User-controlled result set sizes affect query generation without bounds validation.

---

## Positive Security Findings

1. **SQL Injection Prevention:** All SQL queries in stage2-fusion.ts use proper parameterization with placeholders (lines 463-471, 504-511, 586-588, 602-610, 833-837, 928-931, 1165-1167). No direct string interpolation detected.

2. **Type Safety:** Handlers use TypeScript type checking and runtime type guards (e.g., `typeof args.name === 'string'` in embedder-set.ts:53).

3. **Fail-Open Design:** Error handling in stage2-fusion uses fail-open patterns (e.g., populateGraphEvidence returns results unchanged on error at line 444), preventing cascading failures.

---

## Summary
- **P0:** 0 findings
- **P1:** 4 findings (input length limits, rate limiting, error message leakage)
- **P2:** 3 findings (format validation, array bounds)

The primary security concerns are around input validation completeness (missing length/format constraints) and operational security (missing rate limiting). SQL injection is properly mitigated through parameterization.
