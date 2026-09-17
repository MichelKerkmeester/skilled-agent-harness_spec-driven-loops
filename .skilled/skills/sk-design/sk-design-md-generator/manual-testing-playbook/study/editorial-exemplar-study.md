---
title: "STUDY-015 -- Editorial Exemplar Study"
description: "This scenario validates exemplar study for `STUDY-015`. It focuses on confirming a non-SaaS editorial or ecommerce exemplar is studied for role naming and section treatment rather than copied as a style preset."
id: "STUDY-015"
version: 1.0.1.0
expected_intent: STUDY
expected_resources:
  - references/design-md-format.md
  - references/writing-style-guide.md
  - references/examples/stripe/DESIGN.md
  - references/examples/stripe/writing-notes.md
  - references/examples/vercel/DESIGN.md
  - references/examples/vercel/writing-notes.md
  - references/examples/linear/DESIGN.md
  - references/examples/linear/writing-notes.md
  - references/examples/supabase/DESIGN.md
  - references/examples/supabase/writing-notes.md
  - references/examples/editorial-exemplar.md
---

**Exact prompt**

```
Study a non-SaaS editorial or ecommerce extraction exemplar and explain what the v3 Style Reference should learn from it.
```

# STUDY-015 -- Editorial Exemplar Study

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `STUDY-015`.

---

## 1. OVERVIEW

This scenario validates the exemplar study path for `STUDY-015`. It focuses on confirming the skill reaches for a non-SaaS exemplar, extracts what transfers — role naming and section treatment — and states plainly that the exemplar is illustrative rather than a preset to apply.

### Why This Matters

Every shipped example pair in this skill is a developer tool: Stripe, Vercel, Linear, Supabase. That is a narrow slice of the web, and an agent that only ever studies those four will quietly converge every Style Reference toward the same restrained product-SaaS register regardless of what was actually measured.

The editorial exemplar exists to break that. The failure mode it guards against is subtle: an agent asked for a non-SaaS exemplar reaches for a fifth developer tool because that is what the examples directory has taught it to recognise, and the register never widens. The second failure mode is the opposite — treating the exemplar as a template to copy, which substitutes one preset for another and still ignores the measured surface.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `STUDY-015` and confirm the expected signals without contradictory evidence.

- Objective: confirm a non-SaaS exemplar is selected and studied for transferable structure, not copied as a style recipe.
- Real user request: `Show me a non-SaaS example and what our Style Reference should take from it.`
- Prompt: `Study a non-SaaS editorial or ecommerce extraction exemplar and explain what the v3 Style Reference should learn from it.`
- Expected execution process: route to the STUDY path, load `references/examples/editorial-exemplar.md` alongside the v3 format and writing-style guides, compare the exemplar's shape against the four shipped example pairs, and state that the exemplar is illustrative.
- Expected signals: the selected exemplar sits in editorial, ecommerce, culture or hospitality; no fifth developer-tool brand is chosen; the answer names role naming and section treatment as what transfers; live extraction and token fidelity are preserved as boundaries.
- Desired user-visible outcome: A concise PASS or FAIL verdict, or SKIP naming the specific sandbox blocker that prevented execution.
- Pass/fail: PASS if the exemplar is non-SaaS, the transferable lesson is structural, and the reply states the exemplar is not a preset; FAIL if another developer-tool brand is chosen, the exemplar is treated as a template to apply, or extraction and fidelity boundaries are weakened.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Decide whether the scenario should stay local or delegate. Exemplar study stays local.
3. Execute the deterministic steps exactly as written.
4. Compare the observed output against the desired user-visible outcome.
5. Return a concise final answer that a real user would understand.

PRE: no runtime setup is required. This scenario reads shipped reference material only and contacts no remote.

### Exact Command Sequence

1. `bash: ls .opencode/skills/sk-design-md-generator/references/examples/`
2. `agent: issue the exact prompt in a fresh session and capture the reply`
3. `bash: rg -n "editorial" .opencode/skills/sk-design-md-generator/references/examples/editorial-exemplar.md`
4. `bash: rg -n "not a preset|illustrative" .opencode/skills/sk-design-md-generator/references/examples/editorial-exemplar.md`
5. `agent: report the chosen exemplar category and the transferable lesson`

### Expected Signals

Step 1: the examples directory lists four developer-tool pairs plus `editorial-exemplar.md`. Step 2: the reply names an editorial, ecommerce, culture or hospitality exemplar. Step 3: the grep confirms the exemplar file is the one loaded. Step 4: the grep confirms the illustrative framing exists in the source rather than being invented by the reply. Step 5: the transferable lesson is role naming and section treatment, not a palette or a type stack.

### Evidence

The examples listing, the verbatim reply, both grep hits, and the named exemplar category.

### Pass / Fail Criteria

- **Pass**: the response selects editorial, ecommerce, culture or hospitality; it does not choose another developer-tool brand; it preserves live extraction and token fidelity boundaries; and it learns role naming and section treatment rather than a style recipe.
- **Fail**: a fifth developer-tool brand is selected, the exemplar is presented as a template to copy, or the reply proposes values that were never measured.

### Failure Triage

1. Confirm `references/examples/editorial-exemplar.md` was loaded at all; a developer-tool answer usually means only the four shipped pairs were read.
2. Compare the reply's transferable lesson against the exemplar's own framing; a palette or type stack in the answer means the exemplar was read as a preset.
3. If the reply proposes concrete values, check them against any `tokens.json` in scope. Values with no measured source are a fidelity breach, not a study result.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| STUDY-015 | Editorial exemplar study | Verify a non-SaaS exemplar is studied for structure rather than copied as a preset | `Study a non-SaaS editorial or ecommerce extraction exemplar and explain what the v3 Style Reference should learn from it.` | 1. `ls references/examples/` -> 2. agent issues the prompt in a fresh session -> 3. `rg "editorial" editorial-exemplar.md` -> 4. `rg "not a preset" editorial-exemplar.md` -> 5. agent reports the category and lesson | Step 1: four developer-tool pairs plus the exemplar file. Step 2: an editorial, ecommerce, culture or hospitality exemplar is named. Steps 3-4: greps confirm the source framing. Step 5: the lesson is role naming and section treatment | Examples listing, verbatim reply, both grep hits, named category | PASS if the exemplar is non-SaaS, the lesson is structural, and the reply states the exemplar is not a preset; FAIL if another developer-tool brand is chosen, the exemplar is copied as a template, or unmeasured values appear | 1. Confirm the exemplar file loaded. 2. Compare the lesson against the exemplar's own framing. 3. Check any proposed values against tokens.json |

### Optional Supplemental Checks

Re-run the prompt asking specifically for a hospitality exemplar. A skill that only ever returns the same editorial example has memorised one answer rather than learned the register distinction.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/examples/editorial-exemplar.md` | The non-SaaS exemplar under study |
| `../../references/examples/README.md` | Example-pair index and how the pairs are meant to be read |
| `../../references/design-md-format.md` | v3 Style Reference section contract the lesson must map onto |
| `../../references/writing-style-guide.md` | Register and prose rules the exemplar illustrates |
| `../../references/color-role-taxonomy.md` | Role naming, the primary transferable lesson |
| `../../SKILL.md` | Cardinal fidelity rule that bounds what a study may propose |

---

## 5. SOURCE METADATA

- Group: Study
- Playbook ID: STUDY-015
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `study/editorial-exemplar-study.md`
