---
title: "Resource map — deepseek-v4-flash-cli-runtime-r3"
---

# Resource map

Sources read by this lineage (checked-in source only; dist/node_modules excluded by the invocation contract).

## Command assets (iteration 1)
- .opencode/commands/speckit/complete.md
- .opencode/commands/speckit/resume.md
- .opencode/commands/speckit/save.md
- .opencode/commands/speckit/README.txt
- .opencode/commands/speckit/assets/save-presentation.txt
- .opencode/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts
- .opencode/skills/system-spec-kit/runtime/cli/core/workflow.ts
- .opencode/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs
- .opencode/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts

## Environment reference (iteration 2)
- .opencode/skills/system-spec-kit/runtime/ENV-REFERENCE.md
- .opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh
- .opencode/skills/system-spec-kit/runtime/cli/spec/check-completion.sh
- .opencode/skills/system-spec-kit/runtime/cli/spec/create.sh
- .opencode/skills/system-spec-kit/runtime/cli/rules/check-ac-closure.sh
- .opencode/skills/system-spec-kit/runtime/cli/rules/check-ac-coverage.sh
- .opencode/skills/system-spec-kit/runtime/lib/hooks/completion-evidence-sentinel.cjs
- .opencode/skills/system-spec-kit/runtime/hooks/claude/completion-evidence-stop.cjs
- .opencode/skills/system-spec-kit/runtime/cli/validation/continuity-freshness.ts

## Coverage (iteration 3)
- .opencode/skills/system-spec-kit/runtime/cli/lib/validator-registry.json
- .opencode/skills/system-spec-kit/runtime/cli/package.json
- .opencode/skills/system-spec-kit/runtime/cli/tests/test-validation-system.cjs
- .opencode/skills/system-spec-kit/runtime/cli/tests/test-validation-extended.sh
- .opencode/skills/system-spec-kit/runtime/cli/spec/README.md
- .opencode/skills/system-spec-kit/runtime/cli/tests/ (file-name census)
- .opencode/skills/system-spec-kit/runtime/tests/ (file-name census)
- .opencode/hooks/post-edit-quality/lib/post-edit-router.cjs

## Hook adapters (iteration 4)
- .opencode/skills/system-spec-kit/runtime/hooks/{claude,codex,devin,cursor,pi}/completion-evidence*

## CI (iteration 5)
- .github/workflows/*.yml (15 files, full trigger-block census)
- .github/workflows/spec-kit-check.yml (full read)
