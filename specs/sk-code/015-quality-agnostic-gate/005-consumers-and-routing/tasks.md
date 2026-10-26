---
title: "Tasks: Phase 5: consumers-and-routing"
description: "Ordered tasks for the Phase 5 readers, quality rows, validators, routing vocabulary, mirrors, versions and tests, each with a verify command and its expected output."
trigger_phrases:
  - "consumers and routing tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.3 -->
# Tasks: Phase 5: consumers-and-routing

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

Paths are repository-relative. The hub folder is `.skilled/skills/sk-code`, and the packet folder is `specs/sk-code/015-quality-agnostic-gate/005-consumers-and-routing`. The Claude mirror is `.claude/agents`, the Codex mirror is `.codex/agents` and the Pi mirror is `.pi/agents`.

**Task Format**: `T### [P?] Description (file path)`, then a verify clause that gives the command and the output it must print.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

Setup confirms the earlier phases and records the baselines. It edits no file.

- [ ] T001 Confirm the Phase 2 runner artifacts exist (`.skilled/skills/sk-code/sk-code-quality/references/runner-contract.md` and `.skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs`). Verify: `test -f .skilled/skills/sk-code/sk-code-quality/references/runner-contract.md && test -f .skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs && echo PHASE2_READY` prints `PHASE2_READY`.
- [ ] T002 Confirm the Phase 4 Iron Law wording is in place (`.skilled/skills/sk-code/shared/references/phase-detection.md`). Verify: `rg -n 'universal floor' .skilled/skills/sk-code/shared/references/phase-detection.md` prints at least one line.
- [ ] T003 [P] Re-run the mirror baseline before any edit (no file written). Verify: `node .skilled/bin/check-agent-mirror-sync.cjs --all` prints `all mirrors in sync` and exits 0.
- [ ] T004 [P] Re-run the drift guard baseline before any edit (no file written). Verify: `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` prints `run-all-drift-guards: all 4 guards PASSED`.
- [ ] T005 [P] Re-run the stage-one CI canary before any edit (no file written). Verify: `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "run the quality gate on my edited .github/workflows/ci.yml"` prints `"selectionKind":"single"`.
- [ ] T006 [P] Record the stage-two baseline for "apply yagni to this change" before any edit (no file written). Verify: `node -p 'JSON.stringify(require(process.cwd() + "/.skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs").routeSkillResources({skillRoot: process.cwd() + "/.skilled/skills/sk-code", taskText: "apply yagni to this change"}).surfaceIntents)'` prints `[]`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Readers of the run verdict

- [ ] T007 Confirm that phase 004 named the run-verdict fields and the three readers inside step 2 of the verify loop. Read only, because phase 004 owns every `workflow-verify.md` edit (its ADR-004) (`.skilled/skills/sk-code/shared/references/workflow-verify.md`, step 2 at line 56). Verify: `rg -n 'checker_outputs' .skilled/skills/sk-code/shared/references/workflow-verify.md` prints one line inside step 2.
- [ ] T008 Confirm that the unknown-surface asking and the step 1 and step 2 numbering survived phase 004. Read only (`.skilled/skills/sk-code/shared/references/workflow-verify.md`, lines 47 and 55). Verify: `rg -n 'before claiming anything' .skilled/skills/sk-code/shared/references/workflow-verify.md` prints lines 47 and 55.
- [ ] T009 Confirm that phase 004 named the runner call in the implementation and debug handoffs. Read only, because phase 004 owns those four lines (`.skilled/skills/sk-code/shared/references/workflow-implement.md`, lines 41 and 119, and `.skilled/skills/sk-code/shared/references/workflow-debug.md`, lines 41 and 147). Verify: `rg -n 'quality-gate.cjs' .skilled/skills/sk-code/shared/references/workflow-implement.md .skilled/skills/sk-code/shared/references/workflow-debug.md` prints two lines in each file.
- [ ] T010 Add the reader lines to the @code QUALITY step and renumber the rest (`.skilled/agents/code.md`, lines 64 to 69 and the reference at line 360). Verify: `rg -n '^[5-7]\. \*\*(QUALITY|VERIFY|RETURN)\*\*' .skilled/agents/code.md` prints three lines numbered 5, 6 and 7 in that order.
- [ ] T011 Add the `Quality Gate` RETURN field after Verification in the RETURN body, add `quality_gate` to the required fields, and point the "quality-gate result" signal at line 145 at the new field (`.skilled/agents/code.md`, lines 145, 302 to 313 and 330). Verify: `rg -n 'Quality Gate:|quality_gate' .skilled/agents/code.md` prints at least two lines.

### Agent mirrors

- [ ] T012 Hand-sync `.claude/agents/code.md` with the canonical QUALITY step, the renumbering and the RETURN field, keeping the Claude `tools:` dialect (`.claude/agents/code.md`). Verify: `rg -n '^[5-7]\. \*\*(QUALITY|VERIFY|RETURN)\*\*' .claude/agents/code.md` prints three lines numbered 5, 6 and 7.
- [ ] T013 Regenerate `.codex/agents/code.toml` with the Codex sync script, which writes when it gets no argument (`.skilled/skills/system-spec-kit/runtime/cli/codex/sync-agents.cjs`). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-agents.cjs --check` prints `PASS: 11 agents are in sync.`
- [ ] T014 Regenerate `.pi/agents/code.md` with the Pi sync script (`.skilled/skills/system-spec-kit/runtime/cli/pi/sync-agents-pi.cjs`). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/pi/sync-agents-pi.cjs --check` prints `PASS: 11 agents are in sync.`
- [ ] T015 Confirm all mirrors after T012 to T014 (`.skilled/bin/check-agent-mirror-sync.cjs`). Verify: `node .skilled/bin/check-agent-mirror-sync.cjs --all` prints `all mirrors in sync` and exits 0.

### Reviewer and CI consumers

- [ ] T016 Drop "quality gate" from the activation trigger at line 22 and the keyword trigger at line 29, and add one bullet under the Primary Detection Signal saying a run verdict is input evidence and review keeps its own severity ids (`.skilled/skills/sk-code/sk-code-review/SKILL.md`). Verify: `grep -n 'quality gate' .skilled/skills/sk-code/sk-code-review/SKILL.md` prints one line, numbered 43, that reads "Author-side quality gates before review".
- [ ] T017 Point the sk-code-ci integration line at its registry declaration (`.skilled/skills/sk-code/sk-code-ci/SKILL.md`, line 109). Verify: `rg -n 'quality.checklists' .skilled/skills/sk-code/sk-code-ci/SKILL.md` prints one line.
- [ ] T018 Rewrite the allowlist reason at line 58 so it names `workflow-verify.md` step 2 and the @code RETURN `Quality Gate` field (`.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs`). Verify: `rg -n 'workflow-verify' .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs` prints line 58.

### Quality declarations and validators

- [ ] T019 Confirm the SKILLED quality rows that phase 002 added. Read only, because phase 002 owns the hub declarations in the SKILLED entry (`.skilled/skills/sk-code/mode-registry.json`, lines 61 to 85). One row each for the conditional checklists at `Q/SKILL.md` lines 103 to 108, except the spec-folder row. Verify: `node -p 'require("./.skilled/skills/sk-code/mode-registry.json").modes.find((m) => m.workflowMode === "sk-code-skilled").quality.checklists.map((r) => r.file).join(" ")'` prints at least six values, each beginning `hub:sk-code/sk-code-skilled/assets/checklists/`.
- [ ] T020 Confirm the sk-code-ci quality row that phase 002 added. Read only, because phase 002 owns it in its entry (`.skilled/skills/sk-code/mode-registry.json`, lines 86 to 103). The row is path-only, and the entry keeps no `surfaceDetection` block. Verify: `node -p 'JSON.stringify(require("./.skilled/skills/sk-code/mode-registry.json").modes.find((m) => m.workflowMode === "sk-code-ci").quality)'` prints `{"checklists":[{"paths":[".github/workflows/**"],"file":"hub:sk-code/sk-code-ci/references/ci-workflow-standards.md"}]}`.
- [ ] T021 Confirm that phase 002 added `QUALITY_DECLARATION_INVALID` beside `SURFACE_DETECTION_INVALID` in the registry compiler (`.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/registry-compiler.cjs`, around lines 250 to 278). Verify: `rg -n 'QUALITY_DECLARATION_INVALID' .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/registry-compiler.cjs` prints at least one line.
- [ ] T022 Allow the `quality` top-level key beside `surface_detection`, and add a `GRAPH_METADATA_INVALID_QUALITY` validator beside the surface detection check. Comments state the durable reason only (`.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs`, lines 80 to 88 and 472 to 489). Verify: `rg -n "'quality'|GRAPH_METADATA_INVALID_QUALITY" .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` prints at least two lines.
- [ ] T023 Add the `quality` key row and the `GRAPH_METADATA_INVALID_QUALITY` row to the contract table (`.skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md`, beside lines 130 and 147). Verify: `rg -n 'GRAPH_METADATA_INVALID_QUALITY' .skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md` prints one line numbered after 147.
- [ ] T024 Add metadata gate cases: a valid quality block passes, and a block with an `argv` key fails with `GRAPH_METADATA_INVALID_QUALITY` (`.skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-root-metadata-contract.test.cjs`). Verify: `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-root-metadata-contract.test.cjs --test-name-pattern quality` prints `# fail 0`.
- [ ] T025 Create the registry compiler negative test. It calls the exported `compileRegistry` on a fixture hub with a malformed quality row, and it expects `QUALITY_DECLARATION_INVALID`. Comments state the durable reason only (`.skilled/bin/tests/quality-declaration.test.cjs`). Verify: `node --test .skilled/bin/tests/quality-declaration.test.cjs` prints `# fail 0`.

### Routing vocabulary

- [ ] T026 Add "comment hygiene", "restraint", "yagni", "simplify", "over-engineering" and "bloat" to the CODE_QUALITY INTENT_SIGNALS keywords (`.skilled/skills/sk-code/ROUTER.md`, line 242). Verify: `rg -n '"CODE_QUALITY": +\{' .skilled/skills/sk-code/ROUTER.md` prints one line that contains both `yagni` and `bloat`.
- [ ] T027 Add the runner-contract resource to the CODE_QUALITY RESOURCE_MAP (`.skilled/skills/sk-code/ROUTER.md`, lines 268 to 282). Keep the SKILLED language checklists, as ADR-003 records. Verify: `rg -n 'runner-contract.md' .skilled/skills/sk-code/ROUTER.md` prints one line inside the CODE_QUALITY map.
- [ ] T028 Bump the ROUTER.md document version from `2.2.21.0` to the next minor, `2.3.0.0` at this tree (`.skilled/skills/sk-code/ROUTER.md`, line 17). Verify: `rg -n '^version:' .skilled/skills/sk-code/ROUTER.md` prints `17:version: 2.3.0.0`.
- [ ] T029 Carry "comment hygiene", "yagni" and "over-engineering" into `intent_signals`, and leave "simplify" out (`.skilled/skills/sk-code/graph-metadata.json`). Verify: `node -p 'JSON.stringify(["comment hygiene", "yagni", "over-engineering", "simplify"].map((k) => require("./.skilled/skills/sk-code/graph-metadata.json").intent_signals.includes(k)))'` prints `[true,true,true,false]`.
- [ ] T030 Add "comment hygiene" to the description keywords (`.skilled/skills/sk-code/description.json`). Verify: `node -p 'require("./.skilled/skills/sk-code/description.json").keywords.includes("comment hygiene")'` prints `true`.
- [ ] T031 Move "alignment verifier" and "stable jsonl keys" from the sk-code-quality aliases (line 37) to the sk-code-skilled aliases (line 74) (`.skilled/skills/sk-code/mode-registry.json`). Verify: `node -p 'JSON.stringify(require("./.skilled/skills/sk-code/mode-registry.json").modes.map((m) => [m.workflowMode, m.aliases.filter((a) => ["alignment verifier", "stable jsonl keys"].includes(a))]))'` prints `[["sk-code-quality",[]],["sk-code-review",[]],["sk-code-skilled",["alignment verifier","stable jsonl keys"]],["sk-code-ci",[]]]`.
- [ ] T032 Move "stable jsonl keys", "add set -euo pipefail" and "alignment verifier" from the quality-gates class (line 50) to the end of the code-skilled-runtime class, in that order (`.skilled/skills/sk-code/hub-router.json`, lines 50 and 71). Verify: `node -p 'JSON.stringify(["quality-gates", "code-skilled-runtime"].map((c) => require("./.skilled/skills/sk-code/hub-router.json").vocabularyClasses[c].keywords.filter((k) => ["stable jsonl keys", "add set -euo pipefail", "alignment verifier"].includes(k))))'` prints `[[],["stable jsonl keys","add set -euo pipefail","alignment verifier"]]`.

### Versions

- [ ] T033 Set the hub version to the next minor above its value at landing in four carriers: `SKILL.md` line 5, `hub-router.json` line 3, `mode-registry.json` line 3 and `description.json` line 4. Phases 001 to 004 take the hub to `3.3.1.0`, so that is `3.4.0.0`. Verify: `node -p 'JSON.stringify([require("./.skilled/skills/sk-code/hub-router.json").version, require("./.skilled/skills/sk-code/mode-registry.json").version, require("./.skilled/skills/sk-code/description.json").version])'` prints `["3.4.0.0","3.4.0.0","3.4.0.0"]`, and `rg -n '^version:' .skilled/skills/sk-code/SKILL.md` prints `5:version: 3.4.0.0`.
- [ ] T034 Bump the touched packet versions one step above their value at landing: `sk-code-review/SKILL.md` line 5 to `1.9.0.0`, `sk-code-skilled/SKILL.md` line 5 to `2.0.3.0` (phase 004 takes it to `2.0.2.0`) and `sk-code-ci/SKILL.md` line 5 to `1.1.1.0`. The three shared workflow references are phase 004's, so this phase bumps none of them. Verify: `rg -n '^version:' .skilled/skills/sk-code/sk-code-review/SKILL.md .skilled/skills/sk-code/sk-code-skilled/SKILL.md .skilled/skills/sk-code/sk-code-ci/SKILL.md` prints three lines, one per file, carrying the values `1.9.0.0`, `2.0.3.0` and `1.1.1.0` in that order.
- [ ] T035 Write real changelog files for the hub (`.skilled/skills/sk-code/changelog/v3.4.0.0.md`) and for the three touched packets (`sk-code-review/changelog/v1.9.0.0.md`, `sk-code-skilled/changelog/v2.0.3.0.md`, `sk-code-ci/changelog/v1.1.1.0.md`), using `.skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md`. Verify: `find .skilled/skills/sk-code -path '*/changelog/*' -type l` prints nothing, which proves no changelog is a symlink.

### Derived metadata, leaf manifest and compiled routing

- [ ] T036 Regenerate the derived block of the hub metadata with `node .skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs --root .skilled/skills/sk-code --write`. Verify: `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-derived-freshness.cjs --format json` prints `"stale": 0`.
- [ ] T037 Regenerate the leaf manifest with the generator, never by hand (`.skilled/skills/sk-code/leaf-manifest.json`). Verify: `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --check .skilled/skills/sk-code` prints `leaf-manifest.json OK`.
- [ ] T038 Re-sync the compiled routing copies after the registry and vocabulary edits. Run the sync check first. If it reports a mismatch, run `node .skilled/bin/compiled-route-sync.cjs` without flags to copy, and record the change in the implementation summary. Verify: `node .skilled/bin/compiled-route-sync.cjs --check` prints `all 55 served copies match their authored files` and exits 0.

### Fixtures and stage-two test

- [ ] T039 Create the stage-two restraint test. It loads `router-replay-lib.cjs`, asserts CODE_QUALITY in `surfaceIntents` for "apply yagni to this change", and asserts that `simplify` is absent from the stage-one `intent_signals`. Comments state the durable reason only (`.skilled/skills/sk-code/sk-code-skilled/scripts/tests/router-stage-two-quality.test.cjs`). Verify: `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/router-stage-two-quality.test.cjs` prints `# fail 0`.
- [ ] T040 Add fixture F15 to the Phase 2 runner test file. The fixture hub holds `local-example` with `surface_detection` and `quality`. The test asserts the checklist is listed, the label EXAMPLE appears and no `local-` text reaches the envelope (`.skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate.test.cjs`). Verify: `node --test .skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate.test.cjs --test-name-pattern F15` prints `# fail 0`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T041 Run the sk-code-skilled test glob the way CI runs it (`.skilled/skills/sk-code/sk-code-skilled/scripts/tests/`). Verify: `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/*.test.cjs` prints `# fail 0`.
- [ ] T042 Run the four drift guards (`.skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh`). Verify: `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` prints `run-all-drift-guards: all 4 guards PASSED`.
- [ ] T043 Run the metadata gate across all roots (`.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs`). Verify: `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` prints `failed=0` and exits 0.
- [ ] T044 Run the skill-graph compiler, which the successor gate runs (`.skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py`). Verify: `python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py --validate-only` prints `VALIDATION PASSED` and exits 0.
- [ ] T045 Run the parent-skill check on the hub, and read its subject line (`.skilled/commands/doctor/scripts/parent-skill-check.cjs`). Verify: `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code` prints `OK: parent-skill-check` and exits 0.
- [ ] T046 Run the intent carry gate (`.skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs`). Verify: `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs --check --hub sk-code` prints `missing=0` and exits 0.
- [ ] T047 Run the derived freshness and leaf freshness gates a final time (`.skilled/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs`). Verify: `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs` prints `checked=14 fresh=14 failed=0`.
- [ ] T048 Run the mirror check after every mirror edit. Verify: `node .skilled/bin/check-agent-mirror-sync.cjs --all` prints `all mirrors in sync` and exits 0.
- [ ] T049 Replay canary 1 and canary 3 from plan.md section 5 after the edits, and record the exact output. Verify: `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "quality gate for my rails app before I claim done"` prints `"workflowMode":"sk-code-quality"`.
- [ ] T050 Replay canary 2 after the edits and record its stage-one `selectionKind`. The design expects `surfaceBundle`. Any other value goes to ADR-006 and AC-018 unchanged. Verify: `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "run the quality gate on my edited .github/workflows/ci.yml"` prints `"selectionKind":"surfaceBundle"`.
- [ ] T051 Replay canaries 4 and 5 from plan.md section 5 after the edits. Verify: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"check comment hygiene on these files"}' --format json` lists `sk-code` with a confidence of 0.8 or above in its recommendations, and the same command with the prompt "simplify this README paragraph" lists no `sk-code` recommendation at 0.8 or above.
- [ ] T052 Replay the out-of-domain phrases for each new stage-one phrase (canary 7 in plan.md section 5), and record the result for each. Verify: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"write a README paragraph about over-engineering a cake recipe"}' --format json` lists no `sk-code` recommendation at 0.8 or above.
- [ ] T053 Replay the stage-two canary 6 and record its `surfaceIntents`. Verify: `node -p 'JSON.stringify(require(process.cwd() + "/.skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs").routeSkillResources({skillRoot: process.cwd() + "/.skilled/skills/sk-code", taskText: "apply yagni to this change"}).surfaceIntents)'` prints an array that contains `CODE_QUALITY`.
- [ ] T054 Check the packet with the strict validator, and record its `RESULT:` line (`.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/015-quality-agnostic-gate/005-consumers-and-routing --strict --no-recursive` prints `RESULT: PASSED`.
- [ ] T055 Check the spec document with the document validator. Repeat the same check for `plan.md`, `tasks.md`, `acceptance-criteria.md` and `decision-record.md`, and each must exit 0 (`specs/sk-code/015-quality-agnostic-gate/005-consumers-and-routing/spec.md`). Verify: `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py --type spec specs/sk-code/015-quality-agnostic-gate/005-consumers-and-routing/spec.md` exits 0.
- [ ] T056 Confirm the working tree changed only files named in the spec file table. Verify: `GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=core.fsmonitor GIT_CONFIG_VALUE_0=false git status --short -- .skilled .claude .codex .pi specs/sk-code/015-quality-agnostic-gate/005-consumers-and-routing` prints only paths listed in spec.md section 3.
- [ ] T057 Empty the scratch folder of this packet, keeping its `.gitkeep` (`specs/sk-code/015-quality-agnostic-gate/005-consumers-and-routing/scratch/`). Verify: `ls -A specs/sk-code/015-quality-agnostic-gate/005-consumers-and-routing/scratch` prints `.gitkeep`.
- [ ] T058 Run the full sk-code setup battery after every edit, because design Phase 5 acceptance requires it to pass and phase 003 added its quality leg (REQ-012) (`.skilled/commands/doctor/scripts/sk-code-setup-check.cjs`). Verify: `node .skilled/commands/doctor/scripts/sk-code-setup-check.cjs` ends with `STATUS=OK legs=9` and exits 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] The acceptance criteria in `acceptance-criteria.md` are Met or Waived by an ADR that exists
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decisions**: See `decision-record.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md, with each REQ id in the table
- [ ] CHK-002 [P0] Technical approach defined in plan.md, with the design citation check table
- [ ] CHK-003 [P1] Dependencies on Phase 2 and Phase 4 confirmed by T001 and T002
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The new test files and the validator edits pass their own tests, T024, T025 and T039
- [ ] CHK-011 [P0] The drift guards print `all 4 guards PASSED`, T042
- [ ] CHK-012 [P1] Error handling in the new validators names one violation code per failure
- [ ] CHK-013 [P1] New code comments state the durable reason only, with no packet, phase, REQ, ADR or task id
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] The stage-two restraint test passes, T039 and T053
- [ ] CHK-021 [P0] Fixture F15 passes with no `local-` text in the envelope, T040
- [ ] CHK-022 [P1] Routing canaries 1 to 7 are run, and their exact output is recorded, T049 to T053
- [ ] CHK-023 [P1] The metadata gate rejects a malformed quality block, T024
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] The contract changes are classed as `cross-consumer`, because each reader and each declaration crosses a file boundary.
- [ ] CHK-FIX-003 [P0] Consumer inventory is complete for the run verdict, the quality rows, the aliases and the vocabulary, as spec.md section 3 and the plan table list.
- [ ] CHK-FIX-005 [P1] The routing canary matrix rows are listed in plan.md section 5 before the replay runs.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No quality row carries a command, and the validators reject `argv`, `command` and `run` keys, T022
- [ ] CHK-031 [P0] No tracked artifact names a `local-*` skill, checked by F15 and by a search of the touched files
- [ ] CHK-032 [P1] No credential or secret pattern appears in the changed files
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec.md, plan.md, tasks.md and acceptance-criteria.md name the same REQ and AC ids
- [ ] CHK-041 [P1] The design citation corrections in plan.md section 3 match the edits made in the tasks
- [ ] CHK-042 [P2] The hub changelog names every version bump in the hub and the touched packets
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion, T057
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | [ ]/10 |
| P1 Items | 11 | [ ]/11 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: 2026-10-26
<!-- /ANCHOR:summary -->

---
