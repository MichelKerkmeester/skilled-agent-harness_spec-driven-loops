---
title: "Tasks: OpenCode-Go Leftovers and Codex Model Pins"
description: "Fix tasks for remediation phase 3."
trigger_phrases:
  - "028 drift remediation"
  - "tasks: opencode-go leftovers and codex model pins"
  - "drift fix verification"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    last_updated_at: "2026-06-27T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded tasks for phase 3"
    next_safe_action: "Work the fix tasks"
    blockers: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

# Tasks: OpenCode-Go Leftovers and Codex Model Pins

<!-- ANCHOR:notation -->
## Task Notation
- [ ] open
- [x] fixed and verified
- [~] false-positive (reason in ledger)
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [ ] Load ledger entries for 003-opencode-go-and-codex-pins
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [ ] F021 fix `.codex/agents/orchestrate.toml` orchestrate agent pinned to gpt-5.4 before cli-codex gpt-5.5 lock
- [ ] F022 fix `.codex/agents/code.toml` code agent pinned to gpt-5.4 before cli-codex gpt-5.5 lock
- [ ] F023 fix `.codex/agents/review.toml` review agent pinned to gpt-5.4 before cli-codex gpt-5.5 lock
- [ ] F030 fix `.opencode/commands/deep/assets/deep_context_presentation.txt` Deep context example references removed opencode-go provider
- [ ] F031 fix `.opencode/skills/deep-loop-workflows/deep-ai-council/SKILL.md` AI council docs claim OpenCode uses removed opencode-go gateway models
- [ ] F032 fix `.opencode/skills/deep-loop-workflows/deep-ai-council/references/patterns/seat_diversity_patterns.md` Seat-diversity table lists opencode-go gateway as a cli-opencode model option
- [ ] F033 fix `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs` Skill benchmark default model is the removed opencode-go/deepseek-v4-pro
- [ ] F034 fix `.opencode/skills/system-spec-kit/mcp_server/tests/matrix-adapter-opencode.vitest.ts` Matrix adapter test expects removed opencode-go model invocation
- [ ] F047 fix `.opencode/skills/cli-codex/README.md` Codex runtime agents use gpt-5.4 but cli-codex docs claim only gpt-5.5 is supported
- [ ] F072 fix `.codex/agents/context.toml` context agent pinned to gpt-5.4 before cli-codex gpt-5.5 lock
- [ ] F073 fix `.codex/agents/markdown.toml` Markdown Codex agent is pinned to high effort despite documentation tasks being medium
- [ ] F084 fix `.opencode/skills/sk-prompt-small-model/references/models/mimo-v2.5-pro.md` MiMo model card still recommends removed opencode-go free fallback
- [ ] F085 fix `.opencode/skills/sk-prompt-small-model/assets/model_profiles.json` Registry still encodes removed opencode-go MiMo free path
- [ ] F099 fix `.opencode/skills/deep-loop-runtime/tests/unit/executor-config.vitest.ts` executor-config unit test uses retired opencode-go models
- [ ] F107 fix `.opencode/skills/cli-opencode/changelog/v1.3.15.0.md` Changelog claims manual_testing_playbook still contains opencode-go scenarios that no longer exist
- [ ] F120 fix `.opencode/skills/cli-codex/SKILL.md` All 13 Codex agents pinned to high reasoning effort despite documented per-role tuning
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] opus re-reads every touched file; evidence resolved; scope respected
- [ ] validate.sh on this phase --strict exit 0
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria
All 16 findings terminal in the ledger.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References
- ../remediation-ledger.jsonl
<!-- /ANCHOR:cross-refs -->
