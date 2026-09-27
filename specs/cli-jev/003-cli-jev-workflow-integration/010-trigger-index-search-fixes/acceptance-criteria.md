---
title: "Acceptance Criteria: Trigger Index Rebuild, Freshness and Build Isolation"
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
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/010-trigger-index-search-fixes"
    last_updated_at: "2026-09-27T12:30:00Z"
    last_updated_by: "authoring-leaf"
    recent_action: "Authored one criterion per requirement, each with a command and its expected output"
    next_safe_action: "Run T001 to reproduce the refused rebuild"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/010-trigger-index-search-fixes/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/010-trigger-index-search-fixes/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-workflow-integration"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Which score-0 miss shape does the system-spec-kit owner want (spec.md section 10)"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Trigger Index Rebuild, Freshness and Build Isolation

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** cli-jev/003-cli-jev-workflow-integration/010-trigger-index-search-fixes
**Level:** 2
**Status:** Planned
**Date:** 2026-09-27
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

Commands run from the worktree root. `G` is `.skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs`, `L` is `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs`, `$SCRATCH` is a directory outside the repository and `$ARCHIVE` holds `git archive HEAD | tar -x -C $ARCHIVE`.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the two model-card entries in `IGNORED_PATHS`, When the generator runs over the worktree with every output in scratch, Then it publishes, and both cards still appear in diagnostics marked ignored | `node $G --out $SCRATCH/idx.json --manifest $SCRATCH/man.json --diagnostics $SCRATCH/diag.json --variants $SCRATCH/var.json` exits 0 and prints `ignored malformed : 2`. `grep -c 'MODEL_CARD_' .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs` prints `2`. In `$SCRATCH/diag.json`, 2 rows have `ignored: true` and a path ending `MODEL_CARD_08B.md` or `MODEL_CARD_9B.md` | Unmet | - |
| AC-002 | REQ-002 | Given the index regenerated from a `git archive` of HEAD, When the committed index is queried and compared with a fresh build, Then the Deem context doc is an exact hit and no path differs | `node $L --no-index-hash -- "deem local server"` prints `1.000  exact` on `specs/cli-jev/003-cli-jev-workflow-integration/007-classifier-deep-research/context/deem-local.md`. `node $G --check --repo-root $ARCHIVE` exits 0 and reports 0 missing and 0 obsolete paths | Unmet | - |
| AC-003 | REQ-003 | Given the save-time comparison moved into one shared helper and the measured lookup p95 and walk p95, When `--check` is built on that helper and the placement rule PD-4 is applied, Then the save check behaves as before, `--check` reports whole-index freshness without writing and the verdict is recorded | `workflow-trigger-index-freshness.vitest.ts` passes 7 of 7, and `grep -c 'freshness.mjs' .skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts` prints at least `1`. `implementation-summary.md` records the cold-lookup `summary.p95Ms` from `measure-cold-lookup.mjs --out $SCRATCH/latency.json --json`, the path-only walk p95 and the PD-4 verdict. `node $G --check --repo-root $ARCHIVE` exits 0, `node $G --check --bogus` exits 2 and the new vitest stale case exits 1 | Unmet | - |
| AC-004 | REQ-004 | Given a build with only `--out` set to a scratch path, When it runs on a trusted corpus and on a refused one, Then its sidecars land beside `--out` and no tracked file changes | `node $G --out $SCRATCH/idx.json` then `ls $SCRATCH` lists `corpus-manifest.json`, `generation-diagnostics.json` and `phrase-variants.json`, and `git status --short .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures .skilled/skills/system-spec-kit/runtime/data` prints nothing. The two new sidecar cases in `trigger-index.vitest.ts` pass | Unmet | - |
| AC-005 | REQ-005 | Given the owner has not said yes to a change, When the build closes, Then the miss shape is recorded with its options and the lookup's default output is unchanged | `spec.md` section 10 lists options A to D, each with its cost. `node $L --json --no-index-hash -- "cli-classifier hub"` still returns 20 rows at score 0 with `truncated: true` and exit 0, and `git diff` on `lookup-trigger-index.mjs` over the build's commits is empty unless `goal.md`'s log records the owner's yes | Unmet | - |

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

The phase is Planned. No criterion is met yet, and none is waived.
<!-- /ANCHOR:closure -->
