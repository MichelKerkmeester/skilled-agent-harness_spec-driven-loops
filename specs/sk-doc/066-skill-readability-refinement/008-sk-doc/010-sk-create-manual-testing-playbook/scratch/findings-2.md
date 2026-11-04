### .skilled/skills/sk-doc/sk-create-manual-testing-playbook/references/conversation-scenarios.md

- [P2] .skilled/skills/sk-doc/sk-create-manual-testing-playbook/references/conversation-scenarios.md:21 | 4 | `## 1. OVERVIEW` opens with the when-to-use paragraph at line 23 and the block-placement fact at line 25; it has no Purpose or When to Use subsection, so the reference template's OVERVIEW skeleton is missing. | Replace lines 21-25 with:

```markdown
## 1. OVERVIEW

### Purpose

The script is one fenced `json conversation` block in section 3 of the scenario file. The block is the source of truth for the conversation turns.

### When to Use

Write a conversation scenario when the behavior depends on multiple prompts, scripted answers, runtime actions, or state checks across a session. One prompt is enough when a single request and its result capture the full behavior. The ordered decision rule, the runtime requirements and the cost of each style live in `SKILL.md` §6, Choosing the Scenario Style.
```

- [P2] .skilled/skills/sk-doc/sk-create-manual-testing-playbook/references/conversation-scenarios.md:135 | 5 | The rule that governs every check - read state only, never write under `$CONVERSATION_REPO_ROOT` - is the last bullet, after the rules at 126-134 that tell the reader how to write checks, so a reader can build a check that writes before meeting the constraint. | Move line 135 to directly after line 126.

- [P2] .skilled/skills/sk-doc/sk-create-manual-testing-playbook/references/conversation-scenarios.md:153 | 7 | One paragraph packs six run settings - the check env vars, the 60-second check timeout, the 120-second setup timeout, the exit-77 skip, the setup env vars and the `--repo-root` resolution - so a reader cannot scan the defaults. | Replace line 153 with:

```markdown
- The runner sets `CONVERSATION_RUNTIME`, `CONVERSATION_REPO_ROOT`, `CONVERSATION_RUN_DIR` (the runtime's evidence folder) and `CONVERSATION_TURN_DIR` (the turn's evidence folder) for each `check` command.
- A check defaults to 60 seconds. Set `CONVERSATION_CHECK_TIMEOUT_MS` to override that bound. An overrun fails as `CHECK_TIMEOUT`.
- Each `setup` command has 120 seconds. An overrun refuses the run as `SETUP_TIMEOUT`.
- Exit 77 skips the runtime with its first non-empty output line as the blocker.
- The runner sets `CONVERSATION_REPO_ROOT` and `CONVERSATION_RUNTIME` for every `setup` command too, so setup can copy project files from the repository without any variable set by hand.
- `CONVERSATION_REPO_ROOT` is the repository the run snapshots, which `--repo-root` can point at a worktree.
```

### .skilled/skills/sk-doc/sk-create-manual-testing-playbook/references/examples.md

- [P2] .skilled/skills/sk-doc/sk-create-manual-testing-playbook/references/examples.md:21 | 4 | `## 1. OVERVIEW` runs a benefit sentence straight into an inline bold `**Core Principle**`; it has no Purpose or When to Use subsection, so the overview never labels why a reader opens the file or when to reach for it. | Replace lines 21-25 with:

```markdown
## 1. OVERVIEW

### Purpose

The fastest way to author a correct playbook is to model it on one that already ships and validates. The reference implementations below are live packages built to the current contract; the templates are the scaffolds to copy from.

### When to Use

- Seeding a new canonical package from a scaffold.
- Studying a shipped, validating package before writing your own.

### Core Principle

Model a new package on a shipped, validating playbook rather than authoring the structure from scratch.
```

### .skilled/skills/sk-doc/sk-create-manual-testing-playbook/references/prompt-voice.md

- [P2] .skilled/skills/sk-doc/sk-create-manual-testing-playbook/references/prompt-voice.md:21 | 4 | `## 1. OVERVIEW` states the default voice and then an inline bold `**Core Principle**`; it has no Purpose or When to Use subsection, so the opening does not follow the reference template's OVERVIEW skeleton. | Replace lines 21-25 with:

```markdown
## 1. OVERVIEW

### Purpose

The canonical `Prompt:` field defaults to **natural-human voice** - how a real user would phrase the request to an AI in conversation. The RCAF (Role-Context-Action-Format) wrapper is the exception, reserved for when the actor IS an AI orchestrator.

### When to Use

- Choosing or reviewing the `Prompt:` voice for a scenario.
- Deciding whether the RCAF wrapper applies.

### Core Principle

When in doubt, prefer natural-human. RCAF is the exception, natural is the default.
```

- [P2] .skilled/skills/sk-doc/sk-create-manual-testing-playbook/references/prompt-voice.md:60 | 6 | The baseline rule for `Real user request:` sits after both voice lists, while the natural-human list's last bullet at line 53 already tells the writer to match that field's voice; the reader meets the dependency before the rule that resolves it. | Move line 60 to directly after line 46 (`## 3. VOICE GUIDELINES`), before `**Natural-human prompts**:`.
