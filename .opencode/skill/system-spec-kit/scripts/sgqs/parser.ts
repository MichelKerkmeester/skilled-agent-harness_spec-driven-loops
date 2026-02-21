// ---------------------------------------------------------------
// MODULE: SGQS Parser
// Recursive descent parser producing AST from token stream
// ---------------------------------------------------------------

import {
  Token, TokenType, QueryNode, MatchNode, PatternNode,
  NodePatternNode, RelPatternNode, RangeNode, PropertyMap, PropertyEntry,
  WhereNode, ExpressionNode, ComparisonNode, LogicalNode, NotNode, NullCheckNode,
  ReturnNode, ReturnItemNode, ReturnExprNode, PropertyRefNode, VariableRefNode,
  AggregateNode, StarNode, LiteralNode,
  VALID_LABELS, VALID_REL_TYPES, KEYWORDS,
} from './types';
import {
  UnexpectedTokenError, MissingClauseError, InvalidRangeError,
  DuplicateBindingError, UnboundVariableError, UnknownLabelError, UnknownRelTypeError,
} from './errors';

// ---------------------------------------------------------------
// 1. PARSER STATE
// ---------------------------------------------------------------

interface ParserState {
  tokens: Token[];
  pos: number;
}

// ---------------------------------------------------------------
// 2. HELPERS
// ---------------------------------------------------------------

function peek(state: ParserState): Token {
  return state.tokens[state.pos];
}

function advance(state: ParserState): Token {
  const tok = state.tokens[state.pos];
  state.pos++;
  return tok;
}

function expect(state: ParserState, type: TokenType, value?: string): Token {
  const tok = peek(state);
  if (tok.type !== type || (value !== undefined && tok.value !== value)) {
    const expected = value ? `${type}("${value}")` : type;
    const found = tok.value ? `${tok.type}("${tok.value}")` : tok.type;
    throw new UnexpectedTokenError(expected, found, tok.position, tok.line, tok.column);
  }
  return advance(state);
}

function isKeyword(state: ParserState, value: string): boolean {
  const tok = peek(state);
  return tok.type === 'KEYWORD' && tok.value === value;
}

function check(state: ParserState, type: TokenType): boolean {
  return peek(state).type === type;
}

// ---------------------------------------------------------------
// 3. MAIN PARSE ENTRY POINT
// ---------------------------------------------------------------

/**
 * Parse a stream of tokens into an SGQS AST.
 *
 * @param tokens - Token stream from the lexer (must end with EOF)
 * @returns Parsed AST root node
 * @throws SGQSError on parse or semantic errors
 */
export function parse(tokens: Token[]): QueryNode {
  const state: ParserState = { tokens, pos: 0 };

  // Query must start with MATCH
  if (!isKeyword(state, 'MATCH')) {
    const tok = peek(state);
    throw new MissingClauseError('MATCH', tok.position, tok.line, tok.column);
  }

  const match = parseMatchClause(state);

  // Optional WHERE clause
  let where: WhereNode | null = null;
  if (isKeyword(state, 'WHERE')) {
    where = parseWhereClause(state);
  }

  // RETURN clause is required
  if (!isKeyword(state, 'RETURN')) {
    const tok = peek(state);
    throw new MissingClauseError('RETURN', tok.position, tok.line, tok.column);
  }

  const ret = parseReturnClause(state);

  // Expect EOF
  if (!check(state, 'EOF')) {
    const tok = peek(state);
    throw new UnexpectedTokenError('end of query', `${tok.type}("${tok.value}")`, tok.position, tok.line, tok.column);
  }

  const ast: QueryNode = {
    kind: 'Query',
    match,
    where,
    return: ret,
  };

  // Post-parse semantic validation
  validateBindings(ast);

  return ast;
}

// ---------------------------------------------------------------
// 4. MATCH CLAUSE
// ---------------------------------------------------------------

function parseMatchClause(state: ParserState): MatchNode {
  expect(state, 'KEYWORD', 'MATCH');

  const patterns: PatternNode[] = [];
  patterns.push(parsePattern(state));

  while (check(state, 'COMMA')) {
    advance(state); // consume comma
    patterns.push(parsePattern(state));
  }

  return { kind: 'Match', patterns };
}

function parsePattern(state: ParserState): PatternNode {
  const elements: (NodePatternNode | RelPatternNode)[] = [];

  // A pattern always starts with a node pattern
  elements.push(parseNodePattern(state));

  // Then alternating rel_chain: rel_pattern node_pattern
  while (isRelPatternStart(state)) {
    elements.push(parseRelPattern(state));
    elements.push(parseNodePattern(state));
  }

  return { kind: 'Pattern', elements };
}

function isRelPatternStart(state: ParserState): boolean {
  const tok = peek(state);
  // Relationship patterns start with - or <-
  return tok.type === 'DASH' || tok.type === 'ARROW_L';
}

// ---------------------------------------------------------------
// 5. NODE PATTERN
// ---------------------------------------------------------------

function parseNodePattern(state: ParserState): NodePatternNode {
  expect(state, 'LPAREN');

  let binding: string | null = null;
  let label: string | null = null;
  let properties: PropertyMap | null = null;

  // Optional binding (IDENTIFIER)
  if (check(state, 'IDENTIFIER')) {
    binding = advance(state).value;
  }

  // Optional label (:Label)
  if (check(state, 'LABEL')) {
    label = advance(state).value;
  }

  // Optional properties ({key: value, ...})
  if (check(state, 'LBRACE')) {
    properties = parsePropertyMap(state);
  }

  expect(state, 'RPAREN');

  return { kind: 'NodePattern', binding, label, properties };
}

// ---------------------------------------------------------------
// 6. RELATIONSHIP PATTERN
// ---------------------------------------------------------------

function parseRelPattern(state: ParserState): RelPatternNode {
  let direction: 'OUT' | 'IN' | 'BOTH';

  // Determine direction based on starting tokens
  if (peek(state).type === 'ARROW_L') {
    // <-[...]-
    advance(state); // consume <-
    direction = 'IN';
  } else {
    // -[...]-> or -[...]-
    expect(state, 'DASH');
    direction = 'BOTH'; // Will be determined after we see the closing
  }

  expect(state, 'LBRACKET');

  let binding: string | null = null;
  let relType: string | null = null;
  let range: RangeNode | null = null;

  // Optional binding (IDENTIFIER)
  if (check(state, 'IDENTIFIER')) {
    binding = advance(state).value;
  }

  // Optional relationship type (:TYPE)
  if (check(state, 'LABEL')) {
    relType = advance(state).value;
  }

  // Optional range (*min..max)
  if (check(state, 'STAR')) {
    range = parseRangeExpr(state);
  }

  expect(state, 'RBRACKET');

  // Determine direction from closing tokens
  if (direction === 'IN') {
    // <-[...]-  -- expect DASH at end
    expect(state, 'DASH');
    direction = 'IN';
  } else {
    // After ]-
    if (check(state, 'ARROW_R')) {
      advance(state); // consume ->
      direction = 'OUT';
    } else if (check(state, 'DASH')) {
      advance(state); // consume -
      // Check if next is > for -> (manual disambiguation)
      if (check(state, 'GT')) {
        advance(state);
        direction = 'OUT';
      } else {
        direction = 'BOTH';
      }
    } else {
      // The ] token was followed by -> as ARROW_R
      // This case is handled above
      const tok = peek(state);
      throw new UnexpectedTokenError(
        '"->" or "-"', `${tok.type}("${tok.value}")`,
        tok.position, tok.line, tok.column
      );
    }
  }

  return { kind: 'RelPattern', binding, relType, direction, range };
}

function parseRangeExpr(state: ParserState): RangeNode {
  const starTok = expect(state, 'STAR');
  let min: number | null = null;
  let max: number | null = null;

  // Check for integer after *
  if (check(state, 'INTEGER')) {
    min = parseInt(advance(state).value, 10);

    // Check for ..
    if (check(state, 'DOTDOT')) {
      advance(state);
      if (check(state, 'INTEGER')) {
        max = parseInt(advance(state).value, 10);
      }
      // *N.. means N to engine max
    } else {
      // *N means exactly N hops
      max = min;
    }
  } else if (check(state, 'DOTDOT')) {
    // *..N means 0 to N
    advance(state);
    min = 0;
    if (check(state, 'INTEGER')) {
      max = parseInt(advance(state).value, 10);
    }
  }
  // Bare * means 0 to engine max (both null)

  // Validate: min must not exceed max
  if (min !== null && max !== null && min > max) {
    throw new InvalidRangeError(
      `Range minimum (${min}) exceeds maximum (${max})`,
      starTok.position, starTok.line, starTok.column
    );
  }

  return { kind: 'Range', min, max };
}

// ---------------------------------------------------------------
// 7. PROPERTY MAP
// ---------------------------------------------------------------

function parsePropertyMap(state: ParserState): PropertyMap {
  expect(state, 'LBRACE');

  const entries: PropertyEntry[] = [];
  entries.push(parsePropertyPair(state));

  while (check(state, 'COMMA')) {
    advance(state);
    entries.push(parsePropertyPair(state));
  }

  expect(state, 'RBRACE');

  return { entries };
}

function parsePropertyPair(state: ParserState): PropertyEntry {
  const keyTok = expect(state, 'IDENTIFIER');
  expect(state, 'COLON');
  const value = parseLiteral(state);

  return { key: keyTok.value, value };
}

// ---------------------------------------------------------------
// 8. LITERALS
// ---------------------------------------------------------------

function parseLiteral(state: ParserState): LiteralNode {
  const tok = peek(state);

  if (tok.type === 'STRING') {
    advance(state);
    return { kind: 'StringLiteral', value: tok.value };
  }

  if (tok.type === 'INTEGER') {
    advance(state);
    return { kind: 'IntegerLiteral', value: parseInt(tok.value, 10) };
  }

  if (tok.type === 'KEYWORD') {
    if (tok.value === 'TRUE') {
      advance(state);
      return { kind: 'BooleanLiteral', value: true };
    }
    if (tok.value === 'FALSE') {
      advance(state);
      return { kind: 'BooleanLiteral', value: false };
    }
    if (tok.value === 'NULL') {
      advance(state);
      return { kind: 'NullLiteral' };
    }
  }

  throw new UnexpectedTokenError(
    'literal value (string, integer, true, false, null)',
    `${tok.type}("${tok.value}")`,
    tok.position, tok.line, tok.column
  );
}

// ---------------------------------------------------------------
// 9. WHERE CLAUSE
// ---------------------------------------------------------------

function parseWhereClause(state: ParserState): WhereNode {
  expect(state, 'KEYWORD', 'WHERE');
  const condition = parseOrExpr(state);
  return { kind: 'Where', condition };
}

function parseOrExpr(state: ParserState): ExpressionNode {
  let left = parseAndExpr(state);

  while (isKeyword(state, 'OR')) {
    advance(state);
    const right = parseAndExpr(state);
    left = { kind: 'Logical', operator: 'OR', left, right } as LogicalNode;
  }

  return left;
}

function parseAndExpr(state: ParserState): ExpressionNode {
  let left = parseNotExpr(state);

  while (isKeyword(state, 'AND')) {
    advance(state);
    const right = parseNotExpr(state);
    left = { kind: 'Logical', operator: 'AND', left, right } as LogicalNode;
  }

  return left;
}

function parseNotExpr(state: ParserState): ExpressionNode {
  if (isKeyword(state, 'NOT')) {
    advance(state);
    const operand = parseNotExpr(state);
    return { kind: 'Not', operand } as NotNode;
  }

  // Parenthesized expression
  if (check(state, 'LPAREN')) {
    advance(state);
    const expr = parseOrExpr(state);
    expect(state, 'RPAREN');
    return expr;
  }

  // Comparison
  return parseComparison(state);
}

function parseComparison(state: ParserState): ExpressionNode {
  const propRef = parsePropertyRef(state);

  const tok = peek(state);

  // IS NULL / IS NOT NULL
  if (isKeyword(state, 'IS')) {
    advance(state);
    if (isKeyword(state, 'NOT')) {
      advance(state);
      expect(state, 'KEYWORD', 'NULL');
      return { kind: 'NullCheck', property: propRef, negated: true } as NullCheckNode;
    }
    expect(state, 'KEYWORD', 'NULL');
    return { kind: 'NullCheck', property: propRef, negated: false } as NullCheckNode;
  }

  // CONTAINS
  if (isKeyword(state, 'CONTAINS')) {
    advance(state);
    const right = parseComparisonRHS(state);
    return { kind: 'Comparison', left: propRef, operator: 'CONTAINS', right } as ComparisonNode;
  }

  // STARTS WITH
  if (isKeyword(state, 'STARTS')) {
    advance(state);
    expect(state, 'KEYWORD', 'WITH');
    const right = parseComparisonRHS(state);
    return { kind: 'Comparison', left: propRef, operator: 'STARTS_WITH', right } as ComparisonNode;
  }

  // ENDS WITH
  if (isKeyword(state, 'ENDS')) {
    advance(state);
    expect(state, 'KEYWORD', 'WITH');
    const right = parseComparisonRHS(state);
    return { kind: 'Comparison', left: propRef, operator: 'ENDS_WITH', right } as ComparisonNode;
  }

  // Standard comparison operators
  let operator: ComparisonNode['operator'];
  if (check(state, 'EQ')) { advance(state); operator = '='; }
  else if (check(state, 'NEQ')) { advance(state); operator = '<>'; }
  else if (check(state, 'LT')) { advance(state); operator = '<'; }
  else if (check(state, 'GT')) { advance(state); operator = '>'; }
  else if (check(state, 'LTE')) { advance(state); operator = '<='; }
  else if (check(state, 'GTE')) { advance(state); operator = '>='; }
  else {
    throw new UnexpectedTokenError(
      'comparison operator',
      `${tok.type}("${tok.value}")`,
      tok.position, tok.line, tok.column
    );
  }

  const right = parseComparisonRHS(state);
  return { kind: 'Comparison', left: propRef, operator, right } as ComparisonNode;
}

/** Parse the right-hand side of a comparison: either a property ref (n.prop) or a literal */
function parseComparisonRHS(state: ParserState): LiteralNode | PropertyRefNode {
  // Lookahead: IDENTIFIER DOT means property reference
  if (check(state, 'IDENTIFIER') &&
      state.pos + 1 < state.tokens.length &&
      state.tokens[state.pos + 1].type === 'DOT') {
    return parsePropertyRef(state);
  }
  return parseLiteral(state);
}

function parsePropertyRef(state: ParserState): PropertyRefNode {
  const varTok = expect(state, 'IDENTIFIER');
  expect(state, 'DOT');
  // After DOT, identifiers may shadow keywords
  const propTok = peek(state);
  if (propTok.type !== 'IDENTIFIER' && propTok.type !== 'KEYWORD') {
    throw new UnexpectedTokenError(
      'property name',
      `${propTok.type}("${propTok.value}")`,
      propTok.position, propTok.line, propTok.column
    );
  }
  advance(state);

  return {
    kind: 'PropertyRef',
    variable: varTok.value,
    property: propTok.value.toLowerCase() === propTok.value ? propTok.value : propTok.value,
  };
}

// ---------------------------------------------------------------
// 10. RETURN CLAUSE
// ---------------------------------------------------------------

function parseReturnClause(state: ParserState): ReturnNode {
  expect(state, 'KEYWORD', 'RETURN');

  let distinct = false;
  if (isKeyword(state, 'DISTINCT')) {
    advance(state);
    distinct = true;
  }

  const items: ReturnItemNode[] = [];
  items.push(parseReturnItem(state));

  while (check(state, 'COMMA')) {
    advance(state);
    items.push(parseReturnItem(state));
  }

  return { kind: 'Return', distinct, items };
}

function parseReturnItem(state: ParserState): ReturnItemNode {
  const expression = parseReturnExpr(state);

  let alias: string | null = null;
  if (isKeyword(state, 'AS')) {
    advance(state);
    const aliasTok = peek(state);
    if (aliasTok.type === 'IDENTIFIER' || aliasTok.type === 'KEYWORD') {
      advance(state);
      alias = aliasTok.value.toLowerCase();
    } else {
      throw new UnexpectedTokenError(
        'alias name',
        `${aliasTok.type}("${aliasTok.value}")`,
        aliasTok.position, aliasTok.line, aliasTok.column
      );
    }
  }

  return { kind: 'ReturnItem', expression, alias };
}

function parseReturnExpr(state: ParserState): ReturnExprNode {
  const tok = peek(state);

  // Aggregate functions: COUNT(...) or COLLECT(...)
  if (tok.type === 'KEYWORD' && (tok.value === 'COUNT' || tok.value === 'COLLECT')) {
    return parseAggregateFunc(state);
  }

  // Property reference: IDENT.IDENT
  if (tok.type === 'IDENTIFIER') {
    // Look ahead for DOT
    if (state.pos + 1 < state.tokens.length && state.tokens[state.pos + 1].type === 'DOT') {
      return parsePropertyRef(state);
    }

    // Variable reference
    advance(state);
    return { kind: 'VariableRef', name: tok.value } as VariableRefNode;
  }

  throw new UnexpectedTokenError(
    'return expression (property, variable, or aggregate)',
    `${tok.type}("${tok.value}")`,
    tok.position, tok.line, tok.column
  );
}

function parseAggregateFunc(state: ParserState): AggregateNode {
  const funcTok = advance(state);
  const funcName = funcTok.value as 'COUNT' | 'COLLECT';

  expect(state, 'LPAREN');

  let distinct = false;
  if (isKeyword(state, 'DISTINCT')) {
    advance(state);
    distinct = true;
  }

  let argument: PropertyRefNode | VariableRefNode | StarNode;

  if (check(state, 'STAR')) {
    advance(state);
    argument = { kind: 'Star' } as StarNode;
  } else if (check(state, 'IDENTIFIER')) {
    // Check for property ref (IDENT.IDENT) or variable ref (IDENT)
    if (state.pos + 1 < state.tokens.length && state.tokens[state.pos + 1].type === 'DOT') {
      argument = parsePropertyRef(state);
    } else {
      const tok = advance(state);
      argument = { kind: 'VariableRef', name: tok.value } as VariableRefNode;
    }
  } else {
    const tok = peek(state);
    throw new UnexpectedTokenError(
      'aggregate argument (*, property, or variable)',
      `${tok.type}("${tok.value}")`,
      tok.position, tok.line, tok.column
    );
  }

  expect(state, 'RPAREN');

  return { kind: 'Aggregate', function: funcName, distinct, argument };
}

// ---------------------------------------------------------------
// 11. SEMANTIC VALIDATION
// ---------------------------------------------------------------

/**
 * Post-parse semantic checks:
 * - All variables used in WHERE/RETURN are bound in MATCH
 * - No duplicate bindings
 * - Labels and relationship types are valid
 */
function validateBindings(ast: QueryNode): void {
  const bindings = new Map<string, 'node' | 'rel'>();

  // Collect bindings from MATCH patterns
  for (const pattern of ast.match.patterns) {
    for (const element of pattern.elements) {
      if (element.kind === 'NodePattern' && element.binding) {
        if (bindings.has(element.binding)) {
          // Allow same variable in multiple patterns (join semantics)
          // Only error if bound to different element types
          if (bindings.get(element.binding) !== 'node') {
            throw new DuplicateBindingError(element.binding);
          }
        }
        bindings.set(element.binding, 'node');
      }
      if (element.kind === 'RelPattern' && element.binding) {
        if (bindings.has(element.binding)) {
          throw new DuplicateBindingError(element.binding);
        }
        bindings.set(element.binding, 'rel');
      }
    }
  }

  // Validate labels
  for (const pattern of ast.match.patterns) {
    for (const element of pattern.elements) {
      if (element.kind === 'NodePattern' && element.label) {
        if (!VALID_LABELS.has(element.label)) {
          throw new UnknownLabelError(element.label);
        }
      }
      if (element.kind === 'RelPattern' && element.relType) {
        if (!VALID_REL_TYPES.has(element.relType)) {
          throw new UnknownRelTypeError(element.relType);
        }
      }
    }
  }

  // Validate WHERE variables
  if (ast.where) {
    validateExprBindings(ast.where.condition, bindings);
  }

  // Validate RETURN variables
  for (const item of ast.return.items) {
    validateReturnExprBindings(item.expression, bindings);
  }
}

function validateExprBindings(expr: ExpressionNode, bindings: Map<string, 'node' | 'rel'>): void {
  switch (expr.kind) {
    case 'Comparison':
      validatePropRefBinding(expr.left, bindings);
      if (expr.right.kind === 'PropertyRef') {
        validatePropRefBinding(expr.right, bindings);
      }
      break;
    case 'NullCheck':
      validatePropRefBinding(expr.property, bindings);
      break;
    case 'Logical':
      validateExprBindings(expr.left, bindings);
      validateExprBindings(expr.right, bindings);
      break;
    case 'Not':
      validateExprBindings(expr.operand, bindings);
      break;
  }
}

function validatePropRefBinding(ref: PropertyRefNode, bindings: Map<string, 'node' | 'rel'>): void {
  if (!bindings.has(ref.variable)) {
    throw new UnboundVariableError(ref.variable);
  }
}

function validateReturnExprBindings(expr: ReturnExprNode, bindings: Map<string, 'node' | 'rel'>): void {
  switch (expr.kind) {
    case 'PropertyRef':
      validatePropRefBinding(expr, bindings);
      break;
    case 'VariableRef':
      if (!bindings.has(expr.name)) {
        throw new UnboundVariableError(expr.name);
      }
      break;
    case 'Aggregate':
      if (expr.argument.kind === 'PropertyRef') {
        validatePropRefBinding(expr.argument, bindings);
      } else if (expr.argument.kind === 'VariableRef') {
        if (!bindings.has(expr.argument.name)) {
          throw new UnboundVariableError(expr.argument.name);
        }
      }
      // StarNode is always valid
      break;
  }
}
