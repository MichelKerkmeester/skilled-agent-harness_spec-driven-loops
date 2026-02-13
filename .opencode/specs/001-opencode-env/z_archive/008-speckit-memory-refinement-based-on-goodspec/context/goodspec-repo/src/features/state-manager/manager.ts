/**
 * State Manager for GoopSpec
 * File-based state persistence with atomic writes
 * 
 * @module features/state-manager/manager
 */

import { existsSync, readFileSync, writeFileSync, readdirSync, renameSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import type { 
  GoopState, 
  StateManager, 
  ADLEntry, 
  CheckpointData, 
  HistoryEntry,
  WorkflowPhase,
  TaskMode,
  TaskInfo
} from "../../core/types.js";
import { getProjectGoopspecDir } from "../../shared/paths.js";
import { log, logError } from "../../shared/logger.js";

// ============================================================================
// Constants
// ============================================================================

const STATE_VERSION = 1;
const STATE_FILENAME = "state.json";
const ADL_FILENAME = "ADL.md";
const CHECKPOINTS_DIR = "checkpoints";
const HISTORY_DIR = "history";

// ============================================================================
// Default State
// ============================================================================

function createDefaultState(projectName: string = "unnamed"): GoopState {
  const now = new Date().toISOString();
  return {
    version: STATE_VERSION,
    project: {
      name: projectName,
      initialized: now,
    },
    workflow: {
      currentPhase: null,
      phase: "idle" as WorkflowPhase,
      mode: "standard" as TaskMode,
      depth: "standard",
      researchOptIn: false,
      specLocked: false,
      acceptanceConfirmed: false,
      currentWave: 0,
      totalWaves: 0,
      lastActivity: now,
      status: "idle" as WorkflowPhase, // Legacy field
    },
    execution: {
      activeCheckpointId: null,
      completedPhases: [],
      pendingTasks: [],
    },
  };
}

/**
 * Migrate old state format to new format
 * Old format had: active, project_state, continuation_prompt_count, memory_notes
 * New format has: version, project, workflow, execution
 * 
 * Also handles hybrid states where partial new format exists but no version
 */
function migrateOldState(oldState: Record<string, unknown>, projectName?: string): GoopState {
  log("Migrating state to new format (version " + STATE_VERSION + ")");
  
  // Extract data from old format if present
  const projectState = oldState.project_state as Record<string, unknown> | undefined;
  
  // Extract any existing new format data (hybrid case)
  const existingWorkflow = oldState.workflow as Record<string, unknown> | undefined;
  const existingExecution = oldState.execution as Record<string, unknown> | undefined;
  const existingProject = oldState.project as Record<string, unknown> | undefined;
  
  // Determine project name from various sources
  const resolvedProjectName = 
    projectName || 
    (existingProject?.name as string) ||
    (projectState?.name as string) || 
    (projectState?.project_path as string)?.split('/').pop() ||
    "unnamed";
  
  // Determine initialized date
  const initializedDate = 
    (existingProject?.initialized as string) ||
    (typeof projectState?.initialized === 'string' ? projectState.initialized : null) ||
    new Date().toISOString();
  
  // Parse depth with validation
  const rawDepth = existingWorkflow?.depth as string | undefined;
  const validDepths = ["shallow", "standard", "deep"] as const;
  const depth = (rawDepth && validDepths.includes(rawDepth as typeof validDepths[number])) 
    ? rawDepth as typeof validDepths[number]
    : "standard";
  
  // Parse pendingTasks - ensure it's an array of TaskInfo, not strings
  const rawPendingTasks = existingExecution?.pendingTasks;
  const pendingTasks: TaskInfo[] = Array.isArray(rawPendingTasks) 
    ? rawPendingTasks.filter((t): t is TaskInfo => 
        typeof t === 'object' && t !== null && 'id' in t && 'name' in t)
    : [];
  
  return {
    version: STATE_VERSION,
    project: {
      name: resolvedProjectName,
      initialized: initializedDate,
    },
    workflow: {
      currentPhase: (existingWorkflow?.currentPhase as string | null) || null,
      phase: (existingWorkflow?.phase as WorkflowPhase) || "idle",
      mode: (existingWorkflow?.mode as TaskMode) || "standard",
      depth,
      researchOptIn: (existingWorkflow?.researchOptIn as boolean) || false,
      specLocked: (existingWorkflow?.specLocked as boolean) || false,
      acceptanceConfirmed: (existingWorkflow?.acceptanceConfirmed as boolean) || false,
      currentWave: (existingWorkflow?.currentWave as number) || 0,
      totalWaves: (existingWorkflow?.totalWaves as number) || 0,
      lastActivity: (existingWorkflow?.lastActivity as string) || new Date().toISOString(),
      status: (existingWorkflow?.status as WorkflowPhase) || (existingWorkflow?.phase as WorkflowPhase) || "idle",
    },
    execution: {
      activeCheckpointId: (existingExecution?.activeCheckpointId as string) || null,
      completedPhases: (existingExecution?.completedPhases as WorkflowPhase[]) || [],
      pendingTasks,
    },
  };
}

function normalizeState(state: GoopState | Record<string, unknown>, projectName?: string): GoopState {
  // Check if migration is needed:
  // 1. Has old format keys (project_state) without version
  // 2. Has no version key at all (hybrid state from partial updates)
  const hasOldFormat = 'project_state' in state;
  const hasVersion = 'version' in state;
  
  if (hasOldFormat || !hasVersion) {
    return migrateOldState(state as Record<string, unknown>, projectName);
  }
  
  const defaults = createDefaultState(projectName);
  const typedState = state as GoopState;
  
  return {
    ...defaults,
    ...typedState,
    project: {
      ...defaults.project,
      ...typedState.project,
    },
    workflow: {
      ...defaults.workflow,
      ...typedState.workflow,
    },
    execution: {
      ...defaults.execution,
      ...typedState.execution,
    },
  };
}

// ============================================================================
// Phase Transition Validation
// ============================================================================

const VALID_TRANSITIONS: Record<WorkflowPhase, WorkflowPhase[]> = {
  idle: ["plan"],
  plan: ["research", "execute"],  // execute for quick mode
  research: ["specify"],
  specify: ["execute"],
  execute: ["accept"],
  accept: ["idle"],  // cycle complete
};

function canTransition(from: WorkflowPhase, to: WorkflowPhase): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

// ============================================================================
// File Utilities
// ============================================================================

/**
 * Atomic write: write to temp file, then rename
 */
function atomicWriteFile(path: string, content: string): void {
  const dir = dirname(path);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  
  const tempPath = `${path}.tmp.${Date.now()}`;
  writeFileSync(tempPath, content, "utf-8");
  renameSync(tempPath, path);
}

/**
 * Safe read file
 */
function safeReadFile(path: string): string | null {
  try {
    if (!existsSync(path)) {
      return null;
    }
    return readFileSync(path, "utf-8");
  } catch (error) {
    logError(`Failed to read file: ${path}`, error);
    return null;
  }
}

/**
 * Get today's date string for history files
 */
function getTodayDateString(): string {
  return new Date().toISOString().split("T")[0];
}

// ============================================================================
// State Manager Implementation
// ============================================================================

/**
 * Create a state manager for a project
 * 
 * @param projectDir - The project directory
 * @param projectName - Optional project name for default state
 */
export function createStateManager(
  projectDir: string, 
  projectName?: string
): StateManager {
  const goopspecDir = getProjectGoopspecDir(projectDir);
  const statePath = join(goopspecDir, STATE_FILENAME);
  const adlPath = join(goopspecDir, ADL_FILENAME);
  const checkpointsDir = join(goopspecDir, CHECKPOINTS_DIR);
  const historyDir = join(goopspecDir, HISTORY_DIR);

  // In-memory cache of current state
  let cachedState: GoopState | null = null;

  /**
   * Ensure .goopspec directory exists
   */
  function ensureGoopspecDir(): void {
    if (!existsSync(goopspecDir)) {
      mkdirSync(goopspecDir, { recursive: true });
    }
  }

  /**
   * Load state from disk
   */
  function loadState(): GoopState {
    if (cachedState) {
      return cachedState;
    }

    const content = safeReadFile(statePath);
    if (!content) {
      cachedState = createDefaultState(projectName);
      return cachedState;
    }

    try {
      const parsed = JSON.parse(content) as Record<string, unknown>;
      
      // Check if migration is needed
      const needsMigration = !('version' in parsed) || ('project_state' in parsed);
      
      cachedState = normalizeState(parsed, projectName);
      
      // If migration occurred, persist the migrated state to disk
      if (needsMigration) {
        log("Persisting migrated state to disk");
        saveState(cachedState);
      }
      
      return cachedState;
    } catch (error) {
      logError("Failed to parse state.json, using default", error);
      cachedState = createDefaultState(projectName);
      return cachedState;
    }
  }

  /**
   * Save state to disk
   */
  function saveState(state: GoopState): void {
    ensureGoopspecDir();
    atomicWriteFile(statePath, JSON.stringify(state, null, 2));
    cachedState = state;
  }

  // -------------------------------------------------------------------------
  // StateManager Interface Implementation
  // -------------------------------------------------------------------------

  function getState(): GoopState {
    return loadState();
  }

  function setState(updates: Partial<GoopState>): void {
    const current = loadState();
    const newState: GoopState = {
      ...current,
      ...updates,
      workflow: {
        ...current.workflow,
        ...(updates.workflow || {}),
        lastActivity: new Date().toISOString(),
      },
      execution: {
        ...current.execution,
        ...(updates.execution || {}),
      },
    };
    saveState(newState);
  }

  function updateWorkflow(updates: Partial<GoopState["workflow"]>): void {
    const current = loadState();
    const newState: GoopState = {
      ...current,
      workflow: {
        ...current.workflow,
        ...updates,
        lastActivity: new Date().toISOString(),
      },
    };
    saveState(newState);
  }

  function getADL(): string {
    ensureGoopspecDir();
    const content = safeReadFile(adlPath);
    if (!content) {
      // Create default ADL file
      const defaultADL = `# Automated Decision Log (ADL)

This file tracks architectural decisions, deviations, and observations made during development.

---

`;
      atomicWriteFile(adlPath, defaultADL);
      return defaultADL;
    }
    return content;
  }

  function appendADL(entry: ADLEntry): void {
    ensureGoopspecDir();
    
    // Ensure ADL exists
    getADL();

    // Format entry
    const ruleText = entry.rule ? ` (Rule ${entry.rule})` : "";
    const filesText = entry.files?.length 
      ? `\n- Files: ${entry.files.join(", ")}` 
      : "";
    
    const entryText = `
## [${entry.type.toUpperCase()}]${ruleText} - ${entry.timestamp}

**Description:** ${entry.description}

**Action:** ${entry.action}${filesText}

---
`;

    const current = safeReadFile(adlPath) || "";
    atomicWriteFile(adlPath, current + entryText);
    log("ADL entry added", { type: entry.type });
  }

  function saveCheckpoint(id: string, data: Omit<CheckpointData, "id">): void {
    ensureGoopspecDir();
    
    if (!existsSync(checkpointsDir)) {
      mkdirSync(checkpointsDir, { recursive: true });
    }

    const checkpoint: CheckpointData = {
      id,
      ...data,
    };

    const path = join(checkpointsDir, `${id}.json`);
    atomicWriteFile(path, JSON.stringify(checkpoint, null, 2));
    
    // Update state with active checkpoint
    updateWorkflow({});
    const current = loadState();
    saveState({
      ...current,
      execution: {
        ...current.execution,
        activeCheckpointId: id,
      },
    });
    
    log("Checkpoint saved", { id });
  }

  function loadCheckpoint(id: string): CheckpointData | null {
    const path = join(checkpointsDir, `${id}.json`);
    const content = safeReadFile(path);
    
    if (!content) {
      return null;
    }

    try {
      return JSON.parse(content) as CheckpointData;
    } catch (error) {
      logError(`Failed to parse checkpoint: ${id}`, error);
      return null;
    }
  }

  function listCheckpoints(): string[] {
    if (!existsSync(checkpointsDir)) {
      return [];
    }

    try {
      const files = readdirSync(checkpointsDir);
      return files
        .filter(f => f.endsWith(".json"))
        .map(f => f.replace(".json", ""));
    } catch (error) {
      logError("Failed to list checkpoints", error);
      return [];
    }
  }

  function appendHistory(entry: HistoryEntry): void {
    ensureGoopspecDir();
    
    if (!existsSync(historyDir)) {
      mkdirSync(historyDir, { recursive: true });
    }

    const dateStr = getTodayDateString();
    const historyPath = join(historyDir, `${dateStr}.json`);

    let entries: HistoryEntry[] = [];
    const existing = safeReadFile(historyPath);
    
    if (existing) {
      try {
        entries = JSON.parse(existing);
      } catch {
        entries = [];
      }
    }

    entries.push(entry);
    atomicWriteFile(historyPath, JSON.stringify(entries, null, 2));
    log("History entry added", { type: entry.type });
  }

  function transitionPhase(to: WorkflowPhase, force: boolean = false): boolean {
    const current = loadState();
    const from = current.workflow.phase;
    const validTransitions = VALID_TRANSITIONS[from] ?? [];
    
    if (!force && !canTransition(from, to)) {
      const validList = validTransitions.length > 0
        ? validTransitions.join(", ")
        : "none";
      logError(
        `Invalid phase transition: ${from} -> ${to}. ` +
        `Valid transitions: ${validList}. Use force=true to override.`
      );
      return false;
    }
    
    if (force && !canTransition(from, to)) {
      log("Forcing phase transition (bypassing validation)", { from, to });
      appendADL({
        timestamp: new Date().toISOString(),
        type: "decision",
        description: `Forced phase transition: ${from} -> ${to}`,
        action: "Bypassed transition validation using force=true",
      });
    }
    
    const newState: GoopState = {
      ...current,
      workflow: {
        ...current.workflow,
        phase: to,
        status: to, // Keep legacy field in sync
        lastActivity: new Date().toISOString(),
      },
      execution: {
        ...current.execution,
        completedPhases: from !== "idle" && to !== from
          ? [...current.execution.completedPhases, from]
          : current.execution.completedPhases,
      },
    };
    
    saveState(newState);
    log("Phase transition", { from, to, forced: force });
    
    // Log to history
    appendHistory({
      timestamp: new Date().toISOString(),
      type: "phase_change",
      data: { from, to, forced: force },
    });
    
    return true;
  }

  function lockSpec(): void {
    const current = loadState();
    const newState: GoopState = {
      ...current,
      workflow: {
        ...current.workflow,
        specLocked: true,
        lastActivity: new Date().toISOString(),
      },
    };
    saveState(newState);
    log("Spec locked");
  }

  function confirmAcceptance(): void {
    const current = loadState();
    const newState: GoopState = {
      ...current,
      workflow: {
        ...current.workflow,
        acceptanceConfirmed: true,
        lastActivity: new Date().toISOString(),
      },
    };
    saveState(newState);
    log("Acceptance confirmed");
  }

  function setMode(mode: TaskMode): void {
    const current = loadState();
    const newState: GoopState = {
      ...current,
      workflow: {
        ...current.workflow,
        mode,
        lastActivity: new Date().toISOString(),
      },
    };
    saveState(newState);
    log("Task mode set", { mode });
  }

  function updateWaveProgress(currentWave: number, totalWaves: number): void {
    const current = loadState();
    const newState: GoopState = {
      ...current,
      workflow: {
        ...current.workflow,
        currentWave,
        totalWaves,
        lastActivity: new Date().toISOString(),
      },
    };
    saveState(newState);
    log("Wave progress updated", { currentWave, totalWaves });
  }

  return {
    getState,
    setState,
    updateWorkflow,
    transitionPhase,
    lockSpec,
    confirmAcceptance,
    setMode,
    updateWaveProgress,
    getADL,
    appendADL,
    saveCheckpoint,
    loadCheckpoint,
    listCheckpoints,
    appendHistory,
  };
}

/**
 * Initialize a new .goopspec directory with default state
 */
export async function initializeGoopspec(
  projectDir: string, 
  projectName: string
): Promise<void> {
  const manager = createStateManager(projectDir, projectName);
  
  // This will create the default state
  const state = manager.getState();
  manager.setState({ 
    project: { 
      ...state.project, 
      name: projectName 
    } 
  });
  
  // Initialize ADL
  manager.getADL();
  
  log("GoopSpec initialized", { projectDir, projectName });
}
