/**
 * Task routing system for agent selection
 * @module features/routing
 */

export { routeTask, getAgentForCategory, getCategoryForAgent, listCategories } from "./router.js";
export type { RoutingResult, RouterOptions } from "./router.js";
export { CATEGORY_AGENTS, CATEGORY_KEYWORDS } from "./categories.js";
export type { TaskCategory } from "./categories.js";
