# Deep Review Iteration 1 — Correctness

- **Target:** `.skilled/skills/cli-orca` (with its review scope: mcp-tooling hub boundary, advisor routing surfaces, sk-doc package validators, packet `specs/cli-orca/002-consolidate-official-orca-skills`)
- **Dimension:** correctness
- **Iteration:** 1 of 5 · **Lineage:** new (generation 1) · **Mode:** review
- **Focus:** routing-contract consistency, package/derive integrity, hub-boundary residue

## FILES REVIEWED

- `.skilled/skills/cli-orca/SKILL.md:101-108` — `INTENT_SIGNALS` block (worktree/terminal/browser/automations/official-skills/recovery keywords)
- `.skilled/skills/cli-orca/SKILL.md:150-167` — `orca_qualified_phrases()` docstring and `route()` lane selection
- `.skilled/skills/cli-orca/SKILL.md:28-58` — keyword triggers and the bare-token qualification rule
- `.skilled/skills/cli-orca/SKILL.md:260-269` — `NEVER` rules, including the generic-vocabulary prohibition
- `.skilled/skills/cli-orca/README.md:20-30` — "Routes on" contract row
- `.skilled/skills/cli-orca/graph-metadata.json` — advisor identity, `intent_signals`
- `.skilled/skills/cli-orca/leaf-manifest.config.json`, `leaf-manifest.json`, `leaf-aliases.json` — class-S derive chain (34 leaves, aliases set-equal)
- `.skilled/skills/cli-orca/assets/PROVENANCE.md:48-57` — per-skill revision records
- `.skilled/skills/cli-orca/manual-testing-playbook/routing/negative-holdouts.md:23-31` — ORCA-002 holdout contract
- `.skilled/skills/cli-orca/references/orca-skills/orca-cli.md:39-56` — guide section references
- `.skilled/skills/cli-orca/benchmark/reports/2026-09-20--extraction-routing-verification/report.md:1-45` and `routing-replays.json` — captured routing evidence
- `.skilled/skills/mcp-tooling/mode-registry.json`, `hub-router.json`, `ROUTER.md` — nine-mode hub boundary
- `.skilled/skills/system-skill-advisor/runtime/config/route-exclusions.json` and `runtime/lib/routing/route-exclusions.ts:1-45` — advisor exclusion lane
- `specs/cli-orca/002-consolidate-official-orca-skills/resource-map.md:20-25,65` — declared audit surfaces
- `specs/cli-orca/002-consolidate-official-orca-skills/spec.md:107-129`, `tasks.md:135-156` — requirements and task ledger used for the cross-check (no `applied/T-*.md` exists in this packet)

Mechanical checks run across the scope: JSON validity for every in-scope JSON (only vendored `node_modules` tsconfig files are non-strict JSON, out of scope); relative-link resolution across all 32 cli-orca markdown files (0 dangling); `node --check` on 6 in-scope `.cjs` files and `ast.parse` on 4 in-scope `.py` files (0 failures); sha256 comparison of all 8 asset snapshots against both the vendored `context/orca-main/skills/<name>/SKILL.md` files and the PROVENANCE `SKILL.md sha256` column (8/8 identical); stale `mcp-orca` sweep across `.skilled/skills/{mcp-tooling,cli-orca}` and packet 002.

## FINDINGS BY SEVERITY

### P0 — Blockers

None.

### P1 — Required

#### P1-001 — Smart Router pseudocode admits generic, non-Orca vocabulary, contradicting its own qualification rule and NEVER #7

- **File:** `.skilled/skills/cli-orca/SKILL.md:101-108` (signal table); contradicted by `:58` and `:268`
- **Claim:** `INTENT_SIGNALS` admits phrases that carry no Orca qualifier, so `route()` can select an Orca lane for a request that never mentions Orca. Terminal lane keywords include `read the terminal`, `send to the terminal`, `terminal receipt`; browser lane includes `embedded browser`; automations lane includes `share skills`; recovery lane includes `runtime stopped`, `executable missing`, `guide mismatch`, `ambiguous send`. A prompt such as "please read the terminal and share skills" yields non-empty signals and returns `{"action": "load", "load_level": "AUTOMATIONS"...}` with no Orca token present.
- **Evidence:** `orca_qualified_phrases()` is documented as "Only Orca-qualified phrases count. The bare token is excluded on purpose." (`SKILL.md:151`); §1 states routing "needs an Orca-qualified multi-word phrase or a named Orca surface" (`SKILL.md:58`); NEVER #7 states "Never route a bare `orca` token, an `OpenOrca` model label, or generic worktree, terminal, browser or orchestration vocabulary into this skill" (`SKILL.md:268`). The `README.md:24` "Routes on" row repeats the Orca-qualified-only contract. `FOREIGN_OWNERS` does not protect these cases because it only defers when a foreign phrase is present and no `orca`-prefixed signal matched.
- **Counterevidence sought:** looked for a disclaimer marking the pseudocode as illustrative/non-normative (none in `SKILL.md`); checked whether the operative activation path (`graph-metadata.json` `intent_signals`, advisor) shares the generic phrases (it does not — advisor signals are Orca-qualified, so live advisor behavior is not currently mis-routed); checked ORCA-002 holdouts for a generic-terminal fixture (absent).
- **Alternative explanation:** the generic phrases are intended Orca product vocabulary (`embedded browser`, `terminal receipt` are Orca-adjacent terms), and the pseudocode may be a non-executed illustration. This softens real-world impact but does not remove the document-level contradiction: several phrases (`read the terminal`, `send to the terminal`, `share skills`, `runtime stopped`) are unambiguously generic and are explicitly forbidden by NEVER #7.
- **Final severity:** P1 (spec mismatch inside the skill's primary contract; false-positive routing if the documented algorithm is followed).
- **Confidence:** 0.82
- **Downgrade trigger:** a maintainer confirms the pseudocode is non-normative illustration and designates `graph-metadata.json` `intent_signals` as the sole operative vocabulary — then this collapses to P2.
- **Recommendation:** restrict `INTENT_SIGNALS` to Orca-qualified phrases (or require at least one Orca-qualified companion phrase before lane selection), and add a generic terminal/browser negative holdout to the playbook so the rule is pinned by a fixture.

### P2 — Advisory

#### P2-001 — `ORCA_SKILLS` signal set omits two official skill names that §1 lists as triggers

- **File:** `.skilled/skills/cli-orca/SKILL.md:106` vs `:30`
- **Evidence:** §1 Keyword Triggers lists `linear-tickets` and `orchestration` among the official names that activate the skill "when the request places them in Orca". The `ORCA_SKILLS` keyword list contains `orca-cli`, `orchestration skill`, `computer-use`, `orca-linear`, `orca-emulator`, `orca-per-workspace-env` — no `linear-tickets` token and no name-only `orchestration` token. "Help me with the linear-tickets skill in Orca" and "set up orca orchestration" match no keyword and fall through to `UNKNOWN_FALLBACK` (`orca-emulator-android` is covered only incidentally via substring).
- **Recommendation:** add `linear-tickets` and a name-only `orchestration` keyword, or align §1's list with the implemented set.

#### P2-002 — Resource map omits the benchmark evidence artifacts that are in review scope

- **File:** `specs/cli-orca/002-consolidate-official-orca-skills/resource-map.md:65`
- **Evidence:** the review scope includes `.skilled/skills/cli-orca/benchmark/reports/2026-09-20--extraction-routing-verification/report.md` and `routing-replays.json`; the map declares only the not-yet-created `benchmark/reports/2026-09-20--playbook-post-remediation/**` (PLANNED) and never lists the existing evidence directory it is partly built on. The required `applied/T-*.md` cross-check could not run as specified — packet 002 has no `applied/` directory and `tasks.md` carries no `target_files` keys — so the cross-check used the task ledger (T036 records the benchmark path) plus the review scope list. All 53 declared resource-map rows exist on disk, and all five cited `specs/cli-orca/001-mcp-orca-cli/...` evidence paths resolve.
- **Recommendation:** add a row for the extraction/routing verification benchmark (or a glob for `benchmark/reports/**`) so the coverage gate arms on the artifacts it actually reviews.

## TRACEABILITY CHECKS

- **Core `spec_code`** — sampled: REQ-001 class-S root shape verified (no hub-only `description.json`/`mode-registry.json`/`hub-router.json`; manifest 34 leaves, aliases set-equal, generated from config); REQ-002 hub nine modes verified (registry modes=9, `routerSignals` 9 keys, no Orca key, ROUTER.md clean); REQ-003 verified (all `mcp-orca` hits confined to changelog history, spec narrative and citations of moved evidence); REQ-005 verified byte-level (8/8 assets == vendored source == PROVENANCE `SKILL.md sha256`); REQ-014 spot-checked (no secret-pattern hits in cli-orca assets). REQ-004/REQ-006 rest on captured evidence in `scratch/gate-results.md` and `routing-replays.json` — recorded as claimed-not-reverified this iteration. REQ-013/T044 remain open (`tasks.md:154`), consistent with the in-progress packet state.
- **Core `checklist_evidence`** — tasks.md T035–T038, T045 carry completed status and their named evidence paths exist; T039–T046 are open, matching `Status: In Progress` in `spec.md`.
- **Overlay `skill_agent`** — divergence found between `SKILL.md` signal table and the §1/NEVER/README/graph-metadata contract (P1-001, P2-001). Claimed capability ("official-skill awareness in Orca context") is under-implemented in the signal table.
- **Overlay `agent_cross_runtime`** — `.pi/skills` is a symlink to `.skilled/skills`; `cli-orca/SKILL.md` sha256 identical via both paths. No drift.
- **Overlay `feature_catalog_code`** — catalog subfiles, benchmark report and replay file exist at declared paths; 0 dangling relative links across 32 cli-orca markdown files.
- **Overlay `playbook_capability`** — ORCA-002 pins the OpenOrca and generic-worktree holdouts (both defer under the documented algorithm); the generic terminal/browser class is unpinned, which is the fixture gap feeding P1-001.

## RULED OUT

- Dangling-looking `references/browser.md`, `references/automations.md`, `references/publishing.md` in `orca-cli.md:39-56` — these are upstream guide section names (`guide: skill-guides/orca-cli.md`), not local routing targets. Not a defect.
- `PROVENANCE.md` package-digest column differing from file hashes — column 3 is the upstream package digest; column 5 is the `SKILL.md` sha256 and matches all eight files. Correct by design.
- Non-strict JSON under `system-skill-advisor/runtime/node_modules/**/tsconfig.json` — vendored dependencies, outside scope.
- Residual `mcp-orca` mentions in mcp-tooling — confined to changelog history and the moved-evidence carve-out REQ-003 explicitly allows.
- `route-exclusions.json` containing only `sk-communication` — Orca probes do not require an advisory exclusion entry; the TS loader is fail-safe.

## COVERAGE AND NEXT FOCUS

- Dimension coverage: `correctness` covered this iteration (0/4 before, 1/4 after). No prior findings; this iteration opened 3 (P0=0, P1=1, P2=2) and ruled out 5 directions.
- Review depth: `scopeClass=standard` (non-trivial multi-file package); v2 search ledger recorded in the iteration delta.
- Next dimension: `security` — authorization/mutation boundaries, untrusted browser/terminal content handling, redaction completeness (REQ-014), and prompt-injection resilience of the skill's own discovery-stub guidance.

## SCOPE VIOLATIONS

None. The review target was read-only; all writes are confined to the review run directory artifacts.

## VERDICT

One P1 finding is open → **CONDITIONAL**. The machine-parsed self-report is the final line of this file.

Review verdict: CONDITIONAL
