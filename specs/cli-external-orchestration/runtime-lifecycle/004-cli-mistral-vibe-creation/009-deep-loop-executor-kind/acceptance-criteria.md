---
title: "Acceptance Criteria: Phase 9: deep-loop-executor-kind"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "deep loop executor kind acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/009-deep-loop-executor-kind"
    last_updated_at: "2026-11-14T14:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the acceptance criteria for the cli-mistral-vibe executor kind"
    next_safe_action: "Meet the criteria in task order once phase 007 lands"
    blockers:
      - "MISTRAL_API_KEY is unset, so AC-009 cannot be met"
    key_files:
      - ".skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mistral-vibe-plans-2026-11-14"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 9: deep-loop-executor-kind

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/009-deep-loop-executor-kind
**Level:** 2
**Status:** Planned
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a deep-loop config of kind `cli-mistral-vibe`, When it carries `reasoningEffort` or `sandboxMode`, Then parsing rejects it, and a config with only `model` and `timeoutSeconds` parses | New case in `tests/unit/executor-config.vitest.ts` (T006) | Unmet | - |
| AC-002 | REQ-002 | Given `VIBE_SUPPORTED_MODELS`, When `isVibeSupportedModel` gets each listed alias and one unlisted alias, Then it returns `true` for each listed alias and `false` for the other, and every listed alias has a model row with `thinking` set | New case in `tests/unit/executor-config.vitest.ts` and the T003 read of the model rows | Unmet | - |
| AC-003 | REQ-003 | Given a shimmed `vibe`, When `buildVibeLineageCommand` builds a lineage, Then the command holds a lineage-local `VIBE_HOME`, `--output-dir` inside the lineage folder and `--trust`, and a missing binary, a version other than 3.1.2 or an off-roster alias throws | New cases in `tests/unit/fanout-run.vitest.ts` (T010), and T020's preflight run returning `[]` | Unmet | - |
| AC-004 | REQ-004 | Given a parent env with `MISTRAL_API_KEY`, a `VIBE_`-prefixed variable and `OPENAI_API_KEY`, When the env is filtered for a Vibe lineage, Then the first two pass and `OPENAI_API_KEY` does not | New case in `tests/unit/executor-audit.vitest.ts` (T009) | Unmet | - |
| AC-005 | REQ-004 | Given a parent env with `VIBE_HOME=~/.vibe`, When a Vibe lineage launches, Then the child's `VIBE_HOME` is the lineage's own folder | New case in `tests/unit/executor-audit.vitest.ts` (T009) | Unmet | - |
| AC-006 | REQ-005 | Given an ancestor command line naming `vibe` or `vibe-rs`, When `detectFromAncestry('cli-mistral-vibe', ...)` runs, Then it returns `true` for both | New case in `tests/unit/executor-audit.vitest.ts` (T008) | Unmet | - |
| AC-007 | REQ-006 | Given Vibe exits 3 and `export.json` records `exit_code` 3, When the runner records the lineage, Then its per-lineage outcome is partial and it is not counted as succeeded | New case in `tests/unit/fanout-run.vitest.ts` (T011) and the exit 3 shim case in the stress fixture (T013, T019) | Unmet | - |
| AC-008 | REQ-006 | Given the recursion guard refuses a launch with its exit 3, When the runner scores the lineage, Then no `export.json` exists and the lineage records failure, not partial | New case in `tests/unit/fanout-run.vitest.ts` (T011) | Unmet | - |
| AC-009 | REQ-007 | Given `MISTRAL_API_KEY` is exported, When a fan-out run launches one `cli-mistral-vibe` research lineage beside a second executor group, Then the Vibe lineage writes its iteration file and its `export.json` has `exit_code` 0 | The T021 run's `export.json`, quoted in goal.md section 4 | Unmet | - |
| AC-010 | REQ-008 | Given the stress suite, When it runs, Then `cli-mistral-vibe.vitest.ts` passes and `live-contracts.json` and `matrix-manifest.ts` name the kind | `npx --no-install vitest run --no-coverage tests/stress/cli-adapter` (T019) | Unmet | - |
| AC-011 | REQ-009 | Given both deep-loop YAMLs, When a single-executor run names `cli-mistral-vibe`, Then the `if_cli_mistral_vibe` branch refuses it and points to fan-out | `rg -n 'if_cli_mistral_vibe' .skilled/commands/deep/assets/*.yaml` prints one line per file (T016, T017) | Unmet | - |
| AC-012 | REQ-010 | Given the T001 baseline of 365, When the three executor unit suites run, Then they print zero failures and more than 365 passes, and no existing case was edited | T018 output and `git diff -U0` on the three test files showing no removed line | Unmet | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** No

Nothing is built yet, and AC-009 also waits on `MISTRAL_API_KEY`.
<!-- /ANCHOR:closure -->
