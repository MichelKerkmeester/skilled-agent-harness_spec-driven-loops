# Iteration 9: Per-bot apps — a filter the child never reads

## Focus

Angle 4 on 007 per-bot apps, following iteration 8's recommended next focus: whether the filtered UTCP config fails closed on a server the bot names but the filter drops, whether the per-run config path sits somewhere a child can rewrite, and whether `HonoredPosture.apps` can be forged. The frontier is drained, so the focus comes from the strategy's lowest-coverage area. Evidence: 007's spec, plan and tasks against `.utcp_config.json`, the four project MCP configs, `dispatch.ts`'s guard-env path and the deep-loop `executor-audit.ts`.

## Findings

1. **P1 — the filtered config never reaches the MCP client, and the phase's Out of Scope presents removing the four pins as the only way to confine the child, missing the worktree-local write that would make the pin resolve to the filtered file.** The phase states that `.claude/mcp.json`, `.codex/config.toml`, `opencode.json` and `.cursor/mcp.json` each set `UTCP_CONFIG_FILE` to `.utcp_config.json` explicitly, that an explicit value in an MCP server block overrides the inherited one, and that removing the pins breaks the `/doctor:mcp` check, so it "records what the runner wrote and honored rather than claiming the child is confined" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:104]. All four pins are the same relative path [SOURCE: .claude/mcp.json:9] [SOURCE: .codex/config.toml:17] [SOURCE: opencode.json:29] [SOURCE: .cursor/mcp.json:9], and the child's working directory is the run's worktree, so a filtered config written at `<cwd>/.utcp_config.json` is the file the pin already names. The phase writes it to `<runFolder>/utcp.json` instead [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:142] and points an inherited key at it [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:144], which the pin overrides. The phase's own risk row admits the result: "the record says what was honored, not what the child reached" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:181]. **Edit:** in `007/spec.md` REQ-003 add "for a run with its own worktree the filtered config is also written to `<worktree>/.utcp_config.json`, which is the path the four project pins name, so the pin resolves to the filtered file without touching the pins or the doctor check"; in REQ-005 add "a run without its own worktree that declares `apps` is refused `apps-unenforceable` with class `author`, because the filtered file cannot be placed without dirtying the checkout"; replace the Out of Scope bullet at line 104 with a note that the pins stay and the worktree write is what makes them resolve to the filtered file; and add an acceptance criterion that a worktree run's `<worktree>/.utcp_config.json` holds one template.

2. **P2 — 007 and 008 widen the same deep-loop gate in two different places with two different mechanisms, and neither phase names the other.** 007 adds `UTCP_CONFIG_FILE` to `EXECUTOR_COMMON_ENV_ALLOWLIST`, the list every executor kind admits [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:118] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/tasks.md:52], which is the filter `buildExecutorDispatchEnv` applies to the parent environment [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:1147-1160]. 008 adds a `SKILLED_BOT_SECRET_` prefix to `assertDispatchEnvAllowed`'s strict per-kind list [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/plan.md:69], which is the check on caller-named `dispatchEnv` keys [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:1508-1516]. The two mechanisms have different blast radii: the common allowlist admits the key for every kind and every caller, while the strict list admits one namespace. The file's own comment says the strict list "is therefore the only place that says which keys a caller may name" [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:1494-1497]. **Edit:** in `007/spec.md` §3 and `008/spec.md` §3 add one line each naming the other phase and the shared decision: both keys travel in `dispatchEnv` with a per-dispatch key list, `UTCP_CONFIG_FILE` is added to `DISPATCH_ENV_KEYS` for the four kinds rather than to the common allowlist, and `EXECUTOR_COMMON_ENV_ALLOWLIST` is left unchanged.

3. **P2 — the filtered copy relocates a config whose `load_variables_from` is a relative path, and the phase never says what that path resolves against.** The repository config's top-level keys are `load_variables_from`, `tool_repository`, `tool_search_strategy` and `manual_call_templates` [SOURCE: .utcp_config.json:1-4], and `load_variables_from` names a dotenv file by the relative path `.env` [SOURCE: .utcp_config.json:5]. REQ-003 copies "the repository config's top-level keys" verbatim into `<runFolder>/utcp.json` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:142], and the risk row justifies copying every key verbatim as drift protection [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:182]. A relative `.env` read from a file in the run folder resolves against the client's working directory, not the file's directory, so the same config means two different files depending on who reads it, and a server that needs a token from `.env` fails with no named cause. **Edit:** in `007/spec.md` REQ-003 add "every `load_variables_from[].env_file_path` is rewritten to an absolute path resolved against the checkout root before the copy is written, so the filtered file means the same thing wherever it is read"; add the case to §8 Edge Cases and one assertion to `apps.vitest.ts`.

4. **P2 — the phase adds a hard invariant for an unknown server but no advisory for the absent field that silently narrows a bot, so the first signal is a failed connector call at run time.** The phase's migration risk is "an absent `apps:` silently narrows a bot that used to reach everything", mitigated by "name the change in the template comment and the author reference" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:180], and it declines a migration because "this repository has no `bots/` folder" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:108]. The checker already has an advisory tier that `--strict` turns into a failure [SOURCE: .skilled/skills/system-skilled-bots/scripts/bot-check.cjs:14-22], and the phase adds only the hard `apps-unknown-server` invariant [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:145]. A bot in another repository that declares no `apps:` gets no line from the checker before its first run. **Edit:** in `007/spec.md` add REQ-010: "the checker reports `apps-absent` as an advisory WARN naming the bot and the servers it can no longer reach, and `--strict` turns it into a failure"; add the row to `bot-check.vitest.ts` and name the advisory in `feature-catalog/definition/definition-checker.md`.

## Ruled Out

- Looking for a way a bot could forge `HonoredPosture.apps`: the runner writes it from the resolved names after the refusal, so the record cannot claim a server the filter dropped.
- Looking for a child-side rewrite of `<runFolder>/utcp.json`: the child can write it, but the child's own config is pinned elsewhere, so the rewrite changes nothing it reads.
- Treating the checker's `apps-unknown-server` as a duplicate of the runner's refusal: `bot-check.cjs` loads the runtime's own predicates through `tsx` and restates no field rule [SOURCE: .skilled/skills/system-skilled-bots/scripts/bot-check.cjs:74-77], so the two share one implementation.

## Dead Ends

- Looking for a schema-version requirement in 007 or 008: neither names `schemaVersion`, and the record validator treats the posture object as an object rather than a closed field list, so an added field needs no bump. No finding.
- Looking for a missing refusal on a malformed config: the risk row already names `utcp-config-missing` and `utcp-config-invalid` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:179]. No finding.

## Edge Cases

- Ambiguous input: "the child never reads the filtered config" could mean the key is refused or the key is overridden. The evidence shows the key is admitted and then overridden, which is the narrower and worse reading, and the finding states it.
- Contradictory evidence: the phase's Out of Scope says the child is not confined, while REQ-005 and SC-002 read as if the key delivers the config. Both are cited; the Out of Scope is the accurate one and the requirement text is the defect.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:104,108,118,141,142,144,145,165,166,178-182
- specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/plan.md:62,79,84,129
- specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/tasks.md:52
- specs/system-skilled-bots/003-openbot-parity-build/008-vault/plan.md:69
- .utcp_config.json:1-5
- .claude/mcp.json:9, .codex/config.toml:17, opencode.json:29, .cursor/mcp.json:9
- .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:1147-1160,1494-1497,1508-1516
- .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:340-342
- .skilled/skills/system-skilled-bots/scripts/bot-check.cjs:14-22,74-77

## Assessment

- New information ratio: 0.88
- Questions addressed: does the filter fail closed, is the per-run config path safe, can the record be forged
- Questions answered: the filter fails closed on an unknown name and the record cannot be forged, but the filter never reaches the child, and the copy relocates a relative dotenv path

## Reflection

- What worked and why: reading the phase's Out of Scope before its requirements showed that the phase had already found the pin problem and stopped at the wrong conclusion. Comparing the pin's relative path with the child's working directory produced the missed alternative in one step.
- What did not work and why: the first pass assumed the phase had modified the wrong allowlist, which would have made every `apps:` run fail at dispatch. Reading `buildGuardEnv` and `buildExecutorDispatchEnv` showed the parent-env path is the one 007 uses, so the gate is right and the finding was wrong. Checking the mechanism before writing the finding is what saved it.
- What I would do differently: for every "out of scope because X is impossible" bullet, test whether a different placement makes X possible. Here the pin is relative, so placement was the whole answer.

## Recommended Next Focus

010 conversations as the third injection path, which is the last carried-forward question: whether the conversation JSONL frames a human message as data or as instruction, whether a conversation file can be written by a bot, and whether `bots chat` reuses the answer path or writes its own. Then the synthesis needs the cross-phase conflict list assembled from iterations 1 to 9.
