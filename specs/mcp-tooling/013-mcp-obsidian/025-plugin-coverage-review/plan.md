# Plan — mcp-obsidian plugin-coverage review + scenario testing

## Approach (as executed)

1. **Deep review** (`/deep:review`, cli-codex `gpt-5.6-luna` max/fast, `--stop-policy=max-iterations`) over the skill's plugin coverage, scoped by `spec.md` + a resource-map matrix. Ran across three cycles (two crashed on a concurrent-run write-containment collision, one completed 10/10).
2. **Remediate** every verified finding in the 013 skill; ship to v4.
3. **Headless scenario test** — cli-codex `gpt-5.6-luna` xhigh/fast agents, in parallel, one isolated throwaway vault each, executing all 11 `OBS-0NN` plugin tie-in scenarios at the file layer.

## Executors

- Review: cli-codex `gpt-5.6-luna`, `max` effort, `fast` tier.
- Scenario test: cli-codex `gpt-5.6-luna`, `xhigh` effort, `fast` tier; `--sandbox workspace-write` scoped to each throwaway vault.

## Verification

- Every finding re-verified against the real files before acting (finding = hypothesis).
- Every scenario verdict backed by real command output (jq, schema checks, round-trips), not model assertion.
- No real vault or repo file written by the tests; per-scenario teardown + no-stray sweep.

## Infrastructure lesson

Concurrent deep-loop fan-outs in one git working tree mutually trip write-containment (each reverts the other's untracked files). Direct `codex exec` dispatches (used for scenario testing) have no such guard and did not interfere.
