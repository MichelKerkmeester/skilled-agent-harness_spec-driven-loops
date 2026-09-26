use std::{env, fs, path::PathBuf};

fn main() {
    let output = PathBuf::from(env::var_os("OUT_DIR").expect("OUT_DIR"));
    let generated = output.join("generated.rs");
    println!("cargo:rerun-if-env-changed=SUPERCOV_GENERATED_VARIANT");
    println!("cargo:rerun-if-env-changed=SUPERCOV_GENERATED_SYMLINK_TARGET");
    if let Some(target) = env::var_os("SUPERCOV_GENERATED_SYMLINK_TARGET") {
        #[cfg(unix)]
        std::os::unix::fs::symlink(target, generated).expect("symlink generated source");
        #[cfg(windows)]
        std::os::windows::fs::symlink_file(target, generated).expect("symlink generated source");
        #[cfg(not(any(unix, windows)))]
        panic!("generated symlink fixture is unsupported on this platform");
    } else {
        let variant = env::var("SUPERCOV_GENERATED_VARIANT").unwrap_or_else(|_| "baseline".into());
        fs::write(
            generated,
            format!(
                "pub fn generated_by_build_script(value: bool) -> usize {{ if value {{ 7 }} else {{ 9 }} }}\n// generated variant: {variant}\n"
            ),
        )
        .expect("write generated source");
    }
}
