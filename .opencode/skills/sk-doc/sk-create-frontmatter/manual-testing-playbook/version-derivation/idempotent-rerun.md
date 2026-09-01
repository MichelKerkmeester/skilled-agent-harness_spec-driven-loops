---
title: "FMV-004 -- Idempotent rerun"
description: "This scenario validates idempotency for `FMV-004`. Re-running the versioning over an already-versioned tree is a byte-level no-op, and a run that rewrites bytes is a failure even when every version string is correct."
id: FMV-004
stage: routing
expected_intent: sk-create-frontmatter
expected_resources:
  - sk-create-frontmatter/references/frontmatter-versioning.md
expected_leaf_resources:
  - workflow_mode: sk-create-frontmatter
    leaf_resource_id: references/frontmatter-versioning.md
version: 1.0.0.0
---

# FMV-004 -- Idempotent rerun

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `FMV-004`.

---

## 1. OVERVIEW

This scenario validates idempotency for `FMV-004`. Re-running the versioning over an already-versioned tree is a byte-level no-op, and a run that rewrites bytes is a failure even when every version string it produces is correct.

### Why This Matters

The assertion is byte equality rather than value equality, and the difference is the whole scenario. The standard requires line-wise editing and forbids running a YAML re-serializer, because a re-serializer reflows multi-line block sequences and corrupts `trigger_phrases`. A re-serialized block still parses. Every version in it is still right. The advisor-facing list it was harvesting has been reflowed into something else, and the only signal at the moment it happens is a diff that should have been empty. That is why the check is `git status` on a second run rather than a comparison of the version strings, and why this scenario is critical: value equality passes in exactly the case the contract is trying to catch.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `FMV-004` and confirm the expected signals without contradictory evidence.

- Objective: prove a second pass over an already-versioned tree changes no bytes, and show the empty diff rather than claiming it
- Realistic user request: `I ran the versioning already. Is running it again going to touch anything?`
- Prompt: `I already ran the versioning yesterday. Is it safe to run it again?`
- Expected execution process: `references/frontmatter-versioning.md` loads, the idempotency row and the line-wise editing rule in section 6 are read together, the engine is run in a read-only mode over an already-versioned tree, and `git status --porcelain` is used to show the tree unchanged.
- Expected signals: the run reports every in-scope file as already correct, the working tree is unchanged, and the answer states that the assertion is byte-level and explains why value equality is not enough.
- Desired user-visible outcome: a second run whose diff is empty, with the empty diff shown rather than claimed.
- Pass/fail: PASS if the second run leaves the tree byte-identical and the empty diff is shown; FAIL if any file is rewritten, or if the answer asserts idempotency without producing the status output.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `I already ran the versioning yesterday. Is it safe to run it again?`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| FMV-004 | Idempotent rerun | Prove a second pass over a versioned tree is a byte-level no-op, with the empty diff shown | `I already ran the versioning yesterday. Is it safe to run it again?` | 1. `agent: Read the idempotency row and the line-wise editing rule in references/frontmatter-versioning.md` -> 2. `bash: git status --porcelain .opencode/skills/sk-doc` -> 3. `bash: node .opencode/skills/sk-doc/shared/scripts/frontmatter-version.mjs verify --skill sk-doc` -> 4. `bash: git status --porcelain .opencode/skills/sk-doc` | Step 1: both rules are quoted. Step 2: baseline, empty for the target paths. Step 3: every in-scope file reports as correct. Step 4: identical to step 2 | The prompt as typed, both rules quoted, the two status outputs, the engine transcript with its exit status, and an explicit statement that the two status outputs match | PASS if steps 2 and 4 match and nothing was rewritten; FAIL if step 4 differs from step 2, or if no status output is produced | 1. Confirm a baseline was taken before the run, since a single status reading proves nothing. 2. Check whether the answer relied on version strings matching rather than on bytes matching. 3. Inspect `trigger_phrases` in one file for reflow, which is the specific corruption line-wise editing prevents |

### Commands

1. `agent: Read the idempotency row and the line-wise editing rule in references/frontmatter-versioning.md and quote both`
2. `bash: git status --porcelain .opencode/skills/sk-doc`
3. `bash: node .opencode/skills/sk-doc/shared/scripts/frontmatter-version.mjs verify --skill sk-doc`
4. `bash: git status --porcelain .opencode/skills/sk-doc`

### Expected

Step 1 quotes both rules, because idempotency and line-wise editing are the same requirement seen from two sides: the second is how the first is achieved. Step 2 records the baseline for the target paths, which is what makes step 4 a comparison rather than a reading. Step 3 runs the engine in verify mode and reports every in-scope file as already carrying its derived version. Step 4 produces output identical to step 2. The answer states that the assertion is byte equality and explains that a YAML re-serializer would produce correct version strings and a changed file, which is the case value equality cannot see.

### Evidence

Capture the prompt exactly as typed, both quoted rules, the literal output of both `git status --porcelain` runs, the engine transcript with its exit status, and an explicit statement that the two status outputs match. Both readings are required. This assertion is a comparison, and a single status output after a run cannot be graded against anything.

### Pass / Fail

- **Pass**: the before and after status outputs are identical, the engine reports every file as already correct, and the answer states the assertion as byte-level.
- **Fail**: the second status output differs from the first, any file is rewritten, idempotency is asserted with no status output produced, or the answer treats matching version strings as sufficient proof.

### Failure Triage

1. Confirm a baseline was taken. A status reading after the run, with nothing to compare it to, proves only that the tree is clean now.
2. Check what was actually asserted. A run that compared version strings has checked value equality, which passes in the exact case this scenario exists to catch.
3. Inspect `trigger_phrases` in one affected file. A reflowed multi-line block sequence is the specific corruption the line-wise rule prevents, and it is visible in the diff rather than in the parsed values.
4. If the diff is non-empty, identify whether the change is a version value or a reformat. They are different failures with different causes, and the standard treats the second as the reason the first rule exists.

### Optional Supplemental Checks

Run the engine twice in succession and compare the two transcripts as well as the two diffs. A second run that reports different actions from the first has state the standard does not describe, and that is worth reporting even when the tree is unchanged.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root directory page and scenario summary |
| No feature-catalog entry | This packet ships no `feature-catalog/`, so no catalog cross-reference exists for this scenario |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`references/frontmatter-versioning.md`](../../references/frontmatter-versioning.md) | Primary implementation anchor, the idempotency row in section 5 and the insertion rule in section 6 |
| [`SKILL.md`](../../SKILL.md) | The ALWAYS rule to edit frontmatter line-wise, and the byte-level no-op success criterion |
| [`README.md`](../../README.md) | The troubleshooting row for a versioning pass that corrupted `trigger_phrases` |

---

## 5. SOURCE METADATA

- Group: VERSION DERIVATION
- Playbook ID: FMV-004
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `version-derivation/idempotent-rerun.md`
