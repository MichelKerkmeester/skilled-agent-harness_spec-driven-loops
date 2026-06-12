# SpecKit Complete Presentation Contract

Presentation source of truth for `/speckit:complete`. The command router owns only mode selection and asset loading. Workflow YAML owns execution. This file owns visible prompts, dashboard layout, and final result displays.

## 1. Startup Presentation

For `:confirm` or no suffix, the consolidated setup prompt is the first visible response. Ask all applicable questions once, then wait. No analysis or tool calls precede the prompt unless the workflow already has an explicit path that needs read-only folder-state classification.

For `:auto`, do not show the consolidated prompt by default. Resolve setup through the auto-mode table below. Ask targeted questions only for fields marked Tier 2.

### Auto Pre-Bound Setup Answers

```yaml
PRE-BOUND SETUP ANSWERS:
  feature_description: Add passwordless login
  spec_folder: <spec-folder>
  execution_mode: AUTONOMOUS
  dispatch_mode: single_agent
  memory_choice: skip
  research_intent: add_feature
  research_integration: false
  context_integration: false
  phase_decomposition: false
  phase_count: 3
  phase_names: ""
  phase_folder: ""
  selected_level: ""
  start_state: ""
  repair_mode: ""
  record_relationships: false
  depends_on: ""
  related_to: ""
  supersedes: ""
```

Unknown fields warn. Malformed lines are parse errors. Marker values override flags; omitted fields fall back to defaults.

### Auto Resolution Table

| Field | Required | Default | Tier 2 |
|-------|----------|---------|--------|
| `feature_description` | Yes | none | No |
| `spec_folder` | Yes | none | Yes, when feature is present but folder choice is ambiguous |
| `execution_mode` | Yes | `AUTONOMOUS` under `:auto` | No |
| `dispatch_mode` | Yes | `single_agent` | No |
| `memory_choice` | No | `skip` when no prior continuity exists | No |
| `research_intent` | Yes | none | Yes |
| `research_integration` | No | `false` | No |
| `context_integration` | No | `false` | No |
| `phase_decomposition` | Yes | `false` | No |
| `phase_count` | No | `3` | No |
| `phase_names` | No | none | No |
| `phase_folder` | No | none | No |
| `selected_level` | No | none | No |
| `start_state` | No | auto-detect | No |
| `repair_mode` | No | none | No |
| `record_relationships` | No | `false` | No |
| `depends_on` | No | none | No |
| `related_to` | No | none | No |
| `supersedes` | No | none | No |

### Consolidated Prompt Template

```text
SpecKit Complete setup

Mode: [auto|confirm|ask]
Feature flags: [with-research yes/no] [with-context yes/no] [with-phases yes/no]

Q0. Feature Description, if not provided: What feature should be built?
Q1. Spec Folder: A) Use existing  B) Create new  C) Update related  D) Skip documentation  E) Phase folder
Q2. Execution Mode, if no suffix: A) Autonomous  B) Interactive
Q3. Dispatch Mode: A) Single Agent  B) Multi-Agent (1+2)  C) Multi-Agent (1+3)
Q4. Prior Work Context, only when prior records exist: A) Latest  B) Recent 3  C) Skip
Q5. Research Intent: A) add_feature  B) fix_bug  C) refactor  D) understand
Q6. Phase Decomposition, if not already enabled: A) No  B) Yes
Q7. Phase Count, if phase decomposition is enabled and not provided: default 3
Q8. Phase Names, if phase decomposition is enabled and not provided: required literal slugs for concrete work areas

If folder intake is required, include the intake interview in this same prompt.

Reply format: "B, A, A, C, A" or "Add auth, B, A, C, A".
```

Never split these questions into separate visible prompts.

### Auto Fail-Fast Display

```text
SpecKit Complete auto setup failed
Missing required inputs: [field-list]
Provide the missing inputs or rerun with :confirm.
STATUS=FAIL ERROR="missing required setup inputs"
```

## 2. Dashboard Layout

```text
SPECKIT COMPLETE DASHBOARD
Spec: [spec_path]
Mode: [AUTONOMOUS|INTERACTIVE]
Step: [current] / 14 - [step name]
Optional flows: research=[on|off] context=[on|off] phases=[on|off]
Planning artifacts: spec.md [status] | plan.md [status] | tasks.md [status] | checklist.md [status]
Implementation: tasks [done]/[total] | P0 [status] | P1 [status]
Validation: [not-run|pass|fail]
Context refresh: [pending|complete]
Next: [next action]
```

### Research Checkpoint

```text
WORKFLOW CHECKPOINT - Research Complete
Research phase complete. Created: research/research.md
Continue to request analysis? [Y/n/review]
```

### Deep-Context Checkpoint

```text
WORKFLOW CHECKPOINT - Deep-Context Complete
Context Report: [spec_folder]/context/context-report.md
Reuse candidates: [N] | Integration points: [N] | Conventions: [N]
Continue to research or specification? [Y/continue, n/skip]
```

### Phase-Decomposition Checkpoint

```text
WORKFLOW CHECKPOINT - Phase Decomposition Complete
Parent: [parent_folder] | Phases: [N] children created
Continue with first child ([first_child_folder])? [Y/n/review]
```

### Final Closeout Checkpoint

```text
WORKFLOW CLOSEOUT
Implementation summary: [exists|missing]
Nested changelog: [written|not applicable|missing]
Validation: [pass|fail]
Continuity: [refreshed|pending]
End workflow or refresh continuity first? [done|memory-save]
```

## 3. Results Display

### Success

```text
All 14 steps executed successfully.
Artifacts: spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md, nested changelog when applicable, graph-metadata.json refreshed, continuity refreshed in canonical spec docs
STATUS=OK PATH=[spec-folder-path]
```

### Failure

```text
SpecKit Complete Failed
Error: [error description] | Step: [step number]
STATUS=FAIL ERROR="[message]"
```

### Next-Step Suggestions

| Condition | Suggested Command | Reason |
|-----------|-------------------|--------|
| Need runtime verification | Use the project-specific verification command | Confirm behavior |
| Need continuity refresh | `/memory:save [spec-folder-path]` | Refresh indexed canonical continuity |
| Found bugs | User-dispatched debug pass | Fresh root-cause analysis |
| Need crash recovery | `/speckit:resume` | Recover session state |
| Record durable rule | `/memory:learn [rule]` | Save repo-wide rule |

End interactive presentations with: `What would you like to do next?`
