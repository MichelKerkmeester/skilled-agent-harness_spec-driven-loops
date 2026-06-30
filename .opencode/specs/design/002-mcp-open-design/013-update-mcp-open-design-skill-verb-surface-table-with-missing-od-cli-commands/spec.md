---
title: "Feature Specification: Update mcp-open-design od CLI verb surface table with missing commands"
description: "The verb surface table in od_cli_reference.md omits several od CLI commands discoverable from live usage: project create, files list/read, skills list, design-systems list, daemon start, doctor, and status. This gap means agents and operators are unaware of these commands or their read-only vs mutating classification. Update the table, verify classification, and update the gating policy in tool_surface.md where needed."
trigger_phrases:
  - "od verb surface"
  - "mcp-open-design missing commands"
  - "od project create cli"
  - "od files list cli"
  - "update od cli reference"
importance_tier: "normal"
contextType: "feature"
_memory:
  continuity:
    packet_pointer: "design/002-mcp-open-design/013-update-mcp-open-design-skill-verb-surface-table-with-missing-od-cli-commands"
    last_updated_at: "2026-06-21T13:29:38Z"
    last_updated_by: "deepseek-v4-pro"
    recent_action: "Implemented verb table + gating updates, verified against live --help"
    next_safe_action: "Packet complete"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-open-design/references/od_cli_reference.md"
      - ".opencode/skills/mcp-open-design/references/tool_surface.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "013-od-verb-surface-update"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Update mcp-open-design od CLI verb surface table with missing commands

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
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-06-21 |
| **Branch** | `013-od-verb-surface-update` (child of 145-mcp-open-design) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `od_cli_reference.md` verb surface table (Section 4) used by the `mcp-open-design` skill is incomplete. Live `od` CLI usage reveals several commands that are absent from the formal classification: `od project create`, `od files list`/`read`, `od skills list`, `od design-systems list`, `od daemon start`, `od doctor`, and `od status --json`. Agents and operators relying on the skill's documentation are unaware of these commands or their read-only vs mutating classification. Additionally, `od doctor` is flagged as `[UNVERIFIED]` in the current table despite being confirmed working from live usage.

### Purpose
Add the missing CLI commands to the verb surface table, classify each as read-only or mutating, promote `[UNVERIFIED]` entries to confirmed, and update the gating policy in `tool_surface.md` for any newly classified mutating verbs.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add 7 missing/under-documented `od` CLI commands to the verb surface table in `references/od_cli_reference.md` Section 4
- Classify each new entry as read-only, mutating, or mixed
- Promote `od doctor` from `[UNVERIFIED]` to confirmed read-only
- Document the inline form-answer pattern for `od run start` (follow-up `--message` containing discovery form answers)
- Update `references/tool_surface.md` gating classification for any newly classified mutating verbs

### Out of Scope
- Creating new MCP tools or modifying the MCP registry
- Adding new references or feature catalog entries beyond what the verb table update requires
- Updating the SKILL.md smart router pseudocode
- Source-build documentation (corepack/pnpm setup) — debatable scope, excluded for now
- Deep-research on uncertain items in Section 7 of od_cli_reference.md

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-open-design/references/od_cli_reference.md` | Modify | Add missing commands to verb table (Section 4), promote UNVERIFIED entries, add inline form-answer note to Section 5 |
| `.opencode/skills/mcp-open-design/references/tool_surface.md` | Modify (possibly) | Update gating classification if any new mutating verbs need surface/gate/omit policy entries |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Add `od project create` to verb surface table | New row in Section 4 table with purpose, class (mutating), `--skill`/`--design-system` flags documented, JSON output structure noted |
| REQ-002 | Add `od files list` and `od files read` to verb surface table | New row(s) classified read-only, with `--json` and `--project` flags |
| REQ-003 | Add `od skills list` and `od design-systems list` to verb surface table | New rows classified read-only; distinguish from existing MCP `list_skills` and `od tools design-systems read` |
| REQ-004 | Add `od daemon start` subcommand to verb surface table | New row classified mutating, with `--headless`/`--serve-web`/`--port` flags documented |
| REQ-005 | Promote `od doctor` from `[UNVERIFIED]` to confirmed read-only; add `od status --json` | `od doctor` reclassified, `od status` added as new read-only row |
| REQ-006 | Document inline form-answer pattern in `od run start` flow | Updated Section 5 prose to note that discovery form answers can be submitted as a follow-up `--message` on the same conversation |
| REQ-007 | Update tool_surface.md gating policy for any new mutating verbs | If `od daemon start` or `od project create` are newly classified, add to surface/gate/omit where appropriate |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 7 missing CLI commands appear in the `od_cli_reference.md` verb table with correct classification
- **SC-002**: No `[UNVERIFIED]` entries remain for confirmed commands (`od doctor`)
- **SC-003**: `od status --json` is present and classified
- **SC-004**: The inline form-answer pattern is documented in Section 5 of `od_cli_reference.md`
- **SC-005**: `tool_surface.md` gating policy is consistent with the updated verb classification
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Open Design desktop app must be installed to verify `od` commands live | Low — can confirm from `--help` output and prior verified usage | Run `node "$OD_BIN" <verb> --help` for each new entry before final classification |
| Risk | Verb classification drift on future Open Design releases | Low — this is a docs update; upstream changes would need a separate update | Tag entries with `[CONFIRMED]` and the verification method |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. All missing commands were identified from live `od` usage examples and match the skill's existing classification taxonomy.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
