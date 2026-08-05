---
title: "CLI Dispatch Authorization And Inspection"
description: "How the shared dispatch inspector classifies a shell command as direct/ambiguous/none — including quote-safe executor normalization — and how the Pi preflight gate turns that classification into an allow/deny authorization decision."
trigger_phrases:
  - "cli dispatch authorization"
  - "dispatch inspector classification"
  - "quote-safe executor normalization"
  - "shouldDenyPiDispatch pi authorization gate"
version: 1.0.0.0
---

# CLI Dispatch Authorization And Inspection (cli-external-orchestration)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The dispatch hooks share one runtime-neutral inspector that decides whether a Bash command is an external-CLI dispatch, and — under Pi — whether that dispatch is authorized. The inspector (`inspectDispatch` in `.opencode/hooks/dispatch/lib/dispatch-audit.mjs`) tokenizes a bounded command without evaluating it and returns exactly one classification:

- `direct` — exactly one proven command-position executor (e.g. `devin -p x`, `codex exec -p x`, `opencode run x`).
- `ambiguous` — an executor-shaped candidate that cannot be pinned to a single direct executor: variable (`$CLI -p x`), alias, command substitution, unknown wrapper, variable-prompt, or two dispatch segments.
- `none` — no dispatch evidence.

The same classification feeds two consumers: the observational audit trail (`matchDispatchShape` / `recordDispatch`, which records only `direct` dispatches) and the Pi authorization gate (`shouldDenyPiDispatch`). Because the inspector is a shared library, its classification governs all four inspector runtimes — Claude, Codex, Devin, and Pi.

**Quote-safe executor normalization.** A quoted command-position token still names the binary the shell will run, so `"devin" -p x` invokes `devin` exactly as the bare form does. The inspector classifies such a quote-safe executor as `direct` by exact basename membership, identical to its unquoted twin, and also resolves quoted executors behind a transparent `env KEY=v` wrapper. Exact basename membership admits only a real executor name, so multi-word quoted prose (`"devin -p task"` as a single token) and a quoted token used as an argument (`echo "devin" -p "hi"`) correctly remain `none`. A quoted executor therefore can no longer classify as `none` and thereby evade both the Pi authorization gate and the audit trail.

---

## 2. HOW IT WORKS

### Classification To Authorization

`shouldDenyPiDispatch` maps the inspector's `kind` to an allow/deny decision for a Pi `bash` `tool_call`:

- `none` → no-op (not a dispatch; the preflight returns early).
- `ambiguous` → deny — the command does not prove one direct executor.
- `direct` → deny unless the user's own request names the matching executor (or a `/deep:* --executor=cli-X` override authorizes it); a `cli-pi` self-dispatch is never authorized.

The gate reads the user's original request text (captured before sibling transforms and stripped of injected directives) so that an explicit, un-negated executor mention is what authorizes a dispatch — not the injected advisor or spec-gate content.

### Cross-Runtime Scope

The Claude, Codex, and Devin dispatch hooks consume the same shared inspector for their preflight and post-tool audit adapters; the `DISPATCH_SHAPES` registry is the single source of truth shared between the audit and preflight twins so they can never disagree about what counts as a dispatch. A classification change in the shared inspector is therefore a cross-runtime change by construction.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/hooks/dispatch/lib/dispatch-audit.mjs` | Shared | `inspectDispatch` classification (`direct`/`ambiguous`/`none`), `directExecutor` quote-safe normalization, `matchDispatchShape`, `recordDispatch`. |
| `.opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts` | Pi | `shouldDenyPiDispatch` authorization gate and the `tool_call` deny path. |
| `.opencode/hooks/dispatch/claude/dispatch-preflight-lint.mjs` | Claude | Preflight twin consuming the shared inspector. |
| `.opencode/hooks/dispatch/codex/dispatch-preflight-lint.mjs` | Codex | Preflight twin consuming the shared inspector. |
| `.opencode/hooks/dispatch/devin/dispatch-preflight-lint.mjs` | Devin | Preflight twin consuming the shared inspector. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/hooks/dispatch/lib/dispatch-audit.test.mjs` | Automated test | Inspector classification table, including the quote-safe executor rows and prose/argument controls. |
| `.opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts` | Automated test | `shouldDenyPiDispatch` authorization contract and the `tool_call` gate. |

---

## 4. SOURCE METADATA

- Group: CLI Dispatch Authorization And Inspection
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `cli-dispatch-authorization/cli-dispatch-authorization.md`

Related references:
- [cli-executor-dispatch-routing.md](../cli-executor-dispatch-routing/cli-executor-dispatch-routing.md) — hub-level routing that selects which executor packet composes a dispatch (distinct from the hook-level inspection here).
- Manual scenario: `../../manual-testing-playbook/plugins-and-hooks/cli-dispatch-preflight-authorization.md`.
