---
title: "Implementation Plan: Repair the three RED system-spec-kit vitest suites left by the ADR-007-deferred de-numbering"
description: "Suite-by-suite repair to green: fix real docs, relocate assertions to real content, add a node_modules scan guard and justified allowlist entries, and prove the invariant still catches a genuine leak."
trigger_phrases:
  - "implementation"
  - "plan"
  - "vitest"
  - "invariance"
  - "allowlist maintenance"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-vitest-invariance-maintenance"
    last_updated_at: "2026-07-11T20:45:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded Level 2 plan from investigation findings"
    next_safe_action: "Phase 1 — confirm scope + read the three suites' current assertions"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/tests/outsourced-agent-handback-docs.vitest.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts"
      - ".opencode/skills/system-spec-kit/scripts/tests/workflow-invariance.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/031-vitest-invariance-maintenance"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Repair the three RED system-spec-kit vitest suites left by the ADR-007-deferred de-numbering

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript vitest suites + Markdown docs (system-spec-kit) |
| **Framework** | vitest (`scripts/tests/` + `mcp_server/tests/`) |
| **Storage** | N/A (no DB) |
| **Testing** | `vitest run` per suite; injected-leak proof run for the invariant |

### Overview
Three system-spec-kit vitest suites went RED because commit `5149f3abe5` de-numbered 699 catalog/playbook snippet files and `sk-doc/026` ADR-007 deferred the fallout. Repair each suite to green by fixing the real underlying content and relocating assertions to where content now lives — never by gutting assertions. The workflow-invariance suite additionally needs a `node_modules/` scan guard and per-use justified allowlist entries, and the fix must be proven to still catch a genuine new taxonomy leak.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All three suites green (`vitest run`, 0 failures each)
- [ ] Invariant proven to still catch an injected leak (then reverted)
- [ ] `vitest-recovery-followup` `it.fails.skip` line untouched
- [ ] Docs updated (spec/plan/tasks/checklist/decision-record)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Downstream test-maintenance repair (three independent RED suites sharing one root cause: the de-numbering reorg).

### Key Components
- **Suite (a) `outsourced-agent-handback-docs`**: stale `149-` literal + a `cli-opencode` `prompt_templates.md` `recentContext` parity gap.
- **Suite (b) `feature-flag-reference-docs`**: 8 relocated env-var mapping rows + 6 numbered-doc content assertions.
- **Suite (c) `workflow-invariance`**: private-taxonomy-leak scanner — needs a `node_modules/` guard, ~3 stale-entry refreshes, and ~40 justified technical-vocab allowlist entries.

### Data Flow
Root cause (`5149f3abe5` de-numbering) → three suites read now-renamed / relocated content → assertions fail → repair fixes the real doc/relocates the assertion/guards the scanner → suites green → injected-leak proof confirms the invariant is intact.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `outsourced-agent-handback-docs.vitest.ts` | Asserts a `149-` filename + `prompt_templates.md` parity | Update literal + repoint parity; leave `it.fails.skip` (~L26) alone | `vitest run` green; `git diff` shows L26 untouched |
| `cli-opencode/.../prompt_templates.md` | Content the parity assertion checks | Add missing `recentContext` example | Parity assertion passes against real doc content |
| `feature-flag-reference-docs.vitest.ts` | 8 mapping-row + 6 numbered-doc assertions | Relocate/repoint to current content | 14/14 formerly-failing assertions pass |
| `workflow-invariance.vitest.ts` | Private-taxonomy-leak scanner + allowlist | Add `node_modules/` guard; refresh ~3 stale; add ~40 justified | Suite green AND injected-leak run FAILS |

Required inventories:
- Same-class producers: `rg -n 'preset|capability|kind|manifest' <scan-root>` to triage the ~40 technical-vocab hits into legitimate-vocab vs real-leak buckets before allowlisting any.
- Consumers of changed symbols: none (test + doc only; no runtime symbol changes).
- Matrix axes: the ~120 invariance hits split into 3 classes (stale ~3 / spurious-node_modules ~11 / legitimate-vocab ~40); each class has a distinct remedy.
- Algorithm invariant: "the scanner flags any private-taxonomy token not on the justified allowlist" — adversarial case = a NEW injected leak token must still fail.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Spec folder scaffolded (this packet)
- [ ] Read the three suites' current assertions + resolve the de-numbered filename and `prompt_templates.md` path
- [ ] Baseline: capture the current RED output of all three suites (real starting failure counts)

### Phase 2: Repair
- [ ] Suite (a): replace stale `149-` literal; add `recentContext` example to `prompt_templates.md` (do NOT touch the `it.fails.skip` at ~L26)
- [ ] Suite (b): relocate the 8 env-var mapping-row assertions; repoint the 6 numbered-doc content assertions
- [ ] Suite (c): add `node_modules/` scan guard; refresh ~3 stale allowlist entries; add ~40 justified allowlist entries (each with a one-line rationale)

### Phase 3: Verification
- [ ] Run each suite green (`vitest run`)
- [ ] Injected-leak proof: temporarily add a fake taxonomy leak → confirm workflow-invariance FAILS → revert
- [ ] Confirm `git diff` shows the `vitest-recovery-followup` `it.fails.skip` line untouched
- [ ] `validate.sh --strict` clean on this packet
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit (vitest) | All three named suites → green | `vitest run <suite>` |
| Adversarial | Injected-leak proof for the invariant | temporary leak insertion + `vitest run`, then revert |
| Regression | Baseline RED counts vs post-fix green counts | full-suite delta |
| Structural | Spec packet itself | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Commit `5149f3abe5` de-numbering | Upstream (settled) | Landed | None — this packet is downstream of it |
| `vitest-recovery-followup` lane owning `it.fails.skip` (~L26) | Foreign lane | Active | MUST NOT edit that line; coordinate if it moves |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A repair introduces a new failure, or the injected-leak proof shows the invariant no longer catches leaks.
- **Procedure**: `git checkout -- <suite-file>` / `<doc-file>` to revert the specific edit; each suite is independent so a bad fix reverts without touching the others.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup + baseline) ──► Phase 2 (Repair a/b/c, parallel) ──► Phase 3 (Verify + injected-leak proof)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Repair |
| Repair (a) | Setup | Verify |
| Repair (b) | Setup | Verify |
| Repair (c) | Setup | Verify |
| Verify | Repair a/b/c | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 0.5-1 hour |
| Repair (a) | Low | 0.5-1 hour |
| Repair (b) | Med | 1-2 hours |
| Repair (c) | Med | 2-3 hours (triage + justify ~40 entries) |
| Verification | Low | 0.5-1 hour |
| **Total** | | **4.5-8 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline RED output captured for all three suites
- [ ] Foreign `it.fails.skip` line noted before editing suite (a)
- [ ] Injected-leak proof plan ready (insert → assert FAIL → revert)

### Rollback Procedure
1. Revert the offending suite/doc file with `git checkout -- <path>`
2. Re-run that suite to confirm it returns to its prior state
3. Confirm the other two suites are unaffected (independent)
4. Note the reversal in `implementation-summary.md`

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A (test + doc only)
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
