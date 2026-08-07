---
title: "Implementation Summary: Measurement & Receipts Foundation"
description: "Scoped implementation evidence for the shadow planner, canonical block IDs, delivery-receipt fields, and byte-stable parity fixtures."
trigger_phrases:
  - "measurement and receipts summary"
  - "shadow planner implementation evidence"
importance_tier: "important"
contextType: "implementation"
parent: "hooks"
status: "in_progress"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/001-measurement-and-receipts-foundation"
    last_updated_at: "2026-08-07T04:16:20Z"
    last_updated_by: "codex"
    recent_action: "Reconciled receipt-gated delivery and pure-peek verification for the shadow planner"
    next_safe_action: "Resolve the missing Pi owner constant and remaining P1 record items"
    blockers:
      - "The current Pi prompt-advisor owner does not export the directive constant named by the research/spec."
      - "The repository-wide Vitest/drift gates have unrelated baseline or environment failures."
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp-server/lib/policy-plan.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-06-hooks-002-001"
      parent_session_id: null
    completion_pct: 84
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Measurement & Receipts Foundation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-measurement-and-receipts-foundation |
| **Status** | In progress — scoped implementation verified; Pi owner and P1 record items remain |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Implemented the scoped shadow planner and its proof harness. `policy-plan.ts` now owns the stable ID registry, explicit hash-input allow-list, per-block and ordered policy-set hashes, receipt validation, and fail-open render observer. Delivery confirmation requires an observed matching receipt; `peek()` is a pure read and `decideSuppression()` is the explicit state transition. `render.ts` calls the observer after every existing success, fallback, and null-return path; the observer's `void` result cannot affect the emitted string.

The parity harness covers six native serializer shapes x five cases (first, repeat, Gate-emitting, read-only, and failure/fallback), for 30 byte comparisons. The unit suite covers the four required IDs, the extension registry, the adversarial path/session negative control, receipt-field rejection, and configured-vs-observed host status.

### Delivered Files

| File | Action | Purpose |
|------|-----------------|---------|
| `.opencode/skills/system-skill-advisor/mcp-server/lib/policy-plan.ts` | Created | Canonical block registry, hashers, and delivery-receipt builder |
| `.opencode/skills/system-skill-advisor/mcp-server/lib/render.ts` | Modified | Additive shadow-only observer call; no output change |
| `.opencode/skills/system-skill-advisor/mcp-server/tests/policy-plan.vitest.ts` | Created | Unit tests for IDs, hash purity, receipt shape, and host lanes |
| `.opencode/skills/system-skill-advisor/mcp-server/tests/parity/policy-plan-serializer-parity.vitest.ts` | Created | Byte-stable parity across six native serializer shapes |
| `.opencode/skills/system-skill-advisor/mcp-server/tests/parity/fixtures/policy-plan/` | Created | 30-case fixture matrix and captured pre-change contexts |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation preserves the existing render expressions and adds only observer calls. The planner imports the renderer's directive constants and resolves the Gate question from its current owner. Hash serialization is constructed from `{id, content, order}` only; prompt and session fields are accepted as input context but are never serialized. Receipts are built and discarded in this shadow-only phase because no receipt sink is in the requested Files-to-Change table.

The proof-first negative control was run before and after the allow-list:

```text
Before allow-list: npx vitest run tests/policy-plan.vitest.ts -> exit 1
Received serialization contained /Users/example/private/session-42.txt and session-secret-42.
After allow-list:  npx vitest run tests/policy-plan.vitest.ts -> exit 0
Test Files 1 passed (1)
Tests 2 passed (2)
```
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Shadow-only, zero-output-change scope for this phase | Every later reduction candidate needs a receipt to gate activation on; shipping any output change before receipts exist would repeat the unconditional-directive-removal failure mode research.md ruled out |
| Hash inputs restricted to block ID + content + order | Privacy-safe by construction - raw prompts, paths, and session identifiers must never enter a persisted hash or receipt |
| New dedicated shadow-delta stream, not the existing scorer `shadow-deltas.jsonl` | `lib/shadow/shadow-sink.ts` already serves an unrelated recommendation-scoring comparison; reusing it would conflate two different shadow-mode purposes |
| Planner imports `render.ts`'s existing directive constants rather than redefining block text | Prevents the canonical content and the planner's copy from silently drifting apart |
| Observer is wired only in `render.ts` | The user-specified Files-to-Change table and scope permit the renderer integration; Cursor/OpenCode/Pi production call sites remain untouched |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| SC-003 negative control before allow-list | **FAIL as required**, exit 1; raw path and session token appeared in the naïve serialization |
| SC-003 negative control after allow-list | **PASS**, `Test Files 1 passed (1)`, `Tests 2 passed (2)`, exit 0 |
| Scoped policy Vitest | **PASS**, `Test Files 2 passed (2)`, `Tests 25 passed (25)`, exit 0; output includes receipt-gated shadow reduction and byte-parity rows |
| Existing renderer/producer/privacy Vitest | **PASS**, `Test Files 3 passed (3)`, `Tests 32 passed (32)`, exit 0 |
| `npm run typecheck` | **PASS**, exit 0 from the final tree |
| Requested bare `npx tsc --noEmit` | Exit 2 on baseline configuration errors: TS6059 rootDir violations and TS5101 `baseUrl` deprecation; no new error naming the scoped planner was observed. Generated build-info residue was removed. |
| Comment hygiene checker on four scoped TypeScript files | **PASS**, exit 0 for each file |
| `git diff --check` | **PASS**, exit 0 |
| `validate.sh <phase> --strict` | Pending recursive final validation after the required metadata regeneration |
| Repository-wide `npm test` | **NOT CLEAN**, terminated exit 130 after unrelated suite failures and missing dependency/preload errors; not attributable to the scoped files |
| Repository-wide drift guard | **NOT CLEAN**, exit 1: 472 existing alignment findings plus router-sync network failure (`ENOTFOUND`); no scoped fix applied |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The current Pi owner does not provide the named directive constant.** `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:16-57` contains only the advisor envelope bridge; no `PI_SUBAGENT_DISPATCH_DIRECTIVE` export or equivalent text exists. The planner does not fork or invent that content, so the Pi registry slot remains content-undefined until the owner is corrected.
2. **Runtime wiring is intentionally limited to `render.ts`.** The user required exact Files-to-Change scope; Cursor, OpenCode, and Pi production call sites were not modified.
3. **No receipt sink was added.** The planner computes and validates the receipt, then drops it fail-open because a sink would be an additional out-of-scope file and could introduce persistence or output risk.
4. **The requested bare compiler command is broken before this change.** The package's `tsconfig.json` includes files outside its inherited rootDir and trips TypeScript 6's `baseUrl` deprecation; the package-scoped `npm run typecheck` is green.
5. **The final status is phase-in-progress, not whole-packet completion.** The scoped planner and receipt proof pass; the Pi owner mismatch and remaining P1 record items are still marked in `checklist.md`.
<!-- /ANCHOR:limitations -->
