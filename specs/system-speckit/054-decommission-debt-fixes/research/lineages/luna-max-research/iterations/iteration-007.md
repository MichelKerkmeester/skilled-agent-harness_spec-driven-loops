# Iteration 7: Successor retrieval and continuity coverage

## Focus

Trace the trigger-index and ripgrep corpus boundaries into the continuity writer and its save workflow. The key distinction is between a capability that is intentionally declared lost and a successor boundary that leaves a current document, writer, or route unowned.

## Findings

1. **LUNA-030 — The successor retrieval corpus omits root, runtime-mirror, and install-guide documentation. P2. CONFIRMED.** The trigger-index walker hard-codes only `specs` and `.opencode/skills` as corpus roots. The prescribed ripgrep “everything” scope is `specs .opencode`, which adds install guides but still omits root `README.md`, `AGENTS.md`, and the `.claude`, `.codex`, `.cursor`, `.devin`, and `.pi` mirrors. Those files exist and are part of the decommission review surface, so a prompt or exact term found only there produces no Gate-1 candidate and no result from the documented all-corpus grep. Smallest fix: add explicit, deduplicated documentation roots to both successor lanes, or state and enforce a separate mirror/root retrieval path so the omission is not mistaken for a clean no-hit. [SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/lib/corpus.mjs:19-30,118-145] [SOURCE: .opencode/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:138-147] [INFERENCE: the listed root README, AGENTS.md, install guide, and runtime-mirror README files are outside the two declared root sets]

2. **LUNA-031 — The workflow claims canonical saves belong to a missing `handlers/memory-save.ts` content router. P1. CONFIRMED reference gap, with behavior impact inferred.** The workflow explicitly says the retired memory artifact no longer exists and that canonical-document saves are owned by `handlers/memory-save.ts`. The runtime handlers README lists only `memory-index-discovery.ts` and `save/spec-folder-mutex.ts`, the public API exports metadata/discovery helpers but no content-router entry, and the named `runtime/handlers/memory-save.ts` source is absent. The writer invokes `runWorkflow()` and then only performs metadata/graph follow-ups, so the documented owner is not a verifiable successor boundary; this also explains why the canonical-save integration remains a skipped placeholder from iteration 5. Smallest fix: point the workflow and docs at the actual canonical content writer, or restore a narrow content-router entry with an active end-to-end save test; do not leave a missing handler as the ownership claim. [SOURCE: .opencode/skills/system-spec-kit/scripts/core/workflow.ts:1319-1331] [SOURCE: .opencode/skills/system-spec-kit/runtime/handlers/README.md:16-23,55-73] [SOURCE: .opencode/skills/system-spec-kit/runtime/api/index.ts:30-40,43-56] [SOURCE: .opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:920-950] [INFERENCE: bounded source inventory found no runtime/handlers/memory-save.ts and no content-router import]

3. **LUNA-032 — A canonical save can leave the committed trigger index representing an earlier corpus. P2. CONFIRMED boundary, with stale-result risk inferred.** The continuity writer says a save has no indexing handoff and instructs callers to run the trigger-index generator separately when trigger phrases change; the workflow repeats that it is only pointing at the generator. The generator publishes a new artifact but no save-time step or lookup-time freshness comparison ties a successful canonical save to a current index. This is an intentional separation, but it is a successor coverage gap if a save changes an indexed Markdown document and the caller does not perform the extra command: Gate 1 can return a valid, shape-checked result for the prior corpus. Smallest fix: invoke or enqueue a deterministic index refresh after relevant frontmatter changes, or add a manifest/freshness gate that turns a stale index into an explicit diagnostic rather than a normal lookup. [SOURCE: .opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:90-96] [SOURCE: .opencode/skills/system-spec-kit/scripts/core/workflow.ts:1580-1588] [SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/generate-trigger-index.mjs:13-15,363-380] [SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/lookup-trigger-index.mjs:72-85,150-178] [INFERENCE: the writer and lookup have no shared post-save refresh or current-corpus comparison]

## Ruled Out

- The loss of semantic paraphrase, vector/BM25 fusion, decay, access tracking, and session dedup is explicitly declared in the successor retrieval contract; this iteration does not relabel those documented non-goals as missed implementation. [SOURCE: .opencode/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:52-65]
- The generator's fail-closed publication behavior is deliberate and explicit: malformed trigger declarations refuse publication rather than silently replacing the index with a partial build. The remaining finding concerns stale-but-valid publication after a later save, not malformed-input handling. [SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/generate-trigger-index.mjs:11-15,363-380]

## Dead Ends

- Treating the trigger index's exclusion of `research/lineages`, tests, fixtures, and vendored directories as accidental was ruled out; the corpus walker documents those exclusions as protection against noisy or untrusted content. The uncovered roots are the ordinary root/mirror/install docs outside the declared corpus. [SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/lib/corpus.mjs:22-31,53-70]

## Edge Cases

- The root and mirror files may be intentionally excluded from Gate 1 to keep the corpus focused on skill/spec documentation. If so, the missing scope must be visible in the command contract and paired with a documented direct lookup route.
- A save may update only packet-local metadata rather than trigger phrases; the stale-index finding is therefore an operational risk at the frontmatter-change boundary, not proof that every save currently changes the index corpus.
- The missing content-router conclusion is based on the bounded source tree and declared public API. A generated artifact or external package could still provide an unobserved consumer; the current source/docs boundary does not identify it.

## Questions Remaining

- Q6 is partially answered: successor retrieval intentionally drops stateful semantic features, but its corpus omits the requested root/mirror docs and its save/index ownership boundary is incomplete.
- Q1-Q5 and Q7 remain open. Next focus: freshness stamps, generated metadata, routing guards, and validate gates that may report success over these gaps.

## Sources Consulted

- [SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/lib/corpus.mjs:19-31,53-70,118-145]
- [SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/generate-trigger-index.mjs:11-15,363-380]
- [SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/lookup-trigger-index.mjs:72-85,150-178]
- [SOURCE: .opencode/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:17-65,138-147,234-255]
- [SOURCE: .opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:90-105,920-950]
- [SOURCE: .opencode/skills/system-spec-kit/scripts/core/workflow.ts:1319-1331,1580-1588]
- [SOURCE: .opencode/skills/system-spec-kit/runtime/handlers/README.md:16-23,55-73]
- [SOURCE: .opencode/skills/system-spec-kit/runtime/api/index.ts:30-40,43-56]
- [SOURCE: README.md:300-304,953-955]
- [SOURCE: AGENTS.md:330-334,453-464]
- [SOURCE: .opencode/install-guides/README.md:544-568]
- [SOURCE: .claude/hooks/README.md:5-13]
- [SOURCE: .codex/hooks/README.md:5-13]
- [SOURCE: .cursor/hooks/README.md:5-13]
- [SOURCE: .devin/hooks/README.md:5-13]
- [SOURCE: .pi/extensions/README.md:10-29]

## Assessment

- New information ratio: 0.80
- Questions addressed: Q6 trigger index, ripgrep retrieval, and continuity-writer coverage
- Questions answered: Q6 = partial; corpus omission and save/index ownership gaps are confirmed at the boundary, while intentional feature losses remain documented non-goals.
- Confidence: high for declared roots, writer/generator separation, and missing source reference; medium for the practical frequency of stale indexes and any external generated owner.

## Reflection

- What worked and why: comparing declared corpus roots with the exact requested documentation files exposed a concrete scope gap without treating the deliberate fixture exclusions as bugs.
- What did not work and why: a missing source filename alone cannot prove runtime behavior is absent when generated output or an external package may be involved, so the content-router result is split into confirmed reference gap and inferred impact.
- What I would do differently: inspect the freshness and routing gates next to determine whether they surface these boundary conditions or simply report valid artifacts.

## Recommended Next Focus

Angle 7: test freshness stamps, generated metadata integrity/drift, route guards, and validate.sh contracts for green-but-misleading outcomes after decommission changes.
