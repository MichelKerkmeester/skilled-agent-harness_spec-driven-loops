# Iteration 3: House Layout, Stack Ownership, And Attribution

## Focus

Turn the iteration 2 asset matrix into a concrete merge recommendation shape for `sk-interface-design`, including stack-specific ownership boundaries and third-party license handling.

## Actions Taken

- Read the updated lineage state and strategy before research.
- Read current `sk-interface-design` runtime, README, graph metadata, and Apache-2.0 license file.
- Read `sk-code` routing and supported-surface rules to verify implementation ownership boundaries.
- Re-read the external MIT license requirement.
- Read representative stack CSVs: React, Next.js, HTML/Tailwind, React Native, SwiftUI, Flutter, shadcn, and Three.js.

## Findings

- The current target skill is intentionally a lean router plus one authoritative reference. `SKILL.md` says full guidance lives in `references/design_principles.md`, loads that reference for every design task, and hands implementation to `sk-code` for detected web-surface standards. [SOURCE: .opencode/skills/sk-interface-design/SKILL.md:16-17] [SOURCE: .opencode/skills/sk-interface-design/SKILL.md:65-82]
- The README confirms the same boundary: `sk-interface-design` owns aesthetic direction and `sk-code` owns implementation and verification. This makes any future merge safer if new data is added as optional reference/data assets rather than embedded into the main design process. [SOURCE: .opencode/skills/sk-interface-design/README.md:35-40] [SOURCE: .opencode/skills/sk-interface-design/README.md:101-107]
- The graph metadata encodes the design/build boundary structurally: the skill family is `sk-code`, it enhances `sk-code`, and its causal summary says `sk-code` owns implementation while `sk-interface-design` owns palette, typography, layout, motion, copy, and default-avoidance. [SOURCE: .opencode/skills/sk-interface-design/graph-metadata.json:3-14] [SOURCE: .opencode/skills/sk-interface-design/graph-metadata.json:104-110]
- Recommended house layout: keep `SKILL.md` small; preserve `references/design_principles.md` as the primary authority; add a separate `references/design_intelligence/` subtree for external-derived material. Candidate files are `README.md` for usage/attribution, `asset-matrix.md` for ADOPT/ADAPT/SKIP summary, `data/` for adopted CSVs, `pattern-catalog.md` for adapted landing/UX/mobile/chart synthesis, and optional `scripts/design_lookup.py` only if raw data lookup is needed. This follows the target's existing resource-loading model rather than turning the runtime skill into a database dump. [SOURCE: .opencode/skills/sk-interface-design/SKILL.md:65-82] [SOURCE: .opencode/skills/sk-interface-design/SKILL.md:143-154]
- Recommended runtime routing change, if implemented later: `SKILL.md` should continue to always load `design_principles.md`; it may conditionally load design-intelligence references only for style/color/font/chart/product-pattern requests; it should not make Python search or generator execution mandatory. [SOURCE: .opencode/skills/sk-interface-design/SKILL.md:65-82] [SOURCE: .opencode/specs/skilled-agent-orchestration/143-sk-interface-design/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/scripts/search.py:56-114]
- The stack CSVs are mostly implementation checklists, not aesthetic-direction material. React covers hooks, context, performance, TypeScript, testing, and accessible queries; Next.js covers routing, server/client rendering, data fetching, APIs, deployment, and security; React Native, SwiftUI, and Flutter cover framework-specific state, navigation, layout, performance, native/platform behavior, and testing. [SOURCE: .opencode/specs/skilled-agent-orchestration/143-sk-interface-design/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/data/stacks/react.csv:1-54] [SOURCE: .opencode/specs/skilled-agent-orchestration/143-sk-interface-design/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/data/stacks/nextjs.csv:1-53] [SOURCE: .opencode/specs/skilled-agent-orchestration/143-sk-interface-design/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/data/stacks/react-native.csv:1-52] [SOURCE: .opencode/specs/skilled-agent-orchestration/143-sk-interface-design/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/data/stacks/swiftui.csv:1-51] [SOURCE: .opencode/specs/skilled-agent-orchestration/143-sk-interface-design/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/data/stacks/flutter.csv:1-53]
- Current `sk-code` does not own generic React, Next.js, React Native, Swift, Go, or unsupported stacks unless future routes are explicitly added; it currently routes Webflow/frontend and OpenCode system surfaces. Therefore stack CSVs should not be moved wholesale into either `sk-interface-design` or current `sk-code`. [SOURCE: .opencode/skills/sk-code/SKILL.md:22-31] [SOURCE: .opencode/skills/sk-code/SKILL.md:114-120] [SOURCE: .opencode/skills/sk-code/SKILL.md:240-245]
- Stack guidance classification: SKIP direct merge of React/Next/React Native/SwiftUI/Flutter framework checklists into `sk-interface-design`; ADAPT small cross-cutting design-relevant fragments such as focus, touch targets, reduced motion, image/font layout stability, semantic tokens, chart theming, and canvas accessibility into quality references; leave future implementation-stack adoption to a separate `sk-code` surface expansion. [SOURCE: .opencode/specs/skilled-agent-orchestration/143-sk-interface-design/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/data/stacks/html-tailwind.csv:27-43] [SOURCE: .opencode/specs/skilled-agent-orchestration/143-sk-interface-design/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/data/stacks/shadcn.csv:4-10] [SOURCE: .opencode/specs/skilled-agent-orchestration/143-sk-interface-design/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/data/stacks/shadcn.csv:47-55]
- Three.js guidance is valuable but mostly outside interface-design ownership. It contains implementation-critical versioning, renderer, geometry, material, lighting, raycasting, GSAP, performance, and production rules; only design-facing guardrails such as reduced motion, canvas labeling, and matching 3D control style to UX intent should be adapted into `sk-interface-design`. [SOURCE: .opencode/specs/skilled-agent-orchestration/143-sk-interface-design/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/data/stacks/threejs.csv:1-16] [SOURCE: .opencode/specs/skilled-agent-orchestration/143-sk-interface-design/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/data/stacks/threejs.csv:50-54]
- Attribution path: do not replace the existing Apache-2.0 `LICENSE.txt` or claim the merged skill is only Apache-2.0 if MIT material is added. The current target metadata and README explicitly attribute Anthropic's Apache-2.0 frontend-design source, and Apache redistribution requires retaining license/notice material. External MIT requires including the Next Level Builder copyright and permission notice in substantial copies. [SOURCE: .opencode/skills/sk-interface-design/SKILL.md:6-10] [SOURCE: .opencode/skills/sk-interface-design/README.md:136-139] [SOURCE: .opencode/skills/sk-interface-design/LICENSE.txt:90-122] [SOURCE: .opencode/specs/skilled-agent-orchestration/143-sk-interface-design/external/ui-ux-pro-max-skill-main/LICENSE:1-13]
- Recommended attribution implementation for a later merge: add a separate third-party notice or MIT license file under the skill, such as `THIRD_PARTY_NOTICES.md` or `licenses/ui-ux-pro-max-MIT.txt`; update README/SKILL metadata to state Apache-2.0 for the vendored Anthropic base plus MIT for incorporated ui-ux-pro-max data; cite which files are MIT-derived. [SOURCE: .opencode/skills/sk-interface-design/SKILL.md:6-10] [SOURCE: .opencode/specs/skilled-agent-orchestration/143-sk-interface-design/external/ui-ux-pro-max-skill-main/LICENSE:12-13]

## Recommended House Structure

```text
.opencode/skills/sk-interface-design/
  SKILL.md                              # keep lean; add optional route only
  README.md                             # document optional design-intelligence assets and mixed notices
  LICENSE.txt                           # keep existing Apache-2.0 Anthropic license
  THIRD_PARTY_NOTICES.md                # new, if MIT content is copied/adapted
  references/
    design_principles.md                # unchanged primary authority
    design_intelligence/
      README.md                         # how to use the adopted/adapted data
      asset-matrix.md                   # ADOPT/ADAPT/SKIP source map
      pattern-catalog.md                # adapted UX/landing/mobile/chart guidance
      data/
        products.csv
        styles.csv
        colors.csv
        typography.csv
        ui-reasoning.csv
        charts.csv
  scripts/
    design_lookup.py                    # optional only if CSV lookup is needed
```

## Questions Answered

- House structure: add optional reference/data subtree rather than enlarging `SKILL.md` or overwriting `design_principles.md`.
- Stack-specific ownership: skip direct stack CSV merge into `sk-interface-design`; adapt only cross-cutting design quality fragments; leave true implementation-stack adoption to future `sk-code` surface work.
- Attribution: keep Apache-2.0 attribution and add separate MIT notice/file for ui-ux-pro-max-derived content.

## Questions Remaining

- Final consolidated negative knowledge and merge-risk list for synthesis.
- Whether another iteration discovers any contradiction in the proposed merge shape.

## Ruled Out

- Moving stack CSVs wholesale into `sk-interface-design` as design guidance.
- Treating current `sk-code` as already covering all external stack CSVs.
- Replacing the existing Apache-2.0 license file with MIT or presenting mixed-source content under a single license label.
- Making `design_system.py` persistence a default behavior in the house skill.

## Sources Consulted

- .opencode/skills/sk-interface-design/SKILL.md:6-17
- .opencode/skills/sk-interface-design/SKILL.md:65-82
- .opencode/skills/sk-interface-design/SKILL.md:143-154
- .opencode/skills/sk-interface-design/SKILL.md:168-186
- .opencode/skills/sk-interface-design/README.md:35-40
- .opencode/skills/sk-interface-design/README.md:101-107
- .opencode/skills/sk-interface-design/README.md:136-139
- .opencode/skills/sk-interface-design/graph-metadata.json:3-14
- .opencode/skills/sk-interface-design/graph-metadata.json:104-110
- .opencode/skills/sk-interface-design/LICENSE.txt:90-122
- .opencode/skills/sk-code/SKILL.md:22-31
- .opencode/skills/sk-code/SKILL.md:114-120
- .opencode/skills/sk-code/SKILL.md:240-245
- .opencode/specs/skilled-agent-orchestration/143-sk-interface-design/external/ui-ux-pro-max-skill-main/LICENSE:1-13
- .opencode/specs/skilled-agent-orchestration/143-sk-interface-design/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/data/stacks/react.csv:1-54
- .opencode/specs/skilled-agent-orchestration/143-sk-interface-design/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/data/stacks/nextjs.csv:1-53
- .opencode/specs/skilled-agent-orchestration/143-sk-interface-design/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/data/stacks/html-tailwind.csv:27-43
- .opencode/specs/skilled-agent-orchestration/143-sk-interface-design/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/data/stacks/react-native.csv:1-52
- .opencode/specs/skilled-agent-orchestration/143-sk-interface-design/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/data/stacks/swiftui.csv:1-51
- .opencode/specs/skilled-agent-orchestration/143-sk-interface-design/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/data/stacks/flutter.csv:1-53
- .opencode/specs/skilled-agent-orchestration/143-sk-interface-design/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/data/stacks/shadcn.csv:4-10
- .opencode/specs/skilled-agent-orchestration/143-sk-interface-design/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/data/stacks/shadcn.csv:47-55
- .opencode/specs/skilled-agent-orchestration/143-sk-interface-design/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/data/stacks/threejs.csv:1-16
- .opencode/specs/skilled-agent-orchestration/143-sk-interface-design/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/data/stacks/threejs.csv:50-54

## Assessment

- newInfoRatio: 0.46
- Novelty justification: This iteration resolved the target layout, stack ownership boundary, and mixed-license attribution path using current target metadata plus representative stack CSV evidence.
- Confidence: High for house-layout and attribution recommendations; medium for exact file names because a later implementation packet may choose project naming conventions.

## Reflection

- What worked and why: Reading current target metadata prevented over-expanding the skill and made the separate reference/data subtree the simplest safe recommendation.
- What did not work and why: Treating stack CSVs as `sk-code` inputs was too broad because current `sk-code` explicitly does not own those generic stacks today.
- What I would do differently: In final synthesis, keep stack guidance as future-work or adaptation fragments rather than a merge target.

## Recommended Next Focus

Consolidate negative knowledge, check for contradictions across iterations, and decide whether convergence is reached before max iteration 5.

## Dead Ends

- Do not merge stack CSVs wholesale into `sk-interface-design`.
- Do not claim current `sk-code` already supports all external stack CSVs.
- Do not collapse Apache-2.0 and MIT material into one unqualified license statement.
- Do not replace the primary Anthropic-derived design principles with generated external data.
