# Iteration 003 — Wave 3: backend / installers / mirrors

Three claude2-opus seats on the last high-value surface. Result: **6 P2, 0 P0/P1** — 3 fixed (installers), 3 flagged. The signal verdict is stable (0 P0; all P1s from earlier waves fixed). The remaining surface is now P2-class: installer hygiene, backend-lock hardening, cosmetic mirror drift.

## Confirmed clean (by the seats)
- Agent-mirror three-way parity: all 5 deep-loop agents byte-parity across `.opencode`/`.claude`/`.codex` (only the whitelisted per-runtime Path-Convention line + one trivial trailing blank differ).
- Runtime promotions (002): all 5 promoted primitives wired + consumed by mode packets; loop-lock CLIs execute; no orphans.
- No pre-merge path references — every agent/command/script `require()` into the runtime resolves.
- deep-loop-runtime MCP-free boundary holds.

## Fixed (installers — delegated, all `bash -n` PASS)
- **w3-1 [P2]** `mcp-click-up/mcp-servers/clickup-cli/setup.sh`: `pipx install cupt` was unguarded → aborts under `set -e` on re-run of the documented install path. Added a `command -v cupt` idempotency early-exit.
- **w3-2 [P2]** `mcp-chrome-devtools/scripts/doctor.sh:63`: read-only doctor ran `npx ... @alpha --version` with no timeout (unbounded registry resolve). Wrapped in `timeout 5 ... --prefer-offline` (`--no-install` preserved).
- **w3-3 [P2]** `mcp-click-up/scripts/install.sh:69`: Python gate `major>=3 && minor>=8` rejected 4.0–4.7. Changed to tuple comparison.

## Flagged (not fixed here)
- **w3-runtime-2 [P2]** `deep-loop-runtime/scripts/lib/cli-guards.cjs:185`: writer-lock has NO stale-lock reclamation (only `openSync(wx)` + retry-then-throw). A SIGKILL/OOM orphans `.deep-loop-graph-writer.lock` and bricks all writers for that lock (research/review/context share it) until manual `rm`. **Backend-hardening follow-up** (PID-stamped lock + dead-owner reclamation) — a load-bearing concurrency change on the frozen runtime; deserves its own pass.
- **w3-runtime-1 [P2]** convergence snapshot writes (`convergence.cjs:389-399`, `lib/council/convergence.cjs:182-191`) skip the writer lock. Low risk (WAL serializes; FK-disjoint tables) but the invariant isn't uniform. Same follow-up.
- **W3-001 [P2]** `.claude/agents/deep-review.md:11` Path-Convention line didn't self-localize (`.opencode/...` vs siblings' `.claude/...`). Cosmetic, whitelisted from the parity gate, no dispatch impact. **NOT fixed: that file is currently uncommitted-dirty under a concurrent session** owning the deep-* agent mirrors — its owner should apply the one-line fix to avoid a cross-session conflict.

## Convergence read (final)
~24 effective seats across 3 waves. The review has converged on signal: **0 P0; every P1 fixed and pushed.** Wave 3 found only P2s (installer hygiene of the same class as wave 2, backend hardening, cosmetic). Further waves would mine more same-class P2s without moving the verdict. Recommend stopping fresh discovery and routing the accumulated flags (007 governance decision, full 009 gate sign-off, 153 CI, backend-lock hardening, the contested mirror line) to the operator.
