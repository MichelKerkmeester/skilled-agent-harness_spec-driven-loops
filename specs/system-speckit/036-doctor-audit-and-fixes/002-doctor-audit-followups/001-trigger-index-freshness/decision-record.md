---
title: "Decision Record: Phase 1: trigger-index-freshness"
description: "Records why the acceptance packet's continuity correction was handed off instead of edited in this build."
trigger_phrases:
  - "decision record"
  - "continuity key files handoff"
  - "acceptance packet correction"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/049-doctor-audit-followups/001-trigger-index-freshness"
    last_updated_at: "2026-10-03T07:30:00Z"
    last_updated_by: "build-orchestrator"
    recent_action: "Recorded the continuity correction handoff"
    next_safe_action: "The parent session applies the handed-off correction"
---
# Decision Record: Phase 1: trigger-index-freshness

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

ADR-001 lives in `plan.md` and is Accepted there. This file holds the decision the build added.

---

<!-- ANCHOR:adr-002 -->
## ADR-002: The acceptance packet's continuity correction is handed off

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-03 |
| **Deciders** | Build orchestrator, bound by the parent session's file ownership list |

---

<!-- ANCHOR:adr-002-context -->
### Context

REQ-006 asks for the continuity `key_files` in `specs/system-speckit/033-system-speckit-v4/017-memory-database-decommission/001-trigger-index-replacement/acceptance-criteria.md` to name the live `.skilled/skills/system-spec-kit/runtime/{cli/retrieval,data}` paths. Five orchestrators edit this worktree at once, and the parent session gave this one an explicit list of files it may change. That list covers the system-spec-kit skill, the doctor command family and two named documents of the closed audit packet. It does not include the 033 packet.

### Constraints
- No orchestrator may edit a file outside its owned list.
- The correction is two path strings in a continuity block and changes no behaviour.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**Summary**: Leave the 033 acceptance file unchanged and hand the correction to the parent session.

**Details**: AC-006 is marked Superseded by this record. The two replacements are `.opencode/skills/system-spec-kit/scripts/retrieval/generate-trigger-index.mjs` to `.skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs`, and `.opencode/skills/system-spec-kit/data/trigger-index.json` to `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json`. After the edit, run `repair-derived.cjs` and strict validation on that packet.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Hand off to the parent session** | Keeps the ownership boundary; the fix is spelled out exactly | AC-006 closes outside this phase | 9/10 |
| Edit the 033 file here | AC-006 closes here | Breaks the ownership list another session relies on | 2/10 |
| Drop the criterion | Nothing to coordinate | The stale paths stay | 1/10 |

**Why Chosen**: The correction is mechanical and fully specified, so handing it off costs one edit and keeps every orchestrator inside its files.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

- The 033 acceptance file keeps the two stale paths until the parent session applies the replacement above.
- The check that proves it stays the same: `rg -n "opencode/skills/system-spec-kit/(scripts|data)"` over that file finds nothing.
<!-- /ANCHOR:adr-002-consequences -->
<!-- /ANCHOR:adr-002 -->
