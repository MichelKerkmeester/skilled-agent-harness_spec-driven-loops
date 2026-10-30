---
title: "SKL-011 -- Convert a plain skill"
description: "This scenario validates the plain-skill path for `SKL-011`. It focuses on the plan, the preservation check, the generated metadata, the strict gate and the integration rows."
version: 1.0.1.0
---

# SKL-011 -- Convert a plain skill

This document captures the operator contract for `SKL-011`.

---

## 1. OVERVIEW

This scenario validates the conversion of a plain agent skill: no four-part version, no `allowed-tools` field, no `ROUTER.md` and no root metadata, reached through a path outside `.skilled/skills`. The run plans every write, stages the skill under its own frontmatter name, renders the router and the metadata, and refuses the result unless every original body line survives.

### Why This Matters

The section reshape is authored prose, so no script can prove it alone. Without a preservation check, a conversion can drop a warning, a command or a boundary and still pass the format gate, because the gate reads structure rather than meaning. The operator needs one check that answers "is anything missing" in a form that can fail.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SKL-011` and inspect the plan, the preservation check, the generated files and the gates.

- Objective: convert a plain agent skill into a class S standalone root that passes the strict format gate and the root metadata gate, with no original body line lost
- Realistic user request: `invoice-review is a plain agent skill with no version, no allowed-tools, no ROUTER.md and no graph metadata. Convert it so it passes the strict format gate and the advisor can find it.`
- Prompt: `invoice-review is a plain agent skill with no version, no allowed-tools, no ROUTER.md and no graph metadata. Convert it so it passes the strict format gate and the advisor can find it.`
- Expected execution process: confirm the plain fixture outside the skills root, read the plan, approve the resource map and the intent phrases it shows, plan again with those approvals, reshape the body and prove it with the preservation check, apply with the same flags, then run the strict format gate, the root metadata gate, the completion gate and the changelog check.
- Expected signals: the first plan exits 1 with `INTENT_SIGNALS_BELOW_FLOOR` and names the phrases it suggests. The plan with eight `--approved-phrase` values and one `--allowed-tools` list prints `Conversion plan: invoice-review`, one numbered line per copy, create, overwrite, agent, preserve, scaffold, command and gate step, the `Backup existing files under:` line, `Approved intent phrases (8)`, `allowed-tools: [...]`, the `RESOURCE_MAP order:` line and the integration rows I1 to I6. `preserve --snapshot` prints `Preservation PASS: <n> original body line(s) found.` and exits 0. The apply prints `Converted invoice-review; router semantics match the snapshot.`, its `Backup:`, `Snapshot:` and `Converted skill:` lines, the same preservation line, one line per integration row and the engine's `Undo:` block. The reference markdown gains the five-field frontmatter plus `version`, and a non-kebab path is renamed with its links rewritten. `graph-metadata.json` and `leaf-manifest.config.json` are created from the scaffolder rather than the slug defaults, `ci-skill-root-metadata.cjs --fix` and the derived regeneration run, `package_skill.py --check --strict` prints `Result: PASS`, `validate_skill_package.py` prints `Detected kind: standalone`, and the changelog link resolves to a folder holding `v<version>.md`.
- Desired user-visible outcome: a converted skill that passes both gates, keeps every original line somewhere in the package, and is visible to the advisor and the changelog index.
- Pass/fail: PASS if the plan named every write and showed the map and phrases, the preservation check passed, both gates exited 0, the generated metadata replaced the slug defaults and the changelog link resolved. FAIL if a body line is lost, fewer than eight phrases were approved, a generated file was hand-edited, either gate is not clean, or an integration row was reported as done without its evidence.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `invoice-review is a plain agent skill with no version, no allowed-tools, no ROUTER.md and no graph metadata. Convert it so it passes the strict format gate and the advisor can find it.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SKL-011 | Convert a plain skill | Convert a plain agent skill into a class S root with no body line lost and both gates clean | `invoice-review is a plain agent skill with no version, no allowed-tools, no ROUTER.md and no graph metadata. Convert it so it passes the strict format gate and the advisor can find it.` | 1. `bash: ls plain-skills/invoice-review/SKILL.md` -> 2. `bash: node .skilled/commands/doctor/scripts/sk-skill-convert.cjs plan plain-skills/invoice-review` -> 3. `bash: node .skilled/commands/doctor/scripts/sk-skill-convert.cjs plan plain-skills/invoice-review --approved-phrase <eight approved phrases> --allowed-tools "Read, Grep, Glob"` -> 4. `bash: node .skilled/commands/doctor/scripts/sk-skill-convert.cjs preserve --snapshot <snapshot folder> <staged folder>` -> 5. `bash: node .skilled/commands/doctor/scripts/sk-skill-convert.cjs apply plain-skills/invoice-review --approved-phrase <eight approved phrases> --allowed-tools "Read, Grep, Glob" --agent-output <the agent's SKILL.md> --apply` -> 6. `bash: python3 .skilled/skills/sk-doc/scripts/package_skill.py .skilled/skills/invoice-review --check --strict` -> 7. `bash: node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs --skills-dir .skilled/skills --skill invoice-review` -> 8. `bash: python3 .skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py .skilled/skills/invoice-review` -> 9. `bash: find .skilled/changelog -maxdepth 1 -name 'invoice-review'` | Step 1: the plain fixture exists outside the skills root. Step 2: `INTENT_SIGNALS_BELOW_FLOOR` with the suggested phrases, exit 1, nothing written. Step 3: the plan naming every write, the approved phrases, the approved tool list, the harvested resource map and one line per integration row, exit 0. Step 4: `Preservation PASS: <n> original body line(s) found.`, exit 0. Step 5: the plan followed by the writes it listed, the `Backup:`, `Snapshot:` and `Converted skill:` lines and the undo block, exit 0. Step 6: `Result: PASS`, exit 0. Step 7: `OK   [S] invoice-review` and `checked=1 passed=1 failed=0 fixed=0`, exit 0. Step 8: `Detected kind: standalone`, exit 0. Step 9: the changelog link | The prompt, all nine transcripts with exit statuses, the plan with its approved phrases and resource map, the preservation verdict, both gate verdicts, the generated file listings and the changelog link | PASS if the plan named every write and showed the map and phrases, the preservation check passed, both gates exited 0, the generated metadata replaced the slug defaults and the changelog link resolved. FAIL if a body line is lost, fewer than eight phrases were approved, a generated file was hand-edited, either gate is not clean, or an integration row was claimed without its evidence | 1. When the plan stops with `INTENT_SIGNALS_BELOW_FLOOR`, approve the phrases it suggests and plan again. 2. When the preservation check fails, read the lost line it names and restore it before the next apply. 3. When a generated file is stale, rerun its generator instead of editing it. 4. When `validate_skill_package.py` fails, read the leg it names before the integration rows are read as done |

### Commands

1. `bash: ls plain-skills/invoice-review/SKILL.md`
2. `bash: node .skilled/commands/doctor/scripts/sk-skill-convert.cjs plan plain-skills/invoice-review`
3. `bash: node .skilled/commands/doctor/scripts/sk-skill-convert.cjs plan plain-skills/invoice-review --approved-phrase <eight approved phrases> --allowed-tools "Read, Grep, Glob"`
4. `bash: node .skilled/commands/doctor/scripts/sk-skill-convert.cjs preserve --snapshot <snapshot folder> <staged folder>`
5. `bash: node .skilled/commands/doctor/scripts/sk-skill-convert.cjs apply plain-skills/invoice-review --approved-phrase <eight approved phrases> --allowed-tools "Read, Grep, Glob" --agent-output <the agent's SKILL.md> --apply`
6. `bash: python3 .skilled/skills/sk-doc/scripts/package_skill.py .skilled/skills/invoice-review --check --strict`
7. `bash: node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs --skills-dir .skilled/skills --skill invoice-review`
8. `bash: python3 .skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py .skilled/skills/invoice-review`
9. `bash: find .skilled/changelog -maxdepth 1 -name 'invoice-review'`

### Expected

Step 1 fixes the starting shape and proves the fixture sits outside the skills root, which is the only place a plain skill converts from. Step 2 shows the intent floor refusing before any plan exists, which is why the phrases are approved next. Step 3 is the approval surface: the resource map, the intent phrases and the integration rows are read before any write. Step 4 proves no original body line was lost in the reshape, and the apply runs the same proof again. Step 5 writes in the order the plan listed and leaves the source folder as it was. Steps 6 and 7 prove the format and root metadata gates pass on the result. Step 8 proves the completion gate sees a standalone root. Step 9 proves the changelog link was created and resolves.

### Evidence

Capture the prompt, every command with its exit status, the plan with its approved phrases and resource map, the preservation verdict, both gate verdicts, the generated file listing with its authored counterparts, and the changelog link and its entry.

### Pass / Fail

- **Pass**: the plan named every write and showed the map and phrases for approval, every body line survived, both gates exited 0, the authored metadata replaced the slug defaults, the changelog link resolved and each integration row carried evidence.
- **Fail**: a body line is lost, fewer than eight phrases were approved, a generated file was hand-edited, either gate is not clean, or an integration row is claimed without evidence.

### Failure Triage

1. On `INTENT_SIGNALS_BELOW_FLOOR`, approve the phrases the plan suggests and plan again.
2. On a preservation failure, restore the lost line the check names before the next apply.
3. On a stale generated file, rerun its generator rather than editing it.
4. On a completion gate failure, read the failing leg it names.

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
| [`sk-skill-convert.cjs`](../../../../../commands/doctor/scripts/sk-skill-convert.cjs) | Staged copy, plan, apply gate, preservation check and integration rows |
| [`sk-skill-convert-transforms.cjs`](../../../../../commands/doctor/scripts/lib/sk-skill-convert-transforms.cjs) | Resource map harvest, resource frontmatter insert and kebab rename with link rewrite |
| [`init_skill.py`](../../scripts/init_skill.py) | The scaffold whose metadata files the run copies when they are absent |
| [`ci-skill-root-metadata.cjs`](../../scripts/ci-skill-root-metadata.cjs) | Root metadata gate and the intent-signal floor |
| [`validate_skill_package.py`](../../scripts/validate_skill_package.py) | The completion gate that names the root class |
| [`sk-skill-convert.test.cjs`](../../../../../commands/doctor/scripts/tests/sk-skill-convert.test.cjs) | Plain fixture, dropped-line case and temp-repo integration cases |

---

## 5. SOURCE METADATA

- Group: STANDALONE SKILL
- Playbook ID: SKL-011
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `standalone-skill/convert-a-plain-skill.md`
