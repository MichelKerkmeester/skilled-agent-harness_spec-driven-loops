---
title: "Deep Review Report: Jev killed-code deletion"
description: "Three DeepSeek review iterations checked that the killed and retired Jev feature code is gone and nothing outside spec folders still references it. Verdict PASS with one pre-existing P2 advisory."
---

# Deep Review Report: Jev killed-code deletion

## 1. Executive Summary

- **Verdict:** PASS
- **hasAdvisories:** true
- **Active findings:** P0 0, P1 0, P2 1
- **Resolved during the run:** R1-P1-001 (fixed in `424cf11a5e` between iterations 2 and 3, confirmed resolved by iteration 3)
- **Scope:** the 54 surviving files the deletion commits edited (`goal-file-manifest.txt`), plus a whole-repository search outside `specs/` and `changelog/` for the 50 deleted paths, their catalog and playbook entry names and the removed `--jev`/`--out` flags.
- **Executor:** `cli-pi`, `opencode-go/deepseek-v4.1-flash` at max reasoning, one iteration per dimension. Stop policy max-iterations at 3.

The deletion is complete. No live code, test, CI step, mirror, command, agent, index or generated file outside `specs/` still imports, runs or describes a deleted scorer or a removed Jev arm. The one real gap the review found, a stale generated leaf registry in system-skill-advisor, is fixed.

## 2. Planning Trigger

`/speckit:plan` is not required. The verdict is PASS, and the single advisory is a one-line count fix that predates the deletion.

```json
{
  "label": "Planning Packet",
  "triggered": false,
  "verdict": "PASS",
  "hasAdvisories": true,
  "activeFindings": [
    {"id": "R2-P2-001", "severity": "P2", "file": ".skilled/skills/sk-doc/feature-catalog/packet-authored-registry-routing/leaf-route-replay.md", "line": 26}
  ],
  "remediationWorkstreams": ["Update the leaf-route gold count from 56 to the replay's current total"],
  "specSeed": [],
  "planSeed": [],
  "findingClasses": ["doc_count_drift"],
  "affectedSurfacesSeed": [".skilled/skills/sk-doc/feature-catalog/packet-authored-registry-routing/leaf-route-replay.md", ".skilled/skills/sk-doc/feature-catalog/feature-catalog.md"],
  "fixCompletenessRequired": false
}
```

## 3. Active Finding Registry

| ID | Severity | Title | Dimension | File:line | Evidence | Fix | Disposition |
|---|---|---|---|---|---|---|---|
| R2-P2-001 | P2 | Two sk-doc catalog docs claim a 56-row leaf-route gold while the replay reports 59 | traceability | `.skilled/skills/sk-doc/feature-catalog/packet-authored-registry-routing/leaf-route-replay.md:26`, `.skilled/skills/sk-doc/feature-catalog/feature-catalog.md:53` | `leaf-route-replay.cjs` prints `total gold=59 scored=58`. No file carries 56 | State 59, or point to the replay's `total gold=` line | Active. Predates the deletion: the deletion added and removed no gold-carrying scenario |

### Resolved

| ID | Severity | Title | Resolution |
|---|---|---|---|
| R1-P1-001 | P1 | system-skill-advisor `leaf-manifest.json` and `leaf-aliases.json` still listed the four deleted scorer-fusion docs | Regenerated with `ci-skill-root-metadata.cjs --fix` in `424cf11a5e`. The fleet gate reads `checked=14 passed=14 failed=0`, and neither file names `tie-break-eval` or `suggested-order-eval` (iteration 3 and the orchestrator each ran the check) |

## 4. Remediation Workstreams

- **P0:** none.
- **P1:** none open. R1-P1-001 is fixed.
- **P2 advisory:** R2-P2-001, the stale gold-row count in two sk-doc catalog docs.

## 5. Spec Seed

None. No spec change is needed.

## 6. Plan Seed

None. The P2 is a two-line doc edit.

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Evidence |
|---|---|---|
| `spec_code` | pass | Deleted basenames are absent from the live tree outside `specs/` and `changelog/`. Replay runs and disk counts match the catalog claims, apart from R2-P2-001 |
| `checklist_evidence` | partial | 051 has no checklist. The deletion commits were cross-checked with `git show --name-status` |

### Overlay Protocols

| Protocol | Status | Evidence |
|---|---|---|
| `skill_agent` | pass | No SKILL.md or agent file names a deleted scorer |
| `agent_cross_runtime` | pass | `.opencode` paths share the source inodes. The `.hermes` copies are in sync and name no deleted scorer |
| `feature_catalog_code` | pass | Every catalog index row points at an existing entry. Counts match disk |
| `playbook_capability` | pass | No playbook index or routing gold names DLR-056, DLR-057, DLR-058, DRV-069 or the deleted advisor and spec-kit scenarios |

AC_COVERAGE: exempt. The packet has no `checklist.md`.

## 8. Deferred Items

- R2-P2-001, the gold-row count, as above.

## Dimension Expansion Map

No pivots, overrides or Council directions. All three configured dimensions (correctness, traceability, maintainability) were covered once. Security was excluded at init because no auth, input or secret surface changed.

## 9. Search Ledger

- **hasSearchDebt:** false
- **Required bug classes covered or ruled out:** dead_code_surface, fixture_staleness, doc_count_drift, stale_generated_artifact, stale_reference, dangling_markdown_link, mirror_drift
- **Ruled out with clean-search proof:**

| ID | Iteration | Bug class |
|---|---|---|
| SL-001 | 1 | dangling_import_or_spawn |
| SL-003 | 1 | removed_flag_reference |
| SL-004 | 1 | mirror_drift |
| SL-005 | 1 | fixture_staleness |
| SL-006 | 1 | survivor_parse_or_import_breakage |
| SL-101 | 2 | stale_generated_artifact |
| SL-102 | 2 | stale_reference |
| SL-104 | 2 | fixture_staleness |
| SL-105 | 2 | dangling_markdown_link |
| SL-201 | 3 | dead_code_surface |
| SL-202 | 3 | dead_code_surface |
| SL-203 | 3 | fixture_staleness |
| SL-204 | 3 | doc_count_drift |
| SL-205 | 3 | stale_generated_artifact |
| SL-206 | 3 | stale_reference |

## 10. Audit Appendix

### Convergence Summary

| Iteration | Dimension | New findings | Verdict |
|---|---|---|---|
| 1 | correctness | P1 R1-P1-001 | CONDITIONAL |
| 2 | traceability | P2 R2-P2-001, R1-P1-001 re-confirmed | CONDITIONAL |
| 3 | maintainability | none, R1-P1-001 resolved | PASS |

Stop reason: maxIterationsReached. The stop policy was max-iterations, so convergence was telemetry only. The graph convergence check read CONTINUE after iterations 1 and 2.

### Process Notes

- The operator stopped the run during iteration 2. That iteration had already written its iteration file, delta and state record, and it passed `verify-iteration.cjs` before the session resumed it.
- Iteration 1's P1 packet sits in its delta rather than as a JSON block in the iteration file, so its claim adjudication was recorded as not passed. That event only vetoes a convergence stop, which this stop policy never used.
- Every worker ran read-only against the target. No file outside `review/` changed during the iterations.

### Sources Reviewed

The 54 files in `goal-file-manifest.txt`, every `leaf-manifest.json`, `leaf-aliases.json`, `graph-metadata.json`, `description.json`, `mode-registry.json` and `hub-router.json` under `.skilled/skills`, the `.hermes` skill copies, `.github/workflows`, package scripts and test globs, the routing gold and benchmark scenario files, and the retrieval fixtures.
