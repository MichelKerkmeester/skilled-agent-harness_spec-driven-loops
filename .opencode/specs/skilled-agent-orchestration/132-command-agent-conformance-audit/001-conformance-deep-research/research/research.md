---
title: Command / Doctor / Agent Conformance Audit — Deep-Research Synthesis
description: Consolidated, deduplicated, severity-calibrated, surface-partitioned findings report synthesizing 15 deep-research iterations across three model batches (GPT-5.6-Sol-Fast, Sonnet-5, GLM-5.2).
trigger_phrases:
  - "command agent conformance audit synthesis"
  - "132 conformance research findings"
  - "doctor commands agents drift report"
importance_tier: high
contextType: research
version: 1.0.0.0
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/132-command-agent-conformance-audit/001-conformance-deep-research"
    last_updated_at: "2026-07-11T06:39:10Z"
    last_updated_by: "fable-5"
    recent_action: "Finalized the 30-finding research synthesis"
    next_safe_action: "Consume findings across phases 002-006"
    blockers: []
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/132-command-agent-conformance-audit/001-conformance-deep-research/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "conformance-audit-132"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Command / Doctor / Agent Conformance Audit — Research Synthesis

<!-- ANCHOR:evidence-index -->
**Evidence index:** primary sources for this synthesis, all under `research/` in this child folder — iteration narratives `iterations/iteration-001.md` through `iteration-015.md`, structured deltas `deltas/iter-001.jsonl` through `iter-015.jsonl`, the strategy seed `deep-research-strategy.md`, the iteration state log `deep-research-state.jsonl`, and per-iteration `dispatch-receipts/`.
<!-- /ANCHOR:evidence-index -->

**Surface audited:** every `.opencode/commands/**` command.md (42), workflow/route YAML (62), presentation `.txt` (35), and the deep compiled contracts; the whole `/doctor` subsystem (router `speckit.md`, `_routes.yaml`, per-target YAMLs, `mcp.md`, `update.md`, scripts); and all 12 agents mirrored across `.claude/agents/` + `.opencode/agents/`. READMEs are out of scope (phase 005).

**Model batches:** iters 1–5 = GPT-5.6-Sol-Fast (high); iters 6–10 = Sonnet-5 (xhigh); iters 11–15 = GLM-5.2 (max). Batch 3 (GLM) re-verified the P0 severities Sonnet raised and executed the read-only `/doctor` targets.

**Report status:** report-only. No fixes applied. All P0/P1/P2 findings below were re-verified present on disk as of the final iteration (2026-07-10).

---

## 1. Executive Summary

### Counts by severity

| Severity | Count |
|----------|-------|
| **P0** | 5 |
| **P1** | 9 |
| **P2** | 16 |
| **Total unique** | **30** |

### Counts by surface

| Surface | P0 | P1 | P2 | Total |
|---------|----|----|----|-------|
| Commands | 4 | 3 | 4 | 11 |
| Doctor | 0 | 1 | 5 | 6 |
| Agents | 0 | 4 | 5 | 9 |
| Cross-surface | 1 | 1 | 2 | 4 |
| **Total** | **5** | **9** | **16** | **30** |

### Headline systemic issues

The 30 findings collapse into four systemic root causes (a defect class spanning many files):

- **S1 — Singular-path-typo copy-paste propagation** (`CMD-02`). `runtime_agent_path_resolution.default: .opencode/agent` (singular; real dir is plural `.opencode/agents`) appears in **10** create-family YAMLs — one template error propagated by copy-paste, not 10 independent typos.
- **S2 — Build-artifact drift with no CI/pre-commit hook** (`CMD-05` + `XS-01` + `XS-03`). The compiled deep contracts and the compiled skill-graph are generated artifacts that silently drift from source because nothing regenerates them on source change. The skill-graph carries 9 ghost nodes + 1 SQLite zombie; the deep contracts are stale against their own recorded `sourceDigests`.
- **S3 — Retired-agent-reference cleanup incomplete across command families** (`CMD-01` + `CMD-03` + `CMD-04`). `speckit.md` and `write.md` agents were retired in the same commit (`dde19822df`) but references survive in the create family; the speckit family's undefined `[runtime_agent_path]` token is a structural variant of the same class. Agent retirement never triggered a mechanical grep-and-clean across all 62 workflow YAMLs.
- **S4 — Per-runtime agent frontmatter schema not distinguished or enforced** (`AGT-02` + `AGT-03` + `AGT-08` + `AGT-09`). `create-agent` emits only OpenCode's `permission:` schema and falsely calls Claude's `tools:` schema "deprecated"; Claude Code silently ignores `permission:`, so every Claude-targeted generated agent runs **unrestricted**. `validate_document.py` has no agent-frontmatter check to catch it.

### Corroboration overview

Cross-model corroboration was strong for the mechanical P0s. The four command P0s (`CMD-01`–`CMD-04`) and the two most-cited cross-surface findings (`XS-02` agent_router, `DR-01` skill-graph-freshness omission) were each found or confirmed across **all three model batches**. GLM batch-3's re-verification produced two deliberate **downgrades** (`DR-01` P0→P1, `AGT-01` P0→P1 — both are documentation/discoverability defects whose underlying routes/dispatch still work), which this synthesis honors. GLM also raised one **new P0** (`XS-01` skill-graph corruption) via actual execution of `/doctor skill-graph-freshness`, and the GLM deep-dive (iters 12–14) surfaced the S4 frontmatter-enforcement class that earlier batches only half-saw. Single-model findings (mostly GPT's batch-1 doctor mutation-honesty set and GLM's frontmatter set) are flagged as such and warrant a confirmation pass before remediation.

**Confirmed vs inferred:** every finding below is *confirmed* against cited file:line evidence drawn from the iteration narratives, except where explicitly marked *inferred*. Severity is a synthesis judgment; where a model batch disagreed on severity, the disagreement is stated in-line.

---

## 2. Methodology

- **Inputs:** all 15 iteration narratives (`iterations/iteration-001.md` … `iteration-015.md`, authoritative), the structured `deltas/iter-*.jsonl` severity/surface tags, and `deep-research-strategy.md`. The `deep-research-findings-registry.json` reducer registry was empty (findings live in the narratives), so extraction was narrative-driven and delta-cross-checked.
- **Deduplication:** the same defect was re-found across many iterations/models (e.g., the singular-path typo appears in GPT iter-4, Sonnet iter-7/10, GLM iter-11/15). Each defect is collapsed to one canonical finding, recording how many iterations/models corroborated it. Where a later iteration sharpened an earlier one's file:line precision or blast radius, the most complete evidence is cited and the superseded ids noted.
- **Severity calibration (conservative):** **P0** = breaks invocation/routing/execution for a real user OR corrupts persistent routing/index state. A misleading doc/table, stale shorthand, or a wrong-but-still-resolves reference is **P2**. GLM batch-3's re-verification verdicts are honored; where a batch labeled something P0 that fails the P0 bar under this rubric (notably build-artifact staleness that the runtime ignores), it is calibrated down with the disagreement stated explicitly.
- **Partition:** every finding is assigned to exactly one primary surface (commands / doctor / agents / cross-surface), with cross-surface flavor noted.
- **False-positive guard:** `codex` tokens in `deep-improvement.md` / `prompt-improver.md` / `orchestrate.md` denote the LIVE `.codex` runtime mirror + codex benchmark executor and are NOT stale; they are excluded from findings (see §5).

---

## 3. Findings by Surface

IDs are surface-prefixed and stable for downstream routing. Corroboration lists the iterations and the distinct model batches that found/confirmed each defect.

### 3.1 COMMANDS

#### [P0] CMD-01 — Speckit family's `[runtime_agent_path]` token has zero resolution definition anywhere in the repo
- **Surface:** commands (structural)
- **Affected:** `speckit_complete_auto.yaml:357,363,387`; `speckit_complete_confirm.yaml:330,336,360`; `speckit_implement_auto.yaml:252,267`; `speckit_implement_confirm.yaml:216,231`; `speckit_plan_auto.yaml:297`; `speckit_plan_confirm.yaml:303` (6 files, 12 interpolation sites). None of the 6 files defines a `runtime_agent_path_resolution:` block; no YAML include/anchor mechanism exists in this codebase; no `.ts/.js/.cjs/.mjs` resolver exists anywhere (full-tree grep). The bracket token is a dangling literal at runtime when a speckit workflow YAML is the only file loaded. The target agents themselves (`deep-research.md`, `review.md`, `debug.md`) are live — only the path token is broken.
- **Fix:** add `runtime_agent_path_resolution: { default: .opencode/agents, claude: .claude/agents }` to the top of all 6 speckit workflow YAMLs (use the corrected **plural** form; do not copy CMD-02's typo).
- **Corroboration:** iters 9, 11, 15 — models: Sonnet, GLM (2 of 3 batches). GLM re-verified `rg 'runtime_agent_path_resolution'` in the speckit family returns exit 1 (no matches).
- **Confidence:** High (confirmed; filesystem + full-tree resolver grep).

#### [P0] CMD-02 — `runtime_agent_path_resolution.default` is the nonexistent singular `.opencode/agent` in 10 create-family files (systemic S1)
- **Surface:** commands
- **Affected:** `create_agent_auto.yaml:45`, `create_agent_confirm.yaml:46`, `create_skill_auto.yaml:48`, `create_skill_confirm.yaml:48`, `create_readme_auto.yaml:83`, `create_readme_confirm.yaml:78`, `create_changelog_auto.yaml:44`, `create_feature_catalog_confirm.yaml:45`, `create_manual_testing_playbook_auto.yaml:45`, `create_manual_testing_playbook_confirm.yaml:45`. Real directory is `.opencode/agents` (plural). Feeds every downstream `[runtime_agent_path]/<name>.md` interpolation onto a nonexistent path on the non-Claude branch.
- **Fix:** change `default: .opencode/agent` → `default: .opencode/agents` in all 10 files. Longer-term: a lint rule / shared-include to stop single-source template propagation.
- **Corroboration:** iters 4, 7, 10, 11, 15 — models: GPT, Sonnet, GLM (all 3 batches). **Blast-radius disagreement:** GPT (iter 4) counted 12 files; iter 10 (Sonnet) counted 4; GLM (iter 11) did a fresh grep and confirmed **10** via direct read (iter 15 caught and corrected a ripgrep `[^s]` end-of-line false-negative that briefly made it look "fixed"). Treat **10** as the verified count.
- **Confidence:** High (confirmed by direct read; count reconciled).

#### [P0] CMD-03 — `create-agent` targets the retired `speckit.md` agent + carries `created_via_speckit` output residue (systemic S3)
- **Surface:** commands
- **Affected:** `create_agent_auto.yaml:301` and `create_agent_confirm.yaml:334` set `agent_availability.agent_file: "[runtime_agent_path]/speckit.md"`; git history (`git log --all -p -- '*/agents/speckit.md'`) confirms `speckit.md` was a real per-runtime agent retired across `.claude`/`.codex`/`.gemini` with no successor among the current 12 agents. Additionally `create_agent_auto.yaml:311-312` and `create_agent_confirm.yaml:344-345` carry `spec.md/plan.md: created_via_speckit` output keys naming the retired agent.
- **Fix (implementation-ready, per iter 14):** delete both `agent_availability` blocks (matching sibling `create_command_auto.yaml:287-300`, which routes spec/plan creation through distributed-governance prose with no `agent_file`); change `created_via_speckit` → `created_or_updated` at all 4 output sites; apply CMD-02 (plural path) first — the two share the `runtime_agent_path_resolution` block, which has 3 surviving live consumers (output dir, `agent_path_local`, `context.md`) and must NOT be removed. Resolved design question: direct system-spec-kit invocation, not a new typed handoff field.
- **Corroboration:** iters 5, 7, 10, 14, 15 — models: GPT, Sonnet, GLM (all 3 batches).
- **Confidence:** High (confirmed; git-history-verified retirement).

#### [P0] CMD-04 — Six create-family quality-gate steps target the retired `write` agent (systemic S3)
- **Surface:** commands
- **Affected:** `create_readme_confirm.yaml:587,1131`; `create_readme_auto.yaml:603,1055`; `create_agent_confirm.yaml:595`; `create_agent_auto.yaml:523` — all carry `agent_file: "[runtime_agent_path]/write.md"`. No `write.md` exists in either runtime directory; the activities below instruct `@markdown` and `markdown.md` exists in both inventories. Fields are non-blocking, so execution can silently skip the declared specialist while prose claims mandatory sk-doc validation. Same retirement era/commit (`dde19822df`) as `speckit.md`, never applied here.
- **Fix:** change all 6 `agent_file` values to `[runtime_agent_path]/markdown.md` (or direct skill invocation), matching the completed `write.md` remediation elsewhere.
- **Corroboration:** iters 5, 10, 11, 15 — models: GPT, Sonnet, GLM (all 3 batches).
- **Confidence:** High (confirmed).

#### [P1] CMD-05 — All three compiled deep contracts are stale against their own `sourceDigests`; `deep/ai-council`'s on-disk file also mismatches its own manifest row (systemic S2)
- **Surface:** commands (deep compiled contracts) / cross-surface (build tooling)
- **Affected:** `deep/assets/compiled/deep_research.contract.md`, `deep_review.contract.md`, `deep_ai-council.contract.md` (all dated Jul 8 23:44) + `manifest.jsonl`. Recomputing sha256 for each header-recorded source path against the working tree shows real mismatches for all three (`system-deep-loop/mode-registry.json`, `SKILL.md`, the three mode `SKILL.md`s, two ai-council reference docs); `git log` confirms genuine post-compile commits (`df87a69e2c`, `c2b6175356`, `c425653a1e`). Separately, `deep_ai-council.contract.md`'s on-disk sha256 does not match the `compiledContractSha256` in its own last manifest row — manifest and file have silently diverged. No CI/pre-commit hook re-runs `compile-command-contracts.cjs` on source change.
- **Fix:** re-run `compile-command-contracts.cjs` for all three commands; wire a `sourceDigests`-vs-working-tree check into CI/pre-commit; investigate the ai-council manifest/on-disk divergence (out-of-band regen bypassing `appendManifestRow`).
- **Corroboration:** iters 6, 10(as P0-D2), 11, 15 — models: Sonnet, GLM (2 batches).
- **Severity note / DISAGREEMENT:** Sonnet (iter 6) rated **P0**; GLM (iter 11/15) carried **P0** but explicitly did **not** re-hash (budget). Calibrated to **P1** here because (a) GPT iter-4 found the contract *bodies* byte-identical to a fresh compile, so runtime-consumed content is current, and (b) `render-command-contract.cjs` (the runtime-facing script) never consults `sourceDigests`, so dispatch never surfaces the staleness. The defect is provenance-metadata drift + a manifest inconsistency (build hygiene), not corrupted runtime output. Recommend a re-hash to confirm before final ranking.
- **Confidence:** High (defect confirmed via sha256 + git-log); Medium on the P1-vs-P0 call (GPT/Sonnet byte-current vs stale-digest tension is a genuine nuance, not a flat contradiction).

#### [P1] CMD-06 — Deep executor selectors contain a duplicated `cli-opencode` branch and malformed/erased executor text, propagated into all three compiled contracts
- **Surface:** commands (presentation `.txt` + compiled contracts)
- **Affected:** `deep_research_presentation.txt:91,133,151-155`; `deep_review_presentation.txt:116,160,190-194`; `deep_ai-council_presentation.txt:105,143-147`; propagated to `deep_research.contract.md:248`, `deep_review.contract.md:267`, `deep_ai-council.contract.md:368`. The executor enum reads `native | cli-opencode | cli-claude-code | cli-opencode` (duplicate); options B and D both resolve to `cli-opencode`; B contains malformed command text `` ` exec` ``; the executor-hint suppression text has an empty literal between `cli-opencode` and `gpt-5.4`. Interactive selection can map a user answer to an indistinguishable or malformed executor route. The compiler faithfully propagates the defect rather than detecting the duplicate enum.
- **Fix:** normalize research/review to `native | cli-opencode | cli-claude-code` and Council to `active-runtime | cli-opencode | cli-claude-code`; repair the Q-Exec labels/examples; regenerate all three contracts; add semantic validation (unique executor enums, non-empty command labels) to the compiler before rendering.
- **Corroboration:** iter 4 — models: GPT (1 batch). **Not re-verified by Sonnet/GLM** — warrants a confirmation pass.
- **Confidence:** High for the cited occurrences (direct read + byte-for-byte compiler comparison); Medium for runtime impact (fields are LLM-interpreted, not typed-loader-parsed). This is arguably P0 (interactive selection can hit an ambiguous/broken route) but is held at P1 pending cross-model confirmation.

#### [P1] CMD-07 — Five `/design` command routers reference the nonexistent slash command `/design:design-mcp-open-design`
- **Surface:** commands
- **Affected:** `design/interface.md:52`, `design/foundations.md:39`, `design/motion.md:39`, `design/audit.md:39`, `design/md-generator.md:39`. No `design/design-mcp-open-design.md` command exists; the transport is a nested `sk-design` mode reached through the skill, not a slash command. A user following the referral hits a command that does not resolve.
- **Fix:** replace the dead slash-command referral in all 5 files with routing language that loads `sk-design` (which routes to the nested `design-mcp-open-design` transport internally); do not present it as an independently dispatchable `/design:*` command.
- **Corroboration:** iters 1, 10, 15 — models: GPT, Sonnet, GLM (all 3 batches); recon seed #1 confirmed.
- **Confidence:** High (confirmed; scoped Glob returned no such command file).

#### [P2] CMD-08 — `cli-opencode` framed as a standalone top-level "skill" in 4 self-invocation-guard sites (+ 1 executor-note shorthand)
- **Surface:** commands (skill-identity) / cross-surface
- **Affected:** `deep_research_auto.yaml:1016`, `deep_research_confirm.yaml:765`, `deep_review_auto.yaml:1073`, `deep_review_confirm.yaml:840` all read "The cli-opencode skill SKILL.md §SELF-INVOCATION PROHIBITED contract…"; plus the iter-1 executor-note shorthand at `deep_research_auto.yaml:1010-1016`. The actual SKILL.md lives at `.opencode/skills/cli-external/cli-opencode/SKILL.md` — a nested mode under the `cli-external` hub, not a standalone skill.
- **Fix:** reword all sites to "the `cli-external/cli-opencode` mode's SKILL.md (`.opencode/skills/cli-external/cli-opencode/SKILL.md`)".
- **Corroboration:** iters 1, 4, 9, 10, 15 — models: GPT, Sonnet, GLM (all 3 batches); recon seed #4, expanded 1→4 sites at iter 9.
- **Severity note / DISAGREEMENT:** GPT (iter 1) rated **P2** (shorthand; execution not broken); Sonnet (iter 9) and GLM (iter 15) rated **P1** (load-bearing dispatch-safety guard). Calibrated to **P2** here because it is a wrong-but-still-resolves reference — the cited SKILL.md/contract genuinely exists and a reader can find it; nothing about invocation breaks. Elevate to P1 if the guard's identity-accuracy is treated as safety-critical.
- **Confidence:** High (confirmed at all 4 sites).

#### [P2] CMD-09 — `create_readme` workflow assets retain a dead `folder_readme.md` router and a copy-pasted `create_agent_verified` field
- **Surface:** commands (README-adjacent; sequence remediation with phase 005)
- **Affected:** `create/readme.md:7`, `create_readme_auto.yaml:37`, `create_readme_confirm.yaml:9,40`, `create_readme_presentation.txt:18-20`. Both README YAMLs say setup is determined by `folder_readme.md`, but the live router is `create/readme.md` (no `folder_readme.md` asset exists). The presentation stores `create_agent_verified = true`, a field belonging to the agent command, not README verification. Makes the field-level handoff contract internally false.
- **Fix:** replace `folder_readme.md` with `.opencode/commands/create/readme.md`; rename the verification field to `create_readme_verified` consistently.
- **Corroboration:** iter 4 — models: GPT (1 batch).
- **Confidence:** High (confirmed; defect lives in workflow YAML/presentation, in scope — not in the README.md itself).

#### [P2] CMD-10 — `/deep` command frontmatter under-declares flags its presentation parses
- **Surface:** commands
- **Affected:** `deep/research.md:3` omits `--spec-folder`, `--no-resource-map`, `--reasoning-effort`, `--service-tier`, `--executor-timeout`, per-lineage `--iters` (parsed at `deep_research_presentation.txt:87-101`); `deep/review.md:3` omits `--no-resource-map`, `--reasoning-effort`, `--service-tier`, `--executor-timeout`, `--iters`; `deep/ai-council.md:4` advertises no executor flags despite parsing `--executor-mode`, `--executor`, `--model`, `--reasoning-effort`, `--service-tier`, `--executor-timeout`. Command discovery disagrees with the rendered operational contract (runtime parsing may still accept the flags).
- **Fix:** generate/validate each command's `argument-hint` from the same typed flag inventory the presentation/compiler uses.
- **Corroboration:** iter 4 — models: GPT (1 batch).
- **Confidence:** High (confirmed occurrences); Medium on runtime impact (discovery-only).

#### [P2] CMD-11 — `/deep:review` advertises a nonexistent third runtime directory `.agents/`
- **Surface:** commands
- **Affected:** `deep_review_auto.yaml:317-326` and `deep_review_confirm.yaml:294-303` say agent targets must be discovered across `.claude/agents/`, `.opencode/agents/`, and `.agents/`; this repo has only the first two. The dead `.agents/` branch can produce a false missing-mirror expectation.
- **Fix:** remove `.agents/` from both runtime lists, or derive the list from the runtime capability inventory.
- **Corroboration:** iter 5 — models: GPT (1 batch).
- **Confidence:** High (confirmed).

### 3.2 DOCTOR

#### [P1] DR-01 — Doctor `speckit.md` "Workflow Assets" table AND presentation menu/valid-targets/subsystem table all omit `skill-graph-freshness`
- **Surface:** doctor
- **Affected:** `doctor/speckit.md` table (lines ~29-39, lists only 9 targets); `doctor/assets/doctor_speckit_presentation.txt` numbered startup menu (lines 8-40 / 30-41, options 1–10 map to only 9 targets), "Valid targets:" line (~79), and subsystem manifest table (96-105). The route is real: `_routes.yaml:171-184` defines `skill-graph-freshness` with `doctor_skill-graph-freshness.yaml` present on disk. Net effect: `/doctor skill-graph-freshness` works via direct argv (router reads `_routes.yaml`), but the interactive menu, `/doctor list`, and `/doctor ?` give a user no way to discover the target exists. `speckit.md:41` additionally asserts no workflow-asset gap exists, which is misleading.
- **Fix:** add `skill-graph-freshness` as menu/table/valid-targets row #9 (between `parent-skill` and `fable-mode`, matching `_routes.yaml` order) and generate/validate these displays from `_routes.yaml`.
- **Corroboration:** iters 1, 2, 6, 7, 10, 11, 15 — models: GPT, Sonnet, GLM (all 3 batches). Most-corroborated finding in the audit.
- **Severity note / DISAGREEMENT:** GPT (iter 1/2) rated **P2**; Sonnet (iter 6/7/10) escalated to **P0** (menu-unreachable); GLM (iter 11) re-verified and **downgraded to P1** because `/doctor skill-graph-freshness` executes flawlessly via direct invocation (exit 0, proven). Honored here as **P1** — high-priority discoverability fix, not a broken path.
- **Confidence:** High (confirmed; GLM proved the route works by executing it).

#### [P2] DR-02 — Four doctor routes classified `read-only` write packet-local artifacts
- **Surface:** doctor
- **Affected:** `_routes.yaml:27-32,60-65,76-84,100-105` label `memory`, `causal-graph`, `code-graph`, `deep-loop` as `read-only`, but their YAMLs write: `doctor_memory.yaml:202-225` (report + state log), `doctor_causal-graph.yaml:210-217` (state log), `doctor_code-graph.yaml:174-186` (diagnostic report), `doctor_deep-loop.yaml:227-235` (state log) — all under `<packet_scratch>`. Conflicts with the router contract that read-only routes report without a write path.
- **Fix:** either render results to stdout, or reclassify these routes as `add-only` with `gate3_location` set to the packet-scratch path, and align the YAML mutation boundaries.
- **Corroboration:** iter 2 — models: GPT (1 batch).
- **Severity note / DISAGREEMENT:** GPT rated **P1**; calibrated to **P2** — the writes are scoped to packet-scratch (explicitly safe under the doctor `add-only` contract), so this is a mutation-class mislabel, not state corruption or a broken path.
- **Confidence:** High (confirmed).

#### [P2] DR-03 — Doctor `memory` read-only route declares/grants the mutating `memory_index_scan` tool
- **Surface:** doctor
- **Affected:** `_routes.yaml:27-39` route-specific `mcp_tools` includes `mcp__mk_spec_memory__memory_index_scan`; `speckit.md:1-5` router frontmatter grants it globally; the diagnostic YAML (`doctor_memory.yaml:145-174`) only calls health/stats/drift and frames indexing as a recommendation. The mutating grant is an unused over-grant on a read-only route. It is actually used only on the standalone mutating `/doctor:update` (`doctor_update.yaml:399`).
- **Fix:** remove `memory_index_scan` from the memory route and `/doctor` router grant; retain it only on `/doctor:update`.
- **Corroboration:** iter 2 — models: GPT (1 batch).
- **Severity note / DISAGREEMENT:** GPT rated **P1**; calibrated to **P2** — a least-privilege over-grant that is never exercised on this route; no functional break.
- **Confidence:** High (confirmed).

#### [P2] DR-04 — `route-validate.py` does not validate route→script existence or mutation-class honesty
- **Surface:** doctor (tooling)
- **Affected:** `route-validate.py:6-16,181-212` verifies only that each YAML exists and that `mutating` is in the allowed enum. It does not resolve `script_invocations`, inspect `upstream_assets`, compare router/presentation target inventories, or detect writes inside `read-only` workflows — so it exits 0 while DR-01/DR-02/DR-03 persist. Its `G1` non-empty-`trigger_phrases` check is pure schema hygiene (see DR-05).
- **Fix:** extend the validator with per-route local-script existence checks, router/route/presentation target-set parity, and a read-only policy check that rejects packet/file/DB writes and mutating MCP tools unless the route is `add-only`/`mutates`.
- **Corroboration:** iter 2 — models: GPT (1 batch).
- **Severity note / DISAGREEMENT:** GPT rated **P1**; calibrated to **P2** — a tooling-coverage gap (it enables other defects to hide) but not itself a live break.
- **Confidence:** High (confirmed by reading the validator).

#### [P2] DR-05 — `_routes.yaml` header falsely claims advisor consumption of `trigger_phrases`; the field is dead wiring
- **Surface:** doctor / cross-surface (advisor)
- **Affected:** `_routes.yaml:1-24` header `# Consumed by: Skill Advisor lexical lane (per-target trigger_phrases)`. Both advisor harvesters — Python `skill_advisor.py:810-871` (`_DOC_HARVEST_SUBDIRS = ("references","assets")` rooted at `SKILLS_DIR`) and TS `doc-frontmatter.ts:23` — walk only `.opencode/skills/*/{references,assets}/*.md` frontmatter, gated by `SPECKIT_ADVISOR_DOC_TRIGGERS`. A `.yaml` under `.opencode/commands/doctor/` is doubly out of scope (wrong file type, wrong root). `git log --follow -p` shows the header has been wrong since commit `10b76891c2` (never true, not a regression). `route-validate.py` `G1` gives false confidence that populating the field does something. All 40 route trigger phrases are inert.
- **Fix:** rewrite the header to state the true scope (not currently harvested; `/doctor <target>` dispatch is presentation-menu/argv-driven); soften `G1`'s wording. Actually wiring a doctor-routes harvester is a separate, larger scope decision (there is no "doctor" skill node to recommend).
- **Corroboration:** iters 6, 8, 13, 15 — models: Sonnet, GLM (2 batches). Resolved definitively at iter 8 (both runtime implementations traced).
- **Severity note / DISAGREEMENT:** Sonnet rated **P1** ("affirmatively false, not merely stale"); calibrated to **P2** — a false/misleading doc claim; doctor dispatch works without it.
- **Confidence:** High (confirmed; code-path-traced in both Python and TS, git-history-confirmed).

#### [P2] DR-06 — `doctor_fable-mode.yaml` lacks the structured `mutation_boundaries` block used by all its sibling doctor routes
- **Surface:** doctor
- **Affected:** `doctor_fable-mode.yaml:20-24` uses only a prose `read_only_invariant:` string; the other 10 doctor route YAMLs declare a machine-checkable `mutation_boundaries:` block (`allowed_targets`/`forbidden_targets`/`invariant`), e.g. `doctor_embeddings.yaml:34-40`. Breaks the uniform shape any automated mutation-class auditor would parse.
- **Fix:** replace the prose `read_only_invariant:` with a `mutation_boundaries:` block matching the sibling schema, preserving the wording as the `invariant` value.
- **Corroboration:** iters 6, 10, 13, 15 — models: Sonnet, GLM (2 batches). iter 13 separately resolved that `mutation_boundaries` should NOT become cross-family (correctly doctor-specific) — so the fix is within-doctor uniformity only.
- **Severity note:** rated P2 (iter 6) → P1 (iter 10/15). Held at **P2** — cosmetic/schema uniformity; the prose invariant already carries equivalent semantic intent, no functional gap.
- **Confidence:** High (confirmed).

### 3.3 AGENTS

#### [P1] AGT-01 — `.claude/agents/deep-research.md:11` and `.claude/agents/markdown.md:11` Path Convention self-reference `.opencode/agents/*.md` instead of `.claude/agents/*.md`
- **Surface:** agents
- **Affected:** `.claude/agents/deep-research.md:11`, `.claude/agents/markdown.md:11`. Both instruct the Claude runtime to use `.opencode/agents/*.md`; the other 9 Claude agents carrying this line self-localize correctly (`.claude/agents/context.md:13` is a correct example). Shared `.opencode/skills/**` references are correctly left unchanged.
- **Fix:** change both lines to `.claude/agents/*.md`; add path localization to mirror-sync validation.
- **Corroboration:** iters 1, 3, 7, 10, 11, 15 — models: GPT, Sonnet, GLM (all 3 batches); recon seed #2, second instance (`markdown.md`) added at iter 3/7.
- **Severity note / DISAGREEMENT:** GPT (iter 1) P1, Sonnet (iter 7/10) escalated to **P0**, GLM (iter 11) re-verified and **downgraded to P1** — agents are dispatched by bare name (`@deep-research`), not by following this documentation line, so the agent's function works regardless. Honored as **P1**.
- **Confidence:** High (confirmed; diffed all 12 frontmatter-stripped pairs — only these two miswired).

#### [P1] AGT-02 — `.claude/agents/deep-improvement.md` uses the OpenCode `permission:` schema instead of Claude's `tools:` → runs unrestricted under Claude Code (systemic S4)
- **Surface:** agents
- **Affected:** `.claude/agents/deep-improvement.md:4-19` uses `mode: subagent`, `temperature: 0.2`, `permission:` nested object, with **no** `tools:` field. It is a verbatim copy of the OpenCode mirror. Under Claude Code, absence of `tools:` means the agent **inherits the parent session's full tool set** — the `permission:` denies (`webfetch`, `memory`, `chrome_devtools`, `task`, `patch`) are silently ignored. All other 11 Claude agents correctly use `tools:`.
- **Fix:** replace lines 4-19 with `tools: Read, Write, Edit, Bash, Grep, Glob` (mapping the allow-listed permissions; dropping the deny-listed ones).
- **Corroboration:** iters 12, 15 — models: GLM (1 batch, deep-dive). **Single-batch** but high-confidence (direct frontmatter read).
- **Confidence:** High (confirmed content); Medium on the runtime-enforcement claim (based on documented Claude Code subagent behavior — see AGT-03; would be confirmed by an actual restricted-tool test).

#### [P1] AGT-03 — `create-agent` emits only OpenCode `permission:` for both runtimes; Claude ignores it → every generated Claude agent is unrestricted (systemic S4, root cause of AGT-02)
- **Surface:** agents / cross-surface (authoring skill)
- **Affected:** `create-agent/SKILL.md:71-96` declares `permission:` as the sole canonical schema with no runtime branch; `create-agent/assets/agent_template.md:34` shows only `permission`/`mcpServers` with no `tools:`. Claude Code enforces `tools:` (comma-separated, supports MCP wildcards like `mcp__mk_spec_memory__*`); OpenCode enforces `permission:`. Any agent generated for `.claude/agents/` receives `permission:`, which Claude ignores, leaving it unrestricted.
- **Fix:** add a runtime-detection branch to `create-agent` — emit `tools:` for `.claude/agents/`, `permission:` for `.opencode/agents/`; document both schemas in the template table.
- **Corroboration:** iters 3, 12, 15 — models: GPT, GLM (2 batches). GPT (iter 3) flagged the "one-vs-eleven Claude frontmatter split" and the create-agent contradiction; GLM (iter 12) resolved which schema each runtime enforces.
- **Confidence:** High (confirmed authoring-doc content); Medium on the definitive Claude-enforcement semantics (documented behavior, not empirically tested here).

#### [P1] AGT-04 — Deep-research leaf agent allowlist forbids the workflow-required `research/deltas/iter-NNN.jsonl` artifact
- **Surface:** agents / cross-surface
- **Affected:** `.opencode/agents/deep-research.md:69-73` and `.claude/agents/deep-research.md:52-56` allow only the iteration narrative, state-log append, optional synthesis, and idea files — `research/deltas/iter-NNN.jsonl` is absent from the allowlist. The workflow prompt contract (`system-deep-loop/deep-research/assets/prompt_pack_iteration.md.tmpl:43-71`) independently requires the delta file as artifact 3 and declares the iteration invalid without it. A strictly-conforming leaf must either violate its own hard scope-lock or fail every 3-artifact dispatch.
- **Fix:** add the packet-local `research/deltas/iter-NNN.jsonl` write-once target to both deep-research agent allowlists and their pre-write path checks; keep registry/strategy/dashboard reducer-owned.
- **Corroboration:** iter 3 — models: GPT (1 batch).
- **Severity note:** held at **P1**. In practice the contradiction is masked because the command-owned dispatch explicitly requires the delta write (which is why these very iterations produced deltas), but the agent-scope allowlist is genuinely self-contradictory.
- **Confidence:** High (confirmed against both agent files and the workflow template).

#### [P2] AGT-05 — Six agent bodies reference an absent/empty `.codex/agents` mirror directory
- **Surface:** agents
- **Affected:** `.claude/agents/orchestrate.md:21`, `.claude/agents/deep-review.md:277`, `.claude/agents/prompt-improver.md:52`, `.opencode/agents/orchestrate.md:32`, `.opencode/agents/deep-review.md:294`, `.opencode/agents/prompt-improver.md:67` treat `.codex/agents` as a live profile/packaging surface; the directory currently has no files. NOTE: this is distinct from — and does not contradict — the legitimate `.codex` runtime/executor references the false-positive guard protects (see §5); iter 3 itself explicitly preserved those and flagged only the empty-mirror-directory references.
- **Fix (deferred design decision):** either generate/validate the `.codex/agents/*.toml` inventory, or remove the `.codex/agents` mirror claims until that surface exists. Blocked on the open design question "is `.codex/agents` intended to be restored as a generated mirror later?" (deferred at iter 15).
- **Corroboration:** iters 3, 10 — models: GPT, Sonnet (2 batches).
- **Severity note:** GPT/Sonnet rated **P1**; calibrated to **P2** — a forward-looking/latent gap (the `.codex` runtime references resolve; only the `agents/` subdir is empty) whose resolution is a design decision, not a current invocation break.
- **Confidence:** High (confirmed directory is empty).

#### [P2] AGT-06 — `ai-council.md` is the only agent (both runtimes) with no Path Convention self-reference line
- **Surface:** agents
- **Affected:** `ai-council.md` (both runtimes) — no "Path Convention" / canonical-runtime-path line; the other 11 agents state it. Not a broken reference, an inconsistency in body coverage.
- **Fix:** add a Path Convention line consistent with sibling phrasing (`.claude/agents/*.md` in the Claude mirror, `.opencode/agents/*.md` in the OpenCode mirror).
- **Corroboration:** iter 7 — models: Sonnet (1 batch).
- **Confidence:** High (confirmed by full 12-pair diff).

#### [P2] AGT-07 — `orchestrate.md` mirrors disagree on dual-runtime canonical-source provenance prose
- **Surface:** agents
- **Affected:** `.claude/agents/orchestrate.md:784` (anti-pattern table) carries an explicit "canonical source in `.opencode/agents/`" provenance clause; the OpenCode mirror's equivalent row (`.opencode/agents/orchestrate.md:809`) drops it. Minor prose asymmetry; the two mirrors no longer say the same thing about where the canonical source lives. (iter 3 confirmed the only intentional `orchestrate` localization delta is coherent, so this asymmetry is the residue worth flagging.)
- **Fix:** add the provenance clause to the OpenCode mirror or drop it from Claude for parity.
- **Corroboration:** iter 7 — models: Sonnet (1 batch).
- **Confidence:** High (confirmed).

#### [P2] AGT-08 — `create-agent/SKILL.md` falsely labels the Claude `tools:` schema as "deprecated"
- **Surface:** agents / cross-surface
- **Affected:** `create-agent/SKILL.md:105` ("do not use deprecated standalone `tools:` as the canonical model") and `:177` ("Never use deprecated standalone `tools:` frontmatter…"). `tools:` is not deprecated — it is the only schema Claude Code enforces. This is the doc-wording half of AGT-03's root cause.
- **Fix:** replace "deprecated" with "runtime-specific" in both locations; add the decision rule ("`tools:` for Claude agents, `permission:` for OpenCode agents; both canonical for their runtime").
- **Corroboration:** iter 12 — models: GLM (1 batch).
- **Confidence:** High (confirmed).

#### [P2] AGT-09 — `validate_document.py` has no agent-frontmatter schema enforcement
- **Surface:** agents / cross-surface (tooling)
- **Affected:** `validate_document.py` (838 lines) validates markdown structure only; zero frontmatter-schema checks for `--type agent` (no `permission`/`tools`/frontmatter schema-validation hits). Nothing catches an agent file using the wrong runtime's permission model — how AGT-02 went undetected.
- **Fix:** add a `--type agent` frontmatter pass — under `.claude/agents/` require non-empty `tools:` and warn on `permission:`; under `.opencode/agents/` require a `permission:` object and warn on `tools:`.
- **Corroboration:** iter 12 — models: GLM (1 batch).
- **Confidence:** High (confirmed by grep across the validator).

### 3.4 CROSS-SURFACE

#### [P0] XS-01 — Compiled skill-graph carries 9 ghost nodes + 2 family mismatches; SQLite carries the `cli-codex-retired` zombie; 12 hubs have null derived timestamps (systemic S2)
- **Surface:** cross-surface (advisor / skill-graph routing state)
- **Affected:** surfaced by executing `/doctor skill-graph-freshness` (iter 11): `skill-graph.json` (generated 2026-07-04, referenced at `system-skill-advisor/mcp_server/scripts/skill-graph.json`) carries 9 GHOST nodes from the pre-restructuring flat topology — `cli-claude-code`, `cli-opencode`, `deep-loop-runtime`, `deep-loop-workflows`, `mcp-chrome-devtools`, `mcp-click-up`, `mcp-figma`, `mcp-open-design`, `sk-prompt-models`; 2 FAMILY MISMATCHES (`sk-design` disk `sk-hub`/compiled `sk-code`; `sk-prompt` disk `sk-hub`/compiled `sk-util`); 1 SQLite ZOMBIE `cli-codex-retired`. Resolves the carried question (since iter 2): reindex alone does NOT purge these — source metadata changes are necessary but not sufficient; the generated artifacts must be regenerated.
- **Fix:** re-run skill-graph compilation to regenerate `skill-graph.json`; re-run `skill_graph_scan` to purge the SQLite zombie; wire both compilation pipelines into CI/pre-commit keyed on their source paths (shared with CMD-05, systemic S2).
- **Corroboration:** iters 2, 11, 15 — models: GPT, GLM (2 batches). GPT (iter 2) reported the same zombie/ghosts/family-mismatch via the freshness target and rated **P1**; GLM (iter 11) executed it directly and rated **P0**.
- **Severity note / DISAGREEMENT:** GPT **P1** vs GLM **P0**. Held at **P0** — this is corrupted persistent routing state (per the P0 "corrupts state" bar), and the family mismatches (sk-design compiled under the wrong hub family) pose a live advisor-routing-integrity risk. This is GLM's re-verification via actual execution, which is honored.
- **Confidence:** High (confirmed by direct target execution, exit 0 with enumerated output).

#### [P1] XS-02 — Root `agent_router.md` is coupled to an unrelated "Barter" workspace topology and carries non-current tool grants
- **Surface:** cross-surface (root command)
- **Affected:** `agent_router.md:93-98` hardcodes ancestor-directory detection for a workspace literally named "Barter" (`AI_Systems/Barter`) / requiring a `z — Global (Shared)/` ancestor; this is the `Public` workspace with skills under `.opencode/skills/` and agents under `.opencode/agents/` / `.claude/agents/`. Frontmatter also grants `WebSearch` and `AskUserQuestion`, not among current OpenCode command tool names. The command cannot discover this repo's skill/agent topology by default.
- **Fix:** remove the Barter-specific workspace-detection logic or generalize it to project-agnostic ancestor detection; rewrite as a thin current-runtime router using Skill Advisor + the checked-in runtime agent directories; replace non-current grants with supported tools (ties into the open router allowed-tool-overgrant question).
- **Corroboration:** iters 1, 10, 15 — models: GPT, Sonnet, GLM (all 3 batches).
- **Severity note:** all three batches rated **P1**; held there. Borders P0 (the router is effectively non-functional in this workspace) but is a legacy/template command not on a core path.
- **Confidence:** High (confirmed).

#### [P2] XS-03 — 12 hub skills have null `derived.generated_at` timestamps in their `graph-metadata.json`
- **Surface:** cross-surface (skill-graph metadata; related to XS-01/S2)
- **Affected:** `cli-external`, `mcp-code-mode`, `mcp-tooling`, `sk-code`, `sk-design`, `sk-doc`, `sk-git`, `sk-prompt`, `system-code-graph`, `system-deep-loop`, `system-skill-advisor`, `system-spec-kit` — all parent-hub skills whose derived metadata was never populated (flagged by `skill-graph-freshness`).
- **Fix:** run the metadata generation/backfill across all 12 hubs (bundle with the XS-01 skill-graph regeneration).
- **Corroboration:** iter 11 — models: GLM (1 batch).
- **Confidence:** High (confirmed by target execution).

#### [P2] XS-04 — Command validation lacks referential-integrity checks against current skill/agent inventories
- **Surface:** cross-surface (tooling)
- **Affected:** the repeated `speckit.md`, `write.md`, template, and `.agents/` dead references survived across paired auto/confirm assets because command contracts validate structure without proving referenced runtime agents / literal skill assets exist (representative: `create_agent_auto.yaml:301-309`, `create_readme_confirm.yaml:587`, `deep_review_auto.yaml:324`).
- **Fix:** extend command-contract validation to extract literal skill assets, runtime-agent filenames, and declared runtime directories; fail when a non-example reference has no live target; run over both auto and confirm variants.
- **Corroboration:** iter 5 — models: GPT (1 batch). Parallels DR-04 (doctor-specific validator gap).
- **Confidence:** High (confirmed by observing the surviving defects).

---

## 4. /doctor Health — Per-Target Execution Results

The read-only `/doctor` targets were **actually executed**, with exit codes, by GLM batch-3 (iter 11), and independently run descriptively by GPT batch-1 (iter 2). The iter-11 table is authoritative (it records exit codes); iter 2 corroborates.

| Target | Type | Exit | Result |
|--------|------|------|--------|
| `route-validate.sh` | validator | **0** | PASS — 10 routes validated, 3 informational flag-collision warnings; assertions A1–G1 pass |
| `memory` | MCP-backed (warm CLI) | **75** | Retryable — daemon not warm (documented exit 75, not a defect) |
| `embeddings` | MCP-backed (warm CLI) | **0** | Clean — ollama provider, idle |
| `causal-graph` | MCP-backed (warm CLI) | **75** | Retryable — daemon not warm (documented exit 75, not a defect) |
| `code-graph` | MCP-backed (warm CLI) | **0** | Clean — empty graph, freshness "empty" |
| `deep-loop` | script-only | **3** | Correct input validation — `sessionId required` when empty (not a defect; succeeds with a valid lineage session id) |
| `skill-budget` | script via advisor CLI | **0** | Clean — freshness "live", 19 skills (iter 2: budget overflow reported) |
| `parent-skill` | script-only | **0** | Clean — all checks pass for `sk-design`; 1 informational grandfathered "Mode 5-9 canon (FAIL)" folder-name asymmetry, non-blocking |
| `skill-graph-freshness` | script-only | **0** | Clean **exit**, but SURFACED finding XS-01 (9 ghost nodes + `cli-codex-retired` zombie + 2 family mismatches) |
| `fable-mode` | script-only | **0** | Clean — behavioral metrics emitted |

**Verdict: all 9 read-only doctor targets execute without error.** Exits 75 (`memory`, `causal-graph`) are the documented "daemon not warm, retryable" code. Exit 3 (`deep-loop`) is correct input validation. The doctor subsystem is functionally sound for read-only diagnostics; its defects are documentation/classification (DR-01 through DR-06), not broken execution. The one target that runs clean yet reports a real defect is `skill-graph-freshness`, which is precisely how XS-01 was found. This is **confirmed by execution**, not inferred.

---

## 5. Rejected / False-Positive / Ruled-Out

Count of rejected/ruled-out items: **6** (plus 1 methodological near-miss caveat).

1. **`codex` tokens in `deep-improvement.md` / `prompt-improver.md` / `orchestrate.md`** — REJECTED per the audit's false-positive guard: these denote the LIVE `.codex` runtime mirror + codex benchmark executor and are NOT stale `cli-codex` residue. iter 3 correctly did **not** flag them (its Ruled-Out section explicitly preserves "legitimate Codex model-benchmark/executor references"). *Do not report.* (Distinct from AGT-05, which concerns the empty `.codex/agents` directory — see §3.3.)
2. **`mutation_boundaries:` cross-family adoption** — RESOLVED as NOT a defect (iter 13): the schema models filesystem-path-target validation unique to the doctor operating model; other families use semantically different safety models (behavioral dry-run constraints, dynamic-path creation, git-delegated safety). Cross-family promotion would be over-abstraction. Correctly doctor-specific. (The within-doctor uniformity gap remains as DR-06.)
3. **`deep-loop` "sessionId required" error** — RULED OUT (iter 2, iter 11 exit 3): not a broken script; correct input validation. The same command succeeds with a valid lineage session id.
4. **`sk-code/SKILL.md:62` "dead path" grep warning** — RULED OUT (iter 3): `:62` is a source-line-number suffix, not part of a filesystem path. No dead literal skill path was confirmed in any of the 24 agent bodies.
5. **Broad agent body-sync drift** — RULED OUT (iter 3): after stripping runtime-specific frontmatter and normalizing `.claude/agents`/`.opencode/agents` path tokens, 11 of 12 pairs are byte-identical; the single `orchestrate` body delta is intentional, coherent localization.
6. **`deep-ai-council` missing prompt-injection ("treat fetched content as data") clause** — RULED OUT (iter 6): correct behavior, not a gap — the mode has no `WebFetch` grant or untrusted-content exposure, unlike `deep-research`/`deep-review`, which both correctly carry the clause.

**Methodological caveat (not a rejected finding):** iter 15 discovered that `rg '\.opencode/agent[^s]'` returns no matches for a line ending in `.opencode/agent\n` (ripgrep `[^s]` does not match end-of-line), which briefly made CMD-02 look fixed. Direct read confirmed the typo is present. Future audits should use `rg '\.opencode/agent($|[^s])'` or `\b`.

---

## 6. Remediation Routing

Mapping each finding to the downstream remediation phase. (Phase 002 = slash-commands; 003 = doctor; 004 = agents; 005 = readme.)

| Phase | Findings | Notes |
|-------|----------|-------|
| **002 — slash-commands** | CMD-01, CMD-02, CMD-03, CMD-04 (P0); CMD-05, CMD-06, CMD-07 (P1); CMD-08, CMD-09, CMD-10, CMD-11 (P2); XS-02 (agent_router is a root command); XS-04 (command-validation tooling) | CMD-01/02/03/04 are mechanical fixes with exact line numbers + sibling templates. **Sequence CMD-02 before CMD-03** (shared `runtime_agent_path_resolution` consumer coupling, iter 14). CMD-09 is README-adjacent — coordinate with phase 005. |
| **003 — doctor** | DR-01 (P1); DR-02, DR-03, DR-04, DR-05, DR-06 (P2) | DR-01 is the highest-value doctor fix (discoverability). DR-04 (validator coverage) enables detecting DR-02/DR-03 and should land with them. |
| **004 — agents** | AGT-01, AGT-02, AGT-03, AGT-04 (P1); AGT-05, AGT-06, AGT-07, AGT-08, AGT-09 (P2) | AGT-02/03/08/09 are the systemic S4 frontmatter cluster — fix `create-agent`'s per-runtime schema emission (AGT-03) first so it stops generating AGT-02-class bugs, then normalize existing Claude agents. AGT-05 is a deferred design decision (`.codex/agents`). |
| **005 — readme** | (README defects out of scope here) | CMD-09's remediation sequences with phase 005; the `install_guides/README.md` "Current Skills" catalog staleness (iter 10 P2-X1) is a README observation deferred here. |
| **Cross-cutting — build-artifact CI (systemic S2)** | CMD-05 (compiled deep contracts), XS-01 (skill-graph ghosts/zombie — P0), XS-03 (null hub timestamps) | Route to a single build-artifact task: re-run `compile-command-contracts.cjs` + skill-graph compilation + `skill_graph_scan`, then wire both pipelines into a CI/pre-commit hook keyed on their source paths. XS-01's skill-graph reindex is operator-gated. |

**Suggested execution order:** (1) systemic S2 build-artifact regeneration + CI-hook (unblocks XS-01/CMD-05 recurrence and the advisor-routing integrity); (2) phase 002 command P0s (CMD-01→CMD-04, mechanical); (3) phase 004 agent S4 cluster (AGT-03 root fix first); (4) phase 003 doctor doc/classification cleanup; (5) remaining P2s.

---

## 7. Deferred / README Observations

- **Deferred design decisions (not defects; route to design follow-ups, per iter 15 disposition):**
  - Router-level allowed-tool overgrant audit across the 62-YAML surface (carried since iter 5, never investigated within budget). `XS-02` (agent_router Barter grants) is adjacent but does not close it.
  - Should runtime-directory inventories be generated from runtime capability metadata rather than repeated in command YAML? (carried since iter 5).
  - Is `.codex/agents` intended to be restored as a generated mirror in a later phase? (carried since iter 3; gates `AGT-05`).
  - Should a doctor-routes trigger-phrase harvester actually be wired into the advisor? (the "is the header wrong" half is resolved — yes, wrong; the "should it be wired" half is a scoped enhancement, see `DR-05`).
- **README observations (out of scope — phase 005):**
  - `.opencode/install_guides/README.md` "Current Skills" catalog is stale (iter 10). Not actioned here.
  - `CMD-09`'s dead `folder_readme.md` reference and `create_agent_verified` residue live in workflow YAML (in scope, filed above) but their remediation should be sequenced alongside phase-005 README work.

---

*Synthesis of 15 deep-research iterations across 3 model batches (GPT-5.6-Sol-Fast high, Sonnet-5 xhigh, GLM-5.2 max). All P0/P1 findings are unremediated — this loop is report-only. Implementation routing is the recommended next step.*
