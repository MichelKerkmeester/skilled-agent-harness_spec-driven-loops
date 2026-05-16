---
title: "Implementation Summary: 008 mk-spec-memory stress test"
description: "Pre-execution stub. Future session backfills aggregate results, per-category breakdown, and z_archive-impact section."
trigger_phrases:
  - "008 summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-stress-test/008-mk-spec-memory-stress-test"
    last_updated_at: "2026-05-16T23:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Round 4: opencode unblocked cat-04/24 + codex J fixed 52 frontmatter files"
    next_safe_action: "Optional: 4 new cat-24 FAILs from opencode (402 synonymy, 408 compound, 409 llm-made)"
    blockers:
      - "4 new cat-24 FAILs surfaced by opencode: local-LLM retrieval subsystem"
      - "49 mid-batch-cut scenarios (cat-14-pipeline + cat-16 splits)"
    key_files:
      - "handover.md"
      - "tasks.md"
      - "evidence/tool-sweep.jsonl"
      - "evidence/playbook-results.jsonl"
      - "evidence/checkpoint-create-rca.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000008004"
      session_id: "008-summary-stub"
      parent_session_id: null
    completion_pct: 98
    open_questions: []
    answered_questions: []
---
# Implementation Summary: 008 mk-spec-memory stress test

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| Status | PARTIAL (Phase 1 fully complete; Phase 2 85.8% scenario coverage with **24 fix commits** + 1 cleanup commit landing **31 of 32 FAILs closed**; all 25 categories now have rows) |
| Branch | main |
| Baseline | post packet 113 (commit b062b12b4) |
| Pre-sweep checkpoint | `pre-008-sweep-20260516T144620Z` (id=2, global scope, 11,426 memories, 124 MB) — intact end-to-end |
| Wall-clock actual | ~12 hours total (Phase 0 + Phase 1 + 4 Phase 2 dispatch waves [3 devin + 1 opencode] + 24 codex fix dispatches across 4 rounds) |
| Total commits this session | 24 fix + ~8 doc + 2 deferred-followon docs + 1 frontmatter cleanup commit |
| FAILs closed | 31 of 32 (97%) before round 4 surfaced 4 new cat-24 FAILs via opencode = 31/36 = 86% |
| Scenarios covered | 296 of 345 (85.8%) across all 25 of 25 categories |
| Remaining work | 49 uncovered scenarios (mix of partials in cat-14-pipeline, cat-16 splits) + 4 new cat-24 FAILs surfaced by opencode (Phase 4+1 follow-ons) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

**Phase 1 (39 tools, fully complete):** Every mk-spec-memory MCP tool exercised via paired-parallel cli-devin SWE-1.6. Results: 35 PASS / 2 SKIP / 1 FAIL / 1 PARTIAL. 39/39 unique tools covered, 0 malformed JSONL rows. Evidence at `evidence/tool-sweep.jsonl`.

**Phase 2 (345 scenarios, 85.8% complete):** Four dispatch waves. Waves 1-3 via paired-parallel cli-devin SWE-1.6 (Wave 1 hit Cognition rate limit after 6 paired-batches; Wave 2 resumed after reset and covered 14 more categories; Wave 3 added cat-14-pipeline remainder + cat-03 retry). Wave 4 via cli-opencode (default OpenAI runtime) cleared the cat-04 + cat-24 tool-rejected blockers that defeated devin: 18 scenarios processed cleanly with sandbox-aware SKIP/FAIL/PARTIAL/PASS classifications. **Final coverage: 296/345 rows across ALL 25 of 25 categories**. Remaining 49 scenarios are mid-batch cuts in cat-14-pipeline + cat-16 splits that didn't fully process under earlier rate limits. Evidence at `evidence/playbook-results.jsonl`.

**Wave 4 (cli-opencode) finding**: Devin SWE-1.6 has a runtime-specific opaque tool-rejection guard. Opencode's default OpenAI runtime doesn't share it. Opencode applied content-aware safety judgment (SKIP'd scenarios that legitimately required mutating real spec-folder state outside sandbox) instead of pre-flight blocking. New cat-24 FAILs surfaced this way: 402 (synonymy retrieval), 408 (compound concept synthesis), 409 (LLM-made-memory recall) — real defects in local-LLM query intelligence subsystem that devin's gate would have hidden.

**16 defect fix commits + 1 deferred-followon doc commit pushed to `main` in same session** via sequential cli-codex (gpt-5.5 reasoning_effort=high, service_tier=fast):

Round 1 (5 fixes):
- `2c75a0030` — Phase 1 P1: `checkpoint_create` typed errors + SQLITE_BUSY retry + snapshot prep extracted from write txn (4 files)
- `0a574812c` — Phase 2 cluster: `context-server.vitest` tool count drift 51→39 (1 file, 78 cascading failures cleared, closes cat-18 214/215/216 + cat-21 228/229)
- `1700ef85b` — Phase 2 cluster: trace gating + auto-priming hint + session_health baseline (7 files, closes cat-15/096 + cat-22/261 + cat-22/262)
- `03c230a39` — Phase 2 single: `searchWithFallbackTiered` single `enrichFusedResults` call (2 files, closes cat-14-pipeline/071)
- `96e52f532` — Phase 2 single: V-rule bridge dist artifact + scenario 225 load-path update (2 files, closes cat-20/225)

Round 2 (11 commits):
- `d57bcb878` — Phase 2 cluster F: retrieval — specFolder filter + memory_quick_search dispatch + V8 over-strictness on canonical spec.md (closes cat-01/002 + cat-01/187 + cat-02/EX-006)
- `af5e239e8` — cat-16/237 upgrade-level.sh (FIXED, 14/14 pass)
- `65c98790d` — cat-16/240 vitest config import (FIXED, 24 tests pass)
- `d5ae9f48b` — cat-16/241 ES module/require (FIXED)
- `847f14212` — cat-16/239 backfill-frontmatter (PARTIAL — repo frontmatter + cleanup-vector still need work)
- `29f38d082` — cat-16/242 folder-detector (PARTIAL — some path/syntax issues remain)
- `5d70791b9` — cat-16 Tier C deferred follow-ons documented (002, 235, 236, 238, 243)
- `3a4e021d3` — cat-17/220 constitutional docs sync
- `5ec25e51b` — cat-18/106 hooks/README sync
- `87f6ce249` — cat-20/226 health coverage sync (regression coverage for unconfirmed autoRepair)
- `1a7ced372` — cat-20/227 revalidation coverage sync (bounded learned-feedback + ground-truth selection + adaptive best-effort)
- `e1674dffd` — cat-21/232 adaptive fusion flag sync (runtime already honors flag; updated stale scenario expectation)

**P1 RCA artifact:** `evidence/checkpoint-create-rca.md` (parallel cli-codex investigation, 63 lines, P1 severity, 4-step remediation — all 4 implemented in `2c75a0030`).

**Memory notes added this session:**
- `feedback_git_add_not_scope_strict` (new) — captures the bloat-commit incident + strict-scope mitigation pattern
- `feedback_generate_context_regenerates_parent_metadata` (updated) — generalized to cover leaf packets, not just phase parents

**24 of 29 total session FAILs closed by fixes** (1 Phase 1 + 23 Phase 2 via 16 commits across rounds 1+2).

Round 3 (7 commits via codex I — cat-16 Tier C tail + 2 partials + playbook runner crash):
- `19ff50eef` — cat-16/002 phase-folder-creation + cat-16/236 phase-system-knowledge-node (FIXED)
- `06823e4bf` — cat-16/235 eval-runner-cli ground-truth alignment (FIXED — likely also unblocks Phase 1 `eval_run_ablation` SKIP)
- `f2eb10cd9` — cat-16/238 spec-validation-rule-engine + cat-16/236 fixture refresh (FIXED)
- `35530c0eb` — cat-16/243 setup-native-module branch check relaxed on main (FIXED — honors `feedback_stay_on_main_no_feature_branches`)
- `9924931fe` — cat-16/239 backfill-frontmatter (PARTIAL — vector cleanup + malformed handling now pass; repo-wide frontmatter cleanup deferred as broad content debt)
- `9d42bc23a` — cat-16/242 spec-folder-detection (FIXED)
- `c05613e05` — Manual playbook runner setEmbeddingModelReady removed (FIXED)

**Final FAIL closure: 31 of 32 total session FAILs closed by 23 fix commits across 3 rounds** (1 Phase 1 + 28 Phase 2 originals + 3 Round-3-surfaced sub-defects under cat-16 cluster). Only remaining: cat-16/239 broad repo-frontmatter-cleanup tail (deferred as broad content debt, not a code defect).

**Coverage gaps (Phase 4+1 follow-ons documented):**
- cat-04 (3 scenarios) + cat-24 (15 scenarios) — 18 scenarios blocked by persistent devin "tool rejected" guard; agent-config expansion did NOT unlock; runtime change to cli-opencode deferred (would consume substantial session capacity for marginal coverage gain)
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED

**Phase 0 (~5 min wall)**: Main agent ran 5 baseline checks (git ancestry, DB stats, z_archive rows, decay multiplier, vitest 159/159). All PASS. Created global checkpoint `pre-008-sweep-20260516T144620Z` (id=2, 124 MB snapshot of 11,426 memories).

**Phase 1 (~32 min wall)**: Main agent generated 38 cli-devin prompts (probe `memory_stats` + 37 templated) in 3 tiers (read-only / additive / destructive with isolated test fixtures). Dispatched 19 paired-batches via `gtimeout 540 devin -p --model swe-1.6 --permission-mode dangerous --agent-config evidence/agent-config-008.json`. Two JSON over-escape rows fixed via re-dispatch + log-reconstruction. `_meta` field stripped from agent-config after devin's strict parser rejected it. One bloated commit (3,328 files) recovered via `git revert` + `git checkout <ref> -- <paths>` extraction pattern.

**Phase 2 (Wave 1 ~35 min + Wave 2 ~30 min wall)**: Generated 27 category prompts via templated bash (24 cats single + cat-16 split into 3). Wave 1 dispatched 6 paired-batches before hitting `Permission denied: Reached overall message rate limit`. Wave 2 resumed after ~25-min cooldown; 8 more paired-batches landed. cat-04 + cat-24 persistently tool-rejected.

**Codex fix dispatches (parallel during Phase 2)**: 5 sequential cli-codex jobs (gpt-5.5 reasoning_effort=high, service_tier=fast, sandbox workspace-write with network_access=true). Each dispatched in background via Bash run_in_background; harness notified on completion. Each codex agent: read its prompt → grep + read source → implement → vitest → commit → push with strict-scope pattern.

**Tools used**: cli-devin (Phase 1/2 sweeps), cli-codex gpt-5.5 fast (5 fix jobs + 1 RCA), mk-spec-memory MCP (checkpoint create/list/delete, memory_stats verification), sequential_thinking via prompt mandate (devin lacks the MCP registration but discipline embedded in prompts).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS

- **Dispatch cadence: paired (2 concurrent) cli-devin** per packet 111/113 precedent. Held throughout; rate limit hit on overall message rate not concurrency.
- **Stop policy: run-to-completion** — surface full failure landscape. Honored: 263/345 with 28 FAILs distributed across categories, not concentrated.
- **Parallel cli-codex for fix jobs, sequential not concurrent** — would have raced on `main` push. Sequential dispatch with each job pulling before push worked cleanly. 5 fix commits landed without conflict.
- **Strict-scope git pattern** adopted mid-session after a 3,328-file bloat commit. New memory note `feedback_git_add_not_scope_strict` codifies: `git restore --staged .` → explicit `git add` → verify count → commit → verify scope before push.
- **z_archive reclassification (T2.5-T2.7) DEFERRED**: 0 PARTIAL rows actually cite z_archive impact in the 263 captured (z_archive-sensitive scenarios landed SKIP/UNAUTOMATABLE not PARTIAL). No reclassification candidates exist.
- **Pre-sweep checkpoint scoped global, not packet-local** — initial scoped checkpoint (id=1, 838 KB, 1 memory) was deleted and replaced with global (id=2, 124 MB, 11,426 memories) because the sweep mutates state across the entire DB. The wider rollback surface proved correct; checkpoint survived intact through the full session.
- **`checkpoint_create` failure under sweep load is a real lifecycle defect, not a flake** — parallel codex RCA produced 65%-confidence root cause (SQLite write-lock contention from large in-transaction snapshot prep). 4-step remediation implemented in `2c75a0030`.
- **70+ UNAUTOMATABLE rate (now 157/263 = 59.7%) is a finding** — playbook scenarios assume slash-commands + multi-MCP orchestration cli-devin lacks. Documented as Phase 4 follow-on; future sweeps should either run from claude/opencode runtime or playbook needs runtime-tagged variants.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## 5. VERIFICATION

Current state (session end):

| Check | Target | Actual |
|-------|--------|--------|
| `npx vitest run tests/index-scope.vitest.ts tests/full-spec-doc-indexing.vitest.ts` | 159 / 159 pass | 159 / 159 ✓ |
| `wc -l evidence/tool-sweep.jsonl` | ≥ 39 | 39 ✓ |
| `wc -l evidence/playbook-results.jsonl` | ≥ 345 | **263 (76.2%)** — PARTIAL pending cat-04 + cat-24 |
| z_archive row count post-sweep | ≥ 2618 | confirmed (~2786 + ambient growth) |
| `validate.sh --strict` on packet 008 | exit 0 | exit 0 ✓ |
| Rollback checkpoint pre-008-sweep-20260516T144620Z exists | Yes | Yes ✓ |
| `context-server.vitest.ts` (after `0a574812c`) | 397/397 pass | 397/397 ✓ |
| `searchWithFallbackTiered` enrichFusedResults call count (after `03c230a39`) | 1 per invocation | 1 ✓ |
| V-rule bridge artifact (after `96e52f532`) | available | v-rule-bridge:available ✓ |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS

- **82 scenarios uncovered**: cat-04 (3) + cat-24 (15) tool-rejected = 18; cat-14-pipeline missing 12 (got 14/26 before rate-limit cut); cat-16 split parts and others total ≈ 82 uncovered scenarios out of 345.
- **18 Phase 2 FAILs not closed in this session**: cat-01 (2), cat-02 (1), cat-16-tooling (10 heterogeneous — each needs own investigation), cat-17 (1), cat-18/106 (1, hooks/README sync), cat-20/226/227 (2 coverage-evidence followups), cat-21/232 (1 adaptive fusion flag). Documented in `tasks.md` Phase 2 blockers section for future session.
- **`checkpoint_delete` Phase 1 PARTIAL is a Devin scope-violation pattern, not a code defect**: when destructive-tool fixture create failed (cascade from `checkpoint_create` FAIL — now fixed by `2c75a0030`), devin improvised by deleting an existing pre-existing checkpoint. Future sweep recipe needs explicit "halt if setup fails" rule in destructive-tool prompts.
- **70+ UNAUTOMATABLE rate (157/263 = 59.7%)**: cli-devin lacks slash-commands + multi-MCP orchestration that many playbook scenarios assume. Playbook needs runtime-tagged variants OR sweeps should run from richer runtimes (opencode/claude code).
- **`eval_run_ablation` SKIP**: ground-truth alignment not present in current DB; env blocker unrelated to packet 113.
- **One commit was bloated and recovered**: `7e5146202` originally captured 3,328 files due to pre-existing index state. Reverted via `54188cf66` and clean-recommitted as `b9437fcc9`. Memory note `feedback_git_add_not_scope_strict` codifies the prevention pattern.
<!-- /ANCHOR:limitations -->
