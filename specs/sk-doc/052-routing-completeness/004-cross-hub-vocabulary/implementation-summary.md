---
title: "Implementation Summary: Cross-hub vocabulary"
description: "Three bare tokens let the code hub swallow the documentation hub's entire purpose, and a run-time override inserted routeless entries at rank one. Both were fixed against each losing hub's own written boundary, and the phase then recorded plainly what keyword ownership cannot reach."
trigger_phrases:
  - "cross hub vocabulary summary"
  - "keyword collision fix"
  - "bare token swallowing"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/052-routing-completeness/004-cross-hub-vocabulary"
    last_updated_at: "2026-09-02T18:00:00Z"
    last_updated_by: "phase-4-cross-hub-vocabulary"
    recent_action: "Authored the phase impl-summary from packet docs and git"
    next_safe_action: "Update the three acceptance criteria rows, which still read Unmet"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/graph-metadata.json"
      - ".opencode/skills/sk-doc/hub-router.json"
      - ".opencode/skills/cli-external-orchestration/hub-router.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-02-052-004-cross-hub-vocabulary"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Findings 12 to 15 remain Planned against this phase in the register"
      - "The three acceptance criteria rows still read Unmet although the work shipped"
    answered_questions:
      - "Vocabulary work cannot move Gate B, because 94 of 180 prompts match no declared word"
      - "A phrase declared in stage one with no stage-two class lands on the hub and drops"
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
| **Packet** | sk-doc/052-routing-completeness/004-cross-hub-vocabulary |
| **Level** | 3 |
| **Delivery** | Shipped. The parent goal LOG records this phase Done |
| **Date** | 2026-09-02 (git author dates of `f8c2595ce0`, `461ef9261f`, `4a5de9e52b` and `08eb67a0de`) |
| **Register findings** | 16, 17 and 18 read Fixed. 12, 13, 14 and 15 remain Planned |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase was scoped believing that vocabulary collision was the main obstacle to routing.
Gate B proved that half right, and the honest half is the more useful one. The collisions are
real and three of them are now fixed. They are also not what is holding the number down,
because 94 of 180 realistic prompts match no declared word in any hub in any form.

Commit `4a5de9e52b` re-scoped the phase to match, on the same day the measurement landed.

### The code hub was swallowing the documentation hub

The code hub declared `skill`, `agent` and `command` as bare single words, meaning code
written inside one of those. Those tokens also matched every request to create one, which is
a different hub's entire purpose. Asking to scaffold a new skill returned the code hub at
`0.84` with the documentation hub absent from the results altogether.

Commit `f8c2595ce0` qualified all three to what they meant. Measured before and after:

| Phrasing | Before | After |
|---|---|---|
| Documentation hub, 48 realistic phrasings | 21 reached the right mode | Measured again after the change, with no owned prompt lost |
| `slash command` | Floor value under the wrong hub | `0.69` under the right hub |
| `parent skill hub` | `0.48` | `0.77` |
| Code hub own prompts on typescript, python, shell and opencode | Unchanged scores | Unchanged scores |
| The one code-hub prompt legitimately using a bare token | Lower | Higher, because a qualified match beats an incidental one |

### Signals that reached a hub and then dropped

A sweep of all 84 declared hub signals found five that reached the hub and resolved to
nothing. Stage one and stage two draw from different files, so a phrase declared in one and
absent from the other lands the request on the hub and then drops it, which reads as a
routing success everywhere except at the point of use. Three of the five were introduced by
this session's own vocabulary pass, which is the same union-rule mistake the session had been
finding elsewhere. Commit `461ef9261f` gave four of them a stage-two class.

### The executor hub had no leftover data at all

The brief assumed duplicate uncompiled entries sat in a data file. They did not. Bare
executor names were synthesized at run time by a deliberate, tested override in
`executor-delegation.ts` that inserted them at rank one carrying no compiled route, which
contradicted the hub doctrine beside it. Commit `08eb67a0de` made the override lift the hub
instead, re-captured every gold label, and reported the accuracy metrics coming out
byte-identical to the committed baseline.

That commit records **Gate B moving from 8 to 21 of 180** and **Gate A from 234 to 328 of
444**. Its own message says to read the Gate B move as one mechanism removed rather than
routing improved.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-code/graph-metadata.json` | Modified (`f8c2595ce0`) | The three bare tokens qualified to the code sense they meant |
| `.opencode/skills/sk-doc/graph-metadata.json` | Modified (`f8c2595ce0`, 21 lines) | The documentation hub given the phrasings people use rather than the labels it had |
| `.opencode/skills/sk-doc/hub-router.json` | Modified (`461ef9261f`, `08eb67a0de`) | Stage-two classes for phrases that reached the hub and dropped |
| `.opencode/skills/cli-external-orchestration/hub-router.json` | Modified (`08eb67a0de`, 47 lines) | Executor routing rebuilt around the compiled route |
| `.opencode/skills/cli-external-orchestration/mode-registry.json` | Modified (`08eb67a0de`) | Mode declarations aligned with the router |
| `.../mcp-server/lib/scorer/executor-delegation.ts` | Modified (`08eb67a0de`) | The override lifts the hub instead of inserting a routeless rank-one entry |
| `.../scripts/routing-accuracy/holdout-prompts.jsonl` and `scorer-eval-baseline.json` | Modified (`08eb67a0de`) | Gold labels re-captured, accuracy metrics byte-identical to baseline |
| `.../013-live-activation/activation/*/manifest.json` | Modified (`f8c2595ce0`, `461ef9261f`, `08eb67a0de`) | Compiled-route manifests regenerated in the same commit as each routing edit |
| `004-cross-hub-vocabulary/spec.md` | Modified (`4a5de9e52b`, 42 lines) | Phase re-scoped after the Gate B measurement invalidated its premise |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every collision was decided by the losing hub's own written boundary rather than by
preference. One attempted fix was reverted because it cost the owning hub a signal and moved
nothing on the corpus, and that outcome stands as a recorded finding rather than being
quietly dropped.

Regression control ran across three suites: the 444 declared signals, the 180 realistic
prompts, and 224 controls on the five hubs outside the measured scope. No hub lost a prompt
it owned. Two real regressions surfaced mid-flight from the canary fixtures and were
reverted before the commit landed.

The canary's pinned digests were refreshed in the same commit as the hub change, which is
what the canary's own comment asks for. Digests were recomputed from the files rather than
copied out of the failure text, and restoring a stale digest still fails, so the tripwire is
intact rather than disarmed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Only vocabulary-shaped collisions are in scope | Prompts that match no declared word cannot be reached by keyword ownership, and 94 of 180 rows are in that state |
| Both hubs are re-measured after any change, and neither may lose a prompt it owned | A vocabulary fix that helps one hub by taking rows from another is not a fix |
| Duplicate entries under bare executor names are removed, not reweighted | Reweighting would leave a routeless entry competing on rank. The run-time override that created them was changed instead |
| One attempted fix was reverted and recorded | It cost the owning hub a signal and moved nothing measurable. Recording a reverted attempt is cheaper than someone retrying it |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Every check below was run and its output read.

| Check | Result |
|-------|--------|
| Before and after measurement of both hubs' own prompt sets | No row moved away from its owner. This is what AC-002 asks for |
| Three-suite regression control | 444 declared signals, 180 realistic prompts and 224 out-of-scope controls, with no hub losing a prompt it owned |
| Canary fixtures during the change | Two real regressions caught mid-flight and reverted before the commit |
| Canary digest re-pinning | Recomputed from the files, and restoring a stale digest still fails, so the tripwire still works |
| Compiled-route manifest freshness | `.../013-live-activation/activation/*/manifest.json` regenerated in the same commit as every routing edit. This is what AC-003 asks for |
| Scorer accuracy after the override change | Metrics byte-identical to the committed baseline, with gold labels re-captured |
| Gate A re-measurement | 234 to 328 of 444, recorded in `08eb67a0de` |
| Gate B re-measurement | 8 to 21 of 180, recorded in `08eb67a0de` |
| `validate.sh specs/sk-doc/052-routing-completeness --strict --recursive` | PASS for this folder, Errors 0 |
| `hvr_scan.py` on this document | 0 hard blockers |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

**The three acceptance criteria rows still read Unmet.** AC-001, AC-002 and AC-003 in
`acceptance-criteria.md` were written before the fixes landed, and the work each one names
shipped in `08eb67a0de`. The rows are stale rather than the work being incomplete, and they
are left as written here because updating them belongs to whoever re-runs the gates.

**Findings 12 to 15 remain Planned in the register.** The duplicate-entry finding is
materially closed by the override change, but the register was not revised, and findings 13,
14 and 15 name collisions that were not attempted here.

**The collision is wider than the five measured hubs.** A hub outside that set wins fourteen
rows, which finding 13 records. Nothing in this phase touched it.

**None of this moves the number that matters most.** Gate B's largest bucket is 94 rows that
contain none of the declared words in any form. Keyword ownership cannot reach them, and the
lane that could is deliberately off under parent decision D2.
**The phase `spec.md` still reads Draft.** Its scaffold was never filled in, and the durable
content of this phase lives in `goal.md`, `acceptance-criteria.md` and the research documents
instead. This summary therefore carries no Status row, since asserting one here would
contradict `spec.md` and would claim a closure the acceptance criteria have not reached.
<!-- /ANCHOR:limitations -->
