---
description: Visual system plan: color, typography, layout, spacing, tokens, theming. sk-design foundations mode.
argument-hint: "<axis> <target>"
allowed-tools: Read, Glob, Grep
---

# /design:foundations

I want to design or repair the static visual system - color, type, layout, spacing, tokens - for a surface.

## 1. USER INTENT

This command serves that user job and owns these signals: "design visual system", "define design tokens", "plan static foundations".

## 2. INTERNAL BINDING

Pin the `foundations` mode of the `sk-design` parent hub to design the static visual system - color, typography, layout, spacing, tokens. The hub owns routing
across modes; this command loads the `foundations` mode directly. If the request spans more
than `foundations`, defer to the hub's routing instead of forcing this mode.

<!-- ANCHOR:sibling-discriminator -->
## 3. WHEN TO USE THIS, NOT A SIBLING

- **Use this command when** the request is to design or correct the static visual system.
- **Prefer `/design:audit` when** the request is to review, score, accessibility-check, or harden a design surface.
- **Prefer `/design:interface` when** the request is to invent the overall interface direction, voice, or signature visual concept first.
- **Prefer `/design:md-generator` when** the request is to extract measured tokens from a live site into DESIGN.md.
- **Prefer `/design:motion` when** the request is animation, transition choreography, micro-interactions, or reduced-motion behavior.
- **Defer to the `sk-design` hub when** the request spans invention of the overall interface direction, motion choreography, or release-quality audit.
<!-- /ANCHOR:sibling-discriminator -->

## 4. PRECONDITIONS

- **Requires:** a design-system axis (color, type, layout, spacing, or tokens) plus the target surface or product context
- **Ask-first:** if that input is missing, emit `STATUS=ASK MISSING=<input>` and ask "Which axis (color, type, layout, spacing, tokens) and for which target surface?" Do not run on a guess.
- **Cannot-run:** when no axis is named, or no target/product context is given to ground the system, stop with `STATUS=FAIL ERROR=<named-cause>`.
- **Escalate:** if the request actually needs full interface invention, not a single static axis, return `STATUS=DEFER ROUTE=hub` rather than forcing the mode.
- **Route instead:** when the work is overall interface direction, motion behavior, or release-quality audit, return `STATUS=DEFER ROUTE=hub`.

<!-- ANCHOR:register -->
## REGISTER

- **Pin with** `--register <brand|product>` at command entry. Default `auto` resolves the posture from a declared register field, then the task cue, then the surface in focus.
- **Postures:** Brand (design IS the product) lets color and token density carry identity. Product (design SERVES the product) keeps the system denser, clearer, and task-led.
- **This command's dials:** `register`, `colorStrategy`, `tokenDensity`.
- **Ask-first:** when the register is unresolved or the surface is genuinely mixed, emit `STATUS=ASK MISSING_REGISTER` and ask "Is this a Brand surface (design IS the product) or a Product surface (design SERVES the product)?" Do not guess the posture.
<!-- /ANCHOR:register -->

## 5. INSTRUCTIONS

### Step 1: Load and apply the mode
- Read `.opencode/skills/sk-design/SKILL.md` -- the parent hub: routing table and the
  shared references under `shared/`.
- Read `.opencode/skills/sk-design/design-foundations/SKILL.md` -- the `foundations` mode contract
  -- and load its `references/` and assets as the work requires.
- Apply the `foundations` mode to `$ARGUMENTS`, following its workflow and quality gates.

### Step 2: Return Status
- Success: `STATUS=OK PRODUCES="Visual System Foundations Plan" NEXT=/design:interface,/design:motion,/design:audit PROOF=axis,target,tokenDecisions,contrastEvidence`
- Missing input: `STATUS=ASK MISSING=<input>` plus the Ask-first question.
- Cannot run: `STATUS=FAIL ERROR=<named-cause>` with the cause named.
- Route instead: `STATUS=DEFER ROUTE=<hub|sibling>`.

## CHOREOGRAPHY

1. `sk-design` reads `.opencode/skills/sk-design/SKILL.md` -- load the parent hub routing table and shared references.
2. `design-foundations` reads `.opencode/skills/sk-design/design-foundations/SKILL.md` -- load the foundations mode contract.
3. `design-foundations` uses `.opencode/skills/sk-design/design-foundations/references/` -- load mode references and assets as the work requires, then apply the foundations workflow to $ARGUMENTS.
4. `sk-code` uses `.opencode/skills/sk-design/shared/sk_code_handoff.md` -- prepare implementation handoff only when accepted design output moves to code.

## 6. EMIT DELIVERABLE

Emit `Visual System Foundations Plan` as the primary deliverable.

Required fields:
- `axis`
- `target`
- `tokenDecisions`
- `contrastEvidence`

## 7. PIPELINE & HANDOFF

- **Stage:** system - turns direction or measured evidence into static visual-system decisions.
- **Accepts from:** `/design:audit`, `/design:interface`, `/design:md-generator`, `/design:motion`.
- **Produces:** Visual System Foundations Plan, carrying `axis`, `target`, `tokenDecisions`, `contrastEvidence`.
- **Hands to next (recommend-only):** `/design:interface`, `/design:motion`, `/design:audit` -- emitted as `NEXT=`, never auto-invoked.
- **Hands to build:** when tokens or static-system decisions move to implementation, hand off to `sk-code` via the shared sk-code handoff card `.opencode/skills/sk-design/shared/sk_code_handoff.md`.
- **Recommend-only:** this command never silently chains; the user or the `sk-design` hub chooses the next step.

## HANDOFF GRAMMAR

```
NEXT_OPTIONS=/design:interface,/design:motion,/design:audit
HANDOFF_REQUIRED=false
HANDOFF_REASON="recommend-only; the user or the sk-design hub chooses the next step, never an automatic chain"
```

- `/design:interface` when static system decisions are ready to become a concrete interface direction or screen treatment.
- `/design:motion` when tokens or layout decisions need temporal behavior, transitions, or state choreography.
- `/design:audit` when the static system is ready for quality review, contrast evidence, or hardening.

This command never silently chains; it emits options only.

## 8. EXAMPLE

```
/design:foundations color marketing-site
```

Returns: a static visual-system plan with color, type, layout, spacing, responsive, and token guidance as applicable

## TASK PROJECTIONS

These transform verbs are advisory task projections of this mode. They are NOT standalone commands and NOT new modes.

- **typeset** (advisory) -- set a type system or target surface; applies the typography and token reference lanes.
- **colorize** (advisory) -- color a palette or surface; applies the OKLCH and palette reference lanes.

**Negative corpus:** none of these verbs is a `/design:<verb>` command. A request that asks to mint one as a top-level command is rejected; the verb routes into this mode instead.
