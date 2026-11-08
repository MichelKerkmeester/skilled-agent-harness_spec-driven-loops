# Iteration 11 — Attribution Pass Over Every Logged Finding

**Run:** 047-v4-release-line-research / 002-authoring-hubs
**Iteration:** 11 of 11
**Date:** 2026-11-08
**Focus:** attribute every finding in the registry that carries no single release tag (`v4.0.0.0 baseline`, `present at …`, or missing) to the commit that introduced it, then to the first release tag after that commit.

---

## FOCUS

The registry holds 44 finding rows. Fourteen of them name no single release: three carry no `release` field at all (iter-002's rows), six say `v4.0.0.0 baseline` (iter-003 and iter-004), two say `present at v4.0.2.0 (introducing release not isolated)`, and one says `gap across v4.0.0.0 to v4.0.2.0`. This iteration replaces those with a commit sha and a tag. It also produced two corrections that the registry needs, because the probe that was supposed to confirm a finding instead contradicted it.

Method: `git log --format='%h|%cs|%s' -S'<distinctive string>' -- <cited file>`, and `--follow` wherever a file was renamed. The `--follow` requirement is not cosmetic here: the whole `.skilled` tree was moved from `.opencode` in rename commit `330427cf30` (2026-09-17), so every `-S` probe without `--follow` terminates at that rename and reports it as the introduction. Nine of the probes below hit exactly that wall on the first attempt.

Tag calendar read from `git for-each-ref --format='%(refname:short)|%(objectname:short)|%(creatordate:short)' refs/tags`:

| tag | short sha | date |
| --- | --- | --- |
| v4.0.0.0-beta.1 | 3a88a97302 | 2026-08-09 |
| v4.0.0.0 | 6e11d39b26 | 2026-09-21 |
| v4.0.0.1 | e38f27d399 | 2026-09-25 |
| v4.0.0.2 | 37aeee1457 | 2026-09-28 |
| v4.0.0.3 | 6195f0818d | 2026-10-06 |
| v4.0.0.4–.10 | (per-tag shas) | 2026-10-14 |
| v4.0.0.11 | 58f0e99ea6 | 2026-10-17 |
| v4.0.0.12 | ca52e782c0 | 2026-10-17 |
| v4.0.0.13 | bed54144fd | 2026-10-23 |
| v4.0.0.14 | aee7a6006a | 2026-10-25 |
| v4.0.0.15 | fef2125322 | 2026-10-27 |
| v4.0.0.16 | 535264ff2c | 2026-10-28 |
| v4.0.1.0 | 924f76f07f | 2026-11-05 |
| v4.0.2.0 | 51f70a0317 | 2026-11-08 |

The tag `creatordate` values differ from the sha list in the run topic (the topic carried peeled commit object ids; `for-each-ref` prints the tag objects). Dates are what the mapping needs, and they are consistent with the topic's ordering.

---

## ACTIONS TAKEN

1. Read all 11 delta files and extracted the 44 `finding` rows (`cat deltas/iter-*.jsonl | grep '"type":"finding"'`), then classified each by whether its `release` field names one tag.
2. Resolved the tag calendar with one `for-each-ref` pass.
3. Ran 22 distinct `-S` probes across 14 cited files, first without and then with `--follow`, to break through the `.opencode` → `.skilled` rename.
4. Read the cited lines back out of the working tree (`grep -n`) so each attribution row is anchored to a line that says what the finding claims, plus two `sed -n` reads of `sk-design/` and `doctor/sk-code.md`.
5. Probed the two findings whose premise looked weakest (`f-iter002-002`, `f-iter004-001`) rather than accepting the earlier reading. Both needed correction; see F1 and F2.

---

## ATTRIBUTION TABLE

`pre-v4.0.0.0` means the introducing commit predates the baseline tag `v4.0.0.0-beta.1` (2026-08-09). Commits between 2026-08-09 and 2026-09-21 shipped in `v4.0.0.0`.

| finding | type | introducing commit | date | release |
| --- | --- | --- | --- | --- |
| f-iter001-001 | bug | not isolated — `-S'sk-create-quality-control/scripts/validate_skill_package.py'` on `leaf-manifest.json` returns **no commit**, so that path spelling never existed; the manifest stores packet-relative leaves plus a `packet` field instead [SOURCE: .skilled/skills/sk-doc/leaf-manifest.json:137] | — | pre-v4.0.0.0 (medium confidence) |
| f-iter001-002 | drift | note authored at the tag | 2026-09-21 | v4.0.0.0 (unchanged) |
| f-iter001-003 | drift | fixture predates the v4.0.1.0 retirement it broke | — | v4.0.1.0 (unchanged) |
| f-iter001-004 | improvement | `git log --diff-filter=A -- .skilled/skills/sk-design/README.md` returns **nothing**: sk-design has never had a README in any commit. The skill root arrived in `374749593e` (2026-08-28) | 2026-08-28 | v4.0.0.0 |
| f-iter002-001 | drift | `94d97c718e` "spec(085/002): sk-prompt manual testing playbook — 28 scenarios across 7 categories" [SOURCE: .skilled/skills/sk-prompt/manual-testing-playbook/clear-scoring/forty-of-fifty-threshold.md:82] | 2026-05-06 | **pre-v4.0.0.0** |
| f-iter002-002 | drift | **RETRACTED** — see F1 | — | — |
| f-iter002-003 | ux | playbook package added in `374749593e`; the operator-scenario gap is original to the package [SOURCE: .skilled/skills/sk-design/manual-testing-playbook/manual-testing-playbook.md] | 2026-08-28 | v4.0.0.0 |
| f-iter003-001 | drift | `cdc8e7192d` "fix(commands): complete the command roster, the catalogs and the document contract" wrote `21 forms` [SOURCE: .skilled/commands/create/README.txt:50] | 2026-09-04 | **v4.0.0.0** |
| f-iter003-002 | drift | `8896d118a4` "docs(sk-doc): wire command list/count/tables across all enumeration surfaces" [SOURCE: .skilled/commands/create/README.txt:83] | 2026-07-07 | **pre-v4.0.0.0** |
| f-iter003-003 | drift | `ce102c2fad` "feat: Phase 018 remediation, doc updates, command consolidation…" (earliest `--output` occurrence) | 2026-03-03 | **pre-v4.0.0.0** |
| f-iter003-004 | drift | `27e91daa10` "feat(create-benchmark): wire conformance_benchmark family (066/001)" | 2026-07-15 | **pre-v4.0.0.0** |
| f-iter003-005 | drift | `7ce3436783` "feat(commands): add create changelog and create prompt commands with dynamic component discovery" | 2026-03-01 | **pre-v4.0.0.0** |
| f-iter003-006 | extension | proposed, not shipped | — | v4.0.2.0 (unchanged) |
| f-iter004-001 | drift | **reference fixed** — see F2 | 2026-10-30 | **v4.0.1.0** (was v4.0.0.0) |
| f-iter004-002 | drift | `f5d668ff02` "feat(specs): MiniMax M2.7 integration + 121 benchmark-mode design/research/build-packet" wrote the first `cli-opencode` mention into the card | 2026-05-28 | **pre-v4.0.0.0** |
| f-iter004-003 | bug | same card, same introduction; the `../..` link depth was wrong from authoring | 2026-05-28 | **pre-v4.0.0.0** |
| f-iter004-004 | improvement | `982b8264b1` "feat(hooks-002): land playbook model standardization + manual-run result automation" added the unconditional marker check | 2026-08-08 | **pre-v4.0.0.0** (one day before beta.1) |
| f-iter006-001 | drift | v4.0.0.13 (unchanged) | 2026-10-23 | v4.0.0.13 |
| f-iter006-002 | extension | v4.0.0.15 (unchanged) | 2026-10-27 | v4.0.0.15 |
| f-iter007-001 | over-engineering | `5dbd8c9480` "feat(sk-create-chart): build the colour system, template contract and validator" added both orphan palette sheets | 2026-09-02 | **v4.0.0.0** |
| f-iter007-002 | over-engineering | `5dbd8c9480`, same commit (`source-globals.css`) | 2026-09-02 | **v4.0.0.0** |
| f-iter007-003 | bug | `59842a2b6b` "feat(sk-doc): kind-aware create-skill completion gate" created `validate_skill_package.py` [SOURCE: .skilled/skills/sk-doc/scripts/validate_skill_package.py:42] | 2026-07-13 | **pre-v4.0.0.0** |
| f-iter007-004 | bug | `59842a2b6b`, same file | 2026-07-13 | **pre-v4.0.0.0** |
| f-iter007-005 | drift | v4.0.1.0 (unchanged) | 2026-11-05 | v4.0.1.0 |
| f-iter007-006 | bug | `validate_document.py` created in `be71882c42` "release(mcp-code-mode): v1.2.0.0: SpecKit Reimagined Release"; the subtree detail not isolated | 2026-02-03 | **pre-v4.0.0.0** |
| f-iter007-007 | improvement | measurement artifact; no code change introduced it | — | pre-v4.0.0.0 |
| f-iter008-001 | bug | v4.0.0.10 (unchanged) | 2026-10-14 | v4.0.0.10 |
| f-iter008-002 | misalignment | **RESOLVED** — `08c9d0605d` "refactor(sk-design): reinstate the parent hub with fundamentals as its first mode" is the only commit that ever changed the `"none"` occurrence in `hub-router.json` [SOURCE: .skilled/skills/sk-design/hub-router.json:16] | 2026-09-06 | **v4.0.0.0** |
| f-iter008-003 | drift | v4.0.0.2 (unchanged) | 2026-09-28 | v4.0.0.2 |
| f-iter008-004 | drift | v4.0.0.2 (unchanged) | 2026-09-28 | v4.0.0.2 |
| f-iter008-005 | ux | v4.0.0.16 (unchanged) | 2026-10-28 | v4.0.0.16 |
| f-iter008-006 | ux | v4.0.1.0 (unchanged) | 2026-11-05 | v4.0.1.0 |
| f-iter008-007 | extension | proposed | — | v4.0.2.0 |
| f-iter009-001 | improvement | v4.0.0.3 (unchanged) | 2026-10-06 | v4.0.0.3 |
| f-iter009-002 | ux | v4.0.0.1 (unchanged) | 2026-09-25 | v4.0.0.1 |
| f-iter009-003 | misalignment | **RESOLVED** — `758dadbe1e` "refactor(sk-doc): move the cite drift Jev code into classifier-cite-drift-scan.mjs" | 2026-10-05 | **v4.0.0.3** |
| f-iter009-004 | ux | v4.0.0.14 (unchanged) | 2026-10-25 | v4.0.0.14 |
| f-iter009-005 | extension | proposed | — | gap across the line |
| f-iter010-001…006 | mixed | v4.0.0.11 / .12 / .6 / .11 (unchanged) | — | unchanged |

Two of the carried-forward open questions close on this table: **f-iter008-002** (the sk-design `none` outcome) shipped in `08c9d0605d` on 2026-09-06 → `v4.0.0.0`, so it is a v4-line authoring choice, not a pre-v4 schema leftover; and **f-iter009-003** (the load-time `cli-classifier` import) shipped in `758dadbe1e` on 2026-10-05, five days before `v4.0.0.3` cut, so it belongs to `v4.0.0.3` and not "present at v4.0.2.0".

---

## FINDINGS

### F1 — `f-iter002-002` is a false positive: no release note ever says `/doctor:sk-code quality` writes on `--apply` (type: drift / registry correction; severity P2; release: none — retraction; confidence: high)

The registry row claims "v4.0.0.16 note says `/doctor:sk-code quality` writes the quality config on `--apply`, but the command contract accepts only `--dry-run`". The second half is true and the first half is not. `grep -n 'apply\|quality' .skilled/changelog/skilled/v4.0.0.16.md` returns six lines and none of them contains the token `--apply`; the nearest sentences are about a repository dropping or replacing rules [SOURCE: .skilled/changelog/skilled/v4.0.0.16.md:20] and about a copy that "could apply to the wrong repository" [SOURCE: .skilled/changelog/skilled/v4.0.0.16.md:32] — the English verb, not a flag.

The contract side is confirmed three ways: the hint offers only `--dry-run` [SOURCE: .skilled/commands/doctor/sk-code.md:3], the flag table has a single `quality` row and it is `--dry-run` [SOURCE: .skilled/commands/doctor/sk-code.md:53], and step 4 rejects a flag outside `allowed_flags` [SOURCE: .skilled/commands/doctor/sk-code.md:59]. `git log --follow -S'--apply' -- .skilled/commands/doctor/sk-code.md` returns **no commits at all**, so `--apply` was never in that file to be removed. The only `--apply` uses under `.skilled/commands/doctor/` are `sk-skill.md:84` (`sk-skill-convert.cjs apply --apply`) and `update.md:100` (`upgrade-legacy --apply`) — different commands entirely.

So there is no note-versus-contract drift. What exists is a real, smaller thing: `/doctor:sk-code quality` is dry-run-only, and an operator who wants the write has no documented flag anywhere. Attributed: the contract shape is as old as the file; the note never promised otherwise.

- Verify: `grep -c -- '--apply' .skilled/changelog/skilled/v4.0.0.16.md` → `0`; `git log --follow -S'--apply' -- .skilled/commands/doctor/sk-code.md` → empty.
- Disposition: the registry should drop f-iter002-002 or restate it as "the quality target has no write flag and no note documents that" with release = pre-v4.0.0.0.

### F2 — `f-iter004-001`'s DEPTH removal is v4.0.1.0, not v4.0.0.0; the drift is in the skill changelog, not the release note (type: drift; severity P2; release: v4.0.1.0; confidence: high)

The registry row says "The v4.0.0.0 release note says sk-prompt ships DEPTH, but the same release's sk-prompt changelog removes DEPTH and SKILL.md contains zero DEPTH mentions." The third clause is true only of the tree as it stands after 2026-10-30. `git log --follow -S'DEPTH' -- .skilled/skills/sk-prompt/SKILL.md` gives four commits, newest first: `0628c398a4` 2026-10-30 "feat(sk-prompt): replace DEPTH with a one-pass improvement checklist", `ce98a7d661` 2026-10-29, `ca10a236d2` 2026-10-29, `04a391c977` 2026-08-28. `git show 0628c398a4 -- .skilled/skills/sk-prompt/SKILL.md` reports 99 deletions and 87 insertions, and 18 of those deleted lines carry `DEPTH`. A removal that lands on 2026-10-30 cannot be in `v4.0.0.0` (2026-09-21) or anywhere in the `v4.0.0.x` line through `v4.0.0.16` (2026-10-28); it is in `v4.0.1.0` (2026-11-05).

That inverts the finding. The v4.0.0.0 release note was **accurate at its own tag**: sk-prompt did ship DEPTH on 2026-09-21. What was wrong is the sk-prompt packet changelog, which documented the removal at `v4.0.0.0` — 76 days and roughly sixteen releases before the code obliged. The defect class is "a skill changelog describing a refactor that had not landed", which is the same class as `f-iter009-004`'s population-reporting gap and is more actionable than the original framing, because it is a claim a reader can check against git and lose.

- Verify: `git show 0628c398a4 -- .skilled/skills/sk-prompt/SKILL.md | grep -c '^-.*DEPTH'` → `18`; `git log --format='%h %cs %s' -1 0628c398a4` → `0628c398a4 2026-10-30 …`.

### F3 — The v4 line inherited these hub defects rather than introducing them: 13 of the 30 code-level findings predate the baseline tag (type: drift; severity P2; release: pre-v4.0.0.0 bulk; confidence: medium-high)

Counting the table above: 13 findings were authored before `v4.0.0.0-beta.1` (f-iter001-001, f-iter002-001, f-iter003-002, f-iter003-003, f-iter003-004, f-iter003-005, f-iter004-002, f-iter004-003, f-iter004-004, f-iter007-003, f-iter007-004, f-iter007-006, f-iter007-007), 6 shipped exactly at `v4.0.0.0` (f-iter001-004, f-iter002-003, f-iter003-001, f-iter007-001, f-iter007-002, f-iter008-002), and 5 shipped later in the line (f-iter009-003 at .3, f-iter004-001 and f-iter007-005 and f-iter008-006 at v4.0.1.0, others unchanged). The v4 notes present these hubs as reworked — v4.0.0.0 is the release that splits sk-code into surfaces, v4.0.1.0 the one that makes skill docs clearer — yet the two defect classes an operator meets first were all authored in the `.opencode` era and carried through untouched.

The mechanism is visible in the probes: the `.skilled` rename `330427cf30` (2026-09-17) rewrote paths without rewriting content, so every stale count, wrong relative link and no-op flag crossed the v4 boundary intact. A release-line audit that reads only `git diff <prev>..<tag> -- .skilled/skills/sk-{doc,code,design,prompt}` will see almost none of them, because a rename makes every line changed and nothing reviewed. That is the reusable lesson for the next audit: path-limited diffs across a rename are blind, `-S` with `--follow` is not.

- Verify: `git log --follow -S'21 forms' -- .skilled/commands/create/README.txt` → `cdc8e7192d 2026-09-04` while `git log --follow -S'--benchmark-id' -- .skilled/commands/create/benchmark.md` → `27e91daa10 2026-07-15`, i.e. both spellings survived the rename `330427cf30 2026-09-17` unchanged.

### F4 — `f-iter001-001`'s manifest claim needs restating: the manifest has no packet-local path spelling to be wrong about (type: bug / registry correction; severity P2; release: pre-v4.0.0.0; confidence: medium on mechanism, high on the probe)

`git log --follow -S'sk-create-quality-control/scripts/validate_skill_package.py' -- .skilled/skills/sk-doc/leaf-manifest.json` returns nothing, and `grep -n 'sk-create-quality-control' leaf-manifest.json` returns only two lines — a `packet` field and a `workflowMode` field [SOURCE: .skilled/skills/sk-doc/leaf-manifest.json:137] [SOURCE: .skilled/skills/sk-doc/leaf-manifest.json:138]. The leaves above them are bare relative paths such as `references/hvr-rules.md`. So the object structure is `{leaves:[…relative…], packet:"…", workflowMode:"…"}`, and the disputed five leaves are *resolved against* the packet by whatever reads the manifest, not spelled as packet-local paths inside it.

That means the finding's phrasing ("lists … as packet-local paths that do not exist") overstates the file's content, while its substance survives: if a consumer concatenates `packet + leaf`, the five quality-control leaves point at `sk-create-quality-control/shared/scripts/…` under a packet that files them under `shared/`, and ROUTER.md spells the same resources with the `shared/` alias. The precise defect is a **resolution-contract mismatch between manifest and router**, and the fix belongs in whichever consumer concatenates them — which this iteration did not find, so the blast radius stays unproven.

- Verify: `grep -n 'sk-create-quality-control' .skilled/skills/sk-doc/leaf-manifest.json` → 2 lines, both metadata fields; `git log --follow -S'sk-create-quality-control/scripts/' -- .skilled/skills/sk-doc/leaf-manifest.json` → empty.

### F5 — The research append gateway rejects an out-of-vocabulary iteration status with a message that names neither the field nor the allowed values (type: bug; severity P2; release: v4.0.0.0 baseline; confidence: high — reproduced this iteration)

This iteration's first gateway call used `"status":"attribution"` and was refused with exactly one line: `{"ok":false,"phase":"runtime","reason":"Payload validator rejected the event","code":"RUNTIME_ERROR"}`, exit 1. No event type, no field, no version. The requirement is a six-value enum defined in the schema source [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts:139] and applied to the `deep_research.iteration_completed` payload [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts:315]: `complete`, `error`, `insight`, `stuck`, `thought`, `timeout`.

The mechanism is a lost diagnostic rather than a missing check. The registry's own validator distinguishes `PAYLOAD_MISSING_FIELD` and `PAYLOAD_UNKNOWN_FIELD` and names the field for both [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/event-envelope/event-type-registry.ts:653] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/event-envelope/event-type-registry.ts:664], but an enum mismatch is thrown by the payload's own `validate` and collapses into the generic `PAYLOAD_VALIDATION_FAILED` [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/event-envelope/event-type-registry.ts:677]. On the legacy path the upcaster passes the row's `status` through unchanged [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts:599] and then wraps any rejection in `phase: 'runtime'` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:512], so the one artifact a leaf agent must produce is the one that fails most opaquely.

This is the same friction the run recorded at iteration 8 as `f-iter008-005` (a caller cannot tell exit 2 from a failed run), one layer up: here exit 1 is indistinguishable from a genuine runtime crash, and the recovery cost was reading three source files to find a word list.

- Repro: build a record with `status:"attribution"` and run `node .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs --mode research --run-directory <run> --event-json <file>` → exit 1, message above.
- Fix shape: carry the enum's allowed values into the refusal text (the rule already holds `values`), or emit `PAYLOAD_VALIDATION_FAILED` with `{field:'status', expected: values}`.

---

## QUESTIONS ANSWERED

None of the twelve strategy key questions was newly ticked — all twelve were already `[x]`. This iteration was the attribution sweep the run's final focus named, and its output is the table above plus F1–F4.

Two carried-forward open items close as a side effect and are recorded here rather than as questions:

- **"Whether `none` in sk-design's outcomes was authored deliberately"** → `08c9d0605d` (2026-09-06, → v4.0.0.0) is the only commit that changed that string. It is a v4-line authoring choice. Whether it was *deliberate* remains unprovable from git; the schema canon in `parent-hub-router-schema.md` still defines three outcomes, so the mismatch stands at `v4.0.0.0` rather than being a leftover from before the line.
- **"f-iter009-003's load-time import — present at v4.0.2.0"** → `758dadbe1e` (2026-10-05) → `v4.0.0.3`.

---

## QUESTIONS REMAINING

- **Q10 (open half)** — which templates, references, assets or scripts in the four hubs have no inbound route. Unchanged from iteration 10; candidate count still two (`palette-sheet-ordered.html`, `palette-sheet-categorical.html`, now attributed to `5dbd8c9480`/`v4.0.0.0`) plus the dead marker exemption.
- **F4's consumer** — which script concatenates `leaf-manifest.json`'s `packet` with its `leaves`. Not found in the budget; until it is, f-iter001-001's blast radius is a hypothesis.
- **Whether any v4-line note claim can be trusted without a code probe** — F2 found one claim (sk-prompt DEPTH) that was true at the tag while the packet changelog was premature, and F1 found a claim (`--apply`) that was never made at all but was recorded in the registry as made. Both suggest the registry's note-versus-code rows should all carry a `git show` of the tag, not a read of the note.
- **F3's audit lesson is stated, not yet tested** — no iteration ran a `-S --follow` sweep of the whole hub tree to quantify how much survived the `.opencode` rename unchanged. The probe count here (13 of 30) is a sample from the registry, not a measured population.

---

## NEXT FOCUS

The run is at iteration 11 of 11. If it is extended, the highest-value next step is the one F3 names: a `-S`-with-`--follow` sweep over the four hub trees keyed on every stored count, relative link and flag token, producing the population F3 only samples. Second is F4's consumer hunt, which is a single `rg` over `.skilled/skills/sk-doc` for readers of `leaf-manifest.json`.

Otherwise the attribution table is the hand-off artifact: it converts fourteen untagged findings into commit-anchored ones, retires one (F1), and re-dates another (F2), leaving the registry with no `v4.0.0.0 baseline` or `present at …` rows except where this iteration recorded why isolation failed.

---

## SCOPE VIOLATIONS

None. Every write landed under `specs/system-speckit/047-v4-release-line-research/002-authoring-hubs/research/`. All git commands were read-only (`log`, `show`, `for-each-ref`, `diff-filter`); no checkout, stage, commit or worktree change was run, and no file in `.skilled/` was modified.

Two working-tree deltas were observed and belong to **no** iteration of this run: `specs/system-speckit/graph-metadata.json` was already modified at 20:49:09, before this iteration's first tool call, and the untracked `specs/001-test-feature/` predates the run as a whole. This iteration's only filesystem effect outside its two artifacts is the append gateway's own ledger and state-log write at 21:21:11, which is the required in-scope write.
