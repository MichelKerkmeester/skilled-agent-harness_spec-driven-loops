---
title: "Implementation Summary"
description: "The metadata gate rejects a broken external surface_detection block, the private surface skills rank ahead of SKILLED, the public quality overlay no longer imposes the Webflow house style, the comment checker lost three Webflow exceptions that hid violations, and naming is P1 in every SKILLED checklist."
trigger_phrases:
  - "deferred surface items implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/013-private-surface-skills/008-deferred-surface-items"
    last_updated_at: "2026-10-25T21:05:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "All five items closed with evidence"
    next_safe_action: "None, phase complete"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-25-013-008-deferred-surface-items"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.3 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-deferred-surface-items |
| **Completed** | 2026-10-25 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A JavaScript file in the hub is now judged by the hub's own rules. Before this phase, `sk-code-quality` loaded an overlay for every `.js` target that made snake_case names and a window init guard P0 blockers. That was the private Webflow site's house style, and it contradicted the camelCase rule the SKILLED references set.

### Phase 8: deferred-surface-items

Phase 007 left four items out of scope, and the overlay work found a fifth. All five are closed:
- The metadata gate fails a broken external `surface_detection` block at commit and CI time. Before, it passed, and every reader ignored it silently.
- The operator's two private skills declare blocks, so their surface leads when a request touches their stack.
- The overlay keeps only checks that hold on every surface.
- The comment checker no longer exempts WEBFLOW, MOTION and LENIS lines, which let any violation on such a line pass.
- Naming sits at P1 in every SKILLED checklist, the tier the operator chose.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` | Modified | Four field rules, one finding per broken rule |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-root-metadata-contract.test.cjs` | Modified | Six tests covering each rule, a valid block and the absent key |
| `.skilled/skills/sk-code/shared/references/stack-detection.md` | Modified | Section 2 states the rules and the `local-*` skip |
| `.skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/` (three files) | Modified | Webflow and duplicate checks removed, surface-neutral checks kept |
| `.skilled/skills/sk-code/sk-code-quality/SKILL.md`, `README.md`, `changelog/v1.4.0.0.md` | Modified, Created | Truthful load wording and the 1.4.0.0 release note |
| `.skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh` and its test | Modified | The three exceptions removed, four cases added |
| `.skilled/skills/sk-code/manual-testing-playbook/tooling-and-hooks/comment-hygiene-hook.md`, `sk-code-quality/manual-testing-playbook/quality-gate/quality-checklist.md` | Modified | Scenarios match the new behaviour |
| `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/{javascript,typescript,python}-checklist.md` | Modified | Naming items moved from P0 to P1 |
| `.hermes/skills/sk-code-quality/SKILL.md` | Regenerated | The Hermes copy of the mode |
| The two private skills' `graph-metadata.json` and one private reference doc | Modified (private, untracked here) | The blocks, and two links repointed at the private skill's own checklists |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each change ran its own tests before and after, and each new test was shown to fail against the old code. The gate then ran in the form `routing-registry-drift.yml` uses, together with the hub checks `check-rule-copies.test.sh`, `verify-router-sync.cjs` and `parent-skill-check.cjs`. Every private file was backed up before its edit and confirmed with `cmp`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reuse `GRAPH_METADATA_INVALID_SURFACE_DETECTION` with a message per rule | The gate already reuses one code for several causes, and the message names the rule that broke |
| A marker made only of whitespace fails | A blank marker would match nearly every path or request and make its surface lead everywhere |
| Leave the gate's `local-*` skip alone | Every tracked-output writer skips `local-*` by the packet's D5, so the rules protect the skills an adopting repository adds |
| Remove the overlay's Webflow checks instead of rewording them | The private Webflow skill already carries each one, which was checked before every removal |
| Remove the three comment-checker exceptions | No verdict depended on them, and each hid every violation on a labelled line |
| Move the language checklists' naming items to P1 | The operator set naming at P1, and no automated check enforces it as blocking |

The operator delegated these decisions on 2026-10-25, and each is one revert away.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Contract test file | PASS, 40 of 40, exit 0 (34 of 34 before) |
| Comment-hygiene suite | PASS, 26 of 26, exit 0 (22 of 22 before) |
| Gate in its CI form, leaf and derived freshness | PASS, 14 of 14 each, exit 0 |
| `check-rule-copies.test.sh`, `verify-router-sync.cjs`, `parent-skill-check.cjs` | PASS, exit 0 each, 5/5 and 0 warnings |
| Router intent signals, skill graph, Hermes copies | PASS, exit 0 each, 67 copies in sync |
| `validate_document.py` on every edited doc | VALID, 0 issues |
| Detection readers on the private blocks | PASS, each private surface leads SKILLED for a mixed request |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A subfolder workspace gets no surface hint.** A path marker matches a workspace that holds it or sits inside it, so a session opened below the marker's folder gets no hint. Request text that names a marker still routes. Start the session at the repository root.
2. **Two private follow-ups stay with the operator.** The private Obsidian skill's SKILL.md still names the plugin's old name and an old detection marker, and the private Webflow skill writes BEM in its own form. Both files belong to the operator.
<!-- /ANCHOR:limitations -->

---
