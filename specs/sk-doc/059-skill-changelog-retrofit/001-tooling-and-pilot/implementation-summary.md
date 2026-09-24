---
title: "Implementation Summary: Phase 1: tooling and pilot"
description: "The checker, the two briefs and the driver are built, and pilot run 2 kept six of ten rewrites after every gate passed. The four failures were restored with their drafts kept, and the style now waits on the operator."
trigger_phrases:
  - "changelog pilot results"
  - "changelog retrofit tooling"
  - "pilot run 2"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/059-skill-changelog-retrofit/001-tooling-and-pilot"
    last_updated_at: "2026-09-24T18:03:45Z"
    last_updated_by: "generate-context"
    recent_action: "Wrote the phase docs and goals for all sixteen phases"
    next_safe_action: "Hand the ten pilot files to the operator for style approval"
    blockers: []
    key_files:
      - "specs/sk-doc/059-skill-changelog-retrofit/goal.md"
      - "specs/sk-doc/059-skill-changelog-retrofit/001-tooling-and-pilot/acceptance-criteria.md"
      - "specs/sk-doc/059-skill-changelog-retrofit/scratch/rewrite-driver.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fb879d4c-5543-4760-8339-b0f3499f278d"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Phase 1: tooling and pilot

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-tooling-and-pilot |
| **Completed** | In progress, waiting on the operator's style approval |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A rewritten changelog now reaches the tree only after three independent gates agree it kept its facts and fits the house format. The pilot shows the gates doing their job: six of ten rewrites were kept, and the four that were not had real drops or distortions named by the fact check.

### Phase 1: tooling and pilot

The shape checker encodes sk-create-changelog's compact and expanded rules. Given the original, it also rejects changed frontmatter and any identifier or number the original never had. The rewrite brief puts fact rules above style rules. The fact-check brief asks a second GPT-6 Luna dispatch, with no write access, to list anything unsupported, dropped, distorted or padded. The driver runs one file per dispatch on two lanes, reruns every gate itself, feeds the findings back for up to three attempts in all and restores the original when a file fails every one.

Pilot run 2 covered ten files across every legacy style. It kept claude-code v1.0.0.0, cli-pi v1.4.0.0, sk-create-command v1.0.1.1, cli-devin v1.4.2.0, sk-design v2.0.0.0 and sk-git v1.6.0.0. It restored mcp-tooling v1.6.1.0, system-spec-kit v3.7.0.0, deep-improvement v1.2.0.0 and cli-hermes v1.0.0.0.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `../scratch/check_changelog_shape.py` | Created | Shape, frontmatter and new-fact checks |
| `../scratch/brief-rewrite.md` | Created | The one-file rewrite brief |
| `../scratch/brief-verify.md` | Created | The fact-check brief |
| `../scratch/rewrite-driver.cjs` | Created | Lanes, gates, retry, restore and state |
| Six pilot changelogs | Modified | Rewritten and kept |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Pilot run 1 exposed three flaws. The fact check flagged the template's fixed "nothing to do" phrases, so a retry left Upgrade Notes empty. v1.0.0.0 was treated as a major bump. Some sentences were filler. That run was stopped and its files restored. The briefs, the checker and the driver were fixed, and run 2 started clean. Run 2 used 32 GPT dispatches and no gateway dispatch, and took 217 to 2,172 seconds per file. cli-codex was faster than cli-pi on every file.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| One file per dispatch | A single file keeps each rewrite reviewable and each failure contained |
| A second model checks facts | The rewriting model cannot be the only judge of what it dropped |
| Restore on the second failure | A kept legacy changelog is better than a kept wrong one |
| Overwrite despite sk-create-changelog's never-overwrite rule | The operator asked for the rewrite, and the rule governs creation |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Checker calibration | PASS: exemplar exit 0, 25 of 25 compliant files pass |
| Six pilot passes rerun | PASS: checker exit 0, 0 HVR hard blockers, frontmatter identical |
| Four pilot failures | PASS: `git diff` empty for each, four drafts in `../scratch/failed/` |
| Dispatch routing | PASS: 32 GPT, 0 gateway |
| Orchestrator read of all ten | Pending |
| Operator style approval | Pending |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Dense files fail more often.** Four of ten pilot files failed after two attempts. A third attempt, or a retry with `--retry-failed`, is the open question in `spec.md`.
2. **Saved originals and drafts are hidden files.** Their names start with a dot, so `ls -A` is needed to see them.
3. **cli-pi is slow on this task.** Its two failures each ran past 2,000 seconds.
<!-- /ANCHOR:limitations -->
