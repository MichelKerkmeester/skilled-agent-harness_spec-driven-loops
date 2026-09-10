---
title: "Goal: formalize the diagram corpus's permanent capture-review discipline"
description: "The durable directive this phase executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "capture and judgment goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/019-sk-design-diagram-upgrade/006-capture-and-judgment"
    last_updated_at: "2026-09-10T23:45:00Z"
    last_updated_by: "claude-conductor"
    recent_action: "Authored the phase 6 planning documents"
    next_safe_action: "Execute T001 once 005's checker and CI gate are green"
    blockers: []
    key_files:
      - "specs/sk-design/019-sk-design-diagram-upgrade/006-capture-and-judgment/spec.md"
      - "specs/sk-design/019-sk-design-diagram-upgrade/006-capture-and-judgment/plan.md"
      - "specs/sk-design/019-sk-design-diagram-upgrade/002-skin-contract/findings-ledger.md"
      - ".opencode/skills/sk-design/sk-design-diagram/manual-testing-playbook/manual-testing-playbook.md"
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-manual-playbook-scenario.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-006-capture-and-judgment"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: formalize the diagram corpus's permanent capture-review discipline

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE. Keep it short: the runtime goal surfaces cap what they hold.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** What 005's checker cannot statically hold — pairwise connector geometry, focal
balance, type fit, the remove test, taste, and the font-substitution label-mask overflow risk —
gets a permanent, dated, script-persisted capture review, with a one-way door for any judgment
that later becomes computable.

### Decisions

Frozen choices. Changing one is an amendment. Each row refines a named parent decision
(`../goal.md`); none contradicts one.

| ID | Decision |
|----|----------|
| D1 | The skin-pinned third capture is pinned to a non-default skin so "different picture" tests the one-skin-per-file contract by eye, not merely a re-run of the same default render |
| D4 | This node is the permanent last stage of the forced order — decisions → applicator → repaint → checker → eye — and it never runs before 005's checker prints `RESULT: PASSED` against the repainted corpus with CI green |
| D9 | Nothing here re-derives 002's signed type-scoped role for `#3d4460`; the only question this node asks is whether a label still fits that role under a substituted fallback font |
| D11 | Mechanical execution (the capture script runs, the playbook scenario persists) is GLM-5.3-Flash at max through cli-pi and DevPass; every judged read (the double-capture compare, the checklist review) is Sonnet 5 at xhigh with the actual screenshots opened, never inferred from a filename |
| D12 | Nothing in `sk-design-chart/` changes; this node reads the diagram skill's own existing `manual-testing-playbook/` and `benchmark/reports/` shape and formalizes it, it does not import or edit a chart-skill file |

F1.6 and F1.10 fix this node's judged slice: pairwise connector geometry (overlap/bridge, the
≥12px attach fan, the visible 6–10px label gap, the behind-box-with-dash exception) and focal
balance (which 1–2 elements deserve the accent) stay judged by an eye until a 2D geometry pass
exists — this node is that eye, not a replacement for it, and it also states the graduation
threshold that pass would have to clear. F3.3 fixes the other half: the font-substitution
label-mask overflow risk was named by research as inference, never measured; this node specifies
the headless-browser measurement that settles it with a PASS/FAIL/SKIP, not a re-opened design
decision.

**Parent:** `../goal.md`

The parent's decisions outrank anything in this file; a conflict between the two is named here
rather than resolved silently. D1, D2, D3, D5–D9 (skin scope, font allowlist, onboarding/applicator
split, the 4px exemption list, marker/id/node/derivation/token decisions) are 002/003's signed
shape this node only reads and never re-opens. D10 (reconciled fact base) already happened before
002 was authored.

### Operator copy

The operator holds this directive as the session objective. Whenever anything above the log changes, resend this file in chat.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `manual-testing-playbook.md` names a `CAPTURE REVIEW` (`CAP-001`) scenario defining the judged column's checkable reads, the skin-pinned third capture, and the settled double-capture convention
- [ ] The extended `MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT` scope in `manual-testing-playbook.md` names the capture-review scenario and requires every `SKIP` to carry a non-empty reason
- [ ] The document states the graduation threshold pairwise connector geometry (overlap, the ≥12px fan) must clear before it leaves the judged column, and a one-way graduation-log schema that never lets an item travel back
- [ ] The document specifies the F3.3 headless-browser measurement plan (page, disabled font stack, comparison, fail condition) for the label-mask overflow risk, naming a concrete corpus instance
- [ ] `check-diagram-corpus.cjs`'s judged-boundary block and this phase's graduation log, read directly, never list the same item at the same time
- [ ] `bash .opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-design/019-sk-design-diagram-upgrade/006-capture-and-judgment --strict` reports `RESULT: PASSED` (run by the orchestrator, not this authoring pass)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phase docs authored (spec, plan, tasks, acceptance-criteria, implementation-summary, goal) | Pending | Drafted in this pass; `validate.sh --strict` and operator review still pending |
| Capture-review scenario execution | Pending | Blocked on 005's checker printing `RESULT: PASSED` with CI green (D4) |

### Deviations and findings

| Item | Note |
|------|------|
| No new script infrastructure | The diagram skill already ships `manual-testing-playbook/` and `benchmark/reports/`, and the shared `run-manual-playbook-scenario.cjs` lives at `system-deep-loop/deep-improvement/scripts/skill-benchmark/`; this node formalizes the scenario and its checklist rather than building a parallel harness |
<!-- /ANCHOR:log -->
