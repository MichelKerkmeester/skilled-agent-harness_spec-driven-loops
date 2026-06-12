# /create:feature-catalog Presentation Contract

This file is the single source of truth for user-facing presentation in `/create:feature-catalog`: startup questions, setup/status dashboards, and result display. The command router owns asset routing only. The workflow YAML owns execution behavior.

## 1. Phase 0 Verification Display

Run this automatic self-check before setup. This is not a user question.

```text
SELF-CHECK: Are you operating as @markdown?

Indicators:
- Invoked with @markdown prefix
- Template-first generation behavior is available
- sk-doc quality validation behavior is available

If all indicators are present:
- create_agent_verified = true
- phase_0_status = PASSED

If any indicator is missing or uncertain:
- Stop before loading workflow YAML
- Display the hard-block message below
```

Hard-block message:

```text
This command requires @markdown for template-first generation and sk-doc validation.
Restart with: @markdown /create:feature-catalog <skill-name> [create|update]

STATUS=FAIL ERROR="Markdown agent required"
```

## 2. Auto Setup Resolution

For `:auto`, resolve setup using the system auto-mode contract, then load `create_feature_catalog_auto.yaml` only when every required field is available.

Pre-bound setup schema:

```yaml
PRE-BOUND SETUP ANSWERS:
  skill_name: system-spec-kit
  operation: update
  source_strategy: hybrid
  skill_path: .opencode/skills/
  catalog_root: .opencode/skills/system-spec-kit/feature_catalog
  execution_mode: AUTONOMOUS
  spec_choice: skip
  spec_path: ""
  memory_choice: skip
```

Default resolution table:

| Field | Required | Resolves Via | Default | Tier-2 Candidate |
| --- | --- | --- | --- | --- |
| `skill_name` | Yes | First positional token or marker | none | No |
| `operation` | Yes | Second positional token or marker | none | No |
| `source_strategy` | Yes | marker or targeted source strategy choice | none | Yes |
| `skill_path` | Yes | `--path`, marker, or default | `.opencode/skills/` | No |
| `catalog_root` | Yes | marker or derived from skill path/name | derived | No |
| `execution_mode` | Yes | `:auto`, `:confirm`, or marker | `AUTONOMOUS` under `:auto` | No |
| `spec_choice` | Yes | marker or targeted documentation choice | none | Yes |
| `spec_path` | Conditional | marker or derived from spec choice | none | No |
| `memory_choice` | No | marker, prior-work detection, or default | `skip` when no prior continuity exists | No |

## 3. Consolidated Startup Prompt

Ask one prompt containing only applicable questions. Do not split these questions across turns.

```text
Before proceeding, please answer:

Q0. Skill Name (if missing)
Required format: hyphen-case folder name.

Q1. Operation (if missing)
A) create
B) update

Q2. Source Strategy
A) Derive from existing manual testing playbook when present
B) Build from a manual feature list or operator-provided inventory
C) Hybrid: derive what exists, then patch gaps manually

Q3. Spec Folder
A) Existing
B) New
C) Update related
D) Skip
E) Phase folder

Q4. Prior Work Context (when the existing spec has prior continuity)
A) Load most recent spec-doc record
B) Load up to 3 most recent spec-doc records
C) Skip

Q5. Execution Mode (if no :auto/:confirm suffix)
A) Interactive (:confirm)
B) Autonomous (:auto)
```

Hard stops:

- Do not infer missing operation from context.
- Do not split setup across multiple prompts.
- Do not continue with missing required fields.

## 4. Setup Dashboard

| Field | Required | Rule | Value |
| --- | --- | --- | --- |
| `create_agent_verified` | Yes | `true` | `[value]` |
| `skill_name` | Yes | explicit, hyphen-case | `[value]` |
| `operation` | Yes | `create` or `update` | `[value]` |
| `source_strategy` | Yes | one normalized choice | `[value]` |
| `skill_path` | Yes | default if omitted | `[value]` |
| `catalog_root` | Yes | derived from skill name and path | `[value]` |
| `execution_mode` | Yes | `:auto` or `:confirm` | `[value]` |
| `spec_choice` | Yes | A/B/C/D/E | `[value]` |
| `spec_path` | Conditional | required for A/B/C/E | `[value]` |

Proceed only when every required field validates.

## 5. Completion Result Template

```text
Feature Catalog Command Complete

Skill: [skill_name]
Operation: [operation]
Source strategy: [source_strategy]
Mode: [:auto|:confirm]
Target: [catalog_root]

Validation:
- Root validation: [PASSED|FAILED]
- Root/per-feature link checks: [PASSED|FAILED]
- Category/per-feature count check: [PASSED|FAILED]

Context:
- Spec path: [spec_path or none]
- Memory loaded: [yes/no]

STATUS=[OK|CANCELLED|FAIL] PATH=[catalog_root]
```
