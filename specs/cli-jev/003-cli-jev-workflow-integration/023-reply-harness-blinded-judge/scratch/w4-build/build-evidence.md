# Build evidence: 023 reply-harness blinded judge

Build orchestrator leaf, 2026-09-29. Worktree HEAD at start: `bf830c3d47`. Every command ran from the worktree root. Raw outputs sit under `baseline/gates/` and `final/gates/`, one file per check, with `rc.txt` holding each exit code.

## 1. Baseline (before the first dispatch)

`git status --porcelain` before the build: `baseline/git-status-pre.txt` (6 lines, all other orchestrators' paths, none under sk-communication).

| Check | Command | Result line | Exit |
|---|---|---|---|
| Harness tests | `node --test .skilled/skills/sk-communication/benchmark/reply-harness/` | `tests 0`, `pass 0`, `fail 0`: the harness ships no test file | 0 |
| Harness syntax | `node --check` on each harness `.mjs` | all 5 pass | 0 |
| Harness drift, default | `verify_alignment_drift.py --root .../reply-harness` | `Findings: 0` | 0 |
| Harness drift, exact headers | same plus `--check-exact-headers` | 4 ERROR, `blind.mjs`, `compare.mjs`, `generate-prompts.mjs`, `score.mjs` lack a `MODULE:` header | 1 |
| sk-code drift guards | `run-all-drift-guards.sh` | `Findings: 16978`, 50 ERROR, all under `specs/`, none under sk-communication | 1 |
| Catalog package | `validate_catalog_package.py --package sk-communication` | 1 fail: `root_leaf_description_mismatch` on `external-cli-provider.md` | 1 |
| Playbook package | `validate-playbook-package.cjs --package sk-communication` | `PASS ... scenarios=10 categories=4 violations=0` | 0 |
| Skill package | `validate_skill_package.py .skilled/skills/sk-communication --strict` | FAIL: 4 changelog files lack a frontmatter `version`, and SMART ROUTING lacks two router markers | 1 |
| Root metadata | `ci-skill-root-metadata.cjs` | `checked=15 passed=15 failed=0` | 0 |
| Leaf manifests | `ci-leaf-manifest-freshness.cjs` | `checked=15 fresh=15 failed=0` | 0 |
| Hermes copies | `sync-skills-hermes.cjs --check` | `PASS: 72 Hermes skill copies in sync` | 0 |
| Trigger index | `generate-trigger-index.mjs --check` | exit 0, manifest-hash note only | 0 |
| README manifest | `test_readme_manifest.py` | `SUMMARY: discovery=pass exclusions=21/21 manifest=reproducible` | 0 |
| README verdict parity | `test_readme_verdict_parity.py` | `PARITY PASS: verdict diff is empty` | 0 |
| Skill graph | `skill_graph_compiler.py --validate-only` | `VALIDATION PASSED` | 0 |
| validate_document, `SKILL.md` | `validate_document.py .skilled/skills/sk-communication/SKILL.md` | `VALID`, 0 issues | 0 |
| validate_document, skill `README.md` | same on `README.md` | 1 warning `non_sequential_numbering` | 0 |
| validate_document, harness `README.md` | same on `benchmark/reply-harness/README.md` | blocking `missing_required_section: overview` | 1 |
| validate_document, catalog root | same on `feature-catalog/feature-catalog.md` | 1 warning `document_type_fallback` | 0 |
| validate_document, playbook root | same on `manual-testing-playbook/manual-testing-playbook.md` | 1 warning `document_type_fallback` | 0 |
| HVR scan, the five docs above | `hvr_scan.py <file>` | hard blockers: SKILL.md 40, README 3, harness README 1 (`harness`), catalog root 8, playbook root 7 | 1 each |

Census inputs recounted by this leaf with a throwaway one-liner over the committed runs, joining by the text after `^Reply [AB]:` and SHA-256 of the trimmed text: `replies 38 masked 42 distinct 38 matched 38`. `score.mjs` over one committed replies directory took 0.59 s and left `git status --porcelain` unchanged.

## 2. Proof plan

Paths relative to the worktree root. H is `.skilled/skills/sk-communication/benchmark/reply-harness`, R is `specs/sk-communication/006-sk-communication-clarity/005-verification-and-rollout/runs`, and STUB is a temporary directory holding logging stub `cli-deem` and `jev` binaries first on `PATH`.

| # | Goal criterion | Command | Expected |
|---|---|---|---|
| P1 | 1, zero-call census | `PATH=STUB:$PATH node H/judge-agreement.mjs --masked R/blind --masked R/sonnet/blind --masked R/attempt-1/blind --replies` each of the six replies dirs | exit 0, `masked: 42`, `distinct: 38`, `matched: 38`, `stop: fewer than 20 labeled replies`, both stub logs empty |
| P2 | 2, Deem stub skip | P1 plus `--deem --out <tmp>` with the stub health reporting a stub backend | exit 0, last line `deem arm skipped: stub backend`, every earlier line byte-identical to P1 |
| P3 | 2, Jev no credential | P1 plus `--jev --out <tmp>` with the stub `auth status --provider official` exiting 3 | exit 0, identity line `jev: path=... provider=official`, then `jev arm skipped: no credential`, earlier lines byte-identical to P1 |
| P4 | 3, tests | `node --test H/judge-agreement.test.mjs` | exit 0, `pass` at least 18, `fail 0` |
| P5 | 4, label gate | the P1 run | prints `stop: fewer than 20 labeled replies`, no live Deem run because no labels exist |
| P6 | 5, secret grep and tree | `grep -nE 'API_KEY\|TYPESAFE\|Bearer\|Authorization' H/judge-agreement.mjs`, and `git status --porcelain` before and after P1 to P3 | no match (grep exit 1), porcelain identical |
| P7 | parent 3, docs | `validate_document.py` on every changed skill doc | exit 0 each |
| P8 | suites | harness `node --test` and the section 1 gates rerun from the final state | no check worse than its baseline row |

Criterion 6 (`validate.sh --strict` on the phase) belongs to the closure leaf, which edits the phase docs. This leaf runs it read-only and records the result.
