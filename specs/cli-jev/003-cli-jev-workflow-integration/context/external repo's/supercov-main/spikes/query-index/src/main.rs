use std::{
    fs::{self, File},
    io::Read,
    path::{Path, PathBuf},
    time::{Duration, Instant},
};

use flate2::{Compression, read::GzDecoder, write::GzEncoder};
use memmap2::Mmap;
use rkyv::{Archive, Deserialize as RkyvDeserialize, Serialize as RkyvSerialize};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};

#[allow(warnings)]
mod generated {
    include!(concat!(env!("OUT_DIR"), "/flatbuffers/mod.rs"));
}

use generated::supercov::index::{
    Line as FlatLine, LineArgs, QueryIndex as FlatQueryIndex, QueryIndexArgs, root_as_query_index,
};

const LINES: usize = 100_000;
const ITERATIONS: usize = 200;
const FIXED_MAGIC: &[u8; 8] = b"SCQIDX01";
const FIXED_HEADER: usize = 64;
const FIXED_RECORD: usize = 20;
const CHECKSUM_PAGE: usize = 64 * 1024;
const RKYV_HEADER: usize = 64;
const RKYV_MAGIC: &[u8; 8] = b"SCQRKY01";
const FLATBUFFERS_HEADER: usize = 64;
const FLATBUFFERS_MAGIC: &[u8; 8] = b"SCQFLT01";

#[derive(Debug, Archive, RkyvSerialize, RkyvDeserialize, Serialize, Deserialize)]
struct Line {
    file: u32,
    line: u32,
    covered: bool,
    tests: Vec<u32>,
}

#[derive(Debug, Archive, RkyvSerialize, RkyvDeserialize, Serialize, Deserialize)]
struct QueryIndex {
    version: u32,
    strings: Vec<String>,
    lines: Vec<Line>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct Measurement {
    format: &'static str,
    bytes: u64,
    median_ms: f64,
    p95_ms: f64,
    integrity: &'static str,
}

fn corpus() -> QueryIndex {
    let strings = (0..1_000)
        .map(|file| format!("packages/package-{}/src/file-{}.ts", file / 20, file))
        .collect();
    let lines = (0..LINES)
        .map(|index| Line {
            file: (index % 1_000) as u32,
            line: (index / 1_000 + 1) as u32,
            covered: index % 7 != 0,
            tests: (0..=(index % 4))
                .map(|offset| ((index * 17 + offset) % 20_000) as u32)
                .collect(),
        })
        .collect();
    QueryIndex {
        version: 1,
        strings,
        lines,
    }
}

fn write_json_gzip(data: &QueryIndex, path: &Path) {
    let file = File::create(path).unwrap();
    let mut gzip = GzEncoder::new(file, Compression::best());
    serde_json::to_writer(&mut gzip, data).unwrap();
    gzip.finish().unwrap().sync_all().unwrap();
}

fn write_rkyv(data: &QueryIndex, path: &Path) {
    let payload = rkyv::to_bytes::<rkyv::rancor::Error>(data).unwrap();
    let digest = Sha256::digest(&payload);
    let mut bytes = vec![0_u8; RKYV_HEADER + payload.len()];
    bytes[..8].copy_from_slice(RKYV_MAGIC);
    bytes[8..40].copy_from_slice(&digest);
    bytes[RKYV_HEADER..].copy_from_slice(&payload);
    fs::write(path, bytes).unwrap();
}

fn write_flatbuffers(data: &QueryIndex, path: &Path) {
    let mut builder = flatbuffers::FlatBufferBuilder::with_capacity(8 * 1024 * 1024);
    let strings = data
        .strings
        .iter()
        .map(|value| builder.create_shared_string(value))
        .collect::<Vec<_>>();
    let strings = builder.create_vector(&strings);
    let mut lines = Vec::with_capacity(data.lines.len());
    for line in data.lines.iter().rev() {
        let tests = builder.create_vector(&line.tests);
        lines.push(FlatLine::create(
            &mut builder,
            &LineArgs {
                file: line.file,
                line: line.line,
                covered: line.covered,
                tests: Some(tests),
            },
        ));
    }
    lines.reverse();
    let lines = builder.create_vector(&lines);
    let root = FlatQueryIndex::create(
        &mut builder,
        &QueryIndexArgs {
            version: data.version,
            strings: Some(strings),
            lines: Some(lines),
        },
    );
    builder.finish(root, Some("SCQI"));
    let payload = builder.finished_data();
    let digest = Sha256::digest(payload);
    let mut bytes = vec![0_u8; FLATBUFFERS_HEADER + payload.len()];
    bytes[..8].copy_from_slice(FLATBUFFERS_MAGIC);
    bytes[8..40].copy_from_slice(&digest);
    bytes[FLATBUFFERS_HEADER..].copy_from_slice(payload);
    fs::write(path, bytes).unwrap();
}

fn put_u32(bytes: &mut [u8], offset: usize, value: u32) {
    bytes[offset..offset + 4].copy_from_slice(&value.to_le_bytes());
}

fn get_u32(bytes: &[u8], offset: usize) -> Option<u32> {
    Some(u32::from_le_bytes(
        bytes.get(offset..offset + 4)?.try_into().ok()?,
    ))
}

fn write_fixed(data: &QueryIndex, path: &Path) {
    let records_bytes = data.lines.len() * FIXED_RECORD;
    let page_count = records_bytes.div_ceil(CHECKSUM_PAGE);
    let checksums_offset = FIXED_HEADER + records_bytes;
    let mut bytes = vec![0_u8; checksums_offset + page_count * 32];
    bytes[..8].copy_from_slice(FIXED_MAGIC);
    put_u32(&mut bytes, 8, 1);
    put_u32(&mut bytes, 12, data.lines.len() as u32);
    put_u32(&mut bytes, 16, FIXED_HEADER as u32);
    put_u32(&mut bytes, 20, FIXED_RECORD as u32);
    put_u32(&mut bytes, 24, CHECKSUM_PAGE as u32);
    put_u32(&mut bytes, 28, checksums_offset as u32);
    for (index, line) in data.lines.iter().enumerate() {
        let offset = FIXED_HEADER + index * FIXED_RECORD;
        put_u32(&mut bytes, offset, line.file);
        put_u32(&mut bytes, offset + 4, line.line);
        put_u32(&mut bytes, offset + 8, u32::from(line.covered));
        put_u32(
            &mut bytes,
            offset + 12,
            line.tests.first().copied().unwrap_or(u32::MAX),
        );
        put_u32(&mut bytes, offset + 16, line.tests.len() as u32);
    }
    for page in 0..page_count {
        let start = FIXED_HEADER + page * CHECKSUM_PAGE;
        let end = (start + CHECKSUM_PAGE).min(checksums_offset);
        let checksum = Sha256::digest(&bytes[start..end]);
        let checksum_offset = checksums_offset + page * 32;
        bytes[checksum_offset..checksum_offset + 32].copy_from_slice(&checksum);
    }
    let header_checksum = Sha256::digest(&bytes[..32]);
    bytes[32..64].copy_from_slice(&header_checksum);
    fs::write(path, bytes).unwrap();
}

fn map(path: &Path) -> Mmap {
    let file = File::open(path).unwrap();
    // The benchmark files are immutable for the lifetime of every mapping.
    unsafe { Mmap::map(&file).unwrap() }
}

fn query_json(path: &Path) -> usize {
    let file = File::open(path).unwrap();
    let mut gzip = GzDecoder::new(file);
    let mut bytes = Vec::new();
    gzip.read_to_end(&mut bytes).unwrap();
    let index: QueryIndex = serde_json::from_slice(&bytes).unwrap();
    usize::from(index.lines[50_000].covered) + index.lines[50_000].tests.len()
}

fn query_rkyv(path: &Path) -> usize {
    let mmap = map(path);
    assert_eq!(mmap.get(..8), Some(RKYV_MAGIC.as_slice()));
    let payload = &mmap[RKYV_HEADER..];
    assert_eq!(Sha256::digest(payload).as_slice(), &mmap[8..40]);
    let index = rkyv::access::<ArchivedQueryIndex, rkyv::rancor::Error>(payload).unwrap();
    usize::from(index.lines[50_000].covered) + index.lines[50_000].tests.len()
}

fn query_flatbuffers(path: &Path) -> usize {
    let mmap = map(path);
    assert_eq!(mmap.get(..8), Some(FLATBUFFERS_MAGIC.as_slice()));
    let payload = &mmap[FLATBUFFERS_HEADER..];
    assert_eq!(Sha256::digest(payload).as_slice(), &mmap[8..40]);
    let index = root_as_query_index(payload).unwrap();
    let line = index.lines().unwrap().get(50_000);
    usize::from(line.covered()) + line.tests().unwrap().len()
}

fn query_fixed(path: &Path) -> usize {
    let mmap = map(path);
    assert_eq!(mmap.get(..8), Some(FIXED_MAGIC.as_slice()));
    assert_eq!(Sha256::digest(&mmap[..32]).as_slice(), &mmap[32..64]);
    assert_eq!(get_u32(&mmap, 8), Some(1));
    let count = get_u32(&mmap, 12).unwrap() as usize;
    let records_offset = get_u32(&mmap, 16).unwrap() as usize;
    let record_size = get_u32(&mmap, 20).unwrap() as usize;
    let page_size = get_u32(&mmap, 24).unwrap() as usize;
    let checksums_offset = get_u32(&mmap, 28).unwrap() as usize;
    assert_eq!(record_size, FIXED_RECORD);
    assert!(50_000 < count);
    let offset = records_offset + 50_000 * record_size;
    let page = (offset - records_offset) / page_size;
    let page_start = records_offset + page * page_size;
    let page_end = (page_start + page_size).min(checksums_offset);
    let checksum_offset = checksums_offset + page * 32;
    assert_eq!(
        Sha256::digest(&mmap[page_start..page_end]).as_slice(),
        &mmap[checksum_offset..checksum_offset + 32]
    );
    usize::from(get_u32(&mmap, offset + 8).unwrap() != 0)
        + get_u32(&mmap, offset + 16).unwrap() as usize
}

fn measure(
    format: &'static str,
    path: &Path,
    integrity: &'static str,
    query: fn(&Path) -> usize,
) -> Measurement {
    let mut durations = Vec::with_capacity(ITERATIONS);
    let mut sentinel = 0;
    for _ in 0..ITERATIONS {
        let started = Instant::now();
        sentinel ^= query(path);
        durations.push(started.elapsed());
    }
    std::hint::black_box(sentinel);
    durations.sort();
    let to_ms = |duration: Duration| duration.as_secs_f64() * 1_000.0;
    Measurement {
        format,
        bytes: fs::metadata(path).unwrap().len(),
        median_ms: to_ms(durations[durations.len() / 2]),
        p95_ms: to_ms(durations[durations.len() * 95 / 100]),
        integrity,
    }
}

fn main() {
    let root = std::env::args()
        .nth(1)
        .map(PathBuf::from)
        .unwrap_or_else(|| std::env::temp_dir().join("supercov-query-index-spike"));
    fs::create_dir_all(&root).unwrap();
    let data = corpus();
    let json = root.join("index.json.gz");
    let rkyv = root.join("index.rkyv");
    let flatbuffers = root.join("index.flatbuffers");
    let fixed = root.join("index.fixed");
    write_json_gzip(&data, &json);
    write_rkyv(&data, &rkyv);
    write_flatbuffers(&data, &flatbuffers);
    write_fixed(&data, &fixed);
    let measurements = [
        measure(
            "gzip-json",
            &json,
            "gzip framing plus full parse; no independent payload checksum",
            query_json,
        ),
        measure(
            "rkyv-validated-mmap",
            &rkyv,
            "SHA-256 authenticates the complete payload, then rkyv bytecheck validates the object graph",
            query_rkyv,
        ),
        measure(
            "flatbuffers-verified-mmap",
            &flatbuffers,
            "SHA-256 authenticates the complete payload, then FlatBuffers verifies the object graph",
            query_flatbuffers,
        ),
        measure(
            "fixed-layout-paged-checksum",
            &fixed,
            "SHA-256 validates the header and only the touched 64 KiB page",
            query_fixed,
        ),
    ];
    println!("{}", serde_json::to_string_pretty(&measurements).unwrap());
}
