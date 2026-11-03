---
title: "155 -- Post-save quality review"
description: "This scenario validates the POST-SAVE QUALITY REVIEW block a JSON mode save prints, which reports SKIPPED because the save target is the packet folder, and the reviewer's own suite for issue grading."
audited_post_018: true
version: 1.7.1.0
id: memory-quality-and-indexing-post-save-quality-review
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 155 -- Post-save quality review

## 1. OVERVIEW

This scenario validates the POST-SAVE QUALITY REVIEW block that a JSON mode `generate-context.js` save prints. The save no longer renders a memory file. It hands the reviewer the packet folder and no rendered content, so the reviewer reports `SKIPPED` with the reason `savedFilePath is a directory (phase-parent or unspecified target)`. The issue grading itself, a PASSED review for matching frontmatter and HIGH issues for a mismatched title or missing trigger phrases, is reachable only through the reviewer's own suite, which this scenario also runs.

---

## 2. SCENARIO CONTRACT


- Objective: Verify that a JSON mode save prints the review block with the directory skip reason, and that the reviewer still grades issues when it is given rendered content.
- Real user request: `Please validate Post-save quality review against sessionSummary and tell me whether the expected signals are present: REVIEW block present in stdout with its skip reason; the reviewer suite passes.`
- Prompt: `Validate post-save quality review issue detection and remediation guidance.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: the save exits 0 and stdout carries `POST-SAVE QUALITY REVIEW -- SKIPPED` with `skipReason` starting `savedFilePath is a directory (phase-parent or unspecified target)`; the reviewer suite reports 3 passed tests, including the PASSED case and the HIGH title and trigger-phrase case.
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the save prints the SKIPPED block with the directory reason and the reviewer suite passes; FAIL if the block is absent, reports another status or reason, or the suite fails.

---

## 3. TEST EXECUTION

### Prompt

```
Validate post-save quality review issue detection and remediation guidance.
```

### Commands

1. Build a scratch repository that uses spec-kit, with a copy of a packet:

```bash
R="$PWD"; F="$(mktemp -d)"
mkdir -p "$F/specs/demo" "$F/.skilled/skills" "$F/.opencode"
rsync -a --exclude scratch specs/system-speckit/043-decision-capture/001-decision-capture-build/ "$F/specs/demo/001-demo/"
ln -s "$R/.skilled/skills/system-spec-kit" "$F/.skilled/skills/system-spec-kit"
git -C "$F" init -q
J='{"sessionSummary":"Review the post-save quality block","triggerPhrases":["post-save review check"],"keyDecisions":["Keep the review non-blocking","Report the skip reason"],"importanceTier":"important","contextType":"implementation"}'
```

2. Save in full-auto mode and capture stdout: `(cd "$F" && SPEC_KIT_DB_DIR="$F/.db" node "$R/.skilled/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js" --project-root "$F" --full-auto --json "$J" specs/demo/001-demo) > "$F/save.log" 2>&1; echo "exit=$?"; grep -A12 "POST-SAVE QUALITY REVIEW" "$F/save.log"`
3. Run the reviewer suite: `cd .skilled/skills/system-spec-kit/runtime/cli && npx vitest run --config ../../vitest.config.ts --project cli tests/post-save-review.vitest.ts`

Leave `$F` in place: it is a `mktemp -d` folder under the system temp directory.

### Expected

Step 2 prints `exit=0` and a `POST-SAVE QUALITY REVIEW -- SKIPPED` block whose `skipReason` starts `savedFilePath is a directory (phase-parent or unspecified target)` and names the scratch packet folder. Step 3 reports 1 passed test file and 3 passed tests.

### Evidence

Capture, for every step in the Commands sequence above:

- The exact command or tool call issued, its full output, and its exit status.
- The output lines that carry each expected signal listed in the Scenario Contract.
- Any deviation from the expected result, quoted verbatim from the output.
- The resolved path of every file the run reads or writes.

### Pass / Fail

- **Pass**: The save prints the SKIPPED block with the directory reason and the reviewer suite passes.
- **Fail**: The Pass condition above is not met, or any command in the sequence errors unexpectedly.

### Failure Triage

A `PASSED` or `ISSUES FOUND` block from step 2 means the save now hands the reviewer rendered content: check the `reviewPostSaveQuality` call in `runtime/cli/core/workflow.ts` and update this scenario to the new behavior. A missing block means the review step threw: look for `Post-save review skipped` in the log. A failing suite points at `runtime/cli/core/post-save-review.ts`.

---

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [memory-quality-and-indexing/post-save-quality-review.md](../../feature-catalog/memory-quality-and-indexing/post-save-quality-review.md)
- Related entry: [tooling-and-scripts/json-mode-hybrid-enrichment.md](../../manual-testing-playbook/tooling-and-scripts/json-mode-hybrid-enrichment.md)
- Workflow hook: `runtime/cli/core/post-save-review.ts`
- Save pipeline: `runtime/cli/core/workflow.ts`
- CLI surface: `runtime/cli/continuity/generate-context.ts`
- Reviewer suite: `runtime/cli/tests/post-save-review.vitest.ts`

Provenance: manual only - node .skilled/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js --full-auto --json '<payload>' <spec-folder>

---

## 5. SOURCE METADATA

- Group: Memory Quality and Indexing
- Playbook ID: 155
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `memory-quality-and-indexing/post-save-quality-review.md`
