---
title: "Goal: Phase 2: mcp-debug-code-mode"
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
    packet_pointer: "system-speckit/048-doctor-command-audit/002-mcp-debug-code-mode"
    last_updated_at: "2026-10-02T16:10:13Z"
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
# Goal: Phase 2: mcp-debug-code-mode

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Leave `/doctor:mcp debug` covering only MCP Code Mode and its `.utcp_config.json`, matched to the current system on evidence from this checkout.

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

- [ ] `scratch/reality-check.md` marks every path, script, command, flag and environment variable named by `doctor-mcp-debug.yaml` as present, moved or missing
- [ ] `scratch/doctor-run.log` holds the output of one read-only or dry-run run of `/doctor:mcp debug` on this checkout
- [ ] `implementation-summary.md` states one verdict, keep, fix or retire, and the evidence behind it
- [ ] `doctor-mcp-debug.yaml` diagnoses only MCP Code Mode and `.utcp_config.json`, and `scratch/reality-check.md` lists every other server it named before
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
| Phase opened | Done | Scaffolded on 2026-10-02 |
| Audit inventory | Done | `scratch/reality-check.md` marks every named path, command, flag and variable present, moved or missing |
| Read-only run | Done | `scratch/doctor-run.log`: exit 2, pass 8, fail 3 |
| Verdict | Done | `scratch/proposal.md`: "Verdict: fix." |
| Fix applied | Done | Debug asset rewritten; shared script, library, router, presentation and catalog rows updated in the worktree diff |
| Post-fix verification | Done | pass 11, warn 2, fail 3; `bash -n` SYNTAX_OK; `route-validate.sh` exit 0 |
| Docs closed | Done | `acceptance-criteria.md` 5 of 5 Met; `spec.md` status Complete |

### Deviations and findings

| Item | Note |
|------|------|
| Deviation: the proposal's build-fingerprint file and `validate_config.py` changes were rejected | Both would change the inspected Code Mode subsystem; build currentness uses an mtime comparison inside the doctor instead |
| Finding: `.skilled/.gitignore` line 2 ignores `package.json` | The Code Mode server manifest is never committed; a fresh clone or worktree cannot build Code Mode |
| Finding: `scripts/install.sh` never runs a build | It cannot produce `dist/index.js` by itself |
| Finding: `validate_config.py` shape gap | Checks only the MCP-specific nested shape and does not apply the manual-name prefix to credential keys |
| Finding: the `magicpath` manual | A CLI manual in `.utcp_config.json` without its required `config` field |
| Note: Codex registration is WARN "unvalidated" | Python 3.9 has no `tomllib`; the row is never reported as PASS |
| Note: no live tool probe | The debug target only probes from a connected Code Mode session; this phase ran the script directly |
<!-- /ANCHOR:log -->
