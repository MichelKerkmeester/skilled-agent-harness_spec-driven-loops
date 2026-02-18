// @ts-nocheck
// ---------------------------------------------------------------
// MODULE: Skill Reference Config Tests
// ---------------------------------------------------------------

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const fsMock = vi.hoisted(() => ({
  readFileSync: vi.fn(),
}));

vi.mock('fs', () => ({
  default: {
    readFileSync: fsMock.readFileSync,
  },
  readFileSync: fsMock.readFileSync,
}));

import { clearSkillRefConfigCache, loadSkillRefConfig } from '../lib/config/skill-ref-config';

describe('Skill Reference Config Loader', () => {
  beforeEach(() => {
    clearSkillRefConfigCache();
    fsMock.readFileSync.mockReset();
  });

  afterEach(() => {
    clearSkillRefConfigCache();
  });

  it('loads defaults when skillReferenceIndexing section is missing', () => {
    fsMock.readFileSync.mockReturnValue('{"maxResultPreview":500}');

    const config = loadSkillRefConfig();

    expect(config).toEqual({
      enabled: true,
      indexedSkills: [],
      fileExtensions: ['.md'],
      indexDirs: ['references', 'assets'],
    });
  });

  it('normalizes and filters configured values safely', () => {
    fsMock.readFileSync.mockReturnValue(
      JSON.stringify({
        skillReferenceIndexing: {
          enabled: true,
          indexedSkills: ['workflows-code--web-dev', '../escape', 'workflows-code--opencode', 'bad/name'],
          fileExtensions: ['MD', '.TXT', '', '../md', ' .rst '],
          indexDirs: ['references', 'assets/', './tmp', '../outside', '/abs', 'docs/templates'],
        },
      })
    );

    const config = loadSkillRefConfig();

    expect(config.enabled).toBe(true);
    expect(config.indexedSkills).toEqual(['workflows-code--web-dev', 'workflows-code--opencode']);
    expect(config.fileExtensions).toEqual(['.md', '.txt', '.rst']);
    expect(config.indexDirs).toEqual(['references', 'assets', 'docs/templates']);
  });

  it('disables feature when section is not an object', () => {
    fsMock.readFileSync.mockReturnValue(JSON.stringify({ skillReferenceIndexing: 'invalid' }));

    const config = loadSkillRefConfig();

    expect(config.enabled).toBe(false);
    expect(config.indexedSkills).toEqual([]);
  });

  it('disables feature when top-level field types are invalid', () => {
    fsMock.readFileSync.mockReturnValue(
      JSON.stringify({
        skillReferenceIndexing: {
          enabled: 'yes',
          indexedSkills: ['workflows-code--web-dev'],
        },
      })
    );

    const config = loadSkillRefConfig();

    expect(config.enabled).toBe(false);
    expect(config.indexedSkills).toEqual([]);
  });

  it('falls back to disabled config on parse errors', () => {
    fsMock.readFileSync.mockReturnValue('{ invalid json');

    const config = loadSkillRefConfig();

    expect(config.enabled).toBe(false);
    expect(config.indexedSkills).toEqual([]);
    expect(config.fileExtensions).toEqual(['.md']);
    expect(config.indexDirs).toEqual(['references', 'assets']);
  });

  it('uses alternate config path when first path read fails', () => {
    fsMock.readFileSync
      .mockImplementationOnce(() => {
        throw new Error('ENOENT');
      })
      .mockReturnValueOnce(
        JSON.stringify({
          skillReferenceIndexing: {
            enabled: true,
            indexedSkills: ['workflows-code--opencode'],
            fileExtensions: ['.md'],
            indexDirs: ['references', 'assets'],
          },
        })
      );

    const config = loadSkillRefConfig();

    expect(config.enabled).toBe(true);
    expect(config.indexedSkills).toEqual(['workflows-code--opencode']);
    expect(fsMock.readFileSync).toHaveBeenCalledTimes(2);
  });

  it('disables feature when all config path reads fail', () => {
    fsMock.readFileSync.mockImplementation(() => {
      throw new Error('ENOENT');
    });

    const config = loadSkillRefConfig();

    expect(config.enabled).toBe(false);
    expect(config.indexedSkills).toEqual([]);
    expect(config.fileExtensions).toEqual(['.md']);
    expect(config.indexDirs).toEqual(['references', 'assets']);
    expect(fsMock.readFileSync.mock.calls.length).toBeGreaterThanOrEqual(2);
  });

  it('uses cached config until cache is cleared', () => {
    fsMock.readFileSync.mockReturnValue(JSON.stringify({ skillReferenceIndexing: { enabled: false } }));
    const first = loadSkillRefConfig();

    fsMock.readFileSync.mockReturnValue(
      JSON.stringify({
        skillReferenceIndexing: {
          enabled: true,
          indexedSkills: ['workflows-code--web-dev'],
        },
      })
    );
    const second = loadSkillRefConfig();

    expect(first.enabled).toBe(false);
    expect(second.enabled).toBe(false);
    expect(fsMock.readFileSync).toHaveBeenCalledTimes(1);

    clearSkillRefConfigCache();
    const third = loadSkillRefConfig();
    expect(third.enabled).toBe(true);
    expect(third.indexedSkills).toEqual(['workflows-code--web-dev']);
    expect(fsMock.readFileSync).toHaveBeenCalledTimes(2);
  });
});
