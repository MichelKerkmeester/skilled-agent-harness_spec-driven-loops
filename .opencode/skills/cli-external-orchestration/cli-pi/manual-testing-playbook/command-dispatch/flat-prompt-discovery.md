---
title: "PI-007 -- Flat prompt discovery"
description: "This scenario validates the 36 generated flat `.pi/prompts/*.md` files and checks a real Pi startup for prompt-file and extension-load errors for `PI-007`."
version: 1.0.0.0
---

# PI-007 -- Flat prompt discovery

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `PI-007`.

---

## 1. OVERVIEW

This scenario checks that the generated command mirror is flat and non-recursive, then runs the required headless command to ensure a malformed prompt file does not crash session startup.

### Why This Matters

Pi's prompt-template discovery is non-recursive. The generated 36-file flat directory is therefore the runtime boundary: a nested file would not be discovered, while a malformed flat file can prevent a session from loading correctly.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm 36 flat prompt files exist and the standard headless startup reaches Pi without a prompt-parse or extension-load crash.
- Real user request: `Check that all generated commands are flat Pi prompt files, then start Pi and list its available tools without changing any files.`
- Prompt: `List your available tools. Do not modify files. Return the tool names or the exact provider/trust blocker.`
- Expected execution process: Count `.pi/prompts/*.md` at max depth 1 -> run `pi --offline --approve -p "list your available tools"` from an isolated config directory -> inspect output for malformed-prompt or extension errors -> record the exit code and provider text.
- Expected signals: Count is `36`; no malformed prompt or extension factory error appears; the current environment may stop at `No API key found for the selected model`.
- Desired user-visible outcome: Proof that the flat generated prompt package is structurally loadable, with any provider blocker shown plainly.
- Pass/fail: PASS for the flat count and absence of parse/load failure. The provider-backed tool-list turn is SKIP with blocker `provider credentials are absent on this machine` when it cannot produce a model response. FAIL if a prompt or extension error aborts startup.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Count only direct `.pi/prompts/*.md` files.
2. Run the exact Pi command with a temporary `PI_CODING_AGENT_DIR` so no real global lock is touched.
3. Inspect combined output for prompt, extension, trust, and provider errors.
4. Keep the structural PASS separate from the provider-turn SKIP; record the two sub-checks explicitly rather than inventing a fourth verdict state.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| PI-007 | Flat prompt discovery | Verify direct-file count and no startup parse crash | `List your available tools. Do not modify files. Return the tool names or the exact provider/trust blocker.` | `find .pi/prompts -maxdepth 1 -name '*.md' -print | wc -l` -> `tmp=$(mktemp -d /private/tmp/cli-pi-prompt-probe.XXXXXX)` -> copy `.pi/prompts/*.md` into the isolated fixture -> `PI_CODING_AGENT_DIR=$tmp/agent pi --offline --approve -p "list your available tools" </dev/null` | Count `36`; no malformed prompt or extension error; provider text may stop the model turn | Captured count output: `      36`. Isolated live output: `No API key found for the selected model.` / `Use /login to log into a provider via OAuth or API key.` / provider doc paths; `probe_rc=1`; no prompt-parse or extension-factory error. | PASS for the structural and loadability check. SKIP the tool-list response with blocker `provider credentials are absent on this machine`. FAIL on a malformed prompt, invalid extension, or unexpected crash. | Inspect the named prompt file, rerun `sync-prompts-pi.cjs --check`, and isolate the failing resource before changing anything. |

### Optional Supplemental Checks

- Run `node .opencode/skills/system-spec-kit/scripts/pi/sync-prompts-pi.cjs --check` and retain its count and drift result.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Flat discovery and evidence policy |
| `../../SKILL.md` | Prompt-template resource controls and offline dispatch rule |
| `../../references/native-skills-and-extensions.md` | Non-recursive prompt-template caveat |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.pi/prompts/` | Generated flat prompt files |
| `.opencode/skills/system-spec-kit/scripts/pi/sync-prompts-pi.cjs` | Generator and drift checker |

---

## 5. SOURCE METADATA

- Group: Command Dispatch
- Playbook ID: PI-007
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `command-dispatch/flat-prompt-discovery.md`
