---
title: "Feature Specification: P2-032 strategy-doc cleanup [system-spec-kit/096-rename-opencode-dirs-to-plural/009-p2-032-cleanup/spec]"
description: "Remove the false `aliases.ts` claim from the 007-track-rereview deep-review strategy doc. Strategy doc claimed aliases.ts was a 101 surface; iter-1 review caught it as CROSS_REF_BROKEN. Closes the lone P2 cosmetic finding deferred from the 8-phase plural-rename remediation cycle."
trigger_phrases:
  - "P2-032 strategy doc cleanup"
  - "aliases.ts cross-ref broken"
  - "plural rename cosmetic followup"
  - "096/009 packet"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/009-p2-032-cleanup"
    last_updated_at: "2026-05-08T20:45:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded packet; identified 3 stale aliases.ts references in 007-track-rereview strategy doc"
    next_safe_action: "Edit strategy doc; clear blocker entry in 008-remediation impl-summary"
    blockers: []
    key_files:
      - "specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/007-track-rereview/review/deep-review-strategy.md"
      - "specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/008-remediation/implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "p2-032-cleanup-2026-05-08"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: P2-032 strategy-doc cleanup

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-05-08 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 007-track-rereview deep-review strategy doc lists `aliases.ts` as one of the "6 surfaces" 101-cli-opencode-executor touched. It does not. Iter-1 of the review caught the discrepancy as a `CROSS_REF_BROKEN` and re-framed the underlying P2 finding (P2-027) as an asymmetric advisor-coverage defect. The strategy doc that produced the false framing was never patched, and the drift was logged as P2-032 in 008-remediation as cosmetic-deferred.

### Purpose
Remove the three stale `aliases.ts` references (count "6 surfaces" → "5 surfaces"; line 33 surface bullet; line 57 cross-reference target) so the strategy doc matches the iter-1 review's verified surface inventory. Clear the blocker entry from 008-remediation continuity.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Edit `007-track-rereview/review/deep-review-strategy.md` to remove three stale `aliases.ts` references (line 28 count, line 33 surface bullet, line 57 cross-reference target, line 100 meta-evidence count).
- Clear the `_memory.continuity.blockers` entry "P2-032 strategy-doc drift in 102 review artifact (cosmetic; deferred)" from `008-remediation/implementation-summary.md`.

### Out of Scope
- Iter-1 / iter-2 / iter-N review-narrative mentions of aliases.ts that DOCUMENT the false-claim discovery (lines 119, 130, 163, 164, 226–229) — these are correct evidence and stay.
- Re-running the deep-review with the corrected strategy doc — the original review converged; this is a doc-only correction.
- Any code-touching change.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/007-track-rereview/review/deep-review-strategy.md` | Modify | Remove 3 stale aliases.ts references; correct surface count 6 → 5 in two places. |
| `specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/008-remediation/implementation-summary.md` | Modify | Clear `_memory.continuity.blockers` entry referring to P2-032. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Strategy doc no longer claims `aliases.ts` as a 101 surface. | `grep -n 'aliases\.ts' 007-track-rereview/review/deep-review-strategy.md` returns 0 hits in the surface-inventory and cross-reference sections (iter-narrative mentions remain). |
| REQ-002 | Continuity blocker cleared. | `grep 'P2-032' 008-remediation/implementation-summary.md` returns 0 hits in `_memory.continuity.blockers`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Strict validate (`bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh 008-remediation --strict` and `… 009-p2-032-cleanup --strict`) exits 0 on both packets.
- **SC-002**: P2-032 entry no longer surfaces in `/speckit:resume` continuity recovery.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Removing the wrong `aliases.ts` mention (e.g., the iter-narrative ones that DOCUMENT the discovery) would erase the audit trail. | Low | Edits target only the surface-inventory and cross-reference sections (lines ~28, 33, 57, 100). Iter-narrative paragraphs stay untouched. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
