---
title: "README & References Accuracy Audit + Remediation"
description: "3-stage parallel workflow (audit → adversarial verify → remediate) over user-facing command READMEs and system-spec-kit references/assets: 159 raw findings, 144 confirmed, 13 rejected (dist false-positive class), 142 fixes applied across 61 files with 0 skipped."
trigger_phrases:
  - "readme accuracy audit"
  - "system-spec-kit references drift"
  - "opencode skill singular typo"
  - "mcp launcher entrypoint readme"
  - "tool api drift remediation"
  - "144 confirmed findings 142 fixes"
  - "references drift remediation shipped"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-03

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/009-readme-and-references-accuracy` (Level 2)

### Summary

Documentation drift had accumulated across the user-facing command READMEs and the `system-spec-kit` references/assets: stale paths, wrong MCP entrypoints, outdated tool-API signatures, and validation-reference statements that no longer matched the live validator registry. A 3-stage parallel workflow ran 10 gpt-5.5-fast read-only audits (159 raw findings), then 10 adversarial verifiers that re-checked every finding against the real filesystem (144 confirmed, 13 rejected — almost entirely the gitignored-`dist` false-positive class), then 10 partitioned edit agents applied the 144 confirmed fixes: 142 fixes across 61 documentation files, 0 skipped, grepClean. Five dominant drift themes were remediated; four highest-risk content clusters were spot-verified clean against live source.

### Added

- Nothing net-new was added to the product surface; the pass was strictly remediation of confirmed drift.

### Changed

- **Singular-`skill` typo** — `.opencode/skill` corrected to `.opencode/skills` across `install_guides` READMEs and skill top-level READMEs (verification commands, `init_skill.py --path` invocations, inline doc links).
- **MCP launcher entrypoint** — READMEs updated from bare `dist/context-server.js` references to the canonical launcher `node .opencode/bin/mk-spec-memory-launcher.cjs` per `opencode.json`.
- **Tool-API drift** — `memory_embedding_reconcile mode:[dry-run,apply]` (not `dryRun`), Code Mode `call_tool_chain({code})` (not `{typescript}`), `SPECKIT_EMBEDDER` → `EMBEDDINGS_PROVIDER`, plugin `spec-kit-skill-advisor.js` → `mk-skill-advisor.js` — all corrected in affected READMEs and references.
- **Validation-reference drift** — `validation_rules.md`, `template_compliance_contract.md`, and `path_scoped_rules.md` realigned to `validator-registry.json` + `spec-kit-docs.json`: rule severities (`WARN` → `error`), `AI_PROTOCOL` → `AI_PROTOCOLS`, Level-1 required files now include `implementation-summary`, `./scripts/spec/validate.sh` updated to full repo-root path.
- **Memory/embedder + hooks drift** — `level_selection_guide.md` §2 corrected to document `recommend-level.sh`'s real 4-factor auto-scoring (LOC 35/File 20/Risk 25/Complexity 20); `embedder_architecture.md` trimmed to the single nomic-only MANIFESTS entry.
- **Total: 142 fixes across 61 documentation files** (READMEs + system-spec-kit references/assets), all within the declared audit scope, no scope leak.

### Fixed

- 13 raw findings from the `dist/...` build-artifact false-positive class (model could not see gitignored artifacts) were confirmed as false positives by adversarial filesystem verification and were NOT applied.
- One `fd` false-negative during spot-verify initially mis-flagged the `recommend-level.sh` scoring fix as a hallucination; cross-checked with `rg --files`, which confirmed the file exists and the fix is real.

### Verification

| Check | Result |
|-------|--------|
| Adversarial verification of all 159 raw findings (REQ-002) | PASS — 144 confirmed / 13 rejected |
| Rejected false-positive class (REQ-003) | PASS — gitignored-`dist` "file does not exist" + one `.mcp.json` analogue; not applied |
| Remediation completeness (REQ-004) | PASS — 142 fixes / 61 files / 0 skipped |
| grepClean | PASS — singular `.opencode/skill`, drifted tool-API signatures, stale entrypoints gone |
| Spot-verify: path/command/tool fixes (REQ-006) | PASS — correct against live source |
| Spot-verify: `validation_rules.md` vs `validator-registry.json` (REQ-006) | PASS — severities + names + L1 required-files aligned |
| Spot-verify: `level_selection_guide.md` §2 vs `recommend-level.sh` (REQ-006) | PASS — 4-factor model (LOC35/File20/Risk25/Complexity20) confirmed real |
| Spot-verify: `embedder_architecture.md` vs `registry.ts` (REQ-006) | PASS — trimmed to nomic-only MANIFESTS |
| Scope leak | PASS — no source/config edits; all 61 files within audit scope |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/install_guides/**` (READMEs) | Modified | Singular-`skill` typo → plural; command/path fixes |
| `.opencode/skills/README.md` + ~20 skill top-level READMEs | Modified | Path, plugin-name, tool-API fixes |
| `.opencode/skills/system-spec-kit/mcp_server/**` (3 READMEs) | Modified | MCP launcher entrypoint corrected |
| `.opencode/skills/system-spec-kit/references/**` (41 files) | Modified | Validation-reference, hooks, memory/embedder drift realigned |
| `.opencode/skills/system-spec-kit/assets/**` (4 files) | Modified | Assorted confirmed drift fixes |
| repo-root + `bin` + `plugins` + `scripts` READMEs | Modified | MCP entrypoint, plugin filename, command/path fixes |

Total: **61 documentation files** (READMEs + system-spec-kit references/assets).

### Follow-Ups

- The ~250 nested architecture/test-dir README stubs were deliberately excluded from this audit; any drift in those is out of scope and could be addressed in a future targeted pass.
- Confirmed-findings detail (`AUDIT-REPORT.md` + `confirmed.json`) lives under `/tmp/readme-research/` — these are ephemeral and not committed. Re-run the audit stage if a fresh evidence trail is needed.
