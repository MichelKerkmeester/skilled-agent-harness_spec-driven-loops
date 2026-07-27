---
title: "Feature Specification: Devin agents/skills/rules parity"
description: "Document Devin's already-working, undocumented devin skills list/devin rules list discovery, and build the first real .devin/agents/*/AGENT.md subagent profile -- documented as supported in cli-devin/SKILL.md but never built."
trigger_phrases:
  - "devin agents skills rules parity"
  - "devin agent profile"
  - "devin AGENT.md"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/015-devin-agents-skills-rules-parity"
    last_updated_at: "2026-07-27T11:15:00Z"
    last_updated_by: "claude"
    recent_action: "Implemented (GPT-5.6-LUNA); live probes completed by Claude."
    next_safe_action: "None; phase complete."
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", ".devin/agents/<name>/AGENT.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "devin-agents-skills-rules-parity"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "devin skills list already discovers all 13 top-level .opencode/skills/ packets despite devin skills paths only documenting .devin/skills//.agents/skills/ (neither of which exists) -- Devin scans more broadly than its own help text states."
      - "devin rules list already surfaces CLAUDE.md/AGENTS.md from repo root -- no build work needed for rules discovery, only documentation of the existing behavior."
      - "A dedicated command-file system is not a concept Devin CLI supports -- confirmed via live --help; this is an architectural non-concept for Devin, not a gap to fill."
      - "The AGENT.md format is confirmed live at docs.devin.ai/cli/subagents; a real code-reviewer profile was built, resolves, and dispatches successfully."
      - "Devin's docs claim .claude/agents/*.md is auto-imported, but a live probe on the installed 3000.2.17 build proves this false -- a native AGENT.md is required."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Devin agents/skills/rules parity

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `../014-hook-adapter-shared-boilerplate-and-claude-codex-fix/spec.md` (sequential); `../008-devin-hook-parity/spec.md` (dependency — established live-CLI-probe-before-build discipline this phase follows) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The user asked to "scaffold a phase that makes sure cli-cursor and cli-devin have all the agents, commands and skills properly working and supported, like .claude and .opencode have." Live investigation during the 5-iteration deep-research pass found a mixed picture for Devin specifically:

- `devin skills list` already discovers all 13 top-level `.opencode/skills/` packets — working today, despite `devin skills paths` only documenting `.devin/skills/`/`.agents/skills/` (neither directory exists on disk). Devin scans more broadly than its own help text states.
- `devin rules list` already surfaces `CLAUDE.md`/`AGENTS.md` from the repo root — working today, no build gap.
- `.devin/agents/[name]/AGENT.md` is documented in `cli-external-orchestration/cli-devin/SKILL.md` as a real, supported Devin subagent-profile mechanism (matched via `run_subagent`), but the directory does not exist on disk anywhere in the repo — a genuine, scoped build gap.
- A dedicated command-file system (like Claude's `.claude/commands/`) is not a concept Devin CLI supports at all — confirmed live via `--help`; there is nothing to build here, only a decision to record.

### Purpose
Document the two already-working discovery mechanisms (skills, rules) so future work does not re-investigate settled ground, and build the first real `.devin/agents/<name>/AGENT.md` profile to close the one genuine gap, verified against Devin's live-confirmed format (not assumed from another runtime's shape).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Document `devin skills list` and `devin rules list` current working behavior in `cli-external-orchestration/cli-devin/SKILL.md` (or its manual-testing-playbook), citing live command output as evidence.
- Fetch the live-confirmed `.devin/agents/[name]/AGENT.md` format from current Devin CLI docs before building anything — do not assume the Claude/Codex agent-profile shape.
- Build one real `.devin/agents/<name>/AGENT.md` profile as a proof-of-build (candidate: a `code` or `sk-code`-equivalent profile mirroring an existing Claude/OpenCode agent this repo already has).
- Record the "commands doesn't apply as a distinct category for Devin" decision explicitly, so it is not re-investigated as an open gap later.

### Out of Scope
- Building every possible Devin agent profile — one real, working profile is the proof-of-build; broader profile coverage is a follow-up if the user wants it.
- Modifying `devin rules list` or `devin skills list` behavior — both already work; this phase only documents them.
- Any Cursor-side work — tracked separately in `030-cli-cursor-creation/014-cursor-agents-skills-rules-parity/`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.devin/agents/<name>/AGENT.md` | Create | First real Devin subagent profile, format live-verified before writing. |
| `cli-external-orchestration/cli-devin/SKILL.md` | Modify | Document `devin skills list`/`devin rules list` working behavior; record the commands non-applicability decision. |
| `cli-external-orchestration/cli-devin/manual-testing-playbook.md` (or equivalent) | Modify | Add scenario(s) covering the new agent profile and the documented discovery behaviors, if the playbook file exists under this or a similarly-named path. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The `.devin/agents/[name]/AGENT.md` format is fetched from live Devin CLI docs before any file is written. | A citation (URL or `--help` output) documents the confirmed format in `implementation-summary.md` before the file is created. |
| REQ-002 | One real `.devin/agents/<name>/AGENT.md` profile exists and is matched via `run_subagent` in a live `devin -p` probe. | A live probe dispatches `run_subagent` targeting the new profile and it resolves (not a "profile not found" error). |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | `devin skills list` and `devin rules list` working behavior is documented with live command output as evidence. | `cli-devin/SKILL.md` (or its playbook) cites the actual command output, not a paraphrase. |
| REQ-004 | The "commands doesn't apply" decision is recorded explicitly, not left implicit. | A decision-record entry or `SKILL.md` note states Devin has no command-file-system concept, confirmed via live `--help`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A live probe confirms `run_subagent` resolves the new `.devin/agents/<name>/AGENT.md` profile.
- **SC-002**: `cli-devin/SKILL.md` documents the two working discovery mechanisms with cited live output.
- **SC-003**: The commands non-applicability decision is recorded, not left as an implicit gap.
- **SC-004**: Phase 015 strict validation passes with 0 errors and 0 warnings.
- **SC-005**: Recursive parent strict validation (029-cli-devin-revival) passes with 0 errors and 0 warnings.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Assuming the AGENT.md format from another runtime's shape produces a file Devin cannot actually parse | Medium — silent failure would look like a build but not function | REQ-001 mandates a live-docs fetch before writing; REQ-002 mandates a live-probe verification after. |
| Dependency | Phase 008 (devin-hook-parity) | Established the live-probe-before-build discipline (the original "hooks are dormant" finding was corrected by exactly this discipline) | Complete. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: The new agent profile does not alter any existing hook, skill, or rule behavior — it is a pure addition.

### Documentation
- **NFR-D01**: Every documentation claim in this phase cites live command output, not an assumption carried over from another runtime.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- If the live-docs fetch reveals `.devin/agents/` is not actually a supported mechanism (contradicting `cli-devin/SKILL.md`'s current documentation), this phase halts and escalates per the Logic-Sync Protocol rather than building a non-functional file.

### State Transitions
- N/A — this phase adds a static profile file and documentation; no runtime state transitions are involved.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | 1 new profile file + 1-2 doc updates. |
| Risk | 10/25 | Live-format verification is mandatory before writing; a wrong assumption would silently fail. |
| Research | 8/20 | Requires a fresh live-docs fetch for the AGENT.md format, not yet confirmed in this session. |
| **Total** | **26/70** | **Level 2 — small build gated on a live-docs verification step.** |
<!-- /ANCHOR:complexity -->

---

## 7. OPEN QUESTIONS

- What is the live-confirmed `AGENT.md` front-matter/body format Devin's `run_subagent` actually expects? Must be resolved via a live-docs fetch before REQ-001/REQ-002 can be satisfied — this is the phase's own first task, not a pre-existing blocker.
<!-- /ANCHOR:questions -->

---

## Related Documents
- `plan.md`, `tasks.md`, `checklist.md`
- `../008-devin-hook-parity/spec.md` (predecessor — live-probe-before-build discipline)
- `cli-external-orchestration/cli-devin/SKILL.md` (documents the `.devin/agents/[name]/AGENT.md` mechanism this phase builds against)
- `../../030-cli-cursor-creation/014-cursor-agents-skills-rules-parity/spec.md` (sibling phase — Cursor-side parity investigation)
