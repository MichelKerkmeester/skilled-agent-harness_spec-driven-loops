---
title: "Implementation Summary: Phase 2: cli-external-orchestration changelogs"
description: "All 112 cli-external-orchestration changelogs now read in the sk-create-changelog format and keep every fact their originals recorded. Each passed the fact check in force when it was kept and has a clean Opus review of its current text. Commit 67b8c4c344 holds them on main."
trigger_phrases:
  - "cli-external-orchestration changelog rewrite status"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/059-skill-changelog-retrofit/002-cli-external-orchestration"
    last_updated_at: "2026-09-26T08:26:11Z"
    last_updated_by: "generate-context"
    recent_action: "Committed and pushed the cli-external-orchestration rewrites in 67b8c4c344"
    next_safe_action: "Close the parent packet"
    blockers: []
    key_files:
      - "specs/sk-doc/059-skill-changelog-retrofit/scratch/lists/cli-external-orchestration.txt"
    session_dedup:
      fingerprint: "sha256:be1ec4fccb42be9481d6efa3b25138c246562b653dd9a81c700dd55ac4c8fdaf"
      session_id: "fb879d4c-5543-4760-8339-b0f3499f278d"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Phase 2: cli-external-orchestration changelogs

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-cli-external-orchestration |
| **Completed** | 2026-09-26 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

All 112 changelogs in `../scratch/lists/cli-external-orchestration.txt` now read in the sk-create-changelog format, 96 compact and 16 expanded. Each passed the shape checker against its original, the HVR scan and the second-model fact check in force when it was kept, and each has a clean Opus review of its current text. Commit `67b8c4c344` holds them on `origin/main`.

### Phase 2: cli-external-orchestration changelogs

The wave covers the hub's 13 entries and all seven modes: cli-claude-code (18), cli-codex (24), cli-cursor (6), cli-devin (7), cli-hermes (2), cli-opencode (29) and cli-pi (13).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| 112 changelogs under `.skilled/skills/cli-external-orchestration/` | Rewritten | Current format, facts kept |
| `../scratch/state.jsonl` | Appended | One record per attempt, re-check and orchestrator overturn |
| `../scratch/opus-review.jsonl` | Appended | One clean review record per file |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The main run kept 101 of 112 files on cli-pi and cli-codex, and three retry passes kept the rest. Each retry resumed a failed file from its kept draft and its last findings.

Reading samples and every retry exposed gaps the fact check did not catch, and each gap became a rule. The checker now requires the spec folder line when the original credits one and keeps a (Level N) the original states. The briefs now cover renames, identifiers, the Why section, when a Breaking marker applies, padded H4 openings, pointer-only bullets, statements of what stayed unchanged, a fact's timing and actor, glosses of terms the original does not explain and bullets that restate their bold lead. The fact check was also strengthened, and a re-check under it failed 87 of this phase's kept files and sent them back to the queue.

An Opus review read every kept file beside its original before the commit. It overturned 85 passes across 50 files, and each overturn restored the original and sent the file back with its findings. The files that took the most rounds were cli-hermes v1.0.0.0, cli-opencode v1.3.15.0 and cli-pi v1.1.0.0 and v1.5.3.0. cli-pi v1.1.0.0 swung between two findings that pulled against each other until an orchestrator record settled which wording held. One orchestrator fix in cli-hermes v1.0.0.0 itself turned a parenthetical into an identity claim, and a later review caught and corrected it. Two hub entries, v1.1.0.0 and v1.2.0.0, failed the re-check only for verification evidence, which D2 drops, and orchestrator records voided those failures.

Outside problems cost time without costing any file. A Homebrew upgrade to codex 0.157.0 left its tool runner unable to start, so the driver now reruns an attempt whose tools never came up instead of spending it. cli-devin sometimes loses its file tool for a whole session and cli-opencode sometimes mistypes the home directory. Both then reported the file missing, so the driver retries such an attempt in a fresh session and the brief now names the working directory. The operator amended the parent's D3 twice, first adding cli-devin as a third Luna lane and then allowing two dispatches on each of cli-pi, cli-codex, cli-devin and cli-opencode. When the GPT plan later hit its usage limit, the driver sent the GPT lanes through the LLM Gateway until the limit lifted, as D3 allows, and 4 kept texts came through it. A careful executor also halted on a stale goal log that still called the style approval pending, and every phase goal now records the approval.

Late in the run cli-devin's weekly usage quota ran out. Its attempts then returned within seconds without writing, which spent two of cli-hermes v1.0.0.0's attempts before the orchestrator stopped the driver and restarted it on the three GPT lanes. The retry resumed from the draft of the file's first cli-devin attempt, and cli-pi kept it at its second attempt.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Overturn a fact-check pass when a review finds a drop or an invented claim | D1 outranks a single model's verdict, and the retry fixes the file from its draft |
| Review every kept file with Opus before the commit | The review found a real loss in 50 of the 112 files, so a sample was not enough |
| Resume every retry from the kept draft | A fresh start on a dense file trades old findings for new ones instead of converging |
| Settle conflicting findings with an orchestrator record | A retry given two findings that pull against each other rewrites the same sentence back and forth |
| Void a re-check failure whose only findings are verification evidence | D2 drops verification evidence, so its absence is not a loss |
| Do not count an attempt whose tools never started | The run says nothing about the rewrite, so spending an attempt on it would fail good files |
| Keep passes made before the fact check named timing words, actors and scope | Every kept file already had an Opus review that applies those checks, so a re-check would only add churn to reviewed files |
| Drop cli-devin from the lanes once its quota ran out | A lane that fails in seconds takes a new file each time, so it would have failed most of the queue |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Target list | PASS: `wc -l < ../scratch/lists/cli-external-orchestration.txt` counts 112 files |
| Clean start | PASS: each saved original in `../scratch/orig/` matches its file at `HEAD` byte for byte |
| Final state | PASS: the latest `state.jsonl` record of every file is `pass` under the fact check in force when it was kept |
| Gates | PASS: `wave-verify.cjs` reran the shape checker with `--old`, the HVR scan and the frontmatter check and reports 112 kept, 0 failed, 0 problems |
| Opus review | PASS: all 112 files have a clean review of their current text |
| Commit | PASS: `67b8c4c344` holds the 112 rewrites and is on `origin/main` |
| Routing and mirrors | PASS: `compiled-route-guard.cjs` and all nine `sync-*.cjs --check` runs exit 0 after the last skill commit |
| Phase validation | PASS: `validate.sh --strict` reports `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The fact check and the review are two models' readings.** Neither found a loss in the current text, but a third reader could still weigh a paraphrase differently.
2. **A few kept files carry the original's odd paths as written.** cli-pi v1.2.0.0 keeps a spec folder line that points at an implementation summary, because D1 keeps paths as the original wrote them.
3. **Some kept texts came through the LLM Gateway.** Its text-only route has no tools, so those drafts had no self-check before the driver's gates. They passed the same gates and review as the rest.
<!-- /ANCHOR:limitations -->
