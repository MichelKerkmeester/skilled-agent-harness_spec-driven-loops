---
title: "Verification Checklist: Doc-Template and Code-README Alignment"
description: "Verification gates for the sk-doc reshape of both changes documents, the 9 code-folder READMEs, and the sk-code-opencode TypeScript standards audit."
trigger_phrases:
  - "doc template code readme alignment checklist"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/008-pi-caching-like-reasonix/010-doc-template-and-code-readme-alignment"
    last_updated_at: "2026-08-09T06:00:25Z"
    last_updated_by: "spec-author"
    recent_action: "Round 3 (2 fresh gpt-5.6-luna agents, pi-cache-optimizer + shared) fact-checked; all green"
    next_safe_action: "None — phase complete"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-08-cli-039-010"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Verification Checklist: Doc-Template and Code-README Alignment

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Meaning | Rule |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P1] Both current changes documents and all 9 folders' real file listings read before dispatch
  Verification: `tasks.md` T001-T002.
- [x] CHK-002 [P1] `sk-create-readme` and `sk-code-opencode` SKILL.md read in full before composing the dispatch
  Verification: `tasks.md` T003.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Both changes documents follow the sk-doc general-README shape exactly
  Verification: read `deep-pi/CHANGES-FROM-UPSTREAM.md:1` and `pi-cache-optimizer/CHANGES-FROM-UPSTREAM.md:1` in full — H1 + blockquote tagline, numbered ALL-CAPS H2s (1. OVERVIEW / 2. CHANGES FROM UPSTREAM / 3. VERIFICATION / 4. RELATED RESOURCES), horizontal-rule separators, no ToC, no anchor comments.
- [x] CHK-011 [P0] No fact from the 009-verified base was lost or altered in the reshape
  Verification: a sentence-level diff review between the pre-rewrite snapshot and the final file for both documents found only expected structural artifacts of the reshape (list-to-table, added tagline/Related section); zero facts dropped or altered.
- [x] CHK-012 [P0] All 9 code-folder READMEs follow the sk-doc Section 6 shape and cite only real files/exports
  Verification: 9/9 folders read in full; 15/15 spot-checked technical claims (export lists, hook registrations, env var names, import boundaries), confirmed accurate against `deep-pi/extensions/deeppi/hashlines.ts:31` and `deep-pi/extensions/deeppi/stats.ts:12`, among others. Re-verified against `sk-doc`'s own validator after the user questioned whether the template was really used: `validate_document.py` reports `✅ VALID, Total issues: 0` on all 9 — no rework needed.
- [x] CHK-013 [P0] Every code-standards finding cites a real file/line and a real named standard
  Verification (Round 1): 5/5 applied fixes confirmed present in final source, e.g. `deep-pi/extensions/deeppi/hashlines.ts:284` (`catch (err: unknown)`) and `pi-cache-optimizer/tests/ownership-composition.test.ts:9` (`.js` import specifier); 4/4 noted-but-not-fixed findings cite an exact file/line and standard.
  Verification (Round 2, deeper pass on all `deeppi/` files, `deeppi.ts`, `live-benchmark.mjs`, `tests/` per user direction to cover comments/structure): all 7 `deeppi/`-tree files and `deeppi.ts` read in full and confirmed accurate — module headers, TSDoc on every exported symbol, `stats.ts`'s `buildByModel`/`MODEL_IDS` refactor preserves the exact same export surface (18 exports, same names/signatures) and the same 2-model output; `stormbreaker.ts`'s task-labelled comment removed with no ID/reference left in its place; `review2.test.ts`'s ephemeral `Finding 1-4` comments replaced with durable technical descriptions.
  Verification (Round 3, `pi-cache-optimizer/index.ts` + `tests/` + `shared/composition/one-owner.ts`, the extension Round 2 never covered): `index.ts`'s export surface and all 7 hook registrations diffed against the original committed fork (`git show 19ac4a458d:...index.ts`) and confirmed byte-identical; function body unchanged except an added `: void` return type. 131 remaining double-quote occurrences spot-checked and confirmed to be legitimate content (regex literals, message strings), not missed formatting.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Every code-standards fix is verified not to change behavior
  Verification: both forks' full test suites and typechecks re-run after Round 1, Round 2, and Round 3 — 81/81 and 34/34 passing every time, both typechecks clean. Round 3 additionally surfaced and root-caused one transient typecheck failure caused by two dispatches concurrently editing the same TypeScript project (see `tasks.md` T018); the true final-state rerun is clean.
- [x] CHK-021 [P0] `npm test`/`npm run typecheck` pass in both forks from the final state
  Verification: real command output recorded in `implementation-summary.md`.
- [x] CHK-022 [P0] `git status --porcelain` shows only the intended changes
  Verification: real command output recorded in `implementation-summary.md`; the same externally-caused stray artifact (`.pi/deep-pi-stats.json`, an ambient Pi process) reappeared after Round 1, Round 2, and Round 3 and was removed each time (see `tasks.md` T010, T015, T020).
- [x] CHK-023 [P0] `validate.sh --recursive --strict` still passes the whole `039` packet
  Verification: real command output recorded in `implementation-summary.md`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] All 5 requirements (REQ-001 through REQ-005) addressed
  Verification: REQ-001/002/003 verified against real source (see CHK-010 through CHK-013); REQ-004/005 verified via test/typecheck rerun and git status sweep.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P1] No credential, token, or secret material introduced in any new document or code change
  Verification: `grep -rnE` for assigned-secret patterns across all new/changed files — zero matches.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Neither changes document nor any code-folder README uses internal phase/packet IDs
  Verification: read all 11 final documents — only "Round 1/2/3" labels used, no phase/packet identifiers.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No stray scratch/temp file left outside the scratchpad
  Verification: final repo-wide `git status --porcelain` sweep, unfiltered — clean after removing one externally-caused artifact (see `tasks.md` T010).
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 4 | 4/4 |
| P2 Items | 0 | 0/0 |

**Status**: Complete — all 12 gates resolved.
<!-- /ANCHOR:summary -->
