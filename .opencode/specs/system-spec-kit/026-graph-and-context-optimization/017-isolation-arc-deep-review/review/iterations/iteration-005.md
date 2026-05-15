# Iteration 005: Adversarial Pass - Boundary Wrapper Scenarios

**Date**: 2026-05-15T12:46:00Z
**Focus**: Adversarial testing of boundary wrapper with failure scenarios
**Findings Count**: 2 (P0: 1, P1: 1)

---

## Adversarial Pass: Boundary Wrapper (code-graph-boundary.ts)

### Scenario 1: Concurrent Access to Marker File

**Challenge**: What happens if spec-kit reads the marker while code-graph is writing it?

**Analysis**:
- `readCodeGraphReadinessMarker()` uses `readFileSync` (synchronous)
- `readiness-marker.ts` uses `writeFileSync` (synchronous)
- No file locking mechanism
- **Risk**: Read could see partial/malformed JSON

**Evidence**:
- code-graph-boundary.ts:98-111: `readFileSync` without lock
- readiness-marker.ts:7: `writeFileSync` without lock

**P0-FINDING-003**: Race condition in marker read/write
- **Dimension**: Correctness
- **File**: `.opencode/skills/system-spec-kit/mcp_server/lib/code-graph-boundary.ts`
- **Lines**: 98-111
- **Evidence**: No file locking; concurrent read/write could result in malformed JSON parse
- **Recommendation**: Implement atomic write pattern (write to temp file + rename) or add retry logic with JSON validation

---

### Scenario 2: Missing Marker File

**Challenge**: What happens if the marker file doesn't exist?

**Analysis**:
- `readCodeGraphReadinessMarker()` returns `null` if file doesn't exist (line 99-101)
- Callers handle `null` gracefully:
  - `getGraphReadinessSnapshotFromMarker()`: returns default with "unavailable" reason (line 127)
  - `getGraphFreshnessFromMarker()`: returns 'error' (line 114)
  - `getStartupBriefFromMarker()`: returns degraded startup brief (line 138-162)
- **Assessment**: WELL-HANDLED - fail-closed pattern implemented

**Status**: PASS - missing marker handled gracefully

---

### Scenario 3: Malformed Marker JSON

**Challenge**: What happens if the marker file contains invalid JSON?

**Analysis**:
- `readCodeGraphReadinessMarker()` has try-catch (line 108-110)
- Returns `null` on parse error
- Callers handle `null` as above
- **Assessment**: WELL-HANDLED - fail-closed on parse error

**Status**: PASS - malformed JSON handled gracefully

---

### Scenario 4: Marker Schema Version Mismatch

**Challenge**: What happens if the marker has a different schema version?

**Analysis**:
- `readCodeGraphReadinessMarker()` checks `parsed.schemaVersion !== 1` (line 104)
- Returns `null` on version mismatch
- **Assessment**: WELL-HANDLED - schema validation prevents deserialization errors

**Status**: PASS - schema version validation implemented

---

### Scenario 5: Marker Producer Validation

**Challenge**: What happens if the marker was written by something other than mk-code-index?

**Analysis**:
- `readCodeGraphReadinessMarker()` checks `parsed.producer !== 'mk-code-index'` (line 104)
- Returns `null` on producer mismatch
- **Assessment**: WELL-HANDLED - producer validation prevents tampering

**Status**: PASS - producer validation implemented

---

### Scenario 6: MCP Call Timeout

**Challenge**: What happens if the MCP call to code-graph times out?

**Analysis**:
- `withTimeout()` wrapper (line 74-92) throws error with `CODE_GRAPH_MCP_TIMEOUT` code
- `callCodeGraphTool()` uses this wrapper with 8-second timeout (line 198)
- `getCodeGraphStatusViaRpc()` catches errors and returns error snapshot (line 257-262)
- **Assessment**: WELL-HANDLED - timeout results in degraded state, not crash

**Status**: PASS - timeout handling implemented

---

### Scenario 7: MCP Call Returns Invalid Response

**Challenge**: What happens if the MCP response is malformed?

**Analysis**:
- `callCodeGraphTool()` validates response structure (line 216-220)
- Checks for array response, text content, valid JSON
- `getCodeGraphStatusViaRpc()` validates response shape (line 233-254)
- Uses `isRecord()` type guard (line 64-66)
- **Assessment**: WELL-HANDLED - response validation prevents crashes

**Status**: PASS - response validation implemented

---

### Scenario 8: Path Traversal Attack via Marker Path

**Challenge**: Can an attacker manipulate the marker path to read arbitrary files?

**Analysis**:
- Marker path is hardcoded: `../../../system-code-graph/mcp_server/database/.code-graph-readiness.json` (line 30-33)
- Constructed via `fileURLToPath(new URL(..., import.meta.url))`
- `fileURLToPath` resolves relative to the current module's location
- **Risk**: If an attacker can manipulate `import.meta.url` or the directory structure, they could redirect the read
- **Assessment**: MODERATE RISK - hardcoded path is generally safe, but no explicit validation

**P0-FINDING-004**: Insufficient path validation in marker read
- **Dimension**: Security
- **File**: `.opencode/skills/system-spec-kit/mcp_server/lib/code-graph-boundary.ts`
- **Lines**: 30-33, 94-96
- **Evidence**: No validation that resolved marker path is within expected code-graph directory
- **Recommendation**: Add path validation to ensure marker file is within expected bounds before reading

---

### Scenario 9: Subprocess Injection via MCP Launcher

**Challenge**: Can an attacker inject malicious commands into the MCP subprocess?

**Analysis**:
- Launcher path is hardcoded: `../../../../bin/mk-code-index-launcher.cjs` (line 34)
- `StdioClientTransport` uses `process.execPath` (Node.js binary) with launcher as argument (line 201-202)
- Environment passed via `processEnv()` which filters non-string values (line 68-72)
- **Risk**: If an attacker can manipulate `process.execPath` or environment variables, they could execute arbitrary code
- **Assessment**: MODERATE RISK - hardcoded launcher path helps, but environment passing is broad

**P1-FINDING-004**: Broad environment passing in MCP subprocess
- **Dimension**: Security
- **File**: `.opencode/skills/system-spec-kit/mcp_server/lib/code-graph-boundary.ts`
- **Lines**: 68-72, 201-205
- **Evidence**: All string environment variables passed to subprocess without allowlist
- **Recommendation**: Implement environment variable allowlist for MCP subprocess calls

---

## Findings Summary

**P0-FINDING-003**: Race condition in marker read/write
- **Dimension**: Correctness
- **File**: `.opencode/skills/system-spec-kit/mcp_server/lib/code-graph-boundary.ts`
- **Lines**: 98-111
- **Evidence**: No file locking; concurrent read/write could result in malformed JSON parse
- **Recommendation**: Implement atomic write pattern (write to temp file + rename) or add retry logic with JSON validation

**P0-FINDING-004**: Insufficient path validation in marker read
- **Dimension**: Security
- **File**: `.opencode/skills/system-spec-kit/mcp_server/lib/code-graph-boundary.ts`
- **Lines**: 30-33, 94-96
- **Evidence**: No validation that resolved marker path is within expected code-graph directory
- **Recommendation**: Add path validation to ensure marker file is within expected bounds before reading

**P1-FINDING-004**: Broad environment passing in MCP subprocess
- **Dimension**: Security
- **File**: `.opencode/skills/system-spec-kit/mcp_server/lib/code-graph-boundary.ts`
- **Lines**: 68-72, 201-205
- **Evidence**: All string environment variables passed to subprocess without allowlist
- **Recommendation**: Implement environment variable allowlist for MCP subprocess calls

---

## Positive Signals

**Well-handled scenarios**:
- Missing marker file (fail-closed)
- Malformed JSON (fail-closed)
- Schema version mismatch (validation)
- Producer validation (tamper resistance)
- MCP timeout (degraded state)
- Invalid MCP response (validation)

---

## Next Steps

Iteration-006 will:
1. Adversarial pass on readiness marker (write scenarios)
2. Adversarial pass on inlined helpers (equivalence verification)
3. Begin future-coupling-resistance check