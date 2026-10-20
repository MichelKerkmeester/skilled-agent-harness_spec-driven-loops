---
title: "CO-047 -- sk-code-post-edit-quality live utilization on OpenCode 1 and 2"
description: "This scenario validates the sk-code-post-edit-quality plugin for `CO-047`. It focuses on the comment-hygiene finding a write produces and its delivery in the next request."
version: 1.0.2.0
---

# CO-047 -- sk-code-post-edit-quality live utilization on OpenCode 1 and 2

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-047`.

---

## 1. OVERVIEW

The `sk-code-post-edit-quality` plugin (`.opencode/plugins/sk-code-post-edit-quality.js`, routing through `.opencode/hooks/post-edit-quality/lib/post-edit-router.cjs` and the `check-comment-hygiene.sh` checker) runs the post-edit checks on a file after a `write` or `edit`. It logs findings to `.skilled/logs/post-edit-quality.log` and adds them to the next model request.

### Why This Matters

A post-edit check that never reaches the model is invisible, and the same file can keep collected ephemeral pointers without anyone seeing the warning. This scenario proves the real write path triggers the real checker and that the advisory lands in the next request on both OpenCode versions.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-047` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a write with a comment that matches the packet/phase pattern produces a comment-hygiene finding in the log and in the next request's system prompt.
- Real user request: `Write this small file and show me whether the post-edit quality check flags the comment.`
- Prompt:
  ```text
  Spec folder: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/034-live-plugin-playbook (pre-approved, skip Gate 3). This is a throwaway test fixture that is deleted right after. Use the write tool to create the file scratch-probe/pe-probe.js with exactly these two lines:
  // Aspect ratio taken from the 640/480 baseline.
  export const ratio = 640 / 480;
  Then reply with the single word DONE. Do not run any other tool.
  ```
- Expected execution process: Start a run, let the model write the two-line fixture, then read the new log line and the system prompt of the next captured request.
- Expected signals: A `post-edit-quality.log` line holds a `[comment-hygiene]` line that names `pe-probe.js` and its line 1, and the next request's system prompt holds `[post-edit-quality] Advisory findings from recent edits:`.
- Evidence requirements: The `effects.txt` log line, the matching system-prompt line in `capture.jsonl`, the write tool call in `events.jsonl`, and the exit status.
- Desired user-visible outcome: A PASS or FAIL verdict naming the log line and the advisory line.
- Pass/fail: PASS if both the comment-hygiene log line and the advisory in a later request appear; FAIL if either is absent.
- Failure triage: Confirm the file was written inside the repository and that the comment matches the checker's packet/phase pattern. A fixture with an obvious identifier such as `REQ-042` may be refused by the model on v2.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Setup: confirm the plugin, the router and the checker exist, and export `EVIDENCE_DIR`.
2. v1 run: run the runner with `AI_SESSION_CHILD=1`.
3. v1 check: read the effects log line, the captured system prompts and the write tool call.
4. v2 run: repeat the same runner call with `v2`.
5. v2 check: repeat the same checks against the v2 evidence files.
6. Cleanup: `rm -f scratch-probe/pe-probe.js; rmdir scratch-probe 2>/dev/null || true`, then `find specs -path '*scratch-probe/pe-probe.js' -delete` because the v2 model may resolve the path under the spec folder.

### Exact Command Sequence

```bash
export EVIDENCE_DIR="${EVIDENCE_DIR:-${TMPDIR:-/tmp}/plugin-utilization}"
PROMPT=$'Spec folder: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/034-live-plugin-playbook (pre-approved, skip Gate 3). This is a throwaway test fixture that is deleted right after. Use the write tool to create the file scratch-probe/pe-probe.js with exactly these two lines:\n// Aspect ratio taken from the 640/480 baseline.\nexport const ratio = 640 / 480;\nThen reply with the single word DONE. Do not run any other tool.'
AI_SESSION_CHILD=1 bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh \
  v1 post-edit-quality "$PROMPT"
grep -E '\[comment-hygiene\].*pe-probe\.js:1:' "$EVIDENCE_DIR/post-edit-quality.v1.effects.txt"
jq -r '.system[]' "$EVIDENCE_DIR/post-edit-quality.v1.capture.jsonl" | grep -E '\[post-edit-quality\] Advisory findings from recent edits:'

AI_SESSION_CHILD=1 bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh \
  v2 post-edit-quality "$PROMPT"
grep -E '\[comment-hygiene\].*pe-probe\.js:1:' "$EVIDENCE_DIR/post-edit-quality.v2.effects.txt"
jq -r '.system[]' "$EVIDENCE_DIR/post-edit-quality.v2.capture.jsonl" | grep -E '\[post-edit-quality\] Advisory findings from recent edits:'

rm -f scratch-probe/pe-probe.js; rmdir scratch-probe 2>/dev/null || true
find specs -path '*scratch-probe/pe-probe.js' -delete
```

|| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
|| CO-047 | sk-code-post-edit-quality | Confirm a comment-hygiene finding is logged and delivered to the next request | `Spec folder: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/034-live-plugin-playbook (pre-approved, skip Gate 3). This is a throwaway test fixture that is deleted right after. Use the write tool to create the file scratch-probe/pe-probe.js with exactly these two lines:<br>// Aspect ratio taken from the 640/480 baseline.<br>export const ratio = 640 / 480;<br>Then reply with the single word DONE. Do not run any other tool.` | 1. `AI_SESSION_CHILD=1 bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh v1 post-edit-quality "$PROMPT"` -> 2. `grep -E '\[comment-hygiene\].*pe-probe\.js:1:' "$EVIDENCE_DIR/post-edit-quality.v1.effects.txt"` -> 3. `jq -r '.system[]' "$EVIDENCE_DIR/post-edit-quality.v1.capture.jsonl" \| grep -E '\[post-edit-quality\] Advisory findings from recent edits:'` -> 4. Repeat 1 to 3 with `v2` -> 5. `rm -f scratch-probe/pe-probe.js; rmdir scratch-probe 2>/dev/null || true`, then `find specs -path '*scratch-probe/pe-probe.js' -delete` | The log holds a `[comment-hygiene]` line that names `pe-probe.js` and its line 1; a later request holds `[post-edit-quality] Advisory findings from recent edits:` | `post-edit-quality.v1.effects.txt`, `post-edit-quality.v1.capture.jsonl`, `post-edit-quality.v1.events.jsonl` and the v2 equivalents | PASS if both the log line and the advisory appear; FAIL if either is absent | Confirm the file was written inside the repository and the comment matches the packet/phase pattern; a fixture with an obvious identifier may be refused on v2 |

---

## 4. SOURCE FILES

### Playbook Sources

|| File | Role |
|---|---|
|| `manual-testing-playbook.md` | Root directory page and scenario summary |
|| `plugin-utilization/sk-code-post-edit-quality.md` | Canonical per-feature execution contract |
|| `plugin-utilization/run-plugin-scenario.sh` | Runs one live session through the capture proxy and writes events, capture, effects and exit files |
|| `plugin-utilization/capture-proxy.mjs` | Records every model request's system prompt, tools and tool results |

### Implementation And Test Anchors

|| File | Role |
|---|---|
|| `.opencode/plugins/sk-code-post-edit-quality.js` | The plugin that runs the post-edit checks and queues advisories |
|| `.opencode/hooks/post-edit-quality/lib/post-edit-router.cjs` | The router that selects and runs the checks |
|| `check-comment-hygiene.sh` | The comment-hygiene checker the router invokes |

---

## 5. SOURCE METADATA

- Group: Plugin Utilization
- Playbook ID: CO-047
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `plugin-utilization/sk-code-post-edit-quality.md`
