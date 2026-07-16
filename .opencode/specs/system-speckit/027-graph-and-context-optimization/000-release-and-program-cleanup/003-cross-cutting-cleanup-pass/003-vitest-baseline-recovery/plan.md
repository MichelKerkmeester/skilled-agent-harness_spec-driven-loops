---
title: "Implementation Plan: Vitest baseline recovery"
description: "Plan for classifying and restoring the 198-test vitest baseline drift packet."
trigger_phrases:
  - "vitest baseline recovery"
  - "198 vitest failures"
  - "baseline reconciliation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/003-vitest-baseline-recovery"
    last_updated_at: "2026-05-08T21:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored baseline recovery plan"
    next_safe_action: "Continue runtime regression follow-up"
    blockers: ["post-run still has 196 failures"]
---
# Implementation Plan: Vitest baseline recovery

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Surface** | OPENCODE system-spec-kit MCP server tests |
| **Runner** | Vitest via `pnpm vitest run` |
| **Packet Root** | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/003-vitest-baseline-recovery/` |
| **Baseline Input** | `/tmp/vitest-baseline-pre-recovery.json` copied into packet scratch |
| **Baseline Output** | `/tmp/vitest-baseline-post-recovery.json` copied into packet scratch |

### Overview

This packet captures the current full-suite vitest baseline, classifies every failing test into the four spec-defined buckets, fixes narrow fixture drift and small runtime regressions, quarantines irreducible environmental or flaky failures with explicit annotations, and corrects the v3.4.1.0 changelog verification row.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Spec identifies scope, constraints, and forbidden Unit A files.
- [x] Four-bucket triage taxonomy is defined in `spec.md`.
- [x] Follow-up placeholder format is approved: `026/000/002-vitest-baseline-recovery-followup`.
- [x] Changelog replacement policy is approved.

### Definition of Done

- [ ] Pre-recovery JSON baseline is captured in `scratch/`.
- [ ] All pre-recovery failures are classified into drift, regression, environmental, or flaky.
- [ ] Fixture drift and small runtime regressions are fixed in packet scope.
- [ ] Skips carry `// REASON:`, `// followup:`, or `// flake-rate:` annotations.
- [ ] Post-recovery JSON baseline is captured in `scratch/`.
- [ ] v3.4.1.0 changelog "Core test suites (vitest)" row reflects the post-recovery truth.
- [ ] Strict spec validation exits 0.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Baseline repair by evidence-first classification. The test JSON is the inventory source; code and test edits are scoped to the failing-test owner files and narrow implementation files only when a runtime regression is proven and small enough to repair safely.

### Key Components

- **Vitest JSON reports**: durable pre/post baseline artifacts copied into packet `scratch/`.
- **Triage ledger**: packet-local classification artifact mapping every failing test to a bucket and action.
- **Fixture updates**: expectation-only edits where shipped behavior is already correct.
- **Runtime fixes**: single-file, <=30 LOC repairs only.
- **Quarantine annotations**: explicit skip/fails-skip comments for environmental, flaky, or follow-up cases.
- **Release-note correction**: changelog row aligned to measured post-recovery numbers.

### Data Flow

1. Run full vitest suite and store JSON report.
2. Extract failed test cases and group by file/surface.
3. Classify each failure from assertion output, nearby source, shipped behavior, and commit history.
4. Apply the narrowest valid action per classification.
5. Re-run full vitest suite and compare against the pre-recovery inventory.
6. Write final counts into checklist, implementation summary, metadata, and changelog.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Capture pre-recovery full vitest JSON report.
- [ ] Copy the report to packet `scratch/vitest-baseline-pre-recovery.json`.
- [ ] Generate a triage inventory from the JSON report.
- [ ] Confirm Unit A forbidden files remain untouched.

### Phase 2: Core Implementation

- [ ] Classify each failing test into one of the four required buckets.
- [ ] Fix fixture-drift failures with `// drift:` packet comments.
- [ ] Fix small runtime-regression failures, or annotate follow-up skips.
- [ ] Skip environmental failures with `// REASON:` comments.
- [ ] Sample suspected flaky failures five times and quarantine if unreliable.
- [ ] Update v3.4.1.0 changelog row with post-recovery counts.

### Phase 3: Verification

- [ ] Capture post-recovery full vitest JSON report.
- [ ] Copy the report to packet `scratch/vitest-baseline-post-recovery.json`.
- [ ] Verify zero new failures relative to the pre-recovery baseline.
- [ ] Run OPENCODE alignment verification for changed scope.
- [ ] Run strict spec validation.
- [ ] Fill implementation summary and mark checklist evidence.
- [ ] Refresh `description.json` and `graph-metadata.json` to complete / 100%.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tooling | Success Signal |
|-----------|-------|---------|----------------|
| Full baseline | Entire MCP server vitest suite | `pnpm vitest run --reporter=json` | Post report has zero new failures against triage baseline |
| Targeted reruns | Modified test files/surfaces | `pnpm vitest run <paths>` | Edited files pass or are explicitly quarantined |
| Flake sampling | Suspected nondeterministic tests | 5 repeated vitest runs | 5/5 pass or skip with flake-rate |
| Spec validation | Packet documentation | `validate.sh --strict` | Exit 0 |
| Alignment | Changed `.opencode/` scope | `verify_alignment_drift.py` | Exit 0 or documented non-applicability |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| pnpm dependencies | Tooling | Available in MCP server workspace | Cannot capture baseline |
| Vitest JSON reporter | Tooling | Required | Cannot build deterministic triage inventory |
| Git history/blame | Research | Required when packet lineage is ambiguous | Drift comments may need placeholder lineage |
| CocoIndex daemon | Environmental | Not assumed available | Daemon-dependent tests may be skipped with reason |
| Unit A forbidden files | Scope constraint | Must remain untouched | Packet violates explicit user constraint if modified |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Post-recovery run introduces new failures, touches Unit A files, or misclassifies shipped behavior.
- **Procedure**: Revert only this packet's test/code/changelog/doc changes, keep the captured pre-recovery JSON for evidence, and re-run the baseline command.
- **Data reversal**: Remove packet-local scratch reports only if the packet is abandoned; otherwise keep them as audit artifacts.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 1 baseline capture -> Phase 2 classify/fix/quarantine -> Phase 3 post-run + docs
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Authored `spec.md` | All classification work |
| Implementation | Pre-recovery JSON report | Post-recovery verification |
| Verification | Applied triage actions | Completion metadata and changelog truth |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup and inventory | Medium | 30-60 minutes |
| Triage and fixes | High | 3-6 hours |
| Verification and docs | Medium | 1-2 hours |
| **Total** | | **4.5-9 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-completion Checklist

- [ ] Confirm no Unit A files changed.
- [ ] Confirm all skip annotations include required reason or follow-up metadata.
- [ ] Confirm changelog row is derived from the post-recovery JSON.

### Rollback Procedure

1. Restore modified test/code/changelog files from git.
2. Keep or archive `scratch/vitest-baseline-pre-recovery.json` for audit.
3. Re-run `pnpm vitest run --reporter=json` to confirm the original baseline has returned.
4. Re-run strict spec validation after reverting packet docs or metadata.

<!-- /ANCHOR:enhanced-rollback -->
