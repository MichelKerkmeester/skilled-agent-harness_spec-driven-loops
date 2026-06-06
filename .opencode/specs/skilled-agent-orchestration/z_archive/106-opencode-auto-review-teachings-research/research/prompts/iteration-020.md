# Deep Research Iteration 020 of 20 — Final adjudication + author research/review-report.md

## SITUATION

You are running as **cli-devin SWE-1.6** in non-interactive print mode, dispatched as iteration 20 (FINAL) of a 20-iteration deep-research campaign on the upstream `dzianisv/opencode-plugins` `auto-review` package.

**Prior context (REQUIRED)**:
- Iters 001-006: file reads (README, example.json, auto-review.ts ×3, index/package/tsconfig)
- Iters 007-015: 9 mechanism extractions (event lifecycle, model selection, loop prevention, boundary, prompt template, config, logging, child sessions, cost)
- Iter 016: gap vs sk-code-review
- Iter 017: gap vs deep-research / deep-review / deep-agent-improvement
- Iter 018: gap vs mk-skill-advisor / mk-code-graph plugins + new-plugin hypothesis
- Iter 019: synthesis ranked teachings + reject list

**Your role**: produce `research/review-report.md` — the canonical synthesis artifact for the entire campaign. This is what packet 107 (remediation) will reference. This is what the operator will read to decide adoption priorities.

## TASK

### Step 1 — Aggregate all prior iter outputs

```bash
# Confirm all 19 prior iters exist + are non-empty
for N in 001 002 003 004 005 006 007 008 009 010 011 012 013 014 015 016 017 018 019; do
  L=$(wc -l < .opencode/specs/skilled-agent-orchestration/106-opencode-auto-review-teachings-research/research/iterations/iteration-$N.md 2>/dev/null || echo 0)
  echo "iter-$N: $L lines"
done
```

If any iter is missing or 0-line, NOTE THIS in the final report's Limitations section.

### Step 2 — Compose review-report.md

Write the file at `.opencode/specs/skilled-agent-orchestration/106-opencode-auto-review-teachings-research/research/review-report.md`.

Structure:

```markdown
---
title: "Upstream auto-review Research Report"
description: "20-iteration deep-research synthesis of the upstream dzianisv/opencode-plugins auto-review package. Extracted mechanisms, gap analyses, ranked teachings, reject list, and remediation packet recommendation."
trigger_phrases:
  - "106 review report"
  - "upstream auto-review findings"
  - "auto-review teachings ranked"
importance_tier: "high"
contextType: "review"
---

# Upstream auto-review Research Report

**Packet**: `skilled-agent-orchestration/106-opencode-auto-review-teachings-research`
**Pinned upstream SHA**: `<sha-from-iter-001>`
**Upstream URL**: <https://github.com/dzianisv/opencode-plugins/tree/issue-136-package-auto-review/packages/auto-review>
**Iterations**: 20 cli-devin SWE-1.6 deep-research passes
**Date**: 2026-05-16

---

## 1. Executive Verdict

**TL;DR**: <one-paragraph verdict>

**Verdict label**: <TEACHINGS-AVAILABLE / NEEDS-FURTHER-INVESTIGATION / NO-NOVEL-PATTERNS>

**Key takeaways** (3-5 bullets):
- <bullet 1>
- <bullet 2>
- ...

---

## 2. Pinned Upstream SHA

`<full-40-char-sha>`

Pinned at iter-001 from `gh api repos/dzianisv/opencode-plugins/branches/issue-136-package-auto-review --jq '.commit.sha'`.

All findings reference this SHA.

---

## 3. Per-Mechanism Extraction (from iters 007-015)

For each of the 9 mechanisms, one subsection with:
- Definition (1-2 sentences)
- Upstream evidence (file:line)
- Key design choices (3-5 bullets)
- Reusability summary (1 paragraph)

### 3.1 Event-driven activation
<...>

### 3.2 Cross-model selection
<...>

### 3.3 Loop-prevention combinator
<...>

### 3.4 Boundary detection + min-tool-call gate
<...>

### 3.5 Prompt template
<...>

### 3.6 Config 3-tier + dynamic provider discovery
<...>

### 3.7 Diagnostic logging
<...>

### 3.8 Child-session isolation
<...>

### 3.9 Cost model
<...>

---

## 4. Gap Analyses (from iters 016-018)

### 4.1 vs sk-code-review
<table from iter-016 + commentary>

### 4.2 vs deep-research + deep-review + deep-agent-improvement
<table from iter-017 + commentary>

### 4.3 vs mk-skill-advisor + mk-code-graph + new-plugin hypothesis
<table from iter-018 + recommendation>

---

## 5. Ranked Teachings (from iter-019)

### 5.1 HIGH-impact (3+ items)
| Rank | Teaching | Target | Cost | Implementation path |
|------|----------|--------|------|---------------------|
| H-1 | | | | |
| H-2 | | | | |
| H-3 | | | | |
| (more if applicable) | | | | |

### 5.2 MEDIUM-impact
<same table>

### 5.3 LOW-impact
<same table>

### 5.4 Deep write-ups of top 3 HIGH-impact (verbatim from iter-019)
<H-1, H-2, H-3 detail blocks>

---

## 6. Reject List (from iter-019)

| ID | Pattern | Why reject |
|----|---------|-----------|
| R-1 | | |
| (more) | | |

---

## 7. Remediation Packet Recommendation

**Recommendation**: <open packet 107 with scope X / fold teachings incrementally / multi-phase structure>

**Scope outline** (if new packet recommended):
- Phase 1: <description>
- Phase 2: <description>
- Phase 3: <description>

**Estimated total effort**: <X hours / Y commits / Z PRs>

---

## 8. Limitations

1. <Limitation 1: e.g. any iter that came back abbreviated or failed>
2. <Limitation 2: e.g. assumption about Anthropic/OpenAI pricing for cost model>
3. <Limitation 3: e.g. upstream branch may merge / rebase, invalidating findings>

---

## 9. Cross-AI Verification Notes

This campaign was 20 iters all cli-devin SWE-1.6 (no separate verification phase). If a 5-iter verification pass is desired (matching the 015 / 037 cross-AI-verification pattern), a follow-on sub-packet could re-check the top-3 HIGH teachings using cli-opencode + deepseek-v4-pro.

---

## 10. Conclusion

<one-paragraph closing>
```

### Step 3 — Write directly to BOTH stdout AND the iteration file

The 015 campaign showed cli-devin sometimes writes to its CWD-relative path while emitting brief stdout. To survive that, write the FULL review-report.md content to:
- Primary: `research/review-report.md`
- Backup: `research/iterations/iteration-020.md` (rich Markdown content)

If your runtime cannot write to two paths, prefer `research/review-report.md` as the primary and emit a status line on stdout indicating where the full content lives.

### Step 4 — Append the final state JSONL line

```jsonl
{"type":"campaign_complete","run":20,"focus":"final adjudication","totalIters":20,"reviewReportLines":<N>,"highImpactTeachings":<count>,"mediumImpactTeachings":<count>,"lowImpactTeachings":<count>,"rejectListEntries":<count>,"executor":"cli-devin","model":"swe-1.6","pinnedSha":"<sha>","durationSec":<N>,"timestamp":"<ISO8601>"}
```

## SCOPE

- All 19 prior iter outputs
- The packet's spec.md (for cross-reference)
- **Primary write target: `research/review-report.md`**
- **Backup write target: `research/iterations/iteration-020.md`**

## VERIFICATION COMMANDS

```bash
# Confirm 19 prior iters exist
for N in 001 002 003 004 005 006 007 008 009 010 011 012 013 014 015 016 017 018 019; do
  L=$(wc -l < .opencode/specs/skilled-agent-orchestration/106-opencode-auto-review-teachings-research/research/iterations/iteration-$N.md 2>/dev/null || echo 0)
  echo "iter-$N: $L lines"
done

# Quick aggregate of iter-019 final teachings table
rg -A 50 'TEACHINGS' .opencode/specs/skilled-agent-orchestration/106-opencode-auto-review-teachings-research/research/iterations/iteration-019.md 2>/dev/null | head -60
```

## CONSTRAINTS

- READ-ONLY for source code; you CAN write to `research/review-report.md` and `research/iterations/iteration-020.md`.
- Cite specific iter outputs as source for every section (e.g. "from iter-008", "from iter-016 gap table").
- Final report ≥ 200 lines.
- Pin SHA must be the same as iter-001.

## COMMON FAILURE MODES

1. **Stdout-only emission**: cli-devin SWE-1.6 sometimes writes a brief summary to stdout while the rich content was already written to a file. The main agent will recover from `research/review-report.md` if it exists; if it doesn't, the main agent reads `research/iterations/iteration-020.md`. EITHER write target must contain the full content.
2. **Skipping the executive verdict label**: the verdict line is REQUIRED — pick one of TEACHINGS-AVAILABLE / NEEDS-FURTHER-INVESTIGATION / NO-NOVEL-PATTERNS.
3. **Incomplete teaching tables**: every TEACHINGS row needs a concrete file:line implementation path. "Update SKILL.md" is too vague.

## OUTPUT FORMAT

### Primary output: `research/review-report.md`

Full 10-section synthesis as described above (≥ 200 lines).

### Backup output: `research/iterations/iteration-020.md`

Same content (or at minimum: a brief summary of the actions taken + a pointer to `research/review-report.md`).

Then append the final state-jsonl line.

## ACCEPTANCE CRITERIA FOR THIS ITER

- [ ] `research/review-report.md` exists and ≥ 200 lines
- [ ] All 10 sections present (Executive, SHA, Per-Mechanism, Gap Analyses, Ranked Teachings, Reject List, Remediation, Limitations, Cross-AI Notes, Conclusion)
- [ ] Verdict label assigned (one of three values)
- [ ] Top-3 HIGH teachings deep write-ups included
- [ ] Reject list has ≥ 1 entry
- [ ] Remediation packet recommendation clear
- [ ] Pinned SHA cited
- [ ] State JSONL `campaign_complete` event appended
- [ ] `research/iterations/iteration-020.md` exists (either with full content OR with summary + pointer)

Begin.
