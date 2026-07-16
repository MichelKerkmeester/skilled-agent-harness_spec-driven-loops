---
title: "Implementation Plan: cli-external-orchestration benchmark naming (032 phase 005.006)"
description: "Implementation plan for the cli-external-orchestration benchmark boundary: prove the current .gitkeep-only baseline, classify execution-time authored/generated artifacts, update active paths, and preserve benchmark semantics."
trigger_phrases:
  - "cli-external benchmark implementation plan"
  - "benchmark fixture profile storage plan"
  - "cli-external phase 006 plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/006-benchmark"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/006-benchmark"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored benchmark path plan"
    next_safe_action: "Capture the benchmark disposition ledger"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/benchmark/"
      - ".opencode/skills/cli-external-orchestration/SKILL.md"
      - ".opencode/skills/cli-external-orchestration/README.md"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The current benchmark inventory is .gitkeep only."
      - "No benchmark fixture, profile, storage-guide, report, or generated run is present in the live surface."
---
# Implementation Plan: cli-external-orchestration benchmark naming

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | Root `.opencode/skills/cli-external-orchestration/benchmark/` and active benchmark path consumers |
| **Change class** | Benchmark census, authored-path rename if present, generated-output disposition |
| **Execution** | Pinned BASE, zero-candidate baseline, authored/generated ledger, semantic parity |

### Overview
The live benchmark directory contains only `.gitkeep`; no fixture, profile, storage-guide, report, or run artifact currently exists. The plan records that result first, then rechecks the tree at execution time, maps only authored candidates, and preserves generated output and benchmark data semantics.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 005 playbook handoff and the 032 generated/frozen exemption record are available.
- [ ] Candidate/BASE SHAs and the benchmark-only inventory are captured.
- [ ] `.gitkeep` and any execution-time descendants have an explicit disposition before mutation.

### Definition of Done
- [ ] The empty baseline is evidenced or every authored execution-time candidate has a unique kebab-case target.
- [ ] Generated/frozen output is protected with a recorded disposition.
- [ ] Active benchmark paths resolve and benchmark content contracts match BASE.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Use an authored-path map joined to a generated-output ledger. The current `.gitkeep` is an explicit protected/non-candidate baseline; future fixtures, profiles, storage guides, reports, and runs are classified before any rename.

### Key Components
- **Current boundary**: `benchmark/.gitkeep`, with no authored artifact descendants.
- **Execution-time authored classes**: fixture, profile, storage-guide, report, index, and path directories.
- **Protected classes**: generated runs/raw responses/retries, lockfile output, frozen records, data keys, payload keys, and scenario IDs.
- **Consumers**: root `SKILL.md`, README, indexes, authored reports, and storage/path guides if present.

### Data Flow
BASE benchmark inventory → authored/generated/frozen classification → semantic map → optional authored rename → active reference rewrite → ID/key/score and scope verification.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Capture the benchmark tree and record `.gitkeep` as the current sole entry.
- [ ] Recheck for execution-time fixtures, profiles, storage guides, reports, runs, and archives.
- [ ] Snapshot any scenario IDs, payload keys, profile data, and scores before mutation.

### Phase 2: Implementation
- [ ] Add explicit authored mappings for any discovered in-scope benchmark path; do not create mappings for the empty baseline.
- [ ] Update active benchmark path references only when they point at mapped authored targets.
- [ ] Preserve generated output, data keys, scenario IDs, fixtures/profiles, and scores.

### Phase 3: Verification
- [ ] Re-enumerate every benchmark descendant and reconcile it with the ledger.
- [ ] Resolve active authored paths and search for stale source names.
- [ ] Compare content contracts with BASE and hand the disposition/hash to phase 007.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Re-run the benchmark census and prove `.gitkeep` is the only current entry or enumerate every execution-time addition |
| REQ-002 | Compare authored candidates with explicit source-target rows and search for stale authored source paths |
| REQ-003 | Review runs/raw/retry/generated/frozen dispositions and prove no mechanical output rewrite occurred |
| REQ-004 | Compare scenario IDs, fixture/profile data, report/payload keys, model/data keys, and scores with BASE |
| REQ-005 | Confirm phase 007 receives paths, dispositions, hash, commands, exit codes, and unresolved findings |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The phase consumes phase 005's playbook handoff and the 032 authored/generated/frozen boundary. It is intentionally tolerant of a zero-candidate live tree and must not absorb non-benchmark component or release work.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert any authored benchmark path/reference changes if a collision, stale path, or semantic mismatch appears. Abort before commit on an uncertain generated-output classification; preserve the evidence and return the item to its owning release or generation workflow.
<!-- /ANCHOR:rollback -->

