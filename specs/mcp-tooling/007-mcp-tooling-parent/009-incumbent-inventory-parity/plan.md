---
title: "Implementation Plan: Phase 9: incumbent-inventory-parity"
description: "Derive-and-reorganize plan: read each incumbent packet's own docs plus the live .utcp_config.json, then author the missing inventory elements (catalog, snapshot, pointers, front door, examples) with per-packet version bumps and changelogs, gated by package_skill --strict, bash -n, and a link check."
trigger_phrases:
  - "incumbent inventory parity plan"
  - "feature catalog authoring plan"
  - "install guide promotion plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/007-mcp-tooling-parent/009-incumbent-inventory-parity"
    last_updated_at: "2026-07-16T13:17:05Z"
    last_updated_by: "claude-opus"
    recent_action: "Plan executed to completion; all phases done and gates green"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/mcp-chrome-devtools/feature_catalog/feature_catalog.md"
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
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 9: incumbent-inventory-parity

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation + bash example scripts |
| **Framework** | sk-doc skill-packet conventions (feature catalog, INSTALL_GUIDE, mcp-servers, examples) |
| **Storage** | None (docs only; `.utcp_config.json` read-only) |
| **Testing** | `package_skill.py --check --strict`, `bash -n`, relative-link checker, `validate.sh --strict` |

### Overview
Read-first, derive-only: exhaustively read each packet's SKILL.md, references, playbook, examples, and the live `.utcp_config.json`, then reorganize that existing knowledge into the missing inventory elements. Sibling packets provide the exact structural models (mcp-click-up's catalog, mcp-figma's asset snapshot and mcp-servers pointers, both packets' examples READMEs), so no format is invented either.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented [evidence: spec.md sections 2-3]
- [x] Success criteria measurable [evidence: spec.md SC-001..SC-004, each a command with an expected output]
- [x] Dependencies identified [evidence: spec.md section 6; predecessor phases 004/005 delivered the packets]

### Definition of Done
- [x] All acceptance criteria met [evidence: checklist.md CHK-020, REQ-001..REQ-008 verified]
- [x] Tests passing [evidence: `package_skill.py --check --strict` PASS x3; `bash -n` PASS x2; link check 0 broken over 43 files/151 links]
- [x] Docs updated (spec/plan/tasks) [evidence: this packet's five docs authored at Level 2, validate.sh --strict PASSED]
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation parity by structural mirroring: each new element copies the proven shape of the sibling packet that already has it.

### Key Components
- **chrome feature_catalog/**: root directory doc + snake_case domain dirs + per-feature leaves (mirrors `mcp-click-up/feature_catalog/`); domain taxonomy mirrors the packet's own `manual_testing_playbook/` categories.
- **chrome assets snapshot**: byte-true `jq` extraction of both `chrome_devtools_*` manuals (mirrors `mcp-figma/assets/utcp_figma_manual.md`'s paste-ready-manual pattern, inverted to verify-not-re-add).
- **chrome mcp-servers/**: install pointer (mirrors `mcp-click-up/mcp-servers/clickup-cli/`) + registration pointer (mirrors `mcp-figma/mcp-servers/figma-mcp/`).
- **click-up INSTALL_GUIDE.md**: front door promoted from `references/install_guide.md`, which keeps full content plus a trailing pointer.
- **figma examples/**: README + walkthroughs mirroring playbook scenarios DETECT/CONNECT/DAEMON, INSPECT/EXPORT, and MCP-001.

### Data Flow
Packet docs and live config in; reorganized inventory files out; per-packet SKILL.md section 8 links the new surfaces; version + changelog record the change.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not a fix packet, but the click-up install-guide promotion touches a shared contract (inbound links), so the consumer inventory was run.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `references/install_guide.md` (producer) | Full phase-validation install reference; router INSTALL-intent target | Content preserved; pointer note appended | `rg -n "references/install_guide"` inventory before change |
| Inbound consumers (SKILL.md x3 sites, README.md x2, examples/README.md, mcp-servers READMEs x2, scripts/doctor.sh, references/mcp_tools.md, doctor asset yaml) | Link to or name the reference path | Unchanged; all still resolve to the full guide | Link check 0 broken; doctor yaml outside write authority keeps a working path |
| `INSTALL_GUIDE.md` (new consumer-facing front door) | Condensed install entry | Created; links into the reference | Link check 0 broken |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Read and baseline
- [x] Read all three packets' SKILL.md, references, playbooks, examples, mcp-servers, changelogs [evidence: leaf SOURCE FILES tables cite the exact surfaces]
- [x] Extract live `chrome_devtools_*` entries with `jq` from `.utcp_config.json` [evidence: two entries, both `chrome-devtools-mcp@0.26.0` `--isolated=true`]
- [x] Baseline `package_skill.py --check --strict` on all three packets [evidence: PASS x3; click-up/figma word-count warnings pre-existing at 3110/3285]
- [x] grep inbound links to `references/install_guide.md` before deciding link direction [evidence: 10+ referencing files inventoried in plan FIX ADDENDUM]

### Phase 2: Author inventory elements
- [x] chrome feature_catalog: root + 29 leaves across 7 domains [evidence: 30 files under `feature_catalog/`]
- [x] chrome assets snapshot, byte-true generation via `jq` inside the writer script [evidence: python comparison prints BYTE-TRUE VERIFIED]
- [x] chrome mcp-servers pointer READMEs [evidence: `mcp-servers/bdg-cli/README.md`, `mcp-servers/chrome-devtools-mcp/README.md`]
- [x] click-up INSTALL_GUIDE.md + reference pointer note [evidence: front door created; reference gains 3-line trailing note only]
- [x] figma examples: README + 2 scripts + MCP walkthrough doc [evidence: 4 files under `examples/`, scripts executable]
- [x] Version bumps + changelogs x3 [evidence: chrome `v1.0.10.0.md`, click-up `v1.0.1.0.md`, figma `v1.0.1.0.md`]

### Phase 3: Verification
- [x] `package_skill.py --check --strict` PASS x3 post-change [evidence: Result: PASS for each; no new warnings]
- [x] `bash -n` on both new scripts [evidence: "bash -n PASS both scripts"]
- [x] Relative-link check over all touched/created files [evidence: 43 files, 151 links, 0 broken]
- [x] Spec child: generate-description.js + backfill-graph-metadata.js + `validate.sh --strict --no-recursive` [evidence: PASSED]
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | All three packets | `package_skill.py <packet> --check --strict` |
| Syntax | New bash scripts | `bash -n` |
| Integrity | Byte-parity of snapshot JSON vs live config | python + `jq` comparison |
| Links | All touched/created markdown | regex link extractor + filesystem existence |
| Spec docs | This packet | `validate.sh <child> --strict --no-recursive` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `.utcp_config.json` chrome_devtools entries | Internal | Green | Snapshot asset impossible without them |
| Sibling packet structures (click-up catalog, figma assets/examples) | Internal | Green | No structural model to mirror |
| `package_skill.py` checker | Internal | Green | Gate 6 unverifiable |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any gate regression (package check FAIL, broken links, router INSTALL intent degraded).
- **Procedure**: `git checkout -- .opencode/skills/mcp-tooling/mcp-{chrome-devtools,click-up,figma}` restores all three packets; new files are additive and delete cleanly. The spec child is self-contained.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Reason |
|-------|-----------|--------|
| Phase 2 (author) | Phase 1 (read/baseline) | Derive-only rule: nothing may be written that was not first read from packet docs or live config |
| Phase 3 (verify) | Phase 2 (author) | Gates run against the finished file set |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Work Item | Estimate | Actual |
|-----------|----------|--------|
| chrome feature catalog (30 files) | Large | Largest single item, as predicted |
| chrome assets + mcp-servers | Small | Small |
| click-up front door + link decision | Small | Small; grep inventory decided the direction quickly |
| figma examples | Medium | Medium |
| Spec child docs + gates | Medium | Medium |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

- **Blast radius**: documentation-only; no runtime, no config, no registry mutation. Low.
- **Partial rollback**: each packet's additions are independent; any one packet can be reverted alone without breaking the other two (cross-packet links were not introduced).
- **Contract watch**: the one cross-file contract touched is click-up's install-guide link web; it was preserved rather than migrated, so rollback of the front door alone leaves every pre-existing link exactly as before (minus the appended pointer note, which reverts with the file).
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
