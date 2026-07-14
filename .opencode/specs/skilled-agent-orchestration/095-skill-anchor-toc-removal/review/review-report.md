---
title: "Deep Review Report: 117 Skill Anchor + TOC Removal"
description: "Independent 6-pass cli-codex (gpt-5.5) review of commit 1e58d845af: verdict CONDITIONAL — 3 P1 + 6 P2, no P0; one real structural defect (orphaned numbered-TOC lists)."
trigger_phrases:
  - "117 toc removal review report"
  - "deep review skill anchor toc"
importance_tier: "important"
contextType: "review"
---
# Deep Review Report: 117 Skill Anchor + TOC Removal

## 1. SUMMARY

| Field | Value |
|-------|-------|
| **Target** | git commit `1e58d845af` (TOC + `<!-- ANCHOR -->` removal; 897 files, +3,184/−12,998) |
| **Executor** | cli-codex `gpt-5.5`, reasoning=medium, service-tier=fast, sandbox=read-only |
| **Iterations** | 6 of 10 (converged) |
| **Stop reason** | converged — 2 consecutive PASS passes (5,6); exhaustive stale-guidance + content-loss sweeps found nothing new |
| **Verdict** | **CONDITIONAL** (hasAdvisories=true) |
| **Findings** | P0=0 · P1=3 · P2=6 |

**Bottom line:** The cleanup did not lose any document content and did not break the validator, config, carve-outs, or security. It DID leave one real structural defect — **orphaned numbered-TOC link lists in 8 files** (the TOC heading was removed but the numbered `N. [..](#..)` list survived) — plus stale TOC/anchor *guidance* in a handful of standards/template/command docs, and over-claims in the 117 verification docs. All are fixable; none block.

## 2. VERDICT

**CONDITIONAL** — no P0 blockers. Three P1 (one real content/structure defect + two consistency/accuracy issues) should be fixed before this is called done; six P2 are polish.

## 3. FINDINGS

### P1 (Required)

- **F-001 — Orphaned numbered-TOC link lists (8 files).** The transform's TOC-body matcher recognized only `-`/`*`/`+` bullets, not numbered `N.` entries. For TOCs that used numbered entries (install guides + several READMEs) it removed the `## TABLE OF CONTENTS` heading but left the numbered link list as an orphaned block between `---` rules.
  Files: `mcp-chrome-devtools/INSTALL_GUIDE.md`, `mcp-code-mode/INSTALL_GUIDE.md`, `system-spec-kit/mcp_server/INSTALL_GUIDE.md`, `mcp-chrome-devtools/README.md`, `mcp-chrome-devtools/examples/README.md`, `sk-git/README.md`, `deep-research/README.md`, `system-spec-kit/mcp_server/ENV_REFERENCE.md`.
  Evidence: e.g. `system-spec-kit/mcp_server/INSTALL_GUIDE.md` lines 42-52 hold `1. [AI-FIRST INSTALL GUIDE]`…`11. [RESOURCES]` with no heading. The earlier heading-only residual grep could not catch this (retained content, not a removed line).
- **F-002 — Stale "optional anchors" guidance.** `sk-doc/assets/readme/readme_template.md:76` ("Optional HTML anchors help memory and extraction tools…") and `:293` ("Optional anchors wrap only stable sections") survived the template edit and contradict the new no-anchor policy.
- **F-003 — 117 verification docs over-claim.** `004-verification-reconciliation/implementation-summary.md:54,86-87` and `002-toc-removal/implementation-summary.md:44,97` assert "0 unclassified", "removed every TOC block", "TOC anchor link lines died with their TOC blocks" — false given F-001. The full-diff classifier only inspected *removed* lines, so it could not detect *retained* orphaned content.

### P2 (Suggestions / consistency)

- **F-004** `sk-doc/references/global/validation.md:50-51` — still lists missing-TOC / single-dash-anchor as blocking, which the validator no longer enforces.
- **F-005** `sk-doc/README.md:301,328-330` — still says `validate_document.py` checks TOC anchors and lists TOC issues as common blocking causes.
- **F-006** `sk-doc/assets/skill/skill_asset_template.md:583` — example config `require_toc_when: "lines > 100"` can reintroduce a TOC requirement.
- **F-007** `commands/create/assets/create_folder_readme_auto.yaml:9,447` — still tells generated docs to include "clear section anchors" / references "readme_template.md §12 (Anchor Templates)".
- **F-008** `commands/create/assets/create_folder_readme_confirm.yaml:12,400` — same stale section-anchor guidance.
- **F-009** `commands/create/README.txt` — still carries standalone `<!-- ANCHOR -->` section comments (only its TOC block was removed).

## 4. WHAT IS GREEN (verified safe)

- **No content loss.** iter1/iter2/iter6 sampling (~60+ files; 621 removed lines inspected in iter6) + the deterministic full-diff classification: every removed line was a TOC heading, TOC link, `<!-- ANCHOR -->` comment, blank line, or `---` rule. No prose/heading/table/code/list lost.
- **Config + tests:** `template_rules.json` valid, `tocRequired:false` for readme/install_guide/playbook (none true); validator suite **11/11**.
- **`/create` YAMLs:** all 6 still valid YAML; confirm-menu B/C relabel consistent.
- **Carve-outs intact:** `system-spec-kit/templates/**` anchors preserved (26 files), `sk-doc/scripts/tests/**` TOC fixtures preserved (5).
- **Under-removal:** 0 stray `## TABLE OF CONTENTS` headings, 0 stray standalone `<!-- ANCHOR -->` lines in scope.
- **Security:** no secrets, private-path leaks, injection, or permission changes in the 20 non-md files.

## 5. CONVERGENCE REPORT

| Iter | Dimension | P0 | P1 | P2 | Verdict |
|------|-----------|----|----|----|---------|
| 1 | correctness (TOC content) | 0 | 3* | 0 | CONDITIONAL |
| 2 | correctness (anchors+structure) | 0 | 1 | 0 | CONDITIONAL |
| 3 | standards/config + /create | 0 | 0 | 6 | CONDITIONAL |
| 4 | carve-outs + traceability + security | 0 | 1 | 0 | CONDITIONAL |
| 5 | maintainability (exhaustive sweep) | 0 | 0 | 0 | PASS |
| 6 | content-loss regression (35 files) | 0 | 0 | 0 | PASS |

*iter1's 3 findings are all instances of the single F-001 class. Converged at iter6 (2 consecutive PASS).

## 6. REMEDIATION PLAN

1. Remove the orphaned numbered-TOC link lists from the 8 files (collapse the resulting adjacent `---`). [F-001]
2. Remove the stale optional-anchor lines from `readme_template.md`. [F-002]
3. Scrub stale TOC/anchor guidance: validation.md, sk-doc/README.md, skill_asset_template.md, the 2 create_folder_readme YAMLs, create/README.txt. [F-004..F-009]
4. Correct the 117 verification docs to record the orphaned-TOC defect + its fix. [F-003]
5. Re-verify: 0 orphaned numbered-TOC lists, 0 stale guidance, validator 11/11, YAMLs valid.

## 7. REMEDIATION OUTCOME (applied + re-verified)

All 9 findings fixed in this session (working-tree changes on top of commit `1e58d845af`; 18 files, +52/−153):
- **F-001** — orphaned numbered-TOC lists removed from all 8 files via the transform's new `--orphan-toc` mode. Re-verify: **0** orphaned numbered-TOC lists in scope.
- **F-002** — `readme_template.md` optional-anchor guidance replaced with the no-anchor policy.
- **F-003** — `002`/`004` implementation-summaries corrected to record the orphaned-TOC defect + fix.
- **F-004…F-009** — stale TOC/anchor guidance scrubbed from `validation.md`, `sk-doc/README.md`, `skill_asset_template.md`, both `create_folder_readme` YAMLs, and `create/README.txt`.

**Re-verification (all green):** 0 in-scope TOC headings · 0 in-scope standalone anchors · 0 orphaned numbered-TOC lists · validator suite 11/11 · all 6 `/create` YAMLs valid · sample install guide validates · carve-outs intact (`system-spec-kit/templates/**` 498 anchor lines preserved) · 117 packet `validate.sh --strict` PASSED (parent + children).

No P0. Verdict moves from CONDITIONAL → effectively clean after remediation. Changes are uncommitted — ready for your review/commit.
