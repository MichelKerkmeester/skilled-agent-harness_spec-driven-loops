---
title: "Planning Research: v4.0.0.3 review remediation"
description: "Phase 0 research for the v4.0.0.3 remediation: four parallel explorers re-located every cited defect at HEAD b5353b1f7a, mapped producers, consumers and tests, and found the AGENTS.md byte budget that constrains F1."
trigger_phrases:
  - "v4.0.0.3 remediation research"
  - "remediation explorer findings"
  - "agents md byte budget"
importance_tier: "normal"
contextType: "research"
---
# Planning Research: v4.0.0.3 review remediation

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-speckit/033-system-speckit-v4/069-v4-0-0-3-review-remediation |
| **Date** | 2026-10-06 |
| **Tree** | `worktrees/090-deep-review-okf-adoption` at `b5353b1f7a` |
| **Method** | Four read-only explorer agents (architecture, feature, dependency, test), then lead spot checks |
| **Inputs** | `../../068-v4-0-0-3-release-deep-review/review/review-report.md`, `../../068-v4-0-0-3-release-deep-review/review/luna-halt-analysis.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:investigation-report -->
## 2. INVESTIGATION REPORT

### Request Summary
Before planning the fixes, confirm that every defect the 068 review cites still reads as described, and map what each fix touches.

### Current Behavior
Every cited defect still reproduces on read at `b5353b1f7a`. That commit only added the 068 packet docs. Four citations have drifted by a few lines, and one finding (R-14) is already fixed.

### Key Findings

**Drifted citations, corrected:**
- `state_write_protocol` starts at `deep-review-auto.yaml:97`, not `:100`.
- `buildLoopPrompt` starts at `fanout-run.cjs:1442`. The steer line is `:1583-1585`.
- The R-21 stem floor is the inline literal `>= 4` at `check-repo-rules.cjs:230` and `:241`. `:41` opens `STOP_WORDS`.
- The R-19 twin is at `.skilled/skills/system-deep-loop/deep-improvement/scripts/shared/rubric-guard.cjs`, not under spec-kit hooks. The lead counted one NUL byte in each file.

**Already resolved:**
- R-14: phase 68's commit `b5353b1f7a` re-derived the 033 graph metadata, and strict validation of the parent passed then. 033 fails strict right now only because the scaffold for this phase edited `033/spec.md`. It is re-derived at close.

**Still open, lead-verified:**
- R-09: `generate-trigger-index.mjs --check` exits 1, and `.skilled/changelog/skilled/v4.0.0.3.md` is still stale (`added: doctor update command; removed: doctor command split`).
- AGENTS.md delivery prefix: `check-rule-copies.js` exits 0. Its last anchor, `#### Blast-Radius Management`, ends at byte 16,359 of the 16,384 Devin cut, which leaves 25 bytes. AGENTS.md is 26,811 bytes.

**R-01 (review events):**
- Six of the eight rejected rows have reserved stems (`deep-review-ledger-types.ts:596-614`). `config_warning` and `lock_released` have none.
- Research keeps its equivalents off the gateway through `pinned_bookkeeping` with a print-only `bookkeeping_log` directive (`deep-research-auto.yaml:110-114`).
- The review reducer reads these rows back from the state log (`reduce-state.cjs:416`, `:507-515`, `:1076-1100`, `:1297`), so print-only is not enough for the six.
- The projection in `deep-review-state-contract.ts:171-181` drops `signals` and `blockers`, and maps `pause_recorded` and `recovery_started` to their stem names (`:223-231`).
- `deep-review-confirm.yaml` carries more legacy rows than the report lists: `dry_run_halt`, `pivot_confirm_accepted`, `manualStop`, `pivot_override_accepted` and `schema_advisory`.

**R-02 (Devin write):**
- `.devin/hooks.v1.json` is generated from `runtime-mirrors/hook-registry.json` by `sync-hook-registrations.cjs`. Pre-commit (`pre-commit:248`) and CI run `--check` against it.
- The post-edit hook has its own allowlist, `DEVIN_EDIT_TOOLS = new Set(['edit'])`, at `.skilled/hooks/post-edit-quality/devin/post-edit-quality.cjs:30`. Its comment says the tool name is "unconfirmed live".

**R-03 (stale-lock reclaim):**
- `scripts/loop-lock.cjs` imports `../lib/deep-loop/loop-lock.ts` through tsx (`:142`). There is no build step, so the fix lives in the `.ts` file alone.
- `loop-lock.vitest.ts` already injects syscalls with `vi.doMock('node:fs')` (`:213-272`, `:487-531`), which is the pattern a two-reclaimer test needs.

**F1 to F8:**
- The stale-lock note F5 rewrites appears verbatim in six workflow YAMLs and `spec-check-protocol.md:69`.
- The config-status write R-20 and F7 name also appears at `deep-review-confirm.yaml:1821` and `deep-research-auto.yaml:2218`, against the read-only rule in `deep-research/SKILL.md:356` and `state-format.md:98`.
- `step_stage_artifact_dir` runs `git add` in three YAMLs, and none skips it under fan-out.
- Retry classes live in `runtime/scripts/lib/cli-guards.cjs:25-35,170-204`, not in `fanout-run.cjs`.
- No helper reads a lineage's stored session ID. `reduce-state.cjs:2108-2125` reads the same config field.
- `fanout-run.vitest.ts:1032` pins the "Copy that directory path verbatim" sentence that F6 rewrites.

**Advisory P2s:**
- **R-04 and R-08.** No helper anywhere expands bundled short flags, and the two sk-git parsers share no module. A new scanner is the move, and its smallest home is `git-rule-checks.mjs`, which the gate can import.
- **R-05.** No stem exists for `salvaged_from_stdout`, and no runtime script calls the gateway as a subprocess. The only in-process API is `appendModeEvent` (`lib/mode-append-gateway/index.ts`).
- **R-06.** Validation errors use one shape, `{ id, message }`, and every id must be listed in `commitRuleIds` or `prRuleIds`.
- **R-07.** The drain pattern to copy is `deep-review-auto.yaml:2292-2319`.
- **R-17.** The multi-key session fallback to copy is `system-spec-gate.js:60-70`.

### Recommendations
- R-01: use the reserved stems for six rows and pin two (ADR-003).
- R-03: read the record back after the rename (ADR-002).
- F1: write it byte-neutral and keep F3's authority wording in the prompt (ADR-001).
- R-05: decide the stem at implementation time. If a gateway route needs new stems in both mode schemas, waive R-05 with an ADR. Its only live consumer is one count (`fanout-merge.cjs:966`), and its feature catalog entry describes the direct write as intended (`feature-catalog/state-safety/jsonl-lock-held-merge.md:28`).
<!-- /ANCHOR:investigation-report -->

---

<!-- ANCHOR:test-inventory -->
## 3. TEST INVENTORY

| Area | Suite to extend | Command (working directory) |
|------|-----------------|-----------------------------|
| Gateway, loop lock, fan-out | `tests/unit/append-mode-event-cli.vitest.ts`, `loop-lock.vitest.ts`, `fanout-run.vitest.ts`, `fanout-salvage.vitest.ts` | `npx vitest run tests/unit/<file>` (`.skilled/skills/system-deep-loop/runtime`) |
| Devin spec gate | `tests/hooks/spec-gate-devin.test.mjs`, `spec-gate-core.test.mjs` | `node --test tests/hooks/*.test.mjs` (`.skilled/skills/system-spec-kit/runtime`) |
| Hook registry | `runtime/cli/tests/hook-registration-sync.vitest.ts` | `npm test` (`.skilled/skills/system-spec-kit/runtime/cli`) |
| sk-git | `message-contract.test.mjs`, `git-rule-checks.test.mjs` | `node --test .skilled/skills/sk-git/scripts/lib/<file>` (repo root) |
| Goal, injection screen | `goal-core.test.cjs`, `classifier-screen-fetched-text.test.mjs`, `.opencode/plugins/tests/classifier-injection-screen.test.cjs` | `node --test <file>` (repo root) |
| sk-doc scripts | `test_validator.py`, `test_check_repo_rules.py`, `test-cite-drift-scan.mjs` | `bash .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh` (repo root) |
| validate.sh | `runtime/cli/tests/validate-skip-switch.vitest.ts`, `test-validation.sh` | `npm run test:validation` (`.skilled/skills/system-spec-kit/runtime/cli`) |
| Rule copies | `check-rule-copies.js` | `node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js` (repo root) |

Open discovery questions for implementation:
- No runner or CI step picks up `test-cite-drift-scan.mjs`, because its name matches no runner glob.
- `install-guide-contract.test.cjs:16-19` points at a `validate_document.py` path that does not exist.
<!-- /ANCHOR:test-inventory -->

---

<!-- ANCHOR:work-package-findings -->
## 4. FINDINGS FROM WORK-PACKAGE DESIGN

Seven read-only design agents drafted one work package per workstream on 2026-10-06. The lead re-ran or re-read the claims below; each one changed the plan.

**R-22 (new, P1): the workflow loop lock never excludes a second run.**
- **Root cause.** All six deep-loop workflows acquire the lock without `--owner-pid` (`deep-review-auto.yaml:297`, `deep-review-confirm.yaml:279`, `deep-research-auto.yaml:272`, `deep-research-confirm.yaml:292`, `deep-ai-council-auto.yaml:120`, `deep-ai-council-confirm.yaml:127`). `resolveOwnerPid` therefore records the CLI's own `process.pid` (`loop-lock.cjs:81-84`), and that process exits at once.
- **Why the lock reads as stale.** `isStaleLoopLock` treats a dead owner as stale (`loop-lock.ts:563-569`), and no workflow calls `loop-lock.cjs refresh`.
- **Lead probe.** On a scratch lock file, `acquire` returned `acquired:true`. `status` returned `stale:true, alive:false` within milliseconds. A second `acquire` 160 ms later returned `acquired:true` with `reclaimed` naming the first run.
- **Consequence for the lock rule.** Today the packet lock gives no mutual exclusion between runs at all.
- **Consequence for fan-out.** `fanout-run.cjs:545` `holdsLiveLoopLock`, which write containment uses to detect live foreign runs, never sees one.

**F5 changes from a permission to a correction.** Acquire already reclaims a stale lock itself (`loop-lock.ts:457-476`). The note "stale-lock override is confirm-only or explicit recovery-only" describes no step that exists, and Luna stopped because it read it literally. Under ADR-004, every lock note states what acquire does, in both modes.

**F8's lock reclaim is unnecessary.** A respawned lineage's own acquire already reclaims a stale lock. F8 keeps only the `needs_input` classification. This is the "build nothing" move: the existing acquire meets the need.

**R-16's symptom is misdescribed in the review.** With no citation in range, `runAdvise` returns before printing (`classifier-cite-drift-scan.mjs:911`), so the scan prints nothing at all rather than `checked=0 flagged=0 unchecked=0`. The fix stands, because the summary still omits out-of-range citations.

**A second sk-git parse bug.** `parseGitCommand('git commit -s -m "wip"')` gives flags `["-s"]` and paths `["wip"]` (lead probe). `VALUE_FLAGS` (`git-rule-checks.mjs:39-43`) treats `-s` and `-u` as value flags for every subcommand, and `BARE_IN_SUBCOMMAND` (`:47`) has no `commit` entry. WP-D fixes it with R-08.

**`validate-message.mjs:45` carries R-18's unguarded flag call too.** There it fails closed, behind commit-msg, pre-push and CI. WP-D takes it.

**R-01 needs additive schema fields.** The reserved stems' closed field sets (`deep-review-ledger-schema.ts:654-659`) have no slot for:
- the graph `signals` and `blockers`, which the reducer scores from (`reduce-state.cjs:1053-1056`);
- the blocked-stop gate detail and its prose hint.

ADR-003 is amended to add them as optional data fields.

**Three confirm-only pivot rows also exit 1 today.** `pivot_confirm_accepted`, `manualStop` and `pivot_override_accepted` (`deep-review-confirm.yaml:1002,1013,1035,1043`) have no review stem. WP-A pins them as bookkeeping, which keeps today's state-log content; pivot stems go to follow-ups.

**The restart row lands before the run opens.** The restart append (`deep-review-auto.yaml:341`) runs before `step_create_state_log` writes `run_initialized` (`:463`). In stem form it would precede the run. WP-A moves it to directly after that step.

**Devin docs still name `^edit$` alone:**
- `runtime/hooks/lib/spec-gate/README.md:49`
- `runtime/hooks/devin/README.md:60,63`
- `.devin/SYNC.md:88`

WP-B updates them.
<!-- /ANCHOR:work-package-findings -->
