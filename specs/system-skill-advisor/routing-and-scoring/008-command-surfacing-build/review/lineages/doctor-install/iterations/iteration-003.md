# Review Iteration 3 — traceability

## Dispatcher

- Mode: review; target agent `@deep-review`; detached fan-out lineage `doctor-install`.
- Session: `fanout-doctor-install-1794550137809-1ecgc7`, generation 1.
- Dimension: traceability. Budget profile: verify.
- Operator review focus: this iteration covered "docs that disagree with code" against the actual change diff (`35c3188681..320e7b64d4`, 27 files, 1348 insertions) and confirmed the runtime-coverage claim in `INSTALL-SKILLED.md` against the accepted runtime tables. Holdout hygiene is iteration 4; no holdout file was opened.

## Files Reviewed

- `.skilled/commands/doctor/assets/doctor-symlink-check.yaml:54-69`
- `.skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml:148-193`
- `.skilled/commands/doctor/assets/doctor-setup.yaml:57-61`
- `.skilled/commands/doctor/scripts/codex-hook-approval-check.cjs:166-205`
- `.skilled/commands/doctor/scripts/agents-md-check.cjs:632-700`
- `.skilled/commands/doctor/scripts/README.markdown:100-114,229-236`
- `INSTALL-SKILLED.md:40-71,108,127-152,197`
- `.skilled/skills/system-skill-advisor/INSTALL-GUIDE.md:54,372`
- `_routes.yaml` diff rows (`write_scope` on speckit/deep-loop, embedder route, `env` actions)
- Context evidence: `git diff 35c3188681..320e7b64d4` for the 27 changed paths; `spec/` packet listing (no root `checklist.md`)

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. DR1-P1-001 remains active.

### P2 Findings

1. **A10 reports "copies as expected" for a tree whose CLAUDE.md is missing** -- `.skilled/commands/doctor/scripts/agents-md-check.cjs:649` -- the new `pointer missing` branch (`:695-700`) returns `INFO`, so `failed` and `unmeasured` are both empty and the row detail reads `7/7 copies as expected` while the very same row prints `CLAUDE.md: pointer missing - Claude Code reads only CLAUDE.md ... it never loads AGENTS.md` (`:641-643`). The count and the line contradict each other.
   - Case: a consumer repository with a current `AGENTS.md` and no `CLAUDE.md` runs `/doctor:agents-md check`; A10 says every copy is as expected, then tells the operator Claude never loads the instruction file.
   - Finding class: instance-only
   - Scope proof: `failed`/`unmeasured` filters at `:646-649` compare only `FINDING` and `UNKNOWN`; the new INFO branch is printed through the `verdict.kind === 'pointer missing'` condition at `:641`, which was added in this change.
   - Affected surface hints: ["A10 runtime copies", "CLAUDE.md pointer verdict"]
2. **An absent Codex advisor entry is routed to a command that cannot repair it, and a repair line is promised that the checker never prints** -- `.skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml:165` -- the output contract says the WARN is shown "including the repair line it prints", but `codex-hook-approval-check.cjs` attaches `repair` only in the unapproved branch (`:195-204`); the absent branch (`:171-179`) prints `WARN codex-advisor-hook-absent` with no repair. `doctor-setup.yaml:61` then names `/doctor:runtime-mirrors` as the repair for that same absent state, while runtime-mirrors defines it as a status shown "without adding a drift surface" (`:165-166`).
   - Case: `.codex/hooks.json` exists without the advisor entry; `/doctor:setup` reports the delivery leg DEGRADED and sends the operator to `/doctor:runtime-mirrors`, which reports STATUS=WARN with the same line and no repair, so the named repair never clears the leg.
   - Finding class: cross-consumer
   - Scope proof: the absent branch at `codex-hook-approval-check.cjs:171-179` builds an object with `status`, `code`, `root`, `hooksFile` and no `repair` key; `doctor-runtime-mirrors.yaml:150` and `:165-166` both describe a repair line for that state; `doctor-setup.yaml:61` routes the state to runtime-mirrors.
   - Affected surface hints: ["codex-hook-approval-check absent branch", "runtime-mirrors WARN contract", "setup delivery leg repair"]
3. **The symlink check's output contract still says OK when the engine exits 0, though its new hook step can end the run as WARN** -- `.skilled/commands/doctor/assets/doctor-symlink-check.yaml:67` -- step 60 was added to run `hook-wiring-check.cjs` and to end with `STATUS=WARN` on its exit 1, but the output block at `:67-69` only maps the engine's exits 0/1/2 to OK/WARN/FAIL. An executor that renders from the output block prints `STATUS=OK` over a `hook-missing` line.
   - Case: a target repository whose `.claude` folder is installed without a prompt hook entry; the engine exits 0, hook-wiring exits 1, step 60 says WARN, and the output contract says OK because it has no hook clause.
   - Finding class: instance-only
   - Scope proof: the output block at `:66-69` names only "the engine" three times; the hook step is the only place `hook-wiring-check.cjs` enters the workflow, and the diff added four lines to this file without touching the output block's status mapping beyond the engine.
   - Affected surface hints: ["symlink check workflow output", "symlink check hook step"]
4. **The scripts README says the check runs three owner tools as children, while it runs four** -- `.skilled/commands/doctor/scripts/README.markdown:102` -- the row describes "three of them run their owner as a child" and `agents-md-check.cjs:15-19` repeats "Three of the twelve rows"; `defaultTools` wires four children (`:875-884`: canary, pointer sync, repo-rules checker, manifest generator) and `rowTemplatePurity` runs the generator at `:859`. The count omits the A12 generator.
   - Case: a maintainer reads the row to learn which rows delegate, changes the generator's contract, and updates three call sites while the fourth (`rowTemplatePurity`) keeps calling it.
   - Finding class: instance-only
   - Scope proof: `rg -n "spawnSync"` in the engine shows four call sites (`:447`, `:666`, `:768`, `:859`), matching the four `defaultTools` entries.
   - Affected surface hints: ["scripts README check row", "agents-md-check module header"]

## Traceability Checks

| Protocol | Level | Status | Notes |
|----------|-------|--------|-------|
| spec_code | core | partial | The change diff was read directly; `spec.md` at the packet root was not read this iteration, so no packet-level requirement is claimed as verified. |
| checklist_evidence | core | notApplicable | The packet is a phased parent with no root `checklist.md`; child packets own their checklists. |
| skill_agent | overlay | notApplicable | No skill or agent definition is in this lineage's scope. |
| agent_cross_runtime | overlay | pass | `INSTALL-SKILLED.md:57` counts seven runtimes including DSH; the hook-wiring and approval checks cover the four that carry an advisor hook, and the setup leg names all seven `--tool` values. |
| feature_catalog_code | overlay | partial | `doctor-install-presentation.txt` §6 and `_routes.yaml`'s embedder row agree on the six-step checklist and its mutation classes; the feature catalog entry was not read. |
| playbook_capability | overlay | notApplicable | No manual-testing playbook file is in this lineage's scope. |

## Integration Evidence

Exact integration surfaces checked: `.skilled/commands/doctor/_routes.yaml` rows for `/doctor:skill-advisor embedder` (new, `mutating: mutates`, six trigger phrases), `write_scope: spec-folder` on the speckit and deep-loop add-only routes, and the `env` standalone `actions` split (`list` read-only, `select` mutates). Each was compared against the workflow that consumes it (`doctor-skill-advisor-embedder.yaml`'s approval phase and `doctor-setup.yaml`'s legacy). `INSTALL-SKILLED.md:147-152`'s six-step install table was compared against `doctor-install-presentation.txt:110-127`: same six steps, same order, same flags.

## Edge Cases

- The packet root has no `checklist.md`, so `checklist_evidence` cannot be scored at this level. It is recorded as notApplicable rather than blocked, because no child checklist is in this lineage's write scope.
- `.dsh` is a runtime in `INSTALL-SKILLED.md` and in `git-setup-check.cjs`, but not a key in `symlink-manifest.json`. The install guide's runtime list therefore cannot be corrected inside this lineage; DR2-P2-001 stays open with that constraint recorded.
- `doctor-runtime-mirrors.yaml:150` cites `~/.codex/hooks.json` as the installer's comparison source. The user-global file was not read; no finding depends on its contents.

## Confirmed-Clean Surfaces

- `INSTALL-SKILLED.md:147-152` matches `doctor-install-presentation.txt:110-127` step for step, including `--link-instructions` on step 1 and the embedder step's placement before `/doctor:setup`.
- `INSTALL-GUIDE.md:54,372` matches `doctor-skill-advisor-embedder.yaml:112-127`: one approval, a no leaves a phrase-only install, and the route never installs Ollama.
- `doctor-setup-presentation.txt:19,62-63` counts seven legs and its repair table matches `doctor-setup.yaml:55-61`.
- `.skilled/commands/doctor/agents-md.md:60` and `doctor-agents-md-embed.yaml:29` both describe the CLAUDE.md pointer as the default, matching `agents-md-embed.cjs:826-841`.
- `scripts/README.markdown:111-112,234-235` matches the two hook checks' exit codes and output lines.

## Ruled Out

- **`agents-md-manifest.test.cjs` is documented but missing** — ruled out: the file exists in `scripts/tests/`, and `tests/fixtures/agents-md/` exists too.
- **`/doctor:runtime-mirrors` does not run the approval check** — ruled out: `doctor-runtime-mirrors.yaml:41,150` wires and runs it, so `INSTALL-SKILLED.md:69` names a command that does invoke the check.
- **The install guide's step order disagrees with the workflow** — ruled out: both list symlink, agents-md, mcp, git, embedder, setup.

## Next Focus

- Dimension: security
- Focus area: holdout hygiene and data exposure in the routing-accuracy scripts and the files that consume their output; also the backup/allowlist boundary in `agents-md-embed.cjs` re-checked for traversal and secret printing
- Reason: holdout hygiene is the one operator focus not yet covered, and the embed engine writes and copies repository files, so its containment deserves a security pass
- Rotation status: first security pass
- Blocked/productive carry-forward: no blocked approach; the four P2 findings stay open for confirmation
- Required evidence: count-only inspection of holdout files, direct read of every consumer path, and a traversal check on `assertWritable`

Review verdict: CONDITIONAL
