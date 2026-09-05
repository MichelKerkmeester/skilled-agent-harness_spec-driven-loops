---
title: "Acceptance Criteria: Phase 6: orphaned-types-and-dead-modules"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-decommission-debt-fixes/006-orphaned-types-and-dead-modules"
    last_updated_at: "2026-09-05T09:30:00Z"
    last_updated_by: "claude"
    recent_action: "Deleted 6 orphans, fixed 2 tests and 1 catch, deduped ROOTS"
    next_safe_action: "Run repair-derived.cjs --apply then revalidate --strict"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/shared/types.ts"
      - ".opencode/skills/system-spec-kit/shared/index.ts"
      - ".opencode/skills/system-spec-kit/runtime/lib/description/README.md"
      - ".opencode/skills/system-spec-kit/runtime/tests/resource-map-extractor.vitest.ts"
      - ".opencode/skills/system-spec-kit/scripts/spec-folder/alignment-validator.ts"
      - ".opencode/skills/system-spec-kit/scripts/check-markdown-links.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-05-054-006-orphaned-types-and-dead-modules"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 6: orphaned-types-and-dead-modules

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/054-decommission-debt-fixes/006-orphaned-types-and-dead-modules
**Level:** 2
**Status:** Complete
**Date:** 2026-09-05
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the seven `shared/types.ts` symbols and the two runtime modules, When each is resolved (deleted or kept), Then a grep proof or a stated reason exists for every one | All nine (7 types + 2 modules) deleted; `rg -n "IVectorStore\|SearchOptions\|SearchResult\|StoreStats\|DatabaseExtended\|PreparedStatement" . --glob '*.ts' -g '!node_modules' -g '!dist'` and `rg -n '\bDatabase\b' shared/types.ts shared/index.ts` both zero hits; `rg -n "rollout-policy\|description/repair" . --glob '*.ts' -g '!node_modules' -g '!dist'` zero hits | Met | - |
| AC-002 | REQ-002 | Given `completion-state.test.mjs` and `resource-map-extractor.vitest.ts`, When `vitest run` executes, Then both appear in the executed-file list, or both are confirmed deleted | `completion-state.test.mjs` deleted (`find . -iname completion-state.test.mjs` zero hits, repo-wide, excluding node_modules/dist); `resource-map-extractor.vitest.ts` moved to `runtime/tests/`, appears in `npx vitest run runtime/tests/resource-map-extractor.vitest.ts` — 3/3 passed | Met | - |
| AC-003 | REQ-003 | Given `alignment-validator.ts`'s empty catch, When it is reviewed, Then it either logs the caught error or states in a comment why swallowing it is intentional | Code review of the diff: `console.log` now reports `error.message`, no control-flow change; `tsc --noEmit` on `scripts` exits 0 | Met | - |
| AC-004 | REQ-004 | Given `check-markdown-links.cjs`'s deduplicated `ROOTS`, When the script runs, Then its printed `files`/`checked` counts match a manual count of the deduplicated file set | Before: `7897 files, 13484 links checked, 8 broken`. After: `7837 files, 13467 links checked, 8 broken` (same 8-entry broken list). An independent Node re-implementation of `walk()`'s exact current logic over the deduplicated `ROOTS` also yields exactly 7837 files. A naive `find`-based count (7903) diverges only because `walk()`'s pre-existing, out-of-scope `e.isFile()` check silently skips 66 symlinked `.md` files repo-wide (`.claude/commands/**` and several others) — not something this phase's ROOTS-only scope covers; noted as a follow-up in `implementation-summary.md` | Met | - |
| AC-005 | REQ-005 | Given the T001 typecheck baseline, When it is re-run after all six items are resolved, Then it reports the same or fewer errors, and every touched suite passes | `tsc --noEmit` for `shared`/`runtime`/`scripts` all exit 0 before and after (baseline captured T001). Touched suites + regression guards (`description-merge.vitest.ts`, `repair-specimens.vitest.ts`, `resource-map-extractor.vitest.ts`, `env-reference-drift.vitest.ts`, `generated-metadata-integrity.vitest.ts`, `tests/validation/`): 6 files, 43 tests, all passed | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

All five criteria are Met. All six named cleanup items are resolved: seven types and two modules deleted with grep proof; both orphaned tests either fixed-and-wired-in (`resource-map-extractor.vitest.ts`) or deleted-as-stale (`completion-state.test.mjs`); the empty catch now logs; `check-markdown-links.cjs`'s `ROOTS` deduplicated with matching counts. Typecheck and every touched suite pass before and after.
<!-- /ANCHOR:closure -->
