import fs from 'fs';
import path from 'path';

const accountFilePath = path.join(import.meta.dirname, '..', 'data', 'acc.txt');
const firstAccount = fs.readFileSync(accountFilePath, 'utf8').split('\n')[0].trim();
const [email, password, token] = firstAccount.split(':');

const req = await fetch('https://edpuzzle.com/api/v3/media/646679db818e6a42c3d6270c', {
    "headers": {
        "accept": "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "no-cache",
        "pragma": "no-cache",
        "priority": "u=1, i",
        "sec-ch-ua": "\"Chromium\";v=\"134\", \"Not:A-Brand\";v=\"24\", \"Google Chrome\";v=\"134\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"macOS\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-chrome-version": "134",
        "x-edpuzzle-preferred-language": "en",
        "x-edpuzzle-referrer": 'https://edpuzzle.com/search?channel=all&q=cocaine&contains=multiple-choice-questions%2Copen-ended-questions',
        "x-edpuzzle-web-version": "7.42.19.999150795352955",
        "cookie": `edpuzzleCSRF=VKXJaOeUi0s2lC2hINp8_haF; token=${token};`,
        "Referer": "https://edpuzzle.com/",
        "Referrer-Policy": "strict-origin"
    },
    "body": null,
    "method": "GET"
});

console.log(await req.text());