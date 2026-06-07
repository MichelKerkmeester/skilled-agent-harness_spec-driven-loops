1. EXACT INVOCATION

- **Dispatch:** `@review` agent (`.opencode/agents/review.md`, cited at SKILL.md:422). Also invoked via Skill Advisor on `review`, `code review`, `pr review`, `audit`, `security review`, `quality gate`, `merge readiness`, `findings`, `blocking issues`, `request changes` keywords (SKILL.md:26).
- **Prompt-marker prepend:** The dispatcher/agent MUST prepend `CODE-REVIEW\n\n` as the first two lines of the rendered prompt before the reviewer LLM sees it (SKILL.md:58).
- **Review-only contract:** "Do not implement fixes during review. Report findings only; implementation is a separate follow-up step." (SKILL.md:380). After findings, the review must "request explicit next action before any implementation follow-up" (SKILL.md:331).
- **Severity taxonomy:** Three tiers: `P0` Critical, `P1` High, `P2` Advisory (SKILL.md:287, review_core.md:20–24). Exact labels from review_core.md:
  - `P0` — "Blocker: exploitable security issue, auth bypass, destructive data loss" → "Block merge"
  - `P1` — "Required: correctness bug, spec mismatch, must-fix gate issue" → "Fix before merge"
  - `P2` — "Suggestion: non-blocking improvement, documentation polish, style or maintainability follow-up" → "Optional or schedule follow-up"
- **Output shape:** Markdown with sections: `## Code Review Summary` (files reviewed, overall assessment, baseline used, surface evidence used), `## Findings` (sub-headed `### P0 - Critical`, `### P1 - High`, `### P2 - Advisory`), `## Removal/Iteration Plan`, `## Next Steps` (SKILL.md:304–329). Each finding includes: path:line title, risk, user impact, finding class, scope proof, affectedSurfaceHints, recommended fix (SKILL.md:315–321).
- **Final-line contract (MANDATORY):** Every review ends with exactly one of three plain-text lines: `Review status: APPROVED`, `Review status: REQUESTED_CHANGES`, or `Review status: COMMENTED` (SKILL.md:335–360). Downstream automation parses this via exact string match.

2. CAPABILITY ROSTER

**Baseline-plus-surface ownership split** (SKILL.md:94–99):
- Baseline (always enforced): `sk-code-review` security/correctness minimums — never relaxed by surface guidance.
- Surface overrides: `sk-code` detected surface conventions for style, process, build, test commands.
- On conflict: escalate; do not guess.

**Findings-first contract:** "Keep findings first; summaries follow findings." (SKILL.md:368). Findings ordered by severity P0→P1→P2 before any summary sections (review_core.md:40–44).

**Full risk checklists** (SKILL.md:86–89, Resource Loading Levels):
- ALWAYS: `security_checklist.md`, `code_quality_checklist.md`, `fix-completeness-checklist.md`
- CONDITIONAL: `solid_checklist.md`, `test_quality_checklist.md`, `removal_plan.md`
- ON_DEMAND: full mapped reference set

**Baseline check families** (review_core.md:65–70):
- Correctness minimums: regression risk, contract safety, spec mismatch, destructive side effects, boundary handling.
- Security minimums: auth/authorization gaps, injection exposure, unsafe secrets handling, privilege misuse, reliability risks with security impact.

**Finding schema fields** (review_core.md:78–88): `id`, `severity`, `title`, `file`, `evidence`, `findingClass` (one of `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, `test-isolation`), `scopeProof`, `affectedSurfaceHints`, `recommendation`.

**PR-state efficiency gates** (SKILL.md:438–498):
- M-1: PR-State Content-Hash Dedup — skips redundant re-reviews via SHA256 signature.
- M-2: Opt-In Minimum Evidence Gate — skips trivially small diffs (enabled by `SK_CODE_REVIEW_MIN_CHANGED_LINES` env var), with a conservative taxonomy that never skips high-risk changes.

3. KEY FILES

| Path | Role | Shared with deep-review? |
|---|---|---|
| `.opencode/skills/sk-code-review/SKILL.md` | Findings-first baseline contract, routing, output contract, severity taxonomy, efficiency gates | No |
| `.opencode/skills/sk-code-review/README.md` | Skill overview, quick start, feature catalog, troubleshooting, FAQ | No |
| `references/review_core.md` | Shared doctrine: severity model, evidence rules, precedence, finding schema | **Yes** (consumed by `@review` and `@deep-review`, line 8) |
| `references/review_ux_single_pass.md` | Interactive single-pass review flow, presentation modes, PR/pre-commit behavior | No (`@review` only, per quick_reference.md:32) |
| `references/security_checklist.md` | Mandatory security and reliability checks (12 sections) | No |
| `references/code_quality_checklist.md` | Correctness, performance, KISS, DRY, maintainability checks | No |
| `references/solid_checklist.md` | SOLID (SRP/OCP/LSP/ISP/DIP) and architecture assessment prompts | No |
| `references/removal_plan.md` | Safe-now vs deferred removal planning template | No |
| `references/test_quality_checklist.md` | Test quality, coverage, and anti-pattern detection | No |
| `references/fix-completeness-checklist.md` | Fix completeness verification: class-of-bug, cross-consumer, algorithmic, matrix/evidence, test-isolation | No |
| `references/quick_reference.md` | Lightweight index routing between shared doctrine and single-pass UX guidance | No |
| `references/pr_state_dedup.md` | Detailed M-1 signature scheme, cache format, and retention rules | No |

**Total references/ files: 10.** SKILL.md §5 lists 8 "Core References" (lines 395–402). §10 references `pr_state_dedup.md` separately (line 504). `fix-completeness-checklist.md` is referenced in §2 DEFAULT_RESOURCES (line 124) and §8 (line 430).

4. WORKFLOWS & OUTPUTS

**Documented review flow** (SKILL.md:56–64):
```
STEP 0: Load sk-code-review baseline + sk-code surface evidence
        (dispatcher MUST prepend CODE-REVIEW\n\n)
STEP 1: Score intents (top-2 when ambiguity delta <= 1.0)
Phase 1: Scope and baseline checks (SKILL.md:267–270)
Phase 2: Surface alignment (SKILL.md:273–278)
Phase 3: Findings-first analysis (SKILL.md:281–298)
Phase 4: Output contract and next action (SKILL.md:301–360)
```

**Phase 1** (SKILL.md:267–270): Inspect target (git diff, staged diff, file list, or commit range), load baseline standards, load `sk-code` surface evidence when detected.

**Phase 2** (SKILL.md:273–278): Load `sk-code` standards for detected surface, apply precedence matrix (baseline security/correctness always applies; surface style/process wins on conflicts; escalate if unresolved).

**Phase 3** (SKILL.md:281–298): Security and correctness first → quality/performance/test adequacy/contract safety/architecture → KISS/DRY/SOLID violations → removal opportunities. Produce findings ordered by severity. For every actionable finding, classify fix scope as `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation` (SKILL.md:287). Instance-only opt-out requires four conditions (SKILL.md:291–296).

**Phase 4 output format** (SKILL.md:304–329):
```markdown
## Code Review Summary
**Files reviewed**: X files, Y lines changed
**Overall assessment**: [APPROVE / REQUEST_CHANGES / COMMENT]
**Baseline used**: [sk-code (`sk-code-review`)]
**Surface evidence used**: [sk-code:<surface>]

## Findings
### P0 - Critical
1. [path:line] Title
   - Risk / User impact / Finding class / Scope proof / affectedSurfaceHints / Recommended fix
### P1 - High ...
### P2 - Advisory ...

## Removal/Iteration Plan
## Next Steps

Review status: APPROVED|REQUESTED_CHANGES|COMMENTED
```

5. TROUBLESHOOTING & FAQ

**Failure modes** (README.md:287–323, grounded in SKILL.md):

1. **Unknown surface** — Surface detection is unclear. Response: proceed baseline-only and disclose uncertainty in Review Context. Ask for: review scope, risk class, architecture lens priority, stack/context, desired output mode (SKILL.md:103–109).
2. **Baseline-vs-surface precedence** — Baseline security/correctness minimums are always enforced and cannot be relaxed by surface guidance. Surface style/process/verification conventions win only on non-security conflicts. Ambiguous conflicts are escalated, not guessed (SKILL.md:94–99, review_core.md:55–59).
3. **Findings drip-fed** — Single-pass output is mandatory; collect all findings, organize by severity, emit in one message (review_ux_single_pass.md:36–48, SKILL.md:58 single-pass is in the domain mapping).

**FAQ (grounded answers):**

1. **How does sk-code-review differ from deep-review?** `sk-code-review` is a single-pass interactive review (one output, findings-first, then next-step prompt). `deep-review` is an autonomous iterative review loop with externalized state, convergence detection, and P0/P1/P2 findings across multiple passes. They share `review_core.md` as common doctrine (review_core.md:8). `review_ux_single_pass.md` is `@review` only (quick_reference.md:32).
2. **How does sk-code-review differ from sk-code?** `sk-code-review` owns the review baseline (findings, severity, mandatory minimums). `sk-code` owns surface-specific code standards (style, build, test commands). `sk-code-review` delegates surface evidence to `sk-code` and uses `sk-code:<surface>` notation (SKILL.md:48–51).
3. **Can I add a new severity tier?** No. P0/P1/P2 are fixed. Adding tiers fragments the audit trail (README.md:343).
4. **Are security/correctness minimums really mandatory?** Yes. `security_checklist.md` and `code_quality_checklist.md` apply to every review. Skipping them is a violation. They apply even in baseline-only mode (SKILL.md:369, review_core.md:66–70).
5. **What replaced the old sk-code-* overlay model?** Per-stack review skills are gone. The pattern is single baseline + surface delegation: `sk-code-review baseline → sk-code:<surface> evidence → findings-first output` (README.md:338–339).

6. STALE FACTS IN CURRENT README

1. **SKILL.md LOC count wrong.** README §3.3 (line 164) claims "406 LOC". Real SKILL.md is 506 lines (confirmed by `read` output).

2. **Reference file count wrong.** README §3.3 (line 167) claims "9 reference files". The `references/` directory contains 10 files: `code_quality_checklist.md`, `fix-completeness-checklist.md`, `pr_state_dedup.md`, `quick_reference.md`, `removal_plan.md`, `review_core.md`, `review_ux_single_pass.md`, `security_checklist.md`, `solid_checklist.md`, `test_quality_checklist.md`. The README omits `pr_state_dedup.md`.

3. **Output contract section ordering disagrees with SKILL.md.** README §2 Quick Start Step 4 (lines 66–85) shows `## Findings` → `## Review Context` as the output structure. SKILL.md §4 Phase 4 (lines 304–329) defines: `## Code Review Summary` → `## Findings` → `## Removal/Iteration Plan` → `## Next Steps`. The README omits `## Code Review Summary`, `## Removal/Iteration Plan`, and `## Next Steps` from the canonical output, and places `## Review Context` where SKILL.md has no such section (SKILL.md puts baseline/surface info in `## Code Review Summary`).

4. **Output contract table disagrees with SKILL.md.** README §3.2 (lines 132–143) lists `## Code Review Summary` as "Yes" required and `## Review Context` as "Yes" required. SKILL.md's actual output contract (lines 304–329) has no `## Review Context` section — baseline and surface evidence go inside `## Code Review Summary`. The README also omits the mandatory final-line status (`Review status: APPROVED|REQUESTED_CHANGES|COMMENTED`) from its output contract table and from its Quick Start example.

5. **"Four core baseline references" claim is wrong.** README §2 Step 2 (line 51) says "The four core baseline references load on every review" and lists 4 files. SKILL.md §2 ALWAYS resources (line 88) lists **5** files that load on every invocation: `review_core.md`, `review_ux_single_pass.md`, `security_checklist.md`, `code_quality_checklist.md`, `fix-completeness-checklist.md`. The README omits `fix-completeness-checklist.md`.

6. **README §3.2 Core Reference Catalog omits pr_state_dedup.md.** The table (lines 146–157) lists 9 references but excludes `pr_state_dedup.md`, which is a real reference file documented in SKILL.md §10 (line 504).

7. **README structure section (§4, lines 186–201) omits pr_state_dedup.md** from the directory tree listing. The real `references/` directory has 10 files; the tree shows 9.

8. **Non-numbered `## Findings` and `## Review Context` sections in Quick Start break the heading sequence.** README uses `## Findings` and `## Review Context` inside §2 Step 4 (lines 67, 81) as examples, but these are not numbered subsections — they break the `## N. TITLE` heading convention used throughout the README and don't correspond to actual sections in SKILL.md's output contract.

9. **README §3.1 (line 39) claims "Single-pass UX: One review pass produces the full findings list (no incremental drip)"** — this is correct per `review_ux_single_pass.md`, but SKILL.md §2 domain mapping (line 76) references `review_ux_single_pass.md` as "interactive single-pass review behavior" rather than as a hard "single-pass UX" rule. Minor framing mismatch but not factually wrong.

10. **README §5 (line 211) says "Read-mostly with controlled write surfaces for review-doc creation. The skill does not modify reviewed code."** SKILL.md frontmatter (line 4) lists `allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]` — the README's characterization is an interpretation, not a direct quote. The `Write` and `Edit` tools are listed but SKILL.md §4 NEVER rule (line 380) says "Do not implement fixes during review." The claim "does not modify reviewed code" is correct per SKILL.md but the allowed-tools array includes write-capable tools.