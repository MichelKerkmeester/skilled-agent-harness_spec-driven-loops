---
title: "Goal: Derive SOURCE quality_class at the graph upsert choke point"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "source diversity quality class goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/007-source-diversity-quality-class"
    last_updated_at: "2026-11-17T17:15:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-11-17-expansive-depth-goals"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Derive SOURCE quality_class at the graph upsert choke point

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** `quality_class` on every research SOURCE node comes from the upsert step, from a closed vocabulary, so citing sources of more distinct derived classes is the only way to raise source diversity.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The value is derived in `upsert.cjs` at upsert time from the node's `path`, then `name`, then `id`, not at query time in `computeResearchSourceDiversityFromData`. |
| D2 | The vocabulary is `repo-code`, `repo-test`, `repo-spec`, `skill-doc`, `ledger-state`, `external-doc`, `external-other` and `unclassified`, held in one frozen exported constant beside `SAFE_METADATA_KEYS`. |
| D3 | The 1.5 threshold and the averaging rule in `coverage-graph-signals.ts` do not change, `unclassified` counts as a class, and review nodes and non-SOURCE nodes keep their metadata. A question answered from one derived class blocks by design. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] An `upsert-script` case that upserts a research SOURCE node with `path: ".skilled/agents/deep-research.md"`, a free-text label and `metadata.quality_class: "primary"` stores the class derived from the path, not `primary` and not `unclassified`.
- [x] An `upsert-script` case with SOURCE nodes identified by a repo code path, a test path, a spec path, a skill doc, a state ledger file, an external doc URL, another URL and free text stores `repo-code`, `repo-test`, `repo-spec`, `skill-doc`, `ledger-state`, `external-doc`, `external-other` and `unclassified`.
- [x] `rg -n "Object.freeze" .skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-query.ts` prints the constant within 20 lines of `SAFE_METADATA_KEYS`, and `upsert.cjs` reads that constant instead of repeating the values.
- [x] A `convergence-script` case reports `sourceDiversity` 2.0 for two findings citing sources of two different derived classes and 1.0 when both share one class, and a code-only fixture citing a `.cjs` file and its `.vitest.ts` test reports 2.0 with no `source_diversity_guard` blocker.
- [x] An `upsert-script` case stores a FINDING's `metadata.confidence` and a review node's metadata exactly as given.
- [x] `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/coverage-graph-signals.vitest.ts tests/integration/convergence-script.vitest.ts tests/integration/upsert-script.vitest.ts tests/unit/deep-research-graph-upsert.vitest.ts` exits 0, and `rg -l "quality_class" .skilled/skills/system-deep-loop/runtime/manual-testing-playbook/coverage-graph` lists a scenario written by `/create:manual-testing-playbook`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG
<!-- FILL: Record each step with its command output. Keep this table current. GOOD: T001 Done. `ls logs/archive | wc -l` printed 3. WEAK: Progress is good. -->

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phase spec authored | Done | `spec.md`, `plan.md`, `tasks.md` written 2026-11-17 |
| Implementation | Done (code and tests) | 2026-11-17 in worktree `459-ed-007-source-diversity-quality`. `SOURCE_QUALITY_CLASS` at `coverage-graph-query.ts:141`; derivation in `upsert.cjs`. Four suites: 76 passed, exit 0 (baseline 69). Fail-before proven by reverting the two source files: 14 of 50 failed |
| Playbook and changelog | Done for 007, walk open | 2026-11-17, `@markdown`: `DLR-061` written through the update-mode steps (`validate-playbook-package.cjs` PASS, 53 scenarios); `rg -l quality_class` lists it. Changelog `v2.1.1.0` (DQI 89), with step 6 moving the hub version carriers to 2.1.1.0 (parent-skill-check PASS). The four named vitest suites were re-run here: 4 files, 76 of 76 passed, exit 0. The scenario walk is not run. |

### Deviations and findings

| Item | Note |
|------|------|
| Goal source | This phase has no `acceptance-criteria.md`; the criteria come from the REQ table in `spec.md` §4, as the authoring brief directed. |
| Open questions | None open. `spec.md` §7 records the planning answers: `unclassified` counts (D3), and the pack already requires `path` on file SOURCE nodes, which the derivation reads first (D1). |
| Changelog | Added T012 from the cross-phase handoff §3 (default-path change). Blocked by the same `@markdown` gate. |
| T007 rg check | The strip cases send `quality_class: 'primary'` on purpose (REQ-001), so the T007 rg is clean only over the seeded fixtures. |
| Plan review | The 2026-11-17 plan review findings were applied: derive from `path` first, wording changed from distinct sources to distinct derived classes, a code-only fixture that must pass, runnable test commands, and this phase's own playbook scenario. |
| 2026-11-18 00:1x | Completion boxes in `tasks.md` closed: all tasks were ticked with evidence, and the integration gate `adedc72e930` (all phases 001-013 merged): 190 files, 3358 passed, 11 skipped, 0 failed, against baseline `c9d8ff4` with 3095 passed and 0 failed. |
<!-- /ANCHOR:log -->
