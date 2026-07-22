# Research Synthesis — Refactoring the /interface:* Design Commands

> Phase-1 evidence base, converged from three passes: SOL-fast dispatch 1 (design-tool command
> patterns; 30 webfetch + 7 read), SOL-fast dispatch 2 (create-command alignment + benchmarking;
> read the sk-doc standard + our contract test), and native Opus-4.8 web research. Full passes:
> `sol-findings-1.md`, `sol-findings-2.md`, `opus-native-findings.md`.

## Verdict

The five `/interface:*` commands are **behaviorally tested (12/12) but neither genuinely useful nor
authoring-aligned.** They are optimized as an internal governance protocol (an eight-block lifecycle every
run) rather than a fast, grounded, verifiable design tool — and their authoring topology **conflicts with
the create-command standard.** The refactor must resolve one architectural decision (below) and then apply
a set of well-converged, evidence-backed improvements.

## Converged findings (ranked by leverage)

1. **Ground in the real design system, executably — not in prose.** [SOL-1 #1, Opus F1] Registry-based
   grounding hit **95.08% design-system compliance** (CHI-2026) vs instruction/context embedding; v0,
   Lovable, Figma Make, and shadcn all load actual components/tokens/usage rules and refuse unverified
   tokens. Our commands *request* owned-system grounding but define no deterministic discovery, reuse
   report, or violation scan. **This is the single biggest lever.**
   Sources: v0 Design Systems 2.0, Lovable design systems, shadcn Skills, Figma Make guidelines; CHI-2026 doi 10.1145/3772363.3798616.
2. **Artifact-first, not lifecycle-first.** [SOL-1 #2] Every command must currently emit `Route Proof →
   … →` eight blocks even for a narrow ask. Lead with the command's artifact (direction / token plan /
   motion spec / audit / DESIGN.md) + decisions + proof + next action; keep the typed envelope behind an
   optional `--evidence full`. Source: `creation-contract.md:130-159`.
3. **Close the verification gap.** [SOL-1 #3] `design`/`foundations`/`motion`/`audit` allow only
   `Read`/`Glob`/`Grep` yet claim render/viewport/interaction/a11y/perf checks. Add an authorized
   render/browser verifier **or** a public status tier (`AUTHORED` / `STATICALLY_VALIDATED` /
   `RUNTIME_VERIFIED`) so a read-only run cannot appear fully verified. This is what makes "verifiable" real.
4. **Self-describing, machine-validatable invocation.** [SOL-1 #4, Opus F3] Enumerate flag values in
   `argument-hint` + metadata; give a minimal and a fully-specified example; add missing-input / invalid-flag
   examples; parse-validate before mode load. Fix the **drift**: `design` is labeled `handoff` but its
   surface says `--mode build`. `description` is the load-bearing routing field.
5. **Brand as concrete constraints.** [SOL-1 #7, Opus F4] Add compact `must-use` / `must-preserve` /
   `must-avoid` policy per command; non-generic output comes from constraints + verified source, not mood words.
6. **Relational, themed, interoperable tokens.** [SOL-1 #8] `foundations` should require
   primitive→semantic→component alias chains + theme matrices + resolved-value checks, not a flat table.
   Sources: shadcn theming, Figma variables, Tokens Studio references/themes.
7. **Separate score from evidence.** [SOL-1 #9] `audit` requires `qualityScore` with no formula/denominator;
   emit `SCORE=WITHHELD` until dimension evidence exists. Likewise `design-reference` needs a real
   extraction manifest (token data, coverage, provenance, unsupported-value counts), not just `DESIGN.md`.
8. **Contrastive directions + real content/state as inputs.** [SOL-1 #5,#6] Open-ended briefs should
   generate contrasting directions before locking one; real copy + representative states are required inputs
   (placeholders hide layout/hierarchy problems).

## The architectural decision (blocks Phase 2)

**Create-command topology conflicts with the current literal-body approach.** [SOL-2 Executive Verdict]

- The **create-command standard** classifies this family as a **thin mode-pair router**: a thin Markdown
  dispatcher that owns one presentation asset (the normative prompt) + paired `_auto`/`_confirm` workflows.
  "A router is a thin dispatcher, not a full prompt body." (`create-command/SKILL.md:170-179,327-329`;
  `command-contract.json:47-82`.)
- The **012/008 rewrite** did the opposite: it made each `.md` the literal normative prompt and demoted the
  presentation `.txt` to fixtures — and the **contract test enforces that** ("literal command body, not a
  thin router", `interface-command-contract.test.mjs:129-140`).
- Consequently all 5 **fail the shared command validator** (missing `PURPOSE` / `INSTRUCTIONS` router
  sections) and the create-command **machine contract is stale** (references retired `/design:*` +
  `commands/design/`).

So "hard-align with create-command" (the goal) is **incompatible** with the literal-body topology (also a
deliberate prior directive). One must give. **Recommended resolution:** adopt the **create-command
thin-router topology** (it is the framework's authoring convention and what "create-command alignment"
means), move the literal design-brief content into each command's **owned presentation asset** (its
rightful home per the standard), keep the `.md` a thin router that adds `PURPOSE`/`INSTRUCTIONS`, update the
contract test to assert router-conformance, and **refresh the stale `command-contract.json`** to the live
`/interface:*` surface. This preserves the *useful literal brief* (in the presentation asset) while making
the family conformant — and all eight improvements above apply within that topology.

## What "benchmarked/verified" should mean [SOL-2 C]

Extend `interface-command-contract.test.mjs` to assert: (a) router conformance + no stale paths;
(b) each command's `argument-hint` enumerates flag values with a minimal + full example; (c) the status
tier is present and a read-only run cannot emit `RUNTIME_VERIFIED`; (d) artifact-first ordering. A design
benchmark measures, per command, a repeatable harness over fixture briefs: routing correctness, grounding
evidence present, artifact emitted, and status-tier honesty — with explicit pass criteria.

## Open decision for the operator

Thin-router (create-command-aligned, recommended) **vs** keep literal bodies (amend the create-command
standard to bless them). Phase 2 direction depends on this answer.
