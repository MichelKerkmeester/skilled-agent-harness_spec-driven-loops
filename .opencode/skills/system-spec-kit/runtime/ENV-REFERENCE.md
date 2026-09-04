---
title: SPECKIT Environment Variable Reference
description: Environment variables read by the surviving spec-kit engine (validation orchestrator, generated metadata, level contracts, continuity writer and runtime hook adapters), plus the shared and advisor-owned variables that the package's operators still meet, with defaults, types and verified source file references.
---

# SPECKIT Environment Variable Reference

> Environment variables read by the spec-kit engine in this package, plus the shared embedding/IPC and skill-advisor variables that live outside it but are documented here because operators configure them alongside it.

---

## 1. OVERVIEW

All variables are optional. The engine runs with sensible defaults when none are set. Variables use **graduated semantics** unless noted: they default to ON and you disable them by setting `=false`.

**What this package still is.** The memory engine was removed. The MCP transport (`context-server`), the memory tools and handlers, the memory database and its launcher, sqlite vector search, the in-package embedders, the evals and migrations, and the spec-memory CLI shim and plugin bridge are all gone. What remains is the spec-kit engine: the validation orchestrator, the graph and description metadata generators, the documentation level contracts, the continuity writer's imports, and the runtime hook adapters under `hooks/` for Claude, Codex, Cursor, Devin and Pi.

**What is documented elsewhere but kept here.** The skill advisor, the shared HF model server and its `hf-embed` socket, and the shared embeddings and IPC code under `.opencode/skills/system-spec-kit/shared` and `.opencode/bin` were not touched by the removal. Their variables keep rows below, and each row's Source column names the file that actually reads it so ownership is unambiguous.

**Flag convention:**

| Pattern | Meaning |
|---------|---------|
| `!== 'false'` | **Graduated ON**: enabled by default, set `false` to disable |
| `=== 'true'` | **Opt-in OFF**: disabled by default, set `true` to enable |
| `parseFloat(... \|\| 'N')` | Numeric with fallback default N |
| `?.trim()` | String, empty = use default |

### Flag inventory

**There is no longer a feature-flag registry to tabulate.** `lib/search/search-flags.ts` was deleted with the memory engine, taking about ninety retrieval, ranking, graph, cognitive and feedback gates with it. `lib/config/capability-flags.ts` survives but now declares six gates, all of them in [Section 3](#3-spec-validation-and-generated-metadata): `SPECKIT_GENERATOR_HARDENING`, `SPECKIT_GENERATED_METADATA_GRANDFATHER`, `SPECKIT_GENERATED_METADATA_DRIFT_GATE`, `SPECKIT_IDENTITY_MERGE_SAFETY`, `SPECKIT_IDEMPOTENT_DESCRIPTION_WRITES` and `SPECKIT_STATUS_COMPLETION_CONSISTENCY_GATE`.

Every variable below now lives in the section that owns its reader, and each row's Source column names that file. If you are looking for a flag that used to be in this table and cannot find it, it was retired: nothing reads it, and setting it does nothing.
Total unique variables documented: 146, counted as unique backticked names in the Variable column of every table below. Recount with that method when adding rows. Multi-variable cells count once per name. Every one of the 146 has a verified reader in source; a name with no reader is removed rather than kept as history.

### Data Quality and Generator Hardening (028/005)

Generator and validation-gate flags for the spec-data-quality and generator-hardening packets. Most have since graduated to default-on and enforcing; the two that stay off are the grandfather escape hatch and the status-completion gate, which is held in report mode until its existing backlog is reviewed. These are the live half of the flag surface: unlike the retrieval registry in the table above, changing one of these changes what `validate.sh` and the metadata generators do.

| flag name | default state (ON/OFF) | governing env var | which automation it gates | runtime read site |
| --- | --- | --- | --- | --- |
| Generator hardening | ON | `SPECKIT_GENERATOR_HARDENING` | Persists the graph-metadata `source_fingerprint`, routes the phase-parent classification and the derived children list through one `listPhaseChildren` enumeration, and moves access/freshness telemetry to the index-layer store so a read or resume no longer dirties the generated JSON | `lib/config/capability-flags.ts`, `lib/graph/graph-metadata-parser.ts`, `lib/spec/is-phase-parent.ts`, `lib/graph/access-telemetry.ts`, `lib/resume/resume-ladder.ts`, `lib/validation/generated-metadata-integrity.ts` |
| Generated-metadata grandfather | OFF (enforcing) | `SPECKIT_GENERATED_METADATA_GRANDFATHER` | Graduated default-off-enforcing: a generated-metadata integrity violation (including a missing or mismatched `source_fingerprint`) is a hard strict error. Set `true`/`1` to restore the non-blocking report-mode `info` for a tree that has not been restamped | `lib/config/capability-flags.ts`, `lib/validation/generated-metadata-integrity.ts` |
| Status-completion consistency gate | OFF (report mode) | `SPECKIT_STATUS_COMPLETION_CONSISTENCY_GATE` | New check, inverse polarity from the flag above: cross-checks a stored `derived.status: complete` against `completion_pct`/open `tasks.md` items. Default OFF because a repo-wide sweep found 213 folders already mislabeled `complete` by a prior `deriveStatus` defect (fixed separately); a disagreement surfaces in `--strict` output but stays non-blocking until the existing backlog is reviewed. Set `true`/`1` to enforce (fails strict) | `lib/config/capability-flags.ts`, `lib/validation/generated-metadata-integrity.ts` |
| Identity and merge safety | ON | `SPECKIT_IDENTITY_MERGE_SAFETY` | Graduated default-on: both generators resolve a shared specs-root-relative spec-folder identity and the merge preserves a non-null parent plus unions children so a scoped re-derive cannot erase lineage. Set `false`/`0`/`off` to restore the legacy caller-base path and spread merge | `lib/config/capability-flags.ts`, `lib/graph/graph-metadata-parser.ts` |
| Idempotent description writes | ON | `SPECKIT_IDEMPOTENT_DESCRIPTION_WRITES` | Graduated default-on: a per-folder description write whose only delta is the volatile stamp is skipped and the aggregate-cache write is gated on a real member delta, preserving the prior timestamp. Set `false`/`0`/`off` to restore the unconditional legacy write | `lib/config/capability-flags.ts` |
| Generated-metadata z-exclusion | ON | `SPECKIT_GENERATED_METADATA_Z_EXCLUSION` | Excludes `z_*` archive directories from the spec-folder discovery scanner. Set `false` to restore the prior scanner that descended them | `lib/search/folder-discovery.ts` |
| Entity config path override | (bundled rules) | `SPECKIT_ENTITY_CONFIG_PATH` | Points `resolveExtractionRules()` at a JSON rule file. A readable, valid file replaces the built-in rules; any read, parse or validation failure logs a warning and falls back to the built-in set | `lib/extraction/entity-extractor.ts` |
| Metadata disk-path consistency enforce | ON (enforcing) | `SPECKIT_METADATA_DISK_CONSISTENCY_ENFORCE` | Advisory→enforce toggle for the `METADATA_DISK_PATH_CONSISTENCY` rule: a `description.json`/`graph-metadata.json` path mismatch against the on-disk folder fails `--strict`. Graduated 2026-07-10 on a reconciled tree-wide census (1,130 real mismatches reconciled; remaining residual is non-production paths, see 019-validation-enforce-graduation/implementation-summary.md); set `false` to fall back to advisory-only | `scripts/rules/check-metadata-disk-consistency.sh` |
| Status cross-doc consistency enforce | ON (enforcing) | `SPECKIT_STATUS_CROSS_DOC_ENFORCE` | Advisory→enforce toggle for the `STATUS_CROSS_DOC_CONSISTENCY` rule: a classified-status disagreement between `spec.md` and `implementation-summary.md` fails `--strict`. Graduated 2026-07-10 on a reconciled tree-wide census (2 honestly-documented residuals remain, see 019-validation-enforce-graduation/implementation-summary.md); set `false` to fall back to advisory-only | `scripts/rules/check-status-cross-doc-consistency.sh` |
| Graph metadata child-drift enforce | ON (enforcing) | `SPECKIT_CHILD_DRIFT_ENFORCE` | Advisory→enforce toggle for the `GRAPH_METADATA_CHILD_DRIFT` rule: a phase parent's `children_ids` missing an on-disk phase child fails `--strict`. Also gates a dist-presence freshness guard on the child-scanner dependency, so a stale or missing scanner build fails closed rather than silently reporting clean. Graduated 2026-07-10 on a reconciled tree-wide census, see 019-validation-enforce-graduation/implementation-summary.md; set `false` to fall back to advisory-only | `scripts/rules/check-graph-metadata-child-drift.sh`, `scripts/lib/dist-freshness.cjs` |

### Provisional Measurement Contract

Publication-facing metric rows now use the shared measurement contract from `lib/context/shared-payload.ts`.

- Every publishable metric field must declare one certainty label: `exact`, `estimated`, `defaulted`, or `unknown`.
- Headline multipliers stay blocked unless prompt, completion, cache-read, and cache-write token fields all have `provider_counted` authority. Later packets should reuse `canPublishMultiplier()` instead of inventing packet-local gates.
- Publication-grade rows must carry methodology metadata with `schemaVersion`, `methodologyStatus`, and at least one provenance entry before they can be emitted.
- No environment variable disables or downgrades this contract. The telemetry and eval toggles that once fed it were removed with the memory engine, and nothing replaced them.

### Hook kill-switches

All repo-authored hook concerns are enabled by default. Set the master flag or one canonical concern flag to a truthy value (`1`, `true`, `yes`, or `on`, case-insensitive) to disable that surface. Resolver failures are fail-open.

Flags can be set as environment variables **or** in a config file: copy `.opencode/hooks/hook-flags.env.example` to `.opencode/hooks/hook-flags.env` (gitignored) and set the same `KEY=value` names there. A real environment variable always overrides the file, so a persisted default can be flipped back for one session. `HOOK_FLAGS_CONFIG` overrides the config file path.

**These names are derived, not written down.** `concernFlag()` in `.opencode/hooks/shared/hook-flags.cjs` builds the default shape `SYSTEM_<CONCERN>_DISABLED` from the concern slug, and `CONCERN_CANONICAL` overrides it for the six concerns owned by a named surface (`goal`, `dispatch`, `mcp-route-guard`, `codex-watchdog`, `git-preflight`, `post-edit-quality`). Grepping the repo for one of the derived names therefore finds nothing, which is expected and not evidence the flag is dead. The Source column below names the surface the concern gates, not a literal read site.

| Variable | Default | Type | Description | Source |
|----------|---------|------|-------------|--------|
| `SYSTEM_HOOKS_DISABLED` | unset (enabled) | truthy disable flag | Master switch for every concern below. No aliases. | `.opencode/hooks/shared/hook-flags.{cjs,mjs,ts,sh}` |
| `SYSTEM_SKILL_ADVISOR_DISABLED` | unset (enabled) | truthy disable flag | Disables skill-advisor injection. Aliases: `SYSTEM_SKILL_ADVISOR_HOOK_DISABLED`, `SYSTEM_SKILL_ADVISOR_PLUGIN_DISABLED`, `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED`, `SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED`. | `system-skill-advisor/hooks/claude/user-prompt-submit.ts`, `.opencode/plugins/system-skill-advisor.js` |
| `SYSTEM_SPEC_GATE_DISABLED` | unset (enabled) | truthy disable flag | Disables spec-gate injection and enforcement. Alias: `SPECKIT_SPEC_GATE_DISABLED`. | `hooks/lib/spec-gate/spec-gate-core.mjs`, `.opencode/plugins/system-spec-gate.js` |
| `SYSTEM_COMPLETION_DISABLED` | unset (enabled) | truthy disable flag | Disables completion-evidence warnings. Aliases: `SYSTEM_COMPLETION_SENTINEL_DISABLED`, `SYSTEM_SPECKIT_COMPLETION_DISABLED`. | `hooks/*/completion-evidence*`, `.opencode/plugins/system-completion-sentinel.js` |
| `CODEX_WATCHDOG_DISABLED` | unset (enabled) | truthy disable flag | Disables Codex hook-drift warnings. No aliases. | `.opencode/plugins/codex-hooks-watchdog.js` |
| `SYSTEM_PERMISSION_POLICY_DISABLED` | unset (enabled) | truthy disable flag | Disables Devin permission-policy decisions. No aliases. | `hooks/devin/permission-request-policy.mjs` |
| `SYSTEM_DIRECTIVE_LIFECYCLE_DISABLED` | unset (enabled) | truthy disable flag | Disables directive lifecycle boundary handling. No aliases. | `system-skill-advisor/hooks/claude/directive-lifecycle-boundary.ts`, `hooks/claude/directive-lifecycle-boundary.ts` |
| `SYSTEM_DISPATCH_DISABLED` | unset (enabled) | truthy disable flag | Disables dispatch preflight and audit hooks. Alias: `CLI_DISPATCH_AUDIT_DISABLED`. | `.opencode/hooks/dispatch/`, `.opencode/plugins/cli-dispatch-audit.js` |
| `SK_CODE_POST_EDIT_QUALITY_DISABLED` | unset (enabled) | truthy disable flag | Disables post-edit quality warnings. No aliases. | `.opencode/hooks/post-edit-quality/`, `.opencode/plugins/sk-code-post-edit-quality.js` |
| `SYSTEM_TASK_DISPATCH_DISABLED` | unset (enabled) | truthy disable flag | Disables task-dispatch warnings and denials. No aliases. | `.opencode/hooks/task-dispatch/`, `.opencode/plugins/system-deep-loop-guard.js` |
| `MCP_ROUTE_GUARD_DISABLED` | unset (enabled) | truthy disable flag | Disables MCP route warnings and audit records. No aliases. | `.opencode/hooks/mcp-route-guard/`, `.opencode/plugins/mcp-route-guard.js` |
| `OPENCODE_GOAL_DISABLED` | unset (enabled) | truthy disable flag | Disables goal injection and tools. Alias: `OPENCODE_GOAL_PLUGIN_DISABLED`. | `.opencode/hooks/goal/`, `.opencode/plugins/opencode-goal.js` |
| `SK_GIT_PREFLIGHT_DISABLED` | unset (enabled) | truthy disable flag | Disables git-preflight advisories. No aliases. | `.opencode/skills/sk-git/scripts/hooks/`, `.opencode/plugins/sk-git-preflight-advisory.js` |
| `SYSTEM_SESSION_LIFECYCLE_DISABLED` | unset (enabled) | truthy disable flag | Disables session-start, stop, and compaction hook handling. No aliases. | `hooks/{claude,codex,cursor,devin,pi}/session-*` |
| `SYSTEM_GIT_WORKTREE_GUARD_DISABLED` | unset (enabled) | truthy disable flag | Disables the worktree warning. Aliases: `SYSTEM_WORKTREE_GUARD_DISABLED` (pre-rename), `SPECKIT_WORKTREE_GUARD=off` (caller-side, exact `off` grammar). | `.opencode/bin/worktree-guard.sh`, `hooks/pi/session-start-advisories.ts` |
| `SYSTEM_GIT_HOOKS_CHECK_DISABLED` | unset (enabled) | truthy disable flag | Disables the git-hooks installation warning. Caller-side alias: `SPECKIT_GIT_HOOKS_GUARD=off` (exact `off` grammar). | `.opencode/bin/check-git-hooks.sh`, `hooks/pi/session-start-advisories.ts` |
| `SYSTEM_DIST_FRESHNESS_DISABLED` | unset (enabled) | truthy disable flag | Disables dist-freshness checks. No aliases. | `.opencode/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh`, `.opencode/plugins/system-dist-freshness-guard.js` |
| `SYSTEM_SESSION_CLEANUP_DISABLED` | unset (enabled) | truthy disable flag | Disables session cleanup and teardown. No aliases. | `.opencode/scripts/session-cleanup.sh`, `.opencode/plugins/session-cleanup.js` |
| `SYSTEM_HOOK_INSTALL_DISABLED` | unset (enabled) | truthy disable flag | Disables Codex hook installation and check mode. No aliases. | `.opencode/bin/install-codex-hooks.mjs`, `hooks/pi/session-start-advisories.ts` |
| `SYSTEM_GIT_COMMIT_HOOKS_DISABLED` | unset (enabled) | truthy disable flag | Emergency-off switch for the pre-commit chain. No aliases. Unset keeps the mass-deletion and comment-hygiene gates active. | `.opencode/scripts/git-hooks/pre-commit`, `.opencode/hooks/git/pre-commit` |
| `SYSTEM_LIVE_SYNC_DISABLED` | unset (enabled) | truthy disable flag | Master switch for the whole live-sync loop: post-commit autosync publish, SessionStart primary reconcile, IDE follower auto-start, and self-heal hook auto-install. No aliases. | `.opencode/scripts/git-hooks/post-commit`, `.opencode/bin/check-git-hooks.sh`, `.opencode/bin/git-primary-reconcile.sh`, `.opencode/bin/git-live-follow.sh` |
| `SYSTEM_PRIMARY_RECONCILE_DISABLED` | unset (enabled) | truthy disable flag | Disables SessionStart reconciliation of the clean primary live checkout only. Publish, follower, and self-heal legs keep running. No aliases. | `.opencode/bin/git-primary-reconcile.sh` |
| `SYSTEM_LIVE_FOLLOW_DISABLED` | unset (enabled) | truthy disable flag | Disables the IDE checkout follower auto-start only. The publish and self-heal legs keep running. No aliases. | `.opencode/bin/git-live-follow.sh` |
| `SPECKIT_AUTOSYNC` | unset (defaults to 1 in wrapper sessions) | truthy flag | Per-launch publish opt-out for the live-sync loop. Wrapper sessions export 1 unless a pre-set 0 overrides it. | `.opencode/bin/worktree-session.sh`, `.opencode/scripts/git-hooks/post-commit` |
| `SPECKIT_LIVE_BRANCH` | (unset) | string | The live branch a wrapper session publishes its commits to, resolved from the primary checkout. | `.opencode/bin/worktree-session.sh` |

`SYSTEM_SPEC_GATE_ENFORCE` is an opt-in control for denial, not a kill-switch. **`SPECKIT_DIST_AUTO_REBUILD` is not a disable flag**: it controls rebuild behavior after a freshness check and does not stop the check from running.

### Hook-level lifecycle flags

Directive-capsule lifecycle dedup has runtime-specific output cadence. Model-context surfaces deliver the complete advisor brief on the first message and after lifecycle boundaries, then retain only the dynamic `Advisor:` route line on a proven repeat. Pi visibly transforms the user's prompt, so its proven repeat returns no transform and contributes neither the advisor brief nor the Pi dispatch reminder. Every uncertain path fails open to the surface's declared full behavior. These three are **owned by the skill advisor**, not by this package: their read sites are all under `.opencode/skills/system-skill-advisor/hooks/`, and they survived the memory decommission untouched.

| flag name | default state (ON/OFF) | governing env var | which automation it gates | runtime read site |
| --- | --- | --- | --- | --- |
| Directive lifecycle dedup (model-context) | ON (graduated) | `SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP` | Drops constant policy only for a confirmed same-epoch repeat with valid transcript evidence, matching versioned state, and an atomically advanced high-water mark. Registered host boundaries advance epoch/generation state; failed or unidentified resets invalidate older receipts. Set `0`/`false`/`off`/`no` to restore always-full delivery | `.opencode/skills/system-skill-advisor/hooks/lib/directive-lifecycle.ts`, `directive-lifecycle-file-store.ts`, `directive-lifecycle-store.py`, `.opencode/skills/system-skill-advisor/hooks/claude/directive-lifecycle-boundary.ts`, `.opencode/plugins/system-skill-advisor.js` |
| Directive lifecycle dedup (Pi) | ON (graduated) | `SPECKIT_PI_DIRECTIVE_DEDUP` | Full advisor-and-dispatch contribution on the first message and after `session_start`/`session_compact`; a proven repeat returns no transform, records no new delivery receipt, and leaves tool-call dispatch enforcement active. Set `0`/`false`/`off`/`no` to restore always-full | `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts` (`decidePiDirectiveDelivery`) |
| Directive lifecycle state dir | `os.tmpdir()/speckit-advisor/directive-lifecycle` | `SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR` | Overrides the private state root used by the directory-descriptor-anchored subprocess store. Unsupported helper/platform, unsafe ownership/mode/type/link/size, contention, or IO failure disables suppression. A separate fail-safe poison root prevents recovered processes from reusing receipts after a failed boundary mutation | `.opencode/skills/system-skill-advisor/hooks/lib/directive-lifecycle-file-store.ts`, `directive-lifecycle-store.py` |

---

## 2. INFRASTRUCTURE

**Ownership.** Every row here is either read by surviving package source or owned outside the
package. *Read by this package:* the `SPECKIT_DB_DIR`/`SPEC_KIT_DB_DIR`/`MEMORY_DB_PATH`/
`MEMORY_BASE_PATH` family in `core/config.ts`, whose `resolveDatabasePaths()` is still imported by
`lib/storage/transaction-manager.ts` and re-exported from `api/index.ts`; plus `SPECKIT_SPECS_DIR`
and `SPECKIT_ROLLOUT_PERCENT`. *Shared, owned by the HF model server and the skill
advisor:* `SPECKIT_IPC_SOCKET_DIR`, `SPECKIT_MAX_SECONDARY_CLIENTS`,
`SPECKIT_LAUNCHER_BRIDGE_DISABLED`, `SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN`, the `SPECKIT_LEASE_PROBE_*`
trio and `SPECKIT_OPENCODE_HOOK_TIMEOUT_MS` — the skill-advisor launcher and the shared IPC bridge
read them, so they survived the memory decommission. The rows that went out with that engine — the
launcher log trio, the orphan-sweep budget pair, the eval database path, the rebind and write-lock
overrides, the preflight `MCP_*` numbers and the boot FTS auto-heal — are gone from this table
because nothing reads them any more.

| Variable | Default | Type | Description | Source |
|----------|---------|------|-------------|--------|
| `SPECKIT_DB_DIR` | (derived) | string | Directory override consulted by `computeDatabasePaths()`. `SPEC_KIT_DB_DIR` is checked first and wins; either one is resolved against `process.cwd()` and must land inside the project, home, or temporary directory or the call throws. | `core/config.ts` |
| `MEMORY_DB_PATH` | (unset) | string | Explicit file path whose parent directory becomes the resolved database directory, but only when neither `SPEC_KIT_DB_DIR` nor `SPECKIT_DB_DIR` is set. A directory override intentionally wins over this path's parent. | `core/config.ts` |
| `MEMORY_BASE_PATH` | `process.cwd()` | string | Workspace root used as `DEFAULT_BASE_PATH` for path validation. | `core/config.ts` |
| `SPECKIT_SPECS_DIR` | (unset) | string | Fallback specs-root used when resolving a spec folder that is not directly under `process.cwd()`. `SPEC_KIT_SPECS_DIR` is checked first and wins. The candidate is `resolve(cwd, <override>, <specFolder>)` and is used only if it exists; otherwise resolution falls through to the spec-document finder. | `api/graph-refresh.ts` |
| `SPECKIT_ROLLOUT_PERCENT` | `100` | number | Global rollout percentage (0-100) read by `getRolloutPercent()` and clamped to an integer. A missing or blank value uses the default. | `lib/cognitive/rollout-policy.ts` |
| `SPECKIT_LAUNCHER_BRIDGE_DISABLED` | `false` | boolean | Rollback flag for launcher bridge mode. Set `1` to force legacy strict-single-writer behavior, where a secondary launcher prints `LEASE_HELD_BY` and exits instead of attaching to the daemon IPC socket. | `.opencode/bin/lib/launcher-ipc-bridge.cjs`, `.opencode/bin/system-skill-advisor-launcher.cjs` |
| `SPECKIT_MAX_SECONDARY_CLIENTS` | `64` | number | Maximum concurrent secondary stdio clients the daemon IPC socket accepts before refusing new bridge connections. A refused connection (accept-then-close) is indistinguishable from a dead daemon to probes, so keep this above the realistic concurrent-session fleet. Pinned to `64` in the runtime configs. | `shared/ipc/socket-server.ts`, `.opencode/bin/system-skill-advisor-launcher.cjs` |
| `SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN` | `30` | number | Idle self-exit timeout, in minutes, for the daemon-backed MCP server processes. Fractional values are allowed for tests; `0` disables the idle monitor. Primary stdio input and secondary IPC connect/data/write events refresh activity, and active secondary IPC clients keep the server alive. | `.opencode/skills/system-skill-advisor/mcp-server/lib/ipc/launcher-idle-timeout.ts`, `.opencode/bin/system-skill-advisor-launcher.cjs` |
| `SPECKIT_LEASE_PROBE_RETRIES` | `1` | number | Consecutive deep liveness-probe retries before a sibling launcher reaps the lease owner and respawns. `0` restores single-probe behavior. Requiring N consecutive failures stops a busy-but-alive owner being false-reaped into a duplicate daemon. Any `alive` probe short-circuits to a bridge. | `.opencode/bin/lib/launcher-ipc-bridge.cjs` |
| `SPECKIT_LEASE_PROBE_RETRY_TIMEOUT_MS` | `1500` | number | Per-attempt timeout, clamped to the 6999 ms probe ceiling, for each lease retry probe after the first. Kept short so the default budget stays under the launcher grace window. | `.opencode/bin/lib/launcher-ipc-bridge.cjs` |
| `SPECKIT_LEASE_PROBE_RETRY_BACKOFF_MS` | `250` | number | Backoff between consecutive lease liveness-probe attempts. | `.opencode/bin/lib/launcher-ipc-bridge.cjs` |
| `SPECKIT_IPC_SOCKET_DIR` | model-server default | string | Overrides the daemon IPC socket directory, using `daemon-ipc.sock` as the socket file name. **Required on macOS** for production runtimes: a long default path exceeds the 104-char `sun_path` limit and `listen()` fails with `EINVAL`, so the runtime configs pin each service to a short `/tmp/<service>` directory. The hf-model-server demand path additionally fail-fasts with `ESUNPATHTOOLONG` past 104 bytes and refuses a symlinked or foreign-uid-owned socket directory (`ESOCKETDIRSYMLINK`/`ESOCKETDIRFOREIGN`/`ESOCKETSYMLINK`) before binding or reclaiming. | `.opencode/bin/lib/launcher-ipc-bridge.cjs`, `.opencode/bin/lib/model-server-supervision.cjs`, `shared/ipc/socket-server.ts` |
| `SPECKIT_STOP_HOOK_ORPHAN_SWEEP` | `off` | enum | Stop-hook fallback when no `CLAUDE_SESSION_PID` is available. `off` (default) keeps the historical no-op, `dry-run` logs candidate reaps without mutating, and `1`/`on`/`live` reaps. Delegates only to the orphan-only sweeper for ownerless or reparented MCP processes, never a PPID guess, so it cannot kill a live session. | `.opencode/scripts/session-cleanup.sh`, `.opencode/plugins/session-cleanup.js` |
| `SPECKIT_OPENCODE_HOOK_TIMEOUT_MS` | `3000` | number | Owned by the skill-advisor hub for the OpenCode plugin bridge and advisor subprocesses. On timeout the bridge returns a prompt-safe degraded advisory brief instead of empty output. Set before launching OpenCode. | `.opencode/skills/system-skill-advisor/mcp-server/lib/subprocess.ts`, `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/system-skill-advisor-bridge.mjs` |

---

## 3. SPEC VALIDATION AND GENERATED METADATA

The live half of the package. `lib/validation/orchestrator.ts` runs the rule set, `lib/config/capability-flags.ts` gates the generator behavior, and the `scripts/rules/*.sh` checks are invoked by `scripts/spec/validate.sh`.

| Variable | Default | Type | Description | Source |
|----------|---------|------|-------------|--------|
| `SPECKIT_RULES` | (unset, all rules) | string (comma-separated) | Narrows a validation run to a named subset of rules. Each token is trimmed, upper-cased and hyphens become underscores, then resolved against rule ids and their aliases from the validator registry. **An unrecognised name throws** rather than being ignored, because a narrowed run that silently matches nothing would report a clean pass for a packet nobody checked. Empty or unset runs every rule; the subset is re-read per validation rather than pinned for the process lifetime. | `lib/validation/orchestrator.ts` |
| `SPECKIT_FRONTMATTER_ALLOWLIST` | (bundled `scripts/lib/frontmatter-grandfather-allowlist.json`) | string (path) | Path to the spec-doc frontmatter grandfather allowlist JSON. A path that does not exist makes the allowlist check return false rather than throwing. | `lib/validation/spec-doc-structure.ts`, `scripts/rules/check-frontmatter.sh` |
| `SPECKIT_VERBOSE_RESOLVER` | (unset) | flag (`"1"`) | Exactly `1` appends the underlying cause's stack to the error the documentation-level contract resolver raises when it falls back. Diagnostic only. | `lib/templates/level-contract-resolver.ts`, `scripts/lib/template-utils.sh` |
| `SPECKIT_FOLDER_DISCOVERY_TOKEN_THRESHOLD` | `0.45` | number (0..1) | Per-token similarity threshold for folder-discovery name matching. Non-numeric values, or values outside `[0,1]`, fall back to the default. | `lib/search/folder-discovery.ts` |
| `SPECKIT_GENERATED_METADATA_Z_EXCLUSION` | `true` | boolean | Excludes `z_*` staging and archive folders from the spec-folder discovery scanner. Parsed as a tristate with default `true`; set `false` to restore the prior scanner that descended them. | `lib/search/folder-discovery.ts` |
| `SPECKIT_INDEX_SPEC_DOCS` | `true` | boolean | Exactly the string `false` short-circuits spec-document discovery to an empty result with an empty discovery state. Any other value, including unset, leaves discovery on. | `handlers/memory-index-discovery.ts` |
| `SPECKIT_VALIDATE_SCRIPT` | (bundled `scripts/spec/validate.sh`) | string (path) | Overrides the `validate.sh` path the strict-pass-freshness sweep invokes per folder when re-baselining across multiple spec roots. Unset resolves the committed script next to the sweep tool. | `scripts/sweep/strict-pass-freshness.ts` |
| `SPECKIT_TEMPLATES_BASE` | (bundled templates) | string (path) | Overrides the template root `scripts/spec/create.sh` copies a new packet's documents from. | `scripts/spec/create.sh` |
| `SPECKIT_AC_COVERAGE` | `true` | boolean | Default-on advisory (INFO, non-blocking) acceptance-criteria coverage scan during spec validation. Set `false` to opt out. | `scripts/rules/check-ac-coverage.sh` |
| `SPECKIT_AC_COVERAGE_FLOOR` | `0.9` | number (0..1) | Minimum covered acceptance-criteria ratio for the advisory scan. Values outside `[0,1]` are clamped before the floor is calculated. | `scripts/rules/check-ac-coverage.sh` |
| `SPECKIT_AC_CLOSURE` | `true` | boolean | Default-on closure gate (ERROR) for Levels 2/3/3+. Unmet acceptance criteria block a completion claim and a waiver must cite an ADR that exists in `decision-record.md`. Set `false` to opt out; an unrecognised value leaves the gate enabled. | `scripts/rules/check-ac-closure.sh` |
| `SPECKIT_AC_CLOSURE_CUTOFF` | `2026-08-30` | ISO date | Forward-only rollout boundary. Packets whose `spec.md` `Created` date is on or before it, or cannot be read, stay advisory on every branch. A malformed value falls back to the default. | `scripts/rules/check-ac-closure.sh` |
| `SPECKIT_METADATA_DISK_CONSISTENCY_ENFORCE` | `true` | boolean | Advisory→enforce toggle for the `METADATA_DISK_PATH_CONSISTENCY` rule: a `description.json`/`graph-metadata.json` path mismatch against the folder's actual on-disk path fails `--strict`. Set `false`/`0` to fall back to advisory-only. | `scripts/rules/check-metadata-disk-consistency.sh` |
| `SPECKIT_STATUS_CROSS_DOC_ENFORCE` | `true` | boolean | Advisory→enforce toggle for the `STATUS_CROSS_DOC_CONSISTENCY` rule: a classified-status disagreement between `spec.md` and `implementation-summary.md` fails `--strict`. Set `false`/`0` to fall back to advisory-only. | `scripts/rules/check-status-cross-doc-consistency.sh`, `scripts/lib/status-classifier.sh` |
| `SPECKIT_CHILD_DRIFT_ENFORCE` | `true` | boolean | Advisory→enforce toggle for the `GRAPH_METADATA_CHILD_DRIFT` rule: a phase parent's `graph-metadata.json.children_ids` missing an on-disk phase child fails `--strict`. Enforce mode also fails closed when the child-scanner dependency is unavailable or stale, gated by a dedicated `dist-freshness.cjs` entry scoped to that one file. Set `false`/`0` to fall back to advisory-only. | `scripts/rules/check-graph-metadata-child-drift.sh`, `scripts/lib/dist-freshness.cjs`, `scripts/spec/is-phase-parent.ts` |
| `SPECKIT_COMPLETION_FRESHNESS` | `false` | boolean | Enables the strict-only completion freshness validation rule, which recomputes the packet content fingerprint and compares it with stored continuity metadata. Unset preserves existing validation output. | `scripts/validation/continuity-freshness.ts` |
| `SPECKIT_COMPLETION_FRESHNESS_ENFORCE` | `false` | boolean | When completion freshness is enabled, promotes stale freshness findings from warning to error. | `scripts/validation/continuity-freshness.ts` |
| `SPECKIT_IDENTITY_MERGE_SAFETY` | `true` | boolean | Shared spec-folder identity resolver and lineage-merge guard. Both generators resolve a specs-root-relative identity and the merge preserves a non-null parent and unions children, so a scoped or null-deriving re-derive cannot erase lineage. Set `false`/`0`/`off` to restore the legacy caller-base path and spread merge. | `lib/config/capability-flags.ts`, `lib/graph/graph-metadata-parser.ts`, `scripts/spec-folder/generate-description.ts` |
| `SPECKIT_GENERATOR_HARDENING` | `true` | boolean | Persists the graph-metadata `source_fingerprint`, routes phase-parent classification and the derived children list through one `listPhaseChildren` enumeration, and moves access/freshness telemetry to the index-layer store so a read or resume no longer dirties the generated JSON. | `lib/config/capability-flags.ts`, `lib/graph/graph-metadata-parser.ts`, `lib/spec/is-phase-parent.ts`, `lib/graph/access-telemetry.ts`, `lib/resume/resume-ladder.ts`, `lib/validation/generated-metadata-integrity.ts` |
| `SPECKIT_GENERATED_METADATA_GRANDFATHER` | `false` | boolean | Grandfather report mode for the `GENERATED_METADATA_INTEGRITY` rule. Default off and enforcing: a violation, including a missing or mismatched `source_fingerprint`, is a hard strict error. Set `true`/`1` to restore the non-blocking report mode for a tree that has not been restamped. | `lib/config/capability-flags.ts`, `lib/validation/generated-metadata-integrity.ts` |
| `SPECKIT_STATUS_COMPLETION_CONSISTENCY_GATE` | `false` | boolean | Cross-checks a stored `derived.status: complete` against `completion_pct` and open `tasks.md` items, inside the `GENERATED_METADATA_INTEGRITY` rule. Default off and in report mode, the inverse polarity of the grandfather flag above: a disagreement surfaces in `--strict` output without failing the run. Set `true`/`1` to enforce. | `lib/config/capability-flags.ts`, `lib/validation/generated-metadata-integrity.ts` |
| `SPECKIT_GENERATED_METADATA_DRIFT_GATE` | `true` | boolean | Synopsis drift gate and shared-extractor routing. When set, both `description` and `causal_summary` derive from the one shared synopsis extractor, `source_doc_hashes` persist as the freshness key, and a drift report fails strict validation. | `lib/config/capability-flags.ts`, `scripts/validation/generated-metadata-drift.ts` |
| `SPECKIT_IDEMPOTENT_DESCRIPTION_WRITES` | `true` | boolean | Content-gated `description.json` and global-cache writes. A per-folder save whose only delta is the volatile stamp is skipped, the aggregate cache write is gated on a real member delta, and the targeted upsert replaces only the changed entry. Set `false`/`0`/`off` to restore the unconditional legacy write. | `lib/config/capability-flags.ts` |

---

## 4. RUNTIME HOOK ADAPTERS

The `hooks/` tree ships thin per-runtime adapters for Claude, Codex, Cursor, Devin and Pi. Most delegate to the skill advisor's compiled hooks; the variables below are the ones those adapters read directly.

| Variable | Default | Type | Description | Source |
|----------|---------|------|-------------|--------|
| `SPECKIT_USER_PROMPT_TARGET` | (unset) | string (path) | Explicit target for the Claude user-prompt-submit shim, overriding the install-anchored ancestor walk. Honored **only when the path exists**; otherwise the hook walks up from its own module location looking for `.opencode/skills/system-skill-advisor/mcp-server/dist/hooks/claude/user-prompt-submit.js`. The walk exists because Claude may invoke the hook from any working directory. | `hooks/claude/user-prompt-submit.ts` |
| `SPECKIT_DIRECTIVE_LIFECYCLE_BOUNDARY_TARGET` | (unset) | string (path) | Same override for the Claude directive-lifecycle-boundary shim, again honored only when the path exists, else the ancestor walk resolves `.opencode/skills/system-skill-advisor/mcp-server/dist/hooks/claude/directive-lifecycle-boundary.js`. | `hooks/claude/directive-lifecycle-boundary.ts` |
| `SPECKIT_AUTHORED_CONTINUITY_SNAPSHOT` | (unset) | flag (`"1"`) | Exactly `1` enables the authored continuity snapshot path in the compact hook. The hook also accepts the same intent per-invocation through its input payload (`authored_continuity_snapshot: true` or `continuity_snapshot: "authored"`), so the env var is the process-wide form of a per-call option. Unset leaves the transcript-derived fallback in place. | `hooks/claude/compact-inject.ts` |

### Spec Gate (Gate-3)

Runtime-neutral Gate-3 policy envs read by `hooks/lib/spec-gate/spec-gate-core.mjs` and the OpenCode `system-spec-gate.js` plugin. Full API: [`hooks/lib/spec-gate/README.md`](hooks/lib/spec-gate/README.md).

| Variable | Default | Type | Description | Source |
|----------|---------|------|-------------|--------|
| `SYSTEM_SPEC_GATE_ENFORCE` | (unset) | flag (`"0"`/`"1"`) | Opt-in deny mode. Unset, `evaluateMutation` returns `advise` for a mutation lacking a resolved spec folder; set to an enabled value to promote that to `deny`. Set `0` to force advise even where a wrapper would otherwise enforce. | `hooks/lib/spec-gate/spec-gate-core.mjs` |
| `SYSTEM_SPEC_GATE_DISABLED` | (unset) | flag | When set, the gate is a complete fail-open no-op: no question, no denial, no state writes. | `hooks/lib/spec-gate/spec-gate-core.mjs` |
| `SYSTEM_SPEC_GATE_3_DELIVERY_SUPPRESSION` | (unset) | flag (opt-in) | **Default OFF (shadow).** Opt-in suppression of a repeated Gate-3 question once its prior delivery is confirmed. Confirmable only by an observed receipt whose `lifecycleEpoch >= 1` matches the question hash — epoch 0 never confirms; unknown or unobserved state always emits (fail-open). | `hooks/lib/spec-gate/spec-gate-core.mjs` (`GATE_3_DELIVERY_SUPPRESSION_ENV`) |
| `AI_SESSION_CHILD` | (unset) | flag (`"1"`) | When `1`, marks a dispatched sub-session with no user turn; `isChildSession` short-circuits both Gate-3 entrypoints to a complete no-op before any state read or write. Pair with `SYSTEM_SPEC_GATE_ENFORCE=0` when dispatching a child that must not inherit an enforced gate. | `hooks/lib/spec-gate/spec-gate-core.mjs`, `plugins/system-spec-gate.js` |

Retention, sweep, and warning-log tuning (`SYSTEM_SPEC_GATE_ACTIVE_RETENTION_DAYS`, `SYSTEM_SPEC_GATE_ARCHIVE_RETENTION_DAYS`, `SYSTEM_SPEC_GATE_SWEEP_INTERVAL_MS`, `SYSTEM_SPEC_GATE_WARNING_LOG_MAX_BYTES`) are read by the same core; see its source for defaults.

---

## 5. GIT-HOOK MARKER

| Variable | Default | Type | Description | Source |
|----------|---------|------|-------------|--------|

---

## 6. EMBEDDING

**This whole section is shared, not this package's.** Its readers are `.opencode/skills/system-spec-kit/shared/embeddings/**` and the launcher libraries under `.opencode/bin`, and the skill advisor is now the consumer that keeps them live. Nothing in `runtime/` reads any of it. In the Source column below, a `bin/...` path is relative to `.opencode/`, and a `shared/...` path is relative to `.opencode/skills/system-spec-kit/`.

Embedding provider selection stays auto-cascaded unless you force it. In `EMBEDDINGS_PROVIDER=auto`, the runtime probes this **local-first** sequence (ADR-014, 2026-05-19). (1) Ollama, local default `nomic-embed-text-v1.5` (768d). (2) hf-local, default `nomic-ai/nomic-embed-text-v1.5` (768d, same family as the Ollama default). (3) OpenAI, `OPENAI_API_KEY` set, `text-embedding-3-small` (1536d). (4) Voyage, `VOYAGE_API_KEY` set, `voyage-code-3` (1024d). Unlisted local overrides set through `OLLAMA_EMBEDDINGS_MODEL` or `HF_EMBEDDINGS_MODEL` are accepted at runtime and derive their dimension from the first embedding vector.

For the simplest local-first new-user setup, install [Ollama](https://ollama.com) and `ollama pull nomic-embed-text:v1.5`, and the cascade auto-selects it with no API keys.

**Ownership.** Mirroring the markers in `.env.example`: every provider-selection row
(`EMBEDDINGS_PROVIDER`, `OLLAMA_EMBEDDINGS_MODEL`, `HF_EMBEDDINGS_MODEL`, `HF_EMBEDDINGS_DTYPE`,
`HF_EMBEDDINGS_PREFIX_*`, `EMBEDDING_DIM`, `OPENAI_API_KEY`, `VOYAGE_API_KEY`), the circuit-breaker
trio, every `HF_EMBED_SERVER_*` / `SPECKIT_HF_MODEL_SERVER_*` row, `SPECKIT_HF_READY_LATCH_TTL_MS`,
`SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED` and the cascade-probe rows are **shared: owned by the
HF model server and the skill advisor** — they are read from `shared/embeddings/**` or the launcher
libraries, both of which the advisor consumes. The memory-only rows that sat beside them — the
`SPECKIT_RETRY_*` loop, the embedding-cache caps, the embed-client batch sizes and the live-model
test switch — went out with the memory engine that read them.

| Variable | Default | Type | Description | Source |
|----------|---------|------|-------------|--------|
| `SPECKIT_EMBEDDING_CIRCUIT_BREAKER` | `true` | boolean | Circuit breaker for embedding model failures. Graduated ON. | `shared/embeddings.ts` |
| `SPECKIT_EMBEDDING_CB_THRESHOLD` | `3` | number | Consecutive failure count before circuit breaker opens. | `shared/embeddings.ts` |
| `SPECKIT_EMBEDDING_CB_COOLDOWN_MS` | `60000` | number | Cooldown period in ms before circuit breaker resets (min 1000). | `shared/embeddings.ts` |
| `HF_EMBED_SERVER_URL` | (unset → `/tmp/system-hf-embed/hf-embed.sock`) | string | Overrides the local HF model-server endpoint. Accepts a Unix socket path, `unix://<path>`, or `tcp://<host>:<port>`. Both launchers and the `hf-local` client resolve this first, then `SPECKIT_IPC_SOCKET_DIR`, then the short model-server default `/tmp/system-hf-embed`. That last fallback is owned by the model server rather than by any database directory, so the client reaches the same socket whether or not a database exists; it must stay equal to `DEFAULT_MODEL_SERVER_SOCKET_DIR` in `.opencode/bin/lib/model-server-supervision.cjs`. Leave unset so every client reaches the one resident server. | `bin/hf-model-server.cjs`, `shared/embeddings/providers/hf-local.ts` |
| `HF_EMBED_SERVER_READY_TIMEOUT_MS` | `45000` | number | Initial readiness budget while the `hf-local` client waits for a reachable model server. Once `/api/health` reports `state: "loading"`, the client keeps retrying under `SPECKIT_HF_MODEL_SERVER_LOADING_MAX_MS` instead of failing at 45 s. | `shared/embeddings/providers/hf-local.ts` |
| `SPECKIT_HF_MODEL_SERVER_MAX_RSS_MB` | (unset → disabled) | number | RSS ceiling (MB) for the launcher-supervised model-server process tree. Unset disables the watchdog. | `bin/lib/model-server-supervision.cjs` |
| `SPECKIT_HF_MODEL_SERVER_RSS_SELF_EXIT` | (unset → off) | string | Set `1` (with `SPECKIT_HF_MODEL_SERVER_MAX_RSS_MB`) to recycle the model server via graceful self-exit on an RSS breach. | `bin/lib/model-server-supervision.cjs` |
| `SPECKIT_HF_MODEL_SERVER_LOADING_MAX_MS` | `150000` | number | Maximum age, in milliseconds, for one model-server load attempt before launcher probes classify `loading` as wedged/dead. The `hf-local` client also uses this as its post-health `loading` retry cap, so first-embed downloads can outlive the 45 s initial readiness budget while still being bounded. Device fallback re-stamps the per-attempt marker. Missing or invalid loading markers remain backward-compatible and are treated as alive while loading. | `bin/lib/launcher-ipc-bridge.cjs`, `bin/hf-model-server.cjs`, `shared/embeddings/providers/hf-local.ts` |
| `SPECKIT_HF_MODEL_SERVER_GIVEUP_COOLDOWN_MS` | `60000` | number | Cooldown written after launcher-supervised hf-model-server crash-loop give-up. During the cooldown, demand requests return `503` with `reason: "crash-loop-cooldown"` instead of spawning again. | `bin/lib/model-server-supervision.cjs` |
| `SPECKIT_HF_MODEL_SERVER_IDLE_TIMEOUT_MIN` | `0` (off) | number | When `>0`, the launcher evicts an idle resident hf-model-server after this many minutes of no successful embed (gated on `lastSuccessfulEmbedAt`, fractional values allowed). Eviction is fail-safe (it never reaps a server with in-flight inference or one that has never embedded), and lazy re-arm is preserved, so the next embed demand re-spawns it. Default `0` keeps the resident warm. | `bin/lib/model-server-supervision.cjs` |
| `EMBEDDING_DIM` | _(derived)_ | number | Explicit embedding-dimension override. When unset or invalid, the dimension is derived from the active embedder profile (and, for unlisted local models, from the first embedding vector). | `shared/embeddings/profile.ts`, `shared/embeddings/factory.ts` |
| `HF_EMBEDDINGS_PREFIX_QUERY` | _(registry)_ | string | Overrides the query prefix for the local HF embedder, for any model. Default derives from the model prefix registry (e.g. nomic uses `search_query:`). | `shared/embeddings/providers/hf-local.ts` |
| `HF_EMBEDDINGS_PREFIX_DOC` | _(registry)_ | string | Overrides the document prefix for the local HF embedder, for any model. Default derives from the model prefix registry (e.g. nomic uses `search_document:`). | `shared/embeddings/providers/hf-local.ts` |
| `SPECKIT_HF_READY_LATCH_TTL_MS` | `30000` (max `120000`) | number | How long a successful `waitForReady()` is trusted before the next embed re-probes `/api/health`. Within the TTL the client skips the readiness GET and POSTs directly. The latch is invalidated immediately on a mid-request reap (`ECONNRESET`/`EPIPE`). A stale latch costs at most one failed POST recovered by the bounded embed retry. | `shared/embeddings/providers/hf-local.ts` |
| `SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED` | (unset → on) | string (`"1"` or `"0"`) | Whether the **skill-advisor** launcher arms the shared model-server spawn. Unset arms it, because since the memory decommission this launcher is the only surface that can start the model server. The spawn is lazy: the launcher binds a demand listener and the model process starts on the first embed request, or attaches to a resident that already listens. `0` (or any value other than `1`) turns the spawner off; embedding then relies on the other providers, Ollama first, since hf-local is the local fallback behind Ollama in auto mode. An explicit `1` also makes a missing supervision library fatal; the default logs and degrades instead. | `.opencode/bin/system-skill-advisor-launcher.cjs` |

### Local HF model server (single resident model)

When the cascade selects `hf-local`, embeddings are served by a **launcher-supervised local HTTP model server** (`.opencode/bin/hf-model-server.cjs`) over a Unix socket at `<SPECKIT_IPC_SOCKET_DIR>/hf-embed.sock`, falling back to the model server's own short default `/tmp/system-hf-embed/hf-embed.sock` rather than to a database directory, with no in-process model load and no sidecar. The server itself, its socket and its supervision library survived the memory decommission untouched.

**What changed is who starts it.** The spec-memory launcher used to spawn it lazily on first embed demand, with skill-advisor as the fallback winner of the socket-keyed lock. That launcher is gone, so the skill-advisor launcher is the only remaining spawner and it arms the spawn by default. `SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED=0` is the kill switch; with it set there is no spawner at all.

**Single-resident-model contract.** The server loads exactly **one** model (`HF_EMBEDDINGS_MODEL`, default `nomic-ai/nomic-embed-text-v1.5`). A request for any other model returns **HTTP 404** (`{error, model, loadedModel}`). The `hf-local` provider treats that as "model not loaded" and reports the requested model beside the server's loaded model. To run a different local HF model, change `HF_EMBEDDINGS_MODEL` for **all** consumers, and do not expect per-request model switching.

**First-embed download.** On a cold machine, the first hf-local embed downloads the model artifacts to `~/.cache/huggingface/hub`. Expect roughly hundreds of MB of cache growth (about 250-600 MB depending on dtype/artifacts) and a 15-120 s first request on a typical connection. The client keeps retrying while health reports `loading` until `SPECKIT_HF_MODEL_SERVER_LOADING_MAX_MS` (default 150 s).

**Troubleshooting, model-server health states:**

| State | Symptom | Operator action |
|-------|---------|-----------------|
| Not started | `hf-local` health probe connect-refused, no `hf-embed.sock` | Normal before first demand. If it persists, confirm `SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED` is not set to `0` (the advisor launcher arms the spawn by default and is the only spawner since the memory decommission), then check the advisor launcher's stderr for `demand listener` errors or a `spawn skipped` line. |
| Loading | Health returns `503 loading`, first embed slow | Expected cold model load or first-embed download. Cache path: `~/.cache/huggingface/hub`. Size: roughly hundreds of MB. Expected wait: 15-120 s. The client retries past `HF_EMBED_SERVER_READY_TIMEOUT_MS` while this state is progressing and fails only at `SPECKIT_HF_MODEL_SERVER_LOADING_MAX_MS` (default 150 s). |
| Crash-looped | Repeated `hf-model-server child exited … relaunching`, eventually `crash loop detected … daemon remains running` | Inspect the model-server stderr (bad `HF_EMBEDDINGS_DTYPE`/`HF_EMBEDDINGS_MODEL`, OOM). After give-up, the launcher re-arms a demand listener, then fix the cause and trigger a new embed. |
| RSS recycle | `process tree RSS … exceeds …` then graceful self-exit | Only with `SPECKIT_HF_MODEL_SERVER_MAX_RSS_MB` + `_RSS_SELF_EXIT=1`. Raise the ceiling or disable if the model legitimately needs more RAM. |
| Model mismatch | Embeds fail with `HF local model is not loaded: requested …; server loaded …` (404) | A consumer requested a model the resident server isn't running. Align `HF_EMBEDDINGS_MODEL` across services, or let the cascade fall back. |

### RSS watchdog (shared supervisor)

`getWatchdogConfig()` in `.opencode/bin/lib/model-server-supervision.cjs` resolves one watchdog from two name sets. `getModelServerWatchdogConfig()` overrides only the ceiling and self-exit names with the `SPECKIT_HF_MODEL_SERVER_*` pair documented above; the generic names below are what a caller that passes no overrides gets, and the timing trio is shared by both paths. The watchdog arms only when a finite positive ceiling **and** the matching self-exit variable set to exactly `1` are both present; a ceiling without the self-exit logs that breach self-exit stays disabled while descendant tracking continues for crash-loop reaping.

| Variable | Default | Type | Description | Source |
|----------|---------|------|-------------|--------|
| `SPECKIT_CONTEXT_SERVER_MAX_RSS_MB` | (unset → disabled) | number | Generic RSS ceiling, in MB, for a supervised process tree. Parsed with `parseFloat`; unset, blank or non-finite disables the watchdog. | `.opencode/bin/lib/model-server-supervision.cjs` |
| `SPECKIT_LAUNCHER_RSS_SELF_EXIT` | (unset → off) | string (`"1"`) | Generic self-exit arm for the RSS watchdog, compared to exactly `1`. Pairs with the ceiling above the way `SPECKIT_HF_MODEL_SERVER_RSS_SELF_EXIT` pairs with `SPECKIT_HF_MODEL_SERVER_MAX_RSS_MB`. | `.opencode/bin/lib/model-server-supervision.cjs` |
| `SPECKIT_LAUNCHER_RSS_WATCHDOG_INTERVAL_MS` | (internal default) | number (positive int) | Poll interval while the watchdog is armed. Only applies when armed; otherwise the descendant-snapshot interval is used. Invalid values fall back to the default. | `.opencode/bin/lib/model-server-supervision.cjs` |
| `SPECKIT_LAUNCHER_RSS_CONSECUTIVE_BREACHES` | (internal default) | number (positive int) | How many consecutive ceiling breaches must be observed before the watchdog acts. Invalid values fall back to the default. | `.opencode/bin/lib/model-server-supervision.cjs` |
| `SPECKIT_LAUNCHER_RSS_GRACE_MS` | (internal default) | number (positive int) | Grace period before a breached process is escalated. A value at or below the shutdown deadline is rejected with a warning naming the variable, and the default is used instead. | `.opencode/bin/lib/model-server-supervision.cjs` |

---

## 7. SHARED RANKING ALGORITHMS

Not this package's: `.opencode/skills/system-spec-kit/shared/algorithms/` still ships the RRF fusion and adaptive-fusion primitives, and `scripts/retrieval/lib/legacy-lane.mjs` still runs a legacy retrieval lane. The memory pipeline that called them is gone, but these modules and their env reads survive for other consumers.

| Variable | Default | Type | Description | Source |
|----------|---------|------|-------------|--------|
| `SPECKIT_RRF` | `true` | boolean | Master switch for Reciprocal Rank Fusion, read as `!== 'false'`. | `shared/algorithms/rrf-fusion.ts` |
| `SPECKIT_RRF_K` | `40` | number | RRF smoothing constant `k`. Lower is more top-heavy, higher is flatter; must be greater than 0. | `shared/algorithms/rrf-fusion.ts` |
| `SPECKIT_SCORE_NORMALIZATION` | `true` | boolean | Composite score normalization, read as `!== 'false'`. | `shared/algorithms/rrf-fusion.ts` |
| `SPECKIT_CALIBRATED_OVERLAP_BONUS` | `true` | boolean | Multi-channel overlap bonus. Read directly off `process.env` in the fusion module, lower-cased and trimmed, rather than through a flag registry. | `shared/algorithms/rrf-fusion.ts` |
| `SPECKIT_ADAPTIVE_FUSION` | `true` | boolean | Feature-flag name registered by `adaptive-fusion.ts` for intent-aware fusion with document-type weight shifting. | `shared/algorithms/adaptive-fusion.ts` |
| `SPECKIT_DOC_TYPE_WEIGHT_FACTOR` | `1.2` | number | Proportional weight-shift factor per document type in adaptive fusion, parsed with `parseFloat` and falling back to `1.2` on an unparseable or zero value. | `shared/algorithms/adaptive-fusion.ts` |
| `SPECKIT_INCLUDE_ARCHIVED_DEFAULT` | `true` | boolean | Admits cold and archived rows to the legacy retrieval lane. The lane ORs this with its own `includeArchived` argument, so an explicit request-level `true` wins regardless. | `scripts/retrieval/lib/legacy-lane.mjs` |

---

## 8. DEPRECATED

Names that appear in old configs and in source comments, but that no code branches on.

| Variable | Status | Replacement | Notes | Source |
|----------|--------|-------------|-------|--------|
| `SPECKIT_EAGER_WARMUP` | **Deprecated (inert)** | (none) | The embedder loads lazily and only lazily. Both this and `SPECKIT_LAZY_LOADING` are named inert in the comment at line 378; no branch reads either. | `shared/embeddings.ts` |
| `SPECKIT_LAZY_LOADING` | **Deprecated (inert)** | (none) | Historical alias for the inverse of the flag above. Also inert. | `shared/embeddings.ts` |

---

## SKILL ADVISOR

Skill-advisor threshold and calibration overrides for tuning the 5-lane scorer and prompt-policy engine at runtime without code changes.

**Owned by the skill advisor, not by this package.** Every `mcp-server/...` path in the Source column below is relative to `.opencode/skills/system-skill-advisor/`, never to the `system-spec-kit/runtime/` directory this document sits in. None of these variables is read by any file in this package.

| Variable | Default | Type | Description | Source |
|----------|---------|------|-------------|--------|
| `SPECKIT_ADVISOR_CONFIDENCE_THRESHOLD` | `0.8` | number (0..1) | Override the confidence threshold used by the 5-lane fusion scorer. Below this value, a recommendation is filtered out unless `confidenceOnly` mode is active. Parsed as a float. Values outside [0,1] fall back to the default. | `mcp-server/lib/compat/contract.ts` |
| `SPECKIT_ADVISOR_UNCERTAINTY_THRESHOLD` | `0.35` | number (0..1) | Override the uncertainty ceiling used by the 5-lane fusion scorer. Above this value, a recommendation is filtered out. Parsed as a float. Values outside [0,1] fall back to the default. | `mcp-server/lib/compat/contract.ts` |
| `SPECKIT_ADVISOR_CALIBRATION_OVERRIDE_JSON` | (none) | JSON string | Partial override for routing calibration bonuses. Accepts a JSON object with optional keys `memorySaveBonus`, `createAgentBonus`, `testingPlaybookBonus` (all number). Merged with SCORING_CALIBRATION defaults. Parse failures log a warning and fall back. | `mcp-server/lib/scorer/scoring-constants.ts` |
| `SPECKIT_ADVISOR_PROMPT_POLICY_PATH` | (bundled default) | string | Override path to the JSON file containing prompt-policy linguistic sets (EXACT_SKIP_COMMANDS, CASUAL_ACKNOWLEDGEMENTS, WORK_INTENT_VERBS, STOP_WORDS, GOVERNANCE_MARKERS) and fire-threshold constants. When unset, the bundled `data/prompt-policy.default.json` is used. | `mcp-server/lib/prompt-policy.ts` |
| `SPECKIT_ADVISOR_PROMPT_POLICY_MIN_VISIBLE_CHARS` | `15` | number | Minimum visible character count for the short-casual-acknowledgement skip path in prompt-policy. | `mcp-server/lib/prompt-policy.ts` |
| `SPECKIT_ADVISOR_PROMPT_POLICY_MEANINGFUL_TOKEN_FLOOR` | `3` | number | Minimum meaningful token count required by the work-intent-with-meaningful-tokens fire rule. | `mcp-server/lib/prompt-policy.ts` |
| `SPECKIT_ADVISOR_PROMPT_POLICY_LENGTH_AND_TOKEN_VISIBLE_CHARS` | `20` | number | The visible-character threshold for the length-and-token-threshold fire rule. | `mcp-server/lib/prompt-policy.ts` |
| `SPECKIT_ADVISOR_PROMPT_POLICY_LENGTH_AND_TOKEN_MEANINGFUL_FLOOR` | `4` | number | The meaningful-token threshold for the length-and-token-threshold fire rule. | `mcp-server/lib/prompt-policy.ts` |
| `SPECKIT_ADVISOR_PROMPT_POLICY_LONG_NON_CASUAL_CHARS` | `50` | number | The visible-character threshold for the long-non-casual-prompt fire rule. | `mcp-server/lib/prompt-policy.ts` |
| `SPECKIT_ADVISOR_LANE_WEIGHTS_JSON` | `{"explicit_author":0.42,"lexical":0.28,"graph_causal":0.13,"derived_generated":0.12,"semantic_shadow":0.05}` | JSON string (partial merge) | Override live-lane weights for the 5-lane fusion scorer. JSON object with any subset of `explicit_author`, `lexical`, `graph_causal`, `derived_generated`, `semantic_shadow` (all numbers in `[0, 1]`). Missing keys retain defaults. Invalid JSON, non-object values, out-of-range numbers, and unknown lane ids fall back to defaults. | `mcp-server/lib/scorer/lane-registry.ts` |
| `SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON` | `{"explicit_author":0.40,"lexical":0.25,"graph_causal":0.20,"derived_generated":0.10,"semantic_shadow":0.05}` | JSON string (partial merge) | Override shadow-mode lane weights for the 5-lane fusion scorer's `weightedScore` calculation in `advisor-recommend.ts`. Same shape, merge semantics, and validation rules as `SPECKIT_ADVISOR_LANE_WEIGHTS_JSON`. | `mcp-server/lib/scorer/lane-registry.ts` |
| `SPECKIT_ADVISOR_DOC_TRIGGERS` | unset (off), pinned `true` in the runtime configs (`.claude/mcp.json`, `.codex/config.toml`, `opencode.json`) | boolean (string `"true"`) | Opt-in doc-frontmatter trigger harvest: `skill_graph_scan` indexes reference/asset doc frontmatter into the `skill_docs` table, the watcher tracks harvestable docs, the derived lane scores doc phrases (top-3/skill, tier-weighted, 0.45 cap) and recommendations carry sanitized `matchedDocs` paths. Code default is off, so the daemon runs with the harvest ON only because the runtime configs supply `true`. Flag-off behavior is byte-identical to pre-feature. Must be present in the launcher's `CHILD_ENV_ALLOWLIST` to reach the daemon child (it is). Daemon adoption of a flip requires a fresh session after all advisor-attached sessions end. | `mcp-server/lib/skill-graph/doc-frontmatter.ts`, `.opencode/bin/system-skill-advisor-launcher.cjs` |
| `SPECKIT_ADVISOR_WORKSPACE_ALLOWLIST` | unset | string (colon-separated paths) | Extra allowed `workspaceRoot` prefixes beyond the repo root, `os.tmpdir()` and `/tmp`. Each colon-separated entry is canonicalized and added to the bounding allowlist. | `mcp-server/schemas/advisor-tool-schemas.ts` |
| `SPECKIT_ADVISOR_RRF_FUSION` | `false` | boolean (opt-in: `true`/`1`/`yes`/`on`/`enabled`) | Routes the 5-lane advisor scorer through Reciprocal Rank Fusion instead of the legacy weighted blend. Default OFF, so set an enabled value to opt in. | `mcp-server/lib/scorer/fusion.ts` |
| `SPECKIT_METRICS_ENABLED` | unset (OFF) | boolean (`'true'`) | Enables advisor metrics emission. Default OFF, so the emit path runs only when set to `true`. | `mcp-server/lib/metrics.ts` |
| `SPECKIT_ADVISOR_SHADOW_DELTA_ENABLED` | unset (OFF) | boolean (`1`/`true`) | Enables shadow-delta collection at the default path. Setting `SPECKIT_ADVISOR_SHADOW_DELTA_PATH` alone also enables it. | `mcp-server/lib/shadow/shadow-sink.ts` |
| `SPECKIT_ADVISOR_SHADOW_DELTA_PATH` | unset | string (path, under workspace root) | Override path for the shadow-delta sink. Setting this enables shadow-delta collection on its own. | `mcp-server/lib/shadow/shadow-sink.ts` |
| `SPECKIT_ADVISOR_HOOK_CACHE_HIT_P95_WARN_MS` | `75` | number (ms) | Warn threshold for advisor hook cache-hit p95 latency. | `mcp-server/lib/metrics.ts` |

---

## OPENCODE GOAL PLUGIN

Environment variables consumed by the local `.opencode/plugins/opencode-goal.js` plugin. These are plugin-level controls, not MCP daemon flags. The same plugin owns `/goal history`, `/goal doctor`, `/goal health`, and `/goal resume`; status output includes `remaining_auto_turns`, `remaining_wall_ms`, `provider_retry_after_ms`, and verifier provenance via `verifier_source` alongside the existing budget fields.

| Variable | Default | Type | Description | Source |
|----------|---------|------|-------------|--------|
| `OPENCODE_GOAL_PLUGIN_DISABLED` | unset (enabled) | boolean (`"1"`) | Disables goal injection and goal plugin behavior for the running OpenCode process. Restart OpenCode after changing it. | `.opencode/plugins/opencode-goal.js` |
| `OPENCODE_GOAL_AUTONOMY` | unset (continuation suppressed) | enum (`active`, `smoke`, `passive`, unset) | `active` enables guarded continuation, `smoke` logs would-fire decisions without sending a prompt, `passive` explicitly suppresses continuation, and unset is treated as disabled. | `.opencode/plugins/opencode-goal.js` |
| `OPENCODE_GOAL_DEBUG` | unset (off) | boolean (`"1"`) | Writes bounded debug events into `.opencode/skills/.state/goal/.goal-events.log`. | `.opencode/plugins/opencode-goal.js` |
| `OPENCODE_GOAL_VERIFIER` | `heuristic` | enum (`heuristic`, `llm`) | Selects the production default completion verifier when no injected `supervisorVerifier` is provided. `heuristic` is deterministic and fail-closed; `llm` opts into `ctx.client.session.promptAsync` semantic verdicts. Invalid values fall back to `heuristic`. | `.opencode/plugins/opencode-goal.js` |
| `OPENCODE_GOAL_MAX_OBJECTIVE_CHARS` | `4000` | number (positive int) | Maximum stored raw objective length. | `.opencode/plugins/opencode-goal.js` |
| `OPENCODE_GOAL_MAX_GOAL_PROMPT_CHARS` | `4000` | number (positive int, clamped to 4000) | Maximum generated `goalPrompt` length. | `.opencode/plugins/opencode-goal.js` |
| `OPENCODE_GOAL_MAX_INJECTION_CHARS` | `4800` | number (positive int) | Maximum `[active_goal]` system-injection block length. | `.opencode/plugins/opencode-goal.js` |
| `OPENCODE_GOAL_MAX_EVIDENCE_CHARS` | `1200` | number (positive int) | Maximum verifier evidence retained in goal state. | `.opencode/plugins/opencode-goal.js` |
| `OPENCODE_GOAL_MAX_AUTO_TURNS` | `8` | number (positive int) | Maximum guarded auto-continuation turns for new and normalized goal state; `/goal show` reports `remaining_auto_turns`. | `.opencode/plugins/opencode-goal.js` |
| `OPENCODE_GOAL_MAX_WALL_MS` | `1800000` | number (positive int, ms) | Maximum guarded auto-continuation wall-clock duration; `/goal show` reports `remaining_wall_ms`. | `.opencode/plugins/opencode-goal.js` |
| `OPENCODE_GOAL_STATE_ARCHIVE_RETENTION_DAYS` | `90` | number (positive int, days) | Retention window before an archived goal-state file is pruned. | `.opencode/plugins/opencode-goal.js` |
| `OPENCODE_GOAL_STATE_ACTIVE_RETENTION_DAYS` | `2` | number (positive int, days) | Age threshold before an orphaned active-state file is swept and archived. | `.opencode/plugins/opencode-goal.js` |
| `OPENCODE_GOAL_STATE_SWEEP_INTERVAL_MS` | `3600000` (1 hour) | number (positive int, ms) | Minimum interval between orphaned-active-state sweep passes. | `.opencode/plugins/opencode-goal.js` |

Detailed operator guidance lives in `.opencode/hooks/goal/goal-plugin.md`.

---

## CLI FRONT DOOR

The spec-memory CLI (`mcp-server/spec-memory-cli.ts`) and its `.opencode/bin/spec-memory.cjs` shim were removed with the memory engine, taking `SPECKIT_SPEC_MEMORY_CLI_WARM_ONLY`, `SPECKIT_SPEC_MEMORY_CLI_PROMPT_TIME`, `SPECKIT_SPEC_MEMORY_CLI_DEV_ALLOW_STALE` and the `--session-id` flag with them. What is left is the skill-advisor CLI, which is not this package's.

Warm-only and prompt-time flags accept `1`, `true`, `yes` or `on`. When any of them is set, the CLI defaults to `--warm-only`: it probes the daemon socket and exits `75` instead of cold-spawning the launcher, which is the contract prompt-time hooks rely on. `--no-warm-only` on the command line overrides the env default. Without warm-only, a cold daemon is auto-spawned through the matching launcher.

| Variable | Default | Type | Description | Source |
|----------|---------|------|-------------|--------|
| `SYSTEM_SKILL_ADVISOR_CLI_WARM_ONLY` | unset (off) | flag | Default the skill-advisor CLI to warm-only. Alias: `SPECKIT_SKILL_ADVISOR_CLI_WARM_ONLY`. | `.opencode/skills/system-skill-advisor/mcp-server/skill-advisor-cli.ts` |
| `SYSTEM_SKILL_ADVISOR_CLI_PROMPT_TIME` | unset (off) | flag | Marks the skill-advisor CLI invocation as prompt-time, which implies warm-only. Alias: `SPECKIT_SKILL_ADVISOR_CLI_PROMPT_TIME`. | `.opencode/skills/system-skill-advisor/mcp-server/skill-advisor-cli.ts` |
| `SPECKIT_CLI_PROMPT_TIME` | unset (off) | flag | Cross-CLI prompt-time marker, which implies warm-only. | `.opencode/skills/system-skill-advisor/mcp-server/skill-advisor-cli.ts` |
| `OPENCODE_PROMPT_TIME` / `CLAUDE_CODE_PROMPT_TIME` | unset (off) | flag | Runtime-set prompt-time markers. Either implies warm-only, so a hook environment can flag prompt time once for the whole stack. | `.opencode/skills/system-skill-advisor/mcp-server/skill-advisor-cli.ts` |
| `SYSTEM_SKILL_ADVISOR_CLI_DEV_ALLOW_STALE` | unset (off) | boolean (`"1"`) | Dev override for the skill-advisor shim's dist-freshness guard (skips the exit-`69` stale check). Alias: `SPECKIT_SKILL_ADVISOR_CLI_DEV_ALLOW_STALE`. | `.opencode/bin/skill-advisor.cjs` |
| `SYSTEM_SKILL_ADVISOR_CLI_TRUSTED` | unset (untrusted) | boolean (`"1"`) | Send skill-advisor CLI calls as trusted (equivalent to `--trusted`), required for the mutation tools `advisor_rebuild`, `skill_graph_scan` and apply-mode `skill_graph_propagate_enhances`. Alias: `SPECKIT_SKILL_ADVISOR_CLI_TRUSTED`. | `.opencode/skills/system-skill-advisor/mcp-server/skill-advisor-cli.ts` |
| `SYSTEM_SKILL_ADVISOR_TRUST_DEFAULT` | unset (fail-closed untrusted) | string (`"trusted"`) | **Daemon-side** trust default. The advisor daemon fails closed (untrusted) when a caller's transport `_meta` is absent. Setting `trusted` in the daemon's own environment restores default-trusted behavior for native MCP surfaces whose clients send no `_meta`. Set in the committed MCP registrations, and callers cannot forge it. | `.opencode/skills/system-skill-advisor/mcp-server/advisor-server.ts` |

---

## EMBEDDER CASCADE PROBE

Cascade-probe timing overrides for the embedder auto-selection cascade. Defaults are the empirically tuned values from the 015 cascade-reorder packet. Operators can tune timeout / lock-staleness / sleep without code changes via env vars (022/009).

| Variable | Default | Type | Description | Source |
|----------|---------|------|-------------|--------|
| `SPECKIT_CASCADE_PROBE_TIMEOUT_MS` | `2500` | number (ms) | Per-provider HTTP probe timeout for the auto-select cascade (Voyage, OpenAI, Ollama tags endpoint). Falls back to default when env unset / non-numeric / non-positive. | `shared/embeddings/auto-select.ts` |
| `SPECKIT_CASCADE_LOCK_STALE_MS` | `30000` | number (ms) | Lock staleness threshold for the cross-process auto-select advisory lock. Locks older than this are reclaimed. Falls back to default when env unset / non-numeric / non-positive. | `shared/embeddings/auto-select.ts` |
| `SPECKIT_CASCADE_SLEEP_MS` | `25` | number (ms) | Polling sleep interval while waiting for the auto-select lock to release. Falls back to default when env unset / non-numeric / non-positive. | `shared/embeddings/auto-select.ts` |

---

## DEEP-LOOP RUNTIME

Runtime overrides for the shared deep-loop fan-out merge, read by the deep-loop runtime scripts and never by this package.

| Variable | Default | Type | Description | Source |
|----------|---------|------|-------------|--------|
| `SPECKIT_FANOUT_NEAR_DUP_DEDUP` | `false` | boolean (opt-in `1`/`true`/`yes`/`on`) | Near-duplicate finding collapse in the fan-out merge. Default OFF keeps exact-id bucketing only. Set an enabled value to also collapse near-duplicate findings by content key. | `.opencode/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs` |

---

## DEEP-LOOP GUARD PLUGIN

Detection and enforcement for Task-tool dispatches to deep-loop sub-agents (Deep Route mode mismatch, loop-like repeated orchestrate hand-offs), plus its own state-directory cleanup.

| Variable | Default | Type | Description | Source |
|----------|---------|------|-------------|--------|
| `SYSTEM_DEEP_LOOP_GUARD_REJECT` | unset (warn-only) | boolean (`1` to enable) | Hard-blocks a dispatch on a Deep Route mode mismatch instead of warning. | `.opencode/plugins/system-deep-loop-guard.js` |
| `SYSTEM_DEEP_LOOP_GUARD_REJECT_LOOP` | unset (warn-only) | boolean (`1` to enable) | Hard-blocks the 3rd+ non-command-driven repeated hand-off to the same loop executor instead of warning. | `.opencode/plugins/system-deep-loop-guard.js` |
| `SYSTEM_DEEP_LOOP_GUARD_ACTIVE_RETENTION_DAYS` | `2` | number (positive int, days) | Age threshold before an untouched per-session loop-guard state file is swept and archived. | `.opencode/plugins/system-deep-loop-guard.js` |
| `SYSTEM_DEEP_LOOP_GUARD_ARCHIVE_RETENTION_DAYS` | `90` | number (positive int, days) | Retention window before an archived loop-guard state file (or a dormant `guard-warnings.log`) is pruned. | `.opencode/plugins/system-deep-loop-guard.js` |
| `SYSTEM_DEEP_LOOP_GUARD_SWEEP_INTERVAL_MS` | `3600000` (1 hour) | number (positive int, ms) | Minimum interval between orphaned-loop-guard-state sweep passes, triggered on `session.created`. | `.opencode/plugins/system-deep-loop-guard.js` |

---

## 9. QUICK START EXAMPLES

Every example below drives a variable with a live reader. The retrieval registry in Section 1 is deliberately absent: setting one of those changes nothing.

### Narrow a validation run

```bash
# Run only two rules by id; an unknown name fails the run rather than matching nothing
SPECKIT_RULES=GENERATED_METADATA_INTEGRITY,STATUS_CROSS_DOC_CONSISTENCY \
  bash scripts/spec/validate.sh specs/<track>/<packet> --strict
```

### Relax an enforcing validation gate

```bash
# Fall back to advisory-only for one run
export SPECKIT_METADATA_DISK_CONSISTENCY_ENFORCE=false
export SPECKIT_STATUS_CROSS_DOC_ENFORCE=false
export SPECKIT_CHILD_DRIFT_ENFORCE=false

# Report instead of failing on a tree that has not been restamped
export SPECKIT_GENERATED_METADATA_GRANDFATHER=true
```

### Turn on an opt-in validation check

```bash
# Freshness scan, then promote its stale findings from warning to error
export SPECKIT_COMPLETION_FRESHNESS=true
export SPECKIT_COMPLETION_FRESHNESS_ENFORCE=true
```

### Point the engine at a non-default tree

```bash
# Specs root used when a spec folder is not directly under the working directory
export SPECKIT_SPECS_DIR=/path/to/specs

# Database directory for resolveDatabasePaths(); must be inside cwd, $HOME, or the temp dir
export SPECKIT_DB_DIR=/path/to/db
```

### Bring up local HF embeddings

```bash
# The skill-advisor launcher arms the model-server spawn by default; only set this to opt out
# export SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED=0

# Short socket directory; required on macOS to stay under the 104-char sun_path limit
export SPECKIT_IPC_SOCKET_DIR=/tmp/system-hf-embed
```

### Diagnose a hook or resolver

```bash
# Log the underlying cause when the level-contract resolver falls back
export SPECKIT_VERBOSE_RESOLVER=1

# Disable one hook concern, or all of them
export SYSTEM_SKILL_ADVISOR_DISABLED=1
export SYSTEM_HOOKS_DISABLED=1
```

---

*Generated from source code analysis. Last updated: 2026-09-03, after the memory-engine decommission.*
