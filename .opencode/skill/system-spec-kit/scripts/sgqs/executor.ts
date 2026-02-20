// ---------------------------------------------------------------
// MODULE: SGQS Executor
// Evaluates parsed SGQS queries against a SkillGraph
// ---------------------------------------------------------------

import {
  QueryNode, MatchNode, PatternNode, NodePatternNode, RelPatternNode,
  WhereNode, ExpressionNode, ComparisonNode, LogicalNode, NotNode, NullCheckNode,
  ReturnNode, ReturnItemNode, ReturnExprNode, PropertyRefNode, VariableRefNode,
  AggregateNode, StarNode, LiteralNode,
  GraphNode, GraphEdge, SkillGraph, SGQSResult, SGQSErrorInfo,
  MAX_TRAVERSAL_DEPTH,
} from './types';
import { TypeMismatchError } from './errors';

// ---------------------------------------------------------------
// 1. BINDING ENVIRONMENT
// ---------------------------------------------------------------

/** A single binding environment: maps variable names to graph entities */
type Bindings = Map<string, GraphNode | GraphEdge>;

// ---------------------------------------------------------------
// 2. MAIN EXECUTOR
// ---------------------------------------------------------------

/**
 * Execute an SGQS query against a skill graph.
 *
 * @param query - Parsed AST from the parser
 * @param graph - The skill graph to query against
 * @returns Query results with columns and rows
 */
export function execute(query: QueryNode, graph: SkillGraph): SGQSResult {
  const errors: SGQSErrorInfo[] = [];

  try {
    // Phase 1: MATCH -- enumerate all matching binding sets
    let bindingSets = executeMatch(query.match, graph);

    // Phase 2: WHERE -- filter binding sets
    if (query.where) {
      bindingSets = executeWhere(query.where, bindingSets);
    }

    // Phase 3: RETURN -- project results
    return executeReturn(query.return, bindingSets, errors);
  } catch (err) {
    if (err instanceof TypeMismatchError) {
      errors.push(err.toErrorInfo());
      return { columns: [], rows: [], errors };
    }
    throw err;
  }
}

// ---------------------------------------------------------------
// 3. MATCH EXECUTION
// ---------------------------------------------------------------

function executeMatch(matchNode: MatchNode, graph: SkillGraph): Bindings[] {
  let bindingSets: Bindings[] = [new Map()];

  for (const pattern of matchNode.patterns) {
    bindingSets = executePattern(pattern, graph, bindingSets);
  }

  return bindingSets;
}

function executePattern(
  pattern: PatternNode,
  graph: SkillGraph,
  existingBindings: Bindings[],
): Bindings[] {
  const elements = pattern.elements;

  // A pattern is: NodePattern (RelPattern NodePattern)*
  // Start with the first NodePattern
  const firstNode = elements[0] as NodePatternNode;

  let results: Bindings[] = [];

  for (const bindings of existingBindings) {
    // Match the first node
    const firstMatches = matchNodePattern(firstNode, graph, bindings);

    for (const nodeBindings of firstMatches) {
      // Process remaining rel-chain pairs
      let currentSets: Bindings[] = [nodeBindings];
      // Track the binding name of the most recently matched node in THIS pattern
      // so matchRelChain resolves the correct source node (P0-3 fix).
      let prevNodeBinding = firstNode.binding;
      let i = 1;

      while (i < elements.length) {
        const relPattern = elements[i] as RelPatternNode;
        const nextNodePattern = elements[i + 1] as NodePatternNode;
        i += 2;

        const nextSets: Bindings[] = [];
        for (const bs of currentSets) {
          const expanded = matchRelChain(relPattern, nextNodePattern, graph, bs, prevNodeBinding);
          nextSets.push(...expanded);
        }
        currentSets = nextSets;
        prevNodeBinding = nextNodePattern.binding;
      }

      results.push(...currentSets);
    }
  }

  return results;
}

/** Match a node pattern against all nodes in the graph */
function matchNodePattern(
  nodePattern: NodePatternNode,
  graph: SkillGraph,
  bindings: Bindings,
): Bindings[] {
  const results: Bindings[] = [];

  // If binding already exists, check if the existing node matches
  if (nodePattern.binding && bindings.has(nodePattern.binding)) {
    const existing = bindings.get(nodePattern.binding)!;
    if (isGraphNode(existing) && nodeMatchesPattern(existing as GraphNode, nodePattern)) {
      results.push(new Map(bindings));
    }
    return results;
  }

  // Otherwise, search all nodes
  for (const [, node] of graph.nodes) {
    if (nodeMatchesPattern(node, nodePattern)) {
      const newBindings = new Map(bindings);
      if (nodePattern.binding) {
        newBindings.set(nodePattern.binding, node);
      }
      results.push(newBindings);
    }
  }

  return results;
}

/** Check if a node matches a node pattern's label and property filters */
function nodeMatchesPattern(node: GraphNode, pattern: NodePatternNode): boolean {
  // Check label
  if (pattern.label) {
    const requiredLabel = ':' + pattern.label;
    if (!node.labels.includes(requiredLabel)) {
      return false;
    }
  }

  // Check properties
  if (pattern.properties) {
    for (const entry of pattern.properties.entries) {
      const nodeValue = getNodeProperty(node, entry.key);
      const patternValue = literalToValue(entry.value);
      if (nodeValue !== patternValue) {
        return false;
      }
    }
  }

  return true;
}

/** Match a relationship chain: rel_pattern -> node_pattern */
function matchRelChain(
  relPattern: RelPatternNode,
  nextNodePattern: NodePatternNode,
  graph: SkillGraph,
  bindings: Bindings,
  sourceBinding: string | null = null,
): Bindings[] {
  // Resolve source node: prefer explicit binding from the current pattern chain,
  // fall back to scanning bindings for backwards compatibility (P0-3 fix).
  let sourceNode: GraphNode | null = null;
  if (sourceBinding) {
    const bound = bindings.get(sourceBinding);
    if (bound && isGraphNode(bound)) {
      sourceNode = bound as GraphNode;
    }
  }
  if (!sourceNode) {
    sourceNode = findPreviousNode(bindings);
  }
  if (!sourceNode) return [];

  if (relPattern.range) {
    // Variable-length path traversal
    return matchVariableLengthPath(
      sourceNode, relPattern, nextNodePattern, graph, bindings
    );
  }

  // Single-hop relationship matching
  return matchSingleHopRel(sourceNode, relPattern, nextNodePattern, graph, bindings);
}

/** Match a single-hop relationship */
function matchSingleHopRel(
  sourceNode: GraphNode,
  relPattern: RelPatternNode,
  nextNodePattern: NodePatternNode,
  graph: SkillGraph,
  bindings: Bindings,
): Bindings[] {
  const results: Bindings[] = [];
  const candidateEdges = getDirectedEdges(sourceNode.id, relPattern.direction, graph);

  for (const edge of candidateEdges) {
    // Check relationship type filter
    if (relPattern.relType && edge.type !== ':' + relPattern.relType) {
      continue;
    }

    // Determine the "other" node
    const otherId = edge.source === sourceNode.id ? edge.target : edge.source;
    const otherNode = graph.nodes.get(otherId);
    if (!otherNode) continue;

    // Check if other node matches the next node pattern
    if (!nodeMatchesPattern(otherNode, nextNodePattern)) continue;

    // Check binding consistency for the next node
    if (nextNodePattern.binding && bindings.has(nextNodePattern.binding)) {
      const existing = bindings.get(nextNodePattern.binding)!;
      if (isGraphNode(existing) && (existing as GraphNode).id !== otherNode.id) {
        continue;
      }
    }

    const newBindings = new Map(bindings);
    if (relPattern.binding) {
      newBindings.set(relPattern.binding, edge);
    }
    if (nextNodePattern.binding) {
      newBindings.set(nextNodePattern.binding, otherNode);
    }
    results.push(newBindings);
  }

  return results;
}

/** Match variable-length paths with cycle detection */
function matchVariableLengthPath(
  startNode: GraphNode,
  relPattern: RelPatternNode,
  targetPattern: NodePatternNode,
  graph: SkillGraph,
  bindings: Bindings,
): Bindings[] {
  const range = relPattern.range!;
  const minHops = range.min ?? 0;
  const maxHops = range.max ?? MAX_TRAVERSAL_DEPTH;
  const results: Bindings[] = [];

  // BFS/DFS with visited set per path
  interface PathState {
    nodeId: string;
    depth: number;
    visited: Set<string>;
    lastEdge: GraphEdge | null;
  }

  const queue: PathState[] = [{
    nodeId: startNode.id,
    depth: 0,
    visited: new Set([startNode.id]),
    lastEdge: null,
  }];

  while (queue.length > 0) {
    const current = queue.shift()!;

    // If within range, check if target matches
    if (current.depth >= minHops && current.depth <= maxHops) {
      const targetNode = graph.nodes.get(current.nodeId);
      if (targetNode && targetNode.id !== startNode.id &&
          nodeMatchesPattern(targetNode, targetPattern)) {
        // Check binding consistency
        if (targetPattern.binding && bindings.has(targetPattern.binding)) {
          const existing = bindings.get(targetPattern.binding)!;
          if (isGraphNode(existing) && (existing as GraphNode).id !== targetNode.id) {
            // Skip this match -- binding conflict
          } else {
            const newBindings = new Map(bindings);
            if (targetPattern.binding) {
              newBindings.set(targetPattern.binding, targetNode);
            }
            if (relPattern.binding && current.lastEdge) {
              newBindings.set(relPattern.binding, current.lastEdge);
            }
            results.push(newBindings);
          }
        } else {
          const newBindings = new Map(bindings);
          if (targetPattern.binding) {
            newBindings.set(targetPattern.binding, targetNode);
          }
          if (relPattern.binding && current.lastEdge) {
            newBindings.set(relPattern.binding, current.lastEdge);
          }
          results.push(newBindings);
        }
      }
    }

    // Continue traversal if below max depth
    if (current.depth < maxHops) {
      const edges = getDirectedEdges(current.nodeId, relPattern.direction, graph);
      for (const edge of edges) {
        if (relPattern.relType && edge.type !== ':' + relPattern.relType) {
          continue;
        }

        const nextId = edge.source === current.nodeId ? edge.target : edge.source;
        if (current.visited.has(nextId)) continue; // Cycle detection

        const newVisited = new Set(current.visited);
        newVisited.add(nextId);

        queue.push({
          nodeId: nextId,
          depth: current.depth + 1,
          visited: newVisited,
          lastEdge: edge,
        });
      }
    }
  }

  return results;
}

/** Get edges respecting direction — O(1) per edge via edgeById index */
function getDirectedEdges(
  nodeId: string,
  direction: 'OUT' | 'IN' | 'BOTH',
  graph: SkillGraph,
): GraphEdge[] {
  const edges: GraphEdge[] = [];

  if (direction === 'OUT' || direction === 'BOTH') {
    const outIds = graph.outbound.get(nodeId) || [];
    for (const edgeId of outIds) {
      const edge = graph.edgeById.get(edgeId);
      if (edge) edges.push(edge);
    }
  }

  if (direction === 'IN' || direction === 'BOTH') {
    const inIds = graph.inbound.get(nodeId) || [];
    for (const edgeId of inIds) {
      const edge = graph.edgeById.get(edgeId);
      if (edge) edges.push(edge);
    }
  }

  return edges;
}

/** Find the most recently bound node in a bindings map */
function findPreviousNode(bindings: Bindings): GraphNode | null {
  let lastNode: GraphNode | null = null;
  for (const [, value] of bindings) {
    if (isGraphNode(value)) {
      lastNode = value as GraphNode;
    }
  }
  return lastNode;
}

// ---------------------------------------------------------------
// 4. WHERE EXECUTION
// ---------------------------------------------------------------

function executeWhere(whereNode: WhereNode, bindingSets: Bindings[]): Bindings[] {
  return bindingSets.filter(bindings => {
    return evaluateCondition(whereNode.condition, bindings);
  });
}

function evaluateCondition(expr: ExpressionNode, bindings: Bindings): boolean {
  switch (expr.kind) {
    case 'Comparison':
      return evaluateComparison(expr, bindings);
    case 'Logical':
      return evaluateLogical(expr, bindings);
    case 'Not':
      return !evaluateCondition(expr.operand, bindings);
    case 'NullCheck':
      return evaluateNullCheck(expr, bindings);
  }
}

function evaluateComparison(comp: ComparisonNode, bindings: Bindings): boolean {
  const leftValue = resolvePropertyRef(comp.left, bindings);
  const rightValue = literalToValue(comp.right);

  // NULL semantics: comparisons with NULL are false (except IS NULL handled elsewhere)
  if (leftValue === null || leftValue === undefined) return false;
  if (rightValue === null || rightValue === undefined) return false;

  switch (comp.operator) {
    case '=':
      return leftValue === rightValue;
    case '<>':
      return leftValue !== rightValue;
    case '<':
      return (leftValue as number) < (rightValue as number);
    case '>':
      return (leftValue as number) > (rightValue as number);
    case '<=':
      return (leftValue as number) <= (rightValue as number);
    case '>=':
      return (leftValue as number) >= (rightValue as number);
    case 'CONTAINS':
      return typeof leftValue === 'string' && typeof rightValue === 'string' &&
        leftValue.includes(rightValue);
    case 'STARTS_WITH':
      return typeof leftValue === 'string' && typeof rightValue === 'string' &&
        leftValue.startsWith(rightValue);
    case 'ENDS_WITH':
      return typeof leftValue === 'string' && typeof rightValue === 'string' &&
        leftValue.endsWith(rightValue);
    default:
      return false;
  }
}

function evaluateLogical(logical: LogicalNode, bindings: Bindings): boolean {
  if (logical.operator === 'AND') {
    return evaluateCondition(logical.left, bindings) &&
           evaluateCondition(logical.right, bindings);
  }
  // OR
  return evaluateCondition(logical.left, bindings) ||
         evaluateCondition(logical.right, bindings);
}

function evaluateNullCheck(check: NullCheckNode, bindings: Bindings): boolean {
  const value = resolvePropertyRef(check.property, bindings);
  const isNull = value === null || value === undefined;
  return check.negated ? !isNull : isNull;
}

// ---------------------------------------------------------------
// 5. RETURN EXECUTION
// ---------------------------------------------------------------

function executeReturn(
  returnNode: ReturnNode,
  bindingSets: Bindings[],
  errors: SGQSErrorInfo[],
): SGQSResult {
  // Determine if we have aggregation functions
  const hasAggregates = returnNode.items.some(
    item => item.expression.kind === 'Aggregate'
  );

  if (hasAggregates) {
    return executeAggregateReturn(returnNode, bindingSets, errors);
  }

  // Simple projection
  const columns = returnNode.items.map(item =>
    item.alias || getReturnExprName(item.expression)
  );

  let rows: Record<string, unknown>[] = [];

  for (const bindings of bindingSets) {
    const row: Record<string, unknown> = {};
    for (const item of returnNode.items) {
      const colName = item.alias || getReturnExprName(item.expression);
      row[colName] = resolveReturnExpr(item.expression, bindings);
    }
    rows.push(row);
  }

  // DISTINCT: remove duplicate rows
  if (returnNode.distinct) {
    rows = deduplicateRows(rows);
  }

  return { columns, rows, errors };
}

function executeAggregateReturn(
  returnNode: ReturnNode,
  bindingSets: Bindings[],
  errors: SGQSErrorInfo[],
): SGQSResult {
  // Identify grouping keys (non-aggregate return items)
  const groupKeys: ReturnItemNode[] = [];
  const aggregates: ReturnItemNode[] = [];

  for (const item of returnNode.items) {
    if (item.expression.kind === 'Aggregate') {
      aggregates.push(item);
    } else {
      groupKeys.push(item);
    }
  }

  const columns = returnNode.items.map(item =>
    item.alias || getReturnExprName(item.expression)
  );

  // Group binding sets by group keys
  const groups = new Map<string, Bindings[]>();

  for (const bindings of bindingSets) {
    const keyParts: string[] = [];
    for (const gk of groupKeys) {
      const val = resolveReturnExpr(gk.expression, bindings);
      keyParts.push(JSON.stringify(val));
    }
    const key = keyParts.join('||');

    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(bindings);
  }

  // If no group keys, treat all bindings as one group
  if (groupKeys.length === 0 && !groups.has('')) {
    groups.set('', bindingSets);
  }

  const rows: Record<string, unknown>[] = [];

  for (const [, groupBindings] of groups) {
    if (groupBindings.length === 0) continue;

    const row: Record<string, unknown> = {};

    // Group key values from first binding in group
    for (const gk of groupKeys) {
      const colName = gk.alias || getReturnExprName(gk.expression);
      row[colName] = resolveReturnExpr(gk.expression, groupBindings[0]);
    }

    // Aggregate values across group
    for (const agg of aggregates) {
      const colName = agg.alias || getReturnExprName(agg.expression);
      row[colName] = computeAggregate(
        agg.expression as AggregateNode,
        groupBindings
      );
    }

    rows.push(row);
  }

  return { columns, rows, errors };
}

/** Resolve an aggregate argument (PropertyRef, VariableRef, or Star) */
function resolveAggregateArgument(
  arg: PropertyRefNode | VariableRefNode | StarNode,
  bindings: Bindings,
): unknown {
  switch (arg.kind) {
    case 'PropertyRef':
      return resolvePropertyRef(arg, bindings);
    case 'VariableRef':
      return resolveVariableRef(arg, bindings);
    case 'Star':
      return null; // Star is handled at the aggregate level
  }
}

function computeAggregate(agg: AggregateNode, bindingSets: Bindings[]): unknown {
  if (agg.function === 'COUNT') {
    if (agg.argument.kind === 'Star') {
      return bindingSets.length;
    }

    const values: unknown[] = [];
    for (const bindings of bindingSets) {
      const val = resolveAggregateArgument(agg.argument, bindings);
      if (val !== null && val !== undefined) {
        values.push(val);
      }
    }

    if (agg.distinct) {
      const unique = new Set(values.map(v => JSON.stringify(v)));
      return unique.size;
    }
    return values.length;
  }

  if (agg.function === 'COLLECT') {
    const values: unknown[] = [];
    for (const bindings of bindingSets) {
      const val = resolveAggregateArgument(agg.argument, bindings);
      values.push(val);
    }

    if (agg.distinct) {
      const seen = new Set<string>();
      return values.filter(v => {
        const key = JSON.stringify(v);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }
    return values;
  }

  return null;
}

// ---------------------------------------------------------------
// 6. VALUE RESOLUTION
// ---------------------------------------------------------------

/** Resolve a property reference against bindings */
function resolvePropertyRef(ref: PropertyRefNode, bindings: Bindings): unknown {
  const entity = bindings.get(ref.variable);
  if (!entity) return null;

  if (isGraphNode(entity)) {
    return getNodeProperty(entity as GraphNode, ref.property);
  }

  if (isGraphEdge(entity)) {
    return getEdgeProperty(entity as GraphEdge, ref.property);
  }

  return null;
}

/** Resolve a return expression against bindings */
function resolveReturnExpr(expr: ReturnExprNode, bindings: Bindings): unknown {
  switch (expr.kind) {
    case 'PropertyRef':
      return resolvePropertyRef(expr, bindings);
    case 'VariableRef':
      return resolveVariableRef(expr, bindings);
    case 'Aggregate':
      // Single-row aggregate fallback -- shouldn't normally hit this
      return null;
  }
}

/** Resolve a variable reference to the full node/edge data */
function resolveVariableRef(ref: VariableRefNode, bindings: Bindings): unknown {
  const entity = bindings.get(ref.name);
  if (!entity) return null;

  if (isGraphNode(entity)) {
    const node = entity as GraphNode;
    return {
      id: node.id,
      labels: node.labels,
      properties: { ...node.properties },
      skill: node.skill,
      path: node.path,
    };
  }

  if (isGraphEdge(entity)) {
    const edge = entity as GraphEdge;
    return {
      id: edge.id,
      type: edge.type,
      source: edge.source,
      target: edge.target,
      properties: { ...edge.properties },
    };
  }

  return null;
}

/** Get a property from a GraphNode, checking both direct fields and properties map */
function getNodeProperty(node: GraphNode, property: string): unknown {
  // Check direct fields first
  switch (property) {
    case 'id': return node.id;
    case 'labels': return node.labels;
    case 'skill': return node.skill;
    case 'path': return node.path;
  }

  // Check properties map
  if (property in node.properties) {
    return node.properties[property];
  }

  // Property not found -- return null (NULL semantics)
  return null;
}

/** Get a property from a GraphEdge */
function getEdgeProperty(edge: GraphEdge, property: string): unknown {
  switch (property) {
    case 'id': return edge.id;
    case 'type': return edge.type;
    case 'source': return edge.source;
    case 'target': return edge.target;
  }

  if (property in edge.properties) {
    return edge.properties[property];
  }

  return null;
}

/** Convert a literal AST node to a runtime value */
function literalToValue(lit: LiteralNode): unknown {
  switch (lit.kind) {
    case 'StringLiteral': return lit.value;
    case 'IntegerLiteral': return lit.value;
    case 'BooleanLiteral': return lit.value;
    case 'NullLiteral': return null;
  }
}

// ---------------------------------------------------------------
// 7. HELPERS
// ---------------------------------------------------------------

/** Type guard for GraphNode — checks for labels (nodes) and absence of source/target (edges) */
function isGraphNode(entity: unknown): entity is GraphNode {
  const obj = entity as Record<string, unknown>;
  return entity !== null && typeof entity === 'object' &&
    'id' in obj && 'labels' in obj && 'skill' in obj &&
    !('source' in obj) && !('target' in obj);
}

/** Type guard for GraphEdge */
function isGraphEdge(entity: unknown): entity is GraphEdge {
  return entity !== null && typeof entity === 'object' &&
    'id' in (entity as Record<string, unknown>) &&
    'type' in (entity as Record<string, unknown>) &&
    'source' in (entity as Record<string, unknown>) &&
    'target' in (entity as Record<string, unknown>) &&
    !('labels' in (entity as Record<string, unknown>));
}

/** Get a display name for a return expression */
function getReturnExprName(expr: ReturnExprNode): string {
  switch (expr.kind) {
    case 'PropertyRef':
      return `${expr.variable}.${expr.property}`;
    case 'VariableRef':
      return expr.name;
    case 'Aggregate':
      if (expr.argument.kind === 'Star') {
        return `${expr.function}(*)`;
      }
      if (expr.argument.kind === 'PropertyRef') {
        const prefix = expr.distinct ? 'DISTINCT ' : '';
        return `${expr.function}(${prefix}${expr.argument.variable}.${expr.argument.property})`;
      }
      if (expr.argument.kind === 'VariableRef') {
        const prefix = expr.distinct ? 'DISTINCT ' : '';
        return `${expr.function}(${prefix}${expr.argument.name})`;
      }
      return expr.function;
  }
}

/** Deduplicate rows by JSON comparison */
function deduplicateRows(rows: Record<string, unknown>[]): Record<string, unknown>[] {
  const seen = new Set<string>();
  return rows.filter(row => {
    const key = JSON.stringify(row);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
