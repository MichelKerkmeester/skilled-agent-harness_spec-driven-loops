---
title: "Feature Specification: v4 changelog late-cycle entries"
description: "Record the cli-jev hub promotion and the cli-orca standalone extraction in the v4.0.0.0 changelog's After This Draft section, correcting the post-draft commit count and the mcp-tooling mode count the old orca bullet carried."
trigger_phrases:
  - "v4 changelog late cycle entries"
  - "cli-jev changelog entry"
  - "cli-orca changelog entry"
  - "after this draft update"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/044-v4-changelog-late-cycle-entries"
    last_updated_at: "2026-09-20T20:30:00Z"
    last_updated_by: "pi"
    recent_action: "Recorded the changelog evidence packet and closed it"
    next_safe_action: "None; the packet is complete"
    blockers: []
    key_files:
      - "../CHANGELOG-v4.0.0.0.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-20-v4-changelog-late-cycle"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: v4 changelog late-cycle entries

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-09-20 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-speckit/033-system-speckit-v4 |
| **Phase** | 44 of 44 |
| **Predecessor** | 043-v4-root-readme |
| **Successor** | None |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`../CHANGELOG-v4.0.0.0.md` was last edited 2026-09-16, and the two late-cycle skill moves that landed 2026-09-20 are absent from it: `cli-jev` becoming its own transport hub, and `mcp-orca-cli` being promoted to the standalone `cli-orca` class-S skill. The existing orca bullet in "After This Draft" ends at "brings `mcp-tooling` to ten modes", a claim the live `mode-registry.json` now contradicts (nine modes), and the section's post-draft commit count reads 231 against a measured 266.

### Purpose
The "After This Draft" section tells the truth again: the orca bullet covers the full add-then-promote arc, a new bullet records the jev hub and its read-only `cli-usage` transport with both re-run playbook verdicts, and the commit count matches `git rev-list --count 1d43dbd38b..HEAD`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite the orca bullet in `../CHANGELOG-v4.0.0.0.md` "After This Draft" to cover the promotion and the nine-mode count
- Add a jev bullet covering the hub promotion, the transport contract, compiled-routing cohort membership and the 22/22 and 3/3 playbook verdicts
- Correct the 231 to the measured 266 in the section intro

### Out of Scope
- The root README's own ten-mode staleness (lines 868 and 1477), recorded as a separate operator item
- Restructuring the changelog's other sections
- Publishing the release

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `../CHANGELOG-v4.0.0.0.md` | Modify | Two After This Draft bullets and the commit count |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement |
|----|-------------|
| REQ-001 | Every commit hash cited in the new text resolves to the subject the sentence claims, via `git log --format` |
| REQ-002 | The 22/22 and 3/3 verdicts match the recorded benchmark reports under the `cli-jev` skill |
| REQ-003 | The mcp-tooling mode count in the orca bullet matches the live `mode-registry.json` |
| REQ-004 | The prose follows the human voice rules: no em dashes, no prose semicolons, no Oxford list commas, no hard blocker words |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `git log` resolves every cited hash to the claimed subject and date
- **SC-002**: `rg "22 PASS|3 PASS"` on the two benchmark reports confirms both verdicts
- **SC-003**: `python3` reading `.skilled/skills/mcp-tooling/mode-registry.json` reports 9 modes
- **SC-004**: The changed lines carry no HVR hard blockers
- **SC-005**: The parent validates under `validate.sh --strict` with this child present
<!-- /ANCHOR:success-criteria -->
