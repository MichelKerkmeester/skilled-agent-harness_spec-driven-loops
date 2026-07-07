## Dimension

Correctness determinism pass for Target 1 only: determine whether `create.sh --phase --phase-parent` corrupts an existing parent packet's `description.json` on every append invocation or only under narrower conditions.

## Files Reviewed

- `.opencode/skills/sk-code-review/references/review_core.md:28`
- `.opencode/specs/system-speckit/028-memory-search-intelligence/003-spec-data-quality/047-generated-metadata-status-integrity/review/iterations/iteration-001.md:54`
- `.opencode/specs/system-speckit/028-memory-search-intelligence/003-spec-data-quality/047-generated-metadata-status-integrity/review/deep-review-state.jsonl:1`
- `.opencode/specs/system-speckit/028-memory-search-intelligence/003-spec-data-quality/047-generated-metadata-status-integrity/review/deep-review-strategy.md:21`
- `.opencode/skills/system-spec-kit/scripts/spec/create.sh:55`
- `.opencode/skills/system-spec-kit/scripts/spec/create.sh:207`
- `.opencode/skills/system-spec-kit/scripts/spec/create.sh:329`
- `.opencode/skills/system-spec-kit/scripts/spec/create.sh:1046`
- `.opencode/skills/system-spec-kit/scripts/spec/create.sh:1054`
- `.opencode/skills/system-spec-kit/scripts/spec/create.sh:1310`
- `.opencode/skills/system-spec-kit/scripts/spec/create.sh:1315`
- `.opencode/skills/system-spec-kit/scripts/spec/create.sh:1351`
- `.opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts:30`
- `.opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts:57`
- `.opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts:70`
- `.opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts:77`
- `.opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts:83`
- `.opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts:108`
- `.opencode/skills/system-spec-kit/scripts/dist/spec-folder/generate-description.js:42`
- `.opencode/skills/system-spec-kit/scripts/dist/spec-folder/generate-description.js:59`
- `.opencode/skills/system-spec-kit/scripts/dist/spec-folder/generate-description.js:63`
- `.opencode/skills/system-spec-kit/scripts/dist/spec-folder/generate-description.js:87`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:210`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:1098`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:1106`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:1125`
- `.opencode/skills/system-spec-kit/mcp_server/lib/description/description-merge.ts:47`
- `.opencode/skills/system-spec-kit/mcp_server/lib/description/description-merge.ts:64`
- `.opencode/specs/system-speckit/028-memory-search-intelligence/001-speckit-memory/description.json:3`

## Findings by Severity

### P0

None.

### P1

#### T1-P1-001 [P1] Append-mode phase scaffolding deterministically overwrites the existing parent packet's `description.json`

- Claim: The corruption is deterministic for successful append-mode phase scaffolds. Every successful invocation of `create.sh --phase --phase-parent <existing-parent> ... <feature_description>` reaches the parent description generator with `FEATURE_DIR` set to the existing parent and `--description "$FEATURE_DESCRIPTION"`, before child creation. The generator then writes canonical metadata to `FEATURE_DIR/description.json`, so the existing parent metadata is overwritten with append-request-derived metadata.
- Evidence refs: `.opencode/skills/system-spec-kit/scripts/spec/create.sh:207`, `.opencode/skills/system-spec-kit/scripts/spec/create.sh:329`, `.opencode/skills/system-spec-kit/scripts/spec/create.sh:1046`, `.opencode/skills/system-spec-kit/scripts/spec/create.sh:1054`, `.opencode/skills/system-spec-kit/scripts/spec/create.sh:1310`, `.opencode/skills/system-spec-kit/scripts/spec/create.sh:1315`, `.opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts:57`, `.opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts:70`, `.opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts:83`, `.opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts:108`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:1106`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:1125`, `.opencode/skills/system-spec-kit/mcp_server/lib/description/description-merge.ts:64`.
- Triggering conditions: `PHASE_MODE=true`, `PHASE_PARENT` or its `--parent` alias is provided, the parent folder resolves and contains `spec.md`, `FEATURE_DESCRIPTION` is non-empty, `dist/spec-folder/generate-description.js` exists, and the node generator succeeds. Existing `description.json` is not required for the bad write; if present, canonical fields are overwritten, and if missing, a parent `description.json` is created from the append request.
- Non-triggering conditions: Plain non-phase scaffold; `--phase` without `--phase-parent` where the parent is newly created rather than pre-existing; invocations with no feature description, which exit before phase mode; environments where the dist generator is absent or the node call fails, because create.sh only warns and skips description generation; and the child description generation path, which passes `_child_path` rather than `FEATURE_DIR`.
- Counterevidence sought: Checked for argument-shift behavior and found the parser records `--phase-parent` directly into `PHASE_PARENT` and stores remaining positional arguments in `ARGS`; `FEATURE_DESCRIPTION` is then derived once from `ARGS` or `EXPLICIT_NAME` and reused by the parent generator. Checked for generator state leakage and found `generate-description.ts` uses local variables inside one CLI `main()` execution; create.sh launches separate node processes for the parent and each child. Checked for stale/missing parent metadata as a precondition and found existing metadata only supplies `memorySequence` and `memoryNameHistory`, while canonical fields are built from the explicit append description and folder/base paths.
- Alternative explanation: A metadata repair or backfill could also produce malformed parent descriptions, but this path does not require external repair, stale metadata, or child-writer side effects. It is an unconditional append-mode parent write in the reviewed code path.
- Finding class: cross-consumer.
- Scope proof: The same target path is used for all append-mode invocations because `FEATURE_DIR="$PHASE_PARENT_RESOLVED"` in append mode, and the parent generation block has no `APPEND_TO_EXISTING_PARENT` guard. The child generation call uses `_child_path`, proving it is not the direct parent writer.
- Affected surface hints: `create.sh phase append mode`, `generate-description explicit-description CLI`, `description.json canonical merge`, `phase parent resume/search metadata`.
- Recommendation: Preserve T1-P1-001 as active. The minimal remediation remains to skip parent `description.json` generation when `APPEND_TO_EXISTING_PARENT=true`, or regenerate existing parent metadata from parent-owned content with a canonical specs-root base instead of the append request.
- Final severity: P1.
- Confidence: 0.97.
- Downgrade trigger: Downgrade only if a runtime wrapper not present in these files blocks the parent generation block for append mode, or if deployment omits the dist generator or node execution so the write is consistently skipped.

### P2

None.

## Determinism Matrix

| Condition | Result | Evidence |
|---|---|---|
| `--phase --phase-parent <existing-parent>` with valid feature description | Parent `description.json` write is reached every successful invocation | `create.sh:1046`, `create.sh:1054`, `create.sh:1315` |
| Positional feature description | Triggers; it populates `FEATURE_DESCRIPTION` | `create.sh:323`, `create.sh:329` |
| `--name`/`EXPLICIT_NAME` fallback without positional args | Same generator path if it supplies `FEATURE_DESCRIPTION` | `create.sh:98`, `create.sh:329` |
| Stale or existing parent `description.json` | Not required; canonical fields are overwritten when it exists | `generate-description.ts:70`, `description-merge.ts:64` |
| Missing parent `description.json` | Still writes a new parent description from the append request | `folder-discovery.ts:1103`, `folder-discovery.ts:1106`, `folder-discovery.ts:1125` |
| Child description generation | Ruled out as the direct parent writer | `create.sh:1351`, `create.sh:1355` |
| Shared generator variable between parent and child calls | Ruled out; state is process-local and create.sh invokes separate node commands | `generate-description.ts:30`, `create.sh:1315`, `create.sh:1355` |
| Dist generator absent or node call fails | Does not trigger; create.sh skips with warning | `create.sh:1313`, `create.sh:1318` |

## Reproduction

No reproduction was run. Static control-flow evidence was sufficient to classify determinism, and the prompt made reproduction optional if attempted. No `/tmp` copy was created, so cleanup was not applicable.

## Traceability Checks

- `spec_code`: PASS. The Target 1 code path was re-read from parser through append-mode routing, parent generation, generator canonical field construction, and atomic description write.
- `checklist_evidence`: Not applicable for this iteration. The target was deterministic code-path adjudication, not checklist completion.
- `skill_agent`: PASS. Deep-review was loaded and `sk-code-review/references/review_core.md` was read before the severity call.
- `blast_radius_scan`: Partial, read-only. Exact grep for basename-only `specFolder` and empty `parentChain` found candidate metadata shapes, including `.opencode/specs/system-speckit/028-memory-search-intelligence/001-speckit-memory/description.json:3`; full path-aware corruption classification remains deferred to the planned blast-radius iteration.

## SCOPE VIOLATIONS

None. No reviewed files were modified, and no live scaffold command was run against a real packet.

## Verdict

CONDITIONAL. The existing P1 is confirmed as deterministic under successful append-mode conditions.

## Next Dimension

Proceed to the planned Target 1 security/blast-radius pass, especially a path-aware JSON classifier for parent packets whose `description.json` lost track prefixes or adopted child append text.
Review verdict: CONDITIONAL
