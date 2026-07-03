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
    packet_pointer: "system-speckit/028-memory-search-intelligence/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/011-daemon-freshness-and-health-truthfulness"
    last_updated_at: "2026-07-03T09:59:39Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored task breakdown with finding-ID citations"
    next_safe_action: "Execute T001-T003 (baseline + verify-first) before any code change"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/finalize-dist.mjs"
      - ".opencode/bin/spec-memory.cjs"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-011-daemon-freshness-and-health-truthfulness"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 11: daemon-freshness-and-health-truthfulness

<!-- SPECKIT_LEVEL: 1 -->

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

- [ ] T004 Deadlock fix: export a cache-write helper from the checker (reuse `cachePathFor`/`hashSourceFiles`, keep cache-path logic single-sourced) and have `finalize-dist.mjs` write per-entry source-hash caches after a successful build for mcp_server entries (default, spec-memory-cli, validation-orchestrator) — breaks the bootstrap deadlock where the cache is only written after an mtime pass at dist-freshness.cjs:394 [Chain C 🟢] (.opencode/skills/system-spec-kit/mcp_server/scripts/finalize-dist.mjs, .opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs)
- [ ] T005 [P] Exempt `--help`, `--version`, and completion argv from `ensureFreshDist()` — gate currently unconditional at :76-77 [Chain C item 4 🟢] (.opencode/bin/spec-memory.cjs)
- [ ] T006 Exit taxonomy: run the consumer inventory (`rg -n "75|exitCode|staleDistWarning|fail_open" .opencode/bin .opencode/skills/system-spec-kit/mcp_server/hooks .claude --glob '*.{ts,js,cjs,md}'`), then EITHER introduce a distinct non-retryable stale-dist exit code OR document stale-dist as a non-retryable sub-case inside 75; record the decision + rationale inline here; unify the missing-dist/stale-dist recovery texts (dist-freshness.cjs:314,390); commit the reconciled shim state from T002 [#28 🟢, Agent I P1] (.opencode/bin/spec-memory.cjs, .opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs)
- [ ] T007 [P] Hook fallback visibility: emit one line `Memory: CLI fallback skipped (<reason>)` in the startup surface when the fallback skips or fails open (classification at :258); persist a last-fallback record (timestamp, reason, outcome) and expose it via `session_health` [Agent I gap 🟢 — this session lost continuity silently] (.opencode/skills/system-spec-kit/mcp_server/hooks/spec-memory-cli-fallback.ts, .opencode/skills/system-spec-kit/mcp_server/handlers/session-health.ts)
- [ ] T008 Health exclusion-audit column fix: `content IS NOT NULL` → `content_text` at :463-473 so the prepared statement stops throwing and the hard-exclusion diagnostic can fire; add a synthetic-row test proving it fires [#24 🟡 — gated on T003(a)] (.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts)
- [ ] T009 Health truthfulness batch: last-scan timestamp readable when the runtime is not initialized; label `orphanFiles` as a 200-row sample [L2 🟢]; cap the consistency `mismatchedIds` payload; wire maintenance `lastRun` (null today though reconcile never ran, L3 🟢); publish the shared population-definitions note with `memory_stats` (stats-vs-health 7,369-row disagreement, L1 🟢; predicate implementation deferred to phase 002) (.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts)
- [ ] T010 SIGBUS timeboxed diagnosis (max 1 day): analyze T003(e) evidence; check `better-sqlite3`/`sqlite-vec` native module build state (rebuild check); locate the launcher restart loop (`rg -n "backoff|respawn|restart" .opencode/skills/system-spec-kit/mcp_server`) and cap the backoff; write diagnosis notes with root cause or explicit UNKNOWN + mitigation [L6 🟢] (daemon launcher, path per rg)
- [ ] T011 [P] Suppress Node SQLite ExperimentalWarning in CLI spawns: add `--disable-warning=ExperimentalWarning` (or `--no-warnings` fallback for older Node) to the spawnSync argv in the shim and the spawn at :210 in the fallback hook [Agent I gap] (.opencode/bin/spec-memory.cjs, .opencode/skills/system-spec-kit/mcp_server/hooks/spec-memory-cli-fallback.ts)
- [ ] T012 validate.sh CONTINUITY_FRESHNESS import verify+fix: from T003(d), identify the condition under which the check imports the missing `scripts/mcp_server/lib/validation/spec-doc-structure.js` (note: `mcp_server/dist/lib/validation/spec-doc-structure.js` EXISTS; the failing path resolves under scripts/) and fix the resolution; if not reproducible, record the probe commands and a not-reproducible verdict [new evidence, this session] (.opencode/skills/system-spec-kit/scripts/spec/validate.sh, .opencode/skills/system-spec-kit/scripts/validation/continuity-freshness.ts)
- [ ] T013 [P] Doc alignment: fix exit-69 claims at dist-freshness-enforcement.md:35,42 to the T006 taxonomy; rewrite the §2 hash-cache paragraph ("never pre-warmed by a build script" becomes false after T004); correct the stale "Off by default" cluster located in T003(c) or record not-found; refresh playbooks 429/455 if their steps encode the old exit code [#28 🟢, Agent I] (.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/dist-freshness-enforcement.md)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T014 Deadlock regression matrix in dist-freshness.vitest.ts: {fresh, stale-mtime-only, genuinely-stale, missing} × {tool call, --help, --version, completion} × {cache absent, matching, mismatched} — genuinely-stale MUST still refuse after T004 (invariant); same-session build→fresh receipt recorded (.opencode/skills/system-spec-kit/mcp_server/tests/dist-freshness.vitest.ts)
- [ ] T015 Re-run the FULL mcp_server vitest suite and `scripts/tests/test-dist-freshness.sh`; report the delta against the T001 baseline (whole gate, not spot checks) (.opencode/skills/system-spec-kit/mcp_server)
- [ ] T016 Close-out receipts: health-vs-raw-SQL reconciliation under the documented definitions; forced-stale session-start receipt showing the fallback one-liner + session_health record; `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this folder> --strict` exit 0; sync spec/plan/tasks/checklist statuses (this folder)
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
