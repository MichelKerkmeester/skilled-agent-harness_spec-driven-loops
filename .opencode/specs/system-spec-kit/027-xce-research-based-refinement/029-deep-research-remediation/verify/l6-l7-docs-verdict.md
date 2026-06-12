# L6+L7 Doc-Batch Adversarial Re-Verification — Verdict

> Fresh Fable 5 verifier, 2026-06-12. All evidence re-read from the current working tree (uncommitted seat edits); no banked line numbers trusted. Brief: `/tmp/fable-verify-l6l7docs.md`.

## Verdict Lines (15)

- tri-021: INCOMPLETE
- tri-046: CLOSED
- tri-047: CLOSED
- tri-069: CLOSED
- tri-071: CLOSED
- tri-120: CLOSED
- tri-128: CLOSED
- tri-183: CLOSED
- tri-023: INCOMPLETE
- tri-051: CLOSED
- tri-101 (doc-half): CLOSED — dead-code trim DEFERRED
- tri-112: INCOMPLETE
- tri-137: CLOSED
- tri-152 (doc-half): CLOSED — ops move DEFERRED
- tri-153: CLOSED

**Tally:** 12 CLOSED, 3 INCOMPLETE, 0 REGRESSION. Deferred halves recorded: tri-101 dead-plumbing trim, tri-152 physical artifact move.

---

## L6 Evidence

### tri-021 — handover template labels vs ladder parser — INCOMPLETE

The seat added the four labels, but in a format the parser cannot extract. Template writes colon-INSIDE-bold: `**Recent action:**` (`templates/manifest/handover.md.tmpl:43`), `**Blockers:**` (`:58`), `**Key files:**` (`:65`), `**Next safe action:**` (`:79`). The parser `extractLabeledValue` (`mcp_server/lib/resume/resume-ladder.ts:256-270`) matches only `**Label**:` (colon OUTSIDE bold, regex `\*\*${label}\*\*:`) or plain line-start `Label:`; the template's `- **Label:** value` lines match neither (the `- ` bullet defeats the `^Label:` branch). Reproduced with the exact regex: all four labels return `null` against the template text. The parser's own test fixtures confirm the expected convention is `**Recent action**:` (`mcp_server/tests/resume-ladder.vitest.ts:38,304,344`). Net effect: a template-authored handover still wins freshness selection with empty `recentAction`/`nextSafeAction`/`blockers`/`keyFiles` — the original defect is unchanged. Template anchor conventions are intact (7 open / 7 close ANCHOR pairs; no new headings). Residual fix is mechanical: move the colon outside the bold (`**Recent action**:`) on all four lines, or drop the leading `- ` and bold to use the plain `Label:` form.

### tri-046 — deep-loop save payload composition — CLOSED

All three YAMLs gained `step_compose_save_payload` ordered before `step_generate_context`: `deep_start-research-loop_auto.yaml:978`, `deep_start-review-loop_auto.yaml:1313`, `deep_start-context-loop_auto.yaml:693`. Contract check against the real loader: every example-payload key (`specFolder`, `sessionSummary`, `observations`, `recent_context`, `exchanges`, `toolCalls`) is in `KNOWN_RAW_INPUT_FIELDS` (`scripts/utils/input-normalizer.ts:1044-1071`); `specFolder` satisfies the only hard requirement in `validateInputData` (`:1093-1097`); string-array `observations`/`recent_context` are coerced (`coerceObservationEntries`/`coerceRecentContextEntries`, `:656-663`); `toolCalls`/`exchanges` are consumed (`:736`, `:816`). The session-scoped temp path passes `isLegacySharedSaveContextPath` (`scripts/core/save-context-path.ts:42-57` rejects only the exact basename `save-context-data.json`), and the "loader fails closed if the file is absent" requirement matches `EXPLICIT_DATA_FILE_LOAD_FAILED` (`scripts/loaders/data-loader.ts:126`).

### tri-047 — deep-review protocol rejected CLI mode — CLOSED

`skills/deep-review/references/protocol/loop_protocol.md:539-548` now composes a structured payload, invokes `generate-context.js --json '{...}' {spec_folder}`, and retires `memory/*.md` verification ("standalone `memory/*.md` files are retired and should not be created", `:548`). Argument form verified against the parser: `--json` mode reads the positional spec-folder override at `args[2]` (`scripts/memory/generate-context.ts:639-643`), and the inline payload also carries `specFolder`, so the command is doubly valid; the old direct-spec-folder rejection (`:708-714`) is no longer triggered. The claimed routed targets (`implementation-summary.md`, `decision-record.md`, `handover.md`) are all members of the canonical spec-document set (`mcp_server/handlers/memory-save.ts:3111`). `memory/*.md` retirement matches the exclusion at `mcp_server/lib/config/spec-doc-paths.ts:30`.

### tri-069 — plugin bridge README "non-functional" claim — CLOSED

The pre-repair "broken imports" table and "the bridge is non-functional" conclusion are gone; the README now describes the warm-only CLI/IPC route. Every new claim verified against `plugin_bridges/mk-code-graph-bridge.mjs`: default tool `code-graph-status` (`:237`), maintenance tools blocked prompt-time (`MAINTENANCE_TOOLS` set `:18-25`, skip at `:301-308`), warm probe before routing (`warmProbe` `:134-156`, gate at `:310-320`), runtime path through the committed shim `../../../../bin/code-index.cjs` + `bin/lib/launcher-ipc-bridge.cjs` (`:14-15`) with `--warm-only` (`:331`), statuses limited to `ok|skipped|fail_open` (`:29`), stale-dist fail_open (`:94-108`), timeout/exit-75 skipped-retryable (`:110-117`). The §5 validation example still passes `--minimal --spec-folder`, which the bridge still parses (`:246-255`). No new claim the code fails to satisfy ("bounded" payload is honored via the 1MB stdio cap at `:13,:79-82`).

### tri-071 — README fixed-order resume claims — CLOSED

Re-grep of `system-spec-kit/README.md` finds zero remaining "fixed order"/"handover.md first" phrasings. All six cited touchpoints now state the freshest-wins comparison: `:97`, `:454`, `:612`, `:635` (flow diagram), `:962` (troubleshooting row), `:1011` (FAQ), plus a consistent seventh at `:195`. Code agreement: `mcp_server/lib/resume/resume-ladder.ts:871-873` selects `continuitySignal.updatedAtMs > handoverSignal.updatedAtMs ? continuitySignal : handoverSignal` with the "fresher resume source" hint.

### tri-120 — session_resume trust model undocumented — CLOSED

New paragraph at `mcp_server/README.md:197` states the transport-bound model. Every clause verified: strict-mode mismatch rejection and permissive-mode log-and-continue (`handlers/session-resume.ts:537-543`), `MCP_SESSION_RESUME_AUTH_MODE=permissive` as the only switch (`:52`, default strict per `:8`), stdio's vacuous transport session ID accepted by design (`:532-536` comment), and no `resolveTrustedSession` import in session-resume.ts (grep: zero hits). The documented surface now matches the implemented auth model exactly.

### tri-128 — continuity-host contract overstatement — CLOSED

`references/validation/template_compliance_contract.md:263` now reads: maintained block in `implementation-summary.md`, `spec.md` fallback only when absent, resume reads the continuity tier from `implementation-summary.md`, do NOT add blocks to plan/tasks/checklist. Matches code on both ends: `resolveMetadataHostDocPath` (`mcp_server/handlers/memory-save.ts:1304-1311`) and the ladder's implementation-summary-only continuity read (`mcp_server/lib/resume/resume-ladder.ts:830-845`, "continuity tier unavailable" when missing). The dropped "or FRONTMATTER_VALID warns" threat was never real — `scripts/rules/check-frontmatter.sh` only flags unclosed YAML (`:51`), so following the new advice triggers no validator noise.

### tri-183 — skill_graph_scan without trusted context — CLOSED

All four cited guide locations now carry the trusted CLI form: `SET-UP - Skill Advisor.md:102-103` (MCP vs `node .opencode/bin/skill-advisor.cjs skill_graph_scan --trusted --format json`), `:150` (manual-edit re-index note), `:207` and `:211-212` (troubleshooting rows). Remaining `skill_graph_scan` mentions (`:36,:86,:115,:137,:213`) are tool-list/MCP-context references, not untrusted CLI instructions. Invocation form verified against `system-skill-advisor/mcp_server/skill-advisor-cli.ts`: underscore tool name accepted (usage `:729`), `requiresTrusted` gate (`:660-664`), `--trusted`/`MK_SKILL_ADVISOR_CLI_TRUSTED=1` (`:343`); `.opencode/bin/skill-advisor.cjs` shim exists.

---

## L7 Evidence

### tri-023 — union promotion prose retirement — INCOMPLETE

The parent-spec retirement itself is correct and code-accurate. `027-xce-research-based-refinement/004-semantic-trigger-fallback/spec.md` purpose (`:49`), promotion note (`:66`), and What-Needs-Done (`:87-91`) now state: union selected by `SPECKIT_SEMANTIC_TRIGGERS_MODE=union` env (matches `handlers/memory-triggers.ts:182-186`), union limited to weak lexical results (matches the `isLexicalStageWeak` gate, `:485-495` → `skipped_lexical_sufficient`), shadow observes any prompt without a strong lexical match (matches `:561`), and "promotion evidence is an operator rollout policy, not a runtime-enforced gate" (no evidence check exists on the union path). The re-tuning aspiration for the 768d Nomic profile is preserved as operator policy, not silently deleted.

The dangling-reference hunt fails it: the child packet still asserts the retired gate as fact — `004-tests-goldens-shadow-eval/spec.md:42` ("Status: Completed; union promotion blocked"), `:82` ("union mode must stay blocked until evidence passes"), `:127` (REQ-010 acceptance: "union blocked until FP, recall, latency, cost, rollback evidence pass"). And the parent's derived `graph-metadata.json:211` `causal_summary` still carries the OLD purpose prose verbatim ("promoted to union only on evidence", "runs only when lexical is empty/weak"), which re-circulates the retired claim through retrieval until a canonical save refreshes it. Residual: reword the three child-spec lines to the operator-policy framing and refresh the parent's derived metadata via a canonical save (do not hand-edit derived fields).

### tri-051 — shadow-feedback catalog/playbook drift — CLOSED

`feature_catalog/11--scoring-and-calibration/shadow-feedback-holdout-evaluation.md:18-30` no longer claims live weekly 20% replay; it now states clean-schema scheduled replay skips because raw query text is not durably stored, with library scoring available when an explicit replay pool exists. `manual_testing_playbook/11--scoring-and-calibration/shadow-feedback-speckit-shadow-feedback.md` flips the failure mode: clean-schema scheduled skip is now PASS (`:55`), empty-log-on-clean-schema is no longer FAIL, and FAIL is reserved for helper-replay failures, clean-schema throws, or live-rank mutation (`:56`). Code agreement: empty pool on missing `query_text` column (`lib/feedback/shadow-evaluation-runtime.ts:204-211`), cycle skip warn (`:423-427`), `runShadowEvaluation` helper exists (`lib/feedback/shadow-scoring.ts:601`), flag default TRUE graduated (`lib/search/search-flags.ts:529-533`).

### tri-101 — idempotency replay marker docs — CLOSED (doc-half); dead-code trim DEFERRED

`feature_catalog/02--mutation/memory-idempotency-receipts-and-near-duplicate-hints.md:27` now says "replay the stored response verbatim with no added replay marker"; the file-table rows for `idempotency-receipts.ts` and `response-builder.ts` were corrected to match. `manual_testing_playbook/19--feature-flag-reference/memory-idempotency-replay-and-conflict.md:20-22` (signals), `:48` (verbatim, "no `replayed:true` marker is added by the public replay path"), and `:56-59` (Pass/Fail — "replay adds a public marker" is now a FAIL condition) all validate verbatim replay. Code agreement: `handlers/memory-save.ts:3483-3485` returns `lookup.response` unmodified. **DEFERRED half (recorded, not lost):** the dead `replayed` plumbing remains — `handlers/save/types.ts:208` (`replayed?: boolean`) and `handlers/save/response-builder.ts:699-701` (would copy a flag nothing sets); both files untouched in this batch. The playbook's new FAIL-on-marker line is the guard against someone "fixing" the mismatch from the dead-plumbing side.

### tri-112 — FTS5 boot auto-heal docs — INCOMPLETE

Both contradictions from the finding are fixed: `mcp_server/README.md:261` now documents default auto-rebuild + re-verify with `SPECKIT_BOOT_FTS_AUTOHEAL=0` detect-only opt-out, and the root `README.md:922` self-contradiction ("remains detect-only" vs default-on auto-heal) is gone. Code agreement on the core: auto-heal default ON (`mcp_server/context-server.ts:382`), rebuild + integrity re-probe (`:385-388`), opt-out detect-only path (`:404-413`).

But the rewritten root sentence introduces one NEW claim the code does not satisfy: "the server rebuilds it, re-runs the integrity probe, and continues only if the rebuild verifies" (`README.md:922`). In code, a FAILED rebuild marks `bootFtsIntegrityHealth = 'corrupt'`, logs the DETECT-ONLY fallback banner, and the server CONTINUES serving degraded (`context-server.ts:390-403` — return, no refusal; only the whole-DB `quick_check` path refuses). The previous text correctly described degraded-continue; the new text moves that outcome exclusively to the opt-out mode. Residual: one-sentence fix, e.g. "…re-runs the integrity probe; if the rebuild also fails it logs corruption and continues in the same degraded detect-only state." (`mcp_server/README.md:261`'s "re-verifies before serving" is acceptable — the check is scheduled at boot, `context-server.ts:2229` + `:417-424`.)

### tri-137 — batch learned-feedback default — CLOSED

`feature_catalog/feature_catalog.md:3019` now reads "Default ON (graduated); set `SPECKIT_BATCH_LEARNED_FEEDBACK=false` to disable", consistent with the flag-reference table row at `:4933` (already `true`). Verified the default is real in the mechanism, not just the doc comment: `isBatchLearnedFeedbackEnabled` (`lib/search/search-flags.ts:603-607`) delegates to `isFeatureEnabled`, which treats unset/undefined as ENABLED and disables only on explicit `false`/`0` (`lib/cognitive/rollout-policy.ts:59-62`). Also consistent with `ENV_REFERENCE.md` and `references/config/environment_variables.md` per the batch file.

### tri-152 — database backups lifecycle docs — CLOSED (doc-half); ops move DEFERRED

`mcp_server/database/README.md:23` (responsibilities), `:31` (subdirectory paragraph with explicit root-level `.corrupt-*`/`.pre-repair-*` naming + "prune with the same verification and retention rules as backups"), `:78-79` (tree entries), `:108` (backups row scoped to "when manually moved there"), and `:111` (retention guidance: keep most recent recovery copy, delete stale ones after the live DB passes health checks) now describe where artifacts actually live. `database/backups/README.md:19` admits the runtime leaves artifacts in the parent root "even when this folder is empty", the naming table gains the two root-level patterns (`:39-40`), and the retention row (`:80`) covers `.pre-repair-*`/`.corrupt-*` wherever they live. Matches on-disk state re-verified today: 5 root artifacts (`context-index.sqlite.corrupt-20260606/-20260612/-20260612b`, `.pre-repair-20260611/-20260612`, ~2.1GB total) and `backups/` containing only its README. **DEFERRED half (recorded, not lost):** the physical move of those artifacts into `backups/` (or their pruning per the new rule) has not been performed — that is an ops action outside this doc batch.

### tri-153 — vector quarantine lifecycle docs — CLOSED

`mcp_server/database/vectors/README.md:23` replaces "get deleted… not an archive" with the quarantine reality plus a prune rule; the tree (`:69-71`) and a new Quarantine boundary row (`:128`) document `.quarantined-<stamp>-<pid>` triplets kept "only until recovery is confirmed and a healthy active shard exists". Code agreement: `build_vector_shard_quarantine_path` produces exactly `${shardPath}.quarantined-${stamp}-${process.pid}` (`lib/search/vector-index-store.ts:651-653`); `has_orphan_vector_shard_quarantine` (`:618`) retains them; the on-disk triplet (`…sqlite.quarantined-20260611T205438888Z-2628` + -shm/-wal) matches the documented pattern. The page's bonus schema corrections were adversarially verified and are accurate: `vec_<dim>` is a plain BLOB table (`:808-812`, `CREATE TABLE … vec BLOB NOT NULL`), and `vec_memories` is the sqlite-vec virtual-table surface when available (`:814-820`).

---

## Deferred Halves (must not be lost)

1. **tri-101 dead-code trim** — remove the never-set `replayed` plumbing: `mcp_server/handlers/save/types.ts:208` and `mcp_server/handlers/save/response-builder.ts:699-701`. Optional per the finding; untouched in this batch.
2. **tri-152 ops move** — physically relocate or prune the ~2.1GB root-level `.corrupt-*`/`.pre-repair-*` artifacts in `mcp_server/database/` per the newly documented retention rule (live DB has passed health checks per the repair runbook; the two 20260612 corrupt/pre-repair pairs and the 20260606 corrupt copy are candidates).

## Residual Work for the 3 INCOMPLETEs

- **tri-021**: fix the four label lines in `templates/manifest/handover.md.tmpl` to the parser-recognized `**Label**:` (colon outside bold) or line-start `Label:` form.
- **tri-023**: reword `004-tests-goldens-shadow-eval/spec.md:42,:82,:127` to the operator-policy framing; refresh the parent `graph-metadata.json` derived `causal_summary` via a canonical save.
- **tri-112**: correct the rebuild-failure clause in root `README.md:922` — the server continues degraded when the auto-heal rebuild fails; it does not refuse to serve.
