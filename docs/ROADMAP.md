# 🛠️ Git-It-NX Refactor & Porting Roadmap

This document provides a complete, step-by-step guide for refactoring the legacy JavaScript-based `git-it-electron` project into a modern TypeScript monorepo with the `git-it-nx` architecture and tooling stack.

---

## ✅ Tech Stack

- **Language**: TypeScript
- **Package Manager**: pnpm
- **Formatter/Linter**: Biome
- **Transpiler**: SWC
- **Bundler**: Rollup (for Electron), Vite (for Renderer)
- **Builder**: electron-builder
- **Test Runner**: Vitest

---

## ✅ Phase 0: Setup & Snapshot **COMPLETED**

1. ✅ Clone the original repo: `git clone https://github.com/sm-moshi/git-it-nx.git`
2. ✅ Create a new branch: `git checkout -b refactor/modern-base`
3. ✅ Snapshot the current behavior:
   - Run the original Electron app.
   - Note any bugs or deprecated APIs.
   - Commit the frozen `package-lock.json`.

---

## ✅ Phase 1: Toolchain & Environment Setup **COMPLETED**

1. ✅ Convert project to **pnpm**:

   ```bash
   rm -rf node_modules package-lock.json
   pnpm install
   ```

   - Add `pnpm-workspace.yaml` with:

     ```yaml
     packages:
       - apps/*
       - packages/*
     ```

2. ✅ Upgrade to **Node.js 20**:
   - Use `mise` or `nvm`
   - Set in `mise.toml`:

     ```
     [tools]
     node = "20"
     biome = "latest"
     ```

3. ✅ Install Dev Tools (workspace root):

   ```bash
   pnpm add -Dw typescript biome vite rollup      @rollup/plugin-swc @rollup/plugin-node-resolve @rollup/plugin-commonjs      electron-builder
   ```

4. ✅ Replace deprecated deps:
   - Remove: `request`, `rimraf`, `standard`, `electron-packager`
   - Keep or upgrade: `electron`, `cheerio`, `handlebars`, `glob`

5. ✅ Update `package.json` scripts:

   ```json
   {
     "scripts": {
       "dev": "vite",
       "build": "rollup -c",
       "typecheck": "tsc --noEmit",
       "lint": "biome check .",
       "format": "biome format .",
       "start": "electron .",
       "dist": "electron-builder"
     }
   }
   ```

---

## ✅ Phase 2: Directory & Config Setup **COMPLETED**

1. ✅ Create folders:

   ```
   apps/desktop/src/
   apps/renderer/src/
   packages/core/src/
   packages/git/src/
   packages/i18n/src/
   packages/types/src/
   ```

2. ✅ Add TypeScript configs:
   - `tsconfig.base.json` in root
   - `tsconfig.json` in each app/package extending the base

3. ✅ Initialize Biome:

   ```bash
   biome init
   ```

4. ✅ Setup Rollup config for Electron:
   - Entry: `apps/desktop/src/main.ts`
   - Output: `dist/desktop/main.js`

5. ✅ Setup Vite config for Renderer:
   - Entry: `apps/renderer/src/index.tsx`

---

## 🚧 Phase 3: Core Logic Porting **IN PROGRESS**

### ✅ **Completed:**

1. ✅ Port `main.js` → `main.ts`:
   - Use strict context isolation
   - Move Electron `Menu` files to `menus/` module

2. ✅ Add `preload.ts`:
   - Use `contextBridge` to expose secure IPC APIs

3. ✅ Create Git abstraction:
   - `packages/git/src/git.ts` uses `child_process` to run Git commands
   - Proper TypeScript interfaces and error handling
   - Package structure with proper exports

4. ✅ Port i18n logic:
   - `packages/i18n/src/getLocale.ts` and localized `.json` files

5. ✅ Core files converted to TypeScript:
   - `user-data.js` → `user-data.ts` (ES modules, proper typing)
   - `handle-external-links.js` → `handle-external-links.ts`
   - `challenge-completed.js` → `challenge-completed.ts`
   - `challenges-completed.js` → `challenges-completed.ts`
   - `helpers.js` → `helpers.ts`
   - `challenge.js` → `challenge.ts` (dynamic imports, proper DOM typing)

6. ✅ **Shared Types Package** (`@git-it-nx/types`):
   - Comprehensive type definitions for all modules
   - Challenge types with constants and enums for type safety
   - Git operation types and command constants
   - UI/React component types
   - **Main process types** (IPC events, CLI args, dialogs, app state)
   - **Exact data structure types** from JSON files (`empty-data.json`, `empty-saved-dir.json`)
   - Global window interface extensions with IPC API
   - Proper workspace package linking

7. ✅ Started verification scripts conversion:
   - `get_git.js` → `get_git.ts`
   - `repository.js` → `repository.ts`
   - `commit_to_it.js` → `commit_to_it.ts`

### 🔧 **Next Steps (Priority Order):**

**IMMEDIATE (Next Session):**

1. **Fix module system issues:**
   - Resolve "type": "module" conflicts with Rollup build
   - Fix workspace package imports (`@git-it-nx/git` declarations)
   - Update Rollup config for ES modules compatibility

2. **Complete verification scripts conversion:**
   - Convert remaining files in `packages/core/src/verify/`:
     - `requesting_you_pull_please.js`
     - `remote_control.js`
     - `pull_never_out_of_date.js`
     - `merge_tada.js`
     - `its_a_small_world.js`
     - `githubbin.js`
     - `forks_and_clones.js`
     - `branches_arent_just_for_birds.js`

3. **Build system fixes:**
   - Update Rollup configuration for new package structure
   - Fix TypeScript compilation and declaration generation
   - Ensure proper workspace linking works

**MEDIUM TERM:**
4. Update challenge HTML files to use new module structure
5. Test that verification system works end-to-end

---

## 🔄 Phase 4: Renderer Rewrite (UI) **SCAFFOLDED**

### ✅ **Completed:**

1. ✅ Basic React + Vite setup:
   - `apps/renderer/` with proper package.json
   - Vite config with React plugin
   - TypeScript configuration
   - Basic App component and hooks structure

### 🔧 **Remaining:**

1. Move UI code to `apps/renderer/src/`:
   - Convert challenge pages to React components
   - Create shared UI components
   - Implement hooks for Git-it functionality

2. Replace `index.html` with Vite root
3. Use `window.api` exposed by `preload.ts` for IPC
4. Add router or page navigation for challenges

---

## 🧪 Phase 5: Testing & Coverage

1. Install Vitest:

   ```bash
   pnpm add -Dw vitest @vitest/coverage-v8 happy-dom jsdom
   ```

2. Add `vitest.config.ts`:

   ```ts
   export default {
     test: {
       environment: "happy-dom",
       coverage: {
         provider: "v8",
         reporter: ["lcov"]
       }
     }
   };
   ```

3. Add `.gitignore` entry for:

   ```
   /coverage
   /dist
   ```

---

## 🚀 Phase 6: Packaging & Release

1. Install `electron-builder`
2. Create `electron-builder.config.json` or add config to `package.json`
3. Build distributables:

   ```bash
   pnpm run build && pnpm run dist
   ```

4. Test `.dmg`, `.exe`, `.AppImage` outputs on real OSes

---

## 📦 Phase 7: Cleanup & Docs

- Remove unused legacy files: `main.js`, `lib/`, `menus/`, etc.
- Add `README.md`, `CONTRIBUTING.md`, `SECURITY.md`
- Add CI workflows (`.github/workflows/ci.yml`)
- Tag first TS release: `v6.0.0-alpha`

---

Want to scaffold or preview any config files next?
