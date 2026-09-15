# Checklist: por que rechazan un Build Award / grant en panel review

> Generalizado de un rechazo real (Periplo, SCF #45, verbatim en
> `landscape/periplo-scf45-rejection-verbatim.md` si se copia aqui, o
> referenciado desde RFP1). Aplica a cualquier submission de
> grant/accelerator/RFP, no solo SCF -- correr esto contra el draft
> antes de enviar.

1. **Bus factor de un solo ingeniero es motivo de rechazo aunque el
   codigo se elogie sin reservas.** El panel dijo textualmente que la
   parte tecnica era solida y aun asi rechazo por riesgo de entrega de
   un solo punto de falla. Cada submission necesita 2+ ingenieros con
   scope real y verificable, o una mitigacion explicita y creible --
   no una frase suelta.
2. **Cada deliverable que el programa nombra en su propio scope tiene
   que aparecer como su propia linea, no implicito dentro de otra.** El
   revisor compara la submission contra la lista literal del programa,
   no contra el espiritu del pitch.
3. **Lineas de presupuesto compuestas (que mezclan tipos distintos de
   deliverable) leen mas debil que lineas separadas.** Cada linea debe
   tener su propio criterio de completitud verificable sin cruzar
   referencias con otras.
4. **Detalles operativos de mainnet (custodia de llaves, rotacion,
   alertas) tienen que ser una condicion de gate explicita en el
   tranche correspondiente, no solo descripcion en una seccion de
   infraestructura.** Describir infraestructura y condicionar un
   tranche a ella son cosas distintas para un revisor.
5. **"Record de submissions este round" es framing real del panel, no
   solo consuelo -- pero no excusa saltarse los primeros 4 puntos.**

## Para Afterbell (Stocklana bounty)

Afterbell ya tiene equipo de 2 con scope real y verificable (ambos con
acceso completo al mismo repo e historial de commits) -- el punto 1 (bus
factor) aplica menos duro que en un proyecto de un solo ingeniero, pero
sigue habiendo que nombrarlo explicito en la submission
("equipo de 2, ambos con acceso al código"), no asumir que se
sobreentiende. Punto 2 (una linea por deliverable) ya esta cubierto en
`docs/SUBMISSION-draft.md`. Correr los 5 puntos contra el draft antes de
enviarlo, sin excepcion.
