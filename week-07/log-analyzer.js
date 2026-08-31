import fs from 'fs';
import readline from 'readline';

const filePath = process.argv[2];

if (!filePath) {
    console.error('Usage: node log-analyzer.js <log-file>');
    process.exit(1);
}

if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
}

const counts = {
    error: 0,
    warn: 0,
    info: 0
};

const stream = fs.createReadStream(filePath, {
    encoding: 'utf8'
});

const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity
});

rl.on('line', (line) => {
    const text = line.toLowerCase();

    if (text.includes('error')) {
        counts.error++;
    } else if (text.includes('warn')) {
        counts.warn++;
    } else if (text.includes('info')) {
        counts.info++;
    }
});

rl.on('close', () => {
    console.log('\nLog Analysis Result');
    console.log('-------------------');
    console.log(`ERROR: ${counts.error}`);
    console.log(`WARN : ${counts.warn}`);
    console.log(`INFO : ${counts.info}`);
});

stream.on('error', (err) => {
    console.error(`Unable to read file: ${err.message}`);
});