# Batch Still-Real Verification — L5 Advisor Correctness, Part B (17 findings)

> Fresh-context Fable 5 verifier pass, 2026-06-12. Every finding re-checked against current code at HEAD (branch `028-mcp-to-cli-tool-transition`); banked line numbers re-derived from live reads. `memory_health` overage reproduced live against the warm daemon.

## Summary Table

| ID | Sev | Verdict | Fix class | Current anchor |
| --- | --- | --- | --- | --- |
| tri-093 | P2 | STILL-REAL | doc-only | install_guides/README.md:788-794; advisor-server.ts:199-211 |
| tri-098 | P3 | STILL-REAL | code-small | skill-advisor-cli.md:3,17,41; skill-advisor-cli-manifest.ts:22 |
| tri-099 | P2 | STILL-REAL | doc-only | feature_catalog.md:21,27-33 (live files = 41; group 07 = 3) |
| tri-138 | P2 | STILL-REAL | code-small | context-server.ts:1312-1314 (reproduced: 1268/1000, hint only) |
| tri-141 | P2 | STILL-REAL | doc-only | daemon_cli_reference.md:41-45 (zero cwd/absolute-path mentions) |
| tri-156 | P2 | STILL-REAL | code-careful | code-graph-tools.ts:22-32,84-120; index.ts:80-82; SKILL.md:333 |
| tri-166 | P2 | STILL-REAL | doc-only | spec-memory launcher:1298,1343-1358 vs code-index:831-840, advisor:1148-1165 |
| tri-168 | P2 | STILL-REAL | code-small | advisor-recommend.ts:378-388; shadow-sink.ts:95-101 |
| tri-171 | P2 | STILL-REAL | doc-only | advisor_scorer.md:90 vs explicit.ts:29 |
| tri-172 | P2 | STILL-REAL | code-small | validate.ts:66-108 (no freshness checks); skill-graph-db.ts:511-521 |
| tri-173 | P2 | STILL-REAL | code-careful | advisor-validate.ts:422-431,575-578; corpus has no real-session source_type |
| tri-174 | P2 | STILL-REAL | code-small | skill_advisor.py:2966-3001 (line 2990 confidence-only) vs ambiguity.ts:28-34 |
| tri-175 | P2 | STILL-REAL | doc-only | validation_baselines.md:78-87 vs advisor-validate.ts:554-597 |
| tri-180 | P3 | STILL-REAL | code-careful | advisor-tool-schemas.ts:283-289; metrics.ts:389-403 |
| tri-181 | P2 | STILL-REAL | doc-only | only .opencode/agents/markdown.md:258 handles hook-injected advisor context |
| tri-184 | P2 | STILL-REAL | code-small | trusted-caller.ts:30-34; propagate-enhances.ts:40-43 |
| tri-188 | P2 | STILL-REAL | doc-only | manual_testing_playbook.md:291 vs manual-testing-playbook.vitest.ts:49-55 |

**Tally: 17/17 STILL-REAL** (0 MOVED, 0 OVERTAKEN, 0 REFUTED).

---

## Per-Item Notes

### tri-093 — Install guide config omits trust grant needed for native MCP mutations — STILL-REAL
- `.opencode/install_guides/README.md:788-794`: the `mk_skill_advisor` environment block carries only `MK_SKILL_ADVISOR_DB_DIR`, `SPECKIT_ADVISOR_SHADOW_MODE`, `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` — no `MK_SKILL_ADVISOR_TRUST_DEFAULT` (grep over the whole guide: zero hits).
- `.opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts:199-211`: transport-absent metadata fails CLOSED unless `process.env.MK_SKILL_ADVISOR_TRUST_DEFAULT === 'trusted'` (line 211).
- Working config has the grant: `opencode.json:61`.
- **Scope widened:** the skill-local `.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md` also omits the env var — fix both guides together.
- Risk: guide-followers get `advisor_rebuild`/`skill_graph_scan` rejected from native MCP repair flows. Fix class: **doc-only**.

### tri-098 — CLI manifest documented as generated from TOOL_DEFINITIONS but hand-maintained — STILL-REAL
- `.opencode/skills/system-skill-advisor/feature_catalog/mcp-surface/skill-advisor-cli.md:3` ("byte-identical schemas to TOOL_DEFINITIONS"), `:17` ("via a generated manifest"), `:41` ("Command registry generated from `TOOL_DEFINITIONS`").
- `.opencode/skills/system-skill-advisor/mcp_server/skill-advisor-cli-manifest.ts:22`: static `SKILL_ADVISOR_TOOL_DEFINITIONS` array; only the *type* is imported (`:5`), not the server registry. `SKILL_ADVISOR_CLI_TOOL_MANIFEST` (`:142`) maps from the static copy.
- Server `TOOL_DEFINITIONS` assembled separately and exported at `advisor-server.ts:48`. Existing tests (`tests/skill-advisor-cli-help-aliases-errors.vitest.ts`) iterate only the CLI manifest — no deep-compare against server `TOOL_DEFINITIONS` exists.
- Risk: a server schema change silently drifts the CLI; the documented drift-proof mechanism doesn't exist. Fix class: **code-small** (parity test or derive-from-server). Interlock: same drift-class as tri-156.

### tri-099 — Feature catalog count internally contradictory and stale — STILL-REAL
- `feature_catalog.md:21`: "38 features across 7 groups". Table (`:27-33`) sums 7+7+5+6+10+4+3 = **42**. Line 32 claims 4 hooks/plugin files.
- Live inventory (counted 2026-06-12): 01=7, 02=7, 03=5, 04=6, 06=10, **07=3**, 08=3 → **41** immediate feature files.
- Three mutually inconsistent answers (38 / 41 / 42) persist exactly as found. Fix class: **doc-only** (plus optional count-guard test). Interlock: same stale-count class as tri-188.

### tri-138 — memory_health exceeds token budget, hint only — STILL-REAL (reproduced live)
- Live repro: `node .opencode/bin/spec-memory.cjs memory_health --json '{}' --warm-only --format json` → `hints: ['Response exceeds token budget (1256/1000)']`, `meta.tokenCount=1268`, `meta.tokenBudget=1000`.
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1275-1308` truncates only a `data.results` array; `:1312-1314` "No truncatable results array — add warning hint only" and returns the oversized envelope.
- Risk: token budget is advisory, not enforced, for non-results envelopes (memory_health among them). Fix class: **code-small** (compact health projection / per-tool reducer). Note: this is a spec-memory dispatcher item riding in the advisor batch — fix lands in system-spec-kit, not the advisor.

### tri-141 — CLI docs show repo-relative paths without cwd precondition — STILL-REAL
- `.opencode/skills/system-spec-kit/references/cli/daemon_cli_reference.md:41-45` (invocation forms) and `:59-61` (examples) all use `node .opencode/bin/<cli>.cjs ...`; grep for `repo root|repository root|cwd|absolute|working directory` over the doc: **zero hits**.
- `.opencode/bin/README.md:177` does say "Run from the repository root." — but only inside §7 VALIDATION, not as a precondition on the general invocation guidance.
- Risk: arbitrary-cwd callers (hooks, cron, temp dirs) get `Cannot find module` and may misread it as daemon failure. Fix class: **doc-only**.

### tri-156 — Code-graph dispatcher keeps an independent hardcoded tool registry — STILL-REAL
- `.opencode/skills/system-code-graph/mcp_server/index.ts:80-82`: ListTools advertises from `CODE_GRAPH_TOOL_SCHEMAS`.
- `.opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts:22-32`: hardcoded `TOOL_NAMES` set; `:84-120`: hardcoded dispatch switch (with reserved-slot comments confirming the manual-extension pattern).
- `.opencode/skills/system-code-graph/SKILL.md:333`: "NEVER hardcode tool lists or namespace prefixes in router or caller code." (The previously cited :303 anchor no longer carries the rule; :333 does.)
- Risk: a schema-only addition is advertised by ListTools but unreachable in dispatch until two more sites are hand-updated. Fix class: **code-careful** (single registration table feeding schemas, names, dispatch, CLI manifest). Interlock: same drift-class as tri-098.

### tri-166 — Watchdog/child-supervision non-uniform across launchers — STILL-REAL
- `.opencode/bin/mk-spec-memory-launcher.cjs:1298` (crash-loop guard), `:1338-1358` (`scheduleRelaunch` with backoff and owner-disposal race guard), plus RSS-watchdog plumbing (`:1165-1192`).
- `.opencode/bin/mk-code-index-launcher.cjs:831-840`: child exit → clear leases → mirror signal or `process.exit` — no relaunch.
- `.opencode/bin/mk-skill-advisor-launcher.cjs:1148-1165`: same exit-on-child-exit semantics (with model-server shutdown first).
- Risk: advisor/code-index daemons die permanently on a child crash where spec-memory self-heals; acceptable only if documented as an intentional lifecycle difference. Fix class: **doc-only** (document the supported non-parity) with code-careful as the alternative (shared supervisor module).

### tri-168 — advisor_recommend writes shadow deltas during read-style scoring — STILL-REAL
- `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts:378-388`: unconditional `recordShadowDelta(...)` per shadow recommendation on every uncached recommend.
- `.opencode/skills/system-skill-advisor/mcp_server/lib/shadow/shadow-sink.ts:95-101`: `mkdirSync` + `appendFileSync` JSONL (plus rotation `:112-119`).
- No disable gate exists: the only envs touching the path are `SPECKIT_ADVISOR_SHADOW_DELTA_PATH` (path override, `shadow-sink.ts:63`) and the unrelated `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` (`advisor-recommend.ts:408`). `SPECKIT_ADVISOR_SHADOW_MODE` has no reader in the recommend path.
- Risk: native recommend is never side-effect-free; read-only parity harnesses leave telemetry residue. Fix class: **code-small** (gate writes behind an explicit flag/handler option).

### tri-171 — Scorer docs describe the `git` token target incorrectly — STILL-REAL
- `.opencode/skills/system-skill-advisor/references/scoring/advisor_scorer.md:90`: "`git` to sk-code at 1.0".
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts:29`: `git: [['sk-git', 1]]`.
- Risk: misleads trigger-vocabulary tuning under audit. Fix class: **doc-only** (one-line correction).

### tri-172 — skill_graph_validate doesn't check derived freshness — STILL-REAL
- `.opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/validate.ts:66-108`: checks schema version, broken edges, cycles, weight bands, symmetry, weight parity, orphans. Grep for `derived|last_updated|freshness|timestamp` in the file: **zero hits**.
- `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:511-521` (`requireDerived`): schema v2 only requires `derived` to be *an object* — no timestamp field requirement.
- Risk: missing/stale/unparseable freshness metadata silently degrades the age-haircut lane with no validator signal. Fix class: **code-small**.

### tri-173 — No empirical ambiguity FP/FN slice — STILL-REAL
- `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-validate.ts:422-431`: `ambiguityStable()` is one synthetic two-skill fixture; surfaced as `parity.ambiguity_slice_stable.top2Within005` (`:575-578`).
- Corpus metrics remain top-1/unknown/false-fire only (`:506-566`).
- Live corpus check (`scripts/routing-accuracy/labeled-prompts.jsonl`, 193 rows): `source_type` ∈ {synthetic-realistic: 96, paraphrased-realistic: 37, synthetic-edge: 48, synthetic-command: 12} — **no real-session type**. A `mixed_ambiguous` bucket (32 rows) exists but labels Gate-3 trigger ambiguity (`gate3_reason_category`), not advisor-abstention expected outcomes; no row carries an expected-ambiguous advisor label.
- Risk: the dual-margin abstention predicate ships uncalibrated against real prompts. Fix class: **code-careful** (new labeled slice + FP/FN reporting). Interlock: land with tri-174 and tri-175.

### tri-174 — Python fallback ambiguity abstention is confidence-only — STILL-REAL
- `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2966-3001` (`_apply_low_info_ambiguity_abstention`, docstring claims "TS parity" at `:2970`): cluster formed at `:2990` purely by `top_conf - confidence <= 0.05`.
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/ambiguity.ts:28-34`: native cluster admits a candidate when **either** scoreGap ≤ 0.05 **or** confidenceGap ≤ 0.05.
- Risk: during native-unavailable fallback, score-only near-ties escape abstention (false-negative ambiguity vs TS). Fix class: **code-small** (port score margin, or scope the parity claim + tests to confidence-only). Interlock: tri-173/tri-175.

### tri-175 — Validation baseline docs name obsolete output fields — STILL-REAL
- `.opencode/skills/system-skill-advisor/references/scoring/validation_baselines.md:78-87` instructs retaining `slices.corpus.topOne`, `slices.holdout.topOne`, `slices.parity.passed`, `slices.safety.violations`, `slices.latency.cacheHitP95Ms`, `telemetry.unknownCount`, `telemetry.lanesDominantCount`.
- Actual output (`advisor-validate.ts:554-597`): `slices.corpus.full_corpus_top1` / `unknown_count` / `gold_none_false_fire_count`, `slices.holdout.holdout_top1`, `slices.parity.explicit_skill_top1_regression` / `ambiguity_slice_stable` / `derived_lane_attribution_complete`, `slices.safety.adversarial_stuffing_blocked`, `slices.latency.regression_suite_status.cacheHitP95Ms`. Unknown count lives under the corpus slice, not telemetry.
- Risk: operators collect baselines against fields that don't exist. Fix class: **doc-only**. Interlock: update alongside any tri-173 slice addition to avoid documenting twice.

### tri-180 — No harvestable real-misroute payload in outcome telemetry — STILL-REAL
- `.opencode/skills/system-skill-advisor/mcp_server/schemas/advisor-tool-schemas.ts:283-289`: `outcomeEvents` accept only runtime/outcome/skillId/correctedSkillId/timestamp (`.strict()`).
- `.opencode/skills/system-skill-advisor/mcp_server/lib/metrics.ts:389-403`: persisted record is timestamp/runtime/outcome/skillLabel/correctedSkillLabel only — no prompt, scenario, or expected-skill payload.
- Risk (P3, capability gap by design — prompt-safety intentional): gold regression cases can't be reconstructed from telemetry; harvesting real misroutes needs a new opt-in, privacy-gated capture path. Fix class: **code-careful**.

### tri-181 — Most live agents don't consume hook-injected advisor context — STILL-REAL
- Grep over `.opencode/agents/*.md` for `Skill Advisor|skill-advisor|advisor brief|hook-injected|Advisor:` → single hit: `markdown.md:258` ("Use hook-injected startup, graph, memory, or skill-advisor context as a routing hint."). The other 12 agent files (code, context, orchestrate, review, debug, deep-*, ai-council, prompt-improver) have no advisor-brief handling.
- Risk: brief uptake is inconsistent across agents; Gate-2 hook context may be ignored or over-trusted depending on the agent. Fix class: **doc-only** (small shared agent rule: hint-only, never overrides scope gates/permissions).

### tri-184 — Shared trust rejection message hard-coded to skill_graph_scan — STILL-REAL
- `.opencode/skills/system-skill-advisor/mcp_server/lib/auth/trusted-caller.ts:30-34`: rejection always reads `'skill_graph_scan requires trusted caller context'`.
- `.opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/propagate-enhances.ts:40-43`: surfaces `trustedCaller.error` verbatim — `skill_graph_propagate_enhances` rejections name the wrong tool.
- Risk: misleading auth-denial diagnostics during trusted-mutation troubleshooting. Fix class: **code-small** (tool-name parameter or per-handler message mapping). Interlock: tri-093 — both touch the trusted-caller UX; fixing the message while documenting the trust grant gives operators a coherent story.

### tri-188 — Playbook says inventory test verifies 41 scenarios; guard verifies 46 — STILL-REAL
- `.opencode/skills/system-skill-advisor/manual_testing_playbook/manual_testing_playbook.md:291`: "...verifies the root playbook rows, the live per-feature file inventory and the **41-scenario** package count."
- `.opencode/skills/system-skill-advisor/mcp_server/tests/manual-testing-playbook.vitest.ts:45-55`: asserts the 46-scenario corpus — 46 rows, 46 unique IDs, 46 files.
- Live count: 46 scenario `.md` files under category subdirectories. Playbook `:32` and `:129` already say 46; only the `:291` cross-reference is stale (the "41" at `:36` describes the deprecated source corpus and is accurate in context).
- Risk: reviewers misread what CI protects. Fix class: **doc-only** (one number). Interlock: same stale-count class as tri-099.

---

## Interlocks & Sequencing

1. **Registry-drift pair (tri-098, tri-156):** identical failure shape — a documented "generated/single-source" registry that is actually hand-duplicated. A shared registration-table pattern (definition + handler in one row) or a deep-compare parity test resolves both; fix them with the same recipe.
2. **Stale-count doc pair (tri-099, tri-188):** both are governance-count drift in skill-advisor docs. tri-188's vitest guard is the model — tri-099's fix should add the analogous count guard, not just patch numbers.
3. **Ambiguity calibration cluster (tri-173, tri-174, tri-175):** sequence as 174 (decide Python parity contract) → 173 (add labeled slice + FP/FN metrics) → 175 (rewrite baseline doc once, against the final schema). Doing 175 first means documenting the schema twice.
4. **Trust-surface pair (tri-093, tri-184):** both touch trusted-mutation operator experience; a single packet covering "trust grant documented + rejection message correct" is cheaper than two passes over the same auth path.
5. **tri-138 is spec-kit, not advisor:** its fix lands in `system-spec-kit/mcp_server/context-server.ts`; keep it out of any advisor-scoped commit to respect scope lock.

**BATCH: COMPLETE 17/17**
