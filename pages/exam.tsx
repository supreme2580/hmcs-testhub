import Head from "next/head"
import Image from "next/image"

export default function Exam ({ id, user, duration, no, data, cat }) {
    
    const shuffle = array => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array
      }
      const info = array => {
        return shuffle(array).slice(0, no)
      }
    function countdown (duration) {
        var month = new Date().getUTCMonth()
        var monthWords;
                switch (month + 1) {
            case 1:
                monthWords = "Jan"
                break;
            case 2:
                monthWords = "Feb"
                break;
            case 3:
                monthWords = "Mar"
                break;
            case 4:
                monthWords = "Apr"
                break;
            case 5:
                monthWords = "May"
                break;
            case 6:
                monthWords = "Jun"
                break;
            case 7:
                monthWords = "Jul"
                break;
            case 8:
                monthWords = "Aug"
                break;
            case 9:
                monthWords = "Sep"
                break;
            case 10:
                monthWords = "Oct"
                break;
            case 11:
                monthWords = "Nov"
                break;
            case 12:
                monthWords = "Dec"
                break;
            default:
                break;
        }
        var day = new Date().getUTCDate()
        var year = new Date().getFullYear()
        var hrs
        if (new Date().getHours() == 0) {hrs = Number(duration)} else {hrs = Number(duration) + Number(new Date().getHours())}
        var mins = Number((hrs * 60 * 60) % 60) + Number(new Date().getMinutes())
        var date = monthWords+" "+day+", "+year+" "+hrs+":"+mins+":00"
        // Set the date we're counting down to
        var countDownDate = new Date(date).getTime();

        // Update the count down every 1 second
        var x = setInterval(function() {

        // Get today's date and time
        var now = new Date().getTime();
            
        // Find the distance between now and the count down date
        var distance = countDownDate - now;
            
        // Time calculations for days, hours, minutes and seconds
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Output the result in an element with id="demo"
        document.getElementById("countdown").innerHTML = hours + "h " + minutes + "m " + seconds + "s ";
            
        // If the count down is over, write some text 
        if (distance < 0) {
            clearInterval(x);
            document.getElementById("countdown").innerHTML = "TIME'S UP";
        }
        }, 1000);
    }
    countdown(duration)
    return(
        <div>
            <Head>
                <title>Hmcs TestHUB</title>
                <link rel="icon" href="/logo.png" />
            </Head>
            <div>
                <nav className="flex flex-row items-center justify-between w-full h-16 px-2.5 shadow-md sm:px-10 ">
                    <h1 className="text-lg font-semibold sm:text-2xl">Test<span className="text-red-500">Hub</span></h1>
                    <h1 className="text-lg font-semibold text-end sm:text-2xl flex"><div id="countdown"></div></h1>
                    <h1 className="text-lg font-semibold sm:text-2xl text-end">{user}</h1>
                </nav>
                <div className="w-full flex justify-center">
                    <div className="p-2 w-full mx-4 md:mx-0 md:max-w-2xl mt-2.5 space-y-4">
                        {
                            info(data.nodes).map((quest, index) => (
                                <div key={Math.random()}>
                                    <h1 className="text-xl font-semibold">{Number(index + 1)})</h1>
                                    <div className="flex justify-center"><Image src="/logo.png" width={350} height={250} alt="Network error" /></div>
                                    <h1 className="text-center text-2xl">Blah blah blah</h1>
                                    <form className="font-2xl">
                                        <div><input type="radio" value="A" name="a" />Ladaa</div>
                                        <div><input type="radio" value="B" name="a" />Ladaa</div>
                                        <div><input type="radio" value="C" name="a" />Ladaa</div>
                                        <div><input type="radio" value="D" name="a" />Ladaa</div>
                                    </form>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className="flex justify-center"><button className="bg-red-500 p-2.5 text-center w-full max-w-2xl text-white font-semibold my-2.5 rounded-full mx-4 md:mx-0">Submit</button></div>
            </div>
        </div>
    )
}

export async function getServerSideProps(context) {
    const id = context.query.id
    const user = context.query.user
    const duration = context.query.duration
    const no = context.query.no
    const category = context.query.cat
    const result = await fetch('http://hmcs.online/graphql', {
        method: 'POST',
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify({
          query: `
            query NewQuery {
                allQuestionBank(where: {categoryName: "${category}"}) {
                nodes {
                    questionBankFields {
                            answer
                            fieldGroupName
                            optionA
                            optionB
                            optionC
                            optionD
                            question
                            image {
                              link
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
            id: id,
            user: user,
            duration: duration,
            no: no,
            data: data.data.allQuestionBank,
            cat: category
        }
    }
}