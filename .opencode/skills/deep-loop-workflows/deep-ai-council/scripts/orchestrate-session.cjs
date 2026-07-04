// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ orchestrate-session                                                      ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ Session-level council topic orchestration with cost guard checks         ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const path = require('node:path');
const fs = require('node:fs');
const { spawn } = require('node:child_process');
const { appendRoundStateRecord } = require('../../../deep-loop-runtime/lib/council/round-state-jsonl.cjs');
const { evaluateCouncilCostGuards, normalizeCostGuards } = require('../../../deep-loop-runtime/lib/council/cost-guards.cjs');
const { validateSessionStateHierarchy } = require('../../../deep-loop-runtime/lib/council/session-state-hierarchy.cjs');
const { orchestrateTopic } = require('./orchestrate-topic.cjs');
const { appendFinding, getCrossTopicPriors } = require('./lib/findings-registry.cjs');
const { persistSeatStepwise } = require('./lib/persist-artifacts.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const COUNCIL_RESOLVED_ROUTE_HEADER = 'Resolved route: mode=ai-council; target_agent=@ai-council; execution=multi_topic_session_round; state_source=ai-council/session-state.jsonl; depth_aware=true; do_not_switch_mode=true';
const COUNCIL_ROUTE_FIELDS = Object.freeze({
  mode: 'ai-council',
  target_agent: '@ai-council',
  execution: 'multi_topic_session_round',
  state_source: 'ai-council/session-state.jsonl',
  depth_aware: true,
  do_not_switch_mode: true,
});
const DEFAULT_HEARTBEAT_INTERVAL_MS = 45_000;
const DEFAULT_SEAT_TIMEOUT_MS = 600_000;
const DEFAULT_EXECUTOR_MODEL = 'openai/gpt-5.5-fast';
const PROMPT_PACK_PATH = path.join(__dirname, '..', 'assets', 'prompt_pack_round.md');
const COUNCIL_CONFIG_PATH = path.join(__dirname, '..', 'assets', 'deep_ai_council_config.json');

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function readJsonValue(value, label) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new TypeError(`${label} must be a path or inline JSON string`);
  }
  const trimmed = value.trim();
  const source = fs.existsSync(trimmed) ? fs.readFileSync(trimmed, 'utf8') : trimmed;
  return JSON.parse(source);
}

function parseArgs(argv = []) {
  const args = {
    sessionState: null,
    executorConfig: null,
    packetSpecFolder: null,
  };
  const rest = [...argv];
  while (rest.length) {
    const flag = rest.shift();
    if (flag === '--session-state') args.sessionState = rest.shift() || null;
    else if (flag === '--executor-config') args.executorConfig = rest.shift() || null;
    else if (flag === '--packet-spec-folder') args.packetSpecFolder = rest.shift() || null;
    else throw new Error(`[ai-council] Unknown argument: ${flag}`);
  }
  if (!args.sessionState || !args.executorConfig) {
    throw new Error('Usage: node orchestrate-session.cjs --session-state <path-or-json> --executor-config <path-or-json> [--packet-spec-folder <path>]');
  }
  return args;
}

function loadCouncilConfig(configPath = COUNCIL_CONFIG_PATH) {
  return fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath, 'utf8')) : {};
}

function loadPromptTemplate(promptPath = PROMPT_PACK_PATH) {
  return fs.readFileSync(promptPath, 'utf8');
}

function stringifyForPrompt(value) {
  if (value === undefined || value === null) return 'n/a';
  if (typeof value === 'string') return value;
  return JSON.stringify(value, null, 2);
}

function resolveSeatId(seatInput, seatIndex) {
  if (seatInput && typeof seatInput.id === 'string' && seatInput.id.trim() !== '') {
    return seatInput.id.trim();
  }
  return `seat-${pad3(seatIndex + 1)}`;
}

function resolveSeatLens(seatInput) {
  return seatInput.lens || seatInput.role || seatInput.strategy_lens || seatInput.strategyLens || 'council';
}

function topicTitle(topicBrief) {
  if (!isRecord(topicBrief)) return stringifyForPrompt(topicBrief);
  return topicBrief.title || topicBrief.topic_id || stringifyForPrompt(topicBrief);
}

function planningBoundary(config) {
  return config && config.boundaries && config.boundaries.planning_only
    ? 'planning-only; produce recommendation text without implementation writes'
    : 'planning recommendation';
}

function priorStateSummary(topicBrief) {
  if (!isRecord(topicBrief)) return 'n/a';
  const priors = {
    prior_fingerprints: topicBrief.prior_fingerprints || [],
    prior_findings: topicBrief.prior_findings || [],
  };
  return stringifyForPrompt(priors);
}

function knownDisagreements(topicBrief) {
  if (!isRecord(topicBrief)) return 'n/a';
  return stringifyForPrompt(topicBrief.known_disagreements || topicBrief.blocking_disagreements || []);
}

function replaceTemplateSlot(template, name, value) {
  return template.replaceAll(`{{${name}}}`, stringifyForPrompt(value));
}

function renderSeatPrompt(seatInput, dispatchContext, options = {}) {
  const context = dispatchContext.context || {};
  const executorConfig = options.executorConfig || context.executor_config || {};
  const councilConfig = options.councilConfig || loadCouncilConfig();
  const template = options.promptTemplate || loadPromptTemplate();
  const seatIndex = Number.isInteger(dispatchContext.seatIndex) ? dispatchContext.seatIndex : 0;
  const seatId = resolveSeatId(seatInput, seatIndex);
  const topicBrief = context.topic_brief || executorConfig.topic_brief || {};
  const routeFields = context.route_fields || executorConfig.route_fields || {};
  const replacements = {
    seat_name: seatInput.name || seatInput.label || seatId,
    seat_lens: resolveSeatLens(seatInput),
    spec_folder: options.packetSpecFolder || executorConfig.packet_spec_folder || executorConfig.packetSpecFolder || 'n/a',
    topic: topicTitle(topicBrief),
    round: context.round_number || 1,
    execution_mode: executorConfig.execution_mode || councilConfig.execution_mode || 'in-cli',
    planning_boundary: planningBoundary(councilConfig),
    prior_state_summary: priorStateSummary(topicBrief),
    known_disagreements: knownDisagreements(topicBrief),
  };
  let prompt = Object.entries(replacements).reduce(
    (rendered, [name, value]) => replaceTemplateSlot(rendered, name, value),
    template,
  );
  prompt += `\n\n## Resolved Route\n${context.resolved_route_header || executorConfig.resolved_route_header || COUNCIL_RESOLVED_ROUTE_HEADER}\n`;
  prompt += `\n## Route Fields\n\`\`\`json\n${JSON.stringify(routeFields, null, 2)}\n\`\`\`\n`;
  prompt += `\n## Seat Input\n\`\`\`json\n${JSON.stringify(seatInput, null, 2)}\n\`\`\`\n`;
  prompt += `\n## Topic Brief\n\`\`\`json\n${JSON.stringify(topicBrief, null, 2)}\n\`\`\`\n`;
  return prompt;
}

function firstModelFromSet(modelSet) {
  if (!Array.isArray(modelSet) || modelSet.length === 0) return null;
  const first = modelSet[0];
  if (typeof first === 'string' && first.trim() !== '') return first.trim();
  if (isRecord(first)) return first.model || first.model_id || first.modelId || null;
  return null;
}

function resolveExecutorModel(executorConfig = {}, councilConfig = {}) {
  const executor = executorConfig.executor;
  if (typeof executor === 'string' && executor.trim() !== '') return executor.trim();
  if (isRecord(executor)) {
    const model = executor.model || executor.model_id || executor.modelId || firstModelFromSet(executor.model_set || executor.modelSet);
    if (typeof model === 'string' && model.trim() !== '') return model.trim();
  }
  const directModel = executorConfig.model || executorConfig.model_id || executorConfig.modelId;
  if (typeof directModel === 'string' && directModel.trim() !== '') return directModel.trim();
  const configExecutor = councilConfig.executor || {};
  if (isRecord(configExecutor)) {
    const configModel = configExecutor.model || configExecutor.model_id || configExecutor.modelId || firstModelFromSet(configExecutor.model_set || configExecutor.modelSet);
    if (typeof configModel === 'string' && configModel.trim() !== '') return configModel.trim();
  }
  return DEFAULT_EXECUTOR_MODEL;
}

function seatTimeoutMs(executorConfig) {
  const configured = executorConfig.seat_timeout_ms || executorConfig.seatTimeoutMs;
  return Number.isFinite(Number(configured)) && Number(configured) > 0
    ? Number(configured)
    : DEFAULT_SEAT_TIMEOUT_MS;
}

function opencodeSeatArgs(model, seatPrompt) {
  return ['run', '--model', model, '--dangerously-skip-permissions', seatPrompt];
}

function runSeatSubprocess(seatPrompt, options) {
  const spawnFn = options.spawn || spawn;
  const model = options.model;
  const timeoutMs = options.timeoutMs;
  return new Promise((resolve, reject) => {
    const child = spawnFn('opencode', opencodeSeatArgs(model, seatPrompt), {
      cwd: options.cwd || process.cwd(),
      env: options.env || process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    let settled = false;
    const done = (error, output) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (error) reject(error);
      else resolve(output);
    };
    const timer = setTimeout(() => {
      if (child && typeof child.kill === 'function') child.kill('SIGTERM');
      done(new Error(`[ai-council] Seat dispatch timed out after ${timeoutMs}ms`));
    }, timeoutMs);
    if (child.stdout && typeof child.stdout.on === 'function') {
      child.stdout.on('data', (chunk) => { stdout += chunk.toString(); });
    }
    if (child.stderr && typeof child.stderr.on === 'function') {
      child.stderr.on('data', (chunk) => { stderr += chunk.toString(); });
    }
    child.on('error', (error) => done(error));
    child.on('close', (code, signal) => {
      if (code === 0) {
        done(null, stdout);
        return;
      }
      const error = new Error(`[ai-council] Seat dispatch failed with code ${code === null ? 'null' : code}${signal ? ` signal ${signal}` : ''}`);
      error.stdout = stdout;
      error.stderr = stderr;
      done(error);
    });
  });
}

function seatVerdictFromOutput(output) {
  const match = String(output || '').match(/Council seat verdict:\s*(SUPPORT_WITH_RISKS|SUPPORT|BLOCK)/i);
  const recommended = match ? match[1].toUpperCase() : 'UNDECIDED';
  return {
    recommended_option: recommended.toLowerCase(),
    confidence: null,
    blocking_disagreements: recommended === 'BLOCK' ? ['seat blocked the proposal'] : [],
    material_risks: recommended === 'SUPPORT_WITH_RISKS' ? ['seat supported with risks'] : [],
    decision_axes: {},
  };
}

async function dispatchSeat(seatInput, dispatchContext = {}, options = {}) {
  const context = dispatchContext.context || {};
  const executorConfig = options.executorConfig || context.executor_config || {};
  const councilConfig = options.councilConfig || loadCouncilConfig();
  const packetSpecFolder = options.packetSpecFolder || resolvePacketSpecFolder(context.session_state, executorConfig);
  const seatIndex = Number.isInteger(dispatchContext.seatIndex) ? dispatchContext.seatIndex : 0;
  const seatId = resolveSeatId(seatInput, seatIndex);
  const model = resolveExecutorModel(executorConfig, councilConfig);
  const seatPrompt = renderSeatPrompt(seatInput, dispatchContext, {
    ...options,
    packetSpecFolder,
    executorConfig,
    councilConfig,
  });
  const deliberation = await runSeatSubprocess(seatPrompt, {
    spawn: options.spawn,
    cwd: options.cwd,
    env: options.env,
    model,
    timeoutMs: seatTimeoutMs(executorConfig),
  });
  const persistedSeat = {
    id: seatId,
    ...seatInput,
    id: seatId,
    content: deliberation,
    deliberation,
  };
  const persistSeat = options.persistSeatStepwise || persistSeatStepwise;
  const persisted = persistSeat(packetSpecFolder, persistedSeat, { round: context.round_number || 1 });
  return {
    seat_id: seatId,
    id: seatId,
    lens: persistedSeat.lens,
    role: persistedSeat.role,
    vantage: persistedSeat.vantage,
    deliberation,
    content: deliberation,
    persisted,
    verdict: seatVerdictFromOutput(deliberation),
  };
}

function heartbeatIntervalMs(executorConfig) {
  const configured = executorConfig.heartbeat_interval_ms || executorConfig.heartbeatIntervalMs;
  return Number.isFinite(Number(configured)) && Number(configured) > 0
    ? Number(configured)
    : DEFAULT_HEARTBEAT_INTERVAL_MS;
}

function writeSessionHeartbeat(packetSpecFolder, options = {}) {
  const appendRecord = options.appendRoundStateRecord || appendRoundStateRecord;
  return appendRecord(sessionStatePath(packetSpecFolder), {
    type: 'progress_record',
    event: 'session_heartbeat',
    progress_delta: 0,
    ts: new Date().toISOString(),
  });
}

function startSessionHeartbeat(packetSpecFolder, options = {}) {
  const intervalMs = options.intervalMs || DEFAULT_HEARTBEAT_INTERVAL_MS;
  const setIntervalFn = options.setInterval || setInterval;
  const timer = setIntervalFn(() => {
    try {
      writeSessionHeartbeat(packetSpecFolder, options);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const stderr = options.stderr || process.stderr;
      stderr.write(`[ai-council] Session heartbeat failed: ${message}\n`);
    }
  }, intervalMs);
  if (timer && typeof timer.unref === 'function') timer.unref();
  return timer;
}

function normalizeOptions(input = {}) {
  if (!isRecord(input)) {
    throw new TypeError('orchestrateSession options must be an object');
  }
  const sessionState = input.session_state || input.sessionState;
  const executorConfig = input.executor_config || input.executorConfig || {};
  if (!isRecord(sessionState)) {
    throw new TypeError('session_state must be an object');
  }
  if (!isRecord(executorConfig)) {
    throw new TypeError('executor_config must be an object');
  }
  validateSessionStateHierarchy(sessionState);
  return { sessionState, executorConfig: withCouncilRouteConfig(executorConfig) };
}

function withCouncilRouteConfig(executorConfig) {
  const configuredFields = isRecord(executorConfig.route_fields) ? executorConfig.route_fields : {};
  return {
    ...executorConfig,
    resolved_route_header: typeof executorConfig.resolved_route_header === 'string'
      ? executorConfig.resolved_route_header
      : COUNCIL_RESOLVED_ROUTE_HEADER,
    route_fields: {
      ...COUNCIL_ROUTE_FIELDS,
      ...configuredFields,
    },
  };
}

function resolvePacketSpecFolder(sessionState, executorConfig) {
  const configured = executorConfig.packet_spec_folder
    || executorConfig.packetSpecFolder
    || sessionState.session.spec_folder;
  if (typeof configured !== 'string' || configured.trim() === '') {
    throw new TypeError('packet spec folder is required on executor_config or session_state.session.spec_folder');
  }
  return path.resolve(configured);
}

function sessionStatePath(packetSpecFolder) {
  return path.join(packetSpecFolder, 'ai-council', 'session-state.jsonl');
}

function normalizeGuards(sessionState, executorConfig) {
  return normalizeCostGuards({
    max_topics_per_session: sessionState.session.max_topics_per_session,
    ...(executorConfig.cost_guards || executorConfig.costGuards || {}),
  });
}

function appendTopicCompletion(statePath, payload) {
  return appendRoundStateRecord(statePath, {
    type: 'topic_completed',
    ...payload,
  });
}

function pad3(value) {
  return String(value).padStart(3, '0');
}

function lastRoundId(topicResult) {
  if (Array.isArray(topicResult.rounds) && topicResult.rounds.length > 0) {
    const lastRound = topicResult.rounds[topicResult.rounds.length - 1];
    if (isRecord(lastRound) && typeof lastRound.round_id === 'string') {
      return lastRound.round_id;
    }
  }
  if (Number.isInteger(topicResult.rounds_completed) && topicResult.rounds_completed > 0) {
    return `round-${pad3(topicResult.rounds_completed)}`;
  }
  return null;
}

function topicFinding(topic, topicResult, sessionState) {
  const verdict = isRecord(topicResult.final_verdict) ? topicResult.final_verdict : {};
  const roundId = lastRoundId(topicResult);
  const recommended = verdict.recommended_option || topicResult.stop_reason || 'undecided';
  return {
    session_id: sessionState.session.session_id,
    topic_id: topic.topic_id,
    topic_slug: topic.topic_slug,
    round_id: roundId,
    finding_type: 'topic-final-verdict',
    claim: `Topic ${topic.topic_id} final verdict: ${recommended}`,
    stance: 'support',
    confidence: verdict.confidence,
    final_verdict: verdict,
    evidence: {
      final_verdict: verdict,
      stability_score: topicResult.stability_score,
      stop_reason: topicResult.stop_reason,
      rounds_completed: topicResult.rounds_completed,
    },
    source_iter: roundId,
    source_artifacts: roundId
      ? [`ai-council/topics/${topic.topic_id}/rounds/${roundId}/deliberation.md`]
      : [`ai-council/topics/${topic.topic_id}/topic-report.md`],
  };
}

function sessionSynthesisFinding(sessionState, topicResults, stopReason) {
  const completedTopicIds = topicResults.map((result) => result.topic_id).filter(Boolean);
  return {
    session_id: sessionState.session.session_id,
    topic_id: 'session',
    topic_slug: 'session',
    finding_type: 'session-synthesis',
    claim: `Session ${sessionState.session.session_id} completed ${topicResults.length} topic(s): ${stopReason}`,
    stance: 'synthesis',
    confidence: null,
    evidence: {
      completed_topic_ids: completedTopicIds,
      stop_reason: stopReason,
      topic_results: topicResults,
    },
    source_iter: 'session-close',
    source_artifacts: ['ai-council/session-report.md'],
  };
}

function withCrossTopicPriors(topic, sessionState, executorConfig, priors) {
  if (!priors.length) {
    return {
      topic,
      sessionState,
      executorConfig,
    };
  }
  const priorFingerprints = [
    ...(Array.isArray(topic.prior_fingerprints) ? topic.prior_fingerprints : []),
    ...priors.map((prior) => prior.fingerprint),
  ];
  const enrichedTopic = {
    ...topic,
    prior_fingerprints: [...new Set(priorFingerprints)],
    prior_findings: priors,
  };
  const configuredBrief = executorConfig.topic_brief || executorConfig.topicBrief || topic.topic_brief || topic.brief || {};
  const topicBrief = {
    ...(isRecord(configuredBrief) ? configuredBrief : {}),
    topic_id: enrichedTopic.topic_id,
    title: enrichedTopic.title || enrichedTopic.topic_slug || enrichedTopic.topic_id,
    prior_fingerprints: enrichedTopic.prior_fingerprints,
    prior_findings: priors,
    session_id: sessionState.session.session_id,
  };
  return {
    topic: enrichedTopic,
    sessionState: {
      ...sessionState,
      current: {
        ...sessionState.current,
        topic: enrichedTopic,
      },
    },
    executorConfig: {
      ...executorConfig,
      topic_brief: topicBrief,
    },
  };
}

function sessionSaturationDecision(topicResult, completedCount, guards, executorConfig) {
  const minimumTopics = Number.isInteger(executorConfig.min_topics_before_session_saturation)
    ? executorConfig.min_topics_before_session_saturation
    : Number.isInteger(executorConfig.minTopicsBeforeSessionSaturation)
      ? executorConfig.minTopicsBeforeSessionSaturation
      : 2;
  if (completedCount < minimumTopics || typeof topicResult.stability_score !== 'number') {
    return { continue_allowed: true, stop_reasons: [], upper_bound: null };
  }
  return evaluateCouncilCostGuards({
    verdictDelta: topicResult.stability_score,
    guards,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Run a council session across topics until all topics complete or guards stop.
 *
 * @param {Object} options - Orchestration options
 * @param {Object} options.session_state - Session -> topic -> round state
 * @param {Object} options.executor_config - Topic runner and guard config
 * @returns {Promise<Object>} Session completion summary
 */
async function orchestrateSession(options = {}) {
  const { sessionState, executorConfig } = normalizeOptions(options);
  const packetSpecFolder = resolvePacketSpecFolder(sessionState, executorConfig);
  const statePath = sessionStatePath(packetSpecFolder);
  const guards = normalizeGuards(sessionState, executorConfig);
  const runTopic = executorConfig.orchestrateTopic || executorConfig.orchestrate_topic || orchestrateTopic;
  if (typeof runTopic !== 'function') {
    throw new TypeError('executor_config.orchestrateTopic must be a function when provided');
  }

  const topicResults = [];
  const skippedTopicIds = [];
  let stopReason = 'topics_exhausted';

  for (let index = 0; index < sessionState.topics.length; index += 1) {
    const topicNumber = index + 1;
    const topic = sessionState.topics[index];
    const maxTopicDecision = evaluateCouncilCostGuards({
      topicNumber,
      guards,
    });
    if (topicNumber > guards.max_topics_per_session || maxTopicDecision.stop_reasons.includes('max_topics_per_session')) {
      stopReason = 'max_topics_per_session';
      skippedTopicIds.push(...sessionState.topics.slice(index).map((entry) => entry.topic_id));
      break;
    }

    const priors = index === 0 ? [] : getCrossTopicPriors(packetSpecFolder, { topic_id: topic.topic_id });
    const enriched = withCrossTopicPriors(topic, {
      ...sessionState,
      session: {
        ...sessionState.session,
        current_topic: topicNumber,
      },
    }, executorConfig, priors);

    const topicResult = await runTopic({
      topic_id: enriched.topic.topic_id,
      session_state: {
        ...enriched.sessionState,
        session: {
          ...enriched.sessionState.session,
          current_topic: topicNumber,
        },
        current: {
          ...enriched.sessionState.current,
          topic: enriched.topic,
        },
      },
      executor_config: enriched.executorConfig,
    });
    topicResults.push(topicResult);
    appendFinding(packetSpecFolder, topicFinding(enriched.topic, topicResult, sessionState));

    appendTopicCompletion(statePath, {
      session_id: sessionState.session.session_id,
      topic_id: enriched.topic.topic_id,
      topic_number: topicNumber,
      rounds_completed: topicResult.rounds_completed,
      final_verdict: topicResult.final_verdict,
      stability_score: topicResult.stability_score,
      topic_stop_reason: topicResult.stop_reason,
    });

    const saturationDecision = sessionSaturationDecision(topicResult, topicResults.length, guards, executorConfig);
    if (saturationDecision.stop_reasons.includes('saturation_threshold')) {
      stopReason = 'session_saturation_threshold';
      skippedTopicIds.push(...sessionState.topics.slice(index + 1).map((entry) => entry.topic_id));
      break;
    }

    if (topicResults.length >= guards.max_topics_per_session && topicNumber < sessionState.topics.length) {
      stopReason = 'max_topics_per_session';
      skippedTopicIds.push(...sessionState.topics.slice(index + 1).map((entry) => entry.topic_id));
      break;
    }
  }

  appendFinding(packetSpecFolder, sessionSynthesisFinding(sessionState, topicResults, stopReason));

  return {
    session_id: sessionState.session.session_id,
    topics_completed: topicResults.length,
    topic_results: topicResults,
    skipped_topic_ids: skippedTopicIds,
    stop_reason: stopReason,
    session_state_path: statePath,
  };
}

async function main(argv = process.argv.slice(2), options = {}) {
  try {
    const args = parseArgs(argv);
    const sessionState = readJsonValue(args.sessionState, '--session-state');
    const executorConfig = readJsonValue(args.executorConfig, '--executor-config');
    const packetSpecFolder = path.resolve(args.packetSpecFolder || resolvePacketSpecFolder(sessionState, executorConfig));
    const councilConfig = options.councilConfig || loadCouncilConfig(options.configPath);
    const promptTemplate = options.promptTemplate || loadPromptTemplate(options.promptPath);
    const runtimeExecutorConfig = {
      ...executorConfig,
      packet_spec_folder: packetSpecFolder,
    };
    runtimeExecutorConfig.dispatchSeat = options.dispatchSeat || ((seatInput, dispatchContext) => dispatchSeat(seatInput, dispatchContext, {
      packetSpecFolder,
      executorConfig: runtimeExecutorConfig,
      councilConfig,
      promptTemplate,
      spawn: options.spawn,
      cwd: options.cwd,
      env: options.env,
      persistSeatStepwise: options.persistSeatStepwise,
    }));
    const heartbeat = startSessionHeartbeat(packetSpecFolder, {
      intervalMs: options.heartbeatIntervalMs || heartbeatIntervalMs(runtimeExecutorConfig),
      appendRoundStateRecord: options.appendRoundStateRecord,
      setInterval: options.setInterval,
      stderr: options.stderr,
    });
    try {
      const runSession = options.orchestrateSession || orchestrateSession;
      const sessionResult = await runSession({
        session_state: sessionState,
        executor_config: runtimeExecutorConfig,
      });
      const stdout = options.stdout || process.stdout;
      stdout.write(`${JSON.stringify(sessionResult, null, 2)}\n`);
      return 0;
    } finally {
      const clearIntervalFn = options.clearInterval || clearInterval;
      clearIntervalFn(heartbeat);
    }
  } catch (error) {
    const stderr = options.stderr || process.stderr;
    stderr.write(`${error instanceof Error ? error.stack || error.message : String(error)}\n`);
    return 1;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  orchestrateSession,
  sessionStatePath,
  main,
  parseArgs,
  readJsonValue,
  dispatchSeat,
  renderSeatPrompt,
  resolveExecutorModel,
  startSessionHeartbeat,
  writeSessionHeartbeat,
};

if (require.main === module) {
  main().then((exitCode) => {
    process.exitCode = exitCode;
  });
}
