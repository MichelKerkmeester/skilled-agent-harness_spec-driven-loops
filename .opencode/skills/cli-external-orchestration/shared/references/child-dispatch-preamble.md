---
title: Child Dispatch Preamble
description: The block every non-interactive cli-* dispatch prompt must carry, because a dispatched child inherits gates it has no way to answer and no way to observe the exemption for.
trigger_phrases:
  - "child dispatch preamble"
  - "dispatched child asks the spec folder question"
  - "cli dispatch hangs with no output"
  - "pre-resolve gate for a dispatched worker"
importance_tier: important
contextType: implementation
version: 1.0.0.0
---

# Child Dispatch Preamble

A dispatched worker reads this repository's `AGENTS.md` at startup, the same as any other
session, and obeys the gates in it. One of those gates stops before the first write to ask the
operator a documentation-scope question. Nobody is at a prompt, so no answer arrives, and the
dispatch ends having written nothing.

---

## 1. WHY SETTING THE ENVIRONMENT VARIABLE IS NOT ENOUGH

`AGENTS.md` waives that gate for a dispatched child, and conditions the waiver on
`AI_SESSION_CHILD=1` or `SYSTEM_SPEC_GATE_ENFORCE=0` being set in the environment.

Setting the variable makes the waiver **true**. It does not make it **observable**. The reader
being waived is a language model, and a model cannot see an environment variable. It sees the
prompt and the files it opens, nothing else. A condition the reader cannot check is a condition
the reader will not apply.

So the variable and the prompt do different jobs, and both are required:

| | What it does |
|---|---|
| The environment variable | Makes the exemption genuinely apply, and lets code-level gates honor it |
| The preamble below | Lets the model, which is the actual audience, know the condition holds |

Ship one without the other and the dispatch fails silently, at exit code zero.

---

## 2. THE BLOCK

Put this at the very top of the prompt, above the persona and the task. Substitute the real
folder path.

```text
GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  <path>

Proceed directly to the work. Do not print A/B/C/D/E options. Do not stop to confirm anything.
Your task is complete only when files exist on disk and the verification command has been run.
```

The last line matters as much as the first. A dispatch that stops to confirm and a dispatch
that finishes both exit zero.

---

## 3. THE GENERAL FORM

The spec-folder question is the instance that bites most often, not the only one. Any
instruction that tells a session to stop and ask becomes a silent hang in a dispatched child.

Before dispatching, ask which gates the child will read, and pre-resolve every one that
expects an answer from a human. Give the answer in the prompt rather than the permission to
skip it, so the child proceeds on a decision you made rather than on its own judgment.

---

## 4. HOW THE FAILURE PRESENTS

It does not look like a failure.

- Exit code `0`
- A transcript ending in a politely formatted question with lettered options
- Zero files written

An orchestrator that checks the exit status concludes the work is done. Verify that the
artifacts exist on disk, and grep the transcript for the question itself. Exit status has been
observed wrong in both directions: a dispatch that asked and wrote nothing exits zero, and a
dispatch that wrote everything then hit a provider capacity error exits one.

---

## 5. SELF-CHECK

- [ ] The environment variable is set on the child process
- [ ] The preamble block is the first thing in the prompt
- [ ] The spec folder path is filled in, not left as a placeholder
- [ ] Completion is defined as artifacts on disk plus a verification command
- [ ] After the run: artifacts confirmed present, and the transcript checked for the question
