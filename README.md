# Afterbell

Agente autónomo que opera una canasta chica de acciones tokenizadas (xStocks / Backpack Securities)
específicamente en horario after-hours, y lanza un token pareado a una de esas acciones vía un pool
de Meteora Dynamic Bonding Curve. Construido para el bounty combinado de Stocklana (Solana Foundation):
Best Use of Meteora DBC + Stocknized Agent on Clawpump. Deadline: viernes 18 de sept 2026, 4:00pm ET.

**No administramos fondos de terceros.** Este es un agente autónomo que opera su propia canasta con
capital del equipo, en una demo en vivo. No es un producto de gestión de portafolios.

## Estado (día 1)

- [x] Scaffold del proyecto + investigación de la SDK real de Meteora DBC.
- [x] Wallet del equipo generada (`secrets/team-wallet.json`, gitignored). Pubkey: ver abajo.
- [x] Script de lanzamiento del pool (`packages/agent/src/scripts/02-launch-pool.ts`) escrito,
      tipado correctamente contra la SDK instalada, con dry-run/simulación por defecto.
- [ ] **Bloqueado en ti:** fondear la wallet del equipo con SOL en mainnet.
- [ ] **Bloqueado en ti:** crear API key de Clawpump en clawpump.tech/dashboard/api (requiere
      conectar wallet en el navegador -- no lo puedo hacer yo).
- [ ] Ejecutar el lanzamiento real (`--send`) una vez fondeada la wallet.
- [ ] Lógica del agente (detección after-hours, rebalanceo) -- día 1-2.
- [ ] Dashboard mínimo -- día 2-3.

## Decisión de arquitectura: Clawpump + Meteora

La documentación pública de Clawpump (`clawpump.tech/docs`, revisada sept 2026) no expone un
parámetro de quote-mint personalizado en sus endpoints de lanzamiento (`launch_token`,
`launch_token_self_funded`, `launch_metaplex_genesis_token`, `launch_pons`) -- todos son
SOL-denominados o de suministro fijo en otra chain. El pool stock-paired se construye directamente
con la SDK de Meteora DBC (`@meteora-ag/dynamic-bonding-curve-sdk`), pareado contra AAPLx. Confirmé
en cadena que AAPLx ya tiene un token badge en Meteora (otros launchpads como StockLaunch y Ember ya
lo usan como quote mint), así que el pool es viable sin pasos adicionales de whitelisting.

El lado "using clawpump" del bounty se cumple registrando este agente en el Agent MCP de Clawpump
(`packages/agent/src/lib/clawpump.ts`) -- wallet propia provista por Clawpump, separada de la wallet
del equipo que es dueña del pool DBC. Documentar esta división explícitamente en el submission.

## Quote mint: AAPLx (Apple xStock)

- Mint: `XsbEhLAtcf6HdfpFZ5xEMdqW8nfAvcsP5bdudRLJzJp`
- Token-2022, 8 decimales, ~$332 USD (sept 2026), ~$400K liquidez combinada en Raydium/Orca.
- Token badge de Meteora DBC ya existe on-chain para este mint (verificado con `01-check-quote-mint.ts`).

## Estructura

```
packages/agent/
  src/lib/        # conexión RPC, wallet, direcciones de xStocks, integración Clawpump
  src/scripts/    # 00 genera wallet, 01 valida quote mint (solo lectura), 02 lanza el pool
secrets/          # wallet keypair del equipo -- gitignored, nunca commitear
```

## Próximos pasos inmediatos

1. Fondea `secrets/team-wallet.json` (pubkey impreso al correr `00-generate-wallet.ts`) con SOL real.
2. Corre `npx tsx src/scripts/02-launch-pool.ts` (dry-run) para revisar la simulación.
3. Con tu aprobación explícita del monto y la simulación, corre con `--send` para lanzar en mainnet real.
4. Documenta el hash de la transacción y el link al pool -- esa es la evidencia dura del submission.
