# Orchestrator rulings on design.md section 6 (2026-09-29)

1. `--out` and `--report`: accepted as proposed. `--report` writes `report.json`; `--out` writes `calls.jsonl`, and `report.json` too when `--report` is absent.
2. sk-code's gold row: accepted as proposed, counted `unscored`, never scored.
3. Catalog placement: accepted as proposed, `packet-authored-registry-routing/leaf-route-replay.md`.
4. Prose grammar and transcript read pattern: accepted as proposed.
5. Gate order with `--jev --deem`: NOT as proposed. Parent D1 ("Jev first, else Deem") outranks the phase spec. Each switch runs its own gate, Jev first. A failed Jev gate prints its skip line and the Deem gate and arm still run. "A failed gate never starts the other backend" means a failed gate never runs the other backend in its place.
6. Playbook scenario: accepted as proposed, `SKL-008`, `parent-hub/replay-stage-two-leaf-routes.md`.
7. Design step 6 is split into three briefs (gates; verdict math and headroom; arms and main wiring), and `parseArgs` and the zero-call `main` move earlier so every CLI test has a `main` to call.
