---
level: 3
---

# README Alignment Plan

## Approach
Multi-agent research followed by comprehensive README rewrite.

## Phases

### Phase 1: Research (COMPLETED)
- 10 parallel agents analyzed current system state
- Identified 10 major discrepancies between README and reality

### Phase 2: Documentation
- Create Level 3 spec folder
- Document findings and decisions

### Phase 3: Implementation
- Update README.md with all corrections
- Verify accuracy against research findings

## Key Findings from Research

### Critical Discrepancies
1. **System Merger**: Memory merged into system-spec-kit (v16.0.0)
2. **MCP Rename**: `semantic_memory_*` → `spec_kit_memory_*`
3. **Skill Count**: 9 → 8 (merger)
4. **Command Count**: 18 → 17
5. **Template Count**: 10 → 11
6. **MCP Tool Count**: 14 → 13
7. **Path Changes**: `.opencode/skill/system-memory/` no longer exists

### Version Updates
- Unified system-spec-kit: v16.0.0
- MCP Server: v12.6.0
- validate-spec.sh: v2.0.0
- generate-context.js: v12.5.0

## Technical Decisions
- Keep Memory as a subsection of Spec Kit (reflects architecture)
- Maintain "Two Semantic Systems" concept (LEANN vs Spec Kit Memory)
- Preserve existing README structure where possible
