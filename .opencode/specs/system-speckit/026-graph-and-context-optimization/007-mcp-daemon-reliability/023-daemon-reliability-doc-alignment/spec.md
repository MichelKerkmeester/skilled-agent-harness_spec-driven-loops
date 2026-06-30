---
title: "Feature Specification: Daemon-reliability doc alignment"
description: "The 018-022 daemon-reliability features shipped as code + spec packets but were absent from the operator-facing docs. This packet aligns feature_catalog, manual_testing_playbook, ENV_REFERENCE, READMEs and SKILL docs with them."
trigger_phrases:
  - "daemon reliability doc alignment"
  - "018-022 feature catalog playbook"
  - "ENV_REFERENCE launcher flags"
  - "daemon hardening docs aligned"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/023-daemon-reliability-doc-alignment"
    last_updated_at: "2026-06-07T18:10:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Aligned catalog/playbook/ENV_REFERENCE/READMEs/SKILL with 018-022"
    next_safe_action: "v3.5.0.3 changelog + a fresh sk-code/sk-doc alignment cross-check"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md"
      - ".opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md"
      - ".opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-026-007-023-daemon-reliability-doc-alignment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Were 018-022 documented anywhere operator-facing? -> No (gpt-5.5 audit + grep confirmed 0 doc coverage); this packet adds it."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Daemon-reliability doc alignment

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-07 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The five daemon-reliability features (018 persistent log, 019 reap hardening, 020 code-index reconnecting proxy, 021 orphan-sweep activation, 022 RC-2 re-election) shipped as code + spec packets, but a gpt-5.5 doc-alignment audit plus a grep pre-scan confirmed they were absent from every operator-facing surface: 0 of 8 new env flags in ENV_REFERENCE, no feature_catalog entries, no playbook scenarios, and no README/SKILL mentions.

### Purpose
Bring the operator-facing docs into alignment with 018-022: ENV_REFERENCE flags, feature_catalog entries, playbook scenarios, README lifecycle rows, and a SKILL note, with consistent indexes and counts.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- ENV_REFERENCE: 8 new flag rows (018/019/021/022 families).
- feature_catalog: 5 per-entry files + 5 index `###` sections.
- manual_testing_playbook: 5 scenarios (IDs 422-426) + table rows + file-count bump (386->391) + a 419 cross-reference.
- READMEs (`mcp_server`, `bin`, root, `database`) + `system-spec-kit/SKILL.md` mentions.

### Out of Scope
- Any code change to 018-022 (this is docs only).
- Enabling the default-off 021/022 flags.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/ENV_REFERENCE.md` | Modify | 8 launcher/daemon flag rows |
| `feature_catalog/**` (5 entries + `feature_catalog.md`) | Create/Modify | 5 catalog entries + index sections |
| `manual_testing_playbook/**` (5 scenarios + `manual_testing_playbook.md`) | Create/Modify | 5 scenarios + table rows + count bump + 419 note |
| `mcp_server/README.md`, `bin/README.md`, root `README.md`, `database/README.md`, `SKILL.md` | Modify | Lifecycle rows + flag pointers |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Flags documented | All 8 new env flags appear in ENV_REFERENCE with default + source |
| REQ-002 | Catalog + playbook entries exist | 5 catalog entries + 5 playbook scenarios, both indexed |
| REQ-003 | Counts consistent | Playbook file-count self-check matches reality (391); catalog count prose matches (325) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Links resolve | Repo-wide markdown link check reports 0 broken |
| REQ-005 | Source traceability | Every catalog SOURCE FILES path / symbol / flag is grep-verifiable |
| REQ-006 | No stale contradictions | The 419 scenario references the new 021 fallback; no doc claims mk-code-index lacks reconnect |

### Acceptance Criteria (Given/When/Then)

- **Given** the new flags, **When** grepping ENV_REFERENCE, **Then** all 8 are present.
- **Given** the catalog, **When** listing 14--pipeline-architecture + 16--tooling-and-scripts, **Then** the 5 entries exist + are indexed.
- **Given** the playbook, **When** running its file-count self-check, **Then** it passes at 391.
- **Given** the docs, **When** the link checker runs, **Then** 0 broken.
- **Given** a catalog entry, **When** grepping its SOURCE FILES, **Then** every path/symbol/flag resolves.
- **Given** 419, **When** read, **Then** it points to the new 425 scenario.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 018-022 are discoverable across ENV_REFERENCE, feature_catalog, playbook, and READMEs.
- **SC-002**: Indexes + counts are internally consistent; 0 broken links.
- **SC-003**: `validate.sh --strict` passes for this packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Playbook count drift (concurrent sessions) | Low | Verified count == assertion (391) just before commit |
| Risk | Catalog grep-traceability failure | Low | @markdown agents grep-verified every path/symbol/flag |
| Dependency | The 018-022 packets + the 421 entries (templates) | Low | Already shipped; used as models |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Docs only; no runtime impact.
- **NFR-P02**: N/A.

### Security
- **NFR-S01**: No secrets in docs.
- **NFR-S02**: Flag docs note the default-off/dry-run safety posture for 021/022.

### Reliability
- **NFR-R01**: Operators can discover + tune the reliability knobs from one reference.
- **NFR-R02**: Index/count invariants stay consistent.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- 020 has no env flag: ENV_REFERENCE entry N/A (documented via catalog/playbook instead).
- 16--tooling-and-scripts entries (021) use the same relative-link depth as 14--pipeline-architecture siblings.

### Error Scenarios
- A custom non-`.log` launcher-log path: ENV_REFERENCE notes the `.prev` rotation behavior.

### State Transitions
- 419 -> 425 cross-reference keeps the orphan-cleanup story coherent across the new fallback.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 8 flag rows + 10 entries + indexes + 5 README/SKILL touches |
| Risk | 5/25 | Docs only; index/count invariants verified |
| Research | 8/20 | gpt-5.5 doc-alignment audit + grep verification |
| **Total** | **25/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. Alignment verified (counts match, 0 broken links, grep-traceable).
<!-- /ANCHOR:questions -->
