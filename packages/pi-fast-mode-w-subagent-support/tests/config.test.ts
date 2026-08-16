import {
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  writeFile,
} from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it } from "vitest";
import {
  DEFAULT_CONFIG,
  cloneConfig,
  getLegacyUserConfigPath,
  getProjectConfigPath,
  getUserConfigPath,
  isProjectLocalExtension,
  loadConfigFromPath,
  loadConfigForScope,
  normalizeConfig,
  normalizeTargets,
  parseConfigJson,
  saveConfigToPath,
  selectConfigPath,
  syncSupportedTargets,
} from "../src/config";
import { LEGACY_PACKAGE_NAME, PACKAGE_NAME } from "../src/types";

const tempDirs: string[] = [];

async function makeTempDir(): Promise<string> {
  const dir = await mkdtemp(
    join(tmpdir(), "pi-fast-mode-w-subagent-support-"),
  );
  tempDirs.push(dir);
  return dir;
}

afterEach(async () => {
  await Promise.all(
    tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })),
  );
});

describe("DEFAULT_CONFIG", () => {
  it("starts disabled with exact OpenAI and OpenAI-Codex GPT-5.4/GPT-5.5/GPT-5.6 targets", () => {
    expect(DEFAULT_CONFIG).toEqual({
      enabled: false,
      targets: [
        { provider: "openai", model: "gpt-5.4", serviceTier: "priority" },
        { provider: "openai", model: "gpt-5.5", serviceTier: "priority" },
        { provider: "openai", model: "gpt-5.6", serviceTier: "priority" },
        { provider: "openai", model: "gpt-5.6-sol", serviceTier: "priority" },
        { provider: "openai", model: "gpt-5.6-terra", serviceTier: "priority" },
        { provider: "openai", model: "gpt-5.6-luna", serviceTier: "priority" },
        { provider: "openai-codex", model: "gpt-5.4", serviceTier: "priority" },
        { provider: "openai-codex", model: "gpt-5.5", serviceTier: "priority" },
        { provider: "openai-codex", model: "gpt-5.6", serviceTier: "priority" },
        {
          provider: "openai-codex",
          model: "gpt-5.6-sol",
          serviceTier: "priority",
        },
        {
          provider: "openai-codex",
          model: "gpt-5.6-terra",
          serviceTier: "priority",
        },
        {
          provider: "openai-codex",
          model: "gpt-5.6-luna",
          serviceTier: "priority",
        },
      ],
    });
  });

  it("cloneConfig returns independent copies", () => {
    const copy = cloneConfig();
    copy.enabled = true;
    copy.targets[0]!.model = "changed";

    expect(DEFAULT_CONFIG.enabled).toBe(false);
    expect(DEFAULT_CONFIG.targets[0]!.model).toBe("gpt-5.4");
  });
});

describe("syncSupportedTargets", () => {
  it("uses the current package targets while preserving enabled", () => {
    expect(
      syncSupportedTargets({
        enabled: true,
        targets: [
          { provider: "openai", model: "old-model", serviceTier: "flex" },
        ],
      }),
    ).toEqual({ enabled: true, targets: DEFAULT_CONFIG.targets });
  });
});

describe("normalizeTargets", () => {
  it("ignores invalid targets, unsupported providers, and duplicate provider/model pairs", () => {
    expect(
      normalizeTargets([
        { provider: "openai", model: "gpt-5.4" },
        { provider: "openai", model: "gpt-5.4", serviceTier: "flex" },
        {
          provider: "openai-codex",
          model: " gpt-5.5 ",
          serviceTier: " priority ",
        },
        { provider: "anthropic", model: "claude" },
        { provider: 1, model: "gpt-5.4" },
        { provider: "openai", model: "" },
        null,
      ]),
    ).toEqual([
      { provider: "openai", model: "gpt-5.4", serviceTier: "priority" },
      { provider: "openai-codex", model: "gpt-5.5", serviceTier: "priority" },
    ]);
  });

  it("returns undefined for non-array target values", () => {
    expect(normalizeTargets(undefined)).toBeUndefined();
    expect(normalizeTargets({})).toBeUndefined();
  });
});

describe("normalizeConfig", () => {
  it("falls back to defaults for invalid top-level config", () => {
    expect(normalizeConfig(null)).toEqual(DEFAULT_CONFIG);
    expect(normalizeConfig("bad")).toEqual(DEFAULT_CONFIG);
  });

  it("falls back field-by-field while preserving explicit empty targets", () => {
    expect(normalizeConfig({ enabled: true, targets: [] })).toEqual({
      enabled: true,
      targets: [],
    });

    expect(normalizeConfig({ enabled: "yes", targets: "bad" })).toEqual(
      DEFAULT_CONFIG,
    );
  });

  it("uses a provided fallback", () => {
    const fallback = {
      enabled: true,
      targets: [
        { provider: "openai", model: "custom", serviceTier: "priority" },
      ],
    };

    expect(normalizeConfig({}, fallback)).toEqual(fallback);
  });

  it("defaults missing serviceTier to priority", () => {
    expect(
      normalizeConfig({
        enabled: true,
        targets: [{ provider: "openai", model: "gpt-5.4" }],
      }),
    ).toEqual({
      enabled: true,
      targets: [
        { provider: "openai", model: "gpt-5.4", serviceTier: "priority" },
      ],
    });
  });
});

describe("config JSON IO", () => {
  it("does not throw on invalid JSON and falls back to defaults", () => {
    expect(parseConfigJson("not-json")).toEqual(DEFAULT_CONFIG);
  });

  it("loadConfigFromPath falls back when a file is missing or invalid", async () => {
    const dir = await makeTempDir();
    const configPath = join(dir, "config.json");

    expect(await loadConfigFromPath(configPath)).toEqual(DEFAULT_CONFIG);

    await writeFile(configPath, "{", "utf8");
    expect(await loadConfigFromPath(configPath)).toEqual(DEFAULT_CONFIG);
  });

  it("saveConfigToPath writes normalized config", async () => {
    const dir = await makeTempDir();
    const configPath = join(dir, "nested", "config.json");

    await saveConfigToPath(configPath, {
      enabled: true,
      targets: [
        { provider: "openai", model: "gpt-5.4" },
        { provider: "unsupported", model: "x" },
      ],
    });

    expect(JSON.parse(await readFile(configPath, "utf8"))).toEqual({
      enabled: true,
      targets: [
        { provider: "openai", model: "gpt-5.4", serviceTier: "priority" },
      ],
    });
    expect(await readdir(join(dir, "nested"))).toEqual(["config.json"]);
  });

  it("migrates a legacy user config once and leaves the legacy file untouched", async () => {
    const dir = await makeTempDir();
    const cwd = join(dir, "project");
    const agentDir = join(dir, "agent");
    const legacyPath = getLegacyUserConfigPath(agentDir);
    const legacyJson = JSON.stringify({
      enabled: true,
      targets: [
        { provider: "openai-codex", model: "gpt-5.5", serviceTier: "flex" },
      ],
    });
    await mkdir(join(agentDir, "extensions", LEGACY_PACKAGE_NAME), {
      recursive: true,
    });
    await writeFile(legacyPath, legacyJson, "utf8");

    const loaded = await loadConfigForScope({
      cwd,
      agentDir,
      extensionDir: join(dir, "global", PACKAGE_NAME, "src"),
    });

    expect(loaded.path).toBe(getUserConfigPath(agentDir));
    expect(loaded.config).toEqual({
      enabled: true,
      targets: [
        { provider: "openai-codex", model: "gpt-5.5", serviceTier: "flex" },
      ],
    });
    expect(JSON.parse(await readFile(loaded.path, "utf8"))).toEqual(
      loaded.config,
    );
    expect(await readFile(legacyPath, "utf8")).toBe(legacyJson);
  });

  it("preserves an explicit empty target opt-out through load and save", async () => {
    const dir = await makeTempDir();
    const cwd = join(dir, "project");
    const agentDir = join(dir, "agent");
    const configPath = getUserConfigPath(agentDir);
    const optOut = { enabled: true, targets: [] };

    await saveConfigToPath(configPath, optOut);
    const loaded = await loadConfigForScope({
      cwd,
      agentDir,
      extensionDir: join(dir, "global", PACKAGE_NAME, "src"),
    });
    await saveConfigToPath(loaded.path, loaded.config);

    expect(JSON.parse(await readFile(configPath, "utf8"))).toEqual(optOut);
  });

  it("falls back to a safe default for malformed config JSON", async () => {
    const dir = await makeTempDir();
    const configPath = join(dir, "config.json");
    await writeFile(configPath, "{", "utf8");

    expect(await loadConfigFromPath(configPath)).toEqual(DEFAULT_CONFIG);
  });
});

describe("persistence scope selection", () => {
  it("uses user-level state for a user/global extension when no project config exists", () => {
    const cwd = "/repo";
    const agentDir = "/home/user/.pi/agent";

    expect(
      selectConfigPath({
        cwd,
        agentDir,
        extensionDir: `/home/user/.pi/agent/npm/${PACKAGE_NAME}/src`,
        exists: () => false,
      }),
    ).toEqual({ scope: "user", path: getUserConfigPath(agentDir) });
  });

  it("uses an existing project config even for a global extension", () => {
    const cwd = "/repo";
    const projectPath = getProjectConfigPath(cwd);

    expect(
      selectConfigPath({
        cwd,
        agentDir: "/home/user/.pi/agent",
        extensionDir: `/home/user/.pi/agent/npm/${PACKAGE_NAME}/src`,
        exists: (path) => path === projectPath,
      }),
    ).toEqual({ scope: "project", path: projectPath });
  });

  it("uses project-level state for project-local packages under cwd/.pi", () => {
    const cwd = "/repo";
    const projectPath = getProjectConfigPath(cwd);

    expect(
      selectConfigPath({
        cwd,
        agentDir: "/home/user/.pi/agent",
        extensionDir: `/repo/.pi/npm/${PACKAGE_NAME}/src`,
        exists: () => false,
      }),
    ).toEqual({ scope: "project", path: projectPath });
  });

  it("detects project-local extension directories deterministically", () => {
    expect(
      isProjectLocalExtension(
        `/repo/.pi/extensions/${PACKAGE_NAME}`,
        "/repo",
      ),
    ).toBe(true);
    expect(isProjectLocalExtension("/repo/.pi", "/repo")).toBe(true);
    expect(
      isProjectLocalExtension(`/repo/.pi-other/${PACKAGE_NAME}`, "/repo"),
    ).toBe(false);
    expect(isProjectLocalExtension(undefined, "/repo")).toBe(false);
  });
});
