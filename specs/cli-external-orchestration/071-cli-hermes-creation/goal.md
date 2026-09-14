---
title: "Goal: Hermes Agent becomes the seventh cli runtime"
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
    packet_pointer: "cli-external-orchestration/071-cli-hermes-creation"
    last_updated_at: "2026-09-14T19:40:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Plan confirmed; roadmap rewritten; phases 002-009 scaffolded"
    next_safe_action: "Start phase 002 contract pin"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-071-cli-hermes-creation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Hermes Agent becomes the seventh cli runtime

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Hermes Agent is integrated as `cli-hermes`, the seventh `cli-external-orchestration`
runtime: a deep-loop executor, a skill packet, a repo-root `.hermes/` folder, and bridges to this
repo's agents, commands, skills, hooks and MCP servers.

### Decisions

| ID | Decision |
|----|----------|
| D1 | Evidence base: `001-deep-research/research/research.md`; plan R1 to R8 confirmed 2026-09-14; phases 002 to 009 all required (operator: nothing deferred) |
| D2 | Contract pinned live with the LLM Gateway key; roster `deepseek-v4.1-flash`, `glm-5.3-flash`, fail-closed |
| D3 | Dispatch: `hermes chat -Q --query-file --yolo --ignore-rules --run-budget --max-turns -t <toolsets> --source tool </dev/null`; never `-z` or `--worktree`; `--yolo` lifts only the dangerous-action gate; read-only is `-t file,todo` plus the plugin marker |
| D4 | Docs via sk-create-* skills; code via `sk-code` |
| D5 | No routing without a working `hermes` binary; one hub advisor identity |
| D6 | Config, hooks, MCP stay user-level; `.hermes/` carries skills, plugins, prompts |
| D7 | Branch `skilled/v4.0.0.0` |

### Roadmap

| # | Phase | Outcome |
|---|-------|---------|
| 1 | `001-deep-research` | Research |
| 2 | `002-hermes-contract-pin` | Contract pin |
| 3 | `003-deep-loop-executor-support` | Executor kind |
| 4 | `004-cli-hermes-skill-packet` | Seventh hub mode |
| 5 | `005-hermes-runtime-folder` | Repo-root `.hermes/` |
| 6 | `006-hermes-hook-and-plugin-layer` | Guard-core plugin |
| 7 | `007-hermes-model-registry-and-routing` | Roster enforced |
| 8 | `008-hermes-playbook-and-catalog` | Playbook and catalog |
| 9 | `009-docs-governance-and-closeout` | Roster docs, closeout |

Each phase has its own `goal.md`; a child that changes a decision here amends this file.

### Completion criteria

1. Both research lineages ran to their caps (10 and 5 iterations) and the merged synthesis names its findings.
2. Findings were presented and the confirmed phase plan is recorded in this file's log.
3. Every phase is a child with its own `goal.md` passing `validate.sh --strict`.
4. `cli-hermes` is a registered hub mode and a deep-loop executor kind, proven by checkers and tests.
5. A Hermes session in this repo reaches the shared agents, commands, skills and MCP servers, shown live.
6. The parent passes `validate.sh --recursive --strict`.
7. Every phase is Complete with every acceptance row Met; no live finding is open.

### Operator copy

The operator's copy of this directive is the session objective; any change above is resent in chat.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

| Phase | Goal document |
|-------|---------------|
| 001 | `001-deep-research/goal.md` |
| 002 | `002-hermes-contract-pin/goal.md` |
| 003 | `003-deep-loop-executor-support/goal.md` |
| 004 | `004-cli-hermes-skill-packet/goal.md` |
| 005 | `005-hermes-runtime-folder/goal.md` |
| 006 | `006-hermes-hook-and-plugin-layer/goal.md` |
| 007 | `007-hermes-model-registry-and-routing/goal.md` |
| 008 | `008-hermes-playbook-and-catalog/goal.md` |
| 009 | `009-docs-governance-and-closeout/goal.md` |
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] Research lineages ran to caps; synthesis names its findings
- [x] Findings presented; confirmed plan logged
- [x] Every phase has its own `goal.md` and passes strict validation
- [x] `cli-hermes` is a hub mode and executor kind, proven by checkers and tests
- [x] A Hermes session here reaches the shared agents, commands, skills and MCP servers
- [x] Parent passes recursive strict validation
- [x] Every phase 002 to 009 Complete, every acceptance row Met, no pin finding open or deferred
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

| Date | Event |
|------|-------|
| 2026-09-14 | Packet scaffolded as a phase parent; temporary directive authored; phase 001 research launched |
| 2026-09-14 | Phase 001 run complete: 10 and 5 iterations, 2 of 2 lineages succeeded, synthesis at `001-deep-research/research/research.md`; findings presented |
| 2026-09-14 | Operator confirmed the recommended plan (R1 to R8) and the LLM Gateway credential path; phases 002 to 009 scaffolded; decisions D1 to D3 and D6 amended accordingly |
| 2026-09-14 | Deviation, recorded not silent: phases 003 and 004 started before phase 002's smoke because no provider is configured and the session goal binds criterion 4, which the hub checkers and unit tests can prove without one. Every claim only the smoke can confirm stays marked pending in 002; the live lineage test in 003 waits for it. |
| 2026-09-14 | Phases 005 and 006 built ahead of the operator steps: `.hermes/` (skills and playbook symlinks, 33 generated prompt stubs, `SYNC.md`) and the `repo-guards` project plugin (validate passed; self-dispatch and preflight blocks proven in-process). Criterion 5 now waits only on the operator: provider, `hermes skills trust`, `HERMES_ENABLE_PROJECT_PLUGINS=1`, `hermes mcp add`. |
| 2026-09-14 | Amendment to D6 and phase 002 P1, P4, P5, authorized by the operator in chat: this session performs the four user-level Hermes steps (provider block with `key_env` only, `hermes skills trust`, `HERMES_ENABLE_PROJECT_PLUGINS=1` for test sessions, `hermes mcp add`). Rollback: `~/.hermes/config.yaml.bak-20260914-hermes-071`, `hermes skills untrust`, `hermes mcp remove`. No secret is written; the key stays in the shell environment. |
| 2026-09-14 | Phases 008 and 009 closed. The playbook's first pass found two defects (a read-only leaf had no file tools because Hermes's `search` toolset is web search only; the git advisory never reached a session) and four boundaries (`-s` cancels `--ignore-rules`, `hermes status` is not a provider probe, exit 0 with empty stdout, no goal in the session prompt). All six fixed: toolset rosters corrected with `SPECKIT_HERMES_READ_ONLY` and `HERMES_SPEC_FOLDER` injected by the runner; the plugin refuses write tools on a read-only leaf, appends the sk-git advisory to the tool result and renders the bound packet's goal slice; the ignore-rules rule carries the `-s` exception; the probe is `hermes config get providers.llmgateway.base_url`. Second pass 22 of 22 live; roster surfaces and READMEs done; every phase Complete. |
| 2026-09-14 | Operator widened the scope to every finding and every phase (nothing deferred, broken or untested): D1 and D3 amended, phases 008 and 009 made required, criterion 7 added. Corrections landed on evidence: `--yolo` gates only flagged actions (ordinary write without it succeeded; `rm -rf` blocked without and ran with it), so the hard rule, builder, rule check, references and card were reworded and phase 002 closed; the runner ceiling is twice `iterations × timeoutSeconds`, so the 1042 s lineage was inside its bound and the guidance is `timeoutSeconds` 900 or more; `liveTools.mcpServers` added so a Hermes leaf can name MCP servers; council seats, the benchmark dispatcher and the stress matrix accept `cli-hermes`; the skill-root metadata check passes for every hub; the nested-packet doc's stage-one replay pointer is corrected. |
| 2026-09-14 | Phase 003 live lineage fulfilled (exit 0, 1042 s, correct synthesis, full artifact set) and phase 007 closed: runner refused an off-roster id in 12 ms, sync guard extended, eligibility and persona rows landed, four reasoning levels answered live. Finding: a Hermes research iteration ran 1042 s at `max`, inside the runner's 2× ceiling; give it `timeoutSeconds` 900 or more. |
| 2026-09-14 | Criterion 5 met live after the authorized operator steps: persona honored and a command template executed (`agent-router`, `PERSONA=markdown`), a repo skill reached (`-s cli-hermes`), the `code_mode` MCP server reached (`search_tools`, 10 results), and the project plugin blocked a nested `hermes chat` inside a session. Smoke: exit 0, `OK`, session id on stderr. Findings: whole-tree skills symlink rejected on evidence (ten-minute scan, every hub quarantined) and replaced by per-skill links; `-Q` stdout carries model reasoning; `--run-budget` does not bound a stalled stream; MCP servers must be named in `-t`; project plugins need the `plugins.enabled` line by hand. |
| 2026-09-14 | Criterion 4 met: `cli-hermes` is the eighth `ExecutorKind` (typecheck clean, 318 tests passing, 108 hook tests, 11 rule-check tests) and the seventh hub mode (`parent-skill-check` OK, package validator PASS, compiled routing fresh, both routing stages replayed). Phase 004 Complete; phase 003 In Progress on its live-lineage criterion; phase 002 blocked on the operator's provider step. |
<!-- /ANCHOR:log -->
