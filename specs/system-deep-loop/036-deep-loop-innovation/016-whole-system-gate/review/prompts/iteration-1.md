# Deep-review leaf — iteration 1 of 40 (inventory pass)

You are a deep-review LEAF executing exactly ONE iteration of a review loop. The loop
orchestrator (not you) owns all state files. You are READ-ONLY: do not create, modify,
or delete ANY file. Your entire output is your final message.

GATE-3 PRE-RESOLVED (A) — write authority is owned by the orchestrator; never ask the
A-E documentation question. Do not run any state-mutating command.

## Target
The whole `system-deep-loop` skill. The authoritative scope list is the file
`.opencode/specs/system-deep-loop/036-deep-loop-innovation/016-whole-system-gate/goal-file-manifest.txt`
(1985 repo-relative paths). Repo root is your CWD.

## This iteration's job: INVENTORY
1. Read the manifest. Survey the skill's structure: runtime/lib modules, runtime/scripts,
   runtime/tests, the mode packets (deep-research, deep-review, deep-alignment,
   deep-ai-council, deep-improvement family), shared/, and top-level docs.
2. Build a module map: group files into coherent module groups; estimate complexity and
   review-risk per group (what would break worst at authority cutover; which surfaces are
   newest / least reviewed).
3. Rank hotspots for the 39 deep passes that follow (risk-ordered: correctness, security,
   traceability, maintainability).
4. If you spot OBVIOUS defects while surveying (dead imports, contradictory contracts,
   broken references), record them as findings with concrete file:line evidence. Do not
   force findings — inventory quality matters more.

## Output contract (STRICT)
Output ONLY a fenced JSON block, nothing after it:

```json
{
  "iteration": 1,
  "dimension": "inventory",
  "summary": "<3-6 sentences: skill shape, biggest risk concentrations>",
  "moduleMap": [ { "group": "<name>", "approxFiles": 0, "riskRank": 1, "notes": "<why>" } ],
  "hotspots": [ "<path or module>: <why it needs deep passes>" ],
  "findings": [ { "severity": "P0|P1|P2", "dimension": "correctness|security|traceability|maintainability", "title": "<short>", "file": "<repo-relative path>", "line": 0, "evidence": "<what you actually read there>", "recommendation": "<fix direction>" } ],
  "coverage": { "filesExamined": 0, "groupsExamined": 0 }
}
```

Severity bar: P0 = would certify/authorize something false or lose data at cutover;
P1 = real defect with a concrete trigger; P2 = quality/maintainability. Every finding
MUST cite a file you actually read (and line where possible). No speculative findings.
