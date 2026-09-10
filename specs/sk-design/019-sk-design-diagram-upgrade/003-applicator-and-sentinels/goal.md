---
title: "Goal: build the sentinel contract and applicator for sk-design-diagram"
description: "The durable directive this phase executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "sentinel applicator"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/019-sk-design-diagram-upgrade/003-applicator-and-sentinels"
    last_updated_at: "2026-09-10T22:45:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the phase 3 planning documents"
    next_safe_action: "Operator ratifies plan.md's three ADRs (T001), then a GLM execution pass runs T002-T009"
    blockers: []
    key_files:
      - "specs/sk-design/019-sk-design-diagram-upgrade/003-applicator-and-sentinels/spec.md"
      - "specs/sk-design/019-sk-design-diagram-upgrade/003-applicator-and-sentinels/plan.md"
      - "specs/sk-design/019-sk-design-diagram-upgrade/002-skin-contract/findings-ledger.md"
      - ".opencode/skills/sk-design/sk-design-chart/scripts/apply-design-md.cjs"
      - ".opencode/skills/sk-design/sk-design-chart/scripts/color-gates.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-003-applicator-and-sentinels"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: build the sentinel contract and applicator for sk-design-diagram

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE. Keep it short: the runtime goal surfaces cap what they hold.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** The four templates each carry one `DIAGRAM_PALETTE` sentinel block, and
`apply-diagram-tokens.cjs` reproduces their stock bytes exactly with `--default`, so 004's repaint
has a working applicator to drive.

### Decisions

Frozen choices. Changing one is an amendment. Each row refines a named parent decision
(`../goal.md`); none contradicts one.

| ID | Decision |
|----|----------|
| D1 | The sentinel contract is `DIAGRAM_PALETTE:BEGIN skin=light\|dark\|terminal … :END`, exactly one block per file, wrapping only that file's `--color-*` custom properties inside its existing `:root` rule. The chart's second `_DARK` block does not transfer — 0/38 diagram files use `prefers-color-scheme`, and a diagram is exported at one ground, not switched live in the browser. |
| D3 | The applicator is `apply-diagram-tokens.cjs`, a third hand-run script beside onboarding: it reads the diagram's own token source, computes gates against the three grounds through the ported four-function module, writes copies to `--out`, and never edits `assets/templates/` in place. `--default` reproduces the stock bytes exactly, mechanizing shipped-default detection as a byte diff rather than a judgment call. |
| D8 | The ported gate check refuses any computed ratio below the derivation record's signed gate, except a row the record marks `departs` (the accent at its signed 2.863:1), which is honored rather than refused. |
| D12 | `color-gates.cjs`'s four exports (`channel`, `luminance`, `contrast`, `round2`) are ported verbatim into a new diagram-owned module. This is a port, not a shared import — the diagram applicator never requires a chart-skill path at runtime, so nothing in the chart skill changes for this phase. |

**Parent:** `../goal.md`

The parent's decisions outrank anything in this file; a conflict between the two is named here
rather than resolved silently.

D4 (forced order) is honored by this phase building strictly after 002's decisions and strictly
before 004's repaint — it writes no example file and signs no new contract decision. D11
(executor split) is honored by every task in `tasks.md` carrying a real `— executor:` suffix.

### Operator copy

The operator holds this directive as the session objective. Whenever anything above the log changes, resend this file in chat.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `test -f .opencode/skills/sk-design/sk-design-diagram/scripts/apply-diagram-tokens.cjs` — the applicator exists
- [ ] `test -f .opencode/skills/sk-design/sk-design-diagram/scripts/color-gates.cjs` — the ported four-function gate module exists
- [ ] `node .opencode/skills/sk-design/sk-design-diagram/scripts/apply-diagram-tokens.cjs --default --out <scratch-dir> && diff -rq <scratch-dir> .opencode/skills/sk-design/sk-design-diagram/assets/templates` reports no differences — the phase gate: `--default` reproduces the stock bytes
- [ ] `grep -c "DIAGRAM_PALETTE:BEGIN" .opencode/skills/sk-design/sk-design-diagram/assets/templates/*.html` reports `1` for each of the four files — one sentinel block per file, honoring D1
- [ ] `grep -c "DIAGRAM_PALETTE_DARK" .opencode/skills/sk-design/sk-design-diagram/assets/templates/*.html` reports `0` for each of the four files — the chart's paired dark marker did not transfer
- [ ] `grep -cE "^- \[ \] T[0-9]+.*executor:" specs/sk-design/019-sk-design-diagram-upgrade/003-applicator-and-sentinels/tasks.md` reports `10` (every task line T001-T010 names an executor)
- [ ] `bash .opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-design/019-sk-design-diagram-upgrade/003-applicator-and-sentinels --strict` reports `RESULT: PASSED` (run by the orchestrator, not this authoring pass)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phase docs authored (spec, plan, tasks, acceptance-criteria, implementation-summary, goal) | Pending | Drafted in this pass; `validate.sh --strict` and operator review still pending |
| T001 ADR ratification | Pending | Three ADRs drafted in `plan.md`'s `L3: ARCHITECTURE DECISION RECORD`; operator sign-off pending |
| T002-T009 mechanical build | Pending | Drafted in `tasks.md`; GLM execution against the named diagram-skill files pending |
| T010 human review | Pending | Drafted in `tasks.md`; no template has been touched yet |

### Deviations and findings

| Item | Note |
|------|------|
| F2.3 and F2.1's node attribution | `002-skin-contract/findings-ledger.md`'s own node-distribution table assigns F2.3 to "001 (settled)" and F2.1 to "004" — not to this node. This phase's dispatch brief additionally cites both in its own tasks (T002, T004, T008) because 003 is the node that implements F2.3's already-settled D1 decision as working code, and consumes F2.1's corrected census as the token source's input, without re-opening either as a new decision. F3.4 remains the only finding the ledger attributes to 003 outright. |
| The sentinel wrap boundary | Not explicit in the parent dispatch brief; resolved in `plan.md` ADR-003 as color-only, inside the existing `:root`, since the diagram's `:root` (unlike the chart's dedicated stock block) already mixes color and font custom properties and D2 already ships the font fallback chains. |
| `template-full.html`'s `--color-rule`/`--color-rule-solid` | These are rgba spellings of `--color-ink`/`--color-muted` (confirmed on disk: `rgba(45,49,66,...)` = `#2d3142`, `rgba(79,93,117,...)` = `#4f5d75`), not independently measured values. Flagged as an open question in `spec.md` §12 for T001's ratification against 002's four-kind model, rather than silently assigning them a kind. |
<!-- /ANCHOR:log -->
