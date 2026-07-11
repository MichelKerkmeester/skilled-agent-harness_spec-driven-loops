# Task 11 Frontmatter Fix

## Status

`SPECDOC_FRONTMATTER_004` is cleared for the target `spec.md`. The production edit changed only `_memory.continuity.next_safe_action`; historical and completion fields remain unchanged.

Root strict validation was run after the edit. It remains failed because generated metadata is now stale, but JSON repair is outside this task writable scope.

## Exact Before and After

| State | Exact `next_safe_action` value |
| --- | --- |
| Before | `One deferred item remains: 007-graduation-follow-ups/001-search-append-citation-probe is at 90% completion with CHK-021 (cli executor test pass) unchecked, deliberately deferred to the cli executor. Otherwise the track is complete; production flips remain separate evidence-gated decisions.` |
| After | `Run the deferred CLI test for 007-graduation-follow-ups/001-search-append-citation-probe` |

The replacement keeps the deferred CLI test and its canonical relative path actionable while leaving `recent_action`, `completion_pct`, status, historical prose, and production-flip policy untouched.

## Validation Commands and Results

### DQI extraction

```text
python3 ".opencode/skills/sk-doc/shared/scripts/extract_structure.py" ".opencode/specs/system-speckit/028-memory-search-intelligence/005-dark-flag-graduation/spec.md"
```

Result: exit 0; detected type `spec`; DQI `82` (`good`); checklist `1/1` passed; no content or style issues. Required threshold `>=75` passed.

### Document validation

```text
python3 ".opencode/skills/sk-doc/shared/scripts/validate_document.py" ".opencode/specs/system-speckit/028-memory-search-intelligence/005-dark-flag-graduation/spec.md" --type spec
```

Result: exit 0; `VALID`; document type `spec`; total issues `0`.

### Frontmatter rule confirmation

```text
node ".opencode/skills/system-spec-kit/mcp_server/dist/lib/validation/spec-doc-structure.js" --folder ".opencode/specs/system-speckit/028-memory-search-intelligence/005-dark-flag-graduation" --level phase --rule FRONTMATTER_MEMORY_BLOCK
```

Result: exit 0; rule `FRONTMATTER_MEMORY_BLOCK`; status `pass`; message `All spec-doc frontmatter memory blocks are structurally valid`. No `SPECDOC_FRONTMATTER_004` diagnostic remains.

### Required root strict validation

```text
bash ".opencode/skills/system-spec-kit/scripts/spec/validate.sh" ".opencode/specs/system-speckit/028-memory-search-intelligence" --strict
```

Result: `FAILED` after the write. For `.opencode/specs/system-speckit/028-memory-search-intelligence/005-dark-flag-graduation`, `FRONTMATTER_MEMORY_BLOCK` passed, clearing the requested violation. The same child then reported one enforced blocker plus two strict warnings:

- Check `GENERATED_METADATA_INTEGRITY`; path `.opencode/specs/system-speckit/028-memory-search-intelligence/005-dark-flag-graduation/graph-metadata.json`; cause `SOURCE_FINGERPRINT_MISMATCH`: `source_fingerprint does not match a re-derive of the current source docs, the stored derived fields may be stale`.
- Check `PHASE_LINKS`; path `.opencode/specs/system-speckit/028-memory-search-intelligence/005-dark-flag-graduation`; result `29 phase link issue(s) found`.
- Check `PHASE_PARENT_CONTENT`; path `.opencode/specs/system-speckit/028-memory-search-intelligence/005-dark-flag-graduation/spec.md`; result `Phase parent spec.md contains migration-history token(s)`.

No JSON or additional authored documentation was changed because those repairs are outside the writable scope.

### Exact generated-metadata blocker evidence

```text
".opencode/skills/system-spec-kit/scripts/node_modules/.bin/tsx" ".opencode/skills/system-spec-kit/scripts/validation/generated-metadata-integrity.ts" --folder ".opencode/specs/system-speckit/028-memory-search-intelligence/005-dark-flag-graduation" --strict --json
```

Result: exit 1; resolved rule `GENERATED_METADATA_INTEGRITY`; status `error`; one violation at `graph-metadata.json`, code `SOURCE_FINGERPRINT_MISMATCH`, with the cause quoted above.

## Scope Verification

Changed files only:

- `.opencode/specs/system-speckit/028-memory-search-intelligence/005-dark-flag-graduation/spec.md`
- `scratch/task-11-frontmatter-fix.md`
