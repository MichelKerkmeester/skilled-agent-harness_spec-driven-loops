---
title: "Verification Checklist: Devin agents/skills/rules parity"
description: "Evidence gate for the live-docs-gated AGENT.md build and the skills/rules discovery documentation."
trigger_phrases:
  - "devin agents skills rules parity checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/015-devin-agents-skills-rules-parity"
    last_updated_at: "2026-07-27T07:00:00Z"
    last_updated_by: "claude"
    recent_action: "Phase re-scaffolded (Planned)."
    next_safe_action: "Verify each item with command-backed evidence."
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "devin-agents-skills-rules-parity"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Devin agents/skills/rules parity

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented. [EVIDENCE: `spec.md` defines four acceptance-tested requirements (REQ-001 through REQ-004).]
- [ ] CHK-002 [P0] Technical approach defined. [EVIDENCE: `plan.md` gates the build on a live-docs fetch before any file write.]
- [ ] CHK-003 [P1] Dependencies identified and available. [EVIDENCE: phase 008 is complete; live Devin CLI docs are reachable.]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The new `AGENT.md` profile matches the live-confirmed format, not an assumed one. [EVIDENCE: format citation precedes the file's creation timestamp in `implementation-summary.md`.]
- [ ] CHK-011 [P1] No existing hook, skill, or rule behavior is altered by this phase. [EVIDENCE: `git diff --stat` shows only new files/additive doc changes, no modifications to existing hook code.]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] A live probe confirms `run_subagent` resolves the new profile. [EVIDENCE: probe transcript shows successful resolution, not a "profile not found" error.]
- [ ] CHK-021 [P1] `devin skills list` output is captured and cited verbatim. [EVIDENCE: `SKILL.md` quotes the actual command output.]
- [ ] CHK-022 [P1] `devin rules list` output is captured and cited verbatim. [EVIDENCE: `SKILL.md` quotes the actual command output.]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-030 [P0] The one genuine gap (`.devin/agents/*/AGENT.md`) is closed with a real, working profile. [EVIDENCE: CHK-020's live-probe evidence.]
- [ ] CHK-031 [P1] The commands non-applicability decision is recorded explicitly, not left implicit. [EVIDENCE: decision note in `SKILL.md` or `decision-record.md` citing the live `--help` confirmation.]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-040 [P1] The new agent profile does not grant broader tool access than the existing Devin dispatch policy allows. [EVIDENCE: profile content reviewed against `dispatch-rule-checks.mjs` policy.]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-050 [P1] Spec, plan, tasks, checklist, and summary are synchronized. [EVIDENCE: `validate.sh --strict` reports 0 errors, 0 warnings for phase 015.]
- [ ] CHK-051 [P1] Comments explain durable runtime constraints without packet identifiers. [EVIDENCE: `check-comment-hygiene.sh` reports no violations.]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-060 [P1] The new profile lives under `.devin/agents/<name>/AGENT.md`, matching the documented directory convention. [EVIDENCE: file path confirmed on disk.]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 5 | 0/5 |
| P1 Items | 6 | 0/6 |
| P2 Items | 0 | 0/0 |

**Verification Date**: Pending (Planned)
<!-- /ANCHOR:summary -->
