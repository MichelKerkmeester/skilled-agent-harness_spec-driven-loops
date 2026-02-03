// ───────────────────────────────────────────────────────────────
// SEARCH: BM25 INDEX
// ───────────────────────────────────────────────────────────────
'use strict';

/* ─────────────────────────────────────────────────────────────
   1. CONFIGURATION

   BM25 (Best Match 25) implementation for hybrid search.
   REQ-014: BM25 Hybrid Search - FTS5 + vector combination in RRF
   REQ-028: BM25 Implementation - Pure JS with fallback to FTS5

   BM25 Formula:
   score(D, Q) = sum( IDF(qi) * (tf(qi, D) * (k1 + 1)) /
                      (tf(qi, D) + k1 * (1 - b + b * |D| / avgdl)) )

   Parameters:
   - tf(qi, D) = term frequency of qi in document D
   - |D| = document length, avgdl = average document length
   - k1 = 1.2 (term frequency saturation)
   - b = 0.75 (document length normalization)
   - IDF(qi) = log((N - n(qi) + 0.5) / (n(qi) + 0.5) + 1)
────────────────────────────────────────────────────────────────*/

// BM25 hyperparameters: k1=term frequency saturation, b=document length normalization
const DEFAULT_K1 = 1.2;
const DEFAULT_B = 0.75;

const ENABLE_BM25 = process.env.ENABLE_BM25 !== 'false';
const MIN_DOC_LENGTH = 10;

const STOPWORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
  'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'or', 'that',
  'the', 'to', 'was', 'were', 'will', 'with', 'this', 'but', 'they',
  'have', 'had', 'what', 'when', 'where', 'who', 'which', 'why', 'how'
]);

/* ─────────────────────────────────────────────────────────────
   2. TOKENIZATION
────────────────────────────────────────────────────────────────*/

function simple_stem(word) {
  if (word.length < 4) return word;

  let stemmed = word
    .replace(/ing$/, '')
    .replace(/ed$/, '')
    .replace(/ies$/, 'i')
    .replace(/es$/, '')
    .replace(/s$/, '')
    .replace(/ment$/, '')
    .replace(/ness$/, '')
    .replace(/able$/, '')
    .replace(/ible$/, '')
    .replace(/tion$/, 't')
    .replace(/sion$/, 's')
    .replace(/ally$/, '')
    .replace(/ful$/, '')
    .replace(/less$/, '')
    .replace(/ive$/, '')
    .replace(/ize$/, '')
    .replace(/ise$/, '');

  return stemmed.length >= 2 ? stemmed : word;
}

function tokenize(text) {
  if (!text || typeof text !== 'string') return [];

  return text
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, ' ')  // Keep underscores for code identifiers
    .split(/\s+/)
    .filter(word => word.length >= 2 && !STOPWORDS.has(word))
    .map(simple_stem);
}

function get_term_frequencies(tokens) {
  const tf = new Map();
  for (const token of tokens) {
    tf.set(token, (tf.get(token) || 0) + 1);
  }
  return tf;
}

/* ─────────────────────────────────────────────────────────────
   3. BM25 INDEX CLASS
────────────────────────────────────────────────────────────────*/

class BM25Index {
  constructor(options = {}) {
    this.k1 = options.k1 ?? DEFAULT_K1;
    this.b = options.b ?? DEFAULT_B;

    this.documents = new Map();
    this.inverted_index = new Map();
    this.total_docs = 0;
    this.total_length = 0;
    this.avg_doc_length = 0;
    this.doc_frequencies = new Map();
  }

  add_document(id, content, metadata = {}) {
    if (!id || !content) return false;

    const tokens = tokenize(content);
    const length = tokens.length;

    if (length < MIN_DOC_LENGTH) return false;

    if (this.documents.has(id)) {
      this.remove_document(id);
    }

    const term_freqs = get_term_frequencies(tokens);
    this.documents.set(id, {
      tokens,
      length,
      term_freqs,
      metadata,
    });

    for (const term of term_freqs.keys()) {
      if (!this.inverted_index.has(term)) {
        this.inverted_index.set(term, new Set());
      }
      this.inverted_index.get(term).add(id);
      this.doc_frequencies.set(term, (this.doc_frequencies.get(term) || 0) + 1);
    }

    this.total_docs++;
    this.total_length += length;
    this.avg_doc_length = this.total_length / this.total_docs;

    return true;
  }

  remove_document(id) {
    const doc = this.documents.get(id);
    if (!doc) return false;

    for (const term of doc.term_freqs.keys()) {
      const posting_list = this.inverted_index.get(term);
      if (posting_list) {
        posting_list.delete(id);
        if (posting_list.size === 0) {
          this.inverted_index.delete(term);
          this.doc_frequencies.delete(term);
        } else {
          this.doc_frequencies.set(term, this.doc_frequencies.get(term) - 1);
        }
      }
    }

    this.total_docs--;
    this.total_length -= doc.length;
    this.avg_doc_length = this.total_docs > 0 ? this.total_length / this.total_docs : 0;

    this.documents.delete(id);
    return true;
  }

  // BM25 IDF formula: +1 smoothing prevents negative values for high-frequency terms
  calculate_idf(term) {
    const n = this.doc_frequencies.get(term) || 0;
    const N = this.total_docs;
    return Math.log((N - n + 0.5) / (n + 0.5) + 1);
  }

  calculate_score(doc_id, query_terms) {
    const doc = this.documents.get(doc_id);
    if (!doc) return 0;

    let score = 0;
    const { term_freqs, length } = doc;

    for (const term of query_terms) {
      const tf = term_freqs.get(term) || 0;
      if (tf === 0) continue;

      const idf = this.calculate_idf(term);

      const numerator = tf * (this.k1 + 1);
      const denominator = tf + this.k1 * (1 - this.b + this.b * (length / this.avg_doc_length));
      score += idf * (numerator / denominator);
    }

    return score;
  }

  search(query, options = {}) {
    const { limit = 10, spec_folder = null } = options;

    if (!ENABLE_BM25) {
      return [];
    }

    const query_terms = tokenize(query);
    if (query_terms.length === 0) return [];

    const candidates = new Set();
    for (const term of query_terms) {
      const posting_list = this.inverted_index.get(term);
      if (posting_list) {
        for (const doc_id of posting_list) {
          if (spec_folder) {
            const doc = this.documents.get(doc_id);
            if (doc?.metadata?.spec_folder !== spec_folder) continue;
          }
          candidates.add(doc_id);
        }
      }
    }

    if (candidates.size === 0) return [];

    const scored = [];
    for (const doc_id of candidates) {
      const bm25_score = this.calculate_score(doc_id, query_terms);
      const doc = this.documents.get(doc_id);

      scored.push({
        id: doc_id,
        bm25_score,
        ...doc.metadata,
      });
    }

    return scored
      .sort((a, b) => b.bm25_score - a.bm25_score)
      .slice(0, limit);
  }

  get_stats() {
    return {
      total_documents: this.total_docs,
      total_terms: this.inverted_index.size,
      avg_doc_length: this.avg_doc_length,
      k1: this.k1,
      b: this.b,
      enabled: ENABLE_BM25,
    };
  }

  clear() {
    this.documents.clear();
    this.inverted_index.clear();
    this.doc_frequencies.clear();
    this.total_docs = 0;
    this.total_length = 0;
    this.avg_doc_length = 0;
  }

  add_documents(documents) {
    let indexed = 0;
    let skipped = 0;

    for (const doc of documents) {
      if (this.add_document(doc.id, doc.content, doc.metadata)) {
        indexed++;
      } else {
        skipped++;
      }
    }

    return { indexed, skipped };
  }
}

/* ─────────────────────────────────────────────────────────────
   4. SINGLETON INSTANCE
────────────────────────────────────────────────────────────────*/

let global_index = null;

function get_index(options = {}) {
  if (!global_index) {
    global_index = new BM25Index(options);
  }
  return global_index;
}

function reset_index() {
  if (global_index) {
    global_index.clear();
  }
  global_index = null;
}

function is_bm25_enabled() {
  return ENABLE_BM25;
}

/* ─────────────────────────────────────────────────────────────
   5. EXPORTS
────────────────────────────────────────────────────────────────*/

module.exports = {
  BM25Index,
  get_index,
  reset_index,
  tokenize,
  simple_stem,
  get_term_frequencies,
  is_bm25_enabled,
  DEFAULT_K1,
  DEFAULT_B,
  getIndex: get_index,
  resetIndex: reset_index,
  isBm25Enabled: is_bm25_enabled,
};
