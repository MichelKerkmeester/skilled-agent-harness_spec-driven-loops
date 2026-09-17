// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Compact Candidate Cards                                                 ║
// ╚══════════════════════════════════════════════════════════════════════════╝

// ─────────────────────────────────────────────────────────────────────────────
// 1. CONSTANTS AND HELPERS
// ─────────────────────────────────────────────────────────────────────────────

export const MAX_CANDIDATE_CARDS = 5;
export const DEFAULT_CARD_BYTES = 2_048;

const MIN_CARD_BYTES = 768;

function byteLength(value) {
  return Buffer.byteLength(JSON.stringify(value), 'utf8');
}

function trimText(value, maxLength) {
  const text = String(value ?? '');
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).trimEnd()}…`;
}

function compactCard(card, maxBytes) {
  if (byteLength(card) <= maxBytes) return card;
  const compact = {
    ...card,
    thesis: trimText(card.thesis, 160),
    capabilities: card.capabilities.slice(0, 8),
    availableSections: card.availableSections.slice(0, 10),
    tokenAxes: card.tokenAxes.slice(0, 8),
    warnings: [...card.warnings, 'card-truncated'],
  };
  if (byteLength(compact) <= maxBytes) return compact;
  compact.thesis = trimText(compact.thesis, 96);
  compact.availableSections = compact.availableSections.slice(0, 5);
  compact.provenance = {
    status: compact.provenance.status,
    sourceUrl: compact.provenance.sourceUrl,
    originalUrl: compact.provenance.originalUrl,
    uuid: compact.provenance.uuid,
    licenseStatus: compact.provenance.licenseStatus,
    rightsKnown: compact.provenance.rightsKnown,
    evidenceScope: compact.provenance.evidenceScope,
  };
  if (byteLength(compact) <= maxBytes) return compact;
  compact.capabilities = compact.capabilities.slice(0, 4);
  compact.availableSections = compact.availableSections.slice(0, 3);
  compact.tokenAxes = compact.tokenAxes.slice(0, 4);
  if (byteLength(compact) <= maxBytes) return compact;
  const error = new Error(`Candidate card cannot fit within ${maxBytes} bytes.`);
  error.code = 'card-too-large';
  throw error;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. PUBLIC API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Convert ranked eligible records into bounded, deterministic candidate cards.
 *
 * @param {Object[]} ranked - Ranked records with score breakdowns.
 * @param {string} generationHash - Current corpus generation.
 * @param {Object} [request] - Card count and byte limits.
 * @returns {Object[]} At most five compact cards.
 */
export function assembleCandidateCards(ranked, generationHash, request = {}) {
  const limit = Math.min(
    MAX_CANDIDATE_CARDS,
    Math.max(0, Number.isInteger(request.limit) ? request.limit : MAX_CANDIDATE_CARDS),
  );
  const requestedBytes = Number.isInteger(request.maxCardBytes)
    ? request.maxCardBytes
    : DEFAULT_CARD_BYTES;
  if (requestedBytes < MIN_CARD_BYTES) {
    const error = new Error(`maxCardBytes must be at least ${MIN_CARD_BYTES}.`);
    error.code = 'card-byte-cap-too-small';
    throw error;
  }
  const maxCardBytes = Math.min(DEFAULT_CARD_BYTES, requestedBytes);
  return ranked.slice(0, limit).map(({ style, score }) => compactCard({
    id: style.id,
    title: style.title,
    thesis: style.thesis,
    generationHash,
    contentHash: style.contentHash,
    capabilities: style.capabilities,
    availableSections: style.availableSections,
    tokenAxes: style.tokenAxes,
    provenance: style.provenance,
    score,
    estimatedHydrationBytes: style.estimatedHydrationBytes,
    warnings: style.provenance.licenseStatus === 'unknown' ? ['rights-unknown'] : [],
  }, maxCardBytes));
}

/**
 * Measure the serialized size used by the candidate-card cap.
 *
 * @param {Object} card - Candidate card.
 * @returns {number} UTF-8 JSON byte length.
 */
export function candidateCardBytes(card) {
  return byteLength(card);
}
