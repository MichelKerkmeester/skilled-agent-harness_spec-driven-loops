# Review Iteration 002 — Correctness: runtime-test cap warning and drift-guard warning count

## Dispatcher
- Mode: review; target agent: @deep-review; iteration 2 of 5; stop policy max-iterations; run rvw-012-006-remediation-20261010T211804Z.
- Assigned focus: commits e0b32e5e11 (phase 002-webflow-runtime-and-references) and 75289472d0 (phase 003-drift-guard-warning-count) inside the review range 1d078f3356..d1741a28f7.
- Agent definition loaded: .skilled/agents/deep-review.md.

## Dimension
Correctness (second pass): executable verification of the two fix commits' behavior claims — warning placement and text, exit-code stability, warning-count arithmetic, and the completeness of the dead-reference removal.

## Files Reviewed
- `.skilled/skills/sk-code/sk-code-webflow/assets/scripts/test-minified-runtime.mjs` — cap branch and warning print [SOURCE: .skilled/skills/sk-code/sk-code-webflow/assets/scripts/test-minified-runtime.mjs:441]
- `.skilled/skills/sk-code/sk-code-webflow/assets/scripts/runtime-fixture/known-good/src/2_javascript/z_minified/` — polling and guarded fixtures (run live)
- `.skilled/skills/sk-code/sk-code-webflow/assets/scripts/runtime-fixture/known-bad/src/2_javascript/z_minified/` — four throwing fixtures (run live)
- `.skilled/skills/sk-code/sk-code-webflow/references/debugging/debugging-workflows/scroll-interceptor-and-related.md` — removed subsection region [SOURCE: .skilled/skills/sk-code/sk-code-webflow/references/debugging/debugging-workflows/scroll-interceptor-and-related.md:365]
- `.skilled/skills/sk-code/sk-code-webflow/references/performance/webflow-constraints.md` — finding 1 [SOURCE: .skilled/skills/sk-code/sk-code-webflow/references/performance/webflow-constraints.md:168]
- `.skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` — count and summary [SOURCE: .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh:44]
- `specs/sk-code/011-sk-code-poinytail-based-refinement/012-post-merge-deep-review/002-webflow-runtime-and-references/spec.md` — REQ-001 / REQ-002 read-only [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/012-post-merge-deep-review/002-webflow-runtime-and-references/spec.md:100]

## Findings - New

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
1. **Dead spec citation remains in the sk-code-webflow performance reference** -- .skilled/skills/sk-code/sk-code-webflow/references/performance/webflow-constraints.md:168 -- Commit e0b32e5e11 removed the two dead evidence pointers in the scroll-interceptor reference, but the same class survives one file away: the Decision Records link resolves to no file on disk.
- Case: a reader follows the Decision Records link `/specs/005-example.com/024-performance-optimization/decision-record.md` from webflow-constraints.md and the path does not exist in the repository.
- File: .skilled/skills/sk-code/sk-code-webflow/references/performance/webflow-constraints.md:168
- Evidence: the line reads `See [decision-record.md](/specs/005-example.com/024-performance-optimization/decision-record.md) for implementation decisions:`; `test -e specs/005-example.com/024-performance-optimization/decision-record.md` prints TARGET MISSING from the repo root, and `specs/005-example.com` does not exist at all.
- User impact: a dead cross-reference in shipped skill documentation; the dead-pointer class the commit set out to remove is not closed.
- Finding class: class-of-bug
- Scope proof: the sweep `rg --no-filename -o 'specs/[A-Za-z0-9._/-]+\.md' .skilled/skills/sk-code/sk-code-webflow -g '*.md' | sort -u | while read p; do [ -e "$p" ] || echo "MISSING: $p"; done` prints exactly this one path; the fixed scroll-interceptor file now cites no `specs/` path at all, and no reference to the removed `Memory Files (Evidence)` subsection remains anywhere under .skilled/skills/sk-code or .hermes/skills/sk-code. The parent review report and registry do not register this path.
- Affected surface hints: ["sk-code-webflow references", "webflow-constraints.md Decision Records", "doc-claims dead-path sweep"]
- Recommendation: remove or re-point the dead link as the scroll-interceptor fix did, and sweep the Webflow reference tree for the class instead of patching single instances.

### Focus Evidence (confirmed clean)
- **Warning placement and text**: from `runtime-fixture/known-good`, `node ../../test-minified-runtime.mjs` exits 0, prints `Passed:  2/2`, and emits exactly one warning line on `late-element-poll.js` — `⚠ 1 callback(s) past depth 20 were not run, so errors inside them were not checked` — while `guarded-init.js` prints none. Matches phase 002 REQ-001 and SC-001.
- **Known-bad verdicts unchanged**: from `runtime-fixture/known-bad` the same command exits 1 with `Failed:  4/4` and zero warning lines. Matches REQ-002 and SC-002.
- **Pre-fix replay**: the pre-fix script (`git show e0b32e5e11^:<path>` into a fresh `mktemp -d`, run from each fixture root) gives known-good exit 0 with `Passed: 2/2` and zero warning lines, and known-bad exit 1 with `Failed: 4/4`. The warning is tied to the fix and every exit code and verdict is unchanged.
- **Drift-guard summary**: `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` exits 0 with four PASS lines, `PASS: alignment-drift ... (272 warnings)`, and the final line `run-all-drift-guards: all 4 guards PASSED, 272 non-blocking warning(s)`. An independent `grep -c '\[WARN\]'` over the captured stdout counts 272, per-guard attribution puts all 272 on the alignment guard, and stderr carries zero warning lines.
- **Failure path intact**: with a fake failing `python3` first on PATH the script runs all four guards (2 FAIL + 2 PASS lines) and still exits 1 with `run-all-drift-guards: 2 guard(s) FAILED`, so the counting change cannot mask a failing guard.

## Traceability Checks
- `spec_code`: partial — phase 002 REQ-001/REQ-002 and phase 003's warning-count claims verified live above; full checklist evidence across the five phases remains pending for a later iteration.
- `checklist_evidence`: pending.
- overlay protocols (skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability): pending; not required by the assigned correctness focus.

## Integration Evidence
- Surfaces exercised read-only: the sk-code-webflow runtime test harness and its two committed fixture families, and the sk-code-skilled drift-guard umbrella with its four guards (alignment-drift, stack-folders, router-sync, doc-claims). No caller, command, workflow, or mirror outside those was run, and no reviewed file was modified.

## Edge Cases
- The skip counter is not reported when a file FAILs (the FAIL branch never prints it). Observed behavior only; the failure message dominates and no spec claim covers the mixed case, so it is not recorded as a defect.
- The pre-fix extraction instructed by the dispatch (`git show <commit>^:<path>` into a fresh `mktemp -d`, run from the fixture cwd) succeeded this iteration; iteration 1's cp-based variant had been denied by the harness dispatch guard.
- `run-all-drift-guards.sh` produced an empty stderr in this environment, while the commit decision note mentions 281 stderr lines for the alignment guard. The stderr volume appears environment-dependent; the `[WARN]` accounting is unaffected (0 warning lines on stderr).

## Confirmed-Clean Surfaces
- The cap warning fires exactly at the cap, only on the polling fixture, and never in the pre-fix script; verdicts and exit codes for both fixture families are equivalent to the pre-fix runs.
- The two removed evidence pointers are gone and unreferenced; the scroll-interceptor reference now cites no `specs/` paths.
- Independent WARN counting reproduces the printed 272 on the alignment guard, and a failing guard still exits the umbrella with 1 after the loop completes.

## Ruled Out
- Cap-warning false negative / false positive: both fixture families plus the pre-fix replay show one warning, on the fixture that reaches the cap, and none before the fix.
- Exit-code drift from either fix: measured identical (known-good 0→0, known-bad 1→1; drift guards 0 clean, 1 under forced guard failure).
- Drift-guard count mismatch: independent `grep -c` equals the printed per-guard and total counts (272).
- Counting masking a failing guard: the forced-failure probe keeps the FAIL branch, continues the loop, and exits 1.

## Next Focus
- Dimension: security (rotation; orchestrator may reassign).
- Focus area: the remaining doc/claim commits — 019b94a403 (legacy PostToolUse hook name and a real file citation), f4f678328b (two recorded count corrections and the mirror-checker header), d1741a28f7 (trigger-index rebuild).
- Reason: the two executable fix commits are now verified on correctness; one P2 residual stands.
- Rotation status: correctness covered again (PASS, P2=1).
- Carry-forward: productive — fixture runs, git-show pre-fix replay, independent WARN counting, forced-failure probe. Open finding R2-P2-001.
- Required evidence: per-file reads plus targeted command proof per commit.

Review verdict: PASS
