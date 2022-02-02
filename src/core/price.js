export async function getPrice() {
  return await fetch('https://api.unisx.xyz/prices/uSPAC10')
    .then(resp => resp.json())
    .then(resp => resp.price)
}
