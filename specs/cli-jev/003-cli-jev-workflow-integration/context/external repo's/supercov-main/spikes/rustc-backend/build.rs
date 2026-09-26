use std::{env, fs, path::PathBuf, process::Command};

use sha2::{Digest, Sha256};

fn field<'a>(verbose: &'a str, name: &str) -> &'a str {
    verbose
        .lines()
        .find_map(|line| line.strip_prefix(name))
        .map(str::trim)
        .unwrap_or_else(|| panic!("rustc -vV omitted {name}"))
}

fn main() {
    let rustc = env::var_os("RUSTC").unwrap_or_else(|| "rustc".into());
    let verbose = Command::new(&rustc)
        .arg("-vV")
        .output()
        .expect("could not inspect build rustc");
    assert!(verbose.status.success(), "build rustc -vV failed");
    let verbose = String::from_utf8(verbose.stdout).expect("rustc -vV was not UTF-8");
    let commit = field(&verbose, "commit-hash:");
    let release = field(&verbose, "release:");
    let host = field(&verbose, "host:");
    let sysroot = Command::new(&rustc)
        .args(["--print", "sysroot"])
        .output()
        .expect("could not inspect build rustc sysroot");
    assert!(
        sysroot.status.success(),
        "build rustc --print sysroot failed"
    );
    let sysroot = PathBuf::from(
        String::from_utf8(sysroot.stdout)
            .expect("rustc sysroot was not UTF-8")
            .trim(),
    );
    let directory = sysroot.join("lib/rustlib").join(host).join("lib");
    let mut drivers = fs::read_dir(&directory)
        .expect("could not inspect rustc driver directory")
        .map(|entry| entry.expect("could not inspect rustc driver entry").path())
        .filter(|path| {
            path.file_name()
                .and_then(|name| name.to_str())
                .is_some_and(|name| {
                    name.starts_with("librustc_driver-")
                        && matches!(
                            path.extension().and_then(|value| value.to_str()),
                            Some("so" | "dylib")
                        )
                })
        })
        .collect::<Vec<_>>();
    drivers.sort();
    drivers.dedup();
    let [driver] = drivers.as_slice() else {
        panic!(
            "expected one rustc driver in {}, found {}",
            directory.display(),
            drivers.len()
        );
    };
    let metadata = fs::symlink_metadata(driver).expect("could not inspect rustc driver");
    assert!(
        metadata.file_type().is_file(),
        "rustc driver was not a regular file"
    );
    let driver_digest = format!(
        "{:x}",
        Sha256::digest(fs::read(driver).expect("could not read rustc driver"))
    );
    println!("cargo:rustc-env=SUPERCOV_COMPANION_RUSTC_COMMIT={commit}");
    println!("cargo:rustc-env=SUPERCOV_COMPANION_RUSTC_RELEASE={release}");
    println!("cargo:rustc-env=SUPERCOV_COMPANION_HOST={host}");
    println!("cargo:rustc-env=SUPERCOV_COMPANION_DRIVER_SHA256={driver_digest}");
    println!("cargo:rerun-if-env-changed=RUSTC");
}
