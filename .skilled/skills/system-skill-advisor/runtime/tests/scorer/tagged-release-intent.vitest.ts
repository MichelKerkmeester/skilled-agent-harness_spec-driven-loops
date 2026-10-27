// ───────────────────────────────────────────────────────────────
// MODULE: Tagged Release Intent Tests
// ───────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';
import { scoreExplicitLane } from '../../lib/scorer/lanes/explicit.js';
import { createFixtureProjection } from '../../lib/scorer/projection.js';
import type { SkillProjection } from '../../lib/scorer/types.js';

// A bare sk-git entry, so any evidence comes from the lane's own anchors.
const BARE_SK_GIT: SkillProjection = {
  id: 'sk-git',
  kind: 'skill',
  family: 'sk-util',
  category: 'utility',
  name: 'sk-git',
  description: '',
  keywords: [],
  domains: [],
  intentSignals: [],
  derivedTriggers: [],
  derivedKeywords: [],
  sourcePath: null,
  lifecycleStatus: 'active',
};

const projection = createFixtureProjection([BARE_SK_GIT]);

function hasTaggedRelease(prompt: string): boolean {
  const evidence = scoreExplicitLane(prompt.toLowerCase(), projection)
    .find((match) => match.skillId === 'sk-git')?.evidence ?? [];
  return evidence.includes('tagged-release-intent');
}

// A release is git work only when the prompt also names a tag, so the bare word
// `release` never anchors sk-git on its own.
describe('tagged release intent', () => {
  it.each([
    'Cut a release: tag the version, push the tag and follow the release workflow',
    'Tag the release and push the tag',
    'Bump the version, tag it and publish the release',
    'Ship a new release and tag it v2.3.0',
  ])('anchors sk-git when a release action meets a tag: %s', (prompt) => {
    expect(hasTaggedRelease(prompt)).toBe(true);
  });

  it.each([
    'update skilled to the latest release',
    'Cut a new release of the package',
    'Plan the release party and tag the version of the slide deck we present',
    'Rename the image tag in the docker compose file and push the tag to the registry',
    'Update the release tag of the docker image in the helm chart values file',
    'Ship the release of the newsletter and tag the subscribers by segment',
    'Publish the release blog post with tags for SEO',
    'Publish the release notes for v2 and tag the maintainers in the announcement',
  ])('leaves sk-git unanchored without both a release action and a tag: %s', (prompt) => {
    expect(hasTaggedRelease(prompt)).toBe(false);
  });
});
