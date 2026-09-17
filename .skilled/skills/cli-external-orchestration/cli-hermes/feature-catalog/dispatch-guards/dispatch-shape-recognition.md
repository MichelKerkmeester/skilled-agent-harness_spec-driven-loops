---
title: "Hermes Dispatch-Shape Recognition"
description: "The shared dispatch inspector recognizes `hermes chat` with a query flag, and the top-level `-z` oneshot, as a dispatch, while a bare chat or a management subcommand stays unrecognized."
trigger_phrases:
  - "hermes dispatch-shape recognition"
  - "DISPATCH_SHAPES hermes entry"
  - "HERMES_QUERY_FLAGS"
  - "hermes dispatch audit trail"
version: 1.0.0.0
---

# Hermes Dispatch-Shape Recognition (inspectDispatch)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The shared dispatch inspector recognizes `hermes chat` with a query flag, and the top-level `-z` oneshot, as a dispatch, while a bare chat or a management subcommand stays unrecognized.

Recognition is what puts a Hermes run into the runtime-neutral audit trail the other executors already feed, and it is what the authorization gate classifies.

---

## 2. HOW IT WORKS

### Why Hermes Needs Its Own Branch

Every other executor in the registry is recognized by a print flag. Hermes has none: its headless forms are a `chat` subcommand carrying a query flag, or the top-level oneshot flag. So the shape registry carries a Hermes-specific pattern, and the tokenizing inspector carries a Hermes-specific branch beside the generic print-flag branch.

### Classification

In the tokenizer, a command-position `hermes` is admitted by exact basename membership, including behind a transparent environment wrapper and including a quoted command-position token, which still names the binary the shell will run. The branch then requires either `chat` as the next word plus one of the query flags, or the top-level oneshot flag anywhere in the rest of the command. Anything else on the binary, such as a status or a skills listing, returns no executor and the command classifies as `none`. The query flags are scoped to this branch on purpose, so a short flag like `-q` on an unrelated command is never read as dispatch evidence.

### What Recognition Feeds

A `direct` classification is what the audit path acts on. The pipeline extracts best-effort model and target hints, scrubs secret-shaped spans out of the command text, bounds the length, formats one JSON line and appends it to a size-rotated log. Every step fails open, because a telemetry fault must never affect the dispatch it observes, and a kill-switch variable turns the whole surface into a no-op.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/hooks/dispatch/lib/dispatch-audit.mjs` | Shared | The `DISPATCH_SHAPES` Hermes entry, the `hermes` branch of `directExecutor`, `HERMES_QUERY_FLAGS`, and the scrub, bound and append pipeline. |
| `.skilled/skills/cli-external-orchestration/cli-hermes/SKILL.md` | Handler | The documented headless forms these patterns are built to match. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/hooks/dispatch/lib/dispatch-audit.test.mjs` | Automated test | Classification table covering the Hermes dispatch forms and the management-subcommand controls. |

---

## 4. SOURCE METADATA

- Group: Dispatch guards
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `dispatch-guards/dispatch-shape-recognition.md`

Related references:
- [hard-rule-preflight-checks.md](hard-rule-preflight-checks.md) - the checks that run against a command before it is spawned.
- [../fanout-dispatch/hermes-executor-kind.md](../fanout-dispatch/hermes-executor-kind.md) - the builder that emits the shape recognized here.
