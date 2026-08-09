---
title: "Tasks: Doc-Template and Code-README Alignment"
description: "Task breakdown for reshaping both changes documents, authoring 9 code-folder READMEs, and auditing added TypeScript/JS against sk-code-opencode standards."
trigger_phrases:
  - "doc template code readme alignment tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/039-pi-caching-like-reasonix/010-doc-template-and-code-readme-alignment"
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
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Doc-Template and Code-README Alignment

---

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` pending, `[x]` complete
- Each task cites the requirement it satisfies (REQ-###) from `spec.md`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read both current `CHANGES-FROM-UPSTREAM.md` files in full
- [x] T002 Enumerate all 9 target folders' real file listings directly — 9/9 folders confirmed via `find`, recorded in the Evidence Record table below
- [x] T003 Read `sk-create-readme/SKILL.md` and `sk-code-opencode/SKILL.md` in full
- [x] T004 Read `cli-devin/SKILL.md`; confirm auth; resolve "GLM 5.2 high" to `glm-5-2` via `references/providers-and-models.md`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 [REQ-001, REQ-002, REQ-003] Dispatch GLM-5.2 High via `cli-devin`
  Attempt 1 (`--permission-mode accept-edits`) read all files correctly then hit `warning: rejected a tool call that requires confirmation` when it tried a shell command for verification — `accept-edits` "prompts for shell" and there is nobody to answer non-interactively; zero files written, confirmed via `git status` diff against the pre-dispatch baseline. Attempt 2 tried `--permission-mode smart`; the CLI printed `Warning: Smart permission mode is not available. Falling back to normal` and rejected even earlier. Attempt 3 removed the shell-verification instruction from the prompt (told the dispatch not to run npm/test commands, that verification would happen separately) and re-ran under `accept-edits` — completed cleanly in ~500s with no rejections.
- [x] T006 [REQ-001] Fact-check both rewritten changes documents against the 009-verified fact base; correct anything drifted
  Sentence-level diff (`grep -oE '[A-Z][^.]*\.' | sort -u`) between the pre-rewrite snapshot and the final file for both documents: every difference was an expected structural artifact of the template reshape (bullet list to table syntax, added blockquote tagline, added Related Resources section) — zero facts dropped or altered.
- [x] T007 [REQ-002] Fact-check all 9 code-folder READMEs against the real source files; correct anything invented or wrong
  Spot-checked ~15 specific technical claims directly against source: `deeppi.ts`'s hook registrations and default export, `hashlines.ts`'s and `stats.ts`'s full export lists, `live-benchmark.mjs`'s exact env var names, `one-owner.ts`'s "no imports" claim, `node-shims.d.ts`'s declared functions, `fake-pi.ts`'s `cwd` implementation. Every claim checked was accurate; nothing invented.
- [x] T008 [REQ-003] Verify every code-standards fix cites a real standard and does not change behavior
  All 5 applied fixes read directly from final source and confirmed present exactly as reported: `.js` import specifier in `ownership-composition.test.ts:9`, `catch (err: unknown)` at `hashlines.ts:284,310`, single (not duplicate) `HashlineStats` interface at `hashlines.ts:165`, `import type` moved to the top of `stability.ts` and `telemetry.ts`. 4 additional findings were reported as noted-but-not-fixed (comment-only or behavior-risk fixes) — left as-is per the dispatch's own correctly-conservative judgment.
- [x] T012 [REQ-003] Round 2: dispatch 4 fresh GPT-5.6-LUNA (max reasoning, fast tier) codex agents in parallel, each instructed to load `sk-code` itself (not fed pre-extracted excerpts), covering `deeppi/` (7 files), `deeppi.ts`, `live-benchmark.mjs`, and `tests/` (14 files) — user feedback was that the Round 1 GLM pass was too conservative (declined all comment additions); this round explicitly covers inline comments and structure
  All 4 completed successfully under `--sandbox workspace-write` (codex has no `accept-edits`-style shell restriction, unlike the cli-devin dispatch in Round 1). Elapsed: benchmark ~9 min, entry ~11 min, tests ~14 min, implementation ~37 min (largest scope, included a genuine `buildByModel`/`MODEL_IDS` centralization refactor across `stats.ts`).
- [x] T013 [REQ-003] Fact-check all 4 Round 2 dispatches against real source
  Read all 7 `deeppi/` files, `deeppi.ts`, and spot-checked `live-benchmark.mjs`/test-file claims in full. Verified: module headers/numbered sections present in every file; TSDoc added to all exported symbols; `stats.ts`'s new `buildByModel` helper and `MODEL_IDS` constant preserve the exact same 2-key output as before (confirmed identical export surface: 18 `export` statements, same names/signatures); `stormbreaker.ts`'s task-labelled comment removed with no replacement ID/reference; `review2.test.ts`'s ephemeral `Finding 1-4` comments replaced with durable technical descriptions (a genuine comment-hygiene fix); local variable renames in `deeppi.ts` (`ctx`→`context`, `storm`→`stormBreaker`) applied consistently with no leftover old names.
- [x] T016 [REQ-002] Verify the 9 code-folder READMEs against `sk-doc`'s own validator before authorizing any rework
  User raised the concern that the sk-create-readme templates were never really used. Ran `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py` against all 9 code-folder READMEs directly: `✅ VALID, Total issues: 0` on every one. Confirmed the numbered ALL-CAPS H2 shape, the subdirectory-count-conditional Directory-Tree-vs-flat-table rule, and the no-ToC/no-anchor-comment rules were all followed correctly. No rework was needed or performed; this is a documented negative finding, not a silent dismissal.
- [x] T017 [REQ-003] Round 3: dispatch 2 fresh GPT-5.6-LUNA (max reasoning, fast tier) codex agents in parallel for the extension Round 2 never covered — `pi-cache-optimizer/index.ts` (8,390 lines) as its own dispatch, and `pi-cache-optimizer/tests/` (3 files) plus `shared/composition/one-owner.ts` bundled into a second — each self-loading `sk-code`, mirroring Round 2's method
  First launch of both stalled immediately: the dispatch prompt omitted the `Spec folder: ... (pre-approved, skip Gate 3)` line cli-codex's own rules require, so both hit the Gate-3 documentation-scope prompt and exited without doing any work (confirmed via each dispatch's log, ~19k tokens spent asking the question, zero file changes). Relaunched immediately with the line added; both completed cleanly (tests+shared ~11 min, index.ts ~15 min).
- [x] T018 [REQ-003] Fact-check both Round 3 dispatches against real source, with extra scrutiny on the shared-project race the concurrent dispatches created
  The tests+shared dispatch's own `npm run typecheck` reported one TS2724 failure at `index.ts:19`, a file it never touched. Diagnosed live: `index.ts` was still being edited by the concurrently-running other dispatch at that moment (confirmed still-alive via `kill -0`), and `index.ts` has no import from `shared/` that the other dispatch's `one-owner.ts` change could have broken — so this was a transient race from two dispatches sharing one TypeScript project, not a real defect. Re-ran `npm run typecheck` myself once both dispatches had exited: clean, 0 failures. Separately verified `index.ts`'s export surface and hook registrations against the original committed fork (`git show 19ac4a458d:...index.ts`): both exports (`__internals_for_tests`, the default export) and all 7 `pi.on(...)` hook registrations (`before_agent_start`, `before_provider_request`, `after_provider_response`, `model_select`, `session_start`, `session_shutdown`, `message_end`) are byte-identical to the pre-dispatch commit; the default export's body is unchanged except for an added `: void` return-type annotation. Spot-checked remaining double-quote occurrences in `index.ts` (131 of them): all are legitimate content (regex literals, message strings that must contain a literal double quote), not missed formatting.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 [REQ-004] Re-run `npm test`/`npm run typecheck` in both forks from the final state
  deep-pi: `Test Files 11 passed (11)`, `Tests 81 passed (81)`, `tsc --noEmit` clean. pi-cache-optimizer: `pass 34`, `fail 0`, `tsc --noEmit --pretty false` clean.
- [x] T010 [REQ-005] `git status --porcelain` scope check across both extension directories
  Found one stray artifact: repo-root `.pi/deep-pi-stats.json`, 5 real sessions with fresh 2026-08-08T12:09-12:34Z timestamps, all-zero totals — not caused by this phase's own commands (the `fake-pi.ts` isolated-cwd fix from the prior phase prevents test runs from writing there); an ambient Pi process outside this session's direct control. Removed; final sweep clean.
- [x] T011 `validate.sh --strict` on this folder; `validate.sh --recursive --strict` on the whole `039` packet
  Recorded in `checklist.md` and `implementation-summary.md`.
- [x] T014 [REQ-004] Re-run `npm test`/`npm run typecheck` in both forks after Round 2
  deep-pi: `Test Files 11 passed (11)`, `Tests 81 passed (81)`, `tsc --noEmit` clean. pi-cache-optimizer (untouched by Round 2, re-confirmed anyway): `pass 34`, `fail 0`, typecheck clean.
- [x] T015 [REQ-005] Final `git status --porcelain` scope check and secret/comment-hygiene scan after Round 2
  The same ambient repo-root `.pi/deep-pi-stats.json` reappeared once more (identical pattern to T010, still not caused by this phase); removed. Secret scan and an ADR-/REQ-/CHK-/task-id/spec-path leakage scan across all 7 touched files: zero matches on both.
- [x] T019 [REQ-004] Re-run `npm test`/`npm run typecheck` in both forks after Round 3, from the true final state
  pi-cache-optimizer: `pass 34`, `fail 0`, `tsc --noEmit --pretty false` clean. deep-pi (untouched by Round 3, re-confirmed anyway): `Test Files 11 passed (11)`, `Tests 81 passed (81)`, typecheck clean. The one transient TS2724 failure surfaced mid-dispatch by the tests+shared agent's own typecheck run (against a concurrently-being-edited `index.ts`) is absent from this final-state run.
- [x] T020 [REQ-005] Final `git status --porcelain` scope check after Round 3
  The same ambient `.pi/deep-pi-stats.json` artifact reappeared a further time; removed. No file outside the two dispatches' declared targets (`pi-cache-optimizer/index.ts`, `pi-cache-optimizer/tests/{hook-guards,ownership-composition,review-findings}.test.ts`, `shared/composition/one-owner.ts`) was changed.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:evidence -->
## Evidence Record

### Baseline captured before implementation (T001-T002)

Real file listings per target folder, gathered directly via `find`, not assumed:

| Folder | Files |
|---|---|
| `deep-pi/benchmarks/` | `before-provider-request.mjs` |
| `deep-pi/extensions/` | `deeppi.ts` |
| `deep-pi/extensions/deeppi/` | `eligibility.ts`, `hashlines.ts`, `stability.ts`, `stats.ts`, `stormbreaker.ts`, `telemetry.ts`, `utils.ts` |
| `deep-pi/scripts/` | `live-benchmark.mjs` |
| `deep-pi/tests/` | `cross-process-lock-worker.mjs`, `cross-process-stats-worker.mjs`, `deeppi.integration.test.ts`, `eligibility.test.ts`, `fake-pi.ts`, `hashlines.test.ts`, `ownership-composition.test.ts`, `package.test.ts`, `report.test.ts`, `review2.test.ts`, `stability.test.ts`, `stats.test.ts`, `stormbreaker.test.ts`, `telemetry.test.ts` |
| `pi-cache-optimizer/tests/` | `hook-guards.test.ts`, `ownership-composition.test.ts`, `review-findings.test.ts` |
| `pi-cache-optimizer/types/` | `node-shims.d.ts`, `pi-coding-agent.d.ts` |
| `shared/` | `deepseek-ownership.json` |
| `shared/composition/` | `one-owner.ts` |

Baseline test counts (pre-this-phase, confirmed real): deep-pi 81/81 tests, 11 files; pi-cache-optimizer 34/34 tests, 8 suites; both typechecks clean.

### Negative controls

Not directly applicable to documentation authoring. For REQ-003's code-standards fixes: the full test suite re-run after every fix IS the negative control — a fix that breaks a test is reverted immediately.

### Final authoritative gate

Recorded in `checklist.md` and `implementation-summary.md` once Phase 3 completes.
<!-- /ANCHOR:evidence -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All of Phase 1-3's tasks checked, `implementation-summary.md` authored, both forks' test/typecheck gates green, `validate.sh --recursive --strict` passing for the whole `039` packet.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md` — requirements REQ-001 through REQ-005
- `checklist.md` — verification gates
<!-- /ANCHOR:cross-refs -->
