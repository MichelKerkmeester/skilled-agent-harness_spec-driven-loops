# Iteration 4: Config compatibility & migration — pi-openai-fast-mode schema and self-upgrade; pi-gpt-fast-mode models list; migration path; both-configs-read question

## Focus
Lane 4 of the approved ten-lane queue (orchestrator override; reducer "Next Focus" pointing at Q9 was superseded). Investigated the config surface of all three context packages to answer: (a) what schema pi-openai-fast-mode persists and how it self-upgrades, (b) what models pi-gpt-fast-mode lists, (c) what migration path a fork of pi-openai-fast-mode needs, and (d) whether any package reads both user and project configs (the "both-configs-read question").

## Actions Taken
1. Read `context/pi-openai-fast-mode/src/config.ts` (schema, normalization, path resolution, `syncSupportedTargets`).
2. Read `context/pi-gpt-fast-mode/src/config.ts` (schema, path resolution, write-scope semantics).
3. Read `context/pi-fast-mode/extensions/openai-codex-fast-mode.ts` (TheBinaryGuy reference: state-file-only, no config).
4. Read `context/pi-gpt-fast-mode/src/types.ts` (`DEFAULT_MODELS`, `SERVICE_TIERS`, `DEFAULT_TIER`, config field docs).
5. Grep `syncSupportedTargets` across pi-openai-fast-mode to locate the self-upgrade trigger; read `src/index.ts:40-85` to confirm the load-time write-back.

## Findings

1. **P1 — pi-openai-fast-mode schema is `{enabled, targets[]}` and normalizes field-by-field.** Persisted shape: `{"enabled": boolean, "targets": [{provider, model, serviceTier}]}`. `normalizeConfig` falls back per-field (invalid top-level falls back entirely; invalid/missing fields fall back individually; an explicit empty `targets` array is preserved so users can opt out). Default list: 12 targets across `openai` and `openai-codex` providers for models gpt-5.4 / gpt-5.5 / gpt-5.6 / gpt-5.6-sol / gpt-5.6-terra / gpt-5.6-luna.
   [SOURCE: specs/hooks/011-pi-fast-mode-w-subagent-support/context/pi-openai-fast-mode/src/config.ts:6-55,108-153]

2. **P1 — pi-openai-fast-mode self-upgrades by rewriting its config file on every load.** `syncSupportedTargets(config)` keeps `config.enabled` while replacing `targets` with the current `DEFAULT_CONFIG` list. It is called in `loadForContext` (session start / cwd change), which then persists the synced config back to disk. Result: upgrades auto-migrate target lists without user action — the schema is structurally self-migrating. Covered by `tests/config.test.ts:77-83+`.
   [SOURCE: specs/hooks/011-pi-fast-mode-w-subagent-support/context/pi-openai-fast-mode/src/config.ts:92-98; src/index.ts:52-62; tests/config.test.ts:77-83]

3. **P1 — pi-openai-fast-mode path resolution is single-path (project else user), with a project-local write-scope quirk.** `selectConfigPath` returns project `<cwd>/.pi/pi-openai-fast-mode/config.json` when it exists OR when the extension is project-local (even if the file does not exist); otherwise user `{agentDir}/extensions/pi-openai-fast-mode/config.json`. So project-local installs write to the project path on first toggle even with no prior config file.
   [SOURCE: specs/hooks/011-pi-fast-mode-w-subagent-support/context/pi-openai-fast-mode/src/config.ts:95-104,127-152]

4. **P2 — pi-gpt-fast-mode models list: 4 default `provider/model` keys; schema diverges from pi-openai-fast-mode.** `DEFAULT_MODELS = ["openai/gpt-5.4","openai/gpt-5.5","openai-codex/gpt-5.4","openai-codex/gpt-5.5"]`; persisted schema is `{persist, desired, tier, models, indicator}` with `tier` from `SERVICE_TIERS = priority|flex|default|auto` (default `priority`). `models` entries must contain "/" and are deduped; an explicit empty array is honored. Config paths: project `<cwd>/.pi/extensions/openai-fast.json` (only if it exists), else user `{agentDir}/extensions/openai-fast/config.json`; writes go to whichever scope was resolved at load.
   [SOURCE: specs/hooks/011-pi-fast-mode-w-subagent-support/context/pi-gpt-fast-mode/src/types.ts:29-35,60-88; src/config.ts:5-9,76-98]

5. **P2 — TheBinaryGuy pi-fast-mode has no config surface at all.** It persists only `{enabled}` in a state file `{agentDir}/openai-codex-fast-mode.json`; model support is hardcoded via `supportsFastMode` regex (gpt-5.5 or gpt-5.6*). There is no models list to migrate from this lineage — migration concerns apply only between the two forked context packages.
   [SOURCE: specs/hooks/011-pi-fast-mode-w-subagent-support/context/pi-fast-mode/extensions/openai-codex-fast-mode.ts:23-27,40-42]

6. **P1 — "Both-configs-read" resolves to: no package reads both user and project configs; resolution is strictly single-path.** pi-openai-fast-mode: project-if-exists-or-project-local else user. pi-gpt-fast-mode: project-if-exists else user. pi-fast-mode: none. Therefore the fork does not inherit a dual-read pattern, and "read both" would be net-new behavior that the three reference implementations do not exhibit. Because the fork schema is identical to pi-openai-fast-mode's, compatibility is structural: the fork can read the legacy path directly without conversion.
   [SOURCE: specs/hooks/011-pi-fast-mode-w-subagent-support/context/pi-openai-fast-mode/src/config.ts:127-152; context/pi-gpt-fast-mode/src/config.ts:89-98; context/pi-fast-mode/extensions/openai-codex-fast-mode.ts:23-27]

7. **P1 — Migration path for the fork: legacy-read fallback + sync write-back; path rename orphans existing user configs.** If the fork keeps its own config dir (e.g. `{agentDir}/extensions/pi-fast-mode-w-subagent-support/config.json`), existing `pi-openai-fast-mode/config.json` files become orphaned; neither reference implementation chains legacy→new reads. Required fork design decision: (a) one-time migration on first load (read legacy path when new path absent → `syncSupportedTargets` → save to new path), or (b) keep reading the legacy path with the fork's new dir as write target. Option (a) matches the package's existing self-upgrade philosophy (finding 2). No scope-violation or security concern: config is plain JSON, no credentials found.
   [INFERENCE: based on findings 1-3 and 6; no dual-read or legacy-chain code exists in any of the three implementations]

## Questions Answered
- Config compatibility & migration: pi-openai-fast-mode schema and self-upgrade; pi-gpt-fast-mode models list; migration path; both-configs-read question (lane 4, Q4) — answered with 7 findings.

## Questions Remaining
- 6 of 10 lanes remain: Q5 /fast command collision; Q6 Packaging & install mechanics; Q7 Testing patterns; Q8 Indicator UX under custom footers; Q9 TheBinaryGuy edge cases; Q10 Licensing, notices, docs, maintenance.

## Ruled Out
- Treating pi-gpt-fast-mode's `models` array as directly reusable for the fork: schema (`persist/desired/tier/models/indicator`) is semantically different from pi-openai-fast-mode's `enabled/targets`; the fork's models list must be decided on its own (finding 4).
- Searching for a dual-read config pattern in the three implementations: none exists; single-path resolution is universal (finding 6).

## Dead Ends
- pi-fast-mode (TheBinaryGuy) as a config-migration source: no config schema exists to migrate (finding 5). Candidate for reducer "Exhausted Approaches" only for config-lane purposes, not for its other lanes (footer/guards remain open in Q9).

## Edge Cases
- Ambiguous input: none — lane-4 scope was explicit; reducer "Next Focus" (Q9) was superseded by the orchestrator override per the prompt pack.
- Contradictory evidence: none — the three implementations differ in design but do not contradict each other; the divergence itself is a finding.
- Missing dependencies: none — all three config sources were present in the context packet.
- Partial success: none — all 5 research actions succeeded.

## Sources Consulted
- specs/hooks/011-pi-fast-mode-w-subagent-support/context/pi-openai-fast-mode/src/config.ts:6-55,92-98,95-104,108-153
- specs/hooks/011-pi-fast-mode-w-subagent-support/context/pi-openai-fast-mode/src/index.ts:52-62
- specs/hooks/011-pi-fast-mode-w-subagent-support/context/pi-openai-fast-mode/tests/config.test.ts:77-83
- specs/hooks/011-pi-fast-mode-w-subagent-support/context/pi-gpt-fast-mode/src/config.ts:5-9,76-98
- specs/hooks/011-pi-fast-mode-w-subagent-support/context/pi-gpt-fast-mode/src/types.ts:29-35,60-88
- specs/hooks/011-pi-fast-mode-w-subagent-support/context/pi-fast-mode/extensions/openai-codex-fast-mode.ts:23-27,40-42

## Assessment
- New information ratio: 1.0
- Questions addressed: 1 (lane 4: Config compatibility & migration)
- Questions answered: 1 (lane 4, Q4)

## Reflection
- What worked and why: reading all three config modules side-by-side made the "compatibility" question answerable as a structural comparison — schema, path resolution, and write-back behavior each differ in one decisive way, and the self-upgrade trigger was found by grepping `syncSupportedTargets` to its call site rather than reading the whole entry file.
- What did not work and why: nothing failed; the only care point was avoiding scope creep into Q9 (TheBinaryGuy edge cases) surfaced by the reducer's next-focus text — the orchestrator lane override prevented that.
- What I would do differently: for the fork implementation, the legacy-path migration decision (finding 7) should be settled in the spec before coding; it is the single design fork with user-visible consequences.

## Recommended Next Focus
Lane 5: /fast command collision — duplicate command/flag registration behavior; safe install/remove ordering; verification method. Iteration 1 finding 4 (registerCommand collision suffixes) is the seeded foundation to build on.

## SCOPE VIOLATIONS
None. All reads were on the context packet (read-only); all writes stayed within the three allowed research-packet paths.
