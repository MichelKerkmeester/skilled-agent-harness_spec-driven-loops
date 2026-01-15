/* ─────────────────────────────────────────────────────────────
   1. IMPORTS
──────────────────────────────────────────────────────────────── */

'use strict';

const fs = require('fs/promises');
const path = require('path');
const os = require('os');

const { CONFIG } = require('../core');
const { structuredLog, sanitizePath } = require('../utils');

const {
  validateInputData,
  normalizeInputData,
  transformOpenCodeCapture
} = require('../utils/input-normalizer');

// Lazy load to handle missing dependencies
let opencodeCapture;
try {
  opencodeCapture = require('../lib/opencode-capture');
} catch (err) {
  structuredLog('warn', 'opencode-capture library not available', {
    error: err.message
  });
  opencodeCapture = null;
}

/* ─────────────────────────────────────────────────────────────
   2. LOADER FUNCTIONS
──────────────────────────────────────────────────────────────── */

async function loadCollectedData() {
  // Priority 1: Data file provided via command line
  if (CONFIG.DATA_FILE) {
    try {
      // SEC-001: Path traversal mitigation (CWE-22)
      // Use os.tmpdir() for cross-platform temp directory support
      const tmpDir = os.tmpdir();
      const dataFileAllowedBases = [
        tmpDir,
        process.cwd(),
        path.join(process.cwd(), 'specs'),
        path.join(process.cwd(), '.opencode')
      ];
      
      let validatedDataFilePath;
      try {
        validatedDataFilePath = sanitizePath(CONFIG.DATA_FILE, dataFileAllowedBases);
      } catch (pathError) {
        structuredLog('error', 'Invalid data file path - security validation failed', {
          filePath: CONFIG.DATA_FILE,
          error: pathError.message
        });
        throw new Error(`Security: Invalid data file path: ${pathError.message}`);
      }
      
      const dataContent = await fs.readFile(validatedDataFilePath, 'utf-8');
      const rawData = JSON.parse(dataContent);
      
      validateInputData(rawData, CONFIG.SPEC_FOLDER_ARG);
      console.log('   ✓ Loaded and validated conversation data from file');
      
      const data = normalizeInputData(rawData);
      console.log(`   ✓ Loaded data from data file`);
      return data;
    } catch (error) {
      if (error.code === 'ENOENT') {
        structuredLog('warn', 'Data file not found', { 
          filePath: CONFIG.DATA_FILE, 
          error: error.message 
        });
        console.log(`   ⚠️  Data file not found: ${CONFIG.DATA_FILE}`);
      } else if (error instanceof SyntaxError) {
        structuredLog('warn', 'Invalid JSON in data file', { 
          filePath: CONFIG.DATA_FILE, 
          error: error.message,
          position: error.message.match(/position (\d+)/)?.[1] || 'unknown'
        });
        console.log(`   ⚠️  Invalid JSON in data file ${CONFIG.DATA_FILE}: ${error.message}`);
      } else {
        structuredLog('warn', 'Failed to load data file', { 
          filePath: CONFIG.DATA_FILE, 
          error: error.message 
        });
        console.log(`   ⚠️  Failed to load data file ${CONFIG.DATA_FILE}: ${error.message}`);
      }
    }
  }

  // Priority 2: OpenCode session capture
  console.log('   🔍 Attempting OpenCode session capture...');
  
  if (!opencodeCapture) {
    structuredLog('debug', 'OpenCode capture not available', { 
      projectRoot: CONFIG.PROJECT_ROOT 
    });
    console.log('   ⚠️  OpenCode capture not available');
  } else {
    try {
      const conversation = await opencodeCapture.captureConversation(20, CONFIG.PROJECT_ROOT);
      
      if (conversation && conversation.exchanges && conversation.exchanges.length > 0) {
        console.log(`   ✓ Captured ${conversation.exchanges.length} exchanges from OpenCode`);
        console.log(`   ✓ Session: ${conversation.sessionTitle || 'Unnamed'}`);
        
        const data = transformOpenCodeCapture(conversation);
        return data;
      } else {
        structuredLog('debug', 'OpenCode capture returned empty data', { 
          projectRoot: CONFIG.PROJECT_ROOT 
        });
        console.log('   ⚠️  OpenCode capture returned empty data');
      }
    } catch (captureError) {
      structuredLog('debug', 'OpenCode capture failed', { 
        projectRoot: CONFIG.PROJECT_ROOT, 
        error: captureError.message 
      });
      console.log(`   ⚠️  OpenCode capture unavailable: ${captureError.message}`);
    }
  }

  // Priority 3: Simulation fallback
  console.log('   ⚠️  Using fallback simulation mode');
  console.warn('[generate-context] WARNING: Using simulation mode - placeholder data generated');
  console.log('   ⚠️  OUTPUT WILL CONTAIN PLACEHOLDER DATA - NOT REAL SESSION CONTENT');
  console.log('   ℹ️  To save real context, AI must construct JSON and pass as argument:');
  console.log('      node generate-context.js /tmp/save-context-data.json');
  return { _isSimulation: true };
}

/* ─────────────────────────────────────────────────────────────
   3. EXPORTS
──────────────────────────────────────────────────────────────── */

module.exports = {
  loadCollectedData
};
