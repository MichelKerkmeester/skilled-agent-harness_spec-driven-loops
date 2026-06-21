import type { CSSAnalysis, DOMCollection, MotionSystem } from './types';

function parseDurationToMs(raw: string): number | null {
  const trimmed = raw.trim().toLowerCase();
  if (trimmed.endsWith('ms')) {
    const val = parseFloat(trimmed);
    return isNaN(val) ? null : val;
  }
  if (trimmed.endsWith('s')) {
    const val = parseFloat(trimmed);
    return isNaN(val) ? null : val * 1000;
  }
  const val = parseFloat(trimmed);
  return isNaN(val) ? null : val;
}

function labelForDuration(ms: number): string {
  if (ms < 100) return 'micro';
  if (ms < 200) return 'small';
  if (ms < 400) return 'medium';
  if (ms < 700) return 'large';
  return 'xl';
}

function buildFrequencyMap<T>(values: T[]): Map<T, number> {
  const map = new Map<T, number>();
  for (const v of values) {
    map.set(v, (map.get(v) ?? 0) + 1);
  }
  return map;
}

function mostFrequent<T>(freqMap: Map<T, number>): T | undefined {
  let best: T | undefined;
  let bestCount = 0;
  for (const [value, count] of freqMap) {
    if (count > bestCount) {
      best = value;
      bestCount = count;
    }
  }
  return best;
}

function classifyKeyframeAnimation(
  animation: { name: string; keyframes: { offset: string; properties: Record<string, string> }[] },
): string {
  const propNames = new Set<string>();
  const opacityValues: number[] = [];

  for (const kf of animation.keyframes) {
    for (const prop of Object.keys(kf.properties)) {
      propNames.add(prop);
    }
    if (kf.properties['opacity'] !== undefined) {
      const val = parseFloat(kf.properties['opacity']);
      if (!isNaN(val)) opacityValues.push(val);
    }
  }

  if (opacityValues.length >= 2) {
    const first = opacityValues[0];
    const last = opacityValues[opacityValues.length - 1];
    if (first === 0 && last === 1) return 'entrance';
    if (first === 1 && last === 0) return 'exit';
  }

  const hasRotateOrScale = [...propNames].some(
    (p) => p === 'transform' || p === 'rotate' || p === 'scale',
  );

  if (hasRotateOrScale && animation.keyframes.length >= 3) {
    return 'attention';
  }

  return 'generic';
}

export function extractMotion(
  cssAnalysis: CSSAnalysis,
  _domCollections: DOMCollection[],
): MotionSystem | null {
  const durationValues: number[] = [];
  const timingFunctionValues: string[] = [];

  for (const t of cssAnalysis.transitions) {
    const ms = parseDurationToMs(t.duration);
    if (ms !== null && ms > 0) durationValues.push(ms);
    if (t.timingFunction) timingFunctionValues.push(t.timingFunction);
  }

  for (const a of cssAnalysis.animations) {
    const ms = parseDurationToMs(a.duration);
    if (ms !== null && ms > 0) durationValues.push(ms);
  }

  if (durationValues.length === 0 && cssAnalysis.animations.length === 0) {
    return null;
  }

  const durationFreq = buildFrequencyMap(durationValues.map((d) => `${d}ms`));
  const tierMap = new Map<string, { value: string; frequency: number }>();

  for (const ms of durationValues) {
    const label = labelForDuration(ms);
    const existing = tierMap.get(label);
    if (!existing || ms > parseDurationToMs(existing.value)!) {
      tierMap.set(label, {
        value: `${ms}ms`,
        frequency: (existing?.frequency ?? 0) + 1,
      });
    } else {
      tierMap.set(label, { ...existing, frequency: existing.frequency + 1 });
    }
  }

  const durationScale = [...tierMap.entries()]
    .map(([label, data]) => ({ label, value: data.value, frequency: data.frequency }))
    .sort((a, b) => {
      const order = ['micro', 'small', 'medium', 'large', 'xl'];
      return order.indexOf(a.label) - order.indexOf(b.label);
    });

  const timingFreq = buildFrequencyMap(timingFunctionValues);
  const primaryTimingFunction = mostFrequent(timingFreq) ?? 'ease';

  const timingFunctions = [...timingFreq.entries()]
    .map(([value, frequency]) => ({ value, frequency }))
    .sort((a, b) => b.frequency - a.frequency);

  const keyframeAnimations = cssAnalysis.animations.map((a) => {
    const type = classifyKeyframeAnimation(a);
    const properties = new Set<string>();
    for (const kf of a.keyframes) {
      for (const prop of Object.keys(kf.properties)) {
        properties.add(prop);
      }
    }
    return {
      name: a.name,
      type,
      duration: a.duration,
      properties: [...properties],
    };
  });

  const prefersReducedMotion = cssAnalysis.mediaBreakpoints.some(
    (bp) => bp.type === 'prefers-reduced-motion',
  );

  return {
    durationScale,
    primaryTimingFunction,
    timingFunctions,
    keyframeAnimations,
    prefersReducedMotion,
  };
}
