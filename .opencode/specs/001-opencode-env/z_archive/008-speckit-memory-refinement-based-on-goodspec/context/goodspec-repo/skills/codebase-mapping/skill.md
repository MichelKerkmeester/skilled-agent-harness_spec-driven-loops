---
name: codebase-mapping
description: Systematically explore and understand an unfamiliar codebase to build a mental model.
category: code
triggers:
  - codebase
  - architecture
  - discovery
  - mapping
version: 0.1.0
---

# Codebase Mapping Skill

## Purpose
Systematically explore and understand an unfamiliar codebase to build a mental model.

## Exploration Strategy

### Phase 1: High-Level Overview
1. Read README and documentation
2. Examine directory structure
3. Identify main entry points
4. Review package.json/requirements.txt for dependencies

### Phase 2: Architecture Discovery
1. Find the main application entry point
2. Trace the request/response flow
3. Identify core abstractions and patterns
4. Map module dependencies

### Phase 3: Deep Dive
1. Read key modules in detail
2. Understand data models
3. Map API endpoints to handlers
4. Identify testing patterns

## Key Questions

- What framework/runtime is used?
- How is the code organized (layers, features, hybrid)?
- Where is configuration managed?
- How is state managed?
- What are the main data flows?
- How are errors handled?
- What testing approach is used?

## Output Artifacts

- Directory structure summary
- Architecture diagram (text or visual)
- Key file inventory
- Pattern documentation
- Convention notes for AI agents
