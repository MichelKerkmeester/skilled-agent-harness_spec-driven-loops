# Iteration 010 — Adversarial Verification + Gap-Fill + Synthesis Feed (Opus 4.8)

## Focus

FINAL iteration. Ingest all 9 MiniMax breadth-pass iterations + structured deltas, deduplicate, and ADVERSARIALLY VERIFY every P0/P1 (and material P2) by opening the cited file at the cited line. Classify CONFIRMED / FALSE-POSITIVE / REVISED. Then gap-fill, prioritizing the two operator-flagged dimensions (sk-doc template alignment; three-lane consistency), plus loop-host non-regression, advisor split-brain, and the security surface.

Ground-truth checks performed this pass:
- Re-ran the suite from `.opencode/skills/deep-improvement/scripts/`: **208 passed (20 files), exit 0** (1.18s). Confirms the verified count and that "no test files found" is a wrong-cwd artifact.
- Confirmed the actual Lane C filenames: `router-replay.cjs`, `score-skill-benchmark.cjs`, `run-skill-benchmark.cjs`, `build-report.cjs`, `_args.cjs`, `advisor-probe.cjs`, `contamination-lint.cjs`, `d5-connectivity.cjs`. **Iteration 1's entire premise (`scorer.cjs` at line 1000, `parseIntentSignals` at line 59 using a flat `[^}]*` regex) targets files/lines that DO NOT EXIST** — the real parser is a brace-depth scanner.
- Confirmed both packet commits are in HEAD history: `caf072e39e` (rename) and `40d1ca5543` (Lane C build). This invalidates the iter-8 "uncommitted rename" P1s as *code* findings (they survive only as a stale-doc note).

---

## Confirmed findings

### P1 — Agent + 2 mirrors say "two co-equal lanes" (stale after Lane C)
- **file:** `.opencode/agents/deep-improvement.md:44` — verbatim "The deep-improvement skill has two co-equal lanes." Describes only Lane A + Lane B; omits Lane C. Git history shows the line was last touched in the 121 era and never updated by packet 122. source: iter6 (severity revised P0→P1)
- **file:** `.claude/agents/deep-improvement.md:29` — identical "two co-equal lanes" string. source: iter6
- **file:** `.gemini/agents/deep-improvement.md:29` — identical "two co-equal lanes" string. source: iter6
- **one-line fix:** Change "two co-equal lanes" → "three co-equal lanes" and append a one-sentence Lane C clause in the canonical `.opencode/agents/deep-improvement.md`, then mirror-sync `.claude` + `.gemini`.
- **Severity rationale (REVISED from P0):** the block is explicitly labelled "awareness only and does not change this agent's proposal-only behavior," and the agent never dispatches Lane B/C. It is a documentation accuracy defect, not a correctness/dispatch bug. Real, operator-flagged, must-fix — but P1, not P0.

### P1 — `.codex` mirror absent (mirror-set incomplete)
- **file:** `.codex/agents/deep-improvement.md` (and `.toml`) — **does not exist.** iter6 f-hs-i6-03 cited `.codex/agents/deep-improvement.toml:34` with "two co-equal lanes" + wrong skill name. That FILE does not exist at that path; the codex agent lives only as the `[agents.deep-improvement]` block in `.codex/config.toml` (confirmed clean in iter4). So the *specific* iter6 codex finding is a false locus, BUT the real gap is that the three-lane fix has no `.codex/agents/` mirror to land in — the mirror set is `.claude` + `.gemini` only. source: iter6 (revised) / NEW (real locus)
- **one-line fix:** When syncing the three-lane fix, confirm `.codex` parity is handled via `.codex/config.toml` (no per-agent md mirror exists); do not create a phantom `.codex/agents/deep-improvement.toml`.

### P1 — feature_catalog states "VALID_MODES is a closed two-value set" (NEW; breadth pass missed it)
- **file:** `.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:277`
- **issue:** Sentence reads "`VALID_MODES` is a closed two-value set, and an unknown mode warns to stderr and falls back to `agent-improvement`." Code at `loop-host.cjs:31` is `new Set(['agent-improvement', 'model-benchmark', 'skill-benchmark'])` — a **three-value** set. The same paragraph describes only the agent-improvement and model-benchmark routes and never mentions the skill-benchmark route, even though §6 later documents Lane C. Internal docs contradiction in the operator-flagged three-lane dimension. source: NEW
- **one-line fix:** Change "closed two-value set" → "closed three-value set" and add the `--mode=skill-benchmark` → `run-skill-benchmark.cjs` route to the sentence at line 277.

### P1 — Command scope note mislabels D1-inter as "not built"
- **file:** `.opencode/commands/deep/start-skill-benchmark-loop.md:43`
- **issue:** "D1-inter (advisor) and D4 (usefulness ablation) are live-mode follow-on … they report as `unscored-mode-a` until built." Per KNOWN CONTEXT (and verified: `advisor-probe.cjs` exists, `score-skill-benchmark.cjs:107-135` scores D1-inter when `advisorRows` present, opt-in via `--advisor-mode=python`), **D1-inter IS built and deterministic.** Grouping it with the genuinely-deferred D4 is wrong and contradicts the skill's own scoring_contract.md:9 ("D1-inter | 12 | scored (advisor)"). source: iter6
- **one-line fix:** Reword to: D1-inter is built (opt-in `--advisor-mode=python`, off in default/CI); only D4 (usefulness ablation) and Mode B live trace remain follow-on.

### P1 — `--advisor-mode` is undocumented in canonical operator docs
- **file:** `.opencode/skills/deep-improvement/references/skill-benchmark/operator_guide.md` (Invocation section) and `.opencode/commands/deep/start-skill-benchmark-loop.md`
- **issue:** `run-skill-benchmark.cjs:49,54,92` reads `--advisor-mode` and triggers the D1-inter probe when `=python`. Neither the operator guide's Invocation section nor the command file documents the flag. The one capability that lifts a Mode-A run from 4-dim to 5-dim is invisible to operators reading canonical docs. source: iter9 f-hs-i9-02 (severity revised P2→P1 because it is the *only* doc-path to the built D1-inter feature, compounding the previous finding)
- **one-line fix:** Add `[--advisor-mode=python]` to the documented invocation in operator_guide.md and the command file, with a one-line "scores D1-inter, deterministic SQLite advisor, off by default."

### P2 — Dead-forwarded loop-host options for Lane C
- **file:** `.opencode/skills/deep-improvement/scripts/shared/loop-host.cjs:63-73`
- **issue:** `SKILL_BENCHMARK_RUN_OPTIONS` forwards `profile`, `state-log`, `label`, `grader`, `k-runs`. `run-skill-benchmark.cjs`'s `run({...})` destructure (line 49) consumes only `skill`, `outputs-dir`, `fixtures-dir`, `output`, `trace-mode`, `advisor-mode`. The five extras are silently absorbed by the permissive `_args.cjs` parser and never used. Confirmed: no `profile`/`state-log`/`label`/`grader`/`k-runs` reads anywhere in Lane C scripts. source: iter9 f-hs-i9-01 / iter3 (matches; revised P1→P2 — purely cosmetic operator confusion, no wrong output, no crash)
- **one-line fix:** Trim `SKILL_BENCHMARK_RUN_OPTIONS` to the five genuinely-consumed flags (`fixtures-dir`, `output`, `state-log`?, `trace-mode`, `advisor-mode`) — i.e. drop `profile`, `label`, `grader`, `k-runs` (and `state-log` unless a sink is added).

### P2 — `default_profile.json` ships a `weights` block that nothing consumes
- **file:** `.opencode/skills/deep-improvement/assets/skill-benchmark/default_profile.json:4`
- **issue:** Asset defines `"weights": {...}` implying a `--profile` override path. `--profile` is unconsumed (above); `WEIGHTS` is hardcoded in `score-skill-benchmark.cjs:19`. The profile asset is scaffolding with no runtime wiring. The asset's own `notes` field is honest ("Mode A scores D1-intra, D2, D3, D5; D1-inter needs --advisor-mode=python; D4 needs live mode"), which softens this to documentation/scaffold debt. source: iter9 f-hs-i9-03 / iter5 (matches)
- **one-line fix:** Either wire `--profile` loading or annotate the `weights` field as a forward-looking reference profile not yet consumed by Mode A.

### P2 — sk-doc template alignment: Lane C reference/asset docs miss the skill's own convention (operator-flagged dimension)
- **files:** `references/skill-benchmark/{scoring_contract,operator_guide,scenario_authoring}.md` and `assets/skill-benchmark/{default_profile,remediation_taxonomy}.json`
- **issue:** All three reference `.md` files: (a) NO YAML frontmatter; (b) NO `## 1. OVERVIEW`; (c) H2 headings are sentence-case un-numbered ("Point weights (full / live mode)", "Invocation", "Three tiers (anti-circularity)") rather than the numbered-section convention. The sibling shipped Lane A/B reference docs (`references/agent-improvement/score_dimensions.md`, `references/model-benchmark/scoring_dimensions.md`) DO carry `title/type/status` frontmatter + `## 1. OVERVIEW` + `## 1.`-numbered headers. So Lane C is **inconsistent with the skill's own established pattern.** The two JSON assets are raw JSON (no md wrapper) and lack the `title/type/status` frontmatter the asset template shows. source: iter5 (severity REVISED P0→P2 — see rationale)
- **Severity rationale (REVISED, decisive — operator priority):** `sk-doc/assets/skill/template_rules.json` lists `overview` under **`recommendedSections`** and frontmatter keys under **`optional`** for both `reference` and `asset` types — NOT required. iter5 repeatedly cited "template_rules.json line 254/303 *mandates*"; those line numbers and the word "mandates" are fabricated (the file is 36 lines and uses `recommendedSections`). Pure-JSON assets are an established repo pattern (31 other `assets/*.json` files ship raw, e.g. `sk-prompt/assets/frameworks.json`, `deep-loop-runtime/assets/scoring_config.json`). So this is a **consistency / polish** gap, not a structural violation, and certainly not 13×P0. The real, defensible defect is intra-skill inconsistency in the operator-flagged dimension → P2.
- **one-line fix:** Add `title/type/status` frontmatter + a `## 1. OVERVIEW` + numbered ALL-CAPS H2s to the three Lane C reference docs to match the Lane A/B siblings; optionally add frontmatter-bearing `.md` companions for the two JSON assets (or leave raw, matching repo precedent).

### P2 — `d5-connectivity.cjs` early-return score is inconsistent with the penalty formula
- **file:** `.opencode/skills/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs:48`
- **issue:** Missing-SKILL.md early return sets `score: 0`; the normal penalty path (line 91-92) for one P0 (`missing_skill_md`, P0=40) would yield `100-40 = 60`. `gateFailed:true` is set on both paths so the verdict is correct either way, but the raw `score` differs (0 vs 60) for the same condition — confusing for any score-comparison/debug consumer. source: iter1 f-hs-i1-04 (this is the ONE iter-1 finding that maps to a real line in the real file; verified)
- **one-line fix:** Return `score: 60` in the early-return branch, or fall through to the shared penalty computation so both paths agree.

### P2 — 003 implementation-summary "Not committed yet" is now stale
- **file:** `.opencode/specs/.../003-skill-rename-deep-improvement/implementation-summary.md:60`
- **issue:** Doc still flags the rename as "Not committed yet … parallel-session-revert hazard." The rename landed at commit `caf072e39e` (in HEAD). The note is stale and would mislead a future resume into thinking the rename is at risk. source: iter8 f-hs-i8-01/02 (severity REVISED P1→P2, and re-scoped from "spec overclaims Complete" to "impl-summary note is stale" — the spec's "Complete" status is now CORRECT because the commit exists)
- **one-line fix:** Update the impl-summary line to "Committed at `caf072e39e`" and drop the hazard caveat; `completion_pct:100` is now accurate.

---

## Rejected / revised

### REJECTED — iter1 entirely (f-hs-i1-01, -02, -03): nested-brace/bracket parse failures in `parseIntentSignals`/`extractDictBody`
- iter1 reviewed a file **`router-replay.cjs` at lines 59/65/31 claiming a flat `[^}]*` / `[^\]]*` regex**. The REAL `router-replay.cjs` (157 lines, re-read in full) uses a **brace-depth scanner with string-skipping**: `parseIntentSignals` (lines 50-79) tracks `depth`/`inStr` to find the matching close brace; `extractDictBody` (lines 26-46) explicitly skips quoted strings when searching for structural braces — the exact fix iter1 "recommended" is ALREADY the implementation. The keyword extraction at line 71 (`/keywords\s*:\s*\[([^\]]*)\]/`) operates on the already-correctly-bounded `entryBody`, and the SKILL.md router format is flat arrays, so the nested-array hazard is non-existent in practice. iter1's premise (and its later mutation into "scorer.cjs:1000") is hallucinated. **FALSE-POSITIVE ×3.**

### REJECTED — iter1 f-hs-i1-05: "0.4/0.6 D1-intra weights uncommented / don't sum to 13"
- The 0.4/0.6 split (`score-skill-benchmark.cjs:85`) is an intra-dimension blend of intentRecall vs resourceRecall, normalized to 0..1; the 13-point allocation is applied LATER in `aggregate` via `WEIGHTS.d1intra`. There is no arithmetic error — 0.4+0.6=1.0 is a weighting of a normalized sub-score, not a point allocation. A clarifying comment would be nice-to-have but there is no defect. **FALSE-POSITIVE.**

### REJECTED — iter2 f-hs-i2-01: "`seg` const referenced outside for-of scope → ReferenceError in `contamination-lint.cjs:46`"
- Real line 46: `for (const seg of resourcePath.split('/')) if (seg && seg.length > 3) tokens.add(seg);` — `seg` is used **inside** the loop body (single-statement for-of), no out-of-scope reference, no ReferenceError. The function is exercised by the passing contamination tests. **FALSE-POSITIVE.**

### REJECTED — iter2 f-hs-i2-02: "private-fixture `JSON.parse` outside try/catch → uncaught crash, run-skill-benchmark.cjs:54"
- Real `loadFixtures` (run-skill-benchmark.cjs:37-43): `pub = JSON.parse(...)` and `priv = readJsonIfExists(...)` are BOTH inside the same `try`, with `catch (err) { loadError = err.message; }`. The "malformed-fixture degradation" test (skill-benchmark.vitest.ts:133-145) writes `{ not valid json`, asserts `code===0` (no crash) and a `firstFailingStage:'unparseable-fixture'` row. The graceful path is proven. **FALSE-POSITIVE.**

### REJECTED — iter2 f-hs-i2-03 / f-hs-i2-05: "`String(prompt||'')`→'undefined'" and "D3 NaN via 1-0/0"
- (03) `advisor-probe.cjs:35` is `String(prompt || '')`; with `prompt` undefined this yields `''`, NOT the string `"undefined"` (that would require `String(prompt)`); harmless. The `timeoutMs` "not forwarded" sub-claim is moot — `probeAdvisor` defaults `timeoutMs||60000`. (05) D3 at `score-skill-benchmark.cjs:80` is `routedArr.length === 0 ? 1 : clamp01(1 - wasted/routedArr.length)` — the zero-routing guard is FIRST, so `1-0/0` is never evaluated; no NaN. **FALSE-POSITIVE ×2.**

### REJECTED — iter2 f-hs-i2-04 / f-hs-i2-06 / f-hs-i2-07: undefined-resources, negative rank>5 boundary, advisorMode string fragility
- (04) `scoreResourceRecall` (line 27-37) already normalizes `(expected||[])` and handles `want.size===0`; the contract is explicit, not ambiguous. (06) The negative-scenario `rank>5` boundary at `advisor-probe.cjs:68` is a design choice for an OPT-IN path (`advisorMode` defaults `'off'`, no negative fixture ships); not reachable in default/CI and defensible (rank 6+ = "not in top-5" = success). (07) `_args.cjs` (re-read) cleanly handles `--key value`, `--key=value`, and bare flags; `advisorMode==='python'` strict-equality means any other value (incl. "false") simply leaves the probe off — that is correct fail-safe behavior, not fragility. **FALSE-POSITIVE / NOT-A-DEFECT ×3.**

### REVISED — iter2 P2s f-hs-i2-08/09/10 + iter1's general style nits
- `build-report.cjs:35` already uses `dd.status == null ? 'unscored' : dd.status` (nullish-safe); the `||`-vs-`??` nit (i2-08) is moot. The contamination blank-line (i2-09) and 2-char-threshold (i2-10) notes are real-but-trivial hardening suggestions on an opt-in linter with a 2-char floor that is a deliberate false-positive guard. Collapsed to "no action; defensible as-is."

### REJECTED — iter3: all 8 findings are PASS-restatements
- iter3 correctly verified loop-host additivity but filed 8 "no fix needed; additive" entries as `severity:P2`. These are NOT findings; they are PASS evidence. Independently re-verified: `git show --stat 40d1ca5543` touches NO Lane A/B module; `LANE_A`/`LANE_MODEL_BENCHMARK`/`LANE_SKILL_BENCHMARK` sets are disjoint; `parseArgs`/`resolveMode` unchanged; the loop-host non-regression tests (skill-benchmark.vitest.ts:29-54) pass. Lane A/B byte-identical plan confirmed. **NOT FINDINGS (PASS confirmed).**

### REVISED (down to non-finding) — iter4 f-hs-i4-01 + iter6-codex: `command-deep-agent-improvement` "routes nowhere at skill_advisor.py:1789"
- Line 1789 IS the `command-deep-agent-improvement` command-bridge dict entry (verified). iter4's "routes nowhere / inert" claim is FALSE: the bare/slash phrase `deep-agent-improvement` and `/deep-agent-improvement` ARE routed to `deep-improvement` (weight 3.2) by the routing-weight table at `skill_advisor.py:1589-1590`, and the legacy id aliases at 251-254 also map to `deep-improvement`. So the rename is functionally complete and the old phrases route correctly. The ONE true sub-observation iter4 made — this entry lacks an `owning_skill` key that its sibling command-bridges (e.g. `command-memory-save`, `command-spec-kit-resume`) carry — is real but it is (a) explicitly documented as an intentional SCOPE-LOCK keep in `003/implementation-summary.md` ("a `command-deep-agent-improvement` command-bridge key … [is an] intentional keep"), (b) pre-existing tech debt the packet deliberately did not churn, and (c) inert-by-design: its slash_markers point at the still-valid `/deep:start-agent-improvement-loop` command. NOT a packet-122 defect; NOT filed as a finding. The "routes nowhere" framing is the FALSE-POSITIVE.
- Advisor split-brain check: TS `aliases.ts`/`explicit.ts`/`fusion.ts` sources contain NO `deep-agent-improvement`/`deep-improvement` tokens (the grep hits were in the compiled `dist/` JS, which mirror correctly); Python has 35 `deep-improvement` refs and 6 legacy `deep-agent-improvement` aliases all pointing to the new id. **No split-brain. Rename is complete and consistent.**

### REJECTED — iter5: 13×P0 + 3×P1 for "missing frontmatter / missing overview / unnumbered headers"
- The structural facts (no frontmatter, no OVERVIEW, sentence-case headers, raw JSON) are TRUE, but iter5 grounded them in fabricated `template_rules.json` "mandates" at non-existent line numbers and the word "required" where the file says `recommendedSections`/`optional`. Verdict downgraded from FAIL to a single consolidated **P2** (intra-skill inconsistency) per the rationale in the confirmed-findings block. The 13×P0 + FAIL verdict is REJECTED as wildly over-escalated.

### REJECTED — iter7 f-7-02 and the security-surface alarm
- The advisor-probe subprocess path (`spawnSync('python3',[py,String(prompt||'')])`, no `shell:true`) is safe: argv-array invocation, no shell metachar interpretation, prompt arrives as `sys.argv[1]`; static read of `skill_advisor.py` shows no `eval`/`exec` on the prompt. d5-connectivity path-escape detection (`resolved.startsWith(path.resolve(skillRoot))`, line 68) correctly catches escapes. contamination-lint is substring matching only. iter7 itself rated these "sound"; the "transitive import surface not frozen" note is speculative, not a defect. **NO SECURITY FINDING.**

### REVISED — iter7 f-7-01 (e2e passes with zero scenarios) and iter7 f-7-03/04/05/06 test-coverage gaps
- f-7-01 is a REAL but minor test-quality gap: the e2e test (`skill-benchmark.vitest.ts:188-200`) runs `--skill cli-codex` (no fixtures dir) so `scenarioRows` is empty and the test asserts only schema/mode/dual-artifact existence. It does NOT give false confidence about *scoring* — the scenario-level scorer is covered by the unit tests at lines 108-131 (which DO assert scores), and the deep-improvement-fixture path is exercised by the `--skill deep-improvement` flows. Real polish item → **P2** (not P1): add `report.scenarioRows.length > 0` using the deep-improvement skill which ships a real fixture. The temp-dir-not-cleaned (f-7-04) and uncovered ambiguity/negative-fixture cases (f-7-05/06) are legitimate test-hygiene/coverage nits, collapsed into the same P2 "tighten Lane C test coverage" item.

### REJECTED — iter8 f-hs-i8-03 (validate.sh "green" without cited exit code) and f-hs-i8-04 (208 cited without re-run)
- f-8-03: a "cite the exit code in the doc" request, not a code/correctness defect; the validator is re-runnable and this is doc-evidence hygiene, not a finding worth carrying. f-8-04: I INDEPENDENTLY re-ran the suite this iteration → **208 passed, exit 0**, which confirms the cited count is accurate. The "single-source / not re-verified" concern is now resolved by this re-run. **REJECTED (resolved).**

### iter9 PASS rows (f-9-04/05/06)
- Independently re-confirmed: scoring_contract.md weights (D1=25[12+13]/D2=20/D3=15/D4=25/D5=15) exactly match `score-skill-benchmark.cjs:19 WEIGHTS`; scored-vs-unscored Mode A dims match doc; `modeAScore` normalizes over measured weights only (line 121-122). **PASS — no drift in the scoring contract.** (This makes the feature_catalog:277 "two-value set" line the one real docs-vs-code drift, which iter9 missed.)

---

## Synthesis feed

Final deduplicated, adversarially-verified finding list (ranked P0 → P1 → P2). No P0 survives verification. Every line below was personally re-read from the cited file this iteration.

**P0 — none.** (All MiniMax P0s were either hallucinated-line parse bugs, already-implemented guards, opt-in-path edge cases, or over-escalated doc-style nits. The shipped Lane C code is correct: 208/208 tests pass, no crash paths, no security holes, rename complete, loop-host purely additive.)

**P1 (4 — all documentation-accuracy, operator-flagged dimensions):**
1. `.opencode/agents/deep-improvement.md:44` — "two co-equal lanes" omits Lane C. Fix: → "three co-equal lanes" + Lane C clause (canonical), then mirror-sync.
2. `.claude/agents/deep-improvement.md:29` + `.gemini/agents/deep-improvement.md:29` — same "two co-equal lanes" string in both mirrors. Fix: mirror-sync the three-lane correction. (`.codex` has no per-agent md file; parity is via `.codex/config.toml` — do not create a phantom mirror.)
3. `.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:277` — "`VALID_MODES` is a closed two-value set" but code (`loop-host.cjs:31`) has three; sentence also omits the skill-benchmark route. Fix: → "three-value set" + add the `--mode=skill-benchmark` route. (NEW — breadth pass missed this.)
4. `.opencode/commands/deep/start-skill-benchmark-loop.md:43` — D1-inter mislabeled as unbuilt follow-on (it is built + deterministic, opt-in `--advisor-mode=python`). Fix: move only D4/Mode-B to "follow-on"; mark D1-inter built-but-opt-in. (Pair with documenting `--advisor-mode` in operator_guide.md Invocation + the command file.)

**P2 (6 — polish / consistency / scaffold debt):**
5. `.opencode/skills/deep-improvement/scripts/shared/loop-host.cjs:63-73` — `SKILL_BENCHMARK_RUN_OPTIONS` dead-forwards `profile`,`state-log`,`label`,`grader`,`k-runs` (run() consumes none). Fix: trim to the consumed flags.
6. `.opencode/skills/deep-improvement/assets/skill-benchmark/default_profile.json:4` — `weights` block + implied `--profile` are unwired (WEIGHTS hardcoded in score-skill-benchmark.cjs:19). Fix: wire `--profile` or annotate as not-yet-consumed.
7. `references/skill-benchmark/{scoring_contract,operator_guide,scenario_authoring}.md` + `assets/skill-benchmark/{default_profile,remediation_taxonomy}.json` — inconsistent with the skill's OWN Lane A/B reference convention (those have `title/type/status` frontmatter + `## 1. OVERVIEW` + numbered ALL-CAPS H2s; Lane C docs have none). template_rules.json marks these `recommended`/`optional`, not required, and raw-JSON assets are a repo-wide pattern — so this is consistency polish, not a structural violation. Fix: add frontmatter + numbered OVERVIEW to the 3 reference docs.
8. `.opencode/skills/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs:48` — missing-SKILL.md early-return `score:0` vs penalty-formula `60` for the same condition (verdict unaffected; gateFailed set both ways). Fix: return `score:60` or fall through to shared penalty.
9. `.opencode/skills/deep-improvement/scripts/tests/skill-benchmark.vitest.ts:188-200` — e2e asserts schema/artifacts only (zero-scenario cli-codex run); plus uncleaned temp dir + uncovered ambiguity/negative-fixture cases. Fix: assert `scenarioRows.length>0` via the deep-improvement skill (ships a real fixture); add afterAll cleanup + the two edge-case rows.
10. `.opencode/specs/.../003-skill-rename-deep-improvement/implementation-summary.md:60` — stale "Not committed yet" note; rename landed at `caf072e39e`. Fix: update to "Committed at caf072e39e," drop the hazard caveat.

Review verdict: CONDITIONAL
