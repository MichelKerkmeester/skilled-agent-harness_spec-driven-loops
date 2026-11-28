---
title: "Goal: Phase 12: folder-architecture"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "folder architecture goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/012-folder-architecture"
    last_updated_at: "2026-11-28T11:26:17Z"
    last_updated_by: "goal-author"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-012-folder-architecture"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 12: folder-architecture

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give every `.skilled` path the parity build touched a clearer folder and file architecture with less unneeded nesting, moving only what a measured move map gives a reason for and changing no behavior.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The phase opens only after 011.007, 010.003 and every runtime unit have merged, and its move map reads the tree measured then. |
| D2 | A move lands only as a row in `scratch/move-map.md` with a reason, through `git mv`, with every reference to the old path rewritten in the same commit. |
| D3 | No behavior changes. A move that needs a test assertion, an output or a record shape to change is a keep row. |
| D4 | The hub root keeps the folders `parent-skill-check.cjs` and the mode registry fix, so no move adds a `crates` folder or moves a mode packet. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `git diff -M --diff-filter=D --name-only $BASE HEAD -- .skilled` prints nothing, where `BASE` is the commit `scratch/tree-baseline.md` records.
- [ ] `npm --prefix .skilled/skills/system-skilled-bots/runtime test` prints a `Tests` line with no `failed`, and `npm --prefix .skilled/skills/system-skilled-bots/runtime run typecheck` exits 0.
- [ ] `cargo test --locked --manifest-path .skilled/crates/bots-tui/Cargo.toml` prints `test result: ok` for every target, and `cargo clippy --locked --manifest-path .skilled/crates/bots-tui/Cargo.toml --all-targets -- -D warnings` and `cargo fmt --check --manifest-path .skilled/crates/bots-tui/Cargo.toml` both exit 0.
- [ ] `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package system-skilled-bots` prints `PASS` with `scenarios=58` and `violations=0`.
- [ ] `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/system-skilled-bots` prints `OK: parent-skill-check`, and `bash .github/scripts/check-gate-inputs.sh` prints `RESULT: PASSED`.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/012-folder-architecture --strict` prints `RESULT: PASSED`.
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
| Phase added by the operator | Done | The operator added the phase on 2026-11-28, numbered it 012 and shifted the closing phases to 013, 014 and 015 |
| Goal authored | Done | `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/system-skilled-bots/003-openbot-parity-build/012-folder-architecture` passes |
| Tree measured | Pending | T001 runs once 011.007, 010.003 and every runtime unit have merged |

### Deviations and findings

| Item | Note |
|------|------|
| The numbers in `spec.md` are a snapshot | The 365 files and 123 one-file folders were measured on 2026-11-28, before 011.005 to 011.007 and 010.003 added theirs. The move map reads T001's measure, not these. |
<!-- /ANCHOR:log -->
