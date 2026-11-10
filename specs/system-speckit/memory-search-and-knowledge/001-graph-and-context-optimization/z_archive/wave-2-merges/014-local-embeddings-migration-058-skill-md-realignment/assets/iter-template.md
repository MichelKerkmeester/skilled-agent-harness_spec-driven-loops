# Iter {ITER_NUM} — Track {TRACK}: {RQ_SHORT}

## SITUATION

You are doing iteration {ITER_NUM} of 20 in a fixed-cap deep-review sweep on 3 SKILL.md files + 3 mcp_server READMEs + 2 references/ folders across `.opencode/skills/system-spec-kit/`, `system-code-graph/`, `system-skill-advisor/`. Track {TRACK} owns this iter's focus.

Authority for SKILL.md style: `.opencode/skills/sk-doc/assets/skill/skill_md_template.md` (1174 lines, creation guide; section 3 is the comprehensive template).
Authority for mcp_server/README.md style: `.opencode/skills/system-spec-kit/mcp_server/README.md` (323 lines, 9-anchor scaffold).

## TASK

Answer this research question:

**RQ**: {RQ_FULL}

Cite concrete evidence (file path + line number, grep output) for every finding. Mark UNVERIFIED honestly if you cannot confirm.

## ACTION (output schema)

Print this markdown file to stdout, wrapped in a ```markdown fence so the orchestrator can capture it:

```markdown
---
title: "Iter {ITER_NUM} — Track {TRACK}: {RQ_SHORT}"
iteration: {ITER_NUM}
track: {TRACK}
focus: "{RQ_SHORT}"
status: complete
newInfoRatio: 0.XX
---

# Iter {ITER_NUM} — Track {TRACK}: {RQ_SHORT}

## RQ
{RQ_FULL}

## Actions
[one bullet per tool call, grep, read]

## Findings
### F-{ITER}-001: [Finding title]
- **Claim/Observation**: verbatim quote from target file with line number
- **Standard (from authority)**: what sk-doc template or model README says about this
- **Status**: ALIGNED | DRIFTED | GAP | NEW-FILE-NEEDED
- **Suggested action** (only for DRIFTED/GAP/NEW-FILE-NEEDED): minimal scoped edit OR new-file spec

(repeat F-* sections for each finding)

## Coverage notes
What sections / files this iter scanned.

## newInfoRatio rationale
[brief — high if many new findings vs prior iter overlap]

## Recommended next focus (optional)
What next iter in this track should focus on.
```

End your output with: `ITER_{ITER_NUM}_COMPLETE: <finding_count> findings, newInfoRatio={X.XX}`

## CLEAR 5-check (self-verify before output)

- **C**ompleteness: scanned every section of the target file relevant to the RQ
- **L**iterality: quoting target-file text verbatim with line numbers
- **E**vidence: every finding cites a verifiable source
- **A**ccuracy: marking UNVERIFIED honestly
- **R**eproducibility: another reader can run my grep/read commands and get the same answer

## PRE-PLANNING

Before tool calls, write a 3-5 line plan in scratch:
1. What target file(s) / sections will I scan?
2. What authority file(s) will I cross-check against?
3. What grep / read commands?
4. Expected findings count?

## Hard constraints

- Model: SWE 1.6 only.
- Permission mode: auto (read-only research).
- Do NOT modify any target file directly.
- Do NOT modify any source code.
- Do NOT call other AI tools.

## Reading list (cite by path, do not embed content)

- Authority: `.opencode/skills/sk-doc/assets/skill/skill_md_template.md` (for SKILL.md tracks)
- Authority: `.opencode/skills/system-spec-kit/mcp_server/README.md` (for mcp_server README tracks)
- HVR rules: `.opencode/skills/sk-doc/references/global/hvr_rules.md` (for voice-check sub-questions)
- Targets per-track (see track-seeds.md for the specific files)
