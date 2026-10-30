# After: the final verification run and the release entry

Every task in `tasks.md` is recorded here with the command that ran, the output it printed and the exit code it returned. The temp-repo conversions ran outside this checkout, under the operator scratch folder at `…/.scratch-dc90/075-010/runs/`, so the shipped tree never held a scratch skill. Absolute operator paths are shortened to `runs/<name>` for the same reason the release entry is written with repository-relative paths.

Run on 2026-10-30 in the worktree `/…/293-doctor-sk-skill-release`, on `main` at `0a8bd93611`, with a clean `git status --porcelain` before the first command.

---

## T001 Load the phase 1 strict baseline

Read the two files the phase 1 packet recorded, `001-check-engine/scratch/baseline/package-skill.json` and `.../ci-skill-root-metadata.json`. Both carry `schema: sk-skill-check-fleet-baseline/v1`, `recordedAt: 2026-10-30T05:46:24.686084+00:00` and `rootCount: 13`.

| Root | `package_skill.py --check --strict --json` | `ci-skill-root-metadata.cjs --format json` |
|---|---|---|
| cli-classifier | `valid: true`, exit 0 | `status: pass`, exit 0 |
| cli-external-orchestration | `valid: true`, exit 0 | `status: pass`, exit 0 |
| cli-orca | `valid: true`, exit 0 | `status: pass`, exit 0 |
| mcp-code-mode | `valid: true`, exit 0 | `status: pass`, exit 0 |
| mcp-tooling | `valid: true`, exit 0 | `status: pass`, exit 0 |
| sk-code | `valid: true`, exit 0 | `status: pass`, exit 0 |
| sk-design | `valid: true`, exit 0 | `status: pass`, exit 0 |
| sk-doc | `valid: true`, exit 0 | `status: pass`, exit 0 |
| sk-git | `valid: true`, exit 0 | `status: pass`, exit 0 |
| sk-prompt | `valid: true`, exit 0 | `status: pass`, exit 0 |
| system-deep-loop | `valid: true`, exit 0 | `status: pass`, exit 0 |
| system-skill-advisor | `valid: true`, exit 0 | `status: pass`, exit 0 |
| system-spec-kit | `valid: true`, exit 0 | `status: pass`, exit 0 |

**Result**: 13 roots, one verdict per shipped root, all pass. This is the comparison point for T004.

---

## T002 Confirm phases 1 to 9 are closed

```text
$ for d in 001-check-engine … 009-mirror-and-template-fixes; do
    bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh "specs/sk-doc/075-doctor-sk-skill-command/$d" --strict
  done
=== 001-check-engine ===                RESULT: PASSED   exit=0
=== 002-check-plumbing ===              RESULT: PASSED   exit=0
=== 003-convert-legacy-skilled ===      RESULT: PASSED   exit=0
=== 004-convert-plain-skill ===         RESULT: PASSED   exit=0
=== 005-integration ===                 RESULT: PASSED   exit=0
=== 006-convert-plumbing ===            RESULT: PASSED   exit=0
=== 007-docs-and-changelogs ===         RESULT: PASSED   exit=0
=== 008-hub-gap-report ===              RESULT: PASSED   exit=0
=== 009-mirror-and-template-fixes ===   RESULT: PASSED   exit=0
```

**Result**: nine children, nine `RESULT: PASSED`, every exit 0.

---

## T003 Confirm the phase 5 temp-repo harness runs

```text
$ node --test .skilled/commands/doctor/scripts/tests/sk-skill-integrate.test.cjs
✔ I5 records the override folder the copies land in
✔ I6 creates the versioned entry and the relative index link
✔ the fleet report matches the golden recorded before the flag existed
ℹ tests 25
ℹ pass 25
ℹ fail 0
exit=0
```

**Result**: the harness runs and its 25 cases pass, so it is the setup T008 and T009 build on.

---

## T004 Strict verdict on every shipped skill

```text
$ for d in $(ls -1 .skilled/skills | grep -v '^README.txt$' | grep -v '^local-'); do
    python3 .skilled/skills/sk-doc/scripts/package_skill.py ".skilled/skills/$d" --check --strict
  done
=== cli-classifier ===                    Result: PASS   exit=0
=== cli-external-orchestration ===        Result: PASS   exit=0
=== cli-orca ===                          Result: PASS   exit=0
=== mcp-code-mode ===                     Result: PASS   exit=0
=== mcp-tooling ===                       Result: PASS   exit=0
=== sk-code ===                           Result: PASS   exit=0
=== sk-design ===                         Result: PASS   exit=0
=== sk-doc ===                            Result: PASS   exit=0
=== sk-git ===                            Result: PASS   exit=0
=== sk-prompt ===                         Result: PASS   exit=0
=== system-deep-loop ===                  Result: PASS   exit=0
=== system-skill-advisor ===              Result: PASS   exit=0
=== system-spec-kit ===                   Result: PASS   exit=0
```

**Result**: 13 of 13 keep the phase 1 baseline verdict. No `local-` root was in the run and the target list is unchanged from the baseline.

---

## T005 Advisor scorer baseline, without `--write`

```text
$ node .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs
{
  "schemaVersion": 1,
  "capturedAt": "2026-10-11",
  "capturedAtSha": "0a8bd93611",
  "corpusSha256": "sha256:9f30cc5e5f2d6c4d15e598fe25b922dc371297596295ab79346c881f6a4aa677",
  "holdoutSha256": "sha256:f9868059ea0b1ba7af76198a2b30e21e75d5be2a82ddf8f2920cc7e541c5cb1f",
  "ambiguitySha256": "sha256:07cd2c76f41070ba74baaa0beb333d07cd6736a473c5ab79921d2ebfb1f8214d",
  "metrics": {
    "full_corpus_top1": { "correct": 155, "total": 195, "accuracy": 0.7949 },
    "unknown_count": { "value": 13 },
    "gold_none_false_fire": { "value": 5 },
    "holdout_top1": { "correct": 49, "total": 66, "accuracy": 0.7424 },
    "ambiguity_top1": { "correct": 19, "total": 24, "accuracy": 0.7917, "tau": 0.03 },
    "buckets": {
      "review": { "correct": 25, "total": 31, "accuracy": 0.8065 },
      "memory_save": { "correct": 27, "total": 32, "accuracy": 0.8438 },
      "delegation": { "correct": 17, "total": 17, "accuracy": 1 }
    }
  }
}
exit=0
```

**Result**: 155/195, 49/66 and 19/24, exactly the three numbers the phase expected. No `--write` was passed, so no tracked baseline file changed.

---

## T006 Leaf-route replay

```text
$ node .skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs | grep ^total
total gold=65 scored=57 tied=3 mean_f1=0.9176 exact=50
exit=0
```

**Result**: the line matches the expected one character for character.

---

## T007 The doctor suite

```text
$ bash .skilled/commands/doctor/scripts/tests/run-all.sh
…
Results: 22 passed, 0 failed
[run-all] PASS: route-validate.test.sh
…
 Test Files  1 passed (1)
      Tests  19 passed (19)
[run-all] PASS: skill-graph freshness panel (vitest)
[run-all] 7 suite(s) passed, 0 failed
exit=0
```

**Result**: every suite printed `PASS`, 7 of 7.

---

## T008 A full convert of a plain scratch skill

The harness is a temporary repository under `runs/t008`, never this checkout.

```text
$ mkdir -p runs/t008
$ git -c core.fsmonitor=false archive HEAD | tar -x -C runs/t008
exit=0                                    # 2.0G, 122478 tracked files
$ cd runs/t008 && git init -q && git add -A
$ GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=core.fsmonitor GIT_CONFIG_VALUE_0=false \
    git -c user.name=t -c user.email=t@t commit -q -F <message-file>
commit exit=0
$ git -c core.fsmonitor=false status --porcelain | wc -l
0
```

Two fixture commits follow: `chore(fixture): record the tracked tree at head` and `chore(fixture): add the plain skill the conversion will read`. No git config was written; every setting travelled on the command line.

The build outputs a never-provisioned clone lacks were borrowed from this worktree, read-only for `node_modules` and copied for the two `dist` trees, so a write cannot land here. The plain skill is `harbor-ledger`, an invented name, with `SKILL.md` and `references/Tally Notes.md` and no Skilled metadata.

```text
$ node .skilled/commands/doctor/scripts/sk-skill-convert.cjs plan incoming/harbor-ledger
INTENT_SIGNALS_BELOW_FLOOR: Only 0 approved intent phrase(s) were supplied; at least 8 are required.
Suggested phrases: ["Tracks harbor ledger entries and decides whether a shipment record needs a second review."]
exit=1
```

That refusal is the workflow's first question, not a stop: a plain skill cannot plan until its intent phrases are approved. Eight phrases of three words each were approved, with the allowed-tools list.

### The cancelled path: the apply gate

```text
$ git status --porcelain                      # before
                                              # 0 lines
$ node .skilled/commands/doctor/scripts/sk-skill-convert.cjs apply incoming/harbor-ledger \
    --approved-phrase "harbor ledger review" --approved-phrase "shipment record check" \
    --approved-phrase "tally sheet comparison" --approved-phrase "second count request" \
    --approved-phrase "marked route lookup" --approved-phrase "harbor entry audit" \
    --approved-phrase "ledger tally verify" --approved-phrase "shipment evidence review" \
    --allowed-tools "Read,Grep,Glob" --agent-output <scratch>/agent-output.md
Conversion plan: harbor-ledger
1. Copy the source under frontmatter name harbor-ledger; source remains unchanged. Copy: …/incoming/harbor-ledger -> …/.skilled/skills/harbor-ledger
2. Render ROUTER.md with PRIMARY keywords [...] and RESOURCE_MAP ["references/tally-notes.md"] in body order. Create: …/.skilled/skills/harbor-ledger/ROUTER.md
3. Use workflow agent prose from …/.state/doctor-sk-skill/harbor-ledger/scratch/agent-output.md.
4. Snapshot the source body and require every non-heading line to survive in SKILL.md, ROUTER.md, or references/.
5. Rename references/Tally Notes.md to references/tally-notes.md, add resource frontmatter, and rewrite links.
6. Run init_skill.py into os.tmpdir() and copy only absent metadata and scaffold files; write the approved phrases.
7. Run ci-skill-root-metadata.cjs --fix --skills-dir …/.skilled/skills --skill harbor-ledger.
8. Run regenerate-skill-derived.cjs --root …/.skilled/skills/harbor-ledger --write.
9. Run package_skill.py …/.skilled/skills/harbor-ledger --check --strict, then validate_skill_package.py …
Backup existing files under: …/.state/doctor-sk-skill/harbor-ledger/<timestamp>
Approved intent phrases (8): [...]
allowed-tools: ["Read","Grep","Glob"]
RESOURCE_MAP order: ["references/tally-notes.md"]
Integration plan: harbor-ledger
I1 advisor discovery: run node .skilled/bin/skill-advisor.cjs skill_graph_scan --trusted.
I2 compiled skill graph: Overwrite …/skill-graph.json by running … skill_graph_compiler.py --export-json (a tracked-file write).
I3 router reach and budget: probe 3 approved phrase(s) with advisor_recommend --warm-only … description budget 89/130 characters.
I4 regression corpus: append 3 case row(s) to …/skill-advisor-regression-cases.jsonl (a framework skill in this repository).
I5 runtime mirrors: run … sync-skills-hermes.cjs, then … sync-skills-hermes.cjs --check for Hermes.
I6 changelog: Create …/.skilled/skills/harbor-ledger/changelog/v1.0.0.0.md.
I6 changelog: Create the relative link .skilled/changelog/harbor-ledger -> ../skills/harbor-ledger/changelog.
Apply gate: no writes without --apply.
exit=0
$ git status --porcelain                      # after
                                              # 0 lines
```

**Result**: the apply gate printed its own line and the tree is identical before and after, which is the cancelled path. The two scratch folders the workflow needs (the preservation snapshot and the staging copy) live under the gitignored `.skilled/skills/.state/doctor-sk-skill/harbor-ledger/scratch/`, so they cannot appear in a status read.

### The agent step and the preservation proof

The reshaped `SKILL.md` prose was written by hand into `agent-output.md` under the one scratch root, then proved against a snapshot of the source body.

```text
$ node .skilled/commands/doctor/scripts/sk-skill-convert.cjs preserve --snapshot <scratch>/snapshot <scratch>/staging
Preservation PASS: 6 original body line(s) found.
exit=0
```

### The OK path

```text
$ node .skilled/commands/doctor/scripts/sk-skill-convert.cjs apply incoming/harbor-ledger <the same flags> --apply
…
Converted skill: …/.skilled/skills/harbor-ledger
Preservation PASS: 6 original body line(s) found.
node … ci-skill-root-metadata.cjs --fix --skills-dir …/.skilled/skills --skill harbor-ledger (exit 0)
OK   [S] harbor-ledger  (wrote leaf-manifest.json, leaf-aliases.json)
checked=1 passed=1 failed=0 fixed=1
node … regenerate-skill-derived.cjs --root …/.skilled/skills/harbor-ledger --write (exit 0)
{ "mode": "write", "total": 1, "changed": 0, "errored": 0,
  "results": [ { "name": "harbor-ledger", "status": "unchanged" } ] }
python3 … package_skill.py …/.skilled/skills/harbor-ledger --check --strict (exit 0)
✅ Skill is valid!
Result: PASS
python3 … validate_skill_package.py …/.skilled/skills/harbor-ledger (exit 0)
Detected kind: standalone
- package_skill.py --check: PASS (exit 0)
I1 advisor discovery: scanned; the advisor reads the new root. Manual fallback: /doctor:skill-advisor rebuild.
I2 compiled skill graph: FAILED - the compiler exited 2: ZERO-EDGE WARNINGS (1):.
I3 router reach and budget: "harbor ledger review" -> harbor-ledger ranks 1 of 3 above the bar.
I3 router reach and budget: "shipment record check" -> harbor-ledger ranks 1 of 1 above the bar.
I3 router reach and budget: "tally sheet comparison" -> harbor-ledger ranks 1 of 1 above the bar.
I3 router reach and budget: description budget 89/130 characters.
I4 regression corpus: appended 3 case row(s) to …/skill-advisor-regression-cases.jsonl.
I5 runtime mirrors: Hermes synced and checked (PASS: 66 Hermes skill copies in sync).
I6 changelog: created …/.skilled/skills/harbor-ledger/changelog/v1.0.0.0.md.
I6 changelog: created .skilled/changelog/harbor-ledger -> ../skills/harbor-ledger/changelog.
Undo:
  cp "…/integration/skill-advisor-regression-cases.jsonl-f2dc7ca0ae05" "…/fixtures/skill-advisor-regression-cases.jsonl"
  rm -r "…/.hermes/skills"
  cp -R "…/integration/skills-314a62669833" "…/.hermes/skills"
  rm "…/.skilled/skills/harbor-ledger/changelog/v1.0.0.0.md"
  rm "…/.skilled/changelog/harbor-ledger"
  rm -r "…/.skilled/skills/harbor-ledger"
Check: node … sk-skill-check.cjs check …/.skilled/skills/harbor-ledger
exit=1
```

**Result**: the conversion ran, the strict gate printed `Result: PASS` and the changelog entry and its relative link were created, which is what this task verifies. The run exited 1 because integration row I2 failed, and the shipped workflow treats exactly that as a finished conversion with one row left to the operator (`Exit 1 with an Undo: block printed means the conversion and its format gates finished and an integration row failed: the staged or converted skill is kept`).

**Why I2 failed, and why it is not a regression from this program.** A brand-new skill's scaffold writes an empty `edges` map, and `skill_graph_compiler.py` counts a zero-edge skill as a hard failure: `validate_zero_edge_skills()` appends `… has zero edges (orphan)`, the caller adds those to `topology_violations`, and the run exits 2 with `VALIDATION FAILED`. The gate is older than this program: `git log -S 'ZERO-EDGE'` finds only the source-root move, so no commit in this release explains it. Nothing in the release changed the compiler or the scaffold. The finding is recorded rather than repaired here, because the phase rule is that a failing check is repaired in the phase that owns the failing file.

### The five checks after the apply, in the temp repository

```text
=== node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check ===
PASS: 66 Hermes skill copies in sync
exit=0

=== node .skilled/commands/doctor/scripts/skill-graph-freshness.cjs --strict ===
  compiled skill-graph.json : 13 skills, generated_at 2026-10-30T09:31:52.845859+00:00
  SQLite skill-graph.sqlite : 14 nodes
  on-disk graph-metadata    : 14 skills (source of truth)
  STALE COMPILED: skill-graph.json older than the newest source stamp (harbor-ledger)
  MISSING (on disk, not in compiled json): harbor-ledger
  SIGNAL DRIFT compiled vs disk: harbor-ledger
  (report-only — the canonical reindex is operator-gated; nothing was written)
exit=1

=== ls .skilled/changelog/harbor-ledger/ ===
v1.0.0.0.md
exit=0

=== python3 .skilled/skills/sk-doc/scripts/package_skill.py .skilled/skills/harbor-ledger --check --strict ===
✅ Skill is valid!
Result: PASS
exit=0

=== node .skilled/commands/doctor/scripts/sk-skill-check.cjs check harbor-ledger ===
VALIDATOR_CANNOT_RUN: skill_graph_compiler.py --validate-only could not run: ZERO-EDGE WARNINGS (1):
exit=2
```

**Result**: Hermes is in sync, the changelog link resolves to `v1.0.0.0.md` and the strict gate passes. The freshness panel and the check engine both report the same missing compiled graph that I2 failed to write, and the check engine cannot finish any row after C7 because its C8 reader stops at the compiler's zero-edge error. One cause, three symptoms, all recorded.

```text
$ git status --porcelain          # in runs/t008, after the apply
 M .skilled/skills/system-skill-advisor/runtime/scripts/fixtures/skill-advisor-regression-cases.jsonl
?? .hermes/skills/harbor-ledger/
?? .skilled/changelog/harbor-ledger
?? .skilled/skills/harbor-ledger/
```

**Result**: four paths, each one a write the plan printed, and nothing else.

---

## T009 A full convert of an older Skilled skill

The same harness shape under `runs/t009`, then the pre-migration skill recovered from `ca10a236d2^`.

```text
$ git -c core.fsmonitor=false archive ca10a236d2^ -- .skilled/skills/sk-git | tar -x -C runs/t009-oldref
exit=0
$ git -c core.fsmonitor=false show ca10a236d2^:.skilled/skills/sk-git/SKILL.md | head -1
---
$ cp -R runs/t009-oldref/.skilled/skills/sk-git runs/t009/.skilled/skills/ferry-commit
exit=0
```

The copy is renamed to the invented name `ferry-commit` in the four places that carry identity: the folder, the `name:` frontmatter field, `graph-metadata.json`'s `skill_id`, and `leaf-manifest.config.json`'s `workflowMode`. The derived leaf manifests are then regenerated from that config, and the changelog index link is renamed with it, which is what a renamed root in a real tree carries.

```text
$ node … ci-skill-root-metadata.cjs --fix --skills-dir .skilled/skills --skill ferry-commit
FAIL [S] ferry-commit
       MISSING_REQUIRED_FILE: ferry-commit: class S requires ROUTER.md
       RRC-001: ferry-commit: no sibling ROUTER.md at the skill root
checked=1 passed=0 failed=1 fixed=1
exit=1
```

That failure is the shape the conversion exists to fix, and it is recorded before the conversion on purpose. One more fixture step was needed and is recorded here rather than hidden: the renamed root declares three sibling edges, so the graph symmetry check requires the three peers to name it back. Without those reciprocal edges the plan cannot even classify its input.

```text
$ python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py --validate-only   # before
SYMMETRY WARNINGS (3):
  - SYMMETRY: ferry-commit has sibling sk-doc, but sk-doc missing sibling ferry-commit
  - SYMMETRY: ferry-commit has sibling sk-code, but sk-code missing sibling ferry-commit
  - SYMMETRY: ferry-commit has sibling cli-orca, but cli-orca missing sibling ferry-commit
VALIDATION FAILED: 3 error(s)
$ … --validate-only                                                                                    # after
VALIDATION PASSED: all metadata files are valid
```

### The strict gate before the conversion

```text
$ python3 .skilled/skills/sk-doc/scripts/package_skill.py .skilled/skills/ferry-commit --check --strict
❌ Strict mode: 3 contract requirement(s) unmet — routing shape RS-002: '## MACHINE ROUTER' section at line 459 belongs in the sibling ROUTER.md; routing shape RS-004: no sibling ROUTER.md beside SKILL.md; every skill and mode packet owns one; routing shape RS-005: no relative markdown link to the sibling ROUTER.md
⚠️  1 warning(s): SKILL.md has 4354 words (recommended max: 3000)
Result: FAIL
exit=1
```

**Result**: the same three routing-shape requirements the design's evidence recorded on this ref, so the fixture reproduces the pre-migration state rather than a tidied copy of it.

### The cancelled path: the apply gate

```text
$ git status --porcelain                      # before
                                              # 0 lines
$ node .skilled/commands/doctor/scripts/sk-skill-convert.cjs apply ferry-commit
Conversion plan: ferry-commit
1. Remove inline machine router and link to ROUTER.md. Overwrite: …/.skilled/skills/ferry-commit/SKILL.md
2. Create sibling ROUTER.md from the router template. Create: …/.skilled/skills/ferry-commit/ROUTER.md
Backup existing files under: …/.state/doctor-sk-skill/ferry-commit/<timestamp>
Follow-up items:
- ROUTER.md retains template placeholder: [TODO: Name the request signals that reach this skill, …]
- ROUTER.md retains template placeholder: [TODO: Write one bullet per `INTENT_SIGNALS` key: …]
- ROUTER.md retains template placeholder: [TODO: Keep this section and the machine block below in sync. …]
- Review SKILL.md wording: The tables and the pseudocode sit in the final `MACHINE ROUTER` section of this file.
Apply gate: no writes without --apply.
exit=0
$ git status --porcelain                      # after
                                              # 0 lines
```

### The OK path

```text
$ node .skilled/commands/doctor/scripts/sk-skill-convert.cjs apply ferry-commit --apply
Converted ferry-commit; router semantics match the snapshot.
Backup: …/.state/doctor-sk-skill/ferry-commit/2026-10-30T12-16-38-516Z
Router source: inline -> ROUTER.md
Undo:
  cp "…/2026-10-30T12-16-38-516Z/SKILL.md" "…/.skilled/skills/ferry-commit/SKILL.md"
  rm "…/.skilled/skills/ferry-commit/ROUTER.md"
Check: node … sk-skill-check.cjs check …/.skilled/skills/ferry-commit
exit=0
```

```text
$ git status --porcelain
 M .skilled/skills/ferry-commit/SKILL.md
?? .skilled/skills/ferry-commit/ROUTER.md
```

**Result**: exactly the two files the plan named. This path runs no integration rows, which is what the shipped workflow says of it.

### parseRouter, before and after

A comparison script read the saved pre-conversion `SKILL.md` and the converted root through the same `parseRouter` the engine uses.

```text
$ node runs/parse-router-compare.cjs runs/ferry-commit-SKILL-before.md runs/t009/.skilled/skills/ferry-commit .skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs
{
  "before": { "routerSource": "inline",    "intentCount": 5, "resourceMap": { "WORKSPACE_SETUP": [...], "COMMIT": [...], "FINISH": [...], "GITKRAKEN_MCP": [...], "SHARED_PATTERNS": [...] }, "defaultResource": ["references/quick-reference.md"], "defaultResourceSemantics": null, "parseable": true },
  "after":  { "routerSource": "ROUTER.md", "intentCount": 5, "resourceMap": { "WORKSPACE_SETUP": [...], "COMMIT": [...], "FINISH": [...], "GITKRAKEN_MCP": [...], "SHARED_PATTERNS": [...] }, "defaultResource": ["references/quick-reference.md"], "defaultResourceSemantics": null, "parseable": true },
  "contentEqual": true,
  "semanticsEqual": true
}
exit=0
```

**Result**: the router moved from inline to `ROUTER.md` with the same five intent groups, the same resource map, the same default resource and the same parseable verdict. `contentEqual` and `semanticsEqual` are both true, which is the claim the engine prints as `router semantics match the snapshot`.

### The five checks after the apply, in the temp repository

```text
=== node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check ===
DRIFT ferry-commit
FAIL: 1 drifted, 0 stale; run without --check to regenerate
exit=1

=== node .skilled/commands/doctor/scripts/skill-graph-freshness.cjs --strict ===
  compiled skill-graph.json : 13 skills, generated_at 2026-10-30T09:31:52.845859+00:00
  SQLite skill-graph.sqlite : absent
  on-disk graph-metadata    : 14 skills (source of truth)
  MISSING (on disk, not in compiled json): ferry-commit
  SIGNAL DRIFT compiled vs disk: ferry-commit
  (report-only — the canonical reindex is operator-gated; nothing was written)
exit=1

=== ls .skilled/changelog/ferry-commit/ ===
v1.0.0.0.md … v1.11.5.0.md   (47 entries, the last is the frontmatter version)
exit=0

=== python3 .skilled/skills/sk-doc/scripts/package_skill.py .skilled/skills/ferry-commit --check --strict ===
✅ Skill is valid!
⚠️  1 warning(s): SKILL.md has 4354 words (recommended max: 3000)
Result: PASS
exit=0

=== node .skilled/commands/doctor/scripts/sk-skill-check.cjs check ferry-commit ===
Skill check: ferry-commit (canon)
C1  PASS    Location: Direct child of the skills root.
C2  PASS    Input kind: Resolver verdict: router-md; input kind: canon.
C3  PASS    Format: Strict package validation passed.
C4  PASS    Root metadata: Root metadata contract passed.
C5  PASS    Intent signals: The intent signals differ from the scaffold defaults.
C6  PASS    Derived freshness: Generated derived content is current.
C7  PASS    Router equivalence: Parsed 5 intent signal groups and 5 resource-map entries.
C8  FINDING Advisor home: compiled skill graph is stale Advisor backend is unavailable; no recommendation verdict was inferred.
C9  FINDING Runtime mirrors: Runtime mirror status: Claude:pass, OpenCode:pass, Pi:pass, Devin:pass, Hermes:finding, Codex:n/a, Cursor:n/a.
C10 PASS    Changelog: The versioned changelog and index link resolve.
C11 PASS    Description budget: Description is OK at 122 characters.
C12 PASS    Collisions: No duplicate, reserved-prefix or runtime-persona collision found.
C13 INFO    Regression coverage: Regression corpus contains 0 matching cases.
Result: FINDINGS (2)
exit=1
```

**Result**: the strict gate moved from FAIL on three routing-shape requirements to `Result: PASS`, and the changelog link resolves to a folder holding `v1.11.5.0.md`. C10 passes, which is the link check this task asks for. C8 and C9 are the two reach writes this path does not run: the compiled graph has not been regenerated and the Hermes mirror has not been refreshed, and the shipped workflow says so of the older-Skilled path by listing no integration rows for it. C7 confirms the parsed router reads five intent groups and five resource-map entries after the move.

---

## T010 The setup listing

```text
$ rg -c "doctor:sk-skill" .skilled/commands/doctor/assets/doctor-setup-presentation.txt
2
exit=0

$ rg -n "doctor:sk-skill" .skilled/commands/doctor/assets/doctor-setup-presentation.txt
28:| `/doctor:sk-skill check [<name-or-path>] [--json] [--into-hub <hub>]` | How far one skill, or the whole fleet, is from the Skilled format, row by row, with the repair for each finding |
29:| `/doctor:sk-skill convert <name-or-path> [--dry-run]` | Moving one skill to the Skilled format: the plan, one yes per write, the backup, the write and the engine's undo block |
exit=0
```

**Result**: two rows, both inside section 2, the doctor target list `/doctor:setup` renders first in every run. Both targets are listed.

---

## T011 The command document and the route manifest

```text
$ python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/commands/doctor/sk-skill.md --type command
✅ VALID: .skilled/commands/doctor/sk-skill.md
Document type: command
Total issues: 0
exit=0

$ bash .skilled/commands/doctor/scripts/route-validate.sh
PASS: A1: manifest parses as YAML
PASS: B1: .routes has 20 entries
PASS: G3: default_target is boolean, read-only and unique per command
PASS: J1: targets are in parity with their router and presentation across 9 commands
OK: route-validate — 20 routes validated, 3 warnings
exit=0
```

**Result**: `Total issues: 0` and exit 0 for both. The three warnings are the pre-existing informational flag-sharing notices for other commands (`--dry-run`, `--profile`), not findings.

---

## T012 No scratch skill in this worktree

```text
$ git -c core.fsmonitor=false status --porcelain
                                              # 0 lines
$ git -c core.fsmonitor=false status --porcelain -- .skilled/skills .skilled/changelog
                                              # 0 lines
```

**Result**: no path under `.skilled/skills/` or `.skilled/changelog/` from either conversion. Both scratch skills existed only inside the temporary repositories.

---

## T013 The framework release entry

`.skilled/changelog/skilled/v4.0.1.2.md` was written through the create-changelog contract: the source is this packet, the target resolves to the framework release line, and the version is the next one after `v4.0.1.1`.

```text
$ python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/changelog/skilled/v4.0.1.2.md --type changelog
✅ VALID: .skilled/changelog/skilled/v4.0.1.2.md
Document type: changelog
Total issues: 0
exit=0

$ python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py .skilled/changelog/skilled/v4.0.1.2.md
  hard blockers:          0
  mechanical deductions:  -0
  mechanical ceiling:     100/100
exit=0

$ python3 .skilled/skills/sk-doc/shared/scripts/extract_structure.py .skilled/changelog/skilled/v4.0.1.2.md
  headings: H1 + 2 H2 ("What's New at a Glance", "Upgrade")
  total_lines: 36     dqi: 89 (good)     checklist: 1 passed, 0 failed
exit=0
```

**Result**: the entry validates at zero issues, scans with no hard blocker, and sits at 36 lines, inside the compact ceiling of 40.

**Recorded from the version step**: `git ls-remote --exit-code --tags origin refs/tags/v4.0.1.0` prints the tag and exits 0, while the same query for `refs/tags/v4.0.1.1` prints nothing and exits 2, so the workflow's open-release rule would extend `v4.0.1.1` rather than number a new entry. The phase names the next version explicitly, and the packet's open question records that decision, so the entry takes `v4.0.1.2` and the tag state is recorded here instead of silently overriding either rule. The framework line has no `SKILL.md` of its own, so there is no version carrier to bump beside the entry.

---

## T014 CI on main

Not run by this phase. The operator merges first, and the CI read needs the merge commit: `gh run list --branch main --commit <merge-sha>`. Left `[ ]` in `tasks.md` with that note.

---

## Verification of this packet

```text
$ bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/075-doctor-sk-skill-command --recursive --strict
…
Summary: Errors: 0  Warnings: 0
RESULT: PASSED
…  the same two lines for every child folder
Summary: Errors: 0  Warnings: 0
RESULT: PASSED
exit=0
```

**Result**: 11 folders validated, 11 `RESULT: PASSED`, 0 `RESULT: FAILED`. The run also carries the two generated-metadata repairs that follow from editing the packet's own spec docs, and one advisory acceptance-coverage note for the row that waits on the merge.
