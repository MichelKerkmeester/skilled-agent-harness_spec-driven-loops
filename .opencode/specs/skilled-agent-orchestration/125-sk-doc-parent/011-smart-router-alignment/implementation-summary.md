---
title: "Implementation Summary: Align router-carrying SKILL.md nested smart-routers to the canonical template"
description: "Every router-carrying SKILL.md aligned to the canonical resilient-router template, scaled to need; keyed routers got the full 4 patterns, intent routers got guards + fallback, each GPT edit fresh-Sonnet verified."
trigger_phrases:
  - "smart router alignment summary"
  - "125 sk-doc phase 011 summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/125-sk-doc-parent/011-smart-router-alignment"
    last_updated_at: "2026-07-07T06:49:18.161Z"
    last_updated_by: "claude-opus"
    recent_action: "Committed all four alignment waves; R1 complete"
    next_safe_action: "Parent rollup"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/SKILL.md"
      - ".opencode/skills/sk-prompt-models/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-smart-router-alignment |
| **Completed** | 2026-07-07 |
| **Level** | 1 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

Aligned every router-carrying `SKILL.md` to the canonical resilient-router template, scaled to each skill's real resource shape. Across four dispatch waves, 18 top-level router skills and 3 sk-doc packet routers were classified and treated: keyed-subdirectory routers received the full 4-pattern router; flat intent/registry routers received guarded loading plus a low-confidence `UNKNOWN_FALLBACK` without forcing keyed discovery; already-resilient simple routers were left unchanged with a recorded rationale.

### Files Changed

| Cluster | Skills | Treatment |
|---------|--------|-----------|
| Keyed routers | `sk-prompt-models`, `system-code-graph` | Full 4-pattern router over real `references/<key>/` domains |
| Intent/registry hubs | `sk-code`, `sk-design`, `sk-doc`, `deep-loop-workflows` | Guards + registry existence checks + `UNKNOWN_FALLBACK` |
| Flat-reference routers | `cli-opencode`, `mcp-code-mode`, `mcp-figma`, `mcp-chrome-devtools`, `sk-prompt`, `system-spec-kit`, `deep-loop-runtime`, `mcp-click-up`, `system-skill-advisor` | Relabel to intent routing + `UNKNOWN_FALLBACK`; repoint dead map entries |
| Simple routers (left clean) | `cli-claude-code`, `sk-git` | Already resilient; no change, rationale recorded |
| Packet routers | `create-skill` (keyed, concurrent-aligned), `create-readme`, `create-flowchart` | Keyed router / simple-router resilience rules |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivered in staged GPT-5.5-fast-high waves, each SKILL.md edit independently verified by a fresh Sonnet reviewer against the skill's real on-disk resources before commit — verifiers confirmed keyed-vs-simple judgments, grounded every path, checked scope stayed in the SMART ROUTING section, and validated 0-blocking. Skills whose first pass halted on the repo spec-folder gate were re-dispatched with the gate pre-answered. `mcp-open-design` was dropped mid-phase because a concurrent lane deleted the whole skill. Commits used pathspec scoping to stay 0-leak on the shared branch, with isolated-worktree cherry-pick pushes when origin advanced.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Scale to need, not uniform full router | Only skills routing to keyed `references/<key>/` subdirs earn the 4-pattern router; forcing it on flat routers is cargo-culting |
| Pre-answer Gate-3 in re-dispatches | GPT-5.5-fast halts on the repo doc-gate despite an anti-ask line; pre-answering removed the halt |
| Drop `mcp-open-design` | A concurrent lane deleted the skill; aligning a deleted router is moot |
| Verify every GPT edit with a fresh Sonnet | Router edits are load-bearing; independent grounding check before landing |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Notes |
|-----------|--------|-------|
| Independent verification | Pass | Fresh-Sonnet PASS on every substantive edit; keyed scale justified for `system-code-graph`/`sk-prompt-models` |
| Template conformance | Pass | Aligned sections carry the applicable canonical patterns |
| Document validation | Pass | Every edited SKILL.md validates 0-blocking |
| Scope check | Pass | Diffs confined to the SMART ROUTING section (+ preserved concurrent repoints) |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **mcp-open-design excluded** - The skill was concurrently deleted, so it is not covered.
2. **Concurrent-lane repoints preserved** - Several touched SKILL.md files carried a pre-existing one-line sk-doc repoint; it was preserved and committed alongside the router edit as program-consistent.

<!-- /ANCHOR:limitations -->
