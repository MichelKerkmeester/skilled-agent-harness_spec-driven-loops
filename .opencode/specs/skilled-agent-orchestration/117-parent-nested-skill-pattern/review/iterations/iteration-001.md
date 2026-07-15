# Review Iteration 001 — Rename-fix completeness

- **Model**: gpt-5.5-fast xhigh
- **Seat**: r01
- **clean**: False
- **findings**: 1

## Analysis

Read-only review. I’ll route through the review skill, then use PCRE2 `rg` plus targeted reads to separate stale packet-path references from legitimate artifact roots and prose.
The live `.opencode` tree has the renamed mode folders. I did not find `.agents/skills/deep-loop-workflows` or `.claude/skills/deep-loop-workflows` through glob, so I’ll include the actual mirror surfaces that exist in this repo: `.opencode/agents` and root documentation, plus the requested skill/runtime/command paths.
The broad PCRE2 sweep is noisy because it correctly matches packet artifact roots like `research/`, `review/`, `context/`, and `improvement/`. I’m narrowing to actual old skill-packet references and command/script paths where those bare folders would be defects.
Two suspicious classes surfaced: mirror skill docs/changelogs under `.claude`/`.agents` still mention old packet names, and at least one command asset example may use a stale `deep-agent-improvement` path. I’m opening those exact lines before classifying them as defects.
I found one likely real stale reference in the primary hub doc (`improvement/ packet`). I’m checking for comparable `context/`, `research/`, and `review/` packet-doc references, plus old anchored `deep-loop-workflows/<old>/` references that would be runtime-breaking.
The stricter old-packet-path sweep did not find live `deep-loop-workflows/context/`, `research/`, `review/`, or `improvement/` command/script paths. It did find historical references to `deep-agent-improvement/graph-metadata.json`; I’m checking whether that is a real current-contract defect or just changelog history.
The changelog `deep-agent-improvement` hit is historical provenance and not one of the four renamed bare packet paths; I’m not treating it as a defect unless it appears in active routing docs. The active hub `SKILL.md` mismatch is confirmed in all three runtime mirrors.
The additional wording sweep only confirms the same active stale reference: `improvement/ packet` in the hub skill docs. Other `context/`, `research/`, `review/`, and `improvement/` hits are packet artifact roots or historical changelog wording, not old skill directories.
Now I’m cross-checking the stale doc line against the registry source of truth and confirming `ai-council/` stayed bare while the four renamed folders exist only under `deep-*`.
Registry evidence confirms `packet: "deep-improvement"` for all three improvement lanes, while the hub prose says `improvement/ packet`; `improvement/` is only an `artifactRoot`, not a skill packet folder. The directory listings also confirm `ai-council/` remains bare and the three renamed mode folders are `deep-*`.
One ad hoc grep failed because the shell interpreted an unmatched quote in the pattern; I’m rerunning the same check with a simpler quoted PCRE pattern.
The exact hub wording check isolates the stale `improvement/ packet` line to the three skill mirrors. Directory reads show no old bare mode directories and show `ai-council/` present; I’m doing one final file-list confirmation for graph metadata and stale anchored paths.
**Findings**

P1: `.opencode/skills/deep-loop-workflows/SKILL.md:47`, `.agents/skills/deep-loop-workflows/SKILL.md:47`, `.claude/skills/deep-loop-workflows/SKILL.md:47`

The hub routing prose still says “the 3 improvement modes all share the `improvement/` packet.” That is a stale bare packet-path reference. The live registry maps those modes to `packet: "deep-improvement"` and uses `artifactRoot: "improvement/"` only for spec output dirs. This can mislead agents/humans into looking for a non-existent `deep-loop-workflows/improvement/` skill packet.

Fix: change the parenthetical to “share the `deep-improvement/` packet” or “share the `deep-improvement` packet; artifact output remains `improvement/`.”

No P0 found in this slice. The anchored old paths `deep-loop-workflows/context|research|review|improvement/` did not appear in the scoped sweep, and `ai-council/` remains the bare folder.

===REVIEW-JSON===
{"slice":"rename-fix-completeness","findings":[{"severity":"P1","path":".opencode/skills/deep-loop-workflows/SKILL.md:47","issue":"Stale bare packet path: the hub and its .agents/.claude mirrors say all improvement modes share the `improvement/` packet, but the registry maps those modes to `deep-improvement` and reserves `improvement/` for artifactRoot output.","fix":"Update the hub text in all mirrors to say the modes share the `deep-improvement` packet; keep `improvement/` only for artifact output dirs.","confidence":"high"}],"clean":false}
===END===

## Findings (structured)

```json
[
  {
    "severity": "P1",
    "path": ".opencode/skills/deep-loop-workflows/SKILL.md:47",
    "issue": "Stale bare packet path: the hub and its .agents/.claude mirrors say all improvement modes share the `improvement/` packet, but the registry maps those modes to `deep-improvement` and reserves `improvement/` for artifactRoot output.",
    "fix": "Update the hub text in all mirrors to say the modes share the `deep-improvement` packet; keep `improvement/` only for artifact output dirs.",
    "confidence": "high"
  }
]
```
