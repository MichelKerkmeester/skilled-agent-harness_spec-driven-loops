// ───────────────────────────────────────────────────────────────────
// MODULE: Deterministic Conflict Graph Scheduler
// ───────────────────────────────────────────────────────────────────

import { compareStableText } from './stable-digest.js';

import type {
  ConflictEdge,
  GraphNode,
  GraphSchedule,
  GraphValidationIssue,
  LaneDecision,
  ScheduleLane,
} from './types.js';

function compareText(left: string, right: string): number {
  return compareStableText(left, right);
}

function connectedEdges(nodeId: string, edges: readonly ConflictEdge[]): readonly ConflictEdge[] {
  return edges.filter((edge) => edge.from === nodeId || edge.to === nodeId);
}

function uniqueSorted(values: readonly string[]): readonly string[] {
  return [...new Set(values)].sort(compareText);
}

function dependenciesFor(nodeId: string, edges: readonly ConflictEdge[]): readonly string[] {
  return uniqueSorted(edges
    .filter((edge) => edge.edge_type === 'hard-order' && edge.to === nodeId)
    .map((edge) => edge.from));
}

function conflicts(left: string, right: string, edges: readonly ConflictEdge[]): boolean {
  return edges.some((edge) => edge.edge_type !== 'hard-order'
    && ((edge.from === left && edge.to === right) || (edge.from === right && edge.to === left)));
}

function laneId(index: number): string {
  return `lane-${String(index + 1).padStart(3, '0')}`;
}

function decisionFor(
  node: GraphNode,
  lane: ScheduleLane,
  laneIndexByNode: ReadonlyMap<string, number>,
  edges: readonly ConflictEdge[],
  fallbackReason: string | null,
): LaneDecision {
  const connected = connectedEdges(node.id, edges);
  const dependencies = dependenciesFor(node.id, edges);
  const nodeLaneIndex = laneIndexByNode.get(node.id) ?? Number.MAX_SAFE_INTEGER;
  const completedBeforeLane = dependencies.filter(
    (dependency) => (laneIndexByNode.get(dependency) ?? Number.MAX_SAFE_INTEGER) < nodeLaneIndex,
  );
  const pending = dependencies.filter((dependency) => !completedBeforeLane.includes(dependency));
  const conflictResources = uniqueSorted(connected
    .filter((edge) => edge.edge_type !== 'hard-order' && edge.edge_type !== 'fence')
    .flatMap((edge) => edge.resources));
  const fenceResources = uniqueSorted(connected
    .filter((edge) => edge.edge_type === 'fence')
    .flatMap((edge) => edge.resources));
  const scheduleClass = lane.node_ids.length > 1 ? 'parallel-safe' : 'serialized';

  let refusalReason = fallbackReason;
  if (!refusalReason && scheduleClass === 'serialized') {
    if (fenceResources.length > 0) {
      refusalReason = `Serialized by fence resources: ${fenceResources.join(', ')}.`;
    } else if (conflictResources.length > 0) {
      refusalReason = `Serialized by conflict resources: ${conflictResources.join(', ')}.`;
    } else if (dependencies.length > 0) {
      refusalReason = `Scheduled after required predecessors: ${dependencies.join(', ')}.`;
    } else {
      refusalReason = 'No parallel-safe peer was eligible in this deterministic lane.';
    }
  }

  return {
    node_ids: [node.id],
    predecessor_completion: {
      required: dependencies,
      completed_before_lane: completedBeforeLane,
      pending,
    },
    conflict_resources: conflictResources,
    fence_resources: fenceResources,
    source_digest: node.source_digest,
    schedule_class: scheduleClass,
    refusal_reason: refusalReason,
  };
}

function fallbackSchedule(
  nodes: readonly GraphNode[],
  edges: readonly ConflictEdge[],
  issues: readonly GraphValidationIssue[],
): GraphSchedule {
  const sortedNodes = [...nodes].sort((left, right) => compareText(left.id, right.id));
  const lanes = sortedNodes.map((node, index) => ({
    lane_id: laneId(index),
    node_ids: [node.id],
  }));
  const laneIndexByNode = new Map(
    lanes.flatMap((lane, index) => lane.node_ids.map((nodeId) => [nodeId, index] as const)),
  );
  const fallbackReason = `Widened scheduling refused: ${issues
    .map((entry) => `${entry.code}: ${entry.message}`)
    .join(' | ')}`;

  return {
    schedule_class: 'serial-single-writer',
    graph_state: 'fallback',
    phase_gate_complete: false,
    phase_gate_status: 'refused-incomplete-evidence',
    widened_parallelism: false,
    missing_evidence: issues,
    lanes,
    decisions: sortedNodes.map((node, index) => decisionFor(
      node,
      lanes[index] ?? { lane_id: laneId(index), node_ids: [node.id] },
      laneIndexByNode,
      edges,
      fallbackReason,
    )),
  };
}

export function createDeterministicSchedule(
  nodes: readonly GraphNode[],
  edges: readonly ConflictEdge[],
  issues: readonly GraphValidationIssue[],
): GraphSchedule {
  if (issues.length > 0) return fallbackSchedule(nodes, edges, issues);

  const nodesById = new Map(nodes.map((node) => [node.id, node] as const));
  const remaining = new Set([...nodesById.keys()].sort(compareText));
  const scheduled = new Set<string>();
  const lanes: ScheduleLane[] = [];

  while (remaining.size > 0) {
    const candidates = [...remaining]
      .filter((nodeId) => dependenciesFor(nodeId, edges).every((dependency) => scheduled.has(dependency)))
      .sort(compareText);
    const selected: string[] = [];
    for (const candidate of candidates) {
      if (selected.every((peer) => !conflicts(candidate, peer, edges))) selected.push(candidate);
    }
    if (selected.length === 0) {
      return fallbackSchedule(nodes, edges, [{
        code: 'DEPENDENCY_CYCLE',
        message: 'No dependency-ready node remained while constructing the schedule.',
        node_ids: [...remaining].sort(compareText),
        resources: [],
        source_paths: [],
      }]);
    }

    lanes.push({ lane_id: laneId(lanes.length), node_ids: selected });
    for (const nodeId of selected) {
      remaining.delete(nodeId);
      scheduled.add(nodeId);
    }
  }

  const laneIndexByNode = new Map(
    lanes.flatMap((lane, index) => lane.node_ids.map((nodeId) => [nodeId, index] as const)),
  );
  const decisions = lanes.flatMap((lane) => lane.node_ids.map((nodeId) => decisionFor(
    nodesById.get(nodeId) as GraphNode,
    lane,
    laneIndexByNode,
    edges,
    null,
  )));

  return {
    schedule_class: 'parallel-safe-antichains',
    graph_state: 'ready',
    phase_gate_complete: false,
    phase_gate_status: 'requires-external-verification',
    widened_parallelism: lanes.some((lane) => lane.node_ids.length > 1),
    missing_evidence: [],
    lanes,
    decisions,
  };
}
