---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-communication/006-sk-communication-clarity/001-research-communication-context/research/luna-fanout/lineages/luna/containment/quarantine/content/specs/cli-external-orchestration/071-cli-hermes-creation/001-deep-research/research/lineages/deepseek/containment/baseline/specs/sk-communication/006-sk-communication-clarity/007-wording-standard-restructure"
    last_updated_at: "2026-09-12T16:39:31Z"
    last_updated_by: "claude-conductor"
    recent_action: "Base plus supplement landed"
    next_safe_action: "None"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-007-wording-standard-restructure"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-wording-standard-restructure |
| **Completed** | 2026-09-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The wording standard is now two files that do what one crowding file tried: a reply-side base
every rewrite loads, and a publish supplement a published document adds. This phase landed the
six wording candidates the clarity program allocated to that standard, with the borrowability
test, the plain-word test and a worked exemplar teaching the voice, the nominalization and
literal-over-figurative rules cutting the AI patterns the structural section missed, and the
document scan test guarding the supplement's own headers. Every new rule states its instruction
and names the failure it prevents, in the voice the standard itself teaches.

### Phase 7: wording-standard-restructure

The clarity program merged 29 candidates from its research. Six of them belong to the wording
standard, and the synthesis record assigns them: five to the reply-side base, the document scan
test to the supplement. This phase wrote each one into the file the assignment chose, in that
file's own shape, then proved the restructure still holds. The proof went the way the phase
planned: every reply-side consumer still resolves to the base, every document-side consumer
still reaches base plus supplement through the mode, the base carries no scoring machinery, and
the scanner reproduces its pre-change findings on the supplement exactly.

### Candidate To Section

| Candidate | Lands in | Shape |
|---|---|---|
| 2, borrowability test | base, section 2, after the directive block | bold rule, instruction, failure line |
| 8, nominalization to verb and stacked compression | base, section 4, new subsection before Banned Metaphors | subsection, instruction, failure line, WRONG/RIGHT fence |
| 9, plain-word test | base, section 2, after the borrowability rule | bold rule, instruction, example, failure line |
| 10, literal over figurative | base, section 4, new subsection after Tables In A Reply | subsection, instruction, failure line, WRONG/RIGHT fence |
| 26, document scan test | supplement, section 3, after the pass threshold line | bold bullet, instruction, failure line |
| 27, worked exemplar | base, section 2, after the two tests | marked exemplar, one fenced paragraph |

### Section To Side Map (As Applied)

| Side | Sections |
|---|---|
| Base, what a reply loads | 1. OVERVIEW, 2. VOICE DIRECTIVES, 3. PUNCTUATION STANDARDS, 4. AI STRUCTURAL PATTERNS TO AVOID, 5. VOICE PERSONALITY, 6. HARD BLOCKER WORDS, 7. PHRASE HARD BLOCKERS, 8. SOFT DEDUCTIONS |
| Supplement, what a published document adds | 1. SCORING, 2. RULE PRECEDENCE, 3. PRE-PUBLISH CHECKLIST, 4. RELATED RESOURCES, the last two renumbered this phase from 9 and 10 |

The scanner's own parser keys on the four base titles it extracts term lists from, and on the
two deduction headings inside Soft Deductions, by title phrase rather than number. All six
headings are untouched, and the scanner run below confirms the parse survived.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md | Modified | The reply-side base gains the borrowability test, the plain-word test, the exemplar, the nominalization subsection and the literal-over-figurative subsection, the usage pointer cites the supplement by path, version 1.2.0.25 to 1.3.0.25 |
| .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-publish-supplement.md | Modified | The document scan bullet joins the checklist section, the H2 sections renumber to 1 through 4, version 1.0.0.0 to 1.1.0.0 |
| .opencode/skills/sk-doc/sk-create-with-human-voice/references/scope-and-exemptions.md | Modified (part one) | The scoring-band exclusion retires, one exclusion remains, stated as message ownership |
| .opencode/skills/sk-doc/sk-create-with-human-voice/SKILL.md | Modified (part one) | The mode's resource domains, loading table and related resources show base plus supplement |
| .opencode/skills/sk-doc/sk-create-with-human-voice/references/README.md | Modified (part one) | The references index carries the supplement row |
| specs/sk-communication/006-sk-communication-clarity/007-wording-standard-restructure/tasks.md | Modified | The landing and verification tasks ticked with evidence |
| specs/sk-communication/006-sk-communication-clarity/007-wording-standard-restructure/implementation-summary.md | Modified | This record |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The six allocation rows were read first, then each candidate was written into its assigned
section in that section's own shape, and only then did the gates run. The supplement's H2
sections were renumbered before anything else, because the base's usage pointer cited one of
the old numbers. No heading the scanner keys on was touched, and the new text carries none of
the words the base-side grep counts, which is why the findings below stay explainable. The
verification ran as one battery: the reply-side consumers, the document-side consumers, the
base grep, the exclusion count, the naming check, the scanner and the scoped diff.

The raw grep, exactly as it printed:

```
$ grep -nE "publish|score|threshold|points" .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md
31:A reply loads this file, and a document also loads the publish supplement, `hvr-publish-supplement.md`.
35:- Run the pre-publish checklist in `hvr-publish-supplement.md` before finalizing
281:Remove "from X to Y" constructions where the endpoints are not on a meaningful scale.
326:- "underscores the importance of"
```

Lines 281 and 326 are substring coincidences, the points inside endpoints and the score inside
underscores. They stood in the file before this phase. The two deduction headings the scanner
keys on carry Point capitalized, so the case-sensitive pattern never catches them. What
remains of the scoring machinery on the reply side is the naming sentence at 31 and the usage
pointer at 35, which is the intended residue.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The document scan test lands in the supplement | The phase assignment places it on the publish side, where the checklist section already carries the judgment pass the test belongs to. The allocation table's owner column reads the base file, which the restructure reads as the standard taken whole, base plus supplement. |
| The usage pointer cites the supplement by path, not by section number | The old pointer cited a section number that stopped existing when the checklist moved and the supplement's sections were renumbered. The file path survives both. |
| New wording avoids the words the base grep counts | The phase's expectation for the base is that publish, score, threshold and points language survives only where part one put it. Adding more would have blurred that proof, so every new sentence uses none of the four words. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Reply-side consumers resolve to the base | PASS. sk-communication's wording standard section names the Human Voice Rules at the base path, response.md:72 and response-by-external-agent.md:136-137 load it by path, communication.md:125 routes to sk-communication, one indirect hop. |
| Document-side consumers reach base plus supplement through the mode | PASS with one open pointer. The mode lists both at SKILL.md:59-60, :67-68 and :254-255, the command routes through the mode at :28-29. |
| Base scoring language | 4 grep lines: 31, 35, 281, 326, two structural and two substring coincidences, recorded in How It Was Delivered. |
| Exclusion count | 1. The gate's own lines 152-153: of the two exclusions carried, exactly one remains, the voice-personality exclusion for carried messages. |
| Base names the supplement | PASS. Line 31 and, since the pointer rewrite, line 35. |
| Scanner on the supplement | PASS, exit 0, no traceback. Findings identical to the pre-change baseline: x1 get first@63, x4 oxford-comma-candidate first@17, hard blockers 0, mechanical deductions -1, mechanical ceiling 99/100. |
| Scoped diff | PASS. The phase's footprint is the mode router, the references README, the scope gate, the two standard files and this spec folder. The supplement still shows untracked from its part one creation. The status also carries other packets' work in the shared checkout, none of it from this run. |
| Packet validator | Runs as the phase's final step. Its RESULT line is recorded in the closing report. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Closed by the conductor after this leaf returned.** The two items below were one-line pointer fixes inside the mode's own references and router, applied directly: scoring-and-verification.md now lists the supplement beside the base, and the score step's section numbers follow the renumbering.
2. **scoring-and-verification.md never reaches the supplement.** Its resources line at :184 still
describes the base as holding the penalties, the term lists and the pre-publish checklist. The
checklist moved to the supplement in part one and the file does not name it. Outside this
phase's write scope, so it is recorded here for the operator.
3. **The mode's score step cites the supplement's sections 1 and 9.** The category weights note
at SKILL.md:175 predates the renumber, and the second number is now 3. Outside this phase's
write scope, recorded for the same reason.
<!-- /ANCHOR:limitations -->

---

