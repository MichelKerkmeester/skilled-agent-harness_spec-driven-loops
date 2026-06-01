---
title: "PC-005 Bench Doc Fix + Gate Calibration"
description: "The PC-005 benchmark scenario doc was missing the required --dataset flag, and the warm and cold p95 latency gates were calibrated tighter than the documented performance envelope. The doc now documents correct invocation, warm p95 uses the 50 ms envelope, and cold p95 is advisory by default."
trigger_phrases:
  - "PC-005 bench doc"
  - "bench gate calibration"
  - "warm p95 50ms"
  - "cold p95 advisory"
  - "skill_advisor_bench dataset flag"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/005-finding-remediation/003-pc005-bench-doc-and-gates` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/005-finding-remediation`

### Summary

The PC-005 benchmark scenario doc was missing the required `--dataset` flag, and the p95 latency gates were calibrated tighter than the documented performance envelope. The doc now specifies correct invocation with `--dataset` and `--runs 1` smoke guidance, the warm p95 gate uses the documented 50 ms default, and the cold p95 gate is advisory by default to reflect per-prompt subprocess startup scope. The native TypeScript scorer was unchanged and passes at 3.69 ms (warm) and 6.71 ms (cold).

### Added

- None.

### Changed

- Warm p95 latency gate default raised from 20 ms to the documented 50 ms envelope
- Cold p95 latency gate made advisory and opt-in via the `--enforce-cold-p95` flag to reflect per-prompt subprocess startup scope rather than native scorer latency

### Fixed

- PC-005 scenario documentation corrected to include the required `--dataset` flag, preventing invocation errors when the documented command is run directly

### Verification

- Bench runs with `--dataset`, emits report: pass
- warm_p95 and throughput_multiplier gates pass: `overall_pass: true`
- cold_p95 advisory unless `--enforce-cold-p95` used: confirmed (`cold_p95_advisory: true`)

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-skill-advisor/manual_testing_playbook/10--python-compat/005-bench-runner.md` | Modified | Added `--dataset` flag, smoke-test guidance, and gate descriptions |
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor_bench.py` | Modified | Warm p95 default set to 50 ms, `--enforce-cold-p95` flag added, `cold_p95_advisory` field emitted in report |

### Follow-Ups

- Cold-subprocess p95 needs host calibration before enforcing. It measures per-prompt process startup, so it stays advisory by default.
