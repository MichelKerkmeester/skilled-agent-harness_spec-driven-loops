/**
 * Shared Test Utilities for GoopSpec
 * 
 * This module provides common test fixtures, factories, and helpers
 * for consistent, isolated testing across the codebase.
 * 
 * @module test-utils
 */

import { mkdirSync, rmSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import type {
  PluginContext,
  MinimalPluginInput,
  GoopSpecConfig,
  GoopState,
  StateManager,
  ResourceResolver,
  ResolvedResource,
  ResourceType,
  ADLEntry,
  CheckpointData,
  HistoryEntry,
  MemoryManager,
  Memory,
  MemoryInput,
  MemoryUpdate,
  SearchResult,
  SearchOptions,
  MemoryType,
  WorkflowPhase,
  TaskMode,
  ToolContext,
} from "./core/types.js";

// ============================================================================
// Test Directory Management
// ============================================================================

/**
 * Create a unique temporary test directory
 * @param prefix - Optional prefix for the directory name
 * @returns Path to the created test directory
 */
export function createTestDir(prefix: string = "goopspec-test"): string {
  const testDir = join(tmpdir(), `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  mkdirSync(testDir, { recursive: true });
  return testDir;
}

/**
 * Clean up a test directory
 * @param testDir - Path to the test directory to remove
 */
export function cleanupTestDir(testDir: string): void {
  if (existsSync(testDir)) {
    rmSync(testDir, { recursive: true, force: true });
  }
}

/**
 * Create a test directory with common GoopSpec structure
 * @param prefix - Optional prefix for the directory name
 * @returns Object with test directory path and cleanup function
 */
export function setupTestEnvironment(prefix: string = "goopspec-test"): {
  testDir: string;
  goopspecDir: string;
  cleanup: () => void;
} {
  const testDir = createTestDir(prefix);
  const goopspecDir = join(testDir, ".goopspec");
  
  // Create standard directories
  mkdirSync(goopspecDir, { recursive: true });
  mkdirSync(join(goopspecDir, "checkpoints"), { recursive: true });
  mkdirSync(join(goopspecDir, "history"), { recursive: true });
  mkdirSync(join(goopspecDir, "phases"), { recursive: true });
  
  return {
    testDir,
    goopspecDir,
    cleanup: () => cleanupTestDir(testDir),
  };
}

// ============================================================================
// Mock Factories - Tool Context
// ============================================================================

/**
 * Create a mock ToolContext (from @opencode-ai/plugin/tool)
 * @param overrides - Optional overrides for specific fields
 */
export function createMockToolContext(overrides: Partial<ToolContext> = {}): ToolContext {
  return {
    sessionID: "test-session-123",
    messageID: "test-message-456",
    agent: "test-agent",
    directory: "/tmp/test",
    worktree: "/tmp/test",
    abort: new AbortController().signal,
    metadata: (_input: { title?: string; metadata?: Record<string, unknown> }) => {},
    ask: async (_input: { permission: string; patterns: string[]; always: string[]; metadata: Record<string, unknown> }) => {},
    ...overrides,
  };
}

// ============================================================================
// Mock Factories - State Manager
// ============================================================================

/**
 * Default GoopState for testing
 */
export const DEFAULT_TEST_STATE: GoopState = {
  version: 1,
  project: {
    name: "test-project",
    initialized: new Date().toISOString(),
  },
  workflow: {
    phase: "idle",
    mode: "standard",
    depth: "standard",
    researchOptIn: false,
    specLocked: false,
    acceptanceConfirmed: false,
    currentPhase: null,
    currentWave: 0,
    totalWaves: 0,
    lastActivity: new Date().toISOString(),
  },
  execution: {
    activeCheckpointId: null,
    completedPhases: [],
    pendingTasks: [],
  },
};

/**
 * Create a mock StateManager
 * @param initialState - Optional initial state
 */
export function createMockStateManager(initialState: Partial<GoopState> = {}): StateManager {
  let state: GoopState = {
    ...DEFAULT_TEST_STATE,
    ...initialState,
    workflow: { ...DEFAULT_TEST_STATE.workflow, ...initialState.workflow },
    execution: { ...DEFAULT_TEST_STATE.execution, ...initialState.execution },
    project: { ...DEFAULT_TEST_STATE.project, ...initialState.project },
  };
  
  let adlContent = "# Automated Decision Log\n\n";
  const checkpoints = new Map<string, CheckpointData>();
  const history: HistoryEntry[] = [];
  
  return {
    getState: () => state,
    
    setState: (updates: Partial<GoopState>) => {
      state = {
        ...state,
        ...updates,
        workflow: { ...state.workflow, ...updates.workflow },
        execution: { ...state.execution, ...updates.execution },
        project: { ...state.project, ...updates.project },
      };
    },
    
    updateWorkflow: (updates: Partial<GoopState["workflow"]>) => {
      state = {
        ...state,
        workflow: { ...state.workflow, ...updates },
      };
    },
    
    transitionPhase: (to: WorkflowPhase, force = false): boolean => {
      const validTransitions: Record<WorkflowPhase, WorkflowPhase[]> = {
        idle: ["plan"],
        plan: ["research", "specify", "execute"],
        research: ["specify", "plan"],
        specify: ["execute", "plan"],
        execute: ["accept", "plan"],
        accept: ["idle"],
      };
      
      const currentPhase = state.workflow.phase;
      const isValid = force || validTransitions[currentPhase]?.includes(to);
      
      if (isValid) {
        if (state.workflow.phase !== "idle") {
          state.execution.completedPhases = [...state.execution.completedPhases, state.workflow.phase];
        }
        state.workflow.phase = to;
        state.workflow.lastActivity = new Date().toISOString();
        return true;
      }
      return false;
    },
    
    lockSpec: () => {
      state.workflow.specLocked = true;
    },
    
    confirmAcceptance: () => {
      state.workflow.acceptanceConfirmed = true;
    },
    
    setMode: (mode: TaskMode) => {
      state.workflow.mode = mode;
    },
    
    updateWaveProgress: (current: number, total: number) => {
      state.workflow.currentWave = current;
      state.workflow.totalWaves = total;
    },
    
    getADL: () => adlContent,
    
    appendADL: (entry: ADLEntry) => {
      adlContent += `\n## [${entry.type.toUpperCase()}] ${entry.timestamp}\n`;
      adlContent += `**Description:** ${entry.description}\n`;
      adlContent += `**Action:** ${entry.action}\n`;
      if (entry.rule) adlContent += `**Rule:** ${entry.rule}\n`;
      if (entry.files?.length) adlContent += `**Files:** ${entry.files.join(", ")}\n`;
    },
    
    saveCheckpoint: (id: string, data: Omit<CheckpointData, "id">) => {
      checkpoints.set(id, { id, ...data });
    },
    
    loadCheckpoint: (id: string) => checkpoints.get(id) || null,
    
    listCheckpoints: () => Array.from(checkpoints.keys()),
    
    appendHistory: (entry: HistoryEntry) => {
      history.push(entry);
    },
  };
}

// ============================================================================
// Mock Factories - Resource Resolver
// ============================================================================

/**
 * Create a mock resource
 */
export function createMockResource(overrides: Partial<ResolvedResource> = {}): ResolvedResource {
  return {
    name: "test-resource",
    path: "/test/path/resource.md",
    type: "skill",
    frontmatter: {
      name: "test-resource",
      description: "A test resource",
    },
    body: "Test resource body content",
    content: "---\nname: test-resource\n---\nTest resource body content",
    ...overrides,
  };
}

/**
 * Create a mock ResourceResolver
 */
export function createMockResourceResolver(resources: ResolvedResource[] = []): ResourceResolver {
  const resourceMap = new Map<string, ResolvedResource>();
  resources.forEach(r => resourceMap.set(`${r.type}:${r.name}`, r));
  
  return {
    resolve: (type: ResourceType, name: string) => {
      const key = `${type}:${name}`;
      return resourceMap.get(key) || null;
    },
    
    resolveAll: (type: ResourceType) => {
      return resources.filter(r => r.type === type);
    },
    
    getDirectory: (type: ResourceType) => {
      const dirs: Record<ResourceType, string> = {
        agent: "/test/agents",
        command: "/test/commands",
        skill: "/test/skills",
        reference: "/test/references",
        template: "/test/templates",
      };
      return dirs[type] || null;
    },
    
    clearCache: () => {},
  };
}

// ============================================================================
// Mock Factories - Memory Manager
// ============================================================================

/**
 * Create a mock memory
 */
export function createMockMemory(overrides: Partial<Memory> = {}): Memory {
  const now = Date.now();
  return {
    id: 1,
    type: "observation",
    title: "Test Memory",
    content: "Test memory content",
    facts: [],
    concepts: [],
    sourceFiles: [],
    importance: 0.5,
    visibility: "public",
    createdAt: now,
    updatedAt: now,
    accessedAt: now,
    accessCount: 0,
    ...overrides,
  };
}

/**
 * Create a mock MemoryManager
 */
export function createMockMemoryManager(initialMemories: Memory[] = []): MemoryManager {
  const memories = new Map<number, Memory>();
  let nextId = 1;
  
  initialMemories.forEach(m => {
    memories.set(m.id, m);
    if (m.id >= nextId) nextId = m.id + 1;
  });
  
  return {
    save: async (input: MemoryInput): Promise<Memory> => {
      const now = Date.now();
      const memory: Memory = {
        id: nextId++,
        type: input.type,
        title: input.title,
        content: input.content,
        facts: input.facts || [],
        concepts: input.concepts || [],
        sourceFiles: input.sourceFiles || [],
        importance: input.importance ?? 0.5,
        visibility: input.visibility || "public",
        phase: input.phase,
        sessionId: input.sessionId,
        createdAt: now,
        updatedAt: now,
        accessedAt: now,
        accessCount: 0,
      };
      memories.set(memory.id, memory);
      return memory;
    },
    
    search: async (options: SearchOptions): Promise<SearchResult[]> => {
      const results: SearchResult[] = [];
      const query = options.query.toLowerCase();
      
      for (const memory of memories.values()) {
        if (options.types && !options.types.includes(memory.type)) continue;
        if (options.minImportance && memory.importance < options.minImportance) continue;
        if (!options.includePrivate && memory.visibility === "private") continue;
        
        const matchTitle = memory.title.toLowerCase().includes(query);
        const matchContent = memory.content.toLowerCase().includes(query);
        
        if (matchTitle || matchContent) {
          results.push({
            memory,
            score: matchTitle ? 1.0 : 0.8,
            matchType: "fts",
          });
        }
      }
      
      return results.slice(0, options.limit || 10);
    },
    
    getById: async (id: number): Promise<Memory | null> => {
      return memories.get(id) || null;
    },
    
    getRecent: async (limit: number, types?: MemoryType[]): Promise<Memory[]> => {
      let result = Array.from(memories.values());
      if (types) {
        result = result.filter(m => types.includes(m.type));
      }
      return result
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, limit);
    },
    
    update: async (id: number, updates: MemoryUpdate): Promise<Memory | null> => {
      const memory = memories.get(id);
      if (!memory) return null;
      
      const updated = {
        ...memory,
        ...updates,
        updatedAt: Date.now(),
      };
      memories.set(id, updated);
      return updated;
    },
    
    delete: async (id: number): Promise<boolean> => {
      return memories.delete(id);
    },
  };
}

// ============================================================================
// Mock Factories - Plugin Context
// ============================================================================

/**
 * Default GoopSpecConfig for testing
 */
export const DEFAULT_TEST_CONFIG: GoopSpecConfig = {
  enforcement: "assist",
  constitution: true,
  adlEnabled: true,
  defaultModel: "anthropic/claude-sonnet-4-5",
};

/**
 * Create a mock PluginContext
 * @param overrides - Optional overrides for specific parts of the context
 */
export function createMockPluginContext(overrides: {
  testDir?: string;
  config?: Partial<GoopSpecConfig>;
  state?: Partial<GoopState>;
  resources?: ResolvedResource[];
  memories?: Memory[];
  includeMemory?: boolean;
} = {}): PluginContext {
  const testDir = overrides.testDir || createTestDir();
  
  const input: MinimalPluginInput = {
    client: {},
    project: { name: "test-project" },
    directory: testDir,
    worktree: testDir,
    serverUrl: new URL("http://localhost:3000"),
  };
  
  const config: GoopSpecConfig = {
    ...DEFAULT_TEST_CONFIG,
    ...overrides.config,
  };
  
  const ctx: PluginContext = {
    input,
    config,
    resolver: createMockResourceResolver(overrides.resources || []),
    stateManager: createMockStateManager(overrides.state || {}),
  };
  
  if (overrides.includeMemory) {
    ctx.memoryManager = createMockMemoryManager(overrides.memories || []);
  }
  
  return ctx;
}

// ============================================================================
// Test Fixtures - Agents
// ============================================================================

export const TEST_AGENT_RESOURCE: ResolvedResource = {
  name: "goop-planner",
  path: "/test/agents/goop-planner.md",
  type: "agent",
  frontmatter: {
    name: "goop-planner",
    description: "Creates detailed execution plans",
    model: "anthropic/claude-sonnet-4-5",
    temperature: 0.3,
    tools: ["read", "write", "glob"],
    skills: ["planning", "decomposition"],
    references: ["deviation-rules"],
  },
  body: "You are the Planner agent. Create detailed plans.",
  content: "---\nname: goop-planner\n---\nYou are the Planner agent.",
};

export const TEST_ORCHESTRATOR_RESOURCE: ResolvedResource = {
  name: "goop-orchestrator",
  path: "/test/agents/goop-orchestrator.md",
  type: "agent",
  frontmatter: {
    name: "goop-orchestrator",
    description: "Coordinates GoopSpec workflows",
    model: "anthropic/claude-opus-4-5",
    temperature: 0.7,
    tools: ["read", "write", "glob", "task"],
    skills: ["goop-core"],
    references: ["deviation-rules", "constitution"],
  },
  body: "You are the Orchestrator. Coordinate all work.",
  content: "---\nname: goop-orchestrator\n---\nYou are the Orchestrator.",
};

// ============================================================================
// Test Fixtures - Commands
// ============================================================================

export const TEST_COMMAND_RESOURCE: ResolvedResource = {
  name: "goop-plan",
  path: "/test/commands/goop-plan.md",
  type: "command",
  frontmatter: {
    name: "goop-plan",
    description: "Start planning a new feature",
    "argument-hint": "[feature description]",
  },
  body: "Capture user intent and create a plan.",
  content: "---\nname: goop-plan\n---\nCapture user intent.",
};

// ============================================================================
// Test Fixtures - Skills
// ============================================================================

export const TEST_SKILL_RESOURCE: ResolvedResource = {
  name: "goop-core/skill",
  path: "/test/skills/goop-core/skill.md",
  type: "skill",
  frontmatter: {
    name: "goop-core",
    description: "Core GoopSpec workflow knowledge",
    category: "workflow",
    triggers: ["plan", "execute", "verify"],
  },
  body: "# GoopSpec Core\n\nThe 5-phase workflow...",
  content: "---\nname: goop-core\n---\n# GoopSpec Core",
};

// ============================================================================
// Test Fixtures - Phase Files
// ============================================================================

/**
 * Create test phase files in the test directory
 */
export function createTestPhaseFiles(testDir: string, phase: string = "phase-1"): void {
  const phaseDir = join(testDir, ".goopspec", "phases", phase);
  mkdirSync(phaseDir, { recursive: true });
  
  writeFileSync(join(phaseDir, "SPEC.md"), `---
phase: 1
title: Test Phase
status: active
---

# Phase 1 Specification

## Requirements
- Must do X
- Must do Y

## Success Criteria
- Criterion 1
- Criterion 2
`);

  writeFileSync(join(phaseDir, "PLAN.md"), `---
phase: 1
plan: 1.1
type: auto
---

# Phase 1 Plan

## Wave 1: Foundation

<task type="auto">
  <name>Task 1</name>
  <action>Create foundation</action>
</task>

## Wave 2: Implementation

<task type="auto">
  <name>Task 2</name>
  <action>Implement feature</action>
</task>
`);
}

// ============================================================================
// Test Assertions Helpers
// ============================================================================

/**
 * Assert that a value matches the Memory interface structure
 */
export function assertIsMemory(value: unknown): asserts value is Memory {
  if (typeof value !== "object" || value === null) {
    throw new Error("Expected Memory object");
  }
  const mem = value as Record<string, unknown>;
  if (typeof mem.id !== "number") throw new Error("Memory.id must be number");
  if (typeof mem.type !== "string") throw new Error("Memory.type must be string");
  if (typeof mem.title !== "string") throw new Error("Memory.title must be string");
  if (typeof mem.content !== "string") throw new Error("Memory.content must be string");
}

/**
 * Assert that a value matches the GoopState interface structure
 */
export function assertIsGoopState(value: unknown): asserts value is GoopState {
  if (typeof value !== "object" || value === null) {
    throw new Error("Expected GoopState object");
  }
  const state = value as Record<string, unknown>;
  if (typeof state.version !== "number") throw new Error("GoopState.version must be number");
  if (typeof state.project !== "object") throw new Error("GoopState.project must be object");
  if (typeof state.workflow !== "object") throw new Error("GoopState.workflow must be object");
  if (typeof state.execution !== "object") throw new Error("GoopState.execution must be object");
}

// ============================================================================
// Async Test Helpers
// ============================================================================

/**
 * Wait for a specified number of milliseconds
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Wait for a condition to be true
 * @param condition - Function that returns true when condition is met
 * @param timeoutMs - Maximum time to wait
 * @param intervalMs - Polling interval
 */
export async function waitFor(
  condition: () => boolean | Promise<boolean>,
  timeoutMs: number = 5000,
  intervalMs: number = 100
): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await condition()) return;
    await delay(intervalMs);
  }
  throw new Error(`Timeout waiting for condition after ${timeoutMs}ms`);
}

// ============================================================================
// Export all for convenience
// ============================================================================

export {
  type PluginContext,
  type GoopState,
  type GoopSpecConfig,
  type StateManager,
  type ResourceResolver,
  type ResolvedResource,
  type Memory,
  type MemoryManager,
  type ToolContext,
  type WorkflowPhase,
  type TaskMode,
};
