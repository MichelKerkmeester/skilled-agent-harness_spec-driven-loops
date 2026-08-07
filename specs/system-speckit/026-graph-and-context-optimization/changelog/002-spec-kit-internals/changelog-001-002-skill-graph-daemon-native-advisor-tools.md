---
title: "Skill Graph Daemon and Advisor Unification: Phase 027 Complete"
description: "Phase 027 shipped a live skill-graph daemon, derived metadata, native TypeScript scoring, three MCP advisor tools, compatibility shims plus promotion gates, replacing the manually-refreshed Python advisor with a self-contained unified architecture."
trigger_phrases:
  - "skill graph daemon native advisor"
  - "advisor unification phase 027"
  - "advisor_recommend advisor_status advisor_validate"
  - "five-lane fusion scorer"
  - "skill advisor ESM migration"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-20

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph/002-skill-graph-daemon-native-advisor-tools` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph`

### Summary

The legacy skill-advisor relied on manually refreshed graph files, hand-maintained trigger phrases, fixed Python scoring plus split ownership between Python scripts and the system-spec-kit MCP server. Routing was stale, hard to observe, difficult to evolve.

Phase 027 shipped a unified advisor architecture across seven children in dependency order. A chokidar watcher with hash-aware SQLite indexing replaced manual rebuilds. Derived metadata extraction added provenance-tagged keyword lanes separated from author-authored intent. A native TypeScript scorer with five-lane analytical fusion lifted full-corpus accuracy from 56 to 80.5 percent with zero regressions on Python-correct decisions. Three MCP tools (`advisor_recommend`, `advisor_status`, `advisor_validate`) exposed the new surface. Python and plugin compatibility shims kept legacy callers working. Promotion gates locked the semantic lane at weight 0.00 until accuracy, safety plus shadow-cycle evidence qualifies it.

### Added

- Skill-graph daemon with Chokidar narrow-scope watcher, 2-second debounce, hash-aware reindex, ENOENT tolerance, SIGTERM lifecycle plus idle CPU gate (0.031% idle, 5.5 MB RSS delta)
- Workspace-scoped single-writer SQLite lease with heartbeat, stale-lease reclaim plus SQLITE_BUSY backoff
- Derived metadata extraction from SKILL.md author signals, headings, body n-grams plus graph intent signals, with schema-v2 `derived` block, provenance fingerprints, trust lane plus additive v1-to-v2 migration
- Native TypeScript five-lane scorer under `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/` with lanes for explicit author (0.45), lexical (0.30), graph-causal (0.15), derived-generated (0.15), semantic shadow (0.00)
- Three MCP advisor tools registered in the `mk_skill_advisor` dispatcher: `advisor_recommend`, `advisor_status`, `advisor_validate`
- Compatibility shim routing in `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py` with daemon-probe delegation, `--force-local`, `--force-native` flags
- Seven-gate promotion bundle with shadow-cycle harness guarding learned and semantic live influence

### Changed

- `.opencode/skills/system-spec-kit/scripts/` migrated from CommonJS to pure ESM: `package.json` type set to module, 16 entrypoint guards converted, 4 `require()` calls replaced, `__dirname` replaced with `dirnameFromImportMeta`, `.js` suffixes added. `validate.sh` updated to use `--import tsx` fallback on Node 20.19.5
- `spec-kit-skill-advisor` plugin and bridge (`mk-skill-advisor.js`) updated to delegate to native `advisor_recommend` via daemon-probe with Python shim fallback
- Advisor scoring accuracy improved from 56 percent to 80.5 percent full-corpus top-1 with stratified holdout at 77.5 percent and UNKNOWN fallback reduced from 37 to 10

### Fixed

- Stale advisor routing caused by manually-refreshed skill-graph files. Daemon freshness generation now updates on file change
- Python-correct decisions (120/120) preserved without regression during native scorer migration
- Gate 7 regression: `skill_advisor.py` now correctly routes `/spec_kit:plan` to `command-spec-kit` and `/memory:save` to `command-memory-save`

### Verification

| Check | Result |
|-------|--------|
| Child shipment (7 children) | PASS. All seven children converged on 2026-04-20 with recorded SHAs in the implementation summary. |
| Native scorer accuracy | PASS. Full-corpus top-1 161/200 (80.5%). Stratified holdout 31/40 (77.5%). UNKNOWN count 10. Gold-none fires 8 (no increase). |
| Python regression suite | PASS. 52/52 pass. `p0_pass_rate` 1.0. `overall_pass` true. |
| Regression-protection parity | PASS. 120/120 Python-correct decisions preserved. 0 TS regressions. 41 improvements on Python-wrong prompts. |
| MCP handler tests | PASS. 167 tests pass after legacy-test consolidation (advisor, freshness, compat). |
| Daemon benchmark | PASS. Idle CPU 0.031% (gate at 1%). RSS delta 5.516 MB (gate at 20 MB). |
| Latency bench | PASS. Cache-hit p95 6.989 ms (gate at 50 ms). Uncached p95 11.45 ms (gate at 60 ms). |
| Derived metadata tests | PASS. 13 tests pass. Watcher-to-reindex-to-derived-refresh pipeline verified under 10-second window. |
| 2026-04-28 release remediation | PASS. Fail-open, trusted scan gate, live DB recovery, rebuild serialization, diagnostic redaction, lane registry, compat contract plus response envelope regressions all pass. |
| Strict packet validation | PASS. Parent packet validation exits 0 after 2026-04-28 remediation pass. |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/` (NEW) | Five-lane TypeScript scorer: `weights-config.ts`, `fusion.ts`, `projection.ts`, `text.ts`, `ambiguity.ts`, `attribution.ts`, `ablation.ts` plus lane modules. |
| `.opencode/skills/system-skill-advisor/mcp_server/tools/advisor-recommend.ts` (NEW) | MCP tool descriptor and handler for `advisor_recommend` with HMAC prompt cache and privacy contracts. |
| `.opencode/skills/system-skill-advisor/mcp_server/tools/advisor-status.ts` (NEW) | MCP tool descriptor for `advisor_status` exposing generation metadata and trust state. |
| `.opencode/skills/system-skill-advisor/mcp_server/tools/advisor-validate.ts` (NEW) | MCP tool descriptor for `advisor_validate` with per-slice corpus, holdout, parity, safety, and latency output. |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/` (NEW) | Daemon watcher, single-writer lease, lifecycle, freshness generation, trust-state, cache-invalidation, derived extraction plus compat library modules. |
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py` | Python shim rewritten for native-first delegation via daemon-probe with fallback and Gate 7 regression fix. |
| `.opencode/plugins/mk-skill-advisor.js` | Plugin bridge updated for native `advisor_recommend` delegation with Python shim fallback preserved. |
| `.opencode/skills/system-spec-kit/scripts/` (98 files) | ESM migration: `package.json` type, entrypoint guards, `require()` calls, `__dirname`, relative import suffixes, and `validate.sh` loader. |

### Follow-Ups

- Promote semantic lane from shadow-only (weight 0.00) once accuracy, safety, latency plus shadow-cycle gates produce qualifying evidence.
- Deprecate Python shim and plugin compatibility paths once a future packet confirms native-only routing is stable.
- Run a follow-on strict validation pass after any future advisor schema migration to confirm additive rollback correctness.
