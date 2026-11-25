---
title: "Goal: Phase 3: terminal-screen"
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
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/003-terminal-screen"
    last_updated_at: "2026-11-25T19:52:51Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "w3-003-terminal-screen"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 3: terminal-screen

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Deliver Phase 3 of `../goal.md`: one MIT Rust `bots-ui` binary that draws the activity, inbox and routine surfaces from the runtime's `--json` verbs and answers a needs-you item through `bots answer`, started by one `ui` verb in `.skilled/bin/bots.cjs`.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The crate lives at `crates/bots-tui/`, not under `.skilled/`, because `.opencode/` mirrors `.skilled/` wholesale and would duplicate the crate and its build output. |
| D2 | `cli.rs` is the only module that spawns a process. Every other module reads state or draws cells, so a test can drive the loop without a terminal. |
| D3 | `crates/bots-tui/tests/fixtures/bots` is the only payload source in tests. No test reads a live state root and no test needs a tty. |
| D4 | The approval overlay offers `once` and `deny` only. No `always` and no `conversation` scope, because no phase lands the rule store a standing grant needs. |
| D5 | The fourth tab is a Chat placeholder naming phase 010, so Alt+1..4 does not renumber when that phase lands. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `cargo test --manifest-path crates/bots-tui/Cargo.toml` prints `test result: ok` for every target and no `FAILED`.
- [ ] `cargo clippy --manifest-path crates/bots-tui/Cargo.toml --all-targets -- -D warnings` exits 0 and `cargo fmt --manifest-path crates/bots-tui/Cargo.toml --check` exits 0.
- [ ] `rg -n '^license' crates/bots-tui/Cargo.toml` prints `license = "MIT"`, and `rg -n 'openhuman' crates/bots-tui/src` prints only comment lines.
- [ ] `T=$(mktemp -d); node .skilled/bin/bots.cjs ui --repo . --skilled-tree "$T"` exits 4 and prints `ui-unavailable`; after `mkdir -p "$T/crates/bots-tui"` the same command exits 4 and prints `ui-not-built`.
- [ ] `npm --prefix .skilled/skills/system-skilled-bots/runtime test` prints a `Tests` line with no `failed`.
- [ ] `rg -c 'bots-tui' .github/workflows/bots-runtime.yml` prints 3.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen --strict` prints `RESULT: PASSED`.
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
| Goal authored | Done | `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen` prints `RESULT: PASSED` |
| External orchestration waves | Done | `plan.md` section `External orchestration` names seven waves over T001 through T032 |
| Crate scaffolded | Pending | No `crates/bots-tui/` exists yet |
| `ui` verb added | Pending | `node .skilled/bin/bots.cjs ui` prints `bots: unknown verb: ui` and exits 2 |

### Deviations and findings

| Item | Note |
|------|------|
| The hand proof is not a criterion | T030 answers one item from the overlay by hand, so it needs a tty and stays the operator's step. Every criterion above runs without one. |
| The inbox pane reads the fixture first | `bots inbox --json` does not exist until phase 001 lands it, so the inbox pane and its banner are proven against `tests/fixtures/bots` until then. |
| The parent goal owns the binding | This goal carries no binding table. `../goal.md` names this phase in its row 003 and binds it. |
<!-- /ANCHOR:log -->
