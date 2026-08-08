---
title: "Research resource map — injection-bloat testing/document alignment"
status: complete
external_resources: 0
local_sources: 9
---

# Resource Map

This detached run used repository-local evidence only. No web, external connector, or memory resource was required; memory context was unavailable and repository sources were used directly.

## Primary contract sources

| ID | Source | Role |
|---|---|---|
| R1 | .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/README.md:30 | Human-readable observed-delivery contract |
| R2 | .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:221-295 | Receipt construction, epoch floor, confirmation |
| R3 | .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:342-475 | Suppression predicate, observation, fail-open relay |
| R4 | .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.test.mjs:297-390 | Byte identity, flag-off, observed receipt |
| R5 | .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.test.mjs:586-647 | Epoch floor and adapter ordering |

## Target documentation sources

| ID | Source | Role |
|---|---|---|
| R6 | .opencode/skills/cli-external-orchestration/feature-catalog/cursor-hooks-and-spec-gate/cursor-hooks-and-spec-gate.md:28-70 | P1 detailed catalog finding |
| R7 | .opencode/skills/cli-external-orchestration/feature-catalog/feature-catalog.md:69-77 | P2 root catalog finding |
| R8 | .opencode/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/manual-testing-playbook.md:444-486 | Host-event and prebind playbook contracts |
| R9 | .opencode/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/hooks/confirmed-non-delivery-documentation.md:15-49 | Authoritative prompt-event non-delivery contract |

## Search coverage

- 41 manual-testing-playbook.md files.
- 1,498 feature-catalog Markdown files.
- Three broad playbook matches.
- Seventeen generic Gate-3/spec-gate catalog matches; two semantically relevant catalog owners.
- Exact old-contract search produced no target hits.

