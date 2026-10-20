# Iteration 9 — correctness, traceability, and command contract

## Dimension

Correctness and maintainability: Cursor and Devin command-only entry paths, plus the `/speckit:handoff` command's conformance to the `sk-create-command` contract.

## Files Reviewed

- .cursor/commands/speckit-handoff.md:1-162 (symlink to the canonical command)
- .devin/SYNC.md:18-21
- .skilled/hooks/session-relaunch/README.md:29-31, 41-45
- .skilled/commands/speckit/handoff.md:1-162
- .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:331-439
- .skilled/skills/sk-doc/sk-create-command/SKILL.md:240-269, 420-455
- .skilled/skills/sk-doc/sk-create-command/assets/command-template.md:47-75, 1140-1183
- .skilled/skills/sk-doc/sk-create-command/assets/command-contract.json:4-10
- specs/hooks/023-session-relaunch-loop/review/lineages/luna/steer.md:1-26
- specs/hooks/023-session-relaunch-loop/review-archive/*/review-report.md, research/research.md, and 010-post-fix-research/research/research.md (targeted duplicate search)
- Cursor official command docs: https://docs.cursor.com/en/agent/chat/commands and https://prod.cursor.com/docs/reference/deeplinks

## Findings by Severity

### P0 Findings

None.

### P1 Findings

1. **LUNA-FANOUT-P1-005 — Cursor's command mirror does not expose the documented `/speckit:handoff` name**
   - Condition: The runtime matrix says Cursor invokes `/speckit:handoff` and points to `.cursor/commands/speckit-handoff.md` [SOURCE: .skilled/hooks/session-relaunch/README.md:29]. Cursor's project command surface discovers Markdown files from `.cursor/commands`; this mirror is a flat file named `speckit-handoff.md`, so the documented trigger does not match the file's command name. The same generic name is listed for Devin, while `.devin/SYNC.md` says Devin has no command surface [SOURCE: .devin/SYNC.md:20]; the detailed README fallback correctly tells Devin sessions to read the canonical handoff file directly [SOURCE: .skilled/hooks/session-relaunch/README.md:45].
   - Reproduction: In Cursor, follow the documented `/speckit:handoff` invocation. The repository supplies only the flat `speckit-handoff.md` command mirror. Cursor's documented command-file model uses `.cursor/commands/[command].md`; its deeplink name form permits letters, numbers, dots, hyphens, and underscores, not a namespace colon. This is a source-based name-resolution finding; a live Cursor command palette check would directly confirm the alias exposed by this installed version.
   - Impact: A Cursor operator following the documented command name cannot reliably start the manual handoff. Devin's direct-file route is available and is not a separate hop failure, but the shared matrix obscures that its invocation is different.
   - Fix: Document Cursor's actual `/speckit-handoff` alias (or provide a Cursor-supported mapping) and describe Devin's direct-file invocation separately; reserve `/speckit:handoff` for runtimes that expose the namespaced command.
   - Prior-review check: No prior report records this command-name mismatch.

2. **LUNA-FANOUT-P1-006 — A failed or skipped continuity save can still produce a prepared hop**
   - Condition: When `spec_folder` names a packet, the command requires a continuity save before `prepare` so the receiving session resumes fresh state [SOURCE: .skilled/commands/speckit/handoff.md:27, 44, 61]. It has no success check or skipped-phase recovery before moving on. `prepare` validates the handoff note and session, then writes the pending record; it receives no continuity-save result to validate [SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:361-381, 418-439].
   - Reproduction: Bind a spec packet, make the continuity writer fail or skip Step 2, then complete Steps 3–4 with a valid note. `prepare` can still return success, and Step 5 reports `STATUS=OK RESULT=prepared`; the next session can resume from stale continuity.
   - Impact: The packet-bound path can hand over without the fresh state its contract promises. The command-authoring skill also requires violation self-detection for workflows with blocking phases: stop, name the skipped phase, return to it, and complete it [SOURCE: .skilled/skills/sk-doc/sk-create-command/SKILL.md:244].
   - Fix: Make a successful continuity save a blocking prerequisite to note preparation. Add a phase-status check and self-detection recovery that stops on a failed or skipped save and returns to Step 2 before `prepare`.
   - Prior-review check: No prior report records this failed/skipped-save path.

### P2 Findings

None.

## Review Evidence

- The command otherwise fits the plain workflow shape. Its frontmatter describes a no-argument command and admits Read, Write, and Bash; H2 sections use full-integer canonical names; the workflow is actionable; it has two invocation examples and structured `STATUS=` results. The required-argument gate does not apply because the command accepts no `$ARGUMENTS` input [SOURCE: .skilled/commands/speckit/handoff.md:1-5, 13-162; .skilled/skills/sk-doc/sk-create-command/SKILL.md:262-269].
- The command contract explicitly excludes `/speckit:handoff` from its six router families because it is a plain workflow command with no arguments or modes; no router asset or contract entry is required [SOURCE: .skilled/skills/sk-doc/sk-create-command/assets/command-contract.json:4-10].
- Devin intentionally has no mirrored command surface, and the README provides a direct-read path to the canonical command file. That route is distinct from a slash-command trigger and is viable as documented [SOURCE: .devin/SYNC.md:20; .skilled/hooks/session-relaunch/README.md:45].
- The prior reports' handoff-related items were not duplicated: the current command covers exit 3 at both the loop boundary and hop cap, and its note-state description includes both this session's claimed notes and open notes this session wrote [SOURCE: .skilled/commands/speckit/handoff.md:105-107, 135].

## Traceability Checks

- spec_code: the command-only path is documented for Cursor and Devin, but Cursor's file-derived invocation name is not the namespaced name in the runtime matrix.
- checklist_evidence: deferred to iteration 10's final adversarial pass.
- skill_agent: plain-command structure, frontmatter, examples, status output, and router-contract applicability checked; invocation naming and the blocking-save gate have findings.
- feature_catalog_code: the feature's command-only runtime description aligns with a manual trigger, while the per-runtime trigger names need clarification.

## SCOPE VIOLATIONS

- scope_violation: `step_graph_upsert` would write shared coverage-graph storage outside this lineage; it was skipped under the lineage-only write boundary.
- scope_violation: `step_graph_convergence` would append observability data to the shared graph database; no graph write was run. Coverage remains `graphless_fallback`.

## EXECUTION CONFLICT

The reducer strategy marks all dimensions complete and earlier directions BLOCKED after one pass. The lead steer requires ten passes and specifically reserves an adversarial re-check of open findings for iteration 10, so this lineage continues to the configured cap.

## Claim Adjudication

- Finding: LUNA-FANOUT-P1-005
- claim: Cursor's flat `.cursor/commands/speckit-handoff.md` mirror does not establish the documented `/speckit:handoff` invocation.
- evidenceRefs: .skilled/hooks/session-relaunch/README.md:29,45; .cursor/commands/speckit-handoff.md:1-5; .devin/SYNC.md:20; https://docs.cursor.com/en/agent/chat/commands; https://prod.cursor.com/docs/reference/deeplinks.
- counterevidenceSought: Read Cursor's official command-file and deeplink documentation, checked the actual flat mirror name, and checked the README's Devin fallback.
- alternativeExplanation: Cursor may internally map the flat `speckit-handoff` file to the colon namespace despite its documented file-derived command model.
- finalSeverity: P1
- confidence: 0.82
- downgradeTrigger: A live Cursor command palette check shows `/speckit:handoff` resolves to this file, or the repository adds an explicit supported alias.

- Finding: LUNA-FANOUT-P1-006
- claim: A packet-bound handoff can be prepared successfully even if its required continuity save was skipped or failed.
- evidenceRefs: .skilled/commands/speckit/handoff.md:27,44,61,95-107; .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:361-381,418-439; .skilled/skills/sk-doc/sk-create-command/SKILL.md:244.
- counterevidenceSought: Checked the command's step ordering and failure reporting, then read the complete `prepare` path for any continuity-writer status or saved-artifact validation.
- alternativeExplanation: The agent may always obey Step 2 and detect a writer error from its tool result even though the command has no explicit gate.
- finalSeverity: P1
- confidence: 0.91
- downgradeTrigger: `prepare` verifies a successful save for the bound packet, or the command adds a blocking status check that prevents `prepare` after a save failure or skipped phase.

## Next Dimension

Iteration 10: adversarially re-check active findings LUNA-FANOUT-P0-001, LUNA-FANOUT-P1-001, LUNA-FANOUT-P1-003, and LUNA-FANOUT-P1-004 against current sources; close the checklist-evidence pass; preserve the ten-iteration cap.

Review verdict: FAIL
