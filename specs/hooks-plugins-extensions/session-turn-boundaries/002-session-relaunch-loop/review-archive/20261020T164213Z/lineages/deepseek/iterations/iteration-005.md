# Iteration 5: Broadened pass — adapter payload parity and documentation inputs

## Focus

- Dimensions: maintainability and traceability (broadened, not a repeat of the settled core, security, traceability, or lock findings)
- Scope: how the carried `spec_folder` reaches each automatic adapter, whether the Claude and Codex nudge tests cover it, and whether the feature catalog and playbooks name the environment inputs.
- Review target: `specs/hooks/023-session-relaunch-loop`

## Files Reviewed

- `.skilled/hooks/session-relaunch/claude/context-nudge.mjs:64-128`
- `.skilled/hooks/session-relaunch/codex/shared.mjs:58-131`
- `.skilled/hooks/session-relaunch/hermes/context-nudge.mjs:61-76`
- `.skilled/hooks/session-relaunch/pi/session-relaunch.ts:306-353`
- `.opencode/plugins/session-relaunch.js:124-168,323-373`
- `.hermes/plugins/repo-guards/__init__.py:148-151,677-695`
- `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:98-112`
- `.skilled/hooks/session-relaunch/README.md:1-31,69-73`
- `.skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-relaunch-loop.md:27-85`
- `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs:220-260`
- `.skilled/hooks/session-relaunch/tests/codex-adapters.test.cjs` (search for `spec_folder`)
- `.skilled/hooks/session-relaunch/pi/session-relaunch.test.ts:30-42,285-310`
- `.opencode/plugins/tests/session-relaunch.test.cjs:35-65,220-250`

## Findings

### P0 Findings

None.

### P1 Findings

None new. The active P1 DS-004 from iteration 3 remains open, so the iteration verdict stays CONDITIONAL.

### P2 Findings

1. **The carried-packet environment inputs are undocumented and differ by runtime** -- `pi/session-relaunch.ts:338` and `.opencode/plugins/session-relaunch.js:159` read `process.env.SYSTEM_SPEC_FOLDER`, `.hermes/plugins/repo-guards/__init__.py:151,687` reads `HERMES_SPEC_FOLDER` and passes it as `payload.spec_folder`, and the Claude and Codex adapters read `payload.spec_folder` (`.skilled/hooks/session-relaunch/claude/context-nudge.mjs:123`, `.skilled/hooks/session-relaunch/codex/shared.mjs:125`). The session-relaunch environment table lists the disable flag, threshold, window, hop cap, max age, and repo root, but no spec-folder variable (`.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:98-112`). The session-relaunch README says `spec_folder` records the Gate 3 answer but does not name any input.
   Case: an operator wants to bind a packet so the automatic nudge carries it on Pi, OpenCode, or Hermes. There is no documented variable for Pi/OpenCode (`SYSTEM_SPEC_FOLDER`) or Hermes (`HERMES_SPEC_FOLDER`), and the two names differ, so the packet-carry path is undiscoverable and cannot be configured from the docs alone.
   Finding class: cross-consumer
   Scope proof: `rg -n "SYSTEM_SPEC_FOLDER|HERMES_SPEC_FOLDER"` finds the adapter reads and the goal-binding reference but no row in the environment reference; the tests set the variables but the docs do not.
   Affected surface hints: ["Pi adapter", "OpenCode plugin", "Hermes bridge", "ENV-REFERENCE", "session-relaunch README"]
   Evidence: `pi/session-relaunch.ts:338`, `.opencode/plugins/session-relaunch.js:159`, `.hermes/plugins/repo-guards/__init__.py:151,687`, `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:98-112`.
   User impact: the D3 packet-carry behavior is not reproducible from the documentation and differs between runtimes.
   Recommendation: document both inputs in `ENV-REFERENCE.md` and the session-relaunch README, or unify on one variable and read it from Claude and Codex too; add a docs check for the table.

2. **The Claude and Codex nudge tests never cover a carried `spec_folder`** -- `.skilled/hooks/session-relaunch/claude/context-nudge.mjs:121-123` and `.skilled/hooks/session-relaunch/codex/shared.mjs:123-125` both read `payload.spec_folder`, but `rg -n "spec_folder" .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs .skilled/hooks/session-relaunch/tests/codex-adapters.test.cjs` returns no hit. The Claude suite covers the seed suffix at `claude-adapters.test.cjs:233-247`; the Codex suite has no payload case.
   Case: a Claude or Codex hook payload starts carrying `spec_folder` (or a wrapper sets it). A regression that drops the field changes the note's frontmatter and the save step, but both suites still pass because they never exercise the nudge path with the field.
   Finding class: matrix/evidence
   Scope proof: the two adapter files are the only automatic runtimes whose nudge field is untested; Pi and OpenCode set the variable in their suites, and Hermes passes the field in its payload tests.
   Affected surface hints: ["Claude context nudge", "Codex shared adapter", "Claude test suite", "Codex test suite", "D3 packet carry"]
   Evidence: `.skilled/hooks/session-relaunch/claude/context-nudge.mjs:123`, `.skilled/hooks/session-relaunch/codex/shared.mjs:125`, `rg` over the two suites, `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs:233-247`.
   User impact: the packet-carry contract can silently regress on two of the five automatic runtimes without a failing test.
   Recommendation: add one nudge-payload case per adapter with `spec_folder` set and assert the note frontmatter or save command carries it; if the field is not a supported host payload, remove the dead reads and document that only the model writes the field.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | Active from iteration 3: DS-005 and DS-007. The adapter behavior matches the code; the docs do not name the inputs. |
| `checklist_evidence` | partial | Active from iteration 3: DS-004 and DS-006. |
| `skill_agent` | notApplicable | The target is a spec folder. |
| `agent_cross_runtime` | notApplicable | No agent definition is the review target; adapter parity was checked as a cross-runtime behavior instead. |
| `feature_catalog_code` | pass | The catalog's nudge, prepare, killer, wrapper, and seed claims match the code; the missing input documentation is captured in DS-010/DS-011. |
| `playbook_capability` | partial | The three playbook files exist and their commands resolve; the phase 007 raw log cited by the run 10 record is missing (DS-004). |

## Ruled Out

- The Claude and Codex seed paths do carry a spec folder when one is present in the seed; the gap is the nudge-payload coverage, not the seed parser (`.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs:233-247`).
- The Pi and OpenCode suites cover `SYSTEM_SPEC_FOLDER`; only the documentation is missing (`.skilled/hooks/session-relaunch/pi/session-relaunch.test.ts:285-310`, `.opencode/plugins/tests/session-relaunch.test.cjs:220-250`).
- The feature catalog's runtime matrix and the session-relaunch README agree on the seven runtimes and the seed forms; no new catalog drift was found.
- The playbook commands point at existing files; the missing raw log is already DS-004, not a new playbook defect.

## Edge Cases

- If `SYSTEM_SPEC_FOLDER` is inherited for another purpose, Pi and OpenCode will carry it into the handoff note automatically; that coupling is another reason to document the variable.
- Hermes uses `HERMES_SPEC_FOLDER` for both goal binding and the nudge payload, so a goal-only setting also changes the handoff's carried folder.
- A Claude or Codex host that already provides `spec_folder` would be covered by adding the test; a host that does not would make the reads dead code.

## Confirmed-Clean Surfaces

- The seed parser and suffix handling are shared across runtimes and tested.
- The Pi and OpenCode thresholds, hop caps, and handoffPending checks are covered.
- The feature catalog and playbooks describe the current runtime set and command forms.
- No new core, security, traceability, or lock finding was reopened in this pass.

## Next Dimension

None. All four dimensions and the broadened parity pass are covered; the remaining work is synthesis of the 11 active findings (1 P1, 10 P2).

Review verdict: CONDITIONAL
