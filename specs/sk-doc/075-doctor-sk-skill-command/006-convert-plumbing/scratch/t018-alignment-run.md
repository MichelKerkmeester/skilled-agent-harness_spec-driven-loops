---
title: "Scratch convert run: the workflow's own calls against the engine as it is now"
description: "The transcript of a scratch conversion in a temporary repository: a plain skill's plan refusal, its phrase and allowed-tools questions, a declined question that changes nothing, an approved conversion that ends with the engine's undo block, and an older Skilled skill whose trim question comes before its plan rerun."
trigger_phrases:
  - "scratch convert run"
importance_tier: "normal"
contextType: "general"
---

# Scratch convert run

Re-recorded on 2026-10-30 from this worktree, against the engine unchanged:
`node .skilled/commands/doctor/scripts/sk-skill-convert.cjs`. The harness is a throwaway
script in the worker's scratch root (`scratch-convert-run.cjs`), and the two fixture
repositories it builds live under that same scratch folder (`runs/plain-cancel`,
`runs/plain-apply`, `runs/older-trim`), so nothing outside them is written.

Every call below is one the workflow YAML names, with every flag that workflow passes:
`plan <target>`, then `apply <target> [flags]` with **no** `--apply` for each plan rerun,
`preserve --snapshot <scratch>/snapshot <scratch>/staging`, then
`apply <target> [flags] --apply`, then the re-read through `sk-skill-check.cjs`. The
harness prints each call before its output; `<scratch>` below stands for the worker's
scratch folder and `<repo>` for this worktree.

## 1. Setup

| Fact | Value |
|------|-------|
| Fixture source for the plain skill | `.skilled/commands/doctor/scripts/tests/fixtures/sk-skill-convert/plain/before`, copied to `<scratch>/runs/plain-cancel/plain-source` and again to `<scratch>/runs/plain-apply/plain-source` |
| Agent prose for the plain skill | `.skilled/commands/doctor/scripts/tests/fixtures/sk-skill-convert/plain/after/SKILL.md`, copied into the scratch root as `agent-output.md` |
| One scratch root for the plain path | `<temp>/.skilled/skills/.state/doctor-sk-skill/brindle-lantern/scratch/`, holding `agent-output.md`, `snapshot/` and `staging/` |
| Temporary skills root | `<temp>/.skilled/skills` |
| Interpreter | `/usr/bin/python3`, the one that can import PyYAML |
| Advisor, compiler, Hermes sync and the derived generator | stand-ins inside the temporary repository, because the run must not touch this checkout's graph or mirrors |
| The shared doctor and skill-creator assets | this worktree's own, so the run exercises the real validators |

## 2. A plain skill: the first plan is a follow-up, not a refusal

```text
$ node .skilled/commands/doctor/scripts/sk-skill-convert.cjs plan plain-source
INTENT_SIGNALS_BELOW_FLOOR: Only 0 approved intent phrase(s) were supplied; at least 8 are required. Suggested phrases: ["Helps inspect lantern sample records and decide whether the evidence supports a clear review.","lantern sample review","inspect lantern records","compare field marks","read observation notes","choose lantern path","review sample evidence","verify record clarity","route lantern requests"]. Pass repeated --approved-phrase values.
exit 1
```

The message the intent-phrase question shows is the line above, and the phrases it offers
are the `Suggested phrases` list: one long description sentence and eight
three-word phrases. No plan printed, so there is nothing yet to approve.

## 3. A plain skill: the phrase answer reruns the plan

```text
$ node .skilled/commands/doctor/scripts/sk-skill-convert.cjs apply plain-source --approved-phrase "lantern sample review" --approved-phrase "inspect lantern records" --approved-phrase "compare field marks" --approved-phrase "read observation notes" --approved-phrase "choose lantern path" --approved-phrase "review sample evidence" --approved-phrase "verify record clarity" --approved-phrase "route lantern requests"
Conversion plan: brindle-lantern
1. Copy the source under frontmatter name brindle-lantern; source remains unchanged. Copy: <temp>/plain-source -> <temp>/.skilled/skills/brindle-lantern
2. Render ROUTER.md with PRIMARY keywords ["lantern sample review","inspect lantern records","compare field marks","read observation notes","choose lantern path","review sample evidence","verify record clarity","route lantern requests"] and RESOURCE_MAP ["references/field-notes.md"] in body order. Create: <temp>/.skilled/skills/brindle-lantern/ROUTER.md
3. Workflow agent must reshape SKILL.md, then provide --agent-output before apply.
4. Snapshot the source body and require every non-heading line to survive in SKILL.md, ROUTER.md, or references/.
…
Backup existing files under: <temp>/.skilled/skills/.state/doctor-sk-skill/brindle-lantern/<timestamp>
Approved intent phrases (8): ["lantern sample review","inspect lantern records","compare field marks","read observation notes","choose lantern path","review sample evidence","verify record clarity","route lantern requests"]
Suggested intent phrases (approve with repeated --approved-phrase values): ["Helps inspect lantern sample records and decide whether the evidence supports a clear review.", …]
allowed-tools: approval required; propose ["Read","Grep","Glob"]
No allowed-tools field will be written until approved with repeated --allowed-tool values or one --allowed-tools list.
RESOURCE_MAP order: ["references/field-notes.md"]
Integration plan: brindle-lantern
I1 advisor discovery: run node .skilled/bin/skill-advisor.cjs skill_graph_scan --trusted.
…
I6 changelog: Create the relative link .skilled/changelog/brindle-lantern -> ../skills/brindle-lantern/changelog.
Apply gate: no writes without --apply.
exit 0
```

Three facts this rerun proves. It prints the plan with **no** `--apply` and closes on the
engine's own gate line, so the rerun writes nothing. The allowed-tools question has a list
to offer: `propose ["Read","Grep","Glob"]`, the engine's proposal, not a workflow constant.
And the phrases the operator approved are on screen as `Approved intent phrases (8)`.

## 4. A plain skill: the operator answers no

The harness asks the allowed-tools question and answers no, then makes no further call,
which is what the workflow does: no agent step, no preserve, no apply, and the scratch
root has nothing in it yet.

| Check | Result |
|-------|--------|
| `sha256` of the whole temporary repository before the plan | `a1e4dfddc73397b586e57c9d5830b7f1411a27a171d73d14f2b699b6f05f3470` |
| The same hash after the "no" | `a1e4dfddc73397b586e57c9d5830b7f1411a27a171d73d14f2b699b6f05f3470` |
| Rendered status | `STATUS=CANCELLED ACTION=cancelled`, `Declined: the allowed-tools list`, `Changed: none` |

## 5. A plain skill: the operator answers yes

The allowed-tools answer becomes `--allowed-tools Read,Grep,Glob`, and that rerun prints the
plain-skill plan line the operator approves:

```text
allowed-tools: ["Read","Grep","Glob"]
```

The workflow agent's prose goes into the one scratch root, and the preserve proof runs from
it:

```text
<scratch root> holds: agent-output.md, snapshot, staging

$ node .skilled/commands/doctor/scripts/sk-skill-convert.cjs preserve --snapshot ".skilled/skills/.state/doctor-sk-skill/brindle-lantern/scratch/snapshot" ".skilled/skills/.state/doctor-sk-skill/brindle-lantern/scratch/staging"
Preservation PASS: 7 original body line(s) found.
exit 0
```

The final rerun carries `--approved-phrase` eight times, `--allowed-tools` and
`--agent-output`, prints the plan with `3. Use workflow agent prose from <temp>/.skilled/skills/.state/doctor-sk-skill/brindle-lantern/scratch/agent-output.md.`,
and still closes on `Apply gate: no writes without --apply.` at exit 0. The conversion
question is then answered yes and equals `apply … --apply` with the same flags:

```text
Converted brindle-lantern; preservation and the format gates passed, and 6 integration row(s) ran.
Backup: <temp>/.skilled/skills/.state/doctor-sk-skill/brindle-lantern/2026-10-30T10-43-58-229Z
Snapshot: <temp>/.skilled/skills/.state/doctor-sk-skill/brindle-lantern/2026-10-30T10-43-58-229Z/before
Converted skill: <temp>/.skilled/skills/brindle-lantern
Preservation PASS: 7 original body line(s) found.
node <repo>/.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs --fix … (exit 0)
OK   [S] brindle-lantern  (wrote leaf-manifest.json, leaf-aliases.json)
checked=1 passed=1 failed=0 fixed=1
node <repo>/.skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs --root … --write (exit 0)
/usr/bin/python3 <repo>/.skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py … --check --strict (exit 0)
Result: PASS
/usr/bin/python3 <repo>/.skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py … (exit 0)
Detected kind: standalone
I1 advisor discovery: scanned; the advisor reads the new root. Manual fallback: /doctor:skill-advisor rebuild.
I2 compiled skill graph: recompiled; .skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json is current.
I3 router reach and budget: "lantern sample review" -> brindle-lantern ranks 1 of 1 above the bar.
I3 router reach and budget: description budget 93/130 characters.
I4 regression corpus: appended 3 case row(s) to .skilled/skills/brindle-lantern/benchmark/advisor-cases.jsonl.
I5 runtime mirrors: Hermes synced and checked (PASS: in sync).
I6 changelog: created .skilled/skills/brindle-lantern/changelog/v1.0.0.0.md.
I6 changelog: created .skilled/changelog/brindle-lantern -> ../skills/brindle-lantern/changelog.
Undo:
  rm "<temp>/.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json"
  rm "<temp>/.skilled/skills/brindle-lantern/benchmark/advisor-cases.jsonl"
  rm -r "<temp>/hermes-out"
  rm "<temp>/.skilled/skills/brindle-lantern/changelog/v1.0.0.0.md"
  rm "<temp>/.skilled/changelog/brindle-lantern"
  rm -r "<temp>/.skilled/skills/brindle-lantern"
Check: node "<repo>/.skilled/commands/doctor/scripts/sk-skill-check.cjs" check "<temp>/.skilled/skills/brindle-lantern"
exit 0
```

The block the engine printed is a `rm` or `rm -r` per path this run created, because a
plain conversion overwrites nothing outside the folder it just staged: there is no backup
line to copy back, and the `Check:` line names the converted root, not the outside source
the skill came from.

| Check | Result |
|-------|--------|
| The source folder is untouched | `sha256` equal before and after the apply |
| The staged root carries `SKILL.md` and `ROUTER.md` | both present |
| The undo block is printed by the engine | yes, six `rm` / `rm -r` lines and the `Check:` line |
| The `Check:` line names the converted root | yes, `<temp>/.skilled/skills/brindle-lantern` |
| The one scratch root is deleted after the finished run | yes |

### The re-read through the check engine

`node .skilled/commands/doctor/scripts/sk-skill-check.cjs <temp>/.skilled/skills/brindle-lantern --json`
runs from this worktree, the way an operator runs it, and exits 1 with `findingCount: 2`:

```text
C3   PASS     Format: Strict package validation passed.
C4   PASS     Root metadata: Root metadata contract passed.
C5   PASS     Intent signals: The intent signals differ from the scaffold defaults.
C6   FINDING  Derived freshness: Derived content validation reported an error: derived.key_files is missing or empty after repair …
C7   PASS     Router equivalence: Parsed 1 intent signal groups and 1 resource-map entries.
C10  FINDING  Changelog: The changelog index link is missing or does not resolve.
C11  PASS     Description budget: Outside-root description is 93 characters, within the 130-character soft target.
```

`C10` is a vantage artifact: the check answers `findRepoRoot` from its own script location,
which is this worktree, while the fixture's own `.skilled/changelog/brindle-lantern` link
resolves inside the temporary repository. `C6` is reported as printed: the fixture is a
two-file skill whose `graph-metadata.json` comes from `init_skill.py`, and the derived block
is regenerated in a temporary repository whose shared modules are this checkout's. Both are
the conversion-completes-but-a-row-still-finds case the workflow describes: the conversion
is `STATUS=OK` and the rows are the next step, not a failure.

## 6. An older Skilled skill: the trim question, then the conversion

`plan older-sample` exits 1:

```text
DESCRIPTION_TOO_LONG: The description is 173 characters; the 130-character limit needs a separately approved trim.
```

The trim question is answered with the approved text, and the rerun is the same plan form
with that one flag:

```text
$ node .skilled/commands/doctor/scripts/sk-skill-convert.cjs apply older-sample --description-trim "Older sample skill: route an older-Skilled request and report its reference guide."
Conversion plan: older-sample
1. Add version: 1.0.0.0. Overwrite: <…>/older-sample/SKILL.md
2. Set description: "Older sample skill: route an older-Skilled request and report its reference guide." (the approved trim, within the 130-character limit). Overwrite: <…>/older-sample/SKILL.md
3. Normalize allowed-tools as a YAML sequence. Overwrite: <…>/older-sample/SKILL.md
4. Remove inline machine router and link to ROUTER.md. Overwrite: <…>/older-sample/SKILL.md
5. Create sibling ROUTER.md from the router template. Create: <…>/older-sample/ROUTER.md
Backup existing files under: <…>/.skilled/skills/.state/doctor-sk-skill/older-sample/<timestamp>
Follow-up items:
- ROUTER.md retains template placeholder: [TODO: Name the request signals that reach this skill, and the resource families the router selects from.]
…
Apply gate: no writes without --apply.
exit 0
```

That is the older-Skilled form of a rerun: each approved field is its own numbered step.
`apply --description-trim "<the approved text>" --apply` then exits 0:

```text
Converted older-sample; router semantics match the snapshot.
Backup: <…>/.state/doctor-sk-skill/older-sample/2026-10-30T10-44-00-149Z
Router source: inline -> ROUTER.md
Undo:
  cp "<…>/2026-10-30T10-44-00-149Z/SKILL.md" "<…>/older-sample/SKILL.md"
  rm "<…>/older-sample/ROUTER.md"
Check: node "<repo>/.skilled/commands/doctor/scripts/sk-skill-check.cjs" check "<…>/older-sample"
exit 0
```

| Check | Result |
|-------|--------|
| A backup folder is named before the writes | yes |
| The approved trim reached `SKILL.md` | yes, `Set description:` on the plan and the write behind it |
| The undo block restores the field write from that backup | yes, one `cp` |
| The undo block removes what the run created | yes, one `rm` for the `ROUTER.md` it created |

The re-read of `older-sample` exits 1 with `findingCount: 3` (`C3` missing required
sections, `C4` root-metadata violations, `C10` no changelog), the same
conversion-completes-rows-remain case.

## 7. What this run does not cover

- The questions themselves, and their wording, live in the presentation contract and are
  asserted by the contract test; the harness answered them, it did not render them.
- The temporary repositories stay under the worker's scratch folder, and the transcript
  above is the record. The plain fixture's `graph-metadata.json` and the advisor graph are
  the stand-ins named in section 1.
- The advisor graph is rebuilt by the run's own scan, not backed up: the undo block above
  removes `skill-graph.json`, and the operator rescans after running it.
