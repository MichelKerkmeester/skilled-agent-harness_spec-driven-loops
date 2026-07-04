---
title: "Tasks: Phase 3: content-hash-normalization-and-save-dedup-lanes [template:level_3/tasks.md]"
description: "Task breakdown: confirm-before-fix probes and vitest baseline first, then content-hash normalization with dual-compare migration, PE-gate lane reachability, the P0 full-auto canonical save fix, save dedup lane gating, and verification with un-skipped parity tests."
trigger_phrases:
  - "content hash normalization tasks"
  - "save dedup lanes tasks"
  - "snapshot churn supersede tasks"
  - "confirm before fix probes"
  - "vitest baseline before delta"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/003-content-hash-normalization-and-save-dedup-lanes"
    last_updated_at: "2026-07-04T14:08:36.883Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored Level 3 planning docs (spec, plan, tasks, checklist, decision-record)"
    next_safe_action: "Program complete (016 shipped + pushed)"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/003-content-hash-normalization-and-save-dedup-lanes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3: content-hash-normalization-and-save-dedup-lanes

<!-- SPECKIT_LEVEL: 3 -->

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

Finding references use deep-dive-report §3 numbering (`#N`), root-cause chains (`Chain A/E`), and findings-ledger tags (`Agent H/G`, `L1`). Verification status: 🟢 = live-reproduced/code-verified by the primary session, 🟡 = agent-verified, needs a confirm-before-fix probe (finding-is-a-hypothesis). Citations live here in tasks.md, never in code comments (comment-hygiene HARD BLOCK).
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 🟡 CONFIRM-BEFORE-FIX (must be FIRST): re-verify each 🟡 finding against live code before changing anything; record quote + line for each in scratch/t001-confirmations.md — #21 complement recheck (memory-save.ts:2618), #22 quality-gate self-dup (memory-save.ts:2398 + save-quality-gate.ts:704), #26 PE lanes unreachable (pe-orchestration.ts:66-67 + pe-gating.ts:172-174), #2 full-auto self-reject (memory-save.ts:1803/3200 + atomic-index-memory.ts:360 + spec-doc-structure.ts:1105), Agent H P1 recon conflict insert-before-retire, Agent H P2 preflight self-dup / retire-carry re-stamp / tombstone no-resurrect / governance rollback / mutex reclaim / BM25-in-tx, Agent G P1 cross-file SUPERSEDE regex deprecation (guard at pe-orchestration.ts:80-97; condition :80-82 omits SUPERSEDE — pe-gating.ts:293-298 is `markMemorySuperseded`, the UPDATE mutation, not the guard), Agent G CONTRACT prediction-error-gate.init(db) never called, Agent F P2 content-router Tier-1 transcript-wrapper substring drop 🟢 code-verified (content-router.ts:410-414)
- [ ] T002 BASELINE (before ANY code change): capture full vitest gate counts (pass/fail/skip) for mcp_server, the current describe.skip inventory (memory-save-integration.vitest.ts:526), and live save probes — re-save unchanged file, re-save timestamp-churn-only file — as the starting numbers for the delta report (.opencode/skills/system-spec-kit/mcp_server)
- [ ] T003 [P] Run the affected-surfaces rg inventories from plan.md FIX ADDENDUM (producers, consumers, matrix axes) and store outputs in scratch/t003-inventories/; the `createHash('sha256')` inventory must confirm no other caller computes content identity directly (hashContentBody @ content-id.ts:14 is the sole primitive, computeContentHash @ memory-parser.ts:914 the sole wrapper) (plan.md)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Normalize `computeContentHash` input: CRLF→LF, strip trailing whitespace, zero `_memory.continuity` session_dedup fingerprint + last_updated_at lines before hashing — finding: Chain A step 1, Agent H P2 "ROOT CAUSE of L1 churn" 🟢 (.opencode/skills/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:914)
- [ ] T005 Dual-compare migration for existing hashes via one shared `hashesMatch(content, storedHash)` helper used at every comparison site (preflight, PE gate, quality gate, v28 lineage): comparisons accept legacy raw hash OR normalized hash; idempotent, read-side, no stored-hash rewrite — finding: decomposition §003 bullet 1 (.opencode/skills/system-spec-kit/mcp_server/lib/content-id.ts `hashesMatch`; lib/storage/vector-index-schema.ts migration registry)
- [ ] T006 [P] Unify the two `buildContinuityFingerprint` builders: delete the local copy and import the exported canonical one; assert identical zeroing behavior — finding: Agent H CONTRACT (CONTINUITY_FRESHNESS permanent mismatch risk) (.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:1078 → lib/validation/spec-doc-structure.ts:580)
- [ ] T007 Make PE UPDATE/REINFORCE reachable: drop `excludeFilePath`/`excludeCanonicalFilePath` from the `findSimilarMemories` call so same-path predecessors become candidates; keep the cross-file CREATE rewrite guard — finding: #26, Chain E 🟡 (.opencode/skills/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:66-67; pe-gating.ts:172-174)
- [ ] T008 Add the SUPERSEDE case to the cross-file canonical-path guard condition (pe-orchestration.ts:80-82 tests only UPDATE/REINFORCE today; guard body :84-97 rewrites cross-file targets to CREATE) so cross-file regex matches cannot deprecate sibling docs, and wire PE audit init (`predictionErrorGate.init(db)` — dead T-09 logging) — finding: Agent G P1 + Agent G CONTRACT 🟡 (.opencode/skills/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:80-97; handlers/pe-gating.ts init wiring — NOT pe-gating.ts:293-298, which is `markMemorySuperseded`, the UPDATE mutation)
- [ ] T009 P0 canonical save ordering: run POST_SAVE_FINGERPRINT after promotion (or validate against the pending content that will be promoted); stop the validator writing the snapshot back on mismatch — finding: #2 (P0) 🟡 (.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:1803; handlers/save/atomic-index-memory.ts:360; lib/validation/spec-doc-structure.ts:1105)
- [ ] T010 P0 canonical save dispatch: make the advertised apply follow-up dispatch the canonical writer under `plannerMode='full-auto'` (today `shouldPlanCanonicalSave` excludes full-auto and the canonical writer has no non-test caller) — finding: #2 (P0) 🟡 (.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:3200)
- [ ] T011 Gate the transactional complement recheck on reconsolidation-enabled AND `!force`; exclude the same-path predecessor from its candidate set — finding: #21 🟡 (.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2618)
- [ ] T012 [P] Quality-gate Layer-3 semantic dedup: exclude the doc's own predecessor (mirror the PE path's exclusion) — finding: #22 🟡 (.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2398; lib/validation/save-quality-gate.ts:704 `checkSemanticDedup`)
- [ ] T013 [P] Preflight exact-dup: same-path match returns benign `unchanged` instead of ERROR duplicate-of-itself — finding: Agent H P2 🟡 (.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts preflight lane)
- [ ] T014 Recon conflict ordering: retire the predecessor before inserting the successor to avoid the `idx_memory_logical_key_active_unique` collision — finding: Agent H P1 🟡 (.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts recon conflict path)
- [ ] T015 Retire-carry: stop re-stamping `deprecated` onto the successor; surface dedup/tombstone hits in save results and add the resurrect path for tombstoned same-path predecessors — finding: Agent H P2 ×2 🟡 (.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts retire-carry lane)
- [ ] T016 [P] Governance rollback re-activates the retired predecessor (doc must not go invisible until next scan); add the chunked-save rollback transactional note as a durable-WHY comment only — finding: Agent H P2 🟡 (.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts governance rollback lane)
- [ ] T017 [P] Spec-folder mutex reclaim verifies rename before claiming; BM25 in-memory add moves post-commit so a rolled-back transaction leaves no phantom lexical row — finding: Agent H P2 ×2 🟡 (.opencode/skills/system-spec-kit/mcp_server/handlers/save + lexical index wiring)
- [ ] T018 [P] Result-time file-identity collapse: dedup fusion candidates by canonical file identity keeping the best-scored row (chunk children excluded), replacing the row-id-only key — finding: L1 🟢 "Dedup key at result time = row id" (.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:949)
- [ ] T025 [P] Anchor the content-router Tier-1 `tier1.transcript.wrapper` speaker cues to line-start (`^\s*(user|assistant|tool):`) or require ≥2 speaker turns, replacing the substring match that drops any chunk mentioning `tool:`/`user:`/`assistant:` anywhere in normalized text; add a fixture proving a mid-line mention survives and a real multi-turn transcript still drops (implementation task; numbered after T024 to avoid renumbering the verification tasks) — finding: report Systemic #4 item 3, Agent F P2 🟢 (.opencode/skills/system-spec-kit/mcp_server/lib/routing/content-router.ts:410-414 `tier1.transcript.wrapper`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T019 Un-skip `describe.skip('planner-first and fallback parity')`: rewrite the stale T511+ assertions to the current planner-default contract, then remove `.skip` and keep the block active as the REQ-002 regression net — finding: #2 (P0) notes "Success-parity tests describe.skip'd" (.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts:526)
- [ ] T020 [P] Fix tests that mock `findSimilarMemories` to mask #26: add same-path candidate fixtures so UPDATE/REINFORCE reachability is asserted, not mocked away — finding: Chain E "tests mask it by mocking" (.opencode/skills/system-spec-kit/mcp_server/tests/pe-orchestration.vitest.ts, tests/pe-gating.vitest.ts, tests/handler-memory-save.vitest.ts)
- [ ] T021 Execute the 16-row save matrix from plan.md (save mode × change type × recon × force × predecessor state) plus the normalization adversarial table (CRLF-in-fence, fingerprint-shaped body line, no continuity block, empty content) (.opencode/skills/system-spec-kit/mcp_server/tests)
- [ ] T022 Re-run the WHOLE vitest gate and report the delta against the T002 baseline (pass/fail/skip counts before vs after); no completion claim without both numbers (.opencode/skills/system-spec-kit/mcp_server)
- [ ] T023 Live success gates: re-save unchanged file → `unchanged` (SC-001); edited re-save → UPDATE/REINFORCE (SC-002); timestamp churn → zero new deprecated snapshots (SC-003); "packet 028 memory search intelligence status" query → one row per logical doc from the save side (SC-004) (live daemon probes)
- [ ] T024 Sync spec/plan/tasks/checklist evidence, complete checklist.md P0 items, and run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this folder> --strict` to exit 0 (this spec folder)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed (T023 live gates with recorded outputs)
- [ ] T022 baseline delta reported (before AND after numbers)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md` (REQ-001..REQ-009 map to T004..T018; REQ-010 → T025, content-router correctness added during plan-review remediation)
- **Plan**: See `plan.md` (FIX ADDENDUM inventories feed T003; testing strategy feeds T019-T022)
- **Decisions**: See `decision-record.md` (ADR-001..ADR-003)
- **Sources**: `../research/deep-dive-report.md` (Chain A/E; §3 #2/#21/#22/#26), `../research/findings-ledger.md` (Agent H, Agent G, L1), `../research/phase-decomposition.md` (§ 003)
<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 3 TASKS
- Confirm-before-fix and baseline gate all implementation tasks
- Finding citations stay in this file, never in code comments
-->
