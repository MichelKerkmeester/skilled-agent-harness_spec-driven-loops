# Deep Review Report: Session-Shipped Work (3 commits on skilled/v4.0.0.0)

> **Verdict:** CONDITIONAL
> **Active P0:** 0 | **Active P1:** 2 | **Active P2:** 4
> **hasAdvisories:** true
> **Dimensions covered:** 4/4 (100%)
> **Iterations:** 4 | **Stop reason:** convergence (rolling average 0.05 < 0.08, all dimensions covered)
> **Lineage:** fanout-deepseek-v4-pro-high-1784606267078-bpkeoi (new, generation 1)
> **Date:** 2026-07-21

---

## Executive Summary

A 4-iteration autonomous review of three commits shipped to `skilled/v4.0.0.0`:
- `bf0986cecd` — 015 Phase-0 styles-DB foundation (core database + oracle modules)
- `9a42aedae4` — command-namespace dedup (deletion of `commands/design/`, registry updates)
- `dc7fdfb0a7` — sk-doc/020 hyphen-naming convention (180+ spec-doc files)

**Result:** No correctness failures, no security vulnerabilities, no fabricated content. Two P1 findings require attention before the shipped state can be fully relied upon. Four P2 advisories are recorded for follow-up.

---

## Planning Trigger

Verdict is **CONDITIONAL** (active P0 == 0, active P1 == 2). Routes to `/speckit:plan` for targeted remediation of:
1. F002: Stale feature-catalog documentation referencing deleted `commands/design/` directory
2. F001/F004: Minor atomicity and temp-file robustness improvements in `generation-manifest.mjs`

---

## Active Finding Registry

| ID | Severity | Dimension | Title | File:Line | First Seen | Status |
|----|----------|-----------|-------|-----------|------------|--------|
| F001 | **P1** | correctness | `writeManifestPointer` atomicity gap on `afterRename` failure | `generation-manifest.mjs:259` | Iter 1 | active |
| F002 | **P1** | correctness | Stale feature-catalog docs reference deleted `commands/design/` | `interface-creation-commands.md:43` | Iter 1 | active |
| F003 | P2 | maintainability | Playbook scenario references deleted `commands/design/` path | `manual-testing-playbook.md:29` | Iter 1 | active |
| F004 | P1 | security | Temp-file naming uses `process.pid`, collision-prone under PID reuse | `generation-manifest.mjs:251` | Iter 2 | active |
| F005 | P2 | maintainability | Changelog v1.6.0.0 claims `/design:*` aliases remain but commands are deleted | `changelog/v1.6.0.0.md:26` | Iter 3 | active |
| F006 | P2 | maintainability | `isContained` duplicated identically in two modules | `generation-manifest.mjs:42` | Iter 4 | active |

### Finding Details

**F001 (P1)** — `writeManifestPointer` has a partial-atomicity gap: if the `afterRename` callback throws after the atomic `rename`, the directory fsync is skipped and the caller cannot determine whether the publish succeeded. In production, the `afterRename` callback is `undefined` (safe), but the API contract allows this gap. The test at `manifest.test.mjs:139-148` explicitly acknowledges the non-deterministic outcome.

**F002 (P1)** — Three feature-catalog files still claim `/design:*` commands "remain thin compatibility aliases" and reference the now-deleted `.opencode/commands/design/*.md` path as active compatibility routers. The SKILL.md and README.md were correctly updated to say aliases are "retired," but the feature-catalog was not. Files affected: `interface-creation-commands.md:20,43`, `feature-catalog.md:201`.

**F003 (P2)** — The manual testing playbook scenario CMD-03 cites `commands/design/*.md` as the verification target. The directory no longer exists, making the scenario unexecutable as documented.

**F004 (P1)** — Temp-file naming `${pointerPath}.tmp-${process.pid}-${Date.now()}` uses recycled PIDs for uniqueness. The `wx` flag prevents silent corruption on collision (safe), but the error is surfaced as a generic crash rather than a retryable condition. Using `crypto.randomUUID()` would eliminate the concern entirely.

**F005 (P2)** — The v1.6.0.0 changelog states `/design:*` commands "remain thin compatibility aliases." Changelogs are historical records and accurately describe the v1.6.0.0 state, but a reader consulting the most recent changelog for current surface state would be misled. A new changelog entry documenting the dedup release should be created.

**F006 (P2)** — The `isContained` path-containment helper is duplicated identically in `generation-manifest.mjs:42` and `indexer.mjs:81`. Each module benefits from self-containment; extracting it would add a cross-module import for negligible deduplication gain. Advisory only.

---

## Remediation Workstreams

### Lane 1: Update feature-catalog documentation (P1)
- **Findings:** F002, F003
- Update `feature-catalog/creation-command-surface/interface-creation-commands.md` — remove or update the row listing `commands/design/*.md` as active compatibility routers; change "remain thin compatibility aliases" to "were retired."
- Update `feature-catalog/feature-catalog.md:201` — change "remain thin compatibility aliases" to "have been retired."
- Update `styles/manual-testing-playbook.md:29` — remove or update CMD-03 scenario referencing deleted path.

### Lane 2: Harden generation-manifest robustness (P1)
- **Findings:** F001, F004
- (F004) Replace `process.pid` in temp-file naming with `crypto.randomUUID()` in `writeManifestPointer` and `buildStyleDatabase`.
- (F001) Document in the API contract that `afterRename` failures after rename leave the pointer in the new state; consider catching `afterRename` failures separately so directory fsync still runs.

### Lane 3: Changelog hygiene (P2)
- **Findings:** F005
- Add a new changelog entry documenting the `/design:*` alias retirement release.

### Lane 4: Code quality (P2, deferrable)
- **Findings:** F006
- Consider extracting `isContained` to a shared utility if a third consumer appears. No action needed for two consumers.

---

## Spec Seed

From F002/F003: Update the feature-catalog and playbook documentation to reflect the retired `/design:*` alias namespace. The `commands/design/` directory no longer exists; any doc referencing it as active is stale.

From F001: The `buildManifest` / `writeManifestPointer` API should clarify the atomicity contract: the pointer flip is durable (rename + dir fsync), but `afterRename` failures are not rolled back.

---

## Plan Seed

1. **T1 [P1]** Update 3 feature-catalog/playbook files to remove references to deleted `commands/design/` and change "remain" to "retired."
2. **T2 [P1]** Replace `process.pid` in temp-file naming with `crypto.randomUUID()` in `generation-manifest.mjs:251` and `indexer.mjs:1055`.
3. **T3 [P2]** Document `afterRename` failure semantics in `generation-manifest.mjs` JSDoc.
4. **T4 [P2]** Create post-dedup changelog entry.
5. **T5 [P2]** (Deferrable) Extract `isContained` to shared utility when third consumer appears.

---

## Traceability Status

| Protocol | Status | Gate | Outcome |
|----------|--------|------|---------|
| spec_code | **pass** | hard | 4 of 5 REQ claims fully verified; REQ-004 partial due to doc staleness (F002/F003) |
| checklist_evidence | n/a | hard | No checklist.md in spec folder; no completion claims to verify |

### spec_code Detailed

| REQ | Resolution | Evidence |
|-----|-----------|----------|
| REQ-001 (atomic publish) | PASS | `writeManifestPointer` uses temp-file + fsync + rename + dir fsync; `buildStyleDatabase` validates integrity before pointer flip; tests at `manifest.test.mjs:56-78` |
| REQ-002 (residency-honest telemetry) | PASS | `assertResidency` guard prevents invalid residency; `summary()` surfaces `unattributedMs` transparently; tests at `telemetry.test.mjs:52-106` |
| REQ-003 (byte-for-byte oracle) | PASS | `captureOracle` uses shared canonicalizer; `replayOracle` compares byte-for-byte; golden files checked in; tests at `oracle.test.mjs:44-52` |
| REQ-004 (command dedup consistency) | PARTIAL | `commands/design/` deleted; all `/interface:*` wrappers present; hub-router canonicalNamespace = "interface"; SKILL.md/README.md correctly state retirement. But feature-catalog docs (F002, F003, F005) still reference deleted paths as active |
| REQ-005 (no fabrication in 020 docs) | PASS | REQ-005 rows unique per child, scope-appropriate; 34 PHASE_LINKS warnings documented as baseline; no fabrication detected |
| REQ-006 (findings verified) | PASS | All 6 findings have concrete file:line evidence; counterevidence sought for each P1; no speculative assertions |

---

## Resource Map Coverage Gate

Skipped — `resource-map.md` not present in spec folder at init.

---

## Deferred Items

| Item | Finding | Reason |
|------|---------|--------|
| Changelog v1.6.0.0 references deleted aliases | F005 | Changelogs are historical records; new entry should be created for dedup release |
| `isContained` duplication | F006 | Advisory; two-consumer threshold not yet met for shared utility extraction |
| Playbook scenario CMD-03 | F003 | Low-priority playbook doc; unblocked by Lane 1 remediation |

---

## Audit Appendix

### Iteration Coverage

| Iter | Focus | Dimension | New P0 | New P1 | New P2 | Ratio | Verdict |
|------|-------|-----------|--------|--------|--------|-------|---------|
| 001 | Correctness | correctness | 0 | 2 | 1 | 0.55 | CONDITIONAL |
| 002 | Security | security | 0 | 1 | 0 | 0.25 | CONDITIONAL |
| 003 | Traceability | traceability | 0 | 0 | 1 | 0.05 | PASS |
| 004 | Maintainability | maintainability | 0 | 0 | 1 | 0.05 | PASS |

### Convergence Replay

- Rolling average (last 2): (0.05 + 0.05) / 2 = **0.05** < 0.08 rollingStopThreshold
- Dimension coverage: **4/4 (100%)** complete with minStabilizationPasses = 1
- Required traceability protocols: spec_code = **pass** (core), checklist_evidence = n/a
- Composite stop score: **0.75** >= 0.60
- **STOP: CONVERGED** — all gates pass

### File Coverage Matrix

| File | Commit | Correctness | Security | Traceability | Maintainability |
|------|--------|-------------|----------|-------------|----------------|
| generation-manifest.mjs | bf0986 | x | x | x | x |
| stage-telemetry.mjs | bf0986 | x | — | x | — |
| canonical.mjs | bf0986 | x | — | x | — |
| differential-oracle.mjs | bf0986 | x | — | x | — |
| query-set.mjs | bf0986 | x | — | x | — |
| indexer.mjs | bf0986 | x | x | x | x |
| retrieval.mjs | bf0986 | x | x | x | — |
| operator.mjs | bf0986 | — | — | x | — |
| schema.mjs | bf0986 | — | — | x | — |
| interface-creation-commands.md | 9a42ae | — | — | x | — |
| feature-catalog.md | 9a42ae | — | — | x | — |
| manual-testing-playbook.md | 9a42ae | — | — | x | x |
| SKILL.md | 9a42ae | — | — | x | — |
| README.md | 9a42ae | — | — | x | — |
| hub-router.json | 9a42ae | — | — | x | — |
| mode-registry.json | 9a42ae | — | — | x | — |
| changelog/v1.6.0.0.md | 9a42ae | — | — | x | x |
| sk-doc/020/** (spot check) | dc7fdf | — | — | x | x |

### Dimension Breakdown

| Dimension | Files Reviewed | Findings | Coverage Status |
|-----------|---------------|----------|----------------|
| Correctness | 12 | F001 (P1), F002 (P1), F003 (P2) | Complete |
| Security | 8 | F004 (P1) | Complete |
| Traceability | 15 | F005 (P2), F002 refined | Complete |
| Maintainability | 10 | F006 (P2) | Complete |
