---
title: "Goal: build the diagram corpus checker, its mutation suite and its CI gate"
description: "The durable directive this phase executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "checker mutation ci"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/019-sk-design-diagram-upgrade/005-checker-mutations-and-ci"
    last_updated_at: "2026-09-10T23:15:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the phase 5 planning documents"
    next_safe_action: "Execute T001"
    blockers: []
    key_files:
      - "specs/sk-design/019-sk-design-diagram-upgrade/005-checker-mutations-and-ci/spec.md"
      - "specs/sk-design/019-sk-design-diagram-upgrade/005-checker-mutations-and-ci/plan.md"
      - "specs/sk-design/019-sk-design-diagram-upgrade/004-corpus-and-catalog/goal.md"
      - "specs/sk-design/019-sk-design-diagram-upgrade/002-skin-contract/findings-ledger.md"
      - ".opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs"
      - ".opencode/skills/sk-design/sk-design-chart/scripts/tests/corpus-mutations.test.cjs"
      - ".github/workflows/chart-corpus.yml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-005-checker-mutations-and-ci"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Goal: build the diagram corpus checker, its mutation suite and its CI gate

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE. Keep it short: the runtime goal surfaces cap what they hold.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** The corpus 004 hands over green gets its first automated gate — a named-family checker, a mutation suite that proves each family fires for its stated reason, and a CI workflow that blocks on both — so 006 inherits an enforcement layer instead of a manual taste checklist.

### Decisions

Frozen choices. Changing one is an amendment. Each row refines a named parent decision
(`../goal.md`); none contradicts one.

| ID | Decision |
|----|----------|
| D2 | The no-external family ships a one-entry `fonts.googleapis.com` allowlist as net-new work — no exception precedent exists in the chart to port — and encodes 002 T006's `assets/icons.html` scope (in-corpus for the allowlist, outside the counted 34-example/4-template sets) rather than re-deciding it. |
| D4 | This node's checker ships only after 004 hands it a green corpus; the first `RESULT: PASSED` run against that corpus is read as both 004's dress-run gate and this node's own precondition that every family holds — resolving the forced order without a second dress run. |
| D6 | The marker-vocabulary and unique-ids families assert exactly what 002 T003 signed — define only what you draw, per file; ids unique per file — over the repainted corpus; neither family re-opens the vocabulary. |
| D7 | The node-budget family counts `data-diagram-node`-tagged elements, never raw `<rect>`, closing the 36-vs-29 ambiguity in `example-high-level.html` that D7 exists to remove. |
| D8 | The derivation-gates family re-derives each ground's contrast from the `DIAGRAM_PALETTE` sentinel through 003's ported four-function module; the accent's 2.863:1 stays a recorded departure it never re-derives into a failure. |
| D9 | The same derivation-gates family holds `#3d4460`'s type-scoped role and records sketchy's descope from 004's catalog without asserting a proof this corpus does not carry. |
| D12 | Every family, refusal and CI step is ported by reading the chart's shape, never by importing or editing a chart-skill file; `git diff` over `sk-design-chart/` stays empty for this phase. |

**Parent:** `../goal.md`

The parent's decisions outrank anything in this file; a conflict between the two is named here
rather than resolved silently.

D1, D3, D5, D10 and D11 are inherited without re-opening: D1/D3 (skin scope, onboarding plus
applicator) are 002/003's signed shape this node only reads; D5 (the 4px exemption list) was
signed at 002 T002 and this node's grid-4px family asserts it rather than re-adjudicating it; D10
(reconciled fact base) already happened before this phase was authored; D11 (executor split) is
honored by every implementation task in `tasks.md` carrying a real `— executor:` suffix.

### Operator copy

The operator holds this directive as the session objective. Whenever anything above the log changes, resend this file in chat.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node .opencode/skills/sk-design/sk-design-diagram/scripts/check-diagram-corpus.cjs` prints `RESULT: PASSED` against the repainted corpus
- [ ] `node --test .opencode/skills/sk-design/sk-design-diagram/scripts/tests/` passes, and its completeness guard reports no family without a case
- [ ] The checker's own family registry key count and its `tally(` call-site count agree with what `tasks.md` documents — no hand-maintained number to drift the way the chart's documented-42-vs-actual-47 count already has
- [ ] `test -f .github/workflows/diagram-corpus.yml` passes and its most recent run on this branch is green
- [ ] Every registered family has a case or a reasoned exemption, every mutant fails its named family, and CI is green with no backlog — the literal 005 → 006 handoff criterion, verified by the suite's own completeness tests and the workflow run
- [ ] `bash .opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-design/019-sk-design-diagram-upgrade/005-checker-mutations-and-ci --strict` reports `RESULT: PASSED` (run by the orchestrator, not this authoring pass)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phase docs authored (spec, plan, tasks, acceptance-criteria, implementation-summary, goal) | Pending | Drafted in this pass; `validate.sh --strict` and operator review still pending |
| Fact-base numbers re-verified on disk before authoring | Done | `grep -c "tally('"` reported `75` call sites over `47` distinct family names in the chart's checker; the diagram skill's own `scripts/` holds no checker and no `scripts/tests/`; `.github/workflows/` carries no `diagram-corpus.yml` |
| T001-onward mechanical execution | Pending | Drafted in `tasks.md`; GLM execution pending 004's repaint landing first |

### Deviations and findings

| Item | Note |
|------|------|
| The 004-dress-run circularity | 004's own T019 and this node's first successful checker run are the literal same command; D4 above states the read explicitly so neither phase treats it as two separate gates |
| `assets/icons.html`'s file scope | Already decided at 002 T006 (in-corpus for the allowlist, outside the 34/4 counted sets); this node encodes that scope in the no-external family rather than re-deciding it |
| The Problem Statement's family count | The scaffolded Problem Statement said "phase 1 contracted" the families and named a font-exception precedent that does not exist; both are corrected in `spec.md` against the reconciled fact base |
<!-- /ANCHOR:log -->
