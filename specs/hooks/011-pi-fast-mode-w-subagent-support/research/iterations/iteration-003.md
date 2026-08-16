# Iteration 3: Env-var namespace hygiene (PI_* collision scan + naming conventions + PI_FAST_MODE_W_SUBAGENT_SUPPORT fit)

## Focus
Approved lane 3 (orchestrator focus-map override): collision scan of `PI_*` env vars across (a) installed packages (`~/.pi/agent/npm/node_modules`), (b) git sources (`context/pi-openai-fast-mode`, `context/pi-gpt-fast-mode`, `context/pi-fast-mode`), and (c) Public `.pi` (`~/.pi` settings/plugins/sync manifests); derive the extension naming convention; assess whether `PI_FAST_MODE_W_SUBAGENT_SUPPORT` fits the namespace. Prior packet lanes (1-2) covered the API surface and handoff mechanics; lane 3 had only a partial seed (iteration-2 finding 6/14).

## Actions Taken
1. Grep scan of `env.PI_[A-Z0-9_]+` reads across installed packages `~/.pi/agent/npm/node_modules` (pi-subagents, pi-intercom, pi-blackhole, pi-web-access, pi-omplike-advisor) — code-level reads only, `dist/` noise ignored per exhausted-approach record.
2. Grep scan of `PI_[A-Z0-9_]{2,}` across git-source snapshots in `specs/hooks/011-pi-fast-mode-w-subagent-support/context/` (pi-openai-fast-mode, pi-gpt-fast-mode, pi-fast-mode + snapshot README).
3. Bash scan of Public `.pi` (`~/.pi`, excluding `node_modules`/`.git`) for any `PI_*` references in settings/plugins/sync-manifest/config surfaces; pre-write existence check of iteration/delta files.
4. Read official `environment-variables.md` (installed pi-coding-agent docs) for the canonical core `PI_*` namespace and process-marker semantics.

## Findings

1. **Installed-package `PI_*` inventory (collision baseline): ~25 distinct vars, no fast-mode vars in use.** Code-level reads found: pi-subagents — `PI_SUBAGENT_MAX_DEPTH`, `PI_SUBAGENT_DEPTH`, `PI_SUBAGENT_MAX_SPAWNS_PER_SESSION`, `PI_SUBAGENT_MAX_SPAWNS_PER_RUN`, `PI_SUBAGENT_INHERIT_PROJECT_CONTEXT`, `PI_SUBAGENT_INHERIT_SKILLS`, `PI_SUBAGENT_INTERCOM_SESSION_NAME`, `PI_SUBAGENTS_LLM_INTENT_ARBITER`, `PI_SUBAGENTS_WORKTREE_DIR`, `PI_SUBAGENT_ORCA_BINARY`, plus core `PI_OFFLINE`, `PI_CODING_AGENT_DIR`; pi-intercom — `PI_INTERCOM_ASK_TIMEOUT_MS`, `PI_INTERCOM_TRANSPORT`, `PI_INTERCOM_TCP`, `PI_INTERCOM_LIVENESS_INTERVAL_MS`, `PI_INTERCOM_LIVENESS_TIMEOUT_MS`, `PI_INTERCOM_PI_BIN`, `PI_BIN`; pi-blackhole — `PI_BLACKHOLE_PASSIVE`, `PI_VCC_OM_PASSIVE`, `PI_OBSERVATIONAL_MEMORY_PASSIVE`, `PI_BLACKHOLE_COMPACTION`, `PI_BLACKHOLE_COMPACTION_ENGINE`, `PI_BLACKHOLE_MID_RUN_COMPACTION`; pi-web-access — `PI_ALLOW_BROWSER_COOKIES`, `PI_WEB_ACCESS_DISABLE_NODE_SQLITE`. **No `PI_FAST_MODE*`, `PI_OPENAI_FAST*`, or `PI_GPT_FAST*` var exists in any installed package** — the proposed name cannot collide with installed code today. [SOURCE: grep `env\.PI_[A-Z0-9_]+` on ~/.pi/agent/npm/node_modules; e.g. ~/.pi/agent/npm/node_modules/pi-subagents/src/runs/shared/pi-args.ts:740-747, ~/.pi/agent/npm/node_modules/pi-subagents/src/shared/types.ts:2147-2193, ~/.pi/agent/npm/node_modules/pi-intercom/broker/paths.ts:52-57, ~/.pi/agent/npm/node_modules/pi-blackhole/src/pi-base/blackhole-settings.ts:316-353, ~/.pi/agent/npm/node_modules/pi-web-access/gemini-web-config.ts:47]

2. **Extension naming convention is `PI_<COMPONENT>_<CONFIG>`; core vars are flat `PI_<NAME>`; singular/plural drift exists inside pi-subagents.** Every installed extension scopes its env surface under its component name (`PI_INTERCOM_*`, `PI_SUBAGENT(S)_*`, `PI_WEB_ACCESS_*`, `PI_BLACKHOLE_*`), while core process config stays flat (`PI_OFFLINE`, `PI_TELEMETRY`, `PI_PACKAGE_DIR`). pi-subagents itself is internally inconsistent: `PI_SUBAGENTS_LLM_INTENT_ARBITER` and `PI_SUBAGENTS_WORKTREE_DIR` (plural) vs the singular `PI_SUBAGENT_*` family — precedent that a fork's prefix choice matters less than consistency within the fork. Conclusion: a fast-mode fork should own the `PI_FAST_MODE_*` prefix and document it. [SOURCE: grep inventory above + official doc at ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/environment-variables.md]

3. **Official core `PI_*` namespace (from the canonical doc).** Pi uses env vars three ways: (a) process config — `PI_CODING_AGENT_DIR`, `PI_CODING_AGENT_SESSION_DIR`, `PI_PACKAGE_DIR`, `PI_OFFLINE`, `PI_SKIP_VERSION_CHECK`, `PI_TELEMETRY`, `PI_CACHE_RETENTION`, `PI_SHARE_VIEWER_URL`, `PI_HARDWARE_CURSOR`, `PI_TUI_ESC_TIMEOUT`; (b) process markers set for children — `AI_AGENT=pi`, `PI_CODING_AGENT=true` (not session-specific, not set in SDK-embedded mode); (c) bash-tool session vars — `PI_SESSION_ID`, `PI_SESSION_FILE`, `PI_PROVIDER`, `PI_MODEL`, `PI_REASONING_LEVEL`, injected per-command, removable via `exposeSessionEnvironment: false` on custom bash tools. Relevance to the fork: the session vars are *injected into the child bash environment*, so a fork that runs shell commands inherits them; none of these names overlap `PI_FAST_MODE_W_SUBAGENT_SUPPORT`. Partially new: `PI_CODING_AGENT_DIR`/`PI_OFFLINE` were already surfaced in iteration 2 (f-11); the full table, markers, and `exposeSessionEnvironment` detail are new. [SOURCE: ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/environment-variables.md]

4. **Fast-mode env lineage: `PI_OPENAI_FAST_DESIRED` (legacy) → `PI_GPT_FAST_MODE` (current), strict `"1"` semantics.** `context/pi-gpt-fast-mode/src/types.ts:19` defines `HANDOFF_ENV = "PI_GPT_FAST_MODE"`; tests pin strict boolean parsing — `"1"` accepted, `"yes"`/`""` → `undefined` (context/pi-gpt-fast-mode/tests/state.test.ts:56-64); README documents exporting it so subagents can read it (context/pi-gpt-fast-mode/README.md:73,84). A stale comment in `context/pi-gpt-fast-mode/src/handoff.ts:3` still names the legacy `PI_OPENAI_FAST_DESIRED` — comment drift, not a live var. Notably, the `context/pi-openai-fast-mode/` snapshot contains **zero** `PI_*` env usage: the OpenAI variant shipped no handoff env var, so the fork cannot reuse an existing openai-family var and must choose one. Partially new: strict-`1` semantics covered in iteration 2 (f-12); the legacy-name lineage and the zero-usage-in-openai-snapshot evidence are new. [SOURCE: context/pi-gpt-fast-mode/src/types.ts:19, context/pi-gpt-fast-mode/src/handoff.ts:3, context/pi-gpt-fast-mode/tests/state.test.ts:56-64, context/pi-gpt-fast-mode/README.md:73,84, grep of context/pi-openai-fast-mode]

5. **`PI_FAST_MODE_W_SUBAGENT_SUPPORT` fit: zero collisions; well-formed but verbose; use strict `"1"`.** No `PI_FAST_MODE*`/`PI_FAST*`/`PI_OPENAI_FAST*`/`PI_GPT_FAST*` occurrence exists in installed packages, git sources, or Public `.pi`. The name does not touch the reserved pi-subagents `PI_SUBAGENT*` namespace, core config vars, or session vars, and it rides the same `process.env` propagation path that already carries `PI_GPT_FAST_MODE` to child pi subagents (iteration-2 findings f-9/f-10). Convention check: the family pattern is `PI_<SHORT_COMPONENT>_<CONFIG>` (`PI_WEB_ACCESS_DISABLE_NODE_SQLITE`, `PI_SUBAGENT_INTERCOM_SESSION_NAME`); `PI_FAST_MODE_W_SUBAGENT_SUPPORT` matches `PI_<FEATURE>_<DETAIL>` but is the longest var in the family (~31 chars). Shorter, equally collision-free alternatives: `PI_FAST_MODE_HANDOFF` or `PI_FAST_MODE_SUBAGENT_HANDOFF`. Recommendation: whichever name is chosen, adopt `PI_GPT_FAST_MODE`'s strict `"1"`-only semantics and document it in README + env reference. [SOURCE: grep scans (findings 1-3) + context/pi-gpt-fast-mode/tests/state.test.ts:56-64; INFERENCE: naming-convention match from findings 2-3]

6. **Public `.pi` config surface is clean of `PI_*` env references (negative finding).** The `~/.pi` scan (excluding `node_modules`/`.git`) matched only historical session transcripts under `agent/sessions/*.jsonl` (logs of past tool calls, not config). No settings file, plugin manifest, or sync manifest references any `PI_*` env var. No user-side collision risk exists in Public `.pi` today; the fork's env var also cannot collide with the repo's own `.opencode` MCP config vars (which use `SPECKIT_*`/`MK_SKILL_ADVISOR_*`/`EMBEDDINGS_*` prefixes, not `PI_*`). [SOURCE: bash grep -rIn --exclude-dir=node_modules --exclude-dir=.git -E 'PI_[A-Z0-9_]{2,}' ~/.pi (matches restricted to agent/sessions/*.jsonl transcripts)]

## Questions Answered
- Q3 Env-var namespace hygiene: collision scan of `PI_*` vars across installed packages, git sources, and Public `.pi`; naming conventions; `PI_FAST_MODE_W_SUBAGENT_SUPPORT` fit — **answered** (findings 1-6).

## Questions Remaining
- Q4 Config compatibility & migration (pi-openai-fast-mode schema/self-upgrade; pi-gpt-fast-mode models list; migration path; both-configs-read question)
- Q5 /fast command collision (duplicate command/flag registration; safe install/remove ordering; verification)
- Q6 Packaging & install mechanics (pi install local/git/npm; pi.extensions; raw TS; tsconfig; pi.dev indexing; publish checklist)
- Q7 Testing patterns (ExtensionAPI mocks; vitest for raw TS; env-inheritance child-process tests; coverage)
- Q8 Indicator UX under custom footers (setFooter vs widget; status fallback)
- Q9 TheBinaryGuy pi-fast-mode edge cases worth adopting
- Q10 Licensing, notices, docs, maintenance

## Next Focus
Approved queue lane 4: **Config compatibility & migration** — pi-openai-fast-mode schema and self-upgrade; pi-gpt-fast-mode models list; migration path; both-configs-read question.

## Sources Consulted
- ~/.pi/agent/npm/node_modules/pi-subagents/src/runs/shared/pi-args.ts:740-747; pi-subagents/src/shared/types.ts:2147-2193; pi-subagents/src/runs/shared/llm-intent-arbiter.ts:229; pi-subagents/src/runs/shared/worktree.ts:198; pi-subagents/src/runs/shared/orca-progress-tabs.ts:64
- ~/.pi/agent/npm/node_modules/pi-intercom/broker/paths.ts:52-57; pi-intercom/config.ts:8; pi-intercom/project-agent.ts:245; pi-intercom/broker/client.ts:48-53
- ~/.pi/agent/npm/node_modules/pi-blackhole/src/pi-base/blackhole-settings.ts:316-353
- ~/.pi/agent/npm/node_modules/pi-web-access/gemini-web-config.ts:47; pi-web-access/chrome-cookies.ts:340
- ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/environment-variables.md
- specs/hooks/011-pi-fast-mode-w-subagent-support/context/pi-gpt-fast-mode/src/types.ts:19; src/handoff.ts:3; tests/state.test.ts:56-64; README.md:73,84
- specs/hooks/011-pi-fast-mode-w-subagent-support/context/pi-fast-mode/README.md:55; test/openai-codex-fast-mode.test.ts:199
- Public `.pi` scan: ~/.pi (grep -rIn, excludes node_modules/.git) — matches only agent/sessions/*.jsonl transcripts

## Assessment
- New information ratio: 0.83 (4 of 6 findings fully new; 2 partially new — official env surface and strict-`1` semantics overlap iteration-2 findings f-11/f-12)
- Questions addressed: Q3 (lane 3) fully; naming convention derived; fit verdict delivered
- Questions answered: Q3
- Edge cases: none (no contradictory evidence; doc and code agree on the namespace; the only drift — the stale `PI_OPENAI_FAST_DESIRED` comment — was resolved by code evidence and is reported as a finding, not a contradiction)

## Reflection
- What worked and why: grepping *code-level reads* (`env.PI_`) instead of bare `PI_` strings kept the installed-package scan signal-dense — comments/READMEs in node_modules would have drowned the inventory. Combining three independent scan surfaces (installed, git-source, Public `.pi`) in one pass made the zero-collision verdict provable rather than assumed. The official env doc settled the core-vs-extension boundary in one read.
- What did not work and why: the Public `.pi` scan initially matched noisy session transcripts; filtering to non-`node_modules` paths still included `agent/sessions/*.jsonl`, requiring manual discrimination between live config and historical logs. Next time, exclude `*/sessions/*` up front.
- What I would do differently: for lane 4, read `context/pi-openai-fast-mode/src/config*.ts` and `context/pi-gpt-fast-mode/src/models*.ts` directly (same snapshot-relative approach that made lanes 1-3 fast) instead of hunting the npm registry.

## Edge Cases
- Ambiguous input: none — lane 3 scope was explicit in the orchestrator focus-map override.
- Contradictory evidence: none — the only apparent conflict (stale `PI_OPENAI_FAST_DESIRED` comment vs `PI_GPT_FAST_MODE` const) was comment drift, resolved by code + test evidence (finding 4).
- Missing dependencies: memory daemon unavailable (known from strategy §12); direct packet context + installed docs were sufficient.
- Partial success: none — all four research actions succeeded.
- Scope note: config declares `progressiveSynthesis: true`, but the iteration prompt pack's ALLOWED WRITE PATHS list (authoritative for write scope) excludes `research/research.md`; per pack-vs-config precedence, `research/research.md` was not touched this iteration.

## SCOPE VIOLATIONS
None. All writes stayed inside the three allowed paths; the researched surface (context snapshots, installed packages, Public `.pi`) was read-only.

## Recommended Next Focus
Lane 4 (Config compatibility & migration), per the approved ten-lane queue. Carry forward: the fork's handoff env var should use strict `"1"` semantics and the `PI_FAST_MODE_*` prefix (finding 5) — the config migration lane should document the `PI_OPENAI_FAST_DESIRED` legacy name as a non-supported alias to avoid confusion (finding 4).
