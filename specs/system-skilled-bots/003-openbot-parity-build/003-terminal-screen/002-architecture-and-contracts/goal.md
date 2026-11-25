---
title: "Goal: Phase 2: architecture-and-contracts"
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
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts"
    last_updated_at: "2026-11-25T22:20:00Z"
    last_updated_by: "phase-child-authoring"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "w4-003-002-architecture"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 2: architecture-and-contracts

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Deliver the crate, the `ui` verb, the fixture and the CI job that the rest of Phase 3 draws into, so a later child adds a module rather than a skeleton.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The library root declares every module and one stub file per module lands with it, so each later module task owns exactly one file and the crate's module tasks run in parallel instead of serializing on `src/lib.rs`. |
| D2 | The worker thread and the generation-tagged channel land here, not with the panes, because the measured freeze is a property of the loop rather than of any pane. |
| D3 | The fixture is the only payload source in tests, and it carries the four payloads plus the `lastRun.branch` and `lastRun.worktreePath` keys 004 adds. |
| D4 | The `ui` verb reads `BOTS_UI_BIN` as a test seam only; the shipped path resolves the binary from `--skilled-tree`. |
| D5 | This child draws one empty frame and no pane, so the loop, the guard and the process boundary are proven before any surface draws into them. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `cargo build --release --manifest-path crates/bots-tui/Cargo.toml` exits 0 and `ls crates/bots-tui/target/release/bots-ui` prints `crates/bots-tui/target/release/bots-ui`.
- [ ] `cargo test --manifest-path crates/bots-tui/Cargo.toml` prints `test result: ok` for the `lib`, `cli_client` and doc targets and no `FAILED`.
- [ ] `cargo clippy --manifest-path crates/bots-tui/Cargo.toml --all-targets -- -D warnings` exits 0 and `cargo fmt --manifest-path crates/bots-tui/Cargo.toml --check` exits 0.
- [ ] `T=$(mktemp -d); node .skilled/bin/bots.cjs ui --repo . --skilled-tree "$T"` exits 4 and prints `ui-unavailable`; after `mkdir -p "$T/crates/bots-tui"` the same command exits 4 and prints `ui-not-built`.
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/cli-ui.vitest.ts` prints no `failed`.
- [ ] `rg -n '^license' crates/bots-tui/Cargo.toml` prints `license = "MIT"`, and `rg -n 'openhuman' crates/bots-tui/src` prints only comment lines.
- [ ] `rg -c 'bots-tui' .github/workflows/bots-runtime.yml` prints 3.
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
| Child spec, plan, tasks and acceptance criteria authored | Done | `spec.md` carries 15 requirements, `tasks.md` carries 27 tasks in 8 waves, and `acceptance-criteria.md` carries one row per requirement |
| Crate scaffolded | Pending | `ls crates` prints `ls: crates: No such file or directory` |
| `ui` verb added | Pending | `node .skilled/bin/bots.cjs ui` prints `bots: unknown verb: ui` and exits 2 |
| Fixture committed | Pending | No `crates/bots-tui/tests/fixtures/bots` exists yet |
| CI job added | Pending | `rg -c 'bots-tui' .github/workflows/bots-runtime.yml` exits 1 with no match |

### Deviations and findings

| Item | Note |
|------|------|
| The empty frame is the exit, not a gap | The advisory's exit for this child is "CI green on an empty frame", so the frame draws blank here and 003 adds the header and tabs without moving the loop. |
| The module map is read from 001 | The seven modules follow 001's component inventory rather than a second list, so a component 001 names has one home here. |
| The fixture carries 004's two keys | `lastRun.branch` and `lastRun.worktreePath` are 004's, and the fixture carries them now so the payload does not change under a later child. |
| The hand proof is not a criterion | No criterion here needs a tty. The overlay's keystrokes are 005's hand check, and this child's closed-input and Esc paths are lib tests. |
<!-- /ANCHOR:log -->
