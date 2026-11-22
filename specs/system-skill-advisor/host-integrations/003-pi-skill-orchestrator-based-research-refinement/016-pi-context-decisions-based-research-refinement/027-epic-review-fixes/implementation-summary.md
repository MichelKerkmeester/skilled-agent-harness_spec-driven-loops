---
title: "Implementation Summary: Fix the findings of the fresh epic review"
description: "Every advisor setting the docs name now works under the daemon or is gone, the dead eval script and scorer paths are deleted, and the doctor's lane cleanup commands run in a test."
trigger_phrases:
  - "epic review fixes implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/027-epic-review-fixes"
    last_updated_at: "2026-11-22T21:43:37Z"
    last_updated_by: "generate-context"
    recent_action: "Fixed the third review's findings and passed every gate"
    next_safe_action: "Land the 518 branch on main after merging origin/main and rerunning the gates"
    packet_purpose: "Purpose: Every setting the docs name either works under the daemon or is gone, and the doctor's cleanup command has a test that runs it."
    blockers: []
    key_files:
      - ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts"
      - ".skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py"
      - ".skilled/skills/system-skill-advisor/runtime/lib/route-exclusions.ts"
      - ".skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json"
      - ".skilled/skills/system-skill-advisor/changelog/v2.0.1.0.md"
    session_dedup:
      fingerprint: "sha256:4b2a0983a18e383cbfd001e59c510b778c30a3105fe1c0f01dee517bf274e0f3"
      session_id: "scaffold-027-epic-review-fixes"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "0b81ad2f-04a7-4ad7-b174-0b3f9930b833"
      workspace: "/Users/michelkerkmeester/worktrees/public/518-advisor-review-round-three"
      savedAt: "2026-11-22T21:43:37Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary: Fix the findings of the fresh epic review

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 027-epic-review-fixes |
| **Completed** | 2026-11-22 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every advisor setting the docs name now either reaches the daemon or is gone. Before this run, an operator who set the calibration override, the feedback records path or the route denylist folder saw no change and no warning. The doctor's lane cleanup commands also run in a test now, so a renamed tool flag fails a suite instead of a user's upgrade.

### Phase 27: epic-review-fixes

A fresh Fable 5.2 review at high effort on the `claude2` account read the advisor and the epic at `920be184c8c` and returned REQUESTED_CHANGES (`evidence/review-report.md`). This packet fixes its one P1 and six P2 findings and the leftovers it listed. The operator chose deletion for the three dead settings and approved deleting the untracked build output.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/scorer/scoring-constants.ts` | Modified | `resolvedCalibration`, its override type and `semanticSearchCodeGraphBonus` removed |
| `runtime/lib/scorer/fusion.ts` | Modified | Query-class routing and the unused explicit-signal input and helper removed |
| `runtime/lib/scorer/lanes/bm25.ts` | Modified | One fixed logistic midpoint replaces the query-length switch |
| `.skilled/bin/system-skill-advisor-launcher.cjs` | Modified | `SPECKIT_ADVISOR_FEEDBACK_CALIBRATION_PATH` and `SPECKIT_ADVISOR_ROUTE_EXCLUSIONS_DIR` forwarded |
| `runtime/scripts/skill_advisor.py` | Modified | Boosts for `embedding`, `embeddings`, `vector` and `voyage`, and the two retired synonyms, removed |
| `runtime/scripts/routing-accuracy/score-outcome-rerank.mjs` | Deleted | Imported a module with no source |
| `runtime/scripts/routing-accuracy/README.md` | Modified | Script row removed; the corpus row no longer names it |
| `runtime/tests/parity/holdout-independent.vitest.ts` | Modified | The consumer entry removed |
| `runtime/tests/launcher-bootstrap.vitest.ts` | Modified | Case for the two forwarded keys |
| `runtime/tests/scorer/conflict-query-rerank.vitest.ts` | Modified | Query-class case and its imports removed |
| `runtime/tests/scorer/projection-fallback-049-005.vitest.ts` | Modified | Two retired fixture columns removed |
| `.skilled/commands/doctor/scripts/tests/doctor-update-contract.test.cjs` | Modified | Case that runs both cleanup commands on a fixture checkout |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` and the root example env file | Modified | Calibration override rows removed |
| `../spec.md` (016 parent) | Modified | Row 27 and its handoff row |
| This packet's documents and `evidence/review-report.md` | Created | Spec, plan, tasks, criteria, this summary and the source review |
| `runtime/scripts/skill_advisor_runtime.py` | Modified | Second round: a route-exclusion loader that reads the folder and files the native loader reads |
| `runtime/scripts/skill_graph_compiler.py` | Modified | Second round: the compiler's own loader and fixed folder replaced by a call to the runtime loader |
| `runtime/scripts/skill_advisor.py` | Modified | Second round: the bridge env list forwards both location keys, and `analyze_request` skips excluded skills and drops any a later layer adds back |
| `runtime/tests/python/test_skill_advisor.py` | Modified | Second round: ROUTE-EXCL and BRIDGE-ENV cases |
| `runtime/lib/metrics.ts`, `runtime/tests/legacy/advisor-observability.vitest.ts` | Modified | Second round: the dead alert-threshold reader and its test case removed |
| `runtime/lib/scorer/executor-delegation.ts`, two feature-catalog pages | Modified | Second round: the floor comment and the catalog sentences match the code |
| `evidence/opus-verification.md` | Created | The Opus verification report the second round answers |
| `.skilled/skills/system-skill-advisor/SKILL.md`, `changelog/v2.0.1.0.md` | Modified, Created | Patch bump to 2.0.1.0 and its changelog entry, by operator decision. The third round is folded into the same entry, by operator decision |
| `runtime/scripts/skill_advisor.py` | Modified | Third round: the bridge forwards every scorer setting, names the launcher-only keys and defaults doc triggers on, the threshold defaults read their settings, and the fallback carries the deep-loop offer gate |
| `runtime/lib/command-attach.ts`, `runtime/lib/scorer/lanes/explicit.ts`, `runtime/lib/scorer/fusion.ts` | Modified | Third round: one iterative-ask pattern replaces the bare `iterations`, `iterative` and `iteratively` loop words in the gate and both scorer checks |
| `runtime/lib/route-exclusions.ts`, `runtime/handlers/advisor-recommend.ts` | Modified | Third round: the list reloads when its file changes, and the prompt cache signature carries the file's stamp |
| `runtime/tests/fixtures/deep-loop-offer-cases.json`, `runtime/tests/deep-loop-offer-cases.vitest.ts`, `runtime/tests/fixtures/README.md` | Created, Modified | Third round: offer cases both gate copies read |
| `runtime/tests/scorer/deep-loop-ask-routing.vitest.ts`, `runtime/tests/route-exclusions.vitest.ts`, `runtime/tests/compat/shim.vitest.ts`, `runtime/tests/python/test_skill_advisor.py` | Modified | Third round: minimal-pair ranking, the reload case, the doc-trigger default in the bridge env, and five Python cases |
| `runtime/scripts/routing-accuracy/command-prompts.jsonl`, `command-routing-baseline.json` | Modified | Third round: three near-miss rows and the recaptured baseline |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md`, the advisor's `feature-catalog/cli-surface/advisor-recommend.md` and its playbook page | Modified | Third round: four missing rows, the note on when an env change takes effect, and the gate sentences |
| `evidence/opus-third-review.md` | Created | The third review and the session's checks of it |

`runtime/` is `.skilled/skills/system-skill-advisor/runtime`. Outside git, the primary checkout's advisor `dist/` lost `lanes/semantic-shadow.js`, its map and the `embedders/` folder.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The worktree was created with sk-git's naming script, its skill graph scanned, and a baseline taken before any edit: the advisor suite at 2,450 passed with 4 skipped and the Python suite at 123 of 123. The edits went in per finding. The new contract case was then proven by adding `--verbose` to the YAML apply command, which failed it, and restoring the file. The quality gate, the sk-code drift guards and the whole gate set ran last on the final tree, and the trigger index was regenerated as the last write.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Delete the calibration override, query-class routing and the BM25 length switch | The operator chose deletion. None had a caller under the daemon, and wiring them would need tests and launcher keys they never had |
| Forward the two location keys rather than caveat their doc rows | Both settings are documented as working, and one allowlist line each makes that true |
| The contract case appends `--db-dir` and `--socket-dir` to the YAML commands | The bare commands would read and could delete real machine state. The added flags only move locations, so the tool still parses the YAML's own mode, flags and answer |
| Also remove `voyage` and the two synonyms in the Python fallback | They are the same retired memory database vocabulary as the three boosts the review named |
| Leave the dated approval reason in `local-native-approved-divergences.json` | The residue allowlist keeps it on purpose as a frozen reviewer record, and it still names the divergence's cause |
| Second round: one Python exclusion loader, used by both the fallback scorer and `skill_graph_compiler.py` | The compiler already read the machine-local override file but ignored the folder override. It now calls the runtime loader, so both Python readers resolve the folder and files as the native loader does, and the duplicate loader is gone |
| Second round: the fallback drops excluded skills twice, at the candidate loop and before it returns | Skipping at the loop mirrors the native `isDefaultRoutable` check. Executor delegation and the command-bridge rename can add a row after the loop, so a final drop catches them. The ROUTE-EXCL case fails when either step is removed |
| Second round: delete the four alert-threshold keys rather than wire them | Nothing outside one test read them, so no alert was ever raised, and the operator chose deletion for this class of dead setting |
| No guard test for every daemon-read setting | Both instances it would catch are fixed here, and the test would need its own exception list for settings each caller reads in its own process |
| Third round: a guard between the launcher's list and the bridge's list, with a named launcher-only set | The bridge child scores in its own process, so its list has to follow the launcher's. The guard fails when a key is added to one list and not the other, which is how the second-round gap happened |
| Third round: `iterative` asks for the loop only beside a review or research activity, as its manner, or as the work's unit | The bare word described the subject as often as the run. The first gate run showed one corpus prompt reaching the hub only through "per-iteration", so "looped investigation" joined the pattern and every corpus row's top-1 now matches main |
| Third round: the Python fallback gets its own copy of the offer gate, checked against a shared fixture | The fallback runs where the compiled gate cannot, and Python's lookbehind needs fixed widths, so the patterns cannot be shared directly. The shared fixture fails whichever copy drifts |
| Third round: a stat on every recommendation instead of a file watcher | The stat is cheap beside scoring, and it needs no new process or lifecycle |
| Third round: finding 7 left alone | It does not reproduce on main. Every phrasing tried gets `/deep:review` |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Advisor typecheck and clean build | PASS, both exit 0 |
| Advisor suite | PASS, 178 files. Round one: 2,450 passed and 4 skipped, the baseline totals, one case added and one removed. Round two: 2,449 passed and 4 skipped, one lower because the dead threshold case was removed. Round three: baseline 2,532 passed and 4 skipped on the newer main, final 2,564 passed and 4 skipped, 180 files |
| Scorer-eval, divergence and holdout ratchets | PASS, 7 of 7, 9 of 9 and 6 of 6, with no baseline recapture. In round three the first run failed 2 scorer-eval cases and 1 divergence case on corpus row `rr-iter3-170`, fixed by T036, and every labeled and ambiguity row's top-1 then matched main's |
| Command routing baseline | Round three: recaptured for three near-miss rows. No existing row moved, false offers 0 of 48 |
| Corpus ratchet | PASS, exit 0 at the same thresholds as the baseline |
| Python advisor suite | PASS. Round one 123 of 123, the baseline. Round two 125 of 125 with ROUTE-EXCL and BRIDGE-ENV. Round three 130 of 130 with BRIDGE-PARITY, BRIDGE-SCORER, THRESHOLD-ENV, DEEP-LOOP-GATE and DEEP-LOOP-FALLBACK. ROUTE-EXCL failed with the loop skip removed, and again with only the final drop removed |
| Doctor contract suite | PASS, 21 of 21. The cleanup case failed with `--verbose` added to the apply command, and in round two with `remove` in place of `delete` in the YAML's answer values, and passed after each restore. Each apply run must also report no deleted, stopped or removed item on the clean fixture |
| Doctor `run-all.sh` | PASS, 7 suites passed and 0 failed |
| Residue repo mode, gate test and tool suite | PASS, 47 allowlisted and 0 live, the gate test passes, the tool suite 117 of 117 |
| Speckit typecheck, command bridges, link check, advisor leaf manifest | PASS, each exit 0, bridges `fresh` |
| sk-code quality gate and drift guards | PASS, `NO_BLOCKER_FOUND` with an empty `unverified` list, and all 4 drift guards passed |
| Trigger index | PASS after the last-write regeneration, `stale documents   : 0` |
| `validate.sh --strict` on 027 and 016 | PASS, `RESULT: PASSED` for each |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **An operator who set a removed setting gets no message.** The calibration override, `SPECKIT_ADVISOR_QUERY_CLASS_ROUTING`, `SPECKIT_ADVISOR_BM25_QUERY_LENGTH_CALIBRATION` and the four hook alert thresholds never changed behavior, so nothing differs for them. Remove them from the dotenv file by hand.
2. **A running daemon keeps the env it started with.** Only the route-exclusion files are read again on the next prompt. `ENV-REFERENCE.md` now says so.
3. **`iterative` beside `research` still matches the loop hub's own vocabulary.** "research iterative deepening search algorithms" ranks the hub first, with no run offered. No loop rule reads it; the derived lane's word overlap does.
4. **The other session's deep-loop work shipped under 2.0.1.0.** Its changelog line and this round's fixes to it are folded into the same entry.
<!-- /ANCHOR:limitations -->

---
