---
title: "Feature Specification: Phase 022 sk-create-agent README revisit (rewrite per refined template)"
description: "Rewrite or align the sk-create-agent mode skill README against the refined README template from phase 001 and the mcp-obsidian exemplar, sync the version field, add the changelog entry and validate every gate with evidence."
trigger_phrases:
  - "sk create agent readme revisit"
  - "create agent readme rewrite"
  - "sk-doc packet readme"
  - "agent mode readme"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/022-sk-create-agent"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 022 docs (spec, plan, tasks, checklist) inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute phase 022 work: verify and rewrite the sk-create-agent README per the refined template"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-agent/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/022-sk-create-agent"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Phase 022 sk-create-agent README revisit (rewrite per refined template)

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 (phase child) |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-08-04 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` (005-mode-child-readme-revisit) |
| **Parent Packet** | `sk-doc/026-skill-readme-refinement` |
| **Predecessor** | `021-sk-design-md-generator` |
| **Successor** | `023-sk-create-benchmark` |
| **Handoff Criteria** | The sk-create-agent README conforms on every gate: purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW, HVR clean, version field and changelog entry present, validator zero issues, links resolving and this phase folder validating with zero errors |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-create-agent README predates the pilot standard in the concrete ways this phase measures. Its version field reads 1.0.0.0 while the changelog head is v1.0.1.1, and no validator, HVR, link or conformance gate has ever recorded a verdict against the refined template from phase 001. The body already carries the purpose-first skeleton the rename refactor introduced, with a one-line pitch and a problem-first OVERVIEW, so the phase first verifies every gate and rewrites only what fails. The version field sync and the changelog entry land with the rewrite.

### Purpose
Run the rewrite-or-verify pass on `.opencode/skills/sk-doc/sk-create-agent/README.md` against the refined template from phase 001 and the mcp-obsidian exemplar. Confirm or restore the purpose-first shape, sync the version field to the changelog convention, add the matching changelog entry and validate the README with zero issues. The skill is the `sk-doc` mode packet behind `/create:agent`, which scaffolds or updates one runtime agent markdown file with runtime-correct frontmatter, explicit permissions and validation.

**End goal:** a sk-create-agent README that conforms to the refined template on every gate, with the version field and changelog entry aligned and the gate evidence recorded in this phase folder.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read the current README and record the baseline: the version field value, the `validate_document.py --type readme` output and the link state.
- Verify the README against the refined template gate by gate: one-line pitch, problem-first OVERVIEW, section model, HVR, version field and changelog entry.
- Rewrite the README purpose-first per the refined template on any failing gate, bump the version field and add the changelog entry.
- Validate the README and this phase folder.

### Out of Scope
- SKILL.md content and any other file inside the sk-create-agent packet.
- Other skills' READMEs (owned by their sibling phases in 005-mode-child-readme-revisit).
- The refined template and the standalone fleet (owned by phases 001 and 004).
- Vault files, plugin data and any runtime configuration.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/sk-create-agent/README.md` | Rewrite, verify-only when every gate passes | Purpose-first narrative on the refined template with a one-line pitch and a problem-first OVERVIEW |
| `.opencode/skills/sk-doc/sk-create-agent/changelog/<version>.md` | Add on rewrite | Per-release changelog entry matching the bumped version field |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/022-sk-create-agent/spec.md` | Create | Phase specification (this file) |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/022-sk-create-agent/plan.md` | Create | Phase implementation plan |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/022-sk-create-agent/tasks.md` | Create | Phase task list |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/022-sk-create-agent/checklist.md` | Create | Phase verification checklist |

Read-only references: the refined template at `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`, the mcp-obsidian exemplar README, the sk-create-agent `SKILL.md`, the changelog folder and the parent spec are evidence for the conformance check, never writable in this phase.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Template readiness gate | The refined template exists at `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`, is read before the conformance check and its section model and required-section rule are recorded |
| REQ-002 | Baseline inventory | The current README is read and the baseline is recorded: the version field value, the `validate_document.py --type readme` output and the link state |
| REQ-003 | Purpose-first conformance | The README is verified against the refined template gate by gate and every failing gate is fixed by a purpose-first rewrite with a one-line pitch and a problem-first OVERVIEW. The final README conforms on every gate |
| REQ-004 | Human Voice Rules clean | The HVR grep returns zero em dashes, zero semicolons and zero Oxford commas in the README body |
| REQ-005 | Version and changelog | A rewrite bumps the version field in the README frontmatter and a matching entry exists at `changelog/<version>.md` |
| REQ-006 | Validator zero issues | `python3 .opencode/skills/sk-doc/scripts/validate_document.py <readme> --type readme` reports zero issues on the README and every linked path resolves |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Facts preserved | When a rewrite happens, a section-by-section diff against the prior README shows every fact preserved |
| REQ-008 | Out-of-scope guard | No SKILL.md, other skill README, template or vault file is modified |
| REQ-009 | Phase closeout | `validate.sh` on this phase folder reports zero errors and the phase metadata is regenerated |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every gate carries a recorded verdict with evidence: validator, HVR grep, link guard, version field and changelog entry.
- **SC-002**: The README conforms to the refined template on every gate, purpose-first with a one-line pitch and a problem-first OVERVIEW.
- **SC-003**: The version field and the changelog entry are aligned with the rewrite.
- **SC-004**: No SKILL.md content and no other packet file changes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Refined template from phase 001 | Conformance measured against a moving standard | Gate the check on the phase 001 output and read the template first (REQ-001) |
| Dependency | mcp-obsidian exemplar README | Style drift from the family standard | Read the exemplar and match its section order and voice |
| Dependency | Phases 001 and 004 complete | Standard and fleet not settled | Parent spec gates child phases on both |
| Risk | The README fails a gate after the skeleton check | Verify-only turns into a rewrite | The conditional rewrite path is scoped in REQ-003 and REQ-007 |
| Risk | Version field drifts from the changelog head | Version and changelog gates disagree | Record the baseline version and the changelog head and pick the bump target on evidence |
| Risk | Link rot inside the README | Link guard fails | Run the link guard and fix or record each dead link |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does the README version field need to track the changelog head? The field reads 1.0.0.0 while the changelog head is v1.0.1.1. The verification evidence decides.
<!-- /ANCHOR:questions -->
