// ---------------------------------------------------------------
// MODULE: SGQS Type Definitions
// All interfaces for the Skill Graph-Lite Query Script engine
// ---------------------------------------------------------------

// ---------------------------------------------------------------
// 1. GRAPH DATA MODEL
// ---------------------------------------------------------------

/**
 * A node in the skill graph, derived from a single markdown file.
 */
export interface GraphNode {
  /** Unique identifier: {skill-name}/{relative-path-without-extension} */
  id: string;

  /** Node type labels derived from file location (e.g., [":Node"], [":Index"]) */
  labels: string[];

  /** Properties extracted from YAML frontmatter */
  properties: Record<string, string | string[] | number | boolean | null>;

  /** Parent skill directory name */
  skill: string;

  /** Filesystem path relative to repository root */
  path: string;
}

/**
 * A directed edge in the skill graph, connecting two nodes.
 */
export interface GraphEdge {
  /** Unique identifier: {source-id}--{edge-type}--{target-id} */
  id: string;

  /** Edge type label (e.g., ":LINKS_TO", ":CONTAINS") */
  type: string;

  /** Source node ID */
  source: string;

  /** Target node ID */
  target: string;

  /** Additional properties extracted from the link context */
  properties: Record<string, string>;
}

/**
 * Complete in-memory representation of the skill graph.
 */
export interface SkillGraph {
  /** All nodes indexed by their unique ID */
  nodes: Map<string, GraphNode>;

  /** All edges in the graph */
  edges: GraphEdge[];

  /** Edge lookup by ID for O(1) access (avoids linear scans) */
  edgeById: Map<string, GraphEdge>;

  /** Adjacency index: node ID -> outbound edge IDs */
  outbound: Map<string, string[]>;

  /** Reverse adjacency index: node ID -> inbound edge IDs */
  inbound: Map<string, string[]>;
}

// ---------------------------------------------------------------
// 2. TOKEN TYPES
// ---------------------------------------------------------------

/** All valid token types produced by the lexer */
export type TokenType =
  | 'KEYWORD'
  | 'IDENTIFIER'
  | 'LABEL'
  | 'STRING'
  | 'INTEGER'
  | 'DOT'
  | 'COMMA'
  | 'LPAREN'
  | 'RPAREN'
  | 'LBRACKET'
  | 'RBRACKET'
  | 'LBRACE'
  | 'RBRACE'
  | 'DASH'
  | 'ARROW_R'
  | 'ARROW_L'
  | 'STAR'
  | 'DOTDOT'
  | 'EQ'
  | 'NEQ'
  | 'LT'
  | 'GT'
  | 'LTE'
  | 'GTE'
  | 'COLON'
  | 'EOF';

/** A single token produced by the lexer */
export interface Token {
  type: TokenType;
  value: string;
  position: number;
  line: number;
  column: number;
}

// ---------------------------------------------------------------
// 3. AST NODE TYPES
// ---------------------------------------------------------------

/** Root AST node for a complete SGQS query */
export interface QueryNode {
  kind: 'Query';
  match: MatchNode;
  where: WhereNode | null;
  return: ReturnNode;
}

/** MATCH clause containing one or more patterns */
export interface MatchNode {
  kind: 'Match';
  patterns: PatternNode[];
}

/** A single match pattern: alternating node and relationship elements */
export interface PatternNode {
  kind: 'Pattern';
  elements: (NodePatternNode | RelPatternNode)[];
}

/** A node pattern: (binding:Label {props}) */
export interface NodePatternNode {
  kind: 'NodePattern';
  binding: string | null;
  label: string | null;
  properties: PropertyMap | null;
}

/** A relationship pattern: -[binding:TYPE*range]-> */
export interface RelPatternNode {
  kind: 'RelPattern';
  binding: string | null;
  relType: string | null;
  direction: 'OUT' | 'IN' | 'BOTH';
  range: RangeNode | null;
}

/** Variable-length path range specification */
export interface RangeNode {
  kind: 'Range';
  min: number | null;
  max: number | null;
}

/** Property map for inline node filters */
export interface PropertyMap {
  entries: PropertyEntry[];
}

/** A single key-value pair in a property map */
export interface PropertyEntry {
  key: string;
  value: LiteralNode;
}

/** WHERE clause wrapping a condition expression */
export interface WhereNode {
  kind: 'Where';
  condition: ExpressionNode;
}

/** Union type for all WHERE condition expressions */
export type ExpressionNode =
  | ComparisonNode
  | LogicalNode
  | NotNode
  | NullCheckNode;

/** A comparison: property_ref OP value */
export interface ComparisonNode {
  kind: 'Comparison';
  left: PropertyRefNode;
  operator: '=' | '<>' | '<' | '>' | '<=' | '>=' | 'CONTAINS' | 'STARTS_WITH' | 'ENDS_WITH';
  right: LiteralNode;
}

/** Logical AND/OR combining two expressions */
export interface LogicalNode {
  kind: 'Logical';
  operator: 'AND' | 'OR';
  left: ExpressionNode;
  right: ExpressionNode;
}

/** NOT negation of an expression */
export interface NotNode {
  kind: 'Not';
  operand: ExpressionNode;
}

/** IS NULL / IS NOT NULL check */
export interface NullCheckNode {
  kind: 'NullCheck';
  property: PropertyRefNode;
  negated: boolean;
}

/** RETURN clause with optional DISTINCT and item list */
export interface ReturnNode {
  kind: 'Return';
  distinct: boolean;
  items: ReturnItemNode[];
}

/** A single return item with optional alias */
export interface ReturnItemNode {
  kind: 'ReturnItem';
  expression: ReturnExprNode;
  alias: string | null;
}

/** Union type for return expressions */
export type ReturnExprNode =
  | PropertyRefNode
  | VariableRefNode
  | AggregateNode;

/** Property access: variable.property */
export interface PropertyRefNode {
  kind: 'PropertyRef';
  variable: string;
  property: string;
}

/** Variable reference: returns full node/edge data */
export interface VariableRefNode {
  kind: 'VariableRef';
  name: string;
}

/** Aggregation function: COUNT or COLLECT */
export interface AggregateNode {
  kind: 'Aggregate';
  function: 'COUNT' | 'COLLECT';
  distinct: boolean;
  argument: PropertyRefNode | VariableRefNode | StarNode;
}

/** Represents COUNT(*) */
export interface StarNode {
  kind: 'Star';
}

/** Union type for all literal values */
export type LiteralNode =
  | StringLiteral
  | IntegerLiteral
  | BooleanLiteral
  | NullLiteral;

export interface StringLiteral {
  kind: 'StringLiteral';
  value: string;
}

export interface IntegerLiteral {
  kind: 'IntegerLiteral';
  value: number;
}

export interface BooleanLiteral {
  kind: 'BooleanLiteral';
  value: boolean;
}

export interface NullLiteral {
  kind: 'NullLiteral';
}

// ---------------------------------------------------------------
// 4. QUERY RESULT
// ---------------------------------------------------------------

/** Result of executing an SGQS query */
export interface SGQSResult {
  /** Column names in the result set */
  columns: string[];

  /** Result rows, each mapping column name to value */
  rows: Record<string, unknown>[];

  /** Errors encountered during execution (partial results may still be returned) */
  errors: SGQSErrorInfo[];
}

/** Structured error information */
export interface SGQSErrorInfo {
  code: string;
  message: string;
  position?: number;
  line?: number;
  column?: number;
}

// ---------------------------------------------------------------
// 5. CONSTANTS
// ---------------------------------------------------------------

/** All SGQS reserved keywords (uppercase canonical form) */
export const KEYWORDS = new Set([
  'MATCH', 'WHERE', 'RETURN', 'AND', 'OR', 'NOT', 'AS', 'DISTINCT',
  'CONTAINS', 'STARTS', 'WITH', 'ENDS', 'IS', 'NULL', 'TRUE', 'FALSE',
  'COUNT', 'COLLECT',
]);

/** Valid node labels */
export const VALID_LABELS = new Set([
  'Node', 'Index', 'Skill', 'Entrypoint', 'Reference', 'Asset', 'Document',
]);

/** Valid relationship types (without the colon prefix) */
export const VALID_REL_TYPES = new Set([
  'LINKS_TO', 'CONTAINS', 'REFERENCES', 'HAS_ENTRYPOINT', 'HAS_INDEX', 'DEPENDS_ON',
]);

/** Maximum traversal depth for unbounded variable-length paths */
export const MAX_TRAVERSAL_DEPTH = 10;
