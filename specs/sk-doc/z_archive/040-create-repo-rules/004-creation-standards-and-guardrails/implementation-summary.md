---
title: "Implementation Summary: Phase 4: Creation Standards and Guardrails"
description: "Five reader tests deciding whether a structurally correct rule is worth loading, derived from the corpus and validated in both directions - all eight shipped rules pass, phase 3 thin sample fails three. A pattern-based measurement of the section test was wrong and would have set the bar to describe two files rather than eight."
trigger_phrases:
  - "quality bar shipped"
  - "negative control"
  - "section test identifiability"
  - "failed measurement"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/040-create-repo-rules/004-creation-standards-and-guardrails"
    last_updated_at: "2026-08-31T11:33:10Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Derived the quality bar and validated it in both directions"
    next_safe_action: "Contract the wiring and lifecycle paths"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-creation-standards-and-guardrails"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-creation-standards-and-guardrails |
| **Completed** | 2026-08-31 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`references/creation-standards.md` — five reader tests deciding whether a structurally
correct rule is worth loading, each derived from the corpus and each passing on all eight
shipped rules while failing phase 3's thin sample.

### The measurement that was wrong, and what it changed

The first attempt to measure the section test by pattern reported **two of eight** rules as
compliant — and those two were the two written most recently in this session, because they
happened to share a phrasing. The corpus was fine; the regex was not.

Reading the sections settled it. `evidence-and-proof.md` §3 is titled **THE FOUR WAYS A
GREEN RUN LIES** and then enumerates them — the section *is* the failure.
`uncertainty-and-honesty.md` §3 says agreeing for conversational flow "is a failure mode,
not politeness". `blast-radius.md` §2 prices every tier by cost when wrong.

So the standard is **identifiability, not a sentence**: a reader must be able to say what
breaks without the section. An explicit `The failure this prevents:` line is a good habit
and not a requirement. Had the regex been trusted, the bar would have been written to
describe my own two files and would have failed six of the eight it claims to describe.

### The five tests

Section, trigger-phrase, binding-sentence, self-check, and the misreading guard. The last
one is the most interesting result: exactly three rules carry a `WHAT THIS RULE IS NOT`
section, and all three are rules whose surface reading permits *less* work. The five
without one only ever demand more rigour — nobody misreads "fix the producer, not the
symptom" as permission to do less.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `references/creation-standards.md` | Created | The bar, 163 lines |
| `references/README.md` | Modified | Routes to it, in question order |
| `SKILL.md` | Modified | Runs it as create step 5; section obligation reworded to identifiability |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Derived from the corpus, then validated in both directions, which is the only way a bar
proves anything.

**Positive:** every mechanically-checkable test run across all eight rules. Trigger-phrase
counts 16-20, all in range, **zero collisions across 144 phrases**. Self-check items 5-11,
all in range, and confirmed not to track section count — `overengineering.md` has 6
sections and 5 items, `delegation-and-orchestration.md` has 9 and 11.

**Negative:** phase 3's thin sample run against the same tests. It fails three — 6 trigger
phrases against an aim of 15-20, a binding sentence joining two obligations with "and", and
2 self-check items against an observed floor of 5.

A bar that passed the sample would have measured nothing.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| State the section test as identifiability, not a required phrase | The pattern-based version described two files written this session and would have failed six older rules that meet the standard in their own words |
| Record the failed measurement in the standards document | The next person to automate this test will reach for the same regex; the note is worth more than the tidier document |
| Keep the misreading guard conditional, not universal | Three of eight have one, and the three are exactly the rules that could be read as licence. Requiring it everywhere would add ceremony to five |
| No scoring rubric | Every test needs a reader. A checkable proxy would measure the proxy, and the structural floor already covers what is checkable |
| Standards may not exceed the corpus | A proposed sixth standard that the eight shipped rules fail is a wrong standard, not a higher bar |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Positive: all eight rules pass the checkable tests | PASS - 8 of 8, trigger phrases and self-check counts both in range |
| Phrase collisions across the set | PASS - 0 across 144 phrases |
| Negative: the thin sample fails | PASS - fails 3 tests (phrase count, binding sentence, self-check count) |
| Section test verified by reading, not pattern | PASS - three older rules confirmed to name failures in their own words |
| Corpus unchanged | PASS - md5 set byte-identical to baseline |
| Standards document fits its own bands | PASS - 163 lines, "good" band |
| Frontmatter parses | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **None of the five tests can be automated, and that is structural rather than lazy.** The section test in particular defeated a reasonable regex in a way that produced a confidently wrong answer. Any future attempt to mechanize these should expect the same.
2. **The binding-sentence test is crude.** It flags "and" as a conjunction joining two obligations, which will produce false positives on sentences where "and" is incidental. A reader resolves it in seconds; a checker would not.
3. **The misreading guard is inferred from three examples.** The pattern — rules permitting less work need one, rules demanding more do not — is clean but thin.
4. **The bar is met by a corpus one person largely wrote.** Same limitation phase 2 recorded, and it does not weaken with a second document derived from the same eight files.
5. **Nothing enforces the standards.** They load when the mode runs and depend on the author actually reading them.
<!-- /ANCHOR:limitations -->

---


