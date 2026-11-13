---
title: "Implementation Summary: Phase 8: embedder-setup-and-cost"
description: "Built and verified on 2026-11-13. The advisor names why meaning matching is off, one doctor route plans the embedder setup behind a yes, /doctor:install and /doctor:setup carry it and the install guides quote a measured cost. All eleven acceptance criteria are Met."
trigger_phrases:
  - "embedder setup and cost implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost"
    last_updated_at: "2026-11-13T03:20:31Z"
    last_updated_by: "markdown-agent"
    recent_action: "Closed phase 8 with all eleven criteria Met"
    next_safe_action: "Rebuild the advisor dist once the other sessions' edits land, then rerun the default capture"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "acceptance-criteria.md"
      - "scratch/verification-evidence.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-008-embedder-setup-and-cost"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary: Phase 8: embedder-setup-and-cost

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-embedder-setup-and-cost |
| **Completed** | 2026-11-13. AC-001 to AC-011 are `Met` |
| **Commit** | `49281dd652` added the cost script. `c909693acb` (2026-11-13 04:08) landed the rest of this phase on `worktrees/352-command-surfacing-research` |
| **Level** | 2 |
| **Verified on** | The orchestrator ran the build checks on the working tree before `c909693acb`, between 02:20 and 04:07 the same night (`scratch/verification-evidence.txt`). The closure reran the local checks at about 04:08 to 04:20 over `c909693acb` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A user who installs Skilled into their own repository can now see whether meaning matching is on, set it up through one doctor route and read what it costs.

The prompt embedding in the semantic lane now gives up after `PROMPT_EMBEDDING_DEADLINE_MS`, set to 750 ms. The timer is cleared in a `finally` and a late rejection of the embed call is caught. A failed or late embedding sets its own `disabledReason`: `prompt_embedding_unreachable`, `prompt_embedding_model_missing`, `prompt_embedding_timeout` or `prompt_embedding_failed`. The reasons set before the embed stay as they were.

`advisor_status --include-semantic-health true` gained two fields. `backend` holds one bounded `/api/tags` probe of at most 500 ms, with `state` one of `reachable`, `unreachable`, `model_missing` or `probe_not_implemented`. `laneEnabled` is false unless the state is `reachable`. `commandVectorCoverage` counts the rows of `vec_cmd_<dim>` against the command entries that carry `embeddingText`.

A recommendation scored without a prompt vector carries `semantic_lane_off:<reason>` in its `warnings`. The hook brief is unchanged.

`/doctor:skill-advisor embedder` is a new route. It probes first and changes nothing. It prints one plan row per missing step with its cost and its undo, and it asks before it pulls the model or starts the server. It never installs Ollama and prints the install command instead. After the approved steps it runs `skill_graph_scan --trusted` and shows the status again. `--dry-run` stops after the plan with `STATUS=OK`. The route has an active command bridge like its siblings.

`/doctor:setup` has a sixth read-only leg, `embedder`. It passes when the lane is on with command vectors and otherwise reads DEGRADED with the repair `/doctor:skill-advisor embedder`, never FAIL. `/doctor:install` prints the route as step 5, before `/doctor:setup` as step 6.

`ADV/scripts/measure-embedder-cost.mjs` prints the embedder's cost as one JSON object and writes nothing. `INSTALL-SKILLED.md` gained the route row, a "Meaning Matching for Commands" section with the measured cost and its date and a `semantic_lane_off` troubleshooting row. The advisor `INSTALL-GUIDE.md` gained the default-behind-a-yes line, a setup and cost section and the sentence that `includeEmbeddingsHealth` probes hf-local only.

### Files Changed

`ADV` is `.skilled/skills/system-skill-advisor/runtime`. `DOC` is `.skilled/commands/doctor`.

| File | Action | Purpose |
|------|--------|---------|
| `ADV/scripts/measure-embedder-cost.mjs` | Created | The read-only cost script (commit `49281dd652`) |
| `ADV/scripts/README.md` | Modified | One entry for the script and its exit 2 |
| `ADV/lib/scorer/lanes/semantic-shadow.ts` | Modified | The 750 ms deadline and the named reasons |
| `ADV/schemas/advisor-tool-schemas.ts` | Modified | `backend` and `commandVectorCoverage` in the semantic lane health |
| `ADV/handlers/advisor-status.ts` | Modified | The backend probe and the command vector count |
| `ADV/lib/skill-graph/skill-graph-db.ts` | Modified | `readCommandEmbeddingSources` exported |
| `ADV/handlers/advisor-recommend.ts` | Modified | `semanticLaneOffWarning` and the warning in `outputWarnings` |
| `ADV/scripts/command-bridges/scoring-compatibility.json` | Modified | The route's activation entries |
| `ADV/scripts/command-bridges/command-bridges.generated.json`, `ADV/lib/command-attach.ts`, `ADV/lib/scorer/projection.ts`, `ADV/scripts/skill_advisor.py` | Modified (generated and compatibility) | The route's bridge row in each consumer |
| `ADV/tests/semantic-prompt-embedding-degrade.vitest.ts` | Created | Seven degrade rows |
| `ADV/tests/handlers/advisor-status.vitest.ts` | Modified | Coverage and backend cases |
| `DOC/assets/doctor-skill-advisor-embedder.yaml` | Created | The route workflow |
| `DOC/_routes.yaml`, `DOC/skill-advisor.md` | Modified | The route and its router row |
| `DOC/assets/doctor-skill-advisor-presentation.txt` | Modified | Probe, plan, approval, dry-run and result blocks, plus menu entry 5 |
| `DOC/assets/doctor-setup.yaml`, `DOC/assets/doctor-setup-presentation.txt`, `DOC/setup.md` | Modified | The sixth leg and the six-leg wording |
| `DOC/assets/doctor-install.yaml`, `DOC/assets/doctor-install-presentation.txt` | Modified | Step 5 and step 6 |
| `DOC/scripts/tests/skill-advisor-route-contract.test.cjs`, `DOC/scripts/tests/doctor-install-contract.test.cjs` | Modified | The route contract and the six install steps |
| `INSTALL-SKILLED.md`, `.skilled/skills/system-skill-advisor/INSTALL-GUIDE.md` | Modified | The dependency, its cost and its setup |
| `scratch/` | Created | `before.txt`, `cold-after-abort.txt`, `health-consumers.txt`, `cost-warm.json`, `cost-cold.json`, the six `hook-latency-*.json` files with `hook-latency.mjs` and its input `tune-rows.jsonl`, `real-embedding-after.json`, `setup-leg.txt`, `route-dry-run.txt`, `suite-after.txt`, the worker briefs and logs and `verification-evidence.txt`. The planning files `measured-2026-11-12.txt`, `embed-probe.mjs` and `cli-timing.cjs` back `spec.md` Measured Behavior |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrator ran wave 0 (T001 to T005) itself. DeepSeek v4.1 flash workers at max effort, dispatched through OpenCode Go, built the script in three steps (`scratch/briefs/e1-T006.txt` to `e3-T016.txt`) and the rest in waves 1 to 5, with a type check between waves. `scratch/briefs/` holds 28 briefs and `scratch/logs/` their output. The orchestrator ran T031 to T043 one at a time and wrote each result into `scratch/verification-evidence.txt`.

The orchestrator made three fixes after the waves, where no worker task covered the gap:

1. `route-validate.sh` failed three parity checks because `embedder` was missing from the skill-advisor presentation menu, its "Valid targets:" line and its subsystem manifest table. It was added as menu entry 5 and the two later entries became 6 and 7. After the fix the validator printed OK with 32 routes validated and 11 warnings.
2. `DOC/setup.md` and `doctor-setup-presentation.txt` still said five read-only legs. Both now say six.
3. The `INSTALL-SKILLED.md` cost table gained readable sizes beside the raw numbers.

The Python advisor test and the parity test passed after the route's compatibility entry was added to `skill_advisor.py`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The embedder setup is a normal `/doctor:install` step behind a yes | Operator answer of 2026-11-12, "Set up by default, behind a yes" |
| After a yes the route pulls the model and starts the server, never installs Ollama | Operator answer of 2026-11-12, "Pull and start, never install (Recommended)" |
| The off state shows in `/doctor:setup`, status and a JSON warning | Operator answer of 2026-11-12, "Doctor, status and JSON warning (Recommended)" |
| The prompt embedding deadline is 750 ms | Operator answer of 2026-11-12, "750 ms (Recommended)" |
| The deadline lives in the advisor's wrapper, not the shared adapter | Other consumers keep the adapter's 5,000 ms. `git diff --stat -- .skilled/skills/system-spec-kit/shared` printed nothing |
| An absent embedder reads DEGRADED in `/doctor:setup`, never FAIL | The operator chose "behind a yes" over "Required" |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Rows marked "orchestrator" quote `scratch/verification-evidence.txt`. Rows marked "closure" were rerun from the repository root on 2026-11-13 between about 04:08 and 04:20.

| Check | Result |
|-------|--------|
| Typecheck (orchestrator, T037. Closure rerun) | Exit 0 both times |
| Advisor `npm test` (orchestrator, T037) | 174 files passed, 1540 passed, 6 skipped, 0 failed (`scratch/suite-after.txt`) |
| Advisor `npm test` (closure) | Exit 1. 9 failed, 1527 passed, 10 skipped. All 9 failures print `@spec-kit/system-skill-advisor dist is stale`. Limitation 3 explains why |
| Degrade test (closure) | Exit 0, 1 file, 7 passed |
| Status test (closure) | Exit 0, 1 file, 27 passed |
| Cost script against an unreachable server (closure) | `ollama server not answering at http://127.0.0.1:9`, exit 2, `git status --short` unchanged |
| Default capture (orchestrator, T038) | Typed `{"correct":24,"total":44}`, tune combined 9 of 45, holdout combined 0 of 44, false offers `{"count":0,"total":35}` |
| Scorer floor and rollup (orchestrator, T038. Closure rerun) | `[159,50,20,5]` and `{"ask":17,"run":7,"start":20}` both times |
| Bridge freshness (closure) | `derive-command-bridges.cjs --check` printed `"status": "fresh"`, exit 0 |
| Real-embedding capture (orchestrator, T039) | Exit 0. Typed 24 of 44, tune combined 14 of 45 (own 7, attached 7), holdout combined 2 of 44, false offers 0 of 35 (`scratch/real-embedding-after.json`) |
| Phrase-reach probe (orchestrator, T039) | Exit 0, `STATUS=OK phrases=248 bridges=36` |
| Command vectors (orchestrator, T031. Closure rerun) | `select count(*) from vec_cmd_768` printed 46 and the bridge file holds 46 entries with `embeddingText` |
| Doctor suites (orchestrator, T040. Closure rerun) | `7 suite(s) passed, 0 failed`, exit 0. The first closure run failed one snapshot test, limitation 4 |
| Route contract and install contract tests (closure) | Exit 0 with 11 of 11 passed, and exit 0 with 16 of 16 passed |
| `route-validate.sh` (orchestrator, T040. Closure rerun) | Exit 0, OK with 32 routes validated and 11 warnings |
| Setup leg (orchestrator, T042) | `[true,"reachable",true]`, `commandVectorCoverage` 46 of 46, `vectorCoverage` 14 of 14, `disabledReason` null (`scratch/setup-leg.txt`) |
| Route dry run (orchestrator, T043) | Probe, `Missing: none`, `STATUS=OK`. `git status --short` and the database mtime identical before and after (`scratch/route-dry-run.txt`) |
| Install guide lines (closure) | `rg` printed 4 lines in `INSTALL-SKILLED.md`, 2 lines naming `skill-advisor embedder` in `INSTALL-GUIDE.md` and 1 `includeEmbeddingsHealth` line naming hf-local |
| Comment hygiene over the changed source and test files (closure) | Two hits, both older than this phase: a `specs/<packet>` comment in `skill-graph-db.ts` from `330427cf30` and a user-facing string in `doctor-install-contract.test.cjs` |

### Hook Timing

Three runs over the 44 tune prompts, `[n, median ms, p95 ms]`, from `scratch/hook-latency-*.json`.

| Arm | Run 1 | Run 2 | Run 3 | Middle median | Middle p95 |
|-----|-------|-------|-------|---------------|------------|
| Before | [44,199.25,243.85] | [44,167.93,210.56] | [44,172.47,210.74] | 172.47 | 210.74 |
| After | [44,210.33,248.7] | [44,166.44,210.02] | [44,175.74,202.53] | 175.74 | 210.02 |

The middle median grew by 3.27 ms against a bound of 25 ms. The middle p95 fell by 0.72 ms against a bound of 40 ms over. The after arm ran with a load average of about 2.9.

### Measured Cost

Taken on 2026-11-13 with Ollama 0.40.15 by `measure-embedder-cost.mjs`, warm in `scratch/cost-warm.json` and cold in `scratch/cost-cold.json`.

| Measure | Value | Source |
|---------|-------|--------|
| Model on disk | 274302450 bytes | both files |
| Loaded size reported by Ollama | 335733063 bytes | warm |
| `ollama serve` resident, model loaded | 32208 KB | warm |
| Model runner resident | 279520 KB | warm |
| `ollama serve` resident, idle | 25776 KB | cold |
| Warm embedding, 30 calls | 4.8 ms median, 8.9 ms p95 | warm |
| Warm embedding in the cold run, 30 calls | 7.05 ms median, 12.17 ms p95 | cold |
| Cold first call | 538.53 ms | cold |
| Advisor CLI, 5 calls | 128.26 ms median (warm run), 132.08 ms median (cold run) | both files |

`scratch/cold-after-abort.txt` shows that after a 50 ms client abort on a cold model `/api/ps` listed no model 3 s later, so Ollama did not keep loading the model once the client gave up.
<!-- /ANCHOR:verification -->

---

## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| The route's presentation contract gains five embedder blocks | It also gained menu entry 5, its help row and its manifest row, and the later entries moved to 6 and 7 | `route-validate.sh` checks those three places for every target |
| `doctor-setup.yaml` alone changes "five read-only legs" to six | `DOC/setup.md` and `doctor-setup-presentation.txt` also changed | Both still said five after the waves |
| The bridge activation touches `scoring-compatibility.json` and the files `derive-command-bridges.cjs` regenerates | `skill_advisor.py` also gained the route's entry | The Python advisor test and the parity test needed it |
| The T043 dry run shows plan rows with a cost and an undo | The plan table had no rows | Nothing was missing on this machine. The route contract test covers the plan rows |
| Worker dispatch through Pi | DeepSeek workers ran through OpenCode Go | Delivery route set by the orchestrator, as in phase 006 |

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The dry run proved the empty plan only.** Nothing was missing on the build machine, so `scratch/route-dry-run.txt` shows `Missing: none` and no plan rows. The rows with a cost and an undo per step rest on the route contract test.
2. **The cost is one machine on one day.** Every number in the cost table and in both install guides comes from two runs on this Mac on 2026-11-13. The 5 minute unload in the guides is Ollama's default keep-alive and not a number the script measured. Another machine will differ.
3. **The closure could not rerun the default capture, the phrase-reach probe or a clean advisor suite.** The phase 011 workers edited `ADV/lib/command-attach.ts` at 04:13 and `ADV/schemas/advisor-tool-schemas.ts` at 04:11 (a `hookHealth` field), after this phase's code was built, verified and committed as `c909693acb`. The advisor's stale-dist guard then made the capture and the probe exit 2 and failed 9 suite tests, each with the same stale-dist message. This phase may not run a build outside its folder, so those three rows rest on the orchestrator's runs. A rebuild after the other edits land and one rerun of the default capture would confirm them on the current tree.
4. **One doctor snapshot test is sensitive to concurrent writes.** The first closure run of `run-all.sh` failed `sk-code-quality-config.test.cjs` because advisor dist-freshness files appeared in the repository during the run. The file passed alone (20 of 20) and the second full run printed `7 suite(s) passed, 0 failed`.
5. **The status probe covers Ollama only.** A non-Ollama backend reports `probe_not_implemented`.
6. **A fresh install needs a daemon restart.** The daemon picks the embedder at start, so after a first setup the route names a restart when `activeEmbedder` is null.
<!-- /ANCHOR:limitations -->

---
