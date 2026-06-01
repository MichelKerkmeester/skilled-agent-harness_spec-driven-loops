---
title: "Memory Leak Remediation Phase 002: Telemetry and Process Verification Harness"
description: "A dry-run process and host-memory evidence collector shipped as the repeatable harness that all later remediation phases rely on before claiming cleanup works."
trigger_phrases:
  - "telemetry and process verification harness"
  - "process-memory-harness"
  - "memory leak remediation phase 002"
  - "dry-run process evidence collector"
  - "harness fixture tests"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-22

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/002-telemetry-and-process-verification-harness`
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation`

### Summary

Both prior research packets deferred live proof for several memory claims, leaving downstream remediation phases without a repeatable way to confirm whether cleanup worked or whether RSS growth was real. This phase delivered `scripts/ops/process-memory-harness.ts`, a dry-run evidence collector that parses `ps`, `vm_stat` and `sysctl hw.memsize` to classify processes into roles (current-session, project daemon, expected warm daemon, zombie, stale PID lock, abandoned project daemon) while exposing fully deterministic fixtures through the `fixture` command. The harness intentionally never sends signals, so later phases can gather exact inventory before any destructive cleanup path is introduced.

### Added

- `scripts/ops/process-memory-harness.ts` (NEW): dry-run process and host-memory evidence collector with `snapshot` and `fixture` commands
- `scripts/tests/process-memory-harness.vitest.ts` (NEW): 7-test vitest fixture suite covering synthetic child/grandchild, stale/live/invalid/zombie PID locks, sidecar, Ollama, CocoIndex, Code Graph, Spec Kit Memory plus vm_stat/sysctl parsing

### Changed

- `scripts/tsconfig.json`: added `ops/**/*.ts` glob to include the new ops directory in the scripts workspace build

### Fixed

None.

### Verification

| Check | Result |
|-------|--------|
| Harness fixture tests | Passed: `node mcp_server/node_modules/vitest/vitest.mjs run scripts/tests/process-memory-harness.vitest.ts --config mcp_server/vitest.config.ts` (7 tests). |
| Scripts typecheck | Passed: `npm run typecheck --workspace=@spec-kit/scripts`. |
| Scripts build | Passed: `npm run build --workspace=@spec-kit/scripts`. |
| Deterministic fixture CLI | Passed: `node scripts/dist/ops/process-memory-harness.js fixture --pretty`. Fixture covers synthetic child/grandchild, stale/live/invalid/zombie PID locks, sidecar, Ollama, CocoIndex, Code Graph, Spec Kit Memory plus vm_stat/sysctl parsing. |
| Live telemetry CLI | Passed: `node scripts/dist/ops/process-memory-harness.js snapshot`. Reported `processCount=917`, `projectDaemonCount=6`, `expectedDaemonCount=2`, `zombieCount=1` with no host-memory parser warnings. |
| Phase 002 strict validation | Passed: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/002-telemetry-and-process-verification-harness --strict`. |
| Parent arc strict validation | Passed: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation --strict`. |
| OpenCode alignment drift | Passed: `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/system-spec-kit` with 0 errors and existing non-blocking warnings outside this change. |
| Broad scripts test command | Blocked by environment: `npm run test --workspace=@spec-kit/scripts -- --run scripts/tests/process-memory-harness.vitest.ts` segfaulted before test selection took effect. Targeted Vitest, typecheck and build all passed. |

### Files Changed

| File | Action | Notes |
|------|--------|-------|
| `.opencode/skills/system-spec-kit/scripts/ops/process-memory-harness.ts` | Created | 431-line dry-run process and host-memory evidence collector. |
| `.opencode/skills/system-spec-kit/scripts/tests/process-memory-harness.vitest.ts` | Created | 130-line vitest suite with 7 deterministic fixture scenarios. |
| `.opencode/skills/system-spec-kit/scripts/tsconfig.json` | Modified | Added `ops/**/*.ts` include glob. |

### Follow-Ups

- The harness inventories termination candidates but never terminates them. Phases 003-010 must add owner-specific cleanup behavior separately.
- Final memory-relief claims still require before/after workload measurements in the relevant remediation phase.
