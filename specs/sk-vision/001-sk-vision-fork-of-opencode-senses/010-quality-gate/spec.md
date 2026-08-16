---
title: "Feature Specification: sk-vision 010 quality gate"
description: "Prove perfect alignment: re-run every skill and packet gate, reconcile metadata, sweep for stray files, and record the evidence."
trigger_phrases:
  - "sk-vision quality gate"
  - "sk-vision conformance proof"
  - "sk-vision metadata reconciliation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/010-quality-gate"
    last_updated_at: "2026-08-16T12:00:00.000Z"
    last_updated_by: "pi"
    recent_action: "Created 010 copy pack."
    next_safe_action: "Implement the gate sequence from this spec copy pack."
    blockers: []
    key_files:
      - "spec.md"
      - ".opencode/skills/sk-vision/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-010-quality-gate"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: sk-vision 010 quality gate

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-16 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | 009-manual-testing-playbook |
| **Successor** | Parent completion |
| **Handoff Criteria** | Every gate in the copy pack passes with recorded output; metadata reconciled (stale continuities fixed, `last_active_child_id` current); no stray files; parent `validate.sh --recursive --strict` exit 0. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is a **leaf phase** under the sk-vision packet root — the closing proof for the 006-010 amendment.

**Scope Boundary**: Read-only verification of `.opencode/skills/sk-vision/` plus targeted metadata edits in `specs/` (continuity fields, `last_active_child_id`). No code changes. No doc rewrites except fixing metadata that this phase's checks find stale.

**Dependencies**:
- 006, 007, 008, 009 complete.

**Deliverables**:
- Gate evidence table in this child's implementation-summary (every command + exit status).
- Reconciled metadata (fixed stale continuities, current `last_active_child_id`).
- Clean final-state sweep.

**Changelog**:
- Record the gate verdict in the skill changelog if one exists; otherwise in this child's implementation-summary.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Six phases of work (001-005 shipped, 006-009 amended) need one authoritative proof that the skill is aligned with sk-create-skill standards and the packet is coherent. Leftover stale metadata (e.g. 002-001's continuity still says `completion_pct: 0`; the parent's `last_active_child_id` still points at 001-research) would poison any later resume.

### Purpose
Run every gate once from the final state, record the outputs, fix metadata drift, and prove the packet is resume-safe.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Skill gates: metadata fleet, package check, doc validation (SKILL.md, README, references, catalog root + 16 leaves, playbook root), DQI on SKILL.md, advisor smoke, runtime regression.
- Packet gates: `validate.sh --recursive --strict` on the parent.
- Metadata reconciliation: 002-001 continuity, parent `last_active_child_id`, per-phase `completion_pct`, `description.json`/`graph-metadata.json` refresh.
- Final-state sweep: stray files, `.venv`, temp artifacts, dist freshness.

### Out of Scope
- New feature work (any failure → report, do not silently fix by adding scope).
- Rewriting published child history.
- `context/` edits.
- Committing (operator's call).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/.../002-skill-scaffold/001-skill-md/implementation-summary.md` | Modify if stale | completion_pct 0 → 100 with evidence |
| `specs/.../graph-metadata.json` (parent) | Modify | `last_active_child_id` → current |
| `specs/.../description.json` / `graph-metadata.json` (new phases) | Regenerate | Via `generate-context.js` if available |

### Implementer copy pack (follow exactly)

Stop and report if any of these is true: a gate fails and the fix requires code or doc rewrites beyond metadata; you are about to commit; you are about to delete something not listed in the sweep rules; a gate cannot run in this environment (record the environment limitation, do not fake output).

**Gate sequence (record EVERY command's output + exit status in the implementation-summary verification table):**

```bash
# 1. Skill root metadata fleet
node .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs
# 2. Package validation
python3 .opencode/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py .opencode/skills/sk-vision
python3 .opencode/skills/sk-doc/sk-create-skill/scripts/package_skill.py .opencode/skills/sk-vision --check
# 3. Doc validation (every authored doc)
python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-vision/SKILL.md --type skill
python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-vision/README.md
python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-vision/references/runtime-reference.md
python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-vision/feature-catalog/feature-catalog.md
# ... and each of the 16 catalog leaves, and the playbook root:
python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-vision/manual-testing-playbook/manual-testing-playbook.md --type reference
# 4. Package validators
node .opencode/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.cjs
node .opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .opencode/skills/sk-vision/manual-testing-playbook
# 5. DQI on the contract doc
python3 .opencode/skills/sk-doc/shared/scripts/extract_structure.py .opencode/skills/sk-vision/SKILL.md
# 6. Runtime regression
cd .opencode/skills/sk-vision/vision-runtime && bun run build && bun test
# 7. Advisor smoke (record daemon state; skip note if cold)
node .opencode/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"screenshot OCR mockup error.png local vision"}' --warm-only --format json
# 8. Packet gate
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/sk-vision/001-sk-vision-fork-of-opencode-senses --recursive --strict
```

**Metadata reconciliation (only if stale):**
- `002-skill-scaffold/001-skill-md/implementation-summary.md` continuity: `completion_pct: 0` → `100` (its tasks are all `[x]`; add a dated evidence line).
- Parent `graph-metadata.json` `derived.last_active_child_id` → the most recently closed phase (010 at closeout).
- Refresh `description.json`/`graph-metadata.json` for new folders via `node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js` with the packet path (if the CLI is unavailable, keep the hand-authored files — validate.sh shape checks still pass; record the limitation).

**Final-state sweep:**
- `test ! -d .opencode/skills/sk-vision/vision-runtime/.venv` (006-002 already removed it)
- `find .opencode/skills/sk-vision -name "*.tmp" -o -name "*~" -o -name "*.bak"` → empty
- `git status --short` review: skill dir untracked is EXPECTED (not committed); no unexpected modified tracked files (e.g. `context/` must be untouched: `git diff --exit-code -- specs/sk-vision/001-sk-vision-fork-of-opencode-senses/context`)
- No hub JSON on the skill root: `ls .opencode/skills/sk-vision/{description.json,mode-registry.json,hub-router.json,command-metadata.json}` → absent

Close this child with:

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/sk-vision/001-sk-vision-fork-of-opencode-senses/010-quality-gate --strict
```
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All skill gates pass | exit 0 recorded for each gate in the sequence |
| REQ-002 | Packet recursive gate passes | parent `validate.sh --recursive --strict` exit 0 |
| REQ-003 | Metadata reconciled | 002-001 completion fixed; `last_active_child_id` current |
| REQ-004 | No stray files | sweep commands empty/expected |
| REQ-005 | `context/` untouched | `git diff --exit-code` on context exit 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-P1 | DQI recorded | SKILL.md score captured (no minimum — record baseline) |
| REQ-P2 | Advisor smoke attempted | recommendation output recorded or cold-daemon note |
| REQ-P3 | No scope creep | no code/doc changes beyond metadata reconciliation |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- [ ] Every gate command executed from the final state with output + exit status recorded in the implementation-summary
- [ ] Parent `validate.sh --recursive --strict` exit 0
- [ ] 002-001 continuity `completion_pct: 100`; parent `last_active_child_id` current
- [ ] Sweep clean: no `.venv`, no temp files, no hub JSON, `context/` diff empty
- [ ] This child `validate.sh --strict` exits 0
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Gate fails at the end of the amendment | High | Report with evidence; remediation is a bounded loop, not scope creep |
| Risk | Cold advisor daemon | Low | Record note; warm smoke deferred |
| Risk | generate-context.js unavailable | Low | Keep hand-authored metadata; record limitation |
| Dependency | 006-009 complete | Required | Stop if any gate target is missing |
<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

### Answered Questions
- **Q**: Is 010 allowed to fix failing docs? **A**: No — only metadata reconciliation; any other failure is reported.

### Open Questions
- None.
<!-- /ANCHOR:questions -->

