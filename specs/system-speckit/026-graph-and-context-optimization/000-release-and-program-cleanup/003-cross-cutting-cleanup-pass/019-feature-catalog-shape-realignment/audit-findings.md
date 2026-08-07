---
title: "Audit Findings: 050 Feature Catalog Shape Realignment"
description: "Before and after catalog drift findings for the feature catalog shape realignment packet."
trigger_phrases:
  - "019-feature-catalog-shape-realignment"
  - "feature catalog shape audit"
  - "sk-doc snippet template alignment"
  - "catalog OVERVIEW canonical"
importance_tier: "important"
contextType: "audit"
---
# Audit Findings: 050 Feature Catalog Shape Realignment

<!-- ANCHOR:overview -->
## 1. OVERVIEW

The audit covered the six real feature catalog roots named in the packet. It excluded sk-doc asset templates because those files are template source material, not per-feature catalog snippets.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:before -->
## 2. BEFORE

| Catalog | Files Audited | Initial Drift | Finding |
|---------|---------------|---------------|---------|
| `.opencode/skills/sk-deep-research/feature_catalog/` | 15 | 0 | Shape conformant |
| `.opencode/skills/sk-deep-review/feature_catalog/` | 20 | 0 shape drift, 19 redundant TOCs | Shape conformant, TOC cleanup needed |
| `.opencode/skills/sk-improve-agent/feature_catalog/` | 13 | 0 | Shape conformant |
| `.opencode/skills/system-spec-kit/feature_catalog/` | 302 | 27 | Additional drift found during full lint |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/feature_catalog/` | 17 | 17 | Full realignment needed |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/feature_catalog/` | 37 | 37 | Full realignment needed |

### System-Spec-Kit Lint Drift

The main `system-spec-kit` catalog had drift not reflected in the intake summary. The common patterns were legacy fourth sections such as `MANUAL PLAYBOOK COVERAGE`, source-evidence sections before `SOURCE FILES`, and short two-section entries for skill graph tools.
<!-- /ANCHOR:before -->

---

<!-- ANCHOR:after -->
## 3. AFTER

| Catalog | Remaining Drift | Outcome |
|---------|-----------------|---------|
| `.opencode/skills/sk-deep-research/feature_catalog/` | 0 | Pass |
| `.opencode/skills/sk-deep-review/feature_catalog/` | 0 | Pass, redundant TOCs removed |
| `.opencode/skills/sk-improve-agent/feature_catalog/` | 0 | Pass |
| `.opencode/skills/system-spec-kit/feature_catalog/` | 0 | Pass |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/feature_catalog/` | 0 | Pass |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/feature_catalog/` | 0 | Pass |

Final six-root shape audit returned no `DRIFT` lines.
<!-- /ANCHOR:after -->

---

<!-- ANCHOR:exemptions -->
## 4. EXEMPTIONS

| Path | Classification | Reason |
|------|----------------|--------|
| `.opencode/skills/sk-doc/assets/documentation/feature_catalog/feature_catalog_snippet_template.md` | Template asset | Source template, not a per-feature catalog snippet |
| `.opencode/skills/sk-doc/assets/documentation/feature_catalog/feature_catalog_template.md` | Template asset | Root catalog template, not a per-feature catalog snippet |
| `manual_testing_playbook/**/[0-9][0-9][0-9]-*.md` references | Stable scenario IDs | Validation artifacts, not packet-history claims |
| `feature-flag-reference/08-audit-phase-020-mapping-note.md` | Published filename | File content was evergreen-cleaned, but the stable filename was not renamed |
<!-- /ANCHOR:exemptions -->
