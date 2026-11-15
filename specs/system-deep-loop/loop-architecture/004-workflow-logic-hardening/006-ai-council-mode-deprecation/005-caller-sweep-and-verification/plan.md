---
title: "Implementation Plan: Phase 5: caller-sweep-and-verification"
description: "Update the callers outside the hub, the runtime and the advisor, regenerate the trigger index, then prove the whole phase on the final tree. The proof is the vocabulary sweep against the allowlist, both routing stages replayed on three prompts, every baseline gate rerun and a recursive validation of the phase parent."
trigger_phrases:
  - "caller sweep and verification plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 5: caller-sweep-and-verification

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, CommonJS, Markdown, YAML and JSON across six skills, hooks, plugins and CI |
| **Framework** | None. `sk-doc` governs the doc edits and `sk-code` the code edits. |
| **Storage** | None changed. |
| **Testing** | `node --test` for the Gate 3 parity and plugin guard tests, both routing replays, the mirror checkers, the vocabulary sweep and every gate in `../scratch/gate-baseline.md` |

### Overview
Update the callers outside the hub, the runtime and the advisor, regenerate the trigger index, then prove the whole phase on the final tree. The proof is the vocabulary sweep against the allowlist, both routing stages replayed on three prompts, every baseline gate rerun and a recursive validation of the phase parent.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `rg -l -F '| **Status** | Complete' ../004-advisor-council-removal/spec.md | wc -l` prints 1.
- [ ] `sed 's/^- //' ../scratch/exceptions.md | xargs ls >/dev/null` exits 0, so every allowlisted path exists.

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is `Met`.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-deep-loop/loop-architecture/004-workflow-logic-hardening/006-ai-council-mode-deprecation --recursive --strict` prints `RESULT: PASSED` for the parent and all five children.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Sweep by vocabulary. Callers are found by the words a council request uses, not only by file and command names.

### Key Components
- **Callers in other skills**: each one is edited to name the agent or `/speckit:ai-council`, deleted when it tests a removed script, or allowlisted when it records history.
- **Allowlist**: `../scratch/exceptions.md`, written by child 001, lists every history file the sweep may still match.
- **Gate baseline**: `../scratch/gate-baseline.md` holds the start column from child 001. This child fills the final column.

Inventory command, run on 2026-11-14 and saved to `scratch/council-inventory-2026-11-14.txt`:

```bash
rg -l --hidden -i 'ai[-_ ]council|aiCouncil|deep-council' -g '!specs/**' -g '!**/node_modules/**' -g '!.git/**' . | wc -l
```

It printed 451. The narrower mode vocabulary `deep-ai-council|deep_ai_council|/deep:ai-council|deep-council|DeepAiCouncil` matched 320 files, and 169 outside changelogs, benchmark folders and the packet itself. The 143 runtime files that name `council` include the pivot and are classified by the D4 table above. Grouped by surface:

Same-class producers to search by vocabulary, not name, because the precedent's phase 012 found leftovers a name search missed: "planning council", "council deliberation", "multi-seat planning", "council convergence", "adjudicator-verdict".

### Data Flow
On the final tree a council prompt selects no deep-loop mode in stage one and no deep-loop packet in stage two, and the advisor offers `/speckit:ai-council`. A research prompt reaches `deep-research` and a review prompt reaches `deep-review` in both stages.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Owner of the shared contract: `system-deep-loop/mode-registry.json`. The contract that must not break is the research and review route through both stages and the divergent pivot's call into `multi-seat-dispatch.cjs`. Real callers this child changes, read on 2026-11-14:

- `.skilled/skills/system-spec-kit/shared/gate-3-classifier.ts:200` the `/deep:ai-council` resume phrase.
- `.skilled/hooks/task-dispatch/lib/dispatch-guard.cjs:82` the comment that names `/deep:ai-council`.
- `.opencode/plugins/system-deep-loop-guard.js:8` reads the registry, and `.opencode/plugins/tests/system-deep-loop-guard.test.cjs:36` seeds a council mode.
- `.env.example:463` `DEEP_LOOP_COUNCIL_DB_DIR` and `:469` `DEEP_AI_COUNCIL_AUTHORIZED_SPEC_ROOTS`.

Surfaces this child owns, from the inventory of 451 files saved to `../scratch/council-inventory-2026-11-14.txt`:

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Hub `benchmark/` (6) and `changelog/` (10) | Dated reports and release history | unchanged, allowlisted | Listed in `scratch/exceptions.md` |
| `cli-external-orchestration/` (41) | CLI skill docs, playbooks and benchmarks that name the council command or mode | update live docs. Keep dated benchmarks. | Sweep check REQ-015 |
| `system-spec-kit/` (34) | Council tests of packet scripts, `test-council-matrix.sh`, `gate-3-classifier.ts`, references, trigger index and retrieval fixtures | delete tests of removed scripts, keep `multi-ai-council-validator.vitest.ts`, update the rest, regenerate the trigger index | `npm test` for spec-kit tests touched, `generate-trigger-index.mjs` |
| `sk-doc/` (18) | Agent template, command contract, benchmark templates, allowlists, fixtures, sweep reports | update live templates. Keep dated reports and `cite-drift-redirects.json`. | Sweep check REQ-015 |
| `sk-prompt/` (2), `sk-code/` (2), `mcp-tooling/` (2) | A prompt card, one changelog and dated benchmark reports | update the card, keep history | Sweep check REQ-015 |
| `.skilled/hooks/` (3), `.skilled/bin/` (3), `.opencode/` (2), `.github/` (4) | Dispatch guard, hook test, crosswalk, compiled-routing canaries, permission fixture, plugin guard and its test, CI path filters | update. Keep CI ignore paths that point at archived spec trees. | Plugin test and hook tests pass |
| `.skilled/manual-testing-playbook/` (2), `.skilled/changelog/` (6), `.skilled/skills/README.txt`, `.skilled/skills/.state/loop-guard/README.md`, root `README.md`, `.env.example` | Doctor scenarios, release history, skill index, root docs, env vars | update. Keep changelogs. | Sweep check REQ-015 |
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup confirms child 004 is Complete. Implementation updates the callers by surface and regenerates the trigger index. Verification replays both routing stages, runs the mirror checkers and the vocabulary sweep, reruns every baseline gate and validates the phase parent recursively. `tasks.md` owns the ordered work.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Gate 3 menu parity, the plugin guard and the hook tests | `node --test .skilled/skills/system-spec-kit/runtime/tests/hooks/gate-3-menu-parity.test.mjs`, `node --test .opencode/plugins/tests/system-deep-loop-guard.test.cjs` |
| Integration | Both routing stages, the mirror checkers, the sweep and every baseline gate | `skill_advisor.py`, `compiled-route.cjs --hub system-deep-loop`, the `/doctor:runtime-mirrors` checkers, the T086 `rg` sweep, the commands in `../scratch/gate-baseline.md` |
| Manual | Read each sweep hit that is not on the allowlist and confirm it names the standalone agent | Read the lines |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Child 004 | Internal | Yellow: must be Complete first | The final replay runs against a stale advisor. |
| `../scratch/gate-baseline.md` and `../scratch/exceptions.md` from child 001 | Internal | Yellow: written by child 001 | No start values and no allowlist to compare against. |
| `generate-trigger-index.mjs` | Internal | Green | The trigger index keeps packet paths. |
| `sk-doc` skill | Internal | Green | Doc edits lose template and voice checks. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a gate ends worse than its baseline and cannot be repaired in this child, or a research or review prompt stops routing to its mode on the final tree.
- **Procedure**: `git revert <sha>` for each commit of this child restores the caller edits and the deleted spec-kit tests. Then rerun `generate-trigger-index.mjs`, because the index follows its sources. Reverting the whole phase means reverting the commits of children 005 to 001 in that order and rerunning the agent and command mirror generators, `generate-leaf-manifest.cjs` and the command bridges. `ai-council/**` artifacts inside spec folders are never edited, so they need no restore.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Child 004 at Status Complete | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Phase parent close |
<!-- /ANCHOR:phase-deps -->

---
