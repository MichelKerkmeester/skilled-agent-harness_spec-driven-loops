---
title: "Implementation Summary"
description: "Version now names the skill edition and lives on SKILL.md only, so frontmatter-version verify passes on every skill, and the catalog, citation and playbook checks catch the doc drift the research found."
trigger_phrases:
  - "doc and catalog truth implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/003-doc-and-catalog-truth"
    last_updated_at: "2026-10-11T20:41:02Z"
    last_updated_by: "builder"
    recent_action: "Built DV-R1 to R4, DV-R6 and PC-R3 to R7, ran the deep review and fixed its confirmed findings"
    next_safe_action: "Integrator merges the branch and renumbers any version collision with the other phases"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs"
      - ".skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py"
      - ".skilled/hooks/post-edit-quality/lib/post-edit-router.cjs"
      - ".skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py"
      - ".skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs"
      - ".skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "build-021-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-doc-and-catalog-truth |
| **Completed** | 2026-10-11 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`frontmatter-version.mjs verify` failed on all 14 skills because every child doc carried a per-doc version that went stale on the next commit. Now `version` names the skill edition and lives on `SKILL.md` only, and `verify` exits 0 on all 14. The catalog, citation and playbook checks also catch the kinds of drift the research found by hand.

### Phase 3: doc-and-catalog-truth

The engine, the packager and the post-edit router all treat `SKILL.md` as the only versioned doc, and one script run removed the stale `version:` line from 2,845 child docs. The standard and the template asset say the same thing. The catalog validator now checks paths in two-column File tables. The citation scanner resolves paths written relative to a skill's `runtime/` or `scripts/` directory, and `--overlap` prints an advisory line for each in-range citation whose window lost the identifier its sentence names. The playbook validator warns, without failing, on a backticked path that resolves from no base. The live drift the research listed is corrected.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs` | Modified | `inScope()` and `classify()` accept `SKILL.md` only |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py` | Modified | `VERSIONED_DOC_SUBTREES` is `changelog` only |
| `.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs` | Modified | `isVersionedSkillDoc()` matches `SKILL.md` only |
| 2,845 child docs under `.skilled/skills/*/` | Modified | One `version:` line removed from each |
| 15 citations in `.skilled/skills/sk-code/manual-testing-playbook/` | Modified | Re-anchored after the line removal shifted their targets |
| `.skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md` | Modified | Rewritten around the skill edition |
| `.skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-templates.md` | Modified | `version` kept on the `SKILL.md` template only |
| `.skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py` | Modified | Two-column File tables are checked |
| `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs` | Modified | `runtime/` and `scripts/` bases, `--overlap` advisory |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs` | Modified | Backticked path report, whole piped report |
| Playbook and catalog files PC-R7 names | Modified | Stale anchors, paths and texts corrected |
| SKILL.md and a new changelog entry in sk-doc, system-spec-kit, system-skill-advisor, sk-design, system-deep-loop | Modified, Created | One bump each |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each change was dispatched to DeepSeek V4.1 Flash at max effort through cli-pi with a short literal brief, and every diff was reviewed before commit. Each changed behavior got a test that was run against the previous code (exit 1) and the new code (exit 0). The fleet measures were taken before the build, after the line removal and at the end. A five-iteration deep review then ran over the phase's commits; its artifacts are in `review/`.

### Recommendation Ledger

| ID | Status | Proof |
|----|--------|-------|
| DV-R1 | Fixed | `node .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs verify` printed `[verify] 57 files \| ok=57` and exited 0; before the change it exited 1 on all 14 skills |
| DV-R2 | Fixed | `python3 .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py .skilled/skills/sk-doc --check --strict` printed `Result: PASS`; it exits 0 on all 14 skills, and `test_child_doc_without_version_passes_strict` passes |
| DV-R3 | Fixed | `grep -cE 'two-pass\|Run it in CI' .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md` printed 0 |
| DV-R4 | Fixed | `grep -c '^version:' .skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-templates.md` printed 1, the `SKILL.md` template |
| DV-R6 | Fixed | `node --test .opencode/plugins/tests/sk-code-post-edit-quality.test.cjs` printed `pass 43` and `fail 0` |
| PC-R3 | Fixed | `python3 .skilled/skills/sk-doc/scripts/tests/test_validate_catalog_package.py` printed `ALL PASS`, two-column test included, and `python3 .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py` printed 0 fail and 0 warn violations |
| PC-R4 | Fixed | `node --test .skilled/skills/sk-doc/scripts/tests/test-cite-drift-scan.mjs` printed `pass 67` and `fail 0`, including the runtime and scripts base test |
| PC-R5 | Fixed | `node .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs --corpus skills --overlap` printed 22 `cite overlap:` advisory lines and exited 0 |
| PC-R6 | Fixed | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --strict` printed 258 `BACKTICK_PATH_UNRESOLVED` warnings and exited 0 |
| PC-R7 | Fixed | `node .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs --corpus skills` printed `dead=1`, a test fixture, and the catalog validator printed 0 fail and 0 warn violations |
| DV-R5 | Closed | Build nothing, per the research and prevent-overengineering: `gate` already exits 0 on every skill, before and after this phase |
| DV-R7 | Closed | Build nothing, per the research and prevent-overengineering: no changelog entry fails today |
| PC-R1 | Closed | Already built by `020-open-ends-research/006-ci-truth-checks`, so building it again would be prevent-overengineering; `node --test .skilled/skills/sk-doc/scripts/tests/test-cite-drift-gate.mjs` passes |
| PC-R2 | Closed | Already built by `020-open-ends-research/006-ci-truth-checks`, so building it again would be prevent-overengineering; `python3 .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py` passes every package |
| PC-R8 | Closed | Build nothing, per the research and prevent-overengineering |
| PC-R9 | Closed | Build nothing, per the research and prevent-overengineering: one instance is a case, not a pattern |
| PC-R10 | Closed | Build nothing, per the research and prevent-overengineering: the admission check already exists |

### Tests

| Test | Command | Before | After |
|------|---------|--------|-------|
| T1 | `node .skilled/skills/sk-doc/scripts/tests/test-frontmatter-version.mjs` | before: exit 1 | after: exit 0 |
| T2 | `python3 -m pytest -q -p no:cacheprovider .skilled/skills/sk-doc/scripts/tests/test_package_skill_regressions.py` | before: exit 1 | after: exit 0 |
| T3 | `node --test .opencode/plugins/tests/sk-code-post-edit-quality.test.cjs` | before: exit 1 | after: exit 0 |
| T4 | `node --test .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs`, frontmatter version absent | before: exit 1 | after: exit 0 |
| T5 | `node .skilled/skills/sk-doc/scripts/tests/test-root-name-consumer-matrix.cjs` | before: exit 1 | after: exit 0 |
| T6 | `python3 .skilled/skills/sk-doc/scripts/tests/test_validate_catalog_package.py`, two-column table | before: exit 1 | after: exit 0 |
| T7 | `node --test --test-name-pattern=resolve .skilled/skills/sk-doc/scripts/tests/test-cite-drift-scan.mjs` | before: exit 1 | after: exit 0 |
| T8 | `node --test .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs`, backticked paths | before: exit 1 | after: exit 0 |
| T9 | `node --test --test-name-pattern=overlap .skilled/skills/sk-doc/scripts/tests/test-cite-drift-scan.mjs` | before: exit 1 | after: exit 0 |
| T10 | `node --test .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs`, piped report | before: exit 1 | after: exit 0 |
| T11 | `node .skilled/skills/sk-doc/scripts/tests/test-frontmatter-version.mjs`, no build-count column | before: exit 1 | after: exit 0 |
| T12 | `node .skilled/skills/sk-doc/scripts/tests/test-root-name-consumer-matrix.cjs`, no router root mapper | before: exit 1 | after: exit 0 |

T11 and T12 come from the review fixes below. Each test was run with the production file swapped back to its previous commit (before) and then restored (after).

### Deep Review

Five iterations ran over the commits since `0039903bde` through cli-pi with DeepSeek V4.1 Flash at max effort, stop policy max-iterations, covering all four dimensions. Every iteration passed `verify-iteration.cjs` on the first dispatch. The report is `review/review-report.md`: verdict CONDITIONAL, P0 0, P1 1, P2 8. Each finding was reproduced with a command before it was fixed.

| Finding | Sev | Disposition |
|---------|-----|-------------|
| R3-P1-001 bump gate | P1 | Recorded, not built. The orchestrator ruled that the line removal is housekeeping the sk-doc contract owns, so the nine skills touched only by it are not bumped. The ruling and its effect on goal criterion 4 are in the goal log. The finding's downgrade trigger asks for operator approval of that amendment, so this stays open for the operator. |
| R1-P2-001 template required fields | P2 | Fixed in `aa42f00cc6` |
| R1-P2-002 post-edit README scope | P2 | Fixed in `aa42f00cc6` |
| R1-P2-004 stale worked example | P2 | Fixed in `aa42f00cc6` |
| R5-P2-001 out-of-scope sentence wider than the strip | P2 | Fixed in `aa42f00cc6`. The standard now names the child-doc classes it covers and says other files under a skill sit outside the contract. |
| R1-P2-003 dead derivation branch | P2 | Fixed in `12b50960ef` (T11) |
| R4-P2-002 five predicate spellings, unused parameters, unread field | P2 | Fixed in `12b50960ef` |
| R4-P2-001 unused router root mapper | P2 | Fixed in `f10ef8716f` (T12) |
| R3-P2-001 empty ledger | P2 | Fixed by this file |
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Bump only sk-doc for the fleet-wide line removal | The removal is housekeeping that the sk-doc contract owns, so the sk-doc changelog records it. The orchestrator ruled that skills touched only by the removal are not bumped; the four other skills are bumped for their own doc edits. |
| Remove the lines in a separate commit from the engine change | One deterministic script run is easy to review and to revert on its own |
| Keep the engine edits out of the option parsing | Another phase edits `parseArgs` in the same file. The DV-R1 change touched only `inScope()` and `classify()`, and the review fix that removed the unreachable build-count branch stayed out of the parsing lines too |
| Keep the backticked-path check and the overlap verdict report-only | Goal decision D2 |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `frontmatter-version.mjs verify`, per skill | Before: exit 1 on 14 of 14 skills (for example sk-doc 265 of 320 files failed). After: exit 0 on 14 of 14, 57 `SKILL.md` files |
| `frontmatter-version.mjs gate`, per skill | Exit 0 on 14 of 14 before and after |
| `package_skill.py --check --strict`, per skill | Exit 0 on 14 of 14 before and after |
| sk-doc script tests (`run-script-tests.sh`) | PASS before and after |
| `cite-drift-gate.mjs --base origin/main` | Exit 0, `220 older unresolved or past-end citations, not blocking`, 0 new |
| Catalog validator over all packages | PASS, 0 fail and 0 warn violations |
| Playbook validator `--strict` over the fleet | Exit 0 |
| Deep review, five iterations | CONDITIONAL on the one recorded P1; every P2 fixed |
| Root-name consumer matrix, JS and Python | Exit 0, `ALL PASS` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Other sk-doc templates still seed `version` on child docs.** The catalog, playbook and skill reference templates were outside this phase's file list.
2. **The sk-create-frontmatter playbook scenarios about the build count are stale.** They describe the per-doc derivation this phase removed.
3. **Historical citations into stripped docs are not re-anchored.** About 5,400 citations from `specs/` into child docs point one line low now; they are dated records.
4. **258 backticked-path warnings remain.** The check only reports; the paths are left for the owners of each playbook.
5. **Two commit messages carry a wrong warning count.** `660e23f537` says 226 and `fc8b3a97e0` says 225; the full report, measured after the piped-output fix, has 258.
6. **The bump-rule reading still needs the operator.** Goal criterion 4 prints the nine skills touched only by the line removal (R3-P1-001).
7. **Some files outside the contract still carry `version`.** 61 tracked docs, such as `ROUTER.md`, benchmark reports and component READMEs, keep a `version:` line. The standard now says they sit outside the contract.
<!-- /ANCHOR:limitations -->

---
