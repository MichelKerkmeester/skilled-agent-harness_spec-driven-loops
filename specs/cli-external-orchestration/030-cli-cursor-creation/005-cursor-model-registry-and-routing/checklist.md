---
title: "Verification Checklist: Cursor model registry and routing"
description: "Verification checklist for the Cursor model registry and routing phase."
trigger_phrases: ["cli-cursor model registry checklist"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/005-cursor-model-registry-and-routing"
    last_updated_at: "2026-07-24T04:16:30Z"
    last_updated_by: "claude-code"
    recent_action: "All 12 checklist items verified 3/3+8/8+1/1"
    next_safe_action: "Write implementation-summary.md, run validate.sh --strict"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-creation-authoring", parent_session_id: null }
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Cursor model registry and routing

All items below are checked — this phase is Complete.

<!-- ANCHOR:protocol -->
## Verification Protocol
| Priority | Handling |
|---|---|
| P0 | Must pass before this phase is Complete |
| P1 | Should pass; document any gap |
| P2 | Nice-to-have; document if skipped |
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## PRE-IMPLEMENTATION
- [x] CHK-001 [P0] Requirements documented in `spec.md`
- [x] CHK-002 [P0] Technical approach defined in `plan.md`
- [x] CHK-003 [P1] Read `references/models/deepseek-v4-pro.md` (`references/models/deepseek-v4-pro.md`, 187 lines) as the structural template — the unbenchmarked-model precedent, chosen over the benchmark-heavy `glm-5.2.md`
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## CODE QUALITY
- [x] CHK-004 [P1] `composer-2.5.md` mirrors `deepseek-v4-pro.md`'s 8-section shape (Overview/Identity/Recommended Framework/Benchmark Evidence/Tuned Template Snippet/Dispatch Gotchas/See Also) — confirmed by side-by-side section-header diff
- [x] CHK-005 [P1] `model-profiles.json` Composer entry (`assets/model-profiles.json`, `id: "composer-2.5"`) carries the same top-level keys as every sibling entry (context_length/tool_calling/chat_template/executors/primary_quota_pool/fallback_target/free_tier/strengths/weaknesses/avg_iter_wall_clock_min/status/recommended_frameworks/capability); JSON validated via `python3 -c "import json; json.load(...)"` → no error
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## TESTING
- [x] CHK-006 [P0] Composer's auth-gated specs are TBD, not fabricated: `grep -n -i "TBD\|unconfirmed" composer-2.5.md` → 4 hits (context window, avg wall-clock, context-window rationale, context budget), all explicit TBD/unconfirmed markers. Live-confirmed instead (not fabricated): model slugs `composer-2.5`/`composer-2.5-fast` via `cursor-agent --list-models` on an authenticated Pro-tier account (2026-07-24), plus a live smoke dispatch (`cursor-agent -p --model composer-2.5 --mode ask`) returning `pong`.
- [x] CHK-007 [P1] `bash check-prompt-quality-card-sync.sh` → `GUARD PASS — tables not inlined, Tier-3 pointer-only, registry complete, all models discoverable` (all 4 checks PASS, `cli-cursor` included)
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## FIX COMPLETENESS
- [x] CHK-008 [P1] All 3 coverage points edited consistently: `cli_cards` array, `cli_skills` array, `CLI_EXECUTOR_HUB_METADATA` dict in `check-prompt-quality-card-sync.sh` — CHECK 1/2/3/4 all PASS for `cli-cursor`, no partially-gated card
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## SECURITY
- [x] CHK-009 [P1] `grep -riE "sk-|api[_-]?key|token.{0,3}=|CURSOR_(API_KEY|AUTH_TOKEN)\s*=" composer-2.5.md assets/model-profiles.json` → 1 hit, pre-existing and unrelated to Composer (`model-profiles.json`'s `deepseek-v4-pro` entry names the env-var `DEEPSEEK_API_KEY`, not a value); zero hits inside the new Composer content itself
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## DOCUMENTATION
- [x] CHK-010 [P1] `composer-2.5.md` §1 states: "the direct analog to a provider's own house model (the same role Cognition's `swe-1.6` plays for `cli-devin`)"; §2 Identity table row "Role in rotation" labels it "Cursor-exclusive coding model"
- [x] CHK-011 [P2] `_index.md` lists Composer (`references/models/_index.md:31`, ACTIVE MODELS table)
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## FILE ORGANIZATION
- [x] CHK-012 [P1] No scratch/temp files created for this phase; `git status --porcelain` shows only the intended phase-005 file set (spec docs + `composer-2.5.md` + `_index.md` + `model-profiles.json` + `check-prompt-quality-card-sync.sh`)
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary
| Category | Total | Verified |
|---|---|---|
| P0 Items | 3 | 3/3 |
| P1 Items | 8 | 8/8 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-07-24 — `check-prompt-quality-card-sync.sh` GUARD PASS; JSON valid; live Composer dispatch confirmed.
<!-- /ANCHOR:summary -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `tasks.md`
