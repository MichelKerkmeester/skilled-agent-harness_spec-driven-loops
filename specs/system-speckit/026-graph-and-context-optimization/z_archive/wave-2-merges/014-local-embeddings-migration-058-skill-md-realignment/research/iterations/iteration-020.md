---
title: "Iter 020 — Track 8: residual-gap finder"
iteration: 20
track: 8
focus: "residual-gap finder"
status: complete
newInfoRatio: 0.00
findings: 0
timestamp: 2026-05-15T17:33:55Z
---

## Iter 020 Findings (residual gap)

I've searched `.opencode/skills/system-code-graph/SKILL.md` and `mcp_server/` for additional architectural decisions warranting reference documentation beyond the three planned specs (iter 17-19: code-graph-readiness-check.md, ownership-boundary.md, database-path-policy.md).

### Candidate Topics Evaluated

**1. Graph quality thresholds + scoring**
- **Finding**: Parse error ratio threshold (`DEFAULT_FATAL_PARSE_ERROR_RATIO = 0.5`) in `handlers/scan.ts:80` blocks scan promotion when parse errors exceed 50% of files. Gold-query verification gates are covered in `handlers/verify.ts`.
- **Assessment**: Already covered by iter 017 (code-graph-readiness-check.md spec) under "failure modes" and "verification gates". This is an implementation detail of the scan handler, not a separate architectural decision.
- **Warrant reference doc**: No

**2. Doctor apply policy**
- **Finding**: Documented in `feature_catalog/08--doctor-code-graph/01-doctor-apply-mode.md` with Phase A diagnostic-only workflow, mutation gates, and approval procedures.
- **Assessment**: Already exists as feature catalog entry. ARCHITECTURE.md §3 covers apply-mode recovery invariants.
- **Warrant reference doc**: No (already documented)

**3. CCC feedback loop semantics**
- **Finding**: `ccc_feedback` handler (`handlers/ccc-feedback.ts:29-60`) appends feedback to JSONL file at `.opencode/skills/mcp-coco-index/feedback/search-feedback.jsonl`. Documented in `feature_catalog/07--ccc-integration/02-ccc-feedback.md`.
- **Assessment**: Simple append operation with no complex semantics. Already documented in feature catalog.
- **Warrant reference doc**: No (already documented)

**4. Auto-indexing strategy (Startup scan + file watcher + edit triggers)**
- **Finding**: Auto-rescan policy in `lib/auto-rescan-policy.ts:106-128` governs when read-path handlers may trigger inline full scans. Requires scope fingerprint match AND parse error backlog ≤ threshold. Integrated into `ensure-ready.ts` via `evaluateGuardedFullScan()`.
- **Assessment**: Already covered by iter 017 (code-graph-readiness-check.md spec) under "auto-rescan safety gate" and "guarded inline full scan gate". No file watcher or edit-trigger system exists—indexing is manual or auto-triggered only on read-path readiness checks.
- **Warrant reference doc**: No (part of readiness system)

**5. Code-graph search/query taxonomy**
- **Finding**: Query intent classifier in `lib/query-intent-classifier.ts:123-185` routes queries to 'structural', 'semantic', or 'hybrid' backends based on keyword/pattern scoring.
- **Assessment**: Implementation detail for routing between code-graph and CocoIndex. Not a fundamental architectural decision—covered by ARCHITECTURE.md §4 boundaries ("No semantic search inside this skill").
- **Warrant reference doc**: No (implementation detail)

### Additional Architectural Decisions Reviewed

**ARCHITECTURE.md coverage**: The existing `ARCHITECTURE.md` document comprehensively covers:
- MCP server boundary and 10-tool surface (§3)
- Readiness state machine with hard-refuse semantics (§3)
- Single-writer invariant and storage boundaries (§6)
- Apply-mode recovery with gold-query gating (§3, §6)
- Integration points with system-spec-kit and MCP clients (§8)

**No other ADRs or decision records found**: Search for "ADR|decision|architectural" patterns found only references to existing documentation, not undocumented decisions.

### Conclusion

No additional architectural decisions warrant standalone reference documentation beyond the three planned specs. The candidate topics are either:
1. Already documented in existing feature catalog entries or ARCHITECTURE.md
2. Implementation details covered by the readiness check spec (iter 017)
3. Not architectural decisions but operational or implementation concerns

The three planned reference docs (iter 17-19) cover the key architectural decisions:
- Iter 017: Readiness check system (gates, failure modes, recovery)
- Iter 018: Ownership boundary (system-spec-kit vs system-code-graph split)
- Iter 019: Database path policy (configuration, environment overrides)

### Final Assessment

**No additional gaps found.** The system-code-graph architectural decisions are adequately covered by existing documentation and the three planned reference specs.

ITER_020_COMPLETE: 0 findings, newInfoRatio=0.00
