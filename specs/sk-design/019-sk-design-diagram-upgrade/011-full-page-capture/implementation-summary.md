---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/019-sk-design-diagram-upgrade/011-full-page-capture"
    last_updated_at: "2026-09-11T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Closed out phase 11: 15/16 tasks, 8/10 AC Met"
    next_safe_action: "Write the S10 playbook note (T012), then re-validate"
    blockers:
      - "AC-008/REQ-008 unmet: no note citing S10 exists in the playbook"
    key_files:
      - "specs/sk-design/019-sk-design-diagram-upgrade/011-full-page-capture/tasks.md"
      - "specs/sk-design/019-sk-design-diagram-upgrade/011-full-page-capture/acceptance-criteria.md"
      - ".opencode/skills/sk-design/shared/scripts/render-screenshots.cjs"
      - ".opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-09-11--manual-testing-playbook--capture-review-2/skill-benchmark-report.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-011-full-page-capture"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-full-page-capture |
| **Completed** | 2026-09-11 (not fully — see Known Limitations) |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Headless Chrome has no full-page screenshot flag, so the shared renderer took a fixed 1280x900
window and cropped everything below it without a word. Eleven of the corpus's 38 forms are taller
than that, and the crop is what hid a real P1 legend defect from the first manual review — the exact
failure a capture review exists to catch, defeated by the pictures it read. This phase ends the crop:
every form now captures at its own height, and a second capture review confirms it.

### Phase 11: full-page-capture

`render-screenshots.cjs` gained an opt-in `--full-page` flag. Before the real capture, a throwaway
copy of the source file is rendered with an injected probe that writes its own document height into
a `<meta>` tag, read back through `--dump-dom`; the original, pristine file is then captured at that
measured height, never the modified copy. Measurement retries once on a lost spawn the same way
capture already did — an addition beyond the written plan, raised during implementation because a
failed spawn is not proof a page cannot be measured, and without the retry one unlucky spawn would
silently downgrade a tall page back to a cropped one.

The flag is opt-in and the code path that reaches `measureContentHeight` sits behind
`if (fullPage)`, so a bug in the new measurement logic cannot move `sk-design-chart`'s bytes even in
principle — a claim proved rather than asserted, by instrumenting every Chrome spawn during
implementation: an unflagged run produced the same 39 processes with no measurement among them,
against 78 when flagged. All 38 diagram forms were re-shot; eleven exceed the old 900px ceiling
(not the six the plan predicted, because the corpus had grown between spec-authoring and execution),
and none lands on exactly 900px any more.

The reshoot fed a second CAP-001 capture review. It returned `FAIL`, and correctly: three swimlane
arrow-label masks sat on their own connectors instead of the required 6px clearance, and a fourth was
overpainted by a box until only a sliver of its glyphs rendered. Those are now fixed. Of the first
review's five findings, the renderer crop is closed for real and the swimlane HANDOFF mask overflow
is closed as never having been real — the earlier method counted ink anywhere inside a margin, and a
single-pixel antialias shift on an adjacent stroke read as a spill. The three remaining focal-balance
findings (dp-integration, venn, starter-full) were closed in the same pass.

### Files Changed

This phase's work is already shipped in three commits; nothing under `.opencode/` was touched by this
closeout pass.

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/shared/scripts/render-screenshots.cjs` | Modified (`08ae181702`) | Added `--full-page`, `measureContentHeight`/`measureOnce` with retry, and threaded the measured height into `capture`/`captureOnce` |
| `.opencode/skills/sk-design/sk-design-diagram/screenshots/diagrams/*.png` (38 files) | Modified (`08ae181702`, re-shot again in `76ad403c52`) | Every form re-captured at its own content height; no crop |
| `.opencode/skills/sk-design/sk-design-diagram/assets/diagrams/swimlane.html` | Modified (`76ad403c52`) | HANDOFF and REVISE arrow labels moved clear of their connectors; DEPLOY TRIGGER's label removed rather than relocated |
| `.opencode/skills/sk-design/sk-design-diagram/assets/diagrams/dp-integration.html`, `venn.html`, `starter-full.html` | Modified (`76ad403c52`) | The three focal-balance findings the second CAP-001 run still found open, closed |
| `.opencode/skills/sk-design/sk-design-diagram/SKILL.md`, `README.md`, `changelog/v1.1.0.0.md` | Modified (`76ad403c52`) | Skill released at 1.2.0.0 |
| `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-09-11--manual-testing-playbook--capture-review-2/*` | Created (`6012ec5c7d`) | The second, dated CAP-001 report, runner-generated |
| `.opencode/skills/sk-design/sk-design-diagram/manual-testing-playbook/capture-review/capture-review.md` | Not modified | REQ-008's S10 note was never added — see Known Limitations |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implementation shipped across three commits (`08ae181702`, `76ad403c52`, `6012ec5c7d`), in that
chronological order: the flag and reshoot landed first, then a CAP-001 rerun against the full-page
captures found the swimlane label defects and the still-open focal-balance findings, then the fix
landed, then the report documenting that rerun's findings was committed — so the report on disk
narrates a FAIL state the fix commit had, by the time it was written down, already closed for three
of its four content findings.

This closeout pass (Claude Opus 5, agent `@markdown`) re-derived the load-bearing proofs rather than
trusting the commit messages: re-ran `sk-design-chart`'s exact unflagged capture command into a
scratch directory and diffed it against the committed screenshots (empty); re-ran a fresh
`--full-page` render of the entire diagram corpus plus the relocated `style-reference/harness-diagram`
bundle into a scratch directory and diffed both trees against what is committed (empty, both ways);
measured every regenerated PNG's pixel height directly with `sips`; read the second CAP-001 report's
JSON, Markdown and CSV outputs end to end; and opened three of the regenerated screenshots
(`starter-full.png`, `bar.png`, `swimlane.png`) to visually confirm no crop and the swimlane fix.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Measure on a temp copy, capture the pristine original | The probe script has to modify the DOM to report its height back; capturing that modified copy would risk the injected `<meta>` tag or its timing perturbing the very layout being measured. Keeping capture on the untouched original removes that risk entirely rather than arguing it away |
| Retry measurement the same way capture already retries (amendment) | Not written into REQ-002 or T005. Raised during implementation: a lost Chrome spawn under load is not evidence a page cannot be measured, and without the retry one unlucky spawn would silently fall back to the fixed 900px height — reintroducing a smaller version of the exact bug this phase exists to close. Accepted rather than absorbed silently |
| Remove DEPLOY TRIGGER's label rather than relocate it | Colour and the legend already said what the label said (a critical handoff, carried by the orange connector). The label was the element doing the colliding with the Approve merge box; deleting it left the diagram correct without inventing a new position that a future edit could re-collide |
| Close three of the second report's own carried-forward findings inside this phase | `spec.md`'s Out of Scope assigned dp-integration/venn/starter-full's focal-balance fixes to 007. The CAP-001 rerun this phase ran found them still open and one new defect of its own; `76ad403c52` closed all of it rather than leaving a phase-011 report point at open work another phase might not pick up soon. A real deviation from the written scope boundary — named here rather than left silent |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node scripts/check-diagram-corpus.cjs` | PASS — 38 files, 12 families, 0 errors, `RESULT: PASSED` (re-run this closeout session) |
| `node --test scripts/tests/` | PASS — 16/16 (re-run this closeout session) |
| `sk-design-chart` byte-identity (REQ-003) | PASS — fresh unflagged render into scratch, `diff -rq` against committed `sk-design-chart/screenshots/` empty (re-run this closeout session; also proved at implementation time by instrumenting every browser spawn: 39 unflagged, 0 measurement calls) |
| Full corpus reproducibility (REQ-005) | PASS — fresh `--full-page` render of `assets/` into scratch, `diff -rq` against committed `screenshots/diagrams/` and `screenshots/style-reference/` both empty — every committed PNG's height is exactly what today's measurement pipeline derives |
| Crop signature check | PASS — 0/38 PNGs at exactly 900px; 11/38 exceed 900px (import-drawio 929, import-mermaid 921, loop 964, loop-terminal 1039, org-chart 940, quadrant-consultant 1342, sequence-oauth 1004, sequence-oauth-dark 1004, sequence-oauth-full 1399, starter-full 1561, starter-terminal 979) |
| `screenshots/examples/`, `screenshots/templates/` absence | PASS — both confirmed absent, though removed by phase 009's merge (`9f03950aba`), ahead of this phase's own commits |
| Second CAP-001 report read in full | PASS — `benchmark/reports/2026-09-11--manual-testing-playbook--capture-review-2/`; `scenarioId: "CAP-001"`, verdict `FAIL`, reason names all five prior findings; the one `SKIP` (playwright import) carries a non-empty reason with the install command |
| Visual spot-check (T016) | PASS — `starter-full.png` (1561px) shows header, diagram, legend and all three info cards with an intact footer; `bar.png` (813px) reads cleanly with no wasted space; `swimlane.png` confirms `76ad403c52`'s label fix |
| `acceptance-criteria.md` | 8/10 rows `Met` (AC-001–AC-007, AC-009); AC-008 and AC-010 `Unmet` |
| `tasks.md` | 15/16 tasks `[x]`; T012 undone |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **REQ-008's playbook note was never written.** Neither `manual-testing-playbook.md` nor
   `capture-review/capture-review.md` carries a note citing S10 (the shipped renderer truncates tall
   pages). None of the phase's three commits touch either file — confirmed by
   `grep -rln "S10\|full-page" manual-testing-playbook/`, which finds nothing. A future reviewer of
   `CAP-001` has no written pointer to why full-page images matter; the fix is a short addition and
   sits outside this closeout's write authority.
2. **No third CAP-001 run confirms the swimlane fix.** `76ad403c52` fixed the three label-clearance
   defects and the DEPLOY TRIGGER overpaint the second report's own run found, and a visual
   spot-check this session confirms the fix is on disk, but the corrected render has not itself been
   through the judged six-reads process. `benchmark/reports/` still holds only the pre-fix `-2`
   report. This closes a loop 007's own closeout flagged as a known limitation it could not fix
   (`DEPLOY TRIGGER` clipping `Approve merge`) — CAP-001's own rerun caught it independently, and this
   phase fixed it, but the fix is unverified by the scenario that found it.
3. **`executionContext.supersedes` in the second report is empty.** T013's own text called for it to
   name `2026-09-11--manual-testing-playbook--capture-review`; the field exists in the JSON but reads
   `[]`. AC-006/AC-007 still read `Met` because their Given/When/Then does not require that specific
   field and the report's prose names and addresses all five prior findings by content, but the
   machine-readable supersession link is missing.
4. **The README's `--full-page` snippet update landed via a different phase's commit.** `T011`/`REQ-009`
   are satisfied on disk (`sk-design-diagram/README.md:163`), but the line was added in `9a4b60e0ed4`
   (phase 010's "one bundle" work), not by this phase's own `08ae181702`/`76ad403c52`/`6012ec5c7d`.
5. **The measurement-failure fallback path was not exercised with evidence.** `measureOnce` falls
   back to the fixed height on any `catch`, and the code was read to confirm this, but no run this
   phase left a record of actually triggered it — every corpus file measures cleanly today, so the
   fallback branch has no recorded trigger case (CHK-022/CHK-023).
<!-- /ANCHOR:limitations -->

---
