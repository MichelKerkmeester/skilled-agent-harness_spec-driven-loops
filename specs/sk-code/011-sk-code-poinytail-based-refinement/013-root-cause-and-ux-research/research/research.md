---
title: "Research: root causes and external-user experience of the sk-code Ponytail refinement epic"
description: "Checked synthesis of a ten-iteration DeepSeek V4.1 Flash lineage: the producing mechanism behind each process error and open product issue of the epic, what they cost a person who adopts this framework in another repository, and small fixes ranked by that cost."
trigger_phrases:
  - "root cause and ux research synthesis"
  - "external user experience framework"
  - "ponytail epic root causes"
importance_tier: "important"
contextType: "research"
---
# Research: root causes and external-user experience of the sk-code Ponytail refinement epic

One lineage, `dsflash-llmgw`, ran ten iterations on DeepSeek V4.1 Flash at max effort through cli-pi on the llmgateway route, stop policy max-iterations. Its own report is `lineages/dsflash-llmgw/research.md` and its iterations are under `lineages/dsflash-llmgw/iterations/`. This file is the orchestrator's synthesis. Every load-bearing claim below was re-checked by the orchestrator in the worktree at base `5d9c970447`, and carries one mark:

- **[VERIFIED]**: the orchestrator read the cited line or ran the named command, and the result would have differed had the claim been false.
- **[INFERRED]**: follows from evidence but was not directly confirmed; the settling check is named.

---

## 1. Executive Summary

Most of the epic's errors share one shape: **two copies of one fact, kept in step by hand, with no reader that fails when they part.** A served runtime file and its authored source, three copies of one 500 ms constant, test literals that pin the size of a growing set, Hermes and mirror copies of skills, and a changelog version chosen from the local branch only. The epic's guards were green because each guard read the copy that had been updated.

The highest external-user impact found is new to this research: the default compiled-route rebuild fails on a clean checkout of main. `compiled-route-sync.cjs --check` exits 1 with `authored closure failed to resolve hubs: cli-classifier`, because the authored source of the cli-classifier harness still names a removed `cli-deem` mode. The epic verified with `--verify`, which traces only the served copy and passes. The same stale line produces 15 of the 16 manifest test failures, not the `all 6 hubs` pin the lineage named.

Nine small phases follow in section 9, each one file and one proving command.

---

## 2. Method

1. Scaffolded this phase with `create.sh` and authored `goal.md` with sk-create-goal; `check-goal.cjs` printed `RESULT: PASSED (5/5 checks)`.
2. Ran the /deep:research auto workflow's fan-out step with one cli-pi lineage, as the round-three lineage `r3-dsflash-llmgw` did. `orchestration-summary.json` records `succeeded: 1`, `completed_with_containment_advisory: 0`, run time 30 minutes. The llmgateway route never hit a limit, so the cline-pass fallback was not used.
3. Ran the synthesis steps: `fanout-merge.cjs` (15 key findings merged) and `reduce-state.cjs --emit-resource-map --fanout-resource-map-only` (10 delta sources).
4. Spot-checked every claim the phases below depend on, by reading the line or running the command, from the worktree root. All 60-odd SOURCE tags in the lineage report resolve to an existing path and line.

---

## 3. The Common Root Cause

| Pair that must agree | Who updates it | What reads both | Evidence |
|---|---|---|---|
| Served cli-classifier harness and its authored source | Commit `8544df2238` updated only the served copy | `compiled-route-sync.cjs --check` and the default rebuild; `--verify` reads only the served copy | [VERIFIED] [SOURCE: specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/008-cli-classifier/harness/build-artifacts.cjs:67] |
| 500 ms short-host stdin deadline | Hand-copied in three files | Nothing compares them | [VERIFIED] [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/shared-stdin.ts:23] [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/lib/hook-adapter-shared.mjs:17] [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:27] |
| Scenario corpus size and its test pin | Scenarios added, pin left at 80 | The admission test, which fails | [VERIFIED] [SOURCE: .skilled/bin/tests/compiled-route-admission.test.cjs:32] |
| Destination of the jev prompt and the cli-external canary | The transport moved to cli-classifier; the case stayed | The canary, which defers | [VERIFIED] [SOURCE: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/fixtures/canary-cases.v1.json:201] |
| Changelog version on main and on a branch | Each branch mints from its own folder | Only the merge | [VERIFIED] [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/SKILL.md:253] |

The epic's own decision made part of this drift structural: builders may not run the Hermes generator or a compiled-route re-mint, so every parallel build leaves drift that only the orchestrator clears [VERIFIED] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/goal.md:50]. That decision is sound for parallel builds. The gap is that the gate run after the re-mint read one copy of each pair.

---

## 4. Process Errors

**(a) The doubled tasks.md tail.** A fix-unit insertion passed authored check text as the string argument of `String.replace`. The text held a dollar-apostrophe sequence, which JavaScript expands to the text after the match, so the file tail was pasted twice [VERIFIED] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/005-doc-claims-hardening/goal.md:93]. The same class shipped once before in the nested changelog generator, whose fix is a replacer function with a comment naming both sequences [VERIFIED] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec-folder/nested-changelog.ts:569]. The insertion helper was a one-off scratch script, so no product fix is owed.

**(b) The validator and link-shaped task text.** The current link scanners blank code spans and fences before matching `](` [VERIFIED] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs:95]. Which validator run produced the incident is UNKNOWN: no goal log or commit body records it. The failing run's stderr would settle it.

**(c) The wildcard `rm` and (d) the committed scratch regeneration.** Run outputs and planner helpers share one `scratch/` folder, so a wildcard cleanup cannot tell them apart, and the packet commits scratch as evidence. One commit added three generations of one unit tree, 235 files under `scratch/units*` [VERIFIED: `git show --stat ceb8ff216c | grep -c scratch/units` printed 235]. The incident records for the deletion itself are UNKNOWN [INFERRED from the lineage's search of the packet].

**(e) Claims before verification.** The parent rule makes an executor's report a claim and has the orchestrator rerun goal criteria [VERIFIED] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/spec.md:87]. A criterion can only recheck an outcome, so process steps such as "capture before-state" stay report-only. The compiled-route case in section 3 shows the sharper version: the claim was checked, but by a command that read the other copy.

**(f) Generated-artifact drift.** Structural, per decision D4 above. The family is five writers: Hermes copies, Codex and Pi mirrors, the compiled-route manifest with its authored copy, the leaf manifest, and the trigger index with its retrieval fixtures [INFERRED from the lineage's iteration 2 and the merge commit body of `144b1d339e`].

**(g) The changelog version collision.** The changelog skill picks the next version from the entries in the local target folder and makes it unique only locally [VERIFIED] [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/SKILL.md:253]. Main and the branch both minted system-spec-kit v2.7.1.0; the merge moved the branch's notes into v2.7.2.0 [VERIFIED] [SOURCE: .skilled/skills/system-spec-kit/changelog/v2.7.2.0.md:18].

---

## 5. Open Product Issues

| Issue | Root cause | Mark |
|---|---|---|
| Manifest tests 26 pass, 16 fail | 15 failures carry `authored closure failed to resolve hubs: cli-classifier`; the 16th asserts 6 hubs and gets 7 [SOURCE: .skilled/bin/compiled-route-sync.cjs:51]. Deleting the stale `cli-deem` line in a scratch copy of the authored program cleared the closure error | [VERIFIED: `node --test .skilled/bin/tests/compiled-route-manifest.test.cjs` printed `tests 42`, `pass 26`, `fail 16`; a per-test TAP attribution put 15 on the closure error] |
| Admission test pins 80 against 86 | Change-detector pin not updated | [VERIFIED: the suite printed `actual: 86, expected: 80`] |
| `jev-transport-single` canary defers | The case stayed in the cli-external fixture after its transport moved to cli-classifier [SOURCE: .skilled/skills/cli-external-orchestration/mode-registry.json:8] | [VERIFIED] |
| Advisor battery 13 of 17, 2 of 5 false positives | Hub-owned tokens and paths in a prompt outrank intent tokens; the rule requires 14 of 17 and 0 of 5 [SOURCE: .skilled/skills/sk-code/manual-testing-playbook/skill-advisor-integration/advisor-probe-battery.md:60] | [INFERRED from the recorded run; rerun the battery to confirm] |
| Advisor never passes `--surface-hint` | The handler calls the front door with `--hub` and `--prompt-stdin` only [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:376]; the front door accepts the hint [SOURCE: .skilled/bin/compiled-route.cjs:36]. The handler has no session-surface input to pass | [VERIFIED: `rg -n -i surface` over the handler found no surface source] |
| 36 HVR hard blockers in sk-code SKILL.md | 27 semicolons and 9 em dashes left in the hub file | [VERIFIED: `hvr_scan.py` printed `hard blockers: 36`] |
| 500 ms deadline, no late-write test | A payload written after 500 ms on an open stdin is cut short and the hook takes its empty answer, with no record [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/007-hook-deadline-margins/implementation-summary.md:128] | [VERIFIED] |
| Reducer lowered open findings in 146 folders | Deduplication: a narrative F### finding now yields to the structured row of its iteration [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1002]. Measured `changed=146 raised=0 liveErrors=43` [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/006-deep-loop-findings-parser/spec.md:111]. The 43 erroring folders are unexamined | [VERIFIED] |

---

## 6. The External-User Lens

1. **The rebuild fails out of the box.** An adopter who runs the documented rebuild of the compiled routes on main gets `SYNC FAILED: authored closure failed to resolve hubs: cli-classifier`, and the authored source it names lives under `specs/sk-doc/z_archive/`, a folder a user would assume is history [VERIFIED: `compiled-route-sync.cjs --check` exit 1; `--verify` exit 0].
2. **The Node floor disagrees with itself.** The README says Node 20.11+ [SOURCE: README.md:160], the package says `>=20.11.0` [SOURCE: .skilled/skills/system-spec-kit/package.json:12], and the lockfile's dependencies say `^20.19.0 || >=22.12.0` [SOURCE: .skilled/package-lock.json:200] [VERIFIED].
3. **Git hooks go silent in a second clone.** An untrusted repository gets a nonexistent source root and runs no gate, with no message [VERIFIED] [SOURCE: .skilled/scripts/git-hooks/pre-commit:45].
4. **The Pi guard refuses without a next step.** "Pi dispatch denied: the command does not prove one direct executor." names neither the offending nor the accepted shape; its sibling branch does say what to do [VERIFIED] [SOURCE: .skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts:252].
5. **A slow host loses hook payloads silently**, as in section 5 [VERIFIED].
6. **Surface ties ignore the user's session**, because the advisor passes no hint, as in section 5 [VERIFIED].
7. **Forks meet version collisions at merge**, as in section 4 (g) [VERIFIED].
8. **Recovery from a half-applied update is designed**: `/doctor:update` exposes check, apply and rollback [INFERRED from the README; not run here].

---

## 7. Corrections to the Lineage

| Lineage claim | Orchestrator finding |
|---|---|
| The 16 manifest failures trace to seven `all 6 hubs` pins; fix by de-pinning | Wrong as the main cause. 15 of the 16 failures are the stale `cli-deem` line in the authored cli-classifier harness. De-pinning alone leaves the suite red |
| Passing `--surface-hint` is a one-line change | The handler has no session-surface value to pass. The change needs a source for the surface first, so it is not one line |
| The version mint has no check in `nested-changelog.ts` | The mint is owned by the changelog skill's step 3, which checks uniqueness locally only. The fix belongs there |
| The reducer citation `reduce-state.cjs:1002-1004` | Correct file is the runtime reducer, `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs`; the lines hold the yield rule |

---

## 8. Rejected Ideas

Each fails `.skilled/repo-rules/prevent-overengineering.md`: a smaller move fixes the failure, or the addition has no caller today.

| Idea | Why rejected |
|---|---|
| A repository-wide linter for string-argument `String.replace` | Both known sites are fixed or retired; no failing caller today |
| A scratch-lifecycle manager | A naming convention for run outputs covers the failure |
| A version-reservation service or changelog lock | One sentence in the changelog skill makes the mint read main first |
| A cross-suite registry of pinned counts | Three literals are cheaper to fix directly |
| A guided installer wrapper | The setup commands are short and idempotent; a wrapper duplicates npm |
| A path-stripping preprocessor for advisor prompts | A path is often the real work item; the battery owner decides signal changes |
| A per-host deadline config option | No host reports its write latency; the option would have no input |
| Telemetry counters for dropped hook payloads | Needs a measured late-write case first; adds state to fail-open hooks |
| Moving the authored compiled-routing source out of `specs/z_archive/` | A migration across every hub for a one-line drift; recorded as an open question instead |
| A new guard that byte-compares served and authored copies | `compiled-route-sync.cjs --check` already detects the drift; the gap is that the epic ran `--verify` instead |

---

## 9. Proposed Implementation Phases

Ranked by external-user impact against cost. Each changes one file.

| Rank | Phase | File | Proving command |
|---|---|---|---|
| 1 | Delete the stale `cli-deem` entry, line 67, from the authored cli-classifier harness so the default rebuild works | `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/008-cli-classifier/harness/build-artifacts.cjs` | `node .skilled/bin/compiled-route-sync.cjs --check; echo $?` prints 0, and `node --test .skilled/bin/tests/compiled-route-manifest.test.cjs` no longer prints `failed to resolve hubs` |
| 2 | Make the hub-count assertion read `HUBS.length` instead of 6 | `.skilled/bin/tests/compiled-route-manifest.test.cjs` | the same test prints `fail 0`, after phase 1 |
| 3 | Name what the guard accepts in the ambiguous Pi denial | `.skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts` | a focused case asserts the new reason text |
| 4 | Print one stderr line naming `git config --local skilled.trustRepoHooks true` when a toolchain repository is untrusted | `.skilled/scripts/git-hooks/pre-commit` | `bash .skilled/scripts/git-hooks/tests/pre-commit.test.sh` with an untrusted toolchain case |
| 5 | Read main's changelog folder before choosing the next version | `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md` | `grep -c 'origin/main' .skilled/skills/sk-doc/sk-create-changelog/SKILL.md` prints 1 or more |
| 6 | Align the Node floor to `^20.19.0 \|\| >=22.12.0` | `.skilled/skills/system-spec-kit/package.json` (the README line follows) | `grep -c '20.19.0' .skilled/skills/system-spec-kit/package.json` prints 1 |
| 7 | Re-pin `LIVE_CORPUS_SIZE` to 86 after rerunning the baseline report its comment names | `.skilled/bin/tests/compiled-route-admission.test.cjs` | `node --test .skilled/bin/tests/compiled-route-admission.test.cjs` prints `fail 0` |
| 8 | Delete the stale `jev-transport-single` case; its successor lives in the cli-classifier fixture | `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/fixtures/canary-cases.v1.json` | the cli-external canary harness reports no deferred case |
| 9 | Add one late-write case that writes after 800 ms and asserts today's outcome | `.skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs` | `node --test .skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs` passes with the new case |

Deferred, not rejected: the 36-blocker HVR sweep of sk-code `SKILL.md` (internal voice debt, no user-visible failure); the surface-hint adoption, which first needs a session-surface source in the advisor handler; the advisor battery, which needs its owner's decision on signal changes; the 43 review folders that error during reduction.

---

## 10. Open Questions

- Whether phase 1 alone turns the manifest suite fully green is [INFERRED]. In a scratch copy the closure error cleared, but the move-simulation then failed for every hub, which may be an artifact of the copy's location. Running the test after phase 1 settles it.
- Should the authored compiled-routing source stay under `specs/sk-doc/z_archive/`? An adopter reads `z_archive` as history, yet the rebuild depends on it.
- Which validator produced the link-shaped task text incident (process error b) is UNKNOWN.

---

## 11. References

- Lineage report: `lineages/dsflash-llmgw/research.md`; iterations `lineages/dsflash-llmgw/iterations/iteration-001.md` to `iteration-010.md`.
- Merged registry: `findings-registry.json`; attribution: `fanout-attribution.md`; resource map: `resource-map.md`.
- Run summary: `orchestration-summary.json`.
