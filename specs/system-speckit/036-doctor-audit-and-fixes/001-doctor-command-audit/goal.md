---
title: "Goal: Doctor command audit and /doctor:env"
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
    packet_pointer: "system-speckit/048-doctor-command-audit"
    last_updated_at: "2026-10-02T18:30:00Z"
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
# Goal: Doctor command audit and /doctor:env

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Leave every doctor command matched to the current system, kept, fixed or retired on evidence from this checkout, with `/doctor:mcp` covering only MCP Code Mode and its `.utcp_config.json`, and add a `/doctor:env` command that guides operators through the environment switches.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | One phase per doctor target. Each audit ends in one verdict, keep, fix or retire, backed by command output or file:line from this checkout. |
| D2 | `/doctor:mcp` install and debug cover only MCP Code Mode and `.utcp_config.json`: installing Code Mode, registering it per runtime, and adding UTCP manuals. |
| D3 | `/doctor:env` is built through sk-create-command and reads its switch list from `ENV-REFERENCE.md`. It never asks for or writes a secret value. |
| D4 | A defect found in a subsystem a doctor inspects is recorded as a finding, not fixed inside that phase. |
| D5 | Executors are GPT-6 Luna at max on the fast tier through cli-codex, and DeepSeek V4.1 Flash at max through cli-pi on opencode-go. The orchestrator checks every diff before the next dispatch. |
| D6 | Work stays in worktree `worktrees/079-doctor-command-audit`. Nothing is merged or pushed without the operator's go-ahead. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-mcp-install-code-mode | `001-mcp-install-code-mode/goal.md` |
| 002-mcp-debug-code-mode | `002-mcp-debug-code-mode/goal.md` |
| 003-update | `003-update/goal.md` |
| 004-deep-loop | `004-deep-loop/goal.md` |
| 005-embeddings | `005-embeddings/goal.md` |
| 006-fable-mode | `006-fable-mode/goal.md` |
| 007-parent-skill | `007-parent-skill/goal.md` |
| 008-router-reach | `008-router-reach/goal.md` |
| 009-runtime-mirrors | `009-runtime-mirrors/goal.md` |
| 010-skill-advisor | `010-skill-advisor/goal.md` |
| 011-skill-budget | `011-skill-budget/goal.md` |
| 012-skill-graph-freshness | `012-skill-graph-freshness/goal.md` |
| 013-speckit-retrieval | `013-speckit-retrieval/goal.md` |
| 014-doctor-env | `014-doctor-env/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] All 13 audit phase folders, 001 through 013, have an `implementation-summary.md` that states one verdict: keep, fix or retire
- [ ] `.skilled/commands/doctor/assets/doctor-mcp-install.yaml` and `doctor-mcp-debug.yaml` name no MCP server other than Code Mode
- [ ] `.skilled/commands/doctor/env.md` exists and `.claude/commands/doctor/env.md` is a symlink to it
- [ ] `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0
- [ ] `validate.sh specs/system-speckit/048-doctor-command-audit --recursive --strict` prints RESULT: PASSED
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
| Packet scaffolded, 14 phases | Done | `create.sh` run in worktree 079 |
| Thirteen audits closed with a verdict | Done | Eleven fix (003 by redesign), 005 retire, 012 keep; every `implementation-summary.md` states its verdict |
| `/doctor:mcp` narrowed to Code Mode | Done | Commit `6cd0da3618`; the install and debug YAMLs name no other MCP server |
| `/doctor:env` built through sk-create-command | Done | Commit `6cd0da3618`; `.claude/commands/doctor/env.md` is a symlink to `.skilled/commands/doctor/env.md` |
| `/doctor:speckit` targets repaired, embeddings retired | Done | Commit `144e66669c` |
| Rebuild moved to `/doctor:rebuild`; `/doctor:update` made release-aware | Done | Commits `b0be233a6b`, `b853457597` and `8215a33a7b`; engine tests 16 of 16 pass |
| Route validation | Done | `route-validate.sh` exit 0, 9 routes validated, 2 warnings |
| Recursive strict validation | Done | `validate.sh specs/system-speckit/048-doctor-command-audit --recursive --strict`: 15 of 15 folders RESULT: PASSED |

### Deviations and findings

| Item | Note |
|------|------|
| Phase 003 scope widened | The operator asked for a release-aware updater, so phase 003 became a redesign after ten deep-research iterations. Its goal directive was amended to match. |
| cli-pi routes added | The opencode-go and Cline routes for DeepSeek V4.1 Flash were added to the deep-loop allowlist so `/deep:research` could run on the planned executor (commit `69cb472aba`). |
| LUNA usage limit | GPT-6 Luna hit its usage limit mid-session. The phase 010–013 audits were rerun on DeepSeek, following D5. |
| Mutation-class gate coverage | The gate no longer covers the mcp-tooling CLI scripts. This is recorded in phase 001. |
| Findings left open | Each phase's `implementation-summary.md` lists the subsystem defects it recorded and did not fix, following D4. Phase 003 also records the `/deep:research` workflow defects seen during its run. |
<!-- /ANCHOR:log -->
