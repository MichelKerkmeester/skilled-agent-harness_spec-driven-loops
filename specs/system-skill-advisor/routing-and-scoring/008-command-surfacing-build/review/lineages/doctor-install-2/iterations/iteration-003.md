# Review Iteration 3 — correctness and security

## Dispatcher

- Mode: review; target agent `@deep-review`; detached fan-out lineage `doctor-install`.
- Session: `fanout-doctor-install-2-1794570021136-noekp0`, generation 1, lineageMode new.
- Artifact root: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/doctor-install-2`.
- Dimension: correctness and security. Budget profile: verify.
- Operator review focus: pass two of the command-surfacing review. This iteration verified the hook-check and doctor-workflow fixes from pass one and probed the new command matcher with wrapper shapes. It addressed the runtime-behaviour part of the focus for claude, codex, opencode, pi, devin and dsh: claude, codex and devin carry a prompt-hook entry in this checkout, cursor is registered, and opencode, pi and dsh have no advisor hook entry for this check to read. It also reviewed the Codex approval repair and the symlink-check output boundary. No holdout file was opened.

## Files Reviewed

- `.skilled/commands/doctor/scripts/hook-wiring-check.cjs:39-68` (runtime table), `:100-160` (`eventPayload`, `collectCommands`, `runsMarker`, `inspect`), `:180-230` (main and JSON output)
- `.skilled/commands/doctor/scripts/codex-hook-approval-check.cjs:45-70` (flag parsing), `:169-190` (absent repair)
- `.skilled/commands/doctor/assets/doctor-symlink-check.yaml:54-72` (execution and output mapping)
- `.skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml:150-180` (output and repair routing)
- `.skilled/commands/doctor/assets/doctor-setup.yaml:56-64` (delivery leg)
- `.skilled/commands/doctor/scripts/tests/hook-wiring-check.test.cjs:57-140`, `tests/codex-hook-approval-check.test.cjs:108-150`
- `.claude/settings.json`, `.codex/hooks.json`, `.cursor/hooks.json`, `.devin/hooks.v1.json` (read-only runtime surfaces)
- Pass-one verification input: `review/review-report-pass-1.md:174-177`, `:295-298`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The narrowed hook matcher reports a valid `env node` or `bash -lc` wrapper as hook-missing** -- `.skilled/commands/doctor/scripts/hook-wiring-check.cjs:133-148` -- `runsMarker` accepts `node` only at index 0 or after `&&`, `||`, `;`, `|`, or `bash -c`/`sh -c`, then requires the very next token to end with the marker. A wrapper that starts node through `env node <marker>`, `node --no-warnings <marker>`, or `bash -lc "node <marker>"` is a command that runs the hook, but the check returns `hook-missing`. The pass-one DR5-P2-002 fix removed the description-only false positive by walking command entries, and this wrapper gap is the new false negative on the same matcher.
   Case: a `.claude/settings.json` whose `hooks.UserPromptSubmit[0].hooks[0]` is `{"type":"command","command":"env node .claude/hooks/claude/user-prompt-submit.js"}` prints `hook-missing claude .claude/settings.json` and exits 1; the same file with `bash -lc "node .claude/hooks/claude/user-prompt-submit.js"` prints the same line. Both commands execute the marker path.
   Finding class: false-clean-diagnostic
   Scope proof: `startsCommand` recognises only `-c` after `bash`/`sh`, and `runsMarker` reads only `tokens[index + 1]`; a temporary fixture with either wrapper reproduces the false line. The owning test file covers `node <marker>`, an absolute node, `echo node <marker>` and a description-only mention, but no wrapper.
   Affected surface hints: ["hook-wiring-check matcher", "doctor setup delivery leg", "doctor symlink check"]
   Claim adjudication: `{"type":"correctness","claim":"A hook entry that runs the marker through env or a login shell is reported missing even though the runtime executes it.","evidenceRefs":[".skilled/commands/doctor/scripts/hook-wiring-check.cjs:133",".skilled/commands/doctor/scripts/hook-wiring-check.cjs:144",".skilled/commands/doctor/scripts/tests/hook-wiring-check.test.cjs:57"],"counterevidenceSought":"read the matcher and the four checked-in hook files; the checked-in commands use bash -c and pass, so the defect is outside the repository's own shape","alternativeExplanation":"the check may intentionally accept only the generated shape; its README says it reports whether the prompt hook entry is present, and no sentence narrows that to bash -c","finalSeverity":"P2","confidence":0.85,"downgradeTrigger":"a documented contract that the check accepts only the shipped bash -c shape"}`

## Traceability Checks

| Protocol | Level | Status | Notes |
|----------|-------|--------|-------|
| spec_code | core | partial | Hook-check and workflow rows read against the pass-one findings; packet spec follows in iteration 4. |
| checklist_evidence | core | pending | No checklist row claimed in this iteration. |
| skill_agent | overlay | notApplicable | No skill or agent definition in this area. |
| agent_cross_runtime | overlay | pass | This checkout: claude, codex, cursor and devin wired; opencode, pi and dsh have no advisor hook entry in `hook-wiring-check`'s table, which matches the runtime surfaces. |
| feature_catalog_code | overlay | pending | Scheduled for iteration 4. |
| playbook_capability | overlay | notApplicable | No playbook file in this area. |

## Integration Evidence

- `node .skilled/commands/doctor/scripts/hook-wiring-check.cjs --root .` printed `ok claude`, `ok codex`, `ok cursor`, `ok devin` and exited 0.
- `node .skilled/commands/doctor/scripts/codex-hook-approval-check.cjs --root .` printed `WARN codex-hooks-unapproved .` with the `/hooks` repair line, which is the checked-in state rather than a defect.
- `env -u AI_SESSION_CHILD node --test .skilled/commands/doctor/scripts/tests/hook-wiring-check.test.cjs .skilled/commands/doctor/scripts/tests/codex-hook-approval-check.test.cjs` passed 13 of 13.
- The wrapper probe used temporary `.claude/settings.json` fixtures under the system temp directory and removed them; no repository file was touched.

## Edge Cases

- Cursor's `beforeSubmitPrompt` is registered in this checkout; the runtime's own benchmark reports say native delivery is unconfirmed. `hook-wiring-check` reports registration, not native firing, so the `ok cursor` line is not evidence that a Cursor prompt reaches the advisor. Recorded, not raised; the check's name and README limit the claim to wiring.
- opencode, pi and dsh have no entry in `hook-wiring-check`'s four-runtime table. Their advisor adapters are a plugin, an extension and a plugin adapter, not a hook file this check reads; the setup delivery leg therefore says nothing about them. This is a coverage boundary, not a regression from the fix.
- A command using `node --loader tsx <marker>` has the same false-negative shape; the finding names the class once rather than one finding per flag.

## Confirmed-Clean Surfaces

- DR5-P2-001 holds: `parseArgs` refuses a value that starts with `-` at `codex-hook-approval-check.cjs:58-62`, and the new `--root --json` test exits 2.
- DR5-P2-002 holds for the checked-in shape: `collectCommands` walks `type: command` entries and `runsMarker` confirms node starts the marker; the description-only case now reports `hook-missing`.
- DR3-P2-002 holds: the absent Codex entry prints `WARN codex-advisor-hook-absent` plus the copy-and-approve repair line at `:171-183`, and the workflow routes to that line rather than to `/doctor:runtime-mirrors`.
- DR3-P2-003 holds: `doctor-symlink-check.yaml:69-72` maps hook-wiring exit 1 to WARN, exit 2 to FAIL and states the worse-status rule.
- The four checked-in hook entries all pass the real check; the matcher's gap needs a wrapper the repository does not ship, which keeps it P2.

## Ruled Out

- **A marker mentioned in a description still counts as wired** -- ruled out: `collectCommands` reads `command` only, and the description-only test reports `hook-missing` (iteration 3, evidence: `hook-wiring-check.cjs:114-122`).
- **An absent Codex entry still routes to a command that only reads** -- ruled out: the check prints the copy-and-approve repair, and the setup and runtime-mirrors text route to that line (iteration 3, evidence: `codex-hook-approval-check.cjs:171-183`).
- **The symlink-check output block still omits the hook-wiring exits** -- ruled out: WARN, FAIL and the worse-status rule are all present (iteration 3, evidence: `doctor-symlink-check.yaml:69-72`).
- **A flag value can still swallow the next option** -- ruled out: both checks refuse a value starting with `-` (iteration 3, evidence: `codex-hook-approval-check.cjs:58-62`).

## Next Focus

- Dimension: traceability and maintainability
- Focus area: `setup.md`, `doctor-setup.yaml`, `doctor-setup-presentation.txt`, `doctor-install-presentation.txt`, `doctor-install.yaml`, `doctor-skill-advisor-embedder.yaml` and the shared install docs
- Reason: pass-one DR2-P2-001, DR2-P2-002, DR2-P2-003 and Q3 live in the setup and install contracts; the setup leg's new hook-health sentence must be checked against the writer that actually records hook health.
- Rotation status: first pass on the setup and install docs in this lineage.
- Blocked/productive carry-forward: the wrapper finding from this iteration stays open; do not re-run the same matcher probe.
- Required evidence: direct read of each changed sentence beside the code it describes, plus the contract tests.

Review verdict: PASS
