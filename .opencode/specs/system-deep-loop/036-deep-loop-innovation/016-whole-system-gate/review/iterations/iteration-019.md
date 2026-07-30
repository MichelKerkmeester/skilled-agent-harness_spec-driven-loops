# Iteration 019 — security

- Executor: cli-codex gpt-5.6-sol effort=high service_tier=fast sandbox=read-only
- Completed: 2026-07-30T07:33:37.537Z
- New findings: 3 (of 3 reported; prior total 71)
- Coverage: {"filesExamined":23,"keyPaths":[".opencode/skills/system-spec-kit/shared/review-research-paths.cjs",".opencode/skills/system-deep-loop/runtime/lib/deep-loop/artifact-root.cjs",".opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts",".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs",".opencode/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs",".opencode/skills/system-deep-loop/runtime/scripts/reduce-state.cjs",".opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs",".opencode/commands/deep/assets/deep-review-auto.yaml",".opencode/commands/deep/assets/deep-research-auto.yaml",".opencode/skills/system-deep-loop/deep-ai-council/scripts/lib/persist-artifacts.cjs",".opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs",".opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-topic.cjs",".opencode/skills/system-deep-loop/runtime/lib/council/session-state-hierarchy.cjs",".opencode/skills/system-deep-loop/runtime/lib/council/round-state-jsonl.cjs"]}

## Summary
Traced artifact ownership from the review/research YAML resolver and fan-out override through fanout-run, reducers, merge, and write containment, then followed the equivalent AI Council persistence paths. Fan-out base-directory validation is substantially stronger than the downstream override surfaces, but outside-worktree scopes remain reachable and deepen the known fail-open containment finding. The highest-risk new defects are in AI Council: the writable packet root is caller-controlled, and an unchecked topic identifier traverses outside even that root. The persistence helper also exposes an unrestricted auxiliary-output overwrite.

## Findings
- [P0] F-019-01 Council writer scopes writes relative to an attacker-chosen root @ .opencode/skills/system-deep-loop/deep-ai-council/scripts/lib/persist-artifacts.cjs:532
  - evidence: councilRootFor() applies path.resolve(packetSpecFolder) and only verifies that packetRoot/ai-council is inside that caller-selected packetRoot. The CLI accepts packetSpecFolder as its first positional argument at lines 918-950 and writeArtifacts() creates packetRoot and aiCouncilRoot at lines 656-662. orchestrate-session.cjs independently accepts --packet-spec-folder or executor/session JSON and path.resolve()s it without checking an approved specs root, so workflow-controlled persistence can create or overwrite ai-council artifacts anywhere writable.
  - recommendation: Centralize packet-root authorization using a canonical realpath containment check against registered worktree .opencode/specs and specs roots. Reject missing, symlinked, non-spec, temporary, or external roots before any mkdir, lock, heartbeat, registry, or artifact write.
- [P0] F-019-02 Council topic identifiers traverse outside the packet @ .opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-topic.cjs:48
  - evidence: normalizeTopicId() only trims and checks non-emptiness. roundStatePath() at lines 115-116 inserts topicId directly into path.join(packetSpecFolder, 'ai-council', 'topics', topicId, ...), and line 340 passes the unchecked value to appendRoundStateRecord(). session-state-hierarchy.cjs:182-189 validates only that topic_id is a string, while round-state-jsonl.cjs:280-292 recursively creates the resulting parent and appends the state record. A session topic_id containing ../ segments therefore escapes ai-council/topics and causes an unauthorized write.
  - recommendation: Require topic IDs to match a conservative stable-ID grammar, reject separators, dot segments, absolute paths, control characters, and platform-specific separators, then canonicalize the final state path and prove it remains below the authorized ai-council/topics root immediately before mkdir and append.
- [P1] F-019-03 Memory-save payload output is an unrestricted file overwrite @ .opencode/skills/system-deep-loop/deep-ai-council/scripts/lib/persist-artifacts.cjs:1007
  - evidence: parseArgs() accepts --memory-save-payload-out as an arbitrary string at line 938. Lines 1007-1011 path.resolve() that value, recursively create its parent, and writeFileSync() the payload without an approved-root, packet-root, symlink, or existing-file check. Supplying a writable repository or user path overwrites it with attacker-influenced JSON.
  - recommendation: Remove the arbitrary output-path surface in favor of stdout, or restrict it to a fixed packet-local filename beneath the already-authorized council root using canonical parent containment and no-follow/exclusive creation semantics.

## Leaf output (verbatim JSON)
```json
{
  "iteration": 19,
  "dimension": "security",
  "summary": "Traced artifact ownership from the review/research YAML resolver and fan-out override through fanout-run, reducers, merge, and write containment, then followed the equivalent AI Council persistence paths. Fan-out base-directory validation is substantially stronger than the downstream override surfaces, but outside-worktree scopes remain reachable and deepen the known fail-open containment finding. The highest-risk new defects are in AI Council: the writable packet root is caller-controlled, and an unchecked topic identifier traverses outside even that root. The persistence helper also exposes an unrestricted auxiliary-output overwrite.",
  "findings": [
    {
      "severity": "P0",
      "dimension": "security",
      "title": "Council writer scopes writes relative to an attacker-chosen root",
      "file": ".opencode/skills/system-deep-loop/deep-ai-council/scripts/lib/persist-artifacts.cjs",
      "line": 532,
      "evidence": "councilRootFor() applies path.resolve(packetSpecFolder) and only verifies that packetRoot/ai-council is inside that caller-selected packetRoot. The CLI accepts packetSpecFolder as its first positional argument at lines 918-950 and writeArtifacts() creates packetRoot and aiCouncilRoot at lines 656-662. orchestrate-session.cjs independently accepts --packet-spec-folder or executor/session JSON and path.resolve()s it without checking an approved specs root, so workflow-controlled persistence can create or overwrite ai-council artifacts anywhere writable.",
      "recommendation": "Centralize packet-root authorization using a canonical realpath containment check against registered worktree .opencode/specs and specs roots. Reject missing, symlinked, non-spec, temporary, or external roots before any mkdir, lock, heartbeat, registry, or artifact write."
    },
    {
      "severity": "P0",
      "dimension": "security",
      "title": "Council topic identifiers traverse outside the packet",
      "file": ".opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-topic.cjs",
      "line": 48,
      "evidence": "normalizeTopicId() only trims and checks non-emptiness. roundStatePath() at lines 115-116 inserts topicId directly into path.join(packetSpecFolder, 'ai-council', 'topics', topicId, ...), and line 340 passes the unchecked value to appendRoundStateRecord(). session-state-hierarchy.cjs:182-189 validates only that topic_id is a string, while round-state-jsonl.cjs:280-292 recursively creates the resulting parent and appends the state record. A session topic_id containing ../ segments therefore escapes ai-council/topics and causes an unauthorized write.",
      "recommendation": "Require topic IDs to match a conservative stable-ID grammar, reject separators, dot segments, absolute paths, control characters, and platform-specific separators, then canonicalize the final state path and prove it remains below the authorized ai-council/topics root immediately before mkdir and append."
    },
    {
      "severity": "P1",
      "dimension": "security",
      "title": "Memory-save payload output is an unrestricted file overwrite",
      "file": ".opencode/skills/system-deep-loop/deep-ai-council/scripts/lib/persist-artifacts.cjs",
      "line": 1007,
      "evidence": "parseArgs() accepts --memory-save-payload-out as an arbitrary string at line 938. Lines 1007-1011 path.resolve() that value, recursively create its parent, and writeFileSync() the payload without an approved-root, packet-root, symlink, or existing-file check. Supplying a writable repository or user path overwrites it with attacker-influenced JSON.",
      "recommendation": "Remove the arbitrary output-path surface in favor of stdout, or restrict it to a fixed packet-local filename beneath the already-authorized council root using canonical parent containment and no-follow/exclusive creation semantics."
    }
  ],
  "refutations": [
    {
      "id": "F-016-05",
      "verdict": "deepened",
      "reason": "The outside-worktree trigger is reachable through more than a malformed direct call. deep-review-auto.yaml:123-146 trusts config.fanout_lineage_artifact_dir as artifact_dir and forwards it as --artifact-dir; runtime/scripts/reduce-state.cjs:2055-2058 accepts that override via path.resolve() with no containment before writing registry/dashboard files. Separately, review-research-paths.cjs:266-276 approves the entire OS temporary directory as a production artifact root. Once outside the worktree, write-containment.ts:273-275 and 291-293 return empty results, so the forged scope is both writable and unmonitored."
    },
    {
      "id": "F-016-01",
      "verdict": "confirmed",
      "reason": "deep-review-auto.yaml:131 and the corresponding research/confirm workflows interpolate spec_folder inside a double-quoted node -e shell command. review-research-paths.cjs:345-348 rejects quotes and shell metacharacters only after Node starts, so a double quote can terminate the shell argument before resolveArtifactRoot executes; the in-function guard cannot prevent that breakout."
    }
  ],
  "coverage": {
    "filesExamined": 23,
    "keyPaths": [
      ".opencode/skills/system-spec-kit/shared/review-research-paths.cjs",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/artifact-root.cjs",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts",
      ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs",
      ".opencode/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs",
      ".opencode/skills/system-deep-loop/runtime/scripts/reduce-state.cjs",
      ".opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs",
      ".opencode/commands/deep/assets/deep-review-auto.yaml",
      ".opencode/commands/deep/assets/deep-research-auto.yaml",
      ".opencode/skills/system-deep-loop/deep-ai-council/scripts/lib/persist-artifacts.cjs",
      ".opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs",
      ".opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-topic.cjs",
      ".opencode/skills/system-deep-loop/runtime/lib/council/session-state-hierarchy.cjs",
      ".opencode/skills/system-deep-loop/runtime/lib/council/round-state-jsonl.cjs"
    ]
  }
}
```