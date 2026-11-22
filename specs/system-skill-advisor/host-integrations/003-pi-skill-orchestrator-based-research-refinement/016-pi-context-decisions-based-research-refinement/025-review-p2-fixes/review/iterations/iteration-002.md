# Deep Review Iteration 002

## Dispatcher

- Iteration: 2 of 3, derived from the state log (1 prior `type:"iteration"` record), matching the dispatched number.
- Mode: review. Dimension: security.
- Operator focus: the full replay of the ten 024 P2 fixes was done in iteration 1 (table in `iteration-001.md`). This iteration re-checked the two security-relevant fixes against the code: R2-P2-001, the socket rule at `sweep-lane-residue.mjs:1371`, and R9-P2-001, the rejected-line note at `:1561-1565` together with the keys-only env-secret call at `:1546`. Both still hold. `fixture_realism` (SL4-005) is in Exhausted Approaches and was not re-entered. The new gap below is a different one: a test fixture that links a server folder, not whether the sockets are real.
- Session `2026-11-21T14:41:59Z`, generation 1, lineage `new`.

## Dimension

Security, applied to apply-mode delete safety in `sweep-lane-residue.mjs`: symlink refusal, containment of each deleted path, the socket rule across the check-to-apply gap, the remote reach of the shared-model delete, and value-free printed output.

## Files Reviewed

- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs` lines 380-410, 834-847, 880-1000, 1335-1400, 1680-1830, 1850-1900, 1940-2060, 2127
- `.skilled/skills/system-spec-kit/runtime/cli/tests/sweep-lane-residue.vitest.ts` lines 30-45, 1098-1122, 1195-1212, 1491-1498, plus a grep of every `symlinkSync` fixture (`:437`, `:845`, `:1201`, `:1494`)
- `.skilled/skills/sk-code/sk-code-review/references/review-core.md` lines 43-56 (severity doctrine)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The linked-server-folder refusal is the only guard against a redirected delete there, and no test reaches it** -- .skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1996 -- In apply, each model server file is deleted with its own folder as the containment root: `deleteServerFile(item.dir, path.basename(item.path), ...)` at `:1995-2000`. `resolveContainedTarget` realpaths both the root and the target's parent (`:1714-1715`), so when the root itself is a symlink the two resolve to the same place and the target passes containment. A probe confirmed it: with `link -> real` and `real/hf-embed.sock` present, `resolveContainedTarget('<scratch>/link', ['hf-embed.sock'])` returned `{"status":"ok","target":"<scratch>/real/hf-embed.sock"}`. The `isSymlink(dir)` check at `:1996` is therefore the only thing that stops a delete in a linked server folder (a linked `SPECKIT_IPC_SOCKET_DIR`, or the folder of an `HF_EMBED_SERVER_URL` socket) from landing at the link's target. No test exercises that branch: the four symlink fixtures in the suite link a source path (`vitest:437`), a bin folder (`:845`), the database `vectors` folder (`:1201`) and a direct target (`:1494`), and nothing asserts the reason "its directory is a symlink". The doc comment at `:1688-1690` adds an overclaim, "a planted link can never redirect a delete", which is true only for links under the root, not for a linked root. Severity stays P2 under `review-core.md:52`: a guard claims only the class it checks, and `resolveContainedTarget` checks a linked target and a parent that leaves the real root, neither of which a linked root is; the caller that needs the stronger rule has it today.
   Finding class: security test gap on a destructive path (load-bearing guard with no regression test), plus an overbroad doc promise.
   Scope proof: the server-folder delete at `:1995-2000` is the only caller where a linked root is unwanted. The other callers of `deleteContained` pass `ctx.dbDir` (`:1958-1964`), the M5 model-cache base (`:2007`) and the compiled-path bases (`:1948`), where a linked folder is an operator's intended configuration and deleting at the real location is correct. `removeEmptyDir` refuses a linked folder on its own (`:1808`), and a linked `--socket-dir` never yields a `socket-dir` item because `checkModelServer` requires `lstat(...).isDirectory()` (`:1385`).
   Affected surface hints: add an apply test that points `SPECKIT_IPC_SOCKET_DIR` (or the folder of an `HF_EMBED_SERVER_URL` socket) at a symlink to a folder holding the fixed server files, and assert the files survive and the action reads refused with "its directory is a symlink" (`sweep-lane-residue.vitest.ts`, near `:1118-1130`); narrow the doc comment at `sweep-lane-residue.mjs:1688-1690` to links under the root, or move the linked-root refusal into `resolveContainedTarget` behind an option.
   Case: deleting the `isSymlink(dir)` check at `:1996` leaves the whole suite green, and apply then deletes `hf-embed.sock` inside the real target of a linked `SPECKIT_IPC_SOCKET_DIR`.

## Traceability Checks

- `spec_code`: partial. The delete-safety contract in the tool header (`sweep-lane-residue.mjs:41`, "refused when it is a symlink or resolves outside that root") matches the code at `:1709` and `:1721`, and the test-header contract (`vitest:37-38`) matches for links under a root. The protocol stays partial because the REQ-009 residual from iteration 1 (R1-P2-002) is unchanged.
- Replay re-check, security subset: R2-P2-001 holds (`:1371`, a name the address adds is listed only as a socket); R9-P2-001 holds (`:1561-1565` notes a rejected file without printing lines, and `:1546` asks the env-secret CLI for keys only).

## Integration Evidence

- Env-secret CLI call `spawnSync(process.execPath, [ENV_SECRET_CLI, 'keys', name])` at `sweep-lane-residue.mjs:1546`, read to confirm M7 never reads values.
- Ollama HTTP API `DELETE /api/delete` at `sweep-lane-residue.mjs:1852`, read to settle the remote reach of the shared-model delete.

## Edge Cases

- Ambiguity: the prompt pack's second `Prior Findings` line again kept unsubstituted tokens (`{p0_count}`); the STATE SUMMARY line (P0=0 P1=0 P2=2) and the registry were used.
- Check-to-apply gap: the socket-only rule for an address-added name is checked before apply (`:1371`, `:1888`) and not re-checked at delete time (`:1995-2000`), with `stopProcess` in between. Not filed; see Ruled Out.
- Coverage: one iteration is left and two dimensions (traceability, maintainability) remain, so iteration 3 must cover both; three of four is 75%, below the 80% coverage gate.

## Confirmed-Clean Surfaces

- `resolveContainedTarget` refuses a linked target, a name with `/`, `.` or `..`, and a parent whose real path leaves the real root (`:1697-1722`); tested at `vitest:1491-1498` and through the database path at `vitest:1197-1209`.
- `deleteContained` keeps a directory where a file was expected (`:1745-1748`); `removeEmptyDir` refuses a linked or non-directory folder and removes only an empty one (`:1808-1820`).
- Apply keeps every server file while any foreign or unstoppable server, or an unread process list, may still use them (`:1975-1991`).
- Only a process running this checkout's script is signalled (`:1977-1980`).

## Ruled Out

- Check-to-apply type gap for an address-added socket name: exploiting it needs a same-user write into that folder inside the window bounded by the stop timeout, and an actor with that access can delete the file directly, so no trust boundary is crossed.
- Process command lines printed at `:2127`: they come from the user's own `ps` output on the user's own terminal, are filtered to model server and Ollama processes, and the known launcher passes no secret on argv.
- Ollama host printed in the question and action log: `normalizeOllamaHost` returns `url.origin` (`:846`), which drops any `user:pass@` credentials. The DELETE goes to the host the operator configured, only after an explicit yes or `--shared-model delete`, and the question names that host.

## Next Focus

- Dimension: traceability and maintainability, combined.
- Focus area: traceability across `025-review-p2-fixes` spec.md, tasks.md and acceptance-criteria.md against the code and the 024 review report, including `checklist_evidence` and the overlay protocols that apply (`feature_catalog_code`, `playbook_capability`); maintainability of the doc comments and test header in `sweep-lane-residue.mjs` and its vitest file.
- Reason: the last iteration must cover both remaining dimensions, or coverage stays at 75% and STOP stays blocked.
- Rotation status: correctness and security done; traceability and maintainability remain, with one iteration left.
- Blocked/productive carry-forward: direct reads plus small `node` probes of exported functions were productive again. `fixture_realism` stays exhausted.
- Required evidence: file:line for each REQ and checklist row checked, and a `notApplicable` record for any core protocol that does not apply.

Review verdict: PASS
