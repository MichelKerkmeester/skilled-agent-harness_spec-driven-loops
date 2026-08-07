---
title: "Feature Specification: Verify the rename end to end and close the packet"
description: "Independent GLM survivor audit, full four-hub gate reproduction, link set-diff against the frozen baseline, and packet documentation."
trigger_phrases:
  - "sk rename verification"
  - "rename closeout audit"
importance_tier: "critical"
contextType: "implementation"
parent: "sk-doc/019-skill-routing-refactor/030-mode-sk-prefix-rename"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: Verify the rename end to end and close the packet

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/019-skill-routing-refactor/030-mode-sk-prefix-rename/008-verification-and-closeout |
| **Level** | 1 |
| **Status** | Complete |
| **Created** | 2026-07-28 |
| **Executors** | GLM 5.2 (cli-devin) read-only audit; orchestrator gates and docs |
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

- sk-prompt PASS 100, sk-design BLOCKED-BY-ROUTE-GOLD 91, sk-code BLOCKED-BY-ROUTE-GOLD 91, sk-doc PASS 98 — all exact reproductions. Links 84/84 with only relocated pre-existing breaks.
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
