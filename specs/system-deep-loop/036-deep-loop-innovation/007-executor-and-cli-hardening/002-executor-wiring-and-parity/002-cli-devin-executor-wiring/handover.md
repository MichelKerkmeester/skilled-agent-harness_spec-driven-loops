# Handover: 036/007/002/002 cli-devin-executor-wiring (closed)

<!-- SPECKIT_TEMPLATE_SOURCE: handover | v2.2 -->

**Status:** Closed. The cli-devin executor wiring is implemented, documented, and verified in-repo, and the one remaining external end — the live smoke dispatch — ran on 2026-08-18. No open items.

**Handover Time:** 2026-08-18 · **From:** orchestrator

---

## 1. What closed the packet

### T011 / CHK-021 [P0] — Live `devin -p` smoke dispatch on `glm-5-2`
- **State:** `[x]` CLOSED 2026-08-18 (tasks.md T011; checklist CHK-021; "Manual verification passed").
- **What:** a live `devin -p` dispatch on `glm-5-2` confirming the model round-trip works end-to-end against a real account.
- **How it closed:** the deferral assumed no authenticated Devin account was reachable. That assumption was simply out of date — the operator's account was already logged in, so the dispatch ran directly. `devin auth status` reported logged in; `devin -p --respect-workspace-trust false --model glm-5-2 --permission-mode accept-edits` then returned the exact requested string with exit 0 in 2.26s on `devin 3000.4.25`, from a scratch directory outside the repository. Evidence: `scratch/t011-live-smoke-evidence.md`.

## 2. The one durable lesson

On this CLI version a headless `devin -p` refuses to run in any directory the operator has not opened `devin` in interactively:

```
Error: Refusing to run in an untrusted workspace: <dir>
```

`--respect-workspace-trust false` is therefore load-bearing for every automated dispatch, not an optional convenience. It also served as this run's negative control: the same command without the flag fails closed, which is what proves the passing run was a real round-trip rather than a no-op.

## 3. If this packet is reopened

Nothing here is waiting on an external party. Should the wiring need re-verification after future drift, re-confirm the devin dispatch path in `fanout-run.cjs` first, then re-run the smoke exactly as recorded in the evidence file.
