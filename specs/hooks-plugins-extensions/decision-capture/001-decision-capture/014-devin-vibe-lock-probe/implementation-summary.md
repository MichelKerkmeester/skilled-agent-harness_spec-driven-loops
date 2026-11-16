---
title: "Implementation Summary"
description: "A Devin or Vibe save now reads its own session when another is open in the same project, and a Devin save gets its queued answers even though Devin no longer writes transcript files."
trigger_phrases:
  - "devin vibe lock probe implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/decision-capture/001-decision-capture/014-devin-vibe-lock-probe"
    last_updated_at: "2026-11-16T18:43:00Z"
    last_updated_by: "generate-context"
    recent_action: "Built and live-probed lock-based session choice"
    next_safe_action: "Commit in worktree 436, merge origin/main, rebuild the trigger index and push to main"
    packet_purpose: "Purpose: A save on Devin or Vibe reads its own session, and a Devin save always gets the answers its hook queued."
    blockers: []
    key_files:
      - ".skilled/hooks/decision-capture/bin/sweep-devin.mjs"
      - ".skilled/hooks/decision-capture/bin/sweep-vibe.mjs"
    session_dedup:
      fingerprint: "sha256:0003aeae9f12986aa87f30b31e374ac6e8f0063495524f4336d003c30f898b3c"
      session_id: "scaffold-014-devin-vibe-lock-probe"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "cbc62a39-7ca8-4b5a-989f-a86fdea260ea"
      workspace: "/Users/michelkerkmeester/worktrees/public/436-devin-vibe-lock-probe"
      savedAt: "2026-11-16T18:43:00Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
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
| **Spec Folder** | 014-devin-vibe-lock-probe |
| **Completed** | 2026-11-16 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A Devin or Vibe save now reads its own session when another session of the same runtime is open in the project. A Devin save also gets the answers its live hook queued, where before it failed on every session since Devin stopped writing transcript files.

### Phase 14: devin-vibe-lock-probe

Neither runtime names the calling session in a command's environment, but each keeps a lock per live session that records the process holding it. Both sweeps now walk their own process ancestry with one `ps` call and prefer a session whose lock an ancestor holds, provided it ran in this project. Devin keeps many stale locks whose process ids were reused, so that project check, plus taking the newest of the matches, keeps a stray lock from winning. With no match the sweeps take the newest session, as before. When the chosen Devin session has no transcript, the sweep prints that session's queued pending answers with `transcript_missing: true` and exits 0.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/decision-capture/bin/sweep-devin.mjs` | Modified | Lock choice and the missing-transcript fallback |
| `.skilled/hooks/decision-capture/bin/sweep-vibe.mjs` | Modified | Lease choice |
| `.skilled/hooks/decision-capture/bin/sweep-devin.test.mjs` | Modified | Locked-session and missing-transcript cases |
| `.skilled/hooks/decision-capture/bin/sweep-vibe.test.mjs` | Modified | Leased-session case |
| `.skilled/hooks/decision-capture/README.md`, `bin/README.md` | Modified | How the two sweeps pick a session |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A first probe ran sessions A and B at once in a scratch project for each runtime, and A's command recorded its process ancestry and every live lock. Three briefs with literal edits went to gpt-6-luna at xhigh on the fast tier through cli-codex, per D6. The Codex sandbox blocks `ps`, so the workers could not run the lock tests. Each diff was read and every test run outside the sandbox, on the new and the old file. A second probe seeded one pending answer for each of A and B while A's command slept, then ran the old and the new sweep inside A. Devin's trusted-workspace list got each scratch folder for its run and was restored to its backup after it.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Prefer the caller's session, never refuse | A Devin agent cannot learn its own id to pass one in, so a refusal would capture nothing |
| A matched session must have run in this project | A stale lock with a reused process id could otherwise name a session from elsewhere |
| Print the queue when a Devin transcript is missing | The live hook already holds the answers, and the save only needs to see them |
| Leave a `sessions.db` reader for later | The operator chose the fallback now and the reader after a schema probe |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Devin lock probe | A's command descends from `devin` 98661, and the only live lock holding 98661 is session A, `glaze-marble`. B held `hallowed-limit` under 10112 |
| Vibe lease probe | A's command descends from `vibe-app-server` 98631, and the only lease holding 98631 is session A. B's lease held 10196 |
| Seeded Vibe probe | The old sweep read session B, the new one session A |
| Seeded Devin probe | The old sweep exited with `ENOENT` for session A's missing transcript. The new one printed A's queued answer with `transcript_missing: true` |
| New tests on the old files | Devin fails 2, Vibe fails 1 |
| Decision-capture node suites, lib, bin, claude and vibe | PASS: 143 of 143 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The Devin sweep recovers nothing the live hook missed.** Devin keeps messages in `sessions.db`, which the sweep does not read yet. Correction from child 015: Devin does write the transcript file, but only when an interactive session ends, so a save inside a live session still finds none.
2. **The seeded Devin probe did not tell the lock choice from the newest-session choice.** Session A was also the most recently active, so both picked it. The first probe shows A's lock is the only one in A's ancestry, and the Devin test covers the choice.
3. **Both probes ran headless.** Interactive Devin and Vibe were not probed. If one interactive process holds several sessions' locks, the newest matched session in the project wins.
<!-- /ANCHOR:limitations -->

---
