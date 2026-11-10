# Iteration 1: Fresh-clone external-user journey (clone to green battery)

## Focus

Q2 — walk the external user's journey end to end in a real `git clone` of the prepared base (tracked files only, NO `node_modules`, NO untracked build output): what must they provision first, then follow ONLY the root README block "What Adapting `sk-code` Looks Like" (README.md:1445-1485) to remove the two examples, recording every step that fails or is ambiguous, up to the green battery.

## Actions Taken

Copy path (fresh-clone recipe):
`/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/8bb7f97a-f291-4af3-b712-1b46f9323681/scratchpad/028/runs/swe-max-i1-clone-CtIh`
(`git clone -q <base> $X` — one commit `d122851e base`; Node v26.8.2, Python 3.9.6 on PATH.)

1. Baseline battery on the pristine clone (before any edit), exit codes:
   - `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code` → EXIT 1
   - `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` → EXIT 1 (crash)
   - `node .skilled/bin/compiled-route-guard.cjs` → EXIT 0 (all hubs fresh)
   - `node .skilled/bin/compiled-route-sync.cjs --check` → EXIT 0 (all 7 hubs resolve, 55 served copies match)
   - `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` → EXIT 0 (4 guards pass)
   - `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "add a postgres migration for users"` → EXIT 0, `"action":"defer"`
2. Located the missing module: `root-router-contract.cjs:65` requires `@spec-kit/shared/frontmatter/parse-frontmatter.js`; in the worktree that file exists only as untracked build output at `.skilled/skills/system-spec-kit/shared/dist/frontmatter/parse-frontmatter.js` and via `.skilled/node_modules` (gitignored). Clone has `shared/` TS sources but no `dist/` and no `.skilled/node_modules`.
3. Performed the README removal recipe on both `sk-code-webflow` and `sk-code-obsidian`: deleted the packet dirs; edited `mode-registry.json` (`modes` entries + `extensions.surface-axis.surfaces`) and `hub-router.json` (`routerPolicy.tieBreak`, `routerSignals`, the four named `vocabularyClasses`); ran `generate-leaf-manifest.cjs --write .skilled/skills/sk-code` (wrote manifest, exit 0). Skipped the README's hand-edit legs (ROUTER.md §11, SKILL.md, playbook rows, canary fixture) to observe what the battery catches.
4. Post-removal battery: parent-skill-check EXIT 1 (`3d: modes[2] is not an object`, `modes[4]`, plus 12-lib); compiled-route-guard EXIT 1; compiled-route-sync --check EXIT 1 `SYNC FAILED: authored closure failed to resolve hubs: sk-code`; run-all-drift-guards EXIT 1 (`check 1a: 97 problems`, dead routes into `sk-code-webflow/...`); verify-doc-claims EXIT 1 (`check paths: 258 problems`); compiled-route prompt EXIT 0.

## Findings

| class | claim | evidence | coverage | severity |
|---|---|---|---|---|
| JOURNEY | A real `git clone` fails the battery before any adaptation. `parent-skill-check` exits 1 with `FAIL: 12-lib: failed to load the root-router contract library: Cannot find module '@spec-kit/shared/frontmatter/parse-frontmatter.js'`; `ci-skill-root-metadata.cjs` exits 1. Both hard-depend on `@spec-kit/shared/dist`, untracked build output that exists only after `npm --prefix .skilled/skills/system-spec-kit install && run build` — steps documented at README.md:160-183 but never referenced from the adapting block's "Before you start" (README.md:1449-1452), which lists only git hooks and the specs/ keep-rule. Prior copy runs (025 V0) symlinked `node_modules` read-only from the worktree, masking this; a true clone has no node_modules at all. | clone run: `parent-skill-check` exit 1 `FAIL: 12-lib ...`; clone `ls .skilled/skills/system-spec-kit/shared/dist` → No such file; `.skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs:65`; README.md:1449-1452 vs 160-183; `git check-ignore node_modules` → ignored | NEW (025 V0's provisioned base had node_modules symlinked; the no-node_modules clone was never tested) | P0 |
| BREAK | `ci-skill-root-metadata.cjs` does not produce a named failure when provisioning is missing — it dies in the CJS loader with an uncaught `Error: Cannot find module '@spec-kit/shared/...'` stack trace. The "doctor/guard/sync messages name the fix" contract (026 R3/R7) only applies after the contract library loads; the not-yet-provisioned state fails with a raw Node stack and no fix hint. | clone run: `ci-skill-root-metadata.cjs` exit 1, `node:internal/modules/cjs/loader:1573 throw err` + Require stack naming `root-router-contract.cjs`, `ci-skill-root-metadata.cjs` | NEW (R3 shipped named failures for authored-closure drift; this is a pre-drift provisioning crash no message covers) | P0 |
| BREAK | README step "delete the mode's `modes` entry" (README.md:1457) is ambiguous for `mode-registry.json`, whose `modes` map is numerically keyed ('0'..'4', each value a mode object). Literal deletion leaves a sparse map; doctor then fails `3d: modes[2] is not an object (got null)` and `modes[4]` — i.e., remaining entries must be re-keyed to a dense 0..n-1 sequence, which the block never says. | clone run after literal delete: `FAIL: 3d: modes[2] is not an object (got null)`, `modes[4]`; `node -e` print of `Object.keys(mr.modes)` → ['0'..'4'] | NEW (025 F61's observed checklist says "drop both modes from mode-registry.json" without recording the sparse-index failure) | P1 |
| JOURNEY | Post-removal battery catches the skipped hand-edits at scale: drift-guard `check 1a` reports 97 problems (dead routes to `sk-code-webflow/...` in ROUTER.md §11); `verify-doc-claims` reports 258 problems, including `shared/references/performance-loading-checklist.md:98` linking into deleted `sk-code-webflow/references/...` — a shared/ file the user is told to keep carries links into a deletable example, and README step 5's edit list does not name shared/references. | clone run: `FAIL check 1a ... (97 problem(s))`, `dead route: sk-code-webflow/references/implementation/implementation-workflows/condition-based-waiting.md`; `FAIL check paths ... (258 problem(s))`, `shared/references/performance-loading-checklist.md:98` | ALREADY-COVERED by 025 F61 (258-path count verified V3); NEW evidence: the shared/→example back-link file:line and the 97-problem ROUTER.md count | P1 |
| JOURNEY | The adapting block's step 1 (`install-git-hooks.sh`, README.md:1451) understates the fresh-clone case: README.md:203 requires `git config --local skilled.trustRepoHooks true` for another clone before hooks run there. Without it, the re-mint gate never fires in the clone and the user must hand-refresh+copy the manifest forever — the exact step order a fresh-clone user hits first. | README.md:203 ("Another clone runs its own copies only after `git config --local skilled.trustRepoHooks true`"), README.md:1451 | NEW detail (R9/F89 cover hooks-install but not the per-clone trust flag in the guide) | P1 |
| JOURNEY | "Add your own surface" step 1 (README.md:1468) requires running `/create:skill-parent update --surfaces` inside an AI runtime — there is no terminal-only path; a shell-only evaluator cannot complete the add leg. Not reached this iteration (time); flag for iteration 2. | README.md:1468; no CLI equivalent in `.skilled/bin` observed | ALREADY-COVERED by 025 F78 (automation matrix) in substance; the no-terminal-path framing is NEW emphasis | P2 |
| OK | The rest of the pristine-clone battery is green without provisioning: compiled-route-guard exit 0 (all hubs fresh), sync --check exit 0 (55/55 copies match), drift guards exit 0. Confirms the base control-run claim modulo the two dist-dependent checks. | clone run exit codes above | OK | P2 |
| OK | `compiled-route.cjs --prompt "add a postgres migration for users"` returns `defer` on the pristine clone — generic backend stacks route nowhere until the user adds a surface; quantifies R5's UX cost as a defer, not a misroute. | clone run: `"action":"defer","targets":[]` | ALREADY-COVERED by operator ruling R5 | P2 |

## Options and Recommendations

| option | what it changes | failure it prevents today | cost and blast radius | cheaper move and why it fails |
|---|---|---|---|---|
| Add a prerequisites line to the adapting block: "Before you start" → point at §4 install steps (`npm --prefix .skilled/skills/system-spec-kit install && run build`, advisor runtime) | README.md:1449-1452, +2 lines | P0 findings 1-2: doctor/metadata failing or crashing on a fresh clone with a raw module error and no pointer | Doc-only; zero blast | Having doctor print "run npm install" fails: check 12-lib cannot load its own contract library to evaluate anything — the failure is at require time, so the fix pointer must live in the doc the user reads first |
| Amend README step 2: state that `modes` entries are numbered `0..n` and remaining entries must be re-keyed dense after a delete | README.md:1457 | P1: sparse-map `3d` failure after a faithful literal delete | Doc-only | Relaxing check 3d to tolerate sparse keys changes invariant semantics and lets real corruption pass |
| Add `git config --local skilled.trustRepoHooks true` to block step 1 | README.md:1451 | P1: hooks silently never run in the fresh clone; manifest re-mint automation (F89) never fires | Doc-only | Renaming the flag is worse; a wrapper script is more machinery than one line |
| (defer to later iteration) doctor command vs hub mode — no new evidence this iteration | — | — | — | — |

## Ruled Out

- Re-running the provisioned-copy recipe (APFS clone with node_modules): the dispatch's control-run is already green there and it cannot reproduce the external user's clone path — it masks the provisioning gap (same masking 025 V0 had via symlinked node_modules).

## Dead Ends

- None definitively; the add-surface leg (slash command requires an AI runtime) is deferred, not dead.

## Edge Cases

- Missing dependency: `.skilled/node_modules` and `shared/dist` absent in the clone — that absence IS the finding (JOURNEY P0), not a limitation of the run.
- Partial success: the add-surface leg of Q2 was not executed (runtime dependency + clock); status `complete` is still justified — the provisioning gate and full removal leg are evidenced end to end.
- My removal edits used `JSON.stringify` (2-space) which may reorder/reformat `mode-registry.json`/`hub-router.json` vs original style; findings do not depend on formatting (failures are semantic: sparse keys, dead routes).

## Sources Consulted

- README.md:1445-1485 (adapting block), README.md:150-203 (§4 install + hooks trust), README.md:1384
- `.skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs:65`
- `.skilled/skills/sk-code/mode-registry.json`, `.skilled/skills/sk-code/hub-router.json` (clone copies; structures printed)
- specs/.../025-external-surface-priority-research/research/research.md:153 (F54), :160 (F61), :187 (F78), :203 (F89), :419 (V0), :495 (R9), :500 (R8)
- Command outputs: the clone battery runs cited above (copy path recorded)

## Assessment

- New information ratio: 0.60 (4 fully new findings — provisioning gap, metadata crash, sparse-modes, trustRepoHooks; 2 partially new — quantified dead-route counts, no-terminal-path framing; 2 confirmatory/OK)
- Questions addressed: Q2 (provisioning + removal + verify legs), partial Q3 (doc-only fixes identified; the 97-problem ROUTER.md leg is a generator candidate), Q6 (each finding classified vs 025/026/027)
- Questions answered: Q2 — substantially (add-surface leg remains)

## Reflection

- What worked: a TRUE `git clone` rather than the provisioned copy — it immediately surfaced the masked dependency on built `dist/` output that every prior copy-based run symlinked away. Running the baseline battery BEFORE editing separated provisioning failures from removal failures cleanly.
- What did not: grep-based output filtering on `compiled-route-guard` missed its failure text (pattern mismatch); the exit code still recorded.
- What I would do differently: next iteration should run the full add leg inside a provisioned copy (to isolate add-path friction from provisioning noise) or document the terminal-only absence.

## Recommended Next Focus

Q1 residual / Q2 add leg: run `/create:skill-parent update --surfaces <stand-in>` equivalent steps in a provisioned copy, plus hand-edit `tieBreak` misplacement to test doctor check 5l (027) on a fresh clone; and check whether `compiled-route-guard`'s post-removal failure message names the re-mint fix (capture its full text — my grep missed it).
