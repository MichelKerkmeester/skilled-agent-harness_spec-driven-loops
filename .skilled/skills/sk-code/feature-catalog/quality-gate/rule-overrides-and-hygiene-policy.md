---
title: "Rule Overrides And Hygiene Policy"
description: "A repository drops or replaces any quality or review rule outside a fixed hard floor, in a Rule overrides section of a checklist it already declares and in commentHygiene.disableRules."
trigger_phrases:
  - "rule overrides and hygiene policy"
  - "rule overrides section"
  - "commentHygiene disableRules"
  - "drop or replace a quality rule"
version: 1.0.0.0
---

# Rule Overrides And Hygiene Policy (`## Rule overrides`, `commentHygiene.disableRules`)

## 1. OVERVIEW

A repository drops or replaces any quality or review rule outside a fixed hard floor, in a `## Rule overrides` section of a checklist it already declares and in `commentHygiene.disableRules`.

Each repository keeps its own house style. One wants almost no inline comments, and another wants a comment on every function. The quality and review modes ship defaults, and this feature is how a repository says "not here" or "this instead" without editing the modes. Both modes read the same section in the same files, so a rule dropped for quality does not return as a review finding.

---

## 2. HOW IT WORKS

### The Section

An override lives in an optional section of a checklist that a declaration already names: a hub surface's `quality.checklists`, an outside skill's `quality` block, or `checklists[]` in `.sk-code/quality.json`. The heading reads `## Rule overrides`, or `## 7. RULE OVERRIDES` in a checklist that numbers its headings. The table has three columns: a rule id, an action and an optional reason. The action is `none`, which drops the rule, or `replace: <text>`, which puts the text in its place at the same severity.

A rule id is `<class>.<name>`. The classes are the runner's own (`hygiene`, `conflict`, `secret`, `syntax`, `debug`, `dist`), the universal floor's `floor.*` rules and the review lens's `review.*` rules. When more than one source speaks to the same rule, the higher level wins: the hard floor, then the repository checklist, then a specific surface, then the SKILLED fallback, then the default.

### The Hard Floor

The floor holds the rules whose breach causes an incident in any codebase: parse failures, merge-conflict markers, credential signatures, hardcoded secrets, input validation, silent failures, initialization safety, resource cleanup, accessibility for UI code and the review severity ids, reach rule and security and correctness minimums. A row that names one is refused. The ids live once in `rule-overrides.json`, and a test fails when the contract text and the JSON differ. The shared linter exits 1 on a refused row, and the explain output marks the whole checklist `refused`, so none of its rows apply.

### The Hygiene Key

`commentHygiene.disableRules` in `.sk-code/quality.json` switches off named core comment-hygiene rules, written bare (`task`) or with their class (`hygiene.task`). The runner, the pre-commit hook and the CI job all read it, so a rule switched off for one is off for all three, and the verdict lists what is off in `config.hygiene.disabled`. An unknown id, or an id the shared contract fixes such as `secret.private-key`, is `CONFIG_INVALID` with exit 3 before any check runs. The hygiene row of a checklist changes what the agent and the review mode apply, while the runner's own check changes only through this key, so a repository that wants a rule off everywhere sets both.

### Reading Overrides

`quality-gate.cjs --explain` takes several files at once. For each file it prints the surfaces, the folder each surface loads from, every checklist with the seat that declared it and each checklist's parsed rows. The review mode reads this output instead of detecting surfaces itself.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/sk-code/shared/references/universal/rule-overrides.md` | Shared | The contract: section format, ids, hard floor, precedence and how an override is recorded |
| `.skilled/skills/sk-code/shared/references/universal/rule-overrides.json` | Shared | The hard floor as data, read by the linter and the config check |
| `.skilled/skills/sk-code/shared/scripts/check-rule-overrides.cjs` | Script | The linter, the only path through which a mode reads a section |
| `.skilled/skills/sk-code/sk-code-quality/scripts/lib/quality-config.cjs` | Shared | Validation of `disableRules` and the flags handed to the checker |
| `.skilled/skills/sk-code/sk-code-quality/scripts/hygiene-config-flags.cjs` | Script | The `--disable-rule` flags the pre-commit hook and the CI job read |
| `.skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs` | Script | The runner and its multi-file explain output |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/sk-code/shared/scripts/tests/check-rule-overrides.test.cjs` | Node test | The linter and the floor agreement with the JSON |
| `.skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate.test.cjs` | Node test | The `disableRules` cases and the explain output |
| `.skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/quality-gate/disabled-hygiene-rules.md` | Manual playbook | CQ-012, a repository that switches a hygiene rule off |
| `.skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/quality-gate/floor-override-refused.md` | Manual playbook | CQ-013, a floor row and a fixed hygiene id refused |

---

## 4. SOURCE METADATA

- Group: Quality Gate
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `quality-gate/rule-overrides-and-hygiene-policy.md`

Related references:
- [repository-quality-config.md](repository-quality-config.md) for the file that carries `disableRules`.
- [review-floor-lens-and-overrides.md](../review-calibration/review-floor-lens-and-overrides.md) for how the review mode applies the same rows.
