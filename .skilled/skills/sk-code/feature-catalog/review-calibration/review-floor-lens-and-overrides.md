---
title: "Review Floor, Default Lens And Rule Overrides"
description: "The review mode keeps a fixed floor of security and correctness rules, applies a default lens a repository can change and records every rule source on one Rule sources line."
trigger_phrases:
  - "review floor and default lens"
  - "review rule overrides"
  - "review rule sources line"
  - "review lens ids"
version: 1.0.0.0
---

# Review Floor, Default Lens And Rule Overrides (sk-code-review)

## 1. OVERVIEW

The review mode keeps a fixed floor of security and correctness rules, applies a default lens a repository can change and records every rule source on one `Rule sources:` line.

Before this, the review checklists applied this repository's house rules everywhere, and nothing could switch one off. Now every rule section of the checklists opens with a `Rule:` line that cites its id, so a reviewer, a repository and a report all name the same rule.

---

## 2. HOW IT WORKS

### Floor And Lens

The floor is four review ids (`review.severity`, `review.reach`, `review.security-minimums`, `review.correctness-minimums`) plus the `floor.*` ids of the universal standards. No source changes it. The default lens is 25 `review.*` ids with their default wording and severity, such as `review.function-length`, `review.nesting-depth`, `review.todo-tracking` and `review.ceiling-marker`. Each applies as written until a repository or a surface drops or replaces it. A finding that is also an auth gap, an injection exposure or unsafe secrets handling is reported under the floor id, so dropping a lens rule never drops that finding.

### Where The Rules Come From

The review runs the quality runner's explain entry on the reviewed files and reads each file's surfaces, checklists with their seats and parsed override rows, plus the comment-hygiene rules the repository switched off. A surface the hub's router bundles from request words alone is a candidate and applies only to the files the resolver places in it. A review with no files keeps the SKILLED surface only inside this hub's own checkout. Deleted paths are left out of the call, because one missing path stops the whole explain.

### Precedence And Outcomes

For each rule and file, the highest level wins: the floor, the repository checklist, a specific surface, the SKILLED fallback, then the default lens. A refused checklist applies none of its rows, a row for an unknown id is ignored, and two checklists at the same level that disagree on one rule leave the default in force and are listed as a conflict. A hygiene rule the repository switched off counts as a `none` row, so it raises no review finding at any severity.

### The Rule Sources Line

Every full review states its rules in one line directly under `Quality gate evidence`: the checklists read, then the `Overrides:`, `Refused:`, `Ignored:` and `Conflicts:` groups, with `none` for an empty group. A private path prints as its declared label, so a report pasted into a tracked file does not name a private skill. `check-review-final-line.js` checks the line's shape when it is present and fails a second line, a missing group or a malformed entry.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/sk-code/sk-code-review/references/review-core.md` | Shared | Section 8: the floor and lens tables, precedence, outcomes and the line format |
| `.skilled/skills/sk-code/sk-code-review/SKILL.md` | Handler | The resolver step, the candidate rule and the output contract |
| `.skilled/skills/sk-code/sk-code-review/assets/code-quality-checklist.md` | Shared | Rule ids on the correctness, performance, maintainability and design sections |
| `.skilled/skills/sk-code/sk-code-review/assets/security-checklist.md` | Shared | Rule ids, with the HTTP-only items labelled |
| `.skilled/skills/sk-code/shared/references/universal/rule-overrides.md` | Shared | The override format and precedence the review adopts |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/sk-code/shared/scripts/tests/review-lens-overrides.test.cjs` | Node test | Every review floor and lens id against the shared contract |
| `.skilled/skills/sk-code/sk-code-review/scripts/tests/check-rule-copies.test.sh` | Automated test | The canary pins on the resolver step and the four floor ids, and the `Rule sources:` line cases |
| `.skilled/skills/sk-code/sk-code-review/manual-testing-playbook/foreign-repository-rules/almost-no-inline-comments.md` | Manual playbook | CR-029, a repository that drops the documentation rule |
| `.skilled/skills/sk-code/sk-code-review/manual-testing-playbook/foreign-repository-rules/comment-every-function.md` | Manual playbook | CR-030, a repository that replaces it with the opposite |
| `.skilled/skills/sk-code/sk-code-review/manual-testing-playbook/foreign-repository-rules/floor-override-refused.md` | Manual playbook | CR-031, a floor row refused at every layer |

---

## 4. SOURCE METADATA

- Group: Review Calibration
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `review-calibration/review-floor-lens-and-overrides.md`

Related references:
- [rule-overrides-and-hygiene-policy.md](../quality-gate/rule-overrides-and-hygiene-policy.md) for the section format and the hard floor.
- [review-reach-calibration.md](review-reach-calibration.md) for the reach rule the floor fixes.
