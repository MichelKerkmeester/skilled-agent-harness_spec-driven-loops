---
title: "465 -- Source tag resolution"
description: "This scenario validates source tag resolution for `465`. It focuses on the SOURCE_TAGS helper checking every [SOURCE: ...] citation in a research packet with no warning when the cutoff is moved back, and skipping the same packet with one line naming the cutoff when it is not."
version: 1.0.0.0
---

# 465 -- Source tag resolution

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `465`.

---

## 1. OVERVIEW

This scenario validates source tag resolution for `465`. It focuses on the SOURCE_TAGS helper checking every [SOURCE: ...] citation in a research packet with no warning when the cutoff is moved back, and skipping the same packet with one line naming the cutoff when it is not.

### Why This Matters

A research or review finding cites `path:line` inside a `[SOURCE: ...]` tag, and the tag goes stale when the cited file moves or shrinks. The `SOURCE_TAGS` rule resolves each tag through sk-doc's citation resolver and warns on a gone, moved, past-end or guessed citation. Packets created on or before the cutoff are skipped so old research history stays unchecked. Running the helper on one packet with and without the cutoff override shows both the check and the skip.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `465` and confirm the expected signals without contradictory evidence.

- Objective: confirm that with `SPECKIT_SOURCE_TAG_CUTOFF=2000-01-01` the helper prints no `WARN` line and ends `CHECKED 47` with exit 0, and that without the variable it prints one `SKIP` line naming the cutoff and exits 0
- Real user request: `Do the [SOURCE:] citations in the OKF research packet still point at files and lines that exist?`
- Prompt: `Check the source tags in the OKF deep-research packet twice, once with the cutoff override moved back far enough to include the packet and once with the default cutoff, and tell me how many citations it checked, whether any warned and why the second pass skipped.`
- Expected execution process: the helper runs on the packet with the cutoff override, the output and exit status are read, the helper runs again with no override and that output and exit status are read.
- Expected signals: step 1 prints no `WARN` line and ends with `CHECKED<TAB>47`, then `exit=0`. Step 2 prints one line, `SKIP<TAB>created 2026-10-04, on or before the cutoff 2026-10-04`, then `exit=0`.
- Desired user-visible outcome: the checked count, a statement that no citation warned, and the skip reason with the cutoff it names.
- Pass/fail: PASS if step 1 ends `CHECKED 47` with no `WARN` line and step 2 prints the `SKIP` line naming the cutoff, both with `exit=0`. FAIL if step 1 prints a `WARN` line or a different count, step 2 checks citations instead of skipping, or a run exits non-zero.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Check the source tags in the OKF deep-research packet twice, once with the cutoff override moved back far enough to include the packet and once with the default cutoff, and tell me how many citations it checked, whether any warned and why the second pass skipped.`

### Commands

1. `SPECKIT_SOURCE_TAG_CUTOFF=2000-01-01 node .skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs specs/system-speckit/050-open-knowledge-format-adoption/001-okf-deep-research; echo "exit=$?"`
2. `node .skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs specs/system-speckit/050-open-knowledge-format-adoption/001-okf-deep-research; echo "exit=$?"`

### Expected

Step 1 prints no `WARN` line, then `CHECKED<TAB>47` and `exit=0`: every `path:line` citation inside a `[SOURCE: ...]` tag under the packet's `research/` folder resolves to a file and line that exist. Step 2 prints `SKIP<TAB>created 2026-10-04, on or before the cutoff 2026-10-04` and `exit=0`, because the packet's `spec.md` Created date is not after the default cutoff.

### Evidence

Capture the full stdout and the exit line of both steps.

### Pass / Fail

- **Pass**: step 1 ends `CHECKED 47` with no `WARN` line, step 2 prints the `SKIP` line naming the cutoff, and both end with `exit=0`.
- **Fail**: step 1 prints a `WARN` line or a count other than 47, step 2 checks citations instead of skipping, or a run exits non-zero.

### Failure Triage

1. When step 1 prints a `WARN` line, read its class and detail: `gone` means no file and no recorded rename, `moved` names the new path, `past end` means the file is shorter than the cited line, and `guessed` means only a file-name match was found. A file moved or shortened after the packet was written makes a real warning, so name the cited path before failing the step.
2. When step 1's count differs from 47, the packet's research artifacts changed: count the `[SOURCE: ...]` path citations outside `prompts/` folders and fenced blocks before failing the step.
3. When step 1 prints a `SKIP` line, the override did not reach the helper: a malformed value prints `SPECKIT_SOURCE_TAG_CUTOFF='<value>' is not an ISO date; using 2026-10-04` on stderr and falls back to the default.
4. When a run exits 2, the helper could not read the folder, the repository or the redirect table `.skilled/skills/sk-doc/shared/scripts/cite-drift-redirects.json`.
5. Record the scenario as SKIP only with a specific blocker, such as the packet folder `specs/system-speckit/050-open-knowledge-format-adoption/001-okf-deep-research` missing from the checkout under test.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/tooling-and-scripts/source-tag-resolution.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs` | Applies the cutoff, resolves each tag and prints the `SKIP`, `WARN` and `CHECKED` lines |
| `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs` | `resolveCitation` and the redirect table the helper reads |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/check-source-tags.vitest.ts` | Nine cases in a throwaway repository, including the cutoff skip and the malformed-value fallback |

Provenance: runtime/cli/tests/check-source-tags.vitest.ts

---

## 5. SOURCE METADATA

- Group: Tooling And Scripts
- Playbook ID: 465
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `tooling-and-scripts/source-tag-resolution.md`
