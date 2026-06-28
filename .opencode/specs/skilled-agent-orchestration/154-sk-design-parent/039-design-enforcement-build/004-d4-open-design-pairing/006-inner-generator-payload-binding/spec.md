---
title: "D4-R6 — Inner-generator payload binding; deny raw --skip/defaults; bind inner model"
description: "Hash --message/form-answer payload into the token, deny generic 'use recommended defaults' without per-question justification, and require an explicit innerModel."
trigger_phrases:
  - "d4-r6 inner generator binding"
  - "payload binding design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D4-R6 — Inner-generator payload binding; deny raw --skip/defaults; bind inner model

## 1. OBJECTIVE
Bind the inner-generator payload to the proof token by hashing `--message`/form-answer content into it, deny generic "use recommended defaults"/`--skip` without per-question justification, and require an explicit `innerModel`.

## 2. WHY
Even with a valid token, the actual generation payload can diverge from what was authorized. Hashing the outgoing payload and forbidding blanket defaults closes the inner-generator laundering path and pins the model that runs.

## 3. TARGET & CLASS
- **Target file(s):** `.opencode/skills/mcp-open-design/references/od_cli_reference.md:183` (run section) + policy
- **Severity:** P1
- **Enforcement class:** hybrid
- **Dimension:** D4 — mcp-open-design Pairing

## 4. BUILD OUTLINE
- Specify the payload digest: which `--message`/form-answer bytes are canonicalized and hashed into the token.
- Deny raw `--skip`/"recommended defaults" unless each skipped question carries a justification.
- Require an explicit `innerModel` field and bind it into the token.

## 5. ACCEPTANCE
- A run whose outgoing `--message`/form payload digest does not match the token is DENIED; a `--skip`/defaults run without per-question justification or without `innerModel` is DENIED.

## 6. EVIDENCE
- `.opencode/skills/mcp-open-design/references/od_cli_reference.md:183` — the run section / form-answer surface the payload binding extends.
- Source: `research/research.md` §7 (D4-R6)

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.
