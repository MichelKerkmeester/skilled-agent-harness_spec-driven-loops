---
title: "Goal: Phase 9: one-form-library"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/019-sk-design-diagram-upgrade/009-one-form-library"
    last_updated_at: "2026-09-11T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the phase 9 planning documents from a live rg inventory"
    next_safe_action: "Execute T001"
    blockers: []
    key_files:
      - "specs/sk-design/019-sk-design-diagram-upgrade/009-one-form-library/spec.md"
      - "specs/sk-design/019-sk-design-diagram-upgrade/009-one-form-library/plan.md"
      - ".opencode/skills/sk-design/sk-design-diagram/scripts/apply-diagram-tokens.cjs"
      - ".opencode/skills/sk-design/sk-design-diagram/scripts/check-diagram-corpus.cjs"
      - ".opencode/skills/sk-design/sk-design-chart/scripts/apply-design-md.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-009-one-form-library"
      parent_session_id: null
    completion_pct: 15
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 9: one-form-library

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short:
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** `assets/templates/` and `assets/examples/` merge into one `assets/diagrams/`, the four skin skeletons and 34 forms take names that say what they draw rather than which bin they were filed in, and every script, config file and document that named the old split points at the new one.

### Decisions

Frozen choices. Changing one is an amendment. Each row refines a named parent decision
(`../goal.md`); none contradicts one.

| ID | Decision |
|----|----------|
| D13 | `assets/templates/` and `assets/examples/` merge into `assets/diagrams/`. Prefixes drop: `example-architecture.html` becomes `architecture.html`; the four skin skeletons become `starter-light.html`, `starter-dark.html`, `starter-terminal.html`, `starter-full.html`. Every move is `git mv`, so history follows the file. |
| D12 | Nothing changes in `sk-design-chart/`. The applicator's `--forms`/`--all` pair is read from `apply-design-md.cjs`'s shape, never imported or edited; `git diff` over `sk-design-chart/` stays empty for this phase. |

**Parent:** `../goal.md`

The parent's decisions outrank anything in this file; a conflict between the two is named here
rather than resolved silently.

D11 (Sonnet 5 xhigh markdown authorship) and D15 (DeepSeek V4.1 Flash execution through cli-pi, one
document per dispatch, the moves themselves run by the conductor) are inherited without re-opening:
D11 governs this authoring pass; D15 governs the execution this phase's tasks hand off to. D16
(every finding ends as a fix or a recorded reason) does not bind this phase directly - this phase
fixes no manual-review finding; that is 007's job. This phase touches one field F26 names
(`diagram-palette.json`'s `examples.untokenized` entry) only to repoint its path, not to resolve
the finding itself.

### Operator copy

The operator holds this directive as the session objective, and that copy is
what judges completion, not this file. Whenever anything above the log changes
(objective, a decision, the binding table, a criterion), resend the full text
of this file in chat so the operator can update their copy. A child goal change
that alters a parent decision or criterion is an amendment to the parent: apply
it there first, then resend the parent.
<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [ ] `assets/diagrams/` holds exactly 38 `.html` files and one `README.md`; `assets/templates/` and `assets/examples/` no longer exist
- [ ] `node .opencode/skills/sk-design/sk-design-diagram/scripts/check-diagram-corpus.cjs` prints `RESULT: PASSED` with the same per-family finding counts as the pre-move baseline
- [ ] `node scripts/apply-diagram-tokens.cjs --default --all --out <tmp>` reproduces `assets/diagrams/` byte for byte except the recorded untokenized exception
- [ ] `node --test .opencode/skills/sk-design/sk-design-diagram/scripts/tests/` exits 0
- [ ] `rg -n "assets/(examples|templates)" .opencode/skills/sk-design/sk-design-diagram .github/workflows` returns nothing outside a changelog entry describing the move
- [ ] `screenshots/diagrams/` holds 38 PNGs; `screenshots/examples/` and `screenshots/templates/` no longer exist
- [ ] `bash .opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-design/019-sk-design-diagram-upgrade/009-one-form-library --strict` reports `RESULT: PASSED` (run by the orchestrator, not this authoring pass)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phase docs authored (spec, plan, tasks, acceptance-criteria, goal) | Pending | Drafted in this pass from a live `rg` inventory; `validate.sh --strict` and execution still pending |
| Full inventory built directly from disk, not memory | Done | `rg -n "assets/(examples\|templates)"` over the skill tree: 204 matches, 49 files; over `.github/workflows`: 2 matches, 1 file; full breakdown in `plan.md`'s Required Inventories |
| Two path-building scripts found by reading, not by the literal grep | Done | `apply-diagram-tokens.cjs:15-16` and `check-diagram-corpus.cjs:31-32` build `TEMPLATE_DIR`/`EXAMPLE_DIR` from split `path.join` arguments, invisible to a literal `assets/templates` substring match |
| `catalog-bidirectional.cjs`'s reverse-direction exposure found by reading the family in full | Done | Its file-listing loop would flag all four starters once they share a directory with the indexed forms, unless excluded (REQ-005) |
| 34-form rename collision check | Done | Every de-prefixed name checked against the other 33 and against the four starter names; zero collisions |
| Shared renderer confirmed to need no change | Done | `render-screenshots.cjs` mirrors whatever directory structure exists under its given assets root; it does not hard-code `templates`/`examples` |

### Deviations and findings

| Item | Note |
|------|------|
| `references/types/type-sequence.md` names two files that do not exist (`example-sequence-dark.html`, `example-sequence-full.html`) | A pre-existing content-accuracy defect, unrelated to the path merge; left unfixed, out of this phase's scope lock, and named in `spec.md`'s Out of Scope |
| `node-budget.cjs`'s `kind === 'specimen'` guard is unreachable today | `check-diagram-corpus.cjs` never assigns `kind = 'specimen'`; the guard exists for `assets/icons.html`, which this phase does not touch. D13 says it stays as it is, so it is left exactly as found rather than "fixed" |
| The scaffold's title and headers read "Phase 3" throughout, contradicting its own Metadata table's "Phase 9 of 11" | Corrected to "Phase 9" in spec.md, plan.md, tasks.md, acceptance-criteria.md, and this file's title/headers; `implementation-summary.md` was left untouched per this phase's authoring brief, which reserves that file for execution |
<!-- /ANCHOR:log -->
