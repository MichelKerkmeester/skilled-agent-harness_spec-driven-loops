---
title: "Task Breakdown: Scouted Bugfix Batch 2"
description: "Task list for the verify-first deep-dive -> implement workflow over the remaining 15 of 20 scouted candidate defects (13 fixes / 22 files)."
trigger_phrases:
  - "scouted bugfix batch 2 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/000-release-and-program-cleanup/010-scouted-bugfix-train/002-scouted-bugfix-batch-2"
    last_updated_at: "2026-06-03T07:31:00Z"
    last_updated_by: "claude-opus"
    recent_action: "All deep-dive + implement tasks complete; 13 fixes / 22 files / verified"
    next_safe_action: "Metadata + validate + reconcile"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embeddings/auto-select.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/storage/vector-index-schema.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scouted-bugfix-batch-2-session"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Task Breakdown: Scouted Bugfix Batch 2

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

- [x] T-01 Carry over the remaining 15 scouted targets (after batch 1's 5) from the 20-target scout
- [x] T-02 [P] Run 15 parallel gpt-5.5-fast confirm deep-dives against the real code
- [x] T-03 Classify the 15: 4 CONFIRMED, 9 partial-but-real, 2 REFUTED
- [x] T-04 Refute the 2 headlines — hook-tests `specs/` path is fine (`specs/` is a symlink to `.opencode/specs/`); the reconsolidation env-leak does not actually leak; neither edited
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-05 [P] Run 13 parallel disjoint-file implement agents on the confirmed + partial defects (22 files, REAL part only)
- [x] T-06 Fix (chunking.ts, P2): `maxLength<=0` guard + `remainingBudget<=0` break on the critical-section loop + code-point-safe truncation (was non-Unicode-safe `substring`)
- [x] T-07 Fix (coverage-graph-signals.ts, P1 deep-loop): claimVerificationRate returns 1.0 vacuous-pass with no CLAIM nodes (was 0 → perpetual CONTINUE), matching p0ResolutionRate
- [x] T-08 Fix (fanout-run.cjs, P1 deep-loop): stale cli-gemini fallback `gemini-2.5-pro` → `gemini-3.1-pro-preview`
- [x] T-09 Fix (fanout-merge.cjs, P2 deep-loop): add `resolvedQuestionsById` Map mirroring `openQuestionsById` so merge keeps per-lineage resolvedQuestions/resolvedFindings
- [x] T-10 Fix (spec-doc-health.ts, P2): local `isPhaseParent()` detector so phase parents do not get false health errors on absent plan/tasks/checklist (advisory-only)
- [x] T-11 Fix (rrf-fusion.ts, P2): two-list `fuseResults` normalization parity with `fuseResultsMulti`
- [x] T-12 Fix (auto-select.ts, P2): hf-local persisted dim mirrors HfLocalProvider contract (canonical=768, custom=0); drop the legacy `HF_LOCAL_MODEL` env alias (SKIPPED gpt-5.5's cloud-fallback magic-number refactor as a behavior-neutral no-op)
- [x] T-13 Fix (semantic-shadow.ts, P2 skill-advisor): raw `LaneMatch.shadowOnly` flipped true→false to match lane liveness (fusion already recomputes from `isLiveScorerLane`; inert for all public scoring)
- [x] T-14 Fix (vector-index-schema.ts, P1): add `idx_memory_logical_key_active_unique` to REQUIRED_INDEXES validation (v28 active-row unique index was unvalidated)
- [x] T-15 Fix (readiness-marker.ts, P2 code-graph): resolve marker base dir via a workspace-root helper mirroring `core/config.ts` instead of `process.cwd()`
- [x] T-16 Fix (dispatch-minimax.cjs, P2 benchmark): conditional `--agent` (drop the unconditional stale `--agent general`)
- [x] T-17 Fix (test-opencode-plugins.ts runner, P2): stale plugin import `spec-kit-skill-advisor.js` → `mk-skill-advisor.js`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-18 Each of the 13 fixes has an added regression test that passes
- [x] T-19 Verify P1 fixes: coverage-graph vacuous-pass stops perpetual CONTINUE; fanout-run uses current gemini fallback; vector-index validates the v28 unique index
- [x] T-20 Comment-hygiene clean: no spec-path / packet-id tracking artifacts introduced into any edited source file
- [x] T-21 Builds: system-spec-kit + skill-advisor + code-graph mcp_server `npm run build` exit 0
- [x] T-22 Deep-loop `.cjs` `node --check` OK (fanout-run, fanout-merge, dispatch-minimax)
- [x] T-23 Orchestrator reviewed every diff; confirmed builds + tests; 13 agents touched disjoint file sets (22 files, no overlap)
- [ ] T-24 description.json + graph-metadata.json
- [ ] T-25 validate.sh --strict → 0
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All deep-dive + implement tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] 13 fixes applied / 22 files / each stack-verified
- [ ] Ship tasks (metadata, validate) complete
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
</content>
