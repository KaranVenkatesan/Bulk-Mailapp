import { useState } from "react"
import axios from "axios";
import * as XLSX from "xlsx"

function App() {

  const [msg, setmsg] = useState("")
  const [status, setstatus] = useState(false)
  const [emailList, setEmailList] = useState([])

  function handlemsg(evt) 
  {
    setmsg(evt.target.value)
  }

  function handlefile(event) {
    const file = event.target.files[0]
    console.log(file)

    const reader = new FileReader()

    reader.onload = function (evt) {
      const data = evt.target.result
      const workbook = XLSX.read(data, { type: 'binary' })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const emailList = XLSX.utils.sheet_to_json(worksheet, { header: 'A' });
      const totalemail = emailList.map(function(item) {return item.A})
        console.log(totalemail)
        setEmailList(totalemail)
    }

    reader.readAsBinaryString(file) 
  }

  function send() {
    setstatus(true)
    axios.post("https://bulk-mailapp-server-a4ctnrb7s-karanvenkatesans-projects.vercel.app/sendemail", { msg:msg,emailList:emailList })
    .then(function (data) {
      if (data.data === true) {
        alert("Email Sent Successfully 😁")
        setstatus(false)
      }
      else {
        alert("Failed 😑")
      }
    })
  
  }
  return (
    <div>
      <div className="bg-blue-900 text-white text-center">
        <h1 className="text-2xl font-medium px-5 py-3 ">BulkMail</h1>
      </div>

      <div className="bg-blue-800 text-white text-center">
        <h1 className=" font-medium px-5 py-3 ">We can help your business with sending multiple emails at once</h1>
      </div>

      <div className="bg-blue-600 text-white text-center">
        <h1 className=" font-medium px-5 py-3 ">Drag and Drop</h1>
      </div>

      <div className="bg-blue-400 flex flex-col items-center  text-black px-5 py-3">
        <textarea onChange={handlemsg} value={msg} className="w-[80%] h-32 py-2 outline-none px-3 border border-black rounded-md" placeholder="Enter email text..."></textarea>

        <div>
          <input type="file" onChange={handlefile} className="border-4 border-dashed py-4 px-4 mt-5 mb-5 " />

        </div>
        <p>Total Email in the file : {emailList.length} </p>

        <button onClick={send} className="bg-blue-900 py-2 px-2 text-white font-medium rounded-md w-fit">{status ? "Sending..." : "Send"}</button>
      </div>

      <div className="bg-blue-300 text-white text-center py-14">

      </div>

      <div className="bg-blue-200 text-white text-center py-12">

      </div>



    </div>
  );
}

export default App;