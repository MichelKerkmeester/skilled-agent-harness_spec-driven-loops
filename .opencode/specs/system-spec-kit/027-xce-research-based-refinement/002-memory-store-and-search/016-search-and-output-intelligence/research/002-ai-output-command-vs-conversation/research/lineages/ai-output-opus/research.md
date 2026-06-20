# Research Synthesis — AI Output Quality: Slash-Commands (`--command`) vs Natural Conversation

> Lineage: **ai-output-opus** · Executor: **cli-claude-code model=opus** ·
> 5 iterations, converged (all 5 open problems answered).
> Built on `grounding-evidence.md` (verified live cross-model test this session).

---

## Executive summary

The cross-model adherence gap (DeepSeek binds `$ARGUMENTS` cleanly; Kimi K2.7 always and
MiMo v2.5 Pro intermittently drop to the startup question) is **not** a broken injection
mechanism. It is a **salience-driven conditional misfire**: the `/memory:search` contract
makes "ask the startup question when `$ARGUMENTS` is empty" the *first and most imperative*
instruction a model reads, then requires the model to actively negate an empty-`$ARGUMENTS`
guard to do its real job. Strong instruction-followers (DeepSeek) perform that negation
reliably; weaker/borderline ones (Kimi, MiMo) anchor on the salient ask-path and treat a
populated `$ARGUMENTS` as empty.

The fix is **structural, not lexical**: move the branch out of the model's judgment.
Compute arg-presence deterministically in shell, hand the model a resolved `QUERY` plus an
`ARGS_PRESENT` flag, invert salience so the execute-path leads, and add an imperative
no-ask guard. Then mandate **one score / one scale / one name** (similarity 0–1, two
decimals) on *every* surface so conversational answers are cross-comparable, and write the
contract in the **COSTAR register** (objective-first, audience=automated-pipeline,
fixed response, no preamble) — the framing the two weak followers tolerate best.

---

## Findings by open problem

### KQ1 — Command-argument robustness across models *(F1, confirmed)*
- The transport is sound: `--command` substitution works on opencode 1.17.4
  [SOURCE: cli-opencode/SKILL.md:269]; DeepSeek executed 2/2 through the identical path
  [SOURCE: grounding-evidence.md:11-13]. Injection is **not** the cause.
- The contract front-loads the ask-path: search.md step 1 reads the presentation asset
  first [SOURCE: search.md:22], whose **§1 is "Startup Question Policy"**
  [SOURCE: search_presentation.txt:15-21], reinforced by the hard rule "ask the
  open-ended startup question" [SOURCE: search.md:100]. Retrieval is §2, *after*.
- Root cause: executing retrieval requires *suppressing the salient ask-path* by
  correctly negating the empty-guard. DeepSeek (DEPTH/reasoning, rewards precise
  conditionals [SOURCE: deepseek-v4-pro.md:60]) negates it; Kimi fails always, MiMo
  intermittently — the signature of weaker conditional instruction-following
  [SOURCE: grounding-evidence.md:15-22].

### KQ2 — `--command` vs direct-prompt vs natural conversation *(F2, confirmed)*
- Only `--command` loads the template; raw `/memory:search` text is delivered as prose
  and the contract never enters the session [SOURCE: cli-opencode/SKILL.md:269]. Any
  adherence probe MUST use `--command`.
- **Deterministic renderer** (the `MEMORY:SEARCH … STATUS=OK` envelope) trades model
  latitude for cross-model consistency — shape variance ≈ 0 where it executed
  [SOURCE: search.md:56-69]. **Model-driven/natural** trades consistency for richness
  (Kimi's `requestQuality`/`citationPolicy` precision) but yields non-comparable output
  (confidence vs similarity) [SOURCE: grounding-evidence.md:17-22].
- **Design rule:** deterministic renderer when output feeds a program/agent or must be
  diffable/comparable; model latitude only for the genuinely ambiguous follow-up
  ("at most one") [SOURCE: search_presentation.txt:113]. Richness → mandated optional
  fields, not latitude.

### KQ3 — Startup-question fallback hazard → structural arg-presence *(F3, inferred design)*
Yes — distinguish "invoked with args" from "invoked bare" **structurally**. Proposed
four-layer contract pattern:
1. **Deterministic arg-resolution header** via `` !`…` `` shell injection: emit
   `ARGS_PRESENT=true|false` and a joined `QUERY="…"` before the model reads anything.
   (Handle the `"$@"` word-split caveat — the renderer must join argv
   [SOURCE: cli-opencode/SKILL.md:269].)
2. **Salience inversion:** retrieval/execute contract first; startup section gated behind
   `ONLY IF ARGS_PRESENT=false:`.
3. **Imperative no-ask guard:** "When ARGS_PRESENT=true you MUST execute on QUERY now; do
   NOT ask the startup question" [SOURCE: grounding-evidence.md:33].
4. **Explicit arg echo** in the envelope (`MEMORY:SEARCH "<query>"`
   [SOURCE: search.md:58-60]) so a dropped query is visibly wrong and self-correctable
   [SOURCE: search.md:73].
*Would confirm:* a live A/B `--command` run of the patched contract on Kimi/MiMo measuring
execute-rate.

### KQ4 — Which output fields the contract should mandate *(F4, confirmed extension)*
**One score, one scale, one name — on every surface.**
- Mandate **`similarity`, 0–1, two decimals** as the sole ranking metric (never
  `confidence`, never percentage; divide %-scaled by 100)
  [SOURCE: search.md:71; search_presentation.txt:76]. DeepSeek's `confidence 0.36`
  violated this; Kimi's `0.68 similarity` is contract-correct
  [SOURCE: grounding-evidence.md:42-45].
- Mandate the five core slots everywhere: **query echo, similarity, id, title, STATUS
  footer** (`RESULTS`/`INTENT`) [SOURCE: search.md:58-68].
- Promote useful extras (`requestQuality`, `citationPolicy`) to **named optional** trailing
  fields so presence/absence is unambiguous [SOURCE: grounding-evidence.md:17-18].
- Keep constitutional rows out of the scored block (separate heading)
  [SOURCE: search_presentation.txt:91-94].
- **Surface-parity clause** to add: the §2 field set + scale are mandatory on `--command`,
  direct prompt, *and* natural conversation.

### KQ5 — Per-model prompt-framework fit *(F5, inferred)*
- DeepSeek=RCAF (reasoned default, low-confidence) [SOURCE: deepseek-v4-pro.md:54-66];
  Kimi=COSTAR, **RCAF objectively weakest** (benchmark 007) [SOURCE: kimi-k2.7-code.md:57-63,83];
  MiMo=COSTAR, avoid TIDD-EC/CIDI (benchmark 004) [SOURCE: mimo-v2.5-pro.md:57-67].
- Framework fit is a **secondary, reinforcing** lever: the benchmarks measured coding
  correctness/format, not command control-flow. A well-framed prompt still loses if the
  first instruction says "ask a question." But once the structural fix is in, writing the
  contract in the **COSTAR register** (objective-first, audience=automated-pipeline,
  fixed response, no-preamble) is the shared intersection the two weak followers need and
  DeepSeek tolerates. A single global framework is wrong (RCAF is Kimi's worst).
*Would confirm:* a command-control-flow benchmark (not coding fixtures) with/without COSTAR
framing across the three models.

---

## Prioritized contract-change recommendations

| # | Change | Targets | Type | Priority |
| --- | --- | --- | --- | --- |
| 1 | Deterministic `ARGS_PRESENT` + joined `QUERY` header via `` !`…` `` shell injection | KQ1, KQ3 | structural | **P0** |
| 2 | Salience inversion: execute-path first; startup gated behind `ONLY IF ARGS_PRESENT=false` | KQ1, KQ3 | structural | **P0** |
| 3 | Imperative no-ask guard bound to the resolved QUERY | KQ1, KQ3 | lexical (defense-in-depth) | P1 |
| 4 | Surface-parity clause: similarity 0–1/2dp + query/id/title/STATUS mandatory on ALL surfaces; ban confidence/percentage | KQ2, KQ4 | contract | **P0** |
| 5 | Promote `requestQuality`/`citationPolicy` to named optional fields | KQ4 | contract | P1 |
| 6 | Write command contracts in the COSTAR register (objective-first, pipeline audience, fixed response, no preamble) | KQ5 | framing | P1 |
| 7 | Fix `"$@"` word-split in any `` !`…` `` renderer (join argv) | KQ3 | bug | P1 |

**Generalization:** changes 1–3 apply to *any* command with an "ask when bare" branch, not
just `/memory:search` — the empty-`$ARGUMENTS` heuristic is a portable latent hazard.

---

## Ruled-out directions (negative knowledge)
- `$ARGUMENTS` injection is broken for weak models — **refuted** (same path, DeepSeek
  succeeds; Kimi succeeds via direct prompt).
- Models can't perform retrieval — **refuted** (all three succeed on the direct path).
- Probe adherence with raw `/memory:search` text — **invalid** (template never loads).
- Strengthen the empty-check wording alone — **insufficient** (leaves the branch in model
  judgment; MiMo's intermittency proves wording is non-deterministic).
- Infer the query from conversation when bare — **forbidden** [SOURCE: search.md:100].
- Per-model metric latitude / percentage scores — **refuted** (caused the
  confidence-vs-similarity divergence; contract mandates 0–1 two decimals).
- One global prompt framework for all commands — **refuted** (RCAF is Kimi's worst).
- Framework fit alone closes the gap — **refuted** (control-flow defect is structural).

---

## Convergence report
- **Stop reason:** all 5 open problems answered + max_iterations (5) reached.
- **Iterations:** 5/5. **Questions answered:** 5/5.
- **newInfoRatio trend:** 0.90 → 0.70 → 0.62 → 0.50 → 0.28 (monotonic decline; iter 5
  was consolidation). **Avg:** 0.60.
- **Quality gates:** source diversity PASS, focus alignment PASS, no-single-weak-source PASS.
- **Confidence:** F1/F2/F4 confirmed (multi-source, cited); F3/F5 inferred-design with
  named confirmation experiments. Remaining work is implementation (out of scope per charter).

## References
- `grounding-evidence.md` (verified live cross-model test, this session)
- `.opencode/commands/memory/search.md` (router contract)
- `.opencode/commands/memory/assets/search_presentation.txt` (presentation contract)
- `.opencode/skills/cli-opencode/SKILL.md:269` (`--command` dispatch mechanics)
- `.opencode/skills/sk-prompt-small-model/references/models/{deepseek-v4-pro,kimi-k2.7-code,mimo-v2.5-pro}.md`
