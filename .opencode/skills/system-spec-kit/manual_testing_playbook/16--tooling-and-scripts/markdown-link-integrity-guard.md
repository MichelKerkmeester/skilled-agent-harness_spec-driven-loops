---
title: "Markdown link integrity guard"
description: "This scenario validates the markdown link integrity guard. It runs check-markdown-links.cjs and its --self-test, confirms a clean tree exits 0, and confirms an injected broken link makes the guard exit 1 before reverting."
---

# Markdown link integrity guard

## 1. OVERVIEW

This scenario validates the markdown link integrity guard. It focuses on running `check-markdown-links.cjs` and its `--self-test`, confirming the guard reports a clean tree, catches a newly broken link, and is not fooled by link syntax shown inside inline code.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm the guard exits 0 on a clean tree, exits 1 when a real markdown link target is missing, and ignores link syntax inside inline code.
- Real user request: `Please validate the markdown link integrity guard against node .opencode/skills/system-spec-kit/scripts/check-markdown-links.cjs and tell me whether the expected signals are present: clean tree exits 0; --self-test passes all cases; an injected broken link makes the guard exit 1 and names the link; inline-code link syntax is not flagged.`
- Prompt: `Validate the markdown link integrity guard against node .opencode/skills/system-spec-kit/scripts/check-markdown-links.cjs and report cited pass/fail evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: clean tree exits 0 with a "0 broken" summary; --self-test exits 0 with all cases passing; an injected broken link produces exit 1 with the offending link named; inline-code link syntax is not flagged
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the clean tree exits 0, --self-test passes, an injected broken link exits 1 and is named, and the injection is reverted leaving the tree clean

---

## 3. TEST EXECUTION

### Prompt

```
Validate the markdown link integrity guard against node .opencode/skills/system-spec-kit/scripts/check-markdown-links.cjs and report cited pass/fail evidence.
```

### Commands

1. `node .opencode/skills/system-spec-kit/scripts/check-markdown-links.cjs` and confirm exit 0 with a "0 broken" summary line
2. `node .opencode/skills/system-spec-kit/scripts/check-markdown-links.cjs --self-test` and confirm exit 0 with all cases passing
3. Append one line to an active scanned doc that links to a target which does not exist on disk (describe it as a relative path with no matching file)
4. Re-run the whole-tree scan and confirm exit 1 with the injected link named in the output
5. Revert the injected line and confirm the scan returns to exit 0

### Expected

clean tree exits 0; --self-test passes all cases; injected broken link produces exit 1 with the link named; reverting restores exit 0

### Evidence

Command transcript + output for clean, self-test, injected, and reverted cases + exit codes

### Pass / Fail

- **Pass**: clean tree exits 0, --self-test passes, an injected broken link exits 1 and is named, and reverting restores a clean exit 0
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Verify the guard script exists and runs with node; confirm the injected link target truly does not resolve against either the file directory or the repository root; confirm the edited file is under a scanned root and not an excluded path segment

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [16--tooling-and-scripts/markdown-link-integrity-guard.md](../../feature_catalog/16--tooling-and-scripts/markdown-link-integrity-guard.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 420
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/markdown-link-integrity-guard.md`
