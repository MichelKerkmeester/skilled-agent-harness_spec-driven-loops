// ---------------------------------------------------------------
// MODULE: SGQS Entry Point
// Public API and CLI interface for Skill Graph-Lite Query Script
// ---------------------------------------------------------------

import * as path from 'path';

// Public API exports
export { buildSkillGraph } from './graph-builder';
export { tokenize } from './lexer';
export { parse } from './parser';
export { execute } from './executor';
export * from './types';
export * from './errors';

// Import for internal use
import { buildSkillGraph } from './graph-builder';
import { tokenize } from './lexer';
import { parse } from './parser';
import { execute } from './executor';
import { SGQSResult } from './types';
import { SGQSError } from './errors';

// ---------------------------------------------------------------
// 1. CONVENIENCE FUNCTION
// ---------------------------------------------------------------

/**
 * Execute an SGQS query against the skill graph.
 *
 * This is the primary convenience function that combines all pipeline stages:
 * graph building, tokenization, parsing, and execution.
 *
 * @param queryString - The SGQS query string to execute
 * @param skillRoot - Absolute path to the skill root directory
 * @returns Query results with columns, rows, and any errors
 * @throws SGQSError on parse or semantic errors
 *
 * @example
 * ```typescript
 * const result = query(
 *   'MATCH (n:Node {skill: "workflows-git"}) RETURN n.name, n.description',
 *   '/path/to/.opencode/skill'
 * );
 * for (const row of result.rows) {
 *   console.log(row['n.name'], row['n.description']);
 * }
 * ```
 */
export function query(queryString: string, skillRoot: string): SGQSResult {
  const graph = buildSkillGraph(skillRoot);
  const tokens = tokenize(queryString);
  const ast = parse(tokens);
  return execute(ast, graph);
}

// ---------------------------------------------------------------
// 2. CLI MODE
// ---------------------------------------------------------------

/**
 * CLI entry point. Run with:
 *   node sgqs/index.js "MATCH (n:Node) RETURN n.name" [skillRoot]
 */
function runCli(): void {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    printHelp();
    process.exit(0);
  }

  const queryString = args[0];
  const skillRoot = args[1] || path.resolve(process.cwd(), '.opencode', 'skill');

  console.log(`SGQS v1.0`);
  console.log(`Query: ${queryString}`);
  console.log(`Skill root: ${skillRoot}`);
  console.log('---');

  try {
    // Build graph and report stats
    const graph = buildSkillGraph(skillRoot);
    console.log(`Graph: ${graph.nodes.size} nodes, ${graph.edges.length} edges`);
    console.log('---');

    // Tokenize
    const tokens = tokenize(queryString);

    // Parse
    const ast = parse(tokens);

    // Execute
    const result = execute(ast, graph);

    // Print results
    if (result.rows.length === 0) {
      console.log('(no results)');
    } else {
      // Print column headers
      console.log(result.columns.join('\t'));
      console.log(result.columns.map(c => '-'.repeat(Math.max(c.length, 8))).join('\t'));

      // Print rows
      for (const row of result.rows) {
        const values = result.columns.map(col => {
          const val = row[col];
          if (val === null || val === undefined) return 'NULL';
          if (typeof val === 'object') return JSON.stringify(val);
          return String(val);
        });
        console.log(values.join('\t'));
      }

      console.log('---');
      console.log(`${result.rows.length} row(s)`);
    }

    // Print any errors
    if (result.errors.length > 0) {
      console.error('\nErrors:');
      for (const err of result.errors) {
        console.error(`  [${err.code}] ${err.message}`);
      }
    }
  } catch (err) {
    if (err instanceof SGQSError) {
      console.error(`Error: ${err.message}`);
      process.exit(1);
    }
    throw err;
  }
}

function printHelp(): void {
  console.log(`
SGQS - Skill Graph-Lite Query Script v1.0

Usage:
  node sgqs/index.js <query> [skillRoot]

Arguments:
  <query>       SGQS query string (in quotes)
  [skillRoot]   Path to .opencode/skill/ directory (default: ./.opencode/skill)

Examples:
  node sgqs/index.js 'MATCH (n:Node) RETURN n.name'
  node sgqs/index.js 'MATCH (n:Node {skill: "workflows-git"}) RETURN n.name, n.description'
  node sgqs/index.js 'MATCH (n:Node)-[:LINKS_TO]->(m) RETURN n.name, m.name' /path/to/.opencode/skill
  node sgqs/index.js 'MATCH (n:Node) RETURN n.skill, COUNT(n) AS count'

Query Syntax (Cypher subset):
  MATCH   - Pattern matching: (node)-[rel]->(node)
  WHERE   - Filtering: n.prop = "value" AND m.prop > 1
  RETURN  - Projection: n.name, COUNT(n), DISTINCT n.skill

Node Labels: Node, Index, Skill, Entrypoint, Reference, Asset, Document
Rel Types:   LINKS_TO, CONTAINS, REFERENCES, HAS_ENTRYPOINT, HAS_INDEX, DEPENDS_ON
`);
}

// ---------------------------------------------------------------
// 3. AUTO-RUN CLI
// ---------------------------------------------------------------

// Detect if running as main module (not imported)
if (require.main === module) {
  runCli();
}
