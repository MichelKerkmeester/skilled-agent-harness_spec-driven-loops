# system-deep-loop Manual-Testing-Playbook Routing Verification — playbook-verify-sonnet-20260721-132746

> Rendered from `report.json` (do not hand-edit).

## 1. RUN META

- **Hub**: `system-deep-loop`
- **Executor**: Claude Sonnet (Claude Code agent), headless read-only sweep
- **Captured**: 2026-07-21 (see `report.json.generatedAt` for the precise UTC timestamp)
- **cwd**: `.worktrees/0089-sk-doc-default-routing-cutover` (as directed; no commit made)
- **Compiled command**: `env -u SPECKIT_COMPILED_ROUTING node .opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs --hub system-deep-loop --prompt "<user request>"`
- **Legacy command**: `node .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs --skill .opencode/skills/system-deep-loop --task "<same>"`
- **Comparison**: compiled `targets[0].workflowMode` (when `action==='route'`, else treated as no-route) vs legacy `intents[0]` (else none); `backendKind` cross-checked where the scenario doc states an expected backend (RB-001/002/003); guard scenarios (AI-003 bare wording, AI-004 plain code-edit) graded on both sides deferring; resources cross-checked against each scenario file's frontmatter `expected_resources`.

## 2. SCENARIO ENUMERATION NOTE (read this before the table)

The root `manual-testing-playbook.md` states "Total scenarios: 20" across 5 categories (`MO-001..005`, `IL-001..003`, `AI-001..004`, `RB-001..004`, `SC-001..004`). The `manual-testing-playbook/` directory tree actually contains a **21st** scenario file not listed in the root's Section 6/8 index: `compiled-routing/ordered-bundle-deep-mode-compiled-routing.md` (id `DL-CR-001`), which carries its own typed YAML frontmatter gold and Pass/Fail Criteria.

21 is not a coincidence: `013-compiled-coverage-buildout/handover.md` records the system-deep-loop Lane C parity figure as **`compiled-serving (21/0)`** (line 23, landed in `f9f639674b`). This sweep therefore enumerates and runs **all 21** scenario files found on disk under `manual-testing-playbook/`, so the count lines up exactly with that recorded parity figure (see §5).

**Total scenarios enumerated: 21** (20 catalogued + `DL-CR-001`).

## 3. RESULT SUMMARY

| Metric | Value |
| --- | --- |
| Total scenarios | 21 |
| PASS | 19 |
| FAIL | 1 |
| SKIP | 1 |
| Individual prompt checks run (multi-prompt scenarios expand) | 26 |
| Compiled vs legacy drift (across all 26 checks) | **0** |

## 4. SCENARIO VERDICT TABLE

Multi-prompt scenarios (`AI-001`, `AI-002`, `AI-003`) are expanded one row per sub-probe; the scenario's overall verdict is PASS only if every sub-probe passes.

| Scenario / sub-probe | Category | Expected | Compiled | Legacy | Verdict | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| MO-001 | mode-routing | research | research | research | PASS | resources match expected_resources |
| MO-002 | mode-routing | review | review | review | PASS | resources match expected_resources |
| MO-003 | mode-routing | ai-council | ai-council | ai-council | PASS | resources match expected_resources |
| MO-004 | mode-routing | research | research | research | PASS | resources match expected_resources (mode-hint override honored) |
| MO-005 | mode-routing | alignment | alignment | alignment | PASS | resources match expected_resources |
| IL-001 | improvement-lane-routing | agent-improvement | agent-improvement | agent-improvement | PASS | resources match expected_resources |
| IL-002 | improvement-lane-routing | model-benchmark | model-benchmark | model-benchmark | PASS | resources match expected_resources (command-bridge fired correctly) |
| IL-003 | improvement-lane-routing | skill-benchmark | skill-benchmark | skill-benchmark | PASS | resources match expected_resources (command-bridge fired correctly) |
| AI-001 / research | advisor-integration | research | research | research | PASS | |
| AI-001 / review | advisor-integration | review | **(defer)** | **(none)** | **FAIL** | see §6 finding — both sides agree (0 drift), not a compiled regression |
| AI-001 / ai-council | advisor-integration | ai-council | ai-council | ai-council | PASS | |
| AI-001 / agent-improvement | advisor-integration | agent-improvement | agent-improvement | agent-improvement | PASS | |
| AI-002 / deep-research: | advisor-integration | research | research | research | PASS | |
| AI-002 / deep-review: | advisor-integration | review | review | review | PASS | |
| AI-002 / deep-ai-council: | advisor-integration | ai-council | ai-council | ai-council | PASS | |
| AI-003 / bare model-benchmark | advisor-integration | (no fire) | defer | (none) | PASS | command-bridge guard holds; positive half covered by IL-002 |
| AI-003 / bare skill-benchmark | advisor-integration | (no fire) | defer | (none) | PASS | command-bridge guard holds; positive half covered by IL-003 |
| AI-004 | advisor-integration | (no fire) | defer | (none) | PASS | hub correctly stays inert on a plain code-edit prompt |
| RB-001 | runtime-and-backend | research / runtime-loop-type | research / runtime-loop-type | research / runtime-loop-type | PASS | |
| RB-002 | runtime-and-backend | ai-council / runtime-loop-type | ai-council / runtime-loop-type | ai-council / runtime-loop-type | PASS | |
| RB-003 | runtime-and-backend | agent-improvement / improvement-host | agent-improvement / improvement-host | agent-improvement / improvement-host | PASS | |
| RB-004 | runtime-and-backend | — | — | — | **SKIP** | retired placeholder, no prompt/contract in file — see §7 |
| SC-001 | state-and-convergence-discipline | review | review | review | PASS | |
| SC-002 | state-and-convergence-discipline | ai-council | ai-council | ai-council | PASS | |
| SC-003 | state-and-convergence-discipline | research | research | research | PASS | |
| SC-004 | state-and-convergence-discipline | review | review | review | PASS | |
| DL-CR-001 | compiled-routing (uncatalogued 21st) | research | research | research | PASS | resources match expected_resources |

## 5. LANE C PARITY CROSS-CHECK (21/0)

- **Recorded figure**: `system-deep-loop | compiled-serving (21/0) | f9f639674b` — `013-compiled-coverage-buildout/handover.md` line 23 (STATUS line 13 also cites `system-deep-loop 21`).
- **This sweep**: 21 scenario files enumerated on disk (matches 21). 26 individual prompt checks executed (multi-prompt scenarios expand). **0 of 26 show `compiled != legacy`** — full agreement on every single probe, including the one that fails against its own doc expectation (AI-001/review — both sides independently `defer`, so it is agreement, not drift).
- **Verdict: CORROBORATES the recorded 21/0 parity figure.** Compiled routing is byte-for-byte behaviorally identical to legacy routing across the entire live playbook corpus for this hub, re-confirmed independently by this manual sweep.

## 6. FAIL DETAIL

### AI-001 (Single Advisor Identity) — sub-probe "review"

- **Prompt**: `Run a deep review and report P0/P1/P2 findings with a verdict.`
- **Expected** (per `advisor-integration/single-advisor-identity.md`): resolves to `workflowMode: review`.
- **Observed — compiled**: `{"action":"defer","targets":[]}` (no route).
- **Observed — legacy**: `{"intents":[],"routeTelemetry":{"workflowMode":null,"deferReason":"no-mode-scored"}}` (no route).
- **Root cause (confirmed, read-only)**: `mode-registry.json`'s `review` mode alias list is exactly `["deep-review", "review loop", "iterative review loop", "severity weighted findings", "convergence review", "release-readiness", "deep-review wave"]`. This exact secondary-probe sentence contains none of those tokens — it has "deep review" as two separate words (not the hyphenated `deep-review` alias token), and no "loop"/"severity weighted"/"convergence"/"release-readiness" wording. Both routers therefore correctly (and identically) decline to score any mode for this literal wording.
- **Classification**: this is a scenario-fidelity gap in the playbook's own secondary-probe wording (or an alias-coverage gap in the registry) — **it is explicitly not a compiled-vs-legacy drift**, since both implementations agree exactly. Per the root playbook's own Verdict Rules ("PASS iff one public advisor identity is observed and all four resolved modes match the registry"), one of the four sub-probes fails to resolve at all, so the scenario is graded FAIL overall per the Feature Verdict Rules ("FAIL: any mapped scenario is FAIL"). The other 3/4 AI-001 sub-probes (research, ai-council, agent-improvement) pass cleanly.
- **Not touched**: this is a read-only finding; no registry, alias list, or scenario file was edited (out of scope / HARD constraint).

## 7. SKIP DETAIL

### RB-004 (Retired Backend Scenario)

- **File**: `runtime-and-backend/external-adapter.md`
- **Reason**: the file body is an explicit retirement placeholder — no "Exact prompt", no "Expected route", no Pass/Fail Criteria, no command sequence. Its own text: *"This placeholder remains only to keep the runtime-and-backend playbook directory stable; no execution contract or acceptance test remains for the retired backend."*
- **Genuinely un-runnable headlessly**: there is nothing to feed to either `resolve.cjs` or `router-replay.cjs` — the file documents a negative marker (no active mode ever used the retired `external-adapter` backend), not a live scenario.

## 8. GUARDRAIL VERIFICATION

### 8.1 Frozen scorer files (SHA-256 start == end)

| File | SHA-256 | Unchanged |
| --- | --- | --- |
| `deep-improvement/scripts/skill-benchmark/router-replay.cjs` | `d5e13daf3e99469c079e8037c988b31db4d27dfcf5045789d70dceb48de8af47` | yes |
| `deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs` | `d5a9cc72ec7cfcfb6484f0998f78e7ec16160ecdfee9e3c63f3215c72bf8780c` | yes |
| `deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs` | `5029f22df920418eb0f87859a7146b83656619943a9fe6f010d6d06e96cdd029` | yes |

All three hashes also match the prefixes recorded in `013-compiled-coverage-buildout/handover.md` (`d5e13da…`, `d5a9cc7…`, `5029f22…`). Computed identically before the first command and after the last command of this sweep — byte-for-byte unchanged throughout.

### 8.2 `DEFAULT_ON_HUBS` still 7

`.opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs` → `DEFAULT_ON_HUBS = new Set([sk-code, system-deep-loop, mcp-tooling, cli-external-orchestration, sk-prompt, sk-design, sk-doc])` — **7 hubs**, unchanged, `system-deep-loop` present. The spec-tree mirror copy (`.opencode/specs/.../015-routing-coverage-activation-verification/011-runtime-engine/lib/resolve.cjs`) is byte-identical (`diff` clean). Neither copy nor any manifest, `SKILL.md`, or `mode-registry.json` was edited by this sweep.

### 8.3 No routing/manifest/SKILL.md edits; strays untouched; no commit

- No edits made to `mode-registry.json`, any `hub-router.json`, any `SKILL.md`, or any activation manifest.
- The 2 named strays were confirmed pre-existing-dirty and left untouched by this sweep: `.opencode/specs/mcp-tooling/008-mcp-aside/001-research/research/research.md` and `.opencode/specs/system-deep-loop/032-deep-alignment-mode/013-review-remediation/decision-record.md`.
- `git status` also shows `.opencode/bin/compiled-routing-foundation.vitest.ts` and `.opencode/bin/tests/compiled-route-manifest.test.cjs` modified, and a `cli-external-orchestration/benchmark/compiled-routing/playbook-verify-sonnet-20260721-152551/` directory appeared mid-sweep. Neither is attributable to this sweep — this session made zero `Edit`/`Write` calls into the repository (only `Read` and read-only `Bash` — `node`, `shasum`, `grep`, `find`, `diff`, `mkdir -p` for the archive folder itself, plus the two named report files). The shared scratchpad's generically-named `report.json`/`report.md` and `scenarios.json`/`playbook-verify-results.json` were confirmed by content to belong to concurrent sibling agents running the identical exercise for `sk-code` and `sk-doc` respectively — this worktree is being used concurrently by multiple per-hub playbook-verify agents, which explains both the extra dirty files and the appearing sibling archive directory.
- **No commit was made.** This sweep is read-only plus one new archive folder (`report.json` + this `report.md`).

## 9. ARCHIVE PATH

`.opencode/skills/system-deep-loop/benchmark/compiled-routing/playbook-verify-sonnet-20260721-132746/report.{json,md}`
