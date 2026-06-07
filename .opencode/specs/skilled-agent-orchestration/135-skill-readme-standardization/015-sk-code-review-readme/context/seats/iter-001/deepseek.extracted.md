Let me also check the `.agents` copy for any differences:
## 1. PURPOSE
`sk-code-review` is the stack-agnostic, findings-first code-review baseline that enforces mandatory security/correctness minimums, produces severity-ranked (`P0`/`P1`/`P2`) findings with `file:line` evidence, and delegates per-surface style/build/test standards to `sk-code`.

## 2. PROBLEM
Ad-hoc reviews suffer from two systemic failures: reviewers skip security and correctness checks because no structural baseline forces them, and a single generic checklist cannot distinguish universal defects from surface-specific conventions. `sk-code-review` solves both by making security/correctness minimums non-negotiable (always enforced, even in baseline-only mode) while delegating surface style, build, and test-command authority to `sk-code` — so a reviewer gets a universal safety net plus surface-accurate guidance without maintaining N per-stack review skills. The findings-first format further forces the reviewer to surface what blocks merge before commentary, so busy reviewers see action items in 30 seconds rather than scanning a narrative summary for buried issues.

## 3. MODES & CAPABILITIES
- **Findings-first severity model**: `P0` (blocker: exploitable security, auth bypass, destructive data loss), `P1` (required: correctness bug, spec mismatch, must fix before merge), `P2` (suggestion: non-blocking improvement, style, or maintainability follow-up).  
- **Baseline-plus-surface-evidence**: baseline security/correctness minimums always enforced; surface style/build/test conventions from `sk-code` override generic baseline style/process advice; ambiguous conflicts escalate rather than guess.  
- **Review-only, no code edits**: the skill produces findings and a final-line status (`APPROVED` / `REQUESTED_CHANGES` / `COMMENTED`) but never implements fixes; implementation is a separate follow-up step.  
- **Risk checklists** (loaded by intent scoring): `security_checklist.md` (auth, injection, secrets, race conditions, rate limiting, dependency posture, etc.), `code_quality_checklist.md` (error handling, boundary conditions, contract safety, KISS/DRY), `solid_checklist.md` (SRP/OCP/LSP/ISP/DIP + architecture smells), `test_quality_checklist.md` (coverage quality, flaky tests, test smells, pyramid awareness), `fix-completeness-checklist.md` (instance-only opt-out proof, producer/consumer inventory, algorithm/evidence matrix), `removal_plan.md` (safe-now vs deferred removal with dependency analysis and rollback plans).  
- **Efficiency gates**: M-1 PR-state content-hash dedup (skips redundant re-reviews when the diff signature matches a prior cache entry at `.opencode/.sk-code-review-cache/<repo-ref>.jsonl`); M-2 opt-in minimum-evidence gate (skips tiny diffs below `SK_CODE_REVIEW_MIN_CHANGED_LINES` lines unless sensitive paths are touched).

## 4. INVOCATION
Triggered by: the `@review` agent dispatch, the `CODE-REVIEW\n\n` prompt marker prepended by the dispatcher/agent before the reviewer LLM sees the rendered prompt, keyword-triggered skill activation (Skill Advisor matches on `review`, `code review`, `pr review`, `audit`, `security review`, `quality gate`, `merge readiness`), and pre-commit or gate-validation workflows. The skill contract is review-only: it reads code, produces findings, and never edits. Output is a severity-ranked findings list in a standardized markdown structure (`## Code Review Summary` → `## Findings` → `### P0 - Critical` / `### P1 - High` / `### P2 - Advisory` → `## Removal/Iteration Plan` → `## Next Steps`), with each finding carrying `path:line` evidence, risk statement, user impact, finding class, scope proof, and recommended fix. The absolute final line must be exactly `Review status: APPROVED`, `Review status: REQUESTED_CHANGES`, or `Review status: COMMENTED` for downstream automation.

## 5. KEY FILES

| Path | Purpose |
|---|---|
| `SKILL.md` | Canonical skill definition: activation triggers, smart routing (intent scoring, resource loading levels, precedence matrix), 4-phase workflow, output contract with final-line status, rules, and efficiency gates (M-1/M-2) |
| `README.md` | Human-facing overview with feature highlights, quick start, comparison table, structure diagram, usage examples, troubleshooting, and FAQ |
| `references/review_core.md` | Shared review doctrine (consumed by both `@review` and `@deep-review`): severity definitions, evidence requirements, findings output ordering, baseline+surface precedence, mandatory check families, finding schema |
| `references/review_ux_single_pass.md` | Interactive single-pass review behavior: human interaction rules, report flow, mode-specific presentation, PR/pre-commit guidance |
| `references/security_checklist.md` | Mandatory security and reliability checklist: input/output safety, auth/authz, secrets/privacy, runtime reliability, concurrency/race conditions, rate limiting, CSP/headers, dependency/supply-chain, audit logging, privacy/data handling |
| `references/code_quality_checklist.md` | Correctness, performance, and maintainability checklist: error handling, scaling, boundary conditions, data-flow/contract safety, maintainability signals, KISS/DRY enforcement |
| `references/solid_checklist.md` | SOLID architecture checklist: SRP/OCP/LSP/ISP/DIP prompt questions, architecture smell catalog (God module, shotgun surgery, speculative abstraction, feature envy), refactor guidance |
| `references/removal_plan.md` | Removal and iteration plan template: safe-now vs deferred classification, dependency analysis fields, reviewer verification checklist, rollback strategy |
| `references/test_quality_checklist.md` | Test quality checklist: coverage quality (assertion-free tests, happy-path-only), test structure/clarity, independence/reliability, test smell detection (over-mocking, catch swallowing, implementation coupling), test pyramid awareness |
| `references/fix-completeness-checklist.md` | Fix completeness classification: finding classes (instance-only, class-of-bug, cross-consumer, algorithmic, matrix/evidence, test-isolation), required producer/consumer inventories with grep commands, completion output schema |
| `references/quick_reference.md` | Lightweight routing index: maps review consumers to correct reference file (shared doctrine vs single-pass UX), lists supporting checklists |
| `references/pr_state_dedup.md` | Detailed M-1 efficiency gate reference: signature computation, cache format (`.opencode/.sk-code-review-cache/<repo-ref>.jsonl`), retention rules, skip behavior |

## 6. BOUNDARIES
- **Does NOT own multi-iteration deep review**: `deep-review` runs iterative review passes with convergence detection, externalized state, and per-dimension findings — this skill is a single-pass baseline only. Both consume `references/review_core.md` for shared doctrine.  
- **Does NOT supply surface style/build/test standards**: `sk-code` is the sole authority for per-surface conventions (naming, linting, build commands, test runners). This skill consumes `sk-code` evidence but never defines it.  
- **Does NOT edit or implement code**: the skill is strictly review-only. It reports findings and requests explicit next action before any implementation follow-up. Fixes, refactors, and implementation are handled by `sk-code` or general coding workflows, not this skill.

## 7. TROUBLESHOOTING & FAQ MATERIAL

**Common failure modes:**
- **Missing severity tiers**: agent emits flat findings without P0/P1/P2 grouping — caused by skipping severity classification or bypassing the output contract. Fix: re-read SKILL.md §4 RULES and the Phase 4 output contract.  
- **Mandatory minimums skipped**: review covers surface area but no security/correctness findings appear despite visible issues — caused by treating minimums as advisory. Fix: re-run with explicit `security_checklist.md` and `code_quality_checklist.md` checks; state "no issues found" explicitly in the report footer rather than silently omitting.  
- **Drip-fed findings**: agent emits 2-3 findings, asks "continue?", repeats — caused by ignoring `review_ux_single_pass.md` as mandatory. Fix: collect all findings first, organize by severity, emit in one message.  
- **Fabricated surface evidence**: Review Context claims `sk-code:webflow` but `sk-code` wasn't loaded or returned UNKNOWN — caused by guessing surface from prompt vocabulary rather than actual `sk-code` detection output. Fix: use `baseline-only` when surface is unclear; never fabricate.  

**Key user questions:**
1. **How does this differ from `deep-review`?** This skill runs one review pass and produces findings immediately. `deep-review` runs multiple iterative passes across dimensions, detects convergence, and is appropriate for complex changes where a single pass would miss cross-dimension interactions.  
2. **How does this differ from `sk-code`?** `sk-code` provides surface-specific coding standards (naming, linting, build commands, test runners) and implements code. `sk-code-review` provides the universal review baseline (severity model, security/correctness minimums, findings format) and consumes `sk-code` evidence to overlay surface conventions — but never implements code itself.  
3. **What happens when the surface is unknown?** The review proceeds in baseline-only mode, enforcing only security and correctness minimums, and discloses the uncertainty in the output. The reviewer should not fabricate surface claims.  
4. **Can I skip security/correctness checks for a quick review?** No. The minimums are non-negotiable and apply even in baseline-only mode. They are the universal rules that do not depend on surface knowledge.

## 8. STALE FACTS

- **SKILL.md LOC count**: `README.md` §3.3 "SKILL STATISTICS" reports `SKILL.md size: 406 LOC`. The actual file is 506 lines.  
- **Reference file count**: `README.md` §3.3 reports `Reference files: 9`. The actual `references/` directory contains 10 files (`pr_state_dedup.md` is omitted from the count, the catalog table in §3.2, the structure diagram in §4, and the related-documents table in §9).  
- **Structure diagram** (`README.md` §4): the ASCII tree lists exactly 9 reference files, missing `pr_state_dedup.md`.  
- **"Review Context" section heading**: `README.md` §1, §2 Step 4, §6 examples, and §3.2 Output Contract table all reference a `## Review Context` section heading for the footer. The canonical output contract in `SKILL.md` §3 Phase 4 uses `## Code Review Summary` as the single combined section (containing files reviewed, overall assessment, baseline used, and surface evidence used) — no separate `## Review Context` heading exists in SKILL.md.  
- **Surface evidence source enumeration**: `README.md` §3.2 Surface Evidence Sources table lists `sk-code:webflow`, `sk-code:opencode`, and `sk-code:motion_dev` as concrete surfaces. `SKILL.md` never enumerates specific surfaces — it only uses the generic placeholder `sk-code:<surface>`. These concrete surface names are not validated against the current `sk-code` skill and could become stale.