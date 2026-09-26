# 2026-09-26--manual-testing-playbook--directive-lifecycle-dedup-five-cli

> system-spec-kit · manual-testing-playbook · five CLI dispatches · directive-lifecycle-dedup

**Verdict: PASS**

Scenario 457 step 6 asks for one outcome per runtime with its verdict, reason and evidence path. The persistence wrapper that wrote these was retired (MTP-005), so the orchestrator recorded them by hand. Raw evidence stays in the source packet.

## Run

| Field | Value |
|---|---|
| Target skill | system-spec-kit |
| Scenario | `ux-hooks-directive-lifecycle-dedup` (457) |
| Executed | 2026-09-26 |
| Runtimes | cli-pi, cli-opencode, cli-devin, cli-cursor, cli-codex |
| Outcome tally | 5 PASS |
| Source packet | `specs/system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/009-test-findings-remediation/evidence/` |

## Outcomes

| Runtime | Dispatch model | Verdict | Evidence | Bytes | SHA-256 |
|---|---|---|---|---|---|
| pi | llmgateway/mimo-v2.6-pro (high) | PASS | `specs/system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/009-test-findings-remediation/evidence/reports/pi-457.md` | 4472 | `fb690385f1b79409870f7cac5f08099a33c497d3a291145add3ce3a61b381410` |
| | | | `specs/system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/009-test-findings-remediation/evidence/runtime/pi-registered-adapter/summary.json` | 1201 | `65a60b0846c72fa188118962bf24d9d5d3b80f842b0a9df6323a6f58e91d624a` |
| opencode | llmgateway/mimo-v2.6-pro (high) | PASS | `specs/system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/009-test-findings-remediation/evidence/reports/opencode-457.md` | 8610 | `d696948017c93a939b3a5398241a73873c78c05dbc3ac9b225724d699204eab3` |
| | | | `specs/system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/009-test-findings-remediation/evidence/runtime/opencode-registered-adapter/summary.json` | 1201 | `65a60b0846c72fa188118962bf24d9d5d3b80f842b0a9df6323a6f58e91d624a` |
| devin | swe-2-high | PASS | `specs/system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/009-test-findings-remediation/evidence/reports/devin-457.md` | 3762 | `683ae00d6df8c7286fe786f6e686628342169e9ff1084256a823e1f697ca9933` |
| | | | `specs/system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/009-test-findings-remediation/evidence/runtime/devin-registered-adapter/summary.json` | 1201 | `65a60b0846c72fa188118962bf24d9d5d3b80f842b0a9df6323a6f58e91d624a` |
| cursor | grok-4.7-high | PASS | `specs/system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/009-test-findings-remediation/evidence/reports/cursor-457.md` | 2462 | `3fb7c332ff092d4f8ff9b3816a18e247f76a9a3ed5221eff2ac1159e7572626a` |
| | | | `specs/system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/009-test-findings-remediation/evidence/runtime/cursor-registered-adapter/summary.json` | 1201 | `65a60b0846c72fa188118962bf24d9d5d3b80f842b0a9df6323a6f58e91d624a` |
| codex | gpt-6-luna (high) | PASS | `specs/system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/009-test-findings-remediation/evidence/reports/codex-457.md` | 1480 | `bb94d4cc68e7ee14a69c2358a71c04de71b3738283d39baf7c7bf687edb2d8d1` |
| | | | `specs/system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/009-test-findings-remediation/evidence/runtime/codex-registered-adapter/summary.json` | 1201 | `65a60b0846c72fa188118962bf24d9d5d3b80f842b0a9df6323a6f58e91d624a` |

Reason, the same for every runtime: Steps 2 to 5 exit 0: the advisor lifecycle files pass 128 tests and the spec-kit adapter files pass 29 under shuffle seed 18018, the Pi dispatch suite passes 50 of 50, and the registered-adapter harness writes summary.json with passed true for claude, codex, cursor and devin.

## Files

| File | Contents |
|---|---|
| [`outcomes/`](./outcomes/) | One outcome JSON per runtime, with the evidence byte counts and SHA-256 values |
| [`results.csv`](./results.csv) | One row per runtime |
