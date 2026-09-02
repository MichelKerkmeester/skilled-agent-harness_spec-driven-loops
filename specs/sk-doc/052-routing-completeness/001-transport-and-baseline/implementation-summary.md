---
title: "Implementation Summary: Transport and baseline"
description: "Two scorers answered the routing question and disagreed on roughly a third of prompts. This phase read the dispatch path, named the TypeScript scorer behind the advisor daemon as the one that governs automatic routing, and froze the reading rules every later number depends on."
trigger_phrases:
  - "transport baseline summary"
  - "which scorer governs routing"
  - "confidence floor 0.82"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/052-routing-completeness/001-transport-and-baseline"
    last_updated_at: "2026-09-02T18:00:00Z"
    last_updated_by: "phase-1-transport-and-baseline"
    recent_action: "Authored the phase impl-summary from packet docs and git"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files:
      - "research/transport-finding.md"
      - "AGENTS.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-02-052-001-transport-and-baseline"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "The two scorers still disagree, and reconciling them is a scoring change the parent forbids here"
    answered_questions:
      - "The advisor daemon governs automatic routing, and the Python scorer never routes"
      - "A confidence of 0.8200 is a floor rather than a score"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/052-routing-completeness/001-transport-and-baseline |
| **Level** | 3 |
| **Delivery** | Shipped. The parent goal LOG records this phase Done |
| **Date** | 2026-09-02 (git author date of `03f5db4876` and `4e66155b6c`) |
| **Register findings** | 1, 2 and 3, all reading Fixed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Two scorers answer the same routing question. A TypeScript one reached through the advisor
daemon, and a Python one invoked as a command. They disagree on roughly a third of prompts,
and the 0.8 invocation bar often falls between their two answers, so the same request routed
or did not depending on which replied. Every routing number in this packet was ambiguous
until one of them was named as the governing caller. This phase named it by reading the
dispatch path rather than by comparing outputs, then froze the two reading rules that later
phases depend on.

### The finding

`research/transport-finding.md` records the chain of three reads that settles it. The
advisor handler imports its scorer from the fusion module under the server's own scorer
library. Its only fallback is the daemon-backed command in `.opencode/bin/skill-advisor.cjs`,
which speaks the same tool surface over a socket, so it is a transport rather than a second
scorer. A search of the hook library for a Python invocation returns nothing, and the one
place the Python scorer appears outside its own directory is a validation handler that sits
off the routing path.

The Python scorer is still real and still has a caller. The repository's own Gate 2 told a
person to run it by hand when no hook brief appeared, which meant the written instruction and
the automation gave different routing for the same words. Commit `4e66155b6c` repointed that
fallback at the daemon CLI and said in the gate text why the Python scorer is not a routing
fallback. The change was verified by stopping the daemon and making one call, which
self-started it and answered from the same scorer the hook consults.

### The two frozen reading rules

**A confidence of exactly 0.8200 is a floor, not a score.** Anything the daemon surfaces at
all reports at least that value. An unrelated request to refactor an auth module returns
exactly `0.8200` with an underlying score near `0.51`. The `score` field is the
discriminator, and every later phase reads it that way.

**Rank comes from the array's own order, never from re-sorting by `score`.** The daemon
blends per-candidate command, intent and conflict bonuses into its sort key, and those
bonuses are not exposed on the record. A first attempt at the Gate A sweep re-sorted replies
by the bare `score` field, and that alone inflated the `cli-external-orchestration` resolved
count from 7 to 44 on tied scores. Reading `lib/scorer/fusion.ts` and re-deriving against
`recommendations[0]` is what caught it.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research/transport-finding.md` | Created (`03f5db4876`) | The dispatch-path read, the floor caveat and the rank rule, in one citable document |
| `AGENTS.md` | Modified (`4e66155b6c`, 2 insertions, 2 deletions) | Gate 2 manual fallback repointed from the Python scorer to the daemon CLI |
| `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md` | Created (`03f5db4876`) | Phase scaffold, authored with the rest of the packet |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The question was settled by reading code, not by running an experiment. Comparing the two
scorers' outputs would have shown that they differ, which was already known, and would not
have shown which one the runtime calls. Three reads of the dispatch chain answered that
directly, and each one is a path a reader can open.

The gate-text fix shipped separately from the finding document because it touches a
repository-wide instruction file rather than this packet. It is one line of behaviour in
`AGENTS.md`, verified live before it was written down.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The advisor daemon governs automatic routing, and the Python scorer validates only | The hook path imports the TypeScript scorer, and no live hook path invokes Python. A number measured through the Python command describes the manual path and must say so |
| A confidence of 0.82 is never reported as a score | It is the floor for anything surfaced at all. Reporting it as a pass overstates a result that has cleared nothing |
| Rank is read from the comparator, never re-derived from the score field | Re-sorting by `score` moved one hub from 7 to 44 resolved signals on tied scores alone |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Every check below was run and its output read. The three rows match AC-001, AC-002 and
AC-003 in `acceptance-criteria.md`, all of which read Met.

| Check | Result |
|-------|--------|
| `grep -rn "skill_advisor.py" .opencode/skills/system-skill-advisor/hooks/lib/` | No match, so no hook path invokes the Python scorer |
| The advisor handler's scorer import | Resolves to `lib/scorer/fusion.js`, the TypeScript scorer behind the daemon |
| `node .opencode/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"refactor the auth module"}' --format json` | Returns confidence `0.8200` with score near `0.51`, which is the floor demonstrated on an unrelated prompt |
| Read of `fusion.ts` line 749 | Command, intent and conflict adjustments are applied before rank fusion, so `score` alone is not the sort key |
| Daemon cold-start check for the Gate 2 fallback | Stopping the daemon and issuing one `skill-advisor.cjs` call self-started it and answered from the same scorer the hook uses |
| `validate.sh specs/sk-doc/052-routing-completeness --strict --recursive` | PASS for this folder, Errors 0 |
| `hvr_scan.py` on this document | 0 hard blockers |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

**The two scorers stay unreconciled.** They still disagree on roughly a third of prompts.
Reconciling them means changing a scorer, and parent decision D2 forbids that inside this
packet because it would void every number measured here. The disagreement is recorded as a
finding rather than routed around.

**The disagreement rate is carried as "roughly a third" rather than an exact figure.** That
is the number `research/transport-finding.md` states, and no row-level tally of the two
scorers against a shared corpus was produced in this phase.

**Some declared signals are single tokens rather than sentences.** The advisor's
low-information abstention path can treat those differently from a full prompt. Phase 002
measures them as they are and excludes nothing, but the effect is unquantified.
**The phase `spec.md` still reads Draft.** Its scaffold was never filled in, and the durable
content of this phase lives in `goal.md`, `acceptance-criteria.md` and the research documents
instead. This summary therefore carries no Status row, since asserting one here would
contradict `spec.md` and would claim a closure the acceptance criteria have not reached.
<!-- /ANCHOR:limitations -->
