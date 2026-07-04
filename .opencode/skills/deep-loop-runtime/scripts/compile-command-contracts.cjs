#!/usr/bin/env node
'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const WORKSPACE_ROOT = path.resolve(__dirname, '..', '..', '..', '..');
const GENERATED_HEADER_START = '<!-- GENERATED_COMMAND_CONTRACT_HEADER_START';
const GENERATED_HEADER_END = 'GENERATED_COMMAND_CONTRACT_HEADER_END -->';
const CONTRACT_VERSION = 1;

const SHARED_SOURCES = {
  autoModeContract: '.opencode/skills/system-spec-kit/references/workflows/auto_mode_contract.md',
  modeRegistry: '.opencode/skills/deep-loop-workflows/mode-registry.json',
  hubSkill: '.opencode/skills/deep-loop-workflows/SKILL.md',
  resolveInjectionMode: '.opencode/skills/deep-loop-workflows/shared/rollout/resolve-injection-mode.cjs',
};

const REFS = {
  dispatchReceipt: {
    writer: '.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts',
    validator: '.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts',
    rule: 'Reference the existing intent/completion receipt pair and validator; do not copy receipt logic into the command contract.',
  },
  progressRecord: {
    writer: '.opencode/skills/deep-loop-workflows/shared/progress/progress-record.cjs',
    rule: 'Reference additive started/completed progress records as liveness evidence; progress records are not iteration, convergence, or completion records.',
  },
};

const COMMANDS = {
  'deep/context': {
    id: 'deep/context',
    commandName: '/deep:context',
    title: 'Deep Context',
    slug: 'deep_context',
    mode: 'context',
    runtimeLoopType: 'context',
    commandPath: '.opencode/commands/deep/context.md',
    presentationPath: '.opencode/commands/deep/assets/deep_context_presentation.txt',
    autoWorkflowPath: '.opencode/commands/deep/assets/deep_context_auto.yaml',
    confirmWorkflowPath: '.opencode/commands/deep/assets/deep_context_confirm.yaml',
    modeSkillPath: '.opencode/skills/deep-loop-workflows/deep-context/SKILL.md',
    agentPath: '.opencode/agents/deep-context.md',
    sourcePaths: [
      '.opencode/commands/deep/context.md',
      '.opencode/commands/deep/assets/deep_context_presentation.txt',
      SHARED_SOURCES.autoModeContract,
      '.opencode/commands/deep/assets/deep_context_auto.yaml',
      '.opencode/commands/deep/assets/deep_context_confirm.yaml',
      SHARED_SOURCES.modeRegistry,
      SHARED_SOURCES.hubSkill,
      '.opencode/skills/deep-loop-workflows/deep-context/SKILL.md',
      '.opencode/skills/deep-loop-workflows/deep-context/references/protocol/loop_protocol.md',
      '.opencode/skills/deep-loop-workflows/deep-context/references/state/state_format.md',
      '.opencode/skills/deep-loop-workflows/deep-context/references/convergence/convergence.md',
      '.opencode/skills/deep-loop-workflows/deep-context/assets/deep_context_config.json',
      '.opencode/skills/deep-loop-workflows/deep-context/assets/context_report_template.md',
      '.opencode/agents/deep-context.md',
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
        'scope',
        'spec_folder',
        'max_iterations',
        'convergence_threshold',
        'executor_pool',
      ],
      optionalFields: [
        'relevance_gate',
        'agreement_min',
        'concurrency',
        'executor',
        'executor_model',
        'executor_reasoning',
        'executor_prompt_framework',
        'executor_label',
        'executors',
      ],
    },
    outputTemplate: {
      requiredArtifacts: [
        '{state_paths_iteration_pattern} iteration narrative markdown',
        '{state_paths_state_log} append-only canonical JSONL iteration record',
        '{state_paths_delta_pattern} per-iteration delta JSONL',
        '{state_paths_report_output} synthesized Context Report markdown',
        '{state_paths_report_json_output} synthesized Context Report JSON',
      ],
    },
    writeBoundary: {
      approvedRoot: '{artifact_dir} resolved from spec_folder for context',
      allowed: [
        '{state_paths.config}',
        '{state_paths.state_log} append only',
        '{state_paths.strategy} in-place updates only',
        '{state_paths.registry} reducer-owned in-place updates only',
        '{state_paths.dashboard} reducer-owned in-place updates only',
        '{state_paths.prompt_dir} rendered seat prompts',
        '{state_paths.iteration_pattern}',
        '{state_paths.delta_pattern}',
        '{state_paths.seat_pattern} host-collected per-seat findings',
        '{state_paths.report_output}',
        '{state_paths.report_json_output}',
        '{state_paths.lock_file} advisory lock acquire/release',
        'coverage-graph records for loop_type=context',
      ],
      readOnly: [
        'declared context scope source files',
        'command Markdown',
        'workflow YAML assets',
        'agent definitions',
        'compiled contracts other than the selected build target',
        'downstream planning or implementation files',
      ],
      banned: [
        'delete, rename, move, or truncate operations outside the allowed list',
        'writes outside the resolved context packet',
        'implementation fixes during context execution',
        'agent seat writes to merged state or source files',
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
  'deep/review': {
    id: 'deep/review',
    commandName: '/deep:review',
    title: 'Deep Review',
    slug: 'deep_review',
    mode: 'review',
    runtimeLoopType: 'review',
    commandPath: '.opencode/commands/deep/review.md',
    presentationPath: '.opencode/commands/deep/assets/deep_review_presentation.txt',
    autoWorkflowPath: '.opencode/commands/deep/assets/deep_review_auto.yaml',
    confirmWorkflowPath: '.opencode/commands/deep/assets/deep_review_confirm.yaml',
    modeSkillPath: '.opencode/skills/deep-loop-workflows/deep-review/SKILL.md',
    agentPath: '.opencode/agents/deep-review.md',
    promptPackPath: '.opencode/skills/deep-loop-workflows/deep-review/assets/prompt_pack_iteration.md.tmpl',
    sourcePaths: [
      '.opencode/commands/deep/review.md',
      '.opencode/commands/deep/assets/deep_review_presentation.txt',
      SHARED_SOURCES.autoModeContract,
      '.opencode/commands/deep/assets/deep_review_auto.yaml',
      '.opencode/commands/deep/assets/deep_review_confirm.yaml',
      SHARED_SOURCES.modeRegistry,
      SHARED_SOURCES.hubSkill,
      '.opencode/skills/deep-loop-workflows/deep-review/SKILL.md',
      '.opencode/skills/deep-loop-workflows/deep-review/references/protocol/loop_protocol.md',
      '.opencode/skills/deep-loop-workflows/deep-review/references/state/state_format.md',
      '.opencode/skills/deep-loop-workflows/deep-review/assets/review_mode_contract.yaml',
      '.opencode/skills/deep-loop-workflows/deep-review/references/convergence/convergence.md',
      '.opencode/skills/deep-loop-workflows/deep-review/assets/deep_review_config.json',
      '.opencode/skills/deep-loop-workflows/deep-review/assets/prompt_pack_iteration.md.tmpl',
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
    presentationPath: '.opencode/commands/deep/assets/deep_research_presentation.txt',
    autoWorkflowPath: '.opencode/commands/deep/assets/deep_research_auto.yaml',
    confirmWorkflowPath: '.opencode/commands/deep/assets/deep_research_confirm.yaml',
    modeSkillPath: '.opencode/skills/deep-loop-workflows/deep-research/SKILL.md',
    agentPath: '.opencode/agents/deep-research.md',
    promptPackPath: '.opencode/skills/deep-loop-workflows/deep-research/assets/prompt_pack_iteration.md.tmpl',
    sourcePaths: [
      '.opencode/commands/deep/research.md',
      '.opencode/commands/deep/assets/deep_research_presentation.txt',
      SHARED_SOURCES.autoModeContract,
      '.opencode/commands/deep/assets/deep_research_auto.yaml',
      '.opencode/commands/deep/assets/deep_research_confirm.yaml',
      SHARED_SOURCES.modeRegistry,
      SHARED_SOURCES.hubSkill,
      '.opencode/skills/deep-loop-workflows/deep-research/SKILL.md',
      '.opencode/skills/deep-loop-workflows/deep-research/references/protocol/loop_protocol.md',
      '.opencode/skills/deep-loop-workflows/deep-research/references/protocol/spec_check_protocol.md',
      '.opencode/skills/deep-loop-workflows/deep-research/references/state/state_format.md',
      '.opencode/skills/deep-loop-workflows/deep-research/references/convergence/convergence.md',
      '.opencode/skills/deep-loop-workflows/deep-research/assets/deep_research_config.json',
      '.opencode/skills/deep-loop-workflows/deep-research/assets/deep_research_strategy.md',
      '.opencode/skills/deep-loop-workflows/deep-research/assets/prompt_pack_iteration.md.tmpl',
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
  return normalizeCompiledBody([
    `# Compiled Command Contract: ${definition.commandName}`,
    '',
    'This generated contract collapses the maintained command authority chain into one grep-checkable executor contract. Maintained sources remain authoritative; regenerate this file when any source digest changes.',
    '',
    '## autonomousExecutionDirective',
    '',
    '> Read this first. It is an imperative to you, the executor — not background information.',
    '',
    `You were invoked via \`opencode run --command ${definition.id}\` with the \`:auto\` suffix and a bound spec_folder and target in your message. The \`:auto\` suffix plus the bound spec_folder mean setup is ALREADY resolved. Therefore:`,
    '',
    '- DO NOT emit the consolidated setup question (target/mode, research topic, Spec Folder A/B/C/D/E, execution mode, max iterations, executor). The bound spec_folder is your write authority; do not ask which spec folder should own the writes.',
    '- DO NOT halt for the repo-wide `CLAUDE.md` Gate-3 documentation gate. Under AUTONOMOUS execution with a validated prebound spec folder, Gate 3 is already satisfied by that folder (see gate3Precedence below).',
    `- PROCEED immediately: load the auto workflow YAML and dispatch the \`${leaf}\` agent to run the ${mode} loop over the bound target.`,
    `- DISPATCH ONLY: you dispatch \`${leaf}\` to run the loop; you do NOT read, edit, patch, or run the ${mode} loop over the target yourself. The \`${leaf}\` leaf owns the loop and every artifact write — mixing your own inline work with the dispatch is a route violation.`,
    `- ROUTE PROOF: dispatch through the auto workflow with its prompt pack so \`${leaf}\` writes each iteration state record with the route-proof fields present — \`target_agent: "${leaf}"\`, \`resolved_route\`, \`agent_definition_loaded: true\`, and \`mode: "${mode}"\`. A completed run whose iteration state records omit these fields is an incomplete delegation and does not pass.`,
    '',
    `Your job is to DISPATCH \`${leaf}\` to run the ${mode} loop over the bound target — NOT to run the loop yourself, and NOT to review, analyze, or summarize this contract. This contract is your instruction set; the ${mode} target is the bound spec_folder/target named in your message, never this document.`,
    '',
    '## sourceAuthority',
    '',
    sourceList,
    '',
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
  process.stdout.write('Usage: node compile-command-contracts.cjs --command deep/context|deep/review|deep/research [--write]\n');
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
