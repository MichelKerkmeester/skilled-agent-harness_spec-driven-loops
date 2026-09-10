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
    packet_pointer: "sk-design/019-sk-design-diagram-upgrade/004-corpus-and-catalog"
    last_updated_at: "2026-09-10T23:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the phase documents"
    next_safe_action: "Execute T001"
    blockers: []
    key_files:
      - "specs/sk-design/019-sk-design-diagram-upgrade/004-corpus-and-catalog/spec.md"
      - "specs/sk-design/019-sk-design-diagram-upgrade/004-corpus-and-catalog/plan.md"
      - "specs/sk-design/019-sk-design-diagram-upgrade/004-corpus-and-catalog/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-004-corpus-and-catalog"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-corpus-and-catalog |
| **Completed** | Not yet — planned |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase is authored, not executed. Once T001-T019 run, the 34 examples and four templates will
carry the signed skin instead of the earlier one `style-guide.md:52` has been flagging since v5.1
was deferred, the 39 captures will show the repainted corpus instead of stale pixels, and
`references/catalog.md` will replace a 27-row prose table buried inside `SKILL.md` with a
sentinel-wrapped, machine-columned index verified in both directions — the same discipline
`sk-design-chart/references/catalog.md` already enforces.

### Phase 4: corpus-and-catalog

Once executed, this phase turns three separate liabilities into one closed state: an exemplar
corpus painted under an earlier skin, a selection guide a reader has to cross-reference against 27
files by hand, and a router pseudocode block eating 12.6% of `SKILL.md`'s bytes. The repaint runs
through 003's applicator (extended to reach the 34 examples it does not cover today) so every
promotion is a read diff, not a hand-typed hex edit. The catalog gives `apply-diagram-tokens.cjs`'s
sibling documentation surface — the "which type for this question" table — the same bidirectional
guarantee 003's sentinel contract already gives the color tokens. `references/catalog.md` and
`apply-diagram-tokens.cjs` are the two concrete artifacts everything else in this phase serves.

### Files Changed (planned)

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/sk-design-diagram/assets/examples/*.html` (34 files) | Modified | Repainted to the signed skin via the extended applicator, promoted after a read diff |
| `.opencode/skills/sk-design/sk-design-diagram/screenshots/**/*.png` (39 files) | Modified | Re-shot against the repainted sources |
| `.opencode/skills/sk-design/sk-design-diagram/references/catalog.md` | Created | Sentinel-wrapped, bidirectionally-verified selection guide |
| `.opencode/skills/sk-design/sk-design-diagram/references/foundations/router-pseudocode.md` | Created | The relocated Smart Router Pseudocode block |
| `.opencode/skills/sk-design/sk-design-diagram/SKILL.md` | Modified | Selection-guide table and pseudocode block both replaced by pointers |
| `.opencode/skills/sk-design/sk-design-diagram/references/foundations/style-guide.md` | Modified | `:52`'s deferred "v5.1" note discharged |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. The planned path: T001-T003 re-confirm and extend 003's applicator; T004-T008
repaint the corpus and reproduce its census; T009-T010 re-shoot and eyeball the captures; T011 signs
the sketchy descope; T012-T014 build and bidirectionally verify the catalog; T015-T017 rebuild
`SKILL.md` and discharge the style-guide note; T018 settles the feature-catalog/manual-testing-
playbook question; T019 runs the phase gate — a dress run of 005's checker, which cannot execute
until 005 ships it. Rollout is not a deployment — every artifact is a git-tracked file read later by
a hand-run script or a human, not a running service.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Extend 003's applicator rather than hand-edit 34 files (ADR referenced in plan.md's Architecture) | 003's own `implementation-summary.md` records this as its Known Limitation #1 and explicitly defers the extension to this phase; hand-editing would reintroduce exactly the risk the applicator exists to remove |
| Normalize the catalog's ceiling column, don't extract a common phrase (ADR-001) | 7 of 27 type files state a ceiling in genuinely different words; forcing one shared phrase would erase the difference between a hard cap and a soft budget |
| Descope sketchy with a stated reason instead of manufacturing a proof example (ADR-002) | No example in the 34-file corpus exercises it; adding a 35th "decoration" file would falsify the taxonomy's verified 27+5+2+0=34 count |
| Treat feature-catalog/ and manual-testing-playbook/ as independent documents, not an extraction target (ADR-003) | Both are standard `sk-doc` artifact types with their own template contracts, never diffed against `SKILL.md` before; this phase's diff task is the first check, not a fold-in |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `grep -ohE "#[0-9a-fA-F]{6}" assets/examples/*.html \| wc -l` reports `1577` | Not yet run — planned as T007, verifying the census the repaint must reproduce |
| `references/catalog.md`'s bidirectional row-file check | Not yet run — planned as T014 |
| `render-screenshots.cjs ./assets ./screenshots --check` | Not yet run — planned as T009 |
| `grep -c "Smart Router Pseudocode" SKILL.md` reports `0` | Not yet run — planned as T016 |
| `check-diagram-corpus.cjs` dress run reports `RESULT: PASSED` | Not yet run — planned as T019, blocked until 005 ships the script |
| `validate.sh specs/sk-design/019-sk-design-diagram-upgrade/004-corpus-and-catalog --strict` | Not yet run — to be run by the orchestrator, not this authoring pass |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The phase gate (T019) cannot run until 005 exists.** A dress run of `check-diagram-corpus.cjs` is the literal 004 → 005 handoff criterion named in the parent spec's Phase Handoff table, but the script itself is 005's deliverable. This phase's own completion is therefore sequenced but not independently closeable until 005 ships.
2. **The applicator extension's exact selector shape (a `--forms`/`--all` flag vs. a per-file `--skin` list) is left to whichever task implements T002.** Either shape satisfies REQ-001; the phase's own gate (the census count and the byte-diff re-confirmation) does not depend on which shape is chosen.
3. **The catalog's "Imports" column content (naming the two import-proof files directly vs. a boolean per type) is left to the catalog-authoring task (T012).** Neither shape changes what the bidirectional check in T014 verifies.
<!-- /ANCHOR:limitations -->
