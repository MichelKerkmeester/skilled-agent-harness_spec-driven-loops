---
title: "Implementation Plan: cli-opencode permissions-matrix"
description: "Workflow plan for Phase B: schema + examples + reference doc + runtime enforcer. ~12 hours."
trigger_phrases:
  - "permissions-matrix plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/114-small-ai-model-optimization/003-permissions-matrix"
    last_updated_at: "2026-05-18T14:05:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored 003 plan.md L3"
    next_safe_action: "Author 003 tasks.md"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000008"
      session_id: "114-003-plan-init"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Plan: cli-opencode permissions-matrix

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Stack** | TypeScript (system-spec-kit/mcp_server) + JSON Schema (cli-opencode/assets) + Markdown |
| **Existing analog** | cli-devin agent-config-deep-research-iter.json (structured permissions via Devin --agent-config) |
| **Runtime hook** | pre-tool-call gate in deep-loop dispatch wrapper |

### Overview

Ship a JSON Schema for permissions matrices, 3 example matrices, a reference doc, and a TypeScript runtime enforcer that hooks into the deep-loop dispatch path to gate tool calls. The enforcer is opt-in via `permissions_matrix` config field; absent matrix = fall back to existing four-layer prose mitigation. Backward compat preserved.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] 002-foundation-routing shipped (sk-small-model exists; pattern-index has a row reserved for permissions-matrix.md)
- [x] spec.md strict-validates
- [x] cli-opencode/references/destructive_scope_violations.md re-read; RM-8 incident understood

### Definition of Done

- [x] Schema validates 3 example matrices
- [x] RM-8 replay test blocks all 44 file deletions
- [x] Backward compat verified: existing dispatches without matrix still work
- [x] cli-opencode SKILL.md ALWAYS #13 updated
- [x] sk-small-model pattern-index has row for permissions-matrix.md
- [x] All P0 + P1 checklist items checked
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Schema-driven permission gate: declarative matrices encode rules; runtime enforcer evaluates each tool call against the active matrix BEFORE dispatch. Default-deny semantics — malformed or absent matrix blocks all operations (operator must explicitly opt-out for backward compat).

### Key Components

- **Schema** (`assets/permissions-matrix.schema.json`): JSON Schema draft-2020-12 with required fields `version`, `rules[]`. Each rule: `target_glob`, `operation_class` (one of read/write/edit/delete/execute), `scope` (packet-local/repo-wide/external), `effect` (allow/deny), `rationale` (free-text).
- **Examples** (3 JSON files in `assets/`): read-only-corpus, packet-local-write, repo-wide-write.
- **Reference doc** (`references/permissions-matrix.md`): schema fields + 3 examples + RM-8 walkthrough + migration checklist.
- **Runtime enforcer** (`system-spec-kit/mcp_server/lib/deep-loop/permissions-gate.ts`): `evaluateToolCall(toolName, args, activeMatrix): {allowed: boolean, reason: string}`. Hooks via pre-tool-call interception in the dispatch wrapper.
- **SKILL.md update**: ALWAYS #13 becomes "If a permissions-matrix is configured for this dispatch, the matrix gates tool calls. If not configured, the four-layer prose mitigation (legacy) applies."
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## 4. AFFECTED SURFACES

| Surface | Path | Type |
|---------|------|------|
| Schema | `.opencode/skills/cli-opencode/assets/permissions-matrix.schema.json` | Create |
| Examples | `.opencode/skills/cli-opencode/assets/permissions-matrix.example-*.json` | Create (×3) |
| Reference | `.opencode/skills/cli-opencode/references/permissions-matrix.md` | Create |
| Enforcer | `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/permissions-gate.ts` | Create |
| SKILL.md | `.opencode/skills/cli-opencode/SKILL.md` | Modify (§ALWAYS #13) |
| Pattern index | `.opencode/skills/sk-small-model/references/pattern-index.md` | Modify (add row) |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 5. IMPLEMENTATION PHASES

### Phase 1: Schema + Examples (~3 hours)

- Author `permissions-matrix.schema.json` (JSON Schema draft-2020-12)
- Author 3 example matrices (read-only, packet-local, repo-wide)
- Validate all 3 examples against the schema via `npx ajv`

### Phase 2: Runtime Enforcer (~5 hours)

- Author `permissions-gate.ts` with `evaluateToolCall()` + glob compilation cache
- Add pre-tool-call hook in deep-loop dispatch wrapper (read existing `post-dispatch-validate.ts` for hook pattern)
- Unit tests covering: allow rule, deny rule, glob match, symlink resolution, default-deny on empty matrix

### Phase 3: Documentation + Migration (~2 hours)

- Author `references/permissions-matrix.md` (schema explanation + examples + RM-8 walkthrough + migration checklist)
- Update `cli-opencode/SKILL.md` ALWAYS #13
- Update `sk-small-model/references/pattern-index.md` with new row

### Phase 4: Validation (~2 hours)

- RM-8 replay test: feed deepseek-v4-pro the 2026-05-04 prompt with packet-local matrix; confirm 44/44 deletions blocked
- Backward compat: dispatch without matrix configured; confirm four-layer prose still active
- Benchmark enforcer overhead < 50ms
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 6. TESTING STRATEGY

### Unit (Phase 2)

- `evaluateToolCall(Read, /repo/x, readOnly)` → allowed
- `evaluateToolCall(Write, /repo/x, readOnly)` → denied with rule cite
- `evaluateToolCall(Delete, /repo/y, packetLocal)` → denied (delete not in packet-local allow)
- Glob match edge cases: symlinks, parent traversal, hidden files
- Default-deny: empty matrix rejects everything

### Integration (Phase 4)

- RM-8 replay: full deepseek-v4-pro dispatch under matrix
- Backward compat: existing dispatch with no matrix configured

### Performance (Phase 4)

- 1000 sequential tool-call evaluations < 50s wall-clock (avg <50ms per call)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 7. DEPENDENCIES

| Dependency | Risk | Mitigation |
|------------|------|------------|
| 002-foundation-routing must ship first | Medium | Block 003 start until 002 merged |
| ajv (JSON Schema validator) | Low | Already in node_modules per package.json |
| Deep-loop dispatch wrapper hook point | Medium | Read post-dispatch-validate.ts for analog |
| Existing RM-8 prose mitigation must remain functional for backward compat | High | Test backward-compat path explicitly |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 8. ROLLBACK PLAN

### Per-Component Rollback

- Schema/examples: delete files; no downstream impact
- Enforcer: disable via config flag `permissions_gate_enabled: false`
- SKILL.md edit: git revert; ALWAYS #13 returns to v1.3.3.0 four-layer prose

### Full Rollback

- git revert the full packet commit
- Existing dispatches keep working (matrix was opt-in)
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (schema + examples) ──┐
                              ├─→ Phase 3 (docs)
Phase 2 (enforcer)            │
                              └─→ Phase 4 (validation)
```

Phase 1 and Phase 2 can run in parallel. Phase 3 needs Phase 1 (cites schema). Phase 4 needs both 1 + 2 + 3.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Effort |
|-------|--------|
| Phase 1 (schema + examples) | ~3 hours |
| Phase 2 (enforcer + tests) | ~5 hours |
| Phase 3 (docs + SKILL.md edit) | ~2 hours |
| Phase 4 (validation + benchmark) | ~2 hours |
| **Total** | **~12 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Selective

- If only the enforcer misbehaves: disable via config flag; schema + examples + docs stay
- If only the docs are wrong: edit docs without touching enforcer
- If only the SKILL.md edit causes confusion: revert that one file

### Forward Recovery

- Matrix opt-in design means rollback to baseline is always possible
- Existing four-layer prose mitigation never removed during this packet (only marked deprecated-but-supported)
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

### Upstream

- 001-research-smallcode (research synthesis §RQ4 + iter-009 RM-8 walkthrough)
- 002-foundation-routing (sk-small-model exists; pattern-index has slot for new entry)
- RM-8 incident doc (cli-opencode/references/destructive_scope_violations.md)

### Downstream

- 005-shared-intelligence (fallback engine may also consume matrix for cloud-target permissioning)
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

Phase 2 (enforcer + tests) is the critical path — Phase 4 validation can't start without it. Phase 1 (schema) is shorter and can finish first, freeing Phase 3 (docs) to start. Phase 4 gates the packet's done state.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Trigger | Verification |
|-----------|---------|--------------|
| M1: Schema ready | Phase 1 done | ajv validate on 3 examples exits 0 |
| M2: Enforcer ready | Phase 2 done | unit tests pass; benchmark <50ms |
| M3: RM-8 replay passes | Phase 4 done | deletion count = 0 under packet-local matrix |
| M4: Backward compat verified | Phase 4 done | dispatch without matrix still works |
| M5: Docs shipped | Phase 3 done | reference doc reviewed |
<!-- /ANCHOR:milestones -->
