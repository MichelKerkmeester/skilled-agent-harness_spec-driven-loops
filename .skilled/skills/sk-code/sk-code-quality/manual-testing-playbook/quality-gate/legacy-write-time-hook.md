---
id: CQ-016
category: quality_gate
title: 'The legacy write-time hook warns on a labelled comment and says nothing else'
description: "This scenario validates the legacy Claude `PostToolUse` adapter for `CQ-016`. It feeds the adapter a `Write` payload naming a file with one labelled comment and confirms the warning it prints and its exit status, then feeds it a payload for a tool the adapter does not handle and confirms it stays silent."
expected_intent: QUALITY
expected_resources:
  - scripts/hooks/claude-posttooluse.sh
  - scripts/check-comment-hygiene.sh
  - references/code-style-guide.md
catalog_applicable: true
version: 1.0.0.0
---

# CQ-016: The Legacy Write-Time Hook Warns On A Labelled Comment

This document captures the adapter contract, execution process, source anchors and metadata for `CQ-016`.

---

## 1. OVERVIEW

This scenario validates the legacy write-time adapter for `CQ-016`. `scripts/hooks/claude-posttooluse.sh` reads a hook payload on stdin, takes `tool_input.file_path`, and runs the comment-hygiene checker on that one file. When the checker exits 1 with output, the adapter prints a `COMMENT HYGIENE WARNING:` block naming each violation and the escape that suppresses one. It exits 0 whatever happens, so it can never block the edit that triggered it.

The adapter is a shipped resource that no runtime registers: the live write-time warning is the Node entrypoint under `.skilled/hooks/post-edit-quality/claude/`, and this script is kept for direct tests. The scenario therefore drives the adapter by hand with the payload shape the runtime would send, and it pins both halves of the contract: a labelled comment produces the warning, and a payload naming a tool the adapter does not handle produces nothing at all.

### Why This Matters

A write-time warning is the cheapest place to stop an ephemeral artifact label, because it reaches the author before the next turn rather than at the gate. The adapter's whole value depends on two properties this scenario pins. It must warn on a `Write` or an `Edit` payload, and it must stay silent and exit 0 on everything else, because a hook that failed an unrelated tool call would take the session down over a comment. A copy of the adapter that crashed on malformed input, or one that warned on any tool, would pass every test that only checked the happy path.

---

## 2. SCENARIO CONTRACT

Operators confirm that a `Write` payload naming a file with one labelled comment prints the warning and exits 0, and that a payload for a tool the adapter does not handle prints nothing and exits 0.

- Objective: confirm the warning block, the violation line and the exit status of the adapter for a `Write` payload, and its silence for an unrelated tool.
- Real user request: `A comment I just wrote carries an architecture number instead of the reason. Does the write-time hook tell me?`
- Prompt: `Show me what the write-time comment hygiene hook prints for the file I just edited.`

**Exact prompt**:

```text
Show me what the write-time comment hygiene hook prints for the file I just edited.
```

- Fixture: a scratch folder outside the repository holding one JavaScript file whose first line is a labelled comment. The label is joined from two fragments at run time, so no tracked document carries it.

| Fixture part | Content | What the adapter must say |
| --- | --- | --- |
| the file | `<scratch>/sample.js`, holding one labelled comment on line 1 | the warning names that file and line 1 |
| a `Write` payload | `tool_name` `Write`, `cwd` the repository root, `tool_input.file_path` the fixture file | the `COMMENT HYGIENE WARNING:` block, the violation line and the escape line |
| a `Read` payload | the same file, `tool_name` `Read` | nothing on stdout |

- Expected execution process: the operator reads the style guide's comment-hygiene section, builds the fixture, pipes a `Write` payload into the adapter and reads the block it prints, then pipes a payload for an unhandled tool over the same file and confirms silence. Both runs print the adapter's exit status.
- Expected signals: the `Write` run prints the five-line warning block, one violation line holding the file, its line number and the rule, and the escape line, then `write payload exit 0`. The second run prints nothing but `read payload exit 0`.
- Desired user-visible outcome: the author replaces the label with the durable reason before the next turn, and no runtime treats the adapter as a blocker.
- Pass/fail: PASS if every value in the expected-result table below holds and both runs exit 0. FAIL if the warning is missing, the violation line names no line, the unhandled payload produces output, or either run exits non-zero.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Show me what the write-time comment hygiene hook prints for the file I just edited.`

### Commands

Run the commands from the repository root in one shell session, so `TMP` and `LABEL` stay defined.

1. Build the fixture and set `TMP` and `LABEL`.

```bash
TMP="$(mktemp -d)"
LABEL="$(printf '%s-%s' ADR 12)"
printf '// see %s\n' "$LABEL" > "$TMP/sample.js"
```

2. Feed the adapter a `Write` payload, then a payload for a tool it does not handle.

```bash
node -e 'process.stdout.write(JSON.stringify({ tool_name: "Write", cwd: process.cwd(), tool_input: { file_path: process.argv[1] } }))' "$TMP/sample.js" \
  | python3 .skilled/skills/sk-code/sk-code-quality/scripts/hooks/claude-posttooluse.sh
echo "write payload exit $?"
node -e 'process.stdout.write(JSON.stringify({ tool_name: "Read", cwd: process.cwd(), tool_input: { file_path: process.argv[1] } }))' "$TMP/sample.js" \
  | python3 .skilled/skills/sk-code/sk-code-quality/scripts/hooks/claude-posttooluse.sh
echo "read payload exit $?"
```

3. `bash .skilled/skills/sk-code/sk-code-quality/scripts/hooks/claude-posttooluse.test.sh; echo "suite exit $?"`
4. `for p in scripts/hooks/claude-posttooluse.sh scripts/check-comment-hygiene.sh references/code-style-guide.md; do test -e ".skilled/skills/sk-code/sk-code-quality/$p" && echo "OK $p" || echo "MISS $p"; done`
5. Clean up: `rm -rf "$TMP"`

### Expected

Step 2 prints the warning block, with the scratch folder in place of `<scratch>` and the seeded label in place of `<label>`:

```text
COMMENT HYGIENE WARNING: ephemeral-artifact pointers found in code comments.
These references are unstable and will rot. Replace each with the durable WHY.
Violations in <scratch>/sample.js:
  <scratch>/sample.js:1: // see <label> [ADR reference]
See: .skilled/skills/sk-code/sk-code-quality/references/code-style-guide.md §4
Escape: add 'hygiene-ok' to a comment line to suppress the warning for that line.

write payload exit 0
read payload exit 0
```

The unhandled payload prints no warning line between the two exit lines. Step 3 prints `Post-edit adapter parse regression fixture passed` and `suite exit 0`: that suite parses the live Node adapter under `.skilled/hooks/post-edit-quality/claude/`, so it pins the entrypoint the runtime registers rather than this compatibility script. Step 4 prints `OK` for all three paths. Step 5 prints nothing.

| Signal | Expected value |
| --- | --- |
| `Write` warning block | the five lines above, in that order |
| violation line | names the fixture file, line `1` and the rule's reason |
| `Write` exit status | `0` |
| unhandled payload output | no warning block |
| unhandled payload exit status | `0` |
| suite result | `Post-edit adapter parse regression fixture passed` |
| suite exit | `0` |
| scratch folder after step 5 | removed |

### Evidence

Command transcript from steps 1 to 5, the frontmatter block with `expected_intent: QUALITY`, the warning block, both exit lines, the suite's closing line and its exit line, and the three `OK` lines. Save the transcript under the dated run label the playbook names. Never paste the seeded label into a tracked document; the transcript belongs in the run folder.

### Pass / Fail

- **Pass**: the `Write` payload prints the warning block with the violation line, both payloads exit `0`, the unhandled payload prints no warning, the suite passes, and the scratch folder is removed.
- **Fail**: the warning is missing or names no line, the unhandled payload produces a warning, either exit is non-zero, or the suite fails.

### Failure Triage

1. If the adapter prints nothing for the `Write` payload, confirm the payload carries `tool_name` `Write` and an existing `tool_input.file_path`. A path that does not exist, or a payload that does not parse, is ignored on purpose.
2. If the adapter prints the checker-not-found warning on stderr, it resolved the checker from the `cwd` field and then beside itself. Confirm the payload's `cwd` is the repository root.
3. If the violation line is missing while the warning block prints, the checker exited with something other than 1 or printed nothing. Run the checker by hand on the same file and read its output.
4. If the suite fails, it has copied the live Node adapter and broken a copy of it on purpose. Read the failing step; the suite asserts that the broken copy is rejected, so a pass there means `node --check` stopped rejecting a merge marker.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| Catalog: no entry; the nearest is [`rule-overrides-and-hygiene-policy.md`](../../../feature-catalog/quality-gate/rule-overrides-and-hygiene-policy.md) | The feature catalog describes the hygiene policy and its layers, and names no write-time adapter entry |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [claude-posttooluse.sh](../../scripts/hooks/claude-posttooluse.sh) | The compatibility adapter this scenario drives |
| [claude-posttooluse.test.sh](../../scripts/hooks/claude-posttooluse.test.sh) | The parse regression suite over the live Node adapter |
| [check-comment-hygiene.sh](../../scripts/check-comment-hygiene.sh) | The checker the adapter runs on one file |
| [code-style-guide.md](../../references/code-style-guide.md) §4 | The comment-hygiene rule the warning names |
| [SKILL.md](../../SKILL.md) §3 | The ON_DEMAND load level of the legacy hook |

---

## 5. SOURCE METADATA

- Group: sk-code-quality quality gate
- Playbook ID: CQ-016
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `quality-gate/legacy-write-time-hook.md`
