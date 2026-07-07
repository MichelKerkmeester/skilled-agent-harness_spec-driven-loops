---
title: "Implementation Summary: sk-code two-axis restructure"
description: "Shipped the 148-rename restructure into webflow, opencode, and animation surface packets plus the code-review to review fold, two-axis registry/router wiring, path normalization, and rename-affected contract repoints."
trigger_phrases:
  - "sk-code two-axis restructure summary"
  - "surface packets shipped"
  - "review rename shipped"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/124-sk-code-parent/013-sk-code-two-axis-restructure"
    last_updated_at: "2026-07-05T10:12:37.615Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Backfilled Level 2 completion doc"
    next_safe_action: "Use as phase record; phase 014 owns deferred close-out"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/mode-registry.json"
      - ".opencode/skills/sk-code/hub-router.json"
      - ".opencode/skills/sk-code/webflow/SKILL.md"
      - ".opencode/skills/sk-code/opencode/SKILL.md"
      - ".opencode/skills/sk-code/animation/SKILL.md"
      - ".opencode/skills/sk-code/review/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-013-doc-backfill"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - question: "Did the phase ship?"
        answer: "Yes, remote commit 90e8833411 shipped the combined restructure."
      - question: "What remains outside this phase?"
        answer: "Phase 014 owns gated reindex, Lane-C re-baseline, worktree decision, and parent roll-up."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 013-sk-code-two-axis-restructure |
| **Completed** | 2026-07-05 |
| **Level** | 2 |
| **Actual Effort** | Large mechanical restructure: 200 files, 148 renames |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

Shipped sk-code as a two-axis parent hub in remote commit `90e8833411`. Workflow modes now stay focused on action contracts, while Webflow, OpenCode, and animation evidence live in read-only surface packets that the router can bundle with the selected workflow.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-code/webflow/` | Created from moved directories | Read-only Webflow evidence packet |
| `.opencode/skills/sk-code/opencode/` | Created from moved directories | Read-only OpenCode system-code evidence packet |
| `.opencode/skills/sk-code/animation/` | Created from moved directories | Read-only Motion.dev evidence packet |
| `.opencode/skills/sk-code/review/` | Renamed | Folded `code-review` into the review workflow |
| `.opencode/skills/sk-code/mode-registry.json` | Updated | Added `packetKind`, surface entries, aliases, and `extensions.surface-axis` |
| `.opencode/skills/sk-code/hub-router.json` | Updated | Added surface router signals, vocabulary ownership, `surfaceBundle`, and tie-breaks |
| `.opencode/skills/sk-code/shared/references/smart_routing.md` | Updated | Normalized paths to hub-root-relative packet-qualified form |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs` | Updated | Added surface prefixes, surface layout detection, asset deferral, and language-slice matching |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work landed as one combined remote commit, `90e8833411`, covering 200 files and 148 renames. The commit intentionally combined the move, wiring, content, and rename repoints so the pushed state never exposed a half-moved router or a half-renamed review workflow.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Use a two-axis parent hub | Workflow modes should act; surface packets should provide read-only evidence without becoming standalone workflow modes |
| Move whole directories into surface packets | Whole-directory moves preserved internal sibling links and reduced manual rewrite risk |
| Fold `code-review` into `review` in the same commit | Keeping the rename with the restructure avoided a split live contract across agents, CI, templates, and scripts |
| Push one combined commit | A single green remote state avoided exposing broken intermediate router or rename states |
| Defer reindex and Lane-C re-baseline to phase 014 | Those tasks are add-only close-out work and were unsafe or stale against the active daemon/branch conditions |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Coverage | Notes |
|-----------|--------|----------|-------|
| Parent skill check | Pass | sk-code parent hub | Default mode exit 0 |
| Parent skill check strict | Pass | sk-code strict gaps | `PARENT_HUB_CHECK_STRICT=1` exit 0, 23 PASS, 0 WARN/FAIL |
| Vocab and router sync vitests | Pass | Registry/router vocabulary and prose sync | 9/9 tests passed |
| Link integrity | Pass | Moved sk-code tree | 298 move-broken relative links repaired; 0 broken sk-code links after repair |
| Dead-path sweep | Pass | sk-code stale references | 0 live stale references reported |
| Rule-copy checks | Pass | Review rename consumers | `check-rule-copies.js` exit 0 and its test passed 3/3 |
| Router replay | Pass | Two-axis bundle | `review my webflow animation` resolved `[review, webflow, animation]` with `missingResources: 0` |

### Test Coverage Summary

| File | Statements | Branches | Functions |
|------|------------|----------|-----------|
| Phase 013 restructure | Covered by deterministic gates | Covered by router/vocab sync and replay | Covered by parent-skill-check and rule-copy tests |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR ID | Target | Actual | Status |
|--------|--------|--------|--------|
| NFR-P01 | Router replay resolves without missing resources | `missingResources: 0` for `review my webflow animation` | Pass |
| NFR-S01 | Surface packets remain read-only evidence | Surface SKILL files use read-only evidence-packet contracts with Read/Bash/Grep/Glob surfaces | Pass |
| NFR-R01 | Deterministic gates prove reliable restructure | Parent checks, sync tests, link integrity, rule-copy checks, and router replay all passed | Pass |

<!-- /ANCHOR:nfr-verify -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. Canonical memory and skill-graph reindexing are not part of this phase and remain assigned to phase 014.
2. Lane-C fresh baseline and playbook gold re-derivation are not part of this phase and remain assigned to phase 014.

<!-- /ANCHOR:limitations -->
---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Separate move, wiring, and content commits | One combined remote commit `90e8833411` | The push gate required a green remote state with no broken intermediate layout |
| Include reindex and Lane-C baseline in close-out | Deferred to phase 014 | Advisor daemon and stored gold state made those add-only tasks unsafe for this phase |

<!-- /ANCHOR:deviations -->
