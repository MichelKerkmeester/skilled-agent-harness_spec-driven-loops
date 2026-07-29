---
title: "Implementation Plan: Wire Compiler + Routing-Accuracy Gates into CI"
description: "Add skill_graph_compiler.py --validate-only and score-routing-corpus.py (pinned hash) as new steps in routing-registry-drift.yml, sequenced strictly after fleet migration (003) and scaffold born-complete (004) ship, with a documented rollback."
trigger_phrases:
  - "ci compiler accuracy gate plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/006-ci-compiler-accuracy-gates"
    last_updated_at: "2026-07-29T09:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored planned phase spec"
    next_safe_action: "Begin implementation per plan.md"
    blockers:
      - "002 corpus hash pin not yet shipped"
      - "003 fleet migration not yet shipped"
      - "004 scaffold born-complete not yet shipped"
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-json-optimization-implementation/006-ci-compiler-accuracy-gates"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Implementation Plan: Wire Compiler + Routing-Accuracy Gates into CI

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Add two new CI steps to the existing `routing-drift` job in `.github/workflows/routing-registry-drift.yml`: one running `skill_graph_compiler.py --validate-only` (full `derived` schema + `key_files`/`source_docs`/`entities[].path` existence checks), one running `score-routing-corpus.py` against the routing-accuracy corpus pinned to the hash 002 records. Both steps are additive to the four that already exist in that job. Activation is sequenced strictly after 003 (fleet migration to schema-version 2 `derived`) and 004 (scaffold born schema-compliant) ship, so the gate never reds the fleet on its first live run.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Bar |
|------|-----|
| Local dry run | Both new steps' exact commands run green locally against current `main` before the workflow file is edited |
| No fleet red on turn-on | Compiler step passes fleet-wide only after 003/004 are confirmed merged; verified by running the step against the post-003/004 tree before enabling in CI |
| Additive only | The four pre-existing `routing-drift` steps are byte-unchanged except for the `paths:` trigger list extension |
| Pinned corpus | Accuracy step reads the corpus at the hash 002 pins, never a live/mutable path |
| Actionable failure | A deliberately broken `derived` block and a deliberately regressed accuracy run both produce a step failure with the scripts' native diagnostic text, reproducible locally with the printed command |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

No new production code. This phase edits one CI workflow file (`.github/workflows/routing-registry-drift.yml`) to invoke two existing, unmodified scripts as new steps in the existing `routing-drift` job:

| Step (new) | Command | Failure mode |
|------------|---------|--------------|
| Compiler validation | `python3 .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_graph_compiler.py --validate-only` | Script exits 2 on schema errors, dependency cycles, symmetry/zero-edge topology violations, or a `derived.key_files`/`derived.source_docs`/`derived.entities[].path` that does not resolve to a real file |
| Routing-accuracy scoring | `python3 .opencode/skills/system-skill-advisor/mcp-server/scripts/routing-accuracy/score-routing-corpus.py --dataset <pinned-corpus-path> --require-historical-clean --min-advisor-accuracy <floor> --min-gate3-f1 <floor>` | Script exits non-zero when accuracy/F1 floors are not met or a historically-clean prompt regresses |

Both steps run inside the same `working-directory: .opencode/skills/system-skill-advisor/mcp-server` context the existing steps already use, since both scripts live under that tree and both already resolve `REPO_ROOT`/`SKILLS_DIR` relative to their own file location — no new environment setup beyond the `python3` interpreter the workflow already provisions via `actions/setup-python@v5`.

Trigger-path extension: the workflow's `paths:` filters (both `push` and `pull_request` blocks) gain two new globs so an edit to the compiler script or the routing-accuracy corpus fires this job — mirroring how the existing filters already cover `mode-registry.json`, `hub-router.json`, and the `sk-doc/create-skill/scripts/**` tree.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

Confirm 003 (fleet migration) and 004 (scaffold born-complete) have shipped and merged; read 002's pinned corpus-hash artifact to get the exact dataset path/reference this phase's accuracy step will point at; run both target commands (`skill_graph_compiler.py --validate-only`, `score-routing-corpus.py --dataset <pinned-path>`) locally against current `main` to confirm a clean baseline before touching the workflow file.

### Phase 2: Implementation

Add the compiler-validation step to `routing-registry-drift.yml`'s `routing-drift` job, placed after the existing "Skill-root metadata class contract" step so it runs against a fleet already confirmed structurally conformant. Add the routing-accuracy scoring step immediately after, pointed at 002's pinned corpus reference with the floor flags sourced from 003's baseline. Extend the `paths:` filter lists (push + pull_request) with the compiler script path and the routing-accuracy directory glob. Add an inline workflow comment (matching the file's existing comment style) explaining why the corpus is pinned rather than read live, citing the 029 research finding that motivated it.

### Phase 3: Verification

Dry-run both new steps against a fresh clone (not just the working tree) to rule out a pass that only holds because of local uncommitted state. Deliberately break a `derived.key_files` path in a scratch copy and confirm the compiler step fails with the expected `ERRORS in <folder>` message; deliberately lower an accuracy number in a scratch corpus copy and confirm the scoring step fails against the pinned floor. Confirm the four pre-existing `routing-drift` steps are unaffected (still pass, same commands). Confirm the new `paths:` entries actually fire the job by checking the filter syntax against GitHub Actions' path-filter matching rules.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Primary test is direct command reproduction: every new CI step's command is run locally first (Phase 1 baseline, Phase 3 negative cases) so the workflow YAML never introduces new behavior that hasn't already been observed outside CI. Negative-case testing follows `skill_graph_compiler.py`'s and `score-routing-corpus.py`'s own exit-code contracts (2 = validation/accuracy failure, 0 = pass) rather than inventing new assertions — the scripts are the source of truth, this phase only wires them in. No unit tests are added because no new script logic is written; the workflow YAML itself is the only artifact under test, validated by local reproduction plus a fresh-clone dry run.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`002-*` (routing-accuracy corpus hash pin — supplies the exact dataset reference this phase's accuracy step reads), `003-*` (fleet migration to schema-version 2 `derived` — must ship first so the compiler gate does not red on turn-on), `004-*` (scaffold born schema-compliant — must ship first so new skills pass the gate immediately); the existing `routing-drift` job in `.github/workflows/routing-registry-drift.yml`; `skill_graph_compiler.py` and `routing-accuracy/score-routing-corpus.py`, both unmodified by this phase.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

This phase's only production change is additive YAML in one workflow file. Rollback is a single revert of the commit that added the two new steps and the two `paths:` extensions — no generated artifact, script, or metadata file is touched, so reverting the workflow edit fully restores the pre-phase CI behavior with no follow-up cleanup. If the compiler or accuracy step turns out to be flaky after merge (a false failure unrelated to a real regression), the safe interim mitigation is to comment out (not delete) the offending step with a dated note, rather than reverting the whole gate, so the other new step keeps protecting the fleet while the flaky one is fixed. If 003/004 are found to be incomplete after this phase merges (a gap discovered only once the compiler gate runs live), the rollback is the same single-commit revert — this phase does not modify 003/004's artifacts and cannot corrupt them.
<!-- /ANCHOR:rollback -->
