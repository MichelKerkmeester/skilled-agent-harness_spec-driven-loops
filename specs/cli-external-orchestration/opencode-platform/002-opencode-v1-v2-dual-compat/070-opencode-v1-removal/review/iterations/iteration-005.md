# Review Iteration 005

## Dispatcher

- Mode: review
- Iteration: 5 of 5 (max-iterations stop)
- Dimension: traceability
- Focus: finish the core `checklist_evidence` protocol, then apply the iteration-4 carry-forward (a consumer sweep over the remaining removed keys) and settle the fix surface for the two active P1 findings.
- Target: the branch's own commits since `origin/main` (`ba9720f2f08`, `fc8b3a9a241`, `af87a2aa13a`, `96e3d8a8f24`, `3ef324c3de1`, `4c72145b752`, plus the `a793f3ad733` conflict resolution). Removing OpenCode 1 support; `@opencode/cli` 2.3.2 is the only supported major.
- Scope: read-only. No review target file was modified.

## Files Reviewed

- `specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/acceptance-criteria.md:54-62` [SOURCE: specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/acceptance-criteria.md:54]
- `specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/002-v1-ci-and-package-pins/acceptance-criteria.md:54-61` [SOURCE: specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/002-v1-ci-and-package-pins/acceptance-criteria.md:54]
- `specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/acceptance-criteria.md:54-64` [SOURCE: specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/acceptance-criteria.md:54]
- `specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/implementation-summary.md:126-136` [SOURCE: specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/implementation-summary.md:130]
- `specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/scratch/live.txt:55-76` [SOURCE: specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/scratch/live.txt:55]
- `.opencode/plugins/lib/v2-bridge.js:327` [SOURCE: .opencode/plugins/lib/v2-bridge.js:327]
- `.opencode/plugins/session-cleanup.js:375` [SOURCE: .opencode/plugins/session-cleanup.js:375]
- `.vibe/plugins/repo-guards/session-cleanup.mjs:25,51,60` (consumer, integration evidence) [SOURCE: .vibe/plugins/repo-guards/session-cleanup.mjs:51]
- `.vibe/plugins/README.md:95,103,118` (consumer contract, integration evidence) [SOURCE: .vibe/plugins/README.md:103]
- `.vibe/SYNC.md:37,57` (consumer contract, integration evidence) [SOURCE: .vibe/SYNC.md:37]
- Whole-repo consumer sweep: `.opencode/plugins` references across `.claude`, `.codex`, `.cursor`, `.devin`, `.dsh`, `.vibe`, `.pi`; `.server(` across the same seven mirrors; `dualPlugin` users under `.opencode/plugins`.

## Findings - New

No new finding is raised this iteration. The iteration confirmed both active P1 findings against current file content and sharpened each one's mechanism; two refinement rows are recorded, each linked to its originating finding id.

### P0 Findings

None. No active P0 exists in the run, and this iteration surfaced no candidate for one.

### P1 Findings

1. **The phase-003 acceptance table still marks AC-004 `Met` while the same packet's completion record says it is not met** -- `specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/acceptance-criteria.md:57` -- The AC row records `Met` with `Waiver '-'`, and its verification cell prints an `Observed 2026-11-19` result that depends on the deep-loop iteration and the plugin scenario. The packet's own `implementation-summary.md:130` says "T019 and AC-004 are not met, so the phase is not Complete", and `:133`-adjacent text says "No waiver was written". `scratch/live.txt:55` records both items as `NOT RUN (T019, AC-004)` and `:56` says the plugin scenario "not run in this closure", while `:71` and `:76` later append `deep-loop iteration: success` and `plugin scenario: success` with no run transcript between `:56` and `:71`.
   - Refines: DR3-P1-001
   - Finding class: `traceability_status_conflict` (completion-gate integrity, not runtime behavior)
   - Scope proof: `acceptance-criteria.md:57` and `implementation-summary.md:130` are inside the declared review target's phase-003 packet; `scratch/live.txt` is a packet evidence file the row cites.
   - Affected surface hints: the `AC_CLOSURE` validation rule, any completion claim for phase 003, the operator's ADR-waiver path in `decision-record.md`.
   - Case: A closure run reads `acceptance-criteria.md`, finds no `Unmet` row because AC-004 says `Met` with `Waiver '-'`, and `AC_CLOSURE` passes, so phase 003 is reported Complete even though T019's live deep-loop iteration has no run record.

```json
{
  "type": "traceability_status_conflict",
  "claim": "phase 003's acceptance table records AC-004 as Met while the same packet's implementation summary records it as not met and states no waiver exists",
  "evidenceRefs": [
    "specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/acceptance-criteria.md:57",
    "specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/implementation-summary.md:130",
    "specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/scratch/live.txt:55"
  ],
  "counterevidenceSought": "Read the AC row's own verification cell for a waiver or a recorded live transcript, and read live.txt end to end for the appended run evidence the row cites.",
  "alternativeExplanation": "The appended live.txt sections at :58-:76 are a genuine later live run that closed T019 and AC-004, and the implementation summary is stale prose that predates it.",
  "finalSeverity": "P1",
  "confidence": "high",
  "downgradeTrigger": "A dated live.txt run transcript naming the dispatch-iteration command, its exit status and the produced research artifacts would make the AC row sound and demote this to a stale-summary P2."
}
```

2. **The removed `server` dual export still has exactly one runtime consumer, and that consumer fails open** -- `.opencode/plugins/lib/v2-bridge.js:327` -- `dualPlugin(id, factory)` now returns an object carrying `setup` only; every `server` reference left in the file is the unrelated `serverUrl: undefined` context field at `:313` and `:343`. `.opencode/plugins/session-cleanup.js:375` exports `dualPlugin('session-cleanup', sessionCleanupPlugin)`, and `.vibe/plugins/repo-guards/session-cleanup.mjs:25` loads that exact module at run time and calls `.server({ worktree: projectDir })` at `:51` (session start) and `:60` (session end). The property is `undefined`, so each call throws `TypeError` inside a wrapper whose stated contract at `:7-10` is "A core error allows and is reported on stderr, so a guard bug never affects a session boundary" — the hook exits 0 and the startup guards and end cleanup silently do not run.
   - Refines: DR4-P1-001
   - Finding class: `cross_runtime_contract_break` (silent guard disablement, not a crash)
   - Scope proof: `.opencode/plugins/lib/v2-bridge.js:327` and `.opencode/plugins/session-cleanup.js:375` are declared review-target files; the `.vibe` adapter is cited as the consumer, per the traceability protocol's named-integration-surface allowance.
   - Affected surface hints: `.vibe/hooks.toml` entries `session-start` and `session-cleanup-end`, `.vibe/plugins/README.md:95` and `:118` (the documented adapter contract), `.vibe/SYNC.md:37` and `:57` (the "a core change needs no copy" claim).
   - Case: A Vibe session starts in a trusted checkout; `runStartup` reads `sessionCleanupPlugin.server`, gets `undefined`, throws on the call, the wrapper catches it, prints to stderr and allows, so the session runs without the startup guard warnings and ends without the cleanup sweep.

```json
{
  "type": "cross_runtime_contract_break",
  "claim": "the v1-facing server export was removed from dualPlugin while the Vibe session-cleanup adapter still calls it, and the adapter's fail-open wrapper converts the resulting TypeError into a silent skipped guard",
  "evidenceRefs": [
    ".opencode/plugins/lib/v2-bridge.js:327",
    ".opencode/plugins/session-cleanup.js:375",
    ".vibe/plugins/repo-guards/session-cleanup.mjs:51",
    ".vibe/plugins/repo-guards/session-cleanup.mjs:60"
  ],
  "counterevidenceSought": "Searched every runtime mirror (.claude, .codex, .cursor, .devin, .dsh, .vibe, .pi) for .opencode/plugins references and for .server( calls; read dualPlugin end to end for a hidden server property; read the adapter's header contract for a loud failure path.",
  "alternativeExplanation": "The Vibe adapter could tolerate the missing key through a fallback accessor, or the module could still expose server through a named export the adapter destructures elsewhere.",
  "finalSeverity": "P1",
  "confidence": "high",
  "downgradeTrigger": "A second read of the adapter's main() showing it destructures a named server export, or a dualPlugin branch that attaches server under a runtime check, would invalidate the break."
}
```

### P2 Findings

None new. The seven active P2 findings from iterations 1-4 stand unchanged; none was contradicted by this iteration's reads.

## Traceability Checks

| Protocol | Gate class | Status | Evidence | Summary |
| --- | --- | --- | --- | --- |
| `checklist_evidence` | hard | partial | `001.../acceptance-criteria.md:60`, `002.../acceptance-criteria.md:61`, `003.../acceptance-criteria.md:57`, `003.../implementation-summary.md:130` | Swept every AC row in the three acceptance tables (9 + 8 + 11). 26 rows carry `Met` with a printed command and a dated observed result; 001 AC-007 is `Superseded` under ADR-001 with a replacement check; 002 AC-008 is openly `Unmet` pending the operator's push. Two defects keep the protocol partial: 001 AC-007's `.server(` zero-match check searches `.opencode/plugins/tests` only and so cannot see the production caller, and 003 AC-004 is `Met` in the table while the packet's own summary says it is not met. |
| `spec_code` | hard | pass (iteration 3, re-confirmed) | `.opencode/plugins/lib/v2-bridge.js:327`, `003.../acceptance-criteria.md:58` | All four binding decisions remain visible in code; this iteration re-checked the `{ id, setup }` plugin shape against the packet and the `20 plugin files` count in 003 AC-005 against the folder (20 `.js` files). |

**What would raise `checklist_evidence` to pass:** re-scope 001 AC-007's `.server(` check to the repository root (or add the `.vibe` caller to its scope), and make 003 AC-004 read `Unmet` or carry a written ADR waiver that the implementation summary names. Neither is a review-iteration action; the target is read-only.

## Integration Evidence

- OpenCode 2 contract: `dualPlugin` at `.opencode/plugins/lib/v2-bridge.js:327` is the only plugin-shape factory; 25 files under `.opencode/plugins` call it.
- Vibe contract: `.vibe/plugins/repo-guards/session-cleanup.mjs:25` resolves `SESSION_CLEANUP_PLUGIN_URL` to `.opencode/plugins/session-cleanup.js` at run time; `.vibe/plugins/README.md:95` documents it as a "Thin adapter" and `:118` maps it to the `session-start` and `session-cleanup-end` entries; `.vibe/SYNC.md:37` states a core change needs no copy.
- Consumer sweep completeness: of the seven runtime mirrors, only `.vibe` references `.opencode/plugins` (3 files), and only `session-cleanup.mjs` calls `.server(` (2 call sites). No `.claude`, `.codex`, `.cursor`, `.devin`, `.dsh` or `.pi` file does.
- Not re-run this iteration: the 003 AC-011 runtime-mirror check's 16-checker inventory was not read, so whether it can detect a cross-runtime export break is unverified (recorded as deferred).

## Edge Cases

- **Registry projection loses finding ids.** Every entry under `openFindings` in `deep-review-findings-registry.json` carries `id: null`, so deduplication this iteration used the ids recorded in `deltas/iter-003.jsonl` and `deltas/iter-004.jsonl` (`DR3-P1-001`, `DR4-P1-001`). The reducer projection's id loss is a state-integrity gap in the review tooling, not a finding against the reviewed code; it is recorded here rather than as a P2 because the registry is reducer-owned and out of the review target.
- **Final-iteration stop, not convergence.** Two active P1s remain at the iteration-5 cap, so the run stops on `maxIterationsReached` with a refinement ratio of 0.5 against a 0.10 threshold. The stop is a cap, not evidence of convergence.
- **Ambiguous evidence direction in `scratch/live.txt`.** `:55-:56` record both live items as not run; `:71` and `:76` append success lines. The lower-supported reading (the appended lines are claims without a transcript) is kept, which is what holds P1 finding 1 at P1 rather than resolving it.

## Confirmed-Clean Surfaces

- `.opencode/plugins/*.js` holds 20 files, matching 003 AC-005's stated count.
- No second consumer of the removed `server` key exists anywhere in the repository's runtime mirrors.
- All 25 `dualPlugin` users other than `session-cleanup.js` are consumed only through OpenCode's `setup` path, so the v1-facing removal is complete for every other plugin.
- 002 AC-008's `Unmet` row is honest and self-describing: it names the missing operator push go-ahead as the reason, so it is an accepted blocker rather than a checklist defect.

## Ruled Out

- **A second `.server` consumer outside `.vibe`.** Searched all seven runtime mirrors for `.opencode/plugins` references and `.server(` calls; the only hits are `.vibe/plugins/repo-guards/session-cleanup.mjs:51` and `:60`. Ruled out as a broader cross-runtime break.
- **The Vibe break being a visible crash.** The adapter's header contract (`.vibe/plugins/repo-guards/session-cleanup.mjs:7-10`) states a core error allows and reports on stderr, so the failure is silent by design. Ruled out as a loud failure; it is a silent guard skip.
- **003 AC-005 being a stale count.** The folder holds 20 `.js` files, so the row's claim is current. No finding.

## Next Focus

- Dimension: none remains. The iteration cap (5 of 5) is reached with all four dimensions covered.
- Focus area for synthesis: the fix surface for the two P1 findings. For the Vibe break, compare (a) restoring a `server` accessor on the wrapper, (b) giving the adapter a `setup`-shaped call path, and (c) retiring the adapter and its two `hooks.toml` entries; (b) and (c) keep the v1-facing surface gone, (a) re-adds it. For the checklist, re-scope 001 AC-007 to the repository root and reconcile 003 AC-004 with a written waiver or an `Unmet` row.
- Reason: both P1s are confirmed against current content and neither is a candidate for downgrade; the remaining decision is the operator's, not a further read.
- Rotation status: D1 complete, D2 complete, D3 complete, D4 complete.
- Blocked/productive carry-forward: the "removal against consumers, not against its own tests" reading produced both P1s; it is exhausted for the removed keys now that the sweep is complete.
- Required evidence: the chosen fix shape applied, then a re-read of `.vibe/plugins/repo-guards/session-cleanup.mjs` against the new wrapper, plus the re-scoped AC-007 cell and the reconciled AC-004 row.
- Recovery note: none; no iteration was stuck.

## Verdict

Two active P1 findings, zero P0. One refinement row is recorded per P1; no new finding is raised. `checklist_evidence` remains `partial` for the reasons above. Promotion is blocked pending the two P1 fixes.

Review verdict: CONDITIONAL
