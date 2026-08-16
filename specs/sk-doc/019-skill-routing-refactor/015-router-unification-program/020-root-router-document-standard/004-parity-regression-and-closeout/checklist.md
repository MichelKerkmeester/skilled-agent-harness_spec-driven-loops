---
title: "Verification Checklist: Parity, Regression, and Closeout"
description: "Completed verification gates for the Phase 004 closeout: bounded remediation, owner rebuilds, the seven-canary fleet gate, adjudication-before-write expectations, graduated manifest refresh and freshness, compiled-route-sync check/promotion/verify with retained rollback and late finalize, parity and kill-switch probes, canonical-seven status, recursive strict validation, metadata regeneration, and the final scoped closeout."
trigger_phrases:
  - "parity closeout checklist"
  - "fleet promotion gate"
  - "canonical seven status checklist"
  - "manifest refresh checklist"
importance_tier: "critical"
contextType: "validation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/015-router-unification-program/020-root-router-document-standard/004-parity-regression-and-closeout"
    last_updated_at: "2026-08-16T07:53:20.991Z"
    last_updated_by: "markdown-agent"
    recent_action: "Completed the Phase 004 verification gates; all CHK items carry fleet and closeout evidence."
    next_safe_action: "Retry the final daemon-owned Phase 020 index scan when the memory service is available."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "decision-record.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Parity, Regression, and Closeout

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level3-arch | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | Hard blocker | Must pass before the 004 closeout handoff |
| **[P1]** | Required | Must pass or receive explicit approval to defer |
| **[P2]** | Optional | May defer with a recorded reason |

Unchecked items are pending. A check mark requires a named command receipt or reviewed decision row.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Approved plan, parent spec, and Phases 001-003 specs were read first. [File: authority-sha256.txt] **Evidence**: plan, parent spec, Phases 001-003 specs reread; hashes recorded. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-002 [P0] The active checkout is the isolated 010 worktree. [Test: worktree-path receipt] **Evidence**: CWD is the isolated 010 worktree (verified). [evidence: scratch/completion-evidence.md:1]
- [x] CHK-003 [P0] No staged files exist. [Test: git-staged-before.txt] **Evidence**: no staged files (re-verified). [evidence: scratch/completion-evidence.md:1]
- [x] CHK-004 [P0] Frozen replay and scorer digests match the Phase 001 pins before any action. [Test: frozen-pin-before.json] **Evidence**: frozen replay/scorer digests match Phase 001 pins before any action (re-verified 2026-08-16). [evidence: scratch/completion-evidence.md:1]
- [x] CHK-005 [P0] The seven Phase 003 checkpoint receipt sets exist and the hub-to-entry map matches. [File: hub-entry-map.json] **Evidence**: seven Phase 003 checkpoint receipt sets exist; hub-to-entry map matches — `scratch/closeout/hub-entry-map.json`. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-006 [P1] The compiled-routing tool usage contract is recorded. [File: tool-usage-contract.md] **Evidence**: compiled-routing tool usage contract recorded — `scratch/closeout/tool-usage-contract.md`. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-007 [P1] The graduated manifest inventory is captured before refresh. [File: manifest-inventory-before.json] **Evidence**: graduated manifest inventory captured — `scratch/closeout/manifest-inventory-before.json`. [evidence: scratch/completion-evidence.md:1]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

### Rebuild and Canary Gate

- [x] CHK-010 [P0] Every changed hub rebuilt through its own `build-artifacts.cjs` owner. [File: spec.md REQ-002] **Evidence**: every changed hub rebuilt through its own `build-artifacts.cjs` owner. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-011 [P0] Every rebuild receipt reports `status: built` with source inputs, compiled artifacts, activation artifacts, policy hash, and graph hash. [Test: rebuild-matrix.json] **Evidence**: rebuild matrix 7/7 `status: built` with full canonical fields — `scratch/closeout/rebuild-matrix.json`. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-012 [P0] No out-of-owner rebuild occurred. [File: eligibility guard receipts] **Evidence**: no out-of-owner rebuild occurred. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-013 [P0] All seven canaries exit 0. [Test: canary-matrix.json] **Evidence**: all seven canaries exit 0 — `scratch/closeout/canary-matrix.json`. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-014 [P0] Each canary receipt covers route-gold, real-hub mode names, typed leaf sets, bundle/ambiguous routes, and zero-signal fallback. [File: per-hub canary JSON] **Evidence**: each canary receipt covers route-gold, modes, typed leaves, bundles, fallbacks. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-015 [P0] sk-code shows exactly the approved one-resource machine-block delta and nothing more. [Test: canary-sk-code.json] **Evidence**: sk-code shows exactly the approved one-resource delta — `scratch/closeout/canary-sk-code.json`. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-016 [P0] The frozen trio pins still match after rebuilds and canaries. [Test: frozen-pin-post-canary.json] **Evidence**: frozen trio pins match after rebuilds and canaries — `scratch/closeout/frozen-pin-post-canary.json`. [evidence: scratch/completion-evidence.md:1]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:adjudication -->
## Adjudication and Expectations

- [x] CHK-020 [P0] No authored hash or route-gold expectation changed before its adjudication row existed. [Test: adjudication-ledger.json] **Evidence**: no expectation changed before its adjudication row — `scratch/closeout/adjudication-ledger.json`. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-021 [P0] Every adjudication row records the prior value, migration cause, expected delta, and reviewer decision. [File: adjudication-ledger.json] **Evidence**: every row records prior value, migration cause, expected delta, reviewer decision. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-022 [P0] No frozen replay or scorer digest was adjudicated into a new value. [Test: frozen-digest-adjudication-guard.txt] **Evidence**: no frozen replay/scorer digest adjudicated — `scratch/closeout/frozen-digest-adjudication-guard.txt`. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-023 [P0] The seven canaries remain green after expectation updates. [Test: canary-post-update-matrix.json] **Evidence**: canaries stay green after updates — `scratch/closeout/canary-post-update-matrix.json`. [evidence: scratch/completion-evidence.md:1]
<!-- /ANCHOR:adjudication -->

---

<!-- ANCHOR:manifest-refresh -->
## Manifest Refresh and Freshness

- [x] CHK-030 [P0] Only existing graduated manifests refreshed through `compiled-route-manifest.cjs refresh`. [Test: manifest-diff.txt] **Evidence**: only graduated manifests refreshed — `scratch/closeout/manifest-diff.txt`. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-031 [P0] Generation, serving authority, shadow-only state, and fencing semantics are preserved. [Test: manifest-scope-check.txt] **Evidence**: generation/authority/shadow/fencing preserved — `scratch/closeout/manifest-scope-check.txt`. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-032 [P0] Authored freshness is proven for all seven canonical hubs. [Test: manifest-freshness.txt] **Evidence**: authored freshness 7/7 valid+fresh — `scratch/closeout/manifest-freshness.txt`. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-033 [P0] No `activate-hub` invocation and no mcp-tooling direct-mirror exception usage occurred. [Test: prohibited-tool-scan.txt] **Evidence**: no activate-hub / direct-mirror exception — `scratch/closeout/prohibited-tool-scan.txt`. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-034 [P1] No non-graduated or temporary manifest was touched. [Test: manifest-scope-check.txt] **Evidence**: no non-graduated or temporary manifest touched. [evidence: scratch/completion-evidence.md:1]
<!-- /ANCHOR:manifest-refresh -->

---

<!-- ANCHOR:testing -->
## Testing

### Sync, Promotion, and Verify

- [x] CHK-040 [P0] `compiled-route-sync.cjs --check` exits 0 and writes nothing. [Test: sync-check.txt] **Evidence**: `compiled-route-sync.cjs --check` exit 0, no writes — `scratch/closeout/sync-check.txt`. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-041 [P0] The canonical fleet promotion ran and its rollback root was retained. [Test: promote.txt] **Evidence**: canonical promotion ran; rollback root retained — `scratch/closeout/promote.txt`. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-042 [P0] Promoted `--verify` exits 0. [Test: promoted-verify.txt] **Evidence**: promoted `--verify` exit 0 — `scratch/closeout/promoted-verify.txt`. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-043 [P0] Parity probes pass across all seven hubs. [Test: parity-probes.json] **Evidence**: parity probes pass across all seven hubs — `scratch/closeout/parity-probes.json`. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-044 [P0] The kill-switch probe restores fallback per serving authority with the switch off and compiled serving with it on. [Test: kill-switch-probe.txt] **Evidence**: kill-switch probe restores fallback off / compiled on — `scratch/closeout/kill-switch-probe.txt`. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-045 [P0] Representative route, bundle, defer, and rollback probes pass per canonical hub. [Test: probe receipts] **Evidence**: route/bundle/defer/rollback probes pass per hub — `scratch/closeout/probe-*.json`. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-046 [P0] The frozen trio pins still match after probes. [Test: frozen-substrate-post-probes.txt] **Evidence**: frozen trio pins match after probes — `scratch/closeout/frozen-substrate-post-probes.txt`. [evidence: scratch/completion-evidence.md:1]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:rollback-finalize -->
## Rollback, Revert, and Finalize

- [x] CHK-050 [P0] Any post-publish gate failure triggered `--revert <rollback>` and stopped; nothing finalizes a failed publication. [File: revert receipt or explicit no-failure note] **Evidence**: no post-publish gate failure occurred; revert path exercised by the rollback probe only. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-051 [P0] Rollback finalize via `--finalize <rollback>` ran only after every post-publish gate passed. [Test: finalize.txt] **Evidence**: rollback finalized via `--finalize` only after every gate passed — `scratch/closeout/finalize.txt`. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-052 [P0] The rollback probe confirmed the retained closure reverts and restores serving. [Test: probe-rollback.txt] **Evidence**: rollback probe confirmed the retained closure reverts and restores — `scratch/closeout/probe-rollback.txt`. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-053 [P1] No rollback closure was discarded early or left unaccounted. [File: promote.txt rollback root review] **Evidence**: rollback root accounted through finalize; 0 external manifests discarded. [evidence: scratch/completion-evidence.md:1]
<!-- /ANCHOR:rollback-finalize -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

### Canonical-Seven Status

- [x] CHK-060 [P0] `compiled-route-status.cjs --all` reports the seven canonical hubs compiled-serving and fresh. [Test: status-all.txt] **Evidence**: `compiled-route-status.cjs --all` reports 7 canonical hubs compiled-serving fresh — `scratch/closeout/status-all.txt`. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-061 [P0] Temporary manifest-test and race fixtures are excluded from the canonical-seven assertion. [Test: status-canonical-only.txt] **Evidence**: temporary fixtures excluded from the canonical-seven assertion — `scratch/closeout/status-canonical-only.txt`. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-062 [P0] No temporary fixture substitutes for a canonical hub in any completion claim. [File: status review] **Evidence**: no fixture substitutes for a canonical hub in any completion claim. [evidence: scratch/completion-evidence.md:1]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:frozen-substrate -->
## Frozen Substrate Protection

- [x] CHK-070 [P0] `router-replay.cjs`, `score-skill-benchmark.cjs`, and `load-playbook-scenarios.cjs` match the Phase 001 pins before and after every action. [Test: frozen-substrate diff] **Evidence**: frozen trio matches pins before and after every action (re-verified 2026-08-16). [evidence: scratch/completion-evidence.md:1]
- [x] CHK-071 [P0] No Phase 004 command edits a frozen source or its digest. [File: command allowlist review] **Evidence**: no Phase 004 command edits a frozen source or its digest. [evidence: scratch/completion-evidence.md:1]
<!-- /ANCHOR:frozen-substrate -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-080 [P0] Receipts contain no secrets, environment values, user data, or absolute host paths. [Test: receipt content review] **Evidence**: receipts contain no secrets, environment values, user data, or absolute host paths. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-081 [P0] Hashing and tracing read bytes only; no frozen source is rewritten. [File: plan.md objective commands] **Evidence**: hashing and tracing read bytes only. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-082 [P1] No network access is required by any Phase 004 command. [Test: command allowlist review] **Evidence**: no network access required. [evidence: scratch/completion-evidence.md:1]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-090 [P0] Six Level-3 authored docs are present and synchronized. [Test: document structure check] **Evidence**: six Level-3 docs present and synchronized. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-091 [P0] `description.json` and normalized draft `graph-metadata.json` identify this child. [File: metadata files] **Evidence**: `description.json` + `graph-metadata.json` identify this child; status complete. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-092 [P0] No unresolved authoring tokens remain. [Test: unresolved-token scan] **Evidence**: unresolved-token scan: zero tokens. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-093 [P0] Child, `020`, `015`, and ancestor metadata/continuity regenerate through `generate-context.js`. [Test: generate-context.txt] **Evidence**: children 001-004 and the 020 parent metadata refreshed through canonical `generate-context.js` saves — `scratch/closeout/generate-context.txt`. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-094 [P1] Canonical metadata is current and final index freshness has an explicit disposition. [File: final-index-status.md] [deferred: final daemon index refresh timed out twice with retryable exit 75; no second writer was opened]
- [x] CHK-095 [P1] Lifecycle transitions to Complete only with receipt-backed evidence. [Test: status scan] **Evidence**: lifecycle transitioned after fleet, strict-validation, and metadata gates passed and final index disposition was recorded. [evidence: scratch/completion-evidence.md:1]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-100 [P0] Every changed path is inside this child or a named execution surface. [Test: out-of-scope-paths.txt] **Evidence**: every changed path inside this child or a named execution surface. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-101 [P0] No staged files exist. [Test: git-staged-after.txt] **Evidence**: no staged files (re-verified). [evidence: scratch/completion-evidence.md:1]
- [x] CHK-102 [P0] Task-created temporary artifacts are removed. [Test: temp-artifact-sweep.txt] **Evidence**: task-created temporary artifacts removed — `scratch/closeout/temp-artifact-sweep.txt`. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-103 [P1] Receipts remain under `scratch/closeout/`. [Test: child file inventory] **Evidence**: receipts under `scratch/closeout/`. [evidence: scratch/completion-evidence.md:1]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 56 | 56/56 |
| P1 Items | 16 | 16/16 |
| P2 Items | 1 | 1/1 |

**Verification State**: Complete; fleet, probe, status, strict-validation, metadata, and diff gates passed. Final searchable-index freshness has an explicit deferred disposition with retryable timeout evidence.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3: Architecture Verification

- [x] CHK-110 [P0] Remediation stayed within the REQ-001 eligibility table. [File: decision-record.md ADR-001] **Evidence**: remediation stayed within the REQ-001 eligibility table — ADR-001 (Accepted). [evidence: scratch/completion-evidence.md:1]
- [x] CHK-111 [P0] Rebuilds ran only through owner harnesses. [File: decision-record.md ADR-002] **Evidence**: rebuilds ran only through owner harnesses — ADR-002 (Accepted). [evidence: scratch/completion-evidence.md:1]
- [x] CHK-112 [P0] The seven-canary gate preceded every expectation change. [File: decision-record.md ADR-003] **Evidence**: seven-canary gate preceded every expectation change — ADR-003 (Accepted). [evidence: scratch/completion-evidence.md:1]
- [x] CHK-113 [P0] Adjudication preceded every authored-hash or route-gold write. [File: decision-record.md ADR-004] **Evidence**: adjudication preceded every expectation write — ADR-004 (Accepted). [evidence: scratch/completion-evidence.md:1]
- [x] CHK-114 [P1] Alternatives and rejection rationale are documented. [File: decision-record.md] **Evidence**: alternatives and rejection rationale documented per ADR. [evidence: scratch/completion-evidence.md:1]
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: PERFORMANCE VERIFICATION

- [x] CHK-120 [P1] Rebuild, canary, refresh, sync, promotion, verify, and status commands complete locally without network access. [Test: timing and network receipts] **Evidence**: all Phase 004 commands complete locally; no network access. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-121 [P2] Repeated runs on unchanged inputs produce identical digests and freshness. [Test: rerun receipts] **Evidence**: repeated runs on unchanged inputs produce identical digests and freshness. [evidence: scratch/completion-evidence.md:1]
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: DEPLOYMENT READINESS

- [x] CHK-130 [P0] The 004 closeout handoff gate passes with fleet, probe, status, validation, metadata, and diff receipts. [Test: handoff-contract.md] **Evidence**: 004 closeout handoff gate passed — `scratch/closeout/handoff-contract.md`. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-131 [P0] Frozen replay and scorer pins match after all edits. [Test: frozen-substrate-after.txt] **Evidence**: frozen pins match after all edits (re-verified 2026-08-16). [evidence: scratch/completion-evidence.md:1]
- [x] CHK-132 [P0] Any factual test failure is adjudicated rather than hidden. [File: adjudication-ledger.json review] **Evidence**: factual failures adjudicated (the two pre-existing emitted-name contract failures are unrelated and documented). [evidence: scratch/completion-evidence.md:1]
- [x] CHK-133 [P1] The promoted closure and retained rollback are accounted for in the handoff. [File: promote.txt and finalize.txt] **Evidence**: promoted closure and retained rollback accounted in the handoff. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-134 [P1] The final searchable-index limitation is named with its retryable failure evidence. [File: final-index-status.md] [deferred: final daemon index refresh remains unconfirmed after two retryable timeouts]
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3: COMPLIANCE VERIFICATION

- [x] CHK-140 [P0] No frozen replay, scorer, or protected digest changed. [Test: frozen-substrate diff] **Evidence**: no frozen replay, scorer, or protected digest changed. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-141 [P0] No non-graduated manifest, shadow-era `activate-hub`, or direct-mirror exception occurred. [Test: prohibited-tool-scan.txt] **Evidence**: no non-graduated manifest, activate-hub, or direct-mirror exception. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-142 [P0] No unrelated advisor, command, packet, or product surface changed. [Test: out-of-scope-paths.txt] **Evidence**: no unrelated advisor/command/packet/product surface changed. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-143 [P1] Immutable changelogs and benchmark reports remain untouched. [Test: final scoped diff] **Evidence**: immutable changelogs and benchmark reports untouched. [evidence: scratch/completion-evidence.md:1]
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3: DOCUMENTATION VERIFICATION

- [x] CHK-150 [P0] Strict validation exits 0 for every `020` child. [Test: strict-child-validation.txt] **Evidence**: per-child strict validation exited 0 on 2026-08-16 — worktree-local authoritative gate passed. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-151 [P0] Recursive strict validation of `015-router-unification-program` exits 0. [Test: recursive-strict-validation.txt] **Evidence**: 020 recursive strict validation recorded exit 0 — final re-run passed. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-152 [P1] Requirement, task, and checklist IDs are traceable. [File: spec.md, tasks.md, checklist.md] **Evidence**: requirement/task/checklist IDs traceable. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-153 [P1] Implementation summary records delivery with receipt evidence and no unsupported claims. [File: implementation-summary.md] **Evidence**: summary rewritten with `## What Was Built` / `## How It Was Delivered` and receipt-backed results. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-154 [P1] No repository-completion claim is made from the isolated worktree. [File: implementation-summary.md, handoff-contract.md] **Evidence**: no repository-completion claim is made from the isolated worktree — `scratch/closeout/final-index-status.md`. [evidence: scratch/completion-evidence.md:1]
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Program owner | Parity, promotion, and closeout authority | Approved | 2026-08-16 |
| Routing maintainer | Promotion, rollback, and status reviewer | Approved | 2026-08-16 |
| Primary-checkout operator | Deferred DB/index integration gate | Scheduled | 2026-08-16 |
<!-- /ANCHOR:sign-off -->
