---
description: Design QA report: accessibility, performance, responsive, anti-slop, scoring, hardening. sk-design audit mode.
argument-hint: "<target> [--scope] [--score]"
allowed-tools: Read, Glob, Grep
---

# /design:audit

I want to review, score, and harden the quality of a design surface I already have.

## 1. USER INTENT

This command serves that user job and owns these signals: "audit design quality", "critique ui surface", "score design readiness".

## 2. INTERNAL BINDING

Pin the `audit` mode of the `sk-design` parent hub to audit and harden design quality. The hub owns routing
across modes; this command loads the `audit` mode directly. If the request spans more
than `audit`, defer to the hub's routing instead of forcing this mode.

<!-- ANCHOR:sibling-discriminator -->
## 3. WHEN TO USE THIS, NOT A SIBLING

- **Use this command when** the request is to review, score, or harden an existing design surface.
- **Prefer `/design:foundations` when** the request is to create or repair a static token system, palette, typography, layout, or spacing plan.
- **Prefer `/design:interface` when** the request is to invent a new visual direction, interface concept, or signature surface.
- **Prefer `/design:md-generator` when** the request is to extract measured CSS from a live site into a Style Reference DESIGN.md.
- **Prefer `/design:motion` when** the request is to create animation choreography, transitions, or micro-interaction behavior.
- **Defer to the `sk-design` hub when** the request asks for new direction, static system design, or motion choreography rather than quality review.
<!-- /ANCHOR:sibling-discriminator -->

## 4. PRECONDITIONS

- **Requires:** a concrete design target - a URL, component, screen, or file - to inspect
- **Ask-first:** if that input is missing, emit `STATUS=ASK MISSING=<input>` and ask "What is the audit target (URL, component, screen, or file), and what scope/score do you want?" Do not run on a guess.
- **Cannot-run:** when no target is given, or the named target cannot be opened or inspected, stop with `STATUS=FAIL ERROR=<named-cause>`.
- **Escalate:** if the target needs build or run state the audit cannot reach to evidence a finding, return `STATUS=DEFER ROUTE=hub` rather than forcing the mode.
- **Route instead:** when the ask is to create new direction, a static system, or motion rather than review existing quality, return `STATUS=DEFER ROUTE=hub`.

<!-- ANCHOR:register -->
## REGISTER

- **Pin with** `--register <brand|product>` at command entry. Default `auto` resolves the posture from a declared register field, then the task cue, then the surface in focus.
- **Postures:** Brand (design IS the product) weights distinctiveness and voice. Product (design SERVES the product) weights affordance, accessibility, and consistency.
- **This command's dials:** `register`, `auditSeverity`.
- **Ask-first:** when the register is unresolved or the surface is genuinely mixed, emit `STATUS=ASK MISSING_REGISTER` and ask "Is this a Brand surface (design IS the product) or a Product surface (design SERVES the product)?" Do not guess the posture.
<!-- /ANCHOR:register -->

## 5. INSTRUCTIONS

### Step 1: Load and apply the mode
- Read `.opencode/skills/sk-design/SKILL.md` -- the parent hub: routing table and the
  shared references under `shared/`.
- Read `.opencode/skills/sk-design/design-audit/SKILL.md` -- the `audit` mode contract
  -- and load its `references/` and assets as the work requires.
- Apply the `audit` mode to `$ARGUMENTS`, following its workflow and quality gates.

### Step 2: Return Status
- Success: `STATUS=OK PRODUCES="Design Quality Audit Report" NEXT=/design:foundations,/design:interface,/design:motion PROOF=target,evidenceInventory,severityFindings,qualityScore`
- Missing input: `STATUS=ASK MISSING=<input>` plus the Ask-first question.
- Cannot run: `STATUS=FAIL ERROR=<named-cause>` with the cause named.
- Route instead: `STATUS=DEFER ROUTE=<hub|sibling>`.

## CHOREOGRAPHY

1. `sk-design` reads `.opencode/skills/sk-design/SKILL.md` -- load the parent hub routing table and shared references.
2. `design-audit` reads `.opencode/skills/sk-design/design-audit/SKILL.md` -- load the audit mode contract.
3. `design-audit` uses `.opencode/skills/sk-design/design-audit/references/` -- load mode references and assets as the work requires, then apply the audit workflow to $ARGUMENTS.
4. `sk-code` uses `.opencode/skills/sk-design/shared/sk_code_handoff.md` -- prepare implementation handoff only when accepted design output moves to code.

## 6. EMIT DELIVERABLE

Emit `Design Quality Audit Report` as the primary deliverable.

Required fields:
- `target`
- `evidenceInventory`
- `severityFindings`
- `qualityScore`

## 7. PIPELINE & HANDOFF

- **Stage:** review - validates design output before the build handoff.
- **Accepts from:** `/design:foundations`, `/design:interface`, `/design:md-generator`, `/design:motion`.
- **Produces:** Design Quality Audit Report, carrying `target`, `evidenceInventory`, `severityFindings`, `qualityScore`.
- **Hands to next (recommend-only):** `/design:foundations`, `/design:interface`, `/design:motion` -- emitted as `NEXT=`, never auto-invoked.
- **Hands to build:** when accepted design findings move to implementation, hand off to `sk-code` via the shared sk-code handoff card `.opencode/skills/sk-design/shared/sk_code_handoff.md`.
- **Recommend-only:** this command never silently chains; the user or the `sk-design` hub chooses the next step.

## 8. EXAMPLE

```
/design:audit src/components/Checkout.tsx --scope a11y --score
```

Returns: a findings-first design quality report with evidence, scores, owners, and verification notes

## TASK PROJECTIONS

These transform verbs are advisory task projections of this mode. They are NOT standalone commands and NOT new modes.

- **harden** (advisory) -- harden a built surface for production readiness; applies the hardening and remediation reference lanes.
- **polish** (advisory) -- assess a near-final surface for polish readiness; applies the critique and remediation reference lanes.

**Negative corpus:** none of these verbs is a `/design:<verb>` command. A request that asks to mint one as a top-level command is rejected; the verb routes into this mode instead.
