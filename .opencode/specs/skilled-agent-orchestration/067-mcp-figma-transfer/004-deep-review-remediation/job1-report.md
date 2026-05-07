# Job 1 Report — Documentation Drift Fixes

| Task | Status | Evidence |
|---|---|---|
| T040 (R-004) | DONE | Barter and Public `INSTALL_GUIDE.md` Code Mode snippets now use `"FIGMA_API_KEY": "${figma_FIGMA_API_KEY}"` at the requested JSON env line. |
| T050 (R-005) | DONE | All three phase `implementation-summary.md` cumulative ledgers now include the full 10-row packet ledger, including commits `66e1e87`, `766206b`, `b03bf7563`, and `bdb739d97`. |
| T060 (R-006) | DONE | Phase 2 ADR-009 status is superseded by user commit `766206b`; `## Supersession Note` added; Phase 2 `spec.md` and `implementation-summary.md` now state internal Barter scope dual-published for cross-team visibility. |
| T070 (R-007) | DONE | Phase 2 `decision-record.md` Decision Index now includes `ADR-014 | Re-grep at execution start (D8) | Accepted | Phase 3`. |
| T080 (R-008) | DONE | Covered by T050: Phase 3 ledger includes commit `5b | 7307e056d | chore: clean up trailing mcp-figma references in install guides + regression fixtures | 3 ✅`. |
| T090 (R-009) | DONE | `.opencode/skills/README.md` reports `17 skill folders` and `Total skill folders | 17`, matching `ls -d .opencode/skills/*/ \| wc -l`. |
| T100 (R-010) | DONE | `.opencode/install_guides/README.md` and `SET-UP - AGENTS.md` now use 17 as the installed skill count, with the SET-UP skills table expanded to all 17 visible skill folders. |
| T110 (R-011) | DONE | Phase 1 ADR-005 decision now says package manifests plus `install.sh` are committed and `node_modules/` is built locally via `npm install`; consequences were updated to remove repo-size-growth claims. |
| T120 (R-012) | DONE | Phase 3 implementation summary and parent spec now say `295/296` with 1 known `advisor-graph-health` failure from sk-code `kind: "reference-category"` drift, out of scope per 069. |
| T160 (R-016) | DONE | Barter `AGENTS.md` heading now matches Public (`### Figma Operations Pipeline`); `cmp -s` exits `0`. |

Verification notes:
- Actual visible skill count: `17`.
- `rg "open-source|community|MIT-licensed"` returns no hits in Phase 2 `spec.md` or `implementation-summary.md`.
- `cmp -s` confirms Barter and Public Figma `AGENTS.md` are byte-identical.
- Packet-level `validate.sh --strict` still fails for `004-deep-review-remediation` on existing Level 2 template/frontmatter issues outside this Job 1 scope.
