import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import swc from "@rollup/plugin-swc";

export default {
	input: "apps/desktop/src/main.ts",
	output: {
		file: "dist/desktop/main.js",
		format: "commonjs",
	},
	plugins: [
		nodeResolve({
			extensions: [".js", ".ts"],
			preferBuiltins: true,
		}),
		commonjs(),
		swc({
			swc: {
				jsc: {
					target: "es2020",
					parser: {
						syntax: "typescript",
					},
				},
			},
		}),
	],
	external: ["electron", "node:fs", "node:path"],
};
