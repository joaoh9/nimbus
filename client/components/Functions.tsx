import React, { useEffect, useState } from 'react';
import Function from './Function'
import { v4 as uuidv4 } from 'uuid';

// Component to fetch all functions metrics and display them
const Functions = () => {
  const [funcMetrics, setFuncMetrics] = useState({})
  // Grab each functions metrics when the component mounts
  const grabFuncsMetrics = async() => {
    let response;
    response = await fetch('/dashboard/funcmetrics', {
      method: 'GET',
      headers: {
        'Content-Type': 'Application/JSON',
        authorization: `BEARER ${localStorage.getItem('accessToken')}`,
      },
    })
    response = await response.json()
    setFuncMetrics(response.eachFuncMetrics)
  }

  // Grab functions metrics when the component mounts
  useEffect(() => {
    grabFuncsMetrics()    
  }, [])  

  // Display table head and each function metrics component
  return (
    <div className="w-[100%] overflow-auto">
      <table className="table w-[100%] mx-6">
        <thead className="w-[100%]">
          <tr className="w-[100%]">
            <th className="bg-primary text-center w-[20%]">Lambda Function</th>
            <th className="bg-primary text-center w-[20%]">Invocations</th>
            <th className="bg-primary text-center w-[20%]">Errors</th>
            <th className="bg-primary text-center w-[20%]">Throttles</th>
            <th className="bg-primary text-center w-[20%]">Duration (ms)</th>
          </tr>
        </thead>
        <tbody className="w-[100%]">
          {/* Update the funcMetric parameter type */}
          {Object.entries(funcMetrics).map((funcMetric:any) => (
              <Function key={uuidv4()} 
                funcName={funcMetric[0]}
                invocations={funcMetric[1].invocations}
                errors={funcMetric[1].errors}
                throttles={funcMetric[1].throttles}
                duration={funcMetric[1].duration}/>
          ))}
        </tbody>
      </table>
    </div>
  )
};

export default Functions;
