---
title: "Plan: mcp-tooling + cli-external Hub Benchmark & Router Improvements"
description: "Make both new hubs and all five children benchmarkable, run both modes, act on the findings with per-child router fixes."
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/054-smart-routing-benchmark-program/015-mcp-cli-hub-benchmark"
    last_updated_at: "2026-07-10T22:30:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Benchmark + fixes delivered; keyword-ceiling finding recorded"
    next_safe_action: "Complete"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Plan: mcp-tooling + cli-external Hub Benchmark & Router Improvements

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY
Enable the Lane C benchmark for the two new hubs + five children (gold + mcp-figma normalization), run both
modes, then act on the finding that per-child routers are keyword-brittle with five Sonnet-authored fixes.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
Each child scores real Type-1 (no NO-SCENARIOS); T1 rows unchanged by every fix; no over-firing; mcp-figma
key-sync green; runtime routing unchanged; validate.sh --strict Errors 0.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
No engine changes. Gold is authored as sk-doc-shape playbook frontmatter (`id`/`expected_intent`/
`expected_resources`) that `load-playbook-scenarios.cjs` reads. mcp-figma's runtime `INTENT_MODEL` is mirrored
by an additive `INTENT_SIGNALS` block (key-sync guarded) so the replay parser can read it without a runtime
change. Router fixes edit each child's `INTENT_SIGNALS` keyword lists (and one file relocation).
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
1. Per-child Type-1 gold + hub Type-2 hardening + mcp-figma normalization; prove the shape on one child, fan out.
2. Full Mode-A matrix + a genuine Mode-B live smoke.
3. Findings → five per-child Sonnet router fixes (keyword broadening blind to holdouts + structural cleanups).
4. Integrity gate (fresh positives + adjacent negatives) + final matrix.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Re-benchmark each child before/after via `run-skill-benchmark.cjs --trace-mode=router`; route fresh probes
through `router-replay.cjs` for the over-firing/generalization gate; mcp-figma key-sync vitest.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
The Lane C harness (unchanged). Both DeepSeek and OpenAI providers configured for Mode-B.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
Delete the new `10--intra-routing-recall/` gold folders and the hub blind-holdout files; revert each child
SKILL.md's `INTENT_SIGNALS` edits and mcp-figma's mirror block; move `install_guide.md` back to root. Gold and
router edits are additive/localized; the harness is untouched.
<!-- /ANCHOR:rollback -->
