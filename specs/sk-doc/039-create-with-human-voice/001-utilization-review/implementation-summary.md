---
title: "Implementation Summary: Phase 1: utilization-review"
description: "What the first execution of the create-with-human-voice manual-testing playbook found, how eight newcomer prompts routed, what five fixes changed and what six findings were written up instead."
trigger_phrases:
  - "implementation"
  - "summary"
  - "template"
  - "impl summary core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/039-create-with-human-voice/001-utilization-review"
    last_updated_at: "2026-09-02T18:52:04Z"
    last_updated_by: "utilization-review"
    recent_action: "Ran the manual-testing playbook end to end and rebuilt the work after an external revert"
    next_safe_action: "Decide the six write-ups, starting with the two scoring systems in the standard"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "utilization-review-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
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
| **Spec Folder** | 001-utilization-review |
| **Status** | Complete |
| **Completed** | 2026-09-02 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The mode works. Its nine playbook scenarios all pass on first execution, and the workflow
they describe holds up against real targets. What did not hold up is the material around
the workflow: the mode's own report template emitted six hard blockers of the standard it
owns, its shipped worked example no longer matched the scanner it cites, its playbook
claimed a runnability it does not have, and four of eight things a newcomer would plausibly
type never reach it.

### Playbook Results

Nine scenarios, nine recorded outcomes, all `PASS`. Three ran exactly as written against
shipped files. Six needed an operator-supplied target the packet does not ship, so one was
constructed for each and the deviation is recorded in the row.

| ID | Target | Result | Evidence |
|---|---|---|---|
| HVT-001 | Shipped dirty fixture | PASS | `hard blockers: 6`, `deductions: -33`, `ceiling: 67/100`, exit 1. `--all` puts every finding on lines 8, 10 and 12, above the fenced block in a 19-line file. `git status --porcelain` empty. `--include-code` raises the count to 14, which is the masking control |
| HVT-002 | Constructed, two senses of `harness` | PASS | Both occurrences reported at 7:5 and 10:12. The noun sense was kept, the verb sense edited, and the re-scan still reports 7:5 with the count down from 2 to 1 |
| HVT-003 | Constructed, mechanically clean | PASS | `hard blockers: 0`, `ceiling: 99/100`, exit 0, and seven judgment findings a reader had to supply: triple headers under two H2s, a three-item enumeration, a not-just-X-but-also-Y, setup language, a false range, significance inflation and a generic positive conclusion |
| HVS-001 | Constructed, quoted material in prose | PASS | Three exempt spans named with their class before the first finding: a quoted user sentence, a quoted error string and a fenced command sample |
| HVS-002 | Same target, apply run | PASS | The diff touches lines 7 to 9 only. Lines 10 to 23, holding the quotation, the error string, the fence and the inline span, are byte-identical by `sha256sum`. No masked violation was ever reported |
| HVS-003 | Shipped `references/hvr-rules.md` | PASS | Self-reference stated before the number. `hard blockers: 30`, `deductions: -246`, ceiling floored at `0/100` on 510 lines, so the reported basis is hard blockers plus a density of 48.2 deductions per hundred lines. `git status --porcelain` empty |
| HVS-004 | Constructed, claim-bearing `robust` | PASS | Every candidate replacement changed what the sentence asserts about a contract clause, so the term stayed, the exception was recorded and `sha256sum` on the file is unchanged |
| HVR-001 | Shipped clean fixture | PASS | `no mechanical findings`, `ceiling: 100/100`, exit 0, `git status --porcelain` empty |
| HVR-002 | Constructed AI-ish draft | PASS | Before `4 / -23 / 77`, after `0 / -0 / 100`. The rewrite introduced no blocked term. One review-severity Oxford candidate remains and is a two-clause comma rather than a serial list |

Two deviations, both recorded rather than worked around. Six scenarios take a
placeholder target the packet does not ship, and the constructed targets lived outside the
repository, so `git status --porcelain` could not assert them and `sha256sum` substituted.

### Newcomer Routing

Eight prompts, routed through `node .opencode/bin/skill-advisor.cjs advisor_recommend`.
Four reach the mode. The set was run twice, once before and once after a concurrent routing
commit landed on this branch, and the numbers were identical.

| Prompt | Result |
|---|---|
| `make this README sound less like ChatGPT wrote it` | MISS. `sk-doc` at 0.7710, routed to `sk-create-readme`. The word README wins over the whole intent |
| `this draft reads like AI wrote it, fix it` | HIT. `sk-doc` at 0.5915, `sk-create-with-human-voice` |
| `remove the em dashes and corporate filler from my documentation` | MISS. `sk-doc` at 0.7183 with `action=defer` and no target |
| `can you make my writing sound more human?` | MISS. `sk-doc` at 0.3203 with `action=defer` and no target |
| `score this doc against the human voice rules` | HIT. `sk-doc` at 0.7726, `sk-create-with-human-voice` |
| `my blog post sounds robotic, rewrite it so it sounds like a person` | MISS. Zero recommendations at all |
| `do a voice pass on this file before I publish it` | HIT. `sk-doc` at 0.6325, `sk-create-with-human-voice` |
| `check my markdown for AI writing tells` | HIT. `sk-doc` at 0.5893, `sk-create-with-human-voice` |

The mode's own `SKILL.md` keyword block already carries `make this sound human`, so the gap
is not the mode's vocabulary. The advisor scores the hub, and a nested mode of this routing
class reaches the advisor only through the hub's `graph-metadata.json`, which is out of
scope here.

### Following The Instructions

The instructions were followed as a newcomer would on
`.opencode/skills/sk-doc/sk-create-repo-rule/README.md`, the file the shipped worked example
cites. Three places under-deliver.

The example itself has drifted. It shows four grouped rows and the scanner now prints six,
adding `get` x1 and `might` x1. A newcomer comparing the two concludes the scanner is
broken.

Computing the score stalls. `SKILL.md` step 5 says to compute it under the precedence rule,
`scoring-and-verification.md` gives one arithmetic starting at 100 and subtracting, and the
standard gives a second, weighting five categories at 15, 25, 25, 20 and 15 percent. Nothing
says how the two combine, and the 195-line target is short enough that the absolute score
applies, so the question cannot be dodged.

The invocation misleads. The README offered `/create:with-human-voice`, and the command's own
presentation contract hard-blocks it without the `@markdown` agent.

### Fixes

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-doc/sk-create-with-human-voice/assets/voice-report-template.md` | Modified | Six em dashes inside the fenced payload rode into every report authored from it. Replaced with the comma or colon the standard prescribes. The scan goes from exit 1 with 6 hard blockers to exit 0 with none |
| `.opencode/skills/sk-doc/sk-create-with-human-voice/references/scoring-and-verification.md` | Modified | The worked example gained the two rows the scanner reports and it did not |
| `.opencode/skills/sk-doc/sk-create-with-human-voice/references/scope-and-exemptions.md` | Modified | Records that template detection is by name and location, so section 3 still governs a fence carrying code inside a detected template |
| `.opencode/skills/sk-doc/sk-create-with-human-voice/README.md` | Modified | The invocation row now names the `@markdown` agent the command requires |
| `.opencode/skills/sk-doc/sk-create-with-human-voice/manual-testing-playbook/manual-testing-playbook.md` | Modified | The runnability claim now matches the scenarios, and two preconditions name what each supplied target must carry and how to assert one outside the repository |

### Write-Ups

Six findings need a decision and were not changed.

**W1. The hub routes from almost nothing a newcomer types.** Four of eight probes missed.
One was hijacked by the word README, two deferred with no target, one returned nothing at
all. The fix is hub vocabulary, which this phase may not touch.

**W2. The standard carries two incompatible scoring systems.** `hvr-rules.md` sections 1 and
9 weight five categories at 15, 25, 25, 20 and 15 percent. `scoring-and-verification.md`
section 3 subtracts points from 100. Neither says how they combine, and the bands are quoted
against the point system. One of the two should be retired or the combination rule written.

**W3. Template detection cannot tell a prose payload from a code one.** `is_template_path`
keys on the filename and the parent directory. Running the scanner on
`.opencode/skills/mcp-code-mode/assets/env-template.md` reports four hard blockers that are
TypeScript statement terminators inside a fenced sample. Removing them breaks the sample, so
the scope gate is right and the scanner is loud. Gating on the fence language tag is the
obvious fix and it would silence a prose template fenced as `markdown`, which is why it is a
decision rather than a repair. Documented in the gate for now.

**W4. The Oxford heuristic fires on a two-clause comma.** The pattern matched
`when it can, and falls through`, which is not a serial list. Severity is `review` and the
cost is zero points, so the scanner is arguably correct and only a newcomer over-corrects.

**W5. A multi-line inline code span is not masked.** A backticked error string wrapped
across two lines had its contents reported as prose findings. This is documented in
`scoring-and-verification.md` section 3 and the scope gate is the protection, which is why
`HVS-002` grades the diff rather than the report.

**W6. The shipped worked example cites a file that is free to change.** The drift this phase
fixed will recur the next time `sk-create-repo-rule/README.md` is edited. Pinning the example
to a fixture, or dropping the counts from it, are both changes to what the reference is for.

### Adjacent Defect, Not Fixed

`validate_document.py` line 246 classifies by `/specs/` with a leading slash, so a
repo-relative `specs/...` path misclassifies a spec document as a README and reports two
blocking errors. With absolute paths all five phase documents exit 0. It sits in
`sk-doc/scripts`, not in this mode, so it is recorded rather than repaired.

### Prepared Text, Not Applied

`SKILL.md` is compiled-policy input and was not edited. One change is worth making there
once W2 is decided. In section 3 step 5, replace:

```text
5. **Compute the score** under the precedence rule, or report hard blockers and density on a long document. `references/scoring-and-verification.md` carries the arithmetic.
```

with:

```text
5. **Compute the score** under the precedence rule using the point arithmetic in `references/scoring-and-verification.md`, or report hard blockers and density on a long document. The category weights in the standard's sections 1 and 9 describe where attention goes, not a second arithmetic, and no run combines the two.
```

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `assets/voice-report-template.md` | Modified | Remove six em dashes from the fenced payload |
| `references/scoring-and-verification.md` | Modified | Sync the worked example with live scanner output |
| `references/scope-and-exemptions.md` | Modified | Record the template-detection caveat |
| `README.md` | Modified | Correct the invocation instruction |
| `manual-testing-playbook/manual-testing-playbook.md` | Modified | Correct the runnability claim, add two preconditions |
| `specs/sk-doc/039-create-with-human-voice/001-utilization-review/*` | Created | This phase |
| `specs/sk-doc/039-create-with-human-voice/spec.md` | Modified | Phase Documentation Map injected by `create.sh` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The scope-gate wave ran first, as the playbook's own orchestration rule requires, because
it is read-only and it decides whether the other two waves measure the right spans. The
control pair ran before the first wave and again after the last fix, and reported the same
numbers both times.

The work was then destroyed once and rebuilt. A concurrent session on this branch restored
the working tree and the index to `HEAD` across a pathspec that included every file here.
File modification times show all nine of them rewritten inside a three-second window at
21:09:02, well after the last edit and well after the final validation run. No stash holds
the lost content and `git fsck --unreachable` finds no dangling blob, so nothing was
recoverable and every fix was re-applied by hand and re-verified by content rather than
trusted from memory. Nothing here is committed or pushed. The working tree carries five
edited packet files and the phase folder, staged explicitly by path.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Repair the report template rather than exempt it | The fenced payload is prose this mode authored, not text it carries. See ADR-001 in `plan.md` |
| Construct a target for each placeholder scenario rather than mark six as unrunnable | A placeholder is a finding about the scenario, not a reason to leave the workflow untested. Both the finding and the run are recorded |
| Document the template-detection gap in the gate rather than change the scanner | Gating on the fence language tag would silence prose templates fenced as `markdown`, which trades a loud correct finding for a silent wrong one |
| Leave the frontmatter versions of the five edited files alone | A version bump belongs with a changelog entry, and releasing the packet was not in scope |
| Keep constructed targets outside the repository | A target inside the packet would put a diff under it, which the playbook grades as a failure of the scenario that produced it |
| Verify every restored fix by reading the file rather than by re-reporting the earlier run | The earlier run was true when it was made and false an hour later. Only content read from the final state settles it |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `hvr_scan.py` on the dirty fixture, before and after the fixes | PASS. `6 / -33 / 67`, exit 1, unchanged |
| `hvr_scan.py` on the clean fixture, before and after | PASS. `no mechanical findings`, `100/100`, exit 0, unchanged |
| `hvr_scan.py` on `assets/voice-report-template.md` | PASS. Was 6 hard blockers and exit 1, now 0 and exit 0, with 0 em dashes left in the file |
| `hvr_scan.py` on every other file this phase edited | PASS. Zero hard blockers on the README, both references and the phase documents. The playbook root keeps its single pinned semicolon, which the diff did not add |
| `validate_document.py` on all five edited files | PASS. `VALID`, `Total issues: 0`, exit 0 on each |
| `validate-playbook-package.cjs --package <playbook root>` | PASS. `operator=9 routing_gold_excluded=0 violations=0 warnings=0`, exit 0 |
| Nine playbook scenarios | PASS on all nine, six under a recorded target substitution |
| Eight advisor probes | Four reach the mode, four do not. Run twice with identical results |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Six scenarios still describe a target they do not ship.** The preconditions now name
   the property each one needs, which is enough to run them. A packet that shipped seven
   fixtures instead of two would make them reproducible, and that is a bigger change than
   this phase should make.
2. **The judgment pass has no reproducible baseline.** Nothing in the packet fixes what a
   reader should find on a given target, so `HVT-003` grades whether four groups were
   answered, never whether they were answered well.
3. **The routing gap is unfixed.** Half of what a newcomer types still misses the mode.
4. **Version frontmatter was not bumped** on the five edited packet files, and no changelog
   entry was added. Both belong to a release action the operator owns.
5. **This branch is shared and unstable.** Work here was reverted once by a concurrent
   session. Until it is committed, anything in this packet can disappear the same way.
<!-- /ANCHOR:limitations -->

---


