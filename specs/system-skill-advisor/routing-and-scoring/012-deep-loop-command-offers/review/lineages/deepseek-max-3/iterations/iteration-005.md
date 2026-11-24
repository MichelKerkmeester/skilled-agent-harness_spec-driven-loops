# Review Iteration 005

## Dispatcher

- Route: `Resolved route: mode=review target_agent=deep-review`
- Session: `fanout-deepseek-max-3-1795514074741-gl47kr`, generation 4, lineageMode `new`
- Iteration 5 of 5, the last under the cap. Dimension: maintainability, with both core protocols re-confirmed.
- Review target: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers` (spec-folder). Scope: the 46 paths in `review-scope-files.txt`.
- No `steer.md` exists in this lineage at iteration 5, so this iteration carries no lead ruling.

## Dimension

Maintainability: what a follow-on maintainer would get wrong. The gate is pinned in two language copies, so the drift guard is the load-bearing maintenance mechanism; the closure docs are the other, because four remediation rounds have rewritten them.

The operator focus was addressed by re-confirming both core protocols at their final status with fresh evidence references, so the run's terminal coverage gate reads a completed sweep rather than an iteration that merely stopped.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` (comment scan over the whole file), `:569-618`, `:1061-1101`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts`, `lib/scorer/fusion.ts`, `lib/subprocess.ts`, `skill-advisor-cli.ts` (comment scan)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` (comment scan, `:888`, `:4921`, `:5343`)
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs`, `scripts/synthesis-closeout.cjs` (comment scan)
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:60-130` (the drift guard and its numeric pairs)
- `acceptance-criteria.md:1-26` (frontmatter), `implementation-summary.md:1-30` (continuity block), `tasks.md:294-301` (Verification Summary)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The acceptance criteria still carry the scaffold's continuity block while the body is at round seven** -- `acceptance-criteria.md:11` -- the `_memory.continuity` block reads `last_updated_at: 2026-11-22T11:08:37Z`, `last_updated_by: "scaffold"`, `recent_action: "Authored the acceptance criteria for this packet"`, `completion_pct: 0` and a zero `fingerprint`, while the body's own metadata line says the file was "corrected in the seventh fix round" and 39 of its 43 rows read `Met`. `implementation-summary.md:11-14` was refreshed by `generate-context` at `2026-11-24T09:24:07Z`, so one closure document carries a live continuity block and the other carries the one written before the first requirement landed.
Finding class: instance-only
Scope proof: `acceptance-criteria.md` is in `reviewScopeFiles`; its frontmatter and its metadata section were both read, and `implementation-summary.md`'s block was read for comparison.
Affected surface hints: `acceptance-criteria.md` frontmatter, `/speckit:save` continuity writer, `implementation-summary.md` continuity block
Case: an operator resumes the packet with `/speckit:resume`, and the continuity ladder reports `completion_pct: 0` with "Authored the acceptance criteria" as the recent action, which reads as a packet that has not started.

## Traceability Checks

- **`spec_code` (core, hard): pass.** Re-confirmed with fresh references; no REQ row changed since iteration 3. Evidence: `spec.md:213`, `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1291`, `.skilled/skills/system-deep-loop/hub-router.json:34`.
- **`checklist_evidence` (core, hard): pass.** Re-confirmed; the open rows are still `T084` and `CHK-020`, both waiting on this run. Evidence: `tasks.md:244`, `acceptance-criteria.md:86`, `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl:94`.

## Integration Evidence

- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:66-77`: the drift guard's twelve vocabulary pairs plus the refusal-lead list, and `:80-83` the two numeric pairs, so a word or a window changed on one side fails a test. That is the mechanism that keeps the two copies honest, and it is the surface `R3-P2-002` measures.
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:995` and `synthesis-closeout.cjs`: the reducer's refinement rule and the close-out's registry cross-check are the two places this run's findings travel through, and both were read in this review because `REQ-032` names them.

## Edge Cases

- **Comment hygiene is clean across the changed runtime files.** No `REQ-`, `AC-`, `ADR-`, task id or `specs/` path appears in a comment in `command-attach.ts`, `explicit.ts`, `fusion.ts`, `subprocess.ts`, `skill-advisor-cli.ts`, `skill_advisor.py`, `reduce-state.cjs` or `synthesis-closeout.cjs`. The comments state the durable why ("a refusal lead stops at a conjunction", "the window bounds the per-phrase scan"), which is the form a later maintainer can act on without a packet open.
- **Two closure documents, two ages of metadata.** The implementation summary's continuity block is current to the last save; the acceptance criteria's is from the scaffold. Reading either alone gives a different picture, which is why the point is raised once rather than treated as noise.
- **The drift guard is the maintenance answer to a two-language gate,** and its weakness is the same as its strength: it proves the copies agree, not that each word works. `R3-P2-002` records the four lists where that distinction has no per-entry case.
- **`validation.sh` was not run in this lineage.** The review writes only inside its own artifact directory, and the packet's own `T085` records `RESULT: PASSED`; running it would write outside this lineage, so the claim is read as recorded evidence rather than reproduced.

## Confirmed-Clean Surfaces

- No ephemeral artifact label in any comment of the eight changed runtime files.
- The drift guard covers twelve word lists and two numeric constants, with a Python-source read that fails a renamed or deleted list rather than comparing empty.
- Both closure documents, read together, tell one story of the rounds; the only inconsistency is the scaffold continuity block above.
- `reduce-state.cjs`'s refinement rule keeps a cross-file or cross-dimension refinement as its own entry and folds a same-file one, which is what `REQ-032` requires.

## Ruled Out

- **A spec or task id left in a code comment:** ruled out across the eight changed files.
- **A drift guard that silently compares against an empty list:** ruled out; the Python tuple reader answers `undefined` on a renamed list, and the test asserts it is defined before comparing.
- **A closure story that diverges between the four packet documents:** ruled out; the rounds, their numbers and their ADRs agree, apart from the scaffold block raised above.
- **A maintainability defect in the reducer's refinement path:** ruled out by reading the rule and its unit test's stated result.

## Next Focus

- None. This is the last iteration under `maxIterations: 5`; the run proceeds to synthesis with stop reason `maxIterationsReached`.
- Rotation status: fourth rotation complete; all four canonical dimensions are covered and both core protocols are at pass.
- Blocked/productive carry-forward: the productive category "resolve the citation against its declared base, then read the line" carried the two traceability passes; the exhausted category "probe with a wrong argument order" from the template's prior run does not apply here.
- Required evidence for synthesis: five active P2 findings, two protocol statuses at pass with file:line references, the terminal gate rows, and the four-dimension coverage record.

## Verdict

One active P2 and no active P0 or P1. The run's verdict is PASS with advisories: four dimensions covered, both core protocols pass, and no blocking finding.

Review verdict: PASS
