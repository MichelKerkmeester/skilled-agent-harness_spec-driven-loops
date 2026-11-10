---
title: "Implementation Plan: Phase 16: scaffold-filler-section-trim"
description: "Take the strict and rule census baselines after phase 015 lands, then apply one short DeepSeek brief per template change: remove the effort and enhanced-rollback sections, empty the phase-deps, edge-case, sign-off and DoD samples, make Fix Completeness optional, drop the card's Step requirement and fix two decision-record pointers. The censuses, the scaffold guards and a fresh Opus review close it."
trigger_phrases:
  - "scaffold filler section trim plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.3 -->
# Implementation Plan: Phase 16: scaffold-filler-section-trim

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one output branch. Prove it with a line count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown templates, one reference doc, TypeScript vitest files |
| **Framework** | system-spec-kit templates, `create.sh` and the validation orchestrator |
| **Storage** | None |
| **Testing** | vitest (CLI project), the strict and six-rule censuses, `check-card-sync.sh`, `check-example-drift.sh`, `sync-skills-hermes.cjs --check` |

### Overview
Six filler sections in the three core templates get one decision each, applied to the templates and to the filled examples. Fix Completeness becomes optional through its H2 prefix, card section 6 drops its Step requirement, and two decision-record pointers become conditional. DeepSeek V4.1 Flash max through cli-pi makes each change from one short brief, cli-codex gpt-6-luna is the fallback, a fresh Opus medium agent reviews the diff, and the conductor runs every gate, including censuses that must match their baselines.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `rg -n 'quiet' recommend-level.sh` prints the new branch before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] Phase 015's template edits are final: its `acceptance-criteria.md` reads `Closeable: Yes`
- [ ] `ls scratch/baseline/` lists the census-before and rules-before files and `cli-before.txt`

### Definition of Done
- [ ] `diff <(sort scratch/baseline/census-before.tsv) <(sort scratch/baseline/census-after.tsv)` prints nothing, and the same for the rules files
- [ ] Every row in `acceptance-criteria.md` is Met
- [ ] `validate.sh` on this folder with `--strict` prints `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. GOOD: Single script branch. The component is `recommend-level.sh`. WEAK: Standard architecture. -->

### Pattern
Baseline, edit, census. Each edit is one brief; the censuses decide.

### Key Components
- **The per-section decisions**: one row per filler section. Line numbers are from the tree before phase 015; briefs match by text.

| Section | Evidence | Decision | Why |
|---------|----------|----------|-----|
| L3+ sign-off role table, `tasks.md.tmpl:290` | 9 of 12 packets | Keep at Level 3 and 3+; replace the three named roles with one token row | The operator keeps it for governance. The named roles are what survived; a token row is an error in any non-Draft packet, so it cannot pass as filled |
| L2 enhanced rollback, `plan.md.tmpl:219` | 8 of 12 | Remove from the scaffold | The pre-deployment rows presume a deployed service with flags and monitoring. The required section 7 already holds the trigger and the revert command |
| L2 phase dependencies, "Phase 1.5 (Config)", `plan.md.tmpl:192` | 6 of 12 | Replace the sample with an empty skeleton: one line `Setup ──► Implementation ──► Verification` and token rows | `tasks.md` always has those three phases, so the chain is true; the Config branch was invented in every packet that kept it |
| L2 edge cases, "External service failure / Network timeout", `spec.md.tmpl:261` | 6 of 12 | Replace the eight category rows with three token lines: empty input, maximum input, failure path | The fill note asks for exactly those three. The section stays because Level 3 requires `## 8. EDGE CASES` |
| DoD "Tests passing (if applicable)", `plan.md.tmpl:76` | 4 of 12 | Replace the line with one token for the test command and its expected output | The quality-gates fill note asks for a gate a command can answer; "(if applicable)" invites a tick with no command |
| L2 effort estimation, `plan.md.tmpl:205` | generic in 6 of 6 | Remove from the scaffold | No command can check an estimate, and no rule or tool reads the `effort` anchor; only `validation-optional-anchors.vitest.ts:52`, which deletes it |

No section is made lazy: the only lazy mechanism, `lazyAddonDocs` in `templates/spec-kit-docs.json:105`, creates whole documents, not sections. An author who needs effort or deployment detail writes it under an existing section.

- **Fix Completeness**: the header `## Fix Completeness` (`tasks.md.tmpl:166`) becomes `## FIX ADDENDUM: FIX COMPLETENESS`, which matches `OPTIONAL_TEMPLATE_HEADER_RE` (`runtime/lib/validation/orchestrator.ts:648`) and its twin `OPTIONAL_TEMPLATE_PREFIX_RE` (`runtime/cli/utils/template-structure.js:20`), the same prefix plan.md's `FIX ADDENDUM: AFFECTED SURFACES` uses. The required set is derived from those H2 prefixes (`orchestrator.ts:669`) and checked at `orchestrator.ts:994`, so no code changes. `sectionGates` in `spec-kit-docs.json:616` controls rendering only and stays. The fill note at `tasks.md.tmpl:167` changes to "Write this section when the packet fixes a reported finding. Delete it otherwise."
- **Card section 6** (`spec-authoring-card.md:87`): drop the Step requirement. Evidence: tasks.md carries `Verify:` on 100% of lines in 12 of 12 packets (`insight-review.md:9`); the four filled examples carry 0 `### Step` blocks (`rg -c '^### Step '` over `templates/examples/*/plan.md`); `check-card-sync.sh` does not read section 6. Section 6 then says what `plan.md.tmpl:124` says, and the section 11 bullet "the feature needs more than 4 plan steps" becomes "the plan needs more than the three task phases".
- **Decision-record pointers**: `spec.md.tmpl:450` loses the always-there link, and its fill note at `:445` says to add `decision-record.md` only when the packet has one, as the tasks cross-refs note already does. `tasks.md.tmpl:232` CHK-100 becomes "Each architecture decision is an ADR in plan.md's ARCHITECTURE DECISION RECORD section, or in `decision-record.md` when the packet has one"; `plan.md.tmpl:304` holds that section.

### Data Flow
Each brief names one file and one text match. The executor edits, the conductor runs the brief's Verify command, then the golden snapshots regenerate once at the end and the censuses run from the final tree.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `recommend-level.sh`: owns the output. Action: update. WEAK: Various files. -->

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `templates/core/{spec,plan,tasks}.md.tmpl` | Own the scaffold | update | `create.sh --level 2` and `--level 3` scaffolds hold none of the filler strings |
| `templates/examples/level-{2,3,3+}/` | Show filled section shape | update to the template's anchors | `check-example-drift.sh` prints `EXAMPLE_DRIFT_OK` |
| `orchestrator.ts`, `template-structure.js` | Derive the required set from H2 prefixes | unchanged | `required-template-anchors.vitest.ts` passes |
| `runtime/tests/validation-optional-anchors.vitest.ts` | Pins which anchors are optional | add a Fix Completeness case | the new case passes |
| `scaffold-golden-snapshots.vitest.ts.snap` | Pins the rendered scaffold | regenerate | the test passes without `-u` after the regeneration |
| `references/validation/template-compliance-contract.md:141` and `:162` | List the L2 plan addenda and the required `fix-completeness` | update | `rg -n 'effort' ` and `rg -n 'fix-completeness'` on it show the new state |
| Existing packets under `specs/` | Hold the old sections | not a consumer | strict and rule census diffs print nothing |
| `.hermes/skills/` | Mirror the skill docs | update by sync | `sync-skills-hermes.cjs --check` prints `PASS` |

Inventories: `rg -n 'fix-completeness|Fix Completeness' .skilled/skills/system-spec-kit` outside `specs/`, changelogs and fixtures lists the template, the examples, `spec-kit-docs.json`, the compliance contract and the golden snapshot. `rg -n 'enhanced-rollback|EFFORT ESTIMATION'` adds `validation-optional-anchors.vitest.ts:52`, which already removes both anchors and stays valid.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads the current output. Implementation adds the branch. Verification counts lines. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. Setup takes the baselines after phase 015, Implementation applies one brief per change, and Verification reruns the censuses, guards and review.

### Step 1: Take the baselines

Acceptance: the strict census, the rule census and the CLI test project have before files, taken after phase 015 lands.
Verify: `ls scratch/baseline/` lists `census-before.tsv`, `rules-before.tsv` and `cli-before.txt`.

### Step 2: Apply the section decisions and the pointer fixes

Acceptance: each template and example change in section 3 is in the diff, one brief per change.
Verify: `rg -n 'Phase 1.5|Feature flag configured|Tests passing \(if applicable\)' .skilled/skills/system-spec-kit/templates/core/` prints nothing.

### Step 3: Make Fix Completeness optional and fix the card

Acceptance: the new header is in `tasks.md.tmpl`, the optional-anchor test has the new case, and card section 6 has no Step block.
Verify: `rg -n '### Step' .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md` prints nothing.

### Step 4: Rerun the censuses and guards, review and validate

Acceptance: both census diffs are empty, every guard passes and the reviewer finds no wrong edit.
Verify: `diff <(sort scratch/baseline/census-before.tsv) <(sort scratch/baseline/census-after.tsv)` prints nothing.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `--quiet` prints 1 line. The default prints 17. WEAK: Test it manually. -->

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Regression | Every existing packet's verdict | `strict-census.mjs` and `rule-census.mjs` from `../010-deep-review-finding-fixes/scratch/tools/` over the three 010 shard lists, before and after; sorted diffs print nothing |
| Unit | Required set and optional anchors | `required-template-anchors.vitest.ts`, `validation-optional-anchors.vitest.ts` pass |
| Scaffold | Fill notes and rendered output | `template-fill-guidance.vitest.ts` and `scaffold-golden-snapshots.vitest.ts` pass after one regeneration |
| Guard | Card, examples, Hermes | `check-card-sync.sh` prints `CARD SYNC OK`; `check-example-drift.sh` prints `EXAMPLE_DRIFT_OK`; `sync-skills-hermes.cjs --check` prints `PASS` |
| Suite | CLI test project | Same pass count as `cli-before.txt`, less none |
| Review | The whole diff | A fresh Opus medium agent reports no wrong edit |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 015's final template edits | Internal | Yellow | Baselines and briefs would target moving text; wait for 015 |
| Census tools and shard lists in `../010-deep-review-finding-fixes/scratch/` | Internal | Green | No regression proof |
| LLM Gateway, DeepSeek V4.1 Flash max through cli-pi | External | Green | Rerun the brief on cli-codex gpt-6-luna |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: the default output changes. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: a census row changes verdict that the fallbacks in `spec.md` section 6 do not fix, or the CLI suite loses a pass.
- **Procedure**: revert this phase's one commit with `git revert`, then rerun the censuses to confirm the baseline.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
<!-- FILL: Draw the phase order in the fence, then fill the table with depends-on and blocks. Write `N/A` with one reason, or delete the whole section. GOOD: Setup to Implementation to Verification. Verification blocks close. WEAK: Phases depend on each other. -->

```
Phase 015 closes ──► Setup (baselines) ──► Implementation (briefs) ──► Verification (censuses, guards, review)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 015 closed | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Close |
<!-- /ANCHOR:phase-deps -->

---
