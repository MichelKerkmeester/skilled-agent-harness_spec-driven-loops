# Iteration 002 — Security

**Mode:** review | **Dimension:** security | **Target:** staged rename `sk-code-opencode` → `sk-code-skilled`, `code-opencode` → `code-skilled`, sk-code surface id `OPENCODE` → `SKILLED` (`git diff --cached HEAD`).
**Evidence base:** `git diff --cached -M HEAD` (2,917 staged paths); staged-diff added-line scan restricted to non-`specs` paths; 52-file explicit token scan plus directory walks over `.skilled`, `.opencode`, `.hermes`, `.pi`; symlink/path checks; 32 renamed-spec metadata files parsed and link-checked.

## FILES REVIEWED

- Hub routing set: `.skilled/skills/sk-code/{mode-registry,hub-router,graph-metadata,leaf-manifest,description}.json`; `SKILL.md`; `ROUTER.md`; `README.md` (all `old:0`; new identity present)
- Renamed packet: `.skilled/skills/sk-code/sk-code-skilled/SKILL.md:1-16`; `assets/scripts/router-replay-lib.cjs:495,510,518,526,629`; `assets/scripts/verify-router-sync.cjs`; `scripts/run-all-drift-guards.sh`; `scripts/tests/verify-router-sync.test.cjs`
- Sibling surface: `.skilled/skills/sk-code/sk-code-review/SKILL.md:223,249`
- Detection contract: `.opencode/plugins/system-skill-advisor.js:363,1342`; `.skilled/skills/system-skill-advisor/runtime/tests/system-skill-advisor-plugin.vitest.ts:67,72`
- Doctor pins + tests: `.skilled/commands/doctor/scripts/{parent-skill-check,sk-code-setup-check}.cjs`; `tests/{parent-skill-check-invariants,sk-code-setup-check}.test.cjs`
- Bin tests/fixtures: `.skilled/bin/tests/compiled-route-surface-hint.test.cjs`; `compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json`; `compiled-routing/013-live-activation/activation/sk-code/manifest.json`
- Symlink + mirror: `.skilled/changelog/sk-code/code-skilled`; `.hermes/skills/sk-code-skilled/SKILL.md:1-16`
- Renamed spec metadata: 32 `description.json`/`graph-metadata.json` under `specs/sk-code/002-rust-standards-for-code-skilled/**` and `specs/sk-code/001-sk-code-parent/{027,028}-*`
- Retrieval surfaces: `phrase-variants.json:90907`; `trigger-index.json`; `cite-drift-redirects.json`; `durable-directory-manifest.json`

## FINDINGS

### P0
None.

### P1
None.

### P2

**R2-P2-001 — Pre-rename surface token survives as identifier naming inside the hub (confirm intent)** (instance-only)
- Files: `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs:518,526,629` (primary); `.skilled/skills/sk-code/sk-code-review/SKILL.md:223,249`
- Evidence: the replay library renames its surface key/value in this same change — `SKILLED: ['sk-code-skilled/']` at :495 and `return 'SKILLED'` at :510 — yet keeps the pre-rename token as identifier: `const OPENCODE_LANGUAGES = [...]` (:518, used at :629) and `function detectOpencodeLanguages(...)` (:526). The sibling review surface keeps `OPENCODE_PATH_MARKER = ".skilled/"` (:223, :249) — the marker value already points at the renamed tree. A focused hub walk shows every other uppercase-`OPENCODE` occurrence under `.skilled/skills/sk-code` is either a runtime env-var mention (`SKILL_BENCH_OPENCODE_VARIANT`, `OPENCODE_GOAL_*` in prose) or a dated benchmark report.
- Counter-evidence: the sweep's safe pattern only rewrote `code`-prefixed kebab tokens and quoted `'OPENCODE'` values, and runtime-flavored names are deliberately preserved elsewhere (`.opencode/` paths, `OPENCODE_GOAL_*` env vars, `RUNTIME_OPENCODE_COMPILED_ROUTE`, `OPENCODE_TRANSFORM_DEDUP_ENV`). Both identifiers are internal, self-consistent, and have no runtime effect.
- Impact: identity hygiene only — the operator decision renames the surface id to `SKILLED` inside the hub, and these identifiers still name the renamed surface's own language set and path marker.
- Recommendation: rename to `SKILLED_LANGUAGES` / `detectSkilledLanguages` and `SKILLED_PATH_MARKER`, or record an explicit "identifier naming is out of scope" decision.
- Confidence: medium. Downgrade trigger: if the rename decision intentionally excluded identifier-level naming, close as accepted naming debt.

### P2 (carried, not new this iteration)
- R1-P2-001 — `phrase-variants.json:90907` still maps `sk code opencode rename impact` to the old variant; this iteration's explicit scan confirms the single occurrence and that no new-name sibling was added.
- R1-P2-002 — three historical records in `specs/` scratch/archive paths untouched.

## EXCLUSION AND CONSISTENCY AUDIT (criteria 1-5)

1. **Runtime names preserved.** Non-`specs` added-line scan for `cli-skilled`: zero. `.opencode/` references preserved (16 added); no `.opencode/plugins` path was rewritten to `.skilled/plugins` — both roots exist and the plugin file is staged as a modification, not a rename; the added `--root .skilled/plugins` invocation is a real path. OPENCODE samples in the advisor plugin (:363 `OPENCODE_TRANSFORM_DEDUP_ENV`, :1342 `RUNTIME_OPENCODE_COMPILED_ROUTE`) and the vitest (:67,:72 OpenCode plugin surface keys) are runtime context and correctly preserved.
2. **Old identity outside exclusions.** Non-`specs` added-line scan: exactly 1 hit, the already-registered `phrase-variants.json` entry. Live-tree walk for `sk-code-opencode|code-opencode`: 14 files / 1,983 occurrences, every one under `**/benchmark/reports/**` (documented exclusion). Zero hits in skills, registries, plugin, doctor, tests, fixtures, mirrors, hooks, changelogs, or `.pi`. (Walk skips files >2MB; the one large fixture was covered by the explicit scan.)
3. **Hub consistency.** 52-file token scan: `old:0` across registries, docs, plugin, doctor, tests, fixtures, indices; new identity present (`sk-code-skilled`/`code-skilled`, and `SKILLED` where the surface id is expressed). `git diff --cached --summary` shows no old/new mode lines — the only type change is the 120000 symlink delete/create pair. Single uppercase-`OPENCODE` identifier residual → R2-P2-001.
4. **Renamed spec folders.** All 32 metadata files parse as valid JSON, carry zero old-identity tokens, and have zero missing relative links (checked against both file-dir and repo-root bases).
5. **Symlink and mirror.** `.skilled/changelog/sk-code/code-skilled -> ../../skills/sk-code/sk-code-skilled/changelog` resolves true; the old symlink is absent; sibling symlinks intact; the followed target lists the packet changelog. `.hermes/skills/sk-code-skilled/SKILL.md` carries `name: sk-code-skilled` and the generated banner pointing at the canonical source; the 187 differing lines vs source are the generation banner (expected for a generated mirror).

### Ruled out (documented, no finding)
- Packet `SKILL.md` H1 (`# opencode Surface — System-Code Evidence`) and body prose ("OpenCode system code") keep the bare lowercase runtime name — the documented exclusion class; the sweep's safe pattern deliberately cannot rewrite bare `opencode`. Same confirm-intent question as R2-P2-001 if zero OpenCode branding is wanted in the hub.
- `.skilled/commands/create/assets/*.yaml` legacy `# OPENCODE CREATE:` banner comments (26 files, outside the hub) and legacy env/root identifiers (`OPENCODE_ROOT` = `.skilled`, `OPENCODE_DEADLINE_MS` in hooks) — runtime-era branding preserved by design, outside the surface-id rename scope.

## TRACEABILITY CHECKS

| Protocol | Result |
| --- | --- |
| spec_code (core) | pass — `specs/sk-code/012-sk-code-skilled-rename/` phases 001-003 describe exactly this rename; the staged diff matches the plan's safe-pattern scope |
| checklist_evidence (core) | partial — `review/scope-files.txt` (278 paths) used as the review manifest; acceptance rows not re-run this iteration |
| skill_agent (overlay) | pass — hub registries/docs carry only the new identity; advisor plugin surface detection consistent |
| agent_cross_runtime (overlay) | pass — `.devin/skills -> ../.skilled/skills` resolves; `.hermes` regenerated with the new identity; `.pi` clean; `.opencode/plugins` preserved |
| feature_catalog_code (overlay) | pass — feature-catalog and two-axis registry doc carry no old identity |
| playbook_capability (overlay) | pass — renamed playbook scenarios and detection docs carry no old identity |

## VERDICT

P2-only this iteration → PASS per the mapping (no P0/P1). `hasAdvisories=true`.

## NEXT DIMENSION

traceability — verify the renamed spec packets' identity fields and evidence chains end-to-end (`spec_code`, `checklist_evidence`), including changelog symlink continuity and the hermes mirror.

Review verdict: PASS
