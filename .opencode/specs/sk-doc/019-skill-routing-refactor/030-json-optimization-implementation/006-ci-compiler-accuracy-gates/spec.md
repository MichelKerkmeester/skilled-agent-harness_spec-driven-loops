---
title: "Feature Specification: Wire Compiler + Routing-Accuracy Gates into CI"
description: "Add skill_graph_compiler.py --validate-only (full derived schema + key_files/source_docs path existence) and score-routing-corpus.py (pinned corpus hash) to routing-registry-drift.yml so a malformed derived block or a routing-accuracy regression fails CI instead of only surfacing at an offline advisor rebuild."
trigger_phrases:
  - "wire compiler gate into ci"
  - "routing accuracy ci gate"
  - "skill graph compiler ci validation"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/030-json-optimization-implementation/006-ci-compiler-accuracy-gates"
    last_updated_at: "2026-07-29T09:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored planned phase spec"
    next_safe_action: "Begin implementation per plan.md"
    blockers:
      - "Depends on 002 (routing-accuracy corpus hash pinned)"
      - "Depends on 003 (fleet migrated to schema-version 2 derived so the compiler does not red on first run)"
      - "Depends on 004 (init_skill.py scaffold born schema-compliant so new skills do not immediately fail the new gate)"
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "030-json-optimization-implementation/006-ci-compiler-accuracy-gates"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Wire Compiler + Routing-Accuracy Gates into CI

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-29 |
| **Track** | sk-doc |
| **Parent** | `sk-doc/019-skill-routing-refactor/030-json-optimization-implementation` |
| **Parent Spec** | ../spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

`routing-registry-drift.yml` already gates the H/S class presence contract, generated-manifest freshness, and compiled-routing freshness (`routing-drift` job, steps "Routing-registry drift-guard + parity suites" through "Skill-root metadata class contract"). It does **not** run `skill_graph_compiler.py`, which is the only validator that checks the full schema-version-2 `derived` block (`trigger_phrases`/`key_topics`/`key_files`/`entities`/`source_docs`/`causal_summary`, edge weight bands, dependency cycles) and confirms every `derived.key_files`/`derived.source_docs`/`derived.entities[].path` entry resolves to a real file on disk. It also does not run `score-routing-corpus.py`, the only harness that measures whether the fleet's routing data actually routes correctly against the labeled 200-prompt corpus (195 labeled + a holdout slice + an ambiguity slice). The 029 research packet (029, O4, 3/3 lineage agreement) names this the "green-root / downstream-failure seam": a skill can pass every existing CI gate with a malformed `derived` block or a dead `key_files` path, and the failure only surfaces later at an offline `skill_graph_compiler.py --export-json` rebuild or an ad hoc accuracy run — never in the PR that introduced it. This phase closes that seam by adding both validators to the CI workflow, sequenced so the gate does not red the whole fleet on its first run.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope — add a new CI step (or steps) to `.github/workflows/routing-registry-drift.yml` that runs `python3 .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_graph_compiler.py --validate-only` over the fleet, failing the job on any validation error (exit code 2) exactly as the script already does when invoked locally; add a second CI step that runs `python3 .opencode/skills/system-skill-advisor/mcp-server/scripts/routing-accuracy/score-routing-corpus.py` against the corpus files pinned by the 002 phase (`labeled-prompts.jsonl` + `holdout-prompts.jsonl` + `ambiguity-prompts.jsonl`, at the exact commit/hash 002 records), gated with the accuracy-floor flags the script already exposes (`--min-advisor-accuracy`, `--min-gate3-f1`, `--min-joint-tt`, `--max-joint-ft`, `--max-joint-ff`, `--require-historical-clean`); sequence both steps to activate only after 003 (fleet migration to schema-version 2 `derived`, so the compiler does not fail every unmigrated skill on turn-on) and 004 (scaffold born schema-compliant, so newly-scaffolded skills do not immediately trip the gate) are shipped; update the workflow's `paths:` trigger lists (push and pull_request) to include the compiler script and the routing-accuracy corpus files so an edit to either fires the gate; document the pinned-hash rationale inline in the workflow (why an unpinned corpus is unsafe per 029 §3 O4's baseline-accuracy warning).

Out of scope — changing the compiler's validation logic or the corpus scorer's algorithm (that is 002/003/004's territory, not this phase's); picking the canonical `derived` producer (029's O1, a separate follow-up); adding new corpus prompts; touching `skill_advisor.py`'s scoring math; converting the gate to `--fix`/auto-repair mode (`skill_graph_compiler.py` has no `--fix`; it is validate-and-report only).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | CI runs the full `derived`-schema + path-existence compiler validation | `routing-registry-drift.yml` adds a step invoking `python3 .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_graph_compiler.py --validate-only`; the job fails (non-zero) when the script exits 2 |
| REQ-002 | CI runs the routing-accuracy corpus scorer against a pinned corpus | A step invokes `score-routing-corpus.py --dataset <path>` against the corpus files at the exact hash 002 pins; the step reads the pinned hash from a checked-in reference (not `HEAD` of the corpus files at run time) so accuracy is measured against a stable baseline |
| REQ-003 | Compiler gate does not fire before its prerequisites ship | The compiler step is added to the workflow in a form that is inert (or explicitly deferred) until 003 (fleet migration) and 004 (scaffold born-complete) are both merged; the spec records the turn-on order and the turn-on commit is a separate, reviewable change |
| REQ-004 | Accuracy gate fails on regression, not on noise | The scorer step passes `--require-historical-clean` and floor flags (`--min-advisor-accuracy`, `--min-gate3-f1`) set to the baseline 002/003 establish, so a routing regression fails CI but normal variance does not |
| REQ-005 | Workflow trigger paths cover the new gate's inputs | `paths:` (both `push` and `pull_request` blocks) is extended to include `.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_graph_compiler.py` and `.opencode/skills/system-skill-advisor/mcp-server/scripts/routing-accuracy/**`, so a change to either fires the gate on the same PR |
| REQ-006 | Gate failure output is actionable | Both new steps run with their scripts' native stdout/stderr (no output suppression); a CI failure shows the same `ERRORS in <folder>` / accuracy-summary text a local run would show, so a contributor can reproduce the failure locally with the printed command |
| REQ-007 | No change to existing gate behavior | The four existing steps in the `routing-drift` job (drift-guard/parity vitest, compiled-routing freshness, parent-skill structural invariants, skill-root metadata class contract) are unmodified; the new steps are additive |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

`routing-registry-drift.yml` runs `skill_graph_compiler.py --validate-only` and `score-routing-corpus.py` (pinned corpus) on every push/PR that touches the routing surface, in addition to the four existing checks; turning the new gate on does not red the fleet because it activates only after 003 and 004 have landed; a deliberately malformed `derived` block or a deliberately broken `derived.key_files` path fails the new compiler step in a local dry run of the same command CI uses; a deliberately regressed advisor accuracy fails the new corpus step against the pinned baseline; all four pre-existing `routing-drift` steps still pass unchanged.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Risk | Turning the compiler gate on before 003 migrates the fleet reds every unmigrated skill at once | Hard sequencing requirement (REQ-003): this phase's gate-activation commit lands strictly after 003 and 004 merge, verified by re-running the new step locally against `main` before the workflow change is enabled |
| Risk | An unpinned or silently-updated corpus makes the accuracy floor meaningless (029 §3: "baselines are version-sensitive and contradictory across sources") | REQ-002 pins the corpus to the exact hash 002 records; the CI step reads that pinned reference, never a live/mutable path |
| Risk | `skill_graph_compiler.py --validate-only` running in CI needs no repo-external state, but its `derived.key_files` check resolves paths relative to `REPO_ROOT` — a shallow `fetch-depth: 1` checkout (already used by this workflow) could miss a file if it lives outside the fetched tree | Not applicable in practice (single-branch checkout includes the full working tree), but the new step is validated with a fresh clone in Phase 3 testing to confirm no path resolves only because of local uncommitted state |
| Risk | Accuracy-floor flags set too strict make the gate flaky on legitimate small variance | Floor values sourced from the 002/003-established baseline, not guessed; `--require-historical-clean` chosen over a numeric floor alone so historically-known-good prompts must stay clean while overall accuracy is allowed its natural band |
| Dependency | 002 — routing-accuracy corpus hash pin exists and is readable by this phase's CI step | This phase's spec assumes 002 ships a checked-in pinned reference (file or workflow input) before this phase's accuracy step can be written against it |
| Dependency | 003 — fleet migrated to schema-version 2 `derived` | Prerequisite for turning the compiler gate on without red-ing the whole fleet |
| Dependency | 004 — `init_skill.py` scaffold born schema-compliant | Prerequisite so newly-scaffolded skills pass the new gate on day one |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Exact floor values for `--min-advisor-accuracy` / `--min-gate3-f1` / `--min-joint-tt` / `--max-joint-ft` / `--max-joint-ff` are not yet known — they depend on the baseline 003 establishes after fleet migration; this phase specifies the mechanism (REQ-004) and defers the numbers to implementation time, read from 003's shipped baseline artifact.
- Whether the compiler step should be `--validate-only` only, or should also run `--export-json` to catch a build-time serialization failure, is left to implementation: `--validate-only` is sufficient for REQ-001 (schema + path existence) and is the cheaper CI cost; `--export-json` adds coverage for the 4KB output-size warning but is not required by the 029 O4 finding this phase closes.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Program parent**: `sk-doc/019-skill-routing-refactor/030-json-optimization-implementation`
- **Research source**: `../../029-skill-json-optimization-research/research/research.md` (§3 O4)
- **Workflow under change**: `.github/workflows/routing-registry-drift.yml`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **QA**: See `checklist.md`

## Structural phase links

| **Parent Spec** | `../spec.md` |
| **Predecessor** | `005-ci-golden-prompts` |
| **Successor** | `007-dead-field-deletes` |
