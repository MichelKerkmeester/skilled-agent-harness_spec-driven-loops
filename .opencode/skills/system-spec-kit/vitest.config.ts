export default {
  test: {
    include: [
      'tests/**/*.vitest.ts',
      'scripts/tests/**/*.vitest.ts',
      'mcp_server/tests/**/*.vitest.ts',
    ],
    globals: true,
  },
};
