// ────────────────────────────────────────────────────────────────
// MODULE: v3 Schema Contract Tests
// ────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { buildWritePrompt, getPromptSchemaContract } from '../scripts/build-write-prompt';
import {
  emitQuickStart,
  formatSchemaSectionV3,
  formatSchemaValueSectionsV3,
  getFormatterSchemaContract,
} from '../scripts/formatters-v3';
import {
  assertSchemaConsumerContracts,
  createV3Schema,
  resolveValidationPolicy,
  resolveSchemaSections,
  schemaDigest,
  V3_SCHEMA,
} from '../scripts/schema-v3';
import {
  checkSectionCompleteness,
  getValidatorSchemaContract,
  isValidationPass,
  validateDesignMd,
} from '../scripts/validate';

import type { SchemaSection } from '../scripts/schema-v3';
import type { DesignTokens } from '../scripts/types';

function tokens(overrides: Record<string, unknown> = {}): DesignTokens {
  return {
    colorTokens: [
      {
        hex: '#123456', rgba: [18, 52, 86, 1], frequency: 12,
        usedAs: { textColor: 3, bgColor: 4, borderColor: 2, shadowColor: 0, gradientColor: 0, iconColor: 0 },
        cssVariableNames: [], pagesCoverage: 1, sourcePages: [], confidence: 'high',
        stability: { layer: 'system', confidence: 1, signals: [] },
      },
    ],
    typographyLevels: [
      {
        fontFamily: 'Example Sans', fontSize: '16px', fontWeight: '400', lineHeight: '24px',
        letterSpacing: '0px', textTransform: null, fontFeatureSettings: null, frequency: 20,
        typicalTags: ['p'], sampleTexts: [], confidence: 'high',
      },
    ],
    spacingSystem: {
      baseUnit: 4, scale: [4, 8, 16], frequencyMap: {}, maxContentWidth: '100%', sectionSpacing: [],
    },
    radiusTokens: [],
    shadowTokens: [],
    components: [],
    gradients: [],
    fontInfo: {
      fontFaces: [{ family: 'Example Sans', weight: '400', style: 'normal', src: '' }],
      loadedFonts: [{ family: 'Example Sans', weight: '400', style: 'normal' }],
      googleFontsLinks: [],
    },
    meta: {
      sourceUrls: ['https://target.invalid'], totalPages: 1, extractionDate: '2026-01-01',
      framework: null, totalElements: 10, extractionTime: 1,
    },
    ...overrides,
  } as unknown as DesignTokens;
}

function v3Document(input: DesignTokens, schema = V3_SCHEMA): string {
  const sections = resolveSchemaSections(input, schema)
    .map((section) => section.emitter
      ? formatSchemaSectionV3(section, input, schema)
      : `${section.heading}\n\nTarget-grounded content.`)
    .join('\n\n');
  return `# Example — Style Reference\n\n${sections}\n`;
}

function legacyFNV1a32(value: string): string {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return `fnv1a32:${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

describe('v3 schema single-authority contract', () => {
  it('keeps formatter, prompt, and validator contracts on the same schema digest', () => {
    expect(() => assertSchemaConsumerContracts(V3_SCHEMA, [
      getFormatterSchemaContract(),
      getPromptSchemaContract(),
      getValidatorSchemaContract(),
    ])).not.toThrow();

    const drifted = { ...getValidatorSchemaContract(), schemaDigest: 'drifted' };
    expect(() => assertSchemaConsumerContracts(V3_SCHEMA, [drifted]))
      .toThrow('validator.schemaDigest');
  });

  it('rejects Quick Start groups that reference an unknown capability', () => {
    expect(() => createV3Schema({
      quickStartGroups: [
        ...V3_SCHEMA.quickStartGroups,
        {
          id: 'unknown', label: 'Unknown', capability: 'not-declared',
          emitKind: 'colors', targets: ['css'],
        },
      ],
    })).toThrow('quickStartGroups.unknown.capability');
  });

  it('moves formatter, prompt, and validation together when a Quick Start group is removed', () => {
    const input = tokens();
    const counterfactual = createV3Schema({
      quickStartGroups: V3_SCHEMA.quickStartGroups.filter((group) => group.id !== 'layout'),
    });

    expect(emitQuickStart(input)).toContain('--page-max-width: 100%;');
    expect(emitQuickStart(input, counterfactual)).not.toContain('--page-max-width');
    expect(buildWritePrompt(input)).toContain('--page-max-width: 100%;');
    expect(buildWritePrompt(input, counterfactual)).not.toContain('--page-max-width');

    const validation = validateDesignMd(v3Document(input), input, { schema: counterfactual });
    expect(validation.failures.some((failure) => (
      failure.type === 'quickstart-unexpected-group' && failure.value === 'css:Layout'
    ))).toBe(true);
  });

  it('moves formatter, prompt, and validation together when a required section is added', () => {
    const input = tokens();
    const counterfactualSection: SchemaSection = {
      id: 'counterfactual',
      heading: '## Counterfactual Contract',
      requiredness: 'required',
      emitter: 'surfaces',
      promptInstruction: 'Explain the counterfactual contract.',
    };
    const counterfactual = createV3Schema({
      sections: [
        ...V3_SCHEMA.sections.slice(0, -1),
        counterfactualSection,
        V3_SCHEMA.sections[V3_SCHEMA.sections.length - 1],
      ],
    });

    expect(formatSchemaValueSectionsV3(input)).not.toContain(counterfactualSection.heading);
    expect(formatSchemaValueSectionsV3(input, counterfactual))
      .toContain(counterfactualSection.heading);
    expect(buildWritePrompt(input)).not.toContain(counterfactualSection.heading);
    expect(buildWritePrompt(input, counterfactual)).toContain(counterfactualSection.heading);

    const document = v3Document(input);
    const completeness = checkSectionCompleteness(document, input, counterfactual);
    expect(completeness.failures.map((failure) => failure.value))
      .toContain(counterfactualSection.heading);
    const validation = validateDesignMd(document, input, { schema: counterfactual });
    expect(validation.failures.some((failure) => (
      failure.type === 'missing-section' && failure.value === counterfactualSection.heading
    ))).toBe(true);
  });

  it('activates deterministic Motion output only from measured detector evidence', () => {
    const withoutMotion = tokens({
      components: [{ type: 'Banner', variants: [{ name: 'Motion 300ms', count: 1, style: {} }] }],
      motionSystem: null,
    });
    const withMotion = tokens({
      motionSystem: {
        durationScale: [{ label: 'small', value: '150ms', frequency: 2 }],
        primaryTimingFunction: 'ease-out',
        timingFunctions: [{ value: 'ease-out', frequency: 2 }],
        keyframeAnimations: [],
        prefersReducedMotion: false,
      },
    });

    expect(resolveSchemaSections(withoutMotion).some((section) => section.id === 'motion')).toBe(false);
    expect(formatSchemaValueSectionsV3(withoutMotion)).not.toContain('## Motion');
    expect(buildWritePrompt(withoutMotion)).not.toContain('## Motion');

    expect(resolveSchemaSections(withMotion).some((section) => section.id === 'motion')).toBe(true);
    expect(formatSchemaValueSectionsV3(withMotion)).toContain('| small | `150ms` |');
    expect(buildWritePrompt(withMotion)).toContain('## Motion');
    expect(validateDesignMd(v3Document(withMotion), withMotion).failures).toHaveLength(0);
  });

  it('keeps hard issue classification immutable under a supplied schema override', () => {
    const input = tokens();
    const adversarial = {
      ...V3_SCHEMA,
      validation: {
        ...V3_SCHEMA.validation,
        issuePolicies: {
          ...V3_SCHEMA.validation.issuePolicies,
          'missing-section': { severity: 'advisory', category: 'shape', tier: 'notice' },
        },
      },
    } as typeof V3_SCHEMA;
    const document = v3Document(input).replace('## Quick Start', '## Quick Start Removed');
    const result = validateDesignMd(document, input, { schema: adversarial });
    const issue = result.failures.find((failure) => failure.type === 'missing-section');

    expect(issue).toMatchObject({ severity: 'hard', category: 'schema' });
    expect(result.warnings.some((warning) => warning.type === 'missing-section')).toBe(false);
    expect(isValidationPass(result)).toBe(false);
  });

  it('keeps corpus policies advisory under merged and supplied overrides', () => {
    const issuePolicies = {
      ...V3_SCHEMA.validation.issuePolicies,
      'corpus-rarity': { severity: 'hard', category: 'target' },
    };
    const merged = createV3Schema({
      validation: {
        ...V3_SCHEMA.validation,
        issuePolicies,
      },
    } as unknown as Parameters<typeof createV3Schema>[0]);
    const supplied = {
      ...V3_SCHEMA,
      validation: { ...V3_SCHEMA.validation, issuePolicies },
    } as unknown as typeof V3_SCHEMA;

    expect(merged.validation.issuePolicies['corpus-rarity']).toEqual({
      severity: 'advisory',
      category: 'rarity',
      tier: 'elevated',
    });
    expect(resolveValidationPolicy('corpus-rarity', supplied)).toEqual({
      severity: 'advisory',
      category: 'rarity',
      tier: 'elevated',
    });
  });

  it('separates schemas that collide under the former 32-bit digest', () => {
    const left = createV3Schema({
      document: { ...V3_SCHEMA.document, titleSuffix: '1cmyvqw-5vj' },
    });
    const right = createV3Schema({
      document: { ...V3_SCHEMA.document, titleSuffix: '1w8mrx-dce' },
    });

    expect(JSON.stringify(left)).not.toBe(JSON.stringify(right));
    expect(legacyFNV1a32(JSON.stringify(left))).toBe(legacyFNV1a32(JSON.stringify(right)));
    expect(schemaDigest(left)).toMatch(/^sha256:[a-f0-9]{64}$/);
    expect(schemaDigest(left)).not.toBe(schemaDigest(right));
  });

  it('keeps corpus divergence advisory while target/schema/provenance remain hard', () => {
    const input = tokens();
    const document = v3Document(input);
    const advisoryOnly = validateDesignMd(document, input);
    expect(advisoryOnly.warnings.map((warning) => warning.category))
      .toEqual(expect.arrayContaining(['shape']));
    expect(advisoryOnly.failures).toHaveLength(0);
    expect(isValidationPass(advisoryOnly)).toBe(true);

    const targetFailure = validateDesignMd(`${document}\n\n#deadbe\n`, input);
    expect(targetFailure.failures.some((failure) => failure.category === 'target')).toBe(true);

    const schemaFailure = validateDesignMd(
      document.replace('## Quick Start', '## Quick Start Removed'),
      input,
    );
    expect(schemaFailure.failures.some((failure) => failure.category === 'schema')).toBe(true);

    const provenanceFailure = validateDesignMd(
      document,
      tokens({ meta: { sourceUrls: [] } }),
    );
    expect(provenanceFailure.failures.some((failure) => failure.category === 'provenance'))
      .toBe(true);
  });
});
