import { spawn } from "node:child_process";
import { mkdirSync, symlinkSync } from "node:fs";
import { dirname } from "node:path";

export class OpaqueImageBuilder {}

OpaqueImageBuilder.build = async function build(options) {
  if (!options.snapshotTag.includes("-supercov-"))
    throw new Error("Supercov did not scope the opaque ESM snapshot identity");
  const mount = options.mounts[0];
  mkdirSync(dirname(mount.target), { recursive: true });
  symlinkSync(mount.source, mount.target, "dir");
  return {
    createPool() {
      return {
        async acquire() {
          return {
            execute(argv, options) {
              if (options.environment.SUPERCOV_PROJECT_ROOT !== mount.target)
                throw new Error("Pure ESM positional launch did not receive the translated root");
              if (!options.environment.NODE_OPTIONS?.includes(`${mount.target}/.supercov/node_modules/register.mjs`))
                throw new Error("Pure ESM positional launch did not receive the preload");
              return new Promise((resolve, reject) => {
                const child = spawn(argv[0], argv.slice(1), {
                  cwd: mount.target,
                  env: options.environment,
                  stdio: "inherit",
                });
                child.once("error", reject);
                child.once("close", (exitCode, signal) => resolve({ exitCode, signal }));
              });
            },
          };
        },
      };
    },
  };
};
