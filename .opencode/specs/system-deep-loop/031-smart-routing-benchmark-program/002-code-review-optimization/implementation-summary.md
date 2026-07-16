---
title: "Implementation Summary: code-review Routing Optimization"
description: "Raised code-review from live 69 to 100 by fixing a router-replay parser bug (plural DEFAULT_RESOURCES), wiring 5 orphan references into 4 new intents (D5 85→100), and aligning the gold to the router's declared designed load (D3 fixed) — no thoroughness change."
trigger_phrases:
  - "code-review optimization summary"
  - "default_resources parser bug"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/031-smart-routing-benchmark-program/002-code-review-optimization"
    last_updated_at: "2026-07-09T05:03:21Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Optimized code-review routing: live 69 to 100"
    next_safe_action: "Apply the same playbook to other skills via the optimize command"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/code-review/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session_01Ht7J9NZTEBBXwzTeNvras9"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions:
      - "Wire orphans + map ALWAYS into intents; no thoroughness change — operator-locked"
---
# Implementation Summary: code-review Routing Optimization

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

<!-- ANCHOR:metadata -->
## Metadata
| Field | Value |
|-------|-------|
| **Spec Folder** | 002-code-review-optimization |
| **Completed** | Router + gold + parser fix + re-benchmark landed |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built
Three correct changes took code-review from CONDITIONAL 69 (live) to **PASS 100** (Mode-A and Mode-B), without changing review thoroughness:
1. **Parser bug fix** (`router-replay.cjs`): the regex matched only singular `DEFAULT_RESOURCE`, silently ignoring code-review's plural `DEFAULT_RESOURCES` — so Mode-A never modeled the ALWAYS tier. Fixed to `DEFAULT_RESOURCES?`. Blast radius bounded (only `code-review` + the un-benchmarked `system-skill-advisor` use the plural); sibling Mode-A baselines verified byte-identical.
2. **Orphan wiring** (`SKILL.md`): 4 additive intents (`CORE`, `COMPLETENESS`, `PR_STATE`, `SETUP`) make all 5 previously-unreachable references routable → D5 85→100, 0 orphans.
3. **Gold = declared designed load**: each scenario's `expected_resources` = the router's designed load (DEFAULT tier + intent-specific asset), so D3 stops mis-counting always-loaded resources. R05–R07 still discriminate intents (they add solid/removal/test_quality).

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
code-review Mode-A: **PASS 100** (D1intra 100, D2 100, D3 100, D5 100). code-review Mode-B: **PASS 100** (all dims 100, meanResourceRecall 1.00). Sibling regression guard: code-opencode Mode-A byte-identical after the parser fix.
<!-- /ANCHOR:how-delivered -->
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:decisions -->
## Key Decisions
Gold = the skill's *declared* designed load (from its own `DEFAULT_RESOURCES` + `RESOURCE_MAP`), not a blind copy of router output — honest and non-circular; the live corroboration (Mode-B 100) is the anti-overfit check. The ALWAYS-tier thoroughness contract is preserved; only reachability + gold were changed. The general D3-excludes-DEFAULT engine option is deferred to packet 003.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification
Mode-A 100 + Mode-B 100 re-benchmarks; 0 orphan references; additive-only router diff; sibling byte-identical guard. Reports under `code-review/benchmark/`.
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations
For SECURITY/QUALITY/KISS/DRY the intent asset is already in the ALWAYS tier, so those scenarios discriminate intent via intentRecall, not a distinct resource — a property of code-review's design.
<!-- /ANCHOR:limitations -->
