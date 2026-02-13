# Spec: AGENTS.universal.md Creation

## Overview
Create a universal/template version of AGENTS.md that preserves core logic while removing project-specific references.

## Problem Statement
The current AGENTS.md contains project-specific references (Webflow, Chrome DevTools, frontend patterns) that make it unsuitable as a reusable template across different project types.

## Solution
Analyze and duplicate AGENTS.md into AGENTS.universal.md with:
- All core logic preserved (gates, confidence framework, documentation levels)
- Project-specific references removed or generalized
- Only universal skills retained (LEANN, Code Mode, Narsil, Spec Kit, workflows-documentation)
- New Section 8 added for project-specific extensions

## Scope
- **In Scope:** Create universal template, document changes
- **Out of Scope:** Modifying original AGENTS.md

## Success Criteria
- [x] Universal template created at `/AGENTS.universal.md`
- [x] Core logic fully preserved
- [x] Project-specific references removed
- [x] Only allowed skills referenced
- [x] Section 8 placeholder for extensions added
