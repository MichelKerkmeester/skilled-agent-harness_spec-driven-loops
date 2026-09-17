// TEST: SKILL ADVISOR CLI MANIFEST PARITY
// The CLI manifest is hand-maintained, not generated. This suite holds it
// byte-identical to the server TOOL_DEFINITIONS so the documented parity
// contract ("same 9 tools over the same schemas") is enforced rather than
// assumed — any drift between the two registries fails here.
import { describe, expect, it } from 'vitest';

import { TOOL_DEFINITIONS } from '../tools/index.js';
import { SKILL_ADVISOR_CLI_TOOL_MANIFEST } from '../skill-advisor-cli-manifest.js';

describe('skill-advisor CLI manifest parity with server TOOL_DEFINITIONS', () => {
  it('exposes exactly the server tool set, no more and no fewer', () => {
    const serverNames = TOOL_DEFINITIONS.map((tool) => tool.name).sort();
    const manifestNames = SKILL_ADVISOR_CLI_TOOL_MANIFEST.map((tool) => tool.name).sort();
    expect(manifestNames).toEqual(serverNames);
  });

  it('keeps every manifest schema byte-identical to its server definition', () => {
    const serverByName = new Map(TOOL_DEFINITIONS.map((tool) => [tool.name, tool]));
    for (const manifestTool of SKILL_ADVISOR_CLI_TOOL_MANIFEST) {
      const serverTool = serverByName.get(manifestTool.name);
      expect(serverTool, `server definition missing for ${manifestTool.name}`).toBeDefined();
      expect(
        { description: manifestTool.description, inputSchema: manifestTool.inputSchema },
        `manifest drift for ${manifestTool.name}`,
      ).toEqual({ description: serverTool!.description, inputSchema: serverTool!.inputSchema });
    }
  });

  it('derives command forms from the tool name', () => {
    for (const manifestTool of SKILL_ADVISOR_CLI_TOOL_MANIFEST) {
      expect(manifestTool.kebabCommand).toBe(manifestTool.name.replace(/_/g, '-'));
      expect(manifestTool.camelCommand).toBe(
        manifestTool.name.replace(/_([a-z0-9])/g, (_match, char: string) => char.toUpperCase()),
      );
    }
  });
});
