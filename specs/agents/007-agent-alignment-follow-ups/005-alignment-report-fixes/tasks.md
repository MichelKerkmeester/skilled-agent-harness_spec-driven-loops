---
title: "Tasks: Phase 5: alignment-report-fixes"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "alignment report fixes tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 5: alignment-report-fixes

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

**Variables**: `K` is `.skilled/skills/sk-doc/sk-create-agent`. `C` is `.skilled/commands/create/assets`. `scratch/` is this folder's `scratch/`. A finding id such as B-1 is the id in `scratch/alignment-report/findings.json`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Copy the alignment report and save the baseline of each check in `plan.md` section 5 (`scratch/baseline.txt`). Verify: `rg -c '^## ' scratch/baseline.txt` prints 6 or more. Observed: `scratch/alignment-report/` holds the report, the fix plan and both data files, and `scratch/baseline.txt` holds twelve check sections and two advisor prompts. The search printed 14.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 B-1: scope steps 13 and 14 to an agent under `.skilled/agents/` and raise the version to 1.0.9.0 (`K/SKILL.md`). Verify: `rg -c 'For a new agent under' K/SKILL.md` prints 1. Observed: the search printed 1. Step 13 also says an agent that exists only in `.claude/agents/` gets no record. `5:version: 1.0.9.0`.
- [x] T003 C-1 and C-2: repair the `v1.0.8.0` entry and add the `v1.0.9.0` entry (`K/changelog/`). Verify: `check_changelog_shape.py` on both files prints `pass=2 fail=0`. Observed: `SUMMARY files=2 pass=2 fail=0`, exit 0. The baseline run on `v1.0.8.0.md` printed four problems and exit 1.
- [x] T004 C-4: name the registry step in the skill README (`K/README.md`). Verify: `rg -c 'agent-registry' K/README.md` prints 1 or more. Observed: the search printed 3. Quick start gained step 4, troubleshooting and verification each gained a row.
- [x] T005 B-3: add scenario AGV-003 and its rows in the root playbook (`K/manual-testing-playbook/`). Verify: `rg -c 'AGV-003' K/manual-testing-playbook/manual-testing-playbook.md` prints 3 or more. Observed: the search printed 6. `validate-playbook-package.cjs` printed `scenarios=7 categories=3 violations=0`, exit 0.
- [x] T006 D-1: add the registry step and the roster check to both workflow files and the report line to the presentation file (`C/create-agent-auto.yaml`, `C/create-agent-confirm.yaml`, `C/create-agent-presentation.txt`). Verify: `rg -c 'sync-agent-roster' C/create-agent-auto.yaml C/create-agent-confirm.yaml` prints a count above 0 for each file, and both files parse as YAML. Observed: the search printed 3 for each file and both parse with `yaml.safe_load`. The command tests printed `15 passed`.
- [x] T007 D-1: name the registry and the generated rosters in the write boundary and the `/create:agent` row, then rewrite the runtime copies (`.skilled/agents/markdown.md`). Verify: `node .skilled/bin/sync-agent-roster.cjs --check` prints `agent-roster: OK` and `node .skilled/bin/check-agent-mirror-sync.cjs` exits 0. Observed: `agent-roster: OK`, exit 0. The mirror check first printed `BLOCKED: 1 agent(s) have out-of-sync runtime mirrors: markdown`. The `.claude` fork took the same two edits and the Pi, Codex and harness generators each wrote 1 of 11, after which it printed `all comparable mirrors in sync`, exit 0.
- [x] T008 C-4: name the registry record in the root README's `/create:agent` entry (`README.md`). Verify: `rg -c 'registry record' README.md` prints 1 or more. Observed: the search printed 1.
- [x] T009 CR-2: add the registry and roster phrases to the agent mode's vocabulary on each hub surface that carries it (`K/SKILL.md`, `.skilled/skills/sk-doc/` routing files). Verify: the two registry prompts in `spec.md` return `sk-doc` first. Observed: `add my agent to the agent registry` returned `sk-doc 0.590` first and `the agent registry needs a record for my new persona` returned `sk-doc 0.545`. One phrase shipped, `agent registry`. `agent roster` and `roster check` were added, replayed and dropped, because with them `build a team roster page in react` returned `sk-doc` above `sk-code`.
- [x] T010 CR-1: add `read` to the tool list (`.skilled/skills/cli-external-orchestration/cli-deepseek-harness/references/guards-and-hooks.md`). Verify: `rg -c 'subagent., .read.' ` on that file prints 1. Observed: the search printed 1.
- [x] T011 C-3 and BAT-01: name `sk-create-agent` in the component paragraph (`.skilled/changelog/skilled/v4.0.2.1.md`). Verify: `rg -c 'sk-create-agent' .skilled/changelog/skilled/v4.0.2.1.md` prints 1 or more. Observed: the search printed 1. A feature bullet was added and removed again: it took the file to 281 lines against the shape checker's ceiling of 280.
- [x] T012 A-1: regenerate the trigger-index outputs from the final tree (`.skilled/skills/system-spec-kit/runtime/`). Verify: `generate-trigger-index.mjs --check` exits 0 and prints no `manifest hash differs` note. Observed: the generator rewrote the four outputs and `--check` printed `trigger index matches the corpus` with no hash note, exit 0. The outputs are regenerated once more after the last document edit, because every document in the corpus moves the hash.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Replay the report's thirteen probes and the two registry prompts, and one out-of-domain prompt per new phrase (`scratch/after.txt`). Verify: `run-probes.cjs` prints `fail=0`, and no out-of-domain prompt returns `sk-doc` first. Observed: `run-probes.cjs` printed `pass=13 fail=0 cannot_run=0`. `build a team roster page in react` and `update the mode registry of the mcp hub with a new mode` returned `sk-code` first, and two other out-of-domain prompts returned no recommendation.
- [x] T014 Run the hub checks: version, parent-skill, router vocabulary and the advisor regression suite (`scratch/after.txt`). Verify: each exits with the status it had in `scratch/baseline.txt`, or better. Observed: eleven hub gates each exited 0, as in the baseline. The drift guard suites printed `22 passed`, the scorer ratchets and golden prompts `59 passed`, and the routing accuracy gate `overall_pass: true`.
- [x] T015 Re-run the alignment battery on the branch (`scratch/after.txt`). Verify: `run-battery.cjs` prints `fail=0`. Observed: `STATUS=OK run-battery: fired=S2,S3,S4,S5,S6,S7,S8,S9,S10,S11,S14,S15 pass=76 fail=0 cannot_run=0 not_applicable=2`, exit 0, over the 45 uncommitted files. The report's run had `fail=1`, the release-coverage row.
- [x] T016 Run strict validation on the packet (`spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/agents/007-agent-alignment-follow-ups --recursive --strict` prints `RESULT: PASSED` for the parent and all five children. Observed: six `RESULT: PASSED` lines, the parent and five children, each with 0 errors. This folder carries 1 warning: `decision-record.md present but Level 1 declared`. The continuity writer created that file for the operator's fix-scope answer. The parent first failed two generated-metadata rules, and `repair-derived.cjs --folder <parent> --apply` re-derived its graph metadata.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] Every finding id in `scratch/alignment-report/findings.json` has a row in `implementation-summary.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->

---
