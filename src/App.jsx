import { useState, useEffect, useMemo, createContext, useContext } from "react";
import { createClient } from "@supabase/supabase-js";

// ═══════════════════════════════════════════════════════════════
// i18n — IDIOMAS & TRADUÇÕES
// ═══════════════════════════════════════════════════════════════
const LANGS = [
  { code: "pt", nome: "Português", flag: "🇵🇹" },
  { code: "en", nome: "English", flag: "🇬🇧" },
  { code: "es", nome: "Español", flag: "🇪🇸" },
  { code: "fr", nome: "Français", flag: "🇫🇷" },
  { code: "de", nome: "Deutsch", flag: "🇩🇪" },
  { code: "it", nome: "Italiano", flag: "🇮🇹" },
];

const STR = {
  pt: {
    w_login: "Entrar", w_create: "Criar conta", w_tag1: "Resultados reais.", w_tag2: "Estratégias inteligentes.", w_startFree: "Começar grátis", w_haveAcc: "Já tenho conta",
    l_title: "Entrar", l_sub: "Usa uma conta demo (senha: 123456)", l_demo: "Contas demo", l_email: "EMAIL", l_pass: "SENHA", l_fill: "Preenche todos os campos.", l_invalid: "Credenciais inválidas.", l_noAcc: "Não tens conta?", l_reg: "Regista-te",
    r_title: "Criar conta gratuita", r_sub: "Começa a ver resultados hoje", r_name: "NOME", r_fill: "Preenche tudo.", r_min6: "Senha mín. 6 caracteres.", r_create: "Criar conta", r_haveAcc: "Já tens conta?", r_enter: "Entra", ph_name: "O teu nome", ph_mail: "email@exemplo.com", ph_p6: "Mín. 6 caracteres",
    nav_res: "Resultados", nav_str: "Estratégia", nav_num: "Numerologia", nav_pl: "Planilhas", nav_esp: "Especial ⭐", nav_sub: "Subscrever", btn_out: "Sair",
    h_res: "RESULTADO", h_jack: "Jackpot:", h_next: "Próximo:",
    howto: "Como utilizar", limits: "Limites", generate: "Gerar", back: "Voltar", explore: "Explorar",
    s_freq: "Frequência", s_delay: "Atraso", s_hot: "Quentes/Frios", s_pi: "Par/Ímpar", s_sort: "Ordenar:", s_order: "Ordem:", s_nums: "Números", s_qty: "Quant.", s_asc: "Crescente", s_desc: "Decrescente",
    s_freqEx: "Exemplo: O número 01 foi sorteado {0} vezes nos concursos 1 ao 362.", s_delayDesc: "Atraso = quantos concursos cada número está SEM sair.", s_recent: "Recente", s_med: "Médio", s_late: "Atrasado", s_hotT: "Quentes", s_coldT: "Frios", s_most: "Top 10 mais sorteados", s_least: "Top 10 menos sorteados", s_piT: "Par / Ímpar — Último Sorteio", s_evens: "Pares", s_odds: "Ímpares", s_piIdeal: "Ideal: equilíbrio entre pares e ímpares.", col_n: "Núm.",
    n_title: "Número de Vida", n_dob: "Introduz a tua data de nascimento:", n_your: "O TEU NÚMERO", n_lucky: "Números da Sorte", n_above: "Introduz a data acima.",
    pl_grp: "Grupos", pl_fech: "Fechamentos", pl_palp: "Palpites", pl_conf: "Conferidor",
    pl_grpT: "Grupos Premiados", pl_grpS1: "Selecciona a loteria.", pl_grpS2: "A tabela mostra os 20 grupos de 3 números que mais saíram juntos.", pl_grpS3: "Usa como base para as tuas apostas.", pl_uni: "Universo: 01 a {0}", pl_362: "362 concursos analisados", c_grp: "Grupo", c_oc: "Ocorr.", c_at: "Atraso",
    pl_fT: "Fechamentos", pl_fS1: "Digita {0} a 15 números.", pl_fS2: "Escolhe Maiores chances de X acertos.", pl_fS3: "Clica Gerar.", pl_fMin: "Mín: {0} · Máx: 15 números", pl_f50: "Até 50 apostas", pl_fNums: "Números (mín. {0}, máx. 15):", pl_chances: "Maiores chances de:", pl_hits: "acertos", pl_bets: "apostas", pl_chOf: "Maiores chances de {0} acertos",
    pl_pT: "Palpites Prontos", pl_pS1: "Escolhe 5, 10, 15 ou 20 jogos.", pl_pS2: "Clica 🔄 para novos.", pl_pS3: "Cada jogo: {0} números de 01 a {1}.", pl_pLim: "5 a 20 jogos por vez", pl_new: "🔄 Novos", c_sum: "Soma",
    pl_cT: "Conferidor", pl_cS1: "Clica nos números (mín. {0}, máx. 15).", pl_cS2: "Clica Conferir para ver resultados históricos.", pl_cMin: "Mín: {0} · Máx: 15", pl_marked: "marcados", pl_check: "Conferir", pl_result: "Resultado", c_hits: "Acertos",
    e_esp: "Especiais", e_erre: "Erre", e_diam: "Diamantes",
    e_espT: "Fechamentos Especiais", e_espS1: "Marca FIXOS 🔴 (em todas as apostas).", e_espS2: "Marca VARIÁVEIS 🔵 (alternam).", e_espS3: "Escolhe Maiores chances de X.", e_espS4: "Clica Gerar.", e_fixed: "Fixos: 1 a {0}", e_var2: "Variáveis: mín. 2", e_totMin: "Total mín: {0}", e_fixedL: "🔴 FIXOS (mín. 1, máx. {0}):", e_varL: "🔵 VARIÁVEIS (mín. 2):", e_genEsp: "Gerar Especial", e_fixedN: "fixos", e_varN: "variáveis", e_total: "Total", e_fixed1: "Fixo", e_var1: "Variável",
    e_erreT: "Fechamentos Erre", e_erreS1: "Marca números que achas que NÃO vão sair.", e_erreS2: "Apostas geradas só com os restantes.", e_erreS3: "Filosofia inversa: elimina errados!", e_erMin: "Errar: 5 a {0}", e_restMin: "Restantes mín: {0}", e_miss: "Errar:", e_rest: "Restantes:", e_genRest: "Gerar com Restantes", e_betsNo: "apostas sem os {0} eliminados", e_more: "🔄 Mais apostas",
    e_diamT: "Fechamentos Diamantes", e_diamS1: "Marca NÚCLEO 💎 (em todas as apostas).", e_diamS2: "Marca ÓRBITA 🔵 (rodam).", e_diamS3: "Clica Gerar Diamante.", e_nuc: "Núcleo: 1 a {0}", e_orb2: "Órbita: mín. 2", e_nucL: "💎 NÚCLEO (1 a {0}):", e_orbL: "🔵 ÓRBITA (mín. 2):", e_cov: "Cobertura:", e_genDiam: "Gerar Diamante 💎", e_nuc1: "Núcleo", e_orb1: "Órbita",
    sub_plans: "Planos & Preços", sub_current: "Actual:", sub_demo: "Stripe Checkout (Demo)", sub_card: "CARTÃO", sub_valid: "VALIDADE", sub_cvc: "CVC", sub_pay: "Pagar", sub_proc: "A processar...", sub_done: "activado!", sub_unlocked: "Funcionalidades desbloqueadas.", sub_sub: "Subscrever", sub_actual: "Actual", sub_incl: "Incluído", sub_plan: "Plano",
    lock_title: "Secção bloqueada", lock_req: "Requer Plano", lock_see: "Ver planos",
    foot: "LotteryPro © 2026 · Entretenimento · 18+", numb: "número", numbs: "números",
  },
  en: {
    w_login: "Sign in", w_create: "Create account", w_tag1: "Real results.", w_tag2: "Smart strategies.", w_startFree: "Start free", w_haveAcc: "I have an account",
    l_title: "Sign in", l_sub: "Use a demo account (password: 123456)", l_demo: "Demo accounts", l_email: "EMAIL", l_pass: "PASSWORD", l_fill: "Fill in all fields.", l_invalid: "Invalid credentials.", l_noAcc: "No account?", l_reg: "Sign up",
    r_title: "Create free account", r_sub: "Start seeing results today", r_name: "NAME", r_fill: "Fill in everything.", r_min6: "Password min. 6 characters.", r_create: "Create account", r_haveAcc: "Have an account?", r_enter: "Sign in", ph_name: "Your name", ph_mail: "email@example.com", ph_p6: "Min. 6 characters",
    nav_res: "Results", nav_str: "Strategy", nav_num: "Numerology", nav_pl: "Sheets", nav_esp: "Special ⭐", nav_sub: "Subscribe", btn_out: "Sign out",
    h_res: "RESULT", h_jack: "Jackpot:", h_next: "Next:",
    howto: "How to use", limits: "Limits", generate: "Generate", back: "Back", explore: "Explore",
    s_freq: "Frequency", s_delay: "Delay", s_hot: "Hot/Cold", s_pi: "Odd/Even", s_sort: "Sort:", s_order: "Order:", s_nums: "Numbers", s_qty: "Count", s_asc: "Ascending", s_desc: "Descending",
    s_freqEx: "Example: Number 01 was drawn {0} times across draws 1 to 362.", s_delayDesc: "Delay = how many draws each number has gone WITHOUT appearing.", s_recent: "Recent", s_med: "Medium", s_late: "Overdue", s_hotT: "Hot", s_coldT: "Cold", s_most: "Top 10 most drawn", s_least: "Top 10 least drawn", s_piT: "Odd / Even — Last Draw", s_evens: "Even", s_odds: "Odd", s_piIdeal: "Ideal: a balance of odd and even.", col_n: "No.",
    n_title: "Life Path Number", n_dob: "Enter your date of birth:", n_your: "YOUR NUMBER", n_lucky: "Lucky Numbers", n_above: "Enter the date above.",
    pl_grp: "Groups", pl_fech: "Wheels", pl_palp: "Picks", pl_conf: "Checker",
    pl_grpT: "Winning Groups", pl_grpS1: "Select the lottery.", pl_grpS2: "The table shows the 20 groups of 3 numbers most often drawn together.", pl_grpS3: "Use them as a base for your bets.", pl_uni: "Range: 01 to {0}", pl_362: "362 draws analysed", c_grp: "Group", c_oc: "Occur.", c_at: "Delay",
    pl_fT: "Wheels", pl_fS1: "Enter {0} to 15 numbers.", pl_fS2: "Choose Best chances of X matches.", pl_fS3: "Click Generate.", pl_fMin: "Min: {0} · Max: 15 numbers", pl_f50: "Up to 50 bets", pl_fNums: "Numbers (min. {0}, max. 15):", pl_chances: "Best chances of:", pl_hits: "matches", pl_bets: "bets", pl_chOf: "Best chances of {0} matches",
    pl_pT: "Ready Picks", pl_pS1: "Choose 5, 10, 15 or 20 games.", pl_pS2: "Click 🔄 for new ones.", pl_pS3: "Each game: {0} numbers from 01 to {1}.", pl_pLim: "5 to 20 games at a time", pl_new: "🔄 New", c_sum: "Sum",
    pl_cT: "Number Checker", pl_cS1: "Click the numbers (min. {0}, max. 15).", pl_cS2: "Click Check to see historical results.", pl_cMin: "Min: {0} · Max: 15", pl_marked: "marked", pl_check: "Check", pl_result: "Result", c_hits: "Matches",
    e_esp: "Special", e_erre: "Miss", e_diam: "Diamonds",
    e_espT: "Special Wheels", e_espS1: "Mark FIXED 🔴 (in every bet).", e_espS2: "Mark VARIABLE 🔵 (they rotate).", e_espS3: "Choose Best chances of X.", e_espS4: "Click Generate.", e_fixed: "Fixed: 1 to {0}", e_var2: "Variable: min. 2", e_totMin: "Total min: {0}", e_fixedL: "🔴 FIXED (min. 1, max. {0}):", e_varL: "🔵 VARIABLE (min. 2):", e_genEsp: "Generate Special", e_fixedN: "fixed", e_varN: "variable", e_total: "Total", e_fixed1: "Fixed", e_var1: "Variable",
    e_erreT: "Miss Wheels", e_erreS1: "Mark numbers you think will NOT come out.", e_erreS2: "Bets generated only from the rest.", e_erreS3: "Inverse logic: eliminate the wrong ones!", e_erMin: "Miss: 5 to {0}", e_restMin: "Remaining min: {0}", e_miss: "Miss:", e_rest: "Remaining:", e_genRest: "Generate from Rest", e_betsNo: "bets without the {0} eliminated", e_more: "🔄 More bets",
    e_diamT: "Diamond Wheels", e_diamS1: "Mark CORE 💎 (in every bet).", e_diamS2: "Mark ORBIT 🔵 (they rotate).", e_diamS3: "Click Generate Diamond.", e_nuc: "Core: 1 to {0}", e_orb2: "Orbit: min. 2", e_nucL: "💎 CORE (1 to {0}):", e_orbL: "🔵 ORBIT (min. 2):", e_cov: "Coverage:", e_genDiam: "Generate Diamond 💎", e_nuc1: "Core", e_orb1: "Orbit",
    sub_plans: "Plans & Pricing", sub_current: "Current:", sub_demo: "Stripe Checkout (Demo)", sub_card: "CARD", sub_valid: "EXPIRY", sub_cvc: "CVC", sub_pay: "Pay", sub_proc: "Processing...", sub_done: "activated!", sub_unlocked: "Features unlocked.", sub_sub: "Subscribe", sub_actual: "Current", sub_incl: "Included", sub_plan: "Plan",
    lock_title: "Section locked", lock_req: "Requires Plan", lock_see: "See plans",
    foot: "LotteryPro © 2026 · Entertainment · 18+", numb: "number", numbs: "numbers",
  },
  es: {
    w_login: "Entrar", w_create: "Crear cuenta", w_tag1: "Resultados reales.", w_tag2: "Estrategias inteligentes.", w_startFree: "Empezar gratis", w_haveAcc: "Ya tengo cuenta",
    l_title: "Entrar", l_sub: "Usa una cuenta demo (contraseña: 123456)", l_demo: "Cuentas demo", l_email: "CORREO", l_pass: "CONTRASEÑA", l_fill: "Rellena todos los campos.", l_invalid: "Credenciales inválidas.", l_noAcc: "¿No tienes cuenta?", l_reg: "Regístrate",
    r_title: "Crear cuenta gratuita", r_sub: "Empieza a ver resultados hoy", r_name: "NOMBRE", r_fill: "Rellena todo.", r_min6: "Contraseña mín. 6 caracteres.", r_create: "Crear cuenta", r_haveAcc: "¿Ya tienes cuenta?", r_enter: "Entra", ph_name: "Tu nombre", ph_mail: "correo@ejemplo.com", ph_p6: "Mín. 6 caracteres",
    nav_res: "Resultados", nav_str: "Estrategia", nav_num: "Numerología", nav_pl: "Planillas", nav_esp: "Especial ⭐", nav_sub: "Suscribirse", btn_out: "Salir",
    h_res: "RESULTADO", h_jack: "Bote:", h_next: "Próximo:",
    howto: "Cómo usar", limits: "Límites", generate: "Generar", back: "Volver", explore: "Explorar",
    s_freq: "Frecuencia", s_delay: "Retraso", s_hot: "Calientes/Fríos", s_pi: "Par/Impar", s_sort: "Ordenar:", s_order: "Orden:", s_nums: "Números", s_qty: "Cant.", s_asc: "Ascendente", s_desc: "Descendente",
    s_freqEx: "Ejemplo: El número 01 salió {0} veces en los sorteos 1 al 362.", s_delayDesc: "Retraso = cuántos sorteos lleva cada número SIN salir.", s_recent: "Reciente", s_med: "Medio", s_late: "Atrasado", s_hotT: "Calientes", s_coldT: "Fríos", s_most: "Top 10 más sorteados", s_least: "Top 10 menos sorteados", s_piT: "Par / Impar — Último Sorteo", s_evens: "Pares", s_odds: "Impares", s_piIdeal: "Ideal: equilibrio entre pares e impares.", col_n: "Núm.",
    n_title: "Número de Vida", n_dob: "Introduce tu fecha de nacimiento:", n_your: "TU NÚMERO", n_lucky: "Números de la Suerte", n_above: "Introduce la fecha arriba.",
    pl_grp: "Grupos", pl_fech: "Combinaciones", pl_palp: "Pronósticos", pl_conf: "Verificador",
    pl_grpT: "Grupos Premiados", pl_grpS1: "Selecciona la lotería.", pl_grpS2: "La tabla muestra los 20 grupos de 3 números que más salieron juntos.", pl_grpS3: "Úsalos como base para tus apuestas.", pl_uni: "Rango: 01 a {0}", pl_362: "362 sorteos analizados", c_grp: "Grupo", c_oc: "Ocurr.", c_at: "Retraso",
    pl_fT: "Combinaciones", pl_fS1: "Escribe {0} a 15 números.", pl_fS2: "Elige Más probabilidades de X aciertos.", pl_fS3: "Haz clic en Generar.", pl_fMin: "Mín: {0} · Máx: 15 números", pl_f50: "Hasta 50 apuestas", pl_fNums: "Números (mín. {0}, máx. 15):", pl_chances: "Más probabilidades de:", pl_hits: "aciertos", pl_bets: "apuestas", pl_chOf: "Más probabilidades de {0} aciertos",
    pl_pT: "Pronósticos Listos", pl_pS1: "Elige 5, 10, 15 o 20 juegos.", pl_pS2: "Haz clic en 🔄 para nuevos.", pl_pS3: "Cada juego: {0} números del 01 al {1}.", pl_pLim: "5 a 20 juegos por vez", pl_new: "🔄 Nuevos", c_sum: "Suma",
    pl_cT: "Verificador de Números", pl_cS1: "Haz clic en los números (mín. {0}, máx. 15).", pl_cS2: "Haz clic en Verificar para ver resultados históricos.", pl_cMin: "Mín: {0} · Máx: 15", pl_marked: "marcados", pl_check: "Verificar", pl_result: "Resultado", c_hits: "Aciertos",
    e_esp: "Especiales", e_erre: "Falla", e_diam: "Diamantes",
    e_espT: "Combinaciones Especiales", e_espS1: "Marca FIJOS 🔴 (en todas las apuestas).", e_espS2: "Marca VARIABLES 🔵 (alternan).", e_espS3: "Elige Más probabilidades de X.", e_espS4: "Haz clic en Generar.", e_fixed: "Fijos: 1 a {0}", e_var2: "Variables: mín. 2", e_totMin: "Total mín: {0}", e_fixedL: "🔴 FIJOS (mín. 1, máx. {0}):", e_varL: "🔵 VARIABLES (mín. 2):", e_genEsp: "Generar Especial", e_fixedN: "fijos", e_varN: "variables", e_total: "Total", e_fixed1: "Fijo", e_var1: "Variable",
    e_erreT: "Combinaciones Falla", e_erreS1: "Marca números que crees que NO saldrán.", e_erreS2: "Apuestas generadas solo con los restantes.", e_erreS3: "Lógica inversa: ¡elimina los erróneos!", e_erMin: "Fallar: 5 a {0}", e_restMin: "Restantes mín: {0}", e_miss: "Fallar:", e_rest: "Restantes:", e_genRest: "Generar con Restantes", e_betsNo: "apuestas sin los {0} eliminados", e_more: "🔄 Más apuestas",
    e_diamT: "Combinaciones Diamante", e_diamS1: "Marca NÚCLEO 💎 (en todas las apuestas).", e_diamS2: "Marca ÓRBITA 🔵 (rotan).", e_diamS3: "Haz clic en Generar Diamante.", e_nuc: "Núcleo: 1 a {0}", e_orb2: "Órbita: mín. 2", e_nucL: "💎 NÚCLEO (1 a {0}):", e_orbL: "🔵 ÓRBITA (mín. 2):", e_cov: "Cobertura:", e_genDiam: "Generar Diamante 💎", e_nuc1: "Núcleo", e_orb1: "Órbita",
    sub_plans: "Planes y Precios", sub_current: "Actual:", sub_demo: "Stripe Checkout (Demo)", sub_card: "TARJETA", sub_valid: "VÁLIDA", sub_cvc: "CVC", sub_pay: "Pagar", sub_proc: "Procesando...", sub_done: "¡activado!", sub_unlocked: "Funciones desbloqueadas.", sub_sub: "Suscribirse", sub_actual: "Actual", sub_incl: "Incluido", sub_plan: "Plan",
    lock_title: "Sección bloqueada", lock_req: "Requiere Plan", lock_see: "Ver planes",
    foot: "LotteryPro © 2026 · Entretenimiento · 18+", numb: "número", numbs: "números",
  },
  fr: {
    w_login: "Se connecter", w_create: "Créer un compte", w_tag1: "Résultats réels.", w_tag2: "Stratégies intelligentes.", w_startFree: "Commencer gratuitement", w_haveAcc: "J'ai déjà un compte",
    l_title: "Se connecter", l_sub: "Utilise un compte démo (mot de passe : 123456)", l_demo: "Comptes démo", l_email: "E-MAIL", l_pass: "MOT DE PASSE", l_fill: "Remplis tous les champs.", l_invalid: "Identifiants invalides.", l_noAcc: "Pas de compte ?", l_reg: "Inscris-toi",
    r_title: "Créer un compte gratuit", r_sub: "Commence à voir les résultats aujourd'hui", r_name: "NOM", r_fill: "Remplis tout.", r_min6: "Mot de passe min. 6 caractères.", r_create: "Créer un compte", r_haveAcc: "Déjà un compte ?", r_enter: "Connecte-toi", ph_name: "Ton nom", ph_mail: "email@exemple.com", ph_p6: "Min. 6 caractères",
    nav_res: "Résultats", nav_str: "Stratégie", nav_num: "Numérologie", nav_pl: "Grilles", nav_esp: "Spécial ⭐", nav_sub: "S'abonner", btn_out: "Sortir",
    h_res: "RÉSULTAT", h_jack: "Jackpot :", h_next: "Prochain :",
    howto: "Comment utiliser", limits: "Limites", generate: "Générer", back: "Retour", explore: "Explorer",
    s_freq: "Fréquence", s_delay: "Retard", s_hot: "Chauds/Froids", s_pi: "Pair/Impair", s_sort: "Trier :", s_order: "Ordre :", s_nums: "Numéros", s_qty: "Qté", s_asc: "Croissant", s_desc: "Décroissant",
    s_freqEx: "Exemple : Le numéro 01 est sorti {0} fois lors des tirages 1 à 362.", s_delayDesc: "Retard = combien de tirages chaque numéro n'est PAS sorti.", s_recent: "Récent", s_med: "Moyen", s_late: "En retard", s_hotT: "Chauds", s_coldT: "Froids", s_most: "Top 10 les plus tirés", s_least: "Top 10 les moins tirés", s_piT: "Pair / Impair — Dernier Tirage", s_evens: "Pairs", s_odds: "Impairs", s_piIdeal: "Idéal : un équilibre entre pairs et impairs.", col_n: "N°",
    n_title: "Chemin de Vie", n_dob: "Saisis ta date de naissance :", n_your: "TON NUMÉRO", n_lucky: "Numéros Chance", n_above: "Saisis la date ci-dessus.",
    pl_grp: "Groupes", pl_fech: "Combinaisons", pl_palp: "Pronostics", pl_conf: "Vérificateur",
    pl_grpT: "Groupes Gagnants", pl_grpS1: "Sélectionne la loterie.", pl_grpS2: "Le tableau montre les 20 groupes de 3 numéros les plus souvent sortis ensemble.", pl_grpS3: "Utilise-les comme base pour tes paris.", pl_uni: "Plage : 01 à {0}", pl_362: "362 tirages analysés", c_grp: "Groupe", c_oc: "Occur.", c_at: "Retard",
    pl_fT: "Combinaisons", pl_fS1: "Saisis {0} à 15 numéros.", pl_fS2: "Choisis Meilleures chances de X bons numéros.", pl_fS3: "Clique sur Générer.", pl_fMin: "Min : {0} · Max : 15 numéros", pl_f50: "Jusqu'à 50 paris", pl_fNums: "Numéros (min. {0}, max. 15) :", pl_chances: "Meilleures chances de :", pl_hits: "bons numéros", pl_bets: "paris", pl_chOf: "Meilleures chances de {0} bons numéros",
    pl_pT: "Pronostics Prêts", pl_pS1: "Choisis 5, 10, 15 ou 20 jeux.", pl_pS2: "Clique 🔄 pour en générer de nouveaux.", pl_pS3: "Chaque jeu : {0} numéros de 01 à {1}.", pl_pLim: "5 à 20 jeux à la fois", pl_new: "🔄 Nouveaux", c_sum: "Somme",
    pl_cT: "Vérificateur de Numéros", pl_cS1: "Clique sur les numéros (min. {0}, max. 15).", pl_cS2: "Clique sur Vérifier pour voir les résultats historiques.", pl_cMin: "Min : {0} · Max : 15", pl_marked: "marqués", pl_check: "Vérifier", pl_result: "Résultat", c_hits: "Bons numéros",
    e_esp: "Spéciaux", e_erre: "Rate", e_diam: "Diamants",
    e_espT: "Combinaisons Spéciales", e_espS1: "Marque les FIXES 🔴 (dans tous les paris).", e_espS2: "Marque les VARIABLES 🔵 (ils alternent).", e_espS3: "Choisis Meilleures chances de X.", e_espS4: "Clique sur Générer.", e_fixed: "Fixes : 1 à {0}", e_var2: "Variables : min. 2", e_totMin: "Total min : {0}", e_fixedL: "🔴 FIXES (min. 1, max. {0}) :", e_varL: "🔵 VARIABLES (min. 2) :", e_genEsp: "Générer Spécial", e_fixedN: "fixes", e_varN: "variables", e_total: "Total", e_fixed1: "Fixe", e_var1: "Variable",
    e_erreT: "Combinaisons Rate", e_erreS1: "Marque les numéros qui ne sortiront PAS selon toi.", e_erreS2: "Paris générés uniquement avec les restants.", e_erreS3: "Logique inverse : élimine les mauvais !", e_erMin: "Rater : 5 à {0}", e_restMin: "Restants min : {0}", e_miss: "Rater :", e_rest: "Restants :", e_genRest: "Générer avec Restants", e_betsNo: "paris sans les {0} éliminés", e_more: "🔄 Plus de paris",
    e_diamT: "Combinaisons Diamant", e_diamS1: "Marque le NOYAU 💎 (dans tous les paris).", e_diamS2: "Marque l'ORBITE 🔵 (ils tournent).", e_diamS3: "Clique sur Générer Diamant.", e_nuc: "Noyau : 1 à {0}", e_orb2: "Orbite : min. 2", e_nucL: "💎 NOYAU (1 à {0}) :", e_orbL: "🔵 ORBITE (min. 2) :", e_cov: "Couverture :", e_genDiam: "Générer Diamant 💎", e_nuc1: "Noyau", e_orb1: "Orbite",
    sub_plans: "Forfaits & Tarifs", sub_current: "Actuel :", sub_demo: "Stripe Checkout (Démo)", sub_card: "CARTE", sub_valid: "EXPIRATION", sub_cvc: "CVC", sub_pay: "Payer", sub_proc: "Traitement...", sub_done: "activé !", sub_unlocked: "Fonctions débloquées.", sub_sub: "S'abonner", sub_actual: "Actuel", sub_incl: "Inclus", sub_plan: "Forfait",
    lock_title: "Section verrouillée", lock_req: "Nécessite le Forfait", lock_see: "Voir les forfaits",
    foot: "LotteryPro © 2026 · Divertissement · 18+", numb: "numéro", numbs: "numéros",
  },
  de: {
    w_login: "Anmelden", w_create: "Konto erstellen", w_tag1: "Echte Ergebnisse.", w_tag2: "Clevere Strategien.", w_startFree: "Kostenlos starten", w_haveAcc: "Ich habe ein Konto",
    l_title: "Anmelden", l_sub: "Nutze ein Demo-Konto (Passwort: 123456)", l_demo: "Demo-Konten", l_email: "E-MAIL", l_pass: "PASSWORT", l_fill: "Fülle alle Felder aus.", l_invalid: "Ungültige Anmeldedaten.", l_noAcc: "Kein Konto?", l_reg: "Registrieren",
    r_title: "Kostenloses Konto erstellen", r_sub: "Sieh ab heute Ergebnisse", r_name: "NAME", r_fill: "Fülle alles aus.", r_min6: "Passwort min. 6 Zeichen.", r_create: "Konto erstellen", r_haveAcc: "Schon ein Konto?", r_enter: "Anmelden", ph_name: "Dein Name", ph_mail: "email@beispiel.com", ph_p6: "Min. 6 Zeichen",
    nav_res: "Ergebnisse", nav_str: "Strategie", nav_num: "Numerologie", nav_pl: "Tabellen", nav_esp: "Spezial ⭐", nav_sub: "Abonnieren", btn_out: "Abmelden",
    h_res: "ERGEBNIS", h_jack: "Jackpot:", h_next: "Nächste:",
    howto: "Anleitung", limits: "Grenzen", generate: "Generieren", back: "Zurück", explore: "Erkunden",
    s_freq: "Häufigkeit", s_delay: "Rückstand", s_hot: "Heiß/Kalt", s_pi: "Gerade/Ungerade", s_sort: "Sortieren:", s_order: "Reihenfolge:", s_nums: "Zahlen", s_qty: "Anz.", s_asc: "Aufsteigend", s_desc: "Absteigend",
    s_freqEx: "Beispiel: Zahl 01 wurde in den Ziehungen 1 bis 362 {0}-mal gezogen.", s_delayDesc: "Rückstand = wie viele Ziehungen jede Zahl NICHT erschienen ist.", s_recent: "Kürzlich", s_med: "Mittel", s_late: "Überfällig", s_hotT: "Heiß", s_coldT: "Kalt", s_most: "Top 10 am häufigsten", s_least: "Top 10 am seltensten", s_piT: "Gerade / Ungerade — Letzte Ziehung", s_evens: "Gerade", s_odds: "Ungerade", s_piIdeal: "Ideal: ein Gleichgewicht aus gerade und ungerade.", col_n: "Nr.",
    n_title: "Lebenszahl", n_dob: "Gib dein Geburtsdatum ein:", n_your: "DEINE ZAHL", n_lucky: "Glückszahlen", n_above: "Gib oben das Datum ein.",
    pl_grp: "Gruppen", pl_fech: "Systeme", pl_palp: "Tipps", pl_conf: "Prüfer",
    pl_grpT: "Gewinngruppen", pl_grpS1: "Wähle die Lotterie.", pl_grpS2: "Die Tabelle zeigt die 20 Gruppen aus 3 Zahlen, die am häufigsten zusammen gezogen wurden.", pl_grpS3: "Nutze sie als Basis für deine Tipps.", pl_uni: "Bereich: 01 bis {0}", pl_362: "362 Ziehungen analysiert", c_grp: "Gruppe", c_oc: "Vork.", c_at: "Rückst.",
    pl_fT: "Systeme", pl_fS1: "Gib {0} bis 15 Zahlen ein.", pl_fS2: "Wähle Höhere Chancen auf X Treffer.", pl_fS3: "Klicke auf Generieren.", pl_fMin: "Min: {0} · Max: 15 Zahlen", pl_f50: "Bis zu 50 Tipps", pl_fNums: "Zahlen (min. {0}, max. 15):", pl_chances: "Höhere Chancen auf:", pl_hits: "Treffer", pl_bets: "Tipps", pl_chOf: "Höhere Chancen auf {0} Treffer",
    pl_pT: "Fertige Tipps", pl_pS1: "Wähle 5, 10, 15 oder 20 Spiele.", pl_pS2: "Klicke 🔄 für neue.", pl_pS3: "Jedes Spiel: {0} Zahlen von 01 bis {1}.", pl_pLim: "5 bis 20 Spiele pro Mal", pl_new: "🔄 Neue", c_sum: "Summe",
    pl_cT: "Zahlenprüfer", pl_cS1: "Klicke die Zahlen an (min. {0}, max. 15).", pl_cS2: "Klicke auf Prüfen für historische Ergebnisse.", pl_cMin: "Min: {0} · Max: 15", pl_marked: "markiert", pl_check: "Prüfen", pl_result: "Ergebnis", c_hits: "Treffer",
    e_esp: "Spezial", e_erre: "Fehl", e_diam: "Diamanten",
    e_espT: "Spezialsysteme", e_espS1: "Markiere FESTE 🔴 (in jedem Tipp).", e_espS2: "Markiere VARIABLE 🔵 (sie wechseln).", e_espS3: "Wähle Höhere Chancen auf X.", e_espS4: "Klicke auf Generieren.", e_fixed: "Feste: 1 bis {0}", e_var2: "Variable: min. 2", e_totMin: "Gesamt min: {0}", e_fixedL: "🔴 FESTE (min. 1, max. {0}):", e_varL: "🔵 VARIABLE (min. 2):", e_genEsp: "Spezial generieren", e_fixedN: "feste", e_varN: "variable", e_total: "Gesamt", e_fixed1: "Fest", e_var1: "Variabel",
    e_erreT: "Fehl-Systeme", e_erreS1: "Markiere Zahlen, die deiner Meinung nach NICHT kommen.", e_erreS2: "Tipps nur aus den übrigen generiert.", e_erreS3: "Umgekehrte Logik: schließe die falschen aus!", e_erMin: "Fehlen: 5 bis {0}", e_restMin: "Übrige min: {0}", e_miss: "Fehlen:", e_rest: "Übrige:", e_genRest: "Aus Übrigen generieren", e_betsNo: "Tipps ohne die {0} ausgeschlossenen", e_more: "🔄 Mehr Tipps",
    e_diamT: "Diamant-Systeme", e_diamS1: "Markiere KERN 💎 (in jedem Tipp).", e_diamS2: "Markiere ORBIT 🔵 (sie rotieren).", e_diamS3: "Klicke auf Diamant generieren.", e_nuc: "Kern: 1 bis {0}", e_orb2: "Orbit: min. 2", e_nucL: "💎 KERN (1 bis {0}):", e_orbL: "🔵 ORBIT (min. 2):", e_cov: "Abdeckung:", e_genDiam: "Diamant generieren 💎", e_nuc1: "Kern", e_orb1: "Orbit",
    sub_plans: "Tarife & Preise", sub_current: "Aktuell:", sub_demo: "Stripe Checkout (Demo)", sub_card: "KARTE", sub_valid: "GÜLTIG BIS", sub_cvc: "CVC", sub_pay: "Bezahlen", sub_proc: "Verarbeitung...", sub_done: "aktiviert!", sub_unlocked: "Funktionen freigeschaltet.", sub_sub: "Abonnieren", sub_actual: "Aktuell", sub_incl: "Enthalten", sub_plan: "Tarif",
    lock_title: "Bereich gesperrt", lock_req: "Erfordert Tarif", lock_see: "Tarife ansehen",
    foot: "LotteryPro © 2026 · Unterhaltung · 18+", numb: "Zahl", numbs: "Zahlen",
  },
  it: {
    w_login: "Accedi", w_create: "Crea account", w_tag1: "Risultati reali.", w_tag2: "Strategie intelligenti.", w_startFree: "Inizia gratis", w_haveAcc: "Ho già un account",
    l_title: "Accedi", l_sub: "Usa un account demo (password: 123456)", l_demo: "Account demo", l_email: "EMAIL", l_pass: "PASSWORD", l_fill: "Compila tutti i campi.", l_invalid: "Credenziali non valide.", l_noAcc: "Non hai un account?", l_reg: "Registrati",
    r_title: "Crea account gratuito", r_sub: "Inizia a vedere i risultati oggi", r_name: "NOME", r_fill: "Compila tutto.", r_min6: "Password min. 6 caratteri.", r_create: "Crea account", r_haveAcc: "Hai già un account?", r_enter: "Accedi", ph_name: "Il tuo nome", ph_mail: "email@esempio.com", ph_p6: "Min. 6 caratteri",
    nav_res: "Risultati", nav_str: "Strategia", nav_num: "Numerologia", nav_pl: "Schede", nav_esp: "Speciale ⭐", nav_sub: "Abbonati", btn_out: "Esci",
    h_res: "RISULTATO", h_jack: "Jackpot:", h_next: "Prossimo:",
    howto: "Come usare", limits: "Limiti", generate: "Genera", back: "Indietro", explore: "Esplora",
    s_freq: "Frequenza", s_delay: "Ritardo", s_hot: "Caldi/Freddi", s_pi: "Pari/Dispari", s_sort: "Ordina:", s_order: "Ordine:", s_nums: "Numeri", s_qty: "Q.tà", s_asc: "Crescente", s_desc: "Decrescente",
    s_freqEx: "Esempio: Il numero 01 è uscito {0} volte nelle estrazioni dalla 1 alla 362.", s_delayDesc: "Ritardo = da quante estrazioni ogni numero NON esce.", s_recent: "Recente", s_med: "Medio", s_late: "In ritardo", s_hotT: "Caldi", s_coldT: "Freddi", s_most: "Top 10 più estratti", s_least: "Top 10 meno estratti", s_piT: "Pari / Dispari — Ultima Estrazione", s_evens: "Pari", s_odds: "Dispari", s_piIdeal: "Ideale: un equilibrio tra pari e dispari.", col_n: "N.",
    n_title: "Numero della Vita", n_dob: "Inserisci la tua data di nascita:", n_your: "IL TUO NUMERO", n_lucky: "Numeri Fortunati", n_above: "Inserisci la data sopra.",
    pl_grp: "Gruppi", pl_fech: "Sistemi", pl_palp: "Pronostici", pl_conf: "Verifica",
    pl_grpT: "Gruppi Vincenti", pl_grpS1: "Seleziona la lotteria.", pl_grpS2: "La tabella mostra i 20 gruppi di 3 numeri usciti più spesso insieme.", pl_grpS3: "Usali come base per le tue giocate.", pl_uni: "Intervallo: 01 a {0}", pl_362: "362 estrazioni analizzate", c_grp: "Gruppo", c_oc: "Occorr.", c_at: "Ritardo",
    pl_fT: "Sistemi", pl_fS1: "Inserisci da {0} a 15 numeri.", pl_fS2: "Scegli Maggiori probabilità di X centri.", pl_fS3: "Clicca Genera.", pl_fMin: "Min: {0} · Max: 15 numeri", pl_f50: "Fino a 50 giocate", pl_fNums: "Numeri (min. {0}, max. 15):", pl_chances: "Maggiori probabilità di:", pl_hits: "centri", pl_bets: "giocate", pl_chOf: "Maggiori probabilità di {0} centri",
    pl_pT: "Pronostici Pronti", pl_pS1: "Scegli 5, 10, 15 o 20 giochi.", pl_pS2: "Clicca 🔄 per nuovi.", pl_pS3: "Ogni gioco: {0} numeri da 01 a {1}.", pl_pLim: "5 a 20 giochi per volta", pl_new: "🔄 Nuovi", c_sum: "Somma",
    pl_cT: "Verifica Numeri", pl_cS1: "Clicca sui numeri (min. {0}, max. 15).", pl_cS2: "Clicca Verifica per vedere i risultati storici.", pl_cMin: "Min: {0} · Max: 15", pl_marked: "segnati", pl_check: "Verifica", pl_result: "Risultato", c_hits: "Centri",
    e_esp: "Speciali", e_erre: "Sbaglia", e_diam: "Diamanti",
    e_espT: "Sistemi Speciali", e_espS1: "Segna i FISSI 🔴 (in tutte le giocate).", e_espS2: "Segna i VARIABILI 🔵 (si alternano).", e_espS3: "Scegli Maggiori probabilità di X.", e_espS4: "Clicca Genera.", e_fixed: "Fissi: 1 a {0}", e_var2: "Variabili: min. 2", e_totMin: "Totale min: {0}", e_fixedL: "🔴 FISSI (min. 1, max. {0}):", e_varL: "🔵 VARIABILI (min. 2):", e_genEsp: "Genera Speciale", e_fixedN: "fissi", e_varN: "variabili", e_total: "Totale", e_fixed1: "Fisso", e_var1: "Variabile",
    e_erreT: "Sistemi Sbaglia", e_erreS1: "Segna i numeri che pensi NON usciranno.", e_erreS2: "Giocate generate solo con i restanti.", e_erreS3: "Logica inversa: elimina quelli sbagliati!", e_erMin: "Sbagliare: 5 a {0}", e_restMin: "Restanti min: {0}", e_miss: "Sbagliare:", e_rest: "Restanti:", e_genRest: "Genera con Restanti", e_betsNo: "giocate senza i {0} eliminati", e_more: "🔄 Altre giocate",
    e_diamT: "Sistemi Diamante", e_diamS1: "Segna il NUCLEO 💎 (in tutte le giocate).", e_diamS2: "Segna l'ORBITA 🔵 (ruotano).", e_diamS3: "Clicca Genera Diamante.", e_nuc: "Nucleo: 1 a {0}", e_orb2: "Orbita: min. 2", e_nucL: "💎 NUCLEO (1 a {0}):", e_orbL: "🔵 ORBITA (min. 2):", e_cov: "Copertura:", e_genDiam: "Genera Diamante 💎", e_nuc1: "Nucleo", e_orb1: "Orbita",
    sub_plans: "Piani e Prezzi", sub_current: "Attuale:", sub_demo: "Stripe Checkout (Demo)", sub_card: "CARTA", sub_valid: "SCADENZA", sub_cvc: "CVC", sub_pay: "Paga", sub_proc: "Elaborazione...", sub_done: "attivato!", sub_unlocked: "Funzioni sbloccate.", sub_sub: "Abbonati", sub_actual: "Attuale", sub_incl: "Incluso", sub_plan: "Piano",
    lock_title: "Sezione bloccata", lock_req: "Richiede il Piano", lock_see: "Vedi i piani",
    foot: "LotteryPro © 2026 · Intrattenimento · 18+", numb: "numero", numbs: "numeri",
  },
};

// Helper de tradução
function detectLang() {
  try {
    const raw = (typeof navigator !== "undefined" && navigator.language ? navigator.language : "en");
    const code = raw.slice(0, 2).toLowerCase();
    return STR[code] ? code : "en";
  } catch (e) { return "en"; }
}
function fmt(s, ...args) { return String(s).replace(/\{(\d+)\}/g, (m, i) => (args[i] !== undefined ? args[i] : m)); }
const I18nContext = createContext(null);
function useT() {
  const ctx = useContext(I18nContext);
  return ctx;
}
function makeT(lang) {
  return function t(k) { return (STR[lang] && STR[lang][k] !== undefined) ? STR[lang][k] : (STR.en[k] !== undefined ? STR.en[k] : k); };
}

// ── Traduções das novas funcionalidades (adicionadas ao STR) ──
Object.assign(STR.pt, { nav_my: "Os meus jogos", cd_title: "Contagem decrescente", cd_to: "para o próximo sorteio", s_trend: "Tendências", tr_desc: "Frequência dos números — os mais e menos sorteados.", my_saved: "Guardados", my_smart: "Gerador esperto", my_ach: "Conquistas", my_savedT: "Jogos guardados", my_empty: "Ainda não tens jogos guardados. Usa o gerador esperto e guarda aqui.", my_del: "Apagar", my_checkAll: "Conferir contra o último resultado", my_match: "acertos", my_genDesc: "Combina números quentes, atrasados e da sorte numa só jogada inteligente.", my_genBtn: "Gerar jogo esperto", my_saveThis: "Guardar este jogo", my_saved_ok: "Jogo guardado!", my_useHot: "Quentes 🔥", my_useDelay: "Atrasados ⏳", my_useLucky: "Sorte ⭐", my_dobLabel: "Data de nascimento (p/ números da sorte):", ach_desc: "Ganha distintivos ao usares o LotteryPro.", ach_b1: "Primeiro jogo", ach_b1d: "Guarda o teu primeiro jogo", ach_b2: "Estratega", ach_b2d: "Usa o gerador esperto", ach_b3: "Numerólogo", ach_b3d: "Descobre o teu número de vida", ach_b4: "Colecionador", ach_b4d: "Guarda 5 jogos", soon: "Em breve", soon_alerts: "Alertas à meia-noite", soon_alertsD: "Notificações quando saem os resultados. Requer servidor ligado.", soon_pool: "Bolões em grupo", soon_poolD: "Joguem juntos e dividam custos e prémios. Requer contas ligadas." });
Object.assign(STR.en, { nav_my: "My games", cd_title: "Countdown", cd_to: "to the next draw", s_trend: "Trends", tr_desc: "Number frequency — the most and least drawn.", my_saved: "Saved", my_smart: "Smart generator", my_ach: "Achievements", my_savedT: "Saved games", my_empty: "No saved games yet. Use the smart generator and save them here.", my_del: "Delete", my_checkAll: "Check against last result", my_match: "matches", my_genDesc: "Combines hot, overdue and lucky numbers into one smart pick.", my_genBtn: "Generate smart pick", my_saveThis: "Save this pick", my_saved_ok: "Pick saved!", my_useHot: "Hot 🔥", my_useDelay: "Overdue ⏳", my_useLucky: "Lucky ⭐", my_dobLabel: "Date of birth (for lucky numbers):", ach_desc: "Earn badges as you use LotteryPro.", ach_b1: "First pick", ach_b1d: "Save your first pick", ach_b2: "Strategist", ach_b2d: "Use the smart generator", ach_b3: "Numerologist", ach_b3d: "Find your life path number", ach_b4: "Collector", ach_b4d: "Save 5 picks", soon: "Coming soon", soon_alerts: "Midnight alerts", soon_alertsD: "Notifications when results are out. Requires a live server.", soon_pool: "Group syndicates", soon_poolD: "Play together and share costs and prizes. Requires linked accounts." });
Object.assign(STR.es, { nav_my: "Mis juegos", cd_title: "Cuenta regresiva", cd_to: "para el próximo sorteo", s_trend: "Tendencias", tr_desc: "Frecuencia de los números — los más y menos sorteados.", my_saved: "Guardados", my_smart: "Generador inteligente", my_ach: "Logros", my_savedT: "Juegos guardados", my_empty: "Aún no tienes juegos guardados. Usa el generador inteligente y guárdalos aquí.", my_del: "Eliminar", my_checkAll: "Verificar con el último resultado", my_match: "aciertos", my_genDesc: "Combina números calientes, atrasados y de la suerte en una jugada inteligente.", my_genBtn: "Generar jugada inteligente", my_saveThis: "Guardar esta jugada", my_saved_ok: "¡Jugada guardada!", my_useHot: "Calientes 🔥", my_useDelay: "Atrasados ⏳", my_useLucky: "Suerte ⭐", my_dobLabel: "Fecha de nacimiento (números de la suerte):", ach_desc: "Gana insignias al usar LotteryPro.", ach_b1: "Primera jugada", ach_b1d: "Guarda tu primera jugada", ach_b2: "Estratega", ach_b2d: "Usa el generador inteligente", ach_b3: "Numerólogo", ach_b3d: "Descubre tu número de vida", ach_b4: "Coleccionista", ach_b4d: "Guarda 5 jugadas", soon: "Próximamente", soon_alerts: "Alertas a medianoche", soon_alertsD: "Notificaciones cuando salen los resultados. Requiere servidor activo.", soon_pool: "Peñas en grupo", soon_poolD: "Jueguen juntos y compartan costes y premios. Requiere cuentas conectadas." });
Object.assign(STR.fr, { nav_my: "Mes jeux", cd_title: "Compte à rebours", cd_to: "avant le prochain tirage", s_trend: "Tendances", tr_desc: "Fréquence des numéros — les plus et moins tirés.", my_saved: "Enregistrés", my_smart: "Générateur malin", my_ach: "Succès", my_savedT: "Jeux enregistrés", my_empty: "Aucun jeu enregistré. Utilise le générateur malin et enregistre-les ici.", my_del: "Supprimer", my_checkAll: "Vérifier avec le dernier résultat", my_match: "bons numéros", my_genDesc: "Combine numéros chauds, en retard et chance en un seul jeu malin.", my_genBtn: "Générer un jeu malin", my_saveThis: "Enregistrer ce jeu", my_saved_ok: "Jeu enregistré !", my_useHot: "Chauds 🔥", my_useDelay: "En retard ⏳", my_useLucky: "Chance ⭐", my_dobLabel: "Date de naissance (numéros chance) :", ach_desc: "Gagne des badges en utilisant LotteryPro.", ach_b1: "Premier jeu", ach_b1d: "Enregistre ton premier jeu", ach_b2: "Stratège", ach_b2d: "Utilise le générateur malin", ach_b3: "Numérologue", ach_b3d: "Trouve ton chemin de vie", ach_b4: "Collectionneur", ach_b4d: "Enregistre 5 jeux", soon: "Bientôt", soon_alerts: "Alertes à minuit", soon_alertsD: "Notifications dès la sortie des résultats. Nécessite un serveur actif.", soon_pool: "Syndicats de groupe", soon_poolD: "Jouez ensemble et partagez frais et gains. Nécessite des comptes liés." });
Object.assign(STR.de, { nav_my: "Meine Spiele", cd_title: "Countdown", cd_to: "bis zur nächsten Ziehung", s_trend: "Trends", tr_desc: "Häufigkeit der Zahlen — am häufigsten und seltensten gezogen.", my_saved: "Gespeichert", my_smart: "Smart-Generator", my_ach: "Erfolge", my_savedT: "Gespeicherte Spiele", my_empty: "Noch keine Spiele gespeichert. Nutze den Smart-Generator und speichere sie hier.", my_del: "Löschen", my_checkAll: "Mit letztem Ergebnis prüfen", my_match: "Treffer", my_genDesc: "Kombiniert heiße, überfällige und Glückszahlen zu einem smarten Tipp.", my_genBtn: "Smarten Tipp generieren", my_saveThis: "Diesen Tipp speichern", my_saved_ok: "Tipp gespeichert!", my_useHot: "Heiß 🔥", my_useDelay: "Überfällig ⏳", my_useLucky: "Glück ⭐", my_dobLabel: "Geburtsdatum (für Glückszahlen):", ach_desc: "Verdiene Abzeichen bei der Nutzung von LotteryPro.", ach_b1: "Erster Tipp", ach_b1d: "Speichere deinen ersten Tipp", ach_b2: "Stratege", ach_b2d: "Nutze den Smart-Generator", ach_b3: "Numerologe", ach_b3d: "Finde deine Lebenszahl", ach_b4: "Sammler", ach_b4d: "Speichere 5 Tipps", soon: "Demnächst", soon_alerts: "Mitternachts-Alarme", soon_alertsD: "Benachrichtigungen, wenn Ergebnisse da sind. Erfordert aktiven Server.", soon_pool: "Gruppen-Tippgemeinschaften", soon_poolD: "Spielt zusammen und teilt Kosten und Gewinne. Erfordert verknüpfte Konten." });
Object.assign(STR.it, { nav_my: "I miei giochi", cd_title: "Conto alla rovescia", cd_to: "alla prossima estrazione", s_trend: "Tendenze", tr_desc: "Frequenza dei numeri — i più e i meno estratti.", my_saved: "Salvati", my_smart: "Generatore smart", my_ach: "Obiettivi", my_savedT: "Giochi salvati", my_empty: "Nessun gioco salvato. Usa il generatore smart e salvali qui.", my_del: "Elimina", my_checkAll: "Verifica con l'ultimo risultato", my_match: "centri", my_genDesc: "Combina numeri caldi, in ritardo e fortunati in una giocata smart.", my_genBtn: "Genera giocata smart", my_saveThis: "Salva questa giocata", my_saved_ok: "Giocata salvata!", my_useHot: "Caldi 🔥", my_useDelay: "In ritardo ⏳", my_useLucky: "Fortuna ⭐", my_dobLabel: "Data di nascita (numeri fortunati):", ach_desc: "Guadagna badge usando LotteryPro.", ach_b1: "Prima giocata", ach_b1d: "Salva la tua prima giocata", ach_b2: "Stratega", ach_b2d: "Usa il generatore smart", ach_b3: "Numerologo", ach_b3d: "Trova il tuo numero della vita", ach_b4: "Collezionista", ach_b4d: "Salva 5 giocate", soon: "Prossimamente", soon_alerts: "Avvisi a mezzanotte", soon_alertsD: "Notifiche quando escono i risultati. Richiede un server attivo.", soon_pool: "Sistemi di gruppo", soon_poolD: "Giocate insieme e dividete costi e premi. Richiede account collegati." });

// ── Traduções do segundo lote de funcionalidades ──
Object.assign(STR.pt, { nav_extra: "Mais", x_share: "Partilhar", x_compare: "Comparador", x_dream: "Sonhos", x_export: "Imprimir", x_responsible: "Jogo Responsável", share_title: "Partilhar jogo", share_desc: "Gera uma jogada e partilha com amigos.", share_btn: "Partilhar", share_copy: "Copiar texto", share_copied: "Copiado!", share_wa: "WhatsApp", share_tg: "Telegram", share_gen: "Gerar jogada para partilhar", cmp_title: "Comparador de loterias", cmp_desc: "Compara prémios e probabilidades para decidires onde jogar.", cmp_lot: "Loteria", cmp_jack: "Jackpot", cmp_odds: "Probabilidade", cmp_pick: "Escolher", cmp_best: "Melhor jackpot", cmp_easiest: "Mais fácil de ganhar", cmp_oddsNote: "Probabilidade de acertar o prémio máximo (1 em X).", dream_title: "Modo Sonhos", dream_desc: "Escreve uma palavra ou sonho e converte em números da sorte.", dream_ph: "Ex: água, viagem, dinheiro...", dream_btn: "Converter em números", dream_your: "Os teus números do sonho", dream_empty: "Escreve algo acima para começar.", exp_title: "Imprimir / exportar jogos", exp_desc: "Cria um cartão com os teus números para guardar ou levar à loja.", exp_none: "Não tens jogos guardados para exportar. Guarda jogos primeiro.", exp_btn: "Descarregar cartão", exp_card: "Cartão de Jogos", exp_gen: "Gerado em", resp_title: "Jogo Responsável", resp_intro: "O LotteryPro é só para entretenimento. Joga com responsabilidade.", resp_age: "Tens de ter 18 anos ou mais para jogar.", resp_tips_t: "Dicas para jogar em segurança", resp_t1: "Define um limite de gastos e não o ultrapasses.", resp_t2: "Nunca jogues dinheiro de que precisas para o essencial.", resp_t3: "Não tentes recuperar perdas jogando mais.", resp_t4: "O jogo não é uma forma de ganhar dinheiro.", resp_help_t: "Precisas de ajuda?", resp_help: "Se o jogo está a causar problemas, procura apoio gratuito e confidencial.", resp_self: "Definir limite pessoal", resp_self_on: "Limite ativo", resp_limit_q: "Limite de jogos guardados por sessão:", resp_save: "Guardar limite" });
Object.assign(STR.en, { nav_extra: "More", x_share: "Share", x_compare: "Compare", x_dream: "Dreams", x_export: "Print", x_responsible: "Responsible Play", share_title: "Share a pick", share_desc: "Generate a pick and share it with friends.", share_btn: "Share", share_copy: "Copy text", share_copied: "Copied!", share_wa: "WhatsApp", share_tg: "Telegram", share_gen: "Generate a pick to share", cmp_title: "Lottery comparison", cmp_desc: "Compare prizes and odds to decide where to play.", cmp_lot: "Lottery", cmp_jack: "Jackpot", cmp_odds: "Odds", cmp_pick: "Choose", cmp_best: "Best jackpot", cmp_easiest: "Easiest to win", cmp_oddsNote: "Odds of hitting the top prize (1 in X).", dream_title: "Dream Mode", dream_desc: "Type a word or dream and turn it into lucky numbers.", dream_ph: "e.g. water, travel, money...", dream_btn: "Convert to numbers", dream_your: "Your dream numbers", dream_empty: "Type something above to start.", exp_title: "Print / export games", exp_desc: "Create a card with your numbers to keep or take to the shop.", exp_none: "No saved games to export. Save some games first.", exp_btn: "Download card", exp_card: "Games Card", exp_gen: "Generated on", resp_title: "Responsible Play", resp_intro: "LotteryPro is for entertainment only. Please play responsibly.", resp_age: "You must be 18 or older to play.", resp_tips_t: "Tips for staying safe", resp_t1: "Set a spending limit and stick to it.", resp_t2: "Never gamble money you need for essentials.", resp_t3: "Don't chase losses by playing more.", resp_t4: "Gambling is not a way to make money.", resp_help_t: "Need help?", resp_help: "If gambling is causing problems, seek free and confidential support.", resp_self: "Set a personal limit", resp_self_on: "Limit active", resp_limit_q: "Saved games limit per session:", resp_save: "Save limit" });
Object.assign(STR.es, { nav_extra: "Más", x_share: "Compartir", x_compare: "Comparar", x_dream: "Sueños", x_export: "Imprimir", x_responsible: "Juego Responsable", share_title: "Compartir jugada", share_desc: "Genera una jugada y compártela con amigos.", share_btn: "Compartir", share_copy: "Copiar texto", share_copied: "¡Copiado!", share_wa: "WhatsApp", share_tg: "Telegram", share_gen: "Generar jugada para compartir", cmp_title: "Comparador de loterías", cmp_desc: "Compara premios y probabilidades para decidir dónde jugar.", cmp_lot: "Lotería", cmp_jack: "Bote", cmp_odds: "Probabilidad", cmp_pick: "Elegir", cmp_best: "Mejor bote", cmp_easiest: "Más fácil de ganar", cmp_oddsNote: "Probabilidad de acertar el premio máximo (1 entre X).", dream_title: "Modo Sueños", dream_desc: "Escribe una palabra o sueño y conviértelo en números de la suerte.", dream_ph: "Ej: agua, viaje, dinero...", dream_btn: "Convertir en números", dream_your: "Tus números del sueño", dream_empty: "Escribe algo arriba para empezar.", exp_title: "Imprimir / exportar juegos", exp_desc: "Crea una tarjeta con tus números para guardar o llevar a la tienda.", exp_none: "No tienes juegos guardados para exportar. Guarda juegos primero.", exp_btn: "Descargar tarjeta", exp_card: "Tarjeta de Juegos", exp_gen: "Generado el", resp_title: "Juego Responsable", resp_intro: "LotteryPro es solo para entretenimiento. Juega con responsabilidad.", resp_age: "Debes tener 18 años o más para jugar.", resp_tips_t: "Consejos para jugar seguro", resp_t1: "Fija un límite de gasto y respétalo.", resp_t2: "Nunca juegues dinero que necesitas para lo esencial.", resp_t3: "No intentes recuperar pérdidas jugando más.", resp_t4: "El juego no es una forma de ganar dinero.", resp_help_t: "¿Necesitas ayuda?", resp_help: "Si el juego causa problemas, busca apoyo gratuito y confidencial.", resp_self: "Definir límite personal", resp_self_on: "Límite activo", resp_limit_q: "Límite de juegos guardados por sesión:", resp_save: "Guardar límite" });
Object.assign(STR.fr, { nav_extra: "Plus", x_share: "Partager", x_compare: "Comparer", x_dream: "Rêves", x_export: "Imprimer", x_responsible: "Jeu Responsable", share_title: "Partager un jeu", share_desc: "Génère un jeu et partage-le avec tes amis.", share_btn: "Partager", share_copy: "Copier le texte", share_copied: "Copié !", share_wa: "WhatsApp", share_tg: "Telegram", share_gen: "Générer un jeu à partager", cmp_title: "Comparateur de loteries", cmp_desc: "Compare gains et probabilités pour décider où jouer.", cmp_lot: "Loterie", cmp_jack: "Jackpot", cmp_odds: "Probabilité", cmp_pick: "Choisir", cmp_best: "Meilleur jackpot", cmp_easiest: "Plus facile à gagner", cmp_oddsNote: "Probabilité de gagner le gros lot (1 sur X).", dream_title: "Mode Rêves", dream_desc: "Écris un mot ou un rêve et transforme-le en numéros chance.", dream_ph: "ex : eau, voyage, argent...", dream_btn: "Convertir en numéros", dream_your: "Tes numéros de rêve", dream_empty: "Écris quelque chose ci-dessus pour commencer.", exp_title: "Imprimer / exporter les jeux", exp_desc: "Crée une carte avec tes numéros à garder ou apporter au magasin.", exp_none: "Aucun jeu enregistré à exporter. Enregistre des jeux d'abord.", exp_btn: "Télécharger la carte", exp_card: "Carte de Jeux", exp_gen: "Généré le", resp_title: "Jeu Responsable", resp_intro: "LotteryPro est uniquement pour le divertissement. Joue de façon responsable.", resp_age: "Tu dois avoir 18 ans ou plus pour jouer.", resp_tips_t: "Conseils pour jouer en sécurité", resp_t1: "Fixe une limite de dépenses et respecte-la.", resp_t2: "Ne joue jamais l'argent nécessaire à l'essentiel.", resp_t3: "Ne cherche pas à récupérer tes pertes en jouant plus.", resp_t4: "Le jeu n'est pas un moyen de gagner de l'argent.", resp_help_t: "Besoin d'aide ?", resp_help: "Si le jeu cause des problèmes, cherche un soutien gratuit et confidentiel.", resp_self: "Définir une limite personnelle", resp_self_on: "Limite active", resp_limit_q: "Limite de jeux enregistrés par session :", resp_save: "Enregistrer la limite" });
Object.assign(STR.de, { nav_extra: "Mehr", x_share: "Teilen", x_compare: "Vergleich", x_dream: "Träume", x_export: "Drucken", x_responsible: "Verantwortung", share_title: "Tipp teilen", share_desc: "Erzeuge einen Tipp und teile ihn mit Freunden.", share_btn: "Teilen", share_copy: "Text kopieren", share_copied: "Kopiert!", share_wa: "WhatsApp", share_tg: "Telegram", share_gen: "Tipp zum Teilen erzeugen", cmp_title: "Lotterie-Vergleich", cmp_desc: "Vergleiche Gewinne und Chancen, um zu entscheiden, wo du spielst.", cmp_lot: "Lotterie", cmp_jack: "Jackpot", cmp_odds: "Chance", cmp_pick: "Wählen", cmp_best: "Bester Jackpot", cmp_easiest: "Am leichtesten zu gewinnen", cmp_oddsNote: "Chance auf den Hauptgewinn (1 zu X).", dream_title: "Traum-Modus", dream_desc: "Tippe ein Wort oder einen Traum und mache Glückszahlen daraus.", dream_ph: "z.B. Wasser, Reise, Geld...", dream_btn: "In Zahlen umwandeln", dream_your: "Deine Traumzahlen", dream_empty: "Tippe oben etwas ein, um zu starten.", exp_title: "Spiele drucken / exportieren", exp_desc: "Erstelle eine Karte mit deinen Zahlen zum Aufbewahren oder Mitnehmen.", exp_none: "Keine gespeicherten Spiele zum Exportieren. Speichere zuerst Spiele.", exp_btn: "Karte herunterladen", exp_card: "Spielkarte", exp_gen: "Erstellt am", resp_title: "Verantwortungsvolles Spielen", resp_intro: "LotteryPro dient nur der Unterhaltung. Bitte spiele verantwortungsvoll.", resp_age: "Du musst 18 Jahre oder älter sein, um zu spielen.", resp_tips_t: "Tipps für sicheres Spielen", resp_t1: "Setze ein Ausgabenlimit und halte dich daran.", resp_t2: "Spiele nie Geld, das du für Wichtiges brauchst.", resp_t3: "Versuche nicht, Verluste durch mehr Spielen zurückzuholen.", resp_t4: "Glücksspiel ist kein Weg, Geld zu verdienen.", resp_help_t: "Brauchst du Hilfe?", resp_help: "Wenn Glücksspiel Probleme verursacht, suche kostenlose, vertrauliche Hilfe.", resp_self: "Persönliches Limit setzen", resp_self_on: "Limit aktiv", resp_limit_q: "Limit gespeicherter Spiele pro Sitzung:", resp_save: "Limit speichern" });
Object.assign(STR.it, { nav_extra: "Altro", x_share: "Condividi", x_compare: "Confronta", x_dream: "Sogni", x_export: "Stampa", x_responsible: "Gioco Responsabile", share_title: "Condividi giocata", share_desc: "Genera una giocata e condividila con gli amici.", share_btn: "Condividi", share_copy: "Copia testo", share_copied: "Copiato!", share_wa: "WhatsApp", share_tg: "Telegram", share_gen: "Genera una giocata da condividere", cmp_title: "Confronto lotterie", cmp_desc: "Confronta premi e probabilità per decidere dove giocare.", cmp_lot: "Lotteria", cmp_jack: "Jackpot", cmp_odds: "Probabilità", cmp_pick: "Scegli", cmp_best: "Miglior jackpot", cmp_easiest: "Più facile da vincere", cmp_oddsNote: "Probabilità di vincere il premio massimo (1 su X).", dream_title: "Modalità Sogni", dream_desc: "Scrivi una parola o un sogno e trasformalo in numeri fortunati.", dream_ph: "es: acqua, viaggio, denaro...", dream_btn: "Converti in numeri", dream_your: "I tuoi numeri del sogno", dream_empty: "Scrivi qualcosa sopra per iniziare.", exp_title: "Stampa / esporta giochi", exp_desc: "Crea una scheda con i tuoi numeri da conservare o portare in negozio.", exp_none: "Nessun gioco salvato da esportare. Salva prima dei giochi.", exp_btn: "Scarica scheda", exp_card: "Scheda Giochi", exp_gen: "Generato il", resp_title: "Gioco Responsabile", resp_intro: "LotteryPro è solo per intrattenimento. Gioca responsabilmente.", resp_age: "Devi avere almeno 18 anni per giocare.", resp_tips_t: "Consigli per giocare in sicurezza", resp_t1: "Imposta un limite di spesa e rispettalo.", resp_t2: "Non giocare mai denaro che ti serve per l'essenziale.", resp_t3: "Non rincorrere le perdite giocando di più.", resp_t4: "Il gioco non è un modo per fare soldi.", resp_help_t: "Hai bisogno di aiuto?", resp_help: "Se il gioco causa problemi, cerca supporto gratuito e riservato.", resp_self: "Imposta un limite personale", resp_self_on: "Limite attivo", resp_limit_q: "Limite di giochi salvati per sessione:", resp_save: "Salva limite" });

// ── Limite aumentado para 1000 + aviso ──
Object.assign(STR.pt, { pl_f50: "Até 1000 apostas", cap_note: "A mostrar {0} de {1} combinações possíveis." });
Object.assign(STR.en, { pl_f50: "Up to 1000 bets", cap_note: "Showing {0} of {1} possible combinations." });
Object.assign(STR.es, { pl_f50: "Hasta 1000 apuestas", cap_note: "Mostrando {0} de {1} combinaciones posibles." });
Object.assign(STR.fr, { pl_f50: "Jusqu'à 1000 paris", cap_note: "Affichage de {0} sur {1} combinaisons possibles." });
Object.assign(STR.de, { pl_f50: "Bis zu 1000 Tipps", cap_note: "{0} von {1} möglichen Kombinationen werden angezeigt." });
Object.assign(STR.it, { pl_f50: "Fino a 1000 giocate", cap_note: "Mostrando {0} di {1} combinazioni possibili." });

// ── Traduções do 3º lote de funcionalidades ──
Object.assign(STR.pt, { calc_tab: "Vale a pena?", calc_title: "Calculadora — vale a pena?", calc_desc: "Vê de forma honesta quanto gastas por ano e as probabilidades reais.", calc_week: "Quanto gastas por semana?", calc_perDraw: "Por sorteio", calc_year: "Por ano", calc_odds: "Probabilidade de jackpot", calc_oddsV: "1 em {0}", calc_note: "Jogar é entretenimento, não um investimento. Joga com responsabilidade.", calc_draws: "sorteios/ano", chk_tab: "Verificar bilhete", chk_title: "Verificador rápido", chk_desc: "Insere os teus números e vê se acertaste no último resultado.", chk_your: "Os teus números:", chk_btn: "Verificar", chk_hits: "acertos", chk_none: "Marca os teus números acima.", chk_win: "Parabéns! Tens {0} acertos!", chk_noWin: "Tens {0} acertos desta vez.", unclaimed_tab: "Prémios", unclaimed_title: "Prémios não reclamados", unclaimed_desc: "Prémios que ainda não foram levantados — pode ser teu!", unclaimed_region: "Região", unclaimed_value: "Valor", unclaimed_deadline: "Prazo", unclaimed_note: "Exemplos ilustrativos. Verifica sempre no site oficial.", hist_tab: "Histórico", hist_title: "O meu histórico", hist_desc: "Os teus jogos guardados ao longo do tempo.", hist_total: "Total de jogos", hist_best: "Melhor resultado", hist_avg: "Média de acertos", hist_none: "Ainda não tens histórico. Guarda jogos em \"Os meus jogos\".", faq_tab: "FAQ", faq_title: "Perguntas frequentes", faq_desc: "Tudo o que precisas de saber, explicado de forma simples.", theme_light: "Claro", theme_dark: "Escuro", glossary_title: "Glossário", samenum_tab: "Mesmo número", samenum_title: "Onde joga o meu número?", samenum_desc: "Vê em que loterias o teu número tem saído mais.", samenum_pick: "Escolhe um número:", samenum_result: "Frequência por loteria" });
Object.assign(STR.en, { calc_tab: "Worth it?", calc_title: "Calculator — is it worth it?", calc_desc: "See honestly how much you spend per year and the real odds.", calc_week: "How much do you spend per week?", calc_perDraw: "Per draw", calc_year: "Per year", calc_odds: "Jackpot odds", calc_oddsV: "1 in {0}", calc_note: "Playing is entertainment, not an investment. Please play responsibly.", calc_draws: "draws/year", chk_tab: "Check ticket", chk_title: "Quick checker", chk_desc: "Enter your numbers and see if you matched the latest result.", chk_your: "Your numbers:", chk_btn: "Check", chk_hits: "matches", chk_none: "Mark your numbers above.", chk_win: "Congratulations! You have {0} matches!", chk_noWin: "You have {0} matches this time.", unclaimed_tab: "Prizes", unclaimed_title: "Unclaimed prizes", unclaimed_desc: "Prizes not yet collected — it could be yours!", unclaimed_region: "Region", unclaimed_value: "Value", unclaimed_deadline: "Deadline", unclaimed_note: "Illustrative examples. Always check the official site.", hist_tab: "History", hist_title: "My history", hist_desc: "Your saved games over time.", hist_total: "Total games", hist_best: "Best result", hist_avg: "Average matches", hist_none: "No history yet. Save games in \"My games\".", faq_tab: "FAQ", faq_title: "Frequently asked questions", faq_desc: "Everything you need to know, explained simply.", theme_light: "Light", theme_dark: "Dark", glossary_title: "Glossary", samenum_tab: "Same number", samenum_title: "Where does my number play?", samenum_desc: "See which lotteries your number is drawn most in.", samenum_pick: "Choose a number:", samenum_result: "Frequency per lottery" });
Object.assign(STR.es, { calc_tab: "¿Merece la pena?", calc_title: "Calculadora — ¿merece la pena?", calc_desc: "Mira con honestidad cuánto gastas al año y las probabilidades reales.", calc_week: "¿Cuánto gastas por semana?", calc_perDraw: "Por sorteo", calc_year: "Por año", calc_odds: "Probabilidad de bote", calc_oddsV: "1 entre {0}", calc_note: "Jugar es entretenimiento, no una inversión. Juega con responsabilidad.", calc_draws: "sorteos/año", chk_tab: "Verificar boleto", chk_title: "Verificador rápido", chk_desc: "Introduce tus números y mira si acertaste en el último resultado.", chk_your: "Tus números:", chk_btn: "Verificar", chk_hits: "aciertos", chk_none: "Marca tus números arriba.", chk_win: "¡Enhorabuena! ¡Tienes {0} aciertos!", chk_noWin: "Tienes {0} aciertos esta vez.", unclaimed_tab: "Premios", unclaimed_title: "Premios no reclamados", unclaimed_desc: "Premios aún no cobrados — ¡puede ser tuyo!", unclaimed_region: "Región", unclaimed_value: "Valor", unclaimed_deadline: "Plazo", unclaimed_note: "Ejemplos ilustrativos. Verifica siempre en el sitio oficial.", hist_tab: "Historial", hist_title: "Mi historial", hist_desc: "Tus juegos guardados a lo largo del tiempo.", hist_total: "Total de juegos", hist_best: "Mejor resultado", hist_avg: "Media de aciertos", hist_none: "Aún no tienes historial. Guarda juegos en \"Mis juegos\".", faq_tab: "FAQ", faq_title: "Preguntas frecuentes", faq_desc: "Todo lo que necesitas saber, explicado de forma sencilla.", theme_light: "Claro", theme_dark: "Oscuro", glossary_title: "Glosario", samenum_tab: "Mismo número", samenum_title: "¿Dónde juega mi número?", samenum_desc: "Mira en qué loterías sale más tu número.", samenum_pick: "Elige un número:", samenum_result: "Frecuencia por lotería" });
Object.assign(STR.fr, { calc_tab: "Ça vaut le coup ?", calc_title: "Calculatrice — ça vaut le coup ?", calc_desc: "Vois honnêtement combien tu dépenses par an et les vraies probabilités.", calc_week: "Combien dépenses-tu par semaine ?", calc_perDraw: "Par tirage", calc_year: "Par an", calc_odds: "Probabilité de jackpot", calc_oddsV: "1 sur {0}", calc_note: "Jouer est un divertissement, pas un investissement. Joue de façon responsable.", calc_draws: "tirages/an", chk_tab: "Vérifier billet", chk_title: "Vérificateur rapide", chk_desc: "Saisis tes numéros et vois si tu as gagné au dernier tirage.", chk_your: "Tes numéros :", chk_btn: "Vérifier", chk_hits: "bons numéros", chk_none: "Marque tes numéros ci-dessus.", chk_win: "Félicitations ! Tu as {0} bons numéros !", chk_noWin: "Tu as {0} bons numéros cette fois.", unclaimed_tab: "Gains", unclaimed_title: "Gains non réclamés", unclaimed_desc: "Gains pas encore récupérés — ça pourrait être le tien !", unclaimed_region: "Région", unclaimed_value: "Valeur", unclaimed_deadline: "Échéance", unclaimed_note: "Exemples illustratifs. Vérifie toujours sur le site officiel.", hist_tab: "Historique", hist_title: "Mon historique", hist_desc: "Tes jeux enregistrés au fil du temps.", hist_total: "Total de jeux", hist_best: "Meilleur résultat", hist_avg: "Moyenne de bons numéros", hist_none: "Pas encore d'historique. Enregistre des jeux dans \"Mes jeux\".", faq_tab: "FAQ", faq_title: "Questions fréquentes", faq_desc: "Tout ce que tu dois savoir, expliqué simplement.", theme_light: "Clair", theme_dark: "Sombre", glossary_title: "Glossaire", samenum_tab: "Même numéro", samenum_title: "Où joue mon numéro ?", samenum_desc: "Vois dans quelles loteries ton numéro sort le plus.", samenum_pick: "Choisis un numéro :", samenum_result: "Fréquence par loterie" });
Object.assign(STR.de, { calc_tab: "Lohnt es sich?", calc_title: "Rechner — lohnt es sich?", calc_desc: "Sieh ehrlich, wie viel du pro Jahr ausgibst und die echten Chancen.", calc_week: "Wie viel gibst du pro Woche aus?", calc_perDraw: "Pro Ziehung", calc_year: "Pro Jahr", calc_odds: "Jackpot-Chance", calc_oddsV: "1 zu {0}", calc_note: "Spielen ist Unterhaltung, keine Geldanlage. Bitte spiele verantwortungsvoll.", calc_draws: "Ziehungen/Jahr", chk_tab: "Schein prüfen", chk_title: "Schnellprüfer", chk_desc: "Gib deine Zahlen ein und sieh, ob du im letzten Ergebnis getroffen hast.", chk_your: "Deine Zahlen:", chk_btn: "Prüfen", chk_hits: "Treffer", chk_none: "Markiere oben deine Zahlen.", chk_win: "Glückwunsch! Du hast {0} Treffer!", chk_noWin: "Du hast diesmal {0} Treffer.", unclaimed_tab: "Gewinne", unclaimed_title: "Nicht abgeholte Gewinne", unclaimed_desc: "Noch nicht abgeholte Gewinne — es könnte deiner sein!", unclaimed_region: "Region", unclaimed_value: "Wert", unclaimed_deadline: "Frist", unclaimed_note: "Beispielhafte Angaben. Prüfe immer die offizielle Seite.", hist_tab: "Verlauf", hist_title: "Mein Verlauf", hist_desc: "Deine gespeicherten Spiele im Zeitverlauf.", hist_total: "Spiele gesamt", hist_best: "Bestes Ergebnis", hist_avg: "Durchschnittliche Treffer", hist_none: "Noch kein Verlauf. Speichere Spiele unter \"Meine Spiele\".", faq_tab: "FAQ", faq_title: "Häufige Fragen", faq_desc: "Alles, was du wissen musst, einfach erklärt.", theme_light: "Hell", theme_dark: "Dunkel", glossary_title: "Glossar", samenum_tab: "Gleiche Zahl", samenum_title: "Wo spielt meine Zahl?", samenum_desc: "Sieh, in welchen Lotterien deine Zahl am häufigsten gezogen wird.", samenum_pick: "Wähle eine Zahl:", samenum_result: "Häufigkeit pro Lotterie" });
Object.assign(STR.it, { calc_tab: "Ne vale la pena?", calc_title: "Calcolatrice — ne vale la pena?", calc_desc: "Scopri onestamente quanto spendi all'anno e le probabilità reali.", calc_week: "Quanto spendi a settimana?", calc_perDraw: "Per estrazione", calc_year: "All'anno", calc_odds: "Probabilità jackpot", calc_oddsV: "1 su {0}", calc_note: "Giocare è intrattenimento, non un investimento. Gioca responsabilmente.", calc_draws: "estrazioni/anno", chk_tab: "Verifica giocata", chk_title: "Verifica rapida", chk_desc: "Inserisci i tuoi numeri e vedi se hai vinto all'ultima estrazione.", chk_your: "I tuoi numeri:", chk_btn: "Verifica", chk_hits: "centri", chk_none: "Segna i tuoi numeri sopra.", chk_win: "Congratulazioni! Hai {0} centri!", chk_noWin: "Hai {0} centri questa volta.", unclaimed_tab: "Premi", unclaimed_title: "Premi non riscossi", unclaimed_desc: "Premi non ancora ritirati — potrebbe essere tuo!", unclaimed_region: "Regione", unclaimed_value: "Valore", unclaimed_deadline: "Scadenza", unclaimed_note: "Esempi illustrativi. Verifica sempre sul sito ufficiale.", hist_tab: "Storico", hist_title: "Il mio storico", hist_desc: "Le tue giocate salvate nel tempo.", hist_total: "Giochi totali", hist_best: "Miglior risultato", hist_avg: "Media centri", hist_none: "Ancora nessuno storico. Salva giochi in \"I miei giochi\".", faq_tab: "FAQ", faq_title: "Domande frequenti", faq_desc: "Tutto ciò che devi sapere, spiegato semplicemente.", theme_light: "Chiaro", theme_dark: "Scuro", glossary_title: "Glossario", samenum_tab: "Stesso numero", samenum_title: "Dove gioca il mio numero?", samenum_desc: "Vedi in quali lotterie il tuo numero esce di più.", samenum_pick: "Scegli un numero:", samenum_result: "Frequenza per lotteria" });

// ── FAQ + Glossário (6 idiomas) ──
Object.assign(STR.pt, { faq_q1: "Os números são aleatórios?", faq_a1: "Sim. Cada sorteio é independente e totalmente aleatório. Nenhuma estratégia garante prémios.", faq_q2: "As estatísticas ajudam a ganhar?", faq_a2: "Ajudam a escolher de forma informada e divertida, mas não alteram as probabilidades reais.", faq_q3: "Os resultados são oficiais?", faq_a3: "Mostramos resultados para tua conveniência. Confirma sempre no site oficial da loteria.", faq_q4: "Como funciona a subscrição?", faq_a4: "Desbloqueia ferramentas extra. Podes cancelar quando quiseres.", gl1t: "Rollover", gl1d: "Quando ninguém ganha o jackpot e o valor passa para o sorteio seguinte.", gl2t: "Sistema / Fechamento", gl2d: "Jogar mais números numa combinação para cobrir mais hipóteses.", gl3t: "Bónus", gl3d: "Número extra sorteado que aumenta prémios em alguns escalões.", gl4t: "Jackpot", gl4d: "O prémio máximo, ganho ao acertar todos os números." });
Object.assign(STR.en, { faq_q1: "Are the numbers random?", faq_a1: "Yes. Every draw is independent and fully random. No strategy guarantees prizes.", faq_q2: "Do stats help me win?", faq_a2: "They help you choose in an informed, fun way, but don't change the real odds.", faq_q3: "Are the results official?", faq_a3: "We show results for your convenience. Always confirm on the official lottery site.", faq_q4: "How does the subscription work?", faq_a4: "It unlocks extra tools. You can cancel any time.", gl1t: "Rollover", gl1d: "When nobody wins the jackpot and it rolls over to the next draw.", gl2t: "Wheel / System", gl2d: "Playing more numbers across combinations to cover more possibilities.", gl3t: "Bonus", gl3d: "An extra drawn number that boosts prizes in some tiers.", gl4t: "Jackpot", gl4d: "The top prize, won by matching all the numbers." });
Object.assign(STR.es, { faq_q1: "¿Los números son aleatorios?", faq_a1: "Sí. Cada sorteo es independiente y totalmente aleatorio. Ninguna estrategia garantiza premios.", faq_q2: "¿Las estadísticas ayudan a ganar?", faq_a2: "Ayudan a elegir de forma informada y divertida, pero no cambian las probabilidades reales.", faq_q3: "¿Los resultados son oficiales?", faq_a3: "Mostramos resultados para tu comodidad. Confirma siempre en el sitio oficial de la lotería.", faq_q4: "¿Cómo funciona la suscripción?", faq_a4: "Desbloquea herramientas extra. Puedes cancelar cuando quieras.", gl1t: "Rollover", gl1d: "Cuando nadie gana el bote y pasa al siguiente sorteo.", gl2t: "Sistema / Combinación", gl2d: "Jugar más números en combinaciones para cubrir más posibilidades.", gl3t: "Bonus", gl3d: "Número extra sorteado que aumenta premios en algunas categorías.", gl4t: "Bote", gl4d: "El premio máximo, ganado al acertar todos los números." });
Object.assign(STR.fr, { faq_q1: "Les numéros sont-ils aléatoires ?", faq_a1: "Oui. Chaque tirage est indépendant et totalement aléatoire. Aucune stratégie ne garantit de gains.", faq_q2: "Les stats aident-elles à gagner ?", faq_a2: "Elles aident à choisir de façon informée et ludique, mais ne changent pas les vraies probabilités.", faq_q3: "Les résultats sont-ils officiels ?", faq_a3: "Nous affichons les résultats pour ta commodité. Vérifie toujours sur le site officiel.", faq_q4: "Comment fonctionne l'abonnement ?", faq_a4: "Il débloque des outils supplémentaires. Tu peux annuler à tout moment.", gl1t: "Rollover", gl1d: "Quand personne ne gagne le jackpot et qu'il passe au tirage suivant.", gl2t: "Système / Combinaison", gl2d: "Jouer plus de numéros en combinaisons pour couvrir plus de possibilités.", gl3t: "Bonus", gl3d: "Numéro supplémentaire tiré qui augmente les gains dans certains rangs.", gl4t: "Jackpot", gl4d: "Le gros lot, gagné en trouvant tous les numéros." });
Object.assign(STR.de, { faq_q1: "Sind die Zahlen zufällig?", faq_a1: "Ja. Jede Ziehung ist unabhängig und völlig zufällig. Keine Strategie garantiert Gewinne.", faq_q2: "Helfen Statistiken beim Gewinnen?", faq_a2: "Sie helfen, informiert und mit Spaß zu wählen, ändern aber nicht die echten Chancen.", faq_q3: "Sind die Ergebnisse offiziell?", faq_a3: "Wir zeigen Ergebnisse zur Bequemlichkeit. Prüfe immer die offizielle Lotterie-Seite.", faq_q4: "Wie funktioniert das Abo?", faq_a4: "Es schaltet Extra-Werkzeuge frei. Du kannst jederzeit kündigen.", gl1t: "Rollover", gl1d: "Wenn niemand den Jackpot gewinnt und er in die nächste Ziehung übergeht.", gl2t: "System / Vollsystem", gl2d: "Mehr Zahlen in Kombinationen spielen, um mehr Möglichkeiten abzudecken.", gl3t: "Bonus", gl3d: "Eine zusätzlich gezogene Zahl, die Gewinne in einigen Klassen erhöht.", gl4t: "Jackpot", gl4d: "Der Hauptgewinn, erzielt durch Treffen aller Zahlen." });
Object.assign(STR.it, { faq_q1: "I numeri sono casuali?", faq_a1: "Sì. Ogni estrazione è indipendente e totalmente casuale. Nessuna strategia garantisce premi.", faq_q2: "Le statistiche aiutano a vincere?", faq_a2: "Aiutano a scegliere in modo informato e divertente, ma non cambiano le probabilità reali.", faq_q3: "I risultati sono ufficiali?", faq_a3: "Mostriamo i risultati per tua comodità. Verifica sempre sul sito ufficiale della lotteria.", faq_q4: "Come funziona l'abbonamento?", faq_a4: "Sblocca strumenti extra. Puoi annullare quando vuoi.", gl1t: "Rollover", gl1d: "Quando nessuno vince il jackpot e passa all'estrazione successiva.", gl2t: "Sistema / Sviluppo", gl2d: "Giocare più numeri in combinazioni per coprire più possibilità.", gl3t: "Bonus", gl3d: "Numero extra estratto che aumenta i premi in alcune categorie.", gl4t: "Jackpot", gl4d: "Il premio massimo, vinto indovinando tutti i numeri." });
Object.assign(STR.pt, { real_window: "dados reais · últimos {0} sorteios", illus_note: "valores ilustrativos" });
Object.assign(STR.en, { real_window: "real data · last {0} draws", illus_note: "illustrative values" });
Object.assign(STR.es, { real_window: "datos reales · últimos {0} sorteos", illus_note: "valores ilustrativos" });
Object.assign(STR.fr, { real_window: "données réelles · {0} derniers tirages", illus_note: "valeurs illustratives" });
Object.assign(STR.de, { real_window: "echte Daten · letzte {0} Ziehungen", illus_note: "illustrative Werte" });
Object.assign(STR.it, { real_window: "dati reali · ultime {0} estrazioni", illus_note: "valori illustrativi" });
Object.assign(STR.pt, { r_check: "Conta criada! Confirma o teu email para entrares." });
Object.assign(STR.en, { r_check: "Account created! Check your email to sign in." });
Object.assign(STR.es, { r_check: "¡Cuenta creada! Confirma tu email para entrar." });
Object.assign(STR.fr, { r_check: "Compte créé ! Confirme ton email pour entrer." });
Object.assign(STR.de, { r_check: "Konto erstellt! Bestätige deine E-Mail zum Anmelden." });
Object.assign(STR.it, { r_check: "Account creato! Conferma la tua email per entrare." });

// ═══════════════════════════════════════════════════════════════
// LIGAÇÃO ÀS CONTAS / BASE DE DADOS (Supabase)
// (a chave "anon" é pública e segura para ir aqui no site)
// ═══════════════════════════════════════════════════════════════
const SUPABASE_URL = "https://kxceixsocsqyrigqvols.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4Y2VpeHNvY3NxeXJpZ3F2b2xzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5NjI0NzAsImV4cCI6MjA5NzUzODQ3MH0.Nn6dI3KQGokMDIcjlBI2K6bvTD6g0CKFK63lO2skJ8c";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

// ═══════════════════════════════════════════════════════════════
// DADOS DAS LOTERIAS & HELPERS
// ═══════════════════════════════════════════════════════════════
const LOTS = [
  { id: "lotto", nome: "UK Lotto", short: "UK Lotto", flag: "🇬🇧", cor: "#FFD700", tc: "#1a1a1a", max: 59, bolas: 6, nums: [7, 14, 21, 35, 42, 49], extra: [11], el: "Bónus", jack: "£8,400,000", next: "Sáb 14 Jun" },
  { id: "euromillions", nome: "EuroMillions", short: "EuroMillions", flag: "🇪🇺", cor: "#1a56db", tc: "#fff", max: 50, bolas: 5, nums: [3, 17, 28, 36, 44], extra: [2, 8], el: "Estrelas", jack: "€47,000,000", next: "Ter 17 Jun" },
  { id: "eurojackpot", nome: "EuroJackpot", short: "EuroJackpot", flag: "🇪🇺", cor: "#dc2626", tc: "#fff", max: 50, bolas: 5, nums: [5, 12, 23, 38, 46], extra: [4, 9], el: "Euro Núm.", jack: "€120,000,000", next: "Sex 20 Jun" },
  { id: "thunderball", nome: "Thunderball", short: "Thunderball", flag: "🇬🇧", cor: "#ea580c", tc: "#fff", max: 39, bolas: 5, nums: [4, 9, 18, 27, 33], extra: [11], el: "Thunderball", jack: "£500,000", next: "Qua 18 Jun" },
  { id: "setforlife", nome: "Set for Life", short: "Set Life", flag: "🇬🇧", cor: "#16a34a", tc: "#fff", max: 47, bolas: 5, nums: [5, 12, 28, 39, 45], extra: [7], el: "Life Ball", jack: "£10.000/mês", next: "Seg 16 Jun" },
  { id: "health", nome: "Health Lottery", short: "Health", flag: "🇬🇧", cor: "#0ea5e9", tc: "#fff", max: 50, bolas: 5, nums: [8, 19, 27, 38, 44], extra: [12], el: "Health Ball", jack: "£100,000", next: "Sáb 14 Jun" },
  { id: "ielotto", nome: "Irish Lotto", short: "IE Lotto", flag: "🇮🇪", cor: "#009A49", tc: "#fff", max: 47, bolas: 6, nums: [4, 15, 22, 31, 38, 46], extra: [9], el: "Bónus", jack: "€5,500,000", next: "Sáb 14 Jun" },
  { id: "ielottoplus1", nome: "Irish Lotto Plus 1", short: "IE Plus 1", flag: "🇮🇪", cor: "#15803d", tc: "#fff", max: 47, bolas: 6, nums: [2, 11, 19, 28, 33, 44], extra: [7], el: "Bónus", jack: "€1,000,000", next: "Sáb 14 Jun" },
  { id: "ielottoplus2", nome: "Irish Lotto Plus 2", short: "IE Plus 2", flag: "🇮🇪", cor: "#4d7c0f", tc: "#fff", max: 47, bolas: 6, nums: [6, 14, 23, 29, 37, 41], extra: [18], el: "Bónus", jack: "€250,000", next: "Sáb 14 Jun" },
  { id: "eurodreams", nome: "EuroDreams", short: "EuroDreams", flag: "🇮🇪", cor: "#7c3aed", tc: "#fff", max: 40, bolas: 6, nums: [3, 11, 18, 24, 31, 39], extra: [3], el: "Nº Sonho", jack: "€20.000/mês", next: "Seg 16 Jun" },
  { id: "dailymillion", nome: "Daily Million", short: "Daily M.", flag: "🇮🇪", cor: "#0891b2", tc: "#fff", max: 39, bolas: 6, nums: [5, 12, 19, 26, 33, 38], extra: [14], el: "Bónus", jack: "€1,000,000", next: "Diário 14h" },
  { id: "dailymillionplus", nome: "Daily Million Plus", short: "Daily M.+", flag: "🇮🇪", cor: "#0e7490", tc: "#fff", max: 39, bolas: 6, nums: [7, 15, 21, 28, 34, 39], extra: [3], el: "Bónus", jack: "€500,000", next: "Diário 14h" },
  { id: "lotto6aus49", nome: "Lotto 6aus49", short: "6aus49", flag: "🇩🇪", cor: "#d97706", tc: "#1a1a1a", max: 49, bolas: 6, nums: [9, 16, 23, 31, 38, 45], extra: [7], el: "Superzahl", jack: "€8,000,000", next: "Qua 18 Jun" },
  { id: "superenalotto", nome: "SuperEnalotto", short: "SuperEna", flag: "🇮🇹", cor: "#ef4444", tc: "#fff", max: 90, bolas: 6, nums: [14, 28, 41, 55, 69, 82], extra: [33], el: "Jolly", jack: "€50,000,000", next: "Ter 17 Jun" },
  { id: "millionday", nome: "MillionDay", short: "MillionD.", flag: "🇮🇹", cor: "#f59e0b", tc: "#1a1a1a", max: 55, bolas: 5, nums: [9, 18, 27, 36, 49], extra: [], el: "", jack: "€1,000,000", next: "Diário 20h30" },
  { id: "vincicasa", nome: "VinciCasa", short: "VinciCasa", flag: "🇮🇹", cor: "#ca8a04", tc: "#1a1a1a", max: 40, bolas: 5, nums: [1, 8, 15, 28, 35], extra: [], el: "", jack: "€500,000 + casa", next: "Diário 20h" },
  { id: "sivincetutto", nome: "SiVinceTutto", short: "SiVinceT.", flag: "🇮🇹", cor: "#65a30d", tc: "#fff", max: 90, bolas: 6, nums: [3, 37, 38, 59, 67, 80], extra: [], el: "", jack: "€1,000,000+", next: "Qua 18 Jun" },
  { id: "frloto", nome: "Loto (França)", short: "FR Loto", flag: "🇫🇷", cor: "#2563eb", tc: "#fff", max: 49, bolas: 5, nums: [5, 12, 23, 34, 45], extra: [7], el: "Nº Sorte", jack: "€3,000,000", next: "Seg 16 Jun" },
  { id: "laprimitiva", nome: "La Primitiva", short: "Primitiva", flag: "🇪🇸", cor: "#e11d48", tc: "#fff", max: 49, bolas: 6, nums: [4, 15, 22, 31, 38, 47], extra: [9], el: "Complem.", jack: "€8,000,000", next: "Qui 19 Jun" },
  { id: "elgordo", nome: "El Gordo", short: "El Gordo", flag: "🇪🇸", cor: "#be123c", tc: "#fff", max: 54, bolas: 5, nums: [8, 19, 27, 38, 49], extra: [3], el: "Nº Chave", jack: "€10,000,000", next: "Dom 15 Jun" },
  { id: "bonoloto", nome: "Bonoloto", short: "Bonoloto", flag: "🇪🇸", cor: "#db2777", tc: "#fff", max: 49, bolas: 6, nums: [2, 11, 20, 29, 38, 46], extra: [15], el: "Complem.", jack: "€600,000", next: "Diário 21h30" },
];
const HOT = { lotto: [7, 23, 14, 42, 38, 3, 17, 45, 11, 29], euromillions: [17, 44, 20, 6, 23, 50, 1, 38, 11, 28], eurojackpot: [19, 29, 37, 47, 3, 22, 41, 8, 33, 15], thunderball: [9, 22, 14, 31, 5, 18, 37, 3, 27, 11] };
const COLD = { lotto: [57, 49, 8, 34, 26, 53, 19, 43, 6, 31], euromillions: [39, 46, 14, 8, 30, 42, 19, 25, 47, 33], eurojackpot: [45, 13, 26, 50, 7, 39, 20, 44, 11, 35], thunderball: [35, 20, 7, 28, 13, 4, 24, 16, 30, 8] };
// Para as loterias sem HOT/COLD definidos, geramos uma lista (determinística) para nunca rebentar.
function genPool(seed, max, n) {
  const out = []; let g = 0;
  while (out.length < n && g < 3000) { const v = Math.floor(sr(g + seed, (seed % 7) + 2) * max) + 1; if (!out.includes(v)) out.push(v); g++; }
  return out;
}
LOTS.forEach((l, i) => {
  if (!HOT[l.id]) HOT[l.id] = genPool(i * 13 + 1, l.max, 10);
  if (!COLD[l.id]) COLD[l.id] = genPool(i * 17 + 99, l.max, 10);
});

// Números da sorte por arquétipo (iguais em todos os idiomas)
const SIG_LUCKY = { 1: [1, 10, 19, 28, 37, 46], 2: [2, 11, 20, 29, 38, 47], 3: [3, 12, 21, 30, 39, 48], 4: [4, 13, 22, 31, 40, 49], 5: [5, 14, 23, 32, 41, 50], 6: [6, 15, 24, 33, 42, 51], 7: [7, 16, 25, 34, 43, 52], 8: [8, 17, 26, 35, 44, 53], 9: [9, 18, 27, 36, 45, 54] };
// Arquétipos traduzidos
const SIG_TXT = {
  pt: { 1: { t: "O Líder", d: "Independência e pioneirismo." }, 2: { t: "O Diplomata", d: "Harmonia e cooperação." }, 3: { t: "O Criativo", d: "Expressão e optimismo." }, 4: { t: "O Construtor", d: "Estabilidade e disciplina." }, 5: { t: "O Aventureiro", d: "Liberdade e versatilidade." }, 6: { t: "O Guardião", d: "Responsabilidade e cuidado." }, 7: { t: "O Sábio", d: "Análise e intuição." }, 8: { t: "O Executivo", d: "Poder e ambição." }, 9: { t: "O Humanista", d: "Compaixão e idealismo." } },
  en: { 1: { t: "The Leader", d: "Independence and pioneering." }, 2: { t: "The Diplomat", d: "Harmony and cooperation." }, 3: { t: "The Creative", d: "Expression and optimism." }, 4: { t: "The Builder", d: "Stability and discipline." }, 5: { t: "The Adventurer", d: "Freedom and versatility." }, 6: { t: "The Guardian", d: "Responsibility and care." }, 7: { t: "The Sage", d: "Analysis and intuition." }, 8: { t: "The Executive", d: "Power and ambition." }, 9: { t: "The Humanist", d: "Compassion and idealism." } },
  es: { 1: { t: "El Líder", d: "Independencia y pionerismo." }, 2: { t: "El Diplomático", d: "Armonía y cooperación." }, 3: { t: "El Creativo", d: "Expresión y optimismo." }, 4: { t: "El Constructor", d: "Estabilidad y disciplina." }, 5: { t: "El Aventurero", d: "Libertad y versatilidad." }, 6: { t: "El Guardián", d: "Responsabilidad y cuidado." }, 7: { t: "El Sabio", d: "Análisis e intuición." }, 8: { t: "El Ejecutivo", d: "Poder y ambición." }, 9: { t: "El Humanista", d: "Compasión e idealismo." } },
  fr: { 1: { t: "Le Leader", d: "Indépendance et esprit pionnier." }, 2: { t: "Le Diplomate", d: "Harmonie et coopération." }, 3: { t: "Le Créatif", d: "Expression et optimisme." }, 4: { t: "Le Bâtisseur", d: "Stabilité et discipline." }, 5: { t: "L'Aventurier", d: "Liberté et polyvalence." }, 6: { t: "Le Gardien", d: "Responsabilité et soin." }, 7: { t: "Le Sage", d: "Analyse et intuition." }, 8: { t: "L'Exécutif", d: "Pouvoir et ambition." }, 9: { t: "L'Humaniste", d: "Compassion et idéalisme." } },
  de: { 1: { t: "Der Anführer", d: "Unabhängigkeit und Pioniergeist." }, 2: { t: "Der Diplomat", d: "Harmonie und Kooperation." }, 3: { t: "Der Kreative", d: "Ausdruck und Optimismus." }, 4: { t: "Der Erbauer", d: "Stabilität und Disziplin." }, 5: { t: "Der Abenteurer", d: "Freiheit und Vielseitigkeit." }, 6: { t: "Der Wächter", d: "Verantwortung und Fürsorge." }, 7: { t: "Der Weise", d: "Analyse und Intuition." }, 8: { t: "Der Macher", d: "Macht und Ehrgeiz." }, 9: { t: "Der Humanist", d: "Mitgefühl und Idealismus." } },
  it: { 1: { t: "Il Leader", d: "Indipendenza e pionierismo." }, 2: { t: "Il Diplomatico", d: "Armonia e cooperazione." }, 3: { t: "Il Creativo", d: "Espressione e ottimismo." }, 4: { t: "Il Costruttore", d: "Stabilità e disciplina." }, 5: { t: "L'Avventuriero", d: "Libertà e versatilità." }, 6: { t: "Il Guardiano", d: "Responsabilità e cura." }, 7: { t: "Il Saggio", d: "Analisi e intuizione." }, 8: { t: "L'Esecutivo", d: "Potere e ambizione." }, 9: { t: "L'Umanista", d: "Compassione e idealismo." } },
};
function sigFor(lang, n) { const tx = (SIG_TXT[lang] && SIG_TXT[lang][n]) ? SIG_TXT[lang][n] : SIG_TXT.en[n]; return { t: tx.t, d: tx.d, l: SIG_LUCKY[n] }; }

// Planos (nomes de nível universais; textos via chaves de tradução)
const PLAN_NAMES = { gratuito: "Free", basico: "Basic", premium: "Premium" };
const PERMAP = { forever: { pt: "para sempre", en: "forever", es: "para siempre", fr: "pour toujours", de: "für immer", it: "per sempre" }, month: { pt: "/mês", en: "/mo", es: "/mes", fr: "/mois", de: "/Mon.", it: "/mese" } };
function perTxt(lang, key) { return (PERMAP[key] && PERMAP[key][lang]) ? PERMAP[key][lang] : PERMAP[key].en; }
const PLANS = [
  { id: "gratuito", preco: "£0", perKey: "forever", cor: "#6b7280", okKeys: ["nav_res"], lockKeys: ["nav_str", "nav_num", "nav_pl", "nav_esp"] },
  { id: "basico", preco: "£4.99", perKey: "month", cor: "#1a56db", okKeys: ["nav_res", "nav_str", "nav_num", "nav_pl"], lockKeys: ["nav_esp"] },
  { id: "premium", preco: "£9.99", perKey: "month", cor: "#FFD700", tc: "#1a1a1a", okKeys: ["nav_res", "nav_str", "nav_num", "nav_pl", "nav_esp"], lockKeys: [] },
];
const DEMOS = [{ nome: "Demo Free", email: "free@demo.com", senha: "123456", plano: "gratuito" }, { nome: "Demo Basic", email: "basic@demo.com", senha: "123456", plano: "basico" }, { nome: "Demo Premium", email: "premium@demo.com", senha: "123456", plano: "premium" }];
const NIV = { gratuito: 0, basico: 1, premium: 2 };

function sr(n, s) { const x = Math.sin(n * 127.1 * s + 311.7) * 43758.5453; return x - Math.floor(x); }
function pad(n) { return String(n).padStart(2, "0"); }
function range(n) { return Array.from({ length: n }, (_, i) => i + 1); }
function shuffle(a, s) { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(sr(i, s) * i); const t = b[i]; b[i] = b[j]; b[j] = t; } return b; }
function combos(a, k) { if (k === 1) return a.map(x => [x]); const r = []; for (let i = 0; i <= a.length - k; i++) { combos(a.slice(i + 1), k - 1).forEach(c => r.push([a[i], ...c])); } return r; }
function calcNV(d) { let s = d.replace(/-/g, "").split("").map(Number).reduce((a, b) => a + b, 0); while (s >= 10) s = String(s).split("").map(Number).reduce((a, b) => a + b, 0); return s || 9; }
function chunk(a, sz) { const r = []; for (let i = 0; i < a.length; i += sz) r.push(a.slice(i, i + sz)); return r; }
// Gera no máximo "cap" combinações sem construir o conjunto completo (evita travar)
function combosCap(a, k, cap) {
  const out = []; const cur = [];
  function rec(start) {
    if (out.length >= cap) return;
    if (cur.length === k) { out.push(cur.slice()); return; }
    for (let i = start; i < a.length; i++) { if (out.length >= cap) return; cur.push(a[i]); rec(i + 1); cur.pop(); }
  }
  rec(0);
  return out;
}
// Conta o total de combinações possíveis (coeficiente binomial)
function binom(n, k) {
  if (k < 0 || k > n) return 0;
  k = Math.min(k, n - k);
  let r = 1;
  for (let i = 0; i < k; i++) r = r * (n - i) / (i + 1);
  return Math.round(r);
}

// ═══════════════════════════════════════════════════════════════
// LIGAÇÃO AOS RESULTADOS REAIS (servidor)
// ═══════════════════════════════════════════════════════════════
const RESULTS_URL = "https://lotterypro-servidor-production.up.railway.app/api/resultados";

// Contexto que partilha os dados reais (resultados + frequência) com todo o site.
const LiveContext = createContext({ live: null });
function useLive() { return useContext(LiveContext); }

// Junta os resultados reais por cima da lista LOTS de exemplo.
function mergeLots(live) {
  return LOTS.map(lot => {
    const r = live && live.find(x => x.id === lot.id);
    if (!r) return lot;
    return {
      ...lot,
      nums: r.nums && r.nums.length ? r.nums.map(Number) : lot.nums,
      extra: r.extra && r.extra.length ? r.extra.map(Number) : lot.extra,
      jack: r.jack || lot.jack,
      freq: r.freq || null,
      atraso: r.atraso || null,
      janela: r.janela || null,
    };
  });
}

// Usado pelo Home: devolve a lista de loterias já com os resultados reais.
function useResultados() { const { live } = useLive(); return mergeLots(live); }

// Devolve a entrada viva (com freq/atraso reais) de UMA loteria, ou null.
function useLotLive(lotId) {
  const { live } = useLive();
  return (live && live.find(x => x.id === lotId)) || null;
}

// ═══════════════════════════════════════════════════════════════
// SISTEMA DE TEMA (claro / escuro)
// ═══════════════════════════════════════════════════════════════
const THEMES = {
  dark: { bg0: "#0d1117", bg1: "#161b22", bg2: "#21262d", tx0: "#e6edf3", tx1: "#8b949e", tx2: "#c9d1d9", tx3: "#484f58", bd0: "#30363d", ovB: "rgba(255,255,255,.1)", ovR: "rgba(255,255,255,.03)" },
  light: { bg0: "#ffffff", bg1: "#f6f8fa", bg2: "#eaeef2", tx0: "#1f2328", tx1: "#656d76", tx2: "#424a53", tx3: "#9aa0a6", bd0: "#d0d7de", ovB: "rgba(27,31,36,.15)", ovR: "rgba(27,31,36,.04)" },
};
function ThemeToggle() {
  const { theme, setTheme, t } = useT();
  const dark = theme === "dark";
  return <button onClick={() => setTheme(dark ? "light" : "dark")} title={dark ? t("theme_light") : t("theme_dark")} style={{ padding: "4px 9px", borderRadius: 6, border: "1px solid var(--bd0)", background: "var(--bg1)", color: "var(--tx0)", cursor: "pointer", fontSize: 13, lineHeight: 1 }}>{dark ? "☀️" : "🌙"}</button>;
}

// ═══════════════════════════════════════════════════════════════
// UI PARTILHADA
// ═══════════════════════════════════════════════════════════════
function Ball({ n, c = "#3d444d", s = 30 }) {
  const light = ["#FFD700", "#f5c518"].includes(c);
  return <div style={{ width: s, height: s, borderRadius: "50%", background: c, display: "flex", alignItems: "center", justifyContent: "center", color: light ? "#1a1a1a" : "#fff", fontWeight: 700, fontSize: Math.round(s * 0.33), flexShrink: 0, boxShadow: "0 2px 4px rgba(0,0,0,.4)" }}>{pad(n)}</div>;
}
function Card({ children, style = {} }) {
  return <div style={{ background: "var(--bg1)", border: "1px solid var(--ovB)", borderRadius: 8, padding: 14, ...style }}>{children}</div>;
}
function STitle({ c = "#f5c518", i, children }) {
  return <div style={{ fontSize: 12, fontWeight: 700, color: c, marginBottom: 8 }}>{i} {children}</div>;
}
function Btn({ children, onClick, disabled, primary, c, style = {} }) {
  const bg = primary ? (c || "#f5c518") : "transparent";
  const fg = primary ? (["#FFD700", "#f5c518"].includes(bg) ? "#1a1a1a" : "#fff") : "var(--tx0)";
  return <button onClick={onClick} disabled={disabled} style={{ padding: "7px 14px", borderRadius: 6, border: primary ? "none" : "1px solid var(--bd0)", background: bg, color: fg, fontWeight: 700, fontSize: 12, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1, ...style }}>{children}</button>;
}
function LotSel({ lotId, set }) {
  return <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 10 }}>{LOTS.map(l => <button key={l.id} onClick={() => set(l.id)} style={{ padding: "4px 10px", borderRadius: 6, fontSize: 11, cursor: "pointer", border: `1px solid ${lotId === l.id ? l.cor : "var(--bd0)"}`, background: lotId === l.id ? l.cor + "22" : "transparent", color: lotId === l.id ? l.cor : "var(--tx1)", fontWeight: lotId === l.id ? 700 : 400 }}>{l.flag} {l.short}</button>)}</div>;
}
function Ins({ passos, limites }) {
  const { t } = useT();
  return (
    <Card style={{ marginBottom: 10, borderLeft: "3px solid #79c0ff" }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#79c0ff", marginBottom: 6 }}>📖 {t("howto")}</div>
      <div style={{ display: "grid", gap: 4 }}>
        {passos.map((p, i) => (
          <div key={i} style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#79c0ff22", border: "1px solid #79c0ff44", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#79c0ff", flexShrink: 0 }}>{i + 1}</div>
            <div style={{ fontSize: 11, color: "var(--tx2)", lineHeight: 1.4 }}>{p}</div>
          </div>
        ))}
      </div>
      {limites && (
        <div style={{ marginTop: 8, padding: "6px 8px", background: "var(--bg0)", borderRadius: 4 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#f5c518", marginBottom: 3 }}>📏 {t("limits")}</div>
          {limites.map((l, i) => <div key={i} style={{ fontSize: 10, color: "var(--tx1)", marginBottom: 1 }}>• {l}</div>)}
        </div>
      )}
    </Card>
  );
}
function NumSel({ nums, set, max, cor, dis, label }) {
  function tg(n) {
    if (dis && dis.has(n)) return;
    set(p => { const s = new Set(p); if (s.has(n)) s.delete(n); else s.add(n); return s; });
  }
  const { t } = useT();
  return (
    <div>
      {label && <div style={{ fontSize: 10, color: "var(--tx1)", marginBottom: 4 }}>{label}</div>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(10,1fr)", gap: 2 }}>
        {range(max).map(n => {
          const s = nums.has(n);
          const d = dis && dis.has(n) && !s;
          return <button key={n} onClick={() => tg(n)} style={{ aspectRatio: "1", borderRadius: 4, border: `1px solid ${s ? cor : d ? "var(--tx3)" : "var(--bd0)"}`, background: s ? cor : "var(--bg0)", color: s ? (["#FFD700", "#f5c518"].includes(cor) ? "#1a1a1a" : "#fff") : d ? "var(--tx3)" : "var(--tx1)", fontWeight: s ? 700 : 400, fontSize: 9, cursor: d ? "not-allowed" : "pointer", opacity: d ? 0.3 : 1, display: "flex", alignItems: "center", justifyContent: "center" }}>{pad(n)}</button>;
        })}
      </div>
      <div style={{ fontSize: 9, color: cor, marginTop: 3 }}>{nums.size} {nums.size !== 1 ? t("numbs") : t("numb")}</div>
    </div>
  );
}
function LockBox({ blocked, plan, onUp, children }) {
  const { t } = useT();
  return (
    <div style={{ position: "relative" }}>
      <div style={blocked ? { opacity: 0.07, pointerEvents: "none", minHeight: 180 } : {}}>{children}</div>
      {blocked && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
          <div style={{ background: "var(--bg1)", border: "1px solid var(--ovB)", borderRadius: 12, padding: "24px 36px", textAlign: "center", boxShadow: "0 12px 40px rgba(0,0,0,.7)" }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>🔒</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--tx0)", marginBottom: 4 }}>{t("lock_title")}</div>
            <div style={{ fontSize: 11, color: "var(--tx1)", marginBottom: 14 }}>{t("lock_req")} {plan}</div>
            <Btn primary onClick={onUp}>{t("lock_see")}</Btn>
          </div>
        </div>
      )}
    </div>
  );
}
function Campo({ l, t = "text", v, set, ph }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: "var(--tx1)", marginBottom: 3, letterSpacing: 0.5 }}>{l}</div>
      <input type={t} value={v} onChange={e => set(e.target.value)} placeholder={ph} style={{ width: "100%", boxSizing: "border-box", background: "var(--bg0)", border: "1px solid var(--bd0)", borderRadius: 6, color: "var(--tx0)", padding: "8px 10px", fontSize: 13 }} />
    </div>
  );
}
// Seletor de idioma (dropdown com bandeiras)
function LangDrop({ compact }) {
  const { lang, setLang } = useT();
  const [open, setOpen] = useState(false);
  const cur = LANGS.find(l => l.code === lang) || LANGS[1];
  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen(o => !o)} style={{ display: "flex", alignItems: "center", gap: 4, padding: compact ? "3px 7px" : "5px 10px", borderRadius: 6, border: "1px solid var(--bd0)", background: "var(--bg1)", color: "var(--tx0)", cursor: "pointer", fontSize: compact ? 11 : 12 }}>
        <span style={{ fontSize: compact ? 13 : 15 }}>{cur.flag}</span>
        {!compact && <span>{cur.nome}</span>}
        <span style={{ fontSize: 8, color: "var(--tx1)" }}>▼</span>
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 40 }} />
          <div style={{ position: "absolute", top: "calc(100% + 4px)", right: 0, zIndex: 50, background: "var(--bg1)", border: "1px solid var(--bd0)", borderRadius: 8, boxShadow: "0 12px 40px rgba(0,0,0,.7)", maxHeight: 280, overflowY: "auto", width: 180 }}>
            {LANGS.map(l => {
              const done = !!STR[l.code];
              const sel = l.code === lang;
              return (
                <button key={l.code} onClick={() => { setLang(l.code); setOpen(false); }} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", boxSizing: "border-box", padding: "7px 10px", border: "none", borderBottom: "1px solid var(--ovB)", background: sel ? "#f5c51818" : "transparent", color: sel ? "#f5c518" : "var(--tx0)", cursor: "pointer", fontSize: 12, textAlign: "left" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 7 }}><span style={{ fontSize: 15 }}>{l.flag}</span>{l.nome}</span>
                  {!done && <span style={{ fontSize: 8, color: "var(--tx1)", fontStyle: "italic" }}>soon</span>}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ECRÃS DE AUTENTICAÇÃO
// ═══════════════════════════════════════════════════════════════
function Welcome({ onL, onR, onGuest }) {
  const { t } = useT();
  return (
    <div style={{ background: "var(--bg0)", borderRadius: 12, overflow: "hidden" }}>
      <div style={{ background: "var(--bg1)", borderBottom: "1px solid var(--ovB)", padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <div style={{ fontWeight: 800, fontSize: 18 }}><span style={{ color: "#FFD700" }}>Lottery</span><span style={{ color: "var(--tx0)" }}>Pro</span></div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <ThemeToggle /><LangDrop />
          <button onClick={onL} style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid var(--bd0)", background: "transparent", color: "var(--tx0)", cursor: "pointer", fontSize: 12 }}>{t("w_login")}</button>
          <Btn primary onClick={onR}>{t("w_create")}</Btn>
        </div>
      </div>
      <div style={{ padding: "30px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: "var(--tx0)", lineHeight: 1.3, marginBottom: 8 }}>{t("w_tag1")}<br />{t("w_tag2")}</div>
        <div style={{ fontSize: 12, color: "var(--tx1)", marginBottom: 6 }}>UK Lotto · EuroMillions · EuroJackpot · Thunderball</div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 24, flexWrap: "wrap" }}>
          {PLANS.map(p => <div key={p.id} style={{ background: p.cor + "22", border: `1px solid ${p.cor}44`, borderRadius: 6, padding: "3px 10px", fontSize: 11, color: p.cor, fontWeight: 600 }}>{PLAN_NAMES[p.id]} {p.preco}</div>)}
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          <Btn primary onClick={onR}>{t("w_startFree")}</Btn>
          <button onClick={onL} style={{ padding: "8px 18px", borderRadius: 8, border: "1px solid var(--bd0)", background: "transparent", color: "var(--tx0)", cursor: "pointer", fontSize: 13 }}>{t("w_haveAcc")}</button>
        </div>
        <div onClick={onGuest} style={{ marginTop: 16, fontSize: 12, color: "#58a6ff", cursor: "pointer", fontWeight: 600 }}>👁️ {t("nav_res")} →</div>
      </div>
    </div>
  );
}

function Login({ onReg }) {
  const { t } = useT();
  const [e, setE] = useState("");
  const [s, setS] = useState("");
  const [er, setEr] = useState("");
  const [busy, setBusy] = useState(false);
  async function go() {
    if (!e || !s) { setEr(t("l_fill")); return; }
    setBusy(true); setEr("");
    const { error } = await supabase.auth.signInWithPassword({ email: e.toLowerCase().trim(), password: s });
    setBusy(false);
    if (error) { setEr(error.message || t("l_invalid")); return; }
    // sucesso: o "ouvinte" de sessão no AppInner trata da entrada
  }
  return (
    <div style={{ background: "var(--bg0)", borderRadius: 12, overflow: "hidden" }}>
      <div style={{ background: "var(--bg1)", borderBottom: "1px solid var(--ovB)", padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: 800, fontSize: 17 }}><span style={{ color: "#FFD700" }}>Lottery</span><span style={{ color: "var(--tx0)" }}>Pro</span></div>
        <span style={{ display: "flex", gap: 6, alignItems: "center" }}><ThemeToggle /><LangDrop compact /></span>
      </div>
      <div style={{ padding: 20, maxWidth: 360, margin: "0 auto" }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "var(--tx0)", marginBottom: 3 }}>{t("l_title")}</div>
        <div style={{ fontSize: 11, color: "var(--tx1)", marginBottom: 16 }}>{t("l_sub")}</div>
        <Campo l={t("l_email")} t="email" v={e} set={setE} ph={t("ph_mail")} />
        <Campo l={t("l_pass")} t="password" v={s} set={setS} ph="••••••" />
        {er && <div style={{ fontSize: 11, color: "#f85149", marginBottom: 8 }}>{er}</div>}
        <Btn primary onClick={go} disabled={busy} style={{ width: "100%", marginBottom: 10, opacity: busy ? 0.6 : 1 }}>{busy ? "…" : t("w_login")}</Btn>
        <div style={{ textAlign: "center", fontSize: 12, color: "var(--tx1)" }}>{t("l_noAcc")} <span onClick={onReg} style={{ color: "#58a6ff", cursor: "pointer", fontWeight: 600 }}>{t("l_reg")}</span></div>
      </div>
    </div>
  );
}

function Reg({ onLog }) {
  const { t } = useT();
  const [n, setN] = useState("");
  const [e, setE] = useState("");
  const [s, setS] = useState("");
  const [er, setEr] = useState("");
  const [busy, setBusy] = useState(false);
  async function go() {
    if (!n || !e || !s) { setEr(t("r_fill")); return; }
    if (s.length < 6) { setEr(t("r_min6")); return; }
    setBusy(true); setEr("");
    const { data, error } = await supabase.auth.signUp({ email: e.toLowerCase().trim(), password: s, options: { data: { nome: n } } });
    setBusy(false);
    if (error) { setEr(error.message); return; }
    if (data && data.user && !data.session) { setEr(t("r_check")); return; }
    // se a confirmação de email estiver desligada, entra logo (o ouvinte trata)
  }
  return (
    <div style={{ background: "var(--bg0)", borderRadius: 12, overflow: "hidden" }}>
      <div style={{ background: "var(--bg1)", borderBottom: "1px solid var(--ovB)", padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: 800, fontSize: 17 }}><span style={{ color: "#FFD700" }}>Lottery</span><span style={{ color: "var(--tx0)" }}>Pro</span></div>
        <span style={{ display: "flex", gap: 6, alignItems: "center" }}><ThemeToggle /><LangDrop compact /></span>
      </div>
      <div style={{ padding: 20, maxWidth: 360, margin: "0 auto" }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "var(--tx0)", marginBottom: 3 }}>{t("r_title")}</div>
        <div style={{ fontSize: 11, color: "var(--tx1)", marginBottom: 16 }}>{t("r_sub")}</div>
        <Campo l={t("r_name")} v={n} set={setN} ph={t("ph_name")} />
        <Campo l={t("l_email")} t="email" v={e} set={setE} ph={t("ph_mail")} />
        <Campo l={t("l_pass")} t="password" v={s} set={setS} ph={t("ph_p6")} />
        {er && <div style={{ fontSize: 11, color: er === t("r_check") ? "#3fb950" : "#f85149", marginBottom: 8 }}>{er}</div>}
        <Btn primary onClick={go} disabled={busy} style={{ width: "100%", marginBottom: 10, opacity: busy ? 0.6 : 1 }}>{busy ? "…" : t("r_create")}</Btn>
        <div style={{ textAlign: "center", fontSize: 12, color: "var(--tx1)" }}>{t("r_haveAcc")} <span onClick={onLog} style={{ color: "#58a6ff", cursor: "pointer", fontWeight: 600 }}>{t("r_enter")}</span></div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// NOVA FUNCIONALIDADE: CONTAGEM DECRESCENTE
// ═══════════════════════════════════════════════════════════════
function Countdown() {
  const { t } = useT();
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id); }, []);
  const next = new Date(); next.setHours(24, 0, 0, 0);
  let diff = Math.max(0, Math.floor((next.getTime() - now) / 1000));
  const d = Math.floor(diff / 86400); diff %= 86400;
  const h = Math.floor(diff / 3600); diff %= 3600;
  const m = Math.floor(diff / 60); const s = diff % 60;
  const cell = (v, lbl) => (
    <div style={{ textAlign: "center", minWidth: 42 }}>
      <div style={{ fontSize: 22, fontWeight: 800, color: "#f5c518", fontFamily: "monospace", lineHeight: 1 }}>{pad(v)}</div>
      <div style={{ fontSize: 8, color: "var(--tx1)", marginTop: 2, textTransform: "uppercase", letterSpacing: 0.5 }}>{lbl}</div>
    </div>
  );
  return (
    <div style={{ background: "var(--bg1)", border: "1px solid #f5c51833", borderRadius: 8, padding: "10px 14px", marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--tx0)" }}>⏱️ {t("cd_title")}<div style={{ fontSize: 9, color: "var(--tx1)", fontWeight: 400 }}>{t("cd_to")}</div></div>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        {cell(d, "D")}<span style={{ color: "var(--tx3)" }}>:</span>{cell(h, "H")}<span style={{ color: "var(--tx3)" }}>:</span>{cell(m, "M")}<span style={{ color: "var(--tx3)" }}>:</span>{cell(s, "S")}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// NOVA FUNCIONALIDADE: TENDÊNCIAS VISUAIS (gráfico de barras)
// ═══════════════════════════════════════════════════════════════
function Trends({ lotId }) {
  const { t } = useT();
  const lot = LOTS.find(l => l.id === lotId);
  const liveR = useLotLive(lotId);
  const real = !!(liveR && liveR.freq);
  const data = useMemo(() => {
    if (real) return range(lot.max).map(n => ({ n, v: liveR.freq[n] || 0 }));
    return range(lot.max).map(n => ({ n, v: Math.round(50 + (sr(n, lotId.length + 5) - 0.5) * 44) }));
  }, [lotId, lot.max, real, liveR]);
  const maxV = Math.max(...data.map(x => x.v));
  const minV = Math.min(...data.map(x => x.v));
  return (
    <div>
      <Card style={{ marginBottom: 8, padding: "6px 10px" }}><div style={{ fontSize: 10, color: "var(--tx1)" }}>{t("tr_desc")}{real ? " · " + fmt(t("real_window"), liveR.janela || 50) : " · " + t("illus_note")}</div></Card>
      <Card>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 150, overflowX: "auto", paddingBottom: 4 }}>
          {data.map(x => {
            const hpct = ((x.v - minV) / (maxV - minV + 0.001)) * 100;
            const hot = x.v >= maxV - (maxV - minV) * 0.25;
            const cold = x.v <= minV + (maxV - minV) * 0.25;
            const col = hot ? "#f85149" : cold ? "#1a56db" : "#f5c518";
            return (
              <div key={x.n} style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 16 }}>
                <div title={pad(x.n) + ": " + x.v} style={{ width: 12, height: Math.max(4, hpct) + "%", minHeight: 4, background: col, borderRadius: "3px 3px 0 0", transition: "height .3s" }} />
                <div style={{ fontSize: 7, color: "var(--tx1)", marginTop: 2, fontFamily: "monospace" }}>{pad(x.n)}</div>
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 8, fontSize: 10, color: "var(--tx1)" }}>
          <span><span style={{ color: "#f85149" }}>■</span> {t("s_hotT")}</span>
          <span><span style={{ color: "#f5c518" }}>■</span> {t("s_med")}</span>
          <span><span style={{ color: "#1a56db" }}>■</span> {t("s_coldT")}</span>
        </div>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// NOVA FUNCIONALIDADE: OS MEUS JOGOS (hub)
// ═══════════════════════════════════════════════════════════════
function MyGames({ lotId, setLot, saved, setSaved, flags, setFlags, limit }) {
  const { t, lang } = useT();
  const lot = LOTS.find(l => l.id === lotId);
  const [tab, setTab] = useState("smart");
  const [useHot, setUseHot] = useState(true);
  const [useDelay, setUseDelay] = useState(true);
  const [useLucky, setUseLucky] = useState(false);
  const [dob, setDob] = useState("");
  const [pick, setPick] = useState(null);
  const [okMsg, setOkMsg] = useState("");

  function gerarEsperto() {
    const pool = [];
    if (useHot) HOT[lotId].forEach(n => pool.push(n));
    if (useDelay) COLD[lotId].forEach(n => pool.push(n));
    if (useLucky && dob.length === 10) SIG_LUCKY[calcNV(dob)].filter(n => n <= lot.max).forEach(n => pool.push(n));
    let uniq = [...new Set(pool)];
    const chosen = new Set();
    let seed = saved.length + 1 + (useHot ? 1 : 0) + (useDelay ? 2 : 0) + (useLucky ? 4 : 0);
    const sh = shuffle(uniq, seed);
    for (let i = 0; i < sh.length && chosen.size < lot.bolas; i++) chosen.add(sh[i]);
    let g = 0;
    while (chosen.size < lot.bolas && g < 1000) { chosen.add(Math.floor(sr(g + seed, lotId.length + 11) * lot.max) + 1); g++; }
    setPick([...chosen].sort((a, b) => a - b));
    setFlags(f => ({ ...f, smart: true }));
    setOkMsg("");
  }
  function guardar() {
    if (!pick) return;
    if (limit && limit > 0 && saved.length >= limit) { setOkMsg("🛟 " + t("resp_self_on") + ": " + limit); return; }
    setSaved(s => [{ id: Date.now(), lotId, nums: pick, cor: lot.cor }, ...s]);
    setOkMsg(t("my_saved_ok"));
    setPick(null);
  }
  function apagar(id) { setSaved(s => s.filter(g => g.id !== id)); }
  function conferir(g) {
    const lotData = LOTS.find(l => l.id === g.lotId);
    const result = new Set(lotData.nums);
    return g.nums.filter(n => result.has(n)).length;
  }

  const badges = [
    { id: "b1", got: saved.length >= 1, t: t("ach_b1"), d: t("ach_b1d"), ic: "🎯" },
    { id: "b2", got: flags.smart, t: t("ach_b2"), d: t("ach_b2d"), ic: "🧠" },
    { id: "b3", got: flags.numero, t: t("ach_b3"), d: t("ach_b3d"), ic: "🔮" },
    { id: "b4", got: saved.length >= 5, t: t("ach_b4"), d: t("ach_b4d"), ic: "🏆" },
  ];
  const tabs = [{ id: "smart", l: t("my_smart"), i: "🧠" }, { id: "saved", l: t("my_saved"), i: "💾" }, { id: "hist", l: t("hist_tab"), i: "📈" }, { id: "ach", l: t("my_ach"), i: "🏅" }];

  return (
    <div>
      <LotSel lotId={lotId} set={setLot} />
      <div style={{ display: "flex", gap: 2, marginBottom: 10, flexWrap: "wrap" }}>
        {tabs.map(tb => <button key={tb.id} onClick={() => setTab(tb.id)} style={{ padding: "6px 10px", fontSize: 11, cursor: "pointer", border: "none", background: tab === tb.id ? "#f5c51818" : "transparent", color: tab === tb.id ? "#f5c518" : "var(--tx1)", fontWeight: tab === tb.id ? 700 : 400, borderBottom: tab === tb.id ? "2px solid #f5c518" : "2px solid transparent" }}>{tb.i} {tb.l}</button>)}
      </div>

      {tab === "smart" && (
        <div>
          <STitle c="#3fb950" i="🧠">{t("my_smart")} — {lot.nome}</STitle>
          <Card style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 11, color: "var(--tx1)", marginBottom: 10 }}>{t("my_genDesc")}</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
              {[["hot", useHot, setUseHot, t("my_useHot")], ["del", useDelay, setUseDelay, t("my_useDelay")], ["luc", useLucky, setUseLucky, t("my_useLucky")]].map(o => (
                <button key={o[0]} onClick={() => o[2](v => !v)} style={{ padding: "5px 12px", borderRadius: 6, border: `1px solid ${o[1] ? "#3fb950" : "var(--bd0)"}`, background: o[1] ? "#3fb95022" : "transparent", color: o[1] ? "#3fb950" : "var(--tx1)", fontSize: 11, cursor: "pointer", fontWeight: o[1] ? 700 : 400 }}>{o[1] ? "✓ " : ""}{o[3]}</button>
              ))}
            </div>
            {useLucky && (
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 10, color: "var(--tx1)", marginBottom: 4 }}>{t("my_dobLabel")}</div>
                <input type="date" value={dob} onChange={e => setDob(e.target.value)} style={{ width: "100%", boxSizing: "border-box", background: "var(--bg0)", border: "1px solid var(--bd0)", borderRadius: 6, color: "var(--tx0)", padding: "7px 10px", fontSize: 13 }} />
              </div>
            )}
            <Btn primary c="#3fb950" onClick={gerarEsperto}>{t("my_genBtn")}</Btn>
          </Card>
          {pick && (
            <Card>
              <div style={{ display: "flex", gap: 5, alignItems: "center", flexWrap: "wrap", marginBottom: 10 }}>
                {pick.map(n => <Ball key={n} n={n} c={lot.cor} s={34} />)}
              </div>
              <Btn primary onClick={guardar}>💾 {t("my_saveThis")}</Btn>
            </Card>
          )}
          {okMsg && <div style={{ fontSize: 12, color: "#3fb950", marginTop: 8, fontWeight: 600 }}>✓ {okMsg}</div>}
        </div>
      )}

      {tab === "saved" && (
        <div>
          <STitle c="#79c0ff" i="💾">{t("my_savedT")}</STitle>
          {saved.length === 0 ? (
            <Card style={{ textAlign: "center", padding: 24 }}><div style={{ fontSize: 28, marginBottom: 6 }}>💾</div><div style={{ fontSize: 12, color: "var(--tx1)" }}>{t("my_empty")}</div></Card>
          ) : (
            <div>
              <div style={{ fontSize: 10, color: "var(--tx1)", marginBottom: 8 }}>{t("my_checkAll")}</div>
              {saved.map(g => {
                const lotData = LOTS.find(l => l.id === g.lotId);
                const hits = conferir(g);
                return (
                  <Card key={g.id} style={{ marginBottom: 6, padding: "8px 10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{ fontSize: 10, color: "var(--tx1)" }}>{lotData.flag} {lotData.short}</span>
                      <button onClick={() => apagar(g.id)} style={{ background: "transparent", border: "none", color: "#f85149", cursor: "pointer", fontSize: 10 }}>🗑️ {t("my_del")}</button>
                    </div>
                    <div style={{ display: "flex", gap: 4, alignItems: "center", flexWrap: "wrap" }}>
                      {g.nums.map(n => { const win = lotData.nums.includes(n); return <Ball key={n} n={n} c={win ? "#3fb950" : g.cor} s={26} />; })}
                      <span style={{ marginLeft: 6, fontSize: 11, fontWeight: 700, color: hits >= 2 ? "#3fb950" : "var(--tx1)" }}>{hits} {t("my_match")}{hits >= lot.bolas - 1 ? " 🏆" : ""}</span>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {tab === "hist" && <History saved={saved} />}

      {tab === "ach" && (
        <div>
          <STitle c="#f5c518" i="🏅">{t("my_ach")}</STitle>
          <Card style={{ marginBottom: 8, padding: "6px 10px" }}><div style={{ fontSize: 10, color: "var(--tx1)" }}>{t("ach_desc")}</div></Card>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {badges.map(b => (
              <div key={b.id} style={{ background: b.got ? "#f5c51811" : "var(--bg1)", border: `1px solid ${b.got ? "#f5c51844" : "var(--ovB)"}`, borderRadius: 8, padding: 12, textAlign: "center", opacity: b.got ? 1 : 0.55 }}>
                <div style={{ fontSize: 26, marginBottom: 4, filter: b.got ? "none" : "grayscale(1)" }}>{b.ic}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: b.got ? "#f5c518" : "var(--tx1)" }}>{b.t}</div>
                <div style={{ fontSize: 9, color: "var(--tx1)", marginTop: 2 }}>{b.d}</div>
                <div style={{ fontSize: 8, marginTop: 4, color: b.got ? "#3fb950" : "var(--tx3)", fontWeight: 600 }}>{b.got ? "✓" : "🔒"}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Funcionalidades a chegar com o lançamento (servidor) */}
      <div style={{ marginTop: 14 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--tx1)", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>🔜 {t("soon")}</div>
        {[["🌙", t("soon_alerts"), t("soon_alertsD")], ["👥", t("soon_pool"), t("soon_poolD")]].map((c, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", background: "var(--bg1)", border: "1px dashed var(--ovB)", borderRadius: 8, padding: "10px 12px", marginBottom: 6 }}>
            <div style={{ fontSize: 20 }}>{c[0]}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--tx0)", display: "flex", alignItems: "center", gap: 6 }}>{c[1]} <span style={{ fontSize: 8, background: "#6f42c133", color: "#bc8cff", borderRadius: 4, padding: "1px 6px", fontWeight: 600 }}>{t("soon")}</span></div>
              <div style={{ fontSize: 10, color: "var(--tx1)", marginTop: 2 }}>{c[2]}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// LOTE 2 DE FUNCIONALIDADES
// ═══════════════════════════════════════════════════════════════

// Probabilidades reais (1 em X) de acertar o prémio máximo
const ODDS = { lotto: 45057474, euromillions: 139838160, eurojackpot: 95344200, thunderball: 8060598, setforlife: 15339390, health: 2125760, ielotto: 10737573, ielottoplus1: 10737573, ielottoplus2: 10737573, eurodreams: 19191900, dailymillion: 3262620, dailymillionplus: 18353800, lotto6aus49: 139838160, superenalotto: 622614630, millionday: 3478761, vincicasa: 658008, sivincetutto: 622614630, frloto: 19068840, laprimitiva: 139838160, elgordo: 31625100, bonoloto: 13983816 };
function fmtOdds(n) { return (n || 0).toLocaleString("en-US"); }

// ── PARTILHAR JOGO ──
function ShareGame({ lotId, setLot }) {
  const { t } = useT();
  const lot = LOTS.find(l => l.id === lotId);
  const [pick, setPick] = useState(null);
  const [seed, setSeed] = useState(1);
  const [copied, setCopied] = useState(false);

  function gerar() {
    const ns = new Set();
    let g = 0;
    while (ns.size < lot.bolas && g < 1000) { ns.add(Math.floor(sr(g + seed * 7, lotId.length + 13) * lot.max) + 1); g++; }
    setPick([...ns].sort((a, b) => a - b));
    setSeed(s => s + 1);
    setCopied(false);
  }
  const shareText = pick ? ("🎰 LotteryPro — " + lot.nome + "\n" + (lot.flag) + " " + pick.map(pad).join(" · ") + "\n🍀 lotterypro.co.uk") : "";
  function copiar() {
    try { navigator.clipboard.writeText(shareText); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch (e) { setCopied(false); }
  }
  function abrir(url) { try { window.open(url, "_blank"); } catch (e) { } }

  return (
    <div>
      <LotSel lotId={lotId} set={setLot} />
      <STitle c="#25d366" i="📲">{t("share_title")} — {lot.nome}</STitle>
      <Card style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 11, color: "var(--tx1)", marginBottom: 10 }}>{t("share_desc")}</div>
        <Btn primary c="#3fb950" onClick={gerar}>{t("share_gen")}</Btn>
      </Card>
      {pick && (
        <Card>
          <div style={{ display: "flex", gap: 5, alignItems: "center", flexWrap: "wrap", marginBottom: 12 }}>{pick.map(n => <Ball key={n} n={n} c={lot.cor} s={34} />)}</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <button onClick={() => abrir("https://wa.me/?text=" + encodeURIComponent(shareText))} style={{ padding: "7px 14px", borderRadius: 6, border: "none", background: "#25d366", color: "#fff", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>🟢 {t("share_wa")}</button>
            <button onClick={() => abrir("https://t.me/share/url?url=lotterypro.co.uk&text=" + encodeURIComponent(shareText))} style={{ padding: "7px 14px", borderRadius: 6, border: "none", background: "#229ed9", color: "#fff", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>🔵 {t("share_tg")}</button>
            <button onClick={copiar} style={{ padding: "7px 14px", borderRadius: 6, border: "1px solid var(--bd0)", background: "transparent", color: "var(--tx0)", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>{copied ? "✓ " + t("share_copied") : "📋 " + t("share_copy")}</button>
          </div>
        </Card>
      )}
    </div>
  );
}

// ── COMPARADOR DE LOTERIAS ──
function Compare() {
  const { t } = useT();
  const bestJack = "eurojackpot";
  const easiest = "thunderball";
  return (
    <div>
      <STitle c="#f5c518" i="⚖️">{t("cmp_title")}</STitle>
      <Card style={{ marginBottom: 8, padding: "6px 10px" }}><div style={{ fontSize: 10, color: "var(--tx1)" }}>{t("cmp_desc")}</div></Card>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
          <thead><tr style={{ background: "var(--bg2)" }}>{[t("cmp_lot"), t("cmp_jack"), t("cmp_odds")].map(h => <th key={h} style={{ padding: "6px 8px", textAlign: "left", border: "1px solid var(--ovB)", color: "var(--tx1)", fontWeight: 600, fontSize: 10 }}>{h}</th>)}</tr></thead>
          <tbody>{LOTS.map(l => (
            <tr key={l.id} style={{ background: "transparent" }}>
              <td style={{ padding: "7px 8px", border: "1px solid var(--ovB)" }}><span style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: l.cor, display: "inline-block" }} /><span style={{ color: "var(--tx0)", fontWeight: 600 }}>{l.flag} {l.short}</span></span></td>
              <td style={{ padding: "7px 8px", border: "1px solid var(--ovB)", color: "#f5c518", fontWeight: 700 }}>{l.jack}{l.id === bestJack ? " 👑" : ""}</td>
              <td style={{ padding: "7px 8px", border: "1px solid var(--ovB)", color: "var(--tx1)" }}>1 : {fmtOdds(ODDS[l.id])}{l.id === easiest ? " ✅" : ""}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 130, background: "var(--bg1)", border: "1px solid #f5c51844", borderRadius: 8, padding: 10 }}><div style={{ fontSize: 10, color: "var(--tx1)" }}>👑 {t("cmp_best")}</div><div style={{ fontSize: 12, fontWeight: 700, color: "#f5c518" }}>{LOTS.find(l => l.id === bestJack).nome}</div></div>
        <div style={{ flex: 1, minWidth: 130, background: "var(--bg1)", border: "1px solid #3fb95044", borderRadius: 8, padding: 10 }}><div style={{ fontSize: 10, color: "var(--tx1)" }}>✅ {t("cmp_easiest")}</div><div style={{ fontSize: 12, fontWeight: 700, color: "#3fb950" }}>{LOTS.find(l => l.id === easiest).nome}</div></div>
      </div>
      <div style={{ fontSize: 9, color: "var(--tx3)", marginTop: 8 }}>{t("cmp_oddsNote")}</div>
    </div>
  );
}

// ── MODO SONHOS ──
function Dreams({ lotId, setLot }) {
  const { t } = useT();
  const lot = LOTS.find(l => l.id === lotId);
  const [txt, setTxt] = useState("");
  const [nums, setNums] = useState(null);
  function converter() {
    const clean = txt.toLowerCase().replace(/[^a-z0-9á-ú]/g, "");
    if (!clean) { setNums(null); return; }
    let h = 0;
    for (let i = 0; i < clean.length; i++) h = (h * 31 + clean.charCodeAt(i)) % 1000000;
    const ns = new Set();
    let g = 0;
    while (ns.size < lot.bolas && g < 1000) { ns.add(Math.floor(sr(g + (h % 997) + 1, (clean.length % 7) + 2) * lot.max) + 1); g++; }
    setNums([...ns].sort((a, b) => a - b));
  }
  return (
    <div>
      <LotSel lotId={lotId} set={setLot} />
      <STitle c="#bc8cff" i="💭">{t("dream_title")} — {lot.nome}</STitle>
      <Card style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 11, color: "var(--tx1)", marginBottom: 8 }}>{t("dream_desc")}</div>
        <input value={txt} onChange={e => setTxt(e.target.value)} placeholder={t("dream_ph")} style={{ width: "100%", boxSizing: "border-box", background: "var(--bg0)", border: "1px solid var(--bd0)", borderRadius: 6, color: "var(--tx0)", padding: "8px 10px", fontSize: 13, marginBottom: 10 }} />
        <Btn primary c="#bc8cff" onClick={converter}>{t("dream_btn")}</Btn>
      </Card>
      {nums ? (
        <div style={{ background: "#1a0533", border: "1px solid #bc8cff44", borderRadius: 8, padding: 14, textAlign: "center" }}>
          <div style={{ fontSize: 10, color: "#bc8cff", letterSpacing: 1, marginBottom: 8 }}>{t("dream_your").toUpperCase()}</div>
          <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>{nums.map(n => <Ball key={n} n={n} c="#bc8cff" s={36} />)}</div>
        </div>
      ) : (
        <Card style={{ textAlign: "center", padding: 20 }}><div style={{ fontSize: 28, marginBottom: 6 }}>💭</div><div style={{ fontSize: 12, color: "var(--tx1)" }}>{t("dream_empty")}</div></Card>
      )}
    </div>
  );
}

// ── IMPRIMIR / EXPORTAR JOGOS ──
function ExportGames({ saved }) {
  const { t } = useT();
  function descarregar() {
    try {
      const W = 520, rowH = 46, top = 90, H = top + Math.max(1, saved.length) * rowH + 30;
      const cv = document.createElement("canvas");
      cv.width = W; cv.height = H;
      const x = cv.getContext("2d");
      x.fillStyle = "var(--bg0)"; x.fillRect(0, 0, W, H);
      x.fillStyle = "#FFD700"; x.font = "bold 22px sans-serif"; x.fillText("Lottery", 20, 36);
      x.fillStyle = "var(--tx0)"; x.fillText("Pro", 110, 36);
      x.fillStyle = "var(--tx1)"; x.font = "12px sans-serif"; x.fillText(t("exp_card") + " · " + t("exp_gen") + " " + new Date().toLocaleDateString(), 20, 60);
      x.strokeStyle = "var(--ovB)"; x.beginPath(); x.moveTo(20, 74); x.lineTo(W - 20, 74); x.stroke();
      saved.forEach((g, i) => {
        const y = top + i * rowH;
        const lot = LOTS.find(l => l.id === g.lotId);
        x.fillStyle = "var(--tx1)"; x.font = "11px sans-serif"; x.fillText(lot.short, 20, y);
        let bx = 20;
        g.nums.forEach(n => {
          x.fillStyle = lot.cor; x.beginPath(); x.arc(bx + 14, y + 18, 14, 0, Math.PI * 2); x.fill();
          x.fillStyle = ["#FFD700", "#f5c518"].includes(lot.cor) ? "#1a1a1a" : "#fff"; x.font = "bold 12px sans-serif"; x.textAlign = "center"; x.fillText(pad(n), bx + 14, y + 22); x.textAlign = "left";
          bx += 34;
        });
      });
      const url = cv.toDataURL("image/png");
      const a = document.createElement("a"); a.href = url; a.download = "lotterypro-jogos.png"; a.click();
    } catch (e) { }
  }
  return (
    <div>
      <STitle c="#79c0ff" i="🖨️">{t("exp_title")}</STitle>
      <Card style={{ marginBottom: 8, padding: "6px 10px" }}><div style={{ fontSize: 10, color: "var(--tx1)" }}>{t("exp_desc")}</div></Card>
      {saved.length === 0 ? (
        <Card style={{ textAlign: "center", padding: 24 }}><div style={{ fontSize: 28, marginBottom: 6 }}>🖨️</div><div style={{ fontSize: 12, color: "var(--tx1)" }}>{t("exp_none")}</div></Card>
      ) : (
        <div>
          <Card style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--tx0)", marginBottom: 8 }}>🎰 {t("exp_card")} ({saved.length})</div>
            {saved.map(g => { const lot = LOTS.find(l => l.id === g.lotId); return (
              <div key={g.id} style={{ display: "flex", gap: 4, alignItems: "center", marginBottom: 5 }}>
                <span style={{ fontSize: 9, color: "var(--tx1)", width: 70 }}>{lot.flag} {lot.short}</span>
                {g.nums.map(n => <Ball key={n} n={n} c={lot.cor} s={22} />)}
              </div>
            ); })}
          </Card>
          <Btn primary onClick={descarregar}>⬇️ {t("exp_btn")}</Btn>
        </div>
      )}
    </div>
  );
}

// ── JOGO RESPONSÁVEL ──
function Responsible({ limit, setLimit }) {
  const { t } = useT();
  const [sel, setSel] = useState(limit || 0);
  const tips = [t("resp_t1"), t("resp_t2"), t("resp_t3"), t("resp_t4")];
  return (
    <div>
      <STitle c="#3fb950" i="🛟">{t("resp_title")}</STitle>
      <div style={{ background: "#0d2818", border: "1px solid #3fb95044", borderRadius: 8, padding: 12, marginBottom: 10 }}>
        <div style={{ fontSize: 12, color: "var(--tx0)", marginBottom: 6 }}>{t("resp_intro")}</div>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#3fb950" }}>🔞 {t("resp_age")}</div>
      </div>
      <Card style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--tx0)", marginBottom: 8 }}>✅ {t("resp_tips_t")}</div>
        {tips.map((tip, i) => (
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#3fb95022", border: "1px solid #3fb95044", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#3fb950", flexShrink: 0 }}>{i + 1}</div>
            <div style={{ fontSize: 11, color: "var(--tx2)", lineHeight: 1.4 }}>{tip}</div>
          </div>
        ))}
      </Card>
      <Card style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--tx0)", marginBottom: 4 }}>🎚️ {t("resp_self")}</div>
        <div style={{ fontSize: 10, color: "var(--tx1)", marginBottom: 8 }}>{t("resp_limit_q")}</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
          {[0, 5, 10, 20].map(v => <button key={v} onClick={() => setSel(v)} style={{ padding: "5px 12px", borderRadius: 6, border: `1px solid ${sel === v ? "#3fb950" : "var(--bd0)"}`, background: sel === v ? "#3fb95022" : "transparent", color: sel === v ? "#3fb950" : "var(--tx1)", fontSize: 11, cursor: "pointer", fontWeight: sel === v ? 700 : 400 }}>{v === 0 ? "∞" : v}</button>)}
        </div>
        <Btn primary c="#3fb950" onClick={() => setLimit(sel)}>{t("resp_save")}</Btn>
        {limit > 0 && <span style={{ marginLeft: 8, fontSize: 11, color: "#3fb950" }}>✓ {t("resp_self_on")}: {limit}</span>}
      </Card>
      <div style={{ background: "var(--bg1)", border: "1px solid var(--ovB)", borderRadius: 8, padding: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--tx0)", marginBottom: 4 }}>🆘 {t("resp_help_t")}</div>
        <div style={{ fontSize: 11, color: "var(--tx1)", marginBottom: 8 }}>{t("resp_help")}</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", fontSize: 11 }}>
          <span style={{ color: "#58a6ff" }}>BeGambleAware.org</span>
          <span style={{ color: "#58a6ff" }}>GamCare 0808 8020 133</span>
        </div>
      </div>
    </div>
  );
}

// ── HUB "MAIS" ──
function MoreHub({ lotId, setLot, saved, limit, setLimit }) {
  const { t } = useT();
  const [tab, setTab] = useState("share");
  const tabs = [{ id: "share", l: t("x_share"), i: "📲" }, { id: "compare", l: t("x_compare"), i: "⚖️" }, { id: "calc", l: t("calc_tab"), i: "🧮" }, { id: "dream", l: t("x_dream"), i: "💭" }, { id: "unclaimed", l: t("unclaimed_tab"), i: "🎁" }, { id: "export", l: t("x_export"), i: "🖨️" }, { id: "faq", l: t("faq_tab"), i: "❓" }, { id: "resp", l: t("x_responsible"), i: "🛟" }];
  return (
    <div>
      <div style={{ display: "flex", gap: 2, marginBottom: 10, flexWrap: "wrap" }}>
        {tabs.map(tb => <button key={tb.id} onClick={() => setTab(tb.id)} style={{ padding: "6px 8px", fontSize: 10, cursor: "pointer", border: "none", background: tab === tb.id ? "#f5c51818" : "transparent", color: tab === tb.id ? "#f5c518" : "var(--tx1)", fontWeight: tab === tb.id ? 700 : 400, borderBottom: tab === tb.id ? "2px solid #f5c518" : "2px solid transparent" }}>{tb.i} {tb.l}</button>)}
      </div>
      {tab === "share" && <ShareGame lotId={lotId} setLot={setLot} />}
      {tab === "compare" && <Compare />}
      {tab === "calc" && <Calc lotId={lotId} setLot={setLot} />}
      {tab === "dream" && <Dreams lotId={lotId} setLot={setLot} />}
      {tab === "unclaimed" && <Unclaimed />}
      {tab === "export" && <ExportGames saved={saved} />}
      {tab === "faq" && <FAQ />}
      {tab === "resp" && <Responsible limit={limit} setLimit={setLimit} />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// LOTE 3 DE FUNCIONALIDADES
// ═══════════════════════════════════════════════════════════════

// ── CALCULADORA "VALE A PENA?" ──
function Calc({ lotId, setLot }) {
  const { t } = useT();
  const lot = LOTS.find(l => l.id === lotId);
  const [week, setWeek] = useState(5);
  const drawsYear = 104;
  const perDraw = (week / 2).toFixed(2);
  const perYear = (week * 52).toFixed(0);
  return (
    <div>
      <LotSel lotId={lotId} set={setLot} />
      <STitle c="#f5c518" i="🧮">{t("calc_title")}</STitle>
      <Card style={{ marginBottom: 8, padding: "6px 10px" }}><div style={{ fontSize: 10, color: "var(--tx1)" }}>{t("calc_desc")}</div></Card>
      <Card style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 11, color: "var(--tx1)", marginBottom: 8 }}>{t("calc_week")} (£)</div>
        <input type="range" min="1" max="50" value={week} onChange={e => setWeek(Number(e.target.value))} style={{ width: "100%" }} />
        <div style={{ textAlign: "center", fontSize: 24, fontWeight: 800, color: "#f5c518", marginTop: 4 }}>£{week}</div>
      </Card>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
        <div style={{ background: "var(--bg1)", border: "1px solid var(--ovB)", borderRadius: 8, padding: 12, textAlign: "center" }}>
          <div style={{ fontSize: 10, color: "var(--tx1)" }}>{t("calc_year")}</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#f85149" }}>£{perYear}</div>
          <div style={{ fontSize: 9, color: "var(--tx1)" }}>{drawsYear} {t("calc_draws")}</div>
        </div>
        <div style={{ background: "var(--bg1)", border: "1px solid var(--ovB)", borderRadius: 8, padding: 12, textAlign: "center" }}>
          <div style={{ fontSize: 10, color: "var(--tx1)" }}>{t("calc_odds")}</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: "var(--tx0)", marginTop: 4 }}>{fmt(t("calc_oddsV"), fmtOdds(ODDS[lotId]))}</div>
        </div>
      </div>
      <div style={{ background: "#3fb95011", border: "1px solid #3fb95044", borderRadius: 8, padding: 10, fontSize: 10, color: "#3fb950" }}>🛟 {t("calc_note")}</div>
    </div>
  );
}

// ── VERIFICADOR RÁPIDO DE BILHETE ──
function Checker({ lotId, setLot }) {
  const { t } = useT();
  const lot = LOTS.find(l => l.id === lotId);
  const [marc, setMarc] = useState(new Set());
  const [res, setRes] = useState(null);
  function tg(n) { setMarc(p => { const s = new Set(p); if (s.has(n)) s.delete(n); else if (s.size < lot.bolas) s.add(n); return s; }); setRes(null); }
  function verificar() { const hits = [...marc].filter(n => lot.nums.includes(n)).length; setRes(hits); }
  return (
    <div>
      <LotSel lotId={lotId} set={setLot} />
      <STitle c="#3fb950" i="🎫">{t("chk_title")} — {lot.nome}</STitle>
      <Card style={{ marginBottom: 8, padding: "6px 10px" }}><div style={{ fontSize: 10, color: "var(--tx1)" }}>{t("chk_desc")}</div></Card>
      <Card style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 10, color: "var(--tx1)", marginBottom: 6 }}>{t("chk_your")} ({marc.size}/{lot.bolas})</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(10,1fr)", gap: 3, marginBottom: 8 }}>
          {range(lot.max).map(n => { const s = marc.has(n); return <button key={n} onClick={() => tg(n)} style={{ aspectRatio: "1", borderRadius: 4, border: `1px solid ${s ? lot.cor : "var(--bd0)"}`, background: s ? lot.cor : "var(--bg0)", color: s ? (lot.tc || "#1a1a1a") : "var(--tx1)", fontWeight: s ? 700 : 400, fontSize: 9, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>{pad(n)}</button>; })}
        </div>
        <Btn primary c="#3fb950" onClick={verificar} disabled={marc.size === 0}>{t("chk_btn")}</Btn>
      </Card>
      {res !== null && (
        <div style={{ background: res >= 2 ? "#3fb95011" : "var(--bg1)", border: `1px solid ${res >= 2 ? "#3fb95066" : "var(--ovB)"}`, borderRadius: 8, padding: 14, textAlign: "center" }}>
          <div style={{ fontSize: 30, marginBottom: 4 }}>{res >= 3 ? "🎉" : res >= 1 ? "👍" : "🍀"}</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: res >= 2 ? "#3fb950" : "var(--tx0)" }}>{res >= 2 ? fmt(t("chk_win"), res) : fmt(t("chk_noWin"), res)}</div>
          <div style={{ display: "flex", gap: 4, justifyContent: "center", marginTop: 8, flexWrap: "wrap" }}>{[...marc].sort((a, b) => a - b).map(n => <Ball key={n} n={n} c={lot.nums.includes(n) ? "#3fb950" : lot.cor} s={26} />)}</div>
        </div>
      )}
    </div>
  );
}

// ── PRÉMIOS NÃO RECLAMADOS ──
function Unclaimed() {
  const { t } = useT();
  const rows = LOTS.map((l, i) => ({ lot: l, val: l.jack, region: l.flag + " " + l.short, days: 30 + Math.floor(sr(i + 3, 5) * 150) }));
  return (
    <div>
      <STitle c="#bc8cff" i="🎁">{t("unclaimed_title")}</STitle>
      <Card style={{ marginBottom: 8, padding: "6px 10px" }}><div style={{ fontSize: 10, color: "var(--tx1)" }}>{t("unclaimed_desc")}</div></Card>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
          <thead><tr style={{ background: "var(--bg2)" }}>{[t("unclaimed_region"), t("unclaimed_value"), t("unclaimed_deadline")].map(h => <th key={h} style={{ padding: "6px 8px", textAlign: "left", border: "1px solid var(--ovB)", color: "var(--tx1)", fontWeight: 600, fontSize: 10 }}>{h}</th>)}</tr></thead>
          <tbody>{rows.map((r, i) => (
            <tr key={i}>
              <td style={{ padding: "7px 8px", border: "1px solid var(--ovB)", color: "var(--tx0)", fontWeight: 600 }}>{r.region}</td>
              <td style={{ padding: "7px 8px", border: "1px solid var(--ovB)", color: "#f5c518", fontWeight: 700 }}>{r.val}</td>
              <td style={{ padding: "7px 8px", border: "1px solid var(--ovB)", color: r.days < 60 ? "#f85149" : "var(--tx1)" }}>{r.days} dias</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      <div style={{ fontSize: 9, color: "var(--tx3)", marginTop: 8 }}>{t("unclaimed_note")}</div>
    </div>
  );
}

// ── HISTÓRICO PESSOAL ──
function History({ saved }) {
  const { t } = useT();
  const total = saved.length;
  let best = 0, sum = 0;
  saved.forEach(g => { const lot = LOTS.find(l => l.id === g.lotId); const h = g.nums.filter(n => lot.nums.includes(n)).length; if (h > best) best = h; sum += h; });
  const avg = total ? (sum / total).toFixed(1) : "0";
  return (
    <div>
      <STitle c="#79c0ff" i="📈">{t("hist_title")}</STitle>
      <Card style={{ marginBottom: 8, padding: "6px 10px" }}><div style={{ fontSize: 10, color: "var(--tx1)" }}>{t("hist_desc")}</div></Card>
      {total === 0 ? (
        <Card style={{ textAlign: "center", padding: 24 }}><div style={{ fontSize: 28, marginBottom: 6 }}>📈</div><div style={{ fontSize: 12, color: "var(--tx1)" }}>{t("hist_none")}</div></Card>
      ) : (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 10 }}>
            {[[t("hist_total"), total, "#79c0ff"], [t("hist_best"), best, "#3fb950"], [t("hist_avg"), avg, "#f5c518"]].map((c, i) => (
              <div key={i} style={{ background: "var(--bg1)", border: "1px solid var(--ovB)", borderRadius: 8, padding: 12, textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: c[2] }}>{c[1]}</div>
                <div style={{ fontSize: 9, color: "var(--tx1)", marginTop: 2 }}>{c[0]}</div>
              </div>
            ))}
          </div>
          <Card>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 90 }}>
              {saved.slice(0, 14).reverse().map((g, i) => { const lot = LOTS.find(l => l.id === g.lotId); const h = g.nums.filter(n => lot.nums.includes(n)).length; const pct = (h / lot.bolas) * 100; return <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}><div style={{ width: "100%", maxWidth: 18, height: Math.max(6, pct) + "%", minHeight: 6, background: h >= 2 ? "#3fb950" : "#79c0ff", borderRadius: "3px 3px 0 0" }} /></div>; })}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// ── FAQ + GLOSSÁRIO ──
function FAQ() {
  const { t } = useT();
  const [open, setOpen] = useState(0);
  const qa = [[t("faq_q1"), t("faq_a1")], [t("faq_q2"), t("faq_a2")], [t("faq_q3"), t("faq_a3")], [t("faq_q4"), t("faq_a4")]];
  const gloss = [[t("gl1t"), t("gl1d")], [t("gl2t"), t("gl2d")], [t("gl3t"), t("gl3d")], [t("gl4t"), t("gl4d")]];
  return (
    <div>
      <STitle c="#f5c518" i="❓">{t("faq_title")}</STitle>
      <Card style={{ marginBottom: 8, padding: "6px 10px" }}><div style={{ fontSize: 10, color: "var(--tx1)" }}>{t("faq_desc")}</div></Card>
      <div style={{ marginBottom: 14 }}>
        {qa.map((q, i) => (
          <div key={i} style={{ background: "var(--bg1)", border: "1px solid var(--ovB)", borderRadius: 8, marginBottom: 6, overflow: "hidden" }}>
            <button onClick={() => setOpen(open === i ? -1 : i)} style={{ width: "100%", boxSizing: "border-box", textAlign: "left", padding: "10px 12px", background: "transparent", border: "none", color: "var(--tx0)", fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>{q[0]}<span style={{ color: "var(--tx1)", fontSize: 10 }}>{open === i ? "▲" : "▼"}</span></button>
            {open === i && <div style={{ padding: "0 12px 10px", fontSize: 11, color: "var(--tx2)", lineHeight: 1.5 }}>{q[1]}</div>}
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--tx1)", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>📖 {t("glossary_title")}</div>
      {gloss.map((g, i) => (
        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 5 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#f5c518", minWidth: 110 }}>{g[0]}</span>
          <span style={{ fontSize: 11, color: "var(--tx1)" }}>{g[1]}</span>
        </div>
      ))}
    </div>
  );
}

// ── ONDE JOGA O MEU NÚMERO (mesmo número) ──
function SameNumber() {
  const { t } = useT();
  const [num, setNum] = useState(7);
  const data = LOTS.filter(l => num <= l.max).map(l => ({ lot: l, freq: Math.round(40 + sr(num, l.id.length) * 50) }));
  const maxF = Math.max(...data.map(d => d.freq), 1);
  return (
    <div>
      <STitle c="#bc8cff" i="🔢">{t("samenum_title")}</STitle>
      <Card style={{ marginBottom: 8, padding: "6px 10px" }}><div style={{ fontSize: 10, color: "var(--tx1)" }}>{t("samenum_desc")}</div></Card>
      <Card style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 10, color: "var(--tx1)", marginBottom: 6 }}>{t("samenum_pick")}</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(10,1fr)", gap: 3 }}>
          {range(50).map(n => { const s = num === n; return <button key={n} onClick={() => setNum(n)} style={{ aspectRatio: "1", borderRadius: 4, border: `1px solid ${s ? "#bc8cff" : "var(--bd0)"}`, background: s ? "#bc8cff" : "var(--bg0)", color: s ? "#fff" : "var(--tx1)", fontWeight: s ? 700 : 400, fontSize: 9, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>{pad(n)}</button>; })}
        </div>
      </Card>
      <Card>
        <div style={{ fontSize: 11, fontWeight: 600, color: "var(--tx0)", marginBottom: 10 }}>{t("samenum_result")} — <span style={{ color: "#bc8cff" }}>{pad(num)}</span></div>
        {data.map((d, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--tx1)", marginBottom: 2 }}><span>{d.lot.flag} {d.lot.short}</span><span style={{ color: "#bc8cff", fontWeight: 600 }}>{d.freq}×</span></div>
            <div style={{ background: "var(--bg0)", borderRadius: 4, height: 8, overflow: "hidden" }}><div style={{ width: (d.freq / maxF * 100) + "%", height: "100%", background: d.lot.cor }} /></div>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// HOME
// ═══════════════════════════════════════════════════════════════
function Home() {
  const { t } = useT();
  const loterias = useResultados();
  return (
    <div>
      <Countdown />
      {loterias.map(l => (
        <div key={l.id} style={{ background: "var(--bg1)", border: "1px solid var(--ovB)", borderLeft: `4px solid ${l.cor}`, borderRadius: 8, padding: "10px 12px", marginBottom: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: "var(--tx0)" }}>{l.flag} {l.nome}</div>
              <div style={{ fontSize: 10, color: "var(--tx1)", marginTop: 1 }}>{t("h_jack")} <span style={{ color: "#f5c518", fontWeight: 600 }}>{l.jack}</span></div>
            </div>
            <span style={{ background: l.cor + "22", color: l.cor, border: `1px solid ${l.cor}44`, borderRadius: 4, padding: "1px 6px", fontSize: 9, fontWeight: 700 }}>{t("h_res")}</span>
          </div>
          <div style={{ display: "flex", gap: 5, alignItems: "center", flexWrap: "wrap" }}>
            {l.nums.map(n => <Ball key={n} n={n} c={l.cor} s={32} />)}
            {l.extra.length > 0 && <span style={{ color: "var(--tx1)", fontSize: 12 }}>+</span>}
            {l.extra.map(n => <Ball key={"e" + n} n={n} s={32} />)}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 10, color: "var(--tx1)" }}>
            <span>{l.extra.length > 0 ? l.el + ": " + l.extra.join(",") : ""}</span>
            <span>{t("h_next")} <span style={{ color: "var(--tx0)" }}>{l.next}</span></span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ESTRATÉGIA
// ═══════════════════════════════════════════════════════════════
function Strategy({ lotId, setLot }) {
  const { t } = useT();
  const lot = LOTS.find(l => l.id === lotId);
  const liveR = useLotLive(lotId);
  const [tab, setTab] = useState("freq");
  const [ordCampo, setOrdCampo] = useState("num");
  const [ordDir, setOrdDir] = useState("asc");
  const realFreq = !!(liveR && liveR.freq);
  const realAtraso = !!(liveR && liveR.atraso);
  const freq = useMemo(() => {
    if (realFreq) return range(lot.max).map(n => ({ n, v: liveR.freq[n] || 0 }));
    return range(lot.max).map(n => ({ n, v: Math.round((362 * lot.bolas / lot.max) + (sr(n, lotId.length) - 0.5) * 20) }));
  }, [lotId, lot.max, lot.bolas, realFreq, liveR]);
  const atraso = useMemo(() => {
    if (realAtraso) return range(lot.max).map(n => ({ n, a: liveR.atraso[n] != null ? liveR.atraso[n] : 0 }));
    return range(lot.max).map(n => ({ n, a: Math.round(sr(n, lotId.length + 1) * 28) }));
  }, [lotId, lot.max, realAtraso, liveR]);
  const hotCold = useMemo(() => {
    if (realFreq) {
      const arr = range(lot.max).map(n => ({ n, v: liveR.freq[n] || 0 }));
      const hot = [...arr].sort((a, b) => b.v - a.v).slice(0, 10).map(x => x.n);
      const cold = [...arr].sort((a, b) => a.v - b.v).slice(0, 10).map(x => x.n);
      return { hot, cold, real: true };
    }
    return { hot: HOT[lotId], cold: COLD[lotId], real: false };
  }, [lotId, lot.max, realFreq, liveR]);
  const sortedFreq = useMemo(() => { const s = [...freq]; s.sort((a, b) => ordCampo === "num" ? (ordDir === "asc" ? a.n - b.n : b.n - a.n) : (ordDir === "asc" ? a.v - b.v : b.v - a.v)); return s; }, [freq, ordCampo, ordDir]);
  const sortedAtraso = useMemo(() => { const s = [...atraso]; s.sort((a, b) => ordCampo === "num" ? (ordDir === "asc" ? a.n - b.n : b.n - a.n) : (ordDir === "asc" ? a.a - b.a : b.a - a.a)); return s; }, [atraso, ordCampo, ordDir]);
  const pares = lot.nums.filter(n => n % 2 === 0);
  const impares = lot.nums.filter(n => n % 2 !== 0);
  const tabs = [{ id: "freq", l: t("s_freq") }, { id: "atraso", l: t("s_delay") }, { id: "trend", l: t("s_trend") }, { id: "hot", l: t("s_hot") }, { id: "pi", l: t("s_pi") }, { id: "check", l: t("chk_tab") }, { id: "samenum", l: t("samenum_tab") }];
  return (
    <div>
      <LotSel lotId={lotId} set={setLot} />
      <div style={{ display: "flex", gap: 2, marginBottom: 10, flexWrap: "wrap" }}>
        {tabs.map(tb => <button key={tb.id} onClick={() => setTab(tb.id)} style={{ padding: "6px 10px", fontSize: 11, cursor: "pointer", border: "none", background: tab === tb.id ? "#f5c51818" : "transparent", color: tab === tb.id ? "#f5c518" : "var(--tx1)", fontWeight: tab === tb.id ? 700 : 400, borderBottom: tab === tb.id ? "2px solid #f5c518" : "2px solid transparent" }}>{tb.l}</button>)}
      </div>
      {(tab === "freq" || tab === "atraso") && (
        <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <span style={{ fontSize: 10, color: "var(--tx1)" }}>{t("s_sort")}</span>
            {[["num", t("s_nums")], ["val", tab === "freq" ? t("s_qty") : t("s_delay")]].map(o => <button key={o[0]} onClick={() => setOrdCampo(o[0])} style={{ padding: "3px 8px", borderRadius: 4, border: `1px solid ${ordCampo === o[0] ? "#f5c518" : "var(--bd0)"}`, background: ordCampo === o[0] ? "#f5c51822" : "transparent", color: ordCampo === o[0] ? "#f5c518" : "var(--tx1)", fontSize: 10, cursor: "pointer" }}>{o[1]}</button>)}
          </div>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <span style={{ fontSize: 10, color: "var(--tx1)" }}>{t("s_order")}</span>
            {[["asc", t("s_asc")], ["desc", t("s_desc")]].map(o => <button key={o[0]} onClick={() => setOrdDir(o[0])} style={{ padding: "3px 8px", borderRadius: 4, border: `1px solid ${ordDir === o[0] ? "#f5c518" : "var(--bd0)"}`, background: ordDir === o[0] ? "#f5c51822" : "transparent", color: ordDir === o[0] ? "#f5c518" : "var(--tx1)", fontSize: 10, cursor: "pointer" }}>{o[1]}</button>)}
          </div>
        </div>
      )}
      {tab === "freq" && (
        <div>
          <Card style={{ marginBottom: 8, padding: "6px 10px" }}><div style={{ fontSize: 10, color: "var(--tx1)" }}>{fmt(t("s_freqEx"), freq[0].v)}{realFreq ? " · " + fmt(t("real_window"), liveR.janela || 50) : " · " + t("illus_note")}</div></Card>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
              <thead><tr style={{ background: "var(--bg2)" }}>{range(10).map(i => <th key={i} style={{ padding: "5px 3px", textAlign: "center", border: "1px solid var(--ovB)", color: "var(--tx1)", fontWeight: 600, fontSize: 9 }}>{t("col_n")}<br />{t("s_qty")}</th>)}</tr></thead>
              <tbody>{chunk(sortedFreq, 10).map((row, ri) => (
                <tr key={ri} style={{ background: ri % 2 ? "var(--ovR)" : "transparent" }}>
                  {row.map((item, ci) => <td key={ci} style={{ padding: "4px 3px", textAlign: "center", border: "1px solid var(--ovB)" }}><div style={{ fontWeight: 700, color: "var(--tx0)", fontFamily: "monospace", fontSize: 12 }}>{pad(item.n)}</div><div style={{ color: "#f5c518", fontWeight: 600, fontSize: 11 }}>{item.v}</div></td>)}
                  {range(10 - row.length).map(i => <td key={"p" + i} style={{ border: "1px solid var(--ovB)" }} />)}
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}
      {tab === "atraso" && (
        <div>
          <Card style={{ marginBottom: 8, padding: "6px 10px" }}><div style={{ fontSize: 10, color: "var(--tx1)" }}>{t("s_delayDesc")} <span style={{ color: "#3fb950" }}>■</span> {t("s_recent")} <span style={{ color: "#f5c518" }}>■</span> {t("s_med")} <span style={{ color: "#f85149" }}>■</span> {t("s_late")}{realAtraso ? " · " + fmt(t("real_window"), liveR.janela || 50) : " · " + t("illus_note")}</div></Card>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
              <thead><tr style={{ background: "var(--bg2)" }}>{range(10).map(i => <th key={i} style={{ padding: "5px 3px", textAlign: "center", border: "1px solid var(--ovB)", color: "var(--tx1)", fontWeight: 600, fontSize: 9 }}>{t("col_n")}<br />{t("s_delay")}</th>)}</tr></thead>
              <tbody>{chunk(sortedAtraso, 10).map((row, ri) => (
                <tr key={ri} style={{ background: ri % 2 ? "var(--ovR)" : "transparent" }}>
                  {row.map((item, ci) => <td key={ci} style={{ padding: "4px 3px", textAlign: "center", border: "1px solid var(--ovB)" }}><div style={{ fontWeight: 700, color: "var(--tx0)", fontFamily: "monospace", fontSize: 12 }}>{pad(item.n)}</div><div style={{ color: item.a > 15 ? "#f85149" : item.a > 8 ? "#f5c518" : "#3fb950", fontWeight: 600, fontSize: 11 }}>{item.a}</div></td>)}
                  {range(10 - row.length).map(i => <td key={"p" + i} style={{ border: "1px solid var(--ovB)" }} />)}
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}
      {tab === "trend" && <Trends lotId={lotId} />}
      {tab === "check" && <Checker lotId={lotId} setLot={setLot} />}
      {tab === "samenum" && <SameNumber />}
      {tab === "hot" && (
        <div>
          <Card style={{ marginBottom: 8, padding: "6px 10px" }}><div style={{ fontSize: 10, color: "var(--tx1)" }}>{hotCold.real ? fmt(t("real_window"), liveR.janela || 50) : t("illus_note")}</div></Card>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <Card><STitle c="#f85149" i="🔥">{t("s_hotT")}</STitle><div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>{hotCold.hot.map(n => <Ball key={n} n={n} c="#7f1d1d" s={26} />)}</div><div style={{ fontSize: 10, color: "var(--tx1)", marginTop: 4 }}>{t("s_most")}</div></Card>
            <Card><STitle c="#79c0ff" i="❄️">{t("s_coldT")}</STitle><div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>{hotCold.cold.map(n => <Ball key={n} n={n} c="#0d1f3a" s={26} />)}</div><div style={{ fontSize: 10, color: "var(--tx1)", marginTop: 4 }}>{t("s_least")}</div></Card>
          </div>
        </div>
      )}
      {tab === "pi" && (
        <Card>
          <STitle c="#3fb950" i="📐">{t("s_piT")}</STitle>
          <div style={{ display: "flex", gap: 16, marginBottom: 6 }}>
            <div><div style={{ fontSize: 10, color: "var(--tx1)", marginBottom: 3 }}>{t("s_evens")} ({pares.length})</div><div style={{ display: "flex", gap: 3 }}>{pares.map(n => <Ball key={n} n={n} c="#1a56db" s={24} />)}</div></div>
            <div><div style={{ fontSize: 10, color: "var(--tx1)", marginBottom: 3 }}>{t("s_odds")} ({impares.length})</div><div style={{ display: "flex", gap: 3 }}>{impares.map(n => <Ball key={n} n={n} c="#7c3aed" s={24} />)}</div></div>
          </div>
          <div style={{ fontSize: 10, color: "var(--tx1)" }}>{t("s_piIdeal")}</div>
        </Card>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// NUMEROLOGIA
// ═══════════════════════════════════════════════════════════════
function Numer({ onNumero }) {
  const { t, lang } = useT();
  const [bd, setBd] = useState("");
  const [nv, setNv] = useState(null);
  useEffect(() => { if (bd.length === 10) { setNv(calcNV(bd)); if (onNumero) onNumero(); } else setNv(null); }, [bd]);
  const m = nv ? sigFor(lang, nv) : null;
  return (
    <div>
      <Card style={{ marginBottom: 10 }}>
        <STitle c="#bc8cff" i="🔮">{t("n_title")}</STitle>
        <div style={{ fontSize: 11, color: "var(--tx1)", marginBottom: 6 }}>{t("n_dob")}</div>
        <input type="date" value={bd} onChange={e => setBd(e.target.value)} style={{ width: "100%", boxSizing: "border-box", background: "var(--bg0)", border: "1px solid var(--bd0)", borderRadius: 6, color: "var(--tx0)", padding: "7px 10px", fontSize: 13 }} />
      </Card>
      {nv && m ? (
        <div>
          <div style={{ background: "#1a0533", border: "1px solid #bc8cff44", borderRadius: 8, padding: 14, marginBottom: 10, textAlign: "center" }}>
            <div style={{ fontSize: 10, color: "#bc8cff", letterSpacing: 1 }}>{t("n_your")}</div>
            <div style={{ fontSize: 48, fontWeight: 800, color: "#bc8cff", lineHeight: 1 }}>{nv}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--tx0)", marginTop: 4 }}>{m.t}</div>
            <div style={{ fontSize: 11, color: "var(--tx1)", marginTop: 3 }}>{m.d}</div>
          </div>
          <Card><STitle c="#f5c518" i="⭐">{t("n_lucky")}</STitle><div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{m.l.map(n => <Ball key={n} n={n} c="#bc8cff" s={36} />)}</div></Card>
        </div>
      ) : (
        <Card style={{ textAlign: "center", padding: 20 }}><div style={{ fontSize: 28, marginBottom: 6 }}>🔮</div><div style={{ fontSize: 12, color: "var(--tx1)" }}>{t("n_above")}</div></Card>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PLANILHAS
// ═══════════════════════════════════════════════════════════════
function Plan({ lotId, setLot }) {
  const { t } = useT();
  const lot = LOTS.find(l => l.id === lotId);
  const [tool, setTool] = useState("grupos");
  const [inp, setInp] = useState("");
  const [ch, setCh] = useState(3);
  const [res, setRes] = useState([]);
  const [err, setErr] = useState("");
  const [qt, setQt] = useState(5);
  const [sd, setSd] = useState(1);
  const [marc, setMarc] = useState(new Set());
  const [conf, setConf] = useState(null);
  const tools = [{ id: "grupos", l: t("pl_grp"), i: "⭐" }, { id: "fech", l: t("pl_fech"), i: "🎡" }, { id: "palp", l: t("pl_palp"), i: "🎯" }, { id: "conf", l: t("pl_conf"), i: "✅" }];

  const grupos = useMemo(() => {
    const r = [];
    for (let i = 0; i < 20; i++) {
      const ns = []; const u = new Set();
      for (let j = 0; j < 3; j++) { let n, g = 0; do { n = Math.floor(sr(i * 10 + j + g * 97, lotId.length + 3) * lot.max) + 1; g++; } while (u.has(n) && g < 500); u.add(n); ns.push(n); }
      ns.sort((a, b) => a - b);
      r.push({ ns, oc: Math.floor(sr(i, lotId.length + 3) * 12) + 2, at: Math.floor(sr(i + 50, lotId.length) * 30) });
    }
    return r.sort((a, b) => b.oc - a.oc);
  }, [lotId, lot.max]);

  const palps = useMemo(() => {
    const r = [];
    for (let i = 0; i < qt; i++) {
      const ns = new Set();
      let g = 0; while (ns.size < lot.bolas && g < 1000) { ns.add(Math.floor(sr(i * 100 + g + sd, lotId.length + sd) * lot.max) + 1); g++; }
      const a = [...ns].sort((x, y) => x - y);
      const p = a.filter(n => n % 2 === 0).length;
      r.push({ ns: a, p, i: lot.bolas - p, s: a.reduce((x, y) => x + y, 0) });
    }
    return r;
  }, [lotId, qt, sd, lot.bolas, lot.max]);

  function gerarFech() {
    setErr("");
    const ns = inp.split(",").map(x => parseInt(x.trim())).filter(n => !isNaN(n) && n >= 1 && n <= lot.max);
    const uq = [...new Set(ns)];
    if (uq.length < lot.bolas) { setErr(fmt(t("pl_fNums"), lot.bolas)); return; }
    if (uq.length > 15) { setErr("Máx. 15"); return; }
    const cm = combos(uq, ch); const ap = []; const cob = new Set();
    for (const c of cm) {
      if (cob.has(c.join("-"))) continue;
      const a = [...c]; const rest = uq.filter(n => !c.includes(n)); const sh = shuffle(rest, ap.length + 1);
      for (let i = 0; a.length < lot.bolas && i < sh.length; i++) a.push(sh[i]);
      if (a.length === lot.bolas) { a.sort((x, y) => x - y); ap.push(a); combos(a, ch).forEach(s => cob.add(s.join("-"))); }
      if (ap.length >= 1000) break;
    }
    setRes(ap);
  }
  function conferir() {
    if (marc.size < lot.bolas) return;
    const arr = [...marc]; const pt = {};
    for (let i = 0; i <= lot.bolas; i++) pt[i] = 0;
    for (let c = 0; c < 362; c++) { const st = new Set(); let g = 0; while (st.size < lot.bolas && g < 1000) { st.add(Math.floor(sr(c * 20 + g, lotId.length + 7) * lot.max) + 1); g++; } pt[arr.filter(n => st.has(n)).length]++; }
    setConf(pt);
  }
  function tgM(n) { setMarc(p => { const s = new Set(p); if (s.has(n)) s.delete(n); else if (s.size < 15) s.add(n); return s; }); setConf(null); }

  return (
    <div>
      <LotSel lotId={lotId} set={setLot} />
      <div style={{ display: "flex", gap: 2, marginBottom: 10, flexWrap: "wrap" }}>
        {tools.map(tl => <button key={tl.id} onClick={() => setTool(tl.id)} style={{ padding: "6px 8px", fontSize: 10, cursor: "pointer", border: "none", background: tool === tl.id ? "#f5c51818" : "transparent", color: tool === tl.id ? "#f5c518" : "var(--tx1)", fontWeight: tool === tl.id ? 700 : 400, borderBottom: tool === tl.id ? "2px solid #f5c518" : "2px solid transparent" }}>{tl.i} {tl.l}</button>)}
      </div>
      {tool === "grupos" && (
        <div>
          <STitle c="#f5c518" i="⭐">{t("pl_grpT")} — {lot.nome}</STitle>
          <Ins passos={[t("pl_grpS1"), t("pl_grpS2"), t("pl_grpS3")]} limites={[fmt(t("pl_uni"), pad(lot.max)), t("pl_362")]} />
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
            <thead><tr style={{ background: "var(--bg2)" }}>{["#", t("c_grp"), t("c_oc"), t("c_at")].map(h => <th key={h} style={{ padding: "5px 8px", textAlign: "center", border: "1px solid var(--ovB)", color: "var(--tx1)", fontWeight: 600, fontSize: 10 }}>{h}</th>)}</tr></thead>
            <tbody>{grupos.map((g, i) => (
              <tr key={i} style={{ background: i % 2 ? "var(--ovR)" : "transparent" }}>
                <td style={{ padding: "4px 6px", textAlign: "center", border: "1px solid var(--ovB)", color: "var(--tx1)" }}>{i + 1}</td>
                <td style={{ padding: "4px 6px", border: "1px solid var(--ovB)" }}><div style={{ display: "flex", gap: 3, justifyContent: "center" }}>{g.ns.map(n => <Ball key={n} n={n} c={lot.cor} s={22} />)}</div></td>
                <td style={{ padding: "4px 6px", textAlign: "center", border: "1px solid var(--ovB)", color: "var(--tx0)", fontWeight: 600 }}>{g.oc}</td>
                <td style={{ padding: "4px 6px", textAlign: "center", border: "1px solid var(--ovB)", color: g.at > 15 ? "#f85149" : g.at > 8 ? "#f5c518" : "#3fb950" }}>{g.at}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
      {tool === "fech" && (
        <div>
          <STitle c="#3fb950" i="🎡">{t("pl_fT")} — {lot.nome}</STitle>
          <Ins passos={[fmt(t("pl_fS1"), lot.bolas), t("pl_fS2"), t("pl_fS3")]} limites={[fmt(t("pl_fMin"), lot.bolas), t("pl_f50")]} />
          <Card style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 10, color: "var(--tx1)", marginBottom: 4 }}>{fmt(t("pl_fNums"), lot.bolas)}</div>
            <input value={inp} onChange={e => setInp(e.target.value)} placeholder={"Ex: 3,7,14,21,28,35" + (lot.bolas > 5 ? ",42" : "")} style={{ width: "100%", boxSizing: "border-box", background: "var(--bg0)", border: "1px solid var(--bd0)", borderRadius: 6, color: "var(--tx0)", padding: "7px 10px", fontSize: 12, marginBottom: 8 }} />
            <div style={{ fontSize: 10, color: "var(--tx1)", marginBottom: 4 }}>{t("pl_chances")}</div>
            <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>{[2, 3, 4].filter(g => g < lot.bolas).map(g => <button key={g} onClick={() => setCh(g)} style={{ padding: "4px 10px", borderRadius: 4, border: `1px solid ${ch === g ? "#3fb950" : "var(--bd0)"}`, background: ch === g ? "#3fb95022" : "transparent", color: ch === g ? "#3fb950" : "var(--tx1)", fontSize: 11, cursor: "pointer" }}>{g} {t("pl_hits")}</button>)}</div>
            <Btn primary onClick={gerarFech}>{t("generate")}</Btn>
            {err && <div style={{ fontSize: 10, color: "#f85149", marginTop: 6 }}>{err}</div>}
          </Card>
          {res.length > 0 && (
            <Card>
              <div style={{ fontSize: 11, color: "#3fb950", fontWeight: 600, marginBottom: 6 }}>{res.length} {t("pl_bets")} · {fmt(t("pl_chOf"), ch)}</div>
              <div style={{ maxHeight: 320, overflowY: "auto", paddingRight: 4 }}>
                {res.map((a, i) => <div key={i} style={{ display: "flex", gap: 7, alignItems: "center", marginBottom: 2, fontFamily: "monospace", fontSize: 12 }}><span style={{ color: "var(--tx1)", width: 34, flexShrink: 0 }}>#{pad(i + 1)}</span><span style={{ width: 8, height: 8, borderRadius: 2, background: lot.cor, display: "inline-block", flexShrink: 0 }} /><span style={{ color: "var(--tx0)", letterSpacing: 1.5 }}>{a.map(pad).join(" ")}</span></div>)}
              </div>
            </Card>
          )}
        </div>
      )}
      {tool === "palp" && (
        <div>
          <STitle c="#79c0ff" i="🎯">{t("pl_pT")} — {lot.nome}</STitle>
          <Ins passos={[t("pl_pS1"), t("pl_pS2"), fmt(t("pl_pS3"), lot.bolas, pad(lot.max))]} limites={[t("pl_pLim")]} />
          <div style={{ display: "flex", gap: 6, marginBottom: 10, alignItems: "center", flexWrap: "wrap" }}>
            {[5, 10, 15, 20].map(q => <button key={q} onClick={() => setQt(q)} style={{ padding: "4px 10px", borderRadius: 4, border: `1px solid ${qt === q ? "#79c0ff" : "var(--bd0)"}`, background: qt === q ? "#79c0ff22" : "transparent", color: qt === q ? "#79c0ff" : "var(--tx1)", fontSize: 11, cursor: "pointer" }}>{q}</button>)}
            <Btn onClick={() => setSd(s => s + 1)}>{t("pl_new")}</Btn>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
            <thead><tr style={{ background: "var(--bg2)" }}>{["#", t("s_nums"), "P", "I", t("c_sum")].map(h => <th key={h} style={{ padding: "5px 6px", textAlign: "center", border: "1px solid var(--ovB)", color: "var(--tx1)", fontWeight: 600, fontSize: 10 }}>{h}</th>)}</tr></thead>
            <tbody>{palps.map((j, i) => (
              <tr key={i} style={{ background: i % 2 ? "var(--ovR)" : "transparent" }}>
                <td style={{ padding: "4px 6px", textAlign: "center", border: "1px solid var(--ovB)", color: "var(--tx1)" }}>{i + 1}</td>
                <td style={{ padding: "4px 6px", border: "1px solid var(--ovB)" }}><div style={{ display: "flex", gap: 3, justifyContent: "center" }}>{j.ns.map(n => <Ball key={n} n={n} c={lot.cor} s={20} />)}</div></td>
                <td style={{ padding: "4px 6px", textAlign: "center", border: "1px solid var(--ovB)", color: "#1a56db" }}>{j.p}</td>
                <td style={{ padding: "4px 6px", textAlign: "center", border: "1px solid var(--ovB)", color: "#7c3aed" }}>{j.i}</td>
                <td style={{ padding: "4px 6px", textAlign: "center", border: "1px solid var(--ovB)", color: "#f5c518" }}>{j.s}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
      {tool === "conf" && (
        <div>
          <STitle c="#f5c518" i="✅">{t("pl_cT")} — {lot.nome}</STitle>
          <Ins passos={[fmt(t("pl_cS1"), lot.bolas), t("pl_cS2")]} limites={[fmt(t("pl_cMin"), lot.bolas), t("pl_362")]} />
          <Card style={{ marginBottom: 10 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(10,1fr)", gap: 3, marginBottom: 6 }}>
              {range(lot.max).map(n => { const s = marc.has(n); return <button key={n} onClick={() => tgM(n)} style={{ aspectRatio: "1", borderRadius: 4, border: `1px solid ${s ? lot.cor : "var(--bd0)"}`, background: s ? lot.cor : "var(--bg0)", color: s ? (lot.tc || "#1a1a1a") : "var(--tx1)", fontWeight: s ? 700 : 400, fontSize: 9, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>{pad(n)}</button>; })}
            </div>
            <div style={{ fontSize: 10, color: "var(--tx1)", marginBottom: 8 }}>{marc.size} {t("pl_marked")}</div>
            <Btn primary onClick={conferir} disabled={marc.size < lot.bolas}>{t("pl_check")}</Btn>
          </Card>
          {conf && (
            <Card>
              <STitle c="#3fb950" i="📊">{t("pl_result")}</STitle>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                <thead><tr style={{ background: "var(--bg2)" }}>{[t("c_hits"), t("c_oc"), "% 362"].map(h => <th key={h} style={{ padding: "5px 8px", textAlign: "center", border: "1px solid var(--ovB)", color: "var(--tx1)", fontWeight: 600, fontSize: 10 }}>{h}</th>)}</tr></thead>
                <tbody>{Object.entries(conf).sort((a, b) => parseInt(b[0]) - parseInt(a[0])).map(e => { const p = e[0], q = e[1]; return <tr key={p} style={{ background: parseInt(p) >= lot.bolas - 1 ? "#f5c51811" : "transparent" }}><td style={{ padding: "4px 8px", textAlign: "center", border: "1px solid var(--ovB)", color: parseInt(p) >= lot.bolas - 1 ? "#f5c518" : "var(--tx0)", fontWeight: 700 }}>{p}{parseInt(p) === lot.bolas ? " 🏆" : ""}</td><td style={{ padding: "4px 8px", textAlign: "center", border: "1px solid var(--ovB)", color: "var(--tx0)" }}>{q}</td><td style={{ padding: "4px 8px", textAlign: "center", border: "1px solid var(--ovB)", color: "var(--tx1)" }}>{((q / 362) * 100).toFixed(1)}%</td></tr>; })}</tbody>
              </table>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PLANILHAS ESPECIAIS
// ═══════════════════════════════════════════════════════════════
function PlanEsp({ lotId, setLot }) {
  const { t } = useT();
  const lot = LOTS.find(l => l.id === lotId);
  const [tool, setTool] = useState("esp");
  const [fixos, setFixos] = useState(new Set());
  const [vars, setVars] = useState(new Set());
  const [ch, setCh] = useState(3);
  const [res, setRes] = useState([]);
  const [err, setErr] = useState("");
  const [errar, setErrar] = useState(new Set());
  const [resE, setResE] = useState([]);
  const [sdE, setSdE] = useState(1);
  const [nuc, setNuc] = useState(new Set());
  const [orb, setOrb] = useState(new Set());
  const [resD, setResD] = useState([]);
  const [espTot, setEspTot] = useState(0);
  const [erreTot, setErreTot] = useState(0);
  const [diamTot, setDiamTot] = useState(0);
  const tools = [{ id: "esp", l: t("e_esp"), i: "🎯" }, { id: "erre", l: t("e_erre"), i: "❌" }, { id: "diam", l: t("e_diam"), i: "💎" }];

  const vFilt = [...vars].filter(n => !fixos.has(n));
  const oFilt = [...orb].filter(n => !nuc.has(n));
  const cob = (nuc.size + oFilt.length) > 0 ? Math.min(100, Math.round(((nuc.size + oFilt.length) / lot.max) * 100)) : 0;

  function gerarEsp() {
    setErr("");
    if (fixos.size < 1) { setErr("Mín. 1"); return; }
    if (fixos.size >= lot.bolas) { setErr("Máx. " + (lot.bolas - 1)); return; }
    if (vFilt.length < 2) { setErr("Mín. 2"); return; }
    const fa = [...fixos].sort((a, b) => a - b); const va = vFilt.sort((a, b) => a - b); const vn = lot.bolas - fa.length;
    if (va.length < vn) { setErr("+" + vn); return; }
    setEspTot(binom(va.length, vn));
    setRes(combosCap(va, vn, 1000).map(c => [...fa, ...c].sort((a, b) => a - b)));
  }
  function gerarErre() {
    setErr("");
    if (errar.size < 5) { setErr("Mín. 5"); return; }
    if (errar.size > lot.max - lot.bolas) { setErr("Máx. " + (lot.max - lot.bolas)); return; }
    const d = range(lot.max).filter(n => !errar.has(n)); const ap = []; const seen = new Set();
    for (let i = 0; i < 3000 && ap.length < 1000; i++) { const a = shuffle(d, sdE + i).slice(0, lot.bolas).sort((x, y) => x - y); const key = a.join(","); if (!seen.has(key)) { seen.add(key); ap.push(a); } }
    setErreTot(binom(d.length, lot.bolas));
    setResE(ap); setSdE(s => s + 1);
  }
  function gerarDiam() {
    setErr("");
    if (nuc.size < 1) { setErr("Mín. 1"); return; }
    if (nuc.size >= lot.bolas) { setErr("Máx. " + (lot.bolas - 1)); return; }
    if (oFilt.length < 2) { setErr("Mín. 2"); return; }
    const na = [...nuc].sort((a, b) => a - b); const oa = oFilt.sort((a, b) => a - b); const on = lot.bolas - na.length;
    if (oa.length < on) { setErr("+" + on); return; }
    setDiamTot(binom(oa.length, on));
    setResD(combosCap(oa, on, 1000).map(c => [...na, ...c].sort((a, b) => a - b)));
  }
  function trocarTool(id) { setTool(id); setRes([]); setResE([]); setResD([]); setErr(""); }

  return (
    <div>
      <LotSel lotId={lotId} set={setLot} />
      <div style={{ display: "flex", gap: 2, marginBottom: 10, flexWrap: "wrap" }}>
        {tools.map(tl => <button key={tl.id} onClick={() => trocarTool(tl.id)} style={{ padding: "6px 8px", fontSize: 10, cursor: "pointer", border: "none", background: tool === tl.id ? "#f5c51818" : "transparent", color: tool === tl.id ? "#f5c518" : "var(--tx1)", fontWeight: tool === tl.id ? 700 : 400, borderBottom: tool === tl.id ? "2px solid #f5c518" : "2px solid transparent" }}>{tl.i} {tl.l}</button>)}
      </div>
      {tool === "esp" && (
        <div>
          <STitle c="#dc2626" i="🎯">{t("e_espT")} — {lot.nome}</STitle>
          <Ins passos={[t("e_espS1"), t("e_espS2"), t("e_espS3"), t("e_espS4")]} limites={[fmt(t("e_fixed"), lot.bolas - 1), t("e_var2"), fmt(t("e_totMin"), lot.bolas)]} />
          <Card style={{ marginBottom: 6 }}><NumSel nums={fixos} set={setFixos} max={lot.max} cor="#dc2626" label={fmt(t("e_fixedL"), lot.bolas - 1)} /></Card>
          <Card style={{ marginBottom: 8 }}><NumSel nums={vars} set={setVars} max={lot.max} cor="#1a56db" label={t("e_varL")} dis={fixos} /></Card>
          <div style={{ display: "flex", gap: 6, marginBottom: 6, flexWrap: "wrap" }}>{[2, 3, 4].filter(g => g < lot.bolas).map(g => <button key={g} onClick={() => setCh(g)} style={{ padding: "3px 10px", borderRadius: 4, border: `1px solid ${ch === g ? "#dc2626" : "var(--bd0)"}`, background: ch === g ? "#dc262622" : "transparent", color: ch === g ? "#dc2626" : "var(--tx1)", fontSize: 10, cursor: "pointer" }}>{fmt(t("pl_chOf"), g)}</button>)}</div>
          <div style={{ fontSize: 10, color: "var(--tx1)", marginBottom: 8 }}>🔴 {fixos.size} {t("e_fixedN")} · 🔵 {vFilt.length} {t("e_varN")} · {t("e_total")}: {fixos.size + vFilt.length}</div>
          <Btn primary c="#dc2626" onClick={gerarEsp}>{t("e_genEsp")}</Btn>
          {err && <div style={{ fontSize: 10, color: "#f85149", marginTop: 6 }}>{err}</div>}
          {res.length > 0 && (
            <Card style={{ marginTop: 10 }}>
              <div style={{ fontSize: 11, color: "#dc2626", fontWeight: 600, marginBottom: 6 }}>{res.length} {t("pl_bets")}</div>
              {espTot > res.length && <div style={{ fontSize: 9, color: "var(--tx1)", marginBottom: 6 }}>ℹ️ {fmt(t("cap_note"), res.length, espTot.toLocaleString("en-US"))}</div>}
              <div style={{ maxHeight: 320, overflowY: "auto", paddingRight: 4 }}>
                {res.map((a, i) => <div key={i} style={{ display: "flex", gap: 7, alignItems: "center", marginBottom: 2, fontFamily: "monospace", fontSize: 12 }}><span style={{ color: "var(--tx1)", width: 34, flexShrink: 0 }}>#{pad(i + 1)}</span><span style={{ width: 8, height: 8, borderRadius: 2, background: "#dc2626", display: "inline-block", flexShrink: 0 }} /><span style={{ color: "var(--tx0)", letterSpacing: 1.5 }}>{a.map(pad).join(" ")}</span></div>)}
              </div>
              <div style={{ marginTop: 6, fontSize: 9, color: "var(--tx1)" }}>🔴 {t("e_fixed1")} 🔵 {t("e_var1")}</div>
            </Card>
          )}
        </div>
      )}
      {tool === "erre" && (
        <div>
          <STitle c="#ea580c" i="❌">{t("e_erreT")} — {lot.nome}</STitle>
          <Ins passos={[t("e_erreS1"), t("e_erreS2"), t("e_erreS3")]} limites={[fmt(t("e_erMin"), lot.max - lot.bolas), fmt(t("e_restMin"), lot.bolas)]} />
          <Card style={{ marginBottom: 10 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(10,1fr)", gap: 2 }}>
              {range(lot.max).map(n => { const s = errar.has(n); return <button key={n} onClick={() => setErrar(p => { const x = new Set(p); if (x.has(n)) x.delete(n); else x.add(n); return x; })} style={{ aspectRatio: "1", borderRadius: 4, border: `1px solid ${s ? "#f85149" : "var(--bd0)"}`, background: s ? "#f8514922" : "var(--bg0)", color: s ? "#f85149" : "var(--tx1)", fontWeight: s ? 700 : 400, fontSize: 9, cursor: "pointer", textDecoration: s ? "line-through" : "none", display: "flex", alignItems: "center", justifyContent: "center" }}>{pad(n)}</button>; })}
            </div>
            <div style={{ marginTop: 4, fontSize: 10, color: "var(--tx1)" }}>❌ {t("e_miss")} <span style={{ color: "#f85149", fontWeight: 600 }}>{errar.size}</span> · ✅ {t("e_rest")} <span style={{ color: "#3fb950", fontWeight: 600 }}>{lot.max - errar.size}</span></div>
            <div style={{ marginTop: 8 }}><Btn primary c="#ea580c" onClick={gerarErre}>{t("e_genRest")}</Btn></div>
            {err && <div style={{ fontSize: 10, color: "#f85149", marginTop: 6 }}>{err}</div>}
          </Card>
          {resE.length > 0 && (
            <Card>
              <div style={{ fontSize: 11, color: "#ea580c", fontWeight: 600, marginBottom: 6 }}>{resE.length} {fmt(t("e_betsNo"), errar.size)}</div>
              {erreTot > resE.length && <div style={{ fontSize: 9, color: "var(--tx1)", marginBottom: 6 }}>ℹ️ {fmt(t("cap_note"), resE.length, erreTot.toLocaleString("en-US"))}</div>}
              <div style={{ maxHeight: 320, overflowY: "auto", paddingRight: 4 }}>
                {resE.map((a, i) => <div key={i} style={{ display: "flex", gap: 7, alignItems: "center", marginBottom: 2, fontFamily: "monospace", fontSize: 12 }}><span style={{ color: "var(--tx1)", width: 34, flexShrink: 0 }}>#{pad(i + 1)}</span><span style={{ width: 8, height: 8, borderRadius: 2, background: "#3fb950", display: "inline-block", flexShrink: 0 }} /><span style={{ color: "var(--tx0)", letterSpacing: 1.5 }}>{a.map(pad).join(" ")}</span></div>)}
              </div>
              <div style={{ marginTop: 6 }}><Btn onClick={gerarErre} style={{ fontSize: 10 }}>{t("e_more")}</Btn></div>
            </Card>
          )}
        </div>
      )}
      {tool === "diam" && (
        <div>
          <STitle c="#f5c518" i="💎">{t("e_diamT")} — {lot.nome}</STitle>
          <Ins passos={[t("e_diamS1"), t("e_diamS2"), t("e_diamS3")]} limites={[fmt(t("e_nuc"), lot.bolas - 1), t("e_orb2"), t("pl_f50")]} />
          <Card style={{ marginBottom: 6 }}><NumSel nums={nuc} set={setNuc} max={lot.max} cor="#f5c518" label={fmt(t("e_nucL"), lot.bolas - 1)} /></Card>
          <Card style={{ marginBottom: 8 }}><NumSel nums={orb} set={setOrb} max={lot.max} cor="#79c0ff" label={t("e_orbL")} dis={nuc} /></Card>
          <div style={{ fontSize: 10, color: "var(--tx1)", marginBottom: 8 }}>💎 {nuc.size} · 🔵 {oFilt.length} · {t("e_total")}: {nuc.size + oFilt.length} · {t("e_cov")} {cob}%
            <div style={{ background: "var(--bg0)", borderRadius: 3, height: 6, width: 100, overflow: "hidden", display: "inline-block", verticalAlign: "middle", marginLeft: 4 }}><div style={{ width: cob + "%", height: "100%", background: "#f5c518" }} /></div>
          </div>
          <Btn primary onClick={gerarDiam}>{t("e_genDiam")}</Btn>
          {err && <div style={{ fontSize: 10, color: "#f85149", marginTop: 6 }}>{err}</div>}
          {resD.length > 0 && (
            <Card style={{ marginTop: 10 }}>
              <div style={{ fontSize: 11, color: "#f5c518", fontWeight: 600, marginBottom: 6 }}>💎 {resD.length} {t("pl_bets")}</div>
              {diamTot > resD.length && <div style={{ fontSize: 9, color: "var(--tx1)", marginBottom: 6 }}>ℹ️ {fmt(t("cap_note"), resD.length, diamTot.toLocaleString("en-US"))}</div>}
              <div style={{ maxHeight: 320, overflowY: "auto", paddingRight: 4 }}>
                {resD.map((a, i) => <div key={i} style={{ display: "flex", gap: 7, alignItems: "center", marginBottom: 2, fontFamily: "monospace", fontSize: 12 }}><span style={{ color: "var(--tx1)", width: 34, flexShrink: 0 }}>#{pad(i + 1)}</span><span style={{ width: 8, height: 8, borderRadius: 2, background: "#f5c518", display: "inline-block", flexShrink: 0 }} /><span style={{ color: "var(--tx0)", letterSpacing: 1.5 }}>{a.map(pad).join(" ")}</span></div>)}
              </div>
              <div style={{ marginTop: 6, fontSize: 9, color: "var(--tx1)" }}>💎 {t("e_nuc1")} 🔵 {t("e_orb1")}</div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SUBSCRIÇÃO
// ═══════════════════════════════════════════════════════════════
function Sub({ auth, onUp }) {
  const { t, lang } = useT();
  const [ck, setCk] = useState(null);
  const [proc, setProc] = useState(false);
  const [ok, setOk] = useState(null);
  function pagar(p) { setProc(true); setTimeout(() => { onUp(p); setOk(p); setProc(false); setCk(null); }, 1200); }

  if (ok) {
    const p = PLANS.find(x => x.id === ok);
    return (
      <div style={{ textAlign: "center", padding: 28 }}>
        <div style={{ fontSize: 40, marginBottom: 10 }}>🎉</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: "var(--tx0)", marginBottom: 4 }}>{sub_plan_name(p)} {t("sub_done")}</div>
        <div style={{ fontSize: 12, color: "var(--tx1)", marginBottom: 16 }}>{t("sub_unlocked")}</div>
        <Btn primary onClick={() => setOk(null)}>{t("explore")}</Btn>
      </div>
    );
  }
  if (ck) {
    const p = PLANS.find(x => x.id === ck);
    return (
      <div>
        <button onClick={() => setCk(null)} style={{ background: "transparent", border: "none", color: "#58a6ff", cursor: "pointer", fontSize: 12, marginBottom: 10 }}>← {t("back")}</button>
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12, padding: "6px 8px", background: "#6f42c122", borderRadius: 4 }}><span>🔒</span><span style={{ fontSize: 10, color: "#bc8cff" }}>{t("sub_demo")}</span></div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--tx0)", marginBottom: 2 }}>LotteryPro {PLAN_NAMES[p.id]}</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: p.cor, marginBottom: 16 }}>{p.preco}<span style={{ fontSize: 11, fontWeight: 400, color: "var(--tx1)" }}>{perTxt(lang, p.perKey)}</span></div>
          <Campo l={t("sub_card")} v="4242 4242 4242 4242" set={() => { }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}><Campo l={t("sub_valid")} v="12/27" set={() => { }} /><Campo l={t("sub_cvc")} v="123" set={() => { }} /></div>
          <Btn primary c="#6f42c1" onClick={() => pagar(ck)} disabled={proc} style={{ width: "100%" }}>{proc ? t("sub_proc") : t("sub_pay") + " " + p.preco + perTxt(lang, p.perKey)}</Btn>
        </Card>
      </div>
    );
  }
  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--tx0)", marginBottom: 3 }}>{t("sub_plans")}</div>
        <div style={{ fontSize: 11, color: "var(--tx1)" }}>{t("sub_current")} <span style={{ color: "#f5c518", fontWeight: 600 }}>{PLAN_NAMES[auth ? auth.plano : "gratuito"]}</span></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 10 }}>
        {PLANS.map(p => {
          const at = p.id === (auth ? auth.plano : "gratuito");
          const inf = NIV[p.id] < NIV[auth ? auth.plano : "gratuito"];
          return (
            <div key={p.id} style={{ background: "var(--bg1)", border: `${at ? "2px" : "1px"} solid ${at ? p.cor : "var(--ovB)"}`, borderRadius: 8, padding: "12px 8px", textAlign: "center", position: "relative" }}>
              {at && <div style={{ position: "absolute", top: -9, left: "50%", transform: "translateX(-50%)", background: p.cor, color: p.tc || "#fff", fontSize: 8, fontWeight: 700, padding: "1px 8px", borderRadius: 10 }}>{t("sub_actual")}</div>}
              <div style={{ fontSize: 12, fontWeight: 700, color: p.cor, marginBottom: 4 }}>{PLAN_NAMES[p.id]}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "var(--tx0)" }}>{p.preco}</div>
              <div style={{ fontSize: 9, color: "var(--tx1)", marginBottom: 8 }}>{perTxt(lang, p.perKey)}</div>
              <div style={{ textAlign: "left" }}>
                {p.okKeys.map(f => <div key={f} style={{ fontSize: 9, color: "#3fb950", marginBottom: 1 }}>✓ {t(f)}</div>)}
                {p.lockKeys.map(f => <div key={f} style={{ fontSize: 9, color: "var(--tx3)", marginBottom: 1 }}>✗ {t(f)}</div>)}
              </div>
              {!at && !inf && <button onClick={() => setCk(p.id)} style={{ marginTop: 8, width: "100%", padding: "5px 0", borderRadius: 5, background: p.id === "gratuito" ? "transparent" : p.cor, color: p.id === "gratuito" ? p.cor : (p.tc || "#fff"), border: `1px solid ${p.cor}`, fontWeight: 700, fontSize: 10, cursor: "pointer" }}>{t("sub_sub")}</button>}
              {(at || inf) && <div style={{ marginTop: 8, fontSize: 10, color: "var(--tx3)", padding: "5px 0" }}>{at ? t("sub_actual") : t("sub_incl")}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
function sub_plan_name(p) { return PLAN_NAMES[p.id]; }

// ═══════════════════════════════════════════════════════════════
// APP PRINCIPAL
// ═══════════════════════════════════════════════════════════════
function AppInner() {
  const { t } = useT();
  const [auth, setAuth] = useState(null);
  const [tela, setTela] = useState("welcome");
  const [carregando, setCarregando] = useState(true);
  const [sec, setSec] = useState("home");
  const [lotId, setLotId] = useState("lotto");
  const [saved, setSaved] = useState([]);
  const [flags, setFlags] = useState({ smart: false, numero: false });
  const [limit, setLimit] = useState(0);

  // Lê o perfil (plano) da base de dados para um utilizador.
  async function carregarPerfil(user) {
    let plano = "gratuito";
    try {
      const { data } = await supabase.from("profiles").select("plan,is_premium").eq("id", user.id).single();
      if (data) {
        if (data.plan === "basico" || data.plan === "premium") plano = data.plan;
        else if (data.is_premium) plano = "premium";
      }
    } catch (e) { /* sem perfil ainda: fica gratuito */ }
    const nome = (user.user_metadata && user.user_metadata.nome) || (user.email ? user.email.split("@")[0] : "Utilizador");
    return { nome, email: user.email, plano, id: user.id };
  }

  // Ouve a sessão do Supabase (entrar/sair) e mantém o auth atualizado.
  useEffect(() => {
    let vivo = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!vivo) return;
      if (data && data.session) { const a = await carregarPerfil(data.session.user); if (vivo) { setAuth(a); setTela("app"); } }
      if (vivo) setCarregando(false);
    });
    const { data: ouvinte } = supabase.auth.onAuthStateChange(async (_evento, session) => {
      if (!vivo) return;
      if (session) {
        const a = await carregarPerfil(session.user);
        if (!vivo) return;
        setAuth(a);
        setTela(prev => (prev === "welcome" || prev === "login" || prev === "reg") ? "app" : prev);
        setSec("home");
      } else {
        setAuth(null);
        setTela("welcome");
      }
    });
    return () => { vivo = false; if (ouvinte && ouvinte.subscription) ouvinte.subscription.unsubscribe(); };
  }, []);

  function pode(p) { return auth && NIV[auth.plano] >= NIV[p]; }
  async function logout() { await supabase.auth.signOut(); }
  function upgrade(p) { setAuth(a => ({ ...a, plano: p })); } // temporário, para testar; o real vem com o Stripe

  if (carregando) return <div style={{ background: "var(--bg0)", borderRadius: 12, padding: "60px 20px", textAlign: "center" }}><div style={{ fontWeight: 800, fontSize: 22 }}><span style={{ color: "#FFD700" }}>Lottery</span><span style={{ color: "var(--tx0)" }}>Pro</span></div><div style={{ marginTop: 10, fontSize: 12, color: "var(--tx1)" }}>…</div></div>;
  if (tela === "welcome") return <Welcome onL={() => setTela("login")} onR={() => setTela("reg")} onGuest={() => setTela("guest")} />;
  if (tela === "login") return <Login onReg={() => setTela("reg")} />;
  if (tela === "reg") return <Reg onLog={() => setTela("login")} />;
  if (tela === "guest") return (
    <div style={{ background: "var(--bg0)", borderRadius: 12, overflow: "hidden", fontFamily: "var(--font-sans)" }}>
      <div style={{ background: "var(--bg1)", borderBottom: "1px solid var(--ovB)", padding: "8px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
        <div style={{ fontWeight: 800, fontSize: 16 }}><span style={{ color: "#FFD700" }}>Lottery</span><span style={{ color: "var(--tx0)" }}>Pro</span></div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ThemeToggle /><LangDrop compact />
          <Btn primary onClick={() => setTela("reg")} style={{ fontSize: 11 }}>{t("w_create")}</Btn>
          <button onClick={() => setTela("welcome")} style={{ padding: "3px 8px", borderRadius: 4, border: "1px solid var(--bd0)", background: "transparent", color: "var(--tx1)", cursor: "pointer", fontSize: 10 }}>← {t("back")}</button>
        </div>
      </div>
      <div style={{ padding: 12, maxHeight: 560, overflowY: "auto" }}><Home /></div>
      <div style={{ background: "var(--bg1)", borderTop: "1px solid var(--ovR)", padding: "6px 12px", textAlign: "center", fontSize: 9, color: "var(--tx3)" }}>{t("foot")}</div>
    </div>
  );

  const nav = [{ id: "home", l: t("nav_res"), i: "🏠", p: null }, { id: "strat", l: t("nav_str"), i: "♟️", p: "basico" }, { id: "numer", l: t("nav_num"), i: "🔮", p: "basico" }, { id: "plan", l: t("nav_pl"), i: "📊", p: "basico" }, { id: "my", l: t("nav_my"), i: "💾", p: "basico" }, { id: "esp", l: t("nav_esp"), i: "", p: "premium" }, { id: "more", l: t("nav_extra"), i: "✨", p: null }, { id: "sub", l: t("nav_sub"), i: "💎", p: null }];
  const corP = { gratuito: "#6b7280", basico: "#1a56db", premium: "#FFD700" };

  return (
    <div style={{ background: "var(--bg0)", borderRadius: 12, overflow: "hidden", fontFamily: "var(--font-sans)" }}>
      <div style={{ background: "var(--bg1)", borderBottom: "1px solid var(--ovB)", padding: "8px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
        <div style={{ fontWeight: 800, fontSize: 16 }}><span style={{ color: "#FFD700" }}>Lottery</span><span style={{ color: "var(--tx0)" }}>Pro</span></div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ThemeToggle />
          <LangDrop compact />
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 24, height: 24, borderRadius: "50%", background: corP[auth.plano] + "33", border: `1px solid ${corP[auth.plano]}66`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: corP[auth.plano] }}>{auth.nome.charAt(0).toUpperCase()}</div>
            <div><div style={{ fontSize: 11, fontWeight: 600, color: "var(--tx0)", lineHeight: 1.1 }}>{auth.nome}</div><div style={{ fontSize: 9, color: corP[auth.plano], fontWeight: 600 }}>{PLAN_NAMES[auth.plano]}</div></div>
          </div>
          <button onClick={logout} style={{ padding: "3px 8px", borderRadius: 4, border: "1px solid var(--bd0)", background: "transparent", color: "var(--tx1)", cursor: "pointer", fontSize: 10 }}>{t("btn_out")}</button>
        </div>
      </div>
      <div style={{ background: "var(--bg1)", borderBottom: "1px solid var(--ovB)", padding: "1px 8px", display: "flex", gap: 1, flexWrap: "wrap" }}>
        {nav.map(n => { const bl = n.p && !pode(n.p); return <button key={n.id} onClick={() => setSec(n.id)} style={{ padding: "6px 7px", fontSize: 10, cursor: "pointer", border: "none", background: sec === n.id ? "#f5c51818" : "transparent", color: sec === n.id ? "#FFD700" : "var(--tx1)", fontWeight: sec === n.id ? 700 : 400, display: "flex", alignItems: "center", gap: 2 }}>{n.i && <span>{n.i}</span>}{n.l}{bl && <span style={{ fontSize: 7, opacity: 0.5 }}>🔒</span>}</button>; })}
      </div>
      <div style={{ padding: 12, maxHeight: 560, overflowY: "auto" }}>
        {sec === "home" && <Home />}
        {sec === "strat" && <LockBox blocked={!pode("basico")} plan="Basic" onUp={() => setSec("sub")}><Strategy lotId={lotId} setLot={setLotId} /></LockBox>}
        {sec === "numer" && <LockBox blocked={!pode("basico")} plan="Basic" onUp={() => setSec("sub")}><Numer onNumero={() => setFlags(f => ({ ...f, numero: true }))} /></LockBox>}
        {sec === "plan" && <LockBox blocked={!pode("basico")} plan="Basic" onUp={() => setSec("sub")}><Plan lotId={lotId} setLot={setLotId} /></LockBox>}
        {sec === "my" && <LockBox blocked={!pode("basico")} plan="Basic" onUp={() => setSec("sub")}><MyGames lotId={lotId} setLot={setLotId} saved={saved} setSaved={setSaved} flags={flags} setFlags={setFlags} limit={limit} /></LockBox>}
        {sec === "more" && <MoreHub lotId={lotId} setLot={setLotId} saved={saved} limit={limit} setLimit={setLimit} />}
        {sec === "esp" && <LockBox blocked={!pode("premium")} plan="Premium" onUp={() => setSec("sub")}><PlanEsp lotId={lotId} setLot={setLotId} /></LockBox>}
        {sec === "sub" && <Sub auth={auth} onUp={p => { upgrade(p); setSec("home"); }} />}
      </div>
      <div style={{ background: "var(--bg1)", borderTop: "1px solid var(--ovB)", padding: "6px 12px", textAlign: "center", fontSize: 9, color: "var(--tx3)" }}>{t("foot")}</div>
    </div>
  );
}

export default function LotteryPro() {
  const [lang, setLang] = useState(detectLang());
  const [theme, setTheme] = useState("dark");
  const [live, setLive] = useState(null);
  useEffect(() => {
    let vivo = true;
    fetch(RESULTS_URL)
      .then(r => r.json())
      .then(d => { if (vivo && d && d.ok) setLive(d.resultados); })
      .catch(() => { /* servidor em baixo ou bloqueado: ficamos com os exemplos */ });
    return () => { vivo = false; };
  }, []);
  const pal = THEMES[theme] || THEMES.dark;
  const value = { lang, setLang, t: makeT(lang), theme, setTheme };
  const vars = { "--bg0": pal.bg0, "--bg1": pal.bg1, "--bg2": pal.bg2, "--tx0": pal.tx0, "--tx1": pal.tx1, "--tx2": pal.tx2, "--tx3": pal.tx3, "--bd0": pal.bd0, "--ovB": pal.ovB, "--ovR": pal.ovR };
  return (
    <I18nContext.Provider value={value}>
      <LiveContext.Provider value={{ live }}>
        <div style={vars}>
          <AppInner />
        </div>
      </LiveContext.Provider>
    </I18nContext.Provider>
  );
}
