import Head from "next/head"

export default function Home ({ data }) {

  const enter = () => {
    if (typeof window != "undefined") {
      if (document.getElementById("who")?.value != "" && document.getElementById("exam")?.value) {
        var cars = document.getElementById("exam")?.value.split(",")
        var id = cars[0]
        var status = cars[1]
        var duration = cars[2]
        var no = cars[3]
        var index = cars[4]
        var cat = data.testControls.edges[index].node.categories.nodes[0].name
        if (status === "true") {
          window.location.href = "/exam?id="+id+"&user="+document.getElementById("who")?.value+"&duration="+duration+"&no="+no+"&cat="+cat+""
        }
        else {
          document.querySelector(".notstart")?.classList.remove("hidden")
        }
      }
      else {
        document.querySelector(".fill")?.classList.remove("hidden")
      }
    }
  }

  return(
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-black">
      <Head>
        <title>Hmcs TestHUB</title>
        <link rel="icon" href="/logo.png" />
      </Head>
      <div className="space-y-2.5">
        <h1 className="text-3xl font-bold text-center text-white sm:text-6xl">Hmcs Test<span className="text-red-500">HUB</span></h1>
        {
          data.testControls.edges.length > 0  ? (
            <div className="space-y-2.5 px-4 sm:px-0">
              <input type="text" placeholder="Enter your full name" className="w-full p-2.5 rounded-lg outline-none" id="who" />
              <select id="exam" className="w-full p-2.5 rounded-lg outline-none">
                      {
                        data.testControls.edges.map(
                          (info, index) => (
                            <option key={info.node.id}
                              value={info.node.id+","+info.node.testControlFields.startExam+","+info.node.testControlFields.duration+","+info.node.testControlFields.numberOfQuestions+","+index}>
                              {
                                info.node.testControlFields.testName
                              }
                            </option>
                          )
                        )
                      } 
              </select>
              <button className="text-white bg-red-500 w-full p-2.5 rounded-lg" onClick={enter}>Enter session</button>
              <p className="hidden text-red-500 notstart">This exam have not started yet, reload when the teacher tells you the exam have started</p>
              <p className="hidden text-red-500 fill">Please fill in all details</p>
            </div>
          ) : <h1 className="px-4 text-lg text-center text-white sm:text-2xl">No sessions are currently going on please come back later</h1>
        }
      </div>
    </div>
  )
}

export async function getStaticProps() {
    const result = await fetch('http://hmcs.online/graphql', {
      method: 'POST',
      headers: { 'Content-Type' : 'application/json' },
      body: JSON.stringify({
        query: `
          query NewQuery {
            testControls {
              edges {
                node {
                  id
                  testControlFields {
                    testName
                    duration
                    numberOfQuestions
                    startExam
                  }
                  categories {
                    nodes {
                      name
                    }
                  }
                }
              }
            }
          }
        `
      })
    })
  const data = await result?.json()
  return {
    props: {
      data: data.data,
    }
  }
}