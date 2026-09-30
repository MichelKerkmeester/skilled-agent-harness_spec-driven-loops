---
title: "Implementation Plan: Phase 40: hard-rules-sidecar"
description: "The nine skills that declare `hard_rules:` in SKILL.md frontmatter move those rules, unchanged, into a `hard-rules.json` sidecar beside each SKILL.md, and every reader and test moves with them in one change. The engine stays dependency-free and fail-open, the move is proved by a recorded before-and-after run of the engine over a fixed command set per skill, and the sk-doc frontmatter contract learns where hard rules live. DeepSeek writes, MiMo reviews."
trigger_phrases:
  - "hard rules sidecar plan"
  - "skill frontmatter migration plan"
  - "dispatch rule reader design"
  - "hard rules verdict comparison"
  - "hard rules sidecar testing strategy"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 40: hard-rules-sidecar

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ESM for the engine and the adapters (`.mjs`), plus the pi and sk-git TypeScript twins (`.ts`) and the OpenCode plugin copies (`.js`, `.cjs`) |
| **Framework** | None. The engine is dependency-free and fail-open, and the sidecar is plain JSON read with `JSON.parse` |
| **Storage** | Nine `hard-rules.json` files beside their SKILL.md files, plus one recording pair per skill under `scratch/verify/` |
| **Testing** | `node --test` on the five suites of `spec.md` section 3, the sk-git hook fixtures, and the recorded before-and-after verdict comparison |

### Overview

Each of the nine skills that declares `hard_rules:` in frontmatter gets `hard-rules.json` beside its SKILL.md (proposed name), holding that skill's rules copied exactly. The engine reads the sidecar through `readHardRules`, keeps its fail-open contract and drops the frontmatter parse in the same change. The 10 readers and five test files of `spec.md` section 3 move with it, so no dual read of frontmatter is left behind (D3). A fixed command set per skill runs through `evaluate` before the move and after it, and the two verdict sets must match row for row (D4). The sk-doc frontmatter contract and skill template then say where hard rules live (D5), and the Hermes sync check is left green.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The operator's ask and choice are recorded: 2026-09-30, "you have hard rules in skill frontmatter? Thats not supported or something we should do", then "Move rules out of frontmatter", with the words in `scratch/context/context.md`
- [ ] `scratch/context/context.md` is present and read, with the nine skill paths, the engine lines, the reader list and the proposed frame
- [ ] Phase 039 is Complete, and the post-rename path of the Jev skill folder (`cli-classifier/cli-usage` or `cli-classifier/cli-jev`) is read from the tree rather than assumed
- [ ] `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs` is present with `parseHardRules` at `:29`, `readHardRules` at `:61`, `CHECKS` at `:164` and `evaluate` at `:318`
- [ ] The nine SKILL.md files still declare `hard_rules:`, and the per-skill rule counts of REQ-001 are re-counted in this tree before the move
- [ ] The five test files of `spec.md` section 3 run green from the repo root, and each result is captured as the baseline
- [ ] The executors are available under D6: DeepSeek V4.1 Flash to write, MiMo v2.6 Pro to review

### Definition of Done
- [ ] The five completion criteria in `goal.md` pass from the final state
- [ ] Every row of `acceptance-criteria.md` is `Met` with its observed command output, or left open with the reason
- [ ] MiMo reviewed every DeepSeek diff and DeepSeek reviewed any MiMo fix, with no open P0 or P1 finding (parent D5 through D6)
- [ ] The rule-for-rule comparison over the nine skills is empty, and the before-and-after verdict sets match for every skill
- [ ] `grep -rn '^hard_rules:' --include=SKILL.md .skilled/skills` prints nothing, and no production reader parses frontmatter
- [ ] Every suite passes at or above its recorded baseline, and the three registered hooks still resolve their adapters
- [ ] `validate.sh --strict` on this phase prints `RESULT: PASSED`, `check-goal.cjs` prints `RESULT: PASSED (5/5 checks)`, and `goal.cjs packet` prints `packet_durable_chars` at or under 4000
- [ ] Only the files in `spec.md` section 3 changed, and no code comment carries a spec path, phase number or requirement id
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

One loader behind an unchanged function name, one JSON file per skill beside the document it describes, and the existing `evaluate` unchanged on top. Every reader keeps its current call shape and reaches the sidecar through the engine (proposed), so the change is contained to the engine, the nine files and the tests that assert on rule text.

### Key Components

- **Sidecar loader**: `readHardRules(skillMdPath)` reads `hard-rules.json` beside the SKILL.md path it is given, parses it with `JSON.parse` and returns the rule array. Any read or parse error returns an empty list (D2).
- **Sidecar files**: nine `hard-rules.json` files, each the exact rule objects of one skill in their declared order, with `id`, `check`, `message` and `severity`.
- **Frontmatter removal**: the `hard_rules` key leaves each of the nine SKILL.md frontmatter blocks, and the engine's frontmatter parser is deleted so no dual read remains (D3).
- **Readers**: the four preflight adapters, the two OpenCode plugin copies, the three sk-git files, the pi twin and the devin permission policy, each reaching the sidecar through the engine.
- **Verdict corpus**: the fixed command set per skill, one recording pair under `scratch/verify/before/` and `scratch/verify/after/`, compared row for row (D4).
- **Suite baselines**: the five suites of `spec.md` section 3 captured before the move and rerun from the final state.
- **sk-doc surfaces**: the frontmatter contract and the skill template name the sidecar, so a new skill does not put the rules back in frontmatter (D5).
- **Tests**: the fail-open parse cases become sidecar-parse cases, the four skills asserted by id keep their assertions, and the sk-git hook fixture copies the sidecar beside the SKILL.md it already copies.

### Data Flow

A dispatch command reaches a hook. The hook resolves the skill from `DISPATCH_SHAPES` in `.skilled/hooks/dispatch/lib/dispatch-audit.mjs` and passes `<skill>/SKILL.md` to `readHardRules`. The loader opens `hard-rules.json` beside that path, parses it and returns the rules. `evaluate` runs them against the command and returns the verdicts the adapter prints, blocks or warns on. A missing, empty or malformed sidecar returns no rules and no throw, exactly as a SKILL.md without the frontmatter key behaves today.

### Affected Surfaces

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs` | Owns `parseHardRules`, `readHardRules`, `CHECKS` and `evaluate` | Update: read the sidecar, keep fail-open, delete the frontmatter parse | `node --test` on its suite, and the verdict comparison |
| The nine SKILL.md files | Each declares its rules in frontmatter | Update: remove the `hard_rules` key, keep every other byte | The grep gate and the rule-for-rule comparison |
| The nine skill folders | Hold SKILL.md and their references | Create one `hard-rules.json` each | The rule-for-rule comparison per skill |
| The 10 readers of `spec.md` section 3 | Each passes a SKILL.md path to the engine | Update through the engine, every row reconciled | `rg -n 'readHardRules'` reviewed row by row |
| The five test files of `spec.md` section 3 | Assert on rule ids and on frontmatter text | Update to the sidecar | `node --test` on each, against its baseline |
| `.claude/settings.json`, `.codex/hooks.json`, `.devin/hooks.v1.json` | Register the preflight adapters | Unchanged | The adapters still resolve and their suites pass |
| `sync-skills-hermes.cjs` and `.hermes/skills/` | Copies SKILL.md files only, matching `entry.name === 'SKILL.md'` at `:61` | Read only, unless the design proves a Hermes copy needs the sidecar | `--check` passes, and the design's finding is recorded |
| sk-doc's frontmatter contract and skill template | Name no home for hard rules | Update through sk-doc | `validate_document.py` VALID on each changed doc |
| `.skilled/skills/sk-design/sk-design-md-generator/backend/scripts/schema-v3.ts` | Holds an unrelated `hardRules` field | Not a consumer | `git diff --stat` on sk-design is empty |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is a migration of where a declaration lives, not a bug fix, so the addendum records the producer and consumer inventories around the moved surface.

- Same-class producers: `grep -rln '^hard_rules:' --include=SKILL.md .skilled/skills` names nine files on 2026-09-30, holding 50 rules in total. Every one moves, and no other SKILL.md in the tree declares the key.
- Consumers of the changed reader: `rg -n 'readHardRules|parseHardRules' --glob '*.mjs' --glob '*.ts' --glob '*.cjs' --glob '*.js' .` names the engine, its two suites in the dispatch lib, the four preflight adapters, the two OpenCode plugin copies, the three sk-git files, the sk-git rule and advisory suites, the devin permission policy and the OpenCode consumer test. `spec.md` section 3 lists each with its line.
- Consumers of the default: every dispatch on claude, codex, devin and pi, and every sk-git command the advisory runs on. They observe the same verdicts before and after, which REQ-004 proves.
- Matrix axes: the skill axis (nine skills), the field axis (four fields, each compared exactly), the failure axis (present, missing, empty, malformed, object rather than array), the reader axis (each row of `spec.md` section 3), the runtime axis (claude, codex, devin, pi, opencode, cursor) and the verdict axis (block, warn and no verdict).
- Algorithm invariant: for each skill, the rule list `readHardRules` returns from the final state equals the rule list the frontmatter parse returned from the pre-change state, in the same order, field for field. Adversarial cases: a malformed sidecar, a missing sidecar, a rule naming a `check` id `CHECKS` does not implement, a SKILL.md path resolved through the `.skilled/plugins` symlink, and a command that triggers no rule.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the task checkboxes and state. The eight phases below are the plan of record.

**Who builds (parent D5 through this phase's D6).** DeepSeek V4.1 Flash writes the design note, the engine, the sidecars, the reader changes and the docs, each dispatched through the external orchestration route. MiMo v2.6 Pro reviews every DeepSeek diff, and DeepSeek reviews any MiMo fix. No Claude worker writes or reviews. The session runs the baselines, the verdict comparison and the closure gates, and commits path-scoped. P0 and P1 findings are fixed and rechecked, P2 findings are recorded.

Phases 3 and 4 land inside one change: the engine reads the sidecar only after the nine sidecars exist, so no skill is read through frontmatter once the parse is deleted. The ordering below is the execution order inside that change.

Each phase's observable check:

1. **Design.** Read the engine, the four preflight adapters, the audit registry, both sk-git scripts and the pi twin, the OpenCode plugin copies and its consumer test, the devin permission policy, and the Hermes sync, then write the design note under `scratch/`. Check: the note fixes the sidecar name and shape, the `readHardRules` signature, the fixed command set per skill and the recording paths, answers `spec.md` section 10 with a proposed answer per question, names every `UNKNOWN`, and the read-only sources are never edited.
2. **Record the before verdicts.** Run the fixed command set through `evaluate` from the pre-change state, with the rules read from frontmatter, and save one recording per skill under `scratch/verify/before/`. Check: every skill has a recording, the row count per skill matches the corpus's row count, and a command that triggers no rule records an empty verdict set rather than no file.
3. **Engine and readers.** In `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs`, make `readHardRules` read the sidecar, keep the empty-list return on any error, and delete the frontmatter parse. Move each reader and test of `spec.md` section 3 in the same change. Check: `rg -n 'parseHardRules'` finds no reader of SKILL.md text, the five suites run, and the design's reader inventory is reconciled row by row.
4. **Move the nine rule sets.** Create the nine `hard-rules.json` files with the rules copied exactly and in order, and remove the `hard_rules` key from each SKILL.md's frontmatter, keeping every other byte. Check: the rule-for-rule comparison prints `equal` for all nine skills, the counts read 17, 8, 8, 5, 4, 2, 2, 2 and 2, and `grep -rn '^hard_rules:' --include=SKILL.md .skilled/skills` prints nothing.
5. **Docs through sk-doc.** The frontmatter contract and the skill template say where hard rules live and that `hard_rules` is not a SKILL.md frontmatter key. Check: `python3 .skilled/skills/sk-doc/scripts/validate_document.py` exits 0 on each changed doc, no doc claims a result no run printed, and the template points at the sidecar rather than describing a frontmatter key.
6. **After verdicts and suites.** Run the same fixed command set through `evaluate` from the final state and save one recording per skill under `scratch/verify/after/`, then rerun the five suites and the Hermes check. Check: the before and after recordings compare equal per skill, each suite is at or above its baseline, `sync-skills-hermes.cjs --check` passes, and the three registered hooks still resolve.
7. **Cross-family review.** MiMo reviews every DeepSeek diff read-only, and DeepSeek reviews any MiMo fix. Check: one review file with a verdict, every P0 and P1 finding named with file and line, no open P0 or P1, each review's file hashes equal before and after the read, and P2 findings recorded.
8. **Closure.** Record every gate result, the rule counts and the verdict comparison in `implementation-summary.md` and `goal.md`'s log, mark each acceptance criterion from its evidence, then run `repair-derived.cjs --apply`, `validate.sh --strict`, `check-goal.cjs` and `goal.cjs packet`. Check: `RESULT: PASSED`, `RESULT: PASSED (5/5 checks)` and `packet_durable_chars` at or under 4000.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Commands run from the repository root. `E` is `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs`, `V` the recordings under `scratch/verify/` and `B` the fixed command set per skill.

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Rule comparison | The nine skills, field for field | A scratch comparison against the pre-change frontmatter parse |
| Unit | The sidecar parse and the fail-open cases: missing, empty, malformed, object rather than array | `node --test`, `.skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` |
| Suite | The four adapters, the two plugin copies, the three sk-git files, the devin policy and their tests | `node --test` on each test file of `spec.md` section 3 |
| Verdict invariance | `B` through `evaluate`, before and after, compared row for row | A scratch runner importing `E`, recordings under `V` |
| Doc gates | The sk-doc frontmatter contract and skill template | `validate_document.py` |
| Sync gate | The Hermes copies | `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check` |
| Manual | A dispatch command on each registered runtime, with the rule read from the sidecar | The runtimes' own hooks, per the closure record |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 039, which renames the Jev skill folder first | Internal | Draft scaffold in this tree | The cli-usage sidecar path is written against a folder that moves, and the registry row may name the old path |
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs` | Internal | Present, 347 lines, `readHardRules` at `:61` | Nothing can read the rules |
| The nine SKILL.md files that declare `hard_rules:` | Internal | Present, 50 rules | The sidecar carries nothing to move |
| The five test files of `spec.md` section 3 | Internal | Present, runnable from the repo root | The baselines and the after runs lose their comparison |
| `sync-skills-hermes.cjs` | Internal | Present, `--check` at `:47` | The Hermes gate cannot run, and the sidecar question stays open |
| DeepSeek V4.1 Flash and MiMo v2.6 Pro | External, dispatched | Under D6 | A phase waits or reports the blocker |
| The design's sidecar name and shape | Internal | Not yet produced | The build cannot start writing files |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The before-and-after verdicts differ for any skill, a rule's text differs from the original, a reader still parses frontmatter after the change, a malformed sidecar throws or blocks a dispatch, or a file outside `spec.md` section 3 changes.
- **Procedure**: Stop the phase. Revert its path-scoped commits: the engine, the nine sidecar files, the nine SKILL.md edits, the reader and test changes, and the sk-doc edits. Restore the frontmatter blocks from the pre-move commit, since the rules live there, then rerun the five suites and the verdict comparison. Delete the recordings under `scratch/verify/` that a later run must not reuse. No runtime file outside the engine and the sk-git tree changed, so no registry or activation manifest needs a remint.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
1 (Design) ─► 2 (Before verdicts) ─► 3 (Engine and readers) ─┐
                                                             ├─► 6 (After verdicts and suites) ─► 7 (Review) ─► 8 (Closure)
4 (Move the nine rule sets, same change as 3) ───────────────┘
                                                             └─► 5 (Docs through sk-doc) ──┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 1. Design | `scratch/context/context.md`, the engine, the readers and the Hermes sync | Phase 2 |
| 2. Before verdicts | Phase 1, and the suites' baselines | Phase 3 |
| 3. Engine and readers | Phase 2 | Phases 4, 6 |
| 4. Move the nine rule sets | Phase 3, same change | Phase 6 |
| 5. Docs | Phases 3 and 4, so the docs describe what the code does | Phase 6 |
| 6. After verdicts and suites | Phases 3, 4 and 5 | Phase 7 |
| 7. Review | Phase 6 | Phase 8 |
| 8. Closure | Phase 7 | Nothing |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| 1. Design | Med | One read-and-record pass over the engine, 10 readers, five tests and the Hermes sync |
| 2. Before verdicts | Low | One scratch runner and nine recordings |
| 3. Engine and readers | Med | One loader change plus the reader and test reconciliation |
| 4. Move the nine rule sets | Med | Nine sidecars and nine frontmatter edits, each copied exactly |
| 5. Docs | Low | Two sk-doc surfaces |
| 6. After verdicts and suites | Med | Nine recordings, five suites and the Hermes check |
| 7. Review | Med | One review round plus one fix round |
| 8. Closure | Low | The gates and the phase record |
| **Total** | | The eight phases above |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline recorded: the five suites' results, the per-skill rule counts and the before verdicts under `scratch/verify/before/`
- [ ] The rule-for-rule comparison runs green before any SKILL.md edits
- [ ] The fail-open cases exist in their new form before the frontmatter parse is deleted
- [ ] The design note names the sidecar path per skill, including the post-039 Jev path

### Rollback Procedure
1. Stop the phase at its failing check.
2. Revert the phase's path-scoped commits, paths only.
3. Restore the nine frontmatter blocks, rerun the five suites and the verdict comparison.
4. Record the revert and the reason in `goal.md`'s log.

### Data Reversal
- **Has data migrations?** No. The move edits repository files and no persisted data, and every rule's text is in the pre-move commit.
- **Reversal procedure**: A `git revert` of the path-scoped commits restores the frontmatter declarations and removes the sidecars, and the suites' pre-move results stand as the reference.
<!-- /ANCHOR:enhanced-rollback -->

---
