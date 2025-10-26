export function contarTrocas(lista: (null | number)[]) {
  let trocas = 0

  for (let i = 1; i < lista.length; i++) {
    if (lista[i] !== lista[i - 1]) {
      trocas++
    }
  }

  return trocas
}
