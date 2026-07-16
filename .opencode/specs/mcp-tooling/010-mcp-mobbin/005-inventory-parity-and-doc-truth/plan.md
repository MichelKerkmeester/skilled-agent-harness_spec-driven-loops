---
title: "Implementation Plan: Phase 5: inventory-parity-and-doc-truth"
description: "Sweep-then-add plan: grep-driven doc-truth flips across the mcp-mobbin packet (registered-state framing, doctor absence flipped to ERR), followed by the parity additions (examples/, install.sh, 3 playbook scenarios, catalog constraints) and the 1.1.0.0 release, gated by package_skill.py --check --strict."
trigger_phrases:
  - "mobbin doc truth plan"
  - "mobbin inventory parity plan"
  - "phase 005 plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/010-mcp-mobbin/005-inventory-parity-and-doc-truth"
    last_updated_at: "2026-07-16T18:00:00Z"
    last_updated_by: "claude"
    recent_action: "Executed all three plan phases; gates green"
    next_safe_action: "Run phase 006 live-verification-capture after operator reconnect + OAuth"
    blockers: []
    key_files:
      - ".opencode/specs/mcp-tooling/010-mcp-mobbin/005-inventory-parity-and-doc-truth/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-005-inventory-parity-and-doc-truth"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: inventory-parity-and-doc-truth

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
| **Language/Stack** | Markdown docs + Bash (doctor.sh, install.sh) |
| **Framework** | sk-doc create-skill packet conventions; system-spec-kit Level 2 |
| **Storage** | None (docs and scripts only; `.utcp_config.json` read-only) |
| **Testing** | `package_skill.py --check --strict`, `bash -n`, live script runs, packet-wide stale-marker grep |

### Overview
Two-stage delivery: first a grep-driven truth sweep (locate every stale registration marker, flip each file to registered-state framing, flip doctor.sh's absence branch to ERR), then the parity additions (examples/, install.sh, three research-grounded playbook scenarios, catalog constraint sections) and the 1.1.0.0 release. The registered manual is verified read-only up front so every flip rests on observed config state, not assumption.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md sections 2-3)
- [x] Success criteria measurable (SC-001 to SC-004; REQ acceptance columns)
- [x] Dependencies identified (registered manual verified; research.md ground truth; sibling parity references)

### Definition of Done
- [x] All acceptance criteria met (REQ-001 to REQ-008 evidence in checklist.md)
- [x] Tests passing (`package_skill.py --check --strict` PASS; `bash -n` clean on both scripts; both scripts run green)
- [x] Docs updated (spec/plan/tasks/checklist/implementation-summary all final)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation truth-sweep plus additive inventory build inside one skill packet; no runtime architecture changes.

### Key Components
- **Truth sweep**: packet-wide marker grep drives per-file flips; historical records (v1.0.0.0 changelog, 1.0.0.0 history row) explicitly excluded
- **State verification**: python JSON parse of `.utcp_config.json` confirms the `mobbin` entry field-for-field before any doc claims it
- **doctor.sh/install.sh pair**: doctor diagnoses (absence = ERR), install verifies posture (presence = OK, OAuth pointer); both read-only
- **Parity additions**: examples/ (3 walkthroughs), playbook scenarios (PLATFORM-001, RATELIMIT-001, PAIDGATE-001), catalog constraint sections

### Data Flow
`.utcp_config.json` (read-only observation) feeds the asset's reference shape and checklist evidence; `references/tool-surface.md` is the single trace target for examples and catalog constraints; the root playbook index mirrors the per-scenario files 9-to-9.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The stale pre-registration claims behave like a class-of-bug across the packet, so the sweep was inventoried, not spot-fixed.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| SKILL.md / README.md / INSTALL_GUIDE.md | Doctrine producers (agents read these first) | Updated to registered-state truth | Packet-wide marker grep clean outside exclusions |
| references/*.md, assets/utcp-mobbin-manual.md | Contract producers | Updated; asset checklist executed doc-side | Grep + field-for-field config match |
| scripts/doctor.sh | Status producer | Absence branch flipped INFO to ERR | `bash -n`; live run shows OK on the registered manual |
| manual_testing_playbook/** | Test consumers of the doctrine | MANUAL-001 renamed/rewritten; index and preconditions flipped; 3 scenarios added | Index count 9 = 9 files |
| feature_catalog/** | Capability consumers | Registered framing + constraint sections | Grep + trace links to tool-surface.md |
| changelog/v1.0.0.0.md, 1.0.0.0 history row | Historical records | Unchanged (deliberate) | Excluded from the grep acceptance |

Required inventories:
- Same-class producers: `rg -n -i 'NOT REGISTERED|later phase|pre-registration|manual absent|not yet registered|unregistered' .opencode/skills/mcp-tooling/mcp-mobbin` (98 marker lines across 15 files at baseline).
- Consumers of the renamed file: `rg -n 'manual_absent_expected' .opencode/skills .opencode/specs` (2 root-playbook references plus the file's own metadata; all updated).
- Matrix axes: file x marker-class; the checklist carries the per-file evidence rows.
- Algorithm invariant: doctor.sh stays read-only and non-interactive in both branches; absence must exit through `err` without any repair path.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Verify state and sweep doc truth
- [x] Parse `.utcp_config.json` read-only; confirm the `mobbin` entry matches the researched shape field-for-field
- [x] Grep the packet for the stale marker set; flip SKILL.md, README.md, INSTALL_GUIDE.md, references, asset, catalog, playbook, mcp-servers pointer
- [x] Flip doctor.sh absence to ERR; execute the asset's 9-item checklist doc-side (3 evidence-marked, 6 SKIP-valid with exact commands)

### Phase 2: Parity additions
- [x] Create examples/ (README + smoke + platform-flow + element-intent), traced to tool-surface.md only
- [x] Create scripts/install.sh (verify-only posture check)
- [x] Rename/rewrite MANUAL-001; add PLATFORM-001, RATELIMIT-001, PAIDGATE-001; update the root index to 9/9
- [x] Enrich the 4 catalog leaves with recipes + cross-cutting constraints

### Phase 3: Release and verification
- [x] Bump versions to 1.1.0.0; author changelog/v1.1.0.0.md
- [x] Run `bash -n` + live runs on both scripts; re-run the marker grep; run `package_skill.py --check --strict`
- [x] Author this phase's spec docs and validate the folder strict
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static | Both shell scripts | `bash -n` |
| Runtime | doctor.sh and install.sh against the real repo | Direct `bash` runs (read-only; exit codes checked) |
| Structural | Whole packet | `package_skill.py --check --strict` |
| Content | Stale-marker regression | Packet-wide `rg -i` sweep with documented exclusions |
| Consistency | Playbook index vs files; renamed-file references | `rg` counts (9 IDs = 9 files; 0 dangling `manual_absent_expected` links) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Registered `mobbin` manual in `.utcp_config.json` | Internal (operator-applied) | Green (verified field-for-field) | The entire doc flip would be false; phase cannot run |
| `../001-research/research/research.md` | Internal | Green | Tool-surface claims in new content would lack ground truth |
| `package_skill.py` gate | Internal tooling | Green | No structural verification of the packet |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The `mobbin` manual is removed from `.utcp_config.json` (registration reverted), or the strict gate regresses.
- **Procedure**: The packet tree is untracked-new (never committed), so rollback means restoring the 1.0.0.0 content: delete the parity additions (examples/, scripts/install.sh, limits-access/, read-only/platform-filter.md, changelog/v1.1.0.0.md), rename manual-registered-expected.md back, and revert the in-place doc flips from this phase's Files-to-Change record. If only the registration reverts, doctor.sh already reports it as ERR by design - escalate to the operator instead of rolling docs back.
<!-- /ANCHOR:rollback -->
