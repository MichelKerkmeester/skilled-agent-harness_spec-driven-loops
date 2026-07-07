---
title: "Implementation Plan: sk-code engineering rituals: mutation-check, verification ladder with named blind spots, and decision-economy plus fail-closed-by-construction doctrine [template:level_2/plan.md]"
description: "[2-3 sentences: what this implements and the technical approach]"
trigger_phrases:
  - "implementation"
  - "plan"
  - "name"
  - "template"
  - "plan core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/z_archive/016-sk-code-rituals"
    last_updated_at: "2026-06-15T14:06:39Z"
    last_updated_by: "template-author"
    recent_action: "Initialized Level 2 template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-sk-code/z_archive/016-sk-code-rituals"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: sk-code engineering rituals: mutation-check, verification ladder with named blind spots, and decision-economy plus fail-closed-by-construction doctrine

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
| **Language/Stack** | Markdown skill surface (`sk-code/SKILL.md`); optional Markdown constitutional rules |
| **Framework** | system-spec-kit skill + constitutional rule conventions |
| **Storage** | None - read-surface text only |
| **Testing** | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh` for the spec folder; `bash .opencode/skills/sk-code/scripts/check-comment-hygiene.sh` on any added snippet; manual grep assertions for required phrases; the existing `sk-code` smart-router tests must stay green |

### Overview
This phase edits the `sk-code` verification guidance to add three point-of-use rituals from the fable-mode research: a mutation-check / claim-falsifier step (rec B4), a unit -> in-memory -> on-server -> live verification ladder with each rung's blind spot named (rec B5), and a decision-economy + fail-closed-by-construction doctrine (rec #11 / B5). The approach is additive and confined to the verification section so the smart router and command tables do not regress.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented (recs B4/B5/#11 cited from `recommendations.md`)
- [ ] Success criteria measurable (grep-checkable required phrases defined)
- [ ] Dependencies identified (none - point-of-use)

### Definition of Done
- [ ] All P0/P1 acceptance criteria in `checklist.md` met with grep evidence
- [ ] `check-comment-hygiene.sh` clean on any added snippet; smart-router routing unchanged
- [ ] Docs updated (spec/plan/tasks/checklist synchronized); `validate.sh --strict` PASSES
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation augmentation of a single skill surface (advisory point-of-use rituals). No software architecture; the "architecture" is where the text lands and how it is kept from decaying.

### Key Components
- **`sk-code/SKILL.md` verification section (Phase 3 + Iron Law)**: the host for all three rituals; the highest-leverage point because it is the gate every completion claim passes through.
- **Optional constitutional rules** (`decision-economy.md`, `fail-closed-by-construction.md`): the always-surfacing home if the owner decides the doctrine must reach beyond code work.

### Data Flow
An agent finishing a code change reaches Phase 3, runs the surface verification commands, then performs the mutation-check, climbs the named-blind-spot ladder only as far as it actually verified, and resolves any open decision into a named seam or `[UNCERTAIN:]` marker before claiming completion.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/sk-code/SKILL.md` verification section | Owns Phase 3 verification guidance + Iron Law | Update (additive: 3 rituals) | `grep` for required phrases; `git diff` confined to verification section |
| `.opencode/skills/sk-code/SKILL.md` §2 smart router | Owns surface detection / intent classification / command tables | Unchanged - must not regress | `git diff` shows routing text untouched; routing behavior identical (REQ-003) |
| `.opencode/skills/system-spec-kit/constitutional/` | Owns always-surfacing rules | Update only if OQ-1 resolves to promote (optional create) | New file(s) match sibling rule format; `README.md` index updated if a rule is added |
| `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh` | Owns comment-hygiene enforcement | Not a consumer (run as a gate, not edited) | Run on any added snippet; zero violations |

Required inventories:
- Same-class producers: `rg -n 'mutation|true-RED|compile-RED|blind spot|fail-closed|named seam' .opencode/skills/sk-code/SKILL.md` to confirm there is no pre-existing duplicate ritual to reconcile.
- Consumers of changed symbols: none - this surface is read, not imported; no code symbol changes. Confirm with `rg -n 'sk-code/SKILL.md' .opencode --glob '*.md'` to ensure no doc hard-codes a line number into the verification section.
- Matrix axes: surface (WEBFLOW / OPENCODE / UNKNOWN) x rung applicability; confirm the generic rung names map onto each surface (OQ-2).
- Algorithm invariant: not applicable - no path/redaction/parser/resolver/security logic changes; this is advisory text only.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Each step names the file it touches and how it is verified. There is no upstream dependency: this is a point-of-use ritual (DEPENDENCIES: None), so it can ship in any order relative to the other fable-5 phases.

### Phase 1: Setup
- [ ] Read `.opencode/skills/sk-code/SKILL.md` in full and capture the baseline line count and the exact bounds of the verification section (Phase 3, around lines 41 and 208-214) so additions stay confined. File: `sk-code/SKILL.md`. Verify: baseline `wc -l` recorded; section bounds noted.
- [ ] Confirm no pre-existing mutation-check / ladder text exists with the producer grep. File: `sk-code/SKILL.md`. Verify: grep returns only the verification-command rows, no duplicate ritual.

### Phase 2: Core Implementation
- [ ] Add the mutation-check / claim-falsifier ritual to the verification guidance: after green, break the production code and confirm the test fails; distinguish true-RED (assertion fails against correct intent) from compile-RED (suite never compiled/ran); call out hunting vacuous green. File: `sk-code/SKILL.md`. Verify: grep finds the break-it instruction and the true-RED vs compile-RED distinction.
- [ ] Add the unit -> in-memory -> on-server -> live ladder with the blind spot each rung leaves named (unit: integration/wiring unseen; in-memory: real I/O and serialization unseen; on-server: deployment/config/env-specific behavior unseen; live: only proves the path actually exercised). Include the one-line WEBFLOW-vs-OPENCODE rung mapping (OQ-2). File: `sk-code/SKILL.md`. Verify: grep finds all four rungs + a named blind spot per rung.
- [ ] Add the decision-economy + fail-closed-by-construction doctrine: a named seam with a closing condition instead of a bare `TODO`, never a dead control; prefer structural invariants over disciplinary reminders. File: `sk-code/SKILL.md`. Verify: grep finds the named-seam / no-dead-control language and the fail-closed statement.
- [ ] (Optional, OQ-1) If owner promotes the doctrine, create `decision-economy.md` and/or `fail-closed-by-construction.md` under `.opencode/skills/system-spec-kit/constitutional/` matching the sibling rule format and update its `README.md` index. Files: the new rule file(s) + `constitutional/README.md`. Verify: file format matches a sibling rule; README index lists it.

### Phase 3: Verification
- [ ] Run `check-comment-hygiene.sh` on any added code snippet; confirm zero violations. Verify: script exits clean.
- [ ] Confirm smart-router routing is unchanged via `git diff` (no edits outside the verification section) and that `sk-code` still loads. Verify: diff confined; routing behavior identical (REQ-003).
- [ ] Run `validate.sh --strict` on this spec folder and mark `checklist.md` items with evidence. Verify: validator PASSES; checklist P0/P1 complete.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Phrase assertion | Required ritual phrases present in the verification section | `grep` / `rg` against `sk-code/SKILL.md` |
| Hygiene | Any added code snippet | `bash .opencode/skills/sk-code/scripts/check-comment-hygiene.sh` |
| Regression | Smart-router routing unchanged | `git diff` confinement check; `sk-code` load check |
| Spec validation | This spec folder is valid and complete | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <folder> --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| None (point-of-use ritual) | Internal | Green | No blocker - this phase does not wait on B1 (executor fail-loud), B2 (governor capsule), B3 (subagent channel), or C1 (measurement). Per `recommendations.md` it sits in the "rituals + doctrine" step and can land independently. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A routing regression appears in `sk-code`, the verification additions are judged too verbose, or the owner rejects the ritual wording.
- **Procedure**: `git revert` (or `git checkout`) the `sk-code/SKILL.md` edit and remove any optional constitutional rule file plus its README index entry. No data, state, or migration is involved; the surface returns to its prior text immediately.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup: read + baseline) ──► Phase 2 (Core: add 3 rituals) ──► Phase 3 (Verify: hygiene + diff + validate)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None (this packet has no external dependency) | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | ~20 min (read + baseline + producer grep) |
| Core Implementation | Med | ~1-2 hours (tight, instructional ritual wording; optional rule files) |
| Verification | Low | ~30 min (hygiene + diff confinement + validate) |
| **Total** | | **~2-3 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline `wc -l` of `sk-code/SKILL.md` recorded before editing
- [ ] No feature flag needed (read-surface text, not gated runtime)
- [ ] No monitoring needed (no runtime behavior change)

### Rollback Procedure
1. Identify the offending edit (verification-section addition or optional rule file).
2. `git revert` or `git checkout -- .opencode/skills/sk-code/SKILL.md`; delete any optional constitutional rule file and its README index entry.
3. Confirm `sk-code` loads and the smart router resolves surfaces as before (smoke: trigger a routing question).
4. No stakeholder notification needed - internal skill text, not user-facing.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A - documentation-only change with no state or schema impact.
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->

