---
title: "Feature Specification: OpenCode-Go Leftovers and Codex Model Pins"
description: "Remediation phase 3 of 6: 16 drift findings (P1 13, P2 3). Each is verified real, fixed by gpt-5.5 high, re-verified by opus."
trigger_phrases:
  - "028 drift remediation"
  - "feature specification: opencode-go leftovers and codex model pins"
  - "drift fix verification"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    last_updated_at: "2026-06-27T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded phase 3 from the remediation ledger"
    next_safe_action: "Triage and fix the 16 findings"
    blockers: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

# Feature Specification: OpenCode-Go Leftovers and Codex Model Pins

<!-- ANCHOR:metadata -->
## 1. METADATA
- Track: 008-drift-remediation, phase 3 of 6
- Findings: 16 (P1 13, P2 3)
- Ledger: ../remediation-ledger.jsonl (phase=003-opencode-go-and-codex-pins)
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
### Problem Statement
The 028 drift audit surfaced 16 evidence-backed findings in this surface area: doc/config/test reality drifted from code.
### Purpose
Verify each against the real file, fix the genuine ones with minimal scoped edits, re-verify, and leave every ledger entry terminal.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE
### In Scope
The 16 findings in REQUIREMENTS.
### Out of Scope
Findings in other phases; adjacent cleanup not cited by a finding.
### Files to Change
- `.codex/agents/orchestrate.toml`
- `.codex/agents/code.toml`
- `.codex/agents/review.toml`
- `.opencode/commands/deep/assets/deep_context_presentation.txt`
- `.opencode/skills/deep-loop-workflows/deep-ai-council/SKILL.md`
- `.opencode/skills/deep-loop-workflows/deep-ai-council/references/patterns/seat_diversity_patterns.md`
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs`
- `.opencode/skills/system-spec-kit/mcp_server/tests/matrix-adapter-opencode.vitest.ts`
- `.opencode/skills/cli-codex/README.md`
- `.codex/agents/context.toml`
- `.codex/agents/markdown.toml`
- `.opencode/skills/sk-prompt-small-model/references/models/mimo-v2.5-pro.md`
- `.opencode/skills/sk-prompt-small-model/assets/model_profiles.json`
- `.opencode/skills/deep-loop-runtime/tests/unit/executor-config.vitest.ts`
- `.opencode/skills/cli-opencode/changelog/v1.3.15.0.md`
- `.opencode/skills/cli-codex/SKILL.md`
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
### Required (complete OR user-approved deferral)
- F021 [P1 misalignment] `.codex/agents/orchestrate.toml:7` orchestrate agent pinned to gpt-5.4 before cli-codex gpt-5.5 lock
- F022 [P1 misalignment] `.codex/agents/code.toml:6` code agent pinned to gpt-5.4 before cli-codex gpt-5.5 lock
- F023 [P1 misalignment] `.codex/agents/review.toml:6` review agent pinned to gpt-5.4 before cli-codex gpt-5.5 lock
- F030 [P1 dead] `.opencode/commands/deep/assets/deep_context_presentation.txt:371` Deep context example references removed opencode-go provider
- F031 [P1 drift] `.opencode/skills/deep-loop-workflows/deep-ai-council/SKILL.md:20` AI council docs claim OpenCode uses removed opencode-go gateway models
- F032 [P1 dead] `.opencode/skills/deep-loop-workflows/deep-ai-council/references/patterns/seat_diversity_patterns.md:64` Seat-diversity table lists opencode-go gateway as a cli-opencode model option
- F033 [P1 dead] `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs:41` Skill benchmark default model is the removed opencode-go/deepseek-v4-pro
- F034 [P1 dead] `.opencode/skills/system-spec-kit/mcp_server/tests/matrix-adapter-opencode.vitest.ts:36` Matrix adapter test expects removed opencode-go model invocation
- F047 [P1 contradiction] `.opencode/skills/cli-codex/README.md:138` Codex runtime agents use gpt-5.4 but cli-codex docs claim only gpt-5.5 is supported
- F072 [P1 misalignment] `.codex/agents/context.toml:6` context agent pinned to gpt-5.4 before cli-codex gpt-5.5 lock
- F073 [P1 misalignment] `.codex/agents/markdown.toml:8` Markdown Codex agent is pinned to high effort despite documentation tasks being medium
- F084 [P1 drift] `.opencode/skills/sk-prompt-small-model/references/models/mimo-v2.5-pro.md:165` MiMo model card still recommends removed opencode-go free fallback
- F085 [P1 drift] `.opencode/skills/sk-prompt-small-model/assets/model_profiles.json:192` Registry still encodes removed opencode-go MiMo free path
- F099 [P2 drift] `.opencode/skills/deep-loop-runtime/tests/unit/executor-config.vitest.ts:169` executor-config unit test uses retired opencode-go models
- F107 [P2 contradiction] `.opencode/skills/cli-opencode/changelog/v1.3.15.0.md:39` Changelog claims manual_testing_playbook still contains opencode-go scenarios that no longer exist
- F120 [P2 misalignment] `.opencode/skills/cli-codex/SKILL.md:268` All 13 Codex agents pinned to high reasoning effort despite documented per-role tuning
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
