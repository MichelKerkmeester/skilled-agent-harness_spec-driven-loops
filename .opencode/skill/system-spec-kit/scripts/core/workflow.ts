// ---------------------------------------------------------------
// MODULE: Workflow
// Main workflow orchestrator -- coordinates data loading, extraction, rendering, and file output
// ---------------------------------------------------------------

// Node stdlib
import * as fs from 'fs/promises';
import * as fsSync from 'fs';
import * as path from 'path';

// Internal modules
import { CONFIG, findActiveSpecsDir } from './config';
import { structuredLog } from '../utils';
import {
  extractConversations,
  extractDecisions,
  extractDiagrams,
  extractPhasesFromData,
  enhanceFilesWithSemanticDescriptions,
} from '../extractors';
import { detectSpecFolder, setupContextDirectory } from '../spec-folder';
import { populateTemplate } from '../renderers';
import { validateNoLeakedPlaceholders, validateAnchors } from '../utils/validation-utils';
import { shouldAutoSave, collectSessionData } from '../extractors/collect-session-data';
import type { SessionData, CollectedDataFull } from '../extractors/collect-session-data';
import type { FileChange, SemanticFileInfo } from '../extractors/file-extractor';

// Static imports replacing lazy require()
import * as flowchartGen from '../lib/flowchart-generator';
import { createFilterPipeline } from '../lib/content-filter';
import type { FilterStats } from '../lib/content-filter';
import {
  generateImplementationSummary,
  formatSummaryAsMarkdown,
  extractFileChanges,
} from '../lib/semantic-summarizer';
import { generateEmbedding, EMBEDDING_DIM, MODEL_NAME } from '../lib/embeddings';
import * as vectorIndex from '@spec-kit/mcp-server/lib/search/vector-index';
import * as retryManager from '../lib/retry-manager';
import { extractTriggerPhrases } from '../lib/trigger-extractor';
import * as simFactory from '../lib/simulation-factory';
import { loadCollectedData as loadCollectedDataFromLoader } from '../loaders/data-loader';

/* -----------------------------------------------------------------
   1. INTERFACES
------------------------------------------------------------------*/

export interface WorkflowOptions {
  dataFile?: string;
  specFolderArg?: string;
  collectedData?: CollectedDataFull;
  loadDataFn?: () => Promise<CollectedDataFull>;
  collectSessionDataFn?: (
    collectedData: CollectedDataFull | null,
    specFolderName?: string | null
  ) => Promise<SessionData>;
  silent?: boolean;
}

export interface WorkflowResult {
  contextDir: string;
  specFolder: string;
  specFolderName: string;
  contextFilename: string;
  writtenFiles: string[];
  memoryId: number | null;
  stats: {
    messageCount: number;
    decisionCount: number;
    diagramCount: number;
    qualityScore: number;
    isSimulation: boolean;
  };
}

export interface WorkflowState {
  collectedData: CollectedDataFull | null;
  specFolder: string;
  specFolderName: string;
  contextDir: string;
  sessionData: SessionData | null;
}

/* -----------------------------------------------------------------
   2. CONSTANTS
------------------------------------------------------------------*/

const DB_UPDATED_FILE: string = path.join(__dirname, '../../../mcp_server/database/.db-updated');

/* -----------------------------------------------------------------
   3. UTILITY FUNCTIONS
------------------------------------------------------------------*/

function notifyDatabaseUpdated(): void {
  try {
    const dbDir = path.dirname(DB_UPDATED_FILE);
    if (!fsSync.existsSync(dbDir)) fsSync.mkdirSync(dbDir, { recursive: true });
    fsSync.writeFileSync(DB_UPDATED_FILE, Date.now().toString());
  } catch (e: unknown) {
    const errMsg = e instanceof Error ? e.message : String(e);
    console.error('[workflow] Database notification error:', errMsg);
  }
}

interface DecisionForTopics {
  TITLE?: string;
  RATIONALE?: string;
}

// NOTE: Similar to extractors/session-extractor.ts:extractKeyTopics but differs in:
// - Uses compound phrase extraction (bigrams) for more meaningful topics
// - Accepts `string` only (session-extractor accepts `string | undefined`)
// - Includes spec folder name tokens as high-priority topics
// - Processes TITLE/RATIONALE from decisions with higher weight
function extractKeyTopics(
  summary: string,
  decisions: DecisionForTopics[] = [],
  specFolderName?: string
): string[] {
  const stopwords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of',
    'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'file', 'files',
    'code', 'update', 'response', 'request', 'message', 'using', 'used', 'use',
    'set', 'get', 'new', 'add', 'added', 'make', 'made', 'based', 'work',
    'working', 'works', 'need', 'needs', 'needed', 'like', 'also', 'well',
    'session', 'context', 'data', 'tool', 'tools', 'run', 'running', 'started',
    'changes', 'changed', 'change', 'check', 'checked', 'checking'
  ]);
  const validShortTerms = new Set([
    'db', 'ui', 'js', 'ts', 'ai', 'ml', 'ci', 'cd', 'io', 'os', 'vm', 'qa',
    'ux', 'id', 'ip', 'wp', 'go', 'rx', 'mcp', 'api', 'css', 'dom', 'sql'
  ]);

  // Scored topics: phrase -> weight
  const topicScores = new Map<string, number>();
  const addWord = (word: string, weight: number): void => {
    if (stopwords.has(word)) return;
    if (word.length >= 3 || validShortTerms.has(word)) {
      topicScores.set(word, (topicScores.get(word) || 0) + weight);
    }
  };

  const addBigrams = (text: string, weight: number): void => {
    const words = text.toLowerCase().match(/\b[a-z][a-z0-9]+\b/g) || [];
    const filtered = words.filter(w => !stopwords.has(w) && (w.length >= 3 || validShortTerms.has(w)));
    for (let i = 0; i < filtered.length - 1; i++) {
      const bigram = `${filtered[i]} ${filtered[i + 1]}`;
      if (bigram.length >= 7) { // meaningful compound phrase
        topicScores.set(bigram, (topicScores.get(bigram) || 0) + weight * 1.5);
      }
    }
  };

  // Spec folder name gets highest weight (defines the topic)
  if (specFolderName) {
    const folderBase = specFolderName.replace(/^\d{1,3}-/, '');
    const folderWords = folderBase.split(/[-_]/).filter(w => w.length >= 2);
    folderWords.forEach(w => addWord(w.toLowerCase(), 3.0));
    // Also add the full folder concept as a compound topic
    if (folderWords.length >= 2) {
      const compound = folderWords.join(' ').toLowerCase();
      topicScores.set(compound, (topicScores.get(compound) || 0) + 4.0);
    }
  }

  // Decision titles get high weight
  decisions.forEach((d) => {
    const title = d.TITLE || '';
    const rationale = d.RATIONALE || '';
    if (title && !title.includes('SIMULATION')) {
      (title.toLowerCase().match(/\b[a-z][a-z0-9]+\b/g) || []).forEach(w => addWord(w, 2.0));
      addBigrams(title, 2.0);
    }
    if (rationale && !rationale.includes('SIMULATION')) {
      (rationale.toLowerCase().match(/\b[a-z][a-z0-9]+\b/g) || []).forEach(w => addWord(w, 1.0));
    }
  });

  // Summary gets standard weight
  if (summary && summary.length >= 20 && !summary.includes('SIMULATION')) {
    (summary.toLowerCase().match(/\b[a-z][a-z0-9]+\b/g) || []).forEach(w => addWord(w, 1.0));
    addBigrams(summary, 1.0);
  }

  return [...topicScores.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([phrase]) => phrase);
}

async function writeFilesAtomically(
  contextDir: string,
  files: Record<string, string>
): Promise<string[]> {
  const written: string[] = [];
  for (const [filename, content] of Object.entries(files)) {
    validateNoLeakedPlaceholders(content, filename);
    const warnings = validateAnchors(content);
    if (warnings.length) console.warn(`   Warning: ${filename}: ${warnings.join(', ')}`);
    const filePath = path.join(contextDir, filename);
    const tempPath = filePath + '.tmp';
    try {
      await fs.writeFile(tempPath, content, 'utf-8');
      const stat = await fs.stat(tempPath);
      if (stat.size !== Buffer.byteLength(content, 'utf-8')) throw new Error('Size mismatch');
      await fs.rename(tempPath, filePath);
      written.push(filename);
      console.log(`   ${filename} (${content.split('\n').length} lines)`);
    } catch (e: unknown) {
      try { await fs.unlink(tempPath); } catch (_) { /* temp file cleanup — failure is non-critical */ }
      const errMsg = e instanceof Error ? e.message : String(e);
      throw new Error(`Write failed ${filename}: ${errMsg}`);
    }
  }
  return written;
}

/* -----------------------------------------------------------------
   4. QUALITY SCORING
------------------------------------------------------------------*/

interface QualityScore {
  score: number;
  warnings: string[];
  breakdown: {
    triggerPhrases: number;
    keyTopics: number;
    fileDescriptions: number;
    contentLength: number;
    noLeakedTags: number;
    observationDedup: number;
  };
}

/**
 * Score the quality of a generated memory file.
 * Runs after template rendering, before file writing.
 * Score 0-100, with breakdown per criterion.
 */
function scoreMemoryQuality(
  content: string,
  triggerPhrases: string[],
  keyTopics: string[],
  files: Array<{ DESCRIPTION?: string }>,
  observations: Array<{ TITLE?: string; NARRATIVE?: string }>
): QualityScore {
  const warnings: string[] = [];
  const breakdown = {
    triggerPhrases: 0,
    keyTopics: 0,
    fileDescriptions: 0,
    contentLength: 0,
    noLeakedTags: 0,
    observationDedup: 0,
  };

  // 1. Trigger phrases (0-20 points)
  if (triggerPhrases.length >= 8) {
    breakdown.triggerPhrases = 20;
  } else if (triggerPhrases.length >= 4) {
    breakdown.triggerPhrases = 15;
  } else if (triggerPhrases.length > 0) {
    breakdown.triggerPhrases = 10;
  } else {
    warnings.push('No trigger phrases extracted — memory will not surface via trigger matching');
  }

  // 2. Key topics (0-15 points)
  if (keyTopics.length >= 5) {
    breakdown.keyTopics = 15;
  } else if (keyTopics.length >= 2) {
    breakdown.keyTopics = 10;
  } else if (keyTopics.length > 0) {
    breakdown.keyTopics = 5;
  } else {
    warnings.push('No key topics extracted — memory searchability reduced');
  }

  // 3. File descriptions populated (0-20 points)
  const filesWithDesc = files.filter(f =>
    f.DESCRIPTION &&
    f.DESCRIPTION.length > 5 &&
    !f.DESCRIPTION.includes('description pending') &&
    !f.DESCRIPTION.includes('(description pending)')
  );
  if (files.length === 0) {
    breakdown.fileDescriptions = 20; // No files = not applicable, full score
  } else {
    const ratio = filesWithDesc.length / files.length;
    breakdown.fileDescriptions = Math.round(ratio * 20);
    if (ratio < 0.5) {
      warnings.push(`${files.length - filesWithDesc.length}/${files.length} files missing descriptions`);
    }
  }

  // 4. Content length (0-15 points)
  const contentLines = content.split('\n').length;
  if (contentLines >= 100) {
    breakdown.contentLength = 15;
  } else if (contentLines >= 50) {
    breakdown.contentLength = 10;
  } else if (contentLines >= 20) {
    breakdown.contentLength = 5;
  } else {
    warnings.push(`Very short content (${contentLines} lines) — may lack useful context`);
  }

  // 5. No leaked HTML tags (0-15 points)
  const leakedTags = content.match(/<(?:summary|details|div|span|p|br|hr)\b[^>]*>/gi) || [];
  // Exclude tags inside code blocks
  const codeBlocks = content.match(/```[\s\S]*?```/g) || [];
  const codeContent = codeBlocks.join(' ');
  const tagsInCode = codeContent.match(/<(?:summary|details|div|span|p|br|hr)\b[^>]*>/gi) || [];
  const realLeakedTags = leakedTags.length - tagsInCode.length;
  if (realLeakedTags <= 0) {
    breakdown.noLeakedTags = 15;
  } else if (realLeakedTags <= 2) {
    breakdown.noLeakedTags = 10;
    warnings.push(`${realLeakedTags} HTML tag(s) leaked into content`);
  } else {
    breakdown.noLeakedTags = 5;
    warnings.push(`${realLeakedTags} HTML tags leaked into content — content may have raw HTML`);
  }

  // 6. Observation deduplication quality (0-15 points)
  if (observations.length === 0) {
    breakdown.observationDedup = 15; // No observations = not applicable
  } else {
    const titles = observations.map(o => o.TITLE || '').filter(t => t.length > 0);
    const uniqueTitles = new Set(titles);
    const dedupRatio = titles.length > 0 ? uniqueTitles.size / titles.length : 1;
    breakdown.observationDedup = Math.round(dedupRatio * 15);
    if (dedupRatio < 0.6) {
      warnings.push(`High observation duplication: ${titles.length - uniqueTitles.size} duplicate titles`);
    }
  }

  const score = Object.values(breakdown).reduce((sum, v) => sum + v, 0);
  return { score, warnings, breakdown };
}

/* -----------------------------------------------------------------
   5. MEMORY INDEXING
------------------------------------------------------------------*/

async function indexMemory(
  contextDir: string,
  contextFilename: string,
  content: string,
  specFolderName: string,
  collectedData: CollectedDataFull | null = null,
  preExtractedTriggers: string[] = []
): Promise<number | null> {
  const embeddingStart = Date.now();
  const embedding = await generateEmbedding(content);

  if (!embedding) {
    console.warn('   Warning: Embedding generation returned null - skipping indexing');
    return null;
  }

  const embeddingTime = Date.now() - embeddingStart;

  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title: string = titleMatch ? titleMatch[1] : contextFilename.replace('.md', '');

  let triggerPhrases: string[] = [];
  try {
    // Start with pre-extracted triggers (from enriched sources), fall back to content extraction
    if (preExtractedTriggers.length > 0) {
      triggerPhrases = [...preExtractedTriggers];
      console.log(`   Using ${triggerPhrases.length} pre-extracted trigger phrases`);
    } else {
      triggerPhrases = extractTriggerPhrases(content);
      console.log(`   Extracted ${triggerPhrases.length} trigger phrases from content`);
    }

    // Merge manual phrases if available
    if (collectedData && collectedData._manualTriggerPhrases) {
      const manualPhrases = collectedData._manualTriggerPhrases;
      const existingLower = new Set(triggerPhrases.map((p) => p.toLowerCase()));
      for (const phrase of manualPhrases) {
        if (!existingLower.has(phrase.toLowerCase())) {
          triggerPhrases.push(phrase);
        }
      }
      console.log(`   Total: ${triggerPhrases.length} trigger phrases (${manualPhrases.length} manual)`);
    }
  } catch (triggerError: unknown) {
    const errMsg = triggerError instanceof Error ? triggerError.message : String(triggerError);
    structuredLog('warn', 'Trigger phrase extraction failed', {
      error: errMsg,
      contentLength: content.length
    });
    console.warn(`   Warning: Trigger extraction failed: ${errMsg}`);
    if (collectedData && collectedData._manualTriggerPhrases) {
      triggerPhrases = collectedData._manualTriggerPhrases;
      console.log(`   Using ${triggerPhrases.length} manual trigger phrases`);
    }
  }

  const contentLength = content.length;
  const anchorCount = (content.match(/<!-- (?:ANCHOR|anchor):/gi) || []).length;
  const lengthFactor = Math.min(contentLength / 10000, 1) * 0.3;
  const anchorFactor = Math.min(anchorCount / 10, 1) * 0.3;
  const recencyFactor = 0.2;
  const importanceWeight = Math.round((lengthFactor + anchorFactor + recencyFactor + 0.2) * 100) / 100;

  const memoryId: number = vectorIndex.indexMemory({
    specFolder: specFolderName,
    filePath: path.join(contextDir, contextFilename),
    anchorId: null,
    title: title,
    triggerPhrases: triggerPhrases,
    importanceWeight: importanceWeight,
    embedding: embedding
  });

  console.log(`   Embedding generated in ${embeddingTime}ms`);

  if (embeddingTime > 500) {
    console.warn(`   Warning: Embedding took ${embeddingTime}ms (target <500ms)`);
  }

  notifyDatabaseUpdated();

  return memoryId;
}

async function updateMetadataWithEmbedding(contextDir: string, memoryId: number): Promise<void> {
  try {
    const metadataPath = path.join(contextDir, 'metadata.json');
    const metadataContent = await fs.readFile(metadataPath, 'utf-8');
    const metadata = JSON.parse(metadataContent) as Record<string, unknown>;

    metadata.embedding = {
      status: 'indexed',
      model: MODEL_NAME,
      dimensions: EMBEDDING_DIM,
      memoryId: memoryId,
      generatedAt: new Date().toISOString()
    };

    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
  } catch (metaError: unknown) {
    const errMsg = metaError instanceof Error ? metaError.message : String(metaError);
    structuredLog('warn', 'Failed to update metadata.json', {
      metadataPath: path.join(contextDir, 'metadata.json'),
      memoryId,
      error: errMsg
    });
    console.warn(`   Warning: Could not update metadata.json: ${errMsg}`);
  }
}

/* -----------------------------------------------------------------
   6. MAIN WORKFLOW
------------------------------------------------------------------*/

async function runWorkflow(options: WorkflowOptions = {}): Promise<WorkflowResult> {
  const {
    dataFile,
    specFolderArg,
    collectedData: preloadedData,
    loadDataFn,
    collectSessionDataFn,
    silent = false
  } = options;


  const log = silent ? (): void => {} : console.log.bind(console);
  const warn = silent ? (): void => {} : console.warn.bind(console);

  log('Starting memory skill workflow...\n');

  // Step 1: Load collected data
  log('Step 1: Loading collected data...');

  let collectedData: CollectedDataFull | null;
  if (preloadedData) {
    collectedData = preloadedData;
    log('   Using pre-loaded data');
  } else if (loadDataFn) {
    collectedData = await loadDataFn();
    log('   Loaded via custom function');
  } else {
    if (dataFile) CONFIG.DATA_FILE = dataFile;
    if (specFolderArg) CONFIG.SPEC_FOLDER_ARG = specFolderArg;

    collectedData = await loadCollectedDataFromLoader();
    log(`   Loaded from ${collectedData?._isSimulation ? 'simulation' : 'data source'}`);
  }

  if (!collectedData) {
    throw new Error('No data available - provide dataFile, collectedData, or loadDataFn');
  }
  log();

  // Step 2: Detect spec folder with context alignment
  log('Step 2: Detecting spec folder...');
  const specFolder: string = await detectSpecFolder(collectedData);
  const specsDir: string = findActiveSpecsDir() || path.join(CONFIG.PROJECT_ROOT, 'specs');
  const specFolderName: string = path.relative(specsDir, specFolder);
  log(`   Using: ${specFolder}\n`);

  // Step 3: Setup context directory
  log('Step 3: Setting up context directory...');
  const contextDir: string = await setupContextDirectory(specFolder);
  log(`   Created: ${contextDir}\n`);

  // Steps 4-7: Parallel data extraction
  log('Steps 4-7: Extracting data (parallel execution)...\n');

  const sessionDataFn = collectSessionDataFn || collectSessionData;
  if (!sessionDataFn) {
    throw new Error(
      'Missing session data collector function.\n' +
      '  - If calling runWorkflow() directly, pass { collectSessionDataFn: yourFunction } in options\n' +
      '  - If using generate-context.js, ensure extractors/collect-session-data.js exports collectSessionData'
    );
  }

  const [sessionData, conversations, decisions, diagrams, workflowData] = await Promise.all([
    (async () => {
      log('   Collecting session data...');
      const result = await sessionDataFn(collectedData, specFolderName);
      log('   Session data collected');
      return result;
    })(),
    (async () => {
      log('   Extracting conversations...');
      const result = await extractConversations(collectedData as Parameters<typeof extractConversations>[0]);
      log(`   Found ${result.MESSAGES.length} messages`);
      return result;
    })(),
    (async () => {
      log('   Extracting decisions...');
      const result = await extractDecisions(collectedData as Parameters<typeof extractDecisions>[0]);
      log(`   Found ${result.DECISIONS.length} decisions`);
      return result;
    })(),
    (async () => {
      log('   Extracting diagrams...');
      const result = await extractDiagrams(collectedData as Parameters<typeof extractDiagrams>[0]);
      log(`   Found ${result.DIAGRAMS.length} diagrams`);
      return result;
    })(),
    (async () => {
      log('   Generating workflow flowchart...');
      const phases = extractPhasesFromData(collectedData as Parameters<typeof extractPhasesFromData>[0]);
      const patternType: string = flowchartGen.detectWorkflowPattern(phases);
      const phaseDetails = flowchartGen.buildPhaseDetails(phases);
      const features = flowchartGen.extractFlowchartFeatures(phases, patternType);
      const useCases = flowchartGen.getPatternUseCases(patternType);
      const useCaseTitle = specFolderName.replace(/^\d+-/, '').replace(/-/g, ' ');

      log(`   Workflow data generated (${patternType})`);
      return {
        WORKFLOW_FLOWCHART: flowchartGen.generateWorkflowFlowchart(phases),
        HAS_WORKFLOW_DIAGRAM: false,
        PATTERN_TYPE: patternType.charAt(0).toUpperCase() + patternType.slice(1),
        PATTERN_LINEAR: patternType === 'linear',
        PATTERN_PARALLEL: patternType === 'parallel',
        PHASES: phaseDetails,
        HAS_PHASES: phaseDetails.length > 0,
        USE_CASE_TITLE: useCaseTitle,
        FEATURES: features,
        USE_CASES: useCases
      };
    })()
  ]);
  log('\n   All extraction complete (parallel execution)\n');

  // Step 7.5: Generate semantic implementation summary
  log('Step 7.5: Generating semantic summary...');

  const rawUserPrompts = collectedData?.userPrompts || [];
  const allMessages = rawUserPrompts.map((m) => ({
    prompt: m.prompt || '',
    content: m.prompt || '',
    timestamp: m.timestamp
  }));

  // Run content through filter pipeline for quality scoring
  const filterPipeline = createFilterPipeline();
  filterPipeline.filter(allMessages);
  const filterStats: FilterStats = filterPipeline.getStats();

  log(`   Content quality: ${filterStats.qualityScore}/100 (${filterStats.noiseFiltered} noise, ${filterStats.duplicatesRemoved} duplicates filtered from ${filterStats.totalProcessed} items)`);
  if (filterPipeline.isLowQuality()) {
    warn(`   Warning: Low quality content detected (score: ${filterStats.qualityScore}/100, threshold: ${filterPipeline.config.quality?.warnThreshold || 20})`);
  }

  const implSummary = generateImplementationSummary(
    allMessages,
    (collectedData?.observations || []) as Parameters<typeof generateImplementationSummary>[1]
  );

  const semanticFileChanges: Map<string, SemanticFileInfo> = extractFileChanges(
    allMessages,
    (collectedData?.observations || []) as Parameters<typeof extractFileChanges>[1]
  );
  const enhancedFiles: FileChange[] = enhanceFilesWithSemanticDescriptions(
    sessionData.FILES || [],
    semanticFileChanges
  );

  const IMPL_SUMMARY_MD: string = formatSummaryAsMarkdown(implSummary);
  const HAS_IMPL: boolean = implSummary.filesCreated.length > 0 ||
                   implSummary.filesModified.length > 0 ||
                   implSummary.decisions.length > 0;

  log(`   Generated summary: ${implSummary.filesCreated.length} created, ${implSummary.filesModified.length} modified, ${implSummary.decisions.length} decisions\n`);

  // Step 8: Populate templates
  log('Step 8: Populating template...');

  const specFolderBasename: string = path.basename(sessionData.SPEC_FOLDER || specFolderName);
  const folderBase: string = specFolderBasename.replace(/^\d+-/, '');
  const ctxFilename: string = `${sessionData.DATE}_${sessionData.TIME}__${folderBase}.md`;

  const keyTopics: string[] = extractKeyTopics(sessionData.SUMMARY, decisions.DECISIONS, specFolderName);
  const keyFiles = enhancedFiles.map((f) => ({ FILE_PATH: f.FILE_PATH }));

  // Pre-extract trigger phrases for template embedding AND later indexing
  let preExtractedTriggers: string[] = [];
  try {
    // Build enriched text for trigger extraction: summary + decisions + file paths
    const triggerSourceParts: string[] = [];
    if (sessionData.SUMMARY && sessionData.SUMMARY.length > 20) {
      triggerSourceParts.push(sessionData.SUMMARY);
    }
    decisions.DECISIONS.forEach((d: DecisionForTopics & { CONTEXT?: string; CHOSEN?: string }) => {
      if (d.TITLE) triggerSourceParts.push(d.TITLE);
      if (d.RATIONALE) triggerSourceParts.push(d.RATIONALE);
      if (d.CONTEXT) triggerSourceParts.push(d.CONTEXT);
      if (d.CHOSEN) triggerSourceParts.push(d.CHOSEN);
    });
    enhancedFiles.forEach(f => {
      if (f.FILE_PATH) triggerSourceParts.push(f.FILE_PATH);
      if (f.DESCRIPTION && !f.DESCRIPTION.includes('pending')) triggerSourceParts.push(f.DESCRIPTION);
    });
    // Add spec folder name tokens as trigger source
    const folderNameForTriggers = specFolderName.replace(/^\d{1,3}-/, '').replace(/-/g, ' ');
    triggerSourceParts.push(folderNameForTriggers);

    const triggerSource = triggerSourceParts.join('\n');
    preExtractedTriggers = extractTriggerPhrases(triggerSource);

    // Also add spec folder name-derived phrases if not already present
    const folderTokens = folderNameForTriggers.split(/\s+/).filter(t => t.length >= 3);
    const existingLower = new Set(preExtractedTriggers.map(p => p.toLowerCase()));
    if (folderNameForTriggers.length >= 5 && !existingLower.has(folderNameForTriggers.toLowerCase())) {
      preExtractedTriggers.unshift(folderNameForTriggers.toLowerCase());
    }
    for (const token of folderTokens) {
      if (!existingLower.has(token.toLowerCase())) {
        preExtractedTriggers.push(token.toLowerCase());
        existingLower.add(token.toLowerCase());
      }
    }

    log(`   Pre-extracted ${preExtractedTriggers.length} trigger phrases`);
  } catch (e: unknown) {
    const errMsg = e instanceof Error ? e.message : String(e);
    warn(`   Warning: Pre-extraction of trigger phrases failed: ${errMsg}`);
  }

  const files: Record<string, string> = {
    [ctxFilename]: await populateTemplate('context', {
      ...sessionData,
      ...conversations,
      ...workflowData,
      FILES: enhancedFiles,
      MESSAGE_COUNT: conversations.MESSAGES.length,
      DECISION_COUNT: decisions.DECISIONS.length,
      DIAGRAM_COUNT: diagrams.DIAGRAMS.length,
      PHASE_COUNT: conversations.PHASE_COUNT,
      DECISIONS: decisions.DECISIONS,
      HIGH_CONFIDENCE_COUNT: decisions.HIGH_CONFIDENCE_COUNT,
      MEDIUM_CONFIDENCE_COUNT: decisions.MEDIUM_CONFIDENCE_COUNT,
      LOW_CONFIDENCE_COUNT: decisions.LOW_CONFIDENCE_COUNT,
      FOLLOWUP_COUNT: decisions.FOLLOWUP_COUNT,
      HAS_AUTO_GENERATED: diagrams.HAS_AUTO_GENERATED,
      FLOW_TYPE: diagrams.FLOW_TYPE,
      AUTO_CONVERSATION_FLOWCHART: diagrams.AUTO_CONVERSATION_FLOWCHART,
      AUTO_DECISION_TREES: diagrams.AUTO_DECISION_TREES,
      DIAGRAMS: diagrams.DIAGRAMS,
      IMPLEMENTATION_SUMMARY: IMPL_SUMMARY_MD,
      HAS_IMPLEMENTATION_SUMMARY: HAS_IMPL,
      IMPL_TASK: implSummary.task,
      IMPL_SOLUTION: implSummary.solution,
      IMPL_FILES_CREATED: implSummary.filesCreated,
      IMPL_FILES_MODIFIED: implSummary.filesModified,
      IMPL_DECISIONS: implSummary.decisions,
      IMPL_OUTCOMES: implSummary.outcomes,
      HAS_IMPL_FILES_CREATED: implSummary.filesCreated.length > 0,
      HAS_IMPL_FILES_MODIFIED: implSummary.filesModified.length > 0,
      HAS_IMPL_DECISIONS: implSummary.decisions.length > 0,
      HAS_IMPL_OUTCOMES: implSummary.outcomes.length > 0 && implSummary.outcomes[0] !== 'Session completed',
      TOPICS: keyTopics,
      HAS_KEY_TOPICS: keyTopics.length > 0,
      TRIGGER_PHRASES: preExtractedTriggers,
      KEY_FILES: keyFiles,
      RELATED_SESSIONS: [],
      PARENT_SPEC: sessionData.SPEC_FOLDER || '',
      CHILD_SESSIONS: [],
      EMBEDDING_MODEL: MODEL_NAME || 'text-embedding-3-small',
      EMBEDDING_VERSION: '1.0',
      CHUNK_COUNT: 1
    }),
    'metadata.json': JSON.stringify({
      timestamp: `${sessionData.DATE} ${sessionData.TIME}`,
      messageCount: sessionData.MESSAGE_COUNT,
      decisionCount: decisions.DECISIONS.length,
      diagramCount: diagrams.DIAGRAMS.length,
      skillVersion: CONFIG.SKILL_VERSION,
      autoTriggered: shouldAutoSave(sessionData.MESSAGE_COUNT),
      filtering: filterPipeline.getStats(),
      semanticSummary: {
        task: implSummary.task.substring(0, 100),
        filesCreated: implSummary.filesCreated.length,
        filesModified: implSummary.filesModified.length,
        decisions: implSummary.decisions.length,
        messageStats: implSummary.messageStats
      },
      embedding: {
        status: 'pending',
        model: MODEL_NAME,
        dimensions: EMBEDDING_DIM
      }
    }, null, 2)
  };

  if (filterStats.qualityScore < 20) {
    const warningHeader = `> **Note:** This session had limited actionable content (quality score: ${filterStats.qualityScore}/100). ${filterStats.noiseFiltered} noise entries and ${filterStats.duplicatesRemoved} duplicates were filtered.\n\n`;
    files[ctxFilename] = warningHeader + files[ctxFilename];
    log(`   Warning: Low quality session (${filterStats.qualityScore}/100) - warning header added`);
  }

  const isSimulation: boolean = !collectedData || !!collectedData._isSimulation || simFactory.requiresSimulation(collectedData);
  if (isSimulation) {
    const simWarning = `<!-- WARNING: This is simulated/placeholder content - NOT from a real session -->\n\n`;
    files[ctxFilename] = simWarning + files[ctxFilename];
    log('   Warning: Simulation mode: placeholder content warning added');
  }

  log(`   Template populated (quality: ${filterStats.qualityScore}/100)\n`);

  // Step 8.5: Content cleaning — strip leaked HTML tags from rendered content
  log('Step 8.5: Content cleaning...');
  const rawContent = files[ctxFilename];
  // Strip <summary> and </summary> tags that leak from conversation data
  // Also strip other common leaked HTML tags, but preserve <!-- comment --> anchors
  let cleanedContent = rawContent
    .replace(/<\/?summary>/gi, '')
    .replace(/<\/?details>/gi, '');
  // Only update if cleaning made changes
  if (cleanedContent !== rawContent) {
    files[ctxFilename] = cleanedContent;
    log('   Stripped leaked HTML tags from content');
  } else {
    log('   No HTML cleaning needed');
  }

  // Step 8.6: Quality scoring
  log('Step 8.6: Quality scoring...');
  const qualityResult = scoreMemoryQuality(
    files[ctxFilename],
    preExtractedTriggers,
    keyTopics,
    enhancedFiles,
    sessionData.OBSERVATIONS || []
  );
  log(`   Memory quality score: ${qualityResult.score}/100`);
  if (qualityResult.warnings.length > 0) {
    for (const warning of qualityResult.warnings) {
      warn(`   Quality warning: ${warning}`);
    }
  }
  log(`   Breakdown: triggers=${qualityResult.breakdown.triggerPhrases}/20, topics=${qualityResult.breakdown.keyTopics}/15, fileDesc=${qualityResult.breakdown.fileDescriptions}/20, length=${qualityResult.breakdown.contentLength}/15, html=${qualityResult.breakdown.noLeakedTags}/15, dedup=${qualityResult.breakdown.observationDedup}/15`);

  // Step 9: Write files with atomic writes and rollback on failure
  log('Step 9: Writing files...');
  const writtenFiles: string[] = await writeFilesAtomically(contextDir, files);
  log();

  // Step 9.5: State embedded in memory file
  log('Step 9.5: State embedded in memory file (V13.0)');

  // Step 10: Success confirmation
  log('Context saved successfully!\n');
  log(`Location: ${contextDir}\n`);
  log('Files created:');
  for (const [filename, content] of Object.entries(files)) {
    const lines = content.split('\n').length;
    log(`  - ${filename} (${lines} lines)`);
  }
  log();
  log('Summary:');
  log(`  - ${conversations.MESSAGES.length} messages captured`);
  log(`  - ${decisions.DECISIONS.length} key decisions documented`);
  log(`  - ${diagrams.DIAGRAMS.length} diagrams preserved`);
  log(`  - Session duration: ${sessionData.DURATION}\n`);

  // Step 11: Semantic memory indexing
  log('Step 11: Indexing semantic memory...');

  let memoryId: number | null = null;
  try {
    memoryId = await indexMemory(contextDir, ctxFilename, files[ctxFilename], specFolderName, collectedData, preExtractedTriggers);
    if (memoryId) {
      log(`   Indexed as memory #${memoryId} (${EMBEDDING_DIM} dimensions)`);
      await updateMetadataWithEmbedding(contextDir, memoryId);
      log('   Updated metadata.json with embedding info');
    }
  } catch (e: unknown) {
    const errMsg = e instanceof Error ? e.message : String(e);
    warn(`   Warning: Embedding failed: ${errMsg}`);
    warn('   Context saved successfully without semantic indexing');
    warn('   Run "npm run rebuild" to retry indexing later');
  }

  // Step 12: Opportunistic retry processing
  try {
    const retryStats = retryManager.getRetryStats();
    if (retryStats.queue_size > 0) {
      log('Step 12: Processing retry queue...');
      const results = await retryManager.processRetryQueue(3);
      if (results.processed > 0) {
        log(`   Processed ${results.processed} pending embeddings`);
        log(`   Succeeded: ${results.succeeded}, Failed: ${results.failed}`);
      }
    }
  } catch (e: unknown) {
    const errMsg = e instanceof Error ? e.message : String(e);
    warn(`   Warning: Retry processing error: ${errMsg}`);
  }

  log();

  return {
    contextDir,
    specFolder,
    specFolderName,
    contextFilename: ctxFilename,
    writtenFiles,
    memoryId,
    stats: {
      messageCount: conversations.MESSAGES.length,
      decisionCount: decisions.DECISIONS.length,
      diagramCount: diagrams.DIAGRAMS.length,
      qualityScore: qualityResult.score,
      isSimulation
    }
  };
}

/* -----------------------------------------------------------------
   7. EXPORTS
------------------------------------------------------------------*/

export {
  runWorkflow,
};
