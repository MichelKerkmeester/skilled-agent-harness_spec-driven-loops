// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Packed BM25F Lexical Shadow Lane
// ───────────────────────────────────────────────────────────────

import type { AdvisorProjection, SkillProjection } from '../types.js';
import { tokenize } from '../text.js';

export const ADVISOR_BM25_LEXICAL_SHADOW_LANE_ID = 'bm25_lexical_shadow' as const;

const BM25_K1 = 1.2;
const BM25_B = 0.75;
const DEFAULT_LIMIT = 20;

// Logistic squashing midpoint for rawScore -> score in [0,1). The fixed value
// is query-length-blind: a longer query accumulates more rawScore, so a single
// constant over-saturates long queries. The query-length-bucketed midpoint
// (opt-in, telemetry-only) raises the midpoint as the query grows so the
// squashed score stays comparable across query lengths.
export const ADVISOR_BM25_QUERY_LENGTH_CALIBRATION_FLAG = 'SPECKIT_ADVISOR_BM25_QUERY_LENGTH_CALIBRATION';
const TRUE_FLAG_VALUES = new Set(['1', 'true', 'yes', 'on', 'enabled']);
export const BM25_DEFAULT_LOGISTIC_MIDPOINT = 4;
const BM25_SHORT_QUERY_MIDPOINT = 2;
const BM25_LONG_QUERY_MIDPOINT = 8;
const BM25_LONG_QUERY_TERM_FLOOR = 5;

function isQueryLengthCalibrationEnabled(): boolean {
  const value = process.env[ADVISOR_BM25_QUERY_LENGTH_CALIBRATION_FLAG]?.trim().toLowerCase();
  return value ? TRUE_FLAG_VALUES.has(value) : false;
}

/** Resolve the logistic midpoint for a query of `queryTermCount` unique terms.
 * Disabled (default) or a degenerate zero-length query returns the fixed
 * midpoint, so the squashed score is byte-identical to the pre-calibration lane. */
export function resolveBm25LogisticMidpoint(queryTermCount: number, enabled: boolean): number {
  if (!enabled || queryTermCount <= 0) {
    return BM25_DEFAULT_LOGISTIC_MIDPOINT;
  }
  if (queryTermCount === 1) {
    return BM25_SHORT_QUERY_MIDPOINT;
  }
  if (queryTermCount >= BM25_LONG_QUERY_TERM_FLOOR) {
    return BM25_LONG_QUERY_MIDPOINT;
  }
  return BM25_DEFAULT_LOGISTIC_MIDPOINT;
}

const BM25F_FIELD_NAMES = [
  'name',
  'keywords',
  'domains',
  'intentSignals',
  'derivedTriggers',
  'description',
] as const;

export type AdvisorBm25FieldName = typeof BM25F_FIELD_NAMES[number];
export type AdvisorBm25FieldWeights = Record<AdvisorBm25FieldName, number>;

export const ADVISOR_BM25_FIELD_WEIGHTS: AdvisorBm25FieldWeights = {
  name: 4.0,
  keywords: 3.0,
  domains: 2.2,
  intentSignals: 2.4,
  derivedTriggers: 1.8,
  description: 1.0,
};

export interface AdvisorBm25SearchOptions {
  readonly fieldWeights?: Partial<AdvisorBm25FieldWeights>;
  readonly limit?: number;
  /** Opt-in override for the query-length-bucketed logistic midpoint; defaults
   * to the env flag. Telemetry-only — the lane stays shadow-only either way. */
  readonly queryLengthCalibration?: boolean;
}

export interface AdvisorBm25Match {
  readonly skillId: string;
  readonly lane: typeof ADVISOR_BM25_LEXICAL_SHADOW_LANE_ID;
  readonly score: number;
  readonly rawScore: number;
  readonly evidence: readonly string[];
  readonly shadowOnly: true;
}

export interface AdvisorBm25FootprintStats {
  readonly documentCount: number;
  readonly termCount: number;
  readonly postingCount: number;
  readonly typedArrayBytes: number;
  readonly mutablePostingCount: number;
}

interface FieldTermFrequency {
  total: number;
  fields: Record<AdvisorBm25FieldName, number>;
}

interface PackedSkillDocument {
  numericId: number;
  skillId: string;
  length: number;
  terms: readonly string[];
}

interface PackedPostingMutable {
  docIds: number[];
  totalTfs: number[];
  nameTfs: number[];
  keywordTfs: number[];
  domainTfs: number[];
  intentSignalTfs: number[];
  derivedTriggerTfs: number[];
  descriptionTfs: number[];
}

interface PackedPostingList {
  docIds: Uint32Array;
  totalTfs: Uint32Array;
  nameTfs: Uint32Array;
  keywordTfs: Uint32Array;
  domainTfs: Uint32Array;
  intentSignalTfs: Uint32Array;
  derivedTriggerTfs: Uint32Array;
  descriptionTfs: Uint32Array;
}

function emptyFieldFrequency(): FieldTermFrequency {
  return {
    total: 0,
    fields: {
      name: 0,
      keywords: 0,
      domains: 0,
      intentSignals: 0,
      derivedTriggers: 0,
      description: 0,
    },
  };
}

function resolveFieldWeights(overrides: Partial<AdvisorBm25FieldWeights> = {}): AdvisorBm25FieldWeights {
  return {
    name: overrides.name ?? ADVISOR_BM25_FIELD_WEIGHTS.name,
    keywords: overrides.keywords ?? ADVISOR_BM25_FIELD_WEIGHTS.keywords,
    domains: overrides.domains ?? ADVISOR_BM25_FIELD_WEIGHTS.domains,
    intentSignals: overrides.intentSignals ?? ADVISOR_BM25_FIELD_WEIGHTS.intentSignals,
    derivedTriggers: overrides.derivedTriggers ?? ADVISOR_BM25_FIELD_WEIGHTS.derivedTriggers,
    description: overrides.description ?? ADVISOR_BM25_FIELD_WEIGHTS.description,
  };
}

function skillFields(skill: SkillProjection): Record<AdvisorBm25FieldName, readonly string[]> {
  return {
    name: [skill.id.replace(/-/g, ' '), skill.name],
    keywords: skill.keywords,
    domains: skill.domains,
    intentSignals: skill.intentSignals,
    derivedTriggers: skill.derivedTriggers,
    description: [skill.description],
  };
}

function fieldTermFrequencies(skill: SkillProjection): Map<string, FieldTermFrequency> {
  const frequencies = new Map<string, FieldTermFrequency>();
  for (const fieldName of BM25F_FIELD_NAMES) {
    for (const value of skillFields(skill)[fieldName]) {
      for (const token of tokenize(value)) {
        let frequency = frequencies.get(token);
        if (!frequency) {
          frequency = emptyFieldFrequency();
          frequencies.set(token, frequency);
        }
        frequency.total += 1;
        frequency.fields[fieldName] += 1;
      }
    }
  }
  return frequencies;
}

function weightedFrequency(
  postings: PackedPostingList,
  index: number,
  weights: AdvisorBm25FieldWeights,
): number {
  return postings.nameTfs[index] * weights.name
    + postings.keywordTfs[index] * weights.keywords
    + postings.domainTfs[index] * weights.domains
    + postings.intentSignalTfs[index] * weights.intentSignals
    + postings.derivedTriggerTfs[index] * weights.derivedTriggers
    + postings.descriptionTfs[index] * weights.description;
}

function topWeightedFields(
  postings: PackedPostingList,
  index: number,
  weights: AdvisorBm25FieldWeights,
): AdvisorBm25FieldName[] {
  return [
    { field: 'name' as const, value: postings.nameTfs[index] * weights.name },
    { field: 'keywords' as const, value: postings.keywordTfs[index] * weights.keywords },
    { field: 'domains' as const, value: postings.domainTfs[index] * weights.domains },
    { field: 'intentSignals' as const, value: postings.intentSignalTfs[index] * weights.intentSignals },
    { field: 'derivedTriggers' as const, value: postings.derivedTriggerTfs[index] * weights.derivedTriggers },
    { field: 'description' as const, value: postings.descriptionTfs[index] * weights.description },
  ]
    .filter((entry) => entry.value > 0)
    .sort((left, right) => right.value - left.value)
    .map((entry) => entry.field)
    .slice(0, 3);
}

export class AdvisorPackedBm25Index {
  private readonly skillIds: string[] = [];
  private readonly skillNumbersById = new Map<string, number>();
  private readonly documents = new Map<string, PackedSkillDocument>();
  private readonly documentFreq = new Map<string, number>();
  private readonly mutablePostings = new Map<string, PackedPostingMutable>();
  private readonly packedPostings = new Map<string, PackedPostingList>();
  private totalDocumentLength = 0;

  constructor(skills: readonly SkillProjection[] = []) {
    for (const skill of skills) {
      this.addSkill(skill);
    }
    this.finalize();
  }

  addSkill(skill: SkillProjection): void {
    const frequencies = fieldTermFrequencies(skill);
    const length = Array.from(frequencies.values()).reduce((total, frequency) => total + frequency.total, 0);
    if (length === 0) return;

    const numericId = this.nextNumericId(skill.id);
    const terms = [...frequencies.keys()].sort();
    this.documents.set(skill.id, { numericId, skillId: skill.id, length, terms });
    this.totalDocumentLength += length;

    for (const term of terms) {
      const frequency = frequencies.get(term);
      if (!frequency) continue;
      this.documentFreq.set(term, (this.documentFreq.get(term) ?? 0) + 1);
      const postings = this.ensureMutablePostings(term);
      postings.docIds.push(numericId);
      postings.totalTfs.push(frequency.total);
      postings.nameTfs.push(frequency.fields.name);
      postings.keywordTfs.push(frequency.fields.keywords);
      postings.domainTfs.push(frequency.fields.domains);
      postings.intentSignalTfs.push(frequency.fields.intentSignals);
      postings.derivedTriggerTfs.push(frequency.fields.derivedTriggers);
      postings.descriptionTfs.push(frequency.fields.description);
    }
  }

  finalize(): void {
    for (const [term, postings] of this.mutablePostings.entries()) {
      const order = postings.docIds.map((docId, index) => ({ docId, index }))
        .sort((left, right) => left.docId - right.docId);
      this.packedPostings.set(term, {
        docIds: Uint32Array.from(order.map((entry) => entry.docId)),
        totalTfs: Uint32Array.from(order.map((entry) => postings.totalTfs[entry.index])),
        nameTfs: Uint32Array.from(order.map((entry) => postings.nameTfs[entry.index])),
        keywordTfs: Uint32Array.from(order.map((entry) => postings.keywordTfs[entry.index])),
        domainTfs: Uint32Array.from(order.map((entry) => postings.domainTfs[entry.index])),
        intentSignalTfs: Uint32Array.from(order.map((entry) => postings.intentSignalTfs[entry.index])),
        derivedTriggerTfs: Uint32Array.from(order.map((entry) => postings.derivedTriggerTfs[entry.index])),
        descriptionTfs: Uint32Array.from(order.map((entry) => postings.descriptionTfs[entry.index])),
      });
    }
    this.mutablePostings.clear();
  }

  search(prompt: string, options: AdvisorBm25SearchOptions = {}): AdvisorBm25Match[] {
    const queryTerms = [...new Set(tokenize(prompt))];
    if (queryTerms.length === 0 || this.documents.size === 0) return [];

    const weights = resolveFieldWeights(options.fieldWeights);
    const scores = new Map<number, { rawScore: number; evidence: string[] }>();
    const averageLength = Math.max(this.totalDocumentLength / this.documents.size, 1);
    const logisticMidpoint = resolveBm25LogisticMidpoint(
      queryTerms.length,
      options.queryLengthCalibration ?? isQueryLengthCalibrationEnabled(),
    );

    for (const term of queryTerms) {
      const postings = this.packedPostings.get(term);
      if (!postings) continue;
      const idf = this.idf(term);
      for (let i = 0; i < postings.docIds.length; i += 1) {
        const numericId = postings.docIds[i];
        const skillId = this.skillIds[numericId];
        const doc = skillId ? this.documents.get(skillId) : undefined;
        if (!doc) continue;
        const weightedTf = weightedFrequency(postings, i, weights);
        if (weightedTf <= 0) continue;

        const termScore = idf * ((weightedTf * (BM25_K1 + 1))
          / (weightedTf + BM25_K1 * (1 - BM25_B + BM25_B * (doc.length / averageLength))));
        const existing = scores.get(numericId) ?? { rawScore: 0, evidence: [] };
        existing.rawScore += termScore;
        if (existing.evidence.length < 6) {
          existing.evidence.push(`bm25:${term}`);
          for (const field of topWeightedFields(postings, i, weights)) {
            if (existing.evidence.length >= 6) break;
            existing.evidence.push(`field:${field}`);
          }
        }
        scores.set(numericId, existing);
      }
    }

    return [...scores.entries()]
      .map(([numericId, result]) => ({
        skillId: this.skillIds[numericId],
        lane: ADVISOR_BM25_LEXICAL_SHADOW_LANE_ID,
        rawScore: Number(result.rawScore.toFixed(6)),
        score: Number((result.rawScore / (result.rawScore + logisticMidpoint)).toFixed(6)),
        evidence: result.evidence,
        shadowOnly: true,
      } satisfies AdvisorBm25Match))
      .filter((match) => typeof match.skillId === 'string' && match.score > 0)
      .sort((left, right) => right.score - left.score || left.skillId.localeCompare(right.skillId))
      .slice(0, options.limit ?? DEFAULT_LIMIT);
  }

  getFootprintStats(): AdvisorBm25FootprintStats {
    let postingCount = 0;
    let typedArrayBytes = 0;
    for (const postings of this.packedPostings.values()) {
      postingCount += postings.docIds.length;
      typedArrayBytes += postings.docIds.byteLength
        + postings.totalTfs.byteLength
        + postings.nameTfs.byteLength
        + postings.keywordTfs.byteLength
        + postings.domainTfs.byteLength
        + postings.intentSignalTfs.byteLength
        + postings.derivedTriggerTfs.byteLength
        + postings.descriptionTfs.byteLength;
    }
    return {
      documentCount: this.documents.size,
      termCount: this.packedPostings.size,
      postingCount,
      typedArrayBytes,
      mutablePostingCount: this.mutablePostings.size,
    };
  }

  private nextNumericId(skillId: string): number {
    const existing = this.skillNumbersById.get(skillId);
    if (existing !== undefined) return existing;
    const numericId = this.skillIds.length;
    this.skillIds.push(skillId);
    this.skillNumbersById.set(skillId, numericId);
    return numericId;
  }

  private ensureMutablePostings(term: string): PackedPostingMutable {
    const existing = this.mutablePostings.get(term);
    if (existing) return existing;
    const postings: PackedPostingMutable = {
      docIds: [],
      totalTfs: [],
      nameTfs: [],
      keywordTfs: [],
      domainTfs: [],
      intentSignalTfs: [],
      derivedTriggerTfs: [],
      descriptionTfs: [],
    };
    this.mutablePostings.set(term, postings);
    return postings;
  }

  private idf(term: string): number {
    const docFreq = this.documentFreq.get(term) ?? 0;
    return Math.log(1 + (this.documents.size - docFreq + 0.5) / (docFreq + 0.5));
  }
}

export function buildAdvisorBm25Index(projection: AdvisorProjection): AdvisorPackedBm25Index {
  return new AdvisorPackedBm25Index(projection.skills);
}

export function scoreBm25LexicalShadowLane(
  prompt: string,
  projection: AdvisorProjection,
  options: AdvisorBm25SearchOptions = {},
): AdvisorBm25Match[] {
  return buildAdvisorBm25Index(projection).search(prompt, options);
}
