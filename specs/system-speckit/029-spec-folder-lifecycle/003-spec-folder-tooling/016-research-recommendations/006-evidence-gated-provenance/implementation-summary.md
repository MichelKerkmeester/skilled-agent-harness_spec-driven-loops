---
title: "Implementation Summary"
description: "Phase 6: evidence-gated-provenance is complete. A template header is written only on an exact anchor match for the document's level, and check-template-staleness.sh --auto-upgrade and quality-audit.sh --fix are retired with a loud exit 2."
trigger_phrases:
  - "evidence gated provenance implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/016-research-recommendations/006-evidence-gated-provenance"
    last_updated_at: "2026-10-08T12:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Built, reviewed and verified the phase"
    next_safe_action: "Commit with wave 2"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs"
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/check-template-staleness.sh"
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/quality-audit.sh"
      - ".skilled/skills/system-spec-kit/templates/MIGRATION.md"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/heal-provenance.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bd2aa56c-623b-43f8-a2ef-69a13c32d626"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-evidence-gated-provenance |
| **Status** | Complete |
| **Completed** | 2026-10-08 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase is **complete**. Built in wave 2, reviewed once read-only by Luna, and verified by the orchestrator. No tool on the upgrade path now writes or bumps a template header without an exact match between the document's anchors and the anchors its level renders.

- `heal-spec-docs.cjs` lost `TEMPLATE_SIGNATURES` and `matchesSignature`. A new `provenMarker` reads the level from spec.md (the `SPECKIT_LEVEL` marker, then the metadata-table row, then the frontmatter `level:` key), loads the level's template contract and compares the document's anchors with the required and optional anchors together. It stamps only on equality, and the header it writes is the `SPECKIT_TEMPLATE_SOURCE` line that level's template renders. A superset, a subset, a missing level or an unresolved contract is refused with a named reason, and a document that already carries any marker keeps that marker as it is.
- `check-template-staleness.sh --auto-upgrade` prints "--auto-upgrade was removed, use upgrade-legacy" to stderr and exits 2 while the arguments are parsed. The `AUTO_UPGRADE` variable, the `sed -i ''` version bump and the usage text for the flag are gone.
- `quality-audit.sh` lost its `--fix` branch, which was the only in-repo caller of the flag. `--fix` now prints "--fix was removed, use upgrade-legacy" and exits 2.
- `MIGRATION.md` has a new section 4, "NEVER INVENT PROVENANCE". The extension process link moved to section 5.
- `heal-provenance.vitest.ts` holds four cases: the `--auto-upgrade` refusal, the `--fix` refusal, the exact stamp with superset, subset and level-less refusals, and a plan whose level sits only in frontmatter.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs` | Modify | Stamp only on an exact match against the level's rendered anchor set |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/check-template-staleness.sh` | Modify | Retire `--auto-upgrade` with a loud exit 2 |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/quality-audit.sh` | Modify | Remove the dead `--fix` branch and refuse the flag |
| `.skilled/skills/system-spec-kit/templates/MIGRATION.md` | Modify | State the never-invent-history rule |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/heal-provenance.vitest.ts` | Create | Pin the retired flags and the exact-anchor stamp |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Wave 2 built the phase from `tasks.md`, one task per brief, with the diff checked before the next brief. The build record logs the build as DSO and the review as Luna; the goal names DeepSeek V4.1 Flash through cli-pi and Luna through cli-codex read-only (D5 and D6).

### Review

Luna reviewed read-only in one round and raised four findings.

| Finding | Class | Outcome |
|---------|-------|---------|
| F1: a packet that records its level only as a YAML `level:` key was read as level-less, so the healer refused it | P1 | Applied. `declaredLevel` now reads the frontmatter key in the validator's precedence, and a fourth test pins it |
| F2: the healer's gate grammar did not match the renderer's case rules | P1 | Applied. The grammar now matches `evaluateTemplateGate`: operators case-insensitive, level atom case-sensitive |
| F3: the retired-flag fixture held no old marker, so an unchanged file proved only that nothing was created | P2 | Applied. The fixture plan carries a `plan-core \| v1.0` marker and must stay byte-identical |
| F4: no test pins the MIGRATION.md prose | P2 | Not applied. AC-004 is verified by grep, and a test over prose is low value |

After the fixes, the build record shows `heal-provenance` plus `create-root-numbering` at 19 passed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Decisions

| Decision | Status |
|----------|--------|
| Retire or restrict --auto-upgrade | Decided 2026-10-08 by the operator: retire, with a one-release "removed, use upgrade-legacy" exit 2. Built as decided |
| Marker for unknown provenance | Decided 2026-10-08 by the operator: none. Built as decided |
| `quality-audit.sh --fix` | Deviation from the plan's either-or: the branch is removed and the flag also exits 2 with a pointer, instead of staying silently accepted or being repointed. Recorded in spec.md section 10 |
| `matchesSignature` | Deviation from the task wording "change to exact equality": the function and its fixed header table are deleted, and `provenMarker` reads the header from the rendered template |
| Reuse of the renderer | Deviation from the plan's "reuse": the healer reuses the template contract, but `evaluateTemplateGate` and `renderManifestTemplate` are not exported from `template-structure.js`, so it carries a local copy of the gate walk |
| REQ-003 and AC-003 scope | Clarified: they cover old-marker documents and markerless documents that fail the exact check. A markerless document that matches exactly is still named, as REQ-001 and the edge cases say. The AC-003 Given clause was reworded to say so |
| AC-005 search command | Corrected: the original `rg "auto-upgrade" .skilled` also matches unrelated text, so the row now searches for the flag itself, `--auto-upgrade` |
| Files to Change | The test file was added to spec.md, since the goal lets the builder write its tests |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash check-template-staleness.sh --auto-upgrade` | Prints `--auto-upgrade was removed, use upgrade-legacy`, exit 2 |
| `bash quality-audit.sh --fix` | Prints `--fix was removed, use upgrade-legacy`, exit 2 |
| `rg -n "auto-upgrade" quality-audit.sh` | No hit, rg rc 1 |
| `bash -n` on both scripts | rc 0 each |
| `rg -n -- '--auto-upgrade'` outside `specs/`, ignore files off | 6 hits: `MIGRATION.md:55`, `check-template-staleness.sh` lines 15, 39 and 58, `heal-provenance.vitest.ts` lines 118 and 123. None is a call |
| `heal-provenance.vitest.ts`, rerun from the skill root with `--config vitest.config.ts` | `Tests 4 passed`, rc 0 |
| Same file against the HEAD healer, from the build record | The stamp case failed (1 failed, 2 passed at that point) |
| `heal-provenance` plus `create-root-numbering`, rerun | 20 passed, 4 in this phase's file and 16 in `create-root-numbering.vitest.ts`. The build record shows 19 after the review fixes, and also shows phase 016 adding a pin case to `create-root-numbering.vitest.ts`, so the pair's total moved after this phase's review |
| Scratch trace through the real healer, copy removed afterwards | Old-marker plan byte-identical. Markerless plan with a subset of the anchors byte-identical. Markerless plan with exactly the level's anchors named `plan-core \| v2.2`. For `spec.md`, `plan.md`, `tasks.md` and `implementation-summary.md`, an exact Level 2 copy was named and a copy with one extra anchor stayed unmarked |
| `rg SPECKIT_TEMPLATE_SOURCE` over `runtime/` for writers | The healer (now gated) and the removed staleness bump are the only tools that touch an existing document; the others build a new document or only read the marker |
| `npm --prefix .skilled/skills/system-spec-kit/runtime/cli test`, wave 2 full gates | rc 0; 167 files passed and 3 skipped, 1,682 tests passed and 19 skipped. Wave 1 final was 162 files and 1,648 tests; the baseline was 161 files and 1,639. Legacy suites 12/0 and 2/0, validation 12/0 |
| `npm --prefix .skilled/skills/system-spec-kit/runtime/cli run check` and CLI typecheck | rc 0 each |
| `node --test runtime/tests/hooks/*.test.mjs` | 184 tests, 181 pass, 0 fail |
| `validate.sh --strict` on this folder | `RESULT: PASSED` |

The cli suite count covers all of wave 2, so its rise over the baseline is shared with the other wave 2 phases.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Follow-ups Outside This Phase

- The Vitest file pins `plan.md` only. The healer's behaviour on `spec.md`, `tasks.md` and `implementation-summary.md`, and on an old-marker document, was observed in a scratch trace and is not pinned by a test. A table-driven case over the four document types would close it.
- The healer carries its own copy of the gate walk because `evaluateTemplateGate` and `renderManifestTemplate` are not exported. If the template gate grammar changes, the copy has to change with it. Exporting the two functions and importing them would remove the copy.
- No dry run of the healer over the real `specs/` corpus was recorded for this phase, so the change in how many documents it now stamps is unmeasured.
- Whether any script outside this repository passes `--auto-upgrade` or `--fix` is still unknown. Such a script now fails with exit 2 and a pointer. The two shim lines (`check-template-staleness.sh:39`, `quality-audit.sh:32`) are meant to last one release, and this packet does not record which release drops them.
<!-- /ANCHOR:limitations -->

---
