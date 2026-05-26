---
title: "sk-code-review: Findings-First Code Review Baseline"
description: "Stack-agnostic code review baseline with findings-first severity analysis (P0/P1/P2), mandatory security and correctness minimums, and surface-aware standards evidence delegated to sk-code. Replaces the old sk-code-* per-stack overlay model."
trigger_phrases:
  - "code review"
  - "pr review"
  - "review"
  - "audit"
  - "security review"
  - "quality gate"
  - "merge readiness"
  - "findings"
  - "blocking issues"
  - "request changes"
---

# sk-code-review

> The findings-first review baseline: severity-labeled findings with file:line evidence, mandatory security and correctness minimums, and surface-aware standards delegated to sk-code. Reviews start with what blocks shipping, not with summaries.

---

## 1. OVERVIEW

sk-code-review is the findings-first code review baseline. Every review starts with findings rather than summaries. Findings carry severity labels (`P0` critical / `P1` high / `P2` advisory), file:line evidence, a risk statement, a user-impact statement, and a recommended fix. The format is designed for reviewers who need to know what blocks shipping immediately, with detail available on demand.

The skill is stack-agnostic by design. It enforces universal review rules (security minimums (auth, input validation, secret handling, dependency posture), correctness minimums (error handling, edge cases, logic faults), code quality (KISS, DRY, complexity, SOLID adherence), and test quality (coverage of new behavior, no flaky tests introduced)) and delegates stack-specific standards to sk-code. When sk-code has detected a code surface, sk-code-review uses `sk-code:<surface>` as standards evidence. When the surface is unclear, sk-code-review proceeds baseline-only and discloses the uncertainty in the output's "Review Context" footer.

This replaces the old `sk-code-*` per-stack overlay model. There is no longer a per-stack review skill (e.g., `sk-code-review-go`, `sk-code-review-react`). Review now uses the single baseline + sk-code surface evidence pattern: `sk-code-review baseline → sk-code surface evidence → findings-first output`. The transition simplifies maintenance (one review skill instead of N) and makes the surface-vs-review concerns properly separated.

### Key Features

- **Findings-first format**: Reviews lead with findings (P0/P1/P2), not summaries
- **Three-tier severity**: `P0` critical (blocks merge), `P1` high (must fix soon), `P2` advisory (optional)
- **Mandatory security minimums**: Auth, input validation, secret handling, dependency posture (cannot be skipped)
- **Mandatory correctness minimums**: Error handling, edge cases, logic faults
- **Stack-agnostic baseline**: Universal rules apply to every code surface
- **sk-code surface delegation**: Standards evidence comes from sk-code's detected surface
- **Single-pass UX**: One review pass produces the full findings list (no incremental drip)
- **Removal plan support**: Findings can include code-removal recommendations with dependency analysis
- **Output contract**: Standardized markdown structure with Review Context footer

---

## 2. QUICK START

**Step 1: Activate the skill.**
sk-code-review activates automatically for review/audit/security/quality-gate requests via Skill Advisor. Manual invocation: read `SKILL.md` directly.

**Step 2: Load the baseline references.**
The four core baseline references load on every review:

```text
references/review_core.md            # Shared review doctrine
references/review_ux_single_pass.md  # Single-pass UX rules
references/security_checklist.md     # Mandatory security minimums
references/code_quality_checklist.md # Correctness, KISS, DRY checks
```

**Step 3: Load surface evidence from sk-code.**
sk-code-review pairs with sk-code for surface-specific standards. When sk-code has detected a surface (e.g., WEBFLOW, OPENCODE), use `sk-code:<surface>` as the standards source. When the surface is unclear, proceed baseline-only.

**Step 4: Produce findings-first output.**
Every review follows the canonical output contract:

```markdown
## Findings

### P0 - Critical
1. `path:line` Title
   - Risk
   - User impact
   - Recommended fix

### P1 - High
...

### P2 - Advisory
...

## Review Context

**Baseline used**: sk-code-review
**Surface evidence used**: sk-code:<surface> (or "baseline-only" if unclear)
```

---

## 3. FEATURES

### 3.1 FEATURE HIGHLIGHTS

The findings-first format is the central convention. A code review's most valuable output is the list of issues that block merge, not a narrative summary. Reviewers reading the output should see, in the first 30 seconds, which findings need action and which can ship as-is. The P0/P1/P2 severity tiers make this scannable: `P0` is "blocks merge. Must fix before approval," `P1` is "must fix soon. Track and address," `P2` is "advisory. Optional, would improve the code." Each finding carries `file:line` evidence so reviewers can jump directly to the source.

The mandatory minimums are non-negotiable. Every review checks security (authentication, input validation, secret handling, dependency posture per `security_checklist.md`) and correctness (error handling, edge cases, logic faults per `code_quality_checklist.md`). The minimums apply baseline-only if no surface evidence is available. Skipping the minimums to deliver a faster review is a violation. The minimums catalog is concrete (specific checks, not vague advice) so the agent knows what to verify.

The surface delegation pattern is the cleanest way to keep review stack-agnostic while still applying stack-specific standards. sk-code-review owns the universal rules (security, correctness, KISS, DRY, SOLID, test quality). sk-code owns the per-surface idioms (e.g., WEBFLOW Webflow Designer conventions, OPENCODE per-language standards). When both are loaded, the review applies universal + surface. When only baseline is loaded, the review applies universal and discloses the uncertainty.

The single-pass UX rule (per `review_ux_single_pass.md`) means the agent produces the complete findings list in one output rather than drip-feeding findings across multiple turns. Drip-feeding produces a poor reviewer experience because the human waits between findings and may close the session before the full set arrives. Single-pass means the agent collects all findings, organizes by severity, then emits the full list in one message.

Removal plan support handles the special case of "this code should not exist" findings. Some review findings recommend deleting code (dead branches, duplicate implementations, unused exports). The `removal_plan.md` reference walks dependency analysis (who imports this? what tests cover it? what would break?) so removal recommendations come with evidence rather than speculation.

### 3.2 FEATURE REFERENCE

**Severity Tiers**

| Tier | Meaning | Action |
| --- | --- | --- |
| `P0` Critical | Blocks merge | Must fix before approval |
| `P1` High | Real problem, not blocking but tracked | Fix in this PR or open follow-up |
| `P2` Advisory | Optional improvement | Author's call |

**Mandatory Minimums (every review)**

| Category | Reference | What's Checked |
| --- | --- | --- |
| Security | `security_checklist.md` | Auth surface, input validation, secret handling, dependency posture, injection vectors |
| Correctness | `code_quality_checklist.md` | Error handling, edge cases, logic faults, contract adherence |
| Code quality | `code_quality_checklist.md` | KISS, DRY, complexity, naming clarity |
| Test quality | `test_quality_checklist.md` | Coverage of new behavior, no flaky tests introduced |
| SOLID | `solid_checklist.md` | When applicable (OO design contexts) |

**Surface Evidence Sources**

| Source | When Used |
| --- | --- |
| `sk-code:webflow` | sk-code detected WEBFLOW surface |
| `sk-code:opencode` | sk-code detected OPENCODE surface |
| `sk-code:motion_dev` | Motion.dev intent active over WEBFLOW |
| `baseline-only` | Surface unclear. Review uses universal rules only |

**Output Contract** (every review must follow)

| Section | Required | Content |
| --- | --- | --- |
| `## Findings` | Yes | Header for findings list |
| `### P0 - Critical` | If P0 exist | Numbered findings with file:line + risk + impact + fix |
| `### P1 - High` | If P1 exist | Same shape |
| `### P2 - Advisory` | If P2 exist | Same shape |
| `## Code Review Summary` | Yes | Brief summary after findings |
| `## Removal/Iteration Plan` | If removals recommended | Dependency analysis per removal |
| `## Next Steps` | Yes | What the author should do |
| `## Review Context` | Yes | Baseline + surface evidence used |

**Core Reference Catalog**

| Reference | Purpose |
| --- | --- |
| `review_core.md` | Shared review doctrine and findings-first rationale |
| `review_ux_single_pass.md` | Single-pass output rules (no drip-feeding) |
| `security_checklist.md` | Mandatory security minimums |
| `code_quality_checklist.md` | Correctness + KISS + DRY checks |
| `test_quality_checklist.md` | Test coverage and quality checks |
| `solid_checklist.md` | SOLID principles for OO contexts |
| `removal_plan.md` | Code-removal dependency analysis |
| `fix-completeness-checklist.md` | Verifies a fix is complete (no half-fixes) |
| `quick_reference.md` | One-page severity + minimums cheat sheet |

### 3.3 SKILL STATISTICS

| Metric | Value |
| --- | --- |
| Skill version | 1.2.0.0 |
| SKILL.md size | 406 LOC |
| Severity tiers | 3 (`P0` critical, `P1` high, `P2` advisory) |
| Mandatory minimums | Security + correctness (cannot be skipped) |
| Reference files | 9 (review_core, review_ux_single_pass, security_checklist, code_quality_checklist, solid_checklist, test_quality_checklist, removal_plan, fix-completeness-checklist, quick_reference) |
| Surface evidence source | `sk-code` (delegated) |
| Output contract | Findings-first markdown with Review Context footer |

### 3.4 COMPARISON WITH RELATED SKILLS

| Capability | sk-code-review | sk-code | sk-doc |
| --- | --- | --- | --- |
| Findings-first review | Yes (P0/P1/P2) | No | No |
| Severity labels with evidence | Yes | No | No |
| Security minimums enforced | Yes (mandatory) | No | No |
| Surface-aware standards | Delegated to sk-code | Yes (native) | No |
| Code implementation | No | Yes | No |
| Documentation quality | No | No | Yes |
| Old per-stack overlay model | Replaced | n/a | n/a |

---

## 4. STRUCTURE

```text
sk-code-review/
├── SKILL.md                              # Findings-first baseline contract (406 LOC)
├── README.md                             # This file
└── references/
    ├── review_core.md                    # Shared review doctrine
    ├── review_ux_single_pass.md          # Single-pass UX rules
    ├── quick_reference.md                # Severity + minimums cheat sheet
    ├── security_checklist.md             # Mandatory security minimums
    ├── code_quality_checklist.md         # Correctness, KISS, DRY checks
    ├── solid_checklist.md                # SOLID principles (OO contexts)
    ├── test_quality_checklist.md         # Test coverage and quality
    ├── removal_plan.md                   # Code-removal dependency analysis
    └── fix-completeness-checklist.md     # Verifies fix completeness
```

---

## 5. CONFIGURATION

No configuration is required. The findings-first format and mandatory minimums are hardcoded.

**Allowed-tools array** (frontmatter, do not modify)

`[Read, Write, Edit, Bash, Glob, Grep]`. Read-mostly with controlled write surfaces for review-doc creation. The skill does not modify reviewed code. It only reads and produces findings.

**Severity tier rules** are non-overridable. `P0`, `P1`, `P2` definitions live in `review_core.md`. Reviewers should not invent new tiers or remap existing ones per review.

**Mandatory minimums** apply to every review. Skipping security or correctness checks to produce a faster review is a violation. The minimums apply even when surface evidence is unavailable (`baseline-only` mode).

**Surface evidence** is delegated to sk-code. sk-code-review does not detect surfaces itself. It consumes whatever surface sk-code has resolved. When sk-code is not loaded or the surface is UNKNOWN, the review proceeds in `baseline-only` mode and discloses the uncertainty in the Review Context footer.

---

## 6. USAGE EXAMPLES

**Review a PR with WEBFLOW surface evidence**

```text
Trigger: "review PR #42"
sk-code-review:
  Loads: review_core.md, review_ux_single_pass.md, security_checklist.md, code_quality_checklist.md
  sk-code surface: WEBFLOW (detected from src/2_javascript/ + Webflow.push markers)
  Surface evidence: sk-code:webflow
  Produces:
    ## Findings
    ### P0 - Critical
    1. src/2_javascript/auth.js:42. Auth token logged to console
       - Risk: secret leakage in browser console
       - User impact: any user with DevTools open sees the token
       - Recommended fix: remove the console.log; use Sentry breadcrumbs without the token

    ### P1 - High
    1. src/2_javascript/scroll.js:88. Scroll handler not debounced
       - Risk: 60+ events/sec under fast scroll
       - User impact: jank on low-end devices
       - Recommended fix: wrap in lodash.debounce(handler, 16)

    ## Review Context
    Baseline used: sk-code-review
    Surface evidence used: sk-code:webflow
```

**Baseline-only review when surface is unclear**

```text
Trigger: "audit this code snippet" (snippet pasted in chat, no repo context)
sk-code-review:
  Loads: review_core.md, security_checklist.md, code_quality_checklist.md
  sk-code surface: UNKNOWN (no repo, no markers)
  Surface evidence: baseline-only
  Produces findings using universal rules + discloses uncertainty in Review Context footer
```

**Review with removal recommendation**

```text
Trigger: "review this refactor"
Diff: removes the old auth helper, adds a new session manager
sk-code-review:
  Findings (excerpt):
    ### P1 - High
    1. src/auth/legacy_helper.js:1. Removed code still imported by 3 callers
       - Risk: build break in callers
       - User impact: deploy failure
       - Recommended fix: see Removal/Iteration Plan below

    ## Removal/Iteration Plan
    legacy_helper.js callers (3):
      - src/api/login.js:12
      - src/api/register.js:18
      - tests/auth.test.js:34
    Migration order: update tests/auth.test.js first (no production impact),
                     then api/login.js + api/register.js together (atomic).
```

---

## 7. TROUBLESHOOTING

**Review missing P0/P1/P2 sections**

What you see: The output has findings as a flat list without severity grouping, or has only one severity tier and the others are absent without explanation.

Common causes: The agent skipped severity classification, or the agent emitted findings before classifying them, or the output contract was bypassed.

Fix: Re-read SKILL.md §4 RULES and the output contract. Every finding must carry a severity label. If no findings of a tier exist, the section can be omitted (e.g., no P0 → no `### P0 - Critical` section), but if any exist they must be grouped under the right tier. The findings-first format is non-negotiable.

---

**Mandatory minimums skipped**

What you see: The review covers the diff's surface area but doesn't address security or correctness. The Review Context footer claims the minimums were checked but no security or correctness findings appear, and the diff actually has visible security or correctness issues.

Common causes: The agent treated the minimums as advisory rather than mandatory, or the agent ran out of context budget before checking the minimums, or the agent assumed the minimums were "covered by other tooling."

Fix: Re-run the review with explicit minimum checks. The `security_checklist.md` and `code_quality_checklist.md` reference files are non-negotiable. If the diff genuinely has no security or correctness issues, state that explicitly in the Review Context footer rather than silently omitting.

---

**Findings drip-fed across multiple turns**

What you see: The agent emits 2-3 findings, asks "should I continue?", emits 2-3 more, asks again, and the full review takes many turns.

Common causes: The agent read `review_ux_single_pass.md` as advisory rather than mandatory, or the agent is mirroring a different review workflow.

Fix: Single-pass output is the rule. Collect all findings first, organize by severity, emit the full list in one message. Drip-feeding produces a poor reviewer UX because the human waits between turns and may close the session early.

---

**Surface evidence unavailable but review proceeds with surface claims**

What you see: The Review Context footer says `sk-code:webflow` but sk-code wasn't loaded, or the surface evidence is fabricated.

Common causes: The agent assumed surface evidence based on prompt vocabulary rather than sk-code's detection output, or sk-code was loaded but resolved to UNKNOWN and the agent claimed a surface anyway.

Fix: Use `baseline-only` in the Review Context footer when sk-code is not loaded or resolved to UNKNOWN. Never fabricate surface evidence. The Review Context is part of the audit trail, and false claims undermine reviewer trust.

---

## 8. FAQ

**Q: Why is the review findings-first instead of summary-first?**

A: A review's most valuable signal is "what blocks merge?" That's a finding, not a summary. Reviewers reading a summary first have to read the whole thing before they know what action to take. Reviewers reading findings first see the action items immediately and can scan the rest on demand. The format prioritizes reviewer time over narrative completeness.

**Q: When should I use baseline-only vs. surface evidence?**

A: Use surface evidence when sk-code has resolved a surface (WEBFLOW, OPENCODE, or MOTION_DEV intent over WEBFLOW). Use baseline-only when sk-code returned UNKNOWN, when sk-code wasn't loaded, or when the review covers a code snippet without repo context. Always disclose which mode you used in the Review Context footer. The audit trail matters.

**Q: What replaced the old `sk-code-*` overlay model?**

A: Per-stack review skills (`sk-code-review-go`, `sk-code-review-react`, etc.) are gone. The new pattern is single baseline + surface delegation: `sk-code-review baseline → sk-code:<surface> evidence → findings-first output`. Stack-specific standards live in sk-code's per-surface references. Review rules live here in sk-code-review. The split keeps review stack-agnostic while still applying stack-specific standards.

**Q: Can I add a new severity tier?**

A: No. P0/P1/P2 are fixed. Adding tiers (e.g., "P3", "blocker", "nit") fragments the audit trail and makes findings harder to compare across reviews. If a finding doesn't fit P0/P1/P2, re-evaluate the severity rather than inventing a new tier.

**Q: Are the security and correctness minimums really mandatory?**

A: Yes. The `security_checklist.md` and `code_quality_checklist.md` reference files apply to every review. Skipping them produces a review that may miss high-impact issues. The minimums apply even in baseline-only mode. They are the universal rules that don't depend on surface knowledge.

---

## 9. RELATED DOCUMENTS

| Resource | Path | Purpose |
| --- | --- | --- |
| SKILL.md | `.opencode/skills/sk-code-review/SKILL.md` | Findings-first baseline with full output contract |
| Review core | `references/review_core.md` | Shared review doctrine and findings-first rationale |
| Single-pass UX | `references/review_ux_single_pass.md` | Single-pass output rules |
| Security checklist | `references/security_checklist.md` | Mandatory security minimums |
| Code quality checklist | `references/code_quality_checklist.md` | Correctness + KISS + DRY |
| Test quality checklist | `references/test_quality_checklist.md` | Test coverage and quality |
| SOLID checklist | `references/solid_checklist.md` | SOLID principles (OO contexts) |
| Removal plan | `references/removal_plan.md` | Code-removal dependency analysis |
| Fix completeness | `references/fix-completeness-checklist.md` | Verifies fix completeness |
| Quick reference | `references/quick_reference.md` | One-page severity + minimums cheat sheet |
| sk-code | `.opencode/skills/sk-code/` | Surface-aware code skill (provides surface evidence) |
| sk-doc | `.opencode/skills/sk-doc/` | Documentation quality enforcement |
| sk-git | `.opencode/skills/sk-git/` | Git workflow orchestration |
| system-spec-kit | `.opencode/skills/system-spec-kit/` | Spec folder lifecycle |
