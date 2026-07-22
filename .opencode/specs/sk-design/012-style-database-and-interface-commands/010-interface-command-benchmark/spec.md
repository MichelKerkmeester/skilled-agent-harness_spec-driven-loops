---
title: "Benchmark Record: /interface:* Commands — Structure + Live Multi-Model Quality"
description: "Hybrid benchmark of the five /interface:* design commands: a deterministic structure/conformance axis (contract test + per-command scorecard) plus a live output-quality axis running /interface:design on one shared brief across three executors — cli-opencode deepseek-v4-pro, cli-opencode mimo-v2.5-pro, and cli-codex gpt-5.6-luna high. Scores presentation-contract fidelity + design quality."
trigger_phrases:
  - "interface command benchmark structure live quality"
  - "deepseek mimo luna interface design benchmark"
  - "interface design command multi-model scorecard"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/012-style-database-and-interface-commands/010-interface-command-benchmark"
    last_updated_at: "2026-07-22T12:10:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Scored three live legs; wrote scorecard"
    next_safe_action: "Operator reviews scorecard verdict"
    blockers: []
    key_files:
      - ".opencode/specs/sk-design/012-style-database-and-interface-commands/010-interface-command-benchmark/review/review-report.md"
      - ".opencode/skills/sk-design/shared/scripts/interface-command-contract.test.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-012-010-interface-benchmark-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: review-record | v2.2 -->
<!-- SPECKIT_LEVEL: review -->

# Benchmark Record: /interface:* Commands — Structure + Live Multi-Model Quality

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec Folder** | 010-interface-command-benchmark |
| **Level** | 1 |
| **Status** | COMPLETE — structure axis + three live legs scored; scorecard written |
| **Executors** | cli-opencode `deepseek/deepseek-v4-pro --variant high`; cli-opencode `xiaomi/mimo-v2.5-pro`; cli-codex `gpt-5.6-luna` high fast |
| **Verification** | contract test 8/8; each leg scored against the rubric on the shared brief |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The five `/interface:*` commands were refactored (packet `009`) to conformant thin routers with
research-backed presentation assets, but their *live* behavior was never benchmarked across executors: how
faithfully the presentation contract renders, and how good the design output is, when the command runs
under different models and runtimes. This is the operator's "Hybrid: structure + live quality" benchmark —
a deterministic conformance pass plus a live three-model run of `/interface:design` on one shared brief.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**Structure axis (deterministic):** the five commands' router conformance — router-detected, exactly one
`@`-include, no command-owned taste, modes wired — plus `interface-command-contract.test.mjs` (expected
8/8).

**Live-quality axis:** `/interface:design` on ONE shared brief (a Product-register analytics-dashboard
empty state) across three legs:

| Leg | Transport | Model | How the command reaches the model |
|-----|-----------|-------|-----------------------------------|
| 1 | cli-opencode | `deepseek/deepseek-v4-pro --variant high` | native `opencode run --command interface/design :auto` |
| 2 | cli-opencode | `xiaomi/mimo-v2.5-pro` | native `opencode run --command interface/design :auto` |
| 3 | cli-codex | `gpt-5.6-luna` high | raw prompt — presentation + shared contract inlined (codex has no OpenCode command runtime) |

**Out of scope:** `deep:command-benchmark`'s frozen conformance/behavior engines (they cannot drive these
models — established earlier); `foundations`/`motion`/`audit`/`design-reference` live runs (design is the
flagship; the others are noted as extensions); any change to the commands themselves.

**Rubric (per leg, on the shared brief):**
1. Presentation fidelity — emits all 8 visible blocks (Route Proof … Next Action/Handoff).
2. Grounding discipline — Reuse Report + Violation Scan; no unverified tokens asserted.
3. Proof-tier honesty — proofs tier-labeled; a read-only run does not overclaim `measured`/`verified`.
4. Real content + states — real copy + empty/first-run/loading, not placeholders.
5. Design taste — distinctive, non-generic palette/type/layout/motion intent.
6. Artifact-first — leads with the artifact, envelope deferred.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:review-summary -->
## 4. REVIEW SUMMARY

**Structure axis: PASS** (contract test 8/8; all five commands conformant). **Live axis verdict:** the
presentation contract is **portable** — all three executors emitted all 8 visible blocks with full
grounding and honest proof tiers, *including the raw-prompt codex/LUNA leg* — validating packet `009`'s
presentation-asset design. But **design quality does not travel like structure**: taste specificity ranked
**deepseek (strong, ~110) > mimo (moderate, ~38) > LUNA (thin, ~6)**, because the two native cli-opencode
legs load the full `sk-design` interface mode while the codex leg got only an inlined prompt. **Best live
executor: cli-opencode + `deepseek-v4-pro`**; `mimo` a solid lighter second; `gpt-5.6-luna` proved contract
portability + the most conservative proof discipline (`PROOF_TIER=observed`) but is design-sparse as a raw
port. Full per-dimension table: `review/review-report.md`.

**V2 CORRECTION (prompt-parity rerun).** An independent Opus review found the v1 executor verdict
confounded — I had handicapped only the codex/LUNA leg (`owned-tokens`, cap proof at `observed`,
don't-fabricate) and the three legs solved different problems. V2 re-ran all three on one fully-specified
brief with an equalized instruction set. Result: the v1 "~18× taste gap" **compressed to ~3×** (deepseek 70
> mimo 46 > LUNA 23) once LUNA was un-handicapped (it authored 11 concrete hex tokens vs zero in v1). So
**most of the v1 gap was my prompt design, not transport**; the native path is a *modest* design win, not an
order-of-magnitude one. Also corrected: mimo's v1 `measured` contrast label was a real overclaim (the "no
overclaims" claim was false — an explicit v2 proof convention fixed it), and "mimo cheaper" is refuted (cost
~equal, $0.0192 vs $0.0200). Corrected verdict + retractions in `review/review-report.md` §V2.

**V3 CORRECTION (blind rubric judgment).** The keyword-count taste proxy was itself replaced (the
reviewer's other P0): the three v2 artifacts were anonymized + shuffled and scored blind by three
independent Claude-Opus judges on a 5-dimension rubric. Result — **unanimous** across all three judges, and
it **inverts the proxy**: **gpt-5.6-luna 24.0/25 (1st) ≳ deepseek-v4-pro 23.3 (2nd) ≫ mimo-v2.5-pro 15.3
(3rd)**, where the proxy had ranked LUNA *last* and mimo *second*. Two consequences: the keyword proxy is
unreliable (retire it), and — since the raw cli-codex port won — **design quality tracked the MODEL, not
the transport**; the native-path advantage is convenience, not a quality ceiling. Still n=1 brief (repeats
+ multi-brief remain P1). Full aggregate + reasoning in `review/review-report.md` §V3.

**V4 CROSS-BRIEF (generalization).** V3's "LUNA best" was tested on a maximally different brief (Brand /
light / three-tier pricing), all legs equalized, three fresh blind Opus judges. Unanimous brief-2 ranking:
**deepseek 24.0 (1st) > gpt-5.6-luna 21.7 (2nd) > mimo 19.3 (3rd)** — the top two *flipped* from brief 1.
So the generalizable findings across both briefs (6 blind judge-runs): **deepseek-v4-pro ≈ gpt-5.6-luna are
co-leaders trading #1 by task** (deepseek skews proof-rigor + state completeness; LUNA skews distinctive
concept), **mimo-v2.5-pro is consistently the weakest** (unanimously last both briefs), the keyword proxy
is wrong on both, and **transport does not gate quality** (the raw codex port is co-top-tier on both). Full
cross-brief table in `review/review-report.md` §V4.

**V5 CROSS-FAMILY (final).** The last validity worry — all V3/V4 judges were Claude-Opus — was closed by
re-scoring the same artifacts on both briefs with two non-Claude judge families: GLM-5.2 (z.ai) and
gpt-5.6-sol (OpenAI). Across **6 blind judge-configs (2 briefs × 3 families)**: **mimo is last in ALL six**
(unanimous — not an Opus artifact), and **deepseek 22.7 ≈ gpt-5.6-luna 22.6 are dead-even co-leaders**, with
the #1 spot judge-family/brief-dependent (GLM leans deepseek, sol leans LUNA [OpenAI-family caveat], Opus
splits). The keyword proxy is wrong across every family. **Final verdict: use deepseek-v4-pro or
gpt-5.6-luna (co-leaders) for `/interface:design`; avoid mimo; transport does not gate quality.** Full
matrix in `review/review-report.md` §V5. Only-remaining P1: within-model run-to-run variance (1 run per
leg/brief); given the ~0.1/25 tie, repeats would most likely confirm "co-leaders, task-dependent".
<!-- /ANCHOR:review-summary -->

---

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS

- Does the cross-runtime asymmetry (legs 1–2 load the sk-design interface mode natively; leg 3 gets it as
  an inlined raw prompt) materially disadvantage the codex/LUNA leg on grounding — and if so, is a native
  cli-codex design path worth building (this is exactly what packet `035/015` scopes for cli-opencode)?
- Should the benchmark extend to `foundations`/`motion`/`audit` on their own briefs, or is `design` a
  sufficient proxy for presentation-contract fidelity across the family?
<!-- /ANCHOR:questions -->
