---
title: "Implementation Summary"
description: "One documentation gap closed, one guard added, and four restraint candidates declined with reasons. The audit's own wrong cut is recorded because only running the code caught it."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-communication/006-sk-communication-clarity/016-code-standards-alignment"
    last_updated_at: "2026-09-15T20:39:52Z"
    last_updated_by: "claude-conductor"
    recent_action: "Audited the added code, closed a TSDoc gap, reverted a wrong cut and guarded the failure it exposed"
    next_safe_action: "None"
    blockers: []
    key_files:
      - ".opencode/skills/sk-communication/cli-communication-projection/src/fidelity/semantics.ts"
      - ".opencode/skills/sk-communication/benchmark/reply-harness/score.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "016-code-standards-alignment"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Phase** | 16 of 16 |
| **Status** | Complete |
| **Completed** | 2026-09-15 |
| **Branch** | `skilled/v4.0.0.0` |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

An audit of every line this program added, against the OpenCode surface's TypeScript standards and
against the restraint rule. Three changes shipped out of six candidates.

**The documentation gap.** Four of the five exported functions in the projection engine's semantics
module carry TSDoc. The one this program added did not. It now does, in the format the surface
standard shows, and it names the seam with the claim check so a reader knows which of the two owns
a dropped sentence.

**The guard.** A case that keys on retention without naming the items it expects would have fallen
through to an empty expectation and scored a vacuous pass. The scorer now refuses the run. This was
found by attempting a cut rather than by reading.

**The comment.** The retention predicate's second input path is there because every dimension
mechanic runs against every case, not only the case that keys on it. That was not written down, and
its absence is what made the wrong cut look right.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `src/fidelity/semantics.ts` | Modified | TSDoc on the added exported function |
| `benchmark/reply-harness/score.mjs` | Modified | A guard against a vacuous retention pass, and a comment on why the second input path exists |
| `benchmark/reply-harness/README.md` | Modified | The same reason, stated for a reader of the harness |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The code was read before the standards, because starting from a checklist finds what the checklist
names and stops. Reading the file first surfaced the TSDoc gap, since the file's own convention is
the first standard that applies to it.

The audit then made a mistake worth recording. The restraint rule refuses a second code path for a
constraint the environment does not have, and the retention predicate had one. A check of which
case keys on which predicate said only one case could reach it, and that case named its items, so
the path looked dead. It was cut.

Scoring then failed on all six frozen sides. Dimension scoring runs every mechanic against every
case, so the other six cases reach that path and take exactly the branch that had been removed. The
branch was restored, the reason was written at the branch, and the near miss became the guard.

The lesson is the one the evidence rule already states. A reachability claim read off one map is an
inference, and the run is what confirms it.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Candidate | Outcome | Clause |
|-----------|---------|--------|
| Two helpers repeat the stem-match and content-word predicates already inside `claimSurvives` | Declined, left duplicated | Abstraction: one instance is a case, two a coincidence, three a pattern. Abstracting at two buys a wrong abstraction more often than it saves a duplication |
| `--prompts` on the scorer is an option, and an option is a permanent branch | Declined, kept | Options: an option earns existence when two real callers need different values today. Scoring a fresh run wants the case-set hash check, rescoring a frozen set cannot have it |
| The `?? ''` guards after a regex match look defensive | Declined, kept | Defensive checks: the package sets `noUncheckedIndexedAccess`, so the type system requires them. They are not guarding a ghost |
| A nine-line rationale comment for two allowlist entries | Declined, kept | The file's existing entries carry comments of the same shape, naming which id was dispatch-tested and which was list-verified only |
| The retention predicate's second input path | Attempted, reverted | Fallbacks names an untested branch that will rot. The branch is neither untested nor unreachable, which the run proved |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm run check` in the projection package | 83 files, 465 tests, exit 0 |
| Six frozen benchmark sides rescored | Every weighted mean and every blocking row identical to the committed result |
| The new guard, run against a case set with the field removed | Printed the case id and the reason, exited 1, wrote no result file |
| The same six rescores | All pass case validation first, so the guard does not fire falsely |
| `validate.sh --strict` | `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The audit covered what this program added.** Code from other sessions in the same files was
   read for context and left alone.
2. **The two duplicated predicates stay duplicated.** That is the restraint rule's own instruction
   at two instances. A third copy would change the answer, and nothing records that threshold in
   the code itself.
<!-- /ANCHOR:limitations -->

---


