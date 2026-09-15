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
runtime, and every runtime's dispatch preflight actually enforces the rules it declares.

### Decisions

| ID | Decision |
|----|----------|
| D1 | Evidence base: the three research phases; nothing deferred, broken or untested |
| D2 | Contract pinned live via the LLM Gateway; roster `deepseek-v4.1-flash`, `glm-5.3-flash`, fail-closed |
| D3 | Dispatch: quiet oneshot chat, prompt on stdin, explicit toolsets, stdin closed; never the top-level oneshot or the worktree flag; `--ignore-rules` ALWAYS, including alongside `-s` (a live A/B disproved the old preload exception); `-t` must include `file`; read-only is `-t file,todo` plus the plugin marker |
| D4 | Docs via sk-create-* skills; code via `sk-code` on `cli-pi` |
| D5 | No routing without a working binary; one hub advisor identity |
| D6 | Config, hooks, MCP stay user-level; `.hermes/` carries generated skill and agent copies, plugins, prompts |
| D7 | Branch `skilled/v4.0.0.0`, pushed to `main` too |
| D8 | A rule that must not be violated is declared `error`; `warn` is advice an agent may ignore |
| D9 | Devin's command surface stays retired per the July operator directive; only its stale docs are corrected |

### Roadmap

| # | Phase | Outcome |
|---|-------|---------|
| 1-9 | `001`-`009` | Research, pin, executor, hub mode, `.hermes/`, plugin, roster, playbook, closeout |
| 10 | `010-hermes-hook-parity` | 18 of 22 hook packages bridged |
| 11 | `011-dispatch-preflight-parity-research` | 10 iterations on preflight defects |
| 12 | `012-runtime-surface-parity-research` | 10 iterations on commands, skills, goal, hooks |
| 13 | `013-close-silent-preflight-holes` | Six silent-approval holes closed |
| 14 | `014-extend-dispatch-coverage` | Cursor and OpenCode adapters, predicate fixes |
| 15 | `015-wire-executor-builders` | Binary probes, Hermes personas |
| 16 | `016-dispatch-enforcement-ci-guard` | One guard so a runtime cannot go inert silently |

Each phase has its own `goal.md`; a child that changes a decision here amends it.


### Open operator decisions

- Three builders default to a different model than their packet documents (codex, claude, opencode), and the codex service tier is only set on request. Changing them alters cost and behaviour for every unpinned lineage.

### Operator copy

The operator's copy of this directive is the session objective; any change above is resent in chat.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

| Phase | Goal document |
|-------|---------------|
| 001-009 | each child's `goal.md` |
| 010 | `010-hermes-hook-parity/goal.md` |
| 011-016 | each child's packet docs; the dispatch-parity phases carry no separate `goal.md` |
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `cli-hermes` is a hub mode and executor kind, proven by checkers and tests
- [x] A Hermes session here reaches the shared agents, commands, skills and MCP servers
- [x] Phases 002 to 010 Complete, every acceptance row Met
- [x] Every documented headless dispatch resolves to its own runtime's rules
- [x] Cursor and OpenCode refuse a violating dispatch before it runs
- [x] Each closed hole has a test that fails when that fix alone is reverted
- [ ] Phase 016 guard green on main and red under any single hand mutation
- [ ] Parent passes recursive strict validation with phases 011 to 016 included
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
| 2026-09-15 | Operator asked for 1:1 hook parity, implemented on cli-pi with DeepSeek V4.1 Flash max via the LLM Gateway: phase 010 added; ten bridges landed over six Pi dispatches (two fix loops from live-only defects), 42 harness tests, seven live scenarios PASS; the pi collector's dist-checker interpreter fixed on the way; vision provider set at the operator level under a fresh backup. Roadmap gains phase 10. |
| 2026-09-15 | Operator asked for agents too. `.hermes/agents` links the shared agent files; the generator mirrors each as the skill `agent-<name>` (a plugin prompt section is capped at 4000 characters, which skipped a 22k persona outright); the plugin now runs three capped sections and binds `HERMES_AGENT_PERSONA` to the preloaded skill. Live: `PERSONA=markdown` with the H1 quoted. |
| 2026-09-15 | Operator asked for all skills in `.hermes/skills`, symlinked like `.claude/skills`. Symlinks cannot work: Hermes scans a linked directory in full and quarantined even the single `cli-hermes` link (37 findings). Replaced with `sync-skills-hermes.cjs`: 56 generated markdown-only copies, session start 17 s, `-s` preload proven live for three skills, 3 generator tests; seven copies quarantined on prose and still preloadable. D6 amended. |
| 2026-09-14 | Phases 008 and 009 closed. The playbook's first pass found two defects (a read-only leaf had no file tools because Hermes's `search` toolset is web search only; the git advisory never reached a session) and four boundaries (`-s` cancels `--ignore-rules`, `hermes status` is not a provider probe, exit 0 with empty stdout, no goal in the session prompt). All six fixed: toolset rosters corrected with `SPECKIT_HERMES_READ_ONLY` and `HERMES_SPEC_FOLDER` injected by the runner; the plugin refuses write tools on a read-only leaf, appends the sk-git advisory to the tool result and renders the bound packet's goal slice; the ignore-rules rule carries the `-s` exception; the probe is `hermes config get providers.llmgateway.base_url`. Second pass 22 of 22 live; roster surfaces and READMEs done; every phase Complete. |
| 2026-09-14 | Operator widened the scope to every finding and every phase (nothing deferred, broken or untested): D1 and D3 amended, phases 008 and 009 made required, criterion 7 added. Corrections landed on evidence: `--yolo` gates only flagged actions (ordinary write without it succeeded; `rm -rf` blocked without and ran with it), so the hard rule, builder, rule check, references and card were reworded and phase 002 closed; the runner ceiling is twice `iterations × timeoutSeconds`, so the 1042 s lineage was inside its bound and the guidance is `timeoutSeconds` 900 or more; `liveTools.mcpServers` added so a Hermes leaf can name MCP servers; council seats, the benchmark dispatcher and the stress matrix accept `cli-hermes`; the skill-root metadata check passes for every hub; the nested-packet doc's stage-one replay pointer is corrected. |
| 2026-09-14 | Phase 003 live lineage fulfilled (exit 0, 1042 s, correct synthesis, full artifact set) and phase 007 closed: runner refused an off-roster id in 12 ms, sync guard extended, eligibility and persona rows landed, four reasoning levels answered live. Finding: a Hermes research iteration ran 1042 s at `max`, inside the runner's 2× ceiling; give it `timeoutSeconds` 900 or more. |
| 2026-09-14 | Criterion 5 met live after the authorized operator steps: persona honored and a command template executed (`agent-router`, `PERSONA=markdown`), a repo skill reached (`-s cli-hermes`), the `code_mode` MCP server reached (`search_tools`, 10 results), and the project plugin blocked a nested `hermes chat` inside a session. Smoke: exit 0, `OK`, session id on stderr. Findings: whole-tree skills symlink rejected on evidence (ten-minute scan, every hub quarantined) and replaced by per-skill links; `-Q` stdout carries model reasoning; `--run-budget` does not bound a stalled stream; MCP servers must be named in `-t`; project plugins need the `plugins.enabled` line by hand. |
| 2026-09-14 | Criterion 4 met: `cli-hermes` is the eighth `ExecutorKind` (typecheck clean, 318 tests passing, 108 hook tests, 11 rule-check tests) and the seventh hub mode (`parent-skill-check` OK, package validator PASS, compiled routing fresh, both routing stages replayed). Phase 004 Complete; phase 003 In Progress on its live-lineage criterion; phase 002 blocked on the operator's provider step. |
| 2026-09-15 | Operator asked whether natural prompts work for commands, agents, skills and reading the instruction file. All four work; three caveats found. Then two 10-iteration research lanes ran on cli-pi with DeepSeek V4.1 Flash max, stop policy max-iterations. The parity lane finished all ten and was rejected on a field-name mismatch between the documented state schema (`run`) and the forced-depth validator (`iteration`); its artifacts were salvaged. |
| 2026-09-15 | Research overturned two premises of its own charter: the authored command surface is 35, not 46 (a policy file explains every mirror count as deliberate exclusion, so only Devin's zero is a real gap), and Devin's commands were removed by operator directive in July rather than never built. D9 added. |
| 2026-09-15 | Phase 013: six silent-approval holes closed. The two largest were unknown before the research. Codex resolved to no dispatch shape at all, so every cli-codex rule had been inert since the shape was written. And Hermes fan-out lineages never set the project-plugin opt-in, so the read-only refusal, goal binding and advisories were dead in exactly the runs they were built for. Also the stdin severity flip across all seven skills, the `file` toolset requirement, removal of the `-s` preload exemption (D3 amended), and the zero-width joiner that made Hermes refuse the instruction file. Each fix proven by reverting it and watching its own test fail. |
| 2026-09-15 | Phase 014: Cursor and OpenCode gained pre-execution refusal, both calling the shared engine rather than copying it. Three predicates widened after live probes showed each matched one spelling and missed another. Two Pi checks added for the mandatory offline flag and the provider-qualified model. A registration assertion now fails if an adapter file or its binding disappears. |
| 2026-09-15 | Phase 015: the Claude and OpenCode builders gained the binary probe the other five had. Hermes personas were built and unreachable, with no lineage field able to name one; a lineage may now name a persona, sequenced after the exemption fix so the preload and the rules flag travel together. Three model-default divergences and the codex service tier left as operator decisions. |
<!-- /ANCHOR:log -->
