---
title: "Resource Map: evidence-derived inventory for the hermes-proof lineage"
description: "Files cited in iteration 1 of the hermes-proof lineage of the cli-hermes hard-rule research."
contextType: "research"
---

# Resource Map — hermes-proof lineage (evidence-derived)

Emitted from the deltas of this lineage (1 iteration, 3 findings). The packet's
authoritative `resource-map.md` does not exist at the spec folder
(`resource_map_present: false`); this lineage-local map records what this lineage actually
cited.

## Sources consulted (by class)

- **Skill packet — cli-hermes** (`.opencode/skills/cli-external-orchestration/cli-hermes/`):
  `SKILL.md` (frontmatter `hard_rules:` block, lines 6-38; dispatch shape §3, lines
  191-232; the `--query-file` stdin note at line 208);
  `changelog/v1.0.0.0.md` (line 13, the `buildHermesLineageCommand` emission list);
  `README.md` (line 32, runtime ownership).
- **Shared deep-loop runtime**: `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`
  (`buildHermesLineageCommand`, line 2603; executor table, line 2670).
- **Workflow YAML**: `.opencode/commands/deep/assets/deep-research-auto.yaml`
  (state paths, artifact-root override, dispatch PRE-DISPATCH rule, synthesis invariants).
- **Peer lineage for artifact-shape parity**:
  `specs/cli-external-orchestration/071-cli-hermes-creation/001-deep-research/research/lineages/deepseek/`.

## Live commands run

None. The topic is a static-source extraction; no `hermes` dispatch, no repo tooling that
writes.

## Web sources

None.