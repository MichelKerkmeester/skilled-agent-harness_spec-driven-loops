# Review Iteration 003

## Dispatcher

- Mode: review (fan-out lineage `pi-1`), target agent `@deep-review`, resolved route `Resolved route: mode=review target_agent=deep-review`.
- Target: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` (spec-folder).
- Dimension: traceability.
- Operator focus: every phase's shipped work against its goal criteria, including the phase 014 fixes and the advisor scorer change it made.
- Focus addressed in this iteration: the parent goal's seven completion criteria and phase 014's acceptance rows were checked against the files they name, with the two core traceability protocols run in full.

## Files Reviewed

- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/goal.md:44-52` (completion criteria), `spec.md:53`, `graph-metadata.json:54`
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/006-verification/spec.md:23`, `006-verification/graph-metadata.json:37`
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/research/deep-research-state.jsonl`, `001-research/research/research.md`
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/003-mode-relocation/goal.md`, `004-bladebro-mode/goal.md`
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/005-routing-and-surfaces/spec.md:23,140,149,171`
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/014-fix-deep-review-findings/{acceptance-criteria.md,tasks.md}`
- `.skilled/skills/mcp-browser-use/{mode-registry.json,hub-router.json,description.json,SKILL.md}` (versions and names)
- `.skilled/skills/mcp-tooling/mode-registry.json` (six modes)
- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/{SKILL.md,changelog/}`, `mcp-aside-devtools/{SKILL.md,changelog/}`, `mcp-bladebro/{SKILL.md,changelog/}`
- `.skilled/skills/mcp-browser-use/{mcp-chrome-devtools,mcp-aside-devtools,mcp-bladebro}/manual-testing-playbook/manual-testing-playbook.md`
- `.skilled/skills/mcp-browser-use/{mcp-chrome-devtools,mcp-aside-devtools,mcp-bladebro}/benchmark/reports/`
- `.skilled/skills/mcp-browser-use/mcp-bladebro/benchmark/reports/2026-11-22--manual-testing-playbook--clickup-real-browser/{README.md,results.csv}`
- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/INSTALL-GUIDE.md:60-81` (pin table)
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/examples/repl-evidence-capture.sh:25`
- `.skilled/commands/doctor/assets/mcp-mutation-class-manifest.yaml:43-70`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Two packets carry a derived `in_progress` status while their docs say Complete, and AC-008 claims they agree** -- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/graph-metadata.json:54` -- The parent `spec.md:53` and `goal.md` both read Complete with `completion_pct: 100`, but the parent `graph-metadata.json` derived block still says `"status": "in_progress"`; `006-verification` repeats the pattern (`spec.md:23` Complete, `graph-metadata.json:37` in_progress). AC-008's verification is "read of the three files' status, `completion_pct` and `next_safe_action`" and its closure line says "the parent spec, goal and graph metadata name the same status and next action" (`014-fix-deep-review-findings/acceptance-criteria.md:61,106`). Two of the three names disagree, so the row's evidence sentence is wrong even though the packet status itself is defensible.
   Finding class: `doc_code_parity`
   Scope proof: both files are inside the review target; the four sibling packets checked (001, 013, 014 complete, 006 in_progress) show the field is meant to track packet status.
   Affected surface hints: skill-graph freshness and query surfaces that read `derived.status`; the parent's completion claim; 014's closure evidence.
   Case: an operator or tool reads `graph-metadata.json` to decide whether the packet is done and is told `in_progress` for a packet whose spec says Complete.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | pass | Parent criterion 1: 12 iteration records and `research.md` exist (`001-research/research/deep-research-state.jsonl`). Criterion 2: the hub registry lists three modes and `mcp-tooling` six (`.skilled/skills/mcp-browser-use/mode-registry.json`, `.skilled/skills/mcp-tooling/mode-registry.json`). Criterion 3: `rg 'mcp-tooling/mcp-(chrome-devtools\|aside-devtools)'` over `.skilled` prints nothing outside changelog and benchmark reports, and the five named `mcp-tooling` files carry neither id. Criterion 6: three playbook roots exist with recorded runs, including the Bladebro macOS live runs. Criterion 5: the 2026-11-24 replay records both stages passing on the three mode rows (`results.csv` MBU-R-01..03). Criteria 4 and 7 depend on `parent-skill-check.cjs` and `validate.sh --strict --recursive`, which this read-only lineage must not run; their packet-recorded results are named as recorded, not re-observed. |
| `checklist_evidence` | pass | Sampled and verified: the parity test's five assertions (one parity test plus two per installer) match `pass 5`; `bash -n` exits 0 on all five browser shell scripts; `browser-debugger-cli` is pinned at `0.6.10` in every live install line; `--ignore-scripts` and the launcher digests are present; the Aside example defaults `SESSION_DIR=./tmp`; BB-015 states the Chrome 136+ precondition; the ClickUp report discloses that raw output was not retained and records its one FAIL honestly. One row's evidence sentence is overstated (AC-002/CHK-030, iteration 1 P2) and one AC-008 claim is contradicted by the packet's own metadata (this iteration's P2). |
| `playbook_capability` | pass | Each mode's playbook root names its scenarios and its latest recorded run, and the Bladebro root points at the 2026-11-22 ClickUp report that records 4 PASS and 1 FAIL with reasons. |
| `skill_agent` | notApplicable | No agent definition under `.skilled/agents/` references the hub or its modes, so the target has no agent binding to check. |

## Integration Evidence

- Advisor surface: the hub is reachable through the advisor's `mcp-browser-use` identity and the replay records both stages (`.skilled/skills/mcp-browser-use/benchmark/reports/compiled-routing/2026-11-24--two-stage-replay--compiled/results.csv`).
- Mutation-class guard: `.skilled/commands/doctor/assets/mcp-mutation-class-manifest.yaml:43-70` lists all three browser packets, and `.skilled/commands/doctor/scripts/check-mcp-mutation-class.sh:148-157` covers `skills/mcp-browser-use/mcp-*/scripts/*.sh` and `mcp-servers/*/setup.sh`.
- Version authority: the hub `SKILL.md` `version: 1.1.2.0`, `mode-registry.json`, `hub-router.json` and `description.json` all carry `1.1.2.0`, and each mode packet's `version` matches its own newest changelog entry (`mcp-chrome-devtools 1.0.28.0`, `mcp-aside-devtools 1.1.13.0`, `mcp-bladebro 1.2.1.0`).

## Edge Cases

- `parent-skill-check.cjs` and `validate.sh --strict --recursive` were not run because this lineage may not execute repository tooling; their claims are recorded evidence, not re-observed results, and the `spec_code` pass rests on the surfaces those commands check, inspected directly.
- `derived.status` in `graph-metadata.json` may be regenerated by graph tooling rather than authored; the finding is against AC-008's agreement claim, not against a missing regeneration step.
- 005 remains Partial by its own record (REQ-003 met at the default threshold only, REQ-008 after relabeling); the parent discloses this, so it was not raised as drift.

## Confirmed-Clean Surfaces

- Hub metadata versions agree with the newest hub changelog entry, and every mode packet's frontmatter version matches its own changelog.
- The six `mcp-tooling` modes remain unchanged and none of the five named `mcp-tooling` files names a browser mode.
- Phase 014's 60 checklist rows are all checked, and the sampled evidence holds for the parity test, the pins, the install hardening, the Aside default and the BB-015 precondition.

## Ruled Out

- **A browser mode still lives inside `mcp-tooling`.** Ruled out by the exact search in parent criterion 3.
- **A packet version disagrees with its changelog.** Ruled out for the hub and all three modes.
- **The Bladebro playbooks hide their one FAIL.** Ruled out: the report records BB-012 FAIL with a reason, and the playbook root links that report as the latest recorded run.

## Next Focus

- Dimension: maintainability
- Focus area: the size and shape of the phase 014 commit, duplicate authorities between `mode-registry.json` aliases and `hub-router.json` vocabulary, and doc weight in the Chrome packet.
- Reason: traceability is swept; maintainability is the last uncovered dimension before a cross-reference pass.
- Rotation status: correctness, security and traceability complete; maintainability next.
- Blocked/productive carry-forward: productive — cross-file claims (`AC-008` versus the metadata it cites) are where drift hides.
- Required evidence: `file:line` for each finding and a named follow-on change cost.

## Verdict

Review verdict: CONDITIONAL
