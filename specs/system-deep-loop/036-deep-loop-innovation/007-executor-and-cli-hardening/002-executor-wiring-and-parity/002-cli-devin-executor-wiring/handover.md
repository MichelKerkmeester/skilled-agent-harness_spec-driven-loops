# Handover: 036/007/002/002 cli-devin-executor-wiring (code landed — external live smoke pending)

<!-- SPECKIT_TEMPLATE_SOURCE: handover | v2.2 -->

**Status:** The cli-devin executor wiring is implemented and documented; all in-repo verification is done. One deferred end remains and it is purely an **external live run** requiring a credential this session did not have.

**Handover Time:** 2026-08-18 · **From:** orchestrator

---

## 1. The deferred end

### T011 / CHK-021 [P0] — Live `devin -p` smoke dispatch on `glm-5-2`
- **State:** `[ ]` deferred (tasks.md T011; checklist CHK-021; "Manual verification passed" also deferred).
- **What:** a live `devin -p` smoke dispatch on the `glm-5-2` model to confirm the wired executor actually dispatches end-to-end (referenced prior run `88ffed2893`).
- **Why deferred:** needs an **authenticated Devin account**. It cannot run headless / in this session; external run pending.

## 2. Resume steps (to close T011/CHK-021)
1. On a host with an authenticated Devin account, run the live `devin -p` smoke dispatch targeting `glm-5-2` through the wired cli-devin executor path.
2. Capture the dispatch invocation, stdout/stderr, and exit status as evidence.
3. Confirm the dispatch reaches the model and returns (parity with the other executors' smoke behavior).
4. Mark T011 and CHK-021 `[x]` with the captured evidence; set "Manual verification passed" `[x]`.

## 3. Note
This is the only thing between the packet and a clean close — no code change is expected, only the external live confirmation. If the wiring has drifted since landing, re-confirm against current `fanout-run.cjs` devin dispatch before running the smoke.
