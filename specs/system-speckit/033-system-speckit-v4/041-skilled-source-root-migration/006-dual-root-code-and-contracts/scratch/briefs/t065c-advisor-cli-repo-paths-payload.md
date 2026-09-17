## Edit 1

File: `.opencode/skills/system-skill-advisor/runtime/skill-advisor-cli.ts`

OLD:

~~~~text
}

function findRepoPaths(startFile = currentModulePath()): RepoPaths {
~~~~

NEW:

~~~~text
}

// The source tree sits under .skilled or .opencode, and a checkout may link one name
// to the other, so the launcher assets count under either name.
const SOURCE_ROOT_NAMES: readonly string[] = ['.skilled', '.opencode'];

function findRepoPaths(startFile = currentModulePath()): RepoPaths {
~~~~

## Edit 2

File: `.opencode/skills/system-skill-advisor/runtime/skill-advisor-cli.ts`

OLD:

~~~~text
  while (true) {
    const directOpencodeDir = path.basename(current) === '.opencode' ? current : path.join(current, '.opencode');
    const launcherPath = path.join(directOpencodeDir, 'bin', 'system-skill-advisor-launcher.cjs');
    const bridgePath = path.join(directOpencodeDir, 'bin', 'lib', 'launcher-ipc-bridge.cjs');
    if (existsSync(launcherPath) && existsSync(bridgePath)) {
      const repoRoot = path.dirname(directOpencodeDir);
      const mcpServerDir = path.join(directOpencodeDir, 'skills', 'system-skill-advisor', 'runtime');
      const configuredDbDir = process.env.SYSTEM_SKILL_ADVISOR_DB_DIR;
      return {
        opencodeDir: directOpencodeDir,
        repoRoot,
        launcherPath,
        bridgePath,
        dbDir: configuredDbDir ? path.resolve(repoRoot, configuredDbDir) : path.join(mcpServerDir, 'database'),
        packageJsonPath: path.join(mcpServerDir, 'package.json'),
        packageLockPath: path.join(mcpServerDir, 'package-lock.json'),
      };
    }
~~~~

NEW:

~~~~text
  while (true) {
    const sourceRootDirs = SOURCE_ROOT_NAMES.includes(path.basename(current))
      ? [current]
      : SOURCE_ROOT_NAMES.map((name) => path.join(current, name));
    for (const directOpencodeDir of sourceRootDirs) {
      const launcherPath = path.join(directOpencodeDir, 'bin', 'system-skill-advisor-launcher.cjs');
      const bridgePath = path.join(directOpencodeDir, 'bin', 'lib', 'launcher-ipc-bridge.cjs');
      if (existsSync(launcherPath) && existsSync(bridgePath)) {
        const repoRoot = path.dirname(directOpencodeDir);
        const mcpServerDir = path.join(directOpencodeDir, 'skills', 'system-skill-advisor', 'runtime');
        const configuredDbDir = process.env.SYSTEM_SKILL_ADVISOR_DB_DIR;
        return {
          opencodeDir: directOpencodeDir,
          repoRoot,
          launcherPath,
          bridgePath,
          dbDir: configuredDbDir ? path.resolve(repoRoot, configuredDbDir) : path.join(mcpServerDir, 'database'),
          packageJsonPath: path.join(mcpServerDir, 'package.json'),
          packageLockPath: path.join(mcpServerDir, 'package-lock.json'),
        };
      }
    }
~~~~

## Edit 3

File: `.opencode/skills/system-skill-advisor/runtime/skill-advisor-cli.ts`

OLD:

~~~~text
    if (parent === current) {
      throw new CliProtocolError('Unable to locate .opencode/bin launcher assets from CLI path');
    }
~~~~

NEW:

~~~~text
    if (parent === current) {
      throw new CliProtocolError('Unable to locate .skilled/bin or .opencode/bin launcher assets from CLI path');
    }
~~~~
