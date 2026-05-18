---
title: "Cross-Phase Deep-Review Synthesis (008-template-levels, 8/8 phases)"
description: "Aggregate findings across the 8 phase children of 008-template-levels. Single CONDITIONAL verdict cluster, ~40 P1 + ~23 P2, no P0. Captures cross-phase themes, per-phase results, operational events (rate-limit, sandbox blockage, accidental deletion), and recommended remediation packets."
trigger_phrases:
  - "010 deep-review synthesis"
  - "010 cross-phase review"
  - "template-levels review report"
  - "010 P0 P1 P2 aggregate"
  - "010 review findings"
importance_tier: "high"
contextType: "review"
---

# Cross-Phase Deep-Review Synthesis — 008-template-levels

> Aggregate of `/spec_kit:deep-review:auto` runs (5 iterations per phase, IMPLEMENTATION-focused) across all 8 phase children of `026-graph-and-context-optimization/008-template-levels`. Run on 2026-05-04. Companion to `before-after-template-system.md` (what the refactor did) and `memory-implications.md` (what indexers see) — this doc covers **what the deep-review found about the work itself**.

---

## 1. Headline

**Verdict cluster: 8/8 CONDITIONAL. No P0 across any phase.** The template-system rework shipped with no exploits, no auth bypass, no destructive data loss, no runtime corruption. Every blocking concern is a P1 quality / honesty gap, not a safety issue.

**Numerics**: P0 = 0, P1 ≈ 40, P2 ≈ 23+ across the eight phase reports.

**The five recurring themes (4.1) account for ~75% of the P1 findings.** The remaining ~25% are phase-specific (largest cluster: phase 001's 16 P1s on spec-vs-impl manifest mismatches).

---

## 2. Per-Phase Results

| Phase | Executor | P0 | P1 | P2 | Verdict | Report |
|---|---|---:|---:|---:|---|---|
| 001 — template-consolidation-investigation | deepseek-v4-pro | 0 | 16 | ? | CONDITIONAL | `001/review/review-report.md` |
| 002 — template-greenfield-redesign | deepseek-v4-pro | 0 | 4 | 5 | CONDITIONAL | `002/review/review-report.md` |
| 003 — template-greenfield-impl | copilot/gpt-5.5 | 0 | 5 | 0 | CONDITIONAL | `003/review/review-report.md` |
| 004 — deferred-followups | deepseek-v4-pro | 0 | 2 | 10 | CONDITIONAL | `004/review/review-report.md` (JSONL malformed; report content fine) |
| 005 — skill-references-assets-alignment | copilot/gpt-5.5 (smoke) | 0 | 1 | 4 | CONDITIONAL | `005/review/review-report.md` |
| 006 — command-md-yaml-alignment | copilot/gpt-5.5 | 0 | 4 | 1 | CONDITIONAL | `006/review_archive/archived-mismatched-or-complete-2026-05-04T08-08-17-243Z/review-report.md` |
| 007 — fleet-marker-validation-sweep | copilot/gpt-5.5 | 0 | 4 | 1 | CONDITIONAL | `007/review/review-report.md` |
| 008 — z-archive-marker-validation-sweep | native opus 4.7 (single-pass) | 0 | 4 | 2 | CONDITIONAL — scaffoldOnly | `008/review/review-report.md` |

> **Note on 006 and 008.** 006's live `review/` is empty because the deep-review workflow self-archived its own output as "mismatched-or-complete"; the actual report lives under `review_archive/`. 008 had no automated dispatch produce artifacts (codex sandbox + Copilot quota + opencode/deepseek both failed), so the review was authored single-pass by native Opus 4.7 in the orchestrator session. Both reports are content-complete; the audit trail is non-standard.

---

## 3. Cross-Phase Themes (the five recurring P1 clusters)

Each theme appears in ≥3 phases. Fixing the root cause once retires the per-phase finding in every affected report.

### 3.1 Spec-vs-implementation manifest mismatch (001 + 002 + 003)

The original 001 spec described a template system built around `compose.sh`, `templates/core/`, `templates/addendum/`, materialized `templates/level_N/` outputs, and `wrap-all-templates.{ts,sh}`. **None of those files exist after the greenfield refactor.** The actual system uses `templates/manifest/` with `.tmpl` files, `spec-kit-docs.json`, an in-memory resolver (`level-contract-resolver.ts`), and an inline gate renderer (`inline-gate-renderer.ts`). 002 also flags that validators were never migrated to the manifest — only 1 of 23 has manifest integration, contradicting ADR-001's single-source-of-truth claim.

**Fix scope**: rewrite 001's spec to describe the actual landed architecture (or formally close 001 as "investigation-only, superseded by 002+003"); migrate the 6 legacy-dependent validators to `resolve_level_contract` from `template-utils.sh`.

### 3.2 Template-rendering correctness (001 + 003)

Multiple Level-3 templates have gate gaps and ANCHOR errors:
- `tasks.md.tmpl` and `implementation-summary.md.tmpl` have `level:1`, `level:2`, `level:3+` gates but **no `level:3` gate** → Level 3 renders identically to Level 1, missing `architecture-tasks` / `architecture-summary` ANCHORs.
- `spec.md.tmpl` L3/3+ blocks render without `<!-- ANCHOR:risk-matrix -->` and `<!-- ANCHOR:user-stories -->` wrappers that `spec-kit-docs.json` sectionGates declare → 7 ANCHOR pairs at L3 instead of 9.
- `spec.md.tmpl` has misplaced `<!-- /ANCHOR:questions -->` closing 127 lines late — wraps `approval-workflow`, `compliance-checkpoints`, `stakeholder-matrix`, and `change-log` ANCHOR blocks as nested children. `parseAnchoredSections()`'s first-match-closing strategy makes interior ANCHORs invisible.
- Phase-parent scaffold output via `create.sh:1123` still emits private manifest vocabulary into generated public spec text.

**Fix scope**: add the missing L3 gate, fix the misplaced anchor closer, add cross-validation between template ANCHORs and `spec-kit-docs.json` sectionGates (this is also flagged in 3.4 below).

### 3.3 Validator coverage gaps (001 + 003 + 004 + 005)

- `ANCHORS_VALID` derives its contract from template content only — never cross-references `spec-kit-docs.json` sectionGates, so the rendering gaps in 3.2 are structurally invisible to validation.
- Template `<!-- IF level:N -->` gate conditions are never validated against `sectionGates` level arrays. A template can restrict content below what the contract entitles without warning.
- Shell validators (`check-template-source.sh`, `check-template-headers.sh`, `check-sections.sh`) skip manifest-declared `lazyAddonDocs` (`handover.md`, `debug-delegation.md`, `research/research.md`), while the MCP TS validator includes them. Shell strict validation and MCP runtime validation report different sets of errors on the same packet.
- `SECTIONS_PRESENT` always passes without checking; misleading rule name (per 004 finding F010).
- Bash and Node `detectLevel` have divergent detection patterns (shell has 2 extra patterns).
- `validate.sh` lacks manifest integration entirely (P2 in 002, but cross-cutting).

**Fix scope**: cross-validate template ANCHORs vs sectionGates; sync shell ↔ Node `detectLevel`; either implement `SECTIONS_PRESENT` or rename to `SECTIONS_DELEGATED`; add manifest integration to `validate.sh`.

### 3.4 Cross-runtime mirror inconsistency (003 + 005 + 008)

- Path Convention drift: `.opencode/agents/deep-review.md` is canonical per the YAML workflow (`spec_kit_deep-review_auto.yaml:71-72`), but `.claude/agents/deep-review.md`, `.gemini/agents/deep-review.md`, `.codex/agents/deep-review.toml` all label themselves as canonical Path Convention reference paths.
- 003 found `@create` agent missed in the cross-runtime agent vocabulary cleanup (`.opencode/agents/create.md:141` still uses `## 2. CAPABILITY SCAN` while siblings use `ROUTING SCAN`); the resource map also omits `create.md` from the agent cleanup list.
- 005 found the deep-review iteration prompt pack at `prompt_pack_iteration.md.tmpl:18` points to `.agents/skills/sk-code-review/references/review_core.md` (non-existent) while `.opencode/agents/deep-review.md:273` uses the correct `.opencode/skills/sk-code-review/references/review_core.md`. CLI and native executor severity classification will diverge.
- 008's continuity frontmatter ships scaffold defaults — all sibling Level-3 scaffold packets share the all-zero fingerprint, breaking dedup.

**Fix scope**: reword mirror Path Convention sentences to label them as packaged mirrors; add `@create` to the cross-runtime cleanup ledger; fix the prompt-pack doctrine path; enforce non-zero fingerprints on scaffolds.

### 3.5 Workflow-invariance gating gap (003)

`workflow-invariance.vitest.ts:93` `collectDefaultSurfaces()` includes `.opencode/command`, `.opencode/agent`, and SKILL.md as default scan roots — but `isLegacyPhaseCleanupDebt` marks those same public roots allowed and `isAllowedHit` drops every non-extra hit before the final empty-hit assertion. The "default public surface" guardrail is effectively a no-op on the surfaces it claims to gate. The scaffold-golden-snapshot test renders `phase-parent.spec.md.tmpl` directly and normalizes legacy private-vocabulary strings before comparison, while `create.sh` renders that template AND injects `_scope_rows` containing child phase manifest into the public scaffold body — so the test passes the template snapshot even when generated phase-parent output violates T-123.

**Fix scope**: remove the broad public-root allowlist OR replace it with narrow documented exceptions; add a default-public-surface sentinel proving banned vocabulary fails inside `.opencode/agent` or `.opencode/commands/spec_kit`; add a golden test that executes `create.sh` phase-parent scaffolding and asserts no private vocabulary in rendered output.

---

## 4. Phase-Specific Findings That Don't Cluster

A small subset of P1s and P2s are isolated to single phases and don't share a root cause with the themes above:

- **001 P1-002-001**: `copy_templates_batch` silently returns success on renderer failure (bash `!` operator flips exit code → `if ! "$renderer" ...; then return $?` returns 0 when the renderer fails). Called at `create.sh:1527` where the `||` guard never triggers. **Same finding** also showed up in 004's F008 — actually this IS a recurring item; consider folding into a 6th theme.
- **001 P1-002-002**: `create_graph_metadata_file` JSON injection via unescaped user input (only double-quotes escaped; backslashes and newlines produce invalid `graph-metadata.json`).
- **002 P1-003**: `inline-gate-renderer` produces an unparseable token when a gate marker shares a line with content (no validation enforces one-gate-per-line).
- **004 F005**: Fence regex divergence between `stripFences()` (`mcp_server/lib/validation/orchestrator.ts:100`) and `renderInlineGates()` — literal vs hex backticks.
- **006 + 007**: Both packets ship scaffold-only docs (placeholder requirements, no acceptance contracts). 008 has the same problem (and is the most severe — three days stale, all-zero fingerprint, no progress).

---

## 5. Operational Events Worth Preserving in Memory

These are not findings about the code under review — they are facts about how the review itself ran. Useful for future maintainers planning a similar campaign.

| Event | Time (UTC) | Notes |
|---|---|---|
| Smoke-test on 005 (cli-copilot gpt-5.5) | 07:25–07:55 | 30 min wall-clock for 5 iterations. CLEAR-44/50 TIDD-EC dispatch prompt validated. |
| Batch A (003+006+007 parallel on cli-copilot) | 07:25–08:57 | ~92 min slowest. Concurrency cap = 3. 006 self-archived its review (`archived-mismatched-or-complete-...`) — root cause unknown, content intact. |
| **Copilot rate-limit hit** | 09:21 | After 7 dispatches (≈52 Premium Requests). Reset window 3h17m. cli-codex retry attempted; codex sandbox blocked OpenCode SQLite writes (workaround via `XDG_DATA_HOME=/private/tmp`), Copilot provider call also failed (`FailedToOpenSocket` to `api.githubcopilot.com`). |
| Switch to opencode + deepseek-v4-pro (with copilot fallback) | 10:54 | 4 phases in parallel. 002 produced full 5-iter+5-JSONL+9.7KB report. 004's JSONL got malformed at line 3 (deepseek wrote an invalid escape). 001 finished at iter 5 over 60 min. **008 retry produced zero artifacts**. |
| **Destructive event: 007 + 008 deleted from working tree** | ≈11:00–11:55 | The opencode + deepseek dispatches deleted 44 files across the two phases. Spec docs (spec.md/plan.md/tasks.md/checklist.md/decision-record.md/implementation-summary.md/description.json/graph-metadata.json) AND review/ subtrees both removed. Deep-review skill is contractually read-only on target spec docs; deepseek violated that contract. |
| Recovery via `git restore` | 11:56 | Both phases fully restored from commit `7beb80769` (today's earlier "bundled session sync" that captured Batch A's work). No findings lost. |
| 008 reviewed by native Opus 4.7 (single-pass) | 14:00 | After all CLI executors failed, native review identified 008 as scaffold-only and authored a 9.9 KB report mirroring sibling phase report format. |

**Lessons for next campaign:**
1. Copilot's per-account Premium-Request quota caps cumulative dispatches at ~7 over 3h. For 8-phase work, plan around the quota OR pre-warm a non-Copilot executor.
2. Codex with `--sandbox workspace-write` cannot run `opencode` as a subprocess (SQLite WAL on `~/.local/share/opencode/`). Codex needs `XDG_DATA_HOME` redirect, OR shouldn't be the wrapper for opencode invocations.
3. **Treat opencode + deepseek-v4-pro under `/spec_kit:deep-review:auto` as a destructive risk** until the scope-violation root cause is identified. The dispatch prompt explicitly forbade writes outside `__ABS_PATH__/review/`; deepseek deleted the entire `__ABS_PATH__` for two phases. Until investigated, prefer copilot/gpt-5.5 for any deep-review of multi-phase work, and commit work-in-progress between batches so recovery is single-command.
4. Native Opus single-pass review is a viable fallback for individual phase backfill when CLI executors are unavailable. It does not produce the YAML-loop artifacts (`iterations/`, `deep-review-state.jsonl`, deltas) but does produce a content-complete `review-report.md`.

---

## 6. Recommended Remediation Packets

Suggested next-step packets (each ~Level 1-2; not yet scoped or scaffolded):

| ID | Title | Theme | Phases retired |
|---|---|---|---|
| RM-1 | Migrate 6 legacy-dependent validators to `resolve_level_contract` | 3.1 + 3.3 | 002 P1-001/004, 004 partial |
| RM-2 | Add Level-3 gate to `tasks.md.tmpl` and `implementation-summary.md.tmpl` + fix misplaced `/ANCHOR:questions` in `spec.md.tmpl` | 3.2 | 001 P1-003-001..004, 003 partial |
| RM-3 | Cross-validate template ANCHORs vs `spec-kit-docs.json` sectionGates; sync shell ↔ Node `detectLevel`; rename or implement `SECTIONS_PRESENT` | 3.3 | 001 P1-004, 004 F010/F011, 005 P2-003 |
| RM-4 | Reword mirror Path Convention; add `@create` to cross-runtime cleanup ledger; fix prompt-pack `review_core.md` doctrine path | 3.4 | 003 DR-005, 005 P1-001, 008 P1-004 |
| RM-5 | Tighten workflow-invariance test (remove broad public-root allowlist; add default-public-surface sentinel; add `create.sh` phase-parent rendered-output golden test) | 3.5 | 003 DR-002, DR-003 |
| RM-6 | Fix `copy_templates_batch` exit-code masking bug + add JSON-injection guard in `create_graph_metadata_file` | (cross-cutting safety) | 001 P1-002-001/002, 004 F008 |
| RM-7 | Decide fate of 006/007/008 scaffold-only packets — populate, formally close, or remove from 010 phase manifest | scope-honesty | 006 F001-F004, 007 F001-F004, 008 P1-001/002 |
| RM-8 | Investigate root cause of opencode + deepseek-v4-pro destructive scope violation under `/spec_kit:deep-review:auto` | (operational) | (no phase finding; from §5) |

Recommended ordering: **RM-2 + RM-3** first (template+validator correctness, unblocks all subsequent renders), **RM-1 + RM-4** next (architectural alignment), **RM-5 + RM-6** as cleanup, **RM-7 + RM-8** as decisions.

---

## 7. Provenance & Methodology

- **Skill / command**: `/spec_kit:deep-review:auto` (`.opencode/skills/sk-deep-review/`, `.opencode/commands/spec_kit/deep-review.md`).
- **Iterations**: 5 per phase per skill contract (except 008: 1 native single-pass).
- **Review dimensions** (per dispatch prompt, biased toward implementation): `implementation-spec-alignment, code-correctness, template-rendering-correctness, validator-coverage, cross-runtime-mirror-consistency`.
- **Executors used**: cli-copilot (gpt-5.5, `--reasoning-effort high`) for 005/003/006/007; opencode-direct (gpt-go/deepseek-v4-pro) for 001/002/004; native Opus 4.7 single-pass for 008.
- **Review run**: 2026-05-04, 07:25–14:00 UTC (≈6.5 hr wall-clock; ~3 hr blocked on Copilot quota reset; ~30 min on recovery from destructive event).
- **Aggregate dispatch artifacts** preserved at `/tmp/dr-010-*.log` (per-phase stderr capture) — recommend archive to `008-template-levels/_review-logs/2026-05-04/` before /tmp cleanup.

---

## 8. Remediation Status (live, 2026-05-04)

User directive: "Work on all recommended fixes" — applied autonomously after the synthesis was authored. Findings were verified against the actual code before each fix; one false positive caught.

| ID | Status | Files | Notes |
|---|---|---|---|
| **RM-4a** | ✅ Applied | `sk-deep-review/assets/prompt_pack_iteration.md.tmpl:18` | Doctrine path corrected: `.agents/skills/sk-code-review/...` → `.opencode/skills/sk-code-review/...` (1-line fix) |
| **RM-4b** | ✅ Applied (×4 mirrors) | `.opencode/agents/create.md`, `.claude/agents/create.md`, `.gemini/agents/create.md`, `.codex/agents/create.toml` | `## 2. CAPABILITY SCAN` → `## 2. ROUTING SCAN` to align `@create` with the 8 sibling routing-scan agents (excluding `@code` and `@review` which use FAST PATH) |
| **RM-6a** | ✅ Applied | `system-spec-kit/scripts/lib/template-utils.sh:147` | Replaced `if ! "$renderer" ...; then return $?; fi` with explicit `local renderer_exit=0; ... \|\| renderer_exit=$?; if [[ $renderer_exit -ne 0 ]]; then return $renderer_exit; fi`. Bash `!` was inverting `$?`, causing renderer failures to surface as exit 0. |
| **RM-6b** | ✅ Applied | `system-spec-kit/scripts/spec/create.sh:413-417, 449` | JSON-escape pipeline added BEFORE the heredoc emits `causal_summary`: backslash → `\\`, quote → `\"`, newline → `\n`, CR → `\r`, tab → `\t`. Adversarial input (multi-line + `"` + `\` + tab) now produces valid JSON (verified via `python3 -m json.tool`). |
| **RM-2** | ⚠️ Partial — false positive caught | (no code change yet) | The "missing L3 gate in `tasks.md.tmpl` and `implementation-summary.md.tmpl`" finding is a HALLUCINATION — gates exist at line 217 of `tasks.md.tmpl` and line 275 of `implementation-summary.md.tmpl`. **Real RM-2 work remaining**: the misplaced `<!-- /ANCHOR:questions -->` at L3+ (closes at line 845 in `spec.md.tmpl`, wrapping 4 inner anchors as invisible nested children) AND the missing risk-matrix/user-stories ANCHOR wrappers at L3 (sections live inside the `:questions` blob). High-risk template restructure — deferred pending careful design (affects render output of all 868 packets). |
| **RM-1** | ⏭️ Deferred | (analysis only) | Deep-review claimed "1 of 23 validators" but actual `check-*.sh` count is **4** (not 23): 1 has manifest integration (`check-template-staleness.sh`), 3 don't (`check-completion.sh`, `check-placeholders.sh`, `check-smart-router.sh`). Of the 3 unmigrated, only `check-placeholders.sh` arguably benefits from manifest integration — it iterates over spec-folder `.md` files and could use `resolve_level_contract` to know the legitimate doc set. The other two solve different problems (`check-completion.sh` analyzes checklist items; `check-smart-router.sh` validates SKILL.md router blocks, not spec docs). Deep-review scope claim was inflated; real work is narrower. |
| **RM-3** | ⏭️ Deferred | (depends on RM-2) | Cross-validation logic between template ANCHORs and `spec-kit-docs.json` sectionGates can't land usefully until the ANCHOR structure under RM-2 is settled. Shell↔Node `detectLevel` sync and `SECTIONS_PRESENT` rename are independent and can be picked up separately. |
| **RM-5** | ⏭️ Deferred | (analysis only) | Deep-review's "remove the broad public-root allowlist" claim is over-aggressive: `.opencode/agents/context.md:75` legitimately uses "Capability" as ordinary English in `### Denied Capability Guard`. Removing the allowlist would cause false-positive failures on legitimate text. Real fix needs file-and-line-pair allowlist OR a regex that distinguishes "private taxonomy reference" from "ordinary English noun" — a test-design problem, not a 1-hour fix. |
| **RM-7** | ⏭️ Decision needed | (decision, no code) | 006/007/008 scaffold-only packets — recommendation: formally close 008 (no scope authored 3 days after creation, status=planned), populate 006 + 007 with their actual scope (per their own deep-review reports' F001-F004), or remove from 010's phase manifest. Operator-level decision, not implementation. |
| **RM-8** | ⏭️ Investigation needed | (investigation, no code) | Root cause of opencode + deepseek-v4-pro destructive scope violation under `/spec_kit:deep-review:auto`. Today's session deleted 44 files across 007+008 mid-run. Until investigated, **opencode + deepseek-v4-pro should be considered a destructive risk for the deep-review workflow**. Recommend pinning to copilot/gpt-5.5 with `--reasoning-effort high` until RM-8 lands a fix (or formal scope guardrails inside the YAML workflow). |

**Net result of this remediation pass:**
- 4 of 8 RMs landed (RM-4a, RM-4b, RM-6a, RM-6b) — all low-risk verified-real fixes applied with bash-syntax + adversarial-input verification
- 1 RM (RM-2) had a partial false positive caught; restructure deferred for safer follow-up
- 3 RMs (RM-1, RM-3, RM-5) need deeper analysis than the deep-review reports suggested — flagged with corrected scope
- 2 RMs (RM-7, RM-8) are not code changes — operator decision + investigation tasks

Files touched this pass: 7 (+15 / -8 lines).

**Lesson surfaced**: Deep-review findings need verification against the actual code before fix application. Out of 5 verified findings on the first pass, 1 was hallucinated (RM-2 L3 gate gap), 1 had inflated scope (RM-1 "23 validators"), 1 had over-aggressive recommendation (RM-5). The remaining 5 findings (RM-2 misplaced anchor, RM-2 missing wrappers, RM-4a, RM-4b, RM-6a, RM-6b) were real and actionable. Verification rate ~70%.

---

## 9. RELATED DOCUMENTS

- `before-after-template-system.md` — what the template-system refactor did (plain language).
- `memory-implications.md` — how the refactor affects the memory + indexing pipeline.
- `spec.md` (parent) — phase manifest and parent purpose.
- `001-template-level-consolidation-research/research/research.md` — original investigation that flagged the partial-consolidation path (later rejected; led to greenfield path).
- `002-manifest-driven-template-design/research/research.md` — greenfield design rationale, 5 ADRs, 14-iteration deep-research loop.
- `003-manifest-template-implementation-plan/resource-map.md` — implementation file ledger, ≈95 file references, ADR-005 workflow invariance.
- Per-phase review reports — see §2 table.
