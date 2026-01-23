'use strict';

/* ─────────────────────────────────────────────────────────────
   1. IMPORTS
──────────────────────────────────────────────────────────────── */

const { formatTimestamp } = require('../utils/message-utils');
const { validateDataStructure } = require('../utils/data-validator');
const { generateAnchorId, validateAnchorUniqueness, extractSpecNumber } = require('../lib/anchor-generator');
const { generateDecisionTree } = require('../lib/decision-tree-generator');
const simFactory = require('../lib/simulation-factory');

/* ─────────────────────────────────────────────────────────────
   2. DECISION EXTRACTION
──────────────────────────────────────────────────────────────── */

async function extractDecisions(collectedData) {
  const manualDecisions = collectedData?._manualDecisions || [];
  
  if (!collectedData) {
    console.log('   ⚠️  Using simulation data for decisions');
    return simFactory.createDecisionData();
  }

  // Process manual decisions from normalized input (from keyDecisions array)
  if (manualDecisions.length > 0) {
    console.log(`   📋 Processing ${manualDecisions.length} manual decision(s)`);
    
    const specNumber = extractSpecNumber(collectedData.SPEC_FOLDER || '000-unknown');
    const usedAnchorIds = [];
    
    const processedDecisions = manualDecisions.map((manualDec, index) => {
      let decisionText;
      if (typeof manualDec === 'string') {
        decisionText = manualDec;
      } else if (typeof manualDec === 'object' && manualDec !== null) {
        decisionText = manualDec.decision || manualDec.title || JSON.stringify(manualDec);
      } else {
        decisionText = `Decision ${index + 1}`;
      }
      
      const titleMatch = decisionText.match(/^(?:Decision\s*\d+:\s*)?(.+?)(?:\s*[-–—]\s*(.+))?$/i);
      const title = titleMatch?.[1]?.trim() || `Decision ${index + 1}`;
      const rationale = titleMatch?.[2]?.trim() || decisionText;
      
      const OPTIONS = [{
        OPTION_NUMBER: 1,
        LABEL: 'Chosen Approach',
        DESCRIPTION: title,
        HAS_PROS_CONS: false,
        PROS: [],
        CONS: []
      }];
      
      let anchorId = generateAnchorId(title, 'decision', specNumber);
      anchorId = validateAnchorUniqueness(anchorId, usedAnchorIds);
      usedAnchorIds.push(anchorId);
      
      return {
        INDEX: index + 1,
        TITLE: title,
        CONTEXT: rationale,
        TIMESTAMP: formatTimestamp(),
        OPTIONS,
        CHOSEN: 'Chosen Approach',
        RATIONALE: rationale,
        HAS_PROS: false,
        PROS: [],
        HAS_CONS: false,
        CONS: [],
        CONFIDENCE: 80,
        HAS_EVIDENCE: false,
        EVIDENCE: [],
        HAS_CAVEATS: false,
        CAVEATS: [],
        HAS_FOLLOWUP: false,
        FOLLOWUP: [],
        DECISION_TREE: '',
        HAS_DECISION_TREE: false,
        DECISION_ANCHOR_ID: anchorId,
        DECISION_IMPORTANCE: 'medium'
      };
    });
    
    return {
      DECISIONS: processedDecisions.map(validateDataStructure),
      DECISION_COUNT: processedDecisions.length,
      HIGH_CONFIDENCE_COUNT: processedDecisions.filter(d => d.CONFIDENCE >= 80).length,
      MEDIUM_CONFIDENCE_COUNT: processedDecisions.filter(d => d.CONFIDENCE >= 50 && d.CONFIDENCE < 80).length,
      LOW_CONFIDENCE_COUNT: processedDecisions.filter(d => d.CONFIDENCE < 50).length,
      FOLLOWUP_COUNT: 0
    };
  }

  // Process MCP data - extract decision observations
  const decisionObservations = (collectedData.observations || [])
    .filter(obs => obs.type === 'decision');

  const decisions = decisionObservations.map((obs, index) => {
    const narrative = obs.narrative || '';
    const facts = obs.facts || [];

    const optionMatches = facts.filter(f => f.includes('Option') || f.includes('Alternative'));
    const OPTIONS = optionMatches.map((opt, i) => {
      const labelMatch = opt.match(/Option\s+([A-Za-z0-9]+):?/)
        || opt.match(/Alternative\s+([A-Za-z0-9]+):?/)
        || opt.match(/^(\d+)\./);

      const label = labelMatch?.[1] || `${i + 1}`;

      let description = opt;
      if (opt.includes(':')) {
        const parts = opt.split(':');
        description = parts.slice(1).join(':').trim();
      } else if (labelMatch) {
        description = opt.replace(labelMatch[0], '').trim();
      }

      if (!description || description.length < 3) {
        description = opt;
      }

      return {
        OPTION_NUMBER: i + 1,
        LABEL: `Option ${label}`,
        DESCRIPTION: description,
        HAS_PROS_CONS: false,
        PROS: [],
        CONS: []
      };
    });

    // Ensure at least one option for template rendering
    if (OPTIONS.length === 0 && narrative.trim()) {
      const impliedDescription = narrative.substring(0, 100) + (narrative.length > 100 ? '...' : '');
      OPTIONS.push({
        OPTION_NUMBER: 1,
        LABEL: 'Chosen Approach',
        DESCRIPTION: impliedDescription,
        HAS_PROS_CONS: false,
        PROS: [],
        CONS: []
      });
    }

    const chosenMatch = narrative.match(/chose|selected|decided on|went with:?\s+([^\.\n]+)/i);
    const CHOSEN = chosenMatch?.[1]?.trim() || (OPTIONS.length > 0 ? OPTIONS[0].LABEL : 'N/A');

    const rationaleMatch = narrative.match(/because|rationale|reason:?\s+([^\.\n]+)/i);
    const RATIONALE = rationaleMatch?.[1]?.trim() || narrative.substring(0, 200);

    const confidenceMatch = narrative.match(/confidence:?\s*(\d+)%?/i);
    const CONFIDENCE = confidenceMatch ? parseInt(confidenceMatch[1]) : 75;

    // Use word boundaries to avoid "disadvantage" matching "advantage"
    const PROS = facts
      .filter(f => {
        const lower = f.toLowerCase();
        return lower.match(/\bpro:\s/) || lower.match(/\badvantage:\s/);
      })
      .map(p => {
        const parts = p.split(':');
        const text = parts.length > 1 ? parts.slice(1).join(':').trim() : p;
        return { PRO: text };
      });

    const CONS = facts
      .filter(f => {
        const lower = f.toLowerCase();
        return lower.match(/\bcon:\s/) || lower.match(/\bdisadvantage:\s/);
      })
      .map(c => {
        const parts = c.split(':');
        const text = parts.length > 1 ? parts.slice(1).join(':').trim() : c;
        return { CON: text };
      });

    const FOLLOWUP = facts
      .filter(f => {
        const lower = f.toLowerCase();
        return lower.match(/\bfollow-?up:\s/) || lower.match(/\btodo:\s/) || lower.match(/\bnext step:\s/);
      })
      .map(f => {
        const parts = f.split(':');
        const text = parts.length > 1 ? parts.slice(1).join(':').trim() : f;
        return { FOLLOWUP_ITEM: text };
      });

    const CAVEATS = facts
      .filter(f => {
        const lower = f.toLowerCase();
        return lower.match(/\bcaveat:\s/) || lower.match(/\bwarning:\s/) || lower.match(/\blimitation:\s/);
      })
      .map(c => {
        const parts = c.split(':');
        const text = parts.length > 1 ? parts.slice(1).join(':').trim() : c;
        return { CAVEAT_ITEM: text };
      });

    const EVIDENCE = obs.files
      ? obs.files.map(f => ({ EVIDENCE_ITEM: f }))
      : facts
          .filter(f => {
            const lower = f.toLowerCase();
            return lower.match(/\bevidence:\s/) || lower.match(/\bsee:\s/) || lower.match(/\breference:\s/);
          })
          .map(e => {
            const parts = e.split(':');
            const text = parts.length > 1 ? parts.slice(1).join(':').trim() : e;
            return { EVIDENCE_ITEM: text };
          });

    const decision = {
      INDEX: index + 1,
      TITLE: obs.title || `Decision ${index + 1}`,
      CONTEXT: narrative,
      TIMESTAMP: obs.timestamp || new Date().toISOString(),
      OPTIONS,
      CHOSEN,
      RATIONALE,
      HAS_PROS: PROS.length > 0,
      PROS,
      HAS_CONS: CONS.length > 0,
      CONS,
      CONFIDENCE,
      HAS_EVIDENCE: EVIDENCE.length > 0,
      EVIDENCE,
      HAS_CAVEATS: CAVEATS.length > 0,
      CAVEATS,
      HAS_FOLLOWUP: FOLLOWUP.length > 0,
      FOLLOWUP
    };

    decision.DECISION_TREE = OPTIONS.length > 0 ? generateDecisionTree(decision) : '';
    decision.HAS_DECISION_TREE = decision.DECISION_TREE.length > 0;

    return decision;
  });

  const highConfidence = decisions.filter(d => d.CONFIDENCE >= 80).length;
  const mediumConfidence = decisions.filter(d => d.CONFIDENCE >= 50 && d.CONFIDENCE < 80).length;
  const lowConfidence = decisions.filter(d => d.CONFIDENCE < 50).length;
  const followupCount = decisions.reduce((count, d) => count + d.FOLLOWUP.length, 0);

  // Add anchor IDs for searchable decision retrieval
  const usedAnchorIds = [];
  const specNumber = extractSpecNumber(collectedData.SPEC_FOLDER || '000-unknown');

  const decisionsWithAnchors = decisions.map(decision => {
    const category = 'decision';

    let anchorId = generateAnchorId(
      decision.TITLE || 'Decision',
      category,
      specNumber
    );

    anchorId = validateAnchorUniqueness(anchorId, usedAnchorIds);
    usedAnchorIds.push(anchorId);

    const importance = decision.CONFIDENCE >= 80 ? 'high' 
      : decision.CONFIDENCE >= 50 ? 'medium' 
      : 'low';
    
    return {
      ...decision,
      DECISION_ANCHOR_ID: anchorId,
      DECISION_IMPORTANCE: importance
    };
  });

  return {
    DECISIONS: decisionsWithAnchors.map(validateDataStructure),
    DECISION_COUNT: decisions.length,
    HIGH_CONFIDENCE_COUNT: highConfidence,
    MEDIUM_CONFIDENCE_COUNT: mediumConfidence,
    LOW_CONFIDENCE_COUNT: lowConfidence,
    FOLLOWUP_COUNT: followupCount
  };
}

/* ─────────────────────────────────────────────────────────────
   3. EXPORTS
──────────────────────────────────────────────────────────────── */

module.exports = {
  extractDecisions
};
