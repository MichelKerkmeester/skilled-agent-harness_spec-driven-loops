---
title: "Deep Review Strategy — Goal Unification Build (third pass)"
trigger_phrases: []
---
# Deep Review Strategy — Goal Unification Build (third pass)

## 1. TOPIC

Independent third-pass review of the goal unification build (packet `goal.md` as the single goal source across runtimes), targeting the phase-007 packet. Pass 1 (`lineages/deepseek-review`) produced 5 P1 and 10 P2; pass 2 (`lineages/deepseek-review-2`) produced 7 P2 and every P1 from pass 1 was fixed. Phase 008 (`../008-hardening-research`) then built ten of the twelve changes its own review named plus six of the seven pass-2 advisories. This pass verifies the phase-008 fixes against the shipped code, goes deeper on what that phase touched, and judges the two rows phase 008 deferred.

## 2. REVIEW CHARTER

- Target: `specs/system-speckit/033-system-speckit-v4/036-goal-unification/007-retirement-docs-and-verification` (`spec-folder`)
- Review surface: per `review/review-scope.md`, with every finding citing `file:line` and naming the decision it bears on
- Prior lineages: read `lineages/deepseek-review/review-report.md` and `lineages/deepseek-review-2/review-report.md` first; a finding the phase-008 fix list closes is not re-reported unless the fix is wrong or incomplete
- Execution: autonomous detached lineage, executor `cli-pi`, model `deepseek-v4.1-flash`, inline execution (no nested dispatch, no CLI executor, no Task)
- Artifact root: `specs/system-speckit/033-system-speckit-v4/036-goal-unification/007-retirement-docs-and-verification/review/lineages/deepseek-review-3`
- Findings only: P0/P1/P2; no fixes; nothing written outside this lineage directory
- Reproductions run against the real modules and the real CLI with fixtures under this lineage's `scratch/`; the state directory is redirected with `OPENCODE_GOAL_STATE_DIR` so no repository state is touched
- Resource Map Coverage: the target packet carries no `resource-map.md` at init, so the gate is skipped and a review-generated map is emitted at synthesis

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (covered)
- correctness — iterations 1-2; F301-F303 (lock-scope residual, extractor boundary, tolerant-fence frontmatter check)
- security — iteration 4; F308 (anchor markup through the log sanitiser)
- traceability — iterations 3-5; F304-F307, F309-F310 (parity pin, README boundaries, log-rule decidability, rebind history, Devin chain scope)
- maintainability — iteration 5; covered by the deferred-row judgement and the packet-claim reconciliation (no finding carried it as its primary dimension)

<!-- /ANCHOR:review-dimensions -->

## 4. NON-GOALS

- No changes to goal hooks, plugin, validator, commands, docs, or any file outside this lineage directory.
- No re-execution of the phase-007 or phase-008 verification sweep, and no `validate.sh` run from this lineage.
- No re-audit of surfaces both prior passes already cleared unless a phase-008 change touches them.
- No implementation of fixes for the findings reported here.

## 5. STOP CONDITIONS

- Ran exactly five iterations; convergence before iteration 5 is telemetry only.
- Stop reason: `maxIterationsReached` after iteration 5, with active P2 advisories remaining.

<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 0
- P2 (Suggestions): 10
- Resolved: 0

<!-- /ANCHOR:running-findings -->

## 7. WHAT WORKED

- Reproducing through the shipped CLI and modules on fixture workspaces: every finding except F309 was exercised end to end (40/40 lock pairs across divergent state dirs, a 10-input slice matrix, the anchor-markup write followed by the rule run, the hostile row, the rebind archive and the truncation report), so the findings carry measured evidence rather than inference.
- The positive control for pass-2 F101: the old failure shape (two sessions, divergent state directories) landed every row before the fix was accepted as fixed — a closed finding was verified closed, then not re-reported.
- Reading both implementations side by side (core next to plugin) exposed F309's missing archive, and the complete archive call-site list turned an absence into a proof.
- Probe isolation held: fixture workspaces with their own `.git` marker plus `OPENCODE_GOAL_STATE_DIR` kept every write inside the lineage — and the one place that assumption leaked became F301.

## 8. WHAT FAILED

- The first broken-fence probe used rule names that do not exist (`FRONTMATTER`, `SPEC_DOC_FRONTMATTER`) and returned a default pass; the finding formed only after re-running with the registered rule ids (`FRONTMATTER_MEMORY_BLOCK`, `SPEC_DOC_SUFFICIENCY`). Read rule ids from the registry before probing.
- The first reading treated `.opencode/hooks/goal/opencode/opencode-goal.js` as a byte-identical second copy; `git ls-files -s` shows mode 120000 — it is a symlink, and the whole "mirror drift" direction collapsed.
- No iteration was blocked or lost to a dead end.

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)

- Re-reporting the pass-2 findings as open: the phase-008 fix list was verified against the shipped code — F101, F103, F105 and F106 are fixed and F102 is fixed for closed fences; only the residuals became F302-F304. Do not re-run the pass-2 reproductions.
- Treating `.opencode/hooks/goal/opencode/opencode-goal.js` as a second copy that can drift from `.opencode/plugins/opencode-goal.js`; it is a symlink to the same file.
- Probing for deadlock or a stale-lock steal in the packet lock: no nested acquisition, and the stale window (120 s) is far longer than the operation.
- Re-probing the phase-child budget exemption, the closed tolerant fence flipping warn into error, the frontmatter leak on a tolerant fence, and the offer-path bind rule: all read or exercised clean in this pass.
- Removing the plugin's `budget_tokens_used`/`budget_usage_source` aliases or its `lastCheckAtMs` field inside this pass: the first is a documented compatibility contract with a current test; the second is a record-schema decision. Both deferrals stand.

<!-- /ANCHOR:exhausted-approaches -->

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: lock rewiring and cross-state-dir concurrency; the extractor/validator boundary matrix; the plugin's shared append and the docs that deny it; the `packet_goal` log rule and command surfaces; the log row as an input surface; rebind history parity; the packet's own claims and the two deferred rows
- Pivot lineage: none yet
- Remaining frontier: host-side merge semantics for the Devin triple-emitter chain (pass-2 F107, scope corrected by F310) cannot be settled from this repository

## 11. RULED OUT DIRECTIONS

- Frontmatter leaking through the runtime extractor on a tolerant fence — stripped and fail-closed; re-read clean.
- A closed tolerant fence flipping a budget warn into an error — both extractors measure the same slice once the fence closes.
- A nested phase parent being exempt from the durable budget — `detectLevel` returns `phase`, which always applies the budget.
- Durable-slice smuggling through a log row (CR, newlines, a forged `[active_goal]` marker, a closing anchor in the text) — sanitizer plus the re-hash guard keep the slice byte-identical.
- A symlinked packet directory or symlinked `goal.md` escaping the workspace — bind, packet read and CLI all refuse on real paths.
- Stale-lock reaping releasing a live writer, or lock deadlock — no nested acquisition; stale window far longer than any operation.
- The plugin bypassing the locked append for `log` — it imports and calls the core's `appendPacketLog`.
- A missing offer-path bind rule — present in all three workflow YAMLs and the save command.
- Plugin `log` argument splitting diverging from the CLI — same `item|state|evidence` split.
- The resend reminder being unrunnable on any adapter — each adapter names a command carrying a real session id.
- The parent goal log missing phase-007 and phase-008 rows — both are present with evidence.
- ADR-002 being contradicted by the store retirement — demotion, not deletion; disk state matches.
- The migration note being one-keyed — it documents both key schemes and states nothing was rekeyed.
- The deferred alias pair having no reader — a current test asserts both fields; the deferral is the contract.
- The deferred `lastCheckAtMs` being a defect — no reader or renderer anywhere; dead weight, not a defect.

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered] — maximum iteration count reached; the residual advisories are listed in `review-report.md`.

<!-- /ANCHOR:next-focus -->

## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: `.opencode/hooks/goal/lib/{goal-core,goal-slice}.cjs`, `bin/goal.cjs`, `.opencode/hooks/goal/README.md`, the OpenCode plugin (`.opencode/plugins/opencode-goal.js`; the hook-tree path `opencode/goal/opencode-goal.js` is a symlink to it, not a second copy), the pi/cursor/devin adapters, `spec-doc-structure.ts` and its vitest suite, the speckit plan/implement/complete/save command contracts, `/goal-opencode`, `/goal-cursor`, and the 007 packet's own claims.
- Phase-008 fix list under test: real-path packet lock under the workspace state root; record-free `appendPacketLog` the plugin calls; rebind archiving; `packet_state` and its hint; CR and fence normalization in both extractors; the offer-path bind rule in the three workflow YAMLs; the plugin's `unbind`, `log` and unknown-action error; the capability-aware reminder text on all four adapters; the text-set truncation warning.
- Deferred rows to judge: the duplicated envelope aliases and the unused plugin timestamp.
- Behavior claims under test: a log append is serialized per packet across divergent state directories; the validator and the runtime measure one durable slice; the plugin renders and resolves goals the same way the core does; the command contracts are executable as written; the packet's three success criteria hold.
- Risk areas: the lock's new root and what it now writes outside the session state dir; the shared append pulled into the plugin; the union of frontmatter boundaries inside one validator; the plugin's `log` argument splitting; rebind's archive decision; the two Devin `additionalContext` emitters.
- Context gap: both the 007 and 008 packets are closed (`Status: Complete`), so their claims are read as evidence rather than as in-progress state.

## 14. CROSS-REFERENCE STATUS

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 2, 5 | ADR-003's promised golden pin is still absent and the validator's two frontmatter boundaries disagree (F302-F304); every other frozen decision checked is implemented. |
| `checklist_evidence` | core | pass | 5 | T001-T009 and the three success criteria hold against disk state and the parent goal log; the two optimistic rows are the review-scope's prior-lineage sentence, not a checklist claim. |
| `skill_agent` | overlay | notApplicable | — | Spec-folder target. |
| `agent_cross_runtime` | overlay | partial | 4 | Pi, Cursor and Devin inherit the core's rebind archive; the OpenCode plugin overwrites in place (F309). |
| `feature_catalog_code` | overlay | partial | 3 | `goal-plugin.md` is current, but the hook README still denies the plugin's second import (F305) and the plugins README omits `unbind`/`log`. |
| `playbook_capability` | overlay | partial | 3, 5 | The `packet_goal` log carve-out is undecidable from shipped surfaces (F306), the README `packet` example omits the required session flags (F307), and the recorded Devin chain undercounts its writers (F310). |

## 15. FILES UNDER REVIEW

| File or group | Dimensions Reviewed | Last Iteration | Findings | Status |
|---------------|---------------------|----------------|----------|--------|
| `lib/goal-core.cjs` | correctness, security | 4 | F301, F308 | reviewed + reproduced |
| `lib/goal-slice.cjs` | correctness | 2 | — (boundary verified) | reviewed + reproduced |
| `bin/goal.cjs` | correctness, traceability | 3 | F307 (its README example) | reviewed + reproduced |
| pi/cursor/devin adapters | correctness, traceability | 4 | F310 | reviewed |
| `.opencode/plugins/opencode-goal.js` (+ symlink) | traceability, security | 4 | F305, F309 | reviewed |
| `spec-doc-structure.ts`, its vitest suite | correctness, maintainability | 2 | F302-F304 | reviewed + reproduced |
| speckit plan/implement/complete/save contracts | traceability | 3 | F306 | reviewed |
| `/goal-opencode`, `/goal-cursor` | traceability | 3 (goal-cursor); synthesis (goal-opencode) | — (both match the plugin action surface) | reviewed |
| 007 and 008 packet claims | traceability, maintainability | 5 | F310 | reviewed |

## 16. REVIEW BOUNDARIES

- Max iterations: 5
- Stop policy: max-iterations
- Convergence threshold: 0.05 (telemetry only before the cap)
- No-progress threshold: 0.05
- Severity threshold: P2
- Session lineage: `sessionId=fanout-deepseek-review-3-1789130055224-0aogzl`, `parentSessionId=null`, `generation=1`, `lineageMode=auto`
- Started: 2026-09-11T12:34:15Z
- Stopped: 2026-09-11T13:26:00Z (`maxIterationsReached`)

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
