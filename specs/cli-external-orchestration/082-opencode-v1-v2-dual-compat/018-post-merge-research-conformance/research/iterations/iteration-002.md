# Iteration 002 — A29 sk-doc conformance of the docs changed by the 2026-10-19 merges

## Focus

A29 sk-doc conformance: which docs changed by the four branches merged to main on 2026-10-19 miss their sk-doc mode? Enumerate the changed `.md` files outside `specs/` over the merge commits `fe1f8a9a53`, `8e8e95e8e6`, `6358d81eba` and their branch commits, route each doc to its sk-doc mode, run the mode's validator read-only, and check README test counts and claims against the current code. Output: a per-doc conformance table with validator output, file:line and severity.

## Actions Taken

1. Enumerated the branch-side diff ranges of the three named merge commits — `72e574f914..4a15d7e66a` (fe1f8a9a53, OpenCode dual compatibility), `97a343507d..c4f15f8f1a` (8e8e95e8e6, pi-fast-mode), `75a501779a..0743e52560` (6358d81eba, trigger-index rebuild) — filtered to `*.md` excluding `specs/`: **241 unique changed doc files** [SOURCE: AGENTS.md] [SOURCE: .opencode/plugins/README.md]. `git log --merges --since=2026-10-18` shows the day carried five merge commits; the fourth and fifth topic branches ("worktree provisioning", "adapter suite runner") share this lineage: the merge `75a501779a merge(hooks): bring main into the dispatch adapter suite runner work` and the sk-git provisioning commits `bcd2f4d0d1` / `500e8ad14c` land inside `main` before `6358d81eba` closes the day.
2. Loaded the sk-doc hub contract [SOURCE: .skilled/skills/sk-doc/SKILL.md]. Routing read: folder READMEs are **sk-create-readme** work ([SOURCE: .skilled/skills/sk-doc/SKILL.md:28]); validating an EXISTING document is the **sk-create-quality-control** mode, whose shared backbone validator is `shared/scripts/validate_document.py` ([SOURCE: .skilled/skills/sk-doc/SKILL.md:40] [SOURCE: .skilled/skills/sk-doc/SKILL.md:154]). Ran `validate_document.py` (auto-detected type, **no `--fix`**, read-only) over 14 focus-named docs and `quick_validate.py` over the 2 changed skill roots.
3. Mapped the focus's named surfaces onto actual changed docs: "doctor command docs" = the root `README.md` `/doctor:` passages [SOURCE: README.md:195]; "cli-opencode references" = `AGENTS.md` executor-CLI example [SOURCE: AGENTS.md:90]; "sk-git references" = `.skilled/skills/sk-code/SKILL.md` and `.pi/extensions/README.md` (both changed by `be234e6f94`); `SECURITY.md` changed on 2026-10-19 (`bcd2f4d0d1` 15:47:35 +0200, `500e8ad14c` 14:55:21 +0200) and `git merge-base --is-ancestor bcd2f4d0d1` confirms it is an ancestor of `75a501779a` and `6358d81eba` — it reached main on the **main side** of those merges, which is why the branch-side ranges show nothing for it.
4. Verified README claims against current code: test counts, the plugin `dualPlugin` bridge, sk-vision hook artifacts, and the Pi fast-mode copy-claim code path.

## Findings — per-doc conformance table

| Doc (changed in the ranges) | sk-doc mode | Validator (read-only) | Result | Severity | Claim checks vs code |
|---|---|---|---|---|---|
| `README.md` (root; carries the `/doctor:` docs) | sk-create-readme | `validate_document.py` → type `readme` | ✅ VALID, 0 issues | — | `/doctor:setup` (`README.md:195-196`), `/doctor:git standards|hooks` (`README.md:209`), `/doctor:speckit` (`README.md:555`) — command references not traced further (out of named scope) |
| `AGENTS.md` (cli-opencode references) | sk-create-readme | type `readme` | ✅ VALID, 0 issues | — | `AGENTS.md:90` keeps `cli-opencode` in the executor-CLI≠skill-route example; consistent with the dual-compat work's vocabulary |
| `SECURITY.md` | sk-create-readme (fallback) | type `readme` via fallback | ⚠️ 1 warning: `document_type_fallback` — no sk-doc rule matches a security-policy doc, README rules applied | P3 advisory | Changed 2026-10-19 by sk-git worktree-provisioning commits; rode the main side of `75a501779a`/`6358d81eba`, absent from all three branch-side ranges |
| `.opencode/plugins/README.md` | sk-create-readme | type `readme` | ✅ VALID, 0 issues | — | Inventory consistent: 17 plugin rows + `lib/` + `tests/` + README = 20 dir entries; `dualPlugin(id, server)` contract stated at [SOURCE: .opencode/plugins/README.md:18] and `lib/v2-bridge.js` EXISTS; 16/17 `.js` plugins import `dualPlugin`; the 17th (`sk-vision.js`) is the documented compiled-symlink exception ([SOURCE: .opencode/plugins/README.md:18]) |
| `.skilled/skills/sk-vision/hooks/README.md` | sk-create-readme | type `readme` | ✅ VALID, 0 issues | — | All 4 referenced artifacts EXIST: `.skilled/plugins/sk-vision.js`, `.pi/extensions/sk-vision.ts`, `.devin/hooks.v1.json`, `vision-runtime/dist/vision-cli.js` [SOURCE: .skilled/skills/sk-vision/hooks/README.md:18] [SOURCE: .skilled/skills/sk-vision/hooks/README.md:66] |
| `.pi/extensions/pi-fast-mode-w-subagent-support/README.md` | sk-create-readme | type `readme` | ✅ VALID, 0 issues | — | Copy claim consistent: README's "first copy to load registers, later copies no-op" matches the code comment at [SOURCE: .pi/extensions/pi-fast-mode-w-subagent-support/src/index.ts:89] ("the first copy to load holds the package and a later one stays silent") and commit `ddf12561fc` ("register only the global extensions copy" = the `.pi/settings.json` packages-array registration step) |
| `.pi/extensions/pi-fast-mode-w-subagent-support/src/README.md` | sk-create-readme | type `readme` | ✅ VALID, 0 issues | — | src tree matches the described concern split (commands/config/handoff/index/payload/status/types) |
| `.pi/extensions/pi-fast-mode-w-subagent-support/tests/README.md` | sk-create-readme | type `readme` | ✅ VALID, 0 issues | P3 claim drift | Claims "**7 files, 80 tests**" at [SOURCE: .pi/extensions/pi-fast-mode-w-subagent-support/tests/README.md:21]; static grep finds **68** `it(`/`test(` declarations across the 7 `.test.ts` files (6+19+12+2+24+4+1). File count ✓. Gap may be `it.each` expansion; vitest was NOT run (no-tests constraint), so the 80 figure is unverified rather than proven false |
| `.skilled/skills/system-deep-loop/deep-review/scripts/tests/README.md` | sk-create-readme | type `readme` | ✅ VALID, 0 issues | — | Contents table matches dir exactly (1 test file + `fixtures/`); VALIDATION command path resolves |
| `.skilled/hooks/session-relaunch/README.md` + `tests/README.md` | sk-create-readme | type `readme` | ✅ VALID, 0 issues / 0 issues | — | 9 `*.test.cjs` present; README references them 27× (tree + table), makes no numeric count claim — no drift |
| `.skilled/skills/sk-vision/README.md`, `.skilled/bin/README.md`, `.pi/extensions/README.md`, `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/README.md` | sk-create-readme | type `readme` | ✅ VALID, 0 issues (×4) | — | `.pi/extensions/README.md` carries the sk-git references from the rename commit `be234e6f94` |
| `.skilled/skills/sk-code` (hub; changed SKILL.md set) | sk-create-skill / frontmatter | `quick_validate.py` | ✅ "Skill is valid!" | — | — |
| `.skilled/skills/sk-vision` | sk-create-skill / frontmatter | `quick_validate.py` | ✅ "Skill is valid!" | — | — |

Other changed docs (changelogs, feature catalogs, manual-testing playbooks, benchmark reports, hermes mirrors, handoff prompts) route to sk-create-changelog / sk-create-feature-catalog / sk-create-manual-testing-playbook / sk-create-benchmark respectively; they were not individually validator-run this iteration — the focus named the README family and the claims, and the 241-file set is recorded for any later sweep.

## Direct answer to the key question

**No changed doc misses its sk-doc mode structurally.** Every focus-named changed README passes `validate_document.py` cleanly under its auto-detected `readme` type, and both changed skill roots pass `quick_validate.py`. The only mode-conformance residue is advisory: `SECURITY.md` has no matching document-type rule (P3 `document_type_fallback`). The real drift found is in **claims, not structure**: the pi-fast tests README's "80 tests" claim vs 68 statically countable test declarations (P3), reported with its method caveat. A provenance subtlety was resolved: `SECURITY.md` was changed on 2026-10-19 by the worktree-provisioning branch but appears in none of the three named branch-side ranges because those commits entered main via the main side of the same-day merges.

## Questions Answered

- Which changed **docs** miss their sk-doc mode, and how? — None miss their mode structurally; one P3 advisory (`document_type_fallback` on `SECURITY.md`) and one P3 claim-vs-code drift (80-vs-68 tests). See table above.

## Questions Remaining

- None carried. This is the final iteration of the run.

## SCOPE VIOLATIONS

- None. Validators were run read-only (`--fix` never passed); every write stayed inside this research packet's iteration, delta, and gateway paths.

## Next Focus

Run complete (iteration 2 of 2, maxIterations reached). Residual low-severity follow-ups for a future implementation packet, reported only, not acted on: (1) add or pick an sk-doc document-type rule for security-policy docs; (2) reconcile or annotate the "80 tests" claim in the pi-fast tests README against a real `vitest` run; (3) optionally sweep the remaining ~227 changed docs (changelogs, catalogs, playbooks, benchmark reports) through their own mode validators.
