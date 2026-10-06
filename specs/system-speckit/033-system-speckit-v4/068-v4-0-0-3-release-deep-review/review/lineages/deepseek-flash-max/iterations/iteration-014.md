---
title: "Deep Review Iteration 014 — broadening: citation re-verification, comment hygiene, coverage honesty"
trigger_phrases: []
---

# Iteration 14: Maintainability — broadened re-verification and hygiene sweep

## Focus

Dimension: **maintainability** (broadening pass). Work: re-verify every carried finding's citation
against the current tree, correct anything that drifted, sweep the range's added code comments for
this repository's comment-hygiene rule, and state the slices this lineage did not reach so the
synthesis can carry an honest coverage matrix.

## Files Reviewed

- Re-read anchors for F001-F008 (files and lines listed in the re-verification table below)
- `git diff -U0 v4.0.0.2..v4.0.0.3` over the four focus areas filtered to code extensions (778 changed code files), swept for added comment lines carrying ephemeral labels or spec paths, with a matcher control
- `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:384-390` (F003 citation correction)
- `.skilled/skills/system-spec-kit/runtime/cli/tests/check-source-tags.vitest.ts:43-44` (the sweep's only near-match)

## Findings

### P0 Findings

None.

### P1 Findings

None new. Carried: F001 and F002 remain active (unchanged).

### P2 Findings

None new. Carried F003-F008. One refinement to F003's citation, documented below; the finding
itself is unchanged.

## Citation Re-Verification

| Finding | Cited anchor | Re-verified | Result |
|---------|--------------|-------------|--------|
| F001 | `fanout-salvage.cjs:170` | line still reads `mergeJsonlUnderLock(stateLogPath, [eventRecord]);` | exact |
| F002 | `loop-lock.ts:298` | line still opens `function tryReclaimStaleLoopLock(...)` | exact |
| F003 | `validate.sh:385` | **refined** — 385 is the enclosing `if ! $CHILD_MANIFEST_ACTIVE` guard; the predicate is 386-387 and the `continue` is 388 | corrected to `validate.sh:386-388`; finding unchanged |
| F004 | `trigger-index.json` vs `v4.0.0.3.md` | checker re-run earlier this run: exits 1, changelog stale | exact (executed) |
| F005 | `completion-evidence-sentinel.cjs:318` | NUL byte still at offset 16206 on line 318; `rubric-guard.cjs:59` unchanged | exact |
| F006 | `graph-metadata.json` derived fingerprint | checker still resolves the folder to `error` | exact (executed) |
| F007 | `SKILL.md:392` + `deep-review-auto.yaml:2322-2325` | both sides re-read; the YAML range covers step, action, edit and `set_field: { status: "complete" }` | exact |
| F008 | `fanout-salvage-recovery.md:52` + eight siblings | path resolution and missing directory re-confirmed; named tests still present | exact |

## Claim Adjudication

No new P0/P1. F003's line-number correction is a refinement recorded here; the four deltas already written keep their original citations (delta files are write-once), and this iteration plus the strategy carry the corrected anchor for the synthesis.

## Ruled Out

- "The range's added code comments embed ephemeral labels or spec paths": ruled out — a delta-only sweep of all 778 changed code files in the four focus areas found one occurrence of `specs/` in a comment (`.skilled/…/check-source-tags.vitest.ts:43-44`), and it names the corpus root in an explanation of a machine-wide excludes file, which is the durable WHY rather than an ephemeral label. The matcher was controlled against a synthetic `// label REQ-001 for packet specs/x/y` line, which it matched.
- "A carried finding's anchor has moved since it was written": ruled out except for the F003 refinement above; all eight anchors still resolve to the substance they cite.

## Coverage Honesty (for the synthesis matrix)

- Read or executed with receipts: fan-out dispatch/write path, reducer and synthesis close-out, locks/fencing/authority, spec-gate hooks, validation engine and rules, retrieval and trigger index, generated metadata, both cli hubs, advisor front door, cross-skill contracts, mirrors.
- Partial: `runtime/lib/continuity/**` (read only via callers), `runtime/cli/optimizer/**`, `system-spec-kit/shared/{embeddings,algorithms}`, `deep-improvement` scripts, deep-ai-council assets and prompts, `cli-classifier/benchmark`, most playbook prose (command blocks only).
- Not reviewed: `runtime/cli/doctor/**` consumers, `system-spec-kit/templates/**`, `system-skill-advisor/runtime/stress-test/**`, `.skilled/commands/**` outside the deep-review assets, and the other two lineages' exclusive slices.

## Dead Ends

- Running vitest suites to re-derive the tests this loop cites: BLOCKED by lineage containment (runner caches and fixtures write outside the lineage); recorded as exhausted, not retired — a single-writer run outside the lineage can re-derive them.

## Assessment

- New findings ratio: 0.0 (no new findings; one citation refinement)
- Dimensions addressed: maintainability (second pass)
- Novelty justification: the pass re-verified every anchor mechanically, swept the range's added comments with a matcher control, and wrote down the coverage boundary instead of implying completeness. The one refinement is exactly what a broadening pass is for.

## Next Focus

Dimension: all (final pass). Focus area: adversarial replay of every active P0/P1 (F001, F002) against the current tree, a final artifact-consistency check of this lineage's own state (iterations 1-14 present, deltas paired, registry fields), and preparation notes for synthesis. Rotations status: final.

Review verdict: CONDITIONAL
