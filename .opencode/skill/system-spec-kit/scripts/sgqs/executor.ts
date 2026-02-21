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
 * @throws {TypeMismatchError} When a type mismatch is unrecoverable (re-thrown after conversion to error info)
 */
export function execute(query: QueryNode, graph: SkillGraph): SGQSResult {
  const errors: SGQSErrorInfo[] = [];
  const warnings: SGQSErrorInfo[] = [];

  try {
    // Phase 1: MATCH -- enumerate all matching binding sets
    let bindingSets = executeMatch(query.match, graph, warnings);

    // Phase 2: WHERE -- filter binding sets
    if (query.where) {
      bindingSets = executeWhere(query.where, bindingSets, warnings);
    }

    // Phase 3: RETURN -- project results
    const result = executeReturn(query.return, bindingSets, errors, warnings);

    // Merge deduplicated warnings into errors
    if (warnings.length > 0) {
      const seenWarnings = new Set<string>();
      for (const w of warnings) {
        const key = `${w.code}:${w.message}`;
        if (!seenWarnings.has(key)) {
          seenWarnings.add(key);
          result.errors.push(w);
        }
      }
    }

    return result;
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

function executeMatch(matchNode: MatchNode, graph: SkillGraph, warnings: SGQSErrorInfo[]): Bindings[] {
  let bindingSets: Bindings[] = [new Map()];

  for (const pattern of matchNode.patterns) {
    bindingSets = executePattern(pattern, graph, bindingSets, warnings);
  }

  return bindingSets;
}

function executePattern(
  pattern: PatternNode,
  graph: SkillGraph,
  existingBindings: Bindings[],
  warnings: SGQSErrorInfo[],
): Bindings[] {
  const elements = pattern.elements;

  // A pattern is: NodePattern (RelPattern NodePattern)*
  // Start with the first NodePattern
  const firstNode = elements[0] as NodePatternNode;

  let results: Bindings[] = [];

  for (const bindings of existingBindings) {
    // Match the first node
    const firstMatches = matchNodePattern(firstNode, graph, bindings, warnings);

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
          const expanded = matchRelChain(relPattern, nextNodePattern, graph, bs, warnings, prevNodeBinding);
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
  warnings: SGQSErrorInfo[],
): Bindings[] {
  const results: Bindings[] = [];

  // If binding already exists, check if the existing node matches
  if (nodePattern.binding && bindings.has(nodePattern.binding)) {
    // Safe: binding existence verified by the has() check on the line above
    const existing = bindings.get(nodePattern.binding)!;
    if (isGraphNode(existing) && nodeMatchesPattern(existing as GraphNode, nodePattern, warnings)) {
      results.push(new Map(bindings));
    }
    return results;
  }

  // Otherwise, search all nodes
  for (const [, node] of graph.nodes) {
    if (nodeMatchesPattern(node, nodePattern, warnings)) {
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
function nodeMatchesPattern(node: GraphNode, pattern: NodePatternNode, warnings: SGQSErrorInfo[]): boolean {
  // Check label
  if (pattern.label) {
    const requiredLabel = ':' + pattern.label.toLowerCase();
    const hasLabel = node.labels.some(label => label.toLowerCase() === requiredLabel);
    if (!hasLabel) {
      return false;
    }
  }

  // Check properties
  if (pattern.properties) {
    for (const entry of pattern.properties.entries) {
      const nodeValue = getNodeProperty(node, entry.key, warnings);
      const patternValue = literalToValue(entry.value);
      if (!patternPropertyMatches(nodeValue, patternValue)) {
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
  warnings: SGQSErrorInfo[],
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
      sourceNode, relPattern, nextNodePattern, graph, bindings, warnings
    );
  }

  // Single-hop relationship matching
  return matchSingleHopRel(sourceNode, relPattern, nextNodePattern, graph, bindings, warnings);
}

/** Match a single-hop relationship */
function matchSingleHopRel(
  sourceNode: GraphNode,
  relPattern: RelPatternNode,
  nextNodePattern: NodePatternNode,
  graph: SkillGraph,
  bindings: Bindings,
  warnings: SGQSErrorInfo[],
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
    if (!nodeMatchesPattern(otherNode, nextNodePattern, warnings)) continue;

    // Check binding consistency for the next node
    if (nextNodePattern.binding && bindings.has(nextNodePattern.binding)) {
      // Safe: binding existence verified by the has() check on the line above
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
  warnings: SGQSErrorInfo[],
): Bindings[] {
  // Safe: range existence verified by caller (matchRelChain checks relPattern.range before calling)
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
    // Safe: loop condition guarantees queue is non-empty
    const current = queue.shift()!;

    // If within range, check if target matches
    if (current.depth >= minHops && current.depth <= maxHops) {
      const targetNode = graph.nodes.get(current.nodeId);
      if (targetNode && targetNode.id !== startNode.id &&
          nodeMatchesPattern(targetNode, targetPattern, warnings)) {
        // Check binding consistency
        if (targetPattern.binding && bindings.has(targetPattern.binding)) {
          // Safe: binding existence verified by the has() check on the line above
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

// Safe: Map preserves insertion order per ES2015 spec. Bindings are always
// inserted in pattern-match order during MATCH clause processing, so the
// last entry is the most recently bound node.
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

function executeWhere(whereNode: WhereNode, bindingSets: Bindings[], warnings: SGQSErrorInfo[]): Bindings[] {
  return bindingSets.filter(bindings => {
    return evaluateCondition(whereNode.condition, bindings, warnings);
  });
}

function evaluateCondition(expr: ExpressionNode, bindings: Bindings, warnings: SGQSErrorInfo[]): boolean {
  switch (expr.kind) {
    case 'Comparison':
      return evaluateComparison(expr, bindings, warnings);
    case 'Logical':
      return evaluateLogical(expr, bindings, warnings);
    case 'Not':
      return !evaluateCondition(expr.operand, bindings, warnings);
    case 'NullCheck':
      return evaluateNullCheck(expr, bindings, warnings);
    default: {
      const _exhaustive: never = expr;
      throw new Error(`Unexpected expression kind: ${(expr as any).kind}`);
    }
  }
}

function evaluateComparison(comp: ComparisonNode, bindings: Bindings, warnings: SGQSErrorInfo[]): boolean {
  const leftValue = resolvePropertyRef(comp.left, bindings, warnings);
  const rightValue = comp.right.kind === 'PropertyRef'
    ? resolvePropertyRef(comp.right, bindings, warnings)
    : literalToValue(comp.right);

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
        leftValue.toLowerCase().includes(rightValue.toLowerCase());
    case 'STARTS_WITH':
      return typeof leftValue === 'string' && typeof rightValue === 'string' &&
        leftValue.toLowerCase().startsWith(rightValue.toLowerCase());
    case 'ENDS_WITH':
      return typeof leftValue === 'string' && typeof rightValue === 'string' &&
        leftValue.toLowerCase().endsWith(rightValue.toLowerCase());
    default:
      return false;
  }
}

function evaluateLogical(logical: LogicalNode, bindings: Bindings, warnings: SGQSErrorInfo[]): boolean {
  if (logical.operator === 'AND') {
    return evaluateCondition(logical.left, bindings, warnings) &&
           evaluateCondition(logical.right, bindings, warnings);
  }
  // OR
  return evaluateCondition(logical.left, bindings, warnings) ||
         evaluateCondition(logical.right, bindings, warnings);
}

function evaluateNullCheck(check: NullCheckNode, bindings: Bindings, warnings: SGQSErrorInfo[]): boolean {
  const value = resolvePropertyRef(check.property, bindings, warnings);
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
  warnings: SGQSErrorInfo[],
): SGQSResult {
  // Determine if we have aggregation functions
  const hasAggregates = returnNode.items.some(
    item => item.expression.kind === 'Aggregate'
  );

  if (hasAggregates) {
    return executeAggregateReturn(returnNode, bindingSets, errors, warnings);
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
      row[colName] = resolveReturnExpr(item.expression, bindings, warnings);
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
  warnings: SGQSErrorInfo[],
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
      const val = resolveReturnExpr(gk.expression, bindings, warnings);
      keyParts.push(JSON.stringify(val));
    }
    const key = keyParts.join('||');

    if (!groups.has(key)) {
      groups.set(key, []);
    }
    // Safe: groups.get(key) is guaranteed non-null by the set() call on the line above
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
      row[colName] = resolveReturnExpr(gk.expression, groupBindings[0], warnings);
    }

    // Aggregate values across group
    for (const agg of aggregates) {
      const colName = agg.alias || getReturnExprName(agg.expression);
      row[colName] = computeAggregate(
        agg.expression as AggregateNode,
        groupBindings,
        warnings
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
  warnings: SGQSErrorInfo[],
): unknown {
  switch (arg.kind) {
    case 'PropertyRef':
      return resolvePropertyRef(arg, bindings, warnings);
    case 'VariableRef':
      return resolveVariableRef(arg, bindings);
    case 'Star':
      return null; // Star is handled at the aggregate level
  }
}

function computeAggregate(agg: AggregateNode, bindingSets: Bindings[], warnings: SGQSErrorInfo[]): unknown {
  if (agg.function === 'COUNT') {
    if (agg.argument.kind === 'Star') {
      return bindingSets.length;
    }

    const values: unknown[] = [];
    for (const bindings of bindingSets) {
      const val = resolveAggregateArgument(agg.argument, bindings, warnings);
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
      const val = resolveAggregateArgument(agg.argument, bindings, warnings);
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
function resolvePropertyRef(ref: PropertyRefNode, bindings: Bindings, warnings: SGQSErrorInfo[]): unknown {
  const entity = bindings.get(ref.variable);
  if (!entity) return null;

  if (isGraphNode(entity)) {
    return getNodeProperty(entity as GraphNode, ref.property, warnings);
  }

  if (isGraphEdge(entity)) {
    return getEdgeProperty(entity as GraphEdge, ref.property);
  }

  return null;
}

/** Resolve a return expression against bindings */
function resolveReturnExpr(expr: ReturnExprNode, bindings: Bindings, warnings: SGQSErrorInfo[]): unknown {
  switch (expr.kind) {
    case 'PropertyRef':
      return resolvePropertyRef(expr, bindings, warnings);
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
function getNodeProperty(node: GraphNode, property: string, warnings: SGQSErrorInfo[]): unknown {
  const normalizedProperty = property.toLowerCase();

  // Check direct fields first
  switch (normalizedProperty) {
    case 'id': return node.id;
    case 'labels': return node.labels;
    case 'skill': return node.skill;
    case 'path': return node.path;
  }

  // Query aliases as a first-class search surface.
  if (normalizedProperty === 'aliases') {
    const aliasTokens = buildAliasTokens(node);
    if (aliasTokens.length > 0) {
      return aliasTokens;
    }
  }

  // Check properties map (case-insensitive)
  const directValue = getCaseInsensitiveProperty(node.properties, normalizedProperty);
  if (directValue !== undefined) {
    return directValue;
  }

  // keywords fallback to aliases when explicit keywords are missing
  if (normalizedProperty === 'keywords') {
    const aliasTokens = buildAliasTokens(node);
    if (aliasTokens.length > 0) {
      return aliasTokens;
    }
  }

  // Property not found -- emit W001 warning and return null (NULL semantics)
  warnings.push({
    code: 'W001',
    message: `Unknown property "${property}" on node "${node.id}" (labels: ${node.labels.join(', ')})`,
  });
  return null;
}

/** Get a property from a GraphEdge */
function getEdgeProperty(edge: GraphEdge, property: string): unknown {
  const normalizedProperty = property.toLowerCase();

  switch (normalizedProperty) {
    case 'id': return edge.id;
    case 'type': return edge.type;
    case 'source': return edge.source;
    case 'target': return edge.target;
  }

  const directValue = getCaseInsensitiveProperty(edge.properties, normalizedProperty);
  if (directValue !== undefined) {
    return directValue;
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

function patternPropertyMatches(nodeValue: unknown, patternValue: unknown): boolean {
  if (Array.isArray(nodeValue)) {
    if (Array.isArray(patternValue)) {
      return patternValue.every(item => valueArrayContains(nodeValue, item));
    }
    return valueArrayContains(nodeValue, patternValue);
  }

  if (typeof nodeValue === 'string' && typeof patternValue === 'string') {
    return nodeValue.toLowerCase() === patternValue.toLowerCase();
  }

  return nodeValue === patternValue;
}

function valueArrayContains(values: unknown[], target: unknown): boolean {
  if (typeof target === 'string') {
    const normalizedTarget = target.toLowerCase();
    return values.some(value =>
      typeof value === 'string' && value.toLowerCase() === normalizedTarget
    );
  }
  return values.some(value => value === target);
}

function getCaseInsensitiveProperty(
  properties: Record<string, unknown>,
  targetKey: string,
): unknown {
  for (const [key, value] of Object.entries(properties)) {
    if (key.toLowerCase() === targetKey) {
      return value;
    }
  }
  return undefined;
}

function buildAliasTokens(node: GraphNode): string[] {
  const rawSources: unknown[] = [];

  if (typeof node.properties.name === 'string') rawSources.push(node.properties.name);
  if (typeof node.properties.title === 'string') rawSources.push(node.properties.title);
  if (typeof node.properties.description === 'string') rawSources.push(node.properties.description);

  const aliases = getCaseInsensitiveProperty(node.properties, 'aliases');
  const keywords = getCaseInsensitiveProperty(node.properties, 'keywords');
  rawSources.push(aliases, keywords);

  const deduped = new Set<string>();
  const addTokens = (value: string): void => {
    deduped.add(value);
    const parts = value.toLowerCase().split(/[^a-z0-9_]+/);
    for (const part of parts) {
      if (part.length >= 3) {
        deduped.add(part);
      }
    }
  };

  for (const source of rawSources) {
    if (typeof source === 'string') {
      addTokens(source);
      continue;
    }
    if (Array.isArray(source)) {
      for (const item of source) {
        if (typeof item === 'string') {
          addTokens(item);
        }
      }
    }
  }

  return Array.from(deduped);
}
