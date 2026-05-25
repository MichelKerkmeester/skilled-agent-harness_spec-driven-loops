// ---------------------------------------------------------------
// MODULE: Context Budget Allocator
// ---------------------------------------------------------------

export interface SourceBudget {
  name: string;
  floor: number;
  actualSize: number;
}

export interface SourceAllocation {
  name: string;
  floor: number;
  requested: number;
  granted: number;
  dropped: number;
}

export interface AllocationResult {
  totalBudget: number;
  totalUsed: number;
  overflow: number;
  allocations: SourceAllocation[];
}

export const DEFAULT_FLOORS = {
  constitutional: 700,
  codeGraph: 1200,
  triggered: 400,
  overflow: 800,
} as const;

const PRIORITY_ORDER = ['constitutional', 'codeGraph', 'sessionState', 'triggered'] as const;

export function allocateBudget(
  sources: SourceBudget[],
  totalBudget: number = 4000,
): AllocationResult {
  const allocations: SourceAllocation[] = [];
  const floorTotal = sources.reduce((sum, source) => sum + source.floor, 0);
  let overflowPool = Math.max(totalBudget - floorTotal, 0);

  for (const source of sources) {
    const granted = Math.min(source.floor, source.actualSize);
    overflowPool += source.floor - granted;
    allocations.push({
      name: source.name,
      floor: source.floor,
      requested: source.actualSize,
      granted,
      dropped: Math.max(0, source.actualSize - granted),
    });
  }

  if (overflowPool > 0) {
    for (const priorityName of PRIORITY_ORDER) {
      const allocation = allocations.find((entry) => entry.name === priorityName);
      if (!allocation) continue;

      const headroom = allocation.requested - allocation.granted;
      if (headroom <= 0) continue;

      const bonus = Math.min(headroom, overflowPool);
      allocation.granted += bonus;
      allocation.dropped -= bonus;
      overflowPool -= bonus;
      if (overflowPool <= 0) break;
    }
  }

  let totalUsed = allocations.reduce((sum, allocation) => sum + allocation.granted, 0);
  if (totalUsed > totalBudget) {
    for (const name of [...PRIORITY_ORDER].reverse()) {
      if (totalUsed <= totalBudget) break;
      const allocation = allocations.find((entry) => entry.name === name);
      if (!allocation) continue;

      const trim = Math.min(totalUsed - totalBudget, allocation.granted);
      allocation.granted -= trim;
      allocation.dropped += trim;
      totalUsed -= trim;
    }
  }

  return {
    totalBudget,
    totalUsed: allocations.reduce((sum, allocation) => sum + allocation.granted, 0),
    overflow: overflowPool,
    allocations,
  };
}

export function createDefaultSources(
  constitutionalSize: number,
  codeGraphSize: number,
  triggeredSize: number,
  sessionStateSize: number = 0,
): SourceBudget[] {
  return [
    { name: 'constitutional', floor: DEFAULT_FLOORS.constitutional, actualSize: constitutionalSize },
    { name: 'codeGraph', floor: DEFAULT_FLOORS.codeGraph, actualSize: codeGraphSize },
    { name: 'sessionState', floor: 0, actualSize: sessionStateSize },
    { name: 'triggered', floor: DEFAULT_FLOORS.triggered, actualSize: triggeredSize },
  ];
}
