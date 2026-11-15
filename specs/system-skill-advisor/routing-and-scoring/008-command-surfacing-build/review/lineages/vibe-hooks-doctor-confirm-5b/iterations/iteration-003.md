# Review Iteration 003 - maintainability and traceability close-out

Lineage: `vibe-hooks-doctor-confirm-5b`. Iteration 3 of 3. Mode: review.
Executor: this session, `cli-opencode` model `opencode-go/deepseek-v4.1-flash`.

## Dispatcher

- Third and final planned iteration of the confirming round. State read first:
  `deep-review-config.json`, `deep-review-state.jsonl`, `deep-review-strategy.md`,
  `deep-review-findings-registry.json`.
- `steer.md` does not exist in this lineage directory at this iteration.
- This iteration addresses the operator focus's two remaining clauses: the kill-switch names
  agreeing between code and docs, and docs agreeing with code across the surfaces that describe
  this area. The `accuracy-runner` focus checks remain out of scope by `review-scope-5b.txt`.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:1-206`
- `.skilled/hooks/shared/hook-flags.cjs:38-78,234-285`
- `.skilled/skills/system-skill-advisor/runtime/lib/advisor-disabled.ts:44-96`
- `.skilled/hooks/skill-advisor/vibe/README.md:1-33`
- `.skilled/hooks/session-lifecycle/vibe/README.md:1-61`
- `.skilled/skills/system-skill-advisor/manual-testing-playbook/cli-hooks-and-plugin/vibe-command-documents.md:1-151`
- `.skilled/commands/doctor/scripts/README.markdown:104-115,228-236` (confirmation of iteration 2)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Traceability Checks

- **The kill-switch names agree in code and docs.** The doc's configuration table has ten
  `NAME=1` rows. The resolver's own name set is `MASTER_FLAG`, `MASTER_ALIASES`,
  `concernFlag('skill-advisor')` and `LEGACY_ALIASES['skill-advisor']`, also ten names. A
  comparison printed `missing from doc: none` and `extra in doc: none`, with both sets listed:
  `MK_HOOKS_DISABLED`, `MK_SKILL_ADVISOR_DISABLED`, `MK_SKILL_ADVISOR_HOOK_DISABLED`,
  `MK_SKILL_ADVISOR_PLUGIN_DISABLED`, `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED`,
  `SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED`, `SYSTEM_HOOKS_DISABLED`,
  `SYSTEM_SKILL_ADVISOR_DISABLED`, `SYSTEM_SKILL_ADVISOR_HOOK_DISABLED`,
  `SYSTEM_SKILL_ADVISOR_PLUGIN_DISABLED` (`hook-flags.cjs:38-78`).
- **Every alias silences every adapter, as the doc now says.** All seven adapters reach the one
  compiled Claude handler (`runtime/dist/hooks/claude/user-prompt-submit.js`) or the shared
  resolver directly: the shims spawn that handler, Pi imports it, DSH and Vibe proxy it, and the
  OpenCode plugin asks `isHookEnabled('skill-advisor')`
  (`prompt-advisor.mjs:222`, `.opencode/plugins/system-skill-advisor.js:206`); the handler asks
  the same resolver (`user-prompt-submit.ts:82-93`). So the `SYSTEM_SKILL_ADVISOR_HOOK_DISABLED`
  row's "Disables every adapter" is true rather than the older native-only reading.
- **The direct call's stated precedence holds.** `advisorDisabledBy` calls
  `hookFlagDecision('skill-advisor', env, fileConfig)` with the caller's environment and the
  flags file, and the resolver returns the environment value whenever the key is set
  (`advisor-disabled.ts:84-95`, `hook-flags.cjs:243-246`), which is the doc's "caller's
  environment over `hook-flags.env`".
- **The standalone Python claim holds.** `skill_advisor.py` takes its disable name from
  `COMPAT_CONTRACT["disabledEnv"]`, which is `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED`
  (`runtime/schemas/compat-contract.json:3`), and refuses only on exactly `"1"`
  (`skill_advisor.py:210,5491`). The doc's "reads only this name, set to exactly `1`" is accurate.
- **The Vibe rows agree with the adapter.** The per-runtime row's `pre_agent`, `match` `main`,
  runtime label `vibe`, child/subagent silence, head and directive repetition, and the one
  document line per offered command all match `prompt-advisor.mjs:62-66,123-153,168-188,209-242`.
  The start table's Vibe row ("no command loader, the brief names the document") matches the
  same code.
- **`skill_agent` (overlay): notApplicable.** No agent definition is in this area.
- **`feature_catalog_code` (overlay): notApplicable here.** The feature catalog is the
  `docs-metadata` area by `review-scope-5b.txt`; its own lineage verifies it.
- **`playbook_capability` (overlay): pass.** `CL-010` names `withCommandDocuments`,
  `buildAdvisorPart`, the document-line text and the child-session empty result, and every one of
  those is what iteration 1's probe printed.
- **Holdout hygiene.** A name search over `skill-advisor-hook.md`, the doctor README and `CL-010`
  printed no corpus filename. No prompt file was opened at any iteration.

## Integration Evidence

- The hook contract's directory tree names `hooks/vibe/prompt-advisor.mjs` as "the real Vibe
  part (the turn-start composer calls it)" (`skill-advisor-hook.md:132-133`), and
  `.skilled/hooks/skill-advisor/vibe/README.md:25` names the same file through the
  `pre_agent` composer, so the two describing surfaces agree with each other and with the
  adapter's import of the compiled handler.

## Edge Cases

- Iteration 2's recorded `timestamp` was written from an estimate and reads ahead of the
  gateway's `committed_at` for that record. The timestamp and duration are metadata; the
  reducer orders iterations by the `iteration` number, and the finding counts, ids and prose all
  agree between the narrative, the delta and the state log. Recorded here so the skew is not
  mistaken for a reordering.
- The doc's `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` row says the Python CLI reads "only this name";
  the shared resolver also honours it, so the sentence is about the Python CLI's narrower rule,
  not a claim that the name is Python-only. Read as written, it is accurate.
- The two Vibe READMEs describe the receipt behavior and the child-session rule but not the
  document line; `skill-advisor-hook.md` and `CL-010` carry that. No contradiction.

## Confirmed-Clean Surfaces

- The doc's description line, per-runtime intro and start table all include Vibe after the fix
  (`skill-advisor-hook.md:3,84,112`).
- The four `MK_` rows and `MK_HOOKS_DISABLED` describe the older aliases exactly as the resolver
  reads them (`hook-flags.cjs:41,70-78`).
- `SYSTEM_SKILL_ADVISOR_HOOK_DISABLED` no longer claims a native-only scope; the row, and the
  paragraph after the table, say every adapter and the direct call (`skill-advisor-hook.md:174,184`).
- The doctor README's `type`/`command` sentence remains true; only the `match` clause is the
  iteration 2 finding (`README.markdown:235`).
- `.skilled/hooks/skill-advisor/vibe/README.md:25` and
  `.skilled/hooks/session-lifecycle/vibe/README.md` describe the same head-receipt behavior the
  probe exercised in iteration 1.

## Ruled Out

- **The `MK_` rows are stale after the env-aliases bridge.** Ruled out: `env-aliases.cjs` maps
  the older names onto the new ones and the resolver also lists them directly, so either path
  silences the concern; the doc's "older alias" wording is accurate (iteration 3).
- **The Codex, Cursor and Devin rows name a per-runtime advisor build that does not exist.**
  Ruled out: the arrow's right side is the compiled shim under
  `system-spec-kit/runtime/dist/hooks/<runtime>/`, which exists for all three, and the shim then
  spawns the one advisor handler; the row describes that two-step dispatch (iteration 3).
- **The Python CLI also reads the newer names.** Ruled out: it reads only
  `COMPAT_CONTRACT["disabledEnv"]` and compares to `"1"`; the newer names reach it only through
  the env-alias bridge in the hook process, which the doc does not claim (iteration 3).

## Next Focus

- Dimension: none remaining
- Focus area: synthesis - the lineage report, the release-readiness state and the convergence record
- Reason: all four dimensions are covered, no finding is active, and the three-iteration cap is reached
- Rotation status: correctness, security, traceability and maintainability complete
- Blocked/productive carry-forward: no blocked approach; two P2 advisories are the remaining work
- Required evidence: the registry's active counts, the three iteration final lines, the synthesis
  close-out record and the report

Review verdict: PASS
