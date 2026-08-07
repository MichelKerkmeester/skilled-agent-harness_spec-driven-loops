---
title: "Implementation Summary: sk-design remediation closeout"
description: "Planned status record for the five items 007-consolidation-remediation left open. Nothing has been executed; this document exists to carry the packet's continuity metadata, not to claim delivery."
trigger_phrases:
  - "sk-design remediation closeout summary"
  - "styles sha256 verification summary"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/008-remediation-closeout"
    last_updated_at: "2026-07-27T09:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Executed Phases 1-4 (styles, benchmark, 006-warning, --level fix); Phase 5 Planned"
    next_safe_action: "Await operator go/no-go on Phase 5; separately triage pre-existing vitest lock-retry failure"
    blockers:
      - "Phase 5 requires an explicit operator go/no-go before any file is restored"
    key_files:
      - ".opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/scratch/styles.sha256.before"
      - ".opencode/skills/system-spec-kit/mcp-server/lib/search/folder-discovery.ts"
      - ".opencode/skills/system-spec-kit/mcp-server/lib/validation/spec-doc-structure.ts"
      - ".opencode/skills/sk-design/manual-testing-playbook/hub-manager-intake/design-mode-pairing-before-run.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-008-remediation-closeout-session"
      parent_session_id: null
    completion_pct: 80
    open_questions:
      - "Restore the eleven AI-tell fixture pairs, ai-fingerprint-registry.json, and the two parity scripts (not the rubric)? Recommendation on record: yes. Awaiting operator go/no-go."
    answered_questions: []
---
# Implementation Summary: sk-design remediation closeout

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-remediation-closeout |
| **Status** | In Progress — Phases 1-4 executed and verified; Phase 5 remains Planned, operator-gated |
| **Completed** | Phases 1-4: 2026-07-27. Phase 5: not started. |
| **Level** | 2 |
| **Actual Effort** | Not separately tracked against the `plan.md` §L2 estimate; all four executed phases completed in one pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Four of the five items this packet planned were executed and verified. **Phases 3 and 4 modified shared spec-kit tooling with repo-wide blast radius, not sk-design-local code** — both fixes affect every packet in the repository, not only `sk-design/012`.

- **Phase 1 (Styles integrity): PASS.** Recomputed SHA-256 for all 7,812 files against the frozen snapshot `006-design-mode-consolidation/scratch/styles.sha256.before`. Result: 7,811 identical, 1 differing (`styles/README.md`, deliberately shrunk 165,030 → 1,928 bytes during the earlier `007` remediation — not drift). The 1,290-record style corpus is provably untouched.
- **Phase 2 (Benchmark): premise corrected, resolved by investigation, not by regeneration.** There is no live route-gold file in `sk-design/benchmark/` — that directory holds only dated run-record folders (`2026-07-06--*`, `2026-07-07--*`, `baseline`, `compiled-routing`) plus a README. `TV-001`/`SR-002` are `manual-testing-playbook` scenario IDs, and the playbook is the routing gold; it had already been reconciled by `007`. Verified `TV-001` references `audit` only as a legitimate negative control, `SR-002` correctly names two reference-base modes, and the apparent 37-vs-36 scenario-count mismatch is not a defect (36 scenarios + 1 non-scenario doc). One genuine residual was found and fixed: `manual-testing-playbook/hub-manager-intake/design-mode-pairing-before-run.md` claimed `hub-router.json`'s only `bundleRules` entry (`ui-build-bundle`) pairs `interface`+`foundations`; `routerPolicy.bundleRules` is now `[]`, so the file was corrected to say no bundleRules are declared, preserving the scenario's conclusion. No benchmark run was executed — none was needed.
- **Phase 3 (006 validation warning): FIXED, shared tooling.** Root cause: `mcp-server/lib/validation/spec-doc-structure.ts:982` — `parsed.anchors.some(...)` returns `false` unconditionally when zero anchors are present, so any anchor-less research doc warned regardless of citation quality. `research.md`'s 12 `[SOURCE: ...]` prose citations were structurally invisible to the check. Fix: fall back to scanning the whole document body when no anchors are present. Rebuilt `dist`. `006` now validates Errors 0 / Warnings 0. Blast radius is repo-wide — removes a false positive for every deep-research packet with an anchor-less `research.md`.
- **Phase 4 (dropped `level` field): FIXED, shared tooling.** Root cause was one layer downstream of where originally diagnosed: not `generate-description.ts` (which already parses `--level` correctly), but `mcp-server/lib/search/folder-discovery.ts`'s `pickIncomingAuthoredOptionalFields()`, which hand-copied only `title`, `type`, `trigger_phrases`, `path` — a pure omission of `level`, already listed in `DESCRIPTION_KNOWN_AUTHORED_OPTIONAL_KEYS`. Fix: one line at `folder-discovery.ts:247`. Rebuilt `dist`. Proven end-to-end: stripped the field (gone), regenerated with `--level 2` (returned). Blast radius is repo-wide — this is the write path for every packet's `description.json`.
- **Phase 5 (fixture restoration): still Planned, operator-gated.** Unchanged. All 57 deleted files remain recoverable from `b217d74b81^`. Recommendation on record: restore fixtures and the parity check, not the rubric. Requires explicit operator approval before execution.

**Pre-existing defect found, not fixed:** `mcp-server/tests/handler-memory-save.vitest.ts` has a failing test — "retries through a filesystem-backed lock when another process already holds the spec-folder lock." Verified it fails identically with and without the Phase 4 change (1 failed / 14 passed both ways), so it is pre-existing and not a regression introduced by this packet. It sits in shared tooling and nobody is currently tracking it; recorded here as a known issue with a recommendation to triage it separately.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp-server/lib/validation/spec-doc-structure.ts` (`validateSpecDocSufficiency`) | Modify — shared tooling, repo-wide | Phase 3 fix: whole-document-body fallback scan when zero anchors are present |
| `mcp-server/lib/search/folder-discovery.ts` (`pickIncomingAuthoredOptionalFields`) | Modify — shared tooling, repo-wide | Phase 4 fix: forward the already-parsed `level` field |
| `.opencode/skills/system-spec-kit` `dist/` | Rebuild | Rebuilt after Phase 3 and Phase 4 source changes |
| `sk-design/manual-testing-playbook/hub-manager-intake/design-mode-pairing-before-run.md` | Modify | Phase 2 residual: corrected stale `bundleRules` claim (now `[]`) |
| `006-design-mode-consolidation/scratch/styles.sha256.before`, `sk-design/styles/**` | Read only | Phase 1 checksum comparison — no writes |
| `sk-design/design-interface/assets/**`, `ai-fingerprint-registry.json`, two parity scripts | Not touched | Phase 5 not executed |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivered Phase 1 (styles SHA-256, PASS) → Phase 2 (investigation corrected the plan's premise; one residual fixed; no regeneration needed) → Phase 3 (006 warning fixed in shared validator, `dist` rebuilt) → Phase 4 (--level fix in shared picker function, `dist` rebuilt, workspace suite re-run) in one pass, per the ordering in `plan.md` §4. Phase 5 (fixture restoration) was not executed — it remains gated on a recorded operator approval that has not yet been given.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Order phases by cost/confidence rather than strict technical dependency | Phase 1 is a single command that establishes confidence in the corpus the other phases touch; Phase 5 is gated and costliest, so it runs last |
| Root-cause Phase 4 in `pickIncomingAuthoredOptionalFields` (`folder-discovery.ts`), not in `generate-description.ts` | The CLI script already parses and sets `--level` correctly in both its code paths; the drop happens one layer downstream in the shared picker function, confirmed by reading it against `description-schema.ts`'s own field list, which already includes `level` |
| Recommend fixture restoration without the rubric (Phase 5) | Matches the recommendation already on record from `007`; the fixtures are the only fixture-backed evidence, the scoring apparatus stays deleted |
| Require a full-playbook audit before Phase 2's benchmark re-run | An 8-file sample found no stale `expected_workflow_mode` values, but extrapolating "nothing needs regenerating" from a sample would be premature |
| Diagnose Phase 3 down to the exact code path rather than leaving it as "investigate the warning" | `research.md`'s 12 citations were already visible by inspection; the gap was the checker's anchor-scoped search reaching zero anchors, not an actual absence of citations |
| Record Phase 2 as resolved-by-investigation rather than claim a benchmark run happened | The plan's premise was wrong — no live route-gold file exists in `sk-design/benchmark/`; running a benchmark against nothing would have been theater, not evidence. Investigation plus one targeted fix produced the same confidence the plan sought. |
| Record the `handler-memory-save.vitest.ts` lock-retry failure as a known issue rather than fix it | Out of this packet's scope (none of the five named items); verified identical with and without the Phase 4 change, so it is pre-existing, not a regression this packet introduced |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Status |
|---|---|
| Styles SHA-256 equality (`006/scratch/styles.sha256.before`) | **PASS** — 7,811/7,812 identical, 1 known-deliberate delta |
| Benchmark re-run (4-mode/3-command topology) | **Not run — not needed.** Investigation found no live route-gold to regenerate; `TV-001`/`SR-002` confirmed correct via full-playbook audit |
| `validate.sh 006-design-mode-consolidation --strict` | **Errors 0, Warnings 0** (was Errors 0, Warnings 1 `SPEC_DOC_SUFFICIENCY` before the Phase 3 fix) |
| `--level 2` persistence on a real folder | **Confirmed** — strip/regenerate test |
| system-spec-kit workspace test suite | **Re-run — no new failures from this packet's changes.** 1 failed / 14 passed both with and without the Phase 4 change (pre-existing, unrelated) |
| `procedure-card-schema-check.mjs` | Pass |
| `interface-command-contract.test.mjs` | 8 pass / 0 fail |
| `design-command-surface-check.test.mjs` | 7 pass / 0 fail |
| `design-command-surface-check.mjs` | `invalid=0 drift=0` |
| `parent-skill-check.cjs` | OK, 0 warnings |
| Packets `006`, `007`, `008` strict validation | Errors 0 / Warnings 0 (all three) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR ID | Target | Actual | Status |
|--------|--------|--------|--------|
| REQ-001 | Styles corpus check runs against the exact frozen snapshot; mismatch escalated | Ran against all 7,812 entries; the single delta traced to a known-deliberate edit, no escalation needed | **Met** |
| REQ-002 | Benchmark regeneration leaves historical run records untouched | No regeneration occurred (none was needed); historical directories confirmed untouched | **Met (by investigation, not regeneration)** |
| REQ-003 | 006 reaches Warnings 0 without rewriting research.md content | `research.md` content unchanged; `006 --strict` Warnings 0 | **Met** |
| REQ-004 | `--level` fix verified end-to-end, not only at the parsing layer | Strip/regenerate test on a real folder proves persistence through the write path | **Met** |
| REQ-005 | Phase 5 does not execute without recorded operator approval | Not executed; approval not yet given | **Held — still Planned** |
<!-- /ANCHOR:nfr-verify -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Phase 5 cannot proceed without operator approval**, and this packet does not assume that approval will be given. All 57 deleted fixture-related files remain recoverable from `b217d74b81^`.
2. **Phases 3 and 4's blast radius extends beyond sk-design.** Both fixes are in shared `system-spec-kit` tooling consumed by every packet repo-wide, not sk-design-local code. Phase 4 was verified against the full workspace test suite before this claim was recorded.
3. **Pre-existing, unrelated test failure discovered but not fixed.** `mcp-server/tests/handler-memory-save.vitest.ts` — "retries through a filesystem-backed lock when another process already holds the spec-folder lock" — fails identically with and without this packet's Phase 4 change (1 failed / 14 passed both ways). It is in shared tooling and nobody is currently tracking it; recommend triaging it as a separate item, not folding it into this packet's scope.
4. **Phase 2's original plan (a benchmark re-run) was not executed as written.** Investigation showed the premise was wrong — no live route-gold file exists to regenerate — so the item was resolved by audit plus one targeted fix instead. This is recorded as a corrected premise, not a shortcut.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Phase 2: re-run the benchmark driver, write output to a new `sk-design/benchmark/` directory | No benchmark run executed; issue resolved by a full-playbook audit plus one targeted fix to `design-mode-pairing-before-run.md` | The plan's premise was wrong — no live route-gold file exists in `sk-design/benchmark/` to regenerate against; the playbook is the actual gold and was already current |
| Phase 5: no deviation — remains exactly as planned | Not executed; Open Question in `spec.md` §7 still stands | Operator approval, a hard gate per REQ-005, has not been given |
<!-- /ANCHOR:deviations -->
