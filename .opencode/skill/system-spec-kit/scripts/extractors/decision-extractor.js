// ───────────────────────────────────────────────────────────────
// EXTRACTORS: DECISION EXTRACTOR
// ───────────────────────────────────────────────────────────────

'use strict';

/* ─────────────────────────────────────────────────────────────
   1. IMPORTS
────────────────────────────────────────────────────────────────*/

const { formatTimestamp } = require('../utils/message-utils');
const { validateDataStructure } = require('../utils/data-validator');
const { generateAnchorId, validateAnchorUniqueness, extractSpecNumber } = require('../lib/anchor-generator');
const { generateDecisionTree } = require('../lib/decision-tree-generator');
const simFactory = require('../lib/simulation-factory');

/* ─────────────────────────────────────────────────────────────
   2. DECISION EXTRACTION
────────────────────────────────────────────────────────────────*/

async function extract_decisions(collected_data) {
  const manual_decisions = collected_data?._manualDecisions || [];

  if (!collected_data) {
    console.log('   ⚠️  Using simulation data for decisions');
    return simFactory.createDecisionData();
  }

  // Process manual decisions from normalized input (from keyDecisions array)
  if (manual_decisions.length > 0) {
    console.log(`   📋 Processing ${manual_decisions.length} manual decision(s)`);

    const spec_number = extractSpecNumber(collected_data.SPEC_FOLDER || '000-unknown');
    const used_anchor_ids = [];

    const processed_decisions = manual_decisions.map((manual_dec, index) => {
      let decision_text;
      if (typeof manual_dec === 'string') {
        decision_text = manual_dec;
      } else if (typeof manual_dec === 'object' && manual_dec !== null) {
        decision_text = manual_dec.decision || manual_dec.title || JSON.stringify(manual_dec);
      } else {
        decision_text = `Decision ${index + 1}`;
      }

      const title_match = decision_text.match(/^(?:Decision\s*\d+:\s*)?(.+?)(?:\s*[-–—]\s*(.+))?$/i);
      const title = title_match?.[1]?.trim() || `Decision ${index + 1}`;
      const rationale = title_match?.[2]?.trim() || decision_text;

      const OPTIONS = [{
        OPTION_NUMBER: 1,
        LABEL: 'Chosen Approach',
        DESCRIPTION: title,
        HAS_PROS_CONS: false,
        PROS: [],
        CONS: []
      }];

      let anchor_id = generateAnchorId(title, 'decision', spec_number);
      anchor_id = validateAnchorUniqueness(anchor_id, used_anchor_ids);
      used_anchor_ids.push(anchor_id);

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
        DECISION_ANCHOR_ID: anchor_id,
        DECISION_IMPORTANCE: 'medium'
      };
    });

    return {
      DECISIONS: processed_decisions.map(validateDataStructure),
      DECISION_COUNT: processed_decisions.length,
      HIGH_CONFIDENCE_COUNT: processed_decisions.filter(d => d.CONFIDENCE >= 80).length,
      MEDIUM_CONFIDENCE_COUNT: processed_decisions.filter(d => d.CONFIDENCE >= 50 && d.CONFIDENCE < 80).length,
      LOW_CONFIDENCE_COUNT: processed_decisions.filter(d => d.CONFIDENCE < 50).length,
      FOLLOWUP_COUNT: 0
    };
  }

  // Process MCP data - extract decision observations
  const decision_observations = (collected_data.observations || [])
    .filter(obs => obs.type === 'decision');

  const decisions = decision_observations.map((obs, index) => {
    const narrative = obs.narrative || '';
    const facts = obs.facts || [];

    const option_matches = facts.filter(f => f.includes('Option') || f.includes('Alternative'));
    const OPTIONS = option_matches.map((opt, i) => {
      const label_match = opt.match(/Option\s+([A-Za-z0-9]+):?/)
        || opt.match(/Alternative\s+([A-Za-z0-9]+):?/)
        || opt.match(/^(\d+)\./);

      const label = label_match?.[1] || `${i + 1}`;

      let description = opt;
      if (opt.includes(':')) {
        const parts = opt.split(':');
        description = parts.slice(1).join(':').trim();
      } else if (label_match) {
        description = opt.replace(label_match[0], '').trim();
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
      const implied_description = narrative.substring(0, 100) + (narrative.length > 100 ? '...' : '');
      OPTIONS.push({
        OPTION_NUMBER: 1,
        LABEL: 'Chosen Approach',
        DESCRIPTION: implied_description,
        HAS_PROS_CONS: false,
        PROS: [],
        CONS: []
      });
    }

    const chosen_match = narrative.match(/chose|selected|decided on|went with:?\s+([^\.\n]+)/i);
    const CHOSEN = chosen_match?.[1]?.trim() || (OPTIONS.length > 0 ? OPTIONS[0].LABEL : 'N/A');

    const rationale_match = narrative.match(/because|rationale|reason:?\s+([^\.\n]+)/i);
    const RATIONALE = rationale_match?.[1]?.trim() || narrative.substring(0, 200);

    const confidence_match = narrative.match(/confidence:?\s*(\d+)%?/i);
    const CONFIDENCE = confidence_match ? parseInt(confidence_match[1]) : 75;

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

  const high_confidence = decisions.filter(d => d.CONFIDENCE >= 80).length;
  const medium_confidence = decisions.filter(d => d.CONFIDENCE >= 50 && d.CONFIDENCE < 80).length;
  const low_confidence = decisions.filter(d => d.CONFIDENCE < 50).length;
  const followup_count = decisions.reduce((count, d) => count + d.FOLLOWUP.length, 0);

  // Add anchor IDs for searchable decision retrieval
  const used_anchor_ids = [];
  const spec_number = extractSpecNumber(collected_data.SPEC_FOLDER || '000-unknown');

  const decisions_with_anchors = decisions.map(decision => {
    const category = 'decision';

    let anchor_id = generateAnchorId(
      decision.TITLE || 'Decision',
      category,
      spec_number
    );

    anchor_id = validateAnchorUniqueness(anchor_id, used_anchor_ids);
    used_anchor_ids.push(anchor_id);

    const importance = decision.CONFIDENCE >= 80 ? 'high' 
      : decision.CONFIDENCE >= 50 ? 'medium' 
      : 'low';
    
    return {
      ...decision,
      DECISION_ANCHOR_ID: anchor_id,
      DECISION_IMPORTANCE: importance
    };
  });

  return {
    DECISIONS: decisions_with_anchors.map(validateDataStructure),
    DECISION_COUNT: decisions.length,
    HIGH_CONFIDENCE_COUNT: high_confidence,
    MEDIUM_CONFIDENCE_COUNT: medium_confidence,
    LOW_CONFIDENCE_COUNT: low_confidence,
    FOLLOWUP_COUNT: followup_count
  };
}

/* ─────────────────────────────────────────────────────────────
   3. EXPORTS
────────────────────────────────────────────────────────────────*/

module.exports = {
  // Primary export (snake_case)
  extract_decisions,
  // Backward-compatible alias (camelCase)
  extractDecisions: extract_decisions
};
