import * as fs from 'fs';
import path from 'path';

function isTSFile(filename: string) {
    if (filename === undefined || filename === null) return false;
    
    const length = filename.length;
    if (filename.endsWith('.ts') && length > 3) return true;

    return false;
}

export function findFilesInDirectories(dirsPath: Set<string>) {
    let files = new Set<string>();
    let dirs = dirsPath;

    while (dirs.size > 0) {
        let foundSubDirs = new Set<string>();
        for (let dir of dirs) {
            const [subDirs, filesInDir] = scan(dir);
            foundSubDirs = new Set<string>([...foundSubDirs, ...subDirs]);
            files = new Set([...files, ...filesInDir]);
        }
        dirs = foundSubDirs;
    }
    return files;
}

export function scan(dir: string) : [Set<string>, Set<string>] {
    const directories = new Set<string>();
    const files = new Set<string>();
    fs.readdirSync(dir).forEach((item) => {
        const itemPath = path.join(dir, item);
        const stats = fs.statSync(itemPath);

        if (stats.isDirectory()) {
            if (!itemPath.startsWith('.'))    
                directories.add(itemPath);
            
        } else if (isTSFile(itemPath)) {
            files.add(itemPath);
        }
    });
    return [directories, files];
}

/*
export function shouldFail(testFunction, params) {
    if (!testFunction || typeof testFunction !== 'function') {
        throw new Error("Function expected");
    }

    let p = params;

    if (p === null) {
        p = [null];
    } else if (p === undefined) {
        p = [undefined];
    } else if (!Array.isArray(p)) {
        p = [p];
    }

    let errExpected = null;
    try {
        testFunction.apply(null, p);
    } catch (err) {
        errExpected = err;
    }
    if (errExpected === null)
        throw new Error('Error expected');
}
*/