// create a git repository

import { exec } from "node:child_process";
import * as path from "node:path";
import * as os from "node:os";

let tmpDir = "";

makeDirectory();

function makeDirectory() {
	tmpDir = path.join(os.tmpdir(), "git-it-nx");
}

exec("git init", { cwd: tmpDir }, function initalized(err, stderr, stdout) {
	if (err) return console.log(err);
});
