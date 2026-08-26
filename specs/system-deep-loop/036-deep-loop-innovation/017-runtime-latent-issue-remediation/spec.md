---
title: "Feature Specification: System-Deep-Loop Runtime Latent-Issue Remediation"
description: "Verify-then-fix remediation of the P0 and P1 findings from the 016 broad audit (deep-review + deep-research): the append-gateway silent-divergence P0, the fanout-merge severity/abort bugs, reducer availability and projection-read issues, salvage/repair data-loss paths, pool retry-credit and sandbox gaps, write-containment edge cases, convergence loop-type coverage, and the residual 015-drift documentation contradictions. Each finding is re-verified against source before any fix; observation-only P2s are deferred unless co-located in a touched file."
trigger_phrases:
  - "system-deep-loop runtime remediation"
  - "016 findings remediation"
  - "append gateway fail-closed fix"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/017-runtime-latent-issue-remediation"
    last_updated_at: "2026-08-26T05:20:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded the remediation packet as bound write authority"
    next_safe_action: "Baseline the runtime test suite, then run the verify-then-fix fan-out"
    blockers: []
    key_files:
      - "spec.md"
      - "decision-record.md"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Scope? P0 + all P1s from the 016 review + research; verify-then-fix; co-located P2s optional."
      - "Executor? Sonnet 5 at xhigh, multi-workstream fan-out over disjoint files."
---
# Feature Specification: System-Deep-Loop Runtime Latent-Issue Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2026-08-26 |
| **Source audit** | `016-system-deep-loop-review` (CONDITIONAL: 0 P0 / 10 P1 / 21 P2 review + 1 P0 / 15 P1 / 26 P2 research) |
| **Branch** | `worktrees/022-012-runtime-enablement-build` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The 016 broad audit surfaced one confirmed P0 and roughly nineteen P1 findings across the shipped system-deep-loop runtime. The most serious, F-029, is a silent-divergence path: the append gateway returns `ok: true` and the CLI exits `0` even when the projection refresh fails, so the typed ledger advances while the legacy state-log projection the reducer reads goes stale, with no signal. This defeats the exact single-writer contract the 015 remediation was built to establish. Alongside it sit correctness bugs in the merge gate (severity downgrade, whole-merge abort), reducer availability failures (a warning refuses to write already-computed output), salvage/repair data-loss paths (truncate-after-first-bad-line, identical-clone recovery), pool resilience gaps (lost retry credit), and three residual documentation contradictions the 015 work left behind.

Left unremediated, these are latent faults in the machinery every `/deep:*` command depends on: a review could silently drop a P0, a reducer could refuse to emit a report, or a corrupt log line could erase later iterations — each failing quietly rather than loudly.

### Purpose

Remediate the confirmed P0 and all P1 findings by verifying each against current source, fixing the real ones at root cause, adjusting or adding tests, and re-running the whole runtime test suite against a captured baseline — so the deep-loop runtime fails closed and loud where it currently fails silent, with no new test regressions.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

Verify-then-fix the following, partitioned into disjoint-file workstreams so parallel agents never collide:

- **WS-GATEWAY** — `lib/mode-append-gateway/append-mode-event.ts`, `scripts/append-mode-event.cjs`: F-029 (P0, gateway `ok:true` on projection-refresh failure → fail closed), F-032 / review P1-1 (zero-SHA cutover-binding fallback), co-located P2s F-030 (O(n²) replay) and F-031 (legacy upcast deep-research-only) at the fixer's discretion.
- **WS-MERGE** — `scripts/fanout-merge.cjs`: F-010 (severity defaults to P2 in reconstruction), F-011 (findingsCount mismatch aborts the whole merge — add per-lineage isolation), plus co-located `buildAttributionMd` active-disposition filter (015/WS7 P2) and F-009 (cross-list duplication).
- **WS-REDUCER** — `scripts/reduce-state.cjs`, `scripts/reduce-alignment-state.cjs`: review P1-3 (ANCHOR vs MACHINE-OWNED dialect duplicates sections), review P1-8 / F-014 (same-`findingId` / dedup-key false-merge), F-012 (missing anchor blocks all output), F-013 (corruption warning blocks already-computed write), F-015 (reducer reads projection not ledger), F-016 (alignment dedup key includes severity).
- **WS-SALVAGE** — `scripts/fanout-salvage.cjs`, `lib/**/jsonl-repair.ts`: F-001 (salvage bypasses the gateway), F-003 (merge-under-lock race), F-034 (repair truncates after first bad line), F-038 (alignment salvage silently skipped), F-039 (identical recovered text to all missing files), co-located P2s F-002/F-035/F-036/F-042.
- **WS-POOL** — `scripts/fanout-run.cjs`, `scripts/fanout-pool.cjs`, `lib/deep-loop/executor-config.ts`: review P1-2 (budget cap counts worst-case retry as guaranteed spend), F-007 (orphan_requeued loses retry credit), F-022 (post-hoc-only confinement across cli kinds — at minimum document/guard), co-located P2s F-005/F-006/F-008/F-020/F-021/F-023.
- **WS-CONTAINMENT** — `lib/deep-loop/write-containment.ts`: review P1-5 (untracked out-of-scope writes never fail an iteration), review P1-6 (regenerable-state exemption suffix-matches every `description.json`).
- **WS-CONVERGENCE** — `scripts/convergence.cjs`, `scripts/verify-iteration.cjs`: F-024 (loop-type coverage mismatch), co-located P2s F-025/F-026/F-027/F-028.
- **WS-DOCS** — `.opencode/skills/system-deep-loop/deep-review/assets/prompt-pack-iteration.md.tmpl`, `.opencode/commands/deep/review.md`, `deep-review/SKILL.md`, and the deep-review agent mirrors across the six runtimes: review P1-4 (prompt-pack still lists the state log as writable), review P1-7 (final-line verdict contract absent from mirrors), review P1-9 (raise-above-4h timeout semantics the runtime rejects). **Plus (added from operator observation): the deep-research pack `deep-research/assets/prompt-pack-iteration.md.tmpl` gateway instruction is worded such that a weak leaf can rationalize a bypass** — the recent GLM research lineage wrote all ten iterations directly to the state-log projection, appending zero iteration events to the ledger, because it read the containment warning ("a single out-of-scope write fails this lineage") and the "producing findings does not mean running the repo's tooling" line as reasons not to run the gateway CLI. Fix: make gateway usage unambiguous and mandatory, state that the gateway CLI's run-directory writes are IN-SCOPE, and clarify the "don't run tooling" line does not exempt the state gateway. Mirror the same clarity into the deep-review and deep-alignment packs.
- **WS-CONVERGENCE (extended)** — beyond F-024, `verify-iteration.cjs` must DETECT a gateway bypass: an iteration record present in the state-log projection with no corresponding ledger event (no gateway receipt) means the leaf wrote the projection directly. The check should flag/fail such an iteration loudly rather than silently accepting projection-only state (this is the runtime's chance to catch what F-015 and F-028 leave open — the recent GLM run produced a full report from projection-only data with nothing flagging that the ledger held zero iteration events).

### Out of Scope

- P2 findings not co-located in a file a workstream already edits (tracked in 016 for a later pass).
- Re-architecting the gateway, reducer, or pool beyond the minimal fix each finding requires.
- The 016 packet itself (already committed); this packet only cites it.
- Any finding that verification shows to be a false positive — recorded as such, not fixed.

### Files to Change

| File Path | Change Type | Workstream |
|-----------|-------------|------------|
| `lib/mode-append-gateway/append-mode-event.ts` | Modify | WS-GATEWAY |
| `scripts/append-mode-event.cjs` | Modify | WS-GATEWAY |
| `scripts/fanout-merge.cjs` | Modify | WS-MERGE |
| `scripts/reduce-state.cjs` | Modify | WS-REDUCER |
| `scripts/reduce-alignment-state.cjs` | Modify | WS-REDUCER |
| `scripts/fanout-salvage.cjs` | Modify | WS-SALVAGE |
| `lib/**/jsonl-repair.ts` | Modify | WS-SALVAGE |
| `scripts/fanout-run.cjs` | Modify | WS-POOL |
| `scripts/fanout-pool.cjs` | Modify | WS-POOL |
| `lib/deep-loop/executor-config.ts` | Modify | WS-POOL |
| `lib/deep-loop/write-containment.ts` | Modify | WS-CONTAINMENT |
| `scripts/convergence.cjs` | Modify | WS-CONVERGENCE |
| `scripts/verify-iteration.cjs` | Modify | WS-CONVERGENCE |
| `deep-review/assets/prompt-pack-iteration.md.tmpl` | Modify | WS-DOCS |
| `commands/deep/review.md` (+ 5 mirrors) | Modify | WS-DOCS |
| `deep-review/SKILL.md` | Modify | WS-DOCS |
| `runtime/tests/**` | Add/Modify | per workstream |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The append gateway fails closed on projection-refresh failure | When the projection refresh fails, the gateway result and the CLI exit code signal failure (non-zero exit / `ok:false`), so the prompt-pack exit-2-halt fires; a regression test asserts it. |
| REQ-002 | Every fix is verified against source first | Each finding is confirmed real against current source before its fix; false positives are recorded, not patched. |
| REQ-003 | No new test regressions | The whole runtime vitest suite is re-run from the final state and shows no failures that were passing at baseline. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Merge gate never silently drops severity or findings | A reconstructed finding without a severity field does not become P2; one lineage's count mismatch does not abort other lineages' findings. |
| REQ-005 | Reducer stays available under warning-class input | A missing anchor or corruption warning does not block writing already-computed registry/dashboard/strategy. |
| REQ-006 | Salvage and repair preserve data | Repair does not truncate valid records after a bad line; multi-file salvage does not stamp identical text into every gap. |
| REQ-007 | Containment fails an iteration on real out-of-scope writes | Untracked out-of-scope writes are not permanently exempt; the regenerable-state exemption is packet-scoped, not repo-wide. |
| REQ-008 | Residual 015-drift docs corrected | The prompt-pack no longer lists the state log as writable; the final-line verdict contract reaches the mirrors; the review doc's timeout semantics match the runtime. |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: F-029 is fixed and a negative-control test proves the gateway/CLI now fail closed on projection-refresh failure.
- **SC-002**: Every P1 in scope is either fixed with a test or recorded as a verified false positive with evidence.
- **SC-003**: The whole runtime vitest suite passes at least as well as the captured baseline (no new failures).
- **SC-004**: `validate.sh <spec-folder> --strict` exits clean.
- **SC-005**: The scoped diff touches only the files listed in §3 plus tests; no unrelated change.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Shipped runtime powers every `/deep:*` command | A bad fix breaks all deep-loop work | Baseline before, verify-first, whole-suite after, Opus review of every diff before commit |
| Risk | A finding is a false positive | Wasted or harmful edit | Verify against source before fixing; record false positives |
| Risk | Parallel agents collide on a shared file | Corrupt edits | Strict disjoint-file workstream ownership |
| Risk | Agent-mirror sync hook blocks the commit | Commit fails | WS-DOCS syncs all six runtime mirrors |
| Dependency | Captured vitest baseline | The regression yardstick | Full suite run before any edit |
| Dependency | 016 finding registry | The work list | `016/review/review-report.md` + `016/research/research.md` |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking. Scope, executor (Sonnet 5 xhigh fan-out), and the verify-then-fix contract are bound. Push to remotes is gated on a fresh operator go-ahead after the build validates.

<!-- /ANCHOR:questions -->
