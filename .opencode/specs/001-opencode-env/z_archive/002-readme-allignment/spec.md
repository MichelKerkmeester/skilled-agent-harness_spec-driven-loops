---
level: 3
status: in-progress
created: 2024-12-26
---

# README Alignment Specification

## Overview
Align the public README.md with the current reality of the .opencode system after the Spec Kit + Memory merger and subsequent refinements.

## User Stories
- As a new user, I want accurate documentation so I can set up the system correctly
- As a contributor, I want to understand the current architecture so I can make informed changes
- As a maintainer, I want version numbers and counts to be accurate so users trust the documentation

## Requirements

### Functional Requirements
1. Update all references from `semantic_memory_*` to `spec_kit_memory_*`
2. Reflect the merger of system-memory into system-spec-kit
3. Update skill count from 9 to 8
4. Update command count from 18 to 17
5. Update template count from 10 to 11
6. Update MCP tool count from 14 to 13
7. Fix all path references to use `.opencode/skill/system-spec-kit/`
8. Update version numbers to reflect current state

### Non-Functional Requirements
1. Maintain the existing README structure and formatting quality
2. Keep comparison tables and ASCII diagrams
3. Preserve the narrative flow and readability

## Scope
- IN: README.md updates, spec folder documentation
- OUT: Code changes, system modifications

## Success Criteria
- All version numbers accurate
- All counts verified
- All paths valid
- All MCP tool names updated
- No references to deprecated `system-memory` skill
