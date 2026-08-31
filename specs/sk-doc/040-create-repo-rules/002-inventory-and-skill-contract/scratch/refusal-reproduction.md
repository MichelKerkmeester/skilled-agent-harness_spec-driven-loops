# Reproduction check: do the recovered tests still refuse the original ten?

Each candidate is run through `decision-tests.md` and compared against the reason the
research phase recorded. A match means the recovered test encodes the original doctrine
rather than a plausible substitute for it.

| # | Candidate | Recovered test that refuses it | Original recorded reason | Match |
|---|-----------|-------------------------------|--------------------------|-------|
| 1 | Gate-discipline | Test 1, always-loaded | "fires exactly when the trigger-loaded load path may already be broken; its force is adjacency to the gates, which exists only in AGENTS.md §2" | yes |
| 2 | Git / commit / PR | Test 2, scope boundary + Test 3.2, has a home | "Design-excluded — dispatch mechanics belong to sk-git; push policy already expanded by blast-radius.md §3" | yes |
| 3 | Communication-format | Test 3.1, not a cluster | "one row is not a cluster" | yes |
| 4 | Testing | Test 3.2, has a home | "would split proof doctrine" | yes |
| 5 | Security | Test 3.4, no anchor | "anchorless net-new" | yes |
| 6 | Memory | Test 2, scope boundary | "design-excluded by REPO RULES.md §4" | yes |
| 7 | Spec-folder | Test 2, scope boundary | "design-excluded by REPO RULES.md §4" | yes |
| 8 | Skill-routing | Test 2, scope boundary | "design-excluded by REPO RULES.md §4" | yes |
| 9 | Delegation-mechanics | Test 2, scope boundary | "design-excluded by REPO RULES.md §4" | yes |
| 10 | Meetings / collaboration | Test 3.1 + Test 3.4 | "No anchor row, no trigger-shaped doctrine in this repo's operating surface" | yes |

**10 of 10 reproduce, each by the test the original reason names.**

The original record labelled its conditions (a) through (d), which map one-to-one onto the
four-part test in section 3. That is not a coincidence to be pleased about — it is the
evidence that the recovered test *is* the original rather than a reconstruction that
happens to agree.
