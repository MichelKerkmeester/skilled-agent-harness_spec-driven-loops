# 2026-09-27--manual-testing-playbook--directive-lifecycle-dedup-five-cli

> system-spec-kit · manual-testing-playbook · five CLI dispatches · directive-lifecycle-dedup

---

## 1. OVERVIEW

**Verdict: PASS**

Scenario 457 step 6 asks for one outcome per runtime with its verdict, reason and evidence path. The persistence wrapper that wrote these was retired (MTP-005), so the orchestrator recorded them by hand. These runs re-verified the scenario after two later phases changed advisor code, and raw evidence stays in the source packet.

---

## 2. RUN

| Field | Value |
|---|---|
| Target skill | system-spec-kit |
| Scenario | `ux-hooks-directive-lifecycle-dedup` (457) |
| Executed | 2026-09-27 |
| Runtimes | cli-pi, cli-opencode, cli-devin, cli-cursor, cli-codex |
| Outcome tally | 5 PASS |
| Source packet | `specs/system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/011-observation-fixes/evidence/goal-reverify/` |

---

## 3. OUTCOMES

| Runtime | Dispatch model | Verdict | Evidence | Bytes | SHA-256 |
|---|---|---|---|---|---|
| pi | llmgateway/mimo-v2.6-pro (high) | PASS | `specs/system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/011-observation-fixes/evidence/goal-reverify/reports/pi-457.md` | 4397 | `7064ff5935449bd1f0643022b97e0c8001bb03a76fdfd98b4aefabea931165fb` |
| | | | `specs/system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/011-observation-fixes/evidence/goal-reverify/runtime/pi-registered-adapter/summary.json` | 1201 | `65a60b0846c72fa188118962bf24d9d5d3b80f842b0a9df6323a6f58e91d624a` |
| opencode | llmgateway/mimo-v2.6-pro (high) | PASS | `specs/system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/011-observation-fixes/evidence/goal-reverify/reports/opencode-457.md` | 7260 | `951763c30b011ee3427718d496cd994ee251f42a9d53a58c6aebacbfabdbc592` |
| | | | `specs/system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/011-observation-fixes/evidence/goal-reverify/runtime/opencode-registered-adapter/summary.json` | 1201 | `65a60b0846c72fa188118962bf24d9d5d3b80f842b0a9df6323a6f58e91d624a` |
| devin | swe-2-high | PASS | `specs/system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/011-observation-fixes/evidence/goal-reverify/reports/devin-457.md` | 4235 | `9d619d3b793458b24ccd3e792e8f4f99208d2c6e57058f027ffbbb76743b3380` |
| | | | `specs/system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/011-observation-fixes/evidence/goal-reverify/runtime/devin-registered-adapter/summary.json` | 1201 | `65a60b0846c72fa188118962bf24d9d5d3b80f842b0a9df6323a6f58e91d624a` |
| cursor | grok-4.7-high | PASS | `specs/system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/011-observation-fixes/evidence/goal-reverify/reports/cursor-457.md` | 2204 | `bb097ef421534f6f32ffbebab94aea409c64a3d34e46d9e541d9fd2c16c0ec8a` |
| | | | `specs/system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/011-observation-fixes/evidence/goal-reverify/runtime/cursor-registered-adapter/summary.json` | 1201 | `65a60b0846c72fa188118962bf24d9d5d3b80f842b0a9df6323a6f58e91d624a` |
| codex | gpt-6-luna (high, fast) | PASS | `specs/system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/011-observation-fixes/evidence/goal-reverify/reports/codex-457.md` | 1857 | `8bbb603b7d872cde5b8f70614d3dbd357f082b51ca605aa7106dc20fb9541cd4` |
| | | | `specs/system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/011-observation-fixes/evidence/goal-reverify/runtime/codex-registered-adapter/summary.json` | 1201 | `65a60b0846c72fa188118962bf24d9d5d3b80f842b0a9df6323a6f58e91d624a` |

Reason, the same for every runtime: Steps 2 to 5 exit 0. The advisor lifecycle files pass 129 tests and the spec-kit adapter files pass 30 under shuffle seed 18018. The Pi dispatch suite passes 50 of 50, and the registered-adapter cadence script writes summary.json with passed true for claude, codex, cursor and devin.

Every tester skipped step 1 because the orchestrator built both runtimes before the matrix. Each tester also left step 6 to the orchestrator, which wrote this record. Native-host delivery is a separate evidence class. The `Advisor:` line reached the Pi, OpenCode, Devin and Codex testers, and the Cursor tester saw none, which is Cursor's host limit while `beforeSubmitPrompt` stays dormant.

---

## 4. FILES

| File | Contents |
|---|---|
| [`outcomes/`](./outcomes/) | One outcome JSON per runtime, with the evidence byte counts and SHA-256 values |
| [`results.csv`](./results.csv) | One row per runtime |
| [`source.md`](./source.md) | Where the raw evidence for this run lives |
