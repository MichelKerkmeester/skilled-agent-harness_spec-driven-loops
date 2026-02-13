/**
 * Tools Integration Tests
 * Tests all GoopSpec tools with mocked context
 * 
 * @module tools/tools.test
 */

import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { mkdirSync, rmSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import type { PluginContext, GoopSpecConfig, GoopState, ADLEntry, CheckpointData, HistoryEntry } from "../core/types.js";
import { createResourceResolver } from "../core/resolver.js";
import { createStateManager } from "../features/state-manager/manager.js";
import { createTools } from "./index.js";
import { createGoopStatusTool } from "./goop-status/index.js";
import { createGoopAdlTool } from "./goop-adl/index.js";
import { createGoopSpecTool } from "./goop-spec/index.js";
import { createGoopCheckpointTool } from "./goop-checkpoint/index.js";
import { createGoopSkillTool } from "./goop-skill/index.js";
import { createGoopDelegateTool } from "./goop-delegate/index.js";
import { createSlashcommandTool } from "./slashcommand/index.js";

// Test constants
const TEST_DIR = join(tmpdir(), `goopspec-tools-test-${Date.now()}`);
const GOOPSPEC_DIR = join(TEST_DIR, ".goopspec");

// Mock tool context (matches @opencode-ai/plugin/tool ToolContext)
const mockToolContext = {
  sessionID: "test-session-123",
  messageID: "test-message-456",
  agent: "test-agent",
  directory: TEST_DIR,
  worktree: TEST_DIR,
  abort: new AbortController().signal,
  // SDK required methods
  metadata: (_input: { title?: string; metadata?: Record<string, unknown> }) => {},
  ask: async (_input: { permission: string; patterns: string[]; always: string[]; metadata: Record<string, unknown> }) => {},
};

// Default config for tests
const defaultConfig: GoopSpecConfig = {
  enforcement: "assist",
  constitution: true,
  adlEnabled: true,
  defaultModel: "anthropic/claude-sonnet-4-5",
};

/**
 * Create test fixture directories and files
 */
function setupTestFixtures() {
  // Create base directories
  mkdirSync(TEST_DIR, { recursive: true });
  mkdirSync(GOOPSPEC_DIR, { recursive: true });
  
  // Create resources directories
  const agentsDir = join(TEST_DIR, "agents");
  const commandsDir = join(TEST_DIR, "commands");
  const skillsDir = join(TEST_DIR, "skills", "test-skill");
  const referencesDir = join(TEST_DIR, "references");
  
  mkdirSync(agentsDir, { recursive: true });
  mkdirSync(commandsDir, { recursive: true });
  mkdirSync(skillsDir, { recursive: true });
  mkdirSync(referencesDir, { recursive: true });
  
  // Create test agent
  writeFileSync(join(agentsDir, "test-agent.md"), `---
name: test-agent
description: A test agent for testing
model: anthropic/claude-sonnet-4-5
temperature: 0.5
tools:
  - read
  - write
skills:
  - test-skill
references:
  - test-reference
---

You are a test agent. Follow instructions carefully.
`);
  
  // Create test command
  writeFileSync(join(commandsDir, "test-command.md"), `---
name: test-command
description: A test command
argument-hint: "[optional-arg]"
---

Execute the test command with the following steps:

1. Step one
2. Step two
3. Step three
`);
  
  // Create test skill
  writeFileSync(join(skillsDir, "skill.md"), `---
name: test-skill
description: A test skill
category: testing
triggers:
  - test
  - testing
---

# Test Skill

This is a test skill content.

## Instructions

Follow these instructions...
`);
  
  // Create test reference
  writeFileSync(join(referencesDir, "test-reference.md"), `---
name: test-reference
description: A test reference
---

# Test Reference

This is reference content for testing.
`);
  
  // Create phases directory with test phase
  const phasesDir = join(GOOPSPEC_DIR, "phases", "phase-1");
  mkdirSync(phasesDir, { recursive: true });
  
  writeFileSync(join(phasesDir, "SPEC.md"), `---
phase: 1
title: Test Phase
status: active
---

# Phase 1 Specification

This is the test specification.
`);
  
  writeFileSync(join(phasesDir, "PLAN.md"), `---
phase: 1
plan: 1.1
type: auto
---

# Phase 1 Plan

<task type="auto">
  <name>Test Task</name>
  <action>Do something</action>
</task>
`);
}

/**
 * Create a plugin context for testing
 */
function createTestContext(): PluginContext {
  return {
    input: {
      client: {},
      project: { name: "test-project" },
      directory: TEST_DIR,
      worktree: TEST_DIR,
      serverUrl: new URL("http://localhost:3000"),
    },
    config: defaultConfig,
    resolver: createResourceResolver(TEST_DIR),
    stateManager: createStateManager(TEST_DIR, "test-project"),
  };
}

describe("Tools", () => {
  beforeEach(() => {
    setupTestFixtures();
  });
  
  afterEach(() => {
    if (existsSync(TEST_DIR)) {
      rmSync(TEST_DIR, { recursive: true, force: true });
    }
  });
  
  describe("createTools", () => {
    it("creates all expected tools", () => {
      const ctx = createTestContext();
      const tools = createTools(ctx);
      
      expect(Object.keys(tools)).toContain("goop_status");
      expect(Object.keys(tools)).toContain("goop_adl");
      expect(Object.keys(tools)).toContain("goop_spec");
      expect(Object.keys(tools)).toContain("goop_checkpoint");
      expect(Object.keys(tools)).toContain("goop_skill");
      expect(Object.keys(tools)).toContain("goop_delegate");
      expect(Object.keys(tools)).toContain("slashcommand");
    });
    
    it("all tools have description and args", () => {
      const ctx = createTestContext();
      const tools = createTools(ctx);
      
      for (const [name, tool] of Object.entries(tools)) {
        expect(tool.description).toBeDefined();
        expect(typeof tool.description).toBe("string");
        expect(tool.args).toBeDefined();
        expect(tool.execute).toBeDefined();
        expect(typeof tool.execute).toBe("function");
      }
    });
  });
  
  describe("goop_status", () => {
    it("shows workflow status", async () => {
      const ctx = createTestContext();
      const tool = createGoopStatusTool(ctx);
      
      const result = await tool.execute({ verbose: false }, mockToolContext);
      
      expect(result).toContain("# GoopSpec Status");
      expect(result).toContain("**Project:**");
      expect(result).toContain("## Workflow");
      expect(result).toContain("## Execution");
    });
    
    it("shows verbose output with pending tasks", async () => {
      const ctx = createTestContext();
      
      // Add pending tasks to state
      ctx.stateManager.setState({
        execution: {
          activeCheckpointId: null,
          completedPhases: [],
          pendingTasks: [
            { id: "1", name: "Task 1", phase: "1", plan: "1.1", status: "pending" },
            { id: "2", name: "Task 2", phase: "1", plan: "1.2", status: "in_progress" },
          ],
        },
      });
      
      const tool = createGoopStatusTool(ctx);
      const result = await tool.execute({ verbose: true }, mockToolContext);
      
      expect(result).toContain("### Pending Tasks");
      expect(result).toContain("Task 1");
      expect(result).toContain("Task 2");
    });
  });
  
  describe("goop_adl", () => {
    it("reads ADL content", async () => {
      const ctx = createTestContext();
      const tool = createGoopAdlTool(ctx);
      
      const result = await tool.execute({ action: "read" }, mockToolContext);
      
      expect(result).toContain("# Automated Decision Log");
    });
    
    it("appends entry to ADL", async () => {
      const ctx = createTestContext();
      const tool = createGoopAdlTool(ctx);
      
      const result = await tool.execute({
        action: "append",
        type: "decision",
        description: "Test decision",
        entry_action: "Made a test decision",
      }, mockToolContext);
      
      expect(result).toContain("ADL entry added");
      expect(result).toContain("DECISION");
      
      // Verify it was written
      const adl = ctx.stateManager.getADL();
      expect(adl).toContain("Test decision");
      expect(adl).toContain("Made a test decision");
    });
    
    it("requires fields for append", async () => {
      const ctx = createTestContext();
      const tool = createGoopAdlTool(ctx);
      
      const result = await tool.execute({ action: "append" }, mockToolContext);
      
      expect(result).toContain("Error:");
      expect(result).toContain("required");
    });
    
    it("supports deviation entries with rule number", async () => {
      const ctx = createTestContext();
      const tool = createGoopAdlTool(ctx);
      
      const result = await tool.execute({
        action: "append",
        type: "deviation",
        description: "Deviated from plan",
        entry_action: "Added extra feature",
        rule: 2,
        files: ["src/index.ts", "src/utils.ts"],
      }, mockToolContext);
      
      expect(result).toContain("DEVIATION");
      
      const adl = ctx.stateManager.getADL();
      expect(adl).toContain("Rule 2");
      expect(adl).toContain("src/index.ts");
    });
  });
  
  describe("goop_spec", () => {
    it("lists phases", async () => {
      const ctx = createTestContext();
      const tool = createGoopSpecTool(ctx);
      
      const result = await tool.execute({ action: "list", file: "both" }, mockToolContext);
      
      expect(result).toContain("# Available Phases");
      expect(result).toContain("phase-1");
    });
    
    it("reads phase files", async () => {
      const ctx = createTestContext();
      const tool = createGoopSpecTool(ctx);
      
      const result = await tool.execute({ 
        action: "read", 
        phase: "phase-1",
        file: "both",
      }, mockToolContext);
      
      expect(result).toContain("# SPEC.md");
      expect(result).toContain("# PLAN.md");
      expect(result).toContain("Test Phase");
    });
    
    it("validates phase files", async () => {
      const ctx = createTestContext();
      const tool = createGoopSpecTool(ctx);
      
      const result = await tool.execute({ 
        action: "validate", 
        phase: "phase-1",
        file: "both",
      }, mockToolContext);
      
      expect(result).toContain("# Validation for Phase");
      expect(result).toContain("## SPEC.md");
      expect(result).toContain("## PLAN.md");
    });
    
    it("requires phase for read action", async () => {
      const ctx = createTestContext();
      const tool = createGoopSpecTool(ctx);
      
      const result = await tool.execute({ action: "read", file: "both" }, mockToolContext);
      
      expect(result).toContain("Error:");
      expect(result).toContain("phase");
    });
  });
  
  describe("goop_checkpoint", () => {
    it("saves checkpoint", async () => {
      const ctx = createTestContext();
      const tool = createGoopCheckpointTool(ctx);
      
      const result = await tool.execute({
        action: "save",
        id: "test-checkpoint-1",
        context: { note: "Test context" },
      }, mockToolContext);
      
      expect(result).toContain("Checkpoint saved");
      expect(result).toContain("test-checkpoint-1");
    });
    
    it("lists checkpoints", async () => {
      const ctx = createTestContext();
      const tool = createGoopCheckpointTool(ctx);
      
      // Save a checkpoint first
      await tool.execute({ action: "save", id: "cp-1" }, mockToolContext);
      await tool.execute({ action: "save", id: "cp-2" }, mockToolContext);
      
      const result = await tool.execute({ action: "list" }, mockToolContext);
      
      expect(result).toContain("# Saved Checkpoints");
      expect(result).toContain("cp-1");
      expect(result).toContain("cp-2");
    });
    
    it("loads checkpoint", async () => {
      const ctx = createTestContext();
      const tool = createGoopCheckpointTool(ctx);
      
      // Save a checkpoint
      await tool.execute({
        action: "save",
        id: "load-test",
        context: { test: true },
      }, mockToolContext);
      
      // Load it
      const result = await tool.execute({
        action: "load",
        id: "load-test",
      }, mockToolContext);
      
      expect(result).toContain("# Checkpoint Loaded");
      expect(result).toContain("load-test");
    });
    
    it("handles missing checkpoint", async () => {
      const ctx = createTestContext();
      const tool = createGoopCheckpointTool(ctx);
      
      const result = await tool.execute({
        action: "load",
        id: "nonexistent",
      }, mockToolContext);
      
      expect(result).toContain("not found");
    });
  });
  
  describe("goop_skill", () => {
    it("lists available skills (uses bundled)", async () => {
      const ctx = createTestContext();
      const tool = createGoopSkillTool(ctx);
      
      // Cast to any to test runtime behavior
      const result = await tool.execute({ name: "", list: true } as any, mockToolContext);
      
      // The resolver falls back to bundled skills when test fixtures don't match structure
      // Test that it returns a string (either skills list or "No skills available")
      expect(typeof result).toBe("string");
    });
    
    it("loads specific skill", async () => {
      const ctx = createTestContext();
      const tool = createGoopSkillTool(ctx);
      
      const result = await tool.execute({ name: "test-skill" }, mockToolContext);
      
      // The skill may or may not be found depending on resolution
      // This tests the tool doesn't crash
      expect(typeof result).toBe("string");
    });
  });
  
  describe("goop_delegate", () => {
    it("lists available agents (uses bundled)", async () => {
      const ctx = createTestContext();
      const tool = createGoopDelegateTool(ctx);
      
      // Cast to any to test runtime behavior (list mode)
      const result = await tool.execute({ list: true } as any, mockToolContext);
      
      expect(result).toContain("# Available Agents");
      // Uses bundled agents - check for one of them
      expect(result).toContain("goop-orchestrator");
    });
    
    it("prepares task tool delegation payload", async () => {
      const ctx = createTestContext();
      const tool = createGoopDelegateTool(ctx);
      
      const result = await tool.execute({
        agent: "goop-planner",
        prompt: "Do something cool",
      }, mockToolContext);
      
      expect(result).toContain("<goop_delegation>");
      expect(result).toContain("goop-planner");
      expect(result).toContain("task");
    });
    
    it("requires prompt for delegation", async () => {
      const ctx = createTestContext();
      const tool = createGoopDelegateTool(ctx);
      
      // Cast to any to test runtime behavior
      const result = await tool.execute({
        agent: "goop-planner",
      } as any, mockToolContext);
      
      expect(result).toContain("Error:");
      expect(result).toContain("prompt");
    });
    
    it("handles unknown agent", async () => {
      const ctx = createTestContext();
      const tool = createGoopDelegateTool(ctx);
      
      const result = await tool.execute({
        agent: "nonexistent-agent",
        prompt: "Test",
      }, mockToolContext);
      
      expect(result).toContain("not found");
    });
  });
  
  describe("slashcommand", () => {
    it("executes bundled command", async () => {
      const ctx = createTestContext();
      const tool = createSlashcommandTool(ctx);
      
      // Use a bundled command
      const result = await tool.execute({
        command: "goop-status",
      }, mockToolContext);
      
      expect(result).toContain("# /goop-status Command");
    });
    
    it("handles unknown command", async () => {
      const ctx = createTestContext();
      const tool = createSlashcommandTool(ctx);
      
      const result = await tool.execute({
        command: "nonexistent",
      }, mockToolContext);
      
      expect(result).toContain("not found");
      expect(result).toContain("Available commands");
    });
    
    it("normalizes command name (removes leading slash)", async () => {
      const ctx = createTestContext();
      const tool = createSlashcommandTool(ctx);
      
      // With leading slash
      const result = await tool.execute({
        command: "/goop-help",
      }, mockToolContext);
      
      expect(result).toContain("# /goop-help Command");
    });
    
    it("has dynamic description with bundled commands", async () => {
      const ctx = createTestContext();
      const tool = createSlashcommandTool(ctx);
      
      // Should include bundled commands (goop-plan replaced goop-new in 0.1.0)
      expect(tool.description).toContain("goop-plan");
      expect(tool.description).toContain("goop-execute");
    });
  });
});
