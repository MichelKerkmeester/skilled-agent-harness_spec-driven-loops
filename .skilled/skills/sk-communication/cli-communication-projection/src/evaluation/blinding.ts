// ───────────────────────────────────────────────────────────────────
// MODULE: Masked Review Packets
// ───────────────────────────────────────────────────────────────────

import { createSha256Digest } from '../contracts/exact-original.js';
import { deepFreeze } from '../fidelity/freeze.js';

import type { RuntimeId } from '../contracts/common.js';
import type { PresentationTier } from './preregistration.js';

/** Trusted comparison metadata that must never reach a reviewer packet. */
export interface BlindComparisonInput {
  readonly comparisonId: string;
  readonly stratumId: string;
  readonly providerId: string;
  readonly modelId: string;
  readonly promptProfileId: string;
  readonly runtimeId: RuntimeId;
  readonly presentationTier: PresentationTier;
  readonly candidateArtifactId: string;
  readonly referenceArtifactId: string;
}

/** One opaque artifact slot visible to the reviewer. */
export interface MaskedPresentation {
  readonly label: 'A' | 'B';
  readonly artifactToken: string;
}

/** Identity-free packet supplied to the review display layer. */
export interface MaskedReviewPacket {
  readonly packetVersion: 'masked-review/1.0.0';
  readonly packetId: string;
  readonly randomizationDigest: string;
  readonly presentations: readonly MaskedPresentation[];
}

/** Trusted mapping retained separately so masked ratings can be unblinded. */
export interface BlindOrderRecord {
  readonly recordVersion: 'blind-order/1.0.0';
  readonly packetId: string;
  readonly comparisonId: string;
  readonly stratumId: string;
  readonly randomizationSeed: string;
  readonly order: readonly {
    readonly label: 'A' | 'B';
    readonly source: 'candidate' | 'reference';
    readonly artifactId: string;
    readonly artifactToken: string;
  }[];
}

/** Packet plus its separately retained trusted unblinding record. */
export interface MaskedReviewBundle {
  readonly packet: MaskedReviewPacket;
  readonly orderRecord: BlindOrderRecord;
}

const PACKET_KEYS = [
  'packetVersion',
  'packetId',
  'randomizationDigest',
  'presentations',
] as const;
const PRESENTATION_KEYS = ['label', 'artifactToken'] as const;
const DIGEST_PATTERN = /^sha256:[a-f0-9]{64}$/u;

/** Apply seeded display ordering and separate reviewer-safe data from identities. */
export function buildMaskedReviewPacket(
  input: BlindComparisonInput,
  randomizationSeed: string,
): MaskedReviewBundle {
  validateInput(input, randomizationSeed);
  const randomizationDigest = digest([
    'display-order',
    randomizationSeed,
    input.comparisonId,
  ]);
  const candidateFirst = Number.parseInt(randomizationDigest.slice(7, 15), 16) % 2 === 0;
  const sources = candidateFirst
    ? (['candidate', 'reference'] as const)
    : (['reference', 'candidate'] as const);
  const packetId = digest(['masked-packet', randomizationSeed, input.comparisonId]);
  const order = sources.map((source, index) => {
    const label = index === 0 ? 'A' as const : 'B' as const;
    const artifactId = source === 'candidate'
      ? input.candidateArtifactId
      : input.referenceArtifactId;
    return Object.freeze({
      label,
      source,
      artifactId,
      artifactToken: digest([
        'masked-artifact',
        randomizationSeed,
        input.comparisonId,
        label,
        artifactId,
      ]),
    });
  });
  const packet: MaskedReviewPacket = deepFreeze({
    packetVersion: 'masked-review/1.0.0',
    packetId,
    randomizationDigest,
    presentations: order.map(({ label, artifactToken }) => ({ label, artifactToken })),
  });
  const orderRecord: BlindOrderRecord = deepFreeze({
    recordVersion: 'blind-order/1.0.0',
    packetId,
    comparisonId: input.comparisonId,
    stratumId: input.stratumId,
    randomizationSeed,
    order,
  });
  return deepFreeze({ packet, orderRecord });
}

/** Prove the packet uses only its closed opaque schema and contains no identity value. */
export function verifyMaskedReviewPacket(
  packet: unknown,
  identities: BlindComparisonInput,
): packet is MaskedReviewPacket {
  if (!isRecord(packet) || !hasOnlyKeys(packet, PACKET_KEYS)) {
    return false;
  }
  if (
    packet.packetVersion !== 'masked-review/1.0.0'
    || typeof packet.packetId !== 'string'
    || !DIGEST_PATTERN.test(packet.packetId)
    || typeof packet.randomizationDigest !== 'string'
    || !DIGEST_PATTERN.test(packet.randomizationDigest)
    || !Array.isArray(packet.presentations)
    || packet.presentations.length !== 2
  ) {
    return false;
  }
  const labels = new Set<string>();
  for (const presentation of packet.presentations) {
    if (
      !isRecord(presentation)
      || !hasOnlyKeys(presentation, PRESENTATION_KEYS)
      || (presentation.label !== 'A' && presentation.label !== 'B')
      || typeof presentation.artifactToken !== 'string'
      || !DIGEST_PATTERN.test(presentation.artifactToken)
    ) {
      return false;
    }
    labels.add(presentation.label);
  }
  if (labels.size !== 2) {
    return false;
  }
  const packetValues = collectStringValues(packet);
  return Object.values(identities).every((identity) => !packetValues.includes(identity));
}

function validateInput(input: BlindComparisonInput, seed: string): void {
  const values = Object.values(input);
  if (seed.length === 0 || values.some((value) => value.length === 0)) {
    throw new TypeError('Masked review identities and seed must be non-empty.');
  }
}

function digest(value: unknown): string {
  return createSha256Digest(new TextEncoder().encode(JSON.stringify(value)));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function hasOnlyKeys(
  record: Record<string, unknown>,
  allowed: readonly string[],
): boolean {
  const keys = Object.keys(record);
  return keys.length === allowed.length && keys.every((key) => allowed.includes(key));
}

function collectStringValues(value: unknown): readonly string[] {
  if (typeof value === 'string') {
    return [value];
  }
  if (typeof value !== 'object' || value === null) {
    return [];
  }
  return Object.values(value).flatMap(collectStringValues);
}
