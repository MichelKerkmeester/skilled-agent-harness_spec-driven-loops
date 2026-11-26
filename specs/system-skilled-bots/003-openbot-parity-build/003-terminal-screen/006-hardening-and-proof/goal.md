---
title: "Goal: Phase 6: hardening-and-proof"
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
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/003-terminal-screen/006-hardening-and-proof"
    last_updated_at: "2026-11-25T22:43:40Z"
    last_updated_by: "integration-wave"
    recent_action: "Added the pseudo-terminal criterion and the clean-room read row"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "w4-006-hardening-and-proof"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 6: hardening-and-proof

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Prove the `bots-ui` crate is formatted, lint-clean, tested, licence-clean and documented, and give a reader the one README that builds and drives it.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | This phase writes two files and repairs only what a gate names. A gate that needs a behaviour change is reported to the child that owns the module, never absorbed here. |
| D2 | The licence proof is the grep, the design-pointer check and a human read of the diff together. The grep alone is a text match, so it is never the whole proof. |
| D3 | The `bots-tui` CI job belongs to `002-architecture-and-contracts`. This phase reads it and reports a mismatch. It never edits `.github/workflows/bots-runtime.yml`. |
| D4 | The closed-input test belongs to `005-answer-flow`. The hand proof is the operator's final acceptance step after this phase, and the scripted pseudo-terminal run here proves the same path without a person. Every criterion here runs without a person, and the pseudo-terminal run opens a pseudo-terminal of its own rather than needing an interactive one. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `cargo fmt --manifest-path crates/bots-tui/Cargo.toml --check` exits 0 and `cargo clippy --manifest-path crates/bots-tui/Cargo.toml --all-targets -- -D warnings` exits 0.
- [ ] `cargo test --manifest-path crates/bots-tui/Cargo.toml` prints `test result: ok` for every target and no `FAILED`.
- [ ] `cargo metadata --manifest-path crates/bots-tui/Cargo.toml --no-deps --format-version 1 | jq -r '.packages[0].license'` prints `MIT`, and `rg -n 'GNU GENERAL PUBLIC LICENSE' crates/bots-tui/src crates/bots-tui/Cargo.toml crates/bots-tui/Cargo.lock` prints nothing, because `README.md` and `design/` name the reference's GPL-3.0 licence by design.
- [ ] `rg -n 'openhuman' crates/bots-tui/src` prints only comment lines, `rg -n 'no code' crates/bots-tui/README.md` prints one line, and every `file:line` pointer in `crates/bots-tui/design/` resolves, proven by the T018 block printing no `DANGLING` line, or naming its skip when `specs/system-skilled-bots/context` is absent.
- [ ] `rg -c '^\| D[1-8] ' specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/006-hardening-and-proof/tasks.md` prints 8, and every row of the Defect Audit table prints its expected output.
- [ ] `cargo test --manifest-path crates/bots-tui/Cargo.toml --release --test pty_smoke` prints `test result: ok. 1 passed` and names `answers_one_item_in_a_pseudo_terminal`, so the release binary answered one item in a pseudo-terminal.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/006-hardening-and-proof --strict` prints `RESULT: PASSED`.
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
| Goal authored | Done | `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/006-hardening-and-proof` prints `RESULT: PASSED` |
| External orchestration waves | Done | `plan.md` section `External orchestration` names five waves over T001 through T033 |
| Defect audit table | Done | `rg -c '^\| D[1-8] ' specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/006-hardening-and-proof/tasks.md` prints 8 |
| Crate scaffolded | Pending | No `crates/bots-tui/` exists yet |
| Gates run | Pending | `cargo fmt --manifest-path crates/bots-tui/Cargo.toml --check` exits 1 on the absent manifest |
| README written | Pending | `ls crates/bots-tui/README.md` prints no such file |
| Hub line added | Pending | `rg -n 'bots ui' .skilled/skills/system-skilled-bots/SKILL.md` prints nothing |
| Clean-room read | Pending | The orchestrator compares the finished guard and the overlay with the openhuman files by eye and records the comparison here, because a copied function would carry neither the `openhuman` string nor the GPL header the greps look for |

### Deviations and findings

| Item | Note |
|------|------|
| The parent's recursive run is not a criterion | `validate.sh --recursive --strict` on the parent fails on the five sibling scaffolds today, so it is the parent's closure step rather than this child's. This child's own `--strict` run is the criterion. |
| The licence grep is one half of the proof | A text match cannot see a paraphrased copy, so the design-pointer check and a human read of the diff sit beside it, and the log records that the three together are the evidence. The grep covers the code and the manifest and searches for the header text, because the README and `design/` name the reference's GPL-3.0 licence by design and a match there is not a failure. |
| The CI job is read, never edited | `002` owns `.github/workflows/bots-runtime.yml`. A job that runs a different gate set is reported to that child and recorded here. |
| The hand proof is the last step, not a criterion | The scripted pseudo-terminal run answers one item without a person, so the answer path is a criterion. The operator's own hand answer is the final acceptance step after this phase, and it is the only step that needs a tty. |
| The pseudo-terminal test has an author | F-049, first alternative taken: T033 and a new wave 2b write `tests/pty_smoke.rs`. It builds a temp skilled tree whose `.skilled/bin/bots.cjs` is a Node shim over the fixture, resolves the binary with `env!("CARGO_BIN_EXE_bots-ui")`, runs under `cargo test --release` and has no skip branch. REQ-022, AC-013 and the risk row follow. Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive. |
| T001 reads the crate as present | F-070: T001 now confirms the crate and the gate set, and the one absent thing it names is the `pty_smoke` target this phase adds, so it agrees with the Definition of Ready. Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive. |
| The prose rules were applied | O-021 and O-022: every semicolon outside code was split into two sentences and every serial comma before a final `and` was dropped, across this child's documents. Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive. |
<!-- /ANCHOR:log -->
