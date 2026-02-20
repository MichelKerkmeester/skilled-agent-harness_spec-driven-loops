---
name: workflows-code--full-stack
description: "Stack-agnostic development orchestrator guiding developers through implementation, testing, and verification phases with automatic stack detection via marker files and bundled stack-specific knowledge."
allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
version: 1.1.0.0
---

# Code Workflows - Stack-Agnostic Development Orchestrator

Stack-agnostic skill that guides developers through implementation, testing, and verification phases. Automatically detects the active stack via marker files and routes to the appropriate bundled knowledge and tooling.

> **Navigation note:** This is a supplemental deep-dive index. `SKILL.md` remains the primary entrypoint for activation rules, routing logic, and core behavior. Use this index for focused content on specific topics.

## Map of Content (MOC)

### Foundation
- [[nodes/when-to-use|When to Use]] — Activation triggers, use cases, phase overview, and when NOT to use this skill.
- [[nodes/rules|Rules]] — ALWAYS/NEVER/ESCALATE rules for implementation, testing/debugging, and verification phases.
- [[nodes/success-criteria|Success Criteria]] — Completion gates, quality checks, and quick reference for all three development phases.

### Workflow & Routing
- [[nodes/how-it-works|How It Works]] — Core development lifecycle: Implementation, Testing/Debugging, and Verification phases.
- [[nodes/smart-routing|Smart Routing]] — Stack detection via marker files, intent classification, resource routing, and load-level selection.

### Integration
- [[nodes/integration-points|Integration Points]] — Knowledge base structure, naming conventions, tool usage, external resources, and related skills.
