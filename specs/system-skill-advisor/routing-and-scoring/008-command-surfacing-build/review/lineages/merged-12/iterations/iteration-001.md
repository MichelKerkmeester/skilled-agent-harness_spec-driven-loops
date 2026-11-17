# Review Iteration 001 — merged-12

**Lineage:** `merged-12` (detached fan-out, review pass twelve, area `merged`)
**Artifact dir:** `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/merged-12`
**Session:** `fanout-merged-12-1794856957949-n58dw7`
**Diff under review:** `git -c core.fsmonitor=false diff 2f3f893c153 05475f9d044` over the four `merged` paths of `review-scope-12.txt`; whole files read at `05475f9d044` (identical to `HEAD` for these paths). Merge comparison base: `origin/main` `640cd0a2499`.

## Dispatcher

- **Operator review focus (bound):** review pass twelve, area `merged`, per `review/review-brief-12.txt`. The focus names three obligations: the two sk-doc merges must equal `origin/main` except the branch's README phrase narrowings and the `/create:sk-skill` name, the generated intent signals must follow the router, and the doctor install contract test must check the presentation **and the workflow** against the link manifest. This iteration addressed the focus by diffing all three sk-doc files against `640cd0a2499`, by running the router-intent-signal generator in read-only `--check` mode, and by reading the changed doctor test against `symlink-manifest.json`, `doctor-install-presentation.txt` and `doctor-install.yaml`.
- **Dimension this iteration:** correctness.
- **Dimensions planned:** correctness, security, traceability, maintainability.
- **Steer file:** absent at iteration start (`steer.md` does not exist in the lineage directory).

## Files Reviewed

| File | Under |
|------|-------|
| `.skilled/skills/sk-doc/ROUTER.md` | correctness |
| `.skilled/skills/sk-doc/SKILL.md` | correctness |
| `.skilled/skills/sk-doc/graph-metadata.json` | correctness |
| `.skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs` | correctness |

Integration surfaces read as context evidence, not as code findings: `.skilled/commands/doctor/assets/symlink-manifest.json`, `.skilled/commands/doctor/assets/doctor-install-presentation.txt:78`, `.skilled/commands/doctor/assets/doctor-install.yaml:46,60`, `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs`.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The runtime-name contract test's workflow half cannot fail** -- `.skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs:239-240` -- The test is titled "the presentation and the workflow name the accepted runtimes instead of a count", but only the presentation is checked against the link manifest. Its workflow half asserts `assert.doesNotMatch(WORKFLOW.inputs.runtimes, /is not offered/)`, and `inputs.runtimes` names no runtime at all -- it reads "The runtime list, supplied with --runtimes or in the consolidated prompt; the operator can choose the runtimes already there." (`.skilled/commands/doctor/assets/doctor-install.yaml:46`). The names the workflow really prints live in the Ask step (`.skilled/commands/doctor/assets/doctor-install.yaml:60`: "claude, opencode, codex, cursor, devin, pi, vibe, dsh") and are never compared with `symlink-manifest.json`, so the title's claim holds for the workflow only by inspection, not by test.
Case: change the Ask step's runtime list in `doctor-install.yaml:60` to drop `dsh` (or add a retired name such as `gemini`); `node --test .skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs` still passes, because `inputs.runtimes` contains no runtime name and no `is not offered`, while the operator prompt now disagrees with the eight-runtime link manifest.
Finding class: correctness of a contract guard (an assertion that cannot fail for the mismatch its test names).
Scope proof: the changed lines `239-240` are this pass's only change in the reviewed file; the manifest read is the same test at `237-238`; `inputs.runtimes` is the field named at `.skilled/commands/doctor/assets/doctor-install.yaml:46`; the unchecked list is `.skilled/commands/doctor/assets/doctor-install.yaml:60`. Both workflow surfaces are the integration touchpoints the brief names, not scope expansion.
Affected surface hints: the install contract test's runtime guard, the operator-facing Ask prompt in `doctor-install.yaml:60`, and `symlink-manifest.json` as the link manifest the brief requires both artifacts to be checked against.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | `039-main-sk-doc-routing-repair/spec.md:134` (REQ-006) requires "the doctor install presentation, workflow and contract test agree on the runtimes the link manifest offers". Membership currently agrees: the manifest carries eight runtimes (`.skilled/commands/doctor/assets/symlink-manifest.json:5-13`), the presentation names all eight (`doctor-install-presentation.txt:78`), the workflow Ask step names all eight (`doctor-install.yaml:60`), and the test derives the name list from the manifest at `doctor-install-contract.test.cjs:237-238`. The workflow leg of the agreement is not enforced by the test, which is finding 1. |
| `checklist_evidence` | notApplicable | The two sk-doc merged files carry no checklist rows of their own, and the doctor test change is covered by REQ-006 rather than a checklist item of packet `039`. |

## Integration Evidence

- `.skilled/skills/sk-doc/ROUTER.md:203` (SKILL_CREATION keyword `/create:sk-skill`) — the only command-name change from `origin/main`; `/create:sk-skill` is a real route (`.skilled/commands/create/sk-skill.md:7`) and `SKILL.md:29` names the same command.
- `.skilled/skills/sk-doc/graph-metadata.json` — the generated intent-signal writer reports `added=0, orphans=0` for `sk-doc` (`node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs --check --hub sk-doc --json`, exit 0), so `intent_signals_generated` follows `ROUTER.md`'s `INTENT_SIGNALS`.
- `.skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs:237-240` — the only changed hunk in the doctor test binds the presentation to `symlink-manifest.json` and the workflow to the phrase absence described in finding 1.

## Edge Cases

- **Merge base is exact.** `git diff 05475f9d044 HEAD` over the four scope files is empty, so the working tree read equals the reviewed commit. The merge comparison against `640cd0a2499` therefore measures the branch's net result, not an intermediate.
- **Version-only drift.** The sk-doc diffs against `origin/main` also carry version bumps (`ROUTER.md` 2.4.13.0 → 2.4.14.0, `SKILL.md` 2.9.16.0 → 2.10.0.0). These are release metadata, not behavioral divergence, and are the expected carrier of the phrase narrowings.
- **Two intent lists differ by design.** `graph-metadata.json` carries 344 `intent_signals` and 326 `intent_signals_generated`. The 18 extra entries are hand-curated phrases the generator contract permits and never prunes; the generated list itself has no orphan and no missing router phrase.
- **Historical checklist text.** `014-review-remediation/tasks.md:132` (T038) still describes the DSH "is not offered" sentence that the link manifest has since made obsolete. It records what was true when the task ran and is superseded by REQ-006 in packet `039`; it is not a live defect.

## Confirmed-Clean Surfaces

- **sk-doc merge equality.** Every `origin/main` difference in `ROUTER.md` is one of: a version bump, one of the three README phrase narrowings (root-guide `security policy`, hook-readme `git-*`/`spec-gate` names, runtime-plugin `hook mirror readme`), or the `/create:sk-skill` keyword. `SKILL.md` differs only by version and the same command name. No unrelated main content was dropped.
- **Router internal consistency.** `INTENT_SIGNALS` and `RESOURCE_MAP` carry the same 26 keys, and all 134 `RESOURCE_MAP` paths resolve on disk under `.skilled/skills/sk-doc/`.
- **Generated signals follow the router.** The generator's `--check` pass over `sk-doc` reports no missing phrase and no orphan; none of the removed phrases (`install guide`, `security policy`, `hook mirror readme`, the `git-*` hook names, `spec-gate hook readme`) survives in either intent list.
- **Stale command name absent.** No `/create:skill` token remains in the three sk-doc files; the parent-hub `/create:skill-parent` is a different, live command.

## Ruled Out

- **The sk-doc merge dropped a mode.** The `INSTALL_GUIDE` intent and its resource-map entry are absent in both the merge result and `origin/main`; the removal comes from main, not from a branch edit, so it is not a merge regression. `sk-create-readme/assets/install-template.md` still exists and is listed by `leaf-manifest.json`, which is allowed because the resource map need not mirror every leaf.
- **A dead `RESOURCE_MAP` path.** All 134 paths resolve; checked path by path.
- **A stale `intent_signals_generated` orphan.** The generator check would fail on one; it exits 0.
- **A second command-name divergence.** `/create:sk-skill` is the only command token changed from main, and it matches the live command file.

## Next Focus

- Dimension: security.
- Focus area: the same four scope files, read for trust boundaries and disclosure: whether the merged sk-doc routing prose gained or lost any instruction that could widen a write authority, and whether the doctor contract test reads any operator- or environment-controlled path without a boundary.
- Reason: rotation to the second dimension; the correctness pass found one P2 and no blocking surface.
- Required evidence: file:line for every claim, and the generator's exit status as the mechanical signal for the router/intent pair.

Review verdict: PASS
