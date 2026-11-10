---
title: "Deep Research: advisor-hooks-relaunch across the Skilled v4 release line"
description: "Ranked, cited findings for the skill advisor, the runtime hooks and session relaunch across v4.0.0.0 to v4.0.2.0, from 20 generation-2 iterations plus 2 generation-1 iterations, with orchestrator corrections applied."
trigger_phrases:
  - "advisor hooks relaunch v4 research findings"
importance_tier: "important"
contextType: "research"
---
# Deep Research: advisor-hooks-relaunch across the Skilled v4 release line

Spec: `specs/system-speckit/runtime-and-release/004-v4-release-line-research/004-advisor-hooks-relaunch` | Session: `2026-11-08T20:14:40.000Z` (generation 2, parent generation 1 archived at `research_archive/20261108T201439Z`) | Stop: maxIterationsReached at the lead's ceiling (20 distinct iterations in generation 2, 22 state rows because iterations 15 and 19 were each redispatched once, numbered 1 to 15, 17 to 19, 21 and 22; generation 1 held 2 productive rows and 1 `error` row). The depth rule cleared: distinct iterations 19, 21 and 22 added no new surviving P0 or P1

---

## 1. Executive Summary

The advisor, the hooks and session relaunch mostly do what the release notes say, and the OpenCode plugin suite passes 572 of 572 in a clean environment. The real defects cluster in three places. The ask-surface guard's menu detector misses the commonest numbered-menu form (`1.`) and fires on numbered how-to steps that end in a question, and the Claude Stop hook reads stdin with no deadline. The dispatch-audit hooks resolve their log against the session's working directory, so audit records scatter into nested, gitignored `.skilled/logs` folders; this run produced one inside its own parent spec folder. The advisor's ordering cannot be explained from the fields it returns, and its Python front door ranks differently from Node, though no operator sees the Python ranking. Hermes still ships in the doctor's AGENTS.md payload, so `agents-md-manifest.cjs --check` fails at HEAD. Over-engineering sits in the per-runtime adapter copies: one concern carries a directory per runtime with near-identical adapters and READMEs, and the stdin deadline has three reader implementations.

Several executor-claimed P1s were corrected by the orchestrator: the "red plugin suite" was environment-induced, the doctor-bridge ordering follows a documented lead-phrase rule, the relaunch nudge is quiet in child sessions by design, Claude and Codex use the host's native goal command by design, and the README's Python fallback claim is a doc defect, not a runtime one.

---

## 2. Research Question and Scope

Read-only research over the skill advisor (`.skilled/skills/system-skill-advisor/**`, `.skilled/bin/skill-advisor.cjs`, the launcher), the runtime hooks (`.skilled/hooks/**`, `.claude/hooks`, `.codex/hooks.json`, `.opencode/plugins`, `.pi/extensions`) and session relaunch, against every release note from v4.0.0.0 to v4.0.2.0. Seven finding types were in scope: drift, misalignment, bug, improvement, UX, over-engineering and extension.

---

## 3. Methodology

The run executed `deep-research-auto.yaml` one `phase_loop` pass at a time (ADR-001 in `decision-record.md`). Generation 1 ran on `cli-devin` until the Devin daily quota ran out at iteration 3. Generation 2 restarted on `cli-pi` `opencode-go/deepseek-v4.1-flash` at thinking max. After each iteration the orchestrator opened at least two citations and re-ran behavioural claims (advisor calls, the detector, the plugin suite) before accepting them. The checkpoint after iteration 10 extended the run to 15. Iteration 15 re-verified every open P1. The lead then reopened the run under the depth rule (D-14): the reopened iterations settled the findings that rested on executor evidence alone and read the dispatch-audit, goal and decision-capture hooks, dsh registration and the cluster's comment and header conventions. Iterations 12 and 13 drifted into git-hook and doctor files that belong to cluster 005; those findings are kept here as cross-cluster P2s.

---

## 4. Strongest Findings

| # | Finding | Type | Sev | Evidence the orchestrator opened or ran | Release |
|---|---------|------|-----|-----------------------------------------|---------|
| 1 | The ask-surface menu detector misses `1./2./3.` menus and fires on `1)` how-to steps that end in a yes/no question | bug | P1 | `OPTION_LINE` at `ask-surface-core.cjs:39`; reproduced both through `detectProseMenu` (a `1.` menu returned null, a `1)` how-to list plus a question returned a menu) | ask-surface guard release |
| 2 | The Claude ask-surface Stop hook reads stdin with a bare blocking `readFileSync(0)` and no deadline; `advisory-stop.cjs` does the same | bug | P1 | `ask-surface-stop.cjs:83`, `advisory-stop.cjs:44`; the codex variant has no such call | v4.0.0.8 deadline contract |
| 3 | The dispatch-audit hooks resolve their log against the session cwd, so audit records scatter into nested, gitignored `.skilled/logs` folders | bug | P1 | `dispatch-audit-posttooluse.mjs:56-57` takes `payload.cwd` before `CLAUDE_PROJECT_DIR`; observed `specs/system-speckit/runtime-and-release/004-v4-release-line-research/.skilled/logs/cli-dispatch-audit.log`, hidden by `.gitignore:263` (`git check-ignore -v`) | dispatch audit release |
| 4 | Hermes still ships in the doctor's AGENTS.md payload, and `agents-md-manifest.cjs --check` exits 1 at HEAD | drift | P1 | 3 `hermes` hits in `agents-md-manifest.json` (`:1068`); ran `--check`, exit 1 | v4.0.2.0 |
| 5 | v4.0.1.0 says the advisor suggests doctor commands for a described problem; "my hooks are not firing, what do I run" gets no doctor command | drift | P1 | Ran the prompt: top three all below 0.13, none a doctor command | v4.0.1.0 |

---

## 5. Bugs

- **B1, P1.** Menu detector false negative and false positive (Strongest 1). A third defect: the digit branch is single-digit, so `10)` matches neither branch.
- **B2, P1.** Blocking stdin read with no deadline on the Claude Stop path (Strongest 2).
- **B3, P1 (executor-verified, held at iteration 15).** The "sent back once" promise is per assistant message on OpenCode (marker keyed on `messageId`, `.opencode/plugins/ask-surface-guard.js:102`) and per turn counter on dsh, not per operator turn as on Pi and Claude.
- **B4, P2.** The Codex shim spawns the Claude adapter with a 2,800 ms timeout (`codex/user-prompt-submit.ts:21`) under a 3 s host deadline (`.codex/hooks.json`), leaving 200 ms for the fallback path.
- **B5, P2.** The dsh advisor adapter awaits `core.runAdvisor` with no deadline race (`prompt-advisor.mjs:168`), unlike Pi.
- **B6, P2.** The OpenCode `detectWorkspaceSurface` cache never invalidates (`system-skill-advisor.js:841-857`), so a surface added mid-session keeps a stale hint.
- **B7, P2.** A menu inside a 4-space indented code block fires; a question more than three non-blank lines above the list escapes; the Claude adapter never passes `surfaceAvailable`.
- **B8, P2 (claimed P1).** `session-relaunch.test.cjs` fails 27 of 65 only when the test process inherits `AI_SESSION_CHILD=1`. `nudge.cjs:568-569` quiets the nudge in child sessions on purpose, so the defect is test isolation, not product behaviour.
- **B9, P2.** The Pi ask-surface adapter imports `../../.skilled/hooks/shared/hook-flags.mjs` (`ask-surface-guard.ts:11`), which resolves only through the `.pi/extensions` symlink.
- **B11, P1.** Dispatch-audit log path (Strongest 3). Four of six adapters join the shared relative path to a session directory; the docs describe one canonical log, and `.gitignore:263` hides every stray copy, so the loss is silent.
- **B12, P2.** The goal slice reports `packet_budget=unknown` when the manifest has no budget block, keeps prose template instructions after the scrub, hardcodes `4000` in the reminder while the budget comes from `spec-kit-docs.json`, and does not print the overage.
- **B10, P2, cross-cluster 005.** `template-phrase-lint.mjs:28-34` runs `git` through `execFileSync` with no timeout, and `pre-commit:232-234` reports any non-zero exit as a phrase block.

---

## 6. Drift between notes, code and docs

- **D1, P2 (was P1).** The Node and Python front doors rank "add a changelog for this packet" differently (Node `sk-doc` 0.82 vs Python `command-create-changelog` 0.63), and CI compares only routing maps (`routing-registry-drift.yml:156`). Downgraded because no operator sees the Python ranking: the OpenCode plugin only hashes `skill_advisor.py` into a signature (`system-skill-advisor.js:355-357`), and the live Python callers are a skill-creation projection and a health check.
- **D10, P2.** `system-skill-advisor/README.md:44` says the CLI answers from the Python scorer when the daemon is unreachable; no production process does that.
- **D2, P1.** Hermes in the doctor manifest (Strongest 4). `v4.0.0.14.md:55` also still names HERMES among the relaunch flags, and the trigger index carries paths into the removed Hermes packet.
- **D3, P1.** No doctor command for a described hooks problem (Strongest 5).
- **D4, P2.** `system-skill-advisor/README.md` names `topK` and other options bare; the schema accepts them only under `options`, so the documented call exits 64 (reproduced).
- **D5, P2.** The OpenCode timeout variable `SPECKIT_OPENCODE_HOOK_TIMEOUT_MS` is read by `subprocess.ts` and `skill_advisor.py`, not by the plugin, which reads `SYSTEM_SKILL_ADVISOR_BRIDGE_TIMEOUT_MS` (default 2,500 ms). The README names the wrong consumer.
- **D6, P2.** v4.0.0.1 says every prompt carries its skill suggestion; the Pi extension suppresses a proven same-content repeat by design (`prompt-advisor.ts:84-91`).
- **D7, P2.** v4.0.0.13 says 17 plugins; the tree has 19, all on the shared adapter, and `sk-vision` is gone.
- **D8, P2.** The maintained advisor matrix omits dsh; the stdin deadline is described as one number (3 s) while the Claude adapter sets 500 ms of its own; v4.0.0.7 overstates the Python fallback removal; v4.0.0.9's lowercase-alias claim has no field to be true about.
- **D9, P2.** `runtime/dist/lib/scorer/fusion.js` does not exist, so v4.0.0.12's stale-build promise cannot be checked from the dist tree.
- **D11, P2.** v4.0.2.0 says dsh sessions get goals, but no dsh plugin registers the goal adapter; the dsh prompt advisor is the only one of 21 registered adapters that is opt-in (`.dsh/plugins/repo-guards/index.mjs:52`, switched on only at `.dsh/patches/guards.patch.yml:6`).
- **D12, P2.** Five of six runtime rows in the relaunch README (`session-relaunch/README.md:25-30`) link evidence files under a missing path, and three relaunch test constants name a `specs/hooks/` track that does not exist.

---

## 7. Misalignment with sk-code, sk-doc and Skilled canon

- **M1, P2.** `python-compat.vitest.ts:19` carries the ephemeral label "Unit H", which the comment-hygiene rule forbids and the gate did not catch.
- **M2, P2.** `ambiguity.ts:42-46` applies the confidence-floor exception only when the top is not itself floored.
- **M3, P2.** `readOnlyRouteAllowed` matches "do not change|edit" but not "do not write" (`fusion.ts:675`).
- **M4, P2.** The child-session predicate lives in goal core and is required lazily from the relaunch nudge (`nudge.cjs:568`), hiding a cross-concern dependency.
- **M6, P2.** Hook entry files use two module-header dialects (84 against 4) with no written canon; the decision-capture concern has no landing README, and its `DECISION_CAPTURE_README_PATH` test seam has no writer. The comment-hygiene sweep found no ephemeral label in an explanatory comment beyond M1.
- **M5, P2.** `leaf-scopes.json` restates what `leaf-manifest.config.json:4` already declares; the sk-doc registry declares `sk-create-skill-parent` with no folder of that name.

---

## 8. Operator and AI-user friction

- **U1, P2 (claimed P1).** A doctor lead phrase outranks a skill the prompt names explicitly: "sk-doc create a new skill and then check my environment variables" puts `command-doctor-env` (0.54) above `system-spec-kit` (0.7596) and `sk-doc` (0.7313). This follows the documented lead-phrase rule (`doctor/_routes.yaml:764`, `fusion.ts:935-940`), so it is a UX choice, not a contract break.
- **U2, P2.** `advisor_recommend` omits `passes_threshold`, the field the ordering rule decides on (`fusion.ts:898`), so a caller cannot explain why `sk-doc` 0.347 ranks above `system-spec-kit` 0.579 for "add a changelog for this packet" (reproduced).
- **U3, P2.** Effort carry-over works for claude, codex and pi only; outside the loop a prepare without `--runtime` is evaluated as claude.
- **U4, P2.** The enable-relaunch recipe has no single owner, and the operator docs mention the advisor only as a kill switch.
- **U6, P2.** The send-back-once guard is four contracts: Pi keys on the operator message, OpenCode on the assistant message, dsh on the turn number (and `agent.steer` starts a new turn), Claude on its own key; only `pi/ask-surface-guard.test.ts:64` pins once per operator turn.
- **U5, P2.** The workflow-first rule keeps `system-deep-loop` first over a higher-scoring `cli-external-orchestration` without labelling the override.

---

## 9. Over-engineering to cut

- **O1, P2 (claimed P1).** One concern carries a directory per runtime, with adapters and README paragraphs that are byte-identical across runtimes. The "181 adapters" sizing was not reproducible at iteration 15, so the finding stands qualitatively.
- **O2, P2.** The stdin deadline contract has three reader implementations (`hook-adapter-shared.cjs`, `.mjs`, `shared-stdin.ts`) and two parallel test suites.
- **O3, P2.** Doctor routing exists as a generated table (`DOCTOR_COMMAND_STRINGS`, 35 entries) and as a hand projection in `scorer/projection.ts`.
- **O4, P2.** `package_skill.py` exists twice, byte-identical (SHA-256 prefix `69a5f164a4a65e8d`).

---

## 10. Improvements

- **I1.** Add fixtures for the three detector defects; `fixtures/prose-menu-numbered.json` covers only the `1)` happy path.
- **I2.** Return `passes_threshold` and the ordering reason in `advisor_recommend`.
- **I3.** Extend the CI parity step from routing maps to outcome-level comparison of the two front doors on a fixed prompt set.
- **I4.** Route every hook's stdin through the shared deadline reader, starting with `ask-surface-stop.cjs:83` and `advisory-stop.cjs:44`.
- **I5.** Export one rooted log resolver from the dispatch-audit core (repository root, not the session directory) and use it in all six adapters.

---

## 11. Extension opportunities

- **E1.** One shared detector corpus run against every runtime adapter, once under a clean and once under a hostile ambient environment (`AI_SESSION_CHILD` set), which would have caught B8.
- **E2.** Generate per-runtime adapters and READMEs from one hook manifest.
- **E3.** Drive the doctor's concern report from the hook-flag resolver, so "my hooks are not firing" maps to a check.
- **E4.** A doctor or install check that fails when a nested `.skilled/logs` folder exists anywhere but the root, which closes the stray-log class for every future adapter.

---

## 12. Recommendations

1. Fix the detector regex and add the three fixtures (B1, I1) in one change.
2. Put the Claude Stop hook and `advisory-stop.cjs` on the shared stdin deadline (B2, I4).
3. Regenerate the doctor AGENTS.md manifest without Hermes so `--check` passes (D2), together with cluster 005.
4. Root the dispatch-audit log path (B11, I5) and add the nested-log check (E4).
5. Return the ordering fields from `advisor_recommend` (U2); bring the Python front door into line only if a caller that reaches operators appears (D1).
6. Add a doctor phrase for hooks problems (D3, E3).

---

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|----------|-------------------|----------|--------------|
| "The OpenCode plugin suite is red at HEAD" | Environment-induced: 572/572 pass without `AI_SESSION_CHILD`; 27/65 relaunch tests fail only with it | `node --test .opencode/plugins/tests/*.test.cjs` | 9, corrected by the orchestrator |
| "The doctor-bridge ordering contract is broken" | The prompt contains a doctor-env lead phrase, and the rule moves a passing lead-phrase bridge first | `doctor/_routes.yaml:764`, `fusion.ts:935-940` | 11 |
| "The relaunch nudge is broken in child sessions" | Quiet in children on purpose | `nudge.cjs:565-569` comment | 10 |
| "hook-flags.env missing from a clone is a defect" | It is gitignored by design and copied from the example | `.skilled/hooks/README.md:79` | 10 |
| Deleting the Python advisor | Live callers remain (a skill-creation routing projection and a health check), though the earlier claim that the OpenCode plugin calls it was wrong: the plugin only hashes the file | `create-skill-parent-auto.yaml:240`, `system-skill-advisor.js:355-357` | 7, corrected in 17 |
| "Claude and Codex lack a goal adapter" | Both use the host's native goal command by design | `goal-plugin.md:159-160` | 19 |
| "hook-flags exists in four copies" | One engine plus thin module-format shims | `hook-flags.cjs:286` | 7 |
| The "181 adapters" count | Not reproducible on any basis at iteration 15 | iteration 15 table row 7 | 7, 15 |

---

## Divergence Map

No divergent pivots ran: the registry records 0 completed pivots, 0 failed pivots and 0 audited overrides. Breadth came from release-by-release steering. Saturated: the ask-surface detector (iterations 5, 13, 15) and advisor ordering (1, 2, 11, 15). Remaining frontier: the goal hook and decision capture, which were read only where relaunch touched them.

---

## 13. Open Questions

- Answered in the reopened run: the Python front door's ranking reaches no operator (D1).
- The three strategy questions left unticked were investigated, but the state log drops `answeredQuestions` (a deep-loop defect recorded in cluster 003), so the report says 8 of 11.

---

## 14. Release Coverage

| Release | Read in | Finding types found |
|---------|---------|---------------------|
| v4.0.0.0 | g1 1, g2 1 | misalignment (M5), over-engineering (O4) |
| v4.0.0.1 | g2 14 | drift (D6) |
| v4.0.0.2 | g2 2 | bug (B4) |
| v4.0.0.3 | g2 9, 13 | drift (D7 adapter wording), verified |
| v4.0.0.4 | g2 13 | no cluster claim |
| v4.0.0.5 | g2 12 | bug (B10, cross-cluster) |
| v4.0.0.6 | g2 8, 14 | UX (surface hint), bug (B6) |
| v4.0.0.7 | g2 1 | drift (D1, D8), improvement (I3) |
| v4.0.0.8 | g2 6 | bug (B2), over-engineering (O2), drift (D8 deadline) |
| v4.0.0.9 | g2 13, 14 | drift (D8 alias claim) |
| v4.0.0.10 | g2 14 | bug (B6 mid-session surface) |
| v4.0.0.11 | g2 13 | drift (Hermes in the frozen note only) |
| v4.0.0.12 | g2 8, 11 | drift (D9), UX (U1, U2) |
| v4.0.0.13 | g2 9 | drift (D7) |
| v4.0.0.14 | g2 3 | drift (D2 HERMES flag), UX (U3) |
| v4.0.0.15 | g1 2, g2 12 | misalignment (M2, M3), claim verified |
| v4.0.0.16 | g2 4, 12 | drift (history cap unenforced), bug (B10 timeout claim) |
| v4.0.1.0 | g2 8 | drift (D3, D4) |
| v4.0.2.0 | g2 3, 6, 13, 19 | drift (D2, D11), UX (dsh absent from relaunch runtimes) |
| Dispatch audit, goal and decision-capture hooks | g2 18, 19, 21 | bug (B11, B12), misalignment (M6), drift (D11), improvement (I5), extension (E4) |
| Conventions sweep | g2 22 | misalignment (M6), drift (D12) |

---

## 15. Verification Log

The orchestrator's per-iteration record is the Steering Log in `decision-record.md`. Commands the orchestrator ran, with their output:

- `node --test .opencode/plugins/tests/*.test.cjs` passed 572 of 572; with `AI_SESSION_CHILD=1`, `session-relaunch.test.cjs` failed 27 of 65.
- `detectProseMenu` on a `1.` menu returned null; on a `1)` how-to list ending in a yes/no question it returned a menu.
- `advisor_recommend` "add a changelog for this packet": `sk-doc` 0.347104 (confidence 0.82), `system-spec-kit` 0.579092 (0.8313), `sk-code` 0.220033.
- `advisor_recommend` "sk-doc create a new skill and then check my environment variables": `command-doctor-env` 0.54, `system-spec-kit` 0.759606, `sk-doc` 0.731278.
- `node .skilled/commands/doctor/scripts/agents-md-manifest.cjs --check` exited 1.
- `git ls-files .skilled/hooks/hook-flags.env` printed nothing (gitignored by design).
- `git check-ignore -v specs/system-speckit/runtime-and-release/004-v4-release-line-research/.skilled/logs/cli-dispatch-audit.log` printed `.gitignore:263:/*/**/.skilled/logs/`; the log holds this session's Bash dispatch records.
- `rg -n "skill_advisor\.py" .opencode/plugins/system-skill-advisor.js .skilled/bin/*.cjs` found only the signature list at `:153`.

---

## 16. Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 20 distinct (generation 2; 22 state rows because iterations 15 and 19 were each redispatched once), plus 3 generation-1 rows archived
- Questions answered: 8 / 11
- Remaining questions: 3 (investigated, unticked; see section 13)
- Last 3 iteration summaries: run 19: goal hook (0.62 after redispatch); run 21: decision capture and dsh registration (0.50); run 22: conventions sweep (0.30)
- Depth rule: cleared; iteration 18 added the last new P1, and the next three distinct iterations added none
- Convergence threshold: 0.05 (telemetry only under `--stop-policy=max-iterations`)
- Divergence summary: no divergent pivots recorded
- Segment transitions, wave scores, and checkpoint metrics are experimental and omitted from the live report.

---

Late P1 claims in the last three iterations (19, 21, 22), by id:

| Finding | Iteration | Outcome |
|---------|-----------|---------|
| f-iter019-004 | 19 | Refuted (see the refuted table): Claude and Codex use the host's native goal command by design (`goal-plugin.md:159-160`) |

## 17. References

- Iterations: `research/iterations/iteration-001.md` to `iteration-022.md` (no iteration 16 or 20, because the workflow numbers by state row); generation 1 under `research_archive/20261108T201439Z/iterations/`.
- Registry: `research/findings-registry.json`; deltas: `research/deltas/`.
- Decisions, executor switches and the steering log: `decision-record.md`.
