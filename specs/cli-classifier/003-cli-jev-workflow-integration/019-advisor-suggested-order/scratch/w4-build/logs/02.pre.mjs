#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// MODULE: Suggested Cluster Order Eval
// ───────────────────────────────────────────────────────────────
//
// Measures, offline, whether a Jev or local Deem answer that orders the advisor's
// whole near-tie cluster beats the best zero-call order, with each call timed
// inside a child spawned the way the prompt shim spawns the advisor. The default
// run makes no model call. The script holds no credential and reads none.

import { reorderSlots } from './score-jev-tiebreak.mjs';

export const ALPHA = 0.05;
export const MARGIN = 0.05;
export const ADVISOR_BUDGET_MS = 2200;
export const CHILD_TIMEOUT_MS = 2500;
export const MIN_MOVABLE = 5;
const CHOICE_QUESTION = 'Which skill should handle this request?';
const NONE_DESCRIPTION = 'None of these skills fits the request';
const PASSES = 3;

/**
 * Nearest-rank quantile of a numeric sample; null when the sample is empty.
 * @param {number[]} values
 * @param {number} q
 * @returns {number|null}
 */
export function nearestRank(values, q) {
  if (values.length === 0) return null;
  const sorted = values.slice().sort((left, right) => left - right);
  return sorted[Math.ceil(q * sorted.length) - 1];
}

/**
 * The three left rotations of the keys.
 * @param {string[]} keys
 * @returns {string[][]}
 */
export function rotations(keys) {
  return [0, 1, 2].map((r) => [...keys.slice(r), ...keys.slice(0, r)]);
}

/**
 * Flat option args that label each key, disambiguating equal descriptions.
 * @param {string[]} keys
 * @param {(key: string) => string} describe
 * @param {string[]} cluster
 * @returns {string[]}
 */
export function optionArgs(keys, describe, cluster) {
  return keys.flatMap((key) => {
    if (key === 'none') return ['-o', `none=${NONE_DESCRIPTION}`];
    const text = describe(key);
    const clash = cluster.some((other) => other !== key && describe(other) === text);
    return ['-o', `${key}=${text}${clash ? ` [${key}]` : ''}`];
  });
}

/**
 * Probability map read from advisor stdout, with the raw and full-coverage views.
 * @param {string} stdout
 * @param {string[]} keys
 * @returns {{ raw: Record<string, number>|null, full: Record<string, number>|null }}
 */
export function readProbabilities(stdout, keys) {
  let raw = null;
  try {
    const probabilities = JSON.parse(stdout).answers.answer.probabilities;
    if (probabilities !== null && typeof probabilities === 'object' && !Array.isArray(probabilities)) {
      raw = probabilities;
    }
  } catch {
    return { raw: null, full: null };
  }
  if (raw === null) return { raw: null, full: null };
  for (const key of keys) {
    const value = raw[key];
    if (typeof value !== 'number' || !Number.isFinite(value)) return { raw, full: null };
  }
  const full = {};
  for (const key of keys) full[key] = raw[key];
  return { raw, full };
}

/**
 * First key in keys order that holds the highest value.
 * @param {Record<string, number>} map
 * @param {string[]} keys
 * @returns {string}
 */
export function topKey(map, keys) {
  let best = keys[0];
  for (const key of keys) {
    if (map[key] > map[best]) best = key;
  }
  return best;
}

/**
 * Cluster order by mean probability across the passes; abstains when none leads.
 * @param {{ order: string[], cluster: string[] }} row
 * @param {Array<Record<string, number>>} maps
 * @returns {{ order: string[], abstained: boolean }}
 */
export function orderFromMaps(row, maps) {
  const mean = {};
  for (const key of [...row.cluster, 'none']) {
    mean[key] = maps.reduce((sum, map) => sum + map[key], 0) / maps.length;
  }
  if (row.cluster.every((key) => mean.none > mean[key])) {
    return { order: row.order.slice(), abstained: true };
  }
  const sorted = row.cluster.slice().sort((left, right) => mean[right] - mean[left]);
  return { order: reorderSlots(row.order, row.cluster, sorted), abstained: false };
}
