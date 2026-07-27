---
title: "Implementation Summary: De-vendor design-interface's Apache-2.0 dependency"
description: "Shipped record of the ordered de-vendor-then-delete change: the interface design guidance was re-authored in original words and the Apache-2.0 licence and every citing site were removed, in that order, as commit 8fa4752968."
trigger_phrases:
  - "apache devendoring implementation summary"
  - "design-interface license removal summary"
  - "design principles rewrite summary"
  - "vendored guidance de-vendor summary"
importance_tier: "important"
contextType: "continuity"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/001-apache-devendoring"
    last_updated_at: "2026-07-27T19:00:00Z"
    last_updated_by: "spec-reconciler"
    recent_action: "Recorded the shipped de-vendor commit 8fa4752968 and its two deviations"
    next_safe_action: "None; packet complete and verified against design-interface on disk"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-interface/references/design-process/design-principles.md"
      - ".opencode/skills/sk-design/design-interface/SKILL.md"
      - ".opencode/skills/sk-design/design-interface/README.md"
      - ".opencode/skills/sk-design/design-interface/changelog/v1.1.0.0.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
# Implementation Summary: De-vendor design-interface's Apache-2.0 dependency
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-apache-devendoring |
| **Completed** | 2026-07-27 (commit `8fa4752968`) |
| **Level** | 2 |
| **Status** | Complete |
| **Completion Pct** | 100% |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`design-interface` no longer carries an Apache-2.0 obligation, and it stopped carrying one the honest way: the borrowed wording was replaced before the licence that covered it was removed.

The guidance in `references/design-process/design-principles.md` had been adapted verbatim from an upstream skill, and `LICENSE.txt` at the packet root existed to cover exactly that text. All six sections were re-authored in this skill's own words — ground the work in its subject, treat the hero as a thesis, make structure encode meaning rather than decorate it, earn deviation once instead of everywhere, budget boldness, and treat interface copy as design material. The substance is unchanged; only the expression is now first-party.

With the borrowed text gone, the licence and every site citing it were removed in the same commit: the `license:` frontmatter key and two provenance citations in `SKILL.md`, the licensing Q&A and resource-table row in `README.md`, and the file's own attribution line. The manual-testing scenario whose PASS condition was "`LICENSE.txt` resolves on disk" was deleted along with its category directory, and the playbook's scenario counts were reconciled from 31 scenarios across 20 categories to 30 across 19.

One correction rode along: three documents claimed the live-read grounding policy "keeps the skill Apache-2.0 only". That claim became false in a new way once the skill carried no such licence, so it was rewritten to stand on the policy's own merit. Two passages describing which licences *would* attach if external content were copied were left untouched, because they remain accurate.

### Files Changed

Nine files, `+80/-332`, per `git show --stat 8fa4752968`.

| File | Action | Purpose |
|------|--------|---------|
| `design-interface/LICENSE.txt` | Deleted (`git rm`, 177 lines) | The Apache-2.0 text itself, removed after the wording it covered was replaced |
| `design-interface/references/design-process/design-principles.md` | Rewritten (`+50/-50`) | All six sections re-authored in original words; attribution line removed |
| `design-interface/SKILL.md` | Modified (`9 +-`) | `license:` frontmatter key, intro citation, resource-table row and provenance line removed |
| `design-interface/README.md` | Modified (`5 +-`) | Provenance answer and licence row in the file map rewritten |
| `design-interface/changelog/v1.1.0.0.md` | Created (43 lines) | "Original design guidance, Apache dependency removed" |
| `design-interface/manual-testing-playbook/licensing-and-provenance/licensing-and-provenance-integrity.md` | Deleted (93 lines) | Its PASS condition was the presence of the licence file |
| `design-interface/manual-testing-playbook/manual-testing-playbook.md` | Modified (`31 +-`) | ID-007 references removed; counts reconciled 31/20 to 30/19 |
| `design-interface/references/design-grounding/design-inventory.md` | Modified (`2 +-`) | Corrected the "keeps the skill Apache-2.0 only" claim |
| `design-interface/references/design-grounding/design-references-mcp.md` | Modified (`2 +-`) | Same correction |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

As a single commit, `8fa4752968` ("refactor(sk-design): re-author the interface design guidance in original words"), with the rewrite and the removal ordered inside it. The plan anticipated a two-commit sequence — rewrite first, then `git rm` — and collapsing them to one is not a weakening of the gate: the rewrite still had to be complete before the removal was staged, and because no intermediate commit exists, there is no published state in which borrowed wording shipped without its terms.

Removal used `git rm`, not a plain `rm`, so the deletion is a tracked change rather than a working-tree edit that the next checkout would undo. `.gitignore` was never touched — an ignore rule would have hidden the compliance state instead of resolving it, which the decision record scores 1/10.

Verification after the fact, re-run against the current working tree: `grep -rn 'Apache\|LICENSE.txt' design-interface/ --exclude-dir=changelog` returns nothing, and `package_skill.py --check` reports `Skill is valid!` / `Result: PASS`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| De-vendor before delete, never the reverse | Deleting `LICENSE.txt` first would ship Apache-2.0 text without its required license; see `decision-record.md` ADR-001 |
| Land both steps in one commit rather than two | Ordering is preserved within the commit, and a single commit leaves no intermediate published state to audit |
| Delete manual-testing ID-007 rather than invert it | Its subject was the licence file. Inverting it would have produced a scenario asserting the absence of something nothing else references; the de-vendored state is already asserted by the checklist's grep sweep |
| Remove the attribution line rather than rewrite it | After the rewrite there was no upstream source left to attribute; a rewritten line would have implied a provenance that no longer exists |
| Point the default-look calibration at the preflight card | It previously restated a specific palette inline; the mechanical preflight card already owns those checks as binary rows. One source of truth instead of two |
| Leave `.gitignore` untouched | An ignore rule masks the compliance state rather than resolving it |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Coverage | Notes |
|-----------|--------|----------|-------|
| Grep sweep (`Apache\|LICENSE.txt`) | Pass | `design-interface/` excluding `changelog/` | Zero lines returned against the current working tree |
| `package_skill.py --check` | Pass | `design-interface/` | `Skill is valid!` / `Result: PASS`; one advisory warning about `SKILL.md` word count, unrelated to licensing |
| Deletion is tracked | Pass | `LICENSE.txt` | `git log --diff-filter=D` returns `8fa4752968`; the path does not resolve on disk |
| Contract / surface / transport suites | Pass | Reported in the commit message: contract 8/8, surface 7/7, transport 37/37, parent-hub invariants clean, procedure-card schema pass | Reported by the implementing session, not re-run in this reconciliation |
| Rewrite fidelity comparison | Pass (inferred) | Six sections | Confirmed: the six H2 sections survive and `changelog/v1.1.0.0.md` §2 enumerates the preserved substance. Inferred: that no verbatim upstream sentence survives — no automated similarity check was run |
| Checklist | Pass | 19/19 | See `checklist.md` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Rewrite fidelity is argued, not measured.** The claim that no verbatim Apache-2.0 sentence survives rests on a section-by-section rewrite and the commit's own account of it. Confirming it mechanically would need the upstream text and a similarity check; neither was run.
2. **Ending the licence obligation does not erase the influence.** The principles are general design practice, and the change makes the expression first-party — it does not claim the ideas are novel. `changelog/v1.1.0.0.md` §4 says so explicitly.
3. **The guidance is now first-party content to maintain.** It no longer tracks upstream changes to Anthropic's `frontend-design` skill; future improvements have to be authored here.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Rewrite commit precedes a separate `git rm` commit | Both landed in the single commit `8fa4752968` | Ordering held within the commit; a single commit removes any intermediate state where borrowed wording ships unlicensed |
| Rewrite the attribution line at `design-principles.md:17` | Removed it | No upstream source remained to attribute after the rewrite |
| Delete **or invert** manual-testing scenario ID-007 | Deleted, with its `licensing-and-provenance/` directory | Inverting would have left a scenario with no subject |
| Playbook index reads 30 scenarios / 19 categories | Reads 43 / 25 today | Not a deviation by this packet: it read 30/19 at `8fa4752968`; the later `010-motion-merge` relocated 13 motion scenarios into the same playbook |

<!-- /ANCHOR:deviations -->
