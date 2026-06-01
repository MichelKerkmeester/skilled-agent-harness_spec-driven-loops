---
title: "Deferred Remediation and Telemetry Measurement Run"
description: "Static 200-prompt measurement harness, observe-only live-session wrapper, and JSONL analyzer to close deferred telemetry items from Phases 020-023."
trigger_phrases:
  - "smart router measurement"
  - "deferred remediation"
  - "telemetry measurement run"
  - "live session wrapper"
  - "skill advisor telemetry"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/004-skill-advisor-production-hardening/001-deferred-remediation-telemetry-run` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/004-skill-advisor-production-hardening`

### Summary

This phase shipped the measurement machinery that Phases 020-023 deferred: a static 200-prompt harness, an observe-only live-session wrapper, and a JSONL compliance analyzer. The static report keeps predictions separate from live-wrapper evidence so readiness claims stay blocked until actual runtime reads are captured. Track 1 (Codex config registration) could not be completed because the sandbox denies writes under `.codex`.

### Added

- A static 200-prompt measurement harness that runs the labeled corpus through the skill advisor, emits a markdown report and writes per-prompt JSONL plus static compliance records
- Measurement harness tests covering fixture and edge-case behavior
- An observe-only live-session wrapper for recording runtime Read calls against skill resources without changing runtime behavior
- A telemetry analyzer CLI that reads compliance JSONL and aggregates distribution, over-load rate, under-load rate and on-demand trigger rate
- Analyzer tests covering valid input, invalid lines and empty-file handling

### Changed

- Live-session wrapper setup documentation for four runtimes (Claude, Codex, Gemini and Copilot)

### Fixed

- None.

### Verification

- Required reads: PASS (024 spec, Phase 020 hook doc, Codex adapter, telemetry primitive, producer, corpus and checker)
- Scripts typecheck: PASS (npm run typecheck in scripts)
- MCP server typecheck: PASS (npm run typecheck in mcp_server)
- New targeted tests: PASS (2 files, 7 tests)
- Static corpus run: PASS (200/200 prompts processed, 112/200 top-1 matches)
- Analyzer run: PASS (202 records, 0 parse errors, markdown report emitted)
- Smart-router checker: PASS (no missing paths, 5 informational bloat warnings remain)
- Phase 020 regression subset: PASS (20 files, 138 tests)
- Strict 024 validation: PASS (errors=0 with NODE_OPTIONS loader workaround)
- Track 1 Codex config: BLOCKED (sandbox denies writes under `.codex`)

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `plan.md` | Created | Delivery sequence and risk handling |
| `tasks.md` | Created | Completed and blocked work tracking |
| `checklist.md` | Created | Verification evidence tracking |
| `implementation-summary.md` | Created | Final state and handoff capture |
| `.opencode/skills/system-spec-kit/scripts/observability/smart-router-measurement.ts` | Created | Static corpus measurement harness |
| `.opencode/skills/system-spec-kit/scripts/observability/smart-router-measurement-report.md` | Created | Full 200-prompt measurement report |
| `.opencode/skills/system-spec-kit/scripts/observability/smart-router-measurement-results.jsonl` | Created | Per-prompt measurement output and summary row |
| `.opencode/skills/system-spec-kit/scripts/observability/live-session-wrapper.ts` | Created | Observe-only live-session read recorder |
| `.opencode/skills/system-spec-kit/scripts/observability/LIVE_SESSION_WRAPPER_SETUP.md` | Created | Runtime setup guide for four runtimes |
| `.opencode/skills/system-spec-kit/scripts/observability/smart-router-analyze.ts` | Created | Compliance JSONL analyzer |
| `.opencode/skills/system-spec-kit/scripts/observability/smart-router-analyze-report-2026-04-19T17-57-07-192Z.md` | Created | Analyzer report over current compliance JSONL |
| `.opencode/skills/system-spec-kit/mcp_server/tests/smart-router-measurement.vitest.ts` | Created | Harness fixture tests |
| `.opencode/skills/system-spec-kit/mcp_server/tests/smart-router-analyze.vitest.ts` | Created | Analyzer fixture tests |

### Follow-Ups

- Track 1 is blocked by filesystem permissions. Both `.codex/settings.json` and `.codex/policy.json` still need to be created in a session where `.codex` is writable. When retried, the Codex policy registration should mirror both `bash_denylist` and `bashDenylist` keys unless the adapter contract changes.
- Strict validation needs a `NODE_OPTIONS` loader workaround in this environment. The clean run used the local tsx loader so compiled validator files load correctly under Node 25.
- Static telemetry is predictive only. The measurement report blocks readiness claims until live wrapper telemetry captures actual reads, but it cannot prove live AI behavior without those runtime records.
