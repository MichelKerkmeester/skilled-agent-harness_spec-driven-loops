## Edit 1

File: `.skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs`

OLD:

~~~~text
const SHARED_SOURCES = {
  autoModeContract: '.opencode/skills/system-spec-kit/references/workflows/auto-mode-contract.md',
  modeRegistry: '.opencode/skills/system-deep-loop/mode-registry.json',
  hubSkill: '.opencode/skills/system-deep-loop/SKILL.md',
  resolveInjectionMode: '.opencode/skills/system-deep-loop/shared/rollout/resolve-injection-mode.cjs',
};
~~~~

NEW:

~~~~text
const SHARED_SOURCES = {
  autoModeContract: '.skilled/skills/system-spec-kit/references/workflows/auto-mode-contract.md',
  modeRegistry: '.skilled/skills/system-deep-loop/mode-registry.json',
  hubSkill: '.skilled/skills/system-deep-loop/SKILL.md',
  resolveInjectionMode: '.skilled/skills/system-deep-loop/shared/rollout/resolve-injection-mode.cjs',
};
~~~~

## Edit 2

File: `.skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs`

OLD:

~~~~text
  dispatchReceipt: {
    writer: '.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts',
    validator: '.opencode/skills/system-deep-loop/runtime/lib/deep-loop/post-dispatch-validate.ts',
    rule: 'Reference the existing intent/completion receipt pair and validator; do not copy receipt logic into the command contract.',
  },
  progressRecord: {
    writer: '.opencode/skills/system-deep-loop/shared/progress/progress-record.cjs',
    rule: 'Reference additive started/completed progress records as liveness evidence; progress records are not iteration, convergence, or completion records.',
~~~~

NEW:

~~~~text
  dispatchReceipt: {
    writer: '.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts',
    validator: '.skilled/skills/system-deep-loop/runtime/lib/deep-loop/post-dispatch-validate.ts',
    rule: 'Reference the existing intent/completion receipt pair and validator; do not copy receipt logic into the command contract.',
  },
  progressRecord: {
    writer: '.skilled/skills/system-deep-loop/shared/progress/progress-record.cjs',
    rule: 'Reference additive started/completed progress records as liveness evidence; progress records are not iteration, convergence, or completion records.',
~~~~

## Edit 3

File: `.skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs`

OLD:

~~~~text
    runtimeLoopType: 'council',
    commandPath: '.opencode/commands/deep/ai-council.md',
    presentationPath: '.opencode/commands/deep/assets/deep-ai-council-presentation.txt',
    autoWorkflowPath: '.opencode/commands/deep/assets/deep-ai-council-auto.yaml',
    confirmWorkflowPath: '.opencode/commands/deep/assets/deep-ai-council-confirm.yaml',
    modeSkillPath: '.opencode/skills/system-deep-loop/deep-ai-council/SKILL.md',
    agentPath: '.opencode/agents/ai-council.md',
    promptPackPath: '.opencode/skills/system-deep-loop/deep-ai-council/assets/prompt-pack-round.md',
    delegationKind: 'in_cli_seats',
    minSeats: 3,
    sourcePaths: [
      '.opencode/commands/deep/ai-council.md',
      '.opencode/commands/deep/assets/deep-ai-council-presentation.txt',
      SHARED_SOURCES.autoModeContract,
      '.opencode/commands/deep/assets/deep-ai-council-auto.yaml',
      '.opencode/commands/deep/assets/deep-ai-council-confirm.yaml',
      SHARED_SOURCES.modeRegistry,
      SHARED_SOURCES.hubSkill,
      '.opencode/skills/system-deep-loop/deep-ai-council/SKILL.md',
      '.opencode/skills/system-deep-loop/deep-ai-council/references/convergence/convergence-signals.md',
      '.opencode/skills/system-deep-loop/deep-ai-council/references/convergence/deep-mode.md',
      '.opencode/skills/system-deep-loop/deep-ai-council/references/convergence/depth-dispatch.md',
      '.opencode/skills/system-deep-loop/deep-ai-council/references/convergence/failure-handling.md',
      '.opencode/skills/system-deep-loop/deep-ai-council/references/scoring/findings-registry.md',
      '.opencode/skills/system-deep-loop/deep-ai-council/references/scoring/scoring-rubric.md',
      '.opencode/skills/system-deep-loop/deep-ai-council/references/structure/folder-layout.md',
      '.opencode/skills/system-deep-loop/deep-ai-council/references/structure/output-schema.md',
      '.opencode/skills/system-deep-loop/deep-ai-council/references/structure/state-format.md',
      '.opencode/skills/system-deep-loop/deep-ai-council/references/integration/graph-support.md',
      '.opencode/skills/system-deep-loop/deep-ai-council/references/integration/loop-protocol.md',
      '.opencode/skills/system-deep-loop/deep-ai-council/references/integration/quick-reference.md',
      '.opencode/skills/system-deep-loop/deep-ai-council/references/patterns/anti-patterns.md',
      '.opencode/skills/system-deep-loop/deep-ai-council/references/patterns/command-wiring.md',
      '.opencode/skills/system-deep-loop/deep-ai-council/references/patterns/seat-diversity-patterns.md',
      '.opencode/skills/system-deep-loop/deep-ai-council/assets/deep-ai-council-config.json',
      '.opencode/skills/system-deep-loop/deep-ai-council/assets/prompt-pack-round.md',
      '.opencode/skills/system-deep-loop/deep-ai-council/assets/runtime-capabilities.json',
      '.opencode/agents/ai-council.md',
      SHARED_SOURCES.resolveInjectionMode,
~~~~

NEW:

~~~~text
    runtimeLoopType: 'council',
    commandPath: '.skilled/commands/deep/ai-council.md',
    presentationPath: '.skilled/commands/deep/assets/deep-ai-council-presentation.txt',
    autoWorkflowPath: '.skilled/commands/deep/assets/deep-ai-council-auto.yaml',
    confirmWorkflowPath: '.skilled/commands/deep/assets/deep-ai-council-confirm.yaml',
    modeSkillPath: '.skilled/skills/system-deep-loop/deep-ai-council/SKILL.md',
    agentPath: '.skilled/agents/ai-council.md',
    promptPackPath: '.skilled/skills/system-deep-loop/deep-ai-council/assets/prompt-pack-round.md',
    delegationKind: 'in_cli_seats',
    minSeats: 3,
    sourcePaths: [
      '.skilled/commands/deep/ai-council.md',
      '.skilled/commands/deep/assets/deep-ai-council-presentation.txt',
      SHARED_SOURCES.autoModeContract,
      '.skilled/commands/deep/assets/deep-ai-council-auto.yaml',
      '.skilled/commands/deep/assets/deep-ai-council-confirm.yaml',
      SHARED_SOURCES.modeRegistry,
      SHARED_SOURCES.hubSkill,
      '.skilled/skills/system-deep-loop/deep-ai-council/SKILL.md',
      '.skilled/skills/system-deep-loop/deep-ai-council/references/convergence/convergence-signals.md',
      '.skilled/skills/system-deep-loop/deep-ai-council/references/convergence/deep-mode.md',
      '.skilled/skills/system-deep-loop/deep-ai-council/references/convergence/depth-dispatch.md',
      '.skilled/skills/system-deep-loop/deep-ai-council/references/convergence/failure-handling.md',
      '.skilled/skills/system-deep-loop/deep-ai-council/references/scoring/findings-registry.md',
      '.skilled/skills/system-deep-loop/deep-ai-council/references/scoring/scoring-rubric.md',
      '.skilled/skills/system-deep-loop/deep-ai-council/references/structure/folder-layout.md',
      '.skilled/skills/system-deep-loop/deep-ai-council/references/structure/output-schema.md',
      '.skilled/skills/system-deep-loop/deep-ai-council/references/structure/state-format.md',
      '.skilled/skills/system-deep-loop/deep-ai-council/references/integration/graph-support.md',
      '.skilled/skills/system-deep-loop/deep-ai-council/references/integration/loop-protocol.md',
      '.skilled/skills/system-deep-loop/deep-ai-council/references/integration/quick-reference.md',
      '.skilled/skills/system-deep-loop/deep-ai-council/references/patterns/anti-patterns.md',
      '.skilled/skills/system-deep-loop/deep-ai-council/references/patterns/command-wiring.md',
      '.skilled/skills/system-deep-loop/deep-ai-council/references/patterns/seat-diversity-patterns.md',
      '.skilled/skills/system-deep-loop/deep-ai-council/assets/deep-ai-council-config.json',
      '.skilled/skills/system-deep-loop/deep-ai-council/assets/prompt-pack-round.md',
      '.skilled/skills/system-deep-loop/deep-ai-council/assets/runtime-capabilities.json',
      '.skilled/agents/ai-council.md',
      SHARED_SOURCES.resolveInjectionMode,
~~~~

## Edit 4

File: `.skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs`

OLD:

~~~~text
    runtimeLoopType: 'review',
    commandPath: '.opencode/commands/deep/review.md',
    presentationPath: '.opencode/commands/deep/assets/deep-review-presentation.txt',
    autoWorkflowPath: '.opencode/commands/deep/assets/deep-review-auto.yaml',
    confirmWorkflowPath: '.opencode/commands/deep/assets/deep-review-confirm.yaml',
    modeSkillPath: '.opencode/skills/system-deep-loop/deep-review/SKILL.md',
    agentPath: '.opencode/agents/deep-review.md',
    promptPackPath: '.opencode/skills/system-deep-loop/deep-review/assets/prompt-pack-iteration.md.tmpl',
    sourcePaths: [
      '.opencode/commands/deep/review.md',
      '.opencode/commands/deep/assets/deep-review-presentation.txt',
      SHARED_SOURCES.autoModeContract,
      '.opencode/commands/deep/assets/deep-review-auto.yaml',
      '.opencode/commands/deep/assets/deep-review-confirm.yaml',
      SHARED_SOURCES.modeRegistry,
      SHARED_SOURCES.hubSkill,
      '.opencode/skills/system-deep-loop/deep-review/SKILL.md',
      '.opencode/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md',
      '.opencode/skills/system-deep-loop/deep-review/references/state/state-format.md',
      '.opencode/skills/system-deep-loop/deep-review/assets/review-mode-contract.yaml',
      '.opencode/skills/system-deep-loop/deep-review/references/convergence/convergence.md',
      '.opencode/skills/system-deep-loop/deep-review/assets/deep-review-config.json',
      '.opencode/skills/system-deep-loop/deep-review/assets/prompt-pack-iteration.md.tmpl',
      '.opencode/agents/deep-review.md',
      SHARED_SOURCES.resolveInjectionMode,
~~~~

NEW:

~~~~text
    runtimeLoopType: 'review',
    commandPath: '.skilled/commands/deep/review.md',
    presentationPath: '.skilled/commands/deep/assets/deep-review-presentation.txt',
    autoWorkflowPath: '.skilled/commands/deep/assets/deep-review-auto.yaml',
    confirmWorkflowPath: '.skilled/commands/deep/assets/deep-review-confirm.yaml',
    modeSkillPath: '.skilled/skills/system-deep-loop/deep-review/SKILL.md',
    agentPath: '.skilled/agents/deep-review.md',
    promptPackPath: '.skilled/skills/system-deep-loop/deep-review/assets/prompt-pack-iteration.md.tmpl',
    sourcePaths: [
      '.skilled/commands/deep/review.md',
      '.skilled/commands/deep/assets/deep-review-presentation.txt',
      SHARED_SOURCES.autoModeContract,
      '.skilled/commands/deep/assets/deep-review-auto.yaml',
      '.skilled/commands/deep/assets/deep-review-confirm.yaml',
      SHARED_SOURCES.modeRegistry,
      SHARED_SOURCES.hubSkill,
      '.skilled/skills/system-deep-loop/deep-review/SKILL.md',
      '.skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md',
      '.skilled/skills/system-deep-loop/deep-review/references/state/state-format.md',
      '.skilled/skills/system-deep-loop/deep-review/assets/review-mode-contract.yaml',
      '.skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md',
      '.skilled/skills/system-deep-loop/deep-review/assets/deep-review-config.json',
      '.skilled/skills/system-deep-loop/deep-review/assets/prompt-pack-iteration.md.tmpl',
      '.skilled/agents/deep-review.md',
      SHARED_SOURCES.resolveInjectionMode,
~~~~

## Edit 5

File: `.skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs`

OLD:

~~~~text
    runtimeLoopType: 'research',
    commandPath: '.opencode/commands/deep/research.md',
    presentationPath: '.opencode/commands/deep/assets/deep-research-presentation.txt',
    autoWorkflowPath: '.opencode/commands/deep/assets/deep-research-auto.yaml',
    confirmWorkflowPath: '.opencode/commands/deep/assets/deep-research-confirm.yaml',
    modeSkillPath: '.opencode/skills/system-deep-loop/deep-research/SKILL.md',
    agentPath: '.opencode/agents/deep-research.md',
    promptPackPath: '.opencode/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl',
    sourcePaths: [
      '.opencode/commands/deep/research.md',
      '.opencode/commands/deep/assets/deep-research-presentation.txt',
      SHARED_SOURCES.autoModeContract,
      '.opencode/commands/deep/assets/deep-research-auto.yaml',
      '.opencode/commands/deep/assets/deep-research-confirm.yaml',
      SHARED_SOURCES.modeRegistry,
      SHARED_SOURCES.hubSkill,
      '.opencode/skills/system-deep-loop/deep-research/SKILL.md',
      '.opencode/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md',
      '.opencode/skills/system-deep-loop/deep-research/references/protocol/spec-check-protocol.md',
      '.opencode/skills/system-deep-loop/deep-research/references/state/state-format.md',
      '.opencode/skills/system-deep-loop/deep-research/references/convergence/convergence.md',
      '.opencode/skills/system-deep-loop/deep-research/assets/deep-research-config.json',
      '.opencode/skills/system-deep-loop/deep-research/assets/deep-research-strategy.md',
      '.opencode/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl',
      '.opencode/agents/deep-research.md',
      SHARED_SOURCES.resolveInjectionMode,
~~~~

NEW:

~~~~text
    runtimeLoopType: 'research',
    commandPath: '.skilled/commands/deep/research.md',
    presentationPath: '.skilled/commands/deep/assets/deep-research-presentation.txt',
    autoWorkflowPath: '.skilled/commands/deep/assets/deep-research-auto.yaml',
    confirmWorkflowPath: '.skilled/commands/deep/assets/deep-research-confirm.yaml',
    modeSkillPath: '.skilled/skills/system-deep-loop/deep-research/SKILL.md',
    agentPath: '.skilled/agents/deep-research.md',
    promptPackPath: '.skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl',
    sourcePaths: [
      '.skilled/commands/deep/research.md',
      '.skilled/commands/deep/assets/deep-research-presentation.txt',
      SHARED_SOURCES.autoModeContract,
      '.skilled/commands/deep/assets/deep-research-auto.yaml',
      '.skilled/commands/deep/assets/deep-research-confirm.yaml',
      SHARED_SOURCES.modeRegistry,
      SHARED_SOURCES.hubSkill,
      '.skilled/skills/system-deep-loop/deep-research/SKILL.md',
      '.skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md',
      '.skilled/skills/system-deep-loop/deep-research/references/protocol/spec-check-protocol.md',
      '.skilled/skills/system-deep-loop/deep-research/references/state/state-format.md',
      '.skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md',
      '.skilled/skills/system-deep-loop/deep-research/assets/deep-research-config.json',
      '.skilled/skills/system-deep-loop/deep-research/assets/deep-research-strategy.md',
      '.skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl',
      '.skilled/agents/deep-research.md',
      SHARED_SOURCES.resolveInjectionMode,
~~~~

## Edit 6

File: `.skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs`

OLD:

~~~~text
        'block: gate3Precedence',
        'classifierPath: .opencode/skills/system-spec-kit/shared/gate-3-classifier.ts',
        'classifierLines:',
~~~~

NEW:

~~~~text
        'block: gate3Precedence',
        'classifierPath: .skilled/skills/system-spec-kit/shared/gate-3-classifier.ts',
        'classifierLines:',
~~~~

## Edit 7

File: `.skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs`

OLD:

~~~~text
  const definition = getCommandDefinition(command);
  return path.join(absolutePath('.opencode/commands/deep/assets/compiled'), `${definition.slug}.contract.md`);
}
~~~~

NEW:

~~~~text
  const definition = getCommandDefinition(command);
  return path.join(absolutePath('.skilled/commands/deep/assets/compiled'), `${definition.slug}.contract.md`);
}
~~~~
