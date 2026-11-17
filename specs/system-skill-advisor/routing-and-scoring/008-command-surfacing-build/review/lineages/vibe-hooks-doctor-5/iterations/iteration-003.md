# Iteration 3 - Traceability: the doctor hook-wiring check and its docs

## Dispatcher

- Mode: review, single iteration, dimension `traceability`.
- Lineage: `vibe-hooks-doctor-5`.
- Reviewed the doctor hook-wiring check, its Vibe reader and test, the doctor scripts README, the runtime-mirrors route and CI rows, the command-reference allowlist change and the hook contract's Vibe statements.
- Operator review focus: the pass-five brief's "whether the doctor wiring check reads hooks files correctly" and "docs, scenarios and changelogs that disagree with code". This iteration ran the check against the checkout, compared the Vibe reader with the `.vibe/hooks.toml` fields Vibe itself uses, and checked the three Vibe mirror rows against the workflow and the route. Holdout hygiene is recorded below from a name-only scan.

## Files Reviewed

- `.skilled/commands/doctor/scripts/hook-wiring-check.cjs:1-408`
- `.skilled/commands/doctor/scripts/tests/hook-wiring-check.test.cjs:1-371`
- `.skilled/commands/doctor/scripts/README.markdown:1-272`
- `.skilled/commands/doctor/_routes.yaml:250-292`
- `.skilled/commands/doctor/scripts/tests/doctor-runtime-mirrors-contract.test.cjs:40-90,203-209`
- `.skilled/commands/scripts/validate-command-references.cjs:35-60,140-152`
- `.github/workflows/spec-kit-check.yml:1-105,300-350`
- `.github/workflows/command-tree-parity.yml:1-60,152-190`
- `.vibe/hooks.toml:1-45,80-90`
- `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:82-111`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The Vibe row ignores the hook's `match` filter, so an entry scoped away from the main agent still reads `ok vibe`** -- `.skilled/commands/doctor/scripts/hook-wiring-check.cjs:249` -- `tomlCommands` captures only `type` and `command` from each `[[hooks]]` block, and `inspect` accepts a block whose type is `pre_agent` and whose command ends with the marker. Vibe's own file pairs `match = "main"` with its turn-start and turn-end hooks, which is the evidence that the field scopes the hook to the main agent; the check never reads it.
   Finding class: false_pass_diagnostic
   Scope proof: The check and its test are declared scope files; the `.vibe/hooks.toml` field values and the README claim are read to test whether the check reports what it says it reports.
   Affected surface hints: doctor hook-wiring check, Vibe prompt entry, target-repository diagnostics.
   Case: A `.vibe/hooks.toml` block with `type = "pre_agent"`, a `match` value other than the main-agent form (the file already uses `agents_spawn`, `re:write_file|edit` and `ask_user_question` on other hooks) and the turn-start command prints `ok vibe` and exits 0, while the main prompt gets no turn-start. The filter semantics are an inference from the tracked file's pairing of `match = "main"` with both turn hooks; the check's own contract is that it never reads the field.
   Evidence: `hook-wiring-check.cjs:249` (the `type|command` regex), `:253-255` (the filter), `:350-361` (the toml branch), `.vibe/hooks.toml:18` and `:28` (`match = "main"` on the turn hooks) against `:84`, `:92` and `:135` (other match values), `README.markdown:112` (the claim that the check reports whether the prompt entry is wired).

2. **The hook contract names Vibe in its per-runtime table but leaves it out of the two runtime summaries that table feeds** -- `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:84` -- The section opens "Every native runtime, Pi and DSH run the same hook handler", which omits the Vibe part that the new row at line 95 says proxies the compiled handler; the "Starting a surfaced command" table at lines 103-111 has rows for seven runtimes and none for Vibe, though the Vibe row's document line is the mechanism that answers the table's question for a runtime with no command loader.
   Finding class: doc_code_drift
   Scope proof: The hook contract is a declared scope file and the Vibe row is the changed line; the handler and part it describes are in scope.
   Affected surface hints: hook contract, Vibe command document line, runtime capability table.
   Case: A reader who starts at line 84 concludes Vibe is not on the shared handler and skips the row at line 95; a reader who asks whether a Vibe model can start a surfaced command finds no row, though the Vibe row already explains that its prompt stubs name the dash form and the brief names the document to read.
   Evidence: `skill-advisor-hook.md:84` and `:103-111` against `:95` and `prompt-advisor.mjs:123-148`.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|---|---|---|---|
| `spec_code` | core | partial | Phase 030 `REQ-004` (ok vibe, post_agent/commented/name-only, skipped without `.vibe/`) holds and the check printed `ok vibe` on this checkout. `REQ-005` holds: the workflow names the three Vibe scripts nine times and the route three times, and the contract test asserts both. `REQ-010`'s wiring sentence holds. The `match` filter is the one entry shape neither the requirement nor the test covers (`R3-P2-001`). |
| `checklist_evidence` | core | partial | Phase 030 `AC-004` is Met for the five tested cases; `AC-005` is Met for the route, workflow and repair rows; `AC-010`'s doc sentence is Met. None covers a `match` filter or the missing summary rows (`R3-P2-002`). |
| `skill_agent` | overlay | notApplicable | No agent definition changed in this area. |
| `agent_cross_runtime` | overlay | partial | The check covers the five hook-file runtimes; Pi, DSH and OpenCode are documented as plugin or extension deliveries at `README.markdown:112`, which matches the code's five-entry runtime table. |
| `feature_catalog_code` | overlay | pending | The feature-catalog pages are `docs-metadata-5` scope; this iteration checked only the hook contract, which is this lineage's file. |
| `playbook_capability` | overlay | partial | The Vibe command-document scenario states the document line and the child-session arm; it does not exercise the `match` filter. |

## Integration Evidence

- `/doctor:symlink check` runs the wiring check after its engine report at `.skilled/commands/doctor/assets/doctor-symlink-check.yaml:60`, and `/doctor:setup` runs it as a leg at `.skilled/commands/doctor/assets/doctor-setup.yaml:61`.
- The runtime-mirrors route names the three Vibe `--check` rows at `_routes.yaml:268-270`, and the workflow renders the corresponding n/a rule and repair lines at `doctor-runtime-mirrors.yaml:159-161,184-186`.
- CI runs the same three scripts in the `mirrors` job at `.github/workflows/spec-kit-check.yml:337-339`, and `.github/workflows/command-tree-parity.yml:185-187` runs them for `.vibe/**` and `SKILL.md`-only changes; the new comment at `spec-kit-check.yml:23-25` matches that split.
- The command-reference validator's new `.vibe` entry is justified: `.vibe/agents` exists and holds the generated `.toml` profiles, so the allowlist comment's "ships an agents tree" condition holds at `validate-command-references.cjs:44-46`.

## Edge Cases

- The Vibe reader is line-based and documented as such: a trailing comment or a single-quoted value reads `hook-missing` (`README.markdown:235`). The same line reader cannot see a `match` filter, which is `R3-P2-001`.
- A `.vibe` folder without `hooks.toml` reads `hook-missing`; a missing `.vibe` folder reads `skipped` (tests at `hook-wiring-check.test.cjs:273-279,316-324`).
- The route's removed `--scope=council` value matches the workflow's four-value scope; `doctor-deep-loop.md:3` already lists the four and no file in the tree mentions a council scope, so the removal is a correction, not a regression.

## Confirmed-Clean Surfaces

- The check printed `ok claude`, `ok codex`, `ok cursor`, `ok devin` and `ok vibe` on this checkout and exited 0.
- The README's Vibe sentence matches the code: it reads `.vibe/hooks.toml` line by line for a `pre_agent` entry that runs the Vibe turn-start hook, and it names Pi, DSH and OpenCode as having no row.
- The workflow and route name the three Vibe scripts nine and three times, and the contract test asserts the n/a rule, the surface, the tree and the repair line for each.
- The new `.vibe` allowlist entry names a runtime that ships an agents tree; `validate-command-references.cjs:44-46` and the on-disk `.vibe/agents` agree.
- Holdout hygiene: a name-only scan of the twelve scoped files found no reference to `command-prompts.jsonl`, `holdout-prompts.jsonl` or `behaviour-fresh-prompts.jsonl`; no corpus file was opened this iteration.

## Ruled Out

- **The check counts a mention as a wired hook.** Ruled out: the shell-word reader and the tests for a quoted `echo`, a `description` field, a comment and a `name` value all read `hook-missing`.
- **A commented `[[hooks]]` header starts a block.** Ruled out: the header is stripped of its comment before comparison and the test "reads a commented hooks header as the start of the next block" passes.
- **A later table lends its command to the hooks block before it.** Ruled out: any other header clears the current block, with a test for `[[notes]]`.
- **The `.vibe` allowlist entry accepts a phantom runtime.** Ruled out: `.vibe/agents` is present with generated profiles.
- **The removed `council` scope is still supported.** Ruled out: the workflow declares four scopes and no router text mentions council.

## Next Focus

- Dimension: maintainability
- Focus area: the Vibe part's injected-environment contract, the doctor contract test's naming, and the convergence bookkeeping for the synthesis.
- Reason: traceability is complete; the remaining scoped code path is the part's test-isolation surface, and the loop has one iteration left before the cap.
- Rotation status: correctness, security and traceability complete; maintainability remaining.
- Blocked/productive carry-forward: the doctor reading is productive; no blocked approach.
- Required evidence: the `env` dependency's documented scope against the receipt path, and the test names against the checks they now run.

Review verdict: PASS
