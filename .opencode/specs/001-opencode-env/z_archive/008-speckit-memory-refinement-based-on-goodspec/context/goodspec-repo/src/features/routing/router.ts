/**
 * Task routing logic for agent selection
 * @module features/routing/router
 */

import type { TaskCategory } from "./categories.js";
import { CATEGORY_AGENTS, CATEGORY_KEYWORDS } from "./categories.js";

export interface RoutingResult {
  category: TaskCategory;
  agent: string;
  confidence: number;
  matchedKeywords: string[];
}

export interface RouterOptions {
  defaultCategory?: TaskCategory;
  confidenceThreshold?: number;
}

/**
 * Route a task to the appropriate agent based on content
 * 
 * Algorithm:
 * 1. Normalize task description to lowercase
 * 2. Score each category based on keyword matches
 * 3. Find highest scoring category
 * 4. Return category, agent, confidence, and matched keywords
 * 
 * @param taskDescription - The task description to route
 * @param options - Routing options
 * @returns Routing result with category, agent, and confidence
 */
export function routeTask(
  taskDescription: string,
  options?: RouterOptions
): RoutingResult {
  const defaultCategory = options?.defaultCategory ?? "general";
  const threshold = options?.confidenceThreshold ?? 0.3;
  
  const scores: Record<TaskCategory, number> = {} as Record<TaskCategory, number>;
  const matches: Record<TaskCategory, string[]> = {} as Record<TaskCategory, string[]>;
  
  const lowerTask = taskDescription.toLowerCase();
  
  // Score each category based on keyword matches
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    scores[category as TaskCategory] = 0;
    matches[category as TaskCategory] = [];
    
    // Skip categories with no keywords (like general)
    if (keywords.length === 0) {
      continue;
    }
    
    for (const keyword of keywords) {
      const lowerKeyword = keyword.toLowerCase();
      // For multi-word keywords, allow flexible word order and extra words
      const words = lowerKeyword.split(/\s+/);
      
      if (words.length > 1) {
        // Multi-word: check if all words appear in order (with possible words in between)
        const pattern = words.map(w => `\\b${w}\\b`).join('.*?');
        const regex = new RegExp(pattern, 'i');
        if (regex.test(lowerTask)) {
          // Multi-word keywords get higher weight (more specific)
          scores[category as TaskCategory] += words.length;
          matches[category as TaskCategory].push(keyword);
        }
      } else {
        // Single word: require exact word boundary match
        const regex = new RegExp(`\\b${lowerKeyword}\\b`, 'i');
        if (regex.test(lowerTask)) {
          scores[category as TaskCategory] += 1.0;
          matches[category as TaskCategory].push(keyword);
        }
      }
    }
  }
  
  // Find highest scoring category
  let bestCategory: TaskCategory = defaultCategory;
  let bestScore = 0;
  
  for (const [category, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category as TaskCategory;
    }
  }
  
  // If no strong match, use default
  if (bestScore < threshold) {
    bestCategory = defaultCategory;
  }
  
  // Normalize confidence to 0-1 range
  // A score of 3+ is considered very confident
  const normalizedConfidence = Math.min(bestScore / 3.0, 1.0);
  
  return {
    category: bestCategory,
    agent: CATEGORY_AGENTS[bestCategory],
    confidence: normalizedConfidence,
    matchedKeywords: matches[bestCategory] || [],
  };
}

/**
 * Get agent for a specific category
 */
export function getAgentForCategory(category: TaskCategory): string {
  return CATEGORY_AGENTS[category];
}

/**
 * Get category for a specific agent
 */
export function getCategoryForAgent(agentName: string): TaskCategory | null {
  for (const [category, agent] of Object.entries(CATEGORY_AGENTS)) {
    if (agent === agentName) {
      return category as TaskCategory;
    }
  }
  return null;
}

/**
 * List all available categories with their agents
 */
export function listCategories(): Array<{ category: TaskCategory; agent: string; keywords: string[] }> {
  return (Object.keys(CATEGORY_AGENTS) as TaskCategory[]).map(category => ({
    category,
    agent: CATEGORY_AGENTS[category],
    keywords: CATEGORY_KEYWORDS[category],
  }));
}
