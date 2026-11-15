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
    last_updated_at: "2026-11-14T22:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Marked every criterion with evidence"
    next_safe_action: "Phase 011 adds the goal bridge"
    blockers: []
    key_files:
      - ".skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mistral-vibe-plans-2026-11-14"
      parent_session_id: null
    completion_pct: 100
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
**Status:** Complete
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a deep-loop config of kind `cli-mistral-vibe`, When it carries `reasoningEffort` or `sandboxMode`, Then parsing rejects it, and a config with only `model` and `timeoutSeconds` parses | Observed 2026-11-14: `executor-config.vitest.ts` cases at lines 96, 109 and 118 pass in the 382-pass run | Met | - |
| AC-002 | REQ-002 | Given `VIBE_SUPPORTED_MODELS`, When `isVibeSupportedModel` gets each listed alias and one unlisted alias, Then it returns `true` for each listed alias and `false` for the other, and every listed alias has a model row with `thinking` set | Observed 2026-11-14: `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts:1111` passes; `.vibe/config.toml` rows `deepseek-flash` and `glm-flash` both carry `thinking = "max"` | Met | - |
| AC-003 | REQ-003 | Given a shimmed `vibe`, When `buildVibeLineageCommand` builds a lineage, Then the command holds a lineage-local `VIBE_HOME`, `--output-dir` inside the lineage folder and `--trust`, and a missing binary, a version other than 3.1.2 or an off-roster alias throws | Observed 2026-11-14: `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:2201` and `:2213` (absent binary, wrong version) and `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts:118` (off-roster alias) pass. T020: `evaluateDispatch` returns `[]` for the real built command once the runner's closed empty stdin is written as `</dev/null` (see goal.md deviations) | Met | - |
| AC-004 | REQ-004 | Given a parent env with `MISTRAL_API_KEY`, a `VIBE_`-prefixed variable and `OPENAI_API_KEY`, When the env is filtered for a Vibe lineage, Then the first two pass and `OPENAI_API_KEY` does not | Observed 2026-11-14: `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-audit.vitest.ts:1118` ("passes the provider key and Vibe variables but never an inherited VIBE_HOME") passes | Met | - |
| AC-005 | REQ-004 | Given a parent env with `VIBE_HOME=~/.vibe`, When a Vibe lineage launches, Then the child's `VIBE_HOME` is the lineage's own folder | Observed 2026-11-14: `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-audit.vitest.ts:1118` and `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:2314` ("gives two Vibe replicas distinct state dirs and their own VIBE_HOME") pass | Met | - |
| AC-006 | REQ-005 | Given an ancestor command line naming `vibe` or `vibe-rs`, When `detectFromAncestry('cli-mistral-vibe', ...)` runs, Then it returns `true` for both | Observed 2026-11-14: `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-audit.vitest.ts:459` ("detectFromAncestry matches any Vibe binary name and no lookalike") passes; the binary table lists `vibe`, `vibe-rs` and `vibe-app-server` | Met | - |
| AC-007 | REQ-006 | Given Vibe exits 3 and `export.json` records `exit_code` 3, When the runner records the lineage, Then its per-lineage outcome is partial and it is not counted as succeeded | Observed 2026-11-14: `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:2252` and `:2268`, and the stress shim cases in `cli-mistral-vibe.vitest.ts` (155 to 230) pass | Met | - |
| AC-008 | REQ-006 | Given the recursion guard refuses a launch with its exit 3, When the runner scores the lineage, Then no `export.json` exists and the lineage records failure, not partial | Observed 2026-11-14: `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:2259` ("scores a missing export as failure for both exit 3 and exit 0") passes | Met | - |
| AC-009 | REQ-007 | Given `MISTRAL_API_KEY` is exported, When a fan-out run launches one `cli-mistral-vibe` research lineage beside a second executor group, Then the Vibe lineage writes its iteration file and its `export.json` has `exit_code` 0 | Observed: `research/keyed-lineage-run/lineages/vibe-1/vibe-output/export.json` has `exit_code` 0 and the lineage wrote `iterations/iteration-001.md`, beside the `oc-1` group | Met | - |
| AC-010 | REQ-008 | Given the stress suite, When it runs, Then `cli-mistral-vibe.vitest.ts` passes and `live-contracts.json` and `matrix-manifest.ts` name the kind | Observed 2026-11-14: stress suite `9 passed (9)`, `175 passed, 9 skipped`; `rg -c` prints 1 for `live-contracts.json` and 2 for `matrix-manifest.ts`, equal to `cli-deepseek-harness` | Met | - |
| AC-011 | REQ-009 | Given both deep-loop YAMLs, When a single-executor run names `cli-mistral-vibe`, Then the `if_cli_mistral_vibe` branch refuses it and points to fan-out | Observed 2026-11-14: one line per file, `.skilled/commands/deep/assets/deep-research-auto.yaml:1223` and `.skilled/commands/deep/assets/deep-review-auto.yaml:1252` | Met | - |
| AC-012 | REQ-010 | Given the T001 baseline of 365, When the three executor unit suites run, Then they print zero failures and more than 365 passes, and no existing case was edited | Superseded 2026-11-14: `git diff --cached -U0` shows three removed lines in `executor-config.vitest.ts`, both edited cases forced by the new kind. AC-013 carries the intent | Superseded | ADR-001 |
| AC-013 | REQ-010 | Given the T001 baseline of 365, When the three executor unit suites run, Then they print zero failures and more than 365 passes, and the only edited existing cases are the kind count and the web-search matrix model id, both forced by the new kind | Observed 2026-11-14: `Tests  382 passed (382)`; `git diff --cached -U0` removes lines only in those two cases of `executor-config.vitest.ts` | Met | - |

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

**Closeable:** Yes

AC-001 to AC-011 and AC-013 are Met. AC-012 is Superseded by ADR-001, because the new kind forced edits to two existing cases.
<!-- /ANCHOR:closure -->
