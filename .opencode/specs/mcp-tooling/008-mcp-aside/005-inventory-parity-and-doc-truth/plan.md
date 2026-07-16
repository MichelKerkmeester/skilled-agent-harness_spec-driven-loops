---
title: "Implementation Plan: Phase 5: inventory-parity-and-doc-truth"
description: "Grep-driven doc-truth flips to registered state across the mcp-aside-devtools packet, exemplar-mirrored feature_catalog/ and assets/ additions, doctor error-posture change, and a version bump gated by package_skill and validate.sh."
trigger_phrases:
  - "aside parity plan"
  - "aside doc truth plan"
  - "registered state flip plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/008-mcp-aside/005-inventory-parity-and-doc-truth"
    last_updated_at: "2026-07-16T13:16:00Z"
    last_updated_by: "claude-agent"
    recent_action: "Authored plan for registered-state flips and inventory additions"
    next_safe_action: "Run validate.sh --strict on this folder"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/mcp-aside-devtools/scripts/doctor.sh"
      - ".opencode/skills/mcp-tooling/mcp-aside-devtools/changelog/v1.1.0.0.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "agent-005-inventory-parity"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: inventory-parity-and-doc-truth

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation, Bash (doctor.sh) |
| **Framework** | sk-doc skill packet conventions; system-spec-kit templates |
| **Storage** | None (filesystem docs only) |
| **Testing** | `package_skill.py --check --strict`, `bash -n`, `validate.sh --strict`, programmatic byte comparison |

### Overview
Flip every stale registration claim in `mcp-aside-devtools` to registered-state truth using a grep-driven inventory of the markers, add the `feature_catalog/` and `assets/` structures by mirroring the `mcp-mobbin` exemplar, harden `doctor.sh` so manual absence is an error, and close with the packet gate plus spec validation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (packet gate, bash -n, byte comparison, validate.sh)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation packet conformance: exemplar-mirrored structure (sibling parity) with grep-verified claim consistency.

### Key Components
- **Doc-truth flip set**: 9 modified files whose registration claims flip from later-phase to registered state
- **feature_catalog/**: root directory page plus one leaf per router intent (task, repl, mcp, install, troubleshoot), mirroring `mcp-mobbin/feature_catalog/`
- **assets/utcp-aside-manual.md**: byte-true snapshot of the registered manual, mirroring `mcp-mobbin/assets/utcp-mobbin-manual.md` adjusted to registered state
- **doctor.sh error posture**: manual absence in an existing `.utcp_config.json` reports err and exits 1; healthy path still exits 0

### Data Flow
Ground truth flows from `.utcp_config.json` (live registered entry) into the asset snapshot (verified byte-true), which the packet docs and doctor reference; capability claims flow from packet references, examples, playbook scenarios, and research.md into the feature catalog.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Packet prose (SKILL/README/INSTALL_GUIDE/references/servers/playbook) | Carried later-phase registration claims | update | Grep for stale markers returns zero hits outside v1.0.0.0 changelog |
| `scripts/doctor.sh` | Treated manual absence as expected info | update | `bash -n` clean; err+exit 1 branch on absence; ok path unchanged |
| `changelog/v1.0.0.0.md` | Historical release record mentioning the later phase | unchanged | Release records are immutable; excluded from the flip inventory |
| `.utcp_config.json` | Holds the registered `aside` entry | not a consumer (read-only ground truth) | Byte comparison of asset snapshot against `jq` select output |
| Sibling packets / hub files | Reference this packet only indirectly | not a consumer | Outside write authority; no edits made |

Required inventories:
- Same-class producers: `rg -n -i "not registered|later phase|not yet registered|manual absent" .opencode/skills/mcp-tooling/mcp-aside-devtools`
- Consumers of changed symbols: `rg -n "doctor.sh|utcp_aside_manual" .opencode/skills/mcp-tooling/mcp-aside-devtools --glob '*.md'`
- Matrix axes: file kind (prose doc, playbook scenario, shell script) crossed with claim kind (registration status, gating, error posture); all rows enumerated in tasks.md
- Algorithm invariant: doctor stays read-only (no writes, no installs, no updates) across both the healthy and error branches
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Grep inventory of every stale registration marker across the packet
- [x] Read exemplars: `mcp-mobbin/feature_catalog/` and `mcp-mobbin/assets/utcp-mobbin-manual.md`
- [x] Capture the live `aside` entry bytes from `.utcp_config.json`

### Phase 2: Core Implementation
- [x] Flip doc-truth claims in the 9 affected files, ungate ASD-011
- [x] Change doctor.sh manual-absence posture from info to err with exit 1
- [x] Create feature_catalog/ (root + 5 intent domains) and assets/utcp-aside-manual.md
- [x] Consistency pass: SKILL.md routing and references, README related documents, INSTALL_GUIDE checklist; bump to 1.1.0.0; add changelog

### Phase 3: Verification
- [x] `bash -n doctor.sh` and residual-marker grep both clean
- [x] Programmatic byte-true check of the asset snapshot
- [x] `package_skill.py --check --strict` PASS; metadata backfill; `validate.sh --strict` PASSED
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static | doctor.sh syntax; packet structure and links | `bash -n`, `package_skill.py --check --strict` |
| Integration | Asset snapshot vs live config | python3 json comparison against `jq` select semantics |
| Manual | Residual stale-marker sweep | `rg -n -i` across the packet |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Registered `aside` entry in `.utcp_config.json` | Internal | Green | Whole phase premise fails; docs would stay draft-state |
| `mcp-mobbin` exemplar files | Internal | Green | Parity target undefined; structure would be improvised |
| system-spec-kit templates and validators | Internal | Green | Spec child could not be authored or validated |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Packet gate regression, or the registration is deliberately reverted from `.utcp_config.json`
- **Procedure**: `git checkout` the packet directory to the prior commit (all changes are additive docs plus one script hunk; no data migration). If registration alone regresses, doctor now surfaces it as an error and the asset documents the restore path.
<!-- /ANCHOR:rollback -->
