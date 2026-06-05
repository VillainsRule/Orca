import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import MTCaptcha from 'mtcrackcha';

const mtc = new MTCaptcha({
    geminiKey: process.env.GEMINI_KEY,
    siteKey: 'MTPublic-305dpdlj4',
    host: 'https://edpuzzle.com'
});

const fetchText = async (url: string, opts?: RequestInit) => await fetch(url, opts).then(res => res.text());
const fetchJSON = async (url: string, opts?: RequestInit) => JSON.parse(await fetchText(url, opts));

const firstVersionPartReq = await fetchText('https://edpuzzle.com/');
const firstVersionPart = firstVersionPartReq.replaceAll(' ', '').match(/version:"(.*?)",/)![1];

const getEdpuzzleWebVersion = (requestBody: any) => {
    const md5Hash = crypto.createHash('md5').update(requestBody).digest('hex').slice(0, 4);
    const multiplyBy = Number(firstVersionPart.split('.')[2]) + 10;
    const goofyAhhAnticheat = Math.floor(Date.now() / 1000) * multiplyBy;
    return firstVersionPart + '.' + md5Hash + goofyAhhAnticheat
}

export const genAccount = async () => {
    const csrfCookieReq = await fetch('https://edpuzzle.com/');
    const csrfCookieValue = csrfCookieReq.headers.getSetCookie()[0].split(' ')[0] + ' aws-waf-token=ad057a6f-78f6-419d-a29c-8bbafc1e06aa:EQoArOZ1RiewAAAA:RhyLKLiL7D3EkSlv8kVzwqguu5wKL5j/CVD9bBBjM3LkW2fzjWMudHh8/I/nuWc7j617PHG0qlGoAxJvPqbMKKD8KtkwJUe4Y1qzmP0MtHYZZpqLoNLLwasSU8Dgmdk1SLFTgqEUQwJ5/JobONp8IePLQlWAifXHoxRmV645NSb6UB1F6dqpca5TLsHvIMoodxWwLLxgG6oG52H12A==';

    const { CSRFToken } = await fetchJSON('https://edpuzzle.com/api/v3/csrf', { headers: { cookie: csrfCookieValue } });

    const email = Math.random().toString(36).substring(2, 15) + '@gmail.com';
    const password = crypto.getRandomValues(new Uint8Array(20)).reduce((s, b) => s + b.toString(36)[0], '');

    const request = JSON.stringify({
        firstName: 'Annie',
        lastName: 'Wersching',
        username: email,
        password,
        role: 'teacher'
    });

    const xWebVersion = getEdpuzzleWebVersion(request);

    const captchaToken = await mtc.solve('sign_up_edpuzzle', -Number.MAX_SAFE_INTEGER);
    if (!captchaToken.token) return console.log('well THAT didnt work', captchaToken);

    const signUpReq = await fetch('https://edpuzzle.com/api/v3/users/', {
        headers: {
            'accept': 'application/json, text/plain, */*',
            'accept-language': 'en-US,en;q=0.9',
            'cache-control': 'no-cache',
            'content-type': 'application/json',
            'pragma': 'no-cache',
            'priority': 'u=1, i',
            'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'x-chrome-version': '134',
            'x-csrf-token': CSRFToken,
            'x-edpuzzle-captcha-token': captchaToken.token,
            'x-edpuzzle-invitation-token': '',
            'x-edpuzzle-preferred-language': 'en',
            'x-edpuzzle-referred-by': 'https://edpuzzle.com/discover',
            'x-edpuzzle-web-version': xWebVersion,
            'cookie': `${csrfCookieValue}`,
            'Referer': 'https://edpuzzle.com/',
            'Referrer-Policy': 'strict-origin'
        },
        'body': request,
        'method': 'POST'
    });

    const signUpResult = await signUpReq.json();

    if (signUpResult._id) {
        const accountPath = path.join(import.meta.dirname, '..', 'data', 'acc.txt');
        if (!fs.existsSync(accountPath)) {
            fs.mkdirSync(path.dirname(accountPath), { recursive: true });
            fs.writeFileSync(accountPath, '', 'utf-8');
        }
        fs.appendFileSync(accountPath, `${email}:${password}:${signUpReq.headers.get('authorization')?.replace('Bearer ', '')}\n`, 'utf-8');
        return true;
    } else return false;
}
