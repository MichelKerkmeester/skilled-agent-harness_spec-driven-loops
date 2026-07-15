---
title: "Implementation Plan: Flag-routing fix for cross-encoder HTTP local provider [template:level_1/plan.md]"
description: "Three-phase plan: precedence swap in stage3-rerank.ts dispatch + flag-helper hardening + regression-test addition + docs update."
trigger_phrases:
  - "001 plan flag routing"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/001-flag-routing-fix-for-cross-encoder"
    last_updated_at: "2026-05-20T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Plan authored"
    next_safe_action: "Begin Phase A audit"
    blockers: []
---
# Implementation Plan: Flag-routing fix for cross-encoder HTTP local provider

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Phase | What | Status |
|-------|------|--------|
| **A** | Audit current dispatch flow in `stage3-rerank.ts:395-420` and every `isLocalRerankerEnabled()` caller | Planned |
| **B** | Implement precedence swap + helper hardening | Planned |
| **C** | Add regression test, update docs (local-reranker.ts header, ENV_REFERENCE.md), build + validate | Planned |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

1. Strict validate passes 0/0 on this packet.
2. `npm run build` in `system-spec-kit/mcp_server` exits 0 (no TS errors from the change).
3. New regression test passes; existing reranker tests still pass.
4. Manual smoke: set `SPECKIT_CROSS_ENCODER=true` + `RERANKER_LOCAL=true` and confirm via trace logs (or test mock) that the cross-encoder HTTP path is invoked, not the shim.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Today's dispatch (broken)

```typescript
// stage3-rerank.ts (paraphrased)
if (isLocalRerankerEnabled()) {        // RERANKER_LOCAL=true
  result = await rerankLocal(rows);    // NO-OP SHIM — returns rows unchanged
} else if (isCrossEncoderEnabled()) {  // SPECKIT_CROSS_ENCODER=true
  result = await crossEncoder.rerank(...);  // The HTTP path — never reached if RERANKER_LOCAL is also true
}
```

### After this phase

```typescript
if (isCrossEncoderEnabled()) {                // CHECK CROSS-ENCODER FIRST
  result = await crossEncoder.rerank(...);
} else if (isLocalRerankerEnabled()) {        // Legacy no-op path only when CROSS_ENCODER is off
  result = await rerankLocal(rows);
}
```

Plus the defensive helper change:

```typescript
// search-flags.ts
export function isLocalRerankerEnabled(): boolean {
  if (isCrossEncoderEnabled()) return false;  // NEW: precedence guard
  if (process.env.RERANKER_LOCAL?.toLowerCase().trim() !== 'true') return false;
  return isFeatureEnabled('RERANKER_LOCAL');
}
```

### Why this is safe

- The `local-reranker.ts` shim is a no-op — running it changes nothing about result ordering. Bypassing it costs nothing.
- The cross-encoder.ts path has its own graceful-degradation: if no provider is configured (no Voyage key, no Cohere key, no `localhost:8765` health), it returns positional fallback scores. So `SPECKIT_CROSS_ENCODER=true` without a running sidecar is exactly the same observable behavior as today.
- No new code paths introduced — just a precedence reshuffle of two existing ones.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase A — Audit
- Read `stage3-rerank.ts:395-420` (the gate around `await rerankLocal(rows)`)
- `rg "isLocalRerankerEnabled\(\)" .opencode/skills/system-spec-kit/mcp_server` to enumerate every caller
- Confirm no caller relies on the shim setting any side-effect flag

### Phase B — Patch
- Swap precedence in `stage3-rerank.ts`
- Add precedence guard in `search-flags.ts::isLocalRerankerEnabled`
- Update header doc-comment in `local-reranker.ts`

### Phase C — Tests + docs
- Add `tests/stage3-rerank-regression.vitest.ts` case: mock crossEncoder.rerank to verify it's invoked when both env vars are true
- Add a second case: mock rerankLocal to verify it's still invoked when only `RERANKER_LOCAL=true` is set
- Update `ENV_REFERENCE.md` row for `SPECKIT_CROSS_ENCODER`: add "Takes precedence over `RERANKER_LOCAL`"
- Build: `cd .opencode/skills/system-spec-kit/mcp_server && npm run build`
- Strict validate this packet
- Manual smoke (optional but recommended): run a real `memory_search` with both env vars set and check the trace output for "cross-encoder" provider attribution
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test | What | Expected |
|------|------|----------|
| Vitest precedence (new) | Mock cross-encoder + local-reranker; set both env vars; call Stage 3 | cross-encoder mock invoked; local-reranker mock NOT invoked |
| Vitest legacy preservation (new) | Set only `RERANKER_LOCAL=true`; call Stage 3 | local-reranker mock invoked |
| Vitest no-env (existing) | Set neither flag; call Stage 3 | Neither invoked; positional scores returned |
| Vitest regression suite | Full `stage3-rerank-regression.vitest.ts` | All existing cases pass |
| Build | `npm run build` | Exit 0 |
| Strict validate | `validate.sh --strict <packet>` | Exit 0 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- **Upstream**: None — this is the arc root.
- **Downstream**: Phase 002 (`system-rerank-sidecar` skill creation) depends on this fix landing. Without the precedence swap, the sidecar would be running but unreachable from spec-memory.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

| Surface | How to roll back |
|---------|------------------|
| Source changes (3 files) | `git checkout HEAD~1 -- <paths>` |
| Test additions | Same; the new test file is in this commit |
| Docs | Same |
| Built artifacts | `npm run build` after revert |

After rollback, behavior returns to today's: `RERANKER_LOCAL=true` activates the shim regardless of `SPECKIT_CROSS_ENCODER`. The sidecar (if running from phase 002) would be unreachable from spec-memory.
<!-- /ANCHOR:rollback -->
