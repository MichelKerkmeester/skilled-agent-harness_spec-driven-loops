---
title: "Implementation Plan: Complete the Scaffold-to-Route Journey"
description: "Architecture and phased approach for auto-running the H/S class gate --fix from init_skill.py, writing a compiler-valid derived block, single-sourcing S-class config defaults, and adding the joined scaffold-to-route test."
trigger_phrases:
  - "scaffold to route journey plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/004-scaffold-journey"
    last_updated_at: "2026-07-29T10:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored planned phase spec"
    next_safe_action: "Begin implementation per plan.md"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-json-optimization-implementation/004-scaffold-journey"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Implementation Plan: Complete the Scaffold-to-Route Journey

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Give `init_skill.py` a completed birth: after a scaffold writes its files, run the H/S class gate `--fix` scoped to the new root so its generated manifests are byte-fresh, and write a `derived` block that already satisfies `skill_graph_compiler.py`'s schema-version-2 validator instead of failing on first ingest. Single-source the S-class `leaf-manifest.config.json` boilerplate between the scaffolder and the generator's own fallback defaults. Add one new joined test proving the whole pipeline — scaffold, generated gate, advisor ingest, parent selection, compiled route — for one S-class and one H-class skill, closing the gap the 029 research and the 024 checklist both leave open past the existing doctor-check coverage. This phase is a hard prerequisite for Phase 6 turning on the CI compiler-schema gate.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Bar |
|------|-----|
| Scaffold gate-freshness | A fresh scaffold's class-required generated files pass a plain (non-`--fix`) re-check with zero writes |
| Compiler validity | A fresh scaffold's `derived` block passes `skill_graph_compiler.py`'s `validate_derived_metadata` with zero errors |
| Fix-scoping | The new class-gate call never fails a scaffold over a pre-existing, unrelated fleet violation |
| Config single-sourcing | The S-class boilerplate defaults exist in exactly one place; scaffolder and generator both read it |
| Journey coverage | The new joined test exercises scaffold -> gate -> ingest -> selection -> compiled route for one S and one H root, and passes |
| No regression | `create-journey-proof.test.cjs`, `skill-root-metadata-contract.test.cjs`, `leaf-resource-contract.test.cjs` stay green unmodified in behavior |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Three touch points in `sk-doc/sk-create-skill/scripts/`, plus one new test.

**3.1 Auto-fix after scaffold (`init_skill.py`).** Add a small helper mirroring the existing `_run_manifest_command` pattern (`init_skill.py:354-393`), which already shells `init_parent_skill()` out to a Node CLI and parses its JSON reply rather than trusting a bare exit code. The new helper invokes:

```
node ci-skill-root-metadata.cjs --skills-dir <skill_dir's parent> --format json --fix
```

and parses the JSON `results[]` array (`ci-skill-root-metadata.cjs:408-421`) for the single entry whose `skill` equals the new `skill_name`. Only that entry's `status`/`fixed`/`violations` decide the scaffold's outcome — the aggregate `failed`/exit-code fields reflect the whole `--skills-dir`, which in production is the entire fleet, and must never gate a single new root's success or failure. This keeps the call a one-line addition at the tail of both `init_skill()` (after `leaf-manifest.config.json` is written) and `init_parent_skill()` (after `command-metadata.json` is written, before the existing `--compiled-routing` block), without needing a new single-root CLI mode on the gate itself — `checkRoot`/`findSkillRoots`/`run` are already exported (`ci-skill-root-metadata.cjs:444-456`) if a future phase prefers a direct library call over a subprocess.

**3.2 Compiler-valid `derived` block (`init_skill.py`).** Extend both derived-block literals (`init_skill.py:287-293` standalone, `:541-558` parent) with:
- `key_files`: repo-relative paths to files the scaffold has already written by the time the block is composed (e.g. the new `SKILL.md`).
- `entities`: at least one object with `name`/`kind`/`path`/`source`, `kind` drawn from `{skill, agent, script, config, reference}` (`skill_graph_compiler.py:45`), `path` resolving to a file the scaffold already wrote.
- `causal_summary`: a short, non-empty, honest one-line description (e.g. "Newly scaffolded skill; author fills in the real causal summary").

Ordering matters: the block must be composed after the referenced files exist on disk, so `validate_derived_metadata`'s existence checks (`skill_graph_compiler.py:353-369,388-394`) pass on the very first compiler run against the fresh root.

**3.3 Single-sourced S-class config defaults (`generate-leaf-manifest.cjs` + `init_skill.py`).** `readStandaloneConfig()`'s fallback values for `leafRoots`/`excludeIndexFiles`/`resourceContractVersion` (`generate-leaf-manifest.cjs:110,133-134`) and `init_skill.py`'s scaffolded literal (`init_skill.py:295-308`) currently hardcode the same four values independently. Extract one shared default definition the JS side already owns (since it is the enforcement-side consumer) and have the Python scaffolder either read the same values from a small shared data file, or write only the fields it must (`workflowMode`), leaving the rest to `readStandaloneConfig`'s existing fallback and documenting that in the template. Either direction removes the second hand-kept-equivalent copy; the choice is a task-level implementation decision, not a scope change.

**3.4 Joined journey test (new file under `sk-doc/sk-create-skill/scripts/tests/`).** Extends, not replaces, `create-journey-proof.test.cjs`'s scaffold-and-stage coverage. Two additional legs:
- **Advisor ingest + parent selection**: modeled on `discovery-pipeline-parity.vitest.ts`'s proven pattern (`mkdtempSync`, `initDb`, `indexSkillMetadata`, `closeDb`/`rmSync` in `try/finally`) against the temp scaffold's `skills/` tree, then an unmocked call into the scorer's recommend path to prove at least one representative prompt resolves to the scaffolded skill/hub — not the mocked-`scoreAdvisorPrompt` pattern `advisor-recommend.vitest.ts` uses for handler-contract tests, since this test needs a real score against real ingested data.
- **Compiled route**: reuses the `compiled-route-manifest.cjs` mint/freshness subprocess pattern `init_skill.py::_run_manifest_command` already exercises (`init_skill.py:345-393`), run against the scaffolded hub root, proving the manifest the class gate produced is also compiled-route-clean.

Whether this test is authored as a plain self-running `.cjs` script (matching this directory's existing convention, per `tests/README.md` §1: "self-contained Node script... rather than depending on a test framework") that shells out to the TS/vitest helpers via a small runner invocation, or as a `.vitest.ts` sibling to `discovery-pipeline-parity.vitest.ts` that this directory's test list documents and calls out explicitly, is resolved in `tasks.md` — both are grounded in real, already-passing patterns in this codebase; neither requires new test-runner infrastructure.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

Re-confirm every cited `file:line` against the checked-out tree (files move between research and implementation), and decide the config single-sourcing direction (3.3) and the joined-test authoring shape (3.4) before writing code.

### Phase 2: Implementation

Add the scoped class-gate `--fix` call to both `init_skill()` and `init_parent_skill()`; extend both `derived` block literals to compiler validity; single-source the S-class config defaults; write the joined journey test.

### Phase 3: Verification

Run the full `create-skill/scripts/tests/` suite plus the new joined test; run `skill_graph_compiler.py`'s validator directly against a fresh scaffold to confirm zero errors with no manual edit; re-run `ci-skill-root-metadata.cjs` plain (no `--fix`) against a fresh scaffold to confirm `fixed=0` on the second pass; confirm a scaffold still succeeds when an unrelated fleet root is deliberately left non-conforming (scoping proof).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Layered, reusing proven patterns rather than inventing new ones:

1. **Unit-level** — `skill_graph_compiler.py`'s `validate_derived_metadata` run directly (via its own Python entry point, mirroring how `discovery-pipeline-parity.vitest.ts` already shells into `discover_graph_metadata`) against a scaffold's `graph-metadata.json`, asserting zero errors.
2. **Gate-level** — `ci-skill-root-metadata.cjs --format json --fix` and a plain re-check against a scaffold, asserting the new root's own entry is `pass`/`fixed:true` then `pass`/`fixed:false` — the idempotency proof.
3. **Scoping proof** — a scaffold run against a temp `--skills-dir` that also contains one deliberately non-conforming sibling root, asserting the new skill's own scaffold still reports success (REQ-007).
4. **Journey-level** — the new joined test (3.4): scaffold -> gate -> ingest -> selection -> compiled route, once for S, once for H.
5. **Regression** — the existing `create-journey-proof.test.cjs`, `skill-root-metadata-contract.test.cjs`, and `leaf-resource-contract.test.cjs` re-run unmodified in behavior (their assertions still hold; only `init_skill.py`'s output changes, and only by gaining files these tests either already stage manually or did not check).

No production advisor DB or live daemon is touched — every ingest/selection assertion runs against a `mkdtempSync`-scoped temp DB, matching `discovery-pipeline-parity.vitest.ts`'s and `create-journey-proof.test.cjs`'s existing isolation discipline.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` (invoked, not modified — its exported `run`/`checkRoot`/JSON output contract is the integration surface); `sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs` (touched: `readStandaloneConfig` defaults); `system-skill-advisor/mcp-server/lib/skill-graph/skill-graph-db.ts` (`initDb`/`indexSkillMetadata`, read-only test dependency); `system-skill-advisor/mcp-server/scripts/skill_graph_compiler.py` (read-only test dependency — its schema is asserted against, not changed); `.opencode/bin/compiled-route-manifest.cjs` (already a runtime dependency of `init_parent_skill()`). Phase 1's derived-authority decision and Phase 3's fleet migration are informational dependencies (see spec.md §6), not blocking ones.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Every change in this phase is additive-and-local to the scaffolder and its own test suite: `git revert` (or a targeted `git checkout` of the pre-phase versions of) `init_skill.py` and `generate-leaf-manifest.cjs` fully restores prior scaffold behavior, and the new joined test file is deleted with no dependents. No existing skill root's committed `graph-metadata.json`, `leaf-manifest.json`, or `leaf-aliases.json` is written by this phase — only files under a NEWLY scaffolded root are touched, so rollback has zero fleet blast radius; nothing already shipped needs re-generation or re-validation. If the scoped class-gate call is found to still affect fleet-wide exit codes in some edge case despite the JSON-entry-scoping design (3.1), the safest immediate mitigation is to revert just that one call site while keeping the `derived`-block and config-default fixes, since those two are independently safe and reversible.
<!-- /ANCHOR:rollback -->
