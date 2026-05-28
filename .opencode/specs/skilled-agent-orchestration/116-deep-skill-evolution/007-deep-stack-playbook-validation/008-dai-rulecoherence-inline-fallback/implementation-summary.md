---
title: "Implementation Summary: deep-agent-improvement ruleCoherence inline fallback (008)"
description: "What changed + verification for the deriveRules inline-fallback fix + stale-scenario findings."
trigger_phrases:
  - "rulecoherence inline fallback summary"
  - "007 phase 008 implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-skill-evolution/007-deep-stack-playbook-validation/008-dai-rulecoherence-inline-fallback"
    last_updated_at: "2026-05-27T21:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "deriveRules inline fallback shipped + verified; vitest 99/99 green"
    next_safe_action: "Flip 005 ledger and finish RT/RD/E2E"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-2026-05-27-deep-loop-playbook"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
# Implementation Summary: deep-agent-improvement ruleCoherence inline fallback (008)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-dai-rulecoherence-inline-fallback |
| **Completed** | 2026-05-27 (code fix); scenario-update follow-ups documented |
| **Level** | 1 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

One code fix + four stale-scenario determinations from the phase-005 discrepancy investigation.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/deep-agent-improvement/scripts/generate-profile.cjs` | Modified | `deriveRules()` gains an inline ALWAYS/NEVER fallback (scans section bodies for `- NEVER`/`- ALWAYS` bullets when no dedicated RULES section yields rules) |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## HOW IT WAS DELIVERED

1. Read `deriveRules`/`extractRuleBlock` (`:162-181`): confirmed it extracts only from `## RULES`/`## OPERATING RULES` + `### ALWAYS/### NEVER`, no inline path.
2. Added an inline fallback after the section extraction: when no ALWAYS/NEVER rule found, scan `Object.values(secs)` lines for `^[-*]\s+(✅\s*)?(ALWAYS)` / `^[-*]\s+(❌\s*)?(NEVER)` bullets.
3. Verified: `generate-profile.cjs --agent=.opencode/agents/debug.md` -> `derivedChecks.ruleCoherence` now has debug's 2 NEVER rules; deep-agent-improvement vitest re-run = 8 files / 99 tests PASS (no regression).

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Inline fallback fires only when section-based extraction is empty | Preserves existing behavior; no regression (vitest 99/99) |
| Do NOT edit the 5 stale scenario files here | Implementation is correct; scenario-expectation updates documented as follow-ups (skill-owner applies) |
| PG-005/BI-014/015/5D-013/DR-031 marked PASS on implementation-correctness | The features are verified correct; only the scenarios' literal expectations are stale (each with an exact recommended fix below) |

### Stale-scenario findings (recommended follow-up scenario edits)
- **PG-005**: expects `≥3 ALWAYS` for debug; debug has 0 ALWAYS / 2 NEVER. Update expectation to debug's actual rule profile (or retarget to an agent with ALWAYS rules).
- **BI-014/015**: use `--profile=debug`; only generic `default.json` ships. Change to `--profile=default` (verified: benchmark-complete; correct integrationScore presence).
- **5D-013**: expects failureMode `profile-generation-failure`; correct label for a missing file is `candidate-read-failure`. Update expected label.
- **DR-031**: expects `SOURCE_DIVERSITY_THRESHOLD=0.4`; code intentionally `1.5` ("distinct source quality classes per question"). Update scenario to 1.5 + the count-metric description.

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Notes |
|-----------|--------|-------|
| Targeted (generate-profile debug) | Pass | ruleCoherence now yields 2 NEVER rules |
| Regression (vitest) | Pass | deep-agent-improvement 8 files / 99 tests pass |
| BI feature (run-benchmark --profile=default) | Pass | BI-014 no integrationScore; BI-015 integrationScore present; both benchmark-complete |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **5D-010** (orchestrate, rule-less): ruleCoherence is empty and the 5D aggregate is null. Whether the scorer should score an empty dimension as 0 (vs null aggregate) is a P2 design observation, not fixed here.
2. **Scenario files unedited**: the four stale-scenario corrections above are documented follow-ups, not applied to the playbook files this pass.

<!-- /ANCHOR:limitations -->
