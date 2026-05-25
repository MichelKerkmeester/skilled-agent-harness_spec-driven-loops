DEEP-RESEARCH

# Deep-Research Iteration 2 — ADVERSARIAL concrete re-verification of iter-1's negative

## ROLE

You are a deep-research LEAF iteration agent doing READ-ONLY adversarial verification. Iteration 1 swept the 5 deep-* skills and returned a NEGATIVE result (0 residual gaps) using spot-checks and the resource-map.yaml completion record. Your job is to DISTRUST that negative and try hard to BREAK it with CONCRETE evidence — run actual greps and on-disk diffs, do NOT trust resource-map.yaml's self-report. If after genuine effort you still find nothing, that confirms convergence (a valid, valuable negative). Before producing output, use the sequential_thinking tool (>=5 thoughts) to plan and reason, per your agent-config.

## STATE

Segment: 1 | Iteration: 2 of 10
Questions: 5/5 answered negative in iter-1 | Last focus: residual-gap sweep
Last 2 ratios: N/A -> 0.0 | Stuck count: 0
iter-1 verdict: NEGATIVE — 0 findings, 6 directions ruled out (all via spot-check + resource-map.yaml).
Next focus: CONCRETE adversarial verification — actually resolve every reference link, diff README structure trees against on-disk reality, and grep agent mirrors + command surfaces for stale paths. The weakness of iter-1 is that it trusted resource-map.yaml and used spot-checks; close that gap with exhaustive grep evidence.

Research Topic: Residual documentation and reference-structure gaps across the 5 deep-* skills after the 008 doc-evolution pass.
Iteration: 2 of 10
Focus Area: adversarial concrete re-verification

## SEED CONTEXT (read first)

- 008 audit record (treat as CLAIM to verify, NOT ground truth): `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/008-deep-skill-doc-evolution/001-spec-and-resource-map/resource-map.yaml`
- The 5 skills: `.opencode/skills/deep-loop-runtime/`, `.opencode/skills/deep-research/`, `.opencode/skills/deep-review/`, `.opencode/skills/deep-ai-council/`, `.opencode/skills/deep-agent-improvement/`
- iter-1 narrative (the negative you are testing): `../iterations/iteration-001.md`
- ALREADY FIXED (out of scope — do not re-report): the deep-research loop-driver stale `system-spec-kit/mcp_server/lib/deep-loop/` path bug.

## PRE-PLANNING (ordered, concrete, with acceptance criteria)

1. **Dangling-link resolution (all 5 skills):** for each skill, grep SKILL.md + README.md for `references/...` path mentions, then test each resolves on disk (`ls`/`test -f`). Acceptance: a list of any path that does NOT resolve, or "0 dangling across N links checked".
2. **README structure-tree vs on-disk:** for each subfoldered skill (deep-research, deep-review, deep-ai-council, deep-agent-improvement), compare the README's STRUCTURE ascii tree / "N files" prose against `find references -type f`. Acceptance: any tree that lists a file/folder not on disk, or omits one that is — or "trees match on-disk".
3. **Orphaned reference files:** for each skill, list `references/**/*.md` on disk and check each is linked from SKILL.md, README, or a sibling reference. Acceptance: any on-disk reference file with ZERO inbound links, or "0 orphans".
4. **Agent mirror + command stale paths:** grep `.claude/`, `.gemini/`, `.codex/`, and `.opencode/commands/deep/` for `references/<flat-oldname>` paths that pre-date the 008 subfoldering (e.g. bare `references/convergence.md`, `references/state_format.md`, `references/loop_protocol.md` without a subfolder). Acceptance: any stale flat path in a live (non-changelog) file, or "0 stale mirror/command paths".
5. **deep-loop-runtime flat-by-design check:** confirm deep-loop-runtime references/ is intentionally flat (resource-map.yaml says so) and its 4 consumers still resolve. Acceptance: confirmed or a concrete breakage.

Stop conditions: max 12 tool calls; findings only (no fixes). Negative knowledge is the expected and valid result — but it MUST be backed by actual grep/ls evidence this time, not resource-map.yaml's self-report.

## STATE FILES

All paths relative to repo root.
- iter-1 narrative (read): `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/008-deep-skill-doc-evolution/009-deep-research-gap-backstop/research/iterations/iteration-001.md`
- **YOUR ONLY WRITE TARGET** — iteration narrative: `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/008-deep-skill-doc-evolution/009-deep-research-gap-backstop/research/iterations/iteration-002.md`

## CONSTRAINTS

- LEAF agent. Do NOT dispatch sub-agents. Max 12 tool calls.
- Read-only: report findings, do not implement fixes.
- Back every claim with concrete grep/ls evidence (file:line or command result). Do NOT cite resource-map.yaml as proof of absence.

## OUTPUT CONTRACT (write EXACTLY ONE file)

Write ONLY the iteration narrative at `.../research/iterations/iteration-002.md`. Do NOT write or append to `deep-research-state.jsonl` and do NOT create any file under `deltas/` — the loop driver parses your narrative. Your agent-config grants Write to the iteration file only.

The narrative MUST have these H2 headings, in order: `## Focus`, `## Actions Taken`, `## Findings`, `## Questions Answered`, `## Questions Remaining`, `## Next Focus`, `## Ruled Out`.
- Under `## Findings`, give EACH residual gap its own `### P0|P1|P2 — <short label>` subheading + one line of detail with a `file:line` citation. If none, write: `No residual gaps found — iter-1 negative CONFIRMED by concrete grep/ls evidence.`
- Under `## Ruled Out`, list each direction you concretely verified clean, WITH the evidence (e.g. "0 dangling across 47 links checked").

End the file with a single fenced ```json block (the LAST thing in the file):

```json
{"newInfoRatio": 0.0, "status": "negative", "focus": "adversarial concrete re-verification", "findings": [], "ruledOut": ["<direction concretely verified clean + evidence>"]}
```

Emit the block even with zero findings (`"findings": []`, `"status": "negative"`, low `newInfoRatio`). newInfoRatio: a NEW gap iter-1 missed = 1.0; corroborating iter-1's negative with concrete evidence = low (0.0-0.1) to signal convergence.
