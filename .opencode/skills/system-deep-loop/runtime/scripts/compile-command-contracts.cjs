#!/usr/bin/env node
'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const WORKSPACE_ROOT = path.resolve(__dirname, '..', '..', '..', '..', '..');
const GENERATED_HEADER_START = '<!-- GENERATED_COMMAND_CONTRACT_HEADER_START';
const GENERATED_HEADER_END = 'GENERATED_COMMAND_CONTRACT_HEADER_END -->';
const CONTRACT_VERSION = 1;

const SHARED_SOURCES = {
  autoModeContract: '.opencode/skills/system-spec-kit/references/workflows/auto-mode-contract.md',
  modeRegistry: '.opencode/skills/system-deep-loop/mode-registry.json',
  hubSkill: '.opencode/skills/system-deep-loop/SKILL.md',
  resolveInjectionMode: '.opencode/skills/system-deep-loop/shared/rollout/resolve-injection-mode.cjs',
};

const REFS = {
  dispatchReceipt: {
    writer: '.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts',
    validator: '.opencode/skills/system-deep-loop/runtime/lib/deep-loop/post-dispatch-validate.ts',
    rule: 'Reference the existing intent/completion receipt pair and validator; do not copy receipt logic into the command contract.',
  },
  progressRecord: {
    writer: '.opencode/skills/system-deep-loop/shared/progress/progress-record.cjs',
    rule: 'Reference additive started/completed progress records as liveness evidence; progress records are not iteration, convergence, or completion records.',
  },
};

const COMMANDS = {
  'deep/ai-council': {
    id: 'deep/ai-council',
    commandName: '/deep:ai-council',
    title: 'Deep Council',
    slug: 'deep_ai-council',
    mode: 'ai-council',
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
    ],
    renderMarkers: {
      autoStart: '### `:auto` Setup Resolution',
      autoEnd: '### Consolidated Setup Prompt for `:confirm` and No-Suffix Mode',
      confirmStart: '### Consolidated Setup Prompt for `:confirm` and No-Suffix Mode',
      confirmEnd: '## 2. Dashboard / Checkpoint Layout',
    },
    setup: {
      mode: 'AUTONOMOUS for :auto, INTERACTIVE for :confirm, ASK when no suffix is supplied',
      requiredFields: [
        'deliberation_topic',
        'spec_folder',
        'max_rounds_per_topic',
        'max_topics_per_session',
        'saturation_threshold',
        'executor',
      ],
      optionalFields: [
        'topics',
        'convergenceThreshold',
        'executor.mode',
        'executor.cli',
        'executor.model',
        'executor.reasoning',
        'executor.service_tier',
        'executor.timeout',
      ],
    },
    outputTemplate: {
      requiredArtifacts: [
        '{state_paths.session_config} council session configuration JSON',
        '{state_paths.session_state_log} append-only canonical JSONL session record',
        '{state_paths.findings_registry} cross-topic findings registry JSON',
        '{state_paths.topics_dir}/** topic, round, and seat artifacts',
        '{state_paths.topic_report_pattern} per-topic topic report markdown',
        '{state_paths.council_report_pattern} per-topic council report markdown',
        '{state_paths.session_report} session-wide council report markdown',
      ],
    },
    writeBoundary: {
      approvedRoot: '{spec_folder}/ai-council resolved from spec_folder for ai-council',
      allowed: [
        '{state_paths.packet_dir} resolved packet-local ai-council root',
        '{state_paths.lock_file} advisory lock acquire/release',
        '{state_paths.session_config}',
        '{state_paths.session_state_log} append only',
        '{state_paths.findings_registry}',
        '{state_paths.topics_dir}/** topic, round, and seat artifacts',
        '{state_paths.topic_report_pattern}',
        '{state_paths.council_report_pattern}',
        '{state_paths.session_report}',
        '{state_paths.prompt_dir} rendered council prompts',
        'coverage-graph records for loop_type=council',
      ],
      readOnly: [
        'declared deliberation topic and source files used as context',
        'command Markdown',
        'workflow YAML assets',
        'agent definitions',
        'compiled contracts other than the selected build target',
        'implementation files outside the council artifact root',
      ],
      banned: [
        'delete, rename, move, or truncate operations outside the allowed list',
        'writes outside the resolved council packet',
        'implementation fixes during council execution',
        'council seats writing source files or graph storage directly',
        'mixing multiple CLI executors within one round',
      ],
    },
    tools: {
      allowed: ['Read', 'Write', 'Edit', 'Bash', 'Grep', 'Glob', 'Task', 'memory_context', 'memory_search', 'code_graph_query', 'code_graph_context'],
      permittedByExecutor: {
        native: ['Read', 'Write', 'Edit', 'Bash', 'Grep', 'Glob', 'Task', 'memory_context', 'memory_search', 'code_graph_query', 'code_graph_context'],
        'cli-opencode': ['headless command execution through YAML-owned audited dispatch only'],
        'cli-claude-code': ['headless command execution through YAML-owned audited dispatch only'],
      },
    },
  },
  'deep/alignment': {
    id: 'deep/alignment',
    commandName: '/deep:alignment',
    title: 'Deep Alignment',
    slug: 'deep_alignment',
    mode: 'alignment',
    runtimeLoopType: 'alignment',
    commandPath: '.opencode/commands/deep/alignment.md',
    presentationPath: '.opencode/commands/deep/assets/deep-alignment-presentation.txt',
    autoWorkflowPath: '.opencode/commands/deep/assets/deep-alignment-auto.yaml',
    confirmWorkflowPath: '.opencode/commands/deep/assets/deep-alignment-confirm.yaml',
    modeSkillPath: '.opencode/skills/system-deep-loop/deep-alignment/SKILL.md',
    agentPath: '.opencode/agents/deep-alignment.md',
    sourcePaths: [
      '.opencode/commands/deep/alignment.md',
      '.opencode/commands/deep/assets/deep-alignment-presentation.txt',
      SHARED_SOURCES.autoModeContract,
      '.opencode/commands/deep/assets/deep-alignment-auto.yaml',
      '.opencode/commands/deep/assets/deep-alignment-confirm.yaml',
      SHARED_SOURCES.modeRegistry,
      SHARED_SOURCES.hubSkill,
      '.opencode/skills/system-deep-loop/deep-alignment/SKILL.md',
      '.opencode/skills/system-deep-loop/deep-alignment/references/scoping-protocol.md',
      '.opencode/skills/system-deep-loop/deep-alignment/references/discover-contract.md',
      '.opencode/skills/system-deep-loop/deep-alignment/references/lane-config-schema.md',
      '.opencode/skills/system-deep-loop/deep-alignment/references/state-machine-wiring.md',
      '.opencode/skills/system-deep-loop/deep-alignment/assets/deep-alignment-config-template.json',
      '.opencode/agents/deep-alignment.md',
      SHARED_SOURCES.resolveInjectionMode,
    ],
    renderMarkers: {
      autoStart: '### `:auto` Setup Resolution',
      autoEnd: '### Consolidated Setup Prompt for `:confirm` and No-Suffix Mode',
      confirmStart: '### Consolidated Setup Prompt for `:confirm` and No-Suffix Mode',
      confirmEnd: '## 2. Dashboard / Checkpoint Layout',
    },
    setup: {
      mode: 'AUTONOMOUS for :auto, INTERACTIVE for :confirm, ASK when no suffix is supplied',
      requiredFields: [
        'alignment_target',
        'lanes',
        'spec_folder',
        'execution_mode',
        'lineage_mode',
        'max_iterations',
        'coverage_threshold',
        'stability_window',
      ],
      optionalFields: [
        'lane_config_path',
        'session_id',
        'batch_size',
        'executor_timeout',
      ],
    },
    outputTemplate: {
      requiredArtifacts: [
        '{state_paths_iteration_pattern} iteration narrative markdown',
        '{state_paths_state_log} append-only canonical JSONL iteration record',
        '{state_paths_delta_pattern} per-iteration delta JSONL',
      ],
    },
    writeBoundary: {
      approvedRoot: '{artifact_dir} resolved from spec_folder for alignment',
      allowed: [
        '{state_paths_iteration_pattern}',
        '{state_paths_state_log} append only',
        '{state_paths_delta_pattern}',
        '{state_paths_findings_registry} reducer-owned in-place updates only',
        '{state_paths_config} single terminal status:complete transition only',
        '{state_paths_corpus} init-time write only',
        '{state_paths_alignment_output} synthesis write only',
        '{state_paths_lock_file} advisory lock acquire/release',
        '{state_paths_prompt_dir} rendered prompts',
      ],
      readOnly: [
        'every audited artifact in the resolved lanes',
        'command Markdown',
        'workflow YAML assets',
        'agent definitions',
        'compiled contracts other than the selected build target',
      ],
      banned: [
        'delete, rename, move, or truncate operations outside the allowed list',
        'writes outside the resolved alignment packet',
        'any modification of an audited artifact (this mode is read-only by contract)',
        'remediation actions during the audit loop (REMEDIATE is a separate operator opt-in)',
      ],
    },
    tools: {
      allowed: ['Read', 'Grep', 'Glob', 'Task', 'Bash', 'memory_context', 'memory_search', 'code_graph_query'],
      permittedByExecutor: {
        native: ['Read', 'Grep', 'Glob', 'Task', 'Bash', 'memory_context', 'memory_search', 'code_graph_query'],
      },
    },
  },
  'deep/review': {
    id: 'deep/review',
    commandName: '/deep:review',
    title: 'Deep Review',
    slug: 'deep_review',
    mode: 'review',
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
    ],
    renderMarkers: {
      autoStart: '### `:auto` Setup Resolution',
      autoEnd: '### Consolidated Setup Prompt for `:confirm` and No-Suffix Mode',
      confirmStart: '### Consolidated Setup Prompt for `:confirm` and No-Suffix Mode',
      confirmEnd: '## 2. Dashboard / Checkpoint Layout',
    },
    setup: {
      mode: 'AUTONOMOUS for :auto, INTERACTIVE for :confirm, ASK when no suffix is supplied',
      requiredFields: [
        'review_target',
        'review_target_type',
        'review_dimensions',
        'spec_folder',
        'execution_mode',
        'lineage_mode',
        'maxIterations',
        'convergenceThreshold',
        'stop_policy',
      ],
      optionalFields: [
        'executor',
        'executor_model',
        'executor_config_dir',
        'executor_reasoning',
        'executor_service_tier',
        'executor_timeout',
        'resource_map_emit',
        'config.fanout_lineage_artifact_dir',
        'fanout_executors',
        'fanout_concurrency',
      ],
    },
    outputTemplate: {
      requiredArtifacts: [
        '{state_paths_iteration_pattern} iteration narrative markdown',
        '{state_paths_state_log} append-only canonical JSONL iteration record',
        '{state_paths_delta_pattern} per-iteration delta JSONL',
      ],
    },
    writeBoundary: {
      approvedRoot: '{artifact_dir} resolved from spec_folder for review',
      allowed: [
        '{state_paths_iteration_pattern}',
        '{state_paths_state_log} append only',
        '{state_paths_delta_pattern}',
        '{state_paths_strategy} in-place updates only',
        '{state_paths_findings_registry} in-place updates only',
      ],
      readOnly: [
        'declared review target',
        'command Markdown',
        'workflow YAML assets',
        'agent definitions',
        'compiled contracts other than the selected build target',
      ],
      banned: [
        'delete, rename, move, or truncate operations outside the allowed list',
        'writes outside the resolved review packet',
        'implementation fixes during review execution',
      ],
    },
    tools: {
      allowed: ['Read', 'Write', 'Edit', 'Bash', 'Grep', 'Glob', 'Task', 'memory_context', 'memory_search', 'code_graph_query', 'code_graph_context'],
      permittedByExecutor: {
        native: ['Read', 'Write', 'Edit', 'Bash', 'Grep', 'Glob', 'memory_context', 'memory_search', 'code_graph_query', 'code_graph_context'],
        'cli-opencode': ['headless command execution through YAML-owned audited dispatch only'],
        'cli-claude-code': ['headless command execution through YAML-owned audited dispatch only'],
      },
    },
  },
  'deep/research': {
    id: 'deep/research',
    commandName: '/deep:research',
    title: 'Deep Research',
    slug: 'deep_research',
    mode: 'research',
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
    ],
    renderMarkers: {
      autoStart: '### `:auto` Setup Resolution',
      autoEnd: '### Consolidated Prompt Template',
      confirmStart: '### Consolidated Prompt Template',
      confirmEnd: '## 2. Dashboard / Checkpoint Layout',
    },
    setup: {
      mode: 'AUTONOMOUS for :auto, INTERACTIVE for :confirm, ASK when no suffix is supplied',
      requiredFields: [
        'research_topic',
        'spec_folder',
        'execution_mode',
        'maxIterations',
        'convergenceThreshold',
      ],
      optionalFields: [
        'dry_run',
        'executor',
        'executor_model',
        'executor_config_dir',
        'executor_reasoning',
        'executor_service_tier',
        'executor_timeout',
        'resource_map_emit',
        'fanout_executors',
        'fanout_concurrency',
      ],
    },
    outputTemplate: {
      requiredArtifacts: [
        '{state_paths_iteration_pattern} iteration narrative markdown',
        '{state_paths_state_log} append-only canonical JSONL iteration record',
        '{state_paths_delta_pattern} per-iteration delta JSONL',
      ],
    },
    writeBoundary: {
      approvedRoot: '{artifact_dir} resolved from spec_folder for research',
      allowed: [
        '{state_paths_iteration_pattern}',
        '{state_paths_state_log} append only',
        '{state_paths_delta_pattern}',
        '{state_paths.research_output} only when progressive synthesis is enabled',
        'idea capture files only when explicitly allowed and packet-local',
      ],
      readOnly: [
        '{state_paths_strategy}',
        '{state_paths_registry}',
        '{state_paths_dashboard}',
        'command Markdown',
        'workflow YAML assets',
        'agent definitions',
        'compiled contracts other than the selected build target',
      ],
      banned: [
        'delete, rename, move, or truncate operations outside the allowed list',
        'writes outside the resolved research packet',
        'implementation fixes during research execution',
      ],
    },
    tools: {
      allowed: ['Read', 'Write', 'Edit', 'Bash', 'Grep', 'Glob', 'Task', 'WebFetch', 'memory_context', 'memory_search', 'code_graph_query', 'code_graph_context'],
      permittedByExecutor: {
        native: ['Read', 'Write', 'Edit', 'Bash', 'Grep', 'Glob', 'WebFetch', 'memory_context', 'memory_search', 'code_graph_query', 'code_graph_context'],
        'cli-opencode': ['headless command execution through YAML-owned audited dispatch only'],
        'cli-claude-code': ['headless command execution through YAML-owned audited dispatch only'],
      },
    },
  },
};

function relPath(absolutePath) {
  return path.relative(WORKSPACE_ROOT, absolutePath).split(path.sep).join('/');
}

function absolutePath(sourcePath) {
  return path.resolve(WORKSPACE_ROOT, sourcePath);
}

function sha256(input) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

function sha256File(sourcePath) {
  return sha256(fs.readFileSync(absolutePath(sourcePath)));
}

function normalizeCompiledBody(body) {
  return body.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trimEnd() + '\n';
}

function extractBetween(content, startMarker, endMarker, sourcePath) {
  const start = content.indexOf(startMarker);
  if (start === -1) throw new Error(`Missing marker ${startMarker} in ${sourcePath}`);
  const end = content.indexOf(endMarker, start + startMarker.length);
  if (end === -1) throw new Error(`Missing marker ${endMarker} in ${sourcePath}`);
  return content.slice(start, end).trimEnd();
}

function getCommandDefinition(command) {
  const definition = COMMANDS[command];
  if (!definition) {
    const supported = Object.keys(COMMANDS).join(', ');
    throw new Error(`Unsupported command ${command}. Supported commands: ${supported}`);
  }
  return definition;
}

function sourceDigestsFor(command) {
  const definition = getCommandDefinition(command);
  return definition.sourcePaths.map((sourcePath) => ({
    path: sourcePath,
    sha256: sha256File(sourcePath),
    section: 'full',
  }));
}

function readText(sourcePath) {
  return fs.readFileSync(absolutePath(sourcePath), 'utf8');
}

function renderList(items) {
  return items.map((item) => `  - ${item}`).join('\n');
}

function renderYamlList(items, indent = '  ') {
  return items.map((item) => `${indent}- ${JSON.stringify(item)}`).join('\n');
}

function buildRenderBlocks(definition) {
  const presentation = readText(definition.presentationPath);
  const autoBlock = extractBetween(
    presentation,
    definition.renderMarkers.autoStart,
    definition.renderMarkers.autoEnd,
    definition.presentationPath,
  );
  const confirmBlock = extractBetween(
    presentation,
    definition.renderMarkers.confirmStart,
    definition.renderMarkers.confirmEnd,
    definition.presentationPath,
  );

  return [
    '## renderBlocks.auto',
    '',
    'Rule: render the marked block verbatim; do not paraphrase, summarize, reorder, or substitute inside the START/END boundary.',
    '',
    '<!-- START renderBlocks.auto -->',
    '~~~markdown',
    autoBlock,
    '~~~',
    '<!-- END renderBlocks.auto -->',
    '',
    '## renderBlocks.confirm',
    '',
    'Rule: render the marked block verbatim; do not paraphrase, summarize, reorder, or substitute inside the START/END boundary.',
    '',
    '<!-- START renderBlocks.confirm -->',
    '~~~markdown',
    confirmBlock,
    '~~~',
    '<!-- END renderBlocks.confirm -->',
  ].join('\n');
}

function buildContractBody(definition) {
  const sourceList = definition.sourcePaths.map((sourcePath, index) => `${index + 1}. \`${sourcePath}\``).join('\n');
  const mode = definition.commandName.replace('/deep:', '');
  const leaf = definition.agentPath.split('/').pop().replace(/\.md$/, '');
  // Council convenes its seats in-CLI (the runtime's own models); every other deep
  // mode delegates one leaf per iteration. The delegation directive + its proof of
  // work differ accordingly, so the executor is told the right thing per mode.
  const delegationKind = definition.delegationKind || 'leaf_dispatch';
  const minSeats = definition.minSeats || 3;
  const delegationBullets = delegationKind === 'in_cli_seats'
    ? [
        `- PROCEED immediately: load the auto workflow YAML and convene the ${mode} round over the bound topic.`,
        `- CONVENE IN-CLI: run the round's seats using your OWN model bench / distinct reasoning lenses in-CLI — do NOT dispatch a task per seat (in-CLI is the default and common council mode). Produce at least ${minSeats} DISTINCT seats.`,
        `- SEAT PROOF: persist each seat stepwise as it returns (persist-artifacts.cjs --seat / persistSeatStepwise) so the persisted artifacts name distinct seat ids; the completed per-seat progress-record count must equal seats_per_round. The delegation evidence is the persisted distinct seats, not a task dispatch.`,
      ]
    : [
        `- PROCEED immediately: load the auto workflow YAML and dispatch the \`${leaf}\` agent to run ONE iteration of the ${mode} loop over the bound target.`,
        `- DISPATCH ONLY: you dispatch \`${leaf}\` to run one iteration; you do NOT read, edit, patch, or run the ${mode} loop over the target yourself. The auto workflow YAML owns the loop itself — setup, dispatch-per-iteration, reducer sync, convergence checks, synthesis, and all loop-level artifact writes; the \`${leaf}\` leaf owns only its own single-iteration artifacts — mixing your own inline work with the dispatch is a route violation.`,
        `- ROUTE PROOF: dispatch through the auto workflow with its prompt pack so \`${leaf}\` writes each iteration state record with the route-proof fields present — \`target_agent: "${leaf}"\`, \`resolved_route\`, \`agent_definition_loaded: true\`, and \`mode: "${mode}"\`. A completed run whose iteration state records omit these fields is an incomplete delegation and does not pass.`,
      ];
  const delegationClosing = delegationKind === 'in_cli_seats'
    ? `Your job is to CONVENE ${minSeats}+ distinct ${mode} seats in-CLI over the bound topic and persist each as it returns — NOT to write a single-lens plan yourself, and NOT to review, analyze, or summarize this contract. This contract is your instruction set; the topic is the bound spec_folder/target named in your message, never this document.`
    : `Your job is to DISPATCH \`${leaf}\` to run ONE iteration of the ${mode} loop over the bound target — NOT to run the loop yourself, and NOT to review, analyze, or summarize this contract. The auto workflow YAML owns the loop itself (setup, dispatch-per-iteration, reducer sync, convergence, synthesis, and loop-level writes). This contract is your instruction set; the ${mode} target is the bound spec_folder/target named in your message, never this document.`;
  const directiveOpening = `You were invoked via \`opencode run --command ${definition.id}\` with the \`:auto\` suffix and a bound spec_folder and target in your message. The \`:auto\` suffix plus the bound spec_folder mean setup is ALREADY resolved. Therefore:`;
  const setupDirectiveBullets = [
    '- DO NOT emit the consolidated setup question (target/mode, research topic, Spec Folder A/B/C/D/E, execution mode, max iterations, executor). The bound spec_folder is your write authority; do not ask which spec folder should own the writes.',
    '- DO NOT halt for the repo-wide `CLAUDE.md` Gate-3 documentation gate. Under AUTONOMOUS execution with a validated prebound spec folder, Gate 3 is already satisfied by that folder (see gate3Precedence below).',
  ];
  const gate3PrecedenceBlock = [
        '## gate3Precedence',
        '',
        '```yaml',
        'block: gate3Precedence',
        'classifierPath: .opencode/skills/system-spec-kit/shared/gate-3-classifier.ts',
        'classifierLines:',
        '  commandContractShape: "67-72"',
        '  autonomousSatisfaction: "653-680"',
        `command: ${definition.commandName}`,
        'executionMode: AUTONOMOUS',
        'commandContract:',
        '  declaresAutonomousExecution: true',
        '  ownsSpecFolderSetup: true',
        '  allowedSpecFolderSources:',
        '    - flag',
        '    - marker',
        '    - scope_extract',
        `  writeBoundary: ${JSON.stringify(definition.writeBoundary.approvedRoot)}`,
        'rule: "When the classifier receives AUTONOMOUS execution, a validated prebound spec folder, and this command contract, Gate 3 is satisfied by the prebound folder before any write."',
        '```',
      ];
  return normalizeCompiledBody([
    `# Compiled Command Contract: ${definition.commandName}`,
    '',
    'This generated contract collapses the maintained command authority chain into one grep-checkable executor contract. Maintained sources remain authoritative; regenerate this file when any source digest changes.',
    '',
    '## autonomousExecutionDirective',
    '',
    '> Read this first. It is an imperative to you, the executor — not background information.',
    '',
    directiveOpening,
    '',
    ...setupDirectiveBullets,
    ...delegationBullets,
    '',
    delegationClosing,
    '',
    '## sourceAuthority',
    '',
    sourceList,
    '',
    ...gate3PrecedenceBlock,
    '',
    buildRenderBlocks(definition),
    '',
    '## setup',
    '',
    '```yaml',
    'block: setup',
    `mode: ${JSON.stringify(definition.setup.mode)}`,
    'requiredFields:',
    renderYamlList(definition.setup.requiredFields, '  '),
    'optionalFields:',
    renderYamlList(definition.setup.optionalFields, '  '),
    `autoWorkflow: ${definition.autoWorkflowPath}`,
    `confirmWorkflow: ${definition.confirmWorkflowPath}`,
    '```',
    '',
    '## outputTemplate',
    '',
    '```yaml',
    'block: outputTemplate',
    ...(definition.promptPackPath ? [`promptPackPath: ${definition.promptPackPath}`] : []),
    'requiredArtifacts:',
    renderYamlList(definition.outputTemplate.requiredArtifacts, '  '),
    'validation: "YAML-owned post-dispatch validation rejects missing or malformed artifacts."',
    '```',
    '',
    '## writeBoundary',
    '',
    '```yaml',
    'block: writeBoundary',
    `approvedRoot: ${JSON.stringify(definition.writeBoundary.approvedRoot)}`,
    'allowed:',
    renderYamlList(definition.writeBoundary.allowed, '  '),
    'readOnly:',
    renderYamlList(definition.writeBoundary.readOnly, '  '),
    'banned:',
    renderYamlList(definition.writeBoundary.banned, '  '),
    '```',
    '',
    '## executorContract',
    '',
    '```yaml',
    'block: executorContract',
    'appliesWhen:',
    '  executionMode: AUTONOMOUS',
    '  writeBoundaryResolved: true',
    'rules:',
    '  - "The command Markdown resolves setup and selects YAML; YAML owns dispatch, workflow steps, and artifact writes."',
    '  - "Executor dispatch must preserve route intent, selected mode, target agent, write boundary, and artifact paths."',
    '  - "Native and CLI executors must produce only the required prompt-pack artifacts inside the resolved boundary."',
    '  - "Fan-out receipt parity is not claimed here; fan-out remains governed by the workflow runner and merge contract."',
    '  - "Missing or invalid receipt evidence makes route claims advisory only and forbids findings output."',
    '```',
    '',
    '## refs',
    '',
    '```yaml',
    'block: refs',
    'dispatchReceipt:',
    `  writer: ${REFS.dispatchReceipt.writer}`,
    `  validator: ${REFS.dispatchReceipt.validator}`,
    `  rule: ${JSON.stringify(REFS.dispatchReceipt.rule)}`,
    'progressRecord:',
    `  writer: ${REFS.progressRecord.writer}`,
    `  rule: ${JSON.stringify(REFS.progressRecord.rule)}`,
    '```',
    '',
    '## tools',
    '',
    '```yaml',
    'block: tools',
    'allowed:',
    renderYamlList(definition.tools.allowed, '  '),
    'permittedByExecutor:',
    ...Object.entries(definition.tools.permittedByExecutor).flatMap(([executor, tools]) => [
      `  ${executor}:`,
      renderYamlList(tools, '    '),
    ]),
    '```',
    '',
    '## absorptionAbort',
    '',
    '```yaml',
    'block: absorptionAbort',
    'rule: "Producing findings without a dispatch receipt is role absorption; write no findings."',
    'writePolicy: "If receipt evidence is absent, invalid, or mismatched to command intent, emit an abort status and leave finding artifacts unwritten."',
    '```',
  ].join('\n'));
}

function buildHeader(definition, sourceDigests, compiledBodyDigest) {
  const header = {
    id: definition.id,
    command: definition.commandName,
    version: CONTRACT_VERSION,
    generatedBy: relPath(__filename),
    sourceDigests,
    compiledBodyDigest,
  };
  return `${GENERATED_HEADER_START}\n${JSON.stringify(header, null, 2)}\n${GENERATED_HEADER_END}\n`;
}

function stripGeneratedHeader(contractText) {
  const start = contractText.indexOf(GENERATED_HEADER_START);
  const end = contractText.indexOf(GENERATED_HEADER_END);
  if (start !== 0 || end === -1) throw new Error('Generated contract header not found');
  return contractText.slice(end + GENERATED_HEADER_END.length).replace(/^\n/, '');
}

function parseDigestHeader(contractText) {
  const start = contractText.indexOf(GENERATED_HEADER_START);
  const end = contractText.indexOf(GENERATED_HEADER_END);
  if (start !== 0 || end === -1) throw new Error('Generated contract header not found');
  const jsonText = contractText.slice(start + GENERATED_HEADER_START.length, end).trim();
  return JSON.parse(jsonText);
}

function computeCompiledBodyDigest(body) {
  return sha256(normalizeCompiledBody(body));
}

function computeCompiledBodyDigestFromContract(contractText) {
  return computeCompiledBodyDigest(stripGeneratedHeader(contractText));
}

function buildContract(command) {
  const definition = getCommandDefinition(command);
  const body = buildContractBody(definition);
  const sourceDigests = sourceDigestsFor(command);
  const compiledBodyDigest = computeCompiledBodyDigest(body);
  return buildHeader(definition, sourceDigests, compiledBodyDigest) + body;
}

function outputPathFor(command) {
  const definition = getCommandDefinition(command);
  return path.join(WORKSPACE_ROOT, '.opencode/commands/deep/assets/compiled', `${definition.slug}.contract.md`);
}

function parseArgs(argv) {
  const args = { write: false };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--write') {
      args.write = true;
      continue;
    }
    if (token === '--command') {
      const value = argv[i + 1];
      if (!value || value.startsWith('--')) throw new Error('--command requires a value');
      args.command = value;
      i += 1;
      continue;
    }
    if (token === '--help' || token === '-h') {
      args.help = true;
      continue;
    }
    throw new Error(`Unknown argument: ${token}`);
  }
  return args;
}

function printHelp() {
  process.stdout.write('Usage: node compile-command-contracts.cjs --command deep/ai-council|deep/review|deep/research [--write]\n');
}

function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  if (args.help) {
    printHelp();
    return;
  }
  if (!args.command) throw new Error('--command is required');
  const contract = buildContract(args.command);
  if (args.write) {
    const out = outputPathFor(args.command);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, contract, 'utf8');
    process.stdout.write(`${relPath(out)}\n`);
  } else {
    process.stdout.write(contract);
  }
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exit(1);
  }
}

module.exports = {
  COMMANDS,
  GENERATED_HEADER_END,
  GENERATED_HEADER_START,
  WORKSPACE_ROOT,
  buildContract,
  buildContractBody,
  computeCompiledBodyDigest,
  computeCompiledBodyDigestFromContract,
  getCommandDefinition,
  normalizeCompiledBody,
  outputPathFor,
  parseDigestHeader,
  sha256,
  sha256File,
  sourceDigestsFor,
  stripGeneratedHeader,
};
