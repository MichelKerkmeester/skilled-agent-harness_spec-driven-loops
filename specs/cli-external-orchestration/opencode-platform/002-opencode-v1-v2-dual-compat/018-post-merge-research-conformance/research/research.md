---
title: "Research: sk-code-skilled and sk-doc conformance after the merge"
description: "Two steered deep-research iterations (angles A28 and A29) into whether the code and docs changed by the 2026-10-19 merges meet the sk-code-skilled and sk-doc contracts: hygiene, drift guards and doc validators are clean; the misses are test placement, unmounted tests, an untested host adapter and one test-count claim."
trigger_phrases:
  - "post-merge sk-code conformance"
  - "post-merge sk-doc conformance"
  - "unmounted sk-doc frontmatter tests"
importance_tier: "normal"
contextType: "research"
---

# Research: sk-code-skilled and sk-doc conformance after the merge

<!-- ANCHOR:deep-research-post-merge-conformance -->

**Evidence labels.** Every load-bearing claim carries one label.

- **[confirmed]**: the orchestrator re-ran the check or re-read the cited lines after the iteration (spot checks in `research/steering-log.md`).
- **[documented]**: the iteration recorded primary evidence that the orchestrator did not re-run.
- **[inferred]**: reasoning from the evidence. Each inferred claim names what would confirm it.

## 1. Answer

**The merged code meets the sk-code-skilled contract where it is checked automatically.**

- Comment hygiene is clean across all 77 changed code files, with zero `hygiene-ok` suppressions.
- All four shipped drift guards pass at HEAD. The 10 alignment warnings fall on files outside the merged window.
- Headers, dividers, naming and the five runtime mirrors conform.

[documented, `iterations/iteration-001.md`]

**The misses are in test placement and test reach, not style:**

- **Tests beside their sources.** Seven sk-vision test files sit inside `vision-runtime/src/`, which the test-placement convention forbids. [confirmed]
- **Tests no runner runs.** sk-doc's two `test-frontmatter-version*.mjs` files have no runner; one was extended by the merge. [confirmed]
- **An untested adapter.** The sk-vision OpenCode host adapter has no paired test. [documented]
- **`.pi` outside the central runner.** The central Node runner leaves out `.pi`. [confirmed]

**The changed docs meet their sk-doc modes structurally.**

- Every focus-named changed README passes `validate_document.py`, and both changed skill roots pass `quick_validate.py`.
- `SECURITY.md` matches no document-type rule, so it falls back to README rules. That is a P3 advisory.
- The one claim drift is the pi-fast-mode tests README's "80 tests", which no static count reaches.

[documented, `iterations/iteration-002.md`]

## 2. Scope and Method

- **Questions.**
  1. Which code files changed by the merges miss sk-code-skilled, and how?
  2. Which changed docs miss their sk-doc mode, and how?
- **Run shape.** Two steered iterations (A28, then A29) by cli-pi with `glm-5.3-flash` at thinking max through llmgateway, stop policy `max-iterations`, convergence off. The session runs as a sibling of phase 014 in its own worktree.
- **Window.** The branch sides of merges `fe1f8a9a53` (OpenCode dual compatibility), `8e8e95e8e6` (pi fast-mode and sk-vision on OpenCode 2) and `6358d81eba` (dispatch adapter suite runner). The worktree-provisioning commits `bcd2f4d0d1` and `500e8ad14c` reached main on the main side of those merges.
- **Checks, all read-only.**
  - `run-all-drift-guards.sh`.
  - `check-comment-hygiene.sh` over the 77 changed code files.
  - `validate_document.py` without `--fix` over 14 docs, and `quick_validate.py` over the two changed skill roots.
- **Incident.** Generation 1 never completed an iteration: llmgateway returned HTTP 500 for `deepseek-v4.1-flash`, and the first concurrent round shared one worktree with the other lineages. The session was restarted on GLM in its own worktree (`research/steering-log.md`).

## 3. Findings

| Id | Severity | Finding | Evidence | Label |
|---|---|---|---|---|
| F1 | P2 | Seven sk-vision test files sit beside their sources under `vision-runtime/src/`; the convention puts tests in a top-level `tests/` tree | `sk-code-skilled/references/shared/code-organization/directory-and-test-conventions.md:260` | confirmed |
| F2 | P2 | `sk-doc/scripts/tests/test-frontmatter-version.mjs` and `test-frontmatter-version-bump.mjs` run under no runner: the central runner takes only `*.test.mjs` and `*.test.cjs`, and sk-doc's own runner loops `test_*.py`. Commit `e87ea715ed` added 29 lines to one of them | `.skilled/scripts/run-node-tests.mjs:29`, `sk-doc/scripts/tests/run-script-tests.sh:12` | confirmed |
| F3 | P2 | The sk-vision OpenCode host adapter `hooks/opencode/sk-vision.ts`, changed by `a8846ad07c`, has no paired test of its registration wiring | `.skilled/skills/sk-vision/hooks/opencode/sk-vision.ts:16` | documented |
| F4 | P3 | `.pi` is not among the central Node runner's roots, so the `.pi` extension suites run only through their own package scripts | `.skilled/scripts/run-node-tests.mjs:27` | confirmed |
| F5 | P3 | The drift-guard orchestrator `run-all-drift-guards.sh` has no test of its own pass and fail aggregation | `sk-code-skilled/scripts/run-all-drift-guards.sh:1` | documented |
| F6 | P3 | The pi-fast-mode tests README claims "7 files, 80 tests"; the file count holds, but static counts give 68 (the iteration) or 71 (the orchestrator, counting `it.each` lines), so the 80 is unverified until vitest runs | `.pi/extensions/pi-fast-mode-w-subagent-support/tests/README.md:21` | confirmed (claim and file count); test count inferred: confirm with a vitest run |
| F7 | P3 | `SECURITY.md` matches no sk-doc document-type rule and is validated under README rules (`document_type_fallback`) | `validate_document.py` output in `iterations/iteration-002.md` | documented |
| F8 | UNKNOWN | `opencode.json`, changed by `095ddd7246`, was not checked against sk-code-skilled's config standards | `opencode.json:1` | documented (not assessed) |

## 4. Fix Backlog

1. F2: rename both files to `*.test.mjs`, or add them to sk-doc's runner, so the extended test runs.
2. F1: move the seven sk-vision tests into `vision-runtime/tests/`, mirroring `src/`, and confirm the bun test count stays the same.
3. F3: add a host-adapter test that registers the plugin against a stub context and asserts the tools and command it exposes.
4. F4: add `.pi/extensions` to the central runner's roots, or record in the runner why `.pi` stays out.
5. F6: run vitest once and set the README count from its output.
6. F5, F7 and F8: test the orchestrator's exit aggregation, give security-policy docs a document type, and assess `opencode.json`.

## 5. Verification by the Orchestrator

- `ls vision-runtime/src/**/*.test.ts` lists seven test files under `src/`. The iteration named four, and the orchestrator also found `model-modality`, `evidence/prompt-evidence` and `providers/photon`. F1 confirmed and widened.
- `run-node-tests.mjs` sets `ROOTS` to `.skilled/skills`, `.skilled/scripts`, `.opencode/plugins`, `.skilled/bin` and `.skilled/hooks`, with suffixes `.test.mjs` and `.test.cjs`. `run-script-tests.sh` loops `test_*.py`. A grep of `.skilled` and `.github` scripts, configs and workflows finds no reference to either `test-frontmatter-version*` file outside the files themselves. F2 and F4 confirmed.
- `tests/README.md:21` reads "7 files, 80 tests". Seven `.test.ts` files exist, and a static count that includes `it.each` lines gives 71. F6 stays a P3 with an inferred count.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|----------|-------------------|----------|--------------|
| A comment-hygiene breach in the merged code | `check-comment-hygiene.sh` exits 0 over all 77 files, and no suppression is used | `iterations/iteration-001.md` | 1 |
| Drift-guard warnings on the merged files | All 10 alignment warnings fall outside the merged window | `iterations/iteration-001.md` | 1 |
| The two `╔═╗` box headers as new violations | Both files predate the window, and the style guide accepts the box where it already exists | `sk-code-skilled/references/javascript/style-guide.md:60` | 1 |
| A structural sk-doc failure in the changed READMEs | Every focus-named README validates with 0 issues | `iterations/iteration-002.md` | 2 |
| `SECURITY.md` missing from the merge | It reached main on the main side of the same-day merges, which `git merge-base --is-ancestor` confirms | `iterations/iteration-002.md` | 2 |

## Divergence Map

- Saturated directions: none. Convergence mode was off and the stop policy was `max-iterations` with two iterations.
- Pivots taken: iteration 2 moved from code to docs, as iteration 1's next focus named. Pivot failures and audited overrides: none.
- Remaining frontier:
  - about 227 changed docs outside the focus, such as changelogs, catalogs, playbooks and benchmark reports, which have their own mode validators;
  - `opencode.json`'s config conformance.

## 12. Open Questions

- Does the vitest run of the pi-fast-mode suites report 80 tests? (`iterations/iteration-002.md`)
- Does a dedicated adapter-suite runner already run the `.pi` suites, which would retire F4? (`iterations/iteration-001.md`)
- Do the remaining changed docs pass their own sk-doc mode validators? (`iterations/iteration-002.md`)

## 13. References

- Iterations: `research/iterations/iteration-001.md`, `iteration-002.md`. Records: `research/deltas/iter-001.jsonl`, `iter-002.jsonl`.
- Steering and incidents: `research/steering-log.md`. The generation 1 attempt is archived under `research_archive/`.
- Resource map: `research/resource-map.md`.
- Sources:
  - `.skilled/skills/sk-code/sk-code-skilled/`;
  - `.skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh`;
  - `.skilled/scripts/run-node-tests.mjs`;
  - `.skilled/skills/sk-doc/shared/scripts/validate_document.py`;
  - `.skilled/skills/sk-vision/`;
  - `.pi/extensions/pi-fast-mode-w-subagent-support/`.
- Sibling phases:
  - `../014-post-merge-deep-research/`, which holds the closing synthesis A30;
  - `../015-post-merge-research-sk-vision/`;
  - `../016-post-merge-research-cli-opencode-ci/`;
  - `../017-post-merge-research-provisioning/`.

## Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 2
- Questions answered: 2 / 2 in substance; the reducer counts 1 / 2. Iteration 2 recorded its answered question as "Which changed **docs** miss their sk-doc mode, and how?", with markdown emphasis. The reducer matches question text exactly, so the strategy still shows that question open, and the closeout event carries `answered 1/2`. The reducer state was left as written.
- Remaining questions: 0 in substance; the open questions are in section 12
- Last 3 iteration summaries:
  - run 1: A28 sk-code-skilled conformance (0.95)
  - run 2: A29 sk-doc conformance (0.9)
- Convergence threshold: 0 (convergence mode off; stop policy `max-iterations`)
- Divergence summary: no divergent pivots recorded

<!-- /ANCHOR:deep-research-post-merge-conformance -->
