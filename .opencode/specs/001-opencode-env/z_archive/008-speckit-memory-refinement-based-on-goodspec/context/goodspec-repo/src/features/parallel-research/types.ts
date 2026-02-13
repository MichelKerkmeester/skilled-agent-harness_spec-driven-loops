/**
 * Type definitions for parallel research system
 * 
 * @module features/parallel-research/types
 */

/**
 * Research task status
 */
export type ResearchTaskStatus = "pending" | "running" | "completed" | "failed";

/**
 * Research focus area
 */
export type ResearchFocus = 
  | "domain"        // Domain and technology landscape
  | "codebase"      // Existing codebase patterns
  | "documentation" // API docs and references
  | "examples"      // Code examples and tutorials
  | "best-practices" // Industry best practices
  | "alternatives"  // Alternative approaches
  | "security"      // Security considerations
  | "performance"   // Performance implications
  | "testing"       // Testing strategies
  | "deployment";   // Deployment considerations

/**
 * Research agent type
 */
export type ResearchAgentType =
  | "goop-researcher"  // Deep domain exploration
  | "goop-explorer"    // Codebase pattern analysis
  | "goop-librarian"   // Documentation gathering
  | "goop-analyst"     // Data analysis and synthesis
  | "goop-architect";  // Architecture evaluation

/**
 * Research priority level
 */
export type ResearchPriority = "low" | "medium" | "high" | "critical";

/**
 * Research quality metrics
 */
export interface ResearchQuality {
  /**
   * Completeness score (0-1)
   */
  completeness: number;
  
  /**
   * Relevance score (0-1)
   */
  relevance: number;
  
  /**
   * Confidence score (0-1)
   */
  confidence: number;
  
  /**
   * Source quality (0-1)
   */
  sourceQuality: number;
}

/**
 * Research metadata
 */
export interface ResearchMetadata {
  /**
   * When research was started
   */
  startedAt: number;
  
  /**
   * When research was completed
   */
  completedAt?: number;
  
  /**
   * Duration in milliseconds
   */
  duration?: number;
  
  /**
   * Number of sources consulted
   */
  sourcesCount?: number;
  
  /**
   * Quality metrics
   */
  quality?: ResearchQuality;
  
  /**
   * Tags for categorization
   */
  tags?: string[];
}

/**
 * Research finding
 */
export interface ResearchFinding {
  /**
   * Finding title
   */
  title: string;
  
  /**
   * Finding content
   */
  content: string;
  
  /**
   * Source of the finding
   */
  source?: string;
  
  /**
   * Confidence level (0-1)
   */
  confidence: number;
  
  /**
   * Related concepts
   */
  concepts?: string[];
  
  /**
   * Code examples
   */
  examples?: string[];
}

/**
 * Research recommendation
 */
export interface ResearchRecommendation {
  /**
   * Recommendation title
   */
  title: string;
  
  /**
   * Recommendation description
   */
  description: string;
  
  /**
   * Priority level
   */
  priority: ResearchPriority;
  
  /**
   * Reasoning behind recommendation
   */
  reasoning: string;
  
  /**
   * Trade-offs to consider
   */
  tradeoffs?: string[];
  
  /**
   * Related findings
   */
  relatedFindings?: string[];
}

/**
 * Research output
 */
export interface ResearchOutput {
  /**
   * Research topic
   */
  topic: string;
  
  /**
   * Focus area
   */
  focus: ResearchFocus;
  
  /**
   * Key findings
   */
  findings: ResearchFinding[];
  
  /**
   * Recommendations
   */
  recommendations: ResearchRecommendation[];
  
  /**
   * Summary
   */
  summary: string;
  
  /**
   * Metadata
   */
  metadata: ResearchMetadata;
}
