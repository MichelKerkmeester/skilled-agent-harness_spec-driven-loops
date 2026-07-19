---
title: "Surface discovery"
description: "Discovers the repo surfaces that define an agent beyond its canonical markdown file."
trigger_phrases:
  - "surface discovery"
  - "scan-integration.cjs"
  - "discover agent surfaces"
  - "repo surface inventory"
  - "integration surface scan"
version: 1.17.0.12
---

# Surface discovery

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Discovers the repo surfaces that define an agent beyond its canonical markdown file.

This feature covers the repository scan that feeds integration consistency scoring and gives operators a concrete list of what would drift if the canonical agent changed.

---

## 2. HOW IT WORKS

`scan-integration.cjs` inventories the canonical `.opencode/agents/{name}.md` file, runtime mirrors, improve-command markdown, YAML workflow assets, skill references, global docs, and one skill-advisor lookup. Command markdown is scanned for `@{agent}` dispatch, while YAML is scanned for either `@{agent}` or bare agent-name references.

The discovery map includes the consolidated advisor script at `.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py`, so the skill-advisor surface is registered from its self-contained package location.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/scan-integration.cjs` | Scanner | Walks the repo and collects canonical, mirror, command, YAML, skill, global-doc, and skill-advisor surfaces. |
| `.opencode/skills/system-deep-loop/deep-improvement/references/agent-improvement/integration-scanning.md` | Reference | Documents the intended scan taxonomy and output summary fields. |
| `.opencode/commands/deep/agent-improvement.md` | Command | Uses the integration report as part of loop setup and review. |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs` | Scoring consumer | Converts the scan results into the integration dimension score. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-deep-loop/deep-improvement/references/model-benchmark/evaluator-contract.md` | Contract reference | Locks the scanner into the integration-consistency dimension and its weighted contribution. |
| `.opencode/skills/system-deep-loop/deep-improvement/references/agent-improvement/target-onboarding.md` | Operator reference | Requires the integration scan before new targets enter the loop. |

---

## 4. SOURCE METADATA

- Group: Integration scanning
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `integration-scanning/surface-discovery.md`
Related references:
- [runtime-mirrors.md](../../feature-catalog/integration-scanning/runtime-mirrors.md) — Runtime mirrors
