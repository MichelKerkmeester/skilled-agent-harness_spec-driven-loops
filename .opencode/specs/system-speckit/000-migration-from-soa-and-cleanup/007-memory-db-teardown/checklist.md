---
title: "Verification Checklist: Gated teardown of the system-speckit memory, vector, and eval databases"
description: "Verification Date: 2026-07-16"
trigger_phrases:
  - "memory db teardown checklist"
  - "context-index sqlite delete verification"
  - "vectors eval wipe checklist"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "system-speckit/000-migration-from-soa-and-cleanup/007-memory-db-teardown"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored Level 2 gated verification checklist"
    next_safe_action: "Await phase 006 gate and wipe confirmation"
    blockers:
      - "Blocked until system-speckit/000-migration-from-soa-and-cleanup phase 006 (research) has durably saved research.md."
      - "Blocked on a fresh explicit operator 'wipe it' confirmation captured at execution time — never auto-runs."
    key_files:
      - ".opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/007-memory-db-teardown/spec.md"
      - ".opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/007-memory-db-teardown/plan.md"
      - ".opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/007-memory-db-teardown/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "007-memory-db-teardown-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "This checklist verifies the gated teardown procedure; it does not itself authorize execution."
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Gated teardown of the system-speckit memory, vector, and eval databases

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

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

- [ ] CHK-001 [P0] Requirements documented in `spec.md`; evidence: `spec.md` §§2-5 define the problem, the verified delete-set inventory, the P0/P1 requirements, and success criteria.
- [ ] CHK-002 [P0] Technical approach defined in `plan.md`; evidence: `plan.md` §§3-4 define the stop-daemons-first / delete-named-set / optional-rebuild architecture and phases.
- [ ] CHK-003 [P1] Dependencies identified and available; evidence: `plan.md` §6 lists the phase 006 research.md dependency, the operator-confirmation gate, and the daemon stop-mechanism dependency.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:gate-research -->
## Gate: Phase 006 Research Durably Saved

- [ ] CHK-G01 [P0] `system-speckit/000-migration-from-soa-and-cleanup` phase 006 (research) exists on disk with a `research.md` file present and durably saved (committed or otherwise persisted) BEFORE any task in `tasks.md` Phase 1 or later is started; evidence: path listing + content check of the phase 006 folder, recorded at execution time. UNKNOWN at scaffold time — the parent directory had zero children when this checklist was authored.
- [ ] CHK-G02 [P0] This phase (007) is confirmed as the FINAL phase of the `000-migration-from-soa-and-cleanup` packet, so no later phase depends on the history this teardown destroys; evidence: parent packet's phase listing/graph-metadata at execution time.
<!-- /ANCHOR:gate-research -->

---

<!-- ANCHOR:gate-confirmation -->
## Gate: Fresh Operator Confirmation

- [ ] CHK-G03 [P0] A fresh, explicit operator "wipe it" (or unambiguous equivalent) confirmation was captured at the literal moment execution began — not reused from an earlier approval of this spec; evidence: the exact confirmation text and timestamp, recorded in the execution's `implementation-summary.md`.
- [ ] CHK-G04 [P0] This teardown did NOT run automatically/unattended under any autopilot or `:auto` mode; evidence: execution transcript shows the confirmation gate was presented and answered by a human, not defaulted.
<!-- /ANCHOR:gate-confirmation -->

---

<!-- ANCHOR:gate-daemons -->
## Gate: Daemons Stopped Before Delete

- [ ] CHK-G05 [P0] `mk_spec_memory` daemon(s) confirmed stopped BEFORE the first delete command ran; evidence: `ps aux | grep -i mk-spec-memory-launcher` returned no live process immediately before Phase 2 began. (4 live processes were observed at scaffold time — this must return zero before deletion.)
- [ ] CHK-G06 [P0] `mk_code_index` daemon(s) confirmed stopped BEFORE the first delete command ran; evidence: `ps aux | grep -i mk-code-index-launcher` returned no live process immediately before Phase 2 began. (3 live processes were observed at scaffold time — this must return zero before deletion.)
<!-- /ANCHOR:gate-daemons -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks; N/A — this packet is filesystem deletion of runtime data files, no source code is authored or changed.
- [ ] CHK-011 [P0] No console errors or warnings; N/A — no application code runs as part of this teardown beyond the shell delete commands in `tasks.md`.
- [ ] CHK-012 [P1] Error handling implemented; evidence: `plan.md` documents no-op handling for already-absent paths and daemon-stop verification before any delete runs.
- [ ] CHK-013 [P1] Code follows project patterns; N/A — no source code is authored by this packet.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All P0 acceptance criteria in `spec.md` are met; evidence: SC-001 through SC-007 each individually verified with a command output, not asserted.
- [ ] CHK-021 [P0] ONLY the memory + vectors + eval set was deleted — no other file was touched; evidence: `ls -la` on every directory in the named delete set shows the enumerated paths gone, and every path in `spec.md`'s "Preserve"/"Out of Scope" rows (`README.md`, `backups/`, `migrations/`, `.doctor-update.*`, launcher logs) is still present with an unchanged size/mtime.
- [ ] CHK-022 [P0] Code-graph, deep-loop runtime, and skill-advisor databases are untouched; evidence: `code-graph.sqlite`, `skill-graph.sqlite`, `skill-graph-daemon-lease.sqlite`, `council-graph.sqlite`, and `deep-loop-graph.sqlite` each match the pre-delete size/mtime baseline recorded under CHK-P00X (Fix Completeness, below).
- [ ] CHK-023 [P1] Rebuild path is documented and, if invoked, verified; evidence: `implementation-summary.md` states whether `/doctor:update` was run, and if so, that the daemon restarted cleanly and `memory_index_scan` completed without error.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each deleted path has a finding class: this entire packet is `instance-only` filesystem deletion (no code/logic change), verified path-by-path against `spec.md`'s explicit allowlist rather than a directory glob.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed: a fresh `find`/`ls -la` sweep at execution time reconfirms no NEW memory/vector/eval file appeared under `database/` or `data/` since this checklist was authored (e.g. from a daemon write between scaffold time and execution time) that should also be included in the delete set.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed: any process, script, or doc that reads `context-index.sqlite`, the vector shards, `speckit-eval.db`, the drift ledger, or `search-decisions.jsonl` at daemon-restart time fails closed (clean re-init or explicit rebuild prompt) rather than crashing or silently serving stale cached data.
- [ ] CHK-FIX-004 [P0] Because this is a destructive path-targeted delete, adversarial cases are covered: (a) a stray trailing-slash or glob in a delete command that could widen scope beyond the named file, (b) a symlinked `database/` or `data/` directory that could redirect a delete outside the intended tree, (c) a delete command run while a daemon process is still alive despite CHK-G05/G06 appearing to pass (race condition), (d) a no-op case where a named path is already absent (must not be treated as a failure).
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed; evidence: the {daemon-stopped} x {in named delete set} x {in excluded boundary} matrix from `plan.md`'s "FIX ADDENDUM: AFFECTED SURFACES" is walked explicitly for every path touched.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant: N/A — this teardown does not read process-wide environment state beyond `SPECKIT_IPC_SOCKET_DIR`/`SPECKIT_DB_DIR`-style overrides, which must be checked to confirm the paths in `spec.md` are still the daemon's actual configured paths at execution time (not stale from this scaffold's verification).
- [ ] CHK-FIX-007 [P1] Evidence is pinned to the exact execution timestamp and command output, not a moving "current state" description.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets involved; evidence: this packet is filesystem deletion of local runtime data files, no credentials touched.
- [ ] CHK-031 [P0] Input validation implemented; evidence: every delete command in the execution phase names an explicit file/directory path from `spec.md`'s allowlist — no user-suppliable path or glob is interpolated into a delete command.
- [ ] CHK-032 [P1] Auth/authz working correctly; N/A — no auth surface is touched by this teardown.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized; evidence: `spec.md`, `plan.md`, and `tasks.md` all describe the same three-phase (gates+stop / delete / verify) ordering and the same file inventory.
- [ ] CHK-041 [P1] Code comments adequate; N/A — no source code is changed by this packet.
- [ ] CHK-042 [P2] README updated (if applicable); N/A — `database/README.md`, `vectors/README.md`, `checkpoints/README.md`, and `data/README.md` already describe these directories generically and do not need packet-specific edits, since this is a one-time operational teardown, not a structural change to what the directories hold.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only; evidence: this scaffolding pass wrote no temp files outside the assigned OUTPUT DIR.
- [ ] CHK-051 [P1] scratch/ cleaned before completion; N/A — no scratch files were created for this scaffolding pass.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 0/15 |
| P1 Items | 10 | 0/10 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-07-16 (checklist authored; all items pending — this phase is gated and has not executed)
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
