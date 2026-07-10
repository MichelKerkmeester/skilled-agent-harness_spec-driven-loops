---
title: "Session Handover: 001-implement-initial-doctor-command-set [system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/001-implement-initial-doctor-command-set/handover]"
description: "Handover for the /doctor:update v3.3 hardening work. 13 fixes shipped across 2 council rounds + 2 patches. R1 live-verified end-to-end (16-min runtime, final_status: ok). R2 Phase 8 sub-actions live-verified but Phase 5/7/10 truncated by opencode 96K session budget. Next agent picks up at: full E2E re-verification with patches in place + addressing Track E pre-existing TEMPLATE_HEADERS/ANCHORS_VALID drift."
trigger_phrases:
  - "001-implement-initial-doctor-command-set handover"
  - "/doctor:update v3.3 hardening handover"
  - "doctor update orchestrator outstanding work"
  - "council R1 R2 handover"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/006-operator-tooling/002-doctor-update-orchestrator"
    last_updated_at: "2026-05-09T20:40:00Z"
    last_updated_by: "spec-kit-handover"
    recent_action: "Authored handover for outstanding /doctor:update v3.3 hardening verification work"
    next_safe_action: "Run full E2E /doctor:update against fresh v3-3 workspace to verify all 13 fixes"
    blockers:
      - "Phase 5+7+10 of E2E verification truncated by opencode session budget (96K cap)"
    key_files:
      - ".opencode/commands/doctor/update.md"
      - ".opencode/commands/doctor/assets/doctor_update.yaml"
      - ".opencode/skills/system-spec-kit/mcp_server/database/migration-manifest.json"
      - "ai-council/council-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-kit-handover-001-implement-initial-doctor-command-set-2026-05-09"
      parent_session_id: null
    completion_pct: 99
    open_questions: []
    answered_questions:
      - "Council R1 + R2 + patches shipped (13 fixes total)"
      - "R1 live-verified at 16-min runtime; R2 Phase 8 verified, Phase 5+ truncated"
---
# Session Handover: 001-implement-initial-doctor-command-set

<!-- SPECKIT_TEMPLATE_SOURCE: handover | v1.0 -->

---

<!-- ANCHOR:handover-summary -->
## 1. Handover Summary

- **From Session:** 2026-05-09 (multi-hour Claude Opus 4.7 session)
- **To Session:** next agent picking up `/doctor:update` v3.3 verification work
- **Phase Completed:** Council R1 (7 fixes) + Council R2 (4 fixes) + live-test patches (2 fixes); R1 live-verified end-to-end; R2 Phase 8 sub-actions live-verified
- **Phase NOT Completed:** Full E2E verification with R2 + patches in place (Phase 5/7/10 truncated by opencode 96K session budget); Track E pre-existing packet doc drift
- **Handover Time:** 2026-05-09T20:40:00Z
- **Branch:** main (no feature branches per memory rule)
<!-- /ANCHOR:handover-summary -->

---

<!-- ANCHOR:context-transfer -->
## 2. Context Transfer

### 2.1 Key Decisions Made

| Decision | Rationale | Impact |
|----------|-----------|--------|
| Convene multi-ai-council via cli-opencode + DeepSeek v4 pro for 7 issues identified during live test | Cross-AI lens (Analytical / Critical / Pragmatic) on migration-flow gaps | 88% confidence verdict; 7 fixes prescribed; 10 artifacts persisted at `ai-council/` |
| Implement R1 fixes via single cli-codex dispatch (gpt-5.5 high fast) | User-stated preference for cli-codex grunt work; mechanical YAML/JSON edits | All 7 R1 fixes shipped + structurally validated in one dispatch |
| Round 2 triggered by user observation that v3.3 release ships REAL spec content | Council R1 missed Issue 11 (v3.3 specs invisible to v3.4 indexer due to missing description.json + graph-metadata.json) | 4 additional fixes (FIX-07..10) addressing spec metadata backfill gap |
| Use sanctioned backfill scripts (generate-description.js + backfill-graph-metadata.js) inside Phase 8 rather than expanding mutation_boundaries | Preserves orchestrator's "no direct edits to spec metadata" boundary; delegates to maintained tooling per migration-manifest M-3.3.0.0-002 fallback_operation | FIX-08 implemented as Phase 8 sub-action; orchestrator never edits description.json/graph-metadata.json directly |
| Patch FIX-12 (signal_d head -1) + FIX-13 (--active-only) directly via Edit (not cli-codex) | 1-2 line targeted patches; cli-codex dispatch overhead exceeded the work | Patches shipped + yaml.safe_load PASS + strict validate baseline maintained |

### 2.2 Blockers Encountered

| Blocker | Status | Resolution/Workaround |
|---------|--------|-----------------------|
| Codex sandbox blocked outbound TCP for Voyage embeddings | resolved | Pass `-c sandbox_workspace_write.network_access=true` (now in memory) |
| Generate-context.js positional path quirk (rejected `.opencode/specs/...` arg) | resolved | Use `--json` inline form + spec folder positional |
| OLD orchestrator dispatch ran 10,358s (2h 53m) with multiple manual workarounds | resolved by R1 | Phase 1.5 build preflight + symlink bridge + file-signal detection bring NEW runtime to 960s (10.8x speedup) |
| Issue 8 from OLD run (skill-graph/advisor/deep-loop tools "not implemented") | resolved | Was secondary effect of unbuilt mcp_server; Phase 1.5 build resolved all 3 tool-availability issues |
| Issue 9 (tree-sitter WASM missing) | did not manifest in R1 verify | Different build path produced different WASM resolution; track but not blocking |
| Issue 11 (v3.3 specs invisible to v3.4 indexer) | resolved by R2 | Phase 8 spec_metadata_backfill auto-runs sanctioned scripts |
| Issue 12 (FIX-07 signal_d only checked first folder) | patched | Removed `head -1` from check; iterates all spec folders until first missing |
| Issue 13 (backfill-graph-metadata.js crashes on z_archive paths) | patched | Added `--active-only` flag |
| Phase 5/7/10 truncated by opencode 96K session budget on R2 verification | open | Re-run with split dispatch OR raise opencode session budget OR use a different model with larger context |
| Pre-existing TEMPLATE_HEADERS + ANCHORS_VALID drift in 001 packet docs | open (Track E) | Same template-manifest pattern across sibling packets; can be fixed via cli-codex with 010/003 canonical reference |

### 2.3 Files Modified (this session, cumulative)

| File / path | Change Summary | Status |
|-------------|---------------|--------|
| `.opencode/commands/doctor/assets/doctor_update.yaml` | +200 lines: Phase 1.5 (FIX-01), Phase 8 sub-actions (FIX-02/03/04/07/08/09), Phase 3 hook (FIX-05), Phase 5.5 (FIX-06), Phase 5.2 reporting (FIX-10), Phase 4 dashboard column. Patched FIX-12 + FIX-13. | committed in `ddb4e2520` (R1+R2) + new patches uncommitted |
| `.opencode/commands/doctor/update.md` | +6 lines: WORKFLOW PHASES rows for Phase 1.5 and 5.5; INSTRUCTIONS step 5 expanded with Phase 8 sub-actions | committed in `ddb4e2520` |
| `.opencode/skills/system-spec-kit/mcp_server/database/migration-manifest.json` | +77 lines: M-3.3.0.0-004 + M-3.3.0.0-005 added; deprecated_files entry for `.opencode/skill/`; M-001 + M-002 status flipped from DEFERRED to "auto-run by Phase 8"; consumed_by metadata updated; last_updated bumped | committed in `ddb4e2520` |
| `001-implement-initial-doctor-command-set/implementation-summary.md` | continuity reflects R1+R2+patches state at 1226 bytes (under 2048 limit), packet_pointer corrected (013 → 013/001-implement-initial-doctor-command-set) | committed in `ddb4e2520` (continuity v1) + uncommitted (continuity v2 mentioning patches) |
| `001-implement-initial-doctor-command-set/description.json` + `graph-metadata.json` | Auto-refreshed by generate-context.js | committed in `ddb4e2520` |
| `001-implement-initial-doctor-command-set/ai-council/` | 10 council artifacts: config, state, strategy, 3 seats, deliberation, critique, council-report.md | committed in `ddb4e2520` |
| `001-implement-initial-doctor-command-set/handover.md` | THIS DOCUMENT | uncommitted |
<!-- /ANCHOR:context-transfer -->

---

<!-- ANCHOR:next-session -->
## 3. For Next Session

### 3.1 Recommended Starting Point

- **Read first:**
  - `001-implement-initial-doctor-command-set/ai-council/council-report.md` (full Round 1 deliberation, FIX-00..06 specs, 88% confidence verdict)
  - `001-implement-initial-doctor-command-set/implementation-summary.md` (continuity surface; reflects current state)
  - `.opencode/commands/doctor/assets/doctor_update.yaml` (the orchestrator workflow with all 13 fixes)
  - This file (`handover.md`) for the open-work state

### 3.2 Priority Tasks Remaining

1. **HIGHEST: Full E2E re-verification of all 13 fixes** with FIX-12 + FIX-13 patches in place. The R2 verification (`bz54tsa5q`) reached Phase 8 successfully but truncated mid-Phase-5 at opencode's 96K session budget. Setup steps:
   ```bash
   rm -rf /tmp/sk_v3_3_fresh && mkdir -p /tmp/sk_v3_3_fresh
   ARCHIVE=.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/002-sandbox-testing-playbook/external/opencode--spec-kit-skilled-agent-orchestration-3.3.0.1.tar.gz
   tar -xzf "$ARCHIVE" --strip-components=1 -C /tmp/sk_v3_3_fresh
   rsync -a --exclude='specs' --exclude='node_modules' --exclude='dist' \
     --exclude='*.sqlite' --exclude='*.sqlite-shm' --exclude='*.sqlite-wal' \
     --exclude='*.db' --exclude='*.db-shm' --exclude='*.db-wal' \
     --exclude='.doctor-update.*' --exclude='.cocoindex_code' \
     .opencode/ /tmp/sk_v3_3_fresh/.opencode/
   ```
   Then dispatch:
   ```bash
   PROMPT="$(cat /tmp/doctor-update-prompt.md)"
   opencode run "$PROMPT" --model opencode-go/deepseek-v4-pro \
     --agent general --variant high --format json --dir /tmp/sk_v3_3_fresh \
     </dev/null > /tmp/opencode-doctor-update-v4.log 2>&1
   ```
   Expected behavior with patches: signal_d should now fire (4-of-4 signals), backfill-graph-metadata.js should NOT crash, Phase 5/7/10 should complete IF the dispatch fits within session budget. If it truncates again, split into two dispatches: (a) Phases 1-8 only, (b) `--continue` to resume Phase 5+.

2. **Track E pre-existing drift:** TEMPLATE_HEADERS (21 issues) + ANCHORS_VALID (22 issues) in 001 packet docs. Same template-manifest pattern as 002 + 003 packets had. Use 010/003 canonical packet as reference; cli-codex high-effort + iterative validation. Spec folder is pre-approved.

3. **Optional R3 council on residual caveats** (5 items from R1 verify caveats):
   - `@types/better-sqlite3` missing from package.json devDependencies (1-line fix)
   - CLI vs MCP server DB path resolution mismatch (`MEMORY_DB_PATH`)
   - V-rule warnings about scripts package (need scripts package built in Phase 1.5 too)
   - Some spec-folders have legacy/invalid graph-metadata.json (non-blocking but suppresses indexing)
   - Advisor 3 failing skills at 50% accuracy (calibration, expected to improve)

4. **Optional release decision:** ship the 13 fixes as v3.4.2.0 OR hold for full E2E re-verification first. The R1 fixes are live-proven; R2 + patches are structurally validated only.

### 3.3 Critical Context to Load

- [ ] Memory: most-recent /memory:save was on 001-implement-initial-doctor-command-set; previous on 002-sandbox-testing-playbook
- [ ] Spec packet: `001-implement-initial-doctor-command-set` (Level 2, REQ-001..REQ-023, ADR-001..ADR-009)
- [ ] Council artifacts: `001-implement-initial-doctor-command-set/ai-council/council-report.md` (88% confidence verdict, 7 fixes)
- [ ] Sibling packet: `002-sandbox-testing-playbook` (handover at `002-sandbox-testing-playbook/handover.md`)
- [ ] Phase parent: `010-doctor-update-orchestrator` (lean trio)
- [ ] Memory rules in CLAUDE.md: "Stay on main, no feature branches" + "DELETE not archive" + "cli-codex preferred for grunt work" + "codex sandbox blocks sub-process network — pass `-c sandbox_workspace_write.network_access=true`"
- [ ] R3 user preference (this session): use multi-ai-council pattern via cli-opencode + DeepSeek v4 pro for cross-AI lens on complex multi-issue debugging
<!-- /ANCHOR:next-session -->

---

<!-- ANCHOR:validation-checklist -->
## 4. Validation Checklist

- [x] All in-progress work in working tree (FIX-12 + FIX-13 patches uncommitted, will be in this commit)
- [x] Current context saved via `_memory.continuity` frontmatter blocks (1226 bytes, under 2048 limit)
- [x] Memory save run on 001-implement-initial-doctor-command-set at handover time
- [x] No breaking changes mid-implementation (all yaml.safe_load + jq validations PASS)
- [ ] Tests passing — N/A; the live E2E verification is the test, and Phase 5/7/10 didn't complete (this is the open work)
- [x] yaml.safe_load `doctor_update.yaml` PASSES
- [x] jq validate `migration-manifest.json` PASSES
- [x] strict packet validate baseline maintained (2 pre-existing errors only, 0 warnings, no NEW issues)
- [x] R1 fixes live-verified: 16-min runtime, final_status: ok, all 7 dependency subsystems initialized
- [ ] R2 + patches NOT YET live-verified end-to-end (Phase 8 sub-actions verified; Phase 5+ truncated)
- [x] Branch is `main`
- [x] This handover document complete
<!-- /ANCHOR:validation-checklist -->

---

<!-- ANCHOR:session-notes -->
## 5. Session Notes

### What worked well
- **Multi-ai-council pattern via cli-opencode + DeepSeek v4 pro** delivered 88% confidence verdict in ~6 min with 3 distinct strategy lenses (Analytical / Critical / Pragmatic). Adversarial cross-critique upgraded Pragmatic's P1 classifications of Issues 2/3 to P0 with explicit reasoning.
- **cli-codex single-dispatch for grunt work** (R1 + R2 implementations): each shipped 7 / 4 fixes in one foreground run with self-validation. Faster than dispatching multiple parallel codex jobs (which the memory caveats about parallelism warn against).
- **Live-test discovery loop** caught Issues 8/9 (R1 testing) and Issue 11 (user-spotted) and Issues 12/13 (R2 testing) that pure analysis missed. The dispatched orchestrator ITSELF was the most rigorous testing tool.
- **Phase 8 mutation_boundary_exception** pattern (FIX-08): orchestrator delegates to sanctioned scripts rather than expanding allowed_targets — preserves the "orchestrator never edits spec metadata directly" invariant while still backfilling.

### What didn't work / surprises
- **opencode session budget cap at ~96K tokens** truncated R2 verification mid-Phase-5. Workarounds: split dispatch into 2 sessions, use `--continue`, or use a different model with larger context.
- **R2 council Round 1 missed Issue 11** (v3.3 spec metadata gap). The council reviewed the YAML/markdown but didn't simulate what Phase 5.2 would actually try to index. User observation surfaced it.
- **FIX-07 signal_d initial design used `head -1`** which silently broke detection when first folder happened to have description.json. Live test caught it; FIX-12 patched. **Lesson:** any "exists at all" detection should be "find ALL OR find ONE then short-circuit", never "check FIRST only".
- **backfill-graph-metadata.js crashes on z_archive paths** because path-validator rejects paths under archive trees. FIX-13 added `--active-only` flag (which the script already supported). **Lesson:** always check script CLI flags before integrating; don't assume default behavior is what you want.
- **Parallel-session commit conflict was non-issue:** another session committed our R1+R2 work as `ddb4e2520` while we were patching FIX-12/13. Git merged cleanly because the patches were on different lines. Memory rule "Worktree cleanliness is never a blocker" held.

### What's untested
- **Full E2E with R2 + patches:** Phase 5/7/10 closure with all 13 fixes in place. The R1 baseline was 16-min runtime with `final_status: ok`; expect R2+patches run to be similar or slightly longer (more work in Phase 8 backfill). If still truncates, opencode session budget needs adjustment.
- **The 5 residual caveats** from R1 verify (types-dep, CLI/MCP path resolution, V-rule scripts package, legacy graph-metadata, advisor calibration) — none are blocking but all are noise.

### What's next
- Run the verification (Track 1 above) OR
- Address Track E pre-existing drift OR
- Convene R3 council on residual caveats OR
- Ship as v3.4.2.0 release pending verification

### 2026-05-10 Codex follow-up

- **Patched source fixes from verification:**
  - `.opencode/skills/system-spec-kit/package-lock.json` now records `@types/better-sqlite3` for the MCP server workspace; the ignored local `mcp_server/package.json` was updated for overlay-test parity; local `npm run build --workspace=@spec-kit/mcp-server` passes.
  - `.opencode/commands/doctor/assets/doctor_update.yaml` Phase 1.5 now builds both `@spec-kit/mcp-server` and `@spec-kit/scripts`, so Phase 8 `scripts/dist/...` backfill entrypoints exist after the preflight.
- **Live-confirmed during `/tmp/sk_v3_3_fresh` verification:**
  - FIX-12 signal_d check fired correctly (`SIGNAL_D_POSITIVE`) across all spec folders.
  - FIX-13 `backfill-graph-metadata --active-only` avoided the archive-path crash and created 232 graph metadata files in the fresh workspace.
  - Description backfill created 59 missing `description.json` files with 0 failures.
  - Legacy memory detection found 92 report-only `memory/*.md` files.
- **Remaining blocker narrowed:** a truly fresh `opencode run` starts before Phase 1.5 can build `dist/context-server.js` or bridge `.opencode/skill -> .opencode/skills`, so the full `spec_kit_memory` MCP tool surface is not registered in that process. A stricter run failed fast with required tools unavailable; a prebootstrapped split run hung at `step_start` during startup/tool registration. Next pass should either implement an in-command restart/re-entry contract after Phase 1.5/Phase 8 bootstrap, or provide a non-MCP Phase 5 executor path that is part of the maintained command surface rather than ad hoc test harness code.

### 2026-05-10 Codex root-cause fix

- **Council perspective requested by user:** multi-ai-council agreed the bug is architectural startup ordering, not a metadata backfill failure. OpenCode registers MCP tools only at process startup, so a command phase that builds `dist/context-server.js` is too late to make missing tools appear in the current process.
- **Primary fix implemented:** `.mcp.json` and `opencode.json` now route `spec_kit_memory` through `.opencode/bin/spec-kit-memory-launcher.cjs` instead of directly through `.opencode/skills/system-spec-kit/mcp_server/dist/context-server.js`.
- **Launcher behavior:** the launcher resolves `.opencode/skill` vs `.opencode/skills`, creates the compatibility symlink when needed, builds `@spec-kit/mcp-server` and `@spec-kit/scripts` if generated runtime files are missing, writes `.spec-kit-memory-launcher.json`, then starts the real MCP server without writing stray stdout before MCP traffic.
- **Command safety fix implemented:** `/doctor:update` now has a Phase 0 non-MCP bootstrap/re-entry contract, a `--resume-bootstrap` flag, `restart_required` state, and a maintained shell preflight at `.opencode/commands/doctor/scripts/doctor-runtime-bootstrap.sh`.
- **Migration manifest updated:** M-3.3.0.0-004 now points operators at the launcher + bootstrap script + fresh OpenCode restart path instead of the old inline Phase 1.5/Phase 8 split.
- **Verification added:** disposable fresh fixture without `node_modules` or `dist` passed bootstrap, created `.opencode/skill -> skills`, built MCP and scripts dist, and wrote `restart_required=true`. Launcher smoke test produced no stdout before MCP server takeover. JSON/YAML syntax, workspace builds, alignment-drift, and parent spec strict validation pass.

### 2026-05-10 Scenario verification pass

- **Scenario inventory covered:** BOOT fresh-start MCP launcher/startup plus manual playbook scenarios DOC-338, DOC-339, DOC-340, DOC-341, DOC-342, DOC-344, DOC-345, DOC-346, and DOC-347 from `.opencode/skills/system-spec-kit/manual_testing_playbook/23--doctor-commands`.
- **Contract matrix result:** 17/17 PASS across startup config, bootstrap/restart contract, failure injection, rollback/retry, concurrent refusal, SIGINT restore/exit-130 contract, migration gap refusal, dashboard rows for all 8 subsystems, tier-aware prompt docs, 3.3.0.0 two-hop migration, legacy-file preservation, cleanup prompt behavior, current-version no-op, state schema, and all six update flags.
- **Gap found and fixed:** DOC-338 referenced `SPECKIT_FAIL_STEP=causal-edges-init`, but `doctor_update.yaml` did not explicitly define that test hook. Added a disposable-workspace-only `test_failure_injection` contract and documented it in `/doctor:update`.
- **Bootstrap fixture result:** `/tmp/sk_bootstrap_full_matrix` with no `node_modules`/`dist` passed `doctor-runtime-bootstrap.sh --json`, created `.opencode/skill -> skills`, built MCP/scripts dist, stayed pure JSON on stdout, and passed a second idempotent run with `restart_required=false`.
- **Launcher smoke result:** `.opencode/bin/spec-kit-memory-launcher.cjs` started cleanly with no stray stdout before MCP traffic.
- **Fresh OpenCode MCP visibility result:** a true fresh `opencode run` in `/tmp/sk_oc_tool_visibility` successfully called `spec_kit_memory_session_health` and returned `STATUS=PASS`.
- **Full v3.3-style E2E result:** `/tmp/sk_doctor_update_full_e2e` exited 0 with `STATUS=OK`; `.doctor-update.last-run.json` had `final_status=ok`, `duration_seconds=648`, all seven dependency steps recorded, PID/flock locks released, and pre/post snapshot artifacts present.
- **E2E observations:** Phase 0 bootstrap found the launcher-ready runtime; Phase 4 rendered all 8 dashboard subsystems; Phase 5 used real MCP tools and recovered after one `code_graph_scan` timeout; Phase 7 validation ran memory, causal, skill-graph, advisor, and CocoIndex health checks; Phase 10 wrote state and released locks.
- **Remaining honest caveat:** live full E2E validates the normal migration path. Destructive/manual edge behaviors such as actual keyboard SIGINT and a second simultaneous OpenCode process are contract-tested in the matrix, not physically triggered as interactive operator tests in this pass.

### Memory rules used / honored this session
- "DELETE not archive": no .bak/.archive/_old created
- "Stay on main, no feature branches": branch stayed on `main` throughout
- "Stop over-confirming": minimized clarification rounds; AskUserQuestion only for genuinely ambiguous scope decisions
- "Codex CLI fast mode must be explicit": all `codex exec` calls passed `-c service_tier="fast"`
- "codex sandbox blocks sub-process network": added `-c sandbox_workspace_write.network_access=true` for Voyage embeddings (NEW memory rule from earlier this session)
- "cli-codex preferred for grunt work on continuity-anchor tasks": used cli-codex for sync + generate-context.js + validate; direct main-agent for MCP visibility checks (NEW memory rule earlier this session)
- "Use a specific CLI executor only when explicitly requested": user said cli-codex + cli-opencode + multi-ai-council; honored verbatim throughout
- "Compact frontmatter rule": ≤96 chars, no narrative words (no 2+ periods), verb-prefix on next_safe_action
<!-- /ANCHOR:session-notes -->

---

## 6. Quick Resume Commands

```bash
# 1. Verify current state
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
git log --oneline -3                                                                 # confirm ddb4e2520 + FIX-12/13 patch commit landed
python3 -c "import yaml; yaml.safe_load(open('.opencode/commands/doctor/assets/doctor_update.yaml')); print('YAML OK')"
jq '.' .opencode/skills/system-spec-kit/mcp_server/database/migration-manifest.json > /dev/null && echo "JSON OK"

# 2. Re-validate the packet (expect: exit 2 with TEMPLATE_HEADERS + ANCHORS_VALID baseline only)
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/001-implement-initial-doctor-command-set --strict

# 3. Set up fresh v3.3 verification workspace (all signals primed to fire)
rm -rf /tmp/sk_v3_3_fresh && mkdir -p /tmp/sk_v3_3_fresh
ARCHIVE=.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/002-sandbox-testing-playbook/external/opencode--spec-kit-skilled-agent-orchestration-3.3.0.1.tar.gz
tar -xzf "$ARCHIVE" --strip-components=1 -C /tmp/sk_v3_3_fresh
rsync -a --exclude='specs' --exclude='node_modules' --exclude='dist' \
  --exclude='*.sqlite' --exclude='*.sqlite-shm' --exclude='*.sqlite-wal' \
  --exclude='*.db' --exclude='*.db-shm' --exclude='*.db-wal' \
  --exclude='.doctor-update.*' --exclude='.cocoindex_code' \
  .opencode/ /tmp/sk_v3_3_fresh/.opencode/

# 4. Dispatch verification (target: Phase 5/7/10 closure with all 13 fixes)
PROMPT="$(cat /tmp/doctor-update-prompt.md)"
opencode run "$PROMPT" --model opencode-go/deepseek-v4-pro \
  --agent general --variant high --format json --dir /tmp/sk_v3_3_fresh \
  </dev/null > /tmp/opencode-doctor-update-v4.log 2>&1 &

# 5. After completion, check final state
jq '.final_status, .duration_seconds' /tmp/sk_v3_3_fresh/.opencode/skills/system-spec-kit/mcp_server/database/.doctor-update.last-run.json
```
