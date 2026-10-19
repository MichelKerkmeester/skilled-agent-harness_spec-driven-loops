# Iteration 2: Security — note confidentiality, state ownership, and signal boundaries

## Focus

- Dimension: security
- Scope: handoff-note permissions and confidentiality, runtime state-directory ownership, note-path containment, the shell-child guard, the killer's signal target, the lock takeover, and the phase-007 spec-gate exemption.
- Review target: `specs/hooks/023-session-relaunch-loop`

## Files Reviewed

- `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:43-57, 129-132, 157-163, 173-180, 632-659, 688-716`
- `.skilled/hooks/session-relaunch/lib/killer.cjs:114-123, 187-202, 244-268, 274-287, 347-466, 579-595`
- `.skilled/hooks/session-relaunch/lib/nudge.cjs:35-51, 202-260, 336-339`
- `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:19-21, 128-191, 245-285, 331-442`
- `.skilled/commands/speckit/handoff.md:25, 63-71`
- `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:1546-1584`
- `.skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-core.test.mjs:896-934`
- `.skilled/hooks/session-relaunch/tests/killer.test.cjs:559-583, 1041-1148, 1845-1880`
- `.skilled/hooks/session-relaunch/tests/nudge.test.cjs:641-665`

## Findings

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Handoff notes inherit the default permissive directory and file modes** -- `.skilled/hooks/session-relaunch/lib/nudge.cjs:209-213` -- the note directory is only a `path.join`; the manual command creates it with a plain `mkdir -p` at `.skilled/commands/speckit/handoff.md:65-69`; and `claim`/`complete` preserve whatever mode the note already has at `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:129-132`. The core's own runtime directory and log are pinned to 0700 and 0600 respectively (`.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:43-57, 585-609`), so the note path is the outlier.
   Case: on a shared host, a second local user reads `.skilled/skills/.state/session-relaunch/handoffs/<note>.md`. The note carries the Goal, Done, Remaining work and In-flight state sections, including half-applied edits, open decisions, and runtime paths; the default umask usually leaves the directory 0755 and the note 0644, and the claim update keeps that mode.
   Finding class: class-of-bug
   Scope proof: all handoff writers use the same directory and the same preserved mode; `rg -n "chmod|mkdir" .skilled/hooks/session-relaunch/lib .skilled/commands/speckit/handoff.md` finds the state-directory and log mode pins but no note mode pin.
   Affected surface hints: ["handoff note write", "claim/complete updates", "prepare read", "all five automatic runtimes", "/speckit:handoff"]
   Evidence: `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:129-132` reads the existing mode and passes it to `atomicWriteFile`; `.skilled/commands/speckit/handoff.md:68` creates the directory without `-m`.
   User impact: local information disclosure of in-flight work state on a shared machine or shared checkout.
   Recommendation: create the handoffs directory with mode 0700, pin the note to 0600 after the model writes it (or instruct `umask 077` in the nudge and command), and stop preserving a permissive mode in `writeHandoffUpdate`; add a mode assertion to the handoff tests.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | pending | Requirement-to-implementation trace is scheduled for iteration 3. |
| `checklist_evidence` | pending | Phase acceptance evidence is scheduled for iteration 3. |
| `skill_agent` | notApplicable | The target is a spec folder. |
| `agent_cross_runtime` | pending | Adapter parity is scheduled for iteration 5. |
| `feature_catalog_code` | pending | Catalog claims are scheduled for iteration 5. |
| `playbook_capability` | pending | Playbook claims are scheduled for iteration 5. |

## Ruled Out

- Cross-user state-directory ownership: `ensureStateDir` creates with 0700, re-inspects the real entry with `lstat`, requires a directory owned by the current uid, and re-pins 0700 (`.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:43-57`); tests cover symlink, regular-file, and foreign-owner refusals.
- Note-path escape: `handoffPathWithinRepo` validates lexical containment, the real handoff directory, the real parent, and an existing file's real path (`.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:128-191`); tests cover traversal and sibling escapes.
- Killer signal targeting: the target must be a descendant of the loop before `process.kill` (`.skilled/hooks/session-relaunch/lib/killer.cjs:579-595`), EPERM counts as gone, and the residual PID-reuse window is documented rather than claimed closed.
- Lock takeover: only a dead owner, an expired lock, or a mutex past its hold bound is reclaimed; the takeover is serialized through a mutex and inode-checked release (`.skilled/hooks/session-relaunch/lib/killer.cjs:347-466`); the confluence tests cover two contenders.
- Live-shell guard: the list covers sh, bash, zsh, fish, dash, ksh, mksh, tcsh, csh, nu, and pwsh, and strips a login dash (`.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:19-21, 245-254`); the tests cover fish and `-zsh`.
- Spec-gate runtime-state exemption: `isExemptTargetPath` canonicalizes through real paths, exempts only the runtime-state prefix, keeps a concern README directly under `.state` gated, and keeps nested `.state` paths gated (`.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:1546-1584`); the matrix test covers both deny rows.
- Untrusted reviewed content: no directive-like instruction was found in the reviewed code, specs, or evidence files.

## Edge Cases

- The note-mode finding is conditional on the host's umask and the parent directory's mode; a private checkout reduces the impact but does not change the code guarantee.
- The killer's pid-reuse window and the no-transcript idle path remain accepted limits documented in the README; they are not re-reported as new findings.

## Confirmed-Clean Surfaces

- The record and log are owner-only, and the log re-pins 0600 on every append.
- The wrapper's manual template does not expose a shell command injection through the note path; the bang and quote handling is tested.
- The spec-gate exemption is path-scoped and realpath-resolved.
- Adapters do not execute reviewed content as code.

## Next Dimension

Traceability: parent and phase documents against the shipped behavior, acceptance evidence against the live-run artifacts, and the review-report citations.

Review verdict: PASS
