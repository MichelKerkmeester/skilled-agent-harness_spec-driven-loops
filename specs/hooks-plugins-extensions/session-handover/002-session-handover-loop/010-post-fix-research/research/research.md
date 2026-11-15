---
title: "Research: session relaunch loop after phase 009"
description: "Five DeepSeek V4.1 Flash max iterations through cli-pi on the relaunch loop after phase 009, with orchestrator verification of all twenty findings."
trigger_phrases:
  - "session relaunch post-fix research"
  - "relaunch loop after phase 009"
importance_tier: normal
contextType: research
---
# Research: Session Relaunch Loop After Phase 009

One lineage researched the loop on 2026-10-19 from `main` after phase 009 merged. Lineage synthesis: `lineages/deepseek-pi/research.md`. Attribution: `fanout-attribution.md`.

| Lineage | Executor | Iterations | Runner status |
|---|---|---|---|
| deepseek-pi | cli-pi, `llmgateway/deepseek-v4.1-flash`, thinking max | 5 | fulfilled, with a containment advisory for two parent files the orchestrator edited during the run; no gateway refusals |

## 1. Verified Findings

The lineage reported 2 P1, 14 P2 and 4 P3. A read-only verifier opened every cited line, and the orchestrator re-read the arm path for the top finding. "Confirmed" means the code shows the defect. "Partly" means the observation holds but the consequence or severity does not. Severity below is the verified one.

### Worth fixing

| ID | Finding | Verdict | Severity | What was read |
|---|---|---|---|---|
| P1-1 | A re-arm of an already-armed record keeps the first `armedAt`. When a killer exits without unarming and the session idles past the age limit, the next arm leaves a stale record, `shouldRelaunch` returns `stale` and the wrapper prints the manual command instead of relaunching | Confirmed | P2: needs an abnormal killer exit first, and the manual command still prints | `lib/relaunch-core.cjs:361`, `:450`; `tests/relaunch-core.test.cjs:493` pins it; `lib/killer.cjs:547-548`, `:586-589` |
| P2-10 | The conformance table has seed and nudge cases but no arm case, which is why P1-1 and the guard differences went unseen | Confirmed | P2 | `tests/adapter-conformance.test.cjs:233`, `:258` |
| P2-16 | The concern README's test command lists nine files and omits the conformance suite; its tree says nine | Confirmed | P3 | `README.md:195-204`, `:235` |
| P2-17 | The concern README has no frontmatter, unlike all 24 sibling hook READMEs | Confirmed | P3 | `README.md:1` |
| P3-8 | The unknown-command message hardcodes the subcommand list `SUBCOMMANDS` owns | Confirmed | P3 | `bin/session-relaunch.cjs:24`, `:605` |
| P2-5 | `handoffDir` is not exported, so the CLI keeps its own copy of the handoffs path | Confirmed | P3 | `lib/nudge.cjs:243`, `:488-509`; `bin/session-relaunch.cjs:128` |

### Optional cleanup

| ID | Finding | Verdict | Severity |
|---|---|---|---|
| P1-12 | Six arm guards with three condition sets | Partly: the session id must match and one loop runs one runtime, so no record is accepted wrongly | P3 |
| P2-1 | `HANDOFF_SECTIONS` declared in the core and in `nudge.cjs` | Confirmed; the risk is drift between the two lists | P3 |
| P2-6 | `print_manual_command`'s fallback and duplicated escape set | Partly: the fallback runs when a value contains the placeholder token | P3 |
| P2-7 | `refuseForShellChild` trusts `CLAUDE_PID` without the descent check | Confirmed; matters only for a nested or inherited `CLAUDE_PID` | P3 |
| P2-9 | Codex and Hermes target-lookup tests repeat the core's table | Confirmed | P3 |
| P2-14 | Entrypoints run on import | Partly: five do, and only Claude's arm path is untestable in process | P3 |
| P2-19 | The process-table read exists three times with one literal bound | Partly: all three refuse to act when `ps` fails | P3 |
| P3-3 | `manualClaimCommand` reads `process.env` instead of an `env` parameter | Confirmed; differs only under an injected environment | P3 |
| P3-11 | The tests README pins an exact total | Confirmed | P3 |
| P3-15 | Payloads without an event name are handled three ways | Partly: Hermes documents its policy and Codex's refusal is tested | P3 |

### Not defects

| ID | Finding | Why |
|---|---|---|
| P2-13 | The runtime name as a string in each adapter | Each adapter naming its own runtime is ordinary |
| P2-18 | No `SKILLED_LOOP_*` rows in the environment reference | The wrapper sets them itself; the concern README documents them, and the reference covers tuning switches |
| P2-20 | This packet's scaffold placeholders | Work in progress at the time of the run, filled before closure |
| P3-4 | The Pi adapter types its `.cjs` import by hand | The normal way to type a CommonJS import from TypeScript |

## 2. Recommended Order

1. P1-1 with a failing-first test (armed, no killer, older than the age limit, re-arm, `shouldRelaunch` returns relaunch), changing the pinning assertion on purpose.
2. P2-10's arm cases in the conformance table, in the same change.
3. P2-16, P2-17, P3-8 and P2-5.
4. The optional cleanup only if a later phase touches those files.
