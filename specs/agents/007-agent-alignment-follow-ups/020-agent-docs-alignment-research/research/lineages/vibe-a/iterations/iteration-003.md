# Iteration 3: Feature catalogs, manual testing playbooks and the doctor agent-roster check

## Focus

Cover the two surfaces the topic names that iterations 1 and 2 did not touch — the feature catalogs and manual testing playbooks under `.skilled/skills/**/feature-catalog/` and `.skilled/skills/**/manual-testing-playbook/` — plus the `.skilled/commands/doctor/` agent-roster check, looking for agent status values, routing, file locations and sync behaviour that no longer match the eleven-agent inventory.

## Findings

1. `.skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs:9` states "the same agent roster is exposed to five runtimes". The script's `LINKED` and `AUTHORED` tables cover five surfaces (`cursor`, `devin`, `opencode`, `codex`, `pi`) plus the canonical tree, but eight runtime agent trees ship the eleven agents. `.dsh/agents/` and `.vibe/agents/` are never inspected, so a new agent that reaches neither is reported as full coverage. [SOURCE: .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs:9] [SOURCE: .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs:57] [SOURCE: .dsh/agents/] [SOURCE: .vibe/agents/]

2. `.skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs:45` binds `CANONICAL_REL = '.claude/agents'` under the comment "The Claude tree is canonical". Four other surfaces name `.skilled/agents/` as the authored source: `README.md:963`, the `agent-registry.json` description, `agent-mirror-crosswalk.md:17` and `.skilled/agents/README.txt:5`. The doctor check therefore measures every runtime against a mirror rather than against the source. [SOURCE: .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs:45] [SOURCE: README.md:963] [SOURCE: .skilled/agents/agent-registry.json:3] [SOURCE: .skilled/bin/agent-mirror-crosswalk.md:17] [SOURCE: .skilled/agents/README.txt:5]

3. `.skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs:65` declares `{ id: 'opencode', dir: '.skilled/agents', entry: (n) => \`${n}.md\`, ext: '.md' }`. The surface labelled `opencode` is therefore `.skilled/agents`, and the real OpenCode tree `.opencode/agents/` is never read by the check. A drift confined to `.opencode/agents/` passes silently. [SOURCE: .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs:65] [SOURCE: .opencode/agents/] [SOURCE: .skilled/agents/README.txt:5]

4. `.skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs:11-13` explains the design as "Cursor and Devin are served by symlinks into the canonical Claude tree, while OpenCode and Codex keep independently-authored files in their own dialects." The symlink half is correct (`.cursor/agents/*.md` and `.devin/agents/*/AGENT.md` are symlinks into `.claude/agents/`), but the second half is not: every `.opencode/agents/*.md` file is byte-identical to its `.skilled/agents/` twin, and `.codex/agents/*.toml` is generated from `.skilled` per the crosswalk. Neither tree is independently authored. [SOURCE: .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs:11] [SOURCE: .cursor/agents/] [SOURCE: .devin/agents/] [SOURCE: .skilled/bin/agent-mirror-crosswalk.md:17]

5. `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/command-flow-stress-tests/setup-cp-sandbox.sh:104-105` copies only `.skilled/agents/deep-research.md` and `.claude/agents/deep-research.md` into the sandbox. The playbook's canonical-drift checks then diff `.opencode/agents/deep-research.md` between the baseline and the sandbox (`exhausted-approach-respect.md:101`, `pause-sentinel-halt.md:87`, `spec-fence-writeback.md:84`, `setup-yaml-handoff.md:84`, `iteration-citation-jsonl.md:84`). The sandbox never creates that path, so each diff compares two absent files and reports no drift regardless of what the run did. [SOURCE: .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/command-flow-stress-tests/setup-cp-sandbox.sh:104] [SOURCE: .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/command-flow-stress-tests/exhausted-approach-respect.md:101] [SOURCE: .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/command-flow-stress-tests/pause-sentinel-halt.md:87]

6. The deep-review playbook carries the same defect: `setup-cp-sandbox.sh:104-105` copies `.skilled/agents/deep-review.md` and `.claude/agents/deep-review.md`, while `leaf-only-nested-dispatch-refusal.md:63` reads `/tmp/cp-056-sandbox/.opencode/agents/deep-review.md` and `final-synthesis-memory-save-and-guardrail-behavior.md:78` lists `.opencode/agents/deep-review.md` as a checked surface. [SOURCE: .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/command-flow-stress-tests/setup-cp-sandbox.sh:104] [SOURCE: .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/command-flow-stress-tests/leaf-only-nested-dispatch-refusal.md:63] [SOURCE: .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/synthesis-save-and-guardrails/final-synthesis-memory-save-and-guardrail-behavior.md:78]

7. `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/command-flow-stress-tests/exhausted-approach-respect.md:123` cites `.skilled/agents/deep-research.md:399-428` for "always and never rules for state discipline". The rules live at lines 424-464 (`## 6. RULES` at 424, `### ALWAYS` at 426, `### NEVER` at 439), so the cited range starts 25 lines early and ends before the NEVER list it claims to cover. [SOURCE: .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/command-flow-stress-tests/exhausted-approach-respect.md:123] [SOURCE: .skilled/agents/deep-research.md:424] [SOURCE: .skilled/agents/deep-research.md:439]

8. `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/command-flow-stress-tests/spec-fence-writeback.md:106` cites `.skilled/agents/deep-research.md:51-55` for "agent may not repair reducer or control files". Lines 51-55 are the nested-dispatch REFUSE line and the scope-lock write targets; the no-repair rule is the `No speculative recovery` invariant at line 39. [SOURCE: .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/command-flow-stress-tests/spec-fence-writeback.md:106] [SOURCE: .skilled/agents/deep-research.md:39] [SOURCE: .skilled/agents/deep-research.md:51]

## Ruled Out

- Treating the feature catalogs as a misdescription surface: the two catalogs that name an agent — `deep-research/feature-catalog/loop-lifecycle/iteration-dispatch.md` and `deep-review/feature-catalog/loop-lifecycle/iteration-dispatch.md` — describe the LEAF contract, the reducer boundary and the file locations correctly, and `deep-research/feature-catalog/feature-catalog.md:54` matches the workflow. No finding.
- Treating the `.cursor`/`.devin` symlink claim as wrong: `ls -la` confirms `.cursor/agents/*.md` and `.devin/agents/*/AGENT.md` are symlinks into `.claude/agents/`. Only the OpenCode/Codex half of that sentence is wrong.
- Treating `pause-sentinel-halt.md:110`'s citation of `.skilled/agents/deep-research.md:43-55` as stale: those lines are the ILLEGAL NESTING AND SCOPE LOCK block, which is what the row claims to anchor. Not a finding.

## Dead Ends

- The feature catalogs are not a productive surface for this topic. Of the thirteen catalog files that mention an `agents/` path, only the two iteration-dispatch files make an agent claim, and both are accurate. The remaining eleven reference agent paths as evidence links rather than as role, tool or status claims.
- `.skilled/commands/doctor/runtime-mirrors.md:59` describes the roster check only as "the agent roster" without naming a runtime count or a canonical tree, so the command doc itself carries no contradictable claim. The misdescription lives in the script it invokes.

## Edge Cases

- Ambiguous input: none this iteration.
- Contradictory evidence: findings 2 and 3 are two facets of one conflict — the doctor check treats `.claude/agents` as canonical and `.skilled/agents` as the OpenCode surface, which is the inverse of every other surface's naming. Both are cited separately because they fail differently: finding 2 measures against the wrong baseline, finding 3 never reads the real OpenCode tree.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs:9, :11, :45, :57, :65
- .skilled/commands/doctor/runtime-mirrors.md:59
- .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/command-flow-stress-tests/setup-cp-sandbox.sh:104
- .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/command-flow-stress-tests/exhausted-approach-respect.md:101, :123
- .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/command-flow-stress-tests/pause-sentinel-halt.md:87, :110
- .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/command-flow-stress-tests/spec-fence-writeback.md:84, :106
- .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/command-flow-stress-tests/setup-yaml-handoff.md:84
- .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/command-flow-stress-tests/iteration-citation-jsonl.md:84
- .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/command-flow-stress-tests/setup-cp-sandbox.sh:104
- .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/command-flow-stress-tests/leaf-only-nested-dispatch-refusal.md:63
- .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/synthesis-save-and-guardrails/final-synthesis-memory-save-and-guardrail-behavior.md:78
- .skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/iteration-dispatch.md
- .skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/iteration-dispatch.md
- .skilled/agents/deep-research.md:39, :424, :439
- .cursor/agents/, .devin/agents/, .dsh/agents/, .vibe/agents/, .opencode/agents/

## Assessment

- New information ratio: 0.88
- Questions addressed: Q4 (feature catalogs and manual testing playbooks), Q5 (specific misdescribing lines)
- Questions answered: Q4, Q5

## Reflection

- What worked and why: reading the doctor roster check as a claim about the roster rather than as code found four misdescriptions in one file, because its header comment, its canonical constant and its surface table each assert something about the eleven agents that the trees contradict. The playbook defect fell out of comparing the sandbox setup script against the diff commands it feeds.
- What did not work and why: the feature catalogs were probed first on the assumption that a catalog would restate agent roles. They do not — they describe loop mechanics and link to agent files as evidence — so that pass produced only ruled-out entries.
- What I would do next differently: for a playbook, read the setup script before the assertions. The setup script defines what the assertions can possibly observe, and that is where the defect was.

## Recommended Next Focus

The three iterations have covered every surface the topic names. The remaining work is synthesis, not another pass: consolidate the twenty-three findings into one report, group them by the misdescribed property (mirror inventory, source-of-truth path, status enum, tool set, routing class, stale line citation), and record the unresolved canonical-tree conflict as the one question the evidence does not settle.
