---
title: "Goal: Phase 1: mcp-install-code-mode"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/048-doctor-command-audit/001-mcp-install-code-mode"
    last_updated_at: "2026-10-02T16:10:11Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fd6197bf-4447-484a-82b8-d9015d93169d"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 1: mcp-install-code-mode

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Leave `/doctor:mcp install` covering only MCP Code Mode and its `.utcp_config.json`, matched to the current system on evidence from this checkout.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The verdict rests on what this checkout does, shown by command output or file:line, never on what a doc says. |
| D2 | A defect found in the subsystem the doctor inspects is recorded as a finding, not fixed in this phase. |
| D3 | Retiring a target removes its route and its workflow asset and changes nothing else. |
| D4 | The command covers only MCP Code Mode and its `.utcp_config.json`. Setup and debugging for any other MCP server is removed, not kept beside it. |
<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `scratch/reality-check.md` marks every path, script, command, flag and environment variable named by `doctor-mcp-install.yaml` as present, moved or missing
- [ ] `scratch/doctor-run.log` holds the output of one read-only or dry-run run of `/doctor:mcp install` on this checkout
- [ ] `implementation-summary.md` states one verdict, keep, fix or retire, and the evidence behind it
- [ ] `doctor-mcp-install.yaml` sets up only MCP Code Mode and `.utcp_config.json`, and `scratch/reality-check.md` lists every other server it named before
- [ ] `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0 after the verdict is applied
- [ ] `acceptance-criteria.md` shows every row as Met, Waived or Superseded
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phase opened | Done | this file |
| Inventory of every path, command, flag and variable named by the route and install YAML | Done | `scratch/reality-check.md` |
| One read-only health run on this checkout | Done | `scratch/doctor-run.log` — exit 2, pass 8 / warn 0 / fail 3 |
| Verdict and target behavior | Done | `scratch/proposal.md` — verdict `fix` |
| Verdict applied to both workflow YAMLs, the presentation, the router, the doctor scripts and the catalog/contract consumers | Done | `implementation-summary.md` Files Changed |
| Post-change verification | Done | `bash -n` `SYNTAX_OK`; health run exit 2, pass 11 / warn 2 / fail 3; `route-validate.sh` exit 0; strict validation `PASSED` |

### Deviations and findings

| Item | Note |
|------|------|
| The debug proposal's build-state file and `validate_config.py` change were rejected | Both modify the Code Mode subsystem the doctor inspects; build currentness uses an mtime comparison inside the doctor instead |
| `--server` removed from both sub-actions | Code Mode is the only server, so the flag has no target |
| `.skilled/.gitignore` ignores `mcp-server/package.json` | A fresh clone or worktree cannot build Code Mode; the main checkout holds the manifest only as an untracked local file |
| `scripts/install.sh` never runs a build | It cannot produce `dist/index.js` by itself |
| `validate_config.py` under-validates credential keys | It checks only the MCP-specific nested shape and does not apply the manual-name prefix |
| `magicpath` manual in `.utcp_config.json` | A CLI manual without the required `config` field |
| Health run exit 2 is expected on this worktree | `package.json`, `dist/index.js` and `node_modules` are absent; the doctor reports each by name |
<!-- /ANCHOR:log -->
