## Dimension

Correctness inventory pass for Target 1: identify the exact `create.sh --phase --phase-parent` code path that can overwrite an existing parent packet's `description.json` while adding new child phases.

## Files Reviewed

- `.opencode/skills/deep-loop-workflows/deep-review/references/protocol/quick_reference.md:166`
- `.opencode/skills/sk-code-review/references/review_core.md:28`
- `.opencode/specs/system-speckit/028-memory-search-intelligence/002-spec-data-quality/047-generated-metadata-status-integrity/review/deep-review-state.jsonl:1`
- `.opencode/specs/system-speckit/028-memory-search-intelligence/002-spec-data-quality/047-generated-metadata-status-integrity/review/deep-review-strategy.md:21`
- `.opencode/skills/system-spec-kit/scripts/spec/create.sh:207`
- `.opencode/skills/system-spec-kit/scripts/spec/create.sh:1046`
- `.opencode/skills/system-spec-kit/scripts/spec/create.sh:1054`
- `.opencode/skills/system-spec-kit/scripts/spec/create.sh:1310`
- `.opencode/skills/system-spec-kit/scripts/spec/create.sh:1315`
- `.opencode/skills/system-spec-kit/scripts/spec/create.sh:1351`
- `.opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts:37`
- `.opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts:77`
- `.opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts:83`
- `.opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts:108`
- `.opencode/skills/system-spec-kit/scripts/dist/spec-folder/generate-description.js:23`
- `.opencode/skills/system-spec-kit/scripts/dist/spec-folder/generate-description.js:59`
- `.opencode/skills/system-spec-kit/scripts/dist/spec-folder/generate-description.js:63`
- `.opencode/skills/system-spec-kit/scripts/dist/spec-folder/generate-description.js:87`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:210`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:246`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:1098`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:1106`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:1125`
- `.opencode/skills/system-spec-kit/mcp_server/lib/description/description-merge.ts:47`
- `.opencode/skills/system-spec-kit/mcp_server/lib/description/description-merge.ts:64`
- `.opencode/specs/system-speckit/028-memory-search-intelligence/002-spec-data-quality/047-generated-metadata-status-integrity/description.json:3`

## Call Graph

1. `create.sh` parses `--phase-parent` and stores the user-provided existing parent path in `PHASE_PARENT` (`create.sh:207-218`).
2. In phase mode, append mode resolves that existing folder and sets `APPEND_TO_EXISTING_PARENT=true`, `FEATURE_DIR="$PHASE_PARENT_RESOLVED"`, and `BRANCH_NAME="$(basename "$FEATURE_DIR")"` (`create.sh:1045-1056`). From this point forward, `FEATURE_DIR` is the parent packet, not a new child.
3. After parent `spec.md` phase-map mutation, `create.sh` unconditionally enters `Generate description.json for parent` and executes `node "$_DESC_SCRIPT" "$FEATURE_DIR" "$(dirname "$FEATURE_DIR")" --description "$FEATURE_DESCRIPTION" --level "phase"` (`create.sh:1310-1317`). In append mode that call targets the existing parent folder.
4. The executed script resolves `folderPath = path.resolve(args[0])` and `basePath = path.resolve(args[1])` (`generate-description.js:23-24`; TS source mirrors this at `generate-description.ts:37-38`). It then accepts the explicit `--description` argument (`generate-description.js:42-47`).
5. For explicit descriptions, the generator loads the existing parent metadata from `folderPath`, computes `relativePath = path.relative(basePath, folderPath)`, derives `parentChain` from that relative path, and constructs a new `desc` whose canonical fields include `specFolder`, `description`, `keywords`, `specId`, `folderSlug`, and `parentChain` (`generate-description.js:53-74`; TS source at `generate-description.ts:70-94`). With `basePath=$(dirname "$FEATURE_DIR")`, a nested parent packet becomes only its basename and `parentChain` becomes `[]`.
6. The generator calls `savePerFolderDescription(desc, folderPath)` (`generate-description.js:87`; TS source at `generate-description.ts:108`).
7. `savePerFolderDescription` writes to `path.join(folderPath, 'description.json')` (`folder-discovery.ts:1098-1107`), serializes the merge payload to a temp file, fsyncs, then atomically renames the temp file onto `description.json` (`folder-discovery.ts:1121-1132`).
8. The merge path does not protect the parent identity fields: `buildCanonicalDescriptionFields` marks `specFolder`, `description`, `keywords`, `lastUpdated`, `specId`, `folderSlug`, and `parentChain` as canonical incoming fields (`folder-discovery.ts:210-221`), and `mergeDescription` overwrites every canonical key into the merged payload (`description-merge.ts:64-66`).
9. The child-phase `description.json` call is separate and uses `_child_path` as the first argument (`create.sh:1351-1357`), so it writes each child file rather than the parent file. The parent corruption is caused by the earlier parent generation call, not by the child loop directly.

## Findings by Severity

### P0

None.

### P1

#### T1-P1-001 [P1] Append-mode phase scaffolding overwrites the existing parent packet's `description.json`

- File: `.opencode/skills/system-spec-kit/scripts/spec/create.sh:1315`
- Claim: When `create.sh --phase --phase-parent <existing-packet> ... "<feature description>"` appends phases to an existing parent, `FEATURE_DIR` is the existing parent (`create.sh:1054-1055`) and the parent description generator is still called with `--description "$FEATURE_DESCRIPTION"` (`create.sh:1315-1316`). The generator persists those incoming canonical fields to `folderPath/description.json`, so the parent packet's `description`, `keywords`, `specFolder`, and `parentChain` can be replaced by metadata derived from the new phase append request.
- Evidence refs: `.opencode/skills/system-spec-kit/scripts/spec/create.sh:1046`, `.opencode/skills/system-spec-kit/scripts/spec/create.sh:1054`, `.opencode/skills/system-spec-kit/scripts/spec/create.sh:1310`, `.opencode/skills/system-spec-kit/scripts/spec/create.sh:1315`, `.opencode/skills/system-spec-kit/scripts/dist/spec-folder/generate-description.js:59`, `.opencode/skills/system-spec-kit/scripts/dist/spec-folder/generate-description.js:63`, `.opencode/skills/system-spec-kit/scripts/dist/spec-folder/generate-description.js:87`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:1106`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:1125`, `.opencode/skills/system-spec-kit/mcp_server/lib/description/description-merge.ts:64`
- Counterevidence sought: Checked the child generation call and found it passes `_child_path`, not the parent path (`create.sh:1351-1357`), so the child loop is not the direct parent writer. Checked the merge layer and found canonical fields are overwritten, not preserved (`description-merge.ts:64-66`).
- Alternative explanation: A separate metadata repair/backfill path could also rewrite `description.json`, but this inventory pass found a direct deterministic write path in `create.sh` itself that matches the reported symptoms without requiring another process.
- Finding class: cross-consumer
- Scope proof: The bug is specifically gated by phase append mode because `FEATURE_DIR` is assigned to the existing parent only when `PHASE_PARENT` is provided (`create.sh:1045-1055`); normal phase creation writes a newly-created parent, and the child loop writes `_child_path` (`create.sh:1351-1357`).
- Affected surface hints: `create.sh phase append mode`, `generate-description explicit-description CLI`, `description.json canonical merge`, `phase parent resume/search metadata`
- Recommendation: In append mode, do not regenerate the parent `description.json` from the child append request; either skip the parent description generation when `APPEND_TO_EXISTING_PARENT=true` or regenerate from the parent `spec.md` with a base rooted at the canonical specs root so `specFolder` and `parentChain` remain stable.
- Final severity: P1
- Confidence: 0.93
- Downgrade trigger: Downgrade only if an execution-path guard not visible in these files prevents the parent generation block from running in append mode, or if `savePerFolderDescription` is wrapped at runtime to reject canonical identity changes for existing parent packets.

### P2

None.

## Traceability Checks

- `spec_code`: Direct code path confirmed for Target 1. Target 2 REQ-001..REQ-005 was intentionally out of scope for this iteration.
- `checklist_evidence`: Deferred; this iteration was an inventory/root-cause pass and did not adjudicate checklist completion.
- `skill_agent`: Satisfied by loading deep-review and review core doctrine before severity calls.
- Blast-radius scan: Partial only. A broad read-only grep over `.opencode/specs/**/description.json` found many `specFolder`/`parentChain` records, but this iteration did not run an exhaustive classifier for corrupted parent signatures. Strategy already reserves that work for a later Target 1 pass.

## SCOPE VIOLATIONS

None. No reviewed files were modified, and no live reproduction was run against a real packet.

## Verdict

CONDITIONAL. One confirmed P1 correctness bug exists in the Target 1 phase-append metadata write path.

## Next Dimension

Continue Target 1 with isolated `/tmp` determinism reproduction or proceed to the planned security/blast-radius scan, keeping live repo packets read-only.
Review verdict: CONDITIONAL
