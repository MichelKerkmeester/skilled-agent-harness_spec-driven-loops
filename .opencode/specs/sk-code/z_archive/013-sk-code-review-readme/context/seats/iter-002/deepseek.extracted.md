# 1. EXACT INVOCATION

**Dispatch mechanism:**
- The skill is invoked via the `@review` agent (reference: `.opencode/skills/sk-code-review/SKILL.md:20`: "A workflow dispatches `@review` for pre-commit or gate validation" and SKILL.md:422: "Primary review baseline for `@review` agents in `.opencode/agents/review.md`").
- Before the reviewer LLM sees the prompt, the dispatcher/agent MUST prepend the literal two-line string `CODE-REVIEW\n\n` as the first two lines (SKILL.md:58): "The dispatcher / agent assembling the sk-code-review prompt MUST prepend `CODE-REVIEW\n\n` as the first two lines of the rendered prompt before the reviewer LLM sees it."
- Used for pre-commit and gate validation workflows (SKILL.md:19).

**Review-only no-edit contract:**
- SKILL.md:380 (NEVER rule): "Do not implement fixes during review. Report findings only; implementation is a separate follow-up step."
- SKILL.md:31-32: Use case 1 is "Review-only pass: findings-first output with no code edits."
- The allowed-tools frontmatter (SKILL.md:4) includes `Write` and `Edit` but the skill description and rules limit them to review-doc creation, not modifying reviewed code.

**Severity taxonomy:**
Labels are `P0`, `P1`, `P2` (SKILL.md:285-286: "Produce findings ordered by severity (`P0`, `P1`, `P2`).").

Definitions from `.opencode/skills/sk-code-review/references/review_core.md:20-24`:
| Level | Meaning | Handling |
|-------|---------|----------|
| `P0`  | Blocker: exploitable security issue, auth bypass, destructive data loss | Block merge |
| `P1`  | Required: correctness bug, spec mismatch, must-fix gate issue | Fix before merge |
| `P2`  | Suggestion: non-blocking improvement, documentation polish, style or maintainability follow-up | Optional or schedule follow-up |

**Finding classes** (in addition to severity, SKILL.md:287-288):
`instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, `test-isolation`

**Output shape** (SKILL.md:304-358):
- Structured markdown: `## Code Review Summary`, `## Findings` (with `### P0 - Critical`, `### P1 - High`, `### P2 - Advisory`), `## Removal/Iteration Plan`, `## Next Steps`.
- **Mandatory final-line exact-string contract** (SKILL.md:335-360): exactly one of `Review status: APPROVED`, `Review status: REQUESTED_CHANGES`, or `Review status: COMMENTED` as the absolute final line (no trailing whitespace, no variation).

---

# 2. CAPABILITY ROSTER

**Baseline-plus-surface ownership split** (SKILL.md:49-50, :96-99):
- **Baseline** (sk-code-review, always enforced): security/correctness minimums, findings-first doctrine, severity taxonomy, evidence rules. These "cannot be relaxed by surface guidance" (review_core.md:70).
- **Surface** (sk-code, when available): style/process conventions, build/test commands, per-surface idioms. Surface guidance overrides baseline generic style/process advice (SKILL.md:97).
- When surface is unknown: review against baseline security/correctness only, disclose uncertainty (SKILL.md:51).

**Findings-first contract** (SKILL.md:366-367, :280-288):
- ALWAYS: "Keep findings first; summaries follow findings."
- Phase 3 analysis order: security/correctness → quality/performance → test adequacy → architecture → KISS/DRY/SOLID → removal opportunities.

**Risk checklists (10 reference files):**

| File | Domain |
|------|--------|
| `references/security_checklist.md` | Auth, injection, secrets, runtime reliability, concurrency, rate limiting, CSP/headers, dependency supply-chain, audit logging, privacy |
| `references/code_quality_checklist.md` | Error handling, performance/scaling, boundary conditions, data flow/contract safety, maintainability, KISS/DRY |
| `references/solid_checklist.md` | SRP/OCP/LSP/ISP/DIP prompts, architecture smells (god module, shotgun surgery, etc.), refactor guidance |
| `references/test_quality_checklist.md` | Coverage quality, test structure/clarity, independence/reliability, smell detection, test pyramid awareness |
| `references/fix-completeness-checklist.md` | Finding classes, same-class producer & consumer inventories, algorithmic/matrix/hostile-env verification |
| `references/removal_plan.md` | Safe-now vs deferred deletion, dependency analysis, rollback planning |
| `references/review_core.md` | Shared doctrine (also consumed by `@deep-review`): severity, evidence, findings schema, baseline+surface precedence |
| `references/review_ux_single_pass.md` | Single-pass UX rules, report flow, PR/pre-commit guidance |
| `references/quick_reference.md` | Routing index across references |
| `references/pr_state_dedup.md` | M-1 signature computation, cache format, skip behavior (packet #110 addition) |

**PR-State Efficiency Gates** (SKILL.md §9, added in Packet 110):
- **M-1 (Content-Hash Dedup)**: sha256-based signature of (commit_subject + unit-separator + diff_content_hash), cached in `.opencode/.sk-code-review-cache/<repo-ref>.jsonl`, 100-entry retention, skip via `COMMENTED (no changes since last review at <sha>)`.
- **M-2 (Opt-In Minimum Evidence Gate)**: env var `SK_CODE_REVIEW_MIN_CHANGED_LINES`, conservative skip taxonomy (never skips auth, config, persistence, dependency manifests, sandboxing, public-facing responses).

---

# 3. KEY FILES

| Path | Role | Shared with deep-review? |
|------|------|--------------------------|
| `SKILL.md` | Master skill definition, smart routing, output contract, rules, PR-state gates (506 lines) | No |
| `README.md` | Human-facing documentation (368 lines) | No |
| `references/review_core.md` | Shared severity definitions, evidence rules, findings schema, baseline+surface precedence | **Yes** (`@review` and `@deep-review`, per review_core.md:8) |
| `references/review_ux_single_pass.md` | Interactive single-pass report flow, next-step prompts, PR/pre-commit guidance | No (`@review` only, per quick_reference.md:32) |
| `references/quick_reference.md` | Lightweight routing index for the split reference architecture | No |
| `references/security_checklist.md` | 11-section security + reliability checklist | No |
| `references/code_quality_checklist.md` | Correctness, performance, KISS, DRY, maintainability checklist | No |
| `references/solid_checklist.md` | SOLID (SRP/OCP/LSP/ISP/DIP) + architecture smells | No |
| `references/removal_plan.md` | Safe-now vs deferred removal planning template | No |
| `references/test_quality_checklist.md` | Test coverage, reliability, smell detection, test pyramid | No |
| `references/fix-completeness-checklist.md` | Fix completeness verification with producer/consumer inventories | No |
| `references/pr_state_dedup.md` | M-1 dedup gate: signature scheme, cache format, retention rules | No |
| `changelog/` | Version changelogs (v1.1.0.0, v1.2.0.0, v1.3.0.0) | No |
| `manual_testing_playbook/` | 19-file testing suite (index + 6 topic directories with scenarios) | No |
| `graph-metadata.json` | Skill graph metadata for indexing | No |
| `.opencode/` | Internal skill state directory | No |

**Note:** SKILL.md references `assets/review/...` (line 76) and `assets/` (lines 82, 118) as resource bases, but **no `assets/` directory exists** physically.

---

# 4. WORKFLOWS & OUTPUTS

**Documented review flow** (SKILL.md:55-64):
```text
STEP 0: Load `sk-code-review` baseline + `sk-code` surface evidence.
        Dispatcher MUST prepend `CODE-REVIEW\n\n` as first two prompt lines.
STEP 1: Score intents (top-2 when ambiguity delta <= 1.0)
Phase 1: Scope and baseline checks — inspect diff, load baseline, load surface evidence
Phase 2: Overlay alignment — apply precedence matrix, escalate if conflict
Phase 3: Findings-first analysis — security/correctness → quality → architecture → KISS/DRY/SOLID → removal
Phase 4: Output contract and next action — produce structured markdown, request explicit next action
```

**Phase 3 analysis order** (SKILL.md:280-288):
1. Security and correctness first
2. Quality/performance, test adequacy, contract safety, architecture
3. KISS/DRY and SOLID violations
4. Removal opportunities (safe-now vs deferred)
5. Findings ordered by severity (P0, P1, P2)
6. Finding class classification for every actionable finding

**Findings output format** (SKILL.md:304-329):
```markdown
## Code Review Summary
**Files reviewed**: X files, Y lines changed
**Overall assessment**: [APPROVE / REQUEST_CHANGES / COMMENT]
**Baseline used**: [sk-code (`sk-code-review`)]
**Surface evidence used**: [sk-code:<surface>]

## Findings
### P0 - Critical
1. [path:line] Title
   - Risk
   - User impact
   - Finding class: [instance-only | class-of-bug | cross-consumer | algorithmic | matrix/evidence | test-isolation]
   - Scope proof: [grep/test evidence]
   - affectedSurfaceHints: [optional string array]
   - Recommended fix

### P1 - High
...

## Removal/Iteration Plan

## Next Steps
```

**Mandatory final-line contract** (SKILL.md:335-360):
Every review must end with exactly one of:
- `Review status: APPROVED`
- `Review status: REQUESTED_CHANGES`
- `Review status: COMMENTED`

as the absolute final line with no trailing whitespace or variation. Downstream automation parses via exact string match.

**Single-pass UX** (references/review_ux_single_pass.md:20-23): Publish all findings in one message. After findings, ask user what to do next with concrete options (fix all, fix P0+P1 only, fix selected, no changes). Do not drip-feed findings across turns.

---

# 5. TROUBLESHOOTING & FAQ

**Concrete failure modes documented** (README.md §7):

| Failure | Root Cause | Resolution |
|---------|-----------|------------|
| Missing P0/P1/P2 sections | Agent skipped severity classification or bypassed output contract | Re-read SKILL.md §4 RULES; every finding must carry severity label |
| Mandatory minimums skipped | Agent treated minimums as advisory or ran out of context budget | Re-run with explicit minimum checks; `security_checklist.md` and `code_quality_checklist.md` are non-negotiable |
| Findings drip-fed across turns | Agent read `review_ux_single_pass.md` as advisory | Single-pass is the rule; collect all findings, organize, emit in one message |
| Surface evidence unavailable but claims made | Agent assumed surface based on prompt vocabulary | Use `baseline-only` when sk-code returned UNKNOWN or wasn't loaded |
| Unknown surface (SKILL.md:101-109) | Ambiguous stack detection | Fallback checklist: confirm scope, risk priority, architecture lens, stack context, output mode |
| Baseline vs surface conflict (SKILL.md:99) | Non-deterministic precedence | Escalate — ask for clarification; do not guess |

**FAQ — 5 most likely questions** (from README.md §8 + SKILL.md):

1. **Why findings-first instead of summary-first?**
   A review's most valuable signal is "what blocks merge?" — a finding, not a summary. Reviewers see action items immediately (SKILL.md:366-367: "Keep findings first; summaries follow findings").

2. **When baseline-only vs surface evidence?**
   Surface evidence when sk-code has resolved a known surface. Baseline-only when sk-code returned UNKNOWN, wasn't loaded, or review covers a snippet with no repo context. Disclose mode in output (review_core.md:50-53).

3. **What replaced old `sk-code-*` per-stack skills?**
   Single baseline + surface delegation model: `sk-code-review baseline → sk-code:<surface> evidence → findings-first output`. No per-stack review skills exist (e.g., no `sk-code-review-go`). This keeps review stack-agnostic while still applying surface-specific standards (SKILL.md:96-98, README.md §8 Q3).

4. **How does sk-code-review differ from deep-review?**
   sk-code-review is a single-pass interactive review producing one findings list. deep-review runs autonomous iterative passes with convergence detection and P0/P1/P2 findings across multiple dimensions. Both consume the shared `review_core.md` doctrine. deep-review owns additional JSONL state, deltas, and convergence logic. sk-code-review is human-facing; deep-review is iteration-based.

5. **How does sk-code-review differ from sk-code?**
   sk-code-review owns review (findings, severity, security/correctness minimums, output contracts). sk-code owns surface-specific coding standards, build/test commands, and per-surface style/process conventions. sk-code provides evidence; sk-code-review uses it. sk-code-review does not implement code; sk-code does (README.md §3.4 comparison table, SKILL.md:424: "Complements, but does not replace, `sk-code` surface-specific standards evidence").

---

# 6. STALE FACTS IN CURRENT README

**Six discrepancies found between `README.md` and the real files:**

| # | README claim | Real file fact | Evidence |
|---|-------------|---------------|----------|
| 1 | "9" reference files (section 3.3: "Reference files: 9") and structure diagram (section 4) lists 9 files | **10** reference files exist — `pr_state_dedup.md` is omitted | `ls references/` returns 10 entries; SKILL.md §10 links to `references/pr_state_dedup.md` |
| 2 | SKILL.md size "406 LOC" (sections 3.3 and 4) | SKILL.md has **506 lines** total; sections §9-10 (PR-State Efficiency Gates) were added after this line count was written | `wc -l SKILL.md` = 506 |
| 3 | Output contract uses `## Review Context` as a mandatory heading (section 3.2 table, section 2 Step 4 example) | SKILL.md has **no `## Review Context` heading** anywhere; baseline+surface info lives inside `## Code Review Summary` | `rg "## Review Context" SKILL.md` returns exit code 1 (not found) |
| 4 | Output contract table (section 3.2) orders `## Findings` *before* `## Code Review Summary` | SKILL.md output contract (lines 304-329) places `## Code Review Summary` **first**, *then* `## Findings` | SKILL.md:304-314 |
| 5 | "Quick Start" Step 2 lists **4** core baseline references | SKILL.md's ALWAYS load level (line 88) requires **5**: the four listed + `references/fix-completeness-checklist.md` | SKILL.md:88 |
| 6 | Step 4 example output format: `sk-code:<surface> (or "baseline-only" if unclear)` (parenthesized alternative in output) | SKILL.md output format: `**Surface evidence used**: [sk-code:<surface>]` — no parenthesized "or baseline-only" in the contract | SKILL.md:310 |