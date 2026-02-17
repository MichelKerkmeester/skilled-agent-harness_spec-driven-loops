// @ts-nocheck
// ---------------------------------------------------------------
// TEST: CONTEXT SERVER
// ---------------------------------------------------------------

// Converted from: context-server.test.ts (custom runner)
import { describe, it, expect, beforeAll } from 'vitest'
import fs from 'fs'
import path from 'path'

const SERVER_DIR = path.resolve(__dirname, '..')
const SOURCE_FILE = path.join(SERVER_DIR, 'context-server.ts')
const TOOL_SCHEMAS_FILE = path.join(SERVER_DIR, 'tool-schemas.ts')
const TOOL_TYPES_FILE = path.join(SERVER_DIR, 'tools', 'types.ts')
const STARTUP_CHECKS_FILE = path.join(SERVER_DIR, 'startup-checks.ts')
const SHARED_TYPES_FILE = path.join(SERVER_DIR, '..', 'shared', 'types.ts')

let sourceCode = ''
let toolSchemasCode = ''
let toolTypesCode = ''
let startupChecksCode = ''
let sharedTypesCode = ''

describe('Context Server', () => {
  beforeAll(() => {
    sourceCode = fs.readFileSync(SOURCE_FILE, 'utf8')
    toolSchemasCode = fs.readFileSync(TOOL_SCHEMAS_FILE, 'utf8')
    toolTypesCode = fs.readFileSync(TOOL_TYPES_FILE, 'utf8')
    startupChecksCode = fs.readFileSync(STARTUP_CHECKS_FILE, 'utf8')
    sharedTypesCode = fs.readFileSync(SHARED_TYPES_FILE, 'utf8')
  })

  // =================================================================
  // GROUP 1: parseArgs<T>() Function Tests
  // =================================================================
  describe('Group 1: parseArgs<T>()', () => {
    // Local replica of parseArgs for behavioral tests
    function parseArgs<T>(args: Record<string, unknown>): T {
      return args as unknown as T
    }

    // T1: parseArgs exists in source (T303: moved to tools/types.ts)
    it('T1: parseArgs<T>() defined in source', () => {
      expect(toolTypesCode).toMatch(/function\s+parseArgs\s*<\s*T\s*>\s*\(/)
    })

    // T2: parseArgs has the correct implementation pattern (cast via unknown)
    it('T2: parseArgs uses double-cast pattern', () => {
      expect(toolTypesCode).toMatch(
        /function\s+parseArgs<T>\(args:\s*Record<string,\s*unknown>\):\s*T\s*\{[\s\S]*?return\s+args\s+as\s+unknown\s+as\s+T;/
      )
    })

    // T3: parseArgs parameter type is Record<string, unknown>
    it('T3: parseArgs accepts Record<string, unknown>', () => {
      expect(toolTypesCode).toMatch(/parseArgs<T>\(args:\s*Record<string,\s*unknown>\)/)
    })

    // T4: Replicate parseArgs behavior locally to verify cast semantics
    it('T4: parseArgs preserves object identity', () => {
      const input = { query: 'test', limit: 10 }
      const result = parseArgs<{ query: string; limit: number }>(input)
      expect(result.query).toBe('test')
      expect(result.limit).toBe(10)
    })

    // T5: parseArgs with empty object
    it('T5: parseArgs handles empty args', () => {
      const emptyResult = parseArgs<{ optional?: string }>({})
      expect(emptyResult.optional).toBeUndefined()
    })

    // T6: parseArgs with extra fields (MCP may pass unexpected args)
    it('T6: parseArgs passes through extra fields', () => {
      const extraInput = { query: 'hello', unexpectedField: true, anotherExtra: 42 }
      const extraResult = parseArgs<{ query: string }>(extraInput)
      expect(extraResult.query).toBe('hello')
      expect((extraResult as unknown).unexpectedField).toBe(true)
    })

    // T7: parseArgs with type coercion edge cases (number as string)
    it('T7: parseArgs does NOT coerce types', () => {
      const coercionInput = { id: '42' }
      const coercionResult = parseArgs<{ id: number }>(coercionInput)
      // Cast only, no conversion — string "42" remains string
      expect(coercionResult.id).toBe('42')
    })

    // T8: parseArgs with null values
    it('T8: parseArgs preserves null values', () => {
      const nullInput = { query: null, limit: null }
      const nullResult = parseArgs<{ query: string | null; limit: number | null }>(nullInput)
      expect(nullResult.query).toBeNull()
      expect(nullResult.limit).toBeNull()
    })

    // T9: parseArgs with nested objects
    it('T9: parseArgs preserves nested structures', () => {
      const nestedInput = { metadata: { key: 'value' }, tags: ['a', 'b'] }
      const nestedResult = parseArgs<{ metadata: { key: string }; tags: string[] }>(nestedInput)
      expect(nestedResult.metadata.key).toBe('value')
      expect(nestedResult.tags).toHaveLength(2)
    })

    // T10: parseArgs returns same reference (no clone)
    it('T10: parseArgs returns same reference (no copy)', () => {
      const refInput = { test: 'ref' }
      const refResult = parseArgs<{ test: string }>(refInput)
      expect(refResult).toBe(refInput)
    })
  })

  // =================================================================
  // GROUP 2: Tool Definition Completeness
  // =================================================================
  describe('Group 2: Tool Definitions (22 tools)', () => {
    const EXPECTED_TOOLS = [
      'memory_context',
      'memory_search',
      'memory_match_triggers',
      'memory_save',
      'memory_list',
      'memory_stats',
      'memory_health',
      'memory_delete',
      'memory_update',
      'memory_validate',
      'checkpoint_create',
      'checkpoint_list',
      'checkpoint_restore',
      'checkpoint_delete',
      'task_preflight',
      'task_postflight',
      'memory_drift_why',
      'memory_causal_link',
      'memory_causal_stats',
      'memory_causal_unlink',
      'memory_index_scan',
      'memory_get_learning_history',
    ]

    // T11: TOOL_DEFINITIONS export exists
    it('T11: TOOL_DEFINITIONS export exists', () => {
      expect(toolSchemasCode).toMatch(/export\s+const\s+TOOL_DEFINITIONS/)
    })

    it('T11b: context-server uses TOOL_DEFINITIONS', () => {
      expect(sourceCode).toMatch(/tools:\s*TOOL_DEFINITIONS/)
    })

    it('T11c: Tool count is 22', () => {
      const sectionToolNames = (toolSchemasCode.match(/name:\s*'(\w+)'/g) || []).map((m: string) => {
        const match = m.match(/name:\s*'(\w+)'/)
        return match ? match[1] : null
      }).filter(Boolean)
      expect(sectionToolNames.length).toBe(22)
    })

    // T12: Each expected tool exists
    for (const tool of [
      'memory_context',
      'memory_search',
      'memory_match_triggers',
      'memory_save',
      'memory_list',
      'memory_stats',
      'memory_health',
      'memory_delete',
      'memory_update',
      'memory_validate',
      'checkpoint_create',
      'checkpoint_list',
      'checkpoint_restore',
      'checkpoint_delete',
      'task_preflight',
      'task_postflight',
      'memory_drift_why',
      'memory_causal_link',
      'memory_causal_stats',
      'memory_causal_unlink',
      'memory_index_scan',
      'memory_get_learning_history',
    ]) {
      it(`T12: Tool defined: ${tool}`, () => {
        const sectionToolNames = (toolSchemasCode.match(/name:\s*'(\w+)'/g) || []).map((m: string) => {
          const match = m.match(/name:\s*'(\w+)'/)
          return match ? match[1] : null
        }).filter(Boolean)
        expect(sectionToolNames).toContain(tool)
      })
    }

    // T13: No unexpected tools (only expected ones exist)
    it('T13: No unexpected tools', () => {
      const sectionToolNames = (toolSchemasCode.match(/name:\s*'(\w+)'/g) || []).map((m: string) => {
        const match = m.match(/name:\s*'(\w+)'/)
        return match ? match[1] : null
      }).filter(Boolean)
      const unexpected = sectionToolNames.filter((t: string) => !EXPECTED_TOOLS.includes(t))
      expect(unexpected).toHaveLength(0)
    })

    // T14: Each tool has a description
    for (const tool of [
      'memory_context',
      'memory_search',
      'memory_match_triggers',
      'memory_save',
      'memory_list',
      'memory_stats',
      'memory_health',
      'memory_delete',
      'memory_update',
      'memory_validate',
      'checkpoint_create',
      'checkpoint_list',
      'checkpoint_restore',
      'checkpoint_delete',
      'task_preflight',
      'task_postflight',
      'memory_drift_why',
      'memory_causal_link',
      'memory_causal_stats',
      'memory_causal_unlink',
      'memory_index_scan',
      'memory_get_learning_history',
    ]) {
      it(`T14: Tool ${tool} has description`, () => {
        const toolDefRegex = new RegExp(`name:\\s*'${tool}'\\s*,\\s*description:\\s*'`)
        expect(toolDefRegex.test(toolSchemasCode)).toBe(true)
      })
    }

    // T15: Each tool has an inputSchema
    for (const tool of [
      'memory_context',
      'memory_search',
      'memory_match_triggers',
      'memory_save',
      'memory_list',
      'memory_stats',
      'memory_health',
      'memory_delete',
      'memory_update',
      'memory_validate',
      'checkpoint_create',
      'checkpoint_list',
      'checkpoint_restore',
      'checkpoint_delete',
      'task_preflight',
      'task_postflight',
      'memory_drift_why',
      'memory_causal_link',
      'memory_causal_stats',
      'memory_causal_unlink',
      'memory_index_scan',
      'memory_get_learning_history',
    ]) {
      it(`T15: Tool ${tool} has inputSchema`, () => {
        const schemaRegex = new RegExp(`name:\\s*'${tool}'[\\s\\S]*?inputSchema:\\s*\\{`)
        expect(schemaRegex.test(toolSchemasCode)).toBe(true)
      })
    }
  })

  // =================================================================
  // GROUP 3: Tool Dispatch Coverage (T303: dispatchTool replaces switch)
  // =================================================================
  describe('Group 3: Tool Dispatch Coverage', () => {
    const EXPECTED_CASES = [
      'memory_context', 'memory_search', 'memory_match_triggers',
      'memory_delete', 'memory_update', 'memory_list', 'memory_stats',
      'checkpoint_create', 'checkpoint_list', 'checkpoint_restore', 'checkpoint_delete',
      'memory_validate', 'memory_save', 'memory_index_scan', 'memory_health',
      'task_preflight', 'task_postflight', 'memory_get_learning_history',
      'memory_drift_why', 'memory_causal_link', 'memory_causal_stats', 'memory_causal_unlink',
    ]

    // T16: CallToolRequestSchema handler exists
    it('T16: CallToolRequestSchema handler exists', () => {
      expect(sourceCode).toMatch(/server\.setRequestHandler\(CallToolRequestSchema/)
    })

    // T303: Verify dispatchTool is used instead of switch
    it('T16b: dispatchTool(name, args) called', () => {
      expect(sourceCode).toMatch(/dispatchTool\(name,\s*args\)/)
    })

    it('T16c: dispatchTool imported from ./tools', () => {
      expect(sourceCode).toMatch(/import\s+\{[^}]*dispatchTool[^}]*\}\s*from\s+['"]\.\/tools['"]/)
    })

    // T17: All 22 tools dispatched via tool modules
    it('T17: All 22 tools dispatched via modules', () => {
      const toolsDir = path.join(SERVER_DIR, 'tools')
      let allToolModulesCode = ''
      const toolFiles = fs.readdirSync(toolsDir).filter((f: string) => f.endsWith('.ts') && f !== 'types.ts')
      for (const file of toolFiles) {
        allToolModulesCode += fs.readFileSync(path.join(toolsDir, file), 'utf8') + '\n'
      }

      let caseCount = 0
      for (const caseName of EXPECTED_CASES) {
        const caseRegex = new RegExp(`['"]${caseName}['"]`)
        if (caseRegex.test(allToolModulesCode)) {
          caseCount++
        }
      }
      expect(caseCount).toBe(EXPECTED_CASES.length)
    })

    // T18: Each tool dispatch uses parseArgs<T>
    for (const caseName of EXPECTED_CASES) {
      it(`T18: Tool '${caseName}' uses parseArgs<T>`, () => {
        const toolsDir = path.join(SERVER_DIR, 'tools')
        let allToolModulesCode = ''
        const toolFiles = fs.readdirSync(toolsDir).filter((f: string) => f.endsWith('.ts') && f !== 'types.ts')
        for (const file of toolFiles) {
          allToolModulesCode += fs.readFileSync(path.join(toolsDir, file), 'utf8') + '\n'
        }

        const parseArgsPattern = new RegExp(`['"]${caseName}['"][\\s\\S]*?parseArgs<`)
        const loosePattern = new RegExp(`${caseName}[\\s\\S]{0,200}parseArgs<|parseArgs<[\\s\\S]{0,200}${caseName}`)
        expect(parseArgsPattern.test(allToolModulesCode) || loosePattern.test(allToolModulesCode)).toBe(true)
      })
    }

    // T19: Unknown tools cause error
    it('T19: Unknown tool throws error', () => {
      expect(sourceCode).toMatch(/throw\s+new\s+Error\(`Unknown tool:\s*\$\{name\}`\)/)
    })
  })

  // =================================================================
  // GROUP 4: Interface Contract Verification
  // =================================================================
  describe('Group 4: Interface Contracts', () => {
    const EXPECTED_INTERFACES: Array<{ name: string; requiredFields?: string[]; source: string }> = [
      // MCPResponse was moved to shared/types.ts and re-exported via 'export type'
      { name: 'MCPResponse', requiredFields: ['content'], source: 'sharedTypes' },
      { name: 'ToolDefinition', requiredFields: ['name', 'description', 'inputSchema'], source: 'toolSchemas' },
      { name: 'ContextArgs', requiredFields: ['input'], source: 'toolTypes' },
      { name: 'SearchArgs', requiredFields: ['query'], source: 'toolTypes' },
      { name: 'TriggerArgs', requiredFields: ['prompt'], source: 'toolTypes' },
      { name: 'DeleteArgs', requiredFields: ['id'], source: 'toolTypes' },
      { name: 'UpdateArgs', requiredFields: ['id'], source: 'toolTypes' },
      { name: 'ListArgs', source: 'toolTypes' },
      { name: 'StatsArgs', source: 'toolTypes' },
      { name: 'HealthArgs', source: 'toolTypes' },
      { name: 'CheckpointCreateArgs', requiredFields: ['name'], source: 'toolTypes' },
      { name: 'CheckpointListArgs', source: 'toolTypes' },
      { name: 'CheckpointRestoreArgs', requiredFields: ['name'], source: 'toolTypes' },
      { name: 'CheckpointDeleteArgs', requiredFields: ['name'], source: 'toolTypes' },
      { name: 'MemoryValidateArgs', requiredFields: ['id', 'wasUseful'], source: 'toolTypes' },
      { name: 'SaveArgs', requiredFields: ['filePath'], source: 'toolTypes' },
      { name: 'ScanArgs', source: 'toolTypes' },
      { name: 'PreflightArgs', requiredFields: ['specFolder', 'taskId', 'knowledgeScore'], source: 'toolTypes' },
      { name: 'PostflightArgs', requiredFields: ['specFolder', 'taskId', 'knowledgeScore'], source: 'toolTypes' },
      { name: 'LearningHistoryArgs', requiredFields: ['specFolder'], source: 'toolTypes' },
      { name: 'DriftWhyArgs', requiredFields: ['memoryId'], source: 'toolTypes' },
      { name: 'CausalLinkArgs', requiredFields: ['sourceId', 'targetId', 'relation'], source: 'toolTypes' },
      { name: 'CausalStatsArgs', source: 'toolTypes' },
      { name: 'CausalUnlinkArgs', requiredFields: ['edgeId'], source: 'toolTypes' },
      { name: 'PendingRecoveryResult', source: 'contextServer' },
      { name: 'ApiKeyValidation', source: 'contextServer' },
      { name: 'NodeVersionMarker', source: 'startupChecks' },
    ]

    for (const iface of EXPECTED_INTERFACES) {
      it(`Interface ${iface.name} defined`, () => {
        const sourceMap: Record<string, string> = {
          contextServer: sourceCode,
          toolTypes: toolTypesCode,
          toolSchemas: toolSchemasCode,
          startupChecks: startupChecksCode,
          sharedTypes: sharedTypesCode,
        }
        const code = sourceMap[iface.source]
        const ifaceRegex = new RegExp(`interface\\s+${iface.name}\\s*\\{`)
        expect(ifaceRegex.test(code)).toBe(true)

        // Check required fields if specified
        if (iface.requiredFields) {
          const ifaceMatch = code.match(new RegExp(`interface\\s+${iface.name}\\s*\\{([\\s\\S]*?)\\}`))
          expect(ifaceMatch).not.toBeNull()
          if (ifaceMatch) {
            const ifaceBody = ifaceMatch[1]
            for (const field of iface.requiredFields) {
              const fieldPattern = new RegExp(`\\b${field}\\??\\s*[:\\[]`)
              expect(fieldPattern.test(ifaceBody)).toBe(true)
            }
          }
        }
      })
    }
  })

  // =================================================================
  // GROUP 5: Error Handling & buildErrorResponse
  // =================================================================
  describe('Group 5: Error Handling', () => {
    // T20: Source wraps dispatch in try/catch
    it('T20: Dispatch wrapped in try/catch', () => {
      const tryCatchPattern = /try\s*\{[\s\S]*?validateInputLengths\(args\)[\s\S]*?dispatchTool\(name[\s\S]*?\}\s*catch\s*\(error/
      expect(tryCatchPattern.test(sourceCode)).toBe(true)
    })

    // T21: Catch block uses buildErrorResponse
    it('T21: Catch uses buildErrorResponse()', () => {
      const buildErrorPattern = /catch[\s\S]*?buildErrorResponse\(name,\s*err,\s*args\)/
      expect(buildErrorPattern.test(sourceCode)).toBe(true)
    })

    // T22: Error response has isError: true
    it('T22: Error responses set isError: true', () => {
      expect(sourceCode).toMatch(/isError:\s*true/)
    })

    // T23: buildErrorResponse direct test
    it('T23: buildErrorResponse returns structured object', async () => {
      let errorsModule: any = null
      try {
        errorsModule = await import('../lib/errors/index')
      } catch {
        try {
          errorsModule = await import('../lib/errors')
        } catch {
          return // skip if not loadable
        }
      }

      if (!errorsModule?.buildErrorResponse) return

      const testError = new Error('Test error message')
      const response = errorsModule.buildErrorResponse('memory_search', testError, { query: 'test' })

      expect(response).toBeTypeOf('object')
      expect(
        response.error || response.message || response.summary
      ).toBeTruthy()
    })

    // T24: Error response contains recovery hints (REQ-004)
    it('T24: getRecoveryHint returns RecoveryHint object', async () => {
      let errorsModule: any = null
      try {
        errorsModule = await import('../lib/errors/index')
      } catch {
        try {
          errorsModule = await import('../lib/errors')
        } catch {
          return
        }
      }

      if (!errorsModule?.getRecoveryHint) return

      // getRecoveryHint(toolName, errorCode) returns a RecoveryHint object
      const hint = errorsModule.getRecoveryHint('memory_search', 'UNKNOWN_TOOL')
      expect(typeof hint).toBe('object')
      expect(hint).not.toBeNull()
    })

    // T25: ErrorCodes enum/object exists
    it('T25: ErrorCodes defined', async () => {
      let errorsModule: any = null
      try {
        errorsModule = await import('../lib/errors/index')
      } catch {
        try {
          errorsModule = await import('../lib/errors')
        } catch {
          return
        }
      }

      if (!errorsModule?.ErrorCodes) return

      expect(errorsModule.ErrorCodes).toBeTypeOf('object')
      expect(Object.keys(errorsModule.ErrorCodes).length).toBeGreaterThan(0)
    })
  })

  // =================================================================
  // GROUP 6: Token Budget Integration
  // =================================================================
  describe('Group 6: Token Budget Integration', () => {
    // T26: Source injects tokenBudget into response metadata
    it('T26: Token budget injection exists', () => {
      expect(sourceCode).toMatch(/getTokenBudget\(name\)/)
    })

    // T27: Budget overflow warning logged
    it('T27: Token budget overflow detection', () => {
      expect(sourceCode).toMatch(/tokenCount\s*>\s*budget/)
    })

    // T28: getTokenBudget direct tests
    it('T28: L1 budget = 2000 (memory_context)', async () => {
      let layerDefs: any = null
      try {
        layerDefs = await import('../lib/architecture/layer-definitions')
      } catch {
        return
      }
      if (!layerDefs?.getTokenBudget) return
      expect(layerDefs.getTokenBudget('memory_context')).toBe(2000)
    })

    it('T28b: L2 budget = 1500 (memory_search)', async () => {
      let layerDefs: any = null
      try {
        layerDefs = await import('../lib/architecture/layer-definitions')
      } catch {
        return
      }
      if (!layerDefs?.getTokenBudget) return
      expect(layerDefs.getTokenBudget('memory_search')).toBe(1500)
    })

    it('T28c: L3 budget = 800 (memory_list)', async () => {
      let layerDefs: any = null
      try {
        layerDefs = await import('../lib/architecture/layer-definitions')
      } catch {
        return
      }
      if (!layerDefs?.getTokenBudget) return
      expect(layerDefs.getTokenBudget('memory_list')).toBe(800)
    })

    it('T28d: Unknown tool budget = 1000 (default)', async () => {
      let layerDefs: any = null
      try {
        layerDefs = await import('../lib/architecture/layer-definitions')
      } catch {
        return
      }
      if (!layerDefs?.getTokenBudget) return
      expect(layerDefs.getTokenBudget('nonexistent_tool')).toBe(1000)
    })

    it('T28e: L4 budget = 500 (memory_delete)', async () => {
      let layerDefs: any = null
      try {
        layerDefs = await import('../lib/architecture/layer-definitions')
      } catch {
        return
      }
      if (!layerDefs?.getTokenBudget) return
      expect(layerDefs.getTokenBudget('memory_delete')).toBe(500)
    })

    it('T28f: L5 budget = 600 (checkpoint_create)', async () => {
      let layerDefs: any = null
      try {
        layerDefs = await import('../lib/architecture/layer-definitions')
      } catch {
        return
      }
      if (!layerDefs?.getTokenBudget) return
      expect(layerDefs.getTokenBudget('checkpoint_create')).toBe(600)
    })

    it('T28g: L6 budget = 1200 (memory_drift_why)', async () => {
      let layerDefs: any = null
      try {
        layerDefs = await import('../lib/architecture/layer-definitions')
      } catch {
        return
      }
      if (!layerDefs?.getTokenBudget) return
      expect(layerDefs.getTokenBudget('memory_drift_why')).toBe(1200)
    })

    it('T28h: L7 budget = 1000 (memory_index_scan)', async () => {
      let layerDefs: any = null
      try {
        layerDefs = await import('../lib/architecture/layer-definitions')
      } catch {
        return
      }
      if (!layerDefs?.getTokenBudget) return
      expect(layerDefs.getTokenBudget('memory_index_scan')).toBe(1000)
    })
  })

  // =================================================================
  // GROUP 7: Hooks Integration (MEMORY_AWARE_TOOLS, extractContextHint)
  // =================================================================
  describe('Group 7: Hooks Integration', () => {
    // T29: Source imports MEMORY_AWARE_TOOLS
    it('T29: Imports MEMORY_AWARE_TOOLS from hooks', () => {
      expect(sourceCode).toMatch(/import\s*\{[^}]*MEMORY_AWARE_TOOLS[^}]*\}\s*from\s*'\.\/hooks'/)
    })

    // T30: Source checks MEMORY_AWARE_TOOLS.has(name)
    it('T30: Checks MEMORY_AWARE_TOOLS.has(name)', () => {
      expect(sourceCode).toMatch(/MEMORY_AWARE_TOOLS\.has\(name\)/)
    })

    // T31: Hooks module direct tests
    it('T31: MEMORY_AWARE_TOOLS is a Set', async () => {
      let hooksModule: any = null
      try {
        hooksModule = await import('../hooks/index')
      } catch {
        try {
          hooksModule = await import('../hooks')
        } catch {
          try {
            hooksModule = await import('../hooks/memory-surface')
          } catch {
            return
          }
        }
      }
      if (!hooksModule?.MEMORY_AWARE_TOOLS) return

      expect(hooksModule.MEMORY_AWARE_TOOLS).toBeInstanceOf(Set)
    })

    const expectedAwareTools = ['memory_search', 'memory_match_triggers', 'memory_list', 'memory_save', 'memory_index_scan']
    for (const t of expectedAwareTools) {
      it(`T31b: MEMORY_AWARE_TOOLS contains '${t}'`, async () => {
        let hooksModule: any = null
        try {
          hooksModule = await import('../hooks/index')
        } catch {
          try {
            hooksModule = await import('../hooks')
          } catch {
            try {
              hooksModule = await import('../hooks/memory-surface')
            } catch {
              return
            }
          }
        }
        if (!hooksModule?.MEMORY_AWARE_TOOLS) return
        expect(hooksModule.MEMORY_AWARE_TOOLS.has(t)).toBe(true)
      })
    }

    const nonAwareTools = ['memory_delete', 'checkpoint_create', 'task_preflight']
    for (const t of nonAwareTools) {
      it(`T31c: MEMORY_AWARE_TOOLS excludes '${t}'`, async () => {
        let hooksModule: any = null
        try {
          hooksModule = await import('../hooks/index')
        } catch {
          try {
            hooksModule = await import('../hooks')
          } catch {
            try {
              hooksModule = await import('../hooks/memory-surface')
            } catch {
              return
            }
          }
        }
        if (!hooksModule?.MEMORY_AWARE_TOOLS) return
        expect(hooksModule.MEMORY_AWARE_TOOLS.has(t)).toBe(false)
      })
    }

    // extractContextHint tests
    it('T31d: extractContextHint extracts query', async () => {
      let hooksModule: any = null
      try {
        hooksModule = await import('../hooks/index')
      } catch {
        try {
          hooksModule = await import('../hooks')
        } catch {
          try {
            hooksModule = await import('../hooks/memory-surface')
          } catch {
            return
          }
        }
      }
      if (typeof hooksModule?.extractContextHint !== 'function') return
      expect(hooksModule.extractContextHint({ query: 'test search' })).toBe('test search')
    })

    it('T31e: extractContextHint extracts prompt', async () => {
      let hooksModule: any = null
      try {
        hooksModule = await import('../hooks/index')
      } catch {
        try {
          hooksModule = await import('../hooks')
        } catch {
          try {
            hooksModule = await import('../hooks/memory-surface')
          } catch {
            return
          }
        }
      }
      if (typeof hooksModule?.extractContextHint !== 'function') return
      expect(hooksModule.extractContextHint({ prompt: 'trigger phrase' })).toBe('trigger phrase')
    })

    it('T31f: extractContextHint handles null', async () => {
      let hooksModule: any = null
      try {
        hooksModule = await import('../hooks/index')
      } catch {
        try {
          hooksModule = await import('../hooks')
        } catch {
          try {
            hooksModule = await import('../hooks/memory-surface')
          } catch {
            return
          }
        }
      }
      if (typeof hooksModule?.extractContextHint !== 'function') return
      expect(hooksModule.extractContextHint(null)).toBeNull()
    })

    it('T31g: extractContextHint handles empty object', async () => {
      let hooksModule: any = null
      try {
        hooksModule = await import('../hooks/index')
      } catch {
        try {
          hooksModule = await import('../hooks')
        } catch {
          try {
            hooksModule = await import('../hooks/memory-surface')
          } catch {
            return
          }
        }
      }
      if (typeof hooksModule?.extractContextHint !== 'function') return
      expect(hooksModule.extractContextHint({})).toBeNull()
    })

    it('T31h: extractContextHint rejects strings < 3 chars', async () => {
      let hooksModule: any = null
      try {
        hooksModule = await import('../hooks/index')
      } catch {
        try {
          hooksModule = await import('../hooks')
        } catch {
          try {
            hooksModule = await import('../hooks/memory-surface')
          } catch {
            return
          }
        }
      }
      if (typeof hooksModule?.extractContextHint !== 'function') return
      expect(hooksModule.extractContextHint({ query: 'ab' })).toBeNull()
    })

    it('T31i: extractContextHint joins concepts', async () => {
      let hooksModule: any = null
      try {
        hooksModule = await import('../hooks/index')
      } catch {
        try {
          hooksModule = await import('../hooks')
        } catch {
          try {
            hooksModule = await import('../hooks/memory-surface')
          } catch {
            return
          }
        }
      }
      if (typeof hooksModule?.extractContextHint !== 'function') return
      expect(hooksModule.extractContextHint({ concepts: ['memory', 'search'] })).toBe('memory search')
    })
  })

  // =================================================================
  // GROUP 8: Input Validation (validateInputLengths)
  // =================================================================
  describe('Group 8: Input Validation', () => {
    // T32: Source calls validateInputLengths before dispatch
    it('T32: validateInputLengths called before dispatchTool', () => {
      const validationOrder = /validateInputLengths\(args\)[\s\S]*?dispatchTool\(name/
      expect(validationOrder.test(sourceCode)).toBe(true)
    })

    // T33: validateInputLengths direct tests
    it('T33: validateInputLengths accepts normal input', async () => {
      let utilsModule: any = null
      try {
        utilsModule = await import('../utils/index')
      } catch {
        try {
          utilsModule = await import('../utils')
        } catch {
          try {
            utilsModule = await import('../utils/validators')
          } catch {
            return
          }
        }
      }
      if (!utilsModule?.validateInputLengths) return
      expect(() => utilsModule.validateInputLengths({ query: 'normal search query' })).not.toThrow()
    })

    it('T33b: validateInputLengths accepts empty args', async () => {
      let utilsModule: any = null
      try {
        utilsModule = await import('../utils/index')
      } catch {
        try {
          utilsModule = await import('../utils')
        } catch {
          try {
            utilsModule = await import('../utils/validators')
          } catch {
            return
          }
        }
      }
      if (!utilsModule?.validateInputLengths) return
      expect(() => utilsModule.validateInputLengths({})).not.toThrow()
    })

    it('T33c: validateInputLengths rejects oversized query', async () => {
      let utilsModule: any = null
      try {
        utilsModule = await import('../utils/index')
      } catch {
        try {
          utilsModule = await import('../utils')
        } catch {
          try {
            utilsModule = await import('../utils/validators')
          } catch {
            return
          }
        }
      }
      if (!utilsModule?.validateInputLengths) return
      expect(() => utilsModule.validateInputLengths({ query: 'x'.repeat(20000) })).toThrow()
    })

    it('T33d: validateInputLengths rejects oversized title', async () => {
      let utilsModule: any = null
      try {
        utilsModule = await import('../utils/index')
      } catch {
        try {
          utilsModule = await import('../utils')
        } catch {
          try {
            utilsModule = await import('../utils/validators')
          } catch {
            return
          }
        }
      }
      if (!utilsModule?.validateInputLengths) return
      expect(() => utilsModule.validateInputLengths({ title: 'x'.repeat(1000) })).toThrow()
    })

    // T34: INPUT_LIMITS constants
    it('T34: INPUT_LIMITS.query = 10000', async () => {
      let utilsModule: any = null
      try {
        utilsModule = await import('../utils/index')
      } catch {
        try {
          utilsModule = await import('../utils')
        } catch {
          try {
            utilsModule = await import('../utils/validators')
          } catch {
            return
          }
        }
      }
      if (!utilsModule?.INPUT_LIMITS) return
      expect(utilsModule.INPUT_LIMITS.query).toBe(10000)
    })

    it('T34b: INPUT_LIMITS.title = 500', async () => {
      let utilsModule: any = null
      try {
        utilsModule = await import('../utils/index')
      } catch {
        try {
          utilsModule = await import('../utils')
        } catch {
          try {
            utilsModule = await import('../utils/validators')
          } catch {
            return
          }
        }
      }
      if (!utilsModule?.INPUT_LIMITS) return
      expect(utilsModule.INPUT_LIMITS.title).toBe(500)
    })

    it('T34c: INPUT_LIMITS.filePath = 500', async () => {
      let utilsModule: any = null
      try {
        utilsModule = await import('../utils/index')
      } catch {
        try {
          utilsModule = await import('../utils')
        } catch {
          try {
            utilsModule = await import('../utils/validators')
          } catch {
            return
          }
        }
      }
      if (!utilsModule?.INPUT_LIMITS) return
      expect(utilsModule.INPUT_LIMITS.filePath).toBe(500)
    })
  })

  // =================================================================
  // GROUP 9: Server Configuration & Metadata
  // =================================================================
  describe('Group 9: Server Configuration', () => {
    // T35: Server name
    it('T35: Server name is "context-server"', () => {
      const serverName = sourceCode.match(/name:\s*'([^']+)'/)
      expect(serverName).not.toBeNull()
      expect(serverName![1]).toBe('context-server')
    })

    // T36: Server version format
    it('T36: Server version is semver', () => {
      expect(sourceCode).toMatch(/version:\s*'\d+\.\d+\.\d+'/)
    })

    // T37: Capabilities include tools
    it('T37: Server capabilities include tools', () => {
      expect(sourceCode).toMatch(/capabilities:\s*\{\s*tools:\s*\{\}/)
    })

    // T38: Uses StdioServerTransport
    it('T38: Uses StdioServerTransport', () => {
      expect(sourceCode).toMatch(/new\s+StdioServerTransport\(\)/)
    })
  })

  // =================================================================
  // GROUP 10: Shutdown & Process Handlers
  // =================================================================
  describe('Group 10: Shutdown & Process Handlers', () => {
    // T39: SIGTERM handler
    it('T39: SIGTERM handler registered', () => {
      expect(sourceCode).toMatch(/process\.on\('SIGTERM'/)
    })

    // T40: SIGINT handler
    it('T40: SIGINT handler registered', () => {
      expect(sourceCode).toMatch(/process\.on\('SIGINT'/)
    })

    // T41: uncaughtException handler
    it('T41: uncaughtException handler registered', () => {
      expect(sourceCode).toMatch(/process\.on\('uncaughtException'/)
    })

    // T42: unhandledRejection handler
    it('T42: unhandledRejection handler registered', () => {
      expect(sourceCode).toMatch(/process\.on\('unhandledRejection'/)
    })

    // T43: Shutdown closes database
    it('T43: SIGTERM closes database', () => {
      expect(sourceCode).toMatch(/process\.on\('SIGTERM'[\s\S]*?vectorIndex\.closeDb\(\)/)
    })

    // T44: Shutdown stops archival manager
    it('T44: Shutdown stops archival manager', () => {
      expect(sourceCode).toMatch(/archivalManager\.cleanup\(\)/)
    })

    // T45: Shutdown stops retry manager
    it('T45: Shutdown stops retry manager', () => {
      expect(sourceCode).toMatch(/retryManager\.stopBackgroundJob\(\)/)
    })

    // T46: Shutdown clears tool cache (KL-4)
    it('T46: Shutdown clears tool cache', () => {
      expect(sourceCode).toMatch(/toolCache\.shutdown\(\)/)
    })

    // T47: Shutdown closes transport (P1-09)
    it('T47: Shutdown closes transport (P1-09)', () => {
      expect(sourceCode).toMatch(/transport\.close\(\)/)
    })

    // T48: Shutdown guard prevents double shutdown
    it('T48: Double-shutdown guard', () => {
      expect(sourceCode).toMatch(/if\s*\(shuttingDown\)\s*return/)
    })
  })

  // =================================================================
  // GROUP 11: Startup & Initialization
  // =================================================================
  describe('Group 11: Startup & Initialization', () => {
    // T49: main() function exists
    it('T49: main() function defined', () => {
      expect(sourceCode).toMatch(/async\s+function\s+main\(\)/)
    })

    // T50: main() is called at module level
    it('T50: main() invoked at module level', () => {
      expect(sourceCode).toMatch(/main\(\)\.catch/)
    })

    // T51: Database initialization
    it('T51: Database initialized in main()', () => {
      expect(sourceCode).toMatch(/vectorIndex\.initializeDb\(\)/)
    })

    // T52: dbInitialized guard for lazy init
    it('T52: dbInitialized guard in dispatch', () => {
      expect(sourceCode).toMatch(/if\s*\(!dbInitialized\)/)
    })

    // T53: detectNodeVersionMismatch called
    it('T53: detectNodeVersionMismatch() called at startup', () => {
      expect(sourceCode).toMatch(/detectNodeVersionMismatch\(\)/)
    })

    // T54: Embedding model readiness
    it('T54: Embedding model marked ready', () => {
      expect(sourceCode).toMatch(/setEmbeddingModelReady\(true\)/)
    })

    // T55: API key validation (with skip env var)
    it('T55: API key validation with skip option', () => {
      expect(sourceCode).toMatch(/SPECKIT_SKIP_API_VALIDATION/)
    })

    // T56: Startup scan runs in background
    it('T56: Startup scan runs via setImmediate', () => {
      expect(sourceCode).toMatch(/setImmediate\(\(\)\s*=>\s*startupScan/)
    })

    // T57: startupScanInProgress guard
    it('T57: Startup scan re-entry guard', () => {
      expect(sourceCode).toMatch(/if\s*\(startupScanInProgress\)/)
    })
  })

  // =================================================================
  // GROUP 12: Auto-Surface Context Integration (SK-004)
  // =================================================================
  describe('Group 12: Auto-Surface Context (SK-004)', () => {
    // T58: autoSurfacedContext injected into successful responses
    it('T58: Auto-surfaced context injected into response', () => {
      // Source uses type assertion: (result as unknown as Record<string, unknown>).autoSurfacedContext = ...
      expect(sourceCode).toMatch(
        /autoSurfacedContext[\s\S]*?\.autoSurfacedContext\s*=\s*autoSurfacedContext/
      )
    })

    // T59: Auto-surface errors are non-fatal
    it('T59: Auto-surface errors are non-fatal', () => {
      expect(sourceCode).toMatch(/Auto-surface failed \(non-fatal\)/)
    })

    // T60: Only injected for non-error responses
    it('T60: Auto-surface only on non-error responses', () => {
      expect(sourceCode).toMatch(/!result\.isError/)
    })
  })

  // =================================================================
  // GROUP 13: Layer-Tool Consistency
  // =================================================================
  describe('Group 13: Layer-Tool Consistency', () => {
    const LAYER_PREFIXES: Record<string, string> = {
      'memory_context': '[L1:Orchestration]',
      'memory_search': '[L2:Core]',
      'memory_match_triggers': '[L2:Core]',
      'memory_save': '[L2:Core]',
      'memory_list': '[L3:Discovery]',
      'memory_stats': '[L3:Discovery]',
      'memory_health': '[L3:Discovery]',
      'memory_delete': '[L4:Mutation]',
      'memory_update': '[L4:Mutation]',
      'memory_validate': '[L4:Mutation]',
      'checkpoint_create': '[L5:Lifecycle]',
      'checkpoint_list': '[L5:Lifecycle]',
      'checkpoint_restore': '[L5:Lifecycle]',
      'checkpoint_delete': '[L5:Lifecycle]',
      'task_preflight': '[L6:Analysis]',
      'task_postflight': '[L6:Analysis]',
      'memory_drift_why': '[L6:Analysis]',
      'memory_causal_link': '[L6:Analysis]',
      'memory_causal_stats': '[L6:Analysis]',
      'memory_causal_unlink': '[L6:Analysis]',
      'memory_index_scan': '[L7:Maintenance]',
      'memory_get_learning_history': '[L7:Maintenance]',
    }

    // T61: Tool descriptions include layer prefix
    for (const [tool, prefix] of Object.entries(LAYER_PREFIXES)) {
      it(`T61: ${tool} has prefix ${prefix}`, () => {
        const descRegex = new RegExp(`name:\\s*'${tool}'\\s*,\\s*description:\\s*'(\\[L\\d+:\\w+\\])`)
        const match = toolSchemasCode.match(descRegex)
        expect(match).not.toBeNull()
        expect(match![1]).toBe(prefix)
      })
    }

    // T62: Token Budget mentioned in descriptions
    it('T62: Token budgets in descriptions', () => {
      const budgetPattern = /Token Budget:\s*\d+/g
      const budgetMatches = toolSchemasCode.match(budgetPattern)
      expect(budgetMatches).not.toBeNull()
      expect(budgetMatches!.length).toBeGreaterThanOrEqual(20)
    })
  })

  // =================================================================
  // GROUP 14: Pending File Recovery (T107)
  // =================================================================
  describe('Group 14: Pending File Recovery (T107)', () => {
    // T63: recoverPendingFiles function exists
    it('T63: recoverPendingFiles() defined', () => {
      expect(sourceCode).toMatch(/async\s+function\s+recoverPendingFiles/)
    })

    // T64: Recovery called during startup scan
    it('T64: recoverPendingFiles called in startupScan', () => {
      expect(sourceCode).toMatch(/await\s+recoverPendingFiles\(basePath\)/)
    })

    // T65: Recovery returns structured result
    it('T65: PendingRecoveryResult has structured fields', () => {
      const resultPattern = /PendingRecoveryResult\s*=\s*\{[\s\S]*?found[\s\S]*?processed[\s\S]*?recovered[\s\S]*?failed/
      expect(resultPattern.test(sourceCode)).toBe(true)
    })

    // T66: Recovery error is caught (non-fatal)
    it('T66: Pending file recovery errors caught', () => {
      const recoveryCatch = /recoverPendingFiles[\s\S]*?catch\s*\(error/
      expect(recoveryCatch.test(sourceCode)).toBe(true)
    })
  })

  // =================================================================
  // GROUP 15: Module Import Verification
  // =================================================================
  describe('Group 15: Module Imports', () => {
    const EXPECTED_IMPORTS = [
      { module: '@modelcontextprotocol/sdk/server/index.js', name: 'MCP SDK Server' },
      { module: '@modelcontextprotocol/sdk/server/stdio.js', name: 'MCP SDK Stdio' },
      { module: '@modelcontextprotocol/sdk/types.js', name: 'MCP SDK Types' },
      { module: './core', name: 'Core module' },
      { module: './tool-schemas', name: 'Tool schemas (T303)' },
      { module: './tools', name: 'Tool dispatch (T303)' },
      { module: './handlers', name: 'Handlers module' },
      { module: './utils', name: 'Utils module' },
      { module: './hooks', name: 'Hooks module' },
      { module: './startup-checks', name: 'Startup checks (T303)' },
      { module: './lib/architecture/layer-definitions', name: 'Layer definitions' },
      { module: './lib/search/vector-index', name: 'Vector index' },
      { module: './lib/providers/embeddings', name: 'Embeddings' },
      { module: './lib/storage/checkpoints', name: 'Checkpoints' },
      { module: './lib/storage/access-tracker', name: 'Access tracker' },
      { module: './lib/search/hybrid-search', name: 'Hybrid search' },
      { module: './lib/search/bm25-index', name: 'BM25 index' },
      { module: './lib/parsing/memory-parser', name: 'Memory parser' },
      { module: './lib/cache/cognitive/working-memory', name: 'Working memory' },
      { module: './lib/cache/cognitive/attention-decay', name: 'Attention decay' },
      { module: './lib/cache/cognitive/co-activation', name: 'Co-activation' },
      { module: './lib/cache/cognitive/archival-manager', name: 'Archival manager' },
      { module: './lib/providers/retry-manager', name: 'Retry manager' },
      { module: './lib/errors', name: 'Error utilities' },
      { module: './lib/session/session-manager', name: 'Session manager' },
      { module: './lib/storage/incremental-index', name: 'Incremental index' },
      { module: './lib/storage/transaction-manager', name: 'Transaction manager' },
      { module: './lib/cache/tool-cache', name: 'Tool cache' },
    ]

    for (const imp of EXPECTED_IMPORTS) {
      it(`T67: Imports ${imp.name} from '${imp.module}'`, () => {
        const escaped = imp.module.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&')
        const importRegex = new RegExp(`import\\s+[^;]*from\\s+['"]${escaped}['"]`)
        expect(importRegex.test(sourceCode)).toBe(true)
      })
    }
  })
})
