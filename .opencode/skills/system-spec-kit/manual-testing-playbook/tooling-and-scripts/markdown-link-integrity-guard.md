---
title: "Markdown link integrity guard"
description: "This scenario validates the markdown link integrity guard. It runs check-markdown-links.cjs and its --self-test, records the current baseline, and confirms an injected broken link is named and counted before reverting."
version: 3.6.0.1
id: tooling-and-scripts-markdown-link-integrity-guard
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# Markdown link integrity guard

## 1. OVERVIEW

This scenario validates the markdown link integrity guard. It focuses on running `check-markdown-links.cjs` and its `--self-test`, recording the current baseline, confirming the guard catches a newly broken link, and confirming it is not fooled by link syntax shown inside inline code.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm the guard names every missing markdown link target, moves its count by exactly one when a link is injected, and ignores link syntax inside inline code.
- Real user request: `Please validate the markdown link integrity guard against node .opencode/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs and tell me whether the expected signals are present: the baseline is recorded; --self-test passes all cases; an injected broken link raises the count by one and is named; inline-code link syntax is not flagged.`
- Prompt: `Validate the markdown link integrity guard against node .opencode/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs and report cited pass/fail evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: the baseline summary line is recorded; --self-test exits 0 with all cases passing; an injected broken link raises the broken count by exactly one and names the offending link; inline-code link syntax is not flagged
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if --self-test passes, an injected broken link raises the count by one and is named, and reverting returns the count to the recorded baseline

---

## 3. TEST EXECUTION

### Prompt

```
Validate the markdown link integrity guard against node .opencode/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs and report cited pass/fail evidence.
```

### Commands

1. `node .opencode/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs` and record the summary line as the baseline broken count
2. `node .opencode/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs --self-test` and confirm exit 0 with all cases passing
3. Append one line to an active scanned doc that links to a target which does not exist on disk (describe it as a relative path with no matching file)
4. Re-run the whole-tree scan and confirm the count is baseline + 1 with the injected link named in the output
5. Revert the injected line and confirm the scan returns to the baseline count

### Expected

the baseline count is recorded; --self-test passes all cases; the injected broken link raises the count by one and is named; reverting restores the baseline

### Evidence

Baseline scan command. The tree is not link-clean: six pre-existing broken links survive, so the baseline is exit 1 with a known set rather than exit 0. The injection legs below are what prove the guard, by showing a seventh link appear and then disappear against that fixed baseline.

```text
$ node .opencode/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs
check-markdown-links: 7888 files, 13414 links checked, 6 broken

Broken markdown links (target resolves under neither the file dir nor repo root):
  .opencode/skills/sk-doc/sk-create-changelog/assets/changelog-template.md  ](./llmstxt-templates.md)
  .opencode/skills/sk-doc/sk-create-changelog/assets/changelog-template.md  ](../references/core-standards.md)
  .opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/README.md  ](../../../system-spec-kit/runtime/plugin-bridges/README.md)
  .opencode/skills/system-spec-kit/assets/template-mapping.md  ](../templates/addons/checklist.md.tmpl)
  .opencode/skills/system-spec-kit/assets/template-mapping.md  ](../templates/addons/checklist.md.tmpl)
  .opencode/skills/system-spec-kit/assets/template-mapping.md  ](../templates/addons/checklist.md.tmpl)

Fix the link, or — if it is an intentional placeholder/example — add it to the ALLOWLIST in this script.
Observed exit code: 1
```

Self-test command:

```text
$ node .opencode/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs --self-test
PASS  inline-code link ignored  → [] (expect [])
PASS  real link on same line as inline code caught  → [missing.md] (expect [missing.md])
PASS  ref-style def inside inline code ignored  → [] (expect [])
PASS  escaped backticks do NOT hide a real link  → [missing.md] (expect [missing.md])
PASS  variable-length delimiter strips whole span  → [] (expect [])
PASS  plain broken link still caught (control)  → [missing.md] (expect [missing.md])

self-test: all cases passed
Observed exit code: 0
```

Injected line appended to this scenario file, then reverted after the injected scan:

```text
Injected broken link for guard verification: [injected missing target](./definitely-missing-link-target-for-guard-verification.md)
```

Injected scan command:

```text
$ node .opencode/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs
check-markdown-links: 7888 files, 13415 links checked, 7 broken

Broken markdown links (target resolves under neither the file dir nor repo root):
  .opencode/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/markdown-link-integrity-guard.md  ](./definitely-missing-link-target-for-guard-verification.md)
  [plus the same six pre-existing broken links shown by the baseline scan]
Observed exit code: 1
```

Reverted scan command:

```text
$ node .opencode/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs
check-markdown-links: 7888 files, 13414 links checked, 6 broken

Broken markdown links (target resolves under neither the file dir nor repo root):
  [the same six pre-existing broken links shown by the baseline scan]
Observed exit code: 1
```

### Pass / Fail

- **Pass**: The baseline is recorded, --self-test passes, an injected broken link raises the count by one and is named, and reverting returns the count to the baseline.
- **Fail**: The Pass condition above is not met, or any command in the sequence errors unexpectedly.

### Failure Triage

Verify the guard script exists and runs with node; confirm the injected link target truly does not resolve against either the file directory or the repository root; confirm the edited file is under a scanned root and not an excluded path segment

---

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [tooling-and-scripts/markdown-link-integrity-guard.md](../../feature-catalog/tooling-and-scripts/markdown-link-integrity-guard.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 420
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `tooling-and-scripts/markdown-link-integrity-guard.md`
