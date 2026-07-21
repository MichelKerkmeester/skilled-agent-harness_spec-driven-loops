# cli-external-orchestration Manual-Testing-Playbook Routing Verification — playbook-verify-sonnet-20260721-152551

> Rendered from `report.json` (do not hand-edit).

## 1. RUN META

- **Hub**: `cli-external-orchestration`
- **Executor**: Claude Sonnet 5 (Claude Code agent), headless read-only sweep
- **Captured**: 2026-07-21T13:25:51Z
- **Repo mutations**: none — git status before and after this sweep shows only the 2 pre-existing, explicitly out-of-scope strays (`mcp-tooling/008-mcp-aside/001-research/research/research.md`, `system-deep-loop/032-deep-alignment-mode/013-review-remediation/decision-record.md`); this archive folder is the only addition
- **`DEFAULT_ON_HUBS`**: 7 hubs — sk-code, system-deep-loop, mcp-tooling, cli-external-orchestration, sk-prompt, sk-design, sk-doc (unchanged; verified live via `require('resolve.cjs').DEFAULT_ON_HUBS`)

### Method

Enumerated every file under `.opencode/skills/cli-external-orchestration/manual-testing-playbook/`: 8 scenario files (5 in `hub-routing/`, 1 in `compiled-routing/`, 2 in `plugins-and-hooks/`) plus the root `manual-testing-playbook.md` directory contract. For the 6 real workflowMode-routing scenarios, ran each scenario's exact documented prompt through two commands and diffed the routing decision:

- **COMPILED** (default-on, no flag override): `env -u SPECKIT_COMPILED_ROUTING node .opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs --hub cli-external-orchestration --prompt "<prompt>"`
- **LEGACY**: `node .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs --skill .opencode/skills/cli-external-orchestration --task "<same>"`

Compiled `targets[].workflowMode` was compared against legacy `intents` as the primary drift signal; legacy `resources`/`resourceContract` were cross-checked against each scenario's own `expected_resources`/`expected_leaf_resources` frontmatter; serving authority was confirmed genuinely compiled by the absence of `resolve.cjs`'s `{servingAuthority:'legacy',...}` fallback sentinel in every compiled output.

For the 2 `plugins-and-hooks/` scenarios (CE-P01, CE-P02) — which the hub's own root playbook explicitly marks *"Unscored... not part of the scored hub-routing corpus"*, with `expected_intent`/`expected_workflow_mode: UNKNOWN` and no parseable prompt (`load-playbook-scenarios.cjs` confirms `prompt:null`, `parseWarnings:["missing-exact-prompt"]`) — the routing-diff commands were still run with an empty prompt to reproduce the archived Lane C harness's own vacuous `defer`/`defer` row for these two IDs, and each scenario's own documented **functional** test recipe (its real pass criterion) was separately re-executed live, fresh, today.

### Frozen scorer SHA-256 (start == end)

| File | SHA-256 | Unchanged |
| --- | --- | --- |
| `load-playbook-scenarios.cjs` | `5029f22df920418eb0f87859a7146b83656619943a9fe6f010d6d06e96cdd029` | YES |
| `router-replay.cjs` | `d5e13daf3e99469c079e8037c988b31db4d27dfcf5045789d70dceb48de8af47` | YES |
| `score-skill-benchmark.cjs` | `d5a9cc72ec7cfcfb6484f0998f78e7ec16160ecdfee9e3c63f3215c72bf8780c` | YES |

Identical to the hashes cited in the same-day `sk-code/benchmark/compiled-routing/playbook-verify-sonnet-20260721-131257/report.md` run, confirming these cross-hub shared scripts are genuinely untouched.

---

## 2. SUMMARY

- **Total scenarios examined**: 8 (all files in the playbook directory tree)
- **PASS**: 8 (6 clean + CE-P01 full functional PASS + CE-P02 partial functional PASS)
- **FAIL**: 0
- **SKIP**: 0 (nothing was genuinely un-runnable headlessly; the 2 plugins-and-hooks scenarios ran via their applicable functional method instead of the routing-diff method)
- **Compiled-vs-legacy drift observed**: 0/8 (6 meaningful routing scenarios + 2 vacuous empty-prompt reproductions, all matching)

### Lane C cross-check

- **Archived source**: `.opencode/skills/sk-doc/benchmark/compiled-routing/r3-benchmark-sweep-20260721-131432/hub-reports/cli-external-orchestration.json` (committed `23ba6f5f32f`, captured same day ~1h50m before this sweep)
- **Archived figure**: `compiledRouting.scored=8, match=8, drift=0, subVerdict=compiled-serving` — Lane C parity **8/0**, covering exactly the same 8 scenario IDs this sweep enumerates (CE-P01, CE-P02, CE-003, CE-002, CE-H01, CE-H02, CE-001, CE-CR-001)
- **Corroboration**: **EXACT MATCH.** This sweep independently re-derived routing decisions by hand (direct `resolve.cjs`/`router-replay.cjs` invocations per scenario, not by re-invoking the Lane C harness itself) and found 8/8 agreement with the archived report's per-row `frontDoorOutcome`/`status`. 0 drift confirmed independently, via a fully separate execution path.
- **Verdict**: **CORROBORATED**

---

## 3. FULL SCENARIO TABLE

| ID | File | Prompt (abridged) | Expected | Compiled | Legacy | Verdict |
| --- | --- | --- | --- | --- | --- | --- |
| `CE-001` | `hub-routing/opencode-full-runtime-dispatch.md` | "Delegate this to OpenCode and run the ablation suite…" | `cli-opencode` (single) | route/single/cli-opencode | cli-opencode | **PASS** |
| `CE-002` | `hub-routing/claude-code-second-opinion.md` | "Get an Anthropic CLI second opinion…extended thinking…" | `cli-claude-code` (single) | route/single/cli-claude-code | cli-claude-code | **PASS** |
| `CE-003` | `hub-routing/ambiguous-defer.md` | "Dispatch this to a CLI executor." | `defer` | defer / [] | defer (no-mode-scored) | **PASS** |
| `CE-H01` | `hub-routing/holdout-external-runtime.md` | "Hand this whole task to a separate autonomous coding session…" (blind) | `cli-opencode` | route/single/cli-opencode | cli-opencode | **PASS** |
| `CE-H02` | `hub-routing/holdout-second-opinion.md` | "Get a second, deeply-reasoned opinion…different assistant model." (blind) | `cli-claude-code` | route/single/cli-claude-code | cli-claude-code | **PASS** |
| `CE-CR-001` | `compiled-routing/ordered-bundle-cli-transport-compiled-routing.md` | Identical prompt to CE-001 | `cli-opencode`, servingAuthority=compiled | route/single/cli-opencode | cli-opencode | **PASS**† |
| `CE-P01` | `plugins-and-hooks/cli-dispatch-audit-trail.md` | _(none — functional scenario)_ | UNKNOWN (N/A) | defer (vacuous, N/A) | defer (vacuous, N/A) | **PASS**‡ |
| `CE-P02` | `plugins-and-hooks/codex-hook-parity.md` | _(none — functional scenario)_ | UNKNOWN (N/A) | defer (vacuous, N/A) | defer (vacuous, N/A) | **PASS (partial)**‡ |

† See §4 CE-CR-001 finding (frontmatter `route_shape` vs observed `selectionKind`, non-blocking).
‡ See §5 — verdict driven by a fresh live functional re-run, not the routing-diff table above (which is N/A-by-design for these two).

---

## 4. PER-SCENARIO NOTES (6 routing scenarios)

### `CE-001` — verdict: **PASS**

Compiled `action:"route"`, `selectionKind:"single"`, target `workflowMode:"cli-opencode"`. Legacy `intents:["cli-opencode"]`, `matchedAliases:["opencode","spec kit memory"]`, `resources` match both `expected_resources` entries exactly. `defaultApplied:false` — this is a genuine signal match, not the router's default-mode fallback. Compiled==legacy.

### `CE-002` — verdict: **PASS**

Compiled `action:"route"`, `selectionKind:"single"`, target `workflowMode:"cli-claude-code"`. Legacy `matchedAliases:["anthropic cli second opinion","extended thinking"]` — a direct echo of the doc's described signal. Resources match both `expected_resources` entries exactly. Compiled==legacy.

### `CE-003` — verdict: **PASS**

Compiled `action:"defer"`, `selectionKind:null`, `targets:[]`. Legacy `workflowMode:null`, `deferReason:"no-mode-scored"`, `intents:[]`. Both engines defer with 0 matched aliases; `defaultApplied:false` on the legacy side confirms neither engine silently picked `cli-opencode` (the `tieBreak[0]` / would-be default) on this genuinely ambiguous "CLI executor" phrase — exactly the behavior CE-003's Success Criteria requires (`routerPolicy.defaultMode` is `null` in `hub-router.json`).

### `CE-H01` — verdict: **PASS**

Blind holdout — no literal "OpenCode" token in the prompt. Compiled/legacy both resolve `cli-opencode` via the `opencode-dispatch` vocabulary class alone (`matchedAliases:["full plugin and memory stack"]`, score 4, vs. CE-001's score-8 double alias+dispatch match). Confirms natural-language generalization holds identically under compiled routing.

### `CE-H02` — verdict: **PASS**

Blind holdout — no literal "Claude Code" token in the prompt. Compiled/legacy both resolve `cli-claude-code` via the `claude-dispatch` vocabulary class alone (`matchedAliases:["deeply-reasoned opinion"]`, score 4). Confirms natural-language generalization holds identically under compiled routing.

### `CE-CR-001` — verdict: **PASS** (with a non-blocking documentation finding)

Prompt is byte-identical to CE-001's. PASS per this scenario's **own explicit Pass/Fail Criteria** section, which tests only: (a) `servingAuthority: compiled` — confirmed, `resolve.cjs` returned a real route object rather than the `{servingAuthority:'legacy',...}` fallback sentinel; (b) compiled workflow-mode == legacy workflow-mode — confirmed, both `cli-opencode`.

**Finding (non-blocking):** the scenario's frontmatter declares `route_shape: orderedBundle`, but the live-observed `selectionKind` is `"single"` for this prompt (same as CE-001, which everyone agrees is single-mode). `orderedBundle` is a real, distinct `selectionKind` in this codebase — it fires when a prompt explicitly requests 2+ workflow modes at once (see the genuinely-multi-mode sibling scenarios in `mcp-tooling`'s `ordered-bundle-figma-refero-compiled-routing.md` and `system-deep-loop`'s `ordered-bundle-deep-mode-compiled-routing.md`). This scenario's prompt only ever names one executor (OpenCode), so it cannot and does not produce an `orderedBundle` selection. Reads as a copy-paste/labeling artifact inherited from the shared cross-hub compiled-routing scenario template, not a routing regression — the scenario's own Pass/Fail Criteria never references `route_shape` or `selectionKind` at all. Flagged for documentation hygiene; not actioned (read-only scope, no manifest/doc edits in this task).

---

## 5. CE-P01 / CE-P02 — FUNCTIONAL RE-VERIFICATION (not workflowMode routing)

Both scenarios are explicitly out of the hub's scored routing corpus (root playbook §2: *"Unscored, directly-run manual scenarios validating shared cli-external-orchestration plugin/hook infrastructure (not workflowMode routing)"*). Their `expected_intent`/`expected_workflow_mode` frontmatter is `UNKNOWN` by design, and `load-playbook-scenarios.cjs` confirms neither has a parseable prompt (`prompt:null`, `parseWarnings:["missing-exact-prompt"]`). Running the routing-diff commands with an empty prompt reproduces the archived Lane C harness's own row for both IDs exactly: compiled `action:"defer"`, legacy `deferReason:"no-mode-scored"` — a vacuous match, not a meaningful signal test. Their real pass criterion is each scenario's own documented live functional recipe, re-run fresh today:

### `CE-P01` (CLI Dispatch Audit Trail) — verdict: **PASS** (full re-run, 5/5 steps)

All against fresh `mktemp` scratch directories, never the real repo log path:

1. Core unit-test suite (`npx vitest run`, scoped to the canonical file): **38/38 PASS**.
2. Live Claude PostToolUse(Bash) hook adapter, stdin, with an embedded `--api-key` secret: exit 0; one JSONL line written; the secret fully replaced with `[REDACTED]`.
3. Live OpenCode plugin `tool.execute.after` hook, in-process, with an embedded `Authorization: Bearer` secret: invoked without throwing; one JSONL line written; the bearer token fully replaced with `[REDACTED]`.
4. Kill-switch (`MK_CLI_DISPATCH_AUDIT_DISABLED=1`) on a real dispatch-shaped payload: exit 0; no log file created.
5. Non-dispatch fast-exit (`git status` payload): exit 0; no log file created.

All 5 results match the doc's 2026-07-11 embedded evidence exactly. **Bonus corroboration**: the sibling PreToolUse preflight-lint hook fired live and unprompted in this very agent session against the literal `opencode run`/`claude -p` substrings embedded in the test payloads — the same live proof of the shared `DISPATCH_SHAPES` registry the doc's own evidence section documents.

### `CE-P02` (Codex Hook/Plugin Parity) — verdict: **PASS (partial)** (3/5 steps re-run)

Against `$HOME/.codex-hook-fixtures/` (a dedicated non-repo fixtures path, matching the doc's own recipe — not the real global `~/.codex/hooks.json`):

1. `spec-gate-enforce` deny path (open gate + `MK_SPEC_GATE_ENFORCE=1` + `apply_patch` on a non-exempt file): real `permissionDecision:"deny"` envelope, exit 0.
2. `spec-gate-enforce` fail-open (empty + malformed stdin): both exit 0, no output.
3. `spec-gate-classify` advisory (mutation-intent prompt): Gate-3 A-E `additionalContext` envelope emitted, exit 0.
4. `dispatch-audit` records a `codex exec -p` dispatch shape: one JSONL line, `runtime:"codex"`, `skill:"cli-codex"`.

All 4 checks (steps 1-3 of the doc's numbering, step 1 covering 2 assertions) match the doc's 2026-07-13 embedded evidence exactly, including exact JSON envelope shapes.

**Deliberately NOT re-run** (documented in the source scenario as its own steps 4-5, not re-executed here):

- **Live `codex exec`** (SessionStart/UserPromptSubmit/Stop chains + a real deny-block): spawns a real external CLI process (up to a 90s timeout) with no bearing on this task's routing-cutover scope.
- **Installer merge into `~/.codex/hooks.json`**: mutates a real, persistent, global user config file outside the repo.

Both are excluded under this task's HARD constraint (*"Read-only + archive only. No commit."*) — mutating a real global dotfile and spawning long-running external processes cross well outside a read-only verification pass. The doc's own dated, detailed live-run evidence for those two steps (SessionStart/UserPromptSubmit completing, the real `apply_patch` deny block, installer 14-added/idempotent-rerun/`notify.sh`-preserved) stands uncontested and was not independently re-verified today.

---

## 6. FINDINGS SUMMARY

1. **CE-CR-001 frontmatter/engine label mismatch** (non-blocking, documentation hygiene only): `route_shape: orderedBundle` vs. observed `selectionKind: single` for an identical single-executor prompt. Does not affect the scenario's own stated Pass/Fail Criteria (servingAuthority + workflow-mode agreement only). See §4.
2. **CE-P02 scope reduction** (deliberate, justified): 2 of 5 documented steps not re-run today (live `codex exec`, `~/.codex/hooks.json` installer) — both mutate state outside the repo/worktree, out of bounds for a read-only archive-only pass. See §5.

No routing regressions, no compiled-vs-legacy drift, no manifest/registry/SKILL.md changes made or needed.

---

## 7. SOURCE FILES

- Playbook root: `.opencode/skills/cli-external-orchestration/manual-testing-playbook/manual-testing-playbook.md`
- Scenario files: `hub-routing/{opencode-full-runtime-dispatch,claude-code-second-opinion,ambiguous-defer,holdout-external-runtime,holdout-second-opinion}.md`, `compiled-routing/ordered-bundle-cli-transport-compiled-routing.md`, `plugins-and-hooks/{cli-dispatch-audit-trail,codex-hook-parity}.md`
- Compiled engine: `.opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs`
- Legacy replay: `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs`
- Hub router policy: `.opencode/skills/cli-external-orchestration/hub-router.json`
- Lane C cross-check source: `.opencode/skills/sk-doc/benchmark/compiled-routing/r3-benchmark-sweep-20260721-131432/hub-reports/cli-external-orchestration.json`
- Sibling precedent (same method, sk-code hub): `.opencode/skills/sk-code/benchmark/compiled-routing/playbook-verify-sonnet-20260721-131257/report.md`
