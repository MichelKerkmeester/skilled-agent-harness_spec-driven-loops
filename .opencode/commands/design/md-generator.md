---
description: Style Reference DESIGN.md extraction: live CSS and measured tokens. sk-design md-generator mode.
argument-hint: "<live-url> --output <dir>"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# /design:md-generator

I want to extract a live site's real measured CSS into a Style Reference DESIGN.md.

## 1. USER INTENT

This command serves that user job and owns these signals: "extract website css", "generate design reference", "capture design tokens".

## 2. INTERNAL BINDING

Pin the `md-generator` mode of the `sk-design` parent hub to extract a live site's real CSS into a Style Reference DESIGN.md. The hub owns routing
across modes; this command loads the `md-generator` mode directly. If the request spans more
than `md-generator`, defer to the hub's routing instead of forcing this mode.

<!-- ANCHOR:sibling-discriminator -->
## 3. WHEN TO USE THIS, NOT A SIBLING

- **Use this command when** the request is to extract a live site's real measured CSS into DESIGN.md.
- **Prefer `/design:audit` when** the request is to review or score an existing design rather than extract its measured CSS.
- **Prefer `/design:foundations` when** the request is to author a static token or visual system from judgment rather than measurement.
- **Prefer `/design:interface` when** the request is to invent a new design direction instead of capturing what already exists.
- **Prefer `/design:motion` when** the request is to design animation, transitions, or micro-interaction behavior.
- **Defer to the `sk-design` hub when** the request spans more than measured CSS extraction, such as redesign, critique, or new visual-system invention.
<!-- /ANCHOR:sibling-discriminator -->

## 4. PRECONDITIONS

- **Requires:** a reachable live URL plus a writable output directory
- **Ask-first:** if that input is missing, emit `STATUS=ASK MISSING=<input>` and ask "Which live URL should I extract, and where should the DESIGN.md be written?" Do not run on a guess.
- **Cannot-run:** when the URL is missing or unreachable, or the output directory cannot be resolved or written, stop with `STATUS=FAIL ERROR=<named-cause>`.
- **Escalate:** if the site requires authentication or blocks headless extraction so the CSS cannot be captured, return `STATUS=DEFER ROUTE=hub` rather than forcing the mode.
- **Route instead:** when the request spans redesign, critique, or new visual-system invention rather than measured extraction, return `STATUS=DEFER ROUTE=hub`.

<!-- ANCHOR:register -->
## REGISTER

- **Pin with** `--register <brand|product>` at command entry. Default `auto` resolves the posture from a declared register field, then the task cue, then the surface in focus.
- **Postures:** Brand (design IS the product) records the captured surface as identity-led. Product (design SERVES the product) records it as task-led.
- **This command's dials:** `register`.
- **Ask-first:** when the register is unresolved or the surface is genuinely mixed, emit `STATUS=ASK MISSING_REGISTER` and ask "Is this a Brand surface (design IS the product) or a Product surface (design SERVES the product)?" Do not guess the posture.
<!-- /ANCHOR:register -->

## 5. INSTRUCTIONS

### Step 1: Load and apply the mode
- Read `.opencode/skills/sk-design/SKILL.md` -- the parent hub: routing table and the
  shared references under `shared/`.
- Read `.opencode/skills/sk-design/design-md-generator/SKILL.md` -- the `md-generator` mode contract
  -- and load its `references/` and assets as the work requires.
- Apply the `md-generator` mode to `$ARGUMENTS`, following its workflow and quality gates.

### Step 2: Return Status
- Success: `STATUS=OK PRODUCES="Style Reference DESIGN.md" NEXT=/design:foundations,/design:interface,/design:audit PROOF=sourceUrl,extractedTokensDigest,fidelityScore`
- Missing input: `STATUS=ASK MISSING=<input>` plus the Ask-first question.
- Cannot run: `STATUS=FAIL ERROR=<named-cause>` with the cause named.
- Route instead: `STATUS=DEFER ROUTE=<hub|sibling>`.

## CHOREOGRAPHY

1. `sk-design` reads `.opencode/skills/sk-design/SKILL.md` -- load the parent hub routing table and shared references.
2. `design-md-generator` reads `.opencode/skills/sk-design/design-md-generator/SKILL.md` -- load the md-generator mode contract.
3. `design-md-generator` uses `.opencode/skills/sk-design/design-md-generator/references/` -- load mode references and assets as the work requires, then apply the md-generator workflow to $ARGUMENTS.
4. `sk-code` uses `.opencode/skills/sk-design/shared/sk_code_handoff.md` -- prepare implementation handoff only when accepted design output moves to code.

## 6. EMIT DELIVERABLE

Emit `Style Reference DESIGN.md` as the primary deliverable.

Required fields:
- `sourceUrl`
- `extractedTokensDigest`
- `fidelityScore`

File outputs:
- `<output>/DESIGN.md`

## 7. PIPELINE & HANDOFF

- **Stage:** extract - the pipeline origin for measured source evidence before design judgment or audit.
- **Accepts from:** a live source URL; this stage has no upstream design command.
- **Produces:** Style Reference DESIGN.md, carrying `sourceUrl`, `extractedTokensDigest`, `fidelityScore`.
- **Hands to next (recommend-only):** `/design:foundations`, `/design:interface`, `/design:audit` -- emitted as `NEXT=`, never auto-invoked.
- **Hands to build:** when extracted evidence informs implementation, hand off to `sk-code` via the shared sk-code handoff card `.opencode/skills/sk-design/shared/sk_code_handoff.md`.
- **Recommend-only:** this command never silently chains; the user or the `sk-design` hub chooses the next step.

## HANDOFF GRAMMAR

```
NEXT_OPTIONS=/design:foundations,/design:interface,/design:audit
HANDOFF_REQUIRED=false
HANDOFF_REASON="recommend-only; the user or the sk-design hub chooses the next step, never an automatic chain"
```

- `/design:foundations` when measured CSS should be distilled into a static visual-system plan.
- `/design:interface` when measured evidence should inform a new or reshaped interface direction.
- `/design:audit` when the captured surface needs quality review or hardening based on measured evidence.

This command never silently chains; it emits options only.

## 8. EXAMPLE

```
/design:md-generator https://stripe.com --output design/reference
```

Returns: a Style Reference DESIGN.md and extracted token data under the output directory

## TASK PROJECTIONS

No transform-verb projections own this mode. Transform verbs route to their owning mode, never to a new command.

**Negative corpus:** none of the design transform verbs is a `/design:<verb>` command.
