# Deep Review Iteration 001

## Dispatcher

- Route: `Resolved route: mode=review target_agent=deep-review`
- Run: `2026-11-16T11:20:27.056Z`, generation 2, lineage `restart`
- Iteration: 1 of 5, derived from the state log (no prior `type:"iteration"` record)
- Dimension: correctness
- Focus: read the renamed code under `.skilled/hooks/cli-dispatch/`, `decision-capture/`, `completion-evidence/` and `subagent-dispatch-guard/` file by file; prove that every import, require, spawned path and test target resolves, and that each adapter still matches its README.

---

## Files Reviewed

| File | Lines / scope |
|---|---|
| `.skilled/hooks/cli-dispatch/README.md` | full file (278 lines) |
| `.skilled/hooks/cli-dispatch/pi/dispatch-preflight-lint.ts` | imports `9-14`, loader `466-475` |
| `.skilled/hooks/vitest.config.ts` | full file (36 lines) |
| `.skilled/hooks/decision-capture/README.md` | full file (173 lines) |
| `.skilled/hooks/decision-capture/lib/capture-core.mjs` | `1-120` (imports, queue path, lock constants) |
| `.skilled/hooks/completion-evidence/README.md` | full file (228 lines) |
| `.skilled/hooks/subagent-dispatch-guard/README.md` | full file (200 lines) |
| `.skilled/hooks/subagent-dispatch-guard/lib/subagent-dispatch-guard.cjs` | `1-80` (imports, registry and state paths) |
| Four concern trees (74 `.mjs`/`.cjs`/`.js`/`.ts` files) | static import/require/spawn resolution |
| `006-codex-check-and-advisory-fixes/implementation-summary.md` | full file, to check the phase-6 alias claim against code |

The 74-file sweep covered every script under the four folders, including the 15 symlinked importers, by resolving each importer through its real path.

---

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **README prescribes a removed Pi import fallback and a Vitest alias that does not exist** -- `.skilled/hooks/cli-dispatch/README.md:115` -- Section 2 says the Pi preflight tries a long repo-relative specifier first and falls back to `../lib/`, and that only the long specifier resolves through a test alias in `.skilled/hooks/vitest.config.ts`. The adapter now imports `../lib/dispatch-audit.mjs` and `../../shared/hook-flags.mjs` directly at `[SOURCE: .skilled/hooks/cli-dispatch/pi/dispatch-preflight-lint.ts:11]` and `[SOURCE: .skilled/hooks/cli-dispatch/pi/dispatch-preflight-lint.ts:12]`, and loads the rule engine by relative path at `[SOURCE: .skilled/hooks/cli-dispatch/pi/dispatch-preflight-lint.ts:471]`. The hooks Vitest config defines `root` and `test` only, with no `resolve.alias`, at `[SOURCE: .skilled/hooks/vitest.config.ts:23]`. Section 7 repeats the alias rationale at `[SOURCE: .skilled/hooks/cli-dispatch/README.md:257]` and claims at `[SOURCE: .skilled/hooks/cli-dispatch/README.md:261]` that a config-less run fails on the Pi adapter's `hook-flags.mjs` import. The same alias story appears at `[SOURCE: .skilled/hooks/subagent-dispatch-guard/README.md:92]`. A reader cannot tell the current import contract from the retired one.

   Finding class: `doc_code_drift`
   Scope proof: README, Vitest config and Pi adapter read at the cited lines; the direct import targets exist and resolve, so the code is internally consistent while the README is not.
   Affected surface hints: `cli-dispatch/README.md` Section 2 (Boundaries) and Section 7 (Validation); `subagent-dispatch-guard/README.md` Section 3 (Pi); `.skilled/hooks/vitest.config.ts`.
   Case: A maintainer adding one more Pi extension copies the documented long-specifier fallback and an alias that no longer exists, or debugs the documented `hook-flags.mjs` resolution failure that the direct import does not have.

2. **Directory tree omits the Vibe adapter folder** -- `.skilled/hooks/cli-dispatch/README.md:166` -- The Section 4 tree lists `lib/`, `claude/`, `codex/`, `devin/`, `cursor/`, `pi/`, `dsh/`, `opencode/` and `tests/`, but not `vibe/`. Section 3 documents the Vibe runtime at `[SOURCE: .skilled/hooks/cli-dispatch/README.md:132]`, and the adapter exists as a link at `.skilled/hooks/cli-dispatch/vibe/dispatch-preflight.mjs` to `.vibe/plugins/repo-guards/dispatch-preflight.mjs`. The tree is the folder's navigation surface, so the one runtime that is only a link is also the one the tree does not show.

   Finding class: `documentation_completeness`
   Scope proof: directory listing confirms the `vibe/` link and its target; README Section 3 and Section 4 read at the cited lines.
   Affected surface hints: `cli-dispatch/README.md` Section 4 (Directory Tree); the `vibe/` link and its `.vibe` target.
   Case: A reader maps the concern from the tree, misses the Vibe runtime, and edits or removes the unlisted link during a cleanup.

---

## Traceability Checks

| Protocol | Status | Evidence | Summary |
|---|---|---|---|
| `spec_code` | partial | `[SOURCE: .skilled/hooks/cli-dispatch/README.md:115]`, `[SOURCE: .skilled/hooks/vitest.config.ts:23]` | Phase 6 reports the alias removed from both spec-kit Vitest configs, and the code agrees. Two concern READMEs still describe a hooks-config alias and a Pi fallback that the code no longer uses, so the spec-to-code path is clean only for the code side. |

`checklist_evidence` was not run this iteration; the focus was code and README resolution, not the packet's acceptance rows.

---

## Integration Evidence

- `.skilled/hooks/vitest.config.ts` was read because both rewritten READMEs name it as the alias owner. It owns no alias; its `root` is the repository root and its `include` stays inside the hooks tree.
- The 15 symlinked importers were checked through their real targets: the `system-spec-kit/runtime/hooks/` tree, `.opencode/plugins/` and `.vibe/plugins/repo-guards/`. Every relative import and literal spawn path resolves from the real path, which is the base Node uses.
- `.skilled/hooks/decision-capture/lib/capture-core.mjs` constants agree with the README: queue under `.skilled/skills/.state/decision-capture` at `[SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:40]`, two-minute stale lock at `[SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:46]`, ten-second wait at `[SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:48]`.
- `.skilled/hooks/subagent-dispatch-guard/lib/subagent-dispatch-guard.cjs` names the same registry and state locations the README names at `[SOURCE: .skilled/hooks/subagent-dispatch-guard/lib/subagent-dispatch-guard.cjs:46]` and `[SOURCE: .skilled/hooks/subagent-dispatch-guard/lib/subagent-dispatch-guard.cjs:47]`.

---

## Edge Cases

- **Symlink base was the first false positive.** A naive resolver reported 47 missing imports because it resolved from the link location. Resolving each importer through `realpath` reduced the count to 0. The naive result is recorded here so it is not mistaken for a finding.
- **Static resolution only.** The sweep proves literal relative `import`/`export … from`/`require`/dynamic-import specifiers and literal spawn targets. Computed specifiers, template strings and paths assembled at runtime were not proven and are deferred to a later pass.
- **`vibe/` is outside `reviewScopeFiles`.** The link is inside the review target tree but was not in the generated scope list; it was reviewed as a discovered surface because Section 3 of the README names it.

---

## Confirmed-Clean Surfaces

- All 74 script files under the four renamed concerns resolve every static relative import, require and literal spawn path (`MISSING_COUNT=0`).
- No live file under the four concerns references a removed folder name (`hooks/git/`, `hooks/codex-watchdog/`, `hooks/hook-install/`, `hooks/dispatch/`, `hooks/task-dispatch/`, `hooks/completion/`): 0 hits.
- Every runtime adapter and test the four READMEs name exists: Pi and DSH decision-capture adapters and their test, both OpenCode test suites, the four hook test files, and `system-deep-loop/mode-registry.json`.
- The Pi preflight's production imports are direct and resolve; there is no missing-fallback breakage at runtime.

---

## Ruled Out

- **Rename left stale imports.** Ruled out by the 74-file realpath sweep; 0 missing.
- **Rename left stale folder strings in live code.** Ruled out by the old-path search; 0 hits.
- **READMEs name adapters or tests that were removed.** Ruled out; the suspicious Pi/DSH and OpenCode names all exist.
- **The Pi preflight fails to load because its fallback was removed.** Ruled out; the remaining direct imports resolve.

---

## Verdict

PASS with advisories. 0 P0, 0 P1, 2 P2. Both findings are documentation drift around the phase-5/6 import and alias cleanup; neither changes hook behavior.

## Next Focus

Iteration 2, security: hook trust boundaries. Check the `cli-dispatch` audit scrubber against `--api-key`/bearer/JWT/PEM forms, the shared kill-switch resolver against environment-versus-file precedence, the stdin deadline and body caps, and whether any adapter logs raw command text or secrets. Read the cores, not the READMEs.

Review verdict: PASS
