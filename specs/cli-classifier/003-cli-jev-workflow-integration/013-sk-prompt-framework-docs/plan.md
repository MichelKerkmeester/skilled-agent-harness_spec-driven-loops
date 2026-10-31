---
title: "Implementation Plan: Phase 13: sk-prompt framework docs"
description: "Two text edits in the sk-prompt skill: one sentence of scope in the framework registry's description and a section-read rule for patterns-evaluation.md in SKILL.md, checked by a byte measurement and the owner's existing validators and tests."
trigger_phrases:
  - "sk-prompt framework docs plan"
  - "patterns-evaluation section read plan"
  - "framework registry description fix"
  - "sk-prompt byte measurement"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 13: sk-prompt framework docs

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown and JSON in the `sk-prompt` skill |
| **Framework** | sk-prompt's in-`SKILL.md` smart router and resource loading levels |
| **Storage** | None |
| **Testing** | `validate_document.py`, `quick_validate.py`, `check-prompt-quality-card-sync.sh`, the sweep foundation vitest and `sed` range byte counts |

### Overview
The registry keeps its five entries and gains a `description` that says they are code-task benchmark scaffolds for five of the skill's seven frameworks. `SKILL.md` gains one rule, stated in its resource loading section and in its agent rules, to read `patterns-evaluation.md` by three named sections instead of whole. A byte count before and after, plus the owner's own validators and tests, prove the change.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: a skill document read by a model, with a JSON asset read by one script.

### Key Components
- **`assets/framework-registry.json`**: data-only framework scaffolds rendered by `sweep-benchmark.cjs` (`DEFAULT_REGISTRY_PATH`, lines 45 to 48). Only its top-level `description` changes.
- **`SKILL.md` section 2, `### Resource Loading Levels` (line 91)**: says which resource loads when. The section-read rule goes here, below the table, so the router's authoritative pseudocode block keeps choosing files and the rule decides how much of `patterns-evaluation.md` a run reads.
- **`SKILL.md` section 7, `### Deterministic Agent Rules` (line 459)**: the bullet "Use `references/patterns-evaluation.md` as the framework-selection source of truth" (line 461) gains the same section list, so `@prompt-improver` runs follow it too.

### Data Flow
A run routes to `TEXT_ENHANCE`, `FRAMEWORK` or a format intent. It reads `## 2. FRAMEWORK LIBRARY & SELECTION`, scores at least three frameworks (the NEVER rule at `SKILL.md` line 355 and 356), picks one, reads that framework's `###` subsection under `## 3. FRAMEWORK DEEP DIVES`, runs DEPTH and scores with `## 10. CLEAR EVALUATION MASTERY`. A request with an on-demand keyword ("deep dive", "full template", "all frameworks", `SKILL.md` line 146) still reads the whole file. A framework name with no matching subsection reads all of section 3.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `sk-prompt/assets/framework-registry.json` | Owner of the five code-task scaffolds | update `description` only | `node -p` prints the ids and `true true` for CRISPE and CRAFT |
| `sk-prompt/SKILL.md` | Owner of routing and the agent rules | update: one rule in two places | `grep -c` of the three headings, `validate_document.py` prints `VALID` |
| `sweep-benchmark.cjs` and `tests/sweep-foundation.vitest.ts` (`system-deep-loop`) | Read the registry, pin the five ids | unchanged | sweep foundation vitest exits 0 |
| `check-prompt-quality-card-sync.sh` (`system-skill-advisor`) | Keeps the seven-framework table in its canonical sk-prompt homes | unchanged | prints `GUARD PASS` |
| `.skilled/agents/prompt-improver.md` and its runtime mirrors | Read `SKILL.md` before composing (line 181) | not a consumer of the changed text, unchanged | `git diff --name-only` shows no agent file |
| `sk-prompt/README.md` line 216 and the playbook scenarios | Describe the registry as a subset of five and open `patterns-evaluation.md` by path | unchanged | `git diff --name-only` shows neither |

Required inventories:
- Same-class producers: `rg -n 'framework-registry' --glob '!specs/**' --glob '!**/reports/**' --glob '!**/changelog/**' .` found the skill's own metadata files, `README.md`, the sweep script, its test, `SWEEP.md`, `MODES.md`, one benchmark profile and the benchmark profile template (2026-09-27). None reads the `description` field.
- Consumers of changed symbols: `rg -l 'patterns-evaluation' .skilled/agents .skilled/skills/sk-prompt` lists `SKILL.md`, `README.md`, the quality card, 23 playbook files, the skill's three metadata files, three changelogs and two dated benchmark reports, all by path (2026-09-27). The agent file names only `SKILL.md`. No consumer parses the file by section.
- Matrix axes: intent (`TEXT_ENHANCE`, `FRAMEWORK`, format intents, `RAW`) by framework (seven) by on-demand keyword (present, absent). Rows that matter: any intent with a chosen framework and no keyword reads three sections, any keyword reads the whole file, `RAW` reads nothing.
- Algorithm invariant: a run reads section 2 before it chooses and section 10 before it scores.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Each step's observable check:

| Step | Observable check |
|------|------------------|
| Recheck state | `git status --short -- .skilled/skills/sk-prompt` prints nothing and `git log -5 --format='%h %ad %s' --date=short -- .skilled/skills/sk-prompt` shows no commit after `ee5852eae6` that touches either file, or the build rereads the changed lines first |
| Baseline | The five baseline commands in section 5 print the values recorded there |
| Registry edit | `node -p` from section 5 prints `rcaf,race,cidi,tidd-ec,costar true true` |
| SKILL.md edit | `grep -c 'FRAMEWORK DEEP DIVES' .skilled/skills/sk-prompt/SKILL.md` prints at least 2, and the same for `CLEAR EVALUATION MASTERY` |
| Measurement | The `sed` counts in section 5 print 7,554 for TIDD-EC and 9,686 for CRAFT, and `wc -c` on `SKILL.md` prints at most 24,000 |
| Regression | The four checks of REQ-004 pass |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Registry ids and entries unchanged, both names in `description` | `node -p`, sweep foundation vitest |
| Integration | `SKILL.md` still valid as a skill doc, card sync guard still passes | `validate_document.py`, `quick_validate.py`, `check-prompt-quality-card-sync.sh` |
| Manual | Read-set size for the smallest and largest framework | `sed` range counts and `wc -c` |

Happy path: TIDD-EC and CRAFT read sets measured. Edge case per changed surface: for `SKILL.md`, the on-demand keyword line still exists (`grep -c '"all frameworks"' SKILL.md` prints 1). For the registry, the ids are byte-identical (`git diff` of the registry shows one changed line, the `description`).

Baseline measured 2026-09-27 at `00480a8d5c`, all run from the worktree root with `PYTHONDONTWRITEBYTECODE=1`:

```bash
P=.skilled/skills/sk-prompt/references/patterns-evaluation.md
wc -c < .skilled/skills/sk-prompt/SKILL.md                    # 23081
wc -c < "$P"                                                  # 36580
sed -n '/^## 2\. /,/^## 3\. /p' "$P" | sed '$d' | wc -c        # 3066
sed -n '/^## 10\. /,/^## 11\. /p' "$P" | sed '$d' | wc -c      # 3950
sed -n '/^### CRAFT /,/^## 4\. /p' "$P" | sed '$d' | wc -c     # 2670, the largest deep dive
sed -n '/^### TIDD-EC /,/^### RACE /p' "$P" | sed '$d' | wc -c # 538, the smallest deep dive
node -p '((r)=>r.frameworks.map(f=>f.id).join(",")+" "+/CRISPE/.test(r.description)+" "+/CRAFT/.test(r.description))(require("./.skilled/skills/sk-prompt/assets/framework-registry.json"))'
# rcaf,race,cidi,tidd-ec,costar false false
python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/sk-prompt/SKILL.md   # VALID, exit 0
python3 .skilled/skills/sk-doc/scripts/quick_validate.py .skilled/skills/sk-prompt                # Skill is valid, exit 0
bash .skilled/skills/system-skill-advisor/runtime/scripts/check-prompt-quality-card-sync.sh .     # GUARD PASS, exit 0
```

The sweep foundation test runs from `.skilled/skills/system-deep-loop/deep-improvement/scripts` with `npx vitest run model-benchmark/tests/sweep-foundation.vitest.ts` (the config comment says to run from that directory). It was not run while planning, so the build records its baseline first.

Before: 23,081 plus 36,580 is 59,661 bytes. After, largest: at most 24,000 plus 9,686 is at most 33,686 bytes. Per framework the section read is 7,016 bytes for sections 2 and 10 plus the one deep dive (538 to 2,670 bytes). At the research's 3.5 runs a week and 4 bytes a token, the saving is about 23,500 to 25,400 tokens a week (estimate).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 012 sk-doc validator changes | Internal | Yellow | A validator this phase runs may change its findings. Rerun after 012 lands |
| `npx vitest` from the repository-root install | Internal | Green | Without it the sweep foundation test cannot run. Then the registry check falls back to `node -p` and a `git diff` showing one changed line |
| sk-prompt changelog convention | Internal | Green | The entry follows the owner's latest changelog file (`changelog/v3.0.1.0.md`) |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: any REQ-004 check fails and cannot be fixed inside the two files, or the owner rejects the direction of D1 or the read set of D2.
- **Procedure**: before commit, restore the file with `git restore <path>`. After commit, `git revert <sha>` of the one build commit. Nothing else needs undoing: no data, install or generated artifact changes.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup: recheck and baseline) ──► Phase 2 (Core: two edits and changelog) ──► Phase 3 (Verify: measure and regress)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 15 minutes |
| Core Implementation | Low | 30 minutes |
| Verification | Low | 20 minutes |
| **Total** | | **about 1 hour** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes)
- [ ] Feature flag configured
- [ ] Monitoring alerts set

No data changes, no feature flag and no monitoring apply. The checklist items above stay unchecked as not applicable.

### Rollback Procedure
1. Stop using the rule: `git restore .skilled/skills/sk-prompt/SKILL.md` before commit.
2. Revert: `git revert <build sha>` after commit.
3. Verify: `grep -c 'FRAMEWORK DEEP DIVES' .skilled/skills/sk-prompt/SKILL.md` prints 0 and the registry `node -p` prints `false false`.
4. Notify: record the revert in this phase's `goal.md` log.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
