// "use client"
// import { useEffect } from "react"
// import useUserStore from "@/stores/user"

// import init from "@/actions/init"

// import { getUser } from "@/utils/client/get-user"

export default function AppInitialiser({ children }: { children: React.ReactNode }) {

//   useEffect(() => {
//     async function start() {
//       const user = await getUser()
//       if (user) {
//         init()
//       }
//     }
//     start()
//   }, [])

  return (
    children
  )
}
