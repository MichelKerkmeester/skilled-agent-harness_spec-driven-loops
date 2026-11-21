# Iteration 006: Security (second pass)

## Dispatcher

- Run: `2026-11-21T12:42:00Z`, iteration 6 of 10, dimension `security` (second pass).
- Derived iteration number: 5 `type:"iteration"` records in the state log, so this is 6. It matches the dispatch.
- Focus: the residue tool's destructive and outbound paths that iteration 2 did not cover (the shared-model DELETE request, the M3 database copy deletes, the `--socket-dir` folder removal, the containment helper's intermediate-path handling), plus the shell and process surfaces the removal edited outside the tool.

## Files Reviewed

- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:820-858` (`normalizeOllamaHost`, `findLaneSources`)
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:860-960` (`resolveMachineContext`, `unixSocketPathOf`, `resolveModelServerDirs`)
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1150-1200` (`checkDatabases`, `DB_COPY_PATTERN` at 261)
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1470-1507` (`checkDotenv`)
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1640-1730` (`resolveContainedTarget`, `deleteContained`, `isAlive`, `stopProcess`)
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1760-1830` (`confirmOnTerminal`, `deleteOllamaModel`, `runApply` entry)
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1880-1990` (`cleanOwnedLeftovers`, `reportUserLeftovers`), plus `removeEmptyDir`
- `.skilled/commands/doctor/assets/doctor-update-apply.yaml:217-232` (lane cleanup phase)
- Diffs against merge base `bf6806ad4b3`: `.skilled/scripts/orphan-mcp-sweeper.sh`, `.skilled/scripts/git-hooks/pre-commit`, `.skilled/commands/doctor/scripts/orphan-process-check.cjs`, `.gitignore`, `.skilled/hooks/shared/env-aliases.cjs`, `.github/workflows/advisory-checks.yml`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None. No new security finding this pass. The seven carried P2 findings (R1-P2-001, R1-P2-002, R2-P2-001, R3-P2-001, R3-P2-002, R3-P2-003, R4-P2-001) stay active and unchanged; nothing read here resolves or sharpens R2-P2-001.

## Traceability Checks

No traceability protocol was run this iteration; it was a security pass. `feature_catalog_code` and `playbook_capability` remain unrecorded and go to the next focus.

## Integration Evidence

- `/doctor:update apply`, via `.skilled/commands/doctor/assets/doctor-update-apply.yaml:222`, runs `sweep-lane-residue.mjs apply --json [--shared-model delete|keep] </dev/null`. The only value bound into it is the yes or no answer to `askFirst[].question` (line 228), and nothing user-typed is interpolated into the command line.

## Edge Cases

- Shared model on a remote host: `ctx.ollamaHost` comes from `--ollama-host`, `OLLAMA_HOST` or `OLLAMA_BASE_URL` (`sweep-lane-residue.mjs:892`). If one of those names a shared remote server, `--shared-model delete` would remove the model there for every user. Mitigated: the question passed to the operator is `sharedModelQuestion(ctx.ollamaHost)` (`:1457`, `:1958`), so the host is named before the yes, and the doctor route asks it on every run (`doctor-update-apply.yaml:228`). Not a finding.
- Missing `node:sqlite`: then `inspectSqliteFile` cannot finish, so every `skill-graph.sqlite*.bak` or `.corrupt` copy is listed as `kind: 'copy'` (`:1185-1186`) and deleted by apply (`:1902-1903`). This is the documented rule ("a copy that cannot be opened to look goes", `doctor-update-apply.yaml:219`). The copies are backups of a derived database that the next scan rebuilds. Recorded as a design choice, not a defect.

## Confirmed-Clean Surfaces

- `resolveContainedTarget` (`:1640-1663`) refuses a symlinked leaf, realpaths the parent, and rejects any result outside the realpathed root. An intermediate symlink that leaves the root is therefore refused.
- `deleteContained` (`:1677-1697`) keeps a directory unless the caller passes `allowDirectory`. Only M1 directory paths and the M5 model cache (`:1946`) pass it, and both use fixed segments under the checkout's own package roots.
- `removeEmptyDir` refuses a symlink or non-directory and uses `rmdirSync`, which cannot remove a non-empty folder. A `--socket-dir` pointed at a populated folder is kept (`ENOTEMPTY`).
- Process access: `spawnSync` is only called with argument arrays (`git` at `:428`, `ps` at `:1223`, the dotenv CLI at `:1490`). No `shell: true`, so a path or env value cannot inject a command.
- `normalizeOllamaHost` (`:826-839`) reduces the value to `url.origin`, which drops credentials and paths. A scheme with a `null` origin makes `new URL('/api/delete', host)` throw, which is caught and reported as `failed` (`:1789-1801`). The DELETE body is a fixed model name.
- `confirmOnTerminal` counts only `y` or `yes` (`:1781`). A closed stdin counts as no, so the doctor route's `</dev/null` cannot yield an implicit yes.
- Out-of-tool diffs: the sweeper and the orphan check only drop the model-server class and the `hf-embed.sock` match. The pre-commit change is comment-only. `.gitignore` keeps both `runtime/database/` ignore rows, with only the comment reworded. The env-alias change is comment-only. None of them widens a kill, a delete or a published path.

## Ruled Out

- Command injection through env or CLI values into child processes: ruled out, because every `spawnSync` takes an argument array with no shell (`:428`, `:1223`, `:1490`).
- SSRF or credential leak through the Ollama host value: ruled out, because only the origin is used, the body is fixed, the host is operator-chosen and named in the question (`:826-839`, `:1789-1801`).
- Path escape through intermediate symlinks in a multi-segment delete: ruled out (`:1650-1662`).
- Removing a populated `--socket-dir` folder: ruled out, because `rmdirSync` is non-recursive.
- Security regression in the edited shell, hook and ignore files: ruled out by reading each diff against the merge base.

## Next Focus

- Dimension: traceability on the `feature_catalog_code` and `playbook_capability` overlays.
- Focus area: `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/lane-residue-gate-and-cleanup.md` and the scorer-fusion catalog pages, checked against the current code; then the doctor-update playbook steps, checked against the tool's flags and exit codes.
- Reason: security, correctness, traceability and maintainability all have results, and correctness and security have had two passes each. Only these two overlays have no recorded result.
- Rotation status: correctness and security done twice; traceability and maintainability done once.
- Carry-forward: R1-P2-001, R1-P2-002, R2-P2-001, R3-P2-001, R3-P2-002, R3-P2-003, R4-P2-001. Blocked: everything listed under Exhausted Approaches, plus this iteration's ruled-out list.
- Required evidence: a file:line reference for each overlay result.

Review verdict: PASS
