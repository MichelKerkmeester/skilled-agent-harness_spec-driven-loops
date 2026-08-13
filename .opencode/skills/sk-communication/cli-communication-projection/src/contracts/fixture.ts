// ───────────────────────────────────────────────────────────────────
// MODULE: Fixture Matrix Contract
// ───────────────────────────────────────────────────────────────────

import type {
  CaptureMethod,
  ContractHeader,
  RuntimeId,
  SanitizationStatus,
} from './common.js';
import type { EventEnvelope } from './event.js';

/** Provenance and expected behavior shared by every stored fixture case. */
export interface FixtureCaseMetadata {
  readonly fixtureId: string;
  readonly schemaVersion: string;
  readonly sourceFamily: string;
  readonly sourceVersion: string;
  readonly captureMethod: CaptureMethod;
  readonly sanitizationStatus: SanitizationStatus;
  readonly expectedResult: string;
}

/** Generic fixture wrapper for an independently versioned contract record. */
export interface ContractFixtureCase<TRecord extends ContractHeader>
  extends FixtureCaseMetadata {
  readonly record: TRecord;
}

/** One runtime and behavior-class fixture with an explicit expected result. */
export interface RuntimeFixtureCase extends FixtureCaseMetadata {
  readonly runtime: RuntimeId;
  readonly fixtureClass: RuntimeFixtureClass;
  readonly exactOriginalId: string;
  readonly expectedResult: 'accept' | 'exact-original' | 'preserve-extension';
  readonly event: EventEnvelope;
}

/** Behavior classes required from every runtime family. */
export const RuntimeFixtureClasses = {
  CANCELLATION: 'cancellation',
  ERROR: 'error',
  EXTENSION: 'extension',
  NORMAL: 'normal',
  STREAMING: 'streaming',
} as const;

/** Runtime fixture behavior class. */
export type RuntimeFixtureClass =
  typeof RuntimeFixtureClasses[keyof typeof RuntimeFixtureClasses];
