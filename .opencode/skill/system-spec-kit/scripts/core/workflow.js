// ───────────────────────────────────────────────────────────────
// CORE: WORKFLOW
// ───────────────────────────────────────────────────────────────
'use strict';

/* ─────────────────────────────────────────────────────────────
   1. IMPORTS
──────────────────────────────────────────────────────────────── */

const fs = require('fs/promises');
const fsSync = require('fs');
const path = require('path');
const { CONFIG, findActiveSpecsDir } = require('./config');
const { structuredLog } = require('../utils');
const { extractConversations, extractDecisions, extractDiagrams, extractPhasesFromData,
        enhanceFilesWithSemanticDescriptions } = require('../extractors');
const { detectSpecFolder, setupContextDirectory } = require('../spec-folder');
const { populateTemplate } = require('../renderers');
const { shouldAutoSave, collectSessionData } = require('../extractors/collect-session-data');

/* ─────────────────────────────────────────────────────────────
   2. LAZY-LOADED DEPENDENCIES
──────────────────────────────────────────────────────────────── */

let flowchartGen, getFilterStats, generateImplementationSummary, formatSummaryAsMarkdown;
let extractFileChanges, generateEmbedding, EMBEDDING_DIM, MODEL_NAME;
let vectorIndex, retryManager, extractTriggerPhrases, simFactory;
let loadCollectedData;

const DB_UPDATED_FILE = path.join(__dirname, '../../database/.db-updated');

/* ─────────────────────────────────────────────────────────────
   3. INITIALIZATION
──────────────────────────────────────────────────────────────── */

function initializeLibraries() {
  if (flowchartGen) return;
  flowchartGen = require('../lib/flowchart-generator');
  ({ getFilterStats } = require('../lib/content-filter'));
  ({ generateImplementationSummary, formatSummaryAsMarkdown, extractFileChanges } = require('../lib/semantic-summarizer'));
  ({ generateEmbedding, EMBEDDING_DIM, MODEL_NAME } = require('../lib/embeddings'));
  vectorIndex = require('../../mcp_server/lib/vector-index');
  retryManager = require('../lib/retry-manager');
  ({ extractTriggerPhrases } = require('../lib/trigger-extractor'));
  simFactory = require('../lib/simulation-factory');
}

function initializeDataLoaders() {
  if (loadCollectedData) return;
  const dataLoader = require('../loaders/data-loader');
  loadCollectedData = dataLoader.loadCollectedData;
}

/* ─────────────────────────────────────────────────────────────
   4. UTILITY FUNCTIONS
──────────────────────────────────────────────────────────────── */

function notifyDatabaseUpdated() {
  try {
    const dbDir = path.dirname(DB_UPDATED_FILE);
    if (!fsSync.existsSync(dbDir)) fsSync.mkdirSync(dbDir, { recursive: true });
    fsSync.writeFileSync(DB_UPDATED_FILE, Date.now().toString());
  } catch (e) { console.error('[workflow] Database notification error:', e.message); }
}

function validateNoLeakedPlaceholders(content, filename) {
  const leaked = content.match(/\{\{[A-Z_]+\}\}/g);
  if (leaked) throw new Error(`Leaked placeholders in ${filename}: ${leaked.join(', ')}`);
}

function validateAnchors(content) {
  const open = new Set(), close = new Set();
  let m;
  const op = /<!-- (?:ANCHOR|anchor):([a-zA-Z0-9_-]+)/g;
  const cp = /<!-- \/(?:ANCHOR|anchor):([a-zA-Z0-9_-]+)/g;
  while ((m = op.exec(content))) open.add(m[1]);
  while ((m = cp.exec(content))) close.add(m[1]);
  const warnings = [];
  for (const a of open) if (!close.has(a)) warnings.push(`Unclosed: ${a}`);
  for (const a of close) if (!open.has(a)) warnings.push(`Orphaned: ${a}`);
  return warnings;
}

function extractKeyTopics(summary, decisions = []) {
  const stopwords = new Set(['the','a','an','and','or','but','in','on','at','to','for','of','with','by','from','as','is','was','are','were','file','files','code','update','response','request','message']);
  const topics = new Set();
  if (summary && summary.length >= 20 && !summary.includes('SIMULATION')) {
    (summary.toLowerCase().match(/\b[a-z][a-z0-9]{2,}\b/g) || []).forEach(w => { if (!stopwords.has(w)) topics.add(w); });
  }
  decisions.forEach(d => {
    const t = `${d.TITLE||''} ${d.RATIONALE||''}`.toLowerCase();
    (t.match(/\b[a-z][a-z0-9]{2,}\b/g) || []).forEach(w => { if (!stopwords.has(w)) topics.add(w); });
  });
  return [...topics].sort((a,b) => b.length - a.length).slice(0, 10);
}

async function writeFilesAtomically(contextDir, files) {
  const written = [];
  for (const [filename, content] of Object.entries(files)) {
    validateNoLeakedPlaceholders(content, filename);
    const warnings = validateAnchors(content);
    if (warnings.length) console.warn(`   ⚠️  ${filename}: ${warnings.join(', ')}`);
    const filePath = path.join(contextDir, filename), tempPath = filePath + '.tmp';
    try {
      await fs.writeFile(tempPath, content, 'utf-8');
      const stat = await fs.stat(tempPath);
      if (stat.size !== Buffer.byteLength(content, 'utf-8')) throw new Error('Size mismatch');
      await fs.rename(tempPath, filePath);
      written.push(filename);
      console.log(`   ✓ ${filename} (${content.split('\n').length} lines)`);
    } catch (e) {
      try { await fs.unlink(tempPath); } catch (_) {}
      throw new Error(`Write failed ${filename}: ${e.message}`);
    }
  }
  return written;
}

/* ─────────────────────────────────────────────────────────────
   5. MEMORY INDEXING
──────────────────────────────────────────────────────────────── */

async function indexMemory(contextDir, contextFilename, content, specFolderName, collectedData = null) {
  const embeddingStart = Date.now();
  const embedding = await generateEmbedding(content);
  
  if (!embedding) {
    console.warn('   ⚠️  Embedding generation returned null - skipping indexing');
    return null;
  }
  
  const embeddingTime = Date.now() - embeddingStart;
  
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : contextFilename.replace('.md', '');
  
  let triggerPhrases = [];
  try {
    triggerPhrases = extractTriggerPhrases(content);
    
    if (collectedData && collectedData._manualTriggerPhrases) {
      const manualPhrases = collectedData._manualTriggerPhrases;
      const existingLower = new Set(triggerPhrases.map(p => p.toLowerCase()));
      for (const phrase of manualPhrases) {
        if (!existingLower.has(phrase.toLowerCase())) {
          triggerPhrases.push(phrase);
        }
      }
      console.log(`   ✓ Extracted ${triggerPhrases.length} trigger phrases (${manualPhrases.length} manual)`);
    } else {
      console.log(`   ✓ Extracted ${triggerPhrases.length} trigger phrases`);
    }
  } catch (triggerError) {
    structuredLog('warn', 'Trigger phrase extraction failed', {
      error: triggerError.message,
      contentLength: content.length
    });
    console.warn(`   ⚠️  Trigger extraction failed: ${triggerError.message}`);
    if (collectedData && collectedData._manualTriggerPhrases) {
      triggerPhrases = collectedData._manualTriggerPhrases;
      console.log(`   ✓ Using ${triggerPhrases.length} manual trigger phrases`);
    }
  }
  
  const contentLength = content.length;
  const anchorCount = (content.match(/<!-- (?:ANCHOR|anchor):/gi) || []).length;
  const lengthFactor = Math.min(contentLength / 10000, 1) * 0.3;
  const anchorFactor = Math.min(anchorCount / 10, 1) * 0.3;
  const recencyFactor = 0.2;
  const importanceWeight = Math.round((lengthFactor + anchorFactor + recencyFactor + 0.2) * 100) / 100;
  
  const memoryId = vectorIndex.indexMemory({
    specFolder: specFolderName,
    filePath: path.join(contextDir, contextFilename),
    anchorId: null,
    title: title,
    triggerPhrases: triggerPhrases,
    importanceWeight: importanceWeight,
    embedding: embedding
  });
  
  console.log(`   ✓ Embedding generated in ${embeddingTime}ms`);
  
  if (embeddingTime > 500) {
    console.warn(`   ⚠️  Embedding took ${embeddingTime}ms (target <500ms)`);
  }
  
  notifyDatabaseUpdated();
  
  return memoryId;
}

async function updateMetadataWithEmbedding(contextDir, memoryId) {
  try {
    const metadataPath = path.join(contextDir, 'metadata.json');
    const metadataContent = await fs.readFile(metadataPath, 'utf-8');
    const metadata = JSON.parse(metadataContent);
    
    metadata.embedding = {
      status: 'indexed',
      model: MODEL_NAME,
      dimensions: EMBEDDING_DIM,
      memoryId: memoryId,
      generatedAt: new Date().toISOString()
    };
    
    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
  } catch (metaError) {
    structuredLog('warn', 'Failed to update metadata.json', {
      metadataPath: path.join(contextDir, 'metadata.json'),
      memoryId,
      error: metaError.message
    });
    console.warn(`   ⚠️  Could not update metadata.json: ${metaError.message}`);
  }
}

/* ─────────────────────────────────────────────────────────────
   6. MAIN WORKFLOW
──────────────────────────────────────────────────────────────── */

async function runWorkflow(options = {}) {
  const { 
    dataFile, 
    specFolderArg,
    collectedData: preloadedData, 
    loadDataFn, 
    collectSessionDataFn,
    silent = false 
  } = options;
  
  initializeLibraries();
  initializeDataLoaders();
  
  const log = silent ? () => {} : console.log.bind(console);
  const warn = silent ? () => {} : console.warn.bind(console);
  
  log('🚀 Starting memory skill workflow...\n');

  // Step 1: Load collected data
  log('📥 Step 1: Loading collected data...');
  
  let collectedData;
  if (preloadedData) {
    collectedData = preloadedData;
    log('   ✓ Using pre-loaded data');
  } else if (loadDataFn) {
    collectedData = await loadDataFn();
    log('   ✓ Loaded via custom function');
  } else {
    if (dataFile) CONFIG.DATA_FILE = dataFile;
    if (specFolderArg) CONFIG.SPEC_FOLDER_ARG = specFolderArg;
    
    collectedData = await loadCollectedData();
    log(`   ✓ Loaded from ${collectedData?._isSimulation ? 'simulation' : 'data source'}`);
  }
  
  if (!collectedData) {
    throw new Error('No data available - provide dataFile, collectedData, or loadDataFn');
  }
  log();

  // Step 2: Detect spec folder with context alignment
  log('📁 Step 2: Detecting spec folder...');
  const specFolder = await detectSpecFolder(collectedData);
  const specsDir = findActiveSpecsDir() || path.join(CONFIG.PROJECT_ROOT, 'specs');
  const specFolderName = path.relative(specsDir, specFolder);
  log(`   ✓ Using: ${specFolder}\n`);

  // Step 3: Setup context directory
  log('📂 Step 3: Setting up context directory...');
  const contextDir = await setupContextDirectory(specFolder);
  log(`   ✓ Created: ${contextDir}\n`);

  // Steps 4-7: Parallel data extraction
  log('🔄 Steps 4-7: Extracting data (parallel execution)...\n');
  
  const sessionDataFn = collectSessionDataFn || collectSessionData;
  if (!sessionDataFn) {
    throw new Error('collectSessionDataFn required - collectSessionData not available in data-loader. Pass it via options.');
  }
  
  const [sessionData, conversations, decisions, diagrams, workflowData] = await Promise.all([
    (async () => {
      log('   📋 Collecting session data...');
      const result = await sessionDataFn(collectedData, specFolderName);
      log('   ✓ Session data collected');
      return result;
    })(),
    (async () => {
      log('   💬 Extracting conversations...');
      const result = await extractConversations(collectedData);
      log(`   ✓ Found ${result.MESSAGES.length} messages`);
      return result;
    })(),
    (async () => {
      log('   🧠 Extracting decisions...');
      const result = await extractDecisions(collectedData);
      log(`   ✓ Found ${result.DECISIONS.length} decisions`);
      return result;
    })(),
    (async () => {
      log('   📊 Extracting diagrams...');
      const result = await extractDiagrams(collectedData);
      log(`   ✓ Found ${result.DIAGRAMS.length} diagrams`);
      return result;
    })(),
    (async () => {
      log('   🔀 Generating workflow flowchart...');
      const phases = extractPhasesFromData(collectedData);
      const patternType = flowchartGen.detectWorkflowPattern(phases);
      const phaseDetails = flowchartGen.buildPhaseDetails(phases);
      const features = flowchartGen.extractFlowchartFeatures(phases, patternType);
      const useCases = flowchartGen.getPatternUseCases(patternType);
      const useCaseTitle = specFolderName.replace(/^\d+-/, '').replace(/-/g, ' ');
      
      log(`   ✓ Workflow data generated (${patternType})`);
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
  log('\n   ✅ All extraction complete (parallel execution)\n');

  // Step 7.5: Generate semantic implementation summary
  log('🧠 Step 7.5: Generating semantic summary...');
  
  const rawUserPrompts = collectedData?.user_prompts || [];
  const allMessages = rawUserPrompts.map(m => ({
    prompt: m.prompt || '',
    content: m.prompt || '',
    timestamp: m.timestamp
  }));

  const implSummary = generateImplementationSummary(
    allMessages,
    collectedData?.observations || []
  );

  const semanticFileChanges = extractFileChanges(allMessages, collectedData?.observations || []);
  const enhancedFiles = enhanceFilesWithSemanticDescriptions(sessionData.FILES || [], semanticFileChanges);

  const IMPL_SUMMARY_MD = formatSummaryAsMarkdown(implSummary);
  const HAS_IMPL = implSummary.filesCreated.length > 0 ||
                   implSummary.filesModified.length > 0 ||
                   implSummary.decisions.length > 0;

  log(`   ✓ Generated summary: ${implSummary.filesCreated.length} created, ${implSummary.filesModified.length} modified, ${implSummary.decisions.length} decisions\n`);

  // Step 8: Populate templates
  log('📝 Step 8: Populating template...');

  const specFolderBasename = path.basename(sessionData.SPEC_FOLDER || specFolderName);
  const folderBase = specFolderBasename.replace(/^\d+-/, '');
  const ctxFilename = `${sessionData.DATE}_${sessionData.TIME}__${folderBase}.md`;

  const keyTopics = extractKeyTopics(sessionData.SUMMARY, decisions.DECISIONS);
  const keyFiles = enhancedFiles.map(f => ({ FILE_PATH: f.FILE_PATH }));

  const files = {
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
      filtering: getFilterStats(),
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

  const filterStats = getFilterStats();
  if (filterStats.qualityScore < 20) {
    const warningHeader = `> **Note:** This session had limited actionable content (quality score: ${filterStats.qualityScore}/100). ${filterStats.noiseFiltered} noise entries and ${filterStats.duplicatesRemoved} duplicates were filtered.\n\n`;
    files[ctxFilename] = warningHeader + files[ctxFilename];
    log(`   ⚠️  Low quality session (${filterStats.qualityScore}/100) - warning header added`);
  }

  const isSimulation = !collectedData || collectedData._isSimulation || simFactory.requiresSimulation(collectedData);
  if (isSimulation) {
    const simWarning = `<!-- WARNING: This is simulated/placeholder content - NOT from a real session -->\n\n`;
    files[ctxFilename] = simWarning + files[ctxFilename];
    log(`   ⚠️  Simulation mode: placeholder content warning added`);
  }

  log(`   ✓ Template populated (quality: ${filterStats.qualityScore}/100)\n`);

  // Step 9: Write files with atomic writes and rollback on failure
  log('💾 Step 9: Writing files...');
  const writtenFiles = await writeFilesAtomically(contextDir, files);
  log();

  // Step 9.5: State embedded in memory file
  log('📋 Step 9.5: State embedded in memory file (V13.0)');

  // Step 10: Success confirmation
  log('✅ Context saved successfully!\n');
  log(`Location: ${contextDir}\n`);
  log('Files created:');
  for (const [filename, content] of Object.entries(files)) {
    const lines = content.split('\n').length;
    log(`  • ${filename} (${lines} lines)`);
  }
  log();
  log('Summary:');
  log(`  • ${conversations.MESSAGES.length} messages captured`);
  log(`  • ${decisions.DECISIONS.length} key decisions documented`);
  log(`  • ${diagrams.DIAGRAMS.length} diagrams preserved`);
  log(`  • Session duration: ${sessionData.DURATION}\n`);

  // Step 11: Semantic memory indexing
  log('🧠 Step 11: Indexing semantic memory...');
  
  let memoryId = null;
  try {
    memoryId = await indexMemory(contextDir, ctxFilename, files[ctxFilename], specFolderName, collectedData);
    if (memoryId) {
      log(`   ✓ Indexed as memory #${memoryId} (${EMBEDDING_DIM} dimensions)`);
      await updateMetadataWithEmbedding(contextDir, memoryId);
      log(`   ✓ Updated metadata.json with embedding info`);
    }
  } catch (e) {
    warn(`   ⚠️  Embedding failed: ${e.message}`);
    warn('   ℹ️  Context saved successfully without semantic indexing');
    warn('   ℹ️  Run "npm run rebuild" to retry indexing later');
  }

  // Step 12: Opportunistic retry processing
  try {
    const retryStats = retryManager.getRetryStats();
    if (retryStats.queueSize > 0) {
      log('🔄 Step 12: Processing retry queue...');
      const results = await retryManager.processRetryQueue(3);
      if (results.processed > 0) {
        log(`   ✓ Processed ${results.processed} pending embeddings`);
        log(`   ✓ Succeeded: ${results.succeeded}, Failed: ${results.failed}`);
      }
    }
  } catch (e) {
    warn(`   ⚠️  Retry processing error: ${e.message}`);
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
      qualityScore: filterStats.qualityScore,
      isSimulation
    }
  };
}

/* ─────────────────────────────────────────────────────────────
   7. EXPORTS
──────────────────────────────────────────────────────────────── */

module.exports = {
  runWorkflow,
  initializeLibraries,
  initializeDataLoaders,
  validateNoLeakedPlaceholders,
  validateAnchors,
  extractKeyTopics,
  writeFilesAtomically,
  indexMemory,
  updateMetadataWithEmbedding,
  notifyDatabaseUpdated
};
