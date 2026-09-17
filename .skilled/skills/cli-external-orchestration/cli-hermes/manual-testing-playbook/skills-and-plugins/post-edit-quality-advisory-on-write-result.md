---
title: "HERMES-024 -- Post-edit quality advisory on a write result"
description: "Confirm the repo's post-edit quality core runs after a Hermes write_file and its advisory is appended to the tool result, for `HERMES-024`."
version: 1.0.0.0
---

# HERMES-024 -- Post-edit quality advisory on a write result

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `HERMES-024`.

---

## 1. OVERVIEW

The `repo-guards` plugin runs the post-edit quality core inside `transform_tool_result` for `write_file` and `patch` (Hermes runs post and transform hooks on separate bounded worker threads, so the core must run in the transform itself) and appends the core's advisory to the tool result.

### Why This Matters

The other six runtimes run this guard through their hook adapters; a Hermes session that skipped it would be the one place the rule does not hold. The proof is the guard's own text arriving in the session.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `HERMES-024` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the post-edit quality advisory is appended to a Hermes write_file result for a planted comment-hygiene violation inside the repo.
- Real user request: `Have Hermes write a file with a spec-path comment and show me the guard caught it.`
- Prompt: `Use write_file to create $P/hyg-live.py containing exactly these two lines: a Python comment line reading '# see REQ-001 in specs/foo/001-bar/spec.md' and then 'x = 1'. Then reply with the write_file tool's complete result text verbatim, nothing else.`
- Expected execution process: run the command sequence in §3 from the repository root with a 300-second alarm on the dispatch, capture stdout, stderr, exit code and elapsed seconds separately, then judge the result against the pass/fail criteria below.
- Expected signals: Exit code `0`; the quoted tool result carries the write's JSON followed by `COMMENT HYGIENE WARNING: ephemeral-artifact pointers found in code comments.` naming line 1 of the file; `session_id:` on stderr. The file must live inside the repository: the core stays silent for paths outside it.
- Evidence: stdout, exit code, elapsed seconds, the stderr session id, the created file
- Desired user-visible outcome: a concise verdict naming the observed guard text and the evidence behind it.
- Pass/fail: PASS when the warning text is in the quoted result; FAIL when the result is the bare write JSON or the write did not happen; SKIP only on a named blocker.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm the global preconditions in the root playbook, including `command -v hermes` and the plugin allowlist entry.
3. Run the command sequence below exactly as written, from the repository root.
4. Capture stdout, stderr, exit code and elapsed seconds separately.
5. Judge the result against the pass/fail criteria and record the verdict with its evidence.

### Commands

```bash
P=specs/cli-external-orchestration/071-cli-hermes-creation/010-hermes-hook-parity/scratch; rm -f "$P/hyg-live.py"
HERMES_ENABLE_PROJECT_PLUGINS=1 perl -e 'alarm 300; exec @ARGV' -- hermes chat -Q --oneshot --ignore-rules --source tool \
  --provider llmgateway --model glm-5.3-flash --reasoning none -t file,todo --max-turns 2 --run-budget 150 \
  -q "Use write_file to create $P/hyg-live.py containing exactly these two lines: a Python comment line reading '# see REQ-001 in specs/foo/001-bar/spec.md' and then 'x = 1'. Then reply with the write_file tool's complete result text verbatim, nothing else." </dev/null >out.txt 2>err.txt
echo $?
grep -c "COMMENT HYGIENE WARNING" out.txt
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| HERMES-024 | Post-edit quality advisory on a write result | Confirm the post-edit quality advisory is appended to a Hermes write_file result for a planted comment-hygiene violation inside the repo. | `Use write_file to create $P/hyg-live.py containing exactly these two lines: a Python comment line reading '# see REQ-001 in specs/foo/001-bar/spec.md' and then 'x = 1'. Then reply with the write_file tool's complete result text verbatim, nothing else.` | the `hermes chat` dispatch in §3 | Exit code `0`; the quoted tool result carries the write's JSON followed by `COMMENT HYGIENE WARNING: ephemeral-artifact pointers found in code comments.` naming line 1 of the file; `session_id:` on stderr. The file must live inside the repository: the core stays silent for paths outside it. | stdout, exit code, elapsed seconds, the stderr session id, the created file | PASS when the warning text is in the quoted result; FAIL when the result is the bare write JSON or the write did not happen; SKIP only on a named blocker. | Harness: the plugin did not load (allowlist). Dependency: provider missing. Adapter: the advisory never reaches the result, which points at the hook thread ordering |

### Recorded Result

**Executed 2026-09-15**: exit 0 after 30 s, the quoted result ended with `COMMENT HYGIENE WARNING: ephemeral-artifact pointers found in code comments.`, session `20260915_074652_824086`. An earlier build staged the advisory in `post_tool_call` and the session showed the bare write JSON twice (sessions `20260915_073212_7843c3` and the debug rerun), which is why the core now runs inside the transform hook.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `skills-and-plugins/post-edit-quality-advisory-on-write-result.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SYNC.md](../../../../../../.hermes/SYNC.md) | What the plugin bridges and how |
| [hook-contract.md](../../references/hook-contract.md) | The plugin hook map |
| `.opencode/hooks/post-edit-quality/devin/post-edit-quality.cjs` | The core the bridge runs |

---

## 5. SOURCE METADATA

- Group: Skills And Plugins
- Playbook ID: HERMES-024
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `skills-and-plugins/post-edit-quality-advisory-on-write-result.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
