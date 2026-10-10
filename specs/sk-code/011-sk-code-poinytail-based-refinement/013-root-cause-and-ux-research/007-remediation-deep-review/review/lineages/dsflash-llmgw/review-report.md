# Deep Review Report

- Target: `specs/sk-code/011-sk-code-poinytail-based-refinement/013-root-cause-and-ux-research/007-remediation-deep-review` (spec-folder)
- Product change under review: commits `fde8a56d87..8e1be919a4` on `worktrees/094-root-cause-ux-research`, scoped by `goal-file-manifest.txt` (30 files)
- Lineage: `review/lineages/dsflash-llmgw` — fan-out CLI lineage, executor cli-pi model deepseek-v4.1-flash, session `fanout-dsflash-llmgw-1791667148881-n911tj`
- Iterations: 5 of 5 (stop policy `max-iterations`)
- Verdict: **CONDITIONAL**
- Active findings: P0 = 0, P1 = 3, P2 = 1
- `hasAdvisories`: false (no PASS verdict)
- Generated: 2026-10-10, from iteration files 1-5, delta files 1-5, and `deep-review-findings-registry.json`

## Executive Summary

Five iterations covered all four dimensions (correctness, security, traceability, maintainability) against the six fix commits and their 30-file manifest. The six fixes do what their commits and phase docs claim on the served tree: `compiled-route-sync.cjs --check` exits 0 with all seven hubs resolving (55 closure files), the manifest suite passes 42/42, the admission suite 29/29, all seven hub canaries report 0 failures, `compiled-route-guard.cjs` exits 0 with every hub fresh, the hook stdin suite passes 40/40, the Hermes mirror is in sync (70 copies), and README/system-spec-kit hygiene claims hold.

Three P1 findings survive adversarial re-read and probe replay; none was refuted. Two are on the Pi dispatch guard: benign commands that combine a variable expansion with a `-p`/`--print` token are denied (observed live during this review's own setup), and wrapper-delivered dispatches (`bash -c`, `sh -c`, `zsh -c`) evade both the guard's authorization and the hard-rule lint while the shared resolver recognizes them as executors. One is on the compiled-routing authored source: the authored cli-classifier fixture still expects the removed `cli-deem` mode, so the documented rebuild would copy a gold-failing fixture into the served tree. One P2 notes that the capability and playbook docs describe wrapper forms as `ambiguous` when shell `-c` wrappers classify `none`.

No product file was modified; the review is observation-only.

## Planning Trigger

The verdict routes to `/speckit:plan` for remediation:

- Active P1 findings remain (review-core: "Fix before merge"), so no `PASS` and no changelog route.
- No active P0 exists, so `FAIL`/release-blocking is not the state; the loop converged on coverage (all dimensions, no new findings in the final pass) while the findings stay open.
- Two P1s share one producer surface (the dispatch classifier feeding the Pi guard), so a single remediation phase can address both plus the P2 docs alignment; the third P1 is an independent one-file fixture update.

## Active Finding Registry

All findings below are deduplicated, active, and carry the command or read that confirmed them in this lineage.

### R1-P1-001 — P1 (correctness, incomplete fix)

**Authored cli-classifier fixture still expects the removed cli-deem mode, so the next documented rebuild reinstalls a fixture that fails its own gold.**
File: `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/008-cli-classifier/fixtures/canary-cases.v1.json:70`
Confirmed by: `node probe/authored-classifier-canary-probe.cjs .` -> `Error: gold mismatch for deem-choice-single: action defer but expected route`; fixture diff against the served copy shows `deem-choice-single`/`deem-verb-narrowness` vs `classifier-verb-narrowness`; `.skilled/bin/compiled-route-sync.cjs:795-806` copies every traced closure file byte-for-byte; the `--check` output lists the fixture among the 55 traced files; `serving-closure.manifest.json` records the fixture as a copied closure file.
Impact: the next real rebuild installs a served tree whose cli-classifier canary throws, undoing the green canary state this review verified. Confidence 0.85; the only unexecuted step is the real rebuild itself, outside this lineage's write surface.

### R1-P1-002 — P1 (correctness, false positive)

**Pi guard denies benign commands when a variable expansion and a `-p`/`--print` token coexist, and the new deny text misdiagnoses them as failed dispatches.**
File: `.skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts:249` (deny branch at `:185`; classifier at `.skilled/hooks/dispatch/lib/dispatch-audit.mjs:260`)
Confirmed by: the live denial of this lineage's own setup command `mkdir -p "$LIN/prompts" ...`; `node --import <tsx> probe/guard-probe.ts .` -> `mkdir -p "$LIN/prompts"` `ambiguous`, `cp -p "$SRC" "$DST"` `ambiguous`, `node -p "$EXPR"` `ambiguous`, literal-path control `none`.
Impact: legitimate shell work under Pi is blocked; the commit-004 guidance ("Call one executor by its literal name") is inapplicable to those callers. Confidence 0.95.

### R2-P1-001 — P1 (security, auth guardrail bypass)

**Pi dispatch authorization is bypassable by wrapper-delivered dispatches (`bash -c`, `sh -c`, `zsh -c`) that the rule engine's own resolver classifies as an executor.**
File: `.skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts:235`
Confirmed by: `node --import <tsx> probe/wrapper-probe.ts .` -> the three shells classify `none` for the guard (`guardAllows: true`) while `resolveDispatchPacket` returns `cli-devin`/`cli-opencode`/`cli-codex`; the Claude and Codex adapters already call the wrapper-aware resolver (`claude/dispatch-preflight-lint.mjs:62`, `codex/dispatch-preflight-lint.mjs:57`); the guard returns before rule evaluation when the kind is `none`, so the stdin-redirect hard rule is skipped too.
Impact: an unnamed dispatch proceeds without operator authorization and without the hard-rule lint on the one runtime that enforces authorization. Confidence 0.95.

### R3-P2-001 — P2 (traceability, cross-consumer)

**Capability and playbook docs describe wrapper commands as ambiguous, but shell `-c` wrappers classify `none` and bypass the guard.**
File: `.skilled/skills/cli-external-orchestration/feature-catalog/cli-dispatch-authorization/cli-dispatch-authorization.md:21`; also `.skilled/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/cli-dispatch-preflight-authorization.md:29`
Confirmed by: the docs' wrapper claims read directly against `probe/wrapper-probe.ts` output.
Impact: readers testing the documented ambiguous-deny path with `bash -c` observe the command run. Confidence 0.8.

## Remediation Workstreams

**Workstream A — Pi dispatch classifier and guard (R1-P1-002, R2-P1-001; R3-P2-001 follows).**
Owner surface: `.skilled/hooks/dispatch/lib/dispatch-audit.mjs` (`hasDispatchEvidence`, wrapper unwrap) and `.skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts` (classification call and deny branch). Smallest coherent fix: classify the Pi command with the same wrapper-aware resolution the sibling adapters use (or reject wrapper-delivered dispatches explicitly), then narrow the `variableExecutor` candidate rule so a non-executor variable plus an unrelated `-p`/`--print` token is not dispatch evidence. Add negative tests for `mkdir -p "$X"`, `cp -p "$A" "$B"`, and wrapper cases for the three shells. Then align the feature catalog and playbook statements.

**Workstream B — Authored/served fixture parity (R1-P1-001).**
Owner surface: the authored classifier fixture under `specs/sk-doc/z_archive/.../008-cli-classifier/fixtures/canary-cases.v1.json`. Smallest coherent fix: bring the authored fixture in line with the served one (drop the `deem-choice-single` case, retitle/reprompt `deem-verb-narrowness` to `classifier-verb-narrowness`), then run the authored hub's own gold evaluation to green before any rebuild. This restores the convention commit 003 applied to the cli-external fixtures (both copies identical).

**Workstream C — Verification debt.**
Re-run the Pi preflight vitest suite and `validate.sh --strict` after A/B, and run a real `compiled-route-sync` rebuild in an isolated runtime root to confirm the classifier canary stays green end-to-end.

## Spec Seed

Minimal delta for the remediation spec:

- REQ: The Pi guard classifies shell-wrapped dispatches as dispatches (wrapper-aware resolution or explicit refusal); proven by tests for `bash -c`, `sh -c`, `zsh -c`, `eval`, and the benign `$VAR` + `-p` control set.
- REQ: No benign command that names no executor is denied for dispatch ambiguity; proven by the negative matrix above plus the existing deny matrix staying green.
- REQ: The authored cli-classifier fixture and its harness pass the hub's own gold evaluation; proven by the authored-hub gold run and a byte-parity diff against the served fixture.
- REQ: Capability docs and playbook describe the shipped wrapper semantics; proven by regenerating/updating the two docs and re-running their scenarios.

## Plan Seed

1. Update `hasDispatchEvidence` to stop treating unrelated `-p`/`--print` plus variable expansion as dispatch evidence; keep `$CLI -p` and alias/embedded-executor cases denied. Proving commands: extended guard probe + existing deny matrix.
2. Switch the Pi handler's classification to wrapper-aware resolution and keep the ambiguous deny for genuinely ambiguous commands. Proving command: `probe/wrapper-probe.ts` extended with the wrapper cases showing `denied: true` (or a deliberate refusal reason).
3. Add regression tests for both P1 classes to `dispatch-preflight-lint.test.ts` (and the shared inspector suite if the classifier changes there).
4. Update the authored classifier fixture; run the authored hub's gold evaluation to 0 failures.
5. Align `feature-catalog/cli-dispatch-authorization` and the preflight playbook with the final semantics.
6. Re-run: Pi vitest suite, hook stdin suite unchanged, `compiled-route-sync --check`, manifest/admission suites, canaries, commit guard, `validate.sh --strict` on the packet.

## Traceability Status

| Protocol | Level | Status | Notes |
|----------|-------|--------|-------|
| `spec_code` | core | pass | All six phases' claims checked against commits; after-numbers independently reproduced for 001/002/003/006; parent close-out log matches |
| `checklist_evidence` | core | notApplicable | Level 1 folder has no `checklist.md` |
| `skill_agent` | overlay | pass | system-spec-kit SKILL.md and changelog both 2.7.2.1 |
| `agent_cross_runtime` | overlay | pass | `.pi/extensions` guard byte-identical; Hermes 70 in sync |
| `feature_catalog_code` | overlay | partial | Open on R3-P2-001 |
| `playbook_capability` | overlay | partial | Open on R3-P2-001 |

No resource-map coverage gate applies: `resource-map.md` was absent at init (`resource_map_present: false`).

## Deferred Items

- R3-P2-001 (P2): docs/behavior alignment, scheduled with Workstream A.
- Pi preflight vitest suite (`dispatch-preflight-lint.test.ts`): not rerun by this lineage (vitest writes a cache outside the lineage write surface). Commit 004's `36 passed` claim stays unconfirmed by an independent run.
- `validate.sh --strict` on the packet and a real `compiled-route-sync` rebuild: outside this lineage's command surface; deferred to remediation close-out.
- `generate-trigger-index.mjs --check` currently exits 1 with exactly five stale documents, all docs of this still-untracked 007 packet (goal, implementation-summary, plan, spec, tasks). Not a defect in the six reviewed commits; regenerate at 007 close.
- Parent `spec.md` working tree carries the uncommitted 007 phase-map row with scaffold placeholders; fill at 007 close.

## Audit Appendix

Iterations (all `status: complete`; each with markdown narrative + delta + gateway receipt):

| # | Dimension | New findings | Verdict line |
|---|-----------|--------------|--------------|
| 1 | correctness + regressions | R1-P1-001, R1-P1-002 | CONDITIONAL |
| 2 | security | R2-P1-001 | CONDITIONAL |
| 3 | traceability | R3-P2-001 | CONDITIONAL |
| 4 | maintainability | none | CONDITIONAL |
| 5 | closure (all dimensions) | none | CONDITIONAL |

Commands run by this lineage and their results:

- `node .skilled/bin/compiled-route-sync.cjs --check` -> exit 0, "all 7 hubs resolve", 55 closure files
- `node .skilled/bin/tests/compiled-route-manifest.test.cjs` -> 42/42 pass
- `node .skilled/bin/tests/compiled-route-admission.test.cjs` -> 29/29 pass
- `node specs/sk-code/011-.../003-hub-surface-precedence/scratch/all-canaries.cjs` -> 0 failures across seven hubs
- `node .skilled/bin/compiled-route-guard.cjs` -> exit 0, all hubs fresh or excused
- `node --test .skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs` -> 40/40 pass
- `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check` -> PASS, 70 in sync
- `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --check` -> exit 1 (five stale 007 scaffold docs, attribution recorded)
- `probe/guard-probe.ts`, `probe/wrapper-probe.ts`, `probe/authored-classifier-canary-probe.cjs`, `probe/hook-early-write-probe.cjs` -> outputs captured per iteration

State integrity: `deep-review-state.jsonl` holds five canonical `type:"iteration"` records recorded through the append gateway; iteration files `iteration-001..005.md` exist exactly once each; delta files `iter-001..005.jsonl` each carry their canonical record plus finding/classification/ruled-out rows; `deep-review-findings-registry.json` holds 4 open findings (0 P0, 3 P1, 1 P2) with 0 corruption; `deep-review-dashboard.md` regenerated by the reducer.

Convergence evidence (telemetry, not a stop gate): final-pass `newFindingsRatio` 0.0; every direction explored to `ruled_out`, `deferred`, or a finding. Under `stopPolicy=max-iterations` the lane ran all five iterations by policy; the terminal synthesis record carries `stopReason: "maxIterationsReached"`.

Deviations recorded: continuity save (`generate-context.js`) was intentionally skipped — the dispatch forbids writes outside the lineage directory; the fan-out runner owns cross-lineage continuity. No product file was modified. Target files stayed read-only.
