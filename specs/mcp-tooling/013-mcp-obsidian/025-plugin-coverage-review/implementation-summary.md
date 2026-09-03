# Implementation Summary — mcp-obsidian plugin-coverage review + scenario testing

## Final state: complete

All 11 plugins are confirmed covered across every documentation surface; the review's real findings were remediated and shipped to v4; and 10 of 11 plugin playbook scenarios pass a headless file-layer test (1 environmental SKIP).

## 1. Review outcome

Three `/deep:review` cycles (cli-codex `gpt-5.6-luna` max/fast). Cycles 1 and 2 crashed on a concurrent-run write-containment collision; cycle 3 completed 10/10. Findings converged and were each re-verified against the real files. Full detail in `review-report.md`.

**Coverage matrix result:** 11/11 across references, assets, feature-catalog, and playbook; the router was 10/11 (health-md missing an intent) before remediation, now 11/11.

## 2. Remediation shipped to v4

- **`7b89342a3d`** — structural coverage: 11-plugin support + pre-1.0 version renumber + health-md router intent, generic PLUGINS fallback → 11, plugin-operation-logic overview → 11, playbook §12 → 11 scenarios, beancount throwaway isolation, git field grounding.
- **`9d8b8307d8`** — deeper hardening: BRAT plugin-id path-traversal guard, Code Mode fail-safe read, loopback-only TLS caveat, human loading index → 11.

Findings intentionally NOT changed: the `VERIFY` honesty markers (resolving them would fabricate facts). Noise: a self-referential "packet lacks inputs" finding (the review pointed at its own scaffolding).

## 3. Scenario test outcome (10 PASS · 0 FAIL · 1 SKIP)

cli-codex `gpt-5.6-luna` xhigh/fast agents, parallel, each in an isolated throwaway vault (writes physically contained; no real vault or repo file touched). Verdicts backed by real command output. PASS = file-layer create + structural validation passed; the visual in-app render is out of headless scope (skipped everywhere by design). The one SKIP is OBS-013 (BRAT), blocked only by the sandbox's lack of network for the GitHub release download — environmental, not a scenario defect. Full table in `scenario-test-results.md`.

## 4. Notes / scar tissue

- **Concurrent deep-loop runs are unsafe in this shared working tree** — their write-containment guard reverts any untracked file that changes anywhere during the run. Across the review cycles it deleted concurrent work in other packets (038 handover + graph-metadata, an sk-doc/026 scratch file) and even parts of this packet's own untracked scaffolding + the in-flight version renumber (recovered before shipping). Future deep-reviews here must run in an isolated git worktree.
- Direct `codex exec` dispatches (scenario testing) have no such guard and ran cleanly in parallel.
