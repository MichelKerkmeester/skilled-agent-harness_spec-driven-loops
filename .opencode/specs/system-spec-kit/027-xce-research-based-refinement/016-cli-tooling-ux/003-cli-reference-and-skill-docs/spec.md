---
title: "Feature Specification: Unified Daemon CLI Reference and Skill Docs [template:level_1/spec.md]"
description: "Author one unified Daemon CLI Reference page, add recovery commands and exit-code taxonomy to each system SKILL.md (or link the unified page), and document that jsonl is a single-line JSON payload, not streaming."
trigger_phrases:
  - "unified daemon cli reference"
  - "cli exit code taxonomy docs"
  - "skill md recovery commands"
  - "jsonl single-line payload docs"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/016-cli-tooling-ux/003-cli-reference-and-skill-docs"
    last_updated_at: "2026-06-11T01:21:47Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Implemented the unified daemon CLI reference, per-SKILL.md links, and jsonl clarification"
    next_safe_action: "Use the canonical daemon CLI reference for future CLI fallback documentation"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-016-003-cli-reference-and-skill-docs"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Unified Daemon CLI Reference and Skill Docs

<!-- SPECKIT_LEVEL: 1 -->
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
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Completed |
| **Created** | 2026-06-10 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-spec-kit/027-xce-research-based-refinement/016-cli-tooling-ux |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The daemon CLI documentation is accurate but scattered. Invocations, formats, exit codes, warm-only behavior, examples, and safety are spread across `README.md:100-110`, `AGENTS.md:133-143`, `ENV_REFERENCE.md:538-559`, the feature catalog, the playbooks, and the system READMEs, with no single canonical page. Recovery guidance is uneven across the three skills: system-spec-kit already documents it in `SKILL.md:413`, but code-index CLI docs live mostly in `system-code-graph/README.md:81-88` and advisor docs in `system-skill-advisor/README.md:73-79`, so an agent that opens SKILL.md first has to hunt through feature catalogs. The `jsonl` format is parsed as a single-line JSON payload in all three CLIs (`spec-memory-cli.ts:282-285`, `code-index-cli.ts:310-313`, `skill-advisor-cli.ts:295-298`) but is not documented as such, inviting automation to assume it is streaming.

### Purpose
Consolidate the daemon CLI documentation into one canonical reference, put the exact recovery commands and exit-code taxonomy in each system SKILL.md (or link the unified page from there), and document that `jsonl` is a single-line JSON payload rather than streaming, so agents and automation read accurate, co-located guidance.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- One unified Daemon CLI Reference page covering invocations, formats, exit-code taxonomy, warm-only behavior, examples, and safety.
- Recovery commands + exit-code taxonomy added to each system SKILL.md, or a link to the unified reference from each SKILL.md.
- Documentation that `jsonl` is a single-line JSON payload, not streaming.

### Out of Scope
- CLI source/behavior changes (this is a documentation phase).
- The freshness/smoke, help/alias, envelope, and completion work owned by sibling sub-phases 001, 002, 004, 005.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/references/cli/daemon_cli_reference.md` | Create | Invocations, formats, exit codes, warm-only, examples, safety |
| `system-code-graph/SKILL.md` | Modify | Add recovery commands + exit-code taxonomy or link the unified page |
| `system-skill-advisor/SKILL.md` | Modify | Add recovery commands + exit-code taxonomy or link the unified page |
| `system-spec-kit/SKILL.md` (`:413`) | Modify | Cross-link the unified reference (already has recovery content) |
| Unified reference + per-SKILL.md `jsonl` note | Modify | Document `jsonl` as single-line JSON payload (`*-cli.ts:282-298` behavior) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | One unified Daemon CLI Reference page exists covering invocations, formats, exit-code taxonomy, warm-only, examples, and safety | Page exists; each of the six topics is present and matches the code-level exit taxonomy (`0/1/64/69/75`) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Each system SKILL.md carries recovery commands + exit-code taxonomy or links the unified reference | code-index and skill-advisor SKILL.md each contain or link the recovery/exit-code content |
| REQ-003 | `jsonl` is documented as a single-line JSON payload, not streaming | The unified reference (and SKILL.md notes) state `jsonl` is single-line JSON, matching `*-cli.ts:282-298` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A single canonical reference replaces the scattered CLI docs as the source of truth.
- **SC-002**: Each system SKILL.md surfaces recovery + exit-code guidance directly or by link.
- **SC-003**: The `jsonl` single-line-payload semantics are documented and matched to code.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Doc drift between the unified page and the existing scattered docs | Med | Make the unified page canonical; replace scattered detail with links |
| Risk | Exit-code taxonomy in docs diverges from code | Low | Cite the code-level taxonomy (`0/1/64/69/75`) and the smoke check from sub-phase 001 |
| Dependency | Exit-code taxonomy + warm-only behavior | Internal | Source from `ENV_REFERENCE.md:538-559` and `SKILL.md:413` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Answered: The unified reference lives under `system-spec-kit/references/cli/daemon_cli_reference.md`, a shared location allowed by this phase.
- Answered: Each SKILL.md carries a concise recovery/taxonomy/jsonl note and links to the unified reference for full details.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
