---
title: "Implementation Summary"
description: "The launcher no longer kills a healthy advisor daemon after the machine sleeps, and the ten smaller gaps the phase 021 verification found are closed, each behind a test that failed first."
trigger_phrases:
  - "verification fixes implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/022-verification-fixes"
    last_updated_at: "2026-11-20T16:06:27Z"
    last_updated_by: "generate-context"
    recent_action: "Fixed the 021 verification findings test first"
    next_safe_action: "Run the commit, merge to main and push for worktree 489"
    packet_purpose: "Purpose: Each defect is fixed or pinned with a test that fails on the old source, and the docs state the shipped behavior."
    blockers: []
    key_files:
      - "acceptance-criteria.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:7c572d521632eb82a4a3d19203d0b60182f4b308f5dc87a573b92447f60f6ede"
      session_id: "scaffold-022-verification-fixes"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "0b81ad2f-04a7-4ad7-b174-0b3f9930b833"
      workspace: "/Users/michelkerkmeester/worktrees/public/489-advisor-verification-fixes"
      savedAt: "2026-11-20T16:06:27Z"
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
| **Spec Folder** | 022-verification-fixes |
| **Completed** | 2026-11-20 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A laptop that sleeps no longer costs the advisor its daemon. The launcher now notices when its own checks were suspended and gives the daemon one more check to write its heartbeat before judging it. The other ten findings from the phase 021 verification are fixed or pinned the same way, each behind a test that failed on the old source.

### Phase 22: verification-fixes

- **Watchdog after sleep** (`.skilled/bin/system-skill-advisor-launcher.cjs`): a gap above two check intervals between its own checks skips that check. A daemon silent through the next check is still reaped.
- **Early orphan** (`runtime/lib/daemon/liveness.ts`, `runtime/advisor-server.ts`): `main()` reads the launcher PID before its startup work and the parent watch compares against it.
- **Semantic lane gates** (`runtime/lib/scorer/lanes/semantic-shadow.ts`, `runtime/lib/scorer/fusion.ts`, `runtime/handlers/advisor-recommend.ts`): one helper gates the pre-embed check, the lane and the exact rerank. A live lane with incomplete coverage makes no embed call and leaves the live total. At weight 0 a stale index no longer marks the lane degraded.
- **Refresh** (`runtime/lib/skill-graph/skill-graph-db.ts`): each pass catches its own error, so a queued request still gets its pass, and a run rejects only when every pass threw.
- **Disabled hook** (`hooks/claude/user-prompt-submit.ts`): a crash in a disabled hook returns `{}`.
- **DSH boundary** (`hooks/dsh/prompt-advisor.mjs`): a session start or clean compaction drops the session's route receipt and rotates its clock, and the next turn waits for both.
- **Review follow-ups**: an independent review approved the diff with four P2 suggestions. Three are fixed test first: a pass that fails after a successful one now adds a `refresh pass failed` warning, a dimension mismatch, unavailable adapter or absent database also drops a live lane from the live total, and the launcher passes its pid to the server at spawn so even a launcher that dies while the server loads is caught. The fourth, a behavioral test of the server's startup refresh gate, is out of scope.
- **Comments, fixture and docs**: four comments now name the background refresh and the coverage gate, the shared strip fixture pins the last-marker miss with its `ideal` answer, and six catalog, reference and playbook pages state the new behavior.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| Launcher and its watchdog test | Modified | Suspension skip |
| `liveness.ts`, `advisor-server.ts` and the liveness test | Modified | Early launcher PID |
| `semantic-shadow.ts`, `fusion.ts`, `advisor-recommend.ts` and three lane test files | Modified | Agreeing lane gates |
| `skill-graph-db.ts` and the refresh test | Modified | Per-pass catch, comments |
| `user-prompt-submit.ts` and its hook test | Modified | Silent disabled crash |
| `prompt-advisor.mjs` and the DSH test | Modified | Receipt drop and turn hold |
| `tests/daemon/watcher-embedding-refresh.vitest.ts` | Created | Behavioral refresh test |
| `schema.ts`, the strip fixture, six docs | Modified | Comments, pinned case, docs |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work ran in worktree `worktrees/489-advisor-verification-fixes`, made through sk-git from main `24749648b24`. The baseline was 195 files, 2559 passed, 8 skipped. Each test was written first and run on the base source, where it failed for the reason the finding named. The source fix then made it pass. The watcher test, which covers behavior that already worked, was checked by replacing the refresh call and watching both cases fail. After a rebuild and a trusted scan, every suite ran green. An independent review then read the diff and approved it with four P2 suggestions, three of which were fixed test first before a second full run.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Skip one check after a suspension rather than require two stale reads | Two stale reads would delay every real reap by a minute; the skip only fires after the watchdog itself was asleep |
| Move the stale-telemetry assertion to the 0.05 staleness test | At weight 0 the lane is off, so the old assertion encoded the defect; the live-weight case keeps the telemetry checked |
| Pin the last-marker miss instead of changing the rule | A pasted reply holding its own `Task:` line has the same shape, so no rule can tell them apart |
| Native code, not Luna | The operator chose it for this phase; parent D2 amended |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Build, typecheck, scan | All exit 0 |
| Runtime suite | 196 files, 2570 passed, 8 skipped (baseline 195, 2559, 8) |
| Bin suite | 97 passed |
| DSH tests | 20 passed, 0 failed; DSH plugin bundle 5 passed |
| Python scorer test | `pass=123, fail=0` |
| Review | @review APPROVED, 0 P0, 0 P1, 4 P2; three fixed |
| Failing first | Watchdog 2, liveness 1, lane 3, refresh 1, hook 1, DSH 2 failed on the base source; watcher 2 failed under mutation; the review fixes' 4 new cases failed first |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Sleep tested by clock injection.** No real machine sleep was run; the watchdog tests drive its clock and timers.
2. **Pi still stores no route receipt.** Pi sends no session id, as phase 011 recorded; this phase left it out of scope.
<!-- /ANCHOR:limitations -->

---
