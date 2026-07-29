// ============================================================================
// Project Router Vocabulary - throwaway sk-doc selection prototype
// ============================================================================

'use strict';

const fs = require('node:fs');
const path = require('node:path');

const SKILL_ID = 'sk-doc';
const TRIGGER_CAP = 24;
const TOPIC_CAP = 48;
const RESERVED_HEADROOM = 4;
const TRIGGER_TARGET = TRIGGER_CAP - RESERVED_HEADROOM;
const TOPIC_TARGET = TOPIC_CAP - RESERVED_HEADROOM;
const SPECIFICITY_FLOOR = 0.88;

function findRepoRoot(startDir) {
  let current = path.resolve(startDir);
  while (true) {
    const marker = path.join(current, '.opencode', 'skills', SKILL_ID, 'hub-router.json');
    if (fs.existsSync(marker)) return current;
    const parent = path.dirname(current);
    if (parent === current) {
      throw new Error(`Could not find repository root above ${startDir}`);
    }
    current = parent;
  }
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    throw new Error(`Failed to parse ${filePath}: ${error.message}`);
  }
}

function stringArray(value) {
  return Array.isArray(value) ? value.filter((item) => typeof item === 'string') : [];
}

function tokenCount(phrase) {
  return Array.from(phrase.toLowerCase().matchAll(/\b\w+\b/g)).length;
}

function phraseSpecificity(phrase) {
  const count = Math.max(1, tokenCount(phrase));
  return Math.min(0.7 + 0.18 * (count - 1), 1);
}

function normalizedPhrase(phrase) {
  return phrase.trim().toLowerCase();
}

function assertUnique(values, label) {
  const normalized = values.map(normalizedPhrase);
  if (new Set(normalized).size !== normalized.length) {
    throw new Error(`${label} contains case-insensitive duplicates`);
  }
}

function collectFleetEntries(skillsRoot) {
  const entries = [];
  const roots = fs.readdirSync(skillsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() || entry.isSymbolicLink())
    .map((entry) => entry.name)
    .filter((name) => name !== SKILL_ID)
    .sort();

  for (const root of roots) {
    const rootPath = path.join(skillsRoot, root);
    const graphPath = path.join(rootPath, 'graph-metadata.json');
    const descriptionPath = path.join(rootPath, 'description.json');

    if (fs.existsSync(graphPath)) {
      const graph = readJson(graphPath);
      const fields = {
        intent_signals: graph.intent_signals,
        'derived.trigger_phrases': graph.derived?.trigger_phrases,
        'derived.key_topics': graph.derived?.key_topics,
      };
      for (const [field, values] of Object.entries(fields)) {
        for (const value of stringArray(values)) entries.push({ root, field, value });
      }
    }

    if (fs.existsSync(descriptionPath)) {
      const description = readJson(descriptionPath);
      for (const value of stringArray(description.keywords)) {
        entries.push({ root, field: 'description.keywords', value });
      }
    }
  }

  return entries;
}

function collectSourcePhrases(hubRouter, modeRegistry) {
  const phrases = new Map();
  let occurrenceCount = 0;

  function add(phrase, sourceType, sourceId) {
    if (typeof phrase !== 'string' || !phrase.trim()) return;
    occurrenceCount += 1;
    const key = normalizedPhrase(phrase);
    if (!phrases.has(key)) {
      phrases.set(key, {
        phrase: phrase.trim(),
        sourceOrder: occurrenceCount,
        provenance: { vocabularyClasses: [], workflowModes: [] },
      });
    }
    const record = phrases.get(key);
    const target = sourceType === 'class'
      ? record.provenance.vocabularyClasses
      : record.provenance.workflowModes;
    if (!target.includes(sourceId)) target.push(sourceId);
  }

  for (const [className, definition] of Object.entries(hubRouter.vocabularyClasses ?? {})) {
    for (const phrase of stringArray(definition.keywords)) add(phrase, 'class', className);
  }
  for (const mode of Array.isArray(modeRegistry.modes) ? modeRegistry.modes : []) {
    for (const phrase of stringArray(mode.aliases)) add(phrase, 'mode', mode.workflowMode);
  }

  return { records: [...phrases.values()], occurrenceCount };
}

function main() {
  const repoRoot = findRepoRoot(__dirname);
  const skillsRoot = path.join(repoRoot, '.opencode', 'skills');
  const skillRoot = path.join(skillsRoot, SKILL_ID);
  const hubRouter = readJson(path.join(skillRoot, 'hub-router.json'));
  const modeRegistry = readJson(path.join(skillRoot, 'mode-registry.json'));
  const graph = readJson(path.join(skillRoot, 'graph-metadata.json'));
  const fleetEntries = collectFleetEntries(skillsRoot);
  const sources = collectSourcePhrases(hubRouter, modeRegistry);

  const existingFields = {
    'derived.trigger_phrases': stringArray(graph.derived?.trigger_phrases),
    'derived.key_topics': stringArray(graph.derived?.key_topics),
    'derived.intent_signals': stringArray(graph.derived?.intent_signals),
    intent_signals: stringArray(graph.intent_signals),
  };
  const existing = new Set(Object.values(existingFields).flat().map(normalizedPhrase));
  const dropped = { specificity: [], existing: [], fleetCollision: [], capacity: [] };
  const eligible = [];

  for (const record of sources.records) {
    const count = tokenCount(record.phrase);
    const specificity = phraseSpecificity(record.phrase);
    if (count < 2) {
      dropped.specificity.push(record.phrase);
      continue;
    }
    if (existing.has(normalizedPhrase(record.phrase))) {
      dropped.existing.push(record.phrase);
      continue;
    }
    const phraseLower = normalizedPhrase(record.phrase);
    const collision = fleetEntries.find((entry) =>
      entry.value.toLowerCase().includes(phraseLower));
    if (collision) {
      dropped.fleetCollision.push({ phrase: record.phrase, collision });
      continue;
    }
    eligible.push({
      ...record,
      tokenCount: count,
      specificity: Number(specificity.toFixed(2)),
    });
  }

  eligible.sort((left, right) =>
    right.tokenCount - left.tokenCount
      || left.sourceOrder - right.sourceOrder
      || left.phrase.localeCompare(right.phrase));

  const beforeTriggers = existingFields['derived.trigger_phrases'];
  const beforeTopics = existingFields['derived.key_topics'];
  const triggerSlots = Math.max(0, TRIGGER_TARGET - beforeTriggers.length);
  const topicSlots = Math.max(0, TOPIC_TARGET - beforeTopics.length);
  const retained = eligible.slice(0, triggerSlots + topicSlots);
  dropped.capacity = eligible.slice(retained.length).map((record) => record.phrase);

  const candidates = retained.map((record, index) => {
    const destination = index < triggerSlots
      ? 'derived.trigger_phrases'
      : 'derived.key_topics';
    return {
      phrase: record.phrase,
      provenance: record.provenance,
      tokenCount: record.tokenCount,
      specificity: record.specificity,
      destination,
      whyKept: `Specificity ${record.specificity.toFixed(2)} meets the ${SPECIFICITY_FLOOR.toFixed(2)} floor; phrase is absent from other root metadata and existing sk-doc routing fields; token-count rank fits ${destination} headroom.`,
    };
  });

  const triggerCandidates = candidates
    .filter((candidate) => candidate.destination === 'derived.trigger_phrases')
    .map((candidate) => candidate.phrase);
  const topicCandidates = candidates
    .filter((candidate) => candidate.destination === 'derived.key_topics')
    .map((candidate) => candidate.phrase);
  const patchedGraph = JSON.parse(JSON.stringify(graph));
  patchedGraph.derived.trigger_phrases = [...beforeTriggers, ...triggerCandidates];
  patchedGraph.derived.key_topics = [...beforeTopics, ...topicCandidates];

  const candidateOutput = {
    skill: SKILL_ID,
    rules: {
      specificityFloor: SPECIFICITY_FLOOR,
      minimumTokenCount: 2,
      fleetDistinctiveness: 'Candidate is not a case-insensitive substring of any other direct skill root routing entry.',
      triggerTarget: TRIGGER_TARGET,
      topicTarget: TOPIC_TARGET,
      reservedHeadroomPerField: RESERVED_HEADROOM,
      rank: 'tokenCount descending, then source order',
    },
    candidates,
  };

  const candidatesPath = path.join(__dirname, 'candidates.json');
  const patchedPath = path.join(__dirname, 'sk-doc-derived-patched.json');
  fs.writeFileSync(candidatesPath, `${JSON.stringify(candidateOutput, null, 2)}\n`);
  fs.writeFileSync(patchedPath, `${JSON.stringify(patchedGraph, null, 2)}\n`);

  const reparsedCandidates = readJson(candidatesPath);
  const reparsedGraph = readJson(patchedPath);
  const outputTriggers = stringArray(reparsedGraph.derived?.trigger_phrases);
  const outputTopics = stringArray(reparsedGraph.derived?.key_topics);
  if (outputTriggers.length > TRIGGER_CAP || outputTriggers.length > TRIGGER_TARGET) {
    throw new Error(`trigger_phrases exceeds target/cap: ${outputTriggers.length}`);
  }
  if (outputTopics.length > TOPIC_CAP || outputTopics.length > TOPIC_TARGET) {
    throw new Error(`key_topics exceeds target/cap: ${outputTopics.length}`);
  }
  assertUnique(reparsedCandidates.candidates.map((candidate) => candidate.phrase), 'candidates');
  assertUnique(outputTriggers, 'derived.trigger_phrases');
  assertUnique(outputTopics, 'derived.key_topics');
  assertUnique([...outputTriggers, ...outputTopics], 'projected derived phrase fields');

  const duplicateOccurrences = sources.occurrenceCount - sources.records.length;
  const droppedTotal = Object.values(dropped).reduce((sum, values) => sum + values.length, 0);
  console.log(`[project-router-vocab] Source occurrences: ${sources.occurrenceCount}; unique phrases: ${sources.records.length}; duplicate occurrences folded: ${duplicateOccurrences}`);
  console.log(`[project-router-vocab] Candidates kept: ${candidates.length}; dropped: ${droppedTotal}`);
  console.log(`[project-router-vocab] Dropped by specificity (<${SPECIFICITY_FLOOR.toFixed(2)} / <2 tokens): ${dropped.specificity.length}`);
  console.log(`[project-router-vocab] Dropped as existing sk-doc routing metadata: ${dropped.existing.length}`);
  console.log(`[project-router-vocab] Dropped by other-root substring/exact collision: ${dropped.fleetCollision.length}`);
  console.log(`[project-router-vocab] Dropped by headroom capacity after token-count ranking: ${dropped.capacity.length}`);
  console.log(`[project-router-vocab] derived.trigger_phrases: ${beforeTriggers.length} -> ${outputTriggers.length} (target ${TRIGGER_TARGET}, cap ${TRIGGER_CAP}, reserve ${RESERVED_HEADROOM})`);
  console.log(`[project-router-vocab] derived.key_topics: ${beforeTopics.length} -> ${outputTopics.length} (target ${TOPIC_TARGET}, cap ${TOPIC_CAP}, reserve ${RESERVED_HEADROOM})`);
  console.log(`[project-router-vocab] Validation passed: outputs re-parsed; caps and case-insensitive duplicate checks passed.`);
}

main();
