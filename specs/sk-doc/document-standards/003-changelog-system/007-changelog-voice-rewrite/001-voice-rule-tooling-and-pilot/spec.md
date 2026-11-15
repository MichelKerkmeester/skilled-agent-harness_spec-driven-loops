---
title: "Feature Specification: Phase 1: voice-rule-tooling-and-pilot"
description: "The voice rule forbids editing a released changelog, and no tooling rewrites a changelog for sentence length alone. This phase amends the rule, adapts the retrofit tooling and pilots it on 20 files."
trigger_phrases:
  - "voice rule tooling and pilot"
  - "phase 1 voice rule tooling and pilot"
  - "released changelog voice carve-out"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 1: voice-rule-tooling-and-pilot

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-15 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 12 |
| **Predecessor** | None |
| **Successor** | 002-skilled-release-line |
| **Handoff Criteria** | The rule amendment is committed, the driver passes its own gates on the 20 pilot files, and the operator approves the pilot rewrites |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Rewrite every skill and release changelog to the Human Voice Rules with shorter sentences specification.

**Scope Boundary**: The voice rule amendment, the rewrite tooling under `../scratch/` and a 20-file pilot. No other changelog changes in this phase.

**Dependencies**:
- The earlier retrofit's tooling in `../../002-skill-changelog-retrofit/scratch/`, which this phase copies and adapts.
- The rewrite worker: DeepSeek Flash at high effort through Mistral Vibe (`cli-mistral-vibe`, alias `deepseek-flash`).
- The fact checker: `gpt-6-luna` at `xhigh` effort on the `fast` service tier through `cli-codex`, a different model family from the worker.

**Deliverables**:
- The amended voice rule in `scope-and-exemptions.md` and `SKILL.md`, with a changelog entry for `sk-create-with-human-voice`.
- One list file per later phase in `../scratch/lists/`.
- The adapted rewrite brief, fact-check brief and driver, with per-dispatch token counts in the run state.
- 20 pilot rewrites, kept or restored, with before and after numbers.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The voice rules forbid editing a released changelog, so a voice pass cannot touch any of the 1,571 files. The earlier retrofit tooling rewrites the format of an entry, not its sentences. Without a rule change and a tool that checks fidelity, a rewrite at this scale would either be refused or drop facts unnoticed.

### Purpose
The later phases can rewrite their files with a tool that is allowed to, and that is proven on 20 real files first.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ python3 specs/sk-doc/document-standards/003-changelog-system/007-changelog-voice-rewrite/scratch/measure-voice.py specs/sk-doc/document-standards/003-changelog-system/007-changelog-voice-rewrite/scratch/scope-list.txt
files=1573 sentences=30215 avg_words=12.8
sentences_over_15=9323 sentences_over_22=3756
files_with_a_sentence_over_22=1140 files_with_hvr_hard_blockers=55

$ xargs python3 .skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py < specs/sk-doc/document-standards/003-changelog-system/007-changelog-voice-rewrite/scratch/scope-list.txt | tail -1
SUMMARY files=1573 pass=157 fail=1416

$ xargs python3 .skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py < specs/sk-doc/document-standards/003-changelog-system/007-changelog-voice-rewrite/scratch/scope-list.txt | grep -o '\[[a-z-]*\]' | sort | uniq -c | sort -rn
3759 [sentence-max]
1266 [sentence-mean]
 874 [spec-line]
 164 [checked-section]
```

A file can fail several rules. 1,322 files fail at least one of the two sentence rules.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Amend the voice rule so an operator-approved retrofit recorded in a spec packet may edit a released changelog.
- Split `../scratch/scope-list.txt` into one list per later phase.
- Adapt the earlier retrofit's briefs and driver to a sentence and voice rewrite that keeps every fact.
- Record input and output tokens per dispatch, so later phases measure real spend.
- Pilot the tooling on 20 files from every phase group, including the three largest entries.

### Out of Scope
- Rewriting any file outside the 20 pilot files - the later phases own them.
- Shape rules other than the two sentence rules - fixing them adds facts to old entries.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-with-human-voice/references/scope-and-exemptions.md` | Modify | Carve-out in the released changelog row |
| `.skilled/skills/sk-doc/sk-create-with-human-voice/SKILL.md` | Modify | Same carve-out in NEVER rule 2, and the version bump |
| `.skilled/skills/sk-doc/sk-create-with-human-voice/changelog/v<next>.md` | Create | Entry for the amendment |
| `../scratch/lists/*.txt` | Create | One list per later phase |
| `../scratch/brief-rewrite.md`, `../scratch/brief-verify.md` | Create | Adapted from the earlier retrofit |
| `../scratch/rewrite-driver.cjs` | Create | Adapted driver with token counts |
| 20 pilot changelogs | Modify | Rewritten, or restored when they fail |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `scope-and-exemptions.md` section 3 and `SKILL.md` NEVER rule 2 allow editing a released changelog only when a spec packet records the operator's approval of the retrofit. Every other case stays forbidden. |
| REQ-002 | The rewrite brief puts fact rules first. A rewrite keeps every fact, number, identifier, path, command and quotation of the original and adds none. It may add sentences. |
| REQ-003 | The driver keeps a rewrite only when the shared shape check reports no `sentence-max` or `sentence-mean` finding, reports no shape failure the original did not have, the voice scan exits 0 or the file has a recorded exception, and a second model's fact check finds nothing dropped, added or changed. Otherwise it retries up to three attempts in all, then restores the original. |
| REQ-004 | The pilot rewrites 20 files from all 12 phase groups, including `.skilled/changelog/skilled/v4.0.0.0.md`, and reports before and after numbers from `measure-voice.py`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | Each of the 55 files with a hard blocker is listed with its class: a real banned word to fix, or a self-reference to record as an exception. |
| REQ-006 | The run state records input and output tokens for every dispatch. The pilot report compares them with the parent's estimate. |
| REQ-007 | `../scratch/lists/` holds one list per phase 002 to 012, and their line counts sum to 1,571. The plan said 1,573, and the two dropped files are templates, not release entries. |
| REQ-008 | Each rewrite dispatch runs `deepseek-flash` through Vibe with `thinking = "high"` set only in its throwaway `VIBE_HOME`. The driver rejects a dispatch whose `export.json` does not show `exit_code` 0, `outcome` `finished` and `thinking` `high`. |
| REQ-009 | Each fact check runs `codex exec --model gpt-6-luna -c model_reasoning_effort="xhigh" -c service_tier="fast"` in a read-only sandbox. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `measure-voice.py` on the kept pilot files prints `avg_words` of 10 or less and `sentences_over_22=0`.
- **SC-002**: The fact check reports no dropped or added fact on any kept pilot file, and the operator approves the pilot rewrites.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Vibe quota for about 3,300 rewrite attempts and Codex quota for as many fact checks | Later phases stall | The pilot measures real tokens per file before any wave starts. When Codex quota runs out, the run stops and asks, and never moves the fact check to another provider |
| Risk | The worker's `high` effort is off the Vibe roster, which pins `max` | Med | The operator approved `high` for this packet only. Each dispatch sets it in its throwaway `VIBE_HOME` copy of `config.toml`, the repository's `.vibe/config.toml` stays at `max`, and each `export.json` must show `thinking = high` |
| Risk | Shorter sentences drop a qualifier, so a fact changes | High | A second model checks facts, and a failed file is restored, never kept |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: A pilot file finishes all gates within 15 minutes, the earlier retrofit's slowest kept file.
- **NFR-P02**: N/A: throughput is set by the executor lanes, which the driver caps.

### Security
- **NFR-S01**: The rewrite executor has write access to the one target file only. The fact-check executor has no write access.
- **NFR-S02**: N/A: no credential or personal data is read.

### Reliability
- **NFR-R01**: A failed or interrupted run leaves every file either rewritten and gated, or byte-identical to HEAD.
- **NFR-R02**: `wave-verify.cjs` confirms each kept file and each restore against HEAD before a commit.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a file whose prose already passes both sentence rules is scanned and left unchanged.
- Maximum input: `.skilled/changelog/skilled/v4.0.0.0.md`, the largest entry at 57 KB, runs in the pilot.
- Failure path: a file that fails every attempt is restored to HEAD and listed in the run state with its last finding.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Two rule files, three tooling files and 20 pilot files |
| Risk | 15/25 | A rewrite can change a fact, so every kept file needs a second check |
| Research | 8/20 | The earlier retrofit settled the method, and the pilot measures the cost |
| **Total** | **35/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Which model runs the rewrite and which runs the fact check? Decision: the operator chose DeepSeek Flash at high effort through Mistral Vibe as the worker and `gpt-6-luna` at `xhigh` on the `fast` tier through cli-codex as the fact checker. The operator offered `xhigh` or `max`. `xhigh` is the earlier retrofit's measured setting, and `max` stays available for a file whose check is disputed. A smoke dispatch on 2026-11-15 ended with `exit_code` 0, `outcome` `finished` and `thinking` `high` in `export.json`.
- None of the others blocks this phase.
<!-- /ANCHOR:questions -->

---
