---
title: "Implementation Summary"
description: "The router is near-optimal and the prior cost analysis measured the index instead of the payload; the real defect was silent punctuation damage from an em-dash sweep, replicated across four repositories."
trigger_phrases:
  - "repo rules router findings"
  - "gate 5 payload tokens"
  - "smart routing transfer verdict"
  - "em dash sweep damage"
  - "impl summary core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/043-repo-rules-router-audit"
    last_updated_at: "2026-08-31T20:10:00Z"
    last_updated_by: "stream-4"
    recent_action: "Measured Gate 5 payload, repaired 35 punctuation defects, generalised the load rule"
    next_safe_action: "Apply the same router repairs to the three sibling repositories"
    blockers: []
    key_files:
      - "REPO RULES.md"
      - "AGENTS.md"
      - "repo-rules/"
      - ".opencode/skills/sk-doc/sk-create-repo-rule/assets/repo-rules-router-template.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "stream-4-043-repo-rules-router-audit"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Who applies the identical router repair to Mobile CLI, Obsidian Plugin and Visual Builder?"
      - "Should the invariant check become an automated gate, and who would own it?"
    answered_questions:
      - "Is the router where context cost lives? No, and the prior analysis understated the payload by 4.7x."
      - "Does anything at runtime consume repo-rules frontmatter? No; the advisor indexes .opencode/skills only."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 043-repo-rules-router-audit |
| **Completed** | 2026-08-31 |
| **Level** | 1 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The router was asked to justify its size. It does. The audit found it near-optimal, found
the prior cost analysis correct in its conclusion but measured against the wrong unit, and
found a real defect nobody was looking for: an em-dash removal sweep had silently corrupted
two table cells and roughly thirty label-and-gloss constructions, identically, in four
repositories.

### The measurement that changes the picture

All figures are `tiktoken` `cl100k_base` token counts, not byte estimates.

| Surface | Tokens | When it loads |
|---------|--------|---------------|
| `AGENTS.md` | 10,622 | Every turn |
| `REPO RULES.md` | 1,782 | First write of a session |
| The nine rule files, total | 16,442 | One or more per firing trigger |
| Mean rule file | 1,827 | |

The prior analysis said the router is 7.4 KB loaded once against `AGENTS.md` at 51.6 KB
every turn, so cutting a quarter of the router would save about 450 tokens once. That
arithmetic reproduces exactly: a quarter of 1,782 is 445. **The conclusion is right and I
agree with it.** Cutting the router is not worth doing.

But the comparison is against the wrong unit. Gate 5 never loads the router alone; it loads
the router *and every rule file the matching rows name*. Measured against a ten-turn corpus
of realistic development actions, with row-firing judged by hand against the 37 action
clauses in section 2:

| Turn | Rows fired | Total Gate 5 load | Share of `AGENTS.md` |
|------|-----------:|------------------:|---------------------:|
| Read-only: explain how X works | 0 | 0 | 0% |
| Answer a question you are unsure about | 2 | 5,627 | 53% |
| Fix a failing test and report it | 3 | 7,876 | 74% |
| Run a migration on prod config | 3 | 7,905 | 74% |
| Wire a new mode into a parent hub | 3 | 7,940 | 75% |
| Add a new config option | 3 | 7,986 | 75% |
| Dispatch a sub-agent, then use its result | 3 | 8,811 | 83% |
| Rename a shared interface | 4 | 9,517 | 90% |
| Delete a deprecated file | 4 | 9,517 | 90% |
| Author a spec, edit rules, verify | 4 | 9,598 | 90% |

**Mean 3.2 rows fire on a writing turn, for a mean load of 8,309 tokens, which is 78% of
`AGENTS.md`.** The rule system is not a rounding error next to `AGENTS.md`; it is
comparable to it. The prior figure of 1,782 undercounts the real payload by 4.7x.

Two rules dominate. `communication.md` fires on every substantive reply and
`evidence-and-proof.md` on every turn that closes out. Together they are 4,544 tokens,
2.5x the router, effectively always-on. **This is where the cost lives, and it is
deliberate.** `sk-create-repo-rule/references/decision-tests.md` section 1 records the
decision in terms: the communication rule "survives only because its trigger was widened to
*every substantive reply*. A total move needs a total trigger, or the content goes quiet."
`communication.md` says the same in its own Fires-when block. I did not reverse a recorded
design decision on my own measurement.

### What transfers from skill smart routing, and what does not

The decisive question for each mechanism is whether a runtime consumer exists. The
repo-rules path has none: no scorer, no daemon, no compiled router. The advisor's
`SKILLS_DIR` is `.opencode/skills` only, so `repo-rules/` is never indexed, and the only
references to it anywhere in `.opencode/` are the authoring-time command YAMLs.

| Mechanism | Verdict | Reason |
|-----------|---------|--------|
| `hub-router.json` `routerSignals` and `vocabularyClasses` | **Does not transfer** | Genuinely live: read from disk on every compiled route, scoring `hits × weight` by plain substring. A JSON mirror of the trigger table would be a second match surface with no consumer, kept in sync by hand. That is the exact "two places to change" failure the router template warns against. |
| Root `ROUTER.md` `INTENT_SIGNALS` | **Already the same thing** | Its own contract module states it "never evaluates intent keywords, never scores a prompt." Shape is enforced; semantics are not. `INTENT_SIGNALS` is a routing surface only an LLM reads, which is architecturally identical to the trigger table. The trigger table is already the correct shape for its class. |
| `RESOURCE_MAP` key-set parity with `INTENT_SIGNALS` | **Already implemented, and better** | The repo-rules equivalent, trigger rows equal index rows equal rule files, is a cross-surface check against the filesystem. The `ROUTER.md` validator only compares `ROUTER.md` against itself, which is why `mcp-tooling` can ship a `MAGICPATH` mode absent from its `ROUTER.md` with nothing catching it. |
| Advisor `phraseSpecificity` | **Transfers as justification, not as code** | The scorer weights a phrase by token count: 1 token scores 0.70, 2 scores 0.88, 3 or more saturates at 1.00. Multi-word phrases are worth more precisely because they discriminate. This is independent mechanical confirmation of the brief's hard constraint: shortening a trigger row deletes the routing. The table's long rows are correct. |
| Advisor negative and anti-signals | **Does not transfer** | Signed penalties, negative phrase boosts and the route-exclusion denylist all live in TypeScript constants. A markdown table has no way to express "this term should *lower* a match." |
| Advisor lane weights, fusion, confidence bands | **Does not transfer** | All require a scorer. There is no process in this path to run one. |
| `routerPolicy.tieBreak` | **Cautionary, do not adopt** | `sk-doc`'s authored `tieBreak` array is validated for completeness and then discarded at compile time, replaced by `Object.keys(routerSignals)`, because the authored order had drifted. A hand-maintained ordering that nothing obeys is worse than none. |

The most instructive precedent is `sk-code`'s own `ROUTER.md`, which documents a `+5` phase
boost and a set of doc-only anti-signals as *deliberately absent* from its machine
projection. Those are pure LLM-follows-it-or-nothing mechanisms, and they are the closest
existing analogue to a plain-markdown trigger table. The conclusion is that the repo-rules
router is not an underbuilt version of a skill router. It is the same category of artifact,
and it is already built correctly for that category.

### What was actually wrong

An em-dash removal sweep had passed over `REPO RULES.md` and the nine rule files, leaving
zero em dashes, and left the sentences the dashes had punctuated broken.

The producer is identified, not guessed: commit `104d65f001`, "refactor(repo-rules): rename
three rules, ban the em dash, brief the next program". Its diff shows the substitution
directly, and `scratch/damage-provenance-diff.txt` holds the 311 changed lines:

```
- | 2 | An explicit, in-the-moment operator instruction | — it is the instruction |
+ | 2 | An explicit, in-the-moment operator instruction |, it is the instruction |
- | — | You now own a verification step that did not exist before |
+ |, | You now own a verification step that did not exist before |
- 1. **Match on the action you are about to take**, not the topic of the request.
+ 1. **Match on the action you are about to take** not the topic of the request.
```

The ban itself was correct policy. The sweep that enforced it replaced the character
without restoring the punctuation the character was carrying, and in one case deleted a
comma that was already there. Two cases were structural:

- `REPO RULES.md` precedence table, level 2: the "Can be overridden?" cell had been reduced
  to `, it is the instruction`. This sits in section 1 of a document that loads on the first
  write of every session, in all four repositories.
- `delegation-and-orchestration.md` posture table: a cell had been reduced to a bare comma,
  losing the meaning that the fourth job has no counterpart when working alone.

The rest were label-and-gloss constructions that lost their separator, including the
five-step escalation format in `root-cause-and-debugging.md` and the four-part close-out in
`evidence-and-proof.md`, both of which are formats an agent reproduces literally.

35 repairs were applied. All are punctuation-only except two restored cells. The house
convention was already present in the same files, a colon inside the bold label, so the
repair follows what the set already does rather than introducing a style.

### The routing change

`AGENTS.md` Gate 5 said "LOAD the one rule file it names" and "Two triggers fire, load
both." The measured mean is 3.2. Both `AGENTS.md` and the router now say that three or four
firing at once is the normal case, not an edge case. This is a faithful generalisation of an
existing instruction, not a new rule, and it corrects a document that was describing its own
behaviour inaccurately.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Baseline captured first, then measured, then repaired. Invariants were checked before any
edit and again after, using the same script, kept at `scratch/invariant-check.cjs`. The
mechanism-level reading of the three routing surfaces was delegated to a read-only agent so
the conclusions rest on the code rather than on assumption. Nothing was staged, committed,
pushed or stashed, and no file outside the four owned surfaces was touched.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Agreed with the prior analysis rather than manufacturing a disagreement.** Cutting the
  router saves 445 tokens once and would delete matching vocabulary. It is not worth doing.
  The correction is to the unit of measurement, not to the conclusion.
- **Did not delete the 1,837 tokens of `trigger_phrases` frontmatter.** It has no runtime
  consumer, which made it the obvious cut, and it is still matching vocabulary: the
  authoring-time collision check and the `trigger-phrase-collision` playbook scenario both
  read it. The hard constraint holds regardless of whether a machine is the reader.
- **Did not touch the always-on pair.** It is the largest single cost in the set and it is a
  recorded design decision with its rationale written down. Reversing it on a token count
  would be exactly the mistake `decision-tests.md` was written to prevent.
- **Kept section 3, the index.** It looked redundant against section 2 until measured: at
  392 tokens it can settle a simple question without loading a 1,827-token rule file. It is
  a cache, not a duplicate.
- **Fixed the template as well as the shipped routers.** The template was intact and still
  carries em dashes, so it is the source that would re-emit the exact defect on the next
  repository bootstrap. Repairing only the copies would have been a symptom fix.
- **Proposed the invariant checker, did not build it.** Every invariant currently holds in
  all four repositories, so nothing fails today for want of a script, and no owner for a
  `repo-rules` checker exists. The reference implementation is in `scratch/` for whoever
  adopts it.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Invariants, before and after the change, from `scratch/invariant-check.cjs`:

| Invariant | Before | After |
|-----------|--------|-------|
| Trigger rows / index rows / rule files | 9 / 9 / 9 | 9 / 9 / 9 |
| Dividers equal numbered sections | 10 of 10 files | 10 of 10 files |
| Trigger phrases, total and unique | 164 / 164 | 164 / 164 |
| Trigger phrase collisions | 0 | 0 |
| Broken links: router, rules, `AGENTS.md` | 0 / 0 / 0 | 0 / 0 / 0 |
| Markdown rows whose cell count differs from the header | 0 | 0 |

Federation-wide, verified by inspection and not assumed: all four repositories hold
trigger rows equal to index rows equal to rule files (9/9/9, 11/11/11, 9/9/9, 15/15/15),
four dividers and four numbered sections each, and zero broken links. No symlink dangles.

Negative control for the one validator error on the router template: the pre-edit file was
recovered with `git show HEAD:` into `scratch/base/` and validated separately. It reports
the identical single blocking error, `missing_required_section: overview`, proving the
error pre-dates this work. It was left unfixed as an adjacent problem.

Net size change across the ten edited documents is +166 bytes. No word of matching
vocabulary was removed; the 37 trigger-row action clauses are byte-identical.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **The row-firing judgments in the corpus are mine, not a machine's.** No scorer exists for
  this surface, so the mean of 3.2 rests on reading each action against the 37 clauses. The
  direction of the finding is robust to reasonable disagreement about individual turns; the
  exact mean is not.
- **The three sibling repositories still carry the identical defect.** Mobile CLI, Obsidian
  Plugin and Visual Builder each have the corrupted precedence cell and the ungeneralised
  load rule in their own `REPO RULES.md`. They were verified and deliberately not edited.
  The nine shared rule files are symlinked, so those repairs already reached all four.
- **The `missing_required_section: overview` error on the router template is unfixed.**
- **No automated checker was wired.** The invariants remain enforced by hand.
<!-- /ANCHOR:limitations -->

---
