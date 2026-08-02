---
title: "Tasks: playbook standard enforcement and fleet normalization"
description: "The sk-doc operator-scenario contract has no mechanical check anywhere in the repository, so every playbook coverage claim in the fleet is hand-typed prose that has drifted. This keystone phase settles the corpus-split and verdict rulings, builds the missing operator-contract validator with paired fixtures and fail-closed CI wiring, derives a per-hub coverage map from live registries, and normalizes all 11 playbook roots to a derived census."
trigger_phrases:
  - "playbook standard and fleet normalization task list"
  - "playbook scenario coverage task list"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/024-playbook-scenario-coverage/001-playbook-standard-and-fleet-normalization"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the phased task breakdown"
    next_safe_action: "Execute T001 confirm-against-HEAD before further tasks"
    blockers: []
    key_files:
      - "tasks.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: Playbook Standard Enforcement and Fleet Normalization

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

Status: **In Progress** — the BUILD leaf has completed the scoped validator, manifest, fixtures, doctrine, template,
and decision-record work; fleet repair and consumer changes remain pending.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Confirm against HEAD, then settle the rulings (Lane A)

**Nothing in this phase edits a file until T001-T008 are recorded.** Two of the load-bearing claims behind this
child came from the synthesis author's own inspection, not from the research loop, and are re-tested here before
they are written into a decision record.

- [ ] T001 Re-run the 11-hub topology sweep and record the table, including the exit code of every run
      (`node .opencode/skills/sk-doc/sk-create-skill/scripts/validate-playbook-topology.cjs --skill-dir .opencode/skills/<hub> --format json`).
- [ ] T002 [P] Re-count every root's census against the walked tree; record the five deltas
      (`find .opencode/skills/<hub>/manual-testing-playbook -name '*.md' | wc -l` and the category-dir count).
- [ ] T003 [P] Re-count numeric-prefixed scenario filenames fleet-wide
      (`find .opencode/skills/*/manual-testing-playbook -name '[0-9]*-*.md'`) — expect 10, all in one hub.
- [ ] T004 [P] Re-run `grep -l PARTIAL .opencode/skills/*/manual-testing-playbook/manual-testing-playbook.md` — expect 11 of 11.
- [ ] T005 [P] Re-run the `system-spec-kit` root's own embedded census check and confirm it still returns 0 against
      its asserted total; record the real walked count alongside it.
- [ ] T006 Re-read the topology gate's boundary resolution and its exit path, and confirm both the fail-open exit
      and the boundary source, **before** designing anything that depends on either.
- [ ] T007 Re-read the governing standard's verdict-enum section and the topology gate's verdict comment; confirm
      the enum is already ruled and only the template and roots are stale.
- [ ] T008 Confirm `sk-create-manual-testing-playbook/` still has no `scripts/` directory — the single fact this
      whole child rests on.
- [x] T009 **Enumerate the per-feature required-content field set** against the standard's §3, distinguishing
      unconditional from conditional fields, and pin the number. Record the enumeration; do not carry the
      synthesis's "nine-field" shorthand forward unverified.
      Evidence: `SKILL.md` and `validate-playbook-package.cjs` implement the pinned field set.
- [x] T010 Take the corpus-split ruling (**OPERATOR-DECISION Q2**) and record it in `decision-record.md`,
      including the secondary cross-hub-coverage ruling. The accepted mechanism retains explicit whole-tree
      overrides and classifies all other files by the typed routing-gold signature.
- [ ] T011 [B] Take the shared-helper location ruling (**OPERATOR-DECISION Q1**) and record it.
- [x] T012 Amend `assets/manual-testing-playbook-template.md`: remove legacy scenario- and feature-level verdict
      replace hand-typed census language with derived-census language.
- [x] T013 [P] Amend `assets/manual-testing-playbook-snippet-template.md` to match the pinned field set from T009.
- [x] T014 [P0] Correct mixed-hub corpus classification to use the per-file typed routing-gold signature, retain
      homogeneous whole-tree overrides in `playbook-corpus-manifest.json`, and add a fixture proving signature-bearing
      files are skipped from the operator audit. Evidence: fixture suite passed with 33 assertions and the fleet run
      reduced the sk-design and system-deep-loop operator backlogs.
<!-- /ANCHOR:phase-1 -->


---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Build the validator (Lane B)

Each check lands with its paired positive and negative fixture in the same commit. A check without a negative
fixture is not done.

- [x] T020 Scaffold `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs`
      with the exit-code contract (0 conforming / 1 violations / 2 usage or boundary) and strict-by-default.
- [x] T021 Implement `--help` output that names both contracts and states which one this validator enforces (REQ-002).
- [x] T022 Implement the five-section structure check (REQ-003) + fixtures. Evidence: `validate-playbook-package.test.cjs` passed the paired structure assertions.
- [x] T023 [P] Implement the frontmatter and 4-part `version` check (REQ-004) + fixtures.
- [x] T024 Implement the required-content check against the T009 field set (REQ-005) + one negative fixture per
      unconditional field and one conditional-trigger fixture per conditional field.
      Evidence: `validate-playbook-package.test.cjs` passed the required-content assertions.
- [x] T025 [P] Implement the verdict-enum check (REQ-006) + fixture; the negative fixture seeds a legacy verdict
      without editing any live scenario file.
      Evidence: `validate-playbook-package.test.cjs` passed the seeded legacy-verdict assertion.
- [x] T026 [P] Implement the filename, category-name, and one-file-per-ID checks (REQ-007) + fixtures. Evidence: `validate-playbook-package.test.cjs` passed naming and duplicate-ID assertions.
- [x] T027 Implement the root-index ↔ file bijection check (REQ-008) + orphan and phantom-row fixtures. Evidence: `validate-playbook-package.test.cjs` passed orphan and phantom-row assertions.
- [x] T028 Implement the derived-census check (REQ-009) + fixtures. Evidence: `validate-playbook-package.test.cjs` passed derived-count and hand-typed-warning assertions.
- [x] T029 [P] Implement local link and cited-path resolution (REQ-010) + fixtures. This is the backstop child `002` consumes. Evidence: `validate-playbook-package.test.cjs` passed local-link assertions.
- [x] T030 [P] Implement the evergreen-truth check — no developer-absolute paths, no baked run transcripts
      (REQ-011) + fixtures; the report names file and line, never the matched string.
      Evidence: `validate-playbook-package.test.cjs` passed evergreen-path and dated-transcript assertions.
- [x] T031 Implement placeholder detection (REQ-012) + fixtures; the negative fixture exercises a retired
      runtime-and-backend placeholder. Evidence: `validate-playbook-package.test.cjs` passed placeholder assertion.
- [ ] T032 Land the shared count-derivation helper at the Q1-ruled location, with the single-definition-site test (REQ-020).
- [ ] T033 Flip `validate-playbook-topology.cjs` to strict-by-default (REQ-021); assert non-zero exit without an
      explicit `--strict` on a hub with blocked fixtures.
- [ ] T034 [B] If Q2 ruled "move": execute the cutover as ONE commit — gate boundary, Lane-C loader path, and the
      files — with a pre/post fixture-count assertion on a benchmark run. Blocked on T010.
- [ ] T035 Write the determinism test: same tree in, same report out, independent of traversal order (NFR-R01).

### Derive the coverage map (Lane C)

- [ ] T040 Build the per-hub expected inventory from `mode-registry.json`, `command-metadata.json`, public MCP tool
      schemas, and registered hooks/adapters.
- [ ] T041 Add the weaker-signal derivation for single skills without a `mode-registry.json`, and label its output
      as weaker in the report — do not let it read as equally authoritative.
- [ ] T042 Join the inventory to indexed scenario IDs; emit the uncovered-inventory report.
- [ ] T043 Wire `feature-catalog/` in as a **widening-only** cross-check; assert in a test that it can only add
      expected features, never remove them.
- [ ] T044 Prove reproducibility: two consecutive runs on an unchanged tree diff clean (REQ-023).
- [ ] T045 Record the catalog ceiling as a known limitation if the catalog integrity track has not landed its
      gated validator by this point.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Normalize the fleet and wire CI (Lane D)

- [ ] T050 Sweep all 11 roots onto derived censuses; fix the five census errors.
- [ ] T051 [P] Migrate the verdict vocabulary in all 11 roots to `PASS`/`FAIL`/`SKIP`; a `SKIP` must name its blocker.
- [ ] T052 [P] Sync playbook version drift against `mode-registry.json`.
- [ ] T053 Index the 3 shipped-but-unindexed CLI scenario files.
- [ ] T054 Remove the retired placeholder from the coverage denominator.
- [ ] T055 Rename the 10 numeric-prefixed scenario files; scenario IDs unchanged.
- [ ] T056 Run a **repository-wide** link-resolution pass (not playbook-scoped) and prove zero new broken links (REQ-022).
- [ ] T057 Replace the `system-spec-kit` dead release census glob with a category-agnostic derivation that returns
      the real walked count (REQ-024).
- [ ] T058 Migrate the advisor hub's baked `BLOCKED` results and developer-absolute-path scenarios into
      `<skill>/benchmark/reports/<dated-run>/`, consuming the structure the predecessor packet already built.
- [ ] T059 [B] Reclassify `system-spec-kit` NOT READY per **OPERATOR-DECISION Q7**; note that its two live contrary
      results are repaired by child `002`, not here.
- [ ] T060 Record the exemption in the `sk-prompt` root if **OPERATOR-DECISION Q5** rules that `sk-prompt-models`
      owes no playbook, so the question stops recurring at every audit.
- [ ] T061 Wire the validator into CI and the pre-push gate, fail-closed; assert the invocation does not pass `--no-strict`.
- [ ] T062 Write the seeded-violation test proving CI exits non-zero (REQ-014, SC-003).
- [ ] T063 Write the test that fails if any root reintroduces a hand-typed count (SC-004).
- [ ] T064 Re-run the entire SC-001 baseline and explain every delta against the pre-phase numbers.
- [ ] T065 Hand the uncovered-inventory report to child `003` and the link/path resolver to child `002`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`; no `[B]` blocked tasks remaining.
- [ ] Every P0 requirement has a paired positive and negative fixture.
- [ ] Seeded-violation test proves CI exits non-zero.
- [ ] Baseline re-run at close with every delta explained.
- [ ] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` exits 0.
- [ ] `checklist.md` fully verified with evidence.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md` (corpus-split ruling)
- **Parent**: `sk-doc/024-playbook-scenario-coverage`
- **Successors**: `002-scenario-accuracy-repair-risk-first`, `003-uncovered-workflow-authoring`
<!-- /ANCHOR:cross-refs -->

<!-- ANCHOR:build-leaf-override -->
## BUILD LEAF EXECUTION OVERRIDE

The operator supplied the fresh HEAD baseline and locked rulings in the build brief. This leaf records and executes
only the scoped work below; the broader phase tasks remain open unless they are explicitly listed as completed.

Completed in this leaf: T009 (eight unconditional checks plus three conditional checks enumerated), T010 (explicit
whole-tree override plus per-file signature ruling recorded), T012-T014, and T020-T031 (validator checks with paired
fixture assertions). T011 and T032
remain deferred because the shared-helper location is not part of this leaf. T033-T065 remain deferred because they
would modify a sibling gate, consumers, scenario content, fleet files, CI, or the coverage-map workstream.

Evidence is maintained in `implementation-summary.md`; status remains In Progress until the scoped gates and packet
validation are complete.
<!-- /ANCHOR:build-leaf-override -->
