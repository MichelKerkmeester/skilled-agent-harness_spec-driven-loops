---
title: "Implementation Summary: Phase 40: hard-rules-sidecar"
description: "Complete. The nine skills that declared dispatch hard rules in SKILL.md frontmatter now carry a `hard-rules.json` sidecar beside each SKILL.md, all 50 rules byte-equal, with every reader and test moved in the same change, a recorded before-and-after verdict comparison across all nine skills, and sk-doc's frontmatter contract naming the sidecar. The build sits in worktree 071 at start HEAD `b3964f2a3f`, and the orchestrator commits it path-scoped."
trigger_phrases:
  - "hard rules sidecar summary"
  - "hard rules sidecar status"
  - "skill frontmatter migration status"
  - "dispatch rule reader status"
  - "hard rules sidecar closure"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/040-hard-rules-sidecar"
    last_updated_at: "2026-09-30T18:29:21Z"
    last_updated_by: "markdown-leaf"
    recent_action: "Rewrote this file with the build, review and gate results"
    next_safe_action: "None. The orchestrator commits the build and the phase docs path-scoped"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/040-hard-rules-sidecar/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/040-hard-rules-sidecar/scratch/context/context.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-040-hard-rules-sidecar"
      parent_session_id: null
    completion_pct: 100
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
| **Status** | Complete |
| **Completed** | 2026-09-30; the build sits in `worktrees/071-cli-jev-sk-alignment` at start HEAD `b3964f2a3f` and the orchestrator commits it path-scoped after this pass |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The rules are out of frontmatter. Nine skills that declared dispatch hard rules in SKILL.md frontmatter now keep them in a `hard-rules.json` sidecar beside each SKILL.md, and the rules themselves are unchanged: 50 rules in nine files, every one byte-equal to the frontmatter block it replaced (`scratch/verify/compare.txt`, `scratch/verify/review-mimo-r1.txt`). The engine reads the sibling sidecar through the same `readHardRules(skillMdPath)` signature, keeps its fail-open contract and drops the frontmatter parse, and every reader and test that read a SKILL.md moved in the same change, so no dual read is left behind. The build sits in the working tree at start HEAD `b3964f2a3f`.

### Phase 40: hard-rules-sidecar

**The sidecar move.** Each sidecar is a bare JSON array of the same rule objects, with the four keys every rule uses (`id`, `check`, `message`, `severity`) in the declared order. The counts are 17 sk-git, 8 cli-jev, 8 cli-hermes, 5 cli-opencode, 4 cli-pi and 2 each for cli-claude-code, cli-codex, cli-cursor and cli-devin, 50 in all. Each `hard_rules` block was removed from its SKILL.md frontmatter with every other byte kept, plus the one sk-git body sentence at `SKILL.md:313` that said the block at the top of the file is executed (`scratch/verify/session-evidence.md`, criterion 1).

**The engine and the readers.** `readHardRules` reads `path.join(path.dirname(skillMdPath), 'hard-rules.json')`, returns `[]` on any read, parse or shape error, and drops entries without an `id` or `check`; `stripQuotes` and `parseHardRules` are deleted and not kept as exports. The twelve readers keep their `…/SKILL.md` argument, so no call site changed: the four preflight adapters, both OpenCode plugin copies, the sk-git advisory and its pi twin, the noise audit, the devin permission policy and the audit registry (`scratch/w4-build/design.md` section 1).

**Tests and docs.** The fail-open cases moved to the sidecar: missing, empty, null, object-not-array, malformed, an entry without `id` or `check`, a directory-named sidecar, a folder argument and a non-string (`.skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs:218-249`). The OpenCode consumer fixture writes a `hard-rules.json` sibling and the sk-git advisory fixture copies the real sidecar beside the real SKILL.md. sk-doc's frontmatter contract, its frontmatter templates and the skill template name `hard-rules.json` and say `hard_rules` is not a frontmatter key, with the one-line sweep of docs that described the old mechanism.

**Equivalence proof.** A 47-row corpus over the nine skills runs through `evaluate` before and after the move: `scratch/verify/compare.txt` prints one `equal <skill> <n> rows` line per skill at exit 0, the after rule snapshots byte-equal the before ones, and the review reproduced all 47 rows live against the current engine (`scratch/verify/review-mimo-r1.txt`).

**Regenerated copies.** The Hermes sync rewrote 10 of 72 copies (0 pruned) for the frontmatter change, and the compiled-routing activation manifests for cli-classifier, cli-external-orchestration and sk-doc were refreshed by their own tools, never hand-edited.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-git/hard-rules.json`, `.skilled/skills/cli-classifier/cli-jev/hard-rules.json`, and the `cli-external-orchestration` sidecars for `cli-opencode`, `cli-hermes`, `cli-pi`, `cli-claude-code`, `cli-codex`, `cli-cursor` and `cli-devin` | Created | Each skill's rules, copied exactly and emitted from the before snapshots, never retyped (D1) |
| The nine `SKILL.md` files named above | Modified | The `hard_rules` block removed, every other byte kept; one sk-git body sentence repointed to the sidecar (D1) |
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs` | Modified | Read the sibling sidecar, keep fail-open, delete `stripQuotes` and `parseHardRules` (D2, D3) |
| The twelve reader files of `scratch/w4-build/design.md` section 1, including the four preflight adapters, both OpenCode plugin copies, the sk-git advisory and its pi twin, the noise audit, the devin permission policy and the audit registry | Modified | Comment, message and wording repoints; the `…/SKILL.md` argument stays so the sibling read resolves (D3) |
| The five test files of `spec.md` section 3 | Modified | Sidecar cases and fixtures; the OpenCode consumer test and the sk-git advisory test write or copy the sidecar (D3) |
| `.skilled/skills/sk-doc/sk-create-frontmatter/SKILL.md`, its `assets/frontmatter-templates.md`, `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-md-template.md` and the swept docs | Modified | Name `hard-rules.json` and say `hard_rules` is not a frontmatter key (D5) |
| The dispatch, permission-policy and sk-git scripts READMEs, the six `git-preflight-advisory.md` playbook files, the sk-git playbook scenario, the two feature-catalog files, `sk-code`'s hooks reference and `cli-pi`'s native-skills reference | Modified | The one-line sweep of docs that said rules live in frontmatter (D5) |
| The ten `.hermes/skills/` copies and the three compiled-routing activation manifests | Regenerated | By their own tools, never hand-edited |
| `scratch/verify/corpus.json` and `scratch/verify/record-verdicts.mjs` | Created | The fixed command set and the recorder, both phase scratch (D4) |
| `scratch/verify/before/` and `scratch/verify/after/` | Created | Nine rule snapshots and nine verdict recordings each, compared (D4) |
| `spec.md`, `tasks.md`, `acceptance-criteria.md`, `goal.md`, `implementation-summary.md` | Modified | The phase record, closed in this pass |
| `graph-metadata.json` | Derived | Re-derived through `repair-derived.cjs` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek V4.1 Flash on Cline at xhigh wrote the design and the batches, and MiMo v2.6 Pro at high reviewed read-only: `scratch/verify/review-mimo-r1.txt` prints `VERDICT: PASS` with all five criteria met, all 50 rules byte-equal and all 47 corpus rows reproduced live. The design listed eight batches; the session landed batches 2 to 5 as one change (the engine and its suite, the reader and adapter wording, the nine sidecars and frontmatter removals, and the tests that read a SKILL.md), because the engine can read the sidecar only once the nine sidecars exist. Batch 6 the docs through sk-doc, batch 7 the Hermes sync and the manifest refresh, batch 8 the after verdicts and the comparison. The session ran the baselines, the verdict comparison and every gate from the final state.

The review's two P2 findings were both fixed in the session: `evaluate`'s JSDoc named the deleted frontmatter field, and the scratch recorder hardcoded a session scratchpad path (now `fs.mkdtempSync` under `os.tmpdir()`, so the recordings run on any host). No P0 or P1 was open. `parent-skill-check.cjs` is not applicable to sk-git, which is not a parent hub, as the Known Limitations record. The build and these docs wait on the orchestrator's path-scoped commit.
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

All checks ran from the working tree at start HEAD `b3964f2a3f`, with the raw outputs under `scratch/verify/`.

| Check | Result |
|-------|--------|
| The rule-for-rule comparison over the nine skills | `scratch/verify/compare.txt` prints nine `equal <skill> <n> rows` lines at exit 0, and all 50 rules compare byte for byte in the review's re-parse (`scratch/verify/review-mimo-r1.txt`) |
| `grep -rn '^hard_rules:' --include=SKILL.md .skilled/skills` | No output, exit 1; the nine sidecars hold 17, 8, 8, 5, 4, 2, 2, 2 and 2 rules, 50 in all (`scratch/verify/session-evidence.md`, criterion 1) |
| `rg -n 'readHardRules\|parseHardRules'` against `spec.md` section 3 | No production reader remains on frontmatter; the only `parseHardRules` hit is a dated benchmark raw report, and every reader row resolves the sidecar (`scratch/verify/session-evidence.md`, criterion 2; `scratch/verify/review-mimo-r1.txt`) |
| `node --test` on each of the five test files | `s1.txt` 20, `s2.txt` 75, `s3.txt` 26, `s4.txt` 7, `s5.txt` 7: 135 passed and 0 failed, equal to `scratch/verify/baseline-suites.txt` |
| The before and after verdict comparison per skill | `scratch/verify/compare.txt` is equal for all nine skills at exit 0, the 47 corpus rows and the empty-verdict rows included |
| `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check` | `PASS: 72 Hermes skill copies in sync`, after 10 of 72 copies written and 0 pruned (`scratch/verify/h2.txt`) |
| `python3 .skilled/skills/sk-doc/scripts/validate_document.py` on each changed doc | 0 issues on all 37 changed docs, 27 skill docs in the session's run and 37 in the reviewer's (`scratch/verify/session-evidence.md`, criterion 4; `scratch/verify/review-mimo-r1.txt`) |
| The live hook smoke | A bad `pi -p --model glm-5.3-flash "task"` was denied with `stdin-redirect-required`, `pi-offline-required` and `pi-provider-qualified-model`, a compliant `pi -p --offline --model llmgateway/... </dev/null` passed silently, and `jev choice ... -o only=x` was denied with `jev-choice-option-cardinality` (`scratch/verify/hook-smoke-jev.txt`) |
| The hub guard, derived metadata and the leaf manifest | `g2.txt` all seven hubs fresh, `df.txt` derived metadata 15 of 15 fresh and the leaf manifest 15 of 15 (`scratch/verify/session-evidence.md`, criterion 5) |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh` on this phase and the parent, `--strict --recursive` | `RESULT: PASSED` for every folder in this closure pass |
| `check-goal.cjs` and `goal.cjs packet` | `RESULT: PASSED (5/5 checks)` on this phase and the parent; `packet_budget=ok` (this closure pass) |

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

1. **sk-git is not a parent hub, so its hub check does not apply.** `parent-skill-check.cjs .skilled/skills/sk-git` fails five hub invariants because sk-git has no mode registry, router or description. The check is not applicable to sk-git and the failure is unchanged by this phase (`scratch/verify/session-evidence.md`).
2. **Hermes copies carry no sidecar.** No `.hermes` file calls `readHardRules`, and `sync-skills-hermes.cjs` matches `entry.name === 'SKILL.md'` only at `:61`, so the ten regenerated `.hermes/skills/` copies hold the SKILL.md without a `hard-rules.json` sibling; `--check` prints `PASS: 72` (`scratch/verify/h2.txt`; `scratch/w4-build/design.md` section 1).
3. **Two checklist rows stay open for one clause.** `CHK-022` and `CHK-FIX-004` keep their symlinked-SKILL.md-path clause open: every other case they name is covered, but no test hands `readHardRules` a SKILL.md path under a symlinked directory. The clause comes from `plan.md`'s FIX ADDENDUM, and the design's fixed test list does not carry it (`tasks.md`, Verification Summary).
4. **The build is uncommitted at this pass.** Every record comes from the working tree at start HEAD `b3964f2a3f`; the orchestrator commits the build and these docs path-scoped after this pass.
5. **The recordings stay in `scratch/`.** The corpus, the runner and both recording pairs are phase scratch, kept for review and excluded from the Hermes sync and the doc checks (`scratch/w4-build/design.md` section 7).
<!-- /ANCHOR:limitations -->

---
