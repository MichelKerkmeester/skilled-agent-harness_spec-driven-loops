---
title: "Feature Specification: Auto re-mint a hub routing manifest at commit time"
description: "Editing any SKILL.md under a parent hub silently stales that hub's compiled routing manifest, and nothing says so until a push is refused. The pre-commit hook now re-mints the affected hub and stages the result, so the manifest ships in the same commit as the edit that invalidated it."
trigger_phrases:
  - "routing manifest auto remint"
  - "stale manifest pre-commit"
  - "compiled routing gate blocks push"
  - "hub manifest goes stale"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/017-routing-manifest-auto-remint"
    last_updated_at: "2026-09-10T09:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Added the gate, proved three cases and closed the packet"
    next_safe_action: "None; the packet is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-10-routing-auto-remint"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Auto re-mint a hub routing manifest at commit time

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-10 |
| **Branch** | `skilled/v4.0.0.0` |
| **Origin** | Operator: "Can't we automate this so you dont get failed runs?" |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A hub's compiled routing manifest pins a hash of its routing inputs. Editing a `SKILL.md` anywhere under that hub changes an input, so the manifest goes stale, and a stale pin makes the hub serve legacy routing with the compiled route silently dropped from every recommendation. Nothing reports this at edit time or at commit time. The pre-push gate catches it, which means the author learns about it only when a push is refused, after the work is already committed. That happened twice in two days in this repository, each time costing a re-mint, an authored resync and an amend.

### Purpose
The re-mint happens where it belongs, in the commit that changed the input, so the manifest and the edit that invalidated it are never separated and no push is refused for this cause.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- One blocking gate block in `.opencode/scripts/git-hooks/pre-commit` that detects a staged routing input, re-mints the affected hub, syncs the authored manifest copy and stages both
- A refusal path for the case where a hub's routing inputs carry unstaged changes, because a manifest minted from the working tree would then describe content the commit does not contain

### Out of Scope
- The pre-push gate, which stays exactly as it is and remains the backstop when the auto-fix fails
- Any other generated artifact. The mirror-parity gate keeps its block-and-instruct shape
- A configuration surface for which hubs participate. The hub list already lives in the guard

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/scripts/git-hooks/pre-commit` | Modify | The new gate block |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement |
|----|-------------|
| REQ-001 | A commit that stages a `SKILL.md` under a hub, or a hub's `hub-router.json` or `mode-registry.json`, leaves that hub fresh with the runtime and authored manifests both staged |
| REQ-002 | A commit that stages no routing input does no work and adds no measurable time |
| REQ-003 | A hub whose routing inputs carry unstaged changes is refused by name rather than minted from a tree that does not match the index |
| REQ-004 | The gate carries a bypass flag in the house style and fails closed if the mint tool is missing |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Staging a hub `SKILL.md` edit and committing produces a commit containing both manifests, with the route guard reporting every hub fresh afterwards
- **SC-002**: The pre-push route gate does not fire for a commit the hook handled
- **SC-003**: A partially staged routing input is refused with the file named
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The hook stages a file the author did not stage | Med | Scoped to two generated manifests for the hub whose input was already staged, printed by name on every run, and the artifact is deterministic from those inputs |
| Risk | A mint failure blocks a commit that would otherwise succeed | Low | The block prints the tool's own output and names the bypass, and the same failure would have refused the push anyway |
| Risk | Every session in this checkout picks the change up at once | Med | The hook is a symlink to the tracked file, so a `git revert` restores the previous behavior with no reinstall |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether the mirror-parity gate should adopt the same auto-fix shape is deliberately left open. Its outputs are regenerated by six different scripts and the choice of which to run is not always mechanical.
<!-- /ANCHOR:questions -->
