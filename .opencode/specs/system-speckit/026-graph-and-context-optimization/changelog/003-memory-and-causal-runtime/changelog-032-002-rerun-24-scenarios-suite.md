---
title: "032-002: Rerun 24-scenario suite - blocked preflight report with runner artifact"
description: "Rerun of the 15-scenario local-LLM query intelligence suite after Wave 1 substrate fixes. The suite was blocked at preflight because the Spec Kit Memory MCP launcher failed on a missing zod-to-json-schema dependency and the opencode-go/kimi-k2.6 provider route was unreachable from the sandbox. A reusable runner script and a blocked evidence report were delivered."
trigger_phrases:
  - "rerun 24 scenarios post-032"
  - "kimi-k2.6 scenario suite blocked preflight"
  - "zod-to-json-schema missing mcp startup"
  - "run-2026-05-14b-post-032 evidence"
  - "post-fix substrate validation blocked"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-14

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/032-substrate-repair-followups/002-rerun-24-scenarios-suite`
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/032-substrate-repair-followups`

### Summary

The 15-scenario local-LLM query intelligence playbook (scenarios 401-415) could not be executed after Wave 1 substrate fixes because two runtime blockers stopped the preflight gate cold. The Spec Kit Memory MCP launcher exited with `ERR_MODULE_NOT_FOUND` for `zod-to-json-schema`. The `opencode-go/kimi-k2.6` provider route responded with `ConnectionRefused` from the sandbox environment. A reusable runner script was committed so the suite can be replayed once both blockers are resolved. A blocked evidence report captures the full diagnostic trail with verdict counts: 0 PASS / 0 PARTIAL / 0 FAIL / 15 SKIP.

### Added

- Runner script at `_sandbox/24--local-llm-query-intelligence/evidence/run-2026-05-14b-post-032.sh` that dispatches scenarios 401-415 sequentially via `opencode run --pure -m opencode-go/kimi-k2.6 --variant high`
- Blocked evidence report at `_sandbox/24--local-llm-query-intelligence/evidence/run-2026-05-14b-post-032.md` with preflight state, a 15-skip scenario table, verdict counts (0/0/0/15)

### Changed

None.

### Fixed

None.

### Verification

| Check | Result |
|-------|--------|
| `opencode --version` | PASS: `1.14.48` |
| `opencode providers list` | PASS: OpenAI / DeepSeek / OpenCode Go credentials present |
| Default OpenCode data dir dispatch | FAIL: `PRAGMA wal_checkpoint(PASSIVE)` state DB error |
| Temp OpenCode data dir provider listing | PASS: credentials loaded from `/private/tmp/opencode-data/opencode/auth.json` |
| OpenCode `memory_health` prompt | FAIL: provider call refused. MCP startup failed |
| `node .opencode/bin/spec-kit-memory-launcher.cjs --help` | FAIL: missing `zod-to-json-schema` |
| `npm ls zod-to-json-schema --depth=0` | FAIL: `(empty)` |
| Scenario execution | SKIPPED: blocked before health and save preflight |
| Packet strict validate | PASS: 0 errors, 0 warnings |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `_sandbox/24--local-llm-query-intelligence/evidence/run-2026-05-14b-post-032.sh` (NEW) | Created | Reusable sequential runner for scenarios 401-415 via kimi-k2.6 |
| `_sandbox/24--local-llm-query-intelligence/evidence/run-2026-05-14b-post-032.md` (NEW) | Created | Blocked preflight evidence report with 15-skip outcome table and diagnostic log references |

### Follow-Ups

- Repair the missing `zod-to-json-schema` dependency in the Spec Kit Memory MCP build tree so the launcher starts cleanly.
- Confirm `opencode-go/kimi-k2.6` provider connectivity from a non-sandbox environment before rerunning the script.
- Rerun `_sandbox/24--local-llm-query-intelligence/evidence/run-2026-05-14b-post-032.sh` once both blockers are resolved to produce an actual PASS/FAIL distribution against the post-fix substrate.
- Decide whether the dependency repair belongs in sibling packet 003 or a new dedicated follow-up packet.
