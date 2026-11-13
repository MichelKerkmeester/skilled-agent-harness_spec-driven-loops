---
title: "Decision Record: Phase 15: pi-mode-and-descendant-walk"
description: "The decline of the descendant walk in prepare, with the live run that shows the worker it targets is out of the walk's reach."
trigger_phrases:
  - "descendant walk decline"
  - "pi mode and descendant walk decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/015-pi-mode-and-descendant-walk"
    last_updated_at: "2026-11-13T12:20:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Recorded the rank 14 decline as ADR-002"
    next_safe_action: "None, the phase is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "orchestrator-015-pi-mode-and-descendant-walk"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Phase 15: pi-mode-and-descendant-walk

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

ADR-001 is reserved for a decline of the Pi mode carry. The confirmation in `scratch/confirm-pi-mode.txt` ended with `rank 13: build`, so no ADR-001 was written.

<!-- ANCHOR:adr-002 -->
### ADR-002: `prepare` does not walk the descendants of the runtime

#### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-13 |
| **Deciders** | Operator (Michel Kerkmeester), who accepted the decline on 2026-11-13 (`spec.md`, Open Questions) |

#### Context

`prepare` refuses a hop only for a live shell that is a direct child of the runtime (`.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:270-312`, the direct-child test at line 278). Rank 14 of the research proposed a walk over every descendant of the runtime instead, so that a backgrounded worker would stop the hop.

The live run of 2026-11-13 tested that target. The sender started a worker with `nohup ... &` and then ran `prepare`. When `prepare` exited 0, the worker's parent pid was 1 (`../scratch/live-hops-claude-2026-11-13/10-background-worker-orphaned/summary.txt`, line 12):

```text
2026-11-13T08:35:33Z worker now: 25973     1 node -e const fs=require('fs');setInterval(()=>fs.appendFileSync('wo
```

The worker had left the runtime's process tree before the check ran. A walk that starts at the runtime pid never reaches it.

#### Decision

**Declined.** `prepare` keeps the direct shell-child check as it is, and no descendant walk is built.

A walk would still catch three cases, and two of them are already covered:

- A shell below a live non-shell child of the runtime, such as a `node` script that runs `sh -c` and waits. This case stays uncovered.
- A worker whose tool shell is still alive. The direct shell check already refuses that shell.
- A Claude background task. The Stop hook already defers while `payload.background_tasks` is non-empty (`claude/stop-arm.mjs:120-121`).

A walk that matched every program, not only shells, would refuse every hop. A live Claude runtime keeps `node .skilled/bin/mcp-code-mode-launcher.cjs` and `caffeinate -i -t 300` as direct children (`spec.md`, Measured Behavior), and both would count as running work.

The worker a session knows it started is covered another way: phase `009-nudge-note-lines` put a `Running workers:` line in the hand-over note, so the receiver reads what the sender left running.

#### Alternatives Considered

| Option | Pros | Cons |
|--------|------|------|
| **Decline the walk** | No code change, no new false refusal | A shell below a non-shell child stays unseen |
| Walk shells at any depth | Catches the shell below a non-shell child | Misses the orphaned worker it was proposed for, at the cost of a medium to large change to the running work check |
| Walk every program at any depth | Sees every live descendant | Refuses every hop, because the MCP launcher and `caffeinate` are always there |

**Why this one**: the walk cannot see the worker it was proposed for, and the one case it adds is narrow.

#### Consequences

- The running work check in `bin/session-relaunch.cjs` lines 270-312 is unchanged by this phase.
- A shell below a live non-shell child of the runtime does not stop a hop. The note's `Running workers:` line is the cover when the session started that work itself.
- The operator can ask for the walk later. It then becomes its own phase, and this ADR is superseded by the record of that choice.

#### Implementation

**What changes**: nothing in code. This record is the whole outcome of rank 14.

**How to roll back**: delete this ADR and plan the walk as a new phase.
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.
<!-- /ANCHOR:operator-answers-verbatim -->

---
