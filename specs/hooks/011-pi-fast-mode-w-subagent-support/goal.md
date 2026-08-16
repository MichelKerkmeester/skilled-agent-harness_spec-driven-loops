# Goal: pi-fast-mode-w-subagent-support

**Packet:** `specs/hooks/011-pi-fast-mode-w-subagent-support` · **Branch:** `skilled/v4.0.0.0` · **Status:** Planned (0% built)

## Objective
Fork the upstream `pi-openai-fast-mode` Pi extension into a new package `pi-fast-mode-w-subagent-support` that keeps its `{ enabled, targets }` engine and adds strict parent→child subagent handoff of the fast-mode preference through an inherited environment variable. Ship a tested raw-TypeScript Pi extension, installed only after package, command-ownership, live-UI, and rollback gates pass.

## Current state (2026-08-16)
- Deep research COMPLETE (10 / 10 lanes) — canonical in `research/research.md`.
- All 9 phase leaves + 3 phase-parents are PLANNED and pass `validate.sh --strict`. Every leaf now carries an evidence checklist (145 items total). No fork code exists yet.

## Locked decisions (reversible)
- **Env var:** `PI_FAST_MODE_W_SUBAGENT_SUPPORT`, strict `1` / `0`; invalid or unset means no opinion (never auto-enables a paid tier).
- **Config:** keep `{ enabled, targets }`; ONE-TIME legacy-path migration → atomic new-path write; no dual-read; legacy file left untouched.
- **Indicator:** namespaced `ctx.ui.setStatus` (composes with footers, works in RPC mode). `setFooter` rejected.
- **Precedence:** explicit `--fast` / `/fast off` > inherited env `1`/`0` > persisted config; handoff never bypasses model/target gating; child is read-only.
- **Install:** local-path first; npm publish deferred. Child-handoff proof pinned to `openai-codex/gpt-5.6-luna`. Live indicator proof = RPC `setStatus` request JSON.

## Structure & execution order
Three workstreams, each a phase-parent with three executable leaves, run in order:
1. **001-fork-and-package** → source-baseline → identity-config-compat → package-baseline-gates
2. **002-subagent-handoff** → handoff-contract → session-precedence → process-propagation
3. **003-integration-and-tests** → extension-integration-suite → install-transition → live-verification-and-sync

Each leaf passes `validate.sh --strict` before its handoff; run recursive validation from the root after any metadata refresh.

## Next action
Execute `001-fork-and-package/001-source-baseline`: choose the working-package location, copy the pinned upstream tree (commit `9b28456`) excluding `.git` / `node_modules`, record the source inventory, prove the `context/` reference unchanged, and record the `rm -rf` rollback. Then continue in order.

## Deferred / watch
- Highest empirical risk lives in `003-live-verification-and-sync`: command-suffix renumbering, live RPC/TUI `setStatus`, and real child inheritance are unprovable by unit tests and need live `pi -e` / `get_commands` probes.
- npm publication is an open product decision — not required to build or install locally.
- The working tree still carries an in-flight lean-trio restructuring; commit a clean checkpoint before implementation starts.
