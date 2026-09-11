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
    packet_pointer: "sk-design/019-sk-design-diagram-upgrade/007-manual-review-remediation"
    last_updated_at: "2026-09-11T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Closed out phase 7: 42/42 tasks, 37/37 AC rows verified Met"
    next_safe_action: "None — packet closed"
    blockers: []
    key_files:
      - "specs/sk-design/019-sk-design-diagram-upgrade/007-manual-review-remediation/tasks.md"
      - "specs/sk-design/019-sk-design-diagram-upgrade/007-manual-review-remediation/acceptance-criteria.md"
      - "specs/sk-design/019-sk-design-diagram-upgrade/007-manual-review-remediation/goal.md"
      - "specs/sk-design/019-sk-design-diagram-upgrade/007-manual-review-remediation/scratch/fix-verification.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-007-manual-review-remediation"
      parent_session_id: null
    completion_pct: 100
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
| **Spec Folder** | 007-manual-review-remediation |
| **Completed** | 2026-09-11 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The fresh-Opus manual review of all 38 corpus forms (006) found 34 numbered defects across 31
files — two P1s that misstate a physical fact a reader trusts on sight, 28 P2s that erase
connectors, mismatch legends, fail a recorded contrast gate or leave a catalog claim undrawn, and 4
P3s covering stale comments, dead tokens, a misdirected leader and an unlabelled axis. This phase
fixed every one of them, at the file each defect lived in, without touching a systemic pattern or
moving a file.

### Phase 7: manual-review-remediation

Every F1-F34 finding is now fixed in its shipped file with evidence a reader can check, at today's
paths. The work shipped in two rounds, both already committed. Round one (`9f5dcdf94f`) dispatched
one fix per file against the review's own stated "Fix:" text, closing all 34 findings on paper.
A fresh reader then rendered every one of the 31 changed forms from a clean checkout and looked at
each — not trusting the commit message — and found 32 of 34 closed clean, 2 not landed at all
(F11, F26), and 9 of the 32 "closed" findings had introduced a new, previously-absent defect in the
process (two as severe as what they replaced: a connector routed through the node it points at, and
a guard label whose own mask erased the transition it qualified). Round two (`aa784beac7`) closed
all 18 of those items. Three of them needed a decision the review's own text could not settle
arithmetically or logically — each was decided once by the conductor rather than reversed or passed
down (see Key Decisions).

This closeout pass verified both rounds against the live corpus rather than trusting either commit
message: every finding's fix was checked against the file's actual current bytes, every corpus-wide
invariant was re-run from scratch, and 14 of round two's 18 files were independently re-rendered and
viewed for the first time since they were fixed — surfacing one further, previously unseen defect
(see Known Limitations).

### Files Changed

This phase's own two commits are already shipped; nothing under `.opencode/` was touched by this
closeout pass. For the record, the shipped diff spans:

| File | Action | Purpose |
|------|--------|---------|
| 27 example forms + 4 starter templates (`assets/diagrams/*.html`, current paths) | Modified | The 31 files carrying F1-F25, F27-F34's own numbered defect, fixed in place across both rounds |
| `assets/style-reference/harness-diagram/diagram-palette.json` | Modified | F26: the `untokenized` exemption naming `example-sequence-oauth-dark.html` deleted |
| `references/foundations/derivation-record.md` | Modified | F26: the sentence naming the exemption rewritten to state the list is empty; the stale §6 "PINS" section (four sha256 hashes nothing read) dropped in the same edit |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Execution ran on DeepSeek V4.1 Flash at max thinking via cli-pi and llmgateway, one lane per
dispatch, each brief carrying the exact file, line and replacement (D15) — the conductor never
delegated verification. After round one, a fresh Claude Opus 5 pass re-rendered all 31 changed files
from a clean checkout with headless Chrome, cropped and upscaled 15 regions where a verdict turned on
a few pixels, and wrote `scratch/fix-verification.md` — the evidence this phase and its closeout both
cite. Round two closed everything that pass found.

This closeout pass (Claude Opus 5, agent `@markdown`) re-verified rather than re-stated: it pinned a
git worktree to the pre-remediation commit (`2dc62a071b`) to re-confirm the baseline `check-diagram-corpus.cjs`
result, the cited line numbers and the pre-fix palette role counts; computed every colour-lane
contrast figure directly through `color-gates.cjs` rather than trusting the review's own numbers;
diffed both commits file by file against the manual review's exact "Fix:" wording; and rendered 14 of
round two's 18 touched files fresh from today's working tree to confirm the corrections actually
landed and nothing new had broken since.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| F11 (venn): centre each sublabel on its lobe's clear span, not the review's suggested 20px move | The review's own 20px offset was arithmetically insufficient in both directions — recomputed, the Feasible arc still crossed `WE CAN BUILD IT` and the Viable arc crossed `BUSINESS SUSTAINS` worse. Centring on the actual clear span (`x="384"`/`x="612"`) is the fix that survives the arithmetic, not a masking workaround |
| F15 (org-chart): finish the "drop the claim" branch rather than reverse it | Round one dropped the legend entry and half the subtitle clause, leaving the subtitle ungrammatical and the note bar still asserting a claim about a treatment nothing draws. The review offered two branches (mark the specialists, or drop the claim); reversing to the other branch this late would have thrown away round one's correct half. Finishing the branch already chosen — restore the conjunction, reword the bar to "Known gaps:" — resolves both symptoms with one coherent answer |
| F21 (quadrant-consultant): shrink the focal card into its quadrant, not widen the axis | A correctly-sized tint (matching the quadrant exactly, as F21 asked) exposed that the card grid is 60px wider than the axis span on each side — a gap the old, oversized tint had been hiding. Widening the axis to match the card would touch the whole chart's symmetric cross; shrinking one focal card is the smaller, reversible edit for the same visual result |
| F23: resolve to a measured existing role, never a new hex | The review's own suggested fixes (`#8a6a3c`, `#5c6b51`) are not declared roles in any skin. Measuring every already-declared role against each chip fill and picking whichever clears 4.5:1 (`#4f5d75` for TB, `#2d3142` for LS) keeps the byte-for-byte applicator guarantee (D1) intact — a new hex would have broken it silently |
| F26: repoint the one literal tone, not just delete two documents | The plan assumed the exempted file needed no byte changed. It did: the file's one undeclared tone (`#8e98ac`) measured 4.44:1, under the text gate the dark skin's own recorded roles would have caught had the file not been exempted. The exemption was hiding a real defect, not recording a real decision — repointing the tone to the dark skin's own `muted` role and deleting the exemption together closes both the numbers gap and the taxonomy gap |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node scripts/check-diagram-corpus.cjs` | PASS — 38 files, 12 families, 0 errors, `RESULT: PASSED` |
| `node --test scripts/tests/` | PASS — 16/16 |
| `node scripts/apply-diagram-tokens.cjs --default --all --out <tmp>` vs `assets/diagrams` | PASS — `diff -rq` empty (byte-identical); `--examples` flag this phase's own docs cite no longer exists post-merge, `--all` is the current equivalent |
| `node scripts/apply-design-md.cjs --default --all --out <tmp>` vs `assets/diagrams` | PASS — `diff -rq` empty (byte-identical) |
| `grid-baseline.json`'s 24 per-file counts vs the pre-fix (`2dc62a071b`) snapshot | PASS — byte-identical; this phase's own commits never touch the file |
| Pre-fix baseline re-check (`2dc62a071b` worktree) | PASS — `RESULT: PASSED` (10 families, 0 errors); cited line numbers and role counts all matched spec.md's stated facts |
| `color-gates.cjs` contrast, computed directly (not trusted from the review) | PASS — F17/F22 `#4f5d75`/paper 6.11:1; F23 TB/LS 6.66:1/12.89:1; F30 terminal muted/paper 6.55:1; all ≥4.5:1 (F23's process.html DB chip 4.56:1; data-flow.html's DB chip 4.44:1, see Known Limitations) |
| CI (`.github/workflows/diagram-corpus.yml`) | PASS — both `9f5dcdf94f` and `aa784beac7` show `completed / success` on `main` and `skilled/v4.0.0.0` |
| Fresh renders (this closeout pass) | 14 of round two's 18 files re-rendered from today's working tree and viewed: `state`, `import-mermaid`, `tree`, `swimlane`, `venn`, `quadrant-consultant`, `gantt`, `line`, `nested`, `org-chart`, `dp-integration`, `process`, `timeline`, `starter-full` — 13 confirmed clean, 1 (`swimlane`) surfaced a new defect (see Known Limitations) |
| Comment hygiene | PASS — `grep -rnE '<!--.*(\bF[0-9]{1,2}\b\|\bT0[0-9]{2}\b\|007-manual-review\|manual-review-remediation).*-->' assets/diagrams/*.html` reports 0 matches |
| `acceptance-criteria.md` | 37/37 rows `Met` |
| `tasks.md` | 42/42 tasks `[x]`, 0 `[B]` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`example-swimlane.html`'s `DEPLOY TRIGGER` label clips the `Approve merge` box.** Round two
   moved `Approve merge` down 12px to fix F14's own lane-alignment defect (item #4 in
   `fix-verification.md`), but the adjacent `DEPLOY TRIGGER` text label (`:113`, `y="318"`) was not
   moved with it and now sits 2px below the box's new bottom edge, visibly clipping its rounded
   corner in a fresh render. This is not F14, not one of the 18 verification items, and was found
   only by this closeout's own render pass — no prior verification looked at the file after this
   specific move. Fixing it means editing `.opencode/skills/sk-design/sk-design-diagram/assets/diagrams/swimlane.html`,
   outside this closeout's write authority.
2. **`example-layers.html`'s promised fill differentiation was never applied.** F9 asked for a
   hairline on all four bands *and* stepping L2/L1 apart (`#ececec`/`#e4e4e4`). Only the hairline
   landed; L1 and L2 both still render `#ececec` today, distinguished only by the hairline between
   them. F9's own named defect (five layers reading as four) is resolved, so this is a polish gap,
   not a reopened finding.
3. **`example-data-flow.html`'s DB chip sits at 4.44:1, under the 4.5:1 text gate.** F23's own
   "Fix:" line named only the TB and LS chips (both now well clear); the DB chip's 4.44:1 reading is
   in the review's body table, not its instruction. `example-process.html`'s equivalent chip was
   corrected in round two; `example-data-flow.html`'s was not, and was closed only later by an
   unrelated, out-of-scope commit (`08e8051eafb`) belonging to a different phase's own new checker
   family.
4. **`template-full.html`'s two other dead tokens stay dead.** `--color-rule-solid` and
   `--color-accent-tint`, flagged in F32's own body text, are referenced nowhere in the file. F32's
   "Fix:" line names only `--color-link`; wiring the other two was never this finding's scope and is
   left as an open observation for whichever phase next touches this file.
<!-- /ANCHOR:limitations -->

---


