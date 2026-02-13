/**
 * Parallel Research Manager
 * Spawns multiple research agents to explore simultaneously
 * 
 * @module features/parallel-research/manager
 */

export interface ResearchTask {
  id: string;
  agent: string;
  focus: string;
  prompt: string;
  status: "pending" | "running" | "completed" | "failed";
  result?: string;
  startedAt?: number;
  completedAt?: number;
}

export interface ResearchPlan {
  topic: string;
  tasks: ResearchTask[];
  createdAt: number;
}

export interface ParallelResearchConfig {
  maxParallel: number;
  timeoutMs: number;
  defaultAgents: string[];
}

const DEFAULT_CONFIG: ParallelResearchConfig = {
  maxParallel: 4,
  timeoutMs: 300000, // 5 minutes
  defaultAgents: ["goop-researcher", "goop-explorer", "goop-librarian"],
};

/**
 * Create research tasks for a given topic
 */
export function createResearchPlan(
  topic: string,
  requirements: string[],
  config: Partial<ParallelResearchConfig> = {}
): ResearchPlan {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const tasks: ResearchTask[] = [];
  
  // Researcher: Deep domain exploration
  tasks.push({
    id: `research-${Date.now()}-1`,
    agent: "goop-researcher",
    focus: "domain",
    prompt: `Research the domain and technology landscape for: ${topic}

Focus areas:
${requirements.map(r => `- ${r}`).join("\n")}

Deliverables:
1. Technology options with pros/cons
2. Best practices in this domain
3. Common pitfalls to avoid
4. Recommended approach

Write findings to RESEARCH.md under "## Domain Research"`,
    status: "pending",
  });
  
  // Explorer: Codebase patterns
  tasks.push({
    id: `research-${Date.now()}-2`,
    agent: "goop-explorer",
    focus: "codebase",
    prompt: `Explore the existing codebase for patterns related to: ${topic}

Find:
1. Similar implementations
2. Coding conventions used
3. Test patterns
4. Integration points

Write findings to RESEARCH.md under "## Codebase Analysis"`,
    status: "pending",
  });
  
  // Librarian: Documentation
  tasks.push({
    id: `research-${Date.now()}-3`,
    agent: "goop-librarian",
    focus: "documentation",
    prompt: `Gather documentation and references for: ${topic}

Find:
1. Relevant API documentation
2. Library guides
3. Code examples
4. Stack Overflow solutions

Write findings to RESEARCH.md under "## Documentation & References"`,
    status: "pending",
  });
  
  return {
    topic,
    tasks: tasks.slice(0, cfg.maxParallel),
    createdAt: Date.now(),
  };
}

/**
 * Format research plan for display
 */
export function formatResearchPlan(plan: ResearchPlan): string {
  const lines = [
    `# Research Plan: ${plan.topic}`,
    "",
    `**Created:** ${new Date(plan.createdAt).toISOString()}`,
    `**Tasks:** ${plan.tasks.length}`,
    "",
    "## Tasks",
    "",
  ];
  
  for (const task of plan.tasks) {
    const statusIcon = {
      pending: "⏳",
      running: "🔄",
      completed: "✅",
      failed: "❌",
    }[task.status];
    
    lines.push(`### ${statusIcon} ${task.agent} (${task.focus})`);
    lines.push("");
    lines.push(`**Status:** ${task.status}`);
    if (task.startedAt) {
      lines.push(`**Started:** ${new Date(task.startedAt).toISOString()}`);
    }
    if (task.completedAt) {
      lines.push(`**Completed:** ${new Date(task.completedAt).toISOString()}`);
    }
    lines.push("");
  }
  
  return lines.join("\n");
}

/**
 * Update task status
 */
export function updateTaskStatus(
  plan: ResearchPlan,
  taskId: string,
  status: ResearchTask["status"],
  result?: string
): ResearchPlan {
  const updatedTasks = plan.tasks.map(task => {
    if (task.id === taskId) {
      return {
        ...task,
        status,
        result,
        ...(status === "running" ? { startedAt: Date.now() } : {}),
        ...(status === "completed" || status === "failed" ? { completedAt: Date.now() } : {}),
      };
    }
    return task;
  });
  
  return { ...plan, tasks: updatedTasks };
}

/**
 * Check if all tasks are complete
 */
export function isResearchComplete(plan: ResearchPlan): boolean {
  return plan.tasks.every(t => t.status === "completed" || t.status === "failed");
}

/**
 * Get summary of research progress
 */
export function getResearchProgress(plan: ResearchPlan): {
  total: number;
  completed: number;
  failed: number;
  running: number;
  pending: number;
} {
  return {
    total: plan.tasks.length,
    completed: plan.tasks.filter(t => t.status === "completed").length,
    failed: plan.tasks.filter(t => t.status === "failed").length,
    running: plan.tasks.filter(t => t.status === "running").length,
    pending: plan.tasks.filter(t => t.status === "pending").length,
  };
}
