---
title: "SKL-010 -- Convert an older Skilled skill"
description: "This scenario validates the router move for `SKL-010`. It focuses on the plan, the apply gate, the backup, the router proof, the strict format gate and the no-op rerun."
version: 1.0.2.0
---

# SKL-010 -- Convert an older Skilled skill

This document captures the operator contract for `SKL-010`.

---

## 1. OVERVIEW

This scenario validates the conversion of an older Skilled skill, the input whose machine router still sits inside `SKILL.md`. The run prints a plan, waits for `--apply`, moves the router section into a sibling `ROUTER.md` and proves the parsed router came out unchanged.

### Why This Matters

The move looks mechanical and is not. A shift of one line can change which intent a request reaches, and the format gate does not read routing at all, so a broken move can still pass every check after it. The converter therefore compares the parsed router before and after the write, and it restores the pre-edit bytes rather than reporting a conversion it cannot prove.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SKL-010` and inspect the plan, the gate, the write and the rerun.

- Objective: convert an older Skilled skill in place, prove the router is unchanged, and prove the run is safe to repeat
- Realistic user request: `The release-notes skill still keeps its machine router inside SKILL.md. Convert it to the current Skilled shape.`
- Prompt: `The release-notes skill still keeps its machine router inside SKILL.md. Convert it to the current Skilled shape.`
- Expected execution process: confirm the fixture is a clean checkout of an older Skilled skill, run the plan, run `apply` with no `--apply`, compare the tree, run `apply --apply`, read the backup path and the router source line, plan again, then run the strict format gate.
- Expected signals: the plan prints `Conversion plan: release-notes`, one numbered line per overwrite and per create, and `Backup existing files under:` a dated path under `.skilled/skills/.state/doctor-sk-skill/release-notes/`. `apply` without `--apply` prints the same plan and `Apply gate: no writes without --apply.` and the tree is unchanged. A skill that declares no `allowed-tools` field has its plan print `allowed-tools: approval required; propose ["Read","Grep","Glob"]`, with `Bash` added when the folder holds a `scripts/` folder, and the apply writes no grant until that list is approved. A field declared twice refuses with `ALLOWED_TOOLS_DUPLICATE`. `apply --apply` prints a `Converted release-notes` line, the `Backup:` path it wrote and `Router source: skill-md -> router-md`. `ROUTER.md` holds the moved section under `## 3. MACHINE ROUTER` and Smart Routing carries one link line to it. A second plan prints `Writes: none` and names no step. The strict gate prints `Result: PASS` and exits 0.
- Desired user-visible outcome: a skill on the current Skilled shape, with the same routing it had before and a backup that names every byte the run replaced.
- Pass/fail: PASS if the plan named every write, the gate wrote nothing, the apply printed its backup and the router source change, the rerun was a no-op and the strict gate passed. FAIL if a write happened without `--apply`, the router source line is missing, a second plan still proposes steps, or the strict gate is not clean.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `The release-notes skill still keeps its machine router inside SKILL.md. Convert it to the current Skilled shape.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SKL-010 | Convert an older Skilled skill | Convert a skill whose machine router sits in SKILL.md and prove the parsed router is unchanged | `The release-notes skill still keeps its machine router inside SKILL.md. Convert it to the current Skilled shape.` | 1. `bash: git -c core.fsmonitor=false status --porcelain .skilled/skills/release-notes` -> 2. `bash: node .skilled/commands/doctor/scripts/sk-skill-convert.cjs plan release-notes` -> 3. `bash: node .skilled/commands/doctor/scripts/sk-skill-convert.cjs apply release-notes` -> 4. `bash: git -c core.fsmonitor=false status --porcelain .skilled/skills/release-notes` -> 5. `bash: node .skilled/commands/doctor/scripts/sk-skill-convert.cjs apply release-notes --apply` -> 6. `bash: node .skilled/commands/doctor/scripts/sk-skill-convert.cjs plan release-notes` -> 7. `bash: python3 .skilled/skills/sk-doc/scripts/package_skill.py .skilled/skills/release-notes --check --strict` | Step 1: no output, so the fixture is a clean copy. Step 2: `Conversion plan: release-notes`, a numbered plan naming each overwrite and the created `ROUTER.md`, a `Backup existing files under:` path and, when the skill declares no `allowed-tools` field, the `allowed-tools: approval required; propose [...]` line, exit 0. Step 3: the same plan plus `Apply gate: no writes without --apply.`, exit 0. Step 4: still no output. Step 5: a `Converted release-notes` line, a `Backup:` path under `.skilled/skills/.state/doctor-sk-skill/release-notes/` and `Router source: skill-md -> router-md`, exit 0. Step 6: `Writes: none` and no numbered step, exit 0. Step 7: `Result: PASS`, exit 0 | The prompt, all seven transcripts with exit statuses, the plan lines, the apply gate line, the backup path, the router source line, the moved section and the strict gate verdict | PASS if every write was named before it happened, the gate wrote nothing, the apply carried a backup and the router source change, the rerun proposed nothing and the strict gate exited 0. FAIL if any write skipped the gate, the router source line is absent, a file was replaced instead of created, the rerun still proposes steps, or the strict gate is not clean | 1. Read the refusal code when the plan exits 1, and fix the condition it names before planning again. A second `allowed-tools` field is refused as `ALLOWED_TOOLS_DUPLICATE`, and the repair is one list in one field. 2. When `ROUTER_CONTENT_CHANGED` or `ROUTER_SEMANTICS_CHANGED` appears, read the backup path the run printed and confirm the skill files were restored. 3. When `ROUTER.md` already exists, confirm it was left untouched and read the reason. 4. When the strict gate fails, run it with `--json` and read the `RS` codes it names |

### Commands

1. `bash: git -c core.fsmonitor=false status --porcelain .skilled/skills/release-notes`
2. `bash: node .skilled/commands/doctor/scripts/sk-skill-convert.cjs plan release-notes`
3. `bash: node .skilled/commands/doctor/scripts/sk-skill-convert.cjs apply release-notes`
4. `bash: git -c core.fsmonitor=false status --porcelain .skilled/skills/release-notes`
5. `bash: node .skilled/commands/doctor/scripts/sk-skill-convert.cjs apply release-notes --apply`
6. `bash: node .skilled/commands/doctor/scripts/sk-skill-convert.cjs plan release-notes`
7. `bash: python3 .skilled/skills/sk-doc/scripts/package_skill.py .skilled/skills/release-notes --check --strict`

### Expected

Step 1 fixes the starting state. Step 2 shows the plan before anything is written, which is what the operator approves. Step 3 proves the no-write gate is real, and step 4 proves it held. Step 5 writes the backup first, then the new `ROUTER.md`, then the edited `SKILL.md`, and proves the parsed router came out equal. Step 6 proves the run is idempotent. Step 7 proves the result passes the strict format gate.

### Evidence

Capture the prompt, the clean start, the whole plan, the apply gate line, the backup path, the router source line, the moved machine section with the link line in Smart Routing, the second plan and the strict gate verdict with its exit status.

### Pass / Fail

- **Pass**: the plan named every write, the gate wrote nothing, the apply reported its backup and the router source change, the parsed router stayed equal, the rerun was a no-op and the strict gate exited 0.
- **Fail**: a write happened without `--apply`, no backup path was printed, the router source line is missing, a file that existed was replaced, the rerun still proposes steps, or the strict gate is not clean.

### Failure Triage

1. Read the refusal code a failing plan prints and fix the condition it names. On `ALLOWED_TOOLS_DUPLICATE`, collapse the declarations to one field instead of converting with two.
2. On a router proof failure, open the backup path the run printed and confirm both skill files were restored.
3. On an existing `ROUTER.md`, confirm it was left untouched and read the refusal reason rather than deleting the file.
4. Run the strict gate with `--json` and read the `RS` codes when it fails.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root package policy and scenario index |
| [`skill-format-check-and-convert.md`](../../../feature-catalog/skill-format-conversion/skill-format-check-and-convert.md) | Catalog entry for the check and convert command |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`sk-skill-convert.cjs`](../../../../../commands/doctor/scripts/sk-skill-convert.cjs) | Plan, apply gate, backup, exclusive create and the router proof |
| [`sk-skill-convert-transforms.cjs`](../../../../../commands/doctor/scripts/lib/sk-skill-convert-transforms.cjs) | Frontmatter normalization and the verbatim router move |
| [`skill-router-template.md`](../../assets/skill/skill-router-template.md) | The `ROUTER.md` heading and frontmatter the move builds |
| [`package_skill.py`](../../scripts/package_skill.py) | The strict format gate and its `RS` codes |
| [`sk-skill-convert.test.cjs`](../../../../../commands/doctor/scripts/tests/sk-skill-convert.test.cjs) | Golden move, idempotence, no-replace and rollback cases |

---

## 5. SOURCE METADATA

- Group: STANDALONE SKILL
- Playbook ID: SKL-010
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `standalone-skill/convert-an-older-skilled-skill.md`
