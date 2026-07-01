# Resource Map

## Documents

- Root packet: `.opencode/specs/deep-loops/030-agent-loops-improved/spec.md`, `graph-metadata.json`, `description.json`.
- Remediation parent: `009-research-backlog-remediation/spec.md`, `graph-metadata.json`, `description.json`.
- Active remediation children inspected: `009/001`, `009/002`, `009/003`, `009/004`.
- Drift samples inspected: phases `003`, `005`, `007`, `008`.

## Runtime Code

- `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs`.
- `.opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs`.
- `.opencode/skills/deep-loop-runtime/scripts/fanout-salvage.cjs`.
- `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs`.
- `.opencode/skills/deep-loop-runtime/scripts/lib/cli-guards.cjs`.

## Workflow Surfaces

- `.opencode/commands/deep/research.md`.
- `.opencode/commands/deep/assets/deep_research_auto.yaml`.
- `.opencode/commands/deep/assets/deep_review_auto.yaml`.
- `.opencode/skills/deep-loop-workflows/deep-research/SKILL.md`.

## Review And Research Lineages

- `review/lineages/glm/deep-review-findings-registry.json` and `review-report.md`.
- `review/lineages/codex/deep-review-findings-registry.json` and `review-report.md`.
- `review/lineages/native/.deep-review.lock`.

## Tests And Playbooks

- `.opencode/skills/deep-loop-runtime/manual_testing_playbook/09--fanout/fanout-salvage-recovery.md`.
- Pending tests named by `009/002` and `009/003` tasks.

## Coverage Notes

- The phase 009 graph metadata does not yet include all authored child folders.
- The root graph metadata includes phase 009 but still points `last_active_child_id` to null.
