---
title: "Research: cli-opencode docs, the doctor battery and dual-version CI after the merge"
description: "Two steered deep-research iterations (angles A24 and A25) into cli-opencode documentation drift against the installed OpenCode 1.19.3 and 2.0.32, and into whether the doctor version battery and the dual-version CI workflow test what they claim. CI is green on main after three red runs; five doc drifts remain."
trigger_phrases:
  - "cli-opencode flag drift"
  - "opencode dual-version ci result"
  - "doctor version battery claims"
importance_tier: "normal"
contextType: "research"
---

# Research: cli-opencode docs, the doctor battery and dual-version CI after the merge

<!-- ANCHOR:deep-research-post-merge-cli-opencode-ci -->

**Evidence labels.** Every load-bearing claim carries one label.

- **[confirmed]**: the orchestrator re-ran the check or re-read the cited lines after the iteration (spot checks in `research/steering-log.md`).
- **[documented]**: the iteration recorded primary evidence that the orchestrator did not re-run.
- **[inferred]**: reasoning from the evidence. Each inferred claim names what would confirm it.

## 1. Answer

**CI passed on main after the 2026-10-19 merges, but only on the fourth run.** Runs `39294766387`, `39299540911` and `39308825187` failed. The second failure was `bun: command not found` in the build step. The third ran the battery and failed v1 `plugin-load` and v2 `plugin-active`, with `system-skill-advisor.js` and `system-spec-gate.js` reporting `status failed`. Run `39309852507` on `793b50ccbf` passed all three jobs at 19:18Z. [confirmed, `gh run view 39309852507` and `gh run list --workflow opencode-dual-version.yml`]

**The battery and the workflow test what they claim.** The battery's legs and exit codes match its contract, and it pins no versions or counts. The workflow installs the two pinned packages into separate prefixes and runs the battery once per family and once with both installed. Two claims go further than the workflow does:

- **No smoke dispatch runs in CI.** The workflow runs no dispatch smoke; that is an operator step in phase 011. [documented, `.github/workflows/opencode-dual-version.yml:191`, `../011-two-version-proof-and-closeout/proof.md:66`]
- **A trigger path with no job.** `opencode-config-shape.test.cjs` sits in the trigger paths, but no job step runs it. [confirmed, `.github/workflows/opencode-dual-version.yml:18`, `:33`]

**The cli-opencode docs drift from the installed binaries in five places:**

- an undocumented `--share` flag;
- two different default model ids;
- two different agent directories;
- a stale "unverified" note on v2 `--log-level`;
- an incomplete v1 flag summary.

The version baselines, the v1-only and v2-only flag sets and the deep-loop version resolver all match the installed binaries. [documented, `iterations/iteration-001.md`]

## 2. Scope and Method

- **Questions.**
  1. Which cli-opencode docs, flags and subcommands drift from OpenCode 1.19.3 and 2.0.32 as installed?
  2. Do the doctor battery and the dual-version CI workflow test what they claim, and did CI pass on main?
- **Run shape.** Two steered iterations (A24, then A25) by cli-pi with `glm-5.3-flash` at thinking max through llmgateway, stop policy `max-iterations`, convergence off. The session runs as a sibling of phase 014 in its own worktree.
- **Probes.**
  - Help, version and `gh` queries only: `opencode --version`, `opencode2 --version`, and `run --help` on both binaries with the `-m` pin and `</dev/null`.
  - Read-only `gh run list`, `gh run view` and `--log-failed`.
  - No OpenCode server was started, and the shared OpenCode 2 service was never contacted. The battery was not run locally.
- **Sources read.**
  - `cli-opencode/SKILL.md`; `references/cli-reference.md`, `install-and-versions.md` and `agent-delegation.md`.
  - `system-deep-loop/runtime/scripts/opencode-version.cjs`.
  - `.skilled/commands/doctor/scripts/opencode-version-battery.cjs`.
  - `.github/workflows/opencode-dual-version.yml`.
  - `../008-doctor-and-ci/` and `../011-two-version-proof-and-closeout/proof.md`.
- **Incident.** Generation 1 never completed an iteration: llmgateway returned HTTP 500 for `deepseek-v4.1-flash`, and the first concurrent round shared one worktree with the other lineages. The session was restarted on GLM in its own worktree (`research/steering-log.md`).

## 3. Findings

| Id | Severity | Finding | Evidence | Label |
|---|---|---|---|---|
| F1 | P2 | CI was red for three runs on main after the merges and went green on the fourth, the CI-fix merge. The regression window is about 17:30Z to 19:18Z | runs `39294766387`, `39299540911`, `39308825187`, `39309852507` | confirmed |
| F2 | P2 | `--share` is documented as a v1 `run` flag across about ten sites, but installed 1.19.3 `run --help` does not list it; whether it still works as a hidden alias is unverified | `cli-opencode/SKILL.md:168`, `references/cli-reference.md:113`, `references/install-and-versions.md:239` | confirmed (help surface); runtime effect inferred: confirm with a live detached run |
| F3 | P2 | The skill names two default model ids: SKILL.md says `opencode-go/deepseek-v4.1-flash`, cli-reference says `opencode-go/deepseek-v4-flash` for OpenCode 1 | `cli-opencode/SKILL.md:158`, `references/cli-reference.md:158`, `:281` | confirmed |
| F4 | P2 | The agent definition path is stated two ways: `.opencode/agents/<slug>.md` and `.skilled/agents/<slug>.md`; both directories exist | `cli-opencode/SKILL.md:196`, `references/agent-delegation.md:23`, `:35`, `references/cli-reference.md:289` | documented; which one the binary reads is inferred: confirm with `opencode agent list` |
| F5 | P3 | The v2 `--log-level` "unverified on OpenCode 2.0.32" note is stale; installed 2.0.32 lists it with its full choice set | `references/cli-reference.md:107` | documented |
| F6 | P3 | SKILL.md's v1 core-flag summary omits `--attach`, `-p/--password`, `-u/--username` and `-i/--interactive`; cli-reference §4 carries them | `cli-opencode/SKILL.md:168` | documented |
| F7 | P3 | No smoke dispatch runs in CI, and `opencode-config-shape.test.cjs` is in the trigger paths with no job that runs it | `.github/workflows/opencode-dual-version.yml:18`, `:33`, `:191` | confirmed (trigger paths); documented (no smoke) |
| F8 | P3 | Phase 011's proof rows (16 plugins, 57 skill entries) are a dated snapshot; `.opencode/plugins` now holds 17, which the battery reads dynamically | `../011-two-version-proof-and-closeout/proof.md:48` | documented |

## 4. Fix Backlog

1. F3 and F4: pick one default model id and one agent path, and make SKILL.md and every reference agree.
2. F2: run one live detached `--share` dispatch on 1.19.3; drop the flag from the docs if it does nothing, or document it as a hidden alias if it works.
3. F7: run `opencode-config-shape.test.cjs` in a workflow step, or drop it from the trigger paths.
4. F1: no fix needed, since CI is green. If a later investigation needs the cause of the v1 `plugin-load` failure at `6d7f6b8499`, the `battery-v1` artifact from run `39308825187` holds it.
5. F5, F6 and F8: refresh the stale note, the flag summary and the proof wording ("16 at the time of the proof").

## 5. Verification by the Orchestrator

- `gh run view 39309852507`: conclusion `success` on `793b50ccbf`, and all three jobs succeeded. `gh run list` shows the three earlier failures in order. F1 confirmed, and iteration 1's "red on main" verdict is superseded.
- `opencode run -m opencode-go/deepseek-v4.1-flash --help </dev/null | grep -c -- --share` prints `0`. F2's help-surface half is confirmed.
- `SKILL.md:158` names `deepseek-v4.1-flash`, while `cli-reference.md:158` and `:281` name `deepseek-v4-flash` for OpenCode 1. F3 confirmed.
- `opencode-dual-version.yml` lists `opencode-config-shape.test.cjs` at lines 18 and 33, the trigger paths, and in no step. F7's trigger half is confirmed.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|----------|-------------------|----------|--------------|
| Reading CI as red on main | Iteration 1 saw three failures; the fourth run, after the CI-fix merge, passed all three jobs | `gh run view 39309852507` | 1, 2 |
| A battery that pins stale counts | The only literals in the battery are timeouts and attempt counts; families come from parsing `--version` | `opencode-version-battery.cjs:50`, `:400`, `:470` | 2 |
| The deep-loop version resolver as a drift source | Its PATH order, `OPENCODE_BIN` override and version pattern match both installed outputs | `opencode-version.cjs:24`, `:202` | 1 |
| `<bin> help run` as a probe | It prints top-level help on v1 and errors on v2; `run --help` is the form the drift procedure names | `iterations/iteration-001.md` | 1 |

## Divergence Map

- Saturated directions: none. Convergence mode was off and the stop policy was `max-iterations` with two iterations.
- Pivots taken: iteration 2 picked up iteration 1's open question about which battery leg failed and answered it from `--log-failed`. Pivot failures and audited overrides: none.
- Remaining frontier: three runtime probes that a help-only iteration cannot make. They are whether `--share` works, which agent directory the binary reads, and whether the battery's failing legs from run `39308825187` reproduce locally.

## 12. Open Questions

- Does OpenCode 1.19.3 accept `--share` at runtime? (`iterations/iteration-001.md`)
- Which agent directory does the installed binary read? (`iterations/iteration-001.md`)
- Which plugin failed the v1 import harness at `6d7f6b8499`, and why? (`iterations/iteration-002.md`)

## 13. References

- Iterations: `research/iterations/iteration-001.md`, `iteration-002.md`. Records: `research/deltas/iter-001.jsonl`, `iter-002.jsonl`.
- Steering and incidents: `research/steering-log.md`. The generation 1 attempt is archived under `research_archive/`.
- Resource map: `research/resource-map.md`.
- Sources:
  - `.skilled/skills/cli-external-orchestration/cli-opencode/`;
  - `.skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs`;
  - `.skilled/commands/doctor/scripts/opencode-version-battery.cjs`;
  - `.github/workflows/opencode-dual-version.yml`;
  - CI runs `39294766387`, `39299540911`, `39308825187`, `39309852507`.
- Sibling phases:
  - `../014-post-merge-deep-research/`, which holds the closing synthesis A30;
  - `../015-post-merge-research-sk-vision/`;
  - `../017-post-merge-research-provisioning/`;
  - `../018-post-merge-research-conformance/`.

## Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 2
- Questions answered: 2 / 2
- Remaining questions: 0 key questions; the open questions are in section 12
- Last 3 iteration summaries:
  - run 1: A24 cli-opencode docs and flag drift (0.9)
  - run 2: A25 doctor battery and dual-version CI (0.85)
- Convergence threshold: 0 (convergence mode off; stop policy `max-iterations`)
- Divergence summary: no divergent pivots recorded

<!-- /ANCHOR:deep-research-post-merge-cli-opencode-ci -->
