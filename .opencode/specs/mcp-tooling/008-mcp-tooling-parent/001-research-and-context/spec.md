---
title: "Feature Specification: Phase 1: research-and-context"
description: "Research-gate phase for the mcp-tooling parent-hub program. This phase scopes read-only verification of the current mcp-chrome-devtools, mcp-click-up, and mcp-figma state plus a fresh referrer inventory before architecture decisions begin."
trigger_phrases:
  - "mcp-tooling parent research"
  - "research gate"
  - "mcp bridge referrer inventory"
  - "mcp-figma transport fold-in"
  - "phase 001 research-and-context"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/008-mcp-tooling-parent/001-research-and-context"
    last_updated_at: "2026-07-09T22:30:00Z"
    last_updated_by: "claude"
    recent_action: "Authored planned research-gate spec docs"
    next_safe_action: "Execute the research gate when the packet is approved"
    blockers: []
    key_files:
      - ".opencode/specs/mcp-tooling/008-mcp-tooling-parent/001-research-and-context/spec.md"
      - ".opencode/specs/mcp-tooling/008-mcp-tooling-parent/001-research-and-context/plan.md"
      - ".opencode/specs/mcp-tooling/008-mcp-tooling-parent/001-research-and-context/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-001-research-and-context"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Does mcp-figma's transport packet need any lexical routing carve-out, or does hub-membership routing suffice? (empirical, owned by phase 007)"
    answered_questions:
      - "Planning-time skill-state snapshot captured: chrome-devtools 41 tracked files (v1.0.8.0), click-up 154 files (v1.0.0.0), figma 40 files (v1.0.0.0)"
      - "Planning-time referrer sweep: doctor_mcp_install.yaml carries the only functional skill_dir/install_guide path refs for the 3 bridges; doctor_mcp_debug.yaml and mcp-doctor.sh carry none"
      - ".utcp_config.json manuals are name-keyed (chrome_devtools_1/2, clickup_official, figma) so a skill-folder move does not touch them; the code_mode MCP registration key is unchanged"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: research-and-context

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
| **Status** | Planned |
| **Created** | 2026-07-09 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 8 |
| **Predecessor** | None |
| **Successor** | 002-architecture-decision |
| **Handoff Criteria** | Verified skill-state snapshot for all three bridges, a fresh referrer inventory, and the transport-eligibility evidence are ready for human review before phase 002 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Merge mcp-chrome-devtools mcp-click-up and mcp-figma into one parent hub mcp-tooling with three modes: two workflow bridges and one figma transport; mcp-code-mode stays flat standalone infrastructure specification.

**Scope Boundary**: Read-only research and inventory planning for phase 001. This phase may document findings inside this phase folder during execution, but it must not move, edit, or scaffold `.opencode/skills/mcp-chrome-devtools/`, `.opencode/skills/mcp-click-up/`, `.opencode/skills/mcp-figma/`, `.opencode/skills/mcp-code-mode/`, commands, advisor code, or any file outside this phase folder.

**Dependencies**:
- None. This is the first phase and has no predecessor beyond the approved parent packet context.

**Deliverables**:
- Verified skill-state snapshot for the three source bridges, including `SKILL.md`, `README.md`, `graph-metadata.json`, version numbers, tracked file counts, and `allowed-tools` postures.
- Transport-eligibility evidence: which bridges mutate the local workspace (fail transport check 3h) versus which write only to an external tool.
- Fresh referrer inventory from a new grep sweep covering every live file that references the three bridge skill ids or their skill-folder paths.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.

### Planning-Time Skill-State Snapshot (re-verify at execution)

**Three bridges, family `mcp`, category `mcp-tool`.** `mcp-chrome-devtools` has 41 tracked files, `version: 1.0.8.0`, `allowed-tools: [Bash, Edit, Glob, Grep, mcp__code_mode__call_tool_chain, Read, Write]`. `mcp-click-up` has 154 tracked files, `version: 1.0.0.0`, `allowed-tools: [Bash, Edit, Glob, Grep, mcp__code_mode__call_tool_chain, Read, Write]`. `mcp-figma` has 40 tracked files, `version: 1.0.0.0`, `allowed-tools: [Read, Bash, Grep, Glob, mcp__code_mode__call_tool_chain]`. `mcp-code-mode` is a fourth `family: mcp` skill that is EXCLUDED from this program and stays flat.

**Transport-eligibility evidence.** `mcp-chrome-devtools` and `mcp-click-up` both grant `Write` and `Edit` — chrome-devtools writes screenshots/HAR/console dumps into the local workspace, and click-up carries orchestration judgment (mandatory `cupt statuses` before marking a task done, `--dry-run` gating). Both therefore mutate the workspace and belong on the workflow axis. `mcp-figma` grants NO `Write`/`Edit`; its authored/exported artifacts land inside Figma Desktop over the local daemon, not in this repo, so it satisfies the transport contract's `mutatesWorkspace:false` requirement cleanly. `mcp-figma` also declares a hard `depends_on sk-design` edge (weight 0.7) — a mandatory design-judgment pairing — matching the transport-packet shape used by `sk-design`'s nested `design-mcp-open-design`.

### Planning-Time Referrer Inventory (re-verify at execution)

- **Functional path referrers (repoint on move):** `.opencode/commands/doctor/assets/doctor_mcp_install.yaml` holds `skill_dir` + `install_guide` path refs for `mcp-figma`, `mcp-chrome-devtools`, and `mcp-click-up`. The same file also carries a pre-existing STALE `mcp-open-design` entry (`skill_dir: .opencode/skills/mcp-open-design`) for a skill that no longer exists — a good-hygiene catch to fix in phase 006.
- **Verified clean:** `.opencode/commands/doctor/assets/doctor_mcp_debug.yaml` and `.opencode/commands/doctor/scripts/mcp-doctor.sh` contain NO `skill_dir` references to the three bridges (grep returns zero); their `mcp-code-mode` references stay as-is.
- **Name-keyed, safe (do not touch):** `.utcp_config.json` manuals are name-keyed (`chrome_devtools_1`, `chrome_devtools_2`, `clickup_official`, `figma`), not path-keyed, so a skill-folder move does not touch them. `opencode.json` / `.claude/mcp.json` register only `code_mode`, which is not moving. The `mcp__code_mode__*` tool ids derive from the unchanged `code_mode` registration key.
- **Advisor routing corpus:** `system-skill-advisor/.../routing-accuracy/labeled-prompts.jsonl` has 3 rows targeting `mcp-chrome-devtools`; 0 rows target `mcp-click-up` or `mcp-figma`. Those 3 rows retarget to `mcp-tooling` in phase 006 or the routing benchmark regresses.
- **Reverse graph edges (inbound, repoint on identity dissolution):** two OTHER skills' graph files hold edges pointing AT the three bridges, which dangle once phase 006 deletes the child identities: `mcp-code-mode/graph-metadata.json` (`prerequisite_for` -> all three bridges at 0.7, `manual.related_to` -> mcp-chrome-devtools) and `sk-design/graph-metadata.json` (`siblings` -> mcp-figma 0.45, `prerequisite_for` -> mcp-figma 0.7, `manual.related_to` -> mcp-figma). Repointed to `mcp-tooling` in phase 006 (ADR-004/ADR-005 carve-out).
- **Documentation catalogs:** `.opencode/skills/README.md` and the root `README.md` carry catalog rows / relative links for the three bridges; internal absolute self-paths inside each bridge tree (INSTALL_GUIDE, README, changelog, playbooks) reference their own current skill-folder path.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 002 architecture decisions depend on current, re-verified facts about three live bridge skills and their referrers. The parent packet records planning-time research, but concurrent repository activity can make those notes stale, especially around the `allowed-tools` postures that determine transport eligibility, the functional `doctor_mcp_install.yaml` path refs, and the advisor routing corpus rows.

### Purpose
Produce a trustworthy, read-only factual foundation for the mcp-tooling parent-hub decision phase before any skill-file moves or hub scaffolding begin.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Re-verify the current state of `.opencode/skills/mcp-chrome-devtools/`, `.opencode/skills/mcp-click-up/`, and `.opencode/skills/mcp-figma/` against the shared program context, including `allowed-tools` postures and version numbers.
- Re-run the referrer sweep for the three bridge skill ids and their skill-folder paths, including the `doctor_mcp_install.yaml` functional refs, the advisor routing corpus, and documentation catalogs.
- Record which bridges mutate the local workspace (workflow) versus write only to an external tool (transport), with `allowed-tools` evidence per bridge.

### Out of Scope
- File moves, hub scaffolding, router metadata creation, and path repoints - these start in later phases after the research gate is reviewed.
- Any change to `.opencode/skills/mcp-code-mode/` - it is excluded from this program and stays a flat standalone skill.
- Edits to the three bridge trees, commands, advisor code, or documentation outside this phase folder - phase 001 is a read-only research gate.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/mcp-tooling/008-mcp-tooling-parent/001-research-and-context/spec.md` | Modify | Define the phase 001 read-only research scope and acceptance criteria |
| `.opencode/specs/mcp-tooling/008-mcp-tooling-parent/001-research-and-context/plan.md` | Modify | Plan the skill-state pass, transport-eligibility pass, and referrer inventory pass |
| `.opencode/specs/mcp-tooling/008-mcp-tooling-parent/001-research-and-context/tasks.md` | Modify | Track the scoped research-gate tasks pending human review |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Re-verified skill-state snapshot for all three bridges | Snapshot covers each bridge's `SKILL.md`, `README.md`, `graph-metadata.json`, version number, tracked file count, and `allowed-tools`, explicitly marking any drift from the shared context |
| REQ-002 | Complete fresh referrer inventory with file:line evidence | Inventory is produced from a new grep sweep and includes the `doctor_mcp_install.yaml` functional refs (including the stale `mcp-open-design` entry), the advisor routing corpus rows, and documentation catalogs |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Transport-eligibility evidence per bridge | Each bridge is classified workflow or transport with `allowed-tools`/`mutatesWorkspace` evidence, and figma's mandatory `sk-design` pairing edge is confirmed |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Research artifacts are complete, internally consistent, and grounded in fresh reads/grep output rather than planning-time assumptions.
- **SC-002**: Zero files outside `.opencode/specs/mcp-tooling/008-mcp-tooling-parent/001-research-and-context/` are touched during this phase.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | None | This is the first phase and has no predecessor phase dependency | Proceed after human review of the scoped research plan |
| Risk | Concurrent-session repository activity causes drift from planning-time research | Medium | Re-read live files and re-run the referrer grep sweep instead of trusting prior notes |
| Risk | A functional path referrer is missed because it fails silently after a move | High | Require file:line evidence for the `doctor_mcp_install.yaml` refs before phase 002 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Resolved by phase 002's decision-record.md: packetKind topology (chrome-devtools and click-up as workflow, figma as transport), naming (keep the `mcp-` prefix), and the code-mode exclusion rationale.
- Does the hub's routing need any lexical carve-out for the figma transport, or does hub-membership metadata routing suffice? (empirical question, owned by phase 007's routing benchmark, not pre-decided)
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
