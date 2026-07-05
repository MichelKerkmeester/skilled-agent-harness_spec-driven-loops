---
title: "Tasks: Runtime Hygiene Fixes"
description: "Task list for comment-hygiene cleanup, salvage-naming fix, and lint rule."
trigger_phrases:
  - "runtime hygiene fixes tasks"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-deep-loop-improved/009-research-backlog-remediation/003-runtime-hygiene-fixes"
    last_updated_at: "2026-07-01T07:20:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored tasks"
    next_safe_action: "Dispatch implementation to MiMo v2.5 ultraspeed via cli-opencode"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-009-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Runtime Hygiene Fixes

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`[x]` complete, `[ ]` pending.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Removed all 15 scoped HTML-comment markers (10 originally cited plus 5 more caught by the repo-wide grep) across `deep_review_auto.yaml`, `deep_research_auto.yaml`, `cli-opencode/SKILL.md`, `cli-opencode/references/agent_delegation.md`; verified 0 remain in these files
- [x] T002 Repo-wide grep for `F-[0-9]+-[A-Z0-9]+-[0-9]+` in comments re-run independently; only documented out-of-scope hits remain (test fixtures, `check-source-dist-alignment.ts` allowlist reasons, vitest `describe()` labels) — none inside spec-doc HTML comments
- [x] T003 Added `COMMENT_HYGIENE_MARKER` rule (`scripts/rules/check-comment-hygiene.sh`), registered in `validator-registry.json` (alias `COMMENT_HYGIENE`), with fixtures `test-fixtures/070-comment-hygiene-marker` (clean, passes) and `071-comment-hygiene-marker-violation` (fails at `spec.md:45`); extended harness 2/2 pass, independently re-run
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Added RED test in `fanout-salvage.vitest.ts` asserting the placeholder for iteration 1 is `iteration-001.md`; confirmed it failed against unmodified code (`AssertionError: expected false to be true` on the padded-filename existence check)
- [x] T005 Fixed `fanout-salvage.cjs:112`: `iteration-${iterNum}.md` → `iteration-${String(iterNum).padStart(3, '0')}.md` (3-digit padding, matches convention used elsewhere in the runtime); independently re-diffed and confirmed 1-line change
- [x] T006 Confirmed GREEN: targeted test passes; full `fanout-salvage.vitest.ts` 12/12 pass — independently re-run, 12/12 confirmed
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Traced the reducer path: `fanout-merge.cjs` reconstructs review registries from state-log `findingDetails`, not from iteration markdown files, so salvage-naming duplication cannot be the direct cause of a zero-finding registry. Re-checked live state: codex's lineage registry already shows `openFindings: 5` (not 0) — the "0-finding" premise from generation-1 research no longer holds against current live data. Naming-collision hypothesis **refuted** with direct evidence (byte-identity check on the archived glm generation confirmed salvage explains non-padded *duplicate* files, not lost findings)
- [x] T008 No backfill needed — codex's registry already has 5 real findings (see T007); documented as resolved-by-current-state rather than a follow-up
- [x] T009 Full `deep-loop-runtime` suite run independently by this session: 557 passed / 2 failed (558 total across relevant files; 60 files, 559 tests reported by vitest). The 2 failures (`dependency-seams.vitest.ts`, `executor-provenance-mismatch.vitest.ts`) are **not regressions from this phase** — traced to pre-existing uncommitted changes on this branch unrelated to this packet (route-proof validation additions to `post-dispatch-validate.ts` and dependency version bumps in `package.json`/`package-lock.json`, both already present in `git status` before this child's work began). Confirmed via git diff inspection that this child's actual changes (`fanout-salvage.cjs`, `check-comment-hygiene.sh`, marker removals) are unrelated to either failing test's subject matter
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All 9 tasks complete; zero marker hits repo-wide; salvage naming test passes; root cause documented with evidence; full suite green.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `./spec.md` · Plan: `./plan.md` · Implementation summary: `./implementation-summary.md`
- Source findings: `../../research/research_archive/20260701T071133Z-gen1/research.md` §4.2 (F-002/G-003), §4.2 (F-012/F-014), §3.3/§4.4 (F-019/G-009)
<!-- /ANCHOR:cross-refs -->
