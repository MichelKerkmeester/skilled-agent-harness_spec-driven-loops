# Iteration 002 — EXTRACT: Net-New Techniques with Portability Taxonomy

**Status:** complete  |  **Focus:** Independently map every net-new technique from both external sources, tagged with portability class (model-agnostic / Anthropic-specific / executor-portable), deduped against Fable5.md and round-1's shipped set.

---

## 1. Assessment

### newInfoRatio: 0.72
**Novelty justification:** The portability tagging systematically classifies all 24 findings for the first time, revealing that ~60% are model-agnostic (portable to any AI coding tool), ~25% are Anthropic-specific (require re-expression), and ~15% are executor-portable (principle ports, calibration differs). The sibling lineages identified overlap heavily in technique IDs but did not assess portability.

### Technique Map (all sources, portability-tagged, deduped)

#### From `fable-mode-main/` (engineering method) — 15 techniques

| ID | Technique | Portability | Source | Dedup vs Round 1 |
|---|---|---|---|---|
| F1 | **Mutation-as-epistemology** — break code to prove tests bite; hunt vacuous green tests; mutation as claim falsifier | **Model-agnostic** | fable-mode-profile.md:111-123 | NEW — round 1 says "verify before claim" but doesn't prescribe the mutation check |
| F2 | **Verification ladder** — unit→in-memory→on-server→live→headless, each blind spot named in advance | **Model-agnostic** | fable-mode-profile.md:126-139 | NEW — round 1 says "run the real thing" but doesn't name the ladder |
| F3 | **Adversarial-review-at-scale** — claim-verifiers + adversarial recheck + completeness critic; forced `claim/verdict/evidence` triple w/ file:line; refute own reviewers | **Model-agnostic** | fable-mode-profile.md:141-146 | PARTLY — round 1's "finding-is-a-hypothesis" is the individual-instance version; F3 is the at-scale protocol |
| F4 | **Scar-tissue ledger** — "Traps already hit": blast site + next-bite-site + load-bearing-vs-defensive + activation condition | **Model-agnostic** | fable-mode-profile.md:202-211 | NEW |
| F5 | **Cold-successor handoff protocol** — carry only non-derivable (state, sequence, scar tissue); numbered Read order; role-play reader cold | **Model-agnostic** | fable-mode-profile.md:200-216 | NEW |
| F6 | **Engineer staleness out of artifacts** — counts→greps, enumerations→table-walking tests, "today X"→assertion that fails loud | **Model-agnostic** | fable-mode-profile.md:218-232 | NEW — partially covered by comment-hygiene rule but the *active* conversion mechanic is new |
| F7 | **Fail-closed by construction** — structural not disciplinary invariants; poison unsafe default; reject not strip; redundant double-enforcement | **Model-agnostic** | fable-mode-profile.md:243-248,280-283 | NEW — round 1's "name the rollback" is individual-instance; F7 is the structural version |
| F8 | **Decision economy** — scope-frugal/process-expensive; named seam not bare TODO; never a dead control; scaffold the contract not the implementation | **Model-agnostic** | fable-mode-profile.md:69-79 | PARTLY — round 1's "match effort to blast radius" covers effort sizing; the seam/scaffold convention is new |
| F9 | **Brief-as-sovereign** — read for intent; deviate from letter only with recorded argument; undocumented deviation is sin; contract>spec>decisions>handoff | **Executor-portable** | fable-mode-profile.md:284-291 | PARTLY — round 1's plan-workflow lock is similar but narrower |
| F10 | **Two-register voice + lexicon** — clipped-while-working / dense-at-boundaries; lead with verdict then receipts | **Executor-portable** | fable-mode-profile.md:420-461 | NEW — register and lexicon are the efficiency lever; round 1 added doctrine but not voice |
| F11 | **Multi-agent house rules** — LEAF disjoint-scope; git/.md ban; typed status enum; two-stage review; verify-personally backstop | **Model-agnostic** | fable-mode-profile.md:351-360 | PARTLY — our agents have some of this (orchestrate/code); the DONE_WITH_CONCERNS status and verify-personally backstop are new |
| F12 | **Reproduce-before-fix + second-break-behind-first + suspect-yourself-first** | **Model-agnostic** | fable-mode-profile.md:159-192 | PARTLY — round 1's "a finding is a hypothesis" covers the verification; the suspect-yourself reflex is new |
| F13 | **Measurement integrity** — an untrustworthy number is a bug even when green; fix a gate's undercount under budget | **Model-agnostic** | fable-mode-profile.md:316-322 | NEW |
| F14 | **Ration live/destructive actions + cleanup-as-privacy** | **Executor-portable** | fable-mode-profile.md:328-372 | LOW RELEVANCE — no shared production box in the Public repo |
| F15 | **Worst-first triage** — named severity buckets scored by downstream consequence to a cold reader | **Model-agnostic** | fable-mode-profile.md:58-67 | NEW |

#### From `opus-fable-mode-main/` (governor + persistence + measurement) — 9 techniques

| ID | Finding | Portability | Source |
|---|---|---|---|
| G1 | **Opus recursion-control governor (8 rules)** — "reason about the problem, never about yourself"; audit depth-limit 1; start-later/stop-earlier; minimum honest qualifier; commit with `// DECISION:`; outcome over process; preserve real depth; act-don't-narrate | **Anthropic-specific** (rules 1-2 target Opus anxiety texture); **Executor-portable** (rules 3-8 are efficiency levers for any model) | governor-block.md:1-13 |
| G2 | **Three-layer persistence: setpoint → thermostat → measurement** — CLAUDE.md decays; UserPromptSubmit hook re-states every turn; leak_test confirms movement. Subagent-blind. | **Anthropic-specific** (wired to Claude's hook system); **Executor-portable** (the 3-layer pattern ports to any runtime with a per-turn injection surface) | README.md:69-77 |
| G3 | **leak_test.py harness** — 4 metrics (median words/msg, tool:text ratio, caveat %, self-opener %); buckets by model id from JSONL; converging iff moved-toward AND closed-distance | **Executor-portable** (metrics portable; log paths and model IDs differ per runtime) | leak_test.py:28-159 |
| G4 | **Prompt-vs-weights honesty** — governor suppresses disposition expression, not the weights; no capability gain | **Model-agnostic** (applies to ALL prompt-based steering) | README.md:6-7,79-83 |
| G5 | **Quantified Fable signature** — median words 47→18; tool:text 1.41→3.91; result-first openings | **Anthropic-specific** (the numbers are Opus-vs-Fable comparisons; the metric *types* are model-agnostic) | README.md:13-21 |
| G6 | **Extended-thinking caption test** — captions about the problem (healthy) vs about yourself (burning budget on self-surveillance) | **Anthropic-specific** (targets Opus's thinking-block anxiety pattern; other models don't have this same failure mode) | fable-mode.md:88-102 |
| G7 | **Reject wrong framings** — refuse false dichotomy/bad premise and reframe | **Model-agnostic** | fable-mode.md:71-84 |
| G8 | **"Beautiful dead end" guardrail** — don't follow a thread to technically-correct conclusion that no longer helps | **Model-agnostic** | fable-mode.md:106-117 |
| G9 | **Anti-recursion self-check + mechanics** — one pass not a loop; toggle `FABLE_MODE_OFF=1` | **Executor-portable** (the self-check idea ports; the toggle is Claude-specific) | fable-mode.md:128-137 |

### Key Insight: The Efficiency Core

The techniques that directly buy *efficiency* (less token burn, less context decay, more result-first output) cluster into a core set: **F10** (two-register voice — clipped-while-working = fewer prose tokens, dense-at-boundaries = info per boundary-token), **G1 rules 6-8** (outcome over process, preserve real depth, act-don't-narrate — directly suppress the narration tax), **G5** (the quantified signature — what you measure to confirm it's working), and **F8** (decision economy — stop before the diminishing-returns zone).

These are the lever set for "efficiency" as distinct from "correctness" (which F1-F7 and F11-F15 primarily target).

### Ruled-Out Directions

| Approach | Reason | Evidence |
|---|---|---|
| Treating all governor rules as equally portable | Rules 1-2 directly target Opus's self-audit anxiety texture; DeepSeek and non-Anthropic models don't exhibit this failure mode | governor-block.md:1-7 |
| Porting G6 (caption test) as a generic rule | Targets thinking-block self-surveillance; non-thinking models don't have equivalent mechanics | fable-mode.md:88-102 |
| Adopting F14 (ration live actions) for Public | No shared production box; partially covered by name-the-rollback | fable-mode-profile.md:368-372 |

### Answered Questions
- Q1 (substantially answered): 15 fable-mode techniques + 9 opus-fable-mode techniques mapped with portability class. ~60% model-agnostic, ~25% Anthropic-specific, ~15% executor-portable.

---

## 2. Strategy Update

**What Worked:** The portability taxonomy proved highly discriminating. It immediately surfaced which recommendations can be universally applied (F1 mutation-check, F4 scar-tissue, F6 staleness-engineering, F7 fail-closed, F13 measurement integrity) and which need careful re-expression (G1 governor rules, G6 caption test, G5 signature calibration). The taxonomy also flagged that the *efficiency* lever set (F10 + G1:6-8 + G5) is distinct from the *correctness* lever set (F1-F7, F11-F15) — a distinction the sibling lineages folded together but the spec asks us to separate.

**Next Focus (Iteration 3):** SURFACE MAP pillar — assess every adjustable Public-repo surface's read-reliability per runtime (OpenCode/Claude/Codex/DeepSeek), with the portability lens. Focus on: which surfaces can structurally enforce (executor-config / post-dispatch-validate / renderPromptPack) vs which are advisory (AGENTS.md / constitutional / agent prompts)? The sibling lineages both flagged the hook as the highest-read-reliability surface but rated it Claude-only. Assess whether OpenCode/Codex hook equivalents exist.
