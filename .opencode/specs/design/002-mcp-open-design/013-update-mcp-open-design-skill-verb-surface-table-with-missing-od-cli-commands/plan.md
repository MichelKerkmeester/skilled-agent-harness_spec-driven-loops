---
title: "Implementation Plan: Update mcp-open-design od CLI verb surface table with missing commands"
description: "Add 7 missing od CLI commands to the mcp-open-design skill's verb surface table in od_cli_reference.md, reclassify [UNVERIFIED] entries, and update the gating policy in tool_surface.md where mutating verbs are newly introduced."
trigger_phrases:
  - "od verb surface plan"
  - "mcp-open-design documentation update"
  - "od cli reference missing commands"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/002-mcp-open-design/013-update-mcp-open-design-skill-verb-surface-table-with-missing-od-cli-commands"
    last_updated_at: "2026-06-21T13:29:38Z"
    last_updated_by: "deepseek-v4-pro"
    recent_action: "Created spec.md with 7 requirements"
    next_safe_action: "Proceed to implementation"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-open-design/references/od_cli_reference.md"
      - ".opencode/skills/mcp-open-design/references/tool_surface.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "013-od-verb-surface-update"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Update mcp-open-design od CLI verb surface table with missing commands

<!-- SPECKIT_LEVEL: 1 -->
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
| **Language/Stack** | Markdown documentation (no code) |
| **Framework** | mcp-open-design skill (CLI reference + tool surface docs) |
| **Storage** | Git-tracked markdown files under `.opencode/skills/mcp-open-design/references/` |
| **Testing** | Manual verification: `node "$OD_BIN" <verb> --help` for each new entry, `grep` for classification consistency |

### Overview
This is a documentation-only update to the `mcp-open-design` skill. Two files under `references/` are modified: the verb surface table in `od_cli_reference.md` (Section 4, adding 7 missing `od` CLI commands) and the gating policy in `tool_surface.md` (adding newly classified mutating verbs to the surface/gate/omit policy). No code changes, no MCP registry modifications, no new files. Estimated <50 lines of markdown changes total.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md complete)
- [x] Success criteria measurable (7 entries, 0 UNVERIFIED, status added)
- [x] Dependencies identified (Open Design app for --help verification)

### Definition of Done
- [ ] All 7 missing commands added to verb surface table
- [ ] `od doctor` promoted from `[UNVERIFIED]` to confirmed
- [ ] `od status --json` added as new read-only entry
- [ ] Inline form-answer pattern documented in Section 5
- [ ] `tool_surface.md` gating policy updated for new mutating verbs
- [ ] Classification verified via `--help` output for each new entry
- [ ] No `[UNVERIFIED]` tags remain on confirmed commands
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation update — no architectural change. The `mcp-open-design` skill's existing verb surface taxonomy (read-only / mutating / destructive) is applied to the newly discovered commands.

### Key Components
- **`references/od_cli_reference.md` Section 4 (verb surface table)**: Primary edit target. New rows added for `project create`, `files list`/`read`, `skills list`, `design-systems list`, `daemon start`, `doctor` (reclassify), `status`.
- **`references/od_cli_reference.md` Section 5 (driving work without chat UI)**: Add note about inline form-answer pattern for `od run start`.
- **`references/tool_surface.md` Section 3 (surface/gate/omit policy)**: Add new mutating CLI verbs (`daemon start`, `project create`) to the "Surface but GATE" list.

### Data Flow
1. Agent or operator reads `od_cli_reference.md` to discover available `od` commands
2. `tool_surface.md` gates determine which verbs require confirmation
3. Updated from knowledge: live `od` usage + `--help` output → written to markdown tables
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable — this is an `add_feature` intent, not `fix_bug` or remediation.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Add missing commands to verb surface table
- [ ] T001 Add `od project create` row to Section 4 table (mutating, flags: `--name`, `--skill`, `--design-system`, `--json`)
- [ ] T002 Add `od files list` and `od files read` rows to Section 4 table (read-only, flags: `--project`, `--json`)
- [ ] T003 Add `od skills list` and `od design-systems list` rows (read-only, flags: `--json`)
- [ ] T004 Add `od daemon start` row (mutating, flags: `--headless`, `--serve-web`, `--port`)
- [ ] T005 Promote `od doctor` from `[UNVERIFIED]` to confirmed read-only; add `od status --json` as new read-only row

### Phase 2: Document inline form-answer pattern
- [ ] T006 Add prose to Section 5 documenting that discovery form answers can be submitted as a follow-up `--message` on the same `--conversation` in `od run start`

### Phase 3: Update gating policy
- [ ] T007 Add `od daemon start` and `od project create` to the "Surface but GATE" list in `tool_surface.md` Section 3
- [ ] T008 Add `od skills list`, `od design-systems list`, `od files list`, `od files read`, `od status`, and `od doctor` to the "Surface freely" read-only list in `tool_surface.md`

### Phase 4: Verification
- [ ] T009 Verify each new entry by running `node "$OD_BIN" <verb> --help` and confirming flags match documentation
- [ ] T010 Grep for any remaining `[UNVERIFIED]` tags on confirmed commands
- [ ] T011 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual CLI | Run `node "$OD_BIN" <verb> --help` for each new entry to confirm `--help` output matches documented flags | Bash, `od` CLI |
| Manual grep | Search for remaining `[UNVERIFIED]` tags on confirmed commands in `od_cli_reference.md` | Grep |
| Validation | Run validate.sh --strict on the spec folder | system-spec-kit validate.sh |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Open Design desktop app installed | External | Green | Cannot verify `--help` output for new entries; classification must rely on prior confirmed usage |
| system-spec-kit validate.sh | Internal | Green | Spec folder validation available |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: If new verb classifications are proven incorrect (e.g., a command claimed read-only actually mutates)
- **Procedure**: Revert the relevant row(s) in `od_cli_reference.md` and `tool_surface.md` via `git checkout` of the pre-edit versions. Both files are under version control.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
