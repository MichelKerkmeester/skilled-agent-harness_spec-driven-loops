/* ─────────────────────────────────────────────────────────────
   1. IMPORTS
──────────────────────────────────────────────────────────────── */
'use strict';

/* ─────────────────────────────────────────────────────────────
   2. DECISION TRANSFORMATION
──────────────────────────────────────────────────────────────── */

function transformKeyDecision(decisionItem) {
  let decisionText, chosenApproach, rationale, alternatives;
  
  if (typeof decisionItem === 'string') {
    decisionText = decisionItem;
    const choiceMatch = decisionText.match(/(?:chose|selected|decided on|using|went with|opted for|implemented)\s+([^.,]+)/i);
    chosenApproach = choiceMatch ? choiceMatch[1].trim() : null;
    rationale = decisionText;
    alternatives = [];
  } else if (typeof decisionItem === 'object' && decisionItem !== null) {
    decisionText = decisionItem.decision || decisionItem.title || 'Unknown decision';
    chosenApproach = decisionItem.chosenOption || decisionItem.chosen || decisionItem.decision;
    rationale = decisionItem.rationale || decisionItem.reason || decisionText;
    alternatives = decisionItem.alternatives || [];
    
    if (decisionItem.rationale) {
      decisionText = `${decisionText} - ${decisionItem.rationale}`;
    }
    if (alternatives.length > 0) {
      decisionText += ` Alternatives considered: ${alternatives.join(', ')}.`;
    }
  } else {
    return null;
  }
  
  const titleMatch = decisionText.match(/^([^.!?]+[.!?]?)/);
  const title = titleMatch 
    ? titleMatch[1].substring(0, 80).trim()
    : decisionText.substring(0, 80).trim();
  
  const finalChosenApproach = chosenApproach || title;
  
  const facts = [
    `Option 1: ${finalChosenApproach}`,
    `Chose: ${finalChosenApproach}`,
    `Rationale: ${rationale}`
  ];
  
  alternatives.forEach((alt, i) => {
    facts.push(`Alternative ${i + 2}: ${alt}`);
  });
  
  return {
    type: 'decision',
    title: title,
    narrative: decisionText,
    facts: facts,
    _manualDecision: {
      fullText: decisionText,
      chosenApproach: finalChosenApproach,
      confidence: 75
    }
  };
}

/* ─────────────────────────────────────────────────────────────
   3. OBSERVATION BUILDERS
──────────────────────────────────────────────────────────────── */

function buildSessionSummaryObservation(summary, triggerPhrases = []) {
  const summaryTitle = summary.length > 100 
    ? summary.substring(0, 100).replace(/\s+\S*$/, '') + '...'
    : summary;
  
  return {
    type: 'feature',
    title: summaryTitle,
    narrative: summary,
    facts: triggerPhrases
  };
}

function buildTechnicalContextObservation(techContext) {
  const techDetails = Object.entries(techContext)
    .map(([key, value]) => `${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}`)
    .join('; ');
  
  return {
    type: 'implementation',
    title: 'Technical Implementation Details',
    narrative: techDetails,
    facts: []
  };
}

/* ─────────────────────────────────────────────────────────────
   4. INPUT NORMALIZATION
──────────────────────────────────────────────────────────────── */

function normalizeInputData(data) {
  if (data.user_prompts || data.observations || data.recent_context) {
    return data;
  }
  
  const normalized = {};
  
  if (data.specFolder) {
    normalized.SPEC_FOLDER = data.specFolder;
  }
  
  if (data.filesModified && Array.isArray(data.filesModified)) {
    normalized.FILES = data.filesModified.map(filePath => ({
      FILE_PATH: filePath,
      DESCRIPTION: 'File modified (description pending)'
    }));
  }
  
  const observations = [];
  
  if (data.sessionSummary) {
    observations.push(buildSessionSummaryObservation(data.sessionSummary, data.triggerPhrases));
  }
  
  if (data.keyDecisions && Array.isArray(data.keyDecisions)) {
    for (const decisionItem of data.keyDecisions) {
      const observation = transformKeyDecision(decisionItem);
      if (observation) {
        observations.push(observation);
      }
    }
  }
  
  if (data.technicalContext && typeof data.technicalContext === 'object') {
    observations.push(buildTechnicalContextObservation(data.technicalContext));
  }
  
  normalized.observations = observations;
  
  normalized.user_prompts = [{
    prompt: data.sessionSummary || 'Manual context save',
    timestamp: new Date().toISOString()
  }];
  
  normalized.recent_context = [{
    request: data.sessionSummary || 'Manual context save',
    learning: data.sessionSummary || ''
  }];
  
  if (data.triggerPhrases) {
    normalized._manualTriggerPhrases = data.triggerPhrases;
  }
  
  if (data.keyDecisions && Array.isArray(data.keyDecisions)) {
    normalized._manualDecisions = data.keyDecisions;
  }
  
  console.log('   ✓ Transformed manual format to MCP-compatible structure');
  return normalized;
}

/* ─────────────────────────────────────────────────────────────
   5. INPUT VALIDATION
──────────────────────────────────────────────────────────────── */

function validateInputData(data, specFolderArg = null) {
  const errors = [];
  
  if (typeof data !== 'object' || data === null) {
    throw new Error('Input validation failed: data must be a non-null object');
  }
  
  if (specFolderArg === null && !data.specFolder && !data.SPEC_FOLDER) {
    if (!data.user_prompts && !data.observations && !data.recent_context) {
      errors.push('Missing required field: specFolder (or use CLI argument)');
    }
  }
  
  if (data.triggerPhrases !== undefined && !Array.isArray(data.triggerPhrases)) {
    errors.push('triggerPhrases must be an array');
  }
  
  if (data.keyDecisions !== undefined && !Array.isArray(data.keyDecisions)) {
    errors.push('keyDecisions must be an array');
  }
  
  if (data.filesModified !== undefined && !Array.isArray(data.filesModified)) {
    errors.push('filesModified must be an array');
  }
  
  const validTiers = ['constitutional', 'critical', 'important', 'normal', 'temporary', 'deprecated'];
  if (data.importanceTier !== undefined && !validTiers.includes(data.importanceTier)) {
    errors.push(`Invalid importanceTier: ${data.importanceTier}. Valid values: ${validTiers.join(', ')}`);
  }
  
  if (data.FILES !== undefined) {
    if (!Array.isArray(data.FILES)) {
      errors.push('FILES must be an array');
    } else {
      for (let i = 0; i < data.FILES.length; i++) {
        const file = data.FILES[i];
        if (typeof file !== 'object' || file === null) {
          errors.push(`FILES[${i}] must be an object`);
        } else if (!file.FILE_PATH && !file.path) {
          errors.push(`FILES[${i}] missing required FILE_PATH or path field`);
        }
      }
    }
  }
  
  if (data.observations !== undefined) {
    if (!Array.isArray(data.observations)) {
      errors.push('observations must be an array');
    }
  }
  
  if (errors.length > 0) {
    throw new Error(`Input validation failed: ${errors.join('; ')}`);
  }

  // Validation passed - function returns void on success, throws on failure
}

/* ─────────────────────────────────────────────────────────────
   6. OPENCODE CAPTURE TRANSFORMATION
──────────────────────────────────────────────────────────────── */

function transformOpenCodeCapture(capture) {
  const { exchanges, toolCalls, metadata, sessionTitle } = capture;

  const user_prompts = exchanges.map(ex => ({
    prompt: ex.userInput || '',
    timestamp: ex.timestamp ? new Date(ex.timestamp).toISOString() : new Date().toISOString()
  }));

  const observations = [];
  
  const placeholderPatterns = [
    '[response]',
    'Assistant processed request',
    'placeholder',
    'simulation mode'
  ];
  
  for (const ex of exchanges) {
    if (ex.assistantResponse) {
      const lowerResponse = ex.assistantResponse.toLowerCase();
      const isPlaceholder = placeholderPatterns.some(p => lowerResponse.includes(p.toLowerCase()));
      
      if (!isPlaceholder && ex.assistantResponse.length > 20) {
        observations.push({
          type: 'feature',
          title: ex.assistantResponse.substring(0, 80),
          narrative: ex.assistantResponse,
          timestamp: ex.timestamp ? new Date(ex.timestamp).toISOString() : new Date().toISOString(),
          facts: [],
          files: []
        });
      }
    }
  }

  for (const tool of toolCalls || []) {
    const toolObs = {
      type: tool.tool === 'edit' || tool.tool === 'write' ? 'implementation' : 'observation',
      title: `Tool: ${tool.tool}`,
      narrative: tool.title || `Executed ${tool.tool}`,
      timestamp: tool.timestamp ? new Date(tool.timestamp).toISOString() : new Date().toISOString(),
      facts: [`Tool: ${tool.tool}`, `Status: ${tool.status}`],
      files: []
    };

    if (tool.input) {
      if (tool.input.filePath) {
        toolObs.files.push(tool.input.filePath);
      } else if (tool.input.file_path) {
        toolObs.files.push(tool.input.file_path);
      } else if (tool.input.path) {
        toolObs.files.push(tool.input.path);
      }
    }

    observations.push(toolObs);
  }

  const recent_context = exchanges.length > 0 ? [{
    request: exchanges[0].userInput || sessionTitle || 'OpenCode session',
    learning: exchanges[exchanges.length - 1]?.assistantResponse || ''
  }] : [];

  const FILES = [];
  const seenPaths = new Set();
  
  for (const tool of toolCalls || []) {
    if ((tool.tool === 'edit' || tool.tool === 'write') && tool.input) {
      const filePath = tool.input.filePath || tool.input.file_path || tool.input.path;
      if (filePath && !seenPaths.has(filePath)) {
        seenPaths.add(filePath);
        FILES.push({
          FILE_PATH: filePath,
          DESCRIPTION: tool.title || `${tool.tool === 'write' ? 'Created' : 'Edited'} via ${tool.tool} tool`
        });
      }
    }
  }

  return {
    user_prompts,
    observations,
    recent_context,
    FILES,
    _source: 'opencode-capture',
    _sessionId: capture.sessionId,
    _capturedAt: capture.capturedAt
  };
}

/* ─────────────────────────────────────────────────────────────
   7. EXPORTS
──────────────────────────────────────────────────────────────── */

module.exports = {
  transformKeyDecision,
  buildSessionSummaryObservation,
  buildTechnicalContextObservation,
  normalizeInputData,
  validateInputData,
  transformOpenCodeCapture
};
