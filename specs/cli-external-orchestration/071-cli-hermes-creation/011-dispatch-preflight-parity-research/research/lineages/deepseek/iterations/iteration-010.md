---
title: "Iteration 10: Ranked Recommendations and Phase Decomposition"
trigger_phrases: []
---
# Iteration 10: Ranked Recommendations and Phase Decomposition

## Focus
Rank every recommendation from iterations 1–9 by (failure severity × confidence) / cost, group them into do-now / do-next / do-not with `file:line` citations, and propose the phase decomposition the operator will scaffold from.

## Scoring scale
Severity 1–5 (5 = silent wrong run or whole-runtime unenforced); confidence 0–1 (verification strength); cost 1–5 (1 = frontmatter/regex/test flip, 3 = new adapter + tests, 5 = multi-file subsystem). Ratio = severity × confidence ÷ cost. Ratios order the table; grouping uses judgment on top of the order and is stated peritem.

## Findings

### Ranked list (all recommendations, ratio-ordered)

| Rank | Recommendation | Sev | Conf | Cost | Ratio | Group |
|---|---|---|---|---|---|---|
| 1 | Fix codex dispatch shape in the shared registry (`/\bcodex\s+exec\b/` without the print flag) — currently the whole runtime's preflight and audit are inert [dispatch-audit.mjs:33] | 5 | 0.95 | 1 | 4.75 | **now** |
| 2 | Set `HERMES_ENABLE_PROJECT_PLUGINS=1` in the runner's dispatch env — without it the repo plugin, read-only marker and spec-folder wiring are inert [fanout-run.cjs:3268-3272; hook-contract.md:53] | 5 | 0.80 | 1 | 4.00 | **now** |
| 3 | Flip `stdin-redirect-required` warn→error in all seven `cli-*` skills — the silent-hang class, deterministic check [cli-*/SKILL.md:7-10] | 4 | 0.90 | 1 | 3.60 | **now** |
| 4 | Fix `hermes-explicit-toolsets-required` to require `file`, then raise to error — `-t search,todo` passes and the leaf exits 0 empty [dispatch-rule-checks.mjs:189-194] | 4 | 0.90 | 1 | 3.60 | **now** |
| 5 | Remove the `-s` exemption from `hermes-ignore-rules-required`, flip the two test assertions, fix the message; raise to error — the premise is disproved [dispatch-rule-checks.mjs:184-186; dispatch-rule-checks.test.mjs:116-119; cli-hermes/SKILL.md:19-22] | 4 | 0.95 | 1 | 3.80 | **now** |
| 6 | Flip `explicit-model-required` and `command-flag-for-slash-prompt` warn→error (opencode) — 429 silence and prose delivery [cli-opencode/SKILL.md:11-22] | 4 | 0.85 | 1 | 3.40 | **now** |
| 7 | Remove the `U+200D` joiner from AGENTS.md §7 — clears the Hermes scanner block; blast radius verified one line, zero automated checks [AGENTS.md:247] | 3 | 0.90 | 1 | 2.70 | **now** |
| 8 | Build the one CI guard: shape-parity across both registries, bijection both directions, ≥1 rule per skill, per-check pass+violation fixtures, runtime registrations [dispatch-rule-checks.test.mjs:33-45] | 4 | 0.90 | 3 | 1.20 | **next** |
| 9 | OpenCode preflight: add `tool.execute.before` to the audit plugin (throw = deny, buffer = advise) [cli-dispatch-audit.js:60-90; plugins/README.md:84] | 4 | 0.90 | 2 | 1.80 | **next** |
| 10 | Add the `pi-offline-required` and `pi-provider-qualified-model` checks — multi-minute startup hang and google-default provider [fanout-run.cjs:2559-2565] | 4 | 0.90 | 2 | 1.80 | **next** |
| 11 | Cursor preflight shim over the Claude adapter (Shell matcher; Cursor permission envelope) [task-dispatch-guard.mjs:104-124; hooks.json preToolUse] | 4 | 0.85 | 2 | 1.70 | **next** |
| 12 | Fix the three predicate bypasses: `--agent=general`, `--share=<value>`, unquoted slash prompts [dispatch-rule-checks.mjs:153-161] | 2 | 0.90 | 1 | 1.80 | **next** |
| 13 | Add the Hermes provider/source/no-`-z`/budget checks and the opencode `--dir`, cursor `auto`, claude/codex model-pin, devin permission-mode checks [iteration 3 predicates] | 3 | 0.75 | 3 | 0.75 | **next** |
| 14 | Builder parity: claude + opencode availability probes; codex `o4-mini`→`gpt-5.5`; opencode default alignment; codex service-tier default `fast` [fanout-run.cjs:2070,2200-2203,2104,2737-2790] | 3 | 0.85 | 2 | 1.28 | **next** |
| 15 | Devin drift fallback on the dispatch entry + registration assertions for claude/cursor/devin/pi [devin/hooks.v1.json:72] | 2 | 0.85 | 1 | 1.70 | **next** |
| 16 | Raise `hermes-mcp-config-operator-required` to error (operator-state mutation) [cli-hermes/SKILL.md:31-34] | 3 | 0.60 | 1 | 1.80 | **next** |
| 17 | Kill-switch advisory line at session start [hook-flags.cjs:1-20] | 2 | 0.85 | 1 | 1.70 | **next** |
| 18 | Persona wiring: `HERMES_AGENT_PERSONA` + `-s agent-<name>` after the exemption fix [plugin:133; agent-delegation.md:48] | 3 | 0.80 | 3 | 0.80 | **next** |
| 19 | Redesign `non-interactive-permission-mode-risk` predicate (currently demands the bypass flag) [dispatch-rule-checks.mjs:205-208] | 2 | 0.60 | 2 | 0.60 | **next** |
| 20 | Doc drift sweep: README 5-of-17 checks, "four availability rules" comment, skill prose contradictions [dispatch/README.md; dispatch-rule-checks.mjs:162-170] | 1 | 0.95 | 1 | 0.95 | **next** |

### Do not

| Recommendation | Why not |
|---|---|
| Repo-rules digest prompt section [plugin:126-129] | 4,000-char section carries 16% of a 25,085-char file, is skipped (not truncated) when over, and becomes a fifth ungoverned copy — name the file instead [iteration 7] |
| Per-dispatch runtime self-test of all checks | multiplies per-call cost to catch static conditions CI catches once [iteration 9] |
| A third model-roster copy inside the hook engine | the two existing copies already drift; derive from `executor-config.ts` in the CI guard instead [iteration 6] |
| Cursor- or OpenCode-specific reimplementation of the engine | the shared `evaluate`/`readHardRules` already runs on both; a copy is a second thing to drift [iterations 4-5] |
| Hand-editing the generated `.hermes` mirror or rewriting the dated benchmark reports | mirror regenerates; reports are dated history [iteration 2] |
| Fail-closed posture | trades a silent failure for a hard one; detectors restore the signal instead [iteration 9] |

### Phase decomposition

| Phase | One-line scope | Dependencies | Closing gate |
|---|---|---|---|
| **1. Close the four silent holes** | Land ranks 1-7: codex shape, Hermes plugin opt-in, the three severity flips, the exemption removal, the `file`-toolset requirement, the AGENTS.md joiner — plus the doc sweep they touch | none | `node --test dispatch-rule-checks.test.mjs` green with the flipped assertions; shape fixtures green on all seven documented commands; builder env unit test for the Hermes opt-in; Hermes session quotes a §7 line |
| **2. Extend coverage** | Land ranks 8-13, 15-17, 19: the new predicates and bypass fixes, the OpenCode `tool.execute.before` hook, the Cursor shim, the Devin fallback, registration + kill-switch detection | Phase 1 (shape registry and severities stable) | one live denial per new adapter (Cursor Shell, OpenCode bash); each new predicate has a pass+violation fixture; the registration test fails on a deliberately removed config entry |
| **3. Wire the builders** | Land ranks 14 and 18: availability parity, model-default alignment, service-tier default, persona env + preload | Phase 1 (exemption fix) for the persona shape | builder unit tests per kind; one live Hermes lineage whose agent log shows the persona/session-context section and the read-only refusal |
| **4. Make silence loud** | Land the full CI guard as the closure of Phase 2's detection half: both-registry shape parity, bijection + rule-count, per-check fixtures, rosters, registrations — one file, mutation-proofed | Phases 1 and 3 (shapes and rosters frozen by then) | guard green on main and red when any single assertion is mutated by hand |

## Ruled Out
- Loading all four phases into one change: the phases have real dependencies (persona after the exemption fix; roster guard after builder alignment), and the charter asked for a scaffoldable decomposition, not a batch. [INFERENCE: dependency edges above]

## Dead Ends
- Ranking the CI guard higher on raw ratio: its (severity × confidence)/cost scores below the point fixes because its own severity is indirect; the phase plan places it as the closure of coverage because that is where its assertions become stable. [INFERENCE: scoring table row 8]

## Edge Cases
- Contradictory evidence: none across iterations 1-9 remain unreconciled. The one reframing: the charter's premise "Cursor carries only a post-tool-use file" is true of the adapters but not of the runtime surface — the plan treats it as a wiring task, not a platform limit.
- Partial success: ratio ordering is sensitive to the severity assignment; rows 4 and 5 swap under ±0.5 severity. The grouping (all seven in "now") does not depend on their relative order.
- Missing dependencies: none; every rank cites a file and line, and the phases close on runnable gates.

## Sources Consulted
- All iteration files 001-009 and their cited sources; no new source reads in this synthesis iteration.
