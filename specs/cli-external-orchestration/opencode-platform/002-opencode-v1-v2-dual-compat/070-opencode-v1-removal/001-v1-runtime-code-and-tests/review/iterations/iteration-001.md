# Deep Review Iteration 001: Confirmation review of the three fix commits

## Dimension

Correctness, with traceability carried in the same pass for the three packet findings (DR3-P1-001, DR3-P2-001, DR3-P2-002); security and maintainability touched only where a fix changed a trust boundary or an export surface.

## Files Reviewed

- `.vibe/plugins/repo-guards/session-cleanup.mjs:50-84`
- `.vibe/plugins/repo-guards/tests/session-cleanup.test.mjs:1-46`
- `.opencode/plugins/session-cleanup.js:122-130,375`
- `.opencode/plugins/lib/v2-bridge.js:300-340,570-602`
- `.vibe/plugins/repo-guards/lib/hook-io.mjs:112-124`
- `.skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs:51-52,1103-1128`
- `.skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.test.mjs:388-455`
- `.skilled/hooks/cli-dispatch/lib/opencode-version.mjs:1-60,150-254`
- `.skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs:120-130,140-190,220-235`
- `.skilled/bin/skilled-loop:1216-1240`
- `.skilled/hooks/session-handover/tests/skilled-loop-wrapper-harness.cjs:281-290`
- `.skilled/hooks/session-handover/tests/skilled-loop-wrapper-model-effort.test.cjs:115-147`
- `.skilled/skills/cli-external-orchestration/cli-opencode/README.md:51`
- `.skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md:5`
- `.skilled/skills/cli-external-orchestration/cli-opencode/changelog/v2.0.0.0.md:11`
- `.skilled/skills/system-deep-loop/runtime/tests/unit/opencode-dual-dispatch.vitest.ts:207-258,524-528`
- `.opencode/plugins/tests/plugin-inventory.test.cjs:81-82`
- `070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/acceptance-criteria.md:52-61,80-92`
- `070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/implementation-summary.md:125-135`
- `070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/tasks.md:36,68,72,113,115,126,157`
- `070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/decision-record.md:34,70`
- `070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/scratch/justified.txt:22-24`
- `070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/scratch/check-index-v1.py:1-26`
- `070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/spec.md:23`
- `070-opencode-v1-removal/spec.md:143-145`
- `070-opencode-v1-removal/001-v1-runtime-code-and-tests/implementation-summary.md:51,61,87,112`
- `.skilled/skills/cli-external-orchestration/feature-catalog/opencode-version-dispatch/opencode-version-dispatch.md:16,28`
- `.github/workflows/opencode-plugin-tests.yml:128` (context evidence for test wiring)

Not reviewed by design: `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` and the three retrieval fixtures. The strategy declares their content a non-goal; only their regenerated provenance was in question, and `scratch/check-index-v1.py` now reads them.

## Earlier Finding Dispositions

| ID | Status | Evidence |
|---|---|---|
| DR4-P1-001 | **Resolved** | `.vibe/plugins/repo-guards/session-cleanup.mjs:51,60` call `sessionCleanupPlugin.factory({ worktree: projectDir })`; `.opencode/plugins/lib/v2-bridge.js:600-601` builds `{ id, setup }` and attaches `factory` non-enumerably, so a direct property read still resolves; the contract test at `.vibe/plugins/repo-guards/tests/session-cleanup.test.mjs:26-46` asserts every method the hook calls exists and that the factory yields `event`, `dispose` and `experimental.chat.system.transform`. Ran `node --test .vibe/plugins/repo-guards/tests/session-cleanup.test.mjs` → 2 tests, 2 pass, 0 fail. The tests are wired into CI at `.github/workflows/opencode-plugin-tests.yml:128`. No `.server(` call remains anywhere under `.vibe`, `.opencode` or `.skilled` (rg, no matches). |
| DR3-P1-001 | **Partially resolved**: both named sites agree, a third site in the same file still contradicts them | `003/acceptance-criteria.md:57` records AC-004 Met and `003/implementation-summary.md:133` now says "Every acceptance row is Met or Superseded", with `003/spec.md:23` `Status: Complete` and `070/spec.md:145` "Complete (AC-004 met live…)". The contradiction moved: `003/acceptance-criteria.md:89-91` still declares `**Closeable:** No` and "Every criterion is Unmet because this phase has not been implemented yet". Filed as DR-001-P1-001 below. |
| DR1-P2-001 | **Resolved** | `.skilled/hooks/cli-dispatch/lib/opencode-version.mjs:17-21` now says major 1 → `unsupported`, every other major or unparseable output → `unknown`; the parser returns exactly that at `:205-207`. |
| DR1-P2-002 | **Resolved by recorded design** | Both copies are still byte-identical (empty `diff` of the two `parseOpencodeVersion` bodies), but each now names its twin and the reason for the split at `opencode-version.mjs:178-180` and `opencode-version.cjs:142-145`, and the parity case at `opencode-dual-dispatch.vitest.ts:524-528` asserts the two parsers agree. For a P2, documenting the intended divergence and pinning it with a test is an acceptable alternative to deduplication. |
| DR1-P2-003 | **Resolved** | `.skilled/bin/skilled-loop:1219-1237` probes `$runtime_command --version` once, mapped through the deep-loop parser, and refuses `unsupported` with the `remove-v1` hint before the `--standalone` injection; a probe error, timeout or any other family leaves the launch unchanged. Pinned by `.skilled/hooks/session-handover/tests/skilled-loop-wrapper-model-effort.test.cjs:118-147` (v1 refuses and never launches; v2 still starts with `--standalone`), with the stub answering `--version` at `skilled-loop-wrapper-harness.cjs:284-289`. I confirmed the `node -e` argument contract by running the same snippet shape: `process.argv[1]` is the module path and `process.argv[2]` the command, so the probe reads the right file and binary. |
| DR2-P2-001 | **Resolved** | `.skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs:51-52` no longer captures `opencode\d*`; only `opencode`, a path ending in it, or `$OPENCODE_BIN` is probed. `dispatch-rule-checks.test.mjs:388-418` proves a numbered launcher is never executed (marker file absent) and is still held to every rule at declared severity; `:420-455` proves the bare, path-qualified and `OPENCODE_BIN` forms still probe. Ran `node --test .skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.test.mjs` → 67 tests, 67 pass, 0 fail. |
| DR3-P2-001 | **Resolved as rows, but the replacement commands still fail as written** | AC-002/AC-006/AC-008 now carry `Superseded` with Waiver `ADR-001` (`003/acceptance-criteria.md:55,59,61`, ADR at `003/decision-record.md:34`). The replacement commands themselves are defective; filed as DR-001-P2-001 below. |
| DR3-P2-002 | **Resolved** | `003/scratch/justified.txt:23` now names `feature-catalog/opencode-version-dispatch/opencode-version-dispatch.md`, and that file exists (the folder holds `opencode-version-dispatch.md`). |
| DR4-P2-001 | **Resolved** | `.opencode/plugins/lib/v2-bridge.js:602` exports only `EVENT_ALIASES, EVENT_MAPPINGS`. No importer of `MAPPED_HOOKS` or `TOOL_ALIASES` exists in code (rg hits are prior spec history only), and the surviving exports still satisfy `.opencode/plugins/tests/plugin-inventory.test.cjs:81-82`. |

## Findings by Severity

### P0 Findings

None.

### P1 Findings

1. **Phase 003's acceptance file still declares the whole phase unimplemented and not closeable** -- `specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/acceptance-criteria.md:89` and `:91` -- The closure statement reads `**Closeable:** No` and "No. Every criterion is Unmet because this phase has not been implemented yet, and the live checks in AC-004 need the operator's model choice." The same file records AC-004 `Met` with live evidence at `:57`; `003/implementation-summary.md:133` says every row is Met or Superseded; `003/spec.md:23` says `Complete`; `070/spec.md:145` says phase 3 is Complete. The fix commit 12dcc168817 edited this file and closed DR3-P1-001's two named sites but left the closure statement asserting the opposite of the file's own table, so the contradiction DR3-P1-001 described now lives at a third site rather than being gone.
Case: a resume or closure run opens `acceptance-criteria.md` and reads §3 before the table; it concludes the phase was never implemented and is not closeable, while every other closure artifact says Complete, so the run either re-does finished work or refuses to close a finished phase.
Finding class: closure-metadata inconsistency
Scope proof: `acceptance-criteria.md:89,:91` and `:57` are in the same file edited by 12dcc168817; `implementation-summary.md:133`, `003/spec.md:23` and `070/spec.md:145` are the three artifacts the fix updated to Complete.
Affected surface hints: `070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/acceptance-criteria.md`, `070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/implementation-summary.md`, `070-opencode-v1-removal/spec.md`

```json
{
  "findingId": "DR-001-P1-001",
  "refines": "DR3-P1-001",
  "type": "closure_state_conflict",
  "claim": "acceptance-criteria.md still states the phase is unimplemented and not closeable while its rows, its summary and both packet specs say Complete",
  "evidenceRefs": [
    "specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/acceptance-criteria.md:89",
    "specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/acceptance-criteria.md:91",
    "specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/acceptance-criteria.md:57",
    "specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/implementation-summary.md:133",
    "specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/spec.md:23"
  ],
  "counterevidenceSought": "Read all of §3 and its anchors for a superseding note or a dated exemption; there is none. Checked whether `Closeable: No` could be a deliberate deferral pending phase 002's CI push: the stated reason is 'this phase has not been implemented yet', which is false and is not the phase-002 dependency.",
  "alternativeExplanation": "The sentence is an untouched scaffold answer, not a current assessment, because the same file's WAIVER block was updated in the same commit while §3 was not.",
  "finalSeverity": "P1",
  "confidence": 0.97,
  "downgradeTrigger": "A dated note in §3 (or removal of the scaffold answer) that states the phase is implemented and complete would make this P2 documentation residue."
}
```

### P2 Findings

1. **The ADR-001 replacement checks cannot be reproduced as written** -- `specs/.../003-v1-docs-and-playbooks-sweep/acceptance-criteria.md:55`, `:59` and `:61` -- Each replacement pipes `rg` output through `<(... cut -f1 scratch/justified.txt)` or runs `python3 scratch/check-index-v1.py`, so it needs the phase folder as cwd, while the `rg` paths (`.skilled/...`) need the repo root. Run from the repo root, AC-002 prints `1` plus `cut: scratch/justified.txt: No such file or directory`, and AC-006 prints `2` with the same error; run from the phase folder, the `rg` paths resolve to nothing. AC-008's `python3 scratch/check-index-v1.py` cannot be found from the repo root, and from the phase folder `scratch/check-index-v1.py:8` fails on its own repo-root-relative index path. Each row records `Observed 2026-11-19`, so the evidence is dated but not repeatable.
Case: an operator re-runs the row's printed command to confirm a Superseded criterion and gets a non-zero count or a `FileNotFoundError` instead of the recorded 0.
Finding class: checklist-evidence discipline
Scope proof: the three rows and the script were written by 12dcc168817; `scratch/check-index-v1.py:6-8` mixes an `__file__`-relative `justified.txt` with a cwd-relative index path, which is the narrowest fix (resolve both from `__file__` or both from an explicit repo root).
Affected surface hints: `070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/acceptance-criteria.md`, `070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/scratch/check-index-v1.py`

2. **T023's closure note still says T019 and AC-004 stay open** -- `specs/.../003-v1-docs-and-playbooks-sweep/tasks.md:72` -- The verification task ends "…on the final state. T019 and AC-004 stay open." while `tasks.md:68` records T019 done, `acceptance-criteria.md:57` records AC-004 Met, and the phase is Complete. The same stale sentence is the one artifact a resume scan of `tasks.md` reads at the point it checks validation.
Case: a closure run greps `tasks.md` for open items, finds "T019 and AC-004 stay open", and re-opens two items the packet has already closed.
Finding class: closure-metadata inconsistency
Scope proof: `tasks.md:68` and `:72` are the same file; 12dcc168817 edited `tasks.md` (16 lines) without removing the trailing sentence of T023.
Affected surface hints: `070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/tasks.md`

## Traceability Checks

| Protocol | Status | Evidence |
|---|---|---|
| `spec_code` | pass | `001/implementation-summary.md:112` records all four code fixes (factory call, probe scope, v1 refusal, export trim); the code matches at `session-cleanup.mjs:51,60`, `dispatch-rule-checks.mjs:51-52`, `skilled-loop:1219-1237`, `v2-bridge.js:602`. `feature-catalog/opencode-version-dispatch/opencode-version-dispatch.md:28` matches `opencode-version.cjs:169` (major 1 unsupported, major 2 v2, else unknown). |
| `checklist_evidence` | partial | All three phase-003 named rows now carry a waiver (ADR-001 at `003/decision-record.md:34`) and AC-004 is Met with live evidence (`:57`), but §3 of the same file contradicts the table (`:89-91`) and the two replacement commands fail as written. Two defects keep it partial, both filed above. |
| `skill_agent` | pass | `cli-opencode/README.md:51` states "OpenCode 1 support was removed in skill version 2.0.0.0"; `SKILL.md:5` is `version: 2.0.0.0` and `changelog/v2.0.0.0.md:11` is `version: 2.0.0.0`, so the README claim and the frontmatter agree. |
| `feature_catalog_code` | pass | The catalog entry names the refusal the resolver implements: `opencode-version-dispatch.md:16,28` against `opencode-version.cjs:120-130,169`. |
| `playbook_capability` | pass | `run-plugin-scenario.sh` carries no `<v1|v2>` version argument (`rg -F '<v1|v2>'` over the runner, no match), so AC-002's second leg holds. |
| `agent_cross_runtime` | notApplicable | The three fix commits touch no agent definition, command mirror or runtime agent surface. |

## Integration Evidence

- `/speckit:save` continuity writer is not in scope; the strategy, state log and delta are the only integration surfaces this iteration touched, and the state log is written by the append gateway.
- `.github/workflows/opencode-plugin-tests.yml:128` discovers `.vibe/plugins/repo-guards/tests`, so the new contract test runs in CI rather than only by hand.
- `/deep:review` dispatch contract: iteration number derived from the state log (one `iteration_start` event, zero `type:"iteration"` records) agrees with the dispatched iteration 1.

## Edge Cases

- **`--standalone` supplied by the operator on a v1 binary.** `.skilled/bin/skilled-loop:1219` gates the new refusal on `opencode_standalone_seen == 0`, so `skilled-loop opencode --standalone` still reaches the CLI's own usage error. This is outside DR1-P2-003, which concerned the wrapper injecting the flag itself, and the operator is explicitly asking for a flag the binary does not have. Recorded, not filed.
- **`opencode1` now met at declared severity instead of downgraded to warn.** Removing the numbered launcher from the probe regex means the engine no longer resolves a family for it, so `unresolved` is false and a narrower rule keeps its declared severity (`dispatch-rule-checks.mjs:1120-1128`). Stricter than before, and pinned at `dispatch-rule-checks.test.mjs:325-333`. Not a regression.
- **Generated index and fixtures.** Not reviewed by content (declared non-goal). The new `check-index-v1.py`, run correctly from the repo root, prints `0`, so the substance of AC-008 holds even though its printed invocation does not.
- **`001/acceptance-criteria.md` AC-007 `.server(` grep scope.** Suggested by the prior Plan Seed but that file is not in the declared review scope; the new Vibe contract test covers the one consumer that broke. Not checked, not claimed.

## SCOPE VIOLATIONS

None attempted. Every write stayed inside the review packet; the checked-out source and packet docs were read only.

## Confirmed-Clean Surfaces

- `.opencode/plugins/lib/v2-bridge.js:600-601` — `factory` is non-enumerable but directly readable, so the Vibe hook's `plugin.factory(...)` resolves and the host still sees only `{ id, setup }`.
- `.vibe/plugins/repo-guards/session-cleanup.mjs:51-54` — the factory-built hooks receive the same `{ worktree }` input shape `server()` used to receive; the factory reads `input.worktree || input.directory || REPO_ROOT` at `session-cleanup.js:130`, so behaviour is preserved rather than merely non-throwing.
- `.skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs:1103-1112` — a command with no matched OpenCode launcher skips version resolution and applies every rule, so no dispatch loses coverage.
- `.skilled/bin/skilled-loop:1220-1236` — the probe fails open on error, timeout, or any family other than `unsupported`, so OpenCode 2 launches are untouched.

## Ruled Out

- **`v2-bridge.js` export trim breaking a consumer.** `rg` over the repository finds no code importer of `MAPPED_HOOKS` or `TOOL_ALIASES`; `plugin-inventory.test.cjs:81-82` reads only the two surviving exports. No regression.
- **The factory property being invisible to `sessionCleanupPlugin.factory(...)`.** `enumerable: false` affects enumeration only; property access is unaffected, and the contract test reads it through the real default export.
- **The duplicated parsers drifting after the comment-only fix.** `diff` of the two function bodies is empty and the parity case at `opencode-dual-dispatch.vitest.ts:524-528` compares them over the same corpus.
- **Removing `opencode\d*` from the probe regex dropping the stdin or model rules.** Those checks keep their own `opencode\d*` patterns (`dispatch-rule-checks.mjs:82,186,777`), so `opencode2 run` is still recognised; only the version probe narrowed.

## Next Focus

- Dimension: traceability (closure metadata sweep)
- Focus area: every phase document that states a completion or openness verdict, read against its own rows
- Reason: the only P1 this iteration is a scaffold answer left behind in the same file 12dcc168817 edited, which suggests the other closure sentences were not swept
- Rotation status: correctness done for the fix set; traceability opened but not exhausted
- Blocked/productive carry-forward: the command-reproducibility angle is productive (two of three findings); the export-surface angle is exhausted
- Required evidence: `grep` of `Closeable`, `Unmet`, `In Progress`, and `stay open` across the three phase folders, each hit read against its phase status
- Recovery note: not applicable

## Verdict

One active P1 (phase-003 closure statement contradicting its own rows and both packet specs) and two active P2 advisories (unreproducible replacement checks, stale T023 note). No P0. All seven earlier P2 findings and DR4-P1-001 are resolved; DR3-P1-001 is resolved at its two named sites and continued at a third.

Review verdict: CONDITIONAL
