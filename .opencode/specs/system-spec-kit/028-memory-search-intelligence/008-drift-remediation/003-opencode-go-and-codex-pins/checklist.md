---
title: "Checklist: OpenCode-Go Leftovers and Codex Model Pins"
description: "Verification checklist for remediation phase 3."
trigger_phrases:
  - "028 drift remediation"
  - "checklist: opencode-go leftovers and codex model pins"
  - "drift fix verification"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    last_updated_at: "2026-06-27T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded checklist for phase 3"
    next_safe_action: "Verify each finding"
    blockers: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Checklist: OpenCode-Go Leftovers and Codex Model Pins

<!-- ANCHOR:protocol -->
## Protocol
Mark an item done only after opus re-reads the file and confirms the cited evidence is resolved (or records a false-positive in the ledger).
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [ ] Ledger entries for 003-opencode-go-and-codex-pins loaded
- [ ] Cited files present
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality
- [ ] Edits minimal and scoped to cited drift
- [ ] Comment hygiene respected (no artifact-ids/spec paths in code comments)
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing
- [ ] Affected tests/validators re-run where a finding touches code or a test
<!-- /ANCHOR:testing -->

<!-- ANCHOR:security -->
## Security
- [ ] No secrets or scope-violating changes introduced
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation
- [ ] F021 `.codex/agents/orchestrate.toml` orchestrate agent pinned to gpt-5.4 before cli-codex gpt-5.5 lock
- [ ] F022 `.codex/agents/code.toml` code agent pinned to gpt-5.4 before cli-codex gpt-5.5 lock
- [ ] F023 `.codex/agents/review.toml` review agent pinned to gpt-5.4 before cli-codex gpt-5.5 lock
- [ ] F030 `.opencode/commands/deep/assets/deep_context_presentation.txt` Deep context example references removed opencode-go provider
- [ ] F031 `.opencode/skills/deep-loop-workflows/deep-ai-council/SKILL.md` AI council docs claim OpenCode uses removed opencode-go gateway models
- [ ] F032 `.opencode/skills/deep-loop-workflows/deep-ai-council/references/patterns/seat_diversity_patterns.md` Seat-diversity table lists opencode-go gateway as a cli-opencode model option
- [ ] F033 `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs` Skill benchmark default model is the removed opencode-go/deepseek-v4-pro
- [ ] F034 `.opencode/skills/system-spec-kit/mcp_server/tests/matrix-adapter-opencode.vitest.ts` Matrix adapter test expects removed opencode-go model invocation
- [ ] F047 `.opencode/skills/cli-codex/README.md` Codex runtime agents use gpt-5.4 but cli-codex docs claim only gpt-5.5 is supported
- [ ] F072 `.codex/agents/context.toml` context agent pinned to gpt-5.4 before cli-codex gpt-5.5 lock
- [ ] F073 `.codex/agents/markdown.toml` Markdown Codex agent is pinned to high effort despite documentation tasks being medium
- [ ] F084 `.opencode/skills/sk-prompt-small-model/references/models/mimo-v2.5-pro.md` MiMo model card still recommends removed opencode-go free fallback
- [ ] F085 `.opencode/skills/sk-prompt-small-model/assets/model_profiles.json` Registry still encodes removed opencode-go MiMo free path
- [ ] F099 `.opencode/skills/deep-loop-runtime/tests/unit/executor-config.vitest.ts` executor-config unit test uses retired opencode-go models
- [ ] F107 `.opencode/skills/cli-opencode/changelog/v1.3.15.0.md` Changelog claims manual_testing_playbook still contains opencode-go scenarios that no longer exist
- [ ] F120 `.opencode/skills/cli-codex/SKILL.md` All 13 Codex agents pinned to high reasoning effort despite documented per-role tuning
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization
- [ ] No files created or moved outside the cited targets
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Summary
- [ ] All 16 findings terminal in the ledger
<!-- /ANCHOR:summary -->
