# Iteration 001 - Correctness

Focus: parent control metadata and resume safety.

Files reviewed:

- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/description.json`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/graph-metadata.json`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/011-command-presentation-workflow-separation/spec.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-write-safety/implementation-summary.md`

## Findings

### P1-001: Parent child registry omits live phase 011 from spec.md and description.json

The parent `spec.md` phase map enumerates phases `000` through `010` only [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:127]. `description.json` has the same child list ending at `010-mcp-to-cli-tool-transition` [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/description.json:27]. `graph-metadata.json`, however, includes `011-command-presentation-workflow-separation` as a child [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/graph-metadata.json:6], and the 011 child spec exists as a planned phase parent [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/011-command-presentation-workflow-separation/spec.md:47].

Impact: phase discovery, memory graph traversal, and resume routing can disagree on whether 011 belongs to this packet.

Recommendation: add 011 to the parent phase map and `description.json`, or remove it from `graph-metadata.json` if it is not part of 027.

### P1-002: Parent continuity points to already-shipped 002 secret-redaction work as next action

The parent continuity says `recent_action` was adding OpenLTM phases and `next_safe_action` is to plan 008/009 or implement the 002 secret-redaction amendment [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:26]. Phase 002 now records the memory write protections and secret scrubber as shipped [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-write-safety/implementation-summary.md:56], including pre-index secret redaction [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-write-safety/implementation-summary.md:70].

Impact: `/speckit:resume` can route a maintainer toward completed work instead of the true next active child.

Recommendation: refresh parent `_memory.continuity` to the current active child and next safe action.

### P2-001: 010 implementation summary still carries 028-era metadata after relocation

The 010 child is now under the 027 packet [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/spec.md:14], and `context-index.md` says the MCP-to-CLI workstream relocated here as child phase 010 [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/context-index.md:44]. The nested release-cleanup implementation summary still records its spec folder as `028-mcp-to-cli-tool-transition/004-release-and-program-cleanup` [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/004-release-and-program-cleanup/implementation-summary.md:36] and describes the built work as "028 documentation surface" [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/004-release-and-program-cleanup/implementation-summary.md:46].

Impact: memory search and resume summaries can surface stale packet identity.

Recommendation: normalize relocated child metadata to the current 027/010 path and keep historical movement only in `context-index.md`.

## Verdict Rationale

This iteration found active P1 findings, so the canonical iteration verdict is conditional.

Review verdict: CONDITIONAL
