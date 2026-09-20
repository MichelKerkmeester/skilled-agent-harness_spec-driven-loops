---
title: "cli-jev Playbook Run: 2026-09-20 post-migration re-verification"
description: "All 22 cli-usage scenarios executed from the migrated hub home: the no-key half under an isolated credential store, the credential-gated half against the stored official key."
trigger_phrases:
  - "cli-jev post-migration re-verification"
  - "2026-09-20 cli-jev playbook re-run"
  - "jev live judgment run"
importance_tier: "normal"
contextType: "general"
version: 1.0.0.0
---

# cli-jev Playbook Run — 2026-09-20 post-migration re-verification

_Run for real from `.skilled/skills/cli-jev/cli-usage/` after the mode moved out of `cli-external-orchestration`; the raw captures and the scripts that produced them sit beside this file under `raw/`._

---

## 1. RUN IDENTITY

| Field | Value |
|---|---|
| Date | 2026-09-20 |
| Playbook | `cli-usage/manual-testing-playbook/manual-testing-playbook.md` (read from its new home) |
| Binary | `jev 0.6.2` (`/Users/michelkerkmeester/.local/bin/jev`) |
| No-key half | provider variables cleared **and** `XDG_CONFIG_HOME` pointed at an empty directory, because a stored key otherwise resolves ahead of the key check |
| Authenticated half | credential in the store (`jev auth status` → `stored`), no provider key variable set in the environment |
| Dispatch gates | `node .skilled/hooks/dispatch/claude/dispatch-preflight-lint.mjs` fed Claude-shaped tool calls over stdin |
| Executor | the orchestrator session that performed the migration, in one uninterrupted pass |

Commands as run:

```bash
bash raw/probe-matrix.sh      > raw/probe-matrix.txt        # 20 scenarios, no-key half
bash raw/probe-surface.sh     > raw/probe-surface.txt       # help surfaces, run payloads, MCP tool list
bash raw/auth-probe.sh        > raw/auth-probe.txt         # JEV-021 and JEV-022 in full
node --test .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs   > raw/rule-checks.txt
npx vitest run --exclude '**/quarantine/**' --exclude '.worktrees/**' \
  .skilled/hooks/dispatch/lib/dispatch-audit.test.mjs                   > raw/dispatch-audit-live.txt
bash raw/preflight-probe.sh   > raw/preflight-probe.txt     # one attempt per hard rule
bash raw/preflight-probe2.sh  > raw/preflight-probe2.txt    # rule boundaries and controls
```

---

## 2. VERDICT

**22 PASS, 0 FAIL, 0 SKIP.** Every scenario in the corpus ran from the new home. The two rows the
earlier unauthenticated pass had to record as SKIP are now passes with observed output, and no row
was inferred from the earlier reports.

| Scenario | Verdict | Evidence from this run |
|---|---|---|
| JEV-001 | PASS | `jev 0.6.2`, exit 0 (`probe-matrix.txt` → `version`) |
| JEV-002 | PASS | root help lists `auth, install-skills, noul, choice, score, run`, exit 0 |
| JEV-003 | PASS | judgment help lists `--value`, both provider and judgment help omit `--endpoint` |
| JEV-004 | PASS | exit 3, empty stdout, credential JSON on stderr (`auth-status-no-key`, `noul-no-key`) |
| JEV-005 | PASS | `cannot read state file`, exit 2 (`noul-at-file-missing`) |
| JEV-006 | PASS | `invalid JSON state`, exit 2 (`bad-json-state`) |
| JEV-007 | PASS | three usage blocks naming the missing flag, exit 2 (`missing-question`, `choice-missing-option`, `score-missing-level`) |
| JEV-008 | PASS | six valid choices listed, exit 2 (`unknown-subcommand`) |
| JEV-009 | PASS | exit 2 without an endpoint, exit 3 with one and no key (`custom-provider-*`) |
| JEV-010 | PASS | `API connection failed`, exit 4 (`negative-control-unreachable-endpoint`) |
| JEV-011 | PASS | sentinel search count `0` in the capture; the value-blind store-token check over every capture returns 0 hits |
| JEV-012 | PASS | exit 3 — the CLI accepts a single option and the request is reached (`choice-single-option-cli`) |
| JEV-013 | PASS | exit 3 — the CLI accepts a single level and the request is reached (`score-single-level-cli`) |
| JEV-014 | PASS | `invalid JEV_PROVIDER`, exit 2 (`unknown-provider-env`) |
| JEV-015 | PASS | exit 3 for `run -` and for `run - --value` |
| JEV-016 | PASS | `must be an object containing state and questions`, exit 2 |
| JEV-017 | PASS | live audit suite 75/75: `jev noul/choice/score/run` resolve to `cli-jev`; `--version`, `auth status`, `install-skills` resolve to `null` |
| JEV-018 | PASS | live audit suite: quoted, grepped, heredoc'd and logged forms resolve to `null`, and every shape resolves a `SKILL.md` that exists |
| JEV-019 | PASS | `node --test` 20 tests, 20 pass, 0 fail, exit 0 — including the bijection and fixture-pair guards |
| JEV-020 | PASS | handshake answered, four tools with the documented required sets (`mcp-tools-list`) |
| JEV-021 | PASS | `auth status` exit 0 with `ok`/`stored`/store path; `auth status --provider vercel` exit 3 with empty stdout; `auth test` exit 0 with `valid` and the model id; the no-key half exits 3 with the credential error |
| JEV-022 | PASS | one judgment per type, each exit 0 with empty stderr: `noul` printed `0.95`, `choice` returned `billing` with probabilities, `score` printed `2.0` as the zero-based position of the third level |

### 2.1 Dispatch gates, re-probed live

The migration repointed the audit row's packet path, so these gates are the surface whose behavior
the move changed. Before the repoint the hard rules were read from a path that no longer existed and
the lint failed open; now it decides.

| Probe | Decision |
|---|---|
| `jev run @request.json --value` | deny — `[jev-value-not-with-run]` |
| `jev noul … -s -` (no stdin close) | deny — `[jev-stdin-bounded]` |
| `jev noul … -s "quoted literal"` (no stdin close) | deny — `[jev-stdin-bounded]` |
| `jev run -` (no stdin close) | deny — `[jev-stdin-bounded]` |
| `jev choice … -o only=the only option` | deny — `[jev-choice-option-cardinality]` |
| `jev score … -l only` | deny — `[jev-score-level-cardinality]` |
| `jev noul … --provider custom` (no endpoint) | deny — `[jev-custom-endpoint-required]` |
| `TYPESAFE_API_KEY=… jev noul …` | advisory — `[jev-no-inline-credential]` |
| `jev-mcp` from a shell | advisory — `[jev-mcp-host-only]` |
| `jev noul … -s @state.txt`, `… -s - </dev/null`, `jev run @request.json`, `jev choice` with two options, `jev score` with two levels, `--provider custom --endpoint …` | approved |
| `echo "… run jev run @request.json --value later"`, `git status --short` | approved — a mention is not a dispatch |

Seven of the eight declared rule ids were observed deciding live. The eighth,
`command-v-jev-required`, is implemented as a runtime check on whether `jev` resolves on `PATH`
(`binaryOnPathCheck`), so it cannot fire on a machine where the binary resolves — which is the
satisfied state here.

---

## 3. RAW EVIDENCE

All under `raw/`, captured by this session and reproduced by the scripts named in §1:

| File | Holds |
|---|---|
| `probe-matrix.txt` | 21 labelled probes: command, exit status, stdout, stderr, plus the sentinel leak check |
| `probe-surface.txt` | 11 sections: subcommand help, three `run` payload forms, and the `jev-mcp` handshake with its tool list |
| `auth-probe.txt` | the credential-gated half plus the wrong-provider control |
| `rule-checks.txt` | the `node --test` run for JEV-019 |
| `dispatch-audit-live.txt` | the live audit suite for JEV-017 and JEV-018 |
| `preflight-probe.txt`, `preflight-probe2.txt` | the dispatch-gate decisions in §2.1 |
| `compare.py`, `compare-surface.py` | the comparison against the recorded baseline, normalizing only the scratch path |
| `leak-check.py` | the value-blind check that no captured stream carries a store token |

Reproducing on a machine with a stored key: run the no-key half with `XDG_CONFIG_HOME` pointed at an
empty directory, or every no-key row resolves the stored credential instead of the key check.

---

## 4. DELTA AGAINST BASELINE

| Row | Baseline (`2026-09-20-phase-004-unauthenticated-pass`, plus the authenticated verification) | This run |
|---|---|---|
| JEV-001 … JEV-020 | as recorded | identical — 21 probes and 11 surface sections compared field by field, 0 differences once the scratch path is normalized |
| JEV-021 | PASS for the unauthenticated half, PASS for the authenticated half | PASS, both halves re-observed in one run |
| JEV-022 | PASS after the operator supplied a key | PASS, re-observed |
| JEV-017, JEV-018 | PASS | PASS from the live file; the same suite also exists in a worktree copy and in a review quarantine copy under `specs/`, so a repo-wide invocation without those excludes reports failures that belong to the copies, not to the live hook |
| Dispatch gates | observed approving a violating `jev run @request.json --value` while the packet path was dangling (fail-open) | every probe in §2.1 decides; the violating form is denied |
| Key material | sentinel search count `0` | sentinel count `0`, and no captured stream shares a token with the credential store |

### Findings

1. **The no-key rows are only reproducible with the store pointed away.** With `official` in the
   store, `auth status` reports `stored` and a keyed judgment proceeds; the plan's recipe of
   clearing provider variables alone no longer reproduces the key-check exits. Both halves are
   therefore run in this report: isolated for the no-key rows, plain for the credential rows.
2. **The stdin rule is stricter than its declaration.** `jev-stdin-bounded` fires whenever the state
   is not in the *unquoted* inline form, so `-s "a literal"` is treated as unproven and demands a
   stdin close, although the declaration names only `-s -`, an omitted flag and `run -`. The
   predicate is deliberately conservative (a quoted value can hide the very forms the rule covers),
   and closing stdin is what the corpus does anyway — the playbook's own run commands carry
   `</dev/null` or a pipe into `jev`. Recorded here because two scenario files and one reference
   still show quoted-state commands without the redirect, and those commands are refused by the
   preflight lint even though the CLI never reads stdin for them.
3. **The transport baseline does not move.** Byte-identical no-key behavior after the move means the
   migration changed where the packet lives and which guard reads it, not the tool contract the
   playbook pins.
