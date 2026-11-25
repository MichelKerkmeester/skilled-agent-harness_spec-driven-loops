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
    last_updated_at: "2026-11-25T21:20:29Z"
    last_updated_by: "review-fix-pass"
    recent_action: "Applied the ui-review-1 findings that edit this child"
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
| D3 | The `bots-tui` CI job belongs to `002-architecture-and-contracts`. This phase reads it and reports a mismatch; it never edits `.github/workflows/bots-runtime.yml`. |
| D4 | The hand proof and the closed-input test belong to `005-answer-flow`. Every criterion here runs without a tty. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `cargo fmt --manifest-path crates/bots-tui/Cargo.toml --check` exits 0 and `cargo clippy --manifest-path crates/bots-tui/Cargo.toml --all-targets -- -D warnings` exits 0.
- [ ] `cargo test --manifest-path crates/bots-tui/Cargo.toml` prints `test result: ok` for every target and no `FAILED`.
- [ ] `cargo metadata --manifest-path crates/bots-tui/Cargo.toml --no-deps --format-version 1 | jq -r '.packages[0].license'` prints `MIT`, and `rg -n 'GNU GENERAL PUBLIC LICENSE' crates/bots-tui/src crates/bots-tui/Cargo.toml crates/bots-tui/Cargo.lock` prints nothing, because `README.md` and `design/` name the reference's GPL-3.0 licence by design.
- [ ] `rg -n 'openhuman' crates/bots-tui/src` prints only comment lines, `rg -n 'no code' crates/bots-tui/README.md` prints one line, and every `file:line` pointer in `crates/bots-tui/design/` resolves, proven by the loop in `tasks.md` T018 printing nothing.
- [ ] `rg -c '^\| D[1-8] ' specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/006-hardening-and-proof/tasks.md` prints 8, and every row of the Defect Audit table prints its expected output.
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
| External orchestration waves | Done | `plan.md` section `External orchestration` names four waves over T001 through T020 |
| Defect audit table | Done | `rg -c '^\| D[1-8] ' specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/006-hardening-and-proof/tasks.md` prints 8 |
| Crate scaffolded | Pending | No `crates/bots-tui/` exists yet |
| Gates run | Pending | `cargo fmt --manifest-path crates/bots-tui/Cargo.toml --check` exits 1 on the absent manifest |
| README written | Pending | `ls crates/bots-tui/README.md` prints no such file |
| Hub line added | Pending | `rg -n 'bots ui' .skilled/skills/system-skilled-bots/SKILL.md` prints nothing |

### Deviations and findings

| Item | Note |
|------|------|
| The parent's recursive run is not a criterion | `validate.sh --recursive --strict` on the parent fails on the five sibling scaffolds today, so it is the parent's closure step rather than this child's. This child's own `--strict` run is the criterion. |
| The licence grep is one half of the proof | A text match cannot see a paraphrased copy, so the design-pointer check and a human read of the diff sit beside it, and the log records that the three together are the evidence. The grep covers the code and the manifest and searches for the header text, because the README and `design/` name the reference's GPL-3.0 licence by design and a match there is not a failure. |
| The CI job is read, never edited | `002` owns `.github/workflows/bots-runtime.yml`. A job that runs a different gate set is reported to that child and recorded here. |
| The hand proof is not a criterion | `005` answers one item from the overlay by hand, so it needs a tty and stays the operator's step. Every criterion above runs without one. |
<!-- /ANCHOR:log -->
