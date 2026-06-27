---
title: "Implementation Plan: adopt the make-interfaces-feel-better backlog into sk-design"
description: "Per-mode build plan applying the 16 adoption items from the 022 research backlog into the live sk-design modes via cli-codex gpt-5.5 high fast, scope-locked to named anchors, with per-diff verification."
trigger_phrases:
  - "mifb design adoption plan"
  - "sk-design corpus adoption build plan"
  - "implement design backlog plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/023-mifb-design-adoption"
    last_updated_at: "2026-06-27T09:26:47Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the per-mode build plan and edit map"
    next_safe_action: "Dispatch cli-codex gpt-5.5 high fast to apply the foundations edits"
    blockers: []
    key_files:
      - "spec.md"
      - "../022-mifb-design-research/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "build-154-023-mifb-design-adoption"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
# Implementation Plan: adopt the make-interfaces-feel-better backlog into sk-design

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
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
| **Language/Stack** | Markdown design-guidance docs in the sk-design skill |
| **Framework** | system-spec-kit phase; cli-codex gpt-5.5 high fast as the edit executor |
| **Storage** | n/a (skill content edits) |
| **Testing** | `validate.sh --strict` on the packet; per-diff scope-lock review; sk-design self-consistency read |

### Overview
Apply the 16 adoption items from `../022-mifb-design-research/research/research.md` into the live sk-design modes. Edits are grouped into five focused cli-codex dispatches (foundations, audit, motion, interface, and md-generator+shared+hub-fix), each scope-locked to the anchors the 022 coverage map names, each verified by diff before the next dispatch.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The 022 backlog and coverage map exist and name exact target files + anchors
- [x] All 12 target files confirmed present
- [x] Executor confirmed (cli-codex gpt-5.5 high fast, workspace-write)

### Definition of Done
- [x] All 16 items applied at their anchors + the hub doc fix
- [x] Every diff scope-locked (no adjacent rewrite); conflict decisions preserved
- [x] `validate.sh --strict` clean for the packet
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Anchor-scoped additive edits to existing mode docs (foundations = rule home, audit = enforcement pair), applied by a focused per-mode executor and verified by the orchestrator.

### Key Components
- **cli-codex gpt-5.5 high fast**: reads each target, composes the addition in sk-design voice, applies it at the named anchor.
- **Orchestrator**: writes the scope-locked prompts, verifies each diff, reverts and re-dispatches on scope drift.

### Data Flow
022 backlog → per-mode scope-locked prompt → codex edit at anchor → diff review → accept or revert → next group.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Each surface is edited additively at the anchor the 022 coverage map names. Adjacent content is not rewritten.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `design-foundations/.../layout/layout_responsive.md` | layout/spacing rules | add concentric-radius math; optical-alignment base examples | diff shows additive block at spacing/shape section |
| `design-foundations/.../color/palette_theming.md` | color/depth/theming | add image-outline pure-rgba exception; shadow-as-border matrix; dark-mode white-ring | diff shows additions after border/stroke + surface/depth |
| `design-foundations/.../type/typography_system.md` | type system | add root font smoothing; text-wrap caveats; tabular framing | diff shows additions in readability + data-role sections |
| `design-audit/references/anti_patterns_production.md` | production anti-patterns | add radius/outline/hit-area/shadow-ring detectors | diff shows new detector bullets after token-drift |
| `design-audit/references/accessibility_performance.md` | a11y/perf audit | add `transition: all` static-risk detector | diff shows detector next to will-change |
| `design-motion/references/micro_interactions.md` | micro-interactions | add icon-swap CSS fallback; static press-scale escape hatch | diff shows additions near animation-mechanism / morphing icons |
| `design-motion/references/motion_strategy.md` | motion strategy | add semantic split/stagger; small fixed-translate exits | diff shows additions near timing/material rules |
| `design-interface/references/design-process/mechanical_defaults.md` | build judgment | add optical-alignment examples | diff shows examples added, no rule-family rewrite |
| `design-interface/assets/interface_preflight_card.md` | preflight card | add alignment/outline/radius/hit-area reminders | diff shows reminder lines added |
| `design-md-generator/SKILL.md` | extraction mode | add measured-capture reminder only | diff shows a capture note, no taste defaults |
| `shared/design_token_vocabulary.md` | shared vocab | add `image-edge outline` + `shadow ring` terms (optional) | diff shows vocab entries, mechanics stay in foundations/audit |
| `SKILL.md` (hub) | routing hub | fix shared-base citation `references/` -> `shared/` | grep shows `shared/` paths, no `references/` shared-base lines |

Required inventories:
- Same-class producers: each edit is additive guidance; no shared symbol changes.
- Consumers of changed symbols: none — these are human-read design docs, not code APIs.
- Matrix axes: 16 backlog items x their named anchors; the do-not list applies to every edit.
- Algorithm invariant: shadow-as-border is replacement-only; image-outline is an optical exception; 44x44 and stagger caps are preserved.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Phase folder + spec/plan/tasks scaffolded
- [x] Target files confirmed; executor confirmed
- [x] Per-group scope-locked prompts authored

### Phase 2: Core Implementation
- [x] Group A foundations (radius, image-outline, font smoothing, text-wrap, shadow matrix, dark ring, tabular)
- [x] Group B audit (radius/outline/hit-area/shadow detectors; `transition: all`)
- [x] Group C motion (icon-swap fallback, static escape hatch, split/stagger, fixed-exit)
- [x] Group D interface (optical examples, preflight reminders)
- [x] Group E md-generator reminder + shared vocab + hub doc fix

### Phase 3: Verification
- [x] Each diff scope-lock verified; conflict decisions preserved
- [x] Three absences confirmed in the diff (no review-format, no hub logic, no wholesale defaults)
- [x] `validate.sh --strict` clean; phase docs finalized
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | n/a (doc edits) | n/a |
| Integration | Cross-file consistency (foundations rule <-> audit detector pairs) | Read/Grep |
| Manual | Per-diff scope-lock + voice-match review; do-not-list compliance | git diff, Read |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 022 research backlog + coverage map | Internal (read-only) | Green | No build spec |
| Live sk-design mode packets | Internal | Green | Nothing to edit |
| cli-codex gpt-5.5 high fast | External | Green | Edits cannot be applied as directed |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: An edit drifts scope, breaks a doc, or contradicts a do-not item.
- **Procedure**: `git checkout -- <file>` to revert the specific sk-design file to its pre-dispatch state, then re-dispatch with a tighter prompt. The whole phase reverts by discarding the working-tree changes to `.opencode/skills/sk-design/**`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► A foundations ──► B audit ──► C motion ──► D interface ──► E md-gen/shared/hub ──► Verify
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | A |
| A foundations | Setup | B (audit detectors pair with foundations rules) |
| B audit | A | Verify |
| C motion | Setup | Verify |
| D interface | A | Verify |
| E md-gen/shared/hub | A | Verify |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | scaffolded |
| Foundations (Group A) | High | one focused codex dispatch + diff review |
| Audit (Group B) | Med | one dispatch + review |
| Motion (Group C) | Med | one dispatch + review |
| Interface + md-gen/shared/hub (D+E) | Med | two dispatches + review |
| **Total** | | **5 dispatches, verify between each** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] The 022 deliverable is preserved and unaffected by this phase
- [x] Every target file is under git, so per-file revert is clean
- [x] Each dispatch is verified before the next begins

### Rollback Procedure
1. Identify the drifted file from the diff review
2. `git checkout -- <file>` to restore its pre-dispatch state
3. Re-dispatch that group with a tighter scope-locked prompt
4. No regression re-run needed beyond re-reading the restored file

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────────┐
│ 022 backlog + map     │
└──────────┬───────────┘
           ▼
┌──────────────────────┐     ┌──────────────────────┐
│ A foundations (rules) │────►│ B audit (detectors)   │
└──────────┬───────────┘     └──────────────────────┘
           │
           ├────► D interface (preflight)
           └────► E md-gen / shared / hub fix
┌──────────────────────┐
│ C motion (independent)│
└──────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| 022 backlog | (read-only) | edit spec | all groups |
| A foundations | backlog | live rules | B, D, E |
| B audit | A | live detectors | Verify |
| C motion | backlog | live motion edits | Verify |
| D interface | A | preflight reminders | Verify |
| E md-gen/shared/hub | A | capture note, vocab, doc fix | Verify |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Foundations rules** - the rule home everything else references - CRITICAL
2. **Audit detectors** - pair with the foundations rules to make them reviewable - CRITICAL
3. **Verification** - per-diff scope-lock + strict validation - CRITICAL

**Total Critical Path**: Setup → foundations → audit → verify (motion/interface/md-gen run alongside).

**Parallel Opportunities**:
- Motion (Group C) does not depend on foundations and can be dispatched independently.
- Interface and md-gen/shared/hub edits can follow foundations in any order.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Foundations rules live | radius/outline/smoothing/text-wrap/shadow/ring/tabular applied at anchors | Phase 2 |
| M2 | Audit detectors live | five detectors applied; paired with foundations rules | Phase 2 |
| M3 | Motion + interface + md-gen/shared/hub live | icon-swap fallback, preflight reminders, capture note, vocab, hub doc fix | Phase 2 |
| M4 | Verified + validated | all diffs scope-locked, conflict decisions preserved, strict validation clean | Phase 3 |
<!-- /ANCHOR:milestones -->

---

<!--
LEVEL 3 PLAN ADDENDUM
- L2/L3 sections: phase dependencies, effort, enhanced rollback, dependency graph, critical path, milestones
- Build cluster: five scope-locked cli-codex dispatches, orchestrator verifies each diff
-->
