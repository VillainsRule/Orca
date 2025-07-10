import { genAccount } from './gen.ts';

const account = await genAccount();
if (account) console.log('Edpuzzle Gen works!');
else throw new Error('Orca is broken :((');