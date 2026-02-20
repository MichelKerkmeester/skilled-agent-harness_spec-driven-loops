import * as path from 'path';
import { DEFAULT_BASE_PATH } from '../core';

export interface SgqsQueryArgs {
  queryString: string;
}

export async function handleMemorySkillGraphQuery(args: SgqsQueryArgs) {
  try {
    // Dynamic require to bypass TS rootDir restrictions between workspaces
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { query } = require('../../scripts/dist/sgqs/index.js');
    
    const skillRoot = path.join(DEFAULT_BASE_PATH, '.opencode', 'skill');
    const result = query(args.queryString, skillRoot);
    
    return {
      content: [{
        type: 'text' as const,
        text: JSON.stringify({
          columns: result.columns,
          rows: result.rows,
          errors: result.errors,
          rowCount: result.rows.length
        }, null, 2)
      }]
    };
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    return {
      content: [{
        type: 'text' as const,
        text: JSON.stringify({ error: err.message }, null, 2)
      }],
      isError: true
    };
  }
}
