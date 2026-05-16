---
title: "Tasks: 008 mk-spec-memory stress test"
description: "Numbered execution checklist mapped to handover.md 4-phase flow."
trigger_phrases:
  - "008 tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-stress-test/008-mk-spec-memory-stress-test"
    last_updated_at: "2026-05-16T17:35:00Z"
    last_updated_by: "main_agent"
    recent_action: "Phase 2 PARTIAL: 139/345 rows; devin rate-limited at batch 6"
    next_safe_action: "Wait for devin rate-limit reset; resume Phase 2 batches 7-14"
    blockers:
      - "Devin rate limit blocks Phase 2 resume"
      - "cat-04 tool-rejected error needs agent-config audit"
      - "checkpoint_create FAIL pending Phase 4 remediation"
    key_files:
      - "handover.md"
      - "evidence/tool-sweep.jsonl"
      - "evidence/playbook-results.jsonl"
      - "evidence/checkpoint-create-rca.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000008003"
      session_id: "008-tasks"
      parent_session_id: null
    completion_pct: 65
    open_questions: []
    answered_questions: []
---
# Tasks: 008 mk-spec-memory stress test

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## 1. TASK NOTATION

- `[x]` = completed
- `[ ]` = pending
- Per-row atomic commit for any mutation surfaced
- Paired-parallel cli-devin dispatch (2 concurrent)
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## 2. PHASE 1: SETUP

### Baseline
- [x] T0.1: Verify git HEAD includes packet 113 commits — 7/8 listed hits in ancestry (956595dbd, 58e3f3646, aaf509797, 296e64b2d, 3909f8202, 12302d853, b062b12b4); `280fe4888` subject is "config:" so grep missed but commit is present; bonus `37daeb8cb 113 W4: backfill...` also in ancestry
- [x] T0.2: `cli.js stats` shows ≥ 11201 memories, schema v27 — actual: 11426 memories, schema v27
- [x] T0.3: z_archive row count ≥ 2618 in `memory_index` — actual: 2786 (+168 ambient growth since handover authored; handover §2 explicitly allows "give or take")
- [x] T0.4: `getArchiveMultiplier('/foo/z_archive/bar')` returns 0.1 — actual: 0.1
- [x] T0.5: vitest 159/159 on the 2 targeted files — actual: 159/159 passed in 732ms
- [x] T0.6: `checkpoint_create` named `pre-008-sweep-<UTC>` — created `pre-008-sweep-20260516T144620Z` (id=2, global scope, 11426 memories, 124 MB snapshot at 2026-05-16T14:46:52Z)

### 39-tool inventory sweep
- [x] T1.1: Generate 39 cli-devin prompts (one per mk-spec-memory tool) — 38 prompts (probe covered memory_stats) generated via templated Bash script in 3 tiers (read-only/additive/destructive); see `/tmp/008-batch-20260516T155606Z/prompts/`
- [x] T1.2: Dispatch paired-parallel (2 concurrent × 19 batches) — total wall ~32 min (15:57Z → 16:29Z), well under handover's 60–90 min estimate
- [x] T1.3: Verify every tool has a row in `evidence/tool-sweep.jsonl` — **39/39 unique tools**, 0 malformed rows after 2 fixes (deep_loop_graph_query + memory_causal_link both over-escaped nested JSON; fixed via re-dispatch and reconstruction from log)
- [x] T1.4: Commit Phase 1 evidence — committed this packet update + agent-config + evidence/tool-sweep.jsonl

### Phase 1 results summary
- **PASS: 35** (89.7%)
- **SKIP: 2** (5.1%) — `eval_run_ablation` (ground truth not aligned), `checkpoint_restore` (cascade from checkpoint_create FAIL)
- **FAIL: 1** (2.6%) — `checkpoint_create` (DB error `CHECKPOINT_CREATE_FAILED` under sweep load — **real defect surfaced**)
- **PARTIAL: 1** (2.6%) — `checkpoint_delete` (happy path deleted real pre-existing checkpoint `pre-cleanup-2026-05-14T06-42-07` not a sandbox fixture — **scope violation by Devin when test-fixture create failed; improvised destructively instead of SKIPping**)

### Phase 1 follow-on items
1. Investigate `checkpoint_create` DB failure under sweep load (race? lock contention? size cap?) — root cause for Phase 4 synthesis
2. `eval_run_ablation` ground-truth re-alignment is unrelated to packet 113; document as env-blocker not tool defect
3. Devin scope-violation pattern: when destructive-tool test-fixture setup fails, devin must SKIP not improvise. Future sweep recipe needs explicit "halt if setup fails" rule embedded in prompts
4. Rollback checkpoint `pre-008-sweep-20260516T144620Z` confirmed intact post-sweep (verified in DB)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: IMPLEMENTATION

### 345-scenario playbook sweep
- [x] T2.1: Generate 25 category prompts — 27 produced (24 cats single + cat-16 split into 3 parts); see `/tmp/008-batch-20260516T155606Z/phase2-prompts/`
- [~] T2.2: Dispatch paired-parallel — **PARTIAL: 6/14 batches executed before devin hit `Permission denied: Reached overall message rate limit`** at ~17:31Z. Batches 7-13 returned in ~4s each. cat-04 had separate "tool rejected" error.
- [~] T2.3: Verify every scenario has a row — **PARTIAL: 139/345 (40.3%)** across 11 of 25 categories
- [x] T2.4: Commit Phase 2 evidence — strict-scope commit pattern (per `feedback_git_add_not_scope_strict`)

### Phase 2 results (139 rows, 11 categories)
- **PASS: 15** (10.8%) | **FAIL: 11** (7.9%) | **SKIP: 31** (22.3%) | **UNAUTOMATABLE: 80** (57.6%) | **PARTIAL: 2** (1.4%)
- 80 UNAUTOMATABLE rows are themselves a finding: playbook scenarios assume slash-commands + multi-MCP orchestration that devin lacks
- 11 real Phase 2 FAILs concentrated in cat-14-pipeline (1), cat-15 (1), cat-18 (4), cat-20 (3), cat-22 (2)

### Phase 2 blockers (carry to future session)
1. **Devin rate limit** — Cognition API "Reached overall message rate limit" hit at ~17:31Z. Reset duration unknown. Resume requires pre-flight devin probe + likely serial cadence.
2. **cat-04 tool-rejected** — agent-config-008.json allow-list missing something cat-04 needs. Audit before retry.
3. **70+ UNAUTOMATABLE rate** — playbook scope mismatch with cli-devin runtime. Real packet 113 follow-on concern.

### z_archive revalidation (T2.5-T2.7) — DEFERRED
0 PARTIAL rows cite z_archive impact in current sweep (all z_archive-sensitive scenarios landed SKIP/UNAUTOMATABLE). Defer reclassification to post-rate-limit-reset retry.

- [ ] T2.5: Filter PARTIAL rows that cite z_archive impact — DEFERRED (0 candidates)
- [ ] T2.6: Reclassify each to PASS or FAIL with packet 113 attribution — DEFERRED
- [ ] T2.7: Commit Phase 3 reclassifications — DEFERRED
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: VERIFICATION

> Maps to handover.md Phase 4 (synthesis).

- [ ] T3.1: Aggregate totals (PASS / FAIL / SKIP / UNAUTOMATABLE / PARTIAL)
- [ ] T3.2: Per-category breakdown table
- [ ] T3.3: z_archive impact summary
- [ ] T3.4: Backfill implementation-summary.md
- [ ] T3.5: strict-validate 008 packet exit 0
- [ ] T3.6: z_archive row count + decay multiplier re-verified post-sweep
- [ ] T3.7: Memory save via `/memory:save`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## 5. COMPLETION CRITERIA

- 39 tool rows + 345 scenario rows in evidence/
- Aggregated PASS ratio ≥ 80% (target)
- All FAILs documented with reproduction
- Follow-on packet list generated for genuine regressions
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## 6. CROSS-REFERENCES

- handover.md — primary entry point for new session
- spec.md — scope + requirements
- Packet 113 — predecessor (z_archive un-exclusion)
- Packet 111 — workflow precedent (paired-parallel cli-devin dispatch)
- Manual testing playbook root: `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md`
- cli-devin recipe: `.opencode/skills/cli-devin/assets/agent-config-deep-research-iter.json`
<!-- /ANCHOR:cross-refs -->
