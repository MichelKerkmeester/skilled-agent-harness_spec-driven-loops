---
title: "Tasks: Sandbox Testing Playbook [system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/002-sandbox-testing-playbook/tasks]"
description: "Discrete task graph for the 5-phase implementation: scaffold + 23 scenarios via 4 parallel tracks + root playbook update + sandbox harness via cli-codex + verification gates."
trigger_phrases:
  - "002-sandbox-testing-playbook tasks"
  - "doctor playbook tasks"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/z_archive/wave-2-merges/013-002-sandbox-testing-playbook"
    last_updated_at: "2026-05-09T16:15:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored task graph T-001 through T-068 across 5 phases"
    next_safe_action: "Draft checklist"
    blockers: []
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-sandbox-testing-playbook-2026-05-09"
      parent_session_id: null
    completion_pct: 35
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Sandbox Testing Playbook

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

Task IDs use `T-NNN` format. `T-001` through `T-009` cover setup/scaffold work, `T-010` through `T-060` cover implementation work, and `T-061` through `T-068` cover verification and closeout.

| Phase | Task Range | Owner | Wall-Clock |
|-------|-----------|-------|------------|
| Phase A: Scaffold 002 | T-001..T-009 | Claude Opus 4.7 | ≤45 min |
| Phase B: 23 scenarios via 4 parallel tracks | T-010..T-040 | cli-codex (4 parallel) + Claude oversight | ~2-3 h |
| Phase C: Root playbook update | T-041..T-046 | Claude Opus 4.7 | ≤30 min |
| Phase D: Sandbox harness via cli-codex | T-047..T-060 | cli-codex (1 dispatch) + Claude oversight | ~3-4 h |
| Phase E: Verification gates G1-G7 | T-061..T-068 | Claude Opus 4.7 | ≤1 h |

**Critical path**: T-001 → T-009 (scaffold) → T-010 (Phase B starts) ‖ T-047 (Phase D can start in parallel) → T-040 (B done; C unblocks) → T-046 (C done) → T-061 (verification).
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

| ID | Task | REQ | Status |
|----|------|-----|--------|
| T-001 | Verify 013 phase parent lean trio authored | — | ✅ Done |
| T-002 | Author `spec.md` (Level 3, REQ-001..REQ-043) | All REQs | ✅ Done |
| T-003 | Author `plan.md` (5 phases + dispatch design) | — | ✅ Done |
| T-004 | Author `tasks.md` (this file) | — | 🟡 In progress |
| T-005 | Author `checklist.md` (P0/P1/P2 per phase) | All REQs | ⏳ Pending |
| T-006 | Author `decision-record.md` (5 ADRs) | REQ-023 | ⏳ Pending |
| T-007 | Author `resource-map.md` (file ledger) | — | ⏳ Pending |
| T-008 | Run `generate-context.js` → `description.json` + `graph-metadata.json` for 002 | — | ⏳ Pending |
| T-009 | Restore parent 013 graph-metadata manual fields after save | — | ⏳ Pending |
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Phase B: 23 scenarios via 4 parallel tracks

### Track P-MEM (DOC-323..DOC-327, 5 files)

| ID | Task | Filename | Status |
|----|------|----------|--------|
| T-010 | Author DOC-323 fresh-install | `323-doctor-memory-fresh-install.md` | ⏳ |
| T-011 | Author DOC-324 drift detection | `324-doctor-memory-drift-detection.md` | ⏳ |
| T-012 | Author DOC-325 long-pole rebuild | `325-doctor-memory-long-pole-rebuild.md` | ⏳ |
| T-013 | Author DOC-326 SIGINT cancellation | `326-doctor-memory-sigint-cancellation.md` | ⏳ |
| T-014 | Author DOC-327 disk pressure refusal | `327-doctor-memory-disk-pressure.md` | ⏳ |

### Track P-CAUSAL (DOC-328..DOC-330, 3 files)

| ID | Task | Filename | Status |
|----|------|----------|--------|
| T-015 | Author DOC-328 low-coverage drift report | `328-doctor-causal-graph-low-coverage.md` | ⏳ |
| T-016 | Author DOC-329 confidence threshold | `329-doctor-causal-graph-confidence-threshold.md` | ⏳ |
| T-017 | Author DOC-330 add-only enforcement | `330-doctor-causal-graph-add-only.md` | ⏳ |

### Track P-LOOP-COCO (DOC-331..DOC-336, 6 files)

| ID | Task | Filename | Status |
|----|------|----------|--------|
| T-018 | Author DOC-331 deep-loop lazy-init | `331-doctor-deep-loop-lazy-init.md` | ⏳ |
| T-019 | Author DOC-332 deep-loop empty-no-source | `332-doctor-deep-loop-empty-no-source.md` | ⏳ |
| T-020 | Author DOC-333 deep-loop convergence gold-battery | `333-doctor-deep-loop-convergence.md` | ⏳ |
| T-021 | Author DOC-334 cocoindex daemon healthy | `334-doctor-cocoindex-daemon-healthy.md` | ⏳ |
| T-022 | Author DOC-335 cocoindex daemon zombie | `335-doctor-cocoindex-daemon-zombie.md` | ⏳ |
| T-023 | Author DOC-336 cocoindex daemon unreachable | `336-doctor-cocoindex-daemon-unreachable.md` | ⏳ |

### Track P-UPDATE-MIGRATE (DOC-338..DOC-342 + DOC-344..DOC-347, 9 files; gaps at 337 and 343)

| ID | Task | Filename | Status |
|----|------|----------|--------|
| T-025 | Author DOC-338 G5 failure injection mid-rebuild | `338-doctor-update-G5-confirm-failure-injection.md` | ⏳ |
| T-026 | Author DOC-339 G6 concurrent dispatch refusal | `339-doctor-update-G6-concurrent.md` | ⏳ |
| T-027 | Author DOC-340 G7 SIGINT cancellation | `340-doctor-update-G7-sigint.md` | ⏳ |
| T-028 | Author DOC-341 G8 migration gap detection | `341-doctor-update-G8-migration-gap.md` | ⏳ |
| T-029 | Author DOC-342 G9 cross-subsystem dashboard render | `342-doctor-update-G9-dashboard.md` | ⏳ |
| T-031 | Author DOC-344 tier-aware single interactive flow | `344-doctor-update-tier-aware-default.md` | ⏳ |
| T-032 | Author DOC-345 fresh-clone 3.3.0.0 → 3.4.1.0 | `345-version-migration-3.3.0.0-to-3.4.1.0.md` | ⏳ |
| T-033 | Author DOC-346 cleanup-legacy prompts | `346-version-migration-cleanup-legacy.md` | ⏳ |
| T-034 | Author DOC-347 already-current no-op | `347-version-migration-no-op.md` | ⏳ |

### Track Coordination (Phase B)

| ID | Task | REQ | Status |
|----|------|-----|--------|
| T-035 | Draft 4 dispatch prompt files (`dispatch/track-{p-mem,p-causal,p-loop-coco,p-update-migrate}.prompt.md`) | — | ⏳ |
| T-036 | Dispatch P-MEM via cli-codex (background) | REQ-001..REQ-003 | ⏳ |
| T-037 | Dispatch P-CAUSAL via cli-codex (background, parallel) | REQ-001..REQ-003 | ⏳ |
| T-038 | Dispatch P-LOOP-COCO via cli-codex (background, parallel) | REQ-001..REQ-003 | ⏳ |
| T-039 | Dispatch P-UPDATE-MIGRATE via cli-codex (background, parallel) | REQ-001..REQ-003 | ⏳ |
| T-040 | Verify all 4 tracks complete + 23 files exist + each passes per-track verification | REQ-001..REQ-022 | ⏳ |

---

### Phase C: Root playbook update

| ID | Task | REQ | Status |
|----|------|-----|--------|
| T-041 | Read root `manual_testing_playbook.md` to capture current canonical-source-artifacts list + Section 12 head/tail | — | ⏳ |
| T-042 | Edit: insert `23--doctor-commands/` line at end of canonical-source-artifacts list | REQ-004 | ⏳ |
| T-043 | Edit: update `last_updated:` frontmatter to today (2026-05-09) | REQ-006 | ⏳ |
| T-044 | Edit: append 23 entries to Section 12 (Feature Catalog Cross-Reference Index) using canonical pattern `> **Feature File:** [NNN](23--doctor-commands/NNN-filename.md)` | REQ-005 | ⏳ |
| T-045 | (Optional REQ-040) Update scenario count metadata if tracked field exists | REQ-040 | ⏳ |
| T-046 | Verify edits: grep for `23--doctor-commands` (≥1 hit), grep for `Feature File.*\[(32[3-9]\|33[0-9]\|34[0-7])\]` (25 hits) | REQ-004, REQ-005 | ⏳ |

---

### Phase D: Sandbox harness via cli-codex

| ID | Task | REQ | Status |
|----|------|-----|--------|
| T-047 | Draft Phase D dispatch prompt (`dispatch/track-d-sandbox.prompt.md`) | — | ⏳ |
| T-048 | Dispatch via cli-codex with full sandbox file set in scope (background) | REQ-007..REQ-012 | ⏳ |
| T-049 | Verify Dockerfile authored at `_sandbox/23--doctor-commands/Dockerfile` | REQ-007 | ⏳ |
| T-050 | Verify docker-compose.yml authored | REQ-008 | ⏳ |
| T-051 | Verify fixtures/fetch-fixtures.sh + manifest.json + .gitkeep authored | REQ-009, REQ-027 | ⏳ |
| T-052 | Verify 4 harness scripts authored (run-all, reset-state, capture-evidence, assert-signals) | REQ-010, REQ-024, REQ-025, REQ-026 | ⏳ |
| T-053 | Verify 23 per-scenario shell wrappers authored (DOC-323-*.sh ... DOC-347-*.sh) | REQ-011, REQ-022 | ⏳ |
| T-054 | Confirm bash 3.2 compatibility (`set -euo pipefail`, color guards `[[ -t 1 ]]`) | NFR-MN-001, NFR-MN-002 | ⏳ |
| T-055 | Confirm `harness/run-all.sh` emits Markdown rollup with PASS/FAIL/SKIP/UNAUTOMATABLE classification | REQ-026 | ⏳ |
| T-056 | Confirm `harness/capture-evidence.sh` snapshots stdout, exit code, file deltas, snapshot files | REQ-024 | ⏳ |
| T-057 | Confirm `harness/assert-signals.sh` consumes scenario .md "Expected signals" via grep | REQ-025 | ⏳ |
| T-058 | Confirm `fixtures/fetch-fixtures.sh` is idempotent (skip already-fetched + checksum-matched) | REQ-027 | ⏳ |
| T-059 | Confirm `fixtures/manifest.json` declares per-fixture URL + SHA-256 + size + version | REQ-009 | ⏳ |
| T-060 | Confirm per-scenario `.sh` wrappers invoke canonical `/doctor:*` commands exactly as in 001 Markdown entrypoints | REQ-022 | ⏳ |
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

| ID | Task | REQ | Status |
|----|------|-----|--------|
| T-061 | G1: `validate_document.py --type playbook_feature` per scenario .md (23 files) — all valid | REQ-002 | ⏳ |
| T-062 | G2: yaml/json syntax check — `python3 -c "import yaml; yaml.safe_load(...)"` on docker-compose.yml; `python3 -m json.tool < manifest.json` | REQ-008, REQ-009 | ⏳ |
| T-063 | G3: `validate.sh 002-... --strict` — exit 0 (acknowledge known cross-packet template-manifest issue) | — | ⏳ |
| T-064 | G4: `validate.sh 013-... --strict` — exit 0 (lean-trio detection) | REQ-P-001..REQ-P-004 (parent) | ⏳ |
| T-065 | G5: `bash _sandbox/23--doctor-commands/harness/run-all.sh --dry-run` — exit 0 | REQ-012 | ⏳ |
| T-066 | G6: `for s in _sandbox/23--doctor-commands/**/*.sh; do bash -n "$s"; done` — exit 0 each | REQ-010, REQ-011 | ⏳ |
| T-067 | G7: visual confirm of root playbook updates (23-- in canonical sources, 23 entries in Section 12) | REQ-004, REQ-005 | ⏳ |
| T-068 | Author `implementation-summary.md` with evidence per REQ; mark `checklist.md` items `[x]` | — | ⏳ |
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- All P0 tasks in `checklist.md` have either passing evidence or a documented, user-approved deferral.
- G3 strict validation for this packet reports zero `TEMPLATE_HEADERS` and zero `ANCHORS_VALID` issues.
- Scenario files, root playbook entries, sandbox scripts, and implementation summary evidence trace back to `spec.md` requirements.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `REQ-001..REQ-003`: T-010..T-040 scenario authoring and validation.
- `REQ-004..REQ-006`: T-041..T-046 root playbook update.
- `REQ-007..REQ-012`: T-047..T-060 sandbox harness and dry-run gates.
- `REQ-020..REQ-027`: Phase B/D quality checks and wrapper fidelity.
<!-- /ANCHOR:cross-refs -->
