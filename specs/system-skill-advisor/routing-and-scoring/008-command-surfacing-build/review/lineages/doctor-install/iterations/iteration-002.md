# Review Iteration 2 — correctness

## Dispatcher

- Mode: review; target agent `@deep-review`; detached fan-out lineage `doctor-install`.
- Session: `fanout-doctor-install-1794550137809-1ecgc7`, generation 1.
- Dimension: correctness (continuation onto the install/setup flows and their presentation contracts). Budget profile: verify.
- Operator review focus: this iteration covered the safety of offering a mutating command (does every printed writing step say who asks and what it changes) and the runtime list the guide offers (claude, codex, opencode, pi, devin, dsh). Holdout hygiene remains scheduled for iteration 4; no holdout file was opened.

## Files Reviewed

- `.skilled/commands/doctor/assets/doctor-install.yaml:23-70`
- `.skilled/commands/doctor/assets/doctor-install-presentation.txt:19-204`
- `.skilled/commands/doctor/assets/doctor-setup.yaml:23-73`
- `.skilled/commands/doctor/assets/doctor-setup-presentation.txt:13-111`
- `.skilled/commands/doctor/assets/doctor-skill-advisor-embedder.yaml:23-173`
- `.skilled/commands/doctor/_routes.yaml` (rows for `/doctor:install`, `/doctor:setup`, `/doctor:agents-md`, `/doctor:symlink`, `/doctor:git setup`, `/doctor:mcp install`, `/doctor:skill-advisor embedder`)
- `.skilled/commands/doctor/agents-md.md:80-90`, `.skilled/commands/doctor/setup.md:59-81`, `.skilled/commands/doctor/skill-advisor.md:39-93`
- Context evidence: `.skilled/commands/doctor/assets/symlink-manifest.json` (runtime keys), `.skilled/commands/doctor/scripts/git-setup-check.cjs:62-79` (accepted `--tool` names), `.skilled/commands/doctor/assets/doctor-mcp-install.yaml:1-101` (per-mutation approvals)

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. One P1 from iteration 1 (DR1-P1-001, partial write in `apply`) remains active and keeps this iteration CONDITIONAL.

### P2 Findings

1. **The install guide offers six runtimes while calling the accepted set seven, and never names dsh** -- `.skilled/commands/doctor/assets/doctor-install-presentation.txt:78` -- the prompt at `:58` lists `claude, opencode, codex, cursor, devin, pi`; the refusal rule at `:78` calls that list "the seven", and `doctor-install.yaml:58` repeats the same six. `.dsh` is an installed runtime in this checkout, `/doctor:setup` passes `--tool=dsh` (`doctor-setup.yaml:56`), and `git-setup-check.cjs:64` accepts it, so a dsh project gets no accepted runtime name from the guide and is told its answer is outside a set whose stated size does not match what is printed.
   - Case: an operator answers `dsh` at the install prompt; the guide treats the name as outside "the seven" and re-asks, while the same checkout's setup leg and git battery accept `dsh` as a first-class tool.
   - Finding class: class-of-bug
   - Scope proof: `rg -n "seven|claude, opencode" doctor-install-presentation.txt doctor-install.yaml` shows the six-name list in both files and the only "seven" at the presentation's refusal rule; `symlink-manifest.json` `runtimes` has six keys, so the label and the underlying table disagree.
   - Affected surface hints: ["install presentation runtime list", "install workflow runtime list", "symlink manifest runtimes"]
2. **The embedder route probes OLLAMA_BASE_URL but starts and pulls against the default local host** -- `.skilled/commands/doctor/assets/doctor-skill-advisor-embedder.yaml:89` -- phase 1 resolves the server URL from `OLLAMA_BASE_URL` (default `http://127.0.0.1:11434`), while phase 4 starts `ollama serve` (`:125`) and runs `ollama pull` (`:126`) without carrying that URL through `OLLAMA_HOST`. With a non-default base URL the plan is computed for one server and the approved mutation runs against another.
   - Case: `OLLAMA_BASE_URL=http://gpu-box:11434` is unreachable; the probe records the server as absent, the plan lists a start and a pull, the operator approves, and the route starts a local server and pulls the model on the laptop while polling the remote URL until the run fails.
   - Finding class: instance-only
   - Scope proof: `rg -n "OLLAMA_BASE_URL|OLLAMA_HOST|ollama serve|ollama pull"` in the embedder YAML shows the env read only at `:89` and no host binding on the two mutating commands.
   - Affected surface hints: ["embedder probe", "embedder start step", "embedder pull step"]
3. **setup.md documents one out-of-repository write, while the workflow declares an empty allowlist and a `**/*` prohibition** -- `.skilled/commands/doctor/setup.md:75` -- the document says "The only write outside the repository is the advisor CLI creating its socket directory when that directory is absent" (`:75-76`), but `doctor-setup.yaml:23-28` declares `read_only: true`, `allowed_targets: []` and `forbidden_targets: ["**/*"]`. One of the two is the operator-facing truth, and an operator reading the YAML will report a socket-directory write as a violation of the route.
   - Case: a Linux host with no `/tmp/system-skill-advisor` runs `/doctor:setup`; the advisor leg creates the socket directory, which the YAML's mutation boundary names as forbidden, so an auditor following the YAML flags the run its own document calls expected.
   - Finding class: instance-only
   - Scope proof: the only allowance for the socket directory is `setup.md:75-76`; the YAML block at `doctor-setup.yaml:23-28` carries no exception.
   - Affected surface hints: ["setup mutation boundary", "setup router summary"]

## Traceability Checks

| Protocol | Level | Status | Notes |
|----------|-------|--------|-------|
| spec_code | core | partial | Install/setup route mutation classes compared against `_routes.yaml`; packet docs deferred to iteration 3. |
| checklist_evidence | core | pending | No checklist row claimed. |
| skill_agent | overlay | notApplicable | No skill or agent definition in scope. |
| agent_cross_runtime | overlay | pass | `hook-wiring-check.cjs --root <repo>` reported `ok` for claude, codex, cursor, devin; `codex-hook-approval-check.cjs` reported `codex-hooks-unapproved` for group 0 index 0, which the setup leg documents as DEGRADED. |
| feature_catalog_code | overlay | pending | Scheduled for iteration 3. |
| playbook_capability | overlay | pending | Scheduled for iteration 3. |

## Integration Evidence

Exact integration surfaces checked: `/doctor:install` route row (`_routes.yaml`, target `guide`, `mutating: read-only`, flags `--json`, `--root <dir>`, `--runtimes <list>`) against `doctor-install.yaml`'s checklist; `/doctor:setup` route row (`mutating: read-only`, no flags) against `doctor-setup.yaml`'s seven legs; `/doctor:agents-md embed` and `/doctor:skill-advisor embedder` route rows (`mutating: mutates`) against the approval language in their YAML workflows. The two hook checks were executed read-only against this checkout to test the delivery leg's claims.

## Edge Cases

- The install guide's runtime list is constrained by `symlink-manifest.json`, whose `runtimes` keys are six. The dsh gap may be an upstream manifest decision rather than a defect in this file; the finding is scoped to the guide claiming seven and never naming dsh, not to the manifest's own coverage.
- `codex-hook-approval-check.cjs` exits 1 in this checkout because the Codex hook entry is unapproved. The setup leg calls that DEGRADED by design, so the exit status is not a regression and is not reported as a finding.
- `/doctor:mcp install` is outside this lineage's scope; it was read only to test the install presentation's claim that every printed writing step asks its own yes. It does (`doctor-mcp-install.yaml:72-101`, `approval: per_mutation`), so that claim is not a finding.

## Confirmed-Clean Surfaces

- `doctor-install.yaml:28` and `doctor-install-presentation.txt:5,139` keep the route read-only and hand every writing command to the operator; no step runs a printer command.
- The install checklist's mutation classes match `_routes.yaml` for symlink link (`mutates`), agents-md embed (`mutates`), mcp install (`mutates`), git setup (`read-only`), skill-advisor embedder (`mutates`) and setup (`read-only`).
- `doctor-setup.yaml:65` runs every leg even after a failure, matching `setup.md:64-65`.
- `doctor-setup-presentation.txt:61-63` repair rows match the workflow's repair commands, including the stale-build `npm ... run build` case.

## Ruled Out

- **Install guide claims every writing step asks its own yes** — ruled out: `/doctor:mcp install` carries `approvals: per_mutation` and per-phase approvals, and the other four writing steps each own a plan or approval phase.
- **`/doctor:agents-md` bare invocation can reach a writing target** — ruled out: the `check` route carries `default_target: true` in `_routes.yaml`, matching `agents-md.md:36`.
- **`/doctor:setup` accepts a `--tool` value the battery refuses** — ruled out: `git-setup-check.cjs:64` accepts all seven names the workflow lists, dsh included.

## Next Focus

- Dimension: traceability
- Focus area: `INSTALL-GUIDE.md`, `INSTALL-SKILLED.md`, `.skilled/skills/system-skill-advisor/INSTALL-GUIDE.md`, and the command docs' claims against the engines
- Reason: two iterations established behavior; the remaining risk is documentation that sends an operator to a command or path the code no longer has
- Rotation status: first traceability pass
- Blocked/productive carry-forward: the dsh runtime gap and the setup socket-write disagreement stay open for confirmation against the install guide
- Required evidence: every doc claim cited with its code counterpart, or recorded as unverifiable

Review verdict: CONDITIONAL
