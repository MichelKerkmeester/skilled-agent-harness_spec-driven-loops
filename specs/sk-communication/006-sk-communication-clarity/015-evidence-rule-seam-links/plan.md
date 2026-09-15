---
title: "Implementation Plan: Phase 15: evidence rule seam links"
description: "Read the rule for passages that end at another rule's territory, then name the neighbour there, within a six-line budget."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 15: evidence rule seam links

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Four sentences gain a clause. The constraint that shaped the work is the line ceiling: the file
opened with eleven lines of headroom, and a first pass spent nine of them. Landing at 244 took a
second pass that tightened every clause and removed the one link that pointed where another
already did.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 5. QUALITY GATES

- `node .opencode/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs` → `RESULT: PASSED (9/9 checks)`
- `validate.sh <folder> --strict` → `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 2. APPROACH

1. **Read the rule before consulting the graph.** A link belongs where the prose already reaches a seam, not where a diagram says a node is lonely.
2. **Append to existing sentences.** A new paragraph per link would have cost the ceiling what the links are worth.
3. **One pointer per seam.** Two links to the same rule in one file is the duplication removed three phases ago, wearing navigation as cover.
4. **Measure after each pass**, because the ceiling is the binding constraint here rather than the wording.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 3. WORK BREAKDOWN

| Step | Seam | Neighbour named |
|------|------|-----------------|
| 1 | The tiers, where a claim cannot be resolved | `uncertainty-and-honesty.md` |
| 2 | A finding, confirmed against the real symptom | `root-cause-and-debugging.md` |
| 3 | A finding, as handed back by a delegate | `delegation-and-orchestration.md` |
| 4 | The close-out, where the status ends and the handback begins | `communication-handoff.md` |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 4. PROOF PLAN

| Claim | Check |
|-------|-------|
| Each link sits on a passage that already reaches the seam | Read the four passages before editing |
| The rule now names four neighbours | Re-derive the cross-reference graph from the files |
| Two of the links are reciprocal | The same graph, read in both directions |
| The file stays under its ceiling | Count the lines after each pass |
| No instruction changed | The diff carries only appended clauses |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- The cross-reference sweep that surfaced the asymmetry, run while answering the family question.
- Phase 012, which established that one pointer per seam is the standard here.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK

Remove the four clauses. Nothing reads them mechanically, and the corpus checker does not require
a rule to link outward, so the file returns to a valid state on its own.
<!-- /ANCHOR:rollback -->

---

