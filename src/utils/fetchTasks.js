import hexToBase64 from './hexToBase64'

export default function fetchTasks(user) {
  const query = {
    v: 3,
    q: {
      find: {
        '$and': [
          {
            'out.tape.cell': {
              '$elemMatch': {
                i: 0,
                s: process.env.BITCOM
              }
            }
          },
          {
            'out.tape.cell': {
              '$elemMatch': {
                i: 1,
                b: hexToBase64(user.publicKey)
              }
            }
          },
          {
            'out.tape.cell.s': { '$ne': 'NULL' }
          }
        ]
      }
    }
  }

  return fetch(
    `https://bob.planaria.network/q/1GgmC7Cg782YtQ6R9QkM58voyWeQJmJJzG/${btoa(JSON.stringify(query))}`,
    {
      headers: {
        key: user.address
      }
    }
  )
    .then(response => response.json())
    .then(data => {
      const confirmed = data.c
        .flatMap(d => d.out
          .flatMap(o => o.tape
            .filter(t => t.cell[0].s === process.env.BITCOM)
            .flatMap(t => Object.assign({ id: t.cell[2].s, updatedAt: d.blk.t * 1000 }, JSON.parse(t.cell[3].s)))
          )
        )
      const unconfirmed = data.u
        .flatMap(d => d.out
          .flatMap(o => o.tape
            .filter(t => t.cell[0].s === process.env.BITCOM)
            .flatMap(t => Object.assign({ id: t.cell[2].s, updatedAt: Date.now() }, JSON.parse(t.cell[3].s)))
          )
        )

      const all = [...confirmed, ...unconfirmed]
        .sort((a, b) => b.updatedAt - a.updatedAt)
        .filter((task, idx, array) => idx === array.findIndex(t => t.id === task.id) && task.status > -1)

      return all
    })
}
