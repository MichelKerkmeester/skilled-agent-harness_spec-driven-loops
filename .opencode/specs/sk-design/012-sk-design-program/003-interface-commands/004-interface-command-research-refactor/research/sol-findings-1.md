# SOL-fast Research Report (dispatch 1: design-tool command patterns)

> cli-opencode openai/gpt-5.6-sol-fast, high; 30 webfetch + 7 read; web-informed, file:line-cited.

# Interface Command Research Report

## Executive Verdict

The current surface has strong routing, provenance, failure semantics, and evidence typing, but it is optimized as an internal governance protocol rather than a fast design tool. The highest-leverage refactor is to keep the typed envelope internally while making each public command produce one recognizable artifact, use an explicit source-of-truth hierarchy, and run command-specific verification instead of displaying the same eight-stage lifecycle every time.

## Ranked Findings

### 1. Make owned design-system context executable, not merely advisory

v0, Lovable, Figma Make, and shadcn all improve fidelity by loading actual components, tokens, consumer code, and usage rules before generation; v0 explicitly says unverified components, props, or tokens should not be used. The current commands request owned-system grounding but do not define a deterministic discovery command, reuse report, or violation scan.

**Sources:** [v0 Design Systems 2.0](https://v0.dev/docs/design-systems-2), [Lovable design systems](https://docs.lovable.dev/features/design-systems.md), [shadcn Skills](https://ui.shadcn.com/docs/skills), [Figma Make guidelines](https://help.figma.com/hc/en-us/articles/33665861260823-Add-guidelines-to-Figma-Make), `.opencode/commands/interface/design.md:17-19`.

**Why it matters:** On-brand output comes primarily from verified source material and reuse constraints, not from richer aesthetic adjectives.

### 2. Replace the mandatory eight-block response with artifact-first progressive disclosure

Every command must currently return `Route Proof`, `Resolved Brief`, `Context Manifest`, `Grounding Record`, and four more blocks, even for narrow requests. Keep those fields in the typed context envelope or an optional evidence appendix, but lead with the command-specific artifact and show only decisions, proof, risks, and next action by default.

**Source:** `.opencode/skills/sk-design/shared/creation-contract.md:130-159`.

**Why it matters:** Users invoke design commands for a direction, token plan, motion specification, audit, or reference file, not to consume workflow telemetry before seeing the result.

### 3. Add a real verification path to the four read-only commands

`design`, `foundations`, `motion`, and `audit` permit only `Read`, `Glob`, and `Grep`, while their contracts call for render inspection, viewport/theme checks, interaction scenarios, accessibility, and performance evidence. Either add an explicitly authorized browser/render verifier or make the public status distinguish `AUTHORED`, `STATICALLY_VALIDATED`, and `RUNTIME_VERIFIED` so a read-only run cannot appear fully verified.

**Sources:** `.opencode/commands/interface/design.md:4,23-25`, `.opencode/commands/interface/foundations.md:4,23-25`, `.opencode/commands/interface/motion.md:4,23-25`, `.opencode/commands/interface/audit.md:4,23-25`, [Lovable browser testing](https://docs.lovable.dev/features/browser-testing.md).

**Why it matters:** A command cannot credibly verify responsive behavior, animation quality, accessibility interaction, or performance using source inspection alone.

### 4. Make invocations self-describing and machine-validatable

The public hints expose underspecified flags such as `--mode`, `--library`, and `--scope` without allowed values, while metadata contains only one happy-path example per command. There is also drift: the design task is labeled `handoff`, but its surface says `--mode build`.

**Sources:** `.opencode/commands/interface/design.md:3,27-30`, `.opencode/commands/interface/motion.md:3`, `.opencode/commands/interface/audit.md:3`, `.opencode/skills/sk-design/command-metadata.json:350-373,453-456,767-790`.

**Why it matters:** Discoverable commands need bounded grammar, examples, validation errors, and completion candidates; otherwise users must understand internal mode vocabulary before invocation.

### 5. Generate contrastive directions before committing when the brief is visually open

Lovable generates three rendered directions for open-ended visual prompts, allows bounded refinement, and locks the selected visual language before building. `/interface:design` has an optional `directions` lane, but open-ended briefs should trigger contrastive exploration by default rather than silently selecting one aesthetic.

**Sources:** [Lovable design guidance](https://docs.lovable.dev/features/design-guidance.md), `.opencode/commands/interface/design.md:27-30`.

**Why it matters:** Comparing intentionally different directions reduces default-template convergence and makes aesthetic selection explicit and reviewable.

### 6. Treat real content and state coverage as required design inputs

Lovable recommends component-level generation with real copy because content length and intent expose layout problems hidden by placeholders; v0 similarly recommends component-first, incremental generation. The current commands mention real content, but their proof fields do not require content coverage or representative states.

**Sources:** [Lovable prompting best practices](https://docs.lovable.dev/prompting/prompting-one.md), [v0 text prompting](https://v0.dev/docs/text-prompting), `.opencode/commands/interface/design.md:11,17`.

**Why it matters:** Generic content produces generic hierarchy, spacing, empty states, and calls to action even when the palette is distinctive.

### 7. Encode brand identity as semantic decisions and prohibitions

Figma guidelines support component-specific usage rules and explicit prohibitions; v0 and Lovable persist brand rules, components, tokens, and conventions as reusable context. Add a compact `must-use`, `must-preserve`, and `must-avoid` policy to every command rather than relying mainly on register and exemplar selection.

**Sources:** [Figma Make guidelines](https://help.figma.com/hc/en-us/articles/33665861260823-Add-guidelines-to-Figma-Make), [Lovable knowledge](https://docs.lovable.dev/features/knowledge), [v0 Instructions](https://v0.dev/docs/instructions).

**Why it matters:** Non-generic output is easier to produce and test when brand identity is expressed as concrete constraints rather than mood words alone.

### 8. Make tokens relational, themed, and interoperable

shadcn themes use semantic surface/foreground pairs; Figma variables support aliases and modes; Tokens Studio separates source sets, enabled sets, references, and multidimensional themes. `/interface:foundations` should therefore require primitive-to-semantic-to-component alias chains, theme matrices, and resolved-value checks rather than accepting a flat token table.

**Sources:** [shadcn theming](https://ui.shadcn.com/docs/theming), [Figma variables](https://help.figma.com/hc/en-us/articles/14506821864087-Overview-of-variables-collections-and-modes), [Tokens Studio references](https://docs.tokens.studio/manage-tokens/token-values/references), [Tokens Studio themes](https://docs.tokens.studio/manage-themes/themes-overview).

**Why it matters:** Brand coherence comes from stable semantic relationships across components, themes, and platforms, not from isolated color values.

### 9. Separate scoring from evidence in audits

The audit metadata requires `qualityScore`, but the reviewed command surface does not define a scoring formula, minimum evidence set, denominator, or treatment of blocked checks. Scores should be emitted only after dimension-level evidence is available; otherwise return findings and `SCORE=WITHHELD`.

**Sources:** `.opencode/skills/sk-design/command-metadata.json:159-170`, `.opencode/commands/interface/audit.md:9-25`, `.opencode/skills/sk-design/shared/creation-contract.md:143-174`.

**Why it matters:** An unexplained score creates false precision and makes benchmark comparisons unstable.

### 10. Turn design-reference provenance into a complete extraction manifest

`design-reference` promises `DESIGN.md` and extracted token data, but metadata declares only `<output>/DESIGN.md`; `fidelityScore` is required without a formula in the reviewed files. The command should emit token data, capture coverage, provenance, validation results, and unsupported-value counts as separate machine-readable artifacts.

**Sources:** `.opencode/skills/sk-design/command-metadata.json:628-632,696,743-757`, `.opencode/commands/interface/design-reference.md:9-25`, [Design Tokens format](https://www.designtokens.org/tr/drafts/format/).

**Why it matters:** Extraction is verifiable only when every generated claim can be traced to a source observation and checked independently.

## Cross-Command Refactor

### Public Contract

Use this concise public response shape:

1. **Status:** `ASK`, `DEFER`, `FAIL`, or `OK`, plus proof level.
2. **Artifact:** the direction, token plan, motion spec, audit, or extracted reference.
3. **Decisions:** accepted assumptions and preserved constraints.
4. **Proof:** checks run, scenarios covered, and failures.
5. **Next action:** one recommended handoff.

Keep the full context envelope and evidence ledger machine-readable or behind an optional `--evidence full` flag.

### Invocation Contract

Every command should provide:

- Enumerated flag values in `argument-hint` and metadata.
- One minimal invocation and one fully specified invocation.
- Missing-input, invalid-flag, and sibling-route examples.
- Shell-style parse validation before mode loading.
- Clear defaults and a `--dry-run` or `:confirm` path for costly work.
- Completion candidates sourced from `command-metadata.json`.
- Auto-trigger fixtures even if `autoTriggerEligible` remains false.

## Per-Command Recommendations

### `/interface:design`

**Recommended grammar**

```text
/interface:design <target>
  [--goal "<primary job>"]
  [--mode direction|directions|redesign|preflight|handoff|aesthetic]
  [--brand <file|url|system>]
  [--output direction-spec|handoff]
  [--register brand|product]
  [:auto|:confirm]
```

**Refactor**

- Make `directions` the default when visual identity is unresolved; produce three contrastive options that differ on named axes such as type voice, composition, density, color strategy, and signature move.
- Require a source hierarchy: owned components and tokens, real consumer example, real content, then at most one external exemplar.
- Add explicit `must-use`, `must-preserve`, `must-avoid`, and `generic-default-rejected` fields.
- Replace the eight visible blocks with an `Interface Direction Spec` containing design thesis, dials, component reuse map, representative states, responsive behavior, and one selected signature move.
- Verify component/token adherence statically; upgrade to runtime proof only after representative desktop and mobile renders are inspected.

### `/interface:foundations`

**Recommended grammar**

```text
/interface:foundations <color|type|spacing|layout|hierarchy|responsive|theme|tokens|all> <target>
  [--source <token-file|design-system>]
  [--themes <comma-list>]
  [--viewports <comma-list>]
  [--format css|dtcg|figma|plan]
  [--register brand|product]
  [:auto|:confirm]
```

**Refactor**

- Emit primitive, semantic, and component token layers with alias paths and resolved values.
- Require background/foreground pairs, state tokens, light/dark or declared theme matrices, typography roles, spacing rhythm, and breakpoint intent only for selected axes.
- Detect raw-value duplication, broken aliases, circular references, missing types, unassigned semantic roles, and inaccessible contrast pairs.
- Support a DTCG-compatible machine artifact where token generation is requested; label authored values separately from extracted values.
- Verify schema, alias resolution, contrast, theme completeness, and representative content lengths.

### `/interface:motion`

**Recommended grammar**

```text
/interface:motion <target> --from <state> --to <state>
  [--trigger <event>]
  [--library css|motion|framer-motion|gsap|native|none]
  [--budget restrained|standard|expressive]
  [--reduced-motion replace|shorten|remove]
  [--register brand|product]
  [:auto|:confirm]
```

**Refactor**

- Replace the ambiguous `<component-state>` argument with explicit source and destination states.
- Emit a transition table containing trigger, purpose, affected property, duration token, easing token, sequence, interruption, reversal, completion, and reduced-motion equivalent.
- Treat timing and easing as reusable variables/tokens where the target system supports them; Figma now models both as variable types.
- Require semantic parity under reduced motion, not merely animation removal.
- Verify allowed animated properties, duration budget, interruption/reversal behavior, reduced-motion selection, and representative interaction scenarios.

### `/interface:audit`

**Recommended grammar**

```text
/interface:audit <target>
  [--scope accessibility|responsive|performance|theme|brand|anti-slop|all]
  [--baseline <artifact|url|commit>]
  [--viewports <comma-list>]
  [--journey <name>]
  [--score]
  [--register brand|product]
  [:auto|:confirm]
```

**Refactor**

- Add a browser or declared transport verifier for runtime claims; otherwise label the result `STATIC_AUDIT`.
- Require each finding to contain expected behavior, observed behavior, reproduction scenario, evidence artifact, severity, confidence, owner, acceptance criterion, and regression risk.
- Define a versioned scoring rubric with dimension weights and minimum evidence coverage; withhold the total score when required dimensions are blocked.
- Separate brand drift from generic-template risk: brand drift compares against owned constraints, while anti-slop evaluates repeated generic structures and unsupported decorative choices.
- Verify accepted remediation by replaying exactly the baseline scenarios and reporting before/after deltas.

### `/interface:design-reference`

**Recommended grammar**

```text
/interface:design-reference <live-url> --output <dir>
  [--routes <comma-list>]
  [--states <comma-list>]
  [--viewports <comma-list>]
  [--themes <comma-list>]
  [--format design-md|dtcg|both]
  [--overwrite]
  [:auto|:confirm]
```

**Refactor**

- Emit `DESIGN.md`, `tokens.tokens.json`, `provenance.json`, and `extraction-report.json`; include a capture manifest when screenshots or browser observations exist.
- Record URL, route, state, viewport, theme, timestamp, selector or CSS source, raw value, normalized value, and confidence for each extracted token family.
- Define fidelity as explicit metrics: sampled exact-value accuracy, route/state coverage, required-section completeness, unresolved-variable count, and unsupported-inference count.
- Validate DTCG types and aliases when token JSON is emitted; preserve vendor metadata without presenting it as standardized meaning.
- Fail rather than invent when the canonical source is unavailable, and report partial coverage when dynamic or authenticated states cannot be captured.

## Verification And Benchmark Design

| Dimension | Deterministic test | Runtime or human test |
|---|---|---|
| Routing | Labeled prompt corpus with expected command, status, and sibling deferral | Ambiguous-prompt review and false-route rate |
| Invocation | Grammar parser tests for flags, required values, defaults, and error text | First-use task completion without reading internal docs |
| Intake | Required-field schema and consolidated-question snapshot tests | User rating of whether questions changed material decisions |
| Brand adherence | Unknown-component count, raw-token count, prohibited-pattern scan, reuse ratio | Blind comparison against owned brand exemplars |
| Non-generic quality | Detect repeated stock layouts, unsupported gradients, decorative cards, generic copy, and unearned motion | Pairwise preference against an ungrounded baseline, with brand fit scored separately from novelty |
| Foundations | Token schema, type, alias, cycle, contrast, theme, and naming checks | Browser checks across declared themes and viewports |
| Motion | State-table completeness, allowed-property scan, timing budget, reduced-motion parity | Interaction replay, interruption/reversal scenarios, frame inspection |
| Audit | Finding schema, severity/confidence separation, evidence coverage, score eligibility | Matched baseline/re-test scenarios |
| Extraction | Provenance completeness, exact-value samples, schema validation, unsupported inference count | Sampled visual comparison across route/state/viewport/theme matrix |
| Stability | Run each benchmark across multiple model runs and record route, artifact, and score variance | Periodic blind review of changed benchmark outputs |

### Minimum Benchmark Corpus

- Five clear positive prompts per command.
- Five missing-input prompts per command.
- Five sibling-confusion prompts per command.
- Five brand-grounded prompts with owned components and tokens.
- Five ungrounded prompts expected to lower the evidence ceiling.
- Responsive, dark-mode, localization, loading, empty, error, and long-content cases.
- Motion interruption and reduced-motion cases.
- Extraction cases with CSS variables, aliases, computed values, inaccessible routes, and unsupported dynamic states.
- At least one intentionally generic baseline per design prompt for pairwise comparison.

### Release Gate

A command revision is ready only when it passes grammar validation, routing fixtures, output-schema validation, evidence-label checks, and its mode-specific verifier. Visual quality should be accepted through blind pairwise comparison against the previous command version, while brand adherence, accessibility, responsiveness, and extraction fidelity remain independently measured rather than collapsed into one subjective score.