---
title: "Feature Specification: Phase 9: incumbent-inventory-parity"
description: "The three incumbent mcp-tooling modes (mcp-chrome-devtools, mcp-click-up, mcp-figma) carried uneven inventories: chrome-devtools had no feature catalog, assets snapshot, or mcp-servers pointers; click-up had no top-level install guide; figma had no examples. This phase closes those gaps by reorganizing each packet's own existing documentation."
trigger_phrases:
  - "incumbent inventory parity"
  - "chrome devtools feature catalog"
  - "clickup install guide front door"
  - "figma examples"
  - "mcp tooling parity"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/007-mcp-tooling-parent/009-incumbent-inventory-parity"
    last_updated_at: "2026-07-16T13:17:05Z"
    last_updated_by: "claude-opus"
    recent_action: "Shipped full inventory parity across the three incumbent packets; all gates green"
    next_safe_action: "None; phase complete. Successor is 010-routing-corpus-and-holdouts"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/mcp-chrome-devtools/feature_catalog/feature_catalog.md"
      - ".opencode/skills/mcp-tooling/mcp-chrome-devtools/assets/utcp_chrome_devtools_manuals.md"
      - ".opencode/skills/mcp-tooling/mcp-click-up/INSTALL_GUIDE.md"
      - ".opencode/skills/mcp-tooling/mcp-figma/examples/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "agent-009-incumbent-inventory-parity"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 9: incumbent-inventory-parity

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-16 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 10 |
| **Predecessor** | 008-cutover-and-rollout |
| **Successor** | 010-routing-corpus-and-holdouts |
| **Handoff Criteria** | All three packets pass `package_skill.py --check --strict`; 0 broken relative links; spec child validates `--strict` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the mcp-tooling hub completion: incumbent full-inventory parity.

**Scope Boundary**: Only the three incumbent mode packets (`mcp-chrome-devtools`, `mcp-click-up`, `mcp-figma`) and this spec child. No hub root files, no `.utcp_config.json` mutation, no new-mode packets. Every capability claim traces to each packet's OWN existing docs (SKILL.md, references/, playbook, examples) or the live `.utcp_config.json`; no new tool facts invented.

**Dependencies**:
- Phase 004 (onboard-chrome-devtools) and 005 (foldin-clickup-and-figma) delivered the packets this phase brings to parity.

**Deliverables**:
- mcp-chrome-devtools: `feature_catalog/` (root + 29 leaves, 7 domains), `assets/utcp_chrome_devtools_manuals.md`, `mcp-servers/{bdg-cli,chrome-devtools-mcp}/README.md`, version 1.0.10.0 + changelog.
- mcp-click-up: top-level `INSTALL_GUIDE.md` front door, pointer note in `references/install_guide.md`, version 1.0.1.0 + changelog.
- mcp-figma: `examples/` (README + 2 scripts + 1 MCP walkthrough doc), version 1.0.1.0 + changelog.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The three incumbent mcp-tooling modes carried uneven inventories. mcp-chrome-devtools (the largest gap) had no `feature_catalog/`, no registered-state snapshot of its dual Code Mode manuals, and no `mcp-servers/` pointers, while its siblings carried all three. mcp-click-up buried its only install guide under `references/`, breaking the top-level `INSTALL_GUIDE.md` convention the other packets follow. mcp-figma had no `examples/` directory despite a fully worked manual-testing playbook.

### Purpose
Every incumbent packet exposes the same inventory surface (feature catalog, install front door, assets snapshot where manuals exist, mcp-servers pointers, examples), derived entirely from each packet's own existing documentation.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- mcp-chrome-devtools: feature catalog (root + per-feature leaves mirroring the mcp-click-up structure and the packet's own playbook taxonomy), byte-true `.utcp_config.json` snapshot asset, two mcp-servers README pointers, patch version + changelog.
- mcp-click-up: top-level `INSTALL_GUIDE.md` promoted from `references/install_guide.md` with all inbound links preserved, patch version + changelog.
- mcp-figma: `examples/` with README plus three walkthroughs mirroring playbook scenarios, patch version + changelog.
- This spec child (Level 2 docs, checklist, implementation summary).

### Out of Scope
- Hub root files and `mode-registry.json` - hub wiring is Phase 006/008 territory.
- `.utcp_config.json` - read-only source of truth for the snapshot; never mutated.
- New tool facts - this phase reorganizes existing knowledge only.
- `mcp-aside-devtools`, `mcp-refero`, `mcp-mobbin` - not incumbents in this phase's sense.
- `/doctor` asset manifests referencing click-up's install guide path - outside write authority; existing path keeps working by design.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-tooling/mcp-chrome-devtools/feature_catalog/**` | Create | Root catalog + 29 leaves across 7 domains |
| `.opencode/skills/mcp-tooling/mcp-chrome-devtools/assets/utcp_chrome_devtools_manuals.md` | Create | Byte-true dual-manual snapshot |
| `.opencode/skills/mcp-tooling/mcp-chrome-devtools/mcp-servers/bdg-cli/README.md` | Create | CLI install pointer |
| `.opencode/skills/mcp-tooling/mcp-chrome-devtools/mcp-servers/chrome-devtools-mcp/README.md` | Create | Code Mode server pointer |
| `.opencode/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md` | Modify | Version 1.0.10.0; section 8 inventory links |
| `.opencode/skills/mcp-tooling/mcp-chrome-devtools/changelog/v1.0.10.0.md` | Create | Release notes |
| `.opencode/skills/mcp-tooling/mcp-click-up/INSTALL_GUIDE.md` | Create | Front-door install doc |
| `.opencode/skills/mcp-tooling/mcp-click-up/references/install_guide.md` | Modify | Trailing pointer note only |
| `.opencode/skills/mcp-tooling/mcp-click-up/SKILL.md` | Modify | Version 1.0.1.0; front-door link |
| `.opencode/skills/mcp-tooling/mcp-click-up/changelog/v1.0.1.0.md` | Create | Release notes |
| `.opencode/skills/mcp-tooling/mcp-figma/examples/**` | Create | README + 2 scripts + MCP walkthrough |
| `.opencode/skills/mcp-tooling/mcp-figma/SKILL.md` | Modify | Version 1.0.1.0; examples link |
| `.opencode/skills/mcp-tooling/mcp-figma/changelog/v1.0.1.0.md` | Create | Release notes |
| `.opencode/specs/mcp-tooling/007-mcp-tooling-parent/009-incumbent-inventory-parity/**` | Create/Modify | This packet's Level 2 docs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | chrome-devtools `feature_catalog/` mirrors the mcp-click-up structure and frontmatter, taxonomy from the packet's own playbook dirs | Root `feature_catalog.md` + snake_case domain dirs exist; every leaf carries title/description/trigger_phrases/version frontmatter and OVERVIEW/HOW IT WORKS/SOURCE FILES/SOURCE METADATA sections |
| REQ-002 | `assets/utcp_chrome_devtools_manuals.md` snapshots BOTH `chrome_devtools_1` and `chrome_devtools_2` byte-true from `.utcp_config.json` | Programmatic comparison of each fenced JSON block against `jq` extraction shows zero byte difference; provenance marked verify-not-re-add |
| REQ-003 | chrome-devtools `mcp-servers/` pointers exist with nothing vendored | `bdg-cli/README.md` points at INSTALL_GUIDE install path; `chrome-devtools-mcp/README.md` documents the Code Mode registration |
| REQ-004 | click-up top-level `INSTALL_GUIDE.md` exists and ALL existing inbound links to `references/install_guide.md` keep working | grep-verified inbound link inventory; reference file content preserved with only a trailing pointer note appended |
| REQ-005 | figma `examples/` mirrors playbook scenarios with commands only from the packet's own docs; gated operations marked gated | README + safe-connect/daemon-health + inspect/export + MCP-context walkthroughs; no destructive verb, no yolo patch anywhere in examples/ |
| REQ-006 | All three packets pass `package_skill.py <packet> --check --strict` | Result: PASS printed for each packet |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Each touched packet gets the next patch version and a changelog entry in its own convention | chrome 1.0.9.0 to 1.0.10.0 (`changelog/v1.0.10.0.md`), click-up 1.0.0.0 to 1.0.1.0, figma 1.0.0.0 to 1.0.1.0 |
| REQ-008 | 0 broken relative links across touched/created files; `bash -n` passes on new scripts | Link checker over all touched files reports 0 broken; both figma scripts parse |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `package_skill.py --check --strict` prints PASS for all three packets (same or fewer warnings than the pre-change baseline).
- **SC-002**: The snapshot asset's two JSON blocks are byte-identical to `jq` extraction from `.utcp_config.json`.
- **SC-003**: Every inbound link to `references/install_guide.md` still resolves to the full step-by-step guide it describes.
- **SC-004**: This spec child passes `validate.sh --strict --no-recursive` with 0 errors.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `.utcp_config.json` live state | Snapshot drifts if config changes later | Snapshot is provenance-dated; verify-not-re-add contract says live config wins |
| Risk | Inventing tool facts while filling catalog leaves | Med | Hard rule: every claim traces to the packet's own docs; leaf SOURCE FILES tables name the exact source surface |
| Risk | Breaking click-up router INSTALL intent by hollowing the reference | Med | Reference keeps full content; only a pointer note appended; router RESOURCE_MAP untouched |
| Risk | Duplicated install content drifting between front door and reference | Low | Front door defers the phase-validation ladder to the reference instead of copying it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No runtime behavior change in any packet (documentation-only phase).

### Security
- **NFR-S01**: No credentials, tokens, or daemon secrets appear in any created file (figma daemon token explicitly never printed).

### Reliability
- **NFR-R01**: All created markdown resolves (0 broken relative links) so router discovery and human navigation never dead-end.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Pinned vs floating MCP package: live config pins `chrome-devtools-mcp@0.26.0` while INSTALL_GUIDE shows `@latest`; the snapshot records the pin and states the live config wins.
- Click-up MCP unsupported-tool cards: the catalog and mcp-servers docs already mark those UNSUPPORTED; the new front door does not re-litigate them.

### Error Scenarios
- Snapshot drift: verification command in the asset re-derives the live entries for comparison.
- Figma export path collision: the example script refuses to overwrite and exits 1.

### State Transitions
- Version bumps are single-field frontmatter edits, each paired with a changelog file, so a partial application is visible immediately.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | 44 files across 3 packets + spec child; all documentation |
| Risk | 6/25 | No runtime surface touched; link/contract preservation is the only hazard |
| Research | 10/20 | Full read of 3 packets' SKILL/references/playbooks/examples + live config |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. The click-up link-direction question was resolved during implementation (see implementation-summary.md Key Decisions).
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
