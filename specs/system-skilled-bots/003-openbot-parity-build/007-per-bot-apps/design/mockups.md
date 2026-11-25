---
title: "Design: the text surfaces an operator and an author read"
description: "Literal mockups of every surface this phase changes: the checker's pass and fail output, the two refusal lines on stderr, the run record as jq prints it, the template block an author copies and the author reference line, plus the surfaces this phase deliberately leaves alone."
trigger_phrases:
  - "apps checker output"
  - "apps refusal line"
  - "apps template block"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# The text surfaces an operator and an author read

This phase adds no verb, no screen frame and no interactive surface. Every surface it changes is text: the checker's stdout, the CLI's stderr, the run record a reader inspects and the template and reference an author reads. Each block below is the literal text, so a builder copies it rather than inventing a wording.

---

## 1. THE CHECKER ON THE DEFECT FIXTURE

The command and its whole output. The two `PASS` lines are the checker's existing config and identity lines.

```text
$ node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs .skilled/skills/system-skilled-bots/scripts/fixtures/apps-unknown-server
PASS: config: bots/config.json reads cleanly
PASS: identity: local/tool (from config)
FAIL: apps-unknown-server: bots/nightly-digest/BOT.md: nosuchserver
exit=1
```

The `FAIL` line names the invariant, the file and the unknown names. It names `nosuchserver` and not `github`, so an author reads which entry to fix.

---

## 2. THE CHECKER ON THE CLEAN FIXTURE

The same command over the fixture that declares no `apps`. The output is the one the checker prints today, unchanged, which is what makes this the proof that the new invariant refuses nothing the old checker passed.

```text
$ node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs .skilled/skills/system-skilled-bots/scripts/fixtures/clean
PASS: config: bots/config.json reads cleanly
PASS: identity: local/tool (from config)
PASS: definition: bots/nightly-digest/BOT.md parses as nightly-digest
PASS: executor-bounds: bots/nightly-digest/BOT.md: runtime cli-codex within the executor's bounds
PASS: isolation: bots/nightly-digest/BOT.md: shared
PASS: posture: bots/nightly-digest/BOT.md: cli-codex honors sandbox workspace-write
PASS: schedule: bots/nightly-digest/BOT.md: "0 9 * * *" translates to 1 calendar dictionaries
PASS: label: bots/nightly-digest/BOT.md: com.skilled.bots.local_2ftool.nightly-digest.0
exit=0
```

No line is added for `apps-unknown-server`, because a definition that declares no `apps` has no name to check.

---

## 3. THE TWO REFUSAL LINES

A run refused before dispatch prints one line on stderr in the CLI's existing `bots: <reason>: <detail>` shape. [SOURCE: .skilled/bin/bots.cjs:213]

An unknown server name:

```text
$ bots run nightly-digest
bots: apps-refused: apps-unknown-server: nosuchserver
exit=4
```

A declaration with no worktree to place it in:

```text
$ bots run nightly-digest
bots: apps-unenforceable: apps is declared and isolation is shared, so a filtered config needs a worktree
exit=4
```

A checkout with no config, for a bot that declares `apps`:

```text
$ bots run nightly-digest
bots: apps-refused: utcp-config-missing: /Users/ada/code/hello/.utcp_config.json
exit=4
```

A malformed declaration, which is a parse refusal and so reads as `definition-malformed`:

```text
$ bots run nightly-digest
bots: definition-malformed: apps-invalid: apps: expected a list of server names
exit=4
```

The reason is the cause the record carries and the detail is the module's own string, so the line and the record never disagree.

---

## 4. THE RUN RECORD AS A READER SEES IT

The posture block of a worktree run that declared `apps: [github]`:

```text
$ jq '.posture' ~/.local/state/system-skilled-bots/local%2Ftool/records/20261125T211204Z-7c1e9a40.json
{
  "isolation": "worktree",
  "sandbox": "workspace-write",
  "executorKind": "cli-codex",
  "model": null,
  "apps": [
    "github"
  ]
}
```

The posture block of a shared run that declared nothing:

```text
$ jq '.posture' ~/.local/state/system-skilled-bots/local%2Ftool/records/20261125T211204Z-7c1e9a40.json
{
  "isolation": "shared",
  "sandbox": "read-only",
  "executorKind": "cli-opencode",
  "model": null,
  "apps": []
}
```

The second block is the limit the packet decision D5 confirms. The record says `[]` and the child read the repository config, because a shared run's working directory is the checkout. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/decisions.md:28]

A record written before this phase prints the same block with no `apps` key, and a reader takes it as `[]`.

---

## 5. THE TEMPLATE BLOCK AN AUTHOR COPIES

One key and one comment, placed after `secrets` and before `precheck`, in the comment style the template already uses. [SOURCE: .skilled/skills/system-skilled-bots/assets/bot-template.txt:21]

```text
# Connector servers this bot may reach, by name from .utcp_config.json. Default: none.
apps: null
```

The comment names the default, because the default is the surprising half: an author who omits the key gets no server and not every server. The word `none` is the whole fail-closed rule in one word.

The template's own header comment already tells an author that the file is a starting point, so the new comment adds no new instruction about how to use the file.

---

## 6. THE AUTHOR REFERENCE LINE

The reference lists every field and its default in one sentence. The `apps` field joins that list, and the shared-run limit gets its own sentence because it is the one case where the field does nothing.

```text
`apps` names the connector servers the run may reach, by `manual_call_templates[].name` from the checkout's `.utcp_config.json`. Omit it and the run reaches no server. A name the config does not hold is refused `apps-unknown-server` by the checker and `apps-refused` by the run, never dropped. The field narrows a run with its own worktree: a shared run's child reads the repository config through the project pin, so a shared bot that declares `apps` is refused `apps-unenforceable` and a shared bot that declares none still reaches every server.
```

The last clause is the limit stated plainly. An author who reads only the first sentence would believe a shared bot is narrowed, and the sentence exists so that belief is not available.

---

## 7. THE FEATURE CATALOGUE LINES

Two catalogue files name the field and the invariant. The field list gains one entry and the hard-invariant list gains one entry, in the same sentence style as their neighbours.

```text
The frontmatter accepts `id`, `trigger`, `runtime`, `budget`, `enabled`, `delivery`, `isolation`, `sandbox`, `secrets`, `apps`, `precheck`, `spec_folder` and the document `version`.
```

```text
Hard invariants include ... an unknown delivery channel and an `apps` name the checkout's `.utcp_config.json` does not hold.
```

---

## 8. WHAT THIS PHASE LEAVES ALONE

| Surface | Why it does not change |
|---------|------------------------|
| `bots status` and its `--json` payload | the posture block is not a status column, and the packet's status contract fixes the row set |
| `bots activity` and `bots inbox` | neither reads a posture field |
| the terminal screen | it reads four verbs and none of them is this phase's |
| the five project MCP configs | the pin stays and the worktree write is what makes it resolve to the filtered file |
| the `/doctor:mcp` wiring check | it asserts the pin, and the pin is unchanged |
| the checker's exit codes | 0, 1 and 2 keep their meanings, and the new invariant uses 1 like every other hard invariant |

A reader who expects a new verb or a new screen frame finds neither, and that is the design: the phase changes what a run reaches and what the record says, not what an operator types.
