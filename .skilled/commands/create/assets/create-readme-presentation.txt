# /create:readme Presentation Contract

This file is the single source of truth for user-facing presentation in `/create:readme`: startup questions, setup/status dashboards, the README display contract, and result templates. The command router owns asset routing only. The workflow YAML owns execution behavior.

## 1. Phase 0 Verification Display

Run this automatic self-check before setup. This is not a user question.

```text
SELF-CHECK: Are you operating as the @markdown agent?

Indicators:
- Invoked with @markdown prefix
- Template-first workflow capabilities are available
- DQI scoring behavior is available
- sk-doc skill integration is available

If all indicators are present:
- create_readme_verified = true
- Continue to setup

If any indicator is missing or uncertain:
- Stop before loading workflow YAML
- Display the hard-block message below
```

Hard-block message:

```text
MARKDOWN AGENT REQUIRED

This command requires the @markdown agent for:
- Template-first workflow
- DQI scoring
- sk-doc skill integration

Restart with:
@markdown /create:readme [operation] [target]

STATUS=FAIL ERROR="Markdown agent required"
```

## 2. Auto Setup Resolution

For `:auto`, resolve setup using the system auto-mode contract, then load `create-readme-auto.yaml` only when every required field is available.

Pre-bound setup schema:

```yaml
PRE-BOUND SETUP ANSWERS:
  operation: readme
  target_path: .skilled/skills/system-spec-kit
  readme_type: skill
  existing_file: false
  existing_file_action: merge
  execution_mode: AUTONOMOUS
```

Default resolution table:

| Field | Required | Resolves Via | Default | Tier-2 Candidate |
| --- | --- | --- | --- | --- |
| `operation` | Yes | positional token, `--operation`, marker, or path-like default | `readme` | Yes |
| `target_path` | Yes | README positional target or marker | none | No |
| `readme_type` | Yes | `--type`, marker, or targeted choice | none | Yes |
| `existing_file` | No | output existence check or marker | `false` | No |
| `existing_file_action` | Conditional | marker, inline conflict response, or targeted conflict choice | none | Yes |
| `execution_mode` | Yes | `:auto`, `:confirm`, or marker | `AUTONOMOUS` under `:auto` | No |

## 3. Consolidated Startup Prompt

Ask one prompt containing only applicable questions. Do not split these questions across turns.

```text
Before proceeding, please answer:

README questions

Q_R1. Target Path (if not provided)
Where should the README be created?
Examples: .skilled/skills/my-skill, src/components, ./

Q_R2. README Type (if not provided via --type)
A) Project - Main project documentation
B) Component - Module/package/skill documentation
C) Feature - Specific feature/system documentation
D) Skill - OpenCode skill documentation

If an existing README was found: E) Overwrite, F) Backup and overwrite, G) Merge, H) Cancel

Common question

Q_MODE. Execution Mode (if no :auto/:confirm suffix)
A) Interactive - confirm at each step
B) Autonomous - execute without prompts

Reply with answers for applicable questions only.
```

Hard stops:

- Do not proceed until all applicable questions are answered.
- Do not auto-create directories without user confirmation.
- Do not auto-select execution mode without suffix or explicit choice.
- Do not infer the target path from context.

## 4. Setup Dashboard

| Field | Required | Value | Source |
| --- | --- | --- | --- |
| `create_readme_verified` | Yes | `[value]` | Phase 0 self-check |
| `operation` | Yes | `[value]` | Detection default |
| `target_path` | Yes | `[value]` | Q_R1 or `$ARGUMENTS` |
| `readme_type` | Yes | `[value]` | Q_R2 or `--type` |
| `existing_file` | Conditional | `[value]` | Output existence check |
| `existing_file_action` | Conditional | `[value]` | Conflict answer |
| `execution_mode` | Yes | `[value]` | Suffix or Q_MODE |

Proceed only when every required field has a value.

## 5. README Result Template

```text
README Created

Location: [path]
Type: [project|component|feature|skill]

Structure:
- Title + Tagline: OK
- Sections: [N] numbered
- Tables: [N]
- Code blocks: [N]
- ASCII diagrams: [N]

Quality:
- All sections linked: OK
- No placeholders: OK
- Horizontal rules: OK

Next Steps:
- Review for accuracy
- Add screenshots if applicable
- Test all code examples

STATUS=OK PATH=[readme-path]
```

Failure display:

```text
Documentation Creation Failed

Operation: readme
Error: [error]
Step: [failed_step]

STATUS=FAIL ERROR="[error message]"
```
