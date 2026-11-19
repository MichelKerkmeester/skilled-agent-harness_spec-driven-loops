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
    last_updated_at: "2026-11-19T17:05:15Z"
    last_updated_by: "template-author"
    recent_action: "Initialized Level 2 template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-019-ollama-lane-honest-and-closeout"
      parent_session_id: null
    completion_pct: 0
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
- `runtime/lib/scorer/lanes/semantic-shadow.ts`: when the lane is live, it scores only with every embeddable skill and command vector present.
- `runtime/handlers/advisor-recommend.ts`: a failed prompt embed marks the lane degraded, so it leaves the live total.
- `runtime/handlers/advisor-status.ts`, `runtime/schemas/advisor-tool-schemas.ts`: report current, stale and missing counts, plus `coverageComplete`.
- `.skilled/bin/system-skill-advisor-launcher.cjs`: forwards `OLLAMA_BASE_URL`, `OLLAMA_REQUEST_TIMEOUT_MS` and `SYSTEM_SKILL_ADVISOR_EMBED_REFRESH`. It always sets the child's database directory, and reaps a server with no heartbeat 5 minutes after spawn.
- Doctor: the setup leg and the embedder route pass on full coverage and report DEGRADED without Ollama. The embedder route keeps its approved scan. Update apply, overlay apply and repin, and symlink link report coverage, and update apply names a daemon restart. `/create:command` regenerates the command bridges.
- Ablation harness: seeds skills and commands as production embeds them, scores the lane at a candidate 0.05, counts none-gold fires and asserts the registry default follows the pass bar.
- Tests: refresh, coverage, gate, outage-degraded, status, launcher grace and env, and a static embeddability guard. The test daemons and the stress workflow set the opt-out.
- Docs, ENV-REFERENCE, `SKILL.md` 1.3.0.0 and the changelogs.
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
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **Stale until Ollama returns.** A description changed while Ollama is down keeps its old vector, marked stale, until the next daemon start or watcher event with Ollama up.
- **Two answers held.** One is a CLI update question asked before any spec folder was bound. The other is a routing-label rename with no packet of its own. No packet records either, so both stay pending for the operator.
- **Writer defect.** A decisions-only `--full-auto` save with `--session-id` mints a `session_ref` into the target packet. The proposed fix is in `system-spec-kit/runtime/cli/core/workflow.ts` near line 2010: mint the pointer only when the payload carries continuity fields.
<!-- /ANCHOR:limitations -->
