---
title: "Goal: bring sk-design-diagram to the chart standard"
description: "The binding goal for the whole packet. Every child goal.md inherits these rules; where a child disagrees with this file, this file wins."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "diagram upgrade goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/019-sk-design-diagram-upgrade"
    last_updated_at: "2026-09-10T20:00:00Z"
    last_updated_by: "claude-conductor"
    recent_action: "A fresh Opus read all 38 forms and found 34 defects and ten systemic patterns; five phases opened to remediate, merge the corpus and add DESIGN.md theming"
    next_safe_action: "Author 007-011, then fix the two P1s first"
    blockers: []
    key_files:
      - "specs/sk-design/019-sk-design-diagram-upgrade/001-upgrade-research/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-019-sk-design-diagram-upgrade"
      parent_session_id: null
    completion_pct: 55
    open_questions: []
    answered_questions: []
---
# Goal: bring sk-design-diagram to the chart standard

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE. Keep it short: the runtime goal surfaces cap what they hold.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Every rule the diagram skill states is held by a check, its files are generated from one palette source that a Style Reference can replace, the corpus is one adjustable form library rather than templates beside examples, and what no check can see is read by an eye on a schedule.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | One skin per file; all skins in one palette source. No `prefers-color-scheme` blocks |
| D2 | The Google Fonts link stays, on a one-entry allowlist; fallback chains are documented, not added |
| D3 | Onboarding stays; an applicator is added |
| D4 | Order is forced: decisions → applicator → repaint → checker → eye |
| D5 | The 4px rule exempts font sizes and derived offsets; it binds new files and ratchets legacy ones |
| D6 | Markers: a starter defines the trio, a delivery keeps what it draws. Ids unique per file |
| D7 | Nodes carry `data-diagram-node`; budgets count tagged nodes |
| D8 | The accent stays `#eb6c36`; its 2.86:1 is a recorded departure |
| D9 | `#3d4460` is a type-scoped role; sketchy is descoped |
| D10 | Findings are reconciled into one fact base before a decision is signed |
| D11 | Phase docs are authored by Sonnet 5 xhigh markdown agents under an Opus xhigh orchestrator |
| D12 | Nothing changes in the chart skill. Comment hygiene is a hard block |
| D13 | One form library: templates and examples merge into `assets/diagrams/`. Every file is a worked diagram to copy and adjust, not a strict template; the four skin starters live there as forms |
| D14 | A Style Reference themes a delivery: a local `DESIGN.md` (generated or hand-written) is applied to a copy. The packet carries one stock reference whose provenance says it was written from this palette, not measured. Extraction stays with `sk-design-md-generator` |
| D15 | Implementation runs on DeepSeek V4.1 Flash at max thinking through cli-pi and llmgateway. Every brief is pre-planned and improved through `sk-prompt` before dispatch |
| D16 | Every review finding ends as a fix with evidence or a recorded reason. A doc-versus-corpus contradiction is resolved in one direction and the losing side is edited |
| D17 | Captures are full page. The shared renderer gains an opt-in flag rather than changing what the chart skill shoots |

### Operator copy

The operator holds this directive as the session objective. Whenever anything above the log changes, resend this file in chat.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-upgrade-research | `001-upgrade-research/goal.md` |
| 002-skin-contract | `002-skin-contract/goal.md` |
| 003-applicator-and-sentinels | `003-applicator-and-sentinels/goal.md` |
| 004-corpus-and-catalog | `004-corpus-and-catalog/goal.md` |
| 005-checker-mutations-and-ci | `005-checker-mutations-and-ci/goal.md` |
| 006-capture-and-judgment | `006-capture-and-judgment/goal.md` |
| 007-manual-review-remediation | `007-manual-review-remediation/goal.md` |
| 008-doctrine-reconciliation | `008-doctrine-reconciliation/goal.md` |
| 009-one-form-library | `009-one-form-library/goal.md` |
| 010-design-md-style-reference | `010-design-md-style-reference/goal.md` |
| 011-full-page-capture | `011-full-page-capture/goal.md` |

**Precedence.** Decisions outrank child detail; child detail outranks any summary. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

**Round one — met, and still true from the final state.**

- [x] The corpus checker prints `RESULT: PASSED`; the mutation suite passes with its completeness guard
- [x] `--default` reproduces every form byte for byte, and every literal is a role of that file's skin
- [x] Versions follow the Frontmatter Versioning Standard under a bumped anchor; CI green on a push
- [x] A dated capture-review report exists with no hand-authored markdown
- [x] `validate.sh` reports `RESULT: PASSED` for the packet, recursively

**Round two — the manual review, the merge and the Style Reference.**

- [ ] Every one of the 34 manual-review findings is fixed with evidence, or recorded with a reason a reader can check
- [ ] Each systemic pattern S1–S9 is resolved in one direction, the losing document or file is edited, and no document states a value the corpus does not hold
- [ ] `assets/diagrams/` is the only form directory; no path, document, script, test or workflow still names `assets/examples` or `assets/templates`
- [ ] `apply-design-md.cjs --default` derives the stock palette exactly, and a second reference re-themes a copy through the same gates
- [ ] Captures are full page: no committed screenshot is cut off, and CAP-001 re-runs with its findings closed
- [ ] From the final state: checker `RESULT: PASSED`, suite green, `--default` byte-identical, CI green on a push, and `validate.sh --strict --recursive` PASSED for all twelve folders
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

### Progress

| Item | State | Evidence |
|------|-------|----------|
| 001 research, two lineages | Done | 29 findings; 15 confirmed, 15 corrected, 1 fabrication caught |
| 006 executed: CAP-001 in the playbook, first dated capture-review report | Done | verdict FAIL with reasons: focal balance on dp-integration, venn, template-full; swimlane HANDOFF label overflows without web fonts; three sequence captures cropped |
| 005 executed: checker with ten families, mutation suite 14/14, CI workflow | Done; CI run 34541227429 green | four families were red on the real corpus and each red became a recorded decision |
| 004 executed: examples mode, catalog both ways, SKILL.md slimmed, 39 captures re-shot | Done except the checker dress run, which 005 opens with | census 1,577 / 25 unchanged; re-theme control repaints every accent; catalog rows resolve both ways |
| 003 executed: token source, ported gate module, one sentinel block per template, the applicator; --default reproduces the stock bytes | Done | `diff -rq` empty; negative control refused with the nearest clearing value |
| 002 executed: seven decisions signed, derivation record written, one-locus fixes landed | Done | `derivation-record.md`; `diagram.md:67`; `SKILL.md` ownership and single accessibility locus; versions re-derived by the standard's tool |
| 002–006 authored | Done | five child goals, each refining parent decisions by id; 29 of 29 findings placed; parent validates recursively |
| 002 skin-contract | Authored | validate PASSED (0 errors, 0 warnings), 13 tasks, 16 findings |
| 003 applicator-and-sentinels | Authored | validate PASSED (0 errors, 0 warnings), 10 tasks, 3 findings |
| 004 corpus-and-catalog | Authored | validate PASSED (0 errors, 0 warnings), 19 tasks, 6 findings |
| 005 checker-mutations-and-ci | Authored | validate PASSED (0 errors, 0 warnings), 24 tasks, 13 findings |
| 006 capture-and-judgment | Authored | validate PASSED (0 errors, 0 warnings), 17 tasks, 3 findings; two agents wrote it concurrently and reconciled |

### Deviations and findings

| Item | Note |
|------|------|
| Open findings from the first capture review | focal balance on dp-integration, venn and template-full; swimlane HANDOFF mask overflows under a substituted font; the renderer crops tall diagrams at 900px. These are repairs to the corpus and the shared renderer, recorded in the dated report rather than fixed in this packet\'s closing hour |
| D5 refined: the grid binds new files and ratchets legacy ones | the corpus was never on the grid; 302 values across 24 files are recorded in `grid-baseline.json` and may only fall |
| D6 refined: templates define the trio, deliveries keep what they draw | the rule as signed would have failed every skeleton for doing its job |
| Criterion 4 amended: literals stay, and every one must be a role | 1,374 of the examples' hex values sit in SVG presentation attributes, which cannot hold a CSS variable. The criterion now asks that every literal resolve to a role of its file's skin and that the applicator re-theme it, which is what makes the corpus generated from one source without rewriting 34 hand-drawn files |
| Criterion 5 amended: version fields are per document by standard | Both research lineages read the five differing `version:` fields as drift. `sk-create-frontmatter/references/frontmatter-versioning.md` makes them the rule: every in-scope doc carries its own, `SKILL.md` anchors, children inherit major.minor. The criterion now asks for conformance to that standard, not one field |
| The reconciliation pass is not a phase | Folded into 002's first tasks rather than renumbering five children |
| The conductor misread the orchestrator as dead after node 005 | Its process hid its argv from `ps`, so the conductor's liveness checks missed it and dispatched a second agent for 006 while the orchestrator's own was writing it; the two reconciled, the orchestrator finished, and its report printed in full: five nodes PASSED, 29 of 29 placed, 7 dispatches |
<!-- /ANCHOR:log -->
