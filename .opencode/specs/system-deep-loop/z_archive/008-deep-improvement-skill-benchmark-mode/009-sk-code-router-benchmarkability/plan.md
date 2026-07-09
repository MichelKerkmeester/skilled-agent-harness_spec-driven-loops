---
title: "Implementation Plan: sk-code Router Benchmarkability"
description: "Teach the Lane C harness to follow a referenced router doc and give sk-code a machine-readable router projection, validated against sk-code with backward-compat for inline-router skills."
trigger_phrases:
  - "sk-code router benchmarkability plan"
  - "reference-following parseRouter plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/008-deep-improvement-skill-benchmark-mode/009-sk-code-router-benchmarkability"
    last_updated_at: "2026-06-01T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Plan authored to match shipped change"
    next_safe_action: "validate.sh --strict"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-code-router-benchmarkability"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: sk-code Router Benchmarkability

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS (`.cjs`) harness scripts; Markdown router doc |
| **Framework** | Vitest (`.vitest.ts` suite) |
| **Storage** | None (filesystem fixtures + JSON/MD reports) |
| **Testing** | `npx vitest run` from `.opencode/skills/deep-improvement/scripts` |

### Overview
The Lane C parser only reads `SKILL.md`. We add a reference-following fallback: when `SKILL.md` has no inline dicts, `parseRouter` locates the referenced router doc and parses the same dictionaries from it. `sk-code` gains a machine-readable projection of its prose maps in `smart_routing.md` §11.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Baseline benchmark captured (BLOCKED-BY-STRUCTURE, D5=0)
- [x] Backward-compat contract read from existing tests
- [x] sk-code reference inventory enumerated (94 md files)

### Definition of Done
- [x] All acceptance criteria (REQ-001..006) met
- [x] Full vitest suite passing (214)
- [x] Docs + metadata present and strict-valid
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive fallback on a pure parser module — inline parse first, referenced-doc parse only when inline is empty.

### Key Components
- **`parseRouter(skillMdText, skillRoot)`**: inline-first, then reference-following; returns `routerSource`.
- **`findReferencedRouterDoc(skillMdText, skillRoot)`**: pointer detection + conventional fallback, existence-guarded.
- **`smart_routing.md` §11**: single machine-readable router source (flat union projection).

### Data Flow
`SKILL.md` text → inline extract → (if empty + skillRoot) locate ref doc → extract dicts → `{intentSignals, resourceMap, defaultResource, parseable, routerSource}` → consumed identically by `routeSkillResources`, `scanConnectivity`, `buildBannedVocab`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `parseRouter` | producer of router dicts | update (fallback + signature) | new vitest cases; sk-code replay |
| `routeSkillResources` | consumer | update (pass skillRoot) | `missingResources === []` on sk-code |
| `scanConnectivity` (D5) | consumer (gate) | update (pass skillRoot) | sk-code `gateFailed:false`, dead paths `[]` |
| `buildBannedVocab` | consumer (banned vocab) | update (pass skillRoot) | fixtures still lint-clean |
| `smart_routing.md` | router source (prose) | add machine-readable block | parseable:true; routerSource contains it |

Consumers of `parseRouter`: `rg -n "parseRouter" .opencode/skills/deep-improvement/scripts` → 3 call sites, all updated. Invariant: inline dicts always win; fallback only when inline empty; router-less stays unparseable.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Baseline captured; tests read; inventory enumerated

### Phase 2: Core Implementation
- [x] `parseRouter` fallback + `skillRoot` threading (3 call sites)
- [x] `smart_routing.md` §11 router block (0 dead paths, 3 orphans)
- [x] 2 lint-clean fixture pairs

### Phase 3: Verification
- [x] 4 regression tests; full suite green
- [x] Re-benchmark before/after into packet
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `parseRouter` inline vs reference vs router-less; D5 on sk-code | Vitest |
| Integration | `routeSkillResources` + lint + run-skill-benchmark e2e | Vitest |
| Manual | loop-host benchmark before/after on sk-code | Node CLI |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Lane C harness scripts | Internal | Green | N/A |
| sk-code references tree | Internal | Green | N/A |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A regression appears in inline-router benchmarks.
- **Procedure**: `git revert` the 3 harness-script edits; the §11 block and fixtures are inert without the fallback (no behavior change to sk-code itself).
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Core) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | done |
| Core Implementation | Med | done |
| Verification | Low | done |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline report retained for comparison
- [x] Full test suite green before claiming done

### Rollback Procedure
1. `git revert` the `router-replay.cjs` / `d5-connectivity.cjs` / `contamination-lint.cjs` edits.
2. Re-run `npx vitest run` to confirm the suite returns to its prior state.
3. The `smart_routing.md` §11 block and fixtures may stay (inert) or be removed.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A (filesystem-only).
<!-- /ANCHOR:enhanced-rollback -->
