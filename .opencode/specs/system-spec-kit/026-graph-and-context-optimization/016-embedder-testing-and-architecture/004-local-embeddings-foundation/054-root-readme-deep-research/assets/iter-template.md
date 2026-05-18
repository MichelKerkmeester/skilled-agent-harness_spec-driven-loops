# Iter {ITER_NUM} — Track {TRACK}: {RQ_SHORT}

## SITUATION

You are doing one focused deep-research iteration on the project root README at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/README.md`. This is iteration {ITER_NUM} of 20 in a fixed-cap sweep. Track {TRACK} owns the focus for this iter.

The README was realigned in commit `2d4086743` (Phase D) + tagline-expanded in `652f7ef25`. Your job is to find drift, voice violations, or missing context that those single-pass audits missed.

## TASK

Answer this research question:

**RQ**: {RQ_FULL}

Cite concrete evidence (file path + line number, commit SHA, grep output) for every finding. Do NOT speculate; if you cannot verify a claim, mark it `UNVERIFIED` and move on.

## ACTION (your output schema)

Write ONE markdown file to:
`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-local-embeddings-foundation/054-root-readme-deep-research/research/iterations/iteration-{ITER_NUM}.md`

Schema:

```markdown
---
title: "Iter {ITER_NUM} — Track {TRACK}: {RQ_SHORT}"
iteration: {ITER_NUM}
track: {TRACK}
focus: "{RQ_SHORT}"
status: complete | insight | stuck | timeout
newInfoRatio: 0.00 to 1.00
---

# Iter {ITER_NUM} — Track {TRACK}: {RQ_SHORT}

## RQ
{RQ_FULL}

## Actions
1. (tool calls made, each in one line)
2. ...

## Findings
### F-{ITER}-{NUM}: {Finding title}
- **Claim in README**: verbatim quote, with line number (e.g., L767)
- **Current truth**: verified state (cite source + line/SHA)
- **Status**: CURRENT | DRIFTED | UNVERIFIED
- **Suggested edit** (only if DRIFTED): minimal FROM/TO

(repeat F-* sections for each finding)

## Coverage notes
Sections of the README this iter scanned (line ranges).

## newInfoRatio rationale
Why this iter scored its newInfoRatio value (high if many new findings, low if mostly redundant with prior iters).

## Recommended next focus (optional)
What the next iter in Track {TRACK} should focus on, if any.
```

Append ONE row to the JSONL state file at:
`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-local-embeddings-foundation/054-root-readme-deep-research/research/deep-research-state.jsonl`

Row shape:
```json
{"type":"iteration","iteration":{ITER_NUM},"track":{TRACK},"newInfoRatio":0.XX,"status":"complete","focus":"{RQ_SHORT}","timestamp":"<UTC iso>"}
```

## RESULT (acceptance criteria)

1. `iteration-{ITER_NUM}.md` exists, >= 1000 bytes, valid markdown with frontmatter.
2. Every Finding cites real evidence (no fabrication).
3. JSONL row appended (one line, valid JSON).
4. Last line of your output: `ITER_{ITER_NUM}_COMPLETE: <finding_count> findings, newInfoRatio={X.XX}`.

## CLEAR 5-check (self-verify before writing)

- **C**ompleteness: Did I scan every line of the README that touches the RQ?
- **L**iterality: Am I quoting README claims verbatim with line numbers?
- **E**vidence: Does every finding cite a verifiable source (file:line / SHA / grep output)?
- **A**ccuracy: Am I marking UNVERIFIED honestly when I can't confirm?
- **R**eproducibility: Could another reader run my grep / read commands and arrive at the same findings?

## PRE-PLANNING (think before acting)

Before any tool call, write a 3-5 line plan in your scratch:
1. What sections of the README will I scan?
2. What source files will I cross-check against?
3. What grep / read commands will I run?
4. How many findings do I expect (rough)?

## Hard constraints

- Model: SWE 1.6 only. Do not switch.
- Permission mode: auto (read-only research).
- Do NOT edit `./README.md` directly. Only write to the iteration file + state JSONL.
- Do NOT modify any source file outside the 056 packet's `research/` directory.
- Do NOT call cli-opencode, Claude, sonnet @markdown, or any other AI tools. You only research.

## Reading list (cite these by path, do not embed content)

- `./README.md` (the audit target, 1497 lines)
- `.opencode/skills/system-spec-kit/SKILL.md`
- `.opencode/skills/system-skill-advisor/SKILL.md`
- `.opencode/skills/system-code-graph/SKILL.md`
- `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts`
- `.opencode/skills/sk-doc/references/global/hvr_rules.md` (for Track 3 iters)
- `opencode.json`, `.codex/config.toml`, `.claude/mcp.json`, `.gemini/settings.json`
- `.opencode/agents/`, `.opencode/skills/`, `.opencode/commands/` (directory listings)

Iter-specific reading addenda will be in the track seed for {TRACK}.

---

(End of template. Substitute {ITER_NUM}, {TRACK}, {RQ_SHORT}, {RQ_FULL} per dispatch.)
