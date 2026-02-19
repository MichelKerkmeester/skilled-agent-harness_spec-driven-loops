#!/usr/bin/env node
// ---------------------------------------------------------------
// MODULE: Validate Memory Quality
// Post-render quality gate for generated memory files
// ---------------------------------------------------------------

import fs from 'fs';
import path from 'path';

type QualityRuleId = 'V1' | 'V2' | 'V3' | 'V4' | 'V5';

interface RuleResult {
  ruleId: QualityRuleId;
  passed: boolean;
  message: string;
}

interface ValidationResult {
  valid: boolean;
  failedRules: QualityRuleId[];
  ruleResults: RuleResult[];
}

const FALLBACK_DECISION_REGEX = /No (specific )?decisions were made/i;
const NON_OPTIONAL_FIELDS = ['decisions', 'next_actions', 'blockers', 'readiness'];

function extractFrontMatter(content: string): string {
  const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (frontMatterMatch) {
    return frontMatterMatch[1];
  }

  const fencedYamlMatch = content.match(/```yaml\n([\s\S]*?)\n```/i);
  return fencedYamlMatch ? fencedYamlMatch[1] : '';
}

function extractYamlValue(frontMatter: string, key: string): string | null {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = frontMatter.match(new RegExp(`^${escapedKey}:\\s*(.+)$`, 'm'));
  return match ? match[1].trim() : null;
}

function parseYamlList(frontMatter: string, key: string): string[] {
  const lines = frontMatter.split('\n');
  const keyRegex = new RegExp(`^${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}:\\s*$`);
  const list: string[] = [];
  let inList = false;

  for (const line of lines) {
    if (!inList && keyRegex.test(line)) {
      inList = true;
      continue;
    }

    if (!inList) {
      continue;
    }

    const listItemMatch = line.match(/^\s*-\s*(.+)$/);
    if (listItemMatch) {
      list.push(listItemMatch[1].replace(/^['"]|['"]$/g, '').trim());
      continue;
    }

    if (line.trim() === '[]') {
      return [];
    }

    if (line.trim() !== '') {
      break;
    }
  }

  return list;
}

function parseToolCount(frontMatter: string): number {
  const raw = extractYamlValue(frontMatter, 'tool_count');
  if (!raw) {
    return 0;
  }
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

function validateMemoryQualityContent(content: string): ValidationResult {
  const frontMatter = extractFrontMatter(content);
  const toolCount = parseToolCount(frontMatter);

  const ruleResults: RuleResult[] = [];

  const v1FailedField = NON_OPTIONAL_FIELDS.find((field) => {
    const pattern = new RegExp(`^${field}:.*\\[TBD\\]`, 'im');
    return pattern.test(content);
  });
  ruleResults.push({
    ruleId: 'V1',
    passed: !v1FailedField,
    message: v1FailedField
      ? `placeholder leakage: field=${v1FailedField}`
      : 'ok',
  });

  const hasNaPlaceholder = /\[N\/A\]/i.test(content);
  ruleResults.push({
    ruleId: 'V2',
    passed: !(toolCount > 0 && hasNaPlaceholder),
    message: toolCount > 0 && hasNaPlaceholder
      ? 'placeholder leakage: [N/A] present with tool execution data'
      : 'ok',
  });

  const specFolder = extractYamlValue(frontMatter, 'spec_folder') || '';
  const malformedSpecFolder =
    /\*\*|\*|\[/.test(specFolder) ||
    /Before I proceed/i.test(specFolder);
  ruleResults.push({
    ruleId: 'V3',
    passed: !malformedSpecFolder,
    message: malformedSpecFolder ? 'malformed spec_folder' : 'ok',
  });

  const hasFallbackDecision = FALLBACK_DECISION_REGEX.test(content);
  ruleResults.push({
    ruleId: 'V4',
    passed: !hasFallbackDecision,
    message: hasFallbackDecision ? 'fallback decision text present' : 'ok',
  });

  const triggerPhrases = parseYamlList(frontMatter, 'trigger_phrases');
  const sparseSemantic = toolCount >= 5 && triggerPhrases.length === 0;
  ruleResults.push({
    ruleId: 'V5',
    passed: !sparseSemantic,
    message: sparseSemantic ? 'sparse semantic fields: trigger_phrases empty' : 'ok',
  });

  const failedRules = ruleResults.filter((rule) => !rule.passed).map((rule) => rule.ruleId);
  return {
    valid: failedRules.length === 0,
    failedRules,
    ruleResults,
  };
}

function validateMemoryQualityFile(filePath: string): ValidationResult {
  const content = fs.readFileSync(filePath, 'utf-8');
  return validateMemoryQualityContent(content);
}

function main(): void {
  const inputPath = process.argv[2];
  if (!inputPath) {
    console.error('Usage: node validate-memory-quality.js <memory-file-path>');
    process.exit(2);
  }

  const resolvedPath = path.resolve(inputPath);
  if (!fs.existsSync(resolvedPath)) {
    console.error(`File not found: ${resolvedPath}`);
    process.exit(2);
  }

  const result = validateMemoryQualityFile(resolvedPath);
  if (!result.valid) {
    console.error(`QUALITY_GATE_FAIL: ${result.failedRules.join(', ')}`);
    for (const failed of result.ruleResults.filter((rule) => !rule.passed)) {
      console.error(`${failed.ruleId}: ${failed.message}`);
    }
    process.exit(1);
  }

  console.log('QUALITY_GATE_PASS');
}

if (require.main === module) {
  main();
}

export {
  validateMemoryQualityContent,
  validateMemoryQualityFile,
};

export type {
  QualityRuleId,
  ValidationResult,
  RuleResult,
};
