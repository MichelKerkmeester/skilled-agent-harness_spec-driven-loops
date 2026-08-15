### Hooks & Runtime

- **Goals now follow you across runtimes.** Set an active goal once and it reaches Cursor, Pi, and Devin sessions from a shared goal-state file, with a new `goal manage` command (set/show/history/clear/complete/pause/resume/doctor) mirroring the OpenCode `/goal` router.
- **Goals are scoped per workspace, runtime, and session**, so parallel sessions no longer overwrite each other's active goal; Pi gets a native `/goal-pi` command bound to its own session identity.
- **Pi message sends got ~1000x faster on repeat prompts** — they resolve from the advisor's in-process cache in ~1–2 ms instead of ~1.4 s, and the 5-minute cache now invalidates correctly.
- **Pi prompt-cache ownership is now clean and observable**, with a hardened deep-pi extension for DeepSeek-direct models, persistent machine-readable cost stats, and per-session diagnostics surfaced instead of silently swallowed.
- **The SPEC FOLDER QUESTION no longer nags on read-only turns**, and every gate option now tells you exactly to reply with the folder path (or skip with E).
- **Hook bloat reduction ships opt-in and shadow-verified** — route summaries cap at three targets with a `+K more` digest, and repeat injections dedupe on session/message identity without changing your prompts byte-for-byte until you flip the flag.
- **One flag (or 20 individual toggles) now governs the whole hook layer**, with personal defaults persisted in `.opencode/hooks/hook-flags.env` and a single canonical index at `.opencode/hooks/README.md`.
- **Goal-hook playbooks now cover every goal-capable runtime**, with live verification proving the goal appears verbatim in Pi and Devin model output (Cursor stays model-invisible by contract; OpenCode's native goal tracking remains TUI-only).

**Breaking:** Pi subagent dispatch now defaults to native `pi-subagents` and denies dispatch-shaped calls lacking explicit `cli-*` authorization, and previously stored global goals no longer load automatically — you must migrate or archive them to the new per-session scoping.
