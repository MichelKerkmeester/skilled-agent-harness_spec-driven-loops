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
    recent_action: "Authored the durable directive for the composed form and the closeout"
    next_safe_action: "Put the catalog decision to the operator"
    blockers:
      - "The catalog decision in spec section 10 is unanswered"
    key_files:
      - ".opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs"
      - ".opencode/skills/sk-doc/sk-create-chart/references/catalog.md"
      - "specs/sk-doc/051-sk-create-chart/008-evilcharts-reference-research/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-053-007-composed-form-and-closeout"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Whether the catalog gains a bar and line form with a second scale"
      - "Which family the new row belongs to"
      - "Whether any form is dense enough to need a range window"
    answered_questions:
      - "The second scale appears only when the two magnitudes differ by an order"
      - "An assertion nobody watched fail is not trusted"
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

- [ ] The operator's answer on the catalog addition is recorded in the progress table below
- [ ] `node .opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs` reports `chart forms under assets/templates: 21` with `catalog` at 0 failures
- [ ] Every invariant phases 004 through 006 introduced has a named check in that same output, and each of the eight was watched failing on a mutated fixture before it passed
- [ ] `grep -rn '^version:' .opencode/skills/sk-doc/sk-create-chart/` returns one distinct version string, and `.opencode/skills/sk-doc/sk-create-chart/changelog/v1.2.0.0.md` exists
- [ ] A verdict on the headline-as-argument rule is recorded for each of the six family deliveries, quoting the headline it judged
- [ ] `node .opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs --render` prints `RESULT: PASSED`
- [ ] `NODE_PRESERVE_SYMLINKS=1 bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/sk-doc/053-chart-visual-overhaul/007-composed-form-and-closeout --strict` prints `RESULT: PASSED` with Errors 0
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
| The catalog decision | Pending | Named in spec section 10. The adjudication settled the implementer split in favour of building it late, and still lists the catalog addition among the operator's four calls |
| The eight new assertions | Pending | |
| The composed form | Pending | |
| The scenario audit | Pending | |
| The range window disposition | Pending | The catalog gives `daily-line` a ceiling of thirty readings and the window's threshold is past thirty, so no shipped form clears it on today's shapes |
| Version bump and changelog | Pending | Current version is 1.1.0.0 in `SKILL.md`, and `references/README.md` already carries 1.0.0.0, which the bump also corrects |

### Deviations and findings

| Item | Note |
|------|------|
| The range window has no consumer | The adjudication allows it where a form is genuinely dense. The catalog's own shape for `daily-line` is thirty readings or fewer, and the threshold is past thirty. Nothing in the corpus qualifies unless a documented shape is raised first, which is a finding rather than an omission |
| The scenario naming may already be done | All six family deliveries carry scenario filenames and headlines that state a conclusion. The recommendation may already be satisfied, so this phase audits and reports rather than rewriting |
| The reference index carries a stale version | `references/README.md` reads 1.0.0.0 while the rest of the packet reads 1.1.0.0. The bump corrects the drift as a side effect, and the inventory is what makes it visible |
| The parent's aggregate file table omits this phase for the deliveries | The parent `spec.md` lists `assets/examples/*.html` as changed in phases 002 and 005. The scenario audit reads all six and may edit them, so the row needs one edit when the orchestrator reconciles the parent |
| Two operator decisions point the same way and are still separate | The adjudication settled the build-versus-record split in favour of building, and separately lists the catalog addition as an operator call. The implementer question is closed and the product question is not, which is why D1 exists |
<!-- /ANCHOR:log -->
