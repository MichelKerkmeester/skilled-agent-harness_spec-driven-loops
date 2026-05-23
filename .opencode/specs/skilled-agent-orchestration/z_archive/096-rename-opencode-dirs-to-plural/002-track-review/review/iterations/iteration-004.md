# Iteration 004 - D3 Traceability deep pass

## Dimension

Traceability. This pass audited the packet 094 prompt-equality contract across all 16 direct `manual_testing_playbook/` packages under `.opencode/skills/`, sampled packet 093-096 spec/checklist claims against shipped artifacts, checked leaf-agent mirror parity across OpenCode, Claude, Gemini, and Codex runtimes, adjudicated the command YAML write-authority claim from D2, and sampled packet 096 resource-map targets.

## Files Reviewed

- `.opencode/skills/sk-doc/assets/testing_playbook/manual_testing_playbook_snippet_template.md:61`
- `.opencode/skills/sk-doc/references/specific/manual_testing_playbook_creation.md:150`
- `.opencode/specs/skilled-agent-orchestration/094-playbook-prompt-naturalness/decision-record.md:40`
- `.opencode/specs/skilled-agent-orchestration/094-playbook-prompt-naturalness/spec.md:74`
- `.opencode/specs/skilled-agent-orchestration/094-playbook-prompt-naturalness/checklist.md:40`
- `.opencode/specs/skilled-agent-orchestration/094-playbook-prompt-naturalness/implementation-summary.md:61`
- `.opencode/specs/skilled-agent-orchestration/093-testing-playbooks-code-review-and-git/001-sk-code-review-playbook/spec.md:107`
- `.opencode/specs/skilled-agent-orchestration/093-testing-playbooks-code-review-and-git/002-sk-git-playbook/spec.md:60`
- `.opencode/specs/skilled-agent-orchestration/095-sk-code-review-playbook-execution/spec.md:94`
- `.opencode/specs/skilled-agent-orchestration/095-sk-code-review-playbook-execution/implementation-summary.md:45`
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/spec.md:96`
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/resource-map.md:169`
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/004-symlinks/spec.md:101`
- `.opencode/skills/cli-opencode/manual_testing_playbook/04--agent-routing/006-deep-research-agent-iterations.md:30`
- `.opencode/skills/cli-opencode/manual_testing_playbook/04--agent-routing/007-deep-review-agent-audit.md:30`
- `.opencode/agents/deep-review.md:318`
- `.claude/agents/deep-review.md:318`
- `.opencode/agents/deep-research.md:91`
- `.claude/agents/deep-research.md:91`
- `.opencode/agents/review.md:412`
- `.codex/agents/review.toml:400`
- `.opencode/commands/speckit/assets/speckit_deep-review_auto.yaml:89`
- `.opencode/commands/speckit/assets/speckit_deep-review_auto.yaml:118`
- `.opencode/skills/system-spec-kit/shared/review-research-paths.cjs:200`
- `.opencode/skills/deep-review/scripts/reduce-state.cjs:1172`

Additional checks:

- Enumerated all 16 direct `.opencode/skills/*/manual_testing_playbook` packages.
- Prompt-sync sweep over 690 parsed prompt fields: 567 natural-human, 123 RCAF (`17.8%` retained), 225 table-backed exact-prompt rows checked, 2 malformed prompt-field parses, 0 root summary mismatches.
- Strict validation rerun: packet 093 exit 0, 094 exit 0, 095 exit 0, 096 exit 2 with `SPEC_DOC_SUFFICIENCY`.
- Checklist status sweep: 093 child checklists, 094 checklist, and all 096 child checklists still have 0 checked items.
- Symlink target sample from packet 096 resource-map: `.claude/skills`, `.claude/commands`, `.codex/skills`, `.codex/prompts`, and `.gemini/skills` all exist and point to plural targets.

## Findings by Severity

### P0

#### P1-001 [P0] Live runtime uses stale generated code-graph scope globs after plural rename

- Status this iteration: Carry-forward, unchanged. Traceability impact remains active because packet 096's success criteria require zero singular references and functional post-rename tools, but live generated code still contradicts the source and runtime configs route through `dist/`.
- Evidence refs: `.opencode/skills/system-spec-kit/mcp_server/dist/code_graph/lib/index-scope-policy.js:13`, `opencode.json:23`, `.codex/config.toml:11`, `.gemini/settings.json:29`.
- Recommendation: rebuild `mcp_server/dist` and add a release guard for singular `.opencode/(skill|agent|command)/` literals in live generated outputs.

### P1

#### P1-007 [P1] Completed packets still have all required checklist evidence unchecked

- Claim: Packet docs and implementation summaries claim completion/verification, but Level 2 and child-phase checklists remain entirely unchecked, including P0 verification items.
- Evidence refs: `.opencode/specs/skilled-agent-orchestration/094-playbook-prompt-naturalness/checklist.md:40`, `.opencode/specs/skilled-agent-orchestration/094-playbook-prompt-naturalness/checklist.md:84`, `.opencode/specs/skilled-agent-orchestration/094-playbook-prompt-naturalness/implementation-summary.md:106`, `.opencode/specs/skilled-agent-orchestration/093-testing-playbooks-code-review-and-git/001-sk-code-review-playbook/checklist.md:72`, `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/004-symlinks/checklist.md:40`.
- Evidence: The checklist sweep found `checked=0` and `unchecked=26` for 093/001, `checked=0` and `unchecked=29` for 093/002, `checked=0` and `unchecked=32` for 094, and `checked=0` across every 096 child checklist. This directly conflicts with completion claims such as packet 094's "Verification gates ... ran cleanly."
- Impact: The framework's completion-verification evidence chain is broken. A reader cannot tell which P0/P1 gates were actually verified from the required checklist artifact, even when a later implementation summary claims success.
- Finding class: matrix/evidence.
- Recommendation: Backfill checklist marks with concrete command/evidence citations for completed packets, or explicitly relabel these packets as not completion-verified. Then rerun strict validation for affected packets.

```json
{
  "claim": "Completed packets 093, 094, and 096 retain all-unchecked verification checklists despite implementation summaries claiming completed validation.",
  "evidenceRefs": [
    ".opencode/specs/skilled-agent-orchestration/094-playbook-prompt-naturalness/checklist.md:40",
    ".opencode/specs/skilled-agent-orchestration/094-playbook-prompt-naturalness/implementation-summary.md:106",
    ".opencode/specs/skilled-agent-orchestration/093-testing-playbooks-code-review-and-git/001-sk-code-review-playbook/checklist.md:72",
    ".opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/004-symlinks/checklist.md:40"
  ],
  "counterevidenceSought": "Counted checked and unchecked checklist items across 093 child packets, 094, and 096 child packets; no checked items were found.",
  "alternativeExplanation": "Implementation summaries may contain the real evidence, but the required checklist artifacts still communicate unverified P0/P1 gates.",
  "finalSeverity": "P1",
  "confidence": 0.92,
  "downgradeTrigger": "Downgrade only if the framework explicitly treats these checklist files as pre-implementation scratch docs rather than completion evidence."
}
```

#### P1-008 [P1] OpenCode deep-loop leaf-agent mirrors still cite non-existent `sk-deep-*` skill paths

- Claim: Cross-runtime mirrors should match modulo runtime frontmatter, but the canonical OpenCode `deep-review` and `deep-research` agents still reference `.opencode/skills/sk-deep-*` while Claude, Gemini, and Codex mirrors point to `.opencode/skills/deep-*`.
- Evidence refs: `.opencode/agents/deep-review.md:318`, `.opencode/agents/deep-review.md:325`, `.claude/agents/deep-review.md:318`, `.opencode/agents/deep-research.md:91`, `.claude/agents/deep-research.md:91`.
- Evidence: The mirror diff shows OpenCode alone retained `sk-deep-review` and `sk-deep-research` in lifecycle/reducer contract text. The actual skill folders loaded in this review are `.opencode/skills/deep-review/` and `.opencode/skills/deep-research/`.
- Impact: Native OpenCode leaf-agent instructions can direct reviewers/researchers to non-existent loop protocol and reducer paths. This is separate from P1-002's command YAML issue because it lives in the runtime agent body.
- Finding class: cross-consumer.
- Recommendation: Patch `.opencode/agents/deep-review.md` and `.opencode/agents/deep-research.md` to the plural real skill folders, then regenerate/verify Claude, Gemini, and Codex mirrors remain semantically identical.

```json
{
  "claim": "OpenCode deep-loop leaf-agent definitions diverged from the other runtime mirrors and still cite non-existent sk-deep-* skill paths.",
  "evidenceRefs": [
    ".opencode/agents/deep-review.md:318",
    ".opencode/agents/deep-review.md:325",
    ".claude/agents/deep-review.md:318",
    ".opencode/agents/deep-research.md:91",
    ".claude/agents/deep-research.md:91"
  ],
  "counterevidenceSought": "Compared deep-review and deep-research across .opencode, .claude, .gemini, and .codex agent mirrors; only OpenCode retained sk-deep-* references.",
  "alternativeExplanation": "The stale paths are prose references, not direct imports, but these agents are operational instructions for locating reducer and loop protocol contracts.",
  "finalSeverity": "P1",
  "confidence": 0.89,
  "downgradeTrigger": "Downgrade to P2 if agent bodies are proven never to be read by native OpenCode dispatch or the paths are intentionally compatibility aliases."
}
```

#### P1-009 [P1] Codex `@review` mirror weakens the P1 blocking contract

- Claim: The `review` leaf-agent body should preserve role/tool semantics across runtimes, but the Codex mirror changes the merge-blocking rule from "P0 or unresolved P1 required fixes" to "P0 only."
- Evidence refs: `.opencode/agents/review.md:412`, `.opencode/agents/review.md:413`, `.opencode/agents/review.md:415`, `.codex/agents/review.toml:400`, `.codex/agents/review.toml:401`, `.codex/agents/review.toml:403`.
- Evidence: OpenCode says `FAIL/BLOCK requires documented P0 issues or unresolved P1 required fixes` and `P1 issues must be fixed before a pass recommendation`. Codex says `FAIL/BLOCK requires documented P0 issues` and then says P1s are required fixes but not immediate blockers.
- Impact: The same `@review` invocation can produce different merge posture depending on runtime. That undermines the review-core severity contract and can let unresolved P1 findings receive a non-blocking posture under Codex.
- Finding class: cross-consumer.
- Recommendation: Align Codex `review.toml` with the shared review doctrine: P0 blocks immediately; unresolved P1 required fixes block pass/merge recommendation unless explicitly deferred.

```json
{
  "claim": "The Codex review-agent mirror changes the shared P1 required-fix posture relative to OpenCode/Claude/Gemini.",
  "evidenceRefs": [
    ".opencode/agents/review.md:412",
    ".opencode/agents/review.md:413",
    ".codex/agents/review.toml:400",
    ".codex/agents/review.toml:403"
  ],
  "counterevidenceSought": "Compared review agent mirrors across runtimes; the Codex TOML contains a semantic exception not present in the OpenCode body.",
  "alternativeExplanation": "The line may have been intended as Codex-specific calibration, but it changes a shared severity contract rather than frontmatter/tool syntax.",
  "finalSeverity": "P1",
  "confidence": 0.86,
  "downgradeTrigger": "Downgrade if the shared review doctrine is updated to make P1 non-blocking across all runtimes."
}
```

#### P1-005 [P1] Deep-loop artifact resolver accepts malformed `spec_folder` values that redirect review writes outside the approved packet

- Status this iteration: Carry-forward, not escalated. Traceability pass found the YAML claim and resolver still disagree, but did not find a hostile plausible config path that promotes this to P0.
- Evidence refs: `.opencode/commands/speckit/assets/speckit_deep-review_auto.yaml:89`, `.opencode/commands/speckit/assets/speckit_deep-review_auto.yaml:118`, `.opencode/skills/system-spec-kit/shared/review-research-paths.cjs:200`, `.opencode/skills/deep-review/scripts/reduce-state.cjs:1172`.
- Adjudication: The resolver remains too trusting, but reachability still depends on malformed workflow setup/config rather than an external attacker-controlled input in normal command use. Severity remains P1.
- Recommendation: Add a shared spec-folder containment validator before artifact-root resolution and assert all dispatch outputs stay under the approved packet root.

#### P1-002 [P1] Command-owned deep-review/deep-research YAML reads non-existent `sk-deep-*` skill paths

- Status this iteration: Carry-forward, unchanged. P1-008 adds a separate agent-body mirror parity instance; this command YAML finding remains active.
- Evidence refs: `.opencode/commands/speckit/assets/speckit_deep-review_auto.yaml:56`, `.opencode/commands/speckit/assets/speckit_deep-research_auto.yaml:67`.
- Recommendation: Replace stale command workflow skill paths and dry-run both deep-loop command routes.

#### P1-003 [P1] Skill advisor source still writes `.opencode/skill/.advisor-state`

- Status this iteration: Carry-forward, unchanged.
- Evidence refs: `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/freshness/generation.ts:12`, `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/daemon/watcher.ts:276`, `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/daemon/lease.ts:45`.
- Recommendation: Move advisor state to a plural or neutral cache path and add a root singular-directory guard.

#### P1-004 [P1] Packet 096 validation failure localizes to parent and `004-symlinks` anchor/doc sufficiency defects

- Status this iteration: Carry-forward, confirmed current. Strict validation still exits 2 on packet 096 with `SPEC_DOC_SUFFICIENCY`.
- Evidence refs: `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/spec.md:101`, `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/004-symlinks/spec.md:117`.
- Recommendation: Repair parent and child documentation sufficiency defects, then rerun recursive strict validation.

#### P1-006 [P1] Claude Stop hook executes an env-selected autosave script before canonical path validation

- Status this iteration: Carry-forward, unchanged.
- Evidence refs: `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:38`, `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:121`.
- Recommendation: Remove the production env script override or require a test-only flag plus realpath containment.

### P2

#### P2-005 [P2] Two retained-RCAF `cli-opencode` prompts are malformed by nested backticks

- Claim: Packet 094's prompt-sync contract is mostly preserved, but two retained-RCAF prompts contain inline backticks inside a backtick-delimited `RCAF Prompt:` field, so the canonical field is not mechanically parseable as one prompt.
- Evidence refs: `.opencode/skills/cli-opencode/manual_testing_playbook/04--agent-routing/006-deep-research-agent-iterations.md:30`, `.opencode/skills/cli-opencode/manual_testing_playbook/04--agent-routing/007-deep-review-agent-audit.md:30`.
- Evidence: The global prompt sweep checked 690 prompt fields and found only two table-backed mismatches; both are `cli-opencode` retained-RCAF rows where the field starts `RCAF Prompt: \`As an external-AI conductor (or \`/speckit:...\`` and closes at the inner command code span.
- Impact: Operators can infer the intended text, but downstream byte-equality or prompt extraction scripts can read only `As an external-AI conductor (or`.
- Finding class: matrix/evidence.
- Recommendation: Escape/remove the inner backticks or use a fenced block/HTML-safe delimiter so the `RCAF Prompt:` field and Exact Prompt cell remain parseable.

#### P2-006 [P2] Packet 093 specs still claim universal RCAF after packet 094 naturalized those playbooks

- Claim: Packet 093 child specs still require all operator prompts to use the RCAF pattern, but packet 094 intentionally naturalized most `sk-code-review` and `sk-git` prompts.
- Evidence refs: `.opencode/specs/skilled-agent-orchestration/093-testing-playbooks-code-review-and-git/001-sk-code-review-playbook/spec.md:107`, `.opencode/specs/skilled-agent-orchestration/093-testing-playbooks-code-review-and-git/002-sk-git-playbook/spec.md:60`, `.opencode/specs/skilled-agent-orchestration/094-playbook-prompt-naturalness/decision-record.md:47`, `.opencode/specs/skilled-agent-orchestration/094-playbook-prompt-naturalness/implementation-summary.md:53`.
- Evidence: Current sweep reports `sk-code-review` has 15 natural / 3 RCAF prompts and `sk-git` has 15 natural / 7 RCAF prompts. That is correct under packet 094, but stale under packet 093's original spec text.
- Impact: Historical packet specs now contradict the shipped artifacts and the later ADR. This is lower severity because packet 094 intentionally supersedes the old voice requirement, but traceability should say that explicitly.
- Finding class: matrix/evidence.
- Recommendation: Add a short supersession note to packet 093 child specs or implementation summaries pointing to packet 094's ADR, so future audits do not treat the old RCAF requirement as current truth.

#### P2-001 [P2] User-facing setup docs still teach singular `.opencode/agent/` and `.opencode/command/` paths

- Status this iteration: Carry-forward, unchanged.
- Evidence refs: `.opencode/install_guides/SET-UP - Opencode Agents.md:6`, `.opencode/install_guides/SET-UP - AGENTS.md:622`.

#### P2-002 [P2] Generated dist tests and fixtures retain singular path fixtures

- Status this iteration: Carry-forward, unchanged.
- Evidence refs: `.opencode/skills/system-spec-kit/mcp_server/dist/code_graph/tests/code-graph-indexer.vitest.js:248`, `.opencode/skills/system-spec-kit/mcp_server/dist/scripts/tests/resource-map-extractor.vitest.js:29`.

#### P2-003 [P2] Additional active setup and Barter helper files still carry singular root paths

- Status this iteration: Carry-forward, unchanged.
- Evidence refs: `.opencode/install_guides/SET-UP - Code Graph.md:6`, `barter/setup-project.sh:414`.

#### P2-004 [P2] Deep-review YAML documents a Copilot target-authority guard that is not implemented or wired in the executor schema

- Status this iteration: Carry-forward, unchanged.
- Evidence refs: `.opencode/commands/speckit/assets/speckit_deep-review_auto.yaml:690`, `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts:7`.

## Traceability Checks

| Check | Status | Evidence |
|---|---|---|
| Prompt-equality contract | partial | Contract now says natural-human default, RCAF exception, and sync among SCENARIO CONTRACT, Exact Prompt table, and root summary. Sweep: 690 prompts, 123 RCAF retained (`17.8%`), 225 table-backed rows checked, 0 root summary mismatches, 2 malformed `cli-opencode` RCAF fields. |
| Spec/checklist evidence | fail | 093/094/095 strict validation exits 0, 096 exits 2. 093, 094, and 096 checklists remain 0 checked despite completion claims. |
| 094 ADR accuracy | pass | ADR correctly says canonical Prompt defaults to natural-human and RCAF is reserved for AI-orchestrator cases; current global retention is 17.8%, aligned with the implementation summary's ~15% note. |
| Cross-runtime leaf-agent parity | fail | Deep-review/deep-research OpenCode agents still cite `sk-deep-*`; Codex review mirror changes unresolved-P1 blocking posture. Code/context mirrors show only runtime/frontmatter or whitespace differences in sampled regions. |
| Command YAML write authority | fail | YAML says `{artifact_dir}` is workflow-resolved from `{spec_folder}`, but resolver still trusts raw `specFolder`; no P0 escalation because hostile normal-input reachability was not proven. |
| Resource-map traceability | partial | Parent `resource-map.md` exists and sampled symlink targets exist/resolved; resource-map phase headings were bulk-renamed into tautologies like `.opencode/skills/ -> .opencode/skills/`, which is a D4 maintainability/doc-casualty follow-up. |

Ruled out:

- No broad downstream test was found that still asserts "all prompts must be RCAF"; the remaining equality checks assert prompt-field/table/root synchronization, which is still the intended contract.
- No root-summary mismatch was found for parsed per-feature prompt IDs in the 16 direct playbooks.
- Packet 095 Level 1 packet does not require a checklist; its aggregate 18/18 PASS table matches the sampled `REQ-001..003` execution/result claims.
- The 5 packet-096 mirror symlinks sampled from `resource-map.md` all resolve to plural targets.

## Verdict

FAIL, `hasAdvisories=true`.

D3 converged enough to mark traceability covered, but it adds three required P1 fixes: completion checklists are unmarked across completed packets, OpenCode deep-loop agent mirrors still cite non-existent `sk-deep-*` paths, and the Codex review mirror weakens the shared P1 blocking contract. The prompt-equality contract mostly holds after naturalization; the only new prompt-specific issue is two malformed retained-RCAF code spans.

## Next Dimension

Iteration 5 should move to D4 Maintainability: doc anchors, dead refs, narrative spec doc casualties from bulk-sed, resource-map tautologies, stale `sk-deep-*` prose outside command/agent hot paths, and generated/source rebuild hygiene.
