# Implementation Playbook — deep-improvement rename + Lane C (skill-benchmark)

Build-ready implementation guidance synthesized from a GPT-5.5 xhigh-fast research sweep (5 iterations) and adversarially **verified by two Opus 4.8 agents** against the actual repo. The DESIGN is already converged in `../../001-skill-benchmark-deep-research/research/research.md`; this document is the HOW-TO-BUILD for Phase 003 (rename) and Phase 004 (Lane C), with every load-bearing claim cross-checked.

> Executor doctrine (operator-set): GPT-5.5 generated; Opus verified + synthesized. The §7 Cross-checks section records each verification verdict — CONFIRMED / CORRECTED / REFUTED with `file:line` evidence. **Where GPT-5.5 and Opus disagree, Opus's verified version is authoritative.**

---

## 1. Executive summary — recommended build order

1. **Phase 003 (rename) MUST land before Phase 004 (Lane C).** Lane C resolves the skill root dynamically; building against `deep-agent-improvement/` then renaming re-bakes a dead skill id into every trace root and report provenance. [001 research.md:20,152]
2. **Rename scope is NARROW but the surface is WIDE.** "Narrow" = rename the skill id + agent id + advisor routing + active cross-refs; KEEP command verbs, `agent-improvement`/`model-benchmark` lane tokens, and `agent-improvement-state.jsonl`. But the *file* surface is ~134 in-skill self-ref files + ~14 advisor code/data/test surfaces + 4 agent mirrors + `.codex/config.toml` + ~11 command files across **two** runtimes (`.opencode` AND `.claude`) + a mandatory `tsc` dist rebuild + a SQLite graph recompile. (§4)
3. **Lane C = a third lane on the existing host, not a Lane B fork.** Add `skill-benchmark` to `VALID_MODES`, add a `LANE_SKILL_BENCHMARK` script set, add one `planInvocation` arm — leaving Lane A/B byte-identical (the TST-1 contract). (§3.2)
4. **Reuse three Lane B seams; write three things fresh.** Reusable: the executor dispatcher (`dispatch-model.cjs`, from its current path), the grader/cache machinery (`noop|mock|llm`), and the advisor TS scorer (`scoreAdvisorPrompt`). Fresh: the **report.md renderer** (none exists), the **per-executor trace canonicalizer**, and the **smart-router replay** (currently pseudocode). (§3)
5. **D1 inter-skill scoring calls the advisor in-process** via `scoreAdvisorPrompt` (fusion.ts:334) — no MCP daemon — but pass a pre-built `projection` for CI determinism and accept that the `semantic_shadow` lane is dark without an embedder. (§3.5)
6. **Trace capture is per-executor and lossy.** The codex `.out` is a plain-text `exec`/`zsh -lc` transcript, not a JSON tool-event stream; parse shell verbs (`sed`,`nl`,`cat`,`rg`,`grep`,`ls`,`find`) out of `exec` blocks. No executor reports a token count in the log — D3 must estimate or mark `tokenObserved=false`. (§3.4)
7. **Dogfood order:** `deep-improvement` (validates rename + lane on itself) → `system-skill-advisor` (stresses D1) → `deep-loop-runtime` (library-style contrast). Calibrate verdict bands on these 2–3 pilots before treating scores as absolute. [gpt55/i1-F8]

**Headline risks:** advisor TS↔Python↔dist↔SQLite split-brain (4 copies of routing state); the phantom "Lane B renderer"; trace fidelity entirely dependent on each CLI's native verbosity.

---

## 2. Per-IQ synthesis

### IQ1 — module architecture & seam reuse
**Consensus (CONFIRMED):** Lane C adds exactly one `skill-benchmark/` subdir under `assets/`/`references/`/`scripts/` + `shared/` for cross-lane code. Candidate-source (fixtures, skill-root resolution, contamination lint) is Lane-C-specific → `scripts/skill-benchmark/`. Keep `scripts/shared/` narrow: mode host + executor dispatch core + grader/cache core + report helpers. [gpt55/i1-F1,F2,F7]

**Opus correction:** GPT-5.5 proposed extracting `dispatch-model.cjs` → `scripts/shared/executor-dispatch.cjs`. Verified: that is NOT a free `git mv` — it has 4 hardcoded touchpoints (loop-host resolver table, the workflow YAML literal path, SKILL/command docs, and `repoRoot()` depth fallback). **Reuse `dispatch-model.cjs` from its current `scripts/model-benchmark/` location** (it is genuinely executor-agnostic — 5 executors, cwd-forward, backoff, all confirmed); only extract to `shared/` if you ship the 4-touchpoint refactor atomically. (§7 C1)

### IQ2 — loop-host wiring + non-regression
**Verified (CONFIRMED):** `planInvocation(mode,args)` (loop-host.cjs:130-169) is a pure exported planner branching on mode; `VALID_MODES` (line 31) is additive; unknown modes fail safe to Lane A (resolveMode:115-120). An additive `if (mode==='skill-benchmark')` arm cannot alter the existing arms' bytes → TST-1 holds. **Frozen edit surface:** add to `VALID_MODES`, add `LANE_SKILL_BENCHMARK` set + a `resolveScriptPath` branch, add one planInvocation arm. Do NOT touch `parseArgs`/`resolveMode`/`resolveScriptPath` non-additively or the identity test trips. [gpt55/i1-F1, i5; §7 C2]

**Opus correction:** Lane B's arm is **2 steps** (`materialize` → `run-benchmark`, which scores+reports in-process), not the 4-step `[materialize,dispatch,score,report]` GPT-5.5 implied. Lane C splitting dispatch/score/report into discrete steps is a *new design choice* (justified by trace-capture needing an explicit dispatch seam), not a mirror of Lane B.

### IQ3 — trace-capture implementation
**Verified reality (CORRECTED — the biggest build correction):** `dispatch-model.cjs` captures only stdout/stderr strings (lines 263-277); there is no structured tool-event stream. The codex `.out` is the codex CLI's **plain-text transcript**: a header (`workdir`,`model`,`sandbox`,`session id`) then repeated `exec\n/bin/zsh -lc "<cmd>"\n succeeded in Nms:\n<stdout>` blocks. File reads appear as **shell tokens inside the bash string** (`sed -n`, `nl -ba`, `rg -n`, `cat`), not as JSON `Read`/`Grep`/`Glob` events. [§7 OQ-B]

Build implication: the canonicalizer is genuinely **per-executor (≈5 parsers)** as GPT-5.5 said, but the codex tier is **text-scraping shell commands out of `exec` blocks**, not JSON-event reading. Ship router-replay (Mode A) as the deterministic CI gate; mark live-dispatch (Mode B) D2/D3 as `traceQuality: partial|stdout-only|none` and downgrade findings to `verify-in-rerun` when fidelity is low. [gpt55/i1-F6, i4-F8]

### IQ4 — router-replay (Mode A) + live (Mode B)
**Verified (CORRECTED):** D1 inter-skill via the advisor IS buildable in-process today (`scoreAdvisorPrompt`, fusion.ts:334 — see IQ-below). **But** the intra-skill smart-router (`route_*_resources`) is **pseudocode** in `shared_smart_router.md:74` (templated `<PROVIDER>` placeholder, undefined `load()` sink, per-skill dicts live as prose in SKILL.md) — it needs a small **port** (extract `INTENT_SIGNALS`/`RESOURCE_MAP` from the target SKILL.md fenced block + supply a load sink) before headless replay. Preserve exact semantics: lowercased substring match, ambiguity-delta 1.0, max-2 intents, default-first load, set-membership. [gpt55/i3-F1,F2; §7 C5]

Capture `advisor_recommend` **out-of-band** with `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` on the subject run so the answer can't leak. A↔B divergence is a first-class finding (router-reaches/live-misses = signposting gap). [gpt55/i3-F3,F6; i4-divergence-taxonomy]

### IQ5 — contamination linter + 3-tier fixtures
**Verified (CONFIRMED):** importable substring matchers exist and ARE the routers' own logic — `scoreExplicitLane`/`lower.includes(phrase)` (explicit.ts:244), `scoreLexicalLane`/`haystack.includes(token)` (lexical.ts:75), `matchesPhraseBoundary`+`tokenize` (text.ts:63,29). The linter imports these so "hint-free" is decided by the identical mechanism that would be gamed. Banned vocab = skill id/aliases + frontmatter triggers + `INTENT_SIGNALS` keywords + intent keys + resource paths/basenames + command names + private gold labels. Any hard leak blocks dispatch. [gpt55/i3-F4,F7; §7 C6]

3-tier model (T1 auto+paraphrased / T2 hand-authored holdout / T3 adversarial) + public/private split is sound; the advisor regression JSONL (`skill_advisor_regression_cases.jsonl`, 51 rows: `id`,`priority`,`prompt`,`expected_top_any`,`expect_result`) is a viable schema template, though it is currently a single public corpus (the public/private split is a Lane-C extension). Publish the **T1↔T2 score gap as the circularity meter** (mirrors advisor corpus 80.5% ↔ holdout 77.5%). [gpt55/i3-F8,F9; §7 C7]

### IQ6 — scorer + report-builder
**Verified (CORRECTED):** reuse Lane B's `report.json` field spine (status/scoringMethod/aggregateScore/rows/provenance) and the grader/cache machinery, but the dimension set is Lane-C's D1–D5, not Lane B's. **CRITICAL: there is NO `report.json`→`report.md` renderer in the skill** — GPT-5.5/iter-4 attributed a dual-report renderer to "Lane B" that does not exist in code (Lane B writes only JSON + a JSON snapshot; the only `.md` is the Lane-A `reduce-state.cjs` dashboard). Lane C's `build-report.cjs` (report.json → report.md, anti-drift) is **net-new code**, not a reuse. [§7 C3c]

Scoring (from the converged design, GPT-5.5's formulas usable as a starting point): D1 = inter12 (advisor rank×threshold×ambiguity) + intra13 (router-replay intent/resource recall); D2 = ranked retrieval (Hit@1/Hit@3/Recall@5/MRR over canonicalized loads); D3 = cost-to-first-expected (calls/wasted-loads; token subscore only when `tokenObserved`); D4 = skill-on/off ablation via the grader; D5 = static connectivity **hard gate** run before dispatch. Headline bottleneck = largest single-stage funnel drop-off. Remediation taxonomy maps finding-class → (file, locus, one-line fix, handoffLane). [gpt55/i4-F1..F10]

### IQ7 — rename runbook + 4 decision-record resolutions
**Resolved (all 4 DR items):**
1. **Agent identity:** rename `@deep-agent-improvement` → `@deep-improvement` in the same changeset as the skill (all 4 mirrors + `.codex/config.toml`), preserving "proposal-only Lane A" behavior text. [gpt55/i5-DR1]
2. **`deep-model-benchmark` alias:** KEEP as the Lane B alias/command-route label; remap its *penalty targets* and owning-skill refs from `deep-agent-improvement` → `deep-improvement`. Add Python parity if `advisor_validate` treats Lane B prompts as advisor-owned. [gpt55/i5-DR2]
3. **Command verbs:** KEEP (`/deep:start-agent-improvement-loop`, `/deep:start-model-benchmark-loop`). Only `skill:` fields + hardcoded paths + advisor/mirror ids change. [gpt55/i5-DR3]
4. **Narrow vs wide:** NARROW (operator-chosen). Record that `agent-improvement/` dirs, command names, `agent-improvement-state.jsonl` stay because they name the lane, not the package. [gpt55/i5-DR4]

The ordered runbook is §4. **Opus widened GPT-5.5's census materially — see §4 and §7 C8.**

### IQ8 — pilots, calibration, tests, prior art
Dogfood `deep-improvement` → `system-skill-advisor` → `deep-loop-runtime`; start from converged weights (D1=25, D2=20, D4=25, D3=15, D5=15, D5 hard-gate), tune verdict bands first, leave weights until ≥2 pilots disagree with manual actionability labels. Vitest patterns mirror existing `optin-scorer`/`reduce-state-mode-mix`/`promote-candidate-benchmark` tests. CI = router-replay + mocked advisor/grader (deterministic); live dispatch is nightly/non-blocking. Prior art that transfers: IR metrics (Hit@k/MRR) for D2, SARIF result→fix→location for remediation, OpenTelemetry span/event vocab for trace shape (without an OTel dependency). [gpt55/i1-F8,F9, i4-F4]

---

## 3. Recommended implementation

### 3.1 Module map (post-rename paths under `.opencode/skills/deep-improvement/`)
**New, Lane-C-specific:**
- `scripts/skill-benchmark/run-skill-benchmark.cjs` — orchestrator (loop-host entrypoint)
- `scripts/skill-benchmark/load-scenarios.cjs` — public/private fixture loader + id-safety
- `scripts/skill-benchmark/contamination-lint.cjs` — hard pre-dispatch gate (imports advisor matchers)
- `scripts/skill-benchmark/router-replay.cjs` — **ported** smart-router (extract dicts from SKILL.md)
- `scripts/skill-benchmark/advisor-probe.cjs` — out-of-band `scoreAdvisorPrompt` wrapper (D1 inter)
- `scripts/skill-benchmark/parse-resource-loads.cjs` — per-executor trace canonicalizer
- `scripts/skill-benchmark/score-skill-benchmark.cjs` — D1–D5 + funnel
- `scripts/skill-benchmark/d5-connectivity.cjs` — static hard-gate scan
- `scripts/skill-benchmark/build-report.cjs` — **net-new** report.json → report.md renderer
- `assets/skill-benchmark/{scenario_schema.json, fixture-public.schema.json, fixture-private.schema.json, default_profile.json, report_schema.json, report_template.md, remediation_taxonomy.json, fixtures/<skill-id>/{public,private}/*.json}`
- `references/skill-benchmark/{operator_guide.md, scoring_contract.md, scenario_authoring.md}`

**Reused as-is (from current locations — do NOT fork):**
- `scripts/model-benchmark/dispatch-model.cjs` — executor dispatch (call programmatically)
- `scripts/model-benchmark/scorer/grader/harness.cjs` — `gradeD4` (claude-only, single-dimension — see §3.6)
- `scripts/model-benchmark/scorer/lib/cache.cjs` — grader cache (MUST pass run-scoped `cache_dir` — §3.7)
- `system-skill-advisor/mcp_server/lib/scorer/fusion.ts` `scoreAdvisorPrompt` — D1 inter (§3.5)

### 3.2 loop-host wiring (the only safe edit)
```js
const VALID_MODES = new Set(['agent-improvement', 'model-benchmark', 'skill-benchmark']);
const LANE_SKILL_BENCHMARK = new Set(['run-skill-benchmark.cjs']);
// resolveScriptPath(): add a branch mapping LANE_SKILL_BENCHMARK names → scripts/skill-benchmark/
// planInvocation(): add BEFORE the agent-improvement fall-through:
if (mode === 'skill-benchmark') {
  if (!args.skill || !args.profile || !args['outputs-dir'])
    return { ok: false, error: 'skill-benchmark: missing --skill, --profile, --outputs-dir' };
  return { ok: true, steps: [{ script: 'run-skill-benchmark.cjs', args: [...] }] };
}
```
Lane C does its dispatch/score/report internally (like Lane B's run-benchmark), so one step is enough. Assert byte-identical Lane A/B plans in `loop-host.vitest.ts`.

### 3.3 run-skill-benchmark sequence (post-run join — private data never crosses dispatch)
resolve skill root + `metadataHash` → load fixtures (fail on schema/contamination) → **D5 static gate first** → advisor probe out-of-band (D1 inter) → router replay (D1 intra + deterministic D2 proxy) → optional `k` live dispatches (hooks stripped) → parse `resource-loads.jsonl` → join with private expectations → score D1–D5 + funnel → emit `report.json` then render `report.md`.

### 3.4 Trace capture (per-executor; codex is text-scraping)
Parse the executor `.out` per its native shape. For codex: scrape file-touch shell verbs (`sed|nl|cat|head|tail|rg|grep|ls|find`, writes via `apply_patch`) out of `/bin/zsh -lc "<cmd>"` lines inside `exec` blocks. Emit `resource-loads.jsonl` (one event/line: `normalizedResourceId`, `channel`, `path`, `loadOrdinal`, `confidence`) + `run-quality.json` (`traceQuality`, contamination status, k-run variance). **No native token count exists** — set `tokenObserved=false` and exclude the token subscore, or estimate from transcript size. [§7 OQ-B, OQ-C]

### 3.5 D1 inter-skill via the advisor (in-process, no MCP boot)
Import `scoreAdvisorPrompt(prompt, options)` from `system-skill-advisor/mcp_server/lib/scorer/fusion.ts:334` (synchronous, pure). For CI determinism pass a pre-built `options.projection` (build via `createFixtureProjection(skills, edges)`, projection.ts:342) so it never reads `skill-graph.sqlite`. Accept that `semantic_shadow` (1 of 5 lanes) is dark without an embedder — the other 4 (lexical/explicit/derived/graph-causal) are pure. For the full 5-lane score you must `await withSemanticShadowPromptEmbedding(...)` *around* the sync call (two-step; easy to get wrong). Do NOT use the Python `skill_advisor.py` for D1 — it shells out to the Node bridge; the TS function is the daemon-free entrypoint. [§7 C4, OQ-D]

### 3.6 D4 grader reuse (claude-only, single-dimension)
`harness.cjs gradeD4()` is real (`noop|mock|llm`, `[0,1]` clamp, sentinel-wrapped untrusted output, run-scoped cache) **but hardwired to claude** (`GRADER_MODEL='claude-sonnet-4-5'`, operator constraint) and to a single hallucination-style dimension. Reuse directly only if Lane C's D4 is a claude-graded single judge; a different model or multi-dimension judge needs generalization first. [§7 C3b]

### 3.7 Cache namespacing (mandatory)
The grader cache defaults to in-repo `scorer/cache/grader/` shared across runs. Keys won't literally collide (sha256 of distinct inputs) but Lane C inheriting the default dir creates a shared unbounded cache + the "trusted-on-cache-hit" hazard. **Lane C MUST pass a run-scoped `cache_dir`** (`opts.cache_dir` or `DEEP_AGENT_GRADER_CACHE_DIR`, e.g. `{outputs}/skill-benchmark-cache`). [§7 OQ-A]

---

## 4. Rename runbook (NARROW scope, WIDE surface — Opus-verified census)

**Order is load-bearing: source edits → mirrors → advisor (atomic) → cross-refs → `tsc` rebuild → SQLite recompile → validate. Indexes/compiled artifacts LAST.**

0. **Freeze inventory** — 4-column table (`file | class | action | verification`); denylist `*/specs/**/iterations/*`, `*/review/**`, `*/research/**`, `*/z_archive/**`, `*.raw.txt`. ~134 in-skill self-ref files are in scope (SKILL 1, README 1, assets 6, changelog 13, feature_catalog 18, references 13, manual_testing_playbook 44, scripts 36, graph-metadata 1, fixtures 1).
1. *(Optional bridge)* add `deep-agent-improvement` → `deep-improvement` as a legacy alias in `aliases.ts` + `skill_advisor.py` so old ids resolve during cutover; tear down after census is clean.
2. **`git mv .opencode/skills/deep-agent-improvement .opencode/skills/deep-improvement`**; update `SKILL.md` `name:`/description/triggers/keywords + sweep active self-refs. Keep `assets|references|scripts/agent-improvement/` + `agent-improvement-state.jsonl`.
3. **Agent mirrors (4) + codex registry, one changeset:** `.opencode/agents/`, `.claude/agents/`, `.gemini/agents/` (`.md` `name:` line 2) + `.codex/agents/deep-agent-improvement.toml` (`name=` line 3) + `.codex/config.toml:21-23` (`[agents.deep-agent-improvement]` + `config_file` pointer).
4. **Commands across BOTH runtimes:** `.opencode/commands/deep/{start-agent-improvement-loop.md, start-model-benchmark-loop.md}` + 4 asset YAMLs, AND the `.claude/commands/deep/` mirror of all five. Update `skill:` + hardcoded `skills/deep-agent-improvement/...` paths; keep command/YAML filenames.
5. **Advisor — atomic (the split-brain set):** TS `lib/scorer/aliases.ts:27-31`, `lanes/explicit.ts:99,116-138` (incl. the Lane-B negative penalties that go inert if the canonical id isn't flipped), `fusion.ts:326`; Python `skill_advisor.py` alias `:250-254` + phrase map `:1577-1610,1723` + command-bridge key `:1789`; test fixtures `native-scorer.vitest.ts:316,344` + `skill_advisor_regression_cases.jsonl:42-45`; advisor self-meta `graph-metadata.json:70` (`enhances` edge).
6. **Cross-refs + root docs:** `deep-loop-runtime/references/integration_points.md:168` (+ the `doctor_deep-loop.yaml`/`doctor_update.yaml` + `scripts/lib/README.md:26` it points at), root `CLAUDE.md:349` + `AGENTS.md:349`, `.opencode/skills/README.md`, install guides, `cli-opencode` family docs, agent `README.txt` files. **REFUTE** `sk-prompt-small-model` (no refs) and `data/skill-metadata.json` (does not exist).
7. **Rebuild compiled artifacts (the true "last step"):** `tsc` to regenerate `mcp_server/dist/**` (the Node bridge runs dist, so stale dist = stale runtime), then recompile `database/skill-graph.sqlite` from the edited per-skill `graph-metadata.json` (the JSON `scripts/skill-graph.json` is **dead at runtime** — both TS and Python read SQLite). Then `generate-description.js` + graph-metadata backfill.
8. **Validation gate (MCP down → use Python script fallback):** `python3 system-skill-advisor/mcp_server/scripts/skill_advisor.py "<improvement request>"` returns `deep-improvement`; advisor regression suite green (corpus ≥80.5%, holdout ≥77.5%); Lane A default plan + Lane B `--mode=model-benchmark` still run; active-path census = zero unintended `deep-agent-improvement`; `validate.sh <packet> --strict`.

**Three distinct names — triage separately, do NOT collapse:** the `/deep:start-agent-improvement-loop` *command* (KEEP), the `@deep-agent-improvement` *agent* (→ `@deep-improvement`), the `deep-agent-improvement` *skill* (→ `deep-improvement`).

---

## 5. Cross-model observations
Single-generator sweep (GPT-5.5 xhigh-fast, 5 iters) by doctrine, so this is not a multi-model comparison — it is a **generate-then-verify** pipeline. GPT-5.5 produced consistently well-grounded, repo-cited findings (10–11 structured findings/iter, every claim carrying `file:line`). Quality note: iter-2's artifact was salvaged and oversized (2.3MB — it echoed large file dumps into stdout; its structured delta is absent), but its substance (IQ2 loop-host wiring + IQ3 trace capture) was independently and fully covered by the Opus verification (C2, OQ-B), so no signal was lost. The Opus pass changed 4 verdicts from the GPT-5.5 baseline (1 REFUTED, 3 CORRECTED) — see §7.

---

## 6. Actionable next steps

**Phase 003 (rename) checklist:**
- [ ] Build the freeze inventory (denylist applied); confirm ~134+advisor+mirror+command surface.
- [ ] Execute steps 2–6 of §4 in order; advisor (step 5) as ONE atomic commit.
- [ ] `tsc` dist rebuild + SQLite recompile (step 7).
- [ ] Validation gate (step 8) via Python fallback; `validate.sh --strict`.
- [ ] **CHECKPOINT with operator before step 5** (mutates shared advisor files outside packet 122).

**Phase 004 (Lane C) checklist:**
- [ ] Port the smart-router (`router-replay.cjs`) from SKILL.md dicts.
- [ ] Write `build-report.cjs` fresh (no Lane B renderer to reuse).
- [ ] Build the per-executor trace canonicalizer (codex = shell-verb scraper).
- [ ] Wire loop-host (additive only); assert TST-1 identity.
- [ ] D1 via `scoreAdvisorPrompt` + fixture projection; namespace the grader cache.
- [ ] Run on `deep-improvement` pilot; calibrate verdict bands.

---

## 7. Cross-checks (Opus 4.8 adversarial verification verdicts)

| Claim | Verdict | One-line resolution |
| ----- | ------- | ------------------- |
| **C1** dispatch-model is a free move to `shared/` | **CORRECTED** | Executor-agnostic ✓, but move breaks 4 touchpoints; reuse from current path |
| **C2** loop-host additive wiring keeps Lane A/B byte-identical | **CONFIRMED** | `planInvocation` is a pure exported branch; Lane B is 2-step not 4 |
| **C3a** Lane B scorer (det + pluggable grader + cache) reusable | **CONFIRMED** | `score()` takes primitive criteria + absolute cwd |
| **C3b** grader harness reusable for D4 | **CORRECTED** | Real, but claude-only + single-dimension; generalize for other graders |
| **C3c** Lane B renders report.md from report.json | **REFUTED** | **No such renderer exists** — Lane C writes it fresh |
| **C4** advisor 5-lane scorer callable in-process for D1 | **CORRECTED** | `scoreAdvisorPrompt` ✓ no MCP boot, but needs projection (SQLite/injected); semantic_shadow needs embedder |
| **C5** Mode A router-replay viable | **CORRECTED** | Advisor (D1) ✓ importable; smart-router (D2) is pseudocode → needs a port |
| **C6** contamination linter reuses routers' own matchers | **CONFIRMED** | `tokenize`/`matchesPhraseBoundary`/`*.includes` are importable TS |
| **C7** advisor regression JSONL is a viable fixture schema | **CONFIRMED** | 51 rows, `expected_top_any` gold, `expect_result:false` negatives |
| **C8** rename surface census | **CONFIRMED + WIDENED** | +`.claude/commands` mirror, `.codex/config.toml`, dist rebuild, SQLite recompile; −`sk-prompt-small-model`, −`data/skill-metadata.json` (both refuted) |

**Open-question resolutions:** OQ-A cache collision → pass run-scoped `cache_dir` (mechanism exists). OQ-B trace shape → codex `.out` is plain-text `exec` transcript; parse shell verbs per-executor. OQ-C tokens → none in log; estimate or `tokenObserved=false`. OQ-D advisor in-process → YES via TS `scoreAdvisorPrompt`, not Python. OQ-E Python graph timing → RUNTIME from SQLite; JSON export dead → SQLite recompile is the mandatory last step. OQ-F deep-loop-runtime ref → YES, `integration_points.md:168`.

**Additional Opus-surfaced rename risks (not in GPT-5.5's set):** R1 compiled `dist/` is a second code copy (must `tsc` rebuild — Node bridge runs dist). R2 two graph artifacts; only `skill-graph.sqlite` is runtime-authoritative (JSON is a decoy). R3 Lane B `deep-model-benchmark` penalties go inert if the canonical id isn't flipped (documented prior bug). R4 `.claude/commands/deep/` + `.codex/config.toml` are easy-miss lockstep surfaces. R5 test fixtures rot without legacy aliases. R6 the 3 distinct names (command/agent/skill) must be triaged separately.

*Verifier provenance: Opus agents `a041d7d12064b7bc0` (build architecture) + `ae7d15c45639e1d48` (router/fixtures/rename).*
