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
    recent_action: "Executed rounds one and two; ran three capture reviews"
    next_safe_action: "Close thirteen label masks, then run a fourth capture review"
    blockers: []
    key_files:
      - "specs/sk-design/019-sk-design-diagram-upgrade/001-upgrade-research/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-019-sk-design-diagram-upgrade"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Goal: bring sk-design-diagram to the chart standard

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Every diagram-skill rule is held by a check, files generate from one replaceable palette, the corpus is one form library, and an eye reads on a schedule what no check sees.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | One skin per file, all in one palette source; no `prefers-color-scheme` blocks |
| D2 | Google Fonts stays on a one-entry allowlist |
| D3 | Onboarding stays; an applicator is added |
| D4 | Forced order: decisions → applicator → repaint → checker → eye |
| D5 | 4px grid: font sizes and derived offsets exempt; binds new files, ratchets legacy |
| D6 | Starters define the marker trio, deliveries keep what they draw; ids unique per file |
| D7 | Nodes carry `data-diagram-node`; budgets count tagged ones |
| D8 | Accent stays `#eb6c36`; its 2.86:1 is a recorded departure |
| D9 | `#3d4460` is a type-scoped role; sketchy descoped |
| D10 | Findings reconcile into one fact base before signing |
| D11 | Sonnet agents write phase docs for an Opus orchestrator |
| D12 | The chart skill is untouched; comment hygiene is a hard block |
| D13 | Templates and examples merge into one library, `assets/diagrams/` |
| D14 | A local `DESIGN.md` themes a copy; the stock one is written from this palette; `sk-design-md-generator` extracts |
| D15 | DeepSeek V4.1 Flash via cli-pi implements; briefs go through `sk-prompt` |
| D16 | Every review finding ends fixed with evidence or a recorded reason; contradictions edit the losing side |
| D17 | Full-page captures via an opt-in renderer flag; chart captures unchanged |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001 | `001-upgrade-research/goal.md` |
| 002 | `002-skin-contract/goal.md` |
| 003 | `003-applicator-and-sentinels/goal.md` |
| 004 | `004-corpus-and-catalog/goal.md` |
| 005 | `005-checker-mutations-and-ci/goal.md` |
| 006 | `006-capture-and-judgment/goal.md` |
| 007 | `007-manual-review-remediation/goal.md` |
| 008 | `008-doctrine-reconciliation/goal.md` |
| 009 | `009-one-form-library/goal.md` |
| 010 | `010-design-md-style-reference/goal.md` |
| 011 | `011-full-page-capture/goal.md` |

**Precedence.** Decisions outrank child detail, which outranks any summary. Name a conflict; never resolve it silently.

**Stop.** Only the criteria below decide done.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] The corpus checker prints `RESULT: PASSED`; the mutation suite and its completeness guard pass
- [x] `--default` reproduces every form byte for byte; every literal is a role of its file's skin
- [x] Versions follow the Frontmatter Versioning Standard under a bumped anchor; CI green on a push
- [x] A dated capture-review report exists with no hand-authored markdown
- [x] `validate.sh` reports `RESULT: PASSED` for the packet, recursively
- [x] All 34 manual-review findings are fixed with evidence or carry a checkable reason
- [x] Each systemic pattern S1-S9 is resolved one way, losing side edited; no document states a value the corpus lacks
- [x] `assets/diagrams/` is the only form directory; nothing names `assets/examples` or `assets/templates`
- [x] `apply-design-md.cjs --default` derives the stock palette exactly; a second reference re-themes a copy through the gates
- [ ] No committed screenshot is cut off; CAP-001 re-runs with its findings closed
- [ ] From the final state: checker `RESULT: PASSED`, suite green, `--default` byte-identical, CI green, and `validate.sh --strict --recursive` PASSED for all twelve folders
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

### Round two

| Item | State | Evidence |
|------|-------|----------|
| 007 remediation, two rounds | Done | 34 findings fixed, then a fresh reader rendered every changed form and found 32 closed, two not landed and nine fixes that broke something new; all 18 closed. 42 of 42 tasks, 37 of 37 criteria |
| 008 doctrine, ten patterns | Done | S1-S9 settled; two resolved by measurement rather than a change, and the record says why. 21 of 24 tasks, 14 of 16 criteria |
| 009 one form library | Done | 38 forms in one directory, code keyed on the palette block rather than the directory. 27 of 27 tasks, 14 of 14 criteria |
| 010 DESIGN.md theming | Done | `--default` derives all 31 role values exactly and reproduces every form; a second reference re-themes and gates. 19 of 20 criteria |
| 011 full-page capture | Done | Eleven forms exceeded the old ceiling; no capture lands on 900 now, and the chart packet's images are byte-identical, proved by instrumenting every browser spawn |
| Three capture reviews | Run | The second failed on masks sitting on their connectors; the third confirmed those fixed and found a long-standing defect in a second file that judging one file had hidden |

### What the reviews overturned

| Claim | What measurement showed |
|-------|-------------------------|
| A swimlane label overflowed its mask under a substituted font | Never real. The method counted ink anywhere in a margin, so an antialias shift on a neighbouring stroke read as a spill. Per glyph there is eleven units of slack |
| Three keyed legend fills are one grey and must be stepped apart | The measurement was right and the conclusion wrong. Those node types are separated by stroke, and each swatch carries its own |
| Masks must clear a stroke by six | The prose is in rendered pixels and the drawings in user units, which scale up about a quarter. Four units is the floor, six to ten the band |
| The durable slice fit the 4,000-character budget | Not until it was cut: the old author blockquote and operator copy went, decision and criterion wording shortened, and the binding rows labelled by number; all eleven criteria kept |
<!-- /ANCHOR:log -->
