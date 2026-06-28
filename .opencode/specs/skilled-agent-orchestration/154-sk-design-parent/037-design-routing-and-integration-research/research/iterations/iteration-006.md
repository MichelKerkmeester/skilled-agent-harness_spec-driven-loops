# Iteration 6: `/design:*` Invocation Examples and Returned Artifacts

## Focus

[D2-2 / D2] `/design:*` commands carry no concrete invocation example. This pass checked whether each checked-in command wrapper gives users one real call plus the artifact returned, then compared that gap against the `impeccable-main` command/editorial pattern.

## Actions Taken

1. Re-read the strategy and prior D2 iteration to avoid re-covering generic argument hints; iteration 5 already established that the wrappers need real per-mode grammar. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/037-design-routing-and-integration-research/research/iterations/iteration-005.md]
2. Read all current `/design:*` command wrappers with line numbers and verified their visible public surface: frontmatter, purpose, load/apply instructions, and return status. [SOURCE: .opencode/commands/design/audit.md:1] [SOURCE: .opencode/commands/design/foundations.md:1] [SOURCE: .opencode/commands/design/interface.md:1] [SOURCE: .opencode/commands/design/md-generator.md:1] [SOURCE: .opencode/commands/design/motion.md:1]
3. Read `sk-design` `mode-registry.json` to check whether command examples or returned-artifact metadata already have a structured home. [SOURCE: .opencode/skills/sk-design/mode-registry.json:14]
4. Read `impeccable-main` command metadata, router, and editorial docs to compare how a more mature command family exposes examples and expected outputs. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/CLAUDE.md:287] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/site/content/skills/audit.md:74]
5. Read child-mode output contracts to derive returned artifacts from actual mode behavior instead of inventing new deliverables. [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:276] [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:239] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:180] [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:249] [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:274]

## Findings

### F1 - The current `/design:*` wrappers return only status, not a user-visible artifact contract

Evidence:
- All five command wrappers still expose the same generic `argument-hint: "<design request>"`; this was established in D2-1 and remains visible in the current files. [SOURCE: .opencode/commands/design/audit.md:3] [SOURCE: .opencode/commands/design/foundations.md:3] [SOURCE: .opencode/commands/design/interface.md:3] [SOURCE: .opencode/commands/design/md-generator.md:3] [SOURCE: .opencode/commands/design/motion.md:3]
- Each wrapper tells the agent to load the parent hub, load the child mode, and apply that mode to `$ARGUMENTS`, but none includes a `Usage`, `Example`, `Try it`, or `Returns` section. The only explicit public return is `STATUS=OK` or `STATUS=FAIL ERROR="<message>"`. [SOURCE: .opencode/commands/design/audit.md:19] [SOURCE: .opencode/commands/design/audit.md:24] [SOURCE: .opencode/commands/design/audit.md:26] [SOURCE: .opencode/commands/design/interface.md:19] [SOURCE: .opencode/commands/design/interface.md:24] [SOURCE: .opencode/commands/design/interface.md:26] [SOURCE: .opencode/commands/design/md-generator.md:19] [SOURCE: .opencode/commands/design/md-generator.md:24] [SOURCE: .opencode/commands/design/md-generator.md:26]
- `mode-registry.json` can identify modes, aliases, packet names, and advisor routing, but its mode entries stop at routing metadata; no entry has a command example, `returnsArtifact`, usage text, or expected-output field. [SOURCE: .opencode/skills/sk-design/mode-registry.json:14] [SOURCE: .opencode/skills/sk-design/mode-registry.json:21] [SOURCE: .opencode/skills/sk-design/mode-registry.json:33] [SOURCE: .opencode/skills/sk-design/mode-registry.json:45] [SOURCE: .opencode/skills/sk-design/mode-registry.json:57] [SOURCE: .opencode/skills/sk-design/mode-registry.json:69]

Buildable recommendation:
- Add a generated `## Example` block to every `.opencode/commands/design/<mode>.md` with exactly one fenced invocation and one `Returns:` line naming the concrete artifact.
- Make the source of truth a structured `commandSurface.examples[]` block, either in `mode-registry.json` or a sibling `command-metadata.json`, so command docs can be generated or drift-checked.
- First-pass examples:
  - `/design:interface redesign src/app/dashboard/page.tsx --mode production-ready --register product`
    - Returns: interface direction, passed pre-flight card, and `sk-code` handoff manifest with locked tokens, signature moves, reuse list, risks, and never-change constraints.
  - `/design:foundations color tokens for src/app --output tokens`
    - Returns: foundations handoff card with named tokens, usage rules, responsive breakpoints, CSS variable or theme-token names, source evidence, and verification risks.
  - `/design:motion SettingsDrawer open-close exit --library motion/react`
    - Returns: motion pattern card plus implementation handoff naming target states, target properties, animation mechanism, stack boundary, and verification risks.
  - `/design:audit src/checkout --scope a11y,responsive --score`
    - Returns: findings-first audit report ordered P0-P3 with evidence labels and a five-dimension score, plus accepted-finding backlog handoff when the user routes fixes.
  - `/design:md-generator https://example.com --output .opencode/specs/<track>/<packet>/output --fast`
    - Returns: `tokens.json`, a v3 Style Reference `DESIGN.md`, validation pass/fail messages, and optional visual preview/report artifacts.

Enforceability:
- ENFORCEABLE on the command corpus: a static check can fail if any `/design:*` command lacks one fenced `/design:<mode>` invocation and one `Returns:` artifact line.
- ENFORCEABLE on metadata drift: every registry mode can be required to have `commandSurface.examples[0].invocation` and `commandSurface.examples[0].returnsArtifact`, and every command wrapper can be checked against that metadata.
- ADVISORY at runtime: whether a messy user prompt should use the pinned command or defer to the hub remains judgment-based.

### F2 - `impeccable-main` separates lightweight command metadata from richer example/expected-output docs

Evidence:
- Impeccable keeps lightweight command metadata in `skill/scripts/command-metadata.json`, with each command carrying a description and `argumentHint`. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/skill/scripts/command-metadata.json:3] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/skill/scripts/command-metadata.json:31]
- Its contribution guide defines editorial command docs as four sections: `When to use it`, `How it works`, `Try it`, and `Pitfalls`; `Try it` explicitly means one or two concrete examples with expected output. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/CLAUDE.md:287] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/CLAUDE.md:291]
- The audit editorial page gives a real invocation and expected output block. It shows `/impeccable audit the checkout flow`, then a scored report with severity-tagged findings. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/site/content/skills/audit.md:74] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/site/content/skills/audit.md:80]
- The document page names the artifact before the example: output is `DESIGN.md` plus `.impeccable/design.json`, then `Try it` gives `/impeccable document` and `/impeccable document --seed`. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/site/content/skills/document.md:89] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/site/content/skills/document.md:93]
- The shape page visually labels `brief.md` as the output of `/impeccable shape`, then its `Try it` section gives a concrete invocation and explains the brief materializes after the interview. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/site/content/skills/shape.md:8] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/site/content/skills/shape.md:59]

Buildable recommendation:
- Borrow the shape, not the full site machinery: `sk-design` does not need public editorial pages yet, but each command wrapper should get a compact `Try it`/`Returns` pair.
- Keep `argumentHint` terse for command palettes, and put richer example/output semantics in structured metadata used to generate docs and tests.
- For md-generator, do not copy Impeccable's brief-oriented example style; the existing pipeline is operational and should show URL, output path, and artifact names because `extract.ts` requires an output directory outside the skill. [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:287] [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:298]

Enforceability:
- ENFORCEABLE on docs: require every design command to have the compact four-field example schema `{invocation, when, returnsArtifact, deferToHubWhen}`.
- ENFORCEABLE on a fixture corpus: parse examples and assert the invocation begins with the matching `/design:<mode>`.
- ADVISORY for editorial quality: whether the example is the best teaching example is taste-sensitive, though a reviewer can score it.

### F3 - Child modes already define returned artifacts, so example text can be generated without changing mode behavior

Evidence:
- `md-generator` explicitly names pipeline outputs: `tokens.json`, `DESIGN.md`, validation pass/fail messages, and visual preview/report artifacts. [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:239] [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:255] [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:262] [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:264]
- `audit` owns a findings-first report ordered by P0-P3 and, when accepted findings move to implementation, a backlog handoff card; it explicitly never applies fixes. [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:276] [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:282]
- `interface` requires the pre-flight card before delivery and a shared `sk-code` handoff envelope when built or specified UI moves to implementation. [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:176] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:180] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:256]
- `foundations` produces a compact handoff with named tokens, usage rules, responsive breakpoints, risks, and required CSS-variable/theme-token names. [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:249] [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:253] [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:335]
- `motion` requires a pattern card and an implementation handoff naming target states, target properties, verification risks, mechanism, and library boundary. [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:269] [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:274] [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:351]

Buildable recommendation:
- Generate the first `Returns:` line from child contracts, not from invented prose. A lightweight extractor can start with hand-authored registry fields and later validate them against child-mode `SKILL.md` phrases.
- Add a deterministic checker under the existing skill-benchmark family that validates:
  1. every design command has one example;
  2. the example's command name matches the file name;
  3. the `Returns:` artifact references at least one mode-owned output keyword;
  4. pinned commands still include the "defer to hub" condition for cross-mode prompts.

Enforceability:
- ENFORCEABLE for required artifact names and command/file matching.
- PARTLY ENFORCEABLE for child-contract traceability if the metadata stores source citations or keywords.
- ADVISORY for whether the artifact description is sufficiently helpful to a human.

## Questions Answered

- Q1: Each `/design:*` command should carry one concrete invocation and one returned-artifact line in addition to the richer argument grammar from D2-1.
- Q1: The examples should be derived from existing child-mode outputs. No mode behavior change is needed for the first implementation.
- Q5: Missing examples are deterministically enforceable in docs and metadata; deciding whether a broad prompt should use a pinned command or the hub remains advisory.

## Questions Remaining

- Should `commandSurface` live directly in `mode-registry.json`, or should `mode-registry.json` stay routing-only with a sibling `command-metadata.json` for usage/examples?
- Should the command wrappers contain the example text directly, or should a generated README/docs page be the primary human-facing surface with wrappers limited to frontmatter?
- Should `/design:interface`'s first example end at a design handoff, or should it explicitly include the `sk-code` continuation pattern because interface work commonly becomes implementation?

## Next Focus

Continue D2 with the command metadata schema and drift/replay tests: define the smallest structured fields that can generate argument hints, examples, artifact lines, sibling discriminators, and hub-defer conditions without bloating child-mode logic.
