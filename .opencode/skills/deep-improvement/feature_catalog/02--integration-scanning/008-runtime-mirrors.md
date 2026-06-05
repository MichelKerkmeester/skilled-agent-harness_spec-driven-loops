---
title: "Runtime mirrors"
description: "Measures whether the runtime-specific agent mirrors still reflect the canonical agent body."
trigger_phrases:
  - "runtime mirrors"
  - "scan-integration.cjs"
  - "check mirror parity"
  - "mirror signal matching"
  - "agent mirror drift"
---

# Runtime mirrors

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Measures whether the runtime-specific agent mirrors still reflect the canonical agent body.

This feature covers the parity check that keeps integration consistency from depending only on the canonical `.opencode/agents/*.md` file.

---

## 2. HOW IT WORKS

The scanner uses signal matching instead of byte equality. It strips frontmatter from the canonical and mirror files, extracts up to three emphasized lines longer than twenty characters from the canonical body, and marks a mirror `aligned` when at least two of those signals appear in the mirror body. Missing files are marked `missing`, and one-or-zero signal hits are marked `diverged`.

`scan-integration.cjs` checks the canonical file plus repo-managed runtime mirrors via hardcoded templates: `.opencode/agents/{name}.md` (canonical), `.claude/agents/{name}.md`, and `.codex/agents/{name}.toml`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/deep-improvement/scripts/agent-improvement/scan-integration.cjs` | Scanner | Defines the mirror templates and the 2-of-3 signal-matching parity check. |
| `.opencode/skills/deep-improvement/references/agent-improvement/integration_scanning.md` | Reference | Describes the mirror sync statuses and signal-matching algorithm. |
| `.opencode/skills/deep-improvement/references/agent-improvement/mirror_drift_policy.md` | Policy reference | Defines how mirror drift is reviewed after canonical change. |
| `.opencode/skills/deep-improvement/scripts/agent-improvement/score-candidate.cjs` | Scoring consumer | Converts missing or diverged mirrors into the integration score penalty. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/deep-improvement/references/model-benchmark/benchmark_operator_guide.md` | Operator reference | Documents the mirror-score weighting used when benchmark runs include integration data. |
| `.opencode/skills/deep-improvement/references/shared/promotion_rules.md` | Safety reference | Treats undocumented mirror drift as a blocker for safe loop expansion. |

---

## 4. SOURCE METADATA

- Group: Integration scanning
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `02--integration-scanning/008-runtime-mirrors.md`
Related references:
- [007-surface-discovery.md](007-surface-discovery.md) — Surface discovery
- [009-command-dispatch.md](009-command-dispatch.md) — Command dispatch
