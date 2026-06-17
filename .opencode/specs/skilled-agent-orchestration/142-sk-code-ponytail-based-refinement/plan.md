---
title: "Research Plan: Ponytail-Based Refinement of sk-code / sk-code-review"
description: "Plan for the 10-iteration, 2-model deep-research investigation into applying ponytail's logic/hooks to sk-code and sk-code-review. Research-only."
trigger_phrases:
  - "ponytail refinement plan"
  - "ponytail research plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: .opencode/specs/skilled-agent-orchestration/142-sk-code-ponytail-based-refinement
    last_updated_at: 2026-06-13T11:05:00Z
    last_updated_by: claude-opus
    recent_action: "12-iter deep research complete; research.md synthesized"
    next_safe_action: "Operator: /speckit:plan starting with Wave A additive doc rows"
---
# Research Plan: Ponytail-Based Refinement of sk-code / sk-code-review

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Run a 2-model deep-research loop (Opus 4.8 + gpt-5.5-fast) to determine how the external ponytail project's logic, hooks, intensity sliders, ceiling comments, rule-invariant guard, review skill, and benchmark harness can improve `sk-code` and `sk-code-review`. Research-only: no skill code changes. Output is `research/research.md`.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- Each ponytail mechanism has a portability verdict + concrete target file/section.
- Every recommendation cites a grep-traceable path in sk-code / sk-code-review.
- Adversarial cross-verify (each model refutes the other lane); false positives downgraded.
- All load-bearing factual claims independently verified on disk by the orchestrator.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Orchestrator-driven read-only seats: Opus 4.8 via the account-2 `claude` CLI (`--permission-mode plan`), gpt-5.5-fast via cli-opencode (`opencode run`, `</dev/null`, read-only). The orchestrator writes all iteration/delta/state artifacts (Gate-3 safe). The ponytail tree is gitignored, so ponytail source is embedded inline in gpt prompts; Opus seats read it directly (with transcript recovery as a fallback for plan-mode stdout truncation).

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

No skill code modified (research-only). Investigated (read-only): `external/ponytail-main/**` (reference), `.opencode/skills/sk-code/**`, `.opencode/skills/sk-code-review/**`, plus `deep-improvement/scripts/**`, `CLAUDE.md`, `.github/workflows/` for verification. Recommended target files (for a later packet) are enumerated in `research/research.md` §2.

<!-- /ANCHOR:affected-surfaces -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

- Phase 0: Init spec + research scaffold (config/strategy/state); smoke-test both model lanes.
- Phase 1 (5 waves generate): each wave = 1 Opus + 1 gpt-5.5-fast seat on 2 distinct angles → 10 angle-iterations.
- Phase 2 (Round 2): adversarial refute-first cross-verify (Opus verifies gpt lane; gpt verifies Opus lane).
- Phase 3: orchestrator-side grep verification of all factual claims.
- Phase 4: Synthesize `research/research.md`; reconcile `spec.md` findings fence; save continuity.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Verification is evidence- and convergence-based: refute-first round-2 verdicts + direct on-disk grep confirmation of every load-bearing claim (Iron Law drift, no-vitest-in-CI, comment-hygiene ordering, mirror-sync scope, Lane B correctness gate, checklist sections, router-sync behavior). No code tests (research-only).

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- account-2 `claude` CLI (`CLAUDE_CONFIG_DIR=~/.claude-account2`) → `claude-opus-4-8`.
- cli-opencode + authed OpenAI provider → `openai/gpt-5.5-fast`.
- `gtimeout` for dispatch budgets; `external/ponytail-main` present (gitignored) as reference.

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

No skill code changed → nothing to roll back. All artifacts are additive under the spec folder's `research/`. The packet can be deleted wholesale with no external effect.

<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

Phase 0 → 1 → 2 → 3 → 4 in sequence; within each wave the 2 seats run in parallel. Round 2 seeds from the merged round-1 findings + the orchestrator's confirmed facts. Synthesis depends on all 12 iterations.

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

12 model iterations (Opus ×6, gpt-5.5-fast ×6) + orchestration. Wall-clock ~40-50 min across 6 waves at 2-seat concurrency (each seat 80-300s).

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

No skill code changed → no rollback needed. Research artifacts are additive under `research/`. The recommended changes are deferred to a separate `/speckit:plan` → `/speckit:implement` packet, sequenced Wave A-D in `research/research.md` §5.

<!-- /ANCHOR:enhanced-rollback -->
