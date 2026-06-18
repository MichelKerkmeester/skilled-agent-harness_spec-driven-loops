# Batch Still-Real Verification — L5 Advisor Correctness, Part A

> Verifier: fresh Fable 5 pass, 2026-06-12. All citations re-read from current working tree (branch `028-mcp-to-cli-tool-transition`). Repro commands re-run live where the banked finding depended on runtime behavior.

## Summary

| ID | Sev | Verdict | Fix class | One-line risk |
| --- | --- | --- | --- | --- |
| tri-033 | P1 | STILL-REAL (repro'd) | code-careful | Explicitly named `mcp-code-mode` routes to chrome-devtools on the local path |
| tri-034 | P1 | STILL-REAL (repro'd) | code-small | Substring alias match turns "Recreate agent…" into a `create:agent` recommendation |
| tri-035 | P1 | STILL-REAL | code-small | V2 `generated_at` invisible to age haircut → near-now fallback exempts synced skills |
| tri-036 | P1 | STILL-REAL | code-careful | No runtime path refreshes the freshness field the scorer reads; haircut honesty is manual |
| tri-037 | P1 | STILL-REAL | code-small | Score-near-tie with confidence gap >0.05 renders singular `use <skill>` brief |
| tri-038 | P1 | STILL-REAL | code-small | Documented lane-weight env tuning silently stripped by launcher allowlist |
| tri-039 | P1 | STILL-REAL | doc-only | `SPECKIT_ADVISOR_SHADOW_MODE` configured + documented, zero runtime readers |
| tri-040 | P1 | STILL-REAL (narrowed) | code-careful | `skill_graph_status` on corrupt DB renames (or deletes on rename-fail) the live artifact |
| tri-041 | P1 | STILL-REAL | code-careful | Corrupt DB + live generation → status live → non-force rebuild skips |
| tri-042 | P1 | STILL-REAL (repro'd) | code-small | Corpus scorer unrunnable: `parents[6]` resolves above `Public` |
| tri-070 | P2 | STILL-REAL | doc-only | Install-guide `advisor_validate` example fails schema (missing `confirmHeavyRun`) |
| tri-083 | P2 | STILL-REAL | code-careful | No local/native parity gate beyond gold-preservation; harder-corpus drift non-blocking |
| tri-085 | P2 | STILL-REAL (dup of tri-042) | code-small | Same root cause; one-line fix resolves both |
| tri-086 | P2 | STILL-REAL (narrowed) | code-small | Init helper refreshes runtime-ignored JSON; never populates SQLite graph |
| tri-088 | P2 | STILL-REAL | code-small | Claude hook timeout knob bypasses native subprocess call; Codex env bounds it instead |
| tri-089 | P2 | STILL-REAL | code-small | OpenCode bridge renderer has no ambiguous branch; always emits `use <top>` |
| tri-090 | P2 | STILL-REAL | doc-only | Plugin README says 1000 ms bridge timeout; code default is 10000 ms |
| tri-092 | P2 | STILL-REAL | doc-only | Docs say only `advisor_rebuild` mutates SQLite; `skill_graph_scan` (and corrupt-DB `getDb`) also do |

**Score: 18/18 still real.** 0 MOVED, 0 OVERTAKEN, 0 REFUTED. tri-040 and tri-086 carry partial mitigations that narrow but do not retire the finding; tri-085 is the same defect as tri-042.

## Interlocks

- **tri-035 + tri-036** — one freshness-field contract. Decide the canonical field (`generated_at` vs `last_updated_at`) and the refresh owner together; fixing projection alone (035) still leaves static checked-in values (036), and wiring refresh alone still writes a field the scorer ignores.
- **tri-033 + tri-034 + tri-083** — local-scorer correctness cluster. Land the scorer fixes first, then the tri-083 parity gate locks them in; landing the gate first would fail on the known drift.
- **tri-040 + tri-041 + tri-092** — mutation-boundary cluster. Where the integrity probe lives (status vs rebuild), what counts as a mutation path, and the doc claim must ship coherently or the docs go false again.
- **tri-042 + tri-085** — identical root cause; a single `parents[5]` (or sentinel-walk) change closes both.
- **tri-037 + tri-089** — ambiguity-rendering parity. One shared dual-margin predicate consumed by `render.ts`, `skill-advisor-brief.ts`, and the bridge fixes all surfaces; patching one leaves the others drifted.

---

## Per-item notes

### tri-033 — Local scorer overrides explicitly named skill via related-skill keyword — STILL-REAL
Reproduced verbatim: `python3 …/skill_advisor.py --force-local --show-rejections --threshold 0.8 --uncertainty 0.35 'Use mcp-code-mode to call an external MCP tool chain through TypeScript execution.'` returns `mcp-code-mode` 0.95/0.39 `passes_threshold:false` and `mcp-chrome-devtools` 0.95/0.15 `passes_threshold:true` with reason containing `!mcp-code-mode(keyword)`. The keyword lane at `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:3260-3275` boosts chrome-devtools because `.opencode/skills/mcp-chrome-devtools/graph-metadata.json:27` and `:31` list `mcp-code-mode` in its manual depends_on/related_to. The asymmetry vs native holds: `mcp_server/lib/scorer/fusion.ts:289-295` gives toolchain vocabulary an explicit `mcp-code-mode` bonus; the Python path has no equivalent owner-override or demotion.
**Risk:** whenever the native route is down, prompts that explicitly name a skill can route to a sibling that merely references it. **Fix class:** code-careful (boost-ordering logic in the local scorer; regression-sensitive). **Interlock:** tri-083 gate should land after this fix.

### tri-034 — Python fallback matches explicit aliases by raw substring — STILL-REAL
`skill_advisor.py:3249` still does `if v in prompt_lower` for explicit variants (the keyword lane at `:3265` was upgraded to `_matches_phrase_boundary`, the explicit lane was not). Reproduced: `SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1 python3 …/skill_advisor.py "Recreate agent routing documentation" --threshold 0 --show-rejections` → top result `create:agent` 0.95/0.2 `passes_threshold:true`, reason `!create agent(explicit), !create agent(phrase), recreate~`.
**Risk:** documentation/routing prompts containing superstrings ("recreate") become command-bridge recommendations on the fallback path. **Fix class:** code-small — the boundary matcher already exists one loop below; apply it to explicit variants with slash-command literals exempted.

### tri-035 — V2 derived sync timestamp invisible to age haircut — STILL-REAL
`mcp_server/lib/scorer/projection.ts:224` and `:360` read `derived.last_updated_at ?? derived.created_at`; the v2 sync writer `mcp_server/lib/derived/sync.ts:110` writes `generated_at` (schema `mcp_server/schemas/skill-derived-v2.ts:46`); `mcp_server/lib/scorer/lanes/derived.ts:94` then falls back to `projection.generatedAt`, which the adjacent comment (derived.ts:88-90) admits is near-now on every run and exempts skills from the haircut.
**Risk:** any skill whose derived block goes through the v2 sync path loses per-skill freshness and scores as perpetually fresh. **Fix class:** code-small (accept `generated_at` in the projection's timestamp coalesce, both SQLite and filesystem branches, plus a regression test). **Interlock:** tri-036.

### tri-036 — No runtime path refreshes graph-metadata freshness — STILL-REAL
`syncDerivedMetadata` (`sync.ts:92`) and `backfillDerivedV2` (`lib/lifecycle/schema-migration.ts:32`) have zero runtime callers — only tests and stress tests import them (verified by repo-wide grep). `handlers/advisor-rebuild.ts:87-94` calls only `indexSkillMetadata` + `publishSkillGraphGeneration`; the indexer parses the existing derived block as-is (`lib/skill-graph/skill-graph-db.ts:648`) and stores it unchanged (`:894-904`, `:945`).
**Risk:** the age haircut's input is hand-maintained static metadata; ranking freshness silently decays into fiction. **Fix class:** code-careful (wiring a refresh into `advisor_rebuild`/`skill_graph_scan` touches trusted mutation paths and idempotency). **Interlock:** must agree with tri-035 on which field is canonical.

### tri-037 — Hook brief renderer misses score-only ambiguity — STILL-REAL
`mcp_server/lib/scorer/ambiguity.ts:28-35` unions a score-gap margin and a confidence-gap margin (either ≤0.05 → ambiguous) and stamps `ambiguousWith` (`:44-58`). Both render paths recheck confidence only: `mcp_server/lib/render.ts:95-98` (`isAmbiguous` = confidence gap ≤0.05) and `mcp_server/lib/skill-advisor-brief.ts:166-175` (`hasAmbiguitySignal`, same predicate). Neither consumes `ambiguousWith`.
**Risk:** score-near-ties with confidence gap >0.05 render a singular `use <skill>` brief — a false-negative on the user-visible ambiguity signal. **Fix class:** code-small (consume `ambiguousWith` or the shared dual-margin predicate). **Interlock:** tri-089 — fix the bridge renderer with the same predicate.

### tri-038 — Lane-weight env tuning stripped by launcher — STILL-REAL
`mcp_server/lib/scorer/lane-registry.ts:68` and `:72` read `SPECKIT_ADVISOR_LANE_WEIGHTS_JSON` / `SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON`; `.opencode/bin/mk-skill-advisor-launcher.cjs:85-121` (`CHILD_ENV_ALLOWLIST`) contains neither, and `:233` filters the child env strictly to the allowlist. ENV_REFERENCE.md:535-536 and the advisor README (:98) still tell operators to use the override.
**Risk:** operator tuning is silently ignored in the launched daemon while direct-import tests pass — a classic "works in test, dead in prod" knob. **Fix class:** code-small (two allowlist entries + a pass-through test).

### tri-039 — SPECKIT_ADVISOR_SHADOW_MODE has no runtime reader — STILL-REAL
`references/scoring/advisor_scorer.md:60` still claims `SPECKIT_ADVISOR_SHADOW_MODE=1` routes scoring through shadow weights; `opencode.json:59`, `.claude/mcp.json:49`, `.codex/config.toml:118` all set it. Greps over `mcp_server` (ts/js/mjs/cjs, excluding tests), `hooks/`, `scripts/`, and `plugin_bridges/` find zero readers — only docs, configs, and `tests/rename-invariants.vitest.ts:66` (which asserts the dead var stays in config).
**Risk:** operators believe a tuning mode exists; the rename-invariants test actively entrenches the dead flag. **Fix class:** doc-only (rewrite docs around the always-on `_shadow` sidecar and drop the var from configs + invariant test), unless the team decides to implement the branch.

### tri-040 — Read-only skill_graph_status can mutate corrupt DB state — STILL-REAL (narrowed)
`handlers/skill-graph/status.ts:59` calls `skillGraphDb.getDb()` → `skill-graph-db.ts:400` → `initDb` (`:353`) → `checkSqliteIntegrity` (`:359`) → `recoverMalformedDatabase` (`:361`, body `:289-301`), which renames the live DB to a timestamped `*.corrupt` backup (`:294-296`) or `rmSync`-deletes it if the rename fails (`:298`), then recreates a fresh DB. **Narrowing since banked:** `isGenuineCorruptionReason` (`:278-287`) now excludes transient lock/IO/permission causes, and the rename preserves bytes under a timestamped name — but a pure status call still moves (or in the rename-failure path destroys) the artifact before any operator snapshot, so the diagnosis/repair boundary violation stands.
**Risk:** forensics on a corrupt DB are disturbed by the first status query; rename-failure path loses the evidence entirely. **Fix class:** code-careful (read-only probe for status; recovery gated behind a trusted command). **Interlock:** tri-041, tri-092.

### tri-041 — advisor_rebuild can skip corrupt SQLite when generation says live — STILL-REAL
`handlers/advisor-status.ts:207` reads the generation file and `:209` checks only `existsSync(dbPath)`; `checkSqliteIntegrity` is imported nowhere in advisor-status (repo grep: only `skill-graph-db.ts` and `lib/freshness/rebuild-from-source.ts` use it). `handlers/advisor-rebuild.ts:48-51` (`shouldSkipRebuild`: freshness live && !force) and `:71` skip the rebuild, with the diagnostic at `:82` telling the operator to pass `force:true`.
**Risk:** the documented non-force repair path is a no-op exactly when the DB is corrupt but the generation record is live. **Fix class:** code-careful (bounded integrity result in status/trustState; rebuild must not skip on corrupt DB). **Interlock:** tri-040, tri-092.

### tri-042 — Routing corpus scorer resolves repo root one directory too high — STILL-REAL
`mcp_server/scripts/routing-accuracy/score-routing-corpus.py:23` still sets `REPO_ROOT = SCRIPT_DIR.parents[6]`; the comment at `:22` is off-by-one (it counts `SCRIPT_DIR` itself as `parents[0]`, but pathlib `parents[0]` is the immediate parent, `scripts`). Verified by path computation (`parents[5]` = `…/Public`, `parents[6]` = `…/Code_Environment`) and by live repro: running the script fails with `FileNotFoundError: …/Code_Environment/.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py`.
**Risk:** the 193-row labeled routing corpus is unusable from this workspace, blocking empirical FP/FN measurement. **Fix class:** code-small (`parents[5]` or sentinel-walk; fix the comment too). **Interlock:** tri-085 (same defect).

### tri-070 — Install guide gives an invalid advisor_validate example — STILL-REAL
`INSTALL_GUIDE.md:88` still shows `mk_skill_advisor.advisor_validate({"skillSlug":null})`; `mcp_server/schemas/advisor-tool-schemas.ts:279` requires `confirmHeavyRun: z.literal(true)` (schema bound at `:419`); `references/runtime/tool_ids_reference.md:50` documents the requirement.
**Risk:** the install verification step fails schema validation for anyone following the guide. **Fix class:** doc-only.

### tri-083 — Parity coverage stops at gold preservation — STILL-REAL
`mcp_server/tests/skill-advisor-cli-parity.vitest.ts:34-45` still gates on ten self-naming prompts ("Use sk-code to…", "Use mcp-code-mode for…"). `tests/parity/` contains only `python-ts-parity.vitest.ts`, whose gates (describe at `:101`, tests at `:103`/`:180`) cover gold-preservation and a lexical-ablation check — not local-vs-native divergence on harder prompts. `tests/scorer/lane-weight-sweep.vitest.ts:645-667` uses `HARDER_INTENT_PROMPT_CORPUS` only to write sweep reports, not as a blocking gate. The live drift this would catch is demonstrated by the tri-033/tri-034 repros in this batch.
**Risk:** large local/native drift (including explicit-name misroutes) stays invisible to CI. **Fix class:** code-careful (new non-writing differential harness; needs an approved-divergence ledger to avoid flake). **Interlock:** land after tri-033/tri-034 fixes.

### tri-085 — Routing corpus scorer cannot run from this repo root — STILL-REAL (duplicate of tri-042)
Identical root cause and evidence: `score-routing-corpus.py:23` `parents[6]`, repro'd `FileNotFoundError` above. One fix closes both IDs. **Fix class:** code-small.

### tri-086 — Init helper rebuilds ignored JSON, not runtime SQLite — STILL-REAL (narrowed)
`mcp_server/scripts/init-skill-graph.sh:55-62` still runs validate-only → `--export-json` → `--health`; no step invokes `advisor_rebuild`/`skill_graph_scan` or otherwise populates `skill-graph.sqlite`. `skill_advisor.py:947` confirms the runtime ignores the JSON export ("Skill graph: SQLite unavailable; JSON export ignored for runtime"). **Narrowing:** the script now detects a missing SQLite file and prints "SQLite will be created automatically when the MCP server starts" (`:44-47`) — honest messaging, but server startup creates an empty schema; nothing in this flow indexes skills, so the recovery gap stands.
**Risk:** an operator "completes" graph initialization while advisor routing still has no populated skill graph. **Fix class:** code-small (invoke the trusted rebuild path, or relabel the script validation-only).

### tri-088 — Claude hook timeout knob doesn't bound the native subprocess — STILL-REAL
`hooks/claude/user-prompt-submit.ts:185-188` calls `buildBrief(prompt, { runtime: 'claude', workspaceRoot })` with no `subprocessTimeoutMs`; `claudeHookTimeoutMs()` (defined `:106`, default `:70`) is used only for the CLI fallback budget at `:195`. The brief builder forwards `options.subprocessTimeoutMs` → `timeoutMs` (`mcp_server/lib/skill-advisor-brief.ts:70`, `:494`), and `mcp_server/lib/subprocess.ts:231` defaults via `defaultTimeoutMs()` (`:77-78`) = `SPECKIT_CODEX_HOOK_TIMEOUT_MS` or 3000 ms. The Codex adapters pass it correctly (`hooks/codex/user-prompt-submit.ts:220`, `hooks/codex/prompt-wrapper.ts:173`, `:332`).
**Risk:** `SPECKIT_CLAUDE_HOOK_TIMEOUT_MS` tuning silently doesn't apply to the primary native call — Claude latency is governed by a Codex-named env var. **Fix class:** code-small (one option in the call, mirroring Codex).

### tri-089 — OpenCode plugin bridge drops ambiguous recommendations — STILL-REAL
`mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs:292-319` is a self-contained `renderAdvisorBrief` that examines only `recommendations[0]` (`:310`) and always emits `use <topLabel>` (`:315`); no ambiguous branch, no second-recommendation check. The shared renderer's ambiguous branch lives at `mcp_server/lib/render.ts:149-157`.
**Risk:** OpenCode users never see the ambiguity disclosure the skill contract promises, even on exact ties. **Fix class:** code-small (port the top-two branch + token cap, or consume the shared compiled renderer). **Interlock:** tri-037 — use the same dual-margin predicate, not the confidence-only one, or the bridge inherits that bug.

### tri-090 — Plugin README understates bridge timeout default by 10x — STILL-REAL
`.opencode/plugins/mk-skill-advisor.js:33` sets `DEFAULT_BRIDGE_TIMEOUT_MS = 10000` (applied at `:145`); `.opencode/plugins/README.md:84` documents `bridgeTimeoutMs` default as `1000`.
**Risk:** operators budgeting prompt-submit latency from the README are off by 9 seconds in the worst case. **Fix class:** doc-only (or a deliberate code-side lowering — needs a latency decision, default to fixing the README).

### tri-092 — Mutation-boundary docs falsely say only advisor_rebuild mutates SQLite — STILL-REAL
`README.md:108` and `references/runtime/freshness_contract.md:134` both still state "Only `advisor_rebuild` mutates the SQLite database." `handlers/skill-graph/scan.ts:49-58` indexes skill metadata (`indexSkillMetadata`), refreshes embeddings (`refreshSkillEmbeddings`), and publishes a new live generation — a full mutation path (correctly trusted-gated). tri-040 shows a third mutation vector: corrupt-DB recovery inside `getDb`.
**Risk:** trust/runbook docs misstate the write surface, so operators reason wrongly about what can change the DB. **Fix class:** doc-only. **Interlock:** word the correction to match whatever boundary tri-040/tri-041 fixes settle on.
