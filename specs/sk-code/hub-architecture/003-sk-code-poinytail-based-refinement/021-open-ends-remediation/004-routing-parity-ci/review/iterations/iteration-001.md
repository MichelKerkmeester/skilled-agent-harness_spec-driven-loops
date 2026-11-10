# Deep Review - Iteration 001

- **Session**: rvw-021-004-routing-parity-20261011T193333Z (generation 1, lineage new)
- **Iteration**: 1 of 5 | **Dimension**: correctness
- **Target**: commit f34b01bf0a on worktrees/115-rem-routing-parity-ci
- **Method note**: this is a read-only dispatch. No vitest gate, CI job, or repository script was executed; every claim below is source reading plus repository inspection, and anything needing a run is labeled as such.

## Dimension

Correctness of the two new blocking gates and the ratchet machinery they depend on:

1. Does the local-vs-native divergence ratchet really compare both scorers under one deterministic regime (fresh skill-graph index, pinned clock, regime header)?
2. Does the widened holdout independence check enforce what its header claims (declared scoring surfaces, allowed-overlap map, runtime-file scan)?
3. Do the two new `golden-prompt-gate` steps block (no `continue-on-error`, correct job and trigger paths, interpreter available)?

## Files Reviewed

| File | Where inspected | Result |
|------|-----------------|--------|
| `.github/workflows/routing-registry-drift.yml` | new steps at 271-297; triggers at 27-28 / 74-75; whole file for `continue-on-error` | blocking; no `continue-on-error` anywhere |
| `.../tests/parity/local-native-divergence-ratchet.vitest.ts` | full file (427 lines) | pin and fresh index correct; finding 1 is producer-side |
| `.../tests/parity/holdout-independent.vitest.ts` | full file (368 lines) | scan complete against the current tree; findings 2 and 3 on coverage |
| `.../tests/parity/fixtures/local-native-approved-divergences.json` | schema and `approvedAt` set | 74 entries, date-only values, newest 2026-10-11 |
| `.../lib/scorer/projection.ts` | 55-105 | env read at module load (line 70); fallback database path under cwd |
| `.../lib/skill-graph/skill-graph-db.ts` | 255-300 | `resolveSkillGraphDbDir` reads env per call; `indexSkillMetadata` is sync; `closeDb` exported |
| `.../lib/lifecycle/age-haircut.ts` | full file (52 lines) | decay is a pure function of `now`; native-side only |
| `.../scripts/skill_advisor.py` | targeted: clock, age, derived, DB-dir reads | no wall-clock read in scoring; `last_scan_timestamp` feeds a status payload |
| `.../scripts/routing-accuracy/holdout-prompts.jsonl` | header row and source_type discipline | three declared source types intact |
| `.../scripts/routing-accuracy/build-holdout.mjs` | assembly logic | read-only assembler; exempted as non-scoring |
| `.../scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs` | full file (220 lines) | finding 1 |
| `specs/.../004-routing-parity-ci/spec.md` | full file (158 lines) | in-scope file list matches the commit exactly |

Static verification performed without executing gates: replay of the holdout scan's own extension list, skip-directory list and corpus regexes over the live `runtime/` tree (every match is declared, exempted, or a fixture definition); existence check of all 21 declared consumers and 5 corpus files; `git show --stat f34b01bf0a`; `readlink .opencode/skills` and the tracked symlink modes.

## Findings

### P0

None.

### P1

None.

### P2

#### 1 [P2] Capture and replay score the divergence ledger under different clock and graph regimes

- **Case**: a maintainer re-captures the ledger with the documented command, then the blocking ratchet replays it; the replay pins the clock and forces a fresh graph, the capture does neither, so a newly approved entry can fail the gate written to validate it.
- **File**: `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs:53`
- **Evidence**: the capture deletes `SYSTEM_SKILL_ADVISOR_DB_DIR` (line 53) and imports the real scorer (line 62) with no clock override, so the native side scores at wall-clock time (line 157) and resolves the fallback database under `process.cwd()` (`lib/scorer/projection.ts:70-73`, `.skilled/skills/system-skill-advisor/runtime/database/skill-graph.sqlite`) - the daemon database when one exists, nothing on a clean runner. The replay sets a temporary DB dir and indexes the checkout fresh (ratchet lines 235-245, 287-290) and freezes `Date` to midnight UTC of the newest `approvedAt` (lines 222-229). The derived lane's multiplier decays against that `now` (`lib/lifecycle/age-haircut.ts:31-41`), so a prompt can hold one top-1 at capture time and another at the pinned instant; ratchet rules (a) and (c) then fail on a ledger the tool just wrote. The baseline capture shows the intended pattern: clock pinned before the scorer import, temp DB dir set first (lines 44-48 and 60-77 of `capture-scorer-eval-baseline.mjs`).
- **User impact**: the gate's claim 'green here exactly when it is green locally' (workflow comment) is not guaranteed by its own producer: capture on a clean runner, or across midnight, can write entries CI rejects, and capture under a live-graph regime can be replayed under a fresh-graph regime.
- **Finding class**: cross-consumer
- **Scope proof**: the regime inputs (clock, DB directory) are set in exactly two places within the reviewed scope - the capture script and the ratchet test - and both were read end to end; `projection.ts` and `age-haircut.ts` were read for the consumption side.
- **Recommendation**: give the capture the replay's regime - pin `Date` to midnight UTC of the capture day before importing fusion and pass a freshly indexed temp skill graph (or extract one shared helper), then record the pinned instant so replay cannot drift from the capture.
- **Confidence**: high that the regimes differ (code read); medium on how often a top-1 actually flips across the offset (not executable this iteration).
- **Downgrade trigger**: if every capture is produced by a wrapper that already applies the ratchet regime, downgrade to a documentation note.

#### 2 [P2] The declaration scan proves references are declared, never that declarations are true

- **Case**: a declared consumer stops reading its corpus, moves its scoring behind another path, or an exempted file starts scoring; the scan stays green while the published surface map is no longer a truthful description of who scores what.
- **File**: `.skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts:333`
- **Evidence**: the test asserts (i) every declared consumer path exists (line 342) and (ii) every runtime source file whose text matches `CORPUS_REFERENCE` is declared for that corpus or listed in `NON_SCORING_REFERENCES` (lines 346-357). Nothing asserts the converse: no declared consumer is ever read back to confirm it still references its corpus, and the five exemptions (lines 188-194) are never re-validated.
- **User impact**: the independence contract can erode silently in the direction the gate does not look; a scoring surface introduced inside an already-declared or already-exempted file escapes both the scan and the overlap map.
- **Finding class**: matrix/evidence
- **Recommendation**: add the converse assertion - each declared (file, corpus) pair must textually reference that corpus, and each exempted file must still match its pattern without carrying scoring imports - or state the one-directionality in the header so nobody over-trusts the map.
- **Confidence**: high (pure code fact).

#### 3 [P2] `allowedOverlap` keys the declaration by source type, so one reason licenses every corpus of the surface

- **Case**: `scorer-eval-baseline` scores `labeled`, `ambiguity`, and `delegation` (lines 102-113) and declares `holdout-harder` for the delegation-to-harder prompt sharing. A `holdout-harder` row that collided with the labeled training corpus is 'declared' for this surface by the same key, because `surfaceOverlap` (lines 267-276) only checks membership in any of the surface's corpora and tags the row by `source_type`.
- **File**: `.skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts:306`
- **Evidence**: `allowedOverlap: Readonly<Partial<Record<SourceType, string>>>` (lines 50-57) has no corpus component, and the undeclared-overlap assertion (lines 306-320) compares only source types. Today the collision is still caught by the `training-corpus` surface (`corpora: ['labeled']`, `allowedOverlap: {}`, lines 79-92), so current coverage is complete - but only because every scored corpus also has at least one zero-overlap surface.
- **User impact**: latent - a future corpus scored only by surfaces with a broad source-type declaration would be silently unguarded against leakage through that corpus.
- **Finding class**: algorithmic
- **Recommendation**: key the declaration by (corpus, sourceType), or have `surfaceOverlap` return the matched corpus and require a reason per pair, so a declaration cannot widen to a corpus the reason does not name.
- **Confidence**: high on the mechanism; the masking is currently offset by the zero-overlap surfaces.
- **Downgrade trigger**: if the zero-overlap surfaces are the intended enforcement layer and the source-type key is the documented contract, downgrade to a note.

## Traceability Checks

| Check | Result | Evidence |
|-------|--------|----------|
| REQ-001: ratchet blocks in `golden-prompt-gate`, no `continue-on-error` | pass (static) | new step at workflow 278-288; `continue-on-error` absent from the file; admission warn-only step stays in the other job (line 173). |
| R3: pinned clock, baseline pattern | pass (static) | ratchet 222-229 and 287-290 mirror `scorer-eval-baseline-ratchet.vitest.ts:181-183`; the deriver guards empty/invalid `approvedAt`. |
| R5: every scoring surface, allowed-overlap map, run in CI | pass with findings 2 and 3 | holdout 78-196 and 267-358; workflow 289-297. |
| R8: regime header | pass | ratchet 15-21 states harness-regime parity and the fixture-vector substitution. |
| Spec scope lock | pass | `git show --stat f34b01bf0a` touches exactly the three files in spec section 3; no scorer, floor, or ledger-entry change. |
| SC-002: clock-shift pass and injected-overlap failure | not executed | Read-only dispatch; the pin and the assertions exist per the rows above, but an actual run is the proof and belongs to CI or an execution iteration. |
| CI reachability of the new working directories | pass | `.opencode/skills -> ../.skilled/skills` verified via `readlink`; `.opencode` symlink entries are tracked (mode 120000), so a fresh checkout resolves `working-directory: .opencode/skills/system-skill-advisor/runtime`. |

## Verdict

PASS. No P0 and no P1 findings: the commit wires the ratchet into a blocking CI step with the correct interpreter, pins the native scoring clock, indexes a fresh skill graph for both scorers, states its regime honestly, and widens the independence check with a declaration map that is complete against the current tree. Three P2 advisories remain, one on the ledger capture tool's regime parity and two on the expressiveness and completeness of the new declaration scan; none of them blocks merge, and each names its downgrade trigger. Execution-level proof (SC-002) is explicitly deferred because this dispatch is read-only.

## Next Dimension

D2 Security. Named hypotheses for the next iteration: (1) `runPython` passes `process.env` wholesale into the subprocess - check what env reaches it and whether any output can echo secrets; (2) `listRuntimeSourceFiles` follows symlinked directories and reads every matched file - check for loops, path escapes, and unreadable-file crashes in CI; (3) the capture script evaluates a repo fixture with `Function(...)` - check the input surface; (4) the new workflow steps' action pinning and `permissions: contents: read` are already clean, so the scan focuses on the test and script code paths.

Review verdict: PASS
