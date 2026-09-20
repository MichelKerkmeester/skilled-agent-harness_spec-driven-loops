#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
  const args = { tree: null, referrers: null, apply: false, dryRun: false, manifestDir: null };
  for (let i = 2; i < argv.length; i++) {
    switch (argv[i]) {
      case '--tree': args.tree = argv[++i]; break;
      case '--referrers': args.referrers = argv[++i]; break;
      case '--apply': args.apply = true; break;
      case '--dry-run': args.dryRun = true; break;
      case '--manifest-dir': args.manifestDir = argv[++i]; break;
      default:
        process.stderr.write('Unknown argument: ' + argv[i] + '\n');
        process.exit(1);
    }
  }
  if (!args.tree) {
    process.stderr.write('Error: --tree is required\n');
    process.exit(1);
  }
  if (args.apply && args.dryRun) {
    process.stderr.write('Error: cannot specify both --apply and --dry-run\n');
    process.exit(1);
  }
  return args;
}

function findCategoryDirs(treeDir) {
  const entries = fs.readdirSync(treeDir, { withFileTypes: true });
  return entries
    .filter(function(e) { return e.isDirectory() && /^\d{2,3}--/.test(e.name); })
    .map(function(e) { return e.name; });
}

function buildRenameMap(treeDir, categoryDirs) {
  var renames = [];
  for (var i = 0; i < categoryDirs.length; i++) {
    var cat = categoryDirs[i];
    var catPath = path.join(treeDir, cat);
    var files = fs.readdirSync(catPath, { withFileTypes: true });
    for (var j = 0; j < files.length; j++) {
      var f = files[j];
      if (!f.isFile()) continue;
      var m = f.name.match(/^(\d+)-(.+)\.md$/);
      if (!m) continue;
      var newName = m[2] + '.md';
      renames.push({
        src: path.join(catPath, f.name),
        dst: path.join(catPath, newName),
        cat: cat,
        oldBase: f.name,
        newBase: newName
      });
    }
  }
  return renames;
}

function checkCollisions(renames) {
  var dstMap = {};
  for (var i = 0; i < renames.length; i++) {
    var r = renames[i];
    if (!dstMap[r.dst]) dstMap[r.dst] = [];
    dstMap[r.dst].push(r.src);
  }
  var collisions = {};
  var dstKeys = Object.keys(dstMap);
  for (var i = 0; i < dstKeys.length; i++) {
    var dst = dstKeys[i];
    var srcs = dstMap[dst];
    if (srcs.length > 1) {
      collisions[dst] = srcs;
      continue;
    }
    if (fs.existsSync(dst)) {
      var isBeingRenamed = false;
      for (var j = 0; j < renames.length; j++) {
        if (renames[j].src === dst) { isBeingRenamed = true; break; }
      }
      if (!isBeingRenamed) {
        collisions[dst] = srcs;
      }
    }
  }
  return collisions;
}

function buildReferenceMaps(renames, treeDir) {
  var fullMap = {};
  var baseMapByCat = {};
  for (var i = 0; i < renames.length; i++) {
    var r = renames[i];
    var relSrc = path.relative(treeDir, r.src);
    var relDst = path.relative(treeDir, r.dst);
    fullMap[relSrc] = relDst;
    if (!baseMapByCat[r.cat]) baseMapByCat[r.cat] = {};
    baseMapByCat[r.cat][r.oldBase] = r.newBase;
  }
  return { fullMap: fullMap, baseMapByCat: baseMapByCat };
}

function findRootDoc(treeDir) {
  // The root doc lives INSIDE the tree dir as <treeBasename>.md
  // (e.g. feature_catalog/feature_catalog.md), not as a sibling.
  var basename = path.basename(treeDir);
  var docPath = path.join(treeDir, basename + '.md');
  if (fs.existsSync(docPath)) return docPath;
  return null;
}

function findReferrerFiles(treeDir, referrersPath) {
  var files = [];
  var rootDoc = findRootDoc(treeDir);
  if (rootDoc) files.push(rootDoc);
  if (referrersPath) {
    var content = fs.readFileSync(referrersPath, 'utf-8');
    var lines = content.split(/\r?\n/);
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim();
      if (line.length === 0) continue;
      var abs = path.resolve(line);
      if (fs.existsSync(abs)) files.push(abs);
    }
  }
  return files;
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function replaceWithBoundary(content, oldStr, newStr, allowParentPrefix) {
  var escaped = escapeRegex(oldStr);
  var pattern;
  if (allowParentPrefix) {
    pattern = new RegExp('(?<![a-zA-Z0-9])(\\.\\.\\/|\\.\\/)?' + escaped + '(?![a-zA-Z0-9])', 'g');
  } else {
    pattern = new RegExp('(?<![a-zA-Z0-9])(\\.\\/)?' + escaped + '(?![a-zA-Z0-9])', 'g');
  }
  var count = 0;
  var newContent = content.replace(pattern, function(match, prefix) {
    count++;
    return (prefix || '') + newStr;
  });
  return { content: newContent, count: count };
}

function computeReferenceEdits(refMaps, referrerFiles, renames, treeDir) {
  var edits = [];
  var allFiles = {};
  for (var i = 0; i < referrerFiles.length; i++) {
    allFiles[referrerFiles[i]] = true;
  }
  for (var i = 0; i < renames.length; i++) {
    allFiles[renames[i].src] = true;
  }

  var fullEntries = Object.keys(refMaps.fullMap).map(function(k) {
    return [k, refMaps.fullMap[k]];
  });
  fullEntries.sort(function(a, b) { return b[0].length - a[0].length; });

  var fileKeys = Object.keys(allFiles);
  for (var fi = 0; fi < fileKeys.length; fi++) {
    var file = fileKeys[fi];
    if (!fs.existsSync(file)) continue;
    var content = fs.readFileSync(file, 'utf-8');
    var fileEdits = [];

    var renameEntry = null;
    for (var ri = 0; ri < renames.length; ri++) {
      if (renames[ri].src === file) { renameEntry = renames[ri]; break; }
    }

    for (var fe = 0; fe < fullEntries.length; fe++) {
      var fullOld = fullEntries[fe][0];
      var fullNew = fullEntries[fe][1];
      var result = replaceWithBoundary(content, fullOld, fullNew, true);
      if (result.count > 0) {
        fileEdits.push({ old: fullOld, new: fullNew, count: result.count });
        content = result.content;
      }
    }

    if (renameEntry) {
      var catBaseMap = refMaps.baseMapByCat[renameEntry.cat] || {};
      var baseKeys = Object.keys(catBaseMap);
      var baseEntries = [];
      for (var bk = 0; bk < baseKeys.length; bk++) {
        var bo = baseKeys[bk];
        if (bo !== renameEntry.oldBase) {
          baseEntries.push([bo, catBaseMap[bo]]);
        }
      }
      baseEntries.sort(function(a, b) { return b[0].length - a[0].length; });

      for (var be = 0; be < baseEntries.length; be++) {
        var baseOld = baseEntries[be][0];
        var baseNew = baseEntries[be][1];
        var bresult = replaceWithBoundary(content, baseOld, baseNew, false);
        if (bresult.count > 0) {
          fileEdits.push({ old: baseOld, new: baseNew, count: bresult.count });
          content = bresult.content;
        }
      }
    }

    if (fileEdits.length > 0) {
      edits.push({ file: file, edits: fileEdits, content: content });
    }
  }

  return edits;
}

function applyRenames(renames) {
  for (var i = 0; i < renames.length; i++) {
    fs.renameSync(renames[i].src, renames[i].dst);
  }
}

function applyEdits(edits) {
  for (var i = 0; i < edits.length; i++) {
    fs.writeFileSync(edits[i].file, edits[i].content, 'utf-8');
  }
}

function writeManifests(renames, edits, collisions, manifestDir, tree, mode) {
  if (!fs.existsSync(manifestDir)) {
    fs.mkdirSync(manifestDir, { recursive: true });
  }

  var renameManifest = renames.map(function(r) {
    return { src: r.src, dst: r.dst };
  });
  fs.writeFileSync(
    path.join(manifestDir, 'rename-manifest.json'),
    JSON.stringify(renameManifest, null, 2),
    'utf-8'
  );

  var editManifest = edits.map(function(e) {
    return { file: e.file, edits: e.edits };
  });
  fs.writeFileSync(
    path.join(manifestDir, 'reference-edit-manifest.json'),
    JSON.stringify(editManifest, null, 2),
    'utf-8'
  );

  fs.writeFileSync(
    path.join(manifestDir, 'collision-report.json'),
    JSON.stringify(collisions, null, 2),
    'utf-8'
  );
}

function totalEdits(refEdits) {
  var total = 0;
  for (var i = 0; i < refEdits.length; i++) {
    var edits = refEdits[i].edits;
    for (var j = 0; j < edits.length; j++) {
      total += edits[j].count;
    }
  }
  return total;
}

function main() {
  var args = parseArgs(process.argv);
  var treeDir = path.resolve(args.tree);

  if (!fs.existsSync(treeDir) || !fs.statSync(treeDir).isDirectory()) {
    process.stderr.write('Error: tree directory does not exist: ' + treeDir + '\n');
    process.exit(1);
  }

  var manifestDir = args.manifestDir ? path.resolve(args.manifestDir) : process.cwd();
  var mode = args.apply ? 'apply' : 'dry-run';

  var categoryDirs = findCategoryDirs(treeDir);

  var renames = buildRenameMap(treeDir, categoryDirs);

  var collisions = checkCollisions(renames);
  if (Object.keys(collisions).length > 0) {
    writeManifests(renames, [], collisions, manifestDir, args.tree, mode);
    process.stdout.write(
      'TREE=' + args.tree +
      ' RENAMES=0 REFFILES=0 EDITS=0 COLLISIONS=' + Object.keys(collisions).length +
      ' MODE=' + mode + '\n'
    );
    process.exit(2);
  }

  var refMaps = buildReferenceMaps(renames, treeDir);

  var referrerFiles = findReferrerFiles(treeDir, args.referrers);

  var refEdits = computeReferenceEdits(refMaps, referrerFiles, renames, treeDir);

  if (mode === 'apply') {
    applyEdits(refEdits);
    applyRenames(renames);
  }

  writeManifests(renames, refEdits, collisions, manifestDir, args.tree, mode);

  var editCount = totalEdits(refEdits);
  process.stdout.write(
    'TREE=' + args.tree +
    ' RENAMES=' + renames.length +
    ' REFFILES=' + referrerFiles.length +
    ' EDITS=' + editCount +
    ' COLLISIONS=0' +
    ' MODE=' + mode + '\n'
  );
}

main();
