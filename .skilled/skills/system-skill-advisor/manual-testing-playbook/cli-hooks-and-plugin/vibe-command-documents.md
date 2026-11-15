---
title: "CL-010 The Vibe Brief Names Each Command's Document"
description: "Manual validation that the Vibe prompt hook appends the offered command's document path to the routing head and returns nothing at all in a child session."
version: 1.0.1.0
id: CL-010
category: cli_hooks_and_plugin
stage: routing
---

# CL-010 The Vibe Brief Names Each Command's Document

Prompt: Manual validation that the Vibe prompt hook appends the offered command's document path to the routing head and returns nothing at all in a child session.

---

## 1. OVERVIEW

Vibe has no command loader. A prompt stub names the dash form, so a model that sees `/create:readme` in the routing head has no way to open the command's document unless the brief names it. The Vibe prompt advisor appends one line after the head, `Command documents (read in full before taking one): /create:readme is .skilled/commands/create/readme.md.`

The line lists each command the head names once, in the order the head names them, and skips a command whose document does not resolve in the checkout. A head that names no command keeps no line. A routed command therefore arrives with both the offer and the document to read before taking it.

A dispatched child session gets no brief at all, so the line never appears there. This scenario unsets `AI_SESSION_CHILD` for its parent run and sets it to `1` for its child run.

This scenario pins the document line alone. The head skill, the command's policy word, the scores and the freshness word move with the index and the cache, so they are read, never asserted.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm the Vibe brief appends the offered command's document path to the routing head, and confirm a child session receives no brief at all.
- Real user request: `Why does the Vibe agent offer me a command and never tell me which document to read first?`
- Prompt: `Ask the Vibe prompt advisor for a readme and check that it names the command's document in a parent session but returns nothing in a child session.`
- Expected execution process: Run the two commands below from the repository root, each in its own temporary folder, and read the text before the `Directives:` block.
- Expected signals: `Command documents (read in full before taking one): /create:readme is .skilled/commands/create/readme.md.` after the head in the parent session, and an empty string in the child session.
- Desired user-visible outcome: The reader sees which document to open before taking the command the brief offers, and a dispatched child sees no brief.
- Pass/fail: PASS if the parent head carries the document line and the child run is empty. FAIL if the line is absent, names another command or document, or the child run prints a brief.
- Advisor runtime build is current.
- The Vibe prompt hook module exists at `hooks/vibe/prompt-advisor.mjs`.
- `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` is unset.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Ask the Vibe prompt advisor for a readme and check that it names the command's document in a parent session but returns nothing in a child session.`

### Commands

1. Create the output folder.

```bash
mkdir -p /tmp/skill-advisor-playbook
```

2. Build the brief for `write a readme for the utils folder` in a parent session.

```bash
d=${TMPDIR:-/tmp}; T=$(mktemp -d "${d%/}/cl-010.XXXXXX")
env -u AI_SESSION_CHILD TMPDIR=$T SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR=$T/state \
  node --input-type=module -e '
const { buildAdvisorPart } = await import("./.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs");
const text = await buildAdvisorPart({
  hook_event_name: "pre_agent",
  prompt: process.argv[1],
  session_id: "cl-010-readme-parent",
});
process.stdout.write(text.split("\nDirectives:")[0] + "\n");
' \
  "write a readme for the utils folder" \
  > /tmp/skill-advisor-playbook/cl-010-readme-parent.txt
rm -rf "$T"
cat /tmp/skill-advisor-playbook/cl-010-readme-parent.txt
```

3. Build the same brief in a child session.

```bash
d=${TMPDIR:-/tmp}; T=$(mktemp -d "${d%/}/cl-010.XXXXXX")
env AI_SESSION_CHILD=1 TMPDIR=$T SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR=$T/state \
  node --input-type=module -e '
const { buildAdvisorPart } = await import("./.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs");
const text = await buildAdvisorPart({
  hook_event_name: "pre_agent",
  prompt: process.argv[1],
  session_id: "cl-010-readme-child",
});
process.stdout.write(text.split("\nDirectives:")[0] + "\n");
' \
  "write a readme for the utils folder" \
  > /tmp/skill-advisor-playbook/cl-010-readme-child.txt
rm -rf "$T"
cat /tmp/skill-advisor-playbook/cl-010-readme-child.txt
```

### Exact Prompt Table

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CL-010 | Vibe brief names each command's document | Confirm the Vibe brief appends the offered command's document path to the routing head and returns nothing in a child session | `Ask the Vibe prompt advisor for a readme and check that it names the command's document in a parent session but returns nothing in a child session.` | Commands 1 to 3 above | `Command documents (read in full before taking one): /create:readme is .skilled/commands/create/readme.md.` in the parent session, an empty string in the child session | The two text files plus the terminal transcript | PASS if the parent line matches and the child run is empty. FAIL otherwise | See Failure Triage |

### Expected

- `cl-010-readme-parent.txt` holds the routing head on its first line and the document line as its second line, `Command documents (read in full before taking one): /create:readme is .skilled/commands/create/readme.md.`
- The parent head names `/create:readme` behind the `sk-doc` route. The head, the skill and the policy word are read but not asserted, because the index and the cache decide them.
- `cl-010-readme-child.txt` holds no brief text, because a child session gets no brief at all, and so the document line has no parent to follow.
- Scores, confidences and the freshness word move with the index and the cache, so they are never asserted.

### Evidence

Keep the two text files and the terminal transcript. A passing run reads like this:

```text
write a readme for the utils folder
  parent: Advisor: live; use sk-doc → /create:readme (start) ... pass.
          Command documents (read in full before taking one): /create:readme is .skilled/commands/create/readme.md.
  child:  (empty)
```

### Pass / Fail

- **Pass**: the parent head carries the expected document line and the child run is empty.
- **Fail**: the line is absent, names another command or document, or the child run prints a brief.

### Failure Triage

1. The parent run carries no document line: check `withCommandDocuments()` and `COMMAND_DOCUMENT_LABEL` in `hooks/vibe/prompt-advisor.mjs`, then run `runtime/tests/hooks/vibe-prompt-advisor.vitest.ts`.
2. The line appears in the child run: confirm `AI_SESSION_CHILD=1` sits in the environment of the `node` process, because `buildAdvisorPart()` returns an empty string for a child session.
3. The line names a different path: confirm `.skilled/commands/create/readme.md` resolves in this checkout, because the line is added only for a document that exists.
4. The head prints but the document line does not: read the head, because a head that names no command keeps no line, and rebuild the advisor runtime if the route itself is missing.
5. The parent run is empty: rebuild the advisor runtime with `npm --prefix .skilled/skills/system-skill-advisor/runtime run build` and rerun, because the Vibe part loads the built advisor.

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs` | `withCommandDocuments` and `buildAdvisorPart`, the one that appends the document line and the one that drops the whole brief in a child session |
| `.skilled/skills/system-skill-advisor/runtime/tests/hooks/vibe-prompt-advisor.vitest.ts` | Regression tests for the document line, a repeated head and a command whose document does not resolve |
| [`skill-advisor-hook.md`](../../hooks/skill-advisor-hook.md) | Hook contract doc that states what the prompt hooks deliver |

---

## 5. SOURCE METADATA

- Group: CLI Hooks And Plugin
- Playbook ID: CL-010
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: cli-hooks-and-plugin/vibe-command-documents.md
