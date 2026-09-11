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
    packet_pointer: "sk-design/019-sk-design-diagram-upgrade/008-doctrine-reconciliation"
    last_updated_at: "2026-09-11T08:44:35Z"
    last_updated_by: "markdown-agent"
    recent_action: "Closeout pass verified S1-S9 against the corpus and four commits; ticked from evidence"
    next_safe_action: "Execute T005, T008, T009, T010, T012-T014, T015 to close the six Unmet AC rows"
    blockers: []
    key_files:
      - "specs/sk-design/019-sk-design-diagram-upgrade/008-doctrine-reconciliation/tasks.md"
      - "specs/sk-design/019-sk-design-diagram-upgrade/008-doctrine-reconciliation/acceptance-criteria.md"
      - ".opencode/skills/sk-design/sk-design-diagram/references/foundations/style-guide.md"
      - ".opencode/skills/sk-design/sk-design-diagram/references/foundations/derivation-record.md"
      - ".opencode/skills/sk-design/sk-design-diagram/assets/style-reference/harness-diagram/diagram-palette.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-008-doctrine-reconciliation"
      parent_session_id: null
    completion_pct: 56
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
| **Spec Folder** | 008-doctrine-reconciliation |
| **Completed** | Partial — closeout pass 2026-09-11; seven of sixteen acceptance criteria remain `Unmet` |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The manual review named nine systemic patterns (S1-S9) where a reference document and the diagram
corpus disagreed, or the corpus disagreed with itself, each with a stated direction. Nine of sixteen
acceptance criteria are `Met`: three of the nine patterns landed in full (S2, S7, and S8's checkable
half), one landed with a documented deviation stronger than the letter of its task (the PINS-table
requirement), and two new checker families — `legend-fidelity` and `short-connector-labels` — now
hold their rules mechanically instead of by eye, each proven by a mutation case. Seven criteria are
still `Unmet`: S1's property rename, S3's marker and fill-alpha sub-fixes, S4, S5, S9, half of S6
(the dot-pattern default is stated but the eight opt-out files are never named), and the 008→009
phase-gate criterion that depends on all of the above. This is a
closeout pass, not new implementation — the section below is what the live corpus and its commit
history actually show, verified directly rather than assumed from `tasks.md`.

### Phase 8: doctrine-reconciliation

**What landed.** `style-guide.md`'s series-palette section now reads "multi-series charts and
typed-chip vocabularies" and names all six real users (S1's scope half). Forty-six `<text>` elements
across twelve forms repointed from `soft` (`#7a8399`, 3.48:1) to `muted` (`#4f5d75`, 6.11:1), plus one
further instance a second pass found; `soft` stays structural-only and its recorded departure did not
change (S2). `derivation-record.md` and `style-guide.md` now agree with `diagram-palette.json` and the
starter templates on `rule-solid`'s light value, and the stray `#f7591f` accent citation is gone (S7).
`legend-fidelity.cjs` asserts a legend swatch's dash array against the file's own drawing elements;
`short-connector-labels.cjs` asserts no label mask crosses a connector under about 60px — both are
registered, both pass against the full 38-file corpus, and both refuse a mutated case (S3's checkable
half, S8). Building `short-connector-labels` surfaced a real, previously-missed instance: a 52px
transit in `dp-integration.html` whose label mask erased its own connector, fixed rather than excused.
S6's dot-pattern sentence now states the pattern is the default (26 of 34 forms carry it, eight drop
it), though the eight are cited by count, not named individually. S3's dash-array mismatch (the
checkable half's fix target) is corrected in `starter-full.html`.

**What did not land.** `dp-integration.html`'s `--custom-red`/`--custom-blue` custom properties were
never renamed to what they actually are (rust-brown, dusty-blue) — S1's second half. None of S3's two
remaining sub-fixes landed: `high-level.html`'s two markerless legend lines still carry no
`marker-end`, and the three legend-swatch fills in `starter-full.html`/`architecture.html` were never
stepped to visibly separable alphas. S4 (legend typography convergence across four files), S5 (legend
rule bounding-box correction in `er.html`/`high-level.html`), and S9 (starter-token wiring across all
four templates) never executed at all — a scoped grep of every template's `<svg>` region finds only
the pre-existing `link` role wired, none of the other declared roles. The checker's judged-boundary
comment was never narrowed to reflect S8's graduation.

**A related finding, not itself an S-item.** Confirming S8's family shipped green surfaced a chip-label
contrast gap: a typed-chip fill (the `series-2` value, in scope under S1's widened palette) measured
4.44:1 against white text, below what the text gate would require if it applied — except no gate for
"text on a coloured mark" existed yet. `diagram-palette.json` gained a `textOnMark: 4.5` gate,
`derivation-record.md` records why, and the one failing value moved to 4.56:1 against white. This
shipped in the same commit as the two new families but is not scored against any AC here, since no
REQ in `spec.md` names it.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/sk-design-diagram/references/foundations/style-guide.md` | Modified | S1 scope widened, S6 default-status stated, S7 `rule-solid` row + `#f7591f` citation corrected |
| `.opencode/skills/sk-design/sk-design-diagram/references/foundations/derivation-record.md` | Modified | S7 `rule-solid` row corrected; PINS table (§6) deleted with a documented rationale rather than recomputed; `text-on-mark` gate documented |
| `.opencode/skills/sk-design/sk-design-diagram/assets/style-reference/harness-diagram/diagram-palette.json` | Modified | `textOnMark: 4.5` gate added; `series-2` value darkened to clear it; PINS entry removed |
| `.opencode/skills/sk-design/sk-design-diagram/assets/diagrams/*.html` (12 forms) | Modified | S2's `soft`-as-text repoint to `muted`; `starter-full.html`'s legend dash-array corrected; `dp-integration.html`'s 52px short-connector mask fixed and chip value repainted |
| `.opencode/skills/sk-design/sk-design-diagram/scripts/families/legend-fidelity.cjs` | Created | S3's checkable half: a legend swatch's dash array must equal some drawing element's dash array in the same file |
| `.opencode/skills/sk-design/sk-design-diagram/scripts/families/short-connector-labels.cjs` | Created | S8's checkable half: no label mask over a connector under ~60px |
| `.opencode/skills/sk-design/sk-design-diagram/scripts/tests/mutation-cases.cjs` | Modified | One mutation case each for `legend-fidelity` and `short-connector-labels` |
| `.opencode/skills/sk-design/sk-design-diagram/scripts/check-diagram-corpus.cjs` | Not modified | T020's judged-boundary comment narrowing never executed — still cites "the visible label gap" as un-judged |
| `.opencode/skills/sk-design/sk-design-diagram/assets/diagrams/dp-integration.html` | Not modified (for S1) | `--custom-red`/`--custom-blue` properties still present; S1's rename never landed |
| `.opencode/skills/sk-design/sk-design-diagram/assets/diagrams/{import-drawio,import-mermaid,it-state,org-chart}.html` | Not modified | S4's legend-typography convergence never landed |
| `.opencode/skills/sk-design/sk-design-diagram/assets/diagrams/{er,high-level}.html` | Not modified | S5's legend rule bounding-box correction never landed |
| `.opencode/skills/sk-design/sk-design-diagram/assets/diagrams/starter-{light,dark,terminal,full}.html` | Not modified (for S9) | Starter-token wiring never landed beyond the pre-existing `link` role |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Nine of the phase's changes shipped across three commits authored against this spec
(`62d4e1e293` — S2 and the S6/S7 doc corrections; `c0f1ad041c` — a verification-pass round that also
deleted the PINS table and closed 007's F26; `f3bf733cf4` — both new checker families, S8's real fix,
and the `text-on-mark` gate). S3's dash-array fix landed in a fourth commit, `c1f109bfe4`, authored as
part of a later directory-merge refactor rather than a dedicated S3 commit — found only by tracing
`starter-full.html`'s git history, since neither of the three primary commits touched it.

This closeout pass did not implement anything: it read `spec.md`, `plan.md`, `tasks.md`,
`acceptance-criteria.md` and `goal.md`, then verified every REQ against the live corpus with direct
greps, file reads, and three live tool runs (the corpus checker, the mutation suite, and both
applicators), rather than trusting the task list's own checkboxes. Several gaps — S1's rename, S3's
marker-end and fill-alpha halves, S4, S5, S9, and S6's file-naming half — were found this way: each
task line existed in `tasks.md`, but the corresponding file content never changed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Ticked T016 (pin recompute) despite the literal task never running | `c0f1ad041c` deleted `derivation-record.md` §6's PINS table instead of recomputing it, with a recorded rationale: nothing read the pins, all four were stale, and the applicator's byte-identity check already catches what a pin would flag. The table can no longer state a hash a file doesn't carry, because there is no table — REQ-011's underlying purpose holds by a stronger mechanism than the one the task named. |
| Marked AC-016 (the 008→009 handoff gate) `Unmet` even though the mechanical legs pass | The corpus checker, mutation suite, and applicator all pass, but the gate's first clause — "S1-S9 are each resolved in one direction, the losing document or files are edited to match" — is not true for six of nine patterns. A green checker run does not mean the doctrine is reconciled; the checker only holds what a regex can assert, and S1's rename, S3's two sub-fixes, S4, S5, S6's naming, and S9 are all facts no current family checks for. |
| Did not mark any Unmet row `Waived` or `Superseded` | The acceptance-criteria.md status rules require a `decision-record.md` ADR for either value. This packet has none, so an unbacked waiver would be treated as unmet anyway — leaving the rows honestly `Unmet` is both the correct call and the only one the document's own rules permit. |
| Cited `c1f109bfe4` for S3's dash-array fix rather than one of the three commits named in this phase's closeout brief | The brief's commit list names the primary work, but the actual fix landed in a later refactor commit; citing the real commit rather than the nearest named one keeps the evidence trail accurate. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node scripts/check-diagram-corpus.cjs` | PASS — `RESULT: PASSED`, 12 families registered (10 existing + `legend-fidelity` + `short-connector-labels`), `Summary: errors: 0` |
| `node --test scripts/tests/` | PASS — `tests 16 pass 16 fail 0`, including both new mutation cases and the completeness-triple test |
| `node scripts/apply-diagram-tokens.cjs --default --all --out <tmp>` vs `assets/diagrams/` | PASS — `diff -rq` reports no differences |
| `node scripts/apply-design-md.cjs --default --all --out <tmp>` vs `assets/diagrams/` | PASS — `diff -rq` reports no differences |
| `grep -rc '<text[^>]*fill="#7a8399"' assets/diagrams/*.html` | PASS — `0` in every file (S2 residue check) |
| `grep -c "custom-red\|custom-blue" assets/diagrams/dp-integration.html` | FAIL — `4`, not `0` (S1's rename never landed) |
| Scoped `<svg>`-region grep for `var(--color-*)` on all four starters | FAIL — only `var(--color-link)` present anywhere; S9 never landed |
| Acceptance criteria (`acceptance-criteria.md`) | 9/16 `Met` (AC-001, 003, 005, 009, 010, 012, 013, 014, 015); 7/16 `Unmet` (AC-002, 004, 006, 007, 008, 011, 016) |
| `bash validate.sh 008-doctrine-reconciliation --strict` | Run at the end of this closeout pass; see the session's final `RESULT:` line |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **S1's property rename is undone.** `assets/diagrams/dp-integration.html` still declares
   `--custom-red`/`--custom-blue` and the `.footer-red*`/`.footer-blue*` classes that consume them.
   Workaround: none needed for correctness (the hex values are right), but a future reader of the CSS
   custom-property names will still see the wrong colour words.
2. **S3 is two-thirds unfinished.** The dash-array mismatch is fixed and held by `legend-fidelity`,
   but `high-level.html`'s two markerless legend lines and the three under-separated legend-swatch
   fills in `starter-full.html`/`architecture.html` are unchanged. No checker family holds either of
   these two sub-rules, so nothing will catch a regression here either.
3. **S4, S5, and S9 never started.** Legend typography (S4), legend rule bounding boxes (S5), and
   starter-token wiring (S9) are exactly as the manual review found them. These are the three
   patterns with the largest remaining file surface (four files each for S4/S9, two-plus-four for S5).
4. **S6's opt-out list is a count, not a citation.** `style-guide.md` correctly states the dot pattern
   is the default and that eight forms opt out, but does not name which eight — a future reader
   cannot check a specific file against the guide's own claim without re-deriving the list.
5. **The judged-boundary comment still overclaims what's unheld.** `check-diagram-corpus.cjs`'s header
   comment lists "the visible label gap" as needing a 2D geometry pass, even though
   `short-connector-labels` now holds the short-and-masked case mechanically. Not incorrect, just
   stale.
6. **No visual re-render was performed in this closeout pass.** `tasks.md` (T024) and the parent
   packet's closeout brief both call for viewing each edited file's rendered output before closing;
   this pass verified via grep, file reads, and the three scripted gates only.
<!-- /ANCHOR:limitations -->

---
