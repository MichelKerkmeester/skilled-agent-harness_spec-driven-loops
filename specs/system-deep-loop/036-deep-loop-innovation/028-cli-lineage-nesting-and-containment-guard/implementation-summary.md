---
title: "Implementation Summary: cli lineage nesting and containment guard"
description: "A cli-codex fan-out lineage no longer nests codex per iteration, the recursion guard now works on macOS, and a tracked edit reverted by write containment survives as a git-applicable patch."
trigger_phrases:
  - "cli lineage nesting"
  - "containment reverted patch"
  - "recursion guard macos"
  - "in-process lineage execution"
  - "implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/028-cli-lineage-nesting-and-containment-guard"
    last_updated_at: "2026-09-02T18:40:00Z"
    last_updated_by: "claude-code"
    recent_action: "Reconciled the task ledger against the two landing commits"
    next_safe_action: "None; packet complete. 21 unevidenced checklist rows stay open in tasks.md"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-02-040-cli-lineage-nesting-and-containment-guard"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The recursion guard failed because its ancestry layer read /proc, which macOS does not have"
      - "A sibling-phase run is exempt from attribution only while its loop lock is live"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | system-deep-loop/036-deep-loop-innovation/028-cli-lineage-nesting-and-containment-guard |
| **Completed** | 2026-09-02 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A codex fan-out lineage that followed the workflow YAML to the letter spawned a second codex for every iteration, and the sandbox killed each one before it could think. Five iterations, zero findings, thirty minutes gone. At the same time, an operator edit to a tracked file during a live lineage was reverted with no record. Both failure modes are now closed at the runtime, and the rules that prevent them are written into the skills that own them.

### In-process execution for CLI lineages

The driver's lineage prompt now opens with an execution directive for every non-native lineage kind: this process is the executor, every iteration runs in this session, and any nested CLI dispatch is a failure of the lineage. Both auto workflow YAMLs carry the same rule at the codex executor step, and the embedded dispatch script refuses before it spawns when the process is already a lineage or a codex session. The refusal happens before any receipt is written, so it can never be mistaken for a real attempt.

### A recursion guard that works on macOS

The existing guard had an env-independent ancestry layer that only read `/proc`, which does not exist on macOS, and its env-based layers never reached the codex child. The ancestry reader now falls back to `ps`, a fan-out lineage layer checks `SPECKIT_FANOUT_LINEAGE_ID` first, and a refused dispatch returns a distinct exit code with an actionable message instead of an opaque sandbox error.

### Concurrent runs in sibling phases

The driver now discovers every other lineage directory under the same top-level packet that holds a live loop lock, meaning a fresh heartbeat and a living owner process, and treats it as that run's write surface, the same way it already treats sibling lineages of its own run. Discovery runs before the pre-dispatch snapshot and again before the check, so a run that was live at dispatch and finished mid-iteration stays exempt. A directory with no lock, or a stale one, is still a breach. Measured cost is about 100 ms on the repository's largest packet.

### Recoverable containment reverts

Before write containment restores a tracked file from HEAD, it saves the diff to `containment-reverted/` inside the lineage's artifact directory. The containment event names the patch, the result carries a recovery hint, and the driver's fatal message appends it. The fail-closed revert is unchanged; the edit just stops being lost.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modified | In-process execution directive in `buildLoopPrompt`; recovery hint appended to the containment failure message; live-lock discovery of other runs under the same packet fed into containment attribution |
| `.opencode/skills/system-deep-loop/runtime/tests/fanout-loop-prompt-in-process.test.ts` | Created | Directive present for CLI kinds, absent for native, containment sentence retained |
| `.opencode/commands/deep/assets/deep-research-auto.yaml` | Modified | Pre-dispatch in-process rule and pre-spawn refusal at the cli-codex step |
| `.opencode/commands/deep/assets/deep-review-auto.yaml` | Modified | Same rule and refusal at the cli-codex step |
| `.opencode/commands/deep/assets/compiled/deep-research.contract.md`, `deep-review.contract.md`, `deep-ai-council.contract.md` | Modified | Recompiled contracts with the new source digests |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` | Modified | `ps` ancestry reader, fan-out lineage guard layer, refusal exit code and message |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/executor-audit.vitest.ts` | Modified | Seven guard cases: nested refused before spawn, clean top-level proceeds |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts` | Modified | Patch capture before revert, `revertedPatchPath` and `revertedPatchError` on the event, `recoveryHint` on the result |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts` | Modified | Five patch cases including a `git apply` round trip, plus seven concurrent-run cases covering live, absent and stale locks |
| `.opencode/skills/cli-external-orchestration/cli-codex/SKILL.md` | Modified | Rule 18: never dispatch codex from inside a codex session, with the grep-able symptom |
| `.opencode/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md` | Modified | CLI lineage executes in-process; no tracked-file edits during a live lineage; a sibling-phase run is exempt only while its lock is live |
| `.opencode/skills/system-deep-loop/SKILL.md` | Modified | One NEVER line pointing at both rules |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Five Opus leaf agents worked the four streams in parallel on disjoint files in a detached scratch worktree pinned to the landing branch's commit, because the landing worktree had two live research lineages whose containment guard would have reverted every tracked edit. The orchestrator verified each result against the files on disk, applied the driver's one-line recovery-hint change the containment agent recommended, corrected one documentation sentence against the guard's real behavior, recompiled the three command contracts whose source digests the edits changed, then applied the whole diff onto `branches/017-memory-decommission` once both lineages had exited.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix the prompt, the YAML and the guard, not just one | The prompt directive was already on disk when the relaunched lineage ran and the leaf still needed the mechanical refusal to be safe, so prose alone is not enforcement |
| Refuse before any receipt is written | A refusal that leaves an INTENT receipt looks like a real attempt in the audit trail and invites a redispatch that would fail the same way |
| Keep the fail-closed revert and add a patch, rather than skip the revert | The guard cannot tell an operator edit from a leaf's out-of-scope write, so it must still revert, and a saved diff makes that reversible instead of destructive |
| Return a distinct exit code from the guard | Every other failure class returned zero, which is the opaque contract that let the nested spawn look like a slow model |
| Land on the memory-decommission branch through a scratch worktree | The operator chose that branch, and its worktree could not accept tracked edits while lineages were live |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npx vitest run tests/fanout-loop-prompt-in-process.test.ts tests/unit/executor-audit.vitest.ts tests/unit/write-containment.vitest.ts tests/unit/check-contract-drift.vitest.ts tests/unit/render-command-contract.vitest.ts --no-coverage` on branch 017 | PASS, 5 files, 97 tests, exit 0 |
| `node -e "require('./scripts/fanout-run.cjs')"` on branch 017 | PASS, module loads |
| YAML parse of both edited auto assets with js-yaml | PASS |
| `npm run typecheck` in the runtime | 51 errors, identical set to the pre-change baseline, all in `lib/legacy-projections/**` and `lib/mode-append-gateway/**`, none in changed files |
| Full runtime suite, clean baseline in the untouched main checkout | 1 failed, 2506 passed: the pre-existing `deep-review-sealed-artifacts` failure |
| Full runtime suite on the scratch worktree before contract recompile | 5 failed: the baseline failure plus 4 contract-drift assertions, cleared by recompiling the three command contracts |
| Full runtime suite on branch 017 before the concurrent-run change | PASS, 153 files, 2524 tests passed, 7 skipped, 0 failed, exit 0 |
| Full runtime suite on branch 017 with the concurrent-run change | PASS, 153 files, 2531 tests passed, 0 failed, per the Progress table in `goal.md` |
| `validate.sh --strict` on this packet | PASS, errors 0 |
| Task ledger reconciled against commits `2c2687e260` and `54e65e115a` on 2026-09-05 | 26 of 47 tasks.md items confirmed with evidence, 21 left open, see tasks.md |

The packet is complete and the ledger is not, and those are different facts. Closure is decided by `acceptance-criteria.md`, whose ten rows are all `Met` and whose closure statement reads `Closeable: Yes`. The 21 rows still open in `tasks.md` are generic checklist boilerplate that nobody recorded an observed result for, so they are left unticked rather than back-filled from an assumption. `completion_pct` tracks the closure gate, not the ledger.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Exemption for another run depends on its lock being live.** A run that crashed without releasing its lock is exempt until the heartbeat ages past twice its TTL or its owner process dies, whichever the liveness check sees first.
2. **The `ps` ancestry layer fails open inside a sandbox that blocks `ps`.** The env, stack and lineage layers remain the defense in that case, and the YAML instruction still tells the leaf to run in-process.
3. **Env propagation into codex children is inferred, not confirmed.** The evidence is that the child never saw the dispatch stack; confirming needs one run with `-c shell_environment_policy.inherit=all` printing the environment from inside a leaf.
<!-- /ANCHOR:limitations -->
