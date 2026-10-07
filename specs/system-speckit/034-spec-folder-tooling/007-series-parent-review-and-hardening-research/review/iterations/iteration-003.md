# Deep Review — Iteration 003: maintainability + active-finding re-verification

**Target:** `specs/system-speckit/034-spec-folder-tooling/006-series-parent-rule-and-sibling-listing` (Level 2, Status Complete)
**Run:** run-001 · generation 1 · session `2026-10-07T05:11:34.566Z`
**Dimension:** maintainability, with traceability corroboration and a full re-check of the ten active registry findings. All four dimensions were covered once in iterations 1–2; this pass widens the maintainability angle and re-verifies instead of re-reporting.
**Method:** read-only. Every prior finding was re-run against HEAD using its registry evidence line; new angles were searched with `rg` over the skill, command and packet docs plus direct reads of the changed runtime and test surfaces. The dispatch bans builds and test execution, so REQ-007's test-pass claim stays assertion-read only.

---

## 1. FILES REVIEWED

Rule docs and command assets:
- `.skilled/skills/system-spec-kit/references/structure/phase-definitions.md:66-90` (series-parent section), `:227` (§4 exception)
- `.skilled/skills/system-spec-kit/references/structure/sub-folder-versioning.md:174-192` (phases-vs-versions)
- `.skilled/skills/system-spec-kit/references/structure/phase-system.md:27-36` (threshold exception)
- `.skilled/skills/system-spec-kit/references/workflows/quick-reference.md:238-274` (§8, §9)
- `.skilled/skills/system-spec-kit/references/workflows/spec-folder-authoring-checklist.md:33-44`
- `.skilled/skills/system-spec-kit/SKILL.md:496-516` (rule 16)
- `AGENTS.md:74-86` (Gate 3 Option C)
- `.skilled/commands/speckit/assets/speckit-plan.yaml:127-139`, `.skilled/commands/speckit/assets/speckit-complete.yaml:185-197`

Runtime and tests:
- `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:380-424` (seeding), `:617` (metadata stub), `:1081-1118` (listing), `:1120-1124` (call site)
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/phrase-judge.mjs:13-130`
- `.skilled/skills/system-spec-kit/runtime/cli/tests/create-root-numbering.vitest.ts:21-146`, `create-track-refresh.vitest.ts:21-183`, `trigger-index.vitest.ts:120-156`

Packet docs (review target):
- `spec.md:1-130`, `plan.md:1-160`, `tasks.md:130-189`, `acceptance-criteria.md:1-80`, `implementation-summary.md:1-120`

Supporting reads for the new sweep:
- `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/phase-system-knowledge-node.md:1-60`
- `.skilled/skills/system-spec-kit/runtime/lib/graph/graph-metadata-parser.ts` (created_at handling), `.skilled/skills/system-spec-kit/README.md:178`, `references/templates/level-selection-guide.md`, `references/templates/level-specifications.md`, `references/retrieval/retrieval-conventions.md`, `runtime/cli/tests/test-phase-command-workflows.js:85-140`

---

## 2. FINDINGS BY SEVERITY

### P0 — none

### P1 — 1 new

#### R3-P1-001 — REQ-003 has a third missed doc: the phase-system knowledge node restates both thresholds with no series-parent exception

- **File:** `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/phase-system-knowledge-node.md:29`
- **Claim:** The feature-catalog knowledge node restates both phase-qualification thresholds verbatim — "phasing is suggested only when both thresholds are met, meaning a phase complexity score of at least 25 out of 50 and a recommended documentation level of at least 3" — and never names the series-parent exception. REQ-003 requires every doc that restates the thresholds to name it. This is a third affected file beyond the two registered in R1-P1-003, and it survived the packet's own threshold-wording sweep that already had to catch one missed doc (`spec-folder-authoring-checklist.md`, `tasks.md:134` CHK-FIX-002).
- **evidenceRefs:**
  - `[SOURCE: .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/phase-system-knowledge-node.md:29]` — restates both thresholds.
  - `[SOURCE: .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/phase-system-knowledge-node.md:15]` — a skill asset (`sk-doc-template: skill_asset_feature_catalog`), not an out-of-tree artifact.
  - Counter-check: `rg -ni "series parent"` over the file returns nothing; a sweep of every skill markdown that states the threshold wording (`rg -l 'complexity score >= 25|Phase complexity score|phase complexity score'` then a `series parent` check) returns exactly this file as the only miss.
- **Counterevidence sought:** line 29 frames the node as the condensed layer over `phase-system.md`, which does name the exception at `:36`, and the source table at `:43-44` lists both updated reference docs. That makes the node a pointer — but its own prose still teaches the threshold-only rule, and retrieval surfaces are consumed standalone.
- **Alternative explanation:** the catalog may be a generated/derived layer whose convention is that only the linked source must carry the exception; if so the fix is regeneration through the catalog pipeline rather than a manual edit.
- **Final severity:** P1 (same unmet P0 requirement and same steering impact as R1-P1-003, new independent fix location).
- **Confidence:** 0.85
- **Downgrade trigger:** if the feature-catalog convention exempts summary nodes that link an updated source doc, collapse to P2 or close as a regeneration artifact.
- **Finding class:** class-of-bug
- **Affected surface hints:** `["feature-catalog knowledge node", "threshold restatements", "catalog regeneration pipeline"]`
- **Recommendation:** add the exception sentence to line 29 (or regenerate the node from `phase-system.md`) and widen the sweep in `tasks.md` CHK-FIX-002 to the feature-catalog tree so the "every doc" claim is verifiable.

### P2 — 1 new

#### R3-P2-001 — 006 `spec.md` scope tables omit `spec-folder-authoring-checklist.md`, which the packet actually modified

- **File:** `specs/system-speckit/034-spec-folder-tooling/006-series-parent-rule-and-sibling-listing/spec.md:76` (In Scope) and `:89-101` (Files to Change)
- **Claim:** The In-Scope bullet that enumerates the docs to be updated names `sub-folder-versioning.md`, `phase-system.md`, `quick-reference.md`, `SKILL.md`, `AGENTS.md` and the two command assets, and the Files-to-Change table repeats that set — neither names `references/workflows/spec-folder-authoring-checklist.md`. The packet did modify it (found by the fix sweep), and `implementation-summary.md:65` records it. The completion record and the scope record disagree about the changed set, so an audit that reads `spec.md` alone cannot reconstruct the change surface.
- **evidenceRefs:**
  - `[SOURCE: specs/system-speckit/034-spec-folder-tooling/006-series-parent-rule-and-sibling-listing/spec.md:76]` — In-Scope doc list without the checklist.
  - `[SOURCE: specs/system-speckit/034-spec-folder-tooling/006-series-parent-rule-and-sibling-listing/spec.md:94]` — Files-to-Change table rows; no checklist row.
  - `[SOURCE: specs/system-speckit/034-spec-folder-tooling/006-series-parent-rule-and-sibling-listing/implementation-summary.md:65]` — checklist recorded as Modified.
  - `[SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-folder-authoring-checklist.md:44]` — the exception line the fix sweep added.
- **Counterevidence sought:** REQ-003 is phrased as "every doc that restates the phase thresholds", so the checklist was always in the requirement's extension; the fix-sweep discovery is legitimate scope completion, and the implementation summary does record it. Only the spec tables were never reconciled.
- **Alternative explanation:** Files-to-Change may be treated as the planned set, with fix-sweep additions living in the summary by design.
- **Final severity:** P2 (record consistency; no behavioral impact).
- **Confidence:** 0.75
- **Downgrade trigger:** if packet convention treats the summary as the canonical changed-set record, this closes as optional doc cleanup.
- **Finding class:** matrix/evidence
- **Recommendation:** add the checklist row to In Scope and Files to Change at close-out, or state that fix-sweep additions are reconciled into `implementation-summary.md`.

---

## 3. PRIOR FINDINGS — RE-VERIFIED AT HEAD (10/10 ACTIVE)

All ten registry findings were re-checked against the exact evidence lines; none was refuted and no drift was found.

| ID | Severity | Status | Evidence at HEAD |
|----|----------|--------|------------------|
| R1-P1-001 | P1 | Active | `[SOURCE: .skilled/skills/system-spec-kit/references/structure/phase-definitions.md:78]` still reads "scaffold the parent with `create.sh --phase`" and the append command is still `create.sh --phase --parent`. |
| R1-P1-002 | P1 | Active | `[SOURCE: .skilled/skills/system-spec-kit/README.md:178]` still reads "Option E: Skip documentation". |
| R1-P1-003 | P1 | Active | `rg -ni "series parent"` over `level-selection-guide.md` and `level-specifications.md` exits 1; widened by R3-P1-001's third file. |
| R1-P2-001 | P2 | Active | `[SOURCE: .skilled/skills/system-spec-kit/references/workflows/quick-reference.md:269]` Option C still omits the series parent that `:243` and `:272` name. |
| R1-P2-002 | P2 | Active | `rg -n "template-default" retrieval-conventions.md` exits 1. |
| R1-P2-003 | P2 | Active | `[SOURCE: specs/system-speckit/034-spec-folder-tooling/006-series-parent-rule-and-sibling-listing/tasks.md:178-180]` still holds `[X]`/`[Y]`/`[Z]`. |
| R2-P2-001 | P2 | Active | `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1109]` still filters `\s` only; ESC bytes pass through to stderr. |
| R2-P2-002 | P2 | Active | `[SOURCE: specs/system-speckit/034-spec-folder-tooling/006-series-parent-rule-and-sibling-listing/acceptance-criteria.md:15]` `last_updated_by: "scaffold"`, `:22` session placeholder, `:24` `completion_pct: 0` against `:44` "Status:** Complete". |
| R2-P2-003 | P2 | Active | `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/create-track-refresh.vitest.ts:147-183]` still holds only the three listing tests; no sub-folder run. |
| R2-P2-004 | P2 | Active | `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:401]` guard and `:421-422` perl block still duplicate the judge's `TEMPLATE_DEFAULT_PHRASES` (`phrase-judge.mjs:25-30`). |

---

## 4. TRACEABILITY CHECKS

Core `spec_code` (status: **partial**):
- REQ-001, REQ-004, REQ-005, REQ-006: met by read against the shipped surfaces; unchanged from iteration 2.
- REQ-002: still unmet (R1-P1-002).
- REQ-003: still unmet; fix scope now provably wider than the two registered docs (R3-P1-001).
- REQ-007: not machine-verifiable in a read-only dispatch; assertions read only.

Core `checklist_evidence` (status: **partial**):
- AC-001, AC-005, AC-006 evidence cells hold against the committed artifacts.
- AC-002/AC-003 under-scope their searches (R1-P1-002/003 — the R3-P1-001 sweep shows why the "every doc" wording needs the wider pattern).
- AC-004's cited tests do not cover its sub-folder clause (R2-P2-003).
- AC continuity block still contradicts its own completion verdict (R2-P2-002).
- AC-007's 96-test claim stays assertion-read only.

Overlay:
- `skill_agent`: pass — `SKILL.md:511` rule 16 names the exception; no agent definitions touched by 006.
- `agent_cross_runtime`: notApplicable — no agent mirrors changed.
- `feature_catalog_code`: **partial** — the phase-system knowledge node restates the thresholds without the exception (R3-P1-001); this overlay was previously notApplicable and is now live.
- `playbook_capability`: pass — the manual-testing-playbook documents `--level phase-parent`; unchanged.

---

## 5. RULED OUT / NOT REPRODUCED (this iteration)

- **Listing metadata dependency (`derived.created_at`):** the production input exists — `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:617]` writes `created_at` in the scaffold stub and `[SOURCE: .skilled/skills/system-spec-kit/runtime/lib/graph/graph-metadata-parser.ts:1503]` preserves it on refresh; the 006 and 007 packets' metadata carry it. The test fixtures' hand-written field is not a production-only shape. Not a finding.
- **Label gate permissiveness:** `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js:104-105]` accepts `Option E` as one of several markers and `:128` uses it in an OR. The gate does not require the stale label; recorded as corroborating context for R1-P1-002, not filed separately.
- **Listing window/cap/truncation constants:** `create.sh:1091`, `:1114`, `:1109` hold inline anonymous numbers with no cap boundary test. Advisory-only surface, below the registration bar.
- **Scaffold fixture-harness duplication:** `create-root-numbering.vitest.ts:21-55` and `create-track-refresh.vitest.ts:21-70` carry near-identical bootstrap blocks; two copies only, abstraction deliberately deferred per the two-is-not-a-pattern restraint.

---

## 6. SCOPE VIOLATIONS

None. No out-of-scope read produced a would-be mutation; all writes went to the bound review state paths only.

---

## 7. VERDICT

**CONDITIONAL for this iteration** — one new P1 (R3-P1-001) and one new P2 (R3-P2-001). Per the iteration mapping, any P1 with no P0 resolves to CONDITIONAL.

Cumulative release posture remains **CONDITIONAL**: all three iteration-1 P1 findings were re-verified active at HEAD, and R3-P1-001 widens the REQ-003 remediation scope rather than closing anything. This iteration is the last under the max-iterations stop policy; synthesis should carry the 3 active P1s and 8 active P2s.

Review verdict: CONDITIONAL
