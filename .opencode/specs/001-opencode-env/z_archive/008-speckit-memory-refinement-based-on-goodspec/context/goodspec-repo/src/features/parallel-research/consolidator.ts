/**
 * Research Findings Consolidator
 * Merges parallel research results into RESEARCH.md
 * 
 * @module features/parallel-research/consolidator
 */

import type { ResearchPlan } from "./manager.js";

export interface ConsolidatedFindings {
  topic: string;
  sections: {
    domain: string;
    codebase: string;
    documentation: string;
  };
  recommendations: string[];
  risks: string[];
  completedAt: number;
}

/**
 * Consolidate research findings from all tasks
 */
export function consolidateFindings(plan: ResearchPlan): ConsolidatedFindings {
  const domainTask = plan.tasks.find(t => t.focus === "domain");
  const codebaseTask = plan.tasks.find(t => t.focus === "codebase");
  const docsTask = plan.tasks.find(t => t.focus === "documentation");
  
  return {
    topic: plan.topic,
    sections: {
      domain: domainTask?.result || "(No domain research completed)",
      codebase: codebaseTask?.result || "(No codebase analysis completed)",
      documentation: docsTask?.result || "(No documentation gathered)",
    },
    recommendations: extractRecommendations(plan),
    risks: extractRisks(plan),
    completedAt: Date.now(),
  };
}

/**
 * Extract recommendations from task results
 */
function extractRecommendations(plan: ResearchPlan): string[] {
  const recommendations: string[] = [];
  
  for (const task of plan.tasks) {
    if (task.result) {
      // Simple extraction - look for "recommend" keywords
      const lines = task.result.split("\n");
      for (const line of lines) {
        if (line.toLowerCase().includes("recommend")) {
          recommendations.push(line.trim());
        }
      }
    }
  }
  
  return recommendations;
}

/**
 * Extract risks from task results
 */
function extractRisks(plan: ResearchPlan): string[] {
  const risks: string[] = [];
  
  for (const task of plan.tasks) {
    if (task.result) {
      // Simple extraction - look for "risk", "pitfall", "avoid" keywords
      const lines = task.result.split("\n");
      for (const line of lines) {
        const lower = line.toLowerCase();
        if (lower.includes("risk") || lower.includes("pitfall") || lower.includes("avoid")) {
          risks.push(line.trim());
        }
      }
    }
  }
  
  return risks;
}

/**
 * Format consolidated findings as markdown
 */
export function formatResearchMarkdown(findings: ConsolidatedFindings): string {
  return `# Research: ${findings.topic}

**Completed:** ${new Date(findings.completedAt).toISOString()}

## Domain Research

${findings.sections.domain}

## Codebase Analysis

${findings.sections.codebase}

## Documentation & References

${findings.sections.documentation}

## Recommendations

${findings.recommendations.length > 0 
  ? findings.recommendations.map(r => `- ${r}`).join("\n")
  : "- No specific recommendations extracted"}

## Risks & Pitfalls

${findings.risks.length > 0
  ? findings.risks.map(r => `- ${r}`).join("\n")
  : "- No specific risks identified"}
`;
}
