# Deep Review — Iteration 001 (D1 Correctness)

- Run: run-001 · Session: 2026-10-12T10:01:23.529Z · Generation 1 · Lineage: new
- Target: the playbook root and stale reference commits `b4d4e90192..HEAD` on `worktrees/121-playbook-root-refs` (56 files, 1308 insertions, 169 deletions)
- Focus files: the validator's root-file backticked-path check and its regression test

## Dimension

Correctness. The dispatch carried four questions: (1) does the root check resolve paths from the right bases for a root file; (2) can it double-report or miss a path; (3) does the new test fail without the change and prove what it claims; (4) is the warning still report-only with no unintended exit-code or status effect.

## Files Reviewed

- `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs` (full read; key lines 375-421, 744-757, 796-835, 899)
- `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs` (full read; new case at 164-165)
- `specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/003-playbook-root-and-stale-refs/acceptance-criteria.md` (full)
- `specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/003-playbook-root-and-stale-refs/implementation-summary.md` (full; RR-1 at 81, RM-1 at 106, Verification at 129)
- `specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/003-playbook-root-and-stale-refs/goal.md` (criterion 1 at 57)
- `.skilled/skills/sk-doc/changelog/v2.3.9.0.md` (new release note)
- `.skilled/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/manual-testing-playbook.md:361` and `worktree-isolation/worktree-dry-run-inspection.md:15` (the two residual warnings)
- Diff `b4d4e90192..HEAD`: scripts hunk (34 lines) and repo-wide `--stat`

## Findings by Severity

### P0 — none

No P0 findings this iteration.

### P1 — none

No P1 findings this iteration.

### P2

#### R1-P2-001 [P2] Anchored backticked paths are invisible to `BACKTICK_PATH_UNRESOLVED`

- **Case:** a root playbook (or scenario) cites a path whose extension is not the final token character, e.g. `` `references/gone.md#setup` ``. The extension gate at [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:376] is `$`-anchored, and the token normalization at [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:414] strips only `:\d+` suffixes and trailing punctuation, so the token fails the gate and is skipped before any base is probed. A renamed or deleted anchored target never warns — neither in root files (the surface this phase added) nor in scenarios.
- **File:** `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:376`, `:414`
- **Evidence (OBSERVED):** `node -e` probe over the exact regex — `ext('references/gone.md#setup')` = `false`, `ext` after `#`-strip = `true`; code-read of the gate order (`BACKTICK_SPAN_RE` at `:375` → extension gate → resolution at `:414-421`).
- **Counterevidence sought:** an in-corpus anchored ref that is actually stale. Playbook-scoped `rg` for anchored backticked refs under `**/manual-testing-playbook/**` returned zero lines, and a repo-wide scan found the form only outside playbook files (e.g. `cli-codex/SKILL.md:264`). The miss is therefore a latent class today, not an active stale ref.
- **Alternative explanation considered:** skipping is intentional for tokens like placeholders, globs, absolute, scratch and runtime-output paths (design comment above `:375`) because those are expected not to resolve. Anchored local refs are not in that class — they are ordinary repo refs whose anchor the checker cannot follow — so silence here is a gap, not a designed skip.
- **User impact:** the exact class this checker exists for — a moved file named in a code span — can hide behind a `#fragment`; the goal criterion's count (`goal.md:57`; OBSERVED `n=1 m=1 r=1` → `ok`) stays green while such a ref is stale. The changelog bullet at [SOURCE: .skilled/skills/sk-doc/changelog/v2.3.9.0.md:23] states a path "that resolves from no base prints `BACKTICK_PATH_UNRESOLVED`" with no anchor carve-out, so doc and code disagree; per the evidence rule the code wins and the doc is the defect to fix alongside the check.
- **Finding class:** class-of-bug — one shared emitter (definition at [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:401]; call sites `:757` root, `:773` scenario).
- **Scope proof:** `rg` for `backtickPathChecks` shows one definition and exactly two call sites; a fix at `:414` covers both surfaces. No other emitter of the code exists.
- **Affected surface hints:** ["backtick token normalization", "root scanner", "scenario scanner", "changelog claim"]
- **riskScore:** 2 (advisory only)
- **Confidence:** high (static reading + regex probe). **Upgrade trigger:** an anchored ref found stale in a playbook file → P1. **Downgrade trigger:** none below P2; if the team prefers to widen the changelog wording only, the code gap remains and the finding stays.
- **Recommendation:** strip a trailing `#fragment` in the same normalization that strips `:\d+` (`:414`) before the extension gate and resolution; add one anchored variant to the `backtick-root-file` fixture.

## Verified Clean (ruled out this iteration)

1. **Base resolution for a root file — no defect (DERIVED from code, OBSERVED run).** For the root file, `path.dirname(absPath)` is the playbook root itself, so bases[0] and bases[1] at [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:408] are the same directory. The duplicate is inert: `bases.some(...)` short-circuits and each token pushes at most one warning (the `seen` set before the resolution probe). The strict run over the full discovered fleet printed root warnings only for the documented RM-1.
2. **Double-report — none (OBSERVED + DERIVED).** The root file is excluded from the scenario walk at [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:744]; the root scan at [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:757] is the only pass over root text; `seen` dedupes repeats within a file. The run shows one line per `file:line`, and the new test's `deepStrictEqual` of a single-element array would fail on a duplicate.
3. **Test fails without the change — yes (DERIVED + third-party claim).** Parent `b4d4e90192` has zero `backtickPathChecks(rootText` call sites (OBSERVED: `git show` grep count 0) and the root was already excluded from `scenarioFiles`, so before the change the appended missing path never reaches the checker and the assertion at [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs:164] (line 165) fails. The builder's revert-and-rerun result (RR-1, [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/003-playbook-root-and-stale-refs/implementation-summary.md:81]) is consistent; I did not repeat the revert myself (it would require modifying the frozen target) — re-executing that revert is the step that would confirm it as OBSERVED.
4. **Report-only preserved — yes (OBSERVED + DERIVED).** `BACKTICK_PATH_UNRESOLVED` is pushed to `warnings` only; `status` becomes `FAIL` only when `violationCount > 0` ([SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:797]); the process exit derives from `status === 'FAIL'` ([:826], [:835], [:899]). Both default and `--strict` fleet runs exited 0 with the warnings present. No unintended status or exit effect.
5. **Residual warnings intended — yes (OBSERVED).** Both remaining warnings cite `.cursor/worktrees.json`, which the scenario checks for its *absence* on purpose ([SOURCE: .skilled/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/worktree-isolation/worktree-dry-run-inspection.md:15]); the root line is the same path ([SOURCE: .skilled/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/manual-testing-playbook.md:361]). Documented as RM-1 ([SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/003-playbook-root-and-stale-refs/implementation-summary.md:106]); goal criterion 1 passes with exactly these counts.
6. **Release bump consistent — yes (OBSERVED).** `rg "2\.3\.8\.0"` outside changelog history returns zero hits across `.skilled/skills/sk-doc`, `.hermes/skills/sk-doc` and the compiled-routing activation manifest; every touched version site reads `2.3.9.0`.

## Traceability Checks

- **core `spec_code` — partial (OBSERVED).** Goal criterion 1 ([SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/003-playbook-root-and-stale-refs/goal.md:57]) ran verbatim: `n=1 m=1 r=1` → `ok`. AC-001 ([SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/003-playbook-root-and-stale-refs/acceptance-criteria.md:54]) matches the observed `--strict` output (2 `BACKTICK_PATH_UNRESOLVED` lines: 1 root == 1 RM row, 1 scenario). The full REQ sweep is deferred to D3.
- **core `checklist_evidence` — partial (OBSERVED spot checks).** RR-1 corroborated by the parent call-site grep; SR-1 (`grep -c 'codex/settings.json' codex-tools.md` → 0) and SR-4 (no vitest binary under `system-spec-kit/runtime`, present under `system-skill-advisor/runtime` with the cited test file) pass where sampled. The remaining RR/SR rows were not independently re-executed — D3/D4 material.
- **overlay protocols** (`skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`) — pending; not exercised by this correctness iteration.

## Evidence Log

| # | Check | Command (verbatim where practical) | Result (OBSERVED) |
|---|-------|------------------------------------|-------------------|
| 1 | Validator tests | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs` | exit 0; `fixture suite: PASS (33 negative/positive assertions)`, `contract regressions: PASS (8)`, `prompt sync regressions: PASS (8)`, `piped report regression: PASS (2)`; `clean: PASS; section-order: FAIL` is the seeded negative fixture, `strict default: rc=1 on seeded violation; --no-strict: rc=0; boundary: rc=2` |
| 2 | Validator default | `node .../validate-playbook-package.cjs` | exit 0; every package `violations=0`; exactly 2 `BACKTICK_PATH_UNRESOLVED` warnings |
| 3 | Validator strict | `node .../validate-playbook-package.cjs --strict` | exit 0; same 2 warnings; warnings do not affect exit |
| 4 | Goal criterion 1 | command string from `goal.md:57` | `n=1 m=1 r=1` then `ok` |
| 5 | Parent lacks root scan | `git show b4d4e90192:... | grep -c "backtickPathChecks(rootText"` | `0`; parent call sites: definition `:401`, scenario loop `:773` only |
| 6 | Anchor regex | `node -e` with the exact `BACKTICK_PATH_EXT_RE` | `ext(tok)=false`, `ext(after # strip)=true` |
| 7 | Playbook-scoped anchored refs | `rg -e '`…ext#…' .skilled/skills --glob '**/manual-testing-playbook/**'` | zero lines |
| 8 | Stale version scan | `rg "2\.3\.8\.0"` (sk-doc, hermes mirror, compiled manifest; changelog excluded) | zero lines |
| 9 | SR-1 spot check | `grep -c 'codex/settings.json' .skilled/skills/cli-external-orchestration/cli-codex/references/codex-tools.md` | `0` |
| 10 | SR-4 spot check | `ls` the two vitest locations | absent under `system-spec-kit/runtime`; present with `tests/scorer/native-scorer.vitest.ts` under `system-skill-advisor/runtime` |

## Verdict

PASS — no P0 and no P1 findings this iteration; one P2 advisory (R1-P2-001). `hasAdvisories=true`.

## Next Dimension

Security (D2): the validator's report/exit plumbing and the new root scan path (path handling, regex behavior, unbounded output), plus the sk-doc 2.3.9.0 mirror/compiled-manifest JSON diffs.

Review verdict: PASS
