---
title: "Feature Specification: Phase 015 - Design Commands Router+Assets Implementation"
description: "Executes the Phase 013 plan: split all five /design:* commands into thin routers plus owned assets (auto.yaml, confirm.yaml, presentation.txt), adding :auto/:confirm parity with the speckit/create/deep command families."
trigger_phrases:
  - "design commands implementation"
  - "design command router split implementation"
  - "phase 015 design commands"
  - "design auto confirm build"
importance_tier: "high"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/015-design-commands-implementation"
    last_updated_at: "2026-07-06T19:40:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored spec.md for the Phase 013 implementation pass"
    next_safe_action: "Author plan.md, tasks.md, checklist.md, then build the 20 command files"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "design-commands-impl-015"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Phase 015 - Design Commands Router+Assets Implementation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-07-06 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

## Phase Navigation

| Link | Target |
|------|--------|
| **Parent Spec** | ../spec.md |
| **Predecessor Phase** | ../014-review-remediation/spec.md |
| **Design Source** | ../013-design-commands-asset-refactor/plan.md + decision-record.md |
| **Successor Phase** | None |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The five `/design:*` commands remain flat single-file commands with routing logic and presentation content (Ask-first wording, STATUS templates, handoff grammar) mixed together. Phase 013 fully designed the fix but its own scope explicitly excluded touching `.opencode/commands/design/**` — the plan sits unexecuted while `speckit`, `create`, and `deep` command families already enjoy the router+assets split and `:auto`/`:confirm` interaction parity.

### Purpose

Execute Phase 013's plan: produce five thin routers and fifteen owned assets that preserve every current command behavior exactly while adding the `:auto`/`:confirm` interaction dimension, verified by a structural diff against the five original files.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Rewrite `.opencode/commands/design/{interface,foundations,motion,audit,md-generator}.md` as thin routers (Router Contract, Owned Assets, Mode Routing, Execution Targets, Presentation Boundary, Workflow Summary).
- Create `.opencode/commands/design/assets/design_<mode>_auto.yaml` and `design_<mode>_confirm.yaml` for all five modes (10 files), carrying the relocated INSTRUCTIONS/CHOREOGRAPHY/EMIT DELIVERABLE content as workflow steps.
- Create `.opencode/commands/design/assets/design_<mode>_presentation.txt` for all five modes (5 files), carrying the consolidated setup prompt (ADR-001), auto-resolution table (ADR-002), STATUS templates, and next-step suggestions.
- Run a structural-diff/content-inventory verification confirming no task lane, sibling discriminator, precondition, register dial, deliverable field, or handoff grammar line changed beyond the added interaction dimension.
- Update Phase 013's own `implementation-summary.md` to record that its plan was executed in this phase (cross-reference only; no rewrite of 013's historical planning content).

### Out of Scope

- Any edit to `.opencode/skills/sk-design/**` (the mode packets, hub, or shared references) — this phase only touches the command layer that wraps them.
- Any edit to `.opencode/skills/sk-doc/**`.
- Adding a sixth `/design:*` mode or changing `mode-registry.json`'s five-mode taxonomy.
- Inventing new required input beyond what each mode's current `PRECONDITIONS` already asks for (per ADR-001, the consolidated prompt only reorders existing questions).
- Matching `speckit:plan`'s workflow-YAML scale (multi-step gated planning with agent dispatch); the design commands' workflow YAML stays proportional to a single-mode application.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/commands/design/interface.md` | Rewrite | Thin router |
| `.opencode/commands/design/foundations.md` | Rewrite | Thin router |
| `.opencode/commands/design/motion.md` | Rewrite | Thin router |
| `.opencode/commands/design/audit.md` | Rewrite | Thin router |
| `.opencode/commands/design/md-generator.md` | Rewrite | Thin router (Write/Edit/Bash tools, not read-only) |
| `.opencode/commands/design/assets/design_<mode>_auto.yaml` (x5) | Create | Autonomous workflow per mode |
| `.opencode/commands/design/assets/design_<mode>_confirm.yaml` (x5) | Create | Interactive workflow per mode |
| `.opencode/commands/design/assets/design_<mode>_presentation.txt` (x5) | Create | Presentation contract per mode |
| `../013-design-commands-asset-refactor/implementation-summary.md` | Update | Cross-reference to this phase as the executed implementation |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Five thin routers exist with the six required sections in order | Each `<mode>.md` has Router Contract/Owned Assets/Mode Routing/Execution Targets/Presentation Boundary/Workflow Summary, no inline presentation content |
| REQ-002 | Fifteen owned assets exist per the naming convention | `assets/design_<mode>_{auto,confirm,presentation}.{yaml,yaml,txt}` present for all five modes |
| REQ-003 | No task lane, sibling discriminator, precondition, register dial, deliverable field, or handoff grammar line changed in meaning | Structural diff against the five original files confirms relocation only |
| REQ-004 | `:auto`/`:confirm` interaction dimension added per ADR-001/ADR-002 | Each router's Mode Routing implements the completeness-based default rule; each presentation asset has a Consolidated Prompt Template and Auto Resolution Table |
| REQ-005 | Frontmatter (`description`, `argument-hint`, `allowed-tools`) preserved unchanged in each router | Diff against original frontmatter shows no value change |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | `md-generator`'s distinct `allowed-tools` (Write/Edit/Bash/Read/Glob/Grep) preserved, others stay Read/Glob/Grep | Frontmatter diff confirms per-mode tool surface unchanged |
| REQ-007 | `interface`'s task-lane menu and the other four modes' single-lane behavior preserved | Router content includes the same lane table (interface) or omits it (others), matching originals |
| REQ-008 | TASK PROJECTIONS advisory verbs preserved without becoming new commands | Presentation/workflow assets name the same verb sets (interface, foundations, audit) and negative-corpus sentence |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 20 files created/rewritten, `validate.sh --strict` on this phase folder passes with 0 errors.
- **SC-002**: A structural diff confirms behavior preservation for all five modes.
- **SC-003**: `:auto`/`:confirm` works identically across all five modes per the single shared ADR-002 rule (no per-mode divergence).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 013's plan.md/decision-record.md as design source | High - wrong split without them | Both fully read before implementation began |
| Risk | Workflow YAML scope creep toward `speckit:plan`'s scale | Medium | Explicitly bounded in scope: proportional to a single-mode application, not a multi-step gated workflow |
| Risk | Silent behavior drift during relocation | High | Structural-diff verification task required before completion claim |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None outstanding - spec folder placement (new phase 015, not reopening 013) was confirmed via AskUserQuestion before this spec was written.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Every mode's fully-specified invocation (e.g. `/design:interface dashboard-shell --mode redesign`) continues to run with zero prompts, per ADR-002.

### Maintainability
- **NFR-M01**: Presentation wording changes touch only the `_presentation.txt` asset, never the router or workflow YAML.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### State Transitions
- Explicit `:auto` with missing required input: Auto Fail-Fast Display, `STATUS=FAIL`, never a silent guess.
- Explicit `:confirm` with fully-specified `$ARGUMENTS`: still shows the consolidated prompt once (per ADR-002), does not skip it.
- No suffix, incomplete `$ARGUMENTS`: falls back to the `:confirm` consolidated prompt, not the old per-precondition Ask-first sequence.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | 20 files across 5 commands, uniform shape but real content in each |
| Risk | 10/25 | Documentation/command-authoring only; no runtime code path, no data migration |
| Research | 2/20 | Phase 013 already did all research; this phase executes a settled plan |
| **Total** | **32/70** | **Level 2-adjacent, kept at Level 3 to match Phase 013's own level for continuity** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

None - see section 7.

---

## RELATED DOCUMENTS

- **Design Source**: `../013-design-commands-asset-refactor/plan.md`, `../013-design-commands-asset-refactor/decision-record.md`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
