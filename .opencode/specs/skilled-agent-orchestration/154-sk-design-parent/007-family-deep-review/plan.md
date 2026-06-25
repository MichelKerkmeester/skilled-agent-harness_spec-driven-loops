---
title: "Implementation Plan: Phase 7: family-deep-review"
description: "The executed approach for the sk-design family deep review and remediation: smoke check, per-skill 2-model review fan-out, cross-model triage, per-skill fix agents, then packaging and routing validation."
trigger_phrases:
  - "sk-design family deep review plan"
  - "sk-design family remediation approach"
  - "sk-design two-model review plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/007-family-deep-review"
    last_updated_at: "2026-06-25T23:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored the Level-2 plan for the family deep-review and remediation phase"
    next_safe_action: "Validate the 007 docs strict, then resolve the deferred repo-wide derived-sync"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
      - "review/triage-final.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "skilled-agent-orchestration/154-sk-design-parent/007-family-deep-review"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 7: family-deep-review

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
| **Language/Stack** | Deep-review loop + skill-packaging tooling over markdown skill packages; the md-generator child also carries a TypeScript engine |
| **Framework** | Deep-review (2-model, skill-target mode); `package_skill.py --check`; skill-advisor (rebuild + recommend); md-generator vitest + typecheck |
| **Storage** | None (filesystem skill packages + advisor index + this spec folder) |
| **Testing** | `package_skill.py --check` per skill; `sk-design-md-generator` typecheck + 68/68 vitest; advisor rebuild + routing confirmation |

### Overview
This phase reviewed and remediated, it did not build. Each of the six family skills was put through a two-model deep review (Opus 4.8 and GPT-5.5-fast xhigh, five iterations each, skill-target mode), the twelve reports were consolidated into one cross-model triage, and per-skill fix agents remediated every confirmed and verified finding. Each remediated skill was version-bumped and changelogged, then re-checked with `package_skill.py --check`. The advisor was rebuilt live and SPEC/DESIGN routing was confirmed to resolve to `sk-design-md-generator`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] All six family skills exist and were integration-validated in Phase 6
- [x] Both review models available (Opus 4.8 via `~/.claude-account2`, GPT-5.5-fast xhigh)
- [x] Skill-advisor available for the post-remediation rebuild

### Definition of Done
- [x] Every confirmed/verified finding remediated in its owning skill
- [x] All six skills pass `package_skill.py --check`
- [x] `sk-design-md-generator` passes typecheck + 68/68 vitest
- [x] Each remediated skill version-bumped and changelogged
- [x] Advisor rebuilt; SPEC/DESIGN routing resolves to `sk-design-md-generator`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Review-then-remediate over the six-skill family. A 2-model review fan-out feeds a cross-model triage; the triage feeds per-skill fix agents; packaging and routing checks confirm integrity.

### Key Components
- **Review fan-out**: per skill, five Opus 4.8 iterations and five GPT-5.5-fast xhigh iterations in skill-target mode (`reviewTargetType=skill`), producing twelve `review-report.md` files.
- **Cross-model triage**: `review/triage-final.md` builds the verdict matrix, promotes Tier-1 confirmed findings (both models), lists Tier-2 single-model hypotheses, and records cross-cutting themes.
- **Per-skill fix agents**: one remediation pass per skill, each fix verified at source, then version bump + changelog.
- **Validation**: `package_skill.py --check` per skill, md-generator typecheck + vitest, advisor rebuild + routing confirmation.

### Data Flow
Each skill package is read by both review models; their reports are merged into the triage, which classifies every finding as confirmed or single-model. Fix agents act only on confirmed or source-verified findings, write changes into the owning skill package, and bump its version. The packaging check re-reads each package to confirm it still passes; the advisor rebuild re-indexes the family and the routing query confirms SPEC/DESIGN resolves to an existing child.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The review confirmed defects across the family; the table records the remediated surfaces and how each was verified. Skill-content edits live inside each skill package and its changelog.

| Surface | Finding | Action | Verification |
|---------|---------|--------|--------------|
| `sk-design` umbrella router | SPEC route named non-existent `sk-design-spec` | Repointed SPEC/DESIGN route to `sk-design-md-generator`; router pseudocode hygiene | Advisor rebuild; SPEC/DESIGN routes to `sk-design-md-generator`; `--check` PASS |
| `sk-design-md-generator` | Documented extract path rejected by output guard; detector/interaction schema docs drift | Canonical repo-root invocation; schema docs reconciled to real output | `--check` PASS; typecheck + 68/68 vitest PASS |
| `sk-design-interface` | `aesthetics/` presets vs no-preset contract; tool grant too broad | Reframed aesthetics as grounding cues; `allowed-tools` narrowed | `--check` PASS |
| `sk-design-foundations` | Color-role contract underspecified; layout routed to `sk-code` first | Canonical color-role set; layout resolves to foundations first | `--check` PASS |
| `sk-design-motion` | Router default collided with STRATEGY intent resource | `DEFAULT_RESOURCE` repointed to `corpus_map.md`; timing reconciled | `--check` PASS |
| `sk-design-audit` | `Bash` over-granted; key_files omitted resources; weight band | Dropped `Bash`; expanded key_files; sibling weight to band | `--check` PASS |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Review fan-out
- [x] Run five Opus 4.8 iterations per skill in skill-target mode (`reviewTargetType=skill`)
- [x] Run five GPT-5.5-fast xhigh iterations per skill in skill-target mode
- [x] Produce the twelve per-skill `review-report.md` files (~58 iterations total)

### Phase 2: Triage and remediation
- [x] Consolidate the twelve reports into `review/triage-final.md` (verdict matrix, tiers, themes)
- [x] Verify single-model findings at source before any fix (finding = hypothesis)
- [x] Run per-skill fix agents to remediate confirmed/verified findings
- [x] Bump each remediated skill's version and write its changelog entry

### Phase 3: Verification
- [x] Run `package_skill.py --check` for each of the six skills
- [x] Run `sk-design-md-generator` typecheck + vitest
- [x] Rebuild the advisor and confirm SPEC/DESIGN routing resolves to `sk-design-md-generator`
- [x] Record the deferred repo-wide derived-sync as a known follow-up
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Packaging check | Each of the six family skills still packages cleanly | `python3 .../sk-doc/scripts/package_skill.py <skill> --check` |
| Engine tests | md-generator TypeScript engine unchanged and green | `sk-design-md-generator` typecheck + vitest (68/68) |
| Routing confirmation | SPEC/DESIGN resolves to an existing child | advisor rebuild + `advisor_recommend` / routing query |
| Cross-model confirmation | A finding is real only when both models flag it | `review/triage-final.md` verdict matrix + per-finding source verification |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 6 integration-validation complete | Internal | Green | The family would not be assembled to review |
| Opus 4.8 review model (`~/.claude-account2`) | Internal | Green | One of two confirmation models missing |
| GPT-5.5-fast xhigh review model | Internal | Green | One of two confirmation models missing |
| skill-advisor (rebuild + recommend) | Internal | Green | Routing confirmation cannot run |
| graph-metadata regenerator (schema-v2 sync) | Internal | Not locatable in this checkout | Repo-wide derived-sync deferred; graph still structurally valid |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A remediation breaks a skill's packaging check, the md-generator tests, or SPEC/DESIGN routing.
- **Procedure**: Each fix is scoped to one skill package and recorded in that skill's changelog and version bump, so a regression is reverted per skill by rolling back that skill's remediation commit and re-running its `package_skill.py --check`. The review artifacts under `review/` are read-only evidence and need no rollback. The deferred repo-wide derived-sync was never applied, so there is nothing to revert there.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Review fan-out) ──► Phase 2 (Triage + remediation) ──► Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Review fan-out | Phase 6 family assembled | Triage + remediation |
| Triage + remediation | Review fan-out (twelve reports) | Verification |
| Verification | Triage + remediation | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Review fan-out (~58 iterations, 2 models x 6 skills) | High | Bulk of the phase |
| Triage + per-skill remediation | Med | Six fix passes |
| Verification (packaging, tests, routing) | Low | Per-skill `--check` + rebuild |
| **Total** | | **Completed 2026-06-25** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-change Checklist
- [x] Each fix scoped to one skill package
- [x] Each remediated skill version-bumped and changelogged
- [x] Review artifacts kept read-only as evidence

### Rollback Procedure
1. Identify the regressing skill from its `package_skill.py --check` failure.
2. Revert that skill's remediation commit (one skill per commit).
3. Re-run that skill's `package_skill.py --check` to confirm the prior state.
4. Leave the other five skills and the review artifacts untouched.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A - documentation and metadata edits only; the deferred repo-wide derived-sync was never applied.
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN
- Core + Verification additions
- Add L3 addendums for complexity
-->
