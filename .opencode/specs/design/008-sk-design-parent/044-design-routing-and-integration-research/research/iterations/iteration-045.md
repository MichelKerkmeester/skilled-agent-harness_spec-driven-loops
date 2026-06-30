# Iteration 45: MON-B3 - Designer-Skills Command Recipes for D2/D3

## Focus

[MON-B3 / D6] Switch corpus: how `designer-skills-main`'s nine-plugin command structure handles routing/utilization, command argument grammar, and chaining, then port the useful pattern to D2/D3.

newInfoRatio estimate: 0.74. Status: insight. ENFORCEABLE-vs-ADVISORY summary: command inventory checks, typed argument grammar lint, declared choreography, next-option graph validation, and output witness checks are enforceable on a test corpus. Naming taste, exact workflow sequencing, and whether a follow-up is the best human recommendation remain advisory unless reduced to fixture expectations.

## Actions Taken

1. Read the active strategy, prior iterations 42-44, and the state tail to avoid repeating D4 token-boundary work and confirm iteration 45 had only an `iteration_start` sentinel.
2. Enumerated the `designer-skills-main` design-practice corpus and confirmed the nine plugin folders with plugin manifests, README summaries, skills, and commands.
3. Read the root `designer-skills-main` README, all plugin README command summaries, all command markdown files, and the plugin manifests.
4. Compared that command surface against the live `.opencode/commands/design/*.md` wrappers, `sk-design/SKILL.md`, and `sk-design/mode-registry.json`.
5. Checked the on-disk command count to test whether docs can be trusted as a generated enforcement source.

## Findings

### Finding 1: The nine-plugin corpus routes by task namespace plus verb command, not by a single parent-mode wrapper

Severity: P1. ENFORCEABLE-vs-ADVISORY label: ENFORCEABLE for structural command inventory and namespace-to-owner validation; ADVISORY for the exact public command names.

The root README says the design-practice collection has 97 skills and 30 commands across nine plugins. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/README.md:63] The plugin table then divides the surface into nine named plugins with command counts: design-research 4, design-systems 3, ux-strategy 3, ui-design 4, interaction-design 3, prototyping-testing 4, design-ops 3, designer-toolkit 3, and visual-critique 2. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/README.md:67] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/README.md:69] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/README.md:77] The command list exposes verbs inside those namespaces, such as `/ui-design:design-screen`, `/ui-design:color-palette`, `/interaction-design:map-states`, `/design-ops:handoff`, and `/visual-critique:critique-screen`. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/README.md:93] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/README.md:99] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/README.md:105] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/README.md:110]

That is a different command philosophy than the current `/design:*` wrappers. Current `sk-design` is a parent hub over five modes and says the advisor routes to one identity while the hub picks the mode. [SOURCE: .opencode/skills/sk-design/SKILL.md:15] [SOURCE: .opencode/skills/sk-design/SKILL.md:41] Current `/design:interface`, `/design:foundations`, `/design:motion`, `/design:audit`, and `/design:md-generator` are thin bridges into modes with generic `<design request>` argument hints. [SOURCE: .opencode/commands/design/interface.md:3] [SOURCE: .opencode/commands/design/interface.md:9] [SOURCE: .opencode/commands/design/interface.md:13] [SOURCE: .opencode/commands/design/foundations.md:3] [SOURCE: .opencode/commands/design/motion.md:3] [SOURCE: .opencode/commands/design/audit.md:3] [SOURCE: .opencode/commands/design/md-generator.md:3]

Buildable recommendation: add a D2 command-projection layer over the existing D3 hub, rather than replacing the hub. Model each command as a `commandRecipe` entry with fields like `command`, `publicVerb`, `ownerModes[]`, `argumentGrammar`, `choreography[]`, `outputContract`, `nextOptions[]`, and `enforcementTier`. Keep `mode-registry.json` as the mode identity source, but add a sibling command metadata file or a generated `commandSurface` projection that points back to registry `workflowMode` values. The checker should fail when a command names an unknown owner mode or when wrapper files drift from recipe metadata.

### Finding 2: `argument-hint` is a useful typed grammar surface, but the corpus is only semi-structured today

Severity: P1. ENFORCEABLE-vs-ADVISORY label: ENFORCEABLE for non-generic argument grammar lint and fixture parsing; ADVISORY for whether the examples cover every real-world phrasing.

The command wrappers make input type visible at the point of invocation. `/ui-design:design-screen` asks for a screen description and gives concrete examples. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/ui-design/commands/design-screen.md:2] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/ui-design/commands/design-screen.md:3] `/design-research:interview` explicitly accepts either research goals or a transcript, and its body branches on that input kind. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/design-research/commands/interview.md:2] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/design-research/commands/interview.md:3] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/design-research/commands/interview.md:8] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/design-research/commands/interview.md:9] `/visual-critique:critique-screen` accepts a screen name, Figma URL, or image. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/visual-critique/commands/critique-screen.md:2] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/visual-critique/commands/critique-screen.md:3]

The current `/design:*` wrappers lose that specificity because every mode wrapper says only `<design request>`. [SOURCE: .opencode/commands/design/interface.md:3] [SOURCE: .opencode/commands/design/foundations.md:3] [SOURCE: .opencode/commands/design/audit.md:3] The hub has rich routing rules and a build bundle, but that is not exposed as command argument grammar. [SOURCE: .opencode/skills/sk-design/SKILL.md:56] [SOURCE: .opencode/skills/sk-design/SKILL.md:60]

Buildable recommendation: port `argument-hint` into a typed `argumentGrammar` object for each future `/design:*` task command. Example fields: `inputKinds`, `requiredSlots`, `examples`, `ambiguousIf`, `deferToHubIf`, and `parseFixtures`. A D2 checker can fail generic hints like `<design request>` for task-projection commands, require examples for URL/image/screen/component variants, and replay fixtures that map raw arguments to canonical slots such as `surface`, `artifactKind`, `register`, `designSystemSource`, and `handoffTarget`.

### Finding 3: Command utilization is encoded as ordered skill choreography

Severity: P1. ENFORCEABLE-vs-ADVISORY label: ENFORCEABLE for declared-step coverage in transcripts and proof cards; ADVISORY for quality of the resulting design judgment.

The corpus treats commands as workflows and skills as underlying domain units: "commands are workflows - verbs" and "skills run underneath them." [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/README.md:113] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/README.md:117] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/README.md:119] Individual command files make utilization concrete. `/ui-design:design-screen` declares seven ordered steps using `layout-grid`, `visual-hierarchy`, `typography-scale`, `color-system`, `spacing-system`, `responsive-design`, and `dark-mode-design`. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/ui-design/commands/design-screen.md:7] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/ui-design/commands/design-screen.md:8] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/ui-design/commands/design-screen.md:14] `/visual-critique:critique-screen` declares seven critique dimensions, then a prioritization step with P1/P2/P3 severity semantics. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/visual-critique/commands/critique-screen.md:7] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/visual-critique/commands/critique-screen.md:8] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/visual-critique/commands/critique-screen.md:15] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/visual-critique/commands/critique-screen.md:16]

Current `sk-design` wrappers do not declare a command-specific choreography. They tell the executor to read the parent hub, read the selected packet, and apply the mode to `$ARGUMENTS`. [SOURCE: .opencode/commands/design/interface.md:19] [SOURCE: .opencode/commands/design/interface.md:20] [SOURCE: .opencode/commands/design/interface.md:22] [SOURCE: .opencode/commands/design/interface.md:24] The hub's build bundle is closer to a command recipe, but it is only one broad UI-build rule, not per-command utilization proof. [SOURCE: .opencode/skills/sk-design/SKILL.md:58] [SOURCE: .opencode/skills/sk-design/SKILL.md:60]

Buildable recommendation: make `commandRecipe.choreography[]` the D3 utilization bridge. Each step should name a required mode/resource, a purpose, and a witness field. For example, a future `/design:screen` recipe could require `interface`, `foundations`, `shared/register.md`, `interface_preflight_card.md`, `brief_to_dials.md`, and selected foundations axes; a future `/design:critique` recipe could require `audit` plus finding severity output. The enforcement runner should parse the returned proof card or transcript and fail if any declared step lacks a content-bound witness.

### Finding 4: The corpus uses explicit follow-up links as a lightweight workflow graph, not silent auto-chaining

Severity: P2. ENFORCEABLE-vs-ADVISORY label: ENFORCEABLE for allowed `nextOptions[]` references and no-silent-chain checks; ADVISORY for which option should be recommended first.

Most command wrappers end with a follow-up suggestion. `/ui-design:design-screen` suggests `/responsive-audit` after producing a screen spec. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/ui-design/commands/design-screen.md:15] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/ui-design/commands/design-screen.md:17] `/design-research:interview` suggests `/synthesize` or `/discover` after a script or transcript result. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/design-research/commands/interview.md:10] The root README also gives lifecycle sequencing: research informs strategy, strategy shapes UI decisions, UI patterns become system components, and systems flow into ops. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/README.md:202] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/README.md:206] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/README.md:208]

This is valuable because it avoids both extremes: no workflow guidance, and hidden automatic chaining. Current `/design:*` wrappers only return `STATUS=OK` or `STATUS=FAIL`, with no output contract, no next-command options, and no command graph. [SOURCE: .opencode/commands/design/interface.md:26] [SOURCE: .opencode/commands/design/interface.md:27] [SOURCE: .opencode/commands/design/interface.md:28]

Buildable recommendation: add `nextOptions[]` to command metadata with `command`, `when`, `handoffArtifact`, and `requiresConfirmation: true`. The checker can enforce that every named next option resolves to a known command recipe and that command output suggests, rather than silently invokes, the next command unless the user explicitly requested chaining.

### Finding 5: The corpus itself has command-count drift, so generated enforcement needs a structural audit first

Severity: P2. ENFORCEABLE-vs-ADVISORY label: ENFORCEABLE for command file count, README table count, manifest presence, and route metadata drift checks; ADVISORY for whether public docs should be corrected to 29 or a missing command should be added.

The root README headline claims 30 design-practice commands. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/README.md:63] The plugin command counts in the same table sum to 29. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/README.md:69] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/README.md:77] The explicit "All commands" table also lists 29 rows from `/design-research:discover` through `/visual-critique:critique-ux`. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/README.md:83] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/README.md:111] The on-disk command-file count is 29 via `find external/designer-skills-main -path '*/commands/*.md' -type f | wc -l`.

Buildable recommendation: do not port this as prose-only inspiration. Add a structural `design-command-surface-check` before recipe replay. It should compare command files, command metadata, generated docs, plugin/namespace ownership, wrapper frontmatter, and route fixtures. For `sk-design`, the same check should prevent `mode-registry.json`, command metadata, and `.opencode/commands/design/*.md` from drifting.

## Questions Answered

- Q1/D2: More-specific `/design:*` commands should be task projections over the existing modes, not replacements for modes. The `designer-skills-main` pattern points to verbs like screen, palette, type-system, responsive-audit, critique, handoff, and tokenize, each with typed input grammar, output shape, and next options.
- Q2/D3: Parent-to-sub-skill utilization becomes provable when a command recipe declares required choreography and the proof card/transcript must witness every declared step with source-bound evidence. The current hub routing rule is necessary but not sufficient for command-level utilization.
- Q5/all: ENFORCEABLE backlog: command inventory audit, typed argument grammar lint, commandRecipe schema, known-owner-mode validation, choreography witness checks, outputContract checks, nextOptions graph validation, and drift checks between wrappers/metadata/docs. ADVISORY backlog: exact public command naming, preferred follow-up order, and semantic judgment about when a workflow should branch.

## Questions Remaining

- Should `commandRecipe` live in a sibling `command-metadata.json`, in `mode-registry.json.commandSurface`, or as generated files from a source schema?
- What is the first sk-design command projection set: mode pins only plus a few task verbs, or a fuller task surface modeled after the nine-plugin corpus?
- Which proof-card fields should count as utilization witnesses for per-step choreography: loaded files, cited source excerpts, output sections, or all three?
- Should command-count/doc drift cap D2 only, or also cap D3 utilization because a stale command surface cannot be a reliable replay corpus?

## Next Focus

D2/D3 command-recipe enforcement design: define the minimal schema, the first gold fixtures, and the checker phases that run before hub-router replay and proof-card utilization replay.
