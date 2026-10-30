---
title: "SKL-011 -- Convert a plain skill"
description: "This scenario validates the plain-skill path for `SKL-011`. It focuses on the plan, the preservation check, the generated metadata, the strict gate and the integration rows."
version: 1.0.0.0
---

# SKL-011 -- Convert a plain skill

This document captures the operator contract for `SKL-011`.

---

## 1. OVERVIEW

This scenario validates the conversion of a plain agent skill: no four-part version, no `ROUTER.md`, no root metadata, and sections that do not follow the Skilled shape. The run plans every write, stages the skill under its own frontmatter name, renders the router and the metadata, and refuses the result unless every original body line survives.

### Why This Matters

The section reshape is authored prose, so no script can prove it alone. Without a preservation check, a conversion can drop a warning, a command or a boundary and still pass the format gate, because the gate reads structure rather than meaning. The operator needs one check that answers "is anything missing" in a form that can fail.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SKL-011` and inspect the plan, the preservation check, the generated files and the gates.

- Objective: convert a plain agent skill into a class S standalone root that passes the strict format gate and the root metadata gate, with no original body line lost
- Realistic user request: `invoice-review is a plain agent skill with no version, no ROUTER.md and no graph metadata. Convert it so it passes the strict format gate and the advisor can find it.`
- Prompt: `invoice-review is a plain agent skill with no version, no ROUTER.md and no graph metadata. Convert it so it passes the strict format gate and the advisor can find it.`
- Expected execution process: confirm the plain fixture, read the plan, approve the resource map and the intent phrases it shows, apply, run the preservation check against the snapshot the run names, then run the strict format gate, the root metadata gate, the completion gate and the changelog check.
- Expected signals: the plan names the staged target under `.skilled/skills/<name>/`, the `RESOURCE_MAP` it harvested from the `references/` links the body already carries in body order, at least eight approved intent phrases and one line per integration row. The apply renders `ROUTER.md` with one intent whose keywords are those phrases, reshapes `SKILL.md` into WHEN TO USE, SMART ROUTING, HOW IT WORKS, RULES and REFERENCES, and stops without writing further when `preserve --snapshot` reports a lost line. The reference and asset markdown gain the five-field frontmatter plus `version`, and a non-kebab path is renamed with its links rewritten. `graph-metadata.json` and `leaf-manifest.config.json` are created from the scaffolder rather than the slug defaults, `ci-skill-root-metadata.cjs --fix` and the derived regeneration run, `package_skill.py --check --strict` prints `Result: PASS`, `validate_skill_package.py` prints `Detected kind: standalone`, and the changelog link resolves to a folder holding `v<version>.md`.
- Desired user-visible outcome: a converted skill that passes both gates, keeps every original line somewhere in the package, and is visible to the advisor and the changelog index.
- Pass/fail: PASS if the plan named every write and showed the map and phrases, the preservation check passed, both gates exited 0, the generated metadata replaced the slug defaults and the changelog link resolved. FAIL if a body line is lost, fewer than eight phrases were approved, a generated file was hand-edited, either gate is not clean, or an integration row was reported as done without its evidence.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `invoice-review is a plain agent skill with no version, no ROUTER.md and no graph metadata. Convert it so it passes the strict format gate and the advisor can find it.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SKL-011 | Convert a plain skill | Convert a plain agent skill into a class S root with no body line lost and both gates clean | `invoice-review is a plain agent skill with no version, no ROUTER.md and no graph metadata. Convert it so it passes the strict format gate and the advisor can find it.` | 1. `bash: ls .skilled/skills/invoice-review/SKILL.md` -> 2. `bash: node .skilled/commands/doctor/scripts/sk-skill-convert.cjs plan invoice-review` -> 3. `bash: node .skilled/commands/doctor/scripts/sk-skill-convert.cjs apply invoice-review --apply` -> 4. `bash: node .skilled/commands/doctor/scripts/sk-skill-convert.cjs preserve --snapshot <dir>` -> 5. `bash: python3 .skilled/skills/sk-doc/scripts/package_skill.py .skilled/skills/invoice-review --check --strict` -> 6. `bash: node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs --skills-dir .skilled/skills --skill invoice-review` -> 7. `bash: python3 .skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py .skilled/skills/invoice-review` -> 8. `bash: find .skilled/changelog -maxdepth 1 -name 'invoice-review'` | Step 1: the plain fixture exists. Step 2: a plan naming every write, the harvested resource map, at least eight intent phrases and one line per integration row. Step 3: the plan followed by the writes it listed, with each staged source copied rather than moved. Step 4: the preservation check passes. Step 5: `Result: PASS`, exit 0. Step 6: `OK [S] invoice-review` and a zero failed count. Step 7: `Detected kind: standalone`, exit 0. Step 8: the changelog link | The prompt, all eight transcripts with exit statuses, the plan with its map and phrases, the preservation verdict, both gate verdicts, the generated file listings and the changelog link | PASS if the plan named every write and showed the map and phrases, the preservation check passed, both gates exited 0, the generated metadata replaced the slug defaults and the changelog link resolved. FAIL if a body line is lost, fewer than eight phrases were approved, a generated file was hand-edited, either gate is not clean, or an integration row was claimed without its evidence | 1. When the plan stops with `INTENT_SIGNALS_BELOW_FLOOR`, add phrases a user would type and plan again. 2. When the preservation check fails, read the lost line it names and restore it before the next apply. 3. When a generated file is stale, rerun its generator instead of editing it. 4. When `validate_skill_package.py` fails, read the leg it names before the integration rows are read as done |

### Commands

1. `bash: ls .skilled/skills/invoice-review/SKILL.md`
2. `bash: node .skilled/commands/doctor/scripts/sk-skill-convert.cjs plan invoice-review`
3. `bash: node .skilled/commands/doctor/scripts/sk-skill-convert.cjs apply invoice-review --apply`
4. `bash: node .skilled/commands/doctor/scripts/sk-skill-convert.cjs preserve --snapshot <dir>`
5. `bash: python3 .skilled/skills/sk-doc/scripts/package_skill.py .skilled/skills/invoice-review --check --strict`
6. `bash: node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs --skills-dir .skilled/skills --skill invoice-review`
7. `bash: python3 .skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py .skilled/skills/invoice-review`
8. `bash: find .skilled/changelog -maxdepth 1 -name 'invoice-review'`

### Expected

Step 1 fixes the starting shape. Step 2 is the approval surface: the resource map, the intent phrases and the integration rows are read before any write. Step 3 writes in the order the plan listed, and copies a source that sits outside the skills root rather than moving it. Step 4 proves no original body line was lost in the reshape. Steps 5 and 6 prove the format and root metadata gates both pass on the result. Step 7 proves the completion gate sees a standalone root. Step 8 proves the changelog link was created and resolves.

### Evidence

Capture the prompt, every command with its exit status, the plan with its map and phrase list, the preservation verdict, both gate verdicts, the generated file listing with its authored counterparts, and the changelog link and its entry.

### Pass / Fail

- **Pass**: the plan named every write and showed the map and phrases for approval, every body line survived, both gates exited 0, the authored metadata replaced the slug defaults, the changelog link resolved and each integration row carried evidence.
- **Fail**: a body line is lost, fewer than eight phrases were approved, a generated file was hand-edited, either gate is not clean, or an integration row is claimed without evidence.

### Failure Triage

1. On `INTENT_SIGNALS_BELOW_FLOOR`, add phrases a user would type and plan again.
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
