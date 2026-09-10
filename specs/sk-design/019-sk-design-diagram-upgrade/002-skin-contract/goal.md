---
title: "Goal: sign the skin contract for sk-design-diagram"
description: "The durable directive this phase executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "skin contract decisions"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/019-sk-design-diagram-upgrade/002-skin-contract"
    last_updated_at: "2026-09-10T22:30:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the phase 2 planning documents and the reconciled findings ledger"
    next_safe_action: "Operator ratifies T002-T008's seven decisions, then a GLM execution pass runs T001 and T009-T013"
    blockers: []
    key_files:
      - "specs/sk-design/019-sk-design-diagram-upgrade/002-skin-contract/findings-ledger.md"
      - "specs/sk-design/019-sk-design-diagram-upgrade/001-upgrade-research/research/research.md"
      - ".opencode/skills/sk-design/sk-design-diagram/references/foundations/style-guide.md"
      - ".opencode/commands/design/diagram.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-002-skin-contract"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Goal: sign the skin contract for sk-design-diagram

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE. Keep it short: the runtime goal surfaces cap what they hold.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Every one of the seven skin-contract decisions is signed with a cited primary and rule, the derivation record's shape is specified, and every duplicated contract — the 4px rule, the accessibility statement, ownership, and version — collapses to one locus, so phase 3's applicator has a single source to read.

### Decisions

Frozen choices. Changing one is an amendment. Each row refines a named parent decision (`../goal.md`); none contradicts one.

| ID | Decision |
|----|----------|
| D5 | The 4px exemption list is font sizes plus a new derived-label-offset clause covering the flowchart's `y=230/239/298/307` violations, kept as its own case rather than folded into the font-size exemption. `SKILL.md:403` yields to `:337`. Font substitution cannot violate the grid, since it is coordinate-based (S3.1) — no third exemption is needed. |
| D6 | Markers are defined only for what a file draws — already 10/34's pattern — and every id is scoped unique per file, closing the 26/34 unprefixed `dots` id collision. |
| D7 | Nodes carry `data-diagram-node`; budgets count tagged nodes, not raw `<rect>` elements (36 in `example-high-level.html`, 7 of them arrow-label masks). Both `#eb6c36` and its `rgba(235,108,54,...)` spelling count as the same coral element. |
| D8 | The accent's 2.863:1 is signed as a recorded departure from the 3.0 emphasis gate, not re-derived — re-deriving would change the shipped brand accent (`plan.md` ADR-001). `soft` (3.48:1) may not carry sublabel or eyebrow text; it stays a structural/tertiary token. Connectors are structure (ungated) by default; a connector painted with the accent inherits the marks gate for that instance (`plan.md` ADR-002). |
| D9 | `#3d4460` is promoted to a type-scoped role, not global foundations — it is used in exactly one type (`type-high-level.md:418-419`). `#ffffff`'s 40-occurrence/13-file backend/API/step treatment is recorded as its own role so 004's repaint does not mistake it for a paper substitute. |
| D2 | The bar is one whitelisted stylesheet host (`fonts.googleapis.com`) with every family already carrying a fallback chain (`template.html:15-17` and its three siblings) — no new fallback code, only a `style-guide.md` documentation fix. No exception precedent exists in `check-corpus.cjs` to port; the allowlist is net-new work for 005. `assets/icons.html` is in-corpus for the allowlist (it independently loads the same host) but stays out of the counted 34-example/4-template sets. |
| D1 | The derivation record carries three lists (light, dark, terminal) and four kinds (primary, derived, fixed, and a new `untokenized` kind for `example-sequence-oauth-dark.html`'s intentionally fixed skin). The warm `rgba(28,25,23,...)` inversion rule retires — 0/34 files use it against cool's 32/34. |
| D3 | The derivation record inherits the pin discipline — a reference path plus a sha256 — with no second carried Style Reference; the 34 examples remain the exemplar set. |
| D12 | Five version loci collapse to `SKILL.md`'s frontmatter field as the single locus (`SKILL.md:5`, `style-guide.md:14`, `manual-testing-playbook.md:4`, `README.md:7`, `feature-catalog.md:11` all currently disagree). Ownership moves from `sk-doc` (`SKILL.md:10`, both command YAMLs) to `sk-design`, matching `mode-registry.json`'s actual registration. The accessible-SVG contract's three `SKILL.md` statements collapse to one canonical section (the output-contract bullet at `:406`) with two cross-references. `diagram.md:67`'s stale `create-diagram-*.yaml` names are corrected to the real asset names. |

**Parent:** `../goal.md`

The parent's decisions outrank anything in this file; a conflict between the two is named here rather than resolved silently.

D10 (reconciliation) is honored by T001, which produced `findings-ledger.md` before any row above
was signed. D4 (forced order) is honored by this phase writing zero code — decisions and records
only. D11 (executor split) is honored by each task in `tasks.md` carrying a real `— executor:`
suffix.

### Operator copy

The operator holds this directive as the session objective. Whenever anything above the log changes, resend this file in chat.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `test -f specs/sk-design/019-sk-design-diagram-upgrade/002-skin-contract/findings-ledger.md` — the reconciled fact base exists
- [ ] `grep -c "^| F" specs/sk-design/019-sk-design-diagram-upgrade/002-skin-contract/findings-ledger.md` reports at least 29 rows (one per glm finding)
- [ ] `grep -cE "^- \[ \] T[0-9]+.*executor:" specs/sk-design/019-sk-design-diagram-upgrade/002-skin-contract/tasks.md` reports 13 (every task line T001-T013 names an executor; anchored to task checkbox lines so the notation and frontmatter lines are not counted)
- [ ] `grep -c "data-diagram-node" specs/sk-design/019-sk-design-diagram-upgrade/002-skin-contract/plan.md` — the node-markup convention is specified in the plan
- [ ] `grep -c "1.0.0.0\|1.0.0.5\|1.0.0.7" specs/sk-design/019-sk-design-diagram-upgrade/002-skin-contract/spec.md` reports 5 or more — the five disagreeing version loci are named
- [ ] `acceptance-criteria.md` carries one AC row per REQ with a real Verification cell (no bracketed placeholder remains)
- [ ] `bash .opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-design/019-sk-design-diagram-upgrade/002-skin-contract --strict` reports `RESULT: PASSED` (run by the orchestrator, not by this authoring pass)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

### Progress

| Item | State | Evidence |
|------|-------|----------|
| T001 reconciliation ledger | Pending | `findings-ledger.md` drafted in this pass; formal execution/validation still pending |
| T002-T008 seven decisions | Pending | Drafted above and in `plan.md`'s ADRs; operator ratification pending |
| T009-T013 mechanical fixes | Pending | Drafted in `tasks.md`; GLM execution against the named skill files pending |

### Deviations and findings

| Item | Note |
|------|------|
| Reconciliation tally framing | The dispatch brief's headline count (15 confirmed / 15 corrected / 1 fabrication) does not match `lineages/sonnet/findings-registry.json`'s per-row verdicts (19 / 11 / 1). `findings-ledger.md` §1 uses the registry's per-row verdict as the grep-checkable source and states the mismatch rather than silently reconciling it. |
| F3.5's verdict | The source registry marks F3.5 `UNVERIFIABLE`, not `CONFIRMED`/`CORRECTED`/`FABRICATION`. The ledger's three-value contract records it as `CONFIRMED` with the distinction kept in the row's note, since sonnet did not contradict glm's claim, only decline to re-derive it. |
| Derivation-record file path | `references/foundations/derivation-record.md` is this phase's inferred path for the record artifact (no such file exists yet); recorded as a judgment call in `plan.md` ADR-003 and flagged as an open question in `spec.md`. |
<!-- /ANCHOR:log -->
