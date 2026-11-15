# Review Iteration 005

## Dispatcher

- Route: `Resolved route: mode=review target_agent=deep-review`; execution=single_review_iteration.
- Run: 5 of max 5 (`stopPolicy=max-iterations`), sessionId `2026-11-14T11:01:50.956Z`, generation 1, lineageMode `new`.
- Focus: `correctness` terminal replay — re-verify `R1-P1-001`, `R1-P1-002` and `R4-P2-001` against the final code, adversarially challenge every active P1/P2 severity, and close the operator focus on playbooks, feature catalogs, READMEs and the root `README.md`.
- Iteration number: JSONL-derived 5 (four prior `type: "iteration"` records) and the dispatch's 5 agree.
- Budget profile: `adjudicate` (8-10 evidence calls); 11 evidence calls before the write phase, which includes the four mandatory state reads.
- Scope: the 34 non-spec files in the range diff; `specs/` is cross-reference only.

## Dimension

`correctness`: final replay of the two active P1s and their consumers. The pass asks whether each claim still matches the shipped code, whether a lower severity is now the honest reading, and whether the operator-facing documentation surfaces have a new gap beyond the carried findings.

## Files Reviewed

| Surface | Lines read | What it showed |
| --- | --- | --- |
| `.skilled/hooks/session-relaunch/lib/nudge.cjs` | 1-150 | `GOAL_GUIDANCE` at 24-33 is the relaunch purpose rule; it names `### Purpose`, a `Purpose:` paragraph inside `## PROBLEM & PURPOSE`, and that section's opening paragraph. |
| `.skilled/skills/system-spec-kit/runtime/hooks/pi/session-compact-context.ts` | 1-211 | The Pi adapter resolves the purpose at 85 from the raw `specFolder` after the containment check at 84; no nearest-`spec.md` walk-up. |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts` | 200-289 | The Claude adapter walks up from the detected folder to the nearest folder holding `spec.md` at 238-245 before resolving the purpose. |
| `.skilled/skills/system-spec-kit/runtime/lib/spec/packet-purpose.ts` | 1-185 | The shared reader accepts level-two `## PROBLEM & PURPOSE`, `## ROOT PURPOSE` and `## PURPOSE`, numbered, case-insensitive and `AND` variants, plus a `Purpose:` label or the section's first paragraph. |
| `.skilled/skills/system-spec-kit/runtime/lib/README.md` | 112-122 | Line 118 still says the reader serves "the post-compaction context" only. |
| `.skilled/hooks/session-relaunch/tests/nudge.test.cjs` | purpose assertions | Line 109 asserts only `### Purpose`, `Parent purpose (`, `Goal objective:` and the scaffold sentence, so the wider heading shapes are untested. |
| State files: config, state log, strategy, findings registry | full / targeted | 4 prior iteration records; open findings 0 P0, 2 P1, 5 P2; all four dimensions covered. |
| Prior iteration narrative | iteration-004.md | Confirms the last maintainability pass and the `R4-P2-001` evidence. |

## Findings - New

### P0 Findings

None.

### P1 Findings

No new P1. Both active P1s were re-verified against the final code and remain open, so they are carried into the verdict rather than restated as discoveries.

1. **R1-P1-001 — the relaunch purpose rule is still narrower than the shared reader** — `.skilled/hooks/session-relaunch/lib/nudge.cjs:24-33` — the rule tells the receiving session to read the purpose "under ### Purpose, or without that heading in the paragraph that opens with Purpose: inside the ## PROBLEM & PURPOSE section, or else that section's opening paragraph." The shared reader also accepts `## ROOT PURPOSE`, `## PURPOSE`, numbered headings, the `AND` spelling and a labelled paragraph inside any of those sections (`packet-purpose.ts:42-48,83-98`). A live packet whose purpose sits under one of the unlisted shapes receives no purpose line on the relaunch hop, which is the D1 gap this packet exists to close.
- Case: A packet states its purpose under `## Root Purpose` (or `## 2. Purpose`). The relaunch instruction does not name that shape, so the fresh session writes a purpose from memory or omits the line, while `/speckit:resume` and the compaction hops would carry it.
- File: `.skilled/hooks/session-relaunch/lib/nudge.cjs:24-33`
- Evidence: `nudge.test.cjs:109` asserts only the `### Purpose` shape and the three labels, so the suite cannot catch the divergence; `packet-purpose.ts:89-97` is the widened lookup that the prompt does not mirror.
- User impact: the purpose can be lost on exactly the hop the feature was built for; the packet's reason for existing stops reaching the next AI on relaunch.
- Finding class: cross-consumer
- Scope proof: both files are in the 34-file target; the comparison is the final text of each, not a diff guess.
- Affected surface hints: ["session relaunch seed text", "shared purpose reader", "resume and compaction parity"]
- Recommendation: have the guidance defer to the reader's vocabulary, or enumerate `### Purpose`, level-two Purpose/Root Purpose/Problem & Purpose (numbered and `AND` variants) and the labelled paragraph, with a test for each shape.
- Claim adjudication:
```json
{
  "type": "reverification",
  "claim": "The relaunch guidance still enumerates fewer purpose shapes than resolvePacketPurpose accepts, so a live packet can lose its purpose line on the relaunch hop.",
  "evidenceRefs": ["nudge.cjs:24-33", "packet-purpose.ts:42-48", "packet-purpose.ts:83-98", "nudge.test.cjs:109"],
  "counterevidenceSought": "Read the final rule in full and checked whether its 'or else that section's opening paragraph' clause reaches the other level-two headings; it does not, because the clause is scoped to ## PROBLEM & PURPOSE.",
  "alternativeExplanation": "The guidance is deliberately terse and a capable model may open spec.md and find the purpose anyway.",
  "finalSeverity": "P1",
  "confidence": 0.9,
  "downgradeTrigger": "No live packet uses a level-two ## Purpose/## Root Purpose heading or a numbered/AND variant, or the relaunch flow is shown to always hand the model the raw spec text."
}
```

2. **R1-P1-002 — the Pi compaction still skips the nearest-`spec.md` walk-up** — `.skilled/skills/system-spec-kit/runtime/hooks/pi/session-compact-context.ts:80-89` — the adapter resolves the containment-checked folder, then calls `resolvePacketPurpose(folder)` directly. The Claude adapter on the same state file walks up until it finds a folder holding `spec.md` before resolving (`session-prime.ts:238-245`). The shared reader's ancestor loop at `packet-purpose.ts:154-162` only walks to enclosing phase parents, so it cannot recover a track or scratch folder that is not itself a packet.
- Case: The Stop hook records a track folder or a packet subfolder in `lastSpecFolder`; after a Pi compaction the purpose section is null, while the same state on Claude produces the line.
- File: `.skilled/skills/system-spec-kit/runtime/hooks/pi/session-compact-context.ts:80-89`
- Evidence: the containment guard at line 84 is correct; the gap is that line 85 passes `folder` rather than the nearest ancestor containing `spec.md`. The Claude counterpart at `session-prime.ts:240-244` is the contract Pi does not meet.
- User impact: cross-runtime divergence on the compaction hop; the Pi user loses the purpose that Claude keeps.
- Finding class: cross-consumer
- Scope proof: both adapters and the shared reader are in the 34-file target; the Pi file was read end to end.
- Affected surface hints: ["Pi session_compact", "Claude SessionStart compact", "lastSpecFolder state consumer"]
- Recommendation: reuse the Claude walk-up (or lift it into a shared helper) before calling `resolvePacketPurpose`.
- Claim adjudication:
```json
{
  "type": "reverification",
  "claim": "The Pi compaction adapter still calls the shared reader on the raw lastSpecFolder value, so a track or scratch folder yields no purpose where Claude would walk up to the packet.",
  "evidenceRefs": ["session-compact-context.ts:80-89", "session-prime.ts:238-245", "packet-purpose.ts:148-166"],
  "counterevidenceSought": "Checked whether resolvePacketPurpose itself performs the nearest-spec walk-up; it reads folder/spec.md and only walks to phase parents, so a plain track folder still fails.",
  "alternativeExplanation": "The state writer may always store a packet root, making the walk-up purely defensive and the Pi gap unreachable.",
  "finalSeverity": "P1",
  "confidence": 0.85,
  "downgradeTrigger": "The lastSpecFolder producer is shown to store only packet roots that contain spec.md, or Pi replaces the shared state file with a guaranteed packet path."
}
```

### P2 Findings

No new P2. The five active P2s are carried; the two in the final files were re-confirmed, and every severity was challenged.

1. **R1-P2-001 — the 300-character cut can split a surrogate pair** — `.skilled/skills/system-spec-kit/runtime/lib/spec/packet-purpose.ts:113-115` — `sentence.slice(0, 297)` counts UTF-16 code units, so an emoji at the boundary can be halved. Held at P2: the text is repo-authored prose and the damage is a replacement glyph, not a lost hop.
2. **R2-P2-001 — the purpose line bypasses the recovered-context sanitizer on the Claude path** — `.skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts:228-250` — the section is built from `spec.md` and appended without the recovered-payload sanitizer. Held at P2: the source is a tracked repo document and the Pi adapter strips C0 controls on the composed sections (`session-compact-context.ts:203`), so the reach is a malformed spec, not an untrusted transcript.
3. **R2-P2-002 — the operator-facing hop scenarios and root `README.md` do not name the purpose line** — `.skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md` — no range commit touches these surfaces, so the gap is unchanged. Held at P2: operator guidance drift, no runtime effect.
4. **R3-P2-001 — the Pi adapter duplicates the purpose interface and deep-imports the formatter** — `.skilled/skills/system-spec-kit/runtime/hooks/pi/session-compact-context.ts:72-79` — the local `PacketPurpose` type and the `../../dist/lib/spec/packet-purpose.js` import bypass `runtime/api/index.ts`, which does not export the formatters. Re-confirmed at P2: the code works, but the public contract is not what the adapters compile against.
5. **R4-P2-001 — the library index still scopes the reader to the compaction hop** — `.skilled/skills/system-spec-kit/runtime/lib/README.md:118` — the row says "for the post-compaction context" and does not mention the continuity writer added by `191ce39bad`. Re-confirmed at P2: documentation-only.

Severity challenge summary: no P1 or P2 was inflated or dismissed without a named downgrade trigger. The two P1s keep their severity because both have a live packet shape that loses the purpose line; the P2s keep theirs because their reach is a malformed or missing document rather than a broken hop.

## Traceability Checks

| Protocol | Level | Status | Evidence |
| --- | --- | --- | --- |
| `spec_code` | core | fail | `R1-P1-001` and `R1-P1-002` are both still present in the final files; neither is fixed. |
| `checklist_evidence` | core | partial | Changed assertions were inspected, not executed; `nudge.test.cjs:109` still covers only the `### Purpose` shape, so the relaunch gap is untested. |
| `skill_agent` | overlay | notApplicable | No skill definition or canonical agent file is in the 34-file target. |
| `agent_cross_runtime` | overlay | fail | Claude walks to the nearest `spec.md` (`session-prime.ts:240-244`); Pi resolves the raw folder (`session-compact-context.ts:85`). |
| `feature_catalog_code` | overlay | partial | No catalog row names the purpose/problem line; carried as `R2-P2-002`. |
| `playbook_capability` | overlay | partial | No manual-testing scenario names the line; carried as `R2-P2-002`. |

## Integration Evidence

- Resume surfaces still carry all three labels and the 300-character cut: `speckit-resume-auto.yaml:139`, `speckit-resume-confirm.yaml:158`, `speckit-resume-presentation.txt:118`, `handoff.md:135` (swept in iteration 3, not re-entered).
- Runtime API surface: `.skilled/skills/system-spec-kit/runtime/api/index.ts` does not export the purpose/problem formatters; the deep-import gap is `R3-P2-001`.
- Local module docs were updated with the feature; the only remaining doc drift is `R4-P2-001` at `lib/README.md:118`.
- Operator focus closure: sk-code alignment has no new violation beyond the two P1s and the carried P2s; the command assets follow the create-command label/cut contract; the module READMEs follow create-readme structure (frontmatter untouched in the range); the playbook, feature catalog and root `README.md` have no new gap beyond `R2-P2-002`.
- Not checked: vitest execution, the relaunch suite and a manual playbook run. All are out of bounds for this read-only pass, so fix verification belongs to the implementation follow-up.

## Edge Cases

- The machine-owned "Files Under Review" table in the strategy still shows every file as `pending` after four iterations. It is reducer-owned projection state and was not hand-edited; the code evidence in this iteration is unaffected, but the reducer should refresh it at synthesis.
- `nudge.test.cjs:109` proves the test intentionally covers the `### Purpose` shape; that is why the narrower relaunch rule passes its own suite and why `R1-P1-001` needs a test change, not just a wording change.
- The Pi containment guard at `session-compact-context.ts:84` is correct and is not part of the finding; the defect is the missing ancestor step before line 85.
- `resolvePacketPurpose` fails soft at `packet-purpose.ts:167-169`, so a Pi miss is silent rather than an exception. The silent miss is what makes the P1 user-visible.
- The root `README.md`, playbook and feature catalog sit outside the 34-file code target and are assessed only under the operator focus.

## Confirmed-Clean Surfaces

- `packet-purpose.ts`: fail-soft reads, a single 300-character constant, bounded ancestor depth (`MAX_ANCESTOR_DEPTH = 8`), scaffold-sentence rejection and no shared mutable state. No new correctness issue beyond the carried surrogate boundary.
- `session-prime.ts`: containment before any read and the nearest-`spec.md` walk-up both remain correct.
- `session-compact-context.ts`: the containment guard and the C0 strip on the composed sections remain correct; the gap is the walk-up only.
- Comment hygiene and duplication: no new artifact-label comment and no new accidental duplication; the per-hop label vocabulary is the D1 contract.
- Template registry and template move together (`spec-kit-docs.json` v2.3); no scaffold regression.

## Ruled Out

- Path traversal, recovered-payload sanitizer bypass, shell injection, secret exposure and state transition: exhausted in iterations 1-3; not re-entered.
- A duplicate feature-catalog/playbook/root README finding: already active as `R2-P2-002`.
- A duplicate API-boundary finding: already active as `R3-P2-001`.
- A new test-structure P1: the missing wider-shape assertion is evidence inside `R1-P1-001`, and execution is out of bounds for this pass.
- Phase-parent scaffold regression: the template writes `### Purpose` and `### Problem Statement`; swept in iteration 3.

## Quality Gate Evidence

Evidence gate: pass — every re-verified claim cites the final file and line range, with counterevidence recorded. Scope gate: pass — the target stayed read-only and only review state was written. Coverage gate: pass — all four dimensions were completed in prior iterations and this replay closes the last correctness question.

Rule sources: none. Overrides: none. Refused: none. Ignored: none. Conflicts: none

## Verdict

Active at this iteration: 0 P0, 2 P1 (`R1-P1-001`, `R1-P1-002`), 5 P2 (`R1-P2-001`, `R2-P2-001`, `R2-P2-002`, `R3-P2-001`, `R4-P2-001`). Neither P1 is fixed in the shipped code. No P0 exists, but an active P1 remains, so the verdict is CONDITIONAL. The loop reaches its `max-iterations` stop with these findings carried to synthesis; no further review pass can close them because both need an implementation change.

## Next Focus

- Dimension: none; the loop is complete at 5/5 max-iterations.
- Focus area: synthesis and the reducer; no further review iteration.
- Reason: `stopPolicy=max-iterations`, and the two P1s need an implementation phase rather than more review.
- Rotation status: complete.
- Blocked/productive carry-forward: `R1-P1-001` and `R1-P1-002` (fix before release), plus the five P2s.
- Required evidence: after the parity fix, rerun `packet-purpose`, `hook-precompact`, `hook-session-start` and `history-locator-adapters`, and exercise the relaunch and Pi compaction hops; update the playbook/root README under `R2-P2-002` when that lands.
- Recovery note: terminal iteration; the synthesis record should carry `stopReason: maxIterationsReached`.

## Next Dimension

None. All four dimensions are covered; iteration 005 is the terminal pass.

Review verdict: CONDITIONAL
