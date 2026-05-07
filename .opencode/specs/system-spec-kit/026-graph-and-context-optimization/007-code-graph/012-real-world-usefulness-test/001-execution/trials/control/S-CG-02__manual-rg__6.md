# Control: .opencode/skills/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts

## Import/header lines
```
8:import Database from 'better-sqlite3';
9:import { createHash } from 'node:crypto';
10:import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, statSync } from 'node:fs';
11:import { basename, dirname, join, relative } from 'node:path';
12:import { DATABASE_DIR } from '../../core/config.js';
17:import { checkSqliteIntegrity } from '../utils/sqlite-integrity.js';

```

## Basename dependents
```
.opencode/skills/system-spec-kit/mcp_server/context-server.ts:91:} from './lib/skill-graph/skill-graph-db.js';
.opencode/skills/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-rebuild.ts:7:import { indexSkillMetadata } from '../../lib/skill-graph/skill-graph-db.js';
.opencode/skills/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-rebuild.ts:16:import type { SkillGraphIndexResult } from '../../lib/skill-graph/skill-graph-db.js';
.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/daemon/watcher.ts:9:import { indexSkillMetadata } from '../../../lib/skill-graph/skill-graph-db.js';
.opencode/skills/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-queries.ts:15:} from './skill-graph-db.js';
.opencode/skills/system-spec-kit/mcp_server/lib/utils/sqlite-integrity.ts:5:// callers (e.g. `lib/skill-graph/skill-graph-db.ts`, future graph DB modules)
.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/skill-graph-db.vitest.ts:9:import { closeDb, getDb, indexSkillMetadata, initDb } from '../../lib/skill-graph/skill-graph-db.js';
.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/skill-graph-db.vitest.ts:10:import { writeGraphMetadata } from '../../tests/fixtures/skill-graph-db.js';
.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/skill-graph-db.vitest.ts:19:    const root = mkdtempSync(join(tmpdir(), 'skill-graph-db-'));
.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/skill-graph-db.vitest.ts:55:    const root = mkdtempSync(join(tmpdir(), 'skill-graph-db-'));
.opencode/skills/system-spec-kit/mcp_server/handlers/skill-graph/query.ts:7:import type { SkillFamily } from '../../lib/skill-graph/skill-graph-db.js';
.opencode/skills/system-spec-kit/mcp_server/handlers/skill-graph/scan.ts:7:import { indexSkillMetadata } from '../../lib/skill-graph/skill-graph-db.js';
.opencode/skills/system-spec-kit/mcp_server/handlers/skill-graph/status.ts:10:import * as skillGraphDb from '../../lib/skill-graph/skill-graph-db.js';
.opencode/skills/system-spec-kit/mcp_server/handlers/skill-graph/validate.ts:7:import * as skillGraphDb from '../../lib/skill-graph/skill-graph-db.js';
.opencode/skills/system-spec-kit/mcp_server/tests/skill-graph-corruption-recovery.vitest.ts:10:import { closeDb, DB_FILENAME, getDb, initDb } from '../lib/skill-graph/skill-graph-db.js';
.opencode/skills/system-spec-kit/mcp_server/tests/handlers/skill-graph-scan-auth.vitest.ts:11:import { closeDb, getDb, initDb } from '../../lib/skill-graph/skill-graph-db.js';
.opencode/skills/system-spec-kit/mcp_server/tests/skill-graph-handlers.vitest.ts:8:import { closeDb, getDb, indexSkillMetadata, initDb } from '../lib/skill-graph/skill-graph-db.js';
.opencode/skills/system-spec-kit/mcp_server/tests/skill-graph-handlers.vitest.ts:9:import { writeGraphMetadata } from './fixtures/skill-graph-db.js';

```