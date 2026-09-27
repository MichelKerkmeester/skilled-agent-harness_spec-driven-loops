---
title: "Implementation Plan: Phase 2: changelog-findability"
description: "Derive each changelog entry's search metadata by a rule per kind, write it into all 1,959 existing entries with a deterministic script, send only topic phrases and residue descriptions to DeepSeek V4.1 Flash lanes, and teach both changelog writers the same contract."
trigger_phrases:
  - "changelog findability plan"
  - "changelog retrofit lanes"
  - "changelog identity phrase rule"
  - "changelog judgment lanes"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: changelog-findability

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ESM for the retrieval libraries and the retrofit script, TypeScript for the nested generator, Python 3 for the sk-doc validator, Markdown and YAML for the writers |
| **Framework** | system-spec-kit runtime CLI, sk-doc shared validator, sk-create-changelog command YAMLs |
| **Storage** | Files only. Scratch trigger indexes live outside the repository |
| **Testing** | vitest in system-spec-kit, pytest for the sk-doc validator, the playbook package validator, scratch index builds with `measure-cold-lookup.mjs` |

### Overview
Each entry's identity phrases come from its path by one rule per kind, and its description comes from its own opening sentence, so most of the metadata is reported rather than written. A deterministic script completes all 1,959 entries after a dry run. DeepSeek V4.1 Flash lanes do the judgment work: topic phrases for skill and release entries without an editorial title, the 15 descriptions the sentence rule cannot report, and the one-change edits to the writers.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [ ] The parent's release message names the unlocked paths
- [ ] The operator decisions in spec.md section 12 are answered

### Definition of Done
- [ ] All acceptance criteria met or waived by an ADR
- [ ] Every baselined suite and validator rerun, with deltas reported
- [ ] Docs updated (spec/plan/tasks)
- [ ] `validate.sh --strict` prints `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One metadata contract, one derivation rule per entry kind and two writers that apply it: the retrofit script once, over the existing entries, and the changelog writers for every entry after.

### Key Components
- **Metadata contract**: five canonical keys in canonical order. Keys that exist keep their values, missing keys go after the nearest preceding canonical key, and new values are double-quoted.
- **Identity rule**: a pure function of the entry's repo-relative path, shared word for word by the retrofit script and the nested generator.
- **Reported description rule**: the first sentence of the entry's first prose paragraph with inline markdown markers stripped, joined by the next sentence when it runs under 60 characters, accepted at 40 to 250 characters with no em dash and no semicolon.
- **Judgment lanes and checker**: read-only DeepSeek batches return JSON lines, and a checker admits a record only when it passes every test below.
- **Enforcement**: sk-create-changelog's step 5 and validation list, and a blocking check in `validate_document.py`.

### Metadata Contract by Kind

| Key | Skill entry | Release entry | Packet-local entry |
|-----|-------------|---------------|--------------------|
| `title` | `<component> v<version>, <editorial H1>`, or `<component> v<version>` | The H1 verbatim, or `Skilled v<version>` | Kept. All 1,372 have one |
| `description` | Reported from the opening sentence, model for the residue | Same | Kept. The 5 missing take the generator's own sentence |
| `trigger_phrases` | `<component> v<version>`, `<component> <version>`, a topic phrase | `v<version> release notes`, `skilled v<version>`, a topic phrase | The owner-qualified slug phrase |
| `importance_tier` | `"normal"` | `"normal"` | `"normal"` |
| `contextType` | `"general"` | `"general"` | `"implementation"`, as the templates already write |

The component name is the `name:` in the owning folder's `SKILL.md`. The one folder with no `SKILL.md`, the deep-loop runtime, maps to `deep-loop-runtime`.

### Packet-Local Identity Rule
1. Take the filename stem, drop `changelog-`, drop up to three leading number groups, then drop a trailing `root`.
2. Take the owner: the parent folder when the entry sits in a nested changelog tree, else the spec folder that holds `changelog/`. Drop its number group.
3. Write the owner's words, then the entry's words. Where the owner's last words repeat the entry's first words, write them once.
4. Past nine words, trim the owner from its end. The entry's own words always survive whole, so a query of the entry's name still matches by containment.
5. End with `changelog` unless the words already end with it.

Measured on 1,372 entries: 0 judge rejections, 107 trimmed, a median of 8 tokens and a maximum of 10. 37 phrases still name 83 entries, every one a renumbered or duplicated entry for the same work.

### Data Flow
The entry path feeds the identity rule. The entry body feeds the description rule and the editorial topic phrase. Entries the rules cannot serve go to a judgment lane, whose output passes the checker before the retrofit merges it. The trigger index generator reads the finished frontmatter, Gate 1 looks phrases up in that index, and the ripgrep lane ranks frontmatter evidence above body evidence.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase is not a bug fix, but the metadata has several producers and consumers, so the table names each one.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| sk-create-changelog global writer | Writes `.skilled/changelog/{component}/v{VERSION}.md` from YAML step 4 and step 6 | Update: generate and check the block | Playbook CHG-011, the mode's own new entry |
| Nested generator and templates | Writes `changelog-<packet>-root.md` and phase entries with three hardcoded phrases | Update: render the identity phrase | vitest cases, a no-write render on this folder |
| Hand-written and older entries | 1,959 entries in three kinds | Update once through the retrofit | Residue rescan, idempotent second run |
| Trigger index generator | Reads `trigger_phrases` from every corpus document | Unchanged, consumer only | Scratch build: published, 0 malformed |
| Ripgrep lane and `/speckit:search` | Ranks trigger phrases, then title or description, then body | Unchanged, consumer only | `rg-wrapper.mjs structured` evidence per kind |
| `validate_document.py` | Classifies any path with `/changelog/` as a changelog | Update: entry frontmatter check | pytest, a sweep over every entry |
| `check-frontmatter-versions.sh` | Reads changelog filenames, never entry frontmatter | Unchanged | Rerun, exit 0 |
| Release step in both YAMLs | Strips any frontmatter block before `gh release create` | Unchanged, verify the longer block still strips | Read the strip rule against a completed entry |

Required inventories:
- Same-class producers: `rg -n "changelog-.*\.md|v\{VERSION\}\.md|nested-changelog" .skilled/commands .skilled/skills/sk-doc/sk-create-changelog .skilled/skills/system-spec-kit/runtime/cli/spec-folder`
- Consumers of entry frontmatter: `rg -n "trigger_phrases|readTriggerPhrases" .skilled/skills/system-spec-kit/runtime/cli/retrieval .skilled/skills/sk-doc/shared/scripts`
- Matrix axes: entry kind (3) by block state (none, partial, complete, valid-empty) by writer (retrofit, global writer, nested writer). Twelve rows are exercised by the trial plus the tests in section 5.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. The steps below name the tool, the write set and the check for each one. Paths are relative to the repository root.

| Step | Work | Tool or lane | Write set | Observable check |
|------|------|--------------|-----------|------------------|
| S0 | Confirm the release and phase 001's commit | Read-only git | None | `git status --porcelain -- <each released path>` prints nothing, and `git log` shows phase 001's commit |
| S1 | Retake every baseline | Me | Scratch only | Exit status and summary line saved for each command in section 5 |
| S2 | Replace the three template defaults with `"{{TRIGGER_PHRASE}}"` in both nested templates | My script, dry run first | `templates/changelog/phase.md`, `root.md` | Diff shows one member for three in each file, and a scratch index build reads both as ok |
| S3 | Derive and render the identity phrase in the generator | DeepSeek edit lane E1, exact rule from section 3 | `nested-changelog.ts` | `npm run typecheck` in `runtime/cli` exits 0 |
| S4 | Add the generator tests | Lane E2 | `nested-changelog.vitest.ts` | The suite passes with 3 old and 3 new cases |
| S5 | Rebuild `dist/` | Me, `npm run build` in `runtime/cli` | Gitignored `dist/` only | A render of this folder without `--write` prints `skilled release changelog findability changelog`, and git status is unchanged |
| S6 | Document the identity phrase | Lane E3, literal text | `references/workflows/nested-changelog.md` | `hvr_scan.py` reports no hard blocker |
| S7 | Write the frontmatter contract into sk-create-changelog | Lanes E4 to E8, one file each, literal text | `SKILL.md`, `changelog-template.md`, `worked-examples.md`, both command YAMLs | Each diff stays inside its named section, both YAMLs load with PyYAML, `hvr_scan.py` is clean |
| S8 | Add CHG-011 and CHG-012 | Lane E9 | `manual-testing-playbook/search-metadata/**`, the playbook index | `validate-playbook-package.cjs --package sk-doc/sk-create-changelog` passes with 12 scenarios in 5 categories |
| S9 | Topic phrases and residue descriptions | Judgment lanes J1 to J17, read-only | Scratch only | Every record passes the checker below, and git status is unchanged after each lane |
| S10 | Retrofit dry run | My script | Scratch plan and diff sample | 0 errors, every file passes the preimage guard, and 20 sampled diffs across the kinds read correctly |
| S11 | Retrofit apply, packet then skill then release entries | My script with `--apply` | The 1,959 entries, minus dirty skips | Every hunk lies inside the leading block, a rescan finds no missing key, and a second run changes nothing |
| S12 | Remove the five template defaults, if the operator approves | My script, `--strip-defaults` | The 468 carriers | Carrier count falls to 0, and bodies are unchanged |
| S13 | Land the validator check | Lane E10 for the check, lane E11 for the tests, my script for `template-rules.json` | `validate_document.py`, `test_changelog_validator.py`, `template-rules.json` | pytest passes, and a sweep of every entry reports no blocking error outside the skip list |
| S14 | Write the mode's own entry | Lane E12 through the mode's own workflow | `sk-create-changelog/changelog/v1.3.0.0.md`, the `version:` line in `SKILL.md` | The new check and `hvr_scan.py` pass, and `check-frontmatter-versions.sh` exits 0 |
| S15 | Verify the whole change | Me | Scratch only | Section 5, then `validate.sh --strict` |

### Lane Rules
- Every brief opens with the child-dispatch preamble from `.skilled/skills/cli-external-orchestration/shared/references/child-dispatch-preamble.md`, names this folder as the pre-approved spec folder and inlines the right persona: `markdown` for prose, `code` for TypeScript and Python.
- Every brief uses the RCAF skeleton, carries one change and names its forbidden tools: no git write, no `generate-context.js`, no `validate.sh` and no sync, repair, route or index script.
- Judgment lanes run `SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 devin -p --model deepseek-v4-1-flash-max --permission-mode auto --prompt-file <brief> </dev/null`. They write nothing and return JSON lines on stdout.
- Edit lanes run on cli-devin with `--permission-mode dangerous` only after the operator approves it. Otherwise they run `pi -p --offline --model opencode-go/deepseek-v4.1-flash --thinking max --tools read,edit,write </dev/null` with `PI_BLACKHOLE_PASSIVE=true`.
- `command -v devin` or `command -v pi` runs before each dispatch, and `devin auth status` runs once. Each lane's PID is captured and only that PID is ever killed.
- Parallel lanes run only with disjoint write sets and only up to the count the operator authorizes. Three failed fixes for one symptom stop the lane and go into the report.

### Judgment Checker
A record is admitted only when it passes all of these:
1. It parses as JSON with the expected path and fields.
2. Each phrase has 2 to 10 tokens and 120 characters at most, and `judgeTriggerPhrase` returns no verdict.
3. Each phrase shares at least one token of three letters or more with the entry body, and none sits on the stoplist of generic changelog phrases such as "bug fixes" or "documentation updates".
4. In a scratch index built with the candidates, no phrase names more than three documents.
5. A description runs 40 to 250 characters in one or two sentences, has no em dash and no semicolon, and `hvr_scan.py` finds no hard blocker in it.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Identity rule in the generator, validator check | `npx vitest run runtime/cli/tests/nested-changelog.vitest.ts`, `python3 -m pytest -p no:cacheprovider .skilled/skills/sk-doc/scripts/tests/test_changelog_validator.py` |
| Regression | Retrieval suites, frontmatter versions, playbook package | `npx vitest run` on the three retrieval suites, `check-frontmatter-versions.sh`, `validate-playbook-package.cjs --package sk-doc/sk-create-changelog` |
| Integration | The finished tree through the index | `generate-trigger-index.mjs` with `--out`, `--manifest`, `--diagnostics` and `--variants` all in scratch, then `measure-cold-lookup.mjs` with `--out` in scratch |
| Findability | Miss before, hit after, one negative control | `lookup-trigger-index.mjs --json --index <scratch index> -- "<phrase>"`, judged by rank, match class and score, because the lookup exits 0 whenever any candidate exists |
| Search lane | Frontmatter evidence per kind | `rg-wrapper.mjs structured "<identity phrase>" --json` |

### Baselines Taken in Stage 1

| Check | Result |
|-------|--------|
| Retrieval suites, 3 files | 71 of 71 passed, exit 0 |
| Nested changelog suite | 3 of 3 passed, exit 0 |
| Changelog validator pytest | 2 passed, exit 0 |
| Playbook package | PASS, 10 scenarios in 4 categories, exit 0 |
| Frontmatter versions | 2,955 files, 2,946 ok, 9 skipped, exit 0 |
| Scratch index | 3,287,506 bytes, 28,534 phrases, 42,239 declarations, 11,717 paths, exit 0 |
| Cold lookup, three runs | p95 61 to 103 ms, max 65 to 103 ms, within budget |

Stage 2 retakes every baseline before its first write, since phase 001's commit changes the tree.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001's commit | Internal | Yellow: its files are still uncommitted | S7, S8, S11 and S14 cannot touch its files |
| The parent's release message | Internal | Red until sent | Stage 2 does not start |
| Operator decisions in spec.md section 12 | Internal | Red until answered | S12 and the edit-lane transport wait |
| DeepSeek V4.1 Flash on cli-devin or cli-pi | External | Green at the last check, cline listing only | Judgment output waits, identity phrases still land |
| PyYAML 6.0.3, vitest, pytest | External | Green | YAML parse and unit checks |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a changed body byte, a malformed block, a failing suite that the change caused, or an index over its latency budget.
- **Procedure**: the parent reverts the phase commit. Before that commit, the retrofit's dry-run plan names every file it touches, so a tracked file is restored from git and nothing untracked is written.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (S0-S1) ──► Writers (S2-S8) ──┐
                                    ├──► Retrofit (S10-S12) ──► Enforce (S13-S14) ──► Verify (S15)
Setup (S0-S1) ──► Judgment (S9) ────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | The release message | Writers, Judgment |
| Writers | Setup | Retrofit |
| Judgment | Setup | Retrofit |
| Retrofit | Writers, Judgment | Enforce |
| Enforce | Retrofit | Verify |
| Verify | Enforce | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 20 to 30 minutes |
| Writers and judgment lanes | High | 2 to 3 hours of lane time, judgment batches three at a time if authorized |
| Retrofit and enforcement | Med | 45 to 60 minutes |
| Verification | Med | 30 to 45 minutes |
| **Total** | | **3.5 to 5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Retrofit dry-run plan saved in scratch, listing every file and every added key
- [ ] Feature flag: none, the change is file content only
- [ ] Monitoring: the scratch index rebuild and the latency probe stand in for alerts

### Rollback Procedure
1. Stop any running lane by its captured PID.
2. Restore touched tracked files with the parent's git revert, or before commit by checking out the files the plan lists. The parent runs the git command.
3. Rebuild a scratch index and rerun the findability probes to confirm the pre-change state.
4. Tell the parent which files were restored.

### Data Reversal
- **Has data migrations?** No. Frontmatter lines are additive, and the dry-run plan records each one.
- **Reversal procedure**: N/A beyond the file restore above.
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────┐     ┌─────────────┐
│ S0-S1 Setup │────►│ S2-S8 Writers    │────►│ S10-S12     │────►│ S13-S15     │
│             │     │                  │     │ Retrofit    │     │ Enforce and │
└──────┬──────┘     └──────────────────┘     └──────▲──────┘     │ Verify      │
       │                                            │            └─────────────┘
       │            ┌──────────────────┐            │
       └───────────►│ S9 Judgment lanes│────────────┘
                    └──────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Identity rule | None | Phrases per path | Generator, retrofit |
| Generator change | Identity rule | Born-findable nested entries | Verify |
| Judgment lanes | Setup | Checked topic phrases and descriptions | Retrofit |
| Retrofit | Writers, judgment | Completed entries | Validator check |
| Validator check | Retrofit | Blocking enforcement | Verify |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **S9 judgment lanes** - 1 to 1.5 hours - CRITICAL
2. **S10 to S11 retrofit dry run and apply** - 30 to 45 minutes - CRITICAL
3. **S13 validator check and S15 verification** - 45 to 60 minutes - CRITICAL

**Total Critical Path**: 2.25 to 3.25 hours

**Parallel Opportunities**:
- S2 to S8 run beside S9, because the judgment lanes write nothing.
- The generator lanes S3 to S5 and the sk-create-changelog lanes S7 have disjoint write sets.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Writers born findable | Nested suite green, CHG-011 and CHG-012 pass, a no-write render shows the identity phrase | After S8 |
| M2 | Every entry findable | Rescan clean, idempotent second run, findability probes hit | After S12 |
| M3 | Enforced and verified | Validator check green, every baseline rerun, `RESULT: PASSED` | After S15 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Derive identity phrases from the path

**Status**: Proposed

**Context**: A reader asks for a changelog by component and version, or by packet and phase, and those names already live in the path.

**Decision**: One rule per kind turns the path into identity phrases, shared by the retrofit and the nested generator.

**Consequences**:
- A lookup by name and version hits first, measured on nine probes.
- Packet phrases grow to a median of 8 tokens. Containment scoring keeps a short query matching them.

**Alternatives Rejected**:
- A component handle such as "sk-doc changelog": the lookup returns at most 20 results in path order, so the oldest entries would win.

The full records, ADR-001 to ADR-005, are in `decision-record.md`.

---

<!-- ANCHOR:ai-execution -->
## L3+: AI EXECUTION FRAMEWORK

### Pre-Task Checklist
- [ ] Read spec.md, this plan and tasks.md before the first edit
- [ ] Confirm the target path is released and `git status --porcelain -- <path>` shows no change from another session
- [ ] Know the step's observable check from section 4 before dispatching or editing

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Execute steps in dependency order. Parallel lanes stay inside disjoint write sets |
| TASK-SCOPE | Touch only the files the step names. Report anything else as an adjacent defect |
| TASK-VERIFY | Run the step's check and read its output and exit status before marking it done |

### Status Reporting Format

`[TASK-ID] [DONE | IN PROGRESS | BLOCKED] - one line of evidence`

### Blocked Task Protocol
1. Mark the task BLOCKED with the blocking fact
2. Record the fact in the tasks.md blocked section
3. Continue with the next unblocked task, and escalate after two blocked tasks or three failed fixes for one symptom
<!-- /ANCHOR:ai-execution -->

---
