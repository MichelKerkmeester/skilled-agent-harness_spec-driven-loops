---
title: "Feature Specification: Phase 013 mcp-obsidian README revisit (verify-only exemplar)"
description: "Verify that the mcp-obsidian mode skill README still conforms to the refined README template from phase 001 and record the verification evidence. Rewrite purpose-first with a version bump and changelog entry only when conformance fails."
trigger_phrases:
  - "mcp obsidian readme verify"
  - "obsidian readme revisit"
  - "exemplar readme verification"
  - "mcp obsidian readme"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/013-mcp-obsidian"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 013 docs (spec, plan, tasks, checklist) inside 005-mode-child-readme-revisit"
    next_safe_action: "Verify exemplar README conformance per tasks.md"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/mcp-obsidian/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/013-mcp-obsidian"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Phase 013 mcp-obsidian README revisit (verify-only exemplar)

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
| **Predecessor** | `012-mcp-mobbin` |
| **Successor** | `014-mcp-refero` |
| **Handoff Criteria** | The conformance verdict for the mcp-obsidian README is recorded with evidence, the HVR grep is clean, the version field and changelog entry are present, the validator reports zero issues and this phase folder validates with zero errors |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The mcp-obsidian README is the pilot that set the purpose-first standard for mode skill READMEs. It makes AI use inside Obsidian effective: notes, daily notes, tags and plugin data, all operable by an agent. Phase 001 refined the shared README template after that pilot, adding Human Voice Rules enforcement, versioning conventions and a stricter validation checklist. The exemplar therefore predates the refined template it inspired. Its conformance to the refined standard is unverified until this phase runs the validator, the HVR grep and the link guard and records the result.

### Purpose
Run a verify-only pass on `.opencode/skills/mcp-tooling/mcp-obsidian/README.md` against the refined template from phase 001 and record the conformance verdict with evidence. When every gate passes, the README stays byte-for-byte unchanged. When a gate fails, the phase rewrites the README purpose-first per the refined template, bumps the version field, adds the changelog entry and revalidates.

**End goal:** a recorded conformance verdict for the exemplar README that keeps parent packet success criterion SC-003 true, or a validated rewrite when conformance failed.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read the current README and record the baseline: the version field, the validator output and the link state.
- Verify the README against the refined template: one-line pitch, problem-first OVERVIEW, section model, HVR, version field and changelog entry.
- On conformance failure only: rewrite the README purpose-first per the refined template, bump the version field and add the changelog entry.
- Validate the README and this phase folder.

### Out of Scope
- SKILL.md content and any other file inside the mcp-obsidian skill folder.
- Other skills' READMEs (owned by their sibling phases in 005-mode-child-readme-revisit).
- The refined template and the standalone fleet (owned by phases 001 and 004).
- Vault files, plugin data and any runtime configuration.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-tooling/mcp-obsidian/README.md` | Verify, rewrite only on conformance failure | Purpose-first narrative on the refined template with a one-line pitch and a problem-first OVERVIEW |
| `.opencode/skills/mcp-tooling/mcp-obsidian/changelog/<version>.md` | Verify presence, add only on conformance failure | Per-release changelog entry matching the bumped version field |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/013-mcp-obsidian/spec.md` | Create | Phase specification (this file) |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/013-mcp-obsidian/plan.md` | Create | Phase implementation plan |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/013-mcp-obsidian/tasks.md` | Create | Phase task list |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/013-mcp-obsidian/checklist.md` | Create | Phase verification checklist |

Read-only references: the refined template, the mcp-obsidian `SKILL.md`, the changelog folder and the parent spec are evidence for the conformance check, never writable in this phase.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Template readiness gate | The refined template exists at `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`, is read before the conformance check and its section model and required-section rule are recorded |
| REQ-002 | Baseline inventory | The current README is read and the baseline is recorded: the version field value, the `validate_document.py --type readme` output and the link state |
| REQ-003 | Verify-only conformance | The mcp-obsidian README is confirmed to still conform to the refined template and the verification evidence is recorded. No rewrite and no version bump unless conformance fails. When conformance fails, the rewrite is purpose-first with a one-line pitch and a problem-first OVERVIEW |
| REQ-004 | Human Voice Rules clean | The HVR grep returns zero em dashes, zero semicolons and zero Oxford commas in the README body |
| REQ-005 | Version and changelog | The README frontmatter carries a version field and a matching entry exists at `changelog/<version>.md`. A rewrite bumps the version field and adds the entry |
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
- **SC-002**: A conformant README stays byte-for-byte unchanged.
- **SC-003**: A non-conformant README is rewritten purpose-first, versioned, changelogged and revalidated with zero issues before closeout.
- **SC-004**: The parent packet success criterion SC-003 holds: the exemplar README stays verify-only.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Refined template from phase 001 | Conformance measured against a moving standard | Gate the check on the phase 001 output and read the template first (REQ-001) |
| Dependency | Phases 001 and 004 complete | Standard and fleet not settled | Parent spec gates child phases on both |
| Risk | The exemplar README fails a gate | Verify-only turns into a rewrite | The conditional rewrite path is scoped in REQ-003 and REQ-007 |
| Risk | Version field drifts from the changelog head | Version and changelog gates disagree | Record the baseline version and the latest changelog entry and pick the bump target on evidence |
| Risk | Link rot inside the README | Link guard fails | Run the link guard and fix or record each dead link |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- RESOLVED during phase execution. The baseline field read `1.2.0.0` while the changelog head read `v1.5.0.0`. The rewrite path bumped the field to `1.6.0.0` and added `changelog/v1.6.0.0.md`, so the field and the changelog top agree and released entries stay untouched.
<!-- /ANCHOR:questions -->
