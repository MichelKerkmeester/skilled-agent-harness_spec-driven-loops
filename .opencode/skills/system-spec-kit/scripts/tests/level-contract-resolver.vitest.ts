// -------------------------------------------------------------------
// TEST: Level Contract Resolver
// -------------------------------------------------------------------

import { describe, expect, it } from 'vitest';
import { resolveLevelContract, serializeLevelContract } from '../../runtime/lib/templates/level-contract-resolver';

describe('resolveLevelContract', () => {
  it('returns the Level 1 core document contract', () => {
    const contract = resolveLevelContract('1');
    expect(contract.requiredCoreDocs).toEqual(['spec.md', 'plan.md', 'tasks.md']);
    expect(contract.lifecycleRequiredDocs).toEqual({
      afterImplementationStarts: ['implementation-summary.md'],
    });
    expect(contract.requiredAddonDocs).toEqual([]);
    expect(contract.optionalAddonDocs).toEqual([]);
    expect(contract.lazyAddonDocs).toEqual([
      'handover.md',
      'debug-delegation.md',
      'research/research.md',
      'before-after.md',
      'timeline.md',
      'roadmap.md',
      'decision-record.md',
      'goal.md',
    ]);
    expect(contract.frontmatterMarkerLevel).toBe(1);
  });

  it('keeps decision records lazy and carries acceptance criteria as a level add-on', () => {
    expect(resolveLevelContract('2').requiredAddonDocs).toEqual([]);
    expect(resolveLevelContract('2').optionalAddonDocs).toEqual(['acceptance-criteria.md']);
    expect(resolveLevelContract('3').requiredAddonDocs).toEqual([]);
    expect(resolveLevelContract('3').optionalAddonDocs).toEqual(['acceptance-criteria.md']);
    expect(resolveLevelContract('3+').requiredAddonDocs).toEqual([]);
    expect(resolveLevelContract('3+').optionalAddonDocs).toEqual(['acceptance-criteria.md']);
    for (const level of ['1', '2', '3', '3+'] as const) {
      expect(resolveLevelContract(level).lifecycleRequiredDocs).toEqual({
        afterImplementationStarts: ['implementation-summary.md'],
      });
      expect(resolveLevelContract(level).lazyAddonDocs).toEqual([
        'handover.md',
        'debug-delegation.md',
        'research/research.md',
        'before-after.md',
        'timeline.md',
        'roadmap.md',
        'decision-record.md',
        'goal.md',
      ]);
    }
  });

  it('keeps phase-parent contract lean', () => {
    const contract = resolveLevelContract('phase');
    expect(contract.requiredCoreDocs).toEqual(['spec.md']);
    expect(contract.lifecycleRequiredDocs).toEqual({ afterImplementationStarts: [] });
    expect(contract.requiredAddonDocs).toEqual([]);
    expect(contract.optionalAddonDocs).toEqual([]);
    expect(contract.lazyAddonDocs).toEqual([
      'handover.md',
      'before-after.md',
      'timeline.md',
      'roadmap.md',
      'decision-record.md',
      'goal.md',
    ]);
    expect(contract.sectionGates.get('phase-list')).toEqual(['phase']);
  });

  it('keeps review lazy add-ons opt-in', () => {
    expect(resolveLevelContract('review').lazyAddonDocs).toEqual([
      'handover.md',
      'before-after.md',
      'timeline.md',
      'roadmap.md',
      'decision-record.md',
    ]);
    expect(resolveLevelContract('review').lifecycleRequiredDocs).toEqual({ afterImplementationStarts: [] });
  });

  it('serializes section gate Map without leaking internal taxonomy fields', () => {
    const serialized = serializeLevelContract(resolveLevelContract('3'));
    expect(serialized.sectionGates['risk-matrix']).toEqual(['3', '3+']);
    expect(serialized.sectionGatesByDocument['spec.md']['risk-matrix']).toEqual(['3', '3+']);
    expect(serialized.optionalAddonDocs).toEqual(['acceptance-criteria.md']);
    expect(serialized.lifecycleRequiredDocs).toEqual({
      afterImplementationStarts: ['implementation-summary.md'],
    });
    expect(serialized.templateVersions['spec.md.tmpl']).toBe('v2.2');
    expect(serialized.templateVersions['before-after.md.tmpl']).toBe('v2.2');
    expect(Object.keys(serialized)).toEqual([
      'requiredCoreDocs',
      'requiredAddonDocs',
      'optionalAddonDocs',
      'lazyAddonDocs',
      'lifecycleRequiredDocs',
      'sectionGates',
      'sectionGatesByDocument',
      'templateVersions',
      'frontmatterMarkerLevel',
    ]);
  });

  it('returns defensive copies across calls', () => {
    const first = resolveLevelContract('1');
    first.requiredCoreDocs.push('mutated.md');
    first.sectionGates.get('metadata')?.push('phase');

    const second = resolveLevelContract('1');
    expect(second.requiredCoreDocs).toEqual(['spec.md', 'plan.md', 'tasks.md']);
    expect(second.lifecycleRequiredDocs).toEqual({
      afterImplementationStarts: ['implementation-summary.md'],
    });
    expect(second.sectionGates.get('metadata')).toEqual(['1', '2', '3', '3+']);
  });

  it('normalizes invalid level errors to level-only vocabulary', () => {
    expect(() => resolveLevelContract('bogus' as never)).toThrow(
      'Internal template contract could not be resolved for Level bogus',
    );
  });
});
