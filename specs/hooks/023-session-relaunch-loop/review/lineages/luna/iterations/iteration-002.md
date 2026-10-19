# Iteration 002 — Security

## Dimension

Security — path containment, private runtime state, shell and notification escaping, and the runtime-state Gate 3 exemption.

## Files Reviewed

- .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:43
- .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:538
- .skilled/hooks/session-relaunch/lib/nudge.cjs:190
- .skilled/hooks/session-relaunch/lib/nudge.cjs:202
- .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:128
- .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:149
- .skilled/hooks/session-relaunch/lib/killer.cjs:511
- .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:1521
- .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:1546
- .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:1573
- .skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-core.test.mjs:896
- .skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-core.test.mjs:919
- .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:751

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Review Notes

The state directory rejects symlink entries and foreign ownership, then pins its mode to 0700. Handoff paths are constrained to the configured handoff directory and checked through real paths for the directory, parent, and existing file. The nudge seed parser requires an absolute path and rejects line breaks. Manual claim command construction escapes shell-sensitive characters in the path; notification construction serializes the command as a string rather than interpolating it into AppleScript source.

The Gate 3 exemption resolves lexical paths through existing symlinks before testing repository containment. The exemption applies only under the runtime-state root, while the concern README remains gated. The tests define cases for lookalike directories, traversal, symlink escapes, and the intended README boundary. No security defect was confirmed in the reviewed surfaces. Test definitions were read but not run.

## Traceability Checks

- Security boundary claims were compared with implementation and targeted test definitions: pass.
- Requirement and closure evidence alignment remains reserved for iteration 003.

## Verdict

The examined path and command boundaries match the stated behavior. Continue with packet and acceptance-evidence reconciliation.

Review verdict: PASS
