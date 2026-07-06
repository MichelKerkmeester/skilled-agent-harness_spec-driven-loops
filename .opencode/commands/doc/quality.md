---
description: Validate, score, and optimize an EXISTING document — report-only by default. Routes to the sk-doc doc-quality packet.
argument-hint: "<file-or-glob> [--fix] [--optimize]"
allowed-tools: Read, Bash, Grep, Glob, Edit, Write
---

# /doc:quality

Run a documentation-quality pass on one or more EXISTING documents: extract structure, score quality (DQI), apply the human-voice rules (HVR), and validate against the shared standards. **Report-only by default** — it does not modify files unless `--fix` (apply safe fixes) or `--optimize` (rewrite for AI-friendliness) is passed.

This is a thin router. The workflow, scoring, and doctrine live in the sk-doc parent hub's `doc-quality` packet.

## Execution

1. Load the doc-quality packet contract: `.opencode/skills/sk-doc/doc-quality/SKILL.md`.
2. It consumes the shared doc-quality backbone: `.opencode/skills/sk-doc/shared/scripts/extract_structure.py` (structure + DQI), `shared/scripts/validate_document.py` (validation), `shared/references/global/hvr_rules.md` (human voice), and `doc-quality/references/optimization.md` (optimization procedure).
3. Detect the document type first, then apply the right enforcement level (SKILL/command docs strict, READMEs usability-focused, knowledge docs moderately strict).
4. Default posture is **report** (structure + DQI score + issues + recommendations). Apply changes only under `--fix`/`--optimize`, and never rewrite original content without the flag.

## Routing

- This command is the public entry point for the `doc-quality` workflow mode of the `sk-doc` parent hub (`mode-registry.json` → `workflowMode: doc-quality`).
- For CREATING a new doc (skill/readme/agent/command/catalog/playbook/benchmark/flowchart), use the matching `/create:*` command instead.

User request: $ARGUMENTS
