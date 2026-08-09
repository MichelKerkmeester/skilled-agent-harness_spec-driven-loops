---
title: "Tasks: Dist Guard Skip Unprovisioned Packages"
description: "Ordered tasks: locate the stale paths, add the provisioning check, verify with real workspace + fixture controls."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "dist guard skip unprovisioned tasks"
  - "dist freshness provisioning tasks"
importance_tier: "high"
contextType: "tasks"
parent: "sk-code"
_memory:
  continuity:
    packet_pointer: "sk-code/023-dist-guard-skip-unprovisioned"
    last_updated_at: "2026-08-09T06:16:27Z"
    last_updated_by: "claude"
    recent_action: "Completed the provisioning-check tasks with a two-variant fixture control"
    next_safe_action: "None; tasks complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs"
    session_dedup:
      fingerprint: "sha256:d98cb2f50e79d544d09ed8d4c3c8a36a355fd0613fb9ca1ecf950c6597853797"
      session_id: "2026-08-09-sk-code-023"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Dist Guard Skip Unprovisioned Packages

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` completed and evidenced; `[~]` explicitly deferred with a recorded reason and owner; `[ ]` pending.
- `T-NNN` identifiers are stable within this packet.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-001 Locate the four stale/missing return paths in `checkPackageFreshness` and confirm the guard acts only on `stale: true`. Evidence: paths at missing-dist, source-hash, dist-hash, and mtime branches; `check-dist-staleness.sh` `surface_result` keys on `payload.stale is True`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-002 Add `isPackageProvisioned(root)` and `unprovisionedResult(...)` helpers. Evidence: `node --check dist-freshness.cjs` passes.
- [x] T-003 Compute `provisioned` once and prepend `if (!provisioned) return unprovisionedResult(...)` to each of the four stale/missing returns. Evidence: `check-all` reports code-mode `unprovisioned`, others `fresh`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-004 Run the workspace + fixture controls. Evidence: guard `--all` silent about code-mode (exit 0); fixture — provisioned+stale → `stale:true`, unprovisioned+stale → `unprovisioned`/`stale:false`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- An un-buildable watched package reports `unprovisioned`/`stale:false` and the guard skips it.
- A provisioned stale package still reports `stale:true`; a fresh package still reports `fresh`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Requirements and success criteria: `spec.md`.
- Approach and rollback: `plan.md`.
- Predecessor (auto-rebuild + sweep unblock): `../022-dist-staleness-rebuild-on-drift/`.
<!-- /ANCHOR:cross-refs -->
