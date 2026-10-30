#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Doctor Helper Match
// ───────────────────────────────────────────────────────────────────

'use strict';

// Ranks the doctor commands that fit a problem stated in plain words.
//
// WHY IT EXISTS: one manifest already holds the wording of every doctor route, and
// the advisor's doctor bridges are tuned never to outrank a skill and never to move
// a skill's score, so by design the advisor cannot answer "which doctor command".
// This reads the manifest directly and ranks doctor against doctor.
//
// WHY THE MANIFEST AND NOTHING ELSE: `_routes.yaml` is the one phrase table. A
// wording an operator uses but the manifest does not carry is a missing phrase in
// the manifest, which also feeds the advisor — never a private synonym list here.
// The derived ids and runnables follow the bridge deriver's rules exactly, so the
// two readings of one manifest cannot disagree about which entry is which.
//
// WHY DETERMINISTIC: an operator asking which repair to run needs an answer that
// repeats. The score is inverse-document-frequency overlap over the manifest, a
// bonus for a fully covered phrase and a small preference for the class the
// operator asked for; the same text over the same manifest always ranks the same.
//
// READ-ONLY BY CONTRACT: it reads one YAML file, starts no process and writes
// nothing. A read-only pick is run by the caller under that command's own router;
// a writing pick is a line for the operator, because each writer's own plan and
// yes must govern its change.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const FALLBACK = '/doctor:setup';
const SELF_COMMAND = '/doctor:helper';
const MCP_COMMAND = '/doctor:mcp';
const MANIFEST_RELATIVE = '.skilled/commands/doctor/_routes.yaml';
const DOCTOR_RELATIVE = '.skilled/commands/doctor';
const PRIVATE_PREFIX = 'local-';

const DEFAULTS = {
  top: 3,
  topMax: 5,
  floor: 3,
  phraseBonus: 2,
  intentBonus: 1,
  descriptionWeight: 0.5,
};

// Words that carry no routing signal: articles, pronouns, auxiliaries and the
// fillers an operator writes ("please", "just"). A term kept by mistake costs
// nothing, but a filler shared by every entry dilutes the ranking, so the small
// list is worth carrying. It is never extended per entry.
const STOPWORDS = new Set([
  'a', 'about', 'add', 'after', 'again', 'all', 'also', 'am', 'an', 'and', 'any', 'are',
  'as', 'at', 'be', 'been', 'before', 'being', 'but', 'by', 'can', 'could', 'create', 'did',
  'do', 'does', 'doing', 'done', 'for', 'from', 'get', 'got', 'had', 'has', 'have', 'having',
  'he', 'her', 'here', 'him', 'his', 'how', 'i', 'if', 'in', 'into', 'is', 'it', 'its',
  'just', 'keep', 'kind', 'make', 'me', 'more', 'most', 'my', 'new', 'no', 'not', 'now',
  'of', 'on', 'once', 'one', 'only', 'or', 'other', 'our', 'out', 'over', 'own', 'please',
  'same', 'she', 'should', 'so', 'some', 'something', 'still', 'such', 'than', 'that', 'the',
  'their', 'them', 'then', 'there', 'these', 'they', 'thing', 'this', 'those', 'through',
  'to', 'too', 'under', 'up', 'us', 'very', 'was', 'we', 'were', 'what', 'when', 'where',
  'which', 'while', 'who', 'why', 'will', 'with', 'would', 'you', 'your',
]);

// The forms that turn one word into another word the manifest might use instead:
// a gerund, a past tense, a nominal form and the two plurals. `ence` and `ance`
// come before `es`, so `convergence` and `converges` reduce to the same term.
const SUFFIXES = ['ing', 'ed', 'ence', 'ance', 'es', 's'];

// ─────────────────────────────────────────────────────────────────────────────
// 3. TEXT
// ─────────────────────────────────────────────────────────────────────────────

// A compound carries its own meaning and so do its parts: an operator writes
// "pre-commit" where the manifest writes "commit", and both must reach the entry,
// so a hyphenated token is kept whole and split.
function rawTokens(text) {
  const tokens = [];
  for (const piece of String(text).toLowerCase().split(/[^a-z0-9-]+/)) {
    if (!piece) continue;
    tokens.push(piece);
    if (piece.includes('-')) {
      for (const part of piece.split('-')) if (part) tokens.push(part);
    }
  }
  return tokens;
}

function stem(token) {
  let result = token;
  for (const suffix of SUFFIXES) {
    if (!result.endsWith(suffix)) continue;
    const trimmed = result.slice(0, -suffix.length);
    if (trimmed.length >= 3) {
      result = trimmed;
      break;
    }
  }
  // A trailing `e` is the last letter a plural or a gerund drops, so removing it
  // here is what makes "tune" and "tuning", or "phrase" and "phrases", one term.
  if (result.length >= 4 && result.endsWith('e')) result = result.slice(0, -1);
  return result;
}

function normalize(text) {
  const terms = [];
  for (const token of rawTokens(text)) {
    if (!token || STOPWORDS.has(token)) continue;
    const reduced = stem(token);
    if (!reduced || STOPWORDS.has(reduced)) continue;
    terms.push(reduced);
  }
  return terms;
}

function uniqueTerms(text) {
  return [...new Set(normalize(text))];
}

function isPrivate(name) {
  return typeof name === 'string' && name.toLowerCase().startsWith(PRIVATE_PREFIX);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. THE MANIFEST
// ─────────────────────────────────────────────────────────────────────────────

function readYamlPackage() {
  try {
    return require('yaml');
  } catch (error) {
    const failure = new Error(`the yaml package is unavailable: ${error.message}`);
    failure.code = 'YAML_MISSING';
    throw failure;
  }
}

function stringList(value) {
  return Array.isArray(value) ? value.filter((entry) => typeof entry === 'string' && entry) : [];
}

function doctorName(command) {
  const match = /^\/doctor:([a-z0-9-]+)$/.exec(command || '');
  return match ? match[1] : null;
}

function routerDescription(doctorDir, routerFile, name) {
  const file = typeof routerFile === 'string' && routerFile
    ? path.resolve(doctorDir, path.basename(routerFile))
    : path.join(doctorDir, `${name}.md`);
  if (!fs.existsSync(file)) return '';
  const match = /^description:\s*"?(.*?)"?\s*$/m.exec(fs.readFileSync(file, 'utf8'));
  return match ? match[1].trim() : '';
}

// The manifest's own class for an entry, with the one rule the manifest leaves to
// the reader: a standalone command that carries a `check` action runs that action
// when no action is typed, so the class it shows is the check action's.
function entryClass(item, section) {
  if (section === 'standalone') {
    const actions = item && typeof item.actions === 'object' && item.actions ? item.actions : {};
    if (actions.check && typeof actions.check.mutating === 'string') return actions.check.mutating;
  }
  return typeof item.mutating === 'string' ? item.mutating : 'mutates';
}

function makeEntry(fields) {
  const mutating = fields.mutating;
  return {
    id: fields.id,
    command: fields.command,
    target: fields.target,
    runnable: fields.runnable,
    section: fields.section,
    mutating,
    writes: mutating !== 'read-only',
    phrases: fields.phrases,
    leadPhrases: fields.leadPhrases,
    description: fields.description,
    order: fields.order,
    defaultTarget: fields.defaultTarget === true,
  };
}

/**
 * Derive every routable doctor entry from the route manifest.
 *
 * `root` is a repository root, so a suite can point the matcher at a fixture tree.
 * Returns the entries, the count of private names it dropped, and the manifest it
 * read.
 */
function loadEntries(root = path.resolve(__dirname, '../../../..')) {
  const YAML = readYamlPackage();
  const repoRoot = path.resolve(root);
  const manifestPath = path.join(repoRoot, MANIFEST_RELATIVE);
  const doctorDir = path.join(repoRoot, DOCTOR_RELATIVE);

  let manifest;
  try {
    manifest = YAML.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch (error) {
    const failure = new Error(`cannot read ${MANIFEST_RELATIVE}: ${error.message}`);
    failure.code = 'MANIFEST_UNREADABLE';
    throw failure;
  }
  if (!manifest || !Array.isArray(manifest.routes)) {
    const failure = new Error(`${MANIFEST_RELATIVE} carries no routes list`);
    failure.code = 'MANIFEST_UNREADABLE';
    throw failure;
  }

  const entries = [];
  const descriptions = new Map();
  let skippedPrivate = 0;
  let order = 0;

  const descriptionFor = (name, routerFile) => {
    if (isPrivate(name)) return '';
    if (!descriptions.has(name)) {
      descriptions.set(name, routerDescription(doctorDir, routerFile, name));
    }
    return descriptions.get(name);
  };

  // A command with several routes needs one entry per route; a command with one
  // takes the command's own id. The bridge deriver names them the same way, and
  // the contract suite compares the two.
  const routeCounts = new Map();
  for (const route of manifest.routes) {
    const name = doctorName(route.command);
    if (!name) continue;
    routeCounts.set(name, (routeCounts.get(name) || 0) + 1);
  }

  for (const route of manifest.routes) {
    const name = doctorName(route.command);
    if (!name || typeof route.target !== 'string' || !route.target) {
      skippedPrivate += 0;
      continue;
    }
    if (isPrivate(name) || isPrivate(route.target)) {
      skippedPrivate += 1;
      continue;
    }
    const multiTarget = routeCounts.get(name) > 1;
    entries.push(makeEntry({
      id: multiTarget ? `command-doctor-${name}-${route.target}` : `command-doctor-${name}`,
      command: route.command,
      target: route.target,
      runnable: multiTarget ? `${route.command} ${route.target}` : route.command,
      section: 'routes',
      mutating: entryClass(route, 'routes'),
      phrases: stringList(route.trigger_phrases),
      leadPhrases: stringList(route.lead_phrases),
      description: descriptionFor(name),
      order: order++,
      defaultTarget: route.default_target === true,
    }));
  }

  const standalone = Array.isArray(manifest.standalone) ? manifest.standalone : [];
  for (const item of standalone) {
    const name = doctorName(item && item.command);
    if (!name) continue;
    if (isPrivate(name)) {
      skippedPrivate += 1;
      continue;
    }
    const runnable = typeof item.runnable === 'string' && item.runnable ? item.runnable : item.command;
    entries.push(makeEntry({
      id: `command-doctor-${name}`,
      command: item.command,
      target: null,
      runnable,
      section: 'standalone',
      mutating: entryClass(item, 'standalone'),
      phrases: stringList(item.trigger_phrases),
      leadPhrases: stringList(item.lead_phrases),
      description: descriptionFor(name, item.file),
      order: order++,
      defaultTarget: item.default_target === true,
    }));

    // The bridge deriver reads only a standalone command's top-level phrases, so
    // an action's own phrases reach no advisor bridge. They still name a real
    // doctor workflow, and the helper is the only surface that can offer them.
    const actions = item && typeof item.actions === 'object' && item.actions ? item.actions : {};
    for (const [action, definition] of Object.entries(actions)) {
      if (!definition || typeof definition !== 'object') continue;
      const phrases = stringList(definition.trigger_phrases);
      if (phrases.length === 0) continue;
      if (isPrivate(action)) {
        skippedPrivate += 1;
        continue;
      }
      entries.push(makeEntry({
        id: `command-doctor-${name}-action-${action}`,
        command: item.command,
        target: action,
        runnable: `${item.command} ${action}`,
        section: 'action',
        mutating: entryClass(definition, 'action'),
        phrases,
        leadPhrases: stringList(definition.lead_phrases),
        description: descriptionFor(name, item.file),
        order: order++,
        defaultTarget: false,
      }));
    }
  }

  const mcpSubroutes = Array.isArray(manifest.mcp_subroutes) ? manifest.mcp_subroutes : [];
  for (const item of mcpSubroutes) {
    if (!item || typeof item.sub_action !== 'string' || !item.sub_action) continue;
    if (isPrivate(item.sub_action)) {
      skippedPrivate += 1;
      continue;
    }
    const mcpName = doctorName(MCP_COMMAND);
    entries.push(makeEntry({
      id: `command-doctor-${mcpName}-${item.sub_action}`,
      command: MCP_COMMAND,
      target: item.sub_action,
      runnable: `${MCP_COMMAND} ${item.sub_action}`,
      section: 'mcp_subroutes',
      mutating: entryClass(item, 'mcp_subroutes'),
      phrases: stringList(item.trigger_phrases),
      leadPhrases: stringList(item.lead_phrases),
      description: descriptionFor(mcpName),
      order: order++,
      defaultTarget: false,
    }));
  }

  return {
    entries,
    skippedPrivate,
    manifest: { path: MANIFEST_RELATIVE, absolute: manifestPath },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. RANKING
// ─────────────────────────────────────────────────────────────────────────────

function isSelf(entry) {
  return entry.command === SELF_COMMAND;
}

function documentFrequency(vocabularies) {
  const frequency = new Map();
  for (const vocabulary of vocabularies) {
    for (const term of vocabulary) frequency.set(term, (frequency.get(term) || 0) + 1);
  }
  return frequency;
}

// A term carried by one entry names it; a term carried by every entry names
// nothing. log(1 + N/df) keeps a shared term worth a little instead of zero, so a
// longer query still separates entries that share the same vocabulary.
function idf(frequency, total, term) {
  const df = frequency.get(term);
  return df ? Math.log(1 + total / df) : 0;
}

function coverage(entry, terms) {
  const wanted = new Set(terms);
  let best = { phrase: null, matched: [], count: -1 };
  for (const phrase of entry.phrases) {
    const tokens = uniqueTerms(phrase);
    const matched = tokens.filter((token) => wanted.has(token));
    if (matched.length > best.count) best = { phrase, matched, count: matched.length };
  }
  return best;
}

/**
 * Score every entry against a problem statement.
 *
 * Options: `top` (1 to 5), `area` (a doctor command name), `intent` (`check` or
 * `change`), and the scoring constants, so a suite can measure a change without
 * editing this file.
 */
function rankProblem(entries, text, options = {}) {
  const settings = { ...DEFAULTS, ...options };
  const routable = entries.filter((entry) => !isSelf(entry));
  const area = settings.area ? String(settings.area).replace(/^\/?doctor:/, '') : null;
  const scoped = area ? routable.filter((entry) => entry.command === `/doctor:${area}`) : routable;

  const query = String(text || '').trim();
  const terms = uniqueTerms(query);

  const phraseVocabularies = scoped.map((entry) => new Set(entry.phrases.flatMap(normalize)));
  const descriptionVocabularies = scoped.map((entry) => new Set(normalize(entry.description)));
  const phraseDf = documentFrequency(phraseVocabularies);
  const descriptionDf = documentFrequency(descriptionVocabularies);
  const total = scoped.length;

  const scored = scoped.map((entry, index) => {
    let score = 0;
    for (const term of terms) {
      score += idf(phraseDf, total, term) * (phraseVocabularies[index].has(term) ? 1 : 0);
      score += settings.descriptionWeight
        * idf(descriptionDf, total, term)
        * (descriptionVocabularies[index].has(term) ? 1 : 0);
    }
    const best = coverage(entry, terms);
    if (best.phrase && best.count === uniqueTerms(best.phrase).length) score += settings.phraseBonus;
    if (settings.intent === 'check' && !entry.writes) score += settings.intentBonus;
    if (settings.intent === 'change' && entry.writes) score += settings.intentBonus;

    // One shared word is not a described problem: "release" appears in a release
    // note and in `/doctor:update` alike, and a score floor alone lets one rare
    // word through. A candidate must therefore share at least two words of one
    // phrase, which a phrase of three or more words also guarantees for itself.
    const phraseTokens = best.phrase ? uniqueTerms(best.phrase) : [];
    const eligible = phraseTokens.length > 0
      && (best.count >= 2 || best.count === phraseTokens.length);

    return { entry, score, best, eligible };
  });

  // An area answer with no problem text is a menu of that command's routes: the
  // default target first, then the read-only ones, then manifest order.
  const isAreaMenu = area !== null && terms.length === 0;
  const picked = isAreaMenu
    ? scoped
      .map((entry, index) => scored[index])
      .sort((left, right) => (
        Number(right.entry.defaultTarget) - Number(left.entry.defaultTarget)
        || Number(left.entry.writes) - Number(right.entry.writes)
        || left.entry.order - right.entry.order
      ))
    : scored
      .filter((candidate) => candidate.eligible && candidate.score >= settings.floor)
      .sort((left, right) => (
        right.score - left.score
        || Number(right.entry.defaultTarget) - Number(left.entry.defaultTarget)
        || Number(left.entry.writes) - Number(right.entry.writes)
        || left.entry.order - right.entry.order
      ));

  const limit = Math.min(Math.max(Number(settings.top) || DEFAULTS.top, 1), DEFAULTS.topMax);
  const candidates = picked.slice(0, limit).map((candidate, index) => {
    const { entry, score, best } = candidate;
    const matched = best.phrase ? best.matched : [];
    const reason = best.phrase
      ? `matches "${best.phrase}" (${matched.join(', ')})`
      : 'matches no manifest phrase';
    return {
      rank: index + 1,
      runnable: entry.runnable,
      command: entry.command,
      target: entry.target,
      section: entry.section,
      mutating: entry.mutating,
      writes: entry.writes,
      score: Math.round(score * 1000) / 1000,
      matchedPhrase: best.phrase,
      matchedTerms: matched,
      reason,
    };
  });

  return {
    status: candidates.length > 0 ? 'match' : 'no_match',
    query,
    terms,
    area,
    intent: settings.intent || null,
    candidates,
    fallback: FALLBACK,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. VIEWS
// ─────────────────────────────────────────────────────────────────────────────

function tableOf(entries, skippedPrivate) {
  return {
    entries: entries.length,
    commands: new Set(entries.map((entry) => entry.command)).size,
    skippedPrivate,
  };
}

function areasOf(entries) {
  const seen = new Map();
  for (const entry of entries) {
    if (!seen.has(entry.command)) {
      seen.set(entry.command, {
        command: entry.command,
        name: entry.command.replace('/doctor:', ''),
        entries: 0,
        readOnly: true,
      });
    }
    const row = seen.get(entry.command);
    row.entries += 1;
    if (entry.writes) row.readOnly = false;
  }
  return [...seen.values()];
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. CLI
// ─────────────────────────────────────────────────────────────────────────────

const USAGE = [
  'usage: doctor-helper-match.cjs [--json] [--top=<1-5>] [--area=<command>] [--intent=check|change] [--root=<dir>] -- <problem text>',
  '       doctor-helper-match.cjs --areas [--json] [--root=<dir>]',
  '       doctor-helper-match.cjs --table [--json] [--root=<dir>]',
].join('\n');

function parseArgs(argv) {
  const separator = argv.indexOf('--');
  const flagArgs = separator === -1 ? argv : argv.slice(0, separator);
  const textArgs = separator === -1 ? [] : argv.slice(separator + 1);
  const options = {
    asJson: false,
    table: false,
    areas: false,
    top: undefined,
    area: undefined,
    intent: undefined,
    root: undefined,
    hasText: separator !== -1,
    text: textArgs.join(' ').trim(),
  };

  for (const arg of flagArgs) {
    if (arg === '--json') { options.asJson = true; continue; }
    if (arg === '--table') { options.table = true; continue; }
    if (arg === '--areas') { options.areas = true; continue; }
    const [flag, value] = arg.includes('=') ? [arg.slice(0, arg.indexOf('=')), arg.slice(arg.indexOf('=') + 1)] : [arg, null];
    if (value === null) return { error: `unknown option: ${arg}` };
    if (flag === '--top') {
      const top = Number(value);
      if (!Number.isInteger(top) || top < 1 || top > DEFAULTS.topMax) {
        return { error: `--top takes an integer from 1 to ${DEFAULTS.topMax}` };
      }
      options.top = top;
      continue;
    }
    if (flag === '--area') { options.area = value; continue; }
    if (flag === '--intent') {
      if (value !== 'check' && value !== 'change') return { error: '--intent takes check or change' };
      options.intent = value;
      continue;
    }
    if (flag === '--root') { options.root = value; continue; }
    return { error: `unknown option: ${arg}` };
  }

  if (options.table && options.areas) return { error: '--table and --areas are exclusive' };
  if ((options.table || options.areas) && options.text) {
    return { error: '--table and --areas take no problem text' };
  }
  if (options.table || options.areas) return { options };
  if (!options.hasText && !options.area) return { error: 'free text goes after --' };
  if (!options.text && !options.area) return { error: 'name a problem after --, or an area' };
  return { options };
}

function printText(result) {
  if (result.status !== 'match') {
    process.stdout.write(`STATUS=NO_MATCH FALLBACK=${FALLBACK}\n`);
    return;
  }
  for (const candidate of result.candidates) {
    const runnable = candidate.runnable.padEnd(30, ' ');
    process.stdout.write(`${candidate.rank}) ${runnable}${candidate.mutating.padEnd(10, ' ')}${candidate.reason}\n`);
  }
  process.stdout.write(`STATUS=OK MATCHES=${result.candidates.length}\n`);
}

function main() {
  const parsed = parseArgs(process.argv.slice(2));
  if (parsed.error) {
    process.stderr.write(`doctor-helper-match.cjs: ${parsed.error}\n${USAGE}\n`);
    return 2;
  }
  const options = parsed.options;

  let loaded;
  try {
    loaded = loadEntries(options.root);
  } catch (error) {
    process.stderr.write(`doctor-helper-match.cjs: ${error.message}\n`);
    if (error.code === 'YAML_MISSING') process.stderr.write(`${USAGE}\n`);
    return 2;
  }

  const visible = loaded.entries.filter((entry) => !isSelf(entry));
  const table = tableOf(visible, loaded.skippedPrivate);

  if (options.table) {
    if (options.asJson) {
      process.stdout.write(`${JSON.stringify({
        status: 'table',
        entries: visible,
        table,
        manifest: loaded.manifest.path,
      }, null, 2)}\n`);
      return 0;
    }
    for (const [index, entry] of visible.entries()) {
      process.stdout.write(`${index + 1}) ${entry.runnable.padEnd(30, ' ')}${entry.mutating}\n`);
    }
    process.stdout.write(`STATUS=OK ENTRIES=${table.entries} COMMANDS=${table.commands}\n`);
    return 0;
  }

  if (options.areas) {
    const commands = areasOf(visible);
    if (options.asJson) {
      process.stdout.write(`${JSON.stringify({
        status: 'areas',
        commands,
        table,
        manifest: loaded.manifest.path,
      }, null, 2)}\n`);
      return 0;
    }
    for (const [index, command] of commands.entries()) {
      process.stdout.write(`${index + 1}) ${command.name.padEnd(30, ' ')}${command.readOnly ? 'read-only' : 'writes'}\n`);
    }
    process.stdout.write(`STATUS=OK AREAS=${commands.length}\n`);
    return 0;
  }

  const result = rankProblem(loaded.entries, options.text, {
    top: options.top,
    area: options.area,
    intent: options.intent,
  });
  const payload = { ...result, table, manifest: loaded.manifest.path };

  if (options.asJson) {
    process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
  } else {
    printText(result);
  }
  return result.status === 'match' ? 0 : 1;
}

if (require.main === module) {
  process.exitCode = main();
}

module.exports = { loadEntries, rankProblem };
