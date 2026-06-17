---
title: "Implementation Summary: Ponytail-Based Refinement Research"
description: "Summary of the 12-iteration, 2-model deep-research investigation into applying ponytail's logic/hooks to sk-code and sk-code-review."
trigger_phrases:
  - "ponytail refinement summary"
  - "ponytail research summary"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: .opencode/specs/skilled-agent-orchestration/142-sk-code-ponytail-based-refinement
    last_updated_at: 2026-06-13T15:45:00Z
    last_updated_by: claude-opus
    recent_action: "Deep-review remediation done: 12 findings fixed, changelogs updated, gates green"
    next_safe_action: "Operator: log remediation in review-report, then scoped commit on branch 028"
    fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
---
# Implementation Summary: Ponytail-Based Refinement Research

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Type** | Deep-research (read-only) |
| **Status** | Complete |
| **Iterations** | 12 (claude-opus-4-8 ×6, openai/gpt-5.5-fast ×6) |
| **Reference** | `external/ponytail-main` (gitignored) |
| **Targets** | `.opencode/skills/sk-code`, `.opencode/skills/sk-code-review` |
| **Deliverable** | `research/research.md` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

A prioritized, file-mapped recommendation report (`research/research.md`) for transplanting ponytail mechanisms into sk-code / sk-code-review:

- **Core tension resolved:** ponytail gates *design* upfront (6-rung ladder, no loop) at Phase 1; sk-code's Iron Law verifies *result* at Phase 3 — complementary, not conflicting, provided the no-loop stance is not imported literally.
- **25 ranked recommendations** — ADOPT-NOW (8): Design Restraint Ladder in the always-loaded universal doc; stdlib/native review rows; canary-lock the `Review status:` triplet (per-file scoped); neutral `ceiling:` comments (not the brand, not in `ALLOWED_PATTERNS`); ceiling-as-P2-downgrade evidence; needed-ness KISS prompt; `Replacement` field in removal_plan. ADOPT-LATER (9) incl. canonicalize-then-canary the Iron Law, fold `code_loc` into Lane B sweep, promote `mirror-sync-verify.cjs` to a repo-wide gate. DO-NOT-ADOPT (8) incl. the verification-intensity slider (Iron-Law bypass), standalone clones, `net -N` severity gate.
- **3 bonus latent defects** found + verified: Iron Law wording drifted 3 ways; `mirror-sync-verify.cjs` mis-scoped to promotion-time; `STACK_FOLDERS`↔`references/` binding unenforced.

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

5 parallel generate waves (each = 1 Opus 4.8 seat via the account-2 `claude` CLI + 1 gpt-5.5-fast seat via cli-opencode) over 10 distinct angles, then 1 round-2 adversarial refute-first cross-verify wave. Read-only seats; orchestrator wrote all iteration/delta/state (Gate-3 safe). Two execution issues handled mid-run: (1) the gitignored ponytail tree blocked opencode's search tools → ponytail source embedded inline in gpt prompts; (2) `--permission-mode plan` truncated one Opus stdout (it wrote to a plan file) → recovered fully from the account-2 transcript and hardened the remaining Opus prompts with a stdout-only rule.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

- Orchestrated-waves execution (orchestrator owns all state writes) over the formal `/deep:start-research-loop` command — sidesteps the Gate-3 executor-write block; operator-approved deviation.
- 5 waves / 10 distinct angles + round-2 cross-verify (operator choice over per-angle dual-model or two-lineage).
- Reducer (`reduce-state.cjs`) skipped — its anchor format (ANCHOR:key-questions style) differs from the seeded strategy; registry + dashboard hand-maintained instead (plan's explicit fallback).
- Research-only deliverable; implementation deferred to a follow-up packet.

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

- 12/12 iterations valid; recorded in `research/deep-research-state.jsonl` + `iterations/iteration-001..012.md` + `deltas/`.
- Round-2 refute-first: 0 recommendations refuted as already-present (gaps grep-confirmed absent); 2 scope corrections applied.
- Orchestrator grep-verified all 7 load-bearing factual claims on disk (7/7 confirmed).
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec> --strict` — see final run in the session.

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

- The Design Restraint Ladder's clean integration into sk-code Phase 1 (no break to `OPENCODE>WEBFLOW>UNKNOWN` precedence / Iron Law) is *asserted* by the research, not *exercised* — the follow-up plan packet must prove it before implementing.
- iter-002 (hooks) ran with degraded ponytail evidence (gitignore discovered after it ran); its findings are grounded in the local sk-code hook files + the round-2 verify, but were not re-run.
- No skill code implemented (research-only). Recommendations are deferred to a separate `/speckit:plan` → `/speckit:implement` packet, sequenced Wave A-D in `research/research.md` §5.

<!-- /ANCHOR:limitations -->
