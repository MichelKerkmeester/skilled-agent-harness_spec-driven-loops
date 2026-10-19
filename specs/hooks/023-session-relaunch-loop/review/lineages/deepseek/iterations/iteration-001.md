# Iteration 1: Correctness — nudge planning, prepare, and wrapper handoff state

## Focus

- Dimension: correctness
- Scope: the shared nudge planner, the CLI prepare/consume path, and the wrapper's relaunch decision. The killer is inspected for the same handoff-state transitions but its lock machinery is deferred to iteration 4.
- Review target: `specs/hooks/023-session-relaunch-loop`

## Files Reviewed

- `.skilled/hooks/session-relaunch/lib/nudge.cjs:209-260, 317-339, 402-418`
- `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:281-361, 403-425, 486-526`
- `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:331-442, 481-552`
- `.skilled/hooks/session-relaunch/lib/killer.cjs:480-509, 539-606`
- `.skilled/bin/skilled-loop:390-507`
- `.skilled/commands/speckit/handoff.md:63-107`
- `.skilled/hooks/session-relaunch/tests/nudge.test.cjs:398-540`
- `.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:282-377`

## Findings

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The automatic nudge names a note path in a directory it never creates** -- `.skilled/hooks/session-relaunch/lib/nudge.cjs:219-260` -- `plannedNotePath` returns `<repo>/.skilled/skills/.state/session-relaunch/handoffs/<stamp>-<sid8>.md` through `handoffDir`, which is a plain `path.join`, and `openNotePathFor` treats an absent directory as "no open note". The manual `/speckit:handoff` path creates the directory explicitly at `.skilled/commands/speckit/handoff.md:65-69`, and `prepare` refuses a note whose parent directory is missing at `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:149-156`.
   Case: a fresh checkout or a cleaned runtime-state tree has no `session-relaunch/handoffs/` directory; the first automatic nudge tells the model to write a note under that missing path. A host Write tool that does not create missing parents fails the first hop before `prepare` runs, and no hook error is logged.
   Finding class: cross-consumer
   Scope proof: all five automatic adapters reach the note path through `plannedNotePath`; `rg -n "mkdir|mkdirSync" .skilled/hooks/session-relaunch/lib/nudge.cjs .skilled/hooks/session-relaunch/{claude,codex,hermes}/` finds no directory creation, while the command doc's Step 3 does.
   Affected surface hints: ["Claude context nudge", "Pi session extension", "OpenCode plugin", "Codex nudge", "Hermes context nudge", "prepare"]
   Evidence: `.skilled/hooks/session-relaunch/lib/nudge.cjs:209-213` defines the directory without creating it; `.skilled/hooks/session-relaunch/lib/nudge.cjs:247-260` builds the path; `.skilled/commands/speckit/handoff.md:65-69` is the only path that creates it.
   User impact: a first automatic handoff on a clean checkout can fail with no relaunch and no operator-visible cause.
   Recommendation: create the handoffs directory with `fs.mkdirSync(handoffDir(repoRoot), { recursive: true, mode: 0o700 })` in `plannedNotePath` (or in each adapter before writing), add `mkdir -p -m 700` to the nudge text, and add a first-run test with the directory absent.

2. **A second handoff can orphan the first open note, and a later nudge can reuse the stale path** -- `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:418-427` -- `prepare` always writes a new pending record and overwrites the previous record for the loop, while `supersedeClaimed` only completes notes that are already `claimed` by this session (`.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:486-526`). `openNotePathFor` returns the first matching `status: open` note it finds in directory order (`.skilled/hooks/session-relaunch/lib/nudge.cjs:219-244`), and the command doc tells the model to create a new timestamped note each time (`.skilled/commands/speckit/handoff.md:25,63-71`).
   Case: `/speckit:handoff` runs twice in one session, or an automatic nudge-created note is followed by a manual command; two open notes exist. The record names the second note, but the next nudge can return the first because `readdirSync` order is not the record order. The model is then told to write or prepare the older note while the record points at the newer one, and neither path closes the abandoned note.
   Finding class: cross-consumer
   Scope proof: the two planners disagree; `rg -n "supersede" .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` shows the sweep is limited to claimed notes, and no test covers two open notes for one session.
   Affected surface hints: ["nudge note planner", "/speckit:handoff", "prepare pending record", "claim/complete lifecycle"]
   Evidence: `.skilled/hooks/session-relaunch/lib/nudge.cjs:229-241` selects the first suffix-matching open note; `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:418-427` writes the new record unconditionally; `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:507-510` only considers claimed notes.
   User impact: work context in the abandoned note can be lost, and the nudge and the record can point at different notes.
   Recommendation: make `prepare` reuse the session's existing open note or supersede/close it before writing the new record, and make `openNotePathFor` choose the newest open note when more than one exists; add a two-invocation test.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | pending | Requirement-to-implementation trace is scheduled for iteration 3. |
| `checklist_evidence` | pending | Phase acceptance evidence is scheduled for iteration 3. |
| `skill_agent` | notApplicable | The target is a spec folder, not a skill package. |
| `agent_cross_runtime` | pending | Adapter parity is scheduled for iteration 5. |
| `feature_catalog_code` | pending | Catalog claims are scheduled for iteration 5. |
| `playbook_capability` | pending | Playbook claims are scheduled for iteration 5. |

## Ruled Out

- `appendLog` short-write loss: `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:598-608` now compares the written byte count and throws on a short write; the prior advisory is fixed.
- Cross-user fallback state directory: `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:157-163` includes the uid and `ensureStateDir` checks the real directory owner at `:43-57`; the prior advisory is fixed.
- Concurrent append line merging: the append path opens with `a+`, checks the final byte, and writes one record per call; `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:811-859` covers concurrent and partial-tail appends.
- Wrapper seed path and model carry: `build_relaunch_arguments` rebuilds the seed per runtime and preserves model, name, provider, and Pi extension selections; the wrapper tests at `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:401-424, 574-822` cover the observed forms.

## Edge Cases

- The first-run directory case in finding 1 also applies when a prior cleanup removes `.state/session-relaunch/` between a nudge and the model's write.
- The two-open-note case in finding 2 depends on `readdirSync` order, so it is not deterministic; it is a state-consistency defect rather than a guaranteed failure.
- A handoff path with CR/LF is rejected by the wrapper and by `handoffPathWithinRepo`; the tested behavior is unchanged.

## Confirmed-Clean Surfaces

- `prepare` validates the note, the session, the runtime, and the spec-folder value before writing state.
- The hop-cap decline writes no record, prints the manual claim command, and logs `prepare-declined` with reason `hop-cap`.
- The wrapper consumes the record on every decision path and preserves the runtime exit code.
- `claim` and `complete` enforce the `open -> claimed -> done` transitions and preserve the note body.

## Next Dimension

Security: trust boundaries, note confidentiality, state-directory ownership, path containment, signal targeting, and the spec-gate runtime-state exemption.

Review verdict: PASS
