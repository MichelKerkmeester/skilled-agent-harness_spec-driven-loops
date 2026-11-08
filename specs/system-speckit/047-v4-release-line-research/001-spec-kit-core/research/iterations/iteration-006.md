# Iteration 6 — Q8 (handover / environment settings in the owning skill) and Q9 (scripts with no caller)

## FOCUS

Q8: does `system-spec-kit` describe what v4.0.0.13–v4.0.2.0 shipped? Q9: which spec-kit scripts have no caller, and what breaks if removed? Secondary: read the v4.0.0.11 / v4.0.0.12 path-limited diffs for this cluster.

## ACTIONS TAKEN

1. Path-limited diffstat for five release steps against the cluster (`.skilled/skills/system-spec-kit`, `.skilled/commands/speckit`):
   - `v4.0.0.12..v4.0.0.13`: 82 files; the reviewable surface is `runtime/hooks/claude/{shared,compact-inject,session-prime}.ts`, `runtime/hooks/lib/spec-gate/spec-gate-core.mjs`, `cli/runtime-mirrors/*`, plus three new vitest files (`save-continuity-write`, `typo-flags`, `hook-adapter-path-parity`). The rest is regenerated `runtime/data/trigger-index.json` (93k lines) and retrieval fixtures.
   - `v4.0.0.13..v4.0.0.14` (140 files), `v4.0.0.14..v4.0.0.15` (224), `v4.0.1.0..v4.0.2.0` (183): dominated by `templates/**` rewrites and `runtime/tests/history-*.vitest.ts`. `v4.0.0.14`'s only `runtime/` change is `validate.sh`'s git-monitor fix, matching its note.
   - `v4.0.0.10..v4.0.0.11` (22 files, as the focus said) and `v4.0.0.11..v4.0.0.12` (4 files): the latter is **only** regenerated artifacts — `runtime/data/trigger-index.json` plus three retrieval fixtures. No code. So a release was cut for an index rebuild alone.
2. Read the release notes' Spec Kit / handover sections for v4.0.0.13, v4.0.0.14, v4.0.0.15, v4.0.1.0, v4.0.2.0.
3. Grepped the owning skill for each shipped term: `speckit:handoff`, `session-relaunch`, `SYSTEM_SESSION_RELAUNCH`, `relaunch` across `SKILL.md` and `references/**` → **zero matches in both**.
4. Confirmed the command *is* shipped: `.skilled/commands/speckit/handoff.md` exists with a full contract, and `.skilled/commands/speckit/README.txt` lists it.
5. Read `references/config/environment-variables.md` (211 lines) → no `SESSION_RELAUNCH`; compared against `.env.example`, which carries 20 `SESSION_RELAUNCH` lines.
6. Enumerated 26 scripts under `runtime/cli/spec` and `runtime/cli/retrieval` and counted references outside their own path (excluding `specs/`, `node_modules`, `dist`). Lowest: `sync-phase-map-status.ts` (1), `measure-cold-lookup.mjs` (4), `test-validation.sh` (6).
7. Probed `sync-phase-map-status.ts` by running it: source entry fails, `dist/` copy succeeds.
8. Checked `Phase Documentation Map` ownership: the table is filled **by hand** in `speckit-plan.yaml:98` / `speckit-complete.yaml:159` activities; no workflow calls the sync script.

## FINDINGS

### F1 — `/speckit:handoff` and the whole session-relaunch loop are invisible to the owning skill

- **Type:** drift · **Severity:** P2 · **Release:** v4.0.0.13 (untouched by v4.0.0.14, which only added the switch) · **Confidence:** high
- **Claim:** v4.0.0.13 shipped a new speckit command and a cross-runtime session-relaunch loop. The command family's own index knows about it; `system-spec-kit`'s `SKILL.md` and `references/**` do not mention it once.
- **Evidence:**
  - `rg -n "speckit:handoff|session-relaunch|SYSTEM_SESSION_RELAUNCH|relaunch" SKILL.md` → no output; the same grep over `references/` → no output.
  - The only trace in `SKILL.md` is the word `handover` in the keyword list [SOURCE: .skilled/skills/system-spec-kit/SKILL.md:8], which names the packet's `handover.md` doc, a different artifact.
  - The command exists and distinguishes the two artifacts explicitly: "The note this command writes is gitignored runtime state for the next session, not a spec packet's `handover.md`" [SOURCE: .skilled/commands/speckit/handoff.md:2].
  - The command index lists it as a first-class command, delegating to `session-relaunch.cjs prepare` [SOURCE: .skilled/commands/speckit/README.txt:116].
- **Why it matters:** `system-spec-kit` is the skill that owns spec-folder continuity, and its `handover.md` row in the intent table says "continue later / pass context / ending session" routes to `/speckit:save` handover maintenance. A model asked to continue a long session therefore reaches for the packet doc and never learns that a runtime relaunch loop exists, that it ships **off**, or that `/speckit:handoff` is the manual trigger. The two surfaces answer the same operator request and only one is routed.
- **Verify:** `rg -n "speckit:handoff|session-relaunch|SYSTEM_SESSION_RELAUNCH" .skilled/skills/system-spec-kit/SKILL.md .skilled/skills/system-spec-kit/references` (expect no output) versus `rg -n "handoff" .skilled/commands/speckit/README.txt` (expect the command row).

### F2 — The command index says "9-command" while its own table lists ten

- **Type:** bug (doc self-count) · **Severity:** P2 · **Release:** v4.0.0.13 (the count was correct before `handoff` was appended) · **Confidence:** high
- **Claim:** adding `handoff` to the family left the README's structural comment stating a nine-command index.
- **Evidence:** `README.txt` line 116 reads "This file, 9-command index and workflow guide" [SOURCE: .skilled/commands/speckit/README.txt:116], while the COMMANDS table carries a `handoff` row and `grep -c '^| \*\*'` on the same file returns 12 bold rows across the table set.
- **Why it matters:** the README is the machine-read inventory for the family (SKILL.md and the AGENTS command table both point at this folder). A stale count is small, but it is the exact field a reader uses to know whether a command is missing.
- **Verify:** `sed -n '116p' .skilled/commands/speckit/README.txt; awk '/^## 2\. COMMANDS/,/^<!-- \/ANCHOR:commands -->/' .skilled/commands/speckit/README.txt | grep -c '^| \*\*'` → `9-command index` versus `10`.

### F3 — The opt-in switch that decides whether a session relaunches is absent from the skill's environment reference

- **Type:** drift · **Severity:** P2 · **Release:** v4.0.0.13 (variable added), v4.0.0.14 (default flipped to off — the release that makes the omission matter) · **Confidence:** high
- **Claim:** `references/config/environment-variables.md` presents itself as the reference for Spec Kit environment variables and carries zero `SESSION_RELAUNCH` entries, while `.env.example` carries 20.
- **Evidence:**
  - File title/description: "Environment Variables Reference … Configuration options via environment variables for the Spec Kit system" [SOURCE: .skilled/skills/system-spec-kit/references/config/environment-variables.md:2], 211 lines total, `grep -c SESSION_RELAUNCH` → 0.
  - `.env.example` `grep -c SESSION_RELAUNCH` → 20.
  - v4.0.0.14 turns the behaviour off by default and adds per-runtime switches: "no session changes until you set `SYSTEM_SESSION_RELAUNCH_ENABLED=1`".
- **Why it matters:** an operator or model reading the skill's own reference cannot discover why no session hands over, and v4.0.0.14's change is precisely a silent default. The v4.0.0.13 note points at `/doctor:env` and `.env.example`, so the setting is documented outside the skill — the skill's reference is the stale copy, not the only copy. That is the drift: one reference claims the setting space and does not cover it.
- **Verify:** `grep -c SESSION_RELAUNCH .skilled/skills/system-spec-kit/references/config/environment-variables.md .env.example` → `0` and `20`.
- **Residual:** whether a repo-root `ENV-REFERENCE.md` (named by the v4.0.0.13 note) covers the same switches was **not** confirmed this iteration; `find` returned only vendored copies inside spec packets before truncation. Treat the canonical doc's coverage as unverified, not as absent.

### F4 — The documented invocation of `sync-phase-map-status.ts` fails; only the compiled `dist/` copy runs

- **Type:** bug · **Severity:** P2 · **Release:** present at v4.0.2.0 (not isolated to a tag) · **Confidence:** high (reproduced)
- **Claim:** the script is documented as a runnable `.ts` entry and imports `../lib/esm-entry.js`, which exists only under `dist/`. Run from source, node raises `ERR_MODULE_NOT_FOUND` and exits 1.
- **Evidence:**
  - Documented as an executable: `sync-phase-map-status.ts     # Sync a phase parent's map table; report completion mismatches` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/README.md:74], listed again with a behaviour description at line 114.
  - The import: `import { isMainModule } from '../lib/esm-entry.js';` — the only `.ts` in `runtime/cli/spec` that imports it (`is-phase-parent.ts` imports bare `fs`/`path` and runs fine).
  - `dist/lib/esm-entry.js` exists, so the compiled copy resolves.
- **Repro (ran):**
  - `node .skilled/skills/system-spec-kit/runtime/cli/spec/sync-phase-map-status.ts --dry-run specs/system-speckit/047-v4-release-line-research` → `NODE_EXIT=1`, `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '.../runtime/cli/lib/esm-entry.js'`.
  - `node .skilled/skills/system-spec-kit/runtime/cli/dist/spec/sync-phase-map-status.js --dry-run specs/system-speckit/047-v4-release-line-research` → `DIST_EXIT=0`, printing `directChildren: 5`, `phaseMapRowsCorrected: 0`, `completionPctMismatchesFound: 0`.
- **Why it matters:** the README documents the source path as the entry, so the documented command is the broken one. A model following the README gets a module-resolution trace, not the report — and reads it as "the tool is broken" rather than "run the build output". Every other sibling script in the same directory is invoked by its `.sh`/`.mjs` path.
- **Verify:** the two commands above; compare exit statuses.

### F5 — Nothing invokes the phase-map sync, and the workflow still says "fill it by hand"

- **Type:** over-engineering / extension · **Severity:** P2 · **Release:** present at v4.0.2.0 · **Confidence:** high
- **Claim:** `sync-phase-map-status.ts` has no caller anywhere outside its own README and vitest suite, while the phase workflow instructs the agent to fill the parent `Phase Documentation Map` manually.
- **Evidence:**
  - Caller scan across `.skilled`, `.github` and `package.json` for the script name returned only `runtime/cli/spec/README.md`, its own source, its vitest file, `runtime/cli/tests/fixtures/README.md` and build output under `dist/`. No YAML, no command doc, no CI entry.
  - The phase workflow's activity list: `"Fill parent Phase Documentation Map"` [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:98], repeated at `speckit-complete.yaml:159`.
  - The canon requires the table: "The parent folder adds a **Phase Documentation Map** section to its spec.md", which "tracks all child phases, their status, and their descriptions" [SOURCE: .skilled/skills/system-spec-kit/references/templates/template-guide.md:1127].
- **What breaks if removed:** the vitest suite and one README row. Nothing in any workflow, hook or CI stops working — which is the over-engineering half of the finding. But the two defects it detects (a map row whose status disagrees with its child; a blank line that silently truncates the table) have **no** counterpart in `validate.sh`, so removal also deletes the only check for a canon-required table.
- **Extension (concrete):** call the script from the phase workflow's fill step, dry-run first, and add a `PHASE_MAP_IN_SYNC` validate rule that fails on a row/child status mismatch and warns on the blank-line truncation. That turns a canon requirement into a gated one and gives the orphan script the caller it is missing.
- **Verify:** `rg -l --fixed-strings "sync-phase-map-status" .skilled .github package.json | grep -v dist/` → README, source, tests only; then `rg -n "Phase Documentation Map" .skilled/commands/speckit/assets/*.yaml` → the by-hand activities.

## QUESTIONS ANSWERED

- Q9 — which scripts have no caller, no test, or duplicate another, and what breaks if removed: one orphan identified end to end (F4, F5). `sync-phase-map-status.ts` is **tested** but **uncalled**. `is-phase-parent.ts` runs from source and is referenced by the README plus the phase flow. `measure-cold-lookup.mjs` (4 refs) and `test-validation.sh` (6) were measured but not read.
- Q8 — which v4.0.0.13–v4.0.2.0 changes are missing or stale in `SKILL.md`/`references`: F1 (handover + relaunch loop, entirely absent), F3 (relaunch switches, absent from the env reference). The handover limb and the environment-settings limb are answered; the Decisions Through the Question Tool limb was not run this iteration and is carried.

## QUESTIONS REMAINING

- Q8 residual: the **Decisions Through the Question Tool** limb (v4.0.2.0) and the v4.0.1.0 "answers reach the decision record" limb were read in the notes only. Neither was grepped against `SKILL.md`/`references`. Also unverified: whether a repo-root `ENV-REFERENCE.md` (named in the v4.0.0.13 note) exists and covers the relaunch switches.
- Q9 residual: the rules/options limb. `runtime/cli/rules` carries paired `.sh`/`.cjs` implementations (`check-canonical-save-*`, `check-frontmatter*`, `check-graph-metadata*`); whether each pair is a thin shim or a duplicate implementation was not read, and neither was whether every registered rule has a failing fixture.
- Q10–Q12 untouched by this iteration's findings: operator friction across the speckit commands (F2 is adjacent but is a self-count, not command friction), sk-code/sk-doc conformance, and concrete extensions beyond F5.
- F3 depends on one missing probe (canonical `ENV-REFERENCE.md` location and coverage).

## NEXT FOCUS

Q9's rules limb next: read one `.sh`/`.cjs` pair end to end to decide shim versus duplicate, and check whether each registered rule has a fixture that proves it fails when it should. Then Q10: run `/speckit:save` and `/speckit:search` against their documented flags to capture error text, exit codes and output length as a real operator sees them.

## SCOPE VIOLATIONS

None. Every write landed under the run directory. Reads touched only the researched surfaces; the one command executed outside a read was `sync-phase-map-status` in `--dry-run` form, which prints and does not write (`phaseMapRowsCorrected: 0`, and the dist run's `(dry-run)` banner confirms the mode).
