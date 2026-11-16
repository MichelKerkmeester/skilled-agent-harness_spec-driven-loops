---
title: "Feature Specification: Phase 37: review-pass-six-remediation"
description: "Review pass six closed with 0 P0 and 0 P1 and 11 P2 findings. This phase fixes the six that cost little, all docs, comments and one test assertion, and records a reason for the other five."
trigger_phrases:
  - "review pass six remediation"
  - "phase 37 review pass six"
  - "pass six p2 findings"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 37: review-pass-six-remediation

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-16 |
| **Branch** | `worktrees/352-command-surfacing-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 37 of 37 |
| **Predecessor** | 036-start-rate-fixed-rule |
| **Successor** | None |
| **Handoff Criteria** | Each of the 11 pass-six findings has a fix commit or a reason in the goal log |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 37** of the command surfacing build. Review pass six ran three DeepSeek v4.1 flash max lineages of three iterations each over the code changed since pass five (phases 033 to 036) and the 12 files a merge with main resolved. It found 0 P0, 0 P1 and 11 P2.

**Scope Boundary**: comments, two READMEs, one JSDoc block, one config line and one test assertion. No scoring rule, no runner and no stored number changes.

**Dependencies**:
- `../review/lineages/scorer-6`, `arena-config-6` and `merge-docs-6`, whose iteration files hold each finding's case

**Deliverables**:
- Six fixes and five recorded reasons
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Pass six left docs and comments that no longer match the code: the scorer README and a test comment still call a bare `cat` of the document a start, the `scoreRun` return type omits `startShape`, the vitest config comment claims removal on every exit and a move on every platform, the arena buffer test never checks the listing it guards, and the root README says every prompt hook writes a health record while four runtimes write none.

### Purpose
Every doc and comment in the reviewed scope states what the code does, and each finding left open names why.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ jq -r '.openFindings[] | "\(.severity) \(.file):\(.line)"' review/lineages/{scorer-6,arena-config-6,merge-docs-6}/deep-review-findings-registry.json
P2 score-command-transcripts.mjs:752   second heredoc on one opening line
P2 score-command-transcripts.mjs:327   unnamed write counts inside the checkout
P2 routing-accuracy/README.md:135      a cat of the document still called a start
P2 score-command-transcripts.mjs:2035  scoreRun return type omits startShape
P2 vitest.config.ts:16                 temp folder removed on a clean exit only
P2 vitest.config.ts:14                 only TMPDIR is set
P2 vitest.config.ts:14                 stress config has no per-run folder
P2 command-behaviour-guards.vitest.ts:755  buffer test never measures the listing
P2 prepare-behaviour-arena.mjs:150     ENOBUFS reported as spawn_failed
P2 changelog/skilled/v4.0.2.1.md:480   system-spec-kit range one version short
P2 README.md:682                       health record promised on every prompt hook

$ rg -l persistAdvisorHookDiagnosticRecord .opencode/plugins .skilled/skills/system-skill-advisor/hooks/{pi,dsh,vibe}
(no output: the OpenCode plugin and the Pi, DSH and Vibe hooks write no health record)
$ rg -c 'runClaudeHookAdapter|claude/user-prompt-submit' .skilled/hooks/skill-advisor/{codex,devin,cursor}/user-prompt-submit.ts
codex 2, devin 2, cursor 3 (these run the Claude hook, which writes one)
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Drop the `cat` start clause from the scorer README row and the shell-step test comment
- Add `startShape` to `scoreRun`'s `@returns` union
- Set `TEMP` and `TMP` beside `TMPDIR` in `vitest.config.ts`, and say a run killed by a signal leaves its folder
- Assert the arena buffer test's listing is larger than the 1 MiB default
- Name the runtimes whose prompt hook writes a health record in the root README

### Out of Scope
- A second heredoc on one opening line - no stored run line has one, and stripping each pair in order is a parser change for a case no number rests on
- An unnamed write target - the decline and skill-only counts share the same boundary, so treating it apart would move them too, and a write whose path cannot be read is kept on the cautious side for `unsafe`
- The stress config - no stress test writes a health record today, as the reviewer's own scope proof shows
- `ENOBUFS` as its own code - the cap is 512 MiB, about 2.7 million tracked paths, and testing it needs a new buffer setting no real source needs
- The v4.0.2.1 release note range - a published release, which D2 forbids editing. It is already logged as waiting on the operator

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md` | Modify | Drop the `cat` start clause |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs` | Modify | `startShape` in the `@returns` union |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts` | Modify | Shell-step comment |
| `.skilled/skills/system-skill-advisor/runtime/vitest.config.ts` | Modify | `TEMP` and `TMP`, comment on signals |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-behaviour-guards.vitest.ts` | Modify | Listing size assertion |
| `README.md` | Modify | Which prompt hooks write a health record |
| `../goal.md` | Modify | Rows through the goal log command only |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The advisor suite reports 0 failed, and `FLOOR` and `EVAL` print the lines of phase 036's `after.txt` |
| REQ-002 | No stored number moves: the 033 arm summary is byte-identical to 036's `arm-033-after.json` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The six fixes land, and the buffer test fails when its fixture is cut to 3,000 files |
| REQ-004 | The goal log holds one row naming each of the 11 findings as fixed or with its reason |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `rg -c "cat\` of the command's document counts" .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md` prints nothing
- **SC-002**: `cmp` of the rescored 033 summary against 036's exits 0
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Setting `TEMP` and `TMP` changes a child process's temp folder on macOS | Low | Only a Windows process reads them first, and they point at the same per-run folder |
| Risk | The listing assertion makes the test slower | Low | One `git ls-files -z` over the fixture it already built |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: No change to any scorer or builder path

### Security
- **NFR-S01**: No session text or prompt text is read or printed
- **NFR-S02**: `.skilled/hooks/hook-flags.env` is never read or created

### Reliability
- **NFR-R01**: Committed evidence of earlier phases stays unchanged

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: none, the change adds no input handling
- Maximum input: the buffer test's 6,000-path listing is about 1.1 MiB, which the assertion checks
- Failure path: a run killed by a signal leaves its `sav-` folder, which the config comment now says
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 5/25 | Six small edits |
| Risk | 3/25 | Docs, comments and one assertion |
| Research | 2/20 | The review gave each case |
| **Total** | **10/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
