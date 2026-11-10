# Baseline: sk-doc hub and mode packets

Recorded on 2026-10-28 from the worktree at `00018303dc` (main after the sk-code hub move), before any phase edit.

## 1. Gates

All 35 gates exit 0: seven `parent-skill-check` runs, the compiled-route guard and sync check, `verify-router-sync`, fourteen `package_skill.py --check --strict` runs, the rule-copies canary, router vocabulary reach, the Hermes mirror check, the sk-code setup battery, root metadata, leaf-manifest freshness, the router test files, routing accuracy, recursive strict validation of the parent packet, contract drift and the advisor routing suites.

## 2. Routing accuracy

| Corpus | Top-1 |
|---|---|
| Full corpus | 155 / 195 |
| Holdout | 49 / 66 |
| Ambiguity | 19 / 24 |

## 3. Routing shape

`parent-skill-check` reports the sk-doc hub and all 14 packets as known debt (RS-001 and RS-002). The ledger holds 15 sk-doc entries: the hub at 58 lines and 816 words, and every packet with one machine block and a SMART ROUTING section between 31 and 143 lines.

The spec counted five packets with machine blocks. The ledger counts all fourteen, because the call-sequence blocks in the other nine (`def discover_markdown_resources`, `def _guard_in_skill`) are machine lines under the canon. All fourteen are in scope.

## 4. Separation rationale

The full "`ROUTER.md` stays a separate document on purpose" paragraph appears in four hub `SKILL.md` files: sk-doc, cli-external-orchestration, system-deep-loop and sk-design.
