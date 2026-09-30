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
    open_questions: []
    answered_questions:
      - "Score-0 miss shape: option C with the AGENTS.md edit (operator, 2026-09-27)"
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
**Status:** Complete
**Date:** 2026-09-27
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

Commands run from the worktree root. `G` is `.skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs`, `L` is `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs`, `$SCRATCH` is a directory outside the repository and `$ARCHIVE` holds `git archive HEAD | tar -x -C $ARCHIVE`.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the two model-card entries in `IGNORED_PATHS`, When the generator runs over the worktree with every output in scratch, Then it publishes, and both cards still appear in diagnostics marked ignored | `node $G --out $SCRATCH/idx.json --manifest $SCRATCH/man.json --diagnostics $SCRATCH/diag.json --variants $SCRATCH/var.json` exits 0 and prints `ignored malformed : 2`. `grep -c 'MODEL_CARD_' .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs` prints `2`. In `$SCRATCH/diag.json`, 2 rows have `ignored: true` and a path ending `MODEL_CARD_08B.md` or `MODEL_CARD_9B.md`. Observed 2026-09-27: exit 0 with `ignored malformed : 2`, `grep -c` printed `2`, and the two card rows carry `ignored: true` | Met | - |
| AC-002 | REQ-002 | Given the index regenerated from a `git archive` of HEAD, When the committed index is queried and compared with a fresh build, Then the Deem context doc is an exact hit and no path differs | `node $L --no-index-hash -- "deem local server"` prints `1.000  exact` on `specs/cli-jev/003-cli-jev-workflow-integration/007-classifier-deep-research/context/deem-local.md`. `node $G --check --repo-root $ARCHIVE` exits 0 and reports 0 missing and 0 obsolete paths Observed 2026-09-27 on index commit `92eda999e6`: the lookup prints `1.000  exact` on `deem-local.md`, exit 0, and `--check --repo-root` over a fresh archive of that HEAD exits 0 with `stale documents : 0 (0 missing from the index)` and `obsolete paths : 0`. | Met | - |
| AC-003 | REQ-003 | Given the save-time comparison moved into one shared helper and the measured lookup p95 and walk p95, When `--check` is built on that helper and the placement rule PD-4 is applied, Then the save check behaves as before, `--check` reports whole-index freshness without writing and the verdict is recorded | `workflow-trigger-index-freshness.vitest.ts` passes 7 of 7, and `grep -c 'freshness.mjs' .skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts` prints at least `1`. `implementation-summary.md` records the cold-lookup `summary.p95Ms` from `measure-cold-lookup.mjs --out $SCRATCH/latency.json --json`, the path-only walk p95 and the PD-4 verdict. `node $G --check --repo-root $ARCHIVE` exits 0, `node $G --check --bogus` exits 2 and the new vitest stale case exits 1. Observed so far, 2026-09-27: 7 of 7 with the save calling the helper, `grep -c 'freshness.mjs' core/workflow.ts` prints `1`, lookup p95 92.087 ms and walk p95 1,751.1 ms recorded with the CI verdict, `--check --bogus` exit 2, and the vitest stale case exit 1. Open: `--check --repo-root $ARCHIVE` runs after the regeneration commit Closed 2026-09-27: `--check --repo-root` over a fresh archive of `92eda999e6` exits 0. | Met | - |
| AC-004 | REQ-004 | Given a build with only `--out` set to a scratch path, When it runs on a trusted corpus and on a refused one, Then its sidecars land beside `--out` and no tracked file changes | `node $G --out $SCRATCH/idx.json` then `ls $SCRATCH` lists `corpus-manifest.json`, `generation-diagnostics.json` and `phrase-variants.json`, and `git status --short .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures .skilled/skills/system-spec-kit/runtime/data` prints nothing. The two new sidecar cases in `trigger-index.vitest.ts` pass. Observed 2026-09-27: exit 0, the three sidecars listed beside `idx.json`, `git status --short` on both paths printed nothing, and the two sidecar cases pass | Met | - |
| AC-005 | REQ-005 | Given the owner chose option C with the `AGENTS.md` edit on 2026-09-27, When the build closes, Then the decision is recorded with every option and its cost, and the lookup's default output is unchanged | `spec.md` section 10 lists options A to D, each with its cost, and records option C as decided. `node $L --json --no-index-hash -- "classifier marmalade hub"` still returns 20 rows at score 0 with `truncated: true` and exit 0, and the partial-row tests in `trigger-index.vitest.ts` pass unedited. Observed 2026-09-27 on `92eda999e6` with the amended probe: section 10 lists A to D with costs and records C as decided, the default lookup returned 20 rows, 0 scoring, `truncated: true`, exit 0, and the partial-row tests pass unedited. The probe changed from "cli-classifier hub" because the rebuild indexed phase 008, which declares that phrase. | Met | - |
| AC-006 | REQ-006 | Given the opt-in `--scoring-only` flag and the Gate 1 line that passes it, When a prompt scores and when it misses, Then only scoring rows come back with exit 0, a miss comes back empty with exit 1, and every generated pointer block follows the root line | `node $L --json --no-index-hash --scoring-only -- "classifier marmalade hub"` prints no rows and exits 1. The three new `--scoring-only` cases in `trigger-index.vitest.ts` pass. `git diff AGENTS.md` changes only the Gate 1 line. `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-gate1-pointers.cjs --check` exits 0 and `gate1-pointer-sync.vitest.ts` passes. Observed 2026-09-27 on `92eda999e6` with the amended probe: `--scoring-only` returned 0 rows with exit 1, the three cases pass, `git diff AGENTS.md` at stage A showed only the Gate 1 line, the pointer `--check` exits 0 and `gate1-pointer-sync.vitest.ts` 4 passed. | Met | - |

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

All six criteria are met. AC-005 and AC-006 close on the amended probe, "classifier marmalade hub", which the operator approved on 2026-09-27 after the rebuild made the old probe a hit.
<!-- /ANCHOR:closure -->
