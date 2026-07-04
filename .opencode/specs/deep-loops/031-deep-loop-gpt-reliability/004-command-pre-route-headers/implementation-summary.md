---
title: "Implementation Summary: Command Pre-Route Headers"
description: "Route headers now bind research, review, context, and ai-council leaves before they interpret prompt bodies."
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/031-deep-loop-issues-with-gpt-opencode/004-command-pre-route-headers"
    last_updated_at: "2026-06-30T18:37:51Z"
    last_updated_by: "opencode-gpt"
    recent_action: "Implemented additive Resolved route headers for all four deep modes; strict validation passed"
    next_safe_action: "Proceed to phase 004 GPT verification smoke"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-001-003-summary"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Command Pre-Route Headers

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## METADATA

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-command-pre-route-headers |
| **Completed** | 2026-06-30 |
| **Level** | 2 |
| **Actual Effort** | Medium; prompt/YAML edits plus council script propagation and validation |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## WHAT WAS BUILT

Route identity is now explicit at each phase 003 leaf prompt seam. GPT-backed CLI OpenCode receives the route contract before body prose in research and review, context seats receive the contract in both native and one-shot contract text, and ai-council receives the contract through both its round prompt and script-owned dispatch context.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/deep-loop-workflows/deep-research/assets/prompt_pack_iteration.md.tmpl` | Modified | Added research route header to rendered prompt |
| `.opencode/skills/deep-loop-workflows/deep-review/assets/prompt_pack_iteration.md.tmpl` | Modified | Added review route header to rendered prompt |
| `.opencode/commands/deep/assets/deep_research_auto.yaml` | Modified | Prepended research route header for CLI OpenCode positional prompt |
| `.opencode/commands/deep/assets/deep_review_auto.yaml` | Modified | Prepended review route header for CLI OpenCode positional prompt |
| `.opencode/commands/deep/assets/deep_context_auto.yaml` | Modified | Added context route header to per-seat and one-shot contracts |
| `.opencode/skills/deep-loop-workflows/deep-ai-council/assets/prompt_pack_round.md` | Modified | Added ai-council route header before role prose |
| `.opencode/commands/deep/assets/deep_ai-council_auto.yaml` | Modified | Documented route fields in executor config outputs |
| `.opencode/skills/deep-loop-workflows/deep-ai-council/scripts/orchestrate-session.cjs` | Modified | Added default route config propagation |
| `.opencode/skills/deep-loop-workflows/deep-ai-council/scripts/orchestrate-topic.cjs` | Modified | Passed route config into seat dispatch context |
| `.opencode/skills/deep-loop-workflows/deep-ai-council/scripts/tests/orchestrate-topic.vitest.ts` | Modified | Added route context propagation coverage |
| `.opencode/skills/deep-loop-workflows/deep-ai-council/scripts/tests/orchestrate-session.vitest.ts` | Modified | Added route executor-config propagation coverage |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## HOW IT WAS DELIVERED

The implementation followed the research edit map directly and kept every prompt body intact. Verification started at the most specific executable seam, the council scripts, then climbed through syntax checks, package typecheck, static route placement checks, comment hygiene, alignment checks, and phase strict validation.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## KEY DECISIONS

| Decision | Why |
|----------|-----|
| Keep headers additive | Preserves Claude-specific context and adaptive behavior while reducing GPT route inference burden |
| Prepend CLI OpenCode prompts with `printf` before `cat` | `opencode run` has no agent flag, so the positional prompt must carry route identity first |
| Do not add ai-council YAML `if_cli_opencode` | Council dispatch is script-owned; adding a YAML branch would violate the researched seam map |
| Add council route defaults in scripts | Seat dispatch receives the route contract even if the caller omits optional executor-config route fields |
| Keep phase 001 route-proof state wording unchanged | Prompt headers solve pre-routing; route-proof validation remains a separate state-log contract |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## VERIFICATION

| Check | Result |
|-------|--------|
| Focused council Vitest | PASS: 2 files, 8 tests passed |
| Script syntax | PASS: `node --check` passed for modified council scripts |
| Typecheck | PASS: `npm run typecheck` passed in `deep-loop-runtime` |
| Static route check | PASS: `route-header-static-check PASS` |
| Comment hygiene | PASS: `check-comment-hygiene.sh` exited 0 for modified files |
| Alignment drift | PASS: `verify_alignment_drift.py` passed for affected OpenCode roots |
| Strict spec validation | PASS: 0 errors, 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## KNOWN LIMITATIONS

1. **Prompt-contract hardening, not host hard identity**: This phase does not make `subagent_type` agent identity hard at runtime. Phase 005 remains parked unless phase 004 evidence triggers it.
2. **No GPT smoke yet**: Phase 004 owns GPT-backed first-dispatch smoke validation.
3. **Route headers and route-proof records differ intentionally**: Prompt headers use `@ai-council` for the leaf route contract, while existing route-proof state fields remain phase 001 validator fields.
<!-- /ANCHOR:limitations -->
