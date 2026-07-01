# Resource Map

| Category | Resources | Findings |
|----------|-----------|----------|
| Packet docs | `spec.md`, phase-parent `spec.md`, child `plan.md`, `tasks.md`, `implementation-summary.md` | Status drift, stale scaffolds, weak evidence |
| Review lineage artifacts | `review/lineages/{codex,glm,native}` | Active findings after claimed remediation, expired native lock, old-path report |
| Workflow YAML | `.opencode/commands/deep/assets/deep_review_auto.yaml`, `deep_research_auto.yaml` | Ephemeral markers, session id drift, research threshold omission |
| Runtime scripts | `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs`, `fanout-merge.cjs`, `cli-guards.cjs` | Timeout cap, prompt framing, merge/retry lineage contracts |
| Tests | `.opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts` and related tests | Missing convergence-threshold/timeout-cap regression coverage |
| Validation | `validate.sh`, `check-level-match.sh`, `check-placeholders.sh`, `spec-doc-health.ts`, `continuity-freshness.ts`, `check-graph-metadata-shape.sh`, `evidence-marker-lint.ts` | Existing gates plus proposed new drift validators |
| Metadata | `graph-metadata.json`, `description.json`, continuity frontmatter | Key-file coverage and status/completion consistency gaps |

## High-Priority Files To Inspect During Remediation

- `.opencode/commands/deep/assets/deep_research_auto.yaml`
- `.opencode/commands/deep/assets/deep_review_auto.yaml`
- `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs`
- `.opencode/specs/deep-loops/030-agent-loops-improved/graph-metadata.json`
- `.opencode/specs/deep-loops/030-agent-loops-improved/008-loop-systems-remediation/graph-metadata.json`
- `.opencode/specs/deep-loops/030-agent-loops-improved/review/lineages/codex/deep-review-findings-registry.json`
- `.opencode/specs/deep-loops/030-agent-loops-improved/review/lineages/glm/deep-review-findings-registry.json`
