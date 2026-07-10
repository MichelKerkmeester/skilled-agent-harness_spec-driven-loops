---
title: "Task Breakdown: Scouted Bugfix Batch 3"
description: "Task list for the verify-first deep-dive -> implement workflow over the fresh 20 scouted candidate defects (12 fixes / 23 files)."
trigger_phrases:
  - "scouted bugfix batch 3 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/010-scouted-bugfix-train/003-scouted-bugfix-batch-3"
    last_updated_at: "2026-06-03T08:00:00Z"
    last_updated_by: "claude-sonnet"
    recent_action: "All deep-dive + implement tasks complete; 12 fixes / 23 files / verified"
    next_safe_action: "Metadata + validate + reconcile"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/mcp_server/src/handlers/__tests__/scan-stress.vitest.ts"
      - ".opencode/skills/deep-loop-runtime/scripts/convergence.cjs"
      - ".opencode/skills/cli-devin/src/session-start.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/src/launcher/mk-spec-memory-launcher.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scouted-bugfix-batch-3-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Task Breakdown: Scouted Bugfix Batch 3

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### Description — evidence`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-01 Carry over the fresh 20 scouted targets from the second scout
- [x] T-02 [P] Run 20 parallel gpt-5.5-fast confirm deep-dives against the real code
- [x] T-03 Classify the 20: 7 CONFIRMED, 9 partial-but-real, 4 REFUTED
- [x] T-04 Refute the 4 headlines — gemini-compact already calls `sanitizeRecoveredPayload` internally; 3 code-graph regex `lastIndex` claims where the while-exec loop resets correctly; none edited
- [x] T-05 Exclude council `scoreVerdictProgression` partial — proposed fix changes stop-policy (product decision); flagged not fixed
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-06 [P] Run 12 parallel disjoint-file implement agents on the confirmed + partial defects (23 files, REAL part only)
- [x] T-07 Fix (code-graph stress, P2): replace `mkdtempSync(process.cwd())` with `os.tmpdir()`; remove macOS-only `process.chdir('/private/tmp')` from vitest.config.ts; scope beforeEach/afterEach chdir+restore for the scan-stress handler test (requires rootDir within cwd); 45 stress tests pass, no repo pollution
- [x] T-08 Fix (convergence.cjs, P1, deep-loop): `--persist-snapshot` without `--round-id` now throws `INPUT_VALIDATION` (exit 3); no longer coalesces roundId to `__latest__` and silently overwrites prior snapshots
- [x] T-09 Fix (session-start.ts, P1, devin): `handleCompact` mirrors Claude's compact recovery — readCompactPrime → TTL-check → semantic-validate → Recovered Context sections → clearCompactPrime on success; static fallback only on cache-miss/expiry/validation-fail
- [x] T-10 Fix (install-all.sh, P1): corrected wrong entry name for mk-spec-memory in `MCP_SCRIPTS` array to the on-disk script name
- [x] T-11 Fix (mcp-code-mode/install.sh + mcp-chrome-devtools/install.sh, P1): derive paths robustly rather than assuming CWD; scripts now run correctly when invoked directly
- [x] T-12 Fix (mk-spec-memory-launcher.cjs, P1): stale bootstrap-lock reclaim uses claims-via-rename before delete (TOCTOU-safe); a successor's fresh lockDir is a new inode the rename cannot touch; losing racer gets ENOENT → retry
- [x] T-13 Fix (_utils.sh check_node_version, P2): full three-part semver compare; integer-only compare previously accepted `20.10` vs required `20.11` incorrectly
- [x] T-14 Fix (vector-index-mutations.ts, P2): retention sweep cascades cleanup to orphan `auto_entities`/`memory_entities` rows
- [x] T-15 Fix (memory-search.ts, P1): community-search gated on `<3` weak results (shared with auto); score derived from community match quality (ranked secondary); not always-on with hard-coded 0.45; verified no hard floor drops results
- [x] T-16 Fix (.claude/agents/deep-research.md + .gemini/agents/deep-research.md, P1): corrected stale findings-registry filename to the live name
- [x] T-17 Fix (deep-ai-council SKILL.md + loop_protocol.md, P2): corrected reference from deleted `prompt_pack_round.md.tmpl` to the live asset name
- [x] T-18 Fix (checkpoint-v2-contention-stress.vitest.ts + 2 sibling tests, P2): updated hardcoded schema v29 → v30 with the enrichment columns; kept soak coverage
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-19 Each of the 12 fixes has an added regression test that passes
- [x] T-20 Verify P1 fixes: convergence exit 3 on missing `--round-id`; devin `handleCompact` recovers from compact prime; launcher lock reclaim is TOCTOU-safe; memory-search not always-on; agent docs use live filename; install scripts run when invoked directly
- [x] T-21 Comment-hygiene clean: no spec-path / packet-id tracking artifacts introduced into any edited source file
- [x] T-22 Build: system-spec-kit mcp_server `npm run build` exit 0
- [x] T-23 Deep-loop `.cjs` `node --check` OK (convergence, mk-spec-memory-launcher)
- [x] T-24 Orchestrator reviewed every diff; confirmed builds + tests; 12 agents touched disjoint file sets (23 files, no overlap); Sonnet retry succeeded after Opus 0-token blip
- [x] T-25 description.json + graph-metadata.json
- [x] T-26 validate.sh --strict → 0
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All deep-dive + implement tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] 12 fixes applied / 23 files / each stack-verified
- [x] Ship tasks (metadata, validate) complete
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
