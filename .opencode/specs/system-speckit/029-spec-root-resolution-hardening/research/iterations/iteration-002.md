# Iteration 2: Canonical-First Contract and Legacy-Consumer Regressions

## Focus

This iteration tested whether canonical-first should be the universal **unqualified root-selection** contract and traced the concrete behavior change for every legacy-first consumer or persisted-identity dependency inventoried in iteration 1. “Universal” is interpreted narrowly: canonical wins ambiguous bare-name resolution, while explicit rooted inputs and legacy-only read fallback remain supported. A canonical-only cutover was evaluated separately and rejected.

## Findings

1. **Canonical-first is the correct universal default for unqualified selection, but not a license to erase explicit-root preservation or legacy fallback.** The already-canonical MCP discovery and Gate-3 binding establish `.opencode/specs` as the authoritative default, while tracked creation and maintenance utilities also target it directly. The scripts-side order is the outlier. `generate-context` already preserves explicit `specs/...` and `.opencode/specs/...` inputs before searching roots, so changing the default order need not invalidate deliberate legacy references. The regression-safe contract is therefore: canonical wins ambiguity; an explicit qualified/absolute path wins over defaults; legacy-only packets remain readable; and write-boundary validation accepts both roots during migration. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/iterations/iteration-001.md:28-34] [SOURCE: .opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:269-338] [SOURCE: .opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:352-380]

2. **A canonical-first reorder has one material selection regression: ambiguous duplicates switch from the legacy packet to the canonical packet.** With the current symlink, both spellings resolve to one inode and `getAllExistingSpecsDirs()` realpath-deduplicates them, so only the returned spelling changes. If only `specs/` exists, `findActiveSpecsDir()` still falls back to it. If both roots are distinct, loops that enumerate `getSpecsDirectories()` still find a unique legacy packet after checking canonical; only the same relative packet present under both roots changes winner. Converting the API to canonical-only would be different and unsafe because it would orphan legacy-only packets. [SOURCE: .opencode/skills/system-spec-kit/scripts/core/config.ts:321-360] [SOURCE: .opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:309-323] [SOURCE: .opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:368-380] [INFERENCE: canonical-first changes the selected object only when both distinct roots satisfy the same unqualified lookup; alias spelling and search order can change in the other cases, but the reachable object does not]

3. **Concrete reader/detector regressions are bounded and classifiable per iteration-1 consumer.** Child-folder search and the main folder detector will select the canonical duplicate for a bare child/name instead of the legacy duplicate; explicit rooted detector input remains unchanged. The session collector will likewise bind an unqualified duplicate to canonical and its related-doc reader will follow that matched root, potentially changing the `spec.md`/task context read when duplicate contents diverge. Directory setup’s containment check and nested-changelog validation are membership-only and therefore do not retarget writes; only active-root diagnostics and “did you mean” listings reorder toward canonical. Unique legacy packets remain discoverable because these selectors enumerate both roots or retain the matched explicit root. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/iterations/iteration-001.md:13-27] [SOURCE: .opencode/skills/system-spec-kit/scripts/core/config.ts:321-360] [SOURCE: .opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:766-809] [INFERENCE: the concrete user-visible regression is different content only for duplicate relative identities; membership-only consumers cannot choose a different target]

4. **For automatic writes, `generate-context` has a real collision regression but the canonical-save workflow adds no independent root-spelling regression.** A bare or stripped nested reference checks roots in shared order, so a duplicate will switch write target to canonical; a not-yet-existing nested reference uses the active root and will also be created canonically after the reorder. Conversely, an explicit project-scoped path is retained even when absent, and an exact existing relative path is returned before root enumeration, preserving intentional legacy writes. Downstream, the workflow receives an absolute detected folder, derives a root-relative `specFolderName`, validates that exact folder, and updates `description.json` under the same absolute target. Thus its description regeneration does not independently jump roots; any changed target originates in upstream ambiguous detection. [SOURCE: .opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:269-329] [SOURCE: .opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:352-380] [SOURCE: .opencode/skills/system-spec-kit/scripts/core/workflow.ts:1016-1058] [SOURCE: .opencode/skills/system-spec-kit/scripts/core/workflow.ts:1325-1345] [SOURCE: .opencode/skills/system-spec-kit/scripts/core/workflow.ts:1663-1687]

5. **The persisted identities inspected do not require a legacy-to-canonical rewrite.** Phase-pointer updates prefer an existing `graph-metadata.json.packet_id`; the fallback derives a root-relative ID, so equivalent packet locations under either root yield the same relative identifier rather than persisting `specs/` versus `.opencode/specs/`. The workflow similarly persists/passes `specFolderName`, calculated relative to the detected containing root, rather than the root spelling. The concrete persistence risk is instead semantic: if duplicate packets have different metadata, canonical-first reads and then updates the canonical packet’s identity/description. Existing stored IDs are not themselves made invalid by an order reversal. [SOURCE: .opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:531-549] [SOURCE: .opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:590-607] [SOURCE: .opencode/skills/system-spec-kit/scripts/core/workflow.ts:1016-1053] [SOURCE: .opencode/skills/system-spec-kit/scripts/core/workflow.ts:1325-1345] [INFERENCE: root-relative IDs are stable across equivalent root spellings, while divergent duplicate metadata follows whichever physical packet wins selection]

## Ruled Out

- A canonical-only resolver was ruled out because `getSpecsDirectories()` consumers rely on enumeration to retain unique legacy-only packet discoverability. [SOURCE: .opencode/skills/system-spec-kit/scripts/core/config.ts:321-360]
- A bulk persisted-ID rewrite was ruled out: inspected packet IDs and workflow folder identities are stored root-relative or read from packet metadata, not persisted as the selected root alias. [SOURCE: .opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:531-549] [SOURCE: .opencode/skills/system-spec-kit/scripts/core/workflow.ts:1016-1053]
- Changing shared resolver order will not fix or regress the untracked `spec/create.sh` branch because that writer constructs `specs/` directly and does not consume the shared resolver. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/iterations/iteration-001.md:32-34]

## Dead Ends

- Treating every legacy-first call site as a write-target selector is incorrect: containment gates, diagnostics, relative-identity derivation, and description regeneration consume root lists without independently choosing a different physical packet. Reducer promotion should preserve this behavioral distinction. [INFERENCE: based on .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/iterations/iteration-001.md:13-27 and .opencode/skills/system-spec-kit/scripts/core/workflow.ts:1016-1058]

## Edge Cases

- Ambiguous input: “universal contract” was narrowed to default precedence, not removal of explicit legacy paths or fallback; canonical-only behavior was analyzed and rejected.
- Contradictory evidence: scripts are legacy-first while MCP, Gate-3, and direct canonical writers are canonical-first. The contradiction is resolved normatively in favor of canonical-first defaults because canonical is already the authoritative indexing/write-boundary surface, with legacy fallback retained. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/iterations/iteration-001.md:28-34]
- Missing dependencies: none; iteration-1 exact anchors were reused and only the resolver, automatic writer, and persistence-sensitive workflow were narrowly reread.
- Partial success: none. The contract question and regression matrix are answered; symlink provenance and symlink-absent auto-writer failures remain intentionally deferred to later key questions.

## Sources Consulted

- `.opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/iterations/iteration-001.md:9-34,78-80`
- `.opencode/skills/system-spec-kit/scripts/core/config.ts:321-360`
- `.opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:193-380,531-607,766-809`
- `.opencode/skills/system-spec-kit/scripts/core/workflow.ts:1016-1058,1325-1345,1663-1687`
- Symbol-focused production/test search for `getSpecsDirectories`, `getAllExistingSpecsDirs`, and `findActiveSpecsDir` under `.opencode/skills/system-spec-kit/scripts/`

## Assessment

- New information ratio: 1.0 (5 fully new regression/contract findings / 5 total findings)
- Questions addressed: Is canonical-first the correct universal contract, and which legacy-first consumers or persisted paths could regress under that change?
- Questions answered: Canonical-first is correct for unqualified precedence if explicit-root preservation and legacy fallback remain; every iteration-1 legacy-first consumer is classified by collision regression, diagnostic-only change, or no independent retargeting.

## Reflection

- What worked and why: Reusing iteration 1’s exact consumer inventory avoided the blocked broad scan; rereading only the shared resolver, `generate-context`, and workflow persistence paths exposed the distinction between target selection, containment, diagnostics, and identity derivation.
- What did not work and why: Treating “canonical-first” as a single boolean initially obscures the unsafe canonical-only variant; separating precedence, fallback, and explicit-path preservation produced a regression-safe contract.
- What I would do differently: Add executable two-root collision fixtures in a later validation iteration so each inferred winner change is demonstrated without modifying production code.

## Recommended Next Focus

Determine what creates and maintains the repository-root `specs` symlink, whether that mechanism is intentional and portable across supported checkout/platform modes, and which direct writers still depend on the alias rather than the shared resolver.
