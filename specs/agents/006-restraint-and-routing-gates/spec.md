---
title: "Feature Specification: Pre-Write Restraint and Artifact Routing in AGENTS.md"
description: "The restraint doctrine this framework already owns lives downstream of the moment it is needed: the Design Restraint Ladder sits inside sk-code, test-quality rules sit in the review lane, and Gate 2 routes on advisor confidence alone, never on artifact type. Root AGENTS.md therefore never triggers any of it before the first write."
trigger_phrases:
  - "pre-write restraint"
  - "artifact routing gate"
  - "over-engineering"
  - "test bloat"
  - "doctrine amendment"
  - "agents.md"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "agents/006-restraint-and-routing-gates"
    last_updated_at: "2026-08-29T13:43:03Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Authored and shipped the AGENTS.md restraint and routing edits"
    next_safe_action: "Packet complete; no further action pending"
    blockers: []
    key_files:
      - "AGENTS.md"
      - ".opencode/skills/sk-code/shared/references/universal/code-quality-standards.md"
      - ".opencode/skills/sk-code/sk-code-review/assets/test-quality-checklist.md"
      - ".opencode/skills/sk-doc/SKILL.md"
      - ".opencode/skills/sk-communication/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-29-agents-006"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Enforcement strength: tighten Gate 2 in place, no new gate (operator, 2026-08-29)"
      - "Scope: plan and apply in the same session (operator, 2026-08-29)"
      - "Line budget: additions only, no offsetting trims (operator, 2026-08-29)"
---
# Feature Specification: Pre-Write Restraint and Artifact Routing in AGENTS.md

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-29 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Every restraint rule this framework needs already exists somewhere, but not where it fires. The **Design Restraint Ladder (pre-write)** lives in `sk-code`'s `shared/references/universal/code-quality-standards.md` §1 and only loads once `sk-code` is invoked. Test-quality rules live in `sk-code`'s review mode, which runs *after* the tests are written. `GATE 2: SKILL ROUTING` binds on advisor confidence alone, so an agent can write code, or a `.md` file, without ever resolving `sk-code` or `sk-doc`. Three further rules have no home at all: test-creation restraint, a path to propose a skill-doctrine change instead of silently working around it, and the route to `sk-communication` when a reader says they do not follow — a skill deliberately excluded from advisor routing and therefore reachable only by an explicit rule.

### Purpose
Make the restraint that already exists fire before the first write, by adding an artifact-type trigger to Gate 2 and six short rules to §1, §4, and §8 that point at the authoritative contracts rather than restating them.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Gate 2 artifact trigger: first code write resolves an `sk-code` surface + mode; first `.md` write resolves an `sk-doc` mode.
- §4 pointer to the Design Restraint Ladder, so the pre-write YAGNI reflex is reachable from the always-loaded root doc.
- §4 systems-first bullet naming the SYSTEMS and SCOPE lenses as a pre-write pass.
- §4 test-restraint principle (net-new: nothing in AGENTS.md governs test creation today).
- §4 tightening of the repeat-attempt bullet into an explicit level-up-to-the-seam rule.
- §1 `PLAN-WORKFLOW LOCK` step 4: propose a doctrine amendment rather than absorb or work around it.
- §8 `sk-communication` routing rule for reader-comprehension failure.

### Out of Scope
- Restating the ladder rungs, test smells, or `sk-doc` mode table in AGENTS.md - each stays authoritative in its skill and is referenced. Duplication is what the earlier bloat audit exists to prevent.
- A new hard-blocking gate. The operator chose to tighten Gate 2 in place; a sixth gate adds per-turn friction on trivial edits without adding reach.
- Offsetting line trims from the earlier bloat audit's held candidates - mixing a removal pass into this diff makes both harder to review.
- Any change to `sk-code`, `sk-doc`, or `sk-communication` themselves. This packet only makes the root doc reach them.
- Runtime, hook, or advisor-config changes. The advisor route-exclusion that hides `sk-communication` is deliberate and stays.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `AGENTS.md` | Modify | 6 added lines (§1, §2, §4 x3, §8), 3 tightened lines (§2 Output, §2 Skip, §4 repeat-attempt) |
| `specs/agents/006-restraint-and-routing-gates/*` | Create | Level 2 packet docs + description.json + graph-metadata.json |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Gate 2 binds on artifact type independently of advisor score | Gate 2 carries a trigger naming the first code write → `sk-code` surface+mode and the first `.md` write → `sk-doc` mode, with spec-folder docs routed to `system-spec-kit` |
| REQ-002 | The pre-write restraint ladder is reachable from AGENTS.md | §4 Planning & Approach names the ladder's rungs in order and cites `code-quality-standards.md` §1 as authoritative |
| REQ-003 | Test creation is governed at author time | §4 Quality Principles carries a test-restraint rule; the phrase is absent from AGENTS.md before this change |
| REQ-004 | Every added rule points at an existing contract instead of copying it | No added line restates the ladder rungs' rationale, the `sk-doc` mode table, or the test-smell list; each names its source file |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | A skill's doctrine can be challenged without being silently bypassed | `PLAN-WORKFLOW LOCK` carries a step directing the agent to follow the contract for the task and name the file, rule, and replacement in the same response |
| REQ-006 | Reader-comprehension failure routes to `sk-communication` | §8 carries the rule and states why it must live there: the skill is on the advisor route-exclusion denylist and can never be recommended automatically |
| REQ-007 | The diff stays additive and small | `git diff --stat AGENTS.md` shows ≤ 12 changed lines; section headers still read 1..10 in order |
| REQ-008 | Packet passes strict spec validation | `validate.sh <folder> --strict` exits 0 or 1 (warnings only), no errors |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: An agent reading only AGENTS.md meets the YAGNI ladder before its first code write, and the `sk-doc` router before its first `.md` write.
- **SC-002**: The three genuinely uncovered behaviors — test-creation restraint, doctrine amendment, comprehension routing — each have exactly one home.
- **SC-003**: AGENTS.md grows by no more than 6 physical lines; no rule is copied from a skill that already owns it.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Gate 2 artifact trigger fires on trivial edits | Per-turn friction, gate fatigue, agents skipping the gate wholesale | Carry an explicit skip for single-line edits to a file already read this session; keep the trigger at "resolve the mode", not "re-read the whole skill" |
| Risk | Restraint ladder drifts from the AGENTS.md summary | Two versions of the rungs, root copy silently stale | Summarize rungs in one line and cite the authoritative file; never expand the rationale here |
| Risk | The test-restraint rule reads as "write fewer tests" | Real coverage gaps shipped as compliance | Phrase as a per-test earning test ("can fail for one real reason a current test cannot catch"), not a budget; changed behavior still gets coverage |
| Risk | Doctrine-amendment step read as permission to deviate | Silent workarounds justified as amendments | Step keeps "follow it for this task"; the amendment is a proposal in the same response, not a licence |
| Dependency | `CLAUDE.md` → `AGENTS.md` symlink, plus per-repo `AGENTS.md` symlinks | One edit propagates to every repo at once; a wrong edit propagates too | Symlink topology confirmed before editing; rollback is a single `git checkout` |
| Dependency | `validate.sh` reachable without the `.opencode` symlink trap | Packet validity unprovable | Editing from inside the Public checkout, where `validate.sh` resolves in-repo |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: Added lines match house style (`- **Term** — explanation.`) and sit inside existing subsections; no new `##`-level section.
- **NFR-M02**: No ephemeral artifact ids (spec paths, REQ/CHK/task ids) in the instruction prose.

### Consistency
- **NFR-C01**: Each added rule names the skill file that owns the detail, so the root doc stays a router and the skill stays the authority.
- **NFR-C02**: The doctrine-amendment step mirrors `sk-code`'s existing scope-amendment pattern ("implement the requirement and raise a scope-amendment recommendation; do not silently cut scope") rather than inventing a second escalation shape.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Gate Boundaries
- **Skill already in context**: resolving a mode does not mean re-reading a skill already loaded this session; the gate asks for the named mode, not a re-read.
- **Spec-folder markdown**: `spec.md`, `plan.md`, `tasks.md`, `checklist.md` are `system-spec-kit`'s, not `sk-doc`'s — `sk-doc`'s own "When NOT to Use" says so, and the trigger must not misroute them.
- **Trivial edit**: a one-line fix in a file already read this turn does not re-arm the artifact trigger.

### Rule Collisions
- **Restraint ladder vs SCOPE LOCK**: rung 1 (YAGNI) can conclude the work is unnecessary; SCOPE LOCK still forbids silently cutting it. The ladder's own rung 1 already resolves this by requiring a surfaced scope-amendment recommendation.
- **Doctrine amendment vs PLAN-WORKFLOW LOCK**: the lock forbids substituting a workflow; the new step permits proposing a change to one. Following the contract for the current task keeps both true.
- **Test restraint vs P1 "Test coverage at boundaries"**: `sk-code` requires happy path plus one edge case per public surface. Restraint governs tests beyond that bar, not the bar itself.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | 1 file, ~9 changed lines, 1 packet |
| Risk | 16/25 | No code path, but the file is symlinked into every repo and edits behavioral gates for every runtime |
| Research | 8/20 | Required reading `sk-code`, `sk-doc`, `sk-communication`, and the earlier bloat audit to avoid duplicating existing doctrine |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should the artifact trigger also cover config and schema files (`.json`, `.yaml`) that are neither code nor prose? **DEFERRED: not raised by the operator; `sk-code`'s OpenCode surface already carries JSON/JSONC authoring checklists reachable once the code path fires.**
- Should the per-turn directive capsule carry a restraint directive alongside hygiene, governor, and proof? **DEFERRED: capsule content is owned by `render.ts`, outside this packet's file scope.**
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Prior bloat baseline**: See `../004-agents-md-bloat-audit/research/research.md`
<!-- /ANCHOR:related-docs -->
