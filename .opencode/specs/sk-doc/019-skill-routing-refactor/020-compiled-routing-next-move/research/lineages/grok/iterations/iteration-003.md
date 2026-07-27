# Iteration 3: Freshness Guard Enforcement Placement

## Focus
Q3: where compiled-route freshness should block (pre-commit, pre-push, CI, session hook) and how legitimately uncompilable hubs escape.

## Findings
1. **Guard already has the right exit contract for a gate:** default exits non-zero on any failure; `--warn-only` always exits 0; `--json` is machine-readable. Reasons distinguish `stale-manifest`, `authored-drift`, and `inputs-do-not-compile`. [SOURCE: .opencode/bin/compiled-route-guard.cjs:21] [SOURCE: .opencode/bin/compiled-route-guard.cjs:95] [SOURCE: .opencode/bin/compiled-route-guard.cjs:126] [SOURCE: .opencode/bin/compiled-route-guard.cjs:85]
2. **No current hook or CI workflow invokes `compiled-route-guard.cjs`.** Searches across `.opencode/scripts/git-hooks/`, `.opencode/hooks/`, `.codex/hooks.json`, and `.github/workflows/*.yml` found zero references. Existing CI siblings cover related but different contracts: `routing-registry-drift.yml` (advisor maps ↔ mode-registry) and `runtime-no-spec-import.yml` (promoted runtime must not re-import `.opencode/specs`). [SOURCE: command: rg compiled-route across hooks/workflows] [SOURCE: .github/workflows/routing-registry-drift.yml:1] [SOURCE: .github/workflows/runtime-no-spec-import.yml:1]
3. **Authoritative blocker should be CI (PR + main), not local hooks.** Repo-tracked hooks are opt-in (`install-hooks.sh`); fresh clones have no active hook. Linked-worktree installs can leave dangling shared `.git/hooks` symlinks. Pre-commit today is partly advisory (doc-model-refs) with separate blocking gates for other concerns — not a reliable shared merge boundary. [SOURCE: .opencode/hooks/README.md:13] [SOURCE: .opencode/hooks/README.md:81] [SOURCE: .opencode/scripts/install-git-hooks.sh:112]
4. **Pre-push is the wrong semantic gate.** It enforces remote branch naming + allowlist permission with explicit bypasses (`SPECKIT_SKIP_PREPUSH_NAMING`, `SPECKIT_ALLOW_REMOTE_PUSH`), not content correctness of routing artifacts. [SOURCE: .opencode/scripts/git-hooks/pre-push:1] [SOURCE: .opencode/scripts/git-hooks/pre-push:21]
5. **Session hooks should stay advisory/feedback.** Codex `SessionStart` already runs informational checks (`check-git-hooks.sh`, dist staleness) that inject context rather than hard-block merges. Putting the authoritative freshness block there would be bypassable per runtime and would not protect PRs from other executors. [SOURCE: .codex/hooks.json:3] [SOURCE: .codex/hooks.json:18] [INFERENCE: session hooks are per-runtime, not merge authority]
6. **Recommended placement split:**
   - **CI (authoritative):** run `compiled-route-guard.cjs` (blocking) on PRs touching `.opencode/skills/*/mode-registry.json`, `hub-router.json`, `.opencode/bin/lib/compiled-routing/**`, sync/guard/manifest libs — alongside or as a job sibling to `runtime-no-spec-import` / `routing-registry-drift`.
   - **Pre-commit (optional developer UX):** `--warn-only` or soft fail with remint hint; never the sole authority.
   - **Session hook (optional):** surface guard JSON summary on SessionStart.
   - **Pre-push:** do not add content freshness here.
7. **Escape hatch for legitimately uncompilable hubs:** encode an explicit, reviewed allowlist (hubId + reason + expiry or tracking packet) that CI treats as non-blocking **only** for `inputs-do-not-compile`, never for `stale-manifest` or `authored-drift`. That matches the concurrent `sk-design` six→four mode restructure and prevents "in progress" from laundering silent legacy drops. [SOURCE: .opencode/bin/compiled-route-guard.cjs:83] [SOURCE: iteration-002 sk-design six-modes evidence] [INFERENCE: allowlist shape not implemented today]

## Ruled Out
- Authoritative pre-commit blocking: opt-in/bypassable; worktree hook anchoring unreliable. [SOURCE: .opencode/hooks/README.md:81]
- Authoritative pre-push blocking: wrong concern (remote permission). [SOURCE: .opencode/scripts/git-hooks/pre-push:1]
- Session hook as sole blocking gate: not a shared merge boundary. [SOURCE: .codex/hooks.json SessionStart pattern]

## Dead Ends
Broad "hook" greps hit benchmark transcripts; narrowing to workflow + hook entrypoints worked.

## Edge Cases
- Partial success: guard currently fails three hubs; CI without an escape hatch would red-fail main until `sk-design`/`cli-external-orchestration` compile again — so the allowlist must ship with the CI job.
- UNVERIFIED: exact path filters and job name for the new workflow — recommendation only.

## Sources Consulted
- compiled-route-guard.cjs
- .opencode/hooks/README.md, install-git-hooks.sh, pre-commit, pre-push
- .codex/hooks.json
- .github/workflows/routing-registry-drift.yml, runtime-no-spec-import.yml, README.md

## Assessment
- New information ratio: 1.00
- Answer: CI authoritative; pre-commit/session advisory; pre-push out; escape = reviewed `inputs-do-not-compile` allowlist only.

## Recommended Next Focus
Q4: retain vs remove staging/rollback given former live-root `rmSync` hazard and single-operator git-backed workflow.
