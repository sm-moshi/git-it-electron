import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import swc from "@rollup/plugin-swc";

export default {
	input: "src/main.ts",
	output: {
		file: "dist/main.js",
		format: "cjs",
	},
	plugins: [
		nodeResolve(),
		commonjs(),
		swc(), // ← this replaces the deprecated plugin
	],
};
