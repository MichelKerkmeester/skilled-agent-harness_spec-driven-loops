---
title: "Feature Specification: Flag Enum Authority"
description: "The cli-devin flag glossary reproduced the incomplete enum that devin --help prints, so an audit cross-checking the skill's own usage against its own reference concluded that correct, binary-verified values were fabricated."
trigger_phrases:
  - "flag enum authority"
  - "permission mode not in help"
  - "cli help under-reports enum"
  - "flag value probe"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/058-flag-enum-authority"
    last_updated_at: "2026-08-30T11:05:00Z"
    last_updated_by: "claude-code"
    recent_action: "Audited eight static DV-* scenarios against devin 3000.6.7"
    next_safe_action: "Decide whether the twelve behavioural DV-* scenarios warrant a dispatch-based follow-up packet"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/SKILL.md"
      - ".opencode/skills/cli-external-orchestration/cli-devin/SKILL.md"
      - ".opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-30-flag-enum-authority"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The skill's permission-mode values were correct all along; the reference table was the defect"
      - "DV-016 re-targeted at the agent mirror tree rather than retired: SYNC.md scopes the strict-YAML constraint to any mirrored file, and the agent tree is the surviving one"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Flag Enum Authority

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-30 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | N/A |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | An agent reading the skill cannot conclude a documented flag value is fabricated because help omits it |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`devin --help` prints four `--permission-mode` values. The binary accepts eight. `cli-reference.md`, the skill's self-described single-source reference, listed only the four from help — while the skill's dispatch examples and manual-testing playbook correctly used `normal`, `bypass` and `autonomous`, which help omits.

An audit that cross-checked skill usage against the skill's own reference therefore found 25 occurrences of "invalid" values across 17 files, concluded the skill had Claude's vocabulary leaked into it, and proposed correcting them. Every one of those values was right. The proposed fix would have replaced binary-verified values with a strictly smaller set, and the evidence disproving it was two directories away in a playbook that already recorded the binary's own canonical list.

### Purpose

Make the authoritative enum reachable where an agent actually looks, and give it a cheap way to check rather than infer.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Correct the `--permission-mode` row in the cli-devin flag glossary to the full verified enum with aliases
- Publish a session-free probe recipe for checking any flag value against the installed binary
- Surface the rule at dispatch time in the cli-devin gotchas, where a dispatching agent reads
- Add the generalized rule to the parent hub so it covers all six CLIs
- Mark the stale `DV-004` scenario, whose recorded finding has inverted

### Out of Scope
- Re-running the twelve behavioural `DV-*` scenarios — they require real billable dispatches, which this packet deliberately avoids. The eight statically-checkable scenarios WERE audited (see requirements below)
- Changing any permission-mode value in dispatch examples — they were correct
- The `cli-reference.md` version stamp, still `3000.2.17`; only the enum row was re-verified, so bumping the whole document would overclaim

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md` | Modify | Full enum with aliases; probe recipe |
| `.opencode/skills/cli-external-orchestration/cli-devin/SKILL.md` | Modify | Dispatch-time gotcha |
| `.opencode/skills/cli-external-orchestration/SKILL.md` | Modify | Cross-CLI rule in §4 ALWAYS |
| `.opencode/skills/cli-external-orchestration/cli-devin/manual-testing-playbook/cli-invocation/smart-permission-doc-runtime-mismatch.md` | Modify | Staleness banner |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The flag glossary states the full accepted enum with aliases | The row names all five canonical values and both alias groups |
| REQ-002 | The reference carries a probe that verifies a value without spending a session | The recipe is runnable and its exit-code semantics are stated |
| REQ-003 | The rule is visible at dispatch time, not only in a reference | A gotcha appears in the cli-devin routing-time list |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The rule generalizes to every CLI in the hub | A rule in the parent hub's ALWAYS list, phrased CLI-agnostically |
| REQ-005 | A stale recorded finding cannot mislead in the opposite direction | `DV-004` carries a banner naming the version and the inversion |
| REQ-006 | Every statically-checkable recorded result is re-verified against the installed binary | Eight scenarios probed; each classified holds / superseded / inverted / obsolete, with the index annotated and no recorded row rewritten |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: An agent auditing permission-mode values finds the full enum and the probe before reaching a wrong conclusion
- **SC-002**: The same reasoning applied to any other CLI in the hub hits the parent-hub rule first
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The published enum itself goes stale on the next CLI upgrade | Med | Both the gotcha and the reference tell the reader to re-probe rather than trust the line, and name the version verified |
| Risk | The probe relies on argument-parse ordering | Low | Verified discriminating: `plan` and `manual` reject at exit 2 while all eight valid values reach exit 1 |
| Dependency | Installed `devin` binary | Low | Probe degrades to unavailable, not to a wrong answer |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- The twelve behavioural `DV-*` scenarios (`DV-001`, `005`-`011`, `013`, `015`, `017`, `019`) remain unaudited because verifying them costs real dispatches. Worth a follow-up packet, or is the static audit plus the staleness banners sufficient coverage?
<!-- /ANCHOR:questions -->

---
