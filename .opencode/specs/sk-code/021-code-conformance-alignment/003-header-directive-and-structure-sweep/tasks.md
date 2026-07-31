---
title: "Tasks: Header, Directive and Structure Sweep"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "header sweep tasks"
  - "codemod lane tasks"
  - "census reconciliation tasks"
importance_tier: "high"
contextType: "implementation"
parent: "sk-code/021-code-conformance-alignment"
_memory:
  continuity:
    packet_pointer: "sk-code/021-code-conformance-alignment/003-header-directive-and-structure-sweep"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the task breakdown for the header and directive sweep"
    next_safe_action: "Run T001 once child 001 has captured the baseline"
    blockers: []
    key_files:
      - "tasks.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Header, Directive and Structure Sweep

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm findings against HEAD and re-derive the census per lane root before any edit. Five findings were confirmed by the synthesis author or re-derived in this session — 19 of 39 compiled-routing modules header-less, the doctor freshness `JS-USE-STRICT` warning, the statusline script, the Code Mode postinstall checker, 2 of 5 doctor diagnostics — and each must still reproduce. Reconcile the tracked-versus-walked file-count gap (`.py`: 129 tracked here versus 258 reported in the synthesis census) and record which count governs. **The census is the work list, not the finding list**: list every file the census finds that no finding named, and every finding whose named file the census does not contain. Note that the two shell libraries under `.opencode/scripts/git-hooks/lib/` already fail `SH-STRICT-MODE` and appear in no finding — decide here whether they belong to this child or to 004.
- [ ] T002 Capture the pre-lane numbers for every root: `python3 .opencode/skills/sk-code/sk-code-opencode/assets/scripts/verify_alignment_drift.py --root <ROOT>` and the header census command. Reconcile against child 001's captured program baseline; if they disagree, child 001's baseline governs and the discrepancy is recorded.
- [ ] T003 Build the transform library implementing the seven rules — R-HDR-JS, R-STRICT, R-HDR-PY, R-HDR-SH, R-SHEBANG, R-SECNUM, R-IMPORTS — as a pure text-to-text function with the file mode preserved on write.
- [ ] T004 Prove the transform library with its own test suite before any lane runs: idempotence (a second run yields an empty diff), shebang handling (header goes after line 1, never before), mode preservation, `.mjs` never receiving a strict directive, `.cjs` with a pre-existing bare `'use strict'` not getting a duplicate, an existing non-canonical preamble folded into the box body rather than dropped, and R-IMPORTS preserving the sorted multiset of specifiers exactly.
- [ ] T005 [P] Build the below-the-line assertion: parse each diff hunk and confirm it lies above the file's first executable statement, with an explicit allow-list for reviewed import-order hunks. Demonstrate it failing on a deliberate below-the-line change.
- [ ] T006 [P] Build the exemption assertion: intersect `git diff --name-only` with the exemption globs — `**/benchmarks/**/fixtures/**`, seeded subject corpora, `dist/`, `external/`, `node_modules/`, `.venv`, `z_archive`, `.claude` symlinked trees, `.d.ts`, `system-deep-loop/runtime/**`, and the three `.opencode/bin` git-coordination scripts — and demonstrate it failing on a deliberate exempt-file edit.
- [ ] T007 [B] Confirm the closure-gate mechanism per **[OPERATOR-DECISION: Q4 — exact-header automated check]**: either child 001's opt-in verifier flag, or the scripted census assertion owned here.
- [ ] T008 [B] Confirm lane B's root list per **[OPERATOR-DECISION: Q2 — the non-runtime deep-loop border]**.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Lane A — runtime-reachable

- [ ] T009 Sweep `.opencode/bin` (63 `.cjs`, 26 header-less, of which 19 are in `lib/compiled-routing`). Leave `git-sync.sh`, `git-live-follow.sh` and `worktree-status.sh` untouched — their 3 `SH-STRICT-MODE` errors belong to child 004 and must still be present after this root.
- [ ] T010 Regenerate the compiled-routing outputs and activation manifests, and `diff` them byte-for-byte against the pre-lane copies. Any difference reverts the compiled-routing portion of this root.
- [ ] T011 Sweep `.opencode/hooks` (5 of 37 JS header-less; 5 TS for import order). Then run the post-edit smoke: a scratch edit must still fire the hook.
- [ ] T012 Sweep `.opencode/plugins` (1 of 19 header-less; import grouping for the rest). Confirm no `.mjs` received a strict directive.
- [ ] T013 Sweep `.opencode/scripts` (9 of 10 `.sh` header-less). Then run a scratch commit and confirm the pre-commit hook still fires and still blocks a deliberately violating file.
- [ ] T014 Sweep `.opencode/commands/doctor/scripts` (2 of 5 header-less; plus the `JS-USE-STRICT` warning on `skill-graph-freshness.cjs:1`). Expected verifier delta: 1 warning to 0.
- [ ] T015 [P] Sweep `.github/hooks/scripts` (2 of 2 header-less) and `.claude/statusline-command.sh` (1 of 1). Confirm the statusline still renders and the CI bridge still runs in its context.
- [ ] T016 Gate lane A: per root, census at zero and verifier delta reported as "N closed, zero new"; `.opencode/bin` must still report its 3 child-004 errors. Run the full live-surface suite and the compiled-route manifest test.

### Lane B — tooling

- [ ] T017 [B] Confirm the documentation-coverage track's code child has landed before starting this lane, so the two do not race on the same package's suite.
- [ ] T018 Sweep sk-doc `**/scripts` (13 of 52 header-less), covering the frontmatter engine, the frontmatter shell gate, and the shared Python naming guards.
- [ ] T019 [P] Sweep sk-design `**/*.py` (10 of 10 header-less), including the contrast checker.
- [ ] T020 [P] Sweep mcp-code-mode (2 of 2: the postinstall checker's CJS header and strict mode, and the TypeScript entry's noncanonical preamble), and the Figma executable examples' noncanonical Bash shebangs.
- [ ] T021 [B] Sweep `system-deep-loop/shared/**` and `deep-improvement/scripts/**` (5 of 75 header-less: the reviewer scorer, the shared progress module's header and section numbering, the shared rollout resolver's noncanonical header). Blocked on Q2; sequenced after any security-register child touching the same file.
- [ ] T022 [P] Sweep the remaining lane B findings whose file paths T001 resolves: the constitutional staleness CLI's boxed header, the durable Python helper's component header, and the config module's repeated section number 1. Their naming and broad-except issues belong to child 005 and are not touched here.
- [ ] T023 Gate lane B: per root, census at zero, verifier zero-new, and every touched package's typecheck and suite green against its captured baseline.

### Lane C — benchmark harnesses

- [ ] T024 Sweep `.opencode/skills/sk-prompt/**/benchmarks/**` (42 of 42 `.cjs` header-less): the MiMo bake-off harness, the SWE eval-loop scripts, the extraction-rerun scripts, the MiniMax eval-loop scripts, the MiniMax eval-rig harness, and the CLI ground-truth generator. Harness, grader, runner and deterministic-checker code only.
- [ ] T025 [P] Sweep `.opencode/skills/system-spec-kit/**/benchmarks/**` scripts (3 of 3 header-less Python).
- [ ] T026 Gate lane C: census at zero, verifier zero-new, and the exemption assertion confirming zero fixture-subject files in the diff. Run one representative benchmark rig end to end to confirm the harness still executes.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T027 Test happy path manually: execute every lane A live surface — post-edit hook on a scratch edit, pre-commit on a scratch commit, each `.opencode/bin` front door, the doctor routes, the statusline.
- [ ] T028 Test edge cases: confirm every matrix cell has a verified file — {ts, js, cjs, mjs, py, sh} × {shebang present, absent} × {preamble none, non-canonical, canonical}. Confirm no `.mjs` received a strict directive and no file lost its executable mode.
- [ ] T029 Run the below-the-line assertion over the complete diff and enumerate every import-order hunk on the allow-list, each individually reviewed.
- [ ] T030 Run the exemption assertion over the complete diff; the intersection with the exemption globs must be empty.
- [ ] T031 Re-run the codemod over the transformed tree and confirm an empty diff, proving idempotence at scale rather than only in the unit test.
- [ ] T032 Record the final gate table: per root, verifier before and after, census before and after, and the package suites' baseline-to-post comparison.
- [ ] T033 Update documentation: reconcile `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md` and `implementation-summary.md` so no document contradicts another's completion state.
- [ ] T034 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` and record exit 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] Every root reports both gates: census at zero and verifier zero-new
- [ ] `.opencode/bin` still reports the 3 errors that belong to child 004 — a PASS there would mean this lane overstepped
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
