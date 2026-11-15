# Iteration 004 — Maintainability (paging, loads, build wiring and the four residuals)

## Dimension

Maintainability, the last uncovered dimension. Operator focus carried in addition: the four named residuals and the known phase-1 harness line. How the operator focus was addressed:

- Residual 1 (old-path sweep): re-swept the live surfaces. Two hits survive and both are deliberate test fixtures, not entries: `history-projection.vitest.ts:228-232` keeps the retired runtime path because older transcripts still hold it, and `session-handover-cli.test.cjs:3596-3603` creates an empty old-path file in a fake other checkout to exercise the workspace refusal. The known `hop-recall.sh:18` line stays outside the target and owned by phase 008 T002.
- Residual 2 (CI engine step): re-confirmed the mapping that makes it fail as written. The step at `.github/workflows/spec-kit-check.yml:296-302` runs the package build, whose script resolves `../../../skills/system-spec-kit/node_modules/.bin/tsc` (`package.json:11`) inside `.skilled/skills/system-spec-kit/`, while the job installs `.opencode/skills/system-spec-kit` (`:276`) and `.skilled` (`:279`). `I1-P1-001` stays the active reason; the engine-only trigger gap `I1-P2-002` also stands (`:3-44` has no `.skilled/hooks/**` path).
- Residual 3 (silent schema skip): `project.test.mjs:141-142` still converts a missing schema into a green skip. `I1-P2-003` carried; the schema file exists, so the branch is latent.
- Residual 4 (66-character bound): `lookup-offer.ts:33` and `hook-state.ts:278` are both 66, with the same quoted-length predicate (`lookup-offer.ts:58`, `hook-state.ts:283`). `history-locator.vitest.ts:149-172` pins the boundary and sweeps schema acceptance against the offer. `I1-P2-004` (pin completeness) carried, not re-raised.

## Dispatcher

- Mode: review, native LEAF execution, no delegation.
- Iteration: 4 of 10 (JSONL-derived: 3 prior `type:"iteration"` records; matches the dispatch number).
- Run / sessionId: `2026-11-15T17:33:23.837Z`, generation 1, lineageMode `restart`.
- Target: files changed in `169da2e8cba..1c7bc3d9d63` (63 declared files; maintainability-relevant subset read).
- Node budget: 24 tool calls; 19 used for state and analysis, 5 reserved for the artifacts.

## Files Reviewed

| File | Lines / focus |
|------|---------------|
| `.skilled/hooks/session-handover/history/lib/pages.ts` | 1-489 in full: pointer selection, bounds, text paging, part paging, image handles |
| `.skilled/hooks/session-handover/history/lib/loads.ts` | 1-120 in full: budget reservation, reference collapse, smallest-first loads, deferred parts |
| `.skilled/hooks/session-handover/history/lib/navigator.ts` | 400-519: rebuild, search, browse, load, eager search index, BM25 head |
| `.skilled/hooks/session-handover/history/README.md` | 1-222: contract, file map, operations, budget, CLI, validation |
| `.skilled/hooks/session-handover/history/package.json` | 1-15: build, typecheck and test scripts |
| `.skilled/hooks/session-handover/history/tsconfig.json` | 1-22: extends, typeRoots, runtime reference, include/exclude |
| `.github/workflows/spec-kit-check.yml` | 1-383: triggers, install set, runtime build, engine step |
| `.skilled/hooks/shared/tests/session-readers/project.test.mjs` | 115-156: published-schema branch |
| `.skilled/hooks/session-handover/history/tests/history-locator.vitest.ts` | 138-187: quoted-length bound and the schema/offer sweep |
| `.skilled/hooks/session-handover/history/tests/history-projection.vitest.ts` | 215-244: legacy core-path fixture |
| `.skilled/hooks/session-handover/tests/session-handover-cli.test.cjs` | 3580-3614: other-checkout fixture |
| `.skilled/hooks/session-handover/history/lib/lookup-offer.ts` | 28-58 (bound constant and predicate; grep) |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts` | 278-283 (bound copy and predicate; grep) |

Reference-only (prior-iteration evidence, not re-read): `core.ts:42-107`, `history-entry.schema.json`, `hop-recall.sh:18`.

## Findings — New

### P0 Findings

None.

### P1 Findings

None new. `I1-P1-001` (the engine CI build cannot resolve `tsc` on a clean runner) remains active and is carried, not re-derived here.

### P2 Findings

None new. The module pass below found the paging and load arithmetic correct and the README accurate on the claims checked.

## Maintainability Surface Review

`pages.ts` is the module the prior iteration left unread, and its bounds hold end to end:

- Handle and pointer validation runs before any echo or traversal: pointer syntax rejects bad escapes and non-leading slashes (`pages.ts:175-177`), the walk uses `Object.hasOwn` so inherited keys cannot be reached (`:188`), and the null-slot rule keeps removed assistant slots unreadable (`:192`).
- Cursor inputs are bounded before slicing: offset/limit validation (`:351-361`), offset-into-a-surrogate refusal (`:366-371`), surrogate-safe page ends (`:334-339`, `:396`), and a binary search whose upper bound is the reply budget rather than an unchecked slice (`:397-422`).
- Part-list paging advances to the next unread part on both the limit exit and the budget break (`:441-469`); a first part that cannot fit raises `PART_TOO_LARGE` instead of returning an empty continuation (`:472-474`).
- Image bytes never become text: serialization substitutes metadata (`:252-264`) and only the image mode returns the native block (`:482-489`).

`loads.ts` keeps the shared budget in the documented order: every id and continuation is reserved first (`loads.ts:73-78`), references collapse largest-first (`:80-87`), whole items load smallest-first so a large first item cannot starve a later one (`:90-98`), and deferred items get only as many part descriptions as fit (`:100-117`). Image-bearing items are deferred deliberately (`:90-92`).

The README matches the shipped surface on every claim this pass checked: the nine-suite count (`README.md:50` against nine `*.vitest.ts` files), the 66-character quoted bound and its 64-character plain consequence (`:115` against `lookup-offer.ts:33` and `hook-state.ts:278`), the command and refusal table (`:127-169`), and the build order (`:204-213` against `tsconfig.json:19` and `spec-kit-check.yml:285,301`).

## Traceability Checks

| Check | Result | Evidence |
|-------|--------|----------|
| `spec_code` (core) | pass (carried) | No spec or code change in this dimension; the engine path and build order still match the parent/phase-008 intent recorded in iteration 3. |
| `checklist_evidence` (core) | pass (carried) | Phase 008 remains Draft with all tasks unchecked; the harness line stays owned by T002. |
| `skill_agent` (overlay) | notApplicable | No `SKILL.md`, command document, or agent definition inside the declared target. |
| `agent_cross_runtime` (overlay) | notApplicable | No runtime mirror path inside the declared target. |
| `feature_catalog_code` (overlay) | pass (carried) | Catalog cap, command, prefix and refusal code checked in iteration 3; the README-side bound matches the shipped constant. |
| `playbook_capability` (overlay) | fail (carried) | `I3-P2-001` to `I3-P2-003` remain active. |
| Residual 1: old-path sweep | pass | `rg 'runtime/(dist/)?hooks/lib/history'` over `.skilled`, `.github`, `.opencode` returned only the two deliberate fixtures; no live entry names the retired path. |
| Residual 2: CI engine step as written | fail, carried | `spec-kit-check.yml:296-302` with `package.json:11` and `tsconfig.json:5,15,19`; the install set at `:276,279` does not provision `.skilled/skills/system-spec-kit/node_modules`. |
| Residual 3: missing schema becomes a skip | latent, carried | `project.test.mjs:141-142`; `I1-P2-003` stays active and the schema file exists. |
| Residual 4: 66-character bound equals the engine bound | pass, carried | Both copies are 66 with the same predicate; the sweep at `history-locator.vitest.ts:164-172` cross-checks schema against offer. |
| Known harness line | known, not a finding | `001-hop-recall-baseline/scratch/harness/hop-recall.sh:18`, owned by phase 008 T002, outside this target. |

## Integration Evidence

- `.github/workflows/spec-kit-check.yml:296-302` with `.skilled/hooks/session-handover/history/package.json:11` and `.skilled/hooks/session-handover/history/tsconfig.json:5,15,19` — the engine step builds through `../../../skills/system-spec-kit/node_modules/.bin/tsc`, while the job installs `.opencode/skills/system-spec-kit` (`:276`) and `.skilled` (`:279`); this is the carried `I1-P1-001` mapping.
- `.github/workflows/spec-kit-check.yml:3-44` — the trigger path list contains `.skilled/skills/system-spec-kit/**` but no `.skilled/hooks/**` entry, so engine-only commits never reach the step; carried `I1-P2-002`.
- `.skilled/hooks/session-handover/history/README.md:115` with `.skilled/hooks/session-handover/history/lib/lookup-offer.ts:33` and `.skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts:278` — the documented quoted bound equals both copies.
- `.skilled/hooks/shared/tests/session-readers/project.test.mjs:141-142` with `.skilled/hooks/session-handover/history/lib/history-entry.schema.json` — the skip branch is still the only guard on a missing schema; carried `I1-P2-003`.
- `.skilled/hooks/session-handover/history/tests/history-projection.vitest.ts:228-232` and `.skilled/hooks/session-handover/tests/session-handover-cli.test.cjs:3596-3603` — the two sweep hits are backward-compatibility and workspace-gate fixtures, not live entries.

## Edge Cases

- **The eager search index stays unmeasured.** `navigator.ts:432` builds the per-turn index on first search and `:490-503` analyzes every item with no size gate. Measuring it requires executing the engine against a synthetic store, which is a write/execution outside this read-only packet, so no performance finding is raised; the iteration-2 `SL-206` deferral stands. This is why the maintainability pass does not claim a measured memory bound.
- **`history.ts` (360 lines) was not read.** Its contract is exercised by `history-entry-contract.vitest.ts` and documented at `README.md:37`, but the source itself was not re-read inside the 24-call ceiling. Recorded as deferred evidence for a later pass, not as a clean pass.
- **The package `typecheck` script is not run in CI.** `package.json:12` points at `tsconfig.json`, whose `include` is `lib/**/*.ts` and which excludes `tests` (`tsconfig.json:20-21`); `tsc --build` already type-checks those same files, so the missing CI invocation duplicates build coverage rather than closing a gap. Not raised as a finding.
- **The 66-bound sweep is domain-limited.** `history-locator.vitest.ts:164-172` compares schema acceptance to `fitsHistoryLookupOffer` for 0-4 quotes and 50-70 plain characters. That catches the numeric drift the current copies could take, but it is a behavioral sweep, not a constant-identity assertion; `I1-P2-004`'s one-sided-pin concern is carried rather than re-adjudicated.
- **Error-message budgets are module-local.** `pages.ts:129-130` defines `MAXIMUM_CHOICE_CHARACTERS` and `MAXIMUM_CHOICES_BYTES` for refusal text only. They bound 160 characters and 1,536 bytes, are used only by `clipValue`/`listChoices`, and do not participate in the reply budget. Accepted as local policy, not a finding.

## Confirmed-Clean Surfaces

- `pages.ts` handle, pointer, offset and limit validation holds before every slice; the offset-into-surrogate and too-small-limit refusals are explicit.
- `pages.ts` part paging advances `nextOffset`/`readParts.offset` to the next unread part on both the count and budget exits.
- `loads.ts` reserves ids and continuations before content, collapses references largest-first, and loads items smallest-first in the caller's requested order.
- The engine README's 66-bound arithmetic, nine-suite count and build order match the shipped constants and configuration.
- The retired engine path has no live entry in `.skilled`, `.github` or `.opencode`; the two remaining hits are deliberate fixtures.
- No new P0, P1 or P2 findings in the maintainability dimension.

## Ruled Out

- **A live old-path reference survives outside `specs/`** — re-swept; the only hits are `history-projection.vitest.ts:230` (documented legacy-transcript fixture) and `session-handover-cli.test.cjs:3598` (other-checkout gate fixture). The known harness line is in `specs/` and owned by 008 T002.
- **Page cursors or part-page offsets drift, split a surrogate, or skip content** — the read found bounds before slicing, surrogate-safe boundaries, and next-unread continuation on every exit (`pages.ts:334-339,351-361,396-422,441-469`).
- **The 66-character bound copies disagree** — both are 66 with the same quoted-length predicate (`lookup-offer.ts:33,58`; `hook-state.ts:278,283`), and the locator suite cross-checks schema behavior against the offer.
- **`tsconfig` excluding tests hides a CI typecheck gap** — the build already type-checks the same `lib/` set; the separate `typecheck` script adds no coverage.
- **The engine README is stale on the moved layout or operations** — the file map, four operations, budget and validation order match the shipped files and configuration.

## Next Focus

- Dimension: cross-reference (all four dimensions covered; fallback per the loop contract).
- Focus area: recheck active `I1-P1-001` and the three playbook P2s against current files, close the two deferred phase-008 evidence gaps (`008-wider-hop-recall-measurement/plan.md`, `description.json` against `spec.md`/`tasks.md`), and trace the catalog success-path exit code (`cli.ts:592-597` with `README.md:144`).
- Reason: maintainability closed clean with the eager-index measurement still deferred; the remaining value is consolidation, carried-finding recheck, and the evidence gaps recorded in iterations 2-4.
- Rotation status: D1 correctness, D2 security, D3 traceability and D4 maintainability reviewed; cross-reference next.
- Carry-forward: `I1-P1-001`, `I1-P2-002`, `I1-P2-003`, `I1-P2-004`, `I2-P2-001`, `I3-P2-001` to `I3-P2-003` stay active. No new P0/P1/P2 from iteration 4.
- Required evidence: phase 008 `plan.md`, `description.json` and `graph-metadata.json`; `cli.ts:592-597`; `history.ts` if the budget allows.
- Recovery note: the eager search-index memory question (`navigator.ts:490-503`) stays deferred because a read-only pass cannot measure it; `history.ts` remains unread and is recorded as deferred evidence, not a pass.

## Verdict

No new findings. The maintainability pass verified the paging and load arithmetic, the README's bound and suite claims, and the build wiring root cause behind the carried P1; the two sweep hits are deliberate fixtures. `I1-P1-001` remains active, so the iteration verdict is CONDITIONAL. `hasAdvisories` is true (seven active P2s).

Review verdict: CONDITIONAL
