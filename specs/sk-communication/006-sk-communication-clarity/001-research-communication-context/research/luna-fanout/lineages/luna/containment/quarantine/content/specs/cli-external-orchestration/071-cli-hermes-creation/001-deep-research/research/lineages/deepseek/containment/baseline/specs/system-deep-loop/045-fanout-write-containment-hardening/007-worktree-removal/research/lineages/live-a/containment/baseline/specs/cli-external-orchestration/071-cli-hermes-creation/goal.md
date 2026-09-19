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
    last_updated_at: "2026-09-14T18:30:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Authored the temporary parent directive; phase 001 research launched"
    next_safe_action: "Present phase 001 findings; on confirmation, amend the roadmap and scaffold phases 002+"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-071-cli-hermes-creation"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
# Goal: Hermes Agent becomes the seventh cli runtime

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Hermes Agent (installed at `~/.hermes`) is integrated as `cli-hermes`, the seventh
`cli-external-orchestration` runtime, with the same parity the other six have: a deep-loop executor,
a skill packet, a repo-root `.hermes/` folder, and bridges so Hermes can use this repo's agents,
commands, skills, hooks and MCP servers. Research comes first; nothing is built until its
findings are confirmed.

### Decisions

| ID | Decision |
|----|----------|
| D1 | Phase 001 is research only. It writes inside its own `research/` tree and changes no runtime file |
| D2 | Research runs 15 forced-depth iterations through `cli-devin`: 10 on `deepseek-v4-flash-max`, 5 on `swe-2-max`, no early convergence |
| D3 | The integration phases are candidates until the operator confirms the synthesized findings; only confirmed phases are scaffolded, each with its own `goal.md` |
| D4 | Every later phase follows `031-cli-pi-creation`'s shape: contract pin before executor wiring, skill packet before bridges, playbook and governance last |
| D5 | The skill packet, README, feature catalog and playbook are built with `sk-create-skill`, `sk-create-readme`, `sk-create-feature-catalog` and `sk-create-manual-testing-playbook`; code goes through `sk-code` |
| D6 | An unavailable `hermes` binary never becomes routable; the hub stays the single advisor identity |
| D7 | Work happens on `skilled/v4.0.0.0` |

### Roadmap

| # | Phase | Outcome |
|---|-------|---------|
| 1 | `001-deep-research` | Ranked findings, a comparison with the six runtimes, and a recommended phase plan in `research/research.md` |
| 2+ | candidates `002`–`011` | Contract pin, executor support, skill packet, `.hermes/` folder, agent and command bridge, hooks and plugins, MCP, model routing, playbook and catalog, docs and governance |

Each phase holds its own `goal.md` with the criteria that decide that phase. This file is the
parent directive; a child goal that would change a decision here is an amendment to this file.
The roadmap rows for phases 2 and later are rewritten when the operator confirms the plan.

### Completion criteria

1. Both research lineages ran to their caps: 10 and 5 iteration files exist on disk and the merged synthesis names its findings.
2. The findings and recommendations were presented to the operator and the confirmed phase plan is recorded in this file's log.
3. Every confirmed phase exists as a child folder with its own `goal.md` and passes `validate.sh --strict`.
4. `cli-hermes` is a registered hub mode and a deep-loop executor kind, proven by the hub checkers and the runtime test suite, not by reading.
5. A Hermes session started in this repo can reach the shared agents, commands, skills and MCP servers, shown by live output.
6. The parent passes `validate.sh --recursive --strict`.

### Operator copy

The operator holds this directive as the session objective, and that copy judges completion. If
anything above changes, the full text is resent in chat so the operator can update their copy.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

| Surface | Bound to |
|---------|----------|
| Phase goals | `001-deep-research/goal.md` now; every confirmed phase's `goal.md` once scaffolded |
| Packet spec | `spec.md` |
| Closure gate | each phase's `acceptance-criteria.md` |
| Operator copy | the session objective, which judges completion |
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] Both research lineages ran to their caps and the merged synthesis names its findings
- [ ] Findings presented; confirmed phase plan recorded in the log below
- [ ] Every confirmed phase has its own `goal.md` and passes `validate.sh --strict`
- [ ] `cli-hermes` is a registered hub mode and a deep-loop executor kind, proven by checkers and tests
- [ ] A Hermes session in this repo reaches the shared agents, commands, skills and MCP servers, shown live
- [ ] The parent passes `validate.sh --recursive --strict`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

| Date | Event |
|------|-------|
| 2026-09-14 | Packet scaffolded as a phase parent; temporary directive authored; phase 001 research launched |
<!-- /ANCHOR:log -->
