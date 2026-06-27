---
title: "Feature Specification: P0 Fixes"
description: "Remediation phase 1 of 6: 6 drift findings (P0 6). Each is verified real, fixed by gpt-5.5 high, re-verified by opus."
trigger_phrases:
  - "028 drift remediation"
  - "feature specification: p0 fixes"
  - "drift fix verification"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    last_updated_at: "2026-06-27T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded phase 1 from the remediation ledger"
    next_safe_action: "Triage and fix the 6 findings"
    blockers: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

# Feature Specification: P0 Fixes

<!-- ANCHOR:metadata -->
## 1. METADATA
- Track: 008-drift-remediation, phase 1 of 6
- Findings: 6 (P0 6)
- Ledger: ../remediation-ledger.jsonl (phase=001-p0-fixes)
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
### Problem Statement
The 028 drift audit surfaced 6 evidence-backed findings in this surface area: doc/config/test reality drifted from code.
### Purpose
Verify each against the real file, fix the genuine ones with minimal scoped edits, re-verify, and leave every ledger entry terminal.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE
### In Scope
The 6 findings in REQUIREMENTS.
### Out of Scope
Findings in other phases; adjacent cleanup not cited by a finding.
### Files to Change
- `.opencode/commands/doctor/_routes.yaml`
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/graph-metadata.json`
- `.opencode/commands/doctor/assets/doctor_causal-graph.yaml`
- `.codex/agents/ai-council.toml`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts`
- `.opencode/skills/deep-loop-runtime/tests/unit/fallback-router.vitest.ts`
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
### P0 - Blockers (MUST complete)
- F001 [P0 contradiction] `.opencode/commands/doctor/_routes.yaml:76-93` /doctor code-graph route declares read-only but advertises mutating operations
- F002 [P0 drift] `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/graph-metadata.json:6-55` Phase parent 005 carries full Level 3 heavy-doc stack + missing migrated flag
- F003 [P0 contradiction] `.opencode/commands/doctor/assets/doctor_causal-graph.yaml:78-89` Causal-graph doctor mutation boundaries invert the canonical DB path
- F004 [P0 misalignment] `.codex/agents/ai-council.toml:6` ai-council agent re-pinned to gpt-5.4 after cli-codex gpt-5.5 lock
- F005 [P0 misalignment] `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:13-17` Fallback router type expects model-level quota_pool that does not exist
- F006 [P0 drift] `.opencode/skills/deep-loop-runtime/tests/unit/fallback-router.vitest.ts:9-14` Fallback router tests exercise stale cli-devin registry
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- Every listed finding terminal in the ledger (fixed+verified or false-positive with reason).
- opus re-read confirms evidence resolved and scope respected.
- validate.sh --strict exit 0 for this phase.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS
- A fix touches more than the cited drift (scope creep) -> opus verifies scope per file.
- A finding is a false positive -> triage before fixing; never fix a phantom.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS
- No behavior regressions; edits are doc/config/test alignment only.
- Comment hygiene: no artifact-ids or spec paths in code comments.
<!-- /ANCHOR:nfr -->

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES
- Same file cited by multiple findings -> batch edits, verify once per file.
- Evidence line numbers shifted since the audit -> verify by content, not line.
<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS
None open; deferrals (if any) are recorded as false-positive with reason in the ledger.
<!-- /ANCHOR:questions -->

<!-- ANCHOR:related-docs -->
## 10. RELATED DOCS
- ../remediation-ledger.jsonl
- ../../research/drift-audit-2026-06-27/converged-report.md
<!-- /ANCHOR:related-docs -->
