---
title: "Implementation Summary: Phase 33: untuned-arm-arena-run"
description: "The untuned behaviour arm ran live on five runtimes in arenas at one commit and was scored: pooled gained 25 and lost 15 rows (p 0.0769), and dsh started a command on one decline row, so the verdict is Not shown and the B-5 trigger fired."
trigger_phrases:
  - "untuned arm arena run implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run"
    last_updated_at: "2026-11-16T04:12:07Z"
    last_updated_by: "generate-context"
    recent_action: "Closed phase 033, arm verdict Not shown"
    next_safe_action: "Review research segment five"
    packet_purpose: "Purpose: One scored untuned arm on five runtimes, with a verdict against the target phase 026 fixed before its first session."
    blockers: []
    key_files:
      - "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/arm-evidence.txt"
      - "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/summary-arm.json"
      - "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/decision-record.md"
      - "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/implementation-summary.md"
      - "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/step-reader/report.txt"
    session_dedup:
      fingerprint: "sha256:338601619756a23c13f74949dc978c7a36fea0f59f858cc370857cb446712e58"
      session_id: "scaffold-033-untuned-arm-arena-run"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "77af2d6d-58e8-4180-b6da-697f12833f71"
      workspace: "/Users/michelkerkmeester/worktrees/public/352-command-surfacing-research"
      savedAt: "2026-11-16T04:12:07Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary: Phase 33: untuned-arm-arena-run

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 033-untuned-arm-arena-run |
| **Completed** | 2026-11-16 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The advisor brief does not yet show a measured gain on rows nobody tuned. Over 140 paired rows on five runtimes the `on` arm followed the owning workflow on 25 rows the `off` arm missed and lost 15, a sign test p of 0.0769. DSH also started `/create:sk-skill` on one refusal row after an `ask` offer.

### Phase 33: untuned-arm-arena-run

You now have a scored answer to the question phase 026 could not finish: does the brief change what a model does on prompts it was never tuned against? The arm ran 401 sessions on claude, opencode, pi, devin and dsh, all in throwaway arenas at `b765c7a14c5` with no remote, and the committed scorer read every one. DSH moved most (18 to 23 of 28 followed, 5 gained and 0 lost). Devin already followed 24 of 28 without the brief and stayed there. A step reader over 20 followed sessions found most of them stopped at a setup or Gate 3 question, so a followed row means the workflow was opened, not finished.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `scratch/runs/{claude,opencode,pi,devin,dsh}.jsonl` | Created | One line per turn, grouped `[36,36,8]` per runtime, no prompt field |
| `scratch/summary-arm.json`, `scratch/arm-evidence.txt` | Created | Scorer summary and the printed lines the verdict reads |
| `scratch/smoke.txt`, `scratch/reruns.txt`, `scratch/arenas.txt`, `scratch/arenas-after.txt` | Created | Smoke, faults and the arena record before and after |
| `scratch/devin-rebase-evidence.txt`, `scratch/dsh-head-move-evidence.txt`, `scratch/devin-rows.txt` | Created | The head moves and devin's per-row pairing |
| `scratch/step-reader/` | Created | Pick list, brief, 20 exported sessions and the reader's report |
| `decision-record.md` | Created | ADR-001, keeping the run when one sk-git row moved head |
| `026-untuned-behaviour-arm/scratch/runs/discarded/` | Moved | The stopped arm's 148 lines from older arenas |
| `../goal.md` | Modified | Arm verdict, Arm devin, Step reader, B-5 trigger and correction rows |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The advisor suite ran first (2313 passed, 0 failed). Five arenas were built at `b765c7a14c5` and a 10-line smoke confirmed delivery off and on. Run 1 of both arms ran side by side on the five runtimes, then the on-arm run 2 of the 8 decline rows. `score-command-transcripts.mjs --summary ... --pair off,on --json` wrote the summary, the 026 jq filters wrote the evidence, and the floors were read at the same commit. One read-only Fable 5.2 medium session judged the picked sessions. A gate review asked for the rollback deviation to be recorded, and ADR-001 now covers it.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep and score the run when `fresh-skill-04` moved head on devin and dsh (ADR-001) | The row asks for an sk-git task, so a rebase may be the answer. Discarding 401 lines over one unmeasurable row would have lost the other 35 rows on every runtime |
| Score the two dsh exit-1 lines, not rerun them | Each read a session, so neither was a reader, locator, spawn or restore fault |
| Build nothing for B-5 here | The scope is run, score and log. B-5 goes to a new phase retested on the fired rows only |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Advisor suite before the run | PASS, 2313 passed, 0 failed |
| Grouping per runtime | PASS, `[36,36,8]` on all five |
| Smoke | PASS, 10 lines, false off and true on for four runtimes, opencode unknown both, no mismatch |
| No prompt field in run files | PASS, `rg -c '"prompt"'` exits 1 |
| Floors at the arena commit | PASS, fixture combined 2 of 44, real 5 of 44, both exit 0 |
| Arenas after the run | PASS, all five at `b765c7a14c5`, 0 remotes, 0 status, 0 stash |
| Arm verdict | Not shown: pooled gained 25 lost 15 p 0.0769, dsh decline start 1 of 16 |
| Gate review | REQUESTED_CHANGES on one P1 (rollback deviation unrecorded), fixed by ADR-001 and the plan note |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **One run per arm on fit and skill-only rows.** A runtime's paired line shows direction only. The pooled sign test is the one number the verdict reads.
2. **OpenCode delivery reads unknown in both arms.** Its arms rest on the switch alone, and Codex is not measured (Q075).
3. **Followed is not finished.** The step reader found the named output on 4 of 20 followed sessions, because a one-turn arena leaves setup questions unanswered.
<!-- /ANCHOR:limitations -->
