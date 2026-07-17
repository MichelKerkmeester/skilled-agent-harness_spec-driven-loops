# Iteration 6: Maintainability - generator provenance and portability

## Dispatcher

- Route: 'mode=review target_agent=deep-review'
- Scope: phase-tree generator invocation, output, and reproducibility contract

## Files Reviewed

- 'manifest/build-phase-tree.mjs'
- 'manifest/phase-tree.json'
- All packet Markdown references to the generator

## Findings - New and Revalidated

### P0 Findings

None.

### P1 Findings

1. **F002 - The authoritative phase tree is not reproducible (revalidated)** -- '.opencode/specs/sk-doc/020-hyphen-naming-convention/manifest/build-phase-tree.mjs:138' -- The systematic slug drift from iteration 1 remains, and no packet document supplies a deterministic post-processing or no-diff regeneration command. The manifest still calls itself authoritative generated output [SOURCE: '.opencode/specs/sk-doc/020-hyphen-naming-convention/manifest/phase-tree.json:4'], while generator source emits divergent descendant identities [SOURCE: '.opencode/specs/sk-doc/020-hyphen-naming-convention/manifest/build-phase-tree.mjs:138-165'].

~~~json
{"findingId":"F002","type":"correctness","claim":"No documented generation path reproduces the authoritative phase-tree manifest from build-phase-tree.mjs.","evidenceRefs":[".opencode/specs/sk-doc/020-hyphen-naming-convention/manifest/build-phase-tree.mjs:138-165",".opencode/specs/sk-doc/020-hyphen-naming-convention/manifest/phase-tree.json:4"],"counterevidenceSought":"Searched all packet Markdown for generator invocation, post-processing, and no-diff enforcement; none exists.","alternativeExplanation":"An undocumented external process may number slugs, but it is not part of the maintainable source-of-truth contract.","finalSeverity":"P1","confidence":0.99,"downgradeTrigger":"Downgrade when one documented command regenerates the checked-in manifest byte-for-byte and CI enforces no diff."}
~~~

### P2 Findings

1. **F006 - The phase-tree generator defaults to a developer-private scratch path** -- '.opencode/specs/sk-doc/020-hyphen-naming-convention/manifest/build-phase-tree.mjs:218' -- With no argument, the generator writes to an absolute '/private/tmp/claude-501/.../scratchpad/phase-tree.json' path tied to one workstation/session [SOURCE: '.opencode/specs/sk-doc/020-hyphen-naming-convention/manifest/build-phase-tree.mjs:218-219']. No packet document advertises the positional output argument. This makes the nominal default non-portable and hides which checked-in file is intended.
   - Recommendation: Default to the manifest beside the script or require an explicit output path with usage text; document the byte-for-byte regeneration command.

## Traceability Checks

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| 'spec_code' | fail | hard | generator '138-165,218-219'; manifest ':4' | Generated provenance is not reproducible. |
| 'checklist_evidence' | fail | hard | no generator invocation in packet docs | No no-diff gate exists. |

## Confirmed-Clean Surfaces

- The generator is deterministic for a fixed source revision and explicit output argument.
- The checked-in manifest parses and its totals match the physical packet.

## Ruled Out

- **Nondeterministic runtime inputs**: generator topology is source-constant.
- **Documented post-processing step**: none found packet-wide.

## Next Focus

- Dimension: completeness
- Focus area: frozen inventory/map deliverables and candidate-denominator ownership
- Required evidence: named artifacts, producing tasks, consuming gates, and existence/status semantics

## Assessment

- New findings: P0=0 P1=0 P2=1
- Revalidated findings: F002
- New findings ratio: 0.167
- Status: complete
- Verdict basis: active P1 persists; one portability suggestion added

Review verdict: CONDITIONAL
