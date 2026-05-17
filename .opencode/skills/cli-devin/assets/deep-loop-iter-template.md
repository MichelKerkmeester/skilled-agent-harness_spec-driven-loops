---
title: "Devin CLI — Deep-Loop Iter Prompt Template (SWE-1.6)"
description: "Copy-paste prompt-body skeletons for cli-devin iter dispatches when /spec_kit:deep-research or /spec_kit:deep-review resolves the executor to cli-devin. Three stage-specific skeletons (research iter, review iter, synthesis) paired with the matching --agent-config recipe at .opencode/skills/cli-devin/assets/."
---

# Deep-Loop Iter Prompt Template (cli-devin, SWE-1.6)

> Copy-paste skeleton for `--prompt-file` payloads when `/spec_kit:deep-research` or `/spec_kit:deep-review` resolves the executor to `cli-devin`. Pair this template with the matching `--agent-config` recipe from `.opencode/skills/cli-devin/assets/`. The recipe locks tools and permissions at parse time; this template carries the prompt-body contract (framework tag, pre-planning block, scoped RQ or review angle, output contract).
>
> For the full contract: [`references/deep-loop-iter-contract.md`](../references/deep-loop-iter-contract.md). For recipe selection: [`references/agent-config-recipes.md`](../references/agent-config-recipes.md).

---

## 1. OVERVIEW

Three skeletons follow — one per recipe / stage of the deep-loop pipeline. Each skeleton is the prompt body that ships in `--prompt-file`, paired with the matching `--agent-config` recipe. The Block ordering section below codifies the four-block contract that every iter prompt MUST honor; the three skeletons (research, review, synthesis) demonstrate the contract concretely for each stage.

| Stage | Recipe | Skeleton below |
|-------|--------|----------------|
| Research iter | `agent-config-deep-research-iter.json` | "Research-iter skeleton" |
| Review iter | `agent-config-deep-review-iter.json` | "Review-iter skeleton" |
| Synthesis | `agent-config-synthesis.json` | "Synthesis skeleton" |

---

## 2. BLOCK ORDERING

Every iter prompt MUST include these four blocks in this exact order. The dispatcher (`spec_kit_deep-research_auto.yaml` or `spec_kit_deep-review_auto.yaml` `if_cli_devin:` branch) is the canonical authority — this template documents the shape.

1. **Framework tag** (line 1)
2. **Pre-planning block**
3. **Scoped RQ or review angle**
4. **Output contract**

---

## 2.5. Sequential_thinking pre-output (mandatory v1.0.4.0+)

Every iter prompt must mention: "Sequential_thinking is mandatory before output." The recipe's `mcp_servers` + `system_instructions` enforce this at the runtime layer.

Per-stage thought minimum (5 thoughts):
- Research iter: pre-planning / evidence / findings / gaps / JSONL row
- Review iter: pre-planning / reading / dimension check / findings tag / JSONL row
- Synthesis: inventory / grouping / contradictions / output / provenance

Add a one-line marker near the top of the prompt body so the model sees it: "Apply sequential_thinking with ≥ 5 thoughts BEFORE emitting the output."

---

## 3. RESEARCH-ITER SKELETON

```markdown
Framework: RCAF

# Iter NNN — Research

## Pre-planning

**Sequential_thinking mandatory**: call mcp__sequential_thinking__sequentialthinking with ≥ 5 thoughts before producing the output. The recipe's mcp_servers + system_instructions enforce this — do not skip.

Goal: <one-line goal scoped to this iter — must fit on one line>

Steps:
1. Read <evidence-files-list> with file:line citations.
2. Run targeted greps for <patterns-list>.
3. Cross-reference against prior iters at research/iterations/iteration-{1..NNN-1}.md.
4. Identify gaps the prior iters missed.

Acceptance criteria per step:
- Step 1: ≥3 file:line citations per claim.
- Step 2: explicit grep command + result count.
- Step 3: each cross-reference cites the prior iter number.
- Step 4: each gap stated as a new RQ for a later iter.

Stop condition: emit the required output then exit. Do not request further input.

Verification: count of file:line citations matches claim count; JSONL delta row appended.

## Research Question (scoped)

<single-question for this iter, scoped tightly enough that SWE-1.6 can answer in one pass>

## Output contract

Write to: research/iterations/iteration-NNN.md

Required heading structure:
- # Iter NNN — <topic>
- ## Question
- ## Evidence (file:line citations required)
- ## Findings (numbered)
- ## Gaps for next iter
- ## JSONL delta row (paste the appended row at the end for verification)

Required JSONL fields:
- iter_id, timestamp_utc, executor=cli-devin, model=swe-1.6, status, findings_count, gaps_count, primary_evidence_files

Every claim in the Findings or Evidence sections MUST be followed by a `<ref_file file="<absolute-path>" lines="N-M" />` tag. Inline prose-only claims are non-compliant. Aim for ≥ 3 ref_file tags per finding, ≥ 1 per evidence row.
```

---

## 4. REVIEW-ITER SKELETON

```markdown
Framework: RCAF

# Iter NNN — Review

## Pre-planning

**Sequential_thinking mandatory**: call mcp__sequential_thinking__sequentialthinking with ≥ 5 thoughts before producing the output. The recipe's mcp_servers + system_instructions enforce this — do not skip.

Goal: audit <packet-path> on dimension <dimension-name>.

Steps:
1. Read packet files: spec.md, plan.md, tasks.md, implementation-summary.md, checklist.md (if present).
2. Apply the dimension-specific check (see Review angle below).
3. Tag findings P0 / P1 / P2 with explicit reproduction evidence.
4. Cross-reference against prior review iters at research/iterations/iteration-{1..NNN-1}.md to avoid duplicate findings.

Acceptance criteria per step:
- Step 1: every read file has a file:line citation if cited.
- Step 2: every finding cites the dimension check that surfaced it.
- Step 3: P0 = blocks shipping, P1 = ship-with-known-risk, P2 = nice-to-have polish.
- Step 4: each duplicate-flagged finding cites the prior iter number.

Stop condition: emit findings then exit. Do not request further input.

Verification: every finding has a file:line + dimension tag + priority.

## Review angle (scoped)

Dimension: <one-of: drift | consistency | completeness | freshness | scope-discipline | acceptance-sharpness | risk-acknowledgment | out-of-scope-discipline>

Definition: <one-paragraph definition of how this dimension is evaluated for the target packet>

## Output contract

Write to: research/iterations/iteration-NNN.md

Required heading structure:
- # Iter NNN — Review on dimension <name>
- ## Dimension definition
- ## Findings
  - ### P0 (each with file:line + reproduction)
  - ### P1 (same)
  - ### P2 (same)
- ## Cross-reference (which prior-iter findings overlap with this iter)
- ## JSONL delta row

Required JSONL fields:
- iter_id, timestamp_utc, executor=cli-devin, model=swe-1.6, dimension, P0_count, P1_count, P2_count, primary_evidence_files

Every claim in the Findings or Evidence sections MUST be followed by a `<ref_file file="<absolute-path>" lines="N-M" />` tag. Inline prose-only claims are non-compliant. Aim for ≥ 3 ref_file tags per finding, ≥ 1 per evidence row.
```

---

## 5. SYNTHESIS SKELETON

```markdown
Framework: RCAF

# Synthesis — <research or review or delta-verified>

## Pre-planning

**Sequential_thinking mandatory**: call mcp__sequential_thinking__sequentialthinking with ≥ 5 thoughts before producing the output. The recipe's mcp_servers + system_instructions enforce this — do not skip.

Goal: consolidate N iter outputs into the canonical synthesis file.

Steps:
1. Read every research/iterations/iteration-NNN.md (range stated by dispatcher).
2. Read the JSONL delta state file.
3. Group findings by theme / dimension / track.
4. Resolve contradictions: prefer iters with stronger evidence (more file:line citations) when iters disagree.
5. Emit the consolidated output file at the path stated below.

Acceptance criteria per step:
- Step 1: count of iter files read matches the dispatcher's expected count.
- Step 2: JSONL row count matches Step 1 file count.
- Step 3: each theme bin has a one-line definition.
- Step 4: each contradiction-resolution cites both iter numbers.
- Step 5: output file matches the heading structure below.

Stop condition: emit the consolidated file then exit. Do not edit any other file.

Verification: file modified is exactly the output target; no other writes happened.

## Consolidation directive (scoped)

Output mode: <one-of: research-narrative | review-report | delta-verified>

Output path: <one-of: research/research.md | research/review-report.md | research/delta-verified.md>

## Output contract

Required heading structure (research-narrative):
- # Research synthesis
- ## Per-track findings (one section per track)
- ## Cross-track patterns
- ## Open questions
- ## Provenance (iter numbers → finding mapping)

Required heading structure (review-report):
- # Review report
- ## Per-dimension findings
- ## P0 (all P0 findings consolidated)
- ## P1 (all P1)
- ## P2 (all P2)
- ## Cross-dimension overlaps
- ## Verdict (PASS | CONDITIONAL | FAIL)

Required heading structure (delta-verified):
- # Verified delta
- ## EDIT entries (file:line + FROM/TO/REASON/ITER)
- ## NEW-FILE entries (path + intent + ITER source)
- ## DELETE entries (file:reason + ITER)

Every claim in the Findings or Evidence sections MUST be followed by a `<ref_file file="<absolute-path>" lines="N-M" />` tag. Inline prose-only claims are non-compliant. Aim for ≥ 3 ref_file tags per finding, ≥ 1 per evidence row.
```

---

## 6. VERBATIM GUARDRAILS

- Never insert backticks-only blocks without a leading instruction line — SWE-1.6 sometimes treats bare code blocks as "ambient context" rather than "act on this".
- Always cite acceptance criteria per step. SWE-1.6 truncates work when the stop condition is implicit.
- Always state the JSONL delta row requirement explicitly. Without it, ~30% of iters skip the row.
- Always state the output path. Without it, SWE-1.6 sometimes writes to a `_drafts/` subdir that the synthesis pass cannot find.
- Sequential_thinking is mandatory pre-output. Recipe's mcp_servers + system_instructions enforce; iter must comply or the dispatch is non-conforming.
- JSONL delta row is REQUIRED at the end of every iter output. Format inlined per prompt — do NOT back-reference "Same as iter NNN".
- Output begins at `# Iter NNN`. No preamble. The dispatcher captures stdout, which becomes the iter file directly (v1.0.4.0+ recipes have narrow Write scope that may obviate this, but the convention holds for compatibility).

## 7. RELATED

- [`.opencode/skills/cli-devin/references/deep-loop-iter-contract.md`](../references/deep-loop-iter-contract.md)
- [`.opencode/skills/cli-devin/references/agent-config-recipes.md`](../references/agent-config-recipes.md)
- [`.opencode/skills/cli-devin/assets/prompt_quality_card.md`](./prompt_quality_card.md)
- [`.opencode/skills/cli-devin/assets/prompt_templates.md`](./prompt_templates.md)
