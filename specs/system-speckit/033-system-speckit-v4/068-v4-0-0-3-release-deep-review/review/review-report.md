---
title: "Deep Review Report: v4.0.0.2..v4.0.0.3 (multi-lineage synthesis)"
trigger_phrases: []
---

# Deep Review Report: v4.0.0.3 release (multi-lineage synthesis)

<!-- Machine-owned markers preserved for reducer re-runs -->
<!-- ANCHOR:review-dimensions -->
Dimensions reviewed: correctness, security, traceability, maintainability
<!-- /ANCHOR:review-dimensions -->

**Verdict: CONDITIONAL**

0 P0, 3 P1, 18 P2 active after deduplication and verification. Strongest restriction applies: no confirmed P0, three confirmed P1s, so the release is CONDITIONAL.

## 1. Executive Summary

- **Verdict:** CONDITIONAL. `hasAdvisories: true` (18 active P2).
- **Active counts:** P0 = 0, P1 = 3, P2 = 18.
- **Scope:** every file added, modified or renamed in `v4.0.0.2..v4.0.0.3` that still exists (633 commits, 1,997 paths in `goal-file-manifest.txt`; `specs/**`, archives, `dist/`, lockfiles, changelogs and fixtures excluded). HEAD `364d74b502` equals the `v4.0.0.3` tag commit (`git rev-parse 'v4.0.0.3^{commit}'`).
- **Inputs:** 25 raw findings from four productive lineages (24 in the first-wave merged registry, 1 in the luna-wave registry). Every iteration file was read. The iteration files carry no finding that is missing from the deltas and registries; they add only below-threshold notes, which are recorded in Deferred Items.
- **Dedup:** 25 raw findings reduce to 21 unique defects. Four merges: luna-max F002 and swe2 sw2m-P2-001 fold into sw2m-P1-001 (same unroutable review event rows), swe2 sw2m-P2-002 folds into deepseek F007 (same config wording gap), and sw2m-P2-009 folds into sw2m-P2-005 (same unguarded loader).
- **Verification outcome on the 8 raw P1s:** 3 Confirmed at P1, 5 Downgraded to P2, 0 Refuted. Two P1 provenance claims were wrong and are corrected below: both confirmed P1s that swe2 called release-introduced already existed at `v4.0.0.2`.
- **Headline:** the three blocking defects are (1) every legacy `type:"event"` row the review workflow emits is rejected by the append gateway, on the default convergence path every iteration; (2) the Devin runtime's `write` tool bypasses the spec gate and post-edit quality; (3) two concurrent stale-lock reclaimers can both hold the deep-loop packet lock. All three are carried into the release, not introduced by it, but each sits in a seam the release reworked and shipped.

## 2. Planning Trigger

`/speckit:plan` **is required** for the three P1s. The P2s are advisories that can ride the same remediation packet or a routine release tail.

```json
{
  "label": "Planning Packet",
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": true,
  "activeFindings": { "P0": 0, "P1": 3, "P2": 18 },
  "remediationWorkstreams": [
    "WS-1 (required, R-01): give the review gateway a route for the workflow's type:event rows (stem-form directives or a review upcaster/bookkeeping pin like research has), so graph_convergence, blocked_stop, resumed, restarted, userPaused, stuckRecovery, config_warning and lock_released stop exiting 1",
    "WS-2 (required, R-02): add write to DEVIN_TOOL_MAP and widen the Devin PreToolUse spec-gate and PostToolUse post-edit-quality matchers to ^(edit|write)$",
    "WS-3 (required, R-03): make tryReclaimStaleLoopLock verify the renamed record is the stale holder it observed and restore an unverified fresh lock, or engage hostLocalSingleFlight from the acquire CLI; add a two-reclaimer interleaving test",
    "WS-4 (advisory): sk-git argv parsing, one shared scanner that expands bundled short flags (R-04, R-08), reject over-cap messages instead of truncating (R-06), move setFlagsFromString inside the guard (R-18)",
    "WS-5 (advisory): deep-loop runtime hygiene, route the salvage event through the gateway (R-05), drain or drop the opencode recovery-baseline staging (R-07), fix the nine playbook test paths (R-15), restate the config read-only rule (R-20)",
    "WS-6 (advisory): release-tail derived artifacts, regenerate the trigger index (R-09), re-derive the 033 phase graph metadata (R-14), escape the raw NUL bytes (R-19)",
    "WS-7 (advisory): advisory and contract completeness, R-10, R-11, R-12, R-13, R-16, R-17, R-21"
  ],
  "specSeed": "Remediation packet under specs/system-speckit/033-system-speckit-v4/ for the v4.0.0.3 follow-up. Scope is the three P1 workstreams (WS-1..WS-3) as required and WS-4..WS-7 as advisory. This report's registry is the closure list.",
  "planSeed": "Phase 1: WS-1, WS-2, WS-3, each with a regression test that fails before the fix. Phase 2: WS-4 and WS-5. Phase 3: WS-6 and WS-7 as one documentation and derived-artifact batch.",
  "findingClasses": ["cross-consumer", "race-condition", "instance-only", "class-of-bug", "UNKNOWN"],
  "affectedSurfacesSeed": [
    ".skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs",
    ".skilled/commands/deep/assets/deep-review-auto.yaml",
    ".skilled/commands/deep/assets/deep-review-confirm.yaml",
    ".devin/hooks.v1.json",
    ".skilled/skills/system-spec-kit/runtime/hooks/devin/spec-gate-enforce.mjs",
    ".skilled/skills/system-deep-loop/runtime/lib/deep-loop/loop-lock.ts",
    ".skilled/skills/system-deep-loop/runtime/scripts/loop-lock.cjs",
    ".skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs",
    ".skilled/skills/sk-git/scripts/lib/git-rule-checks.mjs",
    ".skilled/skills/sk-git/scripts/lib/message-contract.mjs",
    ".skilled/skills/system-deep-loop/runtime/scripts/fanout-salvage.cjs",
    ".skilled/skills/system-spec-kit/runtime/data/trigger-index.json"
  ],
  "fixCompletenessRequired": false
}
```

`findingClasses` carries `UNKNOWN` because the swe2-max deltas did not record a `findingClass` for their findings; it was not inferred from prose.

## 3. Active Finding Registry

Ranked by severity, then by blast radius. "Lineages" names every lineage that reported the defect in any wording. "Verification" is this synthesis's own check, not the lineage's.

| Rank | Sev | Source IDs | File:line or commit | Failure scenario (one line) | Lineages | Verification |
|---|---|---|---|---|---|---|
| R-01 | P1 | sw2m-P1-001, luna-max F002, sw2m-P2-001 | `.skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:442-463`; directives at `.skilled/commands/deep/assets/deep-review-auto.yaml:332,341,625,641,784,1010,1018,2370` | A default `stopPolicy: convergence` review run appends `graph_convergence` every iteration, the gateway throws "Unrecognized event format", exits 1 (not the declared halt code 2), and the row never reaches the state log the reducer reads at `reduce-state.cjs:1076`. | swe2-max, luna-max | **Confirmed P1.** Read the classifier and exit mapping; `stopPolicy` default is `convergence` (`deep-review-auto.yaml:604`). Provenance corrected: carried from `v4.0.0.2`, which already had the same contract and directives and rejected every legacy review row; the release added only the `type:"iteration"` passthrough. |
| R-02 | P1 | sw2m-P1-005 | `.skilled/skills/system-spec-kit/runtime/hooks/devin/spec-gate-enforce.mjs:7`; `.devin/hooks.v1.json:103,135` | A Devin agent creates a file with the `write` tool; the `^edit$` matcher never fires and `DEVIN_TOOL_MAP` has no `write` entry, so Gate 3 enforcement and post-edit quality are skipped for whole-file writes. | swe2-max | **Confirmed P1.** Read the map and matchers; `devin-tools.md:373` documents separate `edit` and `write` tools; the core gate's `DENY_CAPABLE_TOOLS` includes `write`, so only the adapter drops it. Cursor maps `Write` correctly. Provenance corrected: both files existed with the same gap at `v4.0.0.2`; the release modified but did not create `hooks.v1.json`. |
| R-03 | P1 | deepseek F002 | `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/loop-lock.ts:298-315` (rename at `:301`) | Two acquirers read the same stale holder; A renames it aside and links its fresh lock, then B's rename moves A's fresh lock aside and B links its own, so both return `acquired: true` and two runs write one packet. | deepseek-flash-max | **Confirmed P1.** Traced the interleaving through `writeLoopLockExclusive` (`:265-286`); `loop-lock.cjs` never passes `hostLocalSingleFlight`; the loop lock is not bound to the fenced ledger, so nothing behind it catches a double holder. The reclaim body is unchanged since `v4.0.0.2`. |
| R-04 | P2 | sw2m-P1-003 | `.skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs:172-178` | `git commit -am "wip"` passes the PreToolUse gate unchecked and is only refused later by `commit-msg`, after staging. | swe2-max | **Downgraded P1 to P2.** Reproduced by executing `evaluateCommand`: `-am`, `-sm`, `-qm` allowed, `-m` and `-a -m` blocked. Downgraded because the gate is a declared fail-open early layer and `commit-msg`, `pre-push` and CI still enforce the same contract, so no bad message lands. |
| R-05 | P2 | deepseek F001 | `.skilled/skills/system-deep-loop/runtime/scripts/fanout-salvage.cjs:170` | A salvaged lineage is retried; the next gateway append replaces the projection, the `salvaged_from_stdout` row disappears, and the fan-out attribution table reports `Salvaged 0`. | deepseek-flash-max | **Downgraded P1 to P2.** Confirmed the raw `mergeJsonlUnderLock` write and the replace branch in `shadow-projection-store.ts:540-577`. Downgraded because the recovered iteration file is written outside the state log and survives; the only live consumer is the count at `fanout-merge.cjs:966`; and `check-direct-append.cjs` reports `not-enforced` under the default `legacy_authoritative` state, so the guard-violation impact is latent. Pre-existing at `v4.0.0.2`. |
| R-06 | P2 | luna-max F001 | `.skilled/skills/sk-git/scripts/lib/message-contract.mjs:427` (cap at `:31`; PR body at `:627`) | A commit message over 200,000 characters has only its prefix validated, so a forbidden trailer or a vendor-matching trailer value after the cut passes `commit-msg`, `pre-push` and CI. | luna-max | **Downgraded P1 to P2.** Truncation confirmed on read. Downgraded because the precondition is a 200,000-character message, and `prepare-commit-msg` strips the forbidden `Co-Authored-By:` and `Claude-Session:` keys from the full message for every local commit with hooks installed; what survives is a stamper-skipped commit or a value-pattern match on another trailer key. |
| R-07 | P2 | sw2m-P1-002 | `.skilled/commands/deep/assets/deep-review-auto.yaml:1299,1396-1411` | Each single-executor cli-opencode dispatch writes `deep_review.recovery_baseline` into a `mktemp` dir that nothing drains, then exits; the ledger never receives it and the temp dir leaks. | swe2-max | **Downgraded P1 to P2.** Confirmed no drain follows `process.exit(...)`; confirmed the `v4.0.0.2` drain lived in the codex block where `EVENT_DIR` was never set, so it was already dead. Downgraded because nothing reads the baseline: the reducer treats the stem as a no-op (`deep-review-reducer.ts:681,1401,1610`) and no recovery path reads `recoveryBaselineCommit`. |
| R-08 | P2 | sw2m-P1-004 | `.skilled/skills/sk-git/scripts/lib/git-rule-checks.mjs:89-115`, `:170` | `git commit -am "msg"` with untracked files present: `-am` fails `has(p.flags, '-a')`, so `commit-scope-drops-untracked` (the check this module was built for) stays silent, and the message text lands in `paths`. | swe2-max | **Downgraded P1 to P2.** Confirmed on read, plus a gap the lineage missed (the silent `-am` miss in the motivating check). Downgraded because every check is warn-only and fail-open, and the source is unchanged in the range (`git diff --stat` empty; only its test changed by one line). |
| R-09 | P2 | deepseek F004 | `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` vs `.skilled/changelog/skilled/v4.0.0.3.md`; last rebuild `903c983c39` | A Gate 1 lookup for `doctor update command` misses the release's own changelog entry, while the retired phrase `doctor command split` still returns it. | deepseek-flash-max | **Confirmed P2 (executed).** `generate-trigger-index.mjs --check` exit 1, changelog listed stale (`added: doctor update command; removed: doctor command split`); index blob identical at tag and HEAD. |
| R-10 | P2 | sw2m-P2-005, sw2m-P2-009 | `.skilled/skills/sk-doc/shared/scripts/validate_document.py:1607-1655` | A malformed edit to `frontmatter-values.json` crashes every `validate_document.py` run with a traceback, while spec-kit's helper (`check-frontmatter-values-helper.cjs:100-107`) degrades the same input to exit 2 and a warning. | swe2-max | **Confirmed P2.** Only `FileNotFoundError` is caught; `values['contextType']` and `lists[...]['canonical']` are unguarded. |
| R-11 | P2 | sw2m-P2-007 | `.skilled/hooks/goal/lib/goal-core.cjs:592-606` (`DEFAULT_MAX_EVIDENCE_CHARS = 1200` at `:63`) | A transcript states a failing P0 test early and ends with a conclusive summary; the verifier judges only the last 1,200 characters and returns `met`. | swe2-max | **Confirmed P2.** The code comment itself concedes earlier blockers are never seen. |
| R-12 | P2 | LUNA-CODEX-02-P2-001 | `.skilled/hooks/classifier-injection-screen/lib/classifier-screen-fetched-text.mjs:106` | A fetched page that is one huge minified line stays one section, is split and copied before the 20-second budget starts, and is sent whole as stdin to each classifier call, stalling the hook. | luna-codex | **Confirmed P2.** Sectioning bounds lines only (`cutSections`, `prepareSections`); no byte cap exists in code or README. |
| R-13 | P2 | deepseek F003 | `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:386-388` | A numbered phase that lost both `spec.md` and `description.json` but still has `plan.md` is skipped silently, and the parent prints `RESULT: PASSED`. | deepseek-flash-max | **Confirmed P2 (latent).** Read the predicate; the lineage's tree walk found only artifact-only matches today. |
| R-14 | P2 | deepseek F006 | `specs/system-speckit/033-system-speckit-v4/graph-metadata.json` (`derived.source_fingerprint`) | A strict validation of the 033 phase folder on the tagged tree fails on `SOURCE_FINGERPRINT_MISMATCH`. | deepseek-flash-max | **Carried on lineage evidence, not re-run.** The lineage executed the checker and resolver; this synthesis did not re-execute them. Pre-existing debt the release touched once (`01162dfe43`). |
| R-15 | P2 | deepseek F008 | `.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/fanout/fanout-salvage-recovery.md:52` and eight siblings | An operator replaying the scenario runs `cd .skilled/skills/system-spec-kit/runtime && npx vitest run ../../runtime//tests/unit/...`, which resolves to the missing `.skilled/skills/runtime`. | deepseek-flash-max | **Confirmed P2.** Line read; `.skilled/skills/runtime` absent; the test exists under `system-deep-loop/runtime/tests/unit/`. |
| R-16 | P2 | sw2m-P2-006 | `.skilled/skills/sk-doc/shared/scripts/classifier-cite-drift-scan.mjs:862`, `:983` | A doc whose citations all point at renamed paths prints `checked=0 flagged=0 unchecked=0`, indistinguishable from all clean. | swe2-max | **Confirmed P2.** Only `in_range` citations enter the pool and `unchecked` is computed over that filtered list. The feature catalog discloses the skip, so the defect is the summary line. |
| R-17 | P2 | sw2m-P2-008 | `.opencode/plugins/classifier-injection-screen.js:28-41` | A fetch under a real session buffers its advisory there; the system transform arrives without a `sessionID`, drains the empty shared bucket, and the advisory is never delivered. | swe2-max | **Confirmed P2, narrowed.** Stranding mode confirmed. The second claimed mode (a fetch buffered under the unknown bucket) is not supported: the file's own comment states `tool.execute.after` always carries a `sessionID`. |
| R-18 | P2 | sw2m-P2-003 | `.skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs:380` | On a Node build that rejects the experimental regexp flag, `setFlagsFromString` throws outside the try, `main().catch(() => process.exit(0))` swallows it, and the whole gate silently never engages. | swe2-max | **Confirmed P2.** Read; backstop hooks still enforce. |
| R-19 | P2 | deepseek F005 | `.skilled/skills/system-spec-kit/runtime/hooks/lib/completion-evidence-sentinel.cjs:318` | `rg` and `diff` treat the release-new sentinel as binary, so text search and plain diff review stop showing its content. | deepseek-flash-max | **Confirmed P2.** One NUL byte counted in the file; `file` reports `data`. The same byte in `rubric-guard.cjs:59` predates the range. |
| R-20 | P2 | deepseek F007, sw2m-P2-002 | `.skilled/skills/system-deep-loop/deep-review/SKILL.md:392` vs `.skilled/commands/deep/assets/deep-review-auto.yaml:2322-2326` | An executor following the NEVER list literally leaves a finished run's config at `running`; one following the workflow violates the contract text it was given. | deepseek-flash-max, swe2-max | **Confirmed P2.** Both lines read; the lead pre-ruled in favor of the workflow step. |
| R-21 | P2 | sw2m-P2-004 | `.skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs:41,225-242` | A Fires-when bullet saying `moved` and a router row saying `moving` do not meet (both under the 4-letter stem floor), so coverage under-counts and check 10 can false-fail the blocking corpus gate. | swe2-max | **Partly refuted, residual P2.** The headline claim is wrong: `fails` stems to `fail` and `failure` to `failur`, and `wordsMeet` joins them through the 4-letter prefix rule (replicated). The short-word residual holds. |

### P1 detail (full registry fields)

**R-01: Review gateway rejects the workflow's legacy event rows**
- Dimension: correctness. Disposition: active. Finding class: cross-consumer (luna-max), UNKNOWN (swe2-max).
- Evidence: the gateway's input branches are canonical envelope, `stem`, `event_type`, a legacy upcaster gated on `normalizedMode === 'deep-research'`, and a `type === 'iteration'` passthrough gated on `deep-review` (`append-mode-event.cjs:442`). A `{"type":"event",...}` review row reaches the throw at `:463`, maps to `RUNTIME_ERROR` and `process.exit(1)` at `:521-523`. `state_write_protocol.applies_to` binds every `append_jsonl`/`append_to_jsonl` directive to this gateway (`deep-review-auto.yaml:100`), its `refusal_handling` declares a halt only on exit 2, and its contract text says these rows are "canonical ledger events like every other record" (`:114-117`). `deep-review-confirm.yaml` carries 14 more `"type":"event"` directives. The ledger types mark `deep_review.run_resumed` as `reserved` (no writer), so there is no registered stem to rewrite the resume row to today.
- Impact: on hosts that halt on non-zero, a default run dies at the first convergence append; on hosts that continue, convergence, blocked-stop, pause, stuck-recovery, resume and restart evidence is silently absent from the state log.
- Fix: rewrite the directives in stem form against registered stems (registering `run_resumed` and peers), or give review mode the upcaster or `bookkeeping_log` pin the research workflows already have. Add a CLI test that feeds each directive's rendered row to the gateway.
- Scope proof: all eight auto-workflow call sites enumerated; classifier read end to end; `v4.0.0.2` blob compared.
- Affected surface hints: `append-mode-event.cjs`, `deep-review-auto.yaml`, `deep-review-confirm.yaml`, `deep-review-ledger-schema.ts`, `deep-review-ledger-types.ts`, `reduce-state.cjs`.

**R-02: Devin `write` tool bypasses the spec gate and post-edit quality**
- Dimension: security (enforcement gap). Disposition: active. Finding class: UNKNOWN (not recorded by the lineage).
- Evidence: `DEVIN_TOOL_MAP = { exec: 'bash', edit: 'edit' }` and an unmapped tool returns `approve()` (`spec-gate-enforce.mjs:7,25-27`); `.devin/hooks.v1.json` binds spec-gate-enforce at PreToolUse `^edit$` (`:103`) and post-edit-quality at PostToolUse `^edit$` (`:135`); `cli-devin/references/devin-tools.md:373` lists `edit` and `write` as distinct Devin tools; Cursor's twin maps `Write: 'write'`.
- Impact: on Devin, file creation and whole-file overwrite escape the Gate 3 hook entirely (advise and, under `SYSTEM_SPEC_GATE_ENFORCE=1`, deny), and no post-edit quality check runs on the written file. No later layer covers Gate 3.
- Fix: add `write: 'write'` to the map and widen both matchers to `^(edit|write)$`, regenerating `hooks.v1.json` from the hook registry if that is its source; add an adapter test with a `write` payload.
- Scope proof: config, adapter and core gate read; Cursor twin compared; Devin tool inventory cited from the repo's own reference.
- Affected surface hints: `.devin/hooks.v1.json`, `runtime/hooks/devin/spec-gate-enforce.mjs`, `hooks/post-edit-quality/devin/`, `runtime/cli/runtime-mirrors/hook-registry.json`.

**R-03: Stale-lock reclaim can hand two runs the same packet lock**
- Dimension: security (mutual exclusion). Disposition: active. Finding class: race-condition.
- Evidence: `tryReclaimStaleLoopLock` renames whatever is at `lockPath` (`loop-lock.ts:301`) and republishes without re-reading the claimed record; the inline comment's "two reclaimers can never both end up holding the lock" holds only while both race on the same stale inode. `acquireLoopLockFileOnly` (`:454-478`) reaches reclaim after a stale read that can be arbitrarily old. The host-local single-flight path exists (`:600-603`) but `scripts/loop-lock.cjs` never sets `hostLocalSingleFlight`.
- Impact: two review runs both pass `acquired=true`; the workflow's fail-closed acquire step (`deep-review-auto.yaml:297-298`) only stops on `acquired=false`.
- Fix: after the rename, read the claimed record and compare pid, nonce and heartbeat with the observed stale holder; on mismatch restore it untouched and return false. Or engage single-flight from the CLI. Add a test that interleaves two reclaimers.
- Scope proof: full lock library and CLI read; refresh and release paths confirmed to verify identity, so the gap is reclaim alone.
- Affected surface hints: `lib/deep-loop/loop-lock.ts`, `scripts/loop-lock.cjs`, `tests/unit/loop-lock.vitest.ts`, `commands/deep/assets/deep-review-auto.yaml`.

### P2 registry fields

| Rank | Dimension | Finding class | Fix recommendation | Affected surface hints |
|---|---|---|---|---|
| R-04 | correctness | UNKNOWN | Expand bundled short-flag clusters (`-am` to `-a -m`) before `optionValue`; add `-am`/`-sm`/`-qm`/`-aF` test cases. | `git-message-gate.mjs`, pi/opencode transports |
| R-05 | correctness | cross-consumer | Emit the salvage event through the gateway under a ledger stem or carry it in the delta; add a re-append test. | `fanout-salvage.cjs`, `fanout-merge.cjs`, `check-direct-append.cjs` |
| R-06 | security | class-of-bug | Reject messages over the cap with a validation error instead of slicing; same for the PR body at `:627`. | `message-contract.mjs`, `validate-message.mjs`, `commit-msg`, `pre-push`, `message-contract.yml` |
| R-07 | correctness | UNKNOWN | Drain `EVENT_DIR` through the gateway after the node block, or delete the staging and the "append the recovery-baseline commit" note. | `deep-review-auto.yaml`, `deep-review-confirm.yaml:2005` |
| R-08 | correctness | UNKNOWN | Share one argv scanner with R-04 so bundled flags resolve before flag and path classification. | `git-rule-checks.mjs`, `git-preflight-advisory.mjs` |
| R-09 | correctness | cross-consumer | Regenerate the index in the same commit as any changelog phrase edit. | `trigger-index.json`, `generate-trigger-index.mjs` |
| R-10 | correctness | UNKNOWN | Catch `JSONDecodeError`/`KeyError` and degrade to a warning like the spec-kit helper. | `validate_document.py`, `frontmatter-values.json` |
| R-11 | correctness | UNKNOWN | Scan the full transcript for blocking patterns before the tail judgment. | `goal-core.cjs` |
| R-12 | correctness | UNKNOWN | Cap bytes per section and total before sectioning. | `classifier-screen-fetched-text.mjs` |
| R-13 | correctness | instance-only | Print skipped numbered children, or skip only when the child holds artifact directories alone. | `validate.sh` |
| R-14 | correctness | cross-consumer | Re-derive the folder's graph metadata with the generate-description and backfill pair. | `specs/system-speckit/033-system-speckit-v4/graph-metadata.json` |
| R-15 | traceability | instance-only | Use `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/...` in all nine. | deep-loop and deep-review `manual-testing-playbook/fanout/` |
| R-16 | correctness | UNKNOWN | Report moved, past-end and unresolved citations as unchecked. | `classifier-cite-drift-scan.mjs` |
| R-17 | correctness | UNKNOWN | Drain the real session's bucket when the transform lacks an id, or log the strand. | `.opencode/plugins/classifier-injection-screen.js` |
| R-18 | correctness | UNKNOWN | Move `setFlagsFromString` inside a try and continue without the flag. | `git-message-gate.mjs` |
| R-19 | security | instance-only | Write the separator as the `\u0000` escape in both files. | `completion-evidence-sentinel.cjs`, `rubric-guard.cjs` |
| R-20 | traceability | instance-only | Scope the NEVER rule to review parameters and name the terminal status flip. | `deep-review/SKILL.md`, `deep-review-auto.yaml` |
| R-21 | maintainability | UNKNOWN | Lower the stem floor for `ed`/`ing` or compare unstemmed prefixes too; fix the comment if it stays. | `check-repo-rules.cjs`, `repo-rules-corpus.yml` |

## 4. Remediation Workstreams

**P0:** none.

**P1 (required before calling the release done):**
1. **WS-1, review event routing (R-01).** Highest blast radius: it fires on the default stop policy every iteration. Fix the directive shape or the gateway route, then prove it with a test per directive.
2. **WS-2, Devin write parity (R-02).** Small, local change with a direct enforcement payoff.
3. **WS-3, reclaim verification (R-03).** Read-back after rename, plus an interleaving test.

**P2 advisories (separate, non-blocking):**
- WS-4, sk-git argv and input bounds: R-04, R-06, R-08, R-18.
- WS-5, deep-loop runtime hygiene: R-05, R-07, R-15, R-20.
- WS-6, release-tail derived artifacts: R-09, R-14, R-19.
- WS-7, advisory and contract completeness: R-10, R-11, R-12, R-13, R-16, R-17, R-21.

## 5. Spec Seed

- State, in the deep-review workflow contract, which ledger stem each `append_jsonl` directive maps to, and register stems for resume, restart, pause, stuck-recovery, config-warning, graph-convergence, blocked-stop and lock-release events.
- Require per-runtime hook parity for every mutation tool a runtime exposes (Devin `edit` and `write`), checked against the runtime's own tool reference.
- Require the loop lock's reclaim path to verify identity before republishing, matching what refresh and release already do.
- Require sk-git's PreToolUse and advisory parsers to share one argv scanner that handles bundled short flags.
- Add "regenerate the trigger index" to the release-tail checklist after the last changelog edit.

## 6. Plan Seed

1. Write a failing CLI test that pipes each rendered `type:"event"` directive from both review YAMLs into `append-mode-event.cjs --mode review`; then fix routing until it passes (R-01).
2. Add a `write` payload test to the Devin spec-gate adapter; add `write` to the map and both matchers (R-02).
3. Add a two-reclaimer interleaving test to `loop-lock.vitest.ts`; implement read-back verification (R-03).
4. Add bundled-flag cases to `message-contract.test.mjs`/`git-rule-checks.test.mjs`; extract the shared scanner (R-04, R-08); replace truncation with rejection (R-06); guard `setFlagsFromString` (R-18).
5. Route or drop the salvage and recovery-baseline writes (R-05, R-07); fix the nine playbook commands and the SKILL.md wording (R-15, R-20).
6. Release-tail batch: regenerate the trigger index, re-derive 033 metadata, escape the NUL bytes (R-09, R-14, R-19).
7. Advisory batch: R-10, R-11, R-12, R-13, R-16, R-17, R-21.

## 7. Traceability Status

### Core protocols

| Protocol | Status | Evidence | Unresolved drift |
|---|---|---|---|
| `spec_code` | partial | deepseek-flash-max iterations 2, 8, 11 (43/43 replicated contract-parity checks); swe2-max iterations 1, 5; luna-max iteration 3 | R-01 (workflow contract says event rows are canonical ledger events; gateway rejects them); R-20 (SKILL.md vs workflow) |
| `checklist_evidence` | partial | luna-max iteration 3 (setup claims carry packet evidence; route-smoke `PONG` has no raw transcript in the packet); swe2-max iterations 2, 5 | No raw route-smoke transcript preserved |
| `AC_COVERAGE` | exempt | The review target is a git range, not a lifecycle-active spec folder | none |

### Overlay protocols

| Protocol | Status | Evidence | Unresolved drift |
|---|---|---|---|
| `skill_agent` | pass | swe2-max iteration 1 (leaf `type:"iteration"` record accepted and projected back unchanged) | none |
| `agent_cross_runtime` | partial | swe2-max iteration 6 (Pi and Codex generators 12/12 in sync, `.claude`/`.skilled` body parity pass); deepseek-flash-max iteration 12 (187 mirrors in sync, 31-hook registry matched); luna-codex iteration 1 (injection-screen bindings match) | R-02 (Devin `write` missing from hook wiring) |
| `feature_catalog_code` | pass | swe2-max iterations 2, 5 (leaf manifests resolve 71/71; citation-drift catalog constants match code) | none |
| `playbook_capability` | partial | deepseek-flash-max iteration 13 | R-15 (nine scenarios name an unreachable test path) |

Resource Map Coverage Gate: skipped, `resource_map_present` is false in the lineage configurations.

## 8. Deferred Items

Below the finding bar, recorded by the lineages and kept for backlog:
- `rubric-guard.cjs:59` carries the same raw NUL byte as R-19, present at `v4.0.0.2` (deepseek-flash-max iteration 6).
- `pre-commit` MIRROR_CHECKS omits the Pi sync checks; CI covers them, and the release added that CI coverage (swe2-max iteration 6).
- `agent-roster-mirror-check.cjs` calls `.codex/agents` independently authored; they are generated (swe2-max iteration 6).
- `AGENTS.md` last required anchor ends 25 bytes inside the Devin 16,384-byte cut; guarded by the rule-canary CI gate (swe2-max iterations 6, 7).
- `check-repo-rules.cjs` prefix matching can in principle award coverage to an unrelated row (false PASS); mitigated by the 0.3 floor (swe2-max iteration 7).
- `sk-prompt/README.md` version lags `SKILL.md` (3.0.0.0 vs 3.0.2.0), pre-existing (swe2-max iteration 9).
- No raw route-smoke transcript is preserved in the packet (luna-max iteration 3).

## Dimension Expansion Map

Breadth only; this section does not change the verdict or the registry.

- **deepseek-flash-max (15 iterations):** fan-out dispatch and the append gateway; reducer, convergence and synthesis close-out; locks, fencing and authority; validation engine and rules; retrieval and trigger index; spec-gate hooks; generated metadata; both cli hubs; advisor front door; cross-skill contracts; mirrors; fan-out playbooks; a final replay of both P1s.
- **swe2-max (10 iterations):** `commands/deep` workflow YAMLs; sk-git message contract and hooks; sk-doc shared scripts; hooks and plugins security across five runtimes; spec and skill contract traceability; agent mirrors; repo rules, `AGENTS.md` and `README.md`; sk-code and sk-prompt; sk-code-webflow and sk-design; sk-create leaves and the create and speckit commands.
- **luna-max (3 iterations):** `/doctor:update` release updater (no finding); sk-git message contract security; packet traceability and resume-event shape.
- **luna-codex (2 iterations):** injection-screen correctness across runtimes; classifier transport security. Its planned next pass (`.github/workflows` traceability) never ran.
- **luna-opencode (0 iterations):** no coverage.
- **Remaining frontier:** `runtime/cli/doctor/**` consumers beyond the updater, `system-spec-kit/templates/**`, `system-skill-advisor/runtime/stress-test/**`, `.skilled/commands/**` outside the deep and create/speckit assets, `.github/workflows` as a whole, and the parts deepseek listed as partial (`runtime/lib/continuity/**`, `runtime/cli/optimizer/**`, `shared/{embeddings,algorithms}`, deep-improvement scripts, deep-ai-council assets, `cli-classifier/benchmark`). Saturated directions, pivots and Council artifacts were not recorded in reducer state.

## 9. Search Ledger

*No search-depth state captured (legacy v1 record)*

Neither merged registry carries `searchCoverage`, `candidateCoverage`, `searchDebt`, `ruledOutCandidates` or `cleanSearchProof`, so `hasSearchDebt` is not asserted. The lineages' ruled-out claims are listed in the appendix as the nearest substitute.

## 10. Audit Appendix

### Convergence summary

| Lineage | Executor | Planned | Ran | Lineage verdict | Raw findings |
|---|---|---|---|---|---|
| deepseek-flash-max | cli-pi, `opencode-go/deepseek-v4.1-flash`, max | 15 | 15 (complete, `maxIterationsReached`) | CONDITIONAL | 2 P1, 6 P2 |
| swe2-max | cli-devin, `swe-2-max` | 10 | 10 (complete) | CONDITIONAL | 5 P1, 9 P2 |
| luna-max | cli-pi, `gpt-6-luna`, max | 10 | 3 (partial) | CONDITIONAL | 1 P1, 1 P2 |
| luna-codex | cli-codex, `gpt-6-luna`, max | 10 | 2 (partial) | PASS | 1 P2 |
| luna-opencode | cli-opencode, `openai/gpt-6-luna-fast`, max | 10 | 0 | none | none |
| **Total** | | **55** | **30** | **CONDITIONAL** | **8 P1, 17 P2 raw; 3 P1, 18 P2 after synthesis** |

The raw P2 total rises from 17 to 18 after synthesis because five P1s were downgraded and four duplicates were merged.

### Synthesis adjudication log

| Source ID | Raw | Final | Reason |
|---|---|---|---|
| sw2m-P1-001 | P1 | P1 (R-01) | Confirmed on default path; provenance corrected to carried |
| sw2m-P1-005 | P1 | P1 (R-02) | Confirmed; provenance corrected to carried |
| deepseek F002 | P1 | P1 (R-03) | Confirmed; no backstop |
| sw2m-P1-003 | P1 | P2 (R-04) | Reproduced, but authoritative gates still enforce |
| deepseek F001 | P1 | P2 (R-05) | Live impact is an attribution count; guard impact latent |
| luna-max F001 | P1 | P2 (R-06) | 200,000-character precondition; stamper strips forbidden keys on the full message |
| sw2m-P1-002 | P1 | P2 (R-07) | No consumer reads the baseline |
| sw2m-P1-004 | P1 | P2 (R-08) | Warn-only, fail-open, unchanged in range |
| luna-max F002, sw2m-P2-001 | P2 | merged into R-01 | Same defect, one call site and the contract text |
| sw2m-P2-002 | P2 | merged into R-20 | Same as deepseek F007 |
| sw2m-P2-009 | P2 | merged into R-10 | Same unguarded loader, framed as consumer asymmetry |
| sw2m-P2-004 | P2 | P2 (R-21), headline refuted | `fails`/`failure` do meet; short-word residual holds |
| sw2m-P2-008 | P2 | P2 (R-17), narrowed | Second loss mode contradicted by the plugin's own invariant |

Registry note: the first-wave merge flagged deepseek F001/F002 and luna-max F001/F002 as `CONTRADICTS` (`same-id-different-content`). They are not contradictions; the two lineages reused the same local IDs for four unrelated defects. All four are kept as distinct rows.

### Coverage summary

Read or executed with receipts across the four productive lineages: deep-loop runtime (fan-out, gateway, reducer, locks, fencing, authority), `commands/deep` workflows, sk-git contract and hooks, spec-kit validation, retrieval, hooks and generated metadata, sk-doc shared scripts and repo-rule checks, hooks and plugins across Claude, Codex, Devin, Cursor, OpenCode, Pi and Hermes, agent and hook mirrors, cli hubs, skill advisor, sk-code, sk-design, sk-prompt and sk-create leaves, `/doctor:update` updater, injection screen. Not covered: see the remaining frontier above.

### Ruled-out claims (selected, from the lineages)

- Fan-out merge strongest-restriction, pool settlement, Pi exit-code handling and route-proof completion checks are correct (deepseek-flash-max iteration 1).
- No command injection in executor or evaluator paths; secrets are scrubbed before durable saves; the fenced ledger rejects stale or forged fences (deepseek-flash-max iteration 3).
- Spec-gate cannot be disarmed by a crafted environment; child-session bypass requires exactly `AI_SESSION_CHILD=1` (deepseek-flash-max iteration 6).
- Advisor trust defaults to untrusted; socket dir refuses foreign or writable owners (deepseek-flash-max iteration 10).
- Release updater rejects traversal and symlinked parents; rollback is recorded before the first write (luna-max iteration 1).
- Injection-screen page text reaches the classifier as stdin, never a shell; advisory text is a fixed template (luna-codex iterations 1, 2; swe2-max iteration 4).
- Mirror "DIFFERS" signal was dialect transform, not drift: Pi and Codex generators 12/12 in sync (swe2-max iteration 6).
- `SPECKIT_SOURCE_TAG_CUTOFF` does not exempt this packet (swe2-max iteration 5).

### Sources reviewed by this synthesis

Registries: `review/deep-review-findings-registry.json`, `review/luna-wave/deep-review-findings-registry.json`, both `fanout-attribution.md`, both `orchestration-summary.json`, all five per-lineage registries. Narratives: all 30 iteration files, `lineages/deepseek-flash-max/review-report.md`, `lineages/swe2-max/review-report.md`, every lineage `deltas/`. Code verified at the cited lines: `append-mode-event.cjs`, `deep-review-auto.yaml`, `deep-review-confirm.yaml`, `deep-review-reducer.ts`, `deep-review-ledger-types.ts`, `git-message-gate.mjs` (executed), `git-rule-checks.mjs`, `message-contract.mjs`, `prepare-commit-msg`, `.devin/hooks.v1.json`, devin and cursor `spec-gate-enforce.mjs`, `spec-gate-core.mjs`, `devin-tools.md`, `fanout-salvage.cjs`, `jsonl-repair.ts`, `shadow-projection-store.ts`, `check-direct-append.cjs`, `fanout-merge.cjs`, `loop-lock.ts`, `loop-lock.cjs`, `validate.sh`, `generate-trigger-index.mjs` (executed `--check`, exit 1), `completion-evidence-sentinel.cjs`, `validate_document.py`, `check-frontmatter-values-helper.cjs`, `goal-core.cjs`, `check-repo-rules.cjs` (stemmer replicated), `classifier-cite-drift-scan.mjs`, `classifier-screen-fetched-text.mjs`, `classifier-injection-screen.js`, `SKILL.md:392`, the fan-out playbook line. Release diffs and `v4.0.0.2` blobs read for every P1 provenance claim.

## Run notes

- **Early convergence by operator decision.** 30 of 55 planned iterations ran: deepseek-flash-max 15/15 (complete), swe2-max 10/10 (complete), luna-max 3/10, luna-codex 2/10, luna-opencode 0/10. The verdict rests mainly on the two complete lineages; the Luna lineages contributed four findings (one P1 downgraded, three P2) from five iterations.
- **Luna lineages stopped to ask questions.** Under the interactive repo rules the Luna executors halted with an A/B question instead of continuing. luna-max's last output, after iteration 3, refuses to reclaim its stale lock (PID 58874, `alive:false`) without "a written rollback and an explicit yes" under `blast-radius.md` and asks the operator to choose. luna-codex reports the lock `stale: true, held: false, alive: false` and then asks which lineage identity governs; luna-opencode's log ends with the same identity question and no writes. The luna-wave lineages exited 0 without a `review-report.md` and were classified `salvage_miss`. luna-max was first orphaned in the first wave and requeued at 07:18:43Z. A separate analysis is being written to `review/luna-halt-analysis.md`; this report did not wait for it.
- **Stale locks from a session restart.** Processes killed in a session restart left `.deep-review.lock` files in `lineages/luna-max`, `luna-wave/lineages/luna-codex` and `luna-wave/lineages/luna-opencode`, all still in phase `running` with heartbeats frozen at 06:36:54Z, 05:51:47Z and 06:46:41Z. A stale lock is the precondition for R-03's reclaim race; this run's stale locks are not evidence that the race occurred.
- **OpenCode rewrote `.opencode/package.json` at startup.** The fan-out recorded `containment_violation` events naming `.opencode/package.json` and `.opencode/package-lock.json` as modified (swe2-max iteration 1 at 05:52:29Z, luna-max iteration 3 at 06:40:53Z). The change has since been reverted; `git status --short -- .opencode/` is clean on this worktree.
- **The luna-wave run was stopped** by SIGTERM at 07:36:17Z with status `partial`; its merged verdict of PASS reflects only its single P2.
