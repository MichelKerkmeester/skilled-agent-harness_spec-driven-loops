---
title: "Code Graph Phase 007: Resilience Research"
description: "Deep-research packet that produced the verification battery, staleness model, recovery playbook, and exclude-rule confidence tiers needed to gate Phase B of the /doctor:code-graph command. Converged after 12 iterations with all 4 deliverables shipped."
trigger_phrases:
  - "phase 007 changelog"
  - "code graph resilience research"
  - "verification battery"
  - "staleness model"
  - "recovery playbook"
  - "exclude-rule confidence"
importance_tier: "important"
contextType: "research"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-25

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph` (Level 2)
> Parent packet: `027-graph-and-context-optimization/004-code-graph`

### Summary

The `/doctor:code-graph` Phase B (apply mode) needed four authoritative inputs before it could safely auto-fix issues: a verification battery to prove fixes worked, a staleness model to know when the graph was freshly enough for diagnostics, a recovery playbook to guide operator actions, and exclude-rule confidence tiers to calibrate bloat-dir detection.

A deep-research packet produced all four:

1. **Verification battery** (`assets/code-graph-gold-queries.json`). A gold-query set of 47 structural queries with expected results. The battery serves as a regression guard that `/doctor:code-graph apply` can run after every fix to prove nothing broke.
2. **Staleness model** (`assets/staleness-model.md`). A multi-factor freshness computation that considers `last_scan_at`, file-system mtimes, and git HEAD. The model defines three states (fresh, stale, absent) and the diagnostic confidence level for each state.
3. **Recovery playbook** (`assets/recovery-playbook.md`). Twelve operator scenarios with symptom-to-action mappings. Each scenario lists the probable cause, the diagnostic command to confirm, and the recovery action (with the /doctor command where applicable).
4. **Exclude-rule confidence tiers** (`assets/exclude-rule-confidence.json`). Calibrated confidence scores for 18 bloat-directory patterns. Each entry has a confidence level (high/medium/low) and an evidence trace. The tiers feed the `/doctor:code-graph` bloat-check diagnostic.

The research converged after 12 iterations. Iterations 1 through 7 produced the raw findings. Iterations 8 through 12 refined the four deliverables against a convergence checkpoint that validated each asset against the live code-graph database.

### Added

- `assets/code-graph-gold-queries.json` (NEW): 47 structural query battery
- `assets/staleness-model.md` (NEW): Multi-factor freshness computation
- `assets/recovery-playbook.md` (NEW): 12 operator scenarios with symptom-to-action mappings
- `assets/exclude-rule-confidence.json` (NEW): 18 calibrated exclude-rule patterns

### Changed

- None. Research phase with net-new assets only.

### Fixed

- None. Research phase with net-new assets only.

### Verification

- Gold-query battery: all 47 queries validated against the live code-graph database.
- Staleness model: three-state classification tested on fresh, 1-day-stale, and 1-week-stale databases.
- Recovery playbook: 12 scenarios walkthrough-tested, all symptom-to-action paths confirmed.
- Exclude-rule confidence tiers: 18 patterns checked against the live repository directory structure.
- Deep-research state: 12 iterations, convergence reached. Research MD synthesis document shipped.

### Files Changed

| File | What changed |
|------|--------------|
| `assets/code-graph-gold-queries.json` (NEW) | 47 structural query battery |
| `assets/staleness-model.md` (NEW) | Multi-factor freshness computation |
| `assets/recovery-playbook.md` (NEW) | 12-scenario operator playbook |
| `assets/exclude-rule-confidence.json` (NEW) | 18 calibrated confidence patterns |
| `research/` (NEW) | Deep-research iterations, deltas, state, config, findings, and synthesis |

### Follow-Ups

- **Phase B unblocked.** All four authoritative inputs are produced. The gating condition for `/doctor:code-graph` Phase B (apply mode) is met. Phase B implementation can proceed.
- **Gold-query battery drift monitoring.** The battery should be rerun on a schedule to detect indexer regressions. A follow-up automation packet could wire periodic battery runs.
