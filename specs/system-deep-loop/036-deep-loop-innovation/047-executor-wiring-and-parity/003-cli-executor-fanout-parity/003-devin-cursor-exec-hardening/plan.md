<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Implementation Plan: devin + cursor Fan-out Exec Hardening

<!-- ANCHOR:summary -->
## 1. SUMMARY
Re-map the devin and cursor lineage builders from the live headless behavior of the installed CLIs so read-only leaves are genuinely read-only, workspace-write leaves never stall and stay write-confined, and every non-interactive leaf clears its runtime's trust gate. Rename the cursor approval abstraction's read-only value to name the real mechanism. Verify by unit tests over the exact arg-vectors plus live write/read probes of each mode.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
- fanout-run and executor-config vitest suites pass (full output, never through `tail`).
- Whole-runtime tsc is 0.
- Live probes confirm: read-only leaves cannot write but can read; workspace-write leaves write without stalling.
- Independent cli-opencode GPT-5.6-SOL review with no surviving P0/P1.
- `validate.sh --strict` passes.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
Each executor kind maps a generic sandbox mode to CLI flags inside `fanout-run.cjs`. The correct mapping is dictated by the CLI's actual non-interactive behavior, not by a symmetric permission-mode abstraction:

- **devin** — `--sandbox` forces autonomous mode and ignores `--permission-mode`, and grants no scopes without `--agent-config`. So read-only uses `--permission-mode auto` alone (devin rejects exec/writes non-interactively, allows native reads); workspace-write uses `dangerous --sandbox` (autonomous, cwd-confined); full-access uses `dangerous` alone.
- **cursor** — `-p` is trust-gated in untrusted dirs and auto-runs all tools. So read-only uses `--mode plan` (cursor's read-only mode) + `--trust`; workspace-write uses `--force --sandbox enabled` (autonomous, never stalls, writes cwd-confined; `--auto-review` is avoided because it can block non-interactively); full-access uses `--force --sandbox disabled` (`--force` implies trust).

`resolveCursorApprovalMode`/`CursorApprovalMode` are a parallel documentation resolver (consumed only by their own unit test); their read-only value moves from the fictional `ask` to `plan` to stay truthful.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
1. Live-probe both CLIs across the three sandbox modes to establish the real permission/trust/sandbox contract.
2. Re-map `buildDevinLineageCommand` (read-only drops `--sandbox`) and rewrite its permission-mapping comment.
3. Re-map `buildCursorLineageCommand` (read-only → `--mode plan --trust`; workspace-write adds `--trust`), rewrite its comment, and update `CursorApprovalMode`/`resolveCursorApprovalMode`.
4. Update all devin/cursor adapter unit tests to lock the exact new arg-vectors and not-contains guards.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Unit tests assert the exact constructed args for read-only, workspace-write, and danger-full-access of both kinds, plus not-contains guards (read-only carries no `--sandbox`/`--force`/`--auto-review`). Live probes reproduce, with the exact emitted args, that each read-only leaf's write is blocked while a native read succeeds, and that each workspace-write leaf writes without stalling. A cross-model SOL review adversarially checks read-only-ness, stall-freedom, regressions, and comment honesty.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
- `devin` (3000.2.17) and `cursor-agent` (2026.07.23) on PATH, authenticated, for the live probes.
- The audit phase's gap register (`001-executor-matrix-audit`).
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
The change is confined to two builders, one typed resolver, and their tests; rollback is reverting those hunks. The full fanout/executor vitest suites are the tripwire for any regression.
<!-- /ANCHOR:rollback -->
