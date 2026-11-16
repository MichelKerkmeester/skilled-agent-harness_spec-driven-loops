# Review Iteration 002 — Security

## Dispatcher

- Mode: review
- Target agent: `@deep-review`
- Run: `2026-11-16T10:21:46.673Z`
- Iteration: 2 of 5
- Dimension: security
- Review target: `specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite`

## Files Reviewed

- `.skilled/bin/install-codex-hooks.mjs:243-388` — repo-anchor guard, atomic write, backup, `--check` and `--dry-run` branches.
- `.skilled/skills/system-spec-kit/runtime/hooks/pi/session-start-advisories.ts:1-67` — check table, 5s exec timeout, fail-open catch.
- `.skilled/skills/system-spec-kit/runtime/hooks/dsh/session-start-advisories.mjs:1-140` — argv construction, 5s timeout, detached reconcile, fail-open catch.
- `.skilled/hooks/env-secret-guard/README.md:19-35,59-77,129-152,211-224` — guard claims, stated limits, loaded-env behavior, state-directory permissions.
- `.skilled/hooks/env-secret-guard/lib/env-secret-watch.cjs:78-165` — integration context for the README's owner-only state claim; this library is outside `reviewScopeFiles`.
- `.claude/settings.json`, `.codex/hooks.json`, `.cursor/hooks.json`, `.devin/hooks.v1.json` — registered hook commands, all resolved against disk.
- `.github/workflows/dispatch-enforcement-guard.yml`, `opencode-dual-version.yml`, `opencode-plugin-tests.yml`, `spec-kit-check.yml` — permissions, action pinning, event interpolation.
- Exec sinks in changed hook code: `.skilled/hooks/cli-dispatch/lib/dispatch-audit.mjs:1208`, `.skilled/hooks/decision-capture/lib/capture-core.mjs:251`, `.skilled/hooks/goal/dsh/goal-manage.mjs:47`, `.skilled/hooks/cli-dispatch/cursor/dispatch-preflight-lint.mjs:80`.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None. The candidate issues below were tested and did not meet the reach rule:

- A symlinked `~/.codex/hooks.json` is replaced by the atomic rename rather than written through. Both paths belong to the same user, the original content is backed up first at `.skilled/bin/install-codex-hooks.mjs:374`, and no privilege boundary is crossed, so this is hardening observation, not a finding.
- Two installer runs in the same millisecond could share one backup filename because the timestamp is the only discriminator at `.skilled/bin/install-codex-hooks.mjs:372-374`. The install is a manual one-shot command, the atomic temp name also carries the pid, and a lost duplicate backup does not expose or corrupt a secret.
- The DSH advisory's detached reconcile child (`session-start-advisories.mjs:57-61`) is not awaited and a spawn error is swallowed. The child runs a repo-owned script, and the advisory is warn-only by contract, so this is an advisory-miss risk rather than a security defect.

## Traceability Checks

- `spec_code` — pass. Goal decision D2's no-behavior-change rule survives the phase 6 amendment: the installer's `--check` still passes the linked-worktree guard but returns at `.skilled/bin/install-codex-hooks.mjs:336` before any write, and both adapters suppress only a zero-exit Codex check at `.skilled/skills/system-spec-kit/runtime/hooks/pi/session-start-advisories.ts:59` and `.skilled/skills/system-spec-kit/runtime/hooks/dsh/session-start-advisories.mjs:65-67`. The env-secret-guard README's owner-only claim at `.skilled/hooks/env-secret-guard/README.md:220` matches the `0o600` file and `0o700` directory modes at `.skilled/hooks/env-secret-guard/lib/env-secret-watch.cjs:111-112,129`.
- `checklist_evidence` — not run this iteration; it remains the traceability pass. This is not a silent pass: no acceptance-criteria row is claimed as checked here.

## Integration Evidence

- **Runtime registration surfaces**: `.claude/settings.json`, `.codex/hooks.json`, `.cursor/hooks.json` and `.devin/hooks.v1.json`. A resolver checked only the executable segment of each registered command: `registered script paths checked=115 missing=0`. The rename phases therefore left no registered guard pointing at a missing adapter.
- **Installer ↔ Pi and DSH advisories**: `install-codex-hooks.mjs --check` is read-only, and both adapters treat only a non-zero exit as a warning, so a passing check is quiet without losing drift detection.
- **env-secret-guard README ↔ guard library**: the in-scope README's permission claim is backed by the cited library modes; its Limits section states the routes the text check misses and the after-call scan's one-hour record window.
- **CI workflows**: the four in-scope workflow files use a pinned `actions/checkout` commit (for example `.github/workflows/opencode-plugin-tests.yml:88`), declare an explicit `permissions:` block (for example `.github/workflows/dispatch-enforcement-guard.yml:10`), avoid `pull_request_target`, and pass event data through `env:`/`with:` rather than interpolating `github.event.*` into `run:` bodies.

## Edge Cases

1. The first registration check matched `adapter=` labels inside the drift `printf` messages and reported 86 false missing paths. The corrected run checked only the command segment before `||` and reported 0 missing. The tooling error is recorded in the strategy; no finding was derived from it.
2. `.skilled/hooks/env-secret-guard/lib/env-secret-watch.cjs` is outside the declared `reviewScopeFiles`; it is cited only as the integration surface that the in-scope README describes. No code finding is raised against it.
3. The symlinked-target behavior in `atomicWrite` is real but out of reach: the atomic rename is the standard safe replacement, the prior content is backed up, and the attacker would already own the user's `~/.codex/` directory.
4. Workflow review was pattern-level (permissions, pinning, event interpolation, `pull_request_target`), not a full semantic review of every job in all repository workflows.
5. `checklist_evidence` and the overlay protocols are untouched this iteration; the next focus is the traceability dimension that owns them.

## Confirmed-Clean Surfaces

- **Installer write path**: `atomicWrite` creates the temp file with `flag: 'wx'` in the destination directory, applies the existing mode, then renames in place (`.skilled/bin/install-codex-hooks.mjs:281-300`). The backup is copied before the write (`.skilled/bin/install-codex-hooks.mjs:367-378`). `--check` and `--dry-run` return before the write branch.
- **Session-start advisories**: commands and arguments are module constants, never interpolated from payloads; Pi runs them through `ctx.exec` with a 5s timeout and per-check catch (`.skilled/skills/system-spec-kit/runtime/hooks/pi/session-start-advisories.ts:55-65`), DSH through `execFile` with an argv array and the same timeout (`.skilled/skills/system-spec-kit/runtime/hooks/dsh/session-start-advisories.mjs:64-71`).
- **Hook registrations**: 115 of 115 registered script paths resolve across the four JSON runtime configs.
- **Env-secret-guard documentation**: the README's state-directory and pepper claims match the code, and the stated limits do not understate the exposure.
- **CI workflow shape**: pinned action SHAs, explicit permissions, no `pull_request_target`, no direct event interpolation into shell bodies in the four in-scope workflows.
- **Changed hook exec sinks**: the production sinks reached use `execFileSync`/`spawnSync` with argv arrays (`dispatch-audit.mjs:1208`, `capture-core.mjs:251`, `goal-manage.mjs:47`, `cursor/dispatch-preflight-lint.mjs:80`); no shell-string interpolation was found in changed hook code.

## Ruled Out

- **Command or shell injection through the changed hook adapters** — every reached sink passes an argument vector to `execFile`/`spawn`; no template-built shell string was found.
- **Guard disable through the installer `--check` bypass** — the bypass covers a branch that writes nothing.
- **Secret exposure through guard state backups** — the record and backup files are mode `0o600` under a `0o700` directory, matching the README.
- **Overstated env-secret-guard README** — the owner-only and pepper claims are implemented, and the Limits section is explicit about the routes that pass the text check.
- **CI supply-chain or injection exposure in the four in-scope workflows** — pinned actions, explicit permissions, no `pull_request_target`, no event interpolation into `run:`.
- **Symlink/TOCTOU escalation in the installer write path** — same-user paths, no boundary crossing, backup taken before replacement.

## Next Focus

- Dimension: traceability
- Focus area: `checklist_evidence` over the phase acceptance criteria and implementation-summary verification rows; goal decisions D1-D5 and the phase 6 decision record against the code; the old-to-new rename ledger across commands, skills and runtime mirrors.
- Reason: security is clean and closed; the core `checklist_evidence` protocol is the outstanding cross-reference check, and the renamed surfaces now have resolved registrations that the traceability pass can anchor to.
- Rotation status: security completed (1 pass); traceability next, then maintainability.
- Blocked/productive carry-forward: carry forward only the correctly resolved 115-command registration evidence; do not retry the broken first checker.
- Required evidence: each acceptance-criteria row paired with a code or command citation, and any README claim tested against the implementing file.
- Recovery note: not in recovery mode; the provisional verdict remains PASS.

Review verdict: PASS
