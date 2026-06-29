# Dimension

Security: input validation, injection sanitization, hex(sessionID) keying, and state-dir traversal resistance.

# Files Reviewed

- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/mk-goal.js:1`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/mk-goal.js:416`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/mk-goal.js:761`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/mk-goal.js:1166`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/goal.md:1`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/__tests__/mk-goal-state.test.cjs:1`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/__tests__/mk-goal-tool-path.test.cjs:1`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/README.md:64`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/07--hooks-and-plugin/goal-opencode-plugin.md:25`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/manual_testing_playbook/02--cli-hooks-and-plugin/goal-opencode-plugin.md:24`

# Findings by Severity

## P0

None.

## P1

### R4-P1-001 - stateDir override can escape the goal state root

- Evidence: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/mk-goal.js:79`
- Why: `normalizeOptions()` accepts `rawOptions.stateDir`, trims it, and passes it through `path.resolve()` without checking that the resolved directory remains under the intended default store. `ensureGoalStateDir()` then creates that directory at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/mk-goal.js:425`, and `writeGoalAtomic()` writes the session JSON beneath it at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/mk-goal.js:560`. The session id itself is safely hex-keyed at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/mk-goal.js:146` and appended as a filename at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/mk-goal.js:436`, but that does not constrain the parent directory.
- Concrete trigger: a plugin registration/config path that passes `stateDir: "../../outside-goal-state"` or another escaped relative path causes subsequent `/goal set` writes to land outside `.opencode/skills/.goal-state`.
- Counterevidence sought: The command markdown does not expose `stateDir`; the reviewed tests use trusted tmpdirs; no allowlist, base-directory check, or documented production-only restriction was found in the target files or coupled docs.
- Alternative explanation: If `stateDir` is guaranteed to be test-only or otherwise trusted admin-only input, this becomes a hardening/test-gap issue rather than an exploitable traversal. The current code and docs do not encode that guarantee.
- Final severity: P1
- Confidence: med
- Downgrade trigger: prove `rawOptions.stateDir` cannot be supplied by runtime/plugin configuration in production, or add a documented trusted-only contract plus regression tests.
- Suggested fix direction: resolve state directories through a dedicated helper that rejects escaped relative paths unless an explicit test-only/trusted override is enabled. Add regression coverage for `../` traversal attempts while preserving tmpdir-based tests through that explicit override.

## P2

None.

# Verdict

CONDITIONAL

# Notes

The command router stays state-free and does not run shell commands from objectives. Objective/evidence text is bounded and sanitized before passive injection, and session ids are hex-encoded before filename construction. The remaining security issue is the unconstrained parent state directory override.
