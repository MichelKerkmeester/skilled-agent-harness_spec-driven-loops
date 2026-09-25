---
title: "Implementation Summary: Phase 2: cli-external-orchestration changelogs"
description: "In progress. 55 of the 112 cli-external-orchestration changelogs are kept under the current fact check and 44 of those have a clean Opus review. The rest run again in the main queue."
trigger_phrases:
  - "cli-external-orchestration changelog rewrite status"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/059-skill-changelog-retrofit/002-cli-external-orchestration"
    last_updated_at: "2026-09-25T14:07:19Z"
    last_updated_by: "generate-context"
    recent_action: "Corrected the phase docs to the in-progress state"
    next_safe_action: "Review kept files with Opus as the main run keeps them"
    blockers: []
    key_files:
      - "specs/sk-doc/059-skill-changelog-retrofit/scratch/lists/cli-external-orchestration.txt"
      - "specs/sk-doc/059-skill-changelog-retrofit/scratch/state.jsonl"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fb879d4c-5543-4760-8339-b0f3499f278d"
      parent_session_id: null
    completion_pct: 49
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
| **Completed** | In progress |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

55 of the 112 changelogs in `../scratch/lists/cli-external-orchestration.txt` now read in the sk-create-changelog format and are kept under the current fact check. Each passed the shape checker against its original, the HVR scan and the second-model fact check, and 44 of them also have a clean Opus review of their current text. The other 57 hold their original or a failed draft, and they run again in the main queue.

### Phase 2: cli-external-orchestration changelogs

The wave covers the hub's 13 entries and all seven modes: cli-claude-code (18), cli-codex (24), cli-cursor (6), cli-devin (7), cli-hermes (2), cli-opencode (29) and cli-pi (13). The skill is committed once, after every listed file is kept and has a clean review.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| 55 of 112 changelogs under `.skilled/skills/cli-external-orchestration/` | Rewritten, not yet committed | Current format, facts kept |
| `../scratch/state.jsonl` | Appended | One record per attempt, re-check and orchestrator overturn |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The main run kept 101 of 112 files on cli-pi and cli-codex, and three retry passes kept the rest. Each retry resumed a failed file from its kept draft and its last findings.

Reading samples and every retry exposed gaps the fact check did not catch, and each gap became a rule. The checker now requires the spec folder line when the original credits one and keeps a (Level N) the original states. The briefs now cover renames, identifiers, the Why section, when a Breaking marker applies, padded H4 openings, pointer-only bullets and statements of what stayed unchanged. The fact check was also strengthened, and a re-check of every kept file under it sent 87 files back to the queue.

An Opus review now reads every kept file beside its original before the skill is committed. The orchestrator has overturned 31 passes so far, after that review or a new checker rule found a real loss. Each overturn restored the original and sent the file back with its findings.

Outside problems cost time without costing any file. A Homebrew upgrade to codex 0.157.0 left its tool runner unable to start, so the driver now reruns an attempt whose tools never came up instead of spending it. cli-devin sometimes loses its file tool for a whole session and cli-opencode sometimes mistypes the home directory. Both then reported the file missing, so the driver retries such an attempt in a fresh session and the brief now names the working directory. The operator amended the parent's D3 twice, first adding cli-devin as a third Luna lane and then allowing two dispatches on each of cli-pi, cli-codex, cli-devin and cli-opencode. A careful executor also halted on a stale goal log that still called the style approval pending, and every phase goal now records the approval.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Overturn a fact-check pass when a review finds a drop or an invented claim | D1 outranks a single model's verdict, and the retry fixes the file from its draft |
| Review every kept file with Opus before the commit | The review found a real loss in about one kept file in four, so a sample was not enough |
| Resume every retry from the kept draft | A fresh start on a dense file trades old findings for new ones instead of converging |
| Do not count an attempt whose tools never started | The run says nothing about the rewrite, so spending an attempt on it would fail good files |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Target list | PASS: `wc -l < ../scratch/lists/cli-external-orchestration.txt` counts 112 files |
| Current state | In progress at 14:10 UTC on 2026-09-25: 55 kept under the current fact check, 44 of them with a clean Opus review, 57 in the main queue |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not finished.** 57 files wait in the main queue, and each kept file without a clean review waits on one.
2. **A few kept files carry the original's odd paths as written.** cli-pi v1.2.0.0 keeps a spec folder line that points at an implementation summary, because D1 keeps paths as the original wrote them.
<!-- /ANCHOR:limitations -->
