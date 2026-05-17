# Initial Inventory

Captured: 2026-05-05T20:54:00Z

Command:

```bash
grep -rln "sk-code/scripts/\|skill/sk-code/scripts" .opencode/ \
  --include='*.md' --include='*.json' --include='*.yaml' --include='*.toml' \
  --include='*.ts' --include='*.js' --include='*.mjs' --include='*.py' --include='*.sh' 2>/dev/null \
  | grep -v "node_modules" | grep -v "\.git/"
```

Matches:

```text
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/11-feature-catalog-code-references.md
.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/007-session-capturing-pipeline-quality.md
.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/138-module-header-compliance-via-verify-alignment-drift-py.md
.opencode/skills/system-spec-kit/scripts/ops/README.md
.opencode/skills/system-spec-kit/scripts/extractors/README.md
.opencode/skills/system-spec-kit/scripts/loaders/README.md
.opencode/skills/system-spec-kit/SKILL.md
.opencode/skills/system-spec-kit/mcp_server/lib/parsing/README.md
.opencode/skills/sk-code/graph-metadata.json
.opencode/skills/sk-code/references/webflow/deployment/minification_guide.md
.opencode/skills/sk-code/references/webflow/deployment/cdn_deployment.md
.opencode/skills/sk-code/references/opencode/shared/alignment_verification_automation.md
.opencode/skills/sk-code/references/router/resource_loading.md
.opencode/skills/sk-code/README.md
.opencode/skills/sk-code/manual_testing_playbook/01--surface-detection/002-opencode-detection.md
.opencode/skills/sk-code/manual_testing_playbook/manual_testing_playbook.md
.opencode/skills/sk-code/SKILL.md
.opencode/skills/sk-code/assets/universal/checklists/verification_checklist.md
.opencode/skills/sk-code/assets/opencode/checklists/skill_authoring.md
.opencode/specs/skilled-agent-orchestration/070-sk-deep-rename/003-opencode-internals/implementation-summary.md
.opencode/specs/skilled-agent-orchestration/055-cli-skill-removal-sk-code-merger-deprecated/implementation-summary.md
.opencode/specs/skilled-agent-orchestration/069-sk-code-motion-dev-and-playbook/004-deep-review-remediation/implementation-summary.md
.opencode/specs/skilled-agent-orchestration/069-sk-code-motion-dev-and-playbook/005-playbook-cross-cli-execution/implementation-summary.md
.opencode/specs/skilled-agent-orchestration/077-spec-kit-coco-sk-code-research/research/iterations/iteration-009.md
.opencode/specs/skilled-agent-orchestration/077-spec-kit-coco-sk-code-research/research/iterations/iteration-008.md
.opencode/specs/skilled-agent-orchestration/072-sk-code-scripts-relocation/implementation-summary.md
.opencode/specs/skilled-agent-orchestration/072-sk-code-scripts-relocation/tasks.md
.opencode/specs/skilled-agent-orchestration/072-sk-code-scripts-relocation/scratch/initial-inventory.md
.opencode/specs/skilled-agent-orchestration/072-sk-code-scripts-relocation/checklist.md
.opencode/specs/skilled-agent-orchestration/072-sk-code-scripts-relocation/plan.md
.opencode/specs/skilled-agent-orchestration/072-sk-code-scripts-relocation/spec.md
.opencode/specs/skilled-agent-orchestration/072-sk-code-scripts-relocation/decision-record.md
.opencode/specs/skilled-agent-orchestration/054-sk-code-merger/tasks.md
.opencode/specs/skilled-agent-orchestration/054-sk-code-merger/checklist.md
.opencode/specs/skilled-agent-orchestration/054-sk-code-merger/plan.md
.opencode/specs/skilled-agent-orchestration/054-sk-code-merger/spec.md
.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/implementation-summary.md
.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/tasks.md
.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/review/review-report.md
.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/review/iterations/iteration-008-cli-copilot-gpt55-high.md
.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/review/iterations/iteration-002.md
.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/review/iterations/iteration-004.md
.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/review/deep-review-config.json
.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/plan.md
.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/spec.md
.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/resource-map.md
.opencode/specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-03-internal-agent-inventory/research/research.md
```
