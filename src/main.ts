import { genAccount } from './gen';

while (true) {
    try {
        genAccount();
    } catch (e) {
        console.error('Error generating account:', e);
    }

    await new Promise((r) => setTimeout(r, 1000));
}