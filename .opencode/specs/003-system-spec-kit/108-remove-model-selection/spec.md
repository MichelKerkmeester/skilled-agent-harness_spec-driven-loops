---
title: Remove Model Selection Logic from SpecKit Commands
level: 1
status: complete
created: 2026-02-11
---

# Remove Model Selection Logic from SpecKit Commands

## Summary

Remove all user-facing model selection questions (worker model choice Q4/Q5 and AI model choice Q2 in debug) from SpecKit command files. The model is now system-determined — no user choice needed.

## Scope

### In Scope

- 5 MD command files: `complete.md`, `plan.md`, `research.md`, `implement.md`, `debug.md`
- 10 YAML asset files: auto + confirm variants for each command
- Remove Q4/Q5 Worker Model questions and all `worker_model` variables/config
- Remove Q2 AI Model question from `debug.md` and `selected_model`/`model_selection` from debug YAMLs
- Remove "(opus)" from dispatch mode descriptions
- Renumber downstream questions after removals
- Keep hardcoded `model: "opus"` on orchestrator entries (not user-configurable)

### Out of Scope

- Workflow logic changes
- Adding new features
- Changes to non-SpecKit command files

## Motivation

Model selection was unnecessary user friction. The system now determines the model automatically, simplifying the command interface and reducing question count for all SpecKit commands.
