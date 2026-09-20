// Harness-only shim. The Pi extensions are authored against their INSTALLED location
// (.pi/extensions/, where "../../.opencode/..." resolves to the repo root); the checked-in
// copies live two levels deeper, so that specifier only resolves through this alias.
const REPO = "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public";

export default {
  resolve: {
    alias: [
      {
        find: "../../.opencode/hooks/shared/hook-flags.mjs",
        replacement: `${REPO}/.opencode/hooks/shared/hook-flags.mjs`,
      },
    ],
  },
  test: {
    root: `${REPO}/.opencode/hooks/dispatch/pi`,
    include: ["dispatch-preflight-lint.test.ts"],
    globals: true,
    environment: "node",
  },
};
