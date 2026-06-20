# 🚀 Pôr o LotteryPro online (Passo 4)

Guia para colocares o **servidor** e o **site** na internet, a funcionar 24/7.

Antes de começar, a ordem certa é: **1) servidor → 2) site → 3) ligar os dois.**
Não há pressa; faz um passo de cada vez.

---

## Antes de tudo — vais precisar de uma conta GitHub

A forma mais simples de publicar (sem instalar nada) é através do **GitHub**, onde
guardas os ficheiros, e depois os serviços de alojamento "puxam" de lá.

1. Cria conta grátis em [github.com](https://github.com)
2. Vais criar **dois repositórios** (duas "pastas online"): um para o servidor, outro para o site.

> ⚠️ **NUNCA** envies o ficheiro `.env` (tem a tua chave secreta) para o GitHub.

---

## PARTE A — Servidor online (Railway)

1. No GitHub: **New repository** → nome `lotterypro-servidor` → **Create**.
2. **Add file → Upload files** → arrasta os ficheiros da pasta do servidor:
   `server.js`, `package.json`, `descobrir-config.js`
   **(NÃO envies o `.env`!)** → **Commit changes**.
3. Vai a [railway.app](https://railway.app) → entra com o GitHub.
4. **New Project → Deploy from GitHub repo** → escolhe `lotterypro-servidor`.
5. Quando arrancar, vai a **Variables** e adiciona:
   - `LOTTERY_API_KEY` = a tua chave
6. Em **Settings → Networking → Generate Domain**: o Railway dá-te um endereço,
   tipo `https://lotterypro-servidor-production.up.railway.app`.
7. Testa: abre esse endereço + `/api/resultados` no navegador. Deves ver os resultados.

**Guarda esse endereço** — vais precisar dele na Parte C.

---

## PARTE B — Site online (Vercel)

⚠️ **Faz primeiro a mudança da Parte C-1 (o endereço do servidor) antes de publicar o site!**

1. No GitHub: **New repository** → nome `lotterypro-site` → **Create**.
2. **Add file → Upload files** → arrasta **tudo** o que está na pasta do site:
   `index.html`, `package.json`, `vite.config.js`, e a pasta `src` (com `App.jsx` e `main.jsx`)
   → **Commit changes**.
3. Vai a [vercel.com](https://vercel.com) → entra com o GitHub.
4. **Add New → Project** → escolhe `lotterypro-site` → **Import**.
5. A Vercel deteta sozinha que é um projeto **Vite** (Build: `npm run build`, Output: `dist`).
   Não precisas de mudar nada → **Deploy**.
6. Em 1-2 minutos, a Vercel dá-te o endereço do teu site, tipo
   `https://lotterypro-site.vercel.app`. **Esse é o teu site online!** 🎉

---

## PARTE C — Ligar os dois

### C-1. Apontar o site para o servidor (ANTES de publicar o site)

No ficheiro `src/App.jsx`, procura a linha:

```js
const RESULTS_URL = "http://localhost:4000/api/resultados";
```

Troca pelo endereço do Railway (da Parte A) + `/api/resultados`:

```js
const RESULTS_URL = "https://o-teu-servidor.up.railway.app/api/resultados";
```

Guarda e envia para o GitHub (a Vercel volta a publicar sozinha).

### C-2. Deixar só o teu site falar com o servidor (mais seguro)

No `server.js`, procura:

```js
res.header("Access-Control-Allow-Origin", "*");
```

Troca o `"*"` pelo endereço do teu site (da Parte B):

```js
res.header("Access-Control-Allow-Origin", "https://lotterypro-site.vercel.app");
```

Guarda e envia para o GitHub do servidor (o Railway volta a publicar sozinho).

Agora o teu site online mostra resultados reais, em `https`, a funcionar para toda a gente. ✅

---

## ⚠️ Avisos honestos (lê com atenção)

**Custo:** os planos gratuitos de início chegam para testar, mas:
- O **Railway** dá um crédito de teste; depois é pago (poucos euros/mês). É fiável e **não "adormece"**.
- O **Render** tem plano grátis, mas o serviço **adormece** quando não há visitas — e aí a atualização da meia-noite pode não correr. Por isso, para o servidor, o Railway é mais seguro.

**A atualização à meia-noite:** para garantir que corre mesmo que o servidor esteja parado,
podes usar um agendador externo grátis como [cron-job.org](https://cron-job.org):
crias lá uma tarefa diária que "visita" o teu endereço `.../api/atualizar-agora`.
Assim os resultados atualizam sempre, sem dependeres só do agendador interno.

**O feed:** com 21 loterias, vais ultrapassar o plano gratuito do lotteryresultsfeed
(100 chamadas/mês). Para o site no ar a sério, precisas do plano **Starter** (£14.95/mês, 1.000/dia).

**A parte legal:** mostrar resultados e estratégias é legal. O negócio de comprar bilhetes
em nome de terceiros continua a precisar de licença da UK Gambling Commission + advogado.

---

## Resumo rápido

| O quê | Onde | Endereço final |
|---|---|---|
| Servidor (resultados) | Railway | `https://...up.railway.app` |
| Site (o que as pessoas veem) | Vercel | `https://....vercel.app` |

Quando tiveres o endereço do Railway, volta aqui e eu ajudo-te a fazer as duas trocas
(C-1 e C-2) certinhas. 🙌
