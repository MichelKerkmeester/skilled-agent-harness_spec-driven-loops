# Iteration 13: P6 Typed Artifact Handles

## Focus
Translate live-object references into replayable repository objects.

## Actions Taken
Compared paper previews/live values with trace envelopes, sealed admission references, and orientation constraints.

## Findings
1. **[OBSERVED-IN-PAPER][EXTEND studies; EXTEND runtime]** NOOA renders type, true length, and bounded head/tail while keeping the full object available to code. This demonstrates progressive disclosure, not a safe cross-process persistence contract. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:169-193]
2. **[INFERENCE][CONFIRM studies; EXTEND runtime]** `ArtifactHandleV1` should carry `artifactId`, `kind`, `schemaVersion`, `contentDigest`, `snapshotHead`, `byteLength`, `mediaType`, `ownerScope`, `capabilityScope`, `createdBy`, `retentionClass`, and optional query descriptor. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/orientation.md:105-105]
3. **[INFERENCE][REFINE runtime]** `ArtifactPreviewV1` adds bounded sample, omitted-region description, completeness=false, and the exact handle/digest. A preview can support navigation but not claims about unseen regions. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:169-181]
4. **[CONFIRM studies; EXTEND runtime]** Handles join trace input/output/evidence digests and sealed dependency closure; path strings alone are insufficient because content can change at the same location. [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:95-97] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:43-53]
5. **[INFERENCE][CONTRADICT live mutability; CONFIRM replay]** Dereference must either return the pinned bytes/projection or `stale_or_missing`; it must never silently resolve to latest mutable content. [SOURCE: .opencode/skills/system-deep-loop/deep-research/references/state/state-jsonl.md:18-34]
6. **[CONFIRM 036]** A handle proves identity/integrity and scope, not authority to use the artifact for a protected transition; 036 validates that separately. [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/research.md:5-9]

## Questions Answered
- P6 handle and preview contract.

## Questions Remaining
- Measurements and stale-reference failure behavior.

## Ruled Out
- Live mutable cross-iteration references, path-only handles, and preview-as-value.

## Edge Cases
- Derived query handles must bind query canonicalization and source-head digests.

## Sources Consulted
- Paper pass-by-reference, studies 1/3/4, JSONL.

## Assessment
- New information ratio: 0.36.
- Status: complete.

## Reflection
Digest-bound handles retain progressive disclosure while restoring replay and trust separation.

## Recommended Next Focus
Test handles against stale and truncation mutants.
