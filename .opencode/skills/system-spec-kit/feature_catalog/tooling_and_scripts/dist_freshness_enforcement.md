---
title: "Dist-freshness enforcement"
description: "Shared source-vs-dist staleness detection for local TypeScript build outputs, consumed by the daemon-backed CLI shims, validate.sh's hard backstop, a Claude Code hook, and an OpenCode plugin."
trigger_phrases:
  - "dist freshness enforcement"
  - "dist-freshness.cjs"
  - "checkPackageFreshness"
  - "compiled validation orchestrator is stale"
  - "STALE DIST WARNING"
version: 1.0.0.0
---

# Dist-freshness enforcement

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Dist-freshness enforcement is a shared source-vs-dist staleness check for local TypeScript build outputs: it compares the newest mtime among a package's watched source files against its compiled dist entry and reports whether the dist output is stale, without ever attempting to rebuild it itself.

The check lives in one module, `.opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs`, and is consumed by four independent classes of caller across the repo: the daemon-backed CLI shims, a hard validation backstop, a Claude Code hook, and an OpenCode plugin. Each consumer decides its own response to staleness — some fail closed, some only warn — but every consumer asks the same shared module the same question against the same `DIST_PACKAGES` registry, so there is one place that defines what "stale" means.

## 2. HOW IT WORKS

### Staleness Detection

`checkPackageFreshness(packageId, options)` resolves a package's watched source files (filtered by extension and per-package exclusions such as `tests/`, `node_modules/`, `dist/`), computes a SHA256 content hash over the same watched source files, and checks the per-entry hash cache before falling back to the mtime comparison. If the cached hash matches the recomputed hash, the result is `fresh` even when source mtimes are newer than dist mtimes because the source content is unchanged. If no matching cache exists, the checker compares `newestSourceMtime > distMtime`; stale results still carry the package's `rebuildCommand`. The mcp_server build finalizer now pre-warms the hash cache after a successful build using the checker's own source enumeration, while lazy cache writes after an mtime-fresh check remain as a fallback.

The module tracks exactly 7 dist-producing packages in its `DIST_PACKAGES` registry: `system-spec-kit/shared`, `system-spec-kit/scripts`, `system-spec-kit/mcp_server` (with named `spec-memory-cli` and `validation-orchestrator` sub-entries in addition to its default entry), `mcp-code-mode/mcp_server`, `system-skill-advisor/mcp_server` (with a `skill-advisor-cli` sub-entry), `system-code-graph/mcp_server` (with a `code-index-cli` sub-entry), and `sk-design/design-md-generator/backend`.

### Four Consumer Classes

The module has four independent classes of caller, one of which fans out to three concrete CLI shims:

1. **Daemon-backed CLI shims** (3 shims): `.opencode/bin/spec-memory.cjs`, `.opencode/bin/code-index.cjs`, and `.opencode/bin/skill-advisor.cjs` each call `checkPackageFreshness()` for their own package/entry before dispatching to the daemon. Current shim behavior is not uniform: `spec-memory.cjs` refuses stale or missing dist with exit 75 and documents stale-dist as a non-retryable subcase inside that live retryable contract, while the shared CLI taxonomy still reserves exit 69 for protocol or missing/stale dist in other shims/docs. A per-system development override environment variable (`SPECKIT_SPEC_MEMORY_CLI_DEV_ALLOW_STALE=1`, `SPECKIT_CODE_INDEX_CLI_DEV_ALLOW_STALE=1`, `MK_SKILL_ADVISOR_CLI_DEV_ALLOW_STALE=1`) turns the refusal into pass-through. All three shims were migrated onto this shared module from their own prior inline per-shim freshness-check logic.
2. **`validate.sh`'s compiled-orchestrator backstop**: `run_node_orchestrator()` in `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` calls the module scoped to `system-spec-kit/mcp_server`'s `validation-orchestrator` entry before delegating a validation run to the compiled Node orchestrator. A stale result prints `ERROR: validate.sh compiled validation orchestrator is stale.` plus the rebuild command and exits **3** — a hard, fail-closed backstop with no auto-rebuild.
3. **Claude Code PostToolUse hook**: `.opencode/skills/sk-code/code-quality/scripts/check-dist-staleness.sh` (a Python script despite the `.sh` extension) is wired into `.opencode/skills/sk-code/code-quality/scripts/hooks/claude-posttooluse.sh`, which fires on every `Write`/`Edit`. It calls the module's `check-file` command against the edited file and, if the file falls under a watched source tree and that package is stale, prints a `STALE DIST WARNING: <package> -- run: <rebuild command>` banner. It always exits 0 — warn-only, never blocking the edit.
4. **OpenCode plugin**: `.opencode/plugins/mk-dist-freshness-guard.js` hooks `tool.execute.before` and warns via `console.warn` (never throws) before a Bash call matching `opencode run` or `validate\.sh` when any of the 7 watched packages is stale, and warns once per session on the `session.created` event (deduped by session ID).

### Fail-Closed Vs Warn-Only Asymmetry

The four consumer classes deliberately split into two response tiers. `validate.sh`'s backstop is the one hard, fail-closed consumer (exit 3, no fallback to the possibly-stale compiled orchestrator) because a stale validation orchestrator could silently grade a spec folder with outdated rules. The CLI shims are similarly fail-closed because they are the sole entrypoint to a daemon call and there is no safe degraded path; for `spec-memory.cjs`, stale-dist remains inside exit 75 as a documented non-retryable subcase to preserve prompt-time hook consumers that treat 75 as the daemon-unavailable retry contract. The hook and the plugin are deliberately warn-only (exit 0 / `console.warn`, never blocking) because they observe general editing activity across the whole repo, not a single validation gate — blocking every edit under a watched source tree on staleness would be far too disruptive for routine iterative development.

None of the four consumer classes auto-rebuilds on detecting staleness. This was a deliberate design decision, not an oversight: a `validate.sh` call (or a hook firing on an edit) is frequently running concurrently with other active editing sessions writing into the same shared, gitignored `dist/` output. An automatic rebuild triggered by one session's freshness check risks compiling in another concurrent session's unrelated, uncommitted source changes into that shared dist artifact — contaminating one session's build with another's in-flight edits. This exact failure mode occurred once already in this repository's history, which is why every consumer fails closed or warns instead of rebuilding, and always asks the operator to run the rebuild command explicitly.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `scripts/lib/dist-freshness.cjs` | Shared | `checkPackageFreshness()`, `checkFileFreshness()`, `checkAllFreshness()`, the `DIST_PACKAGES` registry, and the module's own CLI (`check`, `check-file`, `check-all`, `list`) |
| `.opencode/bin/spec-memory.cjs` | Script | `ensureFreshDist` guard calling the shared module for the `spec-memory-cli` entry |
| `.opencode/bin/code-index.cjs` | Script | Same guard for the `code-index-cli` entry |
| `.opencode/bin/skill-advisor.cjs` | Script | Same guard for the `skill-advisor-cli` entry |
| `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` | Script | `run_node_orchestrator()` hard backstop, exit 3 |
| `.opencode/skills/sk-code/code-quality/scripts/check-dist-staleness.sh` | Handler | PostToolUse warn-only checker (Python, `.sh` extension) |
| `.opencode/skills/sk-code/code-quality/scripts/hooks/claude-posttooluse.sh` | Handler | Dispatches the dist-staleness checker on every `Write`/`Edit` |
| `.opencode/plugins/mk-dist-freshness-guard.js` | Handler | OpenCode plugin: `tool.execute.before` and `session.created` warnings |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-spec-kit/scripts/tests/test-dist-freshness.sh` | Automated test | Asserts `validate.sh` exits 3 on a stale compiled orchestrator and passes through once fresh |
| `tooling_and_scripts/cli_dist_freshness_guard.md` | Manual playbook | CLI-shim guard trip, override, and restore (playbook ID 429) |
| `tooling_and_scripts/validate_sh_dist_freshness_backstop.md` | Manual playbook | `validate.sh` hard backstop trip and restore (playbook ID 455) |

## 4. SOURCE METADATA

- Group: Tooling And Scripts
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `tooling_and_scripts/dist_freshness_enforcement.md`

> **Playbook:** [429](../../manual_testing_playbook/tooling_and_scripts/cli_dist_freshness_guard.md), [455](../../manual_testing_playbook/tooling_and_scripts/validate_sh_dist_freshness_backstop.md)

Related references:
- [spec-memory-cli-daemon-backed-surface.md](spec_memory_cli_daemon_backed_surface.md) — Daemon-backed spec-memory CLI surface that consumes this module's freshness guard
- [source-dist-alignment-enforcement.md](source_dist_alignment_enforcement.md) — Related but distinct concern: detects orphaned dist artifacts with no source, not source-newer-than-dist staleness
