# Review Iteration 002

## Dispatcher

- Lineage: `merge-docs-6`, area `merge-docs`.
- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder).
- Focus: correctness and security. The pass-six operator focus is the merge-docs area: this branch's net change to the twelve files a merge with main resolved, checking that nothing main added was lost and that each documentation claim is true of the code. This iteration tests the merge-added runtime and CI behavior those files assert; it does not re-report the recorded pass-six limits.

## Files Reviewed

| File | Lines read | What was checked |
|------|-----------|------------------|
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-doc/manifest.json` | 1 | The new policy hash resolves to the live compiled snapshot at generation 5 |
| `.github/workflows/spec-kit-check.yml` | 1-80, 315-374 | The three added Vibe commands exist, run after the workspace build, and fail the job on drift |
| `.skilled/skills/system-spec-kit/changelog/v2.13.4.0.md` | 1-32 | The mirror-check failure and intent-phrase claims against the implementation |
| `.skilled/commands/doctor/scripts/README.markdown` | 99-115, 232-240 | The `hook-wiring-check` shell reading and `agents-md-embed` symlink/exit-3 behavior |
| `.skilled/hooks/shared/session-readers/README.md` | 20-55 | The contained-open and runtime-specific projection claims |
| `.skilled/changelog/skilled/v4.0.2.1.md` | 97-125 | The health-record privacy claim and the hook-wiring claim |
| `README.md` | 676-686 | The health-record paragraph's privacy wording |
| `.skilled/agents/markdown.md` | 194-200, 287-293 | The command table resolves to a real command file |
| `.vibe/agents/markdown.toml` | 1 | The generated payload parses as the canonical body |
| `.skilled/skills/system-spec-kit/SKILL.md` | 1-6 | The version that the compiled policy was built from |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` | 68-80 | The alias set handed to the switch resolver |
| `CONTRIBUTING.md` | 190-200 | The renamed scaffold command exists |

Context evidence: `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs`, `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/007-sk-doc/harness/build-artifacts.cjs`, `.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs`, `.skilled/commands/doctor/scripts/hook-wiring-check.cjs`, `.skilled/commands/doctor/scripts/agents-md-embed.cjs`, `.skilled/skills/system-skill-advisor/runtime/lib/metrics.ts`, `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts`.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | pass | The generated sk-doc policy hash resolves through the runtime resolver to the live compiled snapshot, and each behavior claim tested this iteration is backed by a named implementation line. |
| `checklist_evidence` | notApplicable | No checklist row names this merge-docs area. |
| `skill_agent` | pass | The markdown agent's `/create:sk-skill` row resolves to `.skilled/commands/create/sk-skill.md`. |
| `agent_cross_runtime` | pass | The Vibe agent payload parses as the canonical body; no runtime mirror was found stale. |
| `feature_catalog_code` | notApplicable | No feature-catalog claim is touched. |
| `playbook_capability` | notApplicable | No playbook claim is touched. |

## Integration Evidence

- `node .skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs --hub sk-doc --prompt "create a new skill"` returned `effectivePolicyHash 252cd2b5…95f86` and `generation 5`, matching `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-doc/manifest.json:1`. The merge's regenerated hash is live, not a stale artifact.
- `.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:261-278` builds `collapseDrift` with a case-insensitive `skill.md` test and no allowlist, and `:385` appends its rows to the drift array that drives the non-zero exit; the v2.13.4.0 failure claim is wired to a real failure.
- `.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:74-84` excludes `assets`, `scripts` and `fixtures` from command discovery, so the repository's own test fixtures named `SKILL.md` cannot trip the new rule.
- `.skilled/commands/doctor/scripts/hook-wiring-check.cjs:124-200` tokenizes a hook command without executing it; `:341-364` recurses into `bash -c` scripts but caps depth at 2, so a crafted `.vibe/hooks.toml` cannot loop the check.
- `.skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:451-462` persists the prompt-free variant on every call because `requireDebug: false` is passed; `createAdvisorHookDiagnosticRecord` at `:397-411` has no prompt field and `validateAdvisorHookDiagnosticRecord` at `:420` rejects any record carrying a forbidden field. No prompt text reaches the diagnostics sink.
- `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:317-326` writes a `skipped` record on the disabled path, so "even a disabled one" is true for every runtime that adapts the Claude handler.
- `.skilled/commands/doctor/scripts/agents-md-embed.cjs:1439` returns exit 3 after a post-backup write failure, and `:821-831` refuses a symlinked router or Cursor mirror before a write; the doctor README's two added claims hold.
- `.skilled/hooks/shared/session-readers/{claude,codex,devin,dsh,opencode,pi}.mjs` each call `resolveInside` before opening a store; `codex.mjs:114`, `dsh.mjs:244-255` and `devin.mjs:397-405` match the README's three runtime notes.
- `.skilled/commands/doctor/scripts/agents-md-check.cjs:448,673,787,885` runs four owners as children, so the changed README's "Four of them" is accurate.

## Edge Cases

- The `manifest.json` hash is the one generated value in the twelve paths that can fail closed at runtime. It was checked with the real resolver rather than by trusting the file, and it matches the live snapshot.
- The Vibe check block in `spec-kit-check.yml` runs after the install and shared-package build at `:335-339`; without that step the sync scripts would fail to import `@spec-kit/shared`. The ordering is correct.
- The `hook-wiring-check` Vibe reader is deliberately weaker than a TOML parser: a trailing comment or a single-quoted `command` reads `hook-missing`. The README documents that limit, so it is a known conservative failure, not a silent pass.
- Recorded limits named by the brief (the `node -e` arrow, `isolation-check.sh`, `started`/`offered`, older goal rows, turn duration, OpenCode delivery receipt, longer cap) were not re-entered; none is affected by this iteration's code.

## Confirmed-Clean Surfaces

- **Live compiled policy:** the sk-doc manifest hash matches the policy compiled from the current skill sources.
- **No prompt text in diagnostics:** the health record schema has no prompt field, the validator rejects forbidden fields, and the non-debug path drops the skill label and error text.
- **Disabled run still records:** the switch-off branch emits a `skipped` record before returning.
- **Vibe TOML reading:** line-by-line, `pre_agent` only, accepts no selector or `match = "main"`, and the shell reader never executes the command.
- **Symlink and exit-code claims:** `agents-md-embed` refuses a symlinked router or Cursor mirror and returns 3 after a failed post-backup write.
- **Session-reader claims:** the contained-open path is used by every reader that opens a store, and the Codex, DSH and Devin notes match their parsers.

## Ruled Out

- **A stale sk-doc compiled policy hash:** the resolver served a compiled route with the manifest's exact hash and generation.
- **A command-injection path in the Vibe hook check:** the reader only tokenizes text; no `exec`/`spawn` call exists in `hook-wiring-check.cjs`.
- **A prompt-text leak in hook health:** the record schema and validator exclude prompt text, and the non-debug path drops skill and error text.
- **A silent pass on a trailing-comment Vibe command:** the strict regex reads it as `hook-missing`, which is the documented conservative outcome.
- **A false "four children" README claim:** four `spawnSync` calls exist in `agents-md-check.cjs`.

## Next Focus

- Dimension: maintainability
- Focus area: the documentation's durable shape after the merge — duplicated statements, changelog/release-note discoverability, and whether a maintainer editing these files can tell which copy is authoritative
- Reason: correctness and security are swept; maintainability is the only dimension left
- Rotation status: traceability complete, correctness and security complete; maintainability next
- Required evidence: file:line for each duplication or discoverability gap, with a concrete edit that would go wrong

Review verdict: PASS
