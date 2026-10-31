---
title: "Corrections: docs against shipped behavior"
description: "The evidence behind the correction pass: every claim re-read from the shipped command, each refusal and report form reproduced, and the changelog links resolved."
trigger_phrases:
  - "docs corrections evidence"
  - "shipped behavior comparison"
importance_tier: "normal"
contextType: "general"
---

# Corrections: Docs Against Shipped Behavior

Written on 2026-10-30 in this worktree. Every command below was run with its exit status read. The repository was unchanged outside this phase's files, and the scratch fixtures live under a scratch folder outside it.

## 1. WHAT THE COMMAND ACTUALLY IS

`node .skilled/commands/doctor/scripts/sk-skill-convert.cjs` with no subcommand, exit 2:

```text
USAGE: Invalid invocation.
Usage: sk-skill-convert.cjs plan <skill-name-or-path>
       sk-skill-convert.cjs apply <skill-name-or-path> [--approved-phrase <text>] [--allowed-tool <tool>] [--allowed-tools <comma list>] [--description-trim <text>] [--agent-output <path>] [--apply]
       sk-skill-convert.cjs preserve --snapshot <dir> [<skill-dir>]

plan is read-only. apply prints the plan and writes only when --apply is present.
```

`node .skilled/commands/doctor/scripts/sk-skill-check.cjs --help` prints `USAGE: Unknown option: --help` and exits 2, so the check engine's contract is its run, not a help text.

The router's own frontmatter hint, which the two interface listings now copy:

```text
argument-hint: "[check|convert] [<name-or-path>] [--json] [--into-hub <hub>] [--dry-run]"
```

## 2. REPORT FORMS AS PRINTED

`node .skilled/commands/doctor/scripts/sk-skill-check.cjs check sk-git`, exit 0, opens `Skill check: sk-git (canon)` and prints the row labels the docs now use:

```text
C5  PASS    Intent signals: The intent signals differ from the scaffold defaults.
C7  PASS    Router equivalence: Parsed 5 intent signal groups and 5 resource-map entries.
Result: PASS
```

`node .skilled/commands/doctor/scripts/sk-skill-check.cjs` (fleet), exit 1:

```text
Roots: 13; result: FINDINGS (1)
```

The one finding is a generated `sk-prompt` benchmark script named `run_fixtures.sh`, committed before this phase and outside its scope.

A plain direct child, run through the engine with a scratch skills root, exit 1:

```text
Skill check: plain-child (plain)

C3  FINDING Format: Missing required field 'allowed-tools' in frontmatter
C4  FINDING Root metadata: Root metadata contract has violations. Codes: MANIFEST_REGENERATION_FAILED, MISSING_GENERATED_FILE, MISSING_REQUIRED_FILE, RRC-001.
C7  FINDING Router equivalence: The declared router is not parseable.
Result: FINDINGS (5)
```

`node .skilled/commands/doctor/scripts/sk-skill-check.cjs check sk-create-skill --into-hub sk-doc`, exit 0:

```text
Hub gap report: sk-create-skill into sk-doc (metadata)

H1  PASS     Packet registration: Registered as sk-create-skill (workflow); its packet resolves and the registry invariants pass.
     Evidence: node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-doc
Rows: 11; 10 pass, 0 finding(s), 0 unknown, 1 n/a
A green gate is not integration. No CI gate covers rows H4, H5, H6, H8, H10; H7 is checked by name only.
Result: PASS
```

`--json` on the deep form carries `mode`, `skill`, `inputKind`, `findingCount`, `unknownCount`, `exitCode` and `rows`, which is the key set the scenario names.

## 3. REFUSALS, REPRODUCED

Two scratch fixtures, one declaring a hub and one nesting a packet, run through the engine with the fixtures folder as its skills root:

```text
HUB_DECLARATION: Hub declaration mode-registry.json is present; conversion does not modify hubs.
case=hub-declared exit=1
NESTED_PACKETS: Nested SKILL.md packets make this a hub candidate.
case=hub-nested exit=1
```

The refusal order reads the nested packet before the declaration, which is why one fixture carrying both prints `NESTED_PACKETS`. The scenario now keeps them apart so each code is the one it expects.

`node .skilled/commands/doctor/scripts/sk-skill-convert.cjs plan invoice-review` for a bare name under `.skilled/skills` that is not there, exit 1:

```text
SKILL_NOT_FOUND: No SKILL.md was found for the requested name or path.
```

A plain skill outside the skills root, exit 1 on the first plan:

```text
INTENT_SIGNALS_BELOW_FLOOR: Only 0 approved intent phrase(s) were supplied; at least 8 are required. Suggested phrases: [...]. Pass repeated --approved-phrase values.
```

The same skill with eight approved phrases and one approved tool list, exit 0, prints `Conversion plan: invoice-review`, nine numbered steps, `Backup existing files under: .../.skilled/skills/.state/doctor-sk-skill/invoice-review/<timestamp>`, `Approved intent phrases (8)`, `allowed-tools: ["Read","Grep","Glob"]`, `RESOURCE_MAP order: [...]` and the integration rows I1 to I6.

`node .skilled/commands/doctor/scripts/sk-skill-convert.cjs plan plain-skills/invoice-review` with no `allowed-tools` field and no approved phrases still refuses on the floor first, so the tool approval cannot stand in for the phrase approval.

## 4. GATE OUTPUT SPACING

`node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs --skills-dir .skilled/skills --skill sk-git`, exit 0, prints `OK   [S] sk-git` with three spaces, then a blank line and `checked=1 passed=1 failed=0 fixed=0`. The scenario quotes that spacing rather than collapsing it.

`python3 .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py .skilled/skills/sk-git --check --strict` closes on `Result: PASS`, exit 0.

`python3 .skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py .skilled/skills/sk-git` prints `Detected kind: standalone`, exit 0.

## 5. THE SIX REVIEW FINDINGS THAT STILL HELD

| Finding | State after the comparison | Corrected in |
|---|---|---|
| P0-1 `convert` documented but unbound | Does not hold: `_routes.yaml` carries the convert route and the router binds it | No change needed |
| P0-2 plain-skill conversion refused | Does not hold: the path stages a class S root, and the plan prints its copy step | No change needed |
| P1-3 integration rows invented | Does not hold: the plan prints I1 to I6 | Catalog, root catalog, scripts README |
| P1-4 `preserve` not a subcommand | Does not hold: `preserve --snapshot` is in the usage block and prints `Preservation PASS` | SKL-011 |
| P1-5 SKL-012 expected the wrong refusal | Holds: one fixture carrying both prints `NESTED_PACKETS` | SKL-012, playbook index |
| P1-6 the job question and handoff | Half holds: no job question exists, and the hub handoff line does | SKL-012, playbook index, catalog, adopter guide |
| P1-7 catalog claims a route row | Does not hold: both routes exist | No change needed |
| P1-8 test-coverage claims outrun the file | Does not hold: the convert suite covers the preservation check and the plain path | No change needed |
| P2-9 both targets work on the whole fleet | Holds | Leaf and root catalog |
| P2-10 tree comment column | Holds for one row, and the long name cannot reach the column | Scripts README tree |
| P2-11 Oxford comma in the playbook opener | Holds | Playbook index |
| P2-12 two "and"s in one list | Holds | Scripts README overview |
| P2-13 mixed path bases in the test table | Holds | Playbook index |
| P2-14 `code_folder` inline paths | Holds and is pre-existing: 25 before, 25 after | Reported, not rewritten |
| P2-15 one-space `OK [S]` | Holds | SKL-011 |

## 6. CHANGELOG LINKS AND VERSIONS

```text
$ ls .skilled/changelog/sk-doc/create-skill/v1.9.1.0.md
$ ls .skilled/changelog/sk-doc/create-command/v1.0.10.0.md
$ ls .skilled/changelog/sk-doc/parent/v2.3.33.0.md
$ ls .skilled/changelog/system-skill-advisor/v0.17.26.0.md
$ ls .skilled/changelog/sk-prompt/v4.0.1.0.md
```

All five resolve through their `.skilled/changelog` link. Each skill's `SKILL.md` version equals its newest entry, and the hub's `description.json`, `mode-registry.json` and `hub-router.json` carry the same `2.3.33.0`, which is what `parent-skill-check` checks as `13a`, `13b` and `13d`.

## 7. THE FIVE CHANGELOG ENTRIES

Each entry was validated at its own type and scanned for hard voice blockers:

```text
$ python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/sk-doc/sk-create-skill/changelog/v1.9.1.0.md --type changelog
✅ VALID: .skilled/skills/sk-doc/sk-create-skill/changelog/v1.9.1.0.md
Document type: changelog
Total issues: 0
```

The same run prints `Total issues: 0` for `sk-doc` v2.3.33.0, `sk-create-command` v1.0.10.0, `system-skill-advisor` v0.17.26.0 and `sk-prompt` v4.0.1.0. `hvr_scan.py` reports `hard blockers: 0` for all five.

The version carriers were moved in the same pass, and the parity gate reads them back:

```text
$ node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-doc
PASS: 13a-version: all JSON routing files carry the SKILL.md version 2.3.33.0
PASS: 13b-version: SKILL.md version 2.3.33.0 matches the newest changelog entry
PASS: 13d-packet-version: 14 mode packet(s) match their newest changelog entry
OK: parent-skill-check — all hard invariants passed, 0 warnings
```

```text
$ node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs
Wrote 5 of 65 Hermes skill copies; pruned 0
$ node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check
PASS: 65 Hermes skill copies in sync
```

`node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` reports `checked=13 passed=13 failed=0 fixed=0`, and the derived and leaf-manifest freshness checks report 13 fresh with 0 stale.
