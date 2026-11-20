---
title: "Implementation Summary: Phase 19: ollama-lane-honest-and-closeout"
description: "Every embeddable skill and command now keeps a current vector on its own, the doctor checks read that coverage, a real ablation kept the lane off, and 581 unrecorded operator answers are recorded or settled."
trigger_phrases:
  - "ollama lane honest and closeout implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/019-ollama-lane-honest-and-closeout"
    last_updated_at: "2026-11-20T00:15:52Z"
    last_updated_by: "generate-context"
    recent_action: "Closed 019 on main: full vector coverage, alignment fixed, lane at 0"
    next_safe_action: "Verify scan-orphans and recursive strict validation stay clean"
    packet_purpose: "Purpose: Nothing from phases 014 to 018 is left open: the lane is correct and its weight rests on a fresh measurement, and every recorded gap is fixed or explained, and both alignment checks clear the change before it lands."
    blockers: []
    key_files:
      - ".skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts"
      - ".skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts"
      - ".skilled/bin/system-skill-advisor-launcher.cjs"
      - ".skilled/commands/doctor/assets/doctor-setup.yaml"
      - ".skilled/skills/system-skill-advisor/runtime/tests/scorer/semantic-shadow-ablation.vitest.ts"
    session_dedup:
      fingerprint: "sha256:e7846ac5362362bd14bd5ad417884c82fad86dac139b5aef950bb80852af768b"
      session_id: "scaffold-019-ollama-lane-honest-and-closeout"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "0b81ad2f-04a7-4ad7-b174-0b3f9930b833"
      workspace: "/Users/michelkerkmeester/MEGA/Development/Skilled"
      savedAt: "2026-11-20T00:15:52Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 019-ollama-lane-honest-and-closeout |
| **Completed** | 2026-11-19 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A fresh advisor daemon now fills every embeddable vector on its own: on an empty database with Ollama up it reached 14 of 14 skills and 47 of 47 commands within 5 seconds, at lane weight 0, with no scan. A changed skill description is re-embedded through the watcher within 5 seconds. The prompt path stays off Ollama: the lane's default weight is still 0, now backed by a real-embedding ablation.

- `runtime/lib/skill-graph/skill-graph-db.ts`: `embeddingCoverage` counts current, stale and missing skill and command rows with no network call. `refreshEmbeddingsInBackground` is single-flight, does nothing when coverage is complete, probes Ollama once for 500 ms, and honors `SYSTEM_SKILL_ADVISOR_EMBED_REFRESH=off`. A failed embed keeps the old vector at all four sites that used to delete it.
- `runtime/advisor-server.ts`, `runtime/lib/daemon/watcher.ts`: run that refresh after startup and after each reindex. The heartbeat now starts right after the database opens.
- `runtime/lib/scorer/lanes/semantic-shadow.ts`: when the lane is live, it scores only when `embeddingCoverage()` reports every embeddable skill and command vector current. A fixture skill vector is used only with a prompt vector of the same size.
- `runtime/handlers/advisor-recommend.ts`: a failed prompt embed marks the lane degraded, so it leaves the live total.
- `runtime/handlers/advisor-status.ts`, `runtime/schemas/advisor-tool-schemas.ts`: report current, stale and missing counts, plus `coverageComplete`.
- `.skilled/bin/system-skill-advisor-launcher.cjs`: forwards `OLLAMA_BASE_URL`, `OLLAMA_REQUEST_TIMEOUT_MS` and `SYSTEM_SKILL_ADVISOR_EMBED_REFRESH`. It always sets the child's database directory, and reaps a server with no heartbeat 5 minutes after spawn.
- Doctor: the setup leg and the embedder route pass on full coverage and report DEGRADED without Ollama. The embedder route keeps its approved scan. Update apply, overlay apply and repin, and symlink link report coverage, and update apply names a daemon restart. `/create:command` regenerates the command bridges.
- Ablation harness: seeds skills and commands as production embeds them, scores the lane at a candidate 0.05, counts none-gold fires and asserts the registry default follows the pass bar.
- Tests: refresh, coverage, gate, outage-degraded, status, launcher grace and env, and a static embeddability guard. The test daemons and the stress workflow set the opt-out.
- Docs, ENV-REFERENCE, `.env.example`, `SKILL.md` 1.3.0.0, the changelogs and a new catalog leaf for the background refresh.
- Routing: ten intent signals in the skill's `graph-metadata.json` so prompts about vector coverage, the semantic lane, the advisor daemon, the watcher, command bridges and the refresh reach this skill. The compiled graph export and leaf metadata are regenerated.
- Operator answers from ended sessions:
  - 232 new decision-record entries across 76 packets, from 228 answers. Two answers name three packets each and get one entry in each.
  - 246 consumed rows for answers already recorded.
  - 35 consumed rows for answers that sit in hand-written tables.
  - 72 dismissals. By the map's skip reasons: 27 with Gate 3 answered D, 15 questions back or deferrals, 13 targeting gitignored `specs/other`, 8 in the Barter repo, 5 meta or coordination, 3 where the operator chose push and cleanup only, and 1 release-notes edit with no packet.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work ran in worktree 480. Fourteen Luna leaves made the source, doctor and test changes. Each leaf's tests failed against the reverted source and passed against the change, with a rebuild before every full run. Two advisors, Opus 5.5 at xhigh and Fable 5.2 at medium through claude2, read the coverage problem first. Their split on refreshing at weight 0 was settled by the operator's request for automatic full coverage.

For the ablation, `ollama serve` (pid 85898) was started and warmed: a cold embed took 276 ms and a warm one 18 ms. The opt-in harness ran twice per configuration. The orphan answers were mapped by one read-only agent, and a second agent rechecked the 58 inferred mappings. I spot-checked a retarget against the packet text, then wrote them with decisions-only full-auto saves.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Refresh vectors at any lane weight; keep only the prompt path tied to the weight | The operator asked for full coverage, kept automatically. A refresh costs calls only for changed rows. A weight-gated refresh would leave coverage partial whenever the lane is turned on. |
| Default weight stays 0 | Two matching runs with production seeding scored 156 with the lane against 161 without, with 7 flips and no gain. That fails the pass bar written before the run. |
| No create or doctor workflow chains a new scan; the embedder route keeps its approved one | The daemon covers new skills and overlays on start and on watcher events. The embedder route is where an operator sets up Ollama, so it fills vectors at once. |
| Decisions-only saves run without `--session-id` and `--runtime` | With them, the writer mints a `session_ref` into the target packet's continuity even when the payload carries only decisions. That would point 76 packets at this session. |
| Answers that need no record are dismissed in the consumed log, with a reason | Nothing else clears them, and leaving them pending forever hides the real backlog. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Ablation, skills only seeded (runs 1 and 2) | 158 with the lane, 161 without, 3 flips, none-gold fires 5 and 5, flip lists identical |
| Ablation, skills and commands seeded as production (runs 3 and 4) | 156 with the lane, 161 without, 7 flips, none-gold fires 5 and 5, no new fire, flip lists identical |
| Fresh isolated daemon, Ollama up, weight 0 | 0/14 and 0/47 at start; 14/14 skills and 47/47 commands, `coverageComplete: true`, within 5 s |
| Watcher: one skill description changed | stale 1, then current 14/14 within 5 s |
| Runtime suite (Ollama up) | 2553 passed, 6 skipped; baseline 2537 passed, 8 skipped (the two extra passes need a live provider) |
| Python, bin, spec-kit launchers, DSH | 122/0, 94/94, 202 passed 2 skipped, 18/0 |
| Python on quiet main, 10 runs; runtime, 4 runs | 122/0 every run; no failure in any runtime run |
| Daemon-start failures seen once (six tests) | Reproduced by touching one source: under vitest the launcher refuses to build a stale `dist` and exits 1, by design. Rebuild after a revert-and-apply step. |
| Orphan scan after the writes | Only a still-running session (17), this session, and 2 answers no packet records |
| Ablation after the alignment fixes (runs 6 to 9, runs 8 and 9 on the shipped code) | 156 with the lane, 161 without, 7 flips, no new none-gold fire, flip lists identical to runs 3 and 4; default stays 0 |
| Suites after the alignment fixes (Ollama up) | Runtime 2556 passed, 6 skipped; Python 122/0; bin 94/94; spec-kit launchers 202 passed, 2 skipped; DSH 18/0 |
| Main after merge `519b2b1ef8e` and push, Ollama up | The daemon recycled onto the new build; 8/15 and 0/47 at start, then 15/15 skills and 47/47 commands current, `coverageComplete: true`, within 5 s, at weight 0 |
| Outage on main | Stopped only `ollama serve` pid 85898; port 11434 refused. A changed `sk-prompt` description read stale 1, missing 0 (vector kept), backend `unreachable`; restoring the text read 15/15 current again |
| Generation counter after the database-directory pin | Found on main after the merge: the pinned daemon wrote `skill-graph-generation.json` into `runtime/database/` instead of the shared `.state/advisor/` file. `generation.ts` now treats an override naming the default database directory as no sandbox. The new containment test failed before and passes after |
| CI on main after the merges | Skill Advisor Stress Tests had failed on every run since the lane weight moved to 0, because one stress test still expected 0.05; fixed in `86038dfba80`, 65/65 locally. Routing Registry Drift Guard now passes its skill-root metadata step and stops at the sk-doc hub vocabulary check, which also fails at the base `f2f03c90fb6`. Hook Vitest Suites fails one Pi session-handover test, identically before and after these merges |
| Vibe document test in CI | Its case named a gitignored local command, so it failed in every CI checkout once the stress step stopped failing first. It now names `/doctor:setup` (`c74042fd559`): fails with the old fixture when the local doc is absent, passes with the new one; runtime 2555 passed. Skill Advisor Stress Tests passed in CI on `c8874dd6ef3` |
| Battery over the final range (`--full-diff` from `f2f03c90fb6`) | 324 pass; S13 lists only `VITEST` (accepted); two spec-kit package checks could not run without `node_modules` in the worktree, and Spec-Kit Check passed in CI on the merges |

### Alignment findings

`/local-skilled-alignment` (SK) ran over the branch against `f2f03c90fb6`, and `/local-doc-alignment` (DOC) ran over a local `advisor-vector-refresh` topic. Both used Vibe DeepSeek Flash lanes and critic, in `:auto` report-only mode. Reports: `evidence/skilled-alignment/` and `evidence/doc-alignment/`.

| Finding | Outcome |
|---------|---------|
| SK BAT-01, SK B-08 | Fixed: `leaf-aliases.json` regenerated with `ci-skill-root-metadata.cjs --fix`; the check exits 0. It failed on main too |
| SK BAT-02, SK B-09 | Fixed: the two `Feature ID:` lines the catalog validator rejects are gone; the validator exits 0. It failed on main too |
| SK BAT-03, SK D-05 | Fixed: the compiled `skill-graph.json` re-exported; `skill-graph-freshness.cjs --strict` exits 0. Runtime routing reads SQLite, so the export changes no route |
| SK D-02, SK A1 (overturned as its duplicate), DOC L3-7 | Fixed: the lane gate now reads `embeddingCoverage()`, so a stale or missing vector disables it. The new stale-hash test failed before and passes after |
| SK A2 | Fixed: a fixture skill vector is used only with a prompt vector of the fixture size, so a real 768-dim prompt never meets a 32-dim fixture vector. The new test failed before and passes after. Four reruns gave the same result as before, so the fixture rows had not changed the outcome |
| SK A3 | Fixed: source-order checks for the early heartbeat, the startup refresh after IPC and the watcher refresh after reindex |
| SK D-01, SK PRB-01, SK PRB-02, SK PRB-03, SK PRB-04, SK PRB-06, SK PRB-07, SK PRB-09, SK PRB-11 | Fixed for P01, P02, P03, P04, P06, P07, P09 and P12: ten intent signals added to the skill's `graph-metadata.json`; each now routes `system-skill-advisor` first after a reindex, and the six control probes are unchanged |
| SK PRB-05 | Accepted: "explain which lane contributed" still returns no recommendation even with the new signal. It asks about one recommendation's attribution, which `advisor_recommend` returns as an option, not a skill to route to |
| SK PRB-08, SK PRB-10 | Accepted: P08 and P11 route to `/doctor:helper`, and the helper's matcher picks `/doctor:skill-advisor embedder` for both prompts (`doctor-helper-match.cjs` run on each), a correct path for an operator |
| SK C-01, SK ENV-01 | Fixed: `.env.example` lists `SYSTEM_SKILL_ADVISOR_EMBED_REFRESH` |
| SK ENV-02 | Accepted: `VITEST` is set by the test runner, not by an operator |
| SK B-01 | Fixed: the freshness contract says the daemon writes vectors itself |
| SK B-02, DOC L3-1, DOC C4, DOC L3-2 | Fixed: lane-weight tuning names the live default 0 and cites where the weights live |
| SK B-03, DOC L3-3 | Fixed: the ablation catalog leaf lists its test and says `runLaneAblation` ignores weights |
| SK B-04 | Fixed: new catalog leaf `daemon-and-freshness/background-vector-refresh.md`, indexed, leaf manifest regenerated |
| SK B-05, DOC L3-4 | Fixed: the ablation playbook keeps only the 196-row record and drops the `advisor_validate` slice claim |
| SK B-06 | Fixed: the degraded-daemon playbook uses `backend.state` values |
| SK B-07 | Fixed: `SKILL.md` names `includeSemanticHealth` |
| SK X-01 | Fixed: CHK-020 unticked until every row is Met |
| SK X-02 | Fixed: the plan describes the any-weight refresh |
| SK X-03 | Fixed: the edge case says 5 minutes |
| SK X-04 | Fixed by the closing save, which refreshes this packet's metadata and continuity |
| SK X-05, DOC L3-5 | Fixed: the playbooks pass `--include-semantic-health true` and check both coverage objects |
| SK C-02 | Fixed: the root README names the background refresh |
| SK C-03 | Fixed: the skill README says enabling needs full coverage and how to check it |
| SK C-04 | Fixed: the release note limits "no probe" to pointer resolution |
| SK D-03, DOC L2-7 (overturned) | Fixed: the embedder route says to rerun it and approve its Ollama steps. The skilled critic was right; the doc critic's rebuttal missed that the pointer named the route itself |
| SK D-04 | Fixed: both `/create:command` workflows gate on `derive-command-bridges.cjs --check` |
| DOC L2-1, DOC L2-2 | Fixed: ARCHITECTURE names the reindex refresh and the default-off lane |
| DOC L2-3 | Fixed: the status catalog leaf says `--warm-only` with no warm daemon exits 75 |
| DOC L4-1, DOC L4-2 | Fixed: INSTALL-SKILLED says the lane ships at 0 on a measured result and gives the route's real step order |
| DOC C1, DOC C2, DOC L2-4, DOC L1-1 | Fixed: the doctor assets name every cause of exit 75 |
| DOC C3, DOC L1-2, DOC L1-3, DOC L2-5, DOC L2-6 | Fixed: the doctor assets name both refresh points, the next start and a watcher reindex |
| DOC C6, DOC C7 | Fixed: one rule in every doctor file: PASS needs complete coverage and a reachable backend |
| DOC C5 | Fixed: meaning-matching is off at the default weight 0 |
| DOC C8 | Fixed: no prompt embed at weight 0 |
| DOC L3-6, DOC L3-8 | Fixed: semantic fields come only with `includeSemanticHealth`; line citations updated |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **Stale until Ollama returns.** A description changed while Ollama is down keeps its old vector, marked stale, until the next daemon start or watcher event with Ollama up.
- **Two answers held.** One is a CLI update question asked before any spec folder was bound. The other is a routing-label rename with no packet of its own. No packet records either, so both stay pending for the operator.
- **Writer defect.** A decisions-only `--full-auto` save with `--session-id` mints a `session_ref` into the target packet. The proposed fix is in `system-spec-kit/runtime/cli/core/workflow.ts` near line 2010: mint the pointer only when the payload carries continuity fields.
- **Generation counter for a shared checkout.** When a daemon's database directory is not its workspace's default, as when one Skilled checkout serves another repository, the counter stays beside that database, as it did for any sandboxed daemon before.
- **Gate cost not measured.** With the lane above weight 0, each prompt runs the coverage check, which reads every skill's `SKILL.md`. At the shipped weight 0 it never runs.
- **Two CI failures outside this work.** The sk-doc hub vocabulary drift and the Pi session-handover test fail on main before and after these merges.
<!-- /ANCHOR:limitations -->
