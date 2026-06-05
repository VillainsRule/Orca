<div align='center'>
    <h1>orca</h1>
    <h3>edpuzzle account generator</h3>
</div>

<br><br>

## setup

1. git clone and stuff
2. copy `.env.example` to `.env` and input a paid gemini key
   1. too poor to afford? find it on a repo where someone didnt gitignore their `.env`!
3. install bun (node also supported)
4. run `bun .`
5. profit (accs in data/acc.txt in format email:pass:token)

you can confirm the code works by running src/test.ts (it uses the first entry in acc.txt by default)

## imrpotantr note

this is a very imrpotantr note. if you attempt to login on edpuzzle via email/pass, you will run into issues such as having to input the school and the email not being verified. fun fact, these aren't supposed to be normal accounts. they work to the extent of fetching assignments for the answers. yay fun!

<br><br>
<h5 align='center'>made with :troll: by VillainsRule</h5>
