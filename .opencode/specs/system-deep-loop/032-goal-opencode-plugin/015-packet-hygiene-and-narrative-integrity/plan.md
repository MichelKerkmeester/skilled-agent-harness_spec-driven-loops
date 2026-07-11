---
title: "Implementation Plan: Phase 15: packet-hygiene-and-narrative-integrity"
description: "Recalibrate the SECTION_COUNTS and ANCHORS_VALID validators first, then reconcile phase 010-014 status/metadata, correct the rename and fingerprint narrative, repair cross-references, and re-run strict validation across the packet."
trigger_phrases:
  - "packet hygiene and narrative integrity plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/032-goal-opencode-plugin/015-packet-hygiene-and-narrative-integrity"
    last_updated_at: "2026-07-03T07:30:48Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored plan from spec.md and dossier findings"
    next_safe_action: "Author tasks.md from this plan"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/rules/check-section-counts.sh"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "032-phase-015-packet-hygiene-20260703"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 15: packet-hygiene-and-narrative-integrity

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash (`check-section-counts.sh`) and TypeScript (`orchestrator.ts`, compiled to `mcp_server/dist`) plus Markdown/YAML spec-folder docs and JSON metadata |
| **Framework** | None - flat shell rule script sourced by `validate.sh`, a compiled validation orchestrator module, plus direct doc edits |
| **Storage** | `description.json`/`graph-metadata.json` flat files at each spec-folder root |
| **Testing** | Existing shell/vitest threshold tests under `.opencode/skills/system-spec-kit/scripts/tests/` and `mcp_server/tests/`; `validate.sh --strict` as the acceptance gate |

### Overview
Two validator rules are independently miscalibrated. `check-section-counts.sh`'s `min_scenarios` threshold (2 for Level 1) counts literal `**Given**` markers, which the current lean Level-1 template no longer includes by default — reproduced live today on phases 011/012/013 and on unrelated packet `system-speckit/028`'s phase 011/012. The H2-count minimums (`_section_expected_spec_h2`/`_section_expected_template_h2`) are already correctly calibrated (fallback 7 matches the live 7-section template); only the acceptance-scenario minimum is miscalibrated. Separately, `orchestrator.ts:75` hardcodes `OPTIONAL_TEMPLATE_ANCHORS = new Set(['affected-surfaces'])` while the newer `template-structure.js` helper dynamically derives a larger optional set per level (Level-2 adds `nfr`/`edge-cases`/`complexity` in spec.md and `phase-deps`/`effort`/`enhanced-rollback` in plan.md) — the two never got reconciled, so `ANCHORS_VALID` false-errors on every real Level-2 packet. Both fixes lower/align a threshold to match already-correct shipped behavior; neither adds new abstraction. Everything else in this phase is direct, evidence-cited doc editing: status rows, phase-count labels, the rename narrative (using the git-verified commit lineage as ground truth), fingerprint recomputation (013's own direct-edit-and-hash approach, not a new script), and cross-reference repairs to the archived review/research folders.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md, sourced from the four-reviewer audit dossier's sections C/D and Validator finding)
- [x] Success criteria measurable (SC-001 through SC-005)
- [x] Dependencies identified (none - this phase runs first among 015-021 by design)

### Definition of Done
- [ ] All acceptance criteria met (REQ-001 through REQ-010)
- [ ] Validator threshold test updated and passing; `ANCHORS_VALID` regression test added and passing
- [ ] `validate.sh --strict` returns Errors: 0 across ALL existing 032 phase folders (010-014, plus this phase itself)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Direct doc/rule editing against evidence gathered from the audit dossier and live `validate.sh` reproduction. No new abstraction, no new scripts.

### Key Components
- **`check-section-counts.sh`'s `run_check()`**: sourced by `validate.sh`; the `min_scenarios`/`min_requirements` case statement (declared-level switch) is the exact miscalibration site (VAL-1).
- **`.opencode/skills/system-spec-kit/scripts/tests/` threshold test**: whichever fixture asserts the current (miscalibrated) minimums; update it in lockstep with the rule so the test still pins real behavior.
- **`orchestrator.ts:75`'s `OPTIONAL_TEMPLATE_ANCHORS`**: hardcoded single-anchor set; the exact miscalibration site for VAL-2. `template-structure.js`'s dynamic optional-anchor derivation is the source of truth it should align to (single-source-of-truth preferred over a second hardcoded list).
- **`mcp_server/dist/lib/validation/orchestrator.js`**: compiled output consumed at runtime; must be rebuilt after the `.ts` fix or the fix is invisible to `validate.sh`/the MCP server.
- **Phase 010-014 spec-folder docs**: status rows, phase-count labels, fingerprints, cross-references - direct Edit-tool patches, each cited to its dossier finding ID.
- **Parent `spec.md`/`timeline.md`/`before-vs-after.md`/`changelog/`**: narrative-correction targets for PKT-5/PKT-6.
- **`backfill-graph-metadata.ts`**: existing graph-metadata regeneration script (`.opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts`), run after the doc fixes so `derived.status` and freshness fields reflect the corrected content rather than being hand-edited.

### Data Flow
No runtime data flow changes. `validate.sh` sources `check-section-counts.sh` per spec folder at gate time; recalibrating the rule changes only what threshold the same live counts are compared against. The compiled validation orchestrator is consulted for `ANCHORS_VALID`; aligning its optional-anchor set changes only which anchors it treats as optional, not how anchors are detected. Doc edits are read-modify-write on Markdown/YAML frontmatter and JSON metadata files, each verified independently after the edit.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/system-spec-kit/scripts/rules/check-section-counts.sh` | Computes `min_scenarios`/`min_requirements`/H2 minimums per declared Level | Recalibrate `min_scenarios` (and `min_requirements` if also miscalibrated) to the lean template's real baseline | `validate.sh --strict` on a fresh scaffold and on 010-014 shows zero `SECTION_COUNTS` warnings |
| `.opencode/skills/system-spec-kit/scripts/tests/` (threshold test for section counts, exact file TBD at implementation time via `rg`) | Pins the current (miscalibrated) minimums | Update expected values to match the recalibrated rule | Test passes against the recalibrated rule; still fails against a deliberately-thin doc |
| `.opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts:75` | Hardcodes `OPTIONAL_TEMPLATE_ANCHORS = new Set(['affected-surfaces'])` | Align with `template-structure.js`'s dynamic Level-2 optional-anchor derivation (`nfr`/`edge-cases`/`complexity` in spec.md; `phase-deps`/`effort`/`enhanced-rollback` in plan.md) | `ANCHORS_VALID` passes on a template-conformant Level-2 packet |
| `.opencode/skills/system-spec-kit/mcp_server/dist/lib/validation/orchestrator.js` (+ `.d.ts`/`.map`) | Compiled output consumed at runtime | Rebuild dist after the `.ts` fix | Compiled `.js` contains the corrected anchor set (grep or diff the build output) |
| New regression test under `.opencode/skills/system-spec-kit/mcp_server/tests/` (or `scripts/tests/`, exact location TBD via `rg` for existing `ANCHORS_VALID`/orchestrator test coverage) | No existing test pins the optional-anchor set | Add a test asserting a template-conformant Level-2 packet passes `ANCHORS_VALID` | Test fails against the pre-fix hardcoded set, passes post-fix |
| `010-security-and-correctness-fixes/spec.md` (43, 58, 104) | `Status: Draft`; dangling `review/review-report.md` cite | Status -> Complete; cross-ref -> `review_archive/2026-07-01-plugin-implementation-review/review-report.md`; drop "10 of 13" | `grep` for corrected path and status; `validate.sh` on the folder |
| `010-security-and-correctness-fixes/tasks.md` (108) | Dangling `../review/review-report.md` cite | Cross-ref -> archived path | `grep` confirms target file exists at cited path |
| `010-security-and-correctness-fixes/implementation-summary.md` | Verification list skips "Step 2" (106->126) | Renumber for continuity | Visual diff of the numbered list |
| `011-command-surface-normalization/spec.md` (43, 47, 75) | `Status: Draft`; "11 of 13"; repeats false `opencode_goal.md` narrative | Status -> Complete; drop "of 13"; correct narrative to git-verified lineage | `grep` for corrected text; status match across docs |
| `011-command-surface-normalization/implementation-summary.md` (54, 128) | No Status row; repeats false `opencode_goal.md` narrative | Add `Status: Complete` row; correct narrative | `grep -n "opencode_goal.md"` shows only past-tense-correct usage or none |
| `011-command-surface-normalization/tasks.md` (120) | Dangling `../research/iterations/...` cite | Cross-ref -> `research_archive/2026-07-01-plugin-implementation-audit/iterations/...` | `grep` confirms target file exists |
| `012-regression-test-backfill/spec.md` (44, 48) | `Status: Draft`; "12 of 13" | Status -> Complete; drop "of 13" | `grep`/status match |
| `012-regression-test-backfill/tasks.md` (116) | Dangling `../research/iterations/...` cite | Cross-ref -> archived path | `grep` confirms target exists |
| `013-design-fidelity-and-polish/spec.md` (44, 48, 50) | `Status: Draft`; "13 of 13"; "Successor: None (final phase)" | Status -> Complete; drop "of 13"; Successor -> 014 | `grep`/status match; successor field points to real next phase |
| `013-design-fidelity-and-polish/implementation-summary.md` | No Status row; `session_dedup.fingerprint` now stale (reproduced via `validate.sh --strict`: stored `sha256:9975b001...` vs recomputed `sha256:b572221b...`) | Add Status row; recompute fingerprint against current content | `validate.sh --strict` on 013 shows no `CONTINUITY_FRESHNESS` warning |
| `013-design-fidelity-and-polish/tasks.md`, `changelog/changelog-032-013-design-fidelity-and-polish.md` (40) | "packet-wide" fingerprint wording | Correct to "phases 001-008" | `grep -n "packet-wide"` shows corrected scope |
| `007-sk-prompt-goal-enhancement/spec.md` (51), `008-system-spec-kit-integration/spec.md` (57) | "7 of 7", "8 of 8" | Drop totals, "Phase N" only | `grep -rn "of 7\|of 8"` returns zero hits in these files |
| `009-speckit-command-goal-prompt-offer/handover.md` (95) | Cites non-existent `.opencode/commands/goal.md` | Point at live `goal_opencode.md` | File existence check; `timeline.md:84` claim becomes accurate |
| `009-diagnostic-review/review-report.md` or a new pointer note in that folder | Cites `review/iterations/...`/`review/deltas/...`, which now hold an unrelated later audit | Add explicit pointer to this folder's own actual artifacts (`iterations/`, `deltas/`, `deep-review-*` files already present locally) | Folder is self-contained; no reader needs to chase a stale external path |
| `../spec.md` (parent, 185, 25, phase-map row 9) | "packet-wide" fingerprint claim; `sha256:0000...` placeholder; "Pending" vs "in progress" wording clash | Correct scope wording; refresh placeholder if still present; align row-9 wording with spec.md:47 | `grep` for corrected text |
| `../timeline.md` (30, §6) | False `opencode_goal.md` rename narrative | Correct to git-verified lineage | `grep -n "opencode_goal"` shows no false-intermediate claim |
| `../before-vs-after.md` (49, 61, 193) | "renamed twice" vs "renamed three times" wobble; false `opencode_goal.md` narrative; false "goal.md never actually shipped" claim | Reconcile to "three times"; correct narrative; drop the never-shipped claim | `grep` for corrected text; internal consistency between §3/§10 |
| `.opencode/skills/system-spec-kit/references/config/hook_system.md` (125) | Claims mk-goal lifecycle handlers cover "compaction" | Remove/qualify the word | `grep -n "compaction"` context matches actual handled events (session.created/status/idle/deleted, message.updated, permission.\*, question.\*, \*.disposed) |
| `.opencode/skills/system-skill-advisor/manual_testing_playbook/manual_testing_playbook.md` (192) | Link text `007-goal-opencode-plugin.md` vs actual file `goal-opencode-plugin.md` | Fix link text | `grep -n "007-goal-opencode-plugin.md"` returns zero hits; href still resolves |
| `.opencode/skills/system-skill-advisor/feature_catalog/hooks-and-plugin/goal-opencode-plugin.md` (58-66) | Validation table omits `mk-goal-export-contract.test.cjs` | Add the missing test row | Table lists all live plugin test files |
| `../graph-metadata.json` (parent) | `derived.status` may lag corrected phase statuses | Regenerate via `backfill-graph-metadata.ts` after doc fixes land | Script output / diff review |

Required inventories:
- Same-class producers: `rg -n "of 7 |of 8 |of 9 |of 13 " .opencode/specs/system-deep-loop/032-goal-opencode-plugin/0*/spec.md` — confirm the exact set of phase-count self-labels before editing.
- Consumers of changed symbols: `rg -n "opencode_goal\.md|packet-wide" .opencode/specs/system-deep-loop/032-goal-opencode-plugin` — confirm the full set of PKT-5/PKT-6 narrative locations before editing, since the dossier's list may not be exhaustive (011 spec.md:75 was found this way, beyond the dossier's originally cited locations).
- VAL-2 consumers: `rg -n "OPTIONAL_TEMPLATE_ANCHORS|optionalAnchors" .opencode/skills/system-spec-kit` — confirm `orchestrator.ts` is the only hardcoded copy and there is no second consumer of the stale set before editing; confirm the `mcp_server/dist` build command before rebuilding.
- Matrix axes: (a) which phase docs need a Status-row add vs a Status-value fix vs both; (b) which of 010/011/012 cross-references point at the review archive vs the research archive; (c) fresh-scaffold vs padded-doc `SECTION_COUNTS` behavior before/after recalibration; (d) Level-1 vs Level-2 vs Level-3 optional-anchor sets for `ANCHORS_VALID` before/after recalibration.
- Algorithm invariant: the recalibrated `min_scenarios`/`min_requirements` must not silently pass a doc with zero real acceptance criteria (REQ-*) or zero real scope description — verify against a deliberately empty scaffold still failing some other check (e.g., `SECTIONS_PRESENT`/required-file checks) if the section-count floor alone is lowered. The aligned `OPTIONAL_TEMPLATE_ANCHORS` must not silently mark a REQUIRED anchor optional — verify against a scaffold missing a genuinely required anchor still failing `ANCHORS_VALID`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Validator Calibration + Test (VAL-1, VAL-2, REQ-001, REQ-002)
- [ ] Confirm the exact live SECTION_COUNTS miscalibration via `validate.sh --strict --verbose` against phases 011/012/013 and a fresh scaffold (already reproduced: `min_scenarios=2` requires literal `**Given**` markers the lean template omits)
- [ ] Recalibrate `min_scenarios` (and audit `min_requirements`) in `check-section-counts.sh` to the lean template's real baseline
- [ ] Update the matching threshold test under `scripts/tests/` in lockstep
- [ ] Re-run `validate.sh --strict` against 010-014 and the fresh scaffold, confirm zero `SECTION_COUNTS` warnings without padding any document
- [ ] Confirm the exact live ANCHORS_VALID miscalibration by re-running `validate.sh --strict` against `anobel.com/002-link-card-button-and-mobile-animation` and 032's own in-flight phase 016 Level-2 docs
- [ ] Align `orchestrator.ts:75`'s `OPTIONAL_TEMPLATE_ANCHORS` with `template-structure.js`'s Level-2 optional-anchor derivation
- [ ] Rebuild `mcp_server` dist and confirm the compiled output reflects the aligned set
- [ ] Add a regression test pinning a template-conformant Level-2 packet passing `ANCHORS_VALID`; re-run `validate.sh --strict` against both reproduction cases, confirm zero false anchor errors

### Phase 2: Status / Metadata Reconciliation (PKT-1, PKT-2, PKT-3, PKT-4, PKT-10, PKT-12)
- [ ] Fix 010/011/013 spec.md `Status: Draft` -> `Complete`; add missing Status rows to 011/013 implementation-summaries and 014's spec.md
- [ ] Drop "N of M" phase-count labels in 007/008/010/011/012/013 spec.md; fix 013's false final-phase successor claim
- [ ] Remove template voice-guide comments and generic `trigger_phrases` from 013's implementation-summary
- [ ] Fix 010's implementation-summary "Step 2" verification-numbering skip
- [ ] Align parent spec.md's phase-map row-9 wording with its own "In Progress" status line

### Phase 3: Narrative Corrections (PKT-5, PKT-6, PKT-8, PKT-9, PKT-11)
- [ ] Correct the false `opencode_goal.md` rename narrative in 011 implementation-summary.md, 011 spec.md, timeline.md, and before-vs-after.md, using the git-verified lineage as ground truth; reconcile the "twice" vs "three times" wobble
- [ ] Correct the "packet-wide" fingerprint overclaim in parent spec.md, root changelog, and before-vs-after.md to its real scope (phases 001-008)
- [ ] Record F-015's disposition (subsumed by DR-001's compact-fallback remedy, `mk-goal.js:1568-1576`) and DR-013-P1-001's tracked-deferral target (deep-loop-runtime track)
- [ ] Fix `009-speckit-command-goal-prompt-offer/handover.md:95`'s stale command reference

### Phase 4: Fingerprints + Cross-Reference Repairs (PKT-6, PKT-7, PKT-13, DOC-1, DOC-2)
- [ ] Recompute real `session_dedup.fingerprint` values for phases 009-014 (and refresh 013's, now stale) using the same direct-edit-and-hash mechanism phase 013 used for phases 001-008
- [ ] Repair 010 spec.md/tasks.md and 011/012 tasks.md dangling cross-references to the review/research archive paths
- [ ] Add a pointer note in `009-diagnostic-review/` directing to its own actual artifact locations
- [ ] Qualify `hook_system.md:125`'s "compaction" claim; fix `manual_testing_playbook.md:192`'s link text; add the missing test row to the feature-catalog validation table

### Phase 5: Verification
- [ ] Regenerate parent `graph-metadata.json` via `backfill-graph-metadata.ts` after the doc fixes land
- [ ] Run `validate.sh --strict` against every existing 032 phase folder (010 through 014, plus this phase's own folder) and confirm `Errors: 0` on each
- [ ] Grep-confirm zero remaining instances of the false rename narrative, the "packet-wide" overclaim, the stale fingerprint placeholder (009-014), and the stale phase-count labels
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Regression | Section-count threshold test under `scripts/tests/` | Existing test runner for that fixture |
| Regression | New `ANCHORS_VALID` test pinning a template-conformant Level-2 packet | `mcp_server/tests/` (or `scripts/tests/`) runner |
| Regression | `validate.sh --strict` against every 032 phase folder (010-014, 015) | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <folder> --strict` |
| Cross-track regression | `validate.sh --strict` against unaffected packets (`system-speckit/028` phase 011/012 for VAL-1; `anobel.com/002-link-card-button-and-mobile-animation` for VAL-2) to confirm each recalibration also un-blocks other packets | Same validator, different folders |
| Manual | Grep-verification of every corrected narrative, fingerprint, and cross-reference location | Direct file inspection via `grep -n` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| None | N/A | N/A | This phase is self-contained; it must complete first among 015-021 but nothing external blocks it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The recalibrated `check-section-counts.sh` lets a deliberately thin doc pass, the aligned `orchestrator.ts` optional-anchor set lets a doc missing a genuinely required anchor pass, or any doc edit introduces a factual error worse than the one it corrected
- **Procedure**: `git checkout -- <path>` on the specific rule file, TS source, rebuilt dist output, or doc; each fix is an independent, surgical edit with no cross-file transaction, so reverting one does not require reverting the others
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->

