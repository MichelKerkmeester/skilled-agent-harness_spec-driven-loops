# Iteration 010 — Track 4: Native MCP Topology Diagram Accuracy

## Analysis Summary

Verified the "Native MCP Topology" ASCII diagram in README.md (lines 89-97) against:
- MCP registrations in opencode.json
- Post-extraction boundaries (mk-code-index and mk-skill-advisor separation)
- Shared dependencies described in SKILL.md files

## Diagram Element Verification

### MCP Server Registrations ✅ ACCURATE

All 6 MCP servers shown in the diagram are correctly registered in opencode.json:
- `sequential_thinking` (lines 11-18)
- `mk-spec-memory` (lines 19-37)
- `mk_skill_advisor` (lines 38-51)
- `mk_code_index` (lines 52-68)
- `cocoindex_code` (lines 69-82)
- `code_mode` (lines 83-92)

### Post-Extraction Boundaries ✅ ACCURATE

The diagram correctly shows the extracted MCP servers as separate boxes:
- `mk_skill_advisor` is now standalone under `system-skill-advisor` skill ✅
- `mk_code_index` is now standalone under `system-code-graph` skill ✅
- Both are separate from `system-spec-kit` ✅

### Shared Dependencies and Boundaries ⚠️ OVERSIMPLIFIED

**Finding 1: Code-Graph Boundary Relationship Not Shown**

The diagram presents a flat topology with no connections between boxes. However, the actual architecture has an important boundary relationship:

- SessionStart hooks (`session-prime.ts`, `session-start.ts`) live under `.opencode/skills/system-spec-kit/mcp_server/hooks/` — NOT under `system-code-graph/hooks/`
- This is an intentional asymmetry (ADR-002) because migrating hooks would be a high-risk breaking change (referenced by 110+ files, `.claude/settings.local.json` paths, and build config dependencies)
- Hooks reach code-graph data through the stable boundary at `system-spec-kit/mcp_server/lib/code-graph-boundary.ts`
- Migration is deferred to a future packet with build/config redesign scope

**Finding 2: Shared Contracts Not Represented**

The diagram does not indicate shared contracts between subsystems:
- Neutral contracts exist in `system-spec-kit/shared/code-graph-contracts.ts` shared by both system-spec-kit and system-code-graph
- These contracts maintain the coordination boundary between the extracted packages

**Finding 3: Pending Migration Not Indicated**

The diagram shows `mk_skill_advisor` as fully standalone, but there's a pending cleanup:
- `lib/skill-graph/` database/query logic remains in `system-spec-kit` until pending packet 011 cleanup
- This represents a partial extraction state not reflected in the diagram

## Topology Elements That Misrepresent Architecture

| Element | Issue | Severity |
|---------|-------|----------|
| Flat box layout with no arrows/connections | Omits code-graph boundary relationship (hooks in system-spec-kit → code-graph-boundary.ts → mk-code-index) | Medium |
| No indication of shared contracts | Fails to show neutral contracts shared between system-spec-kit and system-code-graph | Low |
| No indication of pending migrations | Does not reflect partial extraction state (lib/skill-graph/ still in system-spec-kit) | Low |

## Recommendations

1. **Add boundary notation**: Consider adding a visual indicator (e.g., a dotted line or note) showing that system-spec-kit hooks reach mk-code-index through a boundary layer
2. **Document shared contracts**: Add a note about shared contracts in the diagram legend or surrounding text
3. **Track pending migrations**: Consider adding a visual indicator for components with pending cleanup migrations

## Conclusion

The diagram accurately lists all MCP servers and correctly represents their post-extraction separation. However, it oversimplifies the actual topology by omitting important boundary relationships, shared contracts, and pending migrations. The flat, connectionless presentation may mislead readers about the actual architectural dependencies between these components.

ITER_010_COMPLETE: 3 findings, newInfoRatio=0.50
