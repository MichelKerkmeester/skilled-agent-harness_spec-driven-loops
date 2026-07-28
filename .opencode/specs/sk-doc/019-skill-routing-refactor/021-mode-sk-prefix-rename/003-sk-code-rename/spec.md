---
title: "Feature Specification: Rename the sk-code mode packets to the sk- prefix"
description: "Move code-quality, code-review, code-webflow and code-opencode to sk-code-* names, fix the benchmark engine prefixes that hardcoded the old names, and hold BLOCKED-BY-ROUTE-GOLD 91."
trigger_phrases:
  - "sk-code mode rename"
  - "sk-code-opencode rename"
importance_tier: "critical"
contextType: "implementation"
parent: "sk-doc/019-skill-routing-refactor/021-mode-sk-prefix-rename"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: Rename the sk-code mode packets to the sk- prefix

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/019-skill-routing-refactor/021-mode-sk-prefix-rename/003-sk-code-rename |
| **Level** | 1 |
| **Status** | Complete |
| **Created** | 2026-07-28 |
| **Executors** | GLM 5.2 (cli-devin) edit pass after orchestrator moves; orchestrator fixed engine and hooks |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The mode packets of the four sk- hubs carried names that do not state their owning hub, so routing
keys, paths and prose refer to them ambiguously. This phase applies the frozen rename map to its
slice of that surface while proving, with the pre-captured Lane C baseline, that routing behavior
did not change.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The renames and consumer updates described in the implementation summary, per the frozen map in `../assets/rename-map.json` and the contract in `../002-rename-contract-and-map/contract.md`.

### Out of Scope
- Benchmark report archives, changelogs, spec research logs and scorer caches (historical record).
- Any behavior change: pre-existing verdicts, including BLOCKED states, are held constant.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Directories and workflowMode keys carry the sk- prefix | Frozen map rows applied 1:1 |
| REQ-002 | Routing behavior is unchanged | Lane C reproduces the pre-rename verdict and aggregate exactly |
| REQ-003 | The broken-link set is unchanged | Set-diff against the 84-entry baseline shows relocations only |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Lane C reproduced BLOCKED-BY-ROUTE-GOLD 91 exactly after the engine fixes (regression chain 91-76-77-90-91 fully traced). Plugin tests 38+15 pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Mitigation |
|------|------------|
| A missed consumer surfaces later as a silent routing break | Independent survivor audit plus exact gate reproduction before closeout |

**Dependencies:** the frozen map and contract in phase 002, and the pre-captured Lane C baselines.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. Falsified assumptions were folded back into the contract as section 8 amendments.
<!-- /ANCHOR:questions -->
