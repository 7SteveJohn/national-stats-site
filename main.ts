// STATLAS 的提交入口（Node 22，只用标准库）。
// 作用：把仓库里的 app/ 与 screenshots/ 原样拷到输出目录，并在输出目录里
// 用 kit 自带的 vendor/makefun-frontend.ts 写出 dossier.json（评委读的摘要）。
// 评分器在沙箱里跑两次本文件，两次输出必须逐字节相同，所以这里不写时间、
// 不写随机数、不依赖环境，只做确定性的文件复制与摘要生成。
// 本地试跑：MAKEFUN_OUTPUT_DIR=out node main.ts
// 评分器正式跑时输出目录是 /output（环境变量缺省即 /output）。

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

// 评分器对输出目录的硬性上限（见 kit 的 RULES.txt）：app/ 最多 993 项、
// 16 MiB；截图最多 4 张、每张最多 256 KiB；输出总共最多 1000 项、64 MiB。
const DOSSIER_OPTIONS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
};

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// 先做一次轻量自检：入口依赖的文件都在，缺了就直接报错而不是交半成品。
function checkInputs() {
  const needed = [join(repoRoot, 'app', 'index.html'), join(repoRoot, 'vendor', 'makefun-frontend.ts')];
  for (const file of needed) {
    if (!existsSync(file)) throw new Error(`missing required file: ${file}`);
  }
  const shots = existsSync(join(repoRoot, 'screenshots'))
    ? readdirSync(join(repoRoot, 'screenshots')).filter((n) => statSync(join(repoRoot, 'screenshots', n)).isFile())
    : [];
  if (shots.length === 0 || shots.length > 4) {
    throw new Error(`expected 1-4 screenshots, found ${shots.length}`);
  }
}

// 复制 app/ 与 screenshots/；输出目录先建好，旧内容不残留也由调用方保证。
function copyEntryFiles() {
  mkdirSync(outDir, { recursive: true });
  cpSync(join(repoRoot, 'app'), join(outDir, 'app'), { recursive: true });
  mkdirSync(join(outDir, 'screenshots'), { recursive: true });
  if (existsSync(join(repoRoot, 'screenshots'))) {
    cpSync(join(repoRoot, 'screenshots'), join(outDir, 'screenshots'), { recursive: true });
  }
}

checkInputs();
copyEntryFiles();
writeFileSync(join(outDir, 'dossier.json'), buildDossier(outDir, DOSSIER_OPTIONS));
console.log(`STATLAS entry written to ${outDir}`);
