# Iteration 3: Q3 /doctor command and route surface

## Focus

Audit the `/doctor` command surface, canonical route manifest, subsystem handler YAMLs, and doctor scripts for post-CocoIndex-deprecation staleness plus packet 116 deep-skill-evolution impact. This pass classified only operator-facing live issues as findings; historical changelog residue stayed out of the finding list.

## Actions Taken

- Inventoried doctor command surfaces across `.opencode/commands/doctor`, `.claude/commands/doctor`, `.gemini/commands/doctor`, and `.codex`, plus doctor scripts under `.opencode/skills`.
- Grepped doctor commands, route manifests, handler YAMLs, and doctor scripts for CocoIndex/ccc/daemon/rerank/sidecar/8765/cross-encoder/cocoIndexAvailable tokens and read live hits in context.
- Read `.opencode/commands/doctor/_routes.yaml`, `.opencode/commands/doctor/speckit.md`, `.opencode/commands/doctor/update.md`, and the six primary subsystem handler YAMLs.
- Ran `bash .opencode/commands/doctor/scripts/route-validate.sh` to check canonical route-manifest consistency.
- Swept doctor files for 116-related stale skill/path signals, including old `sk-*` assumptions and relocated `deep-loop-runtime` storage paths.

## Findings

- **[P1 / STALE-LIVE]** `.opencode/commands/doctor/assets/doctor_deep-loop.yaml:78` — handler allows `mcp_server/database/deep-loop-graph.sqlite` and line 162 stats that same path, while the canonical `/doctor deep-loop` route points at `.opencode/skills/deep-loop-runtime/storage/deep-loop-graph.sqlite` in `.opencode/commands/doctor/_routes.yaml:92`; live `/doctor deep-loop` diagnostics can inspect or validate the removed pre-116 DB location.
- **[P1 / STALE-LIVE]** `.opencode/commands/doctor/assets/doctor_update.yaml:100` — `/doctor:update` mutation boundaries still allow `mcp_server/database/code-graph.sqlite` and line 106 still allows `mcp_server/database/deep-loop-graph.sqlite`, while the current command doc says code graph uses `.opencode/skills/system-code-graph/database/code-graph.sqlite` at `.opencode/commands/doctor/update.md:8` and deep-loop uses `.opencode/skills/deep-loop-runtime/storage/deep-loop-graph.sqlite` at `.opencode/commands/doctor/update.md:219`; live update validation can snapshot or validate dead runtime DB paths.
- **[P1 / STALE-LIVE]** `.opencode/commands/doctor/update.md:4` — `/doctor:update` frontmatter allows `mcp__mk_spec_memory__advisor_recommend/status/validate/rebuild`, but the workflow calls `mk_skill_advisor.advisor_rebuild({ force: true }) + mk_skill_advisor.advisor_validate({})` in `.opencode/commands/doctor/assets/doctor_update.yaml:433`; live advisor rebuild/validation can be blocked by stale MCP tool ownership after advisor extraction.
- **[P1 / STALE-LIVE]** `.opencode/commands/doctor/speckit.md:101` — the no-argument `/doctor` menu still advertises `6) Debug Code Graph (semantic search daemon)` and the help maps semantic/daemon symptoms to `6` at lines 133-134, but the canonical route manifest has only `memory`, `causal-graph`, `code-graph`, `deep-loop`, `skill-advisor`, and `skill-budget`; selecting the live menu's option 6 hits no mapping and points operators at the removed CocoIndex-era semantic daemon concept.
- **[P2 / STALE-LIVE]** `.opencode/commands/doctor/scripts/route-validate.sh:30` — the route validator defaults `ROUTER_FILE` to `$COMMANDS_DIR/doctor.md`, but the real router is `.opencode/commands/doctor/speckit.md`; the validation run returned `WARN: F1: could not extract allowed-tools from router frontmatter; skipping F2 subset check`, so CI currently misses stale tool-surface drift like the `/doctor:update` advisor tool ownership mismatch.
- **[P2 / STALE-LIVE]** `.opencode/commands/doctor/assets/doctor_code-graph.yaml:158` — code-graph missed-file analysis says granular includeSkills lists include only `.opencode/skills/sk-*` folders and exclude all other skill folders, but packet 116 renamed deep skills to `deep-*`; live `/doctor code-graph` diagnostics can undercount or omit renamed `deep-*` skill folders when activeScope is granular.

## Ruled Out

- No live `cocoindex`, `CocoIndex`, `ccc`, `coco.?daemon`, `doctor:cocoindex`, `cocoindex-daemon`, `rerank`, `sidecar`, `8765`, `cross-encoder`, or `cocoIndexAvailable` hits were found in `.opencode/commands/doctor`, `.claude/commands/doctor`, `.gemini/commands/doctor`, or the checked doctor scripts, except a correct read-only `reindex` prohibition in `doctor_skill-budget.yaml`.
- No `doctor:cocoindex`, `doctor-cocoindex-daemon`, or `cocoindex-daemon` route/playbook survived in the doctor command inventories.
- The canonical `.opencode/commands/doctor/_routes.yaml` core route list is post-Coco: it contains exactly six subsystem routes and no semantic-daemon/CocoIndex route.
- `route-validate.sh` confirmed schema version, duplicate-target checks, YAML asset existence, mutation-class validity, and trigger phrases for the six core routes; the remaining validator problem is the skipped frontmatter subset check, not missing route YAML assets.
- CocoIndex/ccc strings found under `.opencode/skills/system-code-graph/changelog/` are historical changelog content, not live `/doctor` execution paths.

## Questions Answered

Q3 is substantially answered for the OpenCode doctor surface: no live CocoIndex daemon route survived, but several live doctor paths still carry stale operator-facing assumptions from the CocoIndex removal and 116 deep-skill-evolution work. The route manifest itself is mostly internally consistent, but the validator is pointed at the wrong router file, so its pass does not fully prove tool-surface consistency.

## Questions Remaining

Q4 remains partially open for non-doctor command surfaces and additional renamed skill references outside doctor. Q5 remains open for cross-runtime parity, especially whether Claude/Gemini doctor command wrappers intentionally mirror the OpenCode surface or have runtime-specific gaps.

## Next Focus

Q5 cross-surface and four-runtime consistency: compare `.opencode`, `.claude`, `.gemini`, and `.codex` command inventories for install/script/doctor parity after CocoIndex removal and packet 116 renames.
