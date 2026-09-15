# Iteration 1: D1 Correctness — the remediation's detection and evidence paths

## Focus

Dimension: **correctness** (D1).
Files: `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts`, `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` (containment call sites), `.opencode/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts`.
Scope: the six remediation commits for phases 008–013 (`47bdca586a`, `efe974e6f0`, `df7a1a2cf4`, `2ba05e1a28`, `52959f1065`, `57c02b8592`) read against HEAD `57c02b8592c8b74b9972525dde932be333c4c562`, plus the baseline-deletion and quarantine paths they touched. No test execution: this lineage's write surface forbids commands that write outside the lineage directory, so every finding below is static evidence (file:line reads plus git history).

## Scorecard

- Dimensions covered: correctness
- Files reviewed: 3 primary + 2 supporting
- New findings: P0=0 P1=0 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.45

## Findings

### P0, Blocker

None.

### P1, Required

None.

### P2, Suggestion

- **F-101**: The empty-hash sentinel still hides a baseline path the lane recreates, `runtime/lib/deep-loop/write-containment.ts:917-919`. `detectNewOutOfScopeViolations` skips every baseline path whose recorded hash is empty (`const preHash = preMap.get(p) || ''; if (!preHash) continue;`). The snapshot stores `hash: ''` for any path `git hash-object` cannot read — including a tracked path deleted before dispatch, because `gitHashObject` returns `''` on a non-zero exit (`write-containment.ts:506-510`). The phase-009 addition (`:930-953`) walks the subtraction the other way, but only for entries marked `untracked` whose path is both absent from `git status` and absent from disk (`:936-938`, `:944`); the recreation direction is excluded by construction, since a lane that recreates the path produces a status entry and never reaches the deletion pass. The unit suite pins only the subtraction case (`tests/unit/write-containment.vitest.ts:535-554`); no test covers recreation. Severity P2: under the default preserve remedy nothing is destroyed, so the cost is a missed report, but the guard's own scope claim — every new out-of-scope write is detected — is false for this path shape.
- **F-102**: A containment pass whose quarantine evidence failed to write is indistinguishable from a complete one, `runtime/lib/deep-loop/write-containment.ts:1510-1545` with `runtime/scripts/fanout-run.cjs:3526-3544` and `:3649-3652`. `enforceWriteContainment` returns the full `QuarantineResult` — `{dirPath, entries, refused, error}` (`write-containment.ts:1331-1354`) — but `buildContainmentViolationEvent` carries only `violations`, `reverted`, the patch path and `dataLossPossible`; the runner appends that event and keeps only `quarantinePath` for `output.containment`, dropping `refused` and `error` in both the successful-lane path and (with `quarantinePath` too) the failed-lane path at `:3585-3626`. A pass whose manifest write failed, or whose destinations the phase-008 canonicality check refused, therefore reads exactly like a complete pass wherever the violation is reported. Severity P2: the violation itself is still reported; what is lost is whether its durable record exists.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial (this iteration's slice) | hard | `write-containment.ts:917-919` vs the module's detection contract (`:894-898`) | F-101; the full spec_code verdict is in iteration 3 |
| checklist_evidence | notApplicable | hard | packet has no `checklist.md` (verified absent) | recorded again in iteration 3 |

## Assessment

- New findings ratio: 0.45 (2 new findings against a reviewed surface that is mostly remediation-verified; no prior registry).
- Dimensions addressed: correctness.
- Novelty justification: both findings sit on paths the remediation rewrote — the baseline-subtraction rewrite of phase 009 (F-101) and the quarantine/refusal machinery of phases 008 and 012 whose result never reaches the reporting surface (F-102). Neither restates a prior finding: the prior P2 F-001 covered the deleted-at-baseline short-circuit, and this iteration confirms it survives the phase-009 fix in the recreation direction rather than re-reporting it; F-102 is new to the remediation's own output contract.

## Claim Adjudication

No new P0/P1 findings this iteration; no packets required.

## Ruled Out

- Phase-010 ordering: containment runs after the lane process ends and before every verdict gate, and its ledger event is appended before any gate can throw (`fanout-run.cjs:3466-3544`, gates at `:3585-3626`). Verified correct.
- `passSegment` path safety (`write-containment.ts:1122-1133`): a non-integer or non-finite segment becomes `unknown`, never a `.`-bearing or `Infinity` path segment. Verified correct.
- Quarantine destination refusal (`write-containment.ts:1076-1104`): resolves the deepest existing ancestor and rejects any symlinked component below the artifact root, collecting refusals instead of throwing. Verified correct.
- Phase-012 exclusive creates: `openSync(destination, 'wx')` decides existence at the filesystem rather than by a check that could lose a race; the pass directory is reused, the files are not. Verified correct.
- Prior P2s F-002 (first churn window), F-003 (sampler cost), F-007 (captured content) remain open but were not bound to phases 008–013; they are recorded as unremediated carry-overs in the report appendix rather than re-registered.

## Dead Ends

- Running the containment unit suite to confirm the recreation gap: blocked by the lineage write-surface constraint. Static reading only.
- Exercising `git hash-object` against a missing path to pin the exit code live: the prior review already established the `''` return, and `gitHashObject` (`:506-510`) makes it explicit; no command needed.

## Recommended Next Focus

D2 Security: the restore writer's path handling after phase 011, the quarantine destination contract after phase 008, and whether the remediation's refusals fail safely.

Review verdict: PASS
