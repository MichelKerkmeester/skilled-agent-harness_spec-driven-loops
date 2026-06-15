# Iteration 002 — Lane C "skill-benchmark": a credible HINT-FREE dispatch harness (RQ2)

> Model: opus · Iteration 2 of 5 · LEAF (no sub-dispatch) · Read-only research
> Web note: `WebSearch`/`WebFetch` were permission-gated in this background context (denied, not retried), same as iteration-001. External prior-art citations are given as canonical URLs flagged `[web-unverified]`; a later web-enabled iteration should confirm exact names/metrics. All repo citations are first-hand from files read this iteration. Builds on iteration-001 (RQ1 dimensions D1–D5, RQ7 prior art).

---

## Focus

RQ2 — design a credible **hint-free dispatch harness**: run a realistic scenario against an AI and capture (a) **which references/assets it loaded** and (b) its **tool trace**, WITHOUT leaking the expected answer/path into the prompt. Three concrete sub-problems: **resource-load instrumentation**, **held-out expected-resource keys**, and **prompt-contamination avoidance**. This is the measurement engine behind iteration-001's D2 (unprompted reference discovery) and D3 (efficiency), and the gating precondition for D4's ablation (a contaminated prompt invalidates every downstream score).

---

## Actions Taken

1. Re-read the target skill `deep-agent-improvement/SKILL.md` (full) — confirmed the dispatcher seam (`dispatch-model.cjs`, §4), the smart-router pure function `route_recursive_agent_resources(task)` that returns an observable `resources` loaded-list (§2), the literal-substring intent matcher `score_intents`, the static-fixtures + materializer split (§7), and the `benchmark-stability.cjs` repeatability evidence path.
2. Read `system-skill-advisor/SKILL.md` (full) — confirmed `advisor_recommend` emits a per-skill confidence score, the advisor's own `score_intents` is also a literal substring matcher, and the explicit prompt-safety rule "advisor metadata and lane attribution must not echo raw prompt text."
3. Re-read iteration-001 (`opus/iterations/iteration-001.md`) and the phase spec/strategy — anchored RQ2 against D2/D3/D4 and the deferred Open Question "measuring whether a *live model* opens the right reference unprompted needs trajectory capture — what's the cheapest deterministic proxy vs a graded behavioral run?"
4. Globbed this packet's own `research/.../logs/` tree — found per-iteration executor stdout logs (`iter-00N.*.out`) already written by the deep-loop runtime, i.e. trace capture is already a solved sub-problem the harness can reuse rather than build.
5. Synthesized the harness design + its validity controls; enumerated the repo-specific contamination channels a naive harness would miss.

---

## Findings (each cited)

### F1 — Two capture modes, not one: deterministic router-replay (hint-free by construction) AND live dispatch trace
The harness needs **both** a cheap deterministic mode and an expensive behavioral mode, because they answer different questions:
- **Mode A — router replay (deterministic).** The in-`SKILL.md` router is a *pure function*: `route_recursive_agent_resources(task)` takes only task text and returns `{"intents":…, "resources": loaded, "runtime_assets":…}`. Running it over a fixture prompt yields the exact resource set the router *would* load, with zero prompt leakage (the function only ever sees task text) and 100% observability. [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:183-213] This is the cheapest credible D2 proxy and is CI-friendly — it answers "is the reference *reachable* given this phrasing?"
- **Mode B — live dispatch trace (behavioral).** Dispatch the fixture to a real AI via the dispatcher seam and parse its tool trace for actual file loads. This answers the harder question "does a *live model* actually open the right reference unprompted?" — exactly iteration-001's deferred Open Question. [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:278; opus/iterations/iteration-001.md:165]
**Actionable:** Mode A is the default/regression gate; Mode B runs periodically (deep runs) because it is stochastic and costly. A divergence between A and B is itself a finding (router can reach it, model doesn't → SKILL.md doesn't *signpost* the reference inline).

### F2 — Resource-load instrumentation: parse the tool-call log the runtime ALREADY emits; canonicalize ALL file-touch verbs
The primary, highest-fidelity capture is **tool-call log parsing**, and the raw material already exists: this very deep-loop run writes per-iteration executor stdout logs. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/logs/iter-001.opencode.out] Lane C adds a parser (e.g. `parse-resource-loads.cjs`) that turns a transcript into `{observed_resources[], tool_trace[]}`, where each entry is a file-access call whose resolved path is under the skill root, tagged with order index (giving D2 *and* D3 from one capture).
- **Critical hazard:** models read files in more than one way. The `Read` tool is one channel; `Bash(cat …)`, `Bash(rg …/references/…)`, `Grep`, and `Glob` are others. A parser that only counts the `Read` tool **under-counts loads** and will falsely score a skill as "undiscovered." The canonicalizer must normalize every file-touch verb to a resolved path before set-comparison. [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:4 (allowed-tools: Read, …, Bash, Glob, Grep) — all five are load channels]
- **Order matters:** the trace's first-load-of-correct-reference index is the D3 "tool-calls-to-resource" metric from iteration-001 F4. [SOURCE: opus/iterations/iteration-001.md:71-73]

### F3 — Canary/sentinel tokens in references separate "opened" from "consumed" (and survive log loss)
Embed a unique inert marker in each reference/asset (e.g. an HTML comment `<!-- RKEY:a8f3c1 -->`) that never appears in any prompt. Two payoffs: (1) if the marker reappears in the model's output/reasoning, that file was not merely opened but **actually consumed** — a stronger signal than a Read event; (2) it works even when the executor's tool log is unavailable or lossy (some CLI executors emit prose, not structured events). This is the resource-consumption analogue of the **BIG-bench "canary GUID"** used to detect benchmark-in-training contamination — repurposed from leakage-detection to consumption-detection. [SOURCE: https://github.com/google/BIG-bench (canary string) `[web-unverified]`] **Hazard (see Open Questions):** an unusual token in-context may itself perturb model behavior; measure the perturbation before trusting it as zero-cost.

### F4 — Held-out expected-resource key: derive from RESOURCE_MAP, store OUT-OF-BAND, two parts
The fixture "answer key" is the set of resources that *should* load. Source it deterministically from the skill's own `RESOURCE_MAP[intent]` for the intent the fixture targets — but persist it in a scorer-only manifest (`fixtures/<id>.expected.json`) that is **never concatenated into the dispatched prompt**. This is the standard held-out-test-set / answer-key separation from ML eval. [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:124-138 (RESOURCE_MAP as gold source); ML held-out test set, e.g. https://en.wikipedia.org/wiki/Training,_validation,_and_test_data_sets `[web-unverified]`] Two-part key per fixture:
- `expected_resources`: gold file set → Hit@k / Recall@k / cost-weighted precision (D2).
- `expected_routing`: `should_activate` (bool) + expected intent/skill → activation accuracy (D1).
**Circularity guard (links RQ4):** scoring whether a live model reaches the `RESOURCE_MAP` target is only fair if the *prompt* is paraphrased away from the map's own keyword vocabulary; otherwise you measure keyword echo, not discovery (see F5). The gold key comes from the map; the prompt must be decontaminated of the map's trigger strings — authored by a different side of the harness.

### F5 — Contamination channels enumerated, each with a control; the keyword-leak is provably fatal
"Hint-free" must be falsifiable, not asserted. Both routers in scope are **literal substring matchers**, which makes one leak channel mathematically decisive:
- deep-agent-improvement: `for keyword in cfg["keywords"]: if keyword in text: scores[intent] += weight`. [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:168-172]
- advisor: `hits = sum(1 for keyword in model["keywords"] if keyword in text)`. [SOURCE: .opencode/skills/system-skill-advisor/SKILL.md:218-222]
So if the dispatched prompt contains a `triggers`/`keywords`/`intent_signals` string verbatim (e.g. `"score candidate"`, `"benchmark a model"`), routing fires for *that reason alone*, regardless of true routing quality — a guaranteed false pass. Channels + controls:

| Leak channel | Control |
| --- | --- |
| Skill-name / command leak (`deep-agent-improvement`, `/deep:start-…`) | Phrase as a task, never name the skill or command |
| Path/filename leak (`.opencode/skills/…`, `references/x.md`) | No path or filename strings — D2 is path-free by definition (iter-001 F3) [SOURCE: opus/iterations/iteration-001.md:53-61] |
| Keyword/trigger leak (substring match) | Paraphrase intent into natural language; assert prompt contains none of the router keyword strings |
| Answer-shape leak ("produce a 5-dimension score") | Don't describe expected output structure; it telegraphs the defining reference |
| Few-shot/example leak (examples lifted from the skill's docs) | No exemplars sourced from the skill corpus |
| Cross-fixture / order priming | Fresh context per fixture (the deep-loop already runs "fresh context per pass") [SOURCE: deep-research skill description, this session] |
| Memory/continuity pre-leak | Run with memory bypass (`skip memory`/`[skip]`) so a prior run's answer can't surface |

### F6 — Repo-specific contamination the naive harness WILL miss: the advisor/hook brief already names the answer in-context
In this runtime the `UserPromptSubmit` hook surfaces an advisor brief *into the agent's own context* before it acts — observed live this session: `Advisor: live; ambiguous: sk-code 0.93/0.16 vs deep-research 0.93/0.16`. [SOURCE: UserPromptSubmit hook additional context, this session] If the harness lets that brief reach the **dispatched** agent, the agent is literally handed the routing answer, and D2/D3 become meaningless. The harness MUST: (1) **capture** the advisor recommendation *out-of-band* as the D1 measurement (call `advisor_recommend` directly), and (2) **strip** the hook/advisor brief from the dispatched agent's context. The advisor's own design already states the prompt-safety direction — "advisor metadata and lane attribution must not echo raw prompt text" — Lane C needs the inverse boundary too (don't echo the advisor verdict into the test subject). [SOURCE: .opencode/skills/system-skill-advisor/SKILL.md:308; advisor_recommend confidence, :68-72]

### F7 — Make decontamination an auditable admission gate, reusing the routers' own matcher
Don't hope a prompt is clean — prove it. Add a **contamination linter** that, before a fixture is admitted, scans the prompt for ANY of: the skill name, any skill-relative file path, any `triggers`/`keywords`/`intent_signals` substring, and the command names; non-empty match → reject the fixture. The linter is cheap and uses the *same* substring logic the routers use (F5), so "hint-free" is decided by the identical mechanism that would otherwise be gamed. Pair it with **two-author separation** (RQ4 link): the decontaminated prompt and the gold key (F4) must be produced by different sides — derive the key mechanically from `RESOURCE_MAP` while the prompt author works only from a paraphrased task brief — so the author cannot unconsciously seed the answer. [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:113-138,168-172]

### F8 — Validity controls that make the harness "credible" rather than merely "runnable"
A hint-free number is only trustworthy with controls that detect a broken harness:
- **Hinted-vs-hint-free calibration arm.** Run a subset BOTH ways (clean prompt, and prompt with path/keyword injected). If scores don't rise under hints, the trace capture is broken (not measuring discovery). The clean↔hinted gap quantifies discovery difficulty. This is the harness's self-test.
- **Decoy-skill negative control.** Include fixtures whose gold key belongs to a *different* skill; the scorer must not credit the skill-under-test. Detects scorer leakage / over-crediting.
- **k-run repeatability.** Live dispatch is stochastic; dispatch each fixture k times and report resource-hit as a rate with variance, reusing the existing repeatability evidence pattern rather than a single run. [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:350,415 (`benchmark-stability.cjs` repeatability)]
- **Blind-to-rubric.** The dispatched model never sees the weights/rubric (it would optimize to them).

### F9 — Maps cleanly onto existing seams; net-new surface is small and named
Lane C's harness is mostly *reuse*, consistent with iteration-001 F8:
- **dispatcher** = `dispatch-model.cjs` (already routes across 5 executors); Lane C adds a decontamination pre-pass + a "must emit tool log" requirement. [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:278]
- **trace artifact** = the per-iter executor `.out` logs the runtime already writes. [SOURCE: research/logs/iter-001.opencode.out]
- **net-new: parser** `parse-resource-loads.cjs` (log → `{observed_resources[], tool_trace[]}`, F2), **scorer** `skill-benchmark` (observed vs held-out key → D1/D2/D3; calls `advisor_recommend` out-of-band for D1), and a **fixture split** `fixtures/<id>.prompt.txt` (dispatched, decontaminated) + `fixtures/<id>.expected.json` (scorer-only, held-out) — mirroring Lane B's static-fixtures→materializer→runner pattern. [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:339-348]

### F10 — RQ2 ↔ RQ6 interaction: the rename moves the very strings the contamination linter blocks on
The `deep-agent-improvement → deep-improvement` rename (iteration-001 F10) changes the skill name, paths, command names, and keyword strings — i.e. exactly the denylist the contamination linter (F7) and the canary keys (F3) are keyed to. If Lane C is built before/around the rename, its linter denylist and any path-based parser roots must be **regenerated from the skill's live metadata at run time**, never hard-coded, or post-rename fixtures will silently pass contaminated (old name absent, new name un-blocked) and the resource parser will resolve loads against a dead skill root. [SOURCE: opus/iterations/iteration-001.md:146-148; .opencode/skills/deep-agent-improvement/SKILL.md:2,7-14,520-522]

---

## Recommendations

1. **Build the harness in two tiers:** Mode A router-replay as the cheap default/CI gate, Mode B live-dispatch trace for periodic deep runs; treat an A↔B divergence as a first-class finding (F1).
2. **Capture loads by parsing the tool log the runtime already emits**, with a canonicalizer that normalizes ALL file-touch verbs (Read + Bash cat/rg + Grep + Glob), not just the Read tool (F2).
3. **Add canary tokens** to each reference to separate "opened" from "consumed" and to survive lossy logs — after measuring their behavioral perturbation (F3).
4. **Hold the expected-resource key out-of-band**, derived mechanically from `RESOURCE_MAP`, split into `expected_resources` + `expected_routing` (F4).
5. **Ship a contamination linter as a fixture-admission gate** using the routers' own substring logic, plus two-author prompt/key separation to break circularity (F5, F7).
6. **Strip the advisor/hook brief from the dispatched agent and capture it out-of-band as the D1 signal** — this is the repo-specific leak a generic harness misses (F6).
7. **Include validity controls** (hinted-vs-hint-free calibration arm, decoy-skill negative control, k-run repeatability, blind-to-rubric) so the harness can detect when it is itself broken (F8).
8. **Reuse the dispatcher + log artifact + Lane B fixture pattern**; net-new is just a parser, a scorer, and the fixture split (F9). Keep the default agent-improvement path byte-identical.
9. **Derive linter denylist and parser roots from live skill metadata, not constants**, so the rename (RQ6) cannot silently re-contaminate fixtures (F10).

---

## Open Questions

- **Log-parse fidelity vs FS-level capture:** is tool-log parsing (F2) sufficient, or do models read via `Bash(cat)` often enough that we need filesystem-level instrumentation (atime/inotify/FUSE on a skill-tree copy) as a backstop? Cost vs completeness.
- **Canary perturbation:** does an inert marker token in a reference measurably change model behavior (the observer effect)? Needs an on/off A/B before canaries are trusted (F3).
- **Unavoidable-keyword decontamination:** when natural task language *must* contain a router keyword (e.g. "benchmark" is both a common word and a trigger), how to decontaminate — common-word allow-list, or weight hits by keyword specificity/IDF? (F5)
- **Minimum credible k:** what is the smallest k-run count that yields trustworthy resource-hit variance per fixture without blowing the dispatch budget across (skills × fixtures × k)? (F8)
- **Mode A as sufficient proxy:** how often does deterministic router-replay (Mode A) agree with live dispatch (Mode B) in practice? If agreement is high, Mode B can be rare — but that agreement rate must itself be measured before relying on it (F1).
- **Cross-runtime trace normalization:** the 5 executors (opencode/claude-code/codex/gemini/devin) emit different log shapes; does the parser need a per-executor adapter, and does that asymmetry bias cross-executor comparisons? (F2, F9)
