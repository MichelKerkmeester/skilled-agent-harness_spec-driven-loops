---
title: "Shared Dispatch Inspector And Pi Authorization Gate"
description: "One runtime-neutral inspector classifies a Bash command as `direct`, `ambiguous`, or `none`, and the Pi preflight gate turns that classification into an allow/deny authorization decision. The inspector is shared across the Claude, Codex, Devin, and Pi dispatch hooks and feeds both the observational audit trail and the Pi gate. It recognizes all seven executors plus the `cli-jev` judgment shapes, including the print-flagless `cli-hermes` forms."
trigger_phrases:
  - "cli dispatch authorization"
  - "dispatch inspector classification"
  - "quote-safe executor normalization"
  - "shouldDenyPiDispatch pi authorization gate"
version: 1.4.1.0
---

# CLI Dispatch Authorization And Inspection (cli-external-orchestration)

## 1. OVERVIEW

The dispatch hooks share one runtime-neutral inspector that decides whether a Bash command is an external-CLI dispatch, and under Pi whether that dispatch is authorized. The inspector (`inspectDispatch` in `.skilled/hooks/dispatch/lib/dispatch-audit.mjs`) tokenizes a bounded command without evaluating it and returns exactly one classification:

- `direct`: exactly one proven command-position executor (e.g. `devin -p x`, `codex exec -p x`, `opencode run x`, `opencode2 run x`).
- `ambiguous`: an executor-shaped candidate that cannot be pinned to a single direct executor, such as a variable (`$CLI -p x`), an alias, a command substitution, an unknown wrapper, a variable prompt, or two dispatch segments.
- `none`: no dispatch evidence.

The OpenCode executor name is a version family rather than a fixed binary. `OPENCODE_EXECUTOR_RE` in the same module admits any `opencode<digits>` basename, and the `DISPATCH_SHAPES` row `\bopencode\d*\s+run\b` maps that shape to `cli-opencode`, so `opencode2 run x` is `direct cli-opencode` exactly as `opencode run x` is. The name decides only which packet owns the dispatch. Which OpenCode generation the run reaches is a separate question, answered by the rule checks from the binary's own `--version` output (see Version-Aware Rule Checks).

A shell `-c` wrapper (`bash -c`, `sh -c`, `zsh -c` or `dash -c`) is not an unknown wrapper: the inspector classifies the quoted command it runs, so `bash -c 'devin -p task'` is `direct cli-devin`. A variable counts as an executor only in command position, so `mkdir -p "$DIR"` and `node -p "$EXPR"` are `none`.

The same classification feeds two consumers: the observational audit trail (`matchDispatchShape` / `recordDispatch`, which records only `direct` dispatches) and the Pi authorization gate (`shouldDenyPiDispatch`). Because the inspector is a shared library, its classification governs all four inspector runtimes: Claude, Codex, Devin, and Pi. A separate rule engine evaluates a dispatch skill's hard rules against the same command before it is spawned.

**Quote-safe executor normalization.** A quoted command-position token still names the binary the shell will run, so `"devin" -p x` invokes `devin` exactly as the bare form does. The inspector classifies such a quote-safe executor as `direct` by exact basename membership, identical to its unquoted twin, and also resolves quoted executors behind a transparent `env KEY=v` wrapper. Exact basename membership admits only a real executor name, so multi-word quoted prose (`"devin -p task"` as a single token) and a quoted token used as an argument (`echo "devin" -p "hi"`) correctly remain `none`. A quoted executor therefore can no longer classify as `none` and thereby evade both the Pi authorization gate and the audit trail.

---

## 2. HOW IT WORKS

### Classification To Authorization

`shouldDenyPiDispatch` maps the inspector's `kind` to an allow/deny decision for a Pi `bash` `tool_call`:

- `none` → no-op (not a dispatch, so the preflight returns early).
- `ambiguous` → deny, because the command does not prove one direct executor.
- `direct` → deny unless the user's own request names the matching executor (or a `/deep:* --executor=cli-X` override authorizes it).

The gate reads the user's original request text (captured before sibling transforms and stripped of injected directives) so that an explicit, un-negated executor mention is what authorizes a dispatch, not the injected advisor or spec-gate content.

### Cross-Runtime Scope

The Claude, Codex, and Devin dispatch hooks consume the same shared inspector for their preflight and post-tool audit adapters. The `DISPATCH_SHAPES` registry is the single source of truth shared between the audit and preflight twins, so they can never disagree about what counts as a dispatch. A classification change in the shared inspector is therefore a cross-runtime change by construction.

### Version-Aware Rule Checks

A second authorization surface evaluates hard rules against the composed command before it is spawned. `evaluate` in `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs` reads the `hard-rules.json` sidecar beside a dispatch skill's `SKILL.md` through `readHardRules`, which fails open to an empty list on any read, parse, or shape error, and runs each declared check against the command text. The Claude, Codex, Devin, and Pi preflight lints call this engine, so an ad-hoc dispatch is judged before the process starts.

Rules are version-scoped. Each rule declares an `appliesTo` list of version families, and when the command invokes an OpenCode binary the engine resolves that binary's family through `.skilled/hooks/dispatch/lib/opencode-version.mjs`. That resolver parses the first supported version token in the binary's `--version` output under a three-second probe timeout, maps major 1 to `v1` and major 2 to `v2`, and caches the answer by canonical path, size, and modification time. A rule whose `appliesTo` list excludes the resolved family is skipped. When the family stays `unknown`, rules that cover both families keep their declared severity and version-specific rules are downgraded to `warn`, so a failed probe cannot block a dispatch over advice that may not apply. A check that throws is treated as passing, because a rule bug must never block the dispatch it observes.

The `cli-opencode` sidecar at `.skilled/skills/cli-external-orchestration/cli-opencode/hard-rules.json` carries the OpenCode rules. `stdin-redirect-required` and `explicit-model-required` are blocking errors on both families. `no-bare-agent-general` (warn) and `command-flag-for-slash-prompt` (error) are OpenCode 1 only. `v2-slash-prompt-route` (warn) is OpenCode 2 only, where `run` does not expand a slash-command prompt and the dispatch has to use the server API route instead. `share-requires-confirmation` advises on both families.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/hooks/dispatch/lib/dispatch-audit.mjs` | Shared | `inspectDispatch` classification (`direct`/`ambiguous`/`none`), `directExecutor` quote-safe normalization and the `opencode<digits>` executor regex, `matchDispatchShape`, `recordDispatch`. |
| `.skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts` | Pi | `shouldDenyPiDispatch` authorization gate and the `tool_call` deny path. |
| `.skilled/hooks/dispatch/claude/dispatch-preflight-lint.mjs` | Claude | Preflight twin consuming the shared inspector. |
| `.skilled/hooks/dispatch/codex/dispatch-preflight-lint.mjs` | Codex | Preflight twin consuming the shared inspector. |
| `.skilled/hooks/dispatch/devin/dispatch-preflight-lint.mjs` | Devin | Preflight twin consuming the shared inspector. |
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs` | Shared | Reads a skill's `hard-rules.json` sidecar and evaluates each declared rule against the composed command before it is spawned, filtering by the resolved OpenCode family and downgrading version-specific rules when the family is unknown. |
| `.skilled/hooks/dispatch/lib/opencode-version.mjs` | Shared | Version resolver for the rule filter: parses a binary's `--version` output into `v1`, `v2`, or `unknown` under a bounded probe and caches by canonical path, size, and modification time. |
| `.skilled/skills/cli-external-orchestration/cli-opencode/hard-rules.json` | Shared | The `cli-opencode` rule sidecar: rule id, check id, message, severity, and the `appliesTo` version list for each rule. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/hooks/dispatch/lib/dispatch-audit.test.mjs` | Automated test | Inspector classification table, including the quote-safe executor rows and prose/argument controls, plus the OpenCode version-resolution rows and the `DISPATCH_SHAPES` registry test. |
| `.skilled/hooks/dispatch/pi/dispatch-preflight-lint.test.ts` | Automated test | `shouldDenyPiDispatch` authorization contract and the `tool_call` gate. |
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` | Automated test | Sidecar reading, the check-registry bijection, the `appliesTo` version filter, the unknown-version severity downgrade, and `opencode2 run` evaluation. |

---

## 4. SOURCE METADATA

- Group: CLI Dispatch Authorization And Inspection
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `cli-dispatch-authorization/cli-dispatch-authorization.md`

Related references:
- [cli-executor-dispatch-routing.md](../cli-executor-dispatch-routing/cli-executor-dispatch-routing.md): hub-level routing that selects which executor packet composes a dispatch (distinct from the hook-level inspection here).
- Manual scenario: `../../manual-testing-playbook/plugins-and-hooks/cli-dispatch-preflight-authorization.md`.
