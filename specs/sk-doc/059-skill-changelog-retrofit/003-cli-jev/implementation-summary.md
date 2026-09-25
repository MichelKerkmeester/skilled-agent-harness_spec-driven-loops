---
title: "Implementation Summary: Phase 3: cli-jev changelogs"
description: "All five cli-jev changelogs now read in the compact format and keep every fact their originals recorded. Each passed the current fact check and has a clean Opus review of its current text."
trigger_phrases:
  - "cli-jev changelog rewrite status"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/059-skill-changelog-retrofit/003-cli-jev"
    last_updated_at: "2026-09-25T17:07:01Z"
    last_updated_by: "generate-context"
    recent_action: "Committed, pushed and validated the cli-jev rewrites"
    next_safe_action: "Continue with the parent packet's remaining phases"
    blockers: []
    key_files:
      - "specs/sk-doc/059-skill-changelog-retrofit/scratch/lists/cli-jev.txt"
      - ".skilled/skills/cli-jev/cli-usage/changelog/v1.0.1.0.md"
    session_dedup:
      fingerprint: "sha256:6ad243d38c80f9bf851bcf4be01b352d3e2460819babb392ad5230c533842f0f"
      session_id: "fb879d4c-5543-4760-8339-b0f3499f278d"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Phase 3: cli-jev changelogs

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-cli-jev |
| **Completed** | 2026-09-25 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

All five changelogs in `../scratch/lists/cli-jev.txt` now read in the sk-create-changelog compact format. Each passed the shape checker against its original, the HVR scan and the current second-model fact check, and each has a clean Opus review of its current text.

### Phase 3: cli-jev changelogs

The wave covers the hub's v0.1.0.0 and v0.2.0.0 and the `cli-usage` transport's v1.0.0.0, v1.0.1.0 and v1.0.2.0. The rewrites keep the hub's split from `cli-external-orchestration` with its `transport-axis` contract, the generation 1 activation that joins the compiled serving closure, the first transport release's eight hard rules and unconfirmed provider claims, the authenticated `official` run and the move to `cli-usage` that leaves the earlier entries as written.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| 5 changelogs under `.skilled/skills/cli-jev/` | Rewritten | Current format, facts kept |
| `../scratch/state.jsonl` | Appended | One record per attempt, re-check and orchestrator overturn |
| `../scratch/opus-review.jsonl` | Appended | One clean review record per file |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

All five files passed in the main run. cli-codex kept v0.1.0.0 at its first attempt and v0.2.0.0 at its second, cli-pi kept cli-usage v1.0.0.0 and v1.0.2.0 at their first, and cli-devin kept cli-usage v1.0.1.0 at its third.

Review and the stricter re-check then sent every file back at least once:

- Review found that v0.1.0.0 had lost five facts, and a cli-devin retry restored them: the transport's standing as the only `packetKind: "transport"` mode, the `transport-axis` contract the gate enforces, the split between hub and transport resolution, the four directive markers and the packet's move with its files.
- v0.2.0.0 lost the manifest's generation and policy-hash pin, the epoch 1 flip, the one transport mode and the then-five serving hubs. Three GPT retries on cli-pi failed, and cli-devin kept the next draft. Review sent it back twice, once for merging the hub-level routing corpus with the seven-case canary corpus and once for calling it a judgment corpus.
- cli-usage v1.0.0.0 lost that it is the hub's first transport mode, that Jev reads state, two counts and the source-derived gateway conclusion. cli-usage v1.0.2.0 lost that the earlier entries are preserved as written. One retry kept each.
- cli-usage v1.0.1.0 lost its one-judgment-per-type count. Review then sent it back three times: for presenting a source-read distinction as observed and adding "earlier" to a message that is current, for widening the unconfirmed items to every claim about three providers, and for renaming the SKIP rows, dropping that the key lives only in the credential store and shortening the list of reconciled truth surfaces. One relayed fix carried wording the original never uses ("rather than adding it to the CLI"). After a failed retry, an orchestrator record withdrew it and cut a reader benefit the original does not claim. The shape checker also failed two attempts on a code span its original wraps across lines, and `cea81fc2e4` fixed that false positive.

Each retry resumed from its kept draft with its findings. While the GPT plan was at its usage limit, the final drafts of v0.2.0.0 (cli-opencode) and cli-usage v1.0.1.0 (cli-pi) came through the LLM Gateway, as D3 allows. The brief now forbids words such as still or earlier that change a fact's timing, glosses of terms the original does not explain and bullets that restate their bold lead.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reuse the phase 001 tooling | The pilot calibrated it, and later fixes only made its gates stricter |
| Review every kept file with Opus before the commit | Review sent three of the five files back for losses the fact check had passed |
| Settle conflicting findings with an orchestrator record | A retry given two findings that pull against each other rewrites the same sentence back and forth |
| Resume every retry from the kept draft | A fresh start trades old findings for new ones instead of converging |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Target list | PASS: `wc -l < ../scratch/lists/cli-jev.txt` counts 5 files |
| Clean start | PASS: each saved original in `../scratch/orig/` matches its file at `HEAD` byte for byte |
| Final state | PASS: the latest `state.jsonl` record of every file is `pass` under the current fact check |
| Gates | PASS: `wave-verify.cjs` reports 5 kept, 0 failed, 0 problems |
| Opus review | PASS: all 5 files have a clean review of their current text |
| Commit | PASS: `69e83c1709` holds the five rewrites and is on `origin/main` |
| Routing and mirrors | PASS: `compiled-route-guard.cjs` and all nine `sync-*.cjs --check` runs exit 0 after the commit |
| Phase validation | PASS: `validate.sh --strict` reports `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The fact check and the review are two models' readings.** Neither found a loss in the current text, but a third reader could still weigh a paraphrase differently.
2. **Two final drafts came through the LLM Gateway.** Its text-only route has no tools, so those drafts had no self-check before the driver's gates. Both passed the same gates and review as the rest.
<!-- /ANCHOR:limitations -->
