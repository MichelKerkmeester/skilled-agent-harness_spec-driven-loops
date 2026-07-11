---
title: "Markdown link integrity guard"
description: "This scenario validates the markdown link integrity guard. It runs check-markdown-links.cjs and its --self-test, confirms a clean tree exits 0, and confirms an injected broken link makes the guard exit 1 before reverting."
version: 3.6.0.1
---

# Markdown link integrity guard

## 1. OVERVIEW

This scenario validates the markdown link integrity guard. It focuses on running `check-markdown-links.cjs` and its `--self-test`, confirming the guard reports a clean tree, catches a newly broken link, and is not fooled by link syntax shown inside inline code.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm the guard exits 0 on a clean tree, exits 1 when a real markdown link target is missing, and ignores link syntax inside inline code.
- Real user request: `Please validate the markdown link integrity guard against node .opencode/skills/system-spec-kit/scripts/check-markdown-links.cjs and tell me whether the expected signals are present: clean tree exits 0; --self-test passes all cases; an injected broken link makes the guard exit 1 and names the link; inline-code link syntax is not flagged.`
- Prompt: `Validate the markdown link integrity guard against node .opencode/skills/system-spec-kit/scripts/check-markdown-links.cjs and report cited pass/fail evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: clean tree exits 0 with a "0 broken" summary; --self-test exits 0 with all cases passing; an injected broken link produces exit 1 with the offending link named; inline-code link syntax is not flagged
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the clean tree exits 0, --self-test passes, an injected broken link exits 1 and is named, and the injection is reverted leaving the tree clean

---

## 3. TEST EXECUTION

### Prompt

```
Validate the markdown link integrity guard against node .opencode/skills/system-spec-kit/scripts/check-markdown-links.cjs and report cited pass/fail evidence.
```

### Commands

1. `node .opencode/skills/system-spec-kit/scripts/check-markdown-links.cjs` and confirm exit 0 with a "0 broken" summary line
2. `node .opencode/skills/system-spec-kit/scripts/check-markdown-links.cjs --self-test` and confirm exit 0 with all cases passing
3. Append one line to an active scanned doc that links to a target which does not exist on disk (describe it as a relative path with no matching file)
4. Re-run the whole-tree scan and confirm exit 1 with the injected link named in the output
5. Revert the injected line and confirm the scan returns to exit 0

### Expected

clean tree exits 0; --self-test passes all cases; injected broken link produces exit 1 with the link named; reverting restores exit 0

### Evidence

Clean-tree scan command:

```text
$ node .opencode/skills/system-spec-kit/scripts/check-markdown-links.cjs
check-markdown-links: 3515 files, 7862 links checked, 48 broken

Broken markdown links (target resolves under neither the file dir nor repo root):
  .opencode/skills/cli-opencode/assets/prompt_quality_card.md  ](../../sk-prompt/prompt-models/references/models/kimi-k2.6.md)
  .opencode/skills/cli-opencode/assets/prompt_quality_card.md  ](../../sk-prompt/prompt-models/references/models/qwen3.6.md)
  .opencode/skills/cli-opencode/manual_testing_playbook/manual_testing_playbook.md  ](external-dispatch/from-opencode-handback.md)
  .opencode/skills/cli-opencode/manual_testing_playbook/manual_testing_playbook.md  ](integration-patterns/cross-ai-handback-opencode.md)
  .opencode/skills/cli-opencode/manual_testing_playbook/manual_testing_playbook.md  ](external-dispatch/from-opencode-handback.md)
  .opencode/skills/cli-opencode/manual_testing_playbook/manual_testing_playbook.md  ](integration-patterns/cross-ai-handback-opencode.md)
  .opencode/skills/system-deep-loop/removed-context/SKILL.md  ](../sk-doc/create-skill/assets/skill/skill_smart_router.md)
  .opencode/skills/system-deep-loop/deep-research/SKILL.md  ](../sk-doc/create-skill/assets/skill/skill_smart_router.md)
  .opencode/skills/mcp-open-design/references/design_parity_transport.md  ](../../sk-design/references/design-process/real_ui_loop.md)
  .opencode/skills/mcp-open-design/references/design_parity_transport.md  ](../../sk-design/references/design-process/real_ui_loop.md)
  .opencode/skills/sk-code/code-review/manual_testing_playbook/manual_testing_playbook.md  ](cross-cli-orchestration/cli-opencode-and-cli-opencode-handback.md)
  .opencode/skills/sk-design/design-audit/SKILL.md  ](../sk-doc/create-skill/assets/skill/skill_smart_router.md)
  .opencode/skills/sk-design/design-foundations/SKILL.md  ](../sk-doc/create-skill/assets/skill/skill_smart_router.md)
  .opencode/skills/sk-design/design-interface/README.md  ](../sk-code/README.md)
  .opencode/skills/sk-design/design-interface/README.md  ](../mcp-figma/README.md)
  .opencode/skills/sk-design/design-md-generator/SKILL.md  ](../sk-doc/create-skill/assets/skill/skill_smart_router.md)
  .opencode/skills/sk-design/design-motion/SKILL.md  ](../sk-doc/create-skill/assets/skill/skill_smart_router.md)
  .opencode/skills/sk-doc/create-command/assets/command_template.md  ](frontmatter_templates.md)
  .opencode/skills/sk-doc/create-command/assets/command_template.md  ](./frontmatter_templates.md)
  .opencode/skills/sk-doc/create-command/assets/command_template.md  ](./skill/skill_md_template.md)
  .opencode/skills/sk-doc/create-command/assets/command_template.md  ](../references/global/core_standards.md)
  .opencode/skills/sk-doc/create-command/assets/command_template.md  ](../references/global/validation.md)
  .opencode/skills/system-skill-advisor/feature_catalog/feature_catalog.md  ](./hooks-and-plugin/opencode-hook.md)
  .opencode/skills/system-skill-advisor/manual_testing_playbook/manual_testing_playbook.md  ](cli-hooks-and-plugin/opencode-hook-and-wrapper.md)
  .opencode/skills/system-spec-kit/feature_catalog/tooling-and-scripts/cli-matrix-adapter-runners.md  ](opencode-hook-freshness-smoke-check.md)
  .opencode/skills/system-spec-kit/feature_catalog/tooling-and-scripts/spec-folder-literal-naming-create-sh-fallback.md  ](opencode-hook-freshness-smoke-check.md)
  .opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md  ](tooling-and-scripts/opencode-hook-freshness-smoke-check.md)
  .opencode/skills/system-spec-kit/manual_testing_playbook/tooling-and-scripts/orphan-mcp-runtime-lifecycle-guardrails.md  ](../../../../specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/022-orphan-mcp-leak-prevention/implementation-summary.md)
  .opencode/skills/system-spec-kit/manual_testing_playbook/tooling-and-scripts/spec-folder-literal-naming-cli-driven-slug.md  ](../../../../specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/004-literal-spec-folder-names/)
  .opencode/skills/system-spec-kit/manual_testing_playbook/tooling-and-scripts/spec-folder-literal-naming-create-sh-fallback.md  ](../../../../specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/004-literal-spec-folder-names/)
  .opencode/skills/system-spec-kit/manual_testing_playbook/tooling-and-scripts/spec-folder-literal-naming-remediation-rule.md  ](../../../../specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/004-literal-spec-folder-names/)
  .opencode/skills/system-spec-kit/manual_testing_playbook/doctor-commands/doctor-update-G5-confirm-failure-injection.md  ](../../../../specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/009-phase-parent-lean-trio-documentation/004-legacy-phase-parent-migration/scratch/migration-manifest.json)
  .opencode/skills/system-spec-kit/manual_testing_playbook/doctor-commands/doctor-update-G6-concurrent.md  ](../../../../specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/009-phase-parent-lean-trio-documentation/004-legacy-phase-parent-migration/scratch/migration-manifest.json)
  .opencode/skills/system-spec-kit/manual_testing_playbook/doctor-commands/doctor-update-G7-sigint.md  ](../../../../specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/009-phase-parent-lean-trio-documentation/004-legacy-phase-parent-migration/scratch/migration-manifest.json)
  .opencode/skills/system-spec-kit/manual_testing_playbook/doctor-commands/doctor-update-G8-migration-gap.md  ](../../../../specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/009-phase-parent-lean-trio-documentation/004-legacy-phase-parent-migration/scratch/migration-manifest.json)
  .opencode/skills/system-spec-kit/manual_testing_playbook/doctor-commands/doctor-update-G9-dashboard.md  ](../../../../specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/009-phase-parent-lean-trio-documentation/004-legacy-phase-parent-migration/scratch/migration-manifest.json)
  .opencode/skills/system-spec-kit/manual_testing_playbook/doctor-commands/doctor-update-tier-aware-default.md  ](../../../../specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/009-phase-parent-lean-trio-documentation/004-legacy-phase-parent-migration/scratch/migration-manifest.json)
  .opencode/skills/system-spec-kit/manual_testing_playbook/doctor-commands/version-migration-3.3.0.0-to-3.4.1.0.md  ](../../../../specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/009-phase-parent-lean-trio-documentation/004-legacy-phase-parent-migration/scratch/migration-manifest.json)
  .opencode/skills/system-spec-kit/manual_testing_playbook/doctor-commands/version-migration-cleanup-legacy.md  ](../../../../specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/009-phase-parent-lean-trio-documentation/004-legacy-phase-parent-migration/scratch/migration-manifest.json)
  .opencode/skills/system-spec-kit/manual_testing_playbook/doctor-commands/version-migration-no-op.md  ](../../../../specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/009-phase-parent-lean-trio-documentation/004-legacy-phase-parent-migration/scratch/migration-manifest.json)
  .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md  ](../../../specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/009-phase-parent-lean-trio-documentation/004-legacy-phase-parent-migration/scratch/migration-manifest.json)
  .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md  ](../../../specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/009-phase-parent-lean-trio-documentation/004-legacy-phase-parent-migration/scratch/migration-manifest.json)
  .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md  ](../../../specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/009-phase-parent-lean-trio-documentation/004-legacy-phase-parent-migration/scratch/migration-manifest.json)
  .opencode/skills/system-spec-kit/mcp_server/README.md  ](../../../specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/022-orphan-mcp-leak-prevention/implementation-summary.md)
  .opencode/skills/system-spec-kit/mcp_server/database/migrations/README.md  ](../../../../../specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/012-canonical-vector-shard-split/spec.md)
  .opencode/skills/system-spec-kit/mcp_server/database/migrations/README.md  ](../../../../../specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/004-spec-memory-embedder-bake-off/decision-record.md)
  .opencode/skills/system-spec-kit/mcp_server/database/migrations/README.md  ](../../../../../specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/004-spec-memory-embedder-bake-off/decision-record.md)
  .opencode/skills/system-spec-kit/mcp_server/database/vectors/README.md  ](../../../../../specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/)

Fix the link, or — if it is an intentional placeholder/example — add it to the ALLOWLIST in this script.
Observed exit code: 1
```

Self-test command:

```text
$ node .opencode/skills/system-spec-kit/scripts/check-markdown-links.cjs --self-test
PASS  inline-code link ignored  → [] (expect [])
PASS  real link on same line as inline code caught  → [missing.md] (expect [missing.md])
PASS  ref-style def inside inline code ignored  → [] (expect [])
PASS  escaped backticks do NOT hide a real link  → [missing.md] (expect [missing.md])
PASS  variable-length delimiter strips whole span  → [] (expect [])
PASS  plain broken link still caught (control)  → [missing.md] (expect [missing.md])

self-test: all cases passed
Observed exit code: 0
```

Injected line appended to this scenario file, then reverted after the injected scan:

```text
Injected broken link for guard verification: [injected missing target](./definitely-missing-link-target-for-guard-verification.md)
```

Injected scan command:

```text
$ node .opencode/skills/system-spec-kit/scripts/check-markdown-links.cjs
check-markdown-links: 3515 files, 7863 links checked, 49 broken

Broken markdown links (target resolves under neither the file dir nor repo root):
  .opencode/skills/system-spec-kit/manual_testing_playbook/tooling-and-scripts/markdown-link-integrity-guard.md  ](./definitely-missing-link-target-for-guard-verification.md)
  [plus the same pre-existing broken links shown by the clean-tree scan]
Observed exit code: 1
```

Reverted scan command:

```text
$ node .opencode/skills/system-spec-kit/scripts/check-markdown-links.cjs
check-markdown-links: 3515 files, 7862 links checked, 48 broken

Broken markdown links (target resolves under neither the file dir nor repo root):
  [same 48 pre-existing broken links shown by the clean-tree scan]
Observed exit code: 1
```

### Pass / Fail

- **BLOCKED**: The required clean-tree precondition is missing in the current repo state. The initial scan exited 1 with `check-markdown-links: 3515 files, 7862 links checked, 48 broken`, so the scenario cannot satisfy "clean tree exits 0" or "reverting restores exit 0" even though `--self-test` passed and the injected broken link was named.

### Failure Triage

Verify the guard script exists and runs with node; confirm the injected link target truly does not resolve against either the file directory or the repository root; confirm the edited file is under a scanned root and not an excluded path segment

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [tooling-and-scripts/markdown-link-integrity-guard.md](../../feature_catalog/tooling-and-scripts/markdown-link-integrity-guard.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 420
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `tooling-and-scripts/markdown-link-integrity-guard.md`
