# Seat gpt-continuity-metadata — iteration 2 (global #50)

- Model: `kimi-for-coding/k2p7` · Executor: opencode · Angle: gpt-continuity-metadata
- Verdict: **FAIL** · Findings: P0=0 P1=2 P2=1

## Analysis

Reviewed the 027 tree graph-metadata files and the save/refresh code that owns `derived.last_active_child_id`.

**Key observations**
- All non-null `last_active_child_id` values point to real directories, so there are no “dangling” pointers.
- Two files use bare leaf names (`002-self-check-templates`, `005-cli-automation-compact-completion`) while the rest use full packet ids; they are not present in their own `children_ids` arrays.
- Several pointers are stale relative to later child saves. The most impactful is the root pointer, which still names `005-verification-and-remediation` even though `003-advisor-and-codegraph` was saved later. The code path `updatePhaseParentPointersAfterSave` only updates the direct parent, so ancestor phase-parent pointers are not refreshed when deeper descendants are saved.

```json
{
  "seat": "gpt-continuity-metadata",
  "model": "openai/gpt-5.5-fast",
  "angle": "graph-metadata.json derived.last_active_child_id pointers: valid, non-stale, point to existing children across the tree.",
  "verdict": "FAIL",
  "summary": "Root and 001-peck pointers are stale; leaf-name pointers break children_ids consistency.",
  "files_reviewed": [
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/graph-metadata.json",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/graph-metadata.json",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/002-self-check-templates/graph-metadata.json",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/007-acceptance-coverage-gate/graph-metadata.json",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-advisor-and-codegraph/graph-metadata.json",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/004-cli-tooling-ux/graph-metadata.json",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/001-spec-memory-cli/graph-metadata.json",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/001-spec-memory-cli/001-cli-core/graph-metadata.json",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/001-spec-memory-cli/003-runtime-integration/graph-metadata.json",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation/001-memory-commands/graph-metadata.json",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation/001-memory-commands/002-author-presentation-md/graph-metadata.json",
    ".opencode/skills/system-spec-kit/scripts/memory/generate-context.ts",
    ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts",
    ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts",
    ".opencode/commands/speckit/assets/speckit_resume_auto.yaml"
  ],
  "findings": [
    {
      "severity": "P1",
      "dimension": "traceability",
      "title": "Root phase-parent pointer is stale",
      "file": ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/graph-metadata.json:231",
      "evidence": "derived.last_active_child_id = \"system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation\" and derived.last_active_at = \"2026-06-14T00:00:00Z\". Sibling 003-advisor-and-codegraph graph-metadata.json:89 has last_save_at = \"2026-06-15T16:24:38.199Z\", later than both the root pointer timestamp and the target child 005's last_save_at (\"2026-06-15T09:09:34.841Z\"). generate-context.ts:561-580 only updates the direct parent, not all ancestor phase parents.",
      "why": "The pointer names the wrong most-recently-active top-level phase. Because /speckit:resume auto-redirect trusts a fresh pointer (speckit_resume_auto.yaml:59-62), this can land a session in 005 instead of 003.",
      "recommendation": "Make updatePhaseParentPointersAfterSave walk the ancestor chain and refresh every phase parent, or run a tree-wide graph-metadata refresh after batch saves."
    },
    {
      "severity": "P1",
      "dimension": "traceability",
      "title": "001-peck-teachings-adoption pointer frozen at initial child",
      "file": ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/graph-metadata.json:113",
      "evidence": "derived.last_active_child_id = \"002-self-check-templates\" and derived.last_active_at = \"2026-06-02T10:04:51Z\" (same as created_at). Target 002-self-check-templates graph-metadata.json:202 has last_save_at \"2026-06-10T19:22:14.924Z\" and status complete, while sibling 007-acceptance-coverage-gate graph-metadata.json:201 has last_save_at \"2026-06-15T09:09:34.752Z\" and status source_pass_complete.",
      "why": "The pointer never advanced from the first child, so it points to a completed phase while later active/complete siblings exist. Resume consumers following this pointer will start on stale work.",
      "recommendation": "Trigger a canonical save/update against the latest active child (007) so updatePhaseParentPointer refreshes the parent, or manually correct last_active_child_id/last_active_at."
    },
    {
      "severity": "P2",
      "dimension": "traceability",
      "title": "Leaf-name last_active_child_id values inconsistent with children_ids",
      "file": ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/graph-metadata.json:113",
      "evidence": "last_active_child_id is the leaf name \"002-self-check-templates\", but children_ids at lines 7-13 store full packet ids like \"system-spec-kit/.../001-peck-teachings-for-spec-kit\". The same mismatch occurs at .opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/004-cli-tooling-ux/graph-metadata.json:118 (\"005-cli-automation-compact-completion\") vs children_ids lines 7-11.",
      "why": "The schema allows any non-empty string, so this validates, but it breaks any consumer that resolves the pointer by looking it up in children_ids. It also creates two conventions in one tree.",
      "recommendation": "Backfill or refresh these two graph-metadata files so last_active_child_id uses the same packet-id format as children_ids, or standardize the code to store leaf names and adjust consumers accordingly."
    }
  ]
}
```
