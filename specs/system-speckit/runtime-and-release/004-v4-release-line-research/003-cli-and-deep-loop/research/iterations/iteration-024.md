# Iteration 24 — Deep-Review Runtime: Reducer, Verdict, Severity, Report Shape

## Focus

Unread ground: the deep-review runtime. Read the reducer, verdict and severity logic, the review
state references under `deep-review/references/state/`, and the review contract assets; check
severity counting (active P0/P1/P2), the verdict rule (PASS / CONDITIONAL / FAIL), dimension
coverage and the review report shape; run the deep-review tests read-only. Registry findings on
`releaseReadinessState`, restart bookkeeping, the `Provisional Verdict` literal and duplicate-row
counting were excluded by instruction.

## Actions Taken

1. Enumerated the deep-review packet: `scripts/` holds only `divergent-review-pivot.ts`,
   `render-contract-snapshot.cjs`, `runtime-capabilities.cjs`, `README.md` and `tests/`. The
   reducer named throughout the packet's prose is **not** in that folder.
2. Read the live reducer `runtime/scripts/reduce-state.cjs` (2,519 lines) at its severity
   (`SEVERITY_KEYS`, `buildFindingsBySeverity`, `buildFindingRegistry`), coverage
   (`REQUIRED_DIMENSIONS`, `buildDimensionCoverage`), and verdict (`renderDashboard`) sites.
3. Read the contract side: `deep-review/SKILL.md` §4–§6, `assets/deep-review-config.json`,
   `assets/review-mode-contract.yaml` (verdict + cross-reference protocols),
   `references/state/state-reducer-registry.md`, `references/state/state-outputs.md`,
   `references/state/state-jsonl.md`, `feature-catalog/severity-system/verdicts.md`.
4. Ran two runtime probes against `reduceReviewState` in `os.tmpdir()` scratch packets (the
   reducer only ever writes inside the spec folder it is handed, and the scratch folder was
   disposable):
   - a review configured with `reviewDimensions: ["performance","test_quality"]`;
   - a two-iteration review whose summary goes P0:1 → P2:1 with no `resolvedFindings`.
5. Ran the deep-review's own reducer test read-only:
   `node --test deep-review/scripts/tests/reduce-state-summary-fallback.test.cjs` → 1 pass.
6. Checked the TypeScript review reducer's blast radius with a repo-wide import grep.

## Findings

### f-iter024-001 — P1, bug: the reducer ignores `config.reviewDimensions`

`REQUIRED_DIMENSIONS` is a hardcoded four-element list at
[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:21], and
`buildDimensionCoverage` seeds its map from that constant only
[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1145]. Nothing in the
reducer reads `config.reviewDimensions`
[SOURCE: .skilled/skills/system-deep-loop/deep-review/assets/deep-review-config.json:37] —
a grep for `reviewDimensions|crossReference` over the whole reducer returns no match.

Probe result, a review configured with `["performance","test_quality"]` and one completed
`performance` iteration:

```
| correctness | pending | 0 |
| security | pending | 0 |
| traceability | pending | 0 |
| maintainability | pending | 0 |
```

No row exists for either configured dimension, and the covered one still reads `pending`.
Because `nextFocus` falls back to `REQUIRED_DIMENSIONS.find((d) => !covered)`, the dashboard's
Next Focus steers the operator to `correctness`, which is outside that run's review scope. The
cross-reference protocols `spec_code` / `checklist_evidence` that `SKILL.md` §6 requires as
coverage conditions [SOURCE: .skilled/skills/system-deep-loop/deep-review/SKILL.md:304] have no
axis in the coverage model at all, so protocol coverage is invisible on the operator's steering
surface.

Release introduced: the reducer predates the audited line, but the configurable `reviewDimensions`
field is present at v4.0.0.0 and the coverage model was never widened. Confidence: high (executed).
Verify:
`node -e` scratch packet with `reviewDimensions:["performance"]`, one iteration with
`dimensions:["performance"]`, then `reduceReviewState(spec,{})` and read dashboard §5.

### f-iter024-002 — P1, drift: finding resolution depends on an undocumented field

A finding leaves the active set only when its id appears in a record's `resolvedFindings` array
[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1095]. That field is
neither in the required-fields list nor anywhere else in the state schema
[SOURCE: .skilled/skills/system-deep-loop/deep-review/references/state/state-jsonl.md:95].

The practical consequence is that the summary fallback path manufactures permanently open rows.
`summarySlotFinding` names rows `SUMMARY-<severity>-NNN`, so a P0 reported at run 1 and the same
issue reported at P2 in run 2 are two distinct ids that the dedup key never collapses. Probe
result for exactly that input: `OPEN: SUMMARY-P0-001:P0 SUMMARY-P2-001:P2`,
`findingsBySeverity {"P0":1,"P1":0,"P2":1}`, dashboard `Provisional Verdict: FAIL` — after the
issue was downgraded and the iteration itself declared `Review verdict: PASS`. The run can never
clear FAIL, because the resolving verb is undocumented and therefore not in the leaf's contract.

Release introduced: v4.0.0.0 (summary fallback predates the audit line; `resolvedFindings` support
is in the same reducer). Confidence: high for the mechanism, medium for operator impact (a
fully-populated `findingDetails[]` run resolves by id and does not hit this). Verify: the two-run
probe above; or
`rg -n "resolvedFindings" .skilled/skills/system-deep-loop/deep-review/references/` → no match.

### f-iter024-003 — P2, drift: two contracts for one field, discriminated by a guess

The schema defines `findingsSummary` as "Total active findings"
[SOURCE: .skilled/skills/system-deep-loop/deep-review/references/state/state-jsonl.md:109].
The reducer treats it as per-run counts unless the severity total happens to equal
`findingsCount`
[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:799], and the source
comment concedes the ambiguity: "A per-run sum that matches findingsCount by chance is read as
cumulative, which errs toward fewer padded rows." Two records with identical shape and identical
documented meaning can therefore be reduced to different severity totals. Confidence: high
(read). Verify: read both citations; the discriminating rule appears in code only.

### f-iter024-004 — P2, drift: the dashboard verdict is gate-blind

The contract's FAIL condition is `activeP0 > 0 OR any required quality gate fails`
[SOURCE: .skilled/skills/system-deep-loop/deep-review/assets/review-mode-contract.yaml:105], and
the feature catalog repeats "FAIL applies when active P0 remains or any required gate fails".
The reducer's verdict never reads gate results — it is severity plus search debt only:
`severity.P0 > 0 ? 'FAIL' : severity.P1 > 0 || hasSearchDebt ? 'CONDITIONAL' : 'PASS'`
[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2021].

`hasSearchDebt` is also an undocumented verdict input: the three verdict tables (SKILL §4,
`completion-criteria.md` §release-readiness, the contract asset) do not mention it, so a run with
zero findings and open search debt reads CONDITIONAL with no table entry explaining why. A run
where every quality gate failed but no P0 was filed reads PASS. Confidence: high (read). Verify:
`rg -n "gateResults" .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` → hits only
inside the blocked-stop renderer, never the verdict branch.

### f-iter024-005 — P2, drift: the packet points at a reducer file that does not exist

`SKILL.md` lists `Scripts: scripts/reduce-state.cjs, scripts/runtime-capabilities.cjs`
[SOURCE: .skilled/skills/system-deep-loop/deep-review/SKILL.md:287], and the ownership table names
`scripts/reduce-state.cjs` as the registry and dashboard writer
[SOURCE: .skilled/skills/system-deep-loop/deep-review/references/state/state-reducer-registry.md:39].
`ls .skilled/skills/system-deep-loop/deep-review/scripts/reduce-state.cjs` exits 1. The path that
works is `runtime/scripts/reduce-state.cjs`, which is what the config asset already carries.

The deep-research twin does ship its own `scripts/reduce-state.cjs`, so the review packet's prose
was copied from the research packet and the file was never duplicated or the path never rebased.
An operator following §5 lands on "No such file". Confidence: high (executed `ls`). Verify:
`ls .skilled/skills/system-deep-loop/deep-review/scripts/reduce-state.cjs; echo $?` → 1.

### f-iter024-006 — P2, over-engineering: a second, unreachable severity model

`runtime/lib/deep-review-reducers/` is 3,281 lines (`deep-review-reducer.ts` 2,279,
`deep-review-projection-schema.ts` 607, `deep-review-projection-types.ts` 395, `index.ts` 33) and
derives severity from `hardVeto` / `impact >= 0.8 && confidence >= 0.6` / lifecycle
[SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-review-reducers/deep-review-reducer.ts:743].
That is a different model from the live reducer, which reads the `severity` field the leaf writes.

A repo-wide grep for `deep-review-reducers` outside its own directory returns no importer: the
only consumers are its own vitest files. What breaks if it is removed: the
`deep-review-reducers.vitest.ts` and projection-schema test surface and the exported index
[SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-review-reducers/index.ts:1] — no runtime
path, since the loop reaches the CJS reducer through `require(...reduce-state.cjs)`
[SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-state-reducer.vitest.ts:23].

The removal is not free: it is the only place where a severity derivation from evidence scores
exists, so deleting it deletes the design intent too. The honest request is a decision, not a
deletion — either wire it or mark it experimental in the packet's own docs. Confidence: high for
"no importer", medium for "safe to remove". Verify:
`rg -n "deep-review-reducers" --glob '!**/node_modules/**' .skilled | grep -v "/lib/deep-review-reducers/"`.

## Questions Answered

None of the three strategy key questions was closed this iteration. The new evidence bears on them
indirectly: f-iter024-001 is a fourth instance of "the reference describes a surface the code does
not implement", and f-iter024-004 blocks any claim that the review dashboard is a release-decision
surface.

## Questions Remaining

- Does anything read the **dashboard** verdict as a release decision, or is `review-report.md` the
  only consumer? f-iter024-004's severity depends on that answer.
- Is `resolvedFindings` emitted by any live leaf or YAML step, or is it reducer-internal only? A
  `rg` over `.skilled/commands/deep/` and the review YAMLs settles it.
- Should `buildDimensionCoverage` read `config.reviewDimensions` plus `crossReference.core`, or is
  the four-dimension model deliberate canon that the config asset should stop advertising?
- Carried: executor failure handling (devin `resource_exhausted`, builder throws) — fifteenth
  iteration unread; hub canon `package_skill.py --strict`; `--pure` validity; unknown-token `{...}`
  rendering policy; the three `*-presentation.txt` assets.

## Next Focus

Read the review side's remaining unverified seam: `review-report.md` generation. No script among
`runtime/scripts/*` mentions `review-report`, and `state-outputs.md` §5 lists ten sections while
`SKILL.md` §6 asserts "all 9 core sections". Locate the actual writer (likely YAML-instructed
agent output), compare the two section lists, and check whether the release-readiness fields
(`stopReason`, coverage, severity counts, verdict, `releaseReadinessState`) are contractually
emitted at all.

## SCOPE VIOLATIONS

None. Both probes wrote only into `os.tmpdir()` scratch folders created by `mkdtempSync`; the
repository was read-only for this iteration. `state-reducer-registry.md` and every reducer-owned
file under `research/` were treated as read-only.
