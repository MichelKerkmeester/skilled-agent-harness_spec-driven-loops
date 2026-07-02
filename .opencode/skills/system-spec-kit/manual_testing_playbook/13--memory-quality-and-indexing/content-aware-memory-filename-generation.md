---
title: "199 -- Content-aware memory filename generation"
description: "This scenario validates Content-aware memory filename generation for `199`. It focuses on verifying that saved memory filenames and headings derive from task/session context instead of collapsing to the spec-folder slug."
audited_post_018: true
version: 3.6.0.13
---

# 199 -- Content-aware memory filename generation

## 1. OVERVIEW

This scenario validates Content-aware memory filename generation for `199`. It focuses on verifying that saved memory filenames and headings derive from task/session context instead of collapsing to the spec-folder slug.

---

## 2. SCENARIO CONTRACT


- Objective: Verify content-aware slug selection prefers task/session context over folder fallback and keeps same-folder saves distinguishable.
- Real user request: `` Please validate Content-aware memory filename generation against the documented validation surface and tell me whether the expected signals are present: Preferred slug source order is task -> spec title -> session candidates -> folder base; saved filenames in the same folder differ when task context differs; slug normalization lowercases and hyphenates content-aware names; H1 heading matches `slugToTitle()` output; pathless batch inputs receive distinct synthetic keys. ``
- Prompt: `Validate content-aware memory filename generation and slug selection.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Preferred slug source order is task -> spec title -> session candidates -> folder base; saved filenames in the same folder differ when task context differs; slug normalization lowercases and hyphenates content-aware names; H1 heading matches `slugToTitle()` output; pathless batch inputs receive distinct synthetic keys
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if same-folder saves produce distinct content-aware filenames and matching headings without falling back to the folder slug unnecessarily; FAIL if filenames collapse to the folder slug, headings diverge from filenames, or pathless batch items overwrite one another

---

## 3. TEST EXECUTION

### Prompt

```
Validate content-aware memory filename generation and slug selection.
```

### Commands

1. Use one spec folder and perform two memory-save flows with clearly different task/session summaries
2. Confirm the saved filenames are different and reflect the task/session wording rather than repeating the folder slug
3. Open each saved file and verify the H1 heading matches the derived filename title
4. Exercise a batch/pathless save case with multiple inputs lacking file paths and verify each item gets a unique synthetic key and distinct slug decision
5. Capture one long task name and confirm the slug is lowercased, hyphenated, and truncated at a word boundary

### Expected

Preferred slug source order is task -> spec title -> session candidates -> folder base; saved filenames in the same folder differ when task context differs; slug normalization lowercases and hyphenates content-aware names; H1 heading matches `slugToTitle()` output; pathless batch inputs receive distinct synthetic keys

### Evidence

BLOCKED before executing the scenario commands because the scenario requires memory-save writes outside the single allowed write path.

User constraint supplied for this run:

```text
ALLOWED WRITE PATHS
- .opencode/skills/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/content-aware-memory-filename-generation.md (this file only)
```

Scenario commands requiring additional writes:

```text
1. Use one spec folder and perform two memory-save flows with clearly different task/session summaries
2. Confirm the saved filenames are different and reflect the task/session wording rather than repeating the folder slug
3. Open each saved file and verify the H1 heading matches the derived filename title
4. Exercise a batch/pathless save case with multiple inputs lacking file paths and verify each item gets a unique synthetic key and distinct slug decision
5. Capture one long task name and confirm the slug is lowercased, hyphenated, and truncated at a word boundary
```

Observed file state:

```text
No Preconditions section is present in this scenario file.
```

No memory-save command was run, because running the scenario as written would create or modify saved memory files outside the only allowed write path.

### Pass / Fail

- **BLOCKED**: scenario commands require actual memory-save flows and opened saved files, but this run only permits edits to this scenario file.
- **Pass**: same-folder saves produce distinct content-aware filenames and matching headings without falling back to the folder slug unnecessarily
- **Fail**: filenames collapse to the folder slug, headings diverge from filenames, or pathless batch items overwrite one another

### Failure Triage

Inspect `preferredMemoryTask` selection in workflow orchestration; verify session candidate precedence; review `generateContentSlug()` normalization/truncation rules; check pathless batch key assignment before slug generation

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [13--memory-quality-and-indexing/content-aware-memory-filename-generation.md](../../feature_catalog/13--memory-quality-and-indexing/content-aware-memory-filename-generation.md)

---

## 5. SOURCE METADATA

- Group: Memory Quality and Indexing
- Playbook ID: 199
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `13--memory-quality-and-indexing/content-aware-memory-filename-generation.md`
