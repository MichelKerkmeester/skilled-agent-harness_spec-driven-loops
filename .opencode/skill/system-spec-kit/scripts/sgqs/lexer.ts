// ---------------------------------------------------------------
// MODULE: SGQS Lexer
// Tokenizes SGQS query strings into a stream of typed tokens
// ---------------------------------------------------------------

import { Token, TokenType, KEYWORDS } from './types';
import { SyntaxError as SGQSSyntaxError, UnterminatedStringError } from './errors';

// ---------------------------------------------------------------
// 1. LEXER STATE
// ---------------------------------------------------------------

interface LexerState {
  source: string;
  pos: number;
  line: number;
  column: number;
  tokens: Token[];
}

// ---------------------------------------------------------------
// 2. HELPERS
// ---------------------------------------------------------------

/** Check if character is a letter or underscore (identifier start) */
function isIdentStart(ch: string): boolean {
  return /[a-zA-Z_]/.test(ch);
}

/** Check if character is valid in identifier body */
function isIdentChar(ch: string): boolean {
  return /[a-zA-Z0-9_\-]/.test(ch);
}

/** Check if character is a digit */
function isDigit(ch: string): boolean {
  return /[0-9]/.test(ch);
}

/** Check if character is whitespace */
function isWhitespace(ch: string): boolean {
  return ch === ' ' || ch === '\t' || ch === '\r' || ch === '\n';
}

/** Get the last non-EOF token type */
function lastTokenType(tokens: Token[]): TokenType | null {
  for (let i = tokens.length - 1; i >= 0; i--) {
    if (tokens[i].type !== 'EOF') {
      return tokens[i].type;
    }
  }
  return null;
}

/** Check if we are inside brackets or parens by scanning token history */
function isInsideBracketsOrParens(tokens: Token[]): boolean {
  let parenDepth = 0;
  let bracketDepth = 0;
  for (const tok of tokens) {
    if (tok.type === 'LPAREN') parenDepth++;
    if (tok.type === 'RPAREN') parenDepth--;
    if (tok.type === 'LBRACKET') bracketDepth++;
    if (tok.type === 'RBRACKET') bracketDepth--;
  }
  return parenDepth > 0 || bracketDepth > 0;
}

/** Check if we are inside square brackets specifically */
function isInsideBrackets(tokens: Token[]): boolean {
  let bracketDepth = 0;
  for (const tok of tokens) {
    if (tok.type === 'LBRACKET') bracketDepth++;
    if (tok.type === 'RBRACKET') bracketDepth--;
  }
  return bracketDepth > 0;
}

/** Check if the last token before current position indicates relationship context */
function isAfterPatternClose(tokens: Token[]): boolean {
  const last = lastTokenType(tokens);
  return last === 'RPAREN' || last === 'RBRACKET';
}

// ---------------------------------------------------------------
// 3. MAIN TOKENIZER
// ---------------------------------------------------------------

/**
 * Tokenize an SGQS query string into a stream of tokens.
 *
 * @param source - The SGQS query string to tokenize
 * @returns Array of tokens ending with EOF
 * @throws SGQSSyntaxError on invalid characters
 * @throws UnterminatedStringError on unclosed string literals
 */
export function tokenize(source: string): Token[] {
  const state: LexerState = {
    source,
    pos: 0,
    line: 1,
    column: 1,
    tokens: [],
  };

  while (state.pos < source.length) {
    const ch = source[state.pos];

    // Skip whitespace
    if (isWhitespace(ch)) {
      skipWhitespace(state);
      continue;
    }

    // Skip line comments: -- to end of line
    if (ch === '-' && state.pos + 1 < source.length && source[state.pos + 1] === '-'
        && !isAfterPatternClose(state.tokens) && !isInsideBrackets(state.tokens)) {
      skipComment(state);
      continue;
    }

    // String literal
    if (ch === '"') {
      readString(state);
      continue;
    }

    // Integer literal
    if (isDigit(ch)) {
      readInteger(state);
      continue;
    }

    // Identifier or keyword
    if (isIdentStart(ch)) {
      readIdentifierOrKeyword(state);
      continue;
    }

    // Multi-character operators and symbols
    if (readOperatorOrSymbol(state)) {
      continue;
    }

    // Unknown character
    throw new SGQSSyntaxError(
      `Unexpected character: '${ch}'`,
      state.pos, state.line, state.column
    );
  }

  // Append EOF token
  state.tokens.push({
    type: 'EOF',
    value: '',
    position: state.pos,
    line: state.line,
    column: state.column,
  });

  return state.tokens;
}

// ---------------------------------------------------------------
// 4. TOKEN READERS
// ---------------------------------------------------------------

function skipWhitespace(state: LexerState): void {
  while (state.pos < state.source.length && isWhitespace(state.source[state.pos])) {
    if (state.source[state.pos] === '\n') {
      state.line++;
      state.column = 1;
    } else {
      state.column++;
    }
    state.pos++;
  }
}

function skipComment(state: LexerState): void {
  // Skip past -- to end of line
  while (state.pos < state.source.length && state.source[state.pos] !== '\n') {
    state.pos++;
    state.column++;
  }
}

function readString(state: LexerState): void {
  const startPos = state.pos;
  const startLine = state.line;
  const startCol = state.column;

  state.pos++; // skip opening "
  state.column++;

  let value = '';
  while (state.pos < state.source.length) {
    const ch = state.source[state.pos];

    if (ch === '\\' && state.pos + 1 < state.source.length) {
      const next = state.source[state.pos + 1];
      if (next === '"' || next === '\\') {
        value += next;
        state.pos += 2;
        state.column += 2;
        continue;
      }
    }

    if (ch === '"') {
      state.pos++;
      state.column++;
      state.tokens.push({
        type: 'STRING',
        value,
        position: startPos,
        line: startLine,
        column: startCol,
      });
      return;
    }

    if (ch === '\n') {
      state.line++;
      state.column = 1;
    } else {
      state.column++;
    }
    value += ch;
    state.pos++;
  }

  throw new UnterminatedStringError(startPos, startLine, startCol);
}

function readInteger(state: LexerState): void {
  const startPos = state.pos;
  const startLine = state.line;
  const startCol = state.column;

  let value = '';
  while (state.pos < state.source.length && isDigit(state.source[state.pos])) {
    value += state.source[state.pos];
    state.pos++;
    state.column++;
  }

  state.tokens.push({
    type: 'INTEGER',
    value,
    position: startPos,
    line: startLine,
    column: startCol,
  });
}

function readIdentifierOrKeyword(state: LexerState): void {
  const startPos = state.pos;
  const startLine = state.line;
  const startCol = state.column;

  let value = '';
  while (state.pos < state.source.length && isIdentChar(state.source[state.pos])) {
    value += state.source[state.pos];
    state.pos++;
    state.column++;
  }

  // Check if the previous token was DOT -- if so, treat as IDENTIFIER even if keyword
  const prevType = lastTokenType(state.tokens);
  const upper = value.toUpperCase();

  if (prevType !== 'DOT' && KEYWORDS.has(upper)) {
    // TRUE and FALSE are special: they are boolean literals represented as keywords
    state.tokens.push({
      type: 'KEYWORD',
      value: upper,
      position: startPos,
      line: startLine,
      column: startCol,
    });
  } else {
    state.tokens.push({
      type: 'IDENTIFIER',
      value,
      position: startPos,
      line: startLine,
      column: startCol,
    });
  }
}

/**
 * Read operators and symbols. Returns true if a token was consumed.
 *
 * Handles disambiguation rules from Section 3.2:
 * - `<-` vs `<` then other
 * - `->` vs `-` then other
 * - `..` vs `.`
 * - `:` as label prefix inside brackets/parens vs COLON elsewhere
 */
function readOperatorOrSymbol(state: LexerState): boolean {
  const ch = state.source[state.pos];
  const next = state.pos + 1 < state.source.length ? state.source[state.pos + 1] : '';
  const startPos = state.pos;
  const startLine = state.line;
  const startCol = state.column;

  function emit(type: TokenType, value: string, len: number): void {
    state.tokens.push({ type, value, position: startPos, line: startLine, column: startCol });
    state.pos += len;
    state.column += len;
  }

  switch (ch) {
    case '(':
      emit('LPAREN', '(', 1);
      return true;
    case ')':
      emit('RPAREN', ')', 1);
      return true;
    case '[':
      emit('LBRACKET', '[', 1);
      return true;
    case ']':
      emit('RBRACKET', ']', 1);
      return true;
    case '{':
      emit('LBRACE', '{', 1);
      return true;
    case '}':
      emit('RBRACE', '}', 1);
      return true;
    case ',':
      emit('COMMA', ',', 1);
      return true;
    case '*':
      emit('STAR', '*', 1);
      return true;
    case '=':
      emit('EQ', '=', 1);
      return true;

    case '.':
      // Disambiguation: .. vs .
      if (next === '.') {
        emit('DOTDOT', '..', 2);
      } else {
        emit('DOT', '.', 1);
      }
      return true;

    case '<':
      // Disambiguation: <- vs <> vs <= vs <
      if (next === '-') {
        // <- arrow: relationship context (after ) or ])
        if (isAfterPatternClose(state.tokens)) {
          emit('ARROW_L', '<-', 2);
        } else {
          // Tokenize as LT then DASH
          emit('LT', '<', 1);
        }
      } else if (next === '>') {
        emit('NEQ', '<>', 2);
      } else if (next === '=') {
        emit('LTE', '<=', 2);
      } else {
        emit('LT', '<', 1);
      }
      return true;

    case '>':
      // >= vs >
      if (next === '=') {
        emit('GTE', '>=', 2);
      } else {
        emit('GT', '>', 1);
      }
      return true;

    case '-':
      // Disambiguation: -> vs -[ vs - (as comment handled above)
      if (next === '>') {
        // -> arrow: after ] in relationship context
        if (isAfterPatternClose(state.tokens)) {
          emit('ARROW_R', '->', 2);
        } else {
          // Tokenize as DASH then GT separately
          emit('DASH', '-', 1);
        }
      } else if (next === '[') {
        // -[ relationship open: emit DASH, then LBRACKET will be read next
        emit('DASH', '-', 1);
      } else {
        emit('DASH', '-', 1);
      }
      return true;

    case ':':
      // Inside brackets/parens: label prefix, otherwise COLON
      if (isInsideBracketsOrParens(state.tokens)) {
        // Read the label value
        state.pos++;
        state.column++;
        if (state.pos < state.source.length && isIdentStart(state.source[state.pos])) {
          let label = '';
          const labelStart = state.pos;
          while (state.pos < state.source.length && isIdentChar(state.source[state.pos])) {
            label += state.source[state.pos];
            state.pos++;
            state.column++;
          }
          state.tokens.push({
            type: 'LABEL',
            value: label,
            position: startPos,
            line: startLine,
            column: startCol,
          });
        } else {
          // Bare colon inside brackets (property map separator)
          state.tokens.push({
            type: 'COLON',
            value: ':',
            position: startPos,
            line: startLine,
            column: startCol,
          });
        }
      } else {
        emit('COLON', ':', 1);
      }
      return true;

    default:
      return false;
  }
}
