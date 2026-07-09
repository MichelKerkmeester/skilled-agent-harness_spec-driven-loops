---
title: "Implementation Summary: Cross-Skill Routing Sweep"
description: "Cross-skill routing sweep: Phase-0 diagnostic + Phase-1 deep-improvement hand-sweep + Phase-2 fan-out (deep-research/deep-review gold-align, Mode-A + Mode-B live PASS; deep-ai-council orphan-wire) + Phase-3 code-opencode intent-gate diagnosed and deferred turnkey. Fresh Sonnet 5 APPROVE-WITH-FIXES; Mode-B framed honestly as consistency-not-judgment."
trigger_phrases:
  - "cross-skill routing sweep summary"
  - "phase 0 triage results"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/054-smart-routing-benchmark-program/004-cross-skill-routing-sweep"
    last_updated_at: "2026-07-09T09:30:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Anti-overfit strengthening investigated; router-precision finding documented"
    next_safe_action: "Defer keyword-narrowing + live-decontaminated harness lane to follow-up"
    blockers: []
    key_files:
      - ".opencode/specs/system-deep-loop/054-smart-routing-benchmark-program/004-cross-skill-routing-sweep/assets/phase0-triage.md"
      - ".opencode/specs/system-deep-loop/054-smart-routing-benchmark-program/004-cross-skill-routing-sweep/assets/code-opencode-language-split-design.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session_01Ht7J9NZTEBBXwzTeNvras9"
      parent_session_id: null
    completion_pct: 75
    open_questions: []
    answered_questions:
      - "D3 = Option G + non-scoring diagnostic; detector-first / hand-sweep-hardest — two fresh reviews converged"
      - "Mode-B corroborates routing CONSISTENCY, not independent judgment — scenario prompts leak intent keywords (contamination-lint fails); adversarial/decontaminated siblings remain open"
---
# Implementation Summary: Cross-Skill Routing Sweep

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

<!-- ANCHOR:metadata -->
## Metadata
| Field | Value |
|-------|-------|
| **Spec Folder** | 004-cross-skill-routing-sweep |
| **Completed** | Phase 0 (read-only triage) done; sweep gated on operator go-ahead |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built
Phase 0 — read-only, no skill mutated. A computed `D3-ex-default` diagnostic (waste minus each skill's always-loaded DEFAULT tier) plus a classified orphan triage, both in `assets/phase0-triage.md`.

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
The diagnostic separated the harmless DEFAULT-tier artifact from genuine over-routing: deep-research/deep-review/deep-ai-council/code-webflow are pure artifact (waste-ex-default = 0 → gold-align); deep-improvement is mostly artifact + 3 genuine; **code-opencode is genuine over-routing (31/45 waste survives DEFAULT-exclusion → intent-gate)** — correcting the audit's guess. Every flagged skill has a lean 1–2 file DEFAULT tier, so gold=design is honest (not the tautology code-review's 5-file tier carried). The orphan classification found **ROUTABLE 18 / EXEMPT 9 / PRUNE 0**: 9 of 27 (33%) are index/catalog READMEs, reference-only archaeology, or an auto-generated dashboard that must stay unrouted — exactly the reviewers' prediction, and why the D5 CI gate must be allowlist-based, never "zero orphans."

### Phase 1 — deep-improvement hand-sweep (independent Sonnet 5 sign-off)
The worst offender was swept end-to-end: 11 routable orphans wired into **existing** lane intents (no new intents, no keyword additions — every mapping content-verified), the 7 index files placed on a new `routing-allowlist.json`, and the gold aligned to the router's designed load. A backward-compatible allowlist mechanism was added to `d5-connectivity.cjs` (absent file = unchanged; allowlisted files score `info`, zero penalty) with a RED/GREEN unit test.

**Earned result: D5 46 → 100** (structural, scenario-independent) and **Mode-B live 80 → 90** with live `resourceRecall` 1.00 (an independent model recalls the routed resources). A fresh Sonnet 5 verifier audited for gaming and returned **APPROVE-WITH-FIXES**: it confirmed all 12 mappings are honest and all 7 exemptions genuine, and caught a real overstatement — corrected below.

**Honest scope (per the Sonnet audit):** Mode-A's D1/D2/D3 = 100 are **tautological** under gold=design (the gold equals the router's own output), so they are a router-code smoke test, **not** independent usefulness evidence. The **earned** signals are **D5** (a static structural scan) and **Mode-B** (a live model that never sees the gold). Mode-A Type-1 scoring also covers only the 10 `10--intra-routing-recall` scenarios; the skill's other operational playbook categories are not loaded into Type-1 scoring by the sk-doc loader (pre-existing behavior — noted as a follow-up, not introduced here).

### Phase 2 — fan-out (deep-research, deep-review, deep-ai-council)
GPT-5.5-fast workers proposed each sweep; every result was re-verified independently before acceptance and one worker's out-of-scope change was reverted.

- **deep-research** — wired 2 genuine orphans (`references/protocol/context_snapshot.md`→`LOOP_SETUP`, `assets/deep_research_strategy.md`→`STATE`), allowlisted 2 non-routable files (an auto-overwritten dashboard template + a file self-named `convergence_reference_only.md`), gold-aligned 8 scenarios. **Mode-A D5/D3/D1intra = 100; Mode-B live D5/D3/D1intra = 100** (zero circularity gap).
- **deep-review** — wired 4 genuine orphans into `REVIEW_SETUP`/`REVIEW_CONVERGENCE` (proven purely additive — every original path retained), gold-aligned 4 scenarios. **Mode-A D5/D3/D1intra = 100; Mode-B live D5 100 / D3 84 / D1intra 100** (a healthy 16-pt gap: the live model routes slightly broader than the designed gold, but recalls every routed resource).
- **deep-ai-council** — a worker also renamed `INTENT_MODEL`→`INTENT_SIGNALS` and flattened its per-keyword weights (5/4/3→1), a discrimination regression outside this sweep's scope; that over-reach was **reverted**. Only the honest 1-line orphan-wire (`assets/prompt_pack_round.md`→`COUNCIL_RUN`) was kept. Its D5 remains **0** on this branch (10 `dead_intent_key` P1s from the `INTENT_MODEL` tuple format the harness does not parse) — **no D5=100 is claimed for it**; the format normalization is a genuine per-keyword-vs-per-intent weight decision + key-sync test, deferred.

**Mode-B is honest corroboration of consistency, not of independent judgment.** The scenario prompts leak their intent keywords (they fail `contamination-lint`, which is advisory for playbook-tier scenarios and skipped in live mode — a systemic, pre-existing corpus property, not introduced here), so a live model can route correctly by echoing the topic words the prompt hands it rather than by unaided routing judgment. Strengthening this to a true anti-overfit test requires ≥1 decontaminated/paraphrased holdout plus 1 adversarial negative per intent — tracked as open `checklist.md` items, not yet done.

### Phase 3 — code-opencode intent-gate (diagnosed, deferred turnkey)
The one GENUINE over-routing case: `LANGUAGE_STANDARDS` loads all four languages' guides for a single-language task (a TypeScript task routes 18, gold 3), and `code-webflow` carries the identical defect. Gold-aligning would be dishonest (it would bless loading Python/shell guides for a TypeScript task). The honest fix is a per-language intent split that matches the already-written design (`code-opencode/SKILL.md` §1; parent `smart_routing.md` prose rows 217-219, 476), but it is a runtime-behavior change to the live sk-code hub touching both surface children + the parent projection + advisor vocab + three drift guards + a hub-baseline re-capture. It was **deferred** to a dedicated follow-up child rather than half-landed at the tail of a long session on a shared branch; the full diagnosis and fix design are captured turnkey in `assets/code-opencode-language-split-design.md`.
<!-- /ANCHOR:how-delivered -->
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:decisions -->
## Key Decisions
Adopt Option G (per-scenario gold) + a non-scoring diagnostic — the general engine exclusion was rejected by both fresh reviews. Detector-first, then hand-sweep deep-improvement before automating. Non-routable index files go on an intentionally-unrouted allowlist, not into fake intents.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification
Diagnostic computed via router-replay per scenario (read-only); orphan classification is a GPT first-pass over file contents, final judgment deferred to the Phase-1 hand-sweep with an independent reviewer.
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations
Open items surfaced by the two Sonnet audits and carried forward:

1. **Anti-overfit strengthening investigated — blocked by a harness gap; a real finding surfaced instead.** Attempting the T2/T3 fixtures exposed two things (`assets/deep-research-router-precision-finding.md`): (a) the `--fixtures-dir` path enforces `contamination-lint`, which bans intent keywords from fixture prompts, so a "generic keyword over-fires in an unrelated context" negative cannot be scored (it is rejected as `contaminated-fixture`) — the framework's negatives only cover keyword-*free* unrelated prompts, which a keyword router trivially suppresses; and (b) a real (low-severity) over-activation defect: deep-research's `STATE`/`ITERATION`/`CONVERGENCE` fire on ordinary words (`strategy`, `dashboard`, `registry`, `lineage`, `focus`, `diminishing returns`) so marketing/billing/UI/ad-spend prompts mis-route. A true anti-overfit test needs *live* evaluation of decontaminated prompts (no gated harness path today); the honest Mode-B "consistency-not-judgment" framing stands as the proportionate response. The keyword-narrowing fix is a deferred precision/recall tradeoff (an operator call).
2. **Harness prerequisite not yet on `skilled/v4.0.0.0`.** The sweep's scoring depends on the `001-live-scoring-fix` engine change (live `resourceRecall` folds observed assets) and the `d5-connectivity` routing-allowlist mechanism; both are committed on `system-speckit/028…` but reach `skilled/v4` only via the in-flight `deep-loop-workflows → system-deep-loop` migration. Until they land, `deep-research/routing-allowlist.json` is inert (harmless) and live scores are not reproducible on this branch. The sweep router-data and docs are valid standalone.
3. **Scenario-loader scope (pre-existing).** The loader only reads `NNN-*.md` under `10--intra-routing-recall`, so a skill's other playbook categories never enter Type-1 scoring — a benchmark-scope follow-up, not introduced here.
4. **code-opencode / code-webflow language split deferred** — a genuine both-surface router fix, captured turnkey in `assets/code-opencode-language-split-design.md`; a residual `IMPLEMENTATION` keyword collision on "implement/feature" is not split-fixable and is documented there.
5. **Two weak deep-improvement mappings retained** (`profiling_audit_log → INTEGRATION_SCAN`, `improvement_config_reference → EVALUATION_POLICY`) — defensible via each intent's declared keywords.
<!-- /ANCHOR:limitations -->
