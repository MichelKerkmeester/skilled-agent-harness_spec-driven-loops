# /create:folder_readme Presentation Contract

This file is the single source of truth for user-facing presentation in `/create:folder_readme`: startup questions, setup/status dashboards, README/install display contracts, and result templates. The command router owns asset routing only. The workflow YAML owns execution behavior.

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
- create_agent_verified = true
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
@markdown /create:folder_readme [operation] [target]

STATUS=FAIL ERROR="Markdown agent required"
```

## 2. Auto Setup Resolution

For `:auto`, resolve setup using the system auto-mode contract, then load `create_folder_readme_auto.yaml` only when every required field is available.

Pre-bound setup schema:

```yaml
PRE-BOUND SETUP ANSWERS:
  operation: readme
  target_path: .opencode/skills/system-spec-kit
  readme_type: skill
  project_name: semantic-search-mcp
  platforms: all
  output_path: install_guides/Tool - semantic-search-mcp.md
  existing_file: false
  existing_file_action: merge
  execution_mode: AUTONOMOUS
```

Default resolution table:

| Field | Required | Resolves Via | Default | Tier-2 Candidate |
| --- | --- | --- | --- | --- |
| `operation` | Yes | positional token, `--operation`, marker, or path-like default | `readme` for path-like target | Yes |
| `target_path` | README only | README positional target or marker | none | No |
| `readme_type` | README only | `--type`, marker, or targeted choice | none | Yes |
| `project_name` | install only | install positional project name or marker | none | No |
| `platforms` | install only | `--platforms`, marker, or targeted choice | none | Yes |
| `output_path` | install only | `--output`, marker, or recommended path | install guide path | No |
| `existing_file` | No | output existence check or marker | `false` | No |
| `existing_file_action` | Conditional | marker, inline conflict response, or targeted conflict choice | none | Yes |
| `execution_mode` | Yes | `:auto`, `:confirm`, or marker | `AUTONOMOUS` under `:auto` | No |

## 3. Consolidated Startup Prompt

Ask one prompt containing only applicable questions. Do not split these questions across turns.

```text
Before proceeding, please answer:

Q_OP. Operation (if not detected from args)
A) README - Create/update folder documentation
B) Install Guide - Create/update installation guide

README questions (if operation = readme)

Q_R1. Target Path (if not provided)
Where should the README be created?
Examples: .opencode/skills/my-skill, src/components, ./

Q_R2. README Type (if not provided via --type)
A) Project - Main project documentation
B) Component - Module/package/skill documentation
C) Feature - Specific feature/system documentation
D) Skill - OpenCode skill documentation

Install guide questions (if operation = install)

Q_I1. Project Name (if not provided)
What project/tool needs an installation guide?

Q_I2. Target Platforms
A) All platforms: macOS, Linux, Windows, Docker
B) macOS only
C) Linux only
D) Custom: macos,linux,windows,docker

Q_I3. Output Location
A) install_guides/[Type] - [Name].md
B) INSTALL.md at project root
C) docs/INSTALL.md
D) Custom path
If an existing file was found: E) Overwrite, F) Merge, G) Cancel

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
- Do not infer target path or project name from context.
- Do not assume platforms without confirmation.

## 4. Setup Dashboard

| Field | Required | Value | Source |
| --- | --- | --- | --- |
| `create_agent_verified` | Yes | `[value]` | Phase 0 self-check |
| `operation` | Yes | `[value]` | Detection or Q_OP |
| `target_path` | README only | `[value]` | Q_R1 or `$ARGUMENTS` |
| `readme_type` | README only | `[value]` | Q_R2 or `--type` |
| `project_name` | install only | `[value]` | Q_I1 or `$ARGUMENTS` |
| `platforms` | install only | `[value]` | Q_I2 or `--platforms` |
| `output_path` | install only | `[value]` | Q_I3 or `--output` |
| `existing_file` | Conditional | `[value]` | Output existence check |
| `existing_file_action` | Conditional | `[value]` | Conflict answer |
| `execution_mode` | Yes | `[value]` | Suffix or Q_MODE |

Proceed only when every required field for the detected operation has a value.

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

## 6. Install Guide Result Template

```text
Installation Guide Created

Project: [name]
Location: [path]
Type: [MCP|CLI|PLUGIN|SDK|SERVICE]
Platforms: [list]

Content:
- AI-First Prompt: OK
- Sections: 11/11 (9 required + 2 optional)
- Prerequisites: [N items]
- Installation Steps: [N steps]
- Configuration Options: [N platforms]
- Troubleshooting: [N issues]

Quality:
- Copy-paste prompt complete: OK
- ASCII diagram included: OK
- All platforms covered: OK
- Quick Reference included: OK

Next Steps:
- Test installation on each platform
- Verify all commands work
- Add screenshots if helpful

STATUS=OK PATH=[output_path]
```

Failure display:

```text
Documentation Creation Failed

Operation: [readme|install]
Error: [error]
Step: [failed_step]

STATUS=FAIL ERROR="[error message]"
```
