---
title: "Goal: repaint the corpus and build the catalog for sk-design-diagram"
description: "The durable directive this phase executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "corpus repaint catalog"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/019-sk-design-diagram-upgrade/004-corpus-and-catalog"
    last_updated_at: "2026-09-10T23:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the phase 4 planning documents"
    next_safe_action: "Execute T001"
    blockers: []
    key_files:
      - "specs/sk-design/019-sk-design-diagram-upgrade/004-corpus-and-catalog/spec.md"
      - "specs/sk-design/019-sk-design-diagram-upgrade/004-corpus-and-catalog/plan.md"
      - "specs/sk-design/019-sk-design-diagram-upgrade/003-applicator-and-sentinels/plan.md"
      - "specs/sk-design/019-sk-design-diagram-upgrade/002-skin-contract/findings-ledger.md"
      - ".opencode/skills/sk-design/sk-design-diagram/SKILL.md"
      - ".opencode/skills/sk-design/sk-design-chart/references/catalog.md"
      - ".opencode/skills/sk-design/shared/scripts/render-screenshots.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-004-corpus-and-catalog"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: repaint the corpus and build the catalog for sk-design-diagram

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE. Keep it short: the runtime goal surfaces cap what they hold.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** The 34 examples and four templates carry the signed skin through 003's applicator, sketchy is honestly descoped, the 39 captures are re-shot, and a question-keyed catalog reads clean in both directions — so 005's checker inherits a corpus that already passes.

### Decisions

Frozen choices. Changing one is an amendment. Each row refines a named parent decision
(`../goal.md`); none contradicts one.

| ID | Decision |
|----|----------|
| D1 | The repaint paints each file at the ground its own ink treatment already implies — light for the 32 cool-rgba examples, terminal for `example-loop-terminal.html` — and skips `example-sequence-oauth-dark.html` by name, honoring its untokenized fixed skin rather than forcing a ground onto it (F2.6). |
| D3 | The repaint runs through copies only: 003's `apply-diagram-tokens.cjs`, extended to cover the 34 examples (its own Known Limitation #1), writes to `--out`, and a file is promoted into `assets/examples/` only after its diff is read by hand — never edited in place (F2.6). |
| D4 | This phase starts strictly after 003's byte-diff gate passes and ends strictly before 005's checker ships; the phase's own gate is a dress run of that checker against the repainted corpus, so 005 inherits a corpus already green rather than debugging its own suite against a red one. |
| D9 | Sketchy stays unproven and is descoped in the catalog with a stated reason instead of a manufactured proof file (F4.1). `#3d4460`'s single-type role (`type-high-level.md`) and `#ffffff`'s 40-occurrence, 13-file backend/API/step role both survive the repaint as distinct, named roles — neither is folded into a chrome or paper substitute (F2.1). |
| D12 | The catalog's sentinel pair and header-name matching mirror `sk-design-chart/references/catalog.md`'s own contract without touching a single chart-skill file (`git diff` over `sk-design-chart/` stays empty for this phase). The router-pseudocode extraction and the feature-catalog/manual-testing-playbook reconciliation both land inside the diagram skill only. |

**Parent:** `../goal.md`

The parent's decisions outrank anything in this file; a conflict between the two is named here
rather than resolved silently.

D2 (Google Fonts allowlist) and D5-D8 (4px rule, markers, node/coral counting, accent departure)
are 002's signed decisions this phase inherits without re-opening; nothing here touches them. D11
(executor split) is honored by every task in `tasks.md` carrying a real `— executor:` suffix.

### Operator copy

The operator holds this directive as the session objective. Whenever anything above the log changes, resend this file in chat.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `grep -ohE "#[0-9a-fA-F]{6}" .opencode/skills/sk-design/sk-design-diagram/assets/examples/*.html | wc -l` reports `1577` — the repaint reproduces the census (F2.1, F2.6)
- [ ] `grep -cE "^\| [A-Za-z]" .opencode/skills/sk-design/sk-design-diagram/references/catalog.md` reports `27` — one row per canonical type, the examples-references lattice the catalog's own header-name parser checks in both directions (F4.1, F4.4)
- [ ] `ls .opencode/skills/sk-design/sk-design-diagram/screenshots/examples/*.png .opencode/skills/sk-design/sk-design-diagram/screenshots/templates/*.png .opencode/skills/sk-design/sk-design-diagram/screenshots/icons.png | wc -l` reports `39` — every capture re-shot against its current source (F4.2)
- [ ] `grep -c "DIAGRAM_CATALOG:BEGIN" .opencode/skills/sk-design/sk-design-diagram/references/catalog.md` reports `1` — the sentinel-wrapped catalog exists (F4.4)
- [ ] `grep -c "Smart Router Pseudocode" .opencode/skills/sk-design/sk-design-diagram/SKILL.md` reports `0` and `test -f .opencode/skills/sk-design/sk-design-diagram/references/foundations/router-pseudocode.md` — the 12.6% block relocated, a pointer left behind (F4.5)
- [ ] `node .opencode/skills/sk-design/sk-design-diagram/scripts/check-diagram-corpus.cjs` prints `RESULT: PASSED` — the phase gate: a dress run of 005's checker against the repainted corpus
- [ ] `bash .opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-design/019-sk-design-diagram-upgrade/004-corpus-and-catalog --strict` reports `RESULT: PASSED` (run by the orchestrator, not this authoring pass)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phase docs authored (spec, plan, tasks, acceptance-criteria, implementation-summary, goal) | Pending | Drafted in this pass; `validate.sh --strict` and operator review still pending |
| Fact-base numbers re-verified on disk before authoring | Done | `grep -c` over the live corpus confirmed 1,577 literals / 25 values, 39 captures, 27 type files + README, 0 literal "Ceiling" occurrences, 7/27 "Above N" ceilings, 5 version loci, 0/34 `prefers-color-scheme`, 32/34 cool rgba |
| T001-onward mechanical execution | Pending | Drafted in `tasks.md`; GLM execution against the named diagram-skill files pending |

### Deviations and findings

| Item | Note |
|------|------|
| 003's applicator does not yet cover the 34 examples | 003's own `implementation-summary.md` Known Limitation #1 states this explicitly and leaves the extension to this phase; `tasks.md` T002 adds the coverage before the repaint runs, rather than treating it as already done. |
| The feature-catalog/manual-testing-playbook question | Settled in `spec.md` §Open Questions and `tasks.md`: they are independent `sk-doc` artifact types (feature catalog, testing playbook), not the extraction target for either F4.4's catalog move or F4.5's pseudocode move; this phase's task diffs them against the post-repaint skill state for drift rather than folding SKILL.md content into them. |
| F4.3 (the five version loci) is not this node's finding | `002-skin-contract/tasks.md` T010 already owns the mechanical collapse; this phase's `spec.md` Files to Change table lists the five loci for traceability only, marked unchanged here. |
<!-- /ANCHOR:log -->
