---
title: "008: Handover — mk-spec-memory comprehensive stress test (post-113 z_archive reindex)"
description: "Pick up a fresh session here. Stress test all 39 mk-spec-memory tools and run all 345 manual_testing_playbook scenarios via cli-devin SWE-1.6. Baseline state captured post commit b062b12b4."
trigger_phrases:
  - "008 handover"
  - "mk-spec-memory stress test"
  - "manual testing playbook full run"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-stress-test/008-mk-spec-memory-stress-test"
    last_updated_at: "2026-05-16T14:30:00Z"
    last_updated_by: "main_agent"
    recent_action: "Pre-flight patch: 24→25 categories + multi-prompt JSONL row rule + revised wall-clock"
    next_safe_action: "Run Phase 0 baseline checks (5 commands in §2)"
    blockers: []
    key_files:
      - "spec.md"
      - "handover.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000008001"
      session_id: "008-handover-author"
      parent_session_id: null
    completion_pct: 5
    open_questions:
      - "Q1: dispatch cadence — parallel pairs (2x cli-devin), 4 batches, or sequential? Default: paired (packet 111/113 precedent)"
      - "Q2: scenarios that explicitly require z_archive content (post-fix) get a SEPARATE before/after pair to confirm the change is healthy?"
    answered_questions:
      - "Q0: scope — 39 tools + 345 scenarios. Confirmed by operator."
      - "Q0: executor — cli-devin SWE-1.6. Confirmed by operator."
---
# 008: Handover — mk-spec-memory comprehensive stress test

<!-- SPECKIT_TEMPLATE_SOURCE: handover | v1.0 -->

---

<!-- ANCHOR:handover-summary -->
## 1. Handover Summary

**Goal:** Comprehensive stress test of mk-spec-memory MCP server now that z_archive content is indexed.

**Two test surfaces:**
1. **All 39 mk-spec-memory MCP tools** — exercise each tool through its happy path + at least one edge case. Confirm tool advertises in `/mcp` and the handler returns a well-formed MCP response.
2. **All 345 manual_testing_playbook scenarios** under `.opencode/skills/system-spec-kit/manual_testing_playbook/` (**25 category dirs** — `14--pipeline-architecture` and `14--stress-testing` share the `14--` prefix). Each scenario MUST be executed for real, not mocked (playbook execution policy).

**Why now:** Commit `b062b12b4` (packet 113) un-excluded z_archive from `EXCLUDED_FOR_MEMORY`. 2618 archived rows are now indexed with 0.1 decay multiplier. Behavior under load + scoring fidelity needs validation against the 345-scenario corpus. The fix shipped tests + docs cleanly (packet 113 strict-validate PASS, vitest 159/159), but only narrow surface coverage. The 345-scenario sweep is the real-traffic equivalent.

**Status entering new session:**
- All 113 work shipped + 8 commits on main; latest: `956595dbd` (cosmetic doc fixes).
- mk-spec-memory DB total: **11201 memories** (schema v27); z_archive rows: 2618.
- Decay `getArchiveMultiplier('/foo/z_archive/bar')` returns 0.1 (verified).
- `.mcp.json` symlink to `.claude/mcp.json` shipped (commit `280fe4888`); fresh sessions will see all 6 servers in `/mcp`.

**Estimated wall-clock:** 4–6 hours autonomous (5–8 min per playbook category × 25 + tool-by-tool sweep; revised estimate after pre-flight inspection: heavy category 16 with 55 scenarios likely needs ~3 sub-batches, so Phase 2 lands closer to 27 dispatches / ~13 paired-batches / ~70–110 min if no widespread regressions surface). Per memory note "CLI dispatch unreliability under heavy parallelism", default to **paired parallel dispatch** (2 cli-devin processes concurrent, NOT 11 — that flaked in packet 111 W3.A retries).
<!-- /ANCHOR:handover-summary -->

---

<!-- ANCHOR:context-transfer -->
## 2. Context Transfer

### Baseline (verify in new session BEFORE dispatching anything)

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public

# 1. Confirm 113 is in HEAD ancestry
git log --oneline | grep -E "113|z_archive" | head -10
# Expected hits: 956595dbd, 280fe4888, 58e3f3646, aaf509797, 296e64b2d, 3909f8202, 12302d853, b062b12b4

# 2. Memory DB sanity
node .opencode/skills/system-spec-kit/mcp_server/dist/cli.js stats 2>&1 | grep -E "Total:|Schema:|z_archive" -A1

# 3. z_archive rows still indexed
DB=$(node -e "import('./.opencode/skills/system-spec-kit/mcp_server/dist/lib/search/vector-index.js').then(v => { v.initializeDb(); console.log(v.getDb().name); v.closeDb(); })" 2>&1 | tail -1)
sqlite3 "$DB" "SELECT COUNT(*) FROM memory_index WHERE file_path LIKE '%/z_archive/%';"
# Expected: 2618 (give or take from concurrent edits)

# 4. Decay multiplier intact
node -e "import('./.opencode/skills/system-spec-kit/shared/dist/scoring/folder-scoring.js').then(m => console.log(m.getArchiveMultiplier('/foo/z_archive/bar')));"
# Expected: 0.1

# 5. Targeted vitest pass
cd .opencode/skills/system-spec-kit/mcp_server
npx vitest run tests/index-scope.vitest.ts tests/full-spec-doc-indexing.vitest.ts 2>&1 | tail -5
# Expected: Test Files 2 passed | Tests 159 passed
```

If any baseline check fails, **HALT** — fix before dispatching. Common failure modes documented in packet 113's `implementation-summary.md`.

### Tool surface (39 tools)

Per `.claude/mcp.json` mk-spec-memory NOTE_2_TOOLS:

| Group | Count | Tools |
|-------|------:|-------|
| memory | 15 | save / search / context / match_triggers / index_scan / stats / health / validate / update / delete / bulk_delete / list / drift_why / retention_sweep / get_learning_history |
| causal | 2 | memory_causal_link / memory_causal_stats |
| ingest | 3 | memory_ingest_start / status / cancel |
| session | 3 | session_bootstrap / session_resume / session_health |
| checkpoint | 4 | checkpoint_create / delete / list / restore |
| task | 2 | task_preflight / task_postflight |
| council graph | 4 | council_graph_query / status / upsert / convergence |
| deep-loop graph | 4 | deep_loop_graph_query / status / upsert / convergence |
| eval | 2 | eval_run_ablation / reporting_dashboard |

Tool schemas: `.opencode/skills/system-spec-kit/mcp_server/lib/handlers/tool-schemas.ts` (or compiled at `dist/tool-schemas.js`). Full namespace: `mcp__mk_spec_memory__<tool>`.

### Playbook scope (345 scenarios, 25 category dirs)

Root index: `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md`.

Category groups (alphabetical numeric prefix):

```
01--retrieval                            13--memory-quality-and-indexing
02--mutation                             14--pipeline-architecture
03--discovery                            14--stress-testing  (note: duplicate 14 prefix)
04--maintenance                          15--retrieval-enhancements
05--lifecycle                            16--tooling-and-scripts
06--analysis                             17--governance
07--evaluation                           18--ux-hooks
08--bug-fixes-and-data-integrity         19--feature-flag-reference
09--evaluation-and-measurement           20--remediation-revalidation
10--graph-signal-activation              21--implement-and-remove-deprecated-features
11--scoring-and-calibration              22--context-preservation
12--query-intelligence                   23--doctor-commands
                                         24--local-llm-query-intelligence
```

**Playbook execution policy (verbatim from root index):**

> Every scenario MUST be executed for real — not mocked and not stubbed. AI agents executing these scenarios must run the actual commands, inspect real files, call real handlers, and verify real outputs. Valid scenario classifications are `PASS`, `FAIL`, `SKIP` (with a specific sandbox or runtime blocker documented), or `UNAUTOMATABLE` (with the concrete reason the scenario cannot be truthfully executed through the direct-handler runner). Packet-level summaries may additionally use `PARTIAL` when core behavior was observed but supporting evidence remained incomplete.

### Why z_archive matters for THIS sweep

Scenarios under `01--retrieval`, `04--maintenance`, `13--memory-quality-and-indexing`, and `20--remediation-revalidation` have historical assertions that z_archive content is absent. Post-113, those assertions are wrong. **Watch for false FAILs** where a scenario expects `count=0` rows and now sees ≥ 2618. Reclassify those as PARTIAL with a 113-context note, then file a follow-on cleanup TSV per the packet 113 pattern.

### cli-devin v1.0.4.1 recipe + dispatch pattern (proven)

- Recipe: `.opencode/skills/cli-devin/assets/agent-config-deep-research-iter.json`
- Dispatch shape (validated in packet 113):

```bash
gtimeout 600 devin -p \
  --prompt-file /tmp/008-XYZ/prompt-NNN.md \
  --model swe-1.6 \
  --permission-mode dangerous \
  --agent-config /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-stress-test/008-mk-spec-memory-stress-test/evidence/agent-config-008.json \
  > /tmp/008-XYZ/logs/NNN.log 2>&1 </dev/null
```

Key flags:
- `-p` non-interactive
- `--permission-mode dangerous` — needed for Write/Edit/Exec in non-interactive mode (per packet 113 validation)
- `--agent-config` — must include explicit allow-list for Write targets

**Devin lacks sequential_thinking MCP registration** (per memory note). The recipe's mandate becomes prompt-level only; that's acceptable.

**Parallelism ceiling: 2 concurrent.** Per memory note `feedback_cli_dispatch_unreliability`, beyond 2 concurrent dispatches the failure rate climbs. Default to paired pairs across ~13 batches (25 categories, one odd) or sequential 25 dispatches.
<!-- /ANCHOR:context-transfer -->

---

<!-- ANCHOR:next-session -->
## 3. For Next Session

### Suggested execution flow (4–6h wall-clock)

**Phase 0 — Baseline + scaffold (30 min, main agent)**

1. Run the 5 baseline checks in §2 above.
2. Author the missing 008 L1 docs (spec.md, plan.md, tasks.md, implementation-summary.md, description.json, graph-metadata.json) following packet 113's shape.
3. Create `evidence/` subdir with the cli-devin agent-config + results TSV scaffold.
4. Commit scaffold.

**Phase 1 — 39-tool inventory sweep (60–90 min, paired cli-devin)**

Generate 39 prompt files, one per tool. Each prompt:
- Reads `dist/tool-schemas.js` for that tool's schema
- Composes a happy-path invocation + 1 edge case
- Records JSONL row: `{tool, status: PASS|FAIL|SKIP, evidence: <file_path:line or output snippet>}`
- Appends to `evidence/tool-sweep.jsonl`

Dispatch paired (2 concurrent) × ~20 batches. Tools that need state setup (checkpoint_restore, memory_ingest_cancel) get sequenced after the tools that create their state.

**Phase 2 — Playbook category sweeps (3–4h, paired cli-devin per category)**

For each of 25 categories:
- Generate 1 cli-devin prompt covering ALL scenarios in that category
- Prompt reads each `.md` scenario file under the category dir
- Executes the scenario per its embedded contract (real, not mocked)
- Records per-scenario JSONL: `{category, scenario_id, classification, evidence}` to `evidence/playbook-results.jsonl`
- **Multi-prompt scenario files**: many scenario `.md` files contain >1 `### Prompt` block (e.g. `01--retrieval/001-unified-context-retrieval-memory-context.md` has 2 — basic `memory_context` + token-budget envelope contract). Row contract: **one row per scenario file**; `classification` = WORST outcome across blocks (any FAIL → FAIL; any PARTIAL with all-else PASS → PARTIAL; etc.); the `evidence` field captures sub-block per-prompt results so detail is preserved. Floor of ≥345 rows (per `spec.md` REQ-002) is the FILE count, not the prompt-block count.
- Categories with > 30 scenarios may need to be split into 2–3 batches (concretely: cat 16 has 55, cats 13/14-pipeline have 29/26)

Dispatch paired (2 categories concurrent) × ~13 batches.

**Phase 3 — z_archive-specific revalidation (30 min, main agent + cli-devin)**

For scenarios flagged PARTIAL due to z_archive count change:
- Re-run with z_archive-aware assertions
- Either reclassify as PASS (behavior is correct under new design) or FAIL (genuine regression)
- File follow-on packet 115 if any genuine regression

**Phase 4 — Synthesis + report (30 min, main agent)**

- Aggregate `evidence/tool-sweep.jsonl` + `evidence/playbook-results.jsonl`
- Author `implementation-summary.md` with: total PASS / FAIL / SKIP / UNAUTOMATABLE / PARTIAL counts + per-category breakdown + z_archive-impact section
- strict-validate 008 packet
- Memory save

### Decision points the new session needs to confirm

1. **Dispatch cadence**: paired (2x) vs sequential (1x). Recommend paired per packet 113 precedent. The user has not constrained.
2. **Stop-on-first-fail vs run-to-completion**: recommend run-to-completion. The point of a stress test is to surface the full failure landscape, not stop at the first regression.
3. **z_archive revalidation strategy**: reclassify-in-place vs separate revalidation pass. Recommend reclassify-in-place (single source of truth in the results TSV).
4. **Memory baseline checkpoint**: should we `checkpoint_create` before Phase 1 so we can `checkpoint_restore` cleanly after the sweep? Strongly recommended. Tools like `memory_bulk_delete` + `memory_ingest_cancel` will mutate state mid-sweep.

### Resources

| Resource | Path |
|----------|------|
| Tool schemas (TS source) | `.opencode/skills/system-spec-kit/mcp_server/lib/handlers/tool-schemas.ts` |
| Tool schemas (compiled) | `.opencode/skills/system-spec-kit/mcp_server/dist/tool-schemas.js` |
| Playbook root | `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` |
| cli-devin recipe v1.0.4.1 | `.opencode/skills/cli-devin/assets/agent-config-deep-research-iter.json` |
| cli-devin SKILL | `.opencode/skills/cli-devin/SKILL.md` |
| Packet 113 (z_archive un-exclusion) | `.opencode/specs/skilled-agent-orchestration/113-z-archive-memory-indexing/` |
| Packet 113 implementation-summary | `113-z-archive-memory-indexing/implementation-summary.md` |
| Packet 111 (dispatch pattern reference) | `.opencode/specs/skilled-agent-orchestration/111-026-cleanup-remediation/` |
| MCP servers config | `.claude/mcp.json` (symlinked from `.mcp.json` per commit 280fe4888) |
| Validate script | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <folder> --strict` |
<!-- /ANCHOR:next-session -->

---

<!-- ANCHOR:validation-checklist -->
## 4. Validation Checklist

Before declaring Phase 4 complete:

- [ ] Phase 0: baseline 5 checks all pass (z_archive=2618, total≥11201, decay=0.1, vitest 159/159, git ancestry confirmed)
- [ ] Phase 1: every one of 39 mk-spec-memory tools has a JSONL row in `evidence/tool-sweep.jsonl` with classification ∈ {PASS, FAIL, SKIP, UNAUTOMATABLE}
- [ ] Phase 2: every one of 345 playbook scenarios has a JSONL row in `evidence/playbook-results.jsonl`
- [ ] Phase 3: every scenario flagged PARTIAL due to z_archive has been reclassified to PASS or FAIL
- [ ] Phase 4: `implementation-summary.md` aggregates totals + per-category breakdown
- [ ] `validate.sh --strict` on 008 packet exits 0
- [ ] z_archive rows in DB still ≥ 2618 (no inadvertent purge)
- [ ] Decay multiplier 0.1 still returned by `getArchiveMultiplier()`
- [ ] Git log shows 008 commits on main (estimated 30–50 commits)
- [ ] Memory save run via `/memory:save` after Phase 4
<!-- /ANCHOR:validation-checklist -->

---

<!-- ANCHOR:session-notes -->
## 5. Session Notes

### Known sharp edges from packet 113

- **`devin -p` in non-interactive mode silently writes a TUI "Scrollback error: io error" stream when stdin/stdout aren't fully redirected.** Always pair with `</dev/null` and `> log 2>&1`. Packet 113 dispatcher proved this.
- **The agent-config Write scope is non-binding without `--sandbox` flag.** Use `--permission-mode dangerous` and trust the system_instructions guard (scope is documentation in this mode, not OS-enforced).
- **`npm test` runs the FULL suite** even when you pass specific filenames. Use `npx vitest run <file>` directly for targeted runs.
- **Scope-vs-decay confusion is the root design pattern this packet validates.** When a scenario fails because z_archive content is now present, the correct response is reclassify under the new SSOT rule, not roll back the fix.
- **Sequential_thinking MCP is not registered with devin** (it IS registered with Claude Code via `.mcp.json`). Devin recipes mandate it in `system_instructions` but the runtime cannot enforce it. Treat the mandate as prompt-level only.
- **`memory_bulk_delete` auto-creates a checkpoint.** A `checkpoint_create` before Phase 1 gives a clean rollback surface for the full sweep.
- **Some playbook scenarios reference deprecated handler names** (e.g., `memory-context-handler.ts` predates the current handler layout). Treat as STALE-DESCRIPTIVE — don't fail the scenario; instead note the doc drift for a follow-on packet.

### Hard rules

1. Stay on `main`. No feature branches (per memory note `feedback_stay_on_main_no_feature_branches`).
2. DELETE not archive (per memory note `feedback_delete_not_archive_or_comment`) — except DEEP-blast class which has a separate convention.
3. Per-row atomic commit for any mutation surfaced by a scenario (per packet 111/113 precedent).
4. cli-devin parallelism ceiling 2 concurrent (per memory note `feedback_cli_dispatch_unreliability`).
5. Worktree cleanliness is not a blocker (per memory note `feedback_worktree_cleanliness_not_a_blocker`).

### What the previous session shipped

| Commit | Content |
|--------|---------|
| `b062b12b4` | z_archive un-excluded from `EXCLUDED_FOR_MEMORY` + dist rebuild + reindex |
| `12302d853` | cli-devin 5-iter deep-research convergence + research.md + remediation TSV |
| `3909f8202` | BREAKING test fixes (4 assertions across 2 files; 159 tests pass) |
| `296e64b2d` | STALE-INVARIANT docs in `010-memory-indexer-invariants/` (5 files) |
| `aaf509797` | STALE-DESCRIPTIVE drift fixes (`doctor_update.yaml` + `memory-save.ts`) |
| `58e3f3646` | SSOT doc — "Index scope vs scoring decay" section in `lib/utils/README.md` |
| `956595dbd` | Cosmetic doc fixes for 113 strict-validate PASS |
| `280fe4888` | `.mcp.json` → `.claude/mcp.json` symlink for Claude Code MCP discovery |
<!-- /ANCHOR:session-notes -->
