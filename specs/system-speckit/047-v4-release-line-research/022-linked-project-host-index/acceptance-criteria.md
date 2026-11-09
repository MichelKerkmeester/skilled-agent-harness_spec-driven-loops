---
title: "Acceptance Criteria: Phase 22: linked-project-host-index"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "linked project host index acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/047-v4-release-line-research/022-linked-project-host-index"
    last_updated_at: "2026-11-09T15:10:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Recorded acceptance evidence"
    next_safe_action: "Commit the phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-11-09-047-remediation-lead"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 22: linked-project-host-index

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `022-linked-project-host-index`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-09
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given Barter's `backend-system`, whose `.skilled` and `specs` link into `ai-speckit`, When a bare lookup runs there, Then it reads the ai-speckit index and finds the notifications packet | Before: `source : ../ai-speckit/skilled/.skilled/.../data/trigger-index.json`, `candidates : 0`. After (read-only): `source : ../ai-speckit/.speckit-index/trigger-index.json`, `paths : relative to ../ai-speckit`, `candidates : 1`, `specs/backend-system/backoffice/007-notifications-activity-logs/acceptance-criteria.md`. Fixture case a passes | Met | - |
| AC-002 | REQ-002 | Given the linked fixture, When the lookup runs bare, with `--spec-folder ""`, and with an explicit folder, Then it scopes to the linked track, unscopes, and honors the folder | Case a finds only the proj doc with `scope specs/proj`; case b finds both docs | Met | - |
| AC-003 | REQ-003 | Given a project linked into a repository with no `.speckit-index/`, When the lookup runs bare, Then it reads the packaged index | Case c passes | Met | - |
| AC-004 | REQ-004 | Given a linked project, When a bare generation runs, Then it exits 2, names the host and writes nothing, while a project with its own index is not refused | Case d: exit 2, no `P/.speckit-index`, packaged hashes unchanged. Own-index case: stderr lacks the refusal. From Barter's `backend-system`, read-only: exit 2 with the refusal naming ai-speckit, no `.speckit-index` written | Met | - |
| AC-005 | REQ-005 | Given the baselines, When the retrieval files and the cli project rerun, Then every baseline pass holds | Five lookup and trigger-index files: 143 passed and 1 skipped before. Seven retrieval files after: 173 passed and 1 skipped, then one more case. cli project: see `implementation-summary.md` | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

Every criterion is Met with observed evidence.
<!-- /ANCHOR:closure -->
