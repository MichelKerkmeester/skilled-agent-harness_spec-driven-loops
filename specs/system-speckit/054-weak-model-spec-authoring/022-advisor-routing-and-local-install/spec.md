---
title: "Feature Specification: Phase 22: advisor-routing-and-local-install"
description: "Four items stayed open after phase 21: the doctor-a-08 routing test fails, the live advisor sends a typed /deep:research :auto prompt to system-spec-kit, prompts naming the draft auto-repair route nowhere, and a private local-* command lives only in the worktree that built it. This phase fixes all four at the source."
trigger_phrases:
  - "advisor routing and local install"
  - "phase 22 advisor routing and local install"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 22: advisor-routing-and-local-install

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-27 |
| **Branch** | `worktrees/217-weak-model-spec-authoring` |
| **Parent Spec** | ../spec.md |
| **Phase** | 22 of 22 |
| **Predecessor** | 021-ci-gate-regressions |
| **Successor** | None |
| **Handoff Criteria** | The advisor suite has 0 failed files, the five routing probes below rank as expected in the live and local regimes, the sk-git suite has 0 failed, and `validate.sh` on this folder prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 22** of packet 054. Phase 21's closeout left four items for the operator, who asked on 2026-10-27 to fix all four.

**Scope Boundary**: the advisor scorer and its tests, the doctor route manifest and the bridge outputs its deriver writes, the system-spec-kit advisor phrases and the compiled skill graph, sk-git's worktree provisioning with its test, docs and release note, and this phase's own docs. The private command's own files stay git-ignored and never appear in a tracked file.

**Dependencies**:
- Phase 21 replaced the system-spec-kit phrase `draft auto-repair` with `spec docs`, because the lexical lane read `:auto` as the word "auto".
- Packet `sk-doc/069-local-command-support` added the ignore rules for private `local-*` commands, which the provision step reads.

**Deliverables**:
- The doctor `lead_phrases` entry and regenerated bridges (item 1)
- The graph-support bound for typed slash commands (item 2) and the mode-suffix strip in both scorers with `draft auto-repair` restored (item 3), with their tests
- The provision step that links private commands into a worktree, its test, and sk-git `1.9.7.0` (item 4)

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
The advisor misroutes three kinds of prompt: "disable comment hygiene gate" goes to sk-code instead of `/doctor:git hooks`, a typed `/deep:research :auto` prompt goes to system-spec-kit in the live advisor, and a prompt naming only the draft auto-repair goes nowhere (Measured Behavior below). A private `local-*` command is git-ignored, so it existed only in the worktree that built it and a new worktree started without it.

### Purpose
Each prompt routes to the skill or command it names, for a reason the scorer can state, and a private command is available in every worktree from one copy in the primary checkout.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
Live advisor, before (skill, confidence, score):
$ node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"disable comment hygiene gate"}' --format json
sk-code 0.8521 0.617808
command-doctor-git-hooks 0.8962 0.7

Live scorer with lane evidence, before:
-- Run `/deep:research :auto --max-iterations=8` on the routing packet. => top system-spec-kit
   system-spec-kit 0.5744   graph_causal 0.694 ["edge:system-deep-loop->system-spec-kit:depends_on","edge:system-deep-loop->system-spec-kit:enhances", ...]
   system-deep-loop 0.5664  explicit_author 1.000 ["phrase:/deep:research","research-loop"]

Local scorer, before:
-- the draft auto-repair rewrote my files => top null

Advisor suite, before (from system-skill-advisor/runtime):
$ npx vitest run
 Test Files  1 failed | 148 passed (149)
      Tests  1 failed | 1237 passed | 8 skipped (1246)

Private command, before:
worktree 217: one private router under .skilled/commands/, its assets folder and five runtime mirrors present
primary checkout: no local-* entry under .skilled/commands, .claude/commands, .cursor/commands, .codex/prompts, .pi/prompts or .hermes/prompts
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Add `lead_phrases: ["disable comment hygiene gate"]` to the `/doctor:git hooks` route and regenerate the bridges, so the doctor command leads a passing skill on its own phrase.
- Bound graph support in fusion: support a seed lends to a neighbour may lift it up to the seed but never past it, when a typed slash command named the seed.
- Strip the command mode suffixes `:auto`, `:confirm`, `:autopilot` and `:unattended` from prompt tokens after a slash command, in the TypeScript lanes and the Python twin, and restore `draft auto-repair` in system-spec-kit's phrases.
- Link each private `local-*` command from the primary checkout into a worktree during `worktree-naming.sh provision`, and seed the primary checkout with the command built in worktree 217.

### Out of Scope
- Linking private `local-*` skills - it would change which skills the advisor and graph compilers see inside a worktree, and so what its tests report.
- The RRF fusion path, which is feature-flagged off - it ranks by lane position, so a lent-support amount has no meaning there.
- Parallel edges from one seed to one target adding up in the graph lane, and the `--unattended` flag form - neither misroutes a known prompt today.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/_routes.yaml` | Modify | `lead_phrases` on the hooks route (item 1); main landed the identical line in `bfe11fa5a1`, so the rebased commit carries no route change |
| `system-skill-advisor/runtime/lib/scorer/projection.ts`, `scripts/command-bridges/command-bridges.generated.json`, `scripts/skill_advisor.py` | Modify | Deriver output for item 1; mode-suffix strip in the Python twin for item 3 |
| `system-skill-advisor/runtime/lib/scorer/fusion.ts`, `lanes/graph-causal.ts` | Modify | Per-seed graph support and the slash-command bound (item 2) |
| `system-skill-advisor/runtime/lib/scorer/text.ts`, `lanes/{lexical,derived,explicit,semantic-shadow,bm25}.ts` | Modify | `tokenizePrompt` strips mode suffixes (item 3) |
| `system-skill-advisor/runtime/tests/scorer/typed-command-routing.vitest.ts`, `tests/python/test_skill_advisor.py` | Create, Modify | One failing-before test per gap plus controls |
| `system-spec-kit/graph-metadata.json`, `system-skill-advisor/runtime/scripts/skill-graph.json` | Modify | `draft auto-repair` restored, recompiled graph |
| `sk-git/scripts/worktree-naming.sh`, `scripts/tests/worktree-naming.test.sh` | Modify | `_wn_link_local_commands` and its test (item 4) |
| `sk-git/SKILL.md`, `.hermes/skills/sk-git/SKILL.md`, `sk-git/changelog/v1.9.7.0.md` | Modify, Create | ALWAYS rule 8 names the link step; version `1.9.7.0` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `npx vitest run` from `system-skill-advisor/runtime` reports 0 failed files, with `doctor-routing-slice.vitest.ts` and `typed-command-routing.vitest.ts` passing |
| REQ-002 | In the live CLI and the local regime, "disable comment hygiene gate" ranks `command-doctor-git-hooks` first, the rr-iter3-168 prompt ranks `system-deep-loop` first, and "the draft auto-repair rewrote my files" ranks `system-spec-kit` first |
| REQ-003 | `bash .skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh` prints `FAIL=0`, and its new local-command checks fail against the previous script |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | `python3 tests/python/test_skill_advisor.py` prints `fail=0`, `skill-graph-freshness.cjs --strict` exits 0, and `derive-command-bridges.cjs --check` prints `"changed": []` |
| REQ-005 | No tracked file names the private command: a search for its name over `git diff HEAD` and this phase's new files prints nothing, and the pre-commit private-path gate passes |
| REQ-006 | `validate.sh` on this folder with `--strict` prints `RESULT: PASSED` |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: The advisor suite goes from 1 failed file to 0, and no pinned routing fixture or divergence-ledger row changes.
- **SC-002**: The live advisor ranks system-deep-loop first for the rr-iter3-168 prompt, where it ranked system-spec-kit first by 0.008.
- **SC-003**: A worktree provisioned after this change holds a link to each private command in the primary checkout, and `git status` in it lists none of them.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The ignore rules from packet sk-doc/069 name where private commands live | A new mirror without a rule would not be linked | The step reads the rules, so adding the rule is the whole change |
| Risk | The graph bound reorders prompts beyond rr-iter3-168 | High | It applies only to seeds a typed slash command named, and the pinned routing fixtures and the divergence ledger stay unchanged |
| Risk | The rr-iter3-168 live margin is very thin after the bound | Low | The order is set by score and pinned by `typed-command-routing.vitest.ts`; recorded as a known limit |
| Risk | A linked command edited in one worktree changes it everywhere | Low | Intended: one copy; the release note says so |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->
<!-- /ANCHOR:nfr -->

- **NFR-R01**: The link step never fails provisioning: a checkout with no private command, a primary checkout and a bare clone all exit 0.
- **NFR-R02**: No added line in the tracked diff holds an em dash.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Empty input: a primary checkout with no `local-*` command links nothing and provisioning prints no link line.
- Maximum input: a command with a router, an assets folder and five mirrors links all seven entries, creating the untracked `.skilled/commands/assets/` folder when the worktree lacks it.
- Failure path: a worktree path that already exists, file or link, is left untouched and the step still exits 0.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 19 tracked files, about 300 changed lines, two skills and the doctor manifest |
| Risk | 12/25 | The shared scorer changes; guarded by pinned fixtures and failing-before tests |
| Research | 8/20 | Each cause traced to a file and line with lane evidence |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Should private `local-*` skills be linked into worktrees too? Open for the operator; it changes what advisor and graph tests see in a worktree.
<!-- /ANCHOR:questions -->

---
