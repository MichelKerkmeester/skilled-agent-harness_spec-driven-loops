# Review Iteration 1 — correctness

## Dispatcher

- Mode: review; target agent `@deep-review`; detached fan-out lineage `doctor-install`.
- Session: `fanout-doctor-install-1794550137809-1ecgc7`, generation 1, lineageMode new.
- Artifact root: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/doctor-install`.
- Dimension: correctness. Budget profile: verify.
- Operator review focus: device behaviour across claude, codex, opencode, pi, devin and dsh; safety of a mutating offer; holdout hygiene; docs that disagree with code. This iteration addressed the first two where the doctor-install engines encode them: the per-runtime diagnostic tables, and the mutate path of `agents-md-embed.cjs` (backup, digest, rollback). Holdout hygiene and doc/code disagreement are scheduled for iterations 3 and 4; no holdout file was opened here.

## Files Reviewed

- `.skilled/commands/doctor/scripts/hook-wiring-check.cjs:39-149`
- `.skilled/commands/doctor/scripts/codex-hook-approval-check.cjs:40-206`
- `.skilled/commands/doctor/scripts/agents-md-check.cjs:628-743` (A10 runtime copies), `:597-626` (A9), `:216-261` (A1)
- `.skilled/commands/doctor/scripts/agents-md-embed.cjs:91-102` (allowlist/folded copies), `:642-872` (composition), `:1243-1415` (plan/apply), `:1429-1524` (restore)
- `.skilled/commands/doctor/assets/agents-md-manifest.json` (`runtime_copies` block)
- `.skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs:460-503` (A10 pointer expectations)
- Context evidence: `.codex/hooks.json`, `.claude/settings.json`, `.cursor/hooks.json`, `.devin/hooks.v1.json`, `.opencode/hooks/skill-advisor/*` (runtime surfaces, read-only)

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **A failed write mid-apply leaves a half-embedded tree and prints no undo** -- `.skilled/commands/doctor/scripts/agents-md-embed.cjs:1364` -- `commandApply` writes every target in a bare `for` loop after `writeBackup`, and only reaches the rollback at `:1392-1401` once every write has returned. A throw from `fs.writeFileSync`/`fs.rmSync` (EACCES, EROFS, ENOSPC) propagates through `main`'s non-`UsageError`/`PreconditionError` path, so already-written targets stay written, the post-write preservation proof never runs, and the `backup:`/`undo:` lines at `:1407-1408` are never printed.
   - Case: `AGENTS.md` is replaced and `CLAUDE.md` receives its pointer, then `.cursor/rules/repo-local.md` fails to write because `.cursor` is mounted read-only; the command exits 2 with an uncaught error and the operator never learns the backup directory that holds the pre-run bytes.
   - Finding class: class-of-bug
   - Scope proof: the only rollback is `restoreFromBackup` at `:1397`, reached exclusively from the `after.dropped.length > 0` branch at `:1395`; `rg -n "restoreFromBackup" agents-md-embed.cjs` shows no other caller, and no `try`/`catch` wraps the write loop `:1364-1374`.
   - Affected surface hints: ["commandApply write loop", "restoreFromBackup", "undo output"]
   - Claim adjudication:
     ```json
     {"type":"correctness","claim":"A write failure after the first target leaves earlier targets mutated and never prints the undo command, so the operator cannot recover from the run's own output.","evidenceRefs":[".skilled/commands/doctor/scripts/agents-md-embed.cjs:1364",".skilled/commands/doctor/scripts/agents-md-embed.cjs:1395",".skilled/commands/doctor/scripts/agents-md-embed.cjs:1407"],"counterevidenceSought":"searched for a try/catch or rollback around the write loop and for a caller that restores on non-zero exit; found none","alternativeExplanation":"the backup directory is discoverable by digest and the operator could run restore by hand, so the harm is recoverability rather than permanent loss","finalSeverity":"P1","confidence":0.7,"downgradeTrigger":"downgrade to P2 if docs state that a failed apply is expected to be recovered by locating the backup directory by hand"}
     ```

### P2 Findings

2. **A symlinked `.codex/AGENTS.md` reports PASS while the manifest declares that path absent** -- `.skilled/commands/doctor/scripts/agents-md-check.cjs:709` -- `copyVerdict` returns `PASS / symlink` whenever the link's basename is the root file, before `expectsAbsent` (`:677`) is consulted. `expectsAbsent` is only read in the `!exists` branch (`:704-706`), so the manifest row `{"path":".codex/AGENTS.md","expect":["absent"],"why":"Codex loads the root document as project instructions, so a second copy under its own directory is a copy nothing reads"}` is never enforced for a link.
   - Case: a migration leaves `.codex/AGENTS.md -> ../AGENTS.md`; A10 reports `7/7 copies as expected` and exit 0, so an operator is told Codex is clean while the duplicate surface the manifest calls unread still exists.
   - Finding class: instance-only
   - Scope proof: the symlink branch `:709-713` precedes every `expect` read; `rg -n "expectsAbsent"` shows its two uses at `:677` and `:704` only.
   - Affected surface hints: ["A10 runtime copies", "runtime_copies manifest expectations"]
3. **The CLAUDE.md pointer verdict claims every line names AGENTS.md while only one line must** -- `.skilled/commands/doctor/scripts/agents-md-check.cjs:731` -- the pass detail at `:732` reads `every line names ${root_file}`, but `namesRoot` is built with `.some(...)` at `:727`. A file with one `@AGENTS.md` line plus arbitrary local instructions passes as a pointer, and the report says all of its lines name the root document.
   - Case: `CLAUDE.md` containing `@AGENTS.md` and `Always answer in Dutch` is reported as `pointer - every line names AGENTS.md`, so the operator reads a claim the check never tested.
   - Finding class: instance-only
   - Scope proof: `namesRoot` is used once, at `:731`; the detail string at `:732` is the only place the universal claim is printed.
   - Affected surface hints: ["A10 runtime copies", "CLAUDE.md pointer verdict"]
4. **The preservation proof's fourth claim is computed and never enforced** -- `.skilled/commands/doctor/scripts/agents-md-embed.cjs:598` -- `preservationCheck` returns `foreign` (lines outside the block that the template does not ship), but `commandPlan` (`:1251-1268`) and `commandApply` (`:1392-1401`) branch only on `dropped`. The JSDoc at `:499-512` presents four claims; the fourth can be non-empty while the run still reports `STATUS=OK`.
   - Case: any future composition change that emits a line outside the block (for example writing a router pointer above the template) is reported as `foreign` to a caller that never reads it, so the plan and apply both pass a tree whose outside-block text is not template text.
   - Finding class: instance-only
   - Scope proof: `rg -n "foreign"` in the engine shows construction at `:587-596` and the return at `:598`, with no consumer in `commandPlan` or `commandApply`.
   - Affected surface hints: ["preservationCheck", "commandPlan", "commandApply"]

## Traceability Checks

| Protocol | Level | Status | Notes |
|----------|-------|--------|-------|
| spec_code | core | partial | The doctor-install contract test (`doctor-install-contract.test.cjs:80-120`) declares the install route read-only; this iteration read code only, packet docs follow in iteration 3. |
| checklist_evidence | core | pending | No checklist row was claimed as verified in this iteration. |
| skill_agent | overlay | notApplicable | No skill or agent definition is in this lineage's scope. |
| agent_cross_runtime | overlay | partial | Runtime coverage checked against `.codex/hooks.json`, `.claude/settings.json`, `.cursor/hooks.json`, `.devin/hooks.v1.json` and `.opencode/hooks/skill-advisor/`. |
| feature_catalog_code | overlay | pending | Scheduled for iteration 3. |
| playbook_capability | overlay | pending | Scheduled for iteration 3. |

## Integration Evidence

No command, workflow, skill or MCP surface was executed in this iteration. The only integration claims are structural: A10's runtime table is compared against the repository's own runtime hook directories, and `hook-wiring-check.cjs`'s four-runtime table is compared against `.opencode/hooks/skill-advisor/{claude,codex,cursor,devin}`, which is the exact set of runtimes that carry an advisor hook entry here.

## Edge Cases

- The review scope lists 28 `doctor-install` paths; `agents-md-embed.cjs` imports `./lib/agents-md-sections.cjs` and `./release-update.cjs`, which are outside the scope list. They were read as context only, and no finding depends on their behavior.
- `doctor-install-contract.test.cjs` reads `.skilled/commands/doctor/install.md`, which is not in the scope list. Treated as unchanged context; no coverage claim is made for it.
- All seven runtime directories exist in this checkout, so the per-runtime conclusions rest on the repository's surfaces, not only on the changed files. A consumer checkout may have fewer runtime folders, which is why `hook-wiring-check` skips an absent runtime folder by design.

## Confirmed-Clean Surfaces

- `hook-wiring-check.cjs:39-68` names exactly the four runtimes that carry an advisor hook entry in this repository; `.opencode`, `.pi` and `.dsh` carry no `user-prompt-submit` advisor entry, so their absence from the table is not a false clean.
- `codex-hook-approval-check.cjs:108` reads the nested `hooks.UserPromptSubmit` shape, which matches the checked-in `.codex/hooks.json` shape; `hook-wiring-check.cjs:105-112` also accepts the top-level shape, so the two checks do not disagree on this repository.
- `agents-md-embed.cjs:888-906` (`assertWritable`) checks containment before allowlist membership and resolves links, matching the mutation boundary the YAML declares.
- `agents-md-check.cjs:627-651` prints an unmeasured copy as a line, so an UNKNOWN row cannot read as a checked pass.

## Ruled Out

- **Codex approval check parses only the nested hook shape** — ruled out: `.codex/hooks.json` wraps its events in `hooks`, and `codex-hook-approval-check.cjs:108` reads that shape; the broader top-level acceptance in `hook-wiring-check.cjs` is a superset, not a disagreement.
- **Hook wiring omits opencode/pi/dsh** — ruled out: `.opencode/hooks/skill-advisor/` contains adapter directories for claude, codex, cursor and devin only, so the four-runtime table matches the advisor hook's actual reach in this repository.
- **`expect: ["absent"]` is dead for `.codex/AGENTS.md` in every state** — narrowed, not ruled out: a regular identical copy is still a FINDING at `:720-722`; only the symlink branch bypasses the expectation.

## Next Focus

- Dimension: correctness
- Focus area: `doctor-install.yaml`, `doctor-setup.yaml`, `doctor-setup-presentation.txt`, `doctor-install-presentation.txt`, and the `_routes.yaml` rows that surface them
- Reason: iteration 1 covered the scripts; the mutation safety of the install/setup offers lives in the YAML step ordering and the presentation wording
- Rotation status: first pass on the YAML assets
- Blocked/productive carry-forward: symlink/expectation and proof-consumer findings stay open for a later confirmation pass, not a retry of the same read
- Required evidence: direct read of each step's mutation boundary plus the route row that offers it

Review verdict: CONDITIONAL
