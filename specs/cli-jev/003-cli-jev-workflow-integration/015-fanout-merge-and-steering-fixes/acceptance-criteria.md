---
title: "Acceptance Criteria: Fan-out Merge Under-count and Per-Iteration Steering"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/015-fanout-merge-and-steering-fixes"
    last_updated_at: "2026-09-27T14:30:00Z"
    last_updated_by: "authoring-leaf"
    recent_action: "Authored the acceptance criteria for the merge fix and the steering line"
    next_safe_action: "Run the diagnosis replay and record the table before any code change"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/015-fanout-merge-and-steering-fixes/spec.md"
      - ".skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs"
      - ".skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-workflow-integration"
      parent_session_id: null
    completion_pct: 0
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
**Status:** Planned
**Date:** 2026-09-27
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the current `fanout-merge.cjs`, When the replay command below runs before any code change, Then it reproduces the recorded shortfall and the diagnosis table is written | The replay command prints `001-deep-research 85 0`, `004-deep-research-expansion 74 0` and `007-classifier-deep-research 65 0`. `implementation-summary.md` holds one table row per lineage per round with registry count, count-only sum and unmatched iterations | Unmet | - |
| AC-002 | REQ-002 | Given a lineage registry with 8 findings and count-only iteration records summing to more, When the merge runs, Then that lineage is reconstructed | `npx vitest run --no-coverage tests/unit/fanout-merge.vitest.ts -t "short registry"` run from `.skilled/skills/system-deep-loop/runtime` exits 0, and the same test fails on the pre-fix code | Unmet | - |
| AC-003 | REQ-003 | Given iterations whose only matching evidence is delta `finding` records, When the merge reconstructs, Then the rebuilt findings carry the delta record text | The AC-002 test asserts the merged `keyFindings` titles equal the copied delta `label` values and exits 0 | Unmet | - |
| AC-004 | REQ-004 | Given a lineage where no iteration's count matches any source, When the merge runs, Then it keeps the registry, emits no `lineage_reconstruction_failed` for that lineage and reports the counted gap | `npx vitest run --no-coverage tests/unit/fanout-merge.vitest.ts -t "no iteration matches"` exits 0, asserting `reconstructionGaps` equals the count-only sum minus the registry count | Unmet | - |
| AC-005 | REQ-005 | Given the fix, When the merge test file runs in full, Then the new tests and every existing test pass | `npx vitest run --no-coverage tests/unit/fanout-merge.vitest.ts` exits 0 with the T002 baseline count plus the new tests passed and 0 failed | Unmet | - |
| AC-006 | REQ-006 | Given a CLI lineage, When `buildLoopPrompt` builds its prompt, Then the prompt names `<lineageDir>/steer.md` by absolute path with conditional wording | `npx vitest run --no-coverage tests/unit/fanout-run.vitest.ts -t "steer.md"` exits 0, asserting the absolute path and the words "when it exists" | Unmet | - |
| AC-007 | REQ-007 | Given the fixed merge, When the replay command runs again, Then round 1 rebuilds every count-only finding and rounds 2 and 3 name the rest as a gap, with no committed file changed | The replay prints round 1 `sourceFindings` at least 112 with gap 0, rounds 2 and 3 above 74 and 65 with gaps equal to the AC-001 table's unmatched totals, and `git status --short -- 'specs/cli-jev/003-cli-jev-workflow-integration/*/research'` prints nothing | Unmet | - |

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

**Closeable:** No

The phase is Planned and nothing is built. Every criterion is Unmet until the build records observed output against it.
<!-- /ANCHOR:closure -->
