---
title: "Goal: The Composed Form and the Closeout"
description: "The durable directive this phase executes against, and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "composed form goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/053-chart-visual-overhaul/007-composed-form-and-closeout"
    last_updated_at: "2026-09-03T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Shipped the composed form, the eight assertions and the packet closeout"
    next_safe_action: "Reconcile the parent packet, which this phase does not own"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs"
      - ".opencode/skills/sk-doc/sk-create-chart/references/catalog.md"
      - "specs/sk-doc/051-sk-create-chart/008-evilcharts-reference-research/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-053-007-composed-form-and-closeout"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The second scale appears only when the two magnitudes differ by an order"
      - "An assertion nobody watched fail is not trusted"
      - "The composed row joins relationship, on the catalog's own family prose"
      - "The range window is refused, and the contract clause outlives the density arithmetic"
      - "The packet keeps per-document versions, so one string everywhere was never the target"
---
# Goal: The Composed Form and the Closeout

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the phase. Keep it short:
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Add the one form the catalog was missing, make the corpus check enforce every rule this overhaul introduced, and close the packet with a version and a changelog.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Adding the composed form to the catalog is the operator's call. The form is not indexed until the answer is recorded |
| D1a | Answered yes on 2026-09-03. The catalog gains the composed form, taking the corpus to twenty-one |
| D2 | A second scale appears only when the two series maxima differ by an order. The condition is computed from the data block, never chosen by the author |
| D3 | No assertion is trusted until it has been watched failing on a mutated fixture, and every mutation is reverted before the phase closes |
| D4 | An assertion that fails a correct file is rewritten. The corpus is never edited to satisfy a wrong check |
| D5 | The scenario audit reports what it finds. If the six deliveries already satisfy the rule, that is the finding, and no rewrite is invented |
| D6 | The range window gets a recorded disposition either way. A silent skip is not a close |
| D7 | The version string is identical across every file that carries one, because a reader trusts the first one they find |
| D8 | Nothing is copied from the vendored source. The form is drawn by hand like every other one |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [x] The operator's answer on the catalog addition is recorded in the progress table below
- [x] `node .opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs` reports `chart forms under assets/templates: 21` with `catalog` at 0 failures
- [x] Every invariant phases 004 through 006 introduced has a named check in that same output, and each of the eight was watched failing on a mutated fixture before it passed
- [x] The version story is reconciled across the whole skill and `.opencode/skills/sk-doc/sk-create-chart/changelog/v1.2.0.0.md` exists. The original wording asked for one distinct version string, which the packet's per-document convention makes impossible without a changelog misnaming its own release. ADR-005 records the reading and the stricter replacement
- [x] A verdict on the headline-as-argument rule is recorded for each of the six family deliveries, quoting the headline it judged
- [x] `node .opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs --render` prints `RESULT: PASSED`
- [x] `NODE_PRESERVE_SYMLINKS=1 bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/sk-doc/053-chart-visual-overhaul/007-composed-form-and-closeout --strict` prints `RESULT: PASSED` with Errors 0
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
| Phase planning | Done | `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md` and this document authored 2026-09-03 |
| Recommended level | Done | `recommend-level.sh --loc 750 --files 15` returned Level 2 at 48 of 100, phases not recommended at 0 of 50 |
| Baseline corpus check | Done | 15 checks over 29 files, 20 forms, 0 failures, `RESULT: PASSED`, captured before any edit in this packet |
| The catalog decision | Done | Answered yes by the operator on 2026-09-03, recorded as D1a. The corpus goes to twenty-one |
| The eight new assertions | Done | `interaction-hygiene`, `interaction-state`, `number-format`, `empty-notice`, `geometry-block`, `catalog-system`, `type-scale` and `gradient-sweep`, all in the final run at 0 failures. Fourteen mutations watched failing and every one restored. `scratch/negative-controls.txt` |
| The composed form | Done | `assets/templates/bar-line-composed.html`, family `relationship`, system `categorical`, second scale at a spread of 510 on the shipped block. Four boundary fixtures rendered and read |
| The scenario audit | Done | Six verdicts, each quoting its headline, in the implementation summary. All six pass and nothing was changed |
| The range window disposition | Done | Refused on two grounds. No form is dense past thirty points on a continuous axis, and contract section 10 forbids a handler from moving a mark, which is what a window does. ADR-006 |
| Version bump and changelog | Done | Packet to 1.2.0.0 in `SKILL.md` and `README.md`, seven documents bumped by one step each, `changelog/v1.2.0.0.md` written. The premise that one string should appear everywhere was wrong and ADR-005 records what replaced it |
| Final gate | Done | `RESULT: PASSED` with `--render` at 28 checks, 30 files, 21 forms, 0 errors, exit 0. `scratch/final-render-rerun.txt`. The run before it died on one browser open and is kept beside it |

### Deviations and findings

| Item | Note |
|------|------|
| The range window has no consumer | The adjudication allows it where a form is genuinely dense. The catalog's own shape for `daily-line` is thirty readings or fewer, and the threshold is past thirty. Nothing in the corpus qualifies unless a documented shape is raised first, which is a finding rather than an omission |
| The scenario naming may already be done | All six family deliveries carry scenario filenames and headlines that state a conclusion. The recommendation may already be satisfied, so this phase audits and reports rather than rewriting |
| The reference index carries a stale version | `references/README.md` reads 1.0.0.0 while the rest of the packet reads 1.1.0.0. The bump corrects the drift as a side effect, and the inventory is what makes it visible |
| The parent's aggregate file table omits this phase for the deliveries | The parent `spec.md` lists `assets/examples/*.html` as changed in phases 002 and 005. The scenario audit reads all six and may edit them, so the row needs one edit when the orchestrator reconciles the parent |
| Two operator decisions point the same way and are still separate | The adjudication settled the build-versus-record split in favour of building, and separately lists the catalog addition as an operator call. The implementer question is closed and the product question was answered yes on 2026-09-03 |
| The range window has a second reason to be refused, and it is the stronger one | Density is a documented shape and a shape can be raised. Contract section 10 already forbids a handler from moving a mark, and a range window rescales an axis and moves every mark on it. That clause is what to answer if the window comes back, rather than the arithmetic |
| The version premise was wrong | The packet keeps per-document versions rather than one packet-wide string, and `references/README.md` at 1.0.0.0 was correct rather than stale. AC-010 is superseded by a stricter obligation. ADR-005 |
| Two of the eight planned assertions were already written | `palette-block` and `palette-source-dark` already enforce the two palette rows the plan listed. Two invariants from the same phases took their place, so eight were still written. ADR-003 |
| The type scale needed a structured source | `type-scale` reads the nine sizes from `assets/color/palettes.json`, which is not on this phase's file list. Restating them in the check would create the drift the scale exists to prevent, and the packet's own scripts rules forbid it. Named as a deviation in ADR-004 rather than absorbed |
| The gap notice on the new form was drawn outside its frame | Found by rendering a fixture with a missing reading, not by reading the code. The frame now grows for the notice, which is what the ceiling notices already do |
| The six deliveries carry no geometry block | `geometry-block` asserts over the twenty-one forms and the three proof sheets, which is the set phase 006 built. All six deliveries share the geometry and none records it. Widening the block to them is a six-file edit outside this phase's scope |
| The parent's aggregate file table still needs one edit | The scenario audit read all six deliveries and changed none, so the parent's row for `assets/examples/*.html` is correct as it stands. The parent phase map still needs this phase marked Complete, which is the orchestrator's edit rather than this phase's |
| The render gate flaked once on the same file it flaked on last phase | The first final run reported a `render` failure on `waterfall.html`, where the browser returned no document. Opened by hand under the same flags it drew forty-eight elements in its figure region, and the re-run passed clean. Both runs are kept |
| The ramp gate rename is now possible and still undone | Phase 006 left it blocked because the check was out of its reach. This phase edits the check, so the blocker is gone and the reason is scope instead. Both target names and all three files are in the changelog. ADR-007 |
<!-- /ANCHOR:log -->
