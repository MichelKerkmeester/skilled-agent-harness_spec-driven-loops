// ───────────────────────────────────────────────────────────────────
// MODULE: Contract Fixture Loader
// ───────────────────────────────────────────────────────────────────

import { readFileSync } from 'node:fs';

import type { ContractFixtureCase, ContractHeader } from '../../src/index.js';

/** Test-facing alias for the public fixture contract. */
export type FixtureCase<TRecord extends ContractHeader> = ContractFixtureCase<TRecord>;

/** Versioned collection of contract fixtures. */
export interface FixtureSet<TCase> {
  readonly fixtureSetVersion: string;
  readonly description: string;
  readonly cases: readonly TCase[];
}

/** Read one immutable JSON fixture relative to the test corpus. */
export function readFixture<TFixture>(name: string): TFixture {
  const fixtureUrl = new URL(`../fixtures/${name}`, import.meta.url);
  return JSON.parse(readFileSync(fixtureUrl, 'utf8')) as unknown as TFixture;
}
