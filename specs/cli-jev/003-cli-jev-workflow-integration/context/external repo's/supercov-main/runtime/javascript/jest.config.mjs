// Supercov's Jest configuration, handed to Jest through `--config` by the
// preload (register.mjs) in place of the user's. It reads the user's own
// configuration the way Jest reads it -- a jest.config.* file in any format
// Jest accepts, or the "jest" key of package.json -- and adds the adapter
// (jest.cjs) and the reporter (jestReporter.mjs). Nothing of the user's is
// replaced: their setup files and reporters keep running.
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = (name) => fileURLToPath(new URL(`./${name}`, import.meta.url));
const asList = (value) => (value === undefined ? [] : Array.isArray(value) ? value : [value]);

export default async function supercovJestConfig() {
    let config = { rootDir: process.cwd() };
    try {
        // The project's own jest-config, so version and resolution match Jest's.
        const projectRequire = createRequire(resolve(process.cwd(), "package.json"));
        const { readInitialOptions } = projectRequire("jest-config");
        const original = process.env["SUPERCOV_ORIGINAL_JEST_CONFIG"] || undefined;
        const read = await readInitialOptions(original, { skipMultipleConfigError: true });
        config = read.config ?? config;
        config.rootDir ??= read.configPath ? dirname(read.configPath) : process.cwd();
    } catch (error) {
        // jest-config before 29.3 has no readInitialOptions; the project's
        // configuration is not read and Jest's defaults apply.
        process.emitWarning(`[supercov] the project's Jest configuration was not read (${error?.message ?? error}); Jest's defaults apply`);
    }
    return {
        ...config,
        // Concurrent tests in one file would share the worker's scope.
        maxConcurrency: 1,
        setupFiles: [here("jestRuntime.cjs"), ...asList(config.setupFiles)],
        // Babel-based presets (including React Native) lower the runtime
        // side-effect import in instrumented tests to require(). Jest cannot
        // require our ESM shim. Its environment already owns the runtime, so
        // resolve only our generated import to a CommonJS bridge instead.
        moduleNameMapper: {
            "(?:^|/)\\.supercov/node_modules/runtime\\.mjs$": here("jestRuntime.cjs"),
            ...config.moduleNameMapper,
        },
        setupFilesAfterEnv: [here("jest.cjs"), ...asList(config.setupFilesAfterEnv)],
        reporters: [
            ...(config.reporters === undefined ? ["default"] : asList(config.reporters)),
            here("jestReporter.mjs"),
        ],
    };
}
