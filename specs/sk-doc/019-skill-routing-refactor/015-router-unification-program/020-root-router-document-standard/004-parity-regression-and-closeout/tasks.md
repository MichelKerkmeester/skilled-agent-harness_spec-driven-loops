---
title: "Tasks: Parity, Regression, and Closeout"
description: "Serial task ledger for the Phase 004 closeout: preflight and frozen pins, owner-harness rebuilds, the seven-canary fleet gate, adjudication-before-write expectation updates, graduated manifest refresh with authored freshness, compiled-route-sync check/promotion/verify with retained rollback and late finalize, canonical-seven status, recursive strict validation, metadata/continuity regeneration, and the final scoped closeout."
trigger_phrases:
  - "parity closeout tasks"
  - "seven canary tasks"
  - "fleet promotion tasks"
  - "manifest refresh tasks"
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/015-router-unification-program/020-root-router-document-standard/004-parity-regression-and-closeout"
    last_updated_at: "2026-08-16T07:53:20.991Z"
    last_updated_by: "markdown-agent"
    recent_action: "Executed the full Phase 004 closeout; all T001-T066 complete."
    next_safe_action: "Retry the final daemon-owned Phase 020 index scan when the memory service is available."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Parity, Regression, and Closeout

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level3-arch | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed with evidence |
| `[P]` | Parallelizable after dependencies pass |
| `[B]` | Blocked and awaiting LOGIC-SYNC |

**Task Format**: `T### [P?] Description (receipt or authoritative path) [effort] {deps: T###}`

No task may be marked complete from prose alone. Each completed P0/P1 task must cite its child-local receipt, command exit, or reviewed decision row.
<!-- /ANCHOR:notation -->

---

## Milestone Reference

| Milestone | Tasks | Gate |
|-----------|-------|------|
| M1 Baseline safe | T001-T010 | No staged files; pins match; 003 receipts present; entry map fixed |
| M2 Fleet proven | T011-T026 | Owner rebuilds canonical; seven canaries green; gold adjudicated |
| M3 Fleet fresh | T027-T036 | Graduated manifests refreshed; freshness 7/7 |
| M4 Fleet promoted | T037-T050 | Check, promote, verify, and probes green; rollback retained |
| M5 Closeout ready | T051-T066 | Status 7/7; rollback finalized; recursive strict exit 0; metadata regenerated; diff clean |

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Preflight and Frozen Pins

- [x] T001 Confirm the current repository root is the isolated 010 worktree (`scratch/closeout/worktree-path.txt`) [10m]. **Evidence**: CWD is the isolated `.worktrees/010-root-router-document-standard` — `scratch/closeout/worktree-path.txt`. [evidence: scratch/completion-evidence.md:1]
- [x] T002 Re-read the approved plan, parent spec, and Phases 001-003 specs; record SHA-256 for each (`scratch/closeout/authority-sha256.txt`) [20m] {deps: T001}. **Evidence**: plan, parent spec, Phases 001-003 specs reread — `scratch/closeout/authority-sha256.txt`. [evidence: scratch/completion-evidence.md:1]
- [x] T003 Confirm the seven Phase 003 checkpoint receipt sets exist and name the canonical hub-to-entry map (`scratch/closeout/hub-entry-map.json`) [15m] {deps: T002}. **Evidence**: seven checkpoint receipt sets exist; hub-to-entry map frozen — `scratch/closeout/hub-entry-map.json`. [evidence: scratch/completion-evidence.md:1]
- [x] T004 Capture initial `git status --short` and staged-file inventory (`scratch/closeout/git-status-before.txt`, `scratch/closeout/git-staged-before.txt`) [10m] {deps: T001}. **Evidence**: initial status captured; no staged files — `scratch/closeout/git-status-before.txt`, `git-staged-before.txt`. [evidence: scratch/completion-evidence.md:1]
- [x] T005 Run actual SHA-256 over the frozen replay and scorer trio (`scratch/closeout/frozen-substrate-before.txt`) [10m] {deps: T001}. **Evidence**: frozen trio hashed before actions — `scratch/closeout/frozen-substrate-before.txt`. [evidence: scratch/completion-evidence.md:1]
- [x] T006 Compare the trio to the Phase 001 pinned values and fail on drift (`scratch/closeout/frozen-pin-before.json`) [10m] {deps: T005}. **Evidence**: pins match Phase 001 values — `scratch/closeout/frozen-pin-before.json` (re-verified 2026-08-16). [evidence: scratch/completion-evidence.md:1]
- [x] T007 Read the usage contract of `compiled-route-manifest.cjs`, `compiled-route-sync.cjs`, and `compiled-route-status.cjs` and record exact flags (`scratch/closeout/tool-usage-contract.md`) [20m] {deps: T001}. **Evidence**: tool usage contract recorded — `scratch/closeout/tool-usage-contract.md`. [evidence: scratch/completion-evidence.md:1]
- [x] T008 Capture the graduated manifest inventory with generation, serving authority, shadow-only state, and fencing attributes (`scratch/closeout/manifest-inventory-before.json`) [20m] {deps: T007}. **Evidence**: graduated manifest inventory captured — `scratch/closeout/manifest-inventory-before.json`. [evidence: scratch/completion-evidence.md:1]
- [x] T009 Confirm no Phase 004 command uses `activate-hub` or the mcp-tooling direct-mirror exception (`scratch/closeout/command-allowlist-review.md`) [10m] {deps: T007}. **Evidence**: no activate-hub / direct-mirror exception — `scratch/closeout/command-allowlist-review.md`. [evidence: scratch/completion-evidence.md:1]
- [x] T010 Ratify the canonical-seven assertion rule excluding temporary manifest-test and race fixtures (`decision-record.md` ADR-007) [15m] {deps: T003}. **Evidence**: canonical-seven assertion rule ratified — ADR-007 (Accepted). [evidence: scratch/completion-evidence.md:1]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Rebuilds and the Seven-Canary Gate

- [x] T011 Run the owner rebuild for cli-external-orchestration (`scratch/closeout/rebuild-cli-external-orchestration.json`) [20m] {deps: T006}. **Evidence**: owner rebuild status built — `scratch/closeout/rebuild-cli-external-orchestration.json`. [evidence: scratch/completion-evidence.md:1]
- [x] T012 Run the owner rebuild for sk-design (`scratch/closeout/rebuild-sk-design.json`) [20m] {deps: T011}. **Evidence**: owner rebuild status built — `scratch/closeout/rebuild-sk-design.json`. [evidence: scratch/completion-evidence.md:1]
- [x] T013 Run the owner rebuild for sk-prompt (`scratch/closeout/rebuild-sk-prompt.json`) [20m] {deps: T012}. **Evidence**: owner rebuild status built — `scratch/closeout/rebuild-sk-prompt.json`. [evidence: scratch/completion-evidence.md:1]
- [x] T014 Run the owner rebuild for sk-doc (`scratch/closeout/rebuild-sk-doc.json`) [20m] {deps: T013}. **Evidence**: owner rebuild status built — `scratch/closeout/rebuild-sk-doc.json`. [evidence: scratch/completion-evidence.md:1]
- [x] T015 Run the owner rebuild for system-deep-loop (`scratch/closeout/rebuild-system-deep-loop.json`) [20m] {deps: T014}. **Evidence**: owner rebuild status built — `scratch/closeout/rebuild-system-deep-loop.json`. [evidence: scratch/completion-evidence.md:1]
- [x] T016 Run the owner rebuild for sk-code (`scratch/closeout/rebuild-sk-code.json`) [20m] {deps: T015}. **Evidence**: owner rebuild status built — `scratch/closeout/rebuild-sk-code.json`. [evidence: scratch/completion-evidence.md:1]
- [x] T017 Confirm mcp-tooling needs no rebuild because its inputs match the golden receipt, or run its owner if drift is adjudicated (`scratch/closeout/rebuild-mcp-tooling.json`) [20m] {deps: T015}. **Evidence**: mcp-tooling inputs match golden receipt; no-op owner run, zero drift — `scratch/closeout/rebuild-mcp-tooling.json`. [evidence: scratch/completion-evidence.md:1]
- [x] T018 Assert every rebuild receipt reports `status: built` and records source inputs, compiled artifacts, activation artifacts, effective policy hash, and graph hash (`scratch/closeout/rebuild-matrix.json`) [20m] {deps: T011..T017}. **Evidence**: rebuild matrix 7/7 `status: built` with source inputs, compiled artifacts, activation artifacts, policy hash, graph hash — `scratch/closeout/rebuild-matrix.json`. [evidence: scratch/completion-evidence.md:1]
- [x] T019 Run the cli-external-orchestration canary and capture route-gold, mode, leaf, bundle, and fallback rows (`scratch/closeout/canary-cli-external-orchestration.json`) [30m] {deps: T011}. **Evidence**: canary exit 0 GREEN — `scratch/closeout/canary-cli-external-orchestration.json`. [evidence: scratch/completion-evidence.md:1]
- [x] T020 Run the sk-design canary (`scratch/closeout/canary-sk-design.json`) [30m] {deps: T019}. **Evidence**: canary exit 0 GREEN — `scratch/closeout/canary-sk-design.json`. [evidence: scratch/completion-evidence.md:1]
- [x] T021 Run the sk-prompt canary (`scratch/closeout/canary-sk-prompt.json`) [30m] {deps: T020}. **Evidence**: canary exit 0 GREEN — `scratch/closeout/canary-sk-prompt.json`. [evidence: scratch/completion-evidence.md:1]
- [x] T022 Run the sk-doc canary (`scratch/closeout/canary-sk-doc.json`) [30m] {deps: T021}. **Evidence**: canary exit 0 GREEN — `scratch/closeout/canary-sk-doc.json`. [evidence: scratch/completion-evidence.md:1]
- [x] T023 Run the system-deep-loop canary (`scratch/closeout/canary-system-deep-loop.json`) [30m] {deps: T022}. **Evidence**: canary exit 0 GREEN — `scratch/closeout/canary-system-deep-loop.json`. [evidence: scratch/completion-evidence.md:1]
- [x] T024 Run the sk-code canary and confirm the one-resource delta is the only machine-block deviation (`scratch/closeout/canary-sk-code.json`) [30m] {deps: T023}. **Evidence**: canary exit 0 GREEN; exactly the one-resource machine-block deviation — `scratch/closeout/canary-sk-code.json`. [evidence: scratch/completion-evidence.md:1]
- [x] T025 Run the mcp-tooling canary (`scratch/closeout/canary-mcp-tooling.json`) [30m] {deps: T024}. **Evidence**: canary exit 0 GREEN — `scratch/closeout/canary-mcp-tooling.json`. [evidence: scratch/completion-evidence.md:1]
- [x] T026 Assert all seven canaries exit 0 and re-verify the frozen trio pins (`scratch/closeout/canary-matrix.json`, `scratch/closeout/frozen-pin-post-canary.json`) [15m] {deps: T019..T025}. **Evidence**: 7/7 canaries exit 0; trio pins re-verified — `scratch/closeout/canary-matrix.json`, `frozen-pin-post-canary.json`. [evidence: scratch/completion-evidence.md:1]

### Adjudication and Expectation Updates

- [x] T027 Inventory every authored hash and route-gold fixture this migration can legitimately change (`scratch/closeout/expectation-inventory.json`) [30m] {deps: T026}. **Evidence**: expectation inventory captured — `scratch/closeout/expectation-inventory.json`. [evidence: scratch/completion-evidence.md:1]
- [x] T028 Write an adjudication row for every inventory entry: prior value, migration cause, expected delta, reviewer decision (`scratch/closeout/adjudication-ledger.json`) [45m] {deps: T027}. **Evidence**: adjudication rows ADJ-001..ADJ-005 written — `scratch/closeout/adjudication-ledger.json`. [evidence: scratch/completion-evidence.md:1]
- [x] T029 Update authored hashes and route-gold expectations only after their adjudication rows exist (`scratch/closeout/expectation-update-diff.txt`) [45m] {deps: T028}. **Evidence**: updates applied only after adjudication — `scratch/closeout/expectation-update-diff.txt`. [evidence: scratch/completion-evidence.md:1]
- [x] T030 Confirm no frozen replay or scorer digest was adjudicated into a new value (`scratch/closeout/frozen-digest-adjudication-guard.txt`) [10m] {deps: T029}. **Evidence**: no frozen replay/scorer digest adjudicated — `scratch/closeout/frozen-digest-adjudication-guard.txt`. [evidence: scratch/completion-evidence.md:1]
- [x] T031 Re-run the seven canaries after expectation updates and confirm still green (`scratch/closeout/canary-post-update-matrix.json`) [45m] {deps: T029}. **Evidence**: canary re-run after updates still GREEN 7/7 — `scratch/closeout/canary-post-update-matrix.json`. [evidence: scratch/completion-evidence.md:1]

### Graduated Manifest Refresh and Freshness

- [x] T032 Refresh the existing graduated activation manifests through `compiled-route-manifest.cjs refresh` (`scratch/closeout/manifest-refresh.txt`) [20m] {deps: T031}. **Evidence**: graduated refresh 7/7 via `compiled-route-manifest.cjs refresh` — `scratch/closeout/manifest-refresh.txt`. [evidence: scratch/completion-evidence.md:1]
- [x] T033 Diff the manifest inventory before and after refresh and confirm generation, serving authority, shadow-only state, and fencing semantics hold (`scratch/closeout/manifest-diff.txt`) [20m] {deps: T032}. **Evidence**: generation/authority/shadow/fencing preserved — `scratch/closeout/manifest-diff.txt`. [evidence: scratch/completion-evidence.md:1]
- [x] T034 Confirm no non-graduated or temporary manifest was touched (`scratch/closeout/manifest-scope-check.txt`) [10m] {deps: T033}. **Evidence**: no non-graduated or temporary manifest touched — `scratch/closeout/manifest-scope-check.txt`. [evidence: scratch/completion-evidence.md:1]
- [x] T035 Run `compiled-route-manifest.cjs freshness` and prove authored freshness for all seven (`scratch/closeout/manifest-freshness.txt`) [20m] {deps: T034}. **Evidence**: authored freshness 7/7 valid+fresh — `scratch/closeout/manifest-freshness.txt` (re-verified 2026-08-16 via status --all). [evidence: scratch/completion-evidence.md:1]
- [x] T036 Confirm no `activate-hub` invocation and no mcp-tooling direct-mirror exception usage in any receipt (`scratch/closeout/prohibited-tool-scan.txt`) [10m] {deps: T035}. **Evidence**: no activate-hub / direct-mirror exception in any receipt — `scratch/closeout/prohibited-tool-scan.txt`. [evidence: scratch/completion-evidence.md:1]

### Sync, Promotion, Verify, and Probes

- [x] T037 Run `compiled-route-sync.cjs --check` and confirm exit 0 with no writes (`scratch/closeout/sync-check.txt`) [20m] {deps: T036}. **Evidence**: `compiled-route-sync.cjs --check` exit 0, no writes; 55 files/7 hubs — `scratch/closeout/sync-check.txt` (re-verified 2026-08-16). [evidence: scratch/completion-evidence.md:1]
- [x] T038 Run the canonical fleet promotion and retain the reported rollback root (`scratch/closeout/promote.txt`) [30m] {deps: T037}. **Evidence**: canonical promotion ran; rollback root retained — `scratch/closeout/promote.txt` (62 files copied; no publication lock remains). [evidence: scratch/completion-evidence.md:1]
- [x] T039 Run promoted `--verify` and confirm exit 0 (`scratch/closeout/promoted-verify.txt`) [20m] {deps: T038}. **Evidence**: promoted `--verify` exit 0; 7/7; zero spec reads — `scratch/closeout/promoted-verify.txt`. [evidence: scratch/completion-evidence.md:1]
- [x] T040 Run parity probes across all seven hubs (`scratch/closeout/parity-probes.json`) [30m] {deps: T039}. **Evidence**: parity probes 7/7 pass — `scratch/closeout/parity-probes.json`. [evidence: scratch/completion-evidence.md:1]
- [x] T041 Run the kill-switch probe: disable the compiled-routing switch, confirm fallback per serving authority, re-enable, confirm compiled serving (`scratch/closeout/kill-switch-probe.txt`) [20m] {deps: T040}. **Evidence**: kill-switch probe pass (fallback off / compiled on) — `scratch/closeout/kill-switch-probe.txt`. [evidence: scratch/completion-evidence.md:1]
- [x] T042 Run representative route probes per canonical hub (`scratch/closeout/probe-route-<hub>.json`) [30m] {deps: T041}. **Evidence**: route probes 7/7 pass — `scratch/closeout/probe-route-<hub>.json`. [evidence: scratch/completion-evidence.md:1]
- [x] T043 Run bundle probes and defer probes per canonical hub (`scratch/closeout/probe-bundle-defer-<hub>.json`) [30m] {deps: T042}. **Evidence**: bundle/defer probes 7/7 pass — `scratch/closeout/probe-bundle-defer-<hub>.json`. [evidence: scratch/completion-evidence.md:1]
- [x] T044 Run rollback probes against the retained rollback root and confirm the closure reverts and restores (`scratch/closeout/probe-rollback.txt`) [30m] {deps: T043}. **Evidence**: rollback probe pass — `scratch/closeout/probe-rollback.txt`. [evidence: scratch/completion-evidence.md:1]
- [x] T045 Re-verify the frozen trio pins after all probes (`scratch/closeout/frozen-substrate-post-probes.txt`) [10m] {deps: T044}. **Evidence**: trio pins re-verified after probes — `scratch/closeout/frozen-substrate-post-probes.txt`. [evidence: scratch/completion-evidence.md:1]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T046 Run `compiled-route-status.cjs --all` and assert the seven canonical hubs report compiled-serving and fresh (`scratch/closeout/status-all.txt`) [20m] {deps: T045}. **Evidence**: `compiled-route-status.cjs --all` → 7 canonical hubs compiled-serving fresh — `scratch/closeout/status-all.txt` (re-verified 2026-08-16). [evidence: scratch/completion-evidence.md:1]
- [x] T047 Assert temporary manifest-test and race fixtures are excluded from the canonical-seven result (`scratch/closeout/status-canonical-only.txt`) [10m] {deps: T046}. **Evidence**: temporary fixtures excluded from the canonical-seven result — `scratch/closeout/status-canonical-only.txt`. [evidence: scratch/completion-evidence.md:1]
- [x] T048 Run `compiled-route-sync.cjs --finalize <rollback>` only after every post-publish gate passes (`scratch/closeout/finalize.txt`) [10m] {deps: T046, T047}. **Evidence**: `--finalize <rollback>` after all gates; 0 external manifests discarded; no publication lock — `scratch/closeout/finalize.txt`. [evidence: scratch/completion-evidence.md:1]
- [x] T049 Run strict validation for every `020` child (`scratch/closeout/strict-child-validation.txt`) [30m] {deps: T048}. **Evidence**: all four child gates exited 0 — `scratch/closeout/strict-child-validation.txt`. [evidence: scratch/completion-evidence.md:1]
- [x] T050 Run recursive strict validation on `020-root-router-document-standard` and `015-router-unification-program` (`scratch/closeout/recursive-strict-validation.txt`) [30m] {deps: T049}. **Evidence**: both recursive strict gates exited 0 — `scratch/closeout/recursive-strict-validation.txt`. [evidence: scratch/completion-evidence.md:1]
- [x] T051 Regenerate child, `020`, `015`, and ancestor metadata/continuity through `generate-context.js` (`scratch/closeout/generate-context.txt`) [20m] {deps: T050}. **Evidence**: metadata/continuity refreshed through canonical `generate-context.js` saves; canonical `generate-context.js` exited 0 and indexed all four children — `scratch/closeout/generate-context.txt`. [evidence: scratch/completion-evidence.md:1]
- [x] T052 Run canonical metadata saves and attempt final daemon-owned indexing (`scratch/closeout/final-index-status.md`) [10m] {deps: T051}. [deferred: canonical saves exited 0; final daemon index refresh timed out twice with retryable exit 75]
- [x] T053 Run the unresolved-token scan across all authored packet docs (`scratch/closeout/unresolved-token-scan.txt`) [10m] {deps: T051}. **Evidence**: unresolved-token scan: zero tokens — `scratch/closeout/unresolved-token-scan.txt`. [evidence: scratch/completion-evidence.md:1]
- [x] T054 Verify canonical Level-3 anchor pairs and frontmatter fields (`scratch/closeout/document-structure-check.txt`) [15m] {deps: T053}. **Evidence**: anchor pairs and frontmatter verified — `scratch/closeout/document-structure-check.txt`. [evidence: scratch/completion-evidence.md:1]
- [x] T055 Capture final status, changed paths, and staged-file inventory (`scratch/closeout/git-status-after.txt`) [15m] {deps: T054}. **Evidence**: final status captured; no staged files — `scratch/closeout/git-status-after.txt`. [evidence: scratch/completion-evidence.md:1]
- [x] T056 Re-run the frozen trio pins and diff against the before file (`scratch/closeout/frozen-substrate-after.txt`) [10m] {deps: T055}. **Evidence**: frozen trio pins diff against before: identical — `scratch/closeout/frozen-substrate-after.txt`. [evidence: scratch/completion-evidence.md:1]
- [x] T057 Assert every changed path is inside this child or a named execution surface and that no staged file exists (`scratch/closeout/out-of-scope-paths.txt`) [20m] {deps: T056}. **Evidence**: no out-of-scope path; no staged files — `scratch/closeout/out-of-scope-paths.txt`. [evidence: scratch/completion-evidence.md:1]
- [x] T058 Remove task-created temporary artifacts that are not receipts or authored docs (`scratch/closeout/temp-artifact-sweep.txt`) [15m] {deps: T057}. **Evidence**: task-created temporary artifacts swept — `scratch/closeout/temp-artifact-sweep.txt`. [evidence: scratch/completion-evidence.md:1]
- [x] T059 Approve or block the 004 closeout handoff with the fleet, probe, status, validation, metadata, and diff receipts (`scratch/closeout/handoff-contract.md`) [20m] {deps: T058}. **Evidence**: 004 closeout handoff approved — `scratch/closeout/handoff-contract.md`. [evidence: scratch/completion-evidence.md:1]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:architecture-tasks -->
## L3: Architecture Tasks

- [x] T060 Confirm remediation stayed within the eligibility table and every denied repair has a denial receipt (`decision-record.md` ADR-001) [15m] {deps: T059}. **Evidence**: remediation stayed within the REQ-001 eligibility table — ADR-001 (Accepted). [evidence: scratch/completion-evidence.md:1]
- [x] T061 Confirm rebuilds ran only through owner harnesses (`decision-record.md` ADR-002) [15m] {deps: T018}. **Evidence**: rebuilds ran only through owner harnesses — ADR-002 (Accepted). [evidence: scratch/completion-evidence.md:1]
- [x] T062 Confirm the seven-canary gate preceded any expectation change (`decision-record.md` ADR-003) [15m] {deps: T026}. **Evidence**: seven-canary gate preceded expectation changes — ADR-003 (Accepted). [evidence: scratch/completion-evidence.md:1]
- [x] T063 Confirm every authored-hash or route-gold write has a prior adjudication row (`decision-record.md` ADR-004) [15m] {deps: T029}. **Evidence**: every expectation write has a prior adjudication row — ADR-004 (Accepted). [evidence: scratch/completion-evidence.md:1]
- [x] T064 Confirm graduated-only refresh and the absence of `activate-hub` and the direct-mirror exception (`decision-record.md` ADR-005) [15m] {deps: T036}. **Evidence**: graduated-only refresh; no activate-hub/direct-mirror — ADR-005 (Accepted). [evidence: scratch/completion-evidence.md:1]
- [x] T065 Confirm the check/promote/verify/revert/finalize sequence and retained rollback (`decision-record.md` ADR-006) [15m] {deps: T048}. **Evidence**: check/promote/verify/revert/finalize with retained rollback — ADR-006 (Accepted). [evidence: scratch/completion-evidence.md:1]
- [x] T066 Confirm canonical-seven status is the serving completion trigger and canonical metadata regeneration plus an explicit index disposition is the documentation closeout gate (`decision-record.md` ADR-007, ADR-008) [15m] {deps: T059}. **Evidence**: the serving gate passed and the index disposition is recorded — ADR-007 and ADR-008. [evidence: scratch/completion-evidence.md:1]
<!-- /ANCHOR:architecture-tasks -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All T001-T066 tasks are complete with child-local or named-surface evidence. [evidence: scratch/completion-evidence.md:1]
- [x] No `[B]` blocked task remains. [evidence: scratch/completion-evidence.md:1]
- [x] All P0/P1 checklist items carry concrete receipt evidence. [evidence: scratch/completion-evidence.md:1]
- [x] Frozen replay and scorer digests match the Phase 001 pins before and after every action. [evidence: scratch/completion-evidence.md:1]
- [x] Seven canaries exit 0; authored hashes and route-gold changed only after adjudication. [evidence: scratch/completion-evidence.md:1]
- [x] Only graduated manifests refreshed; authored freshness proven for all seven. [evidence: scratch/completion-evidence.md:1]
- [x] `compiled-route-sync.cjs --check`, promotion, and promoted `--verify` exit 0; rollback retained and finalized late. [evidence: scratch/completion-evidence.md:1]
- [x] Parity, kill-switch, and representative route/bundle/defer/rollback probes pass. [evidence: scratch/completion-evidence.md:1]
- [x] `compiled-route-status.cjs --all` asserts the seven canonical hubs compiled-serving and fresh. [evidence: scratch/completion-evidence.md:1]
- [x] Recursive strict validation exits 0; metadata and continuity regenerated; final searchable-index refresh deferred after retryable daemon timeouts. [evidence: scratch/completion-evidence.md:1]
- [x] No staged files; no out-of-scope path; no task-created temporary residue; no repository-completion claim. [evidence: scratch/completion-evidence.md:1]
- [x] Lifecycle is Complete for the worktree implementation; canonical metadata regeneration completed; final searchable-index refresh and Git integration remain operator actions. [evidence: scratch/completion-evidence.md:1]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Implementation Plan**: `plan.md`
- **Verification Checklist**: `checklist.md`
- **Decision Record**: `decision-record.md`
- **Implementation Summary**: `implementation-summary.md`
- **Predecessor Adoption**: `../003-seven-hub-root-adoption/spec.md`
- **Parent Phase**: `../spec.md`
<!-- /ANCHOR:cross-refs -->
