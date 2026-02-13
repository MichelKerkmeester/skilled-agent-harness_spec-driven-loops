/**
 * Task categories for agent routing
 * @module features/routing/categories
 */

/**
 * Task categories for agent routing
 */
export type TaskCategory = 
  | "code"      // Implementation tasks
  | "plan"      // Architecture and planning
  | "research"  // Deep exploration
  | "explore"   // Fast codebase search
  | "search"    // Documentation lookup
  | "verify"    // Spec compliance checking
  | "debug"     // Bug investigation
  | "visual"    // UI/UX design
  | "test"      // Test writing
  | "docs"      // Documentation
  | "memory"    // Memory operations
  | "general";  // Fallback

/**
 * Category to agent mapping
 */
export const CATEGORY_AGENTS: Record<TaskCategory, string> = {
  code: "goop-executor",
  plan: "goop-planner",
  research: "goop-researcher",
  explore: "goop-explorer",
  search: "goop-librarian",
  verify: "goop-verifier",
  debug: "goop-debugger",
  visual: "goop-designer",
  test: "goop-tester",
  docs: "goop-writer",
  memory: "memory-distiller",
  general: "goop-executor",
};

/**
 * Keywords that suggest each category
 */
export const CATEGORY_KEYWORDS: Record<TaskCategory, string[]> = {
  code: ["implement", "build", "write code", "add feature", "modify", "create function", "create class"],
  plan: ["plan", "architect", "design system", "blueprint", "wave", "task breakdown"],
  research: ["research", "investigate", "explore options", "compare", "analyze"],
  explore: ["find", "locate", "search codebase", "map", "pattern"],
  search: ["documentation", "api docs", "library", "reference"],
  verify: ["verify", "audit", "check", "validate", "compliance"],
  debug: ["debug", "fix bug", "investigate error", "troubleshoot", "root cause"],
  visual: ["ui", "ux", "design", "layout", "component design", "visual"],
  test: ["test", "coverage", "spec", "assertion", "e2e", "write test", "write tests"],
  docs: ["document", "readme", "guide", "explain", "write docs", "write guide"],
  memory: ["remember", "recall", "extract", "distill"],
  general: [],
};
