---
title: "FCR-004 -- Keep published slugs stable"
description: "This scenario validates slug stability for FCR-004. Category folders and per-feature filenames act as linkable paths and should not be renamed without a deliberate migration."
version: 1.0.0.1
---

# FCR-004 -- Keep published slugs stable

This document captures the operator contract for catalog path stability.

## 1. OVERVIEW

This scenario validates slug stability for `FCR-004`. It focuses on category and feature paths as public links.

### Why This Matters

Other documents link to catalog leaves. Renaming a category or file can break those links even when the prose remains correct. The workflow stabilizes names and slugs before writing and treats a later rename as a deliberate migration.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `FCR-004` and confirm the stability rule.

- Objective: preserve published category and feature slugs unless a link migration is planned
- Realistic user request: `Rename these catalog folders to add numbers so they sort in the order I want.`
- Prompt: `Review these proposed catalog renames. Keep published category and feature slugs stable unless the change includes a deliberate link migration. Explain why the root index owns display order.`
- Expected execution process: the naming rules and common pitfalls are read, the existing inbound links are considered and the run refuses numeric prefixes as a sorting shortcut.
- Expected signals: category and feature paths stay bare kebab-case. Display order changes in the root index. A genuine rename requires updating every referrer in the same change.
- Desired user-visible outcome: stable links and a root index that controls display order.
- Pass/fail: PASS if the rename is declined or paired with a migration plan. FAIL if numeric prefixes are added or links are left stale.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Review these proposed catalog renames. Keep published category and feature slugs stable unless the change includes a deliberate link migration. Explain why the root index owns display order.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| FCR-004 | Keep published slugs stable | Decline numeric sorting renames without link migration | `Review these proposed catalog renames. Keep published category and feature slugs stable unless the change includes a deliberate link migration. Explain why the root index owns display order.` | 1. `agent: Read SKILL.md sections 3 and 8 and references/common-pitfalls.md` -> 2. `agent: Inspect the proposed category and feature path changes` -> 3. `agent: State the inbound-link risk and the root-index ordering rule` -> 4. `agent: Return the safe disposition for the rename` | Step 1 identifies bare kebab-case and stable-slug rules. Step 2 lists the proposed numeric prefixes. Step 3 explains link breakage and root-owned order. Step 4 declines the rename or requires a migration plan | Exact prompt, source rules, proposed paths, link-risk statement, ordering rule and disposition | PASS if the unsafe rename is declined or a complete migration is required. FAIL if numeric prefixes are accepted as an ordering tool without link updates | 1. Check every inbound link. 2. Remove numeric prefixes. 3. If a rename is required, update all referrers together |

### Commands

1. `agent: Read SKILL.md sections 3 and 8 and references/common-pitfalls.md`
2. `agent: Inspect the proposed category and feature path changes`
3. `agent: State the inbound-link risk and the root-index ordering rule`
4. `agent: Return the safe disposition for the rename`

### Expected

Category and feature paths use bare kebab-case with no numeric prefix. The root catalog owns display order. A published slug is stable unless a deliberate migration updates every referrer in the same change.

### Evidence

Capture the prompt, naming rules, proposed paths, link-risk analysis, ordering rule and disposition.

### Pass / Fail

- **Pass**: numeric sorting renames are left alone or are tied to a complete link migration.
- **Fail**: the run renames paths without checking referrers or adds numeric prefixes to control display order.

### Failure Triage

1. Search for every inbound link.
2. Compare the proposed path with the naming rule.
3. Keep ordering changes in the root index.
4. Require a migration if the slug itself must change.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root policy and scenario index |
| No feature-catalog entry | This mode has no catalog package for this scenario |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`SKILL.md`](../../SKILL.md) | Naming and stability rules |
| [`references/common-pitfalls.md`](../../references/common-pitfalls.md) | Rename and link-risk guidance |
| [`assets/feature-catalog-template.md`](../../assets/feature-catalog-template.md) | Category and filename conventions |

---

## 5. SOURCE METADATA

- Group: SOURCE TRACEABILITY
- Playbook ID: FCR-004
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `source-traceability/keep-published-slugs-stable.md`
