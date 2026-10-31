# Iteration 1: Advisor routing mechanics and command surfacing

## Focus
How `.skilled/bin/skill-advisor.cjs` and `.skilled/skills/system-skill-advisor/` score and surface candidates today, and whether commands — the doctor family in particular — enter the advisor's candidate set at all.

## Actions Taken
- Read the CLI shim `.skilled/bin/skill-advisor.cjs` in full.
- Inventoried `runtime/` layout; inspected `runtime/database/skill-graph.sqlite` schema and node census.
- Traced the command-bridge pipeline: `runtime/scripts/command-bridges/derive-command-bridges.cjs`, `allow-list.json`, `command-bridges.generated.json`, `scoring-compatibility.json`, and their injection point in `runtime/lib/scorer/projection.ts`.
- Read `hooks/skill-advisor-hook.md` and the phrase-boost lane `runtime/lib/scorer/lanes/explicit.ts`.

## Findings
1. `.skilled/bin/skill-advisor.cjs` is a 116-line shim: it sets the IPC socket dir (`SPECKIT_IPC_SOCKET_DIR`, default `/tmp/system-skill-advisor`), enforces dist freshness via `checkPackageFreshness`, then `spawnSync`s `dist/runtime/skill-advisor-cli.js` — all real logic lives in the daemon-backed runtime [SOURCE: .skilled/bin/skill-advisor.cjs:85-109].
2. The advisor's candidate store is `runtime/database/skill-graph.sqlite`: `skill_nodes` (14 rows; families cli, deep-loop, mcp, sk-code, sk-util, system), `skill_edges`, and `skill_docs` which stores per-doc `trigger_phrases`. No command rows exist — a `WHERE source_path LIKE '%commands%'` and `%doctor%` probe returns zero [SOURCE: .skilled/skills/system-skill-advisor/runtime/database/skill-graph.sqlite schema+query].
3. Commands reach the scorer only through a generated bridge projection: `GENERATED_COMMAND_BRIDGES` inside `// BEGIN/END GENERATED COMMAND BRIDGES` markers in `projection.ts` (lines 153-615), exported as `COMMAND_BRIDGES` (line 617) and merged into the scoring inventory at lines 1127, 1152, 1205 via `scoringCommandBridges(COMMAND_BRIDGES)` [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:153-617,1127-1205].
4. `derive-command-bridges.cjs` builds that table from exactly two sources: per-skill `command-metadata.json` files (only sk-doc, sk-design, system-deep-loop ship one — 19 entries) plus a hand-maintained `allow-list.json` (8 entries) = 27 generated rows; only 5 are enabled for the TypeScript scorer (create:agent, create:manual-testing-playbook, memory-save via two ids, spec-kit) while 15 are enabled for the Python compat scorer [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:18-40; command-bridges.generated.json counts; find command-metadata.json → 3 files].
5. No doctor command is bridged: doctor commands live under `.skilled/commands/doctor/` (not inside a skill, so no `command-metadata.json` can pick them up) and the allow-list contains only /speckit:*, /memory:save, /prompt — doctor routing is invisible to the advisor today [SOURCE: command-bridges.generated.json entries; allow-list.json].
6. A doctor-side tuning contract already exists and is wired to the scorer: `lanes/explicit.ts:108-111` comments that every `PHRASE_BOOSTS` amount must lie in [-1.0, 2.0], "the same range the doctor skill-advisor proposal validator enforces (`phrase_boost_range` in .skilled/commands/doctor/assets/doctor-skill-advisor-tune.yaml)" — `/doctor:skill-advisor` is itself the doctor that tunes advisor phrase boosts, and its invariant is "tune the routing surface, never the routing logic" [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:107-113; .skilled/commands/doctor/assets/doctor-skill-advisor-tune.yaml].
7. The explicit lane hard-boosts literal slash-command phrases into owning skills: `/deep:research` → system-deep-loop 1.6 + command-spec-kit 0.45; `/speckit:resume` → system-spec-kit 0.9 + command-spec-kit 0.75; `/speckit:save` → memory:save 1.6 — a precedent for routing a typed command name to a skill [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:113-120].
8. The hook path is skill-only in its render contract: `shouldFireAdvisor` gates prompts, `buildSkillAdvisorBriefFromCli` runs `advisor_recommend --json - --no-warm-only` within a ~2.5 s budget over stdin, and `renderAdvisorBrief` emits `Advisor:` text naming recommended *skills* — no command surface exists in the brief [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md §2].

## Questions Answered
- Q1 (advisor mechanics: scorer inputs, hook wiring, graph/trigger data) — answered: sqlite graph + generated bridge table + explicit-lane phrase boosts + hook brief contract.
- Q2 (commands surfaced versus skills) — partially answered: commands surface via command-metadata.json/allow-list bridges; doctor commands do not surface at all. Remaining part — what `_routes.yaml` does and whether it could feed the bridge — deferred to a later iteration.

## Questions Remaining
- Does `advisor_recommend` ever emit a doctor suggestion today on setup/health prompts? (measured baseline)
- What trigger_phrases does `_routes.yaml` carry per doctor route, and is that file machine-readable enough to feed `derive-command-bridges.cjs`?
- How does the Python compat scorer (`skill_advisor.py`) treat bridges, for parity?

## Ruled Out
- Looking for doctor commands in the sqlite graph: confirmed absent, no further probing needed there.

## Dead Ends
- None yet; every probe produced evidence.

## Edge Cases
- Ambiguous input: none.
- Contradictory evidence: `typescriptActive: 5` vs `pythonActive: 15` — the two scorer surfaces do not share the same active bridge set; parity is already partial.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted
- .skilled/bin/skill-advisor.cjs:1-116
- .skilled/skills/system-skill-advisor/runtime/database/skill-graph.sqlite (schema + node census)
- .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:75-617,1127-1205
- .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:95-120
- .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/{derive-command-bridges.cjs,allow-list.json,command-bridges.generated.json,scoring-compatibility.json}
- .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:1-60
- .skilled/commands/doctor/assets/doctor-skill-advisor-tune.yaml:1-60
- steer.md: absent this iteration

## Assessment
- New information ratio: 1.0 — every finding is new to this packet; the bridge mechanism and doctor invisibility were not previously recorded anywhere in this lineage.
- Questions addressed: Q1, Q2 (partial).
- Questions answered: "How does skill-advisor.cjs score and surface candidates today: scorer inputs, hook wiring, graph and trigger data sources?"

## Reflection
- What worked: going straight to the sqlite census proved absence (zero doctor/command rows) rather than inferring it; reading the generator script gave the exact input contract (command-metadata.json + allow-list).
- What did not work: initial `find` over `runtime/` truncated — the tree is large; narrowing by filename pattern fixed it.
- What I would do differently: next iteration should read `_routes.yaml` and the doctor command docs before running the measured baseline, so prompt probes can be compared against declared triggers.

## Recommended Next Focus
The doctor family inventory: `.skilled/commands/doctor/_routes.yaml` trigger_phrases per route and what each `/doctor:*` command covers — the data source a bridge would consume.
