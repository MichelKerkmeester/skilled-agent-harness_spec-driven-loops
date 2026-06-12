---
title: "Changelog: 029-deep-research-remediation"
description: "Progressive changelog for the verify-first remediation program: L1 security/safety, L3 idempotency, L4 launcher parity cluster, L6 partials, L8 adherence, and parts of L9 have shipped while several lanes remain open."
trigger_phrases:
  - "029 deep research remediation changelog"
  - "029 remediation lanes progress"
  - "single writer lock remediation"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

## 2026-06-12

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/029-deep-research-remediation` (Level 1, Phase Parent)

### Summary

The 029 remediation program is still in progress, but several high-risk lanes have shipped and been Fable-verified. Source continuity reports waves 4-8 committed and pushed with roughly 186/198 items closed; however `tasks.md` still leaves L2-L7 and L9 follow-up work open, so this changelog records current progress rather than completion.

The most consequential shipped work is the L1 safety lane: a default-on single-writer kernel lock at `context-index.sqlite` open time, fail-closed CLI save-lane scrubbing through a shared scrubber, hash-only query fingerprints with legacy-row purge, and truthful write-ingress documentation. L8 also superseded the earlier command-dashboard failure as a probe-harness artifact and codified the correct `opencode run --command` protocol.

### Included Lanes

| Lane | Current source status |
|------|-----------------------|
| L1 Security/Safety | Closed: six findings shipped or previously closed; live lock, scrubber, fingerprint, and doc-truth evidence recorded |
| L2 Code-Graph Apply Safety | 28/28 still-real; doc batch and apply-pipeline packet shipped; several independent code items remain open |
| L3 Idempotency Flag-ON | Closed 5/5, with replay-time deleted-memory validity deferred by design |
| L4 Launcher Lifecycle | Docs and launcher-parity cluster closed; one code-careful front-proxy/recycle item remains open |
| L5 Advisor Correctness | 35/35 still-real; several code waves closed, but routing/freshness/eval-integrity items remain open |
| L6 Save/Continuity Truth | 17/17 still-real; doc batch and several code items closed; wave 7 in verification and one feature-gap item open |
| L7 Shadow/Feedback Honesty | 19/19 still-real; doc-only branches closed; replay/promotion/pause clusters remain open |
| L8 Command-Dashboard Adherence | Superseding protocol fix shipped; corrected `--command` probe passes 3/3 with negative control |
| L9 P2/P3 Sweep | Multi-part verification and doc sweep closed many items; code waves 7-8 in verification and queue remains open |

### Added

- Single-writer DB lock module and public API surface for memory DB openers.
- Shared fail-closed secret scrubber for CLI save-lane persistence.
- Canonical `--command` probe script and dispatch rule for command-dashboard adherence.
- Lane disposition docs under `L1` through `L9` and verification reports under `verify/`.

### Changed

- Launcher exit-86 handling bridges losing cold-spawned daemons to the live owner.
- Consumption telemetry stores hash-only query fingerprints and purges legacy prefix rows.
- Command routers and cli-opencode docs codify the correct noninteractive command invocation protocol.
- Feature catalog and prior packet docs hedge write-ingress claims to match actual guarded surfaces.

### Fixed

- Prevented the repeated memory-DB corruption class caused by concurrent writers, according to live second-daemon refusal evidence.
- Closed the L8 false failure by proving the previous raw slash-text probe never invoked command runtime.
- Closed the L3 idempotency flag-on blockers with force-aware keys, honest conflict semantics, TTL sweep, and replay caveat.

### Verification

| Check | Result |
|-------|--------|
| DB lock and launcher tests | PASS: 13/13 |
| Affected regression suites | PASS: 96/96 and 97/97 after purge |
| Live second-daemon refusal | PASS: exit 86 naming live holder |
| Legacy fingerprint purge | PASS: 0 prefix rows post-recycle |
| Planted-secret CLI smoke | PASS: fake credentials redacted with warnings |
| L8 envelope gauntlet | PASS: 3/3 plus negative control |
| Packet strict validation | PASS recorded in implementation summary after docs backfill |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `029-deep-research-remediation/spec.md`, `tasks.md`, `implementation-summary.md` | Updated | Progressive program state |
| `029-deep-research-remediation/L*/disposition.md` | Created/Updated | Lane dispositions and open queues |
| `029-deep-research-remediation/verify/*.md` | Created/Updated | Fable and host verification reports |
| Memory DB lock, launcher, scrubber, telemetry, command, and docs paths | Modified | Shipped lane work summarized from source docs |

### Follow-Ups

- L2, L5, L6, L7, and L9 still carry open code queues in disposition docs.
- Launcher `.cjs` changes activate only in fresh launchers.
- mk-code-index still carries a mirrored dual-writer hazard recorded for later lifecycle work.
