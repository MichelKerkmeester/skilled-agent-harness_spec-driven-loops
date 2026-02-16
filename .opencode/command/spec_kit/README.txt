---
title: "Spec Kit Commands"
description: "Slash commands for the spec folder development lifecycle including planning, implementation, research, debugging, handover, and session resumption."
trigger_phrases:
  - "spec kit command"
  - "spec kit plan"
  - "spec kit implement"
  - "spec kit research"
  - "spec kit debug"
  - "spec kit handover"
  - "spec kit resume"
  - "spec kit complete"
---

# Spec Kit Commands

> Slash commands for the spec folder development lifecycle from planning through completion.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1-overview)
- [2. COMMANDS](#2-commands)
- [3. STRUCTURE](#3-structure)
- [4. WORKFLOW PROGRESSION](#4-workflow-progression)
- [5. EXECUTION MODES](#5-execution-modes)
- [6. USAGE EXAMPLES](#6-usage-examples)
- [7. TROUBLESHOOTING](#7-troubleshooting)
- [8. RELATED DOCUMENTS](#8-related-documents)

---

<!-- /ANCHOR:table-of-contents -->
<!-- ANCHOR:overview -->
## 1. OVERVIEW

The `spec_kit` command group manages the full development lifecycle around spec folders. Commands cover planning, implementation, research, debugging, session handover, resumption, and end-to-end workflows.

Each command loads a YAML workflow from `assets/` and executes it step by step. Most commands support `:auto` and `:confirm` execution modes.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:commands -->
## 2. COMMANDS

| Command | Invocation | Steps | Description |
|---------|------------|-------|-------------|
| **plan** | `/spec_kit:plan <description> [:auto\|:confirm]` | 7 | Create spec folder and plan without implementation |
| **implement** | `/spec_kit:implement <spec-folder> [:auto\|:confirm]` | 9 | Execute pre-planned work (requires existing plan.md) |
| **research** | `/spec_kit:research <topic> [:auto\|:confirm]` | 9 | Technical investigation and documentation |
| **debug** | `/spec_kit:debug [spec-folder]` | varies | Delegate debugging to a specialized sub-agent |
| **handover** | `/spec_kit:handover [spec-folder]` | varies | Create session handover document for continuation |
| **resume** | `/spec_kit:resume [spec-folder] [:auto\|:confirm]` | varies | Resume work on an existing spec folder |
| **complete** | `/spec_kit:complete <description> [:auto\|:confirm] [:with-research] [:auto-debug]` | 14+ | Full end-to-end workflow combining all phases |

### Command Dependencies

| Command | Requires |
|---------|----------|
| `plan` | Nothing (creates new spec folder) |
| `implement` | Existing `plan.md` in spec folder |
| `research` | Nothing (creates research.md) |
| `debug` | Existing spec folder with failing task |
| `handover` | Existing spec folder with work history |
| `resume` | Existing spec folder with saved state |
| `complete` | Nothing (runs full lifecycle) |

---

<!-- /ANCHOR:commands -->
<!-- ANCHOR:structure -->
## 3. STRUCTURE

```
spec_kit/
├── complete.md       # /spec_kit:complete - Full end-to-end workflow
├── debug.md          # /spec_kit:debug - Debug delegation
├── handover.md       # /spec_kit:handover - Session handover
├── implement.md      # /spec_kit:implement - Execute planned work
├── plan.md           # /spec_kit:plan - Planning only
├── research.md       # /spec_kit:research - Technical investigation
├── resume.md         # /spec_kit:resume - Resume existing work
└── assets/           # YAML workflow definitions
    ├── spec_kit_complete_auto.yaml
    ├── spec_kit_complete_confirm.yaml
    ├── spec_kit_debug_auto.yaml
    ├── spec_kit_debug_confirm.yaml
    ├── spec_kit_handover_full.yaml
    ├── spec_kit_implement_auto.yaml
    ├── spec_kit_implement_confirm.yaml
    ├── spec_kit_plan_auto.yaml
    ├── spec_kit_plan_confirm.yaml
    ├── spec_kit_research_auto.yaml
    ├── spec_kit_research_confirm.yaml
    ├── spec_kit_resume_auto.yaml
    └── spec_kit_resume_confirm.yaml
```

---

<!-- /ANCHOR:structure -->
<!-- ANCHOR:workflow-progression -->
## 4. WORKFLOW PROGRESSION

The typical development lifecycle follows this progression:

```
research (optional)
    |
    v
plan (create spec folder + plan.md)
    |
    v
implement (execute plan.md tasks)
    |
    v
debug (if issues arise, 3+ failed attempts)
    |
    v
handover (preserve context for next session)
    |
    v
resume (continue in new session)
```

The `complete` command combines research, plan, and implement into a single invocation.

### Agent Delegation

| Command | Delegates To |
|---------|-------------|
| plan | @speckit (spec folder creation), @research (optional) |
| implement | @general (code changes), @speckit (documentation) |
| research | @research (investigation) |
| debug | @debug (fresh perspective analysis) |
| handover | @handover (context preservation) |
| resume | Loads memory context, continues from last state |
| complete | @research, @speckit, @general as needed |

---

<!-- /ANCHOR:workflow-progression -->
<!-- ANCHOR:execution-modes -->
## 5. EXECUTION MODES

| Mode | Suffix | Behavior |
|------|--------|----------|
| **Auto** | `:auto` | Execute all steps without approval prompts |
| **Confirm** | `:confirm` | Pause at each step and wait for user approval |

The `complete` command supports two additional flags:

| Flag | Effect |
|------|--------|
| `:with-research` | Add research phase before planning |
| `:auto-debug` | Automatically delegate to @debug on failure |

Each mode maps to a YAML workflow file in `assets/`:
- Auto: `spec_kit_<command>_auto.yaml`
- Confirm: `spec_kit_<command>_confirm.yaml`
- Handover uses a single file: `spec_kit_handover_full.yaml`

---

<!-- /ANCHOR:execution-modes -->
<!-- ANCHOR:usage-examples -->
## 6. USAGE EXAMPLES

```bash
# Plan a new feature (creates spec folder + plan.md)
/spec_kit:plan "Add rate limiting to API" :auto

# Implement from an existing plan
/spec_kit:implement specs/012-rate-limiting :confirm

# Research a topic before planning
/spec_kit:research "OAuth 2.0 token refresh patterns" :auto

# Delegate debugging after repeated failures
/spec_kit:debug specs/012-rate-limiting

# Create handover for session continuation
/spec_kit:handover specs/012-rate-limiting

# Resume work in a new session
/spec_kit:resume specs/012-rate-limiting :auto

# Full end-to-end with research and auto-debug
/spec_kit:complete "Add WebSocket support" :auto :with-research :auto-debug
```

---

<!-- /ANCHOR:usage-examples -->
<!-- ANCHOR:troubleshooting -->
## 7. TROUBLESHOOTING

| Problem | Cause | Fix |
|---------|-------|-----|
| Implement fails: "no plan.md" | Spec folder missing plan.md | Run `/spec_kit:plan` first |
| Resume finds no context | No saved memory for spec folder | Start fresh with `/spec_kit:plan` |
| Debug produces no result | No clear failing task to debug | Provide specific error context in the spec folder |
| YAML workflow not found | Missing asset file | Verify `assets/` contains matching YAML for your mode |
| Handover doc is empty | No significant work in session | Ensure you have completed tasks before handover |
| Complete takes too long | Full lifecycle runs all phases | Use specific commands (plan, implement) for faster execution |

---

<!-- /ANCHOR:troubleshooting -->
<!-- ANCHOR:related-documents -->
## 8. RELATED DOCUMENTS

| Document | Purpose |
|----------|---------|
| [Parent: OpenCode Commands](../README.txt) | Overview of all command groups |
| [system-spec-kit SKILL.md](../../skill/system-spec-kit/SKILL.md) | Spec folder workflow, documentation levels, memory system |
| [AGENTS.md](../../../AGENTS.md) | Gate system, agent routing, spec folder requirements |
| [Memory Commands](../memory/README.txt) | Memory operations used by spec kit workflows |
<!-- /ANCHOR:related-documents -->
