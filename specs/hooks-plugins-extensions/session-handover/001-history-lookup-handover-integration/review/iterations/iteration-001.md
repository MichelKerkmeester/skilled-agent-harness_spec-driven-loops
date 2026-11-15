# Iteration 001 — Correctness (inventory pass)

## Dimension

Correctness, plus the inventory pass that maps the moved engine and its consumers. Operator focus carried in addition: the four named residuals (old-path sweep, the never-run CI engine step, the projection-test silent skip, and the duplicated 66-character bound).

## Dispatcher

- Mode: review, native LEAF execution, no delegation.
- Iteration: 1 of 10 (JSONL-derived: 0 prior iteration records).
- Run / sessionId: `2026-11-15T17:33:23.837Z`, generation 1, lineageMode `restart`.
- Node budget: 24 tool calls; this iteration used its analysis share and wrote before the ceiling.
- Target: files changed in `169da2e8cba..1c7bc3d9d63` (63 declared files; `git diff --stat` reports 54 changed files, 47026 insertions, 46234 deletions).

## Files Reviewed

| File | Lines / focus |
|------|---------------|
| `.github/workflows/spec-kit-check.yml` | 1-383, especially trigger paths 3-85 and the engine step 296-302 |
| `.github/workflows/hook-vitest-suites.yml` | 40-54 (collection and install) |
| `.skilled/hooks/vitest.config.ts` | 17-47 (include/exclude globs) |
| `.skilled/hooks/session-handover/history/package.json` | 1-12 (build/test script paths) |
| `.skilled/hooks/session-handover/history/lib/lookup-offer.ts` | 1-90 (command, quote, 66 bound, entry/core paths) |
| `.skilled/hooks/session-handover/history/lib/cli.ts` | 25-26 (runtime dist imports) |
| `.skilled/hooks/session-handover/bin/history-lookup.mjs` | 1-50 (entry, `core_unavailable`) |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts` | 271-307 (pinned bound, schema refine) |
| `.skilled/hooks/shared/tests/session-readers/project.test.mjs` | 25-34, 141-155 (schema path and skip branch) |
| `.skilled/hooks/session-handover/history/tests/history-locator.vitest.ts` | 20, 154-155 (boundary derivation) |
| `.skilled/hooks/session-handover/history/tests/history-projection.vitest.ts` | 230-231 (old-dist compatibility string) |
| `.skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs` | 102-111 (package entry) |
| `.skilled/skills/sk-git/scripts/worktree-provision-paths.txt` | 1-45 (ordering and entry at 41) |
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/README.md` | 25 (pointer to the new engine) |

Repo-wide sweep (read-only): `rg -n 'runtime/hooks/lib/history'` over the repository excluding `.git` and `specs/**/review-archive/**`.

## Findings — New

### P0 Findings

None.

### P1 Findings

1. **The history-engine CI step cannot resolve `tsc` on a clean runner** -- `.skilled/hooks/session-handover/history/package.json:6` -- The package's `build` script runs `../../../skills/system-spec-kit/node_modules/.bin/tsc --build`, i.e. `.skilled/skills/system-spec-kit/node_modules/.bin/tsc`. The only workflow that runs it, `.github/workflows/spec-kit-check.yml:301`, sits after an install set (lines 181-194 and 276-286) that provisions `.opencode/skills/system-spec-kit` and the `.skilled` root but never `.skilled/skills/system-spec-kit`. `.skilled/skills` is a real directory, not a link to the `.opencode` tree; `.skilled/package.json` declares neither `workspaces` nor a `postinstall`; and `typescript` is not a `.skilled` root dependency. On a clean GitHub runner the path is absent, `npm run build` exits non-zero, and the `runtime-vitest` job goes red for every push that triggers it.
Case: a push touching `.skilled/skills/system-spec-kit/**` triggers `runtime-vitest`; the step at line 301 runs the engine build; `../../../skills/system-spec-kit/node_modules/.bin/tsc` does not exist and the step fails before any test runs.
Finding class: cross-consumer
Scope proof: `rg -n 'npm-ci-retry\.sh' .github/workflows/spec-kit-check.yml` lists every install target and none is `.skilled/skills/system-spec-kit`; `jq '.workspaces, .scripts' .skilled/package.json` returns `null` for both; `ls -ld .skilled/skills` shows a directory, not a symlink; `readlink -f .skilled/hooks/session-handover/history/../../../skills/system-spec-kit/node_modules/.bin/tsc` resolves only because this machine has a local install.
Affected surface hints: ["runtime-vitest job", "history package build script", "worktree provisioning", "dist-freshness rebuild command"]
```json
{"type":"claim","claim":"The runtime-vitest history-engine build step fails on a clean GitHub runner because its hardcoded tsc path is never installed.","evidenceRefs":[".skilled/hooks/session-handover/history/package.json:6",".github/workflows/spec-kit-check.yml:181-194",".github/workflows/spec-kit-check.yml:276-286",".github/workflows/spec-kit-check.yml:301"],"counterevidenceSought":"Checked whether .skilled/skills is a symlink to .opencode/skills (real directory), whether .skilled/package.json declares workspaces or a postinstall (neither), whether any step installs .skilled/skills/system-spec-kit (none), and whether the local path exists only because of a machine-local install (it does).","alternativeExplanation":"A runner image or repo hook could pre-provision the nested node_modules; nothing in the workflow, the package manifests, or the tracked tree does, and node_modules is gitignored.","finalSeverity":"P1","confidence":"high","downgradeTrigger":"A workflow step, .skilled package script, or runner image is shown to install .skilled/skills/system-spec-kit before line 301."}
```

### P2 Findings

2. **Engine-only changes never run the engine's vitest suites** -- `.github/workflows/spec-kit-check.yml:6-44` -- Neither the `push` nor the `pull_request` path filter lists `.skilled/hooks/**`, so the only job that runs `.skilled/hooks/session-handover/history/tests/*.vitest.ts` (the engine step at lines 296-302) does not start for an engine-only commit. The always-on `hook-vitest-suites.yml` does not close the gap: its include glob `**/*.{test,spec}.?(c|m)[jt]s?(x)` (`.skilled/hooks/vitest.config.ts:40`) does not match the `.vitest.ts` suffix, which is the only pattern the engine's own config collects (`.skilled/hooks/session-handover/history/vitest.config.ts:12`).
Case: a commit changing only `.skilled/hooks/session-handover/history/lib/lookup-offer.ts` runs no suite that imports that file, so a bound or command regression ships unobserved.
Finding class: matrix/evidence
Scope proof: `rg -n 'npm --prefix \.skilled/hooks/session-handover/history' .github/workflows` returns only `spec-kit-check.yml:301-302`; the hooks config include/exclude pair excludes every non-vitest JS test and never adds `.vitest.ts`; the history package test script is invoked only from that step.
Affected surface hints: ["spec-kit-check trigger paths", "hook-vitest-suites include glob", "history vitest config"]

3. **The projection schema test degrades to a skip when the schema file is missing** -- `.skilled/hooks/shared/tests/session-readers/project.test.mjs:141-142` -- The published-schema block is guarded by `if (!existsSync(SCHEMA_PATH))` and substitutes `test('schema: not published', { skip: ... })`. The path resolves today, so the validation block runs, but a future move or deletion of `history-entry.schema.json` turns the contract check into a reported skip instead of a failure, and the suite stays green. The test never asserts that the published schema exists.
Case: a later engine relocation or a mistaken delete removes `history-entry.schema.json`; the suite prints one skipped test and CI passes while projected entries are no longer validated against any schema.
Finding class: test-isolation
Scope proof: the guard at line 141 is the only existence check; the schema path at lines 26-34 resolves to the moved engine's `lib/`; no sibling test asserts the file's presence.
Affected surface hints: ["project.test.mjs", "history-entry.schema.json", "history projection contract"]

4. **The pinned 66-character bound is only behaviourally pinned in one direction** -- `.skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts:276-284` -- The copy and the engine agree today (`LOOKUP_OFFER_MAX_QUOTED_SESSION_ID = 66` at line 278; `HISTORY_LOOKUP_MAX_QUOTED_SESSION_ID = 66` at `.skilled/hooks/session-handover/history/lib/lookup-offer.ts:33`) and the quoting transform is textually identical. But the constant is module-private and no test reads it; the engine's boundary cases derive from its own constant (`.skilled/hooks/session-handover/history/tests/history-locator.vitest.ts:154-155`: a 64-character plain id, and 17 apostrophes = 70 quoted characters). A raised copy (66→67) keeps both cases green, so the prose claim at line 276 that "the engine's tests hold this copy equal to its own" overstates the guarantee.
Case: an edit raises the hook-state copy to 67; the schema accepts a 67-quoted id the engine still refuses, and no suite fails, so the persisted-locator schema and the offer bound drift apart silently.
Finding class: cross-consumer
Scope proof: `rg -n 'LOOKUP_OFFER_MAX_QUOTED_SESSION_ID' .skilled` returns the private declaration only; `rg -n '66|LOOKUP_OFFER' .skilled/hooks/session-handover/history/tests/*.vitest.ts` returns only imports, so no test pins the copy's value; the boundary arithmetic at lines 154-155 cannot distinguish 66 from 67.
Affected surface hints: ["hook-state HistoryLocatorSchema", "lookup-offer bound", "history-locator boundary test"]
Downgrade trigger: a test is shown elsewhere that reads or exports the hook-state constant.

## Traceability Checks

| Check | Result | Evidence |
|-------|--------|----------|
| `spec_code` (core) | partial | The parent `specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/spec.md:102` still describes phase 002 as modifying the old engine path; the shipped code matches the new path (`.skilled/hooks/session-handover/history/lib/lookup-offer.ts:20`). The row is a historical phase record, not a live contract. |
| `checklist_evidence` (core) | deferred | No `checklist.md` or `acceptance-criteria.md` appears in the 63-file target; `008-wider-hop-recall-measurement/tasks.md` exists but was not read this iteration. Deferred to the traceability dimension. |
| `skill_agent` (overlay) | notApplicable | No `SKILL.md`, command, or agent definition is inside the declared target. |
| `agent_cross_runtime` (overlay) | notApplicable | No runtime mirror path is inside the declared target. |
| `feature_catalog_code` (overlay) | deferred | `system-spec-kit/feature-catalog/context-preservation/compaction-history-lookup.md` is in scope; not read this iteration. |
| `playbook_capability` (overlay) | deferred | The three playbook files in scope were not read this iteration. |
| Residual 1: old engine path sweep | pass, with historical residue | `rg -n 'runtime/hooks/lib/history' .skilled .github .opencode --glob '!**/node_modules/**' --glob '!**/dist/**'` returns no hits. All 48 files that still name the path live under `specs/`. The one live harness reference is the known `001-hop-recall-baseline/scratch/harness/hop-recall.sh:18`, owned by phase 008 T002 and excluded from this report. |
| Residual 2: CI engine step would pass as written | fail | Finding 1 (build cannot resolve `tsc`) and Finding 2 (engine-only changes never reach the step). |
| Residual 3: missing schema becomes a silent skip | latent gap | The path resolves today; the skip branch at `project.test.mjs:141-142` is currently dead but is the only guard. Finding 3. |
| Residual 4: 66-character bound equals the engine bound | equal today, pin is one-sided | `hook-state.ts:278` = 66; `lookup-offer.ts:33` = 66; both quote with `'${value.replace(/'/g, "'\\''")}'` (`lookup-offer.ts:53`, `hook-state.ts:282`). Finding 4 covers the enforcement gap. |
| Provisioning path | pass | `.skilled/skills/sk-git/scripts/worktree-provision-paths.txt:41` names the new engine root and orders it after the spec-kit runtime, which its CLI imports. |
| Dist freshness registration | pass | `.skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs:105-110` registers root `.skilled/hooks/session-handover/history`, `dist/cli.js`, and the matching rebuild command. |

## Integration Evidence

- `.github/workflows/spec-kit-check.yml:296-302` — the only job that builds and tests the engine.
- `.github/workflows/hook-vitest-suites.yml:53-54` with `.skilled/hooks/vitest.config.ts:40` — the always-on hook tree does not collect `.vitest.ts` files.
- `.skilled/hooks/session-handover/history/lib/lookup-offer.ts:83-85` — the printed command's entry and compiled-core paths both resolve to the new location.
- `.skilled/hooks/session-handover/bin/history-lookup.mjs:19-49` — the entry imports `../history/dist/cli.js` and converts a load failure into `core_unavailable` (exit 2) rather than a crash.
- `.skilled/hooks/session-handover/lib/relaunch-core.cjs:876-893` — runtime dist and engine dist both point at the new roots.
- `.skilled/skills/system-spec-kit/runtime/hooks/lib/README.md:25` — explicitly says the engine is no longer here and links the new folder.

## Edge Cases

- **The engine suites were not executed.** This iteration is a read-only review; builds and repo test tooling are outside its allowed actions. Findings 1 and 2 rest on static resolution of install sets, globs, and script paths, not on an observed red run. The first execution of the engine step on GitHub is the confirming signal.
- **The 48 old-path hits are historical packet records, not live surfaces.** They are concentrated in phase 001, 002, 004, 005 and 007 docs (plans, completed task checks, goals, scratch briefs). They are recorded as residual-1 residue, not raised as findings, because the declared target does not include those files and the operator asked for live references.
- **`history-projection.vitest.ts:230` names the old compiled path deliberately.** It sits beside the new path at line 231 as a backward-compatibility case for older transcripts, matching the comment at `history.ts:332` about commands that older transcripts still hold. Read as intentional, not drift.
- **Local installs mask Finding 1.** `.skilled/skills/system-spec-kit/node_modules` exists on this machine, so `npm run build` works locally and reads as correct. The defect surfaces only on a clean checkout.
- **The bound equality is genuine today.** The residual's stated requirement (hook-state copy equals the engine bound) holds at 66 with an identical quote transform; Finding 4 concerns the missing enforcement, not a present mismatch.

## Confirmed-Clean Surfaces

- No live code, test, CI, or provisioning reference resolves to the retired engine path.
- The printed lookup command, its entry, and its compiled core all resolve under `.skilled/hooks/session-handover/`.
- A missing or broken engine build yields the typed `core_unavailable` refusal instead of an unhandled import error.
- Dist-freshness and worktree provisioning both register the moved package with the correct root and rebuild command.
- The hooks runtime README no longer claims to host the engine.
- The two 66-character bounds are numerically equal and quote identically.

## Ruled Out

- **Stale import of the retired engine location** — every import found resolves to `.skilled/hooks/session-handover/history` or to the spec-kit runtime dist; no module still loads the old tree.
- **The old-path sweep found live drift** — the sweep's only executable hit outside `specs/` is the intentionally excluded harness line, and the 48 spec hits are historical prose.
- **The projection schema skip is live dead code** — the resolved schema file exists, so the validation block currently runs; the gap is latent, and it is reported as Finding 3 rather than as a present failure.
- **The bound copies disagree** — no; both are 66 with the same quote transform.

## Next Focus

- Dimension: security.
- Focus area: the lookup CLI's trust boundary — `sessionId`, `handle` and `workspace` validation in `history/lib/cli.ts`, locator minting in `locator-digest.ts`, shell quoting in the model-visible offer, and whether retrieved history is structurally treated as data in `response.ts` and `pages.ts`.
- Reason: correctness inventory is complete and carries one P1; security is the next uncovered dimension and shares the same entry points.
- Rotation status: D1 correctness reviewed; D2 security next; D3 traceability and D4 maintainability remain.
- Carry-forward: Finding 1 stays active until a fix or a proven provisioning step lands; Finding 2 explains why a red step could go unnoticed and should be re-checked with the fix.
- Required evidence: `history/lib/cli.ts` gates, `history/lib/locator-digest.ts`, `history/lib/response.ts`, and the locator schema's refine chain.
- Recovery note: none; no approach is exhausted.

## Verdict

One active P1 (the engine CI step fails as written) plus three P2 findings. No P0. Verdict is CONDITIONAL.

Review verdict: CONDITIONAL
