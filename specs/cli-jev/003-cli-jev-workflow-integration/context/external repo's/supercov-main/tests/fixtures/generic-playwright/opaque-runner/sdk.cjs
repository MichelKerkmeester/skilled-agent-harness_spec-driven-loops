const { spawn } = require("node:child_process");
const { mkdirSync, symlinkSync } = require("node:fs");
const { dirname } = require("node:path");

class OpaqueImageBuilder {}

OpaqueImageBuilder.build = async function build(options) {
  if (!options.snapshotKey.includes("-supercov-")) {
    throw new Error("Supercov did not scope the opaque snapshot identity");
  }
  const mount = options.mounts[0];
  mkdirSync(dirname(mount.target), { recursive: true });
  symlinkSync(mount.source, mount.target, "dir");
  return {
    createPool() {
      return {
        async acquire() {
          return {
            exec(request) {
              if (request.env.SUPERCOV_PROJECT_ROOT !== mount.target) {
                throw new Error(
                  `Expected translated project root ${mount.target}, received ${request.env.SUPERCOV_PROJECT_ROOT}`,
                );
              }
              if (!request.env.NODE_OPTIONS?.includes(`${mount.target}/.supercov/node_modules/register.mjs`)) {
                throw new Error(
                  `Remote launch did not receive the guest Supercov preload: NODE_OPTIONS=${request.env.NODE_OPTIONS}`,
                );
              }
              return new Promise((resolve, reject) => {
                const child = spawn(request.argv[0], request.argv.slice(1), {
                  cwd: mount.target,
                  env: request.env,
                  stdio: "inherit",
                });
                child.once("error", reject);
                child.once("close", (exitCode, signal) =>
                  resolve({ exitCode, signal }),
                );
              });
            },
          };
        },
      };
    },
  };
};

module.exports = { OpaqueImageBuilder };
