---
title: "Acceptance Criteria: Fan-out Merge Under-count and Per-Iteration Steering"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "fanout merge and steering fixes acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/015-fanout-merge-and-steering-fixes"
    last_updated_at: "2026-09-27T21:00:00Z"
    last_updated_by: "closure-leaf"
    recent_action: "Marked all seven criteria Met from the build evidence"
    next_safe_action: "None; the orchestrator commits the phase docs"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/015-fanout-merge-and-steering-fixes/spec.md"
      - ".skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs"
      - ".skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-workflow-integration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Fan-out Merge Under-count and Per-Iteration Steering

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** cli-jev/003-cli-jev-workflow-integration/015-fanout-merge-and-steering-fixes
**Level:** 2
**Status:** Complete
**Date:** 2026-09-27
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the current `fanout-merge.cjs`, When the replay command below runs before any code change, Then it reproduces the recorded shortfall and the diagnosis table is written | The replay command prints `001-deep-research 85 0`, `004-deep-research-expansion 74 0` and `007-classifier-deep-research 65 0`. `implementation-summary.md` holds one table row per lineage per round with registry count, count-only sum and unmatched iterations Observed: the loop with the `6f47c32dce` script printed `001-deep-research 85 0`, `004-deep-research-expansion 74 0` and `007-classifier-deep-research 65 0`, each merge exit 0. The per-lineage table is in `implementation-summary.md` | Met | - |
| AC-002 | REQ-002 | Given a lineage registry with 8 findings and count-only iteration records summing to more, When the merge runs, Then that lineage is reconstructed | `npx vitest run --no-coverage tests/unit/fanout-merge.vitest.ts -t "short registry"` run from `.skilled/skills/system-deep-loop/runtime` exits 0, and the same test fails on the pre-fix code Observed: the `-t "short registry"` run printed `Tests 2 passed` with `57 skipped (59)`, exit 0. The filter matches 2 titles, because the AC-004 test title also holds the phrase. With the `6f47c32dce` script swapped in, both failed (`Tests 2 failed`, exit 1) | Met | - |
| AC-003 | REQ-003 | Given iterations whose only matching evidence is delta `finding` records, When the merge reconstructs, Then the rebuilt findings carry the delta record text | The AC-002 test asserts the merged `keyFindings` titles equal the copied delta `label` values and exits 0 Observed: "rebuilds a short registry from delta finding records" asserts exit 0, no `reconstruction_warnings`, `keyFindings` titles equal to the 11 copied delta `label` values, `sourceFindings` 11 and `reconstructionGaps` 0, and passed in the AC-002 run | Met | - |
| AC-004 | REQ-004 | Given a lineage where no iteration's count matches any source, When the merge runs, Then it keeps the registry, emits no `lineage_reconstruction_failed` for that lineage and reports the counted gap | `npx vitest run --no-coverage tests/unit/fanout-merge.vitest.ts -t "no iteration matches"` exits 0, asserting `reconstructionGaps` equals the count-only sum minus the registry count Observed: the `-t "no iteration matches"` run printed `Tests 1 passed` with `58 skipped (59)`. The test asserts exit 0, no `reconstruction_warnings` and `reconstructionGaps` 12 (15 counted minus 3 kept). The final full suite, which holds it, exited 0 | Met | - |
| AC-005 | REQ-005 | Given the fix, When the merge test file runs in full, Then the new tests and every existing test pass | `npx vitest run --no-coverage tests/unit/fanout-merge.vitest.ts` exits 0 with the T002 baseline count plus the new tests passed and 0 failed Observed at `7de30fb16f`: the file run alone printed `Test Files 1 passed (1)`, `Tests 61 passed (61)`, exit 0. The baseline is 57: `grep -cE '^\s*it\('` over the file at `6f47c32dce` prints 57, with no skip or todo, so 61 is 57 plus the 4 new tests with 0 failed | Met | - |
| AC-006 | REQ-006 | Given a CLI lineage, When `buildLoopPrompt` builds its prompt, Then the prompt names `<lineageDir>/steer.md` by absolute path with conditional wording | `npx vitest run --no-coverage tests/unit/fanout-run.vitest.ts -t "steer.md"` exits 0, asserting the absolute path and the words "when it exists" Observed at `7de30fb16f`: `Tests 1 passed` with `153 skipped (154)`, exit 0. The test asserts the prompt contains `Before each iteration, read <absolute steer.md path> when it exists.` and that a native lineage's prompt does not | Met | - |
| AC-007 | REQ-007 | Given the fixed merge, When the replay command runs again, Then round 1 rebuilds every count-only finding and rounds 2 and 3 name the rest as a gap, with no committed file changed | The replay prints round 1 `sourceFindings` at least 112 with gap 0, rounds 2 and 3 above 74 and 65 with gaps equal to the AC-001 table's unmatched totals, and `git status --short -- 'specs/cli-jev/003-cli-jev-workflow-integration/*/research'` prints nothing Observed: the final replay printed `001-deep-research 134 0`, `004-deep-research-expansion 105 13` and `007-classifier-deep-research 168 38`, each merge exit 0. The gaps equal the table's unmatched totals, 13 and 38. The `git status` command printed nothing | Met | - |

### Replay command

Run it from the worktree root. It copies each round's lineages to a temp directory, merges there and prints the round, `sourceFindings` and `reconstructionGaps`.

```bash
for r in 001-deep-research 004-deep-research-expansion 007-classifier-deep-research
do
  t=$(mktemp -d)
  cp -R "specs/cli-jev/003-cli-jev-workflow-integration/$r/research/lineages" "$t/"
  node .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs --loop-type research --artifact-dir "$t" > /dev/null
  node -p '[process.argv[2], require(process.argv[1]).metrics.sourceFindings, require(process.argv[1]).metrics.reconstructionGaps].join(" ")' "$t/findings-registry.json" "$r"
  rm -rf "$t"
done
```

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

All seven criteria are Met from the orchestrator's observed output on 2026-09-27, with the fix in `7de30fb16f`. AC-005 and AC-006 each rest on their own command run at `7de30fb16f`, exit 0.
<!-- /ANCHOR:closure -->
