# Iteration 3: Q1 part 3 — outside the hub: advisor, doctor, hooks, README

## Focus
Q1 part 3, everything outside the hub: the skill advisor (graph metadata, scorer lanes/boosts, regression batteries and corpora), the doctor commands and the scripts they run (parent-skill checks), git hooks that check sk-code, the root README and the named `.skilled/README.md`, and the v4.0.0.4 note context. Record ORDER, PRESENCE and DOC lines.

**Headline:** the advisor carries **no surface ids** (`sk-code-obsidian`/`sk-code-webflow` — zero matches) and ranks nothing itself; what it does carry is the two example domains as **sk-code routing signals** (`webflow`, `obsidian plugin*` in `skill-graph.json` `signals.sk-code`, plus the hardcoded `'obsidian plugin'` lexical hint and `'webflow cms'` → mcp-code-mode disambiguation). The doctor's 5k-canary leg **couples `routerSignals` to the static canary fixture**, so deleting a surface forces coordinated edits or the doctor fails. The root README already tells users to replace all three surfaces — including OpenCode — while calling them "three ready surfaces".

## Actions Taken
All commands exited 0; no tool failures; no retries. No throwaway copy was created (the deletion experiment is Q2's focus).

1. State read: lineage config, strategy, state JSONL, findings-registry, `iteration-001.md`, `iteration-002.md` (read; exit 0).
2. Advisor sweep: grep `obsidian|webflow` over `.skilled/skills/system-skill-advisor` (16 files); grep `sk-code-obsidian|sk-code-webflow` over the same tree (**0 matches**); grep context reads of `runtime/lib/scorer` (lexical.ts:34-39, explicit.ts:128-134, fusion.ts:595-603) and `runtime/scripts` (skill_advisor.py:2029-2033, holdout-prompts.jsonl:30-34, skill-advisor-regression-cases.jsonl:12-16).
3. Advisor graph: bounded `node -e` walk of `skill-graph.json` printing the key path of every `obsidian|webflow` string (exit 0; 8 hits, key paths recorded).
4. Advisor hint: full read of `runtime/tests/advisor-surface-hint.vitest.ts` (115 lines).
5. Doctor: read `parent-skill-check.cjs:1-493` (2010 lines total); grep `canary` with context over the same file (:138-139, :1184-1291); grep `sk-code` over `.skilled/commands/doctor` (6 hits); file inventory of `.skilled/commands/doctor/**` via glob.
6. Hooks + README: bounded `node -e` scan of both pre-commit copies for `sk-code` lines and of root `README.md` for `obsidian|webflow` lines, plus `fs.existsSync` checks for `README.md`/`.skilled/README.md` (exit 0).
7. Clock/boundary: `date -u` = 16:52:53Z mid-run; `iteration-003.md` and `deltas/iter-003.jsonl` confirmed absent before writing.

Tool-call count: 17 research/state calls + 3 artifact writes + 1 gateway exec + 1 verify exec = 22 total (config cap 24).

## Findings
Format: `| class | claim | evidence | priority |`. Every row was opened in this iteration.

| class | claim | evidence | priority |
| --- | --- | --- | --- |
| PRESENCE | The advisor's compiled graph metadata embeds the example domains as **sk-code routing signals**: `$.signals.sk-code[2] = "webflow"` and `[42] "obsidian plugin"`, `[43] "obsidian plugin source"`, `[45] "obsidian plugin design system"`, `[77] "obsidian plugin conventions"`. The graph holds one `sk-code` node (`skill_count: 14`, `families.sk-code: ["sk-code"]`, `generated_at 2026-10-11T10:58:52Z`); surface packets are not graph nodes. | exec `node -e` JSON walk of `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` (exit 0; 8 key-path hits printed) | P1 |
| ORDER | The advisor's hardcoded lexical lane boosts sk-code on the phrase `'obsidian plugin'` — comment at `:37-38` says the phrase is "the same mechanism used as intended: sk-code declares that exact phrase and was losing it to a bare-token overlap by 0.004"; the sk-code array in this lane has **no** `webflow` token. | read `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts:34-40` | P1 |
| ORDER | `webflow cms` is disambiguated **away** from sk-code, as MCP-tooling vocabulary: `'webflow cms': [['mcp-code-mode', 1.5], ['sk-code', -0.5]]`; fusion regex `/\b(call_tool_chain|code mode|tool ?chain|api chain|webflow cms|cms collection)\b/` gives mcp-code-mode a bonus and sk-code a penalty; `skill_advisor.py:2031` maps `"webflow cms"` → mcp-code-mode (2.2). | read `explicit.ts:128-134`; `fusion.ts:595-603`; `skill_advisor.py:2029-2033` | P2 |
| OK | The advisor has **zero references** to `sk-code-obsidian`/`sk-code-webflow` ids (case-insensitive grep over the whole advisor tree: no matches). Surfaces are advisor-invisible by design: `'metadata'` is "the default for new hubs and for every surface packet (advisor-invisible)". Deleting the two packets cannot break advisor identity or graph nodes. | grep `sk-code-obsidian|sk-code-webflow` over `.skilled/skills/system-skill-advisor` (0 matches); read `.skilled/commands/doctor/scripts/parent-skill-check.cjs:83-86` | P1 |
| ORDER | The advisor's own `surfaceHint` is a pass-through, not a ranker: `advisor_recommend` accepts `options.surfaceHint` (bounded ≤64 chars; empty and oversized rejected) and forwards it to `compiled-route.cjs` as its own `--surface-hint <value>` argv pair; with no hint the flag is omitted entirely. | read `.skilled/skills/system-skill-advisor/runtime/tests/advisor-surface-hint.vitest.ts:14-16,70-104` | P1 |
| PRESENCE | Advisor regression/holdout corpora name webflow but assert **mcp-code-mode**: case `P1-MCP-002` prompt `"fetch webflow cms collection"` expects `mcp-code-mode` in both `fixtures/skill-advisor-regression-cases.jsonl:14` and `routing-accuracy/holdout-prompts.jsonl:32`. No case asserts a route to an sk-code surface. | read both corpora lines via grep context | P2 |
| PRESENCE | Doctor `5k-canary` couples `routerSignals` to the **static** fixture: every `routerSignals` mode must be the expected route of a case in the hub's canary fixture (`canaryDrift()` `:1232-1241`, reported `:1284-1285`); a hub without a fixture dir gets INFO "leg not applicable" (`:1272-1274`). Root is `009-parent-hub-rollout` (`:138-139`); sk-code's fixture is the `001-sk-code` folder. Deleting a surface packet therefore forces a coordinated edit of `hub-router.json` routerSignals **and** the canary fixture, or the doctor fails 5k-canary. | read `.skilled/commands/doctor/scripts/parent-skill-check.cjs:1184-1291` | P1 |
| PRESENCE | Doctor 5k also carries alias and packet legs (`:1184-1230`) and a WARN-only hub list `VOCABULARY_PARITY_WARN_ONLY = { 'mcp-tooling': ['alias'], 'sk-design': ['alias','packet'], 'sk-doc': ['alias'], 'system-deep-loop': ['alias'] }` (`:1291`). sk-code is **not** on that list, so any sk-code vocabulary drift (alias leg vs routerSignal keywords, packet leg vs description keywords) fails hard. | read `.skilled/commands/doctor/scripts/parent-skill-check.cjs:1288-1291` | P2 |
| DOC | The root README already instructs replacement but keeps all three as shipped: `:800` "Three ready surfaces: WEBFLOW …, OPENCODE …, OBSIDIAN …"; `:1384` "Replace the shipped Webflow + OpenCode + Obsidian surfaces with your own"; `:1447` "1. Replace the surface packets (`sk-code-webflow/`, `sk-code-skilled/`, `sk-code-obsidian/`) with packets for your stack". It never says the doctor assumes the two examples are gone, and it presents OpenCode as replaceable like the others. | exec `node -e` line scan of `README.md` (exit 0; 1601 lines; lines 800, 1384-1385, 1447) | P1 |
| DOC | `.skilled/README.md` **does not exist** (`fs.existsSync` false) — the dispatch's file list names a path that is not in the tree; the external-facing doc is the root `README.md`. | exec `node -e` `fs.existsSync` check (exit 0) | P2 |
| OK | Git hooks check sk-code but not the surfaces: both pre-commit copies gate comment hygiene via `sk-code-quality/scripts/check-comment-hygiene.sh` (`SOURCE_ROOT`-relative) and name no surface packet; a deleted surface cannot break them. | exec `node -e` line scan of `.skilled/scripts/git-hooks/pre-commit:96-97,139` and `.skilled/hooks/git/pre-commit:5,29,64` (exit 0) | P2 |
| PRESENCE | Doctor runtime-mirror checks point **into** the sk-code hub: `doctor-runtime-mirrors.yaml:68-100` requires `sk-code-quality/scripts/check-dist-staleness.sh` to exist on claude/cursor/codex SessionStart hooks. It targets `sk-code-quality`, so deleting the two surface packets leaves it intact — but the doctor does run hub-internal file-existence checks. | grep hits read of `.skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml:68-100` | P2 |
| PRESENCE | The doctor carries a dedicated parent-skill/router/update command set: `doctor-parent-skill.yaml`, `doctor-router-reach.yaml`, `doctor-update-align.yaml` in `.skilled/commands/doctor/assets/`; `parent-skill-check.cjs` (2010 lines, invariants 1a–5k) is the auditor run per hub. Its `DEFAULT_TARGET` is `.skilled/skills/system-deep-loop` (`:130`); the hub list it audits is not established from this read. | glob inventory `.skilled/commands/doctor/**`; read `parent-skill-check.cjs:1-493,130` | P2 |
| PRESENCE | The doctor's MCP asset names the two domains: `mcp-mutation-class-manifest.yaml` has `obsidian|webflow` matches at lines 80, 81, 82, 87 — MCP tooling mutation classes, not sk-code surfaces. | grep hit list over `.skilled/commands/doctor` | P2 |

### Options (preliminary — Q3 remains a later iteration; recorded so the reducer can rank)

| option | what it changes, path:line | cost | risk | cheaper move and why it fails |
| --- | --- | --- | --- | --- |
| A. Derive tieBreak from a registry rank field (updated with advisor/doctor evidence) | `mode-registry.json` modes[] + `registry-compiler.cjs:261,265` + advisor graph regeneration + doctor 5k fixture regeneration | registry schema + compiler + canary fixture + advisor graph rebuild; policy hash changes | parity breakage across canaries, graph, doctor 5k legs until all regenerate | Hand-edit `hub-router.json:7` — fails: `skill-graph.json` `signals.sk-code` still advertises `webflow`/`obsidian plugin`, README still says "three ready surfaces", and doctor 5k still requires a canary case per routerSignals mode |
| B. Docs-only example marking | README/SKILL.md/doctor output prose | prose edits | routing, advisor signals, and doctor checks unchanged | Change nothing — fails the operator requirement that the doctor assumes the examples are gone; `README.md:1447` already says replace, so the marginal doc change is the doctor output (Q5) |
| C. Advisor `surfaceHint` as the priority mechanism | none (already exists) | zero | pass-through only: it promotes a matched surface via `--surface-hint`; it cannot lift a user surface over OpenCode for prompts that do not name both | None cheaper — but alone insufficient (same finding as iteration 2 row C, now confirmed for the advisor path) |
| D. Ship the default without the two example surfaces (delete from tieBreak/registry/fixture/graph), operator repo re-adds locally | `hub-router.json:7`, `mode-registry.json`, canary fixture, advisor graph regen; operator keeps a local variant | one coordinated data edit per surface set + regenerations | operator repo needs its own variant or override; doctor 5k needs fixture cases for remaining signals only | Docs-only marking — fails because `skill-graph.json` signals, tieBreak, and the canary fixture still encode the examples as installed |

## Questions Answered
None fully. Q1's advisor/doctor/README/hooks slice is now covered (rows 1–14); `ROUTER.md` §8–§11 (RESOURCE_MAP projection, drift guard) remains unread. `answeredQuestions: []` recorded so the reducer does not tick Q1 early.

## Questions Remaining
- Q1 (`ROUTER.md:265-618` §8–§11 only)
- Q2, Q3, Q4, Q5, Q6 — untouched this iteration.

## Ruled Out
- Reading the advisor as a surface ranker — it has no surface ids and its surfaceHint is a pass-through to `compiled-route.cjs` (rows 4–5).
- Treating the advisor's `webflow cms` disambiguation as surface-order evidence — it routes to mcp-code-mode and penalizes sk-code (row 3).
- `.skilled/README.md` as a documentation surface — the path does not exist (row 10).

## Dead Ends
- None newly eliminated beyond the above; the deletion experiment remains Q2's focus and was again not attempted.

## Edge Cases
- Ambiguous input: none material. "Q1 part 3" was read per the dispatch's file list; `.skilled/README.md` turned out not to exist and the root `README.md` was substituted.
- Contradictory evidence: the root README says "three ready surfaces" (`:800`) and also "Replace the shipped … surfaces" (`:1384,1447`) — recorded as-is; resolution is Q4/Q5's.
- Missing dependencies: `.skilled/README.md` absent (named in the dispatch); `resource-map.md` absent by config; no coverage gate.
- Partial success: `parent-skill-check.cjs` lines 494–2010 were not read in full (only the canary section by grep); the doctor command YAMLs were inventoried but not read; `ROUTER.md` §8–§11 remains. Status remains `complete`: the focus's core inventory is answered.

## Sources Consulted
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` (bounded JSON walk; 8 hits, key paths)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts:34-40`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:128-134`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:595-603`
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:2029-2033`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/holdout-prompts.jsonl:30-34`
- `.skilled/skills/system-skill-advisor/runtime/scripts/fixtures/skill-advisor-regression-cases.jsonl:12-16`
- `.skilled/skills/system-skill-advisor/runtime/tests/advisor-surface-hint.vitest.ts:1-115` (full read)
- `.skilled/commands/doctor/scripts/parent-skill-check.cjs:1-493,130,138-139,1184-1291`
- `.skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml:68-100`; `.skilled/commands/doctor/assets/mcp-mutation-class-manifest.yaml:80-87` (grep hits)
- `README.md:800,1384-1385,1447` (line scan; 1601 lines)
- `.skilled/scripts/git-hooks/pre-commit:96-97,139`; `.skilled/hooks/git/pre-commit:5,29,64`
- Commands: grep sweeps + two bounded `node -e` scans (all exit 0); `date -u` 16:52:53Z
- State files: `deep-research-config.json`, `deep-research-strategy.md`, `deep-research-state.jsonl`, `findings-registry.json`, `iteration-001.md`, `iteration-002.md` (lineage-local)

## Assessment
- New information ratio: 0.96 (13 of 14 findings fully new — advisor graph signals, scorer lanes, corpora, doctor 5k checks, README lines, hooks; 1 partially new — advisor surfaceHint forwarding confirmed after iteration 2 documented the compiled-route hint)
- Questions addressed: Q1 (advisor/doctor/README/hooks slice only)
- Questions answered: none fully

## Reflection
- What worked and why: the key-path JSON walk (`node -e` recursion printing `$.signals.sk-code[i]`) was the only cheap way to locate strings inside the single-line `skill-graph.json` (18,413 chars); a plain grep could not show where in the line the match sat. One call converted "the file mentions obsidian" into exact key paths.
- What did not work and why: nothing failed; the 24-call cap was reached with 22 used because the focus names four subsystems. `.skilled/README.md` was named but absent — a reminder to `fs.existsSync` before reading dispatch-named paths.
- What I would do differently: check doctor command YAMLs (`doctor-parent-skill.yaml`) to learn the hub list the doctor audits, instead of only the auditor script.

## Recommended Next Focus
Finish Q1 with `ROUTER.md:265-618` (§8–§11 RESOURCE_MAP projection and the drift guard that assumes a deleted surface is an input it was not written for), then Q2's throwaway-copy deletion experiment, testing as first hypotheses: doctor 5k-canary coupling (row 7) and the advisor graph's `signals.sk-code` keywords (row 1).
