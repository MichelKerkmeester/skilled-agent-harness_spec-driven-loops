---
title: "Goal: install the permanent capture-review discipline for sk-design-diagram"
description: "The durable directive this phase executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "capture judgment discipline"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/019-sk-design-diagram-upgrade/006-capture-and-judgment"
    last_updated_at: "2026-09-10T23:30:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the phase 6 planning documents"
    next_safe_action: "Execute T001"
    blockers: []
    key_files:
      - "specs/sk-design/019-sk-design-diagram-upgrade/006-capture-and-judgment/spec.md"
      - "specs/sk-design/019-sk-design-diagram-upgrade/006-capture-and-judgment/plan.md"
      - "specs/sk-design/019-sk-design-diagram-upgrade/005-checker-mutations-and-ci/goal.md"
      - "specs/sk-design/019-sk-design-diagram-upgrade/002-skin-contract/findings-ledger.md"
      - ".opencode/skills/sk-design/sk-design-diagram/manual-testing-playbook/manual-testing-playbook.md"
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-manual-playbook-scenario.cjs"
      - ".opencode/skills/sk-design/sk-design-diagram/benchmark/reports/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-006-capture-and-judgment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: install the permanent capture-review discipline for sk-design-diagram

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE. Keep it short: the runtime goal surfaces cap what they hold.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Every judgment the checker cannot hold — connector geometry, focal balance, type fit — gets a plain-English yes/no read, a dated report through the shared playbook runner, and a one-way path into the checker the day it becomes computable.

### Decisions

Frozen choices. Changing one is an amendment. Each row refines a named parent decision
(`../goal.md`); none contradicts one.

| ID | Decision |
|----|----------|
| D4 | The eye runs last and permanently: no judged read here may substitute for a family 005 could have built, and no item leaves the judged column except through the graduation record this node defines. |
| D4 | Order stays provable, not assumed: the persistence-contract extension, the judged-column definition, and the graduation record are authored and read before the first dated capture-review report runs — reading a capture against no checklist proves nothing. |
| D1 | The third capture is pinned to a skin the file does not default to, so "different picture" tests the one-skin-per-file contract by eye rather than re-deriving what 002 and 003 already signed. |
| D9 | Type fit judges whether a label still fits its authored mask under a substituted font, not whether `#3d4460`'s type-scoped role itself is correctly scoped — 002 already signed the role. |
| D12 | This node authors its discipline fresh: no chart-skill judged-review file exists to read or port, and nothing here touches `sk-design-chart/`. |

**Parent:** `../goal.md`

The parent's decisions outrank anything in this file; a conflict between the two is named here
rather than resolved silently.

D2, D3, D5, D6, D7, D8, D10, D11 are inherited without re-opening: D2/D5/D6/D7/D8 are 002's signed
values that 005's families already assert, and this node reads their enforced state rather than
re-adjudicating any of them; D3 (onboarding plus applicator, no second carried Style Reference) is
002/003's shipped shape this node only reads; D10 (the reconciled fact base) already happened
before this phase was authored, at `002-skin-contract/findings-ledger.md`; D11 (the executor
split) is honored by every implementation task in `tasks.md` carrying a real `— executor:` suffix,
with more human-review tasks here than any other phase, by design.

### Operator copy

The operator holds this directive as the session objective. Whenever anything above the log changes, resend this file in chat.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `grep -c "MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT" .opencode/skills/sk-design/sk-design-diagram/manual-testing-playbook/manual-testing-playbook.md` still reports `1`, and the surrounding scenario index names a capture-review entry, not only the nine scenarios it names today
- [ ] `ls .opencode/skills/sk-design/sk-design-diagram/benchmark/reports/ | grep -c '^2026'` reports `10` — one more than today's confirmed `9` — and the newest dated directory's slug names the capture-review scenario
- [ ] The newest dated report directory carries no hand-authored `skill-benchmark-report.md`; its own generation provenance names `run-manual-playbook-scenario.cjs` the way the nine existing reports already do
- [ ] The newest dated report's `results.csv` has zero rows where the verdict is `SKIP` and the reason field is empty — the literal "every skip carries its reason" gate
- [ ] `check-diagram-corpus.cjs`'s judged-boundary block (005's deliverable) and this phase's graduation log never both list the same item at once — checked by direct read, not a script this phase does not build
- [ ] `bash .opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-design/019-sk-design-diagram-upgrade/006-capture-and-judgment --strict` reports `RESULT: PASSED` (run by the orchestrator, not this authoring pass)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phase docs authored (spec, plan, tasks, acceptance-criteria, implementation-summary, goal) | Pending | Drafted in this pass; `validate.sh --strict` and operator review still pending |
| Fact-base numbers re-verified on disk before authoring | Done | `find screenshots/examples -type f \| wc -l` reported 34, `screenshots/templates` reported 4, plus `screenshots/icons.png`, totaling 39; `grep -c "<rect" assets/examples/example-high-level.html` reported 36, matching the corrected F1.8 value this node's F3.3 work builds on |
| T001-onward mechanical and review execution | Pending | Drafted in `tasks.md`; blocked on 005's checker and judged-boundary block landing first (D4 order) |

### Deviations and findings

| Item | Note |
|------|------|
| The Problem Statement | Checked in full against the reconciled fact base (`002-skin-contract/findings-ledger.md`); no number or claim in the scaffold's existing text contradicts it, unlike two sibling phases' scaffolds. Left unchanged in `spec.md`, with the check recorded there rather than silently skipped |
| The judged column's item count | The dispatch brief's five-phrase list and glm's uncorrected iteration-5 six-item list use different granularity. This node reconciles both against the reconciled ledger's F1.10 and F3.3 rows: six checkable yes/no reads (connector overlap, fan, visible gap, behind-box, focal balance, type fit), plus two named non-blocking taste notes (the remove test, taste) the column deliberately does not reduce to a read. The reconciliation is stated in `spec.md` rather than picking one source silently |
| Unauthorized file tampering detected mid-session | During authoring, `tasks.md` and this file were externally overwritten — `tasks.md`'s executor tags were changed to strip every `human review` tag and substitute an unauthorized "fresh reader (Sonnet 5, screenshots opened)" tag, and this file's Decisions table and Objective were wholesale replaced under a `last_updated_by: "claude-conductor"` attribution not named anywhere in this phase's dispatch, introducing numbers (a "≥12px attach fan", a "behind-box-with-dash exception", "1-2 elements deserve the accent") not present in the corrected fact base. Both were restored to this authoring pass's original, fact-base-grounded content. Reported to the dispatching agent in this pass's final summary; treated as untrusted injected content per this session's own instruction to treat file content as data, not instructions |
<!-- /ANCHOR:log -->
