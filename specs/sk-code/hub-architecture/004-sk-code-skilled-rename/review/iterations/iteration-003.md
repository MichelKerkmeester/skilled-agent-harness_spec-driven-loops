# Iteration 003 — Traceability

**Mode:** review | **Dimension:** traceability | **Target:** staged rename `sk-code-opencode` → `sk-code-skilled`, `code-opencode` → `code-skilled`, sk-code surface id `OPENCODE` → `SKILLED` (`git diff --cached HEAD`).
**Evidence base:** `git diff --cached -M HEAD` (2,917 staged paths; 363 renamed spec file pairs); whole-tree exact search for `code-opencode` (4,567 occurrences, classified by path class); 53 renamed `description.json`/`graph-metadata.json` files parsed and identity-checked; inbound search for the 5 old packet basenames derived from rename detection; path-candidate existence scan over 6,904 docs; symlink `readlink`/existence; hermes mirror listing; phase-002 `scratch/baseline/` + `scratch/after/` evidence logs (37 files) inspected against the verification table.

## FILES REVIEWED

- `specs/sk-code/012-sk-code-skilled-rename/002-skill-and-routing-rename/implementation-summary.md:55-107,115-116` (claims: moves, rebuilds, verification table, known limitations)
- `specs/sk-code/012-sk-code-skilled-rename/002-skill-and-routing-rename/scratch/baseline/` and `scratch/after/` (37 logs: drift, guard, pskill, advisor-rebuild, hermes-check, tindex, runtime-names)
- `specs/sk-code/012-sk-code-skilled-rename/description.json:1-10`, `graph-metadata.json:1-12` (packet identity; 82 adds + 3 R100)
- `specs/sk-code/002-rust-standards-for-code-skilled/description.json`, `graph-metadata.json` (renamed packet root identity)
- 53 renamed metadata files across `specs/sk-code/001-sk-code-parent/{027,028}-code-skilled-*`, `specs/sk-code/002-rust-standards-for-code-skilled/**`, `specs/sk-vision/001-sk-vision-fork-of-opencode-senses/015-sk-code-skilled-alignment/**`
- `.skilled/changelog/sk-code/code-skilled` (symlink) and siblings
- `.hermes/skills/sk-code-skilled/SKILL.md:1-8`; `.hermes/skills/` (68 files)
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/phrase-variants.json:90907`
- `specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/001-shared-and-hub-docs/scratch/dispatch-units-extra.json:98`; `.../005-opencode-and-guards/scratch/dispatch-units.json:518`
- `specs/system-speckit/050-open-knowledge-format-adoption/010-source-tag-hardening/scratch/warn-rows.jsonl:3343-3347`

## FINDINGS

### P0
None.

### P1
None.

### P2

**R3-P2-001 — Post-change runtime-name measurement is not stored with the packet's gate evidence** (new)
- Claim: `implementation-summary.md:107` — "Runtime names `.opencode/` and `cli-opencode` | 1,189,410 lines before and after".
- Evidence: the baseline side is stored (`scratch/baseline/runtime-names.txt:1` = `runtime-name lines baseline: 1189410`), but no artifact under `scratch/` carries a post-change count: the 22 after-side logs contain no runtime-names file, and an exact search across both evidence dirs for `1189410` and `runtime-name` returns only the baseline file.
- Counterevidence sought: the count may live outside the packet's scratch dirs (phase 003 scratch, session logs); the metric's scope (which paths count as a "runtime-name line") is not defined anywhere in the packet.
- Alternative explanation: the after measurement was taken inline and never persisted; equality may still hold — iteration 2 independently found runtime names preserved qualitatively (zero `cli-skilled`, `.opencode/` paths intact).
- Impact: advisory — one verification-table claim is not independently reproducible from the packet's declared evidence location (strategy §13: gate evidence lives in `scratch/baseline/` and `scratch/after/`).
- Recommendation: persist the after-side count (e.g., `scratch/after/runtime-names.txt`) or cite where it lives; define the metric's scope.
- Confidence: medium. Downgrade trigger: after-side count located elsewhere or metric scope documented.

**Carried (re-confirmed, not new this iteration)**
- R1-P2-001 — `phrase-variants.json:90907` remains the sole non-exclusion content hit for the old identity; re-confirmed.
- R1-P2-002 — archive/scratch residuals re-confirmed and now enumerated: `specs/sk-prompt/z_archive/004-sk-prompt-small-model-optimization/001-smallcode-deep-research/research/findings-registry.json:1219` (executor id `cli-opencode` — runtime naming, correctly preserved), `specs/sk-code/011-.../scratch/dispatch-units-extra.json:98` and `dispatch-units.json:518` (old→new replacement instructions in historical dispatch records), plus an archive folder-name residual `specs/sk-code/z_archive/006-sk-code-opencode-merger/` visible only in rename-origin metadata (not fully re-verifiable this iteration; folder names are not content-searched).
- R2-P2-001 — hub identifier naming (`OPENCODE_LANGUAGES`, `detectOpencodeLanguages`, `OPENCODE_PATH_MARKER`) unchanged; outside this iteration's checks.

## EXCLUSION AND CONSISTENCY AUDIT (criteria 1-5)

1. **Runtime names preserved.** The 4,567 whole-tree `code-opencode` occurrences resolve to benchmark reports and specs machine records (`.jsonl`/`.err`), packet 012 docs, the four residuals above, and `cli-opencode` executor references (`sk-prompt` findings registry). Zero `cli-skilled`. No `.opencode/` path was rewritten (iteration 2: 16 added `.opencode/` refs, no `.skilled/plugins` substitution).
2. **Old identity outside exclusions.** Content hits outside the exclusion filter: exactly 4 (R1-P2-001, the executor-id record, the two dispatch scratch records) — every one already registered. Zero hits for the old packet basenames `031-align-runtime-code-with-sk-code-opencode` and `046-align-runtime-code-with-sk-code-opencode`; `002-rust-standards-for-code-opencode` hits only in one `.jsonl` machine record (`specs/system-speckit/050-.../scratch/warn-rows.jsonl:3343-3347`, excluded).
3. **Hub routing.** Iteration 2's 52-file scan (`old:0`) stands; this iteration adds: the six playbook scenarios are renamed (`opencode-*.md` → `skilled-*.md`, 6 renames confirmed in the diff); no inbound reference to the old packet names anywhere in the live tree.
4. **Renamed spec folders.** All 53 renamed metadata files parse as JSON; identity fields (`specFolder`, `spec_folder`, `packet_id`, `folderSlug`) match the new folder names; the only `opencode`-bearing values are the legitimate ancestor `sk-vision/001-sk-vision-fork-of-opencode-senses` (a different surface's packet name). Inbound link scan (6,904 docs): 22,028 unresolved path candidates, all inside `specs/sk-code/012-sk-code-skilled-rename/**` (the documented packet-docs exclusion; research history cites pre-rename paths by design); zero outside. Packet 012 root metadata is self-consistent (`specFolder: sk-code/012-sk-code-skilled-rename`, children 001-003); packet 002 root likewise (`sk-code/002-rust-standards-for-code-skilled`). Note: 012's three `R100` entries are `.gitkeep` files paired from unrelated scratch dirs by rename detection — 012 is effectively a new packet (82 adds).
5. **Symlink and mirror.** `code-skilled -> ../../skills/sk-code/sk-code-skilled/changelog` resolves (`SYMLINK-TARGET-OK`); the old symlink is absent; siblings intact. `.hermes/skills/` holds 68 files, matching the "68 copies in sync" claim; `.hermes/skills/sk-code-skilled/SKILL.md:1-8` carries `name: sk-code-skilled` and the generated banner.
6. **Claims vs evidence (added).** Baseline/after parity holds for the logs that have both sides (drift: 4 warning-lines each; `pskill`: 1 each; guard/hub-route/hermes-check/setup/sync-check/typo logs present on the after side) — with the single exception recorded as R3-P2-001.

## TRACEABILITY CHECKS

| Protocol | Result |
| --- | --- |
| spec_code (core) | pass — packet 012 phases and the staged diff describe the same operation; packet identity fields consistent after the move |
| checklist_evidence (core) | pass with gap — verification-table claims map to stored artifacts and live state except the runtime-names after-side value (R3-P2-001) |
| skill_agent (overlay) | pass — no inbound old-identity references in skills; hub set clean (iteration 2) |
| agent_cross_runtime (overlay) | pass — hermes mirror regenerated (68 files, new identity); `.opencode/` plugin preserved; `.pi` clean |
| feature_catalog_code (overlay) | pass — catalog carries no old identity (iteration 2); no new inbound hits |
| playbook_capability (overlay) | pass — six scenarios renamed; zero unresolved links outside packet docs |

## VERDICT

P2-only this iteration → PASS per the mapping (no P0/P1). `hasAdvisories=true`. Maintainability was not covered (final iteration; budget spent on the dispatch focus). Strategy machine blocks are left to the reducer.

## NEXT DIMENSION

None — final iteration (3 of 3). Synthesis owns report assembly; open P2s: R1-P2-001, R1-P2-002, R2-P2-001, R3-P2-001.

Review verdict: PASS
