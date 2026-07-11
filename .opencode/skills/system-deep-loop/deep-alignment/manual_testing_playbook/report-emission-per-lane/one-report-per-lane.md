---
title: "DAL-026 -- One report section per lane, never blended"
description: "Verify the reducer emits alignment-report.md with one section per lane, each authority's findings kept under its own heading rather than interleaved across authorities, and that the report is auto-generated (never hand-edited)."
version: 1.0.0.0
---

# DAL-026 -- One report section per lane, never blended

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAL-026`.

---

## 1. OVERVIEW

This scenario validates per-lane report emission for `DAL-026`. The objective is to verify that `reduce-alignment-state.cjs`'s `renderAlignmentReport` writes an overall summary plus one `## Lane: <authority> / <artifactClass> / <scope>` section per lane, with each authority's findings under its own per-severity subsections rather than interleaved across authorities (SKILL.md ALWAYS-#5), and that the emitted `alignment-report.md` declares itself auto-generated and never manually edited.

### WHY THIS MATTERS

A blended cross-authority report would make it hard to see whether, say, sk-doc conformance is clean while sk-git conformance is failing. Keeping one section per lane preserves the authority boundary in the output — the same boundary the whole mode is built around — so an operator reads a per-authority verdict, not a mush.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify one section per lane in alignment-report.md, findings never blended across authorities, report auto-generated.
- Real user request: If I audit sk-doc and sk-git together, is each authority's result reported separately?
- Prompt: `Validate deep-alignment report emission: one section per lane in alignment-report.md, findings never blended across authorities, report auto-generated.`
- Expected execution process: Build a two-lane fixture with distinct findings per lane, run the reducer, and confirm the report has an overall summary plus one `## Lane:` section per lane with each lane's findings under its own heading; read `renderAlignmentReport` and SKILL.md ALWAYS-#5.
- Desired user-facing outcome: The user is told the report gives each audited authority its own section and verdict — one report per lane, not one blended report.
- Expected signals: `renderAlignmentReport` writes an overall summary plus one `## Lane: <authority> / <artifactClass> / <scope>` section per lane, with per-severity subsections; the report frontmatter says "Auto-generated ... Never manually edited"; SKILL.md ALWAYS-#5 requires one report per lane, not one blended report.
- Pass/fail posture: PASS if the report has one section per lane with findings kept under their own headings and the auto-generated frontmatter. FAIL if lanes are blended, a section is missing, or the report claims to be hand-authored.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so the fixture is built before the report is read.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
Validate deep-alignment report emission: one section per lane in alignment-report.md, findings never blended across authorities, report auto-generated.
### Commands
1. `bash: rg -n 'renderAlignmentReport|## Lane:|one report per lane|Never manually edited|Emit one report per lane' .opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs .opencode/skills/system-deep-loop/deep-alignment/SKILL.md`
2. `bash: D=$(mktemp -d); mkdir -p "$D/alignment/deltas"; L1="sk-doc::docs::docs/"; L2="sk-git::git-history::main..HEAD"; printf '{"alignmentTarget":"fx","lanes":[{"authority":"sk-doc","artifactClass":"docs","scope":{"type":"paths","values":["docs/"]}},{"authority":"sk-git","artifactClass":"git-history","scope":{"type":"branchRange","from":"main","to":"HEAD"}}]}' > "$D/alignment/deep-alignment-config.json"; printf '{"type":"iteration","laneId":"%s","artifactsChecked":1,"newFindingsRatio":1}\n{"type":"iteration","laneId":"%s","artifactsChecked":1,"newFindingsRatio":1}\n' "$L1" "$L2" > "$D/alignment/deep-alignment-state.jsonl"; printf '{"type":"finding","laneId":"%s","finding":{"severity":"P1","type":"missing-required-section","message":"doc gap","artifactPath":"docs/a.md"}}\n' "$L1" > "$D/alignment/deltas/iter-001.jsonl"; printf '{"type":"finding","laneId":"%s","finding":{"severity":"P0","type":"invalid-subject-format","message":"bad commit","artifactRef":"abc123"}}\n' "$L2" > "$D/alignment/deltas/iter-002.jsonl"; node .opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs "$D" >/dev/null; sed -n '1,80p' "$D/alignment/alignment-report.md"`
### Expected
`alignment-report.md` opens with an auto-generated frontmatter ("Never manually edited") and an overall summary, then has exactly two `## Lane:` sections — one for `sk-doc / docs / docs/` (with the P1 `missing-required-section` under its own heading) and one for `sk-git / git-history / main..HEAD` (with the P0 `invalid-subject-format`). The sk-doc finding never appears in the sk-git section or vice versa.
### Evidence
Capture the report's frontmatter, overall summary, and the two per-lane sections with their findings kept separate.
### Pass/Fail
PASS if the report has one section per lane with findings kept under their own headings and the auto-generated frontmatter. FAIL if lanes are blended, a section is missing, or the report claims to be hand-authored.
### Failure Triage
If a lane's finding appears under another lane's heading, the per-lane boundary is broken (the finding). If there is a single merged findings list, `renderAlignmentReport` is blending authorities against ALWAYS-#5.
---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page, integrated alignment protocol, and scenario summary |
| `report-emission-per-lane/` | Report category; the reducer is exercised on a two-lane fixture here |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs` | `renderAlignmentReport` one-section-per-lane output |
| `.opencode/skills/system-deep-loop/deep-alignment/SKILL.md` | ALWAYS-#5 (one report per lane, not blended) |

---

## 5. SOURCE METADATA

- Group: REPORT EMISSION PER LANE
- Playbook ID: DAL-026
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `report-emission-per-lane/one-report-per-lane.md`
- Note: "One report per lane" is realized as one section per lane inside the single `alignment-report.md`, not N separate report files — the invariant is that authorities are never interleaved, confirmed by `renderAlignmentReport`.
