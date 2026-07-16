---
title: "Verification Checklist: Sandbox Testing Playbook [system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/002-sandbox-testing-playbook/checklist]"
description: "P0/P1/P2 verification checkpoints with evidence anchors for the 5-phase implementation."
trigger_phrases:
  - "002-sandbox-testing-playbook checklist"
  - "doctor playbook verification"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/z_archive/wave-2-merges/013-002-sandbox-testing-playbook"
    last_updated_at: "2026-05-09T16:18:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored verification checklist with per-phase blocks"
    next_safe_action: "Draft decision-record"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-sandbox-testing-playbook-2026-05-09"
      parent_session_id: null
    completion_pct: 45
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Sandbox Testing Playbook

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval to defer |
| **[P2]** | Optional | Can defer with documented reason |

**Evidence anchors**: dispatch logs at `dispatch/logs/`, smoke-test output at `scratch/`, ADR cross-references in `decision-record.md`.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Phase parent 013 lean trio authored (spec.md + description.json + graph-metadata.json) — see implementation-summary.md §What Was Built
- [x] CHK-002 [P0] User-locked answers captured in spec.md (Q-A through Q-F) — see implementation-summary.md §Key Decisions
- [x] CHK-003 [P0] Sibling 001-doctor-commands closed at completion_pct: 100 — see implementation-summary.md §What Was Built
- [x] CHK-004 [P0] Phase A docs all authored (spec, plan, tasks, checklist, decision-record, resource-map) — see implementation-summary.md §What Was Built
- [x] CHK-005 [P0] `generate-context.js` run for 002 (description.json + graph-metadata.json present) — see implementation-summary.md §What Was Built
- [x] CHK-006 [P0] Parent 013 manual fields restored after save — see implementation-summary.md §What Was Built
- [ ] CHK-007 [P1] Current branch is `main`; no auto-branch lingering
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-CQ-001 [P0] Packet docs follow the Level 3 template header and anchor contract.
- [ ] CHK-CQ-002 [P0] Shell harness files remain bash 3.2 compatible and avoid scenario-specific business logic.
- [ ] CHK-CQ-003 [P1] Scenario Markdown stays within the established playbook structure and naming convention.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-TST-001 [P0] Scenario Markdown validation passes for IDs 323-336, 338-342, 344-347 (gaps at 337 + 343 — see decision-record.md ADR-008). — see implementation-summary.md §Verification
- [x] CHK-TST-002 [P0] `bash -n` passes for all harness and per-scenario wrapper scripts. — see implementation-summary.md §Verification
- [x] CHK-TST-003 [P0] `harness/run-all.sh --dry-run` exits 0 and reports the expected scenario count. — see implementation-summary.md §Verification
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] `TEMPLATE_HEADERS` reports no missing or out-of-order headers for this packet.
- [ ] CHK-FIX-002 [P0] `ANCHORS_VALID` reports no missing template anchors for this packet.
- [ ] CHK-FIX-003 [P1] Any remaining validator issue is documented with a concrete reason and next action.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-SEC-001 [P0] Fixture fetch flow verifies SHA-256 checksums before use. — see implementation-summary.md §What Was Built
- [x] CHK-SEC-002 [P1] Docker sandbox runs as non-root `testuser:testuser`. — see implementation-summary.md §What Was Built
- [ ] CHK-SEC-003 [P1] Scenario commands do not write outside the sandbox or documented fixture state.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-DOC-001 [P0] `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and `implementation-summary.md` retain required anchors.
- [x] CHK-DOC-002 [P0] Root playbook includes `23--doctor-commands/` and 23 indexed rows. — see implementation-summary.md §Verification
- [x] CHK-DOC-003 [P1] ADRs document the ID range, sandbox location, fixture hosting, scenario shape, and harness language. — see implementation-summary.md §Key Decisions
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-ORG-001 [P0] Scenario Markdown files live only under `23--doctor-commands/`. — see implementation-summary.md §Files Touched
- [x] CHK-ORG-002 [P0] Sandbox runtime files live only under `_sandbox/23--doctor-commands/`. — see implementation-summary.md §Files Touched
- [x] CHK-ORG-003 [P1] Packet docs remain in `002-sandbox-testing-playbook/` with metadata JSON files present. — see implementation-summary.md §Files Touched
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:scenario-authoring -->
## Phase B: 25 Scenarios

### Cross-track gates

- [x] CHK-100 [P0] All 23 scenario `.md` files exist at IDs 323-336, 338-342, 344-347 (gaps at 337 + 343 — see decision-record.md ADR-008) in `23--doctor-commands/` (REQ-001) — see implementation-summary.md §What Was Built
- [x] CHK-101 [P0] Each file passes the documented `validate_document.py --type spec` fallback because `playbook_feature` is unsupported (REQ-002) — see implementation-summary.md §Verification
- [ ] CHK-102 [P0] Each file follows canonical 5-section structure (`## 1. OVERVIEW`, `## 2. SCENARIO CONTRACT`, `## 3. TEST EXECUTION`, `## 4. SOURCE FILES`, `## 5. SOURCE METADATA`) (REQ-003)
- [ ] CHK-103 [P0] Each file has frontmatter with `title`, `description` (REQ-003 derived)
- [ ] CHK-104 [P1] Each file's Section 3 (TEST EXECUTION) includes Prompt + Commands + Expected + Evidence + Pass/Fail + Failure Triage subsections (REQ-020)
- [ ] CHK-105 [P1] Each file's Section 4 (SOURCE FILES) cites the matching YAML asset path from `001-doctor-commands` (REQ-021)

### Track P-MEM (DOC-323..DOC-327)

- [x] CHK-110 [P0] DOC-323 fresh-install authored — see implementation-summary.md §What Was Built
- [x] CHK-111 [P0] DOC-324 drift detection authored — see implementation-summary.md §What Was Built
- [x] CHK-112 [P0] DOC-325 long-pole rebuild authored — see implementation-summary.md §What Was Built
- [x] CHK-113 [P0] DOC-326 SIGINT cancellation authored — see implementation-summary.md §What Was Built
- [x] CHK-114 [P0] DOC-327 disk pressure refusal authored — see implementation-summary.md §What Was Built

### Track P-CAUSAL (DOC-328..DOC-330)

- [x] CHK-120 [P0] DOC-328 low-coverage drift report authored — see implementation-summary.md §What Was Built
- [x] CHK-121 [P0] DOC-329 confidence threshold authored — see implementation-summary.md §What Was Built
- [x] CHK-122 [P0] DOC-330 add-only enforcement authored — see implementation-summary.md §What Was Built

### Track P-LOOP-COCO (DOC-331..DOC-336)

- [x] CHK-130 [P0] DOC-331 deep-loop lazy-init authored — see implementation-summary.md §What Was Built
- [x] CHK-131 [P0] DOC-332 deep-loop empty-no-source authored — see implementation-summary.md §What Was Built
- [x] CHK-132 [P0] DOC-333 deep-loop convergence authored — see implementation-summary.md §What Was Built
- [x] CHK-133 [P0] DOC-334 cocoindex daemon healthy authored — see implementation-summary.md §What Was Built
- [x] CHK-134 [P0] DOC-335 cocoindex daemon zombie authored — see implementation-summary.md §What Was Built
- [x] CHK-135 [P0] DOC-336 cocoindex daemon unreachable authored — see implementation-summary.md §What Was Built

### Track P-UPDATE-MIGRATE (DOC-338..DOC-342 + DOC-344..DOC-347)

- [x] CHK-141 [P0] DOC-338 G5 failure injection mid-rebuild authored — see implementation-summary.md §What Was Built
- [x] CHK-142 [P0] DOC-339 G6 concurrent dispatch refusal authored — see implementation-summary.md §What Was Built
- [x] CHK-143 [P0] DOC-340 G7 SIGINT cancellation authored — see implementation-summary.md §What Was Built
- [x] CHK-144 [P0] DOC-341 G8 migration gap detection authored — see implementation-summary.md §What Was Built
- [x] CHK-145 [P0] DOC-342 G9 cross-subsystem dashboard authored — see implementation-summary.md §What Was Built
- [x] CHK-147 [P0] DOC-344 tier-aware single interactive flow authored — see implementation-summary.md §What Was Built
- [x] CHK-148 [P0] DOC-345 fresh-clone 3.3.0.0 → 3.4.1.0 authored — see implementation-summary.md §What Was Built
- [x] CHK-149 [P0] DOC-346 cleanup-legacy prompts authored — see implementation-summary.md §What Was Built
- [x] CHK-150 [P0] DOC-347 already-current no-op authored — see implementation-summary.md §What Was Built
<!-- /ANCHOR:scenario-authoring -->

---

<!-- ANCHOR:root-playbook -->
## Phase C: Root Playbook Update

- [x] CHK-200 [P0] `23--doctor-commands/` listed in canonical-source-artifacts of root `manual_testing_playbook.md` (REQ-004) — see implementation-summary.md §Verification
- [x] CHK-201 [P0] `last_updated:` frontmatter shows today's date (REQ-006) — see implementation-summary.md §Verification
- [x] CHK-202 [P0] Section 12 includes 23 entries for IDs 323-336, 338-342, 344-347 (gaps at 337 + 343 — see decision-record.md ADR-008) (REQ-005) — see implementation-summary.md §Verification
- [x] CHK-203 [P0] Each Section 12 entry uses canonical pattern `> **Feature File:** [NNN](23--doctor-commands/NNN-filename.md)` — see implementation-summary.md §Verification
- [ ] CHK-204 [P2] Scenario count metadata (if tracked) updated 322 → 347 (REQ-040)
<!-- /ANCHOR:root-playbook -->

---

<!-- ANCHOR:sandbox-harness -->
## Phase D: Sandbox Harness

### Container infrastructure

- [x] CHK-300 [P0] `_sandbox/23--doctor-commands/Dockerfile` exists and is parseable (REQ-007) — see implementation-summary.md §What Was Built
- [x] CHK-301 [P0] Dockerfile uses Node 20-bookworm + python3.11 + sqlite3 + jq + git + curl (NFR-RP-001) — see implementation-summary.md §What Was Built
- [x] CHK-302 [P0] Dockerfile creates non-root `testuser:testuser` — see implementation-summary.md §What Was Built
- [x] CHK-303 [P0] `_sandbox/23--doctor-commands/docker-compose.yml` exists + valid YAML (REQ-008) — see implementation-summary.md §Verification
- [x] CHK-304 [P0] docker-compose service definition includes volume mount + env vars — see implementation-summary.md §What Was Built

### Fixture infrastructure

- [x] CHK-310 [P0] `fixtures/manifest.json` exists + valid JSON with required fields per fixture (URL, SHA-256, size, version) (REQ-009) — see implementation-summary.md §Verification
- [x] CHK-311 [P0] `fixtures/fetch-fixtures.sh` exists + idempotent (REQ-027) — see implementation-summary.md §What Was Built
- [x] CHK-312 [P0] `fixtures/.gitkeep` exists as placeholder — see implementation-summary.md §What Was Built
- [x] CHK-313 [P1] Manifest declares 4 fixture archives (v3.3.0.0, v3.4.0.0, empty, partial) — see implementation-summary.md §What Was Built
- [ ] CHK-314 [P2] Fixture URLs reachable (REQ-031, deferred to follow-on packet)

### Harness scripts

- [x] CHK-320 [P0] `harness/run-all.sh` exists (REQ-010) — see implementation-summary.md §What Was Built
- [x] CHK-321 [P0] `harness/reset-state.sh` exists — see implementation-summary.md §What Was Built
- [x] CHK-322 [P0] `harness/capture-evidence.sh` exists + snapshots stdout/exit/file-deltas/snapshot-files (REQ-024) — see implementation-summary.md §What Was Built
- [x] CHK-323 [P0] `harness/assert-signals.sh` exists + grep-based + reads scenario .md "Expected signals" (REQ-025) — see implementation-summary.md §What Was Built
- [x] CHK-324 [P0] All 4 harness scripts pass `bash -n` (REQ-010) — see implementation-summary.md §Verification
- [x] CHK-325 [P0] All 4 harness scripts use `set -euo pipefail` + color guards (NFR-MN-001, NFR-MN-002) — see implementation-summary.md §What Was Built
- [x] CHK-326 [P0] `harness/run-all.sh --dry-run` exits 0 (REQ-012) — see implementation-summary.md §Verification
- [x] CHK-327 [P0] `harness/run-all.sh` emits Markdown rollup with PASS/FAIL/SKIP/UNAUTOMATABLE per-scenario (REQ-026) — see implementation-summary.md §What Was Built

### Per-scenario shell wrappers

- [x] CHK-330 [P0] All 23 wrappers exist at `scenarios/DOC-323-*.sh` ... `DOC-347-*.sh` (REQ-011) — see implementation-summary.md §What Was Built
- [x] CHK-331 [P0] All 23 wrappers pass `bash -n` (REQ-011) — see implementation-summary.md §Verification
- [x] CHK-332 [P0] Each wrapper invokes the canonical `/doctor:*` command exactly as in 001's Markdown entrypoint (no parallel reimplementation) (REQ-022) — see implementation-summary.md §What Was Built
- [x] CHK-333 [P0] Each wrapper maps 1:1 to its matching .md scenario file in `23--doctor-commands/` — see implementation-summary.md §What Was Built
<!-- /ANCHOR:sandbox-harness -->

---

<!-- ANCHOR:smoke-tests -->
## Phase E: Verification Gates G1-G7

- [x] CHK-400 [P0] G1: `validate_document.py --type spec` fallback per scenario .md exits 0 each (23 files) — see implementation-summary.md §Verification
- [x] CHK-401 [P0] G2: `python3 -c "import yaml; yaml.safe_load(open('docker-compose.yml'))"` exits 0; `python3 -m json.tool < fixtures/manifest.json` exits 0 — see implementation-summary.md §Verification
- [ ] CHK-402 [P1] G3: `validate.sh 002-... --strict` exits 0 (acknowledge known cross-packet template-manifest issue per 002 + 003 packet precedent)
- [ ] CHK-403 [P0] G4: `validate.sh 013-... --strict` exits 0 (lean-trio detection works at parent)
- [x] CHK-404 [P0] G5: `bash _sandbox/23--doctor-commands/harness/run-all.sh --dry-run` exits 0 — see implementation-summary.md §Verification
- [x] CHK-405 [P0] G6: `for s in _sandbox/23--doctor-commands/**/*.sh; do bash -n "$s"; done` exits 0 each — see implementation-summary.md §Verification
- [x] CHK-406 [P0] G7: Manual visual confirm of root playbook updates (23-- in canonical sources, 23 entries in Section 12) — see implementation-summary.md §Verification
<!-- /ANCHOR:smoke-tests -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Area | Expected Evidence |
|------|-------------------|
| Template structure | `validate.sh --strict --verbose` with zero `TEMPLATE_HEADERS` and `ANCHORS_VALID` issues |
| Scenario docs | 23 validator-clean playbook files |
| Sandbox | 30 shell scripts passing `bash -n` and dry-run count matching 23 scenarios |
| Root playbook | `23--doctor-commands/` listed and IDs 323-336, 338-342, 344-347 (gaps at 337 + 343 — see decision-record.md ADR-008) indexed |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-ARCH-001 [P1] Scenario, root playbook, and sandbox layers match `plan.md` architecture.
- [ ] CHK-ARCH-002 [P1] ADR-001 through ADR-007 remain consistent with implemented paths.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-PERF-001 [P2] Dry-run harness completes without invoking Docker or fixture downloads.
- [ ] CHK-PERF-002 [P2] Long-running scenarios document expected runtime and skip/timeout behavior.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-DEPLOY-001 [P1] Fixture placeholders are documented before real sandbox execution.
- [ ] CHK-DEPLOY-002 [P1] Docker-dependent checks remain clearly separable from syntax/dry-run checks.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-COMP-001 [P0] Level 3 template contract passes for packet docs.
- [ ] CHK-COMP-002 [P1] Root playbook indexing follows existing feature catalog conventions.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-DOCV-001 [P0] Cross-references from tasks/checklist back to `spec.md` REQs remain valid.
- [ ] CHK-DOCV-002 [P1] Implementation summary records delivered work, verification, and known limitations.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

- [ ] CHK-SIGN-001 [P0] Final strict validation output is captured in the closeout response.
- [ ] CHK-SIGN-002 [P1] Any residual issue is named with a reason and next safe action.
<!-- /ANCHOR:sign-off -->

---

<!-- ANCHOR:close -->
## Close

- [ ] CHK-500 [P0] `decision-record.md` captures 5 ADRs (REQ-023)
- [ ] CHK-501 [P0] `implementation-summary.md` authored with evidence per REQ; `_memory.continuity.completion_pct: 100`
- [ ] CHK-502 [P0] `_memory.continuity` blocks updated across all packet docs
- [ ] CHK-503 [P0] `/memory:save` run; POST-SAVE QUALITY REVIEW HIGH issues addressed
- [ ] CHK-504 [P1] Phase parent 013 `graph-metadata.json` `derived.last_active_child_id` updated (002 most recently saved)
- [ ] CHK-505 [P1] No autobranch lingering; branch is `main`
<!-- /ANCHOR:close -->
