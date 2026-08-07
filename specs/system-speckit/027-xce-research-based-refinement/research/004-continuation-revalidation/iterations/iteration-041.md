# Iteration 041 — Path and Root Drift

## Focus
Reconcile `specs/` vs `.opencode/specs`, `/speckit:*` vs `/spec_kit:*`, and current implementation paths versus packet 027 specs.

## Findings
1. The current 027 parent spec is stored under `.opencode/specs/...` and its phase map names the current active children 000-008, including `001-peck-teachings-adoption` and memory phases `002`-`008`. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:130-138]
2. The same parent spec tells users to resume a specific phase with `/spec_kit:resume`, but the command files define and document `/speckit:resume`, `/speckit:plan`, and `/speckit:implement` as the active command names. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:140-145] [SOURCE: .opencode/commands/speckit/resume.md:26-33] [SOURCE: .opencode/commands/speckit/plan.md:529-535] [SOURCE: .opencode/commands/speckit/implement.md:393-399]
3. Runtime memory indexing intentionally allows both `specs/` and `.opencode/specs/` roots, but it also performs canonical path deduplication to avoid duplicate records from the symlink/alias problem; this means research citations may mention either root, while durable metadata should converge on one canonical root. [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:626] [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:792]
4. The 027 context index says code-graph and cocoindex material moved to sibling packet 028, while `external/xce-mcp` and memory-topic research remained in 027; current 027 implementation paths should therefore focus on memory phases and peck teachings, not old code-graph/cocoindex phase paths. [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/context-index.md:1-5] [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/context-index.md:19-20]
5. The context index also records a second 2026-06-04 renumbering where peck became `001-peck-teachings-adoption` and memory phases shifted to `002`-`008`; official resume should refresh any stale child references that still point at the pre-renumbered 001-007 memory sequence. [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/context-index.md:21-40]

## Ruled Out
- Treating `/spec_kit:*` and `/speckit:*` as equivalent was ruled out because command files only exist under `.opencode/commands/speckit/` and examples consistently use `/speckit:*`. [SOURCE: .opencode/commands/speckit/resume.md:26-27]
- Treating old code-graph/cocoindex phase folders as current 027 implementation scope was ruled out because the context index moved them to 028. [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/context-index.md:1-5]

## Edge Cases
- Ambiguous input: root aliases are intentionally supported at runtime, but docs should still normalize user-facing command and packet paths.
- Contradictory evidence: parent spec says `/spec_kit:resume`; command files say `/speckit:resume`. Prefer command files as active command surface until the spec is repaired. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:144] [SOURCE: .opencode/commands/speckit/resume.md:26]
- Missing dependencies: none for local path reconciliation.
- Partial success: complete for diagnosis; no source/spec repair was performed by scope.

## Sources Consulted
- .opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:130-145
- .opencode/commands/speckit/resume.md:26-33
- .opencode/commands/speckit/plan.md:529-535
- .opencode/commands/speckit/implement.md:393-399
- .opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:626
- .opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:792
- specs/system-spec-kit/027-xce-research-based-refinement/context-index.md:1-40

## Assessment with `newInfoRatio`
newInfoRatio: 0.90. The command-name contradiction and the second 2026-06-04 renumbering are high-signal blockers for official resume. Before implementation, repair user-facing docs to `/speckit:*`, pick a canonical metadata root, and ensure 027 references memory/peck phases while 028 owns code-graph/cocoindex.

## Recommended Next Focus
Proceed to iteration 042 XCE signal/noise: reread `external/xce-mcp` and separate portable local ideas from SaaS, marketing, benchmark, and PRAT-internal claims.
