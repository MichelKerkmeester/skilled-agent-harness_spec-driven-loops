---
title: "Goal: resolve the manual review's nine systemic patterns in one direction each"
description: "The durable directive this phase executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "doctrine reconciliation"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/019-sk-design-diagram-upgrade/008-doctrine-reconciliation"
    last_updated_at: "2026-09-11T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the phase 8 planning documents"
    next_safe_action: "Execute T001"
    blockers: []
    key_files:
      - "specs/sk-design/019-sk-design-diagram-upgrade/008-doctrine-reconciliation/spec.md"
      - "specs/sk-design/019-sk-design-diagram-upgrade/008-doctrine-reconciliation/plan.md"
      - "specs/sk-design/019-sk-design-diagram-upgrade/006-capture-and-judgment/scratch/evidence/manual-review-opus.md"
      - "specs/sk-design/019-sk-design-diagram-upgrade/007-manual-review-remediation/goal.md"
      - ".opencode/skills/sk-design/sk-design-diagram/references/foundations/style-guide.md"
      - ".opencode/skills/sk-design/sk-design-diagram/references/foundations/derivation-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-008-doctrine-reconciliation"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: resolve the manual review's nine systemic patterns in one direction each

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE. Keep it short: the runtime goal surfaces cap what they hold.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Every systemic pattern S1-S9 the manual review found is resolved in the direction the review already named, the losing document or files are edited to match, and the two patterns narrow enough to hold with a check (S3's dash-array fidelity, S8's short-connector mask rule) graduate into named, mutation-proven checker families.

### Decisions

Frozen choices. Changing one is an amendment. Each row refines the parent goal's D16
(`../goal.md`); none contradicts it.

| ID | Decision |
|----|----------|
| D16.1 | S1's series-palette scope widens to "multi-series charts plus typed-chip vocabularies" rather than converting the four typed-chip files to muted-ink variants — the doc was stale, not the corpus. |
| D16.2 | S2's `soft`-as-text instances repoint to `muted`; `soft` stays structural at 3.48:1 and its recorded departure text does not change — the corpus already chose this direction at 002/003. |
| D16.3 | S3's legend-fidelity fix is scoped to the legend swatches named in the review; the corpus-wide node-type-treatment values those swatches otherwise represent (`style-guide.md` §4) are not touched, keeping the fix's blast radius to the legend alone. |
| D16.4 | S6's dot-pattern default flips to match the corpus's own 26-of-34 majority; the eight opt-out files are named rather than the guide staying silent about the exception. |
| D16.5 | S7's `rule-solid` value corrects both prose documents to what `template-full.html` and `diagram-palette.json` already hold; the template is the source of truth, per the JSON's own stated note. |
| D16.6 | S8's checker family covers exactly the ~60px short-connector-and-mask case; it does not attempt the fuller 2D connector-geometry pass the checker's own judged-boundary comment still reserves for pairwise overlap, the attach fan, and a route behind a box. |
| D16.7 | S9's starter-token wiring routes through a CSS class each template owns, never through a `var()` written directly into a presentation attribute — matching `example-dp-integration.html`'s own convention, named in the review as the model to follow. |

**Parent:** `../goal.md`

The parent's decisions outrank anything in this file; a conflict between the two is named here
rather than resolved silently.

D1-D15 and D17 are inherited without re-opening: D1/D8/D9 (skin scope, accent departure,
type-scoped chevron) are 002's signed shape this node only reads; D12 (nothing changes in
`sk-design-chart`) binds every task in `tasks.md`, none of which touches that skill; D15
(executor split) is honored by every implementation task carrying a real `— executor:` suffix.

### Operator copy

The operator holds this directive as the session objective. Whenever anything above the log changes, resend this file in chat.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node .opencode/skills/sk-design/sk-design-diagram/scripts/check-diagram-corpus.cjs` prints `RESULT: PASSED` with twelve families registered (the ten from 005 plus `legend-fidelity` and `short-connector-labels`)
- [ ] `node --test .opencode/skills/sk-design/sk-design-diagram/scripts/tests/` exits `0`, and its completeness-triple case reports both new families covered
- [ ] `node .opencode/skills/sk-design/sk-design-diagram/scripts/apply-diagram-tokens.cjs --default --out <tmp>` and `--default --examples --out <tmp>` reproduce the corpus byte for byte
- [ ] A corpus-wide grep for the nine corrected claims (series-palette scope, `soft`-as-text, dash-array pairs, legend typography, legend rule bounding box, dot-pattern default, `rule-solid`, the `#f7591f` citation, starter token wiring) finds no reference document stating a value the corpus does not hold
- [ ] `bash .opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-design/019-sk-design-diagram-upgrade/008-doctrine-reconciliation --strict` reports `RESULT: PASSED` (run by the orchestrator, not this authoring pass)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phase docs authored (spec, plan, tasks, acceptance-criteria, goal) | Pending | Drafted in this pass; `validate.sh --strict` and operator review still pending |
| Fact-base numbers re-verified on disk before authoring | Done | Confirmed live: ten S2 files' exact `<text fill="#7a8399">` line numbers, `diagram-palette.json`'s already-correct `rule-solid` entry, template-full.html's zero in-svg `var(--color-*)` occurrences (all ten roles' references sit in HTML chrome above `<svg`), and the four typed-chip files' series hex usage |
| 007's dependency fixes (F4, F6, F14, F17, F22, F26, F31, F32) | Pending | Not yet confirmed on disk; T002 checks this at execution time, since 007 and 008 were authored in the same pass |
| T001-onward mechanical execution | Pending | Drafted in `tasks.md`; DeepSeek execution pending 007's fixes landing first |

### Deviations and findings

| Item | Note |
|------|------|
| S3 and S8 both build on 007-owned findings | S3 references `example-swimlane.html`'s dash mismatch (F14) and S8 references F4/F6/F14 directly; both are cited as dependencies rather than re-fixed, since the review's own grouping places them in 007's per-file lanes |
| The legend-fill separation in S3 stays legend-only | `style-guide.md` §4's node-type-treatment table (`external`/`store`/`input`) already documents the low alphas the legend swatches key; widening those corpus-wide values was rejected as out of scope, since the review's complaint is about the legend's own legibility, not the node-type tokens themselves |
| S9's true scope required re-reading `var()` placement, not just counting occurrences | An initial file-wide grep for `var(--color-*)` in `template-full.html` showed several roles already "used," but every occurrence sits in the HTML page-chrome CSS above the `<svg>` tag — zero inside the drawing itself, exactly matching the review's "ten declared roles, zero referenced in the drawing" claim once the region is scoped correctly |
| `template-terminal.html`'s `page`/`bar`/`border` roles left out of S9's in-drawing requirement | These are window-chrome concepts by their own stated purpose and are absent from the `<svg>` in the review's own "correct throughout" reference example (`example-loop-terminal.html`); requiring them inside the drawing would flag a file the review called clean |
<!-- /ANCHOR:log -->
