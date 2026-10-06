# Reproduction: bookkeeping rows refused by the gateway

In a temp run directory opened with a gateway-written config row:
- `config_warning` row -> `{"ok":false,"phase":"runtime","reason":"Legacy deep-research record refused: legacy-event-has-no-lossless-mode-event","code":"RUNTIME_ERROR"}` exit 1
- `min_iterations_guard_pass` row -> same reason, exit 1

Both names are in `PINNED_LEGACY_EVENTS` (`legacy-compatibility.ts`), and the workflow emits them through `append_to_jsonl`.

Verdict: holds.
