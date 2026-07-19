---
title: "Runtime mirrors"
description: "Measures whether the runtime-specific agent mirrors still reflect the canonical agent body."
trigger_phrases:
  - "runtime mirrors"
  - "scan-integration.cjs"
  - "check mirror parity"
  - "mirror signal matching"
  - "agent mirror drift"
version: 1.17.0.15
---

# Runtime mirrors

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Measures whether the runtime-specific agent mirrors still reflect the canonical agent body.

This feature covers the parity check that keeps integration consistency from depending only on the canonical `.opencode/agents/*.md` file.

---

## 2. HOW IT WORKS

The scanner uses signal matching instead of byte equality. It strips frontmatter from the canonical and mirror files, extracts up to three emphasized lines longer than twenty characters from the canonical body, and marks a mirror `aligned` when at least two of those signals appear in the mirror body. Missing files are marked `missing`, and one-or-zero signal hits are marked `diverged`.

`scan-integration.cjs` checks the canonical file plus the repo-managed runtime mirror via hardcoded templates: `.opencode/agents/{name}.md` (canonical) and `.claude/agents/{name}.md`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/scan-integration.cjs` | Scanner | Defines the mirror templates and the 2-of-3 signal-matching parity check. |
| `.opencode/skills/system-deep-loop/deep-improvement/references/agent-improvement/integration-scanning.md` | Reference | Describes the mirror sync statuses and signal-matching algorithm. |
| `.opencode/skills/system-deep-loop/deep-improvement/references/agent-improvement/mirror-drift-policy.md` | Policy reference | Defines how mirror drift is reviewed after canonical change. |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs` | Scoring consumer | Converts missing or diverged mirrors into the integration score penalty. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-deep-loop/deep-improvement/references/model-benchmark/benchmark-operator-guide.md` | Operator reference | Documents the mirror-score weighting used when benchmark runs include integration data. |
| `.opencode/skills/system-deep-loop/deep-improvement/references/shared/promotion-rules.md` | Safety reference | Treats undocumented mirror drift as a blocker for safe loop expansion. |

---

## 4. SOURCE METADATA

- Group: Integration scanning
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `integration-scanning/runtime-mirrors.md`
Related references:
- [surface-discovery.md](../../feature-catalog/integration-scanning/surface-discovery.md) — Surface discovery
- [command-dispatch.md](../../feature-catalog/integration-scanning/command-dispatch.md) — Command dispatch
