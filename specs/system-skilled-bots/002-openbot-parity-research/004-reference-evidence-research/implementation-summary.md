---
title: "Implementation Summary"
description: "The 40-iteration reference evidence run is prepared and has not started: the topic, six seeds, both provider probes and a dry run are done, and the research itself waits for the operator's go."
trigger_phrases:
  - "reference evidence research implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research"
    last_updated_at: "2026-11-27T07:15:00Z"
    last_updated_by: "generate-context"
    recent_action: "Prepared the run: topic, six seeds, provider probes and dry run"
    next_safe_action: "Start the fan-out with the invocation in plan.md, with PI_BLACKHOLE_PASSIVE=true exported"
    packet_purpose: "Purpose: A per-phase evidence pack and a ranked list of net-new features, so each build phase starts from cited reference code and known pitfalls."
    blockers: []
    key_files:
      - "specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/plan.md"
      - "specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/scratch/research-topic.txt"
      - "specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/scratch/frontier-seed.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-reference-evidence-research"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "898906b1-abe5-411a-9d60-305d89889d36"
      workspace: "/Users/michelkerkmeester/MEGA/Development/Skilled"
      savedAt: "2026-11-27T07:15:00Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 20
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-reference-evidence-research |
| **Completed** | Not complete. Prepared 2026-11-27, the run has not started |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The research run is ready to start and nothing has been researched yet. The packet holds the topic, the six seed questions and the exact invocation, and both providers answered a probe.

### Phase 4: reference-evidence-research

You get a run that reads the ten reference repos against the fourteen 003 build phases and returns, per phase, the code to lift or mirror and the pitfalls to guard against. It also ranks what those repos have that the plan and the skip list both miss. The preparation found one input no earlier run had read: `openhuman-full` carries five vendored crates with 4,471 files, and the same folders are empty in `openhuman-main`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md`, `plan.md`, `tasks.md`, `goal.md` | Created | The scope, the invocation, the ordered tasks and the completion criteria of the run |
| `scratch/research-topic.txt` | Created | The topic text the run is started with |
| `scratch/frontier-seed.json` | Created | The six depth-1 questions the frontier opens with |
| `scratch/preflight.txt`, `scratch/dry-run.txt` | Created | The executor checks, the two provider probes and the dry-run preview |
| `../spec.md`, `../goal.md` | Modified | The parent's phase map, handoff rows, decisions and binding row for the fourth run |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The seeds were checked first with `frontier-admit.cjs seed` against a scratch folder. Each provider then took one trivial call. Last came the fan-out preview, which builds every lineage command and writes nothing. No research iteration ran.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Four lineages of 10 iterations, not one of 40 | Four lineages finish in parallel, and a provider that runs out stops half the seeds instead of the whole run |
| Two providers, Vibe and Pi | The plan-depth run lost three seeds when its one failing provider ran out of usage |
| Seeds written before the run | A running fan-out lineage does not read `research/inbox.jsonl`, so a seed cannot be corrected after spawn |
| `openhuman-full` gets its own seed and its own lineage | It is the only input no earlier run studied, and it is the largest repo in the folder |
| Run on `main` in the primary checkout | The reference repos are gitignored and exist only there |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Seed admission against a scratch folder | PASS: `F-1-001` to `F-1-006` admitted, none pruned |
| Executors on PATH | PASS: `vibe 3.1.2` and `pi 1.6.0` |
| Pi probe, `llmgateway/deepseek-v4.1-flash-1017` at `--thinking max` | PASS: the output text was `OK` |
| Vibe probe, `deepseek-flash` | PASS: the output text was `OK`, and `export.json` records `exit_code` 0 and `outcome` `finished` |
| Fan-out preview | PASS: `vibe-1`, `vibe-2`, `pi-1` and `pi-2` previewed, 10 iterations and max effort on each Pi lineage, `dry_run_halt` printed, no `research/` folder |
| The research run | NOT RUN: it waits for the operator's go |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No research has run.** The 40 iterations and the synthesis are tasks T006 to T012 in `tasks.md`.
2. **The Pi lineages have no timing on record.** The only measured pace is Vibe at about one minute per iteration in the plan-depth run, so the 20 to 40 minute estimate for this run is an assumption for the Pi half.
3. **A probe proves the provider answers now, not that its quota lasts 20 iterations.** A lineage that fails on quota is rerun from the `rerun_command` in `research/orchestration-summary.json`.
4. **The preview cannot show a Vibe command or the seed split.** The runner builds a Vibe command only at the real run, and seeding runs after the preview.
<!-- /ANCHOR:limitations -->

---
