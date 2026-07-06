---
title: Benchmark Folder Common Pitfalls
description: The recurring mistakes that make a skill-local benchmark folder drift from its spec packet or break the convention - each paired with why it breaks and the correct fix.
trigger_phrases:
  - "benchmark folder pitfalls"
  - "benchmark report mistakes"
  - "benchmark promotion errors"
  - "retired benchmark handling"
  - "benchmark re-run mistake"
importance_tier: normal
contextType: reference
version: 1.0.0.0
---

# Benchmark Folder Common Pitfalls

The mistakes that most often make a skill-local benchmark folder drift from its spec packet or break the convention. Check this list when reviewing a drafted `benchmark_report.md` or when a promoted report no longer matches the packet it came from.

---

## 1. OVERVIEW

Each row names a mistake, why it breaks the skill-local surface, and the correct fix. The two case studies in [case_studies.md](case_studies.md) show real adoptions that avoided these traps; the ALWAYS/NEVER rules and authority hierarchy that back them live in [`../SKILL.md`](../SKILL.md) §6.

---

## 2. COMMON MISTAKES

| Mistake | Why It Breaks | Correct Fix |
|---|---|---|
| Promoting before the spec packet ADR is accepted | Skill-local report drifts from the eventual decision | Wait for ADR ratification before authoring `benchmark_report.md` |
| Omitting the load-bearing insight | Future operators miss the finding that matters most | State the non-obvious finding explicitly in Section 1 "What Shipped" and in Section 6 "Findings" |
| Naming folders by doc-authoring date | Folder date no longer matches evidence date | Always use the bench execution date for the folder name |
| Deleting retired benchmark folders | Audit trail is lost | Mark RETIRED in `README.md`; keep the folder |
| Cross-referencing numbers between skills | Stacks differ; numbers are not comparable | Add a "Stack distinction" line in Caveats; link to the sibling README but do not compare figures |
| Creating a new dated folder for a re-run that confirms the winner | Pollutes the index with redundant folders | Update the existing `benchmark_report.md` with a "Re-run YYYY-MM-DD" section |
| Writing a ten-section report without a SOURCE.md | Readers cannot find the audit trail | Always author SOURCE.md; use the `source_template.md` scaffold |

---

*See [case_studies.md](case_studies.md) for adoptions that avoided these mistakes, and [`../SKILL.md`](../SKILL.md) for the authoritative workflow and rules.*
