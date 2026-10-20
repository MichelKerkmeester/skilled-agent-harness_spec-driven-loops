---
title: "Research: worktree provisioning and the adapter suite runner after the merge"
description: "One steered deep-research iteration (angle A27) into worktree dependency provisioning and the dispatch adapter suite runner on main after the 2026-10-19 merge: five package trees missing from the provision list, no completeness guard, untested lockfile drift, a bun.lockb gap, silent skips and no CI job for the adapter suites."
trigger_phrases:
  - "worktree provisioning drift"
  - "worktree provision paths missing packages"
  - "adapter suite runner ci gap"
importance_tier: "normal"
contextType: "research"
---

# Research: worktree provisioning and the adapter suite runner after the merge

<!-- ANCHOR:deep-research-post-merge-provisioning -->

**Evidence labels.** Every load-bearing claim carries one label.

- **[confirmed]**: the orchestrator re-ran the check or re-read the cited lines after the iteration (spot checks in `research/steering-log.md`).
- **[documented]**: the iteration recorded primary evidence that the orchestrator did not re-run.
- **[inferred]**: reasoning from the evidence. Each inferred claim names what would confirm it.

## 1. Answer

Provisioning works for every tree it lists, and the owning-runner suites pass, but the list has drifted from the repository and nothing guards it:

- **Five tracked package trees are missing from `worktree-provision-paths.txt`**: `.pi/extensions/pi-cache-optimizer`, `.pi/extensions/pi-fast-mode-w-subagent-support`, `.skilled/skills/mcp-code-mode/mcp-server`, `.skilled/skills/mcp-tooling/mcp-obsidian/mcp-servers/obsidian-mcp` and `.skilled/skills/sk-design/sk-design-md-generator/backend`. The file's header promises every tree a worktree needs to build, test or pass its gates. [confirmed, `.skilled/skills/sk-git/scripts/worktree-provision-paths.txt:16-55`]
- **No test can catch that.** The only completeness-adjacent test iterates the list itself, so an unlisted package is invisible to it. [documented, `.skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh:399`]
- **The three dispatch adapter suites and the hooks vitest tree have no CI job.** A grep of `.github/workflows/` for them returns nothing. [documented]

The adapter suites pass 58 of 58 under the hooks config and the naming suite passes 97 of 97, so the merge regressed nothing here. [documented, `iterations/iteration-001.md`]

## 2. Scope and Method

- **Question.** Which provisioning and adapter-suite-runner paths can still fail, drift or mislead after the merge?
- **Run shape.** One steered iteration (angle A27) by cli-pi with `glm-5.3-flash` at thinking max through llmgateway, stop policy `max-iterations`, convergence off. It runs in parallel with phase 014 as a sibling session in its own worktree, because one research lineage cannot run iterations concurrently.
- **Sources read.** `worktree-naming.sh` (`provision_worktree`, `_wn_deps_satisfied`, the bun and npm choice, the build step), `worktree-provision-paths.txt`, `tests/worktree-naming.test.sh`, `specs/hooks/024-dispatch-adapter-test-repair/`, `.skilled/hooks/vitest.config.ts`, `.github/workflows/`.
- **Checks.** `worktree-naming.test.sh` 97 pass, 0 fail; the three adapter suites 58 of 58 under `.skilled/hooks/vitest.config.ts`; `npx --prefix .skilled --offline vitest --version` resolves vitest 5.0.3. [documented]
- **Incident.** Generation 1 never completed an iteration: llmgateway returned HTTP 500 for `deepseek-v4.1-flash`, and the first concurrent round shared one worktree with the other lineages. The session was restarted on GLM in its own worktree (`research/steering-log.md`).

## 3. Findings

| Id | Severity | Finding | Evidence | Label |
|---|---|---|---|---|
| F1 | P1 | Five tracked package trees are missing from the provision list | `worktree-provision-paths.txt:16-55`; `git ls-files '*package.json'` | confirmed |
| F2 | P2 | No test enumerates tracked manifests against the list, so list completeness is unguarded | `tests/worktree-naming.test.sh:399`, `:417` | documented |
| F3 | P2 | Lockfile drift fails `npm ci` or `bun install --frozen-lockfile` loudly but has no fixture or recovery path | `worktree-naming.sh:557`, `:559` | documented |
| F4 | P3 | The bun choice checks `bun.lock` only, so a `bun.lockb` package falls to npm and gains a second lockfile | `worktree-naming.sh:545` | inferred: confirm with a `bun.lockb` fixture |
| F5 | P2 | The adapter suites and the hooks vitest tree run in no CI job | `.github/workflows/dispatch-enforcement-guard.yml:37` | documented |
| F6 | P3 | `npx --prefix .skilled vitest` in the guard workflow is right today, but sits one root `node_modules` away from the hazard `hooks/024` records | `specs/hooks/024-dispatch-adapter-test-repair/` | documented |
| F7 | P3 | A listed path whose `package.json` disappears is skipped silently, in the script and in the test helper | `worktree-naming.sh:541`, `tests/worktree-naming.test.sh:404` | documented |

## 4. Fix Backlog

1. F1: add the five missing trees to `worktree-provision-paths.txt`, or record why each is excluded.
2. F2: add a test that compares tracked `package.json` files under `.skilled`, `.opencode` and `.pi` with the list.
3. F5: run the three adapter suites, and optionally the whole hooks vitest tree, in a blocking CI job with the owning runner.
4. F3: add a lockfile-drift fixture and decide whether provisioning should report or repair it.
5. F7: warn when a listed path has no manifest.
6. F4: decide how `bun.lockb` packages provision.

## 5. Verification by the Orchestrator

- `git ls-files '*package.json'` under `.skilled`, `.opencode` and `.pi`, compared with the non-comment list entries, leaves exactly the five trees F1 names. F1 confirmed.
- The list holds 12 non-comment entries; the root `.` has no manifest and is skipped, which matches `SECURITY.md`'s "eleven of them today". That count is not drift.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|----------|-------------------|----------|--------------|
| A missing `bun` falling back to npm | Provisioning fails loudly and returns non-zero; the test pins that | `tests/worktree-naming.test.sh` | 1 |
| `SECURITY.md`'s "eleven" as count drift | The twelfth entry is the root, which has no manifest | `worktree-provision-paths.txt`, `SECURITY.md:95` | 1 |
| A runner regression after the merge | The adapter suites pass 58/58 and the naming suite 97/97 | `iterations/iteration-001.md` | 1 |

## Divergence Map

- Saturated directions: none. Convergence mode was off and the stop policy was `max-iterations` with one iteration.
- Pivots taken: none. Pivot failures and audited overrides: none.
- Remaining frontier: whether any gate runs the two `.pi` extension packages' tests in a fresh worktree, which sets F1's practical weight.

## 12. Open Questions

- Does any repo gate run the `.pi` extension packages' `check` or `test` scripts? (`iterations/iteration-001.md`)
- Are the `mcp-code-mode` and `sk-design-md-generator/backend` lockfiles tracked?
- Should the hooks vitest tree join `dispatch-enforcement-guard.yml` or get its own workflow?

## 13. References

- Iteration: `research/iterations/iteration-001.md`; record: `research/deltas/iter-001.jsonl`.
- Steering and incidents: `research/steering-log.md`; the generation 1 attempt is archived under `research_archive/`.
- Resource map: `research/resource-map.md`.
- Sources: `.skilled/skills/sk-git/scripts/worktree-naming.sh`, `worktree-provision-paths.txt`, `tests/worktree-naming.test.sh`, `.skilled/hooks/vitest.config.ts`, `.github/workflows/dispatch-enforcement-guard.yml`, `specs/hooks/024-dispatch-adapter-test-repair/`.
- Sibling phases: `../014-post-merge-deep-research/` (closing synthesis A30), `../015-post-merge-research-sk-vision/`, `../016-post-merge-research-cli-opencode-ci/`, `../018-post-merge-research-conformance/`.

## Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 1
- Questions answered: 1 / 1
- Remaining questions: 0 key questions; the open questions are in section 12
- Last 3 iteration summaries: run 1: A27 worktree provisioning and the adapter suite runner (0.95)
- Convergence threshold: 0 (convergence mode off; stop policy `max-iterations`)
- Divergence summary: no divergent pivots recorded

<!-- /ANCHOR:deep-research-post-merge-provisioning -->
