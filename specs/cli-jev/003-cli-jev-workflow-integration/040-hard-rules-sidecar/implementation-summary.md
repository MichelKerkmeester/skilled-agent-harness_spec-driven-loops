---
title: "Implementation Summary: Phase 40: hard-rules-sidecar"
description: "Planned stub. Nothing is built yet. This phase will move the hard rules of nine skills out of SKILL.md frontmatter into a `hard-rules.json` sidecar beside each SKILL.md, repoint every reader and test in the same change, prove enforcement identical with a recorded before-and-after verdict run, and teach sk-doc's frontmatter contract where hard rules live. The basis is the operator's 2026-09-30 decision, held in `scratch/context/context.md`."
trigger_phrases:
  - "hard rules sidecar summary"
  - "hard rules sidecar status"
  - "skill frontmatter migration status"
  - "dispatch rule reader status"
  - "hard rules verdict comparison status"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/040-hard-rules-sidecar"
    last_updated_at: "2026-09-30T00:00:00Z"
    last_updated_by: "markdown-leaf"
    recent_action: "Stubbed as Planned, nothing is built"
    next_safe_action: "Build the phase, then rewrite this file with the results"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/040-hard-rules-sidecar/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/040-hard-rules-sidecar/scratch/context/context.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-040-hard-rules-sidecar"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 040-hard-rules-sidecar |
| **Status** | Planned |
| **Completed** | Not yet. This file records the plan, not a result |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing is built yet. This is the Planned stub for a phase whose docs were authored on 2026-09-30 from `scratch/context/context.md` and the operator's "Move rules out of frontmatter". The sidecars, the engine change, the reader changes and the docs all remain to be written, and every completion criterion is open.

### Phase 40: hard-rules-sidecar

The phase will move the rules of nine skills out of SKILL.md frontmatter and into `hard-rules.json` beside each SKILL.md, copied exactly. The nine files that declare the key today are `sk-git/SKILL.md`, `cli-classifier/cli-usage/SKILL.md` (renamed to `cli-classifier/cli-jev` by phase 039 first), and the `cli-external-orchestration` skills `cli-opencode`, `cli-cursor`, `cli-codex`, `cli-hermes`, `cli-devin`, `cli-claude-code` and `cli-pi`. A read of this tree counts 50 rules across them, each with `id`, `check`, `message` and `severity`. The engine at `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs` will read the sidecar through `readHardRules`, keep its fail-open contract and drop the frontmatter parse, and the 10 readers and five test files of `spec.md` section 3 will move in the same change.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-git/hard-rules.json` | Planned create | The 17 sk-git rules, copied exactly. Proposed name |
| `.skilled/skills/cli-classifier/cli-usage/hard-rules.json` | Planned create | The 8 cli-usage rules. Proposed name, on the post-039 path |
| `.skilled/skills/cli-external-orchestration/cli-opencode/hard-rules.json` | Planned create | The 5 cli-opencode rules. Proposed name |
| `.skilled/skills/cli-external-orchestration/cli-hermes/hard-rules.json` | Planned create | The 8 cli-hermes rules. Proposed name |
| `.skilled/skills/cli-external-orchestration/cli-pi/hard-rules.json` | Planned create | The 4 cli-pi rules. Proposed name |
| `.skilled/skills/cli-external-orchestration/cli-claude-code/hard-rules.json`, `cli-codex`, `cli-cursor` and `cli-devin` equivalents | Planned create | The 2 rules of each. Proposed name |
| The nine `SKILL.md` files named above | Planned modify | The `hard_rules` key removed, every other byte kept |
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs` | Planned modify | Read the sidecar, keep fail-open, delete the frontmatter parse |
| The 10 readers and five test files of `spec.md` section 3 | Planned modify | Moved to the sidecar in the same change |
| `.skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-templates.md` with its `SKILL.md`, and `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-md-template.md` | Planned modify | Say where hard rules live, through sk-doc |
| `.skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs` | Read only, unless the design proves a Hermes copy needs the sidecar | Its `listSkillFiles` matches only `SKILL.md` at `:61` |
| `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `goal.md`, `implementation-summary.md` | Modified | The phase record, authored as Planned |
| `description.json`, `graph-metadata.json` | Derived | Refreshed through `repair-derived.cjs` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not started. The plan records the before verdicts first, then lands the engine, the readers and the nine sidecars in one change, then the docs through sk-doc, then the after verdicts and the suites from the final state, then a cross-family review and the closure gates. DeepSeek V4.1 Flash writes and MiMo v2.6 Pro reviews under parent D5 through this phase's D6, with no Claude worker. The session runs the baselines, the verdict comparison and the closure gates, and no install runs.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The rules move to a sidecar beside each SKILL.md (D1) | The field they used is one Claude Code ignores, and JSON parses without a YAML or markdown parser, which keeps the engine dependency-free |
| The engine stays fail-open (D2) | A broken declaration must not block a dispatch or crash a hook, and that is the contract `readHardRules` holds today |
| Every reader and test moves in the same change (D3) | A dual read would let a skill look moved while a reader still parses frontmatter, and the enforcement would diverge |
| Enforcement is proved by a before-and-after verdict run (D4) | The suites assert rule ids, not the verdicts a dispatch sees, so a separate comparison is what shows the rules still fire the same way |
| sk-doc's contract names the sidecar (D5) | Otherwise the next skill author writes the key back into frontmatter, and the problem returns |
| DeepSeek writes and MiMo reviews (D6) | Parent D5's roster, with the reverse direction for any MiMo fix and no Claude worker |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

No build check has run. This phase is Planned, so the table lists the checks the build will run and their expected results. The rows close when the build's own recordings and suite results satisfy them.

| Check | Result |
|-------|--------|
| The rule-for-rule comparison over the nine skills | Pending. Expected `equal` per skill with the counts 17, 8, 8, 5, 4, 2, 2, 2 and 2 |
| `grep -rn '^hard_rules:' --include=SKILL.md .skilled/skills` | Pending. Expected no output |
| `rg -n 'readHardRules\|parseHardRules'` against `spec.md` section 3 | Pending. Expected every row reconciled, with no production reader on frontmatter |
| `node --test` on each of the five test files | Pending. Expected 0 failed at or above the baseline |
| The before and after verdict comparison per skill | Pending. Expected an empty comparison |
| `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check` | Pending. Expected pass |
| `python3 .skilled/skills/sk-doc/scripts/validate_document.py` on each changed doc | Pending. Expected VALID |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this phase> --strict` | Pending at build time |
| `check-goal.cjs` and `goal.cjs packet` | Pending at build time |

### Authoring pass (2026-09-30)

These gates ran on the phase docs only. They prove the record is well formed, not that anything is built.

| Check | Result |
|-------|--------|
| `node .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --folder specs/cli-jev/003-cli-jev-workflow-integration/040-hard-rules-sidecar --apply` | Exit 0, `inspected=1 repaired=1 failed=0`, and `graph-metadata.json` re-derived |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-jev/003-cli-jev-workflow-integration/040-hard-rules-sidecar --strict` | `RESULT: PASSED`, `Errors: 0  Warnings: 0`, exit 0 |
| `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/cli-jev/003-cli-jev-workflow-integration/040-hard-rules-sidecar` | `RESULT: PASSED (5/5 checks)`, exit 0 |
| `node .skilled/hooks/goal/bin/goal.cjs packet specs/cli-jev/003-cli-jev-workflow-integration/040-hard-rules-sidecar --workspace "$PWD"` | `STATUS=OK ACTION=packet`, `packet_durable_chars=1877`, exit 0 |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/check-placeholders.sh specs/cli-jev/003-cli-jev-workflow-integration/040-hard-rules-sidecar` | `PASS` with zero placeholder patterns, exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Nothing is built.** The completion criteria are open, and no sidecar, engine change or reader change exists yet.
2. **Phase 039 runs first.** One of the nine skill folders moves before this phase touches it, and the design reads the post-rename path rather than assuming it.
3. **The inventory is wider than the criterion.** `goal.md`'s second criterion names the engine, the four preflight adapters and both sk-git scripts. The tree holds 10 readers and five test files, including the OpenCode plugin copies, the pi twin of the sk-git advisory and the devin permission policy. `spec.md` section 3 lists each, and the design reconciles every row.
4. **The Hermes copies keep their old block until the design rules.** `sync-skills-hermes.cjs` matches only `SKILL.md`, so a sidecar is not copied today, and whether a Hermes copy needs one is open.
5. **The fixed command set is not fixed yet.** The design chooses it, and until then the verdict comparison has no rows.
<!-- /ANCHOR:limitations -->

---
