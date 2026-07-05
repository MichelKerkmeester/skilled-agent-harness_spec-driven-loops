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
