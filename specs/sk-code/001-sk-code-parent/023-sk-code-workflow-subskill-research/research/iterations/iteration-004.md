# Iteration 4: Cross-skill overlap and lifecycle seams

## Focus

This iteration investigated the cross-skill overlap and lifecycle seams across `code-implement` -> `code-quality` -> `code-debug` -> `code-verify`, with parent `sk-code` routing files and shared references included. The selected interpretation was narrow: research the handoff contracts, route ownership, tool-surface boundaries, and lifecycle-resource seams; defer implementation of any fixes.

## Findings

1. The parent hub is intentionally routing-only and registry-driven, but lifecycle sequencing is not encoded in the router itself: `SKILL.md` says the hub resolves a single `workflowMode` through `mode-registry.json`, while `hub-router.json` supports `orderedBundle` and `surfaceBundle` outcomes without a lifecycle-specific bundle schema. This makes the mode packets the real source for handoff behavior, and creates a proposal to add a route-proof lifecycle handoff matrix rather than putting process logic in the hub. [SOURCE: .opencode/skills/sk-code/SKILL.md:52] [SOURCE: .opencode/skills/sk-code/SKILL.md:61] [SOURCE: .opencode/skills/sk-code/hub-router.json:8]
2. `mode-registry.json` is strong evidence for permission seams: `implement` and `debug` may mutate and use `Task`, `quality` may mutate only existing files and forbids `Write`/`Task`, and `verify` is non-mutating with `Write`/`Edit`/`Task` forbidden. Because the parent `SKILL.md` still lists the superset allowed tools, the safest routing proposal is to state explicitly that packet-local registry/tool-surface contracts override the parent superset after mode resolution. [SOURCE: .opencode/skills/sk-code/SKILL.md:4] [SOURCE: .opencode/skills/sk-code/mode-registry.json:21] [SOURCE: .opencode/skills/sk-code/mode-registry.json:41] [SOURCE: .opencode/skills/sk-code/mode-registry.json:60] [SOURCE: .opencode/skills/sk-code/mode-registry.json:79]
3. The shared lifecycle reference gives the cleanest end-to-end model: Research -> Implementation -> Code Quality Gate -> Debugging if checks fail -> Verification -> done only with evidence, with explicit transitions from `1 -> 1.5`, `1.5 -> 2`, `2 -> 1.5`, `1.5 -> 3`, and `3 -> 1/2`. However, its per-surface resource examples still use older path vocabulary like `references/webflow/implementation/*` and `references/opencode/shared/*`, so the lifecycle is conceptually correct but path examples need normalization to the nested packet layout. [SOURCE: .opencode/skills/sk-code/shared/references/phase_detection.md:46] [SOURCE: .opencode/skills/sk-code/shared/references/phase_detection.md:62] [SOURCE: .opencode/skills/sk-code/shared/references/phase_detection.md:74] [SOURCE: .opencode/skills/sk-code/shared/references/phase_detection.md:95]
4. `code-implement` and `code-quality` deliberately overlap on OpenCode authoring checklists: implement must load the checklist before first write, while quality owns the author-side gate after the change. The seam is useful, not redundant, but the wording in `code-quality` still says `assets/opencode-checklists/` even though its reference list points to delegated `../code-opencode/assets/checklists/*`; proposal: describe the overlap as “implement consumes; quality enforces” and replace the stale local-path label. [SOURCE: .opencode/skills/sk-code/code-implement/SKILL.md:157] [SOURCE: .opencode/skills/sk-code/code-implement/SKILL.md:180] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:144] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:240]
5. The quality/debug/verify seam is coherent but under-specified as a payload contract. `code-quality` sends unclear runtime failures to debug with observed command/output/target; `code-debug` returns code changes through quality and hands reproduction/before-after/residual-risk to verify; `code-verify` reads the implementation/quality/debug handoff and sends failures back without editing. A compact shared handoff schema would reduce agent guessing without changing ownership: `{changedScope, surface, baseline, qualityEvidence, symptom, reproductionCommand, beforeAfter, acceptedRisks, targetVerificationCommands}`. [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:147] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:149] [SOURCE: .opencode/skills/sk-code/code-debug/SKILL.md:130] [SOURCE: .opencode/skills/sk-code/code-debug/SKILL.md:197] [SOURCE: .opencode/skills/sk-code/code-verify/SKILL.md:144] [SOURCE: .opencode/skills/sk-code/code-verify/SKILL.md:181]

## Ruled Out

- Editing the hub router to encode lifecycle sequencing directly; the parent hub explicitly forbids per-mode implementation, quality, debugging, or verification logic. [SOURCE: .opencode/skills/sk-code/SKILL.md:112]
- Treating checklist overlap between `code-implement` and `code-quality` as a duplication bug; evidence shows implement consumes write-time checklists while quality enforces the gate. [SOURCE: .opencode/skills/sk-code/code-implement/SKILL.md:180] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:177]
- Treating `code-verify` failures as an opportunity for in-place repair; verify's non-mutating boundary explicitly hands defects back to sibling modes. [SOURCE: .opencode/skills/sk-code/code-verify/SKILL.md:179]

## Dead Ends

- Repeating per-skill asset inventory is now lower value; iterations 2 and 3 already covered asset-level evidence. Future work should rank proposals and validate exact path replacements rather than re-counting files.
- Adding lifecycle process into `hub-router.json` should be avoided unless framed as route metadata only; the hub's own rules keep mode contracts in mode packets.

## Edge Cases

- Ambiguous input: none; the dispatch explicitly named cross-skill overlap and lifecycle seams.
- Contradictory evidence: parent `SKILL.md` exposes a broad allowed-tools superset while `mode-registry.json` narrows each packet's tool surface; resolved as a precedence/documentation seam rather than a runtime contradiction because registry-driven mode resolution is the parent rule.
- Missing dependencies: none required; research used local packet state and target skill files.
- Partial success: none; the focused lifecycle seam pass completed, but exact implementation changes remain intentionally out of scope.

## Sources Consulted

- .opencode/skills/sk-code/SKILL.md:4
- .opencode/skills/sk-code/SKILL.md:52
- .opencode/skills/sk-code/SKILL.md:61
- .opencode/skills/sk-code/SKILL.md:112
- .opencode/skills/sk-code/mode-registry.json:21
- .opencode/skills/sk-code/mode-registry.json:41
- .opencode/skills/sk-code/mode-registry.json:60
- .opencode/skills/sk-code/mode-registry.json:79
- .opencode/skills/sk-code/hub-router.json:8
- .opencode/skills/sk-code/shared/references/phase_detection.md:46
- .opencode/skills/sk-code/shared/references/phase_detection.md:95
- .opencode/skills/sk-code/code-implement/SKILL.md:157
- .opencode/skills/sk-code/code-quality/SKILL.md:144
- .opencode/skills/sk-code/code-debug/SKILL.md:130
- .opencode/skills/sk-code/code-verify/SKILL.md:144

## Assessment

- New information ratio: 0.80
- Questions addressed:
  - Where do `code-implement`, `code-quality`, `code-debug`, and `code-verify` overlap or contradict each other?
  - What friction do users or agents encounter when routing, loading, applying, or verifying these skills?
  - Which upgrade proposals have the highest leverage and clearest evidence?
- Questions answered:
  - Cross-mode overlap is mostly intentional lifecycle overlap, with stale path vocabulary and missing payload schema as the main seams.
  - Parent routing should remain routing-only; lifecycle handoff metadata belongs in shared references or packet contracts, not hub process logic.

## Reflection

- What worked and why: Reading parent routing files together with the shared lifecycle reference exposed the seam between route selection and lifecycle execution; that produced a cleaner upgrade model than another per-skill inventory pass.
- What did not work and why: Broad grep over all Markdown returned many surface-packet hits; narrowing to parent, shared, and mode packet contracts was higher signal.
- What I would do differently: Next iteration should convert the now-evidenced proposals into a ranked change plan with exact target files, risk, and validation commands.

## Recommended Next Focus

Rank the upgrade proposals and draft an evidence-to-change matrix: exact stale path fixes, lifecycle handoff schema location, parent-registry precedence wording, and verifier-script repair priority, with “do not implement yet” preserved until the research loop converges.
