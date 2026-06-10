---
title: "Changelog: 003-skill-advisor-cli (lane rollup)"
description: "Rollup for the skill-advisor CLI lane: feasibility research (GO verdict, 9-tool parity, 824.8ms one-shot ban), CLI core (trusted-mutation gate), hardening (tri-daemon drill PASSED), and runtime integration (warm-only hooks, read-only doctor probes, Gate-2 guidance)."
trigger_phrases:
  - "skill-advisor cli lane rollup"
  - "skill-advisor cli changelog root"
  - "003 skill-advisor cli complete"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

## 2026-06-10

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/003-skill-advisor-cli` (Phase Parent)

### Summary

The skill-advisor CLI lane delivered a complete dual-stack CLI front-door over the mk-skill-advisor daemon. The research measured the one-shot native bridge at 824.8ms, mandating warm-only prompt-time hooks, and reconciled `skill_advisor.py` as a legacy facade rather than superseding it. The CLI core shipped with byte-identical schemas and a trusted-mutation gate for graph-mutating commands. Hardening included the program gate: the env-gated tri-daemon spawn drill passed with per-launcher single-owner, respawn-lock serialization, divergent SIGTERM reap, and zero orphans. Runtime integration shipped warm-only fallback at 0.8ms fail-open and 120-198ms warm, with Gate-2 facade-vs-CLI guidance added to the skill and README.

### Included Phases

| Phase | Title | Date | Status |
|-------|-------|------|--------|
| `000-skill-advisor-cli-research` | Feasibility research (GO verdict, 824.8ms ban) | 2026-06-06 | Complete |
| `001-cli-core` | CLI core: 9 commands, trusted-mutation gate, shim | 2026-06-09 | Complete |
| `002-hardening-and-tests` | Hardening: parity, job semantics, orphan reaping, tri-daemon drill | 2026-06-09 | Complete |
| `003-runtime-integration` | Runtime integration: hooks, bridge, doctor probes, Gate-2 guidance | 2026-06-10 | Complete |

### Added

- `skill-advisor-cli.ts`, `skill-advisor-cli-manifest.ts` — manifest-backed 9-command CLI with trusted-mutation gate
- `.opencode/bin/skill-advisor.cjs` — stable executable shim
- 5 hardening Vitest suites (parity, job-semantics, orphan-reaping, dual-client, tri-daemon drill) and shared test utils
- Warm-only CLI fallback helper for Claude and Codex advisor hooks
- Read-only doctor CLI probes for advisor status and skill-budget diagnostics

### Changed

- `tsconfig.build.json` — includes CLI and manifest in build
- Claude/Codex hook files — warm-only advisor CLI fallback paths added
- `mk-skill-advisor-bridge.mjs` — CLI fallback route; primary MCP path untouched
- `doctor_skill-advisor.yaml`, `doctor_skill-budget.yaml` — read-only CLI probes
- `README.md`, `SKILL.md` — Gate-2 facade-vs-CLI guidance

### Fixed

- None

### Verification

| Check | Result |
|-------|--------|
| Research: 10/10 forced iterations | PASS — 1/1 lane, GO verdict |
| CLI core: 9-command manifest parity | PASS |
| CLI core: trusted-mutation gate | PASS (exit 64 untrusted CLI-side and daemon-side) |
| Hardening: 9/9 sandbox tests | PASS |
| Tri-daemon drill (program gate) | PASSED 1/1 |
| D2 parity fixture | 10/10 identical top recommendations |
| Runtime: hook fail-open latency | 0.8ms |
| Runtime: hook warm latency | 120-198ms (below 824.8ms ban) |

### Files Changed

See per-phase changelogs for full file tables.

### Follow-Ups

- Final multi-runtime transport-down drill tracked as program-level verification
