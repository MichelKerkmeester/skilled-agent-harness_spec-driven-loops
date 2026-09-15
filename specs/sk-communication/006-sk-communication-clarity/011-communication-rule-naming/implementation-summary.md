---
title: "Implementation Summary"
description: "The two unprefixed reply rules took the communication prefix, every live reference followed, and the frozen reply benchmark stayed valid because a renamed rule is one item under either name."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-communication/006-sk-communication-clarity/011-communication-rule-naming"
    last_updated_at: "2026-09-15T18:05:03Z"
    last_updated_by: "claude-conductor"
    recent_action: "Renamed both reply rules, repointed every live reference, taught the benchmark the alias"
    next_safe_action: "None"
    blockers: []
    key_files:
      - "repo-rules/communication-handoff-and-questions.md"
      - "repo-rules/communication-presenting-decisions.md"
      - "REPO RULES.md"
      - ".opencode/skills/sk-communication/benchmark/reply-harness/score.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "011-communication-rule-naming"
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
| **Phase** | 11 of 11 |
| **Status** | Complete |
| **Completed** | 2026-09-15 |
| **Branch** | `skilled/v4.0.0.0` |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The four rules that fire on a reply rather than on a write now share one name shape. Two already
carried it. `repo-rules/handoff-and-questions.md` became
`repo-rules/communication-handoff-and-questions.md` and `repo-rules/presenting-decisions.md` became
`repo-rules/communication-presenting-decisions.md`, each with its frontmatter title and H1 rewritten
to match and its version bumped, on the pattern phase 003 set when the sentence half became
`communication-prose.md`.

Seven live reference sites followed: the sentence in `AGENTS.md` section 8 that names all four
reply rules, two trigger rows and two index rows plus the fourth-widening paragraph in
`REPO RULES.md`, the inbound link in `repo-rules/communication.md`, the link between the two
renamed rules, and the misread table in the rule-authoring mode's
`references/creation-standards.md`. The v4 release notes line naming both rules followed too.

The reply benchmark needed a real change rather than a rename. Its coverage case names every rule
file by filename, and the frozen replies from before this phase name the old ones. An entry in that
case is now either a name or a list of alternative names, and `score.mjs` counts one item as
present when any of its names appears. A rule renamed between two conditions is therefore one item
on both sides, and every frozen reply set stays scorable.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `repo-rules/communication-handoff-and-questions.md` | Renamed | Takes the prefix; title, H1, version and one cross-link updated |
| `repo-rules/communication-presenting-decisions.md` | Renamed | Takes the prefix; title, H1 and version updated |
| `repo-rules/communication.md` | Modified | Its inbound link to the decision rule |
| `AGENTS.md` | Modified | The one sentence naming the four reply rules |
| `REPO RULES.md` | Modified | Two trigger rows, two index rows, one scope paragraph |
| `sk-create-repo-rule/references/creation-standards.md` | Modified | Two rows of the misread table |
| `benchmark/reply-harness/cases.json` | Modified | Alternative names on the coverage case |
| `benchmark/reply-harness/score.mjs` | Modified | An expected item may carry alternative names |
| `benchmark/reply-harness/README.md` | Modified | Records why |
| Six benchmark result files and four comparisons | Regenerated | Rescored under the alias predicate, identical numbers |
| Parent `spec.md` | Modified | Status, phase map repair, the phase 11 row |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The rename itself is two `git mv` calls and seven exact string replacements, each written to fail
loudly if the text was not where it was expected. What took the work was proving the sweep was
complete, because a dead rule link fails silently: a rule that never loads looks exactly like a
rule that loaded and did not apply.

Completeness was proved two ways. The corpus checker resolves every link inside the rule corpus and
reported 9 of 9 with its link count unchanged at 32. Separately, every tracked file outside
`specs/` was scanned for both old slugs and returned nothing. A crawl was also dispatched to
DeepSeek V4.1 Flash Max through `cli-devin` as an independent lens.

Spec archives were deliberately left alone. Research logs, run artifacts, iteration files and
containment snapshots record what was true when they were written, the same call the Gate 3 letter
merge made about captured transcripts.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The title and H1 follow the filename | Phase 003 set the pattern. A file whose title disagrees with its name gives a reader two answers to one question |
| Archives keep the old names | They record what was true when written. Rewriting them would misrepresent a run |
| An expected benchmark item may carry alternative names | The alternative was to regenerate every frozen reply, which would discard the measurement the program's conclusions rest on |
| Trigger phrases were not touched | They key on what a reader types, not on a filename. The trigger index does not carry these paths either, which was checked rather than assumed |
| The version got a minor bump on both | A rename changes how every consumer addresses the file, which is more than a patch |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `check-repo-rules.cjs` | `RESULT: PASSED (9/9 checks)`, files 12, phrases 228 with 0 collisions, links 32 all resolve, max 242 lines against the 250 ceiling |
| Tracked scan outside `specs/` for both old slugs | No hit |
| `git diff -M` on the two renamed files | Both R100. The content diff carries only title, H1, version and one cross-link |
| Six benchmark sides rescored | Every weighted mean and every blocking row identical to the committed result. The only difference is the alias shape recorded in the coverage row's detail |
| Four benchmark comparisons regenerated | 0.6758 to 0.7692, 0.7333 to 0.7508, 0.6758 to 0.7417 and 0.7333 to 0.8292, unchanged |
| Six fleet synchronizers | Gate-1 pointers, runtime mirrors, hook registrations, leaf manifests, skill root metadata and compiled routes all report no drift |
| `validate.sh --strict` | `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The after condition's rule set moved on.** The benchmark's frozen after-prompts were built from
   the working tree before this rename, so regenerating them now produces different prompt text.
   The frozen results stay pinned to the commit that produced them, and the case-set hash guard from
   phase 005 will refuse to score old prompts against the edited case file, which is the guard doing
   its job rather than a fault.
2. **One reference class is left by design.** Spec archives under `specs/` still name the old paths.
   They are historical records, and the scope statement says so.
<!-- /ANCHOR:limitations -->

---


