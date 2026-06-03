---
title: "Implementation Summary: README & References Accuracy Audit + Remediation"
description: "A gpt-5.5-fast deep-research accuracy audit of the user-facing command READMEs + system-spec-kit references/assets produced 159 raw findings; 10 adversarial verifiers confirmed 144 and rejected 13 (almost entirely the gitignored-dist false-positive class); 10 partitioned edit agents applied 142 fixes across 61 files with 0 skipped. Five dominant themes fixed; four highest-risk clusters spot-verified clean against live source."
trigger_phrases:
  - "readme accuracy summary"
  - "references drift remediation shipped"
  - "144 confirmed findings 142 fixes"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/133-readme-and-references-accuracy"
    last_updated_at: "2026-06-03T07:33:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Applied 142 fixes across 61 files; grepClean; 4-cluster spot-verify clean"
    next_safe_action: "Generate metadata, validate --strict, reconcile completion"
    blockers: []
    key_files:
      - ".opencode/install_guides"
      - ".opencode/skills/README.md"
      - ".opencode/skills/system-spec-kit/references"
      - ".opencode/skills/system-spec-kit/assets"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "readme-references-accuracy-session"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Implementation Summary: README & References Accuracy Audit + Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `skilled-agent-orchestration/133-readme-and-references-accuracy` |
| **Completed** | 2026-06-03 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A faithful, evidence-grounded accuracy pass over the user-facing command READMEs and the `system-spec-kit` references/assets, run as a three-stage parallel workflow and remediating only the confirmed findings:

1. **AUDIT** — 10 parallel `opencode run --model openai/gpt-5.5-fast --variant high` read-only audits over ~33 user-facing command READMEs (root, `install_guides`, `bin`, `plugins`, `scripts`, the ~20 skill top-level + 3 `mcp_server` READMEs) plus 41 `system-spec-kit` references and 4 assets. Produced **159 raw findings**. The repo has 322 READMEs total; ~250 are nested architecture/test-dir stubs and were deliberately excluded — only user-facing command READMEs were audited.
2. **VERIFY** — 10 parallel adversarial verifiers re-checked all 159 against the REAL filesystem. **Confirmed 144, REJECTED 13** — almost entirely the "dist/... file does not exist" false-positive class (`dist` is a gitignored build artifact that exists locally; gpt-5.5 couldn't see it) plus a `.mcp.json` analogue.
3. **REMEDIATE** — 10 parallel edit agents, partitioned by the same 10 areas with disjoint files, applied the 144 confirmed fixes: **142 fixes across 61 files, grepClean, 0 skipped**.

### 5 Dominant Themes Fixed

| # | Theme | Fix |
|---|-------|-----|
| 1 | Singular-`skill` typo | `.opencode/skill` → `.opencode/skills` (install_guides + skills/README — verification commands, `init_skill.py --path`, doc links) |
| 2 | MCP entrypoint | launcher `node .opencode/bin/mk-spec-memory-launcher.cjs` (per opencode.json), not bare `dist/context-server.js` |
| 3 | Tool-API drift | `memory_embedding_reconcile mode:[dry-run,apply]` (not `dryRun`), Code Mode `call_tool_chain({code})` (not `{typescript}`), `SPECKIT_EMBEDDER`→`EMBEDDINGS_PROVIDER`, plugin `spec-kit-skill-advisor.js`→`mk-skill-advisor.js` |
| 4 | Validation-reference drift | validation_rules.md / template_compliance_contract.md / path_scoped_rules.md realigned to validator-registry.json + spec-kit-docs.json (rule severities WARN→error, `AI_PROTOCOL`→`AI_PROTOCOLS`, Level-1 required files add implementation-summary, `./scripts/spec/validate.sh` repo-root → full path) |
| 5 | Memory/embedder + hooks drift | level_selection_guide.md §2 corrected to document recommend-level.sh's real 4-factor auto-scoring (LOC35/File20/Risk25/Complexity20); embedder_architecture.md trimmed to the single nomic-only MANIFESTS entry |

### Files Changed

| File Group | Action | Purpose |
|------------|--------|---------|
| `.opencode/install_guides/**` (READMEs) | Modified | singular-`skill` typo → plural; command/path fixes |
| `.opencode/skills/README.md` + ~20 skill top-level READMEs | Modified | path, plugin-name, tool-API fixes |
| `.opencode/skills/system-spec-kit/mcp_server/**` (3 READMEs) | Modified | MCP launcher entrypoint |
| `.opencode/skills/system-spec-kit/references/**` (41 files) | Modified | validation-reference, hooks, memory/embedder drift |
| `.opencode/skills/system-spec-kit/assets/**` (4 files) | Modified | assorted confirmed drift fixes |
| repo-root + `bin` + `plugins` + `scripts` READMEs | Modified | entrypoint, plugin filename, command/path fixes |

Total: **61 doc files** (READMEs + system-spec-kit references/assets), all within audit scope, no scope leak.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A fan-out / fan-in pipeline over a fixed 10-area partition, repeated for each stage so audit, verify, and remediate shared the same disjoint boundaries. The audit and verify stages dispatched gpt-5.5-fast read-only; the verify stage explicitly re-checked each raw finding against the real local filesystem to strip false positives (the gitignored-`dist` class the model could not see). The remediate stage ran 10 edit agents on disjoint file sets so parallel writes never collided. After remediation, grepClean confirmed the typo/path/tool-API classes were gone, and the orchestrator spot-verified the four highest-risk content clusters against live source. Confirmed-findings detail lives at `/tmp/readme-research/AUDIT-REPORT.md` + `confirmed.json`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Audit only user-facing command READMEs (exclude ~250 nested stubs) | The 322-README surface is dominated by nested architecture/test-dir stubs with no operator-facing commands; auditing them would dilute signal and waste budget on non-actionable docs. |
| Insert an adversarial verify stage between audit and remediation | gpt-5.5-fast cannot see gitignored `dist/`, so it produced a systematic "file does not exist" false-positive class; re-checking against the real filesystem rejected 13 findings that would otherwise have caused wrong edits. |
| Remediate confirmed findings only (finding-driven, not "while we're here") | Keeps the change scope-locked to documented drift; grepClean validates the typo/path/API classes without inviting unrelated "improvements." |
| Realign docs to live source, never the reverse | The validator registry, recommend-level.sh, opencode.json, and registry.ts are ground truth; the docs had drifted from them, so the docs are corrected. |
| Cross-check "missing file" findings with a second tool | An `fd` false-negative initially mis-flagged the recommend-level.sh scoring fix as a hallucination; `rg --files` confirmed the file exists. Verification tooling matters. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Adversarial verification of all 159 raw findings | PASS — 144 confirmed / 13 rejected |
| Rejected false-positive class | PASS — gitignored-`dist` "file does not exist" + a `.mcp.json` analogue, not applied |
| Remediation completeness | PASS — 142 fixes / 61 files / 0 skipped |
| grepClean | PASS — singular `.opencode/skill`, drifted tool-API signatures, stale entrypoints gone |
| Spot-verify cluster: path/command/tool fixes | PASS — correct against live source |
| Spot-verify cluster: validation_rules.md vs validator-registry.json | PASS — severities + names + L1 required-files aligned |
| Spot-verify cluster: level_selection_guide.md §2 vs recommend-level.sh | PASS — 4-factor model (LOC35/File20/Risk25/Complexity20) confirmed real |
| Spot-verify cluster: embedder_architecture.md vs registry.ts | PASS — trimmed to nomic-only MANIFESTS |
| Scope leak | PASS — no source/config edits; all 61 files within audit scope |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Verification tooling can mislead.** During the spot-verify, an `fd` false-negative initially mis-flagged the recommend-level.sh scoring fix as a hallucination before `rg --files` confirmed the file exists. The confirmed set is sound, but cross-tool verification was required to reach it.
2. **Scope is user-facing command READMEs only.** The ~250 nested architecture/test-dir README stubs were deliberately excluded; any drift inside those is out of scope for this packet.
3. **Findings detail lives under `/tmp`.** `AUDIT-REPORT.md` + `confirmed.json` are not committed to the repo; they are retained for traceability and re-application but are ephemeral.

### Downstream

No downstream packet consumes this directly; the corrected docs now match the live system, so future readers of the install guides, skill READMEs, and system-spec-kit references get accurate paths, entrypoints, tool signatures, and validation rules.
<!-- /ANCHOR:limitations -->
