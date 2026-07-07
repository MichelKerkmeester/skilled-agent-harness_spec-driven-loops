1. **PURPOSE** — Stack-agnostic, findings-first code review baseline that enforces mandatory security/correctness minimums and delegates surface-specific standards evidence to `sk-code`.

2. **PROBLEM** — Ad-hoc code review is inconsistent: reviewers apply personal style preferences, skip security and correctness checks under time pressure, and use stack-specific checklists that don't transfer across surfaces. A single generic checklist misses surface idioms; a per-stack checklist multiplies maintenance and drifts. The baseline-plus-surface-evidence model solves this by enforcing universal minimums (always) while letting surface standards override generic style/build/test guidance (when detected), so security and correctness are never skipped and stack-specific conventions are always authoritative.

3. **MODES & CAPABILITIES**
   - Findings-first severity model: P0 (critical/block merge), P1 (high/fix soon), P2 (advisory/optional) with file:line evidence per finding.
   - Baseline-plus-surface-evidence: baseline security/correctness minimums always enforced; `sk-code` detected-surface standards override generic style/build/test.
   - Review-only contract: no code edits during review; findings reported, implementation is a separate follow-up.
   - Risk checklists: security (`security_checklist.md`), code quality (`code_quality_checklist.md`), SOLID (`solid_checklist.md`), test quality (`test_quality_checklist.md`), fix completeness (`fix-completeness-checklist.md`), removal planning (`removal_plan.md`).
   - Efficiency gates: M-1 PR-state content-hash dedup (skip re-review of unchanged diffs), M-2 opt-in minimum evidence gate (skip trivially small diffs unless sensitive paths touched).
   - Final-line exact-string contract: review must end with `Review status: APPROVED|REQUESTED_CHANGES|COMMENTED` for downstream automation parsing.

4. **INVOCATION** — Triggered by `@review` agent dispatch or `CODE-REVIEW` prompt marker (must be prepended as first two lines of rendered prompt). Activates via Skill Advisor on keywords: `review`, `code review`, `pr review`, `audit`, `security review`, `quality gate`, `merge readiness`, `findings`, `blocking issues`, `request changes`. Also usable for pre-commit or gate validation. Review-only: no code edits permitted. Outputs severity-ranked findings with file:line evidence, fix scope classification (`instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, `test-isolation`), and a standardized markdown report ending with an exact `Review status:` line.

5. **KEY FILES**

   | Path | Purpose |
   |---|---|
   | `SKILL.md` | Findings-first baseline contract, output format, routing, efficiency gates, full rules (506 lines) |
   | `README.md` | User-facing overview, quick start, features, FAQ |
   | `references/review_core.md` | Shared findings-first doctrine consumed by both `@review` and `@deep-review` (severity definitions, evidence requirements) |
   | `references/review_ux_single_pass.md` | Interactive single-pass review flow and presentation rules |
   | `references/quick_reference.md` | Lightweight index routing between shared doctrine and single-pass UX |
   | `references/security_checklist.md` | Mandatory security and reliability checks |
   | `references/code_quality_checklist.md` | Correctness, performance, KISS, DRY checks |
   | `references/solid_checklist.md` | SOLID (SRP/OCP/LSP/ISP/DIP) and architecture assessment |
   | `references/test_quality_checklist.md` | Test quality, coverage, anti-pattern detection |
   | `references/removal_plan.md` | Safe-now vs deferred removal planning with dependency analysis |
   | `references/fix-completeness-checklist.md` | Verifies fix completeness (no half-fixes) |
   | `references/pr_state_dedup.md` | M-1 PR-state content-hash dedup: signature scheme, cache format, retention |
   | `manual_testing_playbook/manual_testing_playbook.md` | Manual testing playbook root (18 scenario files across 6 topic dirs) |
   | `changelog/` | Version history (v1.1.0.0, v1.2.0.0, v1.3.0.0) |

6. **BOUNDARIES** — Does NOT own: (a) multi-iteration review loops — that is `deep-review`, which loads `review_core.md` from this skill's references via `.opencode/skills/deep-review/assets/prompt_pack_iteration.md.tmpl`; (b) surface-specific style/build/test standards — that is `sk-code`, which supplies detected-surface evidence consumed here; (c) code editing — review-only, no Write/Edit of reviewed code; (d) documentation quality — that is `sk-doc`.

7. **TROUBLESHOOTING & FAQ MATERIAL**
   - **Unknown surface**: if `sk-code` returns UNKNOWN, proceed baseline-only and disclose in output footer. Never fabricate surface evidence.
   - **Surface-vs-baseline precedence**: baseline security/correctness minimums always win; surface style/process/verification conventions override baseline generic advice. Ambiguous conflicts escalate.
   - **Missing P0/P1/P2 sections**: findings must be severity-grouped; omit a tier section only if no findings of that tier exist.
   - **Findings drip-fed**: single-pass output is mandatory — collect all findings, then emit in one message.
   - **Q: How does this differ from `deep-review`?** A: `sk-code-review` is single-pass; `deep-review` is multi-iteration with externalized state and convergence detection. Both share `review_core.md` doctrine.
   - **Q: How does this differ from `sk-code`?** A: `sk-code-review` owns review rules and severity model; `sk-code` owns surface-specific standards evidence. Review consumes sk-code output; it does not detect surfaces itself.
   - **Q: Can I add a severity tier?** A: No. P0/P1/P2 are fixed.
   - **Q: Are security/correctness minimums mandatory?** A: Yes, even in baseline-only mode.

8. **STALE FACTS** — The current `README.md` contains multiple inaccuracies versus `SKILL.md` and real files:
   - **SKILL.md LOC**: README §3.3 says "406 LOC"; actual SKILL.md is 506 lines.
   - **Reference file count**: README §3.3 says "9 reference files"; actual count is 10 (`pr_state_dedup.md` is missing from README's structure tree, feature reference table, and related documents table).
   - **Missing efficiency gates**: README omits SKILL.md §9 (M-1 PR-state dedup, M-2 minimum evidence gate) and §10 (references to `pr_state_dedup.md`) entirely.
   - **Missing final-line contract**: README does not document the mandatory `Review status: APPROVED|REQUESTED_CHANGES|COMMENTED` exact-string line that SKILL.md §3 requires for automation parsing.
   - **Output contract section name**: README §2 Step 4 shows `## Review Context` as the output footer; SKILL.md §3 Phase 4 uses `## Code Review Summary` with baseline/surface fields inside it.
   - **Always-loaded reference count**: README §2 Step 2 says "four core baseline references"; SKILL.md §2 Resource Loading Levels table lists 5 ALWAYS resources (adds `fix-completeness-checklist.md`).
   - **Missing CODE-REVIEW marker**: README does not document the `CODE-REVIEW\n\n` prompt prefix required by SKILL.md §2 Phase Detection Step 0.
   - **Missing fix scope classification**: README omits SKILL.md §3 Phase 3's `instance-only`/`class-of-bug`/`cross-consumer`/`algorithmic`/`matrix/evidence`/`test-isolation` taxonomy and the instance-only opt-out rules.
   - **Missing escalation conditions**: README §7 TROUBLESHOOTING does not cover SKILL.md §4's escalation triggers (ambiguous surface, non-deterministic conflicts, large diff, scope creep to architecture redesign).
   - **Incomplete directory tree**: README §4 STRUCTURE omits `manual_testing_playbook/` (18 scenario files across 6 topic directories), `changelog/` (includes v1.3.0.0), `.opencode/`, and `graph-metadata.json`.
   - **Version discrepancy**: SKILL.md frontmatter and README §3.3 both say `1.2.0.0`, but a `changelog/v1.3.0.0.md` file exists — SKILL.md version may be stale.
   - **Non-numbered example sections**: README §6 USAGE EXAMPLES contains three subsections (PR with WEBFLOW surface, baseline-only review, removal recommendation) that have no corresponding numbered section in SKILL.md — they are README-only illustrative content, not canonical spec.
   - **Comparison table not in SKILL.md**: README §3.4 COMPARISON WITH RELATED SKILLS (including `sk-doc` column) has no counterpart in SKILL.md.
   - **Manual testing playbook**: SKILL.md §8 references `manual_testing_playbook/manual_testing_playbook.md` plus "18 per-feature sub-files"; the actual directory contains 18 `.md` scenario files across 6 topic subdirectories — consistent but undocumented in README.