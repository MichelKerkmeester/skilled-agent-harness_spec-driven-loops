---
title: "cli-jev: Manual Testing Playbook"
description: "Operator-facing index for cli-jev hub-routing validation: does the router resolve a jev judgment request to the cli-usage transport, under the hub's own id and alias."
version: 0.2.0.1
---

# cli-jev: Manual Testing Playbook

> **EXECUTION POLICY**: Every scenario MUST be executed against the live `cli-jev` hub — no mocks, no stubs. Scenarios verify the AI's actual routing behavior: which `workflowMode` the hub router picks (per `hub-router.json` `routerSignals` / `vocabularyClasses`), which packet it loads, and whether an out-of-domain request resolves nothing. Acceptable verdicts: PASS, PARTIAL, FAIL, or SKIP (with documented blocker).

This document is the hub-level operator directory for `cli-jev`'s routing behavior. It covers the routing surface the hub itself owns — resolving a Jev judgment request to the `cli-usage` transport — not the internal dispatch behavior of that transport, which the packet's own corpus already covers at `cli-usage/manual-testing-playbook/` (22 scenarios, JEV-001 … JEV-022, unchanged by the move).

Source of truth for routing behavior: `.skilled/skills/cli-jev/SKILL.md`, `.skilled/skills/cli-jev/hub-router.json`, `.skilled/skills/cli-jev/mode-registry.json`.

---

## 1. OVERVIEW

The `cli-jev` hub is a single-transport hub: one registered mode, `cli-usage`, declared `packetKind: "transport"` under the hub's `transport-axis` extension. Its routing corpus is therefore small and negative-heavy — the interesting question is not which of several modes wins, but whether a judgment request resolves the one mode and whether anything else stays unrouted.

The scenario ids read `CJ-` because the hub is `cli-jev`; the transport's own judgment scenarios keep their `JEV-` ids.

---

## 2. GLOBAL PRECONDITIONS

- Run from the repository root against the live mode registry and hub router.
- `command -v jev` resolving is required before any scenario that executes a judgment, since the transport's first hard rule refuses a route without the binary.
- Until the hub is onboarded to the compiled serving closure, resolve routes through the compiled-route CLI fallback and expect `{"servingAuthority":"legacy","hubId":"cli-jev"}`; after onboarding, the same call returns a compiled route.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- Capture the exact request, the resolved workflow mode, the loaded packet, the command, its exit status and the relevant output.
- Use PASS, PARTIAL, FAIL, or SKIP with a named blocker; never infer success from model prose alone.
- A recorded verdict names the run and the date it was observed.

---

## 4. DETERMINISTIC COMMAND NOTATION

Commands are shown from the repository root. Replace angle-bracket placeholders before execution, quote paths and prompts, and keep temporary state under a fresh `mktemp -d` directory.

---

## 5. CATEGORIES

| # | Category | Folder | Scenario IDs | One-line summary |
|---|----------|--------|--------------|------------------|
| 1 | Hub Routing | `hub-routing/` | CJ-001, CJ-002, CJ-003 | A judgment request resolves `cli-usage`, the alias still lands, and an out-of-domain request resolves nothing. |

---

## 6. SCENARIOS

- **[CJ-001](hub-routing/judgment-request-routes-to-transport.md)** — `jev noul` / `jev choice` phrasing resolves `workflowMode: cli-usage`.
- **[CJ-002](hub-routing/alias-still-resolves.md)** — a request naming `cli-jev` resolves the same transport.
- **[CJ-003](hub-routing/out-of-domain-resolves-nothing.md)** — a request with no Jev signal resolves no mode.

---

## 7. RUN RECORD

| Run | Date | Scenarios | Verdict | Report |
|---|---|---|---|---|
| hub-routing baseline | 2026-09-20 | CJ-001 … CJ-003 | 3 PASS, 0 FAIL, 0 SKIP; the transport judgment ran end to end | [`2026-09-20-hub-routing-baseline/`](../benchmark/reports/2026-09-20-hub-routing-baseline/) |

---

## 8. FAILURE TRIAGE

- **A scenario resolves no mode.** Check `hub-router.json`: the `cli-usage` signal's `vocabularyClasses` must exist in `vocabularyClasses` and the prompt must contain one of their phrases. Verify with `node .skilled/bin/compiled-route.cjs --hub cli-jev --prompt "<prompt>"` after onboarding, or the advisor for the same prompt before it.
- **A scenario resolves more than one mode.** The hub registers exactly one mode, so a bundle means the router read a different hub's registry; confirm the hub id (`cli-jev`, not `cli-external-orchestration`).
- **A scenario resolves `cli-external-orchestration`.** The old hub still carries a `cli-jev` router signal; that signal is removed when the transport is decoupled, and this scenario is the regression check for it.
