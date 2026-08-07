# Iteration 011: Old Path/Number Migration Residue (123-agent-loops-improved)

## Focus
- Scope: Pre-migration path and packet number references throughout the packet
- Question: How widespread is the migration residue from 123 → 030?

## Findings

### F-011: Pervasive old-packet-number references (123-agent-loops-improved) across 7 phase parents

**Severity: High (navigation/resume/graph-metadata corruption)**

The packet was migrated from `skilled-agent-orchestration/123-agent-loops-improved` to `deep-loops/030-agent-loops-improved`, but **14 references to the old number `123-agent-loops-improved`** remain across 7 phase parent spec.md files:

**Phase 001-reference-research (4 references):**
- Line 17: `next_safe_action: "Implement recommendations via the sibling 123-agent-loops-improved phase tree"`
- Line 49: `| **Successor** | 123-agent-loops-improved |`
- Line 74: `Implementing the improvements (delegated to the sibling 123-agent-loops-improved).`
- Line 122: `open implementation questions live in 123-agent-loops-improved child phases.`
[SOURCE: `001-reference-research/spec.md:17,49,74,122`]

**Phase 002-deep-loop-runtime (4 references):**
- Line 58: `| **Parent Spec** | ../spec.md (123-agent-loops-improved) |`
- Line 90: `other subsystem groups in 123-agent-loops-improved`
- Line 188: `| **Parent Spec**: ../spec.md (123-agent-loops-improved)`
- Line 189: `| **Root Packet**: ../../spec.md (123-agent-loops-improved)`
[SOURCE: `002-deep-loop-runtime/spec.md:58,90,188,189`]

**Phase 003-deep-loop-workflows (2 references):**
- Line 48: `| **Parent Spec** | ../../spec.md (123-agent-loops-improved) |`
- Line 157: `| **Parent Spec**: ../../spec.md (123-agent-loops-improved)`
[SOURCE: `003-deep-loop-workflows/spec.md:48,157`]

**Phases 004, 005, 006, 007 (1 reference each):**
- 004 line 68: `This is Phase 4 of the 123-agent-loops-improved subsystem groups.`
- 005 line 68: `This is Phase 5 of the 123-agent-loops-improved subsystem groups.`
- 006 line 71: `This is Phase 6 of the 123-agent-loops-improved subsystem groups.`
- 007 line 68: `This is Phase 7 of the 123-agent-loops-improved subsystem groups.`
[SOURCE: `004-system-spec-kit/spec.md:68`, `005-skill-interconnection/spec.md:68`, `006-ux-observability-automation/spec.md:71`, `007-testing/spec.md:68`]

**Additional old-path evidence:**
- The native review lock references `156-agent-loops-improved` (yet another old number) [SOURCE: `review/lineages/native/.deep-review.lock`]
- The glm review lineage log shows reads from `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/spec.md` [SOURCE: `review/lineages/glm/logs/fanout-lineage.out:6`]
- An orphaned `review-report.md` exists at `.opencode/specs/skilled-agent-orchestration/123-agent-loops-improved/review/lineages/glm/review-report.md` [SOURCE: filesystem]

**Root cause:** The migration renamed the packet directory but did not run a find-replace across the child spec.md files. The `123-agent-loops-improved` references in Parent Spec, Successor, and prose were left pointing at the old name.

**Impact:**
1. **Broken navigation:** `| **Parent Spec** | ../spec.md (123-agent-loops-improved) |` — the parenthetical is wrong but the path `../spec.md` is correct. A reader following the parenthetical name will look for a folder that doesn't exist.
2. **Graph metadata contamination:** If graph-metadata extraction reads the spec.md prose, it will index `123-agent-loops-improved` as an entity name, polluting search results.
3. **Memory search contamination:** `memory_save` / `memory_search` indexing the spec.md will associate this packet with the old number.
4. **Resume confusion:** An operator seeing `123-agent-loops-improved` in the spec may try to navigate to that path.

**Recommendation:**
1. **Immediate:** Global find-replace `123-agent-loops-improved` → `030-agent-loops-improved` and `skilled-agent-orchestration/123-agent-loops-improved` → `deep-loops/030-agent-loops-improved` across all spec.md files in the packet
2. **Validation:** Add a validate.sh check that flags any packet-id reference that doesn't match the current `spec_folder` path
3. **Migration tooling:** Add a `step_rename_packet` to the spec-kit that performs find-replace across all child docs when a packet is moved/renamed

## Novelty Justification
This is a NEW finding beyond the known leads. Quantified 14 references across 7 files. Discovered the 3-version number drift (123 → 156 → 030) where each migration left references behind. The orphaned review-report.md at the old path is confirmed.

## What Was Tried and Failed
- Checked if the old path `skilled-agent-orchestration/123-agent-loops-improved` still exists (it has a `review/` directory but is otherwise empty/stale)

## Ruled-Out Directions
- The references are NOT intentional historical annotations (they are in live navigation fields like Parent Spec and Successor)
