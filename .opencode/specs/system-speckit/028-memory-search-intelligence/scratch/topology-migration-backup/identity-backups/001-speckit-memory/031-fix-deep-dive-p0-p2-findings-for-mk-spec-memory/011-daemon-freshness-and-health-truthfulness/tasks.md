---
title: "Tasks: Phase 11: daemon-freshness-and-health-truthfulness [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "dist freshness deadlock"
  - "stale dist exit 75"
  - "memory health truthfulness"
  - "sigbus crash loop"
  - "daemon freshness tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/001-speckit-memory/031-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/011-daemon-freshness-and-health-truthfulness"
    last_updated_at: "2026-07-04T17:51:12.131Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored task breakdown with finding-ID citations"
    next_safe_action: "Program complete (016 shipped + pushed)"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/finalize-dist.mjs"
      - ".opencode/bin/spec-memory.cjs"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-011-daemon-freshness-and-health-truthfulness"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 11: daemon-freshness-and-health-truthfulness

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

Finding references use deep-dive report §3 numbering (#N), root-cause chains (Chain C), and ledger tags (L#, Agent I) from ../research/. Per the program's comment-hygiene rule, finding IDs live HERE, never in code comments.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Capture vitest baseline: run the full mcp_server suite, record pass/fail counts and any pre-existing failures to scratch/vitest-baseline.txt — baseline-before-no-regressions gate for T015 (.opencode/skills/system-spec-kit/mcp_server)
- [ ] T002 [P] Re-confirm Chain C receipts and shim git state: reproduce the mtime-skew precondition (touch a watched source, `npm run build`, invoke CLI, observe refusal); run `git status --porcelain .opencode/bin/spec-memory.cjs` — planning-time observation was CLEAN (2026-07-03T09:5xZ) vs dispatch-reported uncommitted diff; record which is true at execution time [Chain C 🟢, L6 🟢] (.opencode/bin/spec-memory.cjs)
- [ ] T003 [P] Verify-first battery for 🟡/unreproduced items: (a) #24 — run the exclusion-audit SQL against the live schema to confirm `content` column absence (`PRAGMA table_info(memory_index)`); (b) 69/75 drift — confirm `dist-freshness-enforcement.md:35,42` still says exit 69 while `spec-memory.cjs:21,56` exits 75 [#28 🟢, Agent I]; (c) "Off by default" cluster — `rg -in "off by default" .opencode/bin .opencode/skills/system-spec-kit` and identify the stale entries tied to freshness/fallback surfaces (planning grep found none there — record not-found with receipts if it holds); (d) CONTINUITY_FRESHNESS import error — attempt repro of the missing `scripts/mcp_server/lib/validation/spec-doc-structure.js` import (did NOT reproduce on this folder's strict run 2026-07-03); (e) SIGBUS — collect launcher log 05:52-06:07 excerpts and crash-probe receipts to scratch/ [L6 🟢]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Deadlock fix: checker exports `writePackageSourceHashCache`; finalizer writes caches for default/spec-memory-cli/validation-orchestrator using checker-owned enumeration. [EVIDENCE: `npx vitest run tests/dist-freshness.vitest.ts` passed 20/20]
- [x] T005 [P] Exempt `--help`, `--version`, and completion argv from `ensureFreshDist()`. [EVIDENCE: `node .opencode/bin/spec-memory.cjs --help` printed shim usage; `node .opencode/bin/spec-memory.cjs --version` printed `1.8.0`]
- [x] T006 Exit taxonomy: keep stale-dist as a documented non-retryable subcase inside exit 75. [EVIDENCE: `rg -n "75" .opencode/bin .opencode/skills/system-spec-kit/mcp_server/hooks` found warm fallback and hook consumers treating 75 as retryable; shim now emits `retryable:false` and `retryableSubcase:"stale_dist"`; no git write/commit per orchestrator instruction]
- [x] T007 [P] Hook fallback visibility: emit `Memory: CLI fallback skipped (<reason>)`, record last fallback status, and expose it via `session_health`. [EVIDENCE: `spec-memory-cli-fallback.ts` records `LastSpecMemoryCliFallbackStatus`; `session-health.ts` returns `details.specMemoryCliFallback` and a `spec-memory-cli-fallback` section; `tests/session-health.vitest.ts` passed in the focused run]
- [x] T008 Health exclusion-audit column fix: `content IS NOT NULL` changed to `content_text IS NOT NULL`. [EVIDENCE: `memory-crud-health.ts` uses `content_text`; broad grep found no remaining `content IS NOT NULL` in the allowed target]
- [x] T009 Health truthfulness batch: last-scan timestamp field, sampled orphan labels, capped `mismatchedIds`, and maintenance `lastRun` alias. [EVIDENCE: `IndexHealthBlock` now includes `lastScanAt`, `orphanFilesLabel`, `orphanFilesSampleLimit`, and `orphanFilesScannedRows`; `maintenance` entries include `lastRun`; orphan file IDs cap at 20 plus overflow marker]
- [ ] T010 SIGBUS timeboxed diagnosis (max 1 day): analyze T003(e) evidence; check `better-sqlite3`/`sqlite-vec` native module build state (rebuild check); locate the launcher restart loop (`rg -n "backoff|respawn|restart" .opencode/skills/system-spec-kit/mcp_server`) and cap the backoff; write diagnosis notes with root cause or explicit UNKNOWN + mitigation [L6 🟢] (daemon launcher, path per rg)
- [x] T011 [P] Suppress Node SQLite ExperimentalWarning in CLI spawns. [EVIDENCE: shim and fallback hook prepend `--disable-warning=ExperimentalWarning` when supported; `node -p "process.allowedNodeEnvironmentFlags.has('--disable-warning')"` returned `true`; help/version smoke output contained no ExperimentalWarning]
- [x] T012 validate.sh CONTINUITY_FRESHNESS import verify+fix: not reproduced. [EVIDENCE: `rg -n "spec-doc-structure" .opencode/skills/system-spec-kit/scripts/validation/continuity-freshness.ts` returned no matches; strict validation passed]
- [x] T013 [P] Doc alignment: update scoped dist-freshness enforcement doc and close stale flag cluster as not found in requested files. [EVIDENCE: `dist-freshness-enforcement.md` documents pre-warmed hash caches and stale-dist exit 75 subcase; `rg -n -i "off by default" search-flags.ts search-results.ts` returned no matches; stale exit-69 docs outside allowed writes were left untouched]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Deadlock regression matrix in dist-freshness.vitest.ts. [EVIDENCE: added source-mtime-newer/no-cache -> stale, cache write -> fresh via hash path, changed source content -> stale; added per-entry cache isolation; `npx vitest run tests/dist-freshness.vitest.ts` passed 20/20]
- [B] T015 Re-run the FULL mcp_server vitest suite and `scripts/tests/test-dist-freshness.sh`; report the delta against the T001 baseline. [BLOCKED: `npm run build` failed in `../shared/**` before changed files with missing Node typings / SDK client resolution and TS5101 `baseUrl` deprecation, outside allowed-write scope; focused vitests beyond dist-freshness hit missing `@modelcontextprotocol/sdk/client/index.js` before assertions]
- [x] T016 Close-out receipts: strict validation and status sync. [EVIDENCE: `SPECKIT_VALIDATE_LEGACY=1 bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this folder> --strict` passed before evidence edits; rerun after evidence edits required]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed (T014-T016 receipts recorded; SC-001..SC-005 in spec.md §5 satisfied)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md` (FIX ADDENDUM surface inventory drives T004-T013)
- **Evidence**: ../research/deep-dive-report.md (Chain C, §3 #24/#28), ../research/findings-ledger.md (L6 + Agent I), ../research/phase-decomposition.md §011
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
