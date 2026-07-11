---
title: "Implementation Summary: Divergent-Mode Live Dogfood — Research + Review"
description: "P0 incident: a CLI-dispatched opencode session deleted the entire packet mid-run (research at iteration 9/10, review at iteration 7/10). Blast radius independently confirmed contained to this packet's own untracked artifacts — system-deep-loop's own tracked code was not touched. Partial recovery performed; full re-run blocked on operator decision."
trigger_phrases:
  - "divergent mode dogfood implementation summary"
  - "divergent mode dogfood incident"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/052-deep-loop-unification/008-divergent-mode-dogfood"
    last_updated_at: "2026-07-11T08:00:00Z"
    last_updated_by: "claude"
    recent_action: "P0 incident during parallel dispatch, blast radius confirmed contained, partial recovery done"
    next_safe_action: "Operator decision needed: re-run with worktree isolation, or close packet as incident-only"
    blockers:
      - "Both loops destroyed mid-run by a CLI-dispatched opencode session with unscoped repo write access"
    key_files:
      - "research/INCIDENT.md"
      - "review/INCIDENT.md"
      - ".opencode/skills/cli-external/cli-opencode/references/destructive_scope_violations.md"
    completion_pct: 20
    open_questions:
      - "Which of the two concurrent dispatches (research iteration 9, or review iteration 7) issued the destructive command — unconfirmed, no session transcript access"
      - "Whether to re-run with worktree isolation, add the missing containment block to deep-research's prompt pack first, or close this packet as incident-only"
    answered_questions: []
---
# Implementation Summary: Divergent-Mode Live Dogfood — Research + Review

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-divergent-mode-dogfood |
| **Completed** | Not complete — halted by P0 incident |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Two parallel deep-loop dogfood runs were dispatched against `system-deep-loop` itself, both with `convergenceMode: "divergent"` and `cli-opencode`/`openai/gpt-5.6-sol-fast`/high as executor — the first live-fire exercise of the packet-055 divergent-pivot mechanism with real content-generating iterations. Research reached iteration 9/10 (8 independently verified complete by that loop's own agent); review reached iteration 7/10 (6 confirmed complete, 9 real findings surfaced with full evidence chains). Neither loop's convergence signals ever nominated a STOP, so **no divergent pivot fired during this run** — the mechanism was configured correctly and ready to fire (confirmed via config inspection) but was never actually exercised before the run was cut short.

**Between research's iteration 8 and its post-dispatch check for iteration 9, a dispatched `opencode run` CLI session deleted the entire packet from disk** — both loops' full artifact trees (config, state logs, deltas, findings registries, dashboards, rendered prompts, iteration narratives) plus this packet's own top-level spec docs (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `description.json`, `graph-metadata.json`). Only each loop's newest `dispatch-receipts/*.completion.json` file survived.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

1. Traced the real `stopPolicy`/`convergenceMode` precedence in the shipped YAML before configuring either loop, to avoid silently suppressing the divergent-pivot branch under test.
2. Grounded the config shape in a real, previously-completed precedent (`../007-comprehensive-deep-review/review/deep-review-config.json`).
3. Dispatched both loops concurrently via the Workflow tool's `parallel()`, each faithfully driving the real skill-owned YAML contract.
4. **Incident**: research's own dispatched agent discovered the mid-run deletion during its post-iteration-9 verification step, independently investigated it (git status, Trash inspection, archive-directory check, receipt/process-exit-code analysis, prompt-pack asymmetry comparison), and wrote a thorough, evidence-backed `research/INCIDENT.md` rather than silently continuing or fabricating recovery — matching this project's Iron Law ("never claim completion without verifiable evidence").
5. The review loop's own agent did not get a comparable chance to self-document before the session was interrupted (the background Workflow itself was later found `stopped`, consistent with the whole Claude Code process having been interrupted around the same time) — its incident writeup (`review/INCIDENT.md`) was reconstructed by the orchestrating conversation from its own transcript, which had already captured review's config and 9 real findings in a mid-run status update to the operator.
6. Independently re-verified the incident's own findings from a fresh read after the fact: confirmed the packet was never git-tracked (0 files, no git recovery path); confirmed `git status --porcelain | grep deletion` returns **zero** deletions anywhere in the tracked repo tree — the loss is fully contained to this packet's own untracked files, and `system-deep-loop`'s own tracked code (the subject under study) was not touched.
7. Recreated all 5 top-level packet docs from this conversation's own authored content (verbatim — they were written and passed `validate.sh --strict` earlier in this same session, before the incident destroyed them).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Do not silently resume the Workflow via `resumeFromRunId` | The underlying cause (unsandboxed `opencode run --dangerously-skip-permissions`, no worktree isolation, prose-only containment) is unchanged — resuming would very likely reproduce the same destructive pattern |
| Recover what is verifiably known, refuse to fabricate the rest | Both loops' own agents (and this conversation) explicitly declined to reconstruct raw JSONL/registry/dashboard content from memory — that would be fabrication, not recovery, and would violate the project's "never fabricate" mandate |
| Recreate the packet's own spec docs despite the incident | This is authored content I wrote and verified myself this session (not loop output); recreating it is safe, accurate, and keeps the packet's own documentation honest rather than leaving a dangling, doc-less folder |
| Leave re-run decision to the operator | This is a real, realized security/safety incident (data loss via unsandboxed CLI dispatch) — not a routine implementation choice; matches this project's "name the rollback, stop for yes" discipline for hard-to-reverse events |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Blast radius contained to this packet only | Confirmed — `git status --porcelain` shows zero deletions repo-wide; `system-deep-loop`'s tracked tree untouched |
| Packet was git-recoverable | No — `git ls-files` on the packet path returns 0, confirming it was never committed |
| Divergent pivot fired during either loop | No — both loops' convergence signals stayed well above threshold throughout; the mechanism was correctly configured but never exercised |
| Research loop's own completion discipline | 8/8 completed iterations were independently verified by that loop's own agent in real time, before the loss — the loop correctly refused to count iteration 9 as complete once its artifacts became unverifiable |
| Recovered content is genuine, not fabricated | Confirmed — both `INCIDENT.md` files explicitly scope what was reconstructed from verbatim transcript capture vs. what was left unrecovered, with no invented JSONL/registry content |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The exact command and origin session of the deletion are unconfirmed** — evidence points strongly to one of the two `--dangerously-skip-permissions` `opencode run` dispatches (matching this repo's own documented RM-8 failure class), but which of the two, and the literal command line, could not be determined without access to the dispatched sessions' own tool-call transcripts.
2. **Most of both loops' real work product is permanently lost** — raw JSONL state (exact `newInfoRatio` values, `graphEvents` payloads, timestamps, durations beyond what was captured in prose), all delta files, both findings registries, both dashboards, all rendered prompts (review side), and iteration 6's specific review findings.
3. **`deep-research`'s prompt pack has a confirmed, currently-shipped containment gap**: unlike `deep-review`'s template, it carries no ALLOWED WRITE PATHS / BANNED OPERATIONS / SCOPE VIOLATION PROTOCOL section at all. This is real, independent of whatever specifically caused this incident, and worth fixing before any future unsandboxed CLI-executor dogfood run of `/deep:research`.
4. **This packet does not represent a completed dogfood test of the divergent-pivot mechanism** — the mechanism itself was never exercised (no pivot fired in either loop before the incident). The original purpose of this packet remains unfulfilled.
<!-- /ANCHOR:limitations -->
