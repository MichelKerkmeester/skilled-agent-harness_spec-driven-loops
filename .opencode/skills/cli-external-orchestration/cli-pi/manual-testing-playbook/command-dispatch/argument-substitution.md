---
title: "PI-008 -- Argument substitution"
description: "This scenario checks the static `$ARGUMENTS` substitution token in a generated Pi prompt and isolates the provider-dependent multi-argument dispatch sub-check for `PI-008`."
version: 1.0.0.0
---

# PI-008 -- Argument substitution

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `PI-008`.

---

## 1. OVERVIEW

This scenario validates the real documented Pi alias `$ARGUMENTS`, which carries the canonical command's positional `$1..$N` inputs into generated prompt files.

### Why This Matters

The static token can be correct while a full language-model turn still remains untested. Keeping those claims separate prevents a generated prompt file from being marked as end-to-end verified without provider credentials.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm a generated prompt uses `$ARGUMENTS` as the documented argument bridge and identify the live multi-argument check separately.
- Real user request: `Check the generated deep-research prompt and make sure extra arguments reach Pi through the documented placeholder.`
- Prompt: `Inspect the generated deep-research Pi prompt. Confirm the documented argument placeholder is present, then explain which live check would prove two arguments survive a real dispatch.`
- Expected execution process: Read `.pi/prompts/deep-research.md` -> locate `$ARGUMENTS` and its positional alias text -> optionally run a real prompt with two arguments when credentials exist.
- Expected signals: The file contains `Arguments passed to this prompt are available as $ARGUMENTS` and `User request: $ARGUMENTS`; the static substitution check passes.
- Desired user-visible outcome: Confidence in the generated static token with an honest boundary around live argument expansion.
- Pass/fail: PASS for the static substitution check. SKIP the live dispatch-with-real-arguments sub-check with blocker `provider credentials are absent on this machine`. FAIL if the generated file uses an undocumented or missing token.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Read the generated file in full enough to capture the token and surrounding instructions.
2. Search for `$ARGUMENTS`, `$1`, and `$N` evidence.
3. Record the static PASS.
4. Only with credentials, dispatch a two-argument prompt and inspect the resulting event/output content.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| PI-008 | Argument substitution | Verify the generated placeholder and isolate live expansion | `Inspect the generated deep-research Pi prompt. Confirm the documented argument placeholder is present, then explain which live check would prove two arguments survive a real dispatch.` | `rg -n '\$ARGUMENTS|\$1|\$2|\$@|\$\{1:-default\}' .pi/prompts/deep-research.md` -> `sed -n '1,120p' .pi/prompts/deep-research.md` -> with credentials only, `PI_CODING_AGENT_DIR=<tmp> pi --offline --approve -p "/deep-research alpha beta" </dev/null` | Static output contains lines 10 and 12 with `$ARGUMENTS`; live argument expansion is not asserted without a model turn | Captured output: `10:Arguments passed to this prompt are available as $ARGUMENTS and map to the canonical command's $ARGUMENTS / positional $1..$N inputs.` and `12:User request: $ARGUMENTS`. | PASS for static token usage. SKIP the live two-argument sub-check with blocker `provider credentials are absent on this machine`. FAIL if the static token is absent or changed to an undocumented alias. | Re-run the sync generator check, inspect the canonical command source, and do not hand-edit the generated file. |

### Optional Supplemental Checks

- Compare one single-argument and one multi-argument generated command after a provider-backed run and retain the JSONL events.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Static-versus-live verdict policy |
| `../../SKILL.md` | Prompt-template and headless mode boundaries |
| `../../references/native-skills-and-extensions.md` | Prompt-template discovery caveat |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.pi/prompts/deep-research.md` | Generated prompt and static `$ARGUMENTS` evidence |
| `.opencode/skills/system-spec-kit/scripts/pi/sync-prompts-pi.cjs` | Generator source |

---

## 5. SOURCE METADATA

- Group: Command Dispatch
- Playbook ID: PI-008
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `command-dispatch/argument-substitution.md`
