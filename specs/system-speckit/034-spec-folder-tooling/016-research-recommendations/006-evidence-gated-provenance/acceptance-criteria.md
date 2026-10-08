---
title: "Acceptance Criteria: Phase 6: evidence-gated-provenance"
description: "The criteria this packet must satisfy before it may be closed."
trigger_phrases:
  - "evidence gated provenance acceptance criteria"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 6: evidence-gated-provenance

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/034-spec-folder-tooling/016-research-recommendations/006-evidence-gated-provenance
**Level:** 2
**Status:** Complete
**Date:** 2026-10-08
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a document of a known level, When heal-spec-docs compares its anchors, Then it stamps only when the set equals the set rendered for that level | Vitest: exact level match stamps, superset and subset do not. Observed: the case at `.skilled/skills/system-spec-kit/runtime/cli/tests/heal-provenance.vitest.ts:146` builds four Level 2 plans (exact, superset, subset, level-less), the healer prints `packets=4 documents healed=1`, the exact plan gains only the `plan-core \| v2.2` line the level renders and the other three stay byte-identical; the file reports `Tests 4 passed`, rc 0, and the build record shows the stamp case failing against the HEAD healer. The comparison is `provenMarker` at `.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:158` | Met | - |
| AC-002 | REQ-002 | Given `check-template-staleness.sh --auto-upgrade` on a fixture with an old marker, When it runs, Then it prints "removed, use upgrade-legacy", exits 2 and leaves the file byte-identical | Vitest runs the script and compares output, exit code and file hash. Observed: the case at `.skilled/skills/system-spec-kit/runtime/cli/tests/heal-provenance.vitest.ts:118` runs the flag on a fixture whose plan carries a `plan-core \| v1.0` marker and asserts exit 2, "removed, use upgrade-legacy" on stderr and an unchanged content digest of the whole tree; a direct run printed `--auto-upgrade was removed, use upgrade-legacy` with rc 2, from `.skilled/skills/system-spec-kit/runtime/cli/spec/check-template-staleness.sh:39` | Met | - |
| AC-003 | REQ-003 | Given an old-marker document, or a markerless document whose anchors do not equal its level's render, When heal-spec-docs runs, Then no marker is added or bumped | Vitest fixture compares the document before and after. Observed: the refusal fixtures at `.skilled/skills/system-spec-kit/runtime/cli/tests/heal-provenance.vitest.ts:182` to `.skilled/skills/system-spec-kit/runtime/cli/tests/heal-provenance.vitest.ts:184` (superset, subset, level-less) are byte-identical after the run, and the old-marker plan in the staleness fixture stays unchanged. For the healer itself, `.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:255` skips any document that already carries a marker, and a scratch trace of an old-marker Level 2 plan with exact anchors left it byte-identical. No Vitest case runs the healer on an old-marker document, so that half rests on the guard and the trace | Met | - |
| AC-004 | REQ-004 | Given MIGRATION.md, When it is read, Then it states the never-invent-history rule and matches the code | grep for the rule in MIGRATION.md. Observed: `rg -n -i invent MIGRATION.md` prints `51:## 4. NEVER INVENT PROVENANCE`; the section at `.skilled/skills/system-spec-kit/templates/MIGRATION.md:51` says a marker is written only on an exact anchor match, an unmatched document keeps no marker and no marker or comment records unknown provenance, which is what `.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:158` does | Met | - |
| AC-005 | REQ-005 | Given the repo outside specs/, When it is searched, Then no script calls `--auto-upgrade` | `rg -n -- '--auto-upgrade' . --glob '!specs/**' --glob '!**/node_modules/**'` finds only the retired branch, its usage text, its test and the MIGRATION.md sentence. Observed: 6 hits, `check-template-staleness.sh` lines 15, 39 and 58, `heal-provenance.vitest.ts` lines 118 and 123, and `.skilled/skills/system-spec-kit/templates/MIGRATION.md:55`, with ignore files off as well; none is a call. `rg -n "auto-upgrade" quality-audit.sh` finds nothing (rc 1) and `.skilled/skills/system-spec-kit/runtime/cli/spec/quality-audit.sh:32` is the retired `--fix` arm. The retired branch is `.skilled/skills/system-spec-kit/runtime/cli/spec/check-template-staleness.sh:39` | Met | - |
| AC-006 | General | Given this spec packet, When validate.sh --strict runs, Then all pass | bash validate.sh /path --strict shows RESULT: PASSED. Observed: `validate.sh --strict` on this folder prints `RESULT: PASSED`, recorded at `specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/006-evidence-gated-provenance/implementation-summary.md:130` | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes (Complete)

All six criteria are Met, each with evidence observed in the final state. The `--auto-upgrade` decision was made by the operator on 2026-10-08 (retire) and is recorded in spec.md section 10, so no decision record is needed and no row carries a waiver. AC-001 through AC-005 are closed by the code and `heal-provenance.vitest.ts` (4 of 4 pass); the cli suite after wave 2 exits 0 with 1,682 tests passed (baseline 1,639, a count shared with the other wave 2 phases). Two rows were tightened while closing and the changes are logged in implementation-summary.md: the Given clause of AC-003, to match REQ-001 and the spec's exact-match edge case, and the search command in AC-005, which also matched unrelated text. AC-006 is closed by `validate.sh --strict` on this folder.
<!-- /ANCHOR:closure -->

---

