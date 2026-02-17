import React, { useRef, useState } from "react";

function Demo() {
  
  let normalVar=0;
  const refVal=useRef(0);
  const [count,setCount]=useState(0);
  return <div>
    <div style={{marginTop:"100px"}}>
      hello
      <p>Normal Variable : {normalVar}</p>
      <p>Ref Variable : {refVal.current}</p>
      <p>State Variable : {count}</p>
     <button onClick={()=>{
      normalVar++;
      refVal.current++;
      setCount(count+1);  

     }}>Click</button>
    </div>
  </div>;
}

export default Demo;
