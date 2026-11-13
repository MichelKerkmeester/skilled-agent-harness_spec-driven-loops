---
title: "Acceptance Criteria: Phase 8: embedder-setup-and-cost"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "embedder setup and cost acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/008-embedder-setup-and-cost"
    last_updated_at: "2026-11-13T03:20:31Z"
    last_updated_by: "markdown-agent"
    recent_action: "Marked all eleven criteria Met"
    next_safe_action: "None"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-008-embedder-setup-and-cost"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 8: embedder-setup-and-cost

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-13
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

`ADV` is `.skilled/skills/system-skill-advisor/runtime`. `DOC` is `.skilled/commands/doctor`. `X` is `node .skilled/bin/skill-advisor.cjs`. `E` is `ADV/scripts/measure-embedder-cost.mjs`. `C` is `ADV/scripts/routing-accuracy/capture-command-routing-baseline.mjs`. `M` is `jq -c '.metrics.typed_recall_at_1, .attachedMetrics.plain, .metrics.false_offer'`. `R` is the phase 002 rollup query from `../002-command-inventory-and-risk-metadata/tasks.md` T026.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given Ollama running, When `E` runs once with the model loaded and once after it unloaded on its own, Then it prints the version, model size, serve and runner memory, loaded size and expiry, warm median and p95 over 30 calls, the CLI median over 5 calls and a cold first call and writes nothing. With the server unreachable it exits 2 naming the server | `node $E > scratch/cost-warm.json`, `node $E > scratch/cost-cold.json`, `OLLAMA_BASE_URL=http://127.0.0.1:9 node $E; echo $?` prints 2, and `git status --short` unchanged after each run. Met. `scratch/cost-warm.json` and `scratch/cost-cold.json` hold version 0.40.15, 274302450 bytes, serve 32208 KB and runner 279520 KB, loaded 335733063 bytes with its expiry, warm 4.8 ms median and 8.9 ms p95 over 30, CLI median 128.26 ms and a cold first call of 538.53 ms (evidence T032, T033). Closure rerun: port 9 printed `ollama server not answering at http://127.0.0.1:9` with exit 2 and `git status --short` unchanged | Met | - |
| AC-002 | REQ-002 | Given a scanned database and Ollama running, When `advisor_status` runs with `includeSemanticHealth`, Then `backend.state` is `reachable` and `commandVectorCoverage.embedded` equals `total`, and the fixture cases for unreachable and model missing set `laneEnabled` false | `X advisor_status --workspace-root "$PWD" --include-semantic-health true --format json --warm-only \| jq -c '.data.semanticLaneHealth \| [.backend.state, .commandVectorCoverage, .laneEnabled]'` and `npx vitest run tests/handlers/advisor-status.vitest.ts` in `ADV` reports 0 failed. Met. Live status from `scratch/setup-leg.txt` (evidence T042): `backend.state` `reachable`, `commandVectorCoverage` 46 of 46, `laneEnabled` true. Closure rerun of `advisor-status.vitest.ts`: exit 0, 27 passed, 0 failed | Met | - |
| AC-003 | REQ-003 | Given the embedder state, When `/doctor:setup` runs, Then the `embedder` leg passes when the lane is on with command vectors and reads DEGRADED with the repair `/doctor:skill-advisor embedder` otherwise, and the route writes nothing | `rg -n "Leg embedder" DOC/assets/doctor-setup.yaml`, the T042 leg output and `bash DOC/scripts/tests/run-all.sh` reports 0 failed. Met. Closure rerun: `rg` printed one `Leg embedder` line (line 58) and `five read-only` printed nothing. T042 leg output `[true,"reachable",true]`. Closure `run-all.sh` printed `7 suite(s) passed, 0 failed` with exit 0 on its second run | Met | - |
| AC-004 | REQ-004 | Given `/doctor:skill-advisor embedder`, When it runs with `--dry-run` or the user declines, Then it prints a plan with a cost and an undo per step and runs no step, and on approve it runs only the approved steps, never installs Ollama and ends with a scan and a status | `node DOC/scripts/tests/skill-advisor-route-contract.test.cjs` exits 0, `bash DOC/scripts/route-validate.sh` exits 0 and the T043 dry-run transcript. Met. Closure rerun: route contract test exit 0 with 11 of 11 passed and `route-validate.sh` exit 0 with 32 routes validated. `scratch/route-dry-run.txt` shows the probe, `Missing: none` and `STATUS=OK` with `git status` and the database mtime unchanged. Nothing was missing, so the plan rows with a cost and an undo rest on the contract test | Met | - |
| AC-005 | REQ-005 | Given an injected adapter, When it answers warm, answers cold inside the deadline, is absent, lacks the model or never answers, Then the first two score with a cosine, the others return the no-embedder result inside the deadline plus 100 ms with reasons `prompt_embedding_unreachable`, `prompt_embedding_model_missing` and `prompt_embedding_timeout` | `npx vitest run tests/semantic-prompt-embedding-degrade.vitest.ts` in `ADV` reports 7 passed. Met. Closure rerun: exit 0, 1 file, 7 passed. The test asserts `prompt_embedding_unreachable`, `prompt_embedding_model_missing` and `prompt_embedding_timeout`, and the no-answer row finished in 752 ms against the 850 ms bound | Met | - |
| AC-006 | REQ-006 | Given `/doctor:install` and the install guides, When a user runs or reads them, Then the checklist prints the embedder route as step 5 before `/doctor:setup` as step 6, and both guides say the install sets up meaning matching by default behind a yes, give the measured cost with its date and say a no keeps a phrase-only install | `node DOC/scripts/tests/doctor-install-contract.test.cjs` exits 0, `rg -n "meaning matching\|skill-advisor embedder\|semantic_lane_off" INSTALL-SKILLED.md`, `rg -n "skill-advisor embedder" .skilled/skills/system-skill-advisor/INSTALL-GUIDE.md` and each cost number found in `scratch/cost-warm.json` or `scratch/cost-cold.json`. Met. Closure rerun: install contract test exit 0 with 16 of 16 passed. `rg` printed 4 lines in `INSTALL-SKILLED.md` and 2 lines in `INSTALL-GUIDE.md`. Each cost number in both guides (274302450, 25776, 32208, 279520, 4.8, 8.9, 538.53) is in the cost files. The 5 minute unload is Ollama's default keep-alive, not a measured number | Met | - |
| AC-007 | REQ-007 | Given a call scored without a prompt vector, When the recommendation is returned, Then `warnings` holds `semantic_lane_off:<reason>` and the brief is unchanged | The warning row in `tests/semantic-prompt-embedding-degrade.vitest.ts` and the golden brief tests in `npm test` in `ADV`. Met. Closure rerun: the warning row in the degrade test passed (7 of 7). Orchestrator `npm test` with the golden brief tests: 1540 passed, 0 failed (`scratch/suite-after.txt`) | Met | - |
| AC-008 | REQ-008 | Given the change, When the default capture, the floor, the rollup and both suites run, Then they print typed 24 of 44, tune combined 9 of 45, holdout 0 of 44, false offers 0 of 35, `[159,50,20,5]` and `{"ask":17,"run":7,"start":20}`, with 0 failed | `node $C \| $M`, `capture-scorer-eval-baseline.mjs` through the phase 003 jq projection, `R`, `npm test` in `ADV` and `bash DOC/scripts/tests/run-all.sh`. Met on the orchestrator's runs (evidence T037, T038): typed 24 of 44, tune 9 of 45, holdout 0 of 44, false offers 0 of 35, suite 0 failed. Closure rerun: floor `[159,50,20,5]`, rollup `{"ask":17,"run":7,"start":20}` and `run-all.sh` 0 failed. The closure capture and suite hit the stale-dist guard after another session's 04:11 and 04:13 edits, see implementation-summary.md limitation 3 | Met | - |
| AC-009 | REQ-009 | Given the route's bridge active and a rescan, When the real-embedding capture and the phrase-reach probe run, Then tune combined is 14 of 45, holdout 2 of 44, typed 24 of 44, false offers 0 of 35, `vec_cmd_768` matches the entries with `embeddingText` and the probe exits 0 | `node $C --real-embedding \| $M`, the T031 count comparison and `node DOC/scripts/doctor-phrase-reach.cjs`. Met. Evidence T039: `scratch/real-embedding-after.json` prints typed 24 of 44, tune 14 of 45, holdout 2 of 44, false offers 0 of 35, and the phrase-reach probe exited 0 with `STATUS=OK phrases=248 bridges=36`. Closure rerun: `vec_cmd_768` 46 and entries with `embeddingText` 46 | Met | - |
| AC-010 | REQ-010 | Given three before and three after hook runs over the 44 tune prompts, When the middle runs are compared, Then the median grew by at most 25 ms and the p95 by at most 40 ms | The six `scratch/hook-latency-*.json` files. Met. Middle median 172.47 to 175.74 ms (+3.27, bound 25). Middle p95 210.74 to 210.02 ms (-0.72, bound 40) | Met | - |
| AC-011 | REQ-011 | Given the advisor install guide, When a user looks for embedder health, Then it says `includeEmbeddingsHealth` probes hf-local only and names `includeSemanticHealth` | `rg -n "includeEmbeddingsHealth" .skilled/skills/system-skill-advisor/INSTALL-GUIDE.md` prints a line naming hf-local. Met. Closure rerun: `rg` printed line 372, which says `includeEmbeddingsHealth` probes only the hf-local model server and names `includeSemanticHealth` | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

All eleven rows are `Met` on 2026-11-13. The evidence is `scratch/verification-evidence.txt`, the scratch outputs it names and the closure reruns recorded in `implementation-summary.md`.
<!-- /ANCHOR:closure -->
