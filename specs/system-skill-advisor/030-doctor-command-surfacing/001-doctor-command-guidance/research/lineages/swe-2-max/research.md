# Research Synthesis — skill advisor → doctor command guidance (lineage swe-2-max)

Topic: how the skill advisor can point users to the right `/doctor:*` command for plain-language setup and health questions. Progressive synthesis; consolidated during the loop and finalized at convergence.

## Progressive Findings (accumulated per iteration)

### Iteration 1 — Advisor routing mechanics
- `.skilled/bin/skill-advisor.cjs` is a thin shim; the daemon-backed `dist/runtime/skill-advisor-cli.js` does the work [`.skilled/bin/skill-advisor.cjs:105-109`].
- The candidate store is `runtime/database/skill-graph.sqlite`: `skill_nodes` + `skill_docs.trigger_phrases`. It holds 14 skill nodes and **zero command nodes** — doctor commands are not in the graph.
- Commands surface only through a generated bridge: `derive-command-bridges.cjs` reads per-skill `command-metadata.json` (only sk-doc, sk-design, system-deep-loop) plus `allow-list.json` → `command-bridges.generated.json` (27 rows) → injected into `projection.ts` `GENERATED_COMMAND_BRIDGES` (lines 153-615) and Python `skill_advisor.py`. Only 5 bridges are TypeScript-active.
- **No doctor command is bridged** — doctor commands are not owned by a skill and are absent from the allow-list.
- The explicit lane (`lanes/explicit.ts`) already boosts literal slash phrases (`/deep:research` → system-deep-loop 1.6); `PHRASE_BOOST_BOUND` [-1.0, 2.0] is enforced in lockstep with `.skilled/commands/doctor/assets/doctor-skill-advisor-tune.yaml` — `/doctor:skill-advisor` is the doctor that tunes the advisor itself.
- The hook (`hooks/skill-advisor-hook.md`) renders `Advisor:` briefs naming **skills** only; no command surface exists in the render contract.

### Iteration 2 — Measured baseline (17 advisor_recommend probes)
- Envelope: `data.recommendations[]` + `ambiguous` flag; confidenceThreshold 0.8, uncertaintyThreshold 0.35; `_shadow` learned-weights block present.
- **6/12 natural setup/health prompts return zero recommendations** ("help me set up skilled", "is my repo set up right", "why is this rule not enforced", "set up the development environment", "check if my environment is healthy", "update my skills to latest").
- **6/12 surface a skill instead of a doctor**: git hooks → sk-git 0.83; MCP not connecting → mcp-code-mode 0.89; advisor complaints → system-skill-advisor 0.85; speckit setup → system-spec-kit 0.82; install git hooks → sk-git 0.82; "run diagnostics" → ambiguous weak trio.
- **Literal names miss too**: `/doctor:git` → sk-git 0.83; `/doctor:env` → empty; `doctor:skill-advisor` → system-skill-advisor 0.82; "run the doctor for my repo" → ambiguous with sk-doc (docs skill!) top.
- 17/17 probes: zero doctor surfaces. Skill captures are defensible (right domain, wrong artifact kind) — they define the anti-steal boundary, not blanket overrides.

### Iteration 3 — Doctor family inventory
- `_routes.yaml` (schema_version 1) is the canonical manifest: 14 routes across 7 commands + `mcp_subroutes` (install, debug) + standalone `/doctor:update`; 18 `trigger_phrases:` blocks; validated by `scripts/route-validate.sh`.
- Its header self-documents the gap: trigger_phrases are "**retained for a possible future doctor-routes harvester but inert today**" — both harvesters (Python `skill_advisor.py:988-991`, TS `doc-frontmatter.ts:36,170`) walk only `.skilled/skills/*/{references,assets}/*.md` behind `SPECKIT_ADVISOR_DOC_TRIGGERS` (default off).
- `/doctor:skill-advisor` owns 6 targets incl. `tune`, `rebuild`, `router-reach`; `/doctor:git` owns hooks/standards/setup.
- **`/doctor:env` is not in the manifest and has no triggers** — there is no generic "is my repo set up right" route; the family lacks an umbrella onboarding/health entry.
- Every doctor `.md` carries `<!-- skill_agent: <skill-id> -->` — a ready-made `skillId`/`ownerMode` for a bridge.
- `ci-router-vocabulary-reach.cjs` (wrapped by `/doctor:skill-advisor router-reach`) probes the live advisor per declared phrase — the reusable accuracy harness.

### Iteration 4 — Command surface mechanics
- `CommandBridgeProjection extends SkillProjection` with `kind:'command'` + `routingEnabled`; doctor entries would be structurally identical to existing bridges.
- **Renderer is already command-aware**: `render.ts:170` maps `kind:'command'`; the brief can print a command as the `use <label>` top pick or in the `ambiguous:` two-candidate form — no renderer change needed.
- `shouldFireAdvisor` declines only empty/exact-skip/short-casual prompts — natural-language doctor intents reach the scorer today.
- `command-catalog-mirror-check.cjs` documents the intent: command-metadata.json exists "so the skill advisor can route to a command it owns" — doctor has no owning hub file.
- Metadata schema provides `userIntent.ownedSignals` + `discriminator.preferSiblingWhen` — existing anti-steal vocabulary.
- Activation seam: `scoring-compatibility.json` holds per-platform keywords/intentSignals — where `_routes.yaml` trigger_phrases would land.
- Gate-1 trigger index already surfaces doctor-adjacent docs (files, not commands) — complementary channel.

### Iteration 5 — Design consolidation
- Prior art (`specs/agents/016-repo-rule-advisor-surfacing/001-advisor-surfacing`) refused advisor surfacing for repo *rules* — obligations with no invocation; doctor commands are the admissible `kind:'command'` case. Transferable cautions: no constant brief lines, measure first, no trigger-index misuse.
- `.skilled/commands` is absent from trigger-index `CORPUS_ROOTS` (corpus.mjs:31) — commands are invisible to **both** retrieval channels.
- Routers consume `_routes.yaml` at dispatch time (argv + presentation menu) — the manifest is the single live routing source.

## Ranked Recommendations

1. **Extend `derive-command-bridges.cjs` with a `_routes.yaml` source** — emit one `kind:'command'` bridge per doctor command, aggregating its routes' `trigger_phrases` into `keywords`/`intentSignals`; take `skillId` from each command's `<!-- skill_agent -->` tag and `ownerMode:'doctor'`; `source` = `.skilled/commands/doctor/_routes.yaml`. This is a data-source addition honoring the doctor invariant "tune the routing surface, never the routing logic" — no scorer change, and the manifest's own header anticipates the harvester. One entry per command (bridgeId admits one `/cmd:sub`; sibling targets share it). Evidence: iterations 1, 3, 4.
2. **Add a generic setup/health doctor target for the onboarding gap** — a `/doctor:setup` umbrella (or a `setup` target on an existing doctor) orchestrating the per-domain setup batteries, with trigger_phrases covering "set up skilled", "is my repo set up right", "skilled onboarding". Without it the headline prompts still have nothing to route to. Evidence: iterations 2 (empty probes), 3 (env gap).
3. **Activate the doctor bridges on both scorers via `scoring-compatibility.json`** — ship TS+Python enabled together (today only 5/27 are TS-active; parity is partial). Seed `keywords`/`intentSignals` from `_routes.yaml` trigger_phrases verbatim, then calibrate. Evidence: iterations 1, 4.
4. **Anti-steal by vocabulary design, not weight tuning** — doctor phrases stay diagnostic-flavored ("is my X setup working", "why is this rule not enforced", "check my git hooks setup"); rely on the existing `ambiguous:` two-candidate render when a skill competes; use `discriminator.preferSiblingWhen` if per-command metadata is later authored. Never boost bare work verbs. Evidence: iterations 2 (defensible skill captures), 4, 5.
5. **Wire routing-accuracy testing on the existing harness** — extend the `ci-router-vocabulary-reach.cjs` pattern (already wrapped by `/doctor:skill-advisor router-reach`) so every `_routes.yaml` trigger phrase must surface its `/doctor:*` in top-k; the 17-probe baseline in this lineage seeds a labeled gold battery for regression. Evidence: iterations 3, 4.
6. **Optional literal-name boosts in `explicit.ts` `PHRASE_BOOSTS`** — `/doctor:git` → `[['command-doctor-git',1.6],['sk-git',0.45]]` mirroring the `/create:agent` pattern; bounded by `PHRASE_BOOST_BOUND` [-1.0, 2.0] and the tune-yaml validator. Lowest priority: typed commands are the smallest misses and the hook path still surfaces the bridge once it exists. Evidence: iterations 1, 4.

### Ideas rejected (with reasons)
- **Fake skill nodes in skill-graph.sqlite** — `kind:'command'` exists precisely so commands aren't fake skills; pollutes `source_path` uniqueness and family taxonomy.
- **Hardcoded "try /doctor:X" brief text** — spec 016's fan-out refused this exact pattern: constant, unmatchable, bypasses scoring, duplicates routing in the render layer.
- **Harvesting `.skilled/commands/**/*.md` via the doc harvester** — env-gated off by default, wrong root and file type, and command prose would flood the lexical lane.
- **Copying doctor triggers into each owning skill's command-metadata.json** — duplicates `_routes.yaml`; `command-catalog-mirror-check.cjs` exists precisely because copies drift.
- **Umbrella `/doctor` router command as THE fix** — helps UX but does nothing for advisor visibility (same harvest boundary); keep as a possible UX complement only.
- **Scoring-logic/weight changes** — violates the doctor-skill-advisor invariant; the failure is missing candidates, not wrong math.

## Proposed Implementation Phases

- **Phase 1 — bridge generation.** Teach `derive-command-bridges.cjs` a third source: parse `_routes.yaml` `routes`/`mcp_subroutes`/`standalone`, join each command's `skill_agent` tag, emit bridge entries + `scoring-compatibility.json` rows seeded from `trigger_phrases`. Cover `/doctor:env` and `/doctor:update` (authored phrases — they have none today). Re-run derive + `route-validate.sh`; re-run the 17-probe battery to measure the delta.
- **Phase 2 — onboarding entry.** Add the generic setup/health doctor surface (new target or umbrella), with trigger_phrases for "set up skilled"/"is my repo set up right"-class prompts; it joins Phase-1 generation automatically via `_routes.yaml`.
- **Phase 3 — calibration + tests.** Extend router-reach (or add a doctor-route-reach script) asserting each declared phrase reaches its `/doctor:*`; build the labeled gold battery (natural + negative controls where skills SHOULD win); optional `PHRASE_BOOSTS` literal-name boosts; run `advisor_validate` and the doctor tune diagnostic (read-only per-lane scores vs gold battery).
- **Phase 4 — parity + docs.** Verify Python scorer parity; update the `_routes.yaml` header (drop "inert today", fix the stale py line cites 810-871 → ~988-1051); document the contract in `hooks/skill-advisor-hook.md` or a doctor README so the surface stays visible.

## Convergence Report

- **Stop reason:** `all_questions_answered` — legal convergence at iteration 5 (stopPolicy `convergence`; minIterations 3 satisfied; maxIterations 10 not reached).
- **Iterations completed:** 5 (mechanics → measured baseline → doctor inventory → command-surface mechanics → design consolidation).
- **Question-answer ratio:** 5/5 key questions resolved; 0 open, 0 uncovered at stop.
- **New-information trend:** newInfoRatio per iteration: 1.0 → 0.9 → 0.9 → 0.85 → 0.8. Strictly positive, mildly tapering — consistent with a bounded question converging as design space was exhausted; no stuck iterations, 0 state corruption.
- **Convergence signals:** reducer convergenceScore 0.80 (≥ 0.60 composite bar); graphBlockers none; edge-case diversity satisfied (measured empty-result probes, ambiguous renders, literal-name misses).
- **Evidence base:** 38 registered findings, 20 code-file source citations + measured `advisor_recommend` probes (17 prompts); every load-bearing claim carries `path:line` in iteration narratives.
