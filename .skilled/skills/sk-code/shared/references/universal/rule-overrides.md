---
title: Rule Overrides Contract
description: The shared contract a repository or surface uses to drop or replace a sk-code rule outside the hard floor, read by both the quality and the review mode.
trigger_phrases:
  - "rule overrides section"
  - "drop or replace a quality rule"
  - "override a review rule"
  - "hard floor rule ids"
  - "check rule overrides linter"
importance_tier: important
contextType: implementation
version: 1.0.2.0
---

# Rule Overrides Contract

How a repository or a surface drops or replaces a sk-code rule, and which rules no one can change.

---

## 1. OVERVIEW

### Purpose

Each repository keeps its own house style. One wants almost no inline comments, and another wants a comment on every function. The quality mode and the review mode ship default rules, and this contract is how a repository or a surface says "not here" or "this instead" for one of them. Both modes read the same section in the same files, so a rule dropped for quality does not come back as a review finding.

### Core Principle

A repository may change any rule except the hard floor. The floor holds the rules whose breach causes an incident in any codebase, and the review severity scale that every finding is ranked on.

### Scope

This file defines the format, the ids, the floor, the precedence and how an applied override is recorded. The quality and review modes adopt it in their own contracts. The review mode applies the rows it reads and records them on its `Rule sources` line. The quality runner reads each declared checklist's section through the same linter and shows the parsed rows in its explain output, and `commentHygiene.disableRules` carries the machine-checked half. A mode that does not state that it reads overrides behaves as before.

### Key Sources

- [`rule-overrides.json`](./rule-overrides.json): the machine-readable hard floor and the machine-checked classes. The linter reads it, and sections 2 and 4 of this file mirror it.
- [`../../scripts/check-rule-overrides.cjs`](../../scripts/check-rule-overrides.cjs): the linter that checks a section.
- [`../../../sk-code-quality/references/runner-contract.md`](../../../sk-code-quality/references/runner-contract.md) section 5: the `<class>.<name>` rule id grammar this contract reuses.

---

## 2. THE SECTION AND ITS ROWS

An override lives in an optional section of a checklist file. The heading reads `## Rule overrides`. A checklist that numbers its headings in upper case may write `## 7. RULE OVERRIDES`, and the linter reads both. The section runs to the next H1 or H2 heading. A file carries at most one.

The section holds one table with three columns:

```markdown
## Rule overrides

| Rule | Action | Reason |
| --- | --- | --- |
| `floor.documentation` | none | Public functions carry no doc comments here |
| `review.function-length` | replace: A function stays under 60 lines | The team's own limit |
```

| Column | Required | Meaning |
| --- | --- | --- |
| Rule | Yes | One rule id from section 3. Backticks are optional |
| Action | Yes | `none` drops the rule. `replace: <text>` puts the text in its place, with the same severity |
| Reason | No | Why the repository differs. A reviewer reads it when the override is recorded |

A row names a single rule, and a section names each rule once. Write a literal pipe in the replacement text as `\|`. Prose lines and fenced examples inside the section are ignored.

A row for a machine-checked id (`hygiene.*`, `debug.*`, `dist.*`) changes what the agent and review apply. The runner's own check changes only through `commentHygiene.disableRules` in the repository's quality config. A `replace:` row on a machine-checked id is refused, because no row can rewrite what the runner matches.

---

## 3. RULE IDS

A rule id is `<class>.<name>`, the grammar of `runner-contract.md` section 5. The class and the name are lower case, and each takes letters, digits and hyphens.

| Class | Names | Source |
| --- | --- | --- |
| `hygiene`, `conflict`, `secret`, `syntax`, `debug`, `dist` | The runner's own rule names, such as `hygiene.task` | `runner-contract.md` section 5 |
| `floor` | One per rule in the universal standards, such as `floor.input-validation` | `code-quality-standards.md` sections 3 to 5 |
| `review` | One per rule in the review default lens, such as `review.function-length` | The sk-code-review mode |

A row names a concrete id. A wildcard such as `hygiene.*` is not a row id. The linter checks the grammar, the action and the floor, not whether the id names a rule that exists. Section 7 says what a mode does with an unknown id.

A review check that enforces a rule of the universal floor carries that rule's `floor.*` id, never a `review.*` id, so an override written for the review lens cannot reach a floor rule.

---

## 4. THE HARD FLOOR

These ids are fixed. A section that names one is refused. An id ending in `.*` fixes every rule in that class, so a parse rule added later is fixed from the start.

| Id | Rule |
| --- | --- |
| `syntax.*` | Parse failure: the file does not parse in its language |
| `conflict.*` | Merge-conflict markers left in a text file |
| `secret.*` | Credential signature: a private-key header or a token in a known format |
| `floor.hardcoded-secrets` | No hardcoded secrets: credentials come from the environment or a secret store |
| `floor.input-validation` | Input validation: every external input is validated at the boundary |
| `floor.silent-failures` | No silent failures: an error reaches the caller or is logged with context |
| `floor.initialization-safety` | Initialization safety: setup guards against double init, races and partial loads |
| `floor.resource-cleanup` | Resource cleanup: handles, connections, subscriptions and timers close deterministically |
| `floor.accessibility` | Accessibility for UI code: keyboard-operable, an accessible name and a visible focus state |
| `review.severity` | The review severity ids P0, P1 and P2 and what each one means |
| `review.reach` | The review reach rule: a P0 or P1 finding names an input or caller in reach |
| `review.security-minimums` | Review security minimums: auth and authorization gaps, injection exposure, unsafe secrets handling and privilege misuse |
| `review.correctness-minimums` | Review correctness minimums: regression risk, contract safety, spec mismatch, destructive side effects and boundary handling |

The four `review.*` ids fix the floor of [`review-core.md`](../../../sk-code-review/references/review-core.md): its severity ids and reach rule in section 2, and the baseline security and correctness minimums in sections 5 and 6, which that file says surface guidance cannot relax.

Every other rule can be overridden. That covers comment hygiene, documentation, typing strictness, naming, commented-out code, the `ceiling:` marker and every P2 rule. The list above and [`rule-overrides.json`](./rule-overrides.json) hold the same ids, and a test fails when they differ.

---

## 5. PRECEDENCE

When more than one source speaks to the same rule for a file, the higher level wins:

1. **The hard floor.** No source changes it.
2. **The repository checklist.** A file named in the repository's `.sk-code/quality.json` `checklists[]`.
3. **A specific surface.** A hub surface other than SKILLED, or an outside skill that declares a surface.
4. **The SKILLED fallback.** The `sk-code-skilled` checklists.
5. **The default lens.** The rule as the mode ships it.

Two sources at the same level that disagree on one rule for one file are a conflict, and section 7 says how each mode handles it. Two sources that give the same action and the same text agree, and that is no conflict.

---

## 6. WHERE A SECTION MAY LIVE

A section has effect only in a checklist file that an existing declaration already names. A mode never searches for override sections elsewhere.

| Seat | Declared in | Level |
| --- | --- | --- |
| A hub surface checklist | That surface's `quality.checklists` in the hub's `mode-registry.json` | Specific surface, or the SKILLED fallback for `sk-code-skilled` |
| An outside skill checklist | The `quality` block beside `surface_detection` in that skill's `graph-metadata.json` | Specific surface |
| A repository checklist | `checklists[]` in the repository's `.sk-code/quality.json` | Repository |

A checklist applies to the files its declaration matches by path or extension, and so does its section. An override in a checklist for `.github/workflows/**` never reaches a Python file.

---

## 7. READING AND RECORDING AN OVERRIDE

A mode reads a section only through `lintOverrides` in the linter, the same code the command line runs. An override is a judgment the reader must be able to see, so every outcome is recorded where the mode already records its judgment.

| Outcome | Quality | Review |
| --- | --- | --- |
| A valid row, the highest source for its rule | Applies it and records `override <rule id> <none\|replace> from <checklist file>` in the envelope's `p0_p1_p2_decisions` | Applies it and lists it under `Overrides` on the `Rule sources` line |
| `lintOverrides` returns any error for a file | Applies none of that file's overrides and reports the file as `CONFIG_INVALID`, exit 3 | Applies none of that file's overrides and lists the file under `Refused` |
| A row names an id no rule carries | Refuses the file as `CONFIG_INVALID`, exit 3 | Ignores the row and lists it under `Ignored` |
| Two sources at the same level disagree on one rule | Records `override-conflict <rule id> <file> <file>` in `p0_p1_p2_decisions`, keeps the default for that rule and reports the rule as unverified, with no new exit code | Applies the default and lists the rule under `Conflicts` |

The review report carries one `Rule sources` line. It lists the checklist files the review read, then each outcome group, and writes `none` for an empty group:

```text
Rule sources: <checklist file>, <checklist file>. Overrides: <rule id> none from <checklist file>. Refused: none. Ignored: none. Conflicts: none
```

---

## 8. CHECKING A SECTION

Run the linter on a checklist file before a declaration names it:

```bash
node .skilled/skills/sk-code/shared/scripts/check-rule-overrides.cjs <checklist.md> [<checklist.md>...]
```

| Exit | Meaning |
| --- | --- |
| 0 | Every file has a valid section or none |
| 1 | A row is refused: a floor id, a `replace:` row on a machine-checked id, an unknown action, a malformed row or id, a repeated id or a second section. Each problem prints as `<file>:<line>: <message>` |
| 2 | A usage error, an unreadable file or an unreadable contract file |

The linter exports `lintOverrides`, `loadContract` and `RULE_ID`, the id grammar, so a reader that checks an id outside a section uses the same pattern. `lintOverrides(text)` returns the accepted rows and every error, and a mode applies the rows only when the error list is empty.

---

## 9. RELATED RESOURCES

- [`code-quality-standards.md`](./code-quality-standards.md): the universal floor and its P0, P1 and P2 tiers.
- [`../../../sk-code-review/references/review-core.md`](../../../sk-code-review/references/review-core.md): the review severity ids, the reach rule and the baseline minimums that this contract fixes.
- [`../../../sk-code-quality/references/runner-contract.md`](../../../sk-code-quality/references/runner-contract.md): the runner's rule ids and its envelope.
