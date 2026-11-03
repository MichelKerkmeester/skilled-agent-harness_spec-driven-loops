# Deep Research Iteration 1

## Focus

Established the style decision contract, verified the corpus baseline, inspected the existing conversation prototypes, and selected high-value session-relaunch candidates.

## Actions Taken

- Read the style rule, conversation schema, validator runtime allowlist, package discovery code, and the relevant CLI and system-spec-kit scenarios.
- Enumerated the 56 validator-scanned package roots and the four scenario files with JSON conversation blocks.
- Checked the detached-lineage initialization and synthesis steps against the bound write surface.

## Findings

1. The verified corpus baseline is 56 validator-scanned playbook packages with four JSON conversation scenarios: one in sk-create-manual-testing-playbook and three in system-spec-kit. [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/003-conversation-adoption-research/spec.md:58] [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/manual-testing-playbook/conversation-runner/drive-a-scripted-conversation.md:44] [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-live-conversation.md:32] [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-kill-switch-conversation.md:31] [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-sibling-reproof-conversation.md:32]
2. The style decision is ordered: judgment stays single at Q1; multi-exchange, answer-dependent behavior, restart or compaction is conversation at Q2; cross-runtime or release-regression behavior is conversation at Q3 only when shell checks decide every turn; otherwise Q4 stays single. [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md:346] [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md:348] [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md:355] [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/references/conversation-scenarios.md:30] [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:39]
3. Keep the three system-spec-kit conversation scenarios as working Q2 prototypes: live decision capture already scripts question answers, compaction and restart, while kill-switch and sibling re-proof script question-tool answers and answer-dependent state. [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-live-conversation.md:32] [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-kill-switch-conversation.md:31] [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-sibling-reproof-conversation.md:32]
4. Prioritize JSON conversion for system-spec-kit session-relaunch-claude and session-relaunch-pi-opencode at Q2; session-relaunch-command-runtimes is Q2 and Q3 but should split supported Codex/Devin runs from Cursor/Hermes until the runner supports those runtimes. [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md:29] [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-pi-opencode.md:34] [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-command-runtimes.md:36] [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:39]
5. Keep cli-devin DV-001 and system-spec-kit 449 compact/names-only CLI discovery at Q4: each checks one request or command result; the word compact in the latter is output compaction, not session compaction. [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/manual-testing-playbook/cli-invocation/default-invocation.md:20] [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/cli-compact-and-completion.md:22]
6. Workflow scope conflict recorded: YAML pre-init and post-synthesis steps write or validate the parent spec and resource map; the dispatch bounds writes to this lineage and explicitly forbids those operations, so those steps are omitted while lineage-local initialization and synthesis proceed. [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:487] [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:530] [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:2190] [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:2270] [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:2290]

## SCOPE VIOLATIONS

- Omitted the YAML pre-init spec mutation and validation because they target the parent spec folder and the dispatch explicitly bans that write. Omitted resource-map emission, spec writeback, and post-synthesis strict validation for the same boundary. The iteration and lineage synthesis remain in scope.
- The YAML's fanout merge is coordinator work; this detached lineage records its local registry and dashboard for the later merge.

## Questions Answered

- Which candidates can the shared runner execute across its supported runtimes, and which are constrained by runtime support or host prerequisites?

## Questions Remaining

- Which exact scenarios in each skill and mode meet Q2 or Q3, and which one-shot scenarios stay at Q1 or Q4?
- Which runtime-specific scenarios need to split because the runner lacks a matching adapter?
- Which question-tool, restart and compaction behaviors have no scenario yet?
- Which candidates rank highest by value and execution cost?

## Sources Consulted

- specs/sk-doc/065-conversation-playbook-scenarios/003-conversation-adoption-research/spec.md
- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md
- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/references/conversation-scenarios.md
- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs
- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/manual-testing-playbook/conversation-runner/drive-a-scripted-conversation.md
- .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-live-conversation.md
- .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-kill-switch-conversation.md
- .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-sibling-reproof-conversation.md
- .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md
- .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-pi-opencode.md
- .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-command-runtimes.md
- .skilled/commands/deep/assets/deep-research-auto.yaml

## Assessment

Six findings; all six are fully new for this lineage. newInfoRatio = 1.00. The strongest early conversion candidate is session relaunch, where the runner's restart action matches the tested behavior; the existing decision-capture scripts provide proven examples.

## Reflection

The first pass confirms that conversation support is sparse, but conversion must preserve the tested surface. A runner restart script cannot stand in for a headless CLI resume flag unless its turns and checks exercise that flag.

## Recommended Next Focus

Audit CLI continuity modes and identify where the shared runner can test the actual command behavior versus where manual multi-command scenarios should remain.

Timestamp: 2026-11-02T17:48:06Z
