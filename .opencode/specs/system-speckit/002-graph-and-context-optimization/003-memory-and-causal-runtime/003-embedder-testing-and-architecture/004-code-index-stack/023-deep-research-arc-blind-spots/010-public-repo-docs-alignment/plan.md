---
title: "Implementation Plan: 010 Public Repo Docs Alignment"
description: "Two-phase plan: cli-devin SWE-1.6 10-iteration deep review surfaces P1 findings; main agent + cli-codex remediate by editing docs in place, no code logic changes."
trigger_phrases:
  - "010 plan"
  - "docs alignment plan"
importance_tier: "important"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/010-public-repo-docs-alignment"
    last_updated_at: "2026-05-20T15:00:00Z"
    last_updated_by: "main-agent"
    recent_action: "Plan executed"
    next_safe_action: "Close packet"
    blockers: []
    completion_pct: 100
---
# Implementation Plan: 010 Public Repo Docs Alignment

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Two-phase remediation: (1) cli-devin SWE-1.6 ran a 10-iteration deep review across every README, INSTALL_GUIDE, SKILL.md, AGENTS.md, feature_catalog, reference doc, and manual_testing_playbook in the public repo. Output = `review/review-report.md` + `review/iterations/iteration-{001..009}.md` + sentinel `DOCS_SWEEP_010_COMPLETE iter=10 verdict=6_P1_REMAINING`. (2) Main agent + cli-codex closed the 6 P1s plus residual gaps the deep review missed.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- `validate_document.py` against every modified doc: 0 issues.
- `pytest mcp_server/tests/test_calibration_perturbation.py`: pass.
- Live-surface grep for stale references (old folder name + evergreen packet IDs): empty.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Pure docs/path-string changes. No code logic touched. Edits batched per commit by scope: (a) root README, (b) mcp-coco-index references/+assets/, (c) benchmarks/ gap-fill + sk-doc compliance, (d) folder rename, (e) post-rename path-string updates.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## 4. AFFECTED SURFACES

- `README.md` (root)
- `.opencode/skills/mcp-coco-index/references/*.md` (5 files)
- `.opencode/skills/mcp-coco-index/assets/config_templates.md`
- `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/**` (folder rename + content fill)
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/embedders/registered_embedders.py`
- `.opencode/skills/mcp-coco-index/mcp_server/tests/test_calibration_perturbation.py`
- One harness script at `phase2-bench/run-expanded-bench.sh`
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 5. IMPLEMENTATION PHASES

| Phase | Description | Status | Commits |
|---|---|---|---|
| 1 | cli-devin SWE-1.6 10-iter deep review | complete | (review evidence in `review/`) |
| 2a | First 6 P1s closed (cli-codex sweep) | complete | `048435d63` |
| 2b | Root README mk-spec-memory + CocoIndex drift close | complete | `6466bed56` |
| 2c | mcp-coco-index references/+assets/ sk-doc alignment | complete | `7df22f054` |
| 2d | mcp_server/benchmarks/ completion + sk-doc compliance | complete | `8ecdca818` |
| 2e | Benchmark folder rename (drop -expanded) | complete | `b4cdebb4f` |
| 2f | Post-rename path-string updates | complete | `f35e59505` |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 6. TESTING STRATEGY

- `validate_document.py` on every modified doc post-edit.
- `pytest test_calibration_perturbation.py` post-rename.
- Live-surface grep verification before every commit.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 7. DEPENDENCIES

- 023/007-fixture-calibration must be complete (provides the lane JSONs + narrative sidecars that this packet promotes forward to the destination).
- sk-doc skill v1.5.0+ for `validate_document.py`.
- ADR-013, ADR-014, ADR-027 must be in `002-spec-memory-stack/004-spec-memory-embedder-bake-off/decision-record.md`.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 8. ROLLBACK PLAN

All edits are pure docs/path-string changes; rollback = `git revert <commit>` for any of the 5 packet commits (`6466bed56`, `7df22f054`, `8ecdca818`, `b4cdebb4f`, `f35e59505`). No code or test surfaces depend on these edits beyond the 4-test calibration_perturbation suite (which only reads the renamed path string).
<!-- /ANCHOR:rollback -->
