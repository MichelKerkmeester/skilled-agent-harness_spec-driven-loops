---
name: system-spec-kit
description: "Unified documentation and context preservation: spec folder workflow (levels 1-3+), CORE + ADDENDUM template architecture (v2.2), validation, and Spec Kit Memory for context preservation. Mandatory for all file modifications."
allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
version: 2.2.24.0
---

# Spec Kit - Mandatory Conversation Documentation

Orchestrates mandatory spec folder creation for all conversations involving file modifications. Ensures proper documentation level selection (1-3+), template usage, and context preservation through AGENTS.md-enforced workflows.

## Map of Content (MOC)

### Foundation
- [[nodes/when-to-use|When to Use]] — Activation triggers, folder requirements, and agent exclusivity.
- [[nodes/rules|Rules]] — Mandatory ALWAYS, NEVER, and ESCALATE IF conditions for working with specs.

### Workflow & Routing
- [[nodes/gate-3-integration|Gate 3 Integration]] — How to ask the user for spec routing before modifying any files.
- [[nodes/progressive-enhancement|Progressive Enhancement]] — Complexity detection and the 3-level documentation system (CORE + ADDENDUM).
- [[nodes/validation-workflow|Validation Workflow]] — Using `validate.sh` to ensure documentation completeness.

### Spec Folder Operations
- [[nodes/folder-naming-versioning|Folder Naming & Versioning]] — Naming conventions and sub-folder versioning for iterative work.
- [[nodes/checklist-verification|Checklist Verification]] — Using the checklist as an active, evidence-based verification tool for Level 2+ tasks.

### Context Preservation
- [[nodes/context-preservation|Context Preservation]] — Creating point-in-time snapshots using `generate-context.js`.
- [[nodes/memory-system|Spec Kit Memory System]] — Details on the hybrid search MCP, caching, tiers, and retrieval modes.
