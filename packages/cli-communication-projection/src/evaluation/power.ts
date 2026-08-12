// ───────────────────────────────────────────────────────────────────
// MODULE: Paired-Rating Power Planning
// ───────────────────────────────────────────────────────────────────

/** Smallest release sample accepted for one independent stratum. */
export const MINIMUM_PAIRED_RATINGS_PER_STRATUM = 30;

/** Hard release-study cap for one independent stratum. */
export const MAXIMUM_PAIRED_RATINGS_PER_STRATUM = 100;

/** Inputs for a normal-approximation paired non-inferiority power plan. */
export interface PowerAnalysisInput {
  readonly standardDeviation: number;
  readonly minimumDetectableDifference: number;
  readonly alpha: number;
  readonly targetPower: number;
}

/** Deterministic bounded sample plan and its achieved power. */
export interface PoweredSampleSize {
  readonly alpha: number;
  readonly targetPower: number;
  readonly standardDeviation: number;
  readonly minimumDetectableDifference: number;
  readonly unboundedPairedRatings: number;
  readonly pairedRatingsPerStratum: number;
  readonly achievedPower: number;
  readonly meetsTargetPower: boolean;
  readonly clamped: boolean;
}

/** Compute a bounded paired-rating count using the frozen two-sided CI rule. */
export function calculatePoweredSampleSize(
  input: PowerAnalysisInput,
): PoweredSampleSize {
  validatePowerInput(input);
  const confidenceCritical = inverseStandardNormal(1 - input.alpha / 2);
  const powerCritical = inverseStandardNormal(input.targetPower);
  const ratio = input.standardDeviation / input.minimumDetectableDifference;
  const rawEstimate = (confidenceCritical + powerCritical) ** 2 * ratio ** 2;
  const unboundedPairedRatings = Number.isFinite(rawEstimate)
    ? Math.ceil(rawEstimate)
    : Number.MAX_SAFE_INTEGER;
  const pairedRatingsPerStratum = Math.max(
    MINIMUM_PAIRED_RATINGS_PER_STRATUM,
    Math.min(MAXIMUM_PAIRED_RATINGS_PER_STRATUM, unboundedPairedRatings),
  );
  const standardizedEffect = input.standardDeviation === 0
    ? Number.POSITIVE_INFINITY
    : input.minimumDetectableDifference
      * Math.sqrt(pairedRatingsPerStratum)
      / input.standardDeviation;
  const achievedPower = standardNormalCdf(standardizedEffect - confidenceCritical);
  const meetsTargetPower = achievedPower + 1e-12 >= input.targetPower;

  return Object.freeze({
    alpha: input.alpha,
    targetPower: input.targetPower,
    standardDeviation: input.standardDeviation,
    minimumDetectableDifference: input.minimumDetectableDifference,
    unboundedPairedRatings,
    pairedRatingsPerStratum,
    achievedPower,
    meetsTargetPower,
    clamped: pairedRatingsPerStratum !== unboundedPairedRatings,
  });
}

function validatePowerInput(input: PowerAnalysisInput): void {
  if (!Number.isFinite(input.standardDeviation) || input.standardDeviation < 0) {
    throw new RangeError('Power standard deviation must be finite and non-negative.');
  }
  if (
    !Number.isFinite(input.minimumDetectableDifference)
    || input.minimumDetectableDifference <= 0
  ) {
    throw new RangeError('Minimum detectable difference must be finite and positive.');
  }
  if (!Number.isFinite(input.alpha) || input.alpha <= 0 || input.alpha >= 0.5) {
    throw new RangeError('Power alpha must be between zero and 0.5.');
  }
  if (
    !Number.isFinite(input.targetPower)
    || input.targetPower < 0.8
    || input.targetPower >= 1
  ) {
    throw new RangeError('Target power must be at least 0.8 and below one.');
  }
}

function standardNormalCdf(value: number): number {
  if (value === Number.POSITIVE_INFINITY) {
    return 1;
  }
  if (value === Number.NEGATIVE_INFINITY) {
    return 0;
  }
  const sign = value < 0 ? -1 : 1;
  const scaled = Math.abs(value) / Math.sqrt(2);
  const t = 1 / (1 + 0.327_591_1 * scaled);
  const polynomial = (((((1.061_405_429 * t - 1.453_152_027) * t)
    + 1.421_413_741) * t - 0.284_496_736) * t + 0.254_829_592) * t;
  const errorFunction = sign * (1 - polynomial * Math.exp(-scaled * scaled));
  return (1 + errorFunction) / 2;
}

function inverseStandardNormal(probability: number): number {
  if (probability <= 0 || probability >= 1) {
    throw new RangeError('Normal quantile probability must be between zero and one.');
  }
  const lowThreshold = 0.024_25;
  const highThreshold = 1 - lowThreshold;
  const a = [
    -39.696_830_286_653_76,
    220.946_098_424_520_5,
    -275.928_510_446_968_7,
    138.357_751_867_269,
    -30.664_798_066_147_16,
    2.506_628_277_459_239,
  ] as const;
  const b = [
    -54.476_098_798_224_06,
    161.585_836_858_040_9,
    -155.698_979_859_886_6,
    66.801_311_887_719_72,
    -13.280_681_552_885_72,
  ] as const;
  const c = [
    -0.007_784_894_002_430_293,
    -0.322_396_458_041_136_5,
    -2.400_758_277_161_838,
    -2.549_732_539_343_734,
    4.374_664_141_464_968,
    2.938_163_982_698_783,
  ] as const;
  const d = [
    0.007_784_695_709_041_462,
    0.322_467_129_070_039_8,
    2.445_134_137_142_996,
    3.754_408_661_907_416,
  ] as const;

  if (probability < lowThreshold) {
    const q = Math.sqrt(-2 * Math.log(probability));
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5])
      / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  if (probability > highThreshold) {
    const q = Math.sqrt(-2 * Math.log(1 - probability));
    return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5])
      / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  const q = probability - 0.5;
  const r = q * q;
  return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q
    / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
}
