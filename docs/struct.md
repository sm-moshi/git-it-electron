git-it-nx/
├── apps/
│   ├── desktop/                  # Electron main process
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── preload.ts
│   │   │   ├── locale.ts         # If not extracted to package
│   │   │   └── menus/
│   │   │       ├── darwin-menu.ts
│   │   │       └── other-menu.ts
│   │   ├── tsconfig.json
│   │   └── rollup.config.ts
│   └── renderer/                 # Frontend UI (Vite-based)
│       ├── public/
│       ├── src/
│       │   ├── index.tsx
│       │   ├── App.tsx
│       │   ├── pages/
│       │   ├── components/
│       │   └── hooks/
│       ├── tsconfig.json
│       └── vite.config.ts
├── assets/                       # Static assets
│   ├── css/
│   ├── imgs/
│   └── *.png, *.ico, *.ttf
├── packages/
│   ├── core/                     # Challenge engine + loader
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── challenge.ts
│   │   │   ├── verify/
│   │   │   └── state.ts
│   │   └── tsconfig.json
│   ├── git/                      # Git CLI abstraction
│   │   ├── src/git.ts
│   │   └── tsconfig.json
│   ├── i18n/                     # Locales + loader
│   │   ├── src/
│   │   │   ├── en.json
│   │   │   ├── de.json
│   │   │   ├── loader.ts
│   │   │   └── getLocale.ts
│   │   └── tsconfig.json
│   └── types/                    # Shared type declarations
│       ├── src/index.d.ts
│       └── tsconfig.json
├── tests/                        # Global test helpers or integration
│   ├── test-helper.ts
│   └── test-repository.ts
├── built/                        # Precompiled language bundles (optional)
│   └── en-US/, fr-FR/, etc.
├── dist/                         # Rollup/Vite build output (gitignored)
├── docs/                         # Architecture, roadmap, API notes
│   └── architecture.md
├── .github/
│   └── workflows/
│       └── ci.yml
├── .vscode/
│   └── settings.json
├── .biome.json                   # Biome config (linter + formatter)
├── mise.toml                    # Node & tool version pinning
├── tsconfig.base.json           # Shared TS config
├── tsconfig.json                # Root for `typecheck` only
├── package.json
├── pnpm-lock.yaml
└── pnpm-workspace.yaml
