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
    last_updated_at: "2026-09-11T10:30:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Re-verified 7 prior-Unmet criteria against 4 new commits; 5 flip to Met"
    next_safe_action: "Wire starter-full.html's paper-2 role inside its svg to close AC-011"
    blockers: []
    key_files:
      - "specs/sk-design/019-sk-design-diagram-upgrade/008-doctrine-reconciliation/tasks.md"
      - "specs/sk-design/019-sk-design-diagram-upgrade/008-doctrine-reconciliation/acceptance-criteria.md"
      - ".opencode/skills/sk-design/sk-design-diagram/assets/diagrams/starter-full.html"
      - ".opencode/skills/sk-design/sk-design-diagram/references/foundations/style-guide.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-008-doctrine-reconciliation"
      parent_session_id: null
    completion_pct: 88
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
| **Completed** | Partial — second closeout pass 2026-09-11; 14 of 16 acceptance criteria are `Met`, two (`AC-011`, `AC-016`) remain `Unmet` |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The manual review named nine systemic patterns (S1-S9) where a reference document and the diagram
corpus disagreed, or the corpus disagreed with itself, each with a stated direction. A first closeout
pass (2026-09-11, earlier the same day) found nine of sixteen acceptance criteria `Met` and seven
`Unmet`, because six of the nine S-items had been drafted as tasks in `tasks.md` but never executed
against the live files. Four further commits (`ed3f26aaf5`, `cddd84f9f8`, `67a8c88de5`, `76ad403c52`)
then executed that remaining work. This is a second closeout pass: it re-verified each of the seven
previously-`Unmet` rows against the live tree rather than trusting either the prior closeout or the
commit messages, and found five flip to `Met` and one genuine gap remains.

### Phase 8: doctrine-reconciliation

**What was already landed (first closeout, unchanged by this pass).** `style-guide.md`'s series-palette
section reads "multi-series charts and typed-chip vocabularies" and names all six real users (S1's
scope half). Forty-six `<text>` elements across twelve forms repointed from `soft` (`#7a8399`, 3.48:1)
to `muted` (`#4f5d75`, 6.11:1); `soft` stays structural-only (S2). `derivation-record.md` and
`style-guide.md` agree with `diagram-palette.json` and the starter templates on `rule-solid`'s light
value, and the stray `#f7591f` accent citation is gone (S7). `legend-fidelity.cjs` and
`short-connector-labels.cjs` are registered, both pass against the full 38-file corpus, and both refuse
a mutated case (S3's checkable half, S8); building `short-connector-labels` also surfaced and fixed a
real 52px instance in `dp-integration.html`. The PINS-table requirement (REQ-011) is `Met` by a
documented deviation — the table was deleted rather than recomputed, since nothing read it and the
applicator's byte-identity check already catches what a stale pin would.

**What landed since the first closeout.** `dp-integration.html`'s `--custom-red`/`--custom-blue`
properties are renamed to `--identity-rust`/`--logging-blue`, matching what they actually paint — S1's
second half (`76ad403c52`). `high-level.html`'s two markerless legend lines now carry `marker-end`,
matching their real connectors — the second of S3's three sub-fixes (`ed3f26aaf5`). Four files'
legend entry typography converges on sentence-case Geist sans (`import-drawio.html`,
`import-mermaid.html`, `org-chart.html` via `76ad403c52`; `it-state.html` via `67a8c88de5`) — S4.
`er.html` and `high-level.html`'s legend rules are corrected to their own content's bounding box, and
the other four audited files are confirmed unchanged where `40`/`960` already matched — S5
(`76ad403c52`). `style-guide.md`'s dot-pattern sentence now names all eight opt-out forms by
description — S6's remaining half (`ed3f26aaf5`). Eighty literals across the four starter templates
now reference their palette role by name instead of by value, so repainting a starter's palette block
repaints its drawing (renders confirmed byte-identical before and after) — most of S9
(`cddd84f9f8`).

**S3's third sub-fix, resolved by measurement rather than by change.** The manual review's third legend
complaint — three keyed node-type fills in `starter-full.html`/`architecture.html` measuring as one
grey — was investigated rather than patched. `ed3f26aaf5` measured the three fills at within ~4% of
each other and added a paragraph to `style-guide.md` §4 explaining that the stroke, not the fill, is
what separates these node types by design, and that a legend swatch inheriting the same near-identical
fill is faithful rather than a defect. The fill values themselves are unchanged, and the node-type
treatment table itself is unchanged, exactly as REQ-003's own constraint required. This closeout judges
that outcome as satisfying AC-004's purpose (a swatch must match what the drawing actually uses to tell
the type apart) rather than its literal instruction (step the alphas) — see the Key Decisions table
below for the reasoning.

**What still has not landed.** S9's starter-token wiring is not complete. Three of the four templates
(`starter-light.html`, `starter-dark.html`, `starter-terminal.html`) ship as intentionally empty
placeholder drawings — `assets/diagrams/README.md` now says so explicitly — so their `ink`
(light/dark) and `ink`/`soft`/`accent-tint` (terminal) roles have no drawn content to reference inside
the `<svg>`; that is a documented design decision, not an oversight. `starter-full.html`, the one
template meant to carry a worked drawing, wired eight of its nine required roles (`paper`, `ink`,
`muted`, `soft`, `rule`, `rule-solid`, `accent`, `accent-tint`) but not the ninth: `paper-2`'s only
reference in the file is a commented-out opt-in card-frame rule, never activated, even though `paper-2`
is an actively-used role in seven other corpus files. This is the one requirement (REQ-010, P0) still
open, and it is why AC-011 and the AC-016 phase gate stay `Unmet`. `check-diagram-corpus.cjs`'s
judged-boundary comment also still lists "the visible label gap" as un-held, unchanged since the first
closeout (T020).

### Files Changed (this phase, cumulative across both closeout passes)

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/sk-design-diagram/references/foundations/style-guide.md` | Modified | S1 scope widened; S6 default stated and all eight opt-outs named; S7 `rule-solid` row + `#f7591f` citation corrected; the S3 fill-measurement paragraph added |
| `.opencode/skills/sk-design/sk-design-diagram/references/foundations/derivation-record.md` | Modified | S7 `rule-solid` row corrected; PINS table (§6) deleted with a documented rationale |
| `.opencode/skills/sk-design/sk-design-diagram/assets/diagrams/dp-integration.html` | Modified | S1 custom-property rename (`76ad403c52`); S2 text-fill repoint; S8's 52px mask fix |
| `.opencode/skills/sk-design/sk-design-diagram/assets/diagrams/high-level.html` | Modified | S3 marker-end added to two legend lines (`ed3f26aaf5`); S5 legend rule widened to `x2="972"` (`76ad403c52`) |
| `.opencode/skills/sk-design/sk-design-diagram/assets/diagrams/er.html` | Modified | S5 legend rule widened to `x2="980"` (`76ad403c52`) |
| `.opencode/skills/sk-design/sk-design-diagram/assets/diagrams/{import-drawio,import-mermaid,org-chart}.html` | Modified | S4 legend typography converged (`76ad403c52`) |
| `.opencode/skills/sk-design/sk-design-diagram/assets/diagrams/it-state.html` | Modified | S4 legend typography converged (`67a8c88de5`) |
| `.opencode/skills/sk-design/sk-design-diagram/assets/diagrams/starter-{light,dark,terminal,full}.html` | Modified | S9 chrome roles wired via `var(--color-*)`; three ship as documented empty placeholders; `starter-full.html` wires 8 of 9 required roles, `paper-2` still open (`cddd84f9f8`) |
| `.opencode/skills/sk-design/sk-design-diagram/assets/diagrams/README.md` | Modified | Documents the three-starters-are-empty-by-design decision |
| `.opencode/skills/sk-design/sk-design-diagram/scripts/families/legend-fidelity.cjs` | Created | S3's checkable half: a legend swatch's dash array must equal some drawing element's dash array in the same file |
| `.opencode/skills/sk-design/sk-design-diagram/scripts/families/short-connector-labels.cjs` | Created | S8's checkable half: no label mask over a connector under ~60px |
| `.opencode/skills/sk-design/sk-design-diagram/scripts/tests/mutation-cases.cjs` | Modified | One mutation case each for `legend-fidelity` and `short-connector-labels` |
| `.opencode/skills/sk-design/sk-design-diagram/scripts/check-diagram-corpus.cjs` | Not modified | T020's judged-boundary comment narrowing still not executed — still cites "the visible label gap" as un-judged |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The first closeout's evidence (three commits, `62d4e1e293`/`c0f1ad041c`/`f3bf733cf4`, plus a fourth
found by tracing git history, `c1f109bfe4`) is unchanged and not re-litigated here. The remaining work
landed in four further commits, all on the same day: `ed3f26aaf5` (the two legend markers plus the
dot-pattern naming plus the S3 fill-measurement documentation), `cddd84f9f8` (S9's starter-token
wiring), `67a8c88de5` (`it-state.html`'s legend typography), and `76ad403c52` (a larger closing sweep —
the custom-property rename, both legend-rule bounding-box corrections, three more files' legend
typography, and the skill's 1.2.0.0 release).

This closeout pass did not implement anything: it read `spec.md`, `plan.md`, `tasks.md`,
`acceptance-criteria.md` and `goal.md`, read each of the four commits with `git show --stat` and
`git show`, then re-verified every previously-`Unmet` REQ against the live corpus with direct greps,
file reads, two live tool runs (the corpus checker and mutation suite), both applicators' byte-identity
checks, and a direct view of two of the ten regenerated screenshots. Where a requirement's literal text
and its actual resolution diverged — the S3 fill-alpha step (answered with a measurement, not a value
change) and the S6 opt-out naming (named by description, not by the now-stale literal filenames) — both
are recorded as judgment calls with the reasoning stated, not silently ticked.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Marked AC-004 `Met` even though REQ-003's fill-alpha step was never executed | `ed3f26aaf5` measured the three legend-swatch fills and found them within ~4% of each other by design (the stroke, not the fill, separates these node types); it documented that in `style-guide.md` §4 rather than stepping the values, and left the node-type-treatment table untouched as REQ-003 required. Read against the criterion's purpose — a swatch must match what the drawing actually uses to distinguish the type — the finding was investigated and shown not to be a defect, which is a resolution, not a skip. |
| Marked AC-008 `Met` even though the eight opt-out files are named by description, not by REQ-007's literal `example-*.html` filenames | The corpus dropped the `example-`/`template-` prefixes in a later directory-merge; those literal filenames no longer exist on disk, so quoting them verbatim would itself be a stale-value violation of the same doctrine this phase exists to close. `style-guide.md:169`'s eight descriptive phrases ("the security matrix, both import examples, the IT current-state, medallion, org chart, consultant quadrant and venn") identify all eight files unambiguously. |
| Kept AC-011 (and AC-016) `Unmet` despite S9's large, real progress | Three of the four templates' `ink`/`soft`/`accent-tint` gaps are a documented design decision (they ship as empty placeholders), which this closeout accepts as legitimate. `starter-full.html`'s `paper-2` gap has no such documentation, and `paper-2` is an actively-used role elsewhere in the corpus — nothing distinguishes it from a role that simply never got wired. REQ-010 is a P0 MUST for every declared role; one undocumented gap keeps the row `Unmet`. |
| Did not mark AC-011 `Waived` or `Superseded` | The acceptance-criteria.md status rules require a `decision-record.md` ADR for either value. This packet still has none, so an unbacked waiver would be treated as unmet anyway — leaving the row honestly `Unmet` is both the correct call and the only one the document's own rules permit. |
| Re-ran the corpus checker, mutation suite, and both applicators live rather than trusting the commit messages | The first closeout's own practice; repeated here so this closeout's `Met` rows rest on the same live evidence standard rather than on the intervening commits' own claims. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node scripts/check-diagram-corpus.cjs` | PASS — `RESULT: PASSED`, 38 files, 12 families registered, `Summary: errors: 0` |
| `node --test scripts/tests/` | PASS — `tests 18 pass 18 fail 0`, including both new mutation cases and the completeness-triple test |
| `node scripts/apply-diagram-tokens.cjs --default --all --out <tmp>` vs `assets/diagrams/` | PASS — `diff -rq` reports no differences |
| `node scripts/apply-design-md.cjs --default --all --out <tmp>` vs `assets/diagrams/` | PASS — `diff -rq` reports no differences |
| `grep -c "custom-red\|custom-blue" assets/diagrams/dp-integration.html` | PASS — `0` (was `4` at the first closeout) |
| `grep -n 'x2="960"' assets/diagrams/{er,high-level}.html` | PASS — no hits; both now `x2="980"`/`x2="972"` |
| Legend typography grep across `import-drawio`/`import-mermaid`/`it-state`/`org-chart.html` | PASS — all four read sentence-case `'Geist', sans-serif`; `LEGEND` eyebrows stay mono uppercase |
| Dot-pattern opt-out names in `style-guide.md` | PASS — all eight files identified (by description) |
| Scoped `<svg>`-region grep for `var(--color-*)` on all four starters | PARTIAL — `starter-light`/`starter-dark`/`starter-terminal` wire every role their (empty) drawn content uses; `starter-full.html` wires 8 of 9 required roles, `paper-2` still absent |
| Two of ten regenerated screenshots viewed directly (`high-level.png`, `it-state.png`) | PASS — both render correctly, no regression |
| Acceptance criteria (`acceptance-criteria.md`) | 14/16 `Met`; 2/16 `Unmet` (`AC-011`, `AC-016`) |
| `bash validate.sh 008-doctrine-reconciliation --strict` | Run at the end of this closeout pass; see the session's final `RESULT:` line |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **S9 is not fully closed.** `starter-full.html`'s `paper-2` role has no in-svg reference — the one
   remaining gap against REQ-010. The other eight roles across all four starters are correctly wired
   or legitimately exempt (documented empty-placeholder design). Closing this requires either a class
   using `var(--color-paper-2)` applied once inside `starter-full.html`'s `<svg>`, or a documented
   decision explaining why `paper-2` is exempt where the other three empty starters' unused roles are.
2. **The judged-boundary comment still overclaims what's unheld.** `check-diagram-corpus.cjs`'s header
   comment lists "the visible label gap" as needing a 2D geometry pass, even though
   `short-connector-labels` now holds the short-and-masked case mechanically (T020, unchanged since the
   first closeout).
3. **Visual re-render is a sample, not a full pass.** This closeout viewed two of the ten screenshots
   regenerated by the four commits (`high-level.png`, `it-state.png`); the other eight were confirmed
   regenerated via git-diffed PNG bytes but not individually viewed.
4. **AC-004's and AC-008's `Met` status rest on judgment calls, not mechanical checks.** Both are argued
   explicitly in `acceptance-criteria.md` and in the Key Decisions table above; a reviewer who reads
   REQ-003 or REQ-007 literally rather than by purpose may reasonably disagree with either call.
<!-- /ANCHOR:limitations -->

---
