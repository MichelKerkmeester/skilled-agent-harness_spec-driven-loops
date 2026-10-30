---
title: "Scratch convert run: the workflow against the engine as it is now"
description: "The transcript of a scratch conversion in a temporary repository: the plan, a declined question that changes nothing, an approved conversion that ends OK, and an older Skilled skill whose trim question comes before its plan rerun."
trigger_phrases:
  - "scratch convert run"
importance_tier: "normal"
contextType: "general"
---

# Scratch convert run

Run on 2026-10-30 from this worktree, against the engine unchanged:
`node .skilled/commands/doctor/scripts/sk-skill-convert.cjs`. The harness is a small
script under the dispatcher's scratch root (`scratch-convert-run.cjs`); the fixture
repository it builds lives under `os.tmpdir()` and is removed when the run ends, so
nothing outside the temporary repository is written.

The run follows the workflow's own order: plan, the follow-up questions, the plan
rerun with the approved flags, the `preserve --snapshot` proof, the conversion
question, `apply --apply` with the same flags, the engine's undo block, and the
re-read through the check engine.

## 1. Setup

| Fact | Value |
|------|-------|
| Fixture source for the plain skill | `.skilled/commands/doctor/scripts/tests/fixtures/sk-skill-convert/plain/before` (copied into the temporary repository) |
| Agent prose for the plain skill | `.skilled/commands/doctor/scripts/tests/fixtures/sk-skill-convert/plain/after/SKILL.md` |
| Temporary skills root | `<temp>/.skilled/skills` |
| Interpreter | `python3` (`/usr/bin/python3`, the one that can import PyYAML) |
| Advisor, compiler and Hermes sync | stand-ins inside the temporary repository, because the run must not touch this checkout's graph or mirrors |

## 2. A plain skill: the plan

`plan <source>` exits 0 and prints:

```text
Conversion plan: brindle-lantern
1. Copy the source under frontmatter name brindle-lantern; source remains unchanged. Copy: <temp>/plain-source -> <temp>/.skilled/skills/brindle-lantern
2. Render ROUTER.md with PRIMARY keywords [...] and RESOURCE_MAP ["references/field-notes.md"] in body order. Create: <temp>/.skilled/skills/brindle-lantern/ROUTER.md
3. Workflow agent must reshape SKILL.md, then provide --agent-output before apply.
4. Snapshot the source body and require every non-heading line to survive in SKILL.md, ROUTER.md, or references/.
...
Backup existing files under: <temp>/.skilled/skills/.state/doctor-sk-skill/brindle-lantern/<timestamp>
allowed-tools: approval required; propose ["Read","Grep","Glob"]
No allowed-tools field will be written until approved with repeated --allowed-tool values or one --allowed-tools list.
Integration plan: brindle-lantern
I1 advisor discovery: ...
I6 changelog: Create the relative link .skilled/changelog/brindle-lantern -> ../skills/brindle-lantern/changelog.
exit 0
```

The follow-up the workflow asks about is on screen as `approval required; propose
["Read","Grep","Glob"]`, and the integration rows the plan records are printed
before anything is asked.

## 3. A plain skill: the operator answers no

The harness answers the allowed-tools question with no and makes no further call,
which is what the workflow does: no rerun, no preserve, no apply.

| Check | Result |
|-------|--------|
| `sha256` of the whole temporary repository before the plan | `c1347114f173c75400b772afa240e307efb6832ff6f5ac6599c49a7cb56dd37a` |
| The same hash after the "no" | `c1347114f173c75400b772afa240e307efb6832ff6f5ac6599c49a7cb56dd37a` |
| Rendered status | `STATUS=CANCELLED ACTION=cancelled`, `Declined: the allowed-tools list`, `Changed: none` |

## 4. A plain skill: the operator answers yes

`preserve --snapshot <snapshot> <staging>` runs first, with the snapshot holding the
source `SKILL.md` and its `references/`, and the staging folder holding the agent's
`SKILL.md` beside the same references:

```text
Preservation PASS: 7 original body line(s) found.
exit 0
```

The plan is rerun with `--allowed-tools Read,Grep,Glob --agent-output <agent file>`;
it exits 0 and prints `allowed-tools: ["Read","Grep","Glob"]`. The conversion question
is then answered yes and equals `apply … --apply` with the same flags:

```text
Preservation PASS: 7 original body line(s) found.
ci-skill-root-metadata.cjs --fix … (exit 0)
regenerate-skill-derived.cjs --root … --write (exit 0)
package_skill.py … --check --strict (exit 0)      Result: PASS
validate_skill_package.py … (exit 0)              Detected kind: standalone
I1 advisor discovery: scanned; …
I2 compiled skill graph: recompiled; …
I3 router reach and budget: "lantern sample review" -> brindle-lantern ranks 1 of 1 above the bar.
I4 regression corpus: appended 3 case row(s) to .skilled/skills/brindle-lantern/benchmark/advisor-cases.jsonl.
I5 runtime mirrors: Hermes synced and checked (PASS: in sync).
I6 changelog: created .skilled/skills/brindle-lantern/changelog/v1.0.0.0.md.
I6 changelog: created .skilled/changelog/brindle-lantern -> ../skills/brindle-lantern/changelog.
Undo:
  git -c core.fsmonitor=false restore -- "<…>/skill-graph.json"
  git -c core.fsmonitor=false restore -- "<…>/benchmark/advisor-cases.jsonl"
  git -c core.fsmonitor=false restore -- "<…>/hermes-out"
  rm "<…>/changelog/v1.0.0.0.md"
  rm "<…>/.skilled/changelog/brindle-lantern"
Check: node "<…>/sk-skill-check.cjs" check "<…>/plain-source"
exit 0
```

| Check | Result |
|-------|--------|
| The source folder is untouched | hash equal before and after the apply |
| The staged root carries `SKILL.md` and `ROUTER.md` | yes, both present |
| The undo block is printed by the engine | yes, with `git restore` for tracked writes and `rm` for created files |
| The `Check:` line the engine prints | yes, printed and pointing at the path the run was given |

Two facts a reader should carry from that block. The undo list is the engine's, so a
run that created no `ROUTER.md` gets no `rm` for one; here the staged root was
created whole, so the created files are the changelog entry and the index link. And
the `Check:` line names the path the run was pointed at, which for a plain skill is
the source folder; the workflow re-reads the converted root on its own instead.

### The re-read through the check engine

`node .skilled/commands/doctor/scripts/sk-skill-check.cjs <converted root> --json`
exits 1 with `findingCount: 2`:

```text
C3   PASS     Format: Strict package validation passed.
C4   PASS     Root metadata: Root metadata contract passed.
C5   PASS     Intent signals: The intent signals differ from the scaffold defaults.
C6   FINDING  Derived freshness: Derived content validation reported an error: derived.key_files is missing or empty after repair …
C10  FINDING  Changelog: The changelog index link is missing or does not resolve.
C11  PASS     Description budget: Outside-root description is 93 characters, within the 130-character soft target.
```

`C10` is a vantage artifact, and the run proves it:

| Probe | Result |
|-------|--------|
| The fixture's own `.skilled/changelog/brindle-lantern` resolves to the converted `changelog/` | true |
| The repository the check resolves for its repo-relative rows | this worktree (the check answers `findRepoRoot` from its own script location) |
| That repository's `.skilled/changelog/brindle-lantern` exists | false |

`C6` is reported as printed and was not chased further: the fixture is a two-file
skill, its `graph-metadata.json` is scaffolded by `init_skill.py`, and the derived
block the row validates is regenerated in a temporary repository whose shared
modules are this checkout's. Both rows are the conversion-completes-but-a-row-still-finds
case the workflow describes: the conversion is `STATUS=OK` and the rows are the next
step, not a failure.

## 5. An older Skilled skill: the trim question, then the conversion

`plan older-sample --approved-phrase …` exits 1:

```text
DESCRIPTION_TOO_LONG: The description is 153 characters; the 130-character limit needs a separately approved trim.
```

The harness answers the trim question with the approved text and reruns the plan;
that plan prints the field as its own line:

```text
Conversion plan: older-sample
1. Add version: 1.0.0.0. Overwrite: <…>/older-sample/SKILL.md
2. Set description: "Older sample skill: route an older-Skilled request and report its reference guide." (the approved trim, within the 130-character limit). Overwrite: <…>/older-sample/SKILL.md
3. Normalize allowed-tools as a YAML sequence. Overwrite: <…>/older-sample/SKILL.md
Backup existing files under: <…>/.skilled/skills/.state/doctor-sk-skill/older-sample/<timestamp>
exit 0
```

`apply --description-trim "<the approved text>" --apply` exits 0:

```text
Normalized older-sample; router semantics match the snapshot.
Backup: <…>/.state/doctor-sk-skill/older-sample/2026-10-30T09-55-00-964Z
Router source: ROUTER.md -> ROUTER.md
Undo:
  cp "<…>/2026-10-30T09-55-00-964Z/SKILL.md" "<…>/older-sample/SKILL.md"
Check: node "<…>/sk-skill-check.cjs" check "<…>/older-sample"
exit 0
```

| Check | Result |
|-------|--------|
| A backup folder is named before the writes | yes |
| The approved trim reached `SKILL.md` | yes |
| The undo block restores the field write from that backup | yes, one `cp` |

## 6. What this run does not cover

- The planner and apply here were driven by the harness with the flags the workflow
  documents. The questions themselves, and their wording, live in the presentation
  contract and are asserted by the contract test, not exercised by a language model
  in this run.
- The temporary repositories are deleted, so the transcript above is the record.
  The full output is in the dispatcher's scratch root (`scratch-convert-run.txt`).
