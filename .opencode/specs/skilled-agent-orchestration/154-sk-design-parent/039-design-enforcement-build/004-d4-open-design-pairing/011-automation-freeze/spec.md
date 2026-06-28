---
title: "D4-R11 — Headless automation freeze at od automation create + two-phase validator"
description: "Freeze automationBinding (routine/schedule/subject/payload digests, maxRunsBeforeReview, singleFire/reviewWindow) at schedule creation; fire-time replay only."
trigger_phrases:
  - "d4-r11 automation freeze"
  - "headless automation gate design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D4-R11 — Headless automation freeze at od automation create + two-phase validator

## 1. OBJECTIVE
Freeze an `automationBinding` (routine/schedule/subject/payload digests, `maxRunsBeforeReview`, `singleFire`/`reviewWindow`) at `od automation create` time and run a two-phase validator so headless fires can only replay the frozen, pre-authorized binding.

## 2. WHY
Headless automation fires with no interactive operator, so a normal fire-time gate has no human to authorize it. Freezing the binding at creation and allowing only replay at fire-time keeps scheduled runs inside the originally authorized envelope.

## 3. TARGET & CLASS
- **Target file(s):** `.opencode/skills/mcp-open-design/references/od_cli_reference.md:189` (automation section) + validator
- **Severity:** P1
- **Enforcement class:** enforceable
- **Dimension:** D4 — mcp-open-design Pairing

## 4. BUILD OUTLINE
- Capture and freeze `automationBinding` digests + `maxRunsBeforeReview` + `singleFire`/`reviewWindow` at `od automation create`.
- Phase 1: validate full authorization at creation; Phase 2: at fire-time, accept only an exact replay of the frozen binding.
- Deny fires that exceed `maxRunsBeforeReview` or whose digests drift from the frozen binding.

## 5. ACCEPTANCE
- An automation fire whose subject/payload digest diverges from the frozen binding, or that exceeds `maxRunsBeforeReview`, is DENIED; a faithful replay within the review window passes.

## 6. EVIDENCE
- `.opencode/skills/mcp-open-design/references/od_cli_reference.md:189` — the `od automation` surface the create-time freeze and fire-time replay attach to.
- Source: `research/research.md` §7 (D4-R11)

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.
