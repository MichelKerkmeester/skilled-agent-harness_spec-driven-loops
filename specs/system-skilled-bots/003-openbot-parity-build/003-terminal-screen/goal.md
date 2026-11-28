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
    last_updated_at: "2026-11-25T22:43:40Z"
    last_updated_by: "integration-wave"
    recent_action: "Moved the hand proof to the operator acceptance step after 006"
    next_safe_action: "Work child 001-ux-and-component-map"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "w4-003-terminal-parent"
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
| D1 | The crate lives at `.skilled/crates/bots-tui/`, outside every skill, because a hub root may hold no `crates` folder. |
| D2 | `cli.rs` is the only module that spawns a process. Every other module reads state or draws cells, so a test can drive the loop without a terminal. |
| D3 | `.skilled/crates/bots-tui/tests/fixtures/bots` is the only payload source in tests. No test reads a live state root and no test needs a tty. |
| D4 | The approval overlay offers `once` and `deny` only. No `always` and no `conversation` scope, because no phase lands the rule store a standing grant needs. |
| D5 | The fourth tab is a Chat placeholder naming phase 010, so Alt+1..4 does not renumber when that phase lands. |
| D6 | `[` and `]` are the fallback tab keys beside Alt+1..4, and Ctrl+C closes an open overlay or quits and never writes, because Alt+1..4 is unreliable on macOS. |
| D7 | Snapshot tests assert the ratatui `TestBackend` buffer directly. `insta` is not a dependency. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-ux-and-component-map | `001-ux-and-component-map/goal.md` |
| 002-architecture-and-contracts | `002-architecture-and-contracts/goal.md` |
| 003-shell-and-navigation | `003-shell-and-navigation/goal.md` |
| 004-panes | `004-panes/goal.md` |
| 005-answer-flow | `005-answer-flow/goal.md` |
| 006-hardening-and-proof | `006-hardening-and-proof/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `cargo test --manifest-path .skilled/crates/bots-tui/Cargo.toml` prints `test result: ok` for every target and no `FAILED`. `cargo clippy --manifest-path .skilled/crates/bots-tui/Cargo.toml --all-targets -- -D warnings` and `cargo fmt --manifest-path .skilled/crates/bots-tui/Cargo.toml --check` both exit 0.
- [ ] `rg -n '^license' .skilled/crates/bots-tui/Cargo.toml` prints `license = "MIT"`, and `rg -n 'openhuman' .skilled/crates/bots-tui/src` prints only comment lines.
- [ ] `T=$(mktemp -d); node .skilled/bin/bots.cjs ui --repo . --skilled-tree "$T"` exits 4 and prints `ui-unavailable`. After `mkdir -p "$T/.skilled/crates/bots-tui"` the same command exits 4 and prints `ui-not-built`.
- [ ] `npm --prefix .skilled/skills/system-skilled-bots/runtime test` prints a `Tests` line with no `failed`.
- [ ] `rg -n '^  bots-tui:' .github/workflows/bots-runtime.yml` prints one line and `rg -c -e "- '.skilled/crates/bots-tui/\*\*'" .github/workflows/bots-runtime.yml` prints 2.
- [ ] `001-ux-and-component-map/acceptance-criteria.md` AC-007 reads `Met`, and `001-ux-and-component-map/decision-record.md` carries the approval row naming the date and the key set it covers.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen --strict --recursive` prints `RESULT: PASSED`.
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
| Phase parent authored | Done | `spec.md` carries the Phase Documentation Map for six children, and `decision-record.md` records Q002 to Q009 |
| Six binding rows | Done | `find specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen -mindepth 1 -maxdepth 1 -type d -name '[0-9][0-9][0-9]-*' | wc -l` prints 6 |
| Child goals authored | Done | `find specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen -mindepth 2 -maxdepth 2 -name 'goal.md' | wc -l` prints 6, and `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs` passes on each |
| Crate scaffolded | Pending | No `.skilled/crates/bots-tui/` exists yet |
| `ui` verb added | Pending | `node .skilled/bin/bots.cjs ui` prints `bots: unknown verb: ui` and exits 2 |
| First review applied | Done | `spec.md` REQ-010 names `Enter open` in the inbox footer and the two overlay key sets with deny drawn first, Q008 and Q009 are recorded in `decision-record.md`, and the criteria carry 001's key-map approval and run `--strict --recursive` |
| Integration wave applied | Done | `spec.md` links the four design notes, carries the install, version match, CI and rollback section, and states the answer argv with its `--` terminator. `decision-record.md` section 2 records A1 to A7 as taken by the assistant and open for the operator to override |

### Deviations and findings

| Item | Note |
|------|------|
| The hand proof is the last step, not a gate | 006's scripted pseudo-terminal run answers one item without a person, so the answer path is proven by a command. The operator's own hand answer is the final acceptance step after 006, and it is the only step that needs a tty. |
| The inbox pane reads the fixture first | `bots inbox --json` does not exist until phase 001 lands it, so the inbox pane and its banner are proven against `tests/fixtures/bots` until then. |
| The parent goal owns the binding | `../goal.md` names this phase in its row 003 and binds it. This goal binds the six children below it. |
| The pre-expansion documents are kept | `context/legacy-003/` holds the phase 003 spec, plan, tasks, acceptance criteria and goal as they stood before the expansion. The folder is gitignored, so it is reference only. |
| The two cargo criteria are one | The checker caps a goal at seven criteria, so `cargo test`, `cargo clippy` and `cargo fmt` share one line. Every command and its expected output is still named, so no gate was dropped to make room for 001's key-map approval. |
| The fixture hand-off names a scenario file | F-034: the fixture bullet now says a key that draws lands as a new scenario file, for example `tests/fixtures/payloads/inbox.grant.json` behind `--fixture-scenario grant`, so a later phase adds a file and never breaks a snapshot or the design-copy diff. Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive. |
| The banner is 004's | F-005: the file table gives `.skilled/crates/bots-tui/src/view/banner.rs` to 004, because the frames that hold an open item draw the row and 004's snapshot gate must go green before 005 starts. Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive. |
| The prose rules were applied | O-021 and O-022: every semicolon outside code was split into two sentences and every serial comma before a final `and` was dropped, across this packet's documents. Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive. |
| D1 moved the crate | The operator moved the crate from the repository root to `.skilled/crates/bots-tui/` on 2026-11-28, so D1 now names that path and its reason. The skill walkers would also crawl a build output under a skill, and `.opencode/` links `.skilled/skills/` and not `.skilled/crates/`. Every path in this phase's documents moved with it. |
<!-- /ANCHOR:log -->
