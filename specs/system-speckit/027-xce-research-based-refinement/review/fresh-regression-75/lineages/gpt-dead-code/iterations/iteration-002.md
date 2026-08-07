# Seat gpt-dead-code — iteration 2 (global #55)

- Model: `claude-opus-4-8` · Executor: claude · Angle: gpt-dead-code
- Verdict: **PASS** · Findings: P0=0 P1=0 P2=0

## Analysis

I've completed a thorough adversarial trace of my assigned angle. Here is my analysis.

## Review: gpt-dead-code — default-off flags never wired / unreachable flag-gated code

**Scope traced:** 027's new `SPECKIT_*` feature flags vs. their actual read sites. I enumerated the flag surface, then for each core 027 deliverable flag traced (a) whether a production read site exists, (b) whether it reads via direct `process.env.X` or env-key-constant indirection, and (c) whether the resolved value is actually *consumed* by a gate (not computed-then-ignored).

**Flag clusters verified wired + consumed:**

| Flag (027 sub-phase) | Read site | Gate consumed |
|---|---|---|
| `SPECKIT_MEMORY_IDEMPOTENCY` (002-014) | `lib/storage/idempotency-receipts.ts:55` | yes |
| `SPECKIT_MAX_SECONDARY_CLIENTS` (004-007) | `shared/ipc/socket-server.ts:66` + code-graph `lib/ipc/socket-server.ts:66` (both daemons) | yes (`parseMaxClients`) |
| `SPECKIT_DAEMON_REELECTION` (004-008) | `bin/mk-spec-memory-launcher.cjs:206` | yes (`daemonReelectionEnabled` → spawn IO + release) |
| `SPECKIT_CODE_GRAPH_INDEX_{SKILLS,AGENTS,COMMANDS,SPECS,PLUGINS}` (004-009) | `index-scope-policy.ts:146,245-248` via env-key constants | yes → exclude globs in `buildIndexScopePolicy` |
| `SPECKIT_SEMANTIC_TRIGGERS` (002-003) | `semantic-trigger-matcher.ts:104` | yes (`semantic-trigger-matcher.ts:450`, `memory-triggers.ts:472`) |
| `SPECKIT_SEMANTIC_TRIGGERS_MODE` | `memory-triggers.ts:469` | yes (line 472 union gate) |
| `SPECKIT_TRIGGER_EMBEDDING_BACKFILL` (002-003) | `trigger-embedding-backfill.ts:53` | yes (`:134-137` short-circuit `skipped_default_off`) |
| `SPECKIT_COMPLETION_FRESHNESS` / `_ENFORCE` | `validate.sh:831,1046` / `continuity-freshness.ts:89` | yes |
| `SPECKIT_AC_COVERAGE` / `_FLOOR` | `check-ac-coverage.sh:11,20,178` | yes |
| `SPECKIT_ADVISOR_DOC_TRIGGERS` (004-008) | `doc-frontmatter.ts:23` + launcher passthrough | yes |
| `SPECKIT_DESCRIPTION_REPAIR_MERGE_SAFE` | `folder-discovery.ts:90` | yes |
| CLI front-door flags `*_CLI_{WARM_ONLY,PROMPT_TIME,TRUSTED,PROBE_TIMEOUT_MS,FALLBACK_TIMEOUT_MS}` (004-001) | `spec-memory-cli.ts:367-369`, `code-index-cli.ts:403-405`, `skill-advisor-cli.ts:344,355-358`, `skill-advisor-cli-fallback.ts:151,232` | yes |

**Key methodological note:** my initial `process.env.SPECKIT_X` greps returned "no production reads" for several flags (`DAEMON_REELECTION`, the `CODE_GRAPH_INDEX_*` set, `SEMANTIC_TRIGGERS`, `TRIGGER_EMBEDDING_BACKFILL`). Each turned out to be a **false alarm** — they are read via env-key-constant indirection (`env[CONST]`, `process.env[FLAG]`) or in a launcher `.cjs`, all properly consumed. I personally opened each read site and its consumer rather than trusting the name-based grep. No flag survived as genuinely unread.

The `.cjs` front-doors are thin wrappers that only directly reference `SPECKIT_IPC_SOCKET_DIR` and their own `*_CLI_DEV_ALLOW_STALE`; the rest of the documented CLI flags are honored in the delegated `*-cli.ts` modules — this is normal delegation, not dead wiring.

**Verdict:** For my narrow angle, the epic is clean. Every default-off 027 flag I traced is wired to a real gate, uses correct default-off short-circuit semantics, and has its resolved value consumed. I found no flag that is referenced-but-never-read and no flag-gated code that is unreachable. I could not complete an exhaustive automated registry-vs-source set-diff (the sandbox blocked `xargs`/process-substitution/`awk`-getline subprocess spawning), so this rests on targeted high-confidence traces of the documented 027 deliverable flags rather than a full registry sweep — but the sampled coverage spans all 12 sub-phase flag clusters and none showed the defect pattern. I will not invent findings to fill space.

```json
{"seat":"gpt-dead-code","model":"openai/gpt-5.5-fast","angle":"Default-off flags referenced but never wired to a real gate / unreachable code behind a flag that is never read.","verdict":"PASS","summary":"All 12 traced 027 default-off flag clusters are wired to real gates and their values consumed; reads use env-key indirection (not process.env.X), so name-greps falsely read as dead but every site checks out. No dead/unread flags found.","files_reviewed":[".opencode/bin/spec-memory.cjs",".opencode/bin/code-index.cjs",".opencode/bin/skill-advisor.cjs",".opencode/bin/mk-spec-memory-launcher.cjs",".opencode/skills/system-code-graph/mcp_server/lib/index-scope-policy.ts",".opencode/skills/system-spec-kit/mcp_server/lib/storage/idempotency-receipts.ts",".opencode/skills/system-spec-kit/shared/ipc/socket-server.ts",".opencode/skills/system-spec-kit/mcp_server/lib/triggers/semantic-trigger-matcher.ts",".opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts",".opencode/skills/system-spec-kit/mcp_server/lib/search/trigger-embedding-backfill.ts",".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts",".opencode/skills/system-spec-kit/scripts/spec/validate.sh",".opencode/skills/system-spec-kit/scripts/rules/check-ac-coverage.sh",".opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/doc-frontmatter.ts",".opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts",".opencode/skills/system-spec-kit/mcp_server/spec-memory-cli.ts",".opencode/skills/system-code-graph/mcp_server/code-index-cli.ts",".opencode/skills/system-skill-advisor/mcp_server/skill-advisor-cli.ts"],"findings":[]}
```
