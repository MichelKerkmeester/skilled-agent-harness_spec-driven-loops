---
title: "D5-R2 — OPEN_DESIGN_TRANSPORT_RESULT v1 demand-back + parent-side fail-closed re-validation"
description: "Define a transport result schema + parent replay that rejects missing/mismatched digests and fails closed when Open Design was used but no result returns."
trigger_phrases:
  - "d5-r2 transport result revalidation"
  - "open design transport result design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D5-R2 — OPEN_DESIGN_TRANSPORT_RESULT v1 demand-back + parent-side fail-closed re-validation

## 1. OBJECTIVE
Define an `OPEN_DESIGN_TRANSPORT_RESULT v1` schema the child must return, plus a parent-side replay that rejects a missing/mismatched manifest, assertion, or result digest and any unlisted mutating call — failing closed when Open Design was requested but no result comes back.

## 2. WHY
Once work crosses into a CLI child the parent loses visibility into what the child actually did. Without a demanded-back, digest-checked result, a child that ran an Open Design build with no design judgment (or wrote files silently) passes undetected.

## 3. TARGET & CLASS
- **Target file(s):** new `.opencode/skills/mcp-open-design/references/cli_child_pairing.md` + the transport-result demand-back in the 3 cli-* ALWAYS blocks
- **Severity:** P0
- **Enforcement class:** hybrid
- **Dimension:** D5 — Cross-CLI Survival

## 4. BUILD OUTLINE
- Define the result schema (payload digests, `toolsCalled`, operationClass, artifact refs) and the parent replay that recomputes and compares digests.
- Specify fail-closed semantics: Open Design requested + no result, or a mutating call absent from `toolsCalled`, is a rejection.
- Author `cli_child_pairing.md` and wire the demand-back into each cli-* ALWAYS block.
- **Candidate nested sub-phases (materialize at execution):** (a) result schema; (b) parent-side replay / digest comparator; (c) per-cli demand-back wiring.

## 5. ACCEPTANCE
- Parent re-validation rejects a returned result whose manifest/assertion/result digests do not match, and fails closed when Open Design was used but no result envelope is present; a text-only child without a tool stream is flagged advisory, not silently passed.

## 6. EVIDENCE
- `.opencode/skills/mcp-open-design/SKILL.md:21` — the MANDATORY PAIRING precondition (transport, never taste) the returned result must prove was honored.
- Source: `research/research.md` §8 (D5-R2); demand-back / fail-closed evidence `research/iterations/iteration-048.md:57`.

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.
