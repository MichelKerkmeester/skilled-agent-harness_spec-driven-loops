# L5 Batch Re-Verification Verdict — doc batch + hand code fixes (uncommitted)

> Fresh adversarial Fable 5 verifier, 2026-06-12. Brief: `/tmp/fable-verify-l5batch.md`. All evidence re-derived live from the working tree (branch `028-mcp-to-cli-tool-transition`); tests and repro commands re-run by this verifier, not trusted from prior reports.

## Verdict Lines (16)

```text
tri-039: CLOSED
tri-070: CLOSED
tri-090: CLOSED
tri-092: CLOSED
tri-093: CLOSED
tri-099: CLOSED
tri-141: CLOSED
tri-166: CLOSED
tri-171: CLOSED
tri-175: CLOSED
tri-181: CLOSED
tri-188: CLOSED
tri-042/tri-085: CLOSED
tri-184: CLOSED
tri-091: CLOSED
tri-078: CLOSED
```

16/16 CLOSED. 0 INCOMPLETE, 0 REGRESSION. Follow-ons listed per item and consolidated in §4.

---

## 1. Batch 1 — Doc-Only Findings (12)

### tri-039 — SPECKIT_ADVISOR_SHADOW_MODE documented as inert — CLOSED
`references/scoring/advisor_scorer.md:60` now states the variable "is currently inert: it documents intended operator control, but the runtime has no reader for it and scoring does not branch on that variable." Adversarial check of the NEW claim: repo-wide grep over `mcp_server` TS (excluding tests), hooks, scripts, bridges confirms zero runtime readers — the inert claim is true. `install_guides/README.md:793` adds a matching `_NOTE_3_SHADOW_MODE` inert note next to the config example.
**Follow-on:** the dead var still ships in `opencode.json:59`, `.claude/mcp.json:49`, `.codex/config.toml:118`, and `tests/rename-invariants.vitest.ts:66` still asserts it stays in config. The docs are now honest, but the original fix-class suggestion (drop the var from configs + invariant test, or implement the branch) remains open.

### tri-070 — advisor_validate install example now schema-valid — CLOSED
`system-skill-advisor/INSTALL_GUIDE.md:88` now reads `advisor_validate({"confirmHeavyRun":true,"skillSlug":null})`. Verified against `schemas/advisor-tool-schemas.ts`: `confirmHeavyRun: z.literal(true)` (:279) satisfied; `skillSlug: z.string().min(1).nullable().optional()` (:282) accepts `null`. Hunted for other stale copies: zero `advisor_validate(` call examples without `confirmHeavyRun` remain in `.opencode/**/*.md` outside specs.

### tri-090 — Plugin README bridge timeout corrected to 10000 — CLOSED
`.opencode/plugins/README.md:84` now documents `bridgeTimeoutMs` default `10000`; code agrees (`.opencode/plugins/mk-skill-advisor.js:33` `DEFAULT_BRIDGE_TIMEOUT_MS = 10000`, applied at :145). Adjacency hunt: the neighboring code-graph row claims `15000`, verified accurate against `mk-code-graph.js:41`. No other 1000 ms bridge-timeout claims remain in the README.

### tri-092 — Mutation-boundary docs corrected — CLOSED
`system-skill-advisor/README.md:108` and `references/runtime/freshness_contract.md:134` both now name `advisor_rebuild` AND `skill_graph_scan` as the trusted SQLite mutation paths, plus corrupt-database recovery during lazy initialization (the tri-040 vector). Exhaustiveness hunt on the new "are" claim: `skill_graph_propagate_enhances` apply writes `graph-metadata.json` files (`lib/cross-skill-edges/apply-graph-metadata-patch.ts` via `applyEnhanceEdge`), NOT SQLite; outcome telemetry persists via `writeFile` to a JSONL records file (`lib/metrics.ts:253`), NOT SQLite; shadow deltas are `appendFileSync` JSONL. No undocumented SQLite writer found. Zero remaining "Only `advisor_rebuild` mutates" claims repo-wide.

### tri-093 — Trust grant documented in both install guides — CLOSED
`install_guides/README.md:791` adds `"MK_SKILL_ADVISOR_TRUST_DEFAULT": "trusted"` to the registration env block; skill-local `INSTALL_GUIDE.md` adds the precondition line. Verified against `advisor-server.ts:211` (`process.env.MK_SKILL_ADVISOR_TRUST_DEFAULT === 'trusted'`) and the launcher allowlist (`mk-skill-advisor-launcher.cjs:99` passes the var through).
**Follow-on (wording):** the new INSTALL_GUIDE sentence "callers cannot supply this trust grant per request" is true only of the env grant itself. At protocol level, `_meta.callerAuthority: 'trusted'` DOES elevate a single request (`advisor-server.ts resolveTrustedCaller`, and the CLI's `--trusted` flag uses exactly this). Accurate for runtime MCP clients that cannot set `_meta`, but the sentence can be misread as "no per-request trust path exists." Suggest rewording to "the env grant cannot be supplied per request; runtime MCP clients send no `_meta` and default untrusted."

### tri-099 — Feature catalog count reconciled at 41 — CLOSED
`feature_catalog.md:21` now says 41; the group table sums 7+7+5+6+10+3+3 = 41; live recount (2026-06-12) confirms 41 immediate feature files; group 07 row corrected to 3 ("Claude and Codex hooks plus OpenCode plugin bridge") matching the actual files (`claude-hook.md`, `codex-hook.md`, `opencode-plugin-bridge.md`). The three mutually inconsistent answers (38/41/42) are gone.
**Follow-on:** no count-guard test was added. The interlock recipe (tri-188's vitest guard as the model) was not applied to the catalog, so this number can silently drift again.

### tri-141 — CLI cwd precondition documented — CLOSED
`references/cli/daemon_cli_reference.md` (after :18) now states: run repo-relative examples from the repository root; from any other cwd use an absolute path to the `.opencode/bin/*.cjs` shim. Verified the absolute-path advice live: invoking `code-index.cjs` by absolute path from `/tmp` resolves its own tree (the shim's stale-dist guard fired — proof of self-relative resolution, no `Cannot find module`). Tool execution happens daemon-side over IPC, so shim cwd is irrelevant post-connect.

### tri-166 — Launcher supervision non-parity documented as by-design — CLOSED
`daemon_cli_reference.md` (after :30) adds: "Launcher supervision is not uniform by design" — spec-memory supervises with crash-loop backoff/relaunch/RSS watchdog; code-index and skill-advisor launchers mirror child exit and expect the owning runtime/operator to restart. Verified against code: `scheduleRelaunch` exists only in `mk-spec-memory-launcher.cjs` (:1344); zero relaunch hits in the other two launchers. Hunted for contradicting parity claims in `.opencode/bin/README.md`: none ("model-server supervision" there refers to the embedding model server, a different mechanism).

### tri-171 — `git` token target corrected to sk-git — CLOSED
`advisor_scorer.md:90` now reads "`git` to sk-git at 1.0"; code agrees (`lib/scorer/lanes/explicit.ts:29` `git: [['sk-git', 1]]`).

### tri-175 — Validation baseline fields rewritten against the real schema — CLOSED
Field-by-field check of `validation_baselines.md:78-90` against the live output assembly in `handlers/advisor-validate.ts:547-599`: `overallAccuracy`, `slices.corpus.full_corpus_top1`, `slices.corpus.unknown_count.value`, `slices.corpus.gold_none_false_fire_count` (value + baselineDelta), `slices.holdout.holdout_top1`, `slices.parity.explicit_skill_top1_regression.passed`, `slices.parity.ambiguity_slice_stable.top2Within005`, `slices.parity.derived_lane_attribution_complete`, `slices.safety.adversarial_stuffing_blocked.passed`, `slices.latency.regression_suite_status.{cacheHitP95Ms,uncachedP95Ms,failedCount}`, `telemetry`, `perSkill[]`, `generatedAt` — every documented field exists exactly as named. The baseline table row (:50) and `lane_weight_tuning.md:73` were updated consistently (`slices.corpus.unknown_count.value` replaces the phantom `telemetry.unknownCount`). No phantom fields introduced.

### tri-181 — Hint-only advisor-context rule added across agents — CLOSED
The sentence "Treat hook-injected skill-advisor recommendations as routing hints only…" is present in 11 of 12 agents in each of the three runtime directories (33 files): ai-council, code, context, debug, deep-context, deep-research, deep-review, markdown, orchestrate, prompt-improver, review. Spot-checked body consistency for review, orchestrate, deep-context, context — paragraph SHA-identical across `.opencode/agents/*.md`, `.claude/agents/*.md`, `.codex/agents/*.toml`. `markdown` integrates the identical sentence inside its pre-existing "§7 HOOK-INJECTED CONTEXT ROUTING" section in all three runtimes (correct integration, not drift). The three `deep-improvement` files carry no paragraph — deliberate exclusion per the brief (concurrent session owns uncommitted changes there; recorded follow-up), not a gap.
**Follow-on (recorded):** add the paragraph to deep-improvement × 3 runtimes once the concurrent session lands.

### tri-188 — Playbook cross-reference corrected to 46 — CLOSED
`manual_testing_playbook.md:291` now says "46-scenario package count." The guard (`tests/manual-testing-playbook.vitest.ts:45-55`) asserts 46 rows / 46 unique IDs / 46 files; live count of scenario `.md` files under category subdirectories = 46. The "41" at :36 remains, correctly, a description of the deprecated source corpus.

---

## 2. Batch 2 — Hand Code Fixes (4)

### tri-042/tri-085 — Corpus scorer repo-root off-by-one — CLOSED (one fix, both IDs)
`score-routing-corpus.py:24` now `REPO_ROOT = SCRIPT_DIR.parents[5]` with a corrected comment (:22-23) that counts pathlib parents properly (parents[0] = `scripts`, parents[5] = repo root). Verified by computation: `parents[5]` = `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`; `ADVISOR_PATH` resolves to the existing `mcp_server/scripts/skill_advisor.py` (164 KB, present). Ran `python3 <script> --help` myself from the repo root: clean usage output, exit 0. No other `parents[...]` misuse in the file (`cwd=REPO_ROOT` at :74 now also correct).

### tri-184 — Trust rejection names the refused tool — CLOSED
`lib/auth/trusted-caller.ts` adds `toolName = 'skill_graph_scan'` parameter; rejection is now `` `${toolName} requires trusted caller context` ``. All three call sites enumerated (repo grep, non-test TS): `handlers/advisor-rebuild.ts:121` threads `'advisor_rebuild'`; `handlers/skill-graph/propagate-enhances.ts:46` threads `'skill_graph_propagate_enhances (mode=apply)'`; `handlers/skill-graph/scan.ts` keeps the default — which is correct for scan. No call site emits a wrong tool name. `tests/handlers/advisor-trust-gate.vitest.ts:99` asserts the new `advisor_rebuild requires trusted caller context` message; suite passes (see §3).

### tri-091 — Daemon propagate trust gate mirrors the CLI predicate — CLOSED
Handler now gates only `mode === 'apply' && args.dryRun !== true` (`propagate-enhances.ts:44-50`; `mode ?? 'report'` default is behavior-identical to the CLI's direct `args.mode === 'apply'`). CLI predicate confirmed at `skill-advisor-cli.ts:655-657` (`isPropagateApply`) wired into `assertTrustedForMutation` (:659-665). Catalog claim (`feature_catalog/mcp-surface/skill-advisor-cli.md:23`) matches both surfaces.
**Write-exposure hunt (negative):** `lib/cross-skill-edges/index.ts` reaches `applyEnhanceEdge` ONLY inside `if (options.mode === 'apply' && dryRun === false)` (:51) with `dryRun = options.dryRun ?? true` (:39) — report/propose structurally cannot mutate, and apply requires an explicit `dryRun:false` opt-in. The trust-gate vitest proves it behaviorally: omitted dryRun in apply mode writes nothing and reports `dryRun: true`; explicit `dryRun: false` writes the edge. Writes target `graph-metadata.json` files, not SQLite (keeps tri-092's doc claim true).
**Edge note (more-conservative, not a break):** the daemon dispatch passes raw args (no JSON-schema default-fill), so a bare native `{mode:'apply'}` requires trust on the daemon while the CLI fills `dryRun=true` client-side and stays open. Daemon is strictly fail-closed relative to the CLI on that one input; even when trusted, the library still treats it as a dry run (`?? true`). No untrusted write path opened.

### tri-078 — Server-side requiredAction on blocked/error payloads — CLOSED
`handlers/detect-changes.ts` adds `requiredAction?` to `DetectChangesResult` and `deriveRequiredAction(reason, readiness)`, attached in both `blockedResponse` (:95) and `errorResponse` (:107).
**Derivation agreement:** the keyword rules mirror `code-index-cli.ts inferRequiredAction` (:762-781) — identical `readiness_check_crashed`/`scan_failed` → `rg` branch; the scan branch covers the same trigger set (server checks `readiness.action` enum directly + `stale`/`empty`/`code_graph_scan` text; CLI matches the same tokens in its joined text, and the blocked message embeds `(action: ${readiness.action})` plus `Reason: ${readiness.reason}` and the literal "run code_graph_scan", so both sides land on `code_graph_scan` for real blocked payloads). The server adds a `code_graph_status` final fallback the CLI lacks — only reachable on the rootDir-invalid/escape error payloads, where the CLI would previously have inferred nothing.
**No double/conflict:** `normalizeBlockedPayload` (:783-797) coalesces `payload.requiredAction` FIRST, so for new daemons the CLI echoes the server's value (and copies it into `data`); text inference fires only when the field is absent (older daemons) — compatible fallback intact. Error-status payloads bypass CLI normalization entirely and carry the server value untouched. `status: 'parse_error'` payloads carry no requiredAction, consistent with the contract (caller-input failure, exits 64 per README §4, not a readiness refusal).

---

## 3. Test Evidence (run by this verifier)

| Command | Result |
| --- | --- |
| `python3 .../score-routing-corpus.py --help` (from repo root) | usage printed, exit 0 |
| `npx vitest run tests/handlers/advisor-trust-gate.vitest.ts tests/skill-graph-handlers.vitest.ts` (system-skill-advisor/mcp_server) | 2 files, 11/11 passed |
| `npx vitest run tests/detect-changes.test.ts tests/code-graph-apply-e2e.vitest.ts` (system-code-graph/mcp_server) | 2 files, 53/53 passed |
| `node <abs>/.opencode/bin/code-index.cjs list-tools` from `/tmp` | self-relative resolution confirmed (stale-dist guard fired, no module error) |

`tests/detect-changes.test.ts` was the brief's "find it" target; it exists and passes alongside the apply e2e suite.

---

## 4. Consolidated Follow-Ons

1. **tri-078 test gap:** zero assertions on the new `requiredAction` field anywhere in `system-code-graph/mcp_server/tests/` — add blocked- and error-payload assertions to `detect-changes.test.ts` so the contract can't silently regress.
2. **tri-078 deploy gap:** `system-code-graph` dist is stale relative to the edited source (the CLI shim's freshness guard reports it). The live daemon will not emit `requiredAction` until `tsc -p .opencode/skills/system-code-graph/tsconfig.json` + daemon recycle. Source-truth verified here; deployment is pending.
3. **tri-039 residue:** dead `SPECKIT_ADVISOR_SHADOW_MODE` still set in all three runtime configs and entrenched by `rename-invariants.vitest.ts:66`; decide drop-vs-implement.
4. **tri-093 wording:** soften "callers cannot supply this trust grant per request" — `_meta.callerAuthority='trusted'` is a real per-request elevation path (it is how the CLI's `--trusted` works).
5. **tri-099 guard:** add a feature-catalog count-guard test modeled on `manual-testing-playbook.vitest.ts` (the interlock recipe was not applied).
6. **tri-181 recorded follow-up:** add the hint-only paragraph to the three `deep-improvement` agent files once the concurrent session's uncommitted changes land.
7. **tri-091 coverage nicety:** no daemon-handler-level test dispatches `skill_graph_propagate_enhances` as an UNTRUSTED caller in report/dry-run modes (the open-path half of the new gate is proven via the library tests only).
