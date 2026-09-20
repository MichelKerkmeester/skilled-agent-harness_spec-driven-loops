---
title: "Goal: cli-jev becomes the hub's transport mode"
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
    packet_pointer: "cli-jev/001-cli-jev-creation"
    last_updated_at: "2026-09-20T11:30:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Phases 001 to 005 complete; the credential step closed by the authenticated verification"
    next_safe_action: "None; every completion criterion is checked"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-001-creation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Transport, not executor: jev returns one typed judgment and runs nothing"
      - "Does the authenticated surface hold? Yes: an operator-stored official key closed the two credentialed scenarios with observed output"
---
# Goal: cli-jev becomes the hub's transport mode

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** `cli-jev` is the eighth `cli-external-orchestration` mode and its first transport: a
pinned contract for the `jev` judgment CLI, registered on every routing surface, guarded by
implemented rules, and unable to run a task.

### Decisions

| ID | Decision |
|----|----------|
| D1 | `packetKind: "transport"`, `backendKind: "cli-dispatch"`, `mutatesWorkspace: false`, `Write`/`Edit`/`Task` forbidden, declared in `extensions["transport-axis"].transports[]`; `tieBreak` lists it after the seven workflows |
| D2 | No deep-loop `ExecutorKind`: jev takes one state and one question and returns one judgment, so it cannot run a lineage |
| D3 | No repository MCP-config change; `references/mcp-server.md` documents the `jev-mcp` stdio block as an operator step |
| D4 | Live pin via `uv tool install jev-cli` (rollback `uv tool uninstall jev-cli`); authenticated claims stay marked until a credential exists |
| D5 | Spec docs, cross-file registration and all verification stay with the orchestrator; dispatched leaves author content |
| D6 | Five phases, levels 3/3/3/2/2, each validating independently before the next closes |
| D7 | The seven existing modes are untouched; their order in `tieBreak` and their behavior are the non-regression proof |

### Operator copy

The operator's copy of this directive is the session objective; any change above is resent in chat.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

| Phase | Goal document |
|-------|---------------|
| 001-005 | each child's `goal.md` |
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] The jev contract is pinned live with every claim tagged source-read or live-verified
- [x] The packet's declared hard rules are implemented, fixtured and a bijection-tested set
- [x] The hub gate passes at eight modes and both routing stages replay the transport without breaking the seven
- [x] The compiled-serving manifest is fresh at the new policy hash
- [x] The catalog and the 22-scenario playbook pass their package validators
- [x] The recursive strict gate prints `RESULT: PASSED` over the parent and five children (verified 2026-09-20, 0 errors and 0 warnings in all six folders)
- [x] The operator supplied a Jev credential and the authenticated verification closed the two SKIP scenarios with observed output (recorded under `cli-jev/benchmark/reports/2026-09-20-authenticated-verification/`)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

| Date | Event |
|------|-------|
| 2026-09-20 | Packet scaffolded as a Level 3 phase parent with five children, each level set by `recommend-level.sh` |
| 2026-09-20 | Phase 001: `jev-cli` 0.6.2 installed through `uv tool`, contract pinned, probe matrix and stdio handshake recorded, exit-4 negative control captured |
| 2026-09-20 | Phase 002: the packet authored with eight declared hard rules, four references, the question-shaping asset, README, changelog and benchmark baseline |
| 2026-09-20 | Phase 003: registry plus `transport-axis`, all routing surfaces, the audit shape, eight implemented checks, the compiled harness, the refreshed manifest and the regenerated trigger index |
| 2026-09-20 | Phase 004: catalog and playbook authored; the playbook was restructured to one file per scenario so the package validator passes at 22 scenarios, 5 categories, 0 violations |
| 2026-09-20 | Phase 005: roster mentions, the hub catalog's falsified axis claims, the parent metadata, and the recursive gate |
<!-- /ANCHOR:log -->
